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

export const getCalculationHistory = (): CalculationHistoryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Migrate old abjad_history if available
    const oldAbjadRaw = localStorage.getItem('abjad_history');
    if (oldAbjadRaw && parsed.length === 0) {
      try {
        const oldAbjad = JSON.parse(oldAbjadRaw);
        if (Array.isArray(oldAbjad) && oldAbjad.length > 0) {
          const migrated: CalculationHistoryItem[] = oldAbjad.map((item: any) => ({
            id: item.id || `migrated_${Math.random()}`,
            toolId: 'abjad',
            toolName: 'Calculateur Abjad',
            title: item.text || 'Calcul Abjad',
            summary: `Mashriqi: ${item.mashriqi || 0} | Maghribi: ${item.maghribi || 0}`,
            details: { text: item.text, mashriqi: item.mashriqi, maghribi: item.maghribi },
            timestamp: item.timestamp || Date.now(),
            favorite: false
          }));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          return migrated;
        }
      } catch (err) {
        console.warn('Error migrating old abjad_history:', err);
      }
    }

    return parsed;
  } catch (e) {
    console.error('Error reading calculation history:', e);
    return [];
  }
};

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
    window.dispatchEvent(new Event('calculation_history_updated'));
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
    window.dispatchEvent(new Event('calculation_history_updated'));
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
    window.dispatchEvent(new Event('calculation_history_updated'));
  } catch (e) {
    console.error('Error toggling favorite calculation:', e);
  }
  return updated;
};

export const clearAllCalculationHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('calculation_history_updated'));
  } catch (e) {
    console.error('Error clearing calculation history:', e);
  }
};
