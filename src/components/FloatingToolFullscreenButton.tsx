import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2 } from 'lucide-react';
import { useFullscreen } from '../contexts/FullscreenContext';
import { useLanguage } from '../contexts/LanguageContext';

export const FloatingToolFullscreenButton: React.FC = () => {
  const { isFullscreen, enterFullscreen } = useFullscreen();
  const { language } = useLanguage();
  const location = useLocation();

  // Show only on article details (/secret/*, /article/*) and spiritual tools (/tools, /tools/*)
  const isArticlePage = location.pathname.startsWith('/secret') || location.pathname.startsWith('/article');
  const isToolPage = location.pathname.startsWith('/tools');
  
  const isEligiblePage = isArticlePage || isToolPage;

  // Never show on the homepage, dashboard, or when already in fullscreen
  if (!isEligiblePage || isFullscreen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 15 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 z-[990] flex items-center justify-center pointer-events-auto"
      >
        <motion.button
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={enterFullscreen}
          className="group relative flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-full bg-zinc-950/40 hover:bg-zinc-950/70 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/70 text-zinc-100 hover:text-white shadow-lg shadow-black/20 hover:shadow-emerald-950/30 border border-white/20 hover:border-emerald-400/50 backdrop-blur-md transition-all duration-200 cursor-pointer whitespace-nowrap"
          title={
            language === 'fr'
              ? 'Activer le mode Plein Écran (Immersion sans distraction)'
              : language === 'ha'
              ? 'Kunna Cikakken Fuska'
              : 'Enter Fullscreen (Distraction-free mode)'
          }
          aria-label="Enter Fullscreen"
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="flex items-center justify-center text-emerald-400 group-hover:text-emerald-300"
          >
            <Maximize2 size={15} className="transition-colors" />
          </motion.div>
          
          <span className="text-[11px] sm:text-xs font-medium tracking-tight pr-0.5 text-zinc-200 group-hover:text-white">
            {language === 'fr' 
              ? 'Plein Écran' 
              : language === 'ha'
              ? 'Cikakken Fuska'
              : 'Fullscreen'}
          </span>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};
