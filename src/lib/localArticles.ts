import { INITIAL_DEFAULT_ARTICLES } from '../data/defaultArticles';
import { setOfflineData, getOfflineData, removeOfflineData } from './offlineStorage';
import { getArticleImageUrl } from '../utils/articleImageUtils';
import { sortArticlesInOrder, isPubliclyVisibleArticle } from './articleUtils';

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
  audioUrl?: string;
  audio_url?: string;
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
 * Strips heavy payload fields (like huge base64 images)
 * from article objects for localStorage caching to keep payload compact,
 * while strictly PRESERVING 100% of text content, audio, and metadata.
 */
export const stripArticleForListCache = (art: any): any => {
  if (!art || typeof art !== 'object') return art;
  const copy: any = { ...art };

  // Ensure both thumbnail and imageUrl properties exist and are synced
  const img = getArticleImageUrl(copy);
  copy.thumbnail = img;
  copy.imageUrl = img;
  copy.image = copy.image || img;
  copy.coverImage = copy.coverImage || img;
  copy.coverImageUrl = copy.coverImageUrl || img;

  // Preserve audio and cropping metadata
  copy.audioUrl = copy.audioUrl || copy.audio_url || '';
  copy.audio_url = copy.audioUrl || copy.audio_url || '';
  if (copy.coverImageCrop) copy.coverImageCrop = copy.coverImageCrop;
  if (copy.cropData) copy.cropData = copy.cropData;
  if (copy.cropAspect) copy.cropAspect = copy.cropAspect;
  if (copy.audioTitle) copy.audioTitle = copy.audioTitle;
  if (copy.audioDuration) copy.audioDuration = copy.audioDuration;

  // Strictly preserve full content text for offline and Capacitor viewing without truncation
  copy.content = copy.content || '';
  copy.content_en = copy.content_en || '';
  copy.content_ha = copy.content_ha || '';

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
 * Never injects mock articles by default; only real database articles and user content are returned.
 */
export const combineWithDefaultArticles = <T extends { id: string }>(defaultArticles: T[], remoteArticles: T[]): T[] => {
  const deletedIds = getDeletedArticleIds();
  const hideMock = isMockArticlesHidden();

  let cleanedRemote = Array.isArray(remoteArticles) ? remoteArticles : [];
  // Strip out any legacy default mock items
  cleanedRemote = cleanedRemote.filter(a => a && a.id && !String(a.id).startsWith('default_art_') && !deletedIds.has(a.id));

  return cleanedRemote;
};

/**
 * Safely saves article lists into IndexedDB (unlimited storage) and localStorage.
 * Never throws quota errors.
 */
export const saveCachedArticlesList = (key: string, articles: any[]): void => {
  if (!Array.isArray(articles)) return;
  const deletedIds = getDeletedArticleIds();
  const validArticles = articles.filter(a => a && a.id && !deletedIds.has(a.id));

  if (validArticles.length === 0) {
    try {
      localStorage.setItem(key, '[]');
    } catch (e) {}
    setOfflineData(key, []).catch(() => {});
    return;
  }

  // 1. Save full, non-truncated articles array into IndexedDB (unlimited storage)
  setOfflineData(key, validArticles).catch(err => {
    console.warn(`[Storage] IndexedDB setOfflineData error for ${key}:`, err);
  });

  // 2. Also save clean preview list in localStorage for instant synchronous initial render
  const cleanList = validArticles.map(stripArticleForListCache);

  try {
    localStorage.setItem(key, JSON.stringify(cleanList));
  } catch (err) {
    console.warn(`[Storage] Primary localStorage cache setItem failed for ${key}, falling back to compact representation...`);
    try {
      localStorage.removeItem(CACHED_ARTICLE_DETAILS_KEY);
      // Remove inline base64 image strings if storage quota is constrained, but preserve all text
      const compactList = cleanList.map(a => ({
        ...a,
        thumbnail: typeof a.thumbnail === 'string' && a.thumbnail.startsWith('data:') ? '' : a.thumbnail,
        imageUrl: typeof a.imageUrl === 'string' && a.imageUrl.startsWith('data:') ? '' : a.imageUrl,
        image: typeof a.image === 'string' && a.image.startsWith('data:') ? '' : a.image,
      }));
      localStorage.setItem(key, JSON.stringify(compactList));
    } catch (fallbackErr) {
      console.warn(`[Storage] Storage quota exceeded for localStorage ${key}. IndexedDB holds full cache.`);
    }
  }
};

/**
 * Asynchronously retrieves cached article list from IndexedDB first, with fallback to localStorage.
 */
export const getCachedArticlesListAsync = async (key: string): Promise<any[]> => {
  const deletedIds = getDeletedArticleIds();

  // 1. Try IndexedDB first (contains full list without size truncation)
  try {
    const idbData = await getOfflineData<any[]>(key);
    if (Array.isArray(idbData) && idbData.length > 0) {
      const valid = idbData.filter(a => a && a.id && !deletedIds.has(a.id));
      if (valid.length > 0) {
        return valid;
      }
    }
  } catch (e) {}

  // 2. Fallback to localStorage
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(a => a && a.id && !deletedIds.has(a.id));
      }
    }
  } catch (e) {}

  return [];
};

