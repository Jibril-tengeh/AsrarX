import React, { useRef } from 'react';
import { X, Printer, Download, Sparkles, Feather } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toCanvas } from 'html-to-image';
import { downloadCanvasImage } from '../utils/downloadHelper';
import { useLanguage } from '../contexts/LanguageContext';

interface ParchmentExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  recipientName?: string;
  abjadWeight?: number;
}

export const ParchmentExporterModal: React.FC<ParchmentExporterModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  content,
  recipientName,
  abjadWeight,
}) => {
  const { language } = useLanguage();
  const parchmentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!parchmentRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await toCanvas(parchmentRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        skipFonts: true,
        backgroundColor: '#fef3c7',
      });
      const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      await downloadCanvasImage(canvas, `parchemin_rituel_${cleanTitle}.png`);
    } catch (err) {
      console.error('Error exporting parchment:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto"
        >
          {/* Top Bar / Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/20 bg-zinc-950/80">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Feather className="w-4 h-4 text-amber-500" />
              <span>
                {language === 'fr'
                  ? 'Fiche Rituelle / Parchemin Sacré'
                  : language === 'ha'
                  ? 'Takardar Rubutu da Khatimi'
                  : 'Ritual Scroll / Sacred Parchment'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 text-amber-200 hover:bg-zinc-700 text-xs font-medium transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Imprimer' : language === 'ha' ? 'Buga' : 'Print'}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs transition-colors shadow-lg cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {isExporting
                    ? '...'
                    : language === 'fr'
                    ? 'Télécharger Image'
                    : language === 'ha'
                    ? 'Saukar da Hoto'
                    : 'Download Image'}
                </span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Renderable Parchment Canvas Container */}
          <div className="p-4 sm:p-6 overflow-x-auto max-h-[75vh]">
            <div
              ref={parchmentRef}
              className="w-full min-w-[320px] max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-amber-50/95 text-amber-950 border-4 border-double border-amber-700/60 shadow-inner relative overflow-hidden font-serif"
              style={{
                backgroundImage:
                  'radial-gradient(#d97706 0.5px, transparent 0.5px), radial-gradient(#d97706 0.5px, #fef3c7 0.5px)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10 10',
              }}
            >
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-amber-800/40 text-lg select-none">✦</div>
              <div className="absolute top-2 right-2 text-amber-800/40 text-lg select-none">✦</div>
              <div className="absolute bottom-2 left-2 text-amber-800/40 text-lg select-none">✦</div>
              <div className="absolute bottom-2 right-2 text-amber-800/40 text-lg select-none">✦</div>

              {/* Bismillah Header */}
              <div className="text-center mb-6">
                <p className="font-serif text-xl sm:text-2xl text-amber-900 font-bold tracking-widest mb-1">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </p>
                <p className="text-xs text-amber-800/80 font-mono tracking-widest uppercase">
                  AsrarHub Sacred Treatise & Ritual Sheet
                </p>
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto mt-2" />
              </div>

              {/* Title & Metadata */}
              <div className="text-center mb-6">
                <h2 className="text-lg sm:text-xl font-extrabold text-amber-950 uppercase tracking-wide">
                  {title}
                </h2>
                {subtitle && <p className="text-xs italic text-amber-800 mt-1">{subtitle}</p>}
                {(recipientName || abjadWeight) && (
                  <div className="flex justify-center items-center gap-4 mt-3 text-xs text-amber-900 bg-amber-200/50 py-1.5 px-4 rounded-full max-w-fit mx-auto border border-amber-400/40 font-sans font-medium">
                    {recipientName && <span>Nom: <strong>{recipientName}</strong></span>}
                    {abjadWeight && <span>Poids (Zimām): <strong>{abjadWeight}</strong></span>}
                  </div>
                )}
              </div>

              {/* Main Content Render */}
              <div className="my-6 p-4 bg-amber-100/60 rounded-xl border border-amber-600/30 text-center font-serif text-sm leading-relaxed text-amber-950">
                {content}
              </div>

              {/* Footer Stamp */}
              <div className="pt-4 border-t border-amber-800/20 text-center flex items-center justify-between text-[11px] text-amber-800 font-sans">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Conscripteur: AsrarHub Ruhaniyat</span>
                </div>
                <span>Sceau Authentique — Sirr Al-Asrar</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
