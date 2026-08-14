import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Outlet, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { LayoutTester } from './components/LayoutTester';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import { AuthModal } from './components/AuthModal';
import { ShieldAlert, LogIn, RefreshCw, Sparkles, WifiOff, X, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, isAutoSaveEnabled } from './lib/firebase';
import { BottomNav } from './components/BottomNav';
import { AsrarHubLoader } from './components/AsrarHubLoader';
import { useAudio } from './contexts/AudioContext';
import { AudioPlayer } from './components/AudioPlayer';
import { SacredAudioPlayer } from './components/SacredAudioPlayer';
import { requestNotificationPermission, requestAllPermissions, checkAndTriggerPlanetaryNotification } from './utils/planetaryNotifications';
import { getLocalizedNotificationText, dispatchSystemNotification } from './utils/notificationLocalization';
import { Onboarding } from './pages/Onboarding';
import { DailyRewardHandler } from './components/DailyRewardHandler';
import { ContentProtectionManager } from './components/ContentProtectionManager';
import { MaintenanceOverlay } from './components/MaintenanceOverlay';
import { getApiUrl } from './lib/api';
import { FloatingBackButton } from './components/FloatingBackButton';
import { ErrorToastContainer } from './components/ErrorToastContainer';
import { DownloadNotificationPopup } from './components/DownloadNotificationPopup';
import { FirstOpenPermissionsModal } from './components/FirstOpenPermissionsModal';
import { CollapsibleFloatingWidget } from './components/CollapsibleFloatingWidget';
import { FloatingTextResizer } from './components/FloatingTextResizer';
import { FeatureProvider, useFeatures } from './contexts/FeatureContext';
import { ImageDebugger } from './components/ImageDebugger';
import UserDashboard from './pages/user/UserDashboard';
import { FreeTrial24hModal } from './components/FreeTrial24hModal';
import { UnverifiedEmailGuard } from './components/UnverifiedEmailGuard';

function lazyWithRetry<T extends React.ComponentType<any> = React.ComponentType<any>>(
  componentImport: () => Promise<any>
) {
  return React.lazy(async () => {
    let attempts = 0;
    while (attempts < 3) {
      try {
        const module = await componentImport();
        let component = module.default;
        if (!component) {
          const keys = Object.keys(module || {});
          for (const key of keys) {
            const val = module[key];
            if (typeof val === 'function' || (typeof val === 'object' && val !== null && (val.$$typeof || val.render))) {
              component = val;
              break;
            }
          }
          if (!component && keys.length > 0) {
            component = module[keys[0]];
          }
        }
        if (component) {
          return { default: component };
        }
      } catch (err) {
        attempts++;
        if (attempts >= 3) {
          console.error("Dynamic import failed after 3 attempts:", err);
          break;
        }
        await new Promise((r) => setTimeout(r, 400 * attempts));
      }
    }

    const FallbackErrorPage: React.FC = () => (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500">
          <RefreshCw className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Chargement de la page</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Une mise à jour ou interruption réseau temporaire s'est produite.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Réessayer l'accès</span>
        </button>
      </div>
    );

    return { default: FallbackErrorPage };
  });
}

