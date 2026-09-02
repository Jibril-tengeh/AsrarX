import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  Layers, 
  Share2, 
  Check, 
  X, 
  ShieldAlert, 
  Film, 
  Zap, 
  Crown,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { VersionRelease, getLocalizedRelease } from '../../config/appVersion';
import { getPresetById, VideoCardThemeId, VIDEO_CARD_PRESETS } from '../../types/updateCards';
import { useLanguage } from '../../contexts/LanguageContext';
import { appVersionService } from '../../services/appVersionService';
import { ChangelogModal } from '../ChangelogModal';
import { checkVersionAndPurgeCache } from '../../App';

interface Version3DVideoNotificationModalProps {
  isOpen: boolean;
  targetRelease: VersionRelease;
  currentInstalledVersion: string;
  previousVersion?: string | null;
  isForceUpdate?: boolean;
  onDismiss: () => void;
  onForceRefresh?: () => void;
}

export const Version3DVideoNotificationModal: React.FC<Version3DVideoNotificationModalProps> = ({
  isOpen,
  targetRelease,
  currentInstalledVersion,
  previousVersion,
  isForceUpdate = false,
  onDismiss,
  onForceRefresh
}) => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStep, setRefreshStep] = useState<string | null>(null);
  const [showChangelog, setShowChangelog] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // 3D Card Interactive Tilt
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Selected Theme Preset
  const themeId: VideoCardThemeId = targetRelease.videoCardTheme || 'cyber-emerald';
  const preset = getPresetById(themeId) || VIDEO_CARD_PRESETS[2];
  const localizedRel = getLocalizedRelease(targetRelease, language);

  // Video Source URL (Admin custom URL or Preset URL)
  const effectiveVideoUrl = targetRelease.customVideoUrl || preset.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-green-lines-and-dots-42337-large.mp4';
  const isYouTube = effectiveVideoUrl.includes('youtube.com') || effectiveVideoUrl.includes('youtu.be');
  const isForced = isForceUpdate || targetRelease.forceVideoModal || targetRelease.forceUpdate;

  // YouTube embed ID extractor
  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1` : url;
  };

  // 3D Card Tilt on Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rX = -((y - centerY) / centerY) * 7; // Max 7 deg
    const rY = ((x - centerX) / centerX) * 7;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Video playback listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isYouTube) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration) {
        setVideoProgress((video.currentTime / video.duration) * 100);
      }
    };

    const onLoadedMetadata = () => {
      setVideoDuration(video.duration);
      setIsVideoLoaded(true);
      setVideoError(false);
    };

    const onError = () => {
      console.warn('[Version3DVideo] Video failed to load, falling back to 3D procedural effect:', effectiveVideoUrl);
      setVideoError(true);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('error', onError);

    // Autoplay attempt
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsVideoLoaded(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('error', onError);
    };
  }, [effectiveVideoUrl, isYouTube, isOpen]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = targetRelease.apkDownloadUrl || targetRelease.downloadUrl || window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    setRefreshStep(language === 'fr' ? 'Nettoyage des données et rechargement...' : 'Purging caches & reloading...');
    appVersionService.markVersionInstalled(targetRelease.version);
    try {
      if (onForceRefresh) {
        onForceRefresh();
      } else {
        await checkVersionAndPurgeCache(true);
      }
    } catch (err) {
      console.warn('[Version3DVideo] Purge error:', err);
    } finally {
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    appVersionService.markVersionInstalled(targetRelease.version);
    onDismiss();
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div 
          id="asrarhub-version-3d-video-popup-overlay"
          className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto select-none"
          onClick={(e) => {
            // If forced, do not dismiss on backdrop click
            if (!isForced && e.target === e.currentTarget) {
              handleDismiss();
            }
          }}
        >
          {/* 3D Perspective Container */}
          <div 
            className="w-full max-w-lg my-auto py-2"
            style={{ perspective: 1200 }}
          >
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, scale: 0.88, y: 40, rotateX: 15 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                rotateX: rotateX,
                rotateY: rotateY,
                transition: { type: 'spring', damping: 24, stiffness: 260 }
              }}
              exit={{ opacity: 0, scale: 0.88, y: 30 }}
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: `0 0 50px ${preset.glowColor}, 0 25px 50px -12px rgba(0,0,0,0.85)`
              }}
              className="relative w-full rounded-[28px] sm:rounded-[32px] overflow-hidden bg-gradient-to-b from-gray-900/98 via-gray-950/98 to-black text-white border border-white/20 shadow-2xl backdrop-blur-2xl transition-transform duration-100 ease-out"
            >
              {/* Outer Ambient Glowing Neon Rim */}
              <div 
                className="absolute inset-0 opacity-40 pointer-events-none rounded-[32px]"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${preset.accentColor} 0%, transparent 70%)`
                }}
              />

              {/* Top Bar Header with 3D Holographic Badges */}
              <div className="relative z-20 px-5 pt-4 pb-3 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg border border-white/20"
                    style={{ background: `linear-gradient(135deg, ${preset.accentColor}, #000)` }}
                  >
                    <Sparkles size={16} className="text-white animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase text-emerald-400">
                        {targetRelease.videoTitle || (language === 'fr' ? 'NOUVELLE VERSION DISPONIBLE' : 'NEW VERSION AVAILABLE')}
                      </span>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-200">
                      {previousVersion ? `v${previousVersion} → v${targetRelease.version}` : `Version v${targetRelease.version}`}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span 
                    className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm"
                    style={{ 
                      borderColor: `${preset.accentColor}80`, 
                      backgroundColor: `${preset.accentColor}20`,
                      color: preset.accentColor 
                    }}
                  >
                    {preset.badgeFr || '3D CINEMA'}
                  </span>

                  {/* Close button only if NOT forced */}
                  {!isForced && (
                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer border border-white/10"
                      title="Fermer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* 3D Video Theater Viewport */}
              <div className="relative z-10 w-full bg-black aspect-video sm:h-56 max-h-64 overflow-hidden group">
                {isYouTube ? (
                  <iframe
                    src={getYouTubeEmbedUrl(effectiveVideoUrl)}
                    title="Version Video Showcase"
                    className="w-full h-full object-cover border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      src={effectiveVideoUrl}
                      poster={targetRelease.videoPoster}
                      playsInline
                      muted={isMuted}
                      loop
                      autoPlay
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onClick={togglePlay}
                    />

                    {/* Fallback procedural glow if video is loading or errored */}
                    {videoError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-950 via-slate-900 to-black">
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-2xl animate-pulse"
                          style={{ background: preset.accentColor }}
                        >
                          <Film size={26} className="text-white" />
                        </div>
                        <span className="text-xs font-bold text-gray-300">
                          {targetRelease.title || `AsrarHub v${targetRelease.version}`}
                        </span>
                      </div>
                    )}

                    {/* 3D Glass Video Overlay Gradient */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-gray-950 via-transparent to-black/30" />

                    {/* Top Video Indicators */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-extrabold text-white tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        <span>HD 1080P PRO</span>
                      </div>

                      <div className="flex items-center gap-1.5 pointer-events-auto">
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-all active:scale-90 cursor-pointer shadow-lg"
                          title={isMuted ? 'Activer le son' : 'Couper le son'}
                        >
                          {isMuted ? <VolumeX size={14} className="text-amber-400" /> : <Volume2 size={14} className="text-emerald-400" />}
                        </button>
                      </div>
                    </div>

                    {/* Centered Play/Pause Button on Hover / Tap */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className={`pointer-events-auto p-4 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-lg border border-white/20 transition-all active:scale-90 cursor-pointer shadow-2xl ${
                          isPlaying ? 'opacity-0 group-hover:opacity-90' : 'opacity-100'
                        }`}
                        title={isPlaying ? 'Pause' : 'Lecture'}
                      >
                        {isPlaying ? <Pause size={22} /> : <Play size={22} className="translate-x-0.5 text-emerald-400" />}
                      </button>
                    </div>

                    {/* Bottom Video Timeline Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 pointer-events-none">
                      <div 
                        className="h-full transition-all duration-200"
                        style={{ 
                          width: `${videoProgress}%`,
                          backgroundColor: preset.accentColor,
                          boxShadow: `0 0 8px ${preset.accentColor}`
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Version Content & Features Highlights */}
              <div className="relative z-20 p-4 sm:p-5 space-y-3.5">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <CheckCircle2 size={18} style={{ color: preset.accentColor }} className="shrink-0" />
                    <span>{localizedRel.title || `Mise à Jour v${targetRelease.version}`}</span>
                  </h2>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    {targetRelease.videoSubtitle || preset.subtitleFr || (language === 'fr' ? 'Profitez des nouvelles fonctionnalités, optimisations de vitesse et corrections.' : 'Enjoy new features, speed optimizations and bug fixes.')}
                  </p>
                </div>

                {/* Highlights List */}
                {localizedRel.highlights && localizedRel.highlights.length > 0 && (
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 max-h-36 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-white/20">
                    {localizedRel.highlights.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-200">
                        <span 
                          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" 
                          style={{ backgroundColor: preset.accentColor }} 
                        />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Forced Interactive Action Buttons */}
                <div className="pt-1 space-y-2">
                  {/* Primary Force Refresh / Upgrade Action Button */}
                  <button
                    id="btn-3d-video-force-refresh"
                    type="button"
                    onClick={handleForceRefresh}
                    disabled={isRefreshing}
                    className="w-full py-3.5 px-4 rounded-2xl text-white font-black text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-70 uppercase border border-white/20"
                    style={{
                      background: `linear-gradient(135deg, ${preset.accentColor}, #0f766e)`,
                      boxShadow: `0 4px 20px ${preset.glowColor}`
                    }}
                  >
                    <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                    <span>
                      {isRefreshing 
                        ? (refreshStep || (language === 'fr' ? 'Application en cours...' : 'Applying...')) 
                        : (language === 'fr' ? '⚡ Appliquer & Recharger (Force Refresh)' : '⚡ Apply & Refresh Now')}
                    </span>
                  </button>

                  {/* Secondary Actions (Changelog & Share / APK) */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowChangelog(true)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                    >
                      <Layers size={14} className="text-emerald-400" />
                      <span>{language === 'fr' ? 'Voir toutes les nouveautés' : 'View Changelog'}</span>
                    </button>

                    {targetRelease.apkDownloadUrl && (
                      <a
                        href={targetRelease.apkDownloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30 transition-colors cursor-pointer"
                      >
                        <Download size={14} />
                        <span>APK</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs flex items-center justify-center gap-1 border border-white/5 transition-colors cursor-pointer"
                      title="Copier le lien"
                    >
                      {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatePresence>

      {/* Changelog detailed modal */}
      <ChangelogModal
        isOpen={showChangelog}
        onClose={() => {
          setShowChangelog(false);
          handleDismiss();
        }}
        initialSelectedVersion={targetRelease.version}
      />
    </>
  );
};
