import { useEffect } from 'react';

/**
 * Hook to handle mobile / Capacitor hardware back button presses for modals, overlays, sub-views, and tools.
 * 
 * @param onBack Callback executed when back button is pressed while active.
 * @param active Boolean flag indicating whether this component or modal currently wants to capture the back button.
 */
export function useBackButton(onBack: () => void, active: boolean = true) {
  useEffect(() => {
    if (!active) return;

    const handleBack = (e: Event) => {
      e.preventDefault(); // Prevents propagation to root route navigation / app exit
      onBack();
    };

    window.addEventListener('app:backbutton', handleBack);
    return () => {
      window.removeEventListener('app:backbutton', handleBack);
    };
  }, [onBack, active]);
}