const SecretDetail = lazyWithRetry(() => import('./pages/user/SecretDetail'));
const ToolsDashboard = lazyWithRetry(() => import('./pages/user/ToolsDashboard'));
const AbjadCalculator = lazyWithRetry(() => import('./pages/user/tools/AbjadCalculator'));
const CustomDuaGenerator = lazyWithRetry(() => import('./pages/user/tools/CustomDuaGenerator'));
const PlanetaryHours = lazyWithRetry(() => import('./pages/user/tools/PlanetaryHours'));
const Tasbih = lazyWithRetry(() => import('./pages/user/tools/Tasbih'));
const KhatimGenerator = lazyWithRetry(() => import('./pages/user/tools/KhatimGenerator'));
const Asma = lazyWithRetry(() => import('./pages/user/tools/Asma'));
const Talsam = lazyWithRetry(() => import('./pages/user/tools/Talsam'));
const Istikhara = lazyWithRetry(() => import('./pages/user/tools/Istikhara'));
const SirrAlAsrar = lazyWithRetry(() => import('./pages/user/tools/SirrAlAsrar'));
const Zairja = lazyWithRetry(() => import('./pages/user/tools/Zairja'));
const ZakatCalculator = lazyWithRetry(() => import('./pages/user/tools/ZakatCalculator'));
const FaraidCalculator = lazyWithRetry(() => import('./pages/user/tools/FaraidCalculator'));
const DreamJournal = lazyWithRetry(() => import('./pages/user/tools/DreamJournal'));
const Halaqat = lazyWithRetry(() => import('./pages/user/tools/Halaqat'));
const NamesOfAllah = lazyWithRetry(() => import('./pages/user/tools/NamesOfAllah'));
const RouhaniyyaExtractor = lazyWithRetry(() => import('./pages/user/tools/RouhaniyyaExtractor'));
const Taksir = lazyWithRetry(() => import('./pages/user/tools/Taksir'));
const QuranFull = lazyWithRetry(() => import('./pages/user/tools/QuranFull'));
const ElementalAnalyzer = lazyWithRetry(() => import('./pages/user/tools/ElementalAnalyzer'));
const Geomancy = lazyWithRetry(() => import('./pages/user/tools/Geomancy'));
const ScienceOfLetters = lazyWithRetry(() => import('./pages/user/tools/ScienceOfLetters'));
const PersonalWird = lazyWithRetry(() => import('./pages/user/tools/PersonalWird'));
const LunarMansions = lazyWithRetry(() => import('./pages/user/tools/LunarMansions'));
const SpiritualCompatibility = lazyWithRetry(() => import('./pages/user/tools/SpiritualCompatibility'));
const IlmJafar = lazyWithRetry(() => import('./pages/user/tools/IlmJafar'));
const GrandOaths = lazyWithRetry(() => import('./pages/user/tools/GrandOaths'));
const KhouddamExtractor = lazyWithRetry(() => import('./pages/user/tools/KhouddamExtractor'));
const AwfaqAdvanced = lazyWithRetry(() => import('./pages/user/tools/AwfaqAdvanced'));
const QuranicFaal = lazyWithRetry(() => import('./pages/user/tools/QuranicFaal'));
const UserProfile = lazyWithRetry(() => import('./pages/user/UserProfile'));
const PaymentPage = lazyWithRetry(() => import('./pages/user/PaymentPage'));
const Journal = lazyWithRetry(() => import('./pages/user/Journal'));
const ExploreDashboard = lazyWithRetry(() => import('./pages/user/ExploreDashboard'));
const Quizz = lazyWithRetry(() => import('./pages/user/explore/Quizz'));
const Lexique = lazyWithRetry(() => import('./pages/user/explore/Lexique'));
const CalendarConverter = lazyWithRetry(() => import('./pages/user/explore/CalendarConverter'));
const AdminDashboard = lazyWithRetry(() => import('./pages/admin/AdminDashboard'));
const Community = lazyWithRetry(() => import('./pages/user/Community'));
const DailyDhikrTracker = lazyWithRetry(() => import('./pages/user/tools/DailyDhikrTracker'));
const IaRapprochements = lazyWithRetry(() => import('./pages/user/tools/IaRapprochements'));
const RingPendantTalisman = lazyWithRetry(() => import('./pages/user/tools/RingPendantTalisman'));
const CombustionEclipseCalculator = lazyWithRetry(() => import('./pages/user/tools/CombustionEclipseCalculator'));
const DairaAsSirr = lazyWithRetry(() => import('./pages/user/tools/DairaAsSirr'));
const SevenKingsSeals = lazyWithRetry(() => import('./pages/user/tools/SevenKingsSeals'));
const CoranAnalogyAbjad = lazyWithRetry(() => import('./pages/user/tools/CoranAnalogyAbjad'));
const ZikrLevelsCalculator = lazyWithRetry(() => import('./pages/user/tools/ZikrLevelsCalculator'));
const HijriFullMoonCalculator = lazyWithRetry(() => import('./pages/user/tools/HijriFullMoonCalculator'));
const MuridJournal = lazyWithRetry(() => import('./pages/user/tools/MuridJournal'));
const SaahIjabah = lazyWithRetry(() => import('./pages/user/tools/SaahIjabah'));
const SealsCatalogue = lazyWithRetry(() => import('./pages/user/tools/SealsCatalogue'));
const RajmaCharms = lazyWithRetry(() => import('./pages/user/tools/RajmaCharms'));
const SacredBooksLibrary = lazyWithRetry(() => import('./pages/user/tools/SacredBooksLibrary'));
const AlBuniShams = lazyWithRetry(() => import('./pages/user/tools/AlBuniShams'));
const DiagnosticProtection = lazyWithRetry(() => import('./pages/user/tools/DiagnosticProtection'));
const TalismanicGeometry = lazyWithRetry(() => import('./pages/user/tools/TalismanicGeometry'));
const TalsamsExtraction = lazyWithRetry(() => import('./pages/user/tools/TalsamsExtraction'));
const AstrologicalElections = lazyWithRetry(() => import('./pages/user/tools/AstrologicalElections'));
const SacredGeography = lazyWithRetry(() => import('./pages/user/tools/SacredGeography'));
const AdvancedAlchemy = lazyWithRetry(() => import('./pages/user/tools/AdvancedAlchemy'));
const MetaphysicalDefense = lazyWithRetry(() => import('./pages/user/tools/MetaphysicalDefense'));
const DiscretionMentalProtection = lazyWithRetry(() => import('./pages/user/tools/DiscretionMentalProtection'));
const AnchoringAstralStability = lazyWithRetry(() => import('./pages/user/tools/AnchoringAstralStability'));
const SpiritualToolsHub = lazyWithRetry(() => import('./pages/user/tools/SpiritualToolsHub'));
const ThiebissabaTradition = lazyWithRetry(() => import('./pages/user/tools/ThiebissabaTradition'));
const HighPrecisionIndividualization = lazyWithRetry(() => import('./pages/user/tools/HighPrecisionIndividualization'));
const AdvancedRamlProcessing = lazyWithRetry(() => import('./pages/user/tools/AdvancedRamlProcessing'));
const TraditionalDivinationQurah = lazyWithRetry(() => import('./pages/user/tools/TraditionalDivinationQurah'));
const IbnArabiSeals = lazyWithRetry(() => import('./pages/user/tools/IbnArabiSeals').then(m => ({ default: m.IbnArabiSeals })));
const AdvancedGeomancy = lazyWithRetry(() => import('./pages/user/tools/AdvancedGeomancy').then(m => ({ default: m.AdvancedGeomancy })));
const Store = lazyWithRetry(() => import('./pages/user/Store'));
const FaqPage = lazyWithRetry(() => import('./pages/FaqPage'));

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <h2 className="text-2xl font-semibold text-gray-500 dark:text-gray-400">{title}</h2>
  </div>
);

const FaqButton = () => {
  const { featureToggles } = useFeatures();
  
  if (featureToggles['tool_faq'] === 'inactive' || featureToggles['assistantIconVisible'] !== true) return null;
  
  return (
    <Link 
      to="/faq" 
      id="tour-faq"
      className="fixed bottom-[85px] right-4 sm:bottom-6 sm:right-6 z-40 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
      aria-label="Assistant IA"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.9567 24C12.1645 17.5144 17.3079 12.3551 23.7547 12.0298C17.3079 11.6961 12.1645 6.54519 11.9567 0.0595703C11.7489 6.54519 6.60555 11.6961 0.158691 12.0298C6.60555 12.3551 11.7489 17.5144 11.9567 24Z" fill="currentColor"/>
      </svg>
    </Link>
  );
};

