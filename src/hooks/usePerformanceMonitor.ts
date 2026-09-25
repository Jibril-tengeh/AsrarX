import { useState, useEffect, useCallback, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export interface PerformanceLogEntry {
  timestamp: string;
  batteryLevel: number | null;
  isCharging: boolean | null;
  fps: number;
  cpuLoadEstimate: 'low' | 'normal' | 'high';
  highBatteryConsumption: boolean;
  lowResourceModeActive: boolean;
}

const PERF_LOGS_KEY = 'asrarhub_perf_logs';
const PROMPT_DISMISSED_KEY = 'asrarhub_low_resource_prompt_dismissed';

export function usePerformanceMonitor() {
  const {
    batterySaver,
    setBatterySaver,
    lowResourceMode,
    setLowResourceMode,
    autoLowResourceOnBattery,
  } = useSettings();

  const isLowResourceActive = lowResourceMode ?? batterySaver;

  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [isBatteryApiSupported, setIsBatteryApiSupported] = useState(false);
  const [fps, setFps] = useState(60);
  const [isHighConsumptionDetected, setIsHighConsumptionDetected] = useState(false);
  const [showLowResourcePrompt, setShowLowResourcePrompt] = useState(false);

  const initialBatteryLevelRef = useRef<number | null>(null);
  const sessionStartTimeRef = useRef<number>(Date.now());
  const batteryObjRef = useRef<any>(null);

  // Append entry to local performance log (max 25 entries)
  const logPerformanceData = useCallback((entry: Omit<PerformanceLogEntry, 'timestamp'>) => {
    try {
      const stored = localStorage.getItem(PERF_LOGS_KEY);
      const logs: PerformanceLogEntry[] = stored ? JSON.parse(stored) : [];
      const newEntry: PerformanceLogEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
      };
      const updated = [newEntry, ...logs.slice(0, 24)];
      localStorage.setItem(PERF_LOGS_KEY, JSON.stringify(updated));
    } catch (e) {
      // Storage limits or private mode
    }
  }, []);

  // 1. Battery Monitor setup
  useEffect(() => {
    let isMounted = true;

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      setIsBatteryApiSupported(true);
      (navigator as any)
        .getBattery?.()
        .then((battery: any) => {
          if (!isMounted) return;
          batteryObjRef.current = battery;

          const updateBatteryState = () => {
            if (!battery) return;
            const lvl = typeof battery.level === 'number' ? Math.round(battery.level * 100) : null;
            const charging = typeof battery.charging === 'boolean' ? battery.charging : null;

            setBatteryLevel(lvl);
            setIsCharging(charging);

            if (initialBatteryLevelRef.current === null && lvl !== null) {
              initialBatteryLevelRef.current = lvl;
            }

            // High battery consumption detection:
            // Condition A: Battery is low (<= 20%) and discharging
            const isLowAndDischarging = lvl !== null && lvl <= 20 && charging === false;

            // Condition B: Rapid discharge rate (> 5% in less than 15 minutes of usage)
            let isRapidDrain = false;
            if (
              initialBatteryLevelRef.current !== null &&
              lvl !== null &&
              charging === false
            ) {
              const elapsedMinutes = (Date.now() - sessionStartTimeRef.current) / 60000;
              const batteryDelta = initialBatteryLevelRef.current - lvl;
              if (elapsedMinutes >= 5 && batteryDelta >= 3) {
                isRapidDrain = true;
              }
            }

            const highConsumption = isLowAndDischarging || isRapidDrain;
            setIsHighConsumptionDetected(highConsumption);

            if (highConsumption) {
              // Auto-enable if configured or prompt user
              if (autoLowResourceOnBattery && !isLowResourceActive) {
                if (setLowResourceMode) {
                  setLowResourceMode(true);
                } else {
                  setBatterySaver(true);
                }
              } else if (!isLowResourceActive) {
                const dismissed = sessionStorage.getItem(PROMPT_DISMISSED_KEY);
                if (!dismissed) {
                  setShowLowResourcePrompt(true);
                }
              }
            }

            logPerformanceData({
              batteryLevel: lvl,
              isCharging: charging,
              fps,
              cpuLoadEstimate: fps < 30 ? 'high' : fps < 50 ? 'normal' : 'low',
              highBatteryConsumption: highConsumption,
              lowResourceModeActive: isLowResourceActive,
            });
          };

          updateBatteryState();

          battery.addEventListener('levelchange', updateBatteryState);
          battery.addEventListener('chargingchange', updateBatteryState);

          return () => {
            battery.removeEventListener('levelchange', updateBatteryState);
            battery.removeEventListener('chargingchange', updateBatteryState);
          };
        })
        .catch(() => {
          setIsBatteryApiSupported(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [autoLowResourceOnBattery, isLowResourceActive, setLowResourceMode, setBatterySaver, logPerformanceData, fps]);

  // 2. CPU / Frame-rate lightweight sampling
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measureFps = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        const calculatedFps = Math.round((frameCount * 1000) / (now - lastTime));
        setFps(calculatedFps);
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measureFps);
    };

    // Only run sampling briefly or on interval to save CPU
    animId = requestAnimationFrame(measureFps);
    const stopTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
    }, 4000);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(stopTimer);
    };
  }, []);

  const dismissPrompt = useCallback(() => {
    setShowLowResourcePrompt(false);
    try {
      sessionStorage.setItem(PROMPT_DISMISSED_KEY, 'true');
    } catch (e) {}
  }, []);

  const enableLowResourceMode = useCallback(() => {
    if (setLowResourceMode) {
      setLowResourceMode(true);
    } else {
      setBatterySaver(true);
    }
    dismissPrompt();
  }, [setLowResourceMode, setBatterySaver, dismissPrompt]);

  const toggleLowResource = useCallback(() => {
    if (setLowResourceMode) {
      setLowResourceMode(!isLowResourceActive);
    } else {
      setBatterySaver(!isLowResourceActive);
    }
  }, [isLowResourceActive, setLowResourceMode, setBatterySaver]);

  return {
    isLowResourceActive,
    lowResourceMode: isLowResourceActive,
    batteryLevel,
    isCharging,
    isBatteryApiSupported,
    fps,
    isHighConsumptionDetected,
    showLowResourcePrompt,
    dismissPrompt,
    enableLowResourceMode,
    toggleLowResource,
    logPerformanceData,
  };
}
