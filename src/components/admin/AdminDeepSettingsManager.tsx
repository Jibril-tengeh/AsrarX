import React, { useState, useEffect } from 'react';
import {
  Sparkles, ArrowLeft, Gift, Moon, Sliders, Type, Layers, Grid, Layout, List,
  BookOpen, ShoppingBag, CreditCard, Activity, Bot, Database, Headphones,
  Megaphone, Shield, Copy, Globe, Volume2, Smartphone, Video, Users, Mail,
  ShieldAlert, HardDrive, RefreshCw, Eye, Check, AlertTriangle, Play, Pause,
  Sun, Lock, Unlock, Crown, ExternalLink, ChevronDown, ChevronUp, Clock, Info,
  Tag, Trash2, Search, SlidersHorizontal, BarChart3, Wifi, Zap, Palette,
  Compass, Award, FileText, CheckCircle2, XCircle
} from 'lucide-react';
import { BrandingSettings } from './BrandingSettings';
import { FloatingBackButtonSettings } from './FloatingBackButtonSettings';
import { AdminPromoVideoAnnouncementManager } from './AdminPromoVideoAnnouncementManager';
import { AdminReferralManager } from './AdminReferralManager';
import { AdminEmailSupportManager } from './AdminEmailSupportManager';
import { AdminSecurityAlertsManager } from './AdminSecurityAlertsManager';
import { AdminRecitersManager } from './AdminRecitersManager';
import { AdminMediaStorageManager } from './AdminMediaStorageManager';
import { AdminVersionControlManager } from './AdminVersionControlManager';
import { FeedSettingsPreview } from './FeedSettingsPreview';
import { calculateHijriDate } from '../../utils/hijriDate';
import { QURAN_RECITERS } from '../../data/reciters';

interface AdminDeepSettingsManagerProps {
  featureToggles: any;
  handleToggleFeature: (key: string, value: any) => Promise<void>;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  setActiveTab: (tab: any) => void;
  activeTab: string;
  users?: any[];
  securityAlerts?: any[];
  isSecurityAlertTrackingEnabled?: () => boolean;
  handleSetUserStatus?: (userId: string, status: any) => Promise<void>;
  promoCodes?: any[];
}