/**
 * Saves or updates an article in local persistent storage so it is NEVER lost,
 * even when offline on Capacitor or when Firestore cache resets, and
 * automatically syncs it to Firestore in the background and broadcasts the update.
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

    // Automatically push directly to Firestore in the background
    if (typeof window !== 'undefined' && article && article.id) {
      import('./firebase').then(({ db }) => {
        import('firebase/firestore').then(({ doc, setDoc }) => {
          if (db) {
            setDoc(doc(db, 'articles', article.id), article, { merge: true }).catch(err => {
              console.warn('[AutoSync] Background Firestore setDoc warning:', err);
            });
          }
        }).catch(() => {});
      }).catch(() => {});

      // Broadcast live update event so user dashboards update immediately without refresh (strictly public published articles only)
      try {
        const mergedPublic = mergeWithLocalArticles(updated, false);
        const customEvent = new CustomEvent('asrarhub_swr_articles_updated', {
          detail: {
            articles: mergedPublic,
            count: mergedPublic.length,
            timestamp: Date.now(),
            source: 'save_local_auto'
          }
        });
        window.dispatchEvent(customEvent);
        window.dispatchEvent(new CustomEvent('asrarhub_articles_revalidated', {
          detail: {
            articles: mergedPublic,
            count: mergedPublic.length,
            timestamp: Date.now(),
            source: 'save_local_auto'
          }
        }));
        window.dispatchEvent(new CustomEvent('asrarhub_articles_updated', { detail: { article } }));
      } catch (e) {}
    }

    return updated;
  } catch (e) {
    console.error("Error saving local custom article:", e);
    return getLocalCustomArticles();
  }
};

/**
 * Removes an article from local custom storage and cached lists,
 * and automatically deletes it from Firestore in the background.
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

    // Automatically delete from Firestore in the background
    if (typeof window !== 'undefined' && articleId) {
      import('./firebase').then(({ db }) => {
        import('firebase/firestore').then(({ doc, deleteDoc }) => {
          if (db) {
            deleteDoc(doc(db, 'articles', articleId)).catch(err => {
              console.warn('[AutoSync] Background Firestore deleteDoc warning:', err);
            });
          }
        }).catch(() => {});
      }).catch(() => {});

      // Broadcast removal event
      try {
        const mergedPublic = mergeWithLocalArticles(filtered, false);
        window.dispatchEvent(new CustomEvent('asrarhub_swr_articles_updated', {
          detail: {
            articles: mergedPublic,
            count: mergedPublic.length,
            timestamp: Date.now(),
            source: 'delete_local_auto'
          }
        }));
        window.dispatchEvent(new CustomEvent('asrarhub_articles_revalidated', {
          detail: {
            articles: mergedPublic,
            count: mergedPublic.length,
            timestamp: Date.now(),
            source: 'delete_local_auto'
          }
        }));
        window.dispatchEvent(new CustomEvent('asrarhub_articles_updated', { detail: { deletedId: articleId } }));
      } catch (e) {}
    }
  } catch (e) {
    console.error("Error deleting local custom article:", e);
  }
};

/**
 * Automatically synchronizes all local custom articles to Firestore in the background.
 * Ensures that published articles are immediately persisted without needing manual action.
 */
