import { INITIAL_DEFAULT_ARTICLES } from '../data/defaultArticles';

export const LOCAL_CUSTOM_ARTICLES_KEY = 'asrarhub_custom_local_articles';
export const CACHED_ADMIN_ARTICLES_KEY = 'asrarhub_cached_admin_articles';
export const CACHED_ARTICLES_LIST_KEY = 'asrarhub_cached_articles_list';
export const CACHED_EXPLORE_ARTICLES_KEY = 'asrarhub_cached_explore_articles';
export const CACHED_ARTICLE_DETAILS_KEY = 'asrarhub_cached_article_details';

export interface LocalArticle {
  id: string;
  title: string;
  hook?: string;
  thumbnail?: string;
  content: string;
  type?: string;
  status?: string;
  publishDate?: string;
  isPremium?: boolean;
  category?: string;
  subCategory?: string;
  benefits?: string[];
  title_en?: string;
  content_en?: string;
  hook_en?: string;
  title_ha?: string;
  content_ha?: string;
  hook_ha?: string;
  createdAt?: number;
  [key: string]: any;
}

/**
 * Retrieves all locally saved custom articles.
 */
export const getLocalCustomArticles = (): LocalArticle[] => {
  try {
    const data = localStorage.getItem(LOCAL_CUSTOM_ARTICLES_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading local custom articles:", e);
  }
  return [];
};

const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`[Storage] Failed to set ${key} due to storage quota:`, err);
  }
};

/**
 * Saves or updates an article in local persistent storage so it is NEVER lost,
 * even when offline on Capacitor or when Firestore cache resets.
 */
export const saveLocalCustomArticle = (article: LocalArticle): LocalArticle[] => {
  try {
    const current = getLocalCustomArticles();
    const existingIdx = current.findIndex(a => a.id === article.id);
    let updated: LocalArticle[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = { ...updated[existingIdx], ...article };
    } else {
      updated = [article, ...current];
    }
    safeSetItem(LOCAL_CUSTOM_ARTICLES_KEY, JSON.stringify(updated));

    // Also update cached lists
    updateCachedArticleLists(article);

    return updated;
  } catch (e) {
    console.error("Error saving local custom article:", e);
    return getLocalCustomArticles();
  }
};

/**
 * Removes an article from local custom storage and cached lists.
 */
export const deleteLocalCustomArticle = (articleId: string): void => {
  try {
    const current = getLocalCustomArticles();
    const filtered = current.filter(a => a.id !== articleId);
    safeSetItem(LOCAL_CUSTOM_ARTICLES_KEY, JSON.stringify(filtered));

    // Remove from cached lists
    removeFromCachedLists(articleId);
  } catch (e) {
    console.error("Error deleting local custom article:", e);
  }
};

/**
 * Clears all custom local articles (e.g. when admin explicitly deletes all).
 */
export const clearAllLocalCustomArticles = (): void => {
  try {
    localStorage.removeItem(LOCAL_CUSTOM_ARTICLES_KEY);
    localStorage.removeItem(CACHED_ADMIN_ARTICLES_KEY);
    localStorage.removeItem(CACHED_ARTICLES_LIST_KEY);
    localStorage.removeItem(CACHED_EXPLORE_ARTICLES_KEY);
    localStorage.removeItem(CACHED_ARTICLE_DETAILS_KEY);
  } catch (e) {}
};

/**
 * Updates all cached article lists with the modified/new article.
 */
export const updateCachedArticleLists = (article: LocalArticle): void => {
  const keys = [CACHED_ADMIN_ARTICLES_KEY, CACHED_ARTICLES_LIST_KEY, CACHED_EXPLORE_ARTICLES_KEY];
  keys.forEach(key => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const list: any[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          const idx = list.findIndex(item => item.id === article.id);
          let nextList: any[];
          if (idx >= 0) {
            nextList = [...list];
            nextList[idx] = { ...nextList[idx], ...article };
          } else {
            nextList = [article, ...list];
          }
          safeSetItem(key, JSON.stringify(nextList));
        }
      } else {
        safeSetItem(key, JSON.stringify([article]));
      }
    } catch (e) {}
  });

  // Also cache individual details
  try {
    const detailsRaw = localStorage.getItem(CACHED_ARTICLE_DETAILS_KEY);
    const details = detailsRaw ? JSON.parse(detailsRaw) : {};
    details[article.id] = article;
    safeSetItem(CACHED_ARTICLE_DETAILS_KEY, JSON.stringify(details));
  } catch (e) {}
};

/**
 * Removes an article ID from all cached article lists.
 */
export const removeFromCachedLists = (articleId: string): void => {
  const keys = [CACHED_ADMIN_ARTICLES_KEY, CACHED_ARTICLES_LIST_KEY, CACHED_EXPLORE_ARTICLES_KEY];
  keys.forEach(key => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const list: any[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          const nextList = list.filter(item => item.id !== articleId);
          safeSetItem(key, JSON.stringify(nextList));
        }
      }
    } catch (e) {}
  });

  try {
    const detailsRaw = localStorage.getItem(CACHED_ARTICLE_DETAILS_KEY);
    if (detailsRaw) {
      const details = JSON.parse(detailsRaw);
      delete details[articleId];
      safeSetItem(CACHED_ARTICLE_DETAILS_KEY, JSON.stringify(details));
    }
  } catch (e) {}
};

/**
 * Merges remote articles (from Firestore or REST or defaults) with local custom articles.
 * Local custom articles take precedence if updated or if not present in remote list.
 */
export const mergeWithLocalArticles = <T extends { id: string }>(remoteArticles: T[]): T[] => {
  const localCustom = getLocalCustomArticles();
  if (localCustom.length === 0) return remoteArticles;

  const resultMap = new Map<string, any>();

  // 1. Put default/remote articles into map
  for (const art of remoteArticles) {
    if (art && art.id) {
      resultMap.set(art.id, art);
    }
  }

  // 2. Override/add local custom articles
  for (const localArt of localCustom) {
    if (localArt && localArt.id) {
      if (!resultMap.has(localArt.id)) {
        resultMap.set(localArt.id, localArt);
      } else {
        const existing = resultMap.get(localArt.id);
        resultMap.set(localArt.id, { ...existing, ...localArt });
      }
    }
  }

  const merged = Array.from(resultMap.values());
  merged.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return merged;
};
