import React, { useState, useEffect, useRef } from 'react';
import { Hexagon, ArrowLeft, Send, Download, Share2, HelpCircle, X, Sparkles, BookOpen, Check, Copy, Volume2, VolumeX, Compass, Music, Disc, Feather } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { motion, AnimatePresence } from 'motion/react';
import { toCanvas } from 'html-to-image';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { calculateAbjadValue } from '../../../utils/abjad';
import { useFeatures } from '../../../contexts/FeatureContext';

interface ZairjaOracleResult {
  arabicVerse: string;
  translation: string;
  interpretation: string;
  recommendedDhikr: string;
  numericString: string;
  maqam?: string;
  burujDegrees?: Array<{ degree: number; sign: string; signAr: string; element: string; letter: string }>;
}

const zairjaI18n = {
  fr: {
    title: "Miroir de the Za'irja & Oracle de Jafar",
    desc: "Matrice mystique combinant l'algorithme d'Abjad, la décomposition en 12 degrés zodiacaux et la synthèse sonore Maqâm.",
    promptPlaceholder: "Ex: Quel est le sens spirituel de mon épreuve actuelle ?",
    decomposing: "Décomposition en 12 Degrés & Table du Taksir...",
    numericChord: "Corde Numérique Extraite",
    poemTitle: "Poème Répondeur de la Za'irja (Qasida)",
    exegeticalTitle: "Exégèse Spirituelle (Sharh) :",
    dhikrTitle: "Dhikr Conseillé :",
    degreesTitle: "Décomposition en 12 Degrés Zodiacaux (Dā'irat al-Burūj)",
    degreesDesc: "Analyse matricielle associant les lettres de la question aux 12 demeures célestes :",
    maqamTitle: "Synthétiseur Acoustique des Fréquences Maqâm Spirituel",
    maqamDesc: "Récitation harmonique accordée au Maqâm spirituel correspondant à la vibration de votre oracle :",
    playMaqam: "Écouter la Fréquence Maqâm",
    stopMaqam: "Arrêter l'Audio Maqâm",
    saveImage: "Enregistrer l'Image",
    copyBtn: "Copier le Poème & Conseil",
    copied: "Copié !"
  },
  en: {
    title: "Mirror of Za'irja & Oracle of Jafar",
    desc: "Mystic matrix combining Abjad algorithm, 12 zodiac degrees decomposition, and Maqâm acoustic synthesis.",
    promptPlaceholder: "Ex: What is the spiritual meaning of my current trial?",
    decomposing: "12-Degree Breakdown & Taksir Matrix...",
    numericChord: "Extracted Numeric Chord",
    poemTitle: "Answering Poem of Za'irja (Qasida)",
    exegeticalTitle: "Spiritual Exegesis (Sharh):",
    dhikrTitle: "Recommended Dhikr:",
    degreesTitle: "12 Zodiac Degrees Breakdown (Dā'irat al-Burūj)",
    degreesDesc: "Matrix analysis linking question letters to the 12 celestial houses:",
    maqamTitle: "Spiritual Maqâm Acoustical Synthesizer",
    maqamDesc: "Harmonic tone tuned to the spiritual Maqâm corresponding to your oracle's vibration:",
    playMaqam: "Play Maqâm Frequency",
    stopMaqam: "Stop Maqâm Audio",
    saveImage: "Save Image",
    copyBtn: "Copy Poem & Guidance",
    copied: "Copied!"
  },
  ha: {
    title: "Madubin Za'irja & Annabcin Jafar",
    desc: "Taswirar asiri da ke haɗa algorithm na Abjad, rabuwa zuwa matakai 12 na buruj da sauti Maqâm.",
    promptPlaceholder: "Misali: Menene ma'anar ruhaniyar gwajina na yanzu?",
    decomposing: "Rabuwa Zuwa Matakai 12 Da Taksir...",
    numericChord: "Tsarin Lambobi Na Za'irja",
    poemTitle: "Waƙar Amsa Ta Za'irja (Qasida)",
    exegeticalTitle: "Tafsiri Ruhani (Sharh):",
    dhikrTitle: "Zikiri Da Ake Bada Shawara:",
    degreesTitle: "Rarrabawa Zuwa Buruj 12 (Dā'irat al-Burūj)",
    degreesDesc: "Binciken haruffan tambaya tare da gajejin sama 12:",
    maqamTitle: "Sauti Maqâm Na Ruhani",
    maqamDesc: "Sautin amsawa na musamman da aka daidaita da Maqâm na amsar ku:",
    playMaqam: "Saurari Sautin Maqâm",
    stopMaqam: "Tsai da Sauti",
    saveImage: "Ajiye Hoto",
    copyBtn: "Kwafi Waƙar & Shawara",
    copied: "An Kwafa!"
  }
};