import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { executeStepByStepBack } from './utils/backNavigation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { pingFirestore, addNetworkLog } from './utils/networkLogger';
import { revalidatePublishedArticles, getSWRCacheStats, SWRCacheStats } from './lib/swrArticleCache';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [checking, setChecking] = React.useState(false);
  const [statusFeedback, setStatusFeedback] = React.useState<string | null>(null);
  const [bgSyncMessage, setBgSyncMessage] = React.useState<string | null>(null);
  const [isDismissed, setIsDismissed] = React.useState(false);
  const [swrStats, setSwrStats] = React.useState<SWRCacheStats | null>(null);
  const [isSwrSyncing, setIsSwrSyncing] = React.useState(false);

  const loadSwrStats = React.useCallback(async () => {
    try {
      const stats = await getSWRCacheStats();
      setSwrStats(stats);
    } catch (e) {}
  }, []);

  const handleSWRRevalidate = React.useCallback(async (
    triggerSource = 'manual',
    options: { isSilent?: boolean } = {}
  ) => {
    const isSilent = options.isSilent ?? false;
    setIsSwrSyncing(true);

    if (!isSilent) {
      setStatusFeedback("SWR : Synchronisation IndexedDB des articles en cours...");
    } else {
      setBgSyncMessage("Synchronisation IndexedDB des articles en arrière-plan...");
    }

    try {
      const articles = await revalidatePublishedArticles(triggerSource);
      await loadSwrStats();
      if (!isSilent) {
        setStatusFeedback(`Cache IndexedDB à jour : ${articles.length} articles révalidés.`);
      } else {
        setBgSyncMessage(`Synchro arrière-plan terminée (${articles.length} articles)`);
        setTimeout(() => setBgSyncMessage(null), 4000);
      }
    } catch (err: any) {
      console.warn('[NetworkStatus] SWR revalidation error:', err);
      if (!isSilent) {
        setStatusFeedback(`Mode Hors Ligne : Articles servis depuis IndexedDB.`);
      } else {
        setBgSyncMessage(`Synchro arrière-plan : Mode hors ligne.`);
        setTimeout(() => setBgSyncMessage(null), 4000);
      }
    } finally {
      setIsSwrSyncing(false);
      if (!isSilent) {
        setTimeout(() => setStatusFeedback(null), 6000);
      }
    }
  }, [loadSwrStats]);

  const handleTestWebViewFetch = async () => {
    setChecking(true);
    setStatusFeedback("Test fetch URL racine...");
    const rootUrl = window.location.origin || window.location.href || '/';
    console.log(`[NetworkStatus] Diagnostic fetch test to application root URL: "${rootUrl}"`);

    addNetworkLog(
      'info',
      'ssl_cors',
      `Diagnostic WebView: Fetch déclenché sur URL racine "${rootUrl}"`,
      `Protocol: ${window.location.protocol}, UserAgent: ${navigator.userAgent}`
    );

    try {
      const response = await fetch(rootUrl, { method: 'GET', cache: 'no-store' });
      console.log(`[NetworkStatus] Root fetch succeeded! Status: ${response.status}, Type: ${response.type}`);
      addNetworkLog(
        'success',
        'ssl_cors',
        `Fetch URL racine réussi (${response.status} ${response.statusText || 'OK'})`,
        `URL: ${rootUrl}, Response type: ${response.type}, Redirected: ${response.redirected}`
      );
      setStatusFeedback(`Root Fetch OK (${response.status} ${response.type})`);
    } catch (err: any) {
      const msg = err?.message || String(err);
      console.warn(`[NetworkStatus] WebView fetch to root URL failed! Possible CORS or scheme issue:`, err);
      addNetworkLog(
        'error',
        'ssl_cors',
        `Échec du fetch WebView URL racine (${rootUrl}): ${msg}`,
        `Blocage potentiel CORS / Schème WebView (file:/capacitor:) dans Android/iOS: ${msg}`
      );
      setStatusFeedback(`[CORS/WebView Error] ${msg}`);
    } finally {
      setChecking(false);
      setTimeout(() => setStatusFeedback(null), 8000);
    }
  };

  React.useEffect(() => {
    // Expose diagnostic tool & SWR revalidator on window for debugging
    if (typeof window !== 'undefined') {
      (window as any).asrarhub_test_webview_fetch = handleTestWebViewFetch;
      (window as any).asrarhub_revalidate_swr = (silent = true) => handleSWRRevalidate('console', { isSilent: silent });
    }

    // Load initial IndexedDB stats
    loadSwrStats();

    // Trigger initial SWR background revalidation if online (silent)
    if (navigator.onLine) {
      handleSWRRevalidate('app_start', { isSilent: true });
    }

    // Periodic background sync every 10 minutes
    const periodicSyncInterval = setInterval(() => {
      if (navigator.onLine) {
        handleSWRRevalidate('periodic_bg', { isSilent: true });
      }
    }, 10 * 60 * 1000);

    // Sync on tab visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        handleSWRRevalidate('tab_visible', { isSilent: true });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const doubleCheckOnline = () => {
      fetch('https://www.google.com/favicon.ico', { method: 'HEAD', mode: 'no-cors' })
        .then(() => {
          setIsOnline(true);
          console.log("[NetworkStatus] Connection verified successfully via fetch.");
          // Automatic Stale-While-Revalidate when online status confirmed
          handleSWRRevalidate('online_reconnect', { isSilent: true });
        })
        .catch(() => {
          setIsOnline(false);
          console.warn("[NetworkStatus] Connection failed verification.");
        });
    };

    const handleOnline = () => {
      setIsOnline(true);
      console.log("[NetworkStatus] Device went online.");
      handleSWRRevalidate('online_event', { isSilent: true });
    };
    const handleOffline = () => {
      doubleCheckOnline();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) {
      doubleCheckOnline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(periodicSyncInterval);
    };
  }, [handleSWRRevalidate, loadSwrStats]);

  const handleCheckStatus = async () => {
    setChecking(true);
    setStatusFeedback("Vérification...");
    try {
      const result = await pingFirestore();
      if (result.reachable) {
        setStatusFeedback(`Serveur OK (Latence: ${result.latencyMs}ms)`);
        handleSWRRevalidate('ping_success', { isSilent: false });
      } else {
        setStatusFeedback(`Serveur injoignable : ${result.errorMessage || 'Erreur réseau'}`);
      }
    } catch (err) {
      setStatusFeedback("Échec du diagnostic de connexion.");
    } finally {
      setChecking(false);
      setTimeout(() => setStatusFeedback(null), 6000);
    }
  };

  // Silent background network manager (Visual indicators and controls are located in the header's SyncStatusBadge)
  return null;
};

