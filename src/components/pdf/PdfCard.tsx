import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Check, 
  HardDrive, 
  Sparkles, 
  Lock, 
  AlertTriangle, 
  BookOpen, 
  Trash2, 
  RefreshCw, 
  Eye,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PdfDocument } from '../../types/pdfDocument';
import { 
  isPdfOfflineAvailable, 
  downloadAndCachePdf, 
  removePdfFromOfflineVault 
} from '../../utils/pdfOfflineVault';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

interface PdfCardProps {
  pdf: PdfDocument;
  onRead: (pdf: PdfDocument) => void;
  onDownloadedChange?: (pdfId: string, isDownloaded: boolean) => void;
  viewMode?: 'grid' | 'list';
}

export const PdfCard: React.FC<PdfCardProps> = ({
  pdf,
  onRead,
  onDownloadedChange,
  viewMode = 'grid',
}) => {
  const { language, t } = useLanguage();
  const { user, isPremium } = useAuth();

  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const isAdmin = user?.role === 'admin' || sessionStorage.getItem('admin_bypass') === 'true';
  const isPremiumUser = !!(isPremium || isAdmin || user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'pro');

  useEffect(() => {
    let isMounted = true;
    isPdfOfflineAvailable(pdf.id).then((available) => {
      if (isMounted) setIsDownloaded(available);
    });

    const handleSync = (e: any) => {
      if (e?.detail?.id === pdf.id) {
        setIsDownloaded(e.detail.action === 'saved');
      }
    };
    window.addEventListener('asrarhub_pdf_offline_sync', handleSync);
    return () => {
      isMounted = false;
      window.removeEventListener('asrarhub_pdf_offline_sync', handleSync);
    };
  }, [pdf.id]);

  const handleDownloadToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloading) return;

    if (isDownloaded) {
      if (window.confirm(language === 'fr' ? 'Retirer ce PDF du stockage hors-ligne local ?' : 'Remove from offline cache?')) {
        await removePdfFromOfflineVault(pdf.id);
        setIsDownloaded(false);
        if (onDownloadedChange) onDownloadedChange(pdf.id, false);
      }
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(10);
    try {
      const res = await downloadAndCachePdf(pdf, (p) => setDownloadProgress(p));
      if (res.success) {
        setIsDownloaded(true);
        if (onDownloadedChange) onDownloadedChange(pdf.id, true);
      } else {
        alert(res.error || 'Erreur de téléchargement');
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const localizedTitle = (language === 'en' && pdf.title_en) || (language === 'ha' && pdf.title_ha) || pdf.title;
  const localizedDesc = (language === 'en' && pdf.description_en) || (language === 'ha' && pdf.description_ha) || pdf.description;

  // Category labels
  const categoryLabels: Record<string, string> = {
    asrar: 'Asrar & Théurgie',
    invocations: 'Invocations & Dua',
    manuscrits: 'Manuscrits Anciens',
    sciences_lettres: 'Sciences des Lettres',
    spiritualite: 'Spiritualité & Tasawwuf',
    tafsir: 'Tafsir & Coran',
    divers: 'Archives Sacrées',
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="w-full max-w-full bg-white dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl p-3 sm:p-4 shadow-xs hover:shadow-md transition-all group overflow-hidden box-border min-w-0"
      >
        <div className="flex items-start gap-3 sm:gap-3.5 min-w-0 w-full flex-1">
          {/* Icon / Cover Thumbnail */}
          <div 
            onClick={() => onRead(pdf)}
            className="w-12 h-14 sm:w-14 sm:h-16 shrink-0 rounded-xl bg-gradient-to-br from-red-500/10 via-rose-500/15 to-red-600/20 dark:from-red-950/40 dark:to-rose-900/30 border border-red-200 dark:border-red-800/50 flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform shadow-xs cursor-pointer"
          >
            <span className="text-[9px] font-black tracking-widest text-red-600 dark:text-red-400">PDF</span>
            <FileText size={20} className="text-red-500 mt-0.5" />
            {isDownloaded && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-800" />
            )}
          </div>

          <div className="min-w-0 flex-1 w-full overflow-hidden">
            {/* Badges */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1 max-w-full min-w-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 truncate max-w-[130px] sm:max-w-[180px]">
                {categoryLabels[pdf.category] || pdf.category}
              </span>
              {pdf.isPremium && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 flex items-center gap-0.5 shrink-0">
                  <Sparkles size={9} />
                  <span>Premium</span>
                </span>
              )}
              {pdf.isMaintenance && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700/50 flex items-center gap-0.5 shrink-0">
                  <AlertTriangle size={9} />
                  <span>Maintenance</span>
                </span>
              )}
              {isDownloaded && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50 flex items-center gap-0.5 shrink-0">
                  <HardDrive size={9} />
                  <span>Hors-ligne</span>
                </span>
              )}
            </div>

            {/* Title with wrapping and line clamping */}
            <h3 
              onClick={() => onRead(pdf)}
              className="font-bold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2 leading-snug break-words group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors w-full cursor-pointer" 
              title={localizedTitle}
            >
              {localizedTitle}
            </h3>

            {/* Metadata */}
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 break-words mt-1">
              <span className="font-medium text-gray-600 dark:text-gray-300">{pdf.author || 'Tradition AsrarHub'}</span>
              <span className="mx-1.5 opacity-60">•</span>
              <span>{pdf.pagesCount || 1} {language === 'fr' ? 'pages' : 'p.'}</span>
              <span className="mx-1.5 opacity-60">•</span>
              <span>{pdf.fileSize || 'PDF'}</span>
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-2.5" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={handleDownloadToggle}
                disabled={isDownloading || pdf.isMaintenance}
                className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer shrink-0 ${
                  isDownloaded
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 border border-transparent'
                }`}
                title={isDownloaded ? (language === 'fr' ? 'Stocké en local (Cliquer pour supprimer)' : 'Locally stored (Click to delete)') : (language === 'fr' ? 'Télécharger en local hors-ligne' : 'Download for offline')}
                aria-label={isDownloaded ? 'Hors-ligne' : 'Télécharger'}
              >
                {isDownloading ? (
                  <RefreshCw size={16} className="animate-spin text-emerald-500" />
                ) : isDownloaded ? (
                  <Check size={16} className="text-emerald-500" />
                ) : (
                  <Download size={16} />
                )}
              </button>

              <button
                type="button"
                onClick={() => onRead(pdf)}
                className="p-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
                title={language === 'fr' ? 'Lire / Aperçu' : 'Read / Preview'}
                aria-label={language === 'fr' ? 'Lire / Aperçu' : 'Read'}
              >
                <BookOpen size={16} />
                <span className="hidden xs:inline">{language === 'fr' ? 'Consulter' : 'Read'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="w-full max-w-full min-w-0 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group relative box-border"
    >
      {/* Top Banner & Cover Image */}
      <div 
        onClick={() => onRead(pdf)}
        className="relative h-44 sm:h-48 w-full bg-slate-900 overflow-hidden cursor-pointer flex items-center justify-center"
      >
        {pdf.coverUrl ? (
          <img
            src={pdf.coverUrl}
            alt={pdf.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-95"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-2 shadow-inner">
              <FileText size={28} />
            </div>
            <span className="text-xs font-bold text-emerald-200/80 uppercase tracking-widest truncate max-w-full px-2">
              {categoryLabels[pdf.category] || pdf.category}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="px-2.5 py-1 rounded-xl bg-red-600 text-white font-black text-[10px] tracking-wider shadow-sm flex items-center gap-1 shrink-0">
              <span>PDF</span>
            </span>
            {pdf.isPremium && (
              <span className="px-2 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider shadow-sm flex items-center gap-1 shrink-0">
                <Sparkles size={10} />
                <span>VIP</span>
              </span>
            )}
          </div>

          {isDownloaded && (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[10px] shadow-sm flex items-center gap-1 shrink-0">
              <HardDrive size={10} />
              <span>Hors-ligne</span>
            </span>
          )}
        </div>

        {/* Maintenance Overlay Badge */}
        {pdf.isMaintenance && (
          <div className="absolute bottom-3 left-3 right-3 py-1.5 px-3 rounded-xl bg-rose-600/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5">
            <AlertTriangle size={13} className="shrink-0" />
            <span className="truncate">{language === 'fr' ? 'Maintenance en cours' : 'Under Maintenance'}</span>
          </div>
        )}
      </div>

      {/* Content Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between min-w-0 w-full overflow-hidden">
        <div className="min-w-0 w-full overflow-hidden">
          <div className="flex items-center justify-between gap-2 text-[11px] text-gray-500 dark:text-gray-400 mb-1.5 min-w-0">
            <span className="font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 text-[10px] truncate max-w-[150px]">
              {categoryLabels[pdf.category] || pdf.category}
            </span>
            <span className="font-medium shrink-0">
              {pdf.pagesCount ? `${pdf.pagesCount} p.` : 'PDF'} • {pdf.fileSize || 'Doc'}
            </span>
          </div>

          <h3 
            onClick={() => onRead(pdf)}
            className="font-bold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2 leading-snug break-words group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer"
          >
            {localizedTitle}
          </h3>

          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-2 leading-relaxed break-words">
            {localizedDesc}
          </p>

          <div className="mt-2.5 flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500 min-w-0">
            <span className="truncate">Par {pdf.author || 'Tradition AsrarHub'}</span>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between gap-2 min-w-0">
          {/* Download Offline Button */}
          <button
            type="button"
            onClick={handleDownloadToggle}
            disabled={isDownloading || pdf.isMaintenance}
            className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer shrink-0 ${
              isDownloaded
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'bg-gray-100 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 border border-transparent'
            }`}
            title={isDownloaded ? (language === 'fr' ? 'Stocké en local (Cliquer pour retirer)' : 'Stored locally (Click to remove)') : (language === 'fr' ? 'Télécharger' : 'Download')}
            aria-label={isDownloaded ? 'Hors-ligne' : 'Télécharger'}
          >
            {isDownloading ? (
              <RefreshCw size={16} className="animate-spin text-emerald-500" />
            ) : isDownloaded ? (
              <Check size={16} className="text-emerald-500" />
            ) : (
              <Download size={16} />
            )}
          </button>

          {/* Read button */}
          <button
            type="button"
            onClick={() => onRead(pdf)}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer truncate"
          >
            <BookOpen size={14} className="shrink-0" />
            <span className="truncate">{language === 'fr' ? 'Consulter' : 'Preview'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
