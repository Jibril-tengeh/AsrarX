import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, DownloadCloud, RefreshCw, CheckCircle2, AlertTriangle, 
  Search, CheckSquare, Square, Sparkles, HardDrive, ShieldCheck, 
  ExternalLink, Layers, ArrowUpRight, Cpu, Wrench, Check, Clock
} from 'lucide-react';
import { 
  checkToolsIntegrity, 
  repairMissingTools, 
  downloadBulkTools, 
  formatStorageBytes,
  ToolsIntegrityReport, 
  ToolIntegrityItem 
} from '../../utils/offlineToolsVault';
import { tools as ALL_REGISTERED_TOOLS } from '../../data/tools';
import { useLanguage } from '../../contexts/LanguageContext';

interface AdminToolsHealthManagerProps {
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminToolsHealthManager: React.FC<AdminToolsHealthManagerProps> = ({
  onNotify
}) => {
  const { language } = useLanguage();
  const [report, setReport] = useState<ToolsIntegrityReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'installed' | 'missing' | 'outdated'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessingBulk, setIsProcessingBulk] = useState<boolean>(false);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number; title: string }>({
    current: 0,
    total: 0,
    title: '',
  });

  const notify = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (onNotify) onNotify(msg, type);
  }, [onNotify]);

  const loadIntegrity = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await checkToolsIntegrity();
      setReport(res);
    } catch (e) {
      console.error('Error loading tools integrity:', e);
      notify('Erreur lors du chargement de l\'état des outils', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadIntegrity();
  }, [loadIntegrity]);

  // Handle Select All / Missing / None
  const handleSelectAll = () => {
    if (!report) return;
    setSelectedIds(report.items.map(i => i.id));
  };

  const handleSelectMissingOnly = () => {
    if (!report) return;
    setSelectedIds(report.missingIds);
  };

  const handleSelectOutdatedOnly = () => {
    if (!report) return;
    setSelectedIds(report.outdatedIds);
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Bulk download selected tools
  const handleDownloadSelected = async () => {
    if (selectedIds.length === 0 || isProcessingBulk) return;
    setIsProcessingBulk(true);
    setBulkProgress({ current: 0, total: selectedIds.length, title: 'Initialisation...' });

    try {
      const count = await downloadBulkTools(selectedIds, (current, total, title) => {
        setBulkProgress({ current, total, title });
      });
      notify(`Succès : ${count} outil(s) téléchargé(s) et mis en cache avec succès !`, 'success');
      await loadIntegrity();
      setSelectedIds([]);
    } catch (err: any) {
      notify(`Erreur lors du téléchargement groupé : ${err?.message || err}`, 'error');
    } finally {
      setIsProcessingBulk(false);
    }
  };

  // 1-Click Repair all missing tools
  const handleRepairAllMissing = async () => {
    if (isProcessingBulk) return;
    setIsProcessingBulk(true);
    setBulkProgress({ current: 0, total: report?.totalMissing || 0, title: 'Téléchargement des outils manquants...' });

    try {
      const res = await repairMissingTools((current, total, title) => {
        setBulkProgress({ current, total, title });
      });
      if (res.success) {
        notify(`Réparation terminée : ${res.repairedCount} outil(s) manquant(s) ont été installés et inclus !`, 'success');
      } else {
        notify('Une erreur est survenue lors de la réparation.', 'error');
      }
      await loadIntegrity();
      setSelectedIds([]);
    } catch (err: any) {
      notify(`Erreur de réparation : ${err?.message || err}`, 'error');
    } finally {
      setIsProcessingBulk(false);
    }
  };

  // Force full sync & download of all tools
  const handleForceDownloadAll = async () => {
    if (isProcessingBulk || !report) return;
    const allIds = report.items.map(t => t.id);
    setIsProcessingBulk(true);
    setBulkProgress({ current: 0, total: allIds.length, title: 'Téléchargement de tous les outils...' });

    try {
      const count = await downloadBulkTools(allIds, (current, total, title) => {
        setBulkProgress({ current, total, title });
      });
      notify(`Intégration totale : Tous les ${count} outils spirituels sont à jour et inclus !`, 'success');
      await loadIntegrity();
      setSelectedIds([]);
    } catch (err: any) {
      notify(`Erreur de mise à jour totale : ${err?.message || err}`, 'error');
    } finally {
      setIsProcessingBulk(false);
    }
  };

  // Filter items
  const filteredItems = (report?.items || []).filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.path.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === 'installed') return item.isInstalled;
    if (filterMode === 'missing') return !item.isInstalled;
    if (filterMode === 'outdated') return item.isOutdated;
    return true;
  });

  const totalCalculatedDiskBytes = (report?.items || []).reduce((acc, curr) => acc + (curr.isInstalled ? curr.sizeBytes : 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Health Summary Banner */}
      <div className="bg-slate-900 dark:bg-slate-950 border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Cpu size={14} className="text-amber-400" />
              <span>Diagnostic & Intégrité des Outils Hors-Ligne</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Gestionnaire de Téléchargement & Santé des Outils
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Vérifiez en temps réel la présence de chaque outil dans la mémoire locale (IndexedDB / Cache PWA) et téléchargez en masse les modules manquants ou obsolètes pour garantir un fonctionnement à 100%.
            </p>
          </div>

          {/* Health Gauge & Progress */}
          <div className="flex items-center gap-4 bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl shrink-0 backdrop-blur-xs">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${(report?.healthPercentage || 0) === 100 ? 'text-emerald-400' : 'text-amber-400'} transition-all duration-700`}
                  strokeDasharray={`${report?.healthPercentage || 0}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm sm:text-base font-black text-white">{report?.healthPercentage ?? 0}%</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Santé</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300 font-medium">Installés :</span>
                <strong className="text-white font-bold">{report?.totalInstalled ?? 0} / {report?.totalRegistered ?? ALL_REGISTERED_TOOLS.length}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${(report?.totalMissing ?? 0) > 0 ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-slate-300 font-medium">Manquants :</span>
                <strong className={`${(report?.totalMissing ?? 0) > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>{report?.totalMissing ?? 0}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span className="text-slate-300 font-medium">Stockage :</span>
                <strong className="text-blue-300 font-bold">{formatStorageBytes(totalCalculatedDiskBytes)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Action Buttons Row */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Repair Button */}
            {(report?.totalMissing ?? 0) > 0 && (
              <button
                type="button"
                disabled={isProcessingBulk}
                onClick={handleRepairAllMissing}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-900/30 flex items-center gap-2 transition-all cursor-pointer animate-bounce"
              >
                <Wrench size={16} />
                <span>Télécharger tous les {report?.totalMissing} manquants</span>
              </button>
            )}

            {/* Force Full Download Button */}
            <button
              type="button"
              disabled={isProcessingBulk}
              onClick={handleForceDownloadAll}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <DownloadCloud size={16} />
              <span>Télécharger & synchroniser tous les outils ({report?.totalRegistered || ALL_REGISTERED_TOOLS.length})</span>
            </button>

            {/* Refresh Scan Button */}
            <button
              type="button"
              disabled={isLoading || isProcessingBulk}
              onClick={loadIntegrity}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin text-emerald-400' : ''} />
              <span>Vérifier intégrité</span>
            </button>
          </div>

          {/* Selected Action */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                {selectedIds.length} sélectionné(s)
              </span>
              <button
                type="button"
                disabled={isProcessingBulk}
                onClick={handleDownloadSelected}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
              >
                <Download size={15} />
                <span>Télécharger la sélection</span>
              </button>
            </div>
          )}
        </div>

        {/* Active Bulk Progress Bar */}
        {isProcessingBulk && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-slate-800 space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-300 flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin text-amber-400" />
                {bulkProgress.title} ({bulkProgress.current} / {bulkProgress.total})
              </span>
              <span className="text-amber-400 font-mono">
                {bulkProgress.total > 0 ? Math.round((bulkProgress.current / bulkProgress.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400"
                style={{
                  width: `${bulkProgress.total > 0 ? (bulkProgress.current / bulkProgress.total) * 100 : 0}%`,
                }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Filter and Table Tools Container */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, ID ou chemin..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Filter Mode Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-slate-900 text-white dark:bg-emerald-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              Tous ({report?.totalRegistered ?? 0})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('installed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'installed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              Installés ({report?.totalInstalled ?? 0})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('missing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'missing'
                  ? 'bg-amber-500 text-slate-950 font-extrabold'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              Manquants ({report?.totalMissing ?? 0})
            </button>
            {report && report.totalOutdated > 0 && (
              <button
                type="button"
                onClick={() => setFilterMode('outdated')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterMode === 'outdated'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                Obsolètes ({report.totalOutdated})
              </button>
            )}
          </div>
        </div>

        {/* Selection Helpers */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
            >
              Tout sélectionner
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={handleSelectMissingOnly}
              className="text-amber-600 dark:text-amber-400 hover:underline font-bold"
            >
              Sélectionner manquants
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="text-gray-500 hover:underline"
            >
              Désélectionner
            </button>
          </div>
          <div>
            Affichage de <strong>{filteredItems.length}</strong> outil(s)
          </div>
        </div>

        {/* Table / List */}
        <div className="divide-y divide-gray-100 dark:divide-gray-700/60 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-xs">
              Aucun outil ne correspond aux critères sélectionnés.
            </div>
          ) : (
            filteredItems.map((item, itemIdx) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id ? `tool-health-${item.id}-${itemIdx}` : `tool-health-${itemIdx}`}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 transition-colors gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                >
                  {/* Left: Checkbox + Title & Details */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => handleToggleSelect(item.id)}
                      className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 shrink-0 cursor-pointer p-0.5"
                    >
                      {isSelected ? (
                        <CheckSquare size={18} className="text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          {item.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 flex-wrap">
                        <span className="font-mono">{item.path}</span>
                        <span>•</span>
                        <span>{formatStorageBytes(item.sizeBytes)}</span>
                        {item.savedAt && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[10px]">
                              <Clock size={11} />
                              {new Date(item.savedAt).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Pill & Action Button */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {item.isInstalled ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                        <CheckCircle2 size={12} />
                        <span>Installé</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-bold">
                        <AlertTriangle size={12} />
                        <span>Manquant</span>
                      </span>
                    )}

                    {/* Single Download/Update Button */}
                    <button
                      type="button"
                      disabled={isProcessingBulk}
                      onClick={() => {
                        setSelectedIds([item.id]);
                        downloadBulkTools([item.id]).then(() => {
                          notify(`Outil ${item.title} mis en cache avec succès !`, 'success');
                          loadIntegrity();
                        });
                      }}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-emerald-100 dark:bg-gray-700 dark:hover:bg-emerald-900/50 text-gray-700 hover:text-emerald-700 dark:text-gray-300 dark:hover:text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
                      title="Télécharger / Mettre à jour cet outil"
                    >
                      <Download size={14} />
                    </button>

                    {/* Test link */}
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 hover:text-gray-800 dark:text-gray-300 text-xs transition-colors"
                      title="Tester et ouvrir l'outil"
                    >
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
