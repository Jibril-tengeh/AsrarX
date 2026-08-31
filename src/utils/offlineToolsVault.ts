// IndexedDB Offline Vault for Spiritual Tools in AsrarHub
// Enables complete offline caching and instant offline access to AsrarHub tools.

export interface OfflineStoredTool {
  id: string;
  title: string;
  title_fr?: string;
  title_en?: string;
  title_ha?: string;
  description: string;
  description_fr?: string;
  description_en?: string;
  description_ha?: string;
  path: string;
  iconName?: string;
  color?: string;
  level?: 'simple' | 'advanced';
  isOfflineReady: boolean;
  savedAt: number;
  sizeBytes?: number;
  notes?: string;
}

const DB_NAME = 'asrarhub_tools_vault';
const DB_VERSION = 1;
const STORE_NAME = 'offline_tools';
const TOOLS_META_KEY = 'asrar_offline_tools_meta';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not supported in this environment'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          dbPromise = null;
          reject(request.error || new Error('Failed to open IndexedDB tools vault'));
        };
      } catch (e) {
        dbPromise = null;
        reject(e);
      }
    });
  }

  return dbPromise;
}

function updateToolsMetaCache(list: { id: string; title: string; path: string; savedAt: number }[]) {
  try {
    localStorage.setItem(TOOLS_META_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('asrarhub_offline_content_sync', { detail: { type: 'tools', list } }));
  } catch (e) {}
}

/**
 * Top default offline-capable spiritual tools in AsrarHub
 */
