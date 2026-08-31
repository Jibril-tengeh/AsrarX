// Offline App Manager for AsrarHub
// Manages complete offline pre-caching of assets, tools, articles, and PWA installation

import { DEFAULT_OFFLINE_TOOLS, saveToolToOfflineVault, getAllOfflineTools, formatStorageBytes } from './offlineToolsVault';
import { getAllOfflineSecrets, saveSecretToOfflineVault } from './secretOfflineVault';
import { getAsrarItems } from '../data/store';
import { INITIAL_DEFAULT_ARTICLES } from '../data/defaultArticles';

export interface OfflineAppStatus {
  isFullySaved: boolean;
  savedAt: number | null;
  cachedToolsCount: number;
  cachedArticlesCount: number;
  storageUsageBytes: number;
  storageQuotaBytes: number;
  storageUsageMB: string;
  hasPwaInstallPrompt: boolean;
  isPwaInstalled: boolean;
}

export interface SaveAppProgressCallback {
  (progress: number, stepMessage: string): void;
}

const OFFLINE_APP_KEY = 'asrarhub_offline_app_saved_meta';
const CORE_CACHE_NAME = 'asrarhub-offline-core-v1';

// Deferred prompt for PWA installation
let deferredPwaPrompt: any = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
    window.dispatchEvent(new CustomEvent('asrarhub_pwa_install_available'));
  });

  window.addEventListener('appinstalled', () => {
    deferredPwaPrompt = null;
    localStorage.setItem('asrarhub_pwa_installed', 'true');
    window.dispatchEvent(new CustomEvent('asrarhub_pwa_installed'));
  });
}

/**
 * Check whether PWA install prompt is currently available
 */
export function isPwaInstallAvailable(): boolean {
  return !!deferredPwaPrompt;
}

/**
 * Check if app is running in standalone PWA mode
 */
export function isRunningStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://') ||
    localStorage.getItem('asrarhub_pwa_installed') === 'true'
  );
}

/**
 * Trigger PWA installation prompt
 */
export async function promptPwaInstall(): Promise<boolean> {
  if (!deferredPwaPrompt) {
    return false;
  }
  try {
    deferredPwaPrompt.prompt();
    const { outcome } = await deferredPwaPrompt.userChoice;
    if (outcome === 'accepted') {
      deferredPwaPrompt = null;
      return true;
    }
    return false;
  } catch (err) {
    console.warn('PWA install error:', err);
    return false;
  }
}

/**
 * Get the current offline status and storage metrics
 */
export async function getOfflineAppStatus(): Promise<OfflineAppStatus> {
  let isFullySaved = false;
  let savedAt: number | null = null;

  try {
    const metaStr = localStorage.getItem(OFFLINE_APP_KEY);
    if (metaStr) {
      const meta = JSON.parse(metaStr);
      isFullySaved = !!meta.isSaved;
      savedAt = meta.savedAt || null;
    }
  } catch (e) {}

  let cachedToolsCount = 0;
  let cachedArticlesCount = 0;

  try {
    const [storedTools, storedSecrets] = await Promise.all([
      getAllOfflineTools(),
      getAllOfflineSecrets()
    ]);
    cachedToolsCount = storedTools.length;
    cachedArticlesCount = storedSecrets.length;
  } catch (e) {}

  let storageUsageBytes = 0;
  let storageQuotaBytes = 0;

  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      storageUsageBytes = estimate.usage || 0;
      storageQuotaBytes = estimate.quota || 0;
    } catch (e) {}
  }

  const storageUsageMB = (storageUsageBytes / (1024 * 1024)).toFixed(1);

  return {
    isFullySaved,
    savedAt,
    cachedToolsCount,
    cachedArticlesCount,
    storageUsageBytes,
    storageQuotaBytes,
    storageUsageMB,
    hasPwaInstallPrompt: !!deferredPwaPrompt,
    isPwaInstalled: isRunningStandalone(),
  };
}

/**
 * Core critical URLs to pre-cache in Cache Storage for instant offline navigation
 */
const CRITICAL_OFFLINE_ROUTES = [
  '/',
  '/user/dashboard',
  '/explore',
  '/journal',
  '/saved',
  '/tools',
  '/profile',
  '/tools/abjad',
  '/tools/99names',
  '/tools/istikhara',
  '/tools/quran',
  '/tools/wafq',
  '/tools/falak',
  '/tools/tasbih',
  '/tools/ruqyah',
  '/tools/celestial',
  '/tools/muraqabah',
  '/tools/lunar-phases',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
];

/**
 * Save and pre-cache the entire application for complete offline use
 */
