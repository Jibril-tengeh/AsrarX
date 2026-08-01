import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, signOut } from '../lib/firebase';
import { AsrarHubLoader } from '../components/AsrarHubLoader';
import { getTrialDurationHours } from '../utils/trialConfig';

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
  premiumUntil?: any;
  freeTrialActivated?: boolean;
  freeTrialActivatedAt?: string;
  freeTrialExpiresAt?: string;
  hasSeenTrialPopup?: boolean;
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
  isPremium: boolean;
  isTrialActive: boolean;
  trialTimeLeftMs: number;
  activate24hTrial: () => Promise<void>;
  markTrialPopupSeen: () => void;
  showTrialPopup: boolean;
  setShowTrialPopup: (show: boolean) => void;
}

export const checkIsPremium = (user: UserData | null): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  const adminEmails = ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'];
  if (user.email && adminEmails.includes(user.email.toLowerCase())) return true;
  
  if (user.subscriptionTier === 'premium' || user.subscriptionTier === 'pro') {
    if (user.premiumUntil) {
      const now = new Date();
      const expiry = typeof user.premiumUntil === 'object' && user.premiumUntil.toDate 
        ? user.premiumUntil.toDate() 
        : new Date(user.premiumUntil);
      if (now > expiry) {
        return false;
      }
    }
    return true;
  }
  return false;
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const setLocalUserSession = (email: string, name?: string, country?: string, phone?: string): UserData => {
  const adminEmails = ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'];
  const normalizedEmail = (email || 'user@asrarhub.com').trim().toLowerCase();
  const isAdmin = adminEmails.includes(normalizedEmail);
  const role = isAdmin ? 'admin' : 'user';
  
  const now = new Date();
  const trialHours = getTrialDurationHours();
  const trialExpiry = new Date(now.getTime() + trialHours * 60 * 60 * 1000);

  const userData: UserData = {
    uid: 'local_' + Math.random().toString(36).substring(2, 10),
    email: normalizedEmail,
    name: name || normalizedEmail.split('@')[0],
    role: role,
    isBanned: false,
    mysteryToolsDisabled: false,
    blockedTools: [],
    isTrusted: true,
    emailVerified: true,
    spiritualPoints: 100,
    subscriptionTier: isAdmin ? 'premium' : 'premium', // 12h free trial on account creation
    premiumUntil: trialExpiry.toISOString(),
    freeTrialActivated: true,
    freeTrialActivatedAt: now.toISOString(),
    freeTrialExpiresAt: trialExpiry.toISOString(),
    hasSeenTrialPopup: false,
    hideAds: false,
    streakDays: 1,
    purchasedItems: [],
    country: country || '',
    phone: phone || '',
    pushNotificationsEnabled: true
  };
  
  localStorage.setItem('asrarhub_local_user', JSON.stringify(userData));

  // Maintain all local registered users list for validation
  try {
    const existingStr = localStorage.getItem('asrarhub_all_local_users');
    const existingList = existingStr ? JSON.parse(existingStr) : [];
    const updatedList = existingList.filter((u: any) => u.email !== normalizedEmail);
    updatedList.push(userData);
    localStorage.setItem('asrarhub_all_local_users', JSON.stringify(updatedList));
  } catch (e) {
    // Ignore storage errors
  }

  window.dispatchEvent(new Event('asrarhub_local_user_changed'));
  return userData;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  isPremium: false,
  isTrialActive: false,
  trialTimeLeftMs: 0,
  activate24hTrial: async () => {},
  markTrialPopupSeen: () => {},
  showTrialPopup: false,
  setShowTrialPopup: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrialPopup, setShowTrialPopup] = useState(false);

  useEffect(() => {
    const getLocalUser = (): UserData | null => {
      try {
        const stored = localStorage.getItem('asrarhub_local_user');
        if (stored) {
          return JSON.parse(stored) as UserData;
        }
      } catch (e) {
        console.warn("Failed to parse local user session", e);
      }
      return null;
    };

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
          // Listen to session doc optional updates without triggering automatic forced signouts
          unsubscribeSession = onSnapshot(sessionRef, (sessSnap) => {
            if (!sessSnap.exists()) {
              // Session doc missing or removed, clean up local key without killing active Firebase auth state
              localStorage.removeItem('asrarhub_session_id');
            }
          }, (err) => {
            console.warn("AuthContext sessions onSnapshot error (operating offline):", err);
          });
        }).catch(err => {
          console.warn("Error writing session (optional feature, continuing):", err);
        });
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
            let premUntil = data.premiumUntil || null;

            if (subTier === 'premium' && premUntil) {
              const now = new Date();
              const expiry = premUntil.toDate ? premUntil.toDate() : new Date(premUntil);
              if (now > expiry) {
                subTier = 'free';
                updateDoc(userRef, { subscriptionTier: 'free' }).catch(() => {});
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
              premiumUntil: premUntil,
              freeTrialActivated: data.freeTrialActivated || false,
              freeTrialActivatedAt: data.freeTrialActivatedAt || null,
              freeTrialExpiresAt: data.freeTrialExpiresAt || null,
              hasSeenTrialPopup: data.hasSeenTrialPopup || false,
              hideAds: data.hideAds || false,
              streakDays: data.streakDays || 0,
              purchasedItems: data.purchasedItems || [],
              country: data.country || '',
              phone: data.phone || '',
              pushNotificationsEnabled: data.pushNotificationsEnabled !== undefined ? data.pushNotificationsEnabled : true
            });
          } else {
            const now = new Date();
            const trialHours = getTrialDurationHours();
            const trialExpiry = new Date(now.getTime() + trialHours * 60 * 60 * 1000);

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
              subscriptionTier: 'premium',
              premiumUntil: trialExpiry.toISOString(),
              freeTrialActivated: true,
              freeTrialActivatedAt: now.toISOString(),
              freeTrialExpiresAt: trialExpiry.toISOString(),
              hasSeenTrialPopup: false,
              hideAds: false,
              streakDays: 0,
              purchasedItems: [],
              country: '',
              phone: '',
              pushNotificationsEnabled: true
            });
          }
          setLoading(false);
        }, (error) => {
          console.error("AuthContext userRef onSnapshot error:", error);
          const local = getLocalUser();
          if (local) setUser(local);
          setLoading(false);
        });
      } else {
        const local = getLocalUser();
        setUser(local);
        setLoading(false);
      }
    });

    const handleLocalUserChange = () => {
      const local = getLocalUser();
      setUser(local);
      setLoading(false);
    };

    window.addEventListener('storage', handleLocalUserChange);
    window.addEventListener('asrarhub_local_user_changed', handleLocalUserChange);

    return () => {
      window.removeEventListener('storage', handleLocalUserChange);
      window.removeEventListener('asrarhub_local_user_changed', handleLocalUserChange);
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }
      if (unsubscribeSession) {
        unsubscribeSession();
      }
      unsubscribeAuth();
    };
  }, []);

  const activate24hTrial = async () => {
    if (!user) return;
    const now = new Date();
    const trialHours = getTrialDurationHours();
    const trialExpiry = new Date(now.getTime() + trialHours * 60 * 60 * 1000);

    const updatedUser: UserData = {
      ...user,
      subscriptionTier: 'premium',
      premiumUntil: trialExpiry.toISOString(),
      freeTrialActivated: true,
      freeTrialActivatedAt: now.toISOString(),
      freeTrialExpiresAt: trialExpiry.toISOString(),
      hasSeenTrialPopup: false
    };

    setUser(updatedUser);
    setShowTrialPopup(true);

    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        subscriptionTier: 'premium',
        premiumUntil: trialExpiry.toISOString(),
        freeTrialActivated: true,
        freeTrialActivatedAt: now.toISOString(),
        freeTrialExpiresAt: trialExpiry.toISOString(),
        hasSeenTrialPopup: false
      }).catch(() => {});
    } else {
      localStorage.setItem('asrarhub_local_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('asrarhub_local_user_changed'));
    }
  };

  const markTrialPopupSeen = () => {
    setShowTrialPopup(false);
    if (!user) return;
    localStorage.setItem(`asrarhub_trial_popup_seen_${user.uid}`, 'true');
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      updateDoc(userRef, { hasSeenTrialPopup: true }).catch(() => {});
    } else {
      const stored = localStorage.getItem('asrarhub_local_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsed.hasSeenTrialPopup = true;
          localStorage.setItem('asrarhub_local_user', JSON.stringify(parsed));
        } catch (e) {}
      }
    }
  };

  // Auto-activate trial or show popup for eligible users
  useEffect(() => {
    if (!user) {
      setShowTrialPopup(false);
      return;
    }

    if (user.role === 'admin') return;

    if (!user.freeTrialActivated) {
      activate24hTrial();
    } else if (!user.hasSeenTrialPopup) {
      const seenLocally = localStorage.getItem(`asrarhub_trial_popup_seen_${user.uid}`);
      if (!seenLocally) {
        setShowTrialPopup(true);
      }
    }
  }, [user?.uid, user?.freeTrialActivated, user?.hasSeenTrialPopup]);

  const getTrialExpiryDate = (): Date | null => {
    if (!user || !user.premiumUntil) return null;
    return typeof user.premiumUntil === 'object' && user.premiumUntil.toDate 
      ? user.premiumUntil.toDate() 
      : new Date(user.premiumUntil);
  };

  const trialExpiryDate = getTrialExpiryDate();
  const nowMs = Date.now();
  const trialTimeLeftMs = trialExpiryDate ? Math.max(0, trialExpiryDate.getTime() - nowMs) : 0;
  const isTrialActive = user?.subscriptionTier === 'premium' && trialTimeLeftMs > 0;
  const isPremium = checkIsPremium(user);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isPremium, 
      isTrialActive, 
      trialTimeLeftMs, 
      activate24hTrial, 
      markTrialPopupSeen, 
      showTrialPopup, 
      setShowTrialPopup 
    }}>
      {loading ? <AsrarHubLoader size="fullscreen" /> : children}
    </AuthContext.Provider>
  );
};
