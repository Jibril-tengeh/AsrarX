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
import { TextScaleProvider } from './contexts/TextScaleContext';
import { FeatureProvider } from './contexts/FeatureContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Detect Capacitor / Native Mobile environment
const isCapacitorNative = typeof window !== 'undefined' && (
  !!(window as any)?.Capacitor?.isNativePlatform?.() ||
  !!(window as any)?.Capacitor ||
  window.location.protocol === 'capacitor:' ||
  window.location.protocol === 'file:' ||
  window.location.hostname === 'localhost' ||
  navigator.userAgent.includes('Capacitor') ||
  navigator.userAgent.includes('wv')
);

// Unregister active service worker in development or in Capacitor to avoid chunk/view conflicts
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  if (import.meta.env.DEV || isCapacitorNative) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch(() => {});
      }
    }).catch(() => {});
  } else if (import.meta.env.PROD) {
    // Only register PWA service worker on standard Web browsers
    try {
      import('virtual:pwa-register').then(({ registerSW }) => {
        try {
          const updateSW = registerSW({
            onNeedRefresh() {
              if (confirm('Une nouvelle version est disponible. Recharger ?')) {
                updateSW(true);
              }
            },
            onOfflineReady() {
              console.log('Application prête pour une utilisation hors ligne.');
            },
            onRegisterError(error) {
              console.warn('PWA Service Worker registration error:', error);
            }
          });
        } catch (e) {
          console.warn('Service Worker registration call failed safely:', e);
        }
      }).catch((err) => {
        console.warn('Virtual PWA module import error:', err);
      });
    } catch (e) {
      console.warn('PWA initialization error:', e);
    }
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <HashRouter>
          <AuthProvider>
            <LanguageProvider>
              <ThemeProvider>
                <TextScaleProvider>
                  <AudioProvider>
                    <FeatureProvider>
                      <App />
                    </FeatureProvider>
                  </AudioProvider>
                </TextScaleProvider>
              </ThemeProvider>
            </LanguageProvider>
          </AuthProvider>
        </HashRouter>
      </ErrorBoundary>
    </StrictMode>,
  );
}
