import './storage-polyfill';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AudioProvider } from './contexts/AudioContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { FeatureProvider } from './contexts/FeatureContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { registerSW } from 'virtual:pwa-register';

// Unregister any active service worker in development to avoid chunk loading conflicts
const isNative = typeof window !== 'undefined' && (
  (window as any).Capacitor?.isNativePlatform?.() || 
  !!(window as any).Capacitor ||
  window.location.protocol === 'file:' ||
  window.location.protocol === 'capacitor:'
);

if (import.meta.env.DEV && !isNative && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('Unregistered active service worker in development');
          window.location.reload();
        }
      });
    }
  });
}

// Only register PWA service worker if we are on a regular web browser and not native platform
if (!isNative && typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    const updateSW = registerSW({
      onNeedRefresh() {
        if (typeof confirm !== 'undefined' && confirm('Une nouvelle version est disponible. Recharger ?')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log('Application prête pour une utilisation hors ligne.');
      },
    });
  } catch (error) {
    console.warn('PWA service worker registration failed safely:', error);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <AudioProvider>
                <FeatureProvider>
                  <App />
                </FeatureProvider>
              </AudioProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
);