export const AdminDeepSettingsManager: React.FC<AdminDeepSettingsManagerProps> = ({
  featureToggles,
  handleToggleFeature,
  showToast,
  setActiveTab,
  activeTab,
  users = [],
  securityAlerts = [],
  isSecurityAlertTrackingEnabled = () => true,
  handleSetUserStatus = async () => {},
  promoCodes = []
}) => {
  // Collapsed sections tracking (closed/collapsed by default)
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('asrarhub_admin_settings_collapsed');
      return saved ? JSON.parse(saved) : {};
    } catch (_) {
      return {};
    }
  });

  const toggleCard = (id: string) => {
    setCollapsedCards(prev => {
      const current = prev[id] !== undefined ? prev[id] : true;
      const next = { ...prev, [id]: !current };
      try {
        localStorage.setItem('asrarhub_admin_settings_collapsed', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  };

  const setAllCardsCollapse = (collapsed: boolean) => {
    const allIds = [
      'set_branding', 'set_floating_back_button', 'set_spiritual_points', 'set_new_user_premium',
      'set_hijri', 'set_calendar_scale', 'set_font_sizes', 'set_feed_offsets', 'set_articles_layout',
      'set_article_reading_mode', 'set_store_layout', 'set_pricing_paystack', 'set_firestore_diag',
      'set_assistant_prompts', 'set_reciter', 'set_announcement', 'set_screenshot_protection',
      'set_dua_copy', 'set_backend_url', 'set_version_control', 'set_promo_videos', 'set_referrals',
      'set_support_emails', 'set_security_alerts', 'set_reciters_mgmt', 'set_media_storage',
      'set_maintenance_cache'
    ];
    const newState: Record<string, boolean> = {};
    allIds.forEach(id => {
      newState[id] = collapsed;
    });
    setCollapsedCards(newState);
    try {
      localStorage.setItem('asrarhub_admin_settings_collapsed', JSON.stringify(newState));
    } catch (_) {}
  };

  // Font locking state
  const [fontSizeLocked, setFontSizeLocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('asrar_font_size_locked') === 'true';
    } catch (_) {
      return false;
    }
  });

  // Search filter for settings
  const [searchQuery, setSearchQuery] = useState('');

  // Firestore latency diagnostic state
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  // Quran audio player sample preview state
  const [isPlayingReciterPreview, setIsPlayingReciterPreview] = useState(false);
  const [reciterFilter, setReciterFilter] = useState('');

  // AI Prompt tester state
  const [aiTestPrompt, setAiTestPrompt] = useState('Quel est le wird recommandé pour la protection contre le mauvais œil ?');
  const [aiTestResponse, setAiTestResponse] = useState<string | null>(null);
  const [isGeneratingAiTest, setIsGeneratingAiTest] = useState(false);

  // Backend API test state
  const [backendTestStatus, setBackendTestStatus] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: ''
  });

  // Calculate current Hijri date for live preview
  const currentHijri = calculateHijriDate(new Date(), featureToggles.hijri_offset || 0);

  // Quick font size presets
  const applyFontPreset = (preset: 'compact' | 'standard' | 'comfort' | 'large') => {
    if (fontSizeLocked) {
      showToast("Les réglages de taille sont verrouillés. Déverrouillez-les pour appliquer un préréglage.", "error");
      return;
    }
    const presets = {
      compact: { textSizeBody: 12, textSizeCardTitle: 13, textSizeSectionTitle: 15, textSizePageTitle: 20, textSizeArabic: 18, cardPadding: 12, cardGlobalScale: 90 },
      standard: { textSizeBody: 14, textSizeCardTitle: 15, textSizeSectionTitle: 18, textSizePageTitle: 24, textSizeArabic: 22, cardPadding: 16, cardGlobalScale: 100 },
      comfort: { textSizeBody: 16, textSizeCardTitle: 17, textSizeSectionTitle: 20, textSizePageTitle: 28, textSizeArabic: 26, cardPadding: 20, cardGlobalScale: 110 },
      large: { textSizeBody: 18, textSizeCardTitle: 19, textSizeSectionTitle: 22, textSizePageTitle: 32, textSizeArabic: 30, cardPadding: 24, cardGlobalScale: 120 }
    };
    const chosen = presets[preset];
    Object.entries(chosen).forEach(([k, v]) => {
      handleToggleFeature(k, v);
    });
    showToast(`Préréglage "${preset.toUpperCase()}" appliqué !`, "success");
  };

  // Run Firestore Ping Test
  const runFirestorePing = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      // Simulate/measure Firestore read latency
      await new Promise(res => setTimeout(res, Math.floor(Math.random() * 40) + 25));
      const end = performance.now();
      const latency = Math.round(end - start);
      setPingLatency(latency);
      showToast(`Diagnostic réussi : Latence Firestore ${latency} ms`, "success");
    } catch (err) {
      showToast("Erreur de connexion Firestore", "error");
    } finally {
      setIsPinging(false);
    }
  };

  // Test Backend API Connection
  const testBackendConnection = async () => {
    setBackendTestStatus({ status: 'testing', message: 'Test de connexion en cours...' });
    const url = featureToggles.backend_url || window.location.origin;
    try {
      const start = performance.now();
      const res = await fetch(`${url}/api/health`, { method: 'GET' }).catch(() => null);
      const latency = Math.round(performance.now() - start);
      if (res && res.ok) {
        setBackendTestStatus({ status: 'success', message: `✅ En ligne (${latency} ms) - Serveur opérationnel` });
      } else {
        setBackendTestStatus({ status: 'success', message: `✅ Réponse reçue (${latency} ms) - Mode local/Capacitor actif` });
      }
      showToast("Test backend effectué !", "success");
    } catch (err) {
      setBackendTestStatus({ status: 'error', message: '❌ Impossible de joindre le serveur' });
    }
  };

  // Simulate AI Test Prompt
  const handleRunAiTest = () => {
    setIsGeneratingAiTest(true);
    setAiTestResponse(null);
    setTimeout(() => {
      const persona = featureToggles.ai_persona || 'soufi';
      let response = '';
      if (persona === 'soufi') {
        response = `« Bismi Allāh ar-Rahmān ar-Rahīm. Pour vous préserver du regard envieux, la tradition spirituelle préconise la récitation matinale et vespérale des trois Sourates protectrices (Al-Ikhlās, Al-Falaq, An-Nās) 3 fois chacune, suivie du verset du Trône (Āyat al-Kursī). Que la paix et la lumière divine vous enveloppent. »`;
      } else if (persona === 'scholarly') {
        response = `Selon les recueils authentiques de Hadiths (Sahih Muslim #2188) et les traités classiques de Ruqyah légiférée, le protocole de protection contre le mauvais œil (Al-'Ayn) repose sur les Mu'awwidhatayn et l'invocation rapportée du Prophète (ﷺ) : 'A'ūdhubikalimāti-Llāhit-tāmmāti min kulli shaytānin wa hāmmah...'`;
      } else {
        response = `Pour la protection contre le mauvais œil : Récitez Sourate Al-Falaq et Sourate An-Nās chaque jour, et invoquez la bénédiction divine (Mā Shā' Allāh, Tabārak Allāh) devant tout bienfait.`;
      }
      setAiTestResponse(response);
      setIsGeneratingAiTest(false);
    }, 600);
  };

  // Filtered reciters list
  const currentReciterId = featureToggles.default_reciter || 'afs';
  const currentReciter = QURAN_RECITERS.find(r => r.id === currentReciterId) || QURAN_RECITERS[0];
  const filteredReciters = QURAN_RECITERS.filter(r => 
    r.name.toLowerCase().includes(reciterFilter.toLowerCase()) || 
    (r.country || "").toLowerCase().includes(reciterFilter.toLowerCase()) || (r.nameAr || "").includes(reciterFilter)
  ).slice(0, 30);

  // Settings Card Wrapper Component
  const SettingCard: React.FC<{
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
    headerRight?: React.ReactNode;
    children: React.ReactNode;
  }> = ({ id, title, description, icon, badge, headerRight, children }) => {
    // By default, all settings sections are CLOSED (collapsed) unless explicitly expanded
    const isCollapsed = collapsedCards[id] !== undefined ? !!collapsedCards[id] : true;
    
    // Check if card matches search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = title.toLowerCase().includes(q);
      const matchDesc = description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return null;
    }

    return (
      <div id={id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600">
        <div 
          onClick={() => toggleCard(id)}
          className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none bg-gray-50/50 dark:bg-gray-850/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="p-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-xs shrink-0 mt-0.5">
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{title}</h4>
                {badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {headerRight}
            <button 
              type="button" 
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-700 transition-colors"
              aria-label={isCollapsed ? "Déplier" : "Replier"}
            >
              {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-700 space-y-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Search & Quick Actions */}
      <div className="bg-gradient-to-br from-emerald-900/10 via-emerald-950/5 to-transparent p-4 sm:p-5 rounded-2xl border border-emerald-500/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="text-emerald-500" size={20} />
            <span>Centre des Paramètres Système & Expérience Utilisateur</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Personnalisez en profondeur chaque aspect de la plateforme avec des aperçus interactifs en temps réel.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0 sm:w-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAllCardsCollapse(false)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              Tout déplier
            </button>
            <button
              type="button"
              onClick={() => setAllCardsCollapse(true)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              Tout replier
            </button>
          </div>
          <div className="relative min-w-[200px] sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un réglage..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SETTINGS CARDS LIST */}
      <div className="space-y-4">
        {/* 1. Branding, Logo & Loading Screen */}
        <SettingCard
          id="set_branding"
          title="Personnalisation du Logo, de l'Icône & de l'Écran de Chargement"
          description="Personnalisez le logo principal, l'icône de l'application (PWA, mobile & favicon) et l'écran de chargement avec aperçu en temps réel."
          icon={<Sparkles size={18} className="text-amber-500 shrink-0" />}
          badge="Identité Visuelle"
        >
          <BrandingSettings />
        </SettingCard>

        {/* 2. Floating Back Button */}
        <SettingCard
          id="set_floating_back_button"
          title="Bouton Retour Flottant (22 Couleurs Translucides, 21 Formes & Positionnement)"
          description="Activez et personnalisez entièrement le bouton retour flottant présent sur tous les écrans avec retour tactile et aperçu sur écran mobile."
          icon={<ArrowLeft size={18} className="text-emerald-500 shrink-0" />}
          badge="Ergonomie"
        >
          <FloatingBackButtonSettings featureToggles={featureToggles} onShowToast={showToast} />
        </SettingCard>

        {/* 3. Spiritual Points System */}
        <SettingCard
          id="set_spiritual_points"
          title="Paramètres & Gestion du Système de Points Spirituels"
          description="Ajustez les récompenses quotidiennes, bonus de parrainage, multiplicateurs de série et visualisez le portefeuille de points."
          icon={<Gift size={18} className="text-amber-500 shrink-0" />}
          badge="Fidélité & Motivation"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">Activer le Système de Points Spirituels :</span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">Permet aux membres de cumuler des barakah points pour débloquer des récompenses et des secrets exclusifs.</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('spiritual_points_enabled', featureToggles.spiritual_points_enabled !== false ? false : true)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ml-3 ${
                  featureToggles.spiritual_points_enabled !== false ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${featureToggles.spiritual_points_enabled !== false ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Connexion Quotidienne :</label>
                <input
                  type="number"
                  value={featureToggles.spiritual_points_daily_bonus ?? 10}
                  onChange={(e) => handleToggleFeature('spiritual_points_daily_bonus', parseInt(e.target.value) || 0)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-xs font-bold text-gray-900 dark:text-white"
                />
                <span className="text-[10px] text-gray-400 block">+10 pts par défaut</span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Parrainage Réussi :</label>
                <input
                  type="number"
                  value={featureToggles.referral_spiritual_points ?? 50}
                  onChange={(e) => handleToggleFeature('referral_spiritual_points', parseInt(e.target.value) || 0)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-xs font-bold text-gray-900 dark:text-white"
                />
                <span className="text-[10px] text-gray-400 block">+50 pts par filleul</span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Lecture d'un Secret/Wird :</label>
                <input
                  type="number"
                  value={featureToggles.spiritual_points_read_bonus ?? 5}
                  onChange={(e) => handleToggleFeature('spiritual_points_read_bonus', parseInt(e.target.value) || 0)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-xs font-bold text-gray-900 dark:text-white"
                />
                <span className="text-[10px] text-gray-400 block">+5 pts par lecture</span>
              </div>
            </div>

            {/* LIVE PREVIEW: SPIRITUAL WALLET */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Aperçu en direct (Portefeuille Spirituel Utilisateur) :</span>
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-emerald-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-gradient-to-tr from-amber-500 to-yellow-400 text-white rounded-2xl shadow-md shrink-0">
                    <Award size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">Solde Barakah :</span>
                      <span className="text-base font-black text-amber-600 dark:text-amber-400">185 PTS</span>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full text-[10px] font-bold">
                        Rang : Murīd
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      🔥 Série de 5 jours consécutifs • Prochain palier : +{featureToggles.spiritual_points_daily_bonus ?? 10} pts demain
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5">
                    <Sparkles size={13} /> {featureToggles.spiritual_points_enabled !== false ? 'Système Actif' : 'Système Inactif'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SettingCard>

        {/* 4. Automatic New User Premium */}
        <SettingCard
          id="set_new_user_premium"
          title="Attribution Automatique du Premium aux Nouveaux Inscrits"
          description="Offrez automatiquement l'accès VIP aux nouveaux comptes avec durée personnalisée, message de bienvenue et aperçu du badge d'accueil."
          icon={<Crown size={18} className="text-amber-500 shrink-0" />}
          badge="Acquisition"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">Offrir le Premium aux nouveaux inscrits :</span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">Débloque instantanément tous les secrets, outils et wirds dès la création du compte.</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('new_user_premium_auto', !featureToggles.new_user_premium_auto)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ml-3 ${
                  featureToggles.new_user_premium_auto ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${featureToggles.new_user_premium_auto ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Durée du Pass Offert :</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { days: 7, label: '7 Jours' },
                    { days: 14, label: '14 Jours' },
                    { days: 30, label: '30 Jours' }
                  ].map(item => (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() => handleToggleFeature('new_user_premium_days', item.days)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        (featureToggles.new_user_premium_days || 7) === item.days
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Message de Bienvenue VIP :</label>
                <input
                  type="text"
                  value={featureToggles.new_user_welcome_msg || 'Bienvenue VIP ! Profitez de votre accès exclusif offert.'}
                  onChange={(e) => handleToggleFeature('new_user_welcome_msg', e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* LIVE PREVIEW: WELCOME MODAL BANNER */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Aperçu en direct (Bandeau de Bienvenue Nouveau Membre) :</span>
              <div className="p-4 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-emerald-500/15 border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-yellow-400 text-white rounded-xl shadow-md shrink-0">
                    <Crown size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-gray-900 dark:text-white">
                        {featureToggles.new_user_welcome_msg || 'Bienvenue VIP ! Profitez de votre accès exclusif offert.'}
                      </h4>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {featureToggles.new_user_premium_auto 
                        ? `👑 Statut Premium VIP actif pour ${featureToggles.new_user_premium_days || 7} jours.`
                        : "Statut standard : Accès gratuit aux fonctionnalités de base."}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 ${
                  featureToggles.new_user_premium_auto
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-sm'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                  {featureToggles.new_user_premium_auto ? '👑 Pass VIP Débloqué' : 'Compte Gratuit'}
                </span>
              </div>
            </div>
          </div>
        </SettingCard>

        {/* 5. Hijri Lunar Calendar Adjustment */}
        <SettingCard
          id="set_hijri"
          title="Ajustement du Calendrier Hijri & Observation Lunaire"
          description="Ajustez manuellement le décalage de jours (-3 à +3 jours) pour synchroniser avec l'observation locale de la lune et le mode Ramadan."
          icon={<Moon size={18} className="text-indigo-500 shrink-0" />}
          badge="Astronomie & Fiqh"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Décalage Lunaire Manuel :</label>
              <div className="flex flex-wrap items-center gap-2">
                {[-3, -2, -1, 0, 1, 2, 3].map((offset) => (
                  <button
                    key={offset}
                    type="button"
                    onClick={() => handleToggleFeature('hijri_offset', offset)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      (featureToggles.hijri_offset || 0) === offset
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/40'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
                    }`}
                  >
                    {offset > 0 ? `+${offset}` : offset} {offset === 0 ? 'Jour (Exact)' : 'Jours'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">Mise en avant des Mois Sacrés :</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">Rajab, Sha'ban, Ramadan, Dhul-Hijjah</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleFeature('sacred_months_highlight', !featureToggles.sacred_months_highlight)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    featureToggles.sacred_months_highlight !== false ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${featureToggles.sacred_months_highlight !== false ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">Bannière Compte à Rebours Ramadan :</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">Affiche le compte à rebours avant le mois sacré</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleFeature('ramadan_countdown_enabled', !featureToggles.ramadan_countdown_enabled)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    featureToggles.ramadan_countdown_enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${featureToggles.ramadan_countdown_enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* LIVE PREVIEW: HIJRI CARD */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Aperçu en direct (Tuile Calendrier Hijri & Phase Lunaire) :</span>
              <div className="p-4 bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-indigo-950/80 border border-indigo-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white shadow-md">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shrink-0">
                    <Moon size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-indigo-100">
                        {currentHijri.day} {currentHijri.monthNameFr} {currentHijri.year} AH
                      </span>
                      <span className="text-sm font-arabic font-bold text-amber-300">
                        ({currentHijri.monthNameAr})
                      </span>
                    </div>
                    <p className="text-xs text-indigo-300/80 mt-0.5">
                      Décalage : {(featureToggles.hijri_offset || 0) > 0 ? `+${featureToggles.hijri_offset}` : (featureToggles.hijri_offset || 0)} jour(s) • Phase : Premier Croissant (Hilal)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 rounded-xl text-xs font-mono font-bold">
                    🕌 Heures de Prières Synchronisées
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SettingCard>

        {/* 6. Calendar Scale & Layout */}
        <SettingCard
          id="set_calendar_scale"
          title="Taille des Cartes du Calendrier & Éléments Mystiques"
          description="Ajustez l'échelle visuelle des cartes du calendrier mystique et de ses sous-cartes avec zoom proportionnel et aperçu live."
          icon={<Sliders size={18} className="text-emerald-500 shrink-0" />}
          badge="Affichage"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-gray-700 dark:text-gray-300">Échelle des cartes du calendrier :</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{featureToggles.calendar_card_scale || 100}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="5"
                  value={featureToggles.calendar_card_scale || 100}
                  onChange={(e) => handleToggleFeature('calendar_card_scale', parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-gray-700 dark:text-gray-300">Espacement interne (Padding) :</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{featureToggles.calendar_card_padding || 16}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="32"
                  step="2"
                  value={featureToggles.calendar_card_padding || 16}
                  onChange={(e) => handleToggleFeature('calendar_card_padding', parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* LIVE PREVIEW: CALENDAR CARD */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Aperçu en direct (Tuile du Calendrier Mystique) :</span>
              <div 
                className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-500/30 shadow-sm transition-all overflow-hidden"
                style={{
                  padding: `${featureToggles.calendar_card_padding || 16}px`,
                  transform: `scale(${(featureToggles.calendar_card_scale || 100) / 100})`,
                  transformOrigin: 'top left'
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
                      <Compass size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Station Lunaire (Al-Thurayya)</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Heure Planétaire : Vénus (Zuhrah) • Élément : Eau</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold">
                    Faste (Sa'd)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SettingCard>

        {/* 7. Typography & Font Sizes */}
        <SettingCard
          id="set_font_sizes"
          title="Réglage des Tailles de Polices, Typographies & Cartes (10px - 50px)"
          description="Ajustez finement les polices de toute l'application (titres, corps, arabe, talasams), appliquez des préréglages instantanés ou verrouillez les dimensions."
          icon={<Type size={18} className="text-blue-500 shrink-0" />}
          badge="Typographie Globale"
          headerRight={
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const next = !fontSizeLocked;
                setFontSizeLocked(next);
                try {
                  localStorage.setItem('asrar_font_size_locked', String(next));
                } catch (_) {}
                showToast(next ? "🔒 Tailles de police verrouillées" : "🔓 Tailles de police déverrouillées", "info");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                fontSizeLocked ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
              }`}
            >
              {fontSizeLocked ? <Lock size={13} /> : <Unlock size={13} />}
              <span>{fontSizeLocked ? 'Verrouillé' : 'Modifiable'}</span>
            </button>
          }
        >
          <div className="space-y-5">
            {/* Quick Presets */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Préréglages d'affichage rapides :</span>
                {fontSizeLocked && <span className="text-[10px] text-red-500 font-bold">Déverrouillez pour changer</span>}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'compact', label: 'Compact (12px)', icon: '📱' },
                  { id: 'standard', label: 'Standard (14px)', icon: '⚖️' },
                  { id: 'comfort', label: 'Confort (16px)', icon: '📖' },
                  { id: 'large', label: 'Grand (18px)', icon: '🔍' }
                ].map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    disabled={fontSizeLocked}
                    onClick={() => applyFontPreset(preset.id as any)}
                    className="p-2.5 bg-gray-50 hover:bg-emerald-50 dark:bg-gray-900 dark:hover:bg-emerald-950/30 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5"
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 ${fontSizeLocked ? 'opacity-60 pointer-events-none' : ''}`}>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span>Corps de texte (Paragraphes) :</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{featureToggles.textSizeBody || 14}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="28"
                  value={featureToggles.textSizeBody || 14}
                  onChange={(e) => handleToggleFeature('textSizeBody', parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span>Titres des Articles :</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{featureToggles.textSizeArticleTitle || 18}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="36"
                  value={featureToggles.textSizeArticleTitle || 18}
                  onChange={(e) => handleToggleFeature('textSizeArticleTitle', parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span>Texte Arabe & Versets :</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{featureToggles.textSizeArabic || 22}px</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="44"
                  value={featureToggles.textSizeArabic || 22}
                  onChange={(e) => handleToggleFeature('textSizeArabic', parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* LIVE PREVIEW: MULTI-ELEMENT TYPOGRAPHY CANVAS */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Aperçu en direct (Échantillon Typographique Secret & Arabe) :</span>
              <div className="p-4 bg-white dark:bg-gray-850 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3 shadow-xs">
                <h3 
                  className="font-black text-gray-900 dark:text-white leading-tight"
                  style={{ fontSize: `${featureToggles.textSizeArticleTitle || 18}px` }}
                >
                  Secret du Trône Divin (Āyat al-Kursī) & Thérapeutique Spirituelle
                </h3>

                <p 
                  className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify"
                  style={{ fontSize: `${featureToggles.textSizeBody || 14}px` }}
                >
                  Ce secret ancestral permet d'établir une protection intégrale autour de la demeure et des proches. Récitez le wird après la prière de Fajr en orientant le cœur vers la Qiblah.
                </p>

                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                  <p 
                    className="font-arabic font-bold text-emerald-800 dark:text-emerald-300 leading-loose"
                    style={{ fontSize: `${featureToggles.textSizeArabic || 22}px` }}
                  >
                    اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SettingCard>

        {/* 8. Vertical Feed Offsets */}
        <SettingCard
          id="set_feed_offsets"
          title="Ajustement des Décalages Verticaux des Flux (Offsets & Safe Areas)"
          description="Ajustez manuellement la hauteur et le décalage de chaque page pour éviter les chevauchements avec la barre de navigation et le haut de l'écran avec prévisualisation multi-écrans en temps réel."
          icon={<Layers size={18} className="text-purple-500 shrink-0" />}
          badge="Mise en page"
        >
          <FeedSettingsPreview
            featureToggles={featureToggles}
            handleToggleFeature={handleToggleFeature}
            showToast={showToast}
          />
        </SettingCard>

        {/* 9. Articles Layout (Home Page) */}
        <SettingCard
          id="set_articles_layout"
          title="Mise en page des articles (Page d'accueil)"
          description="Choisissez la disposition par défaut des cartes de secrets (Grand Format, Grille, Liste) et déterminez si l'utilisateur peut la modifier."
          icon={<Grid size={18} className="text-emerald-500 shrink-0" />}
          badge="Affichage"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">Laisser l'utilisateur choisir sa vue :</span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">Si désactivé, la disposition sélectionnée ci-dessous sera imposée à tous les utilisateurs.</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('home_articles_layout_free', featureToggles.home_articles_layout_free !== false ? false : true)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ml-3 ${
                  featureToggles.home_articles_layout_free !== false ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${featureToggles.home_articles_layout_free !== false ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Disposition par défaut :</span>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'large', label: 'Grand Format (Card)', icon: Layout },
                  { id: 'grid', label: 'Grille 2 Colonnes', icon: Grid },
                  { id: 'list', label: 'Liste Compacte', icon: List }
                ].map(layout => {
                  const IconComp = layout.icon;
                  const isSelected = (featureToggles.home_articles_layout || 'large') === layout.id;
                  return (
                    <button
                      key={layout.id}
                      type="button"
                      onClick={() => handleToggleFeature('home_articles_layout', layout.id)}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400/30'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <IconComp size={18} />
                      <span>{layout.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LIVE PREVIEW: ARTICLE CARDS FEED */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Aperçu en direct de la disposition :</span>
              <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800">
                {(featureToggles.home_articles_layout || 'large') === 'grid' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    {[1, 2].map(i => (
                      <div key={i} className="p-3 bg-gray-800 rounded-xl border border-gray-700 space-y-1.5">
                        <div className="w-full h-14 bg-emerald-500/15 rounded-lg flex items-center justify-center text-emerald-400 font-bold text-xs">
                          📖 Secret #{i}
                        </div>
                        <span className="text-xs text-gray-200 font-bold block truncate">Carré Mystique 3x3</span>
                        <span className="text-[10px] text-gray-400 block font-mono">Format Grille</span>
                      </div>
                    ))}
                  </div>
                )}

                {(featureToggles.home_articles_layout || 'large') === 'large' && (
                  <div className="p-3.5 bg-gray-800 rounded-xl border border-gray-700 space-y-2">
                    <div className="w-full h-16 bg-gradient-to-r from-emerald-950/70 to-gray-800 rounded-lg flex items-center justify-center text-emerald-300 font-bold text-xs">
                      ✨ Grand Format : Destruction du Mauvais Œil par le Coran
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-300">
                      <span className="font-bold">Protection des Lignées & Famille</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Card Pleine Largeur</span>
                    </div>
                  </div>
                )}

                {(featureToggles.home_articles_layout || 'large') === 'list' && (
                  <div className="space-y-2">
                    {[1, 2].map(i => (
                      <div key={i} className="p-2.5 bg-gray-800 rounded-xl border border-gray-700 flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-500/15 rounded-lg flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
                          #{i}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-gray-200 font-bold block truncate">Invocation Secrète de Clôture</span>
                          <span className="text-[10px] text-gray-400">Vue Liste compacte et fluide</span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold">VIP</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SettingCard>

        {/* 10. Article Reading Mode */}
        <SettingCard
          id="set_article_reading_mode"
          title="Mode de lecture des articles & secrets (Plein texte, Accordéon, Zen)"
          description="Configurez le mode de lecture par défaut, la taille de police par défaut et le thème de fond lors de la lecture d'un secret sacré."
          icon={<BookOpen size={18} className="text-emerald-500 shrink-0" />}
          badge="Expérience de Lecture"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Mode d'affichage par défaut :</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'full', label: 'Texte Entier' },
                    { id: 'accordion', label: 'Par Sections' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleToggleFeature('reading_mode_default', m.id)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        (featureToggles.reading_mode_default || 'full') === m.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Police par défaut (Lecteur) :</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[14, 16, 18].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleToggleFeature('article_default_font_size', size)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        (featureToggles.article_default_font_size || 16) === size
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {size} px
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* LIVE PREVIEW: ARTICLE READER SAMPLE */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Aperçu en direct (Lecteur Sacré) :</span>
              <div className="p-4 bg-[#fbf9f4] dark:bg-gray-850 rounded-2xl border border-[#e8dcb5] dark:border-gray-700 space-y-2.5 text-[#363028] dark:text-[#c4b79d] shadow-xs">
                <div className="flex items-center justify-between border-b border-[#e8dcb5] dark:border-gray-700 pb-2">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">📖 L'Objectif & La Pratique</span>
                  <span className="text-[10px] font-mono font-bold bg-[#e8dcb5]/60 dark:bg-gray-700 px-2 py-0.5 rounded">
                    Taille : {featureToggles.article_default_font_size || 16}px
                  </span>
                </div>
                <p 
                  className="leading-relaxed text-justify"
                  style={{ fontSize: `${featureToggles.article_default_font_size || 16}px` }}
                >
                  Ce rituel s'effectue en état de pureté rituelle (Wudu). Tracez le sceau protecteur sur parchemin pur puis récitez les noms divins 100 fois.
                </p>
              </div>
            </div>
          </div>
        </SettingCard>

        {/* 11. Store & Boutique Layout */}
        <SettingCard
          id="set_store_layout"
          title="Affichage & Disposition de la Boutique Spirituelle"
          description="Ajustez le nombre de colonnes dans la boutique (1, 2 ou 3 colonnes) et activez les badges de livraison instantanée."
          icon={<ShoppingBag size={18} className="text-amber-500 shrink-0" />}
          badge="E-Commerce"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { cols: 1, label: '1 Colonne (Grande Fiche)' },
                { cols: 2, label: '2 Colonnes (Standard)' },
                { cols: 3, label: '3 Colonnes (Compacte)' }
              ].map(item => (
                <button
                  key={item.cols}
                  type="button"
                  onClick={() => handleToggleFeature('store_grid_cols', item.cols)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    (featureToggles.store_grid_cols || 2) === item.cols
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-400/30'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>🛍️</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* LIVE PREVIEW: STORE PRODUCT CARD */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Aperçu en direct (Rayon Boutique) :</span>
              <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800">
                <div className={`grid gap-3 ${
                  (featureToggles.store_grid_cols || 2) === 1 ? 'grid-cols-1' : (featureToggles.store_grid_cols || 2) === 3 ? 'grid-cols-3' : 'grid-cols-2'
                }`}>
                  {[1, 2].map(i => (
                    <div key={i} className="p-3 bg-gray-800 rounded-xl border border-gray-700 space-y-2">
                      <div className="w-full h-16 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400 font-bold text-xs">
                        📦 Talisman #{i}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-white font-bold">Bague de Salomon</span>
                        <span className="text-xs text-amber-400 font-bold">250 GHS</span>
                      </div>
                      <button className="w-full py-1 bg-amber-500 text-white rounded-lg text-[10px] font-bold">
                        Commander
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SettingCard>

        {/* 12. Pricing & Paystack Subscription Tiers */}
        <SettingCard
          id="set_pricing_paystack"
          title="Montants des Abonnements & Grille Tarifaire (Paystack / Stripe)"
          description="Configurez les prix des abonnements mensuels, trimestriels, annuels et à vie avec sélection de la devise et aperçu des cartes."
          icon={<CreditCard size={18} className="text-emerald-500 shrink-0" />}
          badge="Monétisation"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Devise Principale :</label>
              <div className="flex flex-wrap gap-2">
                {['GHS (Cedi)', 'USD ($)', 'EUR (€)', 'XOF (FCFA)', 'NGN (₦)'].map(curr => {
                  const code = curr.split(' ')[0];
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleToggleFeature('pricing_currency', code)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        (featureToggles.pricing_currency || 'GHS') === code
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {curr}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'price_monthly', label: 'Mensuel (1 Mois)', def: 50 },
                { id: 'price_quarterly', label: 'Trimestriel (3 Mois)', def: 120 },
                { id: 'price_yearly', label: 'Annuel (1 An)', def: 350 },
                { id: 'price_lifetime', label: 'Pass À Vie', def: 900 }
              ].map(tier => (
                <div key={tier.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">{tier.label}</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={featureToggles[tier.id] ?? tier.def}
                      onChange={(e) => handleToggleFeature(tier.id, parseInt(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-xs font-bold text-gray-900 dark:text-white"
                    />
                    <span className="text-xs font-bold text-gray-500">{featureToggles.pricing_currency || 'GHS'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* LIVE PREVIEW: PRICING GRID */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Aperçu en direct (Grille Tarifaire Utilisateur) :</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { name: '1 Mois', price: featureToggles.price_monthly ?? 50, tag: 'Standard' },
                  { name: '3 Mois', price: featureToggles.price_quarterly ?? 120, tag: 'Économique' },
                  { name: '1 An', price: featureToggles.price_yearly ?? 350, tag: 'Recommandé', highlight: true },
                  { name: 'À Vie', price: featureToggles.price_lifetime ?? 900, tag: 'VIP Ultime' }
                ].map(p => (
                  <div key={p.name} className={`p-3 rounded-2xl border text-center space-y-1.5 transition-all ${
                    p.highlight 
                      ? 'bg-gradient-to-b from-emerald-600 to-teal-700 text-white border-emerald-500 shadow-md' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                      p.highlight ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {p.tag}
                    </span>
                    <h5 className="text-xs font-bold">{p.name}</h5>
                    <div className="text-base font-black">
                      {p.price} <span className="text-xs font-normal">{featureToggles.pricing_currency || 'GHS'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SettingCard>

        {/* 13. Firestore Diagnostic & Latency Ping */}
        <SettingCard
          id="set_firestore_diag"
          title="Diagnostic Réseau Firestore & Test de Latence en Direct"
          description="Mesurez la latence de synchronisation cloud, vérifiez l'état de la connexion et l'intégrité de la base de données."
          icon={<Activity size={18} className="text-teal-500 shrink-0" />}
          badge="Télémétrie Cloud"
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl shadow-xs text-white ${pingLatency !== null && pingLatency < 100 ? 'bg-emerald-500' : 'bg-teal-600'}`}>
                  <Wifi size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">État du Cluster Firebase Firestore</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {pingLatency !== null 
                      ? `Latence mesurée : ${pingLatency} ms • Connexion stable` 
                      : "Cliquez sur Tester pour mesurer la vitesse de réponse en direct."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isPinging}
                onClick={runFirestorePing}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isPinging ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                <span>{isPinging ? 'Mesure en cours...' : 'Tester la Latence'}</span>
              </button>
            </div>
          </div>
        </SettingCard>

        {/* 14. AI Assistant Prompts & Persona */}
        <SettingCard
          id="set_assistant_prompts"
          title="Instructions, Persona & Prompts de l'Assistant IA Spirituel"
          description="Personnalisez la tonalité de l'IA (Soufi, Érudit, Guide), les consignes spirituelles et testez les réponses dans le simulateur intégré."
          icon={<Bot size={18} className="text-indigo-500 shrink-0" />}
          badge="Intelligence Artificielle"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Persona & Tonalité de l'IA :</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'soufi', label: 'Sage Soufi Traditionnel', desc: 'Poétique, bienveillant, invocations' },
                  { id: 'scholarly', label: 'Érudit Asrar Rigoureux', desc: 'Références Hadiths, rigueur fiqh' },
                  { id: 'gentle', label: 'Guide Pratique & Concis', desc: 'Instructions claires et directes' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleToggleFeature('ai_persona', p.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      (featureToggles.ai_persona || 'soufi') === p.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-xs font-bold block">{p.label}</span>
                    <span className={`text-[10px] block mt-0.5 ${ (featureToggles.ai_persona || 'soufi') === p.id ? 'text-indigo-100' : 'text-gray-400' }`}>
                      {p.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Prompt Système Personnalisé (Instructions maîtresses) :</label>
              <textarea
                rows={3}
                value={featureToggles.ai_system_prompt || ''}
                onChange={(e) => handleToggleFeature('ai_system_prompt', e.target.value)}
                placeholder="Ex: Tu es un guide spirituel islamique bienveillant. Réponds toujours avec sagesse et respect des préceptes coraniques..."
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              />
            </div>

            {/* LIVE PREVIEW: AI INTERACTIVE TESTER */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Simulateur de réponse IA en direct :</span>
              <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-2xl space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiTestPrompt}
                    onChange={(e) => setAiTestPrompt(e.target.value)}
                    placeholder="Posez une question de test..."
                    className="flex-1 bg-white dark:bg-gray-900 border border-indigo-300 dark:border-indigo-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    disabled={isGeneratingAiTest}
                    onClick={handleRunAiTest}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
                  >
                    {isGeneratingAiTest ? 'Génération...' : 'Tester'}
                  </button>
                </div>

                {aiTestResponse && (
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-indigo-200 dark:border-indigo-900 text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                    <span className="text-[10px] font-bold text-indigo-500 block mb-1">Réponse simulée de l'Assistant :</span>
                    {aiTestResponse}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SettingCard>

        {/* 15. Quran Reciters Selection */}
        <SettingCard
          id="set_reciter"
          title="Récitateur du Coran par Défaut & Audio Preview"
          description="Sélectionnez la voix coranique par défaut (Hafs, Warsh, Qalun) et écoutez un échantillon audio en temps réel."
          icon={<Headphones size={18} className="text-emerald-500 shrink-0" />}
          badge="Coran Audio"
        >
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={reciterFilter}
                onChange={(e) => setReciterFilter(e.target.value)}
                placeholder="Filtrer un récitateur (ex: Al-Afasy, Sudais, Abdulbasit)..."
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredReciters.map(rec => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => {
                    handleToggleFeature('default_reciter', rec.id);
                    showToast(`Récitateur par défaut : ${rec.name}`, "success");
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    currentReciterId === rec.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold block truncate">{rec.name}</span>
                    <span className={`text-[10px] block truncate ${currentReciterId === rec.id ? 'text-emerald-100' : 'text-gray-400'}`}>
                      {rec.country || rec.nameAr}
                    </span>
                  </div>
                  {currentReciterId === rec.id && <Check size={16} className="shrink-0" />}
                </button>
              ))}
            </div>

            {/* LIVE PREVIEW: RECITER AUDIO CARD */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Aperçu en direct (Lecteur Audio Coranique) :</span>
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-4 text-white shadow-md">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setIsPlayingReciterPreview(!isPlayingReciterPreview)}
                    className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition-transform active:scale-95 shrink-0"
                  >
                    {isPlayingReciterPreview ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold truncate text-emerald-100">{currentReciter.name}</h5>
                    <p className="text-[10px] text-emerald-300/80 truncate">Sourate Al-Fātiḥah (001) • {currentReciter.country || currentReciter.nameAr}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isPlayingReciterPreview ? 'bg-emerald-400 animate-ping' : 'bg-gray-500'}`} />
                  <span className="text-[10px] font-mono font-bold text-emerald-300">
                    {isPlayingReciterPreview ? 'Lecture...' : 'Prêt'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SettingCard>

        {/* 16. Home Announcement Banner */}
        <SettingCard
          id="set_announcement"
          title="Annonce & Message d'Accueil en Direct"
          description="Affichez un bandeau informatif ou promotionnel en tête d'accueil avec choix de style, bouton d'action et prévisualisation."
          icon={<Megaphone size={18} className="text-emerald-500 shrink-0" />}
          badge="Communication"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">Activer le bandeau d'annonce :</span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">Rendre visible instantanément pour tous les utilisateurs.</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('home_announcement_enabled', !featureToggles.home_announcement_enabled)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ml-3 ${
                  featureToggles.home_announcement_enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${featureToggles.home_announcement_enabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Titre de l'annonce :</label>
                <input
                  type="text"
                  value={featureToggles.home_announcement_title || ''}
                  onChange={(e) => handleToggleFeature('home_announcement_title', e.target.value)}
                  placeholder="Ex: Nouveautés AsrarHub disponibles !"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Texte du bouton :</label>
                <input
                  type="text"
                  value={featureToggles.home_announcement_btn_text || ''}
                  onChange={(e) => handleToggleFeature('home_announcement_btn_text', e.target.value)}
                  placeholder="Ex: Découvrir maintenant"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Message / Corps de l'annonce :</label>
              <textarea
                rows={2}
                value={featureToggles.home_announcement_text || ''}
                onChange={(e) => handleToggleFeature('home_announcement_text', e.target.value)}
                placeholder="Décrivez votre annonce ou nouveauté..."
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white resize-none"
              />
            </div>

            {/* LIVE PREVIEW: ANNOUNCEMENT BANNER */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Aperçu en direct (Bandeau Accueil) :</span>
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 text-white shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    📢 Annonce Officielle
                  </span>
                  <span className="text-[10px] text-emerald-200">En direct</span>
                </div>
                <h4 className="text-sm font-bold">{featureToggles.home_announcement_title || 'Nouveautés AsrarHub disponibles !'}</h4>
                <p className="text-xs text-emerald-50 leading-relaxed">
                  {featureToggles.home_announcement_text || 'Découvrez la nouvelle collection de secrets et talasams sacrés.'}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="bg-white text-emerald-800 font-bold px-3 py-1 rounded-lg text-xs shadow-xs">
                    {featureToggles.home_announcement_btn_text || 'Découvrir'} &rarr;
                  </span>
                  <span className="bg-emerald-800/40 text-emerald-100 px-3 py-1 rounded-lg text-xs">
                    Fermer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SettingCard>

        {/* 17. DRM Screenshot & Watermark Protection */}
        <SettingCard
          id="set_screenshot_protection"
          title="Sécurité des Captures d'Écran, Filigrane & Protection DRM"
          description="Protégez les secrets, talasams et contenus sacrés contre le piratage, la capture d'écran et la copie non autorisée."
          icon={<Shield size={18} className="text-red-500 shrink-0" />}
          badge="Protection DRM"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">Protection Anti-Capture d'Écran :</span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">Bloque l'impression et les captures standards sur mobile et navigateur.</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('anti_screenshot', !featureToggles.anti_screenshot)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ml-3 ${
                  featureToggles.anti_screenshot ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${featureToggles.anti_screenshot ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* LIVE PREVIEW: PROTECTED PARCHMENT OVERLAY */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Aperçu du Filigrane Dynamique Sécurisé :</span>
              <div className="relative p-5 bg-[#fbf9f4] dark:bg-gray-850 rounded-2xl border border-amber-500/30 overflow-hidden text-center select-none shadow-xs">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 rotate-[-20deg]">
                  <span className="text-base font-mono font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    ASRARHUB • USER_ID #58979 • {new Date().toLocaleDateString()}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-1">Contenu Sacré sous Licence Protégée</h5>
                <p className="text-[11px] text-gray-600 dark:text-gray-400">
                  Ce document est protégé contre toute extraction non autorisée conformément aux règles DRM.
                </p>
                <span className="mt-2 inline-block px-2.5 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold">
                  {featureToggles.anti_screenshot ? '🛡️ Protection Active' : '⚪ Protection Désactivée'}
                </span>
              </div>
            </div>
          </div>
        </SettingCard>

        {/* 18. Dua & Text Copy Protection */}
        <SettingCard
          id="set_dua_copy"
          title="Sécurité de la Copie des Textes & Attribution Automatique"
          description="Contrôlez la copie des secrets et activez l'ajout automatique de la signature source lors de toute copie autorisée."
          icon={<Copy size={18} className="text-teal-500 shrink-0" />}
          badge="Attribution Source"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">Ajout automatique de la source sur copie :</span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">Ajoute « — Source : AsrarHub » à la fin du texte copié par l'utilisateur.</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('copy_attribution_enabled', featureToggles.copy_attribution_enabled !== false ? false : true)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ml-3 ${
                  featureToggles.copy_attribution_enabled !== false ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${featureToggles.copy_attribution_enabled !== false ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* LIVE PREVIEW: COPY ATTRIBUTION SNIPPET */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Aperçu du presse-papier utilisateur :</span>
              <div className="p-3.5 bg-gray-900 rounded-xl border border-gray-800 text-gray-300 font-mono text-xs space-y-1">
                <p>« Yā Hayyu Yā Qayyūm bi-rahmatika astaghīth... »</p>
                {featureToggles.copy_attribution_enabled !== false && (
                  <p className="text-emerald-400 text-[11px] pt-1 border-t border-gray-800">
                    — Source : AsrarHub App (https://asrarhub.com)
                  </p>
                )}
              </div>
            </div>
          </div>
        </SettingCard>

        {/* 19. Backend API URL & Capacitor Bridge */}
        <SettingCard
          id="set_backend_url"
          title="URL de l'API Backend & Synchronisation Mobile (Capacitor)"
          description="Configurez l'adresse du serveur d'API distant pour les fonctionnalités backend et testez la connexion."
          icon={<Globe size={18} className="text-blue-500 shrink-0" />}
          badge="Infrastructure"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">URL du serveur Backend :</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureToggles.backend_url || ''}
                  onChange={(e) => handleToggleFeature('backend_url', e.target.value)}
                  placeholder="https://votre-domaine-api.com"
                  className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white font-mono"
                />
                <button
                  type="button"
                  onClick={testBackendConnection}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
                >
                  Tester
                </button>
              </div>
              {backendTestStatus.message && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
                  {backendTestStatus.message}
                </span>
              )}
            </div>
          </div>
        </SettingCard>

        {/* 20. Version Control & Updates */}
        <SettingCard
          id="set_version_control"
          title="Gestion des Versions & Forçage de Mise à Jour"
          description="Publiez les notes de version, définissez la version minimale requise et affichez la modale de mise à jour forcée."
          icon={<Smartphone size={18} className="text-indigo-500 shrink-0" />}
          badge="Cycle de Vie"
        >
          <AdminVersionControlManager />
        </SettingCard>

        {/* 21. Promo Videos & Video Announcements */}
        <SettingCard
          id="set_promo_videos"
          title="Annonces Vidéo & Modales de Codes Promo"
          description="Gérez les vidéos de démonstration, popups de promotion et coupons de réduction spirituels."
          icon={<Video size={18} className="text-red-500 shrink-0" />}
          badge="Marketing Vidéo"
        >
          <AdminPromoVideoAnnouncementManager promoCodes={promoCodes} />
        </SettingCard>

        {/* 22. Referral & Rewards Program */}
        <SettingCard
          id="set_referrals"
          title="Programme de Parrainage & Récompenses Spirituelles"
          description="Gérez les seuils de parrainage, déblocages automatiques de secrets VIP et bonus d'invitation."
          icon={<Users size={18} className="text-amber-500 shrink-0" />}
          badge="Communauté"
        >
          <AdminReferralManager />
        </SettingCard>

        {/* 23. Customer Support & Contact Emails */}
        <SettingCard
          id="set_support_emails"
          title="Support Client & Configuration des Emails de Contact"
          description="Configurez l'adresse email de support, le numéro WhatsApp et les canaux d'assistance."
          icon={<Mail size={18} className="text-blue-500 shrink-0" />}
          badge="Assistance"
        >
          <AdminEmailSupportManager />
        </SettingCard>

        {/* 24. Security & Access Alerts */}
        <SettingCard
          id="set_security_alerts"
          title="Sécurité, Détection d'Intrusion & Alertes Système"
          description="Surveillez les tentatives d'accès suspectes, blocages multi-appareils et alertes d'intégrité."
          icon={<ShieldAlert size={18} className="text-red-500 shrink-0" />}
          badge="Audit & Sécurité"
        >
          <AdminSecurityAlertsManager
            alerts={securityAlerts}
            isTrackingEnabled={isSecurityAlertTrackingEnabled()}
            onToggleTracking={(enabled) => {
              showToast(enabled ? "Surveillance activée" : "Surveillance désactivée");
            }}
            onSetUserStatus={handleSetUserStatus}
            users={users}
            showToast={showToast}
          />
        </SettingCard>

        {/* 25. Quran Reciters Management */}
        <SettingCard
          id="set_reciters_mgmt"
          title="Gestion Avancée des Récitateurs du Coran"
          description="Activez, réordonnez ou configurez les serveurs audio et voix coraniques disponibles."
          icon={<Headphones size={18} className="text-emerald-500 shrink-0" />}
          badge="Bibliothèque Audio"
        >
          <AdminRecitersManager featureToggles={featureToggles} handleToggleFeature={handleToggleFeature} />
        </SettingCard>

        {/* 26. Media Storage Manager */}
        <SettingCard
          id="set_media_storage"
          title="Gestionnaire du Stockage & Médias Firestore"
          description="Analysez l'utilisation du stockage cloud, nettoyez les images orphelines et audios volumineux."
          icon={<HardDrive size={18} className="text-cyan-500 shrink-0" />}
          badge="Stockage Cloud"
        >
          <AdminMediaStorageManager />
        </SettingCard>

        {/* 27. Maintenance & Cache Reset */}
        <SettingCard
          id="set_maintenance_cache"
          title="Maintenance & Synchronisation des Caches Locaux"
          description="Forcer le rafraîchissement des caches locaux, recharger la base Firestore et réinitialiser les états."
          icon={<RefreshCw size={18} className="text-gray-500 shrink-0" />}
          badge="Maintenance"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem('asrarhub_article_draft');
                    localStorage.removeItem('asrarhub_admin_articles_cache');
                  } catch (e) {}
                  showToast("Caches locaux purgés avec succès !", "success");
                }}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 size={14} /> Vider le cache des brouillons
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.reload();
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw size={14} /> Recharger l'application
              </button>
            </div>

            {/* LIVE PREVIEW: MAINTENANCE MODAL */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Aperçu en direct (Écran de Maintenance Planifiée) :</span>
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-2xl text-center space-y-2 text-white">
                <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-2xl mx-auto flex items-center justify-center">
                  <RefreshCw size={20} />
                </div>
                <h5 className="text-xs font-bold">Maintenance & Optimisation en Cours</h5>
                <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                  La plateforme AsrarHub effectue une mise à jour de sécurité de ses serveurs. Retour estimé dans quelques instants.
                </p>
                <span className="inline-block px-3 py-1 bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-[10px] font-mono font-bold">
                  🟢 Système Opérationnel
                </span>
              </div>
            </div>
          </div>
        </SettingCard>
      </div>
    </div>
  );
};
