import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, Image as ImageIcon, Sparkles, RefreshCw, CheckCircle2, 
  AlertTriangle, Trash2, Eye, ShieldCheck, Download, Smartphone, 
  Monitor, Play, Maximize2, X, Sun, Moon, Info, Layout, Check
} from 'lucide-react';
import { useAppBranding, AppBranding } from '../../contexts/BrandingContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  validateBrandingFile, 
  convertFileToBase64, 
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
  const [loadingImgDimensions, setLoadingImgDimensions] = useState<{ width: number; height: number } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [fullscreenLoaderPreview, setFullscreenLoaderPreview] = useState(false);
  const [previewThemeMode, setPreviewThemeMode] = useState<'light' | 'dark'>('dark');
  const [useLogoAsFavicon, setUseLogoAsFavicon] = useState(true);

  // File input refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const loadingImgInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Synchronize draft when branding loads from Firestore
  useEffect(() => {
    setDraftBranding(branding);
    if (branding.appLogo) {
      getImageDimensions(branding.appLogo).then(setLogoDimensions);
    }
    if (branding.loadingScreenImage) {
      getImageDimensions(branding.loadingScreenImage).then(setLoadingImgDimensions);
    }
  }, [branding]);

  // Handle Logo Upload
  const handleLogoUpload = async (file: File) => {
    const validation = validateBrandingFile(file);
    if (!validation.isValid) {
      onShowToast?.(validation.error || 'Fichier invalide', 'error');
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      const dims = await getImageDimensions(base64);
      setLogoDimensions(dims);

      setDraftBranding(prev => ({
        ...prev,
        appLogo: base64,
        faviconUrl: useLogoAsFavicon ? base64 : prev.faviconUrl
      }));

      onShowToast?.(`Logo "${file.name}" (${validation.fileDetails?.sizeFormatted}) prêt pour l'aperçu !`, 'success');
    } catch (err: any) {
      onShowToast?.(err?.message || "Erreur de traitement de l'image", 'error');
    }
  };

  // Handle Loading Image Upload
  const handleLoadingImageUpload = async (file: File) => {
    const validation = validateBrandingFile(file);
    if (!validation.isValid) {
      onShowToast?.(validation.error || 'Fichier invalide', 'error');
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      const dims = await getImageDimensions(base64);
      setLoadingImgDimensions(dims);

      setDraftBranding(prev => ({
        ...prev,
        loadingScreenImage: base64
      }));

      onShowToast?.(`Image de chargement "${file.name}" (${validation.fileDetails?.sizeFormatted}) prête pour l'aperçu !`, 'success');
    } catch (err: any) {
      onShowToast?.(err?.message || "Erreur de traitement de l'image de chargement", 'error');
    }
  };

  // Handle Favicon Upload
  const handleFaviconUpload = async (file: File) => {
    const validation = validateBrandingFile(file);
    if (!validation.isValid) {
      onShowToast?.(validation.error || 'Fichier invalide', 'error');
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      setDraftBranding(prev => ({
        ...prev,
        faviconUrl: base64
      }));
      setUseLogoAsFavicon(false);
      onShowToast?.(`Favicon "${file.name}" importée avec succès !`, 'success');
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

      onShowToast?.("Apparence & Branding mis à jour et déployés en temps réel avec succès !", 'success');
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
        loadingScreenImage: '',
        loadingText: 'AsrarHub',
        loadingAnimationType: 'pulse',
        faviconUrl: '',
        isEnabled: true
      });
      setLogoDimensions(null);
      setLoadingImgDimensions(null);
      setIsResetConfirmOpen(false);
      onShowToast?.("Les logos et l'écran de chargement ont été réinitialisés aux valeurs par défaut !", 'success');
    } catch (error: any) {
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
    draftBranding.loadingScreenImage !== (branding.loadingScreenImage || '') ||
    draftBranding.loadingText !== (branding.loadingText || 'AsrarHub') ||
    draftBranding.loadingAnimationType !== (branding.loadingAnimationType || 'pulse') ||
    draftBranding.faviconUrl !== (branding.faviconUrl || '');

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
              Logo & Écran de Chargement
            </h2>
            <p className="text-sm text-emerald-100/80 mt-1.5 max-w-2xl leading-relaxed">
              Modifiez le logo principal de l'application et l'image d'animation du Loading Screen. 
              Les images importées sont optimisées en Base64, synchronisées sur Firestore et reflétées instantanément sur le Web, PWA et mobile sans recompiler l'application.
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
              <span>{branding.appLogo || branding.loadingScreenImage ? 'Logo personnalisé actif' : 'Logos AsrarHub par défaut'}</span>
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

          {/* 1. App Logo Upload Card */}
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
                    Affiché dans la barre de navigation, le header et les en-têtes officiels
                  </p>
                </div>
              </div>

              {draftBranding.appLogo && (
                <button
                  type="button"
                  onClick={() => {
                    setDraftBranding(prev => ({ ...prev, appLogo: '', faviconUrl: useLogoAsFavicon ? '' : prev.faviconUrl }));
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

            {/* Drag & Drop Area */}
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
                      Formats recommandés : <strong>SVG, PNG transparent, WebP</strong> (Max {MAX_BRANDING_FILE_SIZE_MB} Mo)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Favicon option checkbox */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300 select-none">
                <input
                  type="checkbox"
                  checked={useLogoAsFavicon}
                  onChange={(e) => {
                    setUseLogoAsFavicon(e.target.checked);
                    if (e.target.checked && draftBranding.appLogo) {
                      setDraftBranding(prev => ({ ...prev, faviconUrl: prev.appLogo }));
                    }
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Utiliser automatiquement ce logo comme icône d'onglet de navigateur (Favicon)</span>
              </label>

              {!useLogoAsFavicon && (
                <button
                  type="button"
                  onClick={() => faviconInputRef.current?.click()}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-bold underline cursor-pointer"
                >
                  Uploader une favicon spécifique
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

          {/* 2. Loading Screen & Animation Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-200/50 dark:border-amber-800/40">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    2. Image & Animation du Loading Screen (Splash)
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Écran d'attente lors du démarrage de l'app, chargement de modules ou transitions
                  </p>
                </div>
              </div>

              {draftBranding.loadingScreenImage && (
                <button
                  type="button"
                  onClick={() => {
                    setDraftBranding(prev => ({ ...prev, loadingScreenImage: '' }));
                    setLoadingImgDimensions(null);
                    onShowToast?.("Image de chargement personnalisée effacée du brouillon.", "info");
                  }}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 rounded-xl transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Revenir au loader animé par défaut"
                >
                  <Trash2 size={15} />
                  <span>Effacer</span>
                </button>
              )}
            </div>

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
                      <span>Image de loading personnalisée active</span>
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
                      Uploadez le logo ou symbole central pour l'écran de chargement
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Idéal : Emblème centré, GIF transparent, SVG doré ou PNG haute qualité (Max {MAX_BRANDING_FILE_SIZE_MB} Mo)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Loading Configurations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Texte d'accompagnement (Sous le logo)
                </label>
                <input
                  type="text"
                  placeholder="Ex: AsrarHub - Connaissance & Sagesse"
                  value={draftBranding.loadingText || ''}
                  onChange={(e) => setDraftBranding({ ...draftBranding, loadingText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 rounded-xl text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Effet d'Animation au Chargement
                </label>
                <select
                  value={draftBranding.loadingAnimationType || 'pulse'}
                  onChange={(e) => setDraftBranding({ ...draftBranding, loadingAnimationType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 rounded-xl text-xs font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="pulse">Pulsation douce (Recommandé)</option>
                  <option value="glow">Lueur Dorée Mystique (Glow)</option>
                  <option value="fade">Fondu Enchaîné (Fade)</option>
                  <option value="bounce">Rebond Énergique (Bounce)</option>
                  <option value="spin">Rotation Orbitale (Spin)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span>La publication met à jour Firestore et l'ensemble des appareils connectés.</span>
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
                  <p className="text-[11px] text-gray-500">Rendu instantané des modifications</p>
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
                  <span>Aperçu Barre de Navigation (Header)</span>
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

              {/* Preview 2: Mobile Loading Screen Simulation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
                  <span>Aperçu Écran de Chargement (Splash Screen)</span>
                  <button
                    type="button"
                    onClick={triggerFullscreenPreview}
                    className="text-[11px] text-amber-500 hover:text-amber-600 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 size={12} />
                    <span>Plein écran</span>
                  </button>
                </div>

                <div className="w-full bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] relative border border-slate-800 shadow-inner overflow-hidden select-none">
                  {/* Subtle ambient glow */}
                  <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

                  {/* Loading Content */}
                  <div className="relative z-10 flex flex-col items-center text-center gap-4">
                    {draftBranding.loadingScreenImage ? (
                      <div className="max-w-[140px] max-h-[100px] flex items-center justify-center">
                        <img
                          src={draftBranding.loadingScreenImage}
                          alt="Loading Preview"
                          className={`max-h-24 max-w-full object-contain ${getAnimationClass(draftBranding.loadingAnimationType)}`}
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

              {/* Preview 3: Browser Tab & Favicon Simulation */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                  Aperçu Onglet Navigateur (Favicon)
                </span>
                
                <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-2 border border-gray-200 dark:border-gray-750">
                  <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200/80 dark:border-gray-700 shadow-xs max-w-full">
                    {draftBranding.faviconUrl || draftBranding.appLogo ? (
                      <img
                        src={draftBranding.faviconUrl || draftBranding.appLogo}
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
              {draftBranding.loadingScreenImage ? (
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
                  Réinitialiser les logos ?
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cette action rétablira le logo vectoriel et le loader officiel par défaut.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 mb-6">
              Tous les utilisateurs retrouveront immédiatement les logos et animations par défaut d'AsrarHub.
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
