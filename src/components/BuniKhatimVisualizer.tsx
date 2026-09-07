import React, { useRef, useState } from 'react';
import { BuniSystem } from '../data/buniSystemsData';
import { Download, Image as ImageIcon, FileText, Sparkles, Check, Printer } from 'lucide-react';
import { toCanvas, toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { downloadCanvasImage } from '../utils/downloadHelper';
import { AsrarHubWatermark } from './AsrarHubWatermark';

interface BuniKhatimVisualizerProps {
  system: BuniSystem;
  language: string;
  onExportParchment?: (title: string, subtitle: string, content: React.ReactNode) => void;
  onVerifyAndExecute?: (featureId: string, featureName: string, action: () => void) => void;
}

export const BuniKhatimVisualizer: React.FC<BuniKhatimVisualizerProps> = ({
  system,
  language,
  onExportParchment,
  onVerifyAndExecute,
}) => {
  const khatimRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Helper for title translated
  const getTitle = () => {
    if (language === 'ha') return system.titleHa;
    if (language === 'en') return system.titleEn;
    return system.titleFr;
  };

  const getRules = () => {
    if (language === 'ha') return system.rulesHa;
    if (language === 'en') return system.rulesEn;
    return system.rulesFr;
  };

  // Download PNG Image of the Khatim with automatic AsrarHub watermark
  const handleDownloadPNG = async () => {
    if (!khatimRef.current) return;
    try {
      setIsExporting(true);
      const canvas = await toCanvas(khatimRef.current, {
        cacheBust: true,
        backgroundColor: '#fffbeb',
        pixelRatio: 2,
        skipFonts: true,
        fontEmbedCSS: '',
      });

      const fileName = `Al-Buni_Khatim_${system.id}_${system.titleAr.replace(/\s+/g, '_')}.png`;
      await downloadCanvasImage(canvas, fileName);

      setDownloadSuccess('png');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error('Error generating image PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Download PDF Document of the Khatim
  const handleDownloadPDF = async () => {
    if (!khatimRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(khatimRef.current, {
        cacheBust: true,
        backgroundColor: '#fffbeb',
        pixelRatio: 2,
        skipFonts: true,
        fontEmbedCSS: '',
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Header Banner in PDF
      pdf.setFillColor(120, 53, 15); // Amber-900
      pdf.rect(0, 0, pdfWidth, 25, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('SHAMS AL-MA\'ARIF - AHMAD AL-BUNI', pdfWidth / 2, 12, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(getTitle(), pdfWidth / 2, 18, { align: 'center' });

      // Add Khatim Image
      pdf.addImage(dataUrl, 'PNG', 15, 30, pdfWidth - 30, pdfHeight > 200 ? 200 : pdfHeight);

      // Add Footer
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Sceau Al-Buni # ${system.number} - AsrarHub Sacred Archives`, pdfWidth / 2, 285, { align: 'center' });

      pdf.save(`Al-Buni_Parchment_${system.id}.pdf`);

      setDownloadSuccess('pdf');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Trigger Parchment Modal
  const handleOpenParchmentModal = () => {
    if (onExportParchment) {
      onExportParchment(
        getTitle(),
        `Système #${system.number} • ${system.titleAr}`,
        renderParchmentContent()
      );
    }
  };

  // Render specific Khatim SVG / Grid based on khatimType
  const renderKhatimDiagram = () => {
    switch (system.khatimType) {
      case 'zaIrajah':
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <svg viewBox="0 0 300 300" className="w-56 h-56 sm:w-64 sm:h-64 animate-spin-slow text-amber-900">
              <circle cx="150" cy="150" r="140" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6,6" />
              <circle cx="150" cy="150" r="115" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="150" cy="150" r="90" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
              <circle cx="150" cy="150" r="65" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="150" cy="150" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
              
              {/* Concentric letters */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 150 + 115 * Math.cos(angle);
                const y1 = 150 + 115 * Math.sin(angle);
                const x2 = 150 + 40 * Math.cos(angle);
                const y2 = 150 + 40 * Math.sin(angle);
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
                );
              })}
              <text x="150" y="155" textAnchor="middle" className="text-xs font-serif font-bold fill-amber-950" style={{ fontSize: '12px' }}>
                الزايرجة
              </text>
            </svg>
            <div className="mt-3 text-center dir-rtl font-arabic text-amber-900 font-bold text-sm">
              دَوَائِرُ الزَّايِرْجَةِ المَتَنَقِّلَةِ لِلْمَسَائِلِ الإِلَهِيَّةِ
            </div>
          </div>
        );

      case 'taksir':
      case 'jadhbSpiral':
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <svg viewBox="0 0 280 280" className="w-52 h-52 sm:w-60 sm:h-60 text-amber-900">
              <path
                d="M 140 140 m 0 0 a 10 10 0 0 1 10 10 a 20 20 0 0 1 -20 20 a 30 30 0 0 1 -30 -30 a 40 40 0 0 1 40 -40 a 50 50 0 0 1 50 50 a 60 60 0 0 1 -60 60 a 70 70 0 0 1 -70 -70 a 80 80 0 0 1 80 -80 a 90 90 0 0 1 90 90"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="140" cy="140" r="6" fill="currentColor" />
            </svg>
            <div className="mt-2 text-center dir-rtl font-arabic text-amber-950 font-bold text-xs">
              التَكْسِيرُ الحَلَزُونِيُّ وَسِرُّ الجَذْبِ
            </div>
          </div>
        );

      case 'khatimAnhar':
        return (
          <div className="p-4 flex flex-col items-center justify-center">
            <div className="w-52 h-52 border-4 border-amber-900 rounded-2xl relative p-2 bg-amber-50 flex flex-col justify-between shadow-inner">
              <div className="flex justify-between text-[11px] font-bold text-amber-900 dir-rtl font-arabic">
                <span>مَاءٌ</span>
                <span>لَبَنٌ</span>
              </div>
              
              {/* Crossed River Paths */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-0.5 bg-amber-900/60" />
                <div className="h-full w-0.5 bg-amber-900/60 absolute" />
                <div className="w-16 h-16 rounded-full border-2 border-amber-900 bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-950 font-arabic">
                  كَوْثَر
                </div>
              </div>

              <div className="flex justify-between text-[11px] font-bold text-amber-900 dir-rtl font-arabic">
                <span>خَمْرٌ</span>
                <span>عَسَلٌ</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-amber-950 font-arabic font-bold text-center">
              خَاتَمُ أَنْهَارِ الجَنَّةِ الأَرْبَعَةِ لِلطَّهَارَةِ وَالذَّكَاءِ
            </p>
          </div>
        );

      case 'awfaq3x3':
      case 'mizan':
      case 'istikhraj':
        return (
          <div className="p-4 flex flex-col items-center">
            <div className="grid grid-cols-3 gap-1 w-48 h-48 border-2 border-amber-900 p-1.5 bg-amber-100/80 rounded-xl shadow-md">
              {['٤', '٩', '٢', '٣', '٥', '٧', '٨', '١', '٦'].map((val, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-center border border-amber-800/40 rounded font-arabic font-bold text-amber-950 text-base ${
                    idx === 4 ? 'bg-amber-300/80 shadow-sm' : 'bg-amber-50'
                  }`}
                >
                  {val}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs font-arabic font-bold text-amber-900">
              وَفْقُ المُثَلَّثِ الغَزَالِيِّ المبارَك
            </p>
          </div>
        );

      case 'wafq100':
        return (
          <div className="p-4 flex flex-col items-center">
            <div className="grid grid-cols-8 gap-0.5 w-52 h-52 border-2 border-amber-900 p-1 bg-amber-900 rounded-lg">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="bg-amber-100 text-[8px] font-mono font-bold flex items-center justify-center text-amber-950">
                  {((i * 13) % 99) + 1}
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] font-arabic font-bold text-amber-900">
              الوَفْقُ المِئَوِيُّ العَظِيمُ (١٠٠ × ١٠٠)
            </p>
          </div>
        );

      case 'khatimKusuf':
        return (
          <div className="p-4 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full bg-amber-950 border-4 border-amber-600 relative flex items-center justify-center shadow-lg">
              <div className="w-32 h-32 rounded-full bg-amber-100/90 border-2 border-amber-800 flex items-center justify-center text-amber-950 font-arabic font-bold text-xs p-2 text-center">
                خَاتَمُ الكُسُوفِ وَالخُسُوفِ
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 flex flex-col items-center">
            <div className="w-48 h-48 border-4 border-amber-900 p-3 rounded-2xl bg-amber-50 flex flex-col items-center justify-center text-center space-y-2 shadow-inner">
              <div className="w-12 h-12 rounded-full bg-amber-900 text-amber-100 flex items-center justify-center font-bold text-lg">
                {system.number}
              </div>
              <p className="text-xs font-arabic font-bold text-amber-950 dir-rtl">
                {system.khatimFormulaAr}
              </p>
            </div>
          </div>
        );
    }
  };

  // Parchment Content
  const renderParchmentContent = () => (
    <div className="space-y-6 text-center text-amber-950 font-serif p-2 sm:p-4">
      <div className="border-b-2 border-amber-800/40 pb-4">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-bold block">
          شَمْسُ المَعَارِفِ وَلَطَائِفُ العَوَارِفِ
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-amber-900 mt-1">{getTitle()}</h2>
        <p className="text-xs text-amber-800 mt-1 dir-rtl font-arabic font-bold">
          {system.titleAr}
        </p>
      </div>

      <div className="my-4 bg-amber-100/60 p-4 rounded-2xl border border-amber-800/30">
        {renderKhatimDiagram()}
      </div>

      <div className="text-left dir-ltr text-xs bg-amber-50 p-4 rounded-xl border border-amber-800/20 space-y-2">
        <strong className="block text-amber-900 text-sm">{language === 'ha' ? 'Dokokin Aiki:' : language === 'en' ? 'Operating Rules:' : 'Règles d\'Activation :'}</strong>
        <p className="text-amber-950 leading-relaxed font-sans">{getRules()}</p>
      </div>

      <div className="text-xs dir-rtl font-arabic bg-amber-900 text-amber-100 p-3 rounded-xl font-bold">
        {system.khatimFormulaAr}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Khatim Printable Parchment Box */}
      <div
        ref={khatimRef}
        className="relative bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-800/40 rounded-3xl p-5 shadow-lg space-y-4 overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(#d97706 0.5px, transparent 0.5px)',
          backgroundSize: '16px 16px',
        }}
      >
        {/* AsrarHub Watermark Overlay */}
        <AsrarHubWatermark variant="parchment" opacity={0.16} showCentralSeal={true} />
        {/* Corner Filigree Deco */}
        <div className="absolute top-2 left-2 text-amber-800/40 text-xs font-serif font-bold">✧</div>
        <div className="absolute top-2 right-2 text-amber-800/40 text-xs font-serif font-bold">✧</div>
        <div className="absolute bottom-2 left-2 text-amber-800/40 text-xs font-serif font-bold">✧</div>
        <div className="absolute bottom-2 right-2 text-amber-800/40 text-xs font-serif font-bold">✧</div>

        {/* Visual Diagram */}
        {renderKhatimDiagram()}

        {/* Arabic Formula Bar */}
        <div className="p-3 bg-amber-900/10 dark:bg-amber-900/30 rounded-2xl border border-amber-800/30 text-center">
          <p className="text-xs font-arabic font-bold text-amber-950 dark:text-amber-200 dir-rtl leading-relaxed">
            {system.khatimFormulaAr}
          </p>
        </div>
      </div>

      {/* Download & Export Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-2">
          {/* Download Image PNG */}
          <button
            type="button"
            onClick={() => onVerifyAndExecute ? onVerifyAndExecute('shams_khatim_png', 'Téléchargement Image PNG', handleDownloadPNG) : handleDownloadPNG()}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {downloadSuccess === 'png' ? <Check size={14} /> : <ImageIcon size={14} />}
            <span>{language === 'ha' ? 'Zazzage Hoto (PNG)' : language === 'en' ? 'Download Image (PNG)' : 'Télécharger Image (PNG)'}</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={() => onVerifyAndExecute ? onVerifyAndExecute('shams_khatim_pdf', 'Téléchargement Document PDF', handleDownloadPDF) : handleDownloadPDF()}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {downloadSuccess === 'pdf' ? <Check size={14} /> : <FileText size={14} />}
            <span>{language === 'ha' ? 'Zazzage PDF' : language === 'en' ? 'Download PDF' : 'Télécharger PDF'}</span>
          </button>
        </div>

        {/* View Parchment Modal Trigger */}
        <button
          type="button"
          onClick={() => onVerifyAndExecute ? onVerifyAndExecute('shams_parchment', 'Export Parchemin Sacré', handleOpenParchmentModal) : handleOpenParchmentModal()}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 rounded-xl text-xs font-bold border border-amber-500/30 transition-all cursor-pointer"
        >
          <Sparkles size={14} className="text-amber-500" />
          <span>{language === 'ha' ? 'Duba Tutar Parchemin' : language === 'en' ? 'Parchment Preview' : 'Voir Parchemin Sacré'}</span>
        </button>
      </div>
    </div>
  );
};
