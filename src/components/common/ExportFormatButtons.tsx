import React, { useState } from 'react';
import { Image, Scroll, FileCode, Check, Loader2 } from 'lucide-react';
import { exportAsSVG, exportAsPNG, exportAsParchment } from '../../utils/svgExporter';

interface ExportFormatButtonsProps {
  svgId: string;
  filename: string;
  title?: string;
  subtitle?: string;
  language?: string;
  btnClassName?: string;
}

export const ExportFormatButtons: React.FC<ExportFormatButtonsProps> = ({
  svgId,
  filename,
  title = 'Défense Métaphysique',
  subtitle,
  language = 'fr',
  btnClassName = ''
}) => {
  const [activeLoading, setActiveLoading] = useState<'svg' | 'png' | 'parchment' | null>(null);
  const [successFormat, setSuccessFormat] = useState<'svg' | 'png' | 'parchment' | null>(null);

  const handleDownload = async (format: 'svg' | 'png' | 'parchment') => {
    setActiveLoading(format);
    try {
      if (format === 'svg') {
        exportAsSVG({ svgId, filename });
      } else if (format === 'png') {
        await exportAsPNG({ svgId, filename, title, subtitle, language });
      } else if (format === 'parchment') {
        await exportAsParchment({ svgId, filename, title, subtitle, language });
      }
      setSuccessFormat(format);
      setTimeout(() => setSuccessFormat(null), 2500);
    } catch (err) {
      console.error(`Export failed for ${format}:`, err);
    } finally {
      setActiveLoading(null);
    }
  };

  const labels = {
    fr: {
      svg: 'SVG',
      png: 'PNG',
      parchment: 'Parchemin (PNG)'
    },
    en: {
      svg: 'SVG',
      png: 'PNG',
      parchment: 'Parchment (PNG)'
    },
    ha: {
      svg: 'SVG',
      png: 'PNG',
      parchment: 'Parchment (PNG)'
    }
  };

  const l = labels[(language as keyof typeof labels)] || labels.fr;

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 ${btnClassName}`}>
      {/* SVG Download */}
      <button
        type="button"
        onClick={() => handleDownload('svg')}
        disabled={!!activeLoading}
        title={l.svg}
        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-600 transition-all cursor-pointer shadow-sm disabled:opacity-50"
      >
        {activeLoading === 'svg' ? (
          <Loader2 size={14} className="animate-spin text-amber-400" />
        ) : successFormat === 'svg' ? (
          <Check size={14} className="text-emerald-400" />
        ) : (
          <FileCode size={14} className="text-amber-400" />
        )}
        <span>{l.svg}</span>
      </button>

      {/* PNG Download */}
      <button
        type="button"
        onClick={() => handleDownload('png')}
        disabled={!!activeLoading}
        title={l.png}
        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-600 transition-all cursor-pointer shadow-sm disabled:opacity-50"
      >
        {activeLoading === 'png' ? (
          <Loader2 size={14} className="animate-spin text-cyan-400" />
        ) : successFormat === 'png' ? (
          <Check size={14} className="text-emerald-400" />
        ) : (
          <Image size={14} className="text-cyan-400" />
        )}
        <span>{l.png}</span>
      </button>

      {/* Parchment PNG Download */}
      <button
        type="button"
        onClick={() => handleDownload('parchment')}
        disabled={!!activeLoading}
        title={l.parchment}
        className="px-3.5 py-2 rounded-xl bg-amber-900/90 hover:bg-amber-800 text-amber-100 font-bold text-xs flex items-center gap-1.5 border border-amber-500/60 transition-all cursor-pointer shadow-md disabled:opacity-50"
      >
        {activeLoading === 'parchment' ? (
          <Loader2 size={14} className="animate-spin text-amber-300" />
        ) : successFormat === 'parchment' ? (
          <Check size={14} className="text-emerald-400" />
        ) : (
          <Scroll size={14} className="text-amber-300" />
        )}
        <span>{l.parchment}</span>
      </button>
    </div>
  );
};
