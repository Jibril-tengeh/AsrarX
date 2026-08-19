import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  CheckCircle2, 
  Flame, 
  Gamepad2, 
  Globe, 
  ChevronRight, 
  X, 
  Sparkles, 
  Download, 
  Bookmark, 
  FileText,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useFeatures } from '../contexts/FeatureContext';
import { INITIAL_DEFAULT_ARTICLES } from '../data/defaultArticles';
import { isPubliclyVisibleArticle } from '../lib/articleUtils';

interface AsrarQuickWidgetProps {
  variant?: 'inline' | 'floating';
  onCloseFloating?: () => void;
}

export const AsrarQuickWidget: React.FC<AsrarQuickWidgetProps> = ({ 
  variant = 'inline',
  onCloseFloating 
}) => {
  const { language, t } = useLanguage();
  const { featureToggles } = useFeatures();
  const navigate = useNavigate();

  // Check feature toggle: disabled by default unless explicitly set to 'active'
  const widgetStatus = featureToggles?.['tool_quick_widget'] || 'inactive';
  if (widgetStatus !== 'active') {
    return null;
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [savedCount, setSavedCount] = useState(5);
  const [savedArticles, setSavedArticles] = useState<any[]>([]);

  // Load actual saved/downloaded articles or default top 5
  useEffect(() => {
    try {
      const cached = localStorage.getItem('asrarhub_cached_explore_articles') || localStorage.getItem('asrarhub_cached_articles_list');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((art: any) => art && art.id && !String(art.id).startsWith('default_art_') && isPubliclyVisibleArticle(art.status));
          if (valid.length > 0) {
            setSavedArticles(valid.slice(0, 5));
            setSavedCount(valid.length);
            return;
          }
        }
      }
    } catch (e) {}

    setSavedArticles([]);
    setSavedCount(0);
  }, []);

  // Language helper translations
  const getTranslations = () => {
    if (language === 'fr') {
      return {
        brand: 'AsrarHub',
        downloadedPill: `${savedCount} fichiers téléchargés`,
        searchPlaceholder: 'Rechercher dans tous vos favoris...',
        hotVideoLabel: 'Secrets Populaires',
        gameLabel: 'Jeux & Quizz',
        siteLabel: 'Explorer Hub',
        savedModalTitle: 'Fichiers & Favoris Téléchargés',
        savedModalSubtitle: 'Vos recettes et wirds sauvegardés hors-ligne',
        openSecret: 'Ouvrir',
        noResults: 'Aucun favori correspondant',
        viewSavedTooltip: 'Voir les fichiers enregistrés',
        offlineTag: 'Hors-ligne',
        close: 'Fermer'
      };
    } else if (language === 'ha') {
      return {
        brand: 'AsrarHub',
        downloadedPill: `${savedCount} fayiloli aka sauke`,
        searchPlaceholder: 'Bincika duk sirrukan da ka fi so...',
        hotVideoLabel: 'Sirruka Masu Zafi',
        gameLabel: 'Wasan Quizz',
        siteLabel: 'Bincika Hub',
        savedModalTitle: 'Fayiloli da Sirruka da Aka Sauke',
        savedModalSubtitle: 'Adana sirruka da wuridai don karanta su ba tare da intanet ba',
        openSecret: 'Bude',
        noResults: 'Ba a sami sakamako ba',
        viewSavedTooltip: 'Duba fayilolin da aka adana',
        offlineTag: 'Ba tare da intanet ba',
        close: 'Rufe'
      };
    } else {
      return {
        brand: 'AsrarHub',
        downloadedPill: `${savedCount} files downloaded`,
        searchPlaceholder: 'Search all your favorites...',
        hotVideoLabel: 'Hot Secrets',
        gameLabel: 'Game & Quiz',
        siteLabel: 'Explore Hub',
        savedModalTitle: 'Downloaded Files & Favorites',
        savedModalSubtitle: 'Your saved recipes and wirds available offline',
        openSecret: 'Open',
        noResults: 'No matching favorites found',
        viewSavedTooltip: 'View saved files',
        offlineTag: 'Offline',
        close: 'Close'
      };
    }
  };

  const labels = getTranslations();

  // Search filtering logic
  const filteredFavorites = savedArticles.filter(item => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.hook && item.hook.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full select-none">
      {/* Outer Card Widget */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-slate-950/40 relative overflow-hidden transition-all">
        
        {/* Top Header Row: Brand Logo + Downloaded Pill */}
        <div className="flex items-center justify-between mb-3.5">
          {/* Brand Title */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-900/20">
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white font-serif">
              {labels.brand}
            </span>
          </div>

          {/* Downloaded / Saved Files Green Pill Button */}
          <button
            onClick={() => setShowSavedModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all cursor-pointer group active:scale-95"
            title={labels.viewSavedTooltip}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 fill-emerald-500/20" />
            <span className="truncate max-w-[170px] sm:max-w-none">
              {labels.downloadedPill}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Search Bar Input Row */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Live Search Overlay Results */}
          {searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-2 max-h-60 overflow-y-auto">
              {filteredFavorites.length > 0 ? (
                filteredFavorites.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(`/secret/${item.id}`);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between gap-2 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Bookmark className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {item.title}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  {labels.noResults}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3 Circular Action Icon Buttons Row */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          {/* Button 1: Hot Video / Secrets Populaires */}
          <button
            onClick={() => navigate('/explore')}
            className="flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/40 flex items-center justify-center text-rose-500 dark:text-rose-400 shadow-sm group-hover:scale-105 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/60 transition-all">
              <Flame className="w-6 h-6 fill-rose-500/20 group-hover:animate-bounce" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors text-center">
              {labels.hotVideoLabel}
            </span>
          </button>

          {/* Button 2: Game / Quizz & Outils */}
          <button
            onClick={() => navigate('/explore/quizz')}
            className="flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/40 flex items-center justify-center text-indigo-500 dark:text-indigo-400 shadow-sm group-hover:scale-105 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 transition-all">
              <Gamepad2 className="w-6 h-6 fill-indigo-500/20" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-center">
              {labels.gameLabel}
            </span>
          </button>

          {/* Button 3: Site / Explorer Hub */}
          <button
            onClick={() => navigate('/tools')}
            className="flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-pink-50 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800/40 flex items-center justify-center text-pink-500 dark:text-pink-400 shadow-sm group-hover:scale-105 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/60 transition-all">
              <Globe className="w-6 h-6 fill-pink-500/20" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors text-center">
              {labels.siteLabel}
            </span>
          </button>
        </div>
      </div>

      {/* Modal Drawer for Downloaded / Saved Secrets */}
      <AnimatePresence>
        {showSavedModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {labels.savedModalTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {labels.savedModalSubtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSavedModal(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Saved list */}
              <div className="py-3 space-y-2 max-h-72 overflow-y-auto">
                {savedArticles.map((art, idx) => (
                  <div
                    key={art.id || idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {art.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {art.category || 'Secret'} • {labels.offlineTag}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowSavedModal(false);
                        navigate(`/secret/${art.id}`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shrink-0"
                    >
                      <span>{labels.openSecret}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowSavedModal(false)}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {labels.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
