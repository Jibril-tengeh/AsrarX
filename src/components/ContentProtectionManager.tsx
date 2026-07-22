import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Sparkles, ShieldAlert, X, Copy, Download, MousePointer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const triggerProtectionModal = (action: 'download' | 'copy' | 'select' | 'screenshot' | 'general' = 'general') => {
  window.dispatchEvent(new CustomEvent('asrarhub:protection_triggered', { detail: { action } }));
};

export const ContentProtectionManager: React.FC = () => {
  const { isPremium } = useAuth();
  const [modalState, setModalState] = useState<{ open: boolean; action: string }>({
    open: false,
    action: 'general',
  });

  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const customEv = e as CustomEvent<{ action: string }>;
      setModalState({ open: true, action: customEv.detail?.action || 'general' });
    };

    window.addEventListener('asrarhub:protection_triggered', handleTrigger);
    return () => window.removeEventListener('asrarhub:protection_triggered', handleTrigger);
  }, []);

  useEffect(() => {
    if (isPremium) return;

    const isInputOrTextarea = (target: EventTarget | null) => {
      if (!target) return false;
      const el = target as HTMLElement;
      const tagName = el.tagName?.toLowerCase();
      return (
        tagName === 'input' ||
        tagName === 'textarea' ||
        el.isContentEditable ||
        el.closest('input') !== null ||
        el.closest('textarea') !== null
      );
    };

    // 1. Intercept Copy / Cut
    const handleCopyCut = (e: ClipboardEvent) => {
      if (isInputOrTextarea(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      setModalState({ open: true, action: 'copy' });
    };

    // 2. Intercept Context Menu (Right-Click)
    const handleContextMenu = (e: MouseEvent) => {
      if (isInputOrTextarea(e.target)) return;
      e.preventDefault();
      setModalState({ open: true, action: 'copy' });
    };

    // 3. Intercept Image Drag
    const handleDragStart = (e: DragEvent) => {
      if (isInputOrTextarea(e.target)) return;
      e.preventDefault();
      setModalState({ open: true, action: 'download' });
    };

    // 4. Keyboard Shortcuts Interception (Ctrl+C, Cmd+C, Ctrl+S, Cmd+S, Ctrl+P, Cmd+P, F12, PrintScreen)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputOrTextarea(e.target)) return;

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      if (isCmdOrCtrl && ['c', 'x', 's', 'p', 'u'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        setModalState({ open: true, action: key === 's' || key === 'p' ? 'download' : 'copy' });
        return;
      }

      if (e.key === 'F12' || (isCmdOrCtrl && e.shiftKey && ['i', 'j', 'c'].includes(key))) {
        e.preventDefault();
        setModalState({ open: true, action: 'general' });
        return;
      }

      if (e.key === 'PrintScreen' || e.key === 'Snapshot') {
        e.preventDefault();
        try {
          navigator.clipboard.writeText('');
        } catch (_) {}
        setModalState({ open: true, action: 'screenshot' });
      }
    };

    // 5. Intercept PrintScreen on KeyUp
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.key === 'Snapshot') {
        e.preventDefault();
        try {
          navigator.clipboard.writeText('');
        } catch (_) {}
        setModalState({ open: true, action: 'screenshot' });
      }
    };

    document.addEventListener('copy', handleCopyCut, true);
    document.addEventListener('cut', handleCopyCut, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);

    return () => {
      document.removeEventListener('copy', handleCopyCut, true);
      document.removeEventListener('cut', handleCopyCut, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [isPremium]);

  if (isPremium) return null;

  return (
    <>
      {/* CSS Injection for non-premium users */}
      <style>{`
        body, p, span, h1, h2, h3, h4, h5, h6, article, img, svg, canvas, button, div, section, main {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
        }
        input, textarea, [contenteditable="true"] {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
        img {
          -webkit-user-drag: none !important;
          user-drag: none !important;
          pointer-events: auto;
        }
        @media print {
          html, body {
            display: none !important;
          }
        }
      `}</style>

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
              {/* Background ambient glow */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={() => setModalState({ open: false, action: 'general' })}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4">
                  {modalState.action === 'download' ? (
                    <Download size={32} className="text-slate-950" />
                  ) : modalState.action === 'copy' ? (
                    <Copy size={32} className="text-slate-950" />
                  ) : (
                    <ShieldAlert size={32} className="text-slate-950" />
                  )}
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles size={12} /> Accès Réservé Premium
                </div>

                <h3 className="text-xl font-black tracking-tight text-white mb-2">
                  {modalState.action === 'download'
                    ? 'Téléchargement Réservé'
                    : modalState.action === 'copy'
                    ? 'Copie & Sélection Protégées'
                    : 'Contenu Protégé AsrarHub'}
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {modalState.action === 'download'
                    ? 'Le téléchargement des sceaux, khatims, images et documents PDF est réservé aux membres Premium d’AsrarHub.'
                    : 'La sélection de texte, le copier-coller et les captures de contenus sont réservés aux membres Premium d’AsrarHub.'}
                </p>

                <div className="w-full bg-slate-800/80 rounded-2xl p-4 border border-white/5 text-left mb-6 space-y-2.5 text-xs text-gray-300">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold">
                    <Sparkles size={14} className="shrink-0 text-amber-400" />
                    Téléchargements haute résolution des Khatims & Sceaux
                  </div>
                  <div className="flex items-center gap-2">
                    <Copy size={14} className="shrink-0 text-amber-400" />
                    Copie libre des formules & invocations mystiques
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="shrink-0 text-amber-400" />
                    Accès sans restriction aux secrets spirituels
                  </div>
                </div>

                <div className="w-full flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setModalState({ open: false, action: 'general' })}
                    className="w-full sm:w-1/2 py-3 rounded-xl border border-gray-700 text-gray-300 font-bold hover:bg-white/5 transition-colors text-sm"
                  >
                    Fermer
                  </button>
                  <Link
                    to="/payment"
                    onClick={() => setModalState({ open: false, action: 'general' })}
                    className="w-full sm:w-1/2 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 text-sm"
                  >
                    <Sparkles size={16} /> Devenir Premium
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
