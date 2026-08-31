import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HardDrive, 
  HardDriveDownload,
  Database, 
  BookOpen, 
  Sparkles, 
  Trash2, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  LayoutGrid, 
  List as ListIcon, 
  Plus, 
  AlertCircle, 
  Wifi, 
  WifiOff, 
  Eye, 
  Calculator, 
  Clock, 
  Moon, 
  Compass, 
  ListTodo, 
  Activity, 
  FolderCheck,
  Zap,
  Info
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { OfflineAppSaverModal } from './OfflineAppSaverModal';
import { 
  getAllOfflineSecrets, 
  removeSecretFromOfflineVault, 
  clearAllOfflineSecrets, 
  OfflineStoredSecret 
} from '../utils/secretOfflineVault';
import { 
  getAllOfflineTools, 
  removeToolFromOfflineVault, 
  saveToolToOfflineVault, 
  clearAllOfflineTools, 
  ensureDefaultOfflineTools, 
  formatStorageBytes, 
  DEFAULT_OFFLINE_TOOLS, 
  OfflineStoredTool 
} from '../utils/offlineToolsVault';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface OfflineDashboardSectionProps {
  onItemSelect?: (item: any) => void;
  className?: string;
  defaultTab?: 'all' | 'articles' | 'tools';
}

const DynamicLucideIcon: React.FC<{ name?: string; className?: string; size?: number }> = ({ 
  name = 'Sparkles', 
  className = '', 
  size = 18 
}) => {
  const IconComp = (Icons as any)[name] || Icons.Sparkles;
  return <IconComp className={className} size={size} />;
};

