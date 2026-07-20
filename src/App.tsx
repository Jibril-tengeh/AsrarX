import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { LayoutTester } from './components/LayoutTester';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import { AuthModal } from './components/AuthModal';
import { ShieldAlert, LogIn, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, isAutoSaveEnabled } from './lib/firebase';
import { BottomNav } from './components/BottomNav';
import { AsrarHubLoader } from './components/AsrarHubLoader';
import { useAudio } from './contexts/AudioContext';
const UserDashboard = React.lazy(() => import('./pages/user/UserDashboard').then(m => ({ default: m.UserDashboard })));
const SecretDetail = React.lazy(() => import('./pages/user/SecretDetail').then(m => ({ default: m.SecretDetail })));
const ToolsDashboard = React.lazy(() => import('./pages/user/ToolsDashboard').then(m => ({ default: m.ToolsDashboard })));
const AbjadCalculator = React.lazy(() => import('./pages/user/tools/AbjadCalculator').then(m => ({ default: m.AbjadCalculator })));
const PlanetaryHours = React.lazy(() => import('./pages/user/tools/PlanetaryHours').then(m => ({ default: m.PlanetaryHours })));
const Tasbih = React.lazy(() => import('./pages/user/tools/Tasbih').then(m => ({ default: m.Tasbih })));
const KhatimGenerator = React.lazy(() => import('./pages/user/tools/KhatimGenerator').then(m => ({ default: m.KhatimGenerator })));
const Asma = React.lazy(() => import('./pages/user/tools/Asma').then(m => ({ default: m.Asma })));
const Talsam = React.lazy(() => import('./pages/user/tools/Talsam').then(m => ({ default: m.Talsam })));
const Istikhara = React.lazy(() => import('./pages/user/tools/Istikhara').then(m => ({ default: m.Istikhara })));
const SirrAlAsrar = React.lazy(() => import('./pages/user/tools/SirrAlAsrar').then(m => ({ default: m.SirrAlAsrar })));
const Zairja = React.lazy(() => import('./pages/user/tools/Zairja').then(m => ({ default: m.Zairja })));
const ZakatCalculator = React.lazy(() => import('./pages/user/tools/ZakatCalculator').then(m => ({ default: m.ZakatCalculator })));
const FaraidCalculator = React.lazy(() => import('./pages/user/tools/FaraidCalculator').then(m => ({ default: m.FaraidCalculator })));
const DreamJournal = React.lazy(() => import('./pages/user/tools/DreamJournal').then(m => ({ default: m.DreamJournal })));
const Halaqat = React.lazy(() => import('./pages/user/tools/Halaqat').then(m => ({ default: m.Halaqat })));
const NamesOfAllah = React.lazy(() => import('./pages/user/tools/NamesOfAllah').then(m => ({ default: m.NamesOfAllah })));
const RouhaniyyaExtractor = React.lazy(() => import('./pages/user/tools/RouhaniyyaExtractor').then(m => ({ default: m.RouhaniyyaExtractor })));
const Taksir = React.lazy(() => import('./pages/user/tools/Taksir').then(m => ({ default: m.Taksir })));
const QuranFull = React.lazy(() => import('./pages/user/tools/QuranFull').then(m => ({ default: m.QuranFull })));
const ElementalAnalyzer = React.lazy(() => import('./pages/user/tools/ElementalAnalyzer').then(m => ({ default: m.ElementalAnalyzer })));
const Geomancy = React.lazy(() => import('./pages/user/tools/Geomancy').then(m => ({ default: m.Geomancy })));
const ScienceOfLetters = React.lazy(() => import('./pages/user/tools/ScienceOfLetters').then(m => ({ default: m.ScienceOfLetters })));
const PersonalWird = React.lazy(() => import('./pages/user/tools/PersonalWird').then(m => ({ default: m.PersonalWird })));
const LunarMansions = React.lazy(() => import('./pages/user/tools/LunarMansions').then(m => ({ default: m.LunarMansions })));
const SpiritualCompatibility = React.lazy(() => import('./pages/user/tools/SpiritualCompatibility').then(m => ({ default: m.SpiritualCompatibility })));
const IlmJafar = React.lazy(() => import('./pages/user/tools/IlmJafar').then(m => ({ default: m.IlmJafar })));
const GrandOaths = React.lazy(() => import('./pages/user/tools/GrandOaths').then(m => ({ default: m.GrandOaths })));
const KhouddamExtractor = React.lazy(() => import('./pages/user/tools/KhouddamExtractor').then(m => ({ default: m.KhouddamExtractor })));
const AwfaqAdvanced = React.lazy(() => import('./pages/user/tools/AwfaqAdvanced').then(m => ({ default: m.AwfaqAdvanced })));
const QuranicFaal = React.lazy(() => import('./pages/user/tools/QuranicFaal').then(m => ({ default: m.QuranicFaal })));
const UserProfile = React.lazy(() => import('./pages/user/UserProfile').then(m => ({ default: m.UserProfile })));
const PaymentPage = React.lazy(() => import('./pages/user/PaymentPage').then(m => ({ default: m.PaymentPage })));
const Journal = React.lazy(() => import('./pages/user/Journal').then(m => ({ default: m.Journal })));
const ExploreDashboard = React.lazy(() => import('./pages/user/ExploreDashboard').then(m => ({ default: m.ExploreDashboard })));
const Quizz = React.lazy(() => import('./pages/user/explore/Quizz').then(m => ({ default: m.Quizz })));
const Lexique = React.lazy(() => import('./pages/user/explore/Lexique').then(m => ({ default: m.Lexique })));
const CalendarConverter = React.lazy(() => import('./pages/user/explore/CalendarConverter').then(m => ({ default: m.CalendarConverter })));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const Community = React.lazy(() => import('./pages/user/Community').then(m => ({ default: m.Community })));
import { AudioPlayer } from './components/AudioPlayer';
const DailyDhikrTracker = React.lazy(() => import('./pages/user/tools/DailyDhikrTracker').then(m => ({ default: m.DailyDhikrTracker })));

