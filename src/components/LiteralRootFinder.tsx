import React, { useState } from 'react';
import { Search, Compass, Sparkles, BookOpen, Check, Copy, Flame, Mountain, Wind, Droplets } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { triggerProtectionModal } from './ContentProtectionManager';
import { calculateAbjadValue } from '../utils/abjad';
import { FULL_28_LETTERS_DATA } from '../pages/user/tools/ScienceOfLetters';

const translations = {
  fr: {
    title: "Racines Littérales (Al-Judhur al-Lughawiyyah / الجذور اللغوية)",
    subtitle: "Extraction et identification de la racine consonantique principale (3 ou 4 lettres) de tout mot ou nom arabe",
    inputLabel: "Entrez un mot, prénom ou terme arabe :",
    inputPlaceholder: "ex: كَاتِب, مَكْتُوب, حَلِيم, رَحْمَن...",
    extractBtn: "Identifier la Racine",
    rootTitle: "Racine Consonantique Principale (Al-Jidhr) :",
    triliteralLabel: "Racine Trilitère (الجذر الثلاثي)",
    rootAbjad: "Valeur Abjad de la Racine :",
    elementsTitle: "Composition Élémentaire de la Racine",
    divineNamesTitle: "Noms Divins & Attributs Associés",
    benefitsTitle: "Signification Ésotérique & Fréquence",
    copyBtn: "Copier la racine",
    copied: "Copié !",
    presetsTitle: "Exemples courants :",
  },
  en: {
    title: "Literal Roots (Al-Judhur al-Lughawiyyah / الجذور اللغوية)",
    subtitle: "Extraction and identification of the main consonantal root (3 or 4 letters) of any Arabic word or name",
    inputLabel: "Enter an Arabic word, name, or term:",
    inputPlaceholder: "e.g., كَاتِب, مَكْتُوب, حَلِيم, رَحْمَن...",
    extractBtn: "Identify Root",
    rootTitle: "Main Consonantal Root (Al-Jidhr):",
    triliteralLabel: "Triliteral Root (الجذر الثلاثي)",
    rootAbjad: "Root Abjad Value:",
    elementsTitle: "Elemental Composition of Root",
    divineNamesTitle: "Associated Divine Names & Attributes",
    benefitsTitle: "Esoteric Significance & Frequency",
    copyBtn: "Copy Root",
    copied: "Copied!",
    presetsTitle: "Common Examples:",
  },
  ha: {
    title: "Saiwoyin Kalmomi (Al-Judhur al-Lughawiyyah / الجذور اللغوية)",
    subtitle: "Fitar da ainihin saiwaryar kalma ko suna na Larabci (haruffa 3 ko 4)",
    inputLabel: "Shigar da kalma ko sunan Larabci:",
    inputPlaceholder: "Misali: كَاتِب, مَكْتُوب, حَلِيم, رَحْمَن...",
    extractBtn: "Fitar da Saiwa",
    rootTitle: "Ainihin Saiwar Kalma (Al-Jidhr):",
    triliteralLabel: "Saiwa guda 3 (الجذر الثلاثي)",
    rootAbjad: "Lissafin Abjad na Saiwa:",
    elementsTitle: "Tarin Mazaunai na Saiwa",
    divineNamesTitle: "Sunayen Allah Masu Alaƙa",
    benefitsTitle: "Ma'anar Asiri da Sirrin Saiwa",
    copyBtn: "Kwafa Saiwa",
    copied: "An Kwafa!",
    presetsTitle: "Misalai na Yau da Kullum:",
  }
};

const COMMON_PRESETS = [
  { word: 'كَاِتَب', label: 'كاتب' },
  { word: 'مَكْتُوب', label: 'مكتوب' },
  { word: 'حَلِيم', label: 'حليم' },
  { word: 'عَالِم', label: 'عالم' },
  { word: 'رَحْمَن', label: 'رحمن' },
  { word: 'قُدُّوس', label: 'قدوس' }
];

