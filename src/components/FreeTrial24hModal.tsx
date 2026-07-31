import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, CheckCircle2, Clock, ShieldCheck, X, BookOpen, Wand2, Download, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface FreeTrial24hModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeTrial24hModal: React.FC<FreeTrial24hModalProps> = ({ isOpen, onClose }) => {
  const { user, isPremium, isTrialActive, trialTimeLeftMs, markTrialPopupSeen, activate24hTrial } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 12,
    minutes: 0,
    seconds: 0
  });

  // Ticking timer for remaining trial duration
  useEffect(() => {
    if (!trialTimeLeftMs || trialTimeLeftMs <= 0) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const updateTimer = () => {
      const totalSeconds = Math.floor(Math.max(0, trialTimeLeftMs) / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [trialTimeLeftMs]);

  if (!isOpen) return null;

  const handleActivate = async () => {
    if (!user?.freeTrialActivated) {
      await activate24hTrial();
    }
    markTrialPopupSeen();
    onClose();
  };

  const handleExplore = () => {
    markTrialPopupSeen();
    onClose();
    navigate('/tools/sacred-books');
  };

  const isFr = language === 'fr';
  const isHa = language === 'ha';

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            markTrialPopupSeen();
            onClose();
          }}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl bg-gradient-to-b from-gray-900 via-gray-950 to-black border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-amber-500/20 overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => {
              markTrialPopupSeen();
              onClose();
            }}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10 z-10"
            title="Fermer"
          >
            <X size={20} />
          </button>

          {/* Header Crown Icon */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="relative p-4 rounded-3xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-400 text-black shadow-lg shadow-amber-500/30 mb-4"
            >
              <Crown size={40} className="stroke-[2.5]" />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles size={18} className="text-white fill-white" />
              </motion.div>
            </motion.div>

            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs uppercase tracking-wider mb-2">
              <Zap size={13} className="text-amber-400 fill-amber-400" />
              {isFr ? 'Offre de Bienvenue • 12h Premium' : isHa ? 'Kyauta • 12h Premium' : 'Welcome Gift • 12h Premium'}
            </span>

            {/* Main Title */}
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400">
              {isFr 
                ? '12 Heures de Premium Gratuit !' 
                : isHa 
                ? 'Sa\'a 12 Na Premium Kyauta!' 
                : '12 Hours Free Premium Access!'}
            </h2>

            <p className="text-sm text-gray-300 mt-2 max-w-md leading-relaxed">
              {isFr 
                ? 'Félicitations ! Votre compte bénéficie d\'un accès Premium VIP complet pendant 12 heures sans aucun engagement ni frais.'
                : isHa
                ? 'Barka da zuwa! Account ɗinku yana da damar amfani da Premium VIP kyauta na tsawon sa\'o\'i 12.'
                : 'Congratulations! Your account enjoys full VIP Premium access for 12 hours with no commitment or fees.'}
            </p>

            {/* Timer Banner */}
            <div className="w-full mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60 border border-amber-500/40 flex flex-col items-center justify-center gap-1.5 shadow-inner">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                <Clock size={14} className="animate-pulse text-amber-400" />
                {isFr ? 'Temps Restant d\'Accès VIP' : isHa ? 'Lokacin da Ya Rage' : 'VIP Time Remaining'}
              </span>

              <div className="flex items-center gap-3 text-2xl sm:text-3xl font-black text-amber-100 font-mono tracking-wider">
                <div className="flex flex-col items-center bg-black/60 px-3 py-1.5 rounded-xl border border-amber-500/30">
                  <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[10px] text-amber-400/80 font-sans font-semibold uppercase">Heures</span>
                </div>
                <span className="text-amber-500">:</span>
                <div className="flex flex-col items-center bg-black/60 px-3 py-1.5 rounded-xl border border-amber-500/30">
                  <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[10px] text-amber-400/80 font-sans font-semibold uppercase">Min</span>
                </div>
                <span className="text-amber-500">:</span>
                <div className="flex flex-col items-center bg-black/60 px-3 py-1.5 rounded-xl border border-amber-500/30">
                  <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[10px] text-amber-400/80 font-sans font-semibold uppercase">Sec</span>
                </div>
              </div>
            </div>

            {/* Features Included */}
            <div className="w-full mt-5 space-y-2.5 text-left">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-200">
                    {isFr ? '23 Manuscrits Sacrés & Sceaux 3D' : isHa ? 'Littattafai Masu Tsarki 23 & Hatimi 3D' : '23 Sacred Manuscripts & 3D Seals'}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {isFr ? 'Déblocage total d\'Al-Buni, Ibn Arabi, Majriti, Jifr, Jazuli et parchemins téléchargeables.' : 'Full access to Al-Buni, Ibn Arabi, Majriti, Jifr, Jazuli & downloadable parchments.'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                  <Wand2 size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-200">
                    {isFr ? 'Tous les Générateurs Théurgiques' : isHa ? 'Duk Na\'urorin Sirri Na Abjad da Awfaq' : 'All Esoteric Generators Unlocked'}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {isFr ? 'Générateur de Wafq, Calculs Abjad avancés, Zairajah, Talsam & Rouhaniyya.' : 'Wafq matrix generator, advanced Abjad calculations, Zairajah & Talsam.'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-200">
                    {isFr ? 'Désactivation Automatique dans 12h' : isHa ? 'Aure na Sa\'o\'i 12 Ba Tare da Biyan Kuɗi Ba' : 'Auto-Deactivates After 12 Hours'}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {isFr ? 'Aucune carte requise. À la fin des 12h, l\'accès repasse simplement en mode gratuit.' : 'No credit card required. Returns to standard free access automatically after 12 hours.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="w-full mt-6 flex flex-col gap-2.5">
              <button
                onClick={handleExplore}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-extrabold text-sm sm:text-base hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <Sparkles size={18} className="fill-black" />
                <span>
                  {isFr 
                    ? 'Profiter de mes 12h Premium Maintenant' 
                    : isHa 
                    ? 'Fara Amfani da Premium Yanzu' 
                    : 'Start Using 12h Free Premium'}
                </span>
              </button>

              <button
                onClick={() => {
                  markTrialPopupSeen();
                  onClose();
                }}
                className="w-full py-2.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {isFr ? 'Continuer sans fermer la session' : 'Continue to Dashboard'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
