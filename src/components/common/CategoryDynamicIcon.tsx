import React from 'react';
import {
  FolderOpen, Folder, Shield, Moon, BookOpen, Heart, Key, Sparkles, Flame,
  Coins, Compass, Sun, Feather, Star, Volume2, Library, Music, Layers, Crown,
  Search, Tag, Award, Trophy, Bookmark, ShieldCheck, FileText, Zap, Eye, Lock,
  Globe, RefreshCw, Crosshair, Wind, Waves, Gem, Landmark, Clock, Bell, CircleDot,
  Gift, HelpCircle, User, Users, Check, X, Target, Droplets, Mountain, Lightbulb,
  Sparkle, Scroll, Book, BookMarked, Radio, Disc, Play, Activity, AlertTriangle,
  CheckCircle, CheckCircle2, Wallet, CreditCard, FlameKindling, ShieldAlert, Sparkle as StarFour
} from 'lucide-react';
import { getCategoryVideoPreset } from '../../data/categoryIconsData';

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

// Map of all commonly used category and spiritual icons for fast direct lookup
const ICON_REGISTRY: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  folderopen: FolderOpen,
  folder: Folder,
  shield: Shield,
  moon: Moon,
  bookopen: BookOpen,
  heart: Heart,
  key: Key,
  sparkles: Sparkles,
  sparkle: Sparkle,
  flame: Flame,
  coins: Coins,
  compass: Compass,
  sun: Sun,
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
  starfour: StarFour
};

/**
 * Universal dynamic Lucide SVG icon renderer.
 * Efficiently resolves category icons with clean fallback to FolderOpen.
 */
export const CategoryDynamicIcon: React.FC<DynamicIconProps> = ({ name, size = 18, className = '' }) => {
  try {
    if (!name || typeof name !== 'string') {
      return <FolderOpen size={size} className={className} />;
    }

    const key = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const IconComp = ICON_REGISTRY[key];
    if (IconComp) {
      return <IconComp size={size} className={className} />;
    }

    return <FolderOpen size={size} className={className} />;
  } catch {
    return <FolderOpen size={size} className={className} />;
  }
};

interface CategoryVideoOrIconBadgeProps {
  iconName?: string;
  videoUrl?: string;
  categoryName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

/**
 * High-definition Video / Animated SVG Badge for Categories.
 * Supports:
 * 1) Real looping HD WebP/MP4 video badges
 * 2) Dynamic animated video-like badges for any of the 500+ SVG icons
 */
export const CategoryVideoOrIconBadge: React.FC<CategoryVideoOrIconBadgeProps> = ({
  iconName = 'Sparkles',
  videoUrl,
  categoryName = 'Catégorie',
  size = 'md',
  className = '',
  animate = true,
}) => {
  // Size dimensions
  const sizeMap = {
    xs: 'w-8 h-8 rounded-xl',
    sm: 'w-10 h-10 sm:w-11 sm:h-11 rounded-2xl',
    md: 'w-11 h-11 sm:w-12 sm:h-12 rounded-2xl',
    lg: 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 rounded-3xl',
  };

  const iconSizeMap = {
    xs: 15,
    sm: 18,
    md: 22,
    lg: 28,
    xl: 38,
  };

  const containerClasses = sizeMap[size] || sizeMap.md;
  const targetIconSize = iconSizeMap[size] || iconSizeMap.md;

  // Determine if we have a valid video asset
  const hasRealVideo = Boolean(videoUrl && videoUrl.trim().length > 0);
  const cleanVideoUrl = videoUrl ? videoUrl.replace(/\.mp4$/, '.webp') : '';

  if (hasRealVideo) {
    return (
      <div
        className={`relative ${containerClasses} p-[2px] bg-gradient-to-tr from-emerald-600 via-teal-400 to-emerald-500 shadow-[0_2px_8px_rgba(16,185,129,0.25)] flex items-center justify-center shrink-0 overflow-hidden ${className}`}
        title={categoryName}
      >
        <img
          src={cleanVideoUrl}
          alt={categoryName}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover rounded-[inherit] bg-[#051109] pointer-events-none select-none"
          onError={(e) => {
            // Fallback to animated SVG badge if video fails to load
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
        {/* Crisp rim highlight */}
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none ring-1 ring-inset ring-white/20" />
      </div>
    );
  }

  // Animated Video Badge: SVG icon embedded in a luminous video-like aura
  return (
    <div
      className={`relative ${containerClasses} p-[2px] bg-gradient-to-tr from-emerald-600 via-teal-400 to-emerald-500 shadow-[0_2px_8px_rgba(16,185,129,0.25)] flex items-center justify-center shrink-0 overflow-hidden group/badge ${className}`}
      title={categoryName}
    >
      {/* Inner background with deep cosmic emerald backdrop */}
      <div className="w-full h-full rounded-[inherit] bg-gradient-to-b from-gray-900 via-emerald-950 to-gray-950 relative flex items-center justify-center overflow-hidden">
        {/* Animated fluid aurora / energy glow inside the badge */}
        {animate && (
          <>
            <div className="absolute -inset-1 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.45),transparent_70%)] animate-pulse" />
            <div className="absolute top-0 right-0 w-8 h-8 bg-teal-400/20 rounded-full blur-xs pointer-events-none" />
          </>
        )}

        {/* Dynamic Vector SVG Icon with emerald-teal luminous tint */}
        <div className="relative z-10 text-emerald-300 drop-shadow-[0_2px_6px_rgba(16,185,129,0.6)] flex items-center justify-center transition-transform duration-300 group-hover/badge:scale-110">
          <CategoryDynamicIcon name={iconName} size={targetIconSize} />
        </div>
      </div>

      {/* Outer subtle rim */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none ring-1 ring-inset ring-white/20" />
    </div>
  );
};
