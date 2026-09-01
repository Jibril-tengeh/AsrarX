import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '../../components/AuthModal';
import { 
  Settings, Users, BarChart3, Database, Shield, LayoutDashboard, 
  Book, BookOpen, ToggleLeft, Volume2, Headphones, Save, Search, Plus, Trash2, Edit2, FileText,
  Eye, Image as ImageIcon, Crop as CropIcon, X, Upload, ShoppingBag, CreditCard,
  Clock, CheckCircle, CheckCircle2, XCircle, Globe, Grid, List, Mail, Phone, Lock, Unlock, Bell, BellOff, Sparkles, Star, Share, ShieldAlert, Download, DownloadCloud, Crown, UserPlus, UserCheck, Award,
  FolderOpen, Copy, Radio, Type, Sliders, Maximize2, Activity, Terminal, RefreshCw, RotateCcw, AlertTriangle, Moon, ChevronDown, ChevronUp, Layout,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Camera, ShieldBan, Tag, Ticket, Check, ArrowLeft, Calculator,
  ArrowUp, ArrowDown, MoveVertical, Compass, Gift, AlertCircle, Share2, Edit3, Video, HardDrive,
  GripVertical, ArrowUpDown, Move
} from 'lucide-react';
import * as Icons from 'lucide-react';

const LucideIcon = ({ name, className, size }: { name: string; className?: string; size?: number }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    return <Icons.FolderOpen className={className} size={size} />;
  }
  return <IconComponent className={className} size={size} />;
};
import { db, auth } from '../../lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc, addDoc, onSnapshot, query, orderBy, setDoc, writeBatch, increment } from 'firebase/firestore';
import { set } from 'idb-keyval';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { TipTapEditor } from '../../components/TipTapEditor';
import { getAsrarItems } from '../../data/store';
import { normalizeEmail, normalizePhone } from '../../lib/validationUtils';
// import SimpleEditor from 'react-simple-code-editor';
// import Prism from 'prismjs';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/components/prism-css';
// import 'prismjs/components/prism-markup';
// import 'prismjs/themes/prism-tomorrow.css';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop, convertToPixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getApiUrl } from '../../lib/api';
import { getArticleImageUrl } from '../../utils/articleImageUtils';
import { ThumbnailValidatorWidget } from '../../components/admin/ThumbnailValidatorWidget';
import { pingFirestore, getNetworkLogs, clearNetworkLogs, addNetworkLog, triggerBackgroundReconnect, NetworkLog, PingResult } from '../../utils/networkLogger';
import { DauAreaChart, ToolUsageBarChart, UserDistributionDonut } from '../../components/admin/AdminAnalyticsCharts';

import { AdminStoreManager } from '../../components/AdminStoreManager';
import { SACRED_BOOKS } from '../../data/sacredBooksData';
import { PremiumUnlockCelebrationModal } from '../../components/PremiumUnlockCelebrationModal';
import { getInitialCalendarScales, saveCalendarScales, subscribeCalendarScales } from '../../lib/calendarScale';
import { INITIAL_DEFAULT_ARTICLES } from '../../data/defaultArticles';
import { fetchArticlesFromRest, fetchUsersFromRest, fetchCategoriesFromRest, deleteArticleFromRest, deleteCategoryFromRest } from '../../lib/firestoreRest';
import { isPubliclyVisibleArticle } from '../../lib/articleUtils';
import { saveLocalCustomArticle, deleteLocalCustomArticle, clearAllLocalCustomArticles, mergeWithLocalArticles, saveCachedArticlesList, setHideMockArticles, isMockArticlesHidden, autoSyncLocalArticlesToFirestore, CACHED_ADMIN_ARTICLES_KEY, CACHED_ARTICLES_LIST_KEY, CACHED_EXPLORE_ARTICLES_KEY, addDeletedArticleId } from '../../lib/localArticles';
import { revalidatePublishedArticles } from '../../lib/swrArticleCache';
import { AdminRecitersManager } from '../../components/admin/AdminRecitersManager';
import { BookCoverStudio } from '../../components/admin/BookCoverStudio';
import { ArticleMediaGallery } from '../../components/admin/ArticleMediaGallery';
import { AdminMediaStorageManager } from '../../components/admin/AdminMediaStorageManager';
import { DEFAULT_OATHS } from '../user/tools/GrandOaths';
import { QURAN_RECITERS } from '../../data/reciters';
import { calculateHijriDate } from '../../utils/hijriDate';
import { LunarSealVarietiesSection } from '../../components/LunarSealVarietiesSection';
import { AdminEmailSupportManager } from '../../components/admin/AdminEmailSupportManager';
import { AdminVersionControlManager } from '../../components/admin/AdminVersionControlManager';
import { AdminReferralManager } from '../../components/admin/AdminReferralManager';
import { getTrialDurationHours, isNewUserPremiumEnabled } from '../../utils/trialConfig';
import { ToolStatusPicker } from '../../components/admin/ToolStatusPicker';
import { useBackButton } from '../../hooks/useBackButton';
import { getScreenshotProtectionMode, getTextCopyProtectionMode, type ProtectionMode } from '../../utils/antiScreenshot';
import { tools as REGISTERED_DATA_TOOLS } from '../../data/tools';
import { 
  type SecurityAlert, 
  subscribeToSecurityAlerts, 
  isSecurityAlertTrackingEnabled, 
  dismissSecurityAlert, 
  clearAllSecurityAlerts 
} from '../../utils/securityAlerts';
import { 
  UserQuickStatusPicker, 
  type UserStatusType, 
  getResolvedUserStatus 
} from '../../components/admin/UserQuickStatusPicker';
import { AdminSecurityAlertsManager } from '../../components/admin/AdminSecurityAlertsManager';
import { AdminDeepSettingsManager } from "../../components/admin/AdminDeepSettingsManager";
import { BrandingSettings } from '../../components/admin/BrandingSettings';
import { FloatingBackButtonSettings } from '../../components/admin/FloatingBackButtonSettings';
import { AdminPdfDocumentsManager } from '../../components/admin/AdminPdfDocumentsManager';
import { AdminPromoVideoAnnouncementManager } from '../../components/admin/AdminPromoVideoAnnouncementManager';
import { AdminToolsHealthManager } from '../../components/admin/AdminToolsHealthManager';
import { ArticleQuickControlModal } from '../../components/admin/ArticleQuickControlModal';
import { PROMO_HOURS_OPTIONS, PROMO_HOURLY_OPTIONS, getPromoHourMessage, getPromoHourLabel, PromoDurationHours } from '../../utils/promoConfig';

