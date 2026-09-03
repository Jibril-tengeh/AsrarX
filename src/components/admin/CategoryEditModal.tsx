import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderOpen, Sparkles, X, Check, Upload, Image as ImageIcon,
  BookOpen, Shield, Heart, Key, Compass, Moon, Sun, Flame, Feather, Coins, Star, Volume2
} from 'lucide-react';
import { CategoryItem } from '../../types';
import { 
  PRESET_THUMBNAILS, PRESET_ICONS, 
  normalizeCategoryId, getCategoryFallbackThumbnail, getCategoryFallbackHook 
} from '../../data/defaultCategories';
import { sanitizeImageSource } from '../../utils/articleImageUtils';

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
    iconName: 'Sparkles'
  });
  const [showPresetThumbnails, setShowPresetThumbnails] = useState(false);
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
        iconName: categoryToEdit.iconName || 'FolderOpen'
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
        iconName: 'Sparkles'
      });
    }
    setShowPresetThumbnails(false);
  }, [categoryToEdit, isOpen]);

  const renderIcon = (name: string, size = 16) => {
    switch (name) {
      case 'Sparkles': return <Sparkles size={size} />;
      case 'Shield': return <Shield size={size} />;
      case 'BookOpen': return <BookOpen size={size} />;
      case 'Heart': return <Heart size={size} />;
      case 'Key': return <Key size={size} />;
      case 'Compass': return <Compass size={size} />;
      case 'Moon': return <Moon size={size} />;
      case 'Sun': return <Sun size={size} />;
      case 'Flame': return <Flame size={size} />;
      case 'Feather': return <Feather size={size} />;
      case 'Coins': return <Coins size={size} />;
      case 'Star': return <Star size={size} />;
      case 'Volume2': return <Volume2 size={size} />;
      default: return <FolderOpen size={size} />;
    }
  };

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

    const categoryObj: CategoryItem = {
      id: catId,
      name: trimmedName,
      name_en: formData.name_en.trim() || trimmedName,
      name_ha: formData.name_ha.trim() || trimmedName,
      hook: resolvedHook,
      hook_en: formData.hook_en.trim() || resolvedHook,
      hook_ha: formData.hook_ha.trim() || resolvedHook,
      thumbnail: resolvedThumbnail,
      iconName: formData.iconName || 'FolderOpen',
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
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
              <FolderOpen size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg">
                {categoryToEdit ? "Modifier la Catégorie" : "Créer une Nouvelle Catégorie"}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Avec vignette (thumbnail HD) et phrase d'accroche (hook captivant).
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

          {/* Icons Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Icône Thématique
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              {PRESET_ICONS.map((icon) => (
                <button
                  key={`cat-icon-${icon}`}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, iconName: icon }))}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    formData.iconName === icon
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  title={icon}
                >
                  {renderIcon(icon, 16)}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <Check size={14} />
              <span>{categoryToEdit ? "Mettre à jour la Catégorie" : "Créer la Catégorie"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
