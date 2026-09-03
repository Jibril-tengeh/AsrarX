import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Layers, Sparkles, X, Check, Upload, Image as ImageIcon
} from 'lucide-react';
import { CategoryItem, SubCategoryItem } from '../../types';
import { 
  PRESET_THUMBNAILS, 
  normalizeSubCategoryId, 
  getCategoryFallbackThumbnail, 
  getSubCategoryFallbackHook 
} from '../../data/defaultCategories';
import { sanitizeImageSource } from '../../utils/articleImageUtils';

interface SubCategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  defaultParentId?: string;
  subToEdit?: { parentId: string; sub: SubCategoryItem } | null;
  onSave: (sub: SubCategoryItem, parentCatId: string, oldParentCatId?: string) => Promise<void> | void;
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const SubCategoryEditModal: React.FC<SubCategoryEditModalProps> = ({
  isOpen,
  onClose,
  categories,
  defaultParentId,
  subToEdit,
  onSave,
  onShowToast = () => {}
}) => {
  const [parentId, setParentId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    name_ha: '',
    hook: '',
    hook_en: '',
    hook_ha: '',
    thumbnail: ''
  });
  const [showPresetThumbnails, setShowPresetThumbnails] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (subToEdit) {
      setParentId(subToEdit.parentId);
      const parent = categories.find(c => c.id === subToEdit.parentId);
      setFormData({
        name: subToEdit.sub.name || '',
        name_en: subToEdit.sub.name_en || '',
        name_ha: subToEdit.sub.name_ha || '',
        hook: subToEdit.sub.hook || getSubCategoryFallbackHook(subToEdit.sub.name, parent?.name),
        hook_en: subToEdit.sub.hook_en || '',
        hook_ha: subToEdit.sub.hook_ha || '',
        thumbnail: subToEdit.sub.thumbnail || parent?.thumbnail || getCategoryFallbackThumbnail(subToEdit.sub.name)
      });
    } else {
      const targetParent = defaultParentId || categories[0]?.id || '';
      setParentId(targetParent);
      const parent = categories.find(c => c.id === targetParent);
      setFormData({
        name: '',
        name_en: '',
        name_ha: '',
        hook: '',
        hook_en: '',
        hook_ha: '',
        thumbnail: parent?.thumbnail || PRESET_THUMBNAILS[1].url
      });
    }
    setShowPresetThumbnails(false);
  }, [subToEdit, defaultParentId, isOpen, categories]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast("Veuillez choisir un fichier image valide", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      onShowToast("L'image ne doit pas dépasser 2 Mo", "error");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setFormData(prev => ({ ...prev, thumbnail: dataUrl }));
      setIsUploading(false);
      onShowToast("Vignette téléversée !", "success");
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
      onShowToast("Le nom de la sous-catégorie est obligatoire", "error");
      return;
    }
    if (!parentId) {
      onShowToast("Veuillez sélectionner une catégorie parente", "error");
      return;
    }

    const parentCat = categories.find(c => c.id === parentId);
    const subId = subToEdit?.sub?.id || normalizeSubCategoryId(parentId, trimmedName);
    const resolvedThumbnail = formData.thumbnail.trim() || parentCat?.thumbnail || getCategoryFallbackThumbnail(trimmedName);
    const resolvedHook = formData.hook.trim() || getSubCategoryFallbackHook(trimmedName, parentCat?.name);

    const subObj: SubCategoryItem = {
      id: subId,
      name: trimmedName,
      name_en: formData.name_en.trim() || trimmedName,
      name_ha: formData.name_ha.trim() || trimmedName,
      hook: resolvedHook,
      hook_en: formData.hook_en.trim() || resolvedHook,
      hook_ha: formData.hook_ha.trim() || resolvedHook,
      thumbnail: resolvedThumbnail,
      createdAt: subToEdit?.sub?.createdAt || Date.now()
    };

    setIsSaving(true);
    try {
      await onSave(subObj, parentId, subToEdit?.parentId);
      onClose();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const currentParentCat = categories.find(c => c.id === parentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-850 w-full max-w-lg rounded-3xl shadow-2xl border border-gray-150 dark:border-gray-700 overflow-hidden my-6"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg">
                {subToEdit ? "Modifier la Sous-Catégorie" : "Ajouter une Sous-Catégorie"}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Avec vignette dédiée (thumbnail) et phrase d'accroche (hook).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Parent Selection */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Catégorie Parente *
            </label>
            <select
              value={parentId}
              onChange={(e) => {
                const newPId = e.target.value;
                setParentId(newPId);
                const p = categories.find(c => c.id === newPId);
                if (p && !formData.thumbnail) {
                  setFormData(prev => ({ ...prev, thumbnail: p.thumbnail || '' }));
                }
              }}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs sm:text-sm text-gray-900 dark:text-white font-bold outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={`sub-modal-parent-${c.id}`} value={c.id}>
                  {c.name} ({c.subCategories?.length || 0} sous-catégories)
                </option>
              ))}
            </select>
          </div>

          {/* Sub Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>Nom de la Sous-Catégorie *</span>
              <span className="text-[10px] text-emerald-600 font-bold">Obligatoire</span>
            </label>
            <input
              type="text"
              placeholder="ex: Sourate Al-Waqi'a, Bains Spirituels, Khatims..."
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Multilingual */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Nom (Anglais)</label>
              <input
                type="text"
                placeholder="ex: Surah Al-Waqi'a"
                value={formData.name_en}
                onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 text-xs text-gray-900 dark:text-white outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Nom (Hausa)</label>
              <input
                type="text"
                placeholder="ex: Suratul Waqi'a"
                value={formData.name_ha}
                onChange={(e) => setFormData(prev => ({ ...prev, name_ha: e.target.value }))}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 text-xs text-gray-900 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* Sub Hook */}
          <div className="space-y-1.5 p-3.5 bg-indigo-50/70 dark:bg-indigo-950/20 rounded-2xl border border-indigo-200/70 dark:border-indigo-900/50">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-indigo-950 dark:text-indigo-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-500" />
                <span>Phrase d'Accroche / Hook *</span>
              </label>
              <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-bold">
                Accroche captivante
              </span>
            </div>
            <textarea
              rows={2}
              placeholder="Une phrase percutante décrivant la valeur de cette sous-thématique..."
              value={formData.hook}
              onChange={(e) => setFormData(prev => ({ ...prev, hook: e.target.value }))}
              className="w-full bg-white dark:bg-gray-800 border border-indigo-300 dark:border-indigo-800/80 rounded-xl p-2.5 text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
              <span>Aperçu du texte accrocheur</span>
              <button
                type="button"
                onClick={() => {
                  const sug = getSubCategoryFallbackHook(formData.name || 'Général', currentParentCat?.name);
                  setFormData(prev => ({ ...prev, hook: sug }));
                }}
                className="text-indigo-700 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
              >
                Générer une suggestion
              </button>
            </div>
          </div>

          {/* Sub Thumbnail */}
          <div className="space-y-2 p-3.5 bg-gray-50 dark:bg-gray-800/70 rounded-2xl border border-gray-200 dark:border-gray-700">
            <label className="text-xs font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <ImageIcon size={15} className="text-indigo-500" />
              <span>Vignette (Thumbnail) *</span>
            </label>

            <div className="flex items-center gap-3">
              <div className="w-20 h-16 rounded-xl overflow-hidden bg-gray-900 border border-gray-300 dark:border-gray-600 shrink-0 relative shadow-inner">
                <img
                  src={sanitizeImageSource(formData.thumbnail) || currentParentCat?.thumbnail || PRESET_THUMBNAILS[0].url}
                  alt="Aperçu sous-catégorie"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PRESET_THUMBNAILS[0].url;
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

            {showPresetThumbnails && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  Cliquez sur une vignette pour l'appliquer :
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                  {PRESET_THUMBNAILS.map((preset, pIdx) => (
                    <button
                      key={`sub-modal-preset-${pIdx}`}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, thumbnail: preset.url }));
                        setShowPresetThumbnails(false);
                      }}
                      className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        formData.thumbnail === preset.url
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-9 h-7 rounded-lg object-cover shrink-0" />
                      <span className="text-[10px] font-bold text-gray-900 dark:text-white truncate">{preset.tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <Check size={14} />
              <span>{subToEdit ? "Enregistrer" : "Ajouter la Sous-Catégorie"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
