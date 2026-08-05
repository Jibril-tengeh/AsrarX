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

  // Track internal route stack in sessionStorage step-by-step
  useEffect(() => {
    const currentFull = location.pathname + location.search + location.hash;
    try {
      const rawStack = sessionStorage.getItem('asrar_route_stack');
      let stack: string[] = rawStack ? JSON.parse(rawStack) : [];
      stack = stack.filter(Boolean);

      if (stack[stack.length - 1] !== currentFull) {
        if (location.pathname === '/' || location.pathname === '/user/dashboard') {
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
  }, [location.pathname, location.search, location.hash]);

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

  const isMainPageName = location.pathname === '/' || location.pathname === '/user/dashboard';
  const isVisible = !isMainPageName || hasActiveOverlay || Boolean(location.search) || Boolean(location.hash);

  const handleBack = () => {
    // 1. Dispatch custom event for components to handle in-page step-back (e.g. closing selected items)
    const backEvent = new CustomEvent('asrar_back', { cancelable: true });
    window.dispatchEvent(backEvent);

    if (backEvent.defaultPrevented) {
      return;
    }

    // 2. Check if a DOM modal overlay exists and try to close it
    const activeOverlay = document.querySelector('[data-modal-overlay="true"], .modal-overlay, [role="dialog"]');
    if (activeOverlay) {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true }));
      const closeBtn = activeOverlay.querySelector('button[aria-label*="close" i], button[aria-label*="fermer" i], button.close-modal') as HTMLButtonElement | null;
      if (closeBtn) {
        closeBtn.click();
      }
      return;
    }

    // 3. Clear search parameters / query filters if present
    if (location.search || location.hash) {
      navigate(location.pathname, { replace: true });
      return;
    }

    // 4. Try popping from internal stack
    try {
      const rawStack = sessionStorage.getItem('asrar_route_stack');
      let stack: string[] = rawStack ? JSON.parse(rawStack) : [];
      const currentFull = location.pathname + location.search + location.hash;

      // Remove current location and any identical top entries
      while (stack.length > 0 && stack[stack.length - 1] === currentFull) {
        stack.pop();
      }

      if (stack.length > 0) {
        const prevPath = stack.pop()!;
        sessionStorage.setItem('asrar_route_stack', JSON.stringify(stack));
        navigate(prevPath);
        return;
      }
    } catch (e) {
      console.warn("Error reading route stack", e);
    }

    // 5. Smart hierarchical route fallback
    const currentPath = location.pathname;

    if (currentPath.startsWith('/tools/') && currentPath !== '/tools') {
      navigate('/tools');
      return;
    }

    if (currentPath.startsWith('/explore/') && currentPath !== '/explore') {
      navigate('/explore');
      return;
    }

    if (currentPath.startsWith('/secret/')) {
      const lastMain = sessionStorage.getItem('last_active_main_path') || '/explore';
      navigate(lastMain);
      return;
    }

    if (['/tools', '/explore', '/journal', '/saved', '/profile', '/store', '/community', '/faq', '/payment', '/admin'].includes(currentPath)) {
      navigate('/user/dashboard');
      return;
    }

    // Final fallback to dashboard
    navigate('/user/dashboard');
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
