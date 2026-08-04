import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Video, Image as ImageIcon, Sparkles, Feather, Check, Loader2, Play, Music, Moon, Star, Volume2, Info, AlertTriangle, DownloadCloud, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { downloadVerseImage, generateVerseVideo, VerseVideoOptions, drawVerseCardOnCanvas, getGlobalAyahNumber } from '../utils/verseVideoGenerator';
import { downloadVideoFile } from '../utils/downloadHelper';
import { downloadAudioForOffline } from '../lib/offlineAudio';
import { getApiUrl } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { triggerProtectionModal } from './ContentProtectionManager';

export interface VerseSaveExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseTitle: string;
  arabicText: string;
  phoneticText?: string;
  translationText: string;
  verseNumber?: string; // e.g., "6:101", "2:189"
  lunarPhaseName?: string;
  language?: string;
  reciterApiId?: string;
  reciterName?: string;
}

export const VerseSaveExportModal: React.FC<VerseSaveExportModalProps> = ({
  isOpen,
  onClose,
  verseTitle,
  arabicText,
  phoneticText,
  translationText,
  verseNumber,
  lunarPhaseName,
  language = 'fr',
  reciterApiId,
  reciterName
}) => {
  const [selectedTheme, setSelectedTheme] = useState<'starlight' | 'emerald' | 'amber' | 'parchment' | 'cosmic'>('starlight');
  const [selectedFormat, setSelectedFormat] = useState<'image' | 'parchment' | 'video'>('video');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isTranslationCached, setIsTranslationCached] = useState<boolean | null>(null);
  const [isDownloadingPack, setIsDownloadingPack] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isPremium } = useAuth();

  // Check if translation audio pack is downloaded / cached locally
  useEffect(() => {
    if (!isOpen || selectedFormat !== 'video') return;
    const globalAyahNum = getGlobalAyahNumber(verseNumber);
    if (!globalAyahNum) return;

    const transEdition = language === 'en' ? 'en.walk' : 'fr.leclerc';
    const transUrl = `https://cdn.islamic.network/quran/audio/128/${transEdition}/${globalAyahNum}.mp3`;
    const proxiedUrl = getApiUrl(`/api/quran-audio-proxy?url=${encodeURIComponent(transUrl)}`);

    let isMounted = true;
    (async () => {
      try {
        if (typeof window !== 'undefined' && 'caches' in window) {
          const cache = await caches.open('quran-audio-cache');
          const matchProxy = await cache.match(proxiedUrl);
          const matchDirect = await cache.match(transUrl);
          if (isMounted) {
            setIsTranslationCached(!!matchProxy || !!matchDirect);
          }
        } else {
          if (isMounted) setIsTranslationCached(false);
        }
      } catch (err) {
        if (isMounted) setIsTranslationCached(false);
      }
    })();

    return () => { isMounted = false; };
  }, [isOpen, selectedFormat, verseNumber, language]);

  const handleDownloadTranslationPack = async () => {
    const globalAyahNum = getGlobalAyahNumber(verseNumber);
    if (!globalAyahNum) return;

    setIsDownloadingPack(true);
    const transEdition = language === 'en' ? 'en.walk' : 'fr.leclerc';
    const transUrl = `https://cdn.islamic.network/quran/audio/128/${transEdition}/${globalAyahNum}.mp3`;
    const proxiedUrl = getApiUrl(`/api/quran-audio-proxy?url=${encodeURIComponent(transUrl)}`);

    try {
      const success = await downloadAudioForOffline([proxiedUrl, transUrl]);
      if (success) {
        setIsTranslationCached(true);
        setSuccessMessage(
          language === 'fr'
            ? 'Pack traduction audio téléchargé et prêt pour la vidéo !'
            : 'Translation audio pack downloaded and ready!'
        );
      }
    } catch (err) {
      console.error("Failed to download translation audio pack:", err);
    } finally {
      setIsDownloadingPack(false);
    }
  };

  // Draw real-time canvas preview whenever theme or isOpen changes
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 540;
    canvas.height = 540;

    const opts: VerseVideoOptions = {
      verseTitle,
      arabicText,
      phoneticText,
      translationText,
      verseNumber,
      language,
      reciterApiId,
      reciterName,
      translationReciterApiId: language === 'en' ? 'en.walk' : 'fr.leclerc',
      theme: selectedTheme
    };

    drawVerseCardOnCanvas(canvas, opts, 0, 0);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (canvasRef.current) {
          drawVerseCardOnCanvas(canvasRef.current, opts, 0, 0);
        }
      });
    }
  }, [isOpen, selectedTheme, verseTitle, arabicText, phoneticText, translationText, reciterApiId, reciterName]);

  if (!isOpen) return null;

  const handleExecuteExport = async () => {
    if (!isPremium) {
      triggerProtectionModal('download');
      return;
    }

    setIsProcessing(true);
    setProgressPercent(0);
    setSuccessMessage(null);

    const opts: VerseVideoOptions = {
      verseTitle,
      arabicText,
      phoneticText,
      translationText,
      verseNumber,
      language,
      reciterApiId,
      reciterName,
      translationReciterApiId: language === 'en' ? 'en.walk' : 'fr.leclerc',
      theme: selectedFormat === 'parchment' ? 'parchment' : selectedTheme,
      onProgress: (prog, text) => {
        setProgressPercent(prog);
        setStatusText(text);
      }
    };

    const cleanTitle = verseTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

    try {
      if (selectedFormat === 'video') {
        setStatusText('Génération de la vidéo en cours...');
        const videoBlob = await generateVerseVideo(opts);
        const fileName = `verset_video_${cleanTitle}.webm`;
        await downloadVideoFile(videoBlob, fileName);
        setSuccessMessage(language === 'fr' ? 'Vidéo téléchargée avec succès !' : 'Video downloaded successfully!');
      } else if (selectedFormat === 'parchment') {
        setStatusText('Exportation du Parchemin Sacré...');
        const parchmentOpts = { ...opts, theme: 'parchment' as const };
        await downloadVerseImage(parchmentOpts, 'parchemin');
        setSuccessMessage(language === 'fr' ? 'Parchemin sauvegardé en PNG !' : 'Parchment saved as PNG!');
      } else {
        setStatusText('Exportation de l\'image HD...');
        await downloadVerseImage(opts, 'verset_hd');
        setSuccessMessage(language === 'fr' ? 'Image HD sauvegardée avec succès !' : 'HD Image saved successfully!');
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-xl text-white shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh] sm:max-h-[90vh] my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-emerald-500/20 bg-slate-900/95 shrink-0 z-10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-200">
                  {language === 'fr' ? "Sauvegarder & Exporter le Verset" : "Save & Export Verse"}
                </h3>
                <p className="text-xs text-gray-400">
                  {verseTitle} • {lunarPhaseName || "Verset Sacré"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="p-2 rounded-xl bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body - Scrollable Container */}
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 touch-pan-y min-h-0">
            
            {/* Format Selection Menu */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-300/90 uppercase tracking-wider block">
                {language === 'fr' ? "1. Choisir le Format d'Exportation" : "1. Choose Export Format"}
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Option 1: Vidéo Spirituelle */}
                <button
                  type="button"
                  onClick={() => setSelectedFormat('video')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    selectedFormat === 'video'
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/10'
                      : 'border-slate-800 bg-slate-800/50 text-gray-400 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Video size={20} className={selectedFormat === 'video' ? 'text-amber-400' : 'text-gray-400'} />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-black">
                      Audio HD
                    </span>
                  </div>
                  <span className="text-xs font-bold block text-white">Vidéo MP4/WebM</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5 leading-tight">
                    Avec Récitation & Vocalisation
                  </span>
                </button>

                {/* Option 2: Image PNG */}
                <button
                  type="button"
                  onClick={() => setSelectedFormat('image')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedFormat === 'image'
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200 ring-2 ring-emerald-400/30 shadow-lg shadow-emerald-500/10'
                      : 'border-slate-800 bg-slate-800/50 text-gray-400 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <ImageIcon size={20} className={selectedFormat === 'image' ? 'text-emerald-400' : 'text-gray-400'} />
                  </div>
                  <span className="text-xs font-bold block text-white">Image PNG HD</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5 leading-tight">
                    Thème Stellaire / Modèle
                  </span>
                </button>

                {/* Option 3: Parchemin Sacré */}
                <button
                  type="button"
                  onClick={() => setSelectedFormat('parchment')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedFormat === 'parchment'
                      ? 'border-amber-600 bg-amber-900/30 text-amber-200 ring-2 ring-amber-600/30 shadow-lg shadow-amber-600/10'
                      : 'border-slate-800 bg-slate-800/50 text-gray-400 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Feather size={20} className={selectedFormat === 'parchment' ? 'text-amber-500' : 'text-gray-400'} />
                  </div>
                  <span className="text-xs font-bold block text-white">Parchemin Sacré</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5 leading-tight">
                    Style Manuscrit Ancien
                  </span>
                </button>
              </div>
            </div>

            {/* Theme Selector (for Image or Video) */}
            {selectedFormat !== 'parchment' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  {language === 'fr' ? "2. Choisir l'Ambiance Visuelle" : "2. Visual Style"}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTheme('starlight')}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedTheme === 'starlight'
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                        : 'border-slate-800 bg-slate-800/50 text-gray-400'
                    }`}
                  >
                    <Moon size={12} className="text-amber-400" />
                    <span>Nuit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTheme('emerald')}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedTheme === 'emerald'
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                        : 'border-slate-800 bg-slate-800/50 text-gray-400'
                    }`}
                  >
                    <Sparkles size={12} className="text-emerald-400" />
                    <span>Émeraude</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTheme('amber')}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedTheme === 'amber'
                        ? 'border-amber-500 bg-amber-600/20 text-amber-200'
                        : 'border-slate-800 bg-slate-800/50 text-gray-400'
                    }`}
                  >
                    <Star size={12} className="text-amber-400" />
                    <span>Aube</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTheme('cosmic')}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedTheme === 'cosmic'
                        ? 'border-purple-400 bg-purple-500/20 text-purple-200'
                        : 'border-slate-800 bg-slate-800/50 text-gray-400'
                    }`}
                  >
                    <Sparkles size={12} className="text-purple-400" />
                    <span>Cosmique</span>
                  </button>
                </div>
              </div>
            )}

            {/* Video Audio Configuration Info Box */}
            {selectedFormat === 'video' && (
              <div className="p-3.5 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-xs space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-indigo-300">
                  <Volume2 size={16} className="text-indigo-400" />
                  <span>Audio & Récitation de la Vidéo</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-200">
                  <div className="p-2 rounded-xl bg-indigo-900/40 border border-indigo-500/20">
                    <span className="text-amber-400 font-semibold block">📖 Récitateur Arabe :</span>
                    <span className="font-bold text-white">{reciterName || "Récitateur actif"}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-indigo-900/40 border border-indigo-500/20">
                    <span className="text-amber-400 font-semibold block">🗣️ Récitation Traduction :</span>
                    <span className="font-bold text-white">
                      {language === 'en' ? 'Ibrahim Walk (Traduction Anglaise)' : 'Youssouf Leclerc (Traduction Française)'}
                    </span>
                  </div>
                </div>

                {/* Verification & Download Alert Banner if translation pack is missing or not cached */}
                {isTranslationCached === false ? (
                  <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <AlertTriangle size={18} className="text-amber-400 shrink-0 animate-pulse" />
                      <span>Pack de Traduction Audio Requis</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-100/90">
                      Le récitateur sélectionné (<strong>{reciterName || "Arabe"}</strong>) ne comporte pas la récitation parlée de la traduction. Pour activer et inclure la voix française ({language === 'en' ? 'anglaise' : 'française'}) dans votre vidéo, téléchargez le pack audio associé.
                    </p>
                    <button
                      type="button"
                      onClick={handleDownloadTranslationPack}
                      disabled={isDownloadingPack}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isDownloadingPack ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Téléchargement du pack audio en cours...</span>
                        </>
                      ) : (
                        <>
                          <DownloadCloud size={16} />
                          <span>Télécharger le Pack Audio ({language === 'en' ? 'Ibrahim Walk' : 'Youssouf Leclerc'})</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : isTranslationCached === true ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Pack de traduction audio ({language === 'en' ? 'Ibrahim Walk' : 'Youssouf Leclerc'}) prêt et disponible pour la vidéo !</span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px] flex items-start gap-2 leading-relaxed">
                    <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      La vidéo combine la récitation du Coran en arabe avec la récitation vocale de la traduction en français.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Realtime Canvas Preview */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                {language === 'fr' ? "Aperçu de la Carte" : "Card Preview"}
              </span>
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black/40 flex justify-center p-2 shadow-inner">
                <canvas
                  ref={canvasRef}
                  className="w-full max-w-[280px] sm:max-w-[320px] h-auto rounded-xl shadow-2xl aspect-square"
                />
              </div>
            </div>

            {/* Progress Bar during Video / Image Export */}
            {isProcessing && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-amber-400" />
                    <span>{statusText || 'Génération en cours...'}</span>
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-pulse">
                <Check size={18} />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="p-4 border-t border-emerald-500/20 bg-slate-900/95 flex items-center justify-between shrink-0 z-10 pb-5 sm:pb-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {language === 'fr' ? "Annuler" : "Cancel"}
            </button>

            <button
              type="button"
              onClick={handleExecuteExport}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : selectedFormat === 'video' ? (
                <Video size={16} />
              ) : selectedFormat === 'parchment' ? (
                <Feather size={16} />
              ) : (
                <Download size={16} />
              )}
              <span>
                {isProcessing
                  ? 'Génération...'
                  : selectedFormat === 'video'
                  ? 'Télécharger la Vidéo'
                  : selectedFormat === 'parchment'
                  ? 'Télécharger le Parchemin'
                  : 'Télécharger l\'Image'}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
