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
  onUpdateClick,
  onSecondaryAction,
  secondaryActionLabel,
  className = ''
}) => {
  const { language } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isClicked, setIsClicked] = useState(false);

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
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 transition-all duration-500 flex flex-col justify-between ${className}`}
      style={{
        borderColor: preset.accentColor,
        boxShadow: `0 0 45px ${preset.glowColor}`
      }}
    >
      {/* Dynamic Motion Video & Particle Background */}
      <VideoCardBackground preset={preset} isPaused={isPaused} />

      {/* Card Content Container */}
      <div className="relative z-10 p-5 sm:p-7 flex flex-col justify-between h-full space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div 
              className="p-2.5 rounded-2xl backdrop-blur-md shadow-lg border flex items-center justify-center text-white transition-transform hover:scale-110"
              style={{
                backgroundColor: `${preset.accentColor}30`,
                borderColor: `${preset.accentColor}60`,
                boxShadow: `0 0 15px ${preset.glowColor}`
              }}
            >
              <IconComponent size={20} className="animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full border shadow-sm"
                  style={{
                    backgroundColor: `${preset.accentColor}25`,
                    borderColor: `${preset.accentColor}60`,
                    color: '#ffffff'
                  }}
                >
                  {cardBadge}
                </span>

                <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <Radio size={10} className="animate-ping" />
                  Live Sync
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight mt-0.5 drop-shadow-md">
                {cardTitle}
              </h3>
            </div>
          </div>

          {/* Quick Media Controls */}
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title={isPaused ? "Reprendre l'animation vidéo" : "Mettre en pause la vidéo"}
            >
              {isPaused ? <Play size={13} /> : <Pause size={13} />}
            </button>
            <button
              type="button"
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (!nextMuted) playChime();
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                !isMuted ? 'text-emerald-400 bg-emerald-500/20' : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              title={isMuted ? "Activer les effets sonores" : "Couper le son"}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
          </div>
        </div>

        {/* Center Visual Feature & Version Showcase */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone size={13} className="text-emerald-400" />
                {language === 'fr' ? 'Version Prête' : language === 'ha' ? 'Sabuwar Siga' : 'Target Release'}
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-white tracking-tight">
                  v{targetRelease.version}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  (Build #{targetRelease.versionCode})
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
              <span className="text-[11px] text-gray-400 block font-mono">
                {language === 'fr' ? 'Installée' : language === 'ha' ? 'Wacce ke ciki' : 'Installed'}: v{currentInstalledVersion}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400">
                <Sparkles size={12} />
                {isForceUpdate 
                  ? (language === 'fr' ? 'Mise à niveau obligatoire' : 'Sabuntawa ta Dole')
                  : (language === 'fr' ? 'Mise à niveau recommandée' : 'Sabuntawa mai kyau')}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed drop-shadow">
            {cardSubtitle}
          </p>

          {/* Highlights Checklist */}
          {localizedRel.highlights && localizedRel.highlights.length > 0 && (
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 space-y-2">
              <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={13} style={{ color: preset.accentColor }} />
                {localizedRel.title || (language === 'fr' ? 'Nouveautés & Correctifs' : 'Abubuwan da aka sabunta')}
              </div>
              <ul className="space-y-1.5">
                {localizedRel.highlights.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-100 leading-snug">
                    <span 
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 shadow-sm"
                      style={{ backgroundColor: preset.accentColor }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Call to Action Section */}
        <div className="space-y-3 pt-2">
          {/* Dynamic Click Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleMainButtonClick}
            className={`w-full py-4 px-6 rounded-2xl bg-gradient-to-r ${preset.buttonGradient} text-white font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-3 cursor-pointer transition-all border border-white/30 relative overflow-hidden group`}
            style={{
              boxShadow: `0 10px 25px ${preset.glowColor}`
            }}
          >
            {/* Glossy sweep shine on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none" />

            <DownloadCloud size={20} className="shrink-0 transition-transform group-hover:-translate-y-0.5" />
            <span className="tracking-wide">
              {language === 'fr'
                ? `Mettre à Jour vers v${targetRelease.version}`
                : language === 'ha'
                ? `Sauke Sabuntawa v${targetRelease.version}`
                : `Update to v${targetRelease.version}`}
            </span>
            <ExternalLink size={16} className="shrink-0 opacity-80" />
          </motion.button>

          {/* Secondary Quick Action */}
          {onSecondaryAction && secondaryActionLabel && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-md border border-white/10"
            >
              <RefreshCw size={13} />
              <span>{secondaryActionLabel}</span>
            </button>
          )}

          {/* Subtle APK note */}
          <div className="text-center">
            <span className="text-[10px] text-gray-400/90 font-mono tracking-tight">
              {targetRelease.apkDownloadUrl ? '📦 Téléchargement direct disponible' : '⚡ Synchronisation automatique et sécurisée'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