const ProtectedToolsLayout: React.FC = () => {
  const { user, isPremium } = useAuth();
  const { t, language } = useLanguage();
  const { featureToggles } = useFeatures();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      setShowAuthModal(true);
    }
  }, [user]);

  const isSubTool = location.pathname.startsWith('/tools/') && location.pathname !== '/tools';
  const pathParts = isSubTool ? location.pathname.split('/') : [];
  const toolId = isSubTool ? pathParts[pathParts.length - 1] : "";
  const status = isSubTool ? (featureToggles[`tool_${toolId}`] || "active") : "active";
  const isMaintenance = isSubTool && status === "maintenance";
  const isInactive = isSubTool && status === "inactive";
  const isPremiumOnly = isSubTool && status === "premium" && !isPremium && user?.role !== 'admin';
  
  const advancedToolIds = [
    "personal-wird", "lunar-mansions", "spiritual-compatibility", "ilm-jafar",
    "grand-oaths", "elemental", "geomancy", "letters", "rouhaniyya", "taksir",
    "sirr", "zairja", "khatim", "talsam", "istikhara", "khouddam", "awfaq", "quranic-faal"
  ];
  const isAdvanced = isSubTool && advancedToolIds.includes(toolId);
  const isBlocked = isSubTool && ((user?.mysteryToolsDisabled && isAdvanced) || user?.blockedTools?.includes(toolId) || status === "disabled");

  React.useEffect(() => {
    if (user && isSubTool && !isBlocked && !isMaintenance && !isInactive && !isPremiumOnly && toolId) {
      localStorage.setItem('asrarhub_last_tool', toolId);
    }
  }, [user, location.pathname, isSubTool, isBlocked, isMaintenance, isInactive, isPremiumOnly, toolId]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 sm:p-8 text-center flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 w-full"
        >
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 mx-auto">
            <ShieldAlert size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {t('auth.requiredTitle', 'Connexion Requise')}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8">
            {t('auth.requiredDesc', 'Pour accéder aux outils spirituels et secrets d\'AsrarHub, vous devez être connecté à votre compte. Rejoignez notre communauté dès aujourd\'hui.')}
          </p>
          
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn size={18} />
            {t('auth.loginOrCreate', 'Se connecter / S\'inscrire')}
          </button>
        </motion.div>
        
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  const adminEmails = ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'];
  const isAdmin = user.role === 'admin' || (user.email && adminEmails.includes(user.email.toLowerCase()));

  if (!user.emailVerified && !isAdmin) {
    return <UnverifiedEmailGuard />;
  }

  if (isSubTool) {
    if (isBlocked) {
      return (
        <div className="max-w-md mx-auto p-6 sm:p-8 text-center flex flex-col items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-red-100 dark:border-red-900/30 w-full"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-6 mx-auto">
              <ShieldAlert size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {language === 'fr' ? 'Accès Bloqué' : language === 'ha' ? 'An Rufe Hanya' : 'Access Blocked'}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8">
              {language === 'fr' 
                ? 'Cet outil a été bloqué pour votre compte. Veuillez contacter l\'administrateur pour plus d\'informations.' 
                : language === 'ha'
                ? 'An rufe wannan kayan aiki ga asusunka. Tuntuɓi mai gudanarwa don ƙarin bayani.'
                : 'This tool has been blocked for your account. Please contact the administrator for more information.'}
            </p>
            
            <Link
              to="/tools"
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3 px-6 rounded-2xl transition-all"
            >
              {language === 'fr' ? 'Retour aux Outils' : language === 'ha' ? 'Koma ga Kayan Aiki' : 'Back to Tools'}
            </Link>
          </motion.div>
        </div>
      );
    }

    if (isMaintenance) {
      return (
        <div className="max-w-md mx-auto p-6 sm:p-8 text-center flex flex-col items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-amber-100 dark:border-amber-900/30 w-full"
          >
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 mx-auto animate-pulse">
              <RefreshCw size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {language === 'fr' ? 'Outil en Maintenance' : language === 'ha' ? 'Kayan Aiki a Gyara' : 'Tool under Maintenance'}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8">
              {language === 'fr' 
                ? 'Cet outil est temporairement en maintenance pour des ajustements techniques ou spirituels. Veuillez réessayer plus tard.' 
                : language === 'ha'
                ? 'Wannan kayan aiki yana fuskantar gyara na ɗan lokaci. Da fatan za a sake gwadawa daga baya.'
                : 'This tool is temporarily under maintenance for technical or spiritual adjustments. Please try again later.'}
            </p>
            
            <Link
              to="/tools"
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3 px-6 rounded-2xl transition-all"
            >
              {language === 'fr' ? 'Retour aux Outils' : language === 'ha' ? 'Koma ga Kayan Aiki' : 'Back to Tools'}
            </Link>
          </motion.div>
        </div>
      );
    }

    if (isInactive) {
      return (
        <div className="max-w-md mx-auto p-6 sm:p-8 text-center flex flex-col items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 w-full"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 mb-6 mx-auto">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {language === 'fr' ? 'Outil Inactif' : language === 'ha' ? 'Kayan Aiki An Kashe' : 'Tool Inactive'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8">
              {language === 'fr' 
                ? 'Cet outil a été temporairement désactivé par l\'administration.' 
                : language === 'ha'
                ? 'An kashe wannan kayan aiki ta hanyar gudanarwa.'
                : 'This tool has been temporarily deactivated by the administration.'}
            </p>
            <Link
              to="/tools"
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3 px-6 rounded-2xl transition-all"
            >
              {language === 'fr' ? 'Retour aux Outils' : language === 'ha' ? 'Koma ga Kayan Aiki' : 'Back to Tools'}
            </Link>
          </motion.div>
        </div>
      );
    }

    if (isPremiumOnly) {
      return (
        <div className="max-w-md mx-auto p-6 sm:p-8 text-center flex flex-col items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-purple-200 dark:border-purple-800/40 w-full"
          >
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center text-amber-500 mb-6 mx-auto">
              <Sparkles size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {language === 'fr' ? 'Réservé au Membres Premium' : language === 'ha' ? 'Na Mambobin Premium Ne Kawai' : 'Reserved for Premium Members'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8">
              {language === 'fr' 
                ? 'Cet outil fait partie des privilèges exclusifs réservés aux abonnés Premium d\'AsrarHub.' 
                : language === 'ha'
                ? 'Wannan kayan aiki na mambobin Premium ne kadai a AsrarHub.'
                : 'This tool is exclusively available for AsrarHub Premium subscribers.'}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/store"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-2xl shadow-md transition-all"
              >
                <Sparkles size={18} />
                {language === 'fr' ? 'Devenir Premium' : language === 'ha' ? 'Zama Mamba Premium' : 'Upgrade to Premium'}
              </Link>
              <Link
                to="/tools"
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3 px-6 rounded-2xl transition-all"
              >
                {language === 'fr' ? 'Retour aux Outils' : language === 'ha' ? 'Koma ga Kayan Aiki' : 'Back to Tools'}
              </Link>
            </div>
          </motion.div>
        </div>
      );
    }
  }

  return <Outlet />;
};

export default function App() {
  const { user, showTrialPopup, markTrialPopupSeen } = useAuth();
  const { language } = useLanguage();
  const { featureToggles } = useFeatures();
  const { isPlaying: globalIsPlaying, currentTrack, quranRepeatCount: repeatCount, setQuranRepeatCount: setRepeatCount } = useAudio();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState(
    localStorage.getItem('hasCompletedOnboarding') === 'true'
  );

  const [showConnectedToast, setShowConnectedToast] = React.useState(false);
  const [toastUserName, setToastUserName] = React.useState('');
  const [backExitToast, setBackExitToast] = React.useState(false);
  const lastBackPressTimeRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (user && !sessionStorage.getItem('asrarhub_welcome_shown')) {
      const name = user.name || user.email || (language === 'fr' ? 'Utilisateur' : language === 'ha' ? 'Mai amfani' : 'User');
      setToastUserName(name);
      setShowConnectedToast(true);
      sessionStorage.setItem('asrarhub_welcome_shown', 'true');
    }
  }, [user, language]);

  React.useEffect(() => {
    if (showConnectedToast) {
      const timer = setTimeout(() => {
        setShowConnectedToast(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showConnectedToast]);

  // Real-Time Planetary Hours Push Notifications & Forced Permissions (Notifications + Microphone)
  React.useEffect(() => {
    requestAllPermissions();
    checkAndTriggerPlanetaryNotification(language as any);
    const interval = setInterval(() => {
      checkAndTriggerPlanetaryNotification(language as any);
    }, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [language]);

  const isCompletedOnboarding = hasCompletedOnboarding || 
    sessionStorage.getItem('hasCompletedOnboarding') === 'true' || 
    !!(user && (user as any).hasCompletedOnboarding);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation history tracking stack for Capacitor Android back button
  const internalHistoryStackRef = React.useRef<string[]>([]);

  // Global scroll-to-top and route changed logger on route changes
  React.useEffect(() => {
    const currentPath = location.pathname + location.search;
    const stack = internalHistoryStackRef.current;

    if (stack.length === 0) {
      stack.push(currentPath);
    } else if (stack[stack.length - 1] !== currentPath) {
      if (stack.length >= 2 && stack[stack.length - 2] === currentPath) {
        // Navigated back
        stack.pop();
      } else {
        // Navigated forward
        stack.push(currentPath);
      }
    }

    console.log(`[Navigation] Route transitioned to: "${location.pathname}"`);
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTo({ top: 0 });
    }
    if (document.body) {
      document.body.scrollTo({ top: 0 });
    }

    const mainPaths = [
      '/user/dashboard',
      '/tools',
      '/explore',
      '/journal',
      '/saved',
      '/profile',
      '/community'
    ];
    if (mainPaths.includes(location.pathname)) {
      sessionStorage.setItem('last_active_main_path', location.pathname);
    }
  }, [location.pathname, location.search]);

  React.useEffect(() => {
    const handleBackButton = () => {
      executeStepByStepBack(navigate, lastBackPressTimeRef, setBackExitToast);
    };

    let listenerHandle: any = null;
    try {
      CapacitorApp.addListener('backButton', handleBackButton).then((handle) => {
        listenerHandle = handle;
      }).catch((e) => {
        console.warn('Capacitor backButton listener attach error:', e);
      });
    } catch (e) {
      console.warn('CapacitorApp backButton addListener error:', e);
    }

    return () => {
      try {
        if (listenerHandle && typeof listenerHandle.remove === 'function') {
          listenerHandle.remove();
        } else {
          CapacitorApp.removeAllListeners().catch(() => {});
        }
      } catch (e) {
        // ignore
      }
    };
  }, [navigate]);

  React.useEffect(() => {
    let lastCheckedMinute = -1;
    const interval = setInterval(() => {
      // 1. Process custom manually created reminders (asrar_reminders)
      let reminders = [];
      try {
        const parsed = JSON.parse(localStorage.getItem('asrar_reminders') || '[]');
        if (Array.isArray(parsed)) {
          reminders = parsed;
        }
      } catch (e) {
        console.error("Error parsing reminders", e);
      }

      // 2. Process automatic prayer times and recurring Dhikr reminders (asrar_reminders_config)
      let autoRemindersConfig: any = null;
      try {
        const saved = localStorage.getItem('asrar_reminders_config');
        if (saved) {
          autoRemindersConfig = JSON.parse(saved);
        }
      } catch (e) {
        console.error("Error parsing auto reminders config", e);
      }

      const now = new Date();
      const currentMinute = now.getMinutes();
      const todayDateStr = now.toDateString();

      if (currentMinute !== lastCheckedMinute) {
        lastCheckedMinute = currentMinute;
        const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const currentLang = (language || localStorage.getItem('language') || 'fr') as 'fr' | 'en' | 'ha';

        // Custom manually created reminders
        reminders.forEach((rem: any) => {
          if (rem.enabled && rem.time === currentTimeString) {
            const notificationType = rem.isZikr ? 'dhikrDaily' : 'customReminder';
            const { title, body } = getLocalizedNotificationText(notificationType, currentLang, { label: rem.label });
            dispatchSystemNotification(title, body);
          }
        });

        // Automatic Prayer Times reminders
        if (autoRemindersConfig && autoRemindersConfig.prayerEnabled && autoRemindersConfig.prayers) {
          Object.entries(autoRemindersConfig.prayers).forEach(([prayer, time]) => {
            if (time === currentTimeString) {
              const lastPrayerDate = autoRemindersConfig.lastPrayerReminders?.[prayer];
              if (lastPrayerDate !== todayDateStr) {
                const { title, body } = getLocalizedNotificationText('prayerTime', currentLang, {
                  prayerName: prayer,
                  time: String(time),
                });
                dispatchSystemNotification(title, body);

                // Update last triggering date
                if (!autoRemindersConfig.lastPrayerReminders) {
                  autoRemindersConfig.lastPrayerReminders = {};
                }
                autoRemindersConfig.lastPrayerReminders[prayer] = todayDateStr;
                localStorage.setItem('asrar_reminders_config', JSON.stringify(autoRemindersConfig));
              }
            }
          });
        }
      }

      // 3. Process periodic recurring Dhikr reminders
      if (autoRemindersConfig && autoRemindersConfig.dhikrEnabled) {
        const lastDhikrTime = autoRemindersConfig.lastDhikrReminder || 0;
        const intervalMs = (autoRemindersConfig.dhikrInterval || 60) * 60 * 1000;
        if (Date.now() - lastDhikrTime >= intervalMs) {
          const currentLang = (language || localStorage.getItem('language') || 'fr') as 'fr' | 'en' | 'ha';
          const { title, body } = getLocalizedNotificationText('dhikrRecurring', currentLang);
          dispatchSystemNotification(title, body);

          // Update last triggering time
          autoRemindersConfig.lastDhikrReminder = Date.now();
          localStorage.setItem('asrar_reminders_config', JSON.stringify(autoRemindersConfig));
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Prefetch Quran data in background for instant offline "View all occurrences"
  React.useEffect(() => {
    if (navigator.onLine) {
      import('idb-keyval').then(({ get, set }) => {
        get('asrar_quran_full_json').then(cached => {
          if (!cached) {
            fetch(getApiUrl('/quran.json'))
              .then(res => {
                if (res.ok) return res.json();
                throw new Error();
              })
              .then(data => {
                if (Array.isArray(data)) {
                  set('asrar_quran_full_json', data);
                }
              })
              .catch(() => {});
          }
        });
      });
    }
  }, []);

  // Banned User Intercept
  if (user && (user as any).isBanned) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-red-100 dark:border-red-900/30 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-6 mx-auto animate-bounce">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
            {language === 'fr' ? 'Compte Suspendu' : language === 'ha' ? 'An Dakatar da Asusunka' : 'Account Suspended'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
            {language === 'fr' 
              ? 'Votre compte a été banni par l\'administrateur. Vous n\'avez plus accès aux contenus, secrets et outils spirituels.' 
              : language === 'ha'
              ? 'An dakatar da asusunka ta hannun mai gudanarwa. Ba ka da damar shiga cikin abubuwan asiri da kayan aiki.'
              : 'Your account has been banned by the administrator. You no longer have access to content, secrets, and spiritual tools.'}
          </p>
          <div className="text-xs text-red-500 font-semibold border border-red-100 dark:border-red-900/20 bg-red-50/50 dark:bg-red-900/10 rounded-xl p-3 mb-6">
            {language === 'fr'
              ? 'Si vous pensez qu\'il s\'agit d\'une erreur, veuillez contacter l\'administrateur.'
              : language === 'ha'
              ? 'Idan kana tunanin wannan kuskure ne, tuntuɓi mai gudanarwa.'
              : 'If you think this is an error, please contact the administrator.'}
          </div>
          <button 
            onClick={() => {
              import('./lib/firebase').then(({ auth }) => auth.signOut());
            }}
            className="w-full py-3 px-4 rounded-xl bg-gray-150 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            {language === 'fr' ? 'Se Déconnecter' : language === 'ha' ? 'Fita daga Asusun' : 'Sign Out'}
          </button>
        </div>
      </div>
    );
  }

  if (!isCompletedOnboarding) {
    return <Onboarding onComplete={() => {
      localStorage.setItem('hasCompletedOnboarding', 'true');
      sessionStorage.setItem('hasCompletedOnboarding', 'true');
      setHasCompletedOnboarding(true);
      if (user && isAutoSaveEnabled()) {
        import('firebase/firestore').then(({ setDoc, doc }) => {
          setDoc(doc(db, 'users', user.uid), { hasCompletedOnboarding: true }, { merge: true }).catch(console.error);
        });
      }
    }} />;
  }

  return (
    <MaintenanceOverlay>
      <FirstOpenPermissionsModal />
      <ContentProtectionManager />
      <NetworkStatus />
      <ErrorToastContainer />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col font-sans mb-16 sm:mb-0 w-full max-w-full">
        <FloatingBackButton />
        <Header />
        <DailyRewardHandler />
        <main className="flex flex-col min-h-screen w-full max-w-full flex-1 text-gray-900 dark:text-gray-100 pb-20 mt-[15px]">
          <React.Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh] w-full">
              <div className="w-10 h-10 border-4 border-emerald-500/10 border-t-emerald-600 rounded-full animate-spin" />
            </div>
          }>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-full flex flex-col flex-1 min-h-0"
              >
                <Routes location={location}>
                <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/secret/:id" element={<SecretDetail />} />
                <Route path="/explore/:categoryId" element={<UserDashboard />} />
                <Route element={<ProtectedToolsLayout />}>
                  <Route path="/tools" element={<ToolsDashboard />} />
                  <Route path="/tools/abjad" element={<AbjadCalculator />} />
                  <Route path="/tools/custom-dua" element={<CustomDuaGenerator />} />
                  <Route path="/tools/planetary" element={<PlanetaryHours />} />
                  <Route path="/tools/tasbih" element={<Tasbih />} />
                  <Route path="/tools/khatim" element={<KhatimGenerator />} />
                  <Route path="/tools/asma" element={<Asma />} />
                  <Route path="/tools/talsam" element={<Talsam />} />
                  <Route path="/tools/istikhara" element={<Istikhara />} />
                  <Route path="/tools/sirr" element={<SirrAlAsrar />} />
                  <Route path="/tools/zairja" element={<Zairja />} />
                  <Route path="/tools/zakat" element={<ZakatCalculator />} />
                  <Route path="/tools/faraid" element={<FaraidCalculator />} />
                  <Route path="/tools/dreams" element={<DreamJournal />} />
                  <Route path="/tools/halaqat" element={<Halaqat />} />
                  <Route path="/tools/elemental" element={<ElementalAnalyzer />} />
                  <Route path="/tools/geomancy" element={<Geomancy />} />
                  <Route path="/tools/letters" element={<ScienceOfLetters />} />
                  <Route path="/tools/personal-wird" element={<PersonalWird />} />
                  <Route path="/tools/daily-dhikr" element={<DailyDhikrTracker />} />
                  <Route path="/tools/lunar-mansions" element={<LunarMansions />} />
                  <Route path="/tools/spiritual-compatibility" element={<SpiritualCompatibility />} />
                  <Route path="/tools/ilm-jafar" element={<IlmJafar />} />
                  <Route path="/tools/grand-oaths" element={<GrandOaths />} />
                  <Route path="/tools/99names" element={<NamesOfAllah />} />
                  <Route path="/tools/rouhaniyya" element={<RouhaniyyaExtractor />} />
                  <Route path="/tools/taksir" element={<Taksir />} />
                  <Route path="/tools/quran" element={<QuranFull />} />
                  <Route path="/tools/khouddam" element={<KhouddamExtractor />} />
                  <Route path="/tools/awfaq" element={<AwfaqAdvanced />} />
                  <Route path="/tools/quranic-faal" element={<QuranicFaal />} />
                  <Route path="/tools/ia-rapprochements" element={<IaRapprochements />} />
                  <Route path="/tools/ring-pendant-talisman" element={<RingPendantTalisman />} />
                  <Route path="/tools/combustion-eclipse" element={<CombustionEclipseCalculator />} />
                  <Route path="/tools/daira-as-sirr" element={<DairaAsSirr />} />
                  <Route path="/tools/dairah" element={<DairaAsSirr />} />
                  <Route path="/tools/saah-ijabah" element={<SaahIjabah />} />
                  <Route path="/tools/seals-catalogue" element={<SealsCatalogue />} />
                  <Route path="/tools/seals" element={<SealsCatalogue />} />
                  <Route path="/tools/seven-kings" element={<SevenKingsSeals />} />
                  <Route path="/tools/quran-analogy" element={<CoranAnalogyAbjad />} />
                  <Route path="/tools/zikr-levels" element={<ZikrLevelsCalculator />} />
                  <Route path="/tools/hijri-full-moon" element={<HijriFullMoonCalculator />} />
                  <Route path="/tools/murid-journal" element={<MuridJournal />} />
                  <Route path="/tools/rajma-charms" element={<RajmaCharms />} />
                  <Route path="/tools/rajma" element={<RajmaCharms />} />
                  <Route path="/tools/sacred-books" element={<SacredBooksLibrary />} />
                  <Route path="/tools/books" element={<SacredBooksLibrary />} />
                  <Route path="/tools/grimoires" element={<SacredBooksLibrary />} />
                  <Route path="/tools/al-buni-shams" element={<AlBuniShams />} />
                  <Route path="/tools/buni" element={<AlBuniShams />} />
                  <Route path="/tools/shams" element={<AlBuniShams />} />
                  <Route path="/tools/diagnostic-protection" element={<DiagnosticProtection />} />
                  <Route path="/tools/diagnostic" element={<DiagnosticProtection />} />
                  <Route path="/tools/talismanic-geometry" element={<TalismanicGeometry />} />
                  <Route path="/tools/tilasim" element={<TalismanicGeometry />} />
                  <Route path="/tools/talsams-extraction" element={<TalsamsExtraction />} />
                  <Route path="/tools/talsams" element={<TalsamsExtraction />} />
                  <Route path="/tools/astrological-elections" element={<AstrologicalElections />} />
                  <Route path="/tools/elections" element={<AstrologicalElections />} />
                  <Route path="/tools/sacred-geography" element={<SacredGeography />} />
                  <Route path="/tools/geographie-sacree" element={<SacredGeography />} />
                  <Route path="/tools/advanced-alchemy" element={<AdvancedAlchemy />} />
                  <Route path="/tools/alchemy" element={<AdvancedAlchemy />} />
                  <Route path="/tools/alchimie" element={<AdvancedAlchemy />} />
                  <Route path="/tools/metaphysical-defense" element={<MetaphysicalDefense />} />
                  <Route path="/tools/defense-metaphysique" element={<MetaphysicalDefense />} />
                  <Route path="/tools/defense" element={<MetaphysicalDefense />} />
                  <Route path="/tools/discretion-protection" element={<DiscretionMentalProtection />} />
                  <Route path="/tools/discretion-mental-protection" element={<DiscretionMentalProtection />} />
                  <Route path="/tools/discretion" element={<DiscretionMentalProtection />} />
                  <Route path="/tools/anchoring-stability" element={<AnchoringAstralStability />} />
                  <Route path="/tools/ancrage-stabilite" element={<AnchoringAstralStability />} />
                  <Route path="/tools/anchoring" element={<AnchoringAstralStability />} />
                  <Route path="/tools/spiritual-hub" element={<SpiritualToolsHub />} />
                  <Route path="/tools/spiritual" element={<SpiritualToolsHub />} />
                  <Route path="/tools/thiebissaba-tradition" element={<ThiebissabaTradition />} />
                  <Route path="/tools/thiebissaba" element={<ThiebissabaTradition />} />
                  <Route path="/tools/cebesaba" element={<ThiebissabaTradition />} />
                  <Route path="/tools/high-precision-individualization" element={<HighPrecisionIndividualization />} />
                  <Route path="/tools/individualisation" element={<HighPrecisionIndividualization />} />
                  <Route path="/tools/high-precision" element={<HighPrecisionIndividualization />} />
                  <Route path="/tools/advanced-raml-processing" element={<AdvancedRamlProcessing />} />
                  <Route path="/tools/khatam-raml" element={<AdvancedRamlProcessing />} />
                  <Route path="/tools/raml" element={<AdvancedRamlProcessing />} />
                  <Route path="/tools/divination-qurah" element={<TraditionalDivinationQurah />} />
                  <Route path="/tools/qurah" element={<TraditionalDivinationQurah />} />
                  <Route path="/tools/cauris" element={<TraditionalDivinationQurah />} />
                  <Route path="/tools/azlam" element={<TraditionalDivinationQurah />} />
                  <Route path="/tools/ibn-arabi-seals" element={<IbnArabiSeals />} />
                  <Route path="/tools/ibn-arabi" element={<IbnArabiSeals />} />
                  <Route path="/tools/sceaux-ibn-arabi" element={<IbnArabiSeals />} />
                  <Route path="/tools/akbari-seals" element={<IbnArabiSeals />} />
                  <Route path="/tools/advanced-geomancy" element={<AdvancedGeomancy />} />
                  <Route path="/tools/geomancy-traditions" element={<AdvancedGeomancy />} />
                  <Route path="/tools/geomancie-avancee" element={<AdvancedGeomancy />} />
                  <Route path="/tools/ifa" element={<AdvancedGeomancy />} />
                  <Route path="/tools/sikidy" element={<AdvancedGeomancy />} />
                  
                  {/* Additional Protected Routes */}
                  <Route path="/explore" element={<ExploreDashboard />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/explore/quizz" element={<Quizz />} />
                  <Route path="/explore/lexique" element={<Lexique />} />
                  <Route path="/explore/calendar" element={<CalendarConverter />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/saved" element={<UserDashboard initialFilter="favoris" />} />
                  <Route path="/community" element={<Community />} />
                </Route>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </React.Suspense>
      </main>
        {featureToggles['tool_inspector'] === 'active' && <LayoutTester />}
        <FaqButton />
        {featureToggles['sacredAudioPlayerVisible'] === true && <SacredAudioPlayer />}
        <BottomNav />

        {/* Global Floating Repeat Mode (visible only when Quran is playing and NOT on the Quran page itself) */}
        <AnimatePresence>
          {globalIsPlaying && currentTrack?.isQuranVerse && location.pathname !== '/tools/quran' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 15 }}
              className="fixed bottom-[152px] right-4 sm:bottom-[92px] sm:right-6 z-50"
            >
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3.5 rounded-full transition-all shadow-xl border-2 ${repeatCount > 0 ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white text-gray-700 hover:text-emerald-600 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 hover:border-emerald-500'}`}
                  title="Mode Répétition"
                >
                  <RefreshCw size={22} className={repeatCount > 0 ? "animate-spin" : ""} style={{ animationDuration: '4s' }} />
                  {repeatCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-sm border-2 border-white dark:border-gray-900">
                      {repeatCount}
                    </span>
                  )}
                </motion.button>
                <select
                  value={repeatCount}
                  onChange={(e) => setRepeatCount(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Mode Répétition"
                >
                  <option value={0}>Sans répétition</option>
                  {[3, 7, 11, 21, 33, 41, 70, 71, 73, 111, 313, 666, 777, 786, 1000, 1111].map(c => (
                    <option key={c} value={c}>{c} fois</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Image Error Interceptor & Debugger */}
        <ImageDebugger />

        {/* Download pop-up notification */}
        <DownloadNotificationPopup />

        {/* Collapsible Floating App-Wide Quick Widget */}
        <CollapsibleFloatingWidget />

        {/* Connection success notification */}
        <AnimatePresence>
          {showConnectedToast && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-emerald-500 text-white shadow-xl flex items-center gap-2.5 border border-emerald-400/20"
            >
              <div className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="text-xs sm:text-sm font-bold tracking-tight">
                {language === 'fr' 
                  ? `Utilisateur connecté avec succès : ${toastUserName} !` 
                  : language === 'ha'
                  ? `An haɗa mai amfani cikin nasara: ${toastUserName} !`
                  : `User connected successfully: ${toastUserName}!`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back button exit app confirmation toast */}
        <AnimatePresence>
          {backExitToast && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-2xl bg-gray-900/95 dark:bg-gray-800/95 text-white shadow-2xl flex items-center gap-3 border border-amber-500/40 backdrop-blur-md"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs sm:text-sm font-bold tracking-tight text-amber-300">
                {language === 'fr' 
                  ? "Appuyez à nouveau pour quitter l'application" 
                  : language === 'ha'
                  ? "Danna sake don fita daga aikace-aikacen"
                  : "Press back again to exit the app"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {/* 24-Hour Free Premium Trial Modal */}
        <FreeTrial24hModal isOpen={showTrialPopup} onClose={markTrialPopupSeen} />
      </div>
    </MaintenanceOverlay>
  );
}
