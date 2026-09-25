import React from 'react';

export type Card3DTheme = 'gold_amber' | 'emerald_asrar' | 'modern_clay' | 'dark_tactile';
export type Card3DIntensity = 'subtle' | 'medium' | 'strong';
export type Card3DTarget = 'all' | 'categories_only' | 'articles_only';

/**
 * Check if the 3D card relief effect is enabled
 */
export const is3DCardEffectEnabled = (
  featureToggles?: any,
  target: 'category' | 'article' = 'category'
): boolean => {
  if (!featureToggles) return false;
  
  const isEnabled = 
    featureToggles.cards_3d_effect === true || 
    featureToggles.cards_3d_enabled === true ||
    featureToggles.home_categories_3d_cards === true;

  if (!isEnabled) return false;

  const targetScope: Card3DTarget = featureToggles.cards_3d_target || 'all';
  if (targetScope === 'all') return true;
  if (targetScope === 'categories_only' && target === 'category') return true;
  if (targetScope === 'articles_only' && target === 'article') return true;

  return false;
};

/**
 * Get the configured 3D theme
 */
export const get3DCardTheme = (featureToggles?: any): Card3DTheme => {
  const theme = featureToggles?.cards_3d_theme || featureToggles?.cards_3d_color_mode;
  if (theme === 'emerald_asrar' || theme === 'modern_clay' || theme === 'dark_tactile') {
    return theme;
  }
  // Default to gold_amber (the exact look of the VoNovisi screenshot)
  return 'gold_amber';
};

/**
 * Get the configured 3D relief intensity
 */
export const get3DCardIntensity = (featureToggles?: any): Card3DIntensity => {
  const intensity = featureToggles?.cards_3d_intensity;
  if (intensity === 'subtle' || intensity === 'strong') {
    return intensity;
  }
  return 'medium';
};

/**
 * CSS classes for the 3D card container based on theme and intensity
 */
export const get3DCardContainerClasses = (
  theme: Card3DTheme = 'gold_amber',
  intensity: Card3DIntensity = 'medium',
  extraClasses = ''
): string => {
  const base = 'card-3d-clay select-none transition-all duration-200';
  
  // Theme specific classes
  let themeClass = 'card-3d-clay-amber';
  if (theme === 'emerald_asrar') themeClass = 'card-3d-clay-emerald';
  else if (theme === 'modern_clay') themeClass = 'card-3d-clay-modern';
  else if (theme === 'dark_tactile') themeClass = 'card-3d-clay-dark';

  // Intensity specific bottom border adjustment
  let intensityClass = '';
  if (intensity === 'subtle') {
    intensityClass = 'card-3d-subtle';
  } else if (intensity === 'strong') {
    intensityClass = 'card-3d-strong';
  }

  return `${base} ${themeClass} ${intensityClass} ${extraClasses}`.trim();
};

/**
 * Top specular highlight component that creates the glossy sheen seen in the 3D card screenshot
 */
export const Card3DTopShine: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div 
    aria-hidden="true" 
    className={`absolute top-0.5 sm:top-1 left-3 right-3 sm:left-4 sm:right-4 h-[2px] sm:h-[3px] bg-gradient-to-r from-white/10 via-white/80 to-white/10 rounded-full blur-[0.4px] pointer-events-none z-10 ${className}`} 
  />
);
