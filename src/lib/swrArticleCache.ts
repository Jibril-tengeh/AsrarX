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
  status: 'idle' | 'revalidating' | 'success' | 'offline' | 'error';
  errorMessage?: string;
}

let activeRevalidationPromise: Promise<any[]> | null = null;

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

    // 1. Attempt Firestore SDK fetch with timeout
    try {
      const q = collection(db, 'articles');
      const snapshot = await Promise.race([
        getDocs(q),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Firestore SDK timeout')), 6000))
      ]);

      snapshot.forEach((docSnap) => {
        fetchedItems.push({ id: docSnap.id, ...docSnap.data() });
      });
      console.log(`[SWR Revalidate] Firestore SDK returned ${fetchedItems.length} articles.`);
    } catch (sdkErr: any) {
      console.warn(`[SWR Revalidate] Firestore SDK fetch skipped/failed (${sdkErr?.message}), trying HTTPS REST fallback...`);
      fetchedItems = [];
    }

    // 2. If SDK returned empty or failed, attempt HTTPS REST API fallback
    if (fetchedItems.length === 0) {
      try {
        const restItems = await fetchArticlesFromRest();
        if (Array.isArray(restItems) && restItems.length > 0) {
          fetchedItems = restItems;
          console.log(`[SWR Revalidate] HTTPS REST API returned ${fetchedItems.length} articles.`);
        }
      } catch (restErr) {
        console.warn('[SWR Revalidate] REST API fallback error:', restErr);
      }
    }

    // 3. Strict data-level validation: filter only truly published items
    const validPublished = ArticleService.filterPublishedArticles(fetchedItems);

    // Evict any non-published or draft items from public caches if returned
    const nonPublicIds = new Set(
      fetchedItems
        .filter((art: any) => art && art.id && !ArticleService.isPublished(art))
        .map((art: any) => art.id)
    );

    if (validPublished.length > 0) {
      // 4. Save to IndexedDB via saveCachedArticlesList and setOfflineData
      saveCachedArticlesList(CACHED_ARTICLES_LIST_KEY, validPublished);
      saveCachedArticlesList(CACHED_EXPLORE_ARTICLES_KEY, validPublished);
      await setOfflineData(CACHED_ARTICLES_LIST_KEY, validPublished);

      // 5. Populate article details store in IndexedDB (and remove non-published items)
      try {
        const existingDetails = (await getOfflineData<Record<string, any>>(CACHED_ARTICLE_DETAILS_KEY)) || {};
        const now = Date.now();
        
        // Remove non-public articles
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
            source: sourceTag
          }
        });
        window.dispatchEvent(customEvent);
      }

      console.log(`[SWR Revalidate] Successfully revalidated ${validPublished.length} articles and updated IndexedDB cache.`);
      return combined;
    } else {
      console.log('[SWR Revalidate] Revalidation yielded no new articles, keeping current cache.');
      return getStalePublishedArticles();
    }
  })().finally(() => {
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

  return {
    count,
    lastSyncTime,
    lastSyncFormatted,
    status: typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'idle'
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


