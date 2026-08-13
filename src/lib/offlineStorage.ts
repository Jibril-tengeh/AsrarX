// IndexedDB Persistent Offline Storage for AsrarHub
// Provides unlimited storage for articles, categories, and details without QuotaExceededError.

const DB_NAME = 'AsrarHubOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'app_cache';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.reject(new Error('IndexedDB not supported in this environment'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          console.warn('[OfflineStore] Failed to open IndexedDB:', request.error);
          dbPromise = null;
          reject(request.error);
        };
      } catch (e) {
        dbPromise = null;
        reject(e);
      }
    });
  }

  return dbPromise;
}

/**
 * Saves arbitrary data asynchronously into IndexedDB with an optional localStorage sync.
 */
export async function setOfflineData(key: string, value: any): Promise<void> {
  // Sync synchronously to localStorage if small enough for instant initial renders
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (quotaErr) {
    // Ignore localStorage quota errors, IndexedDB will store the complete payload
  }

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn(`[OfflineStore] setOfflineData error for "${key}":`, e);
  }
}

/**
 * Retrieves data asynchronously from IndexedDB with fallback to localStorage.
 */
export async function getOfflineData<T>(key: string): Promise<T | null> {
  try {
    const db = await getDB();
    const result = await new Promise<T | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error);
    });

    if (result !== undefined && result !== null) {
      return result;
    }
  } catch (e) {
    console.warn(`[OfflineStore] IndexedDB read error for "${key}", falling back to localStorage:`, e);
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Removes data from both IndexedDB and localStorage.
 */
export async function removeOfflineData(key: string): Promise<void> {
  try {
    localStorage.removeItem(key);
  } catch (err) {}

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {}
}
