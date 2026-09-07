import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderOpen, Sparkles, Plus, Edit3, Trash2, Image as ImageIcon,
  Tag, Check, X, Search, Layers, Eye, BookOpen, Shield,
  Heart, Key, Compass, Moon, Sun, Flame, Feather, Coins,
  Star, Volume2, ChevronDown, ChevronUp, RefreshCw, Upload,
  AlertTriangle, CheckCircle2, Copy, LayoutGrid, Square, LayoutList, Crown,
  Grid2X2, Lock, Unlock, Newspaper, Pin, Film, Loader2, Type, Minus
} from 'lucide-react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CategoryItem, SubCategoryItem } from '../../types';
import {
  PRESET_THUMBNAILS, PRESET_ICONS, DEFAULT_CATEGORIES_PRESETS,
  normalizeCategoryId, normalizeSubCategoryId,
  getCategoryFallbackThumbnail, getCategoryFallbackHook, getSubCategoryFallbackHook
} from '../../data/defaultCategories';
import { getCategoryFallbackVideo } from '../../data/categoryIconsData';
import { sanitizeImageSource } from '../../utils/articleImageUtils';
import { CategoryDynamicIcon, CategoryVideoOrIconBadge } from '../common/CategoryDynamicIcon';
import { CategoryIconPickerModal } from './CategoryIconPickerModal';

interface AdminCategoriesManagerProps {
  categories: CategoryItem[];
  setCategories: React.Dispatch<React.SetStateAction<any[]>>;
  articles?: any[];
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  onSelectCategoryForArticle?: (categoryName: string, subCategoryName?: string) => void;
  featureToggles?: any;
  handleToggleFeature?: (featureId: string, currentValue: any, toolLabel?: string) => Promise<void> | void;
}

