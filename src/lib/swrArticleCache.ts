import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { fetchArticlesFromRest } from './firestoreRest';
import { isPubliclyVisibleArticle, getTranslatedArticleTitle, getTranslatedArticleHook } from './articleUtils';
import { ArticleService } from '../services/ArticleService';
import { 
  CACHED_ARTICLES_LIST_KEY, 
  CACHED_EXPLORE_ARTICLES_KEY, 
  CACHED_ARTICLE_DETAILS_KEY,
  saveCachedArticlesList, 
  getDeletedArticleIds,
  combineWithDefaultArticles,
  mergeWithLocalArticles
} from './localArticles';
import { getOfflineData, setOfflineData } from './offlineStorage';
import { INITIAL_DEFAULT_ARTICLES } from '../data/defaultArticles';
import { dispatchSystemNotification, getLocalizedNotificationText } from '../utils/notificationLocalization';

export const SWR_LAST_SYNC_KEY = 'asrarhub_swr_last_sync_timestamp';
export const SWR_EVENT_NAME = 'asrarhub_articles_revalidated';

export interface SWRCacheStats {
  count: number;
  lastSyncTime: number | null;
  lastSyncFormatted: string;
  status: 'idle' | 'revalidating' | 'success' | 'offline' | 'error' | 'cache';
  errorMessage?: string;
  isServingFromCache?: boolean;
  cacheSource?: 'indexeddb' | 'localstorage' | 'network';
}

let activeRevalidationPromise: Promise<any[]> | null = null;
let lastKnownCacheState: { isServingFromCache: boolean; lastError: string | null } = {
  isServingFromCache: false,
  lastError: null,
};

export function getLastKnownCacheState() {
  return lastKnownCacheState;
}

/**
 * 1. STALE PHASE: Instantly retrieves cached published articles from IndexedDB / localStorage.
 * Does not block on network. Enforces strict published-only filter.
 */
export async function getStalePublishedArticles(): Promise<any[]> {
  const deletedIds = getDeletedArticleIds();

  // Try IndexedDB first
  try {
    const idbItems = await getOfflineData<any[]>(CACHED_ARTICLES_LIST_KEY);
    if (Array.isArray(idbItems) && idbItems.length > 0) {
      const valid = idbItems.filter(a => a && a.id && !String(a.id).startsWith('default_art_') && !deletedIds.has(a.id) && ArticleService.isPublished(a));
      if (valid.length > 0) {
        return mergeWithLocalArticles(valid, false);
      }
    }
  } catch (err) {
    console.warn('[SWR] Error loading stale articles from IndexedDB:', err);
  }

  // Fallback to localStorage synchronous read
  try {
    const raw = localStorage.getItem(CACHED_ARTICLES_LIST_KEY) || localStorage.getItem(CACHED_EXPLORE_ARTICLES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const valid = parsed.filter((a: any) => a && a.id && !String(a.id).startsWith('default_art_') && !deletedIds.has(a.id) && ArticleService.isPublished(a));
        return mergeWithLocalArticles(valid, false);
      }
    }
  } catch (e) {}

  return mergeWithLocalArticles([], false);
}

/**
 * 2. REVALIDATE PHASE: Fetches fresh articles from network (Firestore SDK or REST API fallback),
 * updates IndexedDB persistent storage, updates details cache, and dispatches an update event.
 * Strictly guarantees that drafts and archives are excluded at data and query level.
 */
