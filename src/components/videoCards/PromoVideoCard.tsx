import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Crown, 
  Shield, 
  Zap, 
  Compass, 
  Layers, 
  Orbit, 
  Moon, 
  Gem, 
  Flame,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Tag,
  ArrowRight,
  Gift,
  Radio,
  CheckCircle2,
  X
} from 'lucide-react';
import { PromoAnnouncement } from '../../types/promoAnnouncement';
import { getPresetById } from '../../types/updateCards';
import { VideoCardBackground } from './VideoCardBackground';
import { useLanguage } from '../../contexts/LanguageContext';

interface PromoVideoCardProps {
  announcement: PromoAnnouncement;
  onApplyCode?: (code: string) => void;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
  isCompact?: boolean;
}

const ICONS_MAP = {
  Sparkles,
  Crown,
  Shield,
  Zap,
  Compass,
  Layers,
  Orbit,
  Moon,
  Gem,
  Flame
};

export const PromoVideoCard: React.FC<PromoVideoCardProps> = ({
  announcement,
  onApplyCode,
  onClose,
  showCloseButton = false,
  className = '',
  isCompact = false
}) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  const preset = getPresetById(announcement.videoCardTheme || 'golden-geometry');
  const IconComponent = ICONS_MAP[preset.iconName] || Crown;

  // Multilingual text resolution
  const title = language === 'fr'
    ? announcement.titleFr
    : language === 'ha'
    ? (announcement.titleHa || announcement.titleFr)
    : (announcement.titleEn || announcement.titleFr);

  const description = language === 'fr'
    ? announcement.descriptionFr
    : language === 'ha'
    ? (announcement.descriptionHa || announcement.descriptionFr)
    : (announcement.descriptionEn || announcement.descriptionFr);

  const badge = language === 'fr'
    ? announcement.badgeFr
    : language === 'ha'
    ? (announcement.badgeHa || announcement.badgeFr)
    : (announcement.badgeEn || announcement.badgeFr);

  const benefit = language === 'fr'
    ? announcement.benefitFr
    : language === 'ha'
    ? (announcement.benefitHa || announcement.benefitFr)
    : (announcement.benefitEn || announcement.benefitFr);

  const ctaText = language === 'fr'
    ? announcement.ctaTextFr
    : language === 'ha'
    ? (announcement.ctaTextHa || announcement.ctaTextFr)
    : (announcement.ctaTextEn || announcement.ctaTextFr);

  const perks = language === 'fr'
    ? (announcement.perksFr || [])
    : language === 'ha'
    ? (announcement.perksHa || announcement.perksFr || [])
    : (announcement.perksEn || announcement.perksFr || []);

  // Expiration countdown
  useEffect(() => {
    if (!announcement.hasExpiry || !announcement.expiryDate) {
      setTimeLeft(null);
      return;
    }

    const calculateTime = () => {
      const target = new Date(announcement.expiryDate!).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [announcement.hasExpiry, announcement.expiryDate]);

  // Audio effect
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const freq = preset.audioEffectFreq || 528;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // AudioContext unavailable
    }
  };

  const handleCopyCode = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!announcement.promoCode) return;

    playChime();
    navigator.clipboard.writeText(announcement.promoCode.trim().toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleApply = () => {
    playChime();
    handleCopyCode();
    if (onApplyCode) {
      onApplyCode(announcement.promoCode);
    } else {
      // Navigate to payment page with promo code prefilled
      const code = encodeURIComponent(announcement.promoCode.trim().toUpperCase());
      window.location.href = `/payment?code=${code}`;
    }
  };

  return (
    <div 
      className={`relative w-full rounded-[28px] sm:rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 flex flex-col justify-between ${className}`}
      style={{
        borderColor: `${preset.accentColor}90`,
        boxShadow: `0 0 45px ${preset.glowColor}`
      }}
    >
      {/* Background with video/particles */}
      <VideoCardBackground preset={preset} isPaused={isPaused} />

      {/* Main Content Container */}
      <div className="relative z-10 p-4 sm:p-6 flex flex-col justify-between h-full space-y-4">
        
        {/* Top Header Bar with Live Badge & Close Button */}
        <div className="flex items-center justify-between gap-2">
          {/* Glowing Animated Badge */}
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-md">
            <Radio size={13} className="text-emerald-400 animate-pulse shrink-0" />
            <span 
              className="text-[11px] sm:text-xs font-black uppercase tracking-wider"
              style={{ color: preset.accentColor }}
            >
              {badge || '👑 OFFRE VIP PROMO'}
            </span>
          </div>

          {/* Expiration Timer or Close button */}
          <div className="flex items-center gap-2">
            {timeLeft && (
              <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold shadow-sm">
                <Clock size={12} className="animate-spin text-amber-400" style={{ animationDuration: '4s' }} />
                <span>
                  {String(timeLeft.hours).padStart(2, '0')}h:{String(timeLeft.minutes).padStart(2, '0')}m:{String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            )}

            {showCloseButton && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-gray-300 hover:text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-md"
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Feature Box (Card Middle) */}
        <div className="bg-black/55 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 space-y-3 shadow-inner">
          
          {/* Main Title & Benefit */}
          <div className="space-y-1.5">
            <div className="flex items-start gap-2.5">
              <IconComponent 
                size={22} 
                className="shrink-0 mt-0.5" 
                style={{ color: preset.accentColor }} 
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide uppercase leading-snug drop-shadow-md">
                  {title}
                </h2>
                {benefit && (
                  <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-md bg-white/10 text-xs sm:text-sm font-black text-amber-300 border border-amber-400/30">
                    <Gift size={13} className="text-amber-400" />
                    <span>{benefit}</span>
                  </div>
                )}
              </div>
            </div>

            {description && (
              <p className="text-xs sm:text-[13px] text-gray-200 leading-relaxed pt-1">
                {description}
              </p>
            )}
          </div>

          {/* Perks Bullet List */}
          {perks.length > 0 && (
            <ul className="space-y-1.5 pt-2 border-t border-white/10">
              {perks.slice(0, 4).map((perk, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] text-gray-200 font-medium">
                  <CheckCircle2 
                    size={14} 
                    className="shrink-0 mt-0.5" 
                    style={{ color: preset.accentColor }}
                  />
                  <span className="flex-1 leading-snug">{perk}</span>
                </li>
              ))}
            </ul>
          )}

          {/* PROMO CODE GOLDEN TICKET BOX */}
          <div className="pt-2">
            <div className="bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-emerald-500/15 border-2 border-dashed border-amber-400/60 rounded-xl p-3 flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Tag size={16} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    {language === 'fr' ? 'Code Promo Officiel :' : language === 'ha' ? 'Lambar Rangwame :' : 'Official Promo Code:'}
                  </span>
                  <span className="text-base sm:text-lg font-mono font-black text-amber-300 tracking-wider select-all block truncate">
                    {announcement.promoCode.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopyCode}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-400 hover:bg-amber-300 text-gray-950 active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={14} className="font-black" />
                    <span>{language === 'fr' ? 'Copié !' : language === 'ha' ? 'An Kwafa!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>{language === 'fr' ? 'Copier' : language === 'ha' ? 'Kwafa' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="space-y-2 pt-1">
          {/* Primary Action Button (Gradient button according to preset) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleApply}
            className={`w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r ${preset.buttonGradient} text-white font-black text-sm sm:text-base shadow-lg flex items-center justify-center gap-2.5 cursor-pointer transition-all border border-white/20 active:opacity-90`}
            style={{
              boxShadow: `0 8px 25px ${preset.glowColor}`
            }}
          >
            <Sparkles size={18} className="shrink-0" />
            <span className="tracking-wide">
              {ctaText || (language === 'fr' ? 'Copier & Débloquer VIP' : 'Copy Code & Unlock VIP')}
            </span>
            <ArrowRight size={18} className="shrink-0" />
          </motion.button>

          {/* Bottom Security / Immediate Activation guarantee */}
          <div className="text-center pt-0.5 flex items-center justify-center gap-1.5 text-gray-300/90 font-mono text-[11px]">
            <Shield size={12} className="text-emerald-400 shrink-0" />
            <span>
              {language === 'fr' 
                ? 'Activation 100% instantanée sans engagement' 
                : language === 'ha' 
                ? 'Kunna aiki kai tsaye ba tare da jinkiri ba' 
                : '100% Instant unlock, no commitment'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
