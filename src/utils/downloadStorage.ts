import { get, set, del } from 'idb-keyval';

export interface DownloadRecord {
  id: string;
  fileName: string;
  dataUrl?: string; // base64 image or file data
  fileType: 'image' | 'video' | 'audio' | 'pdf' | 'other';
  fileSize?: string;
  timestamp: number;
  toolName?: string;
  toolRoute?: string;
  customMessage?: string;
}

const STORAGE_KEY = 'asrar_recent_downloads_list';
const MAX_RECORDS = 40;

/**
 * Save a new downloaded item into IndexedDB / localStorage history
 */
export async function saveRecentDownload(record: DownloadRecord): Promise<void> {
  try {
    let list: DownloadRecord[] = [];
    try {
      const existing = await get(STORAGE_KEY);
      if (Array.isArray(existing)) {
        list = existing;
      }
    } catch (e) {
      console.warn('[DownloadStorage] IndexedDB read error, fallback to memory/localStorage:', e);
    }

    // Filter out duplicates by fileName or id
    list = list.filter((item) => item.id !== record.id && item.fileName !== record.fileName);

    // Prepend latest item
    list.unshift(record);

    // Keep up to MAX_RECORDS
    if (list.length > MAX_RECORDS) {
      list = list.slice(0, MAX_RECORDS);
    }

    await set(STORAGE_KEY, list);

    // Save lightweight metadata in localStorage for instant access
    try {
      const meta = list.map(({ id, fileName, fileType, timestamp, toolName, toolRoute }) => ({
        id,
        fileName,
        fileType,
        timestamp,
        toolName,
        toolRoute,
      }));
      localStorage.setItem('asrar_recent_downloads_meta', JSON.stringify(meta));
      localStorage.setItem('asrar_latest_download_id', record.id);
    } catch (lsErr) {
      // ignore
    }
  } catch (err) {
    console.error('[DownloadStorage] Failed to save recent download:', err);
  }
}

/**
 * Retrieve all recent downloads
 */
export async function getRecentDownloads(): Promise<DownloadRecord[]> {
  try {
    const list = await get(STORAGE_KEY);
    if (Array.isArray(list)) {
      return list;
    }
  } catch (err) {
    console.warn('[DownloadStorage] Error loading downloads:', err);
  }
  return [];
}

/**
 * Retrieve the latest downloaded item
 */
export async function getLatestDownload(): Promise<DownloadRecord | null> {
  try {
    const list = await getRecentDownloads();
    return list.length > 0 ? list[0] : null;
  } catch (err) {
    return null;
  }
}

/**
 * Retrieve a specific download record by ID or fileName
 */
export async function getDownloadById(idOrFileName: string): Promise<DownloadRecord | null> {
  try {
    const list = await getRecentDownloads();
    const found = list.find(
      (item) => item.id === idOrFileName || item.fileName === idOrFileName || item.fileName.includes(idOrFileName)
    );
    return found || null;
  } catch (err) {
    return null;
  }
}

/**
 * Delete a download record
 */
export async function deleteDownloadRecord(id: string): Promise<void> {
  try {
    const list = await getRecentDownloads();
    const updated = list.filter((item) => item.id !== id);
    await set(STORAGE_KEY, updated);
  } catch (err) {
    console.error('[DownloadStorage] Error deleting record:', err);
  }
}

/**
 * Clear all records
 */
export async function clearAllDownloads(): Promise<void> {
  try {
    await del(STORAGE_KEY);
    localStorage.removeItem('asrar_recent_downloads_meta');
    localStorage.removeItem('asrar_latest_download_id');
  } catch (err) {
    console.error('[DownloadStorage] Error clearing records:', err);
  }
}
