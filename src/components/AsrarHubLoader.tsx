import React from 'react';
import { motion } from 'motion/react';
import { AsrarLogo } from './AsrarLogo';

interface AsrarHubLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  text?: string;
}

export const AsrarHubLoader: React.FC<AsrarHubLoaderProps> = ({ 
  size = 'md',
  text
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-36 h-36',
    lg: 'w-56 h-56',
    fullscreen: 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white'
  };

  const logoSize = size === 'fullscreen' ? 'fullscreen' : size;

  const loaderContent = (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ 
        opacity: [0.6, 1, 0.6]
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="flex flex-col items-center justify-center select-none gap-6"
    >
      <AsrarLogo variant="stacked" size={logoSize} hideSymbol={true} />
      {text && (
        <span className="text-sm font-semibold text-amber-500 animate-pulse tracking-wide mt-2">{text}</span>
      )}
    </motion.div>
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
