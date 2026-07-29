import React, { useState, useEffect } from 'react';
import { Calculator, ArrowLeft, RefreshCw, Copy, Check, ChevronDown, ChevronUp, History, Save, Trash2, X, Database, Wifi, HelpCircle, Flame, Wind, Droplets, Mountain, Heart, Users, Sparkles, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { motion, AnimatePresence } from 'motion/react';

// Simplified Abjad table mapping (Standard/Eastern)
const abjadMashriqi: Record<string, number> = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1,
  'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5,
  'و': 6, 'ؤ': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ى': 10, 'ئ': 10, 'ك': 20, 'ل': 30,
  'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80,
  'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400,
  'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900,
  'غ': 1000
};

// Maghribi variant
const abjadMaghribi: Record<string, number> = {
  ...abjadMashriqi,
  'س': 300, 'ش': 1000, 'ص': 60, 'ض': 90, 'ظ': 800, 'غ': 900
};

// Element mapping for Arabic letters
const LETTER_ELEMENTS: Record<string, 'fire' | 'air' | 'water' | 'earth'> = {
  'ا': 'fire', 'أ': 'fire', 'إ': 'fire', 'آ': 'fire', 'ء': 'fire', 'ه': 'fire', 'ة': 'fire', 'ط': 'fire', 'م': 'fire', 'ف': 'fire', 'ش': 'fire', 'ذ': 'fire',
  'ب': 'air', 'و': 'air', 'ؤ': 'air', 'ي': 'air', 'ى': 'air', 'ئ': 'air', 'ن': 'air', 'ص': 'air', 'ت': 'air', 'ض': 'air',
  'ج': 'water', 'ز': 'water', 'ك': 'water', 'س': 'water', 'ق': 'water', 'ث': 'water', 'ظ': 'water',
  'د': 'earth', 'ح': 'earth', 'ل': 'earth', 'ع': 'earth', 'ر': 'earth', 'خ': 'earth', 'غ': 'earth'
};

const localDict = {
  fr: {
    cacheLocal: "Cache local (Mode Offline actif)",
    syncLocal: "Synchronisé localement (Offline-first)",
    enterArabic: "Entrez le texte en Arabe",
    words: "Mots",
    letters: "Lettres",
    numericValues: "Valeurs Numériques (Abjad)",
    howToInterpret: "Comment interpréter ces résultats ?",
    interpret: "Interpréter"
  },
  en: {
    cacheLocal: "Local cache (Offline Mode active)",
    syncLocal: "Locally synchronized (Offline-first)",
    enterArabic: "Enter text in Arabic",
    words: "Words",
    letters: "Letters",
    numericValues: "Numerical Values (Abjad)",
    howToInterpret: "How to interpret these results?",
    interpret: "Interpret"
  },
  ha: {
    cacheLocal: "Ma'ajiyar gida (Yanayin Offline yana aiki)",
    syncLocal: "An daidaita na gida (Offline-farko)",
    enterArabic: "Shigar da rubutu cikin Harshen Larabci",
    words: "Kalmomi",
    letters: "Haruffa",
    numericValues: "Darajojin Lambobi (Abjad)",
    howToInterpret: "Yadda za a fassara waɗannan sakamakon?",
    interpret: "Fassara"
  }
};