export const DEFAULT_OFFLINE_TOOLS: OfflineStoredTool[] = [
  {
    id: 'abjad',
    title: 'Moteur Abjad & Rūḥāniyya Master',
    title_fr: 'Moteur Abjad & Rūḥāniyya Master',
    title_en: 'Abjad Engine & Spiritual Master',
    title_ha: 'Injin Lissafin Abjad',
    description: 'Double système Abjad (Oriental & Maghrébin), anatomie élémentaire et calculs de poids mystique sans connexion.',
    description_fr: 'Double système Abjad (Oriental & Maghrébin), anatomie élémentaire et calculs de poids mystique sans connexion.',
    description_en: 'Dual Abjad system (Eastern & Western), elemental anatomy, and mystic gematria calculations offline.',
    description_ha: 'Tsarin Abjad guda biyu da lissafin asrar ba tare da intanet ba.',
    path: '/tools/abjad',
    iconName: 'Calculator',
    color: 'from-blue-600 via-indigo-600 to-purple-700',
    level: 'simple',
    isOfflineReady: true,
    savedAt: Date.now(),
    sizeBytes: 15400,
  },
  {
    id: '99names',
    title: "Les 99 Noms d'Allah (Asma al-Husna)",
    title_fr: "Les 99 Noms d'Allah (Asma al-Husna)",
    title_en: 'The 99 Divine Names of Allah',
    title_ha: 'Sunayen Allah 99 Masu Albarka',
    description: 'Catalogue complet des 99 Noms Sublimes avec valeurs numériques, vertus et secrets de récitation.',
    description_fr: 'Catalogue complet des 99 Noms Sublimes avec valeurs numériques, vertus et secrets de récitation.',
    description_en: 'Complete catalogue of the 99 Sublime Names with numerical values and recitation secrets.',
    description_ha: 'Cikakken kundin sunayen Allah 99 tare da lissafin adadinsu.',
    path: '/tools/99names',
    iconName: 'ListTodo',
    color: 'from-cyan-500 to-blue-600',
    level: 'simple',
    isOfflineReady: true,
    savedAt: Date.now(),
    sizeBytes: 28600,
  },
  {
    id: 'tasbih',
    title: 'Tasbih Virtuel & Chapelet Numérique',
    title_fr: 'Tasbih Virtuel & Chapelet Numérique',
    title_en: 'Virtual Tasbih & Digital Rosary',
    title_ha: 'Tasbaha ta Dijital',
    description: 'Compteur de zikr intelligent avec vibration haptique, paliers personnalisés et historique local.',
    description_fr: 'Compteur de zikr intelligent avec vibration haptique, paliers personnalisés et historique local.',
    description_en: 'Smart Dhikr counter with haptic feedback, customizable targets, and local history.',
    description_ha: 'Kayan lissafin ambaton Allah mai aiki koda babu intanet.',
    path: '/tools/tasbih',
    iconName: 'Activity',
    color: 'from-emerald-500 to-teal-600',
    level: 'simple',
    isOfflineReady: true,
    savedAt: Date.now(),
    sizeBytes: 12200,
  },
  {
    id: 'planetary',
    title: 'Heures Planétaires & Demeures Lunaires',
    title_fr: 'Heures Planétaires & Demeures Lunaires',
    title_en: 'Planetary Hours & Lunar Mansions',
    title_ha: 'Sa’o’in Falaki da Matsugunan Wata',
    description: 'Calculateur astronomique autonome (Sā‘āt Zamaniyyah) et 28 Demeures de la Lune.',
    description_fr: 'Calculateur astronomique autonome (Sā‘āt Zamaniyyah) et 28 Demeures de la Lune.',
    description_en: 'Astronomical planetary hours calculator and 28 Lunar Mansions.',
    description_ha: 'Kayan lissafin lokutan falaki da manazil al-qamar.',
    path: '/tools/planetary',
    iconName: 'Clock',
    color: 'from-amber-500 via-orange-600 to-indigo-700',
    level: 'simple',
    isOfflineReady: true,
    savedAt: Date.now(),
    sizeBytes: 34500,
  },
  {
    id: 'seals-catalogue',
    title: 'Catalogue des Sceaux & Khawatim',
    title_fr: 'Catalogue des Sceaux & Khawatim',
    title_en: 'Sacred Seals & Khawatim Catalogue',
    title_ha: 'Kundin Hatimai da Khatam',
    description: '17 Sceaux lunaires, diagrammes sacrés et figures géométriques protégées.',
    description_fr: '17 Sceaux lunaires, diagrammes sacrés et figures géométriques protégées.',
    description_en: '17 Lunar seals, sacred diagrams, and protected geometric figures.',
    description_ha: 'Hatimai 17 da zane-zanen asrar masu tsarki.',
    path: '/tools/seals-catalogue',
    iconName: 'Moon',
    color: 'from-amber-500 to-purple-600',
    level: 'advanced',
    isOfflineReady: true,
    savedAt: Date.now(),
    sizeBytes: 42000,
  },
  {
    id: 'lunar-cycles',
    title: 'Calculateur de Cycles & Phases Lunaires',
    title_fr: 'Calculateur de Cycles & Phases Lunaires',
    title_en: 'Lunar Cycles & Moon Phases Calculator',
    title_ha: 'Lissafin Zagayowar Wata',
    description: 'Éphémérides complètes, phases de nouvelle lune et pleine lune calculées localement.',
    description_fr: 'Éphémérides complètes, phases de nouvelle lune et pleine lune calculées localement.',
    description_en: 'Full ephemeris, new moon, and full moon phases calculated offline.',
    description_ha: 'Hasken wata da lokutan dacewa na ruhaniya.',
    path: '/tools/lunar-cycles',
    iconName: 'Compass',
    color: 'from-indigo-600 to-purple-800',
    level: 'advanced',
    isOfflineReady: true,
    savedAt: Date.now(),
    sizeBytes: 19800,
  },
  {
    id: 'istikhara',
    title: 'Consultation Mystique & Istikhara',
    title_fr: 'Consultation Mystique & Istikhara',
    title_en: 'Mystical Consultation & Istikhara',
    title_ha: 'Istihara da Neman Zaɓin Alheri',
    description: 'Calculs de compatibilité de projets, Noms et prédictions spirituelles selon la tradition.',
    description_fr: 'Calculs de compatibilité de projets, Noms et prédictions spirituelles selon la tradition.',
    description_en: 'Project compatibility calculations and spiritual discernment based on tradition.',
    description_ha: 'Lissafin dacewar ayyuka da neman jagora.',
    path: '/tools/istikhara',
    iconName: 'Sparkles',
    color: 'from-emerald-600 to-teal-800',
    level: 'simple',
    isOfflineReady: true,
    savedAt: Date.now(),
    sizeBytes: 24300,
  },
  {
    id: 'advanced-raml-processing',
    title: 'Traitement Avancé de Raml (Géomancie)',
    title_fr: 'Traitement Avancé de Raml (Géomancie)',
    title_en: 'Advanced Raml (Geomancy) Processing',
    title_ha: 'Kayan Aikin Ramli na Musamman',
    description: 'Sceau concentrique de Sable (Khatam al-Raml), Heure de Tracé et Analyse des 16 maisons.',
    description_fr: 'Sceau concentrique de Sable (Khatam al-Raml), Heure de Tracé et Analyse des 16 maisons.',
    description_en: 'Concentric Sand Seal (Khatam al-Raml), generation time, and 16 houses analysis.',
    description_ha: 'Zana da nazarin gidajen ramli 16 koda ba a kan layi ba.',
    path: '/tools/advanced-raml-processing',
    iconName: 'Compass',
    color: 'from-amber-600 via-yellow-600 to-stone-800',
    level: 'advanced',
    isOfflineReady: true,
    savedAt: Date.now(),
    sizeBytes: 31000,
  }
];

