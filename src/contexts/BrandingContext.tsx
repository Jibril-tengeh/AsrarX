import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export interface AppBranding {
  appLogo?: string; // base64 or url
  loadingScreenImage?: string; // base64 or url
  loadingText?: string;
  loadingAnimationType?: 'pulse' | 'spin' | 'bounce' | 'glow' | 'fade';
  faviconUrl?: string; // base64 or url
  isEnabled?: boolean;
  updatedAt?: number;
  updatedBy?: string;
}

interface BrandingContextType {
  branding: AppBranding;
  isLoading: boolean;
  updateBranding: (newBranding: Partial<AppBranding>, authorEmail?: string) => Promise<void>;
  resetBranding: () => Promise<void>;
}

const LOCAL_STORAGE_KEY = 'asrarhub_custom_branding';

const defaultBranding: AppBranding = {
  appLogo: '',
  loadingScreenImage: '',
  loadingText: 'AsrarHub',
  loadingAnimationType: 'pulse',
  faviconUrl: '',
  isEnabled: true,
  updatedAt: 0,
  updatedBy: ''
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

function getInitialBranding(): AppBranding {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      return { ...defaultBranding, ...JSON.parse(cached) };
    }
  } catch (e) {
    console.warn('[Branding] Failed to read initial branding from cache', e);
  }
  return defaultBranding;
}

/**
 * Dynamically updates document favicon and apple touch icons
 */
function updateDocumentFavicon(iconUrl?: string) {
  if (!iconUrl || typeof document === 'undefined') return;

  try {
    // Standard icon
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = iconUrl;

    // Apple touch icon
    let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
    if (!appleLink) {
      appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      document.head.appendChild(appleLink);
    }
    appleLink.href = iconUrl;
  } catch (err) {
    console.warn('[Branding] Failed to update dynamic favicon:', err);
  }
}

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<AppBranding>(getInitialBranding);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize dynamic favicon whenever branding updates
  useEffect(() => {
    if (branding.isEnabled) {
      const activeIcon = branding.faviconUrl || branding.appLogo;
      if (activeIcon) {
        updateDocumentFavicon(activeIcon);
      }
    }
  }, [branding.faviconUrl, branding.appLogo, branding.isEnabled]);

  // Firestore Real-time Listener on settings/branding
  useEffect(() => {
    const brandingDocRef = doc(db, 'settings', 'branding');
    
    const unsubscribe = onSnapshot(
      brandingDocRef,
      (snapshot) => {
        setIsLoading(false);
        if (snapshot.exists()) {
          const data = snapshot.data() as AppBranding;
          const merged: AppBranding = {
            ...defaultBranding,
            ...data,
            isEnabled: data.isEnabled !== undefined ? data.isEnabled : true
          };
          setBranding(merged);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            console.warn('[Branding] Failed to cache branding:', e);
          }

          // Emit global custom event for non-react or external handlers
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('app_branding_updated', { detail: merged }));
          }
        } else {
          // If no doc exists, use default
          setBranding(defaultBranding);
        }
      },
      (error) => {
        console.warn('[Branding] Firestore onSnapshot note (using cache/default):', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateBranding = useCallback(async (newBranding: Partial<AppBranding>, authorEmail?: string) => {
    const updated: AppBranding = {
      ...branding,
      ...newBranding,
      updatedAt: Date.now(),
      updatedBy: authorEmail || branding.updatedBy || 'admin'
    };

    // 1. Optimistically update state & local cache for instant UI feedback
    setBranding(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('[Branding] Local cache error:', e);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app_branding_updated', { detail: updated }));
    }

    // 2. Persist to Firestore
    try {
      const brandingDocRef = doc(db, 'settings', 'branding');
      await setDoc(brandingDocRef, updated, { merge: true });
    } catch (firestoreErr) {
      console.error('[Branding] Error saving branding to Firestore:', firestoreErr);
      throw firestoreErr;
    }
  }, [branding]);

  const resetBranding = useCallback(async () => {
    const resetData: AppBranding = {
      appLogo: '',
      loadingScreenImage: '',
      loadingText: 'AsrarHub',
      loadingAnimationType: 'pulse',
      faviconUrl: '',
      isEnabled: true,
      updatedAt: Date.now(),
      updatedBy: 'admin'
    };

    setBranding(resetData);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resetData));
      // Revert favicon to default /favicon.ico
      updateDocumentFavicon('/favicon.ico');
    } catch (e) {}

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app_branding_updated', { detail: resetData }));
    }

    try {
      const brandingDocRef = doc(db, 'settings', 'branding');
      await setDoc(brandingDocRef, resetData, { merge: true });
    } catch (firestoreErr) {
      console.error('[Branding] Error resetting branding on Firestore:', firestoreErr);
      throw firestoreErr;
    }
  }, []);

  return (
    <BrandingContext.Provider value={{ branding, isLoading, updateBranding, resetBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useAppBranding = (): BrandingContextType => {
  const context = useContext(BrandingContext);
  if (!context) {
    return {
      branding: defaultBranding,
      isLoading: false,
      updateBranding: async () => {},
      resetBranding: async () => {}
    };
  }
  return context;
};
