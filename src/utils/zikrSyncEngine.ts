import { get, set, del } from 'idb-keyval';
import { db, auth } from '../lib/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

export interface ZikrSyncQueueItem {
  id: string;
  type: 'SET' | 'DELETE';
  collection: string;
  docId: string;
  data?: any;
  timestamp: number;
  retryCount: number;
}

const QUEUE_KEY = 'asrar_zikr_pending_sync_queue';

/**
 * Reads from idb-keyval with a fallback to localStorage for synchronous initial state or legacy data.
 */
export async function getZikrCache<T>(key: string, fallbackValue: T): Promise<T> {
  try {
    const val = await get<T>(key);
    if (val !== undefined && val !== null) {
      return val;
    }
    // Check localStorage fallback
    const local = localStorage.getItem(key);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        // Sync to idb-keyval asynchronously
        set(key, parsed).catch(() => {});
        return parsed as T;
      } catch (_) {
        return local as unknown as T;
      }
    }
  } catch (err) {
    console.warn(`[ZikrCache] Error fetching key "${key}" from idb-keyval:`, err);
  }
  return fallbackValue;
}

/**
 * Saves data into idb-keyval (and updates localStorage for immediate sync compatibility).
 */
export async function setZikrCache<T>(key: string, data: T): Promise<void> {
  try {
    await set(key, data);
    try {
      localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
    } catch (_) {}
    window.dispatchEvent(new CustomEvent('zikr_cache_updated', { detail: { key, data } }));
  } catch (err) {
    console.error(`[ZikrCache] Error setting key "${key}" in idb-keyval:`, err);
  }
}

/**
 * Removes data from idb-keyval and localStorage.
 */
export async function removeZikrCache(key: string): Promise<void> {
  try {
    await del(key);
    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent('zikr_cache_updated', { detail: { key, data: null } }));
  } catch (err) {
    console.error(`[ZikrCache] Error removing key "${key}":`, err);
  }
}

/**
 * Queue an operation for asynchronous background Firestore sync.
 */
export async function queueZikrSyncAction(action: Omit<ZikrSyncQueueItem, 'timestamp' | 'retryCount'>): Promise<void> {
  try {
    const queue = (await get<ZikrSyncQueueItem[]>(QUEUE_KEY)) || [];
    const newItem: ZikrSyncQueueItem = {
      ...action,
      timestamp: Date.now(),
      retryCount: 0
    };

    // Remove any duplicate pending action for the exact same collection and docId
    const filtered = queue.filter(item => !(item.collection === action.collection && item.docId === action.docId));
    const updated = [...filtered, newItem];

    await set(QUEUE_KEY, updated);
    window.dispatchEvent(new Event('zikr_sync_queue_updated'));

    // Attempt processing immediately if online
    if (navigator.onLine) {
      processZikrSyncQueue();
    }
  } catch (err) {
    console.error('[ZikrCache] Error queueing sync action:', err);
  }
}

/**
 * Flushes all pending actions in the IndexedDB sync queue to Firestore asynchronously.
 */
export async function processZikrSyncQueue(): Promise<{ synced: number; remaining: number }> {
  if (!navigator.onLine) {
    return { synced: 0, remaining: 0 };
  }

  const currentUser = auth.currentUser;
  if (!currentUser) {
    return { synced: 0, remaining: 0 };
  }

  let queue: ZikrSyncQueueItem[] = [];
  try {
    queue = (await get<ZikrSyncQueueItem[]>(QUEUE_KEY)) || [];
  } catch (e) {
    return { synced: 0, remaining: 0 };
  }

  if (queue.length === 0) {
    return { synced: 0, remaining: 0 };
  }

  const remainingQueue: ZikrSyncQueueItem[] = [];
  let syncedCount = 0;

  for (const item of queue) {
    try {
      if (item.type === 'SET') {
        const payload = {
          ...item.data,
          userId: currentUser.uid,
          syncedAt: new Date().toISOString()
        };
        await setDoc(doc(db, item.collection, item.docId), payload, { merge: true });
        syncedCount++;
      } else if (item.type === 'DELETE') {
        await deleteDoc(doc(db, item.collection, item.docId));
        syncedCount++;
      }
    } catch (err) {
      console.warn(`[ZikrCache] Sync failed for ${item.collection}/${item.docId}, will retry later:`, err);
      if (item.retryCount < 5) {
        remainingQueue.push({
          ...item,
          retryCount: item.retryCount + 1
        });
      }
    }
  }

  try {
    await set(QUEUE_KEY, remainingQueue);
    window.dispatchEvent(new Event('zikr_sync_queue_updated'));
    if (syncedCount > 0) {
      window.dispatchEvent(new CustomEvent('zikr_sync_completed', { detail: { syncedCount } }));
    }
  } catch (e) {}

  return { synced: syncedCount, remaining: remainingQueue.length };
}

