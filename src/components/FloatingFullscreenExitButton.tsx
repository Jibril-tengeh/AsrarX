import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Minimize2, Maximize2, X, Eye } from 'lucide-react';
import { useFullscreen } from '../contexts/FullscreenContext';
import { useLanguage } from '../contexts/LanguageContext';

export const FloatingFullscreenExitButton: React.FC = () => {
  const { isFullscreen, exitFullscreen } = useFullscreen();
  const { language } = useLanguage();

  if (!isFullscreen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="fixed top-3 right-3 sm:top-4 sm:right-4 z-[9999] flex items-center gap-2 pointer-events-auto"
      >
        <div className="bg-gray-900/90 hover:bg-gray-900 dark:bg-gray-800/95 dark:hover:bg-gray-800 text-white backdrop-blur-md px-3.5 py-2 rounded-full shadow-2xl border border-white/20 flex items-center gap-2 group transition-all duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold tracking-wide text-gray-200 hidden sm:inline">
            {language === 'fr' 
              ? 'Mode Plein Écran' 
              : language === 'ha'
              ? 'Yanayin Cikakken Fuska'
              : 'Fullscreen Mode'}
          </span>
          <button
            type="button"
            onClick={exitFullscreen}
            className="flex items-center gap-1.5 px-2 py-0.5 bg-white/15 hover:bg-emerald-500 hover:text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
            title={language === 'fr' ? 'Quitter le mode plein écran (Échap)' : 'Exit fullscreen (Esc)'}
            aria-label="Exit fullscreen"
          >
            <Minimize2 size={13} />
            <span className="text-[11px]">{language === 'fr' ? 'Quitter' : language === 'ha' ? 'Fita' : 'Exit'}</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
