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
import { getFirestore, initializeFirestore, enableIndexedDbPersistence, doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  ...({ useFetchStreams: false } as any)
});

// Helper to check if IndexedDB is fully functional (especially inside iframes where it can hang)
const checkIndexedDBFunctional = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Skip IndexedDB if not supported
      if (!window.indexedDB) {
        resolve(false);
        return;
      }
      
      // If we are in an iframe, third-party storage is highly likely to be blocked/hang
      if (window.self !== window.top) {
        console.warn("App is running inside an iframe. Skipping IndexedDB persistence to prevent connection hangs.");
        resolve(false);
        return;
      }

      const request = window.indexedDB.open("firestore_persistence_test", 1);
      let resolved = false;
      
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.warn("IndexedDB open timed out. Storage access is likely restricted inside iframe sandbox.");
          resolve(false);
        }
      }, 1000);

      request.onsuccess = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          try {
            request.result.close();
            window.indexedDB.deleteDatabase("firestore_persistence_test");
          } catch (e) {}
          resolve(true);
        }
      };

      request.onerror = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve(false);
        }
      };
    } catch (e) {
      resolve(false);
    }
  });
};

checkIndexedDBFunctional().then((functional) => {
  if (functional) {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code == 'failed-precondition') {
          console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
      } else if (err.code == 'unimplemented') {
          console.warn("The current browser does not support all of the features required to enable persistence");
      }
    });
  }
});

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    if (result) {
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          name: user.displayName,
          role: 'user',
          isBanned: false,
          mysteryToolsDisabled: false,
          isTrusted: false,
          createdAt: new Date()
        });
      }
    }
    return result;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  if (result.user) {
    await updateProfile(result.user, { displayName: name });
    
    const userRef = doc(db, 'users', result.user.uid);
    await setDoc(userRef, {
      email: result.user.email,
      name: name,
      role: 'user',
      isBanned: false,
      mysteryToolsDisabled: false,
      isTrusted: false,
      createdAt: new Date()
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
      await deleteDoc(sessionRef).catch(() => {});
    }
  } catch (err) {
    console.error("Error deleting session on signout", err);
  }
  localStorage.removeItem('asrarhub_session_id');
  return firebaseSignOut(auth);
};

export const isAutoSaveEnabled = () => {
  return localStorage.getItem('asrar_auto_save_firestore') !== 'false';
};

