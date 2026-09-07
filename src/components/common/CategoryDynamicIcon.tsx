import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import {
  FolderOpen, Folder, Shield, Moon, BookOpen, Heart, Key, Sparkles, Flame,
  Coins, Compass, Sun, Feather, Star, Volume2, Library, Music, Layers, Crown,
  Search, Tag, Award, Trophy, Bookmark, ShieldCheck, FileText, Zap, Eye, Lock,
  Globe, RefreshCw, Crosshair, Wind, Waves, Gem, Landmark, Clock, Bell, CircleDot,
  Gift, HelpCircle, User, Users, Check, X, Target, Droplets, Mountain, Lightbulb,
  Scroll, Book, BookMarked, Radio, Disc, Play, Activity, AlertTriangle,
  CheckCircle, CheckCircle2, Wallet, CreditCard, FlameKindling, ShieldAlert,
  Sparkle as StarFour, Fingerprint, KeyRound, MoonStar, SunMedium
} from 'lucide-react';

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

// Map of canonical icon aliases for immediate O(1) resolution
const ICON_REGISTRY: Record<string, React.ComponentType<any>> = {
  folderopen: FolderOpen,
  folder: Folder,
  shield: Shield,
  moon: Moon,
  moonstar: MoonStar,
  bookopen: BookOpen,
  heart: Heart,
  key: Key,
  keyround: KeyRound,
  sparkles: Sparkles,
  sparkle: StarFour,
  flame: Flame,
  coins: Coins,
  compass: Compass,
  sun: Sun,
  sunmedium: SunMedium,
  feather: Feather,
  star: Star,
  volume2: Volume2,
  library: Library,
  music: Music,
  layers: Layers,
  crown: Crown,
  search: Search,
  tag: Tag,
  award: Award,
  trophy: Trophy,
  bookmark: Bookmark,
  shieldcheck: ShieldCheck,
  filetext: FileText,
  zap: Zap,
  eye: Eye,
  lock: Lock,
  globe: Globe,
  refreshcw: RefreshCw,
  crosshair: Crosshair,
  wind: Wind,
  waves: Waves,
  gem: Gem,
  landmark: Landmark,
  clock: Clock,
  bell: Bell,
  circledot: CircleDot,
  gift: Gift,
  helpcircle: HelpCircle,
  user: User,
  users: Users,
  check: Check,
  x: X,
  target: Target,
  droplets: Droplets,
  mountain: Mountain,
  lightbulb: Lightbulb,
  scroll: Scroll,
  book: Book,
  bookmarked: BookMarked,
  radio: Radio,
  disc: Disc,
  play: Play,
  activity: Activity,
  alerttriangle: AlertTriangle,
  checkcircle: CheckCircle,
  checkcircle2: CheckCircle2,
  wallet: Wallet,
  creditcard: CreditCard,
  flamekindling: FlameKindling,
  shieldalert: ShieldAlert,
  fingerprint: Fingerprint
};

// Case-insensitive lookup cache across all 500+ Lucide icons
const ALL_LUCIDE_MAP: Record<string, React.ComponentType<any>> = {};
try {
  Object.entries(Icons).forEach(([key, comp]) => {
    if (typeof comp === 'function' || (typeof comp === 'object' && comp !== null)) {
      ALL_LUCIDE_MAP[key.toLowerCase().replace(/[^a-z0-9]/g, '')] = comp as any;
    }
  });
} catch {
  // Graceful fallback
}

/**
 * Resolves a vibrant, luminous color class for an SVG icon so it is NEVER pitch black or dark gray.
 * If incoming className contains dark/black text classes, they are automatically replaced
 * with a high-contrast radiant jewel color matching the icon's semantic spiritual domain.
 */
