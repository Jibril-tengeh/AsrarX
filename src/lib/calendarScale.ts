import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { getOfflineData, setOfflineData } from './offlineStorage';

export const CALENDAR_GLOBAL_SCALE_KEY = 'asrarhub_admin_calendar_global_scale';
export const CALENDAR_SUBCARDS_SCALE_KEY = 'asrarhub_admin_calendar_subcards_scale';
export const CALENDAR_SCALE_EVENT = 'asrarhub_calendar_scale_changed';

export interface CalendarScaleData {
  globalScale: number;
  subCardScale: number;
  updatedAt?: number;
}

/**
 * Get current scale synchronously from localStorage or fallback
 */
export function getInitialCalendarScales(): CalendarScaleData {
  let globalScale = 1.0;
  let subCardScale = 1.0;

  try {
    const savedGlobal = localStorage.getItem(CALENDAR_GLOBAL_SCALE_KEY);
    if (savedGlobal) {
      const parsed = parseFloat(savedGlobal);
      if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 2.0) {
        globalScale = parsed;
      }
    }

    const savedSub = localStorage.getItem(CALENDAR_SUBCARDS_SCALE_KEY);
    if (savedSub) {
      const parsed = parseFloat(savedSub);
      if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 2.0) {
        subCardScale = parsed;
      }
    }
  } catch (e) {
    console.warn('[CalendarScale] Error reading initial scale from localStorage:', e);
  }

  return { globalScale, subCardScale };
}

/**
 * Save updated scale parameters to localStorage, IndexedDB, emit window event,
 * and persist permanently to Firestore so it stays intact for ALL users until changed by admin again.
 */
export async function saveCalendarScales(globalScale: number, subCardScale: number) {
  const normalizedGlobal = Math.min(2.0, Math.max(0.5, Math.round(globalScale * 100) / 100));
  const normalizedSub = Math.min(2.0, Math.max(0.5, Math.round(subCardScale * 100) / 100));

  // 1. Save to localStorage immediately
  try {
    localStorage.setItem(CALENDAR_GLOBAL_SCALE_KEY, normalizedGlobal.toString());
    localStorage.setItem(CALENDAR_SUBCARDS_SCALE_KEY, normalizedSub.toString());
  } catch (e) {
    console.warn('[CalendarScale] localStorage write failed:', e);
  }

  // 2. Save to IndexedDB
  try {
    await setOfflineData('asrarhub_calendar_scales', {
      globalScale: normalizedGlobal,
      subCardScale: normalizedSub,
      updatedAt: Date.now()
    });
  } catch (e) {}

  // 3. Dispatch window event for open UI components on the current tab
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CALENDAR_SCALE_EVENT, {
      detail: { globalScale: normalizedGlobal, subCardScale: normalizedSub }
    }));
  }

  // 4. Save to Firestore persistently
  try {
    const payload = {
      globalScale: normalizedGlobal,
      subCardScale: normalizedSub,
      updatedAt: Date.now()
    };

    // Save in settings/calendar_scale
    await setDoc(doc(db, 'settings', 'calendar_scale'), payload, { merge: true });

    // Also merge into settings/features for backward compatibility
    await setDoc(doc(db, 'settings', 'features'), {
      calendarGlobalScale: normalizedGlobal,
      calendarSubCardScale: normalizedSub
    }, { merge: true });

    console.log(`[CalendarScale] Successfully persisted calendar scales to Firestore: Global=${normalizedGlobal}, Sub=${normalizedSub}`);
  } catch (err) {
    console.warn('[CalendarScale] Error saving scale settings to Firestore:', err);
  }
}

/**
 * Subscribe to real-time calendar scale changes from Firestore with local offline fallback.
 */
export function subscribeCalendarScales(callback: (data: CalendarScaleData) => void): () => void {
  // First load from IndexedDB asynchronously if available
  getOfflineData<CalendarScaleData>('asrarhub_calendar_scales').then((cached) => {
    if (cached && typeof cached.globalScale === 'number' && typeof cached.subCardScale === 'number') {
      callback({
        globalScale: cached.globalScale,
        subCardScale: cached.subCardScale
      });
    }
  }).catch(() => {});

  // Listen to window events (local changes in current tab / other tabs)
  const handleLocalEvent = (e: Event) => {
    const custom = e as CustomEvent;
    if (custom.detail && typeof custom.detail.globalScale === 'number') {
      callback({
        globalScale: custom.detail.globalScale,
        subCardScale: custom.detail.subCardScale
      });
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener(CALENDAR_SCALE_EVENT, handleLocalEvent);
  }

  // Real-time Firestore snapshot listener
  const unsubscribeFirestore = onSnapshot(
    doc(db, 'settings', 'calendar_scale'),
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (typeof data.globalScale === 'number' && typeof data.subCardScale === 'number') {
          const globalScale = Math.min(2.0, Math.max(0.5, data.globalScale));
          const subCardScale = Math.min(2.0, Math.max(0.5, data.subCardScale));

          // Update local cache
          try {
            localStorage.setItem(CALENDAR_GLOBAL_SCALE_KEY, globalScale.toString());
            localStorage.setItem(CALENDAR_SUBCARDS_SCALE_KEY, subCardScale.toString());
          } catch (e) {}

          callback({ globalScale, subCardScale, updatedAt: data.updatedAt });
        }
      }
    },
    (error) => {
      console.warn('[CalendarScale] Firestore snapshot error (using offline scales):', error);
    }
  );

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener(CALENDAR_SCALE_EVENT, handleLocalEvent);
    }
    unsubscribeFirestore();
  };
}
