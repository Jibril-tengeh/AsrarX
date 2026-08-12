import { INITIAL_DEFAULT_ARTICLES } from '../data/defaultArticles';

export const LOCAL_CUSTOM_ARTICLES_KEY = 'asrarhub_custom_local_articles';
export const CACHED_ADMIN_ARTICLES_KEY = 'asrarhub_cached_admin_articles';
export const CACHED_ARTICLES_LIST_KEY = 'asrarhub_cached_articles_list';
export const CACHED_EXPLORE_ARTICLES_KEY = 'asrarhub_cached_explore_articles';
export const CACHED_ARTICLE_DETAILS_KEY = 'asrarhub_cached_article_details';
export const DELETED_ARTICLES_KEY = 'asrarhub_deleted_articles_set';

/**
 * Gets the set of article IDs that have been explicitly deleted by the admin or user.
 */
export const getDeletedArticleIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(DELETED_ARTICLES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
    }
  } catch (e) {}
  return new Set();
};

/**
 * Registers an article ID as deleted so it never re-appears from cache, Firestore or REST.
 */
export const addDeletedArticleId = (id: string): void => {
  if (!id) return;
  try {
    const set = getDeletedArticleIds();
    set.add(id);
    localStorage.setItem(DELETED_ARTICLES_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {}
};

/**
 * Removes an article ID from the deleted tombstones if it is recreated/restored.
 */
export const removeDeletedArticleId = (id: string): void => {
  if (!id) return;
  try {
    const set = getDeletedArticleIds();
    if (set.has(id)) {
      set.delete(id);
      localStorage.setItem(DELETED_ARTICLES_KEY, JSON.stringify(Array.from(set)));
    }
  } catch (e) {}
};

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
 * Strips heavy payload fields (like huge body text or oversized base64 images)
 * from article objects for list caching to keep localStorage payload compact.
 */
export const stripArticleForListCache = (art: any): any => {
  if (!art || typeof art !== 'object') return art;
  const copy: any = { ...art };

  // Ensure both thumbnail and imageUrl properties exist and are synced
  const img = copy.thumbnail || copy.imageUrl || '';
  if (img) {
    copy.thumbnail = img;
    copy.imageUrl = img;
  }

  // Truncate long content text for list previews
  if (typeof copy.content === 'string' && copy.content.length > 300) {
    copy.content = copy.content.slice(0, 300);
  }
  if (typeof copy.content_en === 'string' && copy.content_en.length > 300) {
    copy.content_en = copy.content_en.slice(0, 300);
  }
  if (typeof copy.content_ha === 'string' && copy.content_ha.length > 300) {
    copy.content_ha = copy.content_ha.slice(0, 300);
  }

  return copy;
};

export const HIDE_MOCK_ARTICLES_KEY = 'asrarhub_hide_mock_articles';

/**
 * Checks if the user has requested to hide or delete default mock articles.
 */
export const isMockArticlesHidden = (): boolean => {
  try {
    return localStorage.getItem(HIDE_MOCK_ARTICLES_KEY) === 'true';
  } catch (e) {
    return false;
  }
};

/**
 * Permanently hides or restores default mock articles across the app.
 */
export const setHideMockArticles = (hide: boolean = true): void => {
  try {
    if (hide) {
      localStorage.setItem(HIDE_MOCK_ARTICLES_KEY, 'true');
      const defaultIds = ['default_art_1', 'default_art_2', 'default_art_3', 'default_art_4'];
      defaultIds.forEach(id => removeFromCachedLists(id));
    } else {
      localStorage.removeItem(HIDE_MOCK_ARTICLES_KEY);
    }
  } catch (e) {}
};

/**
 * Combines default articles with remote articles (from Firestore/REST).
 * If real database/remote articles exist, returns ONLY real database articles so mock articles never contaminate real content.
 */
export const combineWithDefaultArticles = <T extends { id: string }>(defaultArticles: T[], remoteArticles: T[]): T[] => {
  const deletedIds = getDeletedArticleIds();
  const hideMock = isMockArticlesHidden();

  let cleanedRemote = Array.isArray(remoteArticles) ? remoteArticles : [];
  if (deletedIds.size > 0) {
    cleanedRemote = cleanedRemote.filter(a => a && a.id && !deletedIds.has(a.id));
  }

  if (hideMock) {
    return cleanedRemote;
  }

  // If there are real database/remote articles, return ONLY real database articles!
  if (cleanedRemote.length > 0) {
    return cleanedRemote;
  }

  // Only fallback to default mock articles if database list is completely empty
  let cleanedDefaults = Array.isArray(defaultArticles) ? defaultArticles : [];
  if (deletedIds.size > 0) {
    cleanedDefaults = cleanedDefaults.filter(a => a && a.id && !deletedIds.has(a.id));
  }

  return cleanedDefaults;
};

/**
 * Safely saves article lists into localStorage with automatic size optimization
 * and quota fallback handling. Never throws quota errors.
 */
export const saveCachedArticlesList = (key: string, articles: any[]): void => {
  if (!Array.isArray(articles)) return;
  const deletedIds = getDeletedArticleIds();
  const validArticles = articles.filter(a => a && a.id && !deletedIds.has(a.id));

  if (validArticles.length === 0) {
    try {
      localStorage.setItem(key, '[]');
    } catch (e) {}
    return;
  }

  const lightweightList = validArticles.map(stripArticleForListCache);

  try {
    localStorage.setItem(key, JSON.stringify(lightweightList));
  } catch (err) {
    console.warn(`[Storage] Primary cache setItem failed for ${key}, attempting quota cleanup...`);
    try {
      // 1. Remove non-essential cached details to free space
      localStorage.removeItem(CACHED_ARTICLE_DETAILS_KEY);
      
      // 2. Reduce list to top 40 items and minimal text
      const trimmedList = lightweightList.slice(0, 40).map(a => ({
        ...a,
        content: typeof a.content === 'string' ? a.content.slice(0, 100) : '',
        content_en: typeof a.content_en === 'string' ? a.content_en.slice(0, 100) : '',
        content_ha: typeof a.content_ha === 'string' ? a.content_ha.slice(0, 100) : '',
      }));
      localStorage.setItem(key, JSON.stringify(trimmedList));
    } catch (fallbackErr) {
      console.warn(`[Storage] Storage quota severely exceeded for ${key}. Skipping local cache save.`);
    }
  }
};

/**
 * Saves or updates an article in local persistent storage so it is NEVER lost,
 * even when offline on Capacitor or when Firestore cache resets.
 */
export const saveLocalCustomArticle = (article: LocalArticle): LocalArticle[] => {
  try {
    if (article && article.id) {
      removeDeletedArticleId(article.id);
    }
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
    if (articleId) {
      addDeletedArticleId(articleId);
    }
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
  if (article && article.id) {
    removeDeletedArticleId(article.id);
  }
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
          saveCachedArticlesList(key, nextList);
        }
      } else {
        saveCachedArticlesList(key, [article]);
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
  if (articleId) {
    addDeletedArticleId(articleId);
  }
  const keys = [CACHED_ADMIN_ARTICLES_KEY, CACHED_ARTICLES_LIST_KEY, CACHED_EXPLORE_ARTICLES_KEY];
  keys.forEach(key => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const list: any[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          const nextList = list.filter(item => item && item.id !== articleId);
          saveCachedArticlesList(key, nextList);
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
  const hideMock = isMockArticlesHidden();
  const deletedIds = getDeletedArticleIds();

  let filteredRemote = Array.isArray(remoteArticles) ? remoteArticles : [];
  if (hideMock) {
    filteredRemote = filteredRemote.filter(a => a && !String(a.id).startsWith('default_art_'));
  }
  if (deletedIds.size > 0) {
    filteredRemote = filteredRemote.filter(a => a && a.id && !deletedIds.has(a.id));
  }

  const resultMap = new Map<string, any>();

  // 1. Put default/remote articles into map
  for (const art of filteredRemote) {
    if (art && art.id) {
      if (hideMock && String(art.id).startsWith('default_art_')) continue;
      if (deletedIds.has(art.id)) continue;
      resultMap.set(art.id, art);
    }
  }

  // 2. Override/add local custom articles
  for (const localArt of localCustom) {
    if (localArt && localArt.id) {
      if (hideMock && String(localArt.id).startsWith('default_art_')) continue;
      if (deletedIds.has(localArt.id)) continue;
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
