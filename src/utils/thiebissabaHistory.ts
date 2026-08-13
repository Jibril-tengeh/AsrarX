export interface ThiebissabaHistoryEntry {
  id: string;
  timestamp: string;
  intention: string;
  dotsRow1: number;
  dotsRow2: number;
  dotsRow3: number;
  parity1: number;
  parity2: number;
  parity3: number;
  figureCode: string;
  figureName: string;
  figureSymbol: string;
  element: string;
  kadyoVal?: number;
  kadyoVerdict?: string;
  sarakaPrescription?: string;
}

const STORAGE_KEY = 'asrar_thiebissaba_history';

export function getThiebissabaHistory(): ThiebissabaHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Error reading Thiebissaba history:', err);
    return [];
  }
}

export function saveThiebissabaHistoryEntry(entry: Omit<ThiebissabaHistoryEntry, 'id' | 'timestamp'>): ThiebissabaHistoryEntry[] {
  try {
    const current = getThiebissabaHistory();
    const newEntry: ThiebissabaHistoryEntry = {
      ...entry,
      id: 'thieb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
    };

    // Filter out potential duplicates based on exact dots & intention
    const filtered = current.filter(
      (item) =>
        !(
          item.dotsRow1 === entry.dotsRow1 &&
          item.dotsRow2 === entry.dotsRow2 &&
          item.dotsRow3 === entry.dotsRow3 &&
          item.intention === entry.intention
        )
    );

    // Keep last 10 entries
    const updated = [newEntry, ...filtered].slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving Thiebissaba history entry:', err);
    return [];
  }
}

export function deleteThiebissabaHistoryEntry(id: string): ThiebissabaHistoryEntry[] {
  try {
    const current = getThiebissabaHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting Thiebissaba history entry:', err);
    return [];
  }
}

export function clearThiebissabaHistory(): ThiebissabaHistoryEntry[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (err) {
    console.error('Error clearing Thiebissaba history:', err);
    return [];
  }
}
