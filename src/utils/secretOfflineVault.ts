// IndexedDB Offline Vault for Secrets / Articles in AsrarHub
// Enables complete offline reading of saved secrets without any internet connection.

export interface OfflineStoredSecret {
  id: string;
  title: string;
  title_fr?: string;
  title_en?: string;
  title_ha?: string;
  content: string;
  content_fr?: string;
  content_en?: string;
  content_ha?: string;
  hook?: string;
  hook_fr?: string;
  hook_en?: string;
  hook_ha?: string;
  verse?: string;
  reference?: string;
  category?: string;
  subCategory?: string;
  isPremium?: boolean;
  audioUrl?: string;
  audio_url?: string;
  imageUrl?: string;
  thumbnail?: string;
  benefits?: string[];
  savedAt: number;
  sizeBytes?: number;
  hasManualTranslation?: boolean;
  [key: string]: any;
}

const DB_NAME = 'asrarhub_secrets_vault';
const DB_VERSION = 1;
const STORE_NAME = 'offline_secrets';
const META_STORAGE_KEY = 'asrar_offline_secrets_meta';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not supported in this environment'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          dbPromise = null;
          reject(request.error || new Error('Failed to open IndexedDB'));
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
 * Helper to update localStorage metadata list for fast synchronous checks
 */
function updateMetaCache(list: { id: string; title: string; category?: string; savedAt: number; isPremium?: boolean }[]) {
  try {
    localStorage.setItem(META_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('asrarhub_offline_secrets_sync', { detail: { list } }));
  } catch (e) {}
}

/**
 * Saves a secret to IndexedDB for complete offline reading.
 */
export async function saveSecretToOfflineVault(secret: any): Promise<boolean> {
  if (!secret || !secret.id) return false;

  try {
    const rawContent = secret.content || secret.content_fr || '';
    const approxSize = new Blob([JSON.stringify(secret)]).size;

    const record: OfflineStoredSecret = {
      id: String(secret.id),
      title: secret.title || secret.title_fr || 'Secret sans titre',
      title_fr: secret.title_fr || secret.title,
      title_en: secret.title_en,
      title_ha: secret.title_ha,
      content: rawContent,
      content_fr: secret.content_fr || secret.content,
      content_en: secret.content_en,
      content_ha: secret.content_ha,
      hook: secret.hook || secret.hook_fr,
      hook_fr: secret.hook_fr || secret.hook,
      hook_en: secret.hook_en,
      hook_ha: secret.hook_ha,
      verse: secret.verse,
      reference: secret.reference,
      category: secret.category || 'recette',
      subCategory: secret.subCategory || '',
      isPremium: !!secret.isPremium,
      audioUrl: secret.audioUrl || secret.audio_url,
      audio_url: secret.audio_url || secret.audioUrl,
      imageUrl: secret.imageUrl || secret.thumbnail,
      thumbnail: secret.thumbnail || secret.imageUrl,
      benefits: Array.isArray(secret.benefits) ? secret.benefits : [],
      hasManualTranslation: !!secret.hasManualTranslation,
      savedAt: Date.now(),
      sizeBytes: approxSize,
    };

    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    // Update fast metadata
    try {
      const existingMeta: any[] = JSON.parse(localStorage.getItem(META_STORAGE_KEY) || '[]');
      const filtered = existingMeta.filter((m) => m.id !== record.id);
      filtered.unshift({
        id: record.id,
        title: record.title,
        category: record.category,
        savedAt: record.savedAt,
        isPremium: record.isPremium,
        sizeBytes: approxSize,
      });
      updateMetaCache(filtered);
    } catch (e) {}

    return true;
  } catch (error) {
    console.error('[SecretOfflineVault] Error saving secret offline:', error);
    return false;
  }
}

/**
 * Retrieves a single secret from the IndexedDB offline vault.
 */
export async function getSecretFromOfflineVault(id: string): Promise<OfflineStoredSecret | null> {
  if (!id) return null;

  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(String(id));

      req.onsuccess = () => {
        resolve(req.result || null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn('[SecretOfflineVault] Error reading offline secret:', error);
    return null;
  }
}

/**
 * Checks whether a secret is currently saved in the offline vault.
 */
export async function isSecretSavedOffline(id: string): Promise<boolean> {
  if (!id) return false;

  // First fast check via localStorage meta
  try {
    const existingMeta: any[] = JSON.parse(localStorage.getItem(META_STORAGE_KEY) || '[]');
    if (Array.isArray(existingMeta) && existingMeta.some((m) => m.id === String(id))) {
      return true;
    }
  } catch (e) {}

  // Fallback to IndexedDB verification
  try {
    const item = await getSecretFromOfflineVault(id);
    return !!item;
  } catch (e) {
    return false;
  }
}

/**
 * Removes a secret from the offline vault.
 */
export async function removeSecretFromOfflineVault(id: string): Promise<boolean> {
  if (!id) return false;

  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(String(id));
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    // Update fast metadata
    try {
      const existingMeta: any[] = JSON.parse(localStorage.getItem(META_STORAGE_KEY) || '[]');
      const filtered = existingMeta.filter((m) => m.id !== String(id));
      updateMetaCache(filtered);
    } catch (e) {}

    return true;
  } catch (error) {
    console.error('[SecretOfflineVault] Error removing offline secret:', error);
    return false;
  }
}

/**
 * Returns all secrets saved in the IndexedDB offline vault.
 */
export async function getAllOfflineSecrets(): Promise<OfflineStoredSecret[]> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const list: OfflineStoredSecret[] = req.result || [];
        // Sort descending by savedAt
        list.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));

        // Sync metadata cache
        const meta = list.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          savedAt: item.savedAt,
          isPremium: item.isPremium,
          sizeBytes: item.sizeBytes,
        }));
        try {
          localStorage.setItem(META_STORAGE_KEY, JSON.stringify(meta));
        } catch (e) {}

        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn('[SecretOfflineVault] Error getting all offline secrets:', error);
    return [];
  }
}

/**
 * Clear all secrets saved in the offline vault.
 */
export async function clearAllOfflineSecrets(): Promise<boolean> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    updateMetaCache([]);
    return true;
  } catch (error) {
    console.error('[SecretOfflineVault] Error clearing offline vault:', error);
    return false;
  }
}
