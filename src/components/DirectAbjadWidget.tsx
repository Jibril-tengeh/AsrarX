import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Sparkles, 
  Copy, 
  Check, 
  Flame, 
  Wind, 
  Droplets, 
  Globe, 
  ArrowRight, 
  Activity, 
  Layers, 
  Hash, 
  RotateCcw,
  BookOpen,
  Moon,
  Crown,
  Shield,
  Compass,
  Zap,
  Palette,
  CheckCircle2,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateAbjadValue, getElementalBreakdown } from '../utils/abjad';

// Transliteration helper for Latin names to Arabic
const transliterateLatinToArabic = (text: string): string => {
  if (!text) return '';
  if (/[\u0600-\u06FF]/.test(text)) return text;
  return text
    .toLowerCase()
    .replace(/ou/g, 'و')
    .replace(/ch/g, 'ش')
    .replace(/kh/g, 'خ')
    .replace(/th/g, 'ث')
    .replace(/dh/g, 'ذ')
    .replace(/gh/g, 'غ')
    .replace(/sh/g, 'ش')
    .replace(/a/g, 'ا')
    .replace(/b/g, 'ب')
    .replace(/c/g, 'ك')
    .replace(/d/g, 'د')
    .replace(/e/g, 'ي')
    .replace(/f/g, 'ف')
    .replace(/g/g, 'ج')
    .replace(/h/g, 'ه')
    .replace(/i/g, 'ي')
    .replace(/j/g, 'ج')
    .replace(/k/g, 'ك')
    .replace(/l/g, 'ل')
    .replace(/m/g, 'م')
    .replace(/n/g, 'ن')
    .replace(/o/g, 'و')
    .replace(/p/g, 'ب')
    .replace(/q/g, 'ق')
    .replace(/r/g, 'ر')
    .replace(/s/g, 'س')
    .replace(/t/g, 'ت')
    .replace(/u/g, 'و')
    .replace(/v/g, 'ف')
    .replace(/w/g, 'و')
    .replace(/x/g, 'كس')
    .replace(/y/g, 'ي')
    .replace(/z/g, 'ز')
    .replace(/[^ء-ي\s]/g, '');
};

const abjadLettersMap: Record<string, number> = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1,
  'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5,
  'و': 6, 'ؤ': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ى': 10, 'ئ': 10, 'ك': 20, 'ل': 30,
  'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80,
  'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400,
  'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900,
  'غ': 1000
};

// Curated Thematic Icons Definition
export type AbjadIconId = 
  | 'calculator' 
  | 'sparkles' 
  | 'flame' 
  | 'moon' 
  | 'book' 
  | 'layers' 
  | 'hash' 
  | 'crown' 
  | 'shield' 
  | 'compass' 
  | 'zap' 
  | 'activity';

interface ThematicIconOption {
  id: AbjadIconId;
  labelFr: string;
  labelEn: string;
  labelHa: string;
  icon: React.ReactNode;
  bgGradient: string;
}

