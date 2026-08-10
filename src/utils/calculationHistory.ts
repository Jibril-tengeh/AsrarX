import { getZikrCache, setZikrCache, removeZikrCache, queueZikrSyncAction } from './zikrSyncEngine';

export interface CalculationHistoryItem {
  id: string;
  toolId: string; // 'abjad' | 'khatim' | 'elemental' | 'compatibility' | 'jafar' | 'faraid' | 'zakat' | 'taksir' | 'letters' | 'general'
  toolName: string; // e.g. "Calculateur Abjad"
  title: string; // Main query / text or title e.g. "محمد (92)"
  summary: string; // Brief summary string e.g. "Kabir: 92 | Maghribi: 92 | Élément: Feu"
  details?: Record<string, any>; // Full parameters to restore calculation state or view details
  timestamp: number;
  favorite?: boolean;
  tags?: string[];
}

const STORAGE_KEY = 'asrarhub_calculation_history';
const MAX_HISTORY_ITEMS = 100;

/**
 * Synchronously retrieve calculation history (with background idb-keyval sync)
 */
export const getCalculationHistory = (): CalculationHistoryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Async hydration from idb-keyval if localStorage was cleared
      getZikrCache<CalculationHistoryItem[]>(STORAGE_KEY, []).then((fromIdb) => {
        if (fromIdb && fromIdb.length > 0) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fromIdb));
            window.dispatchEvent(new Event('calculation_history_updated'));
          } catch (_) {}
        }
      });
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Async sync to idb-keyval
    setZikrCache(STORAGE_KEY, parsed).catch(() => {});

    return parsed;
  } catch (e) {
    console.error('Error reading calculation history:', e);
    return [];
  }
};

/**
 * Save calculation history item asynchronously to idb-keyval, localStorage and queue for cloud sync
 */
export const saveCalculationToHistory = (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>): CalculationHistoryItem => {
  const current = getCalculationHistory();
  const newItem: CalculationHistoryItem = {
    ...item,
    id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    favorite: false,
  };

  // Prevent duplicate consecutive entries with same toolId and title
  const filtered = current.filter(existing => !(existing.toolId === item.toolId && existing.title.trim().toLowerCase() === item.title.trim().toLowerCase()));
  const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setZikrCache(STORAGE_KEY, updated).catch(() => {});
    window.dispatchEvent(new Event('calculation_history_updated'));

    // Queue for offline/online cloud sync
    queueZikrSyncAction({
      id: newItem.id,
      type: 'SET',
      collection: 'calculation_history',
      docId: newItem.id,
      data: newItem
    }).catch(() => {});
  } catch (e) {
    console.error('Error saving calculation history:', e);
  }

  return newItem;
};

export const deleteCalculationFromHistory = (id: string): CalculationHistoryItem[] => {
  const current = getCalculationHistory();
  const updated = current.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setZikrCache(STORAGE_KEY, updated).catch(() => {});
    window.dispatchEvent(new Event('calculation_history_updated'));

    queueZikrSyncAction({
      id,
      type: 'DELETE',
      collection: 'calculation_history',
      docId: id
    }).catch(() => {});
  } catch (e) {
    console.error('Error deleting calculation history item:', e);
  }
  return updated;
};

export const toggleFavoriteCalculation = (id: string): CalculationHistoryItem[] => {
  const current = getCalculationHistory();
  const updated = current.map(item => item.id === id ? { ...item, favorite: !item.favorite } : item);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setZikrCache(STORAGE_KEY, updated).catch(() => {});
    window.dispatchEvent(new Event('calculation_history_updated'));
  } catch (e) {
    console.error('Error toggling favorite calculation:', e);
  }
  return updated;
};

export const clearAllCalculationHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    removeZikrCache(STORAGE_KEY).catch(() => {});
    window.dispatchEvent(new Event('calculation_history_updated'));
  } catch (e) {
    console.error('Error clearing calculation history:', e);
  }
};

