import { AsrarItem } from '../types';

export const initialData: AsrarItem[] = [];

export const getAsrarItems = (): AsrarItem[] => {
  try {
    const stored = localStorage.getItem('asrar_items');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.map(item => ({
          ...item,
          hook: item.hook || (item.content ? item.content.replace(/<[^>]+>/g, '').substring(0, 120) + '...' : '')
        }));
      }
    }
  } catch (e) {
    console.error("Error parsing asrar_items", e);
  }
  return [];
};