const BURUJ_DATA = [
  { sign: "Bélier", signAr: "الحمل", element: "Feu", elementAr: "نار" },
  { sign: "Taureau", signAr: "الثور", element: "Terre", elementAr: "تراب" },
  { sign: "Gémeaux", signAr: "الجوزاء", element: "Air", elementAr: "هواء" },
  { sign: "Cancer", signAr: "السرطان", element: "Eau", elementAr: "ماء" },
  { sign: "Lion", signAr: "الأسد", element: "Feu", elementAr: "نار" },
  { sign: "Vierge", signAr: "العذراء", element: "Terre", elementAr: "تراب" },
  { sign: "Balance", signAr: "الميزان", element: "Air", elementAr: "هواء" },
  { sign: "Scorpion", signAr: "العقرب", element: "Eau", elementAr: "ماء" },
  { sign: "Sagittaire", signAr: "القوس", element: "Feu", elementAr: "نار" },
  { sign: "Capricorne", signAr: "الجدي", element: "Terre", elementAr: "تراب" },
  { sign: "Verseau", signAr: "الدلو", element: "Air", elementAr: "هواء" },
  { sign: "Poissons", signAr: "الحوت", element: "Eau", elementAr: "ماء" }
];

export const Zairja: React.FC = () => {
  const { language } = useLanguage();
  const { isPremium } = useAuth();
  const { featureToggles } = useFeatures();
  const disableDuaCopy = !!featureToggles?.disable_dua_copy;
  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const txt = zairjaI18n[langKey] || zairjaI18n.fr;

  const [question, setQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [answer, setAnswer] = useState<ZairjaOracleResult | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Maqam Audio Synth
  const [isPlayingMaqam, setIsPlayingMaqam] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Scramble animation
  const [scrambleText, setScrambleText] = useState('');

  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      const chars = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
      interval = setInterval(() => {
        let fake = '';
        for (let i = 0; i < 18; i++) fake += chars[Math.floor(Math.random() * chars.length)] + ' ';
        setScrambleText(fake);
      }, 50);
    } else {
      setScrambleText('');
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const playMaqamFrequency = () => {
    if (isPlayingMaqam) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      setIsPlayingMaqam(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Frequencies for spiritual Maqam harmonic drone (Root, Fifth, Octave, Microtone)
      const baseFreq = answer?.maqam === 'Bayati' ? 220 : answer?.maqam === 'Hijaz' ? 246.94 : 261.63; // C4 or A3 or B3
      const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 1.25];

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        // Gentle ambient volume
        gain.gain.setValueAtTime(0.08 / (idx + 1), ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
      });

      setIsPlayingMaqam(true);
    } catch (err) {
      console.error('Audio synthesis failed:', err);
    }
  };

  const downloadImage = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await toCanvas(resultRef.current, { backgroundColor: '#18181b', skipFonts: true });
      await downloadCanvasImage(canvas, 'zairja-oracle-result.png');
    } catch (e) {
      console.error(e);
    }
  };

  const downloadParchmentImage = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await toCanvas(resultRef.current, { 
        backgroundColor: '#fef3c7', 
        skipFonts: true,
        style: {
          backgroundColor: '#fef3c7',
          color: '#451a03',
          border: '4px solid #b45309',
          borderRadius: '16px',
        }
      });
      await downloadCanvasImage(canvas, 'zairja-oracle-parchemin.png');
    } catch (e) {
      console.error(e);
    }
  };

  const processZairja = async () => {
    if (!question || question.length < 5) return;

    setIsProcessing(true);
    setAnswer(null);

    const abjadSum = calculateAbjadValue(question);

    // Generate 12 zodiac degrees breakdown
    const cleanLetters = question.replace(/[^a-zA-Z\u0600-\u06FF]/g, '').slice(0, 12);
    const burujDegrees = BURUJ_DATA.map((b, idx) => ({
      degree: ((abjadSum + idx * 30) % 360) + 1,
      sign: b.sign,
      signAr: b.signAr,
      element: b.element,
      letter: cleanLetters[idx % cleanLetters.length] || 'ا'
    }));

    const maqams = ['Rast', 'Bayati', 'Hijaz', 'Sika', 'Saba'];
    const chosenMaqam = maqams[abjadSum % maqams.length];

    try {
      const response = await fetch('/api/zairja/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, abjadSum, language })
      });

      if (response.ok) {
        const data = await response.json();
        setAnswer({ ...data, burujDegrees, maqam: chosenMaqam });
      } else {
        throw new Error("Offline fallback");
      }
    } catch (error) {
      setTimeout(() => {
        const fallbackVerses = [
          {
            arabicVerse: "فَصْبِرْ صَبْرًا جَمِيلًا إِنَّ مَعَ الْعُسْرِ يُسْرًا\nوَإِنَّ نُورَ الْحَقِّ يُبْدِي مَا كَانَ سِرًّا",
            translation: langKey === 'en' 
              ? "Be patient with gracious patience, for indeed with hardship comes ease, and the light of truth shall unveil what was secret."
              : langKey === 'ha'
              ? "Ka yi haƙuri da kyakkyawan haƙuri, lallai tare da tsanani akwai sauƙi, kuma hasken gaskiya zai bayyana sirri."
              : "Patientez d'une belle patience, car après la difficulté vient la facilité, et la lumière de la vérité dévoilera ce qui était un secret.",
            interpretation: langKey === 'en'
              ? "The Za'irja oracle indicates that your current obstacle is temporary. The key lies in inner calm and constancy."
              : langKey === 'ha'
              ? "Alamomin za'irja sun nuna cewa cikas din da kake fuskanta na dan lokaci ne. Makullin shine natsuwa."
              : "L'oracle de la Za'irja indique que l'obstacle actuel est temporaire. La clé réside dans le calme et la constance.",
            recommendedDhikr: "يا فتاح يا عليم (129)",
            numericString: `${abjadSum} - 129 - 786 - 998 - 316`
          }
        ];

        const selected = fallbackVerses[abjadSum % fallbackVerses.length];
        setAnswer({ ...selected, burujDegrees, maqam: chosenMaqam });
      }, 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyResultText = () => {
    if (disableDuaCopy || !answer) return;
    if (!isPremium) {
      triggerProtectionModal('copy');
      return;
    }
    const text = `ORACLE DE LA ZA'IRJA
Question : "${question}"
Poème Arabe :
${answer.arabicVerse}

Traduction :
« ${answer.translation} »

Exégèse & Conseil Spirituel :
${answer.interpretation}

Dhikr Recommandé : ${answer.recommendedDhikr}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/tools" 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Hexagon className="text-purple-500" />
            {txt.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
            {txt.desc}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative z-20 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2 pl-2">
              Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={txt.promptPlaceholder}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white focus:outline-none font-medium transition-colors"
              disabled={isProcessing}
            />
          </div>
          <button
            onClick={processZairja}
            disabled={isProcessing || question.length < 5}
            className="w-full sm:w-16 h-14 shrink-0 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold disabled:opacity-50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            {isProcessing ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                <Hexagon size={22} />
              </motion.div>
            ) : (
              <Send size={22} />
            )}
          </button>
        </div>
      </div>

      <ToolInfoTooltip toolId="zairja" />

      <AnimatePresence mode="wait">
        {isProcessing && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 text-center bg-black rounded-3xl p-8 border border-zinc-800 shadow-2xl overflow-hidden relative"
          >
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-purple-700 dark:text-purple-400 mb-6">
              {txt.decomposing}
            </p>
            <div className="font-arabic text-3xl md:text-5xl text-purple-700 dark:text-purple-400/80 tracking-widest break-all leading-relaxed font-bold" dir="rtl">
              {scrambleText}
            </div>
          </motion.div>
        )}

        {answer && !isProcessing && (
          <motion.div 
            key="answer"
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 relative flex flex-col items-center gap-6"
          >
            <div ref={resultRef} className="bg-zinc-900 rounded-3xl p-6 sm:p-10 border-2 border-purple-900/60 text-center shadow-2xl w-full text-white space-y-6 relative overflow-hidden">
              <div className="flex justify-center mb-2 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-800 dark:text-purple-300 text-xs font-black tracking-widest uppercase shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
                  <span>AsrarHub</span>
                  <span className="text-[10px] text-purple-700 dark:text-purple-400 font-semibold">• Oracle & Za'irja</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-purple-700 dark:text-purple-400 font-bold block mb-2">
                  {txt.numericChord}
                </span>
                <p className="font-mono text-sm sm:text-base tracking-[0.3em] text-zinc-400">
                  {answer.numericString}
                </p>
              </div>

              <div className="h-px bg-zinc-800 w-1/2 mx-auto"></div>

              {/* Arabic Poem */}
              <div className="bg-purple-950/40 p-6 rounded-2xl border border-purple-800/40 space-y-3">
                <span className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-widest block">
                  {txt.poemTitle}
                </span>
                <p className="text-2xl sm:text-4xl font-quran text-amber-800 dark:text-amber-200 leading-relaxed font-bold whitespace-pre-line" dir="rtl">
                  {answer.arabicVerse}
                </p>
              </div>

              {/* Translation */}
              <p className="text-lg sm:text-xl font-serif text-zinc-200 italic leading-relaxed border-l-2 border-purple-500 pl-4 text-left">
                « {answer.translation} »
              </p>

              {/* Interpretation & Dhikr */}
              <div className="text-left bg-zinc-800/60 p-4 rounded-2xl text-xs sm:text-sm text-zinc-300 space-y-2">
                <strong className="text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                  <BookOpen size={16} /> {txt.exegeticalTitle}
                </strong>
                <p className="leading-relaxed">{answer.interpretation}</p>
                <div className="pt-2 border-t border-zinc-700/60 text-amber-800 dark:text-amber-300 font-bold">
                  {txt.dhikrTitle} {answer.recommendedDhikr}
                </div>
              </div>

              {/* 12 Degrees Zodiac Matrix Breakdown */}
              {answer.burujDegrees && (
                <div className="text-left bg-zinc-950/80 border border-purple-900/40 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-widest flex items-center gap-2">
                    <Compass className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                    {txt.degreesTitle}
                  </h4>
                  <p className="text-[11px] text-zinc-400">{txt.degreesDesc}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {answer.burujDegrees.map((d, i) => (
                      <div key={i} className="bg-zinc-900/90 border border-purple-900/30 p-2.5 rounded-xl text-center">
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block">{d.degree}° - {d.sign}</span>
                        <span className="font-arabic text-sm text-purple-900 dark:text-purple-200 font-bold block" dir="rtl">{d.signAr} ({d.element})</span>
                        <span className="text-xs font-mono text-zinc-400 mt-1 block">Lettre: <strong className="text-white">{d.letter}</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Maqam Acoustic Synthesizer Section */}
              <div className="bg-purple-950/30 border border-purple-500/30 p-4 rounded-2xl text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-widest flex items-center gap-2">
                    <Music className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    {txt.maqamTitle} ({answer.maqam || 'Rast'})
                  </h4>
                  <p className="text-[11px] text-zinc-300">{txt.maqamDesc}</p>
                </div>
                <button
                  onClick={playMaqamFrequency}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                    isPlayingMaqam 
                      ? 'bg-rose-600 text-white animate-pulse' 
                      : 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                  }`}
                >
                  {isPlayingMaqam ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isPlayingMaqam ? txt.stopMaqam : txt.playMaqam}</span>
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button onClick={downloadImage} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zinc-800 text-white hover:bg-zinc-700 text-xs font-semibold transition-colors shadow-lg cursor-pointer">
                <Download size={16} className="text-emerald-400" />
                <span>Télécharger PNG</span>
              </button>
              <button onClick={downloadParchmentImage} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold transition-colors shadow-lg cursor-pointer">
                <Feather size={16} />
                <span>Télécharger Parchemin</span>
              </button>
              {!disableDuaCopy && (
                <button onClick={copyResultText} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 text-white hover:bg-purple-500 text-xs font-semibold transition-colors shadow-lg cursor-pointer">
                  {copied ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />}
                  {copied ? txt.copied : txt.copyBtn}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

