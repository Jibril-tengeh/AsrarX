import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HardDriveDownload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Wifi,
  WifiOff,
  Smartphone,
  Trash2,
  X,
  Database,
  Calculator,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  Download,
  Share2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import {
  saveEntireAppForOffline,
  getOfflineAppStatus,
  clearAllOfflineAppCache,
  promptPwaInstall,
  isPwaInstallAvailable,
  isRunningStandalone,
  OfflineAppStatus
} from '../utils/offlineAppManager';

interface OfflineAppSaverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineAppSaverModal: React.FC<OfflineAppSaverModalProps> = ({
  isOpen,
  onClose
}) => {
  const { language, t } = useLanguage();
  const { isOffline, isOnline } = useNetworkStatus();

  const [status, setStatus] = useState<OfflineAppStatus | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepMessage, setStepMessage] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [pwaCanInstall, setPwaCanInstall] = useState(false);
  const [simulatedOffline, setSimulatedOffline] = useState(false);

  const loadStatus = async () => {
    const s = await getOfflineAppStatus();
    setStatus(s);
    setIsPwaInstalled(s.isPwaInstalled);
    setPwaCanInstall(isPwaInstallAvailable());
  };

  useEffect(() => {
    if (isOpen) {
      loadStatus();
      setSaveSuccess(false);
      setProgress(0);
      setStepMessage('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handlePwaAvail = () => setPwaCanInstall(true);
    const handlePwaInst = () => {
      setIsPwaInstalled(true);
      setPwaCanInstall(false);
    };
    window.addEventListener('asrarhub_pwa_install_available', handlePwaAvail);
    window.addEventListener('asrarhub_pwa_installed', handlePwaInst);
    return () => {
      window.removeEventListener('asrarhub_pwa_install_available', handlePwaAvail);
      window.removeEventListener('asrarhub_pwa_installed', handlePwaInst);
    };
  }, []);

  const handleStartSave = async () => {
    setIsSaving(true);
    setProgress(0);
    setSaveSuccess(false);

    const result = await saveEntireAppForOffline((prog, msg) => {
      setProgress(prog);
      setStepMessage(msg);
    });

    setIsSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      await loadStatus();
    }
  };

  const handleClearCache = async () => {
    if (!window.confirm(
      language === 'en'
        ? 'Are you sure you want to clear the offline cache? Downloaded tools and secrets will need to be re-downloaded.'
        : language === 'ha'
        ? 'Shin kana tabbatar kana son goge bayanan offline?'
        : 'Êtes-vous sûr de vouloir vider le cache hors-ligne ? Les outils et secrets devront être retéléchargés.'
    )) {
      return;
    }

    setIsClearing(true);
    await clearAllOfflineAppCache();
    await loadStatus();
    setIsClearing(false);
    setSaveSuccess(false);
  };

  const handleInstallPwa = async () => {
    const installed = await promptPwaInstall();
    if (installed) {
      setIsPwaInstalled(true);
      setPwaCanInstall(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white dark:bg-gray-850 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700/80 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                <HardDriveDownload size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                  {language === 'en'
                    ? 'Offline Mode & Full App Save'
                    : language === 'ha'
                    ? 'Ajiye Aikace-aikace don Offline'
                    : 'Sauvegarder l\'App Hors-Ligne'}
                </h3>
                <p className="text-xs text-emerald-100 mt-0.5 font-medium">
                  {language === 'en'
                    ? '100% standalone offline access for all spiritual tools'
                    : language === 'ha'
                    ? 'Yi amfani da dukkan asrar da kayan aiki ba tare da intanet ba'
                    : 'Accès 100% autonome sans connexion internet'}
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* Status Card */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-150 dark:border-gray-700/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${status?.isFullySaved ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    {status?.isFullySaved
                      ? (language === 'en' ? 'App Ready Offline' : language === 'ha' ? 'A shirye yake offline' : 'Application Sauvegardée')
                      : (language === 'en' ? 'Not fully cached' : language === 'ha' ? 'Ba a gama ajiye komai ba' : 'Non sauvegardée')}
                  </span>
                </div>
                {status?.savedAt && (
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {new Date(status.savedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                  </span>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/50 text-center">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-center text-emerald-500 mb-1">
                    <Calculator size={15} />
                  </div>
                  <p className="text-xs font-black text-gray-900 dark:text-white">
                    {status?.cachedToolsCount || 0}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {language === 'en' ? 'Tools' : 'Outils'}
                  </p>
                </div>

                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-center text-teal-500 mb-1">
                    <BookOpen size={15} />
                  </div>
                  <p className="text-xs font-black text-gray-900 dark:text-white">
                    {status?.cachedArticlesCount || 0}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {language === 'en' ? 'Secrets' : 'Secrets'}
                  </p>
                </div>

                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-center text-blue-500 mb-1">
                    <Database size={15} />
                  </div>
                  <p className="text-xs font-black text-gray-900 dark:text-white">
                    {status?.storageUsageMB || '0'} MB
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {language === 'en' ? 'Disk' : 'Disque'}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar when Saving */}
            {isSaving && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  <span className="flex items-center gap-2">
                    <RefreshCw size={14} className="animate-spin text-emerald-600 dark:text-emerald-400" />
                    Téléchargement & Cache en cours...
                  </span>
                  <span>{progress}%</span>
                </div>

                {/* Progress track */}
                <div className="w-full h-2.5 bg-emerald-200/50 dark:bg-emerald-900/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>

                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 truncate font-mono">
                  {stepMessage}
                </p>
              </motion.div>
            )}

            {/* Success Celebration Message */}
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-emerald-100/80 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-3"
              >
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    {language === 'en'
                      ? 'AsrarHub is ready for 100% offline usage!'
                      : language === 'ha'
                      ? 'AsrarHub ya gama ajiye komai don offline!'
                      : 'AsrarHub est prêt pour une utilisation 100% hors-ligne !'}
                  </p>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-1">
                    {language === 'en'
                      ? 'You can now use calculators, Abjad, Wafq, Asma al-Husna and secrets anywhere, even without internet or network signal.'
                      : language === 'ha'
                      ? 'Kuna iya amfani da Abjad, Wafq, Sunayen Allah da dukkan asrar a koina ba tare da intanet ba.'
                      : 'Vous pouvez désormais utiliser les calculateurs Abjad, Wafq, 99 Noms et vos secrets partout, même dans le désert ou en mode avion.'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Primary Action Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleStartSave}
                disabled={isSaving}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Sauvegarde en cours ({progress}%)...</span>
                  </>
                ) : (
                  <>
                    <HardDriveDownload size={18} />
                    <span>
                      {status?.isFullySaved
                        ? (language === 'en' ? 'Update Offline Pack' : 'Mettre à jour le pack hors-ligne')
                        : (language === 'en' ? 'Download App for Offline Use' : 'Télécharger l\'application pour utilisation hors-ligne')}
                    </span>
                  </>
                )}
              </button>

              {/* Install PWA Prompt Button */}
              {pwaCanInstall && !isPwaInstalled && (
                <button
                  type="button"
                  onClick={handleInstallPwa}
                  className="w-full py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
                >
                  <Smartphone size={16} className="text-emerald-500" />
                  <span>
                    {language === 'en'
                      ? 'Install on Home Screen (PWA App)'
                      : 'Installer sur l\'écran d\'accueil (App PWA)'}
                  </span>
                </button>
              )}
            </div>

            {/* What is cached offline guide */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                {language === 'en' ? 'What is included in the offline pack?' : 'Ce qui est inclus dans le pack hors-ligne :'}
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1.5 pl-5 list-disc leading-relaxed">
                <li>
                  <strong className="text-gray-700 dark:text-gray-200">Tous les outils spirituels :</strong> Calculateur Abjad Oriental & Maghrébin, 99 Noms d'Allah, Générateur de Wafq, Istikhara, Tasbih digital, Heures planétaires.
                </li>
                <li>
                  <strong className="text-gray-700 dark:text-gray-200">Secrets & Articles :</strong> Vos articles favoris, versets de protection Ruqyah et invocations sauvegardées.
                </li>
                <li>
                  <strong className="text-gray-700 dark:text-gray-200">Interface & Moteur PWA :</strong> Chargement instantané sans temps de latence réseau.
                </li>
              </ul>
            </div>

            {/* Clear Cache Button */}
            {status?.isFullySaved && (
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-gray-400 dark:text-gray-500">
                  Espace disque : ~{status?.storageUsageMB} MB
                </span>
                <button
                  type="button"
                  onClick={handleClearCache}
                  disabled={isClearing || isSaving}
                  className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  <span>{isClearing ? 'Nettoyage...' : 'Vider le cache hors-ligne'}</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
