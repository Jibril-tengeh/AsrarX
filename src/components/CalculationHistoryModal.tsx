import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  History,
  X,
  Search,
  Star,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Download,
  Upload,
  Calculator,
  Grid,
  Flame,
  Heart,
  Layers,
  Sparkles,
  Filter,
  CheckCircle2,
  FileText
} from 'lucide-react';
import {
  CalculationHistoryItem,
  getCalculationHistory,
  deleteCalculationFromHistory,
  toggleFavoriteCalculation,
  clearAllCalculationHistory,
  saveCalculationToHistory
} from '../utils/calculationHistory';

interface CalculationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolFilter?: string; // Optional filter e.g. 'abjad', 'khatim', 'elemental'
  onSelectCalculation?: (item: CalculationHistoryItem) => void;
}

export const CalculationHistoryModal: React.FC<CalculationHistoryModalProps> = ({
  isOpen,
  onClose,
  toolFilter,
  onSelectCalculation
}) => {
  const { language } = useLanguage();
  const [historyItems, setHistoryItems] = useState<CalculationHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(toolFilter || 'all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadHistory = () => {
    const items = getCalculationHistory();
    setHistoryItems(items);
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
      if (toolFilter) setActiveCategory(toolFilter);
    }
  }, [isOpen, toolFilter]);

  useEffect(() => {
    const handleUpdate = () => {
      loadHistory();
    };
    window.addEventListener('calculation_history_updated', handleUpdate);
    return () => {
      window.removeEventListener('calculation_history_updated', handleUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopy = (item: CalculationHistoryItem) => {
    const content = `${item.toolName} - ${item.title}\n${item.summary}\nDate: ${new Date(item.timestamp).toLocaleString()}`;
    navigator.clipboard.writeText(content);
    setCopiedId(item.id);
    showToast(language === 'ha' ? 'An kwafay!' : language === 'en' ? 'Copied to clipboard!' : 'Copié dans le presse-papier !');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteCalculationFromHistory(id);
    setHistoryItems(updated);
    showToast(language === 'ha' ? 'An goge!' : language === 'en' ? 'Calculation deleted!' : 'Calcul supprimé !');
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleFavoriteCalculation(id);
    setHistoryItems(updated);
  };

  const handleClearAll = () => {
    clearAllCalculationHistory();
    setHistoryItems([]);
    setShowClearConfirm(false);
    showToast(language === 'ha' ? 'An goge duka tarihi!' : language === 'en' ? 'History cleared!' : 'Historique effacé !');
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(historyItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `asrarhub_calculation_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(language === 'ha' ? 'An sauke tarihi!' : language === 'en' ? 'History exported!' : 'Historique exporté !');
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: any) => {
              if (item.toolId && item.title && item.summary) {
                saveCalculationToHistory({
                  toolId: item.toolId,
                  toolName: item.toolName || 'Calcul',
                  title: item.title,
                  summary: item.summary,
                  details: item.details || {},
                  tags: item.tags || []
                });
              }
            });
            loadHistory();
            showToast(language === 'ha' ? 'An shigar da tarihi!' : language === 'en' ? 'History imported successfully!' : 'Historique importé avec succès !');
          }
        } catch (err) {
          showToast(language === 'ha' ? 'Kuskuren fayil!' : language === 'en' ? 'Invalid JSON file!' : 'Fichier JSON invalide !');
        }
      };
    }
  };

  const categories = [
    { id: 'all', labelFr: 'Tous', labelEn: 'All', labelHa: 'Duka', icon: Filter },
    { id: 'favorites', labelFr: 'Favoris', labelEn: 'Favorites', labelHa: 'Masu Muhimmanci', icon: Star },
    { id: 'abjad', labelFr: 'Abjad', labelEn: 'Abjad', labelHa: 'Abjadi', icon: Calculator },
    { id: 'khatim', labelFr: 'Khatim & Wafq', labelEn: 'Khatim & Wafq', labelHa: 'Khatimi', icon: Grid },
    { id: 'elemental', labelFr: '4 Éléments', labelEn: '4 Elements', labelHa: 'Elementi 4', icon: Flame },
    { id: 'compatibility', labelFr: 'Compatibilité', labelEn: 'Compatibility', labelHa: 'Dacewa', icon: Heart },
    { id: 'jafar', labelFr: 'Ilm Jafar & Taksir', labelEn: 'Jafar & Taksir', labelHa: 'Ja\'fari', icon: Layers },
    { id: 'zakat_faraid', labelFr: 'Zakat & Faraid', labelEn: 'Zakat & Faraid', labelHa: 'Zakkat da Gado', icon: FileText },
  ];

  const filteredItems = historyItems.filter((item) => {
    // Category filter
    if (activeCategory === 'favorites' && !item.favorite) return false;
    if (activeCategory !== 'all' && activeCategory !== 'favorites') {
      if (activeCategory === 'zakat_faraid') {
        if (item.toolId !== 'zakat' && item.toolId !== 'faraid') return false;
      } else if (item.toolId !== activeCategory) {
        return false;
      }
    }

    // Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.toolName.toLowerCase().includes(q) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );
  });

  const getToolIcon = (toolId: string) => {
    switch (toolId) {
      case 'abjad': return Calculator;
      case 'khatim': return Grid;
      case 'elemental': return Flame;
      case 'compatibility': return Heart;
      case 'jafar':
      case 'taksir': return Layers;
      default: return Sparkles;
    }
  };

  const getToolBadgeColor = (toolId: string) => {
    switch (toolId) {
      case 'abjad': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'khatim': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'elemental': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'compatibility': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'jafar': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      default: return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 z-[130] px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 border border-emerald-400/30"
          >
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <History size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{language === 'ha' ? 'Tarihin Hisabi da Bincike' : language === 'en' ? 'Calculation & Search History' : 'Historique des Calculs & Recherches'}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                  {historyItems.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'ha'
                  ? 'Kayi amfani ko adana hisabin da kayi a baya cikin sauki'
                  : language === 'en'
                  ? 'Review, restore, or export your past calculations'
                  : 'Retrouvez, réutilisez ou exportez vos calculs et recherches passées'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'ha'
                    ? 'Bincika tarihi (suna, lamba, kalma)...'
                    : language === 'en'
                    ? 'Search history (name, number, keyword)...'
                    : 'Rechercher un calcul (nom, nombre, mot-clé)...'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Export / Import Buttons */}
            <button
              onClick={handleExportJSON}
              title={language === 'en' ? 'Export History' : 'Exporter l\'historique'}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <Download size={16} />
            </button>

            <label
              title={language === 'en' ? 'Import History' : 'Importer un historique'}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <Upload size={16} />
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            {historyItems.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                title={language === 'en' ? 'Clear History' : 'Effacer l\'historique'}
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              const label = language === 'ha' ? cat.labelHa : language === 'en' ? cat.labelEn : cat.labelFr;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clear Confirmation Banner */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-rose-950/60 border-b border-rose-800/80 p-4 flex items-center justify-between text-xs sm:text-sm text-rose-200"
            >
              <span>
                {language === 'ha'
                  ? 'Shin kun tabbata kuna son goge duk tarihin hisabi?'
                  : language === 'en'
                  ? 'Are you sure you want to clear all calculation history?'
                  : 'Voulez-vous vraiment effacer tout votre historique de calcul ?'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors cursor-pointer"
                >
                  {language === 'ha' ? 'E, goge duka' : language === 'en' ? 'Yes, clear' : 'Oui, effacer'}
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-bold transition-colors cursor-pointer"
                >
                  {language === 'ha' ? 'A\'a' : language === 'en' ? 'Cancel' : 'Annuler'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-800/50 flex items-center justify-center text-slate-600 border border-slate-700/50">
                <History size={32} />
              </div>
              <p className="text-sm font-medium">
                {searchQuery
                  ? language === 'ha'
                    ? 'Babu hisabi da ya dace da bincikenku.'
                    : language === 'en'
                    ? 'No calculation found matching your search.'
                    : 'Aucun calcul ne correspond à votre recherche.'
                  : language === 'ha'
                  ? 'Babu tarihin hisabi tukunna. Yi amfani da na\'urori domin adanawa.'
                  : language === 'en'
                  ? 'No calculation history saved yet. Perform calculations to build history.'
                  : 'Aucun historique de calcul pour le moment. Effectuez des calculs pour les retrouver ici.'}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const ToolIcon = getToolIcon(item.toolId);
              const badgeClass = getToolBadgeColor(item.toolId);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectCalculation && onSelectCalculation(item)}
                  className={`p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-md ${
                    onSelectCalculation ? 'cursor-pointer hover:bg-slate-950' : ''
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${badgeClass}`}>
                        <ToolIcon size={12} />
                        <span>{item.toolName}</span>
                      </span>

                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(item.timestamp).toLocaleString([], {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-400 font-medium line-clamp-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800/50 font-mono">
                      {item.summary}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60 w-full sm:w-auto justify-end">
                    {onSelectCalculation && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCalculation(item);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-1 transition-colors border border-emerald-500/20 cursor-pointer"
                        title={language === 'en' ? 'Load this calculation' : 'Charger ce calcul'}
                      >
                        <RotateCcw size={14} />
                        <span>{language === 'ha' ? 'Amfani' : language === 'en' ? 'Restore' : 'Recharger'}</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => handleToggleFavorite(item.id, e)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        item.favorite
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-900 text-slate-400 hover:text-amber-400 border border-slate-800'
                      }`}
                      title={language === 'en' ? 'Favorite' : 'Mettre en favori'}
                    >
                      <Star size={16} className={item.favorite ? 'fill-amber-400' : ''} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item);
                      }}
                      className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                      title={language === 'en' ? 'Copy summary' : 'Copier le résumé'}
                    >
                      {copiedId === item.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors cursor-pointer"
                      title={language === 'en' ? 'Delete' : 'Supprimer'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};