import { Onboarding } from './pages/Onboarding';
import { DailyRewardHandler } from './components/DailyRewardHandler';

import { MaintenanceOverlay } from './components/MaintenanceOverlay';
import { getApiUrl } from './lib/api';
import { FloatingBackButton } from './components/FloatingBackButton';
import { Link } from 'react-router-dom';
import { ErrorToastContainer } from './components/ErrorToastContainer';

const Store = React.lazy(() => import('./pages/user/Store').then(m => ({ default: m.Store })));
const FaqPage = React.lazy(() => import('./pages/FaqPage').then(m => ({ default: m.FaqPage })));

import { FeatureProvider, useFeatures } from './contexts/FeatureContext';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <h2 className="text-2xl font-semibold text-gray-500 dark:text-gray-400">{title}</h2>
  </div>
);

const FaqButton = () => {
  const { featureToggles } = useFeatures();
  
  if (featureToggles['tool_faq'] === 'inactive' || featureToggles['assistantIconVisible'] === false) return null;
  
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
import { pingFirestore } from './utils/networkLogger';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [checking, setChecking] = React.useState(false);
  const [statusFeedback, setStatusFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    const doubleCheckOnline = () => {
      fetch('https://www.google.com/favicon.ico', { method: 'HEAD', mode: 'no-cors' })
        .then(() => {
          setIsOnline(true);
          console.log("[NetworkStatus] Connection verified successfully via fetch.");
        })
        .catch(() => {
          setIsOnline(false);
          console.warn("[NetworkStatus] Connection failed verification.");
        });
    };

    const handleOnline = () => {
      setIsOnline(true);
      console.log("[NetworkStatus] Device went online.");
    };
    const handleOffline = () => {
      // Double check before showing offline
      doubleCheckOnline();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check on mount
    if (!navigator.onLine) {
      doubleCheckOnline();
    }

    // Capacitor / WebView specific environment logging for debugging
    console.log(`[NetworkStatus] Diagnostic check on boot:`);
    console.log(` - navigator.onLine: ${navigator.onLine}`);
    console.log(` - window.location.origin: "${window.location.origin}"`);
    console.log(` - window.location.protocol: "${window.location.protocol}"`);
    console.log(` - navigator.userAgent: "${navigator.userAgent}"`);

    if (
      window.location.protocol === 'file:' || 
      window.location.origin.includes('localhost') || 
      window.location.origin.includes('capacitor:')
    ) {
      console.info(
        `[NetworkStatus] Detected Mobile Capacitor WebView environment. ` +
        `Ensure that target API server CORS headers allow "${window.location.origin}" ` +
        `and that SSL certificates are fully valid (auto-signed or HTTP connections may be blocked by iOS/Android).`
      );
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCheckStatus = async () => {
    setChecking(true);
    setStatusFeedback("Vérification...");
    try {
      const result = await pingFirestore();
      if (result.reachable) {
        setStatusFeedback(`Serveur OK (Latence: ${result.latencyMs}ms)`);
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

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[10001] bg-red-600 text-white text-center py-2 text-xs font-semibold shadow-md flex flex-col sm:flex-row items-center justify-center gap-2 px-4 animate-bounce">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        <span>Connexion Internet perdue. Mode hors ligne activé.</span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={handleCheckStatus}
          disabled={checking}
          className="px-2 py-0.5 bg-white text-red-600 hover:bg-red-50 disabled:bg-white/50 rounded text-[10px] font-bold transition-all cursor-pointer border-0 uppercase tracking-wider"
        >
          {checking ? "Analyse..." : "Vérifier le statut"}
        </button>
        {statusFeedback && (
          <span className="text-[10px] bg-red-800 border border-red-700 px-2 py-0.5 rounded font-mono">
            {statusFeedback}
          </span>
        )}
      </div>
    </div>
  );
};

const ProtectedToolsLayout: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { featureToggles } = useFeatures();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      setShowAuthModal(true);
    }
  }, [user]);

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

  const isSubTool = location.pathname.startsWith('/tools/') && location.pathname !== '/tools';
  const pathParts = isSubTool ? location.pathname.split('/') : [];
  const toolId = isSubTool ? pathParts[pathParts.length - 1] : "";
  const status = isSubTool ? (featureToggles[`tool_${toolId}`] || "active") : "active";
  const isMaintenance = isSubTool && status === "maintenance";
  
  const advancedToolIds = [
    "personal-wird", "lunar-mansions", "spiritual-compatibility", "ilm-jafar",
    "grand-oaths", "elemental", "geomancy", "letters", "rouhaniyya", "taksir",
    "sirr", "zairja", "khatim", "talsam", "istikhara", "khouddam", "awfaq", "quranic-faal"
  ];
  const isAdvanced = isSubTool && advancedToolIds.includes(toolId);
  const isBlocked = isSubTool && ((user?.mysteryToolsDisabled && isAdvanced) || user?.blockedTools?.includes(toolId) || status === "disabled");

  React.useEffect(() => {
    if (isSubTool && !isBlocked && !isMaintenance && toolId) {
      localStorage.setItem('asrarhub_last_tool', toolId);
    }
  }, [location.pathname, isSubTool, isBlocked, isMaintenance, toolId]);

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
  }

  return <Outlet />;
};

