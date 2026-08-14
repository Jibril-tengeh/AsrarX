import React, { useState, useRef } from 'react';
import { Download, FileText, Check, Loader2, Sparkles, Printer, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { exportElementToCanvas } from '../utils/exportSerializationHelper';
import { downloadCanvasImage } from '../utils/downloadHelper';
import { useLanguage } from '../contexts/LanguageContext';
import { ParchmentExporterModal } from './ParchmentExporterModal';

export interface SealExportButtonsProps {
  /** Reference to the DOM element containing the seal or khatim */
  targetRef?: React.RefObject<HTMLElement | null>;
  /** Fallback DOM element ID */
  elementId?: string;
  /** Title of the seal/khatim for file naming and parchment headers */
  title: string;
  /** Subtitle or spiritual context */
  subtitle?: string;
  /** Custom parchment content (if different from targetRef) */
  parchmentContent?: React.ReactNode;
  /** Custom direct PNG download handler */
  onDownloadPng?: () => Promise<void> | void;
  /** Custom direct Parchment handler */
  onDownloadParchment?: () => Promise<void> | void;
  /** Additional styling */
  className?: string;
  /** Alignment of buttons */
  align?: 'center' | 'left' | 'right' | 'between';
  /** Compact mode (e.g. inside small cards) */
  compact?: boolean;
  /** Extra metadata */
  recipientName?: string;
  abjadWeight?: number;
}

export const SealExportButtons: React.FC<SealExportButtonsProps> = ({
  targetRef,
  elementId,
  title,
  subtitle,
  parchmentContent,
  onDownloadPng,
  onDownloadParchment,
  className = '',
  align = 'center',
  compact = false,
  recipientName,
  abjadWeight,
}) => {
  const { language } = useLanguage();
  const lang = (language === 'ha' || language === 'en' ? language : 'fr') as 'fr' | 'en' | 'ha';

  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isPngSuccess, setIsPngSuccess] = useState(false);
  const [isParchmentModalOpen, setIsParchmentModalOpen] = useState(false);

  const t = {
    fr: {
      downloadPng: 'Télécharger PNG',
      downloadParchment: 'Exporter en Parchemin',
      exporting: 'Exportation...',
      downloaded: 'Téléchargé !',
      highResBadge: 'HD 300 DPI',
      parchmentBadge: 'Prêt à imprimer',
    },
    en: {
      downloadPng: 'Download PNG',
      downloadParchment: 'Export as Parchment',
      exporting: 'Exporting...',
      downloaded: 'Downloaded!',
      highResBadge: 'HD 300 DPI',
      parchmentBadge: 'Print-Ready',
    },
    ha: {
      downloadPng: 'Sauke Hoton PNG',
      downloadParchment: 'Fitar a Takardar Parchemin',
      exporting: 'Ana saukewa...',
      downloaded: 'An sauke!',
      highResBadge: 'HD 300 DPI',
      parchmentBadge: 'Shirye don bugawa',
    },
  }[lang];

  // Helper to obtain the target DOM element
  const getTargetElement = (): HTMLElement | null => {
    if (targetRef && targetRef.current) return targetRef.current;
    if (elementId) return document.getElementById(elementId);
    return null;
  };

  // Direct PNG Download
  const handleDownloadPng = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExportingPng) return;

    if (onDownloadPng) {
      try {
        setIsExportingPng(true);
        await onDownloadPng();
        setIsPngSuccess(true);
        setTimeout(() => setIsPngSuccess(false), 2500);
      } catch (err) {
        console.error('Error downloading seal PNG:', err);
      } finally {
        setIsExportingPng(false);
      }
      return;
    }

    const el = getTargetElement();
    if (!el) {
      console.warn('SealExportButtons: Target element not found for PNG export.');
      return;
    }

    try {
      setIsExportingPng(true);
      const isDark = document.documentElement.classList.contains('dark') || el.classList.contains('bg-slate-950') || el.classList.contains('bg-zinc-950');
      const bgColor = isDark ? '#090d16' : '#ffffff';
      
      const canvas = await exportElementToCanvas(el, bgColor);
      const cleanFileName = `khatim_${title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
      await downloadCanvasImage(canvas, `${cleanFileName}.png`);
      
      setIsPngSuccess(true);
      setTimeout(() => setIsPngSuccess(false), 2500);
    } catch (err) {
      console.error('Error downloading seal PNG:', err);
    } finally {
      setIsExportingPng(false);
    }
  };

  // Direct Parchment Action / Modal
  const handleOpenParchment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownloadParchment) {
      onDownloadParchment();
      return;
    }
    setIsParchmentModalOpen(true);
  };

  const justifyClass = 
    align === 'left' ? 'justify-start' :
    align === 'right' ? 'justify-end' :
    align === 'between' ? 'justify-between' :
    'justify-center';

  return (
    <>
      <div className={`w-full flex flex-wrap items-center gap-2.5 pt-3 pb-1 ${justifyClass} ${className}`}>
        {/* Button 1: Télécharger PNG */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDownloadPng}
          disabled={isExportingPng}
          className={`group inline-flex items-center gap-2 rounded-xl font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 ${
            compact
              ? 'px-3 py-1.5 text-xs bg-stone-900 hover:bg-stone-800 text-amber-200 border border-amber-500/30'
              : 'px-4 py-2.5 text-xs sm:text-sm bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 hover:from-stone-800 hover:to-stone-700 text-amber-200 border border-amber-500/40 shadow-amber-950/20'
          }`}
          title={t.highResBadge}
        >
          {isExportingPng ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          ) : isPngSuccess ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Image className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          )}
          <span>
            {isExportingPng ? t.exporting : isPngSuccess ? t.downloaded : t.downloadPng}
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
            PNG
          </span>
        </motion.button>

        {/* Button 2: Exporter en Parchemin */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenParchment}
          className={`group inline-flex items-center gap-2 rounded-xl font-bold transition-all shadow-md cursor-pointer ${
            compact
              ? 'px-3 py-1.5 text-xs bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 border border-amber-400/50'
              : 'px-4 py-2.5 text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 border border-amber-300/60 shadow-amber-600/20'
          }`}
          title={t.parchmentBadge}
        >
          <FileText className="w-4 h-4 text-stone-950 group-hover:scale-110 transition-transform" />
          <span>{t.downloadParchment}</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-950/80 animate-pulse" />
        </motion.button>
      </div>

      {/* Modal Parchemin */}
      {isParchmentModalOpen && (
        <ParchmentExporterModal
          isOpen={isParchmentModalOpen}
          onClose={() => setIsParchmentModalOpen(false)}
          title={title}
          subtitle={subtitle}
          recipientName={recipientName}
          abjadWeight={abjadWeight}
          content={
            parchmentContent || (
              <div className="p-4 text-center">
                <h4 className="text-xl font-bold font-serif text-amber-950 mb-2">{title}</h4>
                {subtitle && <p className="text-xs text-amber-900 italic mb-4">{subtitle}</p>}
                <div 
                  className="max-w-[340px] mx-auto p-4 border-2 border-amber-900/80 bg-amber-50 rounded-2xl shadow-inner my-2"
                  dangerouslySetInnerHTML={{
                    __html: getTargetElement()?.innerHTML || `<div class="py-8 font-serif font-bold text-amber-950 text-center">${title}</div>`
                  }}
                />
              </div>
            )
          }
        />
      )}
    </>
  );
};