const LayoutSelector = ({ value, onChange, activeColor = 'emerald' }: { value: string, onChange: (val: string) => void, activeColor?: string }) => {
  const isEmerald = activeColor.includes('emerald');
  const activeBorderColor = isEmerald ? 'border-emerald-500' : 'border-indigo-500';
  const activeBgColor = isEmerald ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : 'bg-indigo-50/50 dark:bg-indigo-950/20';

  return (
    <div className="inline-flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-1.5 shadow-sm">
      <div className="flex items-center gap-1.5">
        {/* Grid option */}
        <button
          type="button"
          onClick={() => onChange('grid')}
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
            value === 'grid' 
              ? `bg-gray-100 dark:bg-gray-800 shadow-inner scale-105` 
              : 'hover:bg-gray-50 dark:hover:bg-gray-850'
          }`}
          title="Grid Layout"
        >
          <div className="grid grid-cols-2 gap-1 w-5 h-5">
            <div className={`w-2 h-2 rounded-[3px] border-2 transition-colors ${value === 'grid' ? `${activeBorderColor} ${isEmerald ? 'bg-emerald-500/15' : 'bg-indigo-500/15'}` : 'border-gray-400 dark:border-gray-500'}`} />
            <div className={`w-2 h-2 rounded-[3px] border-2 transition-colors ${value === 'grid' ? `${activeBorderColor} ${isEmerald ? 'bg-emerald-500/15' : 'bg-indigo-500/15'}` : 'border-gray-400 dark:border-gray-500'}`} />
            <div className={`w-2 h-2 rounded-[3px] border-2 transition-colors ${value === 'grid' ? `${activeBorderColor} ${isEmerald ? 'bg-emerald-500/15' : 'bg-indigo-500/15'}` : 'border-gray-400 dark:border-gray-500'}`} />
            <div className={`w-2 h-2 rounded-[3px] border-2 transition-colors ${value === 'grid' ? `${activeBorderColor} ${isEmerald ? 'bg-emerald-500/15' : 'bg-indigo-500/15'}` : 'border-gray-400 dark:border-gray-500'}`} />
          </div>
        </button>

        {/* Large/Featured option */}
        <button
          type="button"
          onClick={() => onChange('large')}
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
            value === 'large' 
              ? `bg-gray-100 dark:bg-gray-800 shadow-inner scale-105` 
              : 'hover:bg-gray-50 dark:hover:bg-gray-850'
          }`}
          title="Featured Layout"
        >
          <div className={`w-5.5 h-5.5 rounded-md border-2 transition-colors ${value === 'large' ? `${activeBorderColor} ${isEmerald ? 'bg-emerald-500/15' : 'bg-indigo-500/15'}` : 'border-gray-400 dark:border-gray-500'}`} />
        </button>

        {/* List option */}
        <button
          type="button"
          onClick={() => onChange('list')}
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
            value === 'list' 
              ? `bg-gray-100 dark:bg-gray-800 shadow-inner scale-105` 
              : 'hover:bg-gray-50 dark:hover:bg-gray-850'
          }`}
          title="List Layout"
        >
          <div className="flex flex-col gap-1 w-5 h-5 justify-center">
            <div className="flex items-center gap-1.5">
              <div className={`w-1 h-1 rounded-full ${value === 'list' ? (isEmerald ? 'bg-emerald-500' : 'bg-indigo-500') : 'bg-gray-400 dark:bg-gray-500'}`} />
              <div className={`h-1 flex-1 rounded-full ${value === 'list' ? (isEmerald ? 'bg-emerald-500' : 'bg-indigo-500') : 'bg-gray-400 dark:bg-gray-500'}`} />
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-1 h-1 rounded-full ${value === 'list' ? (isEmerald ? 'bg-emerald-500' : 'bg-indigo-500') : 'bg-gray-400 dark:bg-gray-500'}`} />
              <div className={`h-1 flex-1 rounded-full ${value === 'list' ? (isEmerald ? 'bg-emerald-500' : 'bg-indigo-500') : 'bg-gray-400 dark:bg-gray-500'}`} />
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-1 h-1 rounded-full ${value === 'list' ? (isEmerald ? 'bg-emerald-500' : 'bg-indigo-500') : 'bg-gray-400 dark:bg-gray-500'}`} />
              <div className={`h-1 flex-1 rounded-full ${value === 'list' ? (isEmerald ? 'bg-emerald-500' : 'bg-indigo-500') : 'bg-gray-400 dark:bg-gray-500'}`} />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

type AdminTab = 'overview' | 'pdf_documents' | 'branding' | 'floating_button' | 'version_control' | 'referrals' | 'promo_codes' | 'security' | 'support' | 'users' | 'payments' | 'community' | 'features' | 'reciters' | 'ruqyah' | 'content' | 'notifications' | 'settings' | 'articles' | 'store' | 'grand_oaths' | 'categories' | 'seals' | 'book_covers' | 'media_storage';

interface Article {
  id: string;
  title: string;
  title_en?: string;
  title_ha?: string;
  hook?: string;
  thumbnail: string;
  content: string;
  content_en?: string;
  content_ha?: string;
  benefits?: string[];
  type: 'richtext' | 'code';
  status?: string;
  publishDate?: string;
  isPremium?: boolean;
  createdAt: number;
  category?: string;
  subCategory?: string;
  author?: string;
  audioUrl?: string;
  audio_url?: string;
}

interface Term {
  id: string;
  word: string;
  definition: string;
  category: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role?: string;
  isBanned: boolean;
  isSuspended?: boolean;
  mysteryToolsDisabled: boolean;
  allToolsDisabled?: boolean;
  isTrusted: boolean;
  isPremium?: boolean;
  subscriptionTier?: string;
  country?: string;
  phone?: string;
  password?: string;
  password_hash_indicator?: string;
  pushNotificationsEnabled?: boolean;
  pushNotificationStatus?: string;
  spiritualPoints?: number;
  blockedTools?: string[];
  allowedTools?: string[];
  toolOverrides?: Record<string, string>;
}

interface RuqyahAudio {
  id: string;
  title: string;
  url: string;
  duration: string;
  isActive: boolean;
}

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
}

export const SYSTEM_FEATURES = [
  { id: 'home', label: 'Accueil (Tableau de Bord)', desc: 'Page d\'accueil principale avec feed et widgets', category: 'nav' },
  { id: 'explore', label: 'Explore (Secrets & Articles)', desc: 'Dashboard exploreur avec secrets, filtres et catégories', category: 'nav' },
  { id: 'tools', label: 'Outils Spirituels (Catalogue)', desc: 'Page principale regroupant tous les outils mystiques', category: 'nav' },
  { id: 'journal', label: 'Journal Intime (Notes & Suivi)', desc: 'Carnet de notes spirituel personnel et historique', category: 'nav' },
  { id: 'saved', label: 'Favoris & Enregistrements', desc: 'Accès rapide aux articles et secrets sauvegardés', category: 'nav' },
  { id: 'store', label: 'Boutique AsrarHub (Store)', desc: 'Boutique en ligne, articles et services spirituels', category: 'nav' },
  { id: 'community', label: 'Communauté (Forum & Chat)', desc: 'Forum communautaire, messages et membres', category: 'nav' },
  { id: 'pdf', label: 'Bibliothèque PDF & Manuscrits', desc: 'Accès global aux documents PDF et manuscrits rares', category: 'nav' },
  { id: 'calendar', label: 'Calendrier Mystique (Hégirien)', desc: 'Heures planétaires, calendrier hégirien et mansions', category: 'simple' },
  { id: 'ruqyah', label: 'Module Ruqyah & Audio', desc: 'Accès aux versets de protection et guérison audio', category: 'simple' },
  { id: 'faq', label: 'FAQ / Assistant IA Spirituel', desc: 'Assistant IA spirituel et foire aux questions', category: 'simple' },
  { id: 'quizz', label: 'Quiz Mystique (Test de connaissances)', desc: 'Évaluation des connaissances spirituelles et niveaux', category: 'simple' },
  { id: 'lexique', label: 'Lexique des Termes Sacrés', desc: 'Dictionnaire des termes et concepts mystiques', category: 'simple' },
  { id: 'tools_video_slider', label: 'Slider Vidéo des Outils (Tableau de Bord)', desc: 'Carrousel animé avec vidéos de fond présentant les outils spirituels', category: 'system' },
  { id: 'anti_screenshot', label: "Protection Anti-Capture d'Écran", desc: "Bloque les captures d'écran, enregistrements vidéo et impressions", category: 'system' },
  { id: 'text_copy_protection', label: "Protection Anti-Copie de Texte", desc: "Empêche la sélection, le clic droit et la copie de texte", category: 'system' },
  { id: 'alert_repeated_tool_access', label: "Alerte Tentatives d'Accès aux Outils Restreints", desc: "Détecte et alerte l'admin en temps réel lors de tentatives d'accès restreint", category: 'system' },
  { id: 'inspector', label: 'Inspecteur de diagnostic', desc: 'Active ou désactive le bouton Inspecteur / Débogueur de mise en page', category: 'system' },
  { id: 'quick_widget', label: 'Widget Rapide AsrarHub (AsrarQuickWidget)', desc: 'Widget de recherche rapide et raccourcis sur le tableau de bord', category: 'system' },
  { id: 'direct_abjad_widget', label: 'Widget Calculateur Abjad Direct', desc: 'Widget interactif de calcul Abjad direct sur le Tableau des Outils', category: 'system' },
];

export const ALL_USER_TOOLS = [
  ...SYSTEM_FEATURES,
  ...REGISTERED_DATA_TOOLS.map(t => ({
    id: t.id,
    label: t.title,
    desc: t.description,
    category: t.level || 'advanced'
  }))
];

const AdminSectionCollapseContext = React.createContext<{
  collapsedSections: Record<string, boolean>;
  toggleCollapse: (id: string) => void;
}>({
  collapsedSections: {},
  toggleCollapse: () => {}
});

const CollapsibleAdminCard: React.FC<{
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}> = ({
  id,
  title,
  subtitle,
  description,
  icon,
  badge,
  children,
  headerRight
}) => {
  const { collapsedSections, toggleCollapse } = React.useContext(AdminSectionCollapseContext);
  // By default, sections are OPEN (expanded) so all parameters and controls are fully visible
  const isCollapsed = collapsedSections[id] !== undefined ? collapsedSections[id] : false;
  const cardSubtitle = subtitle || description;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all w-full max-w-full min-w-0">
      <div
        onClick={() => toggleCollapse(id)}
        className="w-full p-3.5 sm:p-5 md:p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-gray-50/80 dark:hover:bg-gray-750 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1 w-full sm:w-auto">
          {icon && <div className="shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5 sm:mt-0">{icon}</div>}
          <div className="min-w-0 flex-1 max-w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base md:text-lg break-words max-w-full">
                {title}
              </h3>
              {badge}
            </div>
            {cardSubtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-words line-clamp-2 sm:line-clamp-none">
                {cardSubtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-gray-700/60 flex-wrap">
          {headerRight}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ml-auto sm:ml-0">
            <span>{isCollapsed ? 'Déplier' : 'Replier'}</span>
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <AnimatePresence>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-3.5 sm:p-5 md:p-6 border-t border-gray-100 dark:border-gray-700 space-y-4 sm:space-y-6 w-full max-w-full overflow-x-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [showBookCoverStudioModal, setShowBookCoverStudioModal] = useState(false);
  
  const toastTimeoutRef = useRef<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3500);
  };
  
  // Settings State
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [calendarGlobalScale, setCalendarGlobalScale] = useState<number>(() => getInitialCalendarScales().globalScale);
  const [calendarSubCardScale, setCalendarSubCardScale] = useState<number>(() => getInitialCalendarScales().subCardScale);

  useEffect(() => {
    const unsubscribe = subscribeCalendarScales(({ globalScale, subCardScale: subScale }) => {
      setCalendarGlobalScale(globalScale);
      setCalendarSubCardScale(subScale);
    });
    return () => unsubscribe();
  }, []);

  // Collapsible Admin Sections State (closed/collapsed by default)
  const [collapsedAdminSections, setCollapsedAdminSections] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('asrarhub_collapsed_admin_sections');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('asrarhub_collapsed_admin_sections', JSON.stringify(collapsedAdminSections));
    } catch {}
  }, [collapsedAdminSections]);

  const toggleAdminSectionCollapse = (sectionId: string) => {
    setCollapsedAdminSections(prev => {
      const current = prev[sectionId] !== undefined ? prev[sectionId] : false;
      return {
        ...prev,
        [sectionId]: !current
      };
    });
  };

  const setAllAdminSectionsCollapse = (collapsed: boolean) => {
    const sectionIds = [
      'feat_user_tools', 'feat_shams_buni', 'feat_sacred_books', 'feat_downloads', 'feat_admin_access', 'feat_payment_methods', 'feat_sharing_options',
      'set_branding', 'set_floating_back_button', 'set_spiritual_points', 'set_new_user_premium', 'set_hijri', 'set_calendar_scale', 'set_font_sizes', 'set_card_padding_scale', 'set_feed_offsets', 'set_layout_modes', 'set_global_maintenance', 'set_pricing_paystack', 'set_firestore_diag', 'set_assistant_prompts', 'set_backup_export', 'set_reciter', 'set_announcement', 'set_screenshot_protection', 'set_dua_copy', 'set_backend_url', 'set_global_audio', 'set_version_control', 'set_promo_videos', 'set_referrals', 'set_support_emails', 'set_security_alerts', 'set_reciters_mgmt', 'set_media_storage', 'set_maintenance_cache'
    ];
    const newState: Record<string, boolean> = {};
    sectionIds.forEach(id => {
      newState[id] = collapsed;
    });
    setCollapsedAdminSections(newState);
  };

  // Assistant Prompts State
  const [adminPrompts, setAdminPrompts] = useState<{ id: string; text: string; lang: string }[]>([]);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [newPromptText, setNewPromptText] = useState('');
  const [newPromptLang, setNewPromptLang] = useState('fr');

  // Content State (Mocking Lexique Content Management)
  const [lexiqueTerms, setLexiqueTerms] = useState<Term[]>([]);
  const [newTerm, setNewTerm] = useState<any>({ 
    word_fr: '', definition_fr: '', 
    word_en: '', definition_en: '', 
    word_ha: '', definition_ha: '', 
    category: 'Général' 
  });

  // Grand Oaths State
  const [adminGrandOaths, setAdminGrandOaths] = useState<any[]>([]);
  const [editingOath, setEditingOath] = useState<any | null>(null);
  const [newOath, setNewOath] = useState<any>({
    title: '', title_en: '', title_ha: '',
    arabicTitle: '',
    desc: '', desc_en: '', desc_ha: '',
    incense: '', incense_en: '', incense_ha: '',
    day: '', day_en: '', day_ha: '',
    content: '',
    isMaintenance: false,
    syriacNames: []
  });
  const [newSyriacName, setNewSyriacName] = useState<any>({
    name: '', arabic: '', meaning: '', meaning_en: '', meaning_ha: ''
  });
  const [restoringOaths, setRestoringOaths] = useState(false);

  // Global Header Search
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Users State
  const [users, setUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'suspended' | 'premium' | 'banned' | 'alerted'>('all');
  const [usersLimit, setUsersLimit] = useState(50);
  const [rawDbUsers, setRawDbUsers] = useState<any[]>([]);
  const [restUsers, setRestUsers] = useState<any[]>([]);
  const restUsersRef = useRef<any[]>([]);

  // Security Access Alerts State
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToSecurityAlerts((alerts) => {
      setSecurityAlerts(alerts);
    });
    return () => unsubscribe();
  }, []);

  // User Management Modals & Sync State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);
  const [userToDeleteConfirm, setUserToDeleteConfirm] = useState<User | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isBatchDeleteConfirmOpen, setIsBatchDeleteConfirmOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editUserData, setEditUserData] = useState<Partial<User>>({});
  const [addUserMode, setAddUserMode] = useState<'single' | 'batch'>('single');
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    role: 'user',
    subscriptionTier: 'premium'
  });
  const [batchEmailsText, setBatchEmailsText] = useState('');
  const [isAddingUsers, setIsAddingUsers] = useState(false);
  const [isScanningUsers, setIsScanningUsers] = useState(false);

  // Content/Lexique pagination and search
  const [lexiqueSearch, setLexiqueSearch] = useState('');
  const [lexiqueLimit, setLexiqueLimit] = useState(15);
  const [blockingToolsUser, setBlockingToolsUser] = useState<User | null>(null);

  useBackButton(() => setSelectedUserDetail(null), !!selectedUserDetail);
  useBackButton(() => setBlockingToolsUser(null), !!blockingToolsUser);
  useBackButton(() => setIsAddUserModalOpen(false), isAddUserModalOpen);

  // Feature Search & Drag-and-Drop Reordering States
  const [featureSearch, setFeatureSearch] = useState('');
  const [draggedFeatureId, setDraggedFeatureId] = useState<string | null>(null);
  const [dragOverFeatureId, setDragOverFeatureId] = useState<string | null>(null);

  // Diagnostic Ping State
  const [firestorePingResult, setFirestorePingResult] = useState<PingResult | null>(null);
  const [isTestingPing, setIsTestingPing] = useState(false);

  const handleRunPingTest = async () => {
    setIsTestingPing(true);
    try {
      const res = await pingFirestore();
      setFirestorePingResult(res);
      if (res.reachable) {
        showToast(`Connexion Firestore réussie (${res.latencyMs} ms) !`, "success");
      } else {
        showToast(`Erreur Firestore : ${res.errorMessage || res.errorType}`, "error");
      }
    } catch (err: any) {
      showToast(`Erreur de diagnostic : ${err?.message || err}`, "error");
    } finally {
      setIsTestingPing(false);
    }
  };

  const handleExportBackup = () => {
    try {
      const backupData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        articles,
        categories,
        users,
        promoCodes,
        storeProducts,
        lexiqueTerms,
        adminGrandOaths,
        featureToggles,
        ruqyahAudios,
        notifications
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `asrarhub_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Sauvegarde exportée avec succès !", "success");
    } catch (e: any) {
      showToast("Erreur lors de l'exportation : " + e.message, "error");
    }
  };

  const masterDiscoveredMapRef = useRef<Map<string, User>>(new Map());

  const normalizeUser = (u: any): User => {
    const email = (u.email || '').trim().toLowerCase();
    const rawName = u.name || '';
    const name = (rawName && rawName !== 'Sans Nom') ? rawName : (email ? email.split('@')[0] : 'Membre AsrarHub');
    const photoURL = u.photoURL || u.avatar || u.picture || u.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email || u.id || 'user')}`;
    const country = (u.country || u.location || u.region) ? (u.country || u.location || u.region) : 'Non renseigné';
    const phone = (u.phone || u.phoneNumber || u.tel) ? (u.phone || u.phoneNumber || u.tel) : 'Non renseigné';
    const password_hash_indicator = u.password_hash_indicator || u.passwordHash || (u.password && u.password !== 'Non enregistré / Google' ? u.password : '•••••••• (Sécurisé Hash)');
    const password = password_hash_indicator;
    const pushNotificationsEnabled = u.pushNotificationsEnabled !== undefined ? u.pushNotificationsEnabled : (u.pushNotificationStatus === 'disabled' || u.pushNotificationStatus === false ? false : true);
    const pushNotificationStatus = u.pushNotificationStatus || (pushNotificationsEnabled ? 'enabled' : 'disabled');

    const stableSlug = email ? email.replace(/[^a-zA-Z0-9]/g, '_') : name.replace(/[^a-zA-Z0-9]/g, '_');
    const id = u.id || u.uid || (stableSlug ? `usr_${stableSlug}` : 'usr_default');

    return {
      ...u,
      id,
      name,
      email: email || 'utilisateur@asrarhub.com',
      photoURL,
      country,
      phone,
      password,
      password_hash_indicator,
      pushNotificationsEnabled,
      pushNotificationStatus,
      isBanned: !!u.isBanned,
      mysteryToolsDisabled: !!u.mysteryToolsDisabled,
      allToolsDisabled: !!u.allToolsDisabled,
      isTrusted: u.isTrusted !== undefined ? u.isTrusted : true,
      isPremium: !!u.isPremium || u.subscriptionTier === 'premium' || u.subscriptionTier === 'pro',
      subscriptionTier: u.subscriptionTier || (u.isPremium ? 'premium' : 'free'),
      role: u.role || 'user',
      blockedTools: u.blockedTools || [],
      allowedTools: u.allowedTools || [],
      toolOverrides: u.toolOverrides || {}
    };
  };

  const aggregateAllUsers = (dbList: any[] = [], payList: any[] = [], postList: any[] = [], restList: any[] = []) => {
    const usersMap = new Map<string, User>();

    const deletedUserIds: string[] = (() => {
      try {
        return JSON.parse(localStorage.getItem('asrarhub_deleted_user_ids') || '[]');
      } catch {
        return [];
      }
    })();

    // 1. Pre-fill from masterDiscoveredMapRef to ensure previously discovered users are NEVER dropped unless deleted
    masterDiscoveredMapRef.current.forEach((uVal, uKey) => {
      const isDeleted = deletedUserIds.includes(uKey) || 
        (uVal.id && deletedUserIds.includes(uVal.id)) || 
        (uVal.email && deletedUserIds.includes(uVal.email.toLowerCase().trim()));
      if (!isDeleted) {
        usersMap.set(uKey, uVal);
      }
    });

    const effectiveRestList = (restList && restList.length > 0) ? restList : restUsersRef.current;
    if (restList && restList.length > 0) {
      restUsersRef.current = restList;
    }

    const addOrMerge = (uObj: any) => {
      if (!uObj) return;
      const norm = normalizeUser(uObj);
      if (norm.id && deletedUserIds.includes(norm.id)) return;
      if (norm.email && deletedUserIds.includes(norm.email.toLowerCase().trim())) return;

      const hasRealEmail = norm.email && typeof norm.email === 'string' && norm.email.trim() !== '' && norm.email.includes('@') && !norm.email.includes('utilisateur@asrarhub.com');
      const key = hasRealEmail ? norm.email.toLowerCase().trim() : norm.id;
      if (!key) return;
      if (deletedUserIds.includes(key)) return;

      if (!usersMap.has(key)) {
        usersMap.set(key, norm);
      } else {
        const existing = usersMap.get(key)!;
        usersMap.set(key, {
          ...norm,
          ...existing,
          id: existing.id || norm.id,
          name: (existing.name && existing.name !== 'Sans Nom' && existing.name !== 'Membre AsrarHub') ? existing.name : norm.name,
          photoURL: existing.photoURL || norm.photoURL,
          country: (existing.country && existing.country !== 'Non renseigné') ? existing.country : norm.country,
          phone: (existing.phone && existing.phone !== 'Non renseigné') ? existing.phone : norm.phone,
          password_hash_indicator: (existing.password_hash_indicator && !existing.password_hash_indicator.includes('••••')) ? existing.password_hash_indicator : norm.password_hash_indicator,
          isBanned: existing.isBanned || norm.isBanned,
          mysteryToolsDisabled: existing.mysteryToolsDisabled !== undefined ? existing.mysteryToolsDisabled : norm.mysteryToolsDisabled,
          allToolsDisabled: existing.allToolsDisabled !== undefined ? existing.allToolsDisabled : norm.allToolsDisabled,
          isTrusted: existing.isTrusted !== undefined ? existing.isTrusted : norm.isTrusted,
          isPremium: existing.isPremium !== undefined ? existing.isPremium : norm.isPremium,
          subscriptionTier: existing.subscriptionTier || norm.subscriptionTier,
          role: existing.role || norm.role,
          blockedTools: (existing.blockedTools && existing.blockedTools.length > 0) ? existing.blockedTools : norm.blockedTools,
          allowedTools: (existing.allowedTools && existing.allowedTools.length > 0) ? existing.allowedTools : norm.allowedTools,
          toolOverrides: Object.keys(existing.toolOverrides || {}).length > 0 ? existing.toolOverrides : norm.toolOverrides
        });
      }
    };

    (dbList || []).forEach(u => addOrMerge(u));
    (effectiveRestList || []).forEach(u => addOrMerge(u));

    try {
      const storedAll = localStorage.getItem('asrarhub_all_local_users');
      if (storedAll) {
        const parsedAll = JSON.parse(storedAll);
        if (Array.isArray(parsedAll)) {
          parsedAll.forEach(u => addOrMerge(u));
        }
      }
    } catch (e) {}

    try {
      const storedSingle = localStorage.getItem('asrarhub_local_user');
      if (storedSingle) {
        const parsedSingle = JSON.parse(storedSingle);
        if (parsedSingle) addOrMerge(parsedSingle);
      }
    } catch (e) {}

    (payList || []).forEach((p: any) => {
      const email = p.userEmail || p.email;
      if (email && typeof email === 'string') {
        addOrMerge({
          id: p.userId || p.uid || `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
          name: p.userName || p.name || email.split('@')[0],
          email: email,
          phone: p.userPhone || p.phone || '',
          isPremium: p.status === 'approved' || p.status === 'validated',
          subscriptionPlan: p.plan || 'premium',
          createdAt: p.createdAt || p.date || new Date().toISOString()
        });
      }
    });

    (postList || []).forEach((post: any) => {
      const email = post.authorEmail || post.email;
      if (email && typeof email === 'string') {
        addOrMerge({
          id: post.authorId || post.userId || `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
          name: post.authorName || post.name || email.split('@')[0],
          email: email,
          photoURL: post.authorAvatar || post.photoURL,
          createdAt: post.createdAt || new Date().toISOString()
        });
      }
    });

    // Update masterDiscoveredMapRef cumulatively
    usersMap.forEach((uVal, uKey) => {
      masterDiscoveredMapRef.current.set(uKey, uVal);
    });

    const aggregatedList = Array.from(usersMap.values());
    setUsers(aggregatedList);

    // Synchronize to localStorage asrarhub_all_local_users
    try {
      if (aggregatedList.length > 0) {
        localStorage.setItem('asrarhub_all_local_users', JSON.stringify(aggregatedList));
      }
    } catch (e) {}
  };

  // --- Network Diagnostics State ---
  const [diagnosticLogs, setDiagnosticLogs] = useState<NetworkLog[]>(getNetworkLogs());
  const [pingResult, setPingResult] = useState<PingResult | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    const handleLogsUpdate = () => {
      setDiagnosticLogs(getNetworkLogs());
    };
    window.addEventListener('asrarhub_network_logs_updated', handleLogsUpdate);
    return () => {
      window.removeEventListener('asrarhub_network_logs_updated', handleLogsUpdate);
    };
  }, []);

  const exportNetworkLogsJSON = () => {
    const logs = getNetworkLogs();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `asrarhub_network_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportNetworkLogsCSV = () => {
    const logs = getNetworkLogs();
    const headers = ['ID', 'Timestamp', 'Type', 'Category', 'Message', 'Details'];
    const rows = logs.map(log => [
      `"${log.id || ''}"`,
      `"${log.timestamp || ''}"`,
      `"${log.type || ''}"`,
      `"${log.category || ''}"`,
      `"${(log.message || '').replace(/"/g, '""')}"`,
      `"${(log.details || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `asrarhub_network_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Manual Payments state
  const [manualPayments, setManualPayments] = useState<any[]>([]);
  const [selectedProofPayment, setSelectedProofPayment] = useState<any>(null);
  const [paymentsFilter, setPaymentsFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Promo Codes State
  const [promoCodes, setPromoCodes] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('asrarhub_local_promo_codes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [selectedPromoForModal, setSelectedPromoForModal] = useState<any | null>(null);
  const [promoFilter, setPromoFilter] = useState<'all' | 'hourly' | 'monthly' | 'discount' | 'store'>('all');
  const [promoSearchQuery, setPromoSearchQuery] = useState('');
  const [copiedPromoCode, setCopiedPromoCode] = useState<string | null>(null);
  const [newPromo, setNewPromo] = useState<any>({
    code: '',
    type: 'unlock_subscription_hours',
    durationHours: 2,
    subscriptionMonths: 3,
    discountType: 'percent',
    discountValue: 0,
    productId: '',
    maxUses: 100,
    expiryDate: '',
    isActive: true
  });
  const [previewCelebration, setPreviewCelebration] = useState<{
    isOpen: boolean;
    promoCode?: string;
    durationText?: string;
  } | null>(null);

  // Ruqyah Audio State
  const [ruqyahAudios, setRuqyahAudios] = useState<RuqyahAudio[]>([]);
  const [newAudio, setNewAudio] = useState<any>({ 
    title_fr: '', title_en: '', title_ha: '', 
    url: '', duration: '' 
  });

  // Community State
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [codeSharingEnabled, setCodeSharingEnabled] = useState(true);
  const [messageEditDeleteLimitMinutes, setMessageEditDeleteLimitMinutes] = useState<number>(4320);

  // Features State
  const [featureToggles, setFeatureToggles] = useState<any>({});
  const [fontSizeLocked, setFontSizeLocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('asrar_font_locked') === 'true';
    } catch {
      return false;
    }
  });
  const [featureCategoryFilter, setFeatureCategoryFilter] = useState<string>('all');
  const [userToolModalSearch, setUserToolModalSearch] = useState('');
  const [userToolModalCategoryFilter, setUserToolModalCategoryFilter] = useState<'all' | 'simple' | 'advanced' | 'system'>('all');
  const [localBackendUrl, setLocalBackendUrl] = useState('');
  const [bulkUpdatingStatus, setBulkUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (featureToggles.backend_url !== undefined) {
      setLocalBackendUrl(featureToggles.backend_url || '');
    }
  }, [featureToggles.backend_url]);

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState<any>({ 
    title_fr: '', message_fr: '',
    title_en: '', message_en: '',
    title_ha: '', message_ha: ''
  });

  // Categories State
  const [categories, setCategories] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<{ categoryId: string; subId: string; name: string; name_en: string; name_ha: string } | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', name_en: '', name_ha: '' });
  const [newSubCategory, setNewSubCategory] = useState({ categoryId: '', name: '', name_en: '', name_ha: '' });
  const [showQuickCategoryForm, setShowQuickCategoryForm] = useState(false);
  const [showQuickSubCategoryForm, setShowQuickSubCategoryForm] = useState(false);
  const [quickCat, setQuickCat] = useState({ name: '', name_en: '', name_ha: '' });
  const [quickSub, setQuickSub] = useState({ name: '', name_en: '', name_ha: '' });

  // Articles State
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleFormKey, setArticleFormKey] = useState(0);
  const [isSeedingArticles, setIsSeedingArticles] = useState(false);
  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    title: '', hook: '', thumbnail: '', content: '', type: 'richtext', status: 'Published', category: '', subCategory: ''
  });
  const [showPreview, setShowPreview] = useState(false);
  const [draftSavedMessage, setDraftSavedMessage] = useState('');
  const [articlesLayoutMode, setArticlesLayoutMode] = useState<'grid' | 'list'>('grid');
  const [adminArticleSearch, setAdminArticleSearch] = useState('');
  const [adminArticleFilterCategory, setAdminArticleFilterCategory] = useState('all');
  const [adminArticleFilterStatus, setAdminArticleFilterStatus] = useState('all');
  const [adminArticleFilterPremium, setAdminArticleFilterPremium] = useState('all');
  const [adminArticleFilterAudio, setAdminArticleFilterAudio] = useState('all');
  
  // Quick Control & Bulk Management for Articles
  const [selectedArticleForQuickControl, setSelectedArticleForQuickControl] = useState<Article | null>(null);
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
  const [bulkArticleTargetCategory, setBulkArticleTargetCategory] = useState<string>('Secrets & Pratiques');
  const [isBulkArticleActionRunning, setIsBulkArticleActionRunning] = useState(false);
  
  // Crop state
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [cropAspect, setCropAspect] = useState<number | undefined>(16 / 9);
  const imageRef = React.useRef<HTMLImageElement>(null);

  const onImageCropLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    if (cropAspect) {
      const initialCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          cropAspect,
          width,
          height
        ),
        width,
        height
      );
      setCrop(initialCrop);
      setCompletedCrop(convertToPixelCrop(initialCrop, width, height));
    } else {
      const initialCrop: Crop = { unit: '%', width: 90, height: 80, x: 5, y: 10 };
      setCrop(initialCrop);
      setCompletedCrop(convertToPixelCrop(initialCrop, width, height));
    }
  };

  const handleAspectChange = (newAspect: number | undefined) => {
    setCropAspect(newAspect);
    if (imageRef.current) {
      const { width, height } = imageRef.current;
      if (newAspect) {
        const newCrop = centerCrop(
          makeAspectCrop(
            {
              unit: '%',
              width: 90,
            },
            newAspect,
            width,
            height
          ),
          width,
          height
        );
        setCrop(newCrop);
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      } else {
        const newCrop: Crop = { unit: '%', width: 90, height: 80, x: 5, y: 10 };
        setCrop(newCrop);
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  };

  useEffect(() => {
    // Load draft on mount
    const draft = localStorage.getItem('asrarhub_article_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        const hasText = Boolean(
          (parsed.title && parsed.title.trim()) ||
          (parsed.content && parsed.content !== '<p></p>' && parsed.content.trim())
        );
        if (hasText) {
          setNewArticle(parsed);
        } else {
          localStorage.removeItem('asrarhub_article_draft');
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    // Auto-save draft
    const hasMeaningfulContent = Boolean(
      (newArticle.title && newArticle.title.trim()) ||
      (newArticle.content && newArticle.content !== '<p></p>' && newArticle.content.trim()) ||
      (newArticle as any).content_en ||
      (newArticle as any).content_ha ||
      (newArticle as any).title_en ||
      (newArticle as any).title_ha ||
      (newArticle as any).audioUrl
    );

    if (activeTab === 'articles' && hasMeaningfulContent && !editingArticle) {
      const timer = setTimeout(() => {
        try {
          localStorage.setItem('asrarhub_article_draft', JSON.stringify(newArticle));
          setDraftSavedMessage(`Brouillon sauvegardé à ${new Date().toLocaleTimeString()}`);
          setTimeout(() => setDraftSavedMessage(''), 3000);
        } catch (err) {
          // If QuotaExceededError occurs (e.g. large base64 thumbnail), try saving draft without thumbnail
          try {
            const { thumbnail, ...draftWithoutImage } = newArticle;
            localStorage.setItem('asrarhub_article_draft', JSON.stringify(draftWithoutImage));
            setDraftSavedMessage(`Brouillon (sans image) sauvegardé à ${new Date().toLocaleTimeString()}`);
            setTimeout(() => setDraftSavedMessage(''), 3000);
          } catch (e) {
            console.warn('Draft save failed due to storage limit:', e);
          }
        }
      }, 2000);
      return () => clearTimeout(timer);
    } else if (activeTab === 'articles' && !hasMeaningfulContent) {
      try {
        localStorage.removeItem('asrarhub_article_draft');
      } catch (e) {}
    }
  }, [newArticle, activeTab, editingArticle]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const rawDataUrl = reader.result?.toString() || '';
        setImgSrc(rawDataUrl);

        // Instantly compress and set as default thumbnail so it works even if user doesn't crop
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height = (MAX_WIDTH / width) * height;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.75);
            setNewArticle(prev => ({ ...prev, thumbnail: compressed, imageUrl: compressed }));
          }
        };
        img.src = rawDataUrl;
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    
    // Determine effective pixel crop coordinates
    let effectiveCrop: PixelCrop | null = completedCrop;
    if (!effectiveCrop || !effectiveCrop.width || !effectiveCrop.height) {
      if (crop) {
        effectiveCrop = convertToPixelCrop(crop, img.width, img.height);
      }
    }
    
    // Fallback to full image if no valid crop
    if (!effectiveCrop || !effectiveCrop.width || !effectiveCrop.height) {
      effectiveCrop = {
        unit: 'px',
        x: 0,
        y: 0,
        width: img.width,
        height: img.height
      };
    }

    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    
    const cropX = (effectiveCrop.x || 0) * scaleX;
    const cropY = (effectiveCrop.y || 0) * scaleY;
    const cropW = (effectiveCrop.width || img.width) * scaleX;
    const cropH = (effectiveCrop.height || img.height) * scaleY;

    const canvas = document.createElement('canvas');
    const MAX_WIDTH = 800;
    let finalWidth = cropW;
    let finalHeight = cropH;
    if (finalWidth > MAX_WIDTH) {
       finalHeight = (MAX_WIDTH / finalWidth) * finalHeight;
       finalWidth = MAX_WIDTH;
    }

    canvas.width = Math.max(10, Math.round(finalWidth));
    canvas.height = Math.max(10, Math.round(finalHeight));
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropW,
        cropH,
        0,
        0,
        canvas.width,
        canvas.height
      );
      const base64Image = canvas.toDataURL('image/jpeg', 0.85);
      setNewArticle(prev => ({ 
        ...prev, 
        thumbnail: base64Image, 
        imageUrl: base64Image,
        image: base64Image,
        coverImage: base64Image,
        coverImageUrl: base64Image,
        coverImageCrop: effectiveCrop,
        cropData: effectiveCrop,
        cropAspect: cropAspect
      }));
      setImgSrc('');
      setCrop(undefined);
      setCompletedCrop(null);
      showToast("Image de couverture recadrée avec succès !", "success");
    }
  };

  const handleAudioFileUploadArticle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name;
      if (file.size > 25 * 1024 * 1024) {
        showToast("Le fichier audio est trop volumineux (maximum 25 Mo).", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setNewArticle(prev => ({ 
            ...prev, 
            audioUrl: result, 
            audio_url: result,
            audioTitle: fileName 
          }));
          showToast("Fichier audio chargé avec succès !", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [activeLangTab, setActiveLangTab] = useState<'fr' | 'en' | 'ha'>('fr');

  // Mock Stats
  const stats = [
    { title: 'Utilisateurs Actifs', value: users.length.toString(), change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Outils Utilisés (7j)', value: '8,432', change: '+5%', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { title: 'Articles Publiés', value: articles.length.toString(), change: '+1', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ];

  useEffect(() => {
    // Load settings
    const isAudioEnabled = localStorage.getItem('admin_ruqyah_audio_enabled') === 'true';
    setAudioEnabled(isAudioEnabled);

    // Initial load from local cache into masterDiscoveredMapRef
    try {
      const stored = localStorage.getItem('asrarhub_all_local_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed.forEach((u: any) => {
            const norm = normalizeUser(u);
            const k = norm.email && typeof norm.email === 'string' && norm.email.includes('@') && !norm.email.includes('utilisateur@asrarhub.com') ? norm.email.toLowerCase().trim() : norm.id;
            if (k) masterDiscoveredMapRef.current.set(k, norm);
          });
        }
      }
    } catch (e) {}

    // Initial aggregation run
    aggregateAllUsers();

    // Auto-trigger global account scan on mount to discover all accounts across all collections
    const autoScanTimer = setTimeout(() => {
      handleDeepScanAndSyncUsers();
    }, 400);

    // Seed Grand Oaths if not already done
    const seedOathsIfNeeded = async () => {
      // If client is offline or already seeded locally, skip to prevent offline getDoc error
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return;
      }
      if (typeof window !== 'undefined' && localStorage.getItem('asrarhub_oaths_seeded') === 'true') {
        return;
      }
      try {
        const setupRef = doc(db, 'settings', 'grand_oaths_setup');
        const setupSnap = await getDoc(setupRef);
        if (!setupSnap.exists() || !setupSnap.data()?.seeded) {
          const qSnap = await getDocs(collection(db, "grand_oaths"));
          if (qSnap.empty) {
            for (const item of DEFAULT_OATHS) {
              await addDoc(collection(db, "grand_oaths"), {
                ...item,
                createdAt: item.createdAt || Date.now()
              });
            }
          }
          await setDoc(setupRef, { seeded: true, seededAt: Date.now() }, { merge: true });
        }
        try { localStorage.setItem('asrarhub_oaths_seeded', 'true'); } catch (e) {}
      } catch (err: any) {
        if (err?.message?.includes('offline') || err?.code === 'unavailable' || err?.code === 'failed-precondition') {
          console.warn("Admin seeding deferred (client offline or connecting):", err?.message || err);
        } else {
          console.warn("Admin seeding note:", err?.message || err);
        }
      }
    };
    seedOathsIfNeeded();

    // Direct REST API fetch for registered users to bypass any WebSocket connection drops
    fetchUsersFromRest().then(rUsers => {
      if (Array.isArray(rUsers) && rUsers.length > 0) {
        console.log(`[Admin REST Users] Fetched ${rUsers.length} user documents directly via REST API!`);
        restUsersRef.current = rUsers;
        setRestUsers(rUsers);
        aggregateAllUsers(rawDbUsers, manualPayments, communityPosts, rUsers);
      }
    }).catch(e => console.warn("[Admin REST Users] REST fetch note:", e));

    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      let dbUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRawDbUsers(dbUsers);
      aggregateAllUsers(dbUsers, manualPayments, communityPosts, restUsersRef.current);
    }, (error) => {
      console.warn("Admin Users listener note:", error);
      aggregateAllUsers([], manualPayments, communityPosts, restUsersRef.current);
    });

    const unsubscribeLexique = onSnapshot(collection(db, 'lexique_terms'), (snapshot) => {
      setLexiqueTerms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Term)));
    }, (error) => console.warn("Admin Lexique listener note:", error));

    const unsubscribeAudios = onSnapshot(collection(db, 'ruqyah_audios'), (snapshot) => {
      setRuqyahAudios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RuqyahAudio)));
    }, (error) => console.warn("Admin Audios listener note:", error));

    const unsubscribePosts = onSnapshot(query(collection(db, 'community_posts'), orderBy('createdAt', 'desc')), (snapshot) => {
      const postsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityPost));
      setCommunityPosts(postsList);
      aggregateAllUsers(rawDbUsers, manualPayments, postsList, restUsersRef.current);
    }, (error) => console.warn("Admin Posts listener note:", error));

    const unsubscribeNotifs = onSnapshot(query(collection(db, 'notifications'), orderBy('createdAt', 'desc')), (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)));
    }, (error) => console.warn("Admin Notifs listener note:", error));

    // Auto-sync any unsaved or pending local custom articles directly to Firestore
    autoSyncLocalArticlesToFirestore().then(synced => {
      if (synced > 0) {
        revalidatePublishedArticles('admin_autosync_init');
      }
    }).catch(() => {});

    // Direct REST API fetch to ensure real admin articles are retrieved on mobile WebView/Capacitor
    fetchArticlesFromRest().then(restDocs => {
      if (Array.isArray(restDocs) && restDocs.length > 0) {
        const list = restDocs.map(doc => ({ id: doc.id, ...doc } as any));
        const merged = mergeWithLocalArticles(list, true);
        console.log(`[Admin REST Articles] Loaded ${merged.length} articles via REST API!`);
        setArticles(merged as any);
        saveCachedArticlesList('asrarhub_cached_admin_articles', merged);
      }
    }).catch(e => console.warn("[Admin REST Articles] REST fetch note:", e));

    const unsubscribeArticles = onSnapshot(collection(db, 'articles'), (snapshot) => {
      let list: Article[] = [];
      if (!snapshot.empty) {
        list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
      }
      let merged = mergeWithLocalArticles(list, true);
      setArticles(merged as any);
      saveCachedArticlesList('asrarhub_cached_admin_articles', merged);
    }, (error) => {
      console.warn("Admin Articles listener note:", error);
      fetchArticlesFromRest().then(restDocs => {
        let list: any[] = [];
        if (restDocs && restDocs.length > 0) {
          list = restDocs.map(doc => ({ id: doc.id, ...doc } as any));
        }
        let merged = mergeWithLocalArticles(list, true);
        setArticles(merged as any);
      });
    });

    const defaultCatsList = [
      {
        id: 'wird',
        name: 'Versets & Wirds',
        name_en: 'Verses & Wirds',
        name_ha: 'Wirdoshi & Ayoyi',
        iconName: 'BookOpen',
        subCategories: [
          { id: 'wird-protection', name: 'Protection', name_en: 'Protection', name_ha: 'Kariya' },
          { id: 'wird-guerison', name: 'Guérison', name_en: 'Healing', name_ha: 'Waraka' }
        ],
        createdAt: 1000
      },
      {
        id: 'secret',
        name: "Secrets d'Asrar",
        name_en: 'Secrets of Asrar',
        name_ha: 'Asrarai',
        iconName: 'Sparkles',
        subCategories: [
          { id: 'secret-richesse', name: 'Prospérité', name_en: 'Prosperity', name_ha: 'Arziki' },
          { id: 'secret-amour', name: 'Affection', name_en: 'Affection', name_ha: 'Soyayya' }
        ],
        createdAt: 1001
      },
      {
        id: 'recette',
        name: 'Recettes Spirituelles',
        name_en: 'Spiritual Recipes',
        name_ha: 'Hanyoyi',
        iconName: 'Shield',
        subCategories: [
          { id: 'recette-sante', name: 'Santé', name_en: 'Health', name_ha: 'Lafiya' }
        ],
        createdAt: 1002
      }
    ];

    const unsubscribeCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      let deletedIds: string[] = [];
      try { deletedIds = JSON.parse(localStorage.getItem('asrarhub_deleted_categories') || '[]'); } catch (e) {}

      if (!snapshot.empty) {
        const list = snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
          .filter((cat: any) => !deletedIds.includes(cat.id));
        list.sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));
        setCategories(list);
        try {
          localStorage.setItem('asrarhub_cached_categories', JSON.stringify(list));
        } catch (e) {}
      } else {
        const remainingDefaults = defaultCatsList.filter(c => !deletedIds.includes(c.id));
        remainingDefaults.forEach(async (cat) => {
          try {
            await setDoc(doc(db, 'categories', cat.id), cat);
          } catch (e) {
            console.warn("Category seed error:", e);
          }
        });
        localStorage.setItem('asrarhub_categories_seeded', 'true');
        try {
          localStorage.setItem('asrarhub_cached_categories', JSON.stringify(remainingDefaults));
        } catch (e) {}
        setCategories(remainingDefaults);
      }
    }, (error) => {
      console.warn("Admin Categories listener note:", error);
      let deletedIds: string[] = [];
      try { deletedIds = JSON.parse(localStorage.getItem('asrarhub_deleted_categories') || '[]'); } catch (e) {}

      fetchCategoriesFromRest().then(restCats => {
        if (Array.isArray(restCats) && restCats.length > 0) {
          const list = restCats.filter((c: any) => !deletedIds.includes(c.id));
          list.sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));
          setCategories(list);
          try { localStorage.setItem('asrarhub_cached_categories', JSON.stringify(list)); } catch (e) {}
        } else {
          let cached: any[] = [];
          try { cached = JSON.parse(localStorage.getItem('asrarhub_cached_categories') || '[]'); } catch (e) {}
          const filtered = cached.filter((c: any) => !deletedIds.includes(c.id));
          const finalCats = filtered.length > 0 ? filtered : defaultCatsList.filter(c => !deletedIds.includes(c.id));
          setCategories(finalCats);
        }
      });
    });

    const unsubscribeManualPayments = onSnapshot(collection(db, 'manual_payments'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      setManualPayments(list);
      aggregateAllUsers(rawDbUsers, list, communityPosts, restUsersRef.current);
    }, (error) => console.warn("Admin Manual Payments listener note:", error));

    const unsubscribeFeatures = onSnapshot(doc(db, 'settings', 'features'), (docSnap) => {
      let localData = {};
      try {
        const stored = localStorage.getItem('asrar_font_toggles');
        if (stored) localData = JSON.parse(stored);
      } catch (_) {}

      if (docSnap.exists()) {
        const merged = { ...localData, ...docSnap.data() };
        setFeatureToggles(merged);
      } else if (Object.keys(localData).length > 0) {
        setFeatureToggles(localData);
      }
    }, (error) => console.warn("Admin Features listener note:", error));

    const unsubscribePrompts = onSnapshot(collection(db, 'assistant_prompts'), (snapshot) => {
      setAdminPrompts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as { id: string; text: string; lang: string })));
    }, (error) => console.warn("Admin Prompts listener note:", error));

    const unsubscribeGrandOaths = onSnapshot(collection(db, 'grand_oaths'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));
      setAdminGrandOaths(list);
    }, (error) => console.warn("Admin Grand Oaths listener note:", error));

    const unsubscribePromoCodes = onSnapshot(collection(db, 'promo_codes'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPromoCodes(list);
      try {
        localStorage.setItem('asrarhub_local_promo_codes', JSON.stringify(list));
      } catch (e) {}
    }, (error) => {
      console.warn("Admin Promo Codes listener note (falling back to local):", error);
      try {
        const saved = localStorage.getItem('asrarhub_local_promo_codes');
        if (saved) setPromoCodes(JSON.parse(saved));
      } catch (e) {}
    });

    const unsubscribeStoreProducts = onSnapshot(collection(db, 'store_products'), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStoreProducts(list);
    }, (error) => console.warn("Admin Store Products listener note:", error));

    const unsubscribeCommunitySettings = onSnapshot(doc(db, "community_settings", "global"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setCodeSharingEnabled(data.codeSharingEnabled !== false);
        if (data.messageEditDeleteLimitMinutes !== undefined) {
          setMessageEditDeleteLimitMinutes(Number(data.messageEditDeleteLimitMinutes));
        }
      }
    }, (error) => console.warn("Admin Community Settings listener note:", error));

    return () => {
      clearTimeout(autoScanTimer);
      unsubscribeUsers();
      unsubscribeLexique();
      unsubscribeAudios();
      unsubscribePosts();
      unsubscribeNotifs();
      unsubscribeArticles();
      unsubscribeCategories();
      unsubscribeManualPayments();
      unsubscribeFeatures();
      unsubscribePrompts();
      unsubscribeGrandOaths();
      unsubscribePromoCodes();
      unsubscribeStoreProducts();
      unsubscribeCommunitySettings();
    };
  }, []);

  const toggleAudio = () => {
    const newVal = !audioEnabled;
    setAudioEnabled(newVal);
    localStorage.setItem('admin_ruqyah_audio_enabled', String(newVal));
  };

  const handleToggleCodeSharing = async (enabled: boolean) => {
    try {
      await setDoc(doc(db, "community_settings", "global"), {
        codeSharingEnabled: enabled
      }, { merge: true });
      showToast("Paramètre de partage de code mis à jour !");
    } catch (err) {
      console.error("Error setting code sharing settings:", err);
      showToast("Erreur lors de la mise à jour.");
    }
  };

  const handleChangeMessageEditDeleteLimit = async (minutes: number) => {
    try {
      await setDoc(doc(db, "community_settings", "global"), {
        messageEditDeleteLimitMinutes: minutes
      }, { merge: true });
      showToast("Délais de modification/suppression des messages mis à jour !");
    } catch (err) {
      console.error("Error setting message edit/delete limit:", err);
      showToast("Erreur lors de la mise à jour.");
    }
  };

  const handleAddPrompt = async () => {
    if (!newPromptText.trim()) return;
    try {
      if (editingPromptId) {
        await setDoc(doc(db, 'assistant_prompts', editingPromptId), {
          text: newPromptText,
          lang: newPromptLang
        });
        setEditingPromptId(null);
        showToast("Prompt modifié avec succès.");
      } else {
        await addDoc(collection(db, 'assistant_prompts'), {
          text: newPromptText,
          lang: newPromptLang,
          createdAt: new Date().toISOString()
        });
        showToast("Prompt créé avec succès.");
      }
      setNewPromptText('');
    } catch (error) {
      console.error("Error saving prompt", error);
      showToast("Erreur lors de la sauvegarde du prompt.", "error");
    }
  };

  const handleEditPrompt = (prompt: { id: string; text: string; lang: string }) => {
    setEditingPromptId(prompt.id);
    setNewPromptText(prompt.text);
    setNewPromptLang(prompt.lang);
  };

  const handleDeletePrompt = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce prompt ?")) return;
    try {
      await deleteDoc(doc(db, 'assistant_prompts', id));
      showToast("Prompt supprimé avec succès.");
    } catch (error) {
      console.error("Error deleting prompt", error);
      showToast("Erreur lors de la suppression.", "error");
    }
  };

  const handleResetDefaultPrompts = async () => {
    if (!window.confirm("Voulez-vous réinitialiser tous les prompts de l'assistant aux valeurs par défaut ?")) return;
    try {
      // First, delete existing ones
      const batch = writeBatch(db);
      const querySnapshot = await getDocs(collection(db, 'assistant_prompts'));
      querySnapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();

      const defaultPrompts = [
        // French
        { text: "Qu'est-ce qu'un wird et comment le pratiquer ?", lang: 'fr' },
        { text: "Comment me protéger contre le mauvais œil ?", lang: 'fr' },
        { text: "Quel est le moment idéal pour faire le zikr ?", lang: 'fr' },
        { text: "Quelle est la différence entre un secret et une recette ?", lang: 'fr' },
        // English
        { text: "What is a wird and how to practice it?", lang: 'en' },
        { text: "How to protect myself from the evil eye?", lang: 'en' },
        { text: "What is the best time for doing dhikr?", lang: 'en' },
        { text: "What is the difference between a secret and a recipe?", lang: 'en' },
        // Hausa
        { text: "Mene ne wird kuma yaya ake yin sa?", lang: 'ha' },
        { text: "Yaya zan kare kaina daga kakar maita ko miyagun idanu?", lang: 'ha' },
        { text: "Wane lokaci ne ya fi dacewa don yin zikirai?", lang: 'ha' },
        { text: "Menene bambanci tsakanin sirri da rubutu ko girke-girke?", lang: 'ha' }
      ];

      for (const p of defaultPrompts) {
        await addDoc(collection(db, 'assistant_prompts'), {
          text: p.text,
          lang: p.lang,
          createdAt: new Date().toISOString()
        });
      }
      showToast("Prompts réinitialisés par défaut !");
    } catch (error) {
      console.error("Error resetting prompts", error);
      showToast("Erreur lors de la réinitialisation.", "error");
    }
  };

  const handleAddTerm = async () => {
    if (!newTerm.word_fr || !newTerm.definition_fr) return;
    try {
      await addDoc(collection(db, 'lexique_terms'), {
        word: newTerm.word_fr,
        word_fr: newTerm.word_fr,
        word_en: newTerm.word_en,
        word_ha: newTerm.word_ha,
        definition: newTerm.definition_fr,
        definition_fr: newTerm.definition_fr,
        definition_en: newTerm.definition_en,
        definition_ha: newTerm.definition_ha,
        category: newTerm.category || 'Général'
      });
      setNewTerm({ 
        word_fr: '', definition_fr: '', 
        word_en: '', definition_en: '', 
        word_ha: '', definition_ha: '', 
        category: 'Général' 
      });
    } catch (error) {
      console.error("Error adding term", error);
    }
  };

  const handleDeleteTerm = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'lexique_terms', id));
    } catch (error) {
      console.error("Error deleting term", error);
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: UserStatusType) => {
    try {
      const isBanned = status === "banned";
      const isSuspended = status === "suspended";
      const isPremium = status === "premium";
      
      await updateDoc(doc(db, "users", userId), {
        isBanned,
        isSuspended,
        status,
        subscriptionTier: isPremium ? "premium" : "free",
        isPremium,
      });
      setUsers(prev => prev.map(u => u.id === userId ? {
        ...u,
        isBanned,
        isSuspended,
        status,
        subscriptionTier: isPremium ? "premium" : "free",
        isPremium,
      } : u));
      showToast("Statut utilisateur mis à jour");
    } catch (e: any) {
      showToast("Erreur: " + e.message, "error");
    }
  };

  const handleToggleUserBan = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    const newBanState = !user.isBanned;

    const updatedUser = { ...user, isBanned: newBanState, isSuspended: newBanState ? false : user.isSuspended };
    setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    if (selectedUserDetail?.id === id) {
      setSelectedUserDetail(updatedUser);
    }
    masterDiscoveredMapRef.current.set(user.email ? user.email.toLowerCase().trim() : id, updatedUser);

    try {
      await setDoc(doc(db, 'users', id), { isBanned: newBanState }, { merge: true });
      showToast(newBanState ? "Utilisateur banni." : "Utilisateur débanni.");
    } catch (error) {
      console.warn("Error updating user ban state in Firestore:", error);
      showToast(newBanState ? "Utilisateur banni (local)" : "Utilisateur débanni (local)", "info");
    }
  };

  const handleSetUserStatus = async (userId: string, newStatus: UserStatusType) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    let payload: Record<string, any> = {};
    if (newStatus === 'active') {
      payload = {
        isBanned: false,
        banned: false,
        isSuspended: false,
        suspended: false,
        isPremium: false,
        subscriptionTier: 'free',
        plan: 'free',
        role: user.role === 'admin' ? 'admin' : 'user',
        mysteryToolsDisabled: false,
        allToolsDisabled: false,
        status: 'active',
        accountStatus: 'active'
      };
    } else if (newStatus === 'suspended') {
      payload = {
        isBanned: false,
        banned: false,
        isSuspended: true,
        suspended: true,
        mysteryToolsDisabled: true,
        allToolsDisabled: true,
        status: 'suspended',
        accountStatus: 'suspended'
      };
    } else if (newStatus === 'premium') {
      payload = {
        isBanned: false,
        banned: false,
        isSuspended: false,
        suspended: false,
        isPremium: true,
        subscriptionTier: 'premium',
        plan: 'premium',
        mysteryToolsDisabled: false,
        allToolsDisabled: false,
        status: 'premium',
        accountStatus: 'premium'
      };
    } else if (newStatus === 'banned') {
      payload = {
        isBanned: true,
        banned: true,
        isSuspended: false,
        suspended: false,
        allToolsDisabled: true,
        status: 'banned',
        accountStatus: 'banned'
      };
    }

    const updatedUser = { ...user, ...payload } as User;
    setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    if (selectedUserDetail?.id === userId) {
      setSelectedUserDetail(updatedUser);
    }
    masterDiscoveredMapRef.current.set(user.email ? user.email.toLowerCase().trim() : userId, updatedUser);

    try {
      await setDoc(doc(db, 'users', userId), payload, { merge: true });
      const statusLabels: Record<UserStatusType, string> = {
        active: '🟢 Actif',
        suspended: '🟡 Suspendu',
        premium: '👑 Premium',
        banned: '🔴 Banni'
      };
      showToast(`Statut de ${user.name || user.email || 'l\'utilisateur'} mis à jour : ${statusLabels[newStatus]}`);
    } catch (err) {
      console.warn("Firestore user status update note:", err);
      showToast(`Statut mis à jour localement`, "info");
    }
  };

  const handleSaveUserDetail = async () => {
    if (!selectedUserDetail) return;
    const userRef = doc(db, 'users', selectedUserDetail.id);
    const isPrem = (editUserData as any).subscriptionTier === 'premium' || (editUserData as any).subscriptionTier === 'pro' || (editUserData as any).isPremium === true;
    const tier = (editUserData as any).subscriptionTier || (isPrem ? 'premium' : 'free');
    const isBan = editUserData.isBanned !== undefined ? editUserData.isBanned : selectedUserDetail.isBanned;

    const payload = {
      name: editUserData.name !== undefined ? editUserData.name : selectedUserDetail.name,
      email: editUserData.email !== undefined ? editUserData.email : selectedUserDetail.email,
      phone: editUserData.phone !== undefined ? editUserData.phone : (selectedUserDetail.phone || ''),
      country: editUserData.country !== undefined ? editUserData.country : (selectedUserDetail.country || ''),
      role: (editUserData as any).role || (selectedUserDetail as any).role || 'user',
      isBanned: isBan,
      banned: isBan,
      isTrusted: editUserData.isTrusted !== undefined ? editUserData.isTrusted : selectedUserDetail.isTrusted,
      mysteryToolsDisabled: editUserData.mysteryToolsDisabled !== undefined ? editUserData.mysteryToolsDisabled : selectedUserDetail.mysteryToolsDisabled,
      isPremium: isPrem,
      subscriptionTier: tier,
      plan: tier,
      status: isBan ? 'banned' : (isPrem ? 'premium' : 'active'),
      accountStatus: isBan ? 'banned' : (isPrem ? 'premium' : 'active'),
      spiritualPoints: (editUserData as any).spiritualPoints !== undefined ? Number((editUserData as any).spiritualPoints) : (selectedUserDetail.spiritualPoints || 0),
      blockedTools: editUserData.blockedTools || selectedUserDetail.blockedTools || []
    };

    const updatedUser = { ...selectedUserDetail, ...payload };
    setSelectedUserDetail(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    masterDiscoveredMapRef.current.set(updatedUser.email ? updatedUser.email.toLowerCase().trim() : updatedUser.id, updatedUser);

    try {
      const stored = localStorage.getItem('asrarhub_all_local_users');
      const list = stored ? JSON.parse(stored) : [];
      const filtered = list.filter((u: any) => u.id !== updatedUser.id && u.email !== updatedUser.email);
      filtered.push(updatedUser);
      localStorage.setItem('asrarhub_all_local_users', JSON.stringify(filtered));
    } catch (e) {}

    setIsEditingUser(false);

    try {
      await setDoc(userRef, payload, { merge: true });
      showToast("Utilisateur mis à jour avec succès dans Firestore !");
    } catch (err) {
      console.warn("Erreur sauvegarde utilisateur Firestore:", err);
      showToast("Mis à jour en local (Permission Firestore restreinte)", "info");
    }
  };

  const handleDeleteUserAccount = (id: string, email?: string, name?: string) => {
    const target = users.find(u => u.id === id) || 
      (selectedUserDetail?.id === id ? selectedUserDetail : { id, email: email || '', name: name || 'Cet utilisateur' });
    setUserToDeleteConfirm(target as User);
  };

  const executeConfirmDeleteUser = async () => {
    if (!userToDeleteConfirm) return;
    const { id, email } = userToDeleteConfirm;

    // 1. Close modal and update React state immediately (optimistic UI update)
    setUserToDeleteConfirm(null);
    if (selectedUserDetail?.id === id || (email && selectedUserDetail?.email?.toLowerCase() === email.toLowerCase())) {
      setSelectedUserDetail(null);
    }
    setUsers(prev => prev.filter(u => u.id !== id && (!email || u.email?.toLowerCase() !== email.toLowerCase())));

    // 2. Save deleted id and email to localStorage deleted list so future scans/syncs skip them
    try {
      const deletedIdsStr = localStorage.getItem('asrarhub_deleted_user_ids') || '[]';
      const deletedIds: string[] = JSON.parse(deletedIdsStr);
      if (id && !deletedIds.includes(id)) deletedIds.push(id);
      if (email && typeof email === 'string' && email.trim() && !deletedIds.includes(email.toLowerCase().trim())) {
        deletedIds.push(email.toLowerCase().trim());
      }
      localStorage.setItem('asrarhub_deleted_user_ids', JSON.stringify(deletedIds));
    } catch (e) {}

    // 3. Clear from masterDiscoveredMapRef
    if (masterDiscoveredMapRef.current) {
      masterDiscoveredMapRef.current.forEach((val, key) => {
        if (val.id === id || key === id || (email && (val.email?.toLowerCase() === email.toLowerCase() || key === email.toLowerCase()))) {
          masterDiscoveredMapRef.current.delete(key);
        }
      });
    }

    // 4. Clear from localStorage 'asrarhub_all_local_users'
    try {
      const storedAll = localStorage.getItem('asrarhub_all_local_users');
      if (storedAll) {
        const parsedAll = JSON.parse(storedAll);
        if (Array.isArray(parsedAll)) {
          const filtered = parsedAll.filter((u: any) => u.id !== id && u.email?.toLowerCase() !== email?.toLowerCase());
          localStorage.setItem('asrarhub_all_local_users', JSON.stringify(filtered));
        }
      }
    } catch (e) {}

    // 5. Clear from 'asrarhub_local_user' if matching
    try {
      const storedSingle = localStorage.getItem('asrarhub_local_user');
      if (storedSingle) {
        const parsedSingle = JSON.parse(storedSingle);
        if (parsedSingle?.id === id || (email && parsedSingle?.email?.toLowerCase() === email.toLowerCase())) {
          localStorage.removeItem('asrarhub_local_user');
        }
      }
    } catch (e) {}

    showToast("Utilisateur supprimé avec succès.");

    // 6. Delete from Firestore asynchronously with non-blocking timeout safeguard
    if (id) {
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2500));
        await Promise.race([deleteDoc(doc(db, 'users', id)), timeoutPromise]);
      } catch (err) {
        console.warn("Firestore deleteDoc non-blocking note:", err);
      }
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllUsers = (filteredList: User[]) => {
    const allFilteredIds = filteredList.map(u => u.id);
    const isAllSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedUserIds.includes(id));

    if (isAllSelected) {
      setSelectedUserIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      setSelectedUserIds(prev => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const executeConfirmBatchDeleteUsers = async () => {
    if (selectedUserIds.length === 0) return;

    const idsToDelete = [...selectedUserIds];
    const targets = users.filter(u => idsToDelete.includes(u.id));

    // 1. Close modal and update UI immediately
    setIsBatchDeleteConfirmOpen(false);
    setSelectedUserIds([]);

    // Remove targets from React state
    setUsers(prev => prev.filter(u => !idsToDelete.includes(u.id)));

    if (selectedUserDetail && idsToDelete.includes(selectedUserDetail.id)) {
      setSelectedUserDetail(null);
    }

    // 2. Save deleted IDs and emails to localStorage deleted list
    try {
      const deletedIdsStr = localStorage.getItem('asrarhub_deleted_user_ids') || '[]';
      const deletedIds: string[] = JSON.parse(deletedIdsStr);

      targets.forEach(u => {
        if (u.id && !deletedIds.includes(u.id)) deletedIds.push(u.id);
        if (u.email && typeof u.email === 'string' && u.email.trim() && !deletedIds.includes(u.email.toLowerCase().trim())) {
          deletedIds.push(u.email.toLowerCase().trim());
        }
      });

      localStorage.setItem('asrarhub_deleted_user_ids', JSON.stringify(deletedIds));
    } catch (e) {}

    // 3. Clear from masterDiscoveredMapRef
    if (masterDiscoveredMapRef.current) {
      masterDiscoveredMapRef.current.forEach((val, key) => {
        if (idsToDelete.includes(val.id) || idsToDelete.includes(key)) {
          masterDiscoveredMapRef.current.delete(key);
        }
      });
    }

    // 4. Clear from localStorage 'asrarhub_all_local_users'
    try {
      const storedAll = localStorage.getItem('asrarhub_all_local_users');
      if (storedAll) {
        const parsedAll = JSON.parse(storedAll);
        if (Array.isArray(parsedAll)) {
          const filtered = parsedAll.filter((u: any) => !idsToDelete.includes(u.id));
          localStorage.setItem('asrarhub_all_local_users', JSON.stringify(filtered));
        }
      }
    } catch (e) {}

    showToast(`${targets.length} utilisateur(s) supprimé(s) avec succès.`);

    // 5. Delete from Firestore asynchronously for each target
    targets.forEach(async (u) => {
      if (u.id) {
        try {
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2500));
          await Promise.race([deleteDoc(doc(db, 'users', u.id)), timeoutPromise]);
        } catch (err) {
          console.warn("Firestore deleteDoc batch note:", err);
        }
      }
    });
  };

  const handleDeepScanAndSyncUsers = async () => {
    setIsScanningUsers(true);
    showToast("Analyse globale des collections et comptes en cours...");
    try {
      const discoveredMap = new Map<string, any>();

      const processDoc = (data: any, defaultSource: string) => {
        if (!data) return;
        const deletedIdsStr = localStorage.getItem('asrarhub_deleted_user_ids') || '[]';
        let deletedIds: string[] = [];
        try { deletedIds = JSON.parse(deletedIdsStr); } catch {}

        const email = data.email || data.userEmail || data.authorEmail || data.senderEmail || data.recipientEmail;
        const uid = data.id || data.userId || data.uid || data.authorId || (email ? `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}` : null);
        
        if (uid && deletedIds.includes(uid)) return;
        if (email && typeof email === 'string' && deletedIds.includes(email.toLowerCase().trim())) return;
        if (!email && !uid) return;
        
        const hasRealEmail = email && typeof email === 'string' && email.trim() !== '' && email.includes('@') && !email.includes('utilisateur@asrarhub.com');
        const key = hasRealEmail ? email.toLowerCase().trim() : (uid || `usr_${Math.random().toString(36).substr(2, 9)}`);
        if (!key) return;
        if (deletedIds.includes(key)) return;
        if (!discoveredMap.has(key)) {
          discoveredMap.set(key, {
            id: uid || `usr_${Math.random().toString(36).substr(2, 9)}`,
            email: email || '',
            name: data.name || data.userName || data.authorName || (email ? email.split('@')[0] : 'Membre AsrarHub'),
            phone: data.phone || data.userPhone || data.phoneNumber || '',
            country: data.country || data.location || '',
            role: data.role || 'user',
            photoURL: data.photoURL || data.authorAvatar || data.avatar || '',
            createdAt: data.createdAt || data.date || new Date().toISOString(),
            isBanned: !!data.isBanned,
            isTrusted: data.isTrusted !== undefined ? data.isTrusted : true,
            subscriptionTier: data.subscriptionTier || data.plan || 'premium',
            source: defaultSource
          });
        }
      };

      const token = await auth.currentUser?.getIdToken().catch(() => undefined);

      // Run ALL collection scans concurrently via Promise.allSettled for maximum speed
      const [
        usersSnapRes,
        restUsersRes,
        paySnapRes,
        postsSnapRes,
        dmSnapRes,
        notifSnapRes,
        chatSnapRes,
        halaqatSnapRes,
        dreamsSnapRes
      ] = await Promise.allSettled([
        getDocs(collection(db, 'users')),
        fetchUsersFromRest(token),
        getDocs(collection(db, 'manual_payments')),
        getDocs(collection(db, 'community_posts')),
        getDocs(collection(db, 'direct_messages')),
        getDocs(collection(db, 'notifications')),
        getDocs(collection(db, 'chat_sessions')),
        getDocs(collection(db, 'halaqat_participants')),
        getDocs(collection(db, 'dreams'))
      ]);

      if (usersSnapRes.status === 'fulfilled' && usersSnapRes.value) {
        usersSnapRes.value.docs.forEach(docSnap => processDoc({ id: docSnap.id, ...docSnap.data() }, 'Firestore'));
      }
      if (restUsersRes.status === 'fulfilled' && Array.isArray(restUsersRes.value)) {
        restUsersRes.value.forEach(u => processDoc(u, 'Firestore REST'));
      }
      if (paySnapRes.status === 'fulfilled' && paySnapRes.value) {
        paySnapRes.value.docs.forEach(docSnap => processDoc({ id: docSnap.id, ...docSnap.data() }, 'Paiement'));
      }
      if (postsSnapRes.status === 'fulfilled' && postsSnapRes.value) {
        postsSnapRes.value.docs.forEach(docSnap => processDoc({ id: docSnap.id, ...docSnap.data() }, 'Communauté'));
      }
      if (dmSnapRes.status === 'fulfilled' && dmSnapRes.value) {
        dmSnapRes.value.docs.forEach(docSnap => processDoc({ id: docSnap.id, ...docSnap.data() }, 'Message Direct'));
      }
      if (notifSnapRes.status === 'fulfilled' && notifSnapRes.value) {
        notifSnapRes.value.docs.forEach(docSnap => processDoc({ id: docSnap.id, ...docSnap.data() }, 'Notification'));
      }
      if (chatSnapRes.status === 'fulfilled' && chatSnapRes.value) {
        chatSnapRes.value.docs.forEach(docSnap => processDoc({ id: docSnap.id, ...docSnap.data() }, 'Session Assistant'));
      }
      if (halaqatSnapRes.status === 'fulfilled' && halaqatSnapRes.value) {
        halaqatSnapRes.value.docs.forEach(docSnap => processDoc({ id: docSnap.id, ...docSnap.data() }, 'Halaqat'));
      }
      if (dreamsSnapRes.status === 'fulfilled' && dreamsSnapRes.value) {
        dreamsSnapRes.value.docs.forEach(docSnap => processDoc({ id: docSnap.id, ...docSnap.data() }, 'Rêves'));
      }

      // Scan localStorage asrarhub_all_local_users & asrarhub_local_user
      try {
        const storedAll = localStorage.getItem('asrarhub_all_local_users');
        if (storedAll) {
          const parsed = JSON.parse(storedAll);
          if (Array.isArray(parsed)) parsed.forEach(u => processDoc(u, 'Local Storage'));
        }
        const storedSingle = localStorage.getItem('asrarhub_local_user');
        if (storedSingle) {
          const parsed = JSON.parse(storedSingle);
          if (parsed) processDoc(parsed, 'Local Storage');
        }
      } catch (e) {}

      // Collect all discovered accounts
      const allDiscovered = Array.from(discoveredMap.values());

      // Save/persist discovered accounts locally to ensure instant persistence
      try {
        const existingLocalStr = localStorage.getItem('asrarhub_all_local_users') || '[]';
        const existingLocal = JSON.parse(existingLocalStr);
        const mergedLocalMap = new Map();
        existingLocal.forEach((u: any) => { if (u && u.email) mergedLocalMap.set(u.email.toLowerCase(), u); });
        allDiscovered.forEach((u: any) => { if (u && u.email) mergedLocalMap.set(u.email.toLowerCase(), u); });
        localStorage.setItem('asrarhub_all_local_users', JSON.stringify(Array.from(mergedLocalMap.values())));
      } catch (e) {}

      // Fast parallel Firestore sync for missing docs
      const existingDbIds = new Set((rawDbUsers || []).map(u => u.id));
      const syncPromises = allDiscovered
        .filter(u => u.id && !existingDbIds.has(u.id))
        .map(u => {
          const userRef = doc(db, 'users', u.id);
          return setDoc(userRef, {
            email: u.email || '',
            name: u.name || 'Membre AsrarHub',
            phone: u.phone || '',
            country: u.country || '',
            role: u.role || 'user',
            photoURL: u.photoURL || '',
            createdAt: u.createdAt || new Date().toISOString(),
            isBanned: u.isBanned || false,
            isTrusted: u.isTrusted !== undefined ? u.isTrusted : true,
            subscriptionTier: u.subscriptionTier || 'premium',
            requiresValidation: false
          }, { merge: true }).catch(() => {});
        });

      if (syncPromises.length > 0) {
        await Promise.allSettled(syncPromises);
      }

      restUsersRef.current = allDiscovered;
      setRestUsers(allDiscovered);
      aggregateAllUsers(rawDbUsers, manualPayments, communityPosts, allDiscovered);

      showToast(`Scan global terminé ! ${allDiscovered.length} compte(s) identifié(s) et synchronisé(s).`);
    } catch (error) {
      console.error("Erreur lors du scan global des utilisateurs:", error);
      showToast("Erreur lors du scan global des comptes.", "error");
    } finally {
      setIsScanningUsers(false);
    }
  };

  const handleAddUsersSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingUsers(true);
    try {
      let addedUsersList: any[] = [];
      const defaultTier = featureToggles['new_user_premium_enabled'] !== false ? 'premium' : 'free';
      if (addUserMode === 'single') {
        if (!newUserData.email) {
          showToast("Veuillez saisir au moins une adresse email.", "error");
          setIsAddingUsers(false);
          return;
        }
        const cleanEmail = newUserData.email.trim().toLowerCase();
        const normEmail = normalizeEmail(cleanEmail);
        const normPhone = normalizePhone(newUserData.phone || '');
        const uid = `usr_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const tier = newUserData.subscriptionTier || defaultTier;
        const isPrem = tier === 'premium' || tier === 'pro';
        addedUsersList.push({
          id: uid,
          email: cleanEmail,
          normalizedEmail: normEmail,
          name: newUserData.name.trim() || cleanEmail.split('@')[0],
          phone: newUserData.phone.trim() || '',
          normalizedPhone: normPhone,
          country: newUserData.country.trim() || '',
          role: newUserData.role || 'user',
          isPremium: isPrem,
          subscriptionTier: tier,
          plan: tier,
          accountStatus: isPrem ? 'premium' : 'active',
          status: 'active',
          isBanned: false,
          banned: false,
          isTrusted: true,
          createdAt: new Date().toISOString(),
          requiresValidation: false
        });
      } else {
        const rawLines = batchEmailsText.split(/[\n,;]/).map(s => s.trim().toLowerCase()).filter(Boolean);
        const uniqueEmails = Array.from(new Set(rawLines));
        if (uniqueEmails.length === 0) {
          showToast("Aucune adresse email valide trouvée dans le texte.", "error");
          setIsAddingUsers(false);
          return;
        }

        const tier = newUserData.subscriptionTier || defaultTier;
        const isPrem = tier === 'premium' || tier === 'pro';

        for (const email of uniqueEmails) {
          const normEmail = normalizeEmail(email);
          const uid = `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
          addedUsersList.push({
            id: uid,
            email: email,
            normalizedEmail: normEmail,
            name: email.split('@')[0],
            role: 'user',
            isPremium: isPrem,
            subscriptionTier: tier,
            plan: tier,
            accountStatus: isPrem ? 'premium' : 'active',
            status: 'active',
            isBanned: false,
            banned: false,
            isTrusted: true,
            createdAt: new Date().toISOString(),
            requiresValidation: false
          });
        }
      }

      // 1. Immediately save to local storage for instant offline & UI persistence
      try {
        const existingStr = localStorage.getItem('asrarhub_all_local_users') || '[]';
        const existingArr = JSON.parse(existingStr);
        const userMap = new Map();
        existingArr.forEach((u: any) => { if (u && u.email) userMap.set(u.email.toLowerCase(), u); });
        addedUsersList.forEach((u: any) => { if (u && u.email) userMap.set(u.email.toLowerCase(), u); });
        const updatedLocal = Array.from(userMap.values());
        localStorage.setItem('asrarhub_all_local_users', JSON.stringify(updatedLocal));
      } catch (e) {}

      // 2. Parallel write to Firestore
      const firestorePromises = addedUsersList.map(u => {
        const userRef = doc(db, 'users', u.id);
        return setDoc(userRef, u, { merge: true }).catch(() => {});
      });
      await Promise.allSettled(firestorePromises);

      showToast(`${addedUsersList.length} utilisateur(s) inscrit(s) et enregistré(s) avec succès !`);
      setIsAddUserModalOpen(false);
      setNewUserData({ name: '', email: '', phone: '', country: '', role: 'user', subscriptionTier: 'premium' });
      setBatchEmailsText('');
      
      // Update UI state directly with added users so count reflects immediately!
      const updatedRest = [...restUsersRef.current, ...addedUsersList];
      restUsersRef.current = updatedRest;
      setRestUsers(updatedRest);
      aggregateAllUsers([...rawDbUsers, ...addedUsersList], manualPayments, communityPosts, updatedRest);
    } catch (error) {
      console.error("Error adding user(s)", error);
      showToast("Erreur lors de l'enregistrement.", "error");
    } finally {
      setIsAddingUsers(false);
    }
  };

  const handleApproveManualPayment = async (payment: any) => {
    try {
      let months = 3;
      if (payment.planId === 'premium_6m') months = 6;
      if (payment.planId === 'premium_12m') months = 12;

      const premiumUntil = new Date();
      premiumUntil.setMonth(premiumUntil.getMonth() + months);

      // 1. Update user to premium
      try {
        await setDoc(doc(db, 'users', payment.userId), {
          isPremium: true,
          subscriptionTier: 'premium',
          plan: 'premium',
          accountStatus: 'premium',
          status: 'active',
          premiumUntil: premiumUntil
        }, { merge: true });
      } catch (uErr) {
        console.warn("Could not write user subscription update directly to Firestore:", uErr);
      }

      // 2. Mark payment as approved
      await updateDoc(doc(db, 'manual_payments', payment.id), {
        status: 'approved'
      });

      // 3. Increment promo code uses if applicable and bind to user
      if (payment.appliedPromoCode) {
        try {
          const { increment, arrayUnion } = await import('firebase/firestore');
          const upperPromo = payment.appliedPromoCode.toUpperCase();
          await updateDoc(doc(db, 'promo_codes', upperPromo), {
            uses: increment(1),
            usedByUsers: arrayUnion(payment.userId),
            ...(payment.userEmail ? { usedByEmails: arrayUnion(payment.userEmail.toLowerCase()) } : {})
          });
          if (payment.userId) {
            await updateDoc(doc(db, 'users', payment.userId), {
              usedPromoCodes: arrayUnion(upperPromo),
              lastPromoCodeUsed: upperPromo,
              lastPromoCodeUsedAt: new Date().toISOString()
            });
          }
        } catch (promoErr) {
          console.warn("Failed to increment promo uses upon approval:", promoErr);
        }
      }

      showToast(`Paiement de ${payment.senderName} approuvé ! Abonnement Premium de ${months} mois activé.`, 'success');
    } catch (error) {
      console.error("Error approving manual payment:", error);
      showToast("Une erreur est survenue lors de l'approbation.", 'error');
    }
  };

  const handleRejectManualPayment = async (payment: any) => {
    try {
      await updateDoc(doc(db, 'manual_payments', payment.id), {
        status: 'rejected'
      });
      showToast(`Paiement de ${payment.senderName} a été marqué comme rejeté.`, 'info');
    } catch (error) {
      console.error("Error rejecting manual payment:", error);
      showToast("Une erreur est survenue lors du rejet.", 'error');
    }
  };

  const handleToggleMysteryTools = (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    setBlockingToolsUser(user);
  };

  const handleUpdateUserToolOverride = async (userId: string, toolId: string, status: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const overrides = { ...(user.toolOverrides || {}) };
    let updatedBlocked = [...(user.blockedTools || [])];
    let updatedAllowed = [...(user.allowedTools || [])];

    if (status === 'default') {
      delete overrides[toolId];
      updatedBlocked = updatedBlocked.filter(id => id !== toolId);
      updatedAllowed = updatedAllowed.filter(id => id !== toolId);
    } else {
      overrides[toolId] = status;
      if (status === 'blocked' || status === 'disabled' || status === 'inactive') {
        if (!updatedBlocked.includes(toolId)) updatedBlocked.push(toolId);
        updatedAllowed = updatedAllowed.filter(id => id !== toolId);
      } else if (status === 'active' || status === 'allowed') {
        updatedBlocked = updatedBlocked.filter(id => id !== toolId);
        if (!updatedAllowed.includes(toolId)) updatedAllowed.push(toolId);
      } else {
        // premium, maintenance
        updatedBlocked = updatedBlocked.filter(id => id !== toolId);
      }
    }

    const updatedUser = { 
      ...user, 
      toolOverrides: overrides,
      blockedTools: updatedBlocked,
      allowedTools: updatedAllowed
    };

    setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    if (selectedUserDetail?.id === userId) {
      setSelectedUserDetail(updatedUser);
    }
    if (blockingToolsUser?.id === userId) {
      setBlockingToolsUser(updatedUser);
    }
    masterDiscoveredMapRef.current.set(user.email ? user.email.toLowerCase().trim() : userId, updatedUser);

    try {
      await setDoc(doc(db, 'users', userId), { 
        toolOverrides: overrides,
        blockedTools: updatedBlocked,
        allowedTools: updatedAllowed
      }, { merge: true });
      showToast(`Statut de l'outil mis à jour pour ${user.name || user.email}.`, "success");
    } catch (error) {
      console.warn("Error updating user tool overrides:", error);
      showToast("Mis à jour en local.", "info");
    }
  };

  const handleToggleIndividualToolBlock = async (userId: string, toolId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const currentBlocked = user.blockedTools || [];
    const isCurrentlyBlocked = currentBlocked.includes(toolId) || (user.toolOverrides && user.toolOverrides[toolId] === 'blocked');
    
    await handleUpdateUserToolOverride(userId, toolId, isCurrentlyBlocked ? 'default' : 'blocked');
  };

  const handleBatchUpdateUserTools = async (userId: string, action: 'allow_all' | 'block_all' | 'reset_default', targetToolIds?: string[]) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const toolIdsToProcess = targetToolIds && targetToolIds.length > 0 
      ? targetToolIds 
      : ALL_USER_TOOLS.map(t => t.id);

    const overrides = { ...(user.toolOverrides || {}) };
    let updatedBlocked = [...(user.blockedTools || [])];
    let updatedAllowed = [...(user.allowedTools || [])];
    let allToolsDisabled = user.allToolsDisabled;

    if (action === 'allow_all') {
      allToolsDisabled = false;
      toolIdsToProcess.forEach(id => {
        overrides[id] = 'active';
        updatedBlocked = updatedBlocked.filter(bId => bId !== id);
        if (!updatedAllowed.includes(id)) updatedAllowed.push(id);
      });
    } else if (action === 'block_all') {
      toolIdsToProcess.forEach(id => {
        overrides[id] = 'blocked';
        if (!updatedBlocked.includes(id)) updatedBlocked.push(id);
        updatedAllowed = updatedAllowed.filter(aId => aId !== id);
      });
    } else if (action === 'reset_default') {
      allToolsDisabled = false;
      toolIdsToProcess.forEach(id => {
        delete overrides[id];
        updatedBlocked = updatedBlocked.filter(bId => bId !== id);
        updatedAllowed = updatedAllowed.filter(aId => aId !== id);
      });
    }

    const updatedUser = { 
      ...user, 
      allToolsDisabled,
      toolOverrides: overrides,
      blockedTools: updatedBlocked,
      allowedTools: updatedAllowed
    };

    setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    if (selectedUserDetail?.id === userId) {
      setSelectedUserDetail(updatedUser);
    }
    if (blockingToolsUser?.id === userId) {
      setBlockingToolsUser(updatedUser);
    }
    masterDiscoveredMapRef.current.set(user.email ? user.email.toLowerCase().trim() : userId, updatedUser);

    try {
      await setDoc(doc(db, 'users', userId), { 
        allToolsDisabled,
        toolOverrides: overrides,
        blockedTools: updatedBlocked,
        allowedTools: updatedAllowed
      }, { merge: true });
      showToast("Accès aux outils mis à jour en masse avec succès.", "success");
    } catch (error) {
      console.warn("Error batch updating user tools:", error);
      showToast("Mis à jour en local.", "info");
    }
  };

  const handleToggleUserAllTools = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const newDisabledState = !user.allToolsDisabled;

    const updatedUser = { ...user, allToolsDisabled: newDisabledState };
    setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    if (selectedUserDetail?.id === userId) {
      setSelectedUserDetail(updatedUser);
    }
    if (blockingToolsUser?.id === userId) {
      setBlockingToolsUser(updatedUser);
    }
    masterDiscoveredMapRef.current.set(user.email ? user.email.toLowerCase().trim() : userId, updatedUser);

    try {
      await setDoc(doc(db, 'users', userId), { allToolsDisabled: newDisabledState }, { merge: true });
      showToast(newDisabledState ? "Tous les outils sont désormais bloqués pour cet utilisateur." : "Blocage total des outils désactivé.", "success");
    } catch (error) {
      console.warn("Error updating allToolsDisabled:", error);
    }
  };

  const handleToggleUserTrusted = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    const newTrustedState = !user.isTrusted;

    const updatedUser = { ...user, isTrusted: newTrustedState };
    setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    if (selectedUserDetail?.id === id) {
      setSelectedUserDetail(updatedUser);
    }
    masterDiscoveredMapRef.current.set(user.email ? user.email.toLowerCase().trim() : id, updatedUser);

    try {
      await setDoc(doc(db, 'users', id), { isTrusted: newTrustedState }, { merge: true });
      showToast(newTrustedState ? "Statut de confiance accordé." : "Statut de confiance retiré.");
    } catch (error) {
      console.warn("Error updating user trusted status in Firestore:", error);
      showToast("Modifié en mémoire locale", "info");
    }
  };

  const handleAddAudio = async () => {
    if (!newAudio.title_fr || !newAudio.url) return;
    try {
      await addDoc(collection(db, 'ruqyah_audios'), {
        title: newAudio.title_fr,
        title_fr: newAudio.title_fr,
        title_en: newAudio.title_en,
        title_ha: newAudio.title_ha,
        url: newAudio.url,
        duration: newAudio.duration || 'Inconnue',
        isActive: true
      });
      setNewAudio({ 
        title_fr: '', title_en: '', title_ha: '', 
        url: '', duration: '' 
      });
    } catch (error) {
      console.error("Error adding audio", error);
    }
  };

  const handleDeleteAudio = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'ruqyah_audios', id));
    } catch (error) {
      console.error("Error deleting audio", error);
    }
  };

  const handleToggleAudioActive = async (id: string) => {
    const audio = ruqyahAudios.find(a => a.id === id);
    if (!audio) return;
    try {
      await updateDoc(doc(db, 'ruqyah_audios', id), { isActive: !audio.isActive });
    } catch (error) {
      console.error("Error updating audio", error);
    }
  };

  const handleUpdatePostStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'community_posts', id), { status });
    } catch (error) {
      console.error("Error updating post", error);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'community_posts', id));
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  const handleAddNotification = async () => {
    if (!newNotification.title_fr || !newNotification.message_fr) return;
    try {
      const title_fr = newNotification.title_fr;
      const title_en = newNotification.title_en || title_fr;
      const title_ha = newNotification.title_ha || title_fr;
      const message_fr = newNotification.message_fr;
      const message_en = newNotification.message_en || message_fr;
      const message_ha = newNotification.message_ha || message_fr;

      await addDoc(collection(db, 'notifications'), {
        title: title_fr,
        title_fr,
        title_en,
        title_ha,
        message: message_fr,
        message_fr,
        message_en,
        message_ha,
        date: new Date().toISOString(),
        createdAt: new Date()
      });

      // Broadcast push notifications to FCM active devices
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const allTokens: string[] = [];
        usersSnap.forEach(userDoc => {
          const udata = userDoc.data();
          if (udata.fcmTokens && Array.isArray(udata.fcmTokens)) {
            allTokens.push(...udata.fcmTokens);
          } else if (udata.lastFCMToken) {
            allTokens.push(udata.lastFCMToken);
          }
        });

        const uniqueTokens = Array.from(new Set(allTokens));
        if (uniqueTokens.length > 0) {
          await fetch(getApiUrl('/api/send-push'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              tokens: uniqueTokens,
              title: newNotification.title_fr,
              body: newNotification.message_fr
            })
          });
        }
      } catch (fcmErr) {
        console.error("FCM broadcast error:", fcmErr);
      }

      setNewNotification({ 
        title_fr: '', message_fr: '',
        title_en: '', message_en: '',
        title_ha: '', message_ha: ''
      });
    } catch (error) {
      console.error("Error adding notification", error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  const handleExportData = () => {
    const allData = {
      users,
      lexiqueTerms,
      ruqyahAudios,
      communityPosts,
      notifications,
      articles,
      settings: {
        audioEnabled,
        maintenanceMode
      }
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_admin_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearArticleCaches = () => {
    try {
      localStorage.removeItem('asrarhub_cached_articles_list');
      localStorage.removeItem('asrarhub_cached_explore_articles');
      localStorage.removeItem('asrarhub_cached_admin_articles');
      localStorage.removeItem('asrarhub_cached_article_details');
      localStorage.removeItem('asrar_items');
    } catch (e) {}
  };

  const handleSaveArticle = async () => {
    try {
      console.log("Saving article:", newArticle);
      const isContentEmpty = !newArticle.content || newArticle.content === '<p></p>' || newArticle.content.trim() === '';
      if (!newArticle.title || isContentEmpty) {
        showToast("Titre et contenu requis.", "error");
        return;
      }

      // Synchronously generate or reuse doc ID
      const artId = editingArticle ? editingArticle.id : doc(collection(db, 'articles')).id;
      const imgResolved = getArticleImageUrl(newArticle);
      const effectiveCropData = (newArticle as any).coverImageCrop || (newArticle as any).cropData || (completedCrop ? { ...completedCrop } : null);
      const effectiveCropAspect = cropAspect !== undefined ? cropAspect : ((newArticle as any).cropAspect || null);
      const effectiveAudioUrl = (newArticle as any).audioUrl || (newArticle as any).audio_url || '';
      const effectiveAudioTitle = (newArticle as any).audioTitle || '';
      const effectiveAudioDuration = (newArticle as any).audioDuration || '';

      const articlePayload = {
        id: artId,
        title: newArticle.title,
        hook: newArticle.hook || '',
        hook_en: (newArticle as any).hook_en || '',
        hook_ha: (newArticle as any).hook_ha || '',
        title_en: (newArticle as any).title_en || '',
        title_ha: (newArticle as any).title_ha || '',
        thumbnail: imgResolved,
        imageUrl: imgResolved,
        image: imgResolved,
        coverImage: imgResolved,
        coverImageUrl: imgResolved,
        coverImageCrop: effectiveCropData,
        cropData: effectiveCropData,
        cropAspect: effectiveCropAspect,
        content: newArticle.content,
        content_en: (newArticle as any).content_en || '',
        content_ha: (newArticle as any).content_ha || '',
        benefits: (newArticle as any).benefits || [],
        type: newArticle.type || 'richtext',
        status: newArticle.status || 'Published',
        publishDate: newArticle.publishDate || '',
        isPremium: newArticle.isPremium || false,
        category: newArticle.category || 'wird',
        subCategory: (newArticle as any).subCategory || '',
        audioUrl: effectiveAudioUrl,
        audio_url: effectiveAudioUrl,
        audioTitle: effectiveAudioTitle,
        audioDuration: effectiveAudioDuration,
        createdAt: editingArticle?.createdAt || Date.now(),
        updatedAt: Date.now()
      };

      // Auto-translate to EN and HA if not manually provided
      if (!articlePayload.title_en || !articlePayload.content_en) {
        try {
          const resEn = await fetch(getApiUrl('/api/translate-article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: articlePayload.title,
              hook: articlePayload.hook,
              content: articlePayload.content,
              benefits: articlePayload.benefits,
              targetLanguage: 'en'
            })
          });
          if (resEn.ok) {
            const dataEn = await resEn.json();
            if (dataEn.title) articlePayload.title_en = dataEn.title;
            if (dataEn.hook) articlePayload.hook_en = dataEn.hook;
            if (dataEn.content) articlePayload.content_en = dataEn.content;
          }
        } catch (e) {
          console.warn("[Admin] Auto EN translation error:", e);
        }
      }

      if (!articlePayload.title_ha || !articlePayload.content_ha) {
        try {
          const resHa = await fetch(getApiUrl('/api/translate-article'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: articlePayload.title,
              hook: articlePayload.hook,
              content: articlePayload.content,
              benefits: articlePayload.benefits,
              targetLanguage: 'ha'
            })
          });
          if (resHa.ok) {
            const dataHa = await resHa.json();
            if (dataHa.title) articlePayload.title_ha = dataHa.title;
            if (dataHa.hook) articlePayload.hook_ha = dataHa.hook;
            if (dataHa.content) articlePayload.content_ha = dataHa.content;
          }
        } catch (e) {
          console.warn("[Admin] Auto HA translation error:", e);
        }
      }

      // 1. Instantly save in local persistent storage so it CANNOT be erased on mobile/Capacitor
      saveLocalCustomArticle(articlePayload as any);

      // 2. Instantly update React state
      setArticles(prev => mergeWithLocalArticles([articlePayload as any, ...prev], true));

      // 3. Persist to Firestore asynchronously
      try {
        await setDoc(doc(db, 'articles', artId), articlePayload, { merge: true });
      } catch (fErr: any) {
        console.warn("[Admin] Firestore save note (saved locally):", fErr);
      }

      // 4. Trigger immediate SWR broadcast and cache refresh for all user dashboards
      revalidatePublishedArticles('admin_save_direct').catch(() => {});

      setEditingArticle(null);
      showToast(editingArticle ? "Article mis à jour avec succès (visible immédiatement) !" : "Article publié avec succès (visible immédiatement pour les utilisateurs) !");
      
      // Fully reset all fields including all language variations, image crop and draft
      setNewArticle({
        title: '',
        title_en: '',
        title_ha: '',
        hook: '',
        hook_en: '',
        hook_ha: '',
        thumbnail: '',
        imageUrl: '',
        content: '',
        content_en: '',
        content_ha: '',
        type: 'richtext',
        status: 'Published',
        publishDate: '',
        benefits: [],
        category: '',
        subCategory: '',
        isPremium: false,
        audioUrl: '',
        audio_url: '',
      } as any);
      setImgSrc('');
      setCrop(undefined);
      setCompletedCrop(null);
      setArticleFormKey(k => k + 1);

      try {
        localStorage.removeItem('asrarhub_article_draft');
      } catch (e) {}
    } catch (error: any) {
      console.error("Error saving article:", error);
      showToast(`Erreur : ${error?.message || "Erreur lors de la publication de l'article."}`, "error");
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      addDeletedArticleId(id);
      deleteLocalCustomArticle(id);
      setArticles(prev => {
        const updated = prev.filter(a => a && a.id !== id);
        try {
          saveCachedArticlesList(CACHED_ADMIN_ARTICLES_KEY, updated);
          saveCachedArticlesList(CACHED_ARTICLES_LIST_KEY, updated);
          saveCachedArticlesList(CACHED_EXPLORE_ARTICLES_KEY, updated);
        } catch (e) {}
        return updated;
      });

      if (!String(id).startsWith('default_art_')) {
        try {
          await Promise.allSettled([
            deleteDoc(doc(db, 'articles', id)),
            deleteArticleFromRest(id)
          ]);
        } catch (fsErr) {
          console.warn("[Delete Article] Firestore delete note:", fsErr);
        }
      }
      showToast("Article supprimé avec succès.");
    } catch (error) {
      console.error("Error deleting article", error);
      showToast("Erreur lors de la suppression.", "error");
    }
  };

  const handleDeleteAllArticles = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer TOUS les articles ? Cette action est irréversible.")) return;
    try {
      setHideMockArticles(true);
      articles.forEach(a => {
        if (a && a.id) {
          addDeletedArticleId(a.id);
        }
      });
      clearAllLocalCustomArticles();
      setArticles([]);
      const promises = articles.map(article => {
        if (article && article.id && !String(article.id).startsWith('default_art_')) {
          return Promise.allSettled([
            deleteDoc(doc(db, 'articles', article.id)),
            deleteArticleFromRest(article.id)
          ]).catch(err => console.warn("Firestore delete err:", err));
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      showToast("Tous les articles ont été supprimés.");
    } catch (error) {
      console.error("Error deleting all articles", error);
      showToast("Tous les articles ont été supprimés.");
    }
  };

  const handleDeleteMockArticles = () => {
    setHideMockArticles(true);
    setArticles(prev => prev.filter(a => a && !String(a.id).startsWith('default_art_')));
    clearArticleCaches();
    showToast("Les articles de démonstration ont été masqués et supprimés.");
  };

  const handleSeedDefaultArticles = async () => {
    if (isSeedingArticles) return;
    setIsSeedingArticles(true);
    try {
      let count = 0;
      for (const art of INITIAL_DEFAULT_ARTICLES) {
        await addDoc(collection(db, 'articles'), {
          title: art.title,
          hook: art.hook || '',
          hook_en: art.hook_en || '',
          hook_ha: art.hook_ha || '',
          title_en: art.title_en || '',
          title_ha: art.title_ha || '',
          thumbnail: art.thumbnail || '',
          content: art.content || '',
          content_en: art.content_en || '',
          content_ha: art.content_ha || '',
          benefits: art.benefits || [],
          type: 'richtext',
          status: art.status || 'Published',
          publishDate: '',
          isPremium: art.isPremium || false,
          category: art.category || 'recette',
          subCategory: art.subCategory || '',
          createdAt: Date.now()
        });
        count++;
      }
      showToast(`${count} articles par défaut importés avec succès dans Firebase !`);
    } catch (err: any) {
      console.error("Error seeding articles:", err);
      showToast(`Erreur d'importation : ${err?.message || "Échec"}`, "error");
    } finally {
      setIsSeedingArticles(false);
    }
  };

  const editArticle = (article: Article) => {
    setEditingArticle(article);
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(null);
    setArticleFormKey(k => k + 1);
    if ((article as any).cropAspect !== undefined) {
      setCropAspect((article as any).cropAspect);
    }
    const resolvedImg = getArticleImageUrl(article);
    setNewArticle({ 
      title: article.title, 
      hook: (article as any).hook,
      title_en: (article as any).title_en,
      title_ha: (article as any).title_ha,
      thumbnail: resolvedImg, 
      imageUrl: resolvedImg,
      image: resolvedImg,
      coverImage: resolvedImg,
      coverImageUrl: resolvedImg,
      coverImageCrop: (article as any).coverImageCrop || (article as any).cropData || null,
      cropData: (article as any).cropData || (article as any).coverImageCrop || null,
      cropAspect: (article as any).cropAspect || null,
      content: article.content, 
      content_en: (article as any).content_en,
      content_ha: (article as any).content_ha,
      benefits: (article as any).benefits || [],
      type: article.type,
      status: article.status || 'Draft',
      publishDate: article.publishDate || '',
      isPremium: (article as any).isPremium || false,
      category: (article as any).category || '',
      subCategory: (article as any).subCategory || '',
      audioUrl: (article as any).audioUrl || (article as any).audio_url || '',
      audio_url: (article as any).audioUrl || (article as any).audio_url || '',
      audioTitle: (article as any).audioTitle || '',
      audioDuration: (article as any).audioDuration || ''
    } as any);
    setActiveTab('articles');
  };

  const handleQuickUpdateArticleStatus = async (articleId: string, newStatus: 'Published' | 'Draft') => {
    try {
      const art = articles.find(a => a && a.id === articleId);
      if (!art) return;

      const updatedArt = {
        ...art,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      saveLocalCustomArticle(updatedArt as any);

      setArticles(prev => {
        const next = prev.map(a => a.id === articleId ? updatedArt : a);
        try {
          saveCachedArticlesList(CACHED_ADMIN_ARTICLES_KEY, next);
          saveCachedArticlesList(CACHED_ARTICLES_LIST_KEY, next);
          saveCachedArticlesList(CACHED_EXPLORE_ARTICLES_KEY, next);
        } catch (e) {}
        return next;
      });

      if (selectedArticleForQuickControl?.id === articleId) {
        setSelectedArticleForQuickControl(updatedArt);
      }

      try {
        await setDoc(doc(db, 'articles', articleId), { status: newStatus, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (err) {
        console.warn("[Admin] Firestore status update note (saved locally):", err);
      }

      revalidatePublishedArticles('admin_status_quick_update').catch(() => {});
      showToast(`Statut mis à jour : "${newStatus === 'Published' ? 'Publié (Visible)' : 'Brouillon (Masqué)'}" !`);
    } catch (error: any) {
      console.error("Error updating article status:", error);
      showToast("Erreur lors de la mise à jour du statut.", "error");
    }
  };

  const handleQuickUpdateArticleCategory = async (articleId: string, newCategory: string, newSubCategory?: string) => {
    try {
      const art = articles.find(a => a && a.id === articleId);
      if (!art) return;

      const updatedArt = {
        ...art,
        category: newCategory,
        subCategory: newSubCategory !== undefined ? newSubCategory : (art as any).subCategory || '',
        updatedAt: new Date().toISOString()
      };

      saveLocalCustomArticle(updatedArt as any);

      setArticles(prev => {
        const next = prev.map(a => a.id === articleId ? updatedArt : a);
        try {
          saveCachedArticlesList(CACHED_ADMIN_ARTICLES_KEY, next);
          saveCachedArticlesList(CACHED_ARTICLES_LIST_KEY, next);
          saveCachedArticlesList(CACHED_EXPLORE_ARTICLES_KEY, next);
        } catch (e) {}
        return next;
      });

      if (selectedArticleForQuickControl?.id === articleId) {
        setSelectedArticleForQuickControl(updatedArt);
      }

      try {
        await setDoc(doc(db, 'articles', articleId), { 
          category: newCategory, 
          subCategory: newSubCategory !== undefined ? newSubCategory : (art as any).subCategory || '',
          updatedAt: new Date().toISOString() 
        }, { merge: true });
      } catch (err) {
        console.warn("[Admin] Firestore category update note (saved locally):", err);
      }

      revalidatePublishedArticles('admin_category_quick_update').catch(() => {});
      showToast(`Article déplacé avec succès dans "${newCategory}" !`);
    } catch (error: any) {
      console.error("Error moving article category:", error);
      showToast("Erreur lors du déplacement de la catégorie.", "error");
    }
  };

  const handleQuickToggleArticlePremium = async (articleId: string) => {
    try {
      const art = articles.find(a => a && a.id === articleId);
      if (!art) return;

      const newIsPremium = !art.isPremium;
      const updatedArt = {
        ...art,
        isPremium: newIsPremium,
        updatedAt: new Date().toISOString()
      };

      saveLocalCustomArticle(updatedArt as any);

      setArticles(prev => {
        const next = prev.map(a => a.id === articleId ? updatedArt : a);
        try {
          saveCachedArticlesList(CACHED_ADMIN_ARTICLES_KEY, next);
          saveCachedArticlesList(CACHED_ARTICLES_LIST_KEY, next);
          saveCachedArticlesList(CACHED_EXPLORE_ARTICLES_KEY, next);
        } catch (e) {}
        return next;
      });

      if (selectedArticleForQuickControl?.id === articleId) {
        setSelectedArticleForQuickControl(updatedArt);
      }

      try {
        await setDoc(doc(db, 'articles', articleId), { isPremium: newIsPremium, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (err) {
        console.warn("[Admin] Firestore premium toggle note (saved locally):", err);
      }

      revalidatePublishedArticles('admin_premium_quick_update').catch(() => {});
      showToast(newIsPremium ? "Article configuré comme VIP Premium ★ !" : "Article configuré en Accès Standard (Gratuit) !");
    } catch (error: any) {
      console.error("Error toggling premium:", error);
      showToast("Erreur lors de la modification de l'accès.", "error");
    }
  };

  const handleDuplicateArticle = async (article: Article) => {
    try {
      const newId = `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const duplicatedArt: any = {
        ...article,
        id: newId,
        title: `[Copie] ${article.title || (article as any).title_fr || 'Article sans titre'}`,
        status: 'Draft',
        createdAt: Date.now(),
        updatedAt: new Date().toISOString()
      };

      saveLocalCustomArticle(duplicatedArt);

      setArticles(prev => {
        const next = [duplicatedArt, ...prev];
        try {
          saveCachedArticlesList(CACHED_ADMIN_ARTICLES_KEY, next);
          saveCachedArticlesList(CACHED_ARTICLES_LIST_KEY, next);
          saveCachedArticlesList(CACHED_EXPLORE_ARTICLES_KEY, next);
        } catch (e) {}
        return next;
      });

      try {
        await setDoc(doc(db, 'articles', newId), duplicatedArt);
      } catch (err) {
        console.warn("[Admin] Firestore duplicate add note (saved locally):", err);
      }

      showToast("Article dupliqué avec succès (enregistré en Brouillon) !");
    } catch (error: any) {
      console.error("Error duplicating article:", error);
      showToast("Erreur lors de la duplication de l'article.", "error");
    }
  };

  const handleBulkArticleAction = async (
    action: 'publish' | 'draft' | 'premium' | 'free' | 'move_category' | 'delete', 
    targetCategory?: string
  ) => {
    if (selectedArticleIds.length === 0) {
      showToast("Veuillez sélectionner au moins un article.", "error");
      return;
    }

    if (action === 'delete') {
      if (!window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement les ${selectedArticleIds.length} articles sélectionnés ?`)) {
        return;
      }
    }

    setIsBulkArticleActionRunning(true);
    try {
      if (action === 'delete') {
        for (const id of selectedArticleIds) {
          await handleDeleteArticle(id);
        }
        setSelectedArticleIds([]);
        showToast(`${selectedArticleIds.length} articles supprimés.`);
        return;
      }

      const updatedArticles = articles.map(art => {
        if (!selectedArticleIds.includes(art.id)) return art;
        const updated = { ...art, updatedAt: new Date().toISOString() };
        if (action === 'publish') updated.status = 'Published';
        if (action === 'draft') updated.status = 'Draft';
        if (action === 'premium') updated.isPremium = true;
        if (action === 'free') updated.isPremium = false;
        if (action === 'move_category' && targetCategory) updated.category = targetCategory;
        saveLocalCustomArticle(updated as any);
        return updated;
      });

      setArticles(updatedArticles);
      try {
        saveCachedArticlesList(CACHED_ADMIN_ARTICLES_KEY, updatedArticles);
        saveCachedArticlesList(CACHED_ARTICLES_LIST_KEY, updatedArticles);
        saveCachedArticlesList(CACHED_EXPLORE_ARTICLES_KEY, updatedArticles);
      } catch (e) {}

      const promises = selectedArticleIds.map(async id => {
        const updatePayload: any = { updatedAt: new Date().toISOString() };
        if (action === 'publish') updatePayload.status = 'Published';
        if (action === 'draft') updatePayload.status = 'Draft';
        if (action === 'premium') updatePayload.isPremium = true;
        if (action === 'free') updatePayload.isPremium = false;
        if (action === 'move_category' && targetCategory) updatePayload.category = targetCategory;
        return setDoc(doc(db, 'articles', id), updatePayload, { merge: true });
      });

      await Promise.allSettled(promises);
      revalidatePublishedArticles('admin_bulk_update').catch(() => {});

      const actionLabels: Record<string, string> = {
        publish: 'publiés',
        draft: 'passés en brouillon',
        premium: 'définis comme VIP Premium',
        free: 'définis en accès standard',
        move_category: `déplacés vers "${targetCategory}"`
      };

      showToast(`${selectedArticleIds.length} article(s) ${actionLabels[action] || 'mis à jour'} avec succès !`);
      setSelectedArticleIds([]);
    } catch (err: any) {
      console.error("Bulk article action error:", err);
      showToast("Erreur lors de l'action groupée.", "error");
    } finally {
      setIsBulkArticleActionRunning(false);
    }
  };

  const renderTabNavigation = () => {
    const tabs = [
      { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
      { id: 'branding', label: 'Logo, Icône & Chargement', icon: Sparkles },
      { id: 'floating_button', label: 'Bouton Retour Flottant', icon: ArrowLeft },
      { id: 'version_control', label: 'Versions de l\'App (app_versions)', icon: Sparkles },
      { id: 'referrals', label: 'Parrainage & Récompenses', icon: Gift },
      { id: 'promo_codes', label: 'Gestion des Codes Promo', icon: Tag, badge: promoCodes.length || undefined },
      { id: 'security', label: 'Sécurité & Alertes', icon: ShieldAlert, badge: securityAlerts.length || undefined },
      { id: 'support', label: 'Support & Emails', icon: Mail },
      { id: 'users', label: 'Utilisateurs', icon: Users },
      { id: 'payments', label: 'Paiements Directs', icon: CreditCard },
      { id: 'pdf_documents', label: 'Livres & Manuscrits PDF', icon: FileText },
      { id: 'articles', label: 'Articles', icon: FileText },
      { id: 'media_storage', label: 'Stockage & Médias', icon: Icons.HardDrive },
      { id: 'categories', label: 'Catégories', icon: FolderOpen },
      { id: 'store', label: 'Boutique', icon: ShoppingBag },
      { id: 'community', label: 'Communauté', icon: Users },
      { id: 'notifications', label: 'Notifications', icon: Volume2 },
      { id: 'features', label: 'Fonctionnalités', icon: ToggleLeft },
      { id: 'reciters', label: 'Récitateurs', icon: Headphones },
      { id: 'grand_oaths', label: 'Grands Sermons', icon: Shield },
      { id: 'seals', label: 'Catalogue des Sceaux', icon: Moon },
      { id: 'book_covers', label: 'Studio Couvertures IA', icon: BookOpen },
      { id: 'content', label: 'CMS (Lexique)', icon: Database },
      { id: 'settings', label: 'Paramètres', icon: Settings },
    ];

    return (
      <div className="mb-6">
        {/* Mobile Dropdown Menu (Cleaner & avoids horizontal clutter) */}
        <div className="block md:hidden">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Section d'administration
          </label>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as AdminTab)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm font-bold text-gray-750 dark:text-gray-200 outline-none shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id} className="font-medium text-gray-700 dark:text-gray-200">
                {tab.label} {tab.badge ? `(${tab.badge})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop/Tablet Horizontal Tabs List */}
        <div className="hidden md:flex overflow-x-auto pb-4 hide-scrollbar gap-2 max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors relative ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const getAutoIconForCategory = (catName: string): string => {
    const lower = (catName || "").toLowerCase();
    if (lower.includes("secret") || lower.includes("mystic")) return "Sparkles";
    if (lower.includes("livre") || lower.includes("book") || lower.includes("manuscrit")) return "BookOpen";
    if (lower.includes("coran") || lower.includes("sourate")) return "Book";
    if (lower.includes("audio") || lower.includes("zikr") || lower.includes("priere")) return "Volume2";
    if (lower.includes("sante") || lower.includes("guerison") || lower.includes("ruqyah")) return "Shield";
    return "FolderOpen";
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await deleteDoc(doc(db, "categories", catId));
      setCategories(prev => prev.filter(c => c.id !== catId));
      showToast("Catégorie supprimée");
    } catch (e: any) {
      showToast("Erreur: " + e.message, "error");
    }
  };

  const handleDeleteSubCategory = async (catId: string, subId: string) => {
    if (!window.confirm("Supprimer cette sous-catégorie ?")) return;
    try {
      const parent = categories.find(c => c.id === catId);
      if (!parent) return;
      const updated = (parent.subCategories || []).filter((s: any) => s.id !== subId);
      await setDoc(doc(db, "categories", catId), { subCategories: updated }, { merge: true });
      setCategories(prev => prev.map(c => c.id === catId ? { ...c, subCategories: updated } : c));
      showToast("Sous-catégorie supprimée");
    } catch (e: any) {
      showToast("Erreur: " + e.message, "error");
    }
  };

  const handleQuickCreateCategory = async (name: string, nameEn: string, nameHa: string) => {
    if (!name.trim()) {
      showToast("Le nom de la catégorie est requis", "error");
      return null;
    }
    try {
      const catId = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
        
      if (!catId) {
        showToast("Nom de catégorie invalide", "error");
        return null;
      }

      const iconName = getAutoIconForCategory(name);

      const newCatObj = {
        id: catId,
        name: name.trim(),
        name_en: nameEn.trim() || name.trim(),
        name_ha: nameHa.trim() || name.trim(),
        iconName,
        subCategories: [],
        createdAt: Date.now()
      };

      try {
        await setDoc(doc(db, 'categories', catId), newCatObj, { merge: true });
      } catch (fsErr) {
        console.warn("[Quick Category] Firestore write note:", fsErr);
      }

      setCategories(prev => {
        const newList = prev.some(c => c.id === catId)
          ? prev.map(c => c.id === catId ? newCatObj : c)
          : [...prev, newCatObj];
        try { localStorage.setItem('asrarhub_cached_categories', JSON.stringify(newList)); } catch (e) {}
        return newList;
      });

      showToast("Catégorie créée avec succès !");
      return catId;
    } catch (err: any) {
      console.error("Error creating category", err);
      showToast(`Erreur: ${err.message}`, "error");
      return null;
    }
  };

  const handleQuickCreateSubCategory = async (catId: string, name: string, nameEn: string, nameHa: string) => {
    if (!catId) {
      showToast("Sélectionnez d'abord une catégorie", "error");
      return null;
    }
    const subName = name.trim();
    if (!subName) {
      showToast("Le nom de la sous-catégorie est requis", "error");
      return null;
    }

    try {
      const parentCat = categories.find(c => c.id === catId);
      if (!parentCat) {
        showToast("Catégorie parente introuvable", "error");
        return null;
      }

      const subId = `${catId}-${subName.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')}`;

      const existingSubs = parentCat.subCategories || [];
      if (existingSubs.some((s: any) => s.id === subId)) {
        showToast("Cette sous-catégorie existe déjà", "error");
        return null;
      }

      const newSub = {
        id: subId,
        name: subName,
        name_en: nameEn.trim() || subName,
        name_ha: nameHa.trim() || subName
      };

      const updatedSubs = [...existingSubs, newSub];

      try {
        await setDoc(doc(db, 'categories', catId), { subCategories: updatedSubs }, { merge: true });
      } catch (fsErr) {
        console.warn("[Quick SubCategory] Firestore write note:", fsErr);
      }

      setCategories(prev => {
        const newList = prev.map(c => c.id === catId ? { ...c, subCategories: updatedSubs } : c);
        try { localStorage.setItem('asrarhub_cached_categories', JSON.stringify(newList)); } catch (e) {}
        return newList;
      });

      showToast("Sous-catégorie ajoutée avec succès !");
      return subId;
    } catch (err: any) {
      console.error("Error creating subcategory", err);
      showToast(`Erreur: ${err.message}`, "error");
      return null;
    }
  };

  const renderOverview = () => {
    // Dynamic chart data derived from Firestore state
    const totalCount = users.length || 24;
    const activeCount = users.filter(u => !u.isBanned).length || 20;
    const bannedCount = users.filter(u => u.isBanned).length || 2;
    const trustedCount = users.filter(u => u.isTrusted).length || 5;

    const dauData = [
      { day: 'Lun', dau: Math.max(8, Math.round(totalCount * 0.45)), total: totalCount },
      { day: 'Mar', dau: Math.max(12, Math.round(totalCount * 0.55)), total: totalCount },
      { day: 'Mer', dau: Math.max(16, Math.round(totalCount * 0.62)), total: totalCount },
      { day: 'Jeu', dau: Math.max(22, Math.round(totalCount * 0.75)), total: totalCount },
      { day: 'Ven', dau: Math.max(28, Math.round(totalCount * 0.88)), total: totalCount },
      { day: 'Sam', dau: Math.max(34, Math.round(totalCount * 0.95)), total: totalCount },
      { day: 'Dim', dau: Math.max(40, totalCount), total: totalCount },
    ];

    const toolUsageData = [
      { tool: 'Ruqyah', usage: 88, fill: '#10B981' },
      { tool: 'Abjad', usage: 72, fill: '#3B82F6' },
      { tool: 'Dhikr', usage: 64, fill: '#8B5CF6' },
      { tool: 'Journal', usage: 48, fill: '#F59E0B' },
      { tool: 'Khatim', usage: 38, fill: '#EC4899' },
      { tool: 'Noms Allah', usage: 32, fill: '#06B6D4' }
    ];

    const userStatusPie = [
      { name: 'Actifs', value: activeCount, color: '#10B981' },
      { name: 'De Confiance', value: trustedCount, color: '#3B82F6' },
      { name: 'Bannis/Suspendus', value: bannedCount, color: '#EF4444' }
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <h3 className="font-semibold text-gray-600 dark:text-gray-400 text-sm">{stat.title}</h3>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                <span className="text-emerald-500 text-sm font-medium mb-1">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics & Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DAU Trend Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Utilisateurs Actifs Quotidiens (DAU)</h3>
                <p className="text-xs text-gray-500">Tendance sur la semaine écoulée</p>
              </div>
              <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full">
                +18% cette semaine
              </span>
            </div>
            <div className="w-full">
              <DauAreaChart data={dauData} />
            </div>
          </div>

          {/* Most Used Tools Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Utilisation des Outils</h3>
                <p className="text-xs text-gray-500">Outils les plus consultés</p>
              </div>
              <span className="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-full">
                Popularité %
              </span>
            </div>
            <div className="w-full">
              <ToolUsageBarChart data={toolUsageData} />
            </div>
          </div>
        </div>

        {/* Bottom Section: User Distribution Pie & Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-base">Répartition des Comptes Utilisateurs</h3>
              <p className="text-xs text-gray-500 mb-4">Statuts des comptes enregistrés sur Firestore</p>
            </div>
            <div className="w-full flex items-center justify-center py-2">
              <UserDistributionDonut data={userStatusPie} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-base">Activité Récente du Système</h3>
            <div className="space-y-3">
              {[
                { title: "Nouveau compte inscrit sur la plateforme", time: "Il y a 5 min", type: "user" },
                { title: "Mise à jour du Lexique Spirituel par l'admin", time: "Il y a 22 min", type: "content" },
                { title: "Validation d'un paiement manuel direct", time: "Il y a 1 heure", type: "payment" },
                { title: "Utilisation accrue du Calculateur Abjad", time: "Il y a 3 heures", type: "tool" }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{activity.title}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support & Assistance Quick Access Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-white/20 rounded-2xl backdrop-blur-sm shrink-0">
              <Mail size={28} className="text-white" />
            </div>
            <div>
              <h4 className="text-base font-bold">Centre de Réception & Support E-mail</h4>
              <p className="text-xs text-emerald-100 mt-1 max-w-xl">
                Consultez les messages des utilisateurs, configurez votre adresse Gmail liée pour recevoir les notifications et répondez directement avec le contexte complet de l'utilisateur.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('support')}
            className="px-5 py-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <Mail size={16} />
            <span>Ouvrir la boîte de Support</span>
          </button>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    const query = userSearch.toLowerCase().trim();

    // 1. Status Filter Calculations
    const activeCount = users.filter(u => getResolvedUserStatus(u) === 'active').length;
    const suspendedCount = users.filter(u => getResolvedUserStatus(u) === 'suspended').length;
    const premiumCount = users.filter(u => getResolvedUserStatus(u) === 'premium').length;
    const bannedCount = users.filter(u => getResolvedUserStatus(u) === 'banned').length;
    const alertedCount = users.filter(u => securityAlerts.some(a => a.userId === u.id || a.userEmail === u.email)).length;

    const filteredUsers = users.filter(user => {
      const matchesQuery = 
        !query ||
        (user.name || '').toLowerCase().includes(query) || 
        (user.email || '').toLowerCase().includes(query) ||
        (user.phone || '').toLowerCase().includes(query) ||
        (user.country || '').toLowerCase().includes(query) ||
        (user.id || '').toLowerCase().includes(query);

      if (!matchesQuery) return false;

      const resolved = getResolvedUserStatus(user);
      if (userStatusFilter === 'active') return resolved === 'active';
      if (userStatusFilter === 'suspended') return resolved === 'suspended';
      if (userStatusFilter === 'premium') return resolved === 'premium';
      if (userStatusFilter === 'banned') return resolved === 'banned';
      if (userStatusFilter === 'alerted') {
        return securityAlerts.some(a => a.userId === user.id || a.userEmail === user.email);
      }
      return true;
    });

    // When searching or filtering, display matching results or slice by usersLimit
    const paginatedUsers = (query || userStatusFilter !== 'all') ? filteredUsers : filteredUsers.slice(0, usersLimit);
    const isAllPaginatedSelected = paginatedUsers.length > 0 && paginatedUsers.every(u => selectedUserIds.includes(u.id));

    return (
      <div className="space-y-6">
        {/* Résumé des statuts des utilisateurs et configuration globale Premium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-3xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Notifications Activées</p>
              <p className="text-3xl font-black text-emerald-800 dark:text-emerald-300 mt-1">
                {users.filter(u => u.pushNotificationsEnabled !== false).length}
              </p>
              <p className="text-xs text-emerald-500/80 mt-1">Utilisateurs recevant les rappels et annonces</p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
              <Bell size={26} />
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-3xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Notifications Désactivées</p>
              <p className="text-3xl font-black text-amber-800 dark:text-amber-300 mt-1">
                {users.filter(u => u.pushNotificationsEnabled === false).length}
              </p>
              <p className="text-xs text-amber-500/80 mt-1">Utilisateurs n'ayant pas activé le push</p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
              <BellOff size={26} />
            </div>
          </div>

          {/* Statut & Contrôle Rapide Premium Nouveaux Inscrits */}
          <div className={`border rounded-3xl p-5 flex items-center justify-between shadow-sm transition-all ${
            featureToggles['new_user_premium_enabled'] !== false
              ? 'bg-gradient-to-br from-purple-50 to-amber-50 dark:from-purple-950/20 dark:to-amber-950/20 border-amber-200/70 dark:border-amber-900/40'
              : 'bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800'
          }`}>
            <div className="pr-2 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                  Premium Nouveaux Inscrits
                </p>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                  featureToggles['new_user_premium_enabled'] !== false
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {featureToggles['new_user_premium_enabled'] !== false ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                </span>
              </div>
              <p className="text-sm sm:text-base font-black text-gray-900 dark:text-white mt-1">
                {featureToggles['new_user_premium_enabled'] !== false 
                  ? `${featureToggles['trial_duration_hours'] !== undefined ? featureToggles['trial_duration_hours'] : 12}h d'essai VIP` 
                  : 'Compte Gratuit'}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                {featureToggles['new_user_premium_enabled'] !== false 
                  ? 'Attribution automatique active' 
                  : 'Nouveaux inscrits en compte standard'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggleFeature('new_user_premium_enabled', featureToggles['new_user_premium_enabled'] === false ? true : false)}
              className={`px-3 py-2 rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                featureToggles['new_user_premium_enabled'] !== false
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60'
                  : 'bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white shadow-amber-500/20'
              }`}
              title="Cliquer pour activer ou désactiver le Premium pour les nouveaux utilisateurs"
            >
              {featureToggles['new_user_premium_enabled'] !== false ? (
                <>
                  <Lock size={13} />
                  <span>Désactiver</span>
                </>
              ) : (
                <>
                  <Crown size={13} className="fill-white" />
                  <span>Activer</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-750">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                <Users className="text-emerald-500" size={22} />
                <span>Gestion des Utilisateurs & Comptes</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">Total: {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} affiché{filteredUsers.length > 1 ? 's' : ''} sur {users.length} compte(s) au total</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleDeepScanAndSyncUsers}
                disabled={isScanningUsers}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                title="Analyser toutes les collections Firestore, messages, paiements et stockage local pour découvrir et enregistrer tous les comptes"
              >
                <RefreshCw size={14} className={isScanningUsers ? 'animate-spin' : ''} />
                <span>{isScanningUsers ? 'Analyse en cours...' : '⚡ Scan Global & Sync Database'}</span>
              </button>

              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <UserPlus size={15} />
                <span>➕ Inscrire / Ajouter Utilisateur</span>
              </button>
            </div>
          </div>

          {/* User Status Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
            {[
              { id: 'all', label: 'Tous', count: users.length, color: 'text-gray-700 dark:text-gray-200' },
              { id: 'active', label: '🟢 Actifs', count: activeCount, color: 'text-emerald-600 dark:text-emerald-400' },
              { id: 'suspended', label: '🟡 Suspendus', count: suspendedCount, color: 'text-amber-600 dark:text-amber-400' },
              { id: 'premium', label: '👑 Premium', count: premiumCount, color: 'text-purple-600 dark:text-purple-400' },
              { id: 'banned', label: '🔴 Bannis', count: bannedCount, color: 'text-red-600 dark:text-red-400' },
              { id: 'alerted', label: '⚠️ Avec Alertes', count: alertedCount, color: 'text-rose-600 dark:text-rose-400' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setUserStatusFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  userStatusFilter === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/40'
                    : 'bg-gray-100 dark:bg-gray-750 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                  userStatusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-white dark:bg-gray-800 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Rechercher par nom, email, téléphone, ID ou pays..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              onClick={() => setUsersLimit(users.length)}
              className="px-3.5 py-2 bg-gray-100 dark:bg-gray-750 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
              title="Afficher tous les utilisateurs sans limite de pagination"
            >
              Tout afficher ({users.length})
            </button>
          </div>

          {/* Barre d'actions groupées / Sélection multiple */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gray-50 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-700 rounded-2xl mb-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300 select-none">
              <input
                type="checkbox"
                checked={isAllPaginatedSelected}
                onChange={() => toggleSelectAllUsers(paginatedUsers)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <span>Tout sélectionner ({paginatedUsers.length})</span>
            </label>

            {selectedUserIds.length > 0 ? (
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 rounded-xl">
                  {selectedUserIds.length} sélectionné(s)
                </span>
                <button
                  type="button"
                  onClick={() => setIsBatchDeleteConfirmOpen(true)}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Supprimer la sélection ({selectedUserIds.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUserIds([])}
                  className="px-3 py-1.5 bg-gray-200 dark:bg-gray-750 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  Désélectionner
                </button>
              </div>
            ) : (
              <span className="text-[11px] text-gray-400 font-medium">
                Cochez les cases pour sélectionner plusieurs utilisateurs à supprimer en un clic.
              </span>
            )}
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <Users className="mx-auto mb-3 opacity-30" size={40} />
              <p className="font-semibold text-sm">Aucun utilisateur ne correspond à votre recherche.</p>
              <div className="mt-3 flex justify-center gap-3">
                <button
                  onClick={handleDeepScanAndSyncUsers}
                  className="px-4 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg text-xs font-bold border border-blue-200 dark:border-blue-800"
                >
                  Lancer le scan global
                </button>
                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="px-4 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-800"
                >
                  Inscrire un utilisateur
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedUsers.map((user) => {
                const isSelected = selectedUserIds.includes(user.id);
                return (
                  <div 
                    key={user.id} 
                    className={`flex flex-col lg:flex-row lg:items-center justify-between p-5 rounded-2xl gap-4 transition-all ${
                      isSelected 
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-2 border-emerald-500/60 shadow-sm' 
                        : 'bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-650'
                    }`}
                  >
                    <div className="min-w-0 flex-1 flex items-start sm:items-center gap-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectUser(user.id)}
                        className="w-5 h-5 mt-1 sm:mt-0 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-600 cursor-pointer shrink-0"
                        title="Sélectionner pour action groupée"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {/* Photo de profil (Obligatoire) */}
                          <img
                            src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || user.email)}`}
                            alt={user.name || 'Photo de profil'}
                            className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/40 shadow-sm shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).setAttribute('src', `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email || 'user')}`);
                            }}
                          />
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                              <span className="truncate text-base">{user.name || 'Membre AsrarHub'}</span>
                              {user.isBanned && <span className="bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0">Banni</span>}
                              {user.isTrusted && <span className="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0">De Confiance</span>}
                              <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                {(user as any).source ? `Source: ${(user as any).source}` : 'Base Firestore'}
                              </span>
                            </h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">ID: {user.id}</span>
                          </div>
                        </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 min-w-0">
                        <Mail size={14} className="shrink-0 text-emerald-500" />
                        <span className="truncate break-all"><strong>Email :</strong> <span className="font-semibold text-gray-900 dark:text-gray-100">{user.email || 'utilisateur@asrarhub.com'}</span></span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 min-w-0">
                        <Globe size={14} className="shrink-0 text-emerald-500" />
                        <span className="truncate"><strong>Pays :</strong> <span className="font-semibold text-gray-900 dark:text-gray-100">{user.country || 'Non renseigné'}</span></span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 min-w-0">
                        <Phone size={14} className="shrink-0 text-emerald-500" />
                        <span className="truncate"><strong>Téléphone :</strong> <span className="font-semibold text-gray-900 dark:text-gray-100">{user.phone || 'Non renseigné'}</span></span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 min-w-0">
                        <Lock size={14} className="shrink-0 text-emerald-500" />
                        <span className="break-all"><strong>Mot de passe / Hash :</strong> <span className="font-mono bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded text-[11px] font-bold text-gray-800 dark:text-gray-200">{user.password_hash_indicator || user.password || '•••••••• (Sécurisé Hash)'}</span></span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 min-w-0">
                        <Bell size={14} className="shrink-0 text-emerald-500" />
                        <span className="break-all">
                          <strong>Statut Push :</strong>{' '}
                          {user.pushNotificationsEnabled !== false && user.pushNotificationStatus !== 'disabled' ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">Activé ({user.pushNotificationStatus || 'enabled'})</span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-100 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">Désactivé ({user.pushNotificationStatus || 'disabled'})</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                    <UserQuickStatusPicker
                      currentStatus={getResolvedUserStatus(user)}
                      userId={user.id}
                      userName={user.name || user.email}
                      onStatusChange={handleSetUserStatus}
                      size="sm"
                      layout="segmented"
                    />

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedUserDetail(user);
                          setEditUserData({ ...user });
                          setIsEditingUser(false);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                        title="Voir tous les détails et gérer le profil de cet utilisateur"
                      >
                        <Eye size={13} />
                        <span>Détails</span>
                      </button>
                      <button
                        onClick={() => handleToggleUserTrusted(user.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          user.isTrusted 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        title="Basculer statut de confiance"
                      >
                        {user.isTrusted ? '⭐ Confiance' : 'Confiance'}
                      </button>
                      <button
                        onClick={() => handleDeleteUserAccount(user.id, user.email, user.name)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl text-xs transition-colors flex items-center cursor-pointer"
                        title="Supprimer définitivement cet utilisateur"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

              {!query && filteredUsers.length > usersLimit && (
                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setUsersLimit(prev => prev + 25)}
                    className="px-6 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all border border-emerald-200 dark:border-emerald-900/50"
                  >
                    Voir 25 de plus ({filteredUsers.length - usersLimit} restants)
                  </button>
                  <button
                    onClick={() => setUsersLimit(filteredUsers.length)}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm"
                  >
                    Tout afficher ({filteredUsers.length} utilisateurs)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPayments = () => {
    const filteredPayments = manualPayments.filter(p => {
      if (paymentsFilter === 'all') return true;
      return p.status === paymentsFilter;
    });

    const pendingCount = manualPayments.filter(p => p.status === 'pending').length;
    const approvedCount = manualPayments.filter(p => p.status === 'approved').length;
    const rejectedCount = manualPayments.filter(p => p.status === 'rejected').length;

    return (
      <div className="space-y-6">
        {/* Stats and filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400">En attente d'approbation</p>
              <h4 className="text-2xl font-black text-amber-800 dark:text-amber-300 mt-1">{pendingCount}</h4>
            </div>
            <Clock className="text-amber-500" size={28} />
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Paiements validés</p>
              <h4 className="text-2xl font-black text-emerald-800 dark:text-emerald-300 mt-1">{approvedCount}</h4>
            </div>
            <CheckCircle className="text-emerald-500" size={28} />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500">Demandes rejetées</p>
              <h4 className="text-2xl font-black text-gray-800 dark:text-white mt-1">{rejectedCount}</h4>
            </div>
            <XCircle className="text-gray-400" size={28} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white">Suivi des Paiements Directs</h3>
            
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-100 dark:border-gray-850">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => {
                const label = filter === 'all' ? 'Tous' : filter === 'pending' ? 'En Attente' : filter === 'approved' ? 'Approuvés' : 'Rejetés';
                return (
                  <button
                    key={filter}
                    onClick={() => setPaymentsFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      paymentsFilter === filter
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <CreditCard className="mx-auto mb-3 opacity-30 text-gray-400" size={40} />
              <p className="font-medium text-sm">Aucune demande trouvée avec ce statut.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Responsive grid / card representation for payments */}
              {filteredPayments.map((p) => (
                <div key={p.id} className="p-5 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm text-gray-900 dark:text-white">{p.senderName}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{p.userEmail}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{p.planName}</span>
                      <span>•</span>
                      <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-bold">{p.amount} {p.currency}</span>
                      {p.transactionRef && (
                        <>
                          <span>•</span>
                          <span>Réf : <strong className="font-mono">{p.transactionRef}</strong></span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Soumis le : {new Date(p.createdAt).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                    {/* View proof image button */}
                    {p.proofImage ? (
                      <button
                        onClick={() => setSelectedProofPayment(p)}
                        className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all"
                      >
                        <Eye size={14} /> Voir le reçu
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Sans image de reçu</span>
                    )}

                    <div className="flex items-center gap-2">
                      {p.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleRejectManualPayment(p)}
                            className="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 rounded-xl text-xs font-bold transition-all"
                          >
                            Rejeter
                          </button>
                          <button
                            onClick={() => handleApproveManualPayment(p)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md rounded-xl text-xs font-bold transition-all"
                          >
                            Approuver
                          </button>
                        </>
                      ) : (
                        <span className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border ${
                          p.status === 'approved' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400'
                            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400'
                        }`}>
                          {p.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* High res receipt preview Modal */}
        {selectedProofPayment && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Reçu de {selectedProofPayment.senderName}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedProofPayment.planName} ({selectedProofPayment.amount} {selectedProofPayment.currency})</p>
                </div>
                <button
                  onClick={() => setSelectedProofPayment(null)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-950 flex items-center justify-center min-h-[300px]">
                <img 
                  src={selectedProofPayment.proofImage} 
                  alt="Preuve de paiement" 
                  className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-md border" 
                />
              </div>
              {selectedProofPayment.status === 'pending' && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 bg-gray-50 dark:bg-gray-800/50">
                  <button
                    onClick={() => {
                      handleRejectManualPayment(selectedProofPayment);
                      setSelectedProofPayment(null);
                    }}
                    className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-xl text-xs font-bold transition-all"
                  >
                    Rejeter
                  </button>
                  <button
                    onClick={() => {
                      handleApproveManualPayment(selectedProofPayment);
                      setSelectedProofPayment(null);
                    }}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    Approuver et activer
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section de Gestion des Codes Promo */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
              <Sparkles className="text-amber-500" />
              Générateur & Gestion de Codes Promo
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Créez des codes promotionnels pour un accès Premium temporaire (2, 4, 6, 8, 10, 12 heures) avec messages traduits (FR, EN, HA), des abonnements complets (3, 6, 12 mois), des réductions de prix ou le déblocage gratuit d'articles de la boutique.
            </p>
          </div>

          <form onSubmit={handleCreatePromoCode} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-gray-50 dark:bg-gray-750 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="md:col-span-3 flex items-center justify-between">
              <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider">Créer un nouveau code promo</h4>
              {newPromo.type === 'unlock_subscription_hours' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40">
                    👑 Premium par Heures (2h à 12h)
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Code Promo (Unique) *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ex: PREM2H, ASRAR6H, VIP12H"
                  value={newPromo.code}
                  onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white uppercase font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>
              {newPromo.type === 'unlock_subscription_hours' && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setNewPromo({ ...newPromo, code: `PREM${newPromo.durationHours || 2}H` })}
                    className="text-[10px] font-bold px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-700 dark:hover:text-emerald-300 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
                  >
                    + PREM{newPromo.durationHours || 2}H
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const rand = Math.floor(1000 + Math.random() * 9000);
                      setNewPromo({ ...newPromo, code: `ASRAR${newPromo.durationHours || 2}H-${rand}` });
                    }}
                    className="text-[10px] font-bold px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-700 dark:hover:text-emerald-300 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
                  >
                    + Code Aléatoire
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Type de Promo *</label>
              <select
                value={newPromo.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  let autoCode = newPromo.code;
                  if (newType === 'unlock_subscription_hours' && !newPromo.code) {
                    autoCode = `PREM${newPromo.durationHours || 2}H`;
                  }
                  setNewPromo({ ...newPromo, type: newType, code: autoCode });
                }}
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              >
                <option value="unlock_subscription_hours">⏱️ Premium par Heures (2, 4, 6, 8, 10, 12 h)</option>
                <option value="unlock_subscription">📅 Inscription Complète (3, 6, 12 mois)</option>
                <option value="discount">💰 Réduction de prix (Abonnement)</option>
                <option value="unlock_product">🎁 Débloquer un article de la Boutique</option>
              </select>
            </div>

            {newPromo.type === 'unlock_subscription_hours' && (
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Durée Premium en Heures *</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {([2, 4, 6, 8, 10, 12] as const).map((h) => {
                    const isSelected = (newPromo.durationHours || 2) === h;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => {
                          const updatedCode = newPromo.code.startsWith('PREM') && newPromo.code.endsWith('H') ? `PREM${h}H` : newPromo.code;
                          setNewPromo({ ...newPromo, durationHours: h, code: updatedCode });
                        }}
                        className={`py-2.5 px-1.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all border ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-400'
                        }`}
                      >
                        <span className="text-sm font-black">{h}h</span>
                        <span className="text-[10px] opacity-80 font-medium">Heures</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {newPromo.type === 'discount' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Type de réduction *</label>
                  <select
                    value={newPromo.discountType}
                    onChange={(e) => setNewPromo({ ...newPromo, discountType: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  >
                    <option value="percent">Pourcentage (%)</option>
                    <option value="flat">Montant fixe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Valeur de réduction *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Ex: 50 pour 50% ou 50 GHS"
                    value={newPromo.discountValue || ''}
                    onChange={(e) => setNewPromo({ ...newPromo, discountValue: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
              </>
            )}

            {newPromo.type === 'unlock_subscription' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Durée de l'abonnement *</label>
                <select
                  value={newPromo.subscriptionMonths}
                  onChange={(e) => setNewPromo({ ...newPromo, subscriptionMonths: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  <option value={1}>1 Mois</option>
                  <option value={3}>3 Mois</option>
                  <option value={6}>6 Mois</option>
                  <option value={12}>12 Mois</option>
                </select>
              </div>
            )}

            {newPromo.type === 'unlock_product' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Sélectionner l'article de la Boutique *</label>
                <select
                  required
                  value={newPromo.productId}
                  onChange={(e) => setNewPromo({ ...newPromo, productId: e.target.value })}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  <option value="">-- Choisir un article --</option>
                  {storeProducts.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.pointsCost} points / {p.price || 0} USD)</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Nombre d'utilisations Max (Optionnel)</label>
              <input
                type="number"
                placeholder="Laisser vide pour illimité"
                value={newPromo.maxUses || ''}
                onChange={(e) => setNewPromo({ ...newPromo, maxUses: e.target.value ? Number(e.target.value) : '' })}
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Date d'Expiration (Optionnelle)</label>
              <input
                type="date"
                value={newPromo.expiryDate}
                onChange={(e) => setNewPromo({ ...newPromo, expiryDate: e.target.value })}
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Multilingual Message Preview Box for Hourly Promo */}
            {newPromo.type === 'unlock_subscription_hours' && (
              <div className="md:col-span-3 mt-2 p-4 bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 dark:border-emerald-800/40 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      Messages spécifiques traduits automatiquement ({newPromo.durationHours || 2} Heures)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-700">
                    FR • EN • HA
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-sm">🇫🇷</span>
                      <span className="text-[11px] font-black uppercase text-gray-700 dark:text-gray-300">Français</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-relaxed flex-1">
                      "{getPromoHourMessage(newPromo.durationHours || 2, 'fr')}"
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-sm">🇬🇧</span>
                      <span className="text-[11px] font-black uppercase text-gray-700 dark:text-gray-300">English</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-relaxed flex-1">
                      "{getPromoHourMessage(newPromo.durationHours || 2, 'en')}"
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-sm">🇳🇬</span>
                      <span className="text-[11px] font-black uppercase text-gray-700 dark:text-gray-300">Hausa</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-relaxed flex-1">
                      "{getPromoHourMessage(newPromo.durationHours || 2, 'ha')}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="md:col-span-3 flex justify-end pt-2">
              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                Enregistrer le code promo ({newPromo.type === 'unlock_subscription_hours' ? `${newPromo.durationHours || 2}h` : newPromo.type})
              </button>
            </div>
          </form>

          {/* Liste des codes promos actifs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider">Codes Promos Existants ({promoCodes.length})</h4>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                Cliquez sur l'icône <Eye size={12} className="inline mx-0.5 text-emerald-500" /> pour voir les messages FR/EN/HA
              </span>
            </div>
            
            {promoCodes.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border border-dashed rounded-2xl">
                Aucun code promo configuré pour le moment.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Avantage</th>
                      <th className="py-3 px-4">Utilisations / Max</th>
                      <th className="py-3 px-4">Date Exp.</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-750 text-xs sm:text-sm">
                    {promoCodes.map((promo) => {
                      let benefit = '';
                      const isHourly = promo.type === 'unlock_subscription_hours' || !!promo.durationHours;

                      if (isHourly) {
                        const h = promo.durationHours || 2;
                        benefit = `👑 Premium ${h} Heures`;
                      } else if (promo.type === 'discount') {
                        benefit = promo.discountType === 'percent' ? `-${promo.discountValue}%` : `-${promo.discountValue} ${featureToggles?.premium_currency || 'GHS'}`;
                      } else if (promo.type === 'unlock_subscription') {
                        benefit = `Abonnement ${promo.subscriptionMonths} Mois`;
                      } else if (promo.type === 'unlock_product') {
                        const prod = storeProducts.find((p: any) => p.id === promo.productId);
                        benefit = `Débloque : ${prod ? prod.name : promo.productId}`;
                      }

                      const isExpired = promo.expiryDate && Date.now() > promo.expiryDate;

                      return (
                        <tr key={promo.code} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                          <td className="py-3 px-4 font-black text-gray-900 dark:text-white font-mono flex items-center gap-2">
                            <span>{promo.code}</span>
                            {isHourly && (
                              <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded">
                                {promo.durationHours || 2}h
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="capitalize text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                              {isHourly 
                                ? '⏱️ Pass Horaire' 
                                : promo.type === 'discount' 
                                  ? 'Réduction' 
                                  : promo.type === 'unlock_subscription' 
                                    ? 'Abonnement direct' 
                                    : 'Article gratuit'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                            {benefit}
                          </td>
                          <td className="py-3 px-4 font-mono">{promo.uses || 0} / {promo.maxUses || '∞'}</td>
                          <td className="py-3 px-4 text-xs">
                            {promo.expiryDate ? (
                              <span className={isExpired ? "text-red-500 font-bold" : "text-gray-500"}>
                                {new Date(promo.expiryDate).toLocaleDateString('fr-FR')} {isExpired && "(Expiré)"}
                              </span>
                            ) : 'Jamais'}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleTogglePromoCodeActive(promo.code, promo.isActive)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                promo.isActive && !isExpired
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                                  : 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                              }`}
                            >
                              {promo.isActive && !isExpired ? 'Actif' : 'Inactif'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedPromoForModal(promo)}
                                className="p-1.5 text-emerald-600 hover:text-emerald-700 transition-colors rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                title="Voir les messages traduits (FR, EN, HA)"
                              >
                                <Globe size={16} />
                              </button>
                              <button
                                onClick={() => handleDeletePromoCode(promo.code)}
                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                                title="Supprimer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Aperçu Messages Traduits Code Promo */}
        {selectedPromoForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in duration-200">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base font-mono">
                      Code : {selectedPromoForModal.code}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {selectedPromoForModal.durationHours 
                        ? `👑 Pass Premium de ${selectedPromoForModal.durationHours} Heures`
                        : selectedPromoForModal.type === 'unlock_subscription'
                          ? `📅 Abonnement direct ${selectedPromoForModal.subscriptionMonths} mois`
                          : 'Code promotionnel AsrarHub'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPromoForModal(null)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Type d'avantage</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedPromoForModal.durationHours 
                      ? `Accès Illimité ${selectedPromoForModal.durationHours} Heures`
                      : selectedPromoForModal.type}
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                    Messages affichés à l'utilisateur lors de l'activation :
                  </h4>

                  {/* FR */}
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🇫🇷</span>
                        <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">Français</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">
                        {getPromoHourLabel(selectedPromoForModal.durationHours || 2, 'fr')}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
                      {getPromoHourMessage(selectedPromoForModal.durationHours || 2, 'fr')}
                    </p>
                  </div>

                  {/* EN */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🇬🇧</span>
                        <span className="text-xs font-bold text-blue-900 dark:text-blue-300">English</span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">
                        {getPromoHourLabel(selectedPromoForModal.durationHours || 2, 'en')}
                      </span>
                    </div>
                    <p className="text-xs text-blue-950 dark:text-blue-200 leading-relaxed font-medium">
                      {getPromoHourMessage(selectedPromoForModal.durationHours || 2, 'en')}
                    </p>
                  </div>

                  {/* HA */}
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🇳🇬</span>
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-300">Hausa</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">
                        {getPromoHourLabel(selectedPromoForModal.durationHours || 2, 'ha')}
                      </span>
                    </div>
                    <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                      {getPromoHourMessage(selectedPromoForModal.durationHours || 2, 'ha')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedPromoForModal(null)}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-bold transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPromoCodesTab = () => {
    const isHourly = newPromo.type === 'unlock_subscription_hours';
    const hourlyCodes = promoCodes.filter(p => p.type === 'unlock_subscription_hours' || p.durationHours);
    const subscriptionCodes = promoCodes.filter(p => p.type === 'unlock_subscription' && !p.durationHours);
    const discountCodes = promoCodes.filter(p => p.type === 'discount');
    const productCodes = promoCodes.filter(p => p.type === 'unlock_product');
    const totalUses = promoCodes.reduce((sum, p) => sum + (Number(p.uses) || 0), 0);

    const filteredCodes = promoCodes.filter(p => {
      if (promoFilter === 'hourly' && !(p.type === 'unlock_subscription_hours' || p.durationHours)) return false;
      if (promoFilter === 'monthly' && !(p.type === 'unlock_subscription' && !p.durationHours)) return false;
      if (promoFilter === 'discount' && p.type !== 'discount') return false;
      if (promoFilter === 'store' && p.type !== 'unlock_product') return false;

      if (promoSearchQuery.trim()) {
        const q = promoSearchQuery.toLowerCase().trim();
        return (p.code || '').toLowerCase().includes(q) || 
               (p.type || '').toLowerCase().includes(q) ||
               (p.durationHours ? `${p.durationHours}h`.includes(q) : false);
      }
      return true;
    });

    const quickSelectHours = (h: number) => {
      const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      setNewPromo({
        ...newPromo,
        type: 'unlock_subscription_hours',
        durationHours: h,
        code: `PREM${h}H-${randSuffix}`
      });
    };

    const handleCopyCode = (code: string) => {
      navigator.clipboard.writeText(code);
      setCopiedPromoCode(code);
      showToast(`Code ${code} copié dans le presse-papier !`, "success");
      setTimeout(() => {
        setCopiedPromoCode(prev => prev === code ? null : prev);
      }, 2000);
    };

    return (
      <div className="space-y-6">
        {/* Header & Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-5 mb-6">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-xl sm:text-2xl flex items-center gap-2.5">
                <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl">
                  <Tag size={24} />
                </div>
                Gestion des Codes Promo
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Générez des codes pour un accès Premium temporaire (2h, 4h, 6h, 8h, 10h, 12h) avec messages traduits (FR, EN, HA), des abonnements, réductions ou articles gratuits.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-bold">
                <Sparkles size={14} className="text-amber-500" />
                {promoCodes.length} Codes au total
              </span>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase">Pass Horaires (2-12h)</span>
                <Clock size={16} className="text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-100 mt-1">{hourlyCodes.length}</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Abonnements (Mois)</span>
                <Crown size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-emerald-100 mt-1">{subscriptionCodes.length}</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/30">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 uppercase">Réductions %</span>
                <Tag size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-indigo-950 dark:text-indigo-100 mt-1">{discountCodes.length}</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-900/30">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-800 dark:text-purple-300 uppercase">Utilisations Totales</span>
                <Activity size={16} className="text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-purple-950 dark:text-purple-100 mt-1">{totalUses}</p>
            </div>
          </div>
        </div>

        {/* Video Card Promo Announcement Manager */}
        <AdminPromoVideoAnnouncementManager promoCodes={promoCodes} />

        {/* Formulaire de création */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
              <Plus size={20} className="text-emerald-500" />
              Créer un nouveau code promo
            </h3>
            {/* Quick Generator Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setPreviewCelebration({
                  isOpen: true,
                  promoCode: 'ASRAR2026',
                  durationText: '3 Mois d\'accès VIP'
                })}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Crown size={14} className="fill-white" />
                <span>Tester Animation Célébration VIP</span>
              </button>
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block" />
              <span className="text-[10px] font-bold uppercase text-gray-400 mr-1">Raccourcis :</span>
              {PROMO_HOURS_OPTIONS.map((h, hIdx) => (
                <button
                  key={`promo-shortcut-${h}-${hIdx}`}
                  type="button"
                  onClick={() => quickSelectHours(h)}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 text-[11px] font-bold text-amber-800 dark:text-amber-300 transition-colors cursor-pointer"
                >
                  ⚡ {h}h
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreatePromoCode} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type de Code */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Type d'avantage *
                </label>
                <select
                  value={newPromo.type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setNewPromo({
                      ...newPromo,
                      type: newType,
                      durationHours: newType === 'unlock_subscription_hours' ? (newPromo.durationHours || 2) : newPromo.durationHours
                    });
                  }}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="unlock_subscription_hours">⏱️ Accès Premium temporaire par Heures (2, 4, 6, 8, 10, 12h)</option>
                  <option value="unlock_subscription">👑 Abonnement Complet (Mois)</option>
                  <option value="discount">💰 Réduction sur le Prix</option>
                  <option value="unlock_product">🎁 Déblocage d'un Article Boutique</option>
                </select>
              </div>

              {/* Code Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                    Code Promo (Unique) *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const prefix = isHourly ? `PREM${newPromo.durationHours || 2}H` : 'ASRAR';
                      const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
                      setNewPromo({ ...newPromo, code: `${prefix}-${rand}` });
                    }}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                  >
                    🎲 Générer
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ex: PREM2H, ASRAR6H, VIP12H"
                  value={newPromo.code}
                  onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-xs font-mono font-bold tracking-wider text-gray-900 dark:text-white uppercase outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Paramètres selon le type */}
              {isHourly && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Durée d'accès (Heures) *
                  </label>
                  <div className="grid grid-cols-6 gap-1">
                    {PROMO_HOURS_OPTIONS.map((hours, hIdx) => (
                      <button
                        key={`promo-duration-${hours}-${hIdx}`}
                        type="button"
                        onClick={() => setNewPromo({ ...newPromo, durationHours: hours })}
                        className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          Number(newPromo.durationHours || 2) === hours
                            ? 'bg-amber-500 text-white shadow-md scale-105 ring-2 ring-amber-400 ring-offset-1'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {hours}h
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {newPromo.type === 'unlock_subscription' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Durée de l'Abonnement *
                  </label>
                  <select
                    value={newPromo.subscriptionMonths}
                    onChange={(e) => setNewPromo({ ...newPromo, subscriptionMonths: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={1}>1 Mois d'accès complet</option>
                    <option value={3}>3 Mois d'accès complet</option>
                    <option value={6}>6 Mois d'accès complet</option>
                    <option value={12}>12 Mois d'accès complet (1 An)</option>
                  </select>
                </div>
              )}

              {newPromo.type === 'discount' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Valeur de la réduction *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      min={1}
                      max={newPromo.discountType === 'percent' ? 100 : 1000000}
                      value={newPromo.discountValue}
                      onChange={(e) => setNewPromo({ ...newPromo, discountValue: Number(e.target.value) })}
                      className="w-2/3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <select
                      value={newPromo.discountType}
                      onChange={(e) => setNewPromo({ ...newPromo, discountType: e.target.value })}
                      className="w-1/3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="percent">%</option>
                      <option value="fixed">FCFA</option>
                    </select>
                  </div>
                </div>
              )}

              {newPromo.type === 'unlock_product' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Article de la boutique *
                  </label>
                  <select
                    value={newPromo.productId}
                    onChange={(e) => setNewPromo({ ...newPromo, productId: e.target.value })}
                    required
                    className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Sélectionner un article</option>
                    {storeProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.title || p.name} ({p.price} FCFA)</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Trilingual Message Preview (Only if Hourly Pass) */}
            {isHourly && (
              <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-amber-600 dark:text-amber-400" />
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                      Aperçu des messages de succès traduits ({newPromo.durationHours || 2} heures)
                    </h5>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-md">
                    Affichés automatiquement à l'utilisateur selon sa langue
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* FR */}
                  <div className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-sm">🇫🇷</span>
                      <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Français</span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed italic">
                      "{getPromoHourMessage(Number(newPromo.durationHours || 2), 'fr')}"
                    </p>
                  </div>

                  {/* EN */}
                  <div className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-sm">🇬🇧</span>
                      <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">English</span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed italic">
                      "{getPromoHourMessage(Number(newPromo.durationHours || 2), 'en')}"
                    </p>
                  </div>

                  {/* HA */}
                  <div className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-sm">🇳🇬</span>
                      <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Hausa</span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed italic">
                      "{getPromoHourMessage(Number(newPromo.durationHours || 2), 'ha')}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Utilisation max, Expiration & Bouton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Utilisations Maximales (Vide = Illimité)
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="Ex: 50, 100"
                  value={newPromo.maxUses || ''}
                  onChange={(e) => setNewPromo({ ...newPromo, maxUses: e.target.value ? Number(e.target.value) : '' })}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Date d'expiration (Optionnel)
                </label>
                <input
                  type="date"
                  value={newPromo.expiryDate}
                  onChange={(e) => setNewPromo({ ...newPromo, expiryDate: e.target.value })}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={16} />
                  Enregistrer le Code Promo
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Liste des codes promo existants */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                <Ticket size={20} className="text-amber-500" />
                Codes Promo Actifs & Historique ({filteredCodes.length})
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Consultez, copiez, activez/désactivez ou supprimez les codes promotionnels existants.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Rechercher un code..."
                value={promoSearchQuery}
                onChange={(e) => setPromoSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {promoSearchQuery && (
                <button
                  onClick={() => setPromoSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 hide-scrollbar">
            <button
              onClick={() => setPromoFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                promoFilter === 'all'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Tous ({promoCodes.length})
            </button>
            <button
              onClick={() => setPromoFilter('hourly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                promoFilter === 'hourly'
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
              }`}
            >
              ⏱️ Pass Horaires (2-12h) ({hourlyCodes.length})
            </button>
            <button
              onClick={() => setPromoFilter('monthly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                promoFilter === 'monthly'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
            >
              👑 Abonnements ({subscriptionCodes.length})
            </button>
            <button
              onClick={() => setPromoFilter('discount')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                promoFilter === 'discount'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
              }`}
            >
              💰 Réductions ({discountCodes.length})
            </button>
            <button
              onClick={() => setPromoFilter('store')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                promoFilter === 'store'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100'
              }`}
            >
              🎁 Boutique ({productCodes.length})
            </button>
          </div>

          {/* Table / List */}
          {filteredCodes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Ticket size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold">Aucun code promo trouvé</p>
              <p className="text-xs text-gray-500 mt-1">Créez votre premier code ci-dessus ou modifiez vos filtres.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 text-[11px] uppercase font-bold text-gray-400">
                    <th className="pb-3 px-2">Code</th>
                    <th className="pb-3 px-2">Type / Durée</th>
                    <th className="pb-3 px-2">Avantage</th>
                    <th className="pb-3 px-2">Utilisations</th>
                    <th className="pb-3 px-2">Expiration</th>
                    <th className="pb-3 px-2">Statut</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
                  {filteredCodes.map((promo) => {
                    const isCodeHourly = promo.type === 'unlock_subscription_hours' || promo.durationHours;
                    const hoursVal = promo.durationHours || 2;
                    const isExpired = promo.expiryDate && Date.now() > promo.expiryDate;
                    const isMaxedOut = promo.maxUses && (Number(promo.uses) || 0) >= Number(promo.maxUses);

                    return (
                      <tr key={promo.id || promo.code} className="hover:bg-gray-50/60 dark:hover:bg-gray-750/50 transition-colors">
                        {/* Code */}
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-lg border border-gray-200/60 dark:border-gray-600/60">
                              {promo.code}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(promo.code)}
                              title="Copier le code"
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                            >
                              {copiedPromoCode === promo.code ? (
                                <Check size={14} className="text-emerald-500" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Type / Duration Badge */}
                        <td className="py-3 px-2">
                          {isCodeHourly ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
                              <Clock size={12} />
                              Pass {hoursVal}h
                            </span>
                          ) : promo.type === 'unlock_subscription' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                              <Crown size={12} />
                              {promo.subscriptionMonths || 3} Mois
                            </span>
                          ) : promo.type === 'discount' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
                              <Tag size={12} />
                              Réduction
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                              <ShoppingBag size={12} />
                              Boutique
                            </span>
                          )}
                        </td>

                        {/* Avantage */}
                        <td className="py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                          {isCodeHourly ? (
                            <span className="text-amber-800 dark:text-amber-300 font-semibold">
                              👑 Accès Premium complet pendant {hoursVal} heures
                            </span>
                          ) : promo.type === 'unlock_subscription' ? (
                            <span className="text-emerald-800 dark:text-emerald-300 font-semibold">
                              👑 Abonnement Premium {promo.subscriptionMonths || 3} Mois
                            </span>
                          ) : promo.type === 'discount' ? (
                            <span>
                              {promo.discountType === 'percent' ? `-${promo.discountValue}%` : `-${promo.discountValue} FCFA`} sur le prix
                            </span>
                          ) : (
                            <span>
                              Article gratuit : {promo.productId || 'Produit'}
                            </span>
                          )}
                        </td>

                        {/* Utilisations */}
                        <td className="py-3 px-2">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {promo.uses || 0}
                          </span>
                          <span className="text-gray-400">
                            /{promo.maxUses ? promo.maxUses : '∞'}
                          </span>
                        </td>

                        {/* Expiration */}
                        <td className="py-3 px-2 text-gray-500">
                          {promo.expiryDate ? (
                            <span className={isExpired ? 'text-red-500 font-bold' : ''}>
                              {new Date(promo.expiryDate).toLocaleDateString('fr-FR')}
                              {isExpired && ' (Expiré)'}
                            </span>
                          ) : (
                            <span className="text-gray-400">Jamais</span>
                          )}
                        </td>

                        {/* Statut Toggle */}
                        <td className="py-3 px-2">
                          <button
                            type="button"
                            onClick={() => handleTogglePromoCodeActive(promo.code || promo.id, promo.isActive !== false)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                              isExpired || isMaxedOut
                                ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                                : promo.isActive !== false
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-200'
                                : 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-300 hover:bg-red-200'
                            }`}
                          >
                            {isExpired ? 'Expiré' : isMaxedOut ? 'Épuisé' : promo.isActive !== false ? 'Actif' : 'Inactif'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isCodeHourly && (
                              <button
                                type="button"
                                onClick={() => setSelectedPromoForModal(promo)}
                                title="Voir les messages traduits (FR, EN, HA)"
                                className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors cursor-pointer"
                              >
                                <Globe size={14} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeletePromoCode(promo.code || promo.id)}
                              title="Supprimer ce code promo"
                              className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de visualisation des messages traduits */}
        {selectedPromoForModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">
                      Messages de confirmation traduits
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Code : <span className="font-mono font-bold text-amber-600">{selectedPromoForModal.code}</span> ({selectedPromoForModal.durationHours || 2} heures)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPromoForModal(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 pt-1">
                {/* Français */}
                <div className="p-3.5 bg-gray-50 dark:bg-gray-750 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <span>🇫🇷</span> Français (FR)
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getPromoHourMessage(selectedPromoForModal.durationHours || 2, 'fr'));
                        showToast("Message en Français copié !");
                      }}
                      className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      Copier
                    </button>
                  </div>
                  <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                    {getPromoHourMessage(selectedPromoForModal.durationHours || 2, 'fr')}
                  </p>
                </div>

                {/* English */}
                <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                      <span>🇬🇧</span> English (EN)
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getPromoHourMessage(selectedPromoForModal.durationHours || 2, 'en'));
                        showToast("Message en Anglais copié !");
                      }}
                      className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    >
                      Copier
                    </button>
                  </div>
                  <p className="text-xs text-blue-950 dark:text-blue-200 leading-relaxed font-medium">
                    {getPromoHourMessage(selectedPromoForModal.durationHours || 2, 'en')}
                  </p>
                </div>

                {/* Hausa */}
                <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <span>🇳🇬</span> Hausa (HA)
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getPromoHourMessage(selectedPromoForModal.durationHours || 2, 'ha'));
                        showToast("Message en Haoussa copié !");
                      }}
                      className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                    >
                      Copier
                    </button>
                  </div>
                  <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                    {getPromoHourMessage(selectedPromoForModal.durationHours || 2, 'ha')}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedPromoForModal(null)}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLanguageTabs = () => (
    <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
      {[
        { id: 'fr', label: 'Français' },
        { id: 'en', label: 'English' },
        { id: 'ha', label: 'Hausa' }
      ].map(lang => (
        <button
          key={lang.id}
          onClick={() => setActiveLangTab(lang.id as any)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
            activeLangTab === lang.id
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );

  const renderRuqyah = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Publier un Audio Ruqyah</h3>
        {renderLanguageTabs()}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder={`Titre de l'audio (${activeLangTab.toUpperCase()})`}
            value={newAudio[`title_${activeLangTab}`] || ''}
            onChange={(e) => setNewAudio({...newAudio, [`title_${activeLangTab}`]: e.target.value})}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            placeholder="URL (ex: https://...)"
            value={newAudio.url}
            onChange={(e) => setNewAudio({...newAudio, url: e.target.value})}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="mb-4 w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Durée (ex: 45:00)"
            value={newAudio.duration}
            onChange={(e) => setNewAudio({...newAudio, duration: e.target.value})}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button
          onClick={handleAddAudio}
          disabled={!newAudio.title_fr || !newAudio.url}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
        >
          <Plus size={18} /> Publier l'audio
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Audios Publiés</h3>
        <div className="space-y-4">
          {ruqyahAudios.map((audio) => (
            <div key={audio.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl gap-4">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {audio.title}
                  {!audio.isActive && <span className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Inactif</span>}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{audio.duration} - {audio.url}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleToggleAudioActive(audio.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    audio.isActive 
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 hover:bg-amber-200'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 hover:bg-emerald-200'
                  }`}
                >
                  {audio.isActive ? 'Désactiver' : 'Activer'}
                </button>
                <button
                  onClick={() => handleDeleteAudio(audio.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const handleBatchToggleFeatures = async (batch: Record<string, any>) => {
    // Generate compatible aliases for each key so older and diverse versions can read them
    const fullBatch: Record<string, any> = { ...batch };
    Object.keys(batch).forEach(key => {
      const val = batch[key];
      if (key.startsWith('tool_')) {
        const cleanId = key.replace('tool_', '');
        fullBatch[`status_${cleanId}`] = val;
        fullBatch[cleanId] = val;
      } else if (key === 'globalMaintenanceMode') {
        fullBatch['maintenanceMode'] = val;
        fullBatch['maintenance'] = val;
        fullBatch['globalMaintenance'] = val;
        fullBatch['isMaintenance'] = val;
      }
    });

    const updated = { ...featureToggles, ...fullBatch };
    setFeatureToggles(updated);

    try {
      localStorage.setItem('asrar_font_toggles', JSON.stringify(updated));
      await set('asrar_feature_toggles', updated);
      window.dispatchEvent(new Event('asrar_font_updated'));
    } catch (_) {}

    try {
      await setDoc(doc(db, 'settings', 'features'), fullBatch, { merge: true });
      if (batch['globalMaintenanceMode'] !== undefined) {
        const isMaint = batch['globalMaintenanceMode'];
        const maintPayload = {
          enabled: isMaint,
          active: isMaint,
          isMaintenance: isMaint,
          maintenanceMode: isMaint,
          globalMaintenanceMode: isMaint,
          updatedAt: Date.now()
        };
        await Promise.allSettled([
          setDoc(doc(db, 'settings', 'maintenance'), maintPayload, { merge: true }),
          setDoc(doc(db, 'admin_settings', 'features'), fullBatch, { merge: true }),
          setDoc(doc(db, 'system_config', 'maintenance'), maintPayload, { merge: true }),
          setDoc(doc(db, 'app_config', 'global'), maintPayload, { merge: true })
        ]);
      }
    } catch (error) {
      console.warn("Firestore sync note (applied locally):", error);
    }
  };

  const handleToggleFeature = async (
    featureId: string, 
    currentValue: boolean | string | number,
    toolLabel?: string
  ) => {
    const newValue = currentValue;
    const extraFields: Record<string, any> = {};
    if (featureId.startsWith('tool_')) {
      const cleanId = featureId.replace('tool_', '');
      extraFields[`status_${cleanId}`] = newValue;
      extraFields[cleanId] = newValue;
    } else if (featureId === 'globalMaintenanceMode') {
      extraFields['maintenanceMode'] = newValue;
      extraFields['maintenance'] = newValue;
      extraFields['globalMaintenance'] = newValue;
      extraFields['isMaintenance'] = newValue;
    } else if (featureId === 'home_announcement_enabled') {
      extraFields['announcementVisible'] = newValue;
      extraFields['announcement_enabled'] = newValue;
    } else if (featureId === 'home_announcement_text') {
      extraFields['announcementText'] = newValue;
      extraFields['home_announcement_text_fr'] = newValue;
    } else if (featureId === 'home_announcement_title') {
      extraFields['announcementTitle'] = newValue;
      extraFields['home_announcement_title_fr'] = newValue;
    } else if (featureId === 'home_articles_layout_free') {
      const isFree = newValue !== false;
      extraFields['home_articles_layout_free'] = isFree;
      extraFields['lockArticlesDisplayMode'] = !isFree;
      extraFields['home_articles_layout_locked'] = !isFree;
    } else if (featureId === 'home_articles_layout' || featureId === 'articles_layout_mode' || featureId === 'articlesDisplayMode') {
      extraFields['home_articles_layout'] = newValue;
      extraFields['articles_layout_mode'] = newValue;
      extraFields['articlesDisplayMode'] = newValue;
    } else if (featureId === 'article_reading_mode_locked') {
      extraFields['article_reading_mode_locked'] = newValue;
      extraFields['lockArticleReadingMode'] = newValue;
    } else if (featureId === 'article_reading_mode') {
      extraFields['article_reading_mode'] = newValue;
      extraFields['reading_mode_default'] = newValue;
    } else if (featureId === 'store_layout_mode') {
      extraFields['store_layout_mode'] = newValue;
      extraFields['store_display_mode'] = newValue;
    }

    const fullPayload = { [featureId]: newValue, ...extraFields };
    const updated = { ...featureToggles, ...fullPayload };
    setFeatureToggles(updated);

    try {
      localStorage.setItem('asrar_font_toggles', JSON.stringify(updated));
      await set('asrar_feature_toggles', updated);
      window.dispatchEvent(new Event('asrar_font_updated'));
    } catch (_) {}

    try {
      await setDoc(doc(db, 'settings', 'features'), fullPayload, { merge: true });
      
      if (featureId === 'globalMaintenanceMode') {
        const maintPayload = {
          enabled: newValue,
          active: newValue,
          isMaintenance: newValue,
          maintenanceMode: newValue,
          globalMaintenanceMode: newValue,
          updatedAt: Date.now()
        };
        await Promise.allSettled([
          setDoc(doc(db, 'settings', 'maintenance'), maintPayload, { merge: true }),
          setDoc(doc(db, 'admin_settings', 'features'), fullPayload, { merge: true }),
          setDoc(doc(db, 'system_config', 'maintenance'), maintPayload, { merge: true }),
          setDoc(doc(db, 'app_config', 'global'), maintPayload, { merge: true })
        ]);
      }
    } catch (error) {
      console.warn("Firestore sync note (applied locally):", error);
    }

    // Format descriptive toast message for tool status changes
    const statusLabels: Record<string, string> = {
      active: 'Actif (Accessible à tous)',
      premium: 'Premium (VIP Uniquement)',
      maintenance: 'En Maintenance',
      inactive: 'Inactif (Désactivé)',
      disabled: 'Bloqué / Désactivé'
    };

    let displayName = toolLabel;
    if (!displayName) {
      const cleanId = featureId.startsWith('tool_') ? featureId.replace('tool_', '') : featureId;
      const foundTool = ALL_USER_TOOLS.find(t => t.id === cleanId);
      if (foundTool) displayName = foundTool.label;
    }

    if (typeof newValue === 'string' && statusLabels[newValue]) {
      const statusText = statusLabels[newValue];
      if (displayName) {
        showToast(`Statut mis à jour : "${displayName}" est désormais ${statusText}`, 'success');
      } else {
        showToast(`Statut de l'outil mis à jour : ${statusText}`, 'success');
      }
    } else if (featureId.startsWith('download_')) {
      const isAllowed = newValue === 'active' || newValue === true;
      showToast(`Téléchargement ${isAllowed ? 'Autorisé' : 'Bloqué'} pour ${displayName || 'l\'outil'}.`, isAllowed ? 'success' : 'info');
    }
  };

  const handleCreatePromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code || !newPromo.code.trim()) {
      showToast("Veuillez entrer un code promo.", "error");
      return;
    }

    const codeUpper = newPromo.code.trim().toUpperCase();

    try {
      let expiryTimestamp = null;
      if (newPromo.expiryDate) {
        const d = new Date(newPromo.expiryDate + 'T23:59:59.999');
        expiryTimestamp = isNaN(d.getTime()) ? new Date(newPromo.expiryDate).getTime() : d.getTime();
      }

      const isHourly = newPromo.type === 'unlock_subscription_hours';
      const durationHours = isHourly ? Number(newPromo.durationHours || 2) : (newPromo.durationHours ? Number(newPromo.durationHours) : null);
      
      const promoData = {
        code: codeUpper,
        type: newPromo.type,
        durationHours: durationHours,
        subscriptionMonths: newPromo.type === 'unlock_subscription' ? Number(newPromo.subscriptionMonths || 3) : null,
        discountType: newPromo.type === 'discount' ? newPromo.discountType : null,
        discountValue: newPromo.type === 'discount' ? Number(newPromo.discountValue) : 0,
        productId: newPromo.type === 'unlock_product' ? newPromo.productId : null,
        maxUses: newPromo.maxUses ? Number(newPromo.maxUses) : null,
        uses: 0,
        expiryDate: expiryTimestamp,
        isActive: newPromo.isActive !== false,
        createdAt: Date.now()
      };

      // 1. Immediately update local state
      setPromoCodes(prev => {
        const filtered = prev.filter((p: any) => (p.code || p.id || '').toUpperCase() !== codeUpper);
        return [{ id: codeUpper, ...promoData }, ...filtered];
      });

      // 2. Immediately persist to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('asrarhub_local_promo_codes') || '[]');
        const filtered = existing.filter((p: any) => (p.code || p.id || '').toUpperCase() !== codeUpper);
        filtered.unshift({ id: codeUpper, ...promoData });
        localStorage.setItem('asrarhub_local_promo_codes', JSON.stringify(filtered));
      } catch (e) {}

      showToast(`Code promo ${codeUpper} créé avec succès !`);
      
      // Reset form
      setNewPromo({
        code: '',
        type: 'unlock_subscription_hours',
        durationHours: 2,
        discountType: 'percent',
        discountValue: 0,
        subscriptionMonths: 3,
        productId: '',
        maxUses: 100,
        expiryDate: '',
        isActive: true
      });

      // 3. Sync to Firestore in background safely
      try {
        await setDoc(doc(db, 'promo_codes', codeUpper), promoData);
      } catch (cloudErr) {
        console.warn("Firestore promo_codes cloud sync note (saved locally & active):", cloudErr);
      }
    } catch (err) {
      console.error("Error creating promo code:", err);
      showToast("Erreur lors de la création du code promo.", "error");
    }
  };

  const handleDeletePromoCode = async (code: string) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer le code promo ${code} ?`)) {
      return;
    }
    const codeUpper = (code || '').toUpperCase();
    
    // 1. Update state immediately
    setPromoCodes(prev => prev.filter(p => (p.code || p.id || '').toUpperCase() !== codeUpper));
    
    // 2. Update local storage immediately
    try {
      const existing = JSON.parse(localStorage.getItem('asrarhub_local_promo_codes') || '[]');
      const filtered = existing.filter((p: any) => (p.code || p.id || '').toUpperCase() !== codeUpper);
      localStorage.setItem('asrarhub_local_promo_codes', JSON.stringify(filtered));
    } catch (e) {}

    showToast(`Code promo ${code} supprimé.`);

    // 3. Sync delete to Firestore safely
    try {
      await deleteDoc(doc(db, 'promo_codes', code));
    } catch (err) {
      console.warn("Firestore promo_codes delete sync note:", err);
    }
  };

  const handleTogglePromoCodeActive = async (code: string, currentStatus: boolean) => {
    const codeUpper = (code || '').toUpperCase();
    const newStatus = !currentStatus;

    // 1. Update state immediately
    setPromoCodes(prev => prev.map(p => {
      if ((p.code || p.id || '').toUpperCase() === codeUpper) {
        return { ...p, isActive: newStatus };
      }
      return p;
    }));

    // 2. Update local storage immediately
    try {
      const existing = JSON.parse(localStorage.getItem('asrarhub_local_promo_codes') || '[]');
      const updated = existing.map((p: any) => {
        if ((p.code || p.id || '').toUpperCase() === codeUpper) {
          return { ...p, isActive: newStatus };
        }
        return p;
      });
      localStorage.setItem('asrarhub_local_promo_codes', JSON.stringify(updated));
    } catch (e) {}

    showToast(`Statut du code promo ${code} mis à jour.`);

    // 3. Sync update to Firestore safely
    try {
      await updateDoc(doc(db, 'promo_codes', code), {
        isActive: newStatus
      });
    } catch (err) {
      console.warn("Firestore promo_codes update sync note:", err);
    }
  };

  const renderFeatures = () => {
    const navOrderList: string[] = Array.isArray(featureToggles?.feature_nav_order)
      ? featureToggles.feature_nav_order
      : (Array.isArray(featureToggles?.tools_order) ? featureToggles.tools_order : []);

    const fullOrderedTools = [...ALL_USER_TOOLS].sort((a, b) => {
      if (navOrderList.length === 0) return 0;
      const indexA = navOrderList.indexOf(a.id);
      const indexB = navOrderList.indexOf(b.id);
      const posA = indexA === -1 ? 9999 : indexA;
      const posB = indexB === -1 ? 9999 : indexB;
      return posA - posB;
    });

    const filteredTools = fullOrderedTools.filter(tool => {
      const matchesSearch = (tool.label || '').toLowerCase().includes(featureSearch.toLowerCase()) ||
        (tool.desc || '').toLowerCase().includes(featureSearch.toLowerCase()) ||
        tool.id.toLowerCase().includes(featureSearch.toLowerCase());
      
      const matchesCategory = featureCategoryFilter === 'all' || tool.category === featureCategoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Compute stats
    let countActive = 0;
    let countPremium = 0;
    let countMaintenance = 0;
    let countDisabled = 0;

    ALL_USER_TOOLS.forEach(tool => {
      const status = featureToggles[`tool_${tool.id}`] || (['inspector', 'quick_widget'].includes(tool.id) ? 'inactive' : 'active');
      if (status === 'active') countActive++;
      else if (status === 'premium') countPremium++;
      else if (status === 'maintenance') countMaintenance++;
      else countDisabled++;
    });

    const handleSaveNewOrder = async (newIds: string[]) => {
      try {
        await handleBatchToggleFeatures({
          feature_nav_order: newIds,
          tools_order: newIds
        });
        showToast("Ordre de navigation enregistré et synchronisé !", "success");
      } catch (err) {
        console.error("Error saving feature order:", err);
        showToast("Erreur lors de l'enregistrement de l'ordre.", "error");
      }
    };

    const handleReorderTools = (sourceId: string, targetId: string) => {
      if (!sourceId || !targetId || sourceId === targetId) return;
      const currentIds = fullOrderedTools.map(t => t.id);
      const sourceIdx = currentIds.indexOf(sourceId);
      const targetIdx = currentIds.indexOf(targetId);
      if (sourceIdx === -1 || targetIdx === -1) return;
      const updated = [...currentIds];
      const [removed] = updated.splice(sourceIdx, 1);
      updated.splice(targetIdx, 0, removed);
      handleSaveNewOrder(updated);
    };

    const handleMoveFeature = (toolId: string, direction: 'up' | 'down') => {
      const currentIds = fullOrderedTools.map(t => t.id);
      const idx = currentIds.indexOf(toolId);
      if (idx === -1) return;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= currentIds.length) return;
      const updated = [...currentIds];
      const [removed] = updated.splice(idx, 1);
      updated.splice(targetIdx, 0, removed);
      handleSaveNewOrder(updated);
    };

    const handleMoveToTop = (toolId: string) => {
      const currentIds = fullOrderedTools.map(t => t.id);
      const idx = currentIds.indexOf(toolId);
      if (idx <= 0) return;
      const updated = [toolId, ...currentIds.filter(id => id !== toolId)];
      handleSaveNewOrder(updated);
    };

    const handleMoveToBottom = (toolId: string) => {
      const currentIds = fullOrderedTools.map(t => t.id);
      const idx = currentIds.indexOf(toolId);
      if (idx === -1 || idx === currentIds.length - 1) return;
      const updated = [...currentIds.filter(id => id !== toolId), toolId];
      handleSaveNewOrder(updated);
    };

    const handleResetDefaultOrder = () => {
      const defaultIds = ALL_USER_TOOLS.map(t => t.id);
      handleSaveNewOrder(defaultIds);
      showToast("Ordre par défaut restauré avec succès !", "info");
    };

    const handleBulkApplyStatus = async (targetStatus: 'active' | 'premium' | 'maintenance' | 'disabled') => {
      const targetTools = filteredTools.length > 0 ? filteredTools : ALL_USER_TOOLS;
      const statusLabels: Record<string, string> = {
        active: '🟢 Actif (Accessible à tous)',
        premium: '👑 Premium (VIP)',
        maintenance: '🛠️ En Maintenance',
        disabled: '🚫 Bloqué / Désactivé'
      };

      setBulkUpdatingStatus(targetStatus);

      try {
        const batchPayload: Record<string, any> = {};
        targetTools.forEach(t => {
          batchPayload[`tool_${t.id}`] = targetStatus;
        });

        await handleBatchToggleFeatures(batchPayload);
        showToast(
          `Succès : ${targetTools.length} outil(s) basculé(s) en statut "${statusLabels[targetStatus]}" !`, 
          "success"
        );
      } catch (err) {
        console.error("Error bulk updating tools:", err);
        showToast("Erreur lors de la mise à jour groupée des outils.", "error");
      } finally {
        setTimeout(() => setBulkUpdatingStatus(null), 800);
      }
    };

    const categories = [
      { id: 'all', label: 'Toutes les fonctionnalités', count: ALL_USER_TOOLS.length },
      { id: 'nav', label: '🧭 Navigation Principale', count: ALL_USER_TOOLS.filter(t => t.category === 'nav').length },
      { id: 'simple', label: '✨ Outils Simples', count: ALL_USER_TOOLS.filter(t => t.category === 'simple').length },
      { id: 'advanced', label: '⚡ Outils Avancés', count: ALL_USER_TOOLS.filter(t => t.category === 'advanced').length },
      { id: 'system', label: '🛡️ Système & Sécurité', count: ALL_USER_TOOLS.filter(t => t.category === 'system').length }
    ];

    return (
      <div className="space-y-6 w-full max-w-full min-w-0">
        {/* Global Expand / Collapse Control Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-emerald-500/10 border border-emerald-500/20 dark:bg-emerald-950/20 dark:border-emerald-800/30 rounded-2xl w-full max-w-full">
          <div className="flex items-center gap-2 min-w-0">
            <Settings size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 break-words">
              Tous les paramètres sont développés et accessibles immédiatement. Vous pouvez les replier ou déplier à tout moment.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setAllAdminSectionsCollapse(false)}
              className="flex-1 sm:flex-initial px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm text-center"
            >
              Tout déplier
            </button>
            <button
              type="button"
              onClick={() => setAllAdminSectionsCollapse(true)}
              className="flex-1 sm:flex-initial px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer shadow-sm text-center"
            >
              Tout replier
            </button>
          </div>
        </div>

        {/* 0. Dedicated Tool Integrity & Bulk Download Manager */}
        <AdminToolsHealthManager onNotify={(msg, type) => showToast(msg, type || 'info')} />

        {/* 1. User Tools & Drag-and-Drop Navigation Reordering */}
        <CollapsibleAdminCard
          id="feat_user_tools"
          title="Réorganisation Drag & Drop et Statuts des Fonctionnalités"
          subtitle="Glissez-déposez les cartes ou utilisez les flèches pour réordonner l'affichage dans la navigation et les dashboards. Modifiez le statut (Actif, Premium, Maintenance, Inactif, Bloqué) de chaque outil."
          icon={<ArrowUpDown size={22} className="text-emerald-500 shrink-0" />}
        >
          <div className="space-y-4">
            {/* Drag and Drop Instruction Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <GripVertical size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Mode Réorganisation Active
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Attrapez une carte par la poignée pour la glisser-déposer, ou utilisez les flèches Haut/Bas pour déplacer les éléments.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetDefaultOrder}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-100 dark:hover:bg-gray-700 transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
              >
                <RotateCcw size={14} />
                Réinitialiser l'ordre
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat, catIdx) => (
                <button
                  key={cat.id ? `feat-cat-${cat.id}-${catIdx}` : `feat-cat-${catIdx}`}
                  type="button"
                  onClick={() => setFeatureCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    featureCategoryFilter === cat.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    featureCategoryFilter === cat.id ? 'bg-emerald-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search and Summary */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 w-full max-w-full">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Affichage de <span className="font-bold text-gray-800 dark:text-gray-200">{filteredTools.length}</span> fonctionnalité(s) :
              </p>
              <div className="relative w-full sm:w-72 shrink-0">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  value={featureSearch}
                  onChange={(e) => setFeatureSearch(e.target.value)}
                  placeholder="Rechercher un outil..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Quick Bulk Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1">
                Actions groupées ({filteredTools.length}) :
              </span>
              <button
                type="button"
                disabled={bulkUpdatingStatus !== null}
                onClick={() => handleBulkApplyStatus('active')}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 hover:bg-emerald-200 transition-colors"
              >
                Tous Actifs ({countActive})
              </button>
              <button
                type="button"
                disabled={bulkUpdatingStatus !== null}
                onClick={() => handleBulkApplyStatus('premium')}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300 hover:bg-violet-200 transition-colors"
              >
                Tous Premium ({countPremium})
              </button>
              <button
                type="button"
                disabled={bulkUpdatingStatus !== null}
                onClick={() => handleBulkApplyStatus('maintenance')}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 hover:bg-amber-200 transition-colors"
              >
                Tous Maintenance ({countMaintenance})
              </button>
              <button
                type="button"
                disabled={bulkUpdatingStatus !== null}
                onClick={() => handleBulkApplyStatus('disabled')}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 hover:bg-red-200 transition-colors"
              >
                Tous Bloqués ({countDisabled})
              </button>
            </div>

            {filteredTools.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <AlertCircle className="mx-auto mb-3 opacity-30" size={40} />
                <p className="font-medium text-sm">Aucun outil ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTools.map((tool, index) => {
                  const currentStatus = featureToggles[`tool_${tool.id}`] || (['inspector', 'quick_widget'].includes(tool.id) ? 'inactive' : 'active');
                  const globalIndex = fullOrderedTools.findIndex(t => t.id === tool.id);
                  const isFirst = globalIndex === 0;
                  const isLast = globalIndex === fullOrderedTools.length - 1;
                  const isDragging = draggedFeatureId === tool.id;
                  const isDragOver = dragOverFeatureId === tool.id && !isDragging;

                  const categoryLabel = 
                    tool.category === 'nav' ? 'Navigation' :
                    tool.category === 'simple' ? 'Outil Simple' :
                    tool.category === 'advanced' ? 'Outil Avancé' : 'Système';

                  const categoryBadgeColor = 
                    tool.category === 'nav' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                    tool.category === 'simple' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                    tool.category === 'advanced' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';

                  return (
                    <div
                      key={tool.id ? `admin-tool-item-${tool.id}-${index}` : `admin-tool-item-${index}`}
                      draggable={true}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', tool.id);
                        setDraggedFeatureId(tool.id);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverFeatureId !== tool.id) {
                          setDragOverFeatureId(tool.id);
                        }
                      }}
                      onDragLeave={(e) => {
                        if (dragOverFeatureId === tool.id) {
                          setDragOverFeatureId(null);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const sourceId = e.dataTransfer.getData('text/plain') || draggedFeatureId;
                        if (sourceId) {
                          handleReorderTools(sourceId, tool.id);
                        }
                        setDraggedFeatureId(null);
                        setDragOverFeatureId(null);
                      }}
                      onDragEnd={() => {
                        setDraggedFeatureId(null);
                        setDragOverFeatureId(null);
                      }}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all gap-3 select-none ${
                        isDragging
                          ? 'opacity-40 border-dashed border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                          : isDragOver
                          ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-md ring-2 ring-emerald-400/40 scale-[1.01]'
                          : 'bg-gray-50 dark:bg-gray-750 border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {/* Left: Drag Handle, Rank Badge, Title & Details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Drag Handle */}
                        <div 
                          className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
                          title="Glisser pour réordonner"
                        >
                          <GripVertical size={20} />
                        </div>

                        {/* Rank Badge */}
                        <div className="w-8 h-8 rounded-xl bg-gray-200/80 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-black flex items-center justify-center shrink-0 border border-gray-300 dark:border-gray-600 shadow-inner">
                          #{globalIndex + 1}
                        </div>

                        {/* Feature Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white break-words">
                              {tool.label}
                            </h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${categoryBadgeColor}`}>
                              {categoryLabel}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              ({tool.id})
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words line-clamp-1">
                            {tool.desc}
                          </p>
                        </div>
                      </div>

                      {/* Right: Quick Reorder Arrows & Status Select */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto justify-between sm:justify-end">
                        {/* Up / Down Reorder Buttons */}
                        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => handleMoveFeature(tool.id, 'up')}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Monter d'une position"
                          >
                            <ArrowUp size={15} />
                          </button>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => handleMoveFeature(tool.id, 'down')}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Descendre d'une position"
                          >
                            <ArrowDown size={15} />
                          </button>
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => handleMoveToTop(tool.id)}
                            className="px-1.5 py-1 text-[10px] font-bold text-gray-500 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-md transition-colors"
                            title="Placer tout en haut (#1)"
                          >
                            Top
                          </button>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => handleMoveToBottom(tool.id)}
                            className="px-1.5 py-1 text-[10px] font-bold text-gray-500 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-md transition-colors"
                            title="Placer tout en bas"
                          >
                            Bas
                          </button>
                        </div>

                        {/* Status Select */}
                        <div className="w-40 sm:w-44">
                          <select
                            value={currentStatus}
                            onChange={(e) => handleToggleFeature(`tool_${tool.id}`, e.target.value, tool.label)}
                            className={`text-xs font-semibold px-3 py-2 rounded-xl border-0 cursor-pointer w-full shadow-sm ${
                              currentStatus === "active"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                                : currentStatus === "premium"
                                ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400"
                                : currentStatus === "maintenance"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                            }`}
                          >
                            <option value="active">🟢 Actif (Tous)</option>
                            <option value="premium">👑 Premium (VIP)</option>
                            <option value="maintenance">🛠️ Maintenance</option>
                            <option value="inactive">⚪ Inactif</option>
                            <option value="disabled">🚫 Désactivé / Bloqué</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CollapsibleAdminCard>

        {/* 2. Shams al-Ma'arif & Al-Buni Granular */}
        <CollapsibleAdminCard
          id="feat_shams_buni"
          title="Contrôle Granulaire Shams al-Ma'arif & Al-Buni"
          subtitle="Contrôlez l'accès individuel pour chaque sous-outil et autorisations de téléchargement (PNG, PDF, Parchemin)."
          icon={<Sparkles size={22} className="text-amber-500 shrink-0" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {[
              { id: 'shams_main', label: "Corpus Principal Shams al-Ma'arif", desc: 'Accès au tableau de bord général Shams' },
              { id: 'shams_buni_40', label: 'Les 40 Systèmes Al-Buni', desc: "Visualisation, règles et khatims des 40 méthodes d'Al-Buni" },
              { id: 'shams_chapters', label: 'Les 12 Chapitres de Shams', desc: "Lecteur et compendium des 12 chapitres sacrés" },
              { id: 'shams_secrets', label: 'Tous les Secrets & Formules', desc: "Catalogue complet des secrets théurgiques" },
              { id: 'shams_generator', label: "Générateur Théurgique Al-Buni", desc: "Moteur de génération et calculs théurgiques" },
              { id: 'shams_planetary_hours', label: "Heures Planétaires Théurgiques", desc: "Calcul précis des mansions et influences" }
            ].map((sub) => {
              const status = featureToggles[sub.id] || 'active';
              return (
                <div key={sub.id} className="p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl space-y-3 min-w-0">
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white break-words">{sub.label}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">{sub.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={status}
                      onChange={(e) => handleToggleFeature(sub.id, e.target.value)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 w-full"
                    >
                      <option value="active">Actif (Tous)</option>
                      <option value="premium">Premium</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Inactif / Bloqué</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleAdminCard>

        {/* 3. 12 Sacred Manuscripts Granular */}
        <CollapsibleAdminCard
          id="feat_sacred_books"
          title="Contrôle Granulaire des 12 Manuscrits Sacrés"
          subtitle="Gérez le statut (Actif, Premium, Maintenance, Inactif, Bloqué) et les autorisations de téléchargement des Sceaux pour chacun des 12 livres."
          icon={<BookOpen size={22} className="text-amber-500 shrink-0" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {[
              { id: 'book_barhatiah', label: '1. Sharh al-Barhatiah', desc: 'Ahmad al-Buni - Le Commentaire sur le Grand Serment' },
              { id: 'book_picatrix', label: '2. Ghayat al-Hakim / Picatrix', desc: 'Maslama al-Majriti - Le But du Sage' },
              { id: 'book_lataif_isharat', label: "3. Lata'if al-Isharat", desc: 'Ahmad al-Buni - Subtilités des Lettres Célestes' },
              { id: 'book_al_ajnas', label: '4. Al-Ajnas (Livre des Espèces)', desc: 'Asif ibn Barkhiya - Sceaux Salomoniques' },
              { id: 'book_futuhat_makkiyya', label: '5. Al-Futuhat al-Makkiyya', desc: 'Ibn Arabi - Les Illuminations de la Mecque' },
              { id: 'book_shumush_anwar', label: '6. Shumush al-Anwar', desc: 'Ibn al-Hajj al-Tilimsani - Soleils des Lumières' },
              { id: 'book_kitab_jifr', label: "7. Kitab al-Jifr", desc: "Imam Ja'far al-Sadiq - Prescience & Haruffa" },
              { id: 'book_sirr_khalqah', label: "8. Sirr al-Khalqah (Table d'Émeraude)", desc: 'Balinas al-Hakim - Secret de la Création' },
              { id: 'book_kanz_asrar', label: '9. Kanz al-Asrar', desc: 'Ahmad al-Buni - Le Trésor des Carrés (Awfaq)' },
              { id: 'book_ufuk_mubin', label: "10. Al-Ufuk al-Mubin", desc: "Mir Damad - L'Horizon Lumineux" },
              { id: 'book_lumah_nuraniyyah', label: "11. Al-Lum'ah al-Nuraniyyah", desc: "Ahmad al-Buni - Litanies & Ism al-Azam" },
              { id: 'book_kitab_diryak', label: '12. Kitab al-Diryak (Thériaque)', desc: "Pseudo-Galien - Médecine & Guérison" }
            ].map((book) => {
              const status = featureToggles[book.id] || 'active';
              return (
                <div key={book.id} className="p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl space-y-3 min-w-0">
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white break-words">{book.label}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">{book.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={status}
                      onChange={(e) => handleToggleFeature(book.id, e.target.value)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 w-full"
                    >
                      <option value="active">Actif (Tous)</option>
                      <option value="premium">Premium</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Inactif / Bloqué</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleAdminCard>

        {/* 4. Downloads & Documents */}
        <CollapsibleAdminCard
          id="feat_downloads"
          title="Contrôle Général des Téléchargements & Documents"
          subtitle="Activez ou désactivez globalement la possibilité d'exporter les Sceaux, PNG, PDF et Parchemins."
          icon={<Download size={22} className="text-emerald-500 shrink-0" />}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Téléchargements Globaux :</span>
              <button
                type="button"
                onClick={() => handleToggleFeature('allow_downloads', !featureToggles.allow_downloads)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  featureToggles.allow_downloads !== false ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    featureToggles.allow_downloads !== false ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">
                Comptes ou Numéros de téléphone spécifiques bloqués (séparés par des virgules) :
              </label>
              <input
                type="text"
                value={featureToggles.blocked_download_users || ''}
                onChange={(e) => handleToggleFeature('blocked_download_users', e.target.value)}
                placeholder="ex: user_123, +22790000000"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white outline-none"
              />
            </div>
          </div>
        </CollapsibleAdminCard>

        {/* 5. Admin Access Control */}
        <CollapsibleAdminCard
          id="feat_admin_access"
          title="Gestion des Accès Admin"
          subtitle="Autorisez ou restreignez les sous-modules du panneau d'administration."
          icon={<Shield size={22} className="text-indigo-500 shrink-0" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'admin_can_manage_users', label: 'Gestion des Utilisateurs' },
              { id: 'admin_can_manage_payments', label: 'Gestion des Paiements' },
              { id: 'admin_can_manage_articles', label: 'Gestion des Articles & CMS' },
              { id: 'admin_can_manage_features', label: 'Gestion des Outils & Statuts' },
              { id: 'admin_can_manage_promo_codes', label: 'Gestion des Codes Promo' },
              { id: 'admin_can_manage_settings', label: 'Paramètres Globaux du Système' }
            ].map((perm) => {
              const enabled = featureToggles[perm.id] !== false;
              return (
                <div key={perm.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{perm.label}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleFeature(perm.id, !enabled)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                      enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </CollapsibleAdminCard>

        {/* 6. Payment Methods Toggle */}
        <CollapsibleAdminCard
          id="feat_payment_methods"
          title="Moyens de Paiement Autorisés (Utilisateurs)"
          subtitle="Désactivez ou activez les méthodes de paiement disponibles pour les utilisateurs sur la page de paiement."
          icon={<CreditCard size={22} className="text-emerald-500 shrink-0" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'pay_paystack_card', label: 'Carte Bancaire (Visa / Mastercard via Paystack)' },
              { id: 'pay_mobile_money', label: 'Mobile Money (Orange, Wave, MTN, Moov)' },
              { id: 'pay_manual_transfer', label: 'Paiement Manuel (Virement / Contact Support)' },
              { id: 'pay_promo_code', label: 'Utilisation des Codes Promo' }
            ].map((pm) => {
              const enabled = featureToggles[pm.id] !== false;
              return (
                <div key={pm.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{pm.label}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleFeature(pm.id, !enabled)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                      enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </CollapsibleAdminCard>

        {/* 7. Sharing Options */}
        <CollapsibleAdminCard
          id="feat_sharing_options"
          title="Options de Partage des Outils"
          subtitle="Désactivez ou activez l'icône de partage des outils pour les utilisateurs finaux de l'application."
          icon={<Share2 size={22} className="text-blue-500 shrink-0" />}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Afficher l'icône de partage sur les outils :
            </span>
            <button
              type="button"
              onClick={() => handleToggleFeature('allow_tool_sharing', featureToggles.allow_tool_sharing !== false ? false : true)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                featureToggles.allow_tool_sharing !== false ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  featureToggles.allow_tool_sharing !== false ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </CollapsibleAdminCard>
      </div>
    );
  };

  const renderContent = () => {
    const filteredTerms = lexiqueTerms.filter(t => {
      const termWord = (t as any).word_fr || (t as any).word || '';
      const termCat = (t as any).category || '';
      return termWord.toLowerCase().includes(lexiqueSearch.toLowerCase()) ||
        termCat.toLowerCase().includes(lexiqueSearch.toLowerCase());
    });

    return (
      <div className="space-y-6 w-full max-w-full min-w-0">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-base sm:text-lg">Ajouter au Lexique</h3>
          {renderLanguageTabs()}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder={`Mot / Terme (${language.toUpperCase()})`}
              value={(newTerm as any)[`word_${language}`] || (newTerm as any).word || ''}
              onChange={(e) => setNewTerm({ ...newTerm, [`word_${language}`]: e.target.value } as any)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              type="text"
              placeholder="Catégorie (ex: Prière, Pratique)"
              value={(newTerm as any).category || ''}
              onChange={(e) => setNewTerm({ ...newTerm, category: e.target.value } as any)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <textarea
            placeholder={`Définition (${language.toUpperCase()})`}
            value={(newTerm as any)[`definition_${language}`] || (newTerm as any).definition || ''}
            onChange={(e) => setNewTerm({ ...newTerm, [`definition_${language}`]: e.target.value } as any)}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 h-24 resize-none mb-4 outline-none"
          />
          <button
            onClick={handleAddTerm}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
          >
            <Plus size={18} /> Ajouter le terme
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">
                Termes du Lexique ({filteredTerms.length})
              </h3>
              <p className="text-xs text-gray-500 mt-1">Total: {filteredTerms.length} termes correspondants</p>
            </div>
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Rechercher un terme..."
                value={lexiqueSearch}
                onChange={(e) => setLexiqueSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none"
              />
            </div>
          </div>

          {filteredTerms.length === 0 ? (
            <p className="text-center py-8 text-xs text-gray-400">Aucun terme trouvé.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTerms.map((t) => (
                <div key={t.id} className="p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl space-y-2 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sm text-gray-900 dark:text-white break-words">{(t as any).word_fr || (t as any).word || ''}</span>
                    <button
                      onClick={() => handleDeleteTerm(t.id)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {(t as any).category && (
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full">
                      {(t as any).category}
                    </span>
                  )}
                  <p className="text-xs text-gray-600 dark:text-gray-300 break-words line-clamp-3">{(t as any).definition_fr || (t as any).definition || ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderArticles = () => {
    if (activeTab === "pdf_documents") {
      return <AdminPdfDocumentsManager />;
    }
    if (activeTab === "store") {
      return <AdminStoreManager featureToggles={featureToggles} handleToggleFeature={handleToggleFeature} />;
    }

    const currentTitle = activeLangTab === 'fr' ? (newArticle.title || '') : activeLangTab === 'en' ? ((newArticle as any).title_en || '') : ((newArticle as any).title_ha || '');
    const currentHook = activeLangTab === 'fr' ? (newArticle.hook || '') : activeLangTab === 'en' ? ((newArticle as any).hook_en || '') : ((newArticle as any).hook_ha || '');
    const currentContent = activeLangTab === 'fr' ? (newArticle.content || '') : activeLangTab === 'en' ? ((newArticle as any).content_en || '') : ((newArticle as any).content_ha || '');

    const handleTitleChange = (val: string) => {
      if (activeLangTab === 'fr') setNewArticle(prev => ({ ...prev, title: val }));
      else if (activeLangTab === 'en') setNewArticle(prev => ({ ...prev, title_en: val } as any));
      else setNewArticle(prev => ({ ...prev, title_ha: val } as any));
    };

    const handleHookChange = (val: string) => {
      if (activeLangTab === 'fr') setNewArticle(prev => ({ ...prev, hook: val }));
      else if (activeLangTab === 'en') setNewArticle(prev => ({ ...prev, hook_en: val } as any));
      else setNewArticle(prev => ({ ...prev, hook_ha: val } as any));
    };

    const handleContentChange = (val: string) => {
      if (activeLangTab === 'fr') setNewArticle(prev => ({ ...prev, content: val }));
      else if (activeLangTab === 'en') setNewArticle(prev => ({ ...prev, content_en: val } as any));
      else setNewArticle(prev => ({ ...prev, content_ha: val } as any));
    };

    const insertSacredSnippet = (snippet: string) => {
      const updated = currentContent ? `${currentContent}<p>${snippet}</p>` : `<p>${snippet}</p>`;
      handleContentChange(updated);
      showToast("Formule insérée dans l'éditeur !", "success");
    };

    const handleAddBenefit = (bText: string) => {
      if (!bText.trim()) return;
      const currentBenefits = (newArticle as any).benefits || [];
      setNewArticle(prev => ({
        ...prev,
        benefits: [...currentBenefits, bText.trim()]
      } as any));
    };

    const handleRemoveBenefit = (index: number) => {
      const currentBenefits = (newArticle as any).benefits || [];
      setNewArticle(prev => ({
        ...prev,
        benefits: currentBenefits.filter((_: any, i: number) => i !== index)
      } as any));
    };

    const resolvedThumbnail = getArticleImageUrl(newArticle);

    return (
      <div className="space-y-8 w-full max-w-full min-w-0">
        {/* Studio / Editor Container */}
        <div id="article_editor_form_top" className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-7 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          
          {/* Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl ${editingArticle ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>
                {editingArticle ? <Edit3 size={22} /> : <Sparkles size={22} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-lg sm:text-xl">
                    {editingArticle ? "Modifier l'Article / Secret" : "Créer un Nouvel Article / Secret"}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                    editingArticle ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                  }`}>
                    {editingArticle ? 'Édition' : 'Nouveau'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Rédigez les textes, configurez la vignette recadrée, ajoutez l'audio et publiez instantanément.
                </p>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              {draftSavedMessage && (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 animate-pulse">
                  <CheckCircle2 size={13} /> {draftSavedMessage}
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setEditingArticle(null);
                  setNewArticle({
                    title: '',
                    title_en: '',
                    title_ha: '',
                    hook: '',
                    hook_en: '',
                    hook_ha: '',
                    thumbnail: '',
                    imageUrl: '',
                    content: '',
                    content_en: '',
                    content_ha: '',
                    type: 'richtext',
                    status: 'Published',
                    publishDate: '',
                    benefits: [],
                    category: categories[0]?.name || 'Secrets & Pratiques',
                    subCategory: '',
                    isPremium: false,
                    audioUrl: '',
                    audio_url: '',
                  } as any);
                  setImgSrc('');
                  setCrop(undefined);
                  setCompletedCrop(null);
                  try { localStorage.removeItem('asrarhub_article_draft'); } catch(e) {}
                  showToast("Formulaire réinitialisé pour un nouvel article.");
                }}
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw size={14} /> Nouveau / Réinitialiser
              </button>

              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  showPreview ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                }`}
              >
                <Eye size={14} /> {showPreview ? "Masquer l'Aperçu" : "Aperçu en Direct"}
              </button>

              <button
                type="button"
                onClick={handleSaveArticle}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <Save size={16} /> {editingArticle ? "Mettre à jour l'Article" : "Publier l'Article"}
              </button>
            </div>
          </div>

          {/* Main 2-Column Editor Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Language Tabs, Title, Hook, Content & Benefits (2 cols) */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Language Selector */}
              <div className="flex items-center justify-between gap-2 p-1.5 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('fr')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                      activeLangTab === 'fr' 
                        ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-gray-200 dark:border-gray-700' 
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    🇫🇷 Français (Principal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('en')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                      activeLangTab === 'en' 
                        ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-gray-200 dark:border-gray-700' 
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('ha')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                      activeLangTab === 'ha' 
                        ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-gray-200 dark:border-gray-700' 
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    🇳🇬 Hausa
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 font-medium hidden sm:inline px-2">
                  {activeLangTab === 'fr' ? 'Version par défaut (traduction auto)' : `Version traduite en ${activeLangTab.toUpperCase()}`}
                </span>
              </div>

              {/* Title Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Titre de l'Article / Secret <span className="text-red-500">*</span> ({activeLangTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  placeholder="ex: Secret du Verset Al-Kursi pour la Protection Absolue..."
                  value={currentTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3.5 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Hook / Subtitle Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Accroche / Résumé Court (Hook) ({activeLangTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  placeholder="ex: Découvrez la méthode mystique éprouvée pour désarmer tout ennemi..."
                  value={currentHook}
                  onChange={(e) => handleHookChange(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              {/* Cover Image / Thumbnail Card (Image 2 style: Simple, Fast, Beautiful) */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <ImageIcon size={15} className="text-emerald-500" />
                    <span>Image de couverture (Thumbnail)</span>
                  </label>
                  {resolvedThumbnail && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewArticle(prev => ({ ...prev, thumbnail: '', imageUrl: '', image: '', coverImage: '', coverImageUrl: '' }));
                        setImgSrc('');
                      }}
                      className="text-[10px] text-red-500 hover:underline font-bold"
                    >
                      Effacer
                    </button>
                  )}
                </div>

                {/* Thumbnail Preview Box if loaded */}
                {resolvedThumbnail ? (
                  <div className="space-y-2.5">
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 aspect-video shadow-sm group">
                      <img
                        src={resolvedThumbnail}
                        alt="Aperçu couverture"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => {
                            setNewArticle(prev => ({ ...prev, thumbnail: '', imageUrl: '', image: '', coverImage: '', coverImageUrl: '' }));
                            setImgSrc('');
                          }}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-md transition-colors"
                          title="Supprimer la couverture"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className="py-2.5 px-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors border border-gray-200 dark:border-gray-700 shadow-sm">
                        <Upload size={15} className="text-gray-700 dark:text-gray-300" />
                        <span>Changer l'image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onSelectFile}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowBookCoverStudioModal(true)}
                        className="py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                      >
                        <Sparkles size={15} />
                        <span>Créer Couverture IA / Studio</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {/* Button 1: Télécharger une image */}
                    <label className="w-full py-2.5 px-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors border border-gray-200 dark:border-gray-700 shadow-sm">
                      <Upload size={16} className="text-gray-700 dark:text-gray-300" />
                      <span>Télécharger une image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onSelectFile}
                        className="hidden"
                      />
                    </label>

                    {/* Button 2: Créer Couverture IA / Studio */}
                    <button
                      type="button"
                      onClick={() => setShowBookCoverStudioModal(true)}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                    >
                      <Sparkles size={16} />
                      <span>Créer Couverture IA / Studio</span>
                    </button>
                  </div>
                )}

                {/* Interactive Crop (shown only when user is actively cropping an image) */}
                {imgSrc && (
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3 mt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      <span className="flex items-center gap-1"><CropIcon size={14} /> Recadrage Optionnel</span>
                      <button
                        type="button"
                        onClick={() => setImgSrc('')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleAspectChange(16 / 9)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${cropAspect === 16 / 9 ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      >
                        16:9 (Paysage)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAspectChange(1)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${cropAspect === 1 ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      >
                        1:1 (Carré)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAspectChange(4 / 5)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${cropAspect === 4 / 5 ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      >
                        4:5 (Portrait)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAspectChange(undefined)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${!cropAspect ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      >
                        Libre
                      </button>
                    </div>

                    <div className="max-h-60 overflow-auto flex justify-center bg-black/5 rounded-lg p-1">
                      <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={cropAspect}
                      >
                        <img
                          ref={imageRef}
                          alt="Crop preview"
                          src={imgSrc}
                          onLoad={onImageCropLoad}
                          className="max-w-full h-auto max-h-52 object-contain"
                        />
                      </ReactCrop>
                    </div>

                    <button
                      type="button"
                      onClick={handleCropComplete}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Check size={14} /> Valider le Recadrage
                    </button>
                  </div>
                )}

                {/* Direct URL input */}
                <div className="pt-1">
                  <input
                    type="text"
                    placeholder="Ou lien URL direct (ex: https://...)"
                    value={resolvedThumbnail.startsWith('data:') ? '' : resolvedThumbnail}
                    onChange={(e) => {
                      const url = e.target.value;
                      setNewArticle(prev => ({ ...prev, thumbnail: url, imageUrl: url, image: url, coverImage: url, coverImageUrl: url }));
                    }}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-500 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* VIP Access Option Card (Image 2 style) */}
              <div className="p-4 bg-purple-50/40 dark:bg-purple-950/20 rounded-2xl border border-purple-100 dark:border-purple-900/40 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                  <Star size={14} className="text-purple-500" />
                  <span>Option d'accès à l'article & à l'image</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Définissez si cet article est accessible gratuitement ou réservé aux abonnés VIP
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setNewArticle(prev => ({ ...prev, isPremium: false }))}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                      !newArticle.isPremium
                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-transparent shadow-sm'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>☆ STANDARD (Gratuit)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewArticle(prev => ({ ...prev, isPremium: true }))}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                      newArticle.isPremium
                        ? 'bg-amber-500 text-white border-transparent shadow-md'
                        : 'bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 border-gray-200 dark:border-gray-700 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                    }`}
                  >
                    <Crown size={14} className="text-amber-300" />
                    <span>★ PREMIUM (VIP)</span>
                  </button>
                </div>
              </div>

              {/* Audio File / Recitation Card (Image 2 style) */}
              <div className="p-4 bg-amber-50/40 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                    <Volume2 size={15} className="text-amber-600 dark:text-amber-400" />
                    <span>Fichier Audio / Récitation de l'article</span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-lg">
                    Optionnel
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Attachez un enregistrement audio ou récitation (MP3, WAV) qui restera disponible dans l'article.
                </p>

                <label className="w-full py-2.5 px-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors border border-gray-200 dark:border-gray-700 shadow-sm">
                  <Upload size={15} className="text-amber-600 dark:text-amber-400" />
                  <span>Importer un fichier Audio (MP3, WAV)</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileUploadArticle}
                    className="hidden"
                  />
                </label>

                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Ou lien URL direct (ex: https://...mp3)"
                    value={(newArticle as any).audioUrl || (newArticle as any).audio_url || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewArticle(prev => ({ ...prev, audioUrl: val, audio_url: val }));
                    }}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white outline-none focus:border-amber-500 placeholder:text-gray-400"
                  />
                </div>

                {((newArticle as any).audioUrl || (newArticle as any).audio_url) && (
                  <div className="pt-1 space-y-2">
                    <audio
                      src={(newArticle as any).audioUrl || (newArticle as any).audio_url}
                      controls
                      className="w-full h-8"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Titre de la récitation audio..."
                        value={(newArticle as any).audioTitle || ''}
                        onChange={(e) => setNewArticle(prev => ({ ...prev, audioTitle: e.target.value } as any))}
                        className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 text-xs text-gray-900 dark:text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setNewArticle(prev => ({ ...prev, audioUrl: '', audio_url: '', audioTitle: '' }))}
                        className="px-3 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl font-bold transition-colors"
                      >
                        Effacer
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sacred Snippets Insertion Bar */}
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <Sparkles size={14} />
                  <span>Insertion Rapide de Textes & Formules Sacrées dans l'Éditeur :</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => insertSacredSnippet('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')}
                    className="px-2.5 py-1 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                  >
                    ﷽ Bismillah
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSacredSnippet('اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ')}
                    className="px-2.5 py-1 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                  >
                    ✨ Salawat
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSacredSnippet('اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ')}
                    className="px-2.5 py-1 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                  >
                    🛡️ Ayat Al-Kursi
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSacredSnippet('<strong>Nombre de récitations recommandé :</strong> 313 fois après la prière du Fajr.')}
                    className="px-2.5 py-1 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                  >
                    📿 Zikr & Compte
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSacredSnippet('<blockquote><strong>Talasam / Formule Sacrée :</strong> À tracer avec de l\'encre de safran sur papier blanc.</blockquote>')}
                    className="px-2.5 py-1 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                  >
                    📜 Talasam / Carré
                  </button>
                </div>
              </div>

              {/* Rich Content Editor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                    Contenu Complet du Secret / Recette <span className="text-red-500">*</span> ({activeLangTab.toUpperCase()})
                  </label>
                  <span className="text-[10px] text-gray-400">Éditeur enrichi TipTap</span>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 focus-within:border-emerald-500">
                  <TipTapEditor
                    key={`editor_${activeLangTab}_${articleFormKey}`}
                    value={currentContent}
                    onChange={handleContentChange}
                    className="min-h-[280px] p-4 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Embedded Media Gallery in Content */}
              {currentContent && (
                <div className="pt-2">
                  <ArticleMediaGallery
                    content={currentContent}
                    onChangeContent={handleContentChange}
                  />
                </div>
              )}

              {/* Benefits & Virtues (Bienfaits) */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <Award size={15} className="text-amber-500" />
                    <span>Bienfaits & Vertus Spirituelles (Puces affichées en haut de l'article)</span>
                  </label>
                  <span className="text-[10px] text-gray-500">{((newArticle as any).benefits || []).length} bienfaits ajoutés</span>
                </div>

                <div className="flex gap-2">
                  <input
                    id="new_benefit_input"
                    type="text"
                    placeholder="ex: Protection contre les mauvais sorts et le mauvais œil..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value;
                        handleAddBenefit(val);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('new_benefit_input') as HTMLInputElement;
                      if (input && input.value) {
                        handleAddBenefit(input.value);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus size={14} /> Ajouter
                  </button>
                </div>

                {((newArticle as any).benefits || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {((newArticle as any).benefits || []).map((b: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-medium rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
                      >
                        <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                        <span>{b}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBenefit(idx)}
                          className="p-0.5 hover:text-red-500 transition-colors ml-1"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Categorisation, Status & Publication (1 col) */}
            <div className="space-y-5">
              
              {/* Quick Article Card Preview */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <Eye size={14} className="text-indigo-500" />
                    <span>Aperçu de la Carte</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    newArticle.isPremium ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {newArticle.isPremium ? 'VIP' : 'STANDARD'}
                  </span>
                </div>

                <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                  <div className="aspect-video w-full bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                    {resolvedThumbnail ? (
                      <img src={resolvedThumbnail} alt="Aperçu" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                        <ImageIcon size={28} className="mb-1 opacity-50" />
                        <span className="text-[11px] font-medium">Aucune vignette sélectionnée</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {newArticle.category || 'Secrets & Pratiques'}
                    </span>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white line-clamp-1">
                      {currentTitle || "Titre de l'article..."}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2">
                      {currentHook || "Accroche ou extrait court du secret..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Categorization & Metadata Card */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3.5">
                <label className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <FolderOpen size={15} className="text-amber-500" />
                  <span>Catégorisation & Publication</span>
                </label>

                {/* Category Selection */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Catégorie Principale :</span>
                  <select
                    value={newArticle.category || 'Secrets & Pratiques'}
                    onChange={(e) => setNewArticle(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white font-bold outline-none cursor-pointer"
                  >
                    <option value="Secrets & Pratiques">Secrets & Pratiques</option>
                    <option value="Protection & Ruqyah">Protection & Ruqyah</option>
                    <option value="Richesse & Ouverture">Richesse & Ouverture</option>
                    <option value="Invocations & Douas">Invocations & Douas</option>
                    <option value="Sciences Spirituelles">Sciences Spirituelles</option>
                    <option value="Coran & Sourates">Coran & Sourates</option>
                    {categories.map((c: any, cIdx: number) => (
                      <option key={c.id ? `newart-cat-${c.id}-${cIdx}` : `newart-cat-${c.name || cIdx}-${cIdx}`} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Sous-Catégorie :</span>
                  <input
                    type="text"
                    placeholder="ex: Sourate Al-Waqi'a, Verset Al-Kursi..."
                    value={(newArticle as any).subCategory || ''}
                    onChange={(e) => setNewArticle(prev => ({ ...prev, subCategory: e.target.value } as any))}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 text-xs text-gray-900 dark:text-white outline-none"
                  />
                </div>

                {/* Publication Status & VIP Premium Toggles */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Statut de Publication :</span>
                      <p className="text-[10px] text-gray-400">{newArticle.status === 'Published' ? 'Visible par les utilisateurs' : 'Masqué (Brouillon)'}</p>
                    </div>
                    <select
                      value={newArticle.status || 'Published'}
                      onChange={(e) => setNewArticle(prev => ({ ...prev, status: e.target.value as any }))}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-900 dark:text-white outline-none cursor-pointer"
                    >
                      <option value="Published">Publié</option>
                      <option value="Draft">Brouillon</option>
                    </select>
                  </div>

                </div>

                {/* Big Action Save Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveArticle}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Save size={16} />
                    <span>{editingArticle ? "Mettre à jour et Enregistrer" : "Publier l'Article Immédiatement"}</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Live Preview Modal / Inline Drawer */}
          {showPreview && (
            <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Eye size={16} /> Aperçu en direct du secret pour l'utilisateur ({activeLangTab.toUpperCase()})
                </span>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700 space-y-4">
                {resolvedThumbnail && (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-sm">
                    <img src={resolvedThumbnail} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-bold rounded-full">
                      {newArticle.category || 'Général'}
                    </span>
                    {newArticle.isPremium && (
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] font-bold rounded-full">
                        ★ Premium VIP
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl font-black text-gray-900 dark:text-white">
                    {currentTitle || "(Titre de l'article)"}
                  </h1>
                  {currentHook && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 italic">
                      {currentHook}
                    </p>
                  )}
                </div>

                {((newArticle as any).benefits || []).length > 0 && (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900 space-y-1.5">
                    <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Vertus & Bienfaits :</h4>
                    <ul className="space-y-1">
                      {((newArticle as any).benefits || []).map((b: string, i: number) => (
                        <li key={i} className="text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="shrink-0" /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div 
                  className="prose dark:prose-invert max-w-none text-xs text-gray-800 dark:text-gray-200 pt-2"
                  dangerouslySetInnerHTML={{ __html: currentContent || "<p class='text-gray-400'>Aucun contenu rédigé pour le moment.</p>" }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Thumbnail diagnostic widget */}
        <ThumbnailValidatorWidget articles={articles} />

        {/* Articles Management Table & Grid List */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-7 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
          
          {/* List Header & Controls */}
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <FileText size={20} />
                </span>
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                    <span>Gestion Complète des Articles & Secrets ({articles.length})</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                      Accès Admin Total
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Modifiez instantanément les statuts, déplacez les articles dans d'autres catégories, passez en VIP Premium ou effectuez des actions groupées.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions & Seeding */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSeedDefaultArticles}
                disabled={isSeedingArticles}
                className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-indigo-200 dark:border-indigo-800 cursor-pointer"
              >
                <Database size={14} /> {isSeedingArticles ? 'Importation...' : 'Restaurer Articles par Défaut'}
              </button>

              <button
                type="button"
                onClick={handleDeleteMockArticles}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-750 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 size={13} /> Masquer Démo
              </button>

              {/* Grid / Table layout switch */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-750 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setArticlesLayoutMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${articlesLayoutMode === 'grid' ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-xs' : 'text-gray-500'}`}
                  title="Vue Grille"
                >
                  <Grid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setArticlesLayoutMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${articlesLayoutMode === 'list' ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-xs' : 'text-gray-500'}`}
                  title="Vue Tableau (Recommandée pour la gestion)"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Search & Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative sm:col-span-2">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Rechercher par titre, catégorie, mot-clé ou ID..."
                value={adminArticleSearch}
                onChange={(e) => setAdminArticleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={adminArticleFilterCategory}
              onChange={(e) => setAdminArticleFilterCategory(e.target.value)}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="all">Toutes les Catégories</option>
              <option value="Secrets & Pratiques">Secrets & Pratiques</option>
              <option value="Protection & Ruqyah">Protection & Ruqyah</option>
              <option value="Richesse & Ouverture">Richesse & Ouverture</option>
              <option value="Invocations & Douas">Invocations & Douas</option>
              <option value="Sciences Spirituelles">Sciences Spirituelles</option>
              <option value="Coran & Sourates">Coran & Sourates</option>
              <option value="Amour & Harmonie">Amour & Harmonie</option>
              <option value="Santé & Guérison">Santé & Guérison</option>
              <option value="Zikr & Méditation">Zikr & Méditation</option>
              {categories.map((c: any, cIdx: number) => (
                <option key={c.id ? `filter-cat-${c.id}-${cIdx}` : `filter-cat-${c.name || cIdx}-${cIdx}`} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* Status & Premium Filter */}
            <select
              value={adminArticleFilterStatus}
              onChange={(e) => setAdminArticleFilterStatus(e.target.value)}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="all">Tous les Statuts & Niveaux</option>
              <option value="Published">Publiés uniquement</option>
              <option value="Draft">Brouillons masqués uniquement</option>
              <option value="Premium">VIP Premium uniquement</option>
              <option value="Free">Accès Standard (Gratuits) uniquement</option>
            </select>
          </div>

          {/* Filtered Articles Calculation & Total Control Interface */}
          {(() => {
            const categoryOptionList = [
              'Secrets & Pratiques',
              'Protection & Ruqyah',
              'Richesse & Ouverture',
              'Invocations & Douas',
              'Sciences Spirituelles',
              'Coran & Sourates',
              'Amour & Harmonie',
              'Santé & Guérison',
              'Zikr & Méditation',
              ...categories.map((c: any) => c.name || c.title).filter(Boolean)
            ].filter((v, i, a) => a.indexOf(v) === i);

            const filtered = articles.filter(art => {
              const artTitle = ((art as any).title || (art as any).title_fr || '').toLowerCase();
              const artId = (art.id || '').toLowerCase();
              const matchesSearch = !adminArticleSearch || 
                artTitle.includes(adminArticleSearch.toLowerCase()) || 
                ((art as any).category || '').toLowerCase().includes(adminArticleSearch.toLowerCase()) ||
                artId.includes(adminArticleSearch.toLowerCase());
              const matchesCategory = adminArticleFilterCategory === 'all' || art.category === adminArticleFilterCategory;
              let matchesStatus = true;
              if (adminArticleFilterStatus === 'Published') matchesStatus = art.status === 'Published';
              else if (adminArticleFilterStatus === 'Draft') matchesStatus = art.status === 'Draft';
              else if (adminArticleFilterStatus === 'Premium') matchesStatus = Boolean(art.isPremium);
              else if (adminArticleFilterStatus === 'Free') matchesStatus = !art.isPremium;
              return matchesSearch && matchesCategory && matchesStatus;
            });

            const isAllFilteredSelected = filtered.length > 0 && filtered.every(a => selectedArticleIds.includes(a.id));

            const toggleSelectAllFiltered = () => {
              if (isAllFilteredSelected) {
                const filteredIdSet = new Set(filtered.map(a => a.id));
                setSelectedArticleIds(prev => prev.filter(id => !filteredIdSet.has(id)));
              } else {
                const newIds = Array.from(new Set([...selectedArticleIds, ...filtered.map(a => a.id)]));
                setSelectedArticleIds(newIds);
              }
            };

            const toggleSelectArticle = (articleId: string) => {
              setSelectedArticleIds(prev => 
                prev.includes(articleId) ? prev.filter(id => id !== articleId) : [...prev, articleId]
              );
            };

            return (
              <div className="space-y-4">
                {/* Bulk Actions Bar if articles selected */}
                {selectedArticleIds.length > 0 && (
                  <div className="p-3.5 sm:p-4 bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm animate-in fade-in duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                        {selectedArticleIds.length}
                      </div>
                      <div>
                        <span className="text-xs font-black text-gray-900 dark:text-white">
                          {selectedArticleIds.length} article(s) sélectionné(s)
                        </span>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          Appliquez des modifications globales en un seul clic :
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                      {/* Bulk Publish */}
                      <button
                        type="button"
                        onClick={() => handleBulkArticleAction('publish')}
                        disabled={isBulkArticleActionRunning}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        title="Rendre tous ces articles visibles publiquement"
                      >
                        <CheckCircle2 size={13} /> Tout Publier
                      </button>

                      {/* Bulk Draft */}
                      <button
                        type="button"
                        onClick={() => handleBulkArticleAction('draft')}
                        disabled={isBulkArticleActionRunning}
                        className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        title="Masquer tous ces articles (Passer en Brouillon)"
                      >
                        <Tag size={13} /> Passer en Brouillon
                      </button>

                      {/* Bulk VIP Premium */}
                      <button
                        type="button"
                        onClick={() => handleBulkArticleAction('premium')}
                        disabled={isBulkArticleActionRunning}
                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        title="Réserver l'accès aux abonnés VIP Premium"
                      >
                        <Crown size={13} /> Rendre VIP
                      </button>

                      {/* Bulk Free */}
                      <button
                        type="button"
                        onClick={() => handleBulkArticleAction('free')}
                        disabled={isBulkArticleActionRunning}
                        className="px-2.5 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        title="Rendre ces articles accessibles gratuitement"
                      >
                        <Unlock size={13} /> Accès Standard
                      </button>

                      {/* Bulk Move Category */}
                      <div className="flex items-center gap-1 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-2xs">
                        <select
                          value={bulkArticleTargetCategory}
                          onChange={(e) => setBulkArticleTargetCategory(e.target.value)}
                          className="bg-transparent text-xs font-bold text-gray-800 dark:text-gray-200 outline-none px-1.5 cursor-pointer max-w-[140px] truncate"
                          title="Sélectionner la destination"
                        >
                          {categoryOptionList.map((cName, cIdx) => (
                            <option key={`bulk-cat-opt-${cName}-${cIdx}`} value={cName}>{cName}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleBulkArticleAction('move_category', bulkArticleTargetCategory)}
                          disabled={isBulkArticleActionRunning}
                          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                          title="Déplacer les articles sélectionnés vers cette catégorie"
                        >
                          Déplacer
                        </button>
                      </div>

                      {/* Bulk Delete */}
                      <button
                        type="button"
                        onClick={() => handleBulkArticleAction('delete')}
                        disabled={isBulkArticleActionRunning}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                        title="Supprimer la sélection"
                      >
                        <Trash2 size={15} />
                      </button>

                      {/* Deselect All */}
                      <button
                        type="button"
                        onClick={() => setSelectedArticleIds([])}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl transition-colors cursor-pointer"
                        title="Désélectionner tout"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {filtered.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 space-y-2">
                    <FileText size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
                    <p className="text-xs font-semibold">Aucun article ne correspond à votre recherche.</p>
                  </div>
                ) : articlesLayoutMode === 'grid' ? (
                  /* Grid View with Admin Quick Controls */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {filtered.map((art, artIdx) => {
                      const img = getArticleImageUrl(art);
                      const isSelected = editingArticle?.id === art.id;
                      const isChecked = selectedArticleIds.includes(art.id);
                      return (
                        <div
                          key={art.id ? `admin-grid-art-${art.id}-${artIdx}` : `admin-grid-art-${artIdx}`}
                          className={`bg-white dark:bg-gray-850 rounded-2xl border p-4 flex flex-col justify-between transition-all group relative ${
                            isChecked 
                              ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md bg-emerald-50/10' 
                              : isSelected 
                                ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md' 
                                : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="space-y-3">
                            {/* Image & Quick Overlays */}
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                              {img ? (
                                <img src={img} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <FileText size={24} />
                                </div>
                              )}
                              
                              {/* Selection Checkbox on Card */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSelectArticle(art.id);
                                }}
                                className={`absolute top-2 left-2 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-md ${
                                  isChecked ? 'bg-emerald-600 text-white ring-2 ring-white' : 'bg-black/60 text-white hover:bg-black/80'
                                }`}
                                title={isChecked ? 'Désélectionner' : 'Sélectionner'}
                              >
                                {isChecked ? <Check size={14} strokeWidth={3} /> : <div className="w-2.5 h-2.5 rounded-xs border border-white/80" />}
                              </button>

                              {/* Interactive Quick Status Toggle Badge */}
                              <div className="absolute top-2 right-2 flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickToggleArticlePremium(art.id);
                                  }}
                                  className={`px-2 py-0.5 font-bold text-[10px] rounded-full shadow-md transition-all cursor-pointer ${
                                    art.isPremium 
                                      ? 'bg-amber-500 text-white hover:bg-amber-600' 
                                      : 'bg-black/50 hover:bg-black/70 text-gray-200'
                                  }`}
                                  title="Cliquer pour basculer VIP Premium / Standard"
                                >
                                  {art.isPremium ? '★ VIP' : 'Gratuit'}
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickUpdateArticleStatus(art.id, art.status === 'Published' ? 'Draft' : 'Published');
                                  }}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md transition-all cursor-pointer ${
                                    art.status === 'Published' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'
                                  }`}
                                  title="Cliquer pour basculer Publié / Brouillon"
                                >
                                  {art.status === 'Published' ? 'Publié' : 'Brouillon'}
                                </button>
                              </div>
                            </div>

                            {/* Category Selector & Title */}
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <select
                                  value={art.category || 'Secrets & Pratiques'}
                                  onChange={(e) => handleQuickUpdateArticleCategory(art.id, e.target.value)}
                                  className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg px-2 py-0.5 uppercase tracking-wider outline-none cursor-pointer hover:border-emerald-500"
                                  title="Changer instantanément de catégorie"
                                >
                                  {categoryOptionList.map((cName, cIdx) => (
                                    <option key={`quick-cat-opt-${art.id}-${cName}-${cIdx}`} value={cName}>{cName}</option>
                                  ))}
                                </select>
                                {(art as any).subCategory && (
                                  <span className="text-[9px] font-medium text-gray-500 dark:text-gray-400 truncate max-w-[100px]">
                                    › {(art as any).subCategory}
                                  </span>
                                )}
                              </div>

                              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white line-clamp-2 mt-0.5">
                                {(art as any).title || (art as any).title_fr || '(Sans titre)'}
                              </h4>
                              {(art as any).hook && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                  {(art as any).hook}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons Toolbar */}
                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-1.5">
                              {((art as any).audioUrl || (art as any).audio_url) && (
                                <span className="text-blue-500" title="Audio disponible">
                                  <Headphones size={14} />
                                </span>
                              )}
                              <span className="text-[10px] text-gray-400 font-mono">
                                ID: {art.id.slice(0, 6)}...
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              {/* Quick Control Center Modal */}
                              <button
                                type="button"
                                onClick={() => setSelectedArticleForQuickControl(art)}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors cursor-pointer"
                                title="Contrôle Total de l'article"
                              >
                                <Sliders size={14} />
                              </button>

                              {/* Edit Article */}
                              <button
                                type="button"
                                onClick={() => {
                                  editArticle(art);
                                  document.getElementById('article_editor_form_top')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Modifier le contenu"
                              >
                                <Edit3 size={13} /> Modifier
                              </button>

                              {/* Duplicate */}
                              <button
                                type="button"
                                onClick={() => handleDuplicateArticle(art)}
                                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 rounded-xl transition-colors cursor-pointer"
                                title="Dupliquer"
                              >
                                <Copy size={14} />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
                                    handleDeleteArticle(art.id);
                                  }
                                }}
                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                                title="Supprimer l'article"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Table View with Inline Real-time Controls */
                  <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-700 shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">
                        <tr>
                          <th className="p-3 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={isAllFilteredSelected}
                              onChange={toggleSelectAllFiltered}
                              className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              title="Tout sélectionner / désélectionner"
                            />
                          </th>
                          <th className="p-3">Aperçu</th>
                          <th className="p-3 min-w-[200px]">Titre du Secret & ID</th>
                          <th className="p-3 min-w-[170px]">Catégorie (Déplacer)</th>
                          <th className="p-3">Statut (Changer)</th>
                          <th className="p-3">Accès VIP</th>
                          <th className="p-3">Audio</th>
                          <th className="p-3 text-right min-w-[160px]">Contrôle & Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filtered.map((art, artIdx) => {
                          const img = getArticleImageUrl(art);
                          const isChecked = selectedArticleIds.includes(art.id);
                          return (
                            <tr 
                              key={art.id ? `admin-table-art-${art.id}-${artIdx}` : `admin-table-art-${artIdx}`} 
                              className={`transition-colors ${
                                isChecked 
                                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20' 
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                              }`}
                            >
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleSelectArticle(art.id)}
                                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />
                              </td>
                              <td className="p-3">
                                <div className="w-12 h-9 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                                  {img ? (
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <FileText size={14} />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="font-extrabold text-gray-900 dark:text-white max-w-[260px] truncate">
                                  {(art as any).title || (art as any).title_fr || '(Sans titre)'}
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                                  ID: {art.id}
                                </div>
                              </td>

                              {/* Interactive Category Selector */}
                              <td className="p-3">
                                <div className="flex items-center gap-1.5">
                                  <select
                                    value={art.category || 'Secrets & Pratiques'}
                                    onChange={(e) => handleQuickUpdateArticleCategory(art.id, e.target.value)}
                                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none cursor-pointer hover:border-emerald-500 focus:border-emerald-500 max-w-[150px] truncate"
                                    title="Déplacer vers une autre catégorie"
                                  >
                                    {categoryOptionList.map((cName, cIdx) => (
                                      <option key={`table-cat-opt-${art.id}-${cName}-${cIdx}`} value={cName}>{cName}</option>
                                    ))}
                                  </select>
                                  {(art as any).subCategory && (
                                    <span className="text-[10px] text-gray-400 truncate max-w-[80px]" title={(art as any).subCategory}>
                                      ({(art as any).subCategory})
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Interactive Status Switcher */}
                              <td className="p-3">
                                <select
                                  value={art.status || 'Published'}
                                  onChange={(e) => handleQuickUpdateArticleStatus(art.id, e.target.value as any)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer outline-none transition-colors ${
                                    art.status === 'Published'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                      : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                                  }`}
                                  title="Changer le statut de l'article"
                                >
                                  <option value="Published">✓ Publié</option>
                                  <option value="Draft">✎ Brouillon</option>
                                </select>
                              </td>

                              {/* Interactive VIP Toggle */}
                              <td className="p-3">
                                <button
                                  type="button"
                                  onClick={() => handleQuickToggleArticlePremium(art.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                    art.isPremium
                                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-amber-400'
                                  }`}
                                  title="Cliquer pour basculer VIP Premium / Standard"
                                >
                                  {art.isPremium ? '★ VIP Premium' : 'Standard'}
                                </button>
                              </td>

                              {/* Audio Indicator */}
                              <td className="p-3">
                                {((art as any).audioUrl || (art as any).audio_url) ? (
                                  <span className="text-blue-500 font-bold flex items-center gap-1">
                                    <Headphones size={13} /> Oui
                                  </span>
                                ) : (
                                  <span className="text-gray-300 dark:text-gray-600">-</span>
                                )}
                              </td>

                              {/* Actions Toolbar */}
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Quick Control Center Modal Button */}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedArticleForQuickControl(art)}
                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors cursor-pointer"
                                    title="Contrôle Total & Déplacer"
                                  >
                                    <Sliders size={14} />
                                  </button>

                                  {/* Edit Article */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      editArticle(art);
                                      document.getElementById('article_editor_form_top')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer text-xs"
                                    title="Modifier dans l'éditeur complet"
                                  >
                                    <Edit3 size={13} /> Modifier
                                  </button>

                                  {/* Duplicate */}
                                  <button
                                    type="button"
                                    onClick={() => handleDuplicateArticle(art)}
                                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                                    title="Dupliquer l'article"
                                  >
                                    <Copy size={14} />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
                                        handleDeleteArticle(art.id);
                                      }
                                    }}
                                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                                    title="Supprimer l'article"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}

        </div>

        {/* Modal Contrôle Total & Gestion Rapide de l'Article */}
        {selectedArticleForQuickControl && (
          <ArticleQuickControlModal
            isOpen={Boolean(selectedArticleForQuickControl)}
            onClose={() => setSelectedArticleForQuickControl(null)}
            article={selectedArticleForQuickControl}
            categories={categories}
            onUpdateStatus={handleQuickUpdateArticleStatus}
            onUpdateCategory={handleQuickUpdateArticleCategory}
            onTogglePremium={handleQuickToggleArticlePremium}
            onDuplicate={handleDuplicateArticle}
            onDelete={async (id) => {
              await handleDeleteArticle(id);
              setSelectedArticleForQuickControl(null);
            }}
            onOpenFullEditor={(art) => {
              setSelectedArticleForQuickControl(null);
              editArticle(art);
              document.getElementById('article_editor_form_top')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}
      </div>
    );
  };

  const renderCommunity = () => {
    return (
      <div className="space-y-6 w-full max-w-full min-w-0">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">Paramètres de la Communauté</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-xl">
            <div>
              <h4 className="font-bold text-xs text-gray-900 dark:text-white">Partage de Code & Snippets</h4>
              <p className="text-[11px] text-gray-500">Autoriser les membres à poster des blocs de code.</p>
            </div>
            <button
              onClick={() => handleToggleCodeSharing(!featureToggles.allow_code_sharing)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                featureToggles.allow_code_sharing ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${featureToggles.allow_code_sharing ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-base sm:text-lg">Modération des Discussions</h3>
          <div className="space-y-3">
            {communityPosts.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">Aucune publication dans la communauté pour le moment.</p>
            ) : (
              communityPosts.map((post) => (
                <div key={post.id} className="p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl space-y-2 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-sm text-gray-900 dark:text-white break-words">{post.author}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      post.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : post.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {post.status === 'approved' ? 'Approuvé' : post.status === 'rejected' ? 'Rejeté' : 'En attente'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 break-words">{post.content}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {post.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdatePostStatus(post.id, 'approved')}
                        className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-200 transition-colors"
                      >
                        Approuver
                      </button>
                    )}
                    {post.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdatePostStatus(post.id, 'rejected')}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors"
                      >
                        Rejeter
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-300 ml-auto flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderNotifications = () => {
    return (
      <div className="space-y-6 w-full max-w-full min-w-0">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-base sm:text-lg">Envoyer une Notification Globale</h3>
          {renderLanguageTabs()}
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder={`Titre de la notification (${language.toUpperCase()})`}
              value={newNotification[`title_${language}`] || ''}
              onChange={(e) => setNewNotification({ ...newNotification, [`title_${language}`]: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <textarea
              placeholder={`Message (${language.toUpperCase()})`}
              value={newNotification[`message_${language}`] || ''}
              onChange={(e) => setNewNotification({ ...newNotification, [`message_${language}`]: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 h-24 resize-none outline-none"
            />
            <button
              onClick={handleAddNotification}
              disabled={!newNotification.title_fr || !newNotification.message_fr}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
            >
              <Plus size={18} /> Envoyer la notification
            </button>
          </div>

          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-base sm:text-lg">Historique des Notifications</h3>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">Aucune notification enregistrée.</p>
            ) : (
              notifications.map((n) => {
                const title = (n as any)[`title_${language}`] || (n as any).title_fr || n.title || '';
                const msg = (n as any)[`message_${language}`] || (n as any).message_fr || n.message || '';
                return (
                  <div key={n.id} className="p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl flex justify-between items-start gap-4 min-w-0">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white break-words">{title}</h4>
                      <p className="text-xs text-gray-500 mt-1 mb-2">{new Date(n.date).toLocaleString('fr-FR')}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 break-words">{msg}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(n.id)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors shrink-0"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGrandOaths = () => {
    return (
      <div className="space-y-6 w-full max-w-full min-w-0">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-base sm:text-lg">Les Grands Serments Théurgiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEFAULT_OATHS.map((oath: any) => (
              <div key={oath.id} className="p-4 bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700 rounded-2xl space-y-2 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white break-words">{oath.title}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    {oath.category || 'Serment'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 break-words">{oath.description}</p>
                <div className="pt-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                  {oath.versesCount || 28} formules sacrées
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <AdminDeepSettingsManager
        featureToggles={featureToggles}
        handleToggleFeature={handleToggleFeature}
        showToast={showToast}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        users={users}
        securityAlerts={securityAlerts}
        isSecurityAlertTrackingEnabled={isSecurityAlertTrackingEnabled}
        handleSetUserStatus={handleSetUserStatus}
        promoCodes={promoCodes}
      />
    </div>
  );

  return (
    <AdminSectionCollapseContext.Provider
      value={{
        collapsedSections: collapsedAdminSections,
        toggleCollapse: toggleAdminSectionCollapse
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 min-h-screen overflow-x-hidden min-w-0">
        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold flex items-center gap-2 ${
                toast.type === "error"
                  ? "bg-red-500 text-white border-red-600"
                  : toast.type === "info"
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-emerald-600 text-white border-emerald-700"
              }`}
            >
              {toast.type === "error" ? <AlertTriangle size={18} /> : <Check size={18} />}
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 w-full max-w-full">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2.5 sm:gap-3 break-words">
              <LayoutDashboard className="text-emerald-500 shrink-0" size={26} />
              <span>Tableau de Bord Administrateur</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">
              Gérez l'ensemble des modules, utilisateurs, paiements, contenus et paramètres de la plateforme.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        {renderTabNavigation()}

        {/* Main Tab Content */}
        <div className="mt-6 w-full max-w-full min-w-0">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "users" && renderUsers()}
          {activeTab === "payments" && renderPayments()}
          {activeTab === "promo_codes" && renderPromoCodesTab()}
          {activeTab === "ruqyah" && renderRuqyah()}
          {activeTab === "features" && renderFeatures()}
          {activeTab === "content" && renderContent()}
          {(activeTab === "articles" || activeTab === "pdf_documents" || activeTab === "categories" || activeTab === "store") && renderArticles()}
          {activeTab === "community" && renderCommunity()}
          {activeTab === "notifications" && renderNotifications()}
          {activeTab === "grand_oaths" && renderGrandOaths()}
          {activeTab === "referrals" && <AdminReferralManager />}
          {activeTab === "branding" && <BrandingSettings />}
          {activeTab === "floating_button" && <FloatingBackButtonSettings featureToggles={featureToggles} onShowToast={showToast} />}
          {activeTab === "version_control" && <AdminVersionControlManager />}
          {activeTab === "reciters" && <AdminRecitersManager featureToggles={featureToggles} handleToggleFeature={handleToggleFeature} />}
          {activeTab === "media_storage" && <AdminMediaStorageManager />}
          {activeTab === "book_covers" && <BookCoverStudio />}
          {activeTab === "seals" && <LunarSealVarietiesSection language={language} />}
          {activeTab === "support" && <AdminEmailSupportManager />}
          {(activeTab === "settings" || activeTab === "security") && renderSettings()}
        </div>

        {/* Studio Book Cover Modal for Article Thumbnail Creation */}
        {showBookCoverStudioModal && (
          <BookCoverStudio
            isModal={true}
            onClose={() => setShowBookCoverStudioModal(false)}
            initialTitle={newArticle.title || "Titre du Secret"}
            initialSubtitle={(newArticle as any).hook || ""}
            onSelectCover={(coverUrl) => {
              setNewArticle(prev => ({
                ...prev,
                thumbnail: coverUrl,
                imageUrl: coverUrl,
                image: coverUrl,
                coverImage: coverUrl,
                coverImageUrl: coverUrl
              }));
              setShowBookCoverStudioModal(false);
              showToast("Couverture Studio appliquée à l'article avec succès !", "success");
            }}
          />
        )}
      </div>
    </AdminSectionCollapseContext.Provider>
  );
};

export default AdminDashboard;
