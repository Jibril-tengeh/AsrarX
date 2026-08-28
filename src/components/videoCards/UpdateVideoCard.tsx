import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  DownloadCloud, 
  ExternalLink, 
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
  CheckCircle2,
  RefreshCw,
  Smartphone,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { VideoCardPreset } from '../../types/updateCards';
import { VideoCardBackground } from './VideoCardBackground';
import { useLanguage } from '../../contexts/LanguageContext';
import { VersionRelease, getLocalizedRelease } from '../../config/appVersion';

interface UpdateVideoCardProps {
  preset: VideoCardPreset;
  targetRelease: VersionRelease;
  currentInstalledVersion?: string;
  isForceUpdate?: boolean;
  disableVideo?: boolean;
  onUpdateClick?: () => void;
  onSecondaryAction?: () => void;
  secondaryActionLabel?: string;
  showPresetSelector?: boolean;
  onSelectPreset?: (presetId: string) => void;
  className?: string;
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

export const UpdateVideoCard: React.FC<UpdateVideoCardProps> = ({
  preset,
  targetRelease,
  currentInstalledVersion = '1.1.1',
  isForceUpdate = false,
  disableVideo = false,
  onUpdateClick,
  onSecondaryAction,
  secondaryActionLabel,
  className = ''
}) => {
  const { language } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isClicked, setIsClicked] = useState(false);

  const isVideoDisabled = disableVideo || !!targetRelease?.disableVideoCard;
  const localizedRel = getLocalizedRelease(targetRelease, language);
  const IconComponent = ICONS_MAP[preset.iconName] || Sparkles;

  const cardTitle = language === 'fr' 
    ? preset.titleFr 
    : language === 'ha' 
    ? preset.titleHa 
    : preset.titleEn;

  const cardSubtitle = language === 'fr' 
    ? preset.subtitleFr 
    : language === 'ha' 
    ? preset.subtitleHa 
    : preset.subtitleEn;

  const cardBadge = language === 'fr' 
    ? preset.badgeFr 
    : language === 'ha' 
    ? preset.badgeHa 
    : preset.badgeEn;

  const downloadUrl = targetRelease.apkDownloadUrl || targetRelease.downloadUrl || '/';

  // Subtle web audio pleasant chime
  const playChime = () => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const freq = preset.audioEffectFreq || 528;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  const handleMainButtonClick = () => {
    playChime();
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);

    if (onUpdateClick) {
      onUpdateClick();
      return;
    }

    if (downloadUrl.startsWith('http://') || downloadUrl.startsWith('https://')) {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = downloadUrl;
    }
  };

  return (
    <div 
      className={`relative w-full rounded-[28px] sm:rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 flex flex-col justify-between ${className}`}
      style={{
        borderColor: `${preset.accentColor}80`,
        boxShadow: `0 0 35px ${preset.glowColor}`
      }}
    >
      {/* Background with video/particles or solid high-contrast dark theme */}
      {isVideoDisabled ? (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 border border-white/5" />
      ) : (
        <VideoCardBackground preset={preset} isPaused={isPaused} />
      )}

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6 flex flex-col justify-between h-full space-y-4">
        
        {/* Top Feature Box - Clean & Structured as in reference image */}
        <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 space-y-3">
          {/* Header Title with verified check icon */}
          <div className="flex items-start gap-2.5">
            <CheckCircle2 
              size={18} 
              className="shrink-0 mt-0.5" 
              style={{ color: preset.accentColor }} 
            />
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide uppercase leading-snug">
                {localizedRel.title || `UPDATE V${targetRelease.version}: ${cardTitle}`}
              </h2>
            </div>
          </div>

          {/* Highlights List with sleek accent bullets */}
          {localizedRel.highlights && localizedRel.highlights.length > 0 && (
            <ul className="space-y-2 pt-1">
              {localizedRel.highlights.slice(0, 4).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-gray-200 leading-relaxed font-medium">
                  <span 
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 shadow-sm"
                    style={{ backgroundColor: preset.accentColor }}
                  />
                  <span className="flex-1 min-w-0">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="space-y-2.5 pt-1">
          {/* Primary Action Button (Main Update Pill) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleMainButtonClick}
            className={`w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r ${preset.buttonGradient} text-white font-black text-sm sm:text-base shadow-lg flex items-center justify-center gap-2.5 cursor-pointer transition-all border border-white/20 active:opacity-90`}
            style={{
              boxShadow: `0 8px 20px ${preset.glowColor}`
            }}
          >
            <DownloadCloud size={18} className="shrink-0" />
            <span className="tracking-wide">
              {language === 'fr'
                ? `Update to v${targetRelease.version}`
                : language === 'ha'
                ? `Update to v${targetRelease.version}`
                : `Update to v${targetRelease.version}`}
            </span>
            <ExternalLink size={16} className="shrink-0 opacity-80" />
          </motion.button>

          {/* Secondary Action Button (Refresh Cache & Reload) */}
          {onSecondaryAction && secondaryActionLabel && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-md border border-white/10 shadow-sm"
            >
              <RefreshCw size={14} className="shrink-0" />
              <span>{secondaryActionLabel}</span>
            </button>
          )}

          {/* Bottom Security / Sync Status Note */}
          <div className="text-center pt-1 flex items-center justify-center gap-1.5 text-gray-300/90 font-mono text-[11px] sm:text-xs">
            <Zap size={13} className="text-amber-400 shrink-0" />
            <span className="tracking-tight">
              {language === 'fr' 
                ? 'Synchronisation automatique et sécurisée' 
                : language === 'ha' 
                ? 'Aiki da sabuntawa ta atomatik' 
                : 'Synchronisation automatique et sécurisée'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
