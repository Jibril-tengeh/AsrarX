import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Check, 
  HardDrive, 
  Globe, 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  AlertTriangle, 
  Lock, 
  Sparkles, 
  FileText, 
  Share2, 
  Trash2, 
  RefreshCw, 
  Shield, 
  ZoomIn, 
  ZoomOut,
  BookOpen
} from 'lucide-react';
import { PdfDocument } from '../../types/pdfDocument';
import { 
  isPdfOfflineAvailable, 
  getPdfFromOfflineVault, 
  downloadAndCachePdf, 
  removePdfFromOfflineVault 
} from '../../utils/pdfOfflineVault';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface PdfViewerModalProps {
  pdf: PdfDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadedChange?: (pdfId: string, isDownloaded: boolean) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  pdf,
  isOpen,
  onClose,
  onDownloadedChange,
}) => {
  const { user, isPremium } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [activePdfUrl, setActivePdfUrl] = useState<string>('');
  const [isOfflineSource, setIsOfflineSource] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'reader' | 'info'>('reader');

  const isAdmin = user?.role === 'admin' || sessionStorage.getItem('admin_bypass') === 'true';
  const isPremiumUser = !!(isPremium || isAdmin || user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'pro');

  // Check offline availability and load local blob or online URL
  useEffect(() => {
    if (!pdf || !isOpen) {
      setActivePdfUrl('');
      setIsOfflineSource(false);
      return;
    }

    let isMounted = true;

    const checkAndLoad = async () => {
      const offlineExists = await isPdfOfflineAvailable(pdf.id);
      if (!isMounted) return;
      setIsDownloaded(offlineExists);

      if (offlineExists) {
        const offlineData = await getPdfFromOfflineVault(pdf.id);
        if (offlineData && isMounted) {
          setActivePdfUrl(offlineData.objectUrl);
          setIsOfflineSource(true);
          return;
        }
      }

      // Default to online PDF URL
      if (isMounted) {
        setActivePdfUrl(pdf.pdfUrl);
        setIsOfflineSource(false);
      }
    };

    checkAndLoad();

    return () => {
      isMounted = false;
    };
  }, [pdf, isOpen]);

  // Handle Download for Offline use
  const handleDownloadOffline = async () => {
    if (!pdf || isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(10);

    try {
      const result = await downloadAndCachePdf(pdf, (progress) => {
        setDownloadProgress(progress);
      });

      if (result.success) {
        setIsDownloaded(true);
        setIsOfflineSource(true);
        // Reload local object URL
        const offlineData = await getPdfFromOfflineVault(pdf.id);
        if (offlineData) {
          setActivePdfUrl(offlineData.objectUrl);
        }
        if (onDownloadedChange) onDownloadedChange(pdf.id, true);
      } else {
        alert(result.error || 'Impossible de télécharger le fichier pour le mode hors-ligne');
      }
    } catch (e: any) {
      console.error('Download error:', e);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  // Handle Remove from Offline Vault
  const handleRemoveOffline = async () => {
    if (!pdf) return;
    if (window.confirm(language === 'fr' ? 'Supprimer ce document du stockage hors-ligne de votre appareil ?' : 'Remove from offline storage?')) {
      await removePdfFromOfflineVault(pdf.id);
      setIsDownloaded(false);
      setIsOfflineSource(false);
      setActivePdfUrl(pdf.pdfUrl);
      if (onDownloadedChange) onDownloadedChange(pdf.id, false);
    }
  };

  // Handle Share / Copy Link
  const handleShare = async () => {
    if (!pdf) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: pdf.title,
          text: pdf.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch (e) {}
  };

  if (!isOpen || !pdf) return null;

  // Localized Titles
  const localizedTitle = (language === 'en' && pdf.title_en) || (language === 'ha' && pdf.title_ha) || pdf.title;
  const localizedDesc = (language === 'en' && pdf.description_en) || (language === 'ha' && pdf.description_ha) || pdf.description;

  // Check Maintenance Lock (Admins can bypass)
  const isMaintenanceBlocked = pdf.isMaintenance && !isAdmin;

  // Check Premium Lock (Premium users & Admins can bypass)
  const isPremiumBlocked = pdf.isPremium && !isPremiumUser;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md cursor-pointer transition-opacity"
      />

      {/* Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`relative z-10 w-full flex flex-col bg-slate-900 text-white border border-slate-700/80 shadow-2xl transition-all ${
          isFullscreen 
            ? 'fixed inset-0 rounded-none h-full max-h-screen' 
            : 'h-full sm:h-[92vh] max-w-6xl rounded-none sm:rounded-3xl overflow-hidden'
        }`}
      >
          {/* Top Header Controls Bar */}
          <div className="bg-slate-950 border-b border-slate-800 px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2.5 shrink-0">
            {/* Left Title & Status */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center font-black text-xs shadow-sm">
                PDF
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">
                    {localizedTitle}
                  </h3>
                  {/* Offline Badge indicator */}
                  {isOfflineSource ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <HardDrive size={10} />
                      <span>{language === 'fr' ? 'Hors-ligne (Local)' : 'Offline Vault'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      <Globe size={10} />
                      <span>{language === 'fr' ? 'En ligne' : 'Online Stream'}</span>
                    </span>
                  )}
                  {pdf.isPremium && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Sparkles size={10} />
                      <span>Premium</span>
                    </span>
                  )}
                  {pdf.isMaintenance && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <AlertTriangle size={10} />
                      <span>Maintenance</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                  {pdf.author || 'Tradition AsrarHub'} • {pdf.pagesCount || 1} pages • {pdf.fileSize || 'PDF'}
                </p>
              </div>
            </div>

            {/* Right Action Tools */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Tab Switcher (Mobile/Desktop) */}
              <div className="hidden min-[450px]:flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700">
                <button
                  onClick={() => setActiveTab('reader')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'reader' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {language === 'fr' ? 'Lecteur' : 'Reader'}
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'info' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {language === 'fr' ? 'Détails' : 'Info'}
                </button>
              </div>

              {/* Download Offline Button */}
              {!isMaintenanceBlocked && !isPremiumBlocked && (
                <>
                  {isDownloaded ? (
                    <button
                      type="button"
                      onClick={handleRemoveOffline}
                      className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 transition-all text-xs font-bold flex items-center justify-center cursor-pointer"
                      title={language === 'fr' ? 'Téléchargé (Cliquer pour supprimer du hors-ligne)' : 'Downloaded (Click to remove)'}
                      aria-label="Hors-ligne"
                    >
                      <Check size={16} className="text-emerald-400" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleDownloadOffline}
                      disabled={isDownloading}
                      className="p-1.5 sm:p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                      title={language === 'fr' ? 'Télécharger pour consultation hors-ligne' : 'Download for offline'}
                      aria-label="Télécharger"
                    >
                      {isDownloading ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                    </button>
                  )}
                </>
              )}

              {/* Share */}
              <button
                type="button"
                onClick={handleShare}
                className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Partager"
              >
                {copiedLink ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
              </button>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer hidden sm:flex"
                title={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Downloading Progress Bar */}
          {isDownloading && (
            <div className="w-full bg-slate-800 h-1 relative overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500"
                style={{ width: `${downloadProgress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          )}

          {/* Main Content Body */}
          <div className="flex-1 flex flex-col min-h-0 bg-slate-950 relative overflow-hidden">
            
            {/* Case 1: Maintenance Blocked */}
            {isMaintenanceBlocked ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4 shadow-xl">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mb-2">
                  {language === 'fr' ? 'Document en Maintenance' : 'Document under Maintenance'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                  {pdf.maintenanceMessage || 
                    (language === 'fr' 
                      ? "Ce fichier PDF est temporairement indisponible en raison d'une révision calligraphique ou vérification éditoriale par l'équipe AsrarHub." 
                      : "This PDF is temporarily under maintenance for verification.")}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  {language === 'fr' ? 'Fermer le lecteur' : 'Close Reader'}
                </button>
              </div>
            ) : isPremiumBlocked ? (
              /* Case 2: Premium Blocked */
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 shadow-xl">
                  <Lock size={32} />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                  <Sparkles size={13} />
                  <span>{language === 'fr' ? 'Manuscrit Réservé VIP' : 'Premium Sacred Access'}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mb-2">
                  {localizedTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                  {language === 'fr'
                    ? "Ce manuscrit fait partie des archives confidentielles réservées aux membres Premium d'AsrarHub. Débloquez l'accès illimité pour le lire et le sauvegarder en mode hors-ligne."
                    : "This manuscript is reserved for AsrarHub Premium members. Unlock to read and save for offline use."}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/payment');
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} />
                    <span>{language === 'fr' ? 'Débloquer l\'Accès Premium' : 'Unlock Premium Access'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    {language === 'fr' ? 'Plus tard' : 'Maybe Later'}
                  </button>
                </div>
              </div>
            ) : activeTab === 'info' ? (
              /* Case 3: Info Tab Details */
              <div className="flex-1 overflow-y-auto p-5 sm:p-8 max-w-3xl mx-auto space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center font-black text-base">
                      PDF
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl font-bold text-white">
                        {localizedTitle}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {pdf.author || 'Tradition AsrarHub'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-2">
                    {localizedDesc}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{language === 'fr' ? 'Pages' : 'Pages'}</span>
                      <span className="text-sm font-black text-white">{pdf.pagesCount || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{language === 'fr' ? 'Taille' : 'Size'}</span>
                      <span className="text-sm font-black text-white">{pdf.fileSize || 'Standard'}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{language === 'fr' ? 'Langue' : 'Language'}</span>
                      <span className="text-sm font-black text-emerald-400 uppercase">{pdf.language}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{language === 'fr' ? 'Catégorie' : 'Category'}</span>
                      <span className="text-sm font-black text-amber-400 capitalize">{pdf.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('reader')}
                    className="flex-1 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <BookOpen size={16} />
                    <span>{language === 'fr' ? 'Ouvrir le Lecteur Intégré' : 'Open Reader'}</span>
                  </button>
                  <a
                    href={activePdfUrl || pdf.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
                  >
                    <ExternalLink size={16} />
                    <span>{language === 'fr' ? 'Ouvrir dans un nouvel onglet' : 'Open in New Tab'}</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Case 4: Full Interactive PDF Viewer / Iframe Object */
              <div className="flex-1 flex flex-col w-full h-full relative overflow-hidden bg-slate-900">
                {activePdfUrl ? (
                  <iframe
                    src={`${activePdfUrl}#toolbar=1&navpanes=1`}
                    title={pdf.title}
                    className="w-full h-full border-0 rounded-none bg-slate-900"
                    style={{ minHeight: '100%' }}
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <RefreshCw size={28} className="animate-spin text-emerald-400 mb-3" />
                    <p className="text-xs text-slate-300">
                      {language === 'fr' ? 'Chargement du document PDF...' : 'Loading PDF document...'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Bar Controls for Zoom / Download */}
          {!isMaintenanceBlocked && !isPremiumBlocked && activeTab === 'reader' && (
            <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px]">
                  {isOfflineSource ? '📦 Stockage Local Sécurisé' : '🌐 Flux Réseau En Ligne'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activePdfUrl || pdf.pdfUrl}
                  download={`${pdf.id}.pdf`}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-[11px] font-bold"
                  title="Exporter sur mon appareil"
                >
                  <Download size={13} />
                  <span>{language === 'fr' ? 'Exporter PDF' : 'Export'}</span>
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>
  );
};
