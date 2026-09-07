import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderOpen, Sparkles, X, Check, Upload, Image as ImageIcon,
  ChevronRight, Film, Search
} from 'lucide-react';
import { CategoryItem } from '../../types';
import { 
  PRESET_THUMBNAILS, 
  normalizeCategoryId, getCategoryFallbackThumbnail, getCategoryFallbackHook 
} from '../../data/defaultCategories';
import { getCategoryFallbackVideo } from '../../data/categoryIconsData';
import { sanitizeImageSource } from '../../utils/articleImageUtils';
import { CategoryDynamicIcon, CategoryVideoOrIconBadge } from '../common/CategoryDynamicIcon';
import { CategoryIconPickerModal } from './CategoryIconPickerModal';

const QUICK_ICONS = [
  'Sparkles', 'Shield', 'BookOpen', 'Heart', 'Key', 'Compass', 
  'Moon', 'Sun', 'Flame', 'Coins', 'Star', 'Volume2', 'Brain', 
  'TreePine', 'Lock', 'Gem'
];

interface CategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: CategoryItem | null;
  onSave: (category: CategoryItem) => Promise<void> | void;
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const CategoryEditModal: React.FC<CategoryEditModalProps> = ({
  isOpen,
  onClose,
  categoryToEdit,
  onSave,
  onShowToast = () => {}
}) => {
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    name_ha: '',
    hook: '',
    hook_en: '',
    hook_ha: '',
    thumbnail: PRESET_THUMBNAILS[0].url,
    iconName: 'Sparkles',
    videoUrl: ''
  });
  const [showPresetThumbnails, setShowPresetThumbnails] = useState(false);
  const [showIconPickerModal, setShowIconPickerModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name || '',
        name_en: categoryToEdit.name_en || '',
        name_ha: categoryToEdit.name_ha || '',
        hook: categoryToEdit.hook || getCategoryFallbackHook(categoryToEdit.name),
        hook_en: categoryToEdit.hook_en || '',
        hook_ha: categoryToEdit.hook_ha || '',
        thumbnail: categoryToEdit.thumbnail || getCategoryFallbackThumbnail(categoryToEdit.name),
        iconName: categoryToEdit.iconName || 'FolderOpen',
        videoUrl: categoryToEdit.videoUrl || ''
      });
    } else {
      setFormData({
        name: '',
        name_en: '',
        name_ha: '',
        hook: '',
        hook_en: '',
        hook_ha: '',
        thumbnail: PRESET_THUMBNAILS[0].url,
        iconName: 'Sparkles',
        videoUrl: ''
      });
    }
    setShowPresetThumbnails(false);
  }, [categoryToEdit, isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast("Veuillez choisir un fichier image valide (JPG, PNG, WEBP)", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      onShowToast("L'image ne doit pas dépasser 2 Mo pour un affichage fluide", "error");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setFormData(prev => ({ ...prev, thumbnail: dataUrl }));
      setIsUploading(false);
      onShowToast("Image téléversée avec succès !", "success");
    };
    reader.onerror = () => {
      setIsUploading(false);
      onShowToast("Erreur lors de la lecture de l'image", "error");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      onShowToast("Le nom de la catégorie est obligatoire", "error");
      return;
    }

    const catId = categoryToEdit ? categoryToEdit.id : normalizeCategoryId(trimmedName);
    if (!catId) {
      onShowToast("Nom de catégorie non valide", "error");
      return;
    }

    const resolvedThumbnail = formData.thumbnail.trim() || getCategoryFallbackThumbnail(trimmedName);
    const resolvedHook = formData.hook.trim() || getCategoryFallbackHook(trimmedName);
    const resolvedVideo = formData.videoUrl.trim() || getCategoryFallbackVideo(trimmedName);

    const categoryObj: CategoryItem = {
      id: catId,
      name: trimmedName,
      name_en: formData.name_en.trim() || trimmedName,
      name_ha: formData.name_ha.trim() || trimmedName,
      hook: resolvedHook,
      hook_en: formData.hook_en.trim() || resolvedHook,
      hook_ha: formData.hook_ha.trim() || resolvedHook,
      thumbnail: resolvedThumbnail,
      iconName: formData.iconName || 'Sparkles',
      videoUrl: resolvedVideo,
      subCategories: categoryToEdit?.subCategories || [],
      createdAt: categoryToEdit?.createdAt || Date.now()
    };

    setIsSaving(true);
    try {
      await onSave(categoryObj);
      onClose();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-850 w-full max-w-xl rounded-3xl shadow-2xl border border-gray-150 dark:border-gray-700 overflow-hidden my-6"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <FolderOpen size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg">
                {categoryToEdit ? "Modifier la Catégorie" : "Créer une Nouvelle Catégorie"}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Vignette HD, badge vidéo looping et choix parmi 520+ icônes SVG.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>Nom de la Catégorie *</span>
              <span className="text-[10px] text-emerald-600 font-bold">Obligatoire</span>
            </label>
            <input
              type="text"
              placeholder="ex: Secrets & Pratiques, Protection & Ruqyah..."
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Multilingual Names */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Nom (Anglais)</label>
              <input
                type="text"
                placeholder="ex: Secrets & Practices"
                value={formData.name_en}
                onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 text-xs text-gray-900 dark:text-white outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Nom (Hausa)</label>
              <input
                type="text"
                placeholder="ex: Asirai da Ayyuka"
                value={formData.name_ha}
                onChange={(e) => setFormData(prev => ({ ...prev, name_ha: e.target.value }))}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 text-xs text-gray-900 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* Hook (Phrase d'Accroche) */}
          <div className="space-y-1.5 p-3.5 bg-amber-50/70 dark:bg-amber-950/20 rounded-2xl border border-amber-200/70 dark:border-amber-900/50">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                <span>Phrase d'Accroche / Hook *</span>
              </label>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                Texte captivant
              </span>
            </div>
            <textarea
              rows={2}
              placeholder="Une phrase courte et percutante décrivant la portée spirituelle de cette catégorie..."
              value={formData.hook}
              onChange={(e) => setFormData(prev => ({ ...prev, hook: e.target.value }))}
              className="w-full bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-800/80 rounded-xl p-2.5 text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-amber-500"
            />
            <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
              <span>Affichée au-dessus des articles pour attirer le lecteur</span>
              <button
                type="button"
                onClick={() => {
                  const sug = getCategoryFallbackHook(formData.name || 'Général');
                  setFormData(prev => ({ ...prev, hook: sug }));
                }}
                className="text-amber-700 dark:text-amber-400 hover:underline font-bold cursor-pointer"
              >
                Générer une suggestion
              </button>
            </div>
          </div>

          {/* Thumbnail / Vignette */}
          <div className="space-y-2 p-3.5 bg-gray-50 dark:bg-gray-800/70 rounded-2xl border border-gray-200 dark:border-gray-700">
            <label className="text-xs font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <ImageIcon size={15} className="text-indigo-500" />
              <span>Vignette (Thumbnail) *</span>
            </label>

            <div className="flex items-center gap-3">
              <div className="w-24 h-16 rounded-xl overflow-hidden bg-gray-900 border border-gray-300 dark:border-gray-600 shrink-0 relative shadow-inner">
                <img
                  src={sanitizeImageSource(formData.thumbnail) || getCategoryFallbackThumbnail(formData.name)}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getCategoryFallbackThumbnail(formData.name);
                  }}
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.thumbnail}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 text-xs text-gray-900 dark:text-white outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPresetThumbnails(prev => !prev)}
                    className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                  >
                    {showPresetThumbnails ? "Masquer Presets" : "✨ Presets HD"}
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Upload size={11} /> Téléverser
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Presets Gallery */}
            {showPresetThumbnails && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  Vignettes Thématiques Sélectionnées (Cliquez pour appliquer) :
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto p-1">
                  {PRESET_THUMBNAILS.map((preset, pIdx) => (
                    <button
                      key={`cat-modal-preset-${pIdx}`}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, thumbnail: preset.url }));
                        setShowPresetThumbnails(false);
                      }}
                      className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        formData.thumbnail === preset.url
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-10 h-8 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-gray-900 dark:text-white truncate block">{preset.tag}</span>
                        <span className="text-[9px] text-gray-400 truncate block">{preset.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Icons & Video Looping Badge Selection */}
          <div className="space-y-2.5 p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-500" />
                <span>Icône SVG & Badge Vidéo Animé</span>
              </label>
              <button
                type="button"
                onClick={() => setShowIconPickerModal(true)}
                className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-300/40"
              >
                <Film size={13} />
                <span>Médiathèque (520+ Icônes & Vidéos)</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Current Selection Live Preview Card */}
            <div className="flex items-center gap-3.5 bg-white dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700/80 shadow-xs">
              <CategoryVideoOrIconBadge
                iconName={formData.iconName}
                videoUrl={formData.videoUrl || (formData.name ? getCategoryFallbackVideo(formData.name) : undefined)}
                categoryName={formData.name || 'Aperçu'}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gray-900 dark:text-white">
                    {formData.iconName || 'Sparkles'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                    {formData.videoUrl ? '🎬 Vidéo Looping Personnalisée' : '✨ Vidéo & Aura Sacrée'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {formData.videoUrl ? `Source : ${formData.videoUrl}` : 'Badge animé en boucle avec halo radiant haute visibilité'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowIconPickerModal(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Parcourir
              </button>
            </div>

            {/* Quick Strip of Essential Icons */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Sélection rapide :</div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {QUICK_ICONS.map((icon) => (
                  <button
                    key={`cat-icon-${icon}`}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, iconName: icon }))}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                      formData.iconName === icon
                        ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400 scale-105'
                        : 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/60 dark:border-emerald-800/50'
                    }`}
                    title={icon}
                  >
                    <CategoryDynamicIcon name={icon} size={22} className={formData.iconName === icon ? 'text-white' : ''} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-60"
            >
              <Check size={14} />
              <span>{isSaving ? "Enregistrement..." : (categoryToEdit ? "Mettre à jour la Catégorie" : "Créer la Catégorie")}</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* 520+ Icons and HD Video Looping Picker Modal */}
      <CategoryIconPickerModal
        isOpen={showIconPickerModal}
        onClose={() => setShowIconPickerModal(false)}
        selectedIcon={formData.iconName}
        selectedVideoUrl={formData.videoUrl}
        categoryName={formData.name}
        onSelect={(iconName, videoUrl) => {
          setFormData(prev => ({
            ...prev,
            iconName,
            videoUrl: videoUrl || ''
          }));
        }}
      />
    </div>
  );
};