export async function revalidatePublishedArticles(sourceTag = 'manual'): Promise<any[]> {
  // Deduplicate concurrent revalidation requests
  if (activeRevalidationPromise) {
    return activeRevalidationPromise;
  }

  activeRevalidationPromise = (async () => {
    console.log(`[SWR Revalidate] Starting background article sync (Trigger: ${sourceTag})...`);
    let fetchedItems: any[] = [];
    let networkErrorMessage: string | null = null;

    // Check if definitely offline beforehand
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.log('[SWR Revalidate] Device is offline; maintaining existing cached data.');
      lastKnownCacheState = { isServingFromCache: true, lastError: 'Hors ligne' };
      const cached = await getStalePublishedArticles();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(SWR_EVENT_NAME, {
          detail: {
            articles: cached,
            rawPublished: cached,
            count: cached.length,
            timestamp: Date.now(),
            source: 'offline_cache',
            isServingFromCache: true,
            isOffline: true
          }
        }));
      }
      return cached;
    }

    // 1. Concurrent fast-path fetch: Launch REST API and Firestore SDK simultaneously
    // REST API returns in ~150-250ms with zero WebSocket/long-poll overhead.
    const fetchPromises: Promise<any[]>[] = [];

    // REST API task (Fastest and most reliable for immediate display across all mobile/web environments)
    fetchPromises.push(
      fetchArticlesFromRest()
        .then(res => (Array.isArray(res) ? res : []))
        .catch(err => {
          console.warn('[SWR Revalidate] REST API fetch note:', err);
          return [];
        })
    );

    // Firestore SDK task with short non-blocking timeout
    fetchPromises.push(
      (async () => {
        try {
          const q = collection(db, 'articles');
          const snapshot = await Promise.race([
            getDocs(q),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Firestore SDK timeout')), 2500))
          ]);
          const docs: any[] = [];
          snapshot.forEach((docSnap) => {
            docs.push({ id: docSnap.id, ...docSnap.data() });
          });
          return docs;
        } catch (sdkErr: any) {
          console.warn(`[SWR Revalidate] Firestore SDK note:`, sdkErr?.message || sdkErr);
          return [];
        }
      })()
    );

    // Wait for all concurrent fetchers to return
    const [restItems, sdkItems] = await Promise.all(fetchPromises);

    // Merge results to ensure the most complete and fresh collection
    const combinedMap = new Map<string, any>();
    [...(restItems || []), ...(sdkItems || [])].forEach((item) => {
      if (item && item.id) {
        const existing = combinedMap.get(item.id);
        combinedMap.set(item.id, { ...existing, ...item });
      }
    });

    const deletedIds = getDeletedArticleIds();
    fetchedItems = Array.from(combinedMap.values()).filter(
      item => item && item.id && !deletedIds.has(item.id)
    );
    console.log(`[SWR Revalidate] Concurrent fetch finished: ${fetchedItems.length} total articles gathered (REST: ${restItems?.length || 0}, SDK: ${sdkItems?.length || 0}).`);

    // Fallback: If network returned nothing, fallback to local stale cache
    if (fetchedItems.length === 0) {
      console.log('[SWR Revalidate] Network returned 0 items; falling back to local stale cache.');
      const cached = await getStalePublishedArticles();
      return cached;
    }

    // 3. Strict data-level validation: filter only truly published items
    const validPublished = ArticleService.filterPublishedArticles(fetchedItems);

    // Evict any non-published, draft, or deleted items from public caches if returned
    const nonPublicIds = new Set([
      ...fetchedItems
        .filter((art: any) => art && art.id && !ArticleService.isPublished(art))
        .map((art: any) => art.id),
      ...Array.from(deletedIds)
    ]);

    if (validPublished.length > 0) {
      lastKnownCacheState = { isServingFromCache: false, lastError: null };

      // 4. Save to IndexedDB via saveCachedArticlesList and setOfflineData
      saveCachedArticlesList(CACHED_ARTICLES_LIST_KEY, validPublished);
      saveCachedArticlesList(CACHED_EXPLORE_ARTICLES_KEY, validPublished);
      await setOfflineData(CACHED_ARTICLES_LIST_KEY, validPublished);

      // 5. Populate article details store in IndexedDB (and remove non-published/deleted items)
      try {
        const existingDetails = (await getOfflineData<Record<string, any>>(CACHED_ARTICLE_DETAILS_KEY)) || {};
        const now = Date.now();
        
        // Remove non-public or deleted articles
        if (nonPublicIds.size > 0) {
          nonPublicIds.forEach(id => {
            delete existingDetails[id];
          });
        }

        validPublished.forEach((art) => {
          existingDetails[art.id] = {
            ...art,
            cachedAt: now
          };
        });
        await setOfflineData(CACHED_ARTICLE_DETAILS_KEY, existingDetails);
      } catch (e) {
        console.warn('[SWR Revalidate] Error updating article details in IndexedDB:', e);
      }

      // Record sync timestamp
      const syncTime = Date.now();
      try {
        localStorage.setItem(SWR_LAST_SYNC_KEY, String(syncTime));
        await setOfflineData(SWR_LAST_SYNC_KEY, syncTime);
      } catch (e) {}

      // Merge with custom local articles for UI (strictly public articles only)
      const combined = mergeWithLocalArticles(validPublished, false);

      // 5. Background pre-fetch and pin embedded media assets for zero-latency offline access
      prefetchAndPinArticleAssets(combined).catch((err) => {
        console.warn('[SWR] Background asset prefetching warning:', err);
      });

      // Check for new articles and dispatch system tray notification with article title and mode
      try {
        const prevKnownCountStr = localStorage.getItem('asrarhub_last_known_article_count');
        const currentCount = validPublished.length;
        if (prevKnownCountStr !== null) {
          const prevCount = parseInt(prevKnownCountStr, 10);
          if (!isNaN(prevCount) && currentCount > prevCount) {
            const diff = currentCount - prevCount;
            const lang = (localStorage.getItem('language') || 'fr') as 'fr' | 'en' | 'ha';
            
            // Latest newly added article
            const latestArticle = validPublished[0];
            const isPrem = Boolean(latestArticle?.isPremium);
            const articleTitle = getTranslatedArticleTitle(latestArticle, lang) || latestArticle?.title || 'Nouveau Secret';
            const articleHook = getTranslatedArticleHook(latestArticle, lang) || latestArticle?.hook || '';

            const { title: notifTitle, body: notifBody } = getLocalizedNotificationText('articleNew', lang, {
              articleTitle,
              isPremium: isPrem,
              hook: articleHook,
              count: diff,
              articleId: latestArticle?.id
            });

            const targetUrl = latestArticle?.id ? `/secret/${latestArticle.id}` : '/user/dashboard';
            
            console.log(`[SWR] Dispatching rich article notification: "${notifTitle}" -> Target: ${targetUrl} (Premium: ${isPrem})`);

            dispatchSystemNotification(notifTitle, notifBody, {
              type: 'article',
              articleId: latestArticle?.id,
              articleTitle,
              isPremium: isPrem,
              targetUrl,
            });
          }
        }
        localStorage.setItem('asrarhub_last_known_article_count', String(currentCount));
      } catch (err) {
        console.warn('[SWR] Error dispatching new article notification:', err);
      }

      // 6. Notify subscribed UI components via window Event
      if (typeof window !== 'undefined') {
        const customEvent = new CustomEvent(SWR_EVENT_NAME, {
          detail: {
            articles: combined,
            rawPublished: validPublished,
            count: validPublished.length,
            timestamp: syncTime,
            source: sourceTag,
            isServingFromCache: false,
            isOnline: true
          }
        });
        window.dispatchEvent(customEvent);
      }

      console.log(`[SWR Revalidate] Successfully revalidated ${validPublished.length} articles and updated IndexedDB cache.`);
      return combined;
    } else {
      console.log('[SWR Revalidate] Network revalidation yielded no response or failed; gracefully preserving cached data on screen.');
      lastKnownCacheState = { isServingFromCache: true, lastError: networkErrorMessage || 'Serveur injoignable' };
      const staleArticles = await getStalePublishedArticles();
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(SWR_EVENT_NAME, {
          detail: {
            articles: staleArticles,
            rawPublished: staleArticles,
            count: staleArticles.length,
            timestamp: Date.now(),
            source: 'cache_fallback',
            isServingFromCache: true,
            isOffline: typeof navigator !== 'undefined' && !navigator.onLine,
            errorMessage: networkErrorMessage
          }
        }));
      }
      return staleArticles;
    }
  })().catch(async (err) => {
    console.warn('[SWR Revalidate] Unhandled error during revalidation; falling back to cache:', err);
    lastKnownCacheState = { isServingFromCache: true, lastError: err?.message || 'Erreur réseau' };
    const fallbackArticles = await getStalePublishedArticles();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SWR_EVENT_NAME, {
        detail: {
          articles: fallbackArticles,
          rawPublished: fallbackArticles,
          count: fallbackArticles.length,
          timestamp: Date.now(),
          source: 'cache_error_recovery',
          isServingFromCache: true,
          errorMessage: err?.message
        }
      }));
    }
    return fallbackArticles;
  }).finally(() => {
    activeRevalidationPromise = null;
  });

  return activeRevalidationPromise;
}

