import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderOpen, Sparkles, Plus, Edit3, Trash2, Image as ImageIcon,
  Tag, Check, X, Search, Layers, Eye, EyeOff, BookOpen, Shield,
  Heart, Key, Compass, Moon, Sun, Flame, Feather, Coins,
  Star, Volume2, ChevronDown, ChevronUp, RefreshCw, Upload, CloudUpload, ExternalLink,
  AlertTriangle, AlertCircle, CheckCircle2, Copy, LayoutGrid, Square, LayoutList, Crown,
  Grid2X2, Grid3X3, Lock, Unlock, Newspaper, Pin, Film, Loader2, Type, Minus
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
import { uploadCategoryThumbnailToFirebaseStorage } from '../../utils/videoStorageHelper';
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

  const homeCategoryLayoutMode: 'grid4' | 'grid3' | 'grid2' | 'banner' | 'list' =
    featureToggles?.home_categories_layout_mode === 'banner' ? 'banner' :
    featureToggles?.home_categories_layout_mode === 'list' ? 'list' :
    featureToggles?.home_categories_layout_mode === 'grid2' ? 'grid2' :
    featureToggles?.home_categories_layout_mode === 'grid4' ? 'grid4' : 'grid3';

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

  // Check if categories layout is locked/blocked or free
  const isCategoriesLayoutLocked = 
    featureToggles?.home_categories_layout_locked === true ||
    featureToggles?.home_categories_layout_free === false ||
    featureToggles?.home_categories_show_switcher === false ||
    isDisplayLocked ||
    currentHomeMode === 'fixed_categories';

  const showCategoriesLayoutSwitcher = !isCategoriesLayoutLocked && featureToggles?.home_categories_show_switcher !== false;

  const [isUpdatingToggle, setIsUpdatingToggle] = useState(false);

  // Toggle Categories Layout Switcher Visibility ([ ⊞ 田 ⊞ ▢ ≡ ])
  const handleToggleCategoriesLayoutSwitcher = async () => {
    const nextVal = !showCategoriesLayoutSwitcher;
    setIsUpdatingToggle(true);
    try {
      const payload: Record<string, any> = {
        home_categories_show_switcher: nextVal,
        home_categories_layout_free: nextVal,
        home_categories_layout_locked: !nextVal,
      };

      if (handleToggleFeature) {
        await handleToggleFeature('home_categories_show_switcher', nextVal, "Icônes sélecteur de grille catégories");
        await handleToggleFeature('home_categories_layout_free', nextVal);
        await handleToggleFeature('home_categories_layout_locked', !nextVal);
      } else {
        await setDoc(doc(db, 'settings', 'features'), payload, { merge: true });
        const localFontSaved = localStorage.getItem('asrar_font_toggles');
        let localObj = localFontSaved ? JSON.parse(localFontSaved) : {};
        Object.assign(localObj, payload);
        localStorage.setItem('asrar_font_toggles', JSON.stringify(localObj));
        window.dispatchEvent(new Event('asrar_font_updated'));
      }

      onShowToast(
        nextVal
          ? "Icônes de grille visibles : Les visiteurs peuvent changer de modèle librement [ ⊞ 田 ⊞ ▢ ≡ ]."
          : "Icônes de grille masquées : Les 5 icônes sont invisibles, le modèle sélectionné est imposé.",
        "success"
      );
    } catch (e: any) {
      console.warn("Toggle switcher error:", e);
      onShowToast("Erreur lors de la mise à jour : " + (e.message || ''), "error");
    } finally {
      setIsUpdatingToggle(false);
    }
  };

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
        home_categories_layout_locked: mode === 'fixed_categories',
        home_categories_layout_free: mode !== 'fixed_categories',
        home_categories_show_switcher: mode !== 'fixed_categories',
      };

      if (handleToggleFeature) {
        await handleToggleFeature('home_display_mode', mode, `Mode Accueil : ${mode}`);
        if (mode === 'fixed_categories') {
          await handleToggleFeature('home_categories_show_switcher', false);
          await handleToggleFeature('home_categories_layout_locked', true);
          await handleToggleFeature('home_categories_layout_free', false);
        } else if (mode === 'free') {
          await handleToggleFeature('home_categories_show_switcher', true);
          await handleToggleFeature('home_categories_layout_locked', false);
          await handleToggleFeature('home_categories_layout_free', true);
        }
      } else {
        await setDoc(doc(db, 'settings', 'features'), payload, { merge: true });
        const localFontSaved = localStorage.getItem('asrar_font_toggles');
        let localObj = localFontSaved ? JSON.parse(localFontSaved) : {};
        Object.assign(localObj, payload);
        localStorage.setItem('asrar_font_toggles', JSON.stringify(localObj));
        window.dispatchEvent(new Event('asrar_font_updated'));
      }

      const label = 
        mode === 'fixed_categories' ? "Affichage de l'accueil FIXÉ sur : Catégories uniquement (Verrouillé & icônes masquées)" :
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
      const payload: Record<string, any> = {
        home_lock_display: targetVal,
        ...(targetVal ? {
          home_categories_layout_locked: true,
          home_categories_layout_free: false,
          home_categories_show_switcher: false,
        } : {
          home_categories_layout_locked: false,
          home_categories_layout_free: true,
          home_categories_show_switcher: true,
        })
      };

      if (handleToggleFeature) {
        await handleToggleFeature('home_lock_display', targetVal, "Verrouillage de l'affichage");
        if (targetVal) {
          await handleToggleFeature('home_categories_show_switcher', false);
          await handleToggleFeature('home_categories_layout_locked', true);
          await handleToggleFeature('home_categories_layout_free', false);
        } else {
          await handleToggleFeature('home_categories_show_switcher', true);
          await handleToggleFeature('home_categories_layout_locked', false);
          await handleToggleFeature('home_categories_layout_free', true);
        }
      } else {
        await setDoc(doc(db, 'settings', 'features'), payload, { merge: true });
        const localFontSaved = localStorage.getItem('asrar_font_toggles');
        let localObj = localFontSaved ? JSON.parse(localFontSaved) : {};
        Object.assign(localObj, payload);
        localStorage.setItem('asrar_font_toggles', JSON.stringify(localObj));
        window.dispatchEvent(new Event('asrar_font_updated'));
      }
      onShowToast(targetVal ? "Affichage rendu fixe et verrouillé (icônes de grille masquées pour les utilisateurs)." : "Affichage déverrouillé (mode libre pour l'utilisateur).", "info");
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

  const handleSelectLayoutMode = async (mode: 'grid4' | 'grid3' | 'grid2' | 'banner' | 'list') => {
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
        mode === 'grid3' ? "Grille 3 Colonnes" :
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
    const clamped = Math.max(5, Math.min(24, Math.round(newSize)));
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
    videoUrl: '',
    enabled: true
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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isDraggingOverThumb, setIsDraggingOverThumb] = useState(false);
  const [showUrlInputManual, setShowUrlInputManual] = useState(false);
  const [quickUploadCatId, setQuickUploadCatId] = useState<string | null>(null);

  const catFileInputRef = useRef<HTMLInputElement>(null);
  const subFileInputRef = useRef<HTMLInputElement>(null);
  const quickCatFileInputRef = useRef<HTMLInputElement>(null);

  // Form error banners and auto-scroll refs
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);
  const [categoryFieldErrors, setCategoryFieldErrors] = useState<{ name?: string; hook?: string; thumbnail?: string }>({});
  const [subCategoryFormError, setSubCategoryFormError] = useState<string | null>(null);
  const categoryModalBodyRef = useRef<HTMLDivElement>(null);
  const categoryNameInputRef = useRef<HTMLInputElement>(null);
  const categoryHookInputRef = useRef<HTMLTextAreaElement>(null);
  const categoryThumbnailInputRef = useRef<HTMLInputElement>(null);
  const subCategoryModalBodyRef = useRef<HTMLDivElement>(null);
  const subCategoryNameInputRef = useRef<HTMLInputElement>(null);

  // Floating Toast notification for instant confirmation on category creation / error
  const [localToast, setLocalToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const localToastTimerRef = useRef<any>(null);

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (localToastTimerRef.current) clearTimeout(localToastTimerRef.current);
    setLocalToast({ message, type });
    onShowToast(message, type);
    localToastTimerRef.current = setTimeout(() => {
      setLocalToast(null);
    }, 4000);
  };

  // Category View Filter: Show user-created categories vs default mock presets
  const [categoryTypeFilter, setCategoryTypeFilter] = useState<'all' | 'custom' | 'mock'>('all');
  const isCustomCategory = (cat: CategoryItem) => Boolean(cat.isCustom || !DEFAULT_CATEGORIES_PRESETS.some(p => p.id === cat.id));
  const customCategories = useMemo(() => categories.filter(isCustomCategory), [categories]);
  const mockCategories = useMemo(() => categories.filter(cat => !isCustomCategory(cat)), [categories]);

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

  // Filtered categories (respects categoryTypeFilter: all, custom, mock)
  const filteredCategories = useMemo(() => {
    let list = categories;
    if (categoryTypeFilter === 'custom') {
      list = list.filter(isCustomCategory);
    } else if (categoryTypeFilter === 'mock') {
      list = list.filter(cat => !isCustomCategory(cat));
    }

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(cat => {
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
  }, [categories, categoryTypeFilter, searchQuery]);

  // Overall totals
  const totalSubCategoriesCount = useMemo(() => {
    return categories.reduce((acc, cat) => acc + (cat.subCategories?.length || 0), 0);
  }, [categories]);

  // Delete all mock/default preset categories with a single confirmation
  const handleDeleteAllMockCategories = async () => {
    if (mockCategories.length === 0) {
      triggerToast("Aucune catégorie mock/exemple par défaut à supprimer.", "info");
      return;
    }
    const confirmDelete = window.confirm(
      `Confirmez-vous la suppression des ${mockCategories.length} catégories mock / exemples par défaut ?\n\nToutes vos propres catégories créées seront soigneusement conservées.`
    );
    if (!confirmDelete) return;

    try {
      let deletedIds: string[] = [];
      try { deletedIds = JSON.parse(localStorage.getItem('asrarhub_deleted_categories') || '[]'); } catch (e) {}

      for (const mockCat of mockCategories) {
        await deleteDoc(doc(db, 'categories', mockCat.id));
        if (!deletedIds.includes(mockCat.id)) {
          deletedIds.push(mockCat.id);
        }
      }
      localStorage.setItem('asrarhub_deleted_categories', JSON.stringify(deletedIds));

      setCategories(prev => {
        const remaining = prev.filter(isCustomCategory);
        try { localStorage.setItem('asrarhub_cached_categories', JSON.stringify(remaining)); } catch (e) {}
        return remaining;
      });

      triggerToast(`${mockCategories.length} catégories mock supprimées avec succès ! Seules vos propres catégories sont désormais actives.`, "success");
      setCategoryTypeFilter('all');
    } catch (err: any) {
      console.error("Error deleting mock categories:", err);
      triggerToast("Erreur lors de la suppression des catégories mock : " + err.message, "error");
    }
  };

  // Open Create Category Modal
  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setCategoryFormError(null);
    setCategoryFieldErrors({});
    setCategoryFormData({
      name: '',
      name_en: '',
      name_ha: '',
      hook: '',
      hook_en: '',
      hook_ha: '',
      thumbnail: PRESET_THUMBNAILS[0].url,
      iconName: 'Sparkles',
      videoUrl: '',
      enabled: true
    });
    setShowCatPresetThumbnails(false);
    setIsCategoryModalOpen(true);
    setTimeout(() => {
      if (categoryModalBodyRef.current) categoryModalBodyRef.current.scrollTop = 0;
    }, 50);
  };

  // Open Edit Category Modal
  const handleOpenEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCategoryFormError(null);
    setCategoryFieldErrors({});
    setCategoryFormData({
      name: cat.name || '',
      name_en: cat.name_en || '',
      name_ha: cat.name_ha || '',
      hook: cat.hook || getCategoryFallbackHook(cat.name),
      hook_en: cat.hook_en || '',
      hook_ha: cat.hook_ha || '',
      thumbnail: cat.thumbnail || getCategoryFallbackThumbnail(cat.name),
      iconName: cat.iconName || 'FolderOpen',
      videoUrl: cat.videoUrl || '',
      enabled: cat.enabled !== false
    });
    setShowCatPresetThumbnails(false);
    setIsCategoryModalOpen(true);
    setTimeout(() => {
      if (categoryModalBodyRef.current) categoryModalBodyRef.current.scrollTop = 0;
    }, 50);
  };

  // Open Create SubCategory Modal
  const handleOpenCreateSubCategory = (parentCatId?: string) => {
    setEditingSubCategory(null);
    setSubCategoryFormError(null);
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
    setTimeout(() => {
      if (subCategoryModalBodyRef.current) subCategoryModalBodyRef.current.scrollTop = 0;
    }, 50);
  };

  // Open Edit SubCategory Modal
  const handleOpenEditSubCategory = (parentCatId: string, sub: SubCategoryItem) => {
    setEditingSubCategory({ parentId: parentCatId, sub });
    setSubCategoryParentId(parentCatId);
    setSubCategoryFormError(null);
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
    setTimeout(() => {
      if (subCategoryModalBodyRef.current) subCategoryModalBodyRef.current.scrollTop = 0;
    }, 50);
  };

  // Save Category with complete validation and visual confirmation
  const handleSaveCategory = async () => {
    const errors: { name?: string; hook?: string; thumbnail?: string } = {};
    const trimmedName = categoryFormData.name.trim();
    const trimmedHook = categoryFormData.hook.trim();
    const trimmedThumb = categoryFormData.thumbnail.trim();

    if (!trimmedName) {
      errors.name = "Le nom de la catégorie est obligatoire et ne peut pas être vide.";
    }
    if (!trimmedHook) {
      errors.hook = "La phrase d'accroche (hook) est obligatoire pour décrire la thématique aux utilisateurs.";
    }
    if (!trimmedThumb) {
      errors.thumbnail = "La vignette est obligatoire. Veuillez saisir une URL, choisir un preset HD ou téléverser une image.";
    }

    if (Object.keys(errors).length > 0) {
      setCategoryFieldErrors(errors);
      const firstError = errors.name || errors.hook || errors.thumbnail;
      setCategoryFormError(firstError || "Veuillez renseigner tous les champs obligatoires mis en évidence ci-dessous.");
      triggerToast("Formulaire incomplet : veuillez remplir les champs obligatoires.", "error");

      if (categoryModalBodyRef.current) {
        categoryModalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setTimeout(() => {
        if (errors.name) {
          categoryNameInputRef.current?.focus();
        } else if (errors.hook) {
          categoryHookInputRef.current?.focus();
        } else if (errors.thumbnail) {
          categoryThumbnailInputRef.current?.focus();
        }
      }, 150);
      return;
    }

    setCategoryFieldErrors({});
    setCategoryFormError(null);
    setIsSavingCategory(true);

    let catId = editingCategory ? editingCategory.id : (normalizeCategoryId(trimmedName) || ('cat-' + Date.now()));
    if (!catId || catId.trim() === '') {
      catId = 'cat-' + Date.now();
    }

    const resolvedThumbnail = trimmedThumb || getCategoryFallbackThumbnail(trimmedName);
    const resolvedHook = trimmedHook || getCategoryFallbackHook(trimmedName);
    const resolvedVideo = categoryFormData.videoUrl.trim() || getCategoryFallbackVideo(trimmedName);

    const isCategoryEnabled = categoryFormData.enabled !== false;

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
      enabled: isCategoryEnabled,
      isCustom: true, // Flag this category as user-created
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
      enabled: isCategoryEnabled,
      isCustom: true,
      subCategories: categoryObj.subCategories || [],
      createdAt: categoryObj.createdAt || Date.now()
    };

    try {
      await setDoc(doc(db, 'categories', catId), firestorePayload, { merge: true });

      setCategories(prev => {
        const exists = prev.some(c => c.id === catId);
        const updated = exists ? prev.map(c => c.id === catId ? categoryObj : c) : [...prev, categoryObj];
        try { localStorage.setItem('asrarhub_cached_categories', JSON.stringify(updated)); } catch (e) {}
        return updated;
      });

      triggerToast(`Catégorie "${categoryObj.name}" ${editingCategory ? "mise à jour" : "créée"} avec succès !`, "success");
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      console.error("Error saving category to Firestore:", err);
      // Fallback local update so admin work is never lost
      setCategories(prev => {
        const exists = prev.some(c => c.id === catId);
        const updated = exists ? prev.map(c => c.id === catId ? categoryObj : c) : [...prev, categoryObj];
        try { localStorage.setItem('asrarhub_cached_categories', JSON.stringify(updated)); } catch (e) {}
        return updated;
      });
      triggerToast(`Catégorie "${categoryObj.name}" enregistrée localement (${err?.message || "Synchronisation en cours"}).`, "info");
      setIsCategoryModalOpen(false);
    } finally {
      setIsSavingCategory(false);
    }
  };

  // Toggle Category Visibility (Activer / Bloquer l'affichage)
  const handleToggleCategoryVisibility = async (cat: CategoryItem) => {
    const newEnabled = cat.enabled === false ? true : false;
    try {
      await setDoc(doc(db, 'categories', cat.id), {
        id: cat.id,
        name: cat.name,
        enabled: newEnabled
      }, { merge: true });

      setCategories(prev => {
        const updated = prev.map(c => c.id === cat.id ? { ...c, enabled: newEnabled } : c);
        try { localStorage.setItem('asrarhub_cached_categories', JSON.stringify(updated)); } catch (e) {}
        return updated;
      });

      onShowToast(
        newEnabled
          ? `Catégorie "${cat.name}" activée et visible sur l'accueil !`
          : `Catégorie "${cat.name}" bloquée (masquée de l'accueil pour les utilisateurs).`,
        "success"
      );
    } catch (err: any) {
      console.error("Error toggling category visibility:", err);
      onShowToast("Erreur lors de la modification de visibilité: " + (err?.message || "Erreur inconnue"), "error");
    }
  };

  // Save SubCategory
  const handleSaveSubCategory = async () => {
    const trimmedName = subCategoryFormData.name.trim();
    if (!trimmedName) {
      setSubCategoryFormError("Le nom de la sous-catégorie est obligatoire.");
      onShowToast("Le nom de la sous-catégorie est obligatoire", "error");
      if (subCategoryModalBodyRef.current) {
        subCategoryModalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setTimeout(() => {
        subCategoryNameInputRef.current?.focus();
      }, 150);
      return;
    }
    if (!subCategoryParentId) {
      setSubCategoryFormError("Veuillez sélectionner une catégorie parente.");
      onShowToast("Veuillez sélectionner une catégorie parente", "error");
      return;
    }

    setSubCategoryFormError(null);

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

  // Handle image file upload directly to Firebase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCategory: boolean) => {
    const file = e.target.files?.[0];
    // Reset input value so selecting the same file again triggers onChange
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerToast("Veuillez sélectionner un fichier image valide (PNG, JPG, WebP, GIF)", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      triggerToast("L'image ne doit pas dépasser 10 Mo", "error");
      return;
    }

    setIsUploadingImage(true);
    setUploadProgress(15);
    try {
      const catId = isCategory 
        ? (editingCategory?.id || normalizeCategoryId(categoryFormData.name || 'new_cat')) 
        : (subCategoryFormData.name || 'sub_cat');

      const downloadUrl = await uploadCategoryThumbnailToFirebaseStorage(
        file,
        catId,
        (progress) => setUploadProgress(progress)
      );

      if (isCategory) {
        setCategoryFormData(prev => ({ ...prev, thumbnail: downloadUrl }));
        if (categoryFieldErrors.thumbnail) setCategoryFieldErrors(prev => ({ ...prev, thumbnail: undefined }));
        if (categoryFormError) setCategoryFormError(null);
      } else {
        setSubCategoryFormData(prev => ({ ...prev, thumbnail: downloadUrl }));
      }
      setIsUploadingImage(false);
      setUploadProgress(null);
      triggerToast("Vignette téléversée avec succès sur Firebase Storage !", "success");
    } catch (storageErr: any) {
      console.warn("[Storage] Firebase Storage direct upload failed, attempting local fallback:", storageErr);
      if (file.size < 600 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          if (isCategory) {
            setCategoryFormData(prev => ({ ...prev, thumbnail: dataUrl }));
            if (categoryFieldErrors.thumbnail) setCategoryFieldErrors(prev => ({ ...prev, thumbnail: undefined }));
            if (categoryFormError) setCategoryFormError(null);
          } else {
            setSubCategoryFormData(prev => ({ ...prev, thumbnail: dataUrl }));
          }
          setIsUploadingImage(false);
          setUploadProgress(null);
          triggerToast("Vignette enregistrée localement !", "info");
        };
        reader.onerror = () => {
          setIsUploadingImage(false);
          setUploadProgress(null);
          triggerToast("Erreur lors de la lecture du fichier image", "error");
        };
        reader.readAsDataURL(file);
      } else {
        setIsUploadingImage(false);
        setUploadProgress(null);
        triggerToast("Échec du téléversement vers Firebase Storage : " + (storageErr?.message || "Vérifiez votre connexion"), "error");
      }
    }
  };

  // Handle Drag & Drop of image file directly onto thumbnail dropzone
  const handleThumbnailFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverThumb(false);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerToast("Veuillez déposer un fichier image valide (PNG, JPG, WebP)", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      triggerToast("L'image ne doit pas dépasser 10 Mo", "error");
      return;
    }

    setIsUploadingImage(true);
    setUploadProgress(15);
    try {
      const catId = editingCategory?.id || normalizeCategoryId(categoryFormData.name || 'new_cat');
      const downloadUrl = await uploadCategoryThumbnailToFirebaseStorage(
        file,
        catId,
        (progress) => setUploadProgress(progress)
      );

      setCategoryFormData(prev => ({ ...prev, thumbnail: downloadUrl }));
      if (categoryFieldErrors.thumbnail) setCategoryFieldErrors(prev => ({ ...prev, thumbnail: undefined }));
      if (categoryFormError) setCategoryFormError(null);
      setIsUploadingImage(false);
      setUploadProgress(null);
      triggerToast("Vignette téléversée avec succès sur Firebase Storage !", "success");
    } catch (storageErr: any) {
      console.warn("[Storage Drop] Firebase Storage direct upload failed:", storageErr);
      if (file.size < 600 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setCategoryFormData(prev => ({ ...prev, thumbnail: dataUrl }));
          if (categoryFieldErrors.thumbnail) setCategoryFieldErrors(prev => ({ ...prev, thumbnail: undefined }));
          if (categoryFormError) setCategoryFormError(null);
          setIsUploadingImage(false);
          setUploadProgress(null);
          triggerToast("Vignette enregistrée localement !", "info");
        };
        reader.readAsDataURL(file);
      } else {
        setIsUploadingImage(false);
        setUploadProgress(null);
        triggerToast("Échec du téléversement sur Firebase Storage : " + (storageErr?.message || "Erreur"), "error");
      }
    }
  };

  // Handle direct thumbnail upload from Category Card directly to Firebase Storage
  const handleDirectCategoryThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetCatId = quickUploadCatId;
    // reset input value so re-uploading same file triggers event
    e.target.value = '';
    setQuickUploadCatId(null);

    if (!file || !targetCatId) return;

    if (!file.type.startsWith('image/')) {
      triggerToast("Veuillez sélectionner un fichier image valide", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      triggerToast("L'image ne doit pas dépasser 10 Mo pour un affichage optimal", "error");
      return;
    }

    setIsUploadingImage(true);
    try {
      const downloadUrl = await uploadCategoryThumbnailToFirebaseStorage(file, targetCatId);
      await setDoc(doc(db, 'categories', targetCatId), { thumbnail: downloadUrl }, { merge: true });

      setCategories(prev => {
        const next = prev.map(c => c.id === targetCatId ? { ...c, thumbnail: downloadUrl } : c);
        try {
          localStorage.setItem('asrarhub_cached_categories', JSON.stringify(next));
        } catch (err) {}
        return next;
      });

      setIsUploadingImage(false);
      triggerToast("Vignette téléversée sur Firebase Storage et mise à jour !", "success");
    } catch (storageErr: any) {
      console.warn("[Storage Direct] Upload error, falling back to local:", storageErr);
      if (file.size < 600 * 1024) {
        const reader = new FileReader();
        reader.onload = async () => {
          const dataUrl = reader.result as string;
          try {
            await setDoc(doc(db, 'categories', targetCatId), { thumbnail: dataUrl }, { merge: true });
            setCategories(prev => {
              const next = prev.map(c => c.id === targetCatId ? { ...c, thumbnail: dataUrl } : c);
              try {
                localStorage.setItem('asrarhub_cached_categories', JSON.stringify(next));
              } catch (err) {}
              return next;
            });
            setIsUploadingImage(false);
            triggerToast("Vignette de la catégorie mise à jour avec succès !", "success");
          } catch (err: any) {
            setIsUploadingImage(false);
            triggerToast("Erreur lors de la mise à jour de la vignette : " + err.message, "error");
          }
        };
        reader.onerror = () => {
          setIsUploadingImage(false);
          triggerToast("Erreur lors de la lecture du fichier image", "error");
        };
        reader.readAsDataURL(file);
      } else {
        setIsUploadingImage(false);
        triggerToast("Erreur Firebase Storage : " + (storageErr?.message || "Échec du téléversement"), "error");
      }
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full min-w-0 relative">
      {/* Floating Instant Toast Notification */}
      <AnimatePresence>
        {localToast && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            className={`fixed top-5 right-5 sm:right-8 z-[9999999] px-5 py-3.5 rounded-2xl shadow-2xl border text-xs sm:text-sm font-black flex items-center gap-3 backdrop-blur-md max-w-md pointer-events-auto ${
              localToast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-400 shadow-rose-950/40'
                : localToast.type === 'info'
                ? 'bg-blue-600 text-white border-blue-400 shadow-blue-950/40'
                : 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-950/40'
            }`}
          >
            {localToast.type === 'error' ? (
              <AlertCircle size={20} className="shrink-0 animate-bounce" />
            ) : (
              <CheckCircle2 size={20} className="shrink-0" />
            )}
            <span className="leading-snug">{localToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
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
                        Grille 4 Colonnes
                      </h4>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        Compact & Badges
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    Grille dense à 4 colonnes avec badges colorés et titres compacts.
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

              {/* Model: 3 Columns Grid */}
              <div
                onClick={() => handleSelectLayoutMode('grid3')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                  homeCategoryLayoutMode === 'grid3'
                    ? 'border-emerald-500 bg-white dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 hover:border-emerald-300'
                }`}
              >
                {homeCategoryLayoutMode === 'grid3' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <Check size={12} />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${homeCategoryLayoutMode === 'grid3' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-750 dark:text-gray-400'}`}>
                      <Grid3X3 size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                        Grille 3 Colonnes
                      </h4>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        Équilibré & Lisible
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    Grille à 3 colonnes parfaite pour les smartphones avec icônes agrandies et titres bien visibles.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[10px] font-bold">
                  <span className={homeCategoryLayoutMode === 'grid3' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}>
                    {homeCategoryLayoutMode === 'grid3' ? '✓ Modèle Actif' : 'Choisir ce modèle'}
                  </span>
                  <div className="grid grid-cols-3 gap-0.5">
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

            {/* Toggle Switcher Visibility / Lock */}
            <div className="p-3.5 bg-white/90 dark:bg-gray-800/90 rounded-2xl border border-emerald-200/90 dark:border-emerald-800/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2.5">
                <div className={`p-2 rounded-xl shrink-0 ${showCategoriesLayoutSwitcher ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'}`}>
                  {showCategoriesLayoutSwitcher ? <Eye size={18} /> : <EyeOff size={18} />}
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                    Icônes de Changement de Grille [ ⊞ 田 ⊞ ▢ ≡ ]
                    {!showCategoriesLayoutSwitcher ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800">
                        Invisibles (Bloquées)
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                        Visibles (Libre)
                      </span>
                    )}
                  </h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    {showCategoriesLayoutSwitcher
                      ? "Actuellement VISIBLES : Les visiteurs peuvent basculer entre les 5 modèles de grille via la barre d'icônes."
                      : "Actuellement INVISIBLES : L'affichage des catégories est bloqué sur votre modèle choisi ci-dessus (les visiteurs ne voient pas les 5 icônes)."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isUpdatingToggle}
                onClick={handleToggleCategoriesLayoutSwitcher}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none self-end sm:self-center ${
                  showCategoriesLayoutSwitcher ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                title={showCategoriesLayoutSwitcher ? "Masquer les icônes de grille sur l'accueil" : "Afficher les icônes de grille sur l'accueil"}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    showCategoriesLayoutSwitcher ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
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
                    checked={showCategoriesLayoutSwitcher}
                    onChange={handleToggleCategoriesLayoutSwitcher}
                    className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className={`font-semibold ${showCategoriesLayoutSwitcher ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    Icônes de grille [ ⊞ 田 ⊞ ▢ ≡ ]
                  </span>
                </label>
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
                      disabled={homeCategoryTitleSize <= 5}
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
                    <span className="text-[10px] font-bold text-gray-400">5px</span>
                    <input
                      type="range"
                      min={5}
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
                      { label: 'Mini (5px)', size: 5 },
                      { label: 'Très petit (8px)', size: 8 },
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

        {/* Category Type Filter Bar & Mock Purge */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCategoryTypeFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryTypeFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-750 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              Toutes ({categories.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryTypeFilter('custom')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                categoryTypeFilter === 'custom'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-750 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              <Sparkles size={13} className={categoryTypeFilter === 'custom' ? 'text-emerald-200' : 'text-emerald-500'} />
              <span>Mes Catégories ({categories.filter(c => isCustomCategory(c)).length})</span>
            </button>
            {categories.filter(c => !isCustomCategory(c)).length > 0 && (
              <button
                type="button"
                onClick={() => setCategoryTypeFilter('mock')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  categoryTypeFilter === 'mock'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-gray-750 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                Exemples Mock ({categories.filter(c => !isCustomCategory(c)).length})
              </button>
            )}
          </div>

          {categories.filter(c => !isCustomCategory(c)).length > 0 && (
            <button
              type="button"
              onClick={handleDeleteAllMockCategories}
              className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Supprimer définitivement toutes les catégories mock d'exemple pour ne garder que vos créations"
            >
              <Trash2 size={13} />
              <span>Supprimer tous les exemples mock ({categories.filter(c => !isCustomCategory(c)).length})</span>
            </button>
          )}
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
                        {isCustomCategory(cat) ? (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs ml-1">
                            <Sparkles size={10} /> Perso
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-md bg-gray-600/80 text-gray-200 text-[9px] font-semibold ml-1">
                            Mock
                          </span>
                        )}
                      </span>

                      <div className="flex items-center gap-1.5 pointer-events-auto">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCategoryVisibility(cat);
                          }}
                          className={`px-2.5 py-1 rounded-xl backdrop-blur-md text-[10px] font-black shadow-sm flex items-center gap-1 transition-all cursor-pointer ${
                            cat.enabled !== false
                              ? 'bg-emerald-600/90 hover:bg-emerald-500 text-white'
                              : 'bg-rose-600/90 hover:bg-rose-500 text-white animate-pulse'
                          }`}
                          title={cat.enabled !== false ? "Affichage actif sur l'accueil. Cliquez pour bloquer/masquer." : "Catégorie bloquée sur l'accueil. Cliquez pour activer."}
                        >
                          {cat.enabled !== false ? <Eye size={11} /> : <EyeOff size={11} />}
                          <span>{cat.enabled !== false ? 'Actif' : 'Bloqué'}</span>
                        </button>
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
                        thumbnailUrl={cat.thumbnail}
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
                      onClick={() => handleToggleCategoryVisibility(cat)}
                      className={`px-3 py-1.5 border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
                        cat.enabled !== false
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                      }`}
                      title={cat.enabled !== false ? "Affichage actif. Cliquer pour bloquer l'affichage sur l'accueil." : "Affichage bloqué. Cliquer pour réactiver sur l'accueil."}
                    >
                      {cat.enabled !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                      <span>{cat.enabled !== false ? 'Actif' : 'Bloqué'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setQuickUploadCatId(cat.id);
                        quickCatFileInputRef.current?.click();
                      }}
                      disabled={isUploadingImage}
                      className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      title="Téléverser directement une vignette pour cette catégorie"
                    >
                      <Upload size={13} />
                      <span className="hidden sm:inline">Vignette</span>
                    </button>

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
              <div 
                ref={categoryModalBodyRef}
                className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 overscroll-contain"
              >
                {/* Visual Error Banner if validation fails */}
                {categoryFormError && (
                  <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-500/80 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200 font-bold shadow-sm animate-pulse">
                    <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-extrabold block text-sm">Champ requis manquant :</span>
                      <span>{categoryFormError}</span>
                    </div>
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span>Nom de la Catégorie (Français) *</span>
                      {categoryFieldErrors.name && (
                        <span className="text-[11px] text-rose-600 dark:text-rose-400 font-black animate-bounce">
                          ← Obligatoire !
                        </span>
                      )}
                    </span>
                    <span className={`text-[10px] font-bold ${categoryFieldErrors.name ? 'text-rose-600' : 'text-emerald-600'}`}>
                      Obligatoire
                    </span>
                  </label>
                  <input
                    ref={categoryNameInputRef}
                    type="text"
                    placeholder="ex: Secrets & Pratiques, Richesse & Ouverture..."
                    value={categoryFormData.name}
                    onChange={(e) => {
                      setCategoryFormData(prev => ({ ...prev, name: e.target.value }));
                      if (categoryFieldErrors.name) setCategoryFieldErrors(prev => ({ ...prev, name: undefined }));
                      if (categoryFormError) setCategoryFormError(null);
                    }}
                    className={`w-full bg-gray-50 dark:bg-gray-800 border rounded-xl p-3 text-xs sm:text-sm text-gray-900 dark:text-white outline-none transition-all ${
                      categoryFieldErrors.name 
                        ? 'border-rose-500 ring-2 ring-rose-400/40 bg-rose-50/20' 
                        : 'border-gray-200 dark:border-gray-700 focus:border-emerald-500'
                    }`}
                  />
                  {categoryFieldErrors.name && (
                    <p id="category-name-error" className="text-xs text-rose-600 dark:text-rose-400 font-bold mt-1 flex items-center gap-1.5 animate-fadeIn">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{categoryFieldErrors.name}</span>
                    </p>
                  )}
                  {categoryFormData.hook.trim() && !categoryFormData.name.trim() && (
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="text-gray-400">Remplissage rapide :</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryFormData(prev => ({ ...prev, name: prev.hook.trim().slice(0, 45) }));
                          if (categoryFieldErrors.name) setCategoryFieldErrors(prev => ({ ...prev, name: undefined }));
                          if (categoryFormError) setCategoryFormError(null);
                        }}
                        className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                      >
                        Utiliser l'accroche comme nom
                      </button>
                    </div>
                  )}
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
                <div className={`space-y-1.5 p-3.5 rounded-2xl border transition-all ${
                  categoryFieldErrors.hook
                    ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-400 ring-2 ring-rose-400/40'
                    : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-900/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      <span>Phrase d'Accroche / Hook *</span>
                      {categoryFieldErrors.hook && (
                        <span className="text-[11px] text-rose-600 dark:text-rose-400 font-black animate-bounce">
                          ← Obligatoire !
                        </span>
                      )}
                    </label>
                    <span className={`text-[10px] font-bold ${categoryFieldErrors.hook ? 'text-rose-600' : 'text-amber-700 dark:text-amber-400'}`}>
                      Crucial pour l'attractivité
                    </span>
                  </div>
                  <textarea
                    ref={categoryHookInputRef}
                    rows={2}
                    placeholder="Une phrase percutante décrivant la valeur mystique ou spirituelle de cette catégorie..."
                    value={categoryFormData.hook}
                    onChange={(e) => {
                      setCategoryFormData(prev => ({ ...prev, hook: e.target.value }));
                      if (categoryFieldErrors.hook) setCategoryFieldErrors(prev => ({ ...prev, hook: undefined }));
                      if (categoryFormError) setCategoryFormError(null);
                    }}
                    className={`w-full bg-white dark:bg-gray-800 border rounded-xl p-2.5 text-xs sm:text-sm text-gray-900 dark:text-white outline-none transition-all ${
                      categoryFieldErrors.hook
                        ? 'border-rose-500 ring-2 ring-rose-400/40 bg-rose-50/20'
                        : 'border-amber-300 dark:border-amber-800/80 focus:ring-1 focus:ring-amber-500'
                    }`}
                  />
                  {categoryFieldErrors.hook && (
                    <p id="category-hook-error" className="text-xs text-rose-600 dark:text-rose-400 font-bold mt-1 flex items-center gap-1.5 animate-fadeIn">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{categoryFieldErrors.hook}</span>
                    </p>
                  )}
                  <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                    <span>Aperçu du texte accrocheur affiché sur la carte</span>
                    <button
                      type="button"
                      onClick={() => {
                        const sug = getCategoryFallbackHook(categoryFormData.name || 'Général');
                        setCategoryFormData(prev => ({ ...prev, hook: sug }));
                        if (categoryFieldErrors.hook) setCategoryFieldErrors(prev => ({ ...prev, hook: undefined }));
                        if (categoryFormError) setCategoryFormError(null);
                      }}
                      className="text-amber-700 dark:text-amber-400 hover:underline font-bold"
                    >
                      Générer une suggestion
                    </button>
                  </div>
                </div>

                {/* Thumbnail / Vignette avec Téléversement Direct Firebase Storage */}
                <div className={`space-y-3 p-4 rounded-2xl border transition-all ${
                  categoryFieldErrors.thumbnail
                    ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-400 ring-2 ring-rose-400/40'
                    : 'bg-gray-50/90 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                      <ImageIcon size={15} className="text-emerald-500" />
                      <span>Vignette (Thumbnail) *</span>
                      {categoryFieldErrors.thumbnail && (
                        <span className="text-[11px] text-rose-600 dark:text-rose-400 font-black animate-bounce">
                          ← Obligatoire !
                        </span>
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      {categoryFormData.thumbnail && (
                        categoryFormData.thumbnail.includes('firebasestorage.googleapis.com') || categoryFormData.thumbnail.includes('storage.googleapis.com') ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-black flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                            <CloudUpload size={11} /> Firebase Storage
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                            🌐 Image Web
                          </span>
                        )
                      )}
                      <span className={`text-[10px] font-bold ${categoryFieldErrors.thumbnail ? 'text-rose-600' : 'text-emerald-600'}`}>
                        Obligatoire
                      </span>
                    </div>
                  </div>

                  {/* Native File Input for direct Firebase Storage upload */}
                  <input
                    id="category-thumbnail-file-input"
                    ref={catFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    onChange={(e) => handleFileUpload(e, true)}
                    className="hidden"
                  />

                  {/* Uploading progress indicator */}
                  {isUploadingImage ? (
                    <div className="p-4 rounded-xl border border-emerald-300/80 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/40 flex flex-col items-center justify-center gap-2.5 animate-pulse">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                        <Loader2 size={18} className="animate-spin text-emerald-600" />
                        <span>Téléversement vers Firebase Storage... {uploadProgress !== null ? `${uploadProgress}%` : ''}</span>
                      </div>
                      <div className="w-full max-w-xs bg-emerald-200 dark:bg-emerald-900/60 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress || 45}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold">
                        Optimisation et génération du lien public sécurisé...
                      </span>
                    </div>
                  ) : categoryFormData.thumbnail.trim() ? (
                    /* Existing Thumbnail Card with Replacement & Preview Controls */
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-16 rounded-xl overflow-hidden bg-gray-900 border border-gray-300 dark:border-gray-600 shrink-0 relative shadow-inner group">
                          <img
                            src={sanitizeImageSource(categoryFormData.thumbnail) || getCategoryFallbackThumbnail(categoryFormData.name)}
                            alt="Aperçu vignette"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getCategoryFallbackThumbnail(categoryFormData.name);
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              id="category-thumbnail-replace-button"
                              type="button"
                              onClick={() => catFileInputRef.current?.click()}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                            >
                              <CloudUpload size={13} />
                              <span>Remplacer l'image</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCategoryFormData(prev => ({ ...prev, thumbnail: '' }));
                                if (categoryThumbnailInputRef.current) categoryThumbnailInputRef.current.value = '';
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                              title="Supprimer la vignette"
                            >
                              <Trash2 size={13} />
                              <span>Supprimer</span>
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-full" title={categoryFormData.thumbnail}>
                            Source : <span className="font-mono">{categoryFormData.thumbnail.slice(0, 55)}...</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Drag & Drop / File Input Dropzone when no image is selected */
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDraggingOverThumb(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDraggingOverThumb(false);
                      }}
                      onDrop={handleThumbnailFileDrop}
                      onClick={() => catFileInputRef.current?.click()}
                      className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 select-none ${
                        isDraggingOverThumb
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-4 ring-emerald-400/20 scale-[1.01]'
                          : categoryFieldErrors.thumbnail
                            ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/20 hover:border-rose-500'
                            : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 bg-white dark:bg-gray-800/80'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs">
                        <CloudUpload size={22} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-black text-gray-900 dark:text-white">
                          Glissez-déposez une image ou <span className="text-emerald-600 dark:text-emerald-400 underline">cliquez pour parcourir</span>
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          Téléversement direct sur <span className="font-bold text-emerald-600 dark:text-emerald-400">Firebase Storage</span> (PNG, JPG, WebP jusqu'à 10 Mo)
                        </p>
                      </div>
                      <button
                        id="category-thumbnail-file-button"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          catFileInputRef.current?.click();
                        }}
                        className="mt-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Upload size={12} />
                        <span>Choisir un fichier depuis votre appareil</span>
                      </button>
                    </div>
                  )}

                  {/* Validation Error message */}
                  {categoryFieldErrors.thumbnail && (
                    <p id="category-thumb-error" className="text-xs text-rose-600 dark:text-rose-400 font-bold mt-1 flex items-center gap-1.5 animate-fadeIn">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{categoryFieldErrors.thumbnail}</span>
                    </p>
                  )}

                  {/* Alternative Methods (Manual URL & Preset Picker) */}
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setShowUrlInputManual(prev => !prev)}
                      className="text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ExternalLink size={12} />
                      <span>{showUrlInputManual ? "Masquer saisie URL" : "🌐 Saisir une URL web externe"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCatPresetThumbnails(prev => !prev)}
                      className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                    >
                      {showCatPresetThumbnails ? "Masquer les Presets" : "✨ Choisir parmi les Presets HD"}
                    </button>
                  </div>

                  {/* Manual URL Input (Conditional) */}
                  {showUrlInputManual && (
                    <div className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-1 animate-fadeIn">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Lien URL Direct (ex: Unsplash) :
                      </label>
                      <input
                        ref={categoryThumbnailInputRef}
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={categoryFormData.thumbnail}
                        onChange={(e) => {
                          setCategoryFormData(prev => ({ ...prev, thumbnail: e.target.value }));
                          if (categoryFieldErrors.thumbnail) setCategoryFieldErrors(prev => ({ ...prev, thumbnail: undefined }));
                          if (categoryFormError) setCategoryFormError(null);
                        }}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-2 text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  {/* Preset Thumbnails Visual Picker */}
                  {showCatPresetThumbnails && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2 animate-fadeIn">
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
                              if (categoryFieldErrors.thumbnail) setCategoryFieldErrors(prev => ({ ...prev, thumbnail: undefined }));
                              if (categoryFormError) setCategoryFormError(null);
                              setShowCatPresetThumbnails(false);
                            }}
                            className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
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

                  {/* Statut d'affichage sur l'accueil (Actif ou Bloqué/Masqué) */}
                  <div className="pt-2 border-t border-gray-150 dark:border-gray-700">
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-100">
                            Affichage sur la page d'accueil
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            categoryFormData.enabled !== false
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          }`}>
                            {categoryFormData.enabled !== false ? 'Actif (Visible)' : 'Bloqué (Masqué)'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          {categoryFormData.enabled !== false
                            ? "Cette catégorie s'affiche publiquement sur l'accueil pour tous les utilisateurs."
                            : "Cette catégorie est bloquée : elle ne sera pas visible dans les grilles de l'accueil."}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCategoryFormData(prev => ({ ...prev, enabled: prev.enabled === false ? true : false }))}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          categoryFormData.enabled !== false ? 'bg-emerald-600' : 'bg-gray-350 dark:bg-gray-600'
                        }`}
                        role="switch"
                        aria-checked={categoryFormData.enabled !== false}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            categoryFormData.enabled !== false ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800 border-t border-gray-150 dark:border-gray-700 flex flex-col items-stretch gap-2.5 shrink-0 shadow-lg">
                {categoryFormError && (
                  <div className="w-full p-2.5 bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-700 rounded-xl flex items-center justify-between gap-2 text-xs text-rose-800 dark:text-rose-200 font-bold">
                    <div className="flex items-center gap-1.5 truncate">
                      <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                      <span className="truncate">{categoryFormError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (categoryFieldErrors.name) {
                          categoryModalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                          categoryNameInputRef.current?.focus();
                        } else if (categoryFieldErrors.hook) {
                          categoryHookInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          categoryHookInputRef.current?.focus();
                        } else if (categoryFieldErrors.thumbnail) {
                          categoryThumbnailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          categoryThumbnailInputRef.current?.focus();
                        } else {
                          categoryModalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                          categoryNameInputRef.current?.focus();
                        }
                      }}
                      className="underline text-[11px] font-black hover:text-rose-900 shrink-0 whitespace-nowrap cursor-pointer"
                    >
                      {categoryFieldErrors.name ? "Remplir le nom ↑" : categoryFieldErrors.hook ? "Remplir l'accroche ↑" : "Remplir la vignette ↑"}
                    </button>
                  </div>
                )}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
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
              <div 
                ref={subCategoryModalBodyRef}
                className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 overscroll-contain"
              >
                {/* Visual Error Banner if validation fails */}
                {subCategoryFormError && (
                  <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-500/80 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200 font-bold shadow-sm animate-pulse">
                    <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-extrabold block text-sm">Attention :</span>
                      <span>{subCategoryFormError}</span>
                    </div>
                  </div>
                )}

                {/* Parent Category Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Catégorie Parente *
                  </label>
                  <select
                    value={subCategoryParentId}
                    onChange={(e) => {
                      setSubCategoryParentId(e.target.value);
                      if (subCategoryFormError) setSubCategoryFormError(null);
                    }}
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
                    <span className="flex items-center gap-1.5">
                      <span>Nom de la Sous-Catégorie *</span>
                      {subCategoryFormError && (
                        <span className="text-[11px] text-rose-600 dark:text-rose-400 font-black animate-bounce">
                          ← Requis !
                        </span>
                      )}
                    </span>
                    <span className={`text-[10px] font-bold ${subCategoryFormError ? 'text-rose-600' : 'text-emerald-600'}`}>
                      Obligatoire
                    </span>
                  </label>
                  <input
                    ref={subCategoryNameInputRef}
                    type="text"
                    placeholder="ex: Sourate Al-Waqi'a, Khatims & Carrés, Bains de Purification..."
                    value={subCategoryFormData.name}
                    onChange={(e) => {
                      setSubCategoryFormData(prev => ({ ...prev, name: e.target.value }));
                      if (subCategoryFormError) setSubCategoryFormError(null);
                    }}
                    className={`w-full bg-gray-50 dark:bg-gray-800 border rounded-xl p-3 text-xs sm:text-sm text-gray-900 dark:text-white outline-none transition-all ${
                      subCategoryFormError 
                        ? 'border-rose-500 ring-2 ring-rose-400/40 bg-rose-50/20' 
                        : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500'
                    }`}
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
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                      <ImageIcon size={15} className="text-indigo-500" />
                      <span>Vignette (Thumbnail) *</span>
                    </label>
                    {subCategoryFormData.thumbnail?.includes('firebasestorage.googleapis.com') && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[9px] font-black flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                        <CloudUpload size={10} /> Firebase Storage
                      </span>
                    )}
                  </div>

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
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <CloudUpload size={11} /> {isUploadingImage ? "Envoi..." : "Firebase Storage"}
                        </button>
                        <input
                          ref={subFileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
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
              <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800 border-t border-gray-150 dark:border-gray-700 flex flex-col items-stretch gap-2.5 shrink-0 shadow-lg">
                {subCategoryFormError && (
                  <div className="w-full p-2.5 bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-700 rounded-xl flex items-center justify-between gap-2 text-xs text-rose-800 dark:text-rose-200 font-bold">
                    <div className="flex items-center gap-1.5 truncate">
                      <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                      <span className="truncate">{subCategoryFormError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        subCategoryModalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                        subCategoryNameInputRef.current?.focus();
                      }}
                      className="underline text-[11px] font-black hover:text-rose-900 shrink-0 whitespace-nowrap cursor-pointer"
                    >
                      Remplir le nom ↑
                    </button>
                  </div>
                )}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
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
      {/* Hidden file input for quick category thumbnail upload from category cards */}
      <input
        ref={quickCatFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleDirectCategoryThumbnailUpload}
        className="hidden"
      />
    </div>
  );
};
