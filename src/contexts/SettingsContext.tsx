import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export interface SettingsContextType {
  batterySaver: boolean;
  setBatterySaver: (enabled: boolean) => void;
  toggleBatterySaver: () => void;
  backgroundSyncFrequencyMs: number;
  diagnosticCheckFrequencyMs: number;
  reduceAnimations: boolean;
  lazyLoadRootMargin: string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const BATTERY_SAVER_STORAGE_KEY = 'asrar_battery_saver';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [batterySaver, setBatterySaverState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(BATTERY_SAVER_STORAGE_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
      // Check if device is in hardware battery saving mode (if supported by Battery API)
      if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
        // Battery API is async, will be checked in effect
      }
    } catch (e) {
      // Safe fallback
    }
    return false;
  });

  // Apply CSS class to documentElement for global animation & performance dampening
  const applyBatterySaverEffects = useCallback((enabled: boolean) => {
    try {
      const root = document.documentElement;
      root.classList.toggle('battery-saver', enabled);
      root.classList.toggle('reduce-motion', enabled);

      if (enabled) {
        root.style.setProperty('--app-animation-duration-multiplier', '0.001');
      } else {
        root.style.removeProperty('--app-animation-duration-multiplier');
      }
    } catch (e) {
      console.warn('[SettingsContext] Could not update DOM battery saver classes:', e);
    }
  }, []);

  // Initialize and listen for battery status if available
  useEffect(() => {
    applyBatterySaverEffects(batterySaver);

    // If Battery Status API is available, detect low battery state
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery?.().then((battery: any) => {
        if (battery && battery.level !== undefined && battery.level <= 0.15 && !battery.charging) {
          // If device is strictly below 15% battery and not charging, suggest or auto-enable battery saver if not explicitly disabled
          const explicitChoice = localStorage.getItem(BATTERY_SAVER_STORAGE_KEY);
          if (explicitChoice === null) {
            setBatterySaverState(true);
            applyBatterySaverEffects(true);
          }
        }
      }).catch(() => {});
    }
  }, [batterySaver, applyBatterySaverEffects]);

  const setBatterySaver = useCallback((enabled: boolean) => {
    setBatterySaverState(enabled);
    try {
      localStorage.setItem(BATTERY_SAVER_STORAGE_KEY, String(enabled));
    } catch (e) {}
    applyBatterySaverEffects(enabled);

    // Optional Firestore user preference sync
    try {
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid) {
        const userRef = doc(db, 'users', currentUser.uid);
        updateDoc(userRef, { batterySaver: enabled }).catch(() => {});
      }
    } catch (e) {}

    // Dispatch custom event for immediate response across any non-React listeners
    try {
      window.dispatchEvent(new CustomEvent('asrar_battery_saver_changed', { detail: { enabled } }));
    } catch (e) {}
  }, [applyBatterySaverEffects]);

  const toggleBatterySaver = useCallback(() => {
    setBatterySaver(!batterySaver);
  }, [batterySaver, setBatterySaver]);

  // Derived performance configs
  const backgroundSyncFrequencyMs = batterySaver ? 30 * 60 * 1000 : 10 * 60 * 1000; // 30 min in Battery Saver vs 10 min normal
  const diagnosticCheckFrequencyMs = batterySaver ? 5 * 60 * 1000 : 60 * 1000;      // 5 min in Battery Saver vs 1 min normal
  const reduceAnimations = batterySaver;
  const lazyLoadRootMargin = batterySaver ? '50px 0px' : '250px 0px';               // Tighter lazy preload margin to save mobile memory/data

  return (
    <SettingsContext.Provider
      value={{
        batterySaver,
        setBatterySaver,
        toggleBatterySaver,
        backgroundSyncFrequencyMs,
        diagnosticCheckFrequencyMs,
        reduceAnimations,
        lazyLoadRootMargin,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
