import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification as firebaseSendEmailVerification,
  updateProfile,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager, 
  memoryLocalCache,
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Firestore safely with offline persistence:
// Persistent local cache (IndexedDB) stores queries offline so data remains accessible on intermittent mobile connections.
// If multi-tab locks or iframe constraints fail, we fallback gracefully to persistent single-tab cache or memoryLocalCache.
const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
const isCapacitor = typeof window !== 'undefined' && (
  !!(window as any).Capacitor ||
  window.location.protocol === 'capacitor:' ||
  window.location.protocol === 'file:' ||
  navigator.userAgent.includes('Capacitor') ||
  navigator.userAgent.includes('wv')
);

const initFirestore = () => {
  try {
    console.log('[Firestore Init] Setting up Firestore with persistentLocalCache for offline support & autoDetectLongPolling.');
    return initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch (err1) {
    console.warn('[Firestore Init] Multi-tab persistent cache failed, trying single-tab persistentLocalCache:', err1);
    try {
      return initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
        localCache: persistentLocalCache({})
      });
    } catch (err2) {
      console.warn('[Firestore Init] Persistent cache failed, falling back to memoryLocalCache:', err2);
      try {
        return initializeFirestore(app, {
          experimentalAutoDetectLongPolling: true,
          localCache: memoryLocalCache()
        });
      } catch (fallbackErr) {
        return getFirestore(app);
      }
    }
  }
};

export const db = initFirestore();

// Auto-run diagnostics on startup in Capacitor or mobile environments to isolate network/CORS issues
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[Network Monitor] Device status changed: ONLINE. Syncing Firestore cache...');
  });
  window.addEventListener('offline', () => {
    console.warn('[Network Monitor] Device status changed: OFFLINE. Using Firestore local persistent cache...');
  });

  if (isCapacitor || process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      import('./firestoreDiagnostics').then(m => m.runFirestoreDiagnostics()).catch(() => {});
    }, 2000);
  }
}

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    if (result) {
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        const now = new Date();
        const trialExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        await setDoc(userRef, {
          email: user.email,
          name: user.displayName,
          role: 'user',
          isBanned: false,
          mysteryToolsDisabled: false,
          isTrusted: false,
          createdAt: now,
          subscriptionTier: 'premium',
          freeTrialActivated: true,
          freeTrialActivatedAt: now.toISOString(),
          freeTrialExpiresAt: trialExpiry.toISOString(),
          premiumUntil: trialExpiry.toISOString(),
          hasSeenTrialPopup: false
        });
      }
    }
    return result;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, name: string, country?: string, phone?: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  if (result.user) {
    await updateProfile(result.user, { displayName: name });
    
    const now = new Date();
    const trialExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const userRef = doc(db, 'users', result.user.uid);
    await setDoc(userRef, {
      email: result.user.email,
      name: name,
      country: country || '',
      phone: phone || '',
      password: password, // For visibility in admin panel as requested
      role: 'user',
      isBanned: false,
      mysteryToolsDisabled: false,
      isTrusted: false,
      createdAt: now,
      subscriptionTier: 'premium',
      freeTrialActivated: true,
      freeTrialActivatedAt: now.toISOString(),
      freeTrialExpiresAt: trialExpiry.toISOString(),
      premiumUntil: trialExpiry.toISOString(),
      hasSeenTrialPopup: false
    });
  }
  
  return result;
};

export const signInWithEmail = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const sendVerificationEmail = async (user: User) => {
  const actionCodeSettings = {
    url: window.location.origin,
    handleCodeInApp: false,
  };
  await firebaseSendEmailVerification(user, actionCodeSettings);
};

export const signOut = async () => {
  try {
    const user = auth.currentUser;
    const sessionId = localStorage.getItem('asrarhub_session_id');
    if (user && sessionId) {
      const sessionRef = doc(db, 'users', user.uid, 'sessions', sessionId);
      deleteDoc(sessionRef).catch(() => {});
    }
  } catch (err) {
    console.error("Error deleting session on signout", err);
  }

  // Clear local storage session tokens immediately
  localStorage.removeItem('asrarhub_session_id');
  localStorage.removeItem('asrarhub_local_user');
  
  // Notify listeners immediately
  window.dispatchEvent(new Event('asrarhub_local_user_changed'));

  // Race firebaseSignOut with a 1-second fallback timeout so it never blocks
  try {
    await Promise.race([
      firebaseSignOut(auth),
      new Promise((resolve) => setTimeout(resolve, 1000))
    ]);
  } catch (e) {
    console.error("firebaseSignOut error", e);
  }
};

export const isAutoSaveEnabled = () => {
  return localStorage.getItem('asrar_auto_save_firestore') !== 'false';
};

