import React, { useState, useEffect } from 'react';
import {
  Tag,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Clock,
  ShieldCheck,
  Zap,
  Smartphone,
  Search,
  UploadCloud,
  Check,
  Info,
  ExternalLink,
  Database,
  Layers,
  Flame,
  ArrowRight
} from 'lucide-react';
import { appVersionService } from '../services/appVersionService';
import { VersionRelease, APP_VERSION_CONFIG, getAppVersion, getFullVersionDisplay, getLocalizedRelease } from '../config/appVersion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export interface ChangelogViewProps {
  embedded?: boolean;
  showHeader?: boolean;
  className?: string;
  onOpenModal?: () => void;
}

export const ChangelogView: React.FC<ChangelogViewProps> = ({
  embedded = true,
  showHeader = true,
  className = '',
  onOpenModal
}) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [releases, setReleases] = useState<VersionRelease[]>(APP_VERSION_CONFIG.releases);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'major' | 'minor' | 'patch'>('all');
  const [isRefreshingCache, setIsRefreshingCache] = useState(false);
  const [refreshStep, setRefreshStep] = useState<string | null>(null);
  const [isSyncingFirestore, setIsSyncingFirestore] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const currentAppVersion = getAppVersion();

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = appVersionService.subscribeReleases((fetchedReleases) => {
      setReleases(fetchedReleases);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFlushCache = async () => {
    setIsRefreshingCache(true);
    setRefreshStep(t('changelog.stepCleaning', "Nettoyage du cache SWR et des ressources locales..."));
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
      console.warn("Firestore sync error:", e);
    } finally {
      setIsSyncingFirestore(false);
    }
  };

  const filteredReleases = releases.filter((rel) => {
    const loc = getLocalizedRelease(rel, language);
    const matchesCategory = selectedCategory === 'all' || rel.type === selectedCategory;
    if (!searchQuery.trim()) return matchesCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      rel.version.toLowerCase().includes(q) ||
      loc.title.toLowerCase().includes(q) ||
      loc.highlights.some((h) => h.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Optional View Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/40 dark:via-gray-800 dark:to-transparent p-5 rounded-3xl border border-emerald-500/20 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                  {t('changelog.title', 'Journal des Mises à Jour')}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  {getFullVersionDisplay()}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {t('changelog.subtitle', 'Historique synchronisé depuis la collection Firestore app_versions')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={handleSyncFirestore}
                disabled={isSyncingFirestore}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Synchroniser la collection Firebase app_versions"
              >
                {syncSuccess ? (
                  <>
                    <Check size={14} />
                    <span>{t('changelog.synced', 'Synchronisé')}</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={14} className={isSyncingFirestore ? 'animate-bounce' : ''} />
                    <span>{t('changelog.syncFirestore', 'Sync Firestore')}</span>
                  </>
                )}
              </button>
            )}

            {onOpenModal && (
              <button
                type="button"
                onClick={onOpenModal}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t('changelog.fullScreen', 'Plein écran')}</span>
                <ExternalLink size={13} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-gray-800/80 p-3 rounded-2xl border border-gray-100 dark:border-gray-700/70 shadow-xs">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('changelog.searchPlaceholder', 'Rechercher une fonctionnalité, correctif...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'major', 'minor', 'patch'] as const).map((cat) => {
            const catLabel =
              cat === 'all'
                ? t('changelog.filterAll', 'Toutes')
                : cat === 'major'
                ? t('changelog.filterMajor', 'Majeures')
                : cat === 'minor'
                ? t('changelog.filterMinor', 'Mineures')
                : t('changelog.filterPatch', 'Correctifs');

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {catLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Release List Feed */}
      {isLoading ? (
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-gray-400">
          <RefreshCw className="animate-spin text-emerald-500" size={24} />
          <span className="text-xs">{t('changelog.loading', 'Chargement du journal des modifications...')}</span>
        </div>
      ) : filteredReleases.length === 0 ? (
        <div className="py-8 px-4 text-center bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 text-gray-400">
          <Info size={28} className="mx-auto mb-2 opacity-50" />
          <p className="text-xs font-semibold">{t('changelog.empty', 'Aucune mise à jour ne correspond à vos critères de recherche.')}</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredReleases.map((rel) => {
            const isCurrent = rel.version === currentAppVersion || rel.isCurrent;
            const loc = getLocalizedRelease(rel, language);

            return (
              <div
                key={rel.version}
                className={`p-5 rounded-3xl border transition-all ${
                  isCurrent
                    ? 'bg-white dark:bg-gray-800/90 border-emerald-300 dark:border-emerald-700 shadow-sm ring-1 ring-emerald-500/20'
                    : 'bg-white/80 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/60 shadow-xs'
                }`}
              >
                {/* Release Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-700/60">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <Tag size={13} />
                    </div>

                    <span className="font-black text-sm sm:text-base text-gray-900 dark:text-white">
                      {t('changelog.version', `Version ${rel.version}`, { version: rel.version })}
                    </span>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {t('changelog.build', `Build ${rel.versionCode}`, { code: rel.versionCode })}
                    </span>

                    {isCurrent && (
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <CheckCircle2 size={11} />
                        <span>{t('changelog.installed', 'Version Installée')}</span>
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        rel.type === 'major'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                          : rel.type === 'patch'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                      }`}
                    >
                      {rel.type === 'major'
                        ? t('changelog.filterMajor', 'Majeures')
                        : rel.type === 'patch'
                        ? t('changelog.filterPatch', 'Correctifs')
                        : t('changelog.filterMinor', 'Mineures')}
                    </span>
                  </div>

                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1">
                    <Clock size={12} />
                    <span>{loc.releaseDate}</span>
                  </span>
                </div>

                {/* Release Title */}
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 pt-3 pb-2">
                  {loc.title}
                </h4>

                {/* Highlights List */}
                <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 pt-1">
                  {loc.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="p-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* Cache Revalidation Action Banner */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <RefreshCw size={16} />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">
              {t('changelog.cacheSyncTitle', 'Cache SWR & Synchronisation locale')}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-[11px]">
              {refreshStep || t('changelog.cacheSyncDesc', "En cas de conflit d'affichage après mise à jour, videz le cache SWR et rechargez l'application.")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFlushCache}
          disabled={isRefreshingCache}
          className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RefreshCw size={13} className={isRefreshingCache ? 'animate-spin' : ''} />
          <span>{isRefreshingCache ? t('changelog.flushing', 'Nettoyage en cours...') : t('changelog.flushCacheBtn', 'Vider le cache SWR')}</span>
        </button>
      </div>
    </div>
  );
};