export const AbjadCalculator: React.FC = () => {
  const { t, language } = useLanguage();
  const dict = localDict[(language as 'fr' | 'en' | 'ha') || 'fr'] || localDict.fr;
  const [activeTab, setActiveTab] = useState<'calc' | 'elements' | 'compatibility'>('calc');
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [showLetters, setShowLetters] = useState(false);

  // Compatibility State
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  
  const [history, setHistory] = useState<{ id: string; text: string; mashriqi: number; maghribi: number; timestamp: number }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAbjadInfoModal, setShowAbjadInfoModal] = useState(false);
  const [isUsingCache, setIsUsingCache] = useState(true);

  // Load abjad state and history on mount
  useEffect(() => {
    try {
      const savedText = localStorage.getItem('abjad_draft_text');
      if (savedText) setText(savedText);
      const savedShowWords = localStorage.getItem('abjad_show_words');
      if (savedShowWords) setShowWords(savedShowWords === 'true');
      const savedShowLetters = localStorage.getItem('abjad_show_letters');
      if (savedShowLetters) setShowLetters(savedShowLetters === 'true');
    } catch (e) {
      console.warn("Failed to load Abjad state", e);
    }

    const saved = localStorage.getItem('abjad_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setHistory(parsed);
      } catch (e) {}
    }
    setIsUsingCache(!navigator.onLine);
  }, []);

  // Save text draft to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('abjad_draft_text', text);
    } catch (e) {}
  }, [text]);

  const saveToHistory = () => {
    if (!text.trim() || totalMashriqi === 0) return;
    const newItem = {
      id: Date.now().toString(),
      text: text.trim(),
      mashriqi: totalMashriqi,
      maghribi: totalMaghribi,
      timestamp: Date.now(),
    };
    const newHistory = [newItem, ...history.filter(h => h.text !== newItem.text)].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('abjad_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('abjad_history');
  };

  const calculateAbjad = (input: string) => {
    let totalMashriqi = 0;
    let totalMaghribi = 0;
    
    const details: { char: string; valMashriqi: number; valMaghribi: number }[] = [];
    const wordsDetails: { word: string; valMashriqi: number; valMaghribi: number }[] = [];
    
    const rawWords = input.trim().split(/\s+/).filter(w => w.length > 0);
    const words = rawWords.length;
    let letterCount = 0;
    
    // Elemental distribution counters
    let fire = 0, air = 0, water = 0, earth = 0;

    for (const word of rawWords) {
      let wordMashriqi = 0;
      let wordMaghribi = 0;
      
      for (const char of word) {
        const vMash = abjadMashriqi[char] || 0;
        const vMagh = abjadMaghribi[char] || 0;
        
        wordMashriqi += vMash;
        wordMaghribi += vMagh;
        totalMashriqi += vMash;
        totalMaghribi += vMagh;
        
        if (vMash || vMagh) {
          letterCount++;
          const elem = LETTER_ELEMENTS[char];
          if (elem === 'fire') fire++;
          else if (elem === 'air') air++;
          else if (elem === 'water') water++;
          else if (elem === 'earth') earth++;
        }
        details.push({ char, valMashriqi: vMash, valMaghribi: vMagh });
      }
      wordsDetails.push({ word, valMashriqi: wordMashriqi, valMaghribi: wordMaghribi });
    }

    return { totalMashriqi, totalMaghribi, details, wordsDetails, words, letterCount, elemental: { fire, air, water, earth } };
  };

  const { totalMashriqi, totalMaghribi, details, wordsDetails, words, letterCount, elemental } = calculateAbjad(text);

  const handleCopy = (val: number) => {
    navigator.clipboard.writeText(val.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for 2 names compatibility
  const getCompatibilityAnalysis = () => {
    const res1 = calculateAbjad(name1);
    const res2 = calculateAbjad(name2);

    if (res1.totalMashriqi === 0 || res2.totalMashriqi === 0) return null;

    const sumTotal = res1.totalMashriqi + res2.totalMashriqi;
    const mod9 = sumTotal % 9 === 0 ? 9 : sumTotal % 9;
    const mod4 = sumTotal % 4 === 0 ? 4 : sumTotal % 4;

    let score = 85;
    let archetype = "Entente Harmonieuse & Bénédiction";
    let desc = "Les vibrations des deux noms forment un équilibre spirituel propice à la prospérité et au soutien mutuel.";
    let elementalSynergy = "Synergie Fluide";

    if (mod9 === 1 || mod9 === 5 || mod9 === 9) {
      score = 95;
      archetype = "Lumière & Entente Spirituelle Parfaite (Feu/Lumière)";
      desc = "Affinité exceptionnelle et vision commune. Les projets entrepris ensemble sont bénis et lumineux.";
      elementalSynergy = "Harmonie d'Élévation";
    } else if (mod9 === 2 || mod9 === 6) {
      score = 88;
      archetype = "Alliance Stable & Communication Fluide (Air/Pensée)";
      desc = "Excellente écoute, respect mutuel et entente intellectuelle très solide.";
      elementalSynergy = "Harmonie d'Air";
    } else if (mod9 === 3 || mod9 === 7) {
      score = 90;
      archetype = "Union Émotionnelle Intime & Intuition Profonde (Eau/Cœur)";
      desc = "Grande complicité sentimentale et empathie naturelle. Préservation et loyauté.";
      elementalSynergy = "Harmonie d'Eau";
    } else {
      score = 82;
      archetype = "Partenariat Ancré & Patience (Terre/Constance)";
      desc = "Relation basée sur la patience et le travail. Nécessite de maintenir une communication douce.";
      elementalSynergy = "Stabilité Terrestre";
    }

    return {
      name1Val: res1.totalMashriqi,
      name2Val: res2.totalMashriqi,
      sumTotal,
      mod9,
      mod4,
      score,
      archetype,
      desc,
      elementalSynergy,
      elem1: res1.elemental,
      elem2: res2.elemental
    };
  };

  const compResult = getCompatibilityAnalysis();

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6 lg:p-8 safe-area-pt max-h-[85vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link 
            to="/tools" 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calculator className="text-blue-500" />
              {t("tools.abjad.title", "Calculateur Abjad & Thème Onomastique")}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Valeur Abjad, répartition des 4 éléments du nom &amp; analyse de compatibilité
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-start gap-1 overflow-x-auto pb-2 mb-4 no-scrollbar border-b border-gray-200 dark:border-gray-700 shrink-0">
        <button
          onClick={() => setActiveTab('calc')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'calc'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <Calculator size={16} />
          <span>Calculateur Abjad</span>
        </button>
        <button
          onClick={() => setActiveTab('elements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'elements'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <PieChart size={16} />
          <span>Thème des 4 Éléments</span>
        </button>
        <button
          onClick={() => setActiveTab('compatibility')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'compatibility'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <Heart size={16} />
          <span>Compatibilité (2 Noms)</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-0.5">

      {/* Tab 1: Standard Calculator */}
      {activeTab === 'calc' && (
        <div className="space-y-6">
          {/* Input Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {dict.enterArabic}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("tools.abjad.inputPlaceholder")}
              dir="rtl"
              rows={3}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-xl sm:text-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              style={{ fontFamily: "'Amiri', 'Traditional Arabic', system-ui, sans-serif" }}
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                <span>{dict.words}: <strong className="text-gray-700 dark:text-gray-300">{words}</strong></span>
                <span>{dict.letters}: <strong className="text-gray-700 dark:text-gray-300">{letterCount}</strong></span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveToHistory}
                  disabled={!text.trim() || totalMashriqi === 0}
                  className="px-3 py-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save size={14} />
                  <span className="hidden sm:inline">{t("tools.abjad.save")}</span>
                </button>
                <button
                  onClick={() => setText('')}
                  className="px-3 py-1.5 text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw size={14} />
                  <span className="hidden sm:inline">{t("tools.abjad.clear")}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center px-1">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              {dict.numericValues}
            </h2>
            <button 
              onClick={() => setShowAbjadInfoModal(true)}
              className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle size={15} />
              <span className="text-xs font-semibold">{dict.interpret}</span>
            </button>
          </div>

          {/* Result Card */}
          <motion.div 
            className={`grid grid-cols-2 gap-3 sm:gap-4 transition-all duration-300 ${totalMashriqi > 0 ? 'opacity-100 translate-y-0' : 'opacity-50'}`}
          >
            {/* Mashriqi (Orientale) */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-blue-100 text-xs font-medium uppercase tracking-widest mb-1">{t("tools.abjad.mashriq")}</span>
                <div className="text-3xl sm:text-5xl font-bold tracking-tight mb-2 sm:mb-3 tabular-nums">
                  {totalMashriqi}
                </div>
                {totalMashriqi > 0 && (
                  <button
                    onClick={() => handleCopy(totalMashriqi)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors text-xs font-medium cursor-pointer"
                  >
                    {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                    {copied ? t('tools.abjad.copied') : t('tools.abjad.copy')}
                  </button>
                )}
              </div>
            </div>

            {/* Maghribi (Occidentale) */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-emerald-100 text-xs font-medium uppercase tracking-widest mb-1">{t("tools.abjad.maghribi")}</span>
                <div className="text-3xl sm:text-5xl font-bold tracking-tight mb-2 sm:mb-3 tabular-nums">
                  {totalMaghribi}
                </div>
                {totalMaghribi > 0 && (
                  <button
                    onClick={() => handleCopy(totalMaghribi)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors text-xs font-medium cursor-pointer"
                  >
                    {copied ? <Check size={14} className="text-green-300" /> : <Copy size={14} />}
                    {copied ? t('tools.abjad.copied') : t('tools.abjad.copy')}
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Breakdown */}
          {details.length > 0 && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => setShowWords(!showWords)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t("tools.abjad.adadByWords")}</h3>
                  {showWords ? <ChevronUp className="text-gray-400" size={18} /> : <ChevronDown className="text-gray-400" size={18} />}
                </button>
                <AnimatePresence>
                  {showWords && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="p-4 pt-0 flex flex-wrap gap-2.5 justify-end border-t border-gray-50 dark:border-gray-700/50" dir="rtl">
                        {wordsDetails.map((item, i) => (
                          <div key={i} className="flex flex-col items-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 min-w-[4.5rem] border border-gray-100 dark:border-gray-600 shadow-xs">
                            <span className="text-lg font-bold text-gray-900 dark:text-white mb-1 font-arabic">{item.word}</span>
                            <div className="flex gap-2 text-[10px] w-full justify-center">
                              <span className="text-blue-600 dark:text-blue-400 font-bold">{item.valMashriqi}</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.valMaghribi}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => setShowLetters(!showLetters)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t("tools.abjad.adadByLetters")}</h3>
                  {showLetters ? <ChevronUp className="text-gray-400" size={18} /> : <ChevronDown className="text-gray-400" size={18} />}
                </button>
                <AnimatePresence>
                  {showLetters && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="p-4 pt-0 flex flex-wrap gap-2 justify-end border-t border-gray-50 dark:border-gray-700/50" dir="rtl">
                        {details.map((item, i) => (
                          <div key={i} className={`flex flex-col items-center rounded-lg p-2 min-w-[3rem] border ${!item.valMashriqi && !item.valMaghribi ? 'bg-gray-100 dark:bg-gray-800 border-transparent opacity-50' : 'bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-600'}`}>
                            <span className="text-base font-bold text-gray-900 dark:text-white mb-0.5 font-arabic">{item.char}</span>
                            <div className="flex gap-1.5 text-[10px] w-full justify-center">
                              <span className="text-blue-600 dark:text-blue-400 font-bold">{item.valMashriqi || '-'}</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.valMaghribi || '-'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Thème des 4 Éléments du Nom */}
      {activeTab === 'elements' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <label className="block text-sm font-bold text-gray-900 dark:text-white">
              Saisissez le Nom Complet en Arabe pour calculer la Température Naturelle
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Exemple: محمد بن عبد الله"
              dir="rtl"
              rows={2}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 text-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              style={{ fontFamily: "'Amiri', 'Traditional Arabic', system-ui, sans-serif" }}
            />

            {letterCount === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">Veuillez entrer un nom en alphabet arabe pour voir le thème des 4 éléments.</p>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Fire */}
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200/60 dark:border-red-900/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold text-xs">
                      <Flame size={16} />
                      <span>Feu (النار)</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{elemental.fire}</p>
                    <p className="text-[10px] text-gray-500">{((elemental.fire / letterCount) * 100).toFixed(1)}% des lettres</p>
                  </div>

                  {/* Air */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs">
                      <Wind size={16} />
                      <span>Air (الهواء)</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{elemental.air}</p>
                    <p className="text-[10px] text-gray-500">{((elemental.air / letterCount) * 100).toFixed(1)}% des lettres</p>
                  </div>

                  {/* Water */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs">
                      <Droplets size={16} />
                      <span>Eau (الماء)</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{elemental.water}</p>
                    <p className="text-[10px] text-gray-500">{((elemental.water / letterCount) * 100).toFixed(1)}% des lettres</p>
                  </div>

                  {/* Earth */}
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      <Mountain size={16} />
                      <span>Terre (التراب)</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{elemental.earth}</p>
                    <p className="text-[10px] text-gray-500">{((elemental.earth / letterCount) * 100).toFixed(1)}% des lettres</p>
                  </div>
                </div>

                {/* Temperament Analysis */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/40 space-y-2">
                  <h4 className="font-bold text-sm text-blue-900 dark:text-blue-200 flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-500" />
                    Analyse du Tempérament Naturel (Mizaj al-Ism)
                  </h4>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {elemental.fire >= elemental.air && elemental.fire >= elemental.water && elemental.fire >= elemental.earth &&
                      "Dominante de FEU (Bilieux / Chaud & Sec) : Tempérament passionné, meneur d'hommes, réaction rapide et forte volonté d'accomplissement. Affinité avec les Noms Divins de Puissance et de Victoire."}
                    {elemental.air > elemental.fire && elemental.air >= elemental.water && elemental.air >= elemental.earth &&
                      "Dominante d'AIR (Sanguin / Chaud & Humide) : Esprit communicatif, vif, intellectuel et relationnel. Idéal pour l'enseignement, le commerce et l'éloquence."}
                    {elemental.water > elemental.fire && elemental.water > elemental.air && elemental.water >= elemental.earth &&
                      "Dominante d'EAU (Lymphatique / Froid & Humide) : Sensibilité intuitive, bonté naturelle, préservation et profondeur d'âme. Grande affinité avec les Noms Divins de Miséricorde (Rahma)."}
                    {elemental.earth > elemental.fire && elemental.earth > elemental.air && elemental.earth > elemental.water &&
                      "Dominante de TERRE (Mélancolique / Froid & Sec) : Esprit d'ancrage, de persévérance, de méthode et de travail de fond. Capacité à concrétiser les projets matériels durables."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Compatibilité de 2 Noms */}
      {activeTab === 'compatibility' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-blue-500" />
              Calcul d'Entente Spirituelle (Mariage, Partenariat)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Premier Nom (ex. Mari / Partenaire 1)</label>
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  placeholder="Nom en Arabe (ex: احمد)"
                  dir="rtl"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: "'Amiri', 'Traditional Arabic', system-ui, sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Second Nom (ex. Épouse / Partenaire 2)</label>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder="Nom en Arabe (ex: فاطمة)"
                  dir="rtl"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: "'Amiri', 'Traditional Arabic', system-ui, sans-serif" }}
                />
              </div>
            </div>

            {!compResult ? (
              <p className="text-xs text-gray-500 text-center py-4">Entrez les deux noms en caractères arabes pour afficher l'analyse d'entente onomastique.</p>
            ) : (
              <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl text-white gap-3">
                  <div>
                    <span className="text-xs uppercase font-medium text-blue-100">Score de Résonance Spirituelle</span>
                    <h4 className="text-2xl font-bold">{compResult.archetype}</h4>
                    <p className="text-xs text-blue-100 mt-1">{compResult.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-3xl font-extrabold">{compResult.score}%</span>
                    <p className="text-[10px] text-blue-200">Indice d'Harmonie</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500 block">Abjad Nom 1</span>
                    <strong className="text-base text-gray-900 dark:text-white">{compResult.name1Val}</strong>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500 block">Abjad Nom 2</span>
                    <strong className="text-base text-gray-900 dark:text-white">{compResult.name2Val}</strong>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500 block">Somme Totale</span>
                    <strong className="text-base text-blue-600 dark:text-blue-400">{compResult.sumTotal}</strong>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="text-gray-500 block">Reste Modulo 9</span>
                    <strong className="text-base text-amber-600 dark:text-amber-400">{compResult.mod9} / 9</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      </div>

      {/* Abjad Info Modal */}
      <AnimatePresence>
        {showAbjadInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAbjadInfoModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl max-w-md w-full relative border border-gray-100 dark:border-gray-700 z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowAbjadInfoModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                  <Calculator size={22} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Comment interpréter l'Abjad ?
                </h3>
              </div>
              
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  L'Abjad est un système d'écriture et de numérologie sacrée qui attribue une valeur numérique (adad) à chacune des 28 lettres de l'alphabet arabe.
                </p>
                <p>
                  <strong>Pour vos invocations et zikrs :</strong>
                  <br />
                  Le chiffre obtenu (par exemple, de votre prénom) représente votre <strong>résonance mystique</strong>. Vous pouvez utiliser ce chiffre comme nombre de répétitions quotidiennes pour un Nom Divin compatible (dont la valeur Abjad correspond à la vôtre).
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-700/50 space-y-2">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Différence entre les systèmes :</p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <li><strong>Mashriqi (Orientale) :</strong> Système standard traditionnel le plus répandu au Moyen-Orient.</li>
                    <li><strong>Maghribi (Occidentale) :</strong> Système privilégié en Afrique du Nord et de l'Ouest (traditions de l'Asrar ouest-africain et marocain).</li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={() => setShowAbjadInfoModal(false)}
                className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
              >
                J'ai compris
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
