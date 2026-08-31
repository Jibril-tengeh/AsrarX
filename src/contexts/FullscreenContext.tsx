import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface FullscreenContextType {
  isFullscreen: boolean;
  isSupported: boolean;
  toggleFullscreen: () => Promise<void>;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
}

const FullscreenContext = createContext<FullscreenContextType>({
  isFullscreen: false,
  isSupported: true,
  toggleFullscreen: async () => {},
  enterFullscreen: async () => {},
  exitFullscreen: async () => {},
});

export const FullscreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('asrarhub_immersive_fullscreen') === 'true';
    } catch {
      return false;
    }
  });

  const [isSupported] = useState<boolean>(() => {
    return typeof document !== 'undefined';
  });

  // Sync state with HTML5 Fullscreen API events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNativeFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      
      // If user exited via ESC key in native mode
      if (!isNativeFullscreen && !localStorage.getItem('asrarhub_immersive_fullscreen')) {
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Apply/remove CSS class on document body for styling adjustments
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isFullscreen) {
      document.documentElement.classList.add('immersive-fullscreen-active');
      document.body.classList.add('immersive-fullscreen-active');
      try {
        localStorage.setItem('asrarhub_immersive_fullscreen', 'true');
      } catch {}
    } else {
      document.documentElement.classList.remove('immersive-fullscreen-active');
      document.body.classList.remove('immersive-fullscreen-active');
      try {
        localStorage.removeItem('asrarhub_immersive_fullscreen');
      } catch {}
    }
  }, [isFullscreen]);

  const enterFullscreen = useCallback(async () => {
    setIsFullscreen(true);
    try {
      localStorage.setItem('asrarhub_immersive_fullscreen', 'true');
    } catch {}

    try {
      const docEl = document.documentElement as any;
      if (!document.fullscreenElement && docEl.requestFullscreen) {
        await docEl.requestFullscreen().catch(() => {});
      } else if (!document.fullscreenElement && docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen().catch(() => {});
      }
    } catch {
      // Graceful fallback to pure CSS immersive mode (e.g. inside iframes / iOS Safari)
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    setIsFullscreen(false);
    try {
      localStorage.removeItem('asrarhub_immersive_fullscreen');
    } catch {}

    try {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen().catch(() => {});
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen().catch(() => {});
        }
      }
    } catch {
      // Safe fallback
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return (
    <FullscreenContext.Provider
      value={{
        isFullscreen,
        isSupported,
        toggleFullscreen,
        enterFullscreen,
        exitFullscreen,
      }}
    >
      {children}
    </FullscreenContext.Provider>
  );
};

export const useFullscreen = () => useContext(FullscreenContext);
