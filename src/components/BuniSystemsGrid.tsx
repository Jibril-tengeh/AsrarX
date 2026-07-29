import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BUNI_40_SYSTEMS, BuniSystem } from '../data/buniSystemsData';
import { BuniKhatimVisualizer } from './BuniKhatimVisualizer';
import {
  Search,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  X,
  Compass,
  Key,
  Shield,
  Clock,
  Layers,
  Award,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BuniSystemsGridProps {
  language: string;
  onExportParchment: (title: string, subtitle: string, content: React.ReactNode) => void;
  onVerifyAndExecute?: (featureId: string, featureName: string, action: () => void) => void;
}

export const BuniSystemsGrid: React.FC<BuniSystemsGridProps> = ({
  language,
  onExportParchment,
  onVerifyAndExecute,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSystemId, setExpandedSystemId] = useState<string | null>(null);
  const [detailModalSystem, setDetailModalSystem] = useState<BuniSystem | null>(null);
  const [isMainSectionCollapsed, setIsMainSectionCollapsed] = useState(true);

  // Helper getters for translated content
  const getTitle = (sys: BuniSystem) => {
    if (language === 'ha') return sys.titleHa;
    if (language === 'en') return sys.titleEn;
    return sys.titleFr;
  };

  const getDescription = (sys: BuniSystem) => {
    if (language === 'ha') return sys.descriptionHa;
    if (language === 'en') return sys.descriptionEn;
    return sys.descriptionFr;
  };

  const getDetails = (sys: BuniSystem) => {
    if (language === 'ha') return sys.detailsHa;
    if (language === 'en') return sys.detailsEn;
    return sys.detailsFr;
  };

  // Filter systems
  const filteredSystems = BUNI_40_SYSTEMS.filter((sys) => {
    const matchesCategory = selectedCategory === 'all' || sys.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const titleFr = sys.titleFr.toLowerCase();
    const titleEn = sys.titleEn.toLowerCase();
    const titleHa = sys.titleHa.toLowerCase();
    const titleAr = sys.titleAr.toLowerCase();
    const descFr = sys.descriptionFr.toLowerCase();

    const matchesSearch =
      titleFr.includes(query) ||
      titleEn.includes(query) ||
      titleHa.includes(query) ||
      titleAr.includes(query) ||
      descFr.includes(query) ||
      sys.number.toString() === query;

    return matchesCategory && matchesSearch;
  });

  // Category Tabs List
  const categories = [
    { id: 'all', label: language === 'ha' ? 'Duk Tsare-tsare (40)' : language === 'en' ? 'All 40 Systems' : 'Les 40 Systèmes', icon: Layers },
    { id: 'divination', label: language === 'ha' ? 'Hasashe & Za\'irajah' : language === 'en' ? 'Divination & Za\'irajah' : 'Divination & Za\'irajah', icon: Compass },
    { id: 'taksir', label: language === 'ha' ? 'Taksir & Permutation' : language === 'en' ? 'Taksir & Permutation' : 'Taksir & Permutation', icon: Sparkles },
    { id: 'astrology', label: language === 'ha' ? 'Taurari & Lokuta' : language === 'en' ? 'Astrology & Timing' : 'Astrologie & Horaires', icon: Clock },
    { id: 'awfaq', label: language === 'ha' ? 'Wafq & Hatimi' : language === 'en' ? 'Awfaq & Seals' : 'Awfaq & Carrés Magiques', icon: Award },
    { id: 'secrets', label: language === 'ha' ? 'Haruffan Asiri' : language === 'en' ? 'Ciphers & Secrets' : 'Cryptographie & Secrets', icon: Key },
    { id: 'rituals', label: language === 'ha' ? 'Maganin Ruhi & Aiki' : language === 'en' ? 'Therapeutics & Rites' : 'Thérapeutique & Rituels', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Banner Intro */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-amber-700/50">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none font-arabic text-9xl">
          البوني
        </div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5">
              <Award size={14} />
              {language === 'ha' ? 'Harsashen Ilimi Mai Zurfi' : language === 'en' ? 'Esoteric Master Corpus' : 'Corpus Avancé Officiel'}
            </span>

            {/* Collapse / Expand Toggle Badge */}
            <button
              type="button"
              onClick={() => setIsMainSectionCollapsed(!isMainSectionCollapsed)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-gray-950 rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>
                {isMainSectionCollapsed
                  ? (language === 'ha' ? 'Buɗe Tsare-tsare (40)' : language === 'en' ? 'Expand 40 Systems' : 'Déplier les 40 Systèmes (40)')
                  : (language === 'ha' ? 'Rufe Section' : language === 'en' ? 'Collapse Section' : 'Masquer / Replier')}
              </span>
              {isMainSectionCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-black text-amber-100">
            {language === 'ha'
              ? 'Mafi Ingancin Tsare-tsare 40 na Sheikh Ahmad Al-Buni'
              : language === 'en'
              ? 'The 40 Advanced Systems & Methodologies of Ahmad Al-Buni'
              : 'Les 40 Systèmes & Méthodologies Avancés d\'Ahmad Al-Buni'}
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed font-sans">
            {language === 'ha'
              ? 'Cikakken ilimin Za\'irajah, Taksir, Istikhraj, Awfaq, da Hatimai da za a iya zazzagewa azaman Hoto (PNG) ko Tutar Parchemin.'
              : language === 'en'
              ? 'Comprehensive esoteric guide covering Za\'irajah, Taksir, Istikhraj, Awfaq, and downloadable Khatims/Seals as PNG images or Parchment documents.'
              : 'Guide théurgique complet intégrant la Za\'irajah, le Taksir spirale, l\'Istikhraj angélique, les Awfaq emboîtés et les Khatims téléchargeables sous forme d\'Images PNG et Parchemins Sacrés.'}
          </p>

          {/* Quick status bar when collapsed */}
          {isMainSectionCollapsed && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsMainSectionCollapsed(false)}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-amber-100 rounded-2xl border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen size={15} className="text-amber-400" />
                <span>
                  {language === 'ha'
                    ? 'An rufe wannan sashe. Danna nan domin gani da bincika tsare-tsare 40.'
                    : language === 'en'
                    ? 'Section is collapsed by default. Click here to reveal all 40 systems.'
                    : 'Cette section est fermée par défaut. Cliquez ici pour déplier et explorer les 40 systèmes Al-Buni.'}
                </span>
                <ChevronDown size={16} className="text-amber-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      {!isMainSectionCollapsed && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Search & Category Filter Bar */}
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'ha'
                      ? 'Nemi tsari ta lambobi, suna, ko kalma (misali: Za\'irajah, 14, Taksir)...'
                      : language === 'en'
                      ? 'Search systems by number, title, or keyword (e.g., Za\'irajah, 14, Taksir)...'
                      : 'Rechercher une méthodologie par numéro, nom ou mot-clé (ex: Za\'irajah, 14, Taksir)...'
                  }
                  className="w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Categories Pills */}
              <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid of 40 Systems */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSystems.map((sys) => {
          const isExpanded = expandedSystemId === sys.id;
          return (
            <motion.div
              key={sys.id}
              layout
              className={`bg-white dark:bg-gray-800/90 rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                isExpanded
                  ? 'border-amber-500 shadow-xl ring-2 ring-amber-500/20'
                  : 'border-gray-100 dark:border-gray-700/80 shadow-md hover:border-amber-500/50'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-xs rounded-full border border-amber-500/20 font-mono">
                    #{sys.number}
                  </span>
                  <span className="text-xs font-arabic font-bold text-amber-900 dark:text-amber-300 dir-rtl">
                    {sys.titleAr}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white font-serif leading-snug">
                  {getTitle(sys)}
                </h3>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                  {getDescription(sys)}
                </p>
              </div>

              {/* Accordion / Expandable Section */}
              <div className="border-t border-gray-100 dark:border-gray-700/60 p-4 bg-gray-50/50 dark:bg-gray-850/50 space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setExpandedSystemId(isExpanded ? null : sys.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    <span>{isExpanded ? (language === 'ha' ? 'Rage Bayani' : language === 'en' ? 'Show Less' : 'Masquer Détails') : (language === 'ha' ? 'Cikakken Bayani' : language === 'en' ? 'Full Methodology' : 'Voir la Méthodologie')}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  <button
                    onClick={() => setDetailModalSystem(sys)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Maximize2 size={12} />
                    <span>{language === 'ha' ? 'Buda Hatimi' : language === 'en' ? 'Open Seal' : 'Plein Écran'}</span>
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed text-gray-700 dark:text-gray-200 font-sans">
                      <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h3: ({ children }) => (
                            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 mt-3 mb-1.5 border-b border-amber-800/20 pb-1 font-serif">
                              {children}
                            </h3>
                          ),
                          h4: ({ children }) => (
                            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 mt-2 mb-1 font-serif">
                              {children}
                            </h4>
                          ),
                          p: ({ children }) => <p className="mb-2 leading-relaxed text-xs">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-amber-950 dark:text-amber-100">{children}</strong>,
                          ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2 text-xs">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 mb-2 text-xs">{children}</ol>,
                          li: ({ children }) => <li className="text-xs leading-relaxed">{children}</li>,
                        }}
                      >
                        {getDetails(sys)}
                      </Markdown>
                    </div>

                    {/* Integrated Downloadable Khatim Visualizer */}
                    <div className="pt-2">
                      <BuniKhatimVisualizer
                        system={sys}
                        language={language}
                        onExportParchment={onExportParchment}
                        onVerifyAndExecute={onVerifyAndExecute}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty Search State */}
      {filteredSystems.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 p-8 space-y-3">
          <Sparkles className="mx-auto text-amber-500 opacity-60" size={32} />
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {language === 'ha' ? 'Babu wani tsari da aka samu' : language === 'en' ? 'No system found matching query' : 'Aucun système ne correspond à votre recherche'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 cursor-pointer"
          >
            {language === 'ha' ? 'Manta Bincike' : language === 'en' ? 'Reset Filters' : 'Réinitialiser les Filtres'}
          </button>
        </div>
      )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Full Modal View for Deep Study & Seal Download */}
      <AnimatePresence>
        {detailModalSystem && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-amber-500/30 my-auto space-y-5 max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-sm rounded-full border border-amber-500/20 font-mono">
                    #{detailModalSystem.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-serif">
                      {getTitle(detailModalSystem)}
                    </h3>
                    <p className="text-xs font-arabic font-bold text-amber-600 dark:text-amber-400 dir-rtl">
                      {detailModalSystem.titleAr}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDetailModalSystem(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl bg-gray-100 dark:bg-gray-800 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Detailed Text Content */}
              <div className="space-y-4">
                <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl border border-amber-500/20 text-xs text-gray-800 dark:text-gray-200 leading-relaxed font-sans">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h3: ({ children }) => (
                        <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 mt-3 mb-1.5 border-b border-amber-800/20 pb-1 font-serif">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 mt-2 mb-1 font-serif">
                          {children}
                        </h4>
                      ),
                      p: ({ children }) => <p className="mb-2 leading-relaxed text-xs">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold text-amber-950 dark:text-amber-100">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2 text-xs">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 mb-2 text-xs">{children}</ol>,
                      li: ({ children }) => <li className="text-xs leading-relaxed">{children}</li>,
                    }}
                  >
                    {getDetails(detailModalSystem)}
                  </Markdown>
                </div>

                {/* Downloadable Visual Khatim */}
                <BuniKhatimVisualizer
                  system={detailModalSystem}
                  language={language}
                  onExportParchment={(title, subtitle, content) => {
                    setDetailModalSystem(null);
                    onExportParchment(title, subtitle, content);
                  }}
                  onVerifyAndExecute={onVerifyAndExecute}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
