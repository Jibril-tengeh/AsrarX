import { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      // In native apps, assume true by default until verified to avoid false offline banners on cold start
      if (Capacitor.isNativePlatform()) {
        return true;
      }
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    let isMounted = true;

    const updateStatus = (connected: boolean) => {
      if (isMounted) {
        setIsOnline(connected);
      }
    };

    // 1. Native Capacitor Detection
    if (Capacitor.isNativePlatform()) {
      Network.getStatus()
        .then(status => {
          updateStatus(status.connected);
        })
        .catch(() => {});

      const listenerPromise = Network.addListener('networkStatusChange', status => {
        updateStatus(status.connected);
      });

      return () => {
        isMounted = false;
        listenerPromise.then(l => l.remove()).catch(() => {});
      };
    }

    // 2. Web / Standard WebView Fallback
    const handleOnline = () => updateStatus(true);
    const handleOffline = () => updateStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // If navigator.onLine is false, do an active probe to avoid false negatives in Android WebView
    if (!navigator.onLine) {
      const probeOnline = async () => {
        try {
          // Simple lightweight probe
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          await fetch('https://www.google.com/favicon.ico', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store',
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          updateStatus(true);
        } catch {
          // If probe fails, maintain current state
        }
      };
      probeOnline();
    }

    return () => {
      isMounted = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const recheckNetwork = async (): Promise<boolean> => {
    try {
      if (Capacitor.isNativePlatform()) {
        const status = await Network.getStatus();
        setIsOnline(status.connected);
        return status.connected;
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      setIsOnline(true);
      return true;
    } catch {
      const fallback = typeof navigator !== 'undefined' ? navigator.onLine : false;
      setIsOnline(fallback);
      return fallback;
    }
  };

  return {
    isOnline,
    isOffline: !isOnline,
    recheckNetwork,
  };
}