export const AdminCategoriesManager: React.FC<AdminCategoriesManagerProps> = ({
  categories,
  setCategories,
  articles = [],
  onShowToast = () => {},
  featureToggles = {},
  handleToggleFeature
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Home Page Display Mode Toggles & Fixed/Active Status
  const isHomeOnlyCategories = featureToggles?.home_only_categories_grid === true;
  const isCategoriesEnabled = featureToggles?.home_enable_categories !== false;
  const isArticlesEnabled = featureToggles?.home_enable_articles !== false;

  const isDisplayLocked = 
    featureToggles?.home_lock_display === true ||
    featureToggles?.home_display_mode === 'fixed_categories' ||
    featureToggles?.home_display_mode === 'fixed_articles' ||
    !isCategoriesEnabled ||
    !isArticlesEnabled;

  const currentHomeMode: 'fixed_categories' | 'fixed_articles' | 'free' = 
    !isCategoriesEnabled ? 'fixed_articles' :
    !isArticlesEnabled ? 'fixed_categories' :
    featureToggles?.home_display_mode === 'fixed_categories' ? 'fixed_categories' :
    featureToggles?.home_display_mode === 'fixed_articles' ? 'fixed_articles' :
    featureToggles?.home_lock_display === true ? (isHomeOnlyCategories ? 'fixed_categories' : 'fixed_articles') :
    'free';

  const homeCategoryLayoutMode: 'grid4' | 'grid2' | 'banner' | 'list' =
    featureToggles?.home_categories_layout_mode === 'banner' ? 'banner' :
    featureToggles?.home_categories_layout_mode === 'list' ? 'list' :
    featureToggles?.home_categories_layout_mode === 'grid2' ? 'grid2' : 'grid4';

  const showHooksOnHome = featureToggles?.home_categories_show_hooks !== false;
  const showCountsOnHome = featureToggles?.home_categories_show_counts !== false;
  const showSubCountsOnHome = featureToggles?.home_categories_show_sub_counts !== false;
  const showSliderOnHome = featureToggles?.home_categories_show_slider !== false;
  const showTextsOnHome = featureToggles?.home_categories_show_texts !== false && featureToggles?.home_categories_show_header !== false;
  const showBadgeOnHome = featureToggles?.home_categories_show_badge !== false;
  const showTitleOnHome = featureToggles?.home_categories_show_title !== false;
  const showSubtitleOnHome = featureToggles?.home_categories_show_subtitle !== false;
  const showCategoryNamesOnHome = featureToggles?.home_categories_show_names !== false;
  const homeCategoryTitleSize: number = Number(featureToggles?.home_categories_title_size || featureToggles?.textSizeCategoryTitle) || 13;

  const [isUpdatingToggle, setIsUpdatingToggle] = useState(false);

  // Set Master Home Display Mode (Fixed Categories, Fixed Articles, or Free)
  const handleSetDisplayMode = async (mode: 'fixed_categories' | 'fixed_articles' | 'free') => {
    setIsUpdatingToggle(true);
    try {
      const payload: Record<string, any> = {
        home_display_mode: mode,
        home_lock_display: mode !== 'free',
        home_only_categories_grid: mode === 'fixed_categories',
        home_enable_categories: true,
        home_enable_articles: true,
      };

      if (handleToggleFeature) {
        await handleToggleFeature('home_display_mode', mode, `Mode Accueil : ${mode}`);
      } else {
        await setDoc(doc(db, 'settings', 'features'), payload, { merge: true });
        const localFontSaved = localStorage.getItem('asrar_font_toggles');
        let localObj = localFontSaved ? JSON.parse(localFontSaved) : {};
        Object.assign(localObj, payload);
        localStorage.setItem('asrar_font_toggles', JSON.stringify(localObj));
        window.dispatchEvent(new Event('asrar_font_updated'));
      }

      const label = 
        mode === 'fixed_categories' ? "Affichage de l'accueil FIXÉ sur : Catégories uniquement (Verrouillé)" :
        mode === 'fixed_articles' ? "Affichage de l'accueil FIXÉ sur : Articles uniquement (Verrouillé)" :
        "Mode libre activé : L'utilisateur peut alterner librement entre Catégories et Articles.";
      onShowToast(label, "success");
    } catch (e: any) {
      console.warn("Display mode error:", e);
      onShowToast("Erreur lors de la mise à jour : " + (e.message || ''), "error");
    } finally {
      setIsUpdatingToggle(false);
    }
  };

  // Toggle Categories Enabled on Home
  const handleToggleCategoriesEnabled = async () => {
    const targetVal = !isCategoriesEnabled;
    setIsUpdatingToggle(true);
    try {
      if (handleToggleFeature) {
        await handleToggleFeature('home_enable_categories', targetVal, "Catégories sur l'accueil");
      } else {
        await setDoc(doc(db, 'settings', 'features'), { home_enable_categories: targetVal }, { merge: true });
      }
      onShowToast(targetVal ? "Catégories activées sur l'accueil." : "Catégories désactivées sur l'accueil.", "info");
    } catch (e: any) {
      onShowToast("Erreur : " + e.message, "error");
    } finally {
      setIsUpdatingToggle(false);
    }
  };

  // Toggle Articles Enabled on Home
  const handleToggleArticlesEnabled = async () => {
    const targetVal = !isArticlesEnabled;
    setIsUpdatingToggle(true);
    try {
      if (handleToggleFeature) {
        await handleToggleFeature('home_enable_articles', targetVal, "Articles sur l'accueil");
      } else {
        await setDoc(doc(db, 'settings', 'features'), { home_enable_articles: targetVal }, { merge: true });
      }
      onShowToast(targetVal ? "Flux d'articles activé sur l'accueil." : "Flux d'articles désactivé sur l'accueil.", "info");
    } catch (e: any) {
      onShowToast("Erreur : " + e.message, "error");
    } finally {
      setIsUpdatingToggle(false);
    }
  };

  // Toggle Lock (Make Fixed / Free)
  const handleToggleLockDisplay = async () => {
    const targetVal = !isDisplayLocked;
    setIsUpdatingToggle(true);
    try {
      if (handleToggleFeature) {
        await handleToggleFeature('home_lock_display', targetVal, "Verrouillage de l'affichage");
      } else {
        await setDoc(doc(db, 'settings', 'features'), { home_lock_display: targetVal }, { merge: true });
      }
      onShowToast(targetVal ? "Affichage rendu fixe (verrouillé pour les utilisateurs)." : "Affichage déverrouillé (mode libre pour l'utilisateur).", "info");
    } catch (e: any) {
      onShowToast("Erreur : " + e.message, "error");
    } finally {
      setIsUpdatingToggle(false);
    }
  };

  const handleToggleHomeOnlyCategories = async (newVal?: boolean) => {
    const targetVal = newVal !== undefined ? newVal : !isHomeOnlyCategories;
    setIsUpdatingToggle(true);
    try {
      if (handleToggleFeature) {
        await handleToggleFeature('home_only_categories_grid', targetVal, "Affichage Accueil (Catégories)");
      } else {
        await setDoc(doc(db, 'settings', 'features'), { home_only_categories_grid: targetVal }, { merge: true });
        const localFontSaved = localStorage.getItem('asrar_font_toggles');
        let localObj = localFontSaved ? JSON.parse(localFontSaved) : {};
        localObj.home_only_categories_grid = targetVal;
        localStorage.setItem('asrar_font_toggles', JSON.stringify(localObj));
        window.dispatchEvent(new Event('asrar_font_updated'));
      }
      onShowToast(
        targetVal
          ? "Page d'accueil : Affichage exclusif des catégories activé !"
          : "Page d'accueil : Flux standard complet réactivé.",
        "success"
      );
    } catch (e: any) {
      console.warn("Toggle error:", e);
      onShowToast("Erreur lors de la mise à jour : " + (e.message || ''), "error");
    } finally {
      setIsUpdatingToggle(false);
    }
  };

  const handleSelectLayoutMode = async (mode: 'grid4' | 'grid2' | 'banner' | 'list') => {
    setIsUpdatingToggle(true);
    try {
      if (handleToggleFeature) {
        await handleToggleFeature('home_categories_layout_mode', mode, `Modèle Catégories : ${mode}`);
        if (!isHomeOnlyCategories) {
          await handleToggleFeature('home_only_categories_grid', true);
        }
      } else {
        await setDoc(doc(db, 'settings', 'features'), {
          home_categories_layout_mode: mode,
          home_only_categories_grid: true
        }, { merge: true });
        const localFontSaved = localStorage.getItem('asrar_font_toggles');
        let localObj = localFontSaved ? JSON.parse(localFontSaved) : {};
        localObj.home_categories_layout_mode = mode;
        localObj.home_only_categories_grid = true;
        localStorage.setItem('asrar_font_toggles', JSON.stringify(localObj));
        window.dispatchEvent(new Event('asrar_font_updated'));
      }

      const label =
        mode === 'grid4' ? "Modèle 1 : Grille 4 Colonnes (Icônes & Badges)" :
        mode === 'banner' ? "Modèle 3 : Grande Carte / Bannière (1 Colonne)" :
        mode === 'list' ? "Modèle 4 : Liste Horizontale Compacte" :
        "Modèle 2 : Grille 2 Colonnes";

      onShowToast(`Modèle activé : ${label}`, "success");
    } catch (e: any) {
      console.warn("Layout mode error:", e);
      onShowToast("Erreur lors de la sélection du modèle : " + (e.message || ''), "error");
    } finally {
      setIsUpdatingToggle(false);
    }
  };

  // Articles Display Mode (home_articles_layout)
  const currentArticlesLayout: 'grid2' | 'grid1' | 'list' =
    featureToggles?.home_articles_layout === 'grid' || featureToggles?.home_articles_layout === 'grid2' ? 'grid2' :
    featureToggles?.home_articles_layout === 'list' ? 'list' : 'grid1';

  const isArticlesLayoutFree = featureToggles?.home_articles_layout_free !== false;

  const handleSelectArticlesLayout = async (mode: 'grid2' | 'grid1' | 'list') => {
    setIsUpdatingToggle(true);
    const dbValue = mode === 'grid2' ? 'grid' : mode === 'grid1' ? 'large' : 'list';
    try {
      if (handleToggleFeature) {
        await handleToggleFeature('home_articles_layout', dbValue, `Disposition Articles : ${mode}`);
        await handleToggleFeature('articles_layout_mode', dbValue);
      } else {
        await setDoc(doc(db, 'settings', 'features'), {
          home_articles_layout: dbValue,
          articles_layout_mode: dbValue
        }, { merge: true });
        const localFontSaved = localStorage.getItem('asrar_font_toggles');
        let localObj = localFontSaved ? JSON.parse(localFontSaved) : {};
        localObj.home_articles_layout = dbValue;
        localObj.articles_layout_mode = dbValue;
        localStorage.setItem('asrar_font_toggles', JSON.stringify(localObj));
        window.dispatchEvent(new Event('asrar_font_updated'));
      }

      const label =
        mode === 'grid1' ? "Modèle 2 : Grand Format (1 Colonne)" :
        mode === 'list' ? "Modèle 3 : Liste Compacte" :
        "Modèle 1 : Grille 2 Colonnes";

      onShowToast(`Modèle des articles défini : ${label}`, "success");
    } catch (e: any) {
      console.warn("Articles layout error:", e);
      onShowToast("Erreur lors de la sélection du modèle : " + (e.message || ''), "error");
    } finally {
      setIsUpdatingToggle(false);
    }
  };

  const handleToggleArticlesLayoutFree = async () => {
    const nextVal = !isArticlesLayoutFree;
    setIsUpdatingToggle(true);
    try {
      if (handleToggleFeature) {
        await handleToggleFeature('home_articles_layout_free', nextVal, "Liberté de choix de disposition");
      } else {
        await setDoc(doc(db, 'settings', 'features'), {
          home_articles_layout_free: nextVal,
          home_articles_layout_locked: !nextVal
        }, { merge: true });
        const localFontSaved = localStorage.getItem('asrar_font_toggles');
        let localObj = localFontSaved ? JSON.parse(localFontSaved) : {};
        localObj.home_articles_layout_free = nextVal;
        localObj.home_articles_layout_locked = !nextVal;
        localStorage.setItem('asrar_font_toggles', JSON.stringify(localObj));
        window.dispatchEvent(new Event('asrar_font_updated'));
      }
      onShowToast(
        nextVal
          ? "Les utilisateurs peuvent désormais changer librement le modèle d'affichage des articles."
          : "Le modèle d'affichage sélectionné est désormais imposé à tous les utilisateurs.",
        "info"
      );
    } catch (e: any) {
      console.warn("Toggle free error:", e);
      onShowToast("Erreur lors de la mise à jour", "error");
    } finally {
      setIsUpdatingToggle(false);
    }
  };

  const handleToggleHomeSubOption = async (optionKey: string, currentVal: boolean) => {
    const nextVal = !currentVal;
    try {
      if (optionKey === 'home_categories_show_texts' || optionKey === 'home_categories_show_header') {
        if (handleToggleFeature) {
          await handleToggleFeature('home_categories_show_texts', nextVal, "Textes d'en-tête Catégories");
        }
        await setDoc(doc(db, 'settings', 'features'), { 
          home_categories_show_texts: nextVal,
          home_categories_show_header: nextVal 
        }, { merge: true });
        const localFontSaved = localStorage.getItem('asrar_font_toggles');
        let localObj = localFontSaved ? JSON.parse(localFontSaved) : {};
        localObj['home_categories_show_texts'] = nextVal;
        localObj['home_categories_show_header'] = nextVal;
        localStorage.setItem('asrar_font_toggles', JSON.stringify(localObj));
      } else {
        if (handleToggleFeature) {
          await handleToggleFeature(optionKey, nextVal);
        }
        await setDoc(doc(db, 'settings', 'features'), { [optionKey]: nextVal }, { merge: true });
        const localFontSaved = localStorage.getItem('asrar_font_toggles');
        let localObj = localFontSaved ? JSON.parse(localFontSaved) : {};
        localObj[optionKey] = nextVal;
        localStorage.setItem('asrar_font_toggles', JSON.stringify(localObj));
      }
      window.dispatchEvent(new Event('asrar_font_updated'));
      onShowToast(
        nextVal
          ? "Élément textuel activé sur l'accueil."
          : "Élément textuel désactivé de l'accueil.",
        "success"
      );
    } catch (e) {
      console.warn("Option error:", e);
      onShowToast("Erreur lors de la mise à jour de l'option.", "error");
    }
  };

  const handleUpdateCategoryTitleSize = async (newSize: number) => {
    const clamped = Math.max(10, Math.min(24, Math.round(newSize)));
    try {
      if (handleToggleFeature) {
        await handleToggleFeature('home_categories_title_size', clamped, `Taille titres catégories : ${clamped}px`);
      }
      await setDoc(doc(db, 'settings', 'features'), { 
        home_categories_title_size: clamped,
        textSizeCategoryTitle: clamped
      }, { merge: true });

      const localFontSaved = localStorage.getItem('asrar_font_toggles');
      let localObj = localFontSaved ? JSON.parse(localFontSaved) : {};
      localObj['home_categories_title_size'] = clamped;
      localObj['textSizeCategoryTitle'] = clamped;
      localStorage.setItem('asrar_font_toggles', JSON.stringify(localObj));
      window.dispatchEvent(new Event('asrar_font_updated'));
      onShowToast(`Taille des titres définie à ${clamped}px`, "success");
    } catch (e) {
      console.warn("Category title size error:", e);
      onShowToast("Erreur lors de la modification de la taille.", "error");
    }
  };

  // Category Edit Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isIconPickerModalOpen, setIsIconPickerModalOpen] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    name_en: '',
    name_ha: '',
    hook: '',
    hook_en: '',
    hook_ha: '',
    thumbnail: '',
    iconName: 'FolderOpen',
    videoUrl: ''
  });

  // SubCategory Edit Modal State
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<{ parentId: string; sub: SubCategoryItem } | null>(null);
  const [subCategoryParentId, setSubCategoryParentId] = useState<string>('');
  const [subCategoryFormData, setSubCategoryFormData] = useState({
    name: '',
    name_en: '',
    name_ha: '',
    hook: '',
    hook_en: '',
    hook_ha: '',
    thumbnail: ''
  });

  // Delete Modals State
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<{ parentCat: CategoryItem; sub: SubCategoryItem } | null>(null);

  // Preset picker toggles
  const [showCatPresetThumbnails, setShowCatPresetThumbnails] = useState(false);
  const [showSubPresetThumbnails, setShowSubPresetThumbnails] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const catFileInputRef = useRef<HTMLInputElement>(null);
  const subFileInputRef = useRef<HTMLInputElement>(null);

  // Toggle category subcategories expansion
  const toggleExpandCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: prev[catId] === undefined ? false : !prev[catId]
    }));
  };

  // Helper icon renderer - dynamically resolves 520+ icons with vibrant non-black colors
  const renderIcon = (name: string, size = 24, className = '') => {
    return <CategoryDynamicIcon name={name} size={size} className={className} />;
  };

  // Calculate article counts per category and subcategory
  const articleCounts = useMemo(() => {
    const counts: Record<string, { total: number; subs: Record<string, number> }> = {};
    (articles || []).forEach(art => {
      const cat = (art.category || '').toString().trim().toLowerCase();
      const sub = (art.subCategory || '').toString().trim().toLowerCase();
      if (!counts[cat]) counts[cat] = { total: 0, subs: {} };
      counts[cat].total += 1;
      if (sub) {
        counts[cat].subs[sub] = (counts[cat].subs[sub] || 0) + 1;
      }
    });
    return counts;
  }, [articles]);

  const getArticleCountForCategory = (cat: CategoryItem) => {
    const catNameLower = (cat.name || '').toLowerCase().trim();
    const catIdLower = (cat.id || '').toLowerCase().trim();
    return (articleCounts[catNameLower]?.total || 0) + (articleCounts[catIdLower]?.total || 0);
  };

  const getArticleCountForSubCategory = (cat: CategoryItem, sub: SubCategoryItem) => {
    const catNameLower = (cat.name || '').toLowerCase().trim();
    const catIdLower = (cat.id || '').toLowerCase().trim();
    const subNameLower = (sub.name || '').toLowerCase().trim();
    const subIdLower = (sub.id || '').toLowerCase().trim();

    const fromName = articleCounts[catNameLower]?.subs[subNameLower] || 0;
    const fromId = articleCounts[catIdLower]?.subs[subIdLower] || 0;
    return Math.max(fromName, fromId);
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(cat => {
      const matchCat = (cat.name || '').toLowerCase().includes(q)
        || (cat.hook || '').toLowerCase().includes(q)
        || (cat.name_en || '').toLowerCase().includes(q)
        || (cat.name_ha || '').toLowerCase().includes(q);
      const matchSub = (cat.subCategories || []).some(sub =>
        (sub.name || '').toLowerCase().includes(q)
        || (sub.hook || '').toLowerCase().includes(q)
        || (sub.name_en || '').toLowerCase().includes(q)
        || (sub.name_ha || '').toLowerCase().includes(q)
      );
      return matchCat || matchSub;
    });
  }, [categories, searchQuery]);

  // Overall totals
  const totalSubCategoriesCount = useMemo(() => {
    return categories.reduce((acc, cat) => acc + (cat.subCategories?.length || 0), 0);
  }, [categories]);

  // Open Create Category Modal
  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
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
    setShowCatPresetThumbnails(false);
    setIsCategoryModalOpen(true);
  };

  // Open Edit Category Modal
  const handleOpenEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCategoryFormData({
      name: cat.name || '',
      name_en: cat.name_en || '',
      name_ha: cat.name_ha || '',
      hook: cat.hook || getCategoryFallbackHook(cat.name),
      hook_en: cat.hook_en || '',
      hook_ha: cat.hook_ha || '',
      thumbnail: cat.thumbnail || getCategoryFallbackThumbnail(cat.name),
      iconName: cat.iconName || 'FolderOpen',
      videoUrl: cat.videoUrl || ''
    });
    setShowCatPresetThumbnails(false);
    setIsCategoryModalOpen(true);
  };

  // Open Create SubCategory Modal
  const handleOpenCreateSubCategory = (parentCatId?: string) => {
    setEditingSubCategory(null);
    const targetParentId = parentCatId || categories[0]?.id || '';
    setSubCategoryParentId(targetParentId);
    const parentCat = categories.find(c => c.id === targetParentId);
    setSubCategoryFormData({
      name: '',
      name_en: '',
      name_ha: '',
      hook: '',
      hook_en: '',
      hook_ha: '',
      thumbnail: parentCat?.thumbnail || PRESET_THUMBNAILS[1].url
    });
    setShowSubPresetThumbnails(false);
    setIsSubCategoryModalOpen(true);
  };

  // Open Edit SubCategory Modal
  const handleOpenEditSubCategory = (parentCatId: string, sub: SubCategoryItem) => {
    setEditingSubCategory({ parentId: parentCatId, sub });
    setSubCategoryParentId(parentCatId);
    const parentCat = categories.find(c => c.id === parentCatId);
    setSubCategoryFormData({
      name: sub.name || '',
      name_en: sub.name_en || '',
      name_ha: sub.name_ha || '',
      hook: sub.hook || getSubCategoryFallbackHook(sub.name, parentCat?.name),
      hook_en: sub.hook_en || '',
      hook_ha: sub.hook_ha || '',
      thumbnail: sub.thumbnail || parentCat?.thumbnail || getCategoryFallbackThumbnail(sub.name)
    });
    setShowSubPresetThumbnails(false);
    setIsSubCategoryModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = async () => {
    const trimmedName = categoryFormData.name.trim();
    if (!trimmedName) {
      onShowToast("Le nom de la catégorie est obligatoire", "error");
      return;
    }

    const catId = editingCategory ? editingCategory.id : (normalizeCategoryId(trimmedName) || ('cat-' + Date.now()));
    if (!catId) {
      onShowToast("Nom de catégorie invalide", "error");
      return;
    }

    const resolvedThumbnail = categoryFormData.thumbnail.trim() || getCategoryFallbackThumbnail(trimmedName);
    const resolvedHook = categoryFormData.hook.trim() || getCategoryFallbackHook(trimmedName);
    const resolvedVideo = categoryFormData.videoUrl.trim() || getCategoryFallbackVideo(trimmedName);

    const categoryObj: CategoryItem = {
      id: catId,
      name: trimmedName,
      name_en: categoryFormData.name_en.trim() || trimmedName,
      name_ha: categoryFormData.name_ha.trim() || trimmedName,
      hook: resolvedHook,
      hook_en: categoryFormData.hook_en.trim() || resolvedHook,
      hook_ha: categoryFormData.hook_ha.trim() || resolvedHook,
      thumbnail: resolvedThumbnail,
      iconName: categoryFormData.iconName || 'Sparkles',
      videoUrl: resolvedVideo,
      subCategories: editingCategory?.subCategories || [],
      createdAt: editingCategory?.createdAt || Date.now()
    };

    // Clean data payload for Firestore (ensure no field is undefined)
    const firestorePayload: Record<string, any> = {
      id: categoryObj.id,
      name: categoryObj.name,
      name_en: categoryObj.name_en || categoryObj.name,
      name_ha: categoryObj.name_ha || categoryObj.name,
      hook: categoryObj.hook || '',
      hook_en: categoryObj.hook_en || '',
      hook_ha: categoryObj.hook_ha || '',
      thumbnail: categoryObj.thumbnail || '',
      iconName: categoryObj.iconName || 'Sparkles',
      videoUrl: categoryObj.videoUrl || '',
      subCategories: categoryObj.subCategories || [],
      createdAt: categoryObj.createdAt || Date.now()
    };

    setIsSavingCategory(true);
    try {
      await setDoc(doc(db, 'categories', catId), firestorePayload, { merge: true });

      setCategories(prev => {
        const exists = prev.some(c => c.id === catId);
        const updated = exists ? prev.map(c => c.id === catId ? categoryObj : c) : [...prev, categoryObj];
        try { localStorage.setItem('asrarhub_cached_categories', JSON.stringify(updated)); } catch (e) {}
        return updated;
      });

      onShowToast(editingCategory ? "Catégorie mise à jour avec succès !" : "Nouvelle catégorie créée avec succès !", "success");
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      console.error("Error saving category:", err);
      onShowToast("Erreur lors de l'enregistrement: " + (err?.message || "Erreur inconnue"), "error");
    } finally {
      setIsSavingCategory(false);
    }
  };

  // Save SubCategory
  const handleSaveSubCategory = async () => {
    const trimmedName = subCategoryFormData.name.trim();
    if (!trimmedName) {
      onShowToast("Le nom de la sous-catégorie est obligatoire", "error");
      return;
    }
    if (!subCategoryParentId) {
      onShowToast("Veuillez sélectionner une catégorie parente", "error");
      return;
    }

    const parentCat = categories.find(c => c.id === subCategoryParentId);
    if (!parentCat) {
      onShowToast("Catégorie parente introuvable", "error");
      return;
    }

    const subId = editingSubCategory?.sub?.id || normalizeSubCategoryId(subCategoryParentId, trimmedName);
    const resolvedThumbnail = subCategoryFormData.thumbnail.trim() || parentCat.thumbnail || getCategoryFallbackThumbnail(trimmedName);
    const resolvedHook = subCategoryFormData.hook.trim() || getSubCategoryFallbackHook(trimmedName, parentCat.name);

    const subObj: SubCategoryItem = {
      id: subId,
      name: trimmedName,
      name_en: subCategoryFormData.name_en.trim() || trimmedName,
      name_ha: subCategoryFormData.name_ha.trim() || trimmedName,
      hook: resolvedHook,
      hook_en: subCategoryFormData.hook_en.trim() || resolvedHook,
      hook_ha: subCategoryFormData.hook_ha.trim() || resolvedHook,
      thumbnail: resolvedThumbnail,
      createdAt: editingSubCategory?.sub?.createdAt || Date.now()
    };

    const existingSubs = parentCat.subCategories || [];
    let updatedSubs: SubCategoryItem[];

    if (editingSubCategory) {
      // If moving to another parent
      if (editingSubCategory.parentId !== subCategoryParentId) {
        // Remove from old parent
        const oldParent = categories.find(c => c.id === editingSubCategory.parentId);
        if (oldParent) {
          const cleanedOldSubs = (oldParent.subCategories || []).filter(s => s.id !== editingSubCategory.sub.id);
          try {
            await setDoc(doc(db, 'categories', oldParent.id), { subCategories: cleanedOldSubs }, { merge: true });
          } catch (e) {}
        }
        updatedSubs = [...existingSubs.filter(s => s.id !== subId), subObj];
      } else {
        updatedSubs = existingSubs.map(s => s.id === subId ? subObj : s);
      }
    } else {
      updatedSubs = [...existingSubs.filter(s => s.id !== subId), subObj];
    }

    try {
      await setDoc(doc(db, 'categories', subCategoryParentId), { subCategories: updatedSubs }, { merge: true });

      setCategories(prev => {
        let nextList = prev.map(c => {
          if (editingSubCategory && editingSubCategory.parentId !== subCategoryParentId && c.id === editingSubCategory.parentId) {
            return { ...c, subCategories: (c.subCategories || []).filter(s => s.id !== editingSubCategory.sub.id) };
          }
          if (c.id === subCategoryParentId) {
            return { ...c, subCategories: updatedSubs };
          }
          return c;
        });
        try { localStorage.setItem('asrarhub_cached_categories', JSON.stringify(nextList)); } catch (e) {}
        return nextList;
      });

      // Ensure target parent is expanded so user sees their new subcategory
      setExpandedCategories(prev => ({ ...prev, [subCategoryParentId]: true }));

      onShowToast(editingSubCategory ? "Sous-catégorie mise à jour avec succès !" : "Sous-catégorie ajoutée avec succès !", "success");
      setIsSubCategoryModalOpen(false);
    } catch (err: any) {
      console.error("Error saving subcategory:", err);
      onShowToast("Erreur lors de l'enregistrement: " + err.message, "error");
    }
  };

  // Confirm Delete Category
  const handleExecuteDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteDoc(doc(db, 'categories', categoryToDelete.id));

      setCategories(prev => {
        const next = prev.filter(c => c.id !== categoryToDelete.id);
        try {
          localStorage.setItem('asrarhub_cached_categories', JSON.stringify(next));
          const deleted = JSON.parse(localStorage.getItem('asrarhub_deleted_categories') || '[]');
          if (!deleted.includes(categoryToDelete.id)) {
            deleted.push(categoryToDelete.id);
            localStorage.setItem('asrarhub_deleted_categories', JSON.stringify(deleted));
          }
        } catch (e) {}
        return next;
      });

      onShowToast("Catégorie supprimée avec succès", "info");
      setCategoryToDelete(null);
    } catch (err: any) {
      onShowToast("Erreur lors de la suppression: " + err.message, "error");
    }
  };

  // Confirm Delete SubCategory
  const handleExecuteDeleteSubCategory = async () => {
    if (!subCategoryToDelete) return;
    const { parentCat, sub } = subCategoryToDelete;
    try {
      const updatedSubs = (parentCat.subCategories || []).filter(s => s.id !== sub.id);
      await setDoc(doc(db, 'categories', parentCat.id), { subCategories: updatedSubs }, { merge: true });

      setCategories(prev => {
        const next = prev.map(c => c.id === parentCat.id ? { ...c, subCategories: updatedSubs } : c);
        try { localStorage.setItem('asrarhub_cached_categories', JSON.stringify(next)); } catch (e) {}
        return next;
      });

      onShowToast("Sous-catégorie supprimée avec succès", "info");
      setSubCategoryToDelete(null);
    } catch (err: any) {
      onShowToast("Erreur lors de la suppression: " + err.message, "error");
    }
  };

  // Restore Default Presets with high quality hooks & thumbnails
  const handleRestoreDefaultPresets = async () => {
    if (!window.confirm("Voulez-vous fusionner et restaurer les catégories par défaut avec leurs vignettes HD et phrases d'accroche ?")) {
      return;
    }
    try {
      for (const preset of DEFAULT_CATEGORIES_PRESETS) {
        await setDoc(doc(db, 'categories', preset.id), preset, { merge: true });
      }

      setCategories(prev => {
        const map = new Map<string, CategoryItem>();
        DEFAULT_CATEGORIES_PRESETS.forEach(p => map.set(p.id, p));
        prev.forEach(p => {
          if (!map.has(p.id)) map.set(p.id, p);
        });
        const combined = Array.from(map.values());
        try {
          localStorage.setItem('asrarhub_cached_categories', JSON.stringify(combined));
          localStorage.removeItem('asrarhub_deleted_categories');
        } catch (e) {}
        return combined;
      });

      onShowToast("Catégories et sous-catégories par défaut restaurées avec succès !", "success");
    } catch (err: any) {
      onShowToast("Erreur lors de la restauration: " + err.message, "error");
    }
  };

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isCategory: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast("Veuillez sélectionner un fichier image valide", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      onShowToast("L'image ne doit pas dépasser 2 Mo pour un affichage optimal", "error");
      return;
    }

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (isCategory) {
        setCategoryFormData(prev => ({ ...prev, thumbnail: dataUrl }));
      } else {
        setSubCategoryFormData(prev => ({ ...prev, thumbnail: dataUrl }));
      }
      setIsUploadingImage(false);
      onShowToast("Vignette téléversée avec succès !", "success");
    };
    reader.onerror = () => {
      setIsUploadingImage(false);
      onShowToast("Erreur lors du traitement de l'image", "error");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      {/* Top Banner & Action Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-2xl">
                <FolderOpen size={24} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Catégories & Sous-Catégories</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold">
                    HD & Hooks
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Configurez des vignettes (thumbnails) soignées et des accroches (hooks) captivantes pour chaque thématique.
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-750 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <FolderOpen size={14} className="text-amber-500" />
                <span><strong>{categories.length}</strong> Catégories Principales</span>
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-750 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Layers size={14} className="text-indigo-500" />
                <span><strong>{totalSubCategoriesCount}</strong> Sous-Catégories</span>
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-750 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Tag size={14} className="text-emerald-500" />
                <span><strong>{articles.length}</strong> Articles Référencés</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenCreateCategory}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Nouvelle Catégorie</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenCreateSubCategory()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Layers size={16} />
              <span>Ajouter Sous-Catégorie</span>
            </button>
            <button
              type="button"
              onClick={handleRestoreDefaultPresets}
              className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-750 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
              title="Restaurer les vignettes et accroches par défaut"
            >
              <RefreshCw size={15} />
              <span className="hidden sm:inline font-semibold">Préréglages HD</span>
            </button>
          </div>
        </div>

        {/* Home Page Categories & Articles Master Display Control (Fixed / Active / Toggle) */}
        <div className="mt-5 p-4 sm:p-6 bg-gradient-to-br from-emerald-50 via-teal-50/30 to-white dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-gray-800 rounded-2xl sm:rounded-3xl border-2 border-emerald-200/80 dark:border-emerald-800/80 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                  <Pin size={18} />
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white">
                  Affichage Accueil : Fixer ou Basculer (Catégories vs Articles)
                </h3>
                {currentHomeMode === 'fixed_categories' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                    <Lock size={11} className="text-emerald-600 dark:text-emerald-400" />
                    FIXE : Catégories Uniquement
                  </span>
                ) : currentHomeMode === 'fixed_articles' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 flex items-center gap-1">
                    <Lock size={11} className="text-indigo-600 dark:text-indigo-400" />
                    FIXE : Articles Uniquement
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                    <Unlock size={11} className="text-amber-600 dark:text-amber-400" />
                    MODE LIBRE (Choix Utilisateur)
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                Activez, désactivez ou rendez <strong>FIXE</strong> l'affichage par Catégories ou par Articles. En mode fixe, l'accueil est verrouillé pour tous les visiteurs et les boutons de bascule sont masqués.
              </p>
            </div>

            {/* Quick Lock/Unlock Status */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-center bg-white dark:bg-gray-800 p-1.5 px-3 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                {isDisplayLocked ? (
                  <>
                    <Lock size={14} className="text-rose-500" />
                    <span>Verrouillé (Fixe)</span>
                  </>
                ) : (
                  <>
                    <Unlock size={14} className="text-emerald-500" />
                    <span>Mode Libre</span>
                  </>
                )}
              </span>
              <button
                type="button"
                disabled={isUpdatingToggle}
                onClick={handleToggleLockDisplay}
                className={`ml-1 text-[11px] font-extrabold px-2.5 py-1 rounded-xl cursor-pointer transition-all ${
                  isDisplayLocked 
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100' 
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                }`}
                title="Basculer entre mode fixe ou libre"
              >
                {isDisplayLocked ? 'Déverrouiller' : 'Rendre Fixe'}
              </button>
            </div>
          </div>

          {/* 3 Master Mode Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {/* Mode 1: Fixed Categories */}
            <div
              onClick={() => handleSetDisplayMode('fixed_categories')}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                currentHomeMode === 'fixed_categories'
                  ? 'border-emerald-500 bg-white dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 hover:border-emerald-300'
              }`}
            >
              {currentHomeMode === 'fixed_categories' && (
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center gap-1 shadow-xs">
                  <Check size={11} /> ACTIF FIXE
                </div>
              )}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${currentHomeMode === 'fixed_categories' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-750 dark:text-gray-400'}`}>
                    <FolderOpen size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                      Fixer sur Catégories
                      <Lock size={12} className="text-emerald-600 dark:text-emerald-400" />
                    </h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      Accueil = Thèmes / Grille
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed pt-1">
                  Les utilisateurs voient exclusivement la grille de vos catégories. Le choix est fixe et non modifiable par les visiteurs.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[11px] font-bold">
                <span className={currentHomeMode === 'fixed_categories' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}>
                  {currentHomeMode === 'fixed_categories' ? '✓ Actuel (Verrouillé)' : 'Appliquer ce mode'}
                </span>
                <span className="text-[10px] text-gray-400">Accueil 100% Catégories</span>
              </div>
            </div>

            {/* Mode 2: Fixed Articles */}
            <div
              onClick={() => handleSetDisplayMode('fixed_articles')}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                currentHomeMode === 'fixed_articles'
                  ? 'border-indigo-500 bg-white dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-500/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 hover:border-indigo-300'
              }`}
            >
              {currentHomeMode === 'fixed_articles' && (
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-black flex items-center gap-1 shadow-xs">
                  <Check size={11} /> ACTIF FIXE
                </div>
              )}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${currentHomeMode === 'fixed_articles' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-750 dark:text-gray-400'}`}>
                    <Newspaper size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                      Fixer sur Articles
                      <Lock size={12} className="text-indigo-600 dark:text-indigo-400" />
                    </h4>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                      Accueil = Flux d'articles
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed pt-1">
                  Les utilisateurs arrivent directement sur le flux continu des articles et secrets. L'affichage est fixé et ne peut pas être changé.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[11px] font-bold">
                <span className={currentHomeMode === 'fixed_articles' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}>
                  {currentHomeMode === 'fixed_articles' ? '✓ Actuel (Verrouillé)' : 'Appliquer ce mode'}
                </span>
                <span className="text-[10px] text-gray-400">Accueil 100% Articles</span>
              </div>
            </div>

            {/* Mode 3: Free User Choice */}
            <div
              onClick={() => handleSetDisplayMode('free')}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                currentHomeMode === 'free'
                  ? 'border-amber-500 bg-white dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 hover:border-amber-300'
              }`}
            >
              {currentHomeMode === 'free' && (
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center gap-1 shadow-xs">
                  <Check size={11} /> ACTIF LIBRE
                </div>
              )}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${currentHomeMode === 'free' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-750 dark:text-gray-400'}`}>
                    <Unlock size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                      Mode Libre
                      <Unlock size={12} className="text-amber-600 dark:text-amber-400" />
                    </h4>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                      Choix libre de l'utilisateur
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed pt-1">
                  Les deux affichages sont actifs. L'utilisateur peut basculer facilement entre Catégories et Articles grâce au sélecteur sur l'accueil.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[11px] font-bold">
                <span className={currentHomeMode === 'free' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'}>
                  {currentHomeMode === 'free' ? '✓ Actuel (Libre)' : 'Appliquer ce mode'}
                </span>
                <span className="text-[10px] text-gray-400">Boutons visibles</span>
              </div>
            </div>
          </div>

          {/* Individual Toggle Switches */}
          <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {/* Toggle Categories */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isUpdatingToggle}
                  onClick={handleToggleCategoriesEnabled}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isCategoriesEnabled ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-650'
                  }`}
                  title={isCategoriesEnabled ? "Désactiver les catégories sur l'accueil" : "Activer les catégories sur l'accueil"}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isCategoriesEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Afficher Catégories {isCategoriesEnabled ? '(Activé)' : '(Désactivé)'}
                </span>
              </div>

              {/* Toggle Articles */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isUpdatingToggle}
                  onClick={handleToggleArticlesEnabled}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isArticlesEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-650'
                  }`}
                  title={isArticlesEnabled ? "Désactiver le flux d'articles sur l'accueil" : "Activer le flux d'articles sur l'accueil"}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isArticlesEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Afficher Flux Articles {isArticlesEnabled ? '(Activé)' : '(Désactivé)'}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 dark:text-gray-400 italic">
              💡 Les changements prennent effet instantanément pour tous les utilisateurs.
            </div>
          </div>

          {/* 4 Interactive Model Selection Cards (Shown if categories are enabled) */}
          {isCategoriesEnabled && (
          <div className="pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60">
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Format d'Affichage des Catégories (4 Modèles Visuels) :
              </label>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Modèle actuel : {homeCategoryLayoutMode.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Model 1: 4 Columns Grid (Screenshot standard) */}
              <div
                onClick={() => handleSelectLayoutMode('grid4')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                  homeCategoryLayoutMode === 'grid4'
                    ? 'border-emerald-500 bg-white dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 hover:border-emerald-300'
                }`}
              >
                {homeCategoryLayoutMode === 'grid4' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <Check size={12} />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${homeCategoryLayoutMode === 'grid4' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-750 dark:text-gray-400'}`}>
                      <LayoutGrid size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                        Modèle 1 : Grille 4 Colonnes
                      </h4>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        Icônes & Badges Authentiques
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    Grille dense à 4 colonnes fidèle à votre capture d'écran avec badges circulaires colorés et titres compacts.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[10px] font-bold">
                  <span className={homeCategoryLayoutMode === 'grid4' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}>
                    {homeCategoryLayoutMode === 'grid4' ? '✓ Modèle Actif' : 'Choisir ce modèle'}
                  </span>
                  <div className="grid grid-cols-4 gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Model 2: 2 Columns Grid */}
              <div
                onClick={() => handleSelectLayoutMode('grid2')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                  homeCategoryLayoutMode === 'grid2'
                    ? 'border-emerald-500 bg-white dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 hover:border-emerald-300'
                }`}
              >
                {homeCategoryLayoutMode === 'grid2' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <Check size={12} />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${homeCategoryLayoutMode === 'grid2' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-750 dark:text-gray-400'}`}>
                      <Grid2X2 size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                        Modèle 2 : Grille 2 Colonnes
                      </h4>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        Équilibré & Visuel
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    Grille à 2 colonnes avec vignettes immersives, badges icônes, compteurs et accroches superposées.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[10px] font-bold">
                  <span className={homeCategoryLayoutMode === 'grid2' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}>
                    {homeCategoryLayoutMode === 'grid2' ? '✓ Modèle Actif' : 'Choisir ce modèle'}
                  </span>
                  <div className="flex gap-1">
                    <span className="w-2.5 h-3.5 rounded-xs bg-emerald-400/60" />
                    <span className="w-2.5 h-3.5 rounded-xs bg-emerald-400/60" />
                  </div>
                </div>
              </div>

              {/* Model 3: Large Banner Card (1 Col) */}
              <div
                onClick={() => handleSelectLayoutMode('banner')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                  homeCategoryLayoutMode === 'banner'
                    ? 'border-emerald-500 bg-white dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 hover:border-emerald-300'
                }`}
              >
                {homeCategoryLayoutMode === 'banner' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <Check size={12} />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${homeCategoryLayoutMode === 'banner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-750 dark:text-gray-400'}`}>
                      <Square size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                        Modèle 3 : Grande Carte
                      </h4>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                        Bannière 1 Colonne
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    Grande image en haut avec titre blanc incrusté, et bloc blanc contenant la description et accroche.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[10px] font-bold">
                  <span className={homeCategoryLayoutMode === 'banner' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}>
                    {homeCategoryLayoutMode === 'banner' ? '✓ Modèle Actif' : 'Choisir ce modèle'}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="w-6 h-2 rounded-xs bg-emerald-500/80" />
                    <span className="w-6 h-1 rounded-xs bg-gray-300 dark:bg-gray-600" />
                  </div>
                </div>
              </div>

              {/* Model 4: Horizontal List Row (1 Col) */}
              <div
                onClick={() => handleSelectLayoutMode('list')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                  homeCategoryLayoutMode === 'list'
                    ? 'border-emerald-500 bg-white dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 hover:border-emerald-300'
                }`}
              >
                {homeCategoryLayoutMode === 'list' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <Check size={12} />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${homeCategoryLayoutMode === 'list' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-750 dark:text-gray-400'}`}>
                      <LayoutList size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                        Modèle 4 : Liste Horizontale
                      </h4>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                        Compact & Épuré
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    Vignette carrée avec badge à gauche et texte (titre majuscule + accroche + sous-thèmes) à droite.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[10px] font-bold">
                  <span className={homeCategoryLayoutMode === 'list' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}>
                    {homeCategoryLayoutMode === 'list' ? '✓ Modèle Actif' : 'Choisir ce modèle'}
                  </span>
                  <div className="flex gap-1 items-center">
                    <span className="w-2.5 h-3 rounded-xs bg-emerald-500/80" />
                    <span className="w-4 h-2 rounded-xs bg-gray-300 dark:bg-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-options for Home Categories */}
            <div className="pt-3.5 border-t border-emerald-200/60 dark:border-emerald-800/60 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-black text-gray-800 dark:text-gray-200">
                  Options d'affichage sur l'accueil :
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  Personnalisez la visibilité des textes et éléments de la section catégories
                </span>
              </div>

              {/* Group 1: En-tête & Textes (Exclusive Classification, Titre, Sous-titre) */}
              <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/80 dark:border-gray-700/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none font-bold text-gray-900 dark:text-white">
                    <input
                      type="checkbox"
                      checked={showTextsOnHome}
                      onChange={() => handleToggleHomeSubOption('home_categories_show_texts', showTextsOnHome)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
                    />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      Afficher les textes d'en-tête (Titre, Badge, Description)
                    </span>
                  </label>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    showTextsOnHome ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {showTextsOnHome ? 'Textes Actifs' : 'Textes Masqués'}
                  </span>
                </div>

                {showTextsOnHome && (
                  <div className="pl-6 pt-1 border-t border-dashed border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={showBadgeOnHome}
                        onChange={() => handleToggleHomeSubOption('home_categories_show_badge', showBadgeOnHome)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span>Badge "Classification Exclusive"</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer select-none text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={showTitleOnHome}
                        onChange={() => handleToggleHomeSubOption('home_categories_show_title', showTitleOnHome)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span>Titre "Catégories"</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer select-none text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={showSubtitleOnHome}
                        onChange={() => handleToggleHomeSubOption('home_categories_show_subtitle', showSubtitleOnHome)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span>Description / Sous-titre</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Group 2: Eléments des cartes & Widgets */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showCategoryNamesOnHome}
                    onChange={() => handleToggleHomeSubOption('home_categories_show_names', showCategoryNamesOnHome)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Noms des catégories</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showHooksOnHome}
                    onChange={() => handleToggleHomeSubOption('home_categories_show_hooks', showHooksOnHome)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Phrases d'accroche (hooks)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showCountsOnHome}
                    onChange={() => handleToggleHomeSubOption('home_categories_show_counts', showCountsOnHome)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Compteur d'articles</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showSubCountsOnHome}
                    onChange={() => handleToggleHomeSubOption('home_categories_show_sub_counts', showSubCountsOnHome)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Compteur sous-thèmes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showSliderOnHome}
                    onChange={() => handleToggleHomeSubOption('home_categories_show_slider', showSliderOnHome)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-gray-750 dark:text-gray-250 font-medium">
                    Slider des outils
                  </span>
                </label>
              </div>

              {/* Group 3: Réglage de la taille des titres des catégories (Augmenter / Réduire) */}
              <div className="pt-3 mt-2 border-t border-gray-200/70 dark:border-gray-750/70 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                      <Type size={14} />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        Taille des titres des catégories sur l'accueil
                      </span>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        Agrandir ou réduire la taille du texte affiché sous chaque catégorie
                      </p>
                    </div>
                  </div>

                  {/* Boutons - et + avec affichage en pixels */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleUpdateCategoryTitleSize(homeCategoryTitleSize - 1)}
                      disabled={homeCategoryTitleSize <= 10}
                      title="Réduire la taille"
                      className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-750 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-gray-700 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200/80 dark:border-gray-700 cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-black text-xs min-w-[56px] text-center shadow-xs">
                      {homeCategoryTitleSize} px
                    </span>

                    <button
                      type="button"
                      onClick={() => handleUpdateCategoryTitleSize(homeCategoryTitleSize + 1)}
                      disabled={homeCategoryTitleSize >= 24}
                      title="Augmenter la taille"
                      className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-750 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-gray-700 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200/80 dark:border-gray-700 cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Curseur Slider & Boutons de présélection rapide */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-[10px] font-bold text-gray-400">10px</span>
                    <input
                      type="range"
                      min={10}
                      max={24}
                      step={1}
                      value={homeCategoryTitleSize}
                      onChange={(e) => handleUpdateCategoryTitleSize(Number(e.target.value))}
                      className="w-full accent-emerald-600 dark:accent-emerald-400 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] font-bold text-gray-400">24px</span>
                  </div>

                  {/* Presets rapides */}
                  <div className="flex items-center gap-1 shrink-0 overflow-x-auto">
                    {[
                      { label: 'Compact (11px)', size: 11 },
                      { label: 'Normal (13px)', size: 13 },
                      { label: 'Grand (15px)', size: 15 },
                      { label: 'Très grand (18px)', size: 18 },
                    ].map((preset, pIdx) => (
                      <button
                        key={`cat-size-preset-${preset.size}-${pIdx}`}
                        type="button"
                        onClick={() => handleUpdateCategoryTitleSize(preset.size)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                          homeCategoryTitleSize === preset.size
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-gray-100 dark:bg-gray-750 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mini Aperçu en direct */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50/80 dark:bg-gray-850/80 border border-gray-200/60 dark:border-gray-700/60">
                  <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Aperçu direct :</span>
                  <span 
                    style={{ fontSize: `${homeCategoryTitleSize}px` }} 
                    className="font-extrabold text-gray-900 dark:text-gray-100 leading-tight"
                  >
                    Invocations & Douas
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Category Articles Display Control with 3 Layout Models */}
        <div className="mt-5 p-4 sm:p-6 bg-gradient-to-br from-indigo-50/60 via-purple-50/20 to-white dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-gray-800 rounded-2xl sm:rounded-3xl border-2 border-indigo-200/80 dark:border-indigo-800/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                  <BookOpen size={18} />
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white">
                  Affichage des Articles : Modèles des Publications (3 Formats)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  {currentArticlesLayout === 'grid2' ? 'Grille 2 Colonnes' : currentArticlesLayout === 'grid1' ? 'Grand Format 1 Col' : 'Liste Compacte'}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                Définissez le modèle visuel par défaut avec lequel les articles s'affichent lorsqu'un utilisateur consulte une catégorie ou le flux.
              </p>
            </div>

            {/* Free Choice Switch */}
            <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
              <div className="text-right">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                  {isArticlesLayoutFree ? 'Choix libre actif' : 'Modèle imposé'}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  {isArticlesLayoutFree ? "L'utilisateur peut basculer" : 'Fixé pour tous'}
                </span>
              </div>
              <button
                type="button"
                disabled={isUpdatingToggle}
                onClick={() => handleToggleArticlesLayoutFree()}
                className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isArticlesLayoutFree ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-650'
                }`}
                title="Autoriser ou verrouiller le changement de vue par l'utilisateur"
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[10px] font-bold ${
                    isArticlesLayoutFree ? 'translate-x-8 text-indigo-600' : 'translate-x-0 text-gray-400'
                  }`}
                >
                  {isArticlesLayoutFree ? 'LIBRE' : 'FIXE'}
                </span>
              </button>
            </div>
          </div>

          {/* 3 Interactive Model Selection Cards for Articles */}
          <div className="pt-2">
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2.5">
              Sélectionnez le Modèle d'Affichage des Articles Souhaité :
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Model 1: 2 Columns Grid */}
              <div
                onClick={() => handleSelectArticlesLayout('grid2')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                  currentArticlesLayout === 'grid2'
                    ? 'border-indigo-500 bg-white dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 hover:border-indigo-300'
                }`}
              >
                {currentArticlesLayout === 'grid2' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-xs">
                    <Check size={12} />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${currentArticlesLayout === 'grid2' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-750 dark:text-gray-400'}`}>
                      <LayoutGrid size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                        Modèle 1 : Grille 2 Colonnes
                      </h4>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                        Moderne & Dense
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    Cartes verticales côte-à-côte (2 colonnes sur mobile/tablette, 3 sur desktop) avec vignette carrée et badges superposés.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[10px] font-bold">
                  <span className={currentArticlesLayout === 'grid2' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}>
                    {currentArticlesLayout === 'grid2' ? '✓ Modèle Actif' : 'Choisir ce modèle'}
                  </span>
                </div>
              </div>

              {/* Model 2: Large Card (1 Column) */}
              <div
                onClick={() => handleSelectArticlesLayout('grid1')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                  currentArticlesLayout === 'grid1'
                    ? 'border-indigo-500 bg-white dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 hover:border-indigo-300'
                }`}
              >
                {currentArticlesLayout === 'grid1' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-xs">
                    <Check size={12} />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${currentArticlesLayout === 'grid1' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-750 dark:text-gray-400'}`}>
                      <Square size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                        Modèle 2 : Grand Format (1 Col)
                      </h4>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                        Immersif & Cinématique
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    Cartes pleine largeur (1 colonne) avec grande image au-dessus, titre proéminent et extrait textuel complet.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[10px] font-bold">
                  <span className={currentArticlesLayout === 'grid1' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}>
                    {currentArticlesLayout === 'grid1' ? '✓ Modèle Actif' : 'Choisir ce modèle'}
                  </span>
                </div>
              </div>

              {/* Model 3: Compact Horizontal List */}
              <div
                onClick={() => handleSelectArticlesLayout('list')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                  currentArticlesLayout === 'list'
                    ? 'border-indigo-500 bg-white dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 hover:border-indigo-300'
                }`}
              >
                {currentArticlesLayout === 'list' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-xs">
                    <Check size={12} />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${currentArticlesLayout === 'list' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-750 dark:text-gray-400'}`}>
                      <LayoutList size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                        Modèle 3 : Liste Compacte
                      </h4>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                        Fluide & Pratique
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    Lignes horizontales avec vignette à gauche et contenu textuel à droite. Idéal pour un défilement rapide.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[10px] font-bold">
                  <span className={currentArticlesLayout === 'list' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}>
                    {currentArticlesLayout === 'list' ? '✓ Modèle Actif' : 'Choisir ce modèle'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher une catégorie, sous-catégorie ou accroche (hook)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center border border-gray-100 dark:border-gray-700 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
            <FolderOpen size={30} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Aucune catégorie trouvée</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {searchQuery ? `Aucun résultat correspondant à "${searchQuery}".` : "Commencez par créer votre première catégorie."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateCategory}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow"
          >
            <Plus size={15} /> Créer une Catégorie
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCategories.map((cat, catIdx) => {
            const catArticlesCount = getArticleCountForCategory(cat);
            const subsList = cat.subCategories || [];
            const isExpanded = expandedCategories[cat.id] !== false; // Default expanded
            const resolvedThumb = sanitizeImageSource(cat.thumbnail) || getCategoryFallbackThumbnail(cat.name);
            const resolvedHook = cat.hook || getCategoryFallbackHook(cat.name);

            return (
              <div
                key={cat.id ? `category-card-${cat.id}-${catIdx}` : `category-card-${catIdx}`}
                className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-150 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category Top Banner with Thumbnail */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gray-900 group">
                    <img
                      src={resolvedThumb}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getCategoryFallbackThumbnail(cat.name);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent" />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-md text-white text-xs font-black flex items-center gap-2 border border-white/15 shadow-sm pointer-events-auto">
                        {renderIcon(cat.iconName || 'FolderOpen', 18, 'text-emerald-300')}
                        <span>{cat.name}</span>
                        {cat.videoUrl && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="Badge vidéo HD actif" />
                        )}
                      </span>

                      <div className="flex items-center gap-1.5 pointer-events-auto">
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black shadow-sm">
                          {catArticlesCount} {catArticlesCount > 1 ? 'articles' : 'article'}
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-black shadow-sm">
                          {subsList.length} sous-cat.
                        </span>
                      </div>
                    </div>

                    {/* Bottom Category Info Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-center gap-3">
                      <CategoryVideoOrIconBadge
                        iconName={cat.iconName || 'FolderOpen'}
                        videoUrl={cat.videoUrl}
                        categoryName={cat.name}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-black tracking-tight drop-shadow-sm flex items-center gap-2">
                          <span>{cat.name}</span>
                        </h3>
                        {cat.name_en && cat.name_en !== cat.name && (
                          <p className="text-[11px] text-gray-300 font-medium line-clamp-1">
                            EN: {cat.name_en} {cat.name_ha ? `• HA: ${cat.name_ha}` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hook Banner (Accroche Visuelle Optimale) */}
                  <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700 bg-amber-50/50 dark:bg-amber-950/15">
                    <div className="flex items-start gap-2.5">
                      <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
                          Phrase d'Accroche (Hook)
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 leading-relaxed italic">
                          "{resolvedHook}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Subcategories Section */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleExpandCategory(cat.id)}
                        className="text-xs font-extrabold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        <span>Sous-Catégories ({subsList.length})</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenCreateSubCategory(cat.id)}
                        className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={13} /> Ajouter sous-catégorie
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="space-y-2 pt-1">
                        {subsList.length === 0 ? (
                          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-700 text-center">
                            <p className="text-xs text-gray-400">Aucune sous-catégorie configurée.</p>
                            <button
                              type="button"
                              onClick={() => handleOpenCreateSubCategory(cat.id)}
                              className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                            >
                              <Plus size={12} /> Ajouter une première sous-catégorie
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-2.5">
                            {subsList.map((sub, sIdx) => {
                              const subThumb = sanitizeImageSource(sub.thumbnail) || resolvedThumb;
                              const subHook = sub.hook || getSubCategoryFallbackHook(sub.name, cat.name);
                              const subArticlesCount = getArticleCountForSubCategory(cat, sub);

                              return (
                                <div
                                  key={sub.id ? `sub-${cat.id}-${sub.id}-${sIdx}` : `sub-${cat.id}-${sIdx}`}
                                  className="p-2.5 sm:p-3 rounded-2xl bg-gray-50 dark:bg-gray-750/70 border border-gray-150 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex items-center justify-between gap-3 group/sub"
                                >
                                  {/* Sub Thumbnail */}
                                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-gray-800 border border-gray-200 dark:border-gray-600 relative">
                                    <img
                                      src={subThumb}
                                      alt={sub.name}
                                      className="w-full h-full object-cover group-hover/sub:scale-105 transition-transform duration-300"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = resolvedThumb;
                                      }}
                                    />
                                  </div>

                                  {/* Sub Info */}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white truncate">
                                        {sub.name}
                                      </h4>
                                      {subArticlesCount > 0 && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold shrink-0">
                                          {subArticlesCount}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 italic mt-0.5">
                                      "{subHook}"
                                    </p>
                                  </div>

                                  {/* Sub Actions */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditSubCategory(cat.id, sub)}
                                      className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                                      title="Modifier la sous-catégorie"
                                    >
                                      <Edit3 size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setSubCategoryToDelete({ parentCat: cat, sub })}
                                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                                      title="Supprimer la sous-catégorie"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Category Actions Toolbar */}
                <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 truncate max-w-[120px]">
                      #{cat.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditCategory(cat)}
                      className="px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Edit3 size={13} />
                      <span>Modifier</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(cat)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-xs transition-colors cursor-pointer"
                      title="Supprimer la catégorie"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL: CRÉER / MODIFIER CATÉGORIE ================= */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 pb-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-850 w-full max-w-xl rounded-3xl shadow-2xl border border-gray-150 dark:border-gray-700 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
                    <FolderOpen size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg">
                      {editingCategory ? "Modifier la Catégorie" : "Créer une Nouvelle Catégorie"}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Définissez le nom, le thumbnail haute qualité et l'accroche (hook).
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 overscroll-contain">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                    <span>Nom de la Catégorie (Français) *</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Obligatoire</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Secrets & Pratiques, Richesse & Ouverture..."
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Multilingual optional names */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Nom (Anglais)</label>
                    <input
                      type="text"
                      placeholder="ex: Secrets & Practices"
                      value={categoryFormData.name_en}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, name_en: e.target.value }))}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Nom (Hausa)</label>
                    <input
                      type="text"
                      placeholder="ex: Asirai da Ayyuka"
                      value={categoryFormData.name_ha}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, name_ha: e.target.value }))}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                {/* Hook (Phrase d'Accroche Captivante) */}
                <div className="space-y-1.5 p-3.5 bg-amber-50/70 dark:bg-amber-950/20 rounded-2xl border border-amber-200/70 dark:border-amber-900/50">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      <span>Phrase d'Accroche / Hook *</span>
                    </label>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                      Crucial pour l'attractivité
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Une phrase percutante décrivant la valeur mystique ou spirituelle de cette catégorie..."
                    value={categoryFormData.hook}
                    onChange={(e) => setCategoryFormData(prev => ({ ...prev, hook: e.target.value }))}
                    className="w-full bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-800/80 rounded-xl p-2.5 text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                    <span>Aperçu du texte accrocheur affiché sur la carte</span>
                    <button
                      type="button"
                      onClick={() => {
                        const sug = getCategoryFallbackHook(categoryFormData.name || 'Général');
                        setCategoryFormData(prev => ({ ...prev, hook: sug }));
                      }}
                      className="text-amber-700 dark:text-amber-400 hover:underline font-bold"
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

                  {/* Thumbnail Preview */}
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-gray-900 border border-gray-300 dark:border-gray-600 shrink-0 relative shadow-inner">
                      <img
                        src={sanitizeImageSource(categoryFormData.thumbnail) || getCategoryFallbackThumbnail(categoryFormData.name)}
                        alt="Aperçu"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getCategoryFallbackThumbnail(categoryFormData.name);
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={categoryFormData.thumbnail}
                        onChange={(e) => setCategoryFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 text-xs text-gray-900 dark:text-white outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowCatPresetThumbnails(prev => !prev)}
                          className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg text-[10px] transition-colors"
                        >
                          {showCatPresetThumbnails ? "Masquer les Presets" : "✨ Choisir parmi les Presets HD"}
                        </button>
                        <button
                          type="button"
                          onClick={() => catFileInputRef.current?.click()}
                          disabled={isUploadingImage}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg text-[10px] flex items-center gap-1 transition-colors"
                        >
                          <Upload size={11} /> Téléverser
                        </button>
                        <input
                          ref={catFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, true)}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preset Thumbnails Visual Picker */}
                  {showCatPresetThumbnails && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Vignettes Thématiques Sélectionnées (Cliquez pour appliquer) :
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                        {PRESET_THUMBNAILS.map((preset, pIdx) => (
                          <button
                            key={`cat-preset-${pIdx}`}
                            type="button"
                            onClick={() => {
                              setCategoryFormData(prev => ({ ...prev, thumbnail: preset.url }));
                              setShowCatPresetThumbnails(false);
                            }}
                            className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                              categoryFormData.thumbnail === preset.url
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
                      onClick={() => setIsIconPickerModalOpen(true)}
                      className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-300/40"
                    >
                      <Film size={13} />
                      <span>Médiathèque (520+ Icônes & Vidéos)</span>
                    </button>
                  </div>

                  {/* Current Selection Live Preview Card */}
                  <div className="flex items-center gap-3.5 bg-white dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700/80 shadow-xs">
                    <CategoryVideoOrIconBadge
                      iconName={categoryFormData.iconName}
                      videoUrl={categoryFormData.videoUrl || (categoryFormData.name ? getCategoryFallbackVideo(categoryFormData.name) : undefined)}
                      categoryName={categoryFormData.name || 'Aperçu'}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-gray-900 dark:text-white">
                          {categoryFormData.iconName || 'Sparkles'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                          {categoryFormData.videoUrl ? '🎬 Vidéo Looping Personnalisée' : '✨ Vidéo & Aura Sacrée'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {categoryFormData.videoUrl ? `Source : ${categoryFormData.videoUrl}` : 'Badge animé en boucle avec halo radiant haute visibilité'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsIconPickerModalOpen(true)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      Parcourir
                    </button>
                  </div>

                  {/* Quick Strip of Essential Icons */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Sélection rapide :</div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {PRESET_ICONS.map((icon, iconIdx) => (
                        <button
                          key={`icon-${icon}-${iconIdx}`}
                          type="button"
                          onClick={() => setCategoryFormData(prev => ({ ...prev, iconName: icon }))}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                            categoryFormData.iconName === icon
                              ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400 scale-105'
                              : 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/60 dark:border-emerald-800/50'
                          }`}
                          title={icon}
                        >
                          {renderIcon(icon, 22, categoryFormData.iconName === icon ? 'text-white' : '')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800 border-t border-gray-150 dark:border-gray-700 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 shrink-0 shadow-lg">
                <button
                  type="button"
                  disabled={isSavingCategory}
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-center cursor-pointer disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={isSavingCategory}
                  onClick={handleSaveCategory}
                  className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-sm sm:text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/25 hover:shadow-emerald-900/40 active:scale-98 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSavingCategory ? (
                    <Loader2 size={16} className="animate-spin text-white" />
                  ) : (
                    <Check size={16} />
                  )}
                  <span>
                    {isSavingCategory 
                      ? "Enregistrement en cours..." 
                      : (editingCategory ? "Enregistrer les modifications" : "Créer la Catégorie")}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 520+ Icons & HD Video Picker Modal */}
      <CategoryIconPickerModal
        isOpen={isIconPickerModalOpen}
        onClose={() => setIsIconPickerModalOpen(false)}
        selectedIcon={categoryFormData.iconName}
        selectedVideoUrl={categoryFormData.videoUrl}
        categoryName={categoryFormData.name}
        onSelect={(iconName, videoUrl) => {
          setCategoryFormData(prev => ({
            ...prev,
            iconName,
            videoUrl: videoUrl || ''
          }));
        }}
      />

      {/* ================= MODAL: CRÉER / MODIFIER SOUS-CATÉGORIE ================= */}
      <AnimatePresence>
        {isSubCategoryModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 pb-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-850 w-full max-w-lg rounded-3xl shadow-2xl border border-gray-150 dark:border-gray-700 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg">
                      {editingSubCategory ? "Modifier la Sous-Catégorie" : "Ajouter une Sous-Catégorie"}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Chaque sous-catégorie dispose d'un thumbnail et d'un hook dédié.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubCategoryModalOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 overscroll-contain">
                {/* Parent Category Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Catégorie Parente *
                  </label>
                  <select
                    value={subCategoryParentId}
                    onChange={(e) => setSubCategoryParentId(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs sm:text-sm text-gray-900 dark:text-white font-bold outline-none cursor-pointer"
                  >
                    {categories.map((c, cIdx) => (
                      <option key={`parent-opt-${c.id}-${cIdx}`} value={c.id}>
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
                    placeholder="ex: Sourate Al-Waqi'a, Khatims & Carrés, Bains de Purification..."
                    value={subCategoryFormData.name}
                    onChange={(e) => setSubCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Multilingual */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Nom (Anglais)</label>
                    <input
                      type="text"
                      placeholder="ex: Protective Verses"
                      value={subCategoryFormData.name_en}
                      onChange={(e) => setSubCategoryFormData(prev => ({ ...prev, name_en: e.target.value }))}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Nom (Hausa)</label>
                    <input
                      type="text"
                      placeholder="ex: Ayoyin Kariya"
                      value={subCategoryFormData.name_ha}
                      onChange={(e) => setSubCategoryFormData(prev => ({ ...prev, name_ha: e.target.value }))}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white outline-none"
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
                      Sous-titre explicite
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Une phrase courte décrivant les bienfaits ou secrets de cette sous-thématique..."
                    value={subCategoryFormData.hook}
                    onChange={(e) => setSubCategoryFormData(prev => ({ ...prev, hook: e.target.value }))}
                    className="w-full bg-white dark:bg-gray-800 border border-indigo-300 dark:border-indigo-800/80 rounded-xl p-2.5 text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                    <span>Texte accrocheur guidant le lecteur</span>
                    <button
                      type="button"
                      onClick={() => {
                        const parentCat = categories.find(c => c.id === subCategoryParentId);
                        const sug = getSubCategoryFallbackHook(subCategoryFormData.name || 'Pratiques', parentCat?.name);
                        setSubCategoryFormData(prev => ({ ...prev, hook: sug }));
                      }}
                      className="text-indigo-700 dark:text-indigo-400 hover:underline font-bold"
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
                        src={sanitizeImageSource(subCategoryFormData.thumbnail) || PRESET_THUMBNAILS[0].url}
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
                        value={subCategoryFormData.thumbnail}
                        onChange={(e) => setSubCategoryFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 text-xs text-gray-900 dark:text-white outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowSubPresetThumbnails(prev => !prev)}
                          className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg text-[10px] transition-colors"
                        >
                          {showSubPresetThumbnails ? "Masquer Presets" : "✨ Presets HD"}
                        </button>
                        <button
                          type="button"
                          onClick={() => subFileInputRef.current?.click()}
                          disabled={isUploadingImage}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg text-[10px] flex items-center gap-1 transition-colors"
                        >
                          <Upload size={11} /> Téléverser
                        </button>
                        <input
                          ref={subFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, false)}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {showSubPresetThumbnails && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Cliquez sur une vignette pour l'appliquer :
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                        {PRESET_THUMBNAILS.map((preset, pIdx) => (
                          <button
                            key={`sub-preset-${pIdx}`}
                            type="button"
                            onClick={() => {
                              setSubCategoryFormData(prev => ({ ...prev, thumbnail: preset.url }));
                              setShowSubPresetThumbnails(false);
                            }}
                            className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                              subCategoryFormData.thumbnail === preset.url
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
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800 border-t border-gray-150 dark:border-gray-700 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 shrink-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => setIsSubCategoryModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-center cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveSubCategory}
                  className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold rounded-xl text-sm sm:text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/25 hover:shadow-indigo-900/40 active:scale-98 transition-all cursor-pointer"
                >
                  <Check size={16} />
                  <span>{editingSubCategory ? "Enregistrer" : "Ajouter la Sous-Catégorie"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL DE SUPPRESSION CATÉGORIE ================= */}
      <AnimatePresence>
        {categoryToDelete && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-850 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
                  Supprimer la Catégorie ?
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Êtes-vous sûr de vouloir supprimer la catégorie <strong className="text-gray-900 dark:text-white">"{categoryToDelete.name}"</strong> et ses <strong className="text-gray-900 dark:text-white">{categoryToDelete.subCategories?.length || 0}</strong> sous-catégories ?
                </p>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-2">
                  Les articles associés ne seront pas supprimés mais devront être réassignés.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCategoryToDelete(null)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-750 hover:bg-gray-200 dark:hover:bg-gray-700 font-bold text-xs rounded-xl text-gray-700 dark:text-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDeleteCategory}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 font-extrabold text-xs rounded-xl text-white shadow-md transition-colors"
                >
                  Supprimer Définitivement
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL DE SUPPRESSION SOUS-CATÉGORIE ================= */}
      <AnimatePresence>
        {subCategoryToDelete && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-850 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
                  Supprimer la Sous-Catégorie ?
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Voulez-vous supprimer la sous-catégorie <strong className="text-gray-900 dark:text-white">"{subCategoryToDelete.sub.name}"</strong> de la catégorie "{subCategoryToDelete.parentCat.name}" ?
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubCategoryToDelete(null)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-750 hover:bg-gray-200 dark:hover:bg-gray-700 font-bold text-xs rounded-xl text-gray-700 dark:text-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDeleteSubCategory}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 font-extrabold text-xs rounded-xl text-white shadow-md transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
