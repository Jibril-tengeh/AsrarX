import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFeatures } from '../contexts/FeatureContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Lock, Sparkles, ShieldAlert, X, Copy, Download, Camera, ShieldBan } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  isScreenshotBlocked, 
  isTextCopyBlocked, 
  getScreenshotProtectionMode, 
  getTextCopyProtectionMode,
  setScreenProtection,
  setTextCopyProtection,
  showWarningToast
} from '../utils/antiScreenshot';

export const triggerProtectionModal = (action: 'download' | 'copy' | 'select' | 'screenshot' | 'general' = 'general') => {
  window.dispatchEvent(new CustomEvent('asrarhub:protection_triggered', { detail: { action } }));
};

export const ContentProtectionManager: React.FC = () => {
  const { isPremium } = useAuth();
  const { featureToggles } = useFeatures();
  const { t } = useLanguage();

  const [modalState, setModalState] = useState<{ open: boolean; action: string }>({
    open: false,
    action: 'general',
  });

  const screenBlocked = isScreenshotBlocked(featureToggles, isPremium);
  const copyBlocked = isTextCopyBlocked(featureToggles, isPremium);
  const screenMode = getScreenshotProtectionMode(featureToggles);
  const copyMode = getTextCopyProtectionMode(featureToggles);

  // Synchronize screen & copy protection state in realtime
  useEffect(() => {
    setScreenProtection(screenBlocked);
    setTextCopyProtection(copyBlocked);
  }, [screenBlocked, copyBlocked]);

  // Listen for programmatic protection triggers from tools or components
  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const customEv = e as CustomEvent<{ action: string }>;
      const requestedAction = customEv.detail?.action || 'general';

      // Check if the requested action is actually blocked for this user
      if (requestedAction === 'copy' || requestedAction === 'select') {
        if (!copyBlocked) return; // Copy is allowed, don't show modal
      }
      if (requestedAction === 'screenshot') {
        if (!screenBlocked) return; // Screenshot is allowed, don't show modal
      }
      if (requestedAction === 'download' && isPremium) {
        return;
      }

      setModalState({ open: true, action: requestedAction });
    };

    window.addEventListener('asrarhub:protection_triggered', handleTrigger);
    return () => window.removeEventListener('asrarhub:protection_triggered', handleTrigger);
  }, [copyBlocked, screenBlocked, isPremium]);

  // Event interception for Copy / Cut / ContextMenu / Keyboard Shortcuts
  useEffect(() => {
    const isInputOrTextarea = (target: EventTarget | null) => {
      if (!target) return false;
      const el = target as HTMLElement;
      const tagName = el.tagName?.toLowerCase();
      return (
        tagName === 'input' ||
        tagName === 'textarea' ||
        el.isContentEditable ||
        el.closest('input') !== null ||
        el.closest('textarea') !== null ||
        el.closest('.selectable-text') !== null
      );
    };

    // 1. Copy / Cut Interception
    const handleCopyCut = (e: ClipboardEvent) => {
      if (!copyBlocked) return;
      if (isInputOrTextarea(e.target)) return;

      e.preventDefault();
      e.stopPropagation();
      setModalState({ open: true, action: 'copy' });
    };

    // 2. Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      if (!copyBlocked) return;
      if (isInputOrTextarea(e.target)) return;

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('.prose') ||
          target.closest('.article-content') ||
          target.closest('.tool-content') ||
          target.closest('.spiritual-card') ||
          target.closest('.mystic-content') ||
          target.closest('article') ||
          target.tagName === 'IMG' ||
          target.tagName === 'CANVAS' ||
          target.tagName === 'SVG' ||
          target.tagName === 'P' ||
          target.tagName === 'SPAN')
      ) {
        e.preventDefault();
        setModalState({ open: true, action: 'copy' });
      }
    };

    // 3. Image Drag
    const handleDragStart = (e: DragEvent) => {
      if (!copyBlocked && !screenBlocked) return;
      if (isInputOrTextarea(e.target)) return;

      e.preventDefault();
      setModalState({ open: true, action: 'download' });
    };

    // 4. Keyboard Shortcuts Interception (Ctrl+C, Ctrl+X, Ctrl+S, Ctrl+P, Snipping, F12)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputOrTextarea(e.target)) return;

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      // Copy / Cut shortcuts
      if (copyBlocked && isCmdOrCtrl && ['c', 'x'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        setModalState({ open: true, action: 'copy' });
        return;
      }

      // Download / Print / Save shortcuts
      if (screenBlocked && isCmdOrCtrl && ['s', 'p', 'u'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        setModalState({ open: true, action: 'screenshot' });
        return;
      }

      // PrintScreen / Snip shortcuts
      if (screenBlocked && (e.key === 'PrintScreen' || e.key === 'Snapshot' || (isCmdOrCtrl && e.shiftKey && ['s', '3', '4', '5'].includes(key)))) {
        e.preventDefault();
        e.stopPropagation();
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('');
          }
        } catch (_) {}
        showWarningToast("🛡️ Les captures d'écran sont protégées sur AsrarHub.");
        setModalState({ open: true, action: 'screenshot' });
        return;
      }
    };

    document.addEventListener('copy', handleCopyCut, true);
    document.addEventListener('cut', handleCopyCut, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('copy', handleCopyCut, true);
      document.removeEventListener('cut', handleCopyCut, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [copyBlocked, screenBlocked]);

  const isAllBlockedAction = 
    (modalState.action === 'copy' && copyMode === 'all_blocked') ||
    (modalState.action === 'screenshot' && screenMode === 'all_blocked');

  return (
    <>
      {/* Protection Modal */}
      <AnimatePresence>
        {modalState.open && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-white overflow-hidden"
            >
              {/* Ambient Glows */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setModalState({ open: false, action: 'general' })}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label={t('protectionModal.close', 'Fermer')}
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 ${
                  isAllBlockedAction 
                    ? 'bg-gradient-to-br from-red-500 to-rose-700 shadow-red-500/30'
                    : 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-500/30'
                }`}>
                  {modalState.action === 'download' ? (
                    <Download size={32} className="text-slate-950" />
                  ) : modalState.action === 'screenshot' ? (
                    <Camera size={32} className={isAllBlockedAction ? 'text-white' : 'text-slate-950'} />
                  ) : modalState.action === 'copy' ? (
                    <Copy size={32} className={isAllBlockedAction ? 'text-white' : 'text-slate-950'} />
                  ) : (
                    <ShieldAlert size={32} className="text-slate-950" />
                  )}
                </div>

                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                  isAllBlockedAction
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                    : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                }`}>
                  {isAllBlockedAction ? (
                    <>
                      <ShieldBan size={12} /> Protection Globale Activée
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} /> {t('protectionModal.premiumAccess', 'Accès Réservé Premium')}
                    </>
                  )}
                </div>

                <h3 className="text-xl font-black tracking-tight text-white mb-2">
                  {modalState.action === 'download'
                    ? t('protectionModal.downloadTitle', 'Téléchargement Réservé')
                    : modalState.action === 'screenshot'
                    ? (isAllBlockedAction ? "Captures d'Écran Verrouillées" : "Captures d'Écran Réservées")
                    : modalState.action === 'copy'
                    ? (isAllBlockedAction ? "Copie de Texte Désactivée" : t('protectionModal.copyTitle', 'Copie & Sélection Protégées'))
                    : t('protectionModal.generalTitle', 'Contenu Protégé AsrarHub')}
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {isAllBlockedAction ? (
                    modalState.action === 'screenshot'
                      ? "Les captures d'écran et enregistrements d'écran ont été strictement désactivés sur l'ensemble de l'application par l'administrateur."
                      : "La copie, la sélection de texte et l'export des formules ont été temporairement verrouillés par l'administrateur pour des raisons de protection de contenu."
                  ) : modalState.action === 'download' ? (
                    t('protectionModal.downloadDesc', 'Le téléchargement des sceaux, khatims, images et documents PDF est réservé aux membres Premium d’AsrarHub.')
                  ) : modalState.action === 'screenshot' ? (
                    "Les captures d'écran haute résolution et l'enregistrement de contenu sont réservés aux membres Premium d'AsrarHub."
                  ) : (
                    t('protectionModal.copyDesc', 'La sélection de texte, le copier-coller et les captures de formules sont réservés aux membres Premium d’AsrarHub.')
                  )}
                </p>

                {!isAllBlockedAction && (
                  <div className="w-full bg-slate-800/80 rounded-2xl p-4 border border-white/5 text-left mb-6 space-y-2.5 text-xs text-gray-300">
                    <div className="flex items-center gap-2 text-amber-300 font-semibold">
                      <Sparkles size={14} className="shrink-0 text-amber-400" />
                      {t('protectionModal.featureHighResDownloads', 'Téléchargements haute résolution des Khatims & Sceaux')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Copy size={14} className="shrink-0 text-amber-400" />
                      {t('protectionModal.featureFreeCopy', 'Copie libre des formules & invocations mystiques')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock size={14} className="shrink-0 text-amber-400" />
                      {t('protectionModal.featureUnrestrictedAccess', 'Accès sans restriction aux secrets spirituels')}
                    </div>
                  </div>
                )}

                <div className="w-full flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setModalState({ open: false, action: 'general' })}
                    className={`w-full ${isAllBlockedAction ? 'sm:w-full' : 'sm:w-1/2'} py-3 rounded-xl border border-gray-700 text-gray-300 font-bold hover:bg-white/5 transition-colors text-sm`}
                  >
                    {t('protectionModal.close', 'Fermer')}
                  </button>
                  {!isAllBlockedAction && (
                    <Link
                      to="/payment"
                      onClick={() => setModalState({ open: false, action: 'general' })}
                      className="w-full sm:w-1/2 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 text-sm"
                    >
                      <Sparkles size={16} /> {t('protectionModal.becomePremium', 'Devenir Premium')}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
