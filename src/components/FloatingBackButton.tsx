import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const FloatingBackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [hasActiveOverlay, setHasActiveOverlay] = useState(false);

  const isMainPage = location.pathname === '/' || 
                     location.pathname === '/user/dashboard' || 
                     location.pathname === '/explore' || 
                     location.pathname === '/tools' || 
                     location.pathname === '/journal' || 
                     location.pathname === '/saved' || 
                     location.pathname === '/profile';

  useEffect(() => {
    const checkOverlay = () => {
      const activeOverlay = document.querySelector('[data-modal-overlay="true"]');
      setHasActiveOverlay(!!activeOverlay);
    };

    checkOverlay();
    const observer = new MutationObserver(checkOverlay);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {!isMainPage && !hasActiveOverlay && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              if (location.pathname.startsWith('/tools/')) {
                navigate('/tools');
              } else if (location.pathname.startsWith('/explore/')) {
                navigate('/explore');
              } else if (location.pathname.startsWith('/secret/')) {
                navigate('/user/dashboard');
              } else {
                const backPath = sessionStorage.getItem('last_active_main_path') || '/user/dashboard';
                navigate(backPath);
              }
            }
          }}
          className="fixed left-4 bottom-24 z-[100] w-14 h-14 flex items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-md border border-white/30 dark:border-white/20 rounded-full shadow-lg text-white transition-all hover:bg-black/30 dark:hover:bg-black/60 hover:scale-110 active:scale-95"
          aria-label={t('back', 'Retour')}
        >
          <ArrowLeft size={28} className="text-yellow-400 drop-shadow-md animate-pulse" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
