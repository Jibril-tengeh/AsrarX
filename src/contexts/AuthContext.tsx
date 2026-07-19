import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, signOut } from '../lib/firebase';
import { AsrarHubLoader } from '../components/AsrarHubLoader';

const parseUserAgent = (ua: string) => {
  let os = 'Inconnu';
  let browser = 'Inconnu';
  let deviceType = 'desktop';

  // Device Type
  if (/mobi/i.test(ua)) {
    deviceType = 'mobile';
  } else if (/ipad|tablet/i.test(ua)) {
    deviceType = 'tablet';
  }

  // OS
  if (/windows/i.test(ua)) {
    os = 'Windows';
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = 'macOS';
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    os = 'iOS';
  } else if (/android/i.test(ua)) {
    os = 'Android';
  } else if (/linux/i.test(ua)) {
    os = 'Linux';
  }

  // Browser
  if (/chrome|crios/i.test(ua) && !/edge|edg/i.test(ua) && !/opr/i.test(ua)) {
    browser = 'Chrome';
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua) && !/chromium/i.test(ua)) {
    browser = 'Safari';
  } else if (/firefox|fxios/i.test(ua)) {
    browser = 'Firefox';
  } else if (/edge|edg/i.test(ua)) {
    browser = 'Edge';
  } else if (/opr/i.test(ua) || /opera/i.test(ua)) {
    browser = 'Opera';
  }

  return { os, browser, deviceType };
};

interface UserData {
  uid: string;
  email: string | null;
  name: string | null;
  role: string;
  isBanned: boolean;
  mysteryToolsDisabled: boolean;
  blockedTools?: string[];
  isTrusted: boolean;
  emailVerified: boolean;
  photoURL?: string | null;
  coverPhotoURL?: string | null;
  spiritualPoints?: number;
  lastDailyRewardDate?: string;
  subscriptionTier?: 'free' | 'premium' | 'pro';
  hideAds?: boolean;
  streakDays?: number;
  purchasedItems?: string[];
  country?: string;
  phone?: string;
  pushNotificationsEnabled?: boolean;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;
    let unsubscribeSession: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }
      if (unsubscribeSession) {
        unsubscribeSession();
        unsubscribeSession = null;
      }

      if (firebaseUser) {
        // Enforce email verification (unless we want to allow unverified access to some parts,
        // but for now, we include it in the user object so UI can react)
        
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        // --- Track Active Session ---
        let sessionId = localStorage.getItem('asrarhub_session_id');
        if (!sessionId) {
          sessionId = 'sess_' + Math.random().toString(36).substring(2, 11);
          localStorage.setItem('asrarhub_session_id', sessionId);
        }

        const sessionRef = doc(db, 'users', firebaseUser.uid, 'sessions', sessionId);
        const { os, browser, deviceType } = parseUserAgent(navigator.userAgent);
        
        setDoc(sessionRef, {
          id: sessionId,
          userAgent: navigator.userAgent,
          os,
          browser,
          deviceType,
          lastActive: new Date().toISOString(),
          ip: 'Client Direct'
        }, { merge: true }).then(() => {
          unsubscribeSession = onSnapshot(sessionRef, (sessSnap) => {
            if (!sessSnap.exists()) {
              signOut().then(() => {
                localStorage.removeItem('asrarhub_session_id');
              });
            }
          }, (err) => {
            console.warn("AuthContext sessions onSnapshot error (operating offline):", err);
          });
        }).catch(err => console.error("Error writing session:", err));
        // ----------------------------

        // Auto-promote to admin in DB if email matches
        const adminEmails = ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'];
        if (firebaseUser.email && adminEmails.includes(firebaseUser.email.toLowerCase())) {
          getDoc(userRef).then(async (snap) => {
             if (snap.exists() && snap.data().role !== 'admin') {
                try {
                  const { updateDoc } = await import('firebase/firestore');
                  await updateDoc(userRef, { role: 'admin' });
                } catch (e) { console.error("Auto-promote update error:", e) }
             } else if (!snap.exists()) {
                try {
                  const { setDoc } = await import('firebase/firestore');
                  await setDoc(userRef, { email: firebaseUser.email, role: 'admin', createdAt: new Date() });
                } catch (e) { console.error("Auto-promote set error:", e) }
             }
          }).catch(e => {
            console.warn("Auto-promote getDoc error (operating offline):", e);
          });
        }
        
        // Listen to user document changes to update role/ban status in real-time
        unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          let currentRole = 'user';
          if (docSnap.exists()) {
            currentRole = docSnap.data().role || 'user';
          }
          const adminEmailsList = ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'];
          if (firebaseUser.email && adminEmailsList.includes(firebaseUser.email.toLowerCase())) {
             currentRole = 'admin';
          }
          if (docSnap.exists()) {
            const data = docSnap.data();
            let subTier = data.subscriptionTier || 'free';
            if (subTier === 'premium' && data.premiumUntil) {
              const now = new Date();
              const expiry = data.premiumUntil.toDate ? data.premiumUntil.toDate() : new Date(data.premiumUntil);
              if (now > expiry) {
                subTier = 'free';
                // Optionally could update the document here, but at least we reflect it in state
              }
            }

             setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: data.name || firebaseUser.displayName || null,
              role: currentRole,
              isBanned: data.isBanned || false,
              mysteryToolsDisabled: data.mysteryToolsDisabled || false,
              blockedTools: data.blockedTools || [],
              isTrusted: data.isTrusted || false,
              emailVerified: firebaseUser.emailVerified,
              photoURL: data.photoURL || firebaseUser.photoURL || null,
              coverPhotoURL: data.coverPhotoURL || null,
              spiritualPoints: data.spiritualPoints || 0,
              lastDailyRewardDate: data.lastDailyRewardDate,
              subscriptionTier: subTier,
              hideAds: data.hideAds || false,
              streakDays: data.streakDays || 0,
              purchasedItems: data.purchasedItems || [],
              country: data.country || '',
              phone: data.phone || '',
              pushNotificationsEnabled: data.pushNotificationsEnabled !== undefined ? data.pushNotificationsEnabled : false
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              role: currentRole,
              isBanned: false,
              mysteryToolsDisabled: false,
              blockedTools: [],
              isTrusted: false,
              emailVerified: firebaseUser.emailVerified,
              photoURL: firebaseUser.photoURL || null,
              coverPhotoURL: null,
              spiritualPoints: 0,
              subscriptionTier: 'free',
              hideAds: false,
              streakDays: 0,
              purchasedItems: [],
              country: '',
              phone: '',
              pushNotificationsEnabled: false
            });
          }
          setLoading(false);
        }, (error) => {
          console.error("AuthContext userRef onSnapshot error:", error);
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }
      if (unsubscribeSession) {
        unsubscribeSession();
      }
      unsubscribeAuth();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? <AsrarHubLoader size="fullscreen" /> : children}
    </AuthContext.Provider>
  );
};
