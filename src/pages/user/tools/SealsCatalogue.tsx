import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Shield, Moon, Sparkles, Download, Lock, Eye, Sliders, RefreshCw, 
  Copy, Check, Search, ArrowLeft, Maximize2, FileCode, Share2, 
  CheckCircle2, ShieldAlert, Zap, Layers, Sparkle, Grid, List
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { 
  LUNAR_SEAL_VARIETIES, 
  getLocalizedLunarSealVarieties, 
  getSealAdminConfig, 
  saveSealAdminConfig, 
  isGlobalSealMaintenance, 
  setGlobalSealMaintenance, 
  subscribeSealAdminConfigFromFirestore,
  SEAL_VERSIONS_LIST,
  getSealVersionSymbol,
  getSealVersionDetails,
  SealStatus, 
  SealTargetUser 
} from '../../../data/lunarSealVarieties';
import { generateAndDownloadSealCard, generateAndDownloadSealSVG } from '../../../utils/sealCanvasExporter';
import { KhatimVisualizer } from '../../../components/KhatimVisualizer';

export const SealsCatalogue: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isPremium = user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'pro' || (user as any)?.isPremium || isAdmin;

  const [seals, setSeals] = useState(() => getLocalizedLunarSealVarieties(language));
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>('all');
  const [selectedSealId, setSelectedSealId] = useState<string>('seal_wafq_9x9');
  const [selectedVersion, setSelectedVersion] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [copiedSymbol, setCopiedSymbol] = useState(false);
  const [isDownloadingPNG, setIsDownloadingPNG] = useState(false);
  const [isDownloadingSVG, setIsDownloadingSVG] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showAdminControl, setShowAdminControl] = useState(false);

  const [adminConfig, setAdminConfig] = useState(() => getSealAdminConfig());
  const [globalMaintenance, setGlobalMaintenance] = useState(() => isGlobalSealMaintenance());

  // Listen to Firestore seal_config real-time updates
  useEffect(() => {
    const handleLocalUpdate = () => {
      setAdminConfig(getSealAdminConfig());
      setGlobalMaintenance(isGlobalSealMaintenance());
      setSeals(getLocalizedLunarSealVarieties(language));
    };

    window.addEventListener('asrarhub:seals_config_updated', handleLocalUpdate);
    const unsubscribeFirestore = subscribeSealAdminConfigFromFirestore((config, globalMaint) => {
      setAdminConfig(config);
      setGlobalMaintenance(globalMaint);
      setSeals(getLocalizedLunarSealVarieties(language));
    });

    return () => {
      window.removeEventListener('asrarhub:seals_config_updated', handleLocalUpdate);
      unsubscribeFirestore();
    };
  }, [language]);

  const activeSeal = seals.find((s) => s.id === selectedSealId) || seals[0];
  const activeVersionDetails = activeSeal ? getSealVersionDetails(activeSeal, selectedVersion, language) : null;

  // Filtering
  const filteredSeals = seals.filter((seal) => {
    const matchesGroup = selectedGroup === 'all' || seal.groupId === selectedGroup;
    const matchesSearch = 
      searchQuery.trim() === '' ||
      seal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seal.arabicName.includes(searchQuery) ||
      seal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seal.spiritualUtility.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesGroup && matchesSearch;
  });

  const handleStatusChange = (sealId: string, newStatus: SealStatus) => {
    const updated = {
      ...adminConfig,
      [sealId]: {
        ...adminConfig[sealId],
        status: newStatus
      }
    };
    setAdminConfig(updated);
    saveSealAdminConfig(updated);
  };

  const handleTargetUserChange = (sealId: string, newTarget: SealTargetUser) => {
    const updated = {
      ...adminConfig,
      [sealId]: {
        ...adminConfig[sealId],
        targetUser: newTarget
      }
    };
    setAdminConfig(updated);
    saveSealAdminConfig(updated);
  };

  const handleToggleGlobalMaintenance = () => {
    const nextState = !globalMaintenance;
    setGlobalMaintenance(nextState);
    setGlobalSealMaintenance(nextState);
  };

  const handleResetAdminConfig = () => {
    const defaultConfig: any = {};
    LUNAR_SEAL_VARIETIES.forEach((s) => {
      defaultConfig[s.id] = { status: s.defaultStatus, targetUser: s.defaultTargetUser };
    });
    setAdminConfig(defaultConfig);
    saveSealAdminConfig(defaultConfig);
    setGlobalSealMaintenance(false);
  };

  const checkProtection = () => {
    if (!activeSeal) return false;
    if (activeSeal.status === 'maintenance') return false;
    if (activeSeal.status === 'premium' && !isPremium && !isAdmin) {
      triggerProtectionModal('download');
      return true;
    }
    return false;
  };

  const handleDownloadPNG = async () => {
    if (!activeSeal || !activeVersionDetails) return;
    if (checkProtection()) return;
    if (activeSeal.status === 'maintenance') return;

    setIsDownloadingPNG(true);

    try {
      await generateAndDownloadSealCard({
        title: activeSeal.title,
        subtitle: activeSeal.subtitle,
        arabicName: activeSeal.arabicName,
        formula: activeSeal.formula,
        abjadValue: activeSeal.abjadValue,
        graphicSymbol: activeVersionDetails.symbol,
        groupTitle: activeSeal.groupTitle,
        lang: language,
        versionTitle: `${activeVersionDetails.title} • Puissance: ${activeVersionDetails.powerLevel}%`,
        version: selectedVersion
      });
    } catch (e) {
      console.error('Download PNG error:', e);
    } finally {
      setIsDownloadingPNG(false);
    }
  };

  const handleDownloadSVG = () => {
    if (!activeSeal || !activeVersionDetails) return;
    if (checkProtection()) return;
    if (activeSeal.status === 'maintenance') return;

    setIsDownloadingSVG(true);

    try {
      generateAndDownloadSealSVG({
        title: activeSeal.title,
        subtitle: activeSeal.subtitle,
        arabicName: activeSeal.arabicName,
        formula: activeSeal.formula,
        abjadValue: activeSeal.abjadValue,
        graphicSymbol: activeVersionDetails.symbol,
        groupTitle: activeSeal.groupTitle,
        lang: language,
        versionTitle: `${activeVersionDetails.title} • Puissance: ${activeVersionDetails.powerLevel}%`,
        version: selectedVersion
      });
    } catch (e) {
      console.error('Download SVG error:', e);
    } finally {
      setIsDownloadingSVG(false);
    }
  };

  const handleCopySymbol = () => {
    if (!activeSeal || !activeVersionDetails) return;
    if (checkProtection()) return;

    navigator.clipboard.writeText(activeVersionDetails.symbol);
    setCopiedSymbol(true);
    setTimeout(() => setCopiedSymbol(false), 2500);
  };

  const getStatusBadge = (status: SealStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {language === 'fr' ? 'Disponible' : language === 'ha' ? 'A samare' : 'Active'}
          </span>
        );
      case 'premium':
        return (
          <span className="bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Lock size={10} />
            VIP / Premium
          </span>
        );
      case 'maintenance':
        return (
          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldAlert size={10} />
            Maintenance
          </span>
        );
      case 'disabled':
        return (
          <span className="bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Désactivé
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070210] text-gray-900 dark:text-gray-100 pb-16 pt-6 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:text-amber-300 transition-colors bg-white dark:bg-purple-950/50 hover:bg-purple-50 dark:hover:bg-purple-900/60 text-purple-700 dark:text-amber-400 px-3.5 py-2 rounded-xl border border-purple-200 dark:border-purple-500/30"
          >
            <ArrowLeft size={16} />
            <span>{language === 'fr' ? 'Retour aux Outils' : language === 'ha' ? 'Koma baya' : 'Back to Tools'}</span>
          </Link>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowAdminControl(!showAdminControl)}
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 rounded-xl border border-amber-500/40 transition-all cursor-pointer"
            >
              <Sliders size={16} />
              <span>{language === 'fr' ? 'Gestion Admin Sceaux' : 'Admin Seal Controls'}</span>
            </button>
          )}
        </div>

        {/* Hero Banner Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-100 via-indigo-50 to-amber-50 dark:from-purple-950 dark:via-[#15072b] dark:to-black border border-purple-200 dark:border-amber-500/30 shadow-md dark:shadow-2xl rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                 <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Moon size={14} className="text-amber-700 dark:text-amber-400 animate-pulse" />
                <span>
                  {language === 'fr'
                    ? 'Catalogue des 17 Sceaux Lunaires'
                    : language === 'ha'
                    ? 'Dandalin Hatimi guda 17 na Wata'
                    : 'Catalog of 17 Lunar Seals'}
                </span>
              </span>
              <span className="bg-purple-900/60 text-purple-900 dark:text-purple-200 border border-purple-500/30 text-xs font-medium px-3 py-1 rounded-full">
                {language === 'fr'
                  ? 'Science des Awfaq & Khawatim'
                  : language === 'ha'
                  ? 'Ilimin Awfaq da Khawatim'
                  : 'Science of Awfaq & Khawatim'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-purple-950 dark:text-white tracking-wide">
              {language === 'fr'
                ? 'Catalogue & Répertoire Sacré des Sceaux de la Lune'
                : language === 'ha'
                ? 'Tarin Asirai da Hatimai na Wata'
                : 'Catalog & Sacred Repository of Lunar Seals'}
            </h1>

            <p className="text-sm sm:text-base text-purple-900/90 dark:text-purple-200/90 max-w-3xl leading-relaxed">
              {language === 'fr'
                ? 'Explorez les 17 matrices numériques et géométriques sacrées de la Lune. Chaque sceau est répertorié selon son origine scientifique, son utilité théurgique et son utilité rituelle. Visualisez, basculez entre les versions Wafq et Khatim, et téléchargez vos supports en Haute Définition (PNG & Vectoriel SVG).'
                : language === 'ha'
                ? 'Binciki asirai guda 17 na wata a gidan lissafi na zahiri. Kowane hatimi yana dauke da bayanai masu zurfi na amfani da hanyoyin gudanarwa. Sauke hoto a tsarin PNG da SVG.'
                : 'Explore the 17 sacred numerical and geometric matrices of the Moon. Every seal is categorized by its scientific origin, theurgic purpose, and ritual application. Toggle through Wafq and Khatim versions, and export in High Definition (PNG & Vector SVG).'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-amber-800 dark:text-amber-300 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-amber-700 dark:text-amber-400" />
                {language === 'fr' ? '17 Variétés Complètes' : language === 'ha' ? 'Iri 17 Cikakku' : '17 Complete Varieties'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-amber-700 dark:text-amber-400" />
                {language === 'fr' ? 'Exportation PNG & SVG' : language === 'ha' ? 'Saukar da PNG da SVG' : 'PNG & SVG Export'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-amber-700 dark:text-amber-400" />
                {language === 'fr' ? 'Protections & Rituels Sacrés' : language === 'ha' ? 'Garkuwa da Ayyukan Asiri' : 'Protections & Sacred Rituals'}
              </span>
            </div>
          </div>
        </div>

        {/* Admin Dashboard Panel (Toggleable) */}
        <AnimatePresence>
          {showAdminControl && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30  border border-amber-500/50 rounded-3xl p-5 space-y-4 shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/30">
                <div className="flex items-center gap-2">
                  <Sliders size={20} className="text-amber-700 dark:text-amber-400" />
                  <h3 className="text-sm font-extrabold text-amber-800 dark:text-amber-200 uppercase tracking-wider">
                    {language === 'fr' ? 'Panneau Admin Firestore : Configuration des Sceaux' : 'Admin Firestore Seal Management'}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleGlobalMaintenance}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      globalMaintenance
                        ? 'bg-rose-600 text-white border-rose-400 shadow-lg'
                        : 'bg-black/80 text-gray-700 dark:text-gray-300 border-gray-600 hover:text-white'
                    }`}
                  >
                    {globalMaintenance
                      ? language === 'fr' ? 'Global : Maintenance Active' : 'Global Maintenance ON'
                      : language === 'fr' ? 'Activer Maintenance Globale' : 'Set Global Maintenance'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetAdminConfig}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-600 cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw size={14} />
                    <span>Réinitialiser</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-purple-900 dark:text-purple-200">
                Définissez l'état d'accès (Actif, Premium, Maintenance, Désactivé) et la cible utilisateurs de chaque sceau. Les modifications sont synchronisées instantanément dans Firestore et rechargées sur tous les clients.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {LUNAR_SEAL_VARIETIES.map((seal) => {
                  const currentStatus = adminConfig[seal.id]?.status || seal.defaultStatus;
                  const currentTarget = adminConfig[seal.id]?.targetUser || seal.defaultTargetUser;

                  return (
                    <div
                      key={seal.id}
                      className="flex items-center justify-between gap-2 bg-white dark:bg-black/80 border-gray-200 dark:border-purple-500/30  border border-purple-500/30 p-3 rounded-2xl"
                    >
                      <div className="truncate">
                        <span className="text-xs font-bold text-amber-800 dark:text-amber-300 truncate block">
                          {seal.title.fr}
                        </span>
                        <span className="text-[10px] text-purple-800 dark:text-purple-300 font-mono block">
                          {seal.arabicName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(seal.id, e.target.value as SealStatus)}
                          className="bg-purple-950 text-amber-800 dark:text-amber-200 text-xs font-bold py-1.5 px-2 rounded-xl border border-purple-500/40 cursor-pointer outline-none"
                        >
                          <option value="active">Actif</option>
                          <option value="premium">Premium</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="disabled">Désactivé</option>
                        </select>

                        <select
                          value={currentTarget}
                          onChange={(e) => handleTargetUserChange(seal.id, e.target.value as SealTargetUser)}
                          className="bg-black text-gray-700 dark:text-gray-300 text-xs font-bold py-1.5 px-2 rounded-xl border border-gray-700 cursor-pointer outline-none"
                        >
                          <option value="all">Tous</option>
                          <option value="specialized">Spécialisés</option>
                          <option value="premium">Abonnés VIP</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-500/30  border border-purple-500/30 p-4 rounded-3xl">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-700 dark:text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'fr' ? 'Rechercher un sceau par nom, vertu, formule...' : 'Search seal...'}
              className="w-full bg-white dark:bg-black/70 border-gray-200 dark:border-purple-500/30  border border-purple-500/30 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-100 placeholder-purple-400 focus:outline-none focus:border-amber-400 transition-all"
            />
          </div>

          {/* Group Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedGroup('all')}
              className={`py-2 px-3.5 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                selectedGroup === 'all'
                  ? 'bg-amber-500 text-black shadow-lg scale-[1.02]'
                  : 'bg-black/60 text-purple-900 dark:text-purple-200 border border-purple-500/30 hover:bg-purple-900/40'
              }`}
            >
              Tous ({seals.length})
            </button>

            {[1, 2, 3, 4].map((gNum) => {
              const groupLabel = 
                gNum === 1 ? 'I: Mathématiques' :
                gNum === 2 ? 'II: Astronomiques' :
                gNum === 3 ? 'III: Théurgiques' : 'IV: Alchimie';

              return (
                <button
                  key={gNum}
                  type="button"
                  onClick={() => setSelectedGroup(gNum)}
                  className={`py-2 px-3.5 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    selectedGroup === gNum
                      ? 'bg-amber-500 text-black shadow-lg scale-[1.02]'
                      : 'bg-black/60 text-purple-900 dark:text-purple-200 border border-purple-500/30 hover:bg-purple-900/40'
                  }`}
                >
                  {groupLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interface: Left Selector Grid & Right Active Seal Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Seal Cards Selector Grid */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Sélectionnez un Sceau ({filteredSeals.length})
              </h2>
              <span className="text-[10px] text-purple-800 dark:text-purple-300 font-mono">
                Sciences Sacrées
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 max-h-[750px] overflow-y-auto pr-1">
              {filteredSeals.map((seal) => {
                const isSelected = seal.id === selectedSealId;

                return (
                  <button
                    key={seal.id}
                    type="button"
                    onClick={() => {
                      setSelectedSealId(seal.id);
                      setSelectedVersion(1);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-900/90 to-purple-950 border-amber-400 shadow-xl shadow-purple-950/50 ring-2 ring-amber-400/40 scale-[1.01]'
                        : 'bg-black/70 border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-950/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif text-sm font-bold flex-shrink-0 border ${
                        isSelected 
                          ? 'bg-amber-500 text-black border-amber-400' 
                          : 'bg-purple-950/80 text-amber-800 dark:text-amber-300 border-purple-500/30'
                      }`}>
                        {seal.groupId}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-mono font-bold text-purple-800 dark:text-purple-300">
                            #{seal.id.replace('seal_', '')}
                          </span>
                          {getStatusBadge(seal.status)}
                        </div>

                        <h4 className="text-xs font-bold text-gray-100 truncate">
                          {seal.title}
                        </h4>

                        <span className="text-[11px] text-purple-900 dark:text-purple-200 truncate block">
                          {(seal as any).scienceOrigin || seal.subtitle}
                        </span>
                      </div>
                    </div>

                    <span className="text-sm font-serif font-semibold text-amber-800 dark:text-amber-300 flex-shrink-0" dir="rtl">
                      {seal.arabicName}
                    </span>
                  </button>
                );
              })}

              {filteredSeals.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-black/40 border-gray-200 dark:border-purple-500/30  border border-purple-500/20 rounded-2xl p-6 text-purple-800 dark:text-purple-300 text-xs">
                  Aucun sceau ne correspond à votre recherche.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Active Seal Detailed Viewer & Inspector */}
          <div className="lg:col-span-7">
            {activeSeal && (
              <div className="bg-gradient-to-b from-purple-950/50 via-[#100422] to-black border border-purple-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
                
                {/* Active Seal Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-purple-500/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                        {activeSeal.groupTitle}
                      </span>
                      {getStatusBadge(activeSeal.status)}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-wide">
                      {activeSeal.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-purple-900 dark:text-purple-200 font-medium">
                      {activeSeal.subtitle}
                    </p>

                    {(activeSeal as any).scienceOrigin && (
                      <span className="inline-block text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-white dark:bg-black/60 border-gray-200 dark:border-purple-500/30  px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                        {(activeSeal as any).scienceOrigin}
                      </span>
                    )}
                  </div>

                  <div className="text-left sm:text-right flex-shrink-0">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-800 dark:text-amber-300 block select-all tracking-wider" dir="rtl">
                      {activeSeal.arabicName}
                    </span>
                    <span className="text-[11px] font-mono text-purple-800 dark:text-purple-300 block">
                      VALEUR ABJAD : {activeSeal.abjadValue}
                    </span>
                  </div>
                </div>

                {/* Maintenance Banner */}
                {activeSeal.status === 'maintenance' && (
                  <div className="bg-rose-950/50 border border-rose-500/50 rounded-2xl p-4 text-center text-rose-200 space-y-2 shadow-lg">
                    <ShieldAlert size={28} className="mx-auto text-rose-400 animate-pulse" />
                    <h4 className="text-sm font-bold uppercase tracking-wider">
                      Sceau en Maintenance
                    </h4>
                    <p className="text-xs text-rose-300 max-w-lg mx-auto">
                      L'accès à cette matrice théurgique est temporairement en maintenance. Revenez très bientôt.
                    </p>
                  </div>
                )}

                {/* Premium Lock Banner */}
                {activeSeal.status === 'premium' && !isPremium && !isAdmin && (
                  <div className="bg-amber-950/50 border border-amber-500/50 rounded-2xl p-5 text-center text-amber-800 dark:text-amber-200 space-y-3 shadow-lg">
                    <Lock size={32} className="mx-auto text-amber-700 dark:text-amber-400" />
                    <h4 className="text-sm font-extrabold uppercase tracking-wider">
                      Contenu Réservé aux Membres Premium
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-200 max-w-lg mx-auto leading-relaxed">
                      Ce sceau lunaire de haute théurgie nécessite un abonnement Premium AsrarHub pour débloquer la visualisation complète et l'exportation HD (PNG/SVG).
                    </p>
                    <button
                      type="button"
                      onClick={() => triggerProtectionModal('download')}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-xl transition-all cursor-pointer"
                    >
                      Débloquer l'accès Premium
                    </button>
                  </div>
                )}

                {/* Graphic Box Display */}
                {activeSeal.status !== 'disabled' && (
                  <div className="space-y-4">
                    
                    {/* 12-Version Selector Grid & Power Level Badge */}
                    <div className="bg-white dark:bg-black/90 border-gray-200 dark:border-purple-500/30  p-3 rounded-2xl border border-purple-500/30 space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Sparkles size={12} className="text-amber-700 dark:text-amber-400 animate-spin" />
                          {language === 'fr'
                            ? '12 Versions Théurgiques Suprêmes'
                            : language === 'ha'
                            ? 'Siga 12 Masu Karfi'
                            : '12 Supreme Sacred Versions'}
                        </span>
                        {activeVersionDetails && (
                          <span className="text-[10px] font-bold text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 border-purple-200 dark:border-purple-500/30  px-2 py-0.5 rounded-full border border-purple-500/30">
                            {activeVersionDetails.powerLevel}% {language === 'fr' ? 'Puissance' : language === 'ha' ? 'Karfi' : 'Power'}
                          </span>
                        )}
                      </div>

                      {/* Scrollable grid for 12 versions */}
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                        {SEAL_VERSIONS_LIST.map((v) => {
                          const isSel = selectedVersion === v.version;
                          return (
                            <button
                              key={v.version}
                              type="button"
                              onClick={() => setSelectedVersion(v.version)}
                              className={`py-1.5 px-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center border ${
                                isSel
                                  ? 'bg-amber-500 text-black border-amber-300 shadow-md scale-105'
                                  : 'bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-800/40 hover:bg-purple-900/60 hover:text-white'
                              }`}
                              title={v.title[language] || v.title.fr}
                            >
                              <span>V{v.version}</span>
                              <span className="text-[8px] opacity-80 truncate max-w-full font-normal">
                                {v.badge[language] || v.badge.fr}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Version Meta */}
                      {activeVersionDetails && (
                        <div className="bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30  p-2 rounded-xl border border-amber-500/20 text-center">
                          <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                            {activeVersionDetails.title}
                          </p>
                          <p className="text-[10px] text-purple-800 dark:text-purple-300/80 mt-0.5 italic">
                            {activeVersionDetails.subtitle}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Interactive Khatim Visualizer */}
                    <div className={activeSeal.status === 'premium' && !isPremium && !isAdmin ? 'blur-[3px] opacity-60 pointer-events-none' : ''}>
                      <KhatimVisualizer
                        version={selectedVersion}
                        sealTitle={activeSeal.title}
                        arabicName={activeSeal.arabicName}
                        asciiSymbol={activeVersionDetails ? activeVersionDetails.symbol : activeSeal.graphicSymbol}
                        language={language}
                        onExpandFullScreen={() => {
                          if (checkProtection()) return;
                          setIsFullScreen(true);
                        }}
                      />
                    </div>

                    {/* Action Buttons: PNG, SVG, Copy */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleDownloadPNG}
                        disabled={isDownloadingPNG || activeSeal.status === 'maintenance'}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold py-3 px-4 rounded-2xl shadow-lg transition-all cursor-pointer disabled:opacity-50 text-xs"
                      >
                        <Download size={16} />
                        <span>
                          {isDownloadingPNG
                            ? (language === 'fr' ? 'Téléchargement...' : language === 'ha' ? 'Ana Saukewa...' : 'Downloading...')
                            : (language === 'fr' ? 'Télécharger PNG' : language === 'ha' ? 'Sauke PNG' : 'Download PNG')}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadSVG}
                        disabled={isDownloadingSVG || activeSeal.status === 'maintenance'}
                        className="flex items-center justify-center gap-2 bg-purple-900/80 hover:bg-purple-800 text-purple-900 dark:text-purple-200 border border-purple-500/40 font-extrabold py-3 px-4 rounded-2xl shadow-lg transition-all cursor-pointer disabled:opacity-50 text-xs"
                      >
                        <FileCode size={16} className="text-amber-700 dark:text-amber-400" />
                        <span>{language === 'fr' ? 'Télécharger SVG' : language === 'ha' ? 'Sauke SVG' : 'Download SVG'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopySymbol}
                        disabled={activeSeal.status === 'maintenance'}
                        className="flex items-center justify-center gap-2 bg-white dark:bg-black/80 border-gray-200 dark:border-purple-500/30  hover:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-700 font-extrabold py-3 px-4 rounded-2xl shadow-lg transition-all cursor-pointer disabled:opacity-50 text-xs"
                      >
                        {copiedSymbol ? (
                          <>
                            <Check size={16} className="text-emerald-400" />
                            <span className="text-emerald-300">{language === 'fr' ? 'Copié !' : language === 'ha' ? 'An Kwafa!' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy size={16} className="text-gray-600 dark:text-gray-300" />
                            <span>{language === 'fr' ? 'Copier le Symbole' : language === 'ha' ? 'Kwafi Hatimi' : 'Copy Symbol'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Seal Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-purple-500/30 text-xs">
                      
                      {/* Description */}
                      <div className="bg-white dark:bg-black/60 border-gray-200 dark:border-purple-500/30  p-4 rounded-2xl border border-purple-500/20 space-y-1 sm:col-span-2">
                        <span className="font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider block text-[10px]">
                          {language === 'fr'
                            ? 'Description de la Matrice Sacrée'
                            : language === 'ha'
                            ? 'Bayanin Hatimin Mai Tsarki'
                            : 'Sacred Matrix Description'}
                        </span>
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                          {activeSeal.description}
                        </p>
                      </div>

                      {/* Spiritual Utility */}
                      <div className="bg-white dark:bg-black/60 border-gray-200 dark:border-purple-500/30  p-4 rounded-2xl border border-purple-500/20 space-y-1">
                        <span className="font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider block text-[10px]">
                          {language === 'fr'
                            ? 'Vertus & Effets Spirituels'
                            : language === 'ha'
                            ? 'Amfani da Tasirin Ruhi'
                            : 'Virtues & Spiritual Effects'}
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {activeSeal.spiritualUtility}
                        </p>
                      </div>

                      {/* Ritual Usage */}
                      <div className="bg-white dark:bg-black/60 border-gray-200 dark:border-purple-500/30  p-4 rounded-2xl border border-purple-500/20 space-y-1">
                        <span className="font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider block text-[10px]">
                          {language === 'fr'
                            ? "Mode d'Utilisation Rituelle"
                            : language === 'ha'
                            ? 'Hanyar Amfani a Aiki'
                            : 'Ritual Usage Method'}
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {activeSeal.ritualUsage}
                        </p>
                      </div>

                      {/* Incense & Timing */}
                      <div className="bg-white dark:bg-black/60 border-gray-200 dark:border-purple-500/30  p-4 rounded-2xl border border-purple-500/20 space-y-1">
                        <span className="font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider block text-[10px]">
                          {language === 'fr'
                            ? "Encens d'Invocations (Bakhour)"
                            : language === 'ha'
                            ? "Turaren Addu'a (Bakhour)"
                            : 'Invocation Incense (Bakhour)'}
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {activeSeal.incense}
                        </p>
                      </div>

                      <div className="bg-white dark:bg-black/60 border-gray-200 dark:border-purple-500/30  p-4 rounded-2xl border border-purple-500/20 space-y-1">
                        <span className="font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider block text-[10px]">
                          {language === 'fr'
                            ? 'Propriété Élémentaire & Moment Optimal'
                            : language === 'ha'
                            ? 'Yanayin Shi da Lokaci Mai Kyau'
                            : 'Elemental Property & Optimal Time'}
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {activeSeal.elementalProperty} • {activeSeal.timing}
                        </p>
                      </div>

                      {/* Formula */}
                      <div className="bg-white dark:bg-black/80 border-gray-200 dark:border-purple-500/30  p-4 rounded-2xl border border-amber-500/30 space-y-1 sm:col-span-2 text-center">
                        <span className="font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider block text-[10px]">
                          {language === 'fr'
                            ? 'Formule Invocatoire Sacrée'
                            : language === 'ha'
                            ? "Addu'ar Kira Mai Tsarki"
                            : 'Sacred Invocation Formula'}
                        </span>
                        <p className="text-amber-800 dark:text-amber-200 font-serif font-bold text-sm tracking-wide" dir="rtl">
                          {activeSeal.formula}
                        </p>
                      </div>

                    </div>

                  </div>
                )}

              </div>
            )}
          </div>

        </div>

      </div>

      {/* Full Screen Modal View */}
      <AnimatePresence>
        {isFullScreen && activeSeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white dark:bg-black/95 border-gray-200 dark:border-purple-500/30  backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setIsFullScreen(false)}
          >
            <div
              className="bg-[#0b0317] border border-amber-500/50 rounded-3xl p-6 sm:p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsFullScreen(false)}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-white bg-white dark:bg-black/60 border-gray-200 dark:border-purple-500/30  p-2 rounded-full border border-gray-700"
              >
                ✕
              </button>

              <div className="text-center space-y-2">
                <span className="text-xs font-mono text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                  {activeSeal.groupTitle}
                </span>
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                  {activeSeal.title}
                </h2>
                <p className="text-lg font-serif text-amber-800 dark:text-amber-300" dir="rtl">
                  {activeSeal.arabicName}
                </p>
              </div>

              {activeVersionDetails && (
                <p className="text-xs font-semibold text-purple-800 dark:text-purple-300 text-center">
                  {activeVersionDetails.title} • {language === 'fr' ? 'Puissance' : language === 'ha' ? 'Karfi' : 'Power'}: {activeVersionDetails.powerLevel}%
                </p>
              )}

              <div className="w-full text-left">
                <KhatimVisualizer
                  version={selectedVersion}
                  sealTitle={activeSeal.title}
                  arabicName={activeSeal.arabicName}
                  asciiSymbol={activeVersionDetails ? activeVersionDetails.symbol : activeSeal.graphicSymbol}
                  language={language}
                />
              </div>

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={handleDownloadPNG}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Download size={16} />
                  <span>{language === 'fr' ? 'Télécharger PNG HD' : language === 'ha' ? 'Sauke PNG HD' : 'Download PNG HD'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSVG}
                  className="bg-purple-900 hover:bg-purple-800 text-purple-900 dark:text-purple-200 border border-purple-500/40 font-extrabold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <FileCode size={16} className="text-amber-700 dark:text-amber-400" />
                  <span>{language === 'fr' ? 'Télécharger Vectoriel SVG' : language === 'ha' ? 'Sauke SVG' : 'Download Vector SVG'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SealsCatalogue;
