import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Wifi, RefreshCw, Sparkles, BookOpen, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useLanguage } from '../contexts/LanguageContext';
import { revalidatePublishedArticles } from '../lib/swrArticleCache';

interface OfflineArticlesPopupProps {
  isOpen?: boolean;
  onClose?: () => void;
  onConnectedAndSynced?: (articles: any[]) => void;
  articleCount?: number;
}

export const OfflineArticlesPopup: React.FC<OfflineArticlesPopupProps> = ({
  isOpen,
  onClose,
  onConnectedAndSynced,
  articleCount = 0,
}) => {
  const { isOnline, isOffline, recheckNetwork } = useNetworkStatus();
  const { language } = useLanguage();
  const [isChecking, setIsChecking] = useState(false);
  const [syncState, setSyncState] = useState<'offline' | 'checking' | 'connected' | 'synced'>('offline');
  const [internalOpen, setInternalOpen] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const showModal = (isOpen !== undefined ? isOpen : internalOpen) && (isOffline || syncState === 'checking' || syncState === 'connected');

  // Handle network transition from offline to online
  useEffect(() => {
    if (isOnline && (syncState === 'offline' || syncState === 'checking')) {
      setSyncState('connected');
      // Trigger instant background sync of real articles
      revalidatePublishedArticles('offline_popup_restored')
        .then((items) => {
          setSyncState('synced');
          if (onConnectedAndSynced && Array.isArray(items) && items.length > 0) {
            onConnectedAndSynced(items);
          }
          // Smooth auto-dismiss after success celebration
          const timer = setTimeout(() => {
            if (onClose) onClose();
            setInternalOpen(false);
          }, 1800);
          return () => clearTimeout(timer);
        })
        .catch(() => {
          setSyncState('connected');
        });
    } else if (isOffline) {
      setSyncState('offline');
    }
  }, [isOnline, isOffline, syncState, onClose, onConnectedAndSynced]);

  // Video-grade procedural canvas animation for glowing radar / orbital signal particles
  useEffect(() => {
    if (!showModal) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    const particles: Array<{ x: number; y: number; radius: number; speed: number; opacity: number; dir: number }> = [];

    // Initialize 24 ambient luminous particles
    for (let i = 0; i < 24; i++) {
      particles.push({
        x: Math.random() * 260,
        y: Math.random() * 180,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.7 + 0.3,
        dir: Math.random() > 0.5 ? 1 : -1,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 1. Draw glowing concentric pulse rings
      const ringColor = syncState === 'connected' || syncState === 'synced' ? '16, 185, 129' : '245, 158, 11';
      for (let r = 1; r <= 3; r++) {
        const pulse = (Math.sin(angle * 1.5 + r) + 1) / 2;
        const currentRadius = 32 * r + pulse * 10;
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ringColor}, ${0.18 - r * 0.04 + pulse * 0.1})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 2. Draw rotating radar sweep beam
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      const gradient = ctx.createLinearGradient(0, 0, 70, 0);
      gradient.addColorStop(0, `rgba(${ringColor}, 0)`);
      gradient.addColorStop(1, `rgba(${ringColor}, 0.35)`);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 70, -0.3, 0.3);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();

      // 3. Draw ambient floating particles
      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += Math.sin(p.y * 0.05) * 0.3 * p.dir;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ringColor}, ${p.opacity * (syncState === 'synced' ? 1 : 0.6)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${ringColor}, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      angle += 0.035;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [showModal, syncState]);

  const handleManualRetry = async () => {
    if (isChecking) return;
    setIsChecking(true);
    setSyncState('checking');
    try {
      const isReachable = await recheckNetwork();
      if (isReachable) {
        setSyncState('connected');
        const items = await revalidatePublishedArticles('offline_popup_manual_retry');
        setSyncState('synced');
        if (onConnectedAndSynced && Array.isArray(items) && items.length > 0) {
          onConnectedAndSynced(items);
        }
        setTimeout(() => {
          if (onClose) onClose();
          setInternalOpen(false);
        }, 1500);
      } else {
        setTimeout(() => {
          setSyncState('offline');
          setIsChecking(false);
        }, 800);
      }
    } catch {
      setSyncState('offline');
      setIsChecking(false);
    }
  };

  const handleDismiss = () => {
    if (onClose) onClose();
    setInternalOpen(false);
  };

  const texts = {
    fr: {
      badge: syncState === 'synced' || syncState === 'connected' ? 'CONNEXION RÉTABLIE' : 'MODE HORS LIGNE DÉTECTÉ',
      title: syncState === 'synced' 
        ? 'Articles Synchronisés !' 
        : syncState === 'connected' 
        ? 'Synchronisation en cours...' 
        : 'Vous êtes actuellement hors ligne',
      desc: syncState === 'synced'
        ? 'Vos articles officiels ont été synchronisés et sont maintenant disponibles pour la lecture hors-ligne.'
        : syncState === 'connected'
        ? 'Connexion Internet détectée ! Téléchargement des articles récents depuis le serveur sécurisé...'
        : 'Pour garantir l\'authenticité et la précision de vos wirds et secrets, les articles officiels seront automatiquement chargés dès que votre connexion Internet sera rétablie.',
      statusOffline: 'En attente du signal réseau...',
      statusChecking: 'Vérification de la connectivité en cours...',
      statusConnected: 'Signal réseau détecté avec succès !',
      btnRetry: 'Vérifier la connexion',
      btnContinueOffline: 'Continuer vers les outils hors-ligne',
      offlineToolsHint: 'Tous vos outils locaux (Tasbih, Zikr, Coran, Prières) restent 100% opérationnels sans connexion.',
    },
    en: {
      badge: syncState === 'synced' || syncState === 'connected' ? 'CONNECTION RESTORED' : 'OFFLINE MODE DETECTED',
      title: syncState === 'synced' 
        ? 'Articles Synchronized!' 
        : syncState === 'connected' 
        ? 'Synchronizing in progress...' 
        : 'You are currently offline',
      desc: syncState === 'synced'
        ? 'Official articles have been synchronized and are now ready for offline reading.'
        : syncState === 'connected'
        ? 'Internet connection detected! Downloading articles from secure server...'
        : 'To ensure data authenticity, articles will be automatically loaded as soon as your internet connection is restored.',
      statusOffline: 'Waiting for network signal...',
      statusChecking: 'Checking connectivity...',
      statusConnected: 'Network signal detected successfully!',
      btnRetry: 'Check connection',
      btnContinueOffline: 'Continue to offline tools',
      offlineToolsHint: 'Your local tools (Tasbih, Zikr, Quran, Prayers) remain 100% functional without connection.',
    },
    ha: {
      badge: syncState === 'synced' || syncState === 'connected' ? 'AN SAMU HANYAR SADARWA' : 'BA HANYAR SADARWA (OFFLINE)',
      title: syncState === 'synced' 
        ? 'An Sauke Rubuce-rubuce!' 
        : syncState === 'connected' 
        ? 'Ana saukar da bayanai...' 
        : 'A halin yanzu ba ka da intanet',
      desc: 'Za a nuna dukkan rubuce-rubuce da asirai da zaran an haɗa intanet.',
      statusOffline: 'Ana jiran hanyar sadarwa...',
      statusChecking: 'Ana duba intanet...',
      statusConnected: 'An haɗa intanet cikin nasara!',
      btnRetry: 'Sake dubawa',
      btnContinueOffline: 'Ci gaba da amfani da manhaja',
      offlineToolsHint: 'Dukkan sauran ayyuka kamar Tasbaha, Zikiri da Alkur\'ani suna aiki ba tare da intanet ba.',
    }
  };

  const t = texts[language as keyof typeof texts] || texts.fr;

  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with subtle blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-900 border border-amber-500/30 dark:border-amber-500/20 rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Top Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
              title="Fermer"
            >
              <X size={18} />
            </button>

            {/* Video-Style Animated Visual Header Banner */}
            <div className="relative w-full h-48 bg-gradient-to-b from-gray-950 via-slate-900 to-gray-900 flex items-center justify-center overflow-hidden border-b border-gray-100 dark:border-gray-800">
              {/* Dynamic Animated Radar Canvas */}
              <canvas
                ref={canvasRef}
                width={260}
                height={180}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90"
              />

              {/* Glowing Central Centerpiece Icon */}
              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={
                    syncState === 'synced'
                      ? { scale: [1, 1.2, 1], rotate: [0, 5, 0] }
                      : { scale: [1, 1.05, 1] }
                  }
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-xl border ${
                    syncState === 'synced' || syncState === 'connected'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-emerald-500/30'
                      : 'bg-amber-500/20 border-amber-400/50 text-amber-400 shadow-amber-500/30'
                  }`}
                >
                  {syncState === 'synced' ? (
                    <Sparkles className="w-10 h-10 animate-bounce" />
                  ) : syncState === 'connected' ? (
                    <Wifi className="w-10 h-10 animate-pulse" />
                  ) : (
                    <WifiOff className="w-10 h-10" />
                  )}
                </motion.div>
              </div>

              {/* Luminous Top Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider border backdrop-blur-md uppercase ${
                    syncState === 'synced' || syncState === 'connected'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      syncState === 'synced' || syncState === 'connected'
                        ? 'bg-emerald-400 animate-ping'
                        : 'bg-amber-400 animate-pulse'
                    }`}
                  />
                  {t.badge}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-7 space-y-5">
              <div className="text-center space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  {t.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
                  {t.desc}
                </p>
              </div>

              {/* Network Status Tracker Box */}
              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      syncState === 'synced' || syncState === 'connected'
                        ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-ping'
                        : isChecking
                        ? 'bg-blue-500 animate-spin'
                        : 'bg-amber-500 animate-pulse'
                    }`}
                  />
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {isChecking
                      ? t.statusChecking
                      : syncState === 'synced' || syncState === 'connected'
                      ? t.statusConnected
                      : t.statusOffline}
                  </div>
                </div>

                <button
                  onClick={handleManualRetry}
                  disabled={isChecking}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={13} className={isChecking ? 'animate-spin' : ''} />
                  <span>{t.btnRetry}</span>
                </button>
              </div>

              {/* Informative Micro-Card */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <p className="leading-snug">
                  {t.offlineToolsHint}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={handleManualRetry}
                  disabled={isChecking}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] text-white font-black text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw size={16} className={isChecking ? 'animate-spin' : ''} />
                  <span>{isChecking ? t.statusChecking : t.btnRetry}</span>
                </button>

                <button
                  onClick={handleDismiss}
                  className="w-full py-3 px-4 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-[0.98] text-gray-700 dark:text-gray-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookOpen size={15} />
                  <span>{t.btnContinueOffline}</span>
                  <ArrowRight size={14} className="opacity-60" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
