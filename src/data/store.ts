import { AsrarItem } from '../types';
import { INITIAL_DEFAULT_ARTICLES } from './defaultArticles';
import { isPubliclyVisibleArticle } from '../lib/articleUtils';

export const initialData: AsrarItem[] = [];

export const getAsrarItems = (): AsrarItem[] => {
  try {
    const cached = localStorage.getItem('asrarhub_cached_articles_list') || localStorage.getItem('asrarhub_cached_explore_articles');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .filter(item => item && item.id && !String(item.id).startsWith('default_art_') && isPubliclyVisibleArticle(item.status))
          .map(item => ({
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