export const resolveLuminousIconColor = (iconName?: string, className: string = ''): string => {
  // 1) Strip dark / black Tailwind classes so icons never look black
  let cleaned = className
    .replace(/\btext-(black|gray-950|gray-900|gray-800|gray-700|gray-600|slate-950|slate-900|slate-800|neutral-950|neutral-900|zinc-950|zinc-900|stone-900)\b/g, '')
    .trim();

  // 2) If an explicit luminous or light color class was provided, keep it
  const hasLuminousColor = /\btext-(white|emerald|teal|amber|yellow|cyan|sky|blue|indigo|violet|purple|rose|pink|orange|lime)-[0-9]{2,3}\b/.test(cleaned) ||
    /\btext-white\b/.test(cleaned);

  if (hasLuminousColor) {
    return cleaned;
  }

  // 3) Match icon name to a vibrant, luminous jewel hue (always colorful, never black)
  const key = (iconName || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  let defaultColor = 'text-emerald-500 dark:text-emerald-400';

  if (
    key.includes('coin') || key.includes('gold') || key.includes('key') || key.includes('sun') ||
    key.includes('star') || key.includes('crown') || key.includes('award') || key.includes('trophy') ||
    key.includes('wallet') || key.includes('credit') || key.includes('gem') || key.includes('gift') ||
    key.includes('dollar')
  ) {
    defaultColor = 'text-amber-500 dark:text-amber-400';
  } else if (
    key.includes('moon') || key.includes('compass') || key.includes('wind') || key.includes('wave') ||
    key.includes('ciel') || key.includes('radio') || key.includes('disc') || key.includes('bell') ||
    key.includes('volume') || key.includes('cloud')
  ) {
    defaultColor = 'text-sky-500 dark:text-sky-400';
  } else if (
    key.includes('heart') || key.includes('flame') || key.includes('fire') || key.includes('alert') ||
    key.includes('activity') || key.includes('drop') || key.includes('danger')
  ) {
    defaultColor = 'text-rose-500 dark:text-rose-400';
  } else if (
    key.includes('sparkle') || key.includes('fingerprint') || key.includes('book') || key.includes('scroll') ||
    key.includes('library') || key.includes('layer') || key.includes('eye') || key.includes('magic') ||
    key.includes('feather')
  ) {
    defaultColor = 'text-violet-500 dark:text-violet-400';
  }

  return cleaned ? `${cleaned} ${defaultColor}` : defaultColor;
};

/**
 * Universal dynamic Lucide SVG icon renderer.
 * Efficiently resolves any icon name with a bright, luminous default color (NEVER pitch black or faint).
 * Features bold stroke width and enhanced default size for optimal legibility.
 */
export const CategoryDynamicIcon: React.FC<DynamicIconProps> = ({ 
  name, 
  size = 24, 
  className = '', 
  strokeWidth = 2.3 
}) => {
  try {
    const finalClassName = resolveLuminousIconColor(name, className);

    if (!name || typeof name !== 'string') {
      return <FolderOpen size={size} strokeWidth={strokeWidth} className={finalClassName} />;
    }

    const key = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // 1) Fast path: check curated registry
    let IconComp = ICON_REGISTRY[key];
    
    // 2) Second path: search full Lucide map
    if (!IconComp) {
      IconComp = ALL_LUCIDE_MAP[key];
    }

    if (IconComp) {
      return <IconComp size={size} strokeWidth={strokeWidth} className={finalClassName} />;
    }

    return <FolderOpen size={size} strokeWidth={strokeWidth} className={finalClassName} />;
  } catch {
    const fallbackClass = resolveLuminousIconColor(name, className);
    return <FolderOpen size={size} strokeWidth={strokeWidth} className={fallbackClass} />;
  }
};

export interface CategoryLuminousTheme {
  gradient: string;
  glow: string;
  ring: string;
  accent: string;
  label: string;
}

/**
 * Maps category attributes to a vibrant, luminous jewel palette so SVG icons
 * radiate with crystal-clear contrast and beauty, never dark or black.
 */
export const getCategoryLuminousTheme = (categoryHint?: string, iconName?: string): CategoryLuminousTheme => {
  const str = `${categoryHint || ''} ${iconName || ''}`.toLowerCase().trim();

  // Ouvertures, Provisions, Richesse, Clé, Fath, Abondance
  if (
    str.includes('ouverture') || str.includes('provision') || str.includes('richesse') || 
    str.includes('argent') || str.includes('rizq') || str.includes('coins') || 
    str.includes('key') || str.includes('fath') || str.includes('prosperite') ||
    str.includes('wealth') || str.includes('wallet') || str.includes('deblocage')
  ) {
    return {
      gradient: 'from-amber-500 via-amber-400 to-yellow-500',
      glow: 'shadow-[0_4px_16px_rgba(245,158,11,0.38)]',
      ring: 'ring-amber-200/50',
      accent: '#f59e0b',
      label: 'Or Rayonnant'
    };
  }

  // Azkar, Wird, Dhikr, Paix, Lune, Nuit, Spiritualité
  if (
    str.includes('azkar') || str.includes('wird') || str.includes('dhikr') || 
    str.includes('zikr') || str.includes('moon') || str.includes('etoile') || 
    str.includes('ciel') || str.includes('paix') || str.includes('compass')
  ) {
    return {
      gradient: 'from-sky-500 via-cyan-400 to-teal-500',
      glow: 'shadow-[0_4px_16px_rgba(14,165,233,0.38)]',
      ring: 'ring-sky-200/50',
      accent: '#0ea5e9',
      label: 'Céleste Azur'
    };
  }

  // Douas, Invocations, Cœur, Guérison, Ruqyah, Amour, Prière
  if (
    str.includes('doua') || str.includes('dua') || str.includes('invocation') || 
    str.includes('heart') || str.includes('amour') || str.includes('priere') || 
    str.includes('ruqyah') || str.includes('guerison') || str.includes('healing')
  ) {
    return {
      gradient: 'from-rose-500 via-pink-400 to-rose-600',
      glow: 'shadow-[0_4px_16px_rgba(244,63,94,0.38)]',
      ring: 'ring-rose-200/50',
      accent: '#f43f5e',
      label: 'Rubis Sacré'
    };
  }

  // Secrets, Asrar, Mystères, Sagesse, Khatim, Arcanes, Élévation
  if (
    str.includes('secret') || str.includes('asrar') || str.includes('khatim') || 
    str.includes('mystere') || str.includes('elevation') || str.includes('crown') || 
    str.includes('gem') || str.includes('sparkles') || str.includes('arcane')
  ) {
    return {
      gradient: 'from-violet-600 via-purple-500 to-indigo-600',
      glow: 'shadow-[0_4px_16px_rgba(139,92,246,0.38)]',
      ring: 'ring-purple-200/50',
      accent: '#8b5cf6',
      label: 'Améthyste Royale'
    };
  }

  // Sihr, Mauvais Œil, Feu, Combat Spirituel, Flamme
  if (
    str.includes('sihr') || str.includes('flame') || str.includes('feu') || 
    str.includes('danger') || str.includes('oeil') || str.includes('evil')
  ) {
    return {
      gradient: 'from-orange-500 via-amber-500 to-red-500',
      glow: 'shadow-[0_4px_16px_rgba(249,115,22,0.38)]',
      ring: 'ring-orange-200/50',
      accent: '#f97316',
      label: 'Lumière Solaire'
    };
  }

  // Favoris
  if (str.includes('favori')) {
    return {
      gradient: 'from-amber-400 via-yellow-400 to-orange-400',
      glow: 'shadow-[0_4px_16px_rgba(251,191,36,0.4)]',
      ring: 'ring-amber-200/50',
      accent: '#f59e0b',
      label: 'Favoris Dorés'
    };
  }

  // Protection, Versets, Coran, Forteresse, Bouclier (Émeraude Majestueuse par défaut)
  return {
    gradient: 'from-emerald-500 via-teal-400 to-emerald-600',
    glow: 'shadow-[0_4px_16px_rgba(16,185,129,0.38)]',
    ring: 'ring-emerald-200/50',
    accent: '#10b981',
    label: 'Émeraude Céleste'
  };
};

interface CategoryVideoOrIconBadgeProps {
  iconName?: string;
  videoUrl?: string;
  categoryName?: string;
  theme?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

/**
 * Ultra-luminous, crystal-clear Category Jewel Badge.
 * Guarantees that SVG category icons are always bright, high-contrast, pure white,
 * framed by a luminous jewel gradient and subtle glass specular highlight — never dark or black.
 */
export const CategoryVideoOrIconBadge: React.FC<CategoryVideoOrIconBadgeProps> = ({
  iconName = 'Sparkles',
  videoUrl,
  categoryName = 'Catégorie',
  theme,
  size = 'md',
  className = '',
  animate = true,
}) => {
  const [isImgError, setIsImgError] = useState(false);

  // Reset error flag if videoUrl changes
  useEffect(() => {
    setIsImgError(false);
  }, [videoUrl]);

  // Size dimensions: significantly enlarged, bold and high-visibility
  const sizeMap = {
    xs: 'w-10 h-10 rounded-xl',
    sm: 'w-13 h-13 sm:w-14 sm:h-14 rounded-2xl',
    md: 'w-15 h-15 sm:w-16 sm:h-16 rounded-2xl',
    lg: 'w-20 h-20 sm:w-22 sm:h-22 rounded-3xl',
    xl: 'w-28 h-28 sm:w-32 sm:h-32 rounded-3xl',
  };

  const iconSizeMap = {
    xs: 22,
    sm: 28,
    md: 34,
    lg: 44,
    xl: 58,
  };

  const containerClasses = sizeMap[size] || sizeMap.md;
  const targetIconSize = iconSizeMap[size] || iconSizeMap.md;

  // Determine luminous palette tailored to the category
  const palette = getCategoryLuminousTheme(theme || categoryName, iconName);

  // Real video asset (only used if explicitly assigned and not broken)
  const hasRealVideo = Boolean(!isImgError && videoUrl && videoUrl.trim().length > 0);
  const trimmedUrl = (videoUrl || '').trim();
  const mp4Url = trimmedUrl ? (trimmedUrl.endsWith('.webp') ? trimmedUrl.replace(/\.webp$/, '.mp4') : trimmedUrl) : '';
  const webpUrl = trimmedUrl ? (trimmedUrl.endsWith('.mp4') ? trimmedUrl.replace(/\.mp4$/, '.webp') : trimmedUrl) : '';

  return (
    <div
      className={`relative ${containerClasses} p-[1.5px] bg-gradient-to-tr ${palette.gradient} ${palette.glow} flex items-center justify-center shrink-0 overflow-hidden group/badge select-none ${className}`}
      title={categoryName}
    >
      {/* Inner luminous jewel container */}
      <div className={`w-full h-full rounded-[inherit] bg-gradient-to-br ${palette.gradient} relative flex items-center justify-center overflow-hidden`}>
        
        {/* Ambient radial lighting for high specular brightness */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.45),transparent_70%)] pointer-events-none" />

        {/* If an HD video was assigned, display it with smooth hardware-accelerated video playback */}
        {hasRealVideo && (
          <div className="absolute inset-0 w-full h-full rounded-[inherit] overflow-hidden z-10 pointer-events-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover brightness-105 contrast-105"
              onError={(e) => {
                e.stopPropagation();
                setIsImgError(true);
              }}
            >
              {mp4Url && <source src={mp4Url} type="video/mp4" onError={(e) => e.stopPropagation()} />}
              {webpUrl && <source src={webpUrl} type="image/webp" onError={(e) => e.stopPropagation()} />}
            </video>
            <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px]" />
          </div>
        )}

        {/* Dynamic Luminous SVG Icon: Always 100% crisp pure white with sharp drop-shadow, NEVER black */}
        <div className="relative z-20 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)] flex items-center justify-center transition-transform duration-300 group-hover/badge:scale-110">
          <CategoryDynamicIcon 
            name={iconName} 
            size={targetIconSize} 
            strokeWidth={2.4} 
            className="text-white drop-shadow-sm" 
          />
        </div>

        {/* Top-edge glassy reflection for jewel depth */}
        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none z-30" />

        {/* Hover shimmer streak */}
        {animate && (
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/25 to-transparent rotate-45 pointer-events-none transition-transform duration-700 group-hover/badge:translate-x-full z-30" />
        )}
      </div>

      {/* Crisp outer glass rim */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none ring-1 ring-inset ring-white/40 z-40" />
    </div>
  );
};
