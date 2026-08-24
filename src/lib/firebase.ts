import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { 
  getAuth, 
  setPersistence,
  browserLocalPersistence,
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
  persistentSingleTabManager,
  memoryLocalCache,
  enableNetwork,
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
import { isDisposableEmail, isGmailAddress, hasGmailPlusAlias, normalizeEmail, normalizePhone, validateRegistrationDetails } from './validationUtils';
import { getTrialDurationHours, isNewUserPremiumEnabled } from '../utils/trialConfig';

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('[Auth Persistence] Defaulting persistence:', err);
  });
}
export const storage = getStorage(app);

// Initialize Firestore safely with robust caching:
// In web browsers and iframe preview environments, memoryLocalCache avoids internal Firestore assertion crashes
// (such as ID: c050 / b815 / ca9 TargetState stream target mismatches) caused by stale IndexedDB multi-tab locks.
// In native Capacitor mobile apps (Android APK/AAB), persistentMultipleTabManager provides stable offline caching.
const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
const isCapacitorNative = typeof window !== 'undefined' && (
  !!(window as any)?.Capacitor?.isNativePlatform?.() ||
  window.location.protocol === 'capacitor:'
);

const initFirestore = () => {
  if (typeof window === 'undefined') {
    return getFirestore(app);
  }

  // In true native mobile app (Capacitor native platform), use persistent multi-tab cache
  if (isCapacitorNative && !isInIframe) {
    try {
      return initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    } catch (err1) {
      console.warn('[Firestore] Falling back to memoryLocalCache in Capacitor:', err1);
    }
  }

  // In web browsers / iframe sandboxes / mobile browsers, use memoryLocalCache for reliable session performance
  try {
    return initializeFirestore(app, {
      localCache: memoryLocalCache()
    });
  } catch (err2) {
    try {
      return getFirestore(app);
    } catch (err3) {
      console.warn('[Firestore] Initialization fallback note:', err3);
      return getFirestore(app);
    }
  }
};

export const db = initFirestore();

// Auto-run diagnostics and network listeners safely
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[Network Monitor] Device status changed: ONLINE.');
  });

  window.addEventListener('offline', () => {
    console.warn('[Network Monitor] Device status changed: OFFLINE.');
  });

  if (isCapacitorNative || process.env.NODE_ENV === 'development') {
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
        const validation = await validateRegistrationDetails(user.email || '', '', db);
        if (!validation.valid) {
          await firebaseSignOut(auth).catch(() => {});
          throw new Error(validation.error || "Création de compte refusée par les règles d'email et d'alias.");
        }

        const normEmail = normalizeEmail(user.email || '');
        const now = new Date();
        const creationTime = user.metadata?.creationTime ? new Date(user.metadata.creationTime).getTime() : 0;
        const isTrulyNewAccount = creationTime > 0 && (now.getTime() - creationTime < 5 * 60 * 1000);
        const isPremEnabled = isTrulyNewAccount && isNewUserPremiumEnabled();
        const trialHours = getTrialDurationHours();
        const trialExpiry = new Date(now.getTime() + trialHours * 60 * 60 * 1000);
        await setDoc(userRef, {
          email: user.email,
          normalizedEmail: normEmail,
          name: user.displayName,
          role: 'user',
          isBanned: false,
          mysteryToolsDisabled: false,
          isTrusted: false,
          createdAt: user.metadata?.creationTime || now.toISOString(),
          subscriptionTier: isPremEnabled ? 'premium' : 'free',
          freeTrialActivated: isPremEnabled,
          freeTrialActivatedAt: isPremEnabled ? now.toISOString() : null,
          freeTrialExpiresAt: isPremEnabled ? trialExpiry.toISOString() : null,
          premiumUntil: isPremEnabled ? trialExpiry.toISOString() : null,
          hasSeenTrialPopup: !isPremEnabled
        });
      }
    }
    return result;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, name: string, country?: string, phone?: string, referralCode?: string) => {
  // Validate registration eligibility first
  const validation = await validateRegistrationDetails(email, phone || '', db);
  if (!validation.valid) {
    throw new Error(validation.error || 'Informations d\'inscription invalides.');
  }

  let result;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    if (err?.code === 'auth/network-request-failed' || err?.message?.includes('network')) {
      // Retry once after brief pause
      await new Promise(r => setTimeout(r, 600));
      result = await createUserWithEmailAndPassword(auth, email, password);
    } else {
      throw err;
    }
  }
  
  if (result.user) {
    // ⚡ Trigger verification email INSTANTLY without blocking UI or doc creation
    sendVerificationEmail(result.user).catch((e) => {
      console.warn("Instant email verification trigger notification:", e);
    });

    const now = new Date();
    const isPremEnabled = isNewUserPremiumEnabled();
    const trialHours = getTrialDurationHours();
    const trialExpiry = new Date(now.getTime() + trialHours * 60 * 60 * 1000);

    const normEmail = normalizeEmail(result.user.email || email);
    const normPhone = normalizePhone(phone || '');
    const cleanUid = result.user.uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const userReferralCode = `ASRAR-${cleanUid.length >= 6 ? cleanUid.substring(0, 6) : cleanUid.padEnd(6, '7')}`;

    const userRef = doc(db, 'users', result.user.uid);
    await setDoc(userRef, {
      email: result.user.email,
      normalizedEmail: normEmail,
      name: name,
      country: country || '',
      phone: phone || '',
      normalizedPhone: normPhone,
      role: 'user',
      isBanned: false,
      mysteryToolsDisabled: false,
      isTrusted: false,
      createdAt: now,
      subscriptionTier: isPremEnabled ? 'premium' : 'free',
      freeTrialActivated: isPremEnabled,
      freeTrialActivatedAt: isPremEnabled ? now.toISOString() : null,
      freeTrialExpiresAt: isPremEnabled ? trialExpiry.toISOString() : null,
      premiumUntil: isPremEnabled ? trialExpiry.toISOString() : null,
      hasSeenTrialPopup: false,
      requiresValidation: true,
      referralCode: userReferralCode,
      referralCount: 0,
      spiritualPoints: 100
    });

    updateProfile(result.user, { displayName: name }).catch(() => {});
  }
  
  return result;
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    if (err?.code === 'auth/network-request-failed' || err?.message?.includes('network')) {
      // Retry once after brief pause
      await new Promise(r => setTimeout(r, 600));
      return await signInWithEmailAndPassword(auth, email, password);
    }
    throw err;
  }
};

export const sendVerificationEmail = async (user: User) => {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const isValidOrigin = origin.startsWith('http://') || origin.startsWith('https://');
    if (isValidOrigin && !origin.includes('localhost') && !origin.includes('127.0.0.1') && !origin.includes('capacitor')) {
      await firebaseSendEmailVerification(user, {
        url: origin,
        handleCodeInApp: false,
      });
    } else {
      await firebaseSendEmailVerification(user);
    }
  } catch (err) {
    console.warn("sendVerificationEmail with custom origin failed, retrying default:", err);
    await firebaseSendEmailVerification(user);
  }
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

