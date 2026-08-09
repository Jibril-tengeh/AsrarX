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
          .filter(item => isPubliclyVisibleArticle(item.status))
          .map(item => ({
            ...item,
            hook: item.hook || (item.content ? item.content.replace(/<[^>]+>/g, '').substring(0, 120) + '...' : '')
          }));
      }
    }
  } catch (e) {
    console.error("Error parsing asrar_items", e);
  }
  return INITIAL_DEFAULT_ARTICLES
    .filter(art => isPubliclyVisibleArticle(art.status))
    .map(art => ({
      id: art.id,
      title: art.title,
      title_en: art.title_en,
      title_ha: art.title_ha,
      hook: art.hook,
      hook_en: art.hook_en,
      hook_ha: art.hook_ha,
      category: art.category,
      subCategory: art.subCategory || '',
      status: art.status,
      content: art.content,
      content_en: art.content_en,
      content_ha: art.content_ha,
      benefits: art.benefits,
      imageUrl: art.thumbnail,
      isPremium: art.isPremium,
      createdAt: art.createdAt
    })) as AsrarItem[];
};



