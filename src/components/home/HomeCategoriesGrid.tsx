import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  FolderOpen, Sparkles, Shield, BookOpen, Heart, Key,
  Compass, Moon, Sun, Flame, Feather, Coins, Star, Volume2,
  ArrowRight, Tag, Layers, Search, Crown, LayoutGrid, Square,
  LayoutList, Check
} from 'lucide-react';
import { CategoryItem } from '../../types';
import { getCategoryFallbackThumbnail, getCategoryFallbackHook } from '../../data/defaultCategories';
import { sanitizeImageSource } from '../../utils/articleImageUtils';

export type HomeCategoryLayoutMode = 'grid2' | 'banner' | 'list';

interface HomeCategoriesGridProps {
  categories: CategoryItem[];
  articles: any[];
  onSelectCategory: (category: CategoryItem) => void;
  language?: string;
  searchQuery?: string;
  featureToggles?: any;
}

export const HomeCategoriesGrid: React.FC<HomeCategoriesGridProps> = ({
  categories,
  articles = [],
  onSelectCategory,
  language = 'fr',
  searchQuery = '',
  featureToggles = {}
}) => {
  // Configured layout mode from Admin settings: 'grid2' | 'banner' | 'list'
  const adminLayoutMode: HomeCategoryLayoutMode = 
    featureToggles?.home_categories_layout_mode === 'banner' ? 'banner' :
    featureToggles?.home_categories_layout_mode === 'list' ? 'list' : 'grid2';

  const [activeLayoutMode, setActiveLayoutMode] = useState<HomeCategoryLayoutMode>(adminLayoutMode);

  // Sync if admin changes featureToggles remotely
  useEffect(() => {
    if (featureToggles?.home_categories_layout_mode) {
      setActiveLayoutMode(featureToggles.home_categories_layout_mode);
    }
  }, [featureToggles?.home_categories_layout_mode]);

  // Helper icon renderer
  const renderIcon = (name?: string, size = 18, className = '') => {
    switch (name) {
      case 'Sparkles': return <Sparkles size={size} className={className} />;
      case 'Shield': return <Shield size={size} className={className} />;
      case 'BookOpen': return <BookOpen size={size} className={className} />;
      case 'Heart': return <Heart size={size} className={className} />;
      case 'Key': return <Key size={size} className={className} />;
      case 'Compass': return <Compass size={size} className={className} />;
      case 'Moon': return <Moon size={size} className={className} />;
      case 'Sun': return <Sun size={size} className={className} />;
      case 'Flame': return <Flame size={size} className={className} />;
      case 'Feather': return <Feather size={size} className={className} />;
      case 'Coins': return <Coins size={size} className={className} />;
      case 'Star': return <Star size={size} className={className} />;
      case 'Volume2': return <Volume2 size={size} className={className} />;
      default: return <FolderOpen size={size} className={className} />;
    }
  };

  // Article count helper
  const articleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (articles || []).forEach(art => {
      const cat = (art.category || '').toString().trim().toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [articles]);

  const getArticleCount = (cat: CategoryItem) => {
    const catNameLower = (cat.name || '').toLowerCase().trim();
    const catIdLower = (cat.id || '').toLowerCase().trim();
    return (articleCounts[catNameLower] || 0) + (articleCounts[catIdLower] || 0);
  };

  // Filter categories by search if provided
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(cat => {
      const nameMatch = (cat.name || '').toLowerCase().includes(q)
        || (cat.name_en || '').toLowerCase().includes(q)
        || (cat.name_ha || '').toLowerCase().includes(q);
      const hookMatch = (cat.hook || '').toLowerCase().includes(q)
        || (cat.hook_en || '').toLowerCase().includes(q)
        || (cat.hook_ha || '').toLowerCase().includes(q);
      const subMatch = (cat.subCategories || []).some(sub =>
        (sub.name || '').toLowerCase().includes(q) || (sub.hook || '').toLowerCase().includes(q)
      );
      return nameMatch || hookMatch || subMatch;
    });
  }, [categories, searchQuery]);

  const showHooks = featureToggles?.home_categories_show_hooks !== false;
  const showCounts = featureToggles?.home_categories_show_counts !== false;
  const showSubCounts = featureToggles?.home_categories_show_sub_counts !== false;

  const headerTitle = featureToggles?.home_categories_custom_title || (
    language === 'en' ? 'Sacred Knowledge & Themes' :
    language === 'ha' ? 'Bangarorin Ilimi & Sirrika' :
    'Thématiques & Savoirs Sacrés'
  );

  const headerSubtitle = featureToggles?.home_categories_custom_subtitle || (
    language === 'en' ? 'Explore authentic secrets, invocations, and spiritual practices classified by domain.' :
    language === 'ha' ? 'Bincika ingantattun sirrika, addu\'o\'i da ayyukan ibada na musamman.' :
    'Explorez nos secrets, invocations et pratiques spirituelles authentiques classés par domaines.'
  );

  /* ========================================================================= */
  /* MODEL 1: GRILLE DE 2 COLONNES (Grid 2 Cols)                              */
  /* ========================================================================= */
  const renderGrid2Layout = () => (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 w-full">
      {filteredCategories.map((cat, idx) => {
        let displayName = cat.name;
        if (language === 'en' && cat.name_en) displayName = cat.name_en;
        if (language === 'ha' && cat.name_ha) displayName = cat.name_ha;

        let displayHook = cat.hook;
        if (language === 'en' && cat.hook_en) displayHook = cat.hook_en;
        if (language === 'ha' && cat.hook_ha) displayHook = cat.hook_ha;
        if (!displayHook) {
          displayHook = getCategoryFallbackHook(cat.name);
        }

        const thumbnailSrc = sanitizeImageSource(cat.thumbnail || getCategoryFallbackThumbnail(cat.name));
        const artCount = getArticleCount(cat);
        const subCount = cat.subCategories?.length || 0;

        return (
          <motion.div
            key={cat.id || `cat-grid-${idx}`}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectCategory(cat)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/80 dark:border-gray-800 bg-gray-950 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[220px] sm:min-h-[260px] md:min-h-[290px]"
          >
            {/* Full-bleed Thumbnail Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={thumbnailSrc}
                alt={displayName}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getCategoryFallbackThumbnail(cat.name);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/65 to-black/30 group-hover:via-gray-950/75 transition-colors duration-300" />
            </div>

            {/* Top Section: Icon & Counts */}
            <div className="relative z-10 p-2.5 sm:p-3.5 flex items-start justify-between gap-1.5">
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/25 shadow-md flex items-center justify-center transition-colors">
                {renderIcon(cat.iconName, 18, 'text-emerald-300')}
              </div>

              {showCounts && (
                <span className="px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-600/90 hover:bg-emerald-500 backdrop-blur-md text-white shadow-xs border border-emerald-400/30 flex items-center gap-1 transition-colors">
                  <Tag size={11} className="text-emerald-200 shrink-0" />
                  <span>{artCount}</span>
                  <span className="hidden xs:inline text-[9px] font-medium opacity-90">
                    {artCount > 1 ? 'arts' : 'art'}
                  </span>
                </span>
              )}
            </div>

            {/* Bottom Section: Title, SubCount, Hook & Action */}
            <div className="relative z-10 p-3 sm:p-4 md:p-5 flex flex-col justify-end space-y-1.5 sm:space-y-2 text-left">
              {showSubCounts && subCount > 0 && (
                <div className="w-fit">
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    <Layers size={10} className="text-emerald-400" />
                    <span>{subCount} {subCount > 1 ? (language === 'en' ? 'subthemes' : language === 'ha' ? 'bangarori' : 'sous-thèmes') : (language === 'en' ? 'subtheme' : language === 'ha' ? 'bangare' : 'sous-thème')}</span>
                  </span>
                </div>
              )}

              <h3 className="font-extrabold text-xs xs:text-sm sm:text-base md:text-lg text-white line-clamp-2 leading-tight drop-shadow-sm group-hover:text-emerald-300 transition-colors">
                {displayName}
              </h3>

              {showHooks && displayHook && (
                <p className="text-[10px] sm:text-xs text-gray-200/90 line-clamp-2 italic font-normal leading-relaxed text-left border-l-2 border-emerald-400/80 pl-2 bg-black/25 py-0.5 rounded-r">
                  « {displayHook} »
                </p>
              )}

              <div className="pt-1 flex items-center justify-between text-[10px] sm:text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                <span className="opacity-90 group-hover:opacity-100">
                  {language === 'en' ? 'Explore' : language === 'ha' ? 'Duba' : 'Explorer'}
                </span>
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 text-white flex items-center justify-center transition-all group-hover:translate-x-0.5">
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  /* ========================================================================= */
  /* MODEL 2: GRANDE CARTE / BANNIÈRE 1 COLONNE (Screenshot 1)                 */
  /* ========================================================================= */
  const renderBannerLayout = () => (
    <div className="space-y-4 sm:space-y-6 w-full max-w-4xl mx-auto">
      {filteredCategories.map((cat, idx) => {
        let displayName = cat.name;
        if (language === 'en' && cat.name_en) displayName = cat.name_en;
        if (language === 'ha' && cat.name_ha) displayName = cat.name_ha;

        let displayHook = cat.hook;
        if (language === 'en' && cat.hook_en) displayHook = cat.hook_en;
        if (language === 'ha' && cat.hook_ha) displayHook = cat.hook_ha;
        if (!displayHook) {
          displayHook = getCategoryFallbackHook(cat.name);
        }

        const thumbnailSrc = sanitizeImageSource(cat.thumbnail || getCategoryFallbackThumbnail(cat.name));
        const artCount = getArticleCount(cat);
        const subCount = cat.subCategories?.length || 0;

        return (
          <motion.div
            key={cat.id || `cat-banner-${idx}`}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory(cat)}
            className="group cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-850 shadow-xs hover:shadow-xl transition-all duration-300"
          >
            {/* Top Large Banner Image with Overlay */}
            <div className="relative h-52 xs:h-60 sm:h-72 md:h-80 w-full overflow-hidden bg-gray-900">
              <img
                src={thumbnailSrc}
                alt={displayName}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getCategoryFallbackThumbnail(cat.name);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-black/30 group-hover:via-gray-950/50 transition-colors duration-300" />

              {/* Top-Left Badge: Floating Pill like "Verses & Wirds" */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/65 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 text-xs sm:text-sm font-bold shadow-sm">
                  <Crown size={14} className="text-amber-400 shrink-0" />
                  <span>{displayName}</span>
                </span>
              </div>

              {/* Top-Right: Counts Badge */}
              {showCounts && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-600/90 backdrop-blur-md text-white shadow-xs border border-emerald-400/30 flex items-center gap-1.5">
                    <Tag size={12} className="text-emerald-200" />
                    <span>{artCount} {artCount > 1 ? (language === 'en' ? 'articles' : 'articles') : (language === 'en' ? 'article' : 'article')}</span>
                  </span>
                </div>
              )}

              {/* Bottom of Image: Bold White Title (Exact style of Screenshot 1) */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 z-10">
                <h3 className="text-base xs:text-lg sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wide leading-tight drop-shadow-md group-hover:text-emerald-300 transition-colors">
                  {displayName}
                </h3>
              </div>
            </div>

            {/* Bottom Card Body: Hook Description & Footer */}
            <div className="p-4 sm:p-5 bg-white dark:bg-gray-850 space-y-3">
              {showHooks && displayHook && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                  {displayHook}
                </p>
              )}

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                {showSubCounts && subCount > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                    <Layers size={13} />
                    <span>{subCount} {subCount > 1 ? (language === 'en' ? 'subthemes' : language === 'ha' ? 'bangarori' : 'sous-thèmes') : (language === 'en' ? 'subtheme' : language === 'ha' ? 'bangare' : 'sous-thème')}</span>
                  </span>
                ) : <div />}

                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors">
                  <span>{language === 'en' ? 'Explore Category' : language === 'ha' ? 'Duba Bangare' : 'Explorer la catégorie'}</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  /* ========================================================================= */
  /* MODEL 3: LISTE HORIZONTALE COMPACTE (Screenshot 2)                       */
  /* ========================================================================= */
  const renderListLayout = () => (
    <div className="space-y-3 sm:space-y-3.5 w-full max-w-4xl mx-auto">
      {filteredCategories.map((cat, idx) => {
        let displayName = cat.name;
        if (language === 'en' && cat.name_en) displayName = cat.name_en;
        if (language === 'ha' && cat.name_ha) displayName = cat.name_ha;

        let displayHook = cat.hook;
        if (language === 'en' && cat.hook_en) displayHook = cat.hook_en;
        if (language === 'ha' && cat.hook_ha) displayHook = cat.hook_ha;
        if (!displayHook) {
          displayHook = getCategoryFallbackHook(cat.name);
        }

        const thumbnailSrc = sanitizeImageSource(cat.thumbnail || getCategoryFallbackThumbnail(cat.name));
        const artCount = getArticleCount(cat);
        const subCount = cat.subCategories?.length || 0;

        return (
          <motion.div
            key={cat.id || `cat-list-${idx}`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory(cat)}
            className="group cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-850 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-row items-stretch"
          >
            {/* Left Thumbnail with Badge Overlay (Exact style of Screenshot 2) */}
            <div className="w-28 xs:w-36 sm:w-44 md:w-48 shrink-0 relative overflow-hidden bg-gray-900 rounded-l-2xl sm:rounded-l-3xl">
              <img
                src={thumbnailSrc}
                alt={displayName}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getCategoryFallbackThumbnail(cat.name);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

              {/* Badge on Thumbnail: Pill like "Verses & ..." */}
              <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-white border border-white/20 text-[10px] sm:text-[11px] font-bold shadow-xs max-w-[100px] xs:max-w-[130px] sm:max-w-none truncate">
                  <Crown size={11} className="text-amber-400 shrink-0" />
                  <span className="truncate">{displayName}</span>
                </span>
              </div>

              {/* Bottom Count Pill on thumbnail */}
              {showCounts && (
                <div className="absolute bottom-2 left-2 z-10">
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs">
                    {artCount} art.
                  </span>
                </div>
              )}
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col justify-center min-w-0">
              <h3 className="text-xs xs:text-sm sm:text-base font-black text-gray-900 dark:text-white uppercase leading-tight line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {displayName}
              </h3>

              {showHooks && displayHook && (
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 sm:mt-1.5 leading-relaxed font-normal">
                  {displayHook}
                </p>
              )}

              <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                {showSubCounts && subCount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Layers size={11} />
                    <span>{subCount} {subCount > 1 ? (language === 'en' ? 'subthemes' : 'sous-thèmes') : (language === 'en' ? 'subtheme' : 'sous-thème')}</span>
                  </span>
                ) : (
                  <span className="text-gray-400">{artCount} publications</span>
                )}

                <div className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>{language === 'en' ? 'Open' : language === 'ha' ? 'Duba' : 'Ouvrir'}</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full space-y-4 sm:space-y-6 pb-6">
      {/* Header Section with Quick Layout Switcher */}
      <div className="text-center sm:text-left pt-2 pb-2 border-b border-gray-100 dark:border-gray-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/50 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 mb-1.5">
              <Sparkles size={13} className="text-emerald-500" />
              <span>{language === 'en' ? 'Exclusive Classification' : language === 'ha' ? 'Rabe-raben Ilimi' : 'Classification Exclusive'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {headerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl mt-0.5">
              {headerSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 shrink-0">
            {/* Mode Switcher Buttons */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl border border-gray-200/70 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setActiveLayoutMode('grid2')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeLayoutMode === 'grid2'
                    ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="Modèle 1 : Grille 2 Colonnes"
              >
                <LayoutGrid size={14} />
                <span className="hidden md:inline">2 Cols</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLayoutMode('banner')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeLayoutMode === 'banner'
                    ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="Modèle 2 : Grande Carte / Bannière (1 Colonne)"
              >
                <Square size={14} />
                <span className="hidden md:inline">Bannière</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLayoutMode('list')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeLayoutMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="Modèle 3 : Liste Horizontale"
              >
                <LayoutList size={14} />
                <span className="hidden md:inline">Liste</span>
              </button>
            </div>

            {/* Metrics Chips */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 dark:text-gray-400">
              <span className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700">
                {categories.length} {language === 'en' ? 'Categories' : language === 'ha' ? 'Bangarori' : 'Catégories'}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                {articles.length} {language === 'en' ? 'Articles' : language === 'ha' ? 'Rubuce-rubuce' : 'Articles'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Content Rendering based on activeLayoutMode */}
      {filteredCategories.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-gray-800/60 rounded-3xl border border-gray-100 dark:border-gray-700/60 my-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mb-3">
            <Search size={24} />
          </div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            {language === 'en' ? 'No category found' : language === 'ha' ? 'Ba a sami bangare ba' : 'Aucune catégorie trouvée'}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {searchQuery
              ? (language === 'en' ? `No matching category for "${searchQuery}".` : `Aucune catégorie ne correspond à "${searchQuery}".`)
              : (language === 'en' ? 'No categories available currently.' : 'Aucune catégorie disponible pour le moment.')}
          </p>
        </div>
      ) : activeLayoutMode === 'banner' ? (
        renderBannerLayout()
      ) : activeLayoutMode === 'list' ? (
        renderListLayout()
      ) : (
        renderGrid2Layout()
      )}
    </div>
  );
};
