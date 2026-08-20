import React from 'react';
import { Settings, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFeatures } from '../contexts/FeatureContext';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const toolNames: { [key: string]: string } = {
  abjad: 'Calculateur Abjad',
  planetary: 'Heures Planétaires',
  tasbih: 'Tasbih (Chapelet)',
  khatim: 'Générateur Khatim',
  asma: 'Asma al-Husna',
  talsam: 'Talsam',
  istikhara: 'Istikhara',
  sirr: 'Sirr Al Asrar',
  zairja: 'Zairja',
  zakat: 'Calculateur Zakat',
  faraid: 'Calculateur Faraid',
  dreams: 'Journal des Rêves',
  halaqat: 'Halaqat',
  elemental: 'Analyse Élémentale',
  geomancy: 'Géomancie',
  letters: 'Science des Lettres',
  'personal-wird': 'Wird Personnel',
  'daily-dhikr': 'Dhikr Quotidien',
  'lunar-mansions': 'Demeures Lunaires',
  'spiritual-compatibility': 'Compatibilité Spirituelle',
  'ilm-jafar': 'Ilm Jafar',
  'grand-oaths': 'Grands Serments',
  '99names': "99 Noms d'Allah",
  rouhaniyya: 'Extracteur Rouhaniyya',
  taksir: 'Taksir',
  quran: 'Coran Complet',
  khouddam: 'Extracteur Khouddam',
  awfaq: 'Awfaq',
  'quranic-faal': 'Tirage Coranique',
  store: 'Boutique (Store)',
  community: 'Communauté',
  journal: 'Journal Intime',
  quizz: 'Quiz Spirituel',
  lexique: 'Lexique',
  calendar: 'Calendrier Hégirien',
  faq: 'Assistant FAQ'
};

const getFeatureKeyForPath = (pathname: string): string | null => {
  if (pathname.startsWith('/tools/')) {
    const toolId = pathname.replace('/tools/', '').split('/')[0];
    return `tool_${toolId}`;
  }
  if (pathname === '/store') return 'tool_store';
  if (pathname === '/community') return 'tool_community';
  if (pathname === '/journal') return 'tool_journal';
  if (pathname === '/explore/quizz') return 'tool_quizz';
  if (pathname === '/explore/lexique') return 'tool_lexique';
  if (pathname === '/explore/calendar') return 'tool_calendar';
  if (pathname === '/faq') return 'tool_faq';
  return null;
};

export const MaintenanceOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { featureToggles } = useFeatures();

  const features = featureToggles || {};
  const isMaintenance = features?.globalMaintenanceMode === true || 
    features?.maintenanceMode === true || 
    features?.maintenance === true || 
    features?.globalMaintenance === true ||
    features?.isMaintenance === true;

  const isAdmin = user?.role === 'admin' || 
    user?.email === 'sbireino@gmail.com' || 
    user?.email === 'jibriltengeh4@gmail.com' || 
    user?.email === 'jibriltengeh57@gmail.com' || 
    user?.email === 'tenibawwal10@gmail.com' || 
    sessionStorage.getItem('admin_bypass') === 'true';

  // Always allow admin to pass through
  if (isAdmin) {
    return <>{children}</>;
  }

  // If maintenance mode is active, block everything
  if (isMaintenance) {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700"
        >
          <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Settings size={48} className="animate-spin-slow" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
            {t('maintenance.title', 'Maintenance en cours')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {t('maintenance.description', 'AsrarHub est actuellement en cours de maintenance pour améliorer votre expérience. Nous serons de retour très bientôt. Merci de votre patience.')}
          </p>
          <div className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl">
            <ShieldAlert size={18} />
            {t('maintenance.badge', 'Accès temporairement suspendu')}
          </div>
        </motion.div>
      </div>
    );
  }

  // Check individual tool/feature status
  const featureKey = getFeatureKeyForPath(location.pathname);
  const featureStatus = featureKey ? features[featureKey] : null;

  if (featureStatus === 'maintenance' || featureStatus === 'inactive') {
    const toolId = featureKey ? featureKey.replace('tool_', '') : '';
    const toolName = toolNames[toolId] || toolId || t('maintenance.feature', 'Fonctionnalité');

    return (
      <div className="fixed inset-0 z-[100] bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700"
        >
          <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Settings size={48} className="animate-spin-slow" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
            {featureStatus === 'maintenance' 
              ? `${toolName} en maintenance`
              : `${toolName} désactivé`}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-sm">
            {featureStatus === 'maintenance'
              ? `L'outil ${toolName} est actuellement en maintenance pour des améliorations techniques. Veuillez nous excuser pour ce désagrément.`
              : `L'accès à l'outil ${toolName} a été temporairement suspendu par l'administrateur.`}
          </p>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-2xl shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Retourner à l'accueil
          </button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};
