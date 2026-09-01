// IndexedDB Offline Vault for Spiritual Tools in AsrarHub
// Enables complete offline caching and instant offline access to AsrarHub tools.

import { tools as allToolsList } from '../data/tools';

export interface OfflineStoredTool {
  id: string;
  title: string;
  title_fr?: string;
  title_en?: string;
  title_ha?: string;
  description: string;
  description_fr?: string;
  description_en?: string;
  description_ha?: string;
  path: string;
  iconName?: string;
  color?: string;
  level?: 'simple' | 'advanced';
  isOfflineReady: boolean;
  savedAt: number;
  sizeBytes?: number;
  notes?: string;
}

const DB_NAME = 'asrarhub_tools_vault';
const DB_VERSION = 1;
const STORE_NAME = 'offline_tools';
const TOOLS_META_KEY = 'asrar_offline_tools_meta';

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
          reject(request.error || new Error('Failed to open IndexedDB tools vault'));
        };
      } catch (e) {
        dbPromise = null;
        reject(e);
      }
    });
  }

  return dbPromise;
}

function updateToolsMetaCache(list: { id: string; title: string; path: string; savedAt: number }[]) {
  try {
    localStorage.setItem(TOOLS_META_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('asrarhub_offline_content_sync', { detail: { type: 'tools', list } }));
  } catch (e) {}
}

/**
 * Complete list of all offline-capable spiritual tools in AsrarHub dynamically built from data/tools
 */
export const DEFAULT_OFFLINE_TOOLS: OfflineStoredTool[] = allToolsList.map((tool) => ({
  id: tool.id,
  title: tool.title,
  title_fr: tool.title,
  title_en: tool.title,
  title_ha: tool.title,
  description: tool.description,
  description_fr: tool.description,
  description_en: tool.description,
  description_ha: tool.description,
  path: tool.path,
  iconName: typeof tool.icon === 'function' ? tool.icon.name || 'Sparkles' : 'Sparkles',
  color: tool.color,
  level: tool.level,
  isOfflineReady: true,
  savedAt: Date.now(),
  sizeBytes: 25000,
}));

/**
 * Initializes all offline tools into IndexedDB if empty or if new tools are available
 */
export async function ensureDefaultOfflineTools(): Promise<OfflineStoredTool[]> {
  try {
    const list = await getAllOfflineTools();
    if (list.length < DEFAULT_OFFLINE_TOOLS.length) {
      for (const tool of DEFAULT_OFFLINE_TOOLS) {
        await saveToolToOfflineVault(tool);
      }
      return await getAllOfflineTools();
    }
    return list;
  } catch (e) {
    console.warn('[ToolsOfflineVault] Error ensuring default tools:', e);
    return DEFAULT_OFFLINE_TOOLS;
  }
}

/**
 * Saves or updates a tool in the IndexedDB offline vault
 */
export async function saveToolToOfflineVault(tool: Partial<OfflineStoredTool> & { id: string; title: string; path: string }): Promise<boolean> {
  if (!tool || !tool.id) return false;

  try {
    const approxSize = new Blob([JSON.stringify(tool)]).size;
    const record: OfflineStoredTool = {
      id: String(tool.id),
      title: tool.title,
      title_fr: tool.title_fr || tool.title,
      title_en: tool.title_en,
      title_ha: tool.title_ha,
      description: tool.description || '',
      description_fr: tool.description_fr || tool.description,
      description_en: tool.description_en,
      description_ha: tool.description_ha,
      path: tool.path,
      iconName: tool.iconName || 'Sparkles',
      color: tool.color || 'from-emerald-600 to-teal-800',
      level: tool.level || 'simple',
      isOfflineReady: true,
      savedAt: Date.now(),
      sizeBytes: approxSize,
      notes: tool.notes || '',
    };

    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    const all = await getAllOfflineTools();
    const meta = all.map(t => ({ id: t.id, title: t.title, path: t.path, savedAt: t.savedAt }));
    updateToolsMetaCache(meta);

    return true;
  } catch (error) {
    console.error('[ToolsOfflineVault] Error saving tool offline:', error);
    return false;
  }
}

/**
 * Gets all saved tools from IndexedDB
 */
export async function getAllOfflineTools(): Promise<OfflineStoredTool[]> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const list: OfflineStoredTool[] = req.result || [];
        list.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn('[ToolsOfflineVault] Error getting offline tools:', error);
    return [];
  }
}

/**
 * Removes a tool from the IndexedDB offline vault
 */
export async function removeToolFromOfflineVault(id: string): Promise<boolean> {
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

    const all = await getAllOfflineTools();
    const meta = all.map(t => ({ id: t.id, title: t.title, path: t.path, savedAt: t.savedAt }));
    updateToolsMetaCache(meta);

    return true;
  } catch (error) {
    console.error('[ToolsOfflineVault] Error removing tool offline:', error);
    return false;
  }
}