// Automatically bind network reconnection events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[ZikrSyncEngine] Network reconnected! Flushing pending Zikr queue...');
    processZikrSyncQueue();
  });

  // Periodic background check every 30 seconds if online
  setInterval(() => {
    if (navigator.onLine && auth.currentUser) {
      processZikrSyncQueue();
    }
  }, 30000);
}

/**
 * Helper to sync a Dhikr Goal asynchronously
 */
export async function syncDhikrGoalOffline(goalId: string, goalData: any, isDelete = false): Promise<void> {
  const currentGoals = await getZikrCache<any[]>('asrar_dhikr_tracker', []);
  let updatedGoals: any[] = [];

  if (isDelete) {
    updatedGoals = currentGoals.filter(g => g.id !== goalId);
  } else {
    const exists = currentGoals.some(g => g.id === goalId);
    if (exists) {
      updatedGoals = currentGoals.map(g => g.id === goalId ? { ...g, ...goalData } : g);
    } else {
      updatedGoals = [...currentGoals, { id: goalId, ...goalData }];
    }
  }

  await setZikrCache('asrar_dhikr_tracker', updatedGoals);

  const currentUser = auth.currentUser;
  if (currentUser) {
    await queueZikrSyncAction({
      id: `goal_${goalId}`,
      type: isDelete ? 'DELETE' : 'SET',
      collection: 'dhikr_goals',
      docId: goalId,
      data: isDelete ? undefined : goalData
    });
  }
}

/**
 * Helper to sync a Tasbih Session asynchronously
 */
export async function syncTasbihSessionOffline(session: any, lifetime: number, daily: number): Promise<void> {
  const history = await getZikrCache<any[]>('tasbih_history', []);
  const updatedHistory = [session, ...history.filter(s => s.id !== session.id)].slice(0, 100);

  await setZikrCache('tasbih_history', updatedHistory);
  await setZikrCache('tasbih_lifetime_total', lifetime);
  await setZikrCache(`tasbih_daily_${new Date().toDateString()}`, daily);

  const currentUser = auth.currentUser;
  if (currentUser) {
    await queueZikrSyncAction({
      id: `tasbih_${session.id}`,
      type: 'SET',
      collection: 'tasbih_sessions',
      docId: session.id,
      data: {
        ...session,
        lifetime,
        daily
      }
    });
  }
}

/**
 * Helper to sync Murid Journal entries asynchronously
 */
export async function syncMuridJournalOffline(entries: any[]): Promise<void> {
  await setZikrCache('asrarhub_murid_entries', entries);

  const currentUser = auth.currentUser;
  if (currentUser) {
    await queueZikrSyncAction({
      id: `murid_journal_${currentUser.uid}`,
      type: 'SET',
      collection: 'murid_journals',
      docId: currentUser.uid,
      data: {
        entries,
        lastUpdated: new Date().toISOString()
      }
    });
  }
}

/**
 * Helper to sync Personal Wirds asynchronously
 */
export async function syncPersonalWirdsOffline(wirds: any[]): Promise<void> {
  await setZikrCache('asrar_saved_wirds', wirds);

  const currentUser = auth.currentUser;
  if (currentUser) {
    await queueZikrSyncAction({
      id: `personal_wirds_${currentUser.uid}`,
      type: 'SET',
      collection: 'user_wirds',
      docId: currentUser.uid,
      data: {
        wirds,
        lastUpdated: new Date().toISOString()
      }
    });
  }
}
