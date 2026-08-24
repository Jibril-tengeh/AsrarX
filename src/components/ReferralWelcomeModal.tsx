import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gift, Crown, Clock, CheckCircle2, ChevronRight, X, HeartHandshake, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ReferralWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  referrerName?: string;
  hoursAwarded?: number;
  welcomeTitle?: string;
  welcomeMessage?: string;
  customVideoUrl?: string;
}

export const ReferralWelcomeModal: React.FC<ReferralWelcomeModalProps> = ({
  isOpen,
  onClose,
  referrerName = 'Votre Parrain',
  hoursAwarded = 6,
  welcomeTitle,
  welcomeMessage,
  customVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1610-large.mp4'
}) => {
  const { language } = useLanguage();
  const [videoLoaded, setVideoLoaded] = useState(false);

  const isFr = language === 'fr';
  const isHa = language === 'ha';

  const defaultTitle = isFr
    ? "Félicitations ! Accès Premium Débloqué 🎁"
    : isHa
    ? "Taya Murna! An Buɗe Damar Premium 🎁"
    : "Congratulations! Premium Access Unlocked 🎁";

  const defaultDesc = isFr
    ? `Grâce à l'invitation de ${referrerName}, vous bénéficiez immédiatement de ${hoursAwarded} heures d'accès Premium complet et illimité à tous les secrets sacrés d'AsrarHub.`
    : isHa
    ? `Godiya ga gayyatar da ${referrerName} ya yi muku, yanzu haka kuna da sa'o'i ${hoursAwarded} na cikakken damar Premium kyauta a AsrarHub.`
    : `Thanks to the invitation from ${referrerName}, you immediately enjoy ${hoursAwarded} hours of full and unlimited Premium access to all sacred secrets of AsrarHub.`;

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
                onLoadedData={() => setVideoLoaded(true)}
                className="w-full h-full object-cover filter blur-[1px] scale-105"
                src={customVideoUrl}
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
              aria-label="Fermer"
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
                {welcomeTitle || defaultTitle}
              </motion.h3>

              {/* Sponsor Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-4 border border-amber-400/20 backdrop-blur-md"
              >
                <HeartHandshake size={14} />
                <span>
                  {isFr ? `Parrainé par ${referrerName}` : isHa ? `Gayyatar ${referrerName}` : `Sponsored by ${referrerName}`}
                </span>
              </motion.div>

              {/* Reward Highlight Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-amber-500/15 rounded-2xl p-4 mb-5 border border-amber-400/30 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center gap-3 text-amber-300">
                  <Clock size={24} className="animate-spin text-amber-400" />
                  <div className="text-left">
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-1">
                      <span>+{hoursAwarded} Heures</span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 font-bold uppercase tracking-wider">
                        Offertes
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {isFr ? "Accès Premium Immédiat & Sans Publicité" : isHa ? "Cikakken Premium ba tare da Talla ba" : "Instant Ad-Free Premium Access"}
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
                {welcomeMessage || defaultDesc}
              </motion.p>

              {/* Features List Mini */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-2 w-full mb-6 text-left"
              >
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{isFr ? "Tous les Secrets Sacrés" : isHa ? "Duk Asirai" : "All Sacred Secrets"}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{isFr ? "Calculateurs & Khatims" : isHa ? "Lissafin Abjad" : "Calculators & Seals"}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{isFr ? "Téléchargements Hors Ligne" : isHa ? "Zazzagewa" : "Offline Downloads"}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{isFr ? "Audio & Récitations HD" : isHa ? "Sautin Murya" : "HD Audio Recitations"}</span>
                </div>
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
                <span>
                  {isFr ? "Commencer mon Expérience Premium" : isHa ? "Fara Amfani da Premium" : "Start My Premium Experience"}
                </span>
                <ChevronRight size={18} />
              </motion.button>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
