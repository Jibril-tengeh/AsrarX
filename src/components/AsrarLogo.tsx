import React from 'react';
import { motion } from 'motion/react';

interface AsrarLogoProps {
  variant?: 'horizontal' | 'stacked' | 'symbol';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'fullscreen';
  className?: string;
}

export const AsrarLogo: React.FC<AsrarLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = ''
}) => {
  // Size mappings based on variant and size presets
  const sizeClasses = {
    horizontal: {
      sm: 'h-8',
      md: 'h-10',
      lg: 'h-14',
      xl: 'h-20',
      '2xl': 'h-28',
      fullscreen: 'h-32 sm:h-40'
    },
    stacked: {
      sm: 'w-24 h-24',
      md: 'w-36 h-36',
      lg: 'w-48 h-48',
      xl: 'w-64 h-64',
      '2xl': 'w-80 h-80',
      fullscreen: 'w-72 sm:w-[320px] md:w-[380px]'
    },
    symbol: {
      sm: 'w-6 h-6',
      md: 'w-10 h-10',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24',
      '2xl': 'w-36 h-36',
      fullscreen: 'w-48 sm:w-64'
    }
  }[variant][size];

  return (
    <div className={`flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      {variant === 'horizontal' && (
        <svg
          viewBox="0 0 280 80"
          className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(245,195,104,0.15)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGradientLogo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="25%" stopColor="#FAD382" />
              <stop offset="60%" stopColor="#E5A93C" />
              <stop offset="100%" stopColor="#966C15" />
            </linearGradient>
            <filter id="goldGlowLogo" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Symbol Part (Left) */}
          <g transform="translate(10, 5) scale(0.65)">
            {/* Elegant Calligraphic Crescent Moon */}
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
              fill="url(#goldGradientLogo)"
              filter="url(#goldGlowLogo)"
            />
            {/* Central Islamic Geometry Star / Diamond Sparkle */}
            <path
              d="M 44,42 
                 C 41,45 38,50 38,56 
                 C 38,64 44,70 50,70 
                 C 54,70 56,66 54,62 
                 C 52,58 48,58 46,62 
                 C 44,65 42,65 41,60 
                 C 40,55 42,48 44,42 Z"
              fill="url(#goldGradientLogo)"
            />
            {/* Spiritual Sparks & Starbursts */}
            <path d="M 33,32 L 39,28 C 40,27 39,26 38,27 L 32,31 C 31,32 32,33 33,32 Z" fill="url(#goldGradientLogo)" />
            <path d="M 46,50 C 47,48 49,48 48,51 C 47,54 45,56 44,54 Z" fill="url(#goldGradientLogo)" />
            {/* Top Star */}
            <path
              d="M 56,22 L 58.5,27 L 64,28 L 59.5,31 L 60.5,36.5 L 56,33 L 51.5,36.5 L 52.5,31 L 48,28 L 53.5,27 Z"
              fill="url(#goldGradientLogo)"
            />
            {/* Bottom Star */}
            <path
              d="M 42,98 L 44,101 L 48,102 L 44,103 L 42,106 L 40,103 L 36,102 L 40,101 Z"
              fill="url(#goldGradientLogo)"
            />
          </g>

          {/* Typography Part (Right) */}
          <g transform="translate(68, 47)">
            {/* Asrar (Primary text) */}
            <text
              x="0"
              y="0"
              fill="currentColor"
              fontSize="34"
              fontWeight="800"
              letterSpacing="0.05em"
              fontFamily="Playfair Display, Inter, system-ui, sans-serif"
              className="text-white dark:text-white"
            >
              Asrar
            </text>
            
            {/* Hub (Gold gradient text) */}
            <text
              x="104"
              y="0"
              fill="url(#goldGradientLogo)"
              filter="url(#goldGlowLogo)"
              fontSize="34"
              fontWeight="800"
              letterSpacing="0.05em"
              fontFamily="Playfair Display, Inter, system-ui, sans-serif"
            >
              Hub
            </text>

            {/* Subtle subline divider or spiritual dot */}
            <circle cx="198" cy="-12" r="2.5" fill="url(#goldGradientLogo)" />
          </g>
        </svg>
      )}

      {variant === 'stacked' && (
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full filter drop-shadow-[0_4px_20px_rgba(245,195,104,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGradientLogoStacked" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="25%" stopColor="#FAD382" />
              <stop offset="60%" stopColor="#E5A93C" />
              <stop offset="100%" stopColor="#966C15" />
            </linearGradient>
            <filter id="goldGlowLogoStacked" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Majestic Large Crescent Symbol (Centered on top) */}
          <g transform="translate(70, 20) scale(1.4)">
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
              fill="url(#goldGradientLogoStacked)"
              filter="url(#goldGlowLogoStacked)"
            />
            <path
              d="M 44,42 
                 C 41,45 38,50 38,56 
                 C 38,64 44,70 50,70 
                 C 54,70 56,66 54,62 
                 C 52,58 48,58 46,62 
                 C 44,65 42,65 41,60 
                 C 40,55 42,48 44,42 Z"
              fill="url(#goldGradientLogoStacked)"
            />
            <path d="M 33,32 L 39,28 C 40,27 39,26 38,27 L 32,31 C 31,32 32,33 33,32 Z" fill="url(#goldGradientLogoStacked)" />
            <path d="M 46,50 C 47,48 49,48 48,51 C 47,54 45,56 44,54 Z" fill="url(#goldGradientLogoStacked)" />
            <path
              d="M 56,22 L 58.5,27 L 64,28 L 59.5,31 L 60.5,36.5 L 56,33 L 51.5,36.5 L 52.5,31 L 48,28 L 53.5,27 Z"
              fill="url(#goldGradientLogoStacked)"
            />
            <path
              d="M 42,98 L 44,101 L 48,102 L 44,103 L 42,106 L 40,103 L 36,102 L 40,101 Z"
              fill="url(#goldGradientLogoStacked)"
            />
          </g>

          {/* Typography Centered Below */}
          <g transform="translate(120, 205)">
            <text
              x="0"
              y="0"
              textAnchor="end"
              fill="currentColor"
              fontSize="34"
              fontWeight="800"
              letterSpacing="0.06em"
              fontFamily="Playfair Display, Inter, system-ui, sans-serif"
              className="text-white dark:text-white"
            >
              Asrar
            </text>
            <text
              x="8"
              y="0"
              textAnchor="start"
              fill="url(#goldGradientLogoStacked)"
              filter="url(#goldGlowLogoStacked)"
              fontSize="34"
              fontWeight="800"
              letterSpacing="0.06em"
              fontFamily="Playfair Display, Inter, system-ui, sans-serif"
            >
              Hub
            </text>
          </g>
        </svg>
      )}

      {variant === 'symbol' && (
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full filter drop-shadow-[0_2px_10px_rgba(245,195,104,0.2)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGradientLogoSymbol" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="25%" stopColor="#FAD382" />
              <stop offset="60%" stopColor="#E5A93C" />
              <stop offset="100%" stopColor="#966C15" />
            </linearGradient>
            <filter id="goldGlowLogoSymbol" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g transform="translate(30, 8) scale(1.0)">
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
              fill="url(#goldGradientLogoSymbol)"
              filter="url(#goldGlowLogoSymbol)"
            />
            <path
              d="M 44,42 
                 C 41,45 38,50 38,56 
                 C 38,64 44,70 50,70 
                 C 54,70 56,66 54,62 
                 C 52,58 48,58 46,62 
                 C 44,65 42,65 41,60 
                 C 40,55 42,48 44,42 Z"
              fill="url(#goldGradientLogoSymbol)"
            />
            <path d="M 33,32 L 39,28 C 40,27 39,26 38,27 L 32,31 C 31,32 32,33 33,32 Z" fill="url(#goldGradientLogoSymbol)" />
            <path d="M 46,50 C 47,48 49,48 48,51 C 47,54 45,56 44,54 Z" fill="url(#goldGradientLogoSymbol)" />
            <path
              d="M 56,22 L 58.5,27 L 64,28 L 59.5,31 L 60.5,36.5 L 56,33 L 51.5,36.5 L 52.5,31 L 48,28 L 53.5,27 Z"
              fill="url(#goldGradientLogoSymbol)"
            />
            <path
              d="M 42,98 L 44,101 L 48,102 L 44,103 L 42,106 L 40,103 L 36,102 L 40,101 Z"
              fill="url(#goldGradientLogoSymbol)"
            />
          </g>
        </svg>
      )}
    </div>
  );
};
