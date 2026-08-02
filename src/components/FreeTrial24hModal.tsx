import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, CheckCircle2, Clock, ShieldCheck, X, BookOpen, Wand2, Download, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useFeatures } from '../contexts/FeatureContext';
import { getTrialDurationHours } from '../utils/trialConfig';
import { useNavigate } from 'react-router-dom';

interface FreeTrial24hModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeTrial24hModal: React.FC<FreeTrial24hModalProps> = ({ isOpen, onClose }) => {
  const { user, isPremium, isTrialActive, trialTimeLeftMs, markTrialPopupSeen, activate24hTrial } = useAuth();
  const { featureToggles } = useFeatures();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const trialDurationHours = getTrialDurationHours(featureToggles);
  const hourUnit = trialDurationHours > 1 ? 'heures' : 'heure';

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: trialDurationHours,
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

        {/* Modal Container with 3D Card Depth */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
          className="relative w-full max-w-xl bg-gradient-to-b from-gray-900 via-gray-950 to-black border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 text-white shadow-[0_25px_60px_-15px_rgba(245,158,11,0.35),0_0_35px_rgba(245,158,11,0.2)] overflow-hidden transform-gpu hover:scale-[1.01] transition-transform duration-300"
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
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10 z-10 cursor-pointer"
            title="Fermer"
          >
            <X size={20} />
          </button>

          {/* Header Crown Icon */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -8, 8, 0] }}
              transition={{ delay: 0.1, duration: 0.6 }}
              style={{ transform: 'translateZ(30px)' }}
              className="relative p-4 rounded-3xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 text-black shadow-xl shadow-amber-500/40 mb-4 border border-white/40"
            >
              <Crown size={40} className="stroke-[2.5]" />
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles size={18} className="text-white fill-white" />
              </motion.div>
            </motion.div>

            {/* Badge */}
            <span
              style={{ transform: 'translateZ(20px)' }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border border-amber-500/50 text-amber-300 font-extrabold text-xs uppercase tracking-wider mb-2 shadow-sm"
            >
              <Zap size={13} className="text-amber-400 fill-amber-400 animate-pulse" />
              {isFr ? `Offre de Bienvenue • ${trialDurationHours}h Premium` : isHa ? `Kyauta • ${trialDurationHours}h Premium` : `Welcome Gift • ${trialDurationHours}h Premium`}
            </span>

            {/* Main Title */}
            <h2
              style={{ transform: 'translateZ(15px)' }}
              className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 drop-shadow-sm"
            >
              {isFr 
                ? `${trialDurationHours} ${trialDurationHours > 1 ? 'Heures' : 'Heure'} de Premium Gratuit !` 
                : isHa 
                ? `Sa'a ${trialDurationHours} Na Premium Kyauta!` 
                : `${trialDurationHours} ${trialDurationHours > 1 ? 'Hours' : 'Hour'} Free Premium Access!`}
            </h2>

            <p className="text-sm text-gray-300 mt-2 max-w-md leading-relaxed font-medium">
              {isFr 
                ? `Félicitations ! Votre compte bénéficie d'un accès Premium VIP complet pendant ${trialDurationHours} ${hourUnit} sans aucun engagement ni frais.`
                : isHa
                ? `Barka da zuwa! Account ɗinku yana da damar amfani da Premium VIP kyauta na tsawon sa'o'i ${trialDurationHours}.`
                : `Congratulations! Your account enjoys full VIP Premium access for ${trialDurationHours} ${trialDurationHours > 1 ? 'hours' : 'hour'} with no commitment or fees.`}
            </p>

            {/* Timer Banner 3D */}
            <div
              style={{ transform: 'translateZ(25px)' }}
              className="w-full mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-amber-950/80 border border-amber-500/50 flex flex-col items-center justify-center gap-1.5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_10px_25px_rgba(245,158,11,0.15)]"
            >
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                <Clock size={14} className="animate-pulse text-amber-400" />
                {isFr ? 'Temps Restant d\'Accès VIP' : isHa ? 'Lokacin da Ya Rage' : 'VIP Time Remaining'}
              </span>

              <div className="flex items-center gap-3 text-2xl sm:text-3xl font-black text-amber-100 font-mono tracking-wider">
                <div className="flex flex-col items-center bg-black/80 px-3.5 py-2 rounded-xl border border-amber-500/40 shadow-md">
                  <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[10px] text-amber-400/80 font-sans font-semibold uppercase">Heures</span>
                </div>
                <span className="text-amber-500 font-bold">:</span>
                <div className="flex flex-col items-center bg-black/80 px-3.5 py-2 rounded-xl border border-amber-500/40 shadow-md">
                  <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[10px] text-amber-400/80 font-sans font-semibold uppercase">Min</span>
                </div>
                <span className="text-amber-500 font-bold">:</span>
                <div className="flex flex-col items-center bg-black/80 px-3.5 py-2 rounded-xl border border-amber-500/40 shadow-md">
                  <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[10px] text-amber-400/80 font-sans font-semibold uppercase">Sec</span>
                </div>
              </div>
            </div>

            {/* Features Included 3D Cards */}
            <div className="w-full mt-5 space-y-3 text-left">
              {[
                {
                  icon: BookOpen,
                  title: isFr ? '23 Manuscrits Sacrés & Sceaux 3D' : isHa ? 'Littattafai Masu Tsarki 23 & Hatimi 3D' : '23 Sacred Manuscripts & 3D Seals',
                  desc: isFr ? 'Déblocage total d\'Al-Buni, Ibn Arabi, Majriti, Jifr, Jazuli et parchemins téléchargeables.' : 'Full access to Al-Buni, Ibn Arabi, Majriti, Jifr, Jazuli & downloadable parchments.'
                },
                {
                  icon: Wand2,
                  title: isFr ? 'Tous les Générateurs Théurgiques' : isHa ? 'Duk Na\'urorin Sirri Na Abjad da Awfaq' : 'All Esoteric Generators Unlocked',
                  desc: isFr ? 'Générateur de Wafq, Calculs Abjad avancés, Zairajah, Talsam & Rouhaniyya.' : 'Wafq matrix generator, advanced Abjad calculations, Zairajah & Talsam.'
                },
                {
                  icon: ShieldCheck,
                  title: isFr ? `Désactivation Automatique dans ${trialDurationHours}h` : isHa ? `Aure na Sa'o'i ${trialDurationHours} Ba Tare da Biyan Kuɗi Ba` : `Auto-Deactivates After ${trialDurationHours} Hours`,
                  desc: isFr ? `Aucune carte requise. À la fin des ${trialDurationHours}h, l'accès repasse simplement en mode gratuit.` : `No credit card required. Returns to standard free access automatically after ${trialDurationHours} hours.`
                }
              ].map((feat, idx) => {
                const IconComp = feat.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 flex items-start gap-3.5 transition-all duration-300 shadow-md hover:shadow-xl hover:border-amber-500/40 transform-gpu hover:-translate-y-0.5"
                  >
                    <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500/30 to-yellow-500/20 text-amber-300 shrink-0 mt-0.5 border border-amber-500/30 shadow-sm">
                      <IconComp size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-amber-200">
                        {feat.title}
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed font-medium">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action CTA 3D */}
            <div className="w-full mt-6 flex flex-col gap-2.5">
              <button
                onClick={handleExplore}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-black font-black text-sm sm:text-base hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer border border-yellow-200"
              >
                <Sparkles size={18} className="fill-black" />
                <span>
                  {isFr 
                    ? `Profiter de mes ${trialDurationHours}h Premium Maintenant` 
                    : isHa 
                    ? 'Fara Amfani da Premium Yanzu' 
                    : `Start Using ${trialDurationHours}h Free Premium`}
                </span>
              </button>

              <button
                onClick={() => {
                  markTrialPopupSeen();
                  onClose();
                }}
                className="w-full py-2.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
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
