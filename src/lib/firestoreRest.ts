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
 */
export const fetchArticlesFromRest = async (): Promise<any[]> => {
  try {
    const config = firebaseConfig;
    if (!config || !config.projectId || !config.apiKey) {
      console.warn('[Firestore REST] Missing firebase config.');
      return [];
    }
    const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/articles?key=${config.apiKey}`;
    console.log(`[Firestore REST] Fetching real public articles directly via REST API from: ${url}`);
    
    const res = await fetch(url, { method: 'GET', cache: 'no-store' });
    if (!res.ok) {
      console.warn(`[Firestore REST] Fetch failed with status ${res.status}`);
      return [];
    }
    const json = await res.json();
    if (!json.documents || !Array.isArray(json.documents)) {
      console.log(`[Firestore REST] No documents array returned from REST API.`);
      return [];
    }
    const items = json.documents.map(parseFirestoreRestDoc);
    console.log(`[Firestore REST] Successfully fetched ${items.length} real public articles directly via REST!`);
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
 */
export const fetchUsersFromRest = async (idToken?: string): Promise<any[]> => {
  try {
    const config = firebaseConfig;
    if (!config || !config.projectId || !config.apiKey) return [];
    const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/users?key=${config.apiKey}&pageSize=500`;
    const headers: Record<string, string> = {};
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    }
    const res = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
    if (!res.ok) {
      console.warn(`[Firestore REST Users] Fetch failed with status ${res.status}`);
      return [];
    }
    const json = await res.json();
    if (!json.documents || !Array.isArray(json.documents)) return [];
    return json.documents.map(parseFirestoreRestDoc);
  } catch (err) {
    console.warn(`[Firestore REST Users] Note: could not fetch users via REST:`, err);
    return [];
  }
};

