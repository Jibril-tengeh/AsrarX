import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gift, Crown, Clock, CheckCircle2, ChevronRight, X, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getReferralConfig, ReferralConfig, DEFAULT_REFERRAL_CONFIG } from '../services/referralService';

interface ReferralWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  referrerName?: string;
  hoursAwarded?: number;
  welcomeTitle?: string;
  welcomeMessage?: string;
  customVideoUrl?: string;
  lang?: 'fr' | 'en' | 'ha';
}

export const ReferralWelcomeModal: React.FC<ReferralWelcomeModalProps> = ({
  isOpen,
  onClose,
  referrerName,
  hoursAwarded,
  welcomeTitle,
  welcomeMessage,
  customVideoUrl,
  lang
}) => {
  const { language } = useLanguage();
  const [config, setConfig] = useState<ReferralConfig>(DEFAULT_REFERRAL_CONFIG);

  useEffect(() => {
    if (isOpen) {
      getReferralConfig().then(cfg => {
        if (cfg) setConfig(cfg);
      }).catch(() => {});
    }
  }, [isOpen]);

  // Determine active language: priority to explicit prop, otherwise user's current app language
  const activeLang: 'fr' | 'en' | 'ha' = lang || (language === 'ha' ? 'ha' : language === 'en' ? 'en' : 'fr');
  
  const isFr = activeLang === 'fr';
  const isHa = activeLang === 'ha';

  const effectiveHours = hoursAwarded ?? config.refereeRewardHours ?? 1;
  const effectiveVideo = customVideoUrl || config.customVideoUrl || DEFAULT_REFERRAL_CONFIG.customVideoUrl;

  const defaultReferrer = isFr ? 'Votre Parrain' : isHa ? 'Mai Gayyatarku' : 'Your Sponsor';
  const displayReferrer = referrerName || defaultReferrer;

  // Title translation
  const displayTitle = welcomeTitle || (
    isFr
      ? (config.welcomeTitleFr || DEFAULT_REFERRAL_CONFIG.welcomeTitleFr)
      : isHa
      ? (config.welcomeTitleHa || DEFAULT_REFERRAL_CONFIG.welcomeTitleHa)
      : (config.welcomeTitleEn || DEFAULT_REFERRAL_CONFIG.welcomeTitleEn)
  );

  // Message translation
  const displayMessage = welcomeMessage || (
    isFr
      ? (config.welcomeMessageFr || DEFAULT_REFERRAL_CONFIG.welcomeMessageFr)
      : isHa
      ? (config.welcomeMessageHa || DEFAULT_REFERRAL_CONFIG.welcomeMessageHa)
      : (config.welcomeMessageEn || DEFAULT_REFERRAL_CONFIG.welcomeMessageEn)
  );

  // Sponsor subtitle
  const sponsorTag = isFr
    ? `Parrainé par ${displayReferrer}`
    : isHa
    ? `Gayyatar ${displayReferrer}`
    : `Sponsored by ${displayReferrer}`;

  // Hours label & badge
  const hoursLabel = isFr
    ? (effectiveHours > 1 ? 'Heures' : 'Heure')
    : isHa
    ? (effectiveHours > 1 ? "Sa'o'i" : "Sa'a")
    : (effectiveHours > 1 ? 'Hours' : 'Hour');

  const badgeGiftLabel = isFr
    ? (effectiveHours > 1 ? 'OFFERTES' : 'OFFERTE')
    : isHa
    ? 'KYAUTA'
    : 'FREE';

  // Subtitle in reward box
  const rewardSubtitle = isFr
    ? 'Accès Premium Immédiat & Sans Publicité'
    : isHa
    ? 'Cikakken Premium ba tare da Talla ba'
    : 'Instant Ad-Free Premium Access';

  // Features list
  const featuresList = isFr
    ? [
        'Tous les Secrets Sacrés',
        'Calculateurs & Sceaux Sacrés',
        'Téléchargements Hors Ligne',
        'Récitations Audio HD'
      ]
    : isHa
    ? [
        'Duk Asiran Addini',
        'Lissafin Abjad & Hatimi',
        'Saukarwa ba tare da Intanet ba',
        'Sautin Karatun HD'
      ]
    : [
        'All Sacred Secrets',
        'Calculators & Sacred Seals',
        'Offline Downloads',
        'HD Audio Recitations'
      ];

  // Button text
  const buttonText = isFr
    ? 'Commencer mon Expérience Premium'
    : isHa
    ? 'Fara Amfani da Premium'
    : 'Start My Premium Experience';

  // Close aria
  const closeAria = isFr ? 'Fermer' : isHa ? 'Rufe' : 'Close';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-gray-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-amber-500/40"
          >
            {/* Ambient Background Video / Radiant Aura */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-45 overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover filter blur-[1px] scale-105"
                src={effectiveVideo}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
            </div>

            {/* Glowing Orbs */}
            <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-amber-500/25 blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-emerald-500/25 blur-3xl pointer-events-none animate-pulse" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-gray-300 hover:text-white hover:bg-black/60 transition-all border border-white/10"
              aria-label={closeAria}
            >
              <X size={18} />
            </button>

            {/* Content Container */}
            <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center text-center">
              
              {/* Badge & Crown Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="relative mb-5"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-500 p-0.5 shadow-[0_0_35px_rgba(245,158,11,0.5)] flex items-center justify-center">
                  <div className="w-full h-full bg-gray-950/90 rounded-[22px] flex items-center justify-center">
                    <Gift size={40} className="text-amber-400 animate-bounce" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1 border border-white/20">
                  <Crown size={11} /> VIP
                </div>
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2"
              >
                {displayTitle}
              </motion.h3>

              {/* Sponsor Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-4 border border-amber-400/20 backdrop-blur-md"
              >
                <HeartHandshake size={14} />
                <span>{sponsorTag}</span>
              </motion.div>

              {/* Reward Highlight Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-amber-500/15 rounded-2xl p-4 mb-5 border border-amber-400/30 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center gap-3 text-amber-300">
                  <Clock size={24} className="animate-spin text-amber-400 shrink-0" />
                  <div className="text-left">
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                      <span>+{effectiveHours} {hoursLabel}</span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 font-bold uppercase tracking-wider">
                        {badgeGiftLabel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-0.5 font-medium">
                      {rewardSubtitle}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Description Body */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md mb-6"
              >
                {displayMessage}
              </motion.p>

              {/* Features List Mini */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-2 w-full mb-6 text-left"
              >
                {featuresList.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </motion.div>

              {/* Action Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 text-gray-950 font-black text-sm sm:text-base shadow-[0_4px_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer hover:brightness-105"
              >
                <Sparkles size={18} className="animate-spin" />
                <span>{buttonText}</span>
                <ChevronRight size={18} />
              </motion.button>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