export const autoSyncLocalArticlesToFirestore = async (): Promise<number> => {
  try {
    if (typeof window === 'undefined') return 0;
    const { db } = await import('./firebase');
    const { doc, setDoc } = await import('firebase/firestore');
    if (!db) return 0;

    const locals = getLocalCustomArticles();
    if (!Array.isArray(locals) || locals.length === 0) return 0;

    let syncedCount = 0;
    for (const art of locals) {
      if (art && art.id && !String(art.id).startsWith('default_art_')) {
        await setDoc(doc(db, 'articles', art.id), art, { merge: true }).catch(err => {
          console.warn(`[AutoSync] Error syncing article ${art.id} to Firestore:`, err);
        });
        syncedCount++;
      }
    }
    if (syncedCount > 0) {
      console.log(`[AutoSync] Automatically synced ${syncedCount} articles to Firestore.`);
    }
    return syncedCount;
  } catch (err) {
    console.warn('[AutoSync] Error during autoSyncLocalArticlesToFirestore:', err);
    return 0;
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
 * Admin cache keeps all (including Drafts and Archives).
 * Public caches only include strictly published articles.
 */
export const updateCachedArticleLists = (article: LocalArticle): void => {
  if (article && article.id) {
    removeDeletedArticleId(article.id);
  }
  const isPublic = isPubliclyVisibleArticle(article);

  // 1. Admin cache (contains Drafts, Archives, and Published)
  try {
    const raw = localStorage.getItem(CACHED_ADMIN_ARTICLES_KEY);
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
        saveCachedArticlesList(CACHED_ADMIN_ARTICLES_KEY, nextList);
      }
    } else {
      saveCachedArticlesList(CACHED_ADMIN_ARTICLES_KEY, [article]);
    }
  } catch (e) {}

  // 2. Public caches (User Dashboard & Explore Feed):
  // If not published (Draft or Archived), remove it immediately from public caches
  const publicKeys = [CACHED_ARTICLES_LIST_KEY, CACHED_EXPLORE_ARTICLES_KEY];
  publicKeys.forEach(key => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const list: any[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          let nextList: any[];
          if (!isPublic) {
            nextList = list.filter(item => item && item.id !== article.id);
          } else {
            const idx = list.findIndex(item => item.id === article.id);
            if (idx >= 0) {
              nextList = [...list];
              nextList[idx] = { ...nextList[idx], ...article };
            } else {
              nextList = [article, ...list];
            }
          }
          saveCachedArticlesList(key, nextList.filter(it => isPubliclyVisibleArticle(it)));
        }
      } else if (isPublic) {
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
 * @param allowNonPublished When false (default for public app views), strictly filters out Drafts and Archives.
 */
export const mergeWithLocalArticles = <T extends { id: string }>(
  remoteArticles: T[],
  allowNonPublished: boolean = false
): T[] => {
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
  if (!allowNonPublished) {
    filteredRemote = filteredRemote.filter(a => isPubliclyVisibleArticle(a));
  }

  const resultMap = new Map<string, any>();

  // 1. Put default/remote articles into map
  for (const art of filteredRemote) {
    if (art && art.id) {
      if (hideMock && String(art.id).startsWith('default_art_')) continue;
      if (deletedIds.has(art.id)) continue;
      if (!allowNonPublished && !isPubliclyVisibleArticle(art)) continue;
      resultMap.set(art.id, art);
    }
  }

  // 2. Override/add local custom articles
  for (const localArt of localCustom) {
    if (localArt && localArt.id) {
      if (hideMock && String(localArt.id).startsWith('default_art_')) continue;
      if (deletedIds.has(localArt.id)) continue;
      if (!allowNonPublished && !isPubliclyVisibleArticle(localArt)) continue;
      if (!resultMap.has(localArt.id)) {
        resultMap.set(localArt.id, localArt);
      } else {
        const existing = resultMap.get(localArt.id);
        resultMap.set(localArt.id, { ...existing, ...localArt });
      }
    }
  }

  let merged = Array.from(resultMap.values());
  if (!allowNonPublished) {
    merged = merged.filter(a => isPubliclyVisibleArticle(a));
  }
  return sortArticlesInOrder(merged, true) as T[];
};