export const LiteralRootFinder: React.FC = () => {
  const { language } = useLanguage();
  const { isPremium } = useAuth();
  const t = translations[(language as 'fr' | 'en' | 'ha') || 'fr'] || translations.fr;

  const [inputWord, setInputWord] = useState('مَكْتُوب');
  const [copied, setCopied] = useState(false);

  // Arabic Root Extraction Algorithm
  const extractArabicRoot = (word: string): string[] => {
    // 1. Remove diacritics
    let clean = word
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
      .replace(/[^\u0621-\u064A]/g, '');

    if (!clean) return [];

    // Normalize hamzas & alifs
    clean = clean.replace(/[أإآء]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');

    let chars = Array.from(clean);

    // If 3 letters or fewer, return directly
    if (chars.length <= 3) return chars;

    // Remove common prefixes
    const prefixes = ['ال', 'لل', 'بال', 'فال', 'كال', 'وال', 'است', 'م', 'ت', 'ي', 'ن', 'ا'];
    for (const pref of prefixes) {
      if (clean.startsWith(pref) && clean.length - pref.length >= 3) {
        clean = clean.slice(pref.length);
        break;
      }
    }

    // Remove common suffixes
    const suffixes = ['ات', 'ون', 'ين', 'ان', 'كم', 'هم', 'ها', 'نا', 'تك', 'تم', 'ة', 'ه', 'ي', 'ك', 'ت'];
    for (const suff of suffixes) {
      if (clean.endsWith(suff) && clean.length - suff.length >= 3) {
        clean = clean.slice(0, clean.length - suff.length);
        break;
      }
    }

    chars = Array.from(clean);

    // If still > 3, remove infix 'ا', 'و', 'ي' if present in middle
    if (chars.length > 3) {
      const filtered = chars.filter((ch, idx) => {
        if ((ch === 'ا' || ch === 'و' || ch === 'ي' || ch === 'ت' || ch === 'م') && idx > 0 && idx < chars.length - 1) {
          return false;
        }
        return true;
      });
      if (filtered.length >= 3) {
        chars = filtered.slice(0, 3);
      }
    }

    return chars.slice(0, 3);
  };

  const rootChars = extractArabicRoot(inputWord);
  const rootStr = rootChars.join(' - ');
  const rootAbjad = calculateAbjadValue(rootChars.join(''));

  // Calculate elemental breakdown of root letters
  const elemCounts = { Feu: 0, Terre: 0, Air: 0, Eau: 0 };
  rootChars.forEach(ch => {
    const match = FULL_28_LETTERS_DATA.find(l => l.char === ch);
    if (match) {
      elemCounts[match.element] += 1;
    }
  });

  const getElementIcon = (elem: string) => {
    switch (elem) {
      case 'Feu': return <Flame size={16} className="text-red-500" />;
      case 'Eau': return <Droplets size={16} className="text-blue-500" />;
      case 'Terre': return <Mountain size={16} className="text-amber-600" />;
      default: return <Wind size={16} className="text-cyan-500" />;
    }
  };

  const handleCopy = () => {
    if (!isPremium) {
      triggerProtectionModal('copy');
      return;
    }
    navigator.clipboard.writeText(rootChars.join(' - '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-7 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Compass className="text-emerald-500 shrink-0" size={22} />
          <span>{t.title}</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
          {t.inputLabel}
        </label>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-2xl text-xl font-arabic text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            dir="rtl"
          />
          <button
            onClick={handleCopy}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shrink-0 transition-colors cursor-pointer shadow-md"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? t.copied : t.copyBtn}</span>
          </button>
        </div>

        {/* Common Presets */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{t.presetsTitle}</span>
          {COMMON_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setInputWord(p.word)}
              className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-arabic font-bold transition-all hover:bg-emerald-100 cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Root Results Card */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border-2 border-emerald-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {t.rootTitle}
            </span>
            <div className="text-3xl sm:text-5xl font-arabic font-extrabold text-emerald-800 dark:text-emerald-300 mt-1" dir="rtl">
              {rootStr || '—'}
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
              {t.triliteralLabel}
            </span>
          </div>

          <div className="p-4 bg-white/90 dark:bg-gray-800/90 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-center shadow-md shrink-0">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold block">{t.rootAbjad}</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              {rootAbjad}
            </span>
          </div>
        </div>

        {/* Individual Letters of the Root */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {rootChars.map((ch, idx) => {
            const match = FULL_28_LETTERS_DATA.find(l => l.char === ch);
            return (
              <div key={idx} className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-arabic text-2xl font-bold">
                    {ch}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">{match?.name || ch}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      {match?.element && getElementIcon(match.element)} {match?.element}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold font-mono text-purple-600 dark:text-purple-300">
                  {match?.abjad || calculateAbjadValue(ch)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Elemental Composition */}
        <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
          <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
            <Sparkles size={16} className="text-emerald-500" /> {t.elementsTitle}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {Object.entries(elemCounts).map(([elem, count]) => (
              <div key={elem} className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-between font-medium">
                <span className="flex items-center gap-1">{getElementIcon(elem)} {elem}</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
