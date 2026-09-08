import { storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const IDB_NAME = 'asrarhub_media_vault';
const IDB_VERSION = 1;
const IDB_STORE_NAME = 'brand_videos';
const LOADING_VIDEO_KEY = 'custom_loading_video';

/**
 * Open or upgrade the IndexedDB store for large media files
 */
function openMediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available in this browser environment.'));
      return;
    }

    const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
  });
}

/**
 * Stores a video file/blob locally in IndexedDB
 */
export async function storeVideoInIndexedDb(file: Blob | File): Promise<void> {
  try {
    const db = await openMediaDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(IDB_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(IDB_STORE_NAME);
      const putRequest = store.put(file, LOADING_VIDEO_KEY);

      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error || new Error('Failed to store video in IndexedDB'));
    });
  } catch (err) {
    console.warn('[VideoStorage] IndexedDB store warning:', err);
    throw err;
  }
}

/**
 * Retrieves the locally stored video Blob from IndexedDB
 */
export async function getVideoFromIndexedDb(): Promise<Blob | null> {
  try {
    const db = await openMediaDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(IDB_STORE_NAME, 'readonly');
      const store = transaction.objectStore(IDB_STORE_NAME);
      const getRequest = store.get(LOADING_VIDEO_KEY);

      getRequest.onsuccess = () => {
        resolve(getRequest.result || null);
      };
      getRequest.onerror = () => reject(getRequest.error || new Error('Failed to read from IndexedDB'));
    });
  } catch (err) {
    console.warn('[VideoStorage] IndexedDB read warning:', err);
    return null;
  }
}

/**
 * Uploads a video file to Firebase Cloud Storage with upload progress tracking
 * Returns the permanent HTTPS download URL
 */
export function uploadVideoToFirebaseStorage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `branding/videos/${Date.now()}_${sanitizedName}`;
      const storageRef = ref(storage, storagePath);

      const metadata = {
        contentType: file.type || 'video/mp4',
        cacheControl: 'public, max-age=31536000'
      };

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            onProgress?.(progress);
          }
        },
        (error) => {
          console.warn('[VideoStorage] Firebase Storage upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch (urlErr) {
            reject(urlErr);
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Uploads an image or icon to Firebase Cloud Storage and returns a public download URL.
 * Works across all client versions (old and new) without Firestore 1MB limits.
 */
export async function uploadImageToFirebaseStorage(
  file: File | Blob,
  prefix = 'branding/loader'
): Promise<string> {
  const ext = (file as File).name?.split('.').pop() || 'png';
  const cleanName = (file as File).name 
    ? (file as File).name.replace(/[^a-zA-Z0-9.-]/g, '_')
    : `image_${Date.now()}.${ext}`;
  const safePath = `${prefix}/${Date.now()}_${cleanName}`;
  const storageRef = ref(storage, safePath);
  
  const uploadTask = uploadBytesResumable(storageRef, file);
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      () => {},
      (err) => {
        console.warn('[Storage] Image upload to Firebase Storage failed:', err);
        reject(err);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}

/**
 * Check if a field exceeds Firestore's 1MB single property limit
 */
export function isOversizedFirestoreField(val?: string): boolean {
  if (!val) return false;
  // Firestore limit is 1,048,487 bytes. Any string with length > 600,000 characters is unsafe.
  return val.length > 600000;
}
