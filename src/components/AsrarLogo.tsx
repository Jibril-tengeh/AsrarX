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
  hideSymbol = variant === 'horizontal'
}) => {
  // Size mappings based on variant and size presets
  const sizeClasses = {
    horizontal: {
      sm: 'h-7 sm:h-8',
      md: 'h-[38px] sm:h-[46px]',
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

  // Common SVG Definitions (Gradients and shapes)
  const renderDefs = (idSuffix: string) => (
    <defs>
      {/* Top Sun Gradient */}
      <linearGradient id={`topSunGradient-${idSuffix}`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="60%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#FBBF24" />
      </linearGradient>

      {/* Bottom Rays Gradient */}
      <linearGradient id={`bottomTealGradient-${idSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0F766E" />
        <stop offset="60%" stopColor="#0D9488" />
        <stop offset="100%" stopColor="#14B8A6" />
      </linearGradient>

      {/* Rich Gold Text Gradient */}
      <linearGradient id={`textGoldGradient-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF9E6" />
        <stop offset="25%" stopColor="#FAD382" />
        <stop offset="60%" stopColor="#E5A93C" />
        <stop offset="100%" stopColor="#966C15" />
      </linearGradient>

      {/* Tapered Ray Shapes */}
      <path id={`ray-long-${idSuffix}`} d="M -3,-124 C -5.5,-124 -6.5,-134 -1,-184 C 0,-189 0,-189 1,-184 C 6.5,-134 5.5,-124 3,-124 Z" />
      <path id={`ray-medium-${idSuffix}`} d="M -2.5,-124 C -4.5,-124 -5.5,-131 -1,-164 C 0,-168 0,-168 1,-164 C 5.5,-131 4.5,-124 2.5,-124 Z" />
      <path id={`ray-short-${idSuffix}`} d="M -2,-124 C -3.5,-124 -4.5,-128 -0.5,-146 C 0,-149 0,-149 0.5,-146 C 4.5,-128 3.5,-124 2,-124 Z" />
    </defs>
  );

  // Symbol element rendering
  const renderSymbolG = (idSuffix: string) => (
    <g transform="translate(256, 256)">
      {/* Top Semicircle Arc */}
      <path d="M -110 0 A 110 110 0 0 1 110 0" fill="none" stroke={`url(#topSunGradient-${idSuffix})`} strokeWidth="12" strokeLinecap="round" />
      
      {/* Bottom Semicircle Arc */}
      <path d="M -110 0 A 110 110 0 0 0 110 0" fill="none" stroke={`url(#bottomTealGradient-${idSuffix})`} strokeWidth="12" strokeLinecap="round" />

      {/* TOP HALF RAYS */}
      <g fill={`url(#topSunGradient-${idSuffix})`}>
        <use href={`#ray-short-${idSuffix}`} transform="rotate(-160)" />
        <use href={`#ray-medium-${idSuffix}`} transform="rotate(-145)" />
        <circle cx="0" cy="-172" r="4.5" transform="rotate(-145)" />
        <use href={`#ray-medium-${idSuffix}`} transform="rotate(-130)" />
        <use href={`#ray-long-${idSuffix}`} transform="rotate(-115)" />
        <use href={`#ray-medium-${idSuffix}`} transform="rotate(-100)" />
        <use href={`#ray-long-${idSuffix}`} transform="rotate(-90)" />
        <circle cx="0" cy="-194" r="5" transform="rotate(-90)" />
        <use href={`#ray-medium-${idSuffix}`} transform="rotate(-80)" />
        <use href={`#ray-long-${idSuffix}`} transform="rotate(-65)" />
        <use href={`#ray-medium-${idSuffix}`} transform="rotate(-50)" />
        <use href={`#ray-medium-${idSuffix}`} transform="rotate(-35)" />
        <circle cx="0" cy="-172" r="4.5" transform="rotate(-35)" />
        <use href={`#ray-short-${idSuffix}`} transform="rotate(-20)" />
      </g>

      {/* BOTTOM HALF RAYS */}
      <g fill={`url(#bottomTealGradient-${idSuffix})`}>
        <use href={`#ray-short-${idSuffix}`} transform="rotate(20)" />
        <use href={`#ray-medium-${idSuffix}`} transform="rotate(35)" />
        <circle cx="0" cy="-172" r="4.5" transform="rotate(35)" />
        <use href={`#ray-medium-${idSuffix}`} transform="rotate(50)" />
        <use href={`#ray-long-${idSuffix}`} transform="rotate(65)" />
        <use href={`#ray-medium-${idSuffix}`} transform="rotate(80)" />
        <use href={`#ray-long-${idSuffix}`} transform="rotate(90)" />
        <circle cx="0" cy="-194" r="5" transform="rotate(90)" />
        <use href={`#ray-medium-${idSuffix}`} transform="rotate(100)" />
        <use href={`#ray-long-${idSuffix}`} transform="rotate(115)" />
        <use href={`#ray-medium-${idSuffix}`} transform="rotate(130)" />
        <use href={`#ray-medium-${idSuffix}`} transform="rotate(145)" />
        <circle cx="0" cy="-172" r="4.5" transform="rotate(145)" />
        <use href={`#ray-short-${idSuffix}`} transform="rotate(160)" />
      </g>
    </g>
  );

  return (
    <div className={`flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      {variant === 'horizontal' && (
        <svg
          viewBox={hideSymbol ? "0 0 200 70" : "0 0 280 80"}
          className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(245,195,104,0.12)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {renderDefs('horiz')}

          {/* Symbol Part (Left) */}
          {!hideSymbol && (
            <g transform="translate(-10, -5) scale(0.18)">
              {renderSymbolG('horiz')}
            </g>
          )}

          {/* Typography Part (Right) */}
          <g transform={hideSymbol ? "translate(0, 48) scale(1.05)" : "translate(82, 48)"}>
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
            
            <text
              x="96"
              y="0"
              fill="url(#textGoldGradient-horiz)"
              fontSize="34"
              fontWeight="700"
              letterSpacing="0.02em"
              fontFamily="'Playfair Display', Georgia, serif"
            >
              Hub
            </text>

            {/* Accent slash connector for 'H' */}
            <path
              d="M 80,-11 C 88,-12 96,-12 110,-12 C 110,-10 96,-10 88,-10 Z"
              fill="url(#textGoldGradient-horiz)"
            />
          </g>
        </svg>
      )}

      {variant === 'stacked' && (
        <svg
          viewBox={hideSymbol ? "0 0 240 80" : "0 0 240 240"}
          className="w-full h-full filter drop-shadow-[0_4px_20px_rgba(245,195,104,0.18)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {renderDefs('stacked')}

          {/* Symbol Part (Centered on top) */}
          {!hideSymbol && (
            <g transform="translate(48, -10) scale(0.28)">
              {renderSymbolG('stacked')}
            </g>
          )}

          {/* Typography Centered Below */}
          <g transform={`translate(120, ${hideSymbol ? 50 : 190})`}>
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
              fill="url(#textGoldGradient-stacked)"
              fontSize="34"
              fontWeight="700"
              letterSpacing="0.02em"
              fontFamily="'Playfair Display', Georgia, serif"
            >
              Hub
            </text>

            {/* Accent slash connector for 'H' */}
            <path
              d="M -16,-11 C -8,-12 0,-12 18,-12 C 18,-10 0,-10 -8,-10 Z"
              fill="url(#textGoldGradient-stacked)"
            />
          </g>
        </svg>
      )}

      {variant === 'symbol' && (
        <svg
          viewBox="0 0 512 512"
          className="w-full h-full filter drop-shadow-[0_2px_10px_rgba(245,195,104,0.15)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {renderDefs('symbol-only')}
          {renderSymbolG('symbol-only')}
        </svg>
      )}
    </div>
  );
};
