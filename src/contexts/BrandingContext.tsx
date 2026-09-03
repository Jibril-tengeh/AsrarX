import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export interface AppBranding {
  appLogo?: string; // base64 or url (horizontal header logo)
  appIcon?: string; // base64 or url (square 1:1 icon for PWA, mobile home screen, app badge)
  loadingScreenType?: 'image' | 'video'; // 'image' or 'video' (default: 'image')
  loadingScreenImage?: string; // base64 or url
  loadingScreenVideo?: string; // base64, url, or path like /videos/loading.mp4
  loadingScreenEnabled?: boolean; // toggle to enable/disable loading screen completely (default: true)
  showLoadingImage?: boolean; // toggle to show or hide the central image/video in loader (default: true)
  loadingVideoAutoplay?: boolean; // autoplay video (default: true)
  loadingVideoLoop?: boolean; // loop video or play once (default: false)
  loadingVideoMuted?: boolean; // muted for browser autoplay (default: true)
  loadingVideoCanSkip?: boolean; // display skip button (default: true)
  loadingVideoFit?: 'cover' | 'contain'; // video scaling mode (default: 'contain')
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
  appIcon: '',
  loadingScreenType: 'image',
  loadingScreenImage: '',
  loadingScreenVideo: '/videos/loading.mp4',
  loadingScreenEnabled: true,
  showLoadingImage: true,
  loadingVideoAutoplay: true,
  loadingVideoLoop: false,
  loadingVideoMuted: true,
  loadingVideoCanSkip: true,
  loadingVideoFit: 'contain',
  loadingText: 'AsrarHub',
  loadingAnimationType: 'pulse',
  faviconUrl: '',
  isEnabled: true,
  updatedAt: 0,
  updatedBy: ''
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

/**
 * Ensures no property exceeds Firestore's 1MB single-field ceiling (1,048,487 bytes)
 */
function sanitizeBrandingForFirestore(data: AppBranding): AppBranding {
  const sanitized: AppBranding = { ...data };
  const MAX_SAFE_FIELD_LEN = 500000; // ~500KB safe ceiling

  if (sanitized.loadingScreenVideo && sanitized.loadingScreenVideo.length > MAX_SAFE_FIELD_LEN) {
    console.warn('[Branding] loadingScreenVideo data URL was oversized for Firestore (>500KB). Sanitized to fallback path.');
    sanitized.loadingScreenVideo = '/videos/loading.mp4';
  }

  if (sanitized.loadingScreenImage && sanitized.loadingScreenImage.length > MAX_SAFE_FIELD_LEN) {
    console.warn('[Branding] loadingScreenImage was oversized for Firestore (>500KB). Sanitized.');
    sanitized.loadingScreenImage = '';
  }

  if (sanitized.appLogo && sanitized.appLogo.length > MAX_SAFE_FIELD_LEN) {
    sanitized.appLogo = '';
  }

  if (sanitized.appIcon && sanitized.appIcon.length > MAX_SAFE_FIELD_LEN) {
    sanitized.appIcon = '';
  }

  return sanitized;
}

function getInitialBranding(): AppBranding {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Clean up any stale oversized video string from cache
      if (parsed.loadingScreenVideo && parsed.loadingScreenVideo.length > 500000) {
        parsed.loadingScreenVideo = '/videos/loading.mp4';
      }
      return { ...defaultBranding, ...parsed };
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

  // Synchronize dynamic favicon & PWA icon whenever branding updates
  useEffect(() => {
    if (branding.isEnabled) {
      const activeIcon = branding.appIcon || branding.faviconUrl || branding.appLogo;
      if (activeIcon) {
        updateDocumentFavicon(activeIcon);
      }
    }
  }, [branding.appIcon, branding.faviconUrl, branding.appLogo, branding.isEnabled]);

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
    let cleanNewBranding = { ...newBranding };
    // If incoming payload has an oversized loadingScreenVideo dataUrl, prevent memory blowout
    if (cleanNewBranding.loadingScreenVideo && cleanNewBranding.loadingScreenVideo.length > 500000) {
      console.warn('[Branding] Oversized loadingScreenVideo detected in updateBranding. Cleaned to safe fallback.');
      cleanNewBranding.loadingScreenVideo = '/videos/loading.mp4';
    }

    const updated: AppBranding = {
      ...branding,
      ...cleanNewBranding,
      updatedAt: Date.now(),
      updatedBy: authorEmail || branding.updatedBy || 'admin'
    };

    // Guarantee current branding does not carry an oversized video string
    if (updated.loadingScreenVideo && updated.loadingScreenVideo.length > 500000) {
      updated.loadingScreenVideo = '/videos/loading.mp4';
    }

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

    // 2. Persist to Firestore with strict size sanitization
    try {
      const sanitizedForFirestore = sanitizeBrandingForFirestore(updated);
      const brandingDocRef = doc(db, 'settings', 'branding');
      await setDoc(brandingDocRef, sanitizedForFirestore, { merge: true });
    } catch (firestoreErr) {
      console.error('[Branding] Error saving branding to Firestore:', firestoreErr);
      throw firestoreErr;
    }
  }, [branding]);

  const resetBranding = useCallback(async () => {
    const resetData: AppBranding = {
      appLogo: '',
      appIcon: '',
      loadingScreenType: 'image',
      loadingScreenImage: '',
      loadingScreenVideo: '/videos/loading.mp4',
      loadingScreenEnabled: true,
      showLoadingImage: true,
      loadingVideoAutoplay: true,
      loadingVideoLoop: false,
      loadingVideoMuted: true,
      loadingVideoCanSkip: true,
      loadingVideoFit: 'contain',
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
      branding: getInitialBranding(),
      isLoading: false,
      updateBranding: async () => {},
      resetBranding: async () => {}
    };
  }
  return context;
};
