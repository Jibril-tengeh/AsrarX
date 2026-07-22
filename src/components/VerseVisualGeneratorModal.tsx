import React, { useState, useRef } from 'react';
import { X, Download, Sparkles, Image as ImageIcon, Check, Moon, Star, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toCanvas } from 'html-to-image';
import { downloadCanvasImage } from '../utils/downloadHelper';
import { useAuth } from '../contexts/AuthContext';
import { triggerProtectionModal } from './ContentProtectionManager';

interface VerseVisualGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseTitle: string;
  arabicText: string;
  phoneticText?: string;
  translationText: string;
  lunarPhaseName?: string;
  language?: string;
}

export const VerseVisualGeneratorModal: React.FC<VerseVisualGeneratorModalProps> = ({
  isOpen,
  onClose,
  verseTitle,
  arabicText,
  phoneticText,
  translationText,
  lunarPhaseName,
  language = 'fr'
}) => {
  const [selectedTheme, setSelectedTheme] = useState<'starlight' | 'emerald' | 'amber' | 'cosmic'>('starlight');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const { isPremium } = useAuth();

  if (!isOpen) return null;

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    if (!isPremium) {
      triggerProtectionModal('download');
      return;
    }
    setIsExporting(true);
    try {
      const canvas = await toCanvas(cardRef.current, { quality: 0.95, pixelRatio: 2, skipFonts: true });
      const cleanTitle = verseTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const fileName = `verset_contemplatif_${cleanTitle}.png`;
      await downloadCanvasImage(canvas, fileName);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to generate verse image:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const getThemeStyles = () => {
    switch (selectedTheme) {
      case 'starlight':
        return {
          bg: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900',
          border: 'border-amber-400/40',
          glow: 'bg-amber-400/10',
          arabicColor: 'text-amber-200',
          titleColor: 'text-amber-300',
          accentGradient: 'from-amber-400 to-amber-200',
          ornamentColor: 'text-amber-400/60'
        };
      case 'emerald':
        return {
          bg: 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950',
          border: 'border-emerald-400/40',
          glow: 'bg-emerald-400/10',
          arabicColor: 'text-emerald-100',
          titleColor: 'text-emerald-300',
          accentGradient: 'from-emerald-400 to-teal-200',
          ornamentColor: 'text-emerald-400/60'
        };
      case 'amber':
        return {
          bg: 'bg-gradient-to-br from-stone-950 via-amber-950 to-stone-900',
          border: 'border-amber-500/40',
          glow: 'bg-amber-500/10',
          arabicColor: 'text-amber-100',
          titleColor: 'text-amber-300',
          accentGradient: 'from-amber-300 to-orange-200',
          ornamentColor: 'text-amber-500/60'
        };
      case 'cosmic':
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950',
          border: 'border-purple-400/40',
          glow: 'bg-purple-400/10',
          arabicColor: 'text-purple-100',
          titleColor: 'text-purple-300',
          accentGradient: 'from-purple-300 to-indigo-200',
          ornamentColor: 'text-purple-400/60'
        };
    }
  };

  const currentStyle = getThemeStyles();

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'normal': return 'text-xl sm:text-2xl leading-relaxed';
      case 'xlarge': return 'text-3xl sm:text-4xl leading-loose';
      case 'large':
      default: return 'text-2xl sm:text-3xl leading-relaxed';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-2xl text-white shadow-2xl overflow-hidden my-auto relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-emerald-500/20 bg-black/40">
            <div className="flex items-center gap-2">
              <ImageIcon className="text-amber-400" size={20} />
              <h3 className="text-sm sm:text-base font-bold text-amber-200">
                {language === 'fr' ? "Modèle Visuel / Image de Verset Contemplatif" : "Contemplative Verse Visual Generator"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black/40 text-gray-400 hover:text-white hover:bg-black/60 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 space-y-5">
            {/* Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                {language === 'fr' ? "Thème Ambiance Stellaire" : "Stellar Atmosphere Theme"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setSelectedTheme('starlight')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    selectedTheme === 'starlight'
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                      : 'border-slate-700 bg-slate-800/60 text-gray-400 hover:border-slate-600'
                  }`}
                >
                  <Moon size={14} className="text-amber-400" />
                  {language === 'fr' ? "Nuit Stellaire" : "Starlight"}
                </button>

                <button
                  onClick={() => setSelectedTheme('emerald')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    selectedTheme === 'emerald'
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                      : 'border-slate-700 bg-slate-800/60 text-gray-400 hover:border-slate-600'
                  }`}
                >
                  <Sparkles size={14} className="text-emerald-400" />
                  {language === 'fr' ? "Émeraude" : "Emerald"}
                </button>

                <button
                  onClick={() => setSelectedTheme('amber')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    selectedTheme === 'amber'
                      ? 'border-amber-500 bg-amber-600/20 text-amber-200'
                      : 'border-slate-700 bg-slate-800/60 text-gray-400 hover:border-slate-600'
                  }`}
                >
                  <Star size={14} className="text-amber-400" />
                  {language === 'fr' ? "Aube Mystique" : "Amber Mystique"}
                </button>

                <button
                  onClick={() => setSelectedTheme('cosmic')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    selectedTheme === 'cosmic'
                      ? 'border-purple-400 bg-purple-500/20 text-purple-200'
                      : 'border-slate-700 bg-slate-800/60 text-gray-400 hover:border-slate-600'
                  }`}
                >
                  <Sparkles size={14} className="text-purple-400" />
                  {language === 'fr' ? "Vide Cosmique" : "Cosmic Void"}
                </button>
              </div>
            </div>

            {/* Customization Options */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-black/30 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">{language === 'fr' ? "Taille Calligraphie:" : "Font Size:"}</span>
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-1 rounded-lg font-bold cursor-pointer ${fontSize === 'normal' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-gray-300'}`}
                >
                  S
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-1 rounded-lg font-bold cursor-pointer ${fontSize === 'large' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-gray-300'}`}
                >
                  M
                </button>
                <button
                  onClick={() => setFontSize('xlarge')}
                  className={`px-2 py-1 rounded-lg font-bold cursor-pointer ${fontSize === 'xlarge' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-gray-300'}`}
                >
                  L
                </button>
              </div>

              <button
                onClick={() => setShowWatermark(!showWatermark)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-bold cursor-pointer transition-colors ${
                  showWatermark ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : 'border-slate-700 text-gray-400'
                }`}
              >
                <Check size={12} className={showWatermark ? 'opacity-100' : 'opacity-0'} />
                {language === 'fr' ? "Filigrane Asrar" : "Watermark"}
              </button>
            </div>

            {/* Renderable Canvas Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-700 shadow-2xl">
              <div
                ref={cardRef}
                className={`${currentStyle.bg} ${currentStyle.border} p-6 sm:p-10 border-2 relative text-center min-h-[320px] flex flex-col justify-between overflow-hidden shadow-2xl`}
              >
                {/* Background Stars and Glowing Aura */}
                <div className={`absolute -top-12 -right-12 w-48 h-48 ${currentStyle.glow} rounded-full blur-3xl pointer-events-none`} />
                <div className={`absolute -bottom-12 -left-12 w-48 h-48 ${currentStyle.glow} rounded-full blur-3xl pointer-events-none`} />

                {/* AsrarHub Corner Watermarks */}
                <div className="absolute top-2 left-3 text-[10px] font-black tracking-widest text-amber-400/30 pointer-events-none select-none uppercase">
                  AsrarHub
                </div>
                <div className="absolute top-2 right-3 text-[10px] font-black tracking-widest text-amber-400/30 pointer-events-none select-none uppercase">
                  AsrarHub
                </div>

                {/* Top Corner Ornaments & AsrarHub Badge */}
                <div className="flex justify-between items-center text-xs text-amber-300/80 mb-4 font-mono">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                    <Sparkles size={12} className="text-amber-400" />
                    AsrarHub
                  </span>
                  <span className="font-bold tracking-wider text-amber-200 uppercase">
                    {verseTitle}
                  </span>
                </div>

                {/* Islamic Calligraphic Frame Top */}
                <div className={`text-center my-2 ${currentStyle.ornamentColor}`}>
                  <span className="text-lg">﴿ ۞ ﴾</span>
                </div>

                {/* Main Arabic Verse */}
                <div className="my-auto py-4">
                  <p
                    dir="rtl"
                    className={`font-quran ${currentStyle.arabicColor} ${getFontSizeClass()} font-bold tracking-wide drop-shadow-md text-center`}
                    style={{ fontFamily: '"Amiri Quran", "Uthmani", "Scheherazade New", "Amiri", serif', direction: 'rtl' }}
                  >
                    {arabicText}
                  </p>

                  {phoneticText && (
                    <p className="text-xs sm:text-sm text-gray-300/90 italic font-serif mt-3 max-w-lg mx-auto">
                      "{phoneticText}"
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-amber-100/90 font-sans mt-3 max-w-xl mx-auto leading-relaxed">
                    « {translationText} »
                  </p>
                </div>

                {/* Islamic Calligraphic Frame Bottom & Watermark */}
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] text-gray-400">
                  <span className={`${currentStyle.titleColor} font-bold`}>
                    AsrarHub • {verseTitle}
                  </span>
                  <span className="text-amber-300/80 font-bold tracking-widest uppercase flex items-center gap-1">
                    <Sparkles size={10} /> ASRARHUB • SAGESSE & CONTEMPLATION
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-emerald-500/20 bg-black/40 flex items-center justify-between">
            {downloadSuccess ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                <Check size={16} />
                {language === 'fr' ? "Image enregistrée dans vos téléchargements !" : "Image saved to downloads!"}
              </span>
            ) : (
              <span className="text-xs text-gray-400">
                {language === 'fr' ? "Format PNG Haute Définition" : "High Definition PNG Format"}
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-300 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {language === 'fr' ? "Fermer" : "Close"}
              </button>

              <button
                onClick={handleDownloadImage}
                disabled={isExporting}
                className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isExporting ? (
                  <Sparkles size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                {language === 'fr' ? "Télécharger l'Image" : "Download Image"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
