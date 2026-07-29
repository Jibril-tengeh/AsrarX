import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Shield, 
  Crown, 
  Flame, 
  Moon, 
  Compass, 
  Key, 
  Eye, 
  Hexagon, 
  Star,
  Heart,
  Feather,
  Anchor,
  BookMarked,
  ShieldCheck,
  Sun,
  Zap,
  Wand2,
  Scroll,
  Gem,
  Infinity
} from 'lucide-react';

interface Animated3DBookIconProps {
  type: string;
  titleAr: string;
  titleFr: string;
  themeColor?: string;
  bgGlow?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isHovered?: boolean;
}

export const Animated3DBookIcon: React.FC<Animated3DBookIconProps> = ({
  type,
  titleAr,
  titleFr,
  themeColor = 'from-amber-600 via-yellow-500 to-amber-700',
  bgGlow = '#f59e0b',
  size = 'md',
  isHovered = false,
}) => {
  const [rotationY, setRotationY] = useState(0);

  // Video-like continuous subtle floating & 3D rotation animation
  useEffect(() => {
    let animationFrameId: number;
    let startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      // Oscillate Y rotation between -12 and +12 degrees over time (video-like loop)
      const rot = Math.sin(elapsed * 1.5) * 14;
      setRotationY(rot);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const dimensions = {
    sm: { width: 'w-24', height: 'h-32', perspective: '800px', fontSize: 'text-xs' },
    md: { width: 'w-36 sm:w-40', height: 'h-48 sm:h-52', perspective: '1000px', fontSize: 'text-sm' },
    lg: { width: 'w-48 sm:w-56', height: 'h-64 sm:h-72', perspective: '1200px', fontSize: 'text-base' },
    xl: { width: 'w-60 sm:w-72', height: 'h-80 sm:h-96', perspective: '1400px', fontSize: 'text-lg' }
  }[size];

  // Pick cover icon symbol based on book type
  const renderBookSymbol = () => {
    switch (type) {
      case 'barhatiah':
        return <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 animate-pulse drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />;
      case 'picatrix':
        return <Moon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-300 animate-pulse drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />;
      case 'lataif':
        return <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-300 animate-pulse drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />;
      case 'ajnas':
        return <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-rose-300 animate-pulse drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]" />;
      case 'futuhat':
        return <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-amber-200 animate-pulse drop-shadow-[0_0_10px_rgba(252,211,77,0.8)]" />;
      case 'shumush':
        return <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-300 animate-pulse drop-shadow-[0_0_10px_rgba(253,186,116,0.8)]" />;
      case 'jifr':
        return <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-300 animate-pulse drop-shadow-[0_0_10px_rgba(165,180,252,0.8)]" />;
      case 'sirr':
        return <Hexagon className="w-8 h-8 sm:w-10 sm:h-10 text-teal-300 animate-pulse drop-shadow-[0_0_10px_rgba(94,234,212,0.8)]" />;
      case 'kanz':
        return <Key className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 animate-pulse drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]" />;
      case 'ufuk':
        return <Star className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 animate-pulse drop-shadow-[0_0_10px_rgba(252,211,77,0.8)]" />;
      case 'lumah':
        return <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-sky-300 animate-pulse drop-shadow-[0_0_10px_rgba(125,211,252,0.8)]" />;
      case 'diryak':
        return <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-300 animate-pulse drop-shadow-[0_0_10px_rgba(110,231,183,0.8)]" />;
      case 'dalail':
        return <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-rose-300 animate-pulse drop-shadow-[0_0_10px_rgba(253,164,175,0.8)]" />;
      case 'sahifah':
        return <Feather className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-200 animate-pulse drop-shadow-[0_0_10px_rgba(167,243,208,0.8)]" />;
      case 'ahzab_shadhili':
        return <Anchor className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-300 animate-pulse drop-shadow-[0_0_10px_rgba(103,232,249,0.8)]" />;
      case 'adhkar_nawawi':
        return <BookMarked className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 animate-pulse drop-shadow-[0_0_10px_rgba(252,211,77,0.8)]" />;
      case 'hizb_azam':
        return <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 animate-pulse drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]" />;
      case 'awrad_fathiyyah':
        return <Sun className="w-8 h-8 sm:w-10 sm:h-10 text-orange-300 animate-pulse drop-shadow-[0_0_10px_rgba(253,186,116,0.8)]" />;
      case 'jaljalutiyah':
        return <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-purple-300 animate-pulse drop-shadow-[0_0_10px_rgba(216,180,254,0.8)]" />;
      case 'mujarrabat_dirby':
        return <Wand2 className="w-8 h-8 sm:w-10 sm:h-10 text-violet-300 animate-pulse drop-shadow-[0_0_10px_rgba(196,181,253,0.8)]" />;
      case 'dawah_harutiyyah':
        return <Scroll className="w-8 h-8 sm:w-10 sm:h-10 text-red-300 animate-pulse drop-shadow-[0_0_10px_rgba(252,165,165,0.8)]" />;
      case 'durr_manthum':
        return <Gem className="w-8 h-8 sm:w-10 sm:h-10 text-teal-300 animate-pulse drop-shadow-[0_0_10px_rgba(153,246,228,0.8)]" />;
      case 'ahzab_irfaniyyah':
        return <Infinity className="w-8 h-8 sm:w-10 sm:h-10 text-blue-300 animate-pulse drop-shadow-[0_0_10px_rgba(147,197,253,0.8)]" />;
      default:
        return <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 animate-pulse" />;
    }
  };

  return (
    <div 
      className={`relative ${dimensions.width} ${dimensions.height} flex items-center justify-center group cursor-pointer select-none`}
      style={{ perspective: dimensions.perspective }}
    >
      {/* Dynamic Animated Ambient Glow / Video Halo */}
      <div 
        className="absolute inset-0 rounded-2xl filter blur-2xl opacity-60 transition-opacity duration-700 group-hover:opacity-90 animate-pulse"
        style={{ backgroundColor: bgGlow }}
      />

      {/* Floating Animated Video Sparkles */}
      <div className="absolute -top-3 -right-2 z-20 pointer-events-none animate-bounce">
        <Sparkles className="w-5 h-5 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
      </div>

      {/* 3D Container with rotation */}
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out transform-gpu"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${isHovered ? rotationY + 15 : rotationY}deg) rotateX(${isHovered ? -5 : 0}deg) translateZ(10px)`,
        }}
      >
        {/* Book Spine (Left side 3D depth) */}
        <div 
          className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-gray-900 via-amber-950 to-amber-900 border-r border-amber-500/40 rounded-l-md transform -translate-x-full rotate-y-90 origin-right shadow-2xl flex flex-col justify-between py-4 items-center"
          style={{ transform: 'rotateY(-90deg) translateZ(0px)', width: '24px' }}
        >
          <div className="w-2 h-2 rounded-full bg-amber-400/80 shadow-[0_0_6px_#f59e0b]" />
          <div className="text-[10px] font-bold text-amber-300 tracking-widest rotate-90 whitespace-nowrap opacity-80 uppercase">
            {titleAr.slice(0, 12)}
          </div>
          <div className="w-2 h-2 rounded-full bg-amber-400/80 shadow-[0_0_6px_#f59e0b]" />
        </div>

        {/* Book Pages (Right side 3D gold edge layer) */}
        <div 
          className="absolute top-2 bottom-2 right-1 w-5 bg-gradient-to-b from-amber-100 via-yellow-200 to-amber-100 rounded-r border-r border-amber-400/50 shadow-inner opacity-90"
          style={{ transform: 'translateZ(-6px) translateX(12px)', width: '18px' }}
        >
          <div className="w-full h-full bg-[repeating-linear-gradient(0deg,#d97706_0px,#d97706_1px,transparent_1px,transparent_3px)] opacity-30" />
        </div>

        {/* Book Front Cover (Main 3D Canvas) */}
        <div 
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${themeColor} p-3 sm:p-4 border-2 border-amber-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden backdrop-blur-md`}
          style={{ transform: 'translateZ(12px)' }}
        >
          {/* Shimmer / Light sheen overlay */}
          <div className="absolute -inset-full top-0 block w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent transform -skew-x-12 animate-[shimmer_3s_infinite]" />

          {/* Gold Filigree Corner Borders */}
          <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-amber-300/80 rounded-tl" />
          <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-amber-300/80 rounded-tr" />
          <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-amber-300/80 rounded-bl" />
          <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-amber-300/80 rounded-br" />

          {/* Top Header Label */}
          <div className="text-center pt-1 z-10">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-amber-200/90 bg-black/40 px-2 py-0.5 rounded-full border border-amber-400/30 shadow">
              مخطوطة مقدسة
            </span>
          </div>

          {/* Center 3D Holographic Emblem */}
          <div className="relative my-auto flex flex-col items-center justify-center z-10 py-1">
            <div className="relative p-3 sm:p-4 rounded-full bg-black/50 border border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center">
              {renderBookSymbol()}
            </div>
            
            <p className="font-arabic text-base sm:text-lg font-bold text-amber-100 text-center mt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] dir-rtl leading-tight">
              {titleAr}
            </p>
          </div>

          {/* Bottom Title */}
          <div className="text-center pb-1 z-10">
            <p className="text-[11px] sm:text-xs font-bold text-amber-200 line-clamp-1 truncate drop-shadow">
              {titleFr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
