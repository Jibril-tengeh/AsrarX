import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Battery,
  BatteryCharging,
  BatteryWarning,
  Zap,
  Activity,
  Trash2,
  Check,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { BatteryLogEntry } from '../../hooks/useBatteryPerformance';

interface LowResourceBatteryModalProps {
  isOpen: boolean;
  onClose: () => void;
  batteryLevel: number | null;
  isCharging: boolean | null;
  drainRatePerHour: number | null;
  cpuLoadEstimate: 'low' | 'moderate' | 'high';
  longTasksCount: number;
  isLowResourceMode: boolean;
  batteryLogs: BatteryLogEntry[];
  onToggleLowResourceMode: () => void;
  onClearLogs: () => void;
  onSimulateDrain?: () => void;
}

export const LowResourceBatteryModal: React.FC<LowResourceBatteryModalProps> = ({
  isOpen,
  onClose,
  batteryLevel,
  isCharging,
  drainRatePerHour,
  cpuLoadEstimate,
  longTasksCount,
  isLowResourceMode,
  batteryLogs,
  onToggleLowResourceMode,
  onClearLogs,
  onSimulateDrain,
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col my-auto"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isLowResourceMode
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {isCharging ? (
                  <BatteryCharging size={20} />
                ) : (batteryLevel !== null && batteryLevel <= 20) ? (
                  <BatteryWarning size={20} className="text-amber-500" />
                ) : (
                  <Battery size={20} />
                )}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <span>
                    {language === 'fr'
                      ? 'Moniteur Batterie & Performance'
                      : language === 'ha'
                      ? 'Kula da Batir & Aiki'
                      : 'Battery & Performance Monitor'}
                  </span>
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {language === 'fr'
                    ? 'Optimisation des ressources et autonomie'
                    : language === 'ha'
                    ? 'Adana batir da haɓaka aiki'
                    : 'Resource optimization & battery efficiency'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Low Resource Mode Toggle Card */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isLowResourceMode
                  ? 'border-emerald-500/50 bg-emerald-50/60 dark:bg-emerald-950/25 shadow-xs'
                  : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                      {language === 'fr'
                        ? 'Mode Basse Consommation'
                        : language === 'ha'
                        ? 'Yanayin Rage Amfani da Makamashi'
                        : 'Low Resource Mode'}
                    </span>
                    {isLowResourceMode ? (
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-emerald-600 text-white">
                        {language === 'fr' ? 'Actif' : 'Active'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {language === 'fr' ? 'Inactif' : 'Inactive'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {language === 'fr'
                      ? 'Désactive les animations lourdes, allège les flous et optimise la fréquence pour préserver l\'autonomie de votre appareil.'
                      : language === 'ha'
                      ? 'Yana dakatar da raye-raye masu nauyi don rage amfani da batir.'
                      : 'Suspends heavy animations, reduces blur filters, and cuts CPU draw to preserve battery life.'}
                  </p>
                </div>

                {/* Big switch */}
                <button
                  type="button"
                  onClick={onToggleLowResourceMode}
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer shrink-0 p-0.5 ${
                    isLowResourceMode ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                  aria-label="Toggle Low Resource Mode"
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-xs transition-transform flex items-center justify-center text-[10px] ${
                      isLowResourceMode ? 'translate-x-5 text-emerald-600' : 'translate-x-0 text-gray-400'
                    }`}
                  >
                    {isLowResourceMode ? <Check size={11} className="stroke-[3]" /> : null}
                  </div>
                </button>
              </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* Battery Level */}
              <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-750 flex flex-col">
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {language === 'fr' ? 'Niveau Batterie' : language === 'ha' ? 'Matakin Batir' : 'Battery Level'}
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                    {batteryLevel !== null ? `${batteryLevel}%` : 'N/A'}
                  </span>
                  {isCharging && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      ⚡ {language === 'fr' ? 'Charge' : 'Charging'}
                    </span>
                  )}
                </div>
              </div>

              {/* Drain Rate */}
              <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-750 flex flex-col">
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {language === 'fr' ? 'Taux Décharge' : language === 'ha' ? 'Saurin Ƙarewa' : 'Drain Rate'}
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span
                    className={`text-lg sm:text-xl font-black ${
                      drainRatePerHour !== null && drainRatePerHour >= 18
                        ? 'text-amber-500'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {drainRatePerHour !== null ? `~${drainRatePerHour}%/h` : isCharging ? '0 %/h' : 'Stable'}
                  </span>
                </div>
              </div>

              {/* CPU Load Impact */}
              <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-750 flex flex-col col-span-2 sm:col-span-1">
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {language === 'fr' ? 'Impact CPU' : language === 'ha' ? 'Nauyin CPU' : 'CPU Load'}
                </span>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                      cpuLoadEstimate === 'high'
                        ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                        : cpuLoadEstimate === 'moderate'
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                        : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {cpuLoadEstimate === 'high'
                      ? language === 'fr' ? 'Élevé' : 'High'
                      : cpuLoadEstimate === 'moderate'
                      ? language === 'fr' ? 'Moyen' : 'Moderate'
                      : language === 'fr' ? 'Faible' : 'Low'}
                  </span>
                  <span className="text-[10px] text-gray-400">({longTasksCount} tâches)</span>
                </div>
              </div>
            </div>

            {/* Local Logs Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300">
                  <Activity size={14} className="text-emerald-500" />
                  <span>
                    {language === 'fr'
                      ? 'Historique local de consommation'
                      : language === 'ha'
                      ? 'Tarihin amfani na kusa'
                      : 'Local Battery & Performance Logs'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-normal">({batteryLogs.length})</span>
                </div>

                {batteryLogs.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearLogs}
                    className="text-[11px] text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>{language === 'fr' ? 'Effacer' : 'Clear'}</span>
                  </button>
                )}
              </div>

              {batteryLogs.length === 0 ? (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 text-center text-[11px] text-gray-500">
                  {language === 'fr'
                    ? 'Aucun événement enregistré pour le moment. Les mesures sont enregistrées localement.'
                    : 'No local events logged yet. Measurements are recorded automatically.'}
                </div>
              ) : (
                <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 text-xs">
                  {batteryLogs.slice(0, 15).map((log) => {
                    const timeStr = new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    });

                    return (
                      <div
                        key={log.id}
                        className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-150 dark:border-gray-750 flex items-center justify-between gap-2 text-[11px]"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900 dark:text-white">
                              {log.batteryLevel}% {log.isCharging ? '⚡' : '🔋'}
                            </span>
                            {log.drainRatePerHour !== null && log.drainRatePerHour > 0 && (
                              <span className="text-gray-400 text-[10px]">
                                (~{log.drainRatePerHour}%/h)
                              </span>
                            )}
                            <span className="text-[10px] text-gray-400">· {timeStr}</span>
                          </div>
                          {log.notes && (
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                              {log.notes}
                            </p>
                          )}
                        </div>

                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                            log.eventType === 'high_drain_detected' || log.eventType === 'drain_spike'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                              : log.eventType === 'mode_toggled'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {log.eventType}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Simulation / Debug tool for testing */}
            {onSimulateDrain && (
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">
                  {language === 'fr' ? 'Tester la détection de décharge' : 'Test discharge alert trigger'}
                </span>
                <button
                  type="button"
                  onClick={onSimulateDrain}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold cursor-pointer"
                >
                  {language === 'fr' ? 'Simuler Alerte' : 'Simulate Alert'}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex items-center justify-between">
            <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>{language === 'fr' ? 'Données privées stockées localement' : 'Private data stored locally'}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {language === 'fr' ? 'Fermer' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/**
 * High Drain Alert Banner shown at the top of the dashboard when high battery consumption is detected
 */
export const HighDrainAlertBanner: React.FC<{
  batteryLevel: number | null;
  drainRatePerHour: number | null;
  onEnableLowResourceMode: () => void;
  onOpenDetails: () => void;
  onDismiss: () => void;
}> = ({
  batteryLevel,
  drainRatePerHour,
  onEnableLowResourceMode,
  onOpenDetails,
  onDismiss,
}) => {
  const { language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-3 p-3 sm:p-3.5 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <BatteryWarning size={18} />
        </div>
        <div>
          <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 flex-wrap">
            <span>
              {language === 'fr'
                ? 'Consommation de batterie élevée détectée'
                : language === 'ha'
                ? 'An gano saurin ƙarewar batir'
                : 'High Battery Consumption Detected'}
            </span>
            {batteryLevel !== null && (
              <span className="text-[10px] font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded-md">
                {batteryLevel}%
                {drainRatePerHour ? ` (~${drainRatePerHour}%/h)` : ''}
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">
            {language === 'fr'
              ? 'Activez le Mode Basse Consommation pour soulager le processeur et prolonger l\'autonomie.'
              : language === 'ha'
              ? 'Kunna Yanayin Rage Amfani da Makamashi don kare batir.'
              : 'Switch on Low Resource Mode to minimize animations and extend battery life.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          type="button"
          onClick={onOpenDetails}
          className="px-2.5 py-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-amber-500/10 transition-colors cursor-pointer"
        >
          {language === 'fr' ? 'Détails' : 'Details'}
        </button>

        <button
          type="button"
          onClick={onEnableLowResourceMode}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
        >
          <Zap size={13} />
          <span>
            {language === 'fr'
              ? 'Activer Mode Éco'
              : language === 'ha'
              ? 'Kunna Yanayin Éco'
              : 'Enable Eco Mode'}
          </span>
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title={language === 'fr' ? 'Ignorer' : 'Dismiss'}
        >
          <X size={15} />
        </button>
      </div>
    </motion.div>
  );
};
