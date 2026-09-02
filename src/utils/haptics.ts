import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { useState, useEffect, useCallback } from 'react';

export interface HapticsConfig {
  enabled: boolean;
  buttonFeedback: boolean;
  dhikrFeedback: boolean;
  intensity: 'light' | 'medium' | 'heavy';
  targetCelebration: boolean;
}

const STORAGE_KEY = 'asrarhub_haptics_config';
const EVENT_KEY = 'asrarhub_haptics_changed';

export const DEFAULT_HAPTICS_CONFIG: HapticsConfig = {
  enabled: true,
  buttonFeedback: true,
  dhikrFeedback: true,
  intensity: 'light',
  targetCelebration: true,
};

/**
 * Retrieve current haptic feedback settings from storage
 */
export function getHapticsConfig(): HapticsConfig {
  if (typeof window === 'undefined') return DEFAULT_HAPTICS_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HAPTICS_CONFIG;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_HAPTICS_CONFIG, ...parsed };
  } catch {
    return DEFAULT_HAPTICS_CONFIG;
  }
}

/**
 * Save updated haptic settings and notify active listeners
 */
export function saveHapticsConfig(config: Partial<HapticsConfig>): HapticsConfig {
  const updated = { ...getHapticsConfig(), ...config };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: updated }));
    } catch (e) {
      console.warn('Failed to save haptics settings:', e);
    }
  }
  return updated;
}

/**
 * Execute web vibration fallback if running in browser
 */
function webVibrateFallback(durationMs: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(durationMs);
    } catch {
      // Ignored if browser policy blocks vibration
    }
  }
}

/**
 * Play an impact vibration style respecting user settings
 */
export async function hapticImpact(
  style: ImpactStyle | 'light' | 'medium' | 'heavy' = ImpactStyle.Light,
  force = false
): Promise<void> {
  const config = getHapticsConfig();
  if (!force && !config.enabled) return;

  const resolvedStyle =
    style === 'light'
      ? ImpactStyle.Light
      : style === 'medium'
      ? ImpactStyle.Medium
      : style === 'heavy'
      ? ImpactStyle.Heavy
      : style;

  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.impact({ style: resolvedStyle });
      return;
    } catch {
      // Fall through to web vibration fallback
    }
  }

  // Web fallback durations
  const durations: Record<ImpactStyle, number> = {
    [ImpactStyle.Light]: 15,
    [ImpactStyle.Medium]: 35,
    [ImpactStyle.Heavy]: 60,
  };
  webVibrateFallback(durations[resolvedStyle] || 20);
}

/**
 * Play a notification vibration pattern respecting user settings
 */
export async function hapticNotification(
  type: NotificationType | 'success' | 'warning' | 'error' = NotificationType.Success,
  force = false
): Promise<void> {
  const config = getHapticsConfig();
  if (!force && !config.enabled) return;

  const resolvedType =
    type === 'success'
      ? NotificationType.Success
      : type === 'warning'
      ? NotificationType.Warning
      : type === 'error'
      ? NotificationType.Error
      : type;

  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.notification({ type: resolvedType });
      return;
    } catch {
      // Fall through to web vibration fallback
    }
  }

  // Web fallback patterns
  if (resolvedType === NotificationType.Success) {
    webVibrateFallback([25, 40, 45]);
  } else if (resolvedType === NotificationType.Warning) {
    webVibrateFallback([40, 50, 40]);
  } else {
    webVibrateFallback([60, 40, 60, 40, 60]);
  }
}

/**
 * Selection vibration for list items / tabs / sliders
 */
export async function hapticSelection(force = false): Promise<void> {
  const config = getHapticsConfig();
  if (!force && !config.enabled) return;

  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.selectionStart();
      await Haptics.selectionChanged();
      await Haptics.selectionEnd();
      return;
    } catch {
      // Fall through to web vibration fallback
    }
  }

  webVibrateFallback(10);
}

/**
 * Helper for generic UI button presses
 */
export async function hapticButtonPress(): Promise<void> {
  const config = getHapticsConfig();
  if (!config.enabled || !config.buttonFeedback) return;

  const styleMap: Record<string, ImpactStyle> = {
    light: ImpactStyle.Light,
    medium: ImpactStyle.Medium,
    heavy: ImpactStyle.Heavy,
  };

  await hapticImpact(styleMap[config.intensity] || ImpactStyle.Light);
}

/**
 * Helper specifically designed for Dhikr / Tasbih counters
 * Triggers light pulse on standard counts, medium pulse on rounds of 33/100,
 * and a celebratory success pattern on goal completion.
 */
export async function hapticDhikrCount(currentCount?: number, targetCount?: number): Promise<void> {
  const config = getHapticsConfig();
  if (!config.enabled || !config.dhikrFeedback) return;

  // Target reached celebration
  if (targetCount && currentCount && currentCount >= targetCount && config.targetCelebration) {
    await hapticNotification(NotificationType.Success);
    return;
  }

  // Milestone pulse (every 33, 100, etc.)
  if (currentCount && (currentCount % 33 === 0 || currentCount % 100 === 0)) {
    await hapticImpact(ImpactStyle.Medium);
    return;
  }

  // Standard count pulse based on selected intensity
  const styleMap: Record<string, ImpactStyle> = {
    light: ImpactStyle.Light,
    medium: ImpactStyle.Medium,
    heavy: ImpactStyle.Heavy,
  };

  await hapticImpact(styleMap[config.intensity] || ImpactStyle.Light);
}

/**
 * React Hook for reactive haptics settings state
 */
export function useHaptics() {
  const [config, setConfig] = useState<HapticsConfig>(getHapticsConfig);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<HapticsConfig>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      } else {
        setConfig(getHapticsConfig());
      }
    };

    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateConfig = useCallback((newPartial: Partial<HapticsConfig>) => {
    const updated = saveHapticsConfig(newPartial);
    setConfig(updated);
  }, []);

  const triggerTest = useCallback(async (intensity?: 'light' | 'medium' | 'heavy' | 'success') => {
    if (intensity === 'success') {
      await hapticNotification(NotificationType.Success, true);
    } else {
      const style = intensity === 'heavy' 
        ? ImpactStyle.Heavy 
        : intensity === 'medium' 
        ? ImpactStyle.Medium 
        : ImpactStyle.Light;
      await hapticImpact(style, true);
    }
  }, []);

  return {
    config,
    updateConfig,
    triggerTest,
    hapticButtonPress,
    hapticDhikrCount,
    hapticImpact,
    hapticNotification,
    hapticSelection,
  };
}