export async function saveEntireAppForOffline(
  onProgress?: SaveAppProgressCallback
): Promise<{
  success: boolean;
  cachedAssets: number;
  cachedTools: number;
  cachedArticles: number;
  estimatedSizeMB: string;
}> {
  let cachedAssetsCount = 0;
  let cachedToolsCount = 0;
  let cachedArticlesCount = 0;

  // Helper for progress notification
  const notify = (prog: number, msg: string) => {
    if (onProgress) {
      try {
        onProgress(Math.min(100, Math.max(0, Math.round(prog))), msg);
      } catch (e) {}
    }
  };

  try {
    notify(5, "Initialisation de la sauvegarde hors-ligne...");

    // 1. Service Worker & Cache Storage precaching
    if (typeof window !== 'undefined' && 'caches' in window) {
      notify(15, "Mise en cache des pages et scripts de l'application...");
      try {
        const cache = await caches.open(CORE_CACHE_NAME);
        for (let i = 0; i < CRITICAL_OFFLINE_ROUTES.length; i++) {
          const route = CRITICAL_OFFLINE_ROUTES[i];
          try {
            const resp = await fetch(route, { cache: 'no-cache' });
            if (resp && resp.ok) {
              await cache.put(route, resp.clone());
              cachedAssetsCount++;
            }
          } catch (fetchErr) {
            // Non-critical if individual dev sub-path is missing
          }
          const subProgress = 15 + Math.round(((i + 1) / CRITICAL_OFFLINE_ROUTES.length) * 20);
          notify(subProgress, `Mise en cache : ${route}`);
        }
      } catch (cacheErr) {
        console.warn("Cache API precaching notice:", cacheErr);
      }
    }

    notify(38, "Enregistrement de tous les outils spirituels (IndexedDB)...");

    // 2. Pre-cache all spiritual tools into IndexedDB
    try {
      const allToolsToCache = [...DEFAULT_OFFLINE_TOOLS];
      for (let i = 0; i < allToolsToCache.length; i++) {
        const tool = allToolsToCache[i];
        await saveToolToOfflineVault({
          ...tool,
          isOfflineReady: true,
          savedAt: Date.now()
        });
        cachedToolsCount++;
        const toolProgress = 38 + Math.round(((i + 1) / allToolsToCache.length) * 25);
        notify(toolProgress, `Outil pré-chargé : ${tool.title}`);
      }
    } catch (toolsErr) {
      console.warn("Offline tools vault error:", toolsErr);
    }

    notify(65, "Sauvegarde des secrets, versets et articles spirituels...");

    // 3. Pre-cache default articles and store items into Offline Vault
    try {
      const defaultArts = INITIAL_DEFAULT_ARTICLES || [];
      const storeItems = getAsrarItems() || [];
      const combinedItems = [...defaultArts, ...storeItems];
      const seenIds = new Set<string>();

      for (let i = 0; i < combinedItems.length; i++) {
        const art = combinedItems[i] as any;
        if (!art || !art.id || seenIds.has(art.id)) continue;
        seenIds.add(art.id);

        await saveSecretToOfflineVault({
          id: String(art.id),
          title: art.title || 'Secret AsrarHub',
          content: art.content || art.description || '',
          category: art.category || 'General',
          author: art.author || 'AsrarHub',
          savedAt: Date.now(),
          tags: art.tags || [],
          isFavorite: false,
          notes: 'Sauvegardé automatiquement pour utilisation hors-ligne'
        });
        cachedArticlesCount++;

        if (i % 5 === 0 || i === combinedItems.length - 1) {
          const artProgress = 65 + Math.round(((i + 1) / combinedItems.length) * 20);
          notify(artProgress, `Secret enregistré : ${art.title?.substring(0, 24) || 'Article'}...`);
        }
      }
    } catch (artErr) {
      console.warn("Offline articles save error:", artErr);
    }

    notify(88, "Vérification et optimisation du stockage persistant...");

    // 4. Request persistent storage permission if supported
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      try {
        const isPersisted = await navigator.storage.persist();
        console.log("Storage persistence granted:", isPersisted);
      } catch (e) {}
    }

    // 5. Store metadata in localStorage
    const metaToSave = {
      isSaved: true,
      savedAt: Date.now(),
      version: '1.1.1',
      toolsCount: cachedToolsCount,
      articlesCount: cachedArticlesCount,
    };
    localStorage.setItem(OFFLINE_APP_KEY, JSON.stringify(metaToSave));
    localStorage.setItem('asrarhub_offline_ready', 'true');

    // Notify event listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('asrarhub_offline_app_saved', { detail: metaToSave }));
    }

    notify(100, "Application sauvegardée avec succès pour une utilisation 100% hors-ligne !");

    const status = await getOfflineAppStatus();

    return {
      success: true,
      cachedAssets: cachedAssetsCount,
      cachedTools: cachedToolsCount,
      cachedArticles: cachedArticlesCount,
      estimatedSizeMB: status.storageUsageMB,
    };
  } catch (err: any) {
    console.error("Failed to save entire app for offline:", err);
    notify(100, "Erreur lors de la sauvegarde.");
    return {
      success: false,
      cachedAssets: cachedAssetsCount,
      cachedTools: cachedToolsCount,
      cachedArticles: cachedArticlesCount,
      estimatedSizeMB: '0.0',
    };
  }
}

/**
 * Clear all offline application caches
 */
export async function clearAllOfflineAppCache(): Promise<boolean> {
  try {
    // 1. Clear Cache Storage
    if (typeof window !== 'undefined' && 'caches' in window) {
      const keys = await caches.keys();
      for (const k of keys) {
        if (k.includes('asrarhub') || k.includes('pages-cache')) {
          await caches.delete(k);
        }
      }
    }

    // 2. Clear meta
    localStorage.removeItem(OFFLINE_APP_KEY);
    localStorage.removeItem('asrarhub_offline_ready');

    // Notify
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('asrarhub_offline_app_cleared'));
    }
    return true;
  } catch (err) {
    console.error("Error clearing offline app cache:", err);
    return false;
  }
}