export const OfflineDashboardSection: React.FC<OfflineDashboardSectionProps> = ({
  className = '',
  defaultTab = 'all'
}) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { isOffline, isOnline } = useNetworkStatus();

  const [articles, setArticles] = useState<OfflineStoredSecret[]>([]);
  const [tools, setTools] = useState<OfflineStoredTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'articles' | 'tools'>(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [isPreloadingTools, setIsPreloadingTools] = useState(false);
  const [isSaverModalOpen, setIsSaverModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadOfflineContent = useCallback(async () => {
    setLoading(true);
    try {
      const [storedArticles, storedTools] = await Promise.all([
        getAllOfflineSecrets(),
        getAllOfflineTools()
      ]);

      // If tools vault is completely empty, initialize default offline tools
      let finalTools = storedTools;
      if (storedTools.length === 0) {
        finalTools = await ensureDefaultOfflineTools();
      }

      setArticles(storedArticles);
      setTools(finalTools);
    } catch (e) {
      console.warn('[OfflineDashboardSection] Error loading offline content:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOfflineContent();

    const handleSync = () => {
      loadOfflineContent();
    };

    window.addEventListener('asrarhub_offline_secrets_sync', handleSync);
    window.addEventListener('asrarhub_offline_content_sync', handleSync);
    return () => {
      window.removeEventListener('asrarhub_offline_secrets_sync', handleSync);
      window.removeEventListener('asrarhub_offline_content_sync', handleSync);
    };
  }, [loadOfflineContent]);

  // Calculate total IndexedDB storage size
  const totalArticlesBytes = articles.reduce((acc, a) => acc + (a.sizeBytes || 12000), 0);
  const totalToolsBytes = tools.reduce((acc, t) => acc + (t.sizeBytes || 18000), 0);
  const totalStorageBytes = totalArticlesBytes + totalToolsBytes;

  const handleRemoveArticle = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeSecretFromOfflineVault(id);
      setArticles(prev => prev.filter(a => a.id !== id));
      showToast(language === 'fr' ? 'Article retiré de la mémoire locale' : 'Article removed from offline storage');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveTool = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeToolFromOfflineVault(id);
      setTools(prev => prev.filter(t => t.id !== id));
      showToast(language === 'fr' ? 'Outil retiré du cache hors-ligne' : 'Tool removed from offline cache');
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      await Promise.all([
        clearAllOfflineSecrets(),
        clearAllOfflineTools()
      ]);
      setArticles([]);
      setTools([]);
      setConfirmClearOpen(false);
      showToast(language === 'fr' ? 'Mémoire locale vidée avec succès' : 'Offline storage cleared successfully');
    } catch (e) {
      console.error(e);
    }
  };

  const handlePreloadAllDefaultTools = async () => {
    setIsPreloadingTools(true);
    try {
      for (const tool of DEFAULT_OFFLINE_TOOLS) {
        await saveToolToOfflineVault(tool);
      }
      const updated = await getAllOfflineTools();
      setTools(updated);
      showToast(language === 'fr' ? 'Outils essentiels synchronisés sur votre appareil !' : 'Essential tools cached locally on your device!');
    } catch (e) {
      console.error(e);
    } finally {
      setIsPreloadingTools(false);
    }
  };

  // Filter items based on activeTab and searchQuery
  const queryLower = searchQuery.trim().toLowerCase();

  const filteredArticles = articles.filter(a => {
    if (!queryLower) return true;
    const title = (a[`title_${language}`] || a.title_fr || a.title || '').toLowerCase();
    const hook = (a[`hook_${language}`] || a.hook_fr || a.hook || '').toLowerCase();
    const cat = (a.category || '').toLowerCase();
    return title.includes(queryLower) || hook.includes(queryLower) || cat.includes(queryLower);
  });

  const filteredTools = tools.filter(t => {
    if (!queryLower) return true;
    const title = (t[`title_${language}`] || t.title_fr || t.title || '').toLowerCase();
    const desc = (t[`description_${language}`] || t.description_fr || t.description || '').toLowerCase();
    return title.includes(queryLower) || desc.includes(queryLower);
  });

  const displayArticles = activeTab === 'all' || activeTab === 'articles';
  const displayTools = activeTab === 'all' || activeTab === 'tools';
  const totalDisplayCount = (displayArticles ? filteredArticles.length : 0) + (displayTools ? filteredTools.length : 0);

  return (
    <div className={`w-full bg-white dark:bg-gray-850 rounded-3xl p-4 sm:p-6 border border-emerald-100 dark:border-gray-700/80 shadow-sm relative overflow-hidden ${className}`}>
      {/* Decorative top ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-gray-800 relative z-10">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <HardDrive size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                {language === 'fr' 
                  ? 'Contenu Hors-Ligne' 
                  : language === 'ha'
                  ? 'Abubuwan da ke Aiki Ba tare da Intanet ba'
                  : 'Offline Content Vault'}
              </h2>
              {isOffline && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 flex items-center gap-1">
                  <WifiOff size={11} />
                  {language === 'fr' ? 'Actuellement Hors-Ligne' : 'Currently Offline'}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {language === 'fr'
                ? 'Articles et outils enregistrés sur votre appareil, 100% fonctionnels sans connexion internet.'
                : language === 'ha'
                ? 'Labarai da kayan aikin da aka adana a kan na\'urarka, suna aiki ko ba ka da intanet.'
                : 'Articles and tools stored on your device, 100% accessible without internet connection.'}
            </p>
          </div>
        </div>

        {/* Quick Storage & Sync Stats */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200/80 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Database size={13} className="text-emerald-500" />
            <span>{formatStorageBytes(totalStorageBytes)}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsSaverModalOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-600/20"
            title={language === 'fr' ? "Sauvegarder l'application pour utilisation hors-ligne" : 'Save app for offline use'}
          >
            <HardDriveDownload size={14} />
            <span>{language === 'fr' ? "Sauvegarder l'App" : 'Save App Offline'}</span>
          </button>

          <button
            type="button"
            onClick={handlePreloadAllDefaultTools}
            disabled={isPreloadingTools}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-200/60 dark:border-emerald-800/40"
            title={language === 'fr' ? 'Synchroniser les outils recommandés' : 'Sync recommended tools'}
          >
            <RefreshCw size={13} className={isPreloadingTools ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{language === 'fr' ? 'Actualiser' : 'Sync'}</span>
          </button>

          {(articles.length > 0 || tools.length > 0) && (
            <button
              type="button"
              onClick={() => setConfirmClearOpen(true)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
              title={language === 'fr' ? 'Vider la mémoire hors-ligne' : 'Clear offline vault'}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-4 relative z-10">
        {/* Navigation Tabs */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {language === 'fr' ? 'Tout' : 'All'} ({articles.length + tools.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('articles')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'articles'
                ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <BookOpen size={13} />
            <span>{language === 'fr' ? 'Articles' : 'Articles'} ({articles.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tools')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tools'
                ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Sparkles size={13} />
            <span>{language === 'fr' ? 'Outils' : 'Tools'} ({tools.length})</span>
          </button>
        </div>

        {/* Search & Layout toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'fr' ? 'Rechercher hors-ligne...' : 'Search offline...'}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-0.5 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
              title="Grille"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
              title="Liste"
            >
              <ListIcon size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {language === 'fr' ? 'Chargement de la base IndexedDB...' : 'Loading IndexedDB storage...'}
          </p>
        </div>
      ) : totalDisplayCount === 0 ? (
        /* Empty state */
        <div className="py-10 px-4 text-center rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <HardDrive size={24} />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            {searchQuery
              ? (language === 'fr' ? 'Aucun résultat trouvé' : 'No matching offline content')
              : (language === 'fr' ? 'Aucun contenu hors-ligne enregistré' : 'No offline content saved yet')}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
            {language === 'fr'
              ? 'Pour enregistrer un article, ouvrez-le et cliquez sur "Sauvegarder". Vous pouvez également précharger les outils de calculs spirituels pour les utiliser sans connexion.'
              : 'To save an article, open it and tap "Save". You can also preload spiritual calculation tools for offline use.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={handlePreloadAllDefaultTools}
              disabled={isPreloadingTools}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
            >
              <Zap size={14} />
              <span>{language === 'fr' ? 'Charger les outils hors-ligne recommandés' : 'Load recommended offline tools'}</span>
            </button>
            <Link
              to="/explore"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <BookOpen size={14} />
              <span>{language === 'fr' ? 'Explorer les secrets' : 'Explore secrets'}</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Content lists */
        <div className="space-y-6">
          {/* Articles Section */}
          {displayArticles && filteredArticles.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-emerald-500" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {language === 'fr' ? 'Articles & Secrets Sauvegardés' : 'Saved Articles & Secrets'}
                  </h3>
                  <span className="text-xs font-semibold text-gray-400">({filteredArticles.length})</span>
                </div>
                <span className="text-[11px] font-medium text-gray-400">
                  {formatStorageBytes(totalArticlesBytes)}
                </span>
              </div>

              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" : "space-y-2"}>
                {filteredArticles.map((article) => {
                  const title = article[`title_${language}`] || article.title_fr || article.title;
                  const hook = article[`hook_${language}`] || article.hook_fr || article.hook;
                  const savedDateStr = article.savedAt ? new Date(article.savedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US') : '';

                  return (
                    <motion.div
                      key={`offline-art-${article.id}`}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`group bg-gray-50/80 hover:bg-emerald-50/40 dark:bg-gray-800/80 dark:hover:bg-gray-800 border border-gray-100 hover:border-emerald-200 dark:border-gray-700/60 dark:hover:border-emerald-800/50 rounded-2xl p-3.5 transition-all flex ${
                        viewMode === 'grid' ? 'flex-col justify-between' : 'flex-row items-center justify-between gap-3'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            {article.category || 'Secret'}
                          </span>
                          {article.isPremium && (
                            <span className="px-1.5 py-0.5 rounded-lg text-[9px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                              VIP
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 ml-auto">{savedDateStr}</span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {title}
                        </h4>

                        {hook && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                            {hook}
                          </p>
                        )}
                      </div>

                      <div className={`flex items-center gap-2 ${viewMode === 'grid' ? 'mt-3 pt-2.5 border-t border-gray-150 dark:border-gray-700/50 justify-between' : 'shrink-0'}`}>
                        <span className="text-[10px] font-medium text-gray-400">
                          {formatStorageBytes(article.sizeBytes || 12000)}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/secret/${article.id}`}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-sm flex items-center gap-1"
                          >
                            <span>{language === 'fr' ? 'Lire' : 'Read'}</span>
                            <ArrowRight size={11} />
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => handleRemoveArticle(article.id, e)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                            title={language === 'fr' ? 'Supprimer de la mémoire locale' : 'Remove from offline vault'}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tools Section */}
          {displayTools && filteredTools.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-indigo-500" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {language === 'fr' ? 'Outils Mystiques Hors-Ligne' : 'Offline Spiritual Tools'}
                  </h3>
                  <span className="text-xs font-semibold text-gray-400">({filteredTools.length})</span>
                </div>
                <span className="text-[11px] font-medium text-gray-400">
                  {formatStorageBytes(totalToolsBytes)}
                </span>
              </div>

              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" : "space-y-2"}>
                {filteredTools.map((tool) => {
                  const title = tool[`title_${language}`] || tool.title_fr || tool.title;
                  const desc = tool[`description_${language}`] || tool.description_fr || tool.description;

                  return (
                    <motion.div
                      key={`offline-tool-${tool.id}`}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`group bg-gray-50/80 hover:bg-indigo-50/30 dark:bg-gray-800/80 dark:hover:bg-gray-800 border border-gray-100 hover:border-indigo-200 dark:border-gray-700/60 dark:hover:border-indigo-800/50 rounded-2xl p-3.5 transition-all flex ${
                        viewMode === 'grid' ? 'flex-col justify-between' : 'flex-row items-center justify-between gap-3'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color || 'from-emerald-500 to-teal-700'} text-white flex items-center justify-center shadow-md shrink-0`}>
                          <DynamicLucideIcon name={tool.iconName} size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase">
                              {tool.level || 'Simple'}
                            </span>
                            <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                              <CheckCircle2 size={10} /> 100% Hors-Ligne
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {title}
                          </h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                            {desc}
                          </p>
                        </div>
                      </div>

                      <div className={`flex items-center gap-2 ${viewMode === 'grid' ? 'mt-3 pt-2.5 border-t border-gray-150 dark:border-gray-700/50 justify-between' : 'shrink-0'}`}>
                        <span className="text-[10px] font-medium text-gray-400">
                          {formatStorageBytes(tool.sizeBytes || 18000)}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <Link
                            to={tool.path}
                            className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-sm flex items-center gap-1"
                          >
                            <span>{language === 'fr' ? 'Lancer' : 'Open'}</span>
                            <ArrowRight size={11} />
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => handleRemoveTool(tool.id, e)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                            title={language === 'fr' ? 'Retirer du cache' : 'Remove from cache'}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal to Clear All */}
      <AnimatePresence>
        {confirmClearOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-150 dark:border-gray-800 text-center"
            >
              <div className="w-14 h-14 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Trash2 size={26} />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                {language === 'fr' ? 'Vider la mémoire hors-ligne ?' : 'Clear all offline storage?'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                {language === 'fr'
                  ? 'Tous les articles et outils enregistrés dans IndexedDB seront purgés. Vous pourrez les re-télécharger à tout moment.'
                  : 'All articles and tools stored in IndexedDB will be removed. You can re-download them anytime.'}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmClearOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {language === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-md shadow-red-600/20"
                >
                  {language === 'fr' ? 'Confirmer' : 'Clear All'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 dark:bg-gray-800/95 text-white px-4 py-2 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border border-emerald-500/30"
          >
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline App Saver Modal */}
      <OfflineAppSaverModal
        isOpen={isSaverModalOpen}
        onClose={() => {
          setIsSaverModalOpen(false);
          loadOfflineContent();
        }}
      />
    </div>
  );
};
