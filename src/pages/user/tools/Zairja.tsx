import React, { useState, useEffect, useRef } from 'react';
import { Hexagon, ArrowLeft, Send, Download, Share2, HelpCircle, X, Sparkles, BookOpen, Check, Copy } from 'lucide-react';
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
}

export const Zairja: React.FC = () => {
  const { t, language } = useLanguage();
  const { isPremium } = useAuth();
  const { featureToggles } = useFeatures();
  const disableDuaCopy = !!featureToggles?.disable_dua_copy;

  const [question, setQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [answer, setAnswer] = useState<ZairjaOracleResult | null>(null);
  const [showZairjaInfo, setShowZairjaInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

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

  const downloadImage = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await toCanvas(resultRef.current, { backgroundColor: '#18181b', skipFonts: true });
      await downloadCanvasImage(canvas, 'zairja-oracle-result.png');
    } catch (e) {
      console.error(e);
    }
  };

  const processZairja = async () => {
    if (!question || question.length < 5) return;

    // Gamification stats
    try {
      let stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}');
      if (!stats || typeof stats !== 'object') stats = {};
      stats.tools_used = (stats.tools_used || 0) + 1;
      localStorage.setItem('asrar_stats', JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }

    setIsProcessing(true);
    setAnswer(null);

    const abjadSum = calculateAbjadValue(question);

    try {
      const response = await fetch('/api/zairja/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, abjadSum, language })
      });

      if (response.ok) {
        const data = await response.json();
        setAnswer(data);
      } else {
        throw new Error("Fallback to local Zairja engine");
      }
    } catch (error) {
      console.warn('API error or unavailable, using offline Za\'irja algorithm:', error);
      // High-quality offline fallback
      setTimeout(() => {
        const fallbackVerses = [
          {
            arabicVerse: "فَصْبِرْ صَبْرًا جَمِيلًا إِنَّ مَعَ الْعُسْرِ يُسْرًا\nوَإِنَّ نُورَ الْحَقِّ يُبْدِي مَا كَانَ سِرًّا",
            translation: "Patientez d'une belle patience, car après la difficulté vient la facilité, et la lumière de la vérité dévoilera ce qui était un secret.",
            interpretation: "L'oracle de la Za'irja indique que l'obstacle actuel est temporaire. La clé réside dans le calme et la constance, car les portes de la sérénité s'ouvriront au moment fixé.",
            recommendedDhikr: "يا فتاح يا عليم (129 fois)",
            numericString: `${abjadSum} - 129 - 786 - 998 - 316`
          },
          {
            arabicVerse: "وَافْعَلُوا الْخَيْرَ لَعَلَّكُمْ تُفْلِحُونَ\nوَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ",
            translation: "Poursuivez le bien pour que vous réussissiez, et placez votre confiance en le Vivant qui ne meurt jamais.",
            interpretation: "L'énergie de votre question montre un besoin d'action juste et d'abandon confiant (Tawakkul). Ne doutez pas de la bénédiction attachée à vos efforts honnêtes.",
            recommendedDhikr: "يا وكيل يا حفيظ (66 fois)",
            numericString: `${abjadSum} - 66 - 111 - 456 - 888`
          }
        ];

        const selected = fallbackVerses[abjadSum % fallbackVerses.length];
        setAnswer(selected);
      }, 2500);
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
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none min-h-screen">
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
            Miroir de la Za'irja & Oracle Spirituel
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Matrice mystique combinant l'algorithme d'Abjad et la poésie prophétique.
          </p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-800 relative overflow-hidden text-center mb-8">
        <div className="relative z-10 space-y-2">
          <p className="text-zinc-300 text-sm leading-relaxed max-w-xl mx-auto">
            La <strong>Za'irja (الزايرجة)</strong> est la célèbre machine divinatoire soufie d'Ibn Khaldoun. Posez votre question spirituelle ou personnelle : la matrice brisera sa valeur numérique d'Abjad pour composer un poème répondeur.
          </p>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative z-20">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 pl-2">
              Votre Question Secrète
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Quel est le sens spirituel de mon épreuve actuelle ?"
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

      <div className="mt-6">
        <ToolInfoTooltip toolId="zairja" />
      </div>

      <AnimatePresence mode="wait">
        {isProcessing && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 text-center bg-black rounded-3xl p-8 border border-zinc-800 shadow-2xl overflow-hidden relative"
          >
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-purple-400 mb-6">
              Brisure Abjad & Composition du Poème...
            </p>
            <div className="font-arabic text-3xl md:text-5xl text-purple-400/80 tracking-widest break-all leading-relaxed font-bold" dir="rtl">
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
              {/* AsrarHub Watermarks in 4 corners */}
              <div className="absolute top-2 left-3 text-[10px] font-bold tracking-widest text-purple-400/30 pointer-events-none select-none uppercase">
                AsrarHub
              </div>
              <div className="absolute top-2 right-3 text-[10px] font-bold tracking-widest text-purple-400/30 pointer-events-none select-none uppercase">
                AsrarHub
              </div>
              <div className="absolute bottom-2 left-3 text-[10px] font-bold tracking-widest text-purple-400/30 pointer-events-none select-none uppercase">
                AsrarHub
              </div>
              <div className="absolute bottom-2 right-3 text-[10px] font-bold tracking-widest text-purple-400/30 pointer-events-none select-none uppercase">
                AsrarHub
              </div>

              {/* AsrarHub Brand Header */}
              <div className="flex justify-center mb-2 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-black tracking-widest uppercase shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>AsrarHub</span>
                  <span className="text-[10px] text-purple-400 font-semibold">• Oracle & Za'irja</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold block mb-2">
                  Corde Numérique Extraite
                </span>
                <p className="font-mono text-sm sm:text-base tracking-[0.3em] text-zinc-400">
                  {answer.numericString}
                </p>
              </div>

              <div className="h-px bg-zinc-800 w-1/2 mx-auto"></div>

              {/* Arabic Rhyming Poem */}
              <div className="bg-purple-950/40 p-6 rounded-2xl border border-purple-800/40 space-y-3">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-widest block">
                  Poème Répondeur de la Za'irja (Qasida)
                </span>
                <p className="text-2xl sm:text-4xl font-quran text-amber-200 leading-relaxed font-bold whitespace-pre-line" dir="rtl">
                  {answer.arabicVerse}
                </p>
              </div>

              {/* Translation */}
              <p className="text-lg sm:text-xl font-serif text-zinc-200 italic leading-relaxed border-l-2 border-purple-500 pl-4 text-left">
                « {answer.translation} »
              </p>

              {/* Interpretation */}
              <div className="text-left bg-zinc-800/60 p-4 rounded-2xl text-xs sm:text-sm text-zinc-300 space-y-2">
                <strong className="text-purple-300 flex items-center gap-1.5">
                  <BookOpen size={16} /> Exégèse Spirituelle (Sharh) :
                </strong>
                <p className="leading-relaxed">{answer.interpretation}</p>
                <div className="pt-2 border-t border-zinc-700/60 text-amber-300 font-bold">
                  Dhikr Conseillé : {answer.recommendedDhikr}
                </div>
              </div>

              {/* Footer watermark */}
              <div className="pt-2 border-t border-zinc-800 text-center">
                <p className="text-[10px] font-bold tracking-widest text-purple-400/60 uppercase">
                  AsrarHub • Science des Lettres & Oracle Spirituel
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button onClick={downloadImage} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zinc-800 text-white hover:bg-zinc-700 text-xs font-semibold transition-colors shadow-lg cursor-pointer">
                <Download size={16} />
                Enregistrer l'Image
              </button>
              {!disableDuaCopy && (
                <button onClick={copyResultText} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 text-white hover:bg-purple-500 text-xs font-semibold transition-colors shadow-lg cursor-pointer">
                  {copied ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />}
                  {copied ? "Copié !" : "Copier le Poème & Conseil"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
