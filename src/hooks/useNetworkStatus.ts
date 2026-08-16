import { useState, useEffect, useCallback } from 'react';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';

/**
 * Perform a fast active ping test to verify actual HTTP connectivity.
 * Works even when navigator.onLine or Capacitor Network falsely report offline on mobile data.
 */
async function probeHttpConnectivity(): Promise<boolean> {
  const probes = [
    'https://www.google.com/generate_204',
    'https://firestore.googleapis.com',
    'https://www.gstatic.com/generate_204'
  ];

  for (const url of probes) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return true;
    } catch {
      // Continue to next probe candidate
    }
  }
  return false;
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const performCheck = useCallback(async (): Promise<boolean> => {
    // 1. Check Capacitor Network plugin first if on native platform
    let capacitorConnected = true;
    if (Capacitor.isNativePlatform()) {
      try {
        const status = await Network.getStatus();
        capacitorConnected = status.connected;
      } catch (e) {
        capacitorConnected = true;
      }
    }

    // 2. If Capacitor says connected or navigator says online, verify with HTTP probe if needed
    if (capacitorConnected && (typeof navigator === 'undefined' || navigator.onLine)) {
      setIsOnline(true);
      return true;
    }

    // 3. If either reported false, do an active HTTP probe because Android WebView often gives false negatives
    const actuallyReachable = await probeHttpConnectivity();
    setIsOnline(actuallyReachable);
    return actuallyReachable;
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Run initial connectivity check on startup
    performCheck().then((connected) => {
      if (isMounted) setIsOnline(connected);
    });

    // 1. Native Capacitor listener
    let removeCapacitorListener: (() => void) | null = null;
    if (Capacitor.isNativePlatform()) {
      Network.addListener('networkStatusChange', async (status) => {
        if (!isMounted) return;
        if (status.connected) {
          setIsOnline(true);
        } else {
          // Verify with active probe before declaring offline
          const reachable = await probeHttpConnectivity();
          if (isMounted) setIsOnline(reachable);
        }
      }).then(handle => {
        removeCapacitorListener = () => handle.remove();
      }).catch(() => {});
    }

    // 2. Standard Web & WebView events
    const handleOnline = () => {
      if (isMounted) setIsOnline(true);
    };

    const handleOffline = async () => {
      // Double-check with active HTTP probe to avoid false negatives in WebView
      const reachable = await probeHttpConnectivity();
      if (isMounted) setIsOnline(reachable);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic safety check every 30s when app is active to automatically restore connection state
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        performCheck();
      }
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        performCheck();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
      if (removeCapacitorListener) {
        removeCapacitorListener();
      }
    };
  }, [performCheck]);

  const recheckNetwork = async (): Promise<boolean> => {
    return await performCheck();
  };

  return {
    isOnline,
    isOffline: !isOnline,
    recheckNetwork,
  };
}
