import React, { createContext, useContext, useState, useEffect } from 'react';

interface TextScaleContextType {
  textScale: number;
  increaseScale: () => void;
  decreaseScale: () => void;
  resetScale: () => void;
  setScale: (val: number) => void;
}

const TextScaleContext = createContext<TextScaleContextType | undefined>(undefined);

export const TextScaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textScale, setTextScaleState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('asrar_text_scale');
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0.8 && parsed <= 2.0) {
          return parsed;
        }
      }
    } catch (e) {}
    return 1.0;
  });

  const updateRootCssVar = (scale: number) => {
    try {
      document.documentElement.style.setProperty('--app-text-scale', scale.toString());
    } catch (e) {}
  };

  useEffect(() => {
    updateRootCssVar(textScale);
    try {
      localStorage.setItem('asrar_text_scale', textScale.toString());
    } catch (e) {}
  }, [textScale]);

  const setScale = (val: number) => {
    const clamped = Math.min(Math.max(val, 0.85), 1.75);
    const rounded = Math.round(clamped * 100) / 100;
    setTextScaleState(rounded);
  };

  const increaseScale = () => {
    setScale(textScale + 0.10);
  };

  const decreaseScale = () => {
    setScale(textScale - 0.10);
  };

  const resetScale = () => {
    setScale(1.0);
  };

  return (
    <TextScaleContext.Provider
      value={{
        textScale,
        increaseScale,
        decreaseScale,
        resetScale,
        setScale,
      }}
    >
      {children}
    </TextScaleContext.Provider>
  );
};

export const useTextScale = () => {
  const context = useContext(TextScaleContext);
  if (!context) {
    throw new Error('useTextScale must be used within a TextScaleProvider');
  }
  return context;
};
