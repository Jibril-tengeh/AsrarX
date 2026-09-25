import React, { useId } from 'react';
import { useFeatures } from '../contexts/FeatureContext';

export interface AsrarHubWatermarkProps {
  /** 'parchment' for warm gold/amber ink, 'dark' for dark/purple cards, 'light' for white/gray cards, 'gold', or 'auto' */
  variant?: 'parchment' | 'dark' | 'light' | 'gold' | 'auto';
  /** Show central engraved circular seal emblem */
  showCentralSeal?: boolean;
  /** Opacity override from 0 to 1 (if not set or if admin configured, uses admin opacity) */
  opacity?: number;
  /** If true, strictly use the provided opacity even if admin has configured a global one */
  forceExactOpacity?: boolean;
  /** Force show even if admin turned off watermark (useful for admin preview card) */
  forceShow?: boolean;
  /** Custom text to print in watermark */
  customText?: string;
  className?: string;
}

export const AsrarHubWatermark: React.FC<AsrarHubWatermarkProps> = ({
  variant = 'parchment',
  showCentralSeal = true,
  opacity,
  forceExactOpacity = false,
  forceShow = false,
  customText,
  className = '',
}) => {
  const { featureToggles } = useFeatures();

  // 1. Check if watermark is globally enabled by admin
  const isGloballyEnabled = featureToggles?.watermark_enabled !== false;
  if (!isGloballyEnabled && !forceShow) {
    return null;
  }

  const rawId = useId();
  const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');

  // 2. Resolve variant (Admin override or prop)
  const adminVariant = featureToggles?.watermark_variant;
  let activeVariant = variant;
  if (adminVariant && adminVariant !== 'auto' && adminVariant !== '') {
    activeVariant = adminVariant as any;
  } else if (variant === 'auto') {
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    activeVariant = isDark ? 'dark' : 'parchment';
  }

  const patternId = `asrarhub-watermark-pattern-${activeVariant}-${cleanId}`;
  const circlePathId = `circlePath-${activeVariant}-${cleanId}`;

  let textColor = '#78350f'; // amber-900 / parchment
  let sealColor = '#92400e';
  let defaultOpacity = 0.08;

  if (activeVariant === 'dark') {
    textColor = '#34d399'; // emerald-400
    sealColor = '#10b981';
    defaultOpacity = 0.06;
  } else if (activeVariant === 'gold') {
    textColor = '#d97706'; // amber-600
    sealColor = '#f59e0b';
    defaultOpacity = 0.09;
  } else if (activeVariant === 'light') {
    textColor = '#047857'; // emerald-700
    sealColor = '#059669';
    defaultOpacity = 0.05;
  }

  // 3. Compute dynamic opacity from admin settings or prop
  let adminOpacity: number | undefined = undefined;
  if (featureToggles?.watermark_opacity !== undefined && featureToggles.watermark_opacity !== null && featureToggles.watermark_opacity !== '') {
    const parsed = Number(featureToggles.watermark_opacity);
    if (!isNaN(parsed) && parsed >= 0) {
      adminOpacity = parsed > 1 ? parsed / 100 : parsed;
    }
  }

  let finalOpacity: number;
  if (forceExactOpacity && opacity !== undefined) {
    finalOpacity = opacity;
  } else if (adminOpacity !== undefined) {
    finalOpacity = adminOpacity;
  } else if (opacity !== undefined) {
    finalOpacity = opacity;
  } else {
    finalOpacity = defaultOpacity;
  }

  // Safe clamping
  finalOpacity = Math.max(0.005, Math.min(0.8, finalOpacity));

  // 4. Central seal display: Admin setting or prop
  const shouldShowCentralSeal = featureToggles?.watermark_show_seal !== undefined
    ? (Boolean(featureToggles.watermark_show_seal) && showCentralSeal !== false)
    : showCentralSeal;

  // 5. Custom branding text
  const brandText = customText || featureToggles?.watermark_text || 'ASRARHUB';
  const brandArabic = featureToggles?.watermark_arabic_text || 'أسرار هاب';

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
      style={{ opacity: finalOpacity }}
    >
      {/* 1. Repeated Diagonal SVG Watermark Pattern */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
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
              {brandText}
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
              {brandText}
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
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {/* 2. Optional Central Engraved Circular Seal Emblem */}
      {shouldShowCentralSeal && (
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

            {/* Circular Text Path */}
            <path id={circlePathId} d="M 30,100 A 70,70 0 1,1 170,100 A 70,70 0 1,1 30,100" fill="none" />
            <text fill={sealColor} fontSize="8.5" fontWeight="bold" letterSpacing="1.8" fontFamily="serif">
              <textPath href={`#${circlePathId}`} startOffset="0%">
                ✦ {brandText} ✦ {brandText} ✦ {brandText} ✦ {brandText} ✦
              </textPath>
            </text>

            {/* Center Brand Seal */}
            <text x="100" y="98" textAnchor="middle" fill={sealColor} fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="2">
              {brandText}
            </text>
            <text x="100" y="113" textAnchor="middle" fill={sealColor} fontSize="11" fontWeight="bold" fontFamily="serif">
              {brandArabic}
            </text>
          </svg>
        </div>
      )}
    </div>
  );
};

export default AsrarHubWatermark;