const THEMATIC_ICONS: ThematicIconOption[] = [
  { id: 'calculator', labelFr: 'Calculateur Standard', labelEn: 'Standard Calculator', labelHa: 'Lissafi na Kullum', icon: <Calculator size={20} className="stroke-[2.2]" />, bgGradient: 'from-emerald-600 to-teal-500' },
  { id: 'sparkles', labelFr: 'Lumière Divine (Asrar)', labelEn: 'Divine Light (Asrar)', labelHa: 'Hasken Asrar', icon: <Sparkles size={20} className="stroke-[2.2]" />, bgGradient: 'from-amber-500 to-emerald-600' },
  { id: 'flame', labelFr: 'Élément Feu (Puissance)', labelEn: 'Fire Element (Power)', labelHa: 'Dabi\'ar Wuta', icon: <Flame size={20} className="stroke-[2.2]" />, bgGradient: 'from-red-600 to-amber-500' },
  { id: 'moon', labelFr: 'Secret Lunaire & Hilal', labelEn: 'Lunar & Hilal Mystery', labelHa: 'Sirrin Wata', icon: <Moon size={20} className="stroke-[2.2]" />, bgGradient: 'from-indigo-600 to-cyan-500' },
  { id: 'book', labelFr: 'Livre & Sagesse (Hikmah)', labelEn: 'Book & Wisdom (Hikmah)', labelHa: 'Littafi da Hikima', icon: <BookOpen size={20} className="stroke-[2.2]" />, bgGradient: 'from-blue-600 to-indigo-500' },
  { id: 'layers', labelFr: 'Dimensions (Kabir)', labelEn: 'Dimensions (Kabir)', labelHa: 'Matakan Kabir', icon: <Layers size={20} className="stroke-[2.2]" />, bgGradient: 'from-purple-600 to-pink-500' },
  { id: 'hash', labelFr: 'Chiffres & Racines', labelEn: 'Numbers & Roots', labelHa: 'Lambobi da Tushe', icon: <Hash size={20} className="stroke-[2.2]" />, bgGradient: 'from-teal-600 to-emerald-500' },
  { id: 'crown', labelFr: 'Majesté Spirituelle', labelEn: 'Spiritual Majesty', labelHa: 'Sarautar Ruhi', icon: <Crown size={20} className="stroke-[2.2]" />, bgGradient: 'from-amber-600 to-yellow-400' },
  { id: 'shield', labelFr: 'Protection & Voile', labelEn: 'Protection & Veil', labelHa: 'Kariya da Garkuwa', icon: <Shield size={20} className="stroke-[2.2]" />, bgGradient: 'from-emerald-700 to-slate-800' },
  { id: 'compass', labelFr: 'Orientation Céleste', labelEn: 'Celestial Orientation', labelHa: 'Jagoran Alqibla', icon: <Compass size={20} className="stroke-[2.2]" />, bgGradient: 'from-cyan-600 to-teal-700' },
  { id: 'zap', labelFr: 'Énergie & Vibration', labelEn: 'Energy & Vibration', labelHa: 'Karfi da Ruri', icon: <Zap size={20} className="stroke-[2.2]" />, bgGradient: 'from-amber-500 to-orange-600' },
  { id: 'activity', labelFr: 'Rythme & Dhikr', labelEn: 'Rhythm & Dhikr', labelHa: 'Zikiri da Motsi', icon: <Activity size={20} className="stroke-[2.2]" />, bgGradient: 'from-rose-600 to-purple-600' },
];

