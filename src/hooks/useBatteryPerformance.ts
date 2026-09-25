import { useState, useEffect, useCallback, useRef } from 'react';

export interface BatteryLogEntry {
  id: string;
  timestamp: number;
  batteryLevel: number; // 0 to 100
  isCharging: boolean;
  drainRatePerHour: number | null; // estimated % drop per hour
  cpuLoadEstimate: 'low' | 'moderate' | 'high';
  longTasksCount: number;
  isLowResourceMode: boolean;
  eventType: 'periodic_check' | 'drain_spike' | 'low_battery' | 'mode_toggled' | 'charging_change' | 'high_drain_detected';
  notes?: string;
}

const STORAGE_KEY_LOGS = 'asrarhub_battery_perf_logs';
const STORAGE_KEY_LOW_RES = 'asrar_battery_saver';
const MAX_LOG_ENTRIES = 60; // Keep recent history (e.g. last 60 records)

// Drain rate threshold to consider "high consumption" (% per hour)
const HIGH_DRAIN_THRESHOLD_PERCENT_PER_HOUR = 18; 
// Battery level under which discharging triggers warning
const LOW_BATTERY_THRESHOLD = 20;

export function getLocalBatteryLogs(): BatteryLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('[BatteryPerformance] Failed to load battery logs:', e);
    return [];
  }
}

