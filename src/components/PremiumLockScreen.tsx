import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Crown,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  X,
  ShieldCheck,
  Star,
  Flame,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { getToolDisplayName } from "../utils/toolNames";

interface PremiumLockScreenProps {
  toolName?: string;
  onBack?: () => void;
  onClose?: () => void;
  variant?: "screen" | "modal" | "embedded";
  className?: string;
}

export const PremiumLockScreen: React.FC<PremiumLockScreenProps> = ({
  toolName,
  onBack,
  onClose,
  variant = "screen",
  className = "",
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const displayToolTitle = toolName ? getToolDisplayName(toolName, language) : "";

  // Cinematic glowing golden particle background loop
  const videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-golden-particles-floating-slowly-41525-large.mp4";
  const posterUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80";

  const getTexts = () => {
    if (language === "ha") {
      return {
        badge: "GATA NA MUSAMMAN (VIP)",
        title: "Na Mambobin Premium Ne Kawai",
        desc: displayToolTitle
          ? `Wannan kayan aiki (${displayToolTitle}) na cikin kebantattun damammaki na mambobin Premium a AsrarHub.`
          : "Wannan kayan aiki na mambobin Premium ne kadai a AsrarHub.",
        perks: [
          "Bude dukkan asirai da kayan aikin Khassa",
          "Lissafin Ilmi da zane-zanen hatimi ba iyaka",
          "Samun taimako da sabbin bayanai a kan lokaci",
        ],
        btnUpgrade: "Zama Mamba Premium",
        btnBack: "Koma ga Kayan Aiki",
        btnCancel: "Rufe",
      };
    }
    if (language === "en") {
      return {
        badge: "VIP EXCLUSIVE ACCESS",
        title: "Reserved for Premium Members",
        desc: displayToolTitle
          ? `The tool (${displayToolTitle}) is part of exclusive privileges reserved for AsrarHub Premium subscribers.`
          : "This tool is exclusively available for AsrarHub Premium subscribers.",
        perks: [
          "Unlimited access to all esoteric & Khassa tools",
          "Advanced mystical calculations & sacred seals",
          "Priority updates and unlimited daily usage",
        ],
        btnUpgrade: "Upgrade to Premium",
        btnBack: "Back to Tools",
        btnCancel: "Close",
      };
    }
    // French default
    return {
      badge: "ACCÈS PRIVILÈGE VIP",
      title: "Réservé aux Membres Premium",
      desc: displayToolTitle
        ? `L'outil « ${displayToolTitle} » fait partie des privilèges exclusifs réservés aux abonnés Premium d'AsrarHub.`
        : "Cet outil fait partie des privilèges exclusifs réservés aux abonnés Premium d'AsrarHub.",
      perks: [
        "Accès illimité à tous les secrets & outils Khassa",
        "Calculs mystiques avancés & génération de sceaux",
        "Utilisation illimitée sans aucune restriction",
      ],
      btnUpgrade: "Devenir Membre Premium",
      btnBack: "Retour aux Outils",
      btnCancel: "Fermer",
    };
  };

  const texts = getTexts();

  const handleUpgradeClick = () => {
    navigate("/payment");
  };

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-amber-500/40 bg-gray-950 text-white flex flex-col justify-between ${
        variant === "modal" ? "max-h-[92vh] overflow-y-auto" : ""
      }`}
    >
      {/* Background Looping Video */}
      {!videoError && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover object-center opacity-45 filter brightness-95 saturate-150 scale-105"
          />
        </div>
      )}

      {/* Ambient Gradient Overlays for High Contrast & Absolute Readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-amber-950/85 via-gray-950/90 to-black/95 backdrop-blur-[3px]" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.25),transparent_70%)] pointer-events-none" />

      {/* Ambient Light Orbs */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-amber-500/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none animate-pulse" />

      {/* Close button for modal */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      )}

      {/* Main Card Content */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center text-center">
        
        {/* Top VIP Badge */}
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-black uppercase tracking-widest mb-5 shadow-md backdrop-blur-md"
        >
          <Crown size={14} className="text-amber-400 animate-pulse" />
          <span>{texts.badge}</span>
          <Sparkles size={12} className="text-amber-300 animate-spin" />
        </motion.div>

        {/* Center Glowing VIP Emblem */}
        <div className="relative mb-5">
          {/* Pulsing Gold Halo */}
          <div className="absolute -inset-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-full blur-lg opacity-70 animate-pulse" />
          
          <motion.div
            animate={{ 
              rotate: [0, 4, -4, 0],
              scale: [1, 1.02, 0.98, 1] 
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 p-0.5 shadow-2xl flex items-center justify-center border border-amber-200/60"
          >
            <div className="w-full h-full rounded-[14px] bg-black/45 backdrop-blur-xs flex items-center justify-center">
              <Crown size={40} className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] text-amber-300" />
            </div>
          </motion.div>

          {/* Secure Lock Badge */}
          <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-400 text-gray-950 shadow-lg border border-amber-200">
            <Lock size={12} className="stroke-[3]" />
          </span>
        </div>

        {/* Title with Ultra-Crisp Typography */}
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md mb-2 leading-snug">
          {texts.title}
        </h2>

        {/* Subtitle / Description */}
        <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed max-w-sm mb-5 drop-shadow-xs">
          {texts.desc}
        </p>

        {/* Perks & Benefits Section */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 sm:p-4 mb-6 backdrop-blur-md text-left space-y-2.5 shadow-inner">
          {texts.perks.map((perk, index) => (
            <div key={index} className="flex items-start gap-2.5 text-xs text-amber-100/95 font-semibold">
              <div className="p-0.5 rounded-full bg-amber-400/25 text-amber-300 shrink-0 mt-0.5 border border-amber-400/30">
                <CheckCircle2 size={12} className="stroke-[2.5]" />
              </div>
              <span className="leading-tight">{perk}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          {/* Primary CTA Upgrade Button */}
          <button
            type="button"
            onClick={handleUpgradeClick}
            className="relative group w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-gray-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] transition-all transform active:scale-98 border border-amber-300/60 overflow-hidden cursor-pointer"
          >
            {/* Shimmer Light Beam Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
            
            <Sparkles size={18} className="text-gray-950 animate-spin" />
            <span>{texts.btnUpgrade}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </button>

          {/* Secondary Action Button */}
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-gray-200 hover:text-white font-bold text-xs border border-white/10 transition-all cursor-pointer backdrop-blur-md"
            >
              <span>{texts.btnCancel}</span>
            </button>
          ) : onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-gray-200 hover:text-white font-bold text-xs border border-white/10 transition-all cursor-pointer backdrop-blur-md"
            >
              <ArrowLeft size={14} />
              <span>{texts.btnBack}</span>
            </button>
          ) : (
            <Link
              to="/tools"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-gray-200 hover:text-white font-bold text-xs border border-white/10 transition-all cursor-pointer backdrop-blur-md"
            >
              <ArrowLeft size={14} />
              <span>{texts.btnBack}</span>
            </Link>
          )}
        </div>

      </div>

      {/* Bottom Decorative Gold Tracing Line */}
      <div className="relative z-10 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-70" />
    </motion.div>
  );

  if (variant === "modal") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        {cardContent}
      </div>
    );
  }

  return (
    <div
      id="premium-lock-screen"
      className={`relative w-full min-h-[75vh] flex items-center justify-center p-4 sm:p-6 select-none ${className}`}
    >
      {cardContent}
    </div>
  );
};
