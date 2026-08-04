import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Sparkles, Volume1, Repeat, Image as ImageIcon, Mic, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { useFeatures } from '../contexts/FeatureContext';
import { getEffectiveSacredReciters } from '../utils/reciterManager';
import { VerseSaveExportModal } from './VerseSaveExportModal';

export interface ReciterOption {
  id: string;
  nameFr: string;
  nameEn: string;
  shortName: string;
}

export const SACRED_RECITERS: ReciterOption[] = [
  { id: 'Alafasy_128kbps', nameFr: 'Cheikh Mishary Rashid Alafasy', nameEn: 'Sheikh Mishary Rashid Alafasy', shortName: 'Mishary Alafasy' },
  { id: 'Abdul_Basit_Murattal_192kbps', nameFr: 'Cheikh Abdul Basit Abdul Samad', nameEn: 'Sheikh Abdul Basit Abdul Samad', shortName: 'Abdul Basit' },
  { id: 'Minshawy_Murattal_128kbps', nameFr: 'Cheikh Mohamed Siddiq Al-Minshawi', nameEn: 'Sheikh Mohamed Siddiq Al-Minshawi', shortName: 'Siddiq Al-Minshawi' },
  { id: 'Ghamadi_40kbps', nameFr: 'Cheikh Saad Al-Ghamdi', nameEn: 'Sheikh Saad Al-Ghamdi', shortName: 'Saad Al-Ghamdi' },
  { id: 'Abdurrahmaan_As-Sudais_192kbps', nameFr: 'Cheikh Abdul Rahman Al-Sudais', nameEn: 'Sheikh Abdul Rahman Al-Sudais', shortName: 'Al-Sudais' },
  { id: 'Husary_128kbps', nameFr: 'Cheikh Mahmoud Khalil Al-Husary', nameEn: 'Sheikh Mahmoud Khalil Al-Husary', shortName: 'Al-Husary' },
  { id: 'Abu_Bakr_Ash-Shaatree_128kbps', nameFr: 'Cheikh Abu Bakr Al-Shatri', nameEn: 'Sheikh Abu Bakr Al-Shatri', shortName: 'Al-Shatri' }
];

interface ContemplativeAudioPlayerProps {
  verseTitle: string;
  arabicText: string;
  phoneticText: string;
  translationText: string;
  language: string;
  verseNumber?: string;
  onOpenVisualGenerator?: () => void;
}

