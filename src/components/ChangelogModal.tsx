import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Tag,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  Database,
  Smartphone,
  Search,
  UploadCloud,
  Check,
  Info
} from 'lucide-react';
import { appVersionService } from '../services/appVersionService';
import { VersionRelease, APP_VERSION_CONFIG, getLocalizedRelease } from '../config/appVersion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedVersion?: string;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({
  isOpen,
  onClose,
  initialSelectedVersion
}) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [releases, setReleases] = useState<VersionRelease[]>(APP_VERSION_CONFIG.releases);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string>(
    initialSelectedVersion || appVersionService.getCurrentVersion()
  );
  const [isRefreshingCache, setIsRefreshingCache] = useState(false);
  const [refreshStep, setRefreshStep] = useState<string | null>(null);
  const [isSyncingFirestore, setIsSyncingFirestore] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const currentAppVersion = appVersionService.getCurrentVersion();
  const currentAppVersionCode = appVersionService.getCurrentVersionCode();

  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = appVersionService.subscribeReleases((fetchedReleases) => {
      setReleases(fetchedReleases);
      if (!selectedVersion && fetchedReleases.length > 0) {
        setSelectedVersion(fetchedReleases[0].version);
      }
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredReleases = releases.filter((rel) => {
    const loc = getLocalizedRelease(rel, language);
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      rel.version.toLowerCase().includes(q) ||
      loc.title.toLowerCase().includes(q) ||
      loc.highlights.some((h) => h.toLowerCase().includes(q))
    );
  });

  const rawActiveRelease =
    releases.find((r) => r.version === selectedVersion) || releases[0] || APP_VERSION_CONFIG.releases[0];
  const activeReleaseLoc = rawActiveRelease ? getLocalizedRelease(rawActiveRelease, language) : null;

  const handleFlushCache = async () => {
    setIsRefreshingCache(true);
    setRefreshStep(t('changelog.stepModalCleaning', "Nettoyage du cache d'application..."));
    try {
      await appVersionService.flushAndUpgradeCaches((step) => {
        setRefreshStep(step);
      });
      setTimeout(() => {
        setIsRefreshingCache(false);
        setRefreshStep(null);
        window.location.reload();
      }, 1000);
    } catch (e) {
      setIsRefreshingCache(false);
      setRefreshStep(null);
    }
  };

  const handleSyncFirestore = async () => {
    setIsSyncingFirestore(true);
    try {
      await appVersionService.seedFirestoreVersions();
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (e) {
      console.warn("Sync error:", e);
    } finally {
      setIsSyncingFirestore(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <span>{t('changelog.modalTitle', 'Journal des Modifications')}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  v{currentAppVersion}
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('changelog.modalSubtitle', "Historique des évolutions, optimisations et correctifs d'AsrarHub")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={handleSyncFirestore}
                disabled={isSyncingFirestore}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                title="Synchroniser la collection Firebase app_versions"
              >
                {syncSuccess ? (
                  <>
                    <Check size={14} className="text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">{t('changelog.synced', 'Synchronisé')}</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={14} className={isSyncingFirestore ? 'animate-bounce' : ''} />
                    <span>{t('changelog.syncFirestore', 'Sync Firestore')}</span>
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 cursor-pointer"
              title={t('changelog.close', 'Fermer')}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Sidebar: Versions List */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col gap-3 max-h-56 md:max-h-none overflow-y-auto">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder={t('changelog.searchUpdatePlaceholder', 'Rechercher une mise à jour...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* List */}
            <div className="space-y-2 flex-1 overflow-y-auto pr-1">
              {filteredReleases.map((rel) => {
                const loc = getLocalizedRelease(rel, language);
                const isSelected = (rawActiveRelease?.version === rel.version);
                const isCurrent = rel.version === currentAppVersion;
                return (
                  <button
                    key={rel.version}
                    type="button"
                    onClick={() => setSelectedVersion(rel.version)}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-white dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        <Tag size={14} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs sm:text-sm">
                            v{rel.version}
                          </span>
                          {isCurrent && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                                isSelected
                                  ? 'bg-white text-emerald-800'
                                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                              }`}
                            >
                              {t('changelog.currentBadge', 'Actuelle')}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-[10px] mt-0.5 ${
                            isSelected ? 'text-emerald-100' : 'text-gray-400'
                          }`}
                        >
                          {loc.releaseDate}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : rel.type === 'major'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                      }`}
                    >
                      {rel.type === 'major'
                        ? t('changelog.filterMajor', 'Majeures')
                        : rel.type === 'patch'
                        ? t('changelog.filterPatch', 'Correctifs')
                        : t('changelog.filterMinor', 'Mineures')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Cache Flush Button in Sidebar */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={handleFlushCache}
                disabled={isRefreshingCache}
                className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={14} className={isRefreshingCache ? 'animate-spin' : ''} />
                <span>{isRefreshingCache ? t('changelog.flushing', 'Nettoyage...') : t('changelog.refreshCacheBtn', 'Actualiser le cache')}</span>
              </button>
            </div>
          </div>

          {/* Right Main Panel: Detailed Highlights */}
          <div className="flex-1 p-5 sm:p-7 overflow-y-auto bg-white dark:bg-gray-900 space-y-6">
            {rawActiveRelease && activeReleaseLoc ? (
              <div className="space-y-6">
                {/* Header Card */}
                <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-950/40 dark:via-gray-800 dark:to-transparent p-5 rounded-3xl border border-emerald-500/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                        {t('changelog.version', `Version ${rawActiveRelease.version}`, { version: rawActiveRelease.version })}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                        {t('changelog.build', `Build ${rawActiveRelease.versionCode}`, { code: rawActiveRelease.versionCode })}
                      </span>
                      {rawActiveRelease.version === currentAppVersion && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 flex items-center gap-1">
                          <CheckCircle2 size={12} /> {t('changelog.installedBadge', 'Installée')}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                      <Clock size={13} /> {activeReleaseLoc.releaseDate}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">
                    {activeReleaseLoc.title}
                  </h4>
                </div>

                {/* Improvements List */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                    <Zap size={14} className="text-amber-500" />
                    {t('changelog.improvements', 'Améliorations & Nouveautés majeures')}
                  </h5>
                  <div className="space-y-2.5">
                    {activeReleaseLoc.highlights.map((item, index) => (
                      <div
                        key={index}
                        className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/60 flex items-start gap-3"
                      >
                        <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                          <CheckCircle2 size={16} />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical details badge */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Smartphone size={16} className="text-emerald-500" />
                    <span>{t('changelog.androidPackage', 'Package Android :')} <code>{APP_VERSION_CONFIG.bundleId}</code></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span>{t('changelog.permanentSignature', 'Signature V1/V2 permanente activée')}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Info size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('changelog.empty', 'Aucune version trouvée correspondant à votre recherche.')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info & Action */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/90 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
            {refreshStep || t('changelog.currentStatusText', `Vous utilisez actuellement AsrarHub v${currentAppVersion} (Build ${currentAppVersionCode})`, { version: currentAppVersion, code: currentAppVersionCode })}
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleFlushCache}
              disabled={isRefreshingCache}
              className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshingCache ? 'animate-spin' : ''} />
              <span>{isRefreshingCache ? t('changelog.flushing', 'Nettoyage en cours...') : t('changelog.flushAndReload', 'Vider le cache & Recharger')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {t('changelog.close', 'Fermer')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
