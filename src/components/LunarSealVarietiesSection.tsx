import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  Eye,
  Lock,
  ShieldAlert,
  Settings,
  Sparkles,
  Check,
  Copy,
  Layers,
  ChevronRight,
  Flame,
  Info,
  RefreshCw,
  Compass,
  Sliders,
  UserCheck
} from 'lucide-react';
import {
  LUNAR_SEAL_VARIETIES,
  LunarSealVariety,
  SealStatus,
  SealTargetUser,
  SEAL_VERSIONS_LIST,
  getLocalizedLunarSealVarieties,
  getSealAdminConfig,
  saveSealAdminConfig,
  isGlobalSealMaintenance,
  setGlobalSealMaintenance,
  getSealVersionSymbol,
  getSealVersionDetails
} from '../data/lunarSealVarieties';
import { generateAndDownloadSealCard } from '../utils/sealCanvasExporter';
import { useAuth } from '../contexts/AuthContext';
import { KhatimVisualizer } from './KhatimVisualizer';

interface LunarSealVarietiesSectionProps {
  language: 'fr' | 'en' | 'ha';
  onTriggerPremiumModal?: () => void;
}

export const LunarSealVarietiesSection: React.FC<LunarSealVarietiesSectionProps> = ({
  language,
  onTriggerPremiumModal
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'master' || user?.role === 'super_admin' || user?.isTrusted;

  const [seals, setSeals] = useState(() => getLocalizedLunarSealVarieties(language));
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>('all');
  const [selectedSealId, setSelectedSealId] = useState<string>('seal_wafq_9x9');
  const [selectedVersion, setSelectedVersion] = useState<number>(1);
  const [copiedSymbol, setCopiedSymbol] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Admin Management State
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [adminConfig, setAdminConfig] = useState(() => getSealAdminConfig());
  const [globalMaintenance, setGlobalMaintenance] = useState(() => isGlobalSealMaintenance());

  // Reload localized seals when language or admin settings change
  useEffect(() => {
    setSeals(getLocalizedLunarSealVarieties(language));
  }, [language, adminConfig, globalMaintenance]);

  const activeSeal = seals.find((s) => s.id === selectedSealId) || seals[0];
  const activeVersionDetails = activeSeal ? getSealVersionDetails(activeSeal, selectedVersion, language) : null;

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
    const nextVal = !globalMaintenance;
    setGlobalMaintenance(nextVal);
    setGlobalSealMaintenance(nextVal);
  };

  const handleResetAdminConfig = () => {
    const initialConfig: Record<string, { status: SealStatus; targetUser: SealTargetUser }> = {};
    LUNAR_SEAL_VARIETIES.forEach((s) => {
      initialConfig[s.id] = { status: s.defaultStatus, targetUser: s.defaultTargetUser };
    });
    setAdminConfig(initialConfig);
    saveSealAdminConfig(initialConfig);
    setGlobalMaintenance(false);
    setGlobalSealMaintenance(false);
  };

  const handleDownloadSeal = async () => {
    if (!activeSeal || !activeVersionDetails) return;
    setIsDownloading(true);

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
      console.error('Download error:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopySymbol = () => {
    if (!activeSeal || !activeVersionDetails) return;
    navigator.clipboard.writeText(activeVersionDetails.symbol);
    setCopiedSymbol(true);
    setTimeout(() => setCopiedSymbol(false), 2500);
  };

  const filteredSeals = seals.filter((s) => {
    if (selectedGroup !== 'all' && s.groupId !== selectedGroup) return false;
    // Hide disabled seals for non-admins
    if (!isAdmin && s.status === 'disabled') return false;
    return true;
  });

  const getStatusBadge = (status: SealStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
            <Check size={10} />
            {language === 'fr' ? 'Actif' : language === 'ha' ? 'Aiki' : 'Active'}
          </span>
        );
      case 'premium':
        return (
          <span className="bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
            <Lock size={10} />
            Premium
          </span>
        );
      case 'maintenance':
        return (
          <span className="bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert size={10} />
            {language === 'fr' ? 'Maintenance' : language === 'ha' ? 'Gyara' : 'Maintenance'}
          </span>
        );
      case 'disabled':
        return (
          <span className="bg-gray-900 text-gray-400 border border-gray-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
            {language === 'fr' ? 'Désactivé' : language === 'ha' ? 'Kashe' : 'Disabled'}
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white dark:bg-black/80 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-4 sm:p-6 shadow-md dark:shadow-2xl text-left space-y-6 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 dark:border-purple-500/30 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-1">
            <Sparkles size={14} className="text-amber-400 animate-spin" />
            {language === 'fr'
              ? 'COLLECTION COMPLETE DES 17 SCEAUX DU QAMAR'
              : language === 'ha'
              ? 'RUKUNIN HATIMI 17 NA WATA'
              : 'COMPLETE 17 LUNAR SEALS COLLECTION'}
          </span>
          <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-wide">
            {language === 'fr'
              ? 'Sceaux, Khawatim & Matrices Théurgiques de la Lune'
              : language === 'ha'
              ? 'Hatimai da Sarakunan Ruhi na Wata'
              : 'Sacred Seals, Khawatim & Theurgic Matrices of the Moon'}
          </h2>
        </div>

        {/* Admin Toggle Button */}
        {isAdmin && (
          <button
            type="button"
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              showAdminPanel
                ? 'bg-amber-500 text-black border-amber-400 shadow-lg'
                : 'bg-purple-950/60 text-purple-200 border-purple-500/40 hover:bg-purple-900/80'
            }`}
          >
            <Settings size={14} className={showAdminPanel ? 'animate-spin' : ''} />
            <span>
              {language === 'fr'
                ? 'Gestion Admin Sceaux'
                : language === 'ha'
                ? 'Saitunan Admin'
                : 'Admin Seals Control'}
            </span>
          </button>
        )}
      </div>

      {/* Admin Panel Drawer */}
      <AnimatePresence>
        {isAdmin && showAdminPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-500/30  border border-amber-500/40 rounded-2xl p-4 sm:p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-500/30">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-amber-400" />
                <h3 className="text-sm font-bold text-amber-200 uppercase tracking-wider">
                  {language === 'fr'
                    ? 'Panneau d’Administration des 17 Sceaux Lunaires'
                    : language === 'ha'
                    ? 'Panon Admin na Hatsi 17'
                    : '17 Lunar Seals Admin Control Panel'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleGlobalMaintenance}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    globalMaintenance
                      ? 'bg-rose-600 text-white border-rose-400 shadow-lg'
                      : 'bg-black/60 text-gray-300 border-gray-600 hover:text-white'
                  }`}
                >
                  {globalMaintenance
                    ? language === 'fr'
                      ? 'Global : Maintenance Active'
                      : 'Global Maintenance ON'
                    : language === 'fr'
                    ? 'Activer Maintenance Globale'
                    : 'Set Global Maintenance'}
                </button>

                <button
                  type="button"
                  onClick={handleResetAdminConfig}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 cursor-pointer flex items-center gap-1"
                  title="Réinitialiser"
                >
                  <RefreshCw size={12} />
                  <span>{language === 'fr' ? 'Réinitialiser' : 'Reset'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {language === 'fr'
                ? 'Modifiez la disponibilité (Actif, Premium, Maintenance, Désactivé) et le public cible de chaque sceau. Les modifications sont enregistrées en temps réel.'
                : 'Configure individual seal availability and target access level.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {LUNAR_SEAL_VARIETIES.map((seal) => {
                const currentStatus = adminConfig[seal.id]?.status || seal.defaultStatus;
                const currentTarget = adminConfig[seal.id]?.targetUser || seal.defaultTargetUser;

                return (
                  <div
                    key={seal.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-purple-50/40 dark:bg-black/70 border-purple-200 dark:border-purple-500/30  border border-purple-500/20 p-2.5 rounded-xl"
                  >
                    <div className="truncate">
                      <span className="text-xs font-bold text-amber-300 truncate block">
                        {seal.title.fr}
                      </span>
                      <span className="text-[10px] text-gray-400 block font-mono">
                        {seal.arabicName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Status Selector */}
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(seal.id, e.target.value as SealStatus)}
                        className="bg-purple-50 dark:bg-purple-950/90 border-purple-200 dark:border-purple-500/30  text-amber-200 text-[10px] font-bold py-1 px-1.5 rounded-lg border border-purple-500/40 cursor-pointer"
                      >
                        <option value="active">Actif</option>
                        <option value="premium">Premium</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="disabled">Désactivé</option>
                      </select>

                      {/* Target User Selector */}
                      <select
                        value={currentTarget}
                        onChange={(e) =>
                          handleTargetUserChange(seal.id, e.target.value as SealTargetUser)
                        }
                        className="bg-purple-50/40 dark:bg-black/90 border-purple-200 dark:border-purple-500/30  text-gray-300 text-[10px] font-bold py-1 px-1.5 rounded-lg border border-gray-700 cursor-pointer"
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

      {/* Group Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => setSelectedGroup('all')}
          className={`py-2 px-3.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            selectedGroup === 'all'
              ? 'bg-amber-500 text-black shadow-lg scale-[1.02]'
              : 'bg-purple-950/40 text-purple-200 border border-purple-500/30 hover:bg-purple-900/50'
          }`}
        >
          {language === 'fr'
            ? 'Tous les 17 Sceaux'
            : language === 'ha'
            ? 'Duka Hatimi 17'
            : 'All 17 Seals'}
        </button>

        {[1, 2, 3, 4].map((gNum) => {
          const groupTitle =
            gNum === 1
              ? language === 'fr'
                ? 'I: Mathématiques'
                : 'I: Math'
              : gNum === 2
              ? language === 'fr'
                ? 'II: Astronomiques'
                : 'II: Astronomical'
              : gNum === 3
              ? language === 'fr'
                ? 'III: Théurgiques'
                : 'III: Theurgic'
              : language === 'fr'
              ? 'IV: Alchimie Supérieure'
              : 'IV: Alchemy';

          return (
            <button
              key={gNum}
              type="button"
              onClick={() => setSelectedGroup(gNum)}
              className={`py-2 px-3.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                selectedGroup === gNum
                  ? 'bg-amber-500 text-black shadow-lg scale-[1.02]'
                  : 'bg-purple-950/40 text-purple-200 border border-purple-500/30 hover:bg-purple-900/50'
              }`}
            >
              {groupTitle}
            </button>
          );
        })}
      </div>

      {/* Seals Grid Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
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
              className={`p-2.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-1.5 cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-purple-900/80 border-amber-400 shadow-xl shadow-purple-900/40 ring-2 ring-amber-400/40 scale-[1.02]'
                  : 'bg-black/60 border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-950/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono font-bold text-purple-300">
                    #{seal.id.replace('seal_', '')}
                  </span>
                  {getStatusBadge(seal.status)}
                </div>

                <h4 className="text-xs font-bold text-gray-100 line-clamp-2 leading-tight">
                  {seal.title}
                </h4>
              </div>

              <span className="text-[11px] font-serif font-semibold text-amber-300 truncate block mt-1" dir="rtl">
                {seal.arabicName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Seal Detailed Inspector Card */}
      {activeSeal && (
        <div className="bg-gradient-to-b from-purple-950/40 to-black/90 border border-purple-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
          {/* Header of Active Seal */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-500/30">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {activeSeal.groupTitle}
                </span>
                {getStatusBadge(activeSeal.status)}
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-wide">
                {activeSeal.title}
              </h3>
              <p className="text-xs sm:text-sm text-purple-900 dark:text-purple-200 mt-0.5 font-medium">
                {activeSeal.subtitle}
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-300 block select-all tracking-wider" dir="rtl">
                {activeSeal.arabicName}
              </span>
              <span className="text-[11px] font-mono text-purple-300 block">
                VALEUR ABJAD : {activeSeal.abjadValue}
              </span>
            </div>
          </div>

          {/* If Status is Maintenance */}
          {activeSeal.status === 'maintenance' && (
            <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4 text-center text-rose-200 space-y-2">
              <ShieldAlert size={28} className="mx-auto text-rose-400 animate-pulse" />
              <h4 className="text-sm font-bold uppercase tracking-wider">
                {language === 'fr'
                  ? 'Sceau Temporairement en Maintenance Spirituelle'
                  : 'Seal Under Spiritual Maintenance'}
              </h4>
              <p className="text-xs text-rose-300 max-w-lg mx-auto">
                {language === 'fr'
                  ? 'L’accès à cette matrice théurgique est momentanément restreint par les maîtres administrateurs pour réalignement des fréquences. Veuillez consulter les autres sceaux actifs.'
                  : 'Access to this theurgic matrix is temporarily paused for alignment.'}
              </p>
            </div>
          )}

          {/* If Status is Premium Lock */}
          {activeSeal.status === 'premium' && (
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 text-center text-amber-200 space-y-2">
              <Lock size={28} className="mx-auto text-amber-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider">
                {language === 'fr'
                  ? 'Sceau réservé aux Membres Premium / VIP'
                  : 'Premium Seal Access Required'}
              </h4>
              <p className="text-xs text-amber-300 max-w-lg mx-auto">
                {language === 'fr'
                  ? 'Cette matrice de haute hermétisme nécessite un compte Premium AsrarHub actif pour accéder aux rituels et au téléchargement HD.'
                  : 'This high theurgy seal requires an active AsrarHub Premium account.'}
              </p>

              {onTriggerPremiumModal && (
                <button
                  type="button"
                  onClick={onTriggerPremiumModal}
                  className="mt-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold px-4 py-2 rounded-xl text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer"
                >
                  {language === 'fr' ? 'Débloquer l’accès Premium' : 'Unlock Premium Access'}
                </button>
              )}
            </div>
          )}

          {/* Main Content Layout */}
          {activeSeal.status !== 'disabled' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Graphic Symbol Box */}
              <div className="lg:col-span-5 space-y-3">
                {/* 12-Version Selector Grid & Power Level Badge */}
                <div className="bg-purple-50/40 dark:bg-black/90 border-purple-200 dark:border-purple-500/30  p-2.5 rounded-2xl border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles size={12} className="text-amber-400 animate-spin" />
                      {language === 'fr' ? '12 Versions Théurgiques' : '12 Sacred Versions'}
                    </span>
                    {activeVersionDetails && (
                      <span className="text-[10px] font-bold text-purple-300 bg-purple-50 dark:bg-purple-950/80 border-purple-200 dark:border-purple-500/30  px-2 py-0.5 rounded-full border border-purple-500/30">
                        {activeVersionDetails.powerLevel}% {language === 'fr' ? 'Puissance' : 'Power'}
                      </span>
                    )}
                  </div>

                  {/* Versions Scrollable Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 max-h-[110px] overflow-y-auto pr-1">
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
                              : 'bg-purple-950/40 text-purple-300 border-purple-800/40 hover:bg-purple-900/60 hover:text-white'
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

                  {/* Active Selected Version Title */}
                  {activeVersionDetails && (
                    <div className="bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30  p-2 rounded-xl border border-amber-500/20 text-center">
                      <p className="text-xs font-bold text-amber-300">
                        {activeVersionDetails.title}
                      </p>
                      <p className="text-[10px] text-purple-300/80 mt-0.5 italic">
                        {activeVersionDetails.subtitle}
                      </p>
                    </div>
                  )}
                </div>

                {/* Interactive Khatim Visualizer */}
                <KhatimVisualizer
                  version={selectedVersion}
                  sealTitle={activeSeal.title}
                  arabicName={activeSeal.arabicName}
                  asciiSymbol={activeVersionDetails ? activeVersionDetails.symbol : activeSeal.graphicSymbol}
                  language={language}
                  onExpandFullScreen={() => setIsFullScreen(true)}
                />

                {/* Control Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadSeal}
                    disabled={isDownloading || activeSeal.status === 'maintenance'}
                    className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold py-2.5 px-3 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Download size={14} />
                    <span className="text-xs">
                      {isDownloading
                        ? '...'
                        : language === 'fr'
                        ? 'Télécharger PNG'
                        : language === 'ha'
                        ? 'Sauke'
                        : 'Download PNG'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopySymbol}
                    className="flex items-center justify-center gap-1.5 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30  hover:bg-purple-900/80 border border-purple-500/30 text-purple-900 dark:text-purple-200 font-bold py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
                  >
                    {copiedSymbol ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-xs text-emerald-400">
                          {language === 'fr' ? 'Copié !' : 'Copied!'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span className="text-xs">
                          {language === 'fr' ? 'Copier Sceau' : 'Copy Seal'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Descriptions, Utility, Rituals */}
              <div className="lg:col-span-7 space-y-4">
                {/* Description */}
                <div className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-500/30  border border-purple-500/20 rounded-2xl p-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block mb-1">
                    {language === 'fr'
                      ? 'Explication & Origine Sacrée'
                      : language === 'ha'
                      ? 'Bayanin Hatimi da Sirrinsa'
                      : 'Sacred Origin & Description'}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
                    {activeSeal.description}
                  </p>
                </div>

                {/* Formula & Utility Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-purple-50/40 dark:bg-black/60 border-purple-200 dark:border-purple-500/30  border border-purple-500/30 rounded-2xl p-3.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300 block mb-1">
                      {language === 'fr' ? 'Formule & Incantation' : 'Formula & Invocation'}
                    </span>
                    <code className="text-base sm:text-lg font-serif font-bold text-amber-300 block mb-1" dir="rtl">
                      {activeSeal.formula}
                    </code>
                  </div>

                  <div className="bg-purple-50/40 dark:bg-black/60 border-purple-200 dark:border-purple-500/30  border border-purple-500/30 rounded-2xl p-3.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300 block mb-1">
                      {language === 'fr' ? 'Utilité Spirituelle Majeure' : 'Spiritual Benefit'}
                    </span>
                    <p className="text-xs text-emerald-200 font-medium leading-relaxed">
                      {activeSeal.spiritualUtility}
                    </p>
                  </div>
                </div>

                {/* Protocol Specifications Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-500/30  border border-purple-500/20 rounded-xl p-2.5">
                    <span className="text-[9px] text-purple-300 uppercase font-bold block mb-0.5">
                      {language === 'fr' ? 'Élément' : 'Element'}
                    </span>
                    <span className="text-gray-200 font-medium">{activeSeal.elementalProperty}</span>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-500/30  border border-purple-500/20 rounded-xl p-2.5">
                    <span className="text-[9px] text-purple-300 uppercase font-bold block mb-0.5">
                      {language === 'fr' ? 'Encens (Bukhoor)' : 'Incense'}
                    </span>
                    <span className="text-amber-200 font-medium">{activeSeal.incense}</span>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-500/30  border border-purple-500/20 rounded-xl p-2.5">
                    <span className="text-[9px] text-purple-300 uppercase font-bold block mb-0.5">
                      {language === 'fr' ? 'Créneau Temporel' : 'Timing Rule'}
                    </span>
                    <span className="text-purple-900 dark:text-purple-200 font-medium">{activeSeal.timing}</span>
                  </div>
                </div>

                {/* Ritual Usage Method */}
                <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block mb-1 flex items-center gap-1.5">
                    <Compass size={12} />
                    {language === 'fr'
                      ? 'Protocole & Méthode de Confection Rituelle'
                      : language === 'ha'
                      ? 'Hanyar Yin Hatimi da Gudanarwa'
                      : 'Ritual Crafting Protocol'}
                  </span>
                  <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
                    {activeSeal.ritualUsage}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Modal View */}
      <AnimatePresence>
        {isFullScreen && activeSeal && (
          <div className="fixed inset-0 z-50 bg-purple-50/40 dark:bg-black/95 border-purple-200 dark:border-purple-500/30  backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-purple-50/40 dark:bg-black/90 border-purple-200 dark:border-purple-500/30  border-2 border-amber-500/50 rounded-3xl p-6 max-w-3xl w-full text-center space-y-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setIsFullScreen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:text-white p-2 rounded-full bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/30  border border-purple-500/30 cursor-pointer"
              >
                ✕
              </button>

              <div>
                <span className="text-xs text-amber-400 uppercase tracking-widest font-extrabold block mb-1">
                  {activeSeal.groupTitle}
                </span>
                <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{activeSeal.title}</h3>
                {activeVersionDetails && (
                  <p className="text-xs font-semibold text-purple-300 mt-1">
                    {activeVersionDetails.title} • {activeVersionDetails.powerLevel}% {language === 'fr' ? 'Puissance Théurgique' : 'Theurgic Power'}
                  </p>
                )}
                <span className="text-xl font-serif text-amber-300 block mt-1" dir="rtl">
                  {activeSeal.arabicName}
                </span>
              </div>

              <div className="w-full text-left">
                <KhatimVisualizer
                  version={selectedVersion}
                  sealTitle={activeSeal.title}
                  arabicName={activeSeal.arabicName}
                  asciiSymbol={activeVersionDetails ? activeVersionDetails.symbol : activeSeal.graphicSymbol}
                  language={language}
                />
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadSeal}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold px-6 py-3 rounded-2xl text-sm flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Download size={18} />
                  <span>
                    {language === 'fr'
                      ? 'Télécharger en Image PNG HD'
                      : language === 'ha'
                      ? 'Sauke Hoton Hatimi'
                      : 'Download High-Res PNG'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFullScreen(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold px-5 py-3 rounded-2xl text-sm cursor-pointer"
                >
                  {language === 'fr' ? 'Fermer' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