export default function App() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { featureToggles } = useFeatures();
  const { isPlaying: globalIsPlaying, currentTrack, quranRepeatCount: repeatCount, setQuranRepeatCount: setRepeatCount } = useAudio();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState(
    localStorage.getItem('hasCompletedOnboarding') === 'true'
  );

  const [showConnectedToast, setShowConnectedToast] = React.useState(false);
  const [toastUserName, setToastUserName] = React.useState('');

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

  const isCompletedOnboarding = hasCompletedOnboarding || 
    sessionStorage.getItem('hasCompletedOnboarding') === 'true' || 
    !!(user && (user as any).hasCompletedOnboarding);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Global scroll-to-top and route changed logger on route changes
  React.useEffect(() => {
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
  }, [location.pathname]);

  React.useEffect(() => {
    const handleBackButton = () => {
      const currentPath = window.location.pathname;
      console.log(`[Navigation] Capacitor backButton event triggered on path: "${currentPath}"`);
      
      if (currentPath === '/user/dashboard' || currentPath === '/' || currentPath === '/home') {
        console.log(`[Navigation] Exiting app from home/dashboard.`);
        CapacitorApp.exitApp();
      } else if (
        currentPath === '/explore' ||
        currentPath === '/tools' ||
        currentPath === '/journal' ||
        currentPath === '/saved' ||
        currentPath === '/profile' ||
        currentPath === '/community'
      ) {
        console.log(`[Navigation] Root sub-page. Redirecting back to dashboard.`);
        navigate('/user/dashboard');
      } else {
        if (currentPath.startsWith('/tools/') || currentPath.startsWith('/secret/')) {
          const backPath = sessionStorage.getItem('last_active_main_path') || '/user/dashboard';
          console.log(`[Navigation] Sub-tool or secret path. Redirecting to last active: ${backPath}`);
          navigate(backPath);
        } else if (window.history.state && window.history.state.idx > 0) {
          console.log(`[Navigation] Navigating -1 (previous history entry).`);
          navigate(-1);
        } else {
          if (currentPath.startsWith('/explore/')) {
            console.log(`[Navigation] Sub-explore path. Redirecting to /explore.`);
            navigate('/explore');
          } else {
            console.log(`[Navigation] Fallback redirecting to /user/dashboard.`);
            navigate('/user/dashboard');
          }
        }
      }
    };

    CapacitorApp.addListener('backButton', handleBackButton);

    return () => {
      CapacitorApp.removeAllListeners();
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

      // Trigger standard notifications using the service worker if available, falling back to window.Notification
      const dispatchNotification = (title: string, body: string) => {
        try {
          if ('Notification' in window && window.Notification && window.Notification.permission === 'granted') {
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(title, {
                  body,
                  icon: '/icon-192.png',
                  badge: '/icon-192.png'
                });
              }).catch(() => {
                new Notification(title, { body });
              });
            } else {
              new Notification(title, { body });
            }
          }
        } catch (e) {
          console.error("Notification dispatch error", e);
        }
      };

      if (currentMinute !== lastCheckedMinute) {
        lastCheckedMinute = currentMinute;
        const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        // Custom manually created reminders
        reminders.forEach((rem: any) => {
          if (rem.enabled && rem.time === currentTimeString) {
            const title = rem.isZikr ? 'Rappel de Zikr Quotidien 📿' : 'AsrarHub';
            const body = rem.isZikr ? `Il est temps pour votre Zikr : ${rem.label}` : `Il est temps pour : ${rem.label}`;
            dispatchNotification(title, body);
          }
        });

        // Automatic Prayer Times reminders
        if (autoRemindersConfig && autoRemindersConfig.prayerEnabled && autoRemindersConfig.prayers) {
          Object.entries(autoRemindersConfig.prayers).forEach(([prayer, time]) => {
            if (time === currentTimeString) {
              const lastPrayerDate = autoRemindersConfig.lastPrayerReminders?.[prayer];
              if (lastPrayerDate !== todayDateStr) {
                // Trigger notification
                const title = `Heure de la Prière 🕌`;
                const body = `C'est l'heure de la prière de ${prayer} (${time}). Prenez un moment sacré pour invoquer Dieu.`;
                dispatchNotification(title, body);

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
          const title = `Rappel de Dhikr Récurrent 📿`;
          const body = `C'est l'heure d'évoquer Allah. Prenez une minute pour faire votre Zikr et purifier votre esprit.`;
          dispatchNotification(title, body);

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
        import('firebase/firestore').then(({ updateDoc, doc }) => {
          updateDoc(doc(db, 'users', user.uid), { hasCompletedOnboarding: true }).catch(console.error);
        });
      }
    }} />;
  }

  return (
    <MaintenanceOverlay>
      <NetworkStatus />
      <ErrorToastContainer />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col font-sans mb-16 sm:mb-0 w-full overflow-x-hidden">
        <FloatingBackButton />
        <Header />
        <DailyRewardHandler />
        <main className="flex flex-col min-h-screen w-full overflow-x-hidden flex-1 text-gray-900 dark:text-gray-100 pb-20 pt-20">
          <React.Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh] w-full">
              <div className="w-10 h-10 border-4 border-emerald-500/10 border-t-emerald-600 rounded-full animate-spin" />
            </div>
          }>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="w-full max-w-full overflow-x-hidden flex flex-col flex-1"
              >
                <Routes location={location}>
                <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/secret/:id" element={<SecretDetail />} />
                <Route path="/explore/:categoryId" element={<UserDashboard />} />
                <Route element={<ProtectedToolsLayout />}>
                  <Route path="/tools" element={<ToolsDashboard />} />
                  <Route path="/tools/abjad" element={<AbjadCalculator />} />
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
      </div>
    </MaintenanceOverlay>
  );
}