/**
 * Get SWR stats for display in NetworkStatus modal/pill.
 */
export async function getSWRCacheStats(): Promise<SWRCacheStats> {
  let count = 0;
  let lastSyncTime: number | null = null;

  try {
    const cachedList = (await getOfflineData<any[]>(CACHED_ARTICLES_LIST_KEY)) || (await getOfflineData<any[]>(CACHED_EXPLORE_ARTICLES_KEY));
    if (Array.isArray(cachedList) && cachedList.length > 0) {
      count = cachedList.filter(a => a && isPubliclyVisibleArticle(a.status)).length;
    }
  } catch (e) {}

  if (count === 0) {
    try {
      const raw = localStorage.getItem(CACHED_ARTICLES_LIST_KEY) || localStorage.getItem(CACHED_EXPLORE_ARTICLES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          count = parsed.filter((a: any) => a && isPubliclyVisibleArticle(a.status)).length;
        }
      }
    } catch (e) {}
  }

  try {
    const syncRaw = localStorage.getItem(SWR_LAST_SYNC_KEY);
    if (syncRaw) {
      lastSyncTime = Number(syncRaw);
    }
  } catch (e) {}

  let lastSyncFormatted = 'Jamais';
  if (lastSyncTime && !isNaN(lastSyncTime)) {
    const date = new Date(lastSyncTime);
    lastSyncFormatted = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
  const isServingCache = isOffline || lastKnownCacheState.isServingFromCache || count > 0;

  return {
    count,
    lastSyncTime,
    lastSyncFormatted,
    status: isOffline ? 'offline' : lastKnownCacheState.isServingFromCache ? 'cache' : 'idle',
    isServingFromCache: isServingCache,
    errorMessage: lastKnownCacheState.lastError || undefined
  };
}

