import React from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { NavigateFunction } from 'react-router-dom';

/**
 * Returns the active router path regardless of HashRouter or BrowserRouter usage.
 */
export function getCurrentRoutePath(): string {
  if (typeof window === 'undefined') return '/';
  
  // Support HashRouter (e.g. http://localhost/#/tools/ruqyah -> /tools/ruqyah)
  if (window.location.hash) {
    const hashContent = window.location.hash.replace(/^#/, '');
    const cleanPath = hashContent.split('?')[0].split('#')[0];
    if (cleanPath && cleanPath.startsWith('/')) {
      return cleanPath;
    }
  }
  
  return window.location.pathname || '/';
}

/**
 * Unified Step-By-Step Back Navigation Handler.
 * Used by both Capacitor Android Hardware Back Button and Floating Back Button UI.
 */
export function executeStepByStepBack(
  navigate: NavigateFunction,
  lastBackPressTimeRef: React.MutableRefObject<number>,
  setBackExitToast?: (show: boolean) => void
): boolean {
  const currentPath = getCurrentRoutePath();
  console.log(`[BackNavigation] Executing step-by-step back. Current route: "${currentPath}"`);

  // 1. Dispatch custom events so open modals/drawers/custom hooks can capture the back press
  const appBackEvent = new CustomEvent('app:backbutton', { cancelable: true });
  const asrarBackEvent = new CustomEvent('asrar_back', { cancelable: true });
  
  const appNotCancelled = window.dispatchEvent(appBackEvent);
  const asrarNotCancelled = window.dispatchEvent(asrarBackEvent);

  if (!appNotCancelled || !asrarNotCancelled) {
    console.log('[BackNavigation] Back press captured by active component or modal listener.');
    return true;
  }

  // 2. Check DOM for active modal overlays or dialogs and attempt to close them
  const activeOverlay = document.querySelector<HTMLElement>(
    [
      '[data-modal-overlay="true"]',
      '.modal-overlay',
      '[role="dialog"]',
      '.fixed.inset-0.z-50',
      '.fixed.inset-0.z-\\[100\\]',
      '.modal-backdrop'
    ].join(', ')
  );

  if (activeOverlay) {
    // Send Escape key event to trigger modal keydown listeners
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true }));
    
    // Look for close button inside modal
    const closeBtn = activeOverlay.querySelector<HTMLElement>(
      'button[aria-label*="close" i], button[aria-label*="fermer" i], button.close-modal, .modal-close-btn, button[data-close-modal="true"]'
    ) || document.querySelector<HTMLElement>('button[aria-label="Fermer"], button[aria-label="Close"], button[aria-label="fermer"]');
    
    if (closeBtn) {
      console.log('[BackNavigation] Closing active modal via DOM close button.');
      closeBtn.click();
      return true;
    }
  }

  // 3. Clear URL search query parameters if present
  if (window.location.search || (window.location.hash && window.location.hash.includes('?'))) {
    console.log('[BackNavigation] Clearing URL query search parameters.');
    navigate(currentPath, { replace: true });
    return true;
  }

  // 4. Pop previous route from internal route history stack stored in sessionStorage
  try {
    const rawStack = sessionStorage.getItem('asrar_route_stack');
    let stack: string[] = rawStack ? JSON.parse(rawStack) : [];
    
    // Filter out current path from top of stack
    while (stack.length > 0 && (stack[stack.length - 1] === currentPath || stack[stack.length - 1].startsWith(currentPath + '?'))) {
      stack.pop();
    }

    if (stack.length > 0) {
      const previousPath = stack.pop()!;
      sessionStorage.setItem('asrar_route_stack', JSON.stringify(stack));
      console.log(`[BackNavigation] Navigating to previous route from stack: "${previousPath}". Remaining: ${stack.length}`);
      navigate(previousPath);
      return true;
    }
  } catch (e) {
    console.warn('[BackNavigation] Route stack error:', e);
  }

  // 5. Hierarchical route step-back fallback logic
  if (currentPath.startsWith('/tools/') && currentPath !== '/tools') {
    console.log('[BackNavigation] Hierarchical fallback: tool sub-page -> /tools');
    navigate('/tools');
    return true;
  }

  if (currentPath.startsWith('/explore/') && currentPath !== '/explore') {
    console.log('[BackNavigation] Hierarchical fallback: article sub-page -> /explore');
    navigate('/explore');
    return true;
  }

  if (currentPath.startsWith('/secret/')) {
    console.log('[BackNavigation] Hierarchical fallback: secret detail -> /user/dashboard');
    navigate('/user/dashboard');
    return true;
  }

  const secondaryMainRoutes = ['/tools', '/explore', '/journal', '/saved', '/profile', '/store', '/community', '/faq', '/payment', '/admin'];
  if (secondaryMainRoutes.includes(currentPath)) {
    console.log(`[BackNavigation] Hierarchical fallback: section "${currentPath}" -> /user/dashboard`);
    navigate('/user/dashboard');
    return true;
  }

  // 6. Root Home Screen Double-Press Exit Safeguard
  const rootHomePaths = ['/user/dashboard', '/', '/home', '/login'];
  if (rootHomePaths.includes(currentPath)) {
    const now = Date.now();
    if (now - lastBackPressTimeRef.current < 2000) {
      console.log(`[BackNavigation] Double back press confirmed on root home (${currentPath}). Exiting app.`);
      try {
        CapacitorApp.exitApp();
      } catch (e) {
        console.warn('Capacitor exitApp call error:', e);
      }
      return true;
    } else {
      lastBackPressTimeRef.current = now;
      if (setBackExitToast) {
        setBackExitToast(true);
        setTimeout(() => setBackExitToast(false), 2000);
      }
      return true;
    }
  }

  // Ultimate fallback to main dashboard
  console.log('[BackNavigation] Ultimate fallback -> /user/dashboard');
  navigate('/user/dashboard');
  return true;
}
