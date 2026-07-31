import React from 'react';

interface AsrarHubWatermarkProps {
  /** 'parchment' for warm gold/amber ink, 'dark' for dark/purple cards, 'light' for white/gray cards, or 'gold' */
  variant?: 'parchment' | 'dark' | 'light' | 'gold';
  /** Show central engraved circular seal emblem */
  showCentralSeal?: boolean;
  /** Opacity override from 0 to 1 */
  opacity?: number;
  className?: string;
}

export const AsrarHubWatermark: React.FC<AsrarHubWatermarkProps> = ({
  variant = 'parchment',
  showCentralSeal = true,
  opacity,
  className = '',
}) => {
  let textColor = '#78350f'; // amber-900 / parchment
  let sealColor = '#92400e';
  let defaultOpacity = 0.14;

  if (variant === 'dark') {
    textColor = '#a855f7'; // purple-500
    sealColor = '#c084fc';
    defaultOpacity = 0.16;
  } else if (variant === 'gold') {
    textColor = '#d97706'; // amber-600
    sealColor = '#f59e0b';
    defaultOpacity = 0.18;
  } else if (variant === 'light') {
    textColor = '#334155'; // slate-700
    sealColor = '#475569';
    defaultOpacity = 0.12;
  }

  const finalOpacity = opacity !== undefined ? opacity : defaultOpacity;

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
      style={{ opacity: finalOpacity }}
    >
      {/* 1. Repeated Diagonal SVG Watermark Pattern */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={`asrarhub-watermark-pattern-${variant}`}
            width="200"
            height="110"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-25)"
          >
            <text
              x="10"
              y="30"
              fill={textColor}
              fontSize="12"
              fontWeight="900"
              fontFamily="Cinzel, serif, monospace"
              letterSpacing="2"
            >
              ASRARHUB
            </text>
            <text
              x="115"
              y="30"
              fill={textColor}
              fontSize="10"
              fontWeight="bold"
              fontFamily="serif"
            >
              ✦
            </text>

            <text
              x="90"
              y="85"
              fill={textColor}
              fontSize="12"
              fontWeight="900"
              fontFamily="Cinzel, serif, monospace"
              letterSpacing="2"
            >
              ASRARHUB
            </text>
            <text
              x="190"
              y="85"
              fill={textColor}
              fontSize="10"
              fontWeight="bold"
              fontFamily="serif"
            >
              ✦
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#asrarhub-watermark-pattern-${variant})`} />
      </svg>

      {/* 2. Optional Central Engraved Circular Seal Emblem */}
      {showCentralSeal && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <svg
            viewBox="0 0 200 200"
            className="w-48 h-48 sm:w-64 sm:h-64 max-w-full max-h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Circular Geometry */}
            <circle cx="100" cy="100" r="90" fill="none" stroke={sealColor} strokeWidth="2" strokeDasharray="6 3" />
            <circle cx="100" cy="100" r="82" fill="none" stroke={sealColor} strokeWidth="1" />
            <circle cx="100" cy="100" r="64" fill="none" stroke={sealColor} strokeWidth="1.5" />

            {/* Octagram Star / Khatim Geometry */}
            <path
              d="M100,20 L120,80 L180,100 L120,120 L100,180 L80,120 L20,100 L80,80 Z"
              fill="none"
              stroke={sealColor}
              strokeWidth="1"
            />
            <path
              d="M100,20 L180,100 L100,180 L20,100 Z"
              fill="none"
              stroke={sealColor}
              strokeWidth="0.8"
            />

            {/* Circular Text Path - ASRARHUB */}
            <path id={`circlePath-${variant}`} d="M 30,100 A 70,70 0 1,1 170,100 A 70,70 0 1,1 30,100" fill="none" />
            <text fill={sealColor} fontSize="8.5" fontWeight="bold" letterSpacing="1.8" fontFamily="serif">
              <textPath href={`#circlePath-${variant}`} startOffset="0%">
                ✦ ASRARHUB ✦ ASRARHUB ✦ ASRARHUB ✦ ASRARHUB ✦
              </textPath>
            </text>

            {/* Center Brand Seal */}
            <text x="100" y="98" textAnchor="middle" fill={sealColor} fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="2">
              ASRARHUB
            </text>
            <text x="100" y="113" textAnchor="middle" fill={sealColor} fontSize="11" fontWeight="bold" fontFamily="serif">
              أسرار هاب
            </text>
          </svg>
        </div>
      )}
    </div>
  );
};

export default AsrarHubWatermark;
