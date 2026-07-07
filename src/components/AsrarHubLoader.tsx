import React from 'react';
import { motion } from 'motion/react';

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

  const loaderContent = (
    <motion.div
      initial={{ scale: 0.95, opacity: 0.8 }}
      animate={{ 
        scale: [0.95, 1.05, 0.95],
        opacity: [0.8, 1, 0.8]
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="flex flex-col items-center justify-center select-none gap-4"
    >
      <svg 
        viewBox="0 0 240 140" 
        className="w-48 sm:w-64 h-auto filter drop-shadow-[0_0_25px_rgba(245,195,104,0.3)]" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3D1" />
            <stop offset="35%" stopColor="#F5C368" />
            <stop offset="70%" stopColor="#E5A93C" />
            <stop offset="100%" stopColor="#966C15" />
          </linearGradient>
          <filter id="goldGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Left Calligraphy Flourish */}
        <g transform="translate(10, 5)">
          <path 
            d="M 52,18 
               C 45,28 36,44 38,62 
               C 40,78 48,90 62,94 
               C 50,94 36,88 28,78 
               C 20,68 18,52 24,36 
               C 28,26 34,18 42,12 
               C 43,11 44,13 43,15 
               C 38,25 32,38 34,54 
               C 36,70 44,82 56,86 
               C 48,84 41,74 40,60 
               C 39,46 45,30 52,18 Z" 
            fill="url(#goldGradient)" 
            filter="url(#goldGlow)"
          />
          
          <path 
            d="M 44,42 
               C 41,45 38,50 38,56 
               C 38,64 44,70 50,70 
               C 54,70 56,66 54,62 
               C 52,58 48,58 46,62 
               C 44,65 42,65 41,60 
               C 40,55 42,48 44,42 Z" 
            fill="url(#goldGradient)" 
          />

          <path 
            d="M 33,32 L 39,28 C 40,27 39,26 38,27 L 32,31 C 31,32 32,33 33,32 Z" 
            fill="url(#goldGradient)" 
          />
          <path 
            d="M 46,50 C 47,48 49,48 48,51 C 47,54 45,56 44,54 Z" 
            fill="url(#goldGradient)" 
          />
          
          <path 
            d="M 56,22 L 58.5,27 L 64,28 L 59.5,31 L 60.5,36.5 L 56,33 L 51.5,36.5 L 52.5,31 L 48,28 L 53.5,27 Z" 
            fill="url(#goldGradient)" 
          />
          
          <path 
            d="M 42,98 L 44,101 L 48,102 L 44,103 L 42,106 L 40,103 L 36,102 L 40,101 Z" 
            fill="url(#goldGradient)" 
          />
        </g>

        {/* Right text group 'AsrarHub' */}
        <g transform="translate(85, 75)">
          <text 
            x="0" 
            y="0" 
            fill="#FFFFFF" 
            fontSize="30" 
            fontWeight="bold" 
            fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
          >
            Asrar
          </text>
          
          <text 
            x="78" 
            y="0" 
            fill="url(#goldGradient)" 
            filter="url(#goldGlow)"
            fontSize="30" 
            fontWeight="bold" 
            fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
          >
            Hub
          </text>
          
          <path 
            d="M 70,-8 L 82,-8 L 80,-12 L 78,-8" 
            stroke="url(#goldGradient)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />
        </g>
      </svg>
      {text && (
        <span className="text-sm font-semibold text-amber-500 animate-pulse tracking-wide">{text}</span>
      )}
    </motion.div>
  );

  if (size === 'fullscreen') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
