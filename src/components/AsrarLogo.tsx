import React from 'react';
import { motion } from 'motion/react';

interface AsrarLogoProps {
  variant?: 'horizontal' | 'stacked' | 'symbol';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'fullscreen';
  className?: string;
  hideSymbol?: boolean;
}

export const AsrarLogo: React.FC<AsrarLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  hideSymbol = variant === 'horizontal' // Default hideSymbol to true for horizontal layout to avoid logo beside text
}) => {
  // Size mappings based on variant and size presets
  const sizeClasses = {
    horizontal: {
      sm: 'h-7 sm:h-8',
      md: 'h-[38px] sm:h-[46px]', // Increased size by another 2px in header as requested
      lg: 'h-11 sm:h-14',
      xl: 'h-16 sm:h-20',
      '2xl': 'h-22 sm:h-28',
      fullscreen: 'h-28 sm:h-40'
    },
    stacked: {
      sm: hideSymbol ? 'w-24 h-auto' : 'w-24 h-24',
      md: hideSymbol ? 'w-36 h-auto' : 'w-36 h-36',
      lg: hideSymbol ? 'w-48 h-auto' : 'w-48 h-48',
      xl: hideSymbol ? 'w-64 h-auto' : 'w-64 h-64',
      '2xl': hideSymbol ? 'w-80 h-auto' : 'w-80 h-80',
      fullscreen: hideSymbol ? 'w-72 sm:w-[320px] md:w-[380px] h-auto' : 'w-72 sm:w-[320px] md:w-[380px]'
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
          viewBox={hideSymbol ? "0 0 215 70" : "0 0 280 80"}
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
          {!hideSymbol && (
            <g transform="translate(14, 5) scale(0.68)">
              {/* Majestic Calligraphic Symbol with Sweep - High Fidelity Traced Curves */}
              {/* Outer Golden Crescent Loop */}
              <path
                d="M 54,12 
                   C 42,22 30,42 32,64 
                   C 34,82 46,94 62,96 
                   C 48,96 34,88 26,76 
                   C 16,62 14,44 22,26 
                   C 26,14 34,6 44,2 
                   C 45,1 46,3 45,5 
                   C 39,16 32,32 34,50 
                   C 36,68 46,82 60,86 
                   C 48,84 40,72 38,56 
                   C 36,40 44,22 54,12 Z"
                fill="url(#goldGradientLogo)"
                filter="url(#goldGlowLogo)"
              />
              {/* Inner Artistic Arabic Cursive Accents / Calligraphy strokes */}
              <path
                d="M 45,38 
                   C 42,42 38,48 38,55 
                   C 38,64 45,71 52,71 
                   C 57,71 59,67 57,62 
                   C 55,57 50,57 48,62 
                   C 45,66 43,66 42,60 
                   C 41,54 43,46 45,38 Z"
                fill="url(#goldGradientLogo)"
              />
              {/* Fine Calligraphic Accent details (Gold tashkeel marks) */}
              <path d="M 33,28 L 39,24 C 40,23 39,22 38,23 L 32,27 C 31,28 32,29 33,28 Z" fill="url(#goldGradientLogo)" />
              <path d="M 47,48 C 48,46 50,46 49,49 C 48,52 46,54 45,52 Z" fill="url(#goldGradientLogo)" />
              <path d="M 28,42 C 29,40 31,40 30,43 C 29,46 27,48 26,46 Z" fill="url(#goldGradientLogo)" />
              
              {/* Elegant Top 4-Point Star (Sparkle) */}
              <path
                d="M 54,18 L 56.5,23 L 62,24 L 57.5,27 L 58.5,32.5 L 54,29 L 49.5,32.5 L 50.5,27 L 46,24 L 51.5,23 Z"
                fill="url(#goldGradientLogo)"
              />
              {/* Elegant Bottom 4-Point Star (Sparkle) */}
              <path
                d="M 42,94 L 44,97 L 48,98 L 44,99 L 42,102 L 40,99 L 36,98 L 40,97 Z"
                fill="url(#goldGradientLogo)"
              />
            </g>
          )}

          {/* Typography Part (Right) */}
          <g transform={hideSymbol ? "translate(5, 48) scale(1.05)" : "translate(68, 48)"}>
            {/* Asrar (Primary text) in Elegant Playfair Display */}
            <text
              x="0"
              y="0"
              fill="currentColor"
              fontSize="34"
              fontWeight="700"
              letterSpacing="0.02em"
              fontFamily="'Playfair Display', Georgia, serif"
              className="text-white dark:text-white"
            >
              Asrar
            </text>
            
            {/* Hub (Gold gradient text) in Elegant Playfair Display */}
            <text
              x="96"
              y="0"
              fill="url(#goldGradientLogo)"
              filter="url(#goldGlowLogo)"
              fontSize="34"
              fontWeight="700"
              letterSpacing="0.02em"
              fontFamily="'Playfair Display', Georgia, serif"
            >
              Hub
            </text>

            {/* Elegant Custom Connected Gold Crossbar (Slash) for the letter 'H' that connects with 'Asrar' */}
            <path
              d="M 80,-11 C 88,-12 96,-12 110,-12 C 110,-10 96,-10 88,-10 Z"
              fill="url(#goldGradientLogo)"
            />
          </g>
        </svg>
      )}

      {variant === 'stacked' && (
        <svg
          viewBox={hideSymbol ? "0 0 240 80" : "0 0 240 240"}
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
          {!hideSymbol && (
            <g transform="translate(70, 15) scale(1.5)">
              {/* Majestic Calligraphic Symbol with Sweep - High Fidelity Traced Curves */}
              {/* Outer Golden Crescent Loop */}
              <path
                d="M 54,12 
                   C 42,22 30,42 32,64 
                   C 34,82 46,94 62,96 
                   C 48,96 34,88 26,76 
                   C 16,62 14,44 22,26 
                   C 26,14 34,6 44,2 
                   C 45,1 46,3 45,5 
                   C 39,16 32,32 34,50 
                   C 36,68 46,82 60,86 
                   C 48,84 40,72 38,56 
                   C 36,40 44,22 54,12 Z"
                fill="url(#goldGradientLogoStacked)"
                filter="url(#goldGlowLogoStacked)"
              />
              {/* Inner Artistic Arabic Cursive Accents / Calligraphy strokes */}
              <path
                d="M 45,38 
                   C 42,42 38,48 38,55 
                   C 38,64 45,71 52,71 
                   C 57,71 59,67 57,62 
                   C 55,57 50,57 48,62 
                   C 45,66 43,66 42,60 
                   C 41,54 43,46 45,38 Z"
                fill="url(#goldGradientLogoStacked)"
              />
              {/* Fine Calligraphic Accent details (Gold tashkeel marks) */}
              <path d="M 33,28 L 39,24 C 40,23 39,22 38,23 L 32,27 C 31,28 32,29 33,28 Z" fill="url(#goldGradientLogoStacked)" />
              <path d="M 47,48 C 48,46 50,46 49,49 C 48,52 46,54 45,52 Z" fill="url(#goldGradientLogoStacked)" />
              <path d="M 28,42 C 29,40 31,40 30,43 C 29,46 27,48 26,46 Z" fill="url(#goldGradientLogoStacked)" />
              
              {/* Elegant Top 4-Point Star (Sparkle) */}
              <path
                d="M 54,18 L 56.5,23 L 62,24 L 57.5,27 L 58.5,32.5 L 54,29 L 49.5,32.5 L 50.5,27 L 46,24 L 51.5,23 Z"
                fill="url(#goldGradientLogoStacked)"
              />
              {/* Elegant Bottom 4-Point Star (Sparkle) */}
              <path
                d="M 42,94 L 44,97 L 48,98 L 44,99 L 42,102 L 40,99 L 36,98 L 40,97 Z"
                fill="url(#goldGradientLogoStacked)"
              />
            </g>
          )}

          {/* Typography Centered Below */}
          <g transform={`translate(120, ${hideSymbol ? 50 : 205})`}>
            <text
              x="-4"
              y="0"
              textAnchor="end"
              fill="currentColor"
              fontSize="34"
              fontWeight="700"
              letterSpacing="0.02em"
              fontFamily="'Playfair Display', Georgia, serif"
              className="text-white dark:text-white"
            >
              Asrar
            </text>
            <text
              x="4"
              y="0"
              textAnchor="start"
              fill="url(#goldGradientLogoStacked)"
              filter="url(#goldGlowLogoStacked)"
              fontSize="34"
              fontWeight="700"
              letterSpacing="0.02em"
              fontFamily="'Playfair Display', Georgia, serif"
            >
              Hub
            </text>

            {/* Elegant Custom Connected Gold Crossbar (Slash) for stacked layout */}
            <path
              d="M -16,-11 C -8,-12 0,-12 18,-12 C 18,-10 0,-10 -8,-10 Z"
              fill="url(#goldGradientLogoStacked)"
            />
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
            {/* Majestic Calligraphic Symbol with Sweep - High Fidelity Traced Curves */}
            {/* Outer Golden Crescent Loop */}
            <path
              d="M 54,12 
                 C 42,22 30,42 32,64 
                 C 34,82 46,94 62,96 
                 C 48,96 34,88 26,76 
                 C 16,62 14,44 22,26 
                 C 26,14 34,6 44,2 
                 C 45,1 46,3 45,5 
                 C 39,16 32,32 34,50 
                 C 36,68 46,82 60,86 
                 C 48,84 40,72 38,56 
                 C 36,40 44,22 54,12 Z"
              fill="url(#goldGradientLogoSymbol)"
              filter="url(#goldGlowLogoSymbol)"
            />
            {/* Inner Artistic Arabic Cursive Accents / Calligraphy strokes */}
            <path
              d="M 45,38 
                 C 42,42 38,48 38,55 
                 C 38,64 45,71 52,71 
                 C 57,71 59,67 57,62 
                 C 55,57 50,57 48,62 
                 C 45,66 43,66 42,60 
                 C 41,54 43,46 45,38 Z"
              fill="url(#goldGradientLogoSymbol)"
            />
            {/* Fine Calligraphic Accent details (Gold tashkeel marks) */}
            <path d="M 33,28 L 39,24 C 40,23 39,22 38,23 L 32,27 C 31,28 32,29 33,28 Z" fill="url(#goldGradientLogoSymbol)" />
            <path d="M 47,48 C 48,46 50,46 49,49 C 48,52 46,54 45,52 Z" fill="url(#goldGradientLogoSymbol)" />
            <path d="M 28,42 C 29,40 31,40 30,43 C 29,46 27,48 26,46 Z" fill="url(#goldGradientLogoSymbol)" />
            
            {/* Elegant Top 4-Point Star (Sparkle) */}
            <path
              d="M 54,18 L 56.5,23 L 62,24 L 57.5,27 L 58.5,32.5 L 54,29 L 49.5,32.5 L 50.5,27 L 46,24 L 51.5,23 Z"
              fill="url(#goldGradientLogoSymbol)"
            />
            {/* Elegant Bottom 4-Point Star (Sparkle) */}
            <path
              d="M 42,94 L 44,97 L 48,98 L 44,99 L 42,102 L 40,99 L 36,98 L 40,97 Z"
              fill="url(#goldGradientLogoSymbol)"
            />
          </g>
        </svg>
      )}
    </div>
  );
};
