import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { get, set } from 'idb-keyval';

interface FeatureContextType {
  featureToggles: any;
}

const FeatureContext = createContext<FeatureContextType>({ featureToggles: {} });

export const useFeatures = () => useContext(FeatureContext);

export const FeatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [featureToggles, setFeatureToggles] = useState<any>({});

  // Apply typography and sizing variables to documentElement dynamically
  const applyTypographyAndSizing = (data: any) => {
    if (!data) return;
    let localSaved: any = {};
    try {
      const stored = localStorage.getItem('asrar_font_toggles');
      if (stored) localSaved = JSON.parse(stored);
    } catch (_) {}
    const mergedData = { ...localSaved, ...data };
    const root = document.documentElement;

    if (mergedData.textSizeBody && Number(mergedData.textSizeBody) >= 10 && Number(mergedData.textSizeBody) <= 50) {
      root.style.setProperty('--app-body-font-size', `${mergedData.textSizeBody}px`);
      root.classList.add('has-custom-body-size');
    } else {
      root.style.removeProperty('--app-body-font-size');
      root.classList.remove('has-custom-body-size');
    }

    if (mergedData.textSizeArticleTitle && Number(mergedData.textSizeArticleTitle) >= 4 && Number(mergedData.textSizeArticleTitle) <= 50) {
      root.style.setProperty('--app-article-title-font-size', `${mergedData.textSizeArticleTitle}px`);
      root.classList.add('has-custom-article-title-size');
    } else {
      root.style.removeProperty('--app-article-title-font-size');
      root.classList.remove('has-custom-article-title-size');
    }

    if (mergedData.textSizeToolTitle && Number(mergedData.textSizeToolTitle) >= 10 && Number(mergedData.textSizeToolTitle) <= 50) {
      root.style.setProperty('--app-tool-title-font-size', `${mergedData.textSizeToolTitle}px`);
      root.classList.add('has-custom-tool-title-size');
    } else {
      root.style.removeProperty('--app-tool-title-font-size');
      root.classList.remove('has-custom-tool-title-size');
    }

    if (mergedData.textSizeCardTitle && Number(mergedData.textSizeCardTitle) >= 10 && Number(mergedData.textSizeCardTitle) <= 50) {
      root.style.setProperty('--app-card-title-font-size', `${mergedData.textSizeCardTitle}px`);
      root.classList.add('has-custom-card-title-size');
    } else {
      root.style.removeProperty('--app-card-title-font-size');
      root.classList.remove('has-custom-card-title-size');
    }

    if (mergedData.textSizePageTitle && Number(mergedData.textSizePageTitle) >= 10 && Number(mergedData.textSizePageTitle) <= 60) {
      root.style.setProperty('--app-page-title-font-size', `${mergedData.textSizePageTitle}px`);
      root.classList.add('has-custom-page-title-size');
    } else {
      root.style.removeProperty('--app-page-title-font-size');
      root.classList.remove('has-custom-page-title-size');
    }

    if (mergedData.textSizeArabic && Number(mergedData.textSizeArabic) >= 10 && Number(mergedData.textSizeArabic) <= 60) {
      root.style.setProperty('--app-arabic-font-size', `${mergedData.textSizeArabic}px`);
      root.classList.add('has-custom-arabic-size');
    } else {
      root.style.removeProperty('--app-arabic-font-size');
      root.classList.remove('has-custom-arabic-size');
    }

    if (mergedData.cardPadding && Number(mergedData.cardPadding) >= 10 && Number(mergedData.cardPadding) <= 50) {
      root.style.setProperty('--app-card-padding', `${mergedData.cardPadding}px`);
      root.classList.add('has-custom-card-padding');
    } else {
      root.style.removeProperty('--app-card-padding');
      root.classList.remove('has-custom-card-padding');
    }

    if (mergedData.cardGlobalScale && Number(mergedData.cardGlobalScale) >= 50 && Number(mergedData.cardGlobalScale) <= 150) {
      root.style.setProperty('--app-card-global-scale', `${Number(mergedData.cardGlobalScale) / 100}`);
      root.classList.add('has-custom-card-scale');
    } else {
      root.style.removeProperty('--app-card-global-scale');
      root.classList.remove('has-custom-card-scale');
    }

    if (mergedData.bookTextAlign && ['left', 'center', 'right', 'justify'].includes(mergedData.bookTextAlign)) {
      root.style.setProperty('--app-book-text-align', mergedData.bookTextAlign);
      root.classList.add('has-custom-book-text-align');
    } else {
      root.style.removeProperty('--app-book-text-align');
      root.classList.remove('has-custom-book-text-align');
    }
  };

  // Synchronous immediate initialization from localStorage to prevent flash
  useEffect(() => {
    try {
      const localFontSaved = localStorage.getItem('asrar_font_toggles');
      if (localFontSaved) {
        const parsed = JSON.parse(localFontSaved);
        applyTypographyAndSizing(parsed);
      }
    } catch (e) {
      console.warn("Failed reading local font settings:", e);
    }
  }, []);

  // 1. Initialise state from IndexedDB Cache and localStorage for instant load (offline-first)
  useEffect(() => {
    const initCachedFeatures = async () => {
      try {
        let localData = {};
        const localSaved = localStorage.getItem('asrar_font_toggles');
        if (localSaved) {
          try { localData = JSON.parse(localSaved); } catch (_) {}
        }
        const cached = await get('asrar_feature_toggles');
        const merged = { ...localData, ...(cached || {}) };
        if (Object.keys(merged).length > 0) {
          setFeatureToggles(merged);
          applyTypographyAndSizing(merged);
        }
      } catch (err) {
        console.warn("[FeatureContext] Error reading feature toggles:", err);
      }
    };
    initCachedFeatures();

    const handleLocalUpdate = () => {
      try {
        const localFontSaved = localStorage.getItem('asrar_font_toggles');
        if (localFontSaved) {
          const parsed = JSON.parse(localFontSaved);
          setFeatureToggles((prev: any) => {
            const next = { ...prev, ...parsed };
            applyTypographyAndSizing(next);
            return next;
          });
        }
      } catch (e) {}
    };

    window.addEventListener('asrar_font_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);
    return () => {
      window.removeEventListener('asrar_font_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
    };
  }, []);

  // 2. Listen to real-time updates and update Cache
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "settings", "features"),
      (docSnap) => {
        let localData = {};
        try {
          const stored = localStorage.getItem('asrar_font_toggles');
          if (stored) localData = JSON.parse(stored);
        } catch (_) {}

        if (docSnap.exists()) {
          const data = docSnap.data();
          const merged = { ...data, ...localData };
          setFeatureToggles(merged);
          applyTypographyAndSizing(merged);
          try {
            localStorage.setItem('asrar_font_toggles', JSON.stringify(merged));
          } catch (_) {}
          
          if (data && data.backend_url) {
            localStorage.setItem('asrarhub_backend_url', data.backend_url);
          }
          set('asrar_feature_toggles', merged).catch(err => {
            console.warn("[FeatureContext] Error saving feature toggles to IndexedDB:", err);
          });
        } else if (Object.keys(localData).length > 0) {
          setFeatureToggles(localData);
          applyTypographyAndSizing(localData);
        }
      },
      (error) => {
        console.warn("Error fetching feature toggles (using local settings):", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <FeatureContext.Provider value={{ featureToggles }}>
      {children}
    </FeatureContext.Provider>
  );
};