/**
 * Initializes default offline tools into IndexedDB if empty
 */
export async function ensureDefaultOfflineTools(): Promise<OfflineStoredTool[]> {
  try {
    const list = await getAllOfflineTools();
    if (list.length === 0) {
      for (const tool of DEFAULT_OFFLINE_TOOLS) {
        await saveToolToOfflineVault(tool);
      }
      return await getAllOfflineTools();
    }
    return list;
  } catch (e) {
    console.warn('[ToolsOfflineVault] Error ensuring default tools:', e);
    return DEFAULT_OFFLINE_TOOLS;
  }
}

/**
 * Saves or updates a tool in the IndexedDB offline vault
 */
export async function saveToolToOfflineVault(tool: Partial<OfflineStoredTool> & { id: string; title: string; path: string }): Promise<boolean> {
  if (!tool || !tool.id) return false;

  try {
    const approxSize = new Blob([JSON.stringify(tool)]).size;
    const record: OfflineStoredTool = {
      id: String(tool.id),
      title: tool.title,
      title_fr: tool.title_fr || tool.title,
      title_en: tool.title_en,
      title_ha: tool.title_ha,
      description: tool.description || '',
      description_fr: tool.description_fr || tool.description,
      description_en: tool.description_en,
      description_ha: tool.description_ha,
      path: tool.path,
      iconName: tool.iconName || 'Sparkles',
      color: tool.color || 'from-emerald-600 to-teal-800',
      level: tool.level || 'simple',
      isOfflineReady: true,
      savedAt: Date.now(),
      sizeBytes: approxSize,
      notes: tool.notes || '',
    };

    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    const all = await getAllOfflineTools();
    const meta = all.map(t => ({ id: t.id, title: t.title, path: t.path, savedAt: t.savedAt }));
    updateToolsMetaCache(meta);

    return true;
  } catch (error) {
    console.error('[ToolsOfflineVault] Error saving tool offline:', error);
    return false;
  }
}

/**
 * Gets all saved tools from IndexedDB
 */
export async function getAllOfflineTools(): Promise<OfflineStoredTool[]> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const list: OfflineStoredTool[] = req.result || [];
        list.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn('[ToolsOfflineVault] Error getting offline tools:', error);
    return [];
  }
}

/**
 * Removes a tool from the IndexedDB offline vault
 */
export async function removeToolFromOfflineVault(id: string): Promise<boolean> {
  if (!id) return false;

  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(String(id));
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    const all = await getAllOfflineTools();
    const meta = all.map(t => ({ id: t.id, title: t.title, path: t.path, savedAt: t.savedAt }));
    updateToolsMetaCache(meta);

    return true;
  } catch (error) {
    console.error('[ToolsOfflineVault] Error removing tool offline:', error);
    return false;
  }
}

/**
 * Checks if a specific tool is saved in the offline vault
 */
export async function isToolSavedOffline(id: string): Promise<boolean> {
  if (!id) return false;
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(String(id));
      req.onsuccess = () => resolve(!!req.result);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return false;
  }
}

/**
 * Clears all tools from IndexedDB
 */
export async function clearAllOfflineTools(): Promise<boolean> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    updateToolsMetaCache([]);
    return true;
  } catch (error) {
    console.error('[ToolsOfflineVault] Error clearing offline tools:', error);
    return false;
  }
}

/**
 * Formats bytes into clean human readable string (Ko, Mo)
 */
export function formatStorageBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 Ko';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
}