export function saveLocalBatteryLog(entry: Omit<BatteryLogEntry, 'id'>): BatteryLogEntry[] {
  try {
    const current = getLocalBatteryLogs();
    const newEntry: BatteryLogEntry = {
      ...entry,
      id: `bat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const updated = [newEntry, ...current].slice(0, MAX_LOG_ENTRIES);
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('[BatteryPerformance] Failed to save battery log:', e);
    return [];
  }
}

export function clearLocalBatteryLogs(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_LOGS);
  } catch (e) {}
}

export function useBatteryPerformance() {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null); // 0 - 100
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [drainRatePerHour, setDrainRatePerHour] = useState<number | null>(null);
  const [cpuLoadEstimate, setCpuLoadEstimate] = useState<'low' | 'moderate' | 'high'>('low');
  const [longTasksCount, setLongTasksCount] = useState<number>(0);
  const [highDrainDetected, setHighDrainDetected] = useState<boolean>(false);
  const [logs, setLogs] = useState<BatteryLogEntry[]>(() => getLocalBatteryLogs());

  // Low Resource Mode state (synced with localStorage & DOM)
  const [isLowResourceMode, setIsLowResourceModeState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LOW_RES);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  // Track previous readings for drain calculation
  const lastSampleRef = useRef<{ level: number; time: number } | null>(null);
  const longTaskObserverRef = useRef<PerformanceObserver | null>(null);
  const longTasksWindowRef = useRef<number>(0);

  // Apply Low Resource Mode to DOM
  const applyLowResourceModeDOM = useCallback((enabled: boolean) => {
    if (typeof document === 'undefined') return;
    try {
      const root = document.documentElement;
      root.classList.toggle('battery-saver', enabled);
      root.classList.toggle('low-resource-mode', enabled);
      root.classList.toggle('reduce-motion', enabled);

      if (enabled) {
        root.style.setProperty('--app-animation-duration-multiplier', '0.001');
      } else {
        root.style.removeProperty('--app-animation-duration-multiplier');
      }
    } catch (e) {
      console.warn('[BatteryPerformance] DOM update failed:', e);
    }
  }, []);

  const setLowResourceMode = useCallback((enabled: boolean) => {
    setIsLowResourceModeState(enabled);
    try {
      localStorage.setItem(STORAGE_KEY_LOW_RES, String(enabled));
    } catch {}
    applyLowResourceModeDOM(enabled);

    // Record log
    const updated = saveLocalBatteryLog({
      timestamp: Date.now(),
      batteryLevel: batteryLevel ?? 100,
      isCharging: isCharging ?? false,
      drainRatePerHour: drainRatePerHour,
      cpuLoadEstimate,
      longTasksCount: longTasksWindowRef.current,
      isLowResourceMode: enabled,
      eventType: 'mode_toggled',
      notes: enabled ? 'Mode Basse Consommation activé par l\'utilisateur' : 'Mode Basse Consommation désactivé',
    });
    setLogs(updated);

    if (enabled) {
      setHighDrainDetected(false);
    }

    try {
      window.dispatchEvent(new CustomEvent('asrar_battery_saver_changed', { detail: { enabled } }));
    } catch {}
  }, [applyLowResourceModeDOM, batteryLevel, isCharging, drainRatePerHour, cpuLoadEstimate]);

  const toggleLowResourceMode = useCallback(() => {
    setLowResourceMode(!isLowResourceMode);
  }, [isLowResourceMode, setLowResourceMode]);

  const dismissHighDrainAlert = useCallback(() => {
    setHighDrainDetected(false);
  }, []);

  const clearBatteryLogs = useCallback(() => {
    clearLocalBatteryLogs();
    setLogs([]);
  }, []);

  // Performance Observer for Long Tasks (detects UI freezes or CPU hogging)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          longTasksWindowRef.current += entries.length;
          setLongTasksCount(longTasksWindowRef.current);

          if (longTasksWindowRef.current > 8) {
            setCpuLoadEstimate('high');
          } else if (longTasksWindowRef.current > 3) {
            setCpuLoadEstimate('moderate');
          } else {
            setCpuLoadEstimate('low');
          }
        });

        observer.observe({ entryTypes: ['longtask'] });
        longTaskObserverRef.current = observer;
      } catch {
        // 'longtask' observation not supported in this browser
      }
    }

    return () => {
      if (longTaskObserverRef.current) {
        longTaskObserverRef.current.disconnect();
      }
    };
  }, []);

  // Monitor Battery API
  useEffect(() => {
    applyLowResourceModeDOM(isLowResourceMode);

    let batteryInstance: any = null;
    let isCancelled = false;

    const processBatteryStatus = (battery: any) => {
      if (isCancelled || !battery) return;

      const currentLevelPercent = Math.round(battery.level * 100);
      const charging = Boolean(battery.charging);

      setBatteryLevel(currentLevelPercent);
      setIsCharging(charging);
      setIsSupported(true);

      const now = Date.now();
      let calculatedDrainPerHour: number | null = null;

      // Calculate drain rate if not charging
      if (!charging && lastSampleRef.current) {
        const timeDiffHours = (now - lastSampleRef.current.time) / (1000 * 60 * 60);
        const levelDiff = lastSampleRef.current.level - currentLevelPercent;

        if (timeDiffHours > 0.01 && levelDiff > 0) {
          calculatedDrainPerHour = Math.round((levelDiff / timeDiffHours) * 10) / 10;
          setDrainRatePerHour(calculatedDrainPerHour);
        }
      }

      lastSampleRef.current = { level: currentLevelPercent, time: now };

      // Determine if high drain or low battery
      const isHighDrain = calculatedDrainPerHour !== null && calculatedDrainPerHour >= HIGH_DRAIN_THRESHOLD_PERCENT_PER_HOUR;
      const isLowBat = !charging && currentLevelPercent <= LOW_BATTERY_THRESHOLD;
      const isHighCpuOnBattery = !charging && longTasksWindowRef.current >= 6;

      if ((isHighDrain || isLowBat || isHighCpuOnBattery) && !isLowResourceMode) {
        setHighDrainDetected(true);
        // Log high drain detection
        const updated = saveLocalBatteryLog({
          timestamp: now,
          batteryLevel: currentLevelPercent,
          isCharging: charging,
          drainRatePerHour: calculatedDrainPerHour,
          cpuLoadEstimate: longTasksWindowRef.current >= 6 ? 'high' : 'moderate',
          longTasksCount: longTasksWindowRef.current,
          isLowResourceMode: false,
          eventType: 'high_drain_detected',
          notes: isLowBat 
            ? `Batterie faible (${currentLevelPercent}%) en décharge` 
            : isHighDrain 
            ? `Décharge rapide détectée (~${calculatedDrainPerHour}%/h)` 
            : 'Forte charge CPU détectée sur batterie',
        });
        setLogs(updated);
      }
    };

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        if (isCancelled) return;
        batteryInstance = battery;
        processBatteryStatus(battery);

        const onLevelChange = () => processBatteryStatus(battery);
        const onChargingChange = () => {
          processBatteryStatus(battery);
          lastSampleRef.current = null; // reset sample baseline on charging switch
        };

        battery.addEventListener('levelchange', onLevelChange);
        battery.addEventListener('chargingchange', onChargingChange);

        return () => {
          battery.removeEventListener('levelchange', onLevelChange);
          battery.removeEventListener('chargingchange', onChargingChange);
        };
      }).catch((e: any) => {
        console.warn('[BatteryPerformance] Battery API inaccessible:', e);
      });
    } else {
      // Fallback for browsers without Battery API:
      // We still monitor CPU long tasks and allow Low Resource Mode toggling
      setIsSupported(false);
    }

    // Periodic check / log every 60 seconds
    const interval = setInterval(() => {
      if (batteryInstance) {
        processBatteryStatus(batteryInstance);
      } else {
        // Fallback periodic checkpoint
        const now = Date.now();
        if (longTasksWindowRef.current >= 10 && !isLowResourceMode) {
          setHighDrainDetected(true);
        }
      }
    }, 60000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [applyLowResourceModeDOM, isLowResourceMode]);

  // Debug / Test helper: simulate high drain to demonstrate prompt
  const simulateHighDrainTest = useCallback(() => {
    setHighDrainDetected(true);
    setDrainRatePerHour(24.5);
    const updated = saveLocalBatteryLog({
      timestamp: Date.now(),
      batteryLevel: batteryLevel ?? 19,
      isCharging: false,
      drainRatePerHour: 24.5,
      cpuLoadEstimate: 'high',
      longTasksCount: 12,
      isLowResourceMode: false,
      eventType: 'high_drain_detected',
      notes: 'Simulation manuelle: Décharge rapide détectée (24.5%/h)',
    });
    setLogs(updated);
  }, [batteryLevel]);

  return {
    batteryLevel,
    isCharging,
    isSupported,
    isLowResourceMode,
    highDrainDetected,
    drainRatePerHour,
    cpuLoadEstimate,
    longTasksCount,
    batteryLogs: logs,
    setLowResourceMode,
    toggleLowResourceMode,
    dismissHighDrainAlert,
    clearBatteryLogs,
    simulateHighDrainTest,
  };
}
