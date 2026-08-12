import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { executeStepByStepBack, getCurrentRoutePath } from '../utils/backNavigation';

export const FloatingBackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [hasActiveOverlay, setHasActiveOverlay] = useState(false);
  const lastBackPressTimeRef = useRef<number>(0);

  const activePath = getCurrentRoutePath();

  // Track internal route stack in sessionStorage step-by-step
  useEffect(() => {
    const currentFull = activePath + location.search + location.hash;
    try {
      const rawStack = sessionStorage.getItem('asrar_route_stack');
      let stack: string[] = rawStack ? JSON.parse(rawStack) : [];
      stack = stack.filter(Boolean);

      if (stack[stack.length - 1] !== currentFull) {
        if (activePath === '/' || activePath === '/user/dashboard') {
          stack = ['/user/dashboard'];
        } else {
          stack.push(currentFull);
          if (stack.length > 30) {
            stack = stack.slice(stack.length - 30);
          }
        }
        sessionStorage.setItem('asrar_route_stack', JSON.stringify(stack));
      }
    } catch (e) {
      console.warn("Error updating route stack", e);
    }
  }, [activePath, location.search, location.hash]);

  // Monitor DOM for active overlays/modals
  useEffect(() => {
    const checkOverlay = () => {
      const activeOverlay = document.querySelector('[data-modal-overlay="true"], .modal-overlay, [role="dialog"]');
      setHasActiveOverlay(!!activeOverlay);
    };

    checkOverlay();
    const observer = new MutationObserver(checkOverlay);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, []);

  const isMainPageName = activePath === '/' || activePath === '/user/dashboard';
  const isVisible = !isMainPageName || hasActiveOverlay || Boolean(location.search) || Boolean(location.hash);

  const handleBack = () => {
    executeStepByStepBack(navigate, lastBackPressTimeRef);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, x: -20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.8 }}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          className="fixed left-4 bottom-24 z-[100] w-14 h-14 flex items-center justify-center bg-black/30 dark:bg-black/50 backdrop-blur-md border border-white/30 dark:border-white/20 rounded-full shadow-2xl text-white transition-all hover:bg-black/40 dark:hover:bg-black/70 hover:scale-110 active:scale-95"
          aria-label={t('back', 'Retour')}
        >
          <ArrowLeft size={28} className="text-yellow-400 drop-shadow-md animate-pulse" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

