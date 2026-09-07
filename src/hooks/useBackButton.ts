import { useEffect, useRef } from 'react';

/**
 * Hook to handle mobile / Capacitor hardware back button presses for modals, overlays, sub-views, and tools.
 * 
 * @param onBack Callback executed when back button is pressed while active.
 * @param active Boolean flag indicating whether this component or modal currently wants to capture the back button.
 */
export function useBackButton(onBack: () => void, active: boolean = true) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (!active) return;

    const handleBack = (e: Event) => {
      e.preventDefault(); // Prevents propagation to root route navigation / app exit
      onBackRef.current();
    };

    window.addEventListener('app:backbutton', handleBack);
    window.addEventListener('asrar_back', handleBack);
    return () => {
      window.removeEventListener('app:backbutton', handleBack);
      window.removeEventListener('asrar_back', handleBack);
    };
  }, [active]);
}

