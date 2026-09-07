import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFeatures } from '../contexts/FeatureContext';
import { executeStepByStepBack, getCurrentRoutePath } from '../utils/backNavigation';
import { getFloatingBackButtonConfig } from '../utils/floatingBackButtonConfig';
import { FloatingBackButtonRenderer } from './FloatingBackButtonRenderer';

export const FloatingBackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { featureToggles } = useFeatures();
  const [hasActiveOverlay, setHasActiveOverlay] = useState(false);
  const lastBackPressTimeRef = useRef<number>(0);

  const activePath = getCurrentRoutePath();
  const config = getFloatingBackButtonConfig(featureToggles);

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

  if (config.enabled === false) {
    return null;
  }

  const isMainPageName = activePath === '/' || activePath === '/user/dashboard';
  const isVisible = !isMainPageName || hasActiveOverlay || Boolean(location.search) || Boolean(location.hash);

  const handleBack = () => {
    executeStepByStepBack(navigate, lastBackPressTimeRef);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <FloatingBackButtonRenderer
          config={config}
          onClick={handleBack}
          ariaLabel={t('back', 'Retour')}
        />
      )}
    </AnimatePresence>
  );
};


