import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, onSnapshot } from 'firebase/firestore';
import { APP_VERSION_CONFIG, VersionRelease } from '../config/appVersion';
import { clearAllArticlesCache } from '../lib/swrArticleCache';

export const APP_VERSION_STORAGE_KEY = 'asrarhub_installed_app_version';
export const APP_VERSION_DISMISSED_UPDATE_KEY = 'asrarhub_dismissed_update_version';

export interface FirestoreVersionDoc {
  id?: string;
  version: string;
  versionCode: number;
  releaseDate: string;
  releaseDateEn?: string;
  releaseDateHa?: string;
  title: string;
  titleEn?: string;
  titleHa?: string;
  isCurrent?: boolean;
  disabled?: boolean;
  forceUpdate?: boolean;
  disableVideoCard?: boolean;
  videoCardTheme?: any;
  minSupportedVersionCode?: number;
  downloadUrl?: string;
  apkDownloadUrl?: string;
  highlights: string[];
  highlightsEn?: string[];
  highlightsHa?: string[];
  type?: 'major' | 'minor' | 'patch';
  author?: string;
  createdAt?: any;
  updatedAt?: any;
}

class AppVersionService {
  private cachedReleases: VersionRelease[] = APP_VERSION_CONFIG.releases;

  /**
   * Returns current active dynamic version from Vite define or config
   */
  getCurrentVersion(): string {
    if (typeof __APP_VERSION__ !== 'undefined' && __APP_VERSION__) {
      return __APP_VERSION__;
    }
    return APP_VERSION_CONFIG.currentVersion;
  }

  getCurrentVersionCode(): number {
    return APP_VERSION_CONFIG.currentVersionCode;
  }

  /**
   * Check if the user has upgraded from a previous version
   */
  checkVersionUpgrade(): {
    isNewVersion: boolean;
    previousVersion: string | null;
    currentVersion: string;
  } {
    const current = this.getCurrentVersion();
    const stored = localStorage.getItem(APP_VERSION_STORAGE_KEY);

    if (!stored) {
      // First install or upgrade from unversioned
      return {
        isNewVersion: true,
        previousVersion: null,
        currentVersion: current
      };
    }

    if (stored !== current) {
      return {
        isNewVersion: true,
        previousVersion: stored,
        currentVersion: current
      };
    }

    return {
      isNewVersion: false,
      previousVersion: stored,
      currentVersion: current
    };
  }

  /**
   * Save the current version into local storage once acknowledged/upgraded
   */
  markVersionInstalled(version?: string) {
    const ver = version || this.getCurrentVersion();
    localStorage.setItem(APP_VERSION_STORAGE_KEY, ver);
  }

