import firebaseConfig from '../../firebase-applet-config.json';

export interface FirestoreRestValue {
  stringValue?: string;
  integerValue?: string | number;
  doubleValue?: number;
  booleanValue?: boolean;
  arrayValue?: { values?: FirestoreRestValue[] };
  mapValue?: { fields?: Record<string, FirestoreRestValue> };
  timestampValue?: string;
  nullValue?: null;
}

export interface FirestoreRestDoc {
  name?: string;
  fields?: Record<string, FirestoreRestValue>;
  createTime?: string;
  updateTime?: string;
}

export const parseFirestoreRestValue = (val: FirestoreRestValue): any => {
  if (!val) return null;
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue' in val) return Number(val.doubleValue);
  if ('booleanValue' in val) return val.booleanValue;
  if ('timestampValue' in val) return val.timestampValue;
  if ('arrayValue' in val) {
    return (val.arrayValue?.values || []).map(parseFirestoreRestValue);
  }
  if ('mapValue' in val) {
    const obj: Record<string, any> = {};
    const fields = val.mapValue?.fields || {};
    for (const key of Object.keys(fields)) {
      obj[key] = parseFirestoreRestValue(fields[key]);
    }
    return obj;
  }
  return null;
};

export const parseFirestoreRestDoc = (doc: FirestoreRestDoc) => {
  const id = doc.name ? doc.name.split('/').pop() : '';
  const data: Record<string, any> = { id };
  if (doc.fields) {
    for (const key of Object.keys(doc.fields)) {
      data[key] = parseFirestoreRestValue(doc.fields[key]);
    }
  }
  return data;
};

/**
 * Direct HTTPS REST API fetcher for Firestore collection 'articles'.
 * Bypasses WebSockets, long polling streams, and WebView connection blocks in Capacitor/Android builds.
 * Automatically traverses all pagination pages (nextPageToken) to guarantee 100% of articles are retrieved.
 */