export const ContemplativeAudioPlayer: React.FC<ContemplativeAudioPlayerProps> = ({
  verseTitle,
  arabicText,
  phoneticText,
  translationText,
  language,
  verseNumber,
  onOpenVisualGenerator
}) => {
  const { featureToggles } = useFeatures();
  const sacredRecitersList = getEffectiveSacredReciters(featureToggles);
  const defaultSacredReciterId = featureToggles?.sacred_default_reciter_id || sacredRecitersList[0]?.id || 'Alafasy_128kbps';

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSaveExportModal, setShowSaveExportModal] = useState<boolean>(false);
  const [toneMode, setToneMode] = useState<'contemplative' | 'deep_mystic' | 'peaceful_drone'>('contemplative');
  const [repeatMode, setRepeatMode] = useState<'1x' | '3x' | '7x' | '11x' | '33x' | '111x' | 'infinite'>('1x');
  const [selectedReciter, setSelectedReciter] = useState<string>(defaultSacredReciterId);

  useEffect(() => {
    if (defaultSacredReciterId && !sacredRecitersList.some(r => r.id === selectedReciter)) {
      const activeId = sacredRecitersList.some(r => r.id === defaultSacredReciterId)
        ? defaultSacredReciterId
        : sacredRecitersList[0]?.id || 'Alafasy_128kbps';
      setSelectedReciter(activeId);
      reciterRef.current = activeId;
    }
  }, [defaultSacredReciterId, sacredRecitersList]);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(30);
  const [activeVerseIndex, setActiveVerseIndex] = useState<number>(0);
  const [recitationStatus, setRecitationStatus] = useState<string>('');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const oscDroneRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentVerseIndexRef = useRef<number>(0);
  const verseUrlsRef = useRef<string[]>([]);
  const speechIntervalRef = useRef<any>(null);
  const repeatsLeftRef = useRef<number>(1);
  const totalLoopsRef = useRef<number>(1);
  const repeatModeRef = useRef<'1x' | '3x' | '7x' | '11x' | '33x' | '111x' | 'infinite'>('1x');
  const reciterRef = useRef<string>('Alafasy_128kbps');

  // Parse Arabic text into Verses (by *, ۝, ۞, newline, |, etc.)
  const arabicVerses = arabicText
    ? arabicText.split(/[*۝۞\n\r|•]+/).map(v => v.trim()).filter(Boolean)
    : [];

  const phoneticVerses = phoneticText
    ? phoneticText.split(/[*;\n\r|•]+/).map(v => v.trim()).filter(Boolean)
    : [];

  const translationVerses = translationText
    ? translationText.split(/[*;\n\r|•]+/).map(v => v.trim()).filter(Boolean)
    : [];

  const arabicWords = arabicText ? arabicText.trim().split(/\s+/) : [];

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    reciterRef.current = selectedReciter;
  }, [selectedReciter]);

  // Parse Surah & Verse numbers from verseTitle or text
  const getVerseUrls = (): string[] => {
    const urls: string[] = [];
    const match = verseTitle.match(/(\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?/);
    if (match) {
      const surahNum = parseInt(match[1], 10);
      const startVerse = parseInt(match[2], 10);
      const endVerse = match[3] ? parseInt(match[3], 10) : startVerse;

      if (surahNum >= 1 && surahNum <= 114) {
        const surahPadded = String(surahNum).padStart(3, '0');
        for (let v = startVerse; v <= endVerse; v++) {
          const versePadded = String(v).padStart(3, '0');
          urls.push(`https://everyayah.com/data/${reciterRef.current}/${surahPadded}${versePadded}.mp3`);
        }
      }
    }
    return urls;
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const speakArabicSpeechSynthesis = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85; // Slow, meditative recitation speed
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      const estimatedDuration = Math.max(10, Math.ceil(textToSpeak.length / 5));
      setAudioDuration(estimatedDuration);
      setAudioProgress(0);

      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      speechIntervalRef.current = setInterval(() => {
        setAudioProgress(prev => {
          const nextVal = prev + 1;
          const ratio = nextVal / Math.max(1, estimatedDuration);
          if (arabicVerses.length > 1) {
            const verseIdx = Math.min(arabicVerses.length - 1, Math.floor(ratio * arabicVerses.length));
            setActiveVerseIndex(verseIdx);
          }
          if (nextVal >= estimatedDuration) {
            clearInterval(speechIntervalRef.current);
            return estimatedDuration;
          }
          return nextVal;
        });
      }, 1000);

      utterance.onend = () => {
        if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
        handleVersePlaybackFinished();
      };

      utterance.onerror = () => {
        if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
        handleVersePlaybackFinished();
      };

      window.speechSynthesis.speak(utterance);
      setRecitationStatus(language === 'fr' ? "Récitation vocale (Synthèse Arabe)..." : "Vocal recitation in Arabic...");
    } else {
      setRecitationStatus(language === 'fr' ? "Lecture du verset" : "Playing verse");
    }
  };

  const handleVersePlaybackFinished = () => {
    if (repeatModeRef.current === 'infinite') {
      currentVerseIndexRef.current = 0;
      if (verseUrlsRef.current.length > 0) {
        playVerseAudioIndex(0);
      } else {
        speakArabicSpeechSynthesis(arabicText);
      }
    } else if (repeatsLeftRef.current > 1) {
      repeatsLeftRef.current -= 1;
      currentVerseIndexRef.current = 0;
      if (verseUrlsRef.current.length > 0) {
        playVerseAudioIndex(0);
      } else {
        speakArabicSpeechSynthesis(arabicText);
      }
    } else {
      stopAudio();
    }
  };

  const playVerseAudioIndex = async (index: number) => {
    const urls = verseUrlsRef.current;
    if (index >= urls.length) {
      handleVersePlaybackFinished();
      return;
    }

    setActiveVerseIndex(index);

    const currentReciterObj = sacredRecitersList.find(r => r.id === reciterRef.current) || sacredRecitersList[0];
    const reciterName = currentReciterObj ? currentReciterObj.shortName : 'Récitateur';

    const loopCountCurrent = totalLoopsRef.current - repeatsLeftRef.current + 1;
    const currentLoopText = repeatModeRef.current === 'infinite' 
      ? ' • Boucle ∞ (Zikr)' 
      : repeatModeRef.current !== '1x' 
      ? ` • Répétition ${loopCountCurrent}/${totalLoopsRef.current}x (Zikr)` 
      : '';

    setRecitationStatus(language === 'fr' 
      ? `${reciterName} • Verset ${index + 1}/${urls.length}${currentLoopText}` 
      : language === 'ha'
      ? `${reciterName} • Aya ${index + 1}/${urls.length}${currentLoopText}`
      : `${reciterName} • Verse ${index + 1}/${urls.length}${currentLoopText}`);

    const rawUrl = urls[index];
    let playSrc = rawUrl;
    let isCachedBlob = false;

    try {
      const cache = await caches.open('quran-audio-cache');
      const matched = await cache.match(rawUrl);
      if (matched) {
        const blob = await matched.blob();
        playSrc = URL.createObjectURL(blob);
        isCachedBlob = true;
      }
    } catch (_) {}

    if (!navigator.onLine && !isCachedBlob) {
      if ('speechSynthesis' in window && arabicText) {
        speakArabicSpeechSynthesis(arabicText);
        return;
      }
    }

    const audio = new Audio(playSrc);
    htmlAudioRef.current = audio;
    audio.muted = isMuted;

    audio.onloadedmetadata = () => {
      setAudioDuration(Math.ceil(audio.duration));
    };

    audio.ontimeupdate = () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration || 1;
      setAudioProgress(Math.floor(currentTime));

      if (urls.length > 1) {
        setActiveVerseIndex(index);
      } else if (arabicVerses.length > 1) {
        const ratio = currentTime / duration;
        const verseIdx = Math.min(arabicVerses.length - 1, Math.floor(ratio * arabicVerses.length));
        setActiveVerseIndex(verseIdx);
      }
    };

    audio.onended = () => {
      if (isCachedBlob) {
        URL.revokeObjectURL(playSrc);
      }
      currentVerseIndexRef.current = index + 1;
      if (index + 1 < urls.length) {
        playVerseAudioIndex(index + 1);
      } else {
        handleVersePlaybackFinished();
      }
    };

    audio.onerror = () => {
      if (isCachedBlob) {
        URL.revokeObjectURL(playSrc);
      }
      console.warn("Quran audio MP3 failed to load, falling back to vocal synthesis");
      speakArabicSpeechSynthesis(arabicText);
    };

    audio.play().catch((e) => {
      console.warn("Audio play error, falling back to speech synthesis:", e);
      speakArabicSpeechSynthesis(arabicText);
    });
  };

  const parseLoopCount = (mode: string): number => {
    switch (mode) {
      case '3x': return 3;
      case '7x': return 7;
      case '11x': return 11;
      case '33x': return 33;
      case '111x': return 111;
      case '1x':
      default: return 1;
    }
  };

  const startAudio = (startIndex: number = 0) => {
    try {
      stopAudio();

      // 1. Start Ambient Background Frequencies
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const baseFreq = toneMode === 'contemplative' ? 136.1 : toneMode === 'deep_mystic' ? 108 : 432;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      const oscDrone = ctx.createOscillator();
      oscDrone.type = 'triangle';
      oscDrone.frequency.setValueAtTime(baseFreq / 2, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(15, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(isMuted ? 0 : 0.12, ctx.currentTime + 1.5);

      osc.connect(gainNode);
      oscDrone.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      oscDrone.start();
      lfo.start();

      oscRef.current = osc;
      oscDroneRef.current = oscDrone;
      gainNodeRef.current = gainNode;

      setIsPlaying(true);

      // Initialize loop counters
      const totalCount = parseLoopCount(repeatModeRef.current);
      totalLoopsRef.current = totalCount;
      repeatsLeftRef.current = totalCount;

      // 2. Play Verse Recitation
      const urls = getVerseUrls();
      verseUrlsRef.current = urls;
      currentVerseIndexRef.current = startIndex;

      if (urls.length > 0 && startIndex < urls.length) {
        playVerseAudioIndex(startIndex);
      } else if (arabicVerses.length > 0 && startIndex < arabicVerses.length) {
        speakArabicSpeechSynthesis(arabicVerses[startIndex]);
      } else {
        speakArabicSpeechSynthesis(arabicText);
      }

    } catch (err) {
      console.error("Failed to start audio:", err);
      const targetText = arabicVerses[startIndex] || arabicText;
      speakArabicSpeechSynthesis(targetText);
    }
  };

  const stopAudio = () => {
    if (speechIntervalRef.current) {
      clearInterval(speechIntervalRef.current);
      speechIntervalRef.current = null;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
      htmlAudioRef.current = null;
    }

    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current = null;
      }
      if (oscDroneRef.current) {
        oscDroneRef.current.stop();
        oscDroneRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {
      // ignore
    }

    setIsPlaying(false);
    setAudioProgress(0);
    setRecitationStatus('');
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    if (htmlAudioRef.current) {
      htmlAudioRef.current.muted = newMuted;
    }

    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newMuted ? 0 : 0.12, audioCtxRef.current.currentTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-gradient-to-r from-emerald-950/80 via-teal-950/90 to-slate-950/90 border border-emerald-500/30 rounded-2xl p-3.5 sm:p-5 text-white shadow-xl backdrop-blur-md relative overflow-hidden space-y-4">
      {/* Background ambient pulse */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all transform active:scale-95 shadow-xl cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
            }`}
            title={isPlaying ? "Pause" : "Écouter la récitation du verset"}
          >
            {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-0.5" />}
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <Radio size={12} className={`text-emerald-400 ${isPlaying ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                {language === 'fr' ? "RÉCITATION VOCALE SACRÉE" : language === 'ha' ? "KARATUN AYA A BAKI" : "SACRED VOCAL RECITATION"}
              </span>
            </div>
            <h5 className="text-xs sm:text-sm font-bold text-amber-200 mt-0.5">
              {verseTitle}
            </h5>
            {recitationStatus && (
              <p className="text-[10px] sm:text-xs text-emerald-300 font-mono animate-pulse mt-0.5 font-semibold">
                {recitationStatus}
              </p>
            )}
          </div>
        </div>

        {/* Tone & Repeat mode selectors & mute button */}
        <div className="flex items-center gap-2 max-w-full overflow-x-auto hide-scrollbar py-1 shrink-0 self-stretch sm:self-auto touch-pan-x">
          {/* Reciter Selector */}
          <div className="flex items-center gap-1 bg-black/50 p-1.5 rounded-xl border border-emerald-500/30 text-[10px] shrink-0">
            <Mic size={12} className="text-amber-400 ml-0.5 shrink-0" />
            <select
              value={selectedReciter}
              onChange={(e) => {
                const newReciter = e.target.value;
                setSelectedReciter(newReciter);
                reciterRef.current = newReciter;
                if (isPlaying) startAudio();
              }}
              className="bg-transparent text-amber-200 font-bold focus:outline-none cursor-pointer pr-1 shrink-0"
            >
              {sacredRecitersList.map(r => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-gray-200">
                  {language === 'fr' ? r.nameFr : r.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Repeat Loop Mode Selector (Taqrar Zikr) - Horizontally Scrollable */}
          <div className="flex bg-black/50 p-1 rounded-xl border border-emerald-500/30 text-[9px] font-bold items-center gap-1 overflow-x-auto hide-scrollbar shrink-0 max-w-[220px] sm:max-w-none touch-pan-x">
            <Repeat size={11} className="text-amber-400 mx-1 shrink-0" />
            {(['1x', '3x', '7x', '11x', '33x', '111x', 'infinite'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => { setRepeatMode(mode); }}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  repeatMode === mode ? 'bg-amber-500 text-black font-black shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
                title={`Répéter ${mode === 'infinite' ? 'en boucle continue' : mode} (Zikr Taqrar)`}
              >
                {mode === 'infinite' ? '∞' : mode}
              </button>
            ))}
          </div>

          {/* Tone Mode */}
          <div className="flex bg-black/50 p-1 rounded-xl border border-emerald-500/30 text-[9px] font-bold shrink-0">
            <button
              onClick={() => { setToneMode('contemplative'); if (isPlaying) startAudio(); }}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                toneMode === 'contemplative' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {language === 'fr' ? "Serein" : "Serene"}
            </button>
            <button
              onClick={() => { setToneMode('deep_mystic'); if (isPlaying) startAudio(); }}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                toneMode === 'deep_mystic' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {language === 'fr' ? "Mystique" : "Mystic"}
            </button>
            <button
              onClick={() => { setToneMode('peaceful_drone'); if (isPlaying) startAudio(); }}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                toneMode === 'peaceful_drone' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              432Hz
            </button>
          </div>

          <button
            onClick={() => setShowSaveExportModal(true)}
            className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer transition-colors flex items-center gap-1 text-[10px] font-bold shadow-md shrink-0 whitespace-nowrap"
            title={language === 'fr' ? "Sauvegarder en Image ou Vidéo (avec Audio)" : "Save as Image or Video"}
          >
            <Bookmark size={13} className="text-amber-400 fill-amber-400/20" />
            <span>{language === 'fr' ? "Sauvegarder" : "Save"}</span>
          </button>

          {onOpenVisualGenerator && (
            <button
              onClick={onOpenVisualGenerator}
              className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer transition-colors flex items-center gap-1 text-[10px] font-bold shadow-md shrink-0 whitespace-nowrap"
              title="Générer Visuel / Image de ce verset"
            >
              <ImageIcon size={13} />
              <span>Visuel</span>
            </button>
          )}

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-gray-300 border border-emerald-500/30 cursor-pointer transition-colors shrink-0"
          >
            {isMuted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} className="text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* VERSET PAR VERSET DISPLAY CONTAINER */}
      <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-3 sm:p-4 relative">
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
          {arabicVerses.map((verseText, idx) => {
            const isCurrentVerse = isPlaying && idx === activeVerseIndex;
            return (
              <motion.div
                key={idx}
                animate={isCurrentVerse ? { scale: [1, 1.01, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  setActiveVerseIndex(idx);
                  startAudio(idx);
                }}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-300 cursor-pointer text-right relative ${
                  isCurrentVerse
                    ? 'bg-gradient-to-r from-amber-500/20 via-amber-950/50 to-amber-500/20 border-amber-400/90 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/50'
                    : 'bg-black/30 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-black/50'
                }`}
                dir="rtl"
                style={{ direction: 'rtl' }}
              >
                <div className="flex items-center justify-between mb-1.5" dir="ltr">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono flex items-center gap-1 ${
                    isCurrentVerse
                      ? 'bg-amber-400 text-black font-black animate-pulse'
                      : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                  }`}>
                    {isCurrentVerse && <Sparkles size={10} />}
                    {language === 'fr' ? 'Verset' : language === 'ha' ? 'Aya' : 'Verse'} {idx + 1}
                  </span>
                  {isCurrentVerse && (
                    <span className="text-[10px] text-amber-300 font-medium animate-pulse">
                      {language === 'fr' ? 'Récitation en cours...' : language === 'ha' ? 'Ana karatun aya...' : 'Reciting now...'}
                    </span>
                  )}
                </div>

                <p
                  className={`font-quran text-2xl sm:text-3xl leading-[2.2] ${
                    isCurrentVerse ? 'text-amber-100 font-extrabold drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]' : 'text-amber-100/80'
                  }`}
                  style={{ fontFamily: '"Amiri Quran", "Uthmani", "Scheherazade New", "Amiri", serif', direction: 'rtl' }}
                >
                  {verseText}
                </p>

                {translationVerses[idx] && (
                  <p className={`text-xs mt-2 text-left font-sans italic border-t border-emerald-500/10 pt-1.5 ${
                    isCurrentVerse ? 'text-amber-200/90 font-medium' : 'text-gray-400'
                  }`} dir="ltr">
                    « {translationVerses[idx]} »
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Audio Wave Visualizer & Progress Bar */}
      <div className="pt-1 border-t border-emerald-500/15">
        <div className="flex justify-between text-[9px] text-gray-400 mb-1 font-mono">
          <span>{formatTime(audioProgress)}</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Sparkles size={8} /> {language === 'fr' ? "Récitation Sacrée & Ambiance Spirituelle" : "Sacred Recitation & Spiritual Ambience"}
          </span>
          <span>{formatTime(audioDuration)}</span>
        </div>

        <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden border border-emerald-500/20 relative">
          <motion.div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full"
            style={{ width: `${Math.min(100, (audioProgress / Math.max(1, audioDuration)) * 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Animated frequency bar visualizer when playing */}
        {isPlaying && (
          <div className="flex items-end justify-center gap-1 h-4 mt-2">
            {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 60, 35].map((height, idx) => (
              <motion.div
                key={idx}
                animate={{ height: ['20%', `${height}%`, '20%'] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6 + (idx % 4) * 0.2,
                  ease: "easeInOut"
                }}
                className="w-1 bg-gradient-to-t from-emerald-500 to-amber-300 rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      {/* Verse Save / Export Modal */}
      <VerseSaveExportModal
        isOpen={showSaveExportModal}
        onClose={() => setShowSaveExportModal(false)}
        verseTitle={verseTitle}
        arabicText={arabicText}
        phoneticText={phoneticText}
        translationText={translationText}
        verseNumber={verseNumber || verseTitle}
        language={language}
      />
    </div>
  );
};

