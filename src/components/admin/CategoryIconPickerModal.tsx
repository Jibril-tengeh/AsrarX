import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, X, Check, Film, Sparkles, Filter, Eye, Layers, 
  ExternalLink, Video, ChevronRight, Play
} from 'lucide-react';
import { 
  CATEGORY_ICON_GROUPS, 
  CATEGORY_ICONS_LIST, 
  PRESET_CATEGORY_VIDEOS, 
  searchCategoryIcons,
  findCategoryIcon,
  CategoryIconDefinition,
  CategoryVideoPreset
} from '../../data/categoryIconsData';
import { CategoryDynamicIcon, CategoryVideoOrIconBadge } from '../common/CategoryDynamicIcon';

interface CategoryIconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIcon: string;
  selectedVideoUrl?: string;
  categoryName?: string;
  onSelect: (iconName: string, videoUrl?: string) => void;
}

export const CategoryIconPickerModal: React.FC<CategoryIconPickerModalProps> = ({
  isOpen,
  onClose,
  selectedIcon,
  selectedVideoUrl,
  categoryName = 'Catégorie',
  onSelect,
}) => {
  const [activeTab, setActiveTab] = useState<'icons' | 'videos'>('icons');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [tempIcon, setTempIcon] = useState<string>(selectedIcon || 'Sparkles');
  const [tempVideoUrl, setTempVideoUrl] = useState<string>(selectedVideoUrl || '');
  const [previewMode, setPreviewMode] = useState<'video' | 'animated_badge' | 'svg'>('animated_badge');

  // Sync state whenever modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setTempIcon(selectedIcon || 'Sparkles');
      setTempVideoUrl(selectedVideoUrl || '');
      if (selectedVideoUrl) {
        setPreviewMode('video');
      } else {
        setPreviewMode('animated_badge');
      }
    }
  }, [isOpen, selectedIcon, selectedVideoUrl]);

  // Filtered icons
  const filteredIcons = useMemo(() => {
    return searchCategoryIcons(searchQuery, activeGroup);
  }, [searchQuery, activeGroup]);

  // Selected icon info
  const currentIconDef = useMemo(() => {
    return findCategoryIcon(tempIcon);
  }, [tempIcon]);

  if (!isOpen) return null;

  const handleApply = () => {
    onSelect(tempIcon, tempVideoUrl);
    onClose();
  };

  const handleSelectIconOnly = (iconName: string) => {
    setTempIcon(iconName);
  };

  const handleSelectVideo = (videoPreset: CategoryVideoPreset) => {
    setTempVideoUrl(videoPreset.mp4Url || videoPreset.url);
    setPreviewMode('video');
  };

  const handleClearVideo = () => {
    setTempVideoUrl('');
    setPreviewMode('animated_badge');
  };

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden text-gray-900 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Mode Switcher */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-850 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                Médiathèque d'Icônes & Vidéos HD
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              520+ icônes SVG vectorielles et 16 badges vidéos réelles looping pour votre catégorie.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs switcher */}
            <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('icons')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'icons'
                    ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                <Sparkles size={14} />
                <span>Icônes SVG ({CATEGORY_ICONS_LIST.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('videos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'videos'
                    ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                <Film size={14} />
                <span>Vidéos HD ({PRESET_CATEGORY_VIDEOS.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Live Interactive Preview Box */}
        <div className="p-3.5 sm:p-4 bg-emerald-950/20 dark:bg-emerald-950/40 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            {/* The Badge Preview */}
            <CategoryVideoOrIconBadge
              iconName={tempIcon}
              videoUrl={tempVideoUrl}
              categoryName={categoryName}
              size="lg"
            />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                  {categoryName || 'Nom de la Catégorie'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300/40">
                  {tempVideoUrl ? '🎬 Vidéo HD Looping' : '✨ Badge SVG Animé'}
                </span>
              </div>
              <div className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 flex items-center gap-2">
                <span>Icône : <strong>{tempIcon}</strong> {currentIconDef ? `(${currentIconDef.label_fr})` : ''}</span>
                {tempVideoUrl && (
                  <button
                    type="button"
                    onClick={handleClearVideo}
                    className="text-[10px] text-red-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    (Retirer la vidéo)
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check size={15} />
              <span>Valider ce Choix</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'icons' ? (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Search & Category Group Pills */}
            <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-800 space-y-2.5 shrink-0 bg-white dark:bg-gray-900">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher parmi 520+ icônes (ex: Lune, Bouclier, Livre, Étoile, Or, Cœur, Flamme...)"
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Pills horizontal scroll */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                <button
                  type="button"
                  onClick={() => setActiveGroup('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all cursor-pointer ${
                    activeGroup === 'all'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Tous ({CATEGORY_ICONS_LIST.length})
                </button>
                {CATEGORY_ICON_GROUPS.map((grp, gIdx) => {
                  const countInGroup = CATEGORY_ICONS_LIST.filter(i => i.category === grp.id).length;
                  return (
                    <button
                      key={`grp-${grp.id}-${gIdx}`}
                      type="button"
                      onClick={() => setActiveGroup(grp.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                        activeGroup === grp.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-emerald-50/80 dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-gray-700 border border-emerald-200/50 dark:border-gray-700'
                      }`}
                    >
                      <CategoryDynamicIcon name={grp.icon} size={18} />
                      <span>{grp.name} ({countInGroup})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Icons Grid with 520+ items: Enlarged, Vibrant & Crystal Clear */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5">
              {filteredIcons.length === 0 ? (
                <div className="p-10 text-center text-gray-500 space-y-3">
                  <CategoryDynamicIcon name="Search" size={44} className="mx-auto text-emerald-500" />
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Aucune icône trouvée pour "{searchQuery}"</p>
                  <p className="text-xs text-gray-500">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {filteredIcons.map((ic, icIdx) => {
                    const isSelected = tempIcon === ic.name;
                    return (
                      <button
                        key={`icon-btn-${ic.name}-${icIdx}`}
                        type="button"
                        onClick={() => handleSelectIconOnly(ic.name)}
                        className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border transition-all cursor-pointer group/item relative ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500 shadow-md scale-[1.02]'
                            : 'border-gray-200 dark:border-gray-800 hover:border-emerald-400 bg-white dark:bg-gray-850 hover:shadow-sm'
                        }`}
                        title={`${ic.name} - ${ic.label_fr}`}
                      >
                        {/* Luminous Jewel Icon Container: Bold, Clear, Never Black */}
                        <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-500 text-white shadow-md'
                            : 'bg-emerald-50/90 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 group-hover/item:scale-108 group-hover/item:bg-emerald-100 dark:group-hover/item:bg-emerald-900/60'
                        }`}>
                          <CategoryDynamicIcon 
                            name={ic.name} 
                            size={30} 
                            strokeWidth={2.4} 
                            className={isSelected ? 'text-white drop-shadow-sm' : ''} 
                          />
                        </div>

                        <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 line-clamp-1 max-w-full">
                          {ic.label_fr || ic.name}
                        </span>

                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Videos Gallery Tab (16 Looping HD Category Videos) */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-3 text-xs text-emerald-800 dark:text-emerald-200">
              <Film size={18} className="shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <strong className="block font-black text-sm mb-0.5">Badges Vidéos HD Looping Réelles</strong>
                Ces vidéos en boucle haute définition (format WebP & MP4 ultra-fluide) s'affichent directement sur les cartes de catégories du tableau de bord utilisateur avec un rendu professionnel instantané.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {PRESET_CATEGORY_VIDEOS.map((vid, vIdx) => {
                const isSelected = tempVideoUrl === vid.url || tempVideoUrl === vid.mp4Url;
                return (
                  <div
                    key={`preset-vid-${vid.id}-${vIdx}`}
                    onClick={() => handleSelectVideo(vid)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500 shadow-md'
                        : 'border-gray-200 dark:border-gray-800 hover:border-emerald-400/80 bg-white dark:bg-gray-850 hover:shadow-sm'
                    }`}
                  >
                    {/* Video loop thumbnail */}
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/20 relative bg-black shadow-xs">
                      <video
                        src={vid.mp4Url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-2xl pointer-events-none" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-gray-900 dark:text-white truncate">
                          {vid.label}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Check size={10} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                        {vid.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Video URL input */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <ExternalLink size={13} />
                <span>Ou spécifier une URL de vidéo personnalisée (WebP animé, MP4, GIF) :</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={tempVideoUrl}
                  onChange={(e) => setTempVideoUrl(e.target.value)}
                  placeholder="/videos/categories/... ou https://..."
                  className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                />
                {tempVideoUrl && (
                  <button
                    type="button"
                    onClick={handleClearVideo}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-xs font-bold rounded-xl text-gray-600 dark:text-gray-300"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {activeTab === 'icons' 
              ? `${filteredIcons.length} icône(s) affichée(s) sur ${CATEGORY_ICONS_LIST.length}`
              : `${PRESET_CATEGORY_VIDEOS.length} vidéos haute définition disponibles`}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Appliquer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