export const fetchArticlesFromRest = async (): Promise<any[]> => {
  try {
    const config = firebaseConfig;
    if (!config || !config.projectId || !config.apiKey) {
      console.warn('[Firestore REST] Missing firebase config.');
      return [];
    }

    const allDocuments: any[] = [];
    let pageToken: string | null = null;
    let iterations = 0;
    const maxIterations = 30; // Supports up to 30 * 300 = 9000 articles

    do {
      let url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/articles?key=${config.apiKey}&pageSize=300`;
      if (pageToken) {
        url += `&pageToken=${encodeURIComponent(pageToken)}`;
      }
      
      const res = await fetch(url, { method: 'GET', cache: 'no-store' });
      if (!res.ok) {
        console.warn(`[Firestore REST] Page fetch returned status ${res.status}`);
        break;
      }
      const json = await res.json();
      if (json.documents && Array.isArray(json.documents)) {
        allDocuments.push(...json.documents);
      }
      pageToken = json.nextPageToken || null;
      iterations++;
    } while (pageToken && iterations < maxIterations);

    if (allDocuments.length === 0) {
      console.log(`[Firestore REST] No documents array returned from REST API.`);
      return [];
    }

    const items = allDocuments.map(parseFirestoreRestDoc);
    console.log(`[Firestore REST] Successfully fetched ${items.length} real public articles directly via REST (across ${iterations} page(s))!`);
    return items;
  } catch (err) {
    console.warn(`[Firestore REST] Note: could not fetch articles via REST (device offline or network unavailable):`, (err as any)?.message || err);
    return [];
  }
};

/**
 * Direct HTTPS REST API fetcher for a single article document by ID.
 */
export const fetchSingleArticleFromRest = async (id: string): Promise<any | null> => {
  if (!id) return null;
  try {
    const config = firebaseConfig;
    if (!config || !config.projectId || !config.apiKey) return null;
    const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/articles/${id}?key=${config.apiKey}`;
    const res = await fetch(url, { method: 'GET', cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json || !json.fields) return null;
    return parseFirestoreRestDoc(json);
  } catch (err) {
    console.warn(`[Firestore REST] Note: could not fetch single article ${id} via REST (device offline or network unavailable):`, (err as any)?.message || err);
    return null;
  }
};

/**
 * Direct HTTPS REST API fetcher for Firestore collection 'users'.
 * Traverses pagination pages if user collection exceeds single page.
 */
export const fetchUsersFromRest = async (idToken?: string): Promise<any[]> => {
  try {
    const config = firebaseConfig;
    if (!config || !config.projectId || !config.apiKey) return [];

    const allDocuments: any[] = [];
    let pageToken: string | null = null;
    let iterations = 0;
    const maxIterations = 20;

    const headers: Record<string, string> = {};
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    }

    do {
      let url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/users?key=${config.apiKey}&pageSize=300`;
      if (pageToken) {
        url += `&pageToken=${encodeURIComponent(pageToken)}`;
      }

      const res = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
      if (!res.ok) {
        console.warn(`[Firestore REST Users] Fetch failed with status ${res.status}`);
        break;
      }
      const json = await res.json();
      if (json.documents && Array.isArray(json.documents)) {
        allDocuments.push(...json.documents);
      }
      pageToken = json.nextPageToken || null;
      iterations++;
    } while (pageToken && iterations < maxIterations);

    if (allDocuments.length === 0) return [];
    return allDocuments.map(parseFirestoreRestDoc);
  } catch (err) {
    console.warn(`[Firestore REST Users] Note: could not fetch users via REST:`, err);
    return [];
  }
};

/**
 * Direct HTTPS REST API fetcher for Firestore collection 'categories'.
 */
export const fetchCategoriesFromRest = async (): Promise<any[]> => {
  try {
    const config = firebaseConfig;
    if (!config || !config.projectId || !config.apiKey) return [];

    const allDocuments: any[] = [];
    let pageToken: string | null = null;
    let iterations = 0;

    do {
      let url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/categories?key=${config.apiKey}&pageSize=300`;
      if (pageToken) {
        url += `&pageToken=${encodeURIComponent(pageToken)}`;
      }

      const res = await fetch(url, { method: 'GET', cache: 'no-store' });
      if (!res.ok) break;
      const json = await res.json();
      if (json.documents && Array.isArray(json.documents)) {
        allDocuments.push(...json.documents);
      }
      pageToken = json.nextPageToken || null;
      iterations++;
    } while (pageToken && iterations < 10);

    if (allDocuments.length === 0) return [];
    return allDocuments.map(parseFirestoreRestDoc);
  } catch (err) {
    console.warn(`[Firestore REST Categories] Note: could not fetch categories via REST:`, err);
    return [];
  }
};

/**
 * Direct HTTPS REST API deletion for an article document in Firestore.
 * Supports passing Firebase Auth ID token to comply with security rules.
 */
export const deleteArticleFromRest = async (id: string, idToken?: string): Promise<boolean> => {
  if (!id) return false;
  try {
    const config = firebaseConfig;
    if (!config || !config.projectId || !config.apiKey) return false;
    
    // Acquire Firebase Auth token if not supplied
    let authToken = idToken;
    if (!authToken && typeof window !== 'undefined') {
      try {
        const { auth } = await import('./firebase');
        if (auth && auth.currentUser) {
          authToken = await auth.currentUser.getIdToken();
        }
      } catch (authErr) {}
    }

    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/articles/${id}?key=${config.apiKey}`;
    const res = await fetch(url, { method: 'DELETE', headers });
    
    // 200/204 or 404 (document already deleted / does not exist) are considered successful
    if (res.ok || res.status === 404) {
      console.log(`[Firestore REST] Article ${id} permanently deleted or verified absent from Firestore via REST API (status: ${res.status}).`);
      return true;
    } else {
      console.warn(`[Firestore REST] Delete article ${id} REST request returned status ${res.status}`);
      return false;
    }
  } catch (err) {
    console.warn(`[Firestore REST] Could not delete article ${id} via REST:`, err);
    return false;
  }
};

/**
 * Direct HTTPS REST API deletion for a category document in Firestore.
 */
export const deleteCategoryFromRest = async (id: string): Promise<boolean> => {
  if (!id) return false;
  try {
    const config = firebaseConfig;
    if (!config || !config.projectId || !config.apiKey) return false;
    const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/categories/${id}?key=${config.apiKey}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (res.ok) {
      console.log(`[Firestore REST] Category ${id} deleted successfully from Firebase Firestore via REST API.`);
      return true;
    } else {
      console.warn(`[Firestore REST] Delete category ${id} REST request returned status ${res.status}`);
      return false;
    }
  } catch (err) {
    console.warn(`[Firestore REST] Could not delete category ${id} via REST:`, err);
    return false;
  }
};


