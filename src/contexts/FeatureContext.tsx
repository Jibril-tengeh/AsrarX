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

  // 1. Initialise state from IndexedDB Cache for instant load (offline-first)
  useEffect(() => {
    const initCachedFeatures = async () => {
      try {
        const cached = await get('asrar_feature_toggles');
        if (cached) {
          console.log("[FeatureContext] Loaded feature toggles from IndexedDB Cache:", cached);
          setFeatureToggles(cached);
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
          
          // Save back to both localStorage and IndexedDB
          if (data && data.backend_url) {
            localStorage.setItem('asrarhub_backend_url', data.backend_url);
          }
          set('asrar_feature_toggles', data).catch(err => {
            console.warn("[FeatureContext] Error saving feature toggles to IndexedDB:", err);
          });
        } else {
          setFeatureToggles({});
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
