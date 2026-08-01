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
    const root = document.documentElement;

    if (data.textSizeBody && Number(data.textSizeBody) >= 10 && Number(data.textSizeBody) <= 50) {
      root.style.setProperty('--app-body-font-size', `${data.textSizeBody}px`);
      root.classList.add('has-custom-body-size');
    } else {
      root.style.removeProperty('--app-body-font-size');
      root.classList.remove('has-custom-body-size');
    }

    if (data.textSizeArticleTitle && Number(data.textSizeArticleTitle) >= 10 && Number(data.textSizeArticleTitle) <= 50) {
      root.style.setProperty('--app-article-title-font-size', `${data.textSizeArticleTitle}px`);
      root.classList.add('has-custom-article-title-size');
    } else {
      root.style.removeProperty('--app-article-title-font-size');
      root.classList.remove('has-custom-article-title-size');
    }

    if (data.textSizeToolTitle && Number(data.textSizeToolTitle) >= 10 && Number(data.textSizeToolTitle) <= 50) {
      root.style.setProperty('--app-tool-title-font-size', `${data.textSizeToolTitle}px`);
      root.classList.add('has-custom-tool-title-size');
    } else {
      root.style.removeProperty('--app-tool-title-font-size');
      root.classList.remove('has-custom-tool-title-size');
    }

    if (data.textSizeCardTitle && Number(data.textSizeCardTitle) >= 10 && Number(data.textSizeCardTitle) <= 50) {
      root.style.setProperty('--app-card-title-font-size', `${data.textSizeCardTitle}px`);
      root.classList.add('has-custom-card-title-size');
    } else {
      root.style.removeProperty('--app-card-title-font-size');
      root.classList.remove('has-custom-card-title-size');
    }

    if (data.cardPadding && Number(data.cardPadding) >= 10 && Number(data.cardPadding) <= 50) {
      root.style.setProperty('--app-card-padding', `${data.cardPadding}px`);
      root.classList.add('has-custom-card-padding');
    } else {
      root.style.removeProperty('--app-card-padding');
      root.classList.remove('has-custom-card-padding');
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

  // 1. Initialise state from IndexedDB Cache for instant load (offline-first)
  useEffect(() => {
    const initCachedFeatures = async () => {
      try {
        const cached = await get('asrar_feature_toggles');
        if (cached) {
          console.log("[FeatureContext] Loaded feature toggles from IndexedDB Cache:", cached);
          setFeatureToggles(cached);
          applyTypographyAndSizing(cached);
          try {
            localStorage.setItem('asrar_font_toggles', JSON.stringify(cached));
          } catch (_) {}
          if (cached.backend_url) {
            localStorage.setItem('asrarhub_backend_url', cached.backend_url);
          }
        }
      } catch (err) {
        console.warn("[FeatureContext] Error reading feature toggles from IndexedDB:", err);
      }
    };
    initCachedFeatures();
  }, []);

  // 2. Listen to real-time updates and update Cache
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "settings", "features"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFeatureToggles(data);
          applyTypographyAndSizing(data);
          try {
            localStorage.setItem('asrar_font_toggles', JSON.stringify(data));
          } catch (_) {}
          
          // Save back to both localStorage and IndexedDB
          if (data && data.backend_url) {
            localStorage.setItem('asrarhub_backend_url', data.backend_url);
          }
          set('asrar_feature_toggles', data).catch(err => {
            console.warn("[FeatureContext] Error saving feature toggles to IndexedDB:", err);
          });
        } else {
          setFeatureToggles({});
          applyTypographyAndSizing({});
          set('asrar_feature_toggles', {}).catch(() => {});
        }
      },
      (error) => {
        console.error("Error fetching feature toggles:", error);
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
