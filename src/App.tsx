import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import { AuthModal } from './components/AuthModal';
import { ShieldAlert, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, isAutoSaveEnabled } from './lib/firebase';
import { BottomNav } from './components/BottomNav';
import { AsrarHubLoader } from './components/AsrarHubLoader';
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
const Ruqyah = React.lazy(() => import('./pages/user/tools/Ruqyah').then(m => ({ default: m.Ruqyah })));
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
import { FloatingBackButton } from './components/FloatingBackButton';
import { Link } from 'react-router-dom';

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
  
  if (featureToggles['tool_faq'] === 'inactive') return null;
  
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

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 text-sm font-medium shadow-md">
      Connexion Internet perdue. L'application fonctionne en mode hors ligne.
    </div>
  );
};

const ProtectedToolsLayout: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

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

  return <Outlet />;
};

export default function App() {
  const { user } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState(
    localStorage.getItem('hasCompletedOnboarding') === 'true'
  );

  const isCompletedOnboarding = hasCompletedOnboarding || 
    sessionStorage.getItem('hasCompletedOnboarding') === 'true' || 
    !!(user && (user as any).hasCompletedOnboarding);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isRuqyahPlayer = location.pathname === '/tools/ruqyah';

  // Global scroll-to-top on route changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTo({ top: 0 });
    }
    if (document.body) {
      document.body.scrollTo({ top: 0 });
    }
  }, [location.pathname]);

  React.useEffect(() => {
    CapacitorApp.addListener('backButton', () => {
      if (window.location.pathname !== '/' && window.location.pathname !== '/home') {
        window.history.back();
      } else {
        CapacitorApp.exitApp();
      }
    });

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, []);

  React.useEffect(() => {
    let lastCheckedMinute = -1;
    const interval = setInterval(() => {
      let reminders = [];
      try {
        const parsed = JSON.parse(localStorage.getItem('asrar_reminders') || '[]');
        if (Array.isArray(parsed)) {
          reminders = parsed;
        }
      } catch (e) {
        console.error("Error parsing reminders", e);
      }
      const now = new Date();
      const currentMinute = now.getMinutes();

      if (currentMinute !== lastCheckedMinute) {
        lastCheckedMinute = currentMinute;
        const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        reminders.forEach((rem: any) => {
          if (rem.enabled && rem.time === currentTimeString) {
            try {
              if ('Notification' in window && window.Notification && window.Notification.permission === 'granted') {
                const title = rem.isZikr ? 'Rappel de Zikr Quotidien 📿' : 'AsrarHub';
                const body = rem.isZikr ? `Il est temps pour votre Zikr : ${rem.label}` : `Il est temps pour : ${rem.label}`;
                new Notification(title, { body });
              }
            } catch (e) {
              console.error("Notification access error", e);
            }
          }
        });
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
            fetch('/quran.json')
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col font-sans mb-16 sm:mb-0 w-full overflow-x-hidden">
        <FloatingBackButton />
        <Header />
        <DailyRewardHandler />
        <main className={`flex-1 text-gray-900 dark:text-gray-100 pb-20 w-full max-w-full overflow-x-hidden ${isRuqyahPlayer ? '' : 'pt-20'}`}>
          <React.Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
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
                className="w-full h-full flex flex-col flex-1"
              >
                <Routes location={location}>
                <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/secret/:id" element={<SecretDetail />} />
                <Route path="/explore" element={<ExploreDashboard />} />
                <Route path="/store" element={<Store />} />
                <Route path="/explore/quizz" element={<Quizz />} />
                <Route path="/explore/lexique" element={<Lexique />} />
                <Route path="/explore/calendar" element={<CalendarConverter />} />
                <Route element={<ProtectedToolsLayout />}>
                  <Route path="/tools" element={<ToolsDashboard />} />
                  <Route path="/tools/abjad" element={<AbjadCalculator />} />
                  <Route path="/tools/planetary" element={<PlanetaryHours />} />
                  <Route path="/tools/tasbih" element={<Tasbih />} />
                  <Route path="/tools/khatim" element={<KhatimGenerator />} />
                  <Route path="/tools/asma" element={<Asma />} />
                  <Route path="/tools/talsam" element={<Talsam />} />
                  <Route path="/tools/istikhara" element={<Istikhara />} />
                  <Route path="/tools/ruqyah" element={<Ruqyah />} />
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
                </Route>
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/saved" element={<UserDashboard initialFilter="favoris" />} />
                <Route path="/community" element={<Community />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </React.Suspense>
      </main>
        <FaqButton />
        <BottomNav />
      </div>
    </MaintenanceOverlay>
  );
}