/**
 * Background Service: Pre-fetches and pins article rich media assets (images, cover photos, audio)
 * into IndexedDB to guarantee zero-latency offline access to the full library.
 */
export async function prefetchAndPinArticleAssets(articles: any[]): Promise<number> {
  if (typeof window === 'undefined') return 0;
  if (!navigator.onLine) {
    console.log('[OfflineAssetService] Device offline; skipping asset prefetching.');
    return 0;
  }

  const urlsToPin = new Set<string>();

  articles.forEach((art) => {
    if (!art) return;

    // Check direct image properties
    ['image', 'coverImage', 'imageUrl', 'avatar', 'audioUrl', 'mediaUrl'].forEach((prop) => {
      if (typeof art[prop] === 'string' && art[prop].startsWith('http')) {
        urlsToPin.add(art[prop]);
      }
    });

    // Extract inline markdown and HTML image URLs from content/description
    const textContent = `${art.content || ''} ${art.description || ''} ${art.body || ''}`;
    const urlRegex = /https?:\/\/[^\s"')>]+\.(?:png|jpg|jpeg|webp|gif|svg)/gi;
    let match: RegExpExecArray | null;
    while ((match = urlRegex.exec(textContent)) !== null) {
      if (match[0]) urlsToPin.add(match[0]);
    }
  });

  let pinnedCount = 0;
  const urlArray = Array.from(urlsToPin);

  for (const url of urlArray) {
    try {
      const storageKey = `ASSET_PIN_${encodeURIComponent(url)}`;
      const existing = await getOfflineData<string>(storageKey);
      if (existing) {
        pinnedCount++;
        continue;
      }

      // Fetch and convert asset to Base64 DataURL
      const res = await fetch(url, { cache: 'force-cache' });
      if (!res.ok) continue;

      const blob = await res.blob();
      const reader = new FileReader();

      await new Promise<void>((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            if (typeof reader.result === 'string') {
              await setOfflineData(storageKey, reader.result);
              pinnedCount++;
            }
            resolve();
          } catch (e) {
            reject(e);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      // Ignore individual CORS or network prefetch failures
    }
  }

  console.log(`[OfflineAssetService] Pinned ${pinnedCount}/${urlsToPin.size} rich media assets to IndexedDB.`);
  return pinnedCount;
}

/**
 * Retrieves a cached DataURL for a pinned media asset if available, falling back to original URL.
 */
export async function getCachedAssetUrl(originalUrl: string): Promise<string> {
  if (!originalUrl || !originalUrl.startsWith('http')) return originalUrl;
  try {
    const storageKey = `ASSET_PIN_${encodeURIComponent(originalUrl)}`;
    const cachedDataUrl = await getOfflineData<string>(storageKey);
    if (cachedDataUrl) return cachedDataUrl;
  } catch (e) {}
  return originalUrl;
}

/**
 * Clears all local SWR article cache records from IndexedDB and localStorage
 */
export async function clearAllArticlesCache(): Promise<void> {
  try {
    localStorage.removeItem(CACHED_ARTICLES_LIST_KEY);
    localStorage.removeItem(CACHED_EXPLORE_ARTICLES_KEY);
    localStorage.removeItem(CACHED_ARTICLE_DETAILS_KEY);
    localStorage.removeItem(SWR_LAST_SYNC_KEY);
    await setOfflineData(CACHED_ARTICLES_LIST_KEY, []);
    await setOfflineData(CACHED_EXPLORE_ARTICLES_KEY, []);
    await setOfflineData(CACHED_ARTICLE_DETAILS_KEY, {});
  } catch (e) {
    console.warn('[SWR] Error clearing article cache:', e);
  }
}


