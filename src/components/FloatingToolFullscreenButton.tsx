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
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[990] flex items-center pointer-events-auto"
      >
        <motion.button
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.92 }}
          onClick={enterFullscreen}
          className="group relative flex items-center gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl shadow-emerald-900/25 border border-emerald-400/30 backdrop-blur-md transition-all duration-200 cursor-pointer"
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
            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
          >
            <Maximize2 size={16} className="text-emerald-100 group-hover:text-white transition-colors" />
          </motion.div>
          
          <span className="text-xs font-bold tracking-tight pr-0.5">
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
