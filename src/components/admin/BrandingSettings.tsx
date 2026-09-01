import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Image as ImageIcon, Sparkles, RefreshCw, CheckCircle2, 
  AlertTriangle, Trash2, Eye, ShieldCheck, Download, Smartphone, 
  Monitor, Play, Maximize2, X, Sun, Moon, Info, Layout, Check,
  AppWindow, Globe, Layers, Bell, MessageSquare, Compass, Settings,
  Link as LinkIcon, Power, EyeOff, Zap
} from 'lucide-react';
import { useAppBranding, AppBranding } from '../../contexts/BrandingContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  validateBrandingFile, 
  convertFileToBase64, 
  compressAndOptimizeImage,
  getImageDimensions, 
  formatBytes,
  MAX_BRANDING_FILE_SIZE_MB 
} from '../../utils/brandingValidation';
import { AsrarLogo } from '../AsrarLogo';

interface BrandingSettingsProps {
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const BrandingSettings: React.FC<BrandingSettingsProps> = ({ onShowToast }) => {
  const { branding, updateBranding, resetBranding } = useAppBranding();
  const { user } = useAuth();

  // Local editing state for Live Preview before saving
  const [draftBranding, setDraftBranding] = useState<AppBranding>(branding);
  const [logoDimensions, setLogoDimensions] = useState<{ width: number; height: number } | null>(null);
  const [iconDimensions, setIconDimensions] = useState<{ width: number; height: number } | null>(null);
  const [loadingImgDimensions, setLoadingImgDimensions] = useState<{ width: number; height: number } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isInstantApplying, setIsInstantApplying] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [fullscreenLoaderPreview, setFullscreenLoaderPreview] = useState(false);
  const [previewThemeMode, setPreviewThemeMode] = useState<'light' | 'dark'>('dark');
  const [previewActiveTab, setPreviewActiveTab] = useState<'all' | 'header' | 'appIcon' | 'splash' | 'browser'>('all');
  const [useIconAsFavicon, setUseIconAsFavicon] = useState(true);
  const [loadingImageUrlInput, setLoadingImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // File input refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const loadingImgInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Synchronize draft when branding loads from Firestore
  useEffect(() => {
    setDraftBranding(branding);
    if (branding.appLogo) {
      getImageDimensions(branding.appLogo).then(setLogoDimensions);
    }
    if (branding.appIcon) {
      getImageDimensions(branding.appIcon).then(setIconDimensions);
    }
    if (branding.loadingScreenImage) {
      getImageDimensions(branding.loadingScreenImage).then(setLoadingImgDimensions);
    }
  }, [branding]);

  // Instant update helper: immediately saves to Firestore, localStorage & updates state
  const handleInstantUpdate = async (patch: Partial<AppBranding>, successMessage: string) => {
    setIsInstantApplying(true);
    const updated = { ...draftBranding, ...patch };
    setDraftBranding(updated);
    try {
      await updateBranding(patch, user?.email || 'admin@asrarhub.com');
      onShowToast?.(successMessage, 'success');
    } catch (err: any) {
      console.error('Instant branding update error:', err);
      onShowToast?.(`Erreur de synchronisation : ${err?.message || 'Erreur'}`, 'error');
    } finally {
      setIsInstantApplying(false);
    }
  };

  // Handle Logo Upload (Horizontal / Header)
  const handleLogoUpload = async (file: File) => {
    const validation = validateBrandingFile(file);
    if (!validation.isValid) {
      onShowToast?.(validation.error || 'Fichier invalide', 'error');
      return;
    }

    try {
      const base64 = await compressAndOptimizeImage(file, 600, 0.9);
      const dims = await getImageDimensions(base64);
      setLogoDimensions(dims);

      setDraftBranding(prev => ({
        ...prev,
        appLogo: base64
      }));

      await updateBranding({ appLogo: base64 }, user?.email || 'admin@asrarhub.com');
      onShowToast?.(`Logo principal "${file.name}" importé et appliqué instantanément !`, 'success');
    } catch (err: any) {
      onShowToast?.(err?.message || "Erreur de traitement du logo", 'error');
    }
  };

  // Handle App Icon Upload (Square 1:1, PWA, Mobile & Favicon)
  const handleIconUpload = async (file: File) => {
    const validation = validateBrandingFile(file);
    if (!validation.isValid) {
      onShowToast?.(validation.error || 'Fichier invalide', 'error');
      return;
    }

    try {
      const base64 = await compressAndOptimizeImage(file, 256, 0.9);
      const dims = await getImageDimensions(base64);
      setIconDimensions(dims);

      const patch: Partial<AppBranding> = {
        appIcon: base64,
        ...(useIconAsFavicon ? { faviconUrl: base64 } : {})
      };

      setDraftBranding(prev => ({ ...prev, ...patch }));
      await updateBranding(patch, user?.email || 'admin@asrarhub.com');
      onShowToast?.(`Icône d'application "${file.name}" importée et synchronisée avec succès !`, 'success');
    } catch (err: any) {
      onShowToast?.(err?.message || "Erreur de traitement de l'icône", 'error');
    }
  };

  // Handle Loading Image Upload with auto compression and instant sync
  const handleLoadingImageUpload = async (file: File) => {
    const validation = validateBrandingFile(file);
    if (!validation.isValid) {
      onShowToast?.(validation.error || 'Fichier invalide', 'error');
      return;
    }

    try {
      const base64 = await compressAndOptimizeImage(file, 512, 0.9);
      const dims = await getImageDimensions(base64);
      setLoadingImgDimensions(dims);

      const patch: Partial<AppBranding> = {
        loadingScreenImage: base64,
        loadingScreenEnabled: true,
        showLoadingImage: true
      };

      setDraftBranding(prev => ({ ...prev, ...patch }));
      await updateBranding(patch, user?.email || 'admin@asrarhub.com');
      onShowToast?.(`Image de chargement mise à jour et active instantanément !`, 'success');
    } catch (err: any) {
      onShowToast?.(err?.message || "Erreur de traitement de l'image de chargement", 'error');
    }
  };

  // Handle Loading Image URL direct submit
  const handleApplyLoadingImageUrl = async () => {
    if (!loadingImageUrlInput.trim()) {
      onShowToast?.("Veuillez saisir une URL valide", "info");
      return;
    }

    const url = loadingImageUrlInput.trim();
    try {
      const dims = await getImageDimensions(url);
      setLoadingImgDimensions(dims);

      const patch: Partial<AppBranding> = {
        loadingScreenImage: url,
        loadingScreenEnabled: true,
        showLoadingImage: true
      };

      setDraftBranding(prev => ({ ...prev, ...patch }));
      await updateBranding(patch, user?.email || 'admin@asrarhub.com');
      setLoadingImageUrlInput('');
      setShowUrlInput(false);
      onShowToast?.("Image de chargement par URL appliquée et active instantanément !", "success");
    } catch (err: any) {
      onShowToast?.("Impossible de charger l'image depuis cette URL.", "error");
    }
  };

  // Handle Custom Favicon Upload
  const handleFaviconUpload = async (file: File) => {
    const validation = validateBrandingFile(file);
    if (!validation.isValid) {
      onShowToast?.(validation.error || 'Fichier invalide', 'error');
      return;
    }

    try {
      const base64 = await compressAndOptimizeImage(file, 64, 0.9);
      setDraftBranding(prev => ({
        ...prev,
        faviconUrl: base64
      }));
      setUseIconAsFavicon(false);
      await updateBranding({ faviconUrl: base64 }, user?.email || 'admin@asrarhub.com');
      onShowToast?.(`Favicon spécifique importée et synchronisée !`, 'success');
    } catch (err: any) {
      onShowToast?.(err?.message || "Erreur lors de l'import de la favicon", 'error');
    }
  };

  // Drag and Drop helpers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropLogo = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDropIcon = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleIconUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDropLoading = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLoadingImageUpload(e.dataTransfer.files[0]);
    }
  };

  // Save all branding changes to Firestore
  const handleSaveBranding = async () => {
    setIsSaving(true);
    try {
      await updateBranding({
        ...draftBranding,
        isEnabled: draftBranding.isEnabled !== undefined ? draftBranding.isEnabled : true
      }, user?.email || 'admin@asrarhub.com');

      onShowToast?.("Apparence, Logo & Icône déployés en temps réel avec succès !", 'success');
    } catch (error: any) {
      console.error("Save branding error:", error);
      onShowToast?.(`Erreur de sauvegarde : ${error?.message || "Erreur inconnue"}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default branding
  const handleConfirmReset = async () => {
    try {
      await resetBranding();
      setDraftBranding({
        appLogo: '',
        appIcon: '',
        loadingScreenImage: '',
        loadingText: 'AsrarHub',
        loadingAnimationType: 'pulse',
        faviconUrl: '',
        isEnabled: true
      });
      setLogoDimensions(null);
      setIconDimensions(null);
      setLoadingImgDimensions(null);
      setIsResetConfirmOpen(false);
      onShowToast?.("Tous les logos, icônes et le loader ont été réinitialisés aux valeurs par défaut !", 'success');
    } catch (error) {
      onShowToast?.("Erreur lors de la réinitialisation.", 'error');
    }
  };

  // Trigger Fullscreen Loader Preview for 3.5 seconds
  const triggerFullscreenPreview = () => {
    setFullscreenLoaderPreview(true);
    setTimeout(() => {
      setFullscreenLoaderPreview(false);
    }, 3500);
  };

  // Render Loader Animation variant classes
  const getAnimationClass = (type?: string) => {
    switch (type) {
      case 'spin':
        return 'animate-spin';
      case 'bounce':
        return 'animate-bounce';
      case 'glow':
        return 'animate-pulse drop-shadow-[0_0_25px_rgba(245,158,11,0.7)]';
      case 'fade':
        return 'animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]';
      case 'pulse':
      default:
        return 'animate-pulse';
    }
  };

  const hasUnsavedChanges = 
    draftBranding.appLogo !== (branding.appLogo || '') ||
    draftBranding.appIcon !== (branding.appIcon || '') ||
    draftBranding.loadingScreenImage !== (branding.loadingScreenImage || '') ||
    draftBranding.loadingText !== (branding.loadingText || 'AsrarHub') ||
    draftBranding.loadingAnimationType !== (branding.loadingAnimationType || 'pulse') ||
    draftBranding.faviconUrl !== (branding.faviconUrl || '');

  // Current active icon to display
  const activeIconSrc = draftBranding.appIcon || draftBranding.faviconUrl || draftBranding.appLogo;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} className="animate-spin text-amber-400" />
              <span>Personnalisation Dynamique en Temps Réel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Logo, Icône & Écran de Chargement
            </h2>
            <p className="text-sm text-emerald-100/80 mt-1.5 max-w-2xl leading-relaxed">
              Personnalisez le logo principal, l'icône officielle de l'application (PWA, mobile et favicon) et l'animation du Loading Screen. 
              Les images importées sont synchronisées instantanément via Firestore et reflétées sur tous les appareils sans recompiler l'application.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={triggerFullscreenPreview}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            >
              <Play size={15} className="text-amber-300 fill-amber-300" />
              <span>Tester Loading (3s)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Réinitialiser par Défaut</span>
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-emerald-100/70">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">Statut : </span>
              <span>{branding.appLogo || branding.appIcon || branding.loadingScreenImage ? 'Branding personnalisé actif' : 'Branding AsrarHub officiel'}</span>
            </div>
            {branding.updatedAt ? (
              <div>
                <span className="text-emerald-300">Dernière mise à jour : </span>
                <span className="font-medium text-white">{new Date(branding.updatedAt).toLocaleString('fr-FR')}</span>
                {branding.updatedBy && <span className="opacity-80"> (par {branding.updatedBy})</span>}
              </div>
            ) : null}
          </div>

          {hasUnsavedChanges && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 font-bold text-[11px] animate-pulse">
              <AlertTriangle size={13} />
              <span>Modifications non enregistrées (voir aperçu)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Upload Controls (Left) + Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Upload & Configuration Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. App Logo Upload Card (Horizontal Banner / Header) */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/40">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    1. Logo Principal de l'Application
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Affiché dans la barre de navigation supérieure, le header et les en-têtes officiels
                  </p>
                </div>
              </div>

              {draftBranding.appLogo && (
                <button
                  type="button"
                  onClick={() => {
                    setDraftBranding(prev => ({ ...prev, appLogo: '' }));
                    setLogoDimensions(null);
                    onShowToast?.("Logo personnalisé supprimé du brouillon.", "info");
                  }}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 rounded-xl transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Supprimer ce logo et revenir au logo vectoriel par défaut"
                >
                  <Trash2 size={15} />
                  <span>Effacer</span>
                </button>
              )}
            </div>

            {/* Drag & Drop Area for Logo */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDropLogo}
              onClick={() => logoInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                draftBranding.appLogo
                  ? 'border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/20 dark:bg-emerald-950/10 hover:border-emerald-500'
                  : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500 bg-gray-50/50 dark:bg-gray-850 hover:bg-emerald-50/10'
              }`}
            >
              <input
                type="file"
                ref={logoInputRef}
                accept="image/png,image/svg+xml,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleLogoUpload(e.target.files[0]);
                  }
                }}
              />

              {draftBranding.appLogo ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                  <div className="p-4 bg-slate-900 rounded-2xl shadow-inner border border-gray-700 max-w-[220px] max-h-[90px] flex items-center justify-center">
                    <img
                      src={draftBranding.appLogo}
                      alt="Logo Aperçu"
                      className="max-h-16 max-w-full object-contain"
                    />
                  </div>
                  <div className="text-left space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
                      <CheckCircle2 size={12} />
                      <span>Logo personnalisé chargé</span>
                    </div>
                    {logoDimensions && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        Dimensions : {logoDimensions.width} x {logoDimensions.height} px
                      </p>
                    )}
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Cliquez ou glissez une autre image pour remplacer
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                    <Upload size={26} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      Cliquez pour sélectionner le logo ou glissez-déposez le fichier ici
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Formats recommandés : <strong>SVG, PNG transparent, WebP</strong> (Format horizontal, Max {MAX_BRANDING_FILE_SIZE_MB} Mo)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. App Icon Upload Card (Square 1:1, PWA, Favicon & Mobile) */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-200/50 dark:border-blue-800/40">
                  <Smartphone size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">
                      2. Icône de l'Application (App Icon, PWA & Favicon)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold uppercase">
                      Format 1:1 Carré
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Utilisée pour l'icône de l'application sur smartphone (PWA / iOS / Android), la favicon du navigateur et les badges
                  </p>
                </div>
              </div>

              {draftBranding.appIcon && (
                <button
                  type="button"
                  onClick={() => {
                    setDraftBranding(prev => ({ ...prev, appIcon: '', faviconUrl: useIconAsFavicon ? '' : prev.faviconUrl }));
                    setIconDimensions(null);
                    onShowToast?.("Icône personnalisée supprimée du brouillon.", "info");
                  }}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 rounded-xl transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Supprimer cette icône et revenir à l'icône par défaut"
                >
                  <Trash2 size={15} />
                  <span>Effacer</span>
                </button>
              )}
            </div>

            {/* Drag & Drop Area for Icon */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDropIcon}
              onClick={() => iconInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                draftBranding.appIcon
                  ? 'border-blue-300 dark:border-blue-700/60 bg-blue-50/20 dark:bg-blue-950/10 hover:border-blue-500'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 bg-gray-50/50 dark:bg-gray-850 hover:bg-blue-50/10'
              }`}
            >
              <input
                type="file"
                ref={iconInputRef}
                accept="image/png,image/svg+xml,image/jpeg,image/webp,image/x-icon"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleIconUpload(e.target.files[0]);
                  }
                }}
              />

              {draftBranding.appIcon ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                  <div className="w-20 h-20 p-2 bg-slate-900 rounded-2xl shadow-md border border-gray-700 flex items-center justify-center overflow-hidden">
                    <img
                      src={draftBranding.appIcon}
                      alt="Icône Aperçu"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <div className="text-left space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 text-[11px] font-bold">
                      <CheckCircle2 size={12} />
                      <span>Icône d'application personnalisée chargée</span>
                    </div>
                    {iconDimensions && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        Dimensions : {iconDimensions.width} x {iconDimensions.height} px
                      </p>
                    )}
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                      Cliquez ou glissez une autre image carrée pour remplacer
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                    <AppWindow size={26} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      Cliquez pour sélectionner l'icône carrée ou glissez-déposez le fichier ici
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Idéal : <strong>Format Carré 1:1</strong> (Ex: 512x512 ou 192x192 px, PNG transparent, SVG, WebP)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Favicon Sync Checkbox & Separate Upload */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300 select-none">
                <input
                  type="checkbox"
                  checked={useIconAsFavicon}
                  onChange={(e) => {
                    setUseIconAsFavicon(e.target.checked);
                    if (e.target.checked && draftBranding.appIcon) {
                      setDraftBranding(prev => ({ ...prev, faviconUrl: prev.appIcon }));
                    }
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Utiliser automatiquement cette icône comme Favicon de l'onglet de navigateur</span>
              </label>

              {!useIconAsFavicon && (
                <button
                  type="button"
                  onClick={() => faviconInputRef.current?.click()}
                  className="text-xs text-blue-600 hover:text-blue-700 font-bold underline cursor-pointer"
                >
                  Uploader un fichier .ico spécifique
                </button>
              )}
              <input
                type="file"
                ref={faviconInputRef}
                accept="image/png,image/x-icon,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFaviconUpload(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>

          {/* 3. Loading Screen & Animation Card - WITH FULL INSTANT REACTIVITY & DISABLE CONTROLS */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
            
            {/* Header with Title and Quick Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-200/50 dark:border-amber-800/40">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">
                      3. Écran de Chargement & Image de Loading (Splash)
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      draftBranding.loadingScreenEnabled !== false 
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                        : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                    }`}>
                      {draftBranding.loadingScreenEnabled !== false ? 'Activé' : 'Désactivé'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Contrôlez l'affichage de l'écran d'attente, l'image centrale et les effets d'animation en temps réel.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerFullscreenPreview}
                  className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Play size={13} className="fill-current" />
                  <span>Tester (3s)</span>
                </button>
              </div>
            </div>

            {/* TOGGLE CONTROLS: 1. Complete Splash Toggle & 2. Loading Image Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* TOGGLE 1: Master Splash Screen Enable / Disable */}
              <div className={`p-4 rounded-2xl border transition-all ${
                draftBranding.loadingScreenEnabled !== false
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/50'
                  : 'bg-red-50/40 dark:bg-red-950/20 border-red-200/80 dark:border-red-800/50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Power size={14} className={draftBranding.loadingScreenEnabled !== false ? 'text-emerald-500' : 'text-red-500'} />
                    <span>Écran de Chargement Global</span>
                  </span>
                  
                  {/* Switch Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !(draftBranding.loadingScreenEnabled !== false);
                      handleInstantUpdate({ loadingScreenEnabled: nextVal }, nextVal ? "Écran de chargement activé !" : "Écran de chargement désactivé (accès direct sans splash) !");
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      draftBranding.loadingScreenEnabled !== false ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        draftBranding.loadingScreenEnabled !== false ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {draftBranding.loadingScreenEnabled !== false 
                    ? "L'écran d'attente s'affiche lors du démarrage et des transitions."
                    : "Désactivé : l'application s'ouvre instantanément sans écran d'attente."}
                </p>
              </div>

              {/* TOGGLE 2: Show / Hide Central Image in Loader */}
              <div className={`p-4 rounded-2xl border transition-all ${
                draftBranding.showLoadingImage !== false
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/50'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    {draftBranding.showLoadingImage !== false ? <ImageIcon size={14} className="text-amber-500" /> : <EyeOff size={14} className="text-gray-400" />}
                    <span>Image / Logo au Chargement</span>
                  </span>

                  {/* Switch Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !(draftBranding.showLoadingImage !== false);
                      handleInstantUpdate({ showLoadingImage: nextVal }, nextVal ? "Image de chargement activée !" : "Image de chargement masquée (mode spinner minimaliste) !");
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      draftBranding.showLoadingImage !== false ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        draftBranding.showLoadingImage !== false ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {draftBranding.showLoadingImage !== false 
                    ? "Affiche votre image personnalisée ou le logo AsrarHub."
                    : "Masqué : Affiche un indicateur circulaire minimaliste épuré."}
                </p>
              </div>

            </div>

            {/* Custom Loading Image Uploader */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Image personnalisée du Loading Screen
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <LinkIcon size={12} />
                    <span>{showUrlInput ? 'Masquer URL' : 'Utiliser une URL web'}</span>
                  </button>
                  {draftBranding.loadingScreenImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setDraftBranding(prev => ({ ...prev, loadingScreenImage: '' }));
                        setLoadingImgDimensions(null);
                        handleInstantUpdate({ loadingScreenImage: '' }, "Image de chargement personnalisée supprimée. Retour au logo officiel.");
                      }}
                      className="text-[11px] text-red-500 hover:text-red-600 font-bold flex items-center gap-1 cursor-pointer ml-2"
                    >
                      <Trash2 size={12} />
                      <span>Supprimer l'image</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Direct URL input bar if expanded */}
              {showUrlInput && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-750">
                  <input
                    type="url"
                    placeholder="Coller l'URL directe de l'image (ex: https://.../loader.gif ou .png)"
                    value={loadingImageUrlInput}
                    onChange={(e) => setLoadingImageUrlInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-xl text-xs text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyLoadingImageUrl}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Zap size={12} />
                    <span>Appliquer</span>
                  </button>
                </div>
              )}

              {/* Drag & Drop Area for Loading Screen */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDropLoading}
                onClick={() => loadingImgInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                  draftBranding.loadingScreenImage
                    ? 'border-amber-300 dark:border-amber-700/60 bg-amber-50/20 dark:bg-amber-950/10 hover:border-amber-500'
                    : 'border-gray-200 dark:border-gray-700 hover:border-amber-500 bg-gray-50/50 dark:bg-gray-850 hover:bg-amber-50/10'
                }`}
              >
                <input
                  type="file"
                  ref={loadingImgInputRef}
                  accept="image/png,image/svg+xml,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleLoadingImageUpload(e.target.files[0]);
                    }
                  }}
                />

                {draftBranding.loadingScreenImage ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                    <div className="w-24 h-24 p-2 bg-slate-950 rounded-2xl shadow-inner border border-gray-700 flex items-center justify-center overflow-hidden">
                      <img
                        src={draftBranding.loadingScreenImage}
                        alt="Loading Image Aperçu"
                        className={`max-h-20 max-w-full object-contain ${getAnimationClass(draftBranding.loadingAnimationType)}`}
                      />
                    </div>
                    <div className="text-left space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                        <CheckCircle2 size={12} />
                        <span>Image active instantanément</span>
                      </div>
                      {loadingImgDimensions && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          Dimensions : {loadingImgDimensions.width} x {loadingImgDimensions.height} px
                        </p>
                      )}
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                        Cliquez ou glissez une autre image pour remplacer (PNG, GIF animé, SVG acceptés)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                      <Sparkles size={26} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        Uploadez une image ou GIF personnalisé pour le chargement
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Idéal : GIF transparent animé, SVG doré ou PNG haute qualité (Optimisé automatiquement)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Loading Configurations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Texte d'accompagnement (Sous le logo)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: AsrarHub - Connaissance & Sagesse"
                    value={draftBranding.loadingText || ''}
                    onChange={(e) => setDraftBranding({ ...draftBranding, loadingText: e.target.value })}
                    className="flex-1 px-3.5 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 rounded-xl text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleInstantUpdate({ loadingText: draftBranding.loadingText || 'AsrarHub' }, "Texte de chargement appliqué instantanément !")}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    title="Sauvegarder ce texte immédiatement"
                  >
                    <Check size={14} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Effet d'Animation au Chargement
                </label>
                <select
                  value={draftBranding.loadingAnimationType || 'pulse'}
                  onChange={(e) => {
                    const animType = e.target.value as any;
                    setDraftBranding({ ...draftBranding, loadingAnimationType: animType });
                    handleInstantUpdate({ loadingAnimationType: animType }, `Animation "${animType}" appliquée instantanément !`);
                  }}
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 rounded-xl text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="pulse">Pulsation douce (Recommandé)</option>
                  <option value="glow">Lueur Dorée Mystique (Glow)</option>
                  <option value="fade">Fondu Enchaîné (Fade)</option>
                  <option value="bounce">Rebond Énergique (Bounce)</option>
                  <option value="spin">Rotation Orbitale (Spin)</option>
                </select>
              </div>
            </div>

            {/* Instant sync notice banner */}
            <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between gap-3 text-xs text-emerald-800 dark:text-emerald-300">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-500 shrink-0" />
                <span>Tous les réglages de loading screen s'appliquent <strong>instantanément</strong> à la sélection.</span>
              </div>
              <button
                type="button"
                onClick={() => handleInstantUpdate({
                  loadingScreenImage: draftBranding.loadingScreenImage || '',
                  loadingScreenEnabled: draftBranding.loadingScreenEnabled !== false,
                  showLoadingImage: draftBranding.showLoadingImage !== false,
                  loadingText: draftBranding.loadingText || 'AsrarHub',
                  loadingAnimationType: draftBranding.loadingAnimationType || 'pulse'
                }, "Loading Screen synchronisé immédiatement sur tous les appareils !")}
                disabled={isInstantApplying}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-xs"
              >
                {isInstantApplying ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />}
                <span>Synchroniser tout</span>
              </button>
            </div>

          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span>La publication synchronise Firestore et met à jour tous les appareils connectés.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setDraftBranding(branding)}
                disabled={!hasUnsavedChanges || isSaving}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  hasUnsavedChanges
                    ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 opacity-50 cursor-not-allowed'
                }`}
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleSaveBranding}
                disabled={isSaving}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Déploiement en cours...</span>
                  </>
                ) : (
                  <>
                    <Check size={15} />
                    <span>💾 Enregistrer & Déployer l'Apparence</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Eye size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    Aperçu en Direct (Live Preview)
                  </h3>
                  <p className="text-[11px] text-gray-500">Rendu instantané multi-supports</p>
                </div>
              </div>

              {/* Theme toggle for preview */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewThemeMode('light')}
                  className={`p-1.5 rounded-lg transition-colors ${previewThemeMode === 'light' ? 'bg-white shadow text-amber-600' : 'text-gray-400'}`}
                  title="Aperçu Mode Clair"
                >
                  <Sun size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewThemeMode('dark')}
                  className={`p-1.5 rounded-lg transition-colors ${previewThemeMode === 'dark' ? 'bg-gray-850 shadow text-emerald-400' : 'text-gray-400'}`}
                  title="Aperçu Mode Sombre"
                >
                  <Moon size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              
              {/* Preview 1: Header Bar Simulation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Layout size={13} className="text-emerald-500" />
                    <span>Barre de Navigation (Header)</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-normal">Mode {previewThemeMode === 'dark' ? 'Sombre' : 'Clair'}</span>
                </div>

                <div className={`p-3 rounded-2xl border transition-all ${
                  previewThemeMode === 'dark' 
                    ? 'bg-emerald-800 border-emerald-700 text-white shadow-md' 
                    : 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                }`}>
                  <div className="flex items-center justify-between">
                    {/* Render custom logo or fallback */}
                    <div className="flex items-center h-10 max-w-[160px]">
                      {draftBranding.appLogo ? (
                        <img 
                          src={draftBranding.appLogo} 
                          alt="Logo Preview" 
                          className="max-h-8 max-w-full object-contain filter drop-shadow" 
                        />
                      ) : (
                        <AsrarLogo variant="horizontal" size="sm" hideSymbol={true} />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 opacity-80 scale-90">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">FR</div>
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview 2: Mobile Home Screen / PWA App Icon Simulation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Smartphone size={13} className="text-blue-500" />
                    <span>Écran d'Accueil Mobile (Icône PWA)</span>
                  </span>
                  <span className="text-[10px] text-blue-500 font-medium">iOS & Android</span>
                </div>

                <div className="w-full bg-gradient-to-b from-slate-900 via-slate-850 to-indigo-950 rounded-2xl p-4 border border-slate-750 shadow-inner relative overflow-hidden">
                  {/* Subtle simulated phone status bar */}
                  <div className="flex items-center justify-between text-[10px] text-white/60 mb-4 px-1 font-mono">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <span>5G</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* App Icon Grid simulation */}
                  <div className="grid grid-cols-4 gap-3 text-center">
                    {/* Simulated system icon 1 */}
                    <div className="flex flex-col items-center gap-1 opacity-40">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md text-white">
                        <MessageSquare size={20} />
                      </div>
                      <span className="text-[9px] text-white/80 font-medium truncate w-full">Messages</span>
                    </div>

                    {/* TARGET ASRARHUB APP ICON */}
                    <div className="flex flex-col items-center gap-1 relative group cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-1 flex items-center justify-center shadow-lg border border-emerald-400/40 relative overflow-hidden transition-transform group-hover:scale-105">
                        {activeIconSrc ? (
                          <img 
                            src={activeIconSrc} 
                            alt="App Icon Preview" 
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-full rounded-xl bg-gradient-to-br from-amber-400 to-emerald-600 flex items-center justify-center text-white font-extrabold text-lg shadow-inner">
                            A
                          </div>
                        )}
                        {/* Notification badge */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-slate-900 shadow">
                          1
                        </div>
                      </div>
                      <span className="text-[10px] text-white font-bold tracking-tight truncate w-full drop-shadow">
                        AsrarHub
                      </span>
                    </div>

                    {/* Simulated system icon 2 */}
                    <div className="flex flex-col items-center gap-1 opacity-40">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md text-white">
                        <Compass size={20} />
                      </div>
                      <span className="text-[9px] text-white/80 font-medium truncate w-full">Safari</span>
                    </div>

                    {/* Simulated system icon 3 */}
                    <div className="flex flex-col items-center gap-1 opacity-40">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-md text-white">
                        <Settings size={20} />
                      </div>
                      <span className="text-[9px] text-white/80 font-medium truncate w-full">Réglages</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview 3: Browser Tab & Favicon Simulation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Globe size={13} className="text-teal-500" />
                    <span>Onglet Navigateur (Favicon)</span>
                  </span>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-2 border border-gray-200 dark:border-gray-750">
                  <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200/80 dark:border-gray-700 shadow-xs max-w-full">
                    {activeIconSrc ? (
                      <img
                        src={activeIconSrc}
                        alt="Favicon"
                        className="w-4 h-4 object-contain rounded-xs shrink-0"
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] text-white font-bold shrink-0">
                        A
                      </div>
                    )}
                    <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-200 truncate">
                      AsrarHub - Connaissance & Sagesse
                    </span>
                    <X size={12} className="text-gray-400 ml-1 shrink-0" />
                  </div>
                </div>
              </div>

              {/* Preview 4: Mobile Loading Screen Simulation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Play size={13} className="text-amber-500" />
                    <span>Écran de Chargement (Splash Screen)</span>
                    {draftBranding.loadingScreenEnabled === false && (
                      <span className="text-[10px] text-red-500 font-bold bg-red-100 dark:bg-red-950/40 px-2 py-0.5 rounded-full">
                        Désactivé
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={triggerFullscreenPreview}
                    className="text-[11px] text-amber-500 hover:text-amber-600 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 size={12} />
                    <span>Plein écran</span>
                  </button>
                </div>

                <div className="w-full bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[190px] relative border border-slate-800 shadow-inner overflow-hidden select-none">
                  {/* Subtle ambient glow */}
                  <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

                  {/* Loading Content */}
                  <div className="relative z-10 flex flex-col items-center text-center gap-3">
                    {draftBranding.showLoadingImage === false ? (
                      <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin flex items-center justify-center my-2" />
                    ) : draftBranding.loadingScreenImage ? (
                      <div className="max-w-[140px] max-h-[90px] flex items-center justify-center">
                        <img
                          src={draftBranding.loadingScreenImage}
                          alt="Loading Preview"
                          className={`max-h-20 max-w-full object-contain ${getAnimationClass(draftBranding.loadingAnimationType)}`}
                        />
                      </div>
                    ) : (
                      <div className="scale-90">
                        <AsrarLogo variant="stacked" size="md" hideSymbol={false} />
                      </div>
                    )}

                    {draftBranding.loadingText && (
                      <span className="text-xs font-bold text-amber-400 tracking-wider animate-pulse">
                        {draftBranding.loadingText}
                      </span>
                    )}

                    {/* Loading indicator bar */}
                    <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-amber-400 animate-[pulse_1.2s_infinite]" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Fullscreen Interactive Loader Overlay Modal */}
      <AnimatePresence>
        {fullscreenLoaderPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-6 select-none"
          >
            {/* Top Close / Info notice */}
            <div className="absolute top-6 right-6 flex items-center gap-3">
              <span className="text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                Aperçu automatique (fermeture dans 3s)
              </span>
              <button
                type="button"
                onClick={() => setFullscreenLoaderPreview(false)}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-colors cursor-pointer border border-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center justify-center gap-6"
            >
              {draftBranding.showLoadingImage === false ? (
                <div className="w-16 h-16 rounded-full border-3 border-emerald-400 border-t-transparent animate-spin my-4 shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
              ) : draftBranding.loadingScreenImage ? (
                <div className="max-w-[280px] max-h-[220px] flex items-center justify-center">
                  <img
                    src={draftBranding.loadingScreenImage}
                    alt="Loading screen full"
                    className={`max-h-48 max-w-full object-contain ${getAnimationClass(draftBranding.loadingAnimationType)}`}
                  />
                </div>
              ) : (
                <AsrarLogo variant="stacked" size="fullscreen" hideSymbol={false} />
              )}

              {draftBranding.loadingText && (
                <span className="text-base font-bold text-amber-400 tracking-wider animate-pulse mt-2">
                  {draftBranding.loadingText}
                </span>
              )}

              <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden mt-4">
                <div className="w-full h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 animate-[pulse_1s_infinite]" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Confirmation de Réinitialisation */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-950/50 rounded-2xl">
                <RefreshCw size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                  Réinitialiser les logos et icônes ?
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cette action rétablira le logo vectoriel, l'icône officielle et le loader par défaut.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 mb-6">
              Tous les utilisateurs retrouveront immédiatement les logos, icônes et animations par défaut d'AsrarHub.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-650 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Oui, Réinitialiser par Défaut</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
