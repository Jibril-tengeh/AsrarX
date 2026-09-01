import React from 'react';
import { motion } from 'motion/react';
import { AsrarLogo } from './AsrarLogo';
import { useAppBranding } from '../contexts/BrandingContext';

interface AsrarHubLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  text?: string;
}

export const AsrarHubLoader: React.FC<AsrarHubLoaderProps> = ({ 
  size = 'md',
  text
}) => {
  const { branding } = useAppBranding();
  const [imageError, setImageError] = React.useState(false);

  // Reset image error if branding loading screen image changes
  React.useEffect(() => {
    setImageError(false);
  }, [branding.loadingScreenImage]);

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

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-36 h-36',
    lg: 'w-56 h-56',
    fullscreen: 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white'
  };

  const logoSize = size === 'fullscreen' ? 'fullscreen' : size;
  const displayText = text || (size === 'fullscreen' ? branding.loadingText : undefined);
  const showImage = branding.showLoadingImage !== false;

  // Custom animation styles for custom branding loading screen
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

  const loaderContent = (
    <div className="flex flex-col items-center justify-center select-none gap-5">
      {showImage ? (
        branding.isEnabled && branding.loadingScreenImage && !imageError ? (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={anim.animate}
            transition={anim.transition}
            className="flex items-center justify-center"
          >
            <img
              src={branding.loadingScreenImage}
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

