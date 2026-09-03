import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, ChevronRight, Sparkles } from 'lucide-react';
import { AsrarLogo } from './AsrarLogo';
import { useAppBranding } from '../contexts/BrandingContext';
import { getVideoFromIndexedDb } from '../utils/videoStorageHelper';

interface AsrarHubLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  text?: string;
  onFinish?: () => void;
  canSkip?: boolean;
}

export const AsrarHubLoader: React.FC<AsrarHubLoaderProps> = ({ 
  size = 'md',
  text,
  onFinish,
  canSkip
}) => {
  const { branding } = useAppBranding();
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(branding.loadingVideoMuted !== false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [resolvedVideoSrc, setResolvedVideoSrc] = useState<string>(branding.loadingScreenVideo || '/videos/loading.mp4');
  const videoRef = useRef<HTMLVideoElement>(null);

  const customImageSrc = (branding.isEnabled !== false) 
    ? (branding.loadingScreenImage || branding.appLogo || branding.appIcon) 
    : undefined;

  // Reset errors if branding media changes
  useEffect(() => {
    setImageError(false);
  }, [branding.loadingScreenImage, branding.appLogo, branding.appIcon]);

  useEffect(() => {
    setVideoError(false);
  }, [branding.loadingScreenVideo]);

  // Resolve video source from Cloud URL, local path or IndexedDB
  useEffect(() => {
    let isMounted = true;
    let localBlobUrl: string | null = null;

    const resolveSrc = async () => {
      if (!branding.loadingScreenVideo || branding.loadingScreenVideo === '/videos/loading.mp4') {
        try {
          const idbBlob = await getVideoFromIndexedDb();
          if (idbBlob && isMounted) {
            localBlobUrl = URL.createObjectURL(idbBlob);
            setResolvedVideoSrc(localBlobUrl);
            return;
          }
        } catch (_) {}
      }

      if (isMounted) {
        setResolvedVideoSrc(branding.loadingScreenVideo || '/videos/loading.mp4');
      }
    };

    resolveSrc();

    return () => {
      isMounted = false;
      if (localBlobUrl) {
        URL.revokeObjectURL(localBlobUrl);
      }
    };
  }, [branding.loadingScreenVideo]);

  // If loading screen is completely disabled by admin
  if (branding.loadingScreenEnabled === false) {
    if (size === 'fullscreen') {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xs">
          <div className="w-7 h-7 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center p-2">
        <div className="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  const isVideoMode = 
    branding.loadingScreenType === 'video' && 
    Boolean(branding.loadingScreenVideo) && 
    !videoError;

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-36 h-36',
    lg: 'w-56 h-56',
    fullscreen: 'fixed inset-0 z-50 flex items-center justify-center bg-black text-white overflow-hidden'
  };

  const logoSize = size === 'fullscreen' ? 'fullscreen' : size;
  const displayText = text || (size === 'fullscreen' ? branding.loadingText : undefined);
  const showMedia = branding.showLoadingImage !== false;
  const allowSkip = canSkip !== undefined ? canSkip : (branding.loadingVideoCanSkip !== false);

  // Handle video progress update
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const prog = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(prog);
    }
  };

  // Handle video end
  const handleVideoEnded = () => {
    if (onFinish) {
      onFinish();
    }
  };

  // Toggle video sound
  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  // Custom animation styles for custom branding loading screen (image mode)
  const getCustomAnimation = () => {
    switch (branding.loadingAnimationType) {
      case 'spin':
        return {
          animate: { rotate: 360 },
          transition: { duration: 2, repeat: Infinity, ease: "linear" as const }
        };
      case 'bounce':
        return {
          animate: { y: [-6, 6, -6] },
          transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const }
        };
      case 'glow':
        return {
          animate: { 
            scale: [0.96, 1.04, 0.96],
            filter: [
              'drop-shadow(0 0 10px rgba(245,158,11,0.4))',
              'drop-shadow(0 0 30px rgba(245,158,11,0.9))',
              'drop-shadow(0 0 10px rgba(245,158,11,0.4))'
            ]
          },
          transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" as const }
        };
      case 'fade':
        return {
          animate: { opacity: [0.3, 1, 0.3] },
          transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" as const }
        };
      case 'pulse':
      default:
        return {
          animate: { opacity: [0.6, 1, 0.6], scale: [0.97, 1.03, 0.97] },
          transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }
        };
    }
  };

  const anim = getCustomAnimation();

  // Fullscreen video rendering
  if (size === 'fullscreen' && isVideoMode && showMedia) {
    const isCover = branding.loadingVideoFit === 'cover';
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white select-none overflow-hidden"
      >
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-radial from-amber-950/20 via-black to-black opacity-80 pointer-events-none" />

        {/* Cinematic Video Element */}
        <video
          ref={videoRef}
          src={resolvedVideoSrc}
          autoPlay={branding.loadingVideoAutoplay !== false}
          muted={isMuted}
          playsInline
          loop={branding.loadingVideoLoop === true}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onError={() => setVideoError(true)}
          className={`w-full h-full ${isCover ? 'object-cover' : 'object-contain'} relative z-10`}
        />

        {/* Top Controls: Sound & Skip */}
        <div className="absolute top-4 sm:top-6 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white/90 hover:text-amber-400 transition-all cursor-pointer shadow-lg"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
            aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-amber-400 animate-pulse" />}
          </button>

          {/* Skip / Enter Button */}
          {allowSkip && onFinish && (
            <button
              type="button"
              onClick={onFinish}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-amber-500/20 backdrop-blur-md border border-white/20 hover:border-amber-400/50 text-white/90 hover:text-amber-300 text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-lg"
            >
              <span>Passer</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Bottom subtle bar with title & progress */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none flex flex-col items-center gap-2">
          {displayText && (
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400/90 tracking-widest uppercase">
              <Sparkles size={13} className="text-amber-400" />
              <span>{displayText}</span>
            </div>
          )}

          {/* Golden Progress Bar */}
          <div className="w-48 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 rounded-full transition-all duration-150"
              style={{ width: `${videoProgress}%` }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  // Standard Image/Logo loader content
  const loaderContent = (
    <div className="flex flex-col items-center justify-center select-none gap-5">
      {showMedia ? (
        isVideoMode ? (
          <div className="w-28 h-28 rounded-2xl overflow-hidden bg-black/50 border border-amber-500/30 shadow-lg flex items-center justify-center">
            <video
              src={resolvedVideoSrc}
              autoPlay
              muted
              playsInline
              loop
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover"
            />
          </div>
        ) : customImageSrc && !imageError ? (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={anim.animate}
            transition={anim.transition}
            className="flex items-center justify-center"
          >
            <img
              src={customImageSrc}
              alt="Loading..."
              onError={() => setImageError(true)}
              className={`object-contain max-w-full ${
                size === 'sm' ? 'max-h-12' :
                size === 'md' ? 'max-h-24' :
                size === 'lg' ? 'max-h-36' :
                'max-h-48'
              }`}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <AsrarLogo variant="stacked" size={logoSize} hideSymbol={size !== 'fullscreen'} />
          </motion.div>
        )
      ) : (
        <div className="w-10 h-10 border-3 border-amber-500/20 border-t-amber-400 rounded-full animate-spin" />
      )}

      {displayText && (
        <span className="text-sm font-semibold text-amber-500 animate-pulse tracking-wide mt-1 text-center max-w-xs">
          {displayText}
        </span>
      )}
    </div>
  );

  if (size === 'fullscreen') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={sizeClasses.fullscreen}
      >
        {loaderContent}
      </motion.div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size] || sizeClasses.md}`}>
      {loaderContent}
    </div>
  );
};


