import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw, ArrowDown, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  isRefreshing?: boolean;
  disabled?: boolean;
  pullThreshold?: number;
  maxPull?: number;
  children: React.ReactNode;
  className?: string;
  pullText?: string;
  releaseText?: string;
  refreshingText?: string;
  successText?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  isRefreshing: externalIsRefreshing,
  disabled = false,
  pullThreshold = 65,
  maxPull = 110,
  children,
  className = '',
  pullText = 'Tirer pour actualiser',
  releaseText = 'Relâcher pour actualiser',
  refreshingText = 'Actualisation...',
  successText = 'Mis à jour'
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [internalIsRefreshing, setInternalIsRefreshing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const isRefreshing = externalIsRefreshing !== undefined ? externalIsRefreshing : internalIsRefreshing;

  const startYRef = useRef<number | null>(null);
  const startXRef = useRef<number | null>(null);
  const isPullingRef = useRef(false);
  const hasTriggeredHapticRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isAtTop = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const windowScrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    if (windowScrollTop > 3) return false;
    if (containerRef.current) {
      const containerScrollTop = containerRef.current.scrollTop || 0;
      if (containerScrollTop > 3) return false;
    }
    return true;
  }, []);

  const handleTouchStart = (e: React.TouchEvent | TouchEvent) => {
    if (disabled || isRefreshing) return;
    if (isAtTop()) {
      startYRef.current = e.touches[0].clientY;
      startXRef.current = e.touches[0].clientX;
      isPullingRef.current = true;
      hasTriggeredHapticRef.current = false;
    } else {
      startYRef.current = null;
      startXRef.current = null;
      isPullingRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent | TouchEvent) => {
    if (disabled || isRefreshing || !isPullingRef.current || startYRef.current === null || startXRef.current === null) {
      return;
    }

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - startYRef.current;
    const deltaX = Math.abs(currentX - startXRef.current);

    // If horizontal swipe is greater than vertical, don't hijack gesture
    if (deltaX > Math.abs(deltaY) && pullDistance === 0) {
      isPullingRef.current = false;
      return;
    }

    // Only allow pulling down when at the top of scroll
    if (deltaY > 0 && isAtTop()) {
      // Damped pull distance (rubber-band physics)
      const damped = Math.min(maxPull, Math.pow(deltaY, 0.82) * 1.6);
      setPullDistance(damped);

      // Light haptic pulse when crossing threshold
      if (damped >= pullThreshold && !hasTriggeredHapticRef.current) {
        hasTriggeredHapticRef.current = true;
        try {
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(12);
          }
        } catch (e) {}
      } else if (damped < pullThreshold) {
        hasTriggeredHapticRef.current = false;
      }

      // Prevent native overscroll when active
      if (e.cancelable && damped > 5) {
        e.preventDefault();
      }
    } else {
      setPullDistance(0);
      isPullingRef.current = false;
    }
  };

  const executeRefresh = async () => {
    setInternalIsRefreshing(true);
    setPullDistance(52); // Hold position while refreshing
    try {
      await Promise.resolve(onRefresh());
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setPullDistance(0);
        setInternalIsRefreshing(false);
      }, 600);
    } catch (err) {
      console.warn('[PullToRefresh] Refresh completed with notice:', err);
      setPullDistance(0);
      setInternalIsRefreshing(false);
    }
  };

  const handleTouchEnd = () => {
    if (!isPullingRef.current || startYRef.current === null) return;
    isPullingRef.current = false;
    startYRef.current = null;
    startXRef.current = null;

    if (pullDistance >= pullThreshold && !isRefreshing) {
      executeRefresh();
    } else if (!isRefreshing) {
      setPullDistance(0);
    }
  };

  // Synchronize when external isRefreshing prop changes
  useEffect(() => {
    if (externalIsRefreshing !== undefined) {
      if (externalIsRefreshing) {
        setPullDistance(52);
      } else if (!showSuccess) {
        setPullDistance(0);
      }
    }
  }, [externalIsRefreshing, showSuccess]);

  const progressRatio = Math.min(1, pullDistance / pullThreshold);
  const isReady = pullDistance >= pullThreshold;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`relative w-full ${className}`}
    >
      {/* Pull Indicator Area (Smooth modern circular spinner & feedback badge) */}
      <div
        className="absolute top-0 left-0 right-0 overflow-visible flex items-center justify-center pointer-events-none z-30 transition-all duration-200 ease-out"
        style={{
          height: isRefreshing ? 54 : pullDistance > 0 ? pullDistance : 0,
          opacity: pullDistance > 8 || isRefreshing ? 1 : 0,
          transform: `translateY(${isRefreshing ? 6 : Math.max(0, pullDistance - 42)}px)`
        }}
      >
        <div className="py-1 flex items-center justify-center">
          <div
            className={`flex items-center gap-2.5 px-4 py-2 rounded-full shadow-lg backdrop-blur-md text-xs font-semibold transition-all duration-300 ${
              showSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/40 scale-105'
                : isRefreshing
                ? 'bg-white/95 dark:bg-gray-850/95 text-emerald-600 dark:text-emerald-400 border border-emerald-300/80 dark:border-emerald-700/80 shadow-emerald-500/15 ring-2 ring-emerald-500/20'
                : isReady
                ? 'bg-emerald-600 text-white shadow-emerald-600/35 ring-2 ring-emerald-300/50 scale-105'
                : 'bg-white/95 dark:bg-gray-850/95 text-gray-700 dark:text-gray-200 border border-gray-200/80 dark:border-gray-700/80 shadow-black/5'
            }`}
          >
            {showSuccess ? (
              <>
                <motion.div
                  initial={{ scale: 0.5, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Check size={15} className="stroke-[3] text-white" />
                </motion.div>
                <span className="font-bold tracking-wide">{successText}</span>
              </>
            ) : isRefreshing ? (
              <>
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <RefreshCw size={15} className="animate-spin text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                </div>
                <span className="font-semibold">{refreshingText}</span>
              </>
            ) : (
              <>
                {/* Circular pull-progress indicator ring */}
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <svg className="w-4 h-4 -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                      className="opacity-20"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke={isReady ? '#ffffff' : '#059669'}
                      strokeWidth="2.5"
                      fill="none"
                      strokeDasharray={56.54}
                      strokeDashoffset={56.54 * (1 - progressRatio)}
                      strokeLinecap="round"
                      className="transition-all duration-75"
                    />
                  </svg>
                  <ArrowDown
                    size={10}
                    className={`absolute inset-0 m-auto transition-transform duration-150 ${
                      isReady ? 'text-white rotate-180 scale-110' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  />
                </div>
                <span>{isReady ? releaseText : pullText}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="w-full transition-transform duration-200 ease-out"
        style={{
          transform: !isRefreshing && pullDistance > 0 ? `translateY(${Math.min(10, pullDistance * 0.15)}px)` : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};
