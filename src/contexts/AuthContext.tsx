import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, signOut, sendVerificationEmail } from '../lib/firebase';
import { AsrarHubLoader } from '../components/AsrarHubLoader';
import { getTrialDurationHours, isNewUserPremiumEnabled } from '../utils/trialConfig';

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
  allToolsDisabled?: boolean;
  blockedTools?: string[];
  allowedTools?: string[];
  toolOverrides?: Record<string, string>;
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
  usedPromoCodes?: string[];
  lastPromoCodeUsed?: string;
  referralCode?: string;
  referralCount?: number;
  referredBy?: string;
  createdAt?: any;
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
  checkEmailVerification: () => Promise<boolean>;
  resendVerificationEmail: () => Promise<void>;
}

export const checkIsPremium = (user: UserData | null): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  const adminEmails = ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'];
  if (user.email && adminEmails.includes(user.email.toLowerCase())) return true;
  
  if (user.subscriptionTier === 'premium' || user.subscriptionTier === 'pro') {
    const rawExpiry = user.premiumUntil || user.freeTrialExpiresAt;
    if (rawExpiry) {
      const now = new Date();
      const expiry = typeof rawExpiry === 'object' && rawExpiry.toDate 
        ? rawExpiry.toDate() 
        : new Date(rawExpiry);
      if (!isNaN(expiry.getTime()) && now > expiry) {
        return false;
      }
    } else if (user.freeTrialActivated) {
      if (user.freeTrialActivatedAt) {
        const start = new Date(user.freeTrialActivatedAt);
        if (!isNaN(start.getTime())) {
          const trialHours = getTrialDurationHours();
          const expiry = new Date(start.getTime() + trialHours * 60 * 60 * 1000);
          if (new Date() > expiry) return false;
        } else {
          return false;
        }
      } else {
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

export const setLocalUserSession = (email: string, name?: string, country?: string, phone?: string, isSignUp: boolean = false): UserData => {
  const adminEmails = ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'];
  const normalizedEmail = (email || 'user@asrarhub.com').trim().toLowerCase();
  const isAdmin = adminEmails.includes(normalizedEmail);
  const role = isAdmin ? 'admin' : 'user';

  let existingUser: UserData | null = null;
  try {
    const existingStr = localStorage.getItem('asrarhub_all_local_users');
    if (existingStr) {
      const list = JSON.parse(existingStr);
      existingUser = list.find((u: any) => u.email === normalizedEmail) || null;
    }
  } catch (e) {}

  const now = new Date();
  const isPremEnabled = isNewUserPremiumEnabled();
  const trialHours = getTrialDurationHours();
  const trialExpiry = new Date(now.getTime() + trialHours * 60 * 60 * 1000);

  let subTier: 'free' | 'premium' = isAdmin ? 'premium' : 'free';
  let trialActivated = false;
  let trialActivatedAt: string | null = null;
  let trialExpiresAt: string | null = null;
  let premUntil: string | null = null;

  if (isAdmin) {
    subTier = 'premium';
  } else if (isSignUp) {
    // Only NEW users receive temporary free trial premium access on sign up IF enabled by admin
    if (isPremEnabled) {
      subTier = 'premium';
      trialActivated = true;
      trialActivatedAt = now.toISOString();
      trialExpiresAt = trialExpiry.toISOString();
      premUntil = trialExpiry.toISOString();
    } else {
      subTier = 'free';
      trialActivated = false;
      trialActivatedAt = null;
      trialExpiresAt = null;
      premUntil = null;
    }
  } else if (existingUser) {
    subTier = (existingUser.subscriptionTier as 'free' | 'premium') || 'free';
    trialActivated = existingUser.freeTrialActivated || false;
    trialActivatedAt = existingUser.freeTrialActivatedAt || null;
    trialExpiresAt = existingUser.freeTrialExpiresAt || null;
    premUntil = existingUser.premiumUntil || null;
  }

  const userData: UserData = {
    uid: existingUser?.uid || ('local_' + Math.random().toString(36).substring(2, 10)),
    email: normalizedEmail,
    name: name || existingUser?.name || normalizedEmail.split('@')[0],
    role: role,
    isBanned: false,
    mysteryToolsDisabled: false,
    blockedTools: [],
    isTrusted: true,
    emailVerified: true,
    spiritualPoints: existingUser?.spiritualPoints || 100,
    subscriptionTier: subTier,
    premiumUntil: premUntil,
    freeTrialActivated: trialActivated,
    freeTrialActivatedAt: trialActivatedAt,
    freeTrialExpiresAt: trialExpiresAt,
    hasSeenTrialPopup: existingUser?.hasSeenTrialPopup || false,
    hideAds: false,
    streakDays: existingUser?.streakDays || 1,
    purchasedItems: existingUser?.purchasedItems || [],
    country: country || existingUser?.country || '',
    phone: phone || existingUser?.phone || '',
    pushNotificationsEnabled: true,
    referralCode: existingUser?.referralCode || `ASRAR-${(existingUser?.uid || Math.random().toString(36).substring(2, 8)).replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 6).padEnd(6, '7')}`,
    referralCount: existingUser?.referralCount || 0
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
  setShowTrialPopup: () => {},
  checkEmailVerification: async () => false,
  resendVerificationEmail: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const initialLocalUser = getLocalUser();
  const [user, setUser] = useState<UserData | null>(initialLocalUser);
  const [loading, setLoading] = useState(!initialLocalUser);
  const [showTrialPopup, setShowTrialPopup] = useState(false);

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
          let resolvedUser: UserData;
          if (docSnap.exists()) {
            const data = docSnap.data();
            let subTier = data.subscriptionTier || 'free';
            let premUntil = data.premiumUntil || data.freeTrialExpiresAt || null;

            if (subTier === 'premium' || subTier === 'pro') {
              const now = new Date();
              if (premUntil) {
                const expiry = typeof premUntil === 'object' && premUntil.toDate ? premUntil.toDate() : new Date(premUntil);
                if (!isNaN(expiry.getTime()) && now > expiry) {
                  subTier = 'free';
                  updateDoc(userRef, { subscriptionTier: 'free' }).catch(() => {});
                }
              } else if (data.freeTrialActivated) {
                if (data.freeTrialActivatedAt) {
                  const start = new Date(data.freeTrialActivatedAt);
                  if (!isNaN(start.getTime())) {
                    const trialHours = getTrialDurationHours();
                    const expiry = new Date(start.getTime() + trialHours * 60 * 60 * 1000);
                    if (now > expiry) {
                      subTier = 'free';
                      updateDoc(userRef, { subscriptionTier: 'free' }).catch(() => {});
                    }
                  } else {
                    subTier = 'free';
                    updateDoc(userRef, { subscriptionTier: 'free' }).catch(() => {});
                  }
                } else {
                  subTier = 'free';
                  updateDoc(userRef, { subscriptionTier: 'free' }).catch(() => {});
                }
              }
            }

            const isPendingNewAccountValidation = data.requiresValidation === true && !firebaseUser.emailVerified && !data.emailVerified;
            const isUserVerified = !isPendingNewAccountValidation;

            resolvedUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: data.name || firebaseUser.displayName || null,
              role: currentRole,
              isBanned: data.isBanned || false,
              mysteryToolsDisabled: data.mysteryToolsDisabled || false,
              blockedTools: data.blockedTools || [],
              isTrusted: data.isTrusted || false,
              emailVerified: isUserVerified,
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
              pushNotificationsEnabled: data.pushNotificationsEnabled !== undefined ? data.pushNotificationsEnabled : true,
              usedPromoCodes: data.usedPromoCodes || [],
              lastPromoCodeUsed: data.lastPromoCodeUsed || null,
              referralCode: data.referralCode || `ASRAR-${firebaseUser.uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 6).padEnd(6, '7')}`,
              referralCount: data.referralCount || 0,
              referredBy: data.referredBy || undefined
            };
          } else {
            const now = new Date();
            // ONLY grant free trial to brand-new accounts (created in Firebase Auth within the last 5 minutes)
            const creationTime = firebaseUser.metadata?.creationTime ? new Date(firebaseUser.metadata.creationTime).getTime() : 0;
            const isTrulyNewAccount = creationTime > 0 && (now.getTime() - creationTime < 5 * 60 * 1000);
            const isPremEnabled = isTrulyNewAccount && isNewUserPremiumEnabled();
            const trialHours = getTrialDurationHours();
            const trialExpiry = new Date(now.getTime() + trialHours * 60 * 60 * 1000);

            resolvedUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Membre AsrarHub'),
              role: currentRole,
              isBanned: false,
              mysteryToolsDisabled: false,
              blockedTools: [],
              isTrusted: true,
              emailVerified: true,
              photoURL: firebaseUser.photoURL || null,
              coverPhotoURL: null,
              spiritualPoints: 100,
              subscriptionTier: isPremEnabled ? 'premium' : 'free',
              premiumUntil: isPremEnabled ? trialExpiry.toISOString() : null,
              freeTrialActivated: isPremEnabled,
              freeTrialActivatedAt: isPremEnabled ? now.toISOString() : null,
              freeTrialExpiresAt: isPremEnabled ? trialExpiry.toISOString() : null,
              hasSeenTrialPopup: !isPremEnabled,
              hideAds: false,
              streakDays: 1,
              purchasedItems: [],
              country: '',
              phone: '',
              pushNotificationsEnabled: true,
              referralCode: `ASRAR-${firebaseUser.uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 6).padEnd(6, '7')}`,
              referralCount: 0
            };

            // Auto-persist user profile to Firestore so admin dashboard sees them!
            setDoc(userRef, {
              email: firebaseUser.email || '',
              name: resolvedUser.name,
              role: currentRole,
              isBanned: false,
              mysteryToolsDisabled: false,
              isTrusted: true,
              createdAt: firebaseUser.metadata?.creationTime || now.toISOString(),
              subscriptionTier: isPremEnabled ? 'premium' : 'free',
              freeTrialActivated: isPremEnabled,
              freeTrialActivatedAt: isPremEnabled ? now.toISOString() : null,
              freeTrialExpiresAt: isPremEnabled ? trialExpiry.toISOString() : null,
              premiumUntil: isPremEnabled ? trialExpiry.toISOString() : null,
              hasSeenTrialPopup: !isPremEnabled,
              requiresValidation: false,
              referralCode: resolvedUser.referralCode,
              referralCount: 0,
              spiritualPoints: 100
            }, { merge: true }).catch(err => console.warn("Auto-persist missing user doc note:", err));
          }

          setUser(resolvedUser);
          try {
            localStorage.setItem('asrarhub_local_user', JSON.stringify(resolvedUser));
          } catch (e) {}
          setLoading(false);
        }, (error) => {
          console.warn("AuthContext userRef onSnapshot error:", error);
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
    
    // Prevent reactivation if trial was already used or activated before
    if (user.freeTrialActivated || user.freeTrialActivatedAt || user.freeTrialExpiresAt) {
      console.warn("Free trial has already been used on this account.");
      return;
    }
    
    // Check if account is too old for trial activation (> 24 hours)
    if (user.createdAt) {
      const created = new Date(user.createdAt).getTime();
      if (!isNaN(created) && (Date.now() - created > 24 * 60 * 60 * 1000)) {
        console.warn("Existing accounts older than 24 hours cannot activate the new user trial.");
        return;
      }
    }

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

  // Show trial popup for newly registered users who haven't seen it yet and whose trial is still active
  useEffect(() => {
    if (!user) {
      setShowTrialPopup(false);
      return;
    }

    if (user.role === 'admin') return;

    if (user.freeTrialActivated && !user.hasSeenTrialPopup && user.subscriptionTier === 'premium') {
      const rawExpiry = user.premiumUntil || user.freeTrialExpiresAt;
      if (rawExpiry) {
        const expiry = typeof rawExpiry === 'object' && (rawExpiry as any).toDate ? (rawExpiry as any).toDate() : new Date(rawExpiry);
        if (!isNaN(expiry.getTime()) && Date.now() >= expiry.getTime()) {
          return;
        }
      }
      const seenLocally = localStorage.getItem(`asrarhub_trial_popup_seen_${user.uid}`);
      if (!seenLocally) {
        setShowTrialPopup(true);
      }
    }
  }, [user?.uid, user?.freeTrialActivated, user?.hasSeenTrialPopup, user?.subscriptionTier, user?.premiumUntil, user?.freeTrialExpiresAt]);

  const getTrialExpiryDate = (): Date | null => {
    if (!user || !user.premiumUntil) return null;
    return typeof user.premiumUntil === 'object' && user.premiumUntil.toDate 
      ? user.premiumUntil.toDate() 
      : new Date(user.premiumUntil);
  };

  const checkEmailVerification = async (): Promise<boolean> => {
    const adminEmails = ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'];
    if (user && (user.role === 'admin' || (user.email && adminEmails.includes(user.email.toLowerCase())))) {
      setUser((prev) => prev ? { ...prev, emailVerified: true } : prev);
      return true;
    }
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const isVerified = auth.currentUser.emailVerified;
      if (isVerified) {
        setUser((prev) => prev ? { ...prev, emailVerified: true } : prev);
      }
      return isVerified;
    }
    return false;
  };

  const resendVerificationEmail = async (): Promise<void> => {
    if (auth.currentUser) {
      await sendVerificationEmail(auth.currentUser);
    } else {
      throw new Error("Aucun utilisateur connecté.");
    }
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
      setShowTrialPopup,
      checkEmailVerification,
      resendVerificationEmail
    }}>
      {loading ? <AsrarHubLoader size="fullscreen" /> : children}
    </AuthContext.Provider>
  );
};