  /**
   * Cleans all caches (SWR, IndexedDB, CacheStorage, ServiceWorker) to prevent
   * stale assets and database schema mismatches across versions.
   */
  async flushAndUpgradeCaches(onProgress?: (step: string) => void): Promise<boolean> {
    try {
      if (onProgress) onProgress("Nettoyage du cache d'articles SWR...");
      try {
        await clearAllArticlesCache();
      } catch (e) {
        console.warn("Failed clearing SWR cache:", e);
      }

      if (onProgress) onProgress("Purge des Service Workers...");
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
          }
        } catch (e) {
          console.warn("ServiceWorker unregister error:", e);
        }
      }

      if (onProgress) onProgress("Nettoyage des ressources réseau en cache...");
      if ('caches' in window) {
        try {
          const keys = await caches.keys();
          for (const key of keys) {
            await caches.delete(key);
          }
        } catch (e) {
          console.warn("Caches delete error:", e);
        }
      }

      // Mark current version as installed
      this.markVersionInstalled();

      if (onProgress) onProgress("Actualisation terminée avec succès !");
      return true;
    } catch (err) {
      console.error("Error during flushAndUpgradeCaches:", err);
      this.markVersionInstalled();
      return false;
    }
  }

  /**
   * Parse Firestore raw document into typed VersionRelease
   */
  private parseDocToRelease(docId: string, data: FirestoreVersionDoc): VersionRelease {
    return {
      id: docId,
      version: data.version || docId.replace(/_/g, '.'),
      versionCode: Number(data.versionCode) || 1,
      releaseDate: data.releaseDate || '2026',
      releaseDateEn: data.releaseDateEn || data.releaseDate,
      releaseDateHa: data.releaseDateHa || data.releaseDate,
      title: data.title || `Version ${data.version || docId}`,
      titleEn: data.titleEn || data.title,
      titleHa: data.titleHa || data.title,
      isCurrent: data.isCurrent ?? (data.version === this.getCurrentVersion()),
      disabled: data.disabled === true,
      forceUpdate: !!data.forceUpdate,
      disableVideoCard: !!data.disableVideoCard,
      videoCardTheme: data.videoCardTheme || undefined,
      minSupportedVersionCode: data.minSupportedVersionCode ? Number(data.minSupportedVersionCode) : undefined,
      downloadUrl: data.downloadUrl || undefined,
      apkDownloadUrl: data.apkDownloadUrl || undefined,
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      highlightsEn: Array.isArray(data.highlightsEn) ? data.highlightsEn : undefined,
      highlightsHa: Array.isArray(data.highlightsHa) ? data.highlightsHa : undefined,
      type: data.type || 'minor',
      author: data.author,
      updatedAt: data.updatedAt
    };
  }

  /**
   * Fetch all release changelogs from Firestore `app_versions` collection
   * @param includeDisabled If false, filters out disabled/hidden releases for public views
   */
  async fetchReleases(includeDisabled = false): Promise<VersionRelease[]> {
    try {
      const q = query(collection(db, 'app_versions'));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const firestoreReleases: VersionRelease[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as FirestoreVersionDoc;
          const release = this.parseDocToRelease(docSnap.id, data);
          if (includeDisabled || !release.disabled) {
            firestoreReleases.push(release);
          }
        });

        // Sort descending by versionCode or version
        firestoreReleases.sort((a, b) => b.versionCode - a.versionCode);
        this.cachedReleases = firestoreReleases;
        return firestoreReleases;
      }
    } catch (err) {
      console.warn("Could not fetch app_versions from Firestore, using local defaults:", err);
    }

    const defaults = APP_VERSION_CONFIG.releases;
    return includeDisabled ? defaults : defaults.filter(r => !r.disabled);
  }

  /**
   * Subscribe to real-time updates from `app_versions`
   * @param callback Called with updated array of VersionRelease
   * @param includeDisabled If false, filters out disabled releases
   */
  subscribeReleases(callback: (releases: VersionRelease[]) => void, includeDisabled = false): () => void {
    try {
      const q = query(collection(db, 'app_versions'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: VersionRelease[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as FirestoreVersionDoc;
              const release = this.parseDocToRelease(docSnap.id, data);
              if (includeDisabled || !release.disabled) {
                list.push(release);
              }
            });
            list.sort((a, b) => b.versionCode - a.versionCode);
            this.cachedReleases = list;
            callback(list);
          } else {
            const defaults = APP_VERSION_CONFIG.releases;
            callback(includeDisabled ? defaults : defaults.filter(r => !r.disabled));
          }
        },
        (error) => {
          console.warn("app_versions snapshot error, fallback to static:", error);
          const defaults = APP_VERSION_CONFIG.releases;
          callback(includeDisabled ? defaults : defaults.filter(r => !r.disabled));
        }
      );
      return unsubscribe;
    } catch (e) {
      console.warn("subscribeReleases error:", e);
      const defaults = APP_VERSION_CONFIG.releases;
      callback(includeDisabled ? defaults : defaults.filter(r => !r.disabled));
      return () => {};
    }
  }

  /**
   * Save or update an app version in Firestore
   */
  async saveVersion(release: Partial<VersionRelease> & { version: string }): Promise<boolean> {
    try {
      const docId = (release.id || release.version).replace(/\./g, '_');
      const docRef = doc(db, 'app_versions', docId);

      const payload: Record<string, any> = {
        version: release.version,
        versionCode: Number(release.versionCode) || 1,
        releaseDate: release.releaseDate || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        title: release.title || `Version ${release.version}`,
        type: release.type || 'minor',
        highlights: Array.isArray(release.highlights) ? release.highlights : [],
        disabled: !!release.disabled,
        isCurrent: !!release.isCurrent,
        forceUpdate: !!release.forceUpdate,
        disableVideoCard: !!release.disableVideoCard,
        updatedAt: new Date().toISOString()
      };

      if (release.videoCardTheme) payload.videoCardTheme = release.videoCardTheme;
      if (release.minSupportedVersionCode !== undefined) payload.minSupportedVersionCode = Number(release.minSupportedVersionCode);
      if (release.downloadUrl) payload.downloadUrl = release.downloadUrl;
      if (release.apkDownloadUrl) payload.apkDownloadUrl = release.apkDownloadUrl;
      if (release.releaseDateEn) payload.releaseDateEn = release.releaseDateEn;
      if (release.releaseDateHa) payload.releaseDateHa = release.releaseDateHa;
      if (release.titleEn) payload.titleEn = release.titleEn;
      if (release.titleHa) payload.titleHa = release.titleHa;
      if (release.highlightsEn) payload.highlightsEn = release.highlightsEn;
      if (release.highlightsHa) payload.highlightsHa = release.highlightsHa;
      if (release.author) payload.author = release.author;

      await setDoc(docRef, payload, { merge: true });
      return true;
    } catch (err) {
      console.error("Error saving version to Firestore:", err);
      throw err;
    }
  }

  /**
   * Quick toggle disableVideoCard status of a version
   */
  async toggleVideoCardDisabled(versionOrId: string, disableVideoCard: boolean): Promise<boolean> {
    try {
      const docId = versionOrId.replace(/\./g, '_');
      const docRef = doc(db, 'app_versions', docId);
      await updateDoc(docRef, {
        disableVideoCard: disableVideoCard,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.error("Error toggling version disableVideoCard state:", err);
      try {
        const docId = versionOrId.replace(/\./g, '_');
        const docRef = doc(db, 'app_versions', docId);
        await setDoc(docRef, {
          version: versionOrId,
          disableVideoCard: disableVideoCard,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        return true;
      } catch (innerErr) {
        throw innerErr;
      }
    }
  }

  /**
   * Quick toggle disabled status of a version
   */
  async toggleVersionDisabled(versionOrId: string, disabled: boolean): Promise<boolean> {
    try {
      const docId = versionOrId.replace(/\./g, '_');
      const docRef = doc(db, 'app_versions', docId);
      await updateDoc(docRef, {
        disabled: disabled,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.error("Error toggling version disabled state:", err);
      // Try setDoc with merge in case doc doesn't exist yet
      try {
        const docId = versionOrId.replace(/\./g, '_');
        const docRef = doc(db, 'app_versions', docId);
        await setDoc(docRef, {
          version: versionOrId,
          disabled: disabled,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        return true;
      } catch (innerErr) {
        throw innerErr;
      }
    }
  }

  /**
   * Delete a version document from Firestore
   */
  async deleteVersion(versionOrId: string): Promise<boolean> {
    try {
      const docId = versionOrId.replace(/\./g, '_');
      const docRef = doc(db, 'app_versions', docId);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error("Error deleting version from Firestore:", err);
      throw err;
    }
  }

  /**
   * Seed / Sync local version config to Firestore `app_versions`
   */
  async seedFirestoreVersions(forceOverwrite = false): Promise<void> {
    for (const rel of APP_VERSION_CONFIG.releases) {
      try {
        const docId = rel.version.replace(/\./g, '_');
        const docRef = doc(db, 'app_versions', docId);
        await setDoc(docRef, {
          version: rel.version,
          versionCode: rel.versionCode,
          releaseDate: rel.releaseDate,
          releaseDateEn: rel.releaseDateEn || rel.releaseDate,
          releaseDateHa: rel.releaseDateHa || rel.releaseDate,
          title: rel.title,
          titleEn: rel.titleEn || rel.title,
          titleHa: rel.titleHa || rel.title,
          isCurrent: rel.isCurrent ?? false,
          disabled: rel.disabled ?? false,
          highlights: rel.highlights,
          highlightsEn: rel.highlightsEn || rel.highlights,
          highlightsHa: rel.highlightsHa || rel.highlights,
          type: rel.type,
          updatedAt: new Date().toISOString()
        }, { merge: !forceOverwrite });
      } catch (err) {
        console.warn(`Error seeding version ${rel.version}:`, err);
      }
    }
  }
}

export const appVersionService = new AppVersionService();
