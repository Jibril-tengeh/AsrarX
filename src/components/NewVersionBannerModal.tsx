import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, X, ArrowRight, CheckCircle2, Zap, Tag, ShieldCheck } from 'lucide-react';
import { appVersionService } from '../services/appVersionService';
import { APP_VERSION_CONFIG, getLocalizedRelease } from '../config/appVersion';
import { ChangelogModal } from './ChangelogModal';
import { useLanguage } from '../contexts/LanguageContext';

interface NewVersionBannerModalProps {
  isOpen: boolean;
  currentVersion: string;
  previousVersion: string | null;
  onDismiss: () => void;
}

export const NewVersionBannerModal: React.FC<NewVersionBannerModalProps> = ({
  isOpen,
  currentVersion,
  previousVersion,
  onDismiss
}) => {
  const { language, t } = useLanguage();
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleaningStatus, setCleaningStatus] = useState<string | null>(null);
  const [showChangelog, setShowChangelog] = useState(false);

  if (!isOpen) return null;

  const handleCleanAndReload = async () => {
    setIsCleaning(true);
    setCleaningStatus(t('changelog.stepCleaning', "Nettoyage du cache SWR et des ressources locales..."));
    try {
      await appVersionService.flushAndUpgradeCaches((step) => {
        setCleaningStatus(step);
      });
      setTimeout(() => {
        setIsCleaning(false);
        onDismiss();
        window.location.reload();
      }, 900);
    } catch (e) {
      console.warn("Upgrade error:", e);
      setIsCleaning(false);
      onDismiss();
    }
  };

  const handleDismissOnly = () => {
    appVersionService.markVersionInstalled(currentVersion);
    onDismiss();
  };

  const latestReleaseRaw = APP_VERSION_CONFIG.releases.find((r) => r.version === currentVersion) || APP_VERSION_CONFIG.releases[0];
  const latestReleaseLoc = latestReleaseRaw ? getLocalizedRelease(latestReleaseRaw, language) : null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-emerald-500/30 p-5 sm:p-6 relative"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleDismissOnly}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title={t('changelog.close', 'Fermer')}
          >
            <X size={18} />
          </button>

          {/* Icon + Badge */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Sparkles size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {t('changelog.newVersionTag', 'Nouvelle Version')}
                </span>
                <span className="text-xs font-bold text-gray-400">
                  v{currentVersion}
                </span>
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mt-0.5">
                {previousVersion
                  ? t('changelog.updateReady', `Mise à jour v${currentVersion} prête !`, { version: currentVersion })
                  : t('changelog.welcomeVersion', `Bienvenue sur AsrarHub v${currentVersion}`, { version: currentVersion })}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            {previousVersion
              ? t('changelog.upgradeDescription', `Vous êtes passé de la version ${previousVersion} à la version ${currentVersion}. Pour éviter tout conflit de données ou d'anciens fichiers en cache, nous vous conseillons d'actualiser le cache SWR.`, { previousVersion, currentVersion })
              : t('changelog.initialDescription', `Votre application a été initialisée en version ${currentVersion}. Profitez de toutes les dernières fonctionnalités et de la synchronisation sécurisée.`, { currentVersion })}
          </p>

          {/* Quick Highlights */}
          {latestReleaseLoc && latestReleaseLoc.highlights && latestReleaseLoc.highlights.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-3.5 border border-gray-100 dark:border-gray-700/60 mb-5 space-y-2">
              <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap size={13} className="text-amber-500" />
                {t('changelog.highlightsPreview', 'Aperçu des nouveautés')}
              </div>
              <ul className="space-y-1.5">
                {latestReleaseLoc.highlights.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-200">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Status feedback */}
          {cleaningStatus && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 border border-emerald-500/20">
              <RefreshCw size={14} className="animate-spin" />
              <span>{cleaningStatus}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={handleCleanAndReload}
              disabled={isCleaning}
              className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={15} className={isCleaning ? 'animate-spin' : ''} />
              <span>{isCleaning ? t('changelog.flushing', 'Actualisation...') : t('changelog.refreshAndContinue', 'Actualiser le cache & Continuer')}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowChangelog(true)}
              className="w-full sm:w-auto py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Tag size={15} />
              <span>{t('changelog.viewFullChangelog', 'Voir tout le journal')}</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Changelog detailed modal */}
      <ChangelogModal
        isOpen={showChangelog}
        onClose={() => {
          setShowChangelog(false);
          handleDismissOnly();
        }}
        initialSelectedVersion={currentVersion}
      />
    </>
  );
};
