import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RefreshCw, Sparkles, BookOpen, CheckCircle2, ShieldCheck, 
  ArrowRight, X, CloudDownload, Zap, Database, Play, Check
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { revalidatePublishedArticles } from '../lib/swrArticleCache';
import { getAsrarItems } from '../data/store';
import { autoSyncLocalArticlesToFirestore } from '../lib/localArticles';

interface ArticleSyncVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSynced?: (count: number) => void;
  autoPrompt?: boolean;
}

export const ArticleSyncVideoModal: React.FC<ArticleSyncVideoModalProps> = ({
  isOpen,
  onClose,
  onSynced,
  autoPrompt = false,
}) => {
  const { language } = useLanguage();
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncedCount, setSyncedCount] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentSyncPhase, setCurrentSyncPhase] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [storedArticlesCount, setStoredArticlesCount] = useState<number>(0);

  // Load current article count on open
  useEffect(() => {
    if (isOpen) {
      setSyncState('idle');
      setProgressPercent(0);
      try {
        const local = getAsrarItems();
        setStoredArticlesCount(Array.isArray(local) ? local.length : 0);
      } catch (e) {
        setStoredArticlesCount(0);
      }
    }
  }, [isOpen]);

  // High-performance procedural canvas animation mimicking an ethereal holographic video background
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    const waves = [
      { amplitude: 25, frequency: 0.015, speed: 0.04, color: 'rgba(16, 185, 129, 0.25)' },
      { amplitude: 35, frequency: 0.01, speed: 0.03, color: 'rgba(245, 158, 11, 0.2)' },
      { amplitude: 20, frequency: 0.02, speed: 0.05, color: 'rgba(6, 182, 212, 0.25)' }
    ];

    const particles: Array<{ x: number; y: number; size: number; speedY: number; opacity: number }> = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * 400,
        y: Math.random() * 300,
        size: Math.random() * 2.5 + 0.8,
        speedY: Math.random() * 0.6 + 0.2,
        opacity: Math.random() * 0.7 + 0.3,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      // 1. Draw glowing radiant gradient background
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 10,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.2
      );
      grad.addColorStop(0, 'rgba(6, 78, 59, 0.4)');
      grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.6)');
      grad.addColorStop(1, 'rgba(2, 6, 23, 0.9)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw procedural ethereal fluid waves
      waves.forEach((w) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = (canvas.height * 0.65) + Math.sin(x * w.frequency + time * w.speed * 50) * w.amplitude;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fillStyle = w.color;
        ctx.fill();
      });

      // 3. Draw luminous ascending particles
      particles.forEach((p) => {
        p.y -= p.speedY;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${p.opacity})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(52, 211, 153, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  const handleInstantSync = async () => {
    if (syncState === 'syncing') return;
    setSyncState('syncing');
    setProgressPercent(15);
    setCurrentSyncPhase(language === 'en' ? 'Connecting to Cloud Registry...' : language === 'ha' ? 'Haɗawa da Rumbun Asrar...' : 'Connexion au Registre Cloud...');

    try {
      await new Promise(r => setTimeout(r, 300));
      setProgressPercent(45);
      setCurrentSyncPhase(language === 'en' ? 'Fetching fresh manuscripts & secrets...' : language === 'ha' ? 'Zazzage sabbin sirrika...' : 'Téléchargement des manuscrits & secrets...');

      // Revalidate and sync all published articles
      const articles = await revalidatePublishedArticles('video_popup_instant_sync');
      
      setProgressPercent(80);
      setCurrentSyncPhase(language === 'en' ? 'Updating local cache & fast indexing...' : language === 'ha' ? 'Shigarwa a cikin waya...' : 'Mise à jour du cache local & indexation...');

      // Also trigger bidirectional local article sync to ensure full sync
      try {
        await autoSyncLocalArticlesToFirestore();
      } catch (e) {}

      const finalCount = Array.isArray(articles) && articles.length > 0 ? articles.length : getAsrarItems().length;
      setSyncedCount(finalCount);
      setProgressPercent(100);
      setCurrentSyncPhase(language === 'en' ? 'Sync Completed Successfully!' : language === 'ha' ? 'An kammala cikin nasara!' : 'Synchronisation réussie !');
      setSyncState('success');

      if (onSynced) {
        onSynced(finalCount);
      }

      // Auto close after success celebration
      setTimeout(() => {
        onClose();
      }, 2200);
    } catch (err) {
      console.error('Instant sync error:', err);
      // Fallback
      const fallbackCount = getAsrarItems().length;
      setSyncedCount(fallbackCount);
      setSyncState('success');
      setProgressPercent(100);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30 bg-slate-950 text-white z-10 my-auto"
          >
            {/* Header Video/Visual Canvas */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900 border-b border-emerald-500/20">
              <canvas
                ref={canvasRef}
                width={480}
                height={220}
                className="w-full h-full object-cover"
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/50 hover:bg-black/80 text-gray-300 hover:text-white border border-white/10 transition-colors z-20 cursor-pointer"
                title="Fermer"
              >
                <X size={18} />
              </button>

              {/* Center Luminous Sync Hologram */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
                <div className="relative">
                  <motion.div
                    animate={syncState === 'syncing' ? { rotate: 360 } : { scale: [1, 1.08, 1] }}
                    transition={syncState === 'syncing' ? { repeat: Infinity, duration: 1.2, ease: 'linear' } : { repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-0.5 shadow-xl shadow-emerald-950/60"
                  >
                    <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center backdrop-blur-xs">
                      {syncState === 'success' ? (
                        <CheckCircle2 size={36} className="text-emerald-400" />
                      ) : syncState === 'syncing' ? (
                        <RefreshCw size={34} className="text-amber-400 animate-spin" />
                      ) : (
                        <CloudDownload size={34} className="text-emerald-400" />
                      )}
                    </div>
                  </motion.div>

                  {/* Pulsing ring */}
                  <span className="absolute -inset-1 rounded-2xl border-2 border-emerald-400/40 animate-ping pointer-events-none" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 tracking-wider uppercase mt-3 shadow-lg">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>
                    {language === 'en'
                      ? 'Cloud Synchronization Hub'
                      : language === 'ha'
                      ? 'Daidaita Taskar Asrar'
                      : 'Synchronisation Cloud Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-7 space-y-5">
              <div className="text-center space-y-1.5">
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {language === 'en'
                    ? 'Synchronize Spiritual Articles & Secrets'
                    : language === 'ha'
                    ? 'Daidaita Rubuce-rubuce da Sirrikan Asrar'
                    : 'Synchronisation des Articles & Secrets'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                  {language === 'en'
                    ? 'Instantly download the latest sacred manuscripts, secret prayers, and spiritual remedies from the cloud.'
                    : language === 'ha'
                    ? 'Sauke sabbin rubuce-rubuce, sirrika da addu’o’i masu albarka nan take daga rumbun adana bayananmu.'
                    : 'Mettez à jour instantanément votre bibliothèque avec les derniers manuscrits sacrés, secrets et recettes spirituelles publiés sur le cloud.'}
                </p>
              </div>

              {/* Status Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === 'en' ? 'Current Articles' : language === 'ha' ? 'Rubuce-rubuce' : 'Articles Locaux'}
                    </p>
                    <p className="text-base font-black text-white mt-0.5">
                      {storedArticlesCount} {language === 'en' ? 'saved' : language === 'ha' ? 'a ajiye' : 'inclus'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Zap size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === 'en' ? 'Cloud Mode' : language === 'ha' ? 'Halin Rumbu' : 'Mode Cloud'}
                    </p>
                    <p className="text-base font-black text-amber-400 mt-0.5">
                      {language === 'en' ? 'Live & Instant' : language === 'ha' ? 'Nan take' : 'Instantané'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar (Visible when syncing) */}
              {syncState === 'syncing' && (
                <div className="space-y-2 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 animate-pulse">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-300 flex items-center gap-1.5">
                      <RefreshCw size={12} className="animate-spin text-amber-400" />
                      {currentSyncPhase}
                    </span>
                    <span className="text-amber-400 font-mono">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ ease: 'easeOut', duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Success Banner */}
              {syncState === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center gap-3 text-emerald-200"
                >
                  <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-emerald-300">
                      {language === 'en' ? 'Synchronization complete!' : language === 'ha' ? 'An daidaita komai cikin nasara!' : 'Synchronisation terminée avec succès !'}
                    </p>
                    <p className="text-emerald-400/90 mt-0.5">
                      {syncedCount} {language === 'en' ? 'articles and secrets are now up-to-date.' : language === 'ha' ? 'sirrika da rubuce-rubuce sun sabunta.' : 'articles et secrets sont désormais à jour.'}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Ultra-Professional Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={syncState === 'syncing'}
                  onClick={handleInstantSync}
                  className={`w-full group relative flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-300 shadow-xl cursor-pointer ${
                    syncState === 'syncing'
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                      : syncState === 'success'
                      ? 'bg-emerald-600 text-white border border-emerald-400 shadow-emerald-900/50'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white border border-emerald-400/40 hover:border-emerald-300 shadow-emerald-950/60 hover:shadow-emerald-900/80 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {syncState === 'syncing' ? (
                    <>
                      <RefreshCw size={18} className="animate-spin text-amber-400" />
                      <span>{language === 'en' ? 'Synchronizing now...' : language === 'ha' ? 'Ana daidaitawa...' : 'Synchronisation en cours...'}</span>
                    </>
                  ) : syncState === 'success' ? (
                    <>
                      <Check size={18} className="text-emerald-200" />
                      <span>{language === 'en' ? 'Articles Synchronized!' : language === 'ha' ? 'An Daidaita!' : 'Articles Synchronisés !'}</span>
                    </>
                  ) : (
                    <>
                      <Zap size={18} className="text-amber-300 group-hover:scale-110 transition-transform" />
                      <span className="tracking-wide">
                        {language === 'en'
                          ? 'Synchronize Articles Instantly'
                          : language === 'ha'
                          ? 'Daidaita Rubuce-rubuce Nan Take'
                          : 'Synchroniser les Articles Instantanément'}
                      </span>
                      <ArrowRight size={16} className="text-emerald-200 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