/**
 * Checks if a specific tool is saved in the offline vault
 */
export async function isToolSavedOffline(id: string): Promise<boolean> {
  if (!id) return false;
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(String(id));
      req.onsuccess = () => resolve(!!req.result);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return false;
  }
}

/**
 * Clears all tools from IndexedDB
 */
export async function clearAllOfflineTools(): Promise<boolean> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    updateToolsMetaCache([]);
    return true;
  } catch (error) {
    console.error('[ToolsOfflineVault] Error clearing offline tools:', error);
    return false;
  }
}

/**
 * Formats bytes into clean human readable string (Ko, Mo)
 */
export function formatStorageBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 Ko';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
}

export interface ToolIntegrityItem {
  id: string;
  title: string;
  category?: string;
  level?: string;
  path: string;
  isInstalled: boolean;
  isOutdated: boolean;
  sizeBytes: number;
  savedAt?: number;
}

export interface ToolsIntegrityReport {
  totalRegistered: number;
  totalInstalled: number;
  totalMissing: number;
  totalOutdated: number;
  isHealthy: boolean;
  healthPercentage: number;
  items: ToolIntegrityItem[];
  missingIds: string[];
  outdatedIds: string[];
  checkedAt: number;
}

/**
 * Checks the complete integrity of all registered tools against local offline vault
 */
export async function checkToolsIntegrity(): Promise<ToolsIntegrityReport> {
  const registered = DEFAULT_OFFLINE_TOOLS;
  const installed = await getAllOfflineTools();
  const installedMap = new Map<string, OfflineStoredTool>();
  
  installed.forEach(t => {
    installedMap.set(t.id, t);
  });

  const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const missingIds: string[] = [];
  const outdatedIds: string[] = [];

  const items: ToolIntegrityItem[] = registered.map(reg => {
    const local = installedMap.get(reg.id);
    const isInstalled = !!local;
    const isOutdated = local ? (!local.savedAt || local.savedAt < oneMonthAgo) : false;

    if (!isInstalled) {
      missingIds.push(reg.id);
    } else if (isOutdated) {
      outdatedIds.push(reg.id);
    }

    return {
      id: reg.id,
      title: reg.title,
      level: reg.level,
      path: reg.path,
      isInstalled,
      isOutdated,
      sizeBytes: local?.sizeBytes || reg.sizeBytes || 25000,
      savedAt: local?.savedAt,
    };
  });

  const totalRegistered = registered.length;
  const totalInstalled = installed.length;
  const totalMissing = missingIds.length;
  const totalOutdated = outdatedIds.length;
  const healthPercentage = totalRegistered > 0 ? Math.round((Math.min(totalInstalled, totalRegistered) / totalRegistered) * 100) : 100;
  const isHealthy = totalMissing === 0;

  return {
    totalRegistered,
    totalInstalled,
    totalMissing,
    totalOutdated,
    isHealthy,
    healthPercentage,
    items,
    missingIds,
    outdatedIds,
    checkedAt: Date.now(),
  };
}

/**
 * Repairs and installs all missing tools in one bulk operation
 */
export async function repairMissingTools(
  onProgress?: (current: number, total: number, toolTitle: string) => void
): Promise<{ success: boolean; repairedCount: number }> {
  try {
    const report = await checkToolsIntegrity();
    if (report.isHealthy && report.missingIds.length === 0) {
      return { success: true, repairedCount: 0 };
    }

    const missingDefs = DEFAULT_OFFLINE_TOOLS.filter(t => report.missingIds.includes(t.id));
    let count = 0;

    for (let i = 0; i < missingDefs.length; i++) {
      const tool = missingDefs[i];
      if (onProgress) {
        onProgress(i + 1, missingDefs.length, tool.title);
      }
      await saveToolToOfflineVault(tool);
      count++;
    }

    return { success: true, repairedCount: count };
  } catch (error) {
    console.error('[ToolsOfflineVault] Error repairing missing tools:', error);
    return { success: false, repairedCount: 0 };
  }
}

/**
 * Downloads or updates a specified list of tool IDs into the offline vault
 */
export async function downloadBulkTools(
  toolIds: string[],
  onProgress?: (current: number, total: number, toolTitle: string) => void
): Promise<number> {
  if (!toolIds || toolIds.length === 0) return 0;
  const targetTools = DEFAULT_OFFLINE_TOOLS.filter(t => toolIds.includes(t.id));
  let count = 0;

  for (let i = 0; i < targetTools.length; i++) {
    const tool = targetTools[i];
    if (onProgress) {
      onProgress(i + 1, targetTools.length, tool.title);
    }
    await saveToolToOfflineVault({
      ...tool,
      savedAt: Date.now(),
    });
    count++;
  }

  return count;
}