export const DirectAbjadWidget: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  // Custom Icon preference state with localStorage persistence
  const [selectedIconId, setSelectedIconId] = useState<AbjadIconId>(() => {
    try {
      const saved = localStorage.getItem('asrarhub_direct_abjad_icon') as AbjadIconId;
      if (saved && THEMATIC_ICONS.some(t => t.id === saved)) {
        return saved;
      }
    } catch {}
    return 'calculator';
  });

  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Save selected icon preference
  const handleSelectIcon = (iconId: AbjadIconId) => {
    setSelectedIconId(iconId);
    try {
      localStorage.setItem('asrarhub_direct_abjad_icon', iconId);
    } catch {}
    setIsIconSelectorOpen(false);
  };

  // Active icon configuration
  const activeIconConfig = useMemo(() => {
    return THEMATIC_ICONS.find(item => item.id === selectedIconId) || THEMATIC_ICONS[0];
  }, [selectedIconId]);

  // Determine Arabic representation
  const arabicText = useMemo(() => {
    const trimmed = inputQuery.trim();
    if (!trimmed) return '';
    if (/[\u0600-\u06FF]/.test(trimmed)) {
      return trimmed;
    }
    return transliterateLatinToArabic(trimmed);
  }, [inputQuery]);

  // Clean letters for Abjad calculation
  const cleanArabic = useMemo(() => {
    return arabicText.replace(/[\u064B-\u065F\u0670\s]/g, '');
  }, [arabicText]);

  // Calculations
  const wasatVal = useMemo(() => calculateAbjadValue(cleanArabic), [cleanArabic]);
  const letterCount = useMemo(() => Array.from(cleanArabic).length, [cleanArabic]);
  const kabirVal = useMemo(() => wasatVal * (letterCount || 1), [wasatVal, letterCount]);
  
  const saghirVal = useMemo(() => {
    if (wasatVal === 0) return 0;
    let n = wasatVal;
    while (n > 9) {
      n = String(n).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return n;
  }, [wasatVal]);

  const elemental = useMemo(() => getElementalBreakdown(cleanArabic), [cleanArabic]);

  // Individual letter breakdown
  const lettersBreakdown = useMemo(() => {
    return Array.from(cleanArabic).map((char, index) => {
      const val = abjadLettersMap[char] || 0;
      let element: 'fire' | 'air' | 'water' | 'earth' = 'fire';
      if (['ا', 'أ', 'إ', 'آ', 'ه', 'ة', 'ط', 'م', 'ف', 'ش', 'ذ'].includes(char)) element = 'fire';
      else if (['ج', 'ز', 'ك', 'س', 'ق', 'ث', 'ظ'].includes(char)) element = 'air';
      else if (['د', 'ح', 'ل', 'ع', 'ر', 'خ', 'غ'].includes(char)) element = 'water';
      else element = 'earth';

      return { char, val, element, id: `${char}-${index}` };
    });
  }, [cleanArabic]);

  const handleCopy = () => {
    if (!wasatVal) return;
    const textToCopy = `${inputQuery} (${arabicText}) = ${wasatVal} [Abjad]`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchTasbih = () => {
    if (!wasatVal) return;
    navigate(`/tools/tasbih?target=${wasatVal}&name=${encodeURIComponent(arabicText || inputQuery)}`);
  };

  const handleLaunchWird = () => {
    navigate(`/tools/personal-wird`);
  };

  const handleLaunchLetters = () => {
    const query = arabicText || inputQuery;
    if (query) {
      navigate(`/tools/letters?q=${encodeURIComponent(query)}`);
    } else {
      navigate(`/tools/letters`);
    }
  };

  // Translations
  const t = {
    fr: {
      title: "Calculateur Abjad Direct",
      badge: "Temps Réel",
      subtitle: "Calculez instantanément la valeur mystique et la résonance élémentaire de n'importe quel texte ou nom.",
      placeholder: "Tapez en arabe ou phonétique (ex: Ya Latif, Allah, محمد, 114...)",
      totalAbjad: "Poids Abjad (Wasat)",
      letterCountLabel: "Lettres (Hurūf)",
      grandKabir: "Grand Mode (Kabir)",
      rootSaghir: "Racine / Ruh (Saghir)",
      elementalBreakdown: "Harmonie des 4 Éléments",
      lettersDetail: "Décomposition des Lettres",
      copyVal: "Copier la valeur",
      copiedMsg: "Copié !",
      btnTasbih: "Lancer sur Tasbih",
      btnWird: "Wird Personnel",
      btnLetters: "Science des Lettres",
      quickExamples: "Exemples rapides :",
      fire: "Feu",
      air: "Air",
      water: "Eau",
      earth: "Terre",
      arabicTranslit: "Équivalent Arabe :",
      customizeIcon: "Personnaliser l'icône",
      selectIconTitle: "Choisir l'icône du widget",
      detectedLanguage: "Langue active :",
      langFr: "FR",
      langEn: "EN",
      langHa: "HA"
    },
    en: {
      title: "Direct Abjad Calculator",
      badge: "Real-Time",
      subtitle: "Instantly calculate the mystical Abjad value and elemental balance of any phrase, verse, or name.",
      placeholder: "Type in Arabic or phonetics (e.g. Ya Latif, Allah, Muhammad, 114...)",
      totalAbjad: "Abjad Weight (Wasat)",
      letterCountLabel: "Letters (Hurūf)",
      grandKabir: "Grand Mode (Kabir)",
      rootSaghir: "Root / Spirit (Saghir)",
      elementalBreakdown: "4 Elements Balance",
      lettersDetail: "Letters Breakdown",
      copyVal: "Copy value",
      copiedMsg: "Copied!",
      btnTasbih: "Launch in Tasbih",
      btnWird: "Personal Wird",
      btnLetters: "Science of Letters",
      quickExamples: "Quick presets:",
      fire: "Fire",
      air: "Air",
      water: "Water",
      earth: "Earth",
      arabicTranslit: "Arabic Form:",
      customizeIcon: "Customize icon",
      selectIconTitle: "Select Widget Icon",
      detectedLanguage: "Active Language:",
      langFr: "FR",
      langEn: "EN",
      langHa: "HA"
    },
    ha: {
      title: "Lissafin Abjad Kai Tsaye",
      badge: "Nan Take",
      subtitle: "Lissafa nauyin lambobin Abjad da dabi'un haruffa cikin sauki da sauri na kowace kalma ko suna.",
      placeholder: "Rubuta da Larabci ko Hausa (misali: Ya Latif, Allah, Muhammad...)",
      totalAbjad: "Nauyin Abjad (Wasat)",
      letterCountLabel: "Haruffa (Huruf)",
      grandKabir: "Babban Ninki (Kabir)",
      rootSaghir: "Tushen Ruhi (Saghir)",
      elementalBreakdown: "Rabon Dabi'u 4",
      lettersDetail: "Rarraba Haruffa",
      copyVal: "Kwafi lissafi",
      copiedMsg: "An Kwafa!",
      btnTasbih: "Aika zuwa Carbi",
      btnWird: "Wirdin Kanka",
      btnLetters: "Ilimin Haruffa",
      quickExamples: "Misalai na gaggawa:",
      fire: "Wuta",
      air: "Iska",
      water: "Ruwa",
      earth: "Kasa",
      arabicTranslit: "Kalamin Larabci:",
      customizeIcon: "Sauya Tambari",
      selectIconTitle: "Zabi Tambarin Wannan Kayan Aiki",
      detectedLanguage: "Yaren da ke Aiki:",
      langFr: "FR",
      langEn: "EN",
      langHa: "HA"
    }
  }[language as 'fr' | 'en' | 'ha'] || {
    title: "Calculateur Abjad Direct",
    badge: "Temps Réel",
    subtitle: "Calculez instantanément la valeur mystique et la résonance élémentaire.",
    placeholder: "Tapez en arabe ou phonétique...",
    totalAbjad: "Poids Abjad (Wasat)",
    letterCountLabel: "Lettres (Hurūf)",
    grandKabir: "Grand Mode (Kabir)",
    rootSaghir: "Racine / Ruh (Saghir)",
    elementalBreakdown: "Harmonie des 4 Éléments",
    lettersDetail: "Décomposition des Lettres",
    copyVal: "Copier la valeur",
    copiedMsg: "Copié !",
    btnTasbih: "Lancer sur Tasbih",
    btnWird: "Wird Personnel",
    btnLetters: "Science des Lettres",
    quickExamples: "Exemples rapides :",
    fire: "Feu",
    air: "Air",
    water: "Eau",
    earth: "Terre",
    arabicTranslit: "Équivalent Arabe :",
    customizeIcon: "Personnaliser l'icône",
    selectIconTitle: "Choisir l'icône du widget",
    detectedLanguage: "Langue :",
    langFr: "FR",
    langEn: "EN",
    langHa: "HA"
  };

  const sampleNames = [
    { label: 'يا لطيف', translit: 'Ya Latif', val: 129 },
    { label: 'الله', translit: 'Allah', val: 66 },
    { label: 'محمد', translit: 'Muhammad', val: 92 },
    { label: 'يا رزاق', translit: 'Ya Razzaq', val: 308 },
    { label: 'يا ودود', translit: 'Ya Wadud', val: 20 },
    { label: 'يا فتاح', translit: 'Ya Fattah', val: 489 },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-indigo-900/10 via-emerald-900/5 to-teal-900/10 dark:from-indigo-950/40 dark:via-gray-900/60 dark:to-emerald-950/30 rounded-3xl border border-emerald-500/20 dark:border-emerald-500/30 p-4 sm:p-6 shadow-lg shadow-emerald-900/5 backdrop-blur-sm relative overflow-hidden transition-all duration-300">
      {/* Decorative top right glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          
          {/* Customizable Visual Icon Button */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => setIsIconSelectorOpen(!isIconSelectorOpen)}
              className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${activeIconConfig.bgGradient} text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0 transition-transform group-hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden`}
              title={t.customizeIcon}
            >
              {activeIconConfig.icon}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Palette size={12} className="text-white drop-shadow" />
              </div>
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">
                {t.title}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/20">
                {t.badge}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Right Controls: Icon Picker Button + Reset */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Palette button to customize icon */}
          <button
            type="button"
            onClick={() => setIsIconSelectorOpen(!isIconSelectorOpen)}
            className="p-2 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            title={t.customizeIcon}
          >
            <Palette size={15} />
            <span className="text-[11px] font-bold hidden sm:inline text-gray-700 dark:text-gray-300">
              {t.customizeIcon}
            </span>
          </button>

          {wasatVal > 0 && (
            <button
              type="button"
              onClick={() => setInputQuery('')}
              title="Réinitialiser"
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Visual Icon Selection Dropdown Modal */}
      <AnimatePresence>
        {isIconSelectorOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-emerald-500/30 shadow-xl relative z-20"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Palette size={16} className="text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">
                  {t.selectIconTitle}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsIconSelectorOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {THEMATIC_ICONS.map((item) => {
                const isSelected = item.id === selectedIconId;
                const label = language === 'ha' ? item.labelHa : language === 'fr' ? item.labelFr : item.labelEn;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectIcon(item.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer relative ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 bg-gray-50/50 dark:bg-gray-850'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${item.bgGradient} text-white flex items-center justify-center shadow-xs`}>
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 line-clamp-1">
                      {label}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={12} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Field */}
      <div className="relative z-10 mb-3">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t.placeholder}
            className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-2 border-emerald-500/30 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm sm:text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-inner"
          />
          {wasatVal > 0 && (
            <button
              onClick={handleCopy}
              className="absolute right-2 p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
              title={t.copyVal}
            >
              {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
            </button>
          )}
        </div>

        {/* Arabic detected preview if typed in Latin */}
        {arabicText && !/[\u0600-\u06FF]/.test(inputQuery) && (
          <div className="mt-1.5 px-3 py-1 bg-emerald-500/10 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <span className="font-semibold">{t.arabicTranslit}</span>
            <span className="font-arabic font-bold text-sm tracking-wide">{arabicText}</span>
          </div>
        )}
      </div>

      {/* Quick Presets if empty */}
      {wasatVal === 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
          <span className="text-gray-500 dark:text-gray-400 font-medium text-[11px] mr-1">{t.quickExamples}</span>
          {sampleNames.map((item) => (
            <button
              key={item.label}
              onClick={() => setInputQuery(item.label)}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-medium text-xs transition-all hover:border-emerald-400 cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span className="font-arabic text-emerald-700 dark:text-emerald-400 font-bold">{item.label}</span>
              <span className="text-[10px] text-gray-400 font-mono">({item.val})</span>
            </button>
          ))}
        </div>
      )}

      {/* Real-time Calculation Results Display */}
      <AnimatePresence>
        {wasatVal > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 mt-3 relative z-10"
          >
            {/* Primary Numbers Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Wasat */}
              <div className="p-3 bg-white dark:bg-gray-800/90 rounded-2xl border-2 border-emerald-500/40 shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tight">
                  {t.totalAbjad}
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-gray-900 dark:text-white">
                    {wasatVal}
                  </span>
                  <Sparkles size={16} className="text-emerald-500 animate-pulse" />
                </div>
              </div>

              {/* Huruf */}
              <div className="p-3 bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">
                  {t.letterCountLabel}
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                    {letterCount}
                  </span>
                  <Hash size={16} className="text-indigo-400" />
                </div>
              </div>

              {/* Kabir */}
              <div className="p-3 bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">
                  {t.grandKabir}
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl sm:text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
                    {kabirVal}
                  </span>
                  <Layers size={16} className="text-purple-400" />
                </div>
              </div>

              {/* Saghir / Ruh */}
              <div className="p-3 bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">
                  {t.rootSaghir}
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-teal-600 dark:text-teal-400">
                    {saghirVal}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                </div>
              </div>
            </div>

            {/* Elements Bar */}
            <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-gray-700 dark:text-gray-300">{t.elementalBreakdown}</span>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer text-[11px]"
                >
                  {isExpanded ? '▲ Réduire' : '▼ Détails des Lettres'}
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/30 flex items-center justify-center gap-1">
                  <Flame size={12} className="text-red-500" />
                  <span className="text-red-700 dark:text-red-300 font-bold">{t.fire}: {elemental.fire}%</span>
                </div>
                <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/30 flex items-center justify-center gap-1">
                  <Wind size={12} className="text-blue-500" />
                  <span className="text-blue-700 dark:text-blue-300 font-bold">{t.air}: {elemental.air}%</span>
                </div>
                <div className="p-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/30 flex items-center justify-center gap-1">
                  <Droplets size={12} className="text-cyan-500" />
                  <span className="text-cyan-700 dark:text-cyan-300 font-bold">{t.water}: {elemental.water}%</span>
                </div>
                <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/30 flex items-center justify-center gap-1">
                  <Globe size={12} className="text-amber-500" />
                  <span className="text-amber-700 dark:text-amber-300 font-bold">{t.earth}: {elemental.earth}%</span>
                </div>
              </div>

              {/* Letter breakdown expandable */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700"
                >
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block mb-2">
                    {t.lettersDetail} :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {lettersBreakdown.map((item) => (
                      <div
                        key={item.id}
                        className="px-2.5 py-1 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 text-xs font-mono"
                      >
                        <span className="font-arabic font-bold text-sm text-gray-900 dark:text-white">
                          {item.char}
                        </span>
                        <span className="text-gray-400 text-[10px]">=</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                          {item.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <button
                onClick={handleLaunchTasbih}
                className="flex-1 min-w-[130px] py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 active:scale-98 cursor-pointer"
              >
                <Activity size={14} />
                <span>{t.btnTasbih}</span>
              </button>

              <button
                onClick={handleLaunchWird}
                className="py-2 px-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Sparkles size={14} className="text-amber-500" />
                <span>{t.btnWird}</span>
                <ArrowRight size={12} className="text-gray-400" />
              </button>

              <button
                onClick={handleLaunchLetters}
                className="py-2 px-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <BookOpen size={14} className="text-indigo-500" />
                <span>{t.btnLetters}</span>
                <ArrowRight size={12} className="text-gray-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
