import React, { useState } from 'react';
import { RefreshCw, Copy, Check, Sparkles, Layers, ArrowRight, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { triggerProtectionModal } from './ContentProtectionManager';
import { calculateAbjadValue } from '../utils/abjad';
import { motion } from 'motion/react';

interface TakseerStep {
  stepIndex: number;
  letters: string[];
  text: string;
  abjadValue: number;
}

const translations = {
  fr: {
    title: "Takseer (Permutation / التكسير)",
    subtitle: "Fracturation et permutation circulaire des lettres selon la science ésotérique d'Ilm al-Huruf",
    inputLabel: "Texte ou Nom à permuter :",
    inputPlaceholder: "ex: حليم ou القدوس...",
    algorithmLabel: "Algorithme de Takseer :",
    circularMode: "Takseer Dawa'ir (Fin → Début → Avant-fin → 2ème...)",
    linearMode: "Takseer Muttasil (Début → Fin → 2ème → Avant-fin...)",
    stepsCount: "Nombre de cycles :",
    generateBtn: "Générer le Takseer",
    originalText: "Texte d'origine",
    lettersCount: "lettres",
    abjadTotal: "Total Abjad :",
    stepsTableTitle: "Tableau de Permutation (Tableau al-Taksir)",
    stepCol: "Cycle",
    lettersCol: "Permutation des Lettres",
    abjadCol: "Valeur Abjad",
    actionCol: "Action",
    copyAllBtn: "Copier tout le Takseer",
    copied: "Copié !",
    howItWorksTitle: "Principes du Takseer en Ilm al-Huruf :",
    howItWorksDesc: "Le Taksir (ou broyage/permutation) est une technique fondamentale d'Ilm al-Huruf attribuée aux maîtres de la Sagesse. Elle permet de mélanger les fréquences des lettres pour libérer le secret spirituel (Sirr) d'un Nom Divin ou d'un nom de personne, créant ainsi une harmonie vibratoire pour les invocations et les sceaux.",
    presetTitle: "Exemples rapides :",
    preset1: "حليم (Halim)",
    preset2: "القدوس (Al-Quddus)",
    preset3: "ودود (Wadud)",
    preset4: "لطيف (Latif)",
  },
  en: {
    title: "Takseer (Permutation / التكسير)",
    subtitle: "Systematic fracturing and circular letter permutation based on the esoteric science of Ilm al-Huruf",
    inputLabel: "Text or Name to Permute:",
    inputPlaceholder: "e.g., حليم or القدوس...",
    algorithmLabel: "Takseer Algorithm:",
    circularMode: "Takseer Dawa'ir (End → Start → 2nd-End → 2nd...)",
    linearMode: "Takseer Muttasil (Start → End → 2nd → 2nd-End...)",
    stepsCount: "Number of Cycles:",
    generateBtn: "Generate Takseer",
    originalText: "Original Text",
    lettersCount: "letters",
    abjadTotal: "Abjad Total:",
    stepsTableTitle: "Permutation Table (Tableau al-Taksir)",
    stepCol: "Cycle",
    lettersCol: "Letter Permutation",
    abjadCol: "Abjad Value",
    actionCol: "Action",
    copyAllBtn: "Copy All Takseer",
    copied: "Copied!",
    howItWorksTitle: "Principles of Takseer in Ilm al-Huruf:",
    howItWorksDesc: "Taksir (letter fracturing/permutation) is a cornerstone technique of Ilm al-Huruf taught by master esoteric scholars. By systematically reorganizing the letters, it releases the latent spiritual frequency (Sirr) of divine names or individual names, establishing a powerful vibrational harmony for invocations and seals.",
    presetTitle: "Quick Presets:",
    preset1: "حليم (Halim)",
    preset2: "القدوس (Al-Quddus)",
    preset3: "ودود (Wadud)",
    preset4: "لطيف (Latif)",
  },
  ha: {
    title: "Taksir (Sake Tsara Haruffa / التكسير)",
    subtitle: "Juya haruffa da haɗa sirrinsu bisa tsarin ilimin haruffa na asiri (Ilm al-Huruf)",
    inputLabel: "Rubutu ko Sunan da za a Juya:",
    inputPlaceholder: "Misali: حليم ko القدوس...",
    algorithmLabel: "Tsarin Taksir:",
    circularMode: "Taksir Dawa'ir (Ƙarshe → Fari → Na Biyu Karshe...)",
    linearMode: "Taksir Muttasil (Fari → Ƙarshe → Na Biyu...)",
    stepsCount: "Yawan Zagaye:",
    generateBtn: "Gudanar da Taksir",
    originalText: "Asalin Rubutu",
    lettersCount: "haruffa",
    abjadTotal: "Jimillar Abjad:",
    stepsTableTitle: "Jadawalin Juya Haruffa (Tableau al-Taksir)",
    stepCol: "Zagaye",
    lettersCol: "Haruffan da Kuka Samu",
    abjadCol: "Valor na Abjad",
    actionCol: "Aiki",
    copyAllBtn: "Kwafa Dukkan Taksir",
    copied: "An Kwafa!",
    howItWorksTitle: "Amfanin Taksir a Ilimin Haruffa:",
    howItWorksDesc: "Taksir hanya ce ta asiri da manyan malamai ke amfani da ita don haɗa gwiwar haruffan sunayen Allah ko sunan mutum, ta yadda za a fitar da amsa-kuwwar ruhaniya (Sirr) don addu'o'i da lissafin hatimi.",
    presetTitle: "Misalai na Sauri:",
    preset1: "حليم (Halim)",
    preset2: "القدوس (Al-Quddus)",
    preset3: "ودود (Wadud)",
    preset4: "لطيف (Latif)",
  }
};

export const TakseerPermutation: React.FC = () => {
  const { language } = useLanguage();
  const { isPremium } = useAuth();
  const t = translations[(language as 'fr' | 'en' | 'ha') || 'fr'] || translations.fr;

  const [inputText, setInputText] = useState('حليم');
  const [algoMode, setAlgoMode] = useState<'circular' | 'linear'>('circular');
  const [maxSteps, setMaxSteps] = useState(8);
  const [steps, setSteps] = useState<TakseerStep[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Clean text and split into Arabic characters
  const cleanArabicLetters = (str: string): string[] => {
    // Remove diacritics, spaces, punctuation
    const cleanStr = str
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
      .replace(/[^\u0621-\u064A]/g, '');
    return Array.from(cleanStr);
  };

  // Perform one step of Takseer
  const permuteLetters = (chars: string[], mode: 'circular' | 'linear'): string[] => {
    if (chars.length <= 1) return chars;
    const n = chars.length;
    const result: string[] = [];

    if (mode === 'circular') {
      // Circular / End-Start: Last letter, 1st letter, 2nd-to-last, 2nd...
      let left = 0;
      let right = n - 1;
      let takeRight = true;

      while (left <= right) {
        if (takeRight) {
          result.push(chars[right]);
          right--;
        } else {
          result.push(chars[left]);
          left++;
        }
        takeRight = !takeRight;
      }
    } else {
      // Linear / Start-End: 1st letter, Last letter, 2nd letter, 2nd-to-last...
      let left = 0;
      let right = n - 1;
      let takeLeft = true;

      while (left <= right) {
        if (takeLeft) {
          result.push(chars[left]);
          left++;
        } else {
          result.push(chars[right]);
          right--;
        }
        takeLeft = !takeLeft;
      }
    }

    return result;
  };

  const handleGenerate = () => {
    const rawLetters = cleanArabicLetters(inputText);
    if (rawLetters.length === 0) return;

    const newSteps: TakseerStep[] = [];
    let currentLetters = [...rawLetters];

    // Initial Step 0
    newSteps.push({
      stepIndex: 0,
      letters: currentLetters,
      text: currentLetters.join(''),
      abjadValue: calculateAbjadValue(currentLetters.join(''))
    });

    // Run permute for maxSteps cycles
    for (let i = 1; i <= maxSteps; i++) {
      currentLetters = permuteLetters(currentLetters, algoMode);
      newSteps.push({
        stepIndex: i,
        letters: currentLetters,
        text: currentLetters.join(''),
        abjadValue: calculateAbjadValue(currentLetters.join(''))
      });

      // Stop if it loops back to original letters
      if (currentLetters.join('') === rawLetters.join('') && i > 1) {
        break;
      }
    }

    setSteps(newSteps);
  };

  React.useEffect(() => {
    handleGenerate();
  }, [inputText, algoMode, maxSteps]);

  const handleCopySingle = (text: string, id: string) => {
    if (!isPremium) {
      triggerProtectionModal('copy');
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    if (!isPremium) {
      triggerProtectionModal('copy');
      return;
    }
    const fullText = steps.map(s => `Cycle ${s.stepIndex}: ${s.letters.join(' - ')} (Abjad: ${s.abjadValue})`).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const rawChars = cleanArabicLetters(inputText);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-7 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <RefreshCw className="text-emerald-500 shrink-0" size={22} />
          <span>{t.title}</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Controls Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-900/60 p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-gray-700">
        {/* Input Text */}
        <div className="space-y-1.5 md:col-span-1">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
            {t.inputLabel}
          </label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-arabic text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            dir="rtl"
          />
        </div>

        {/* Algorithm Selection */}
        <div className="space-y-1.5 md:col-span-1">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {t.algorithmLabel}
          </label>
          <select
            value={algoMode}
            onChange={(e) => setAlgoMode(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="circular">{t.circularMode}</option>
            <option value="linear">{t.linearMode}</option>
          </select>
        </div>

        {/* Max Steps Slider */}
        <div className="space-y-1.5 md:col-span-1">
          <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
            <span>{t.stepsCount}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{maxSteps}</span>
          </div>
          <input
            type="range"
            min={2}
            max={16}
            value={maxSteps}
            onChange={(e) => setMaxSteps(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer mt-2"
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{t.presetTitle}</span>
        {[
          { text: 'حليم', label: t.preset1 },
          { text: 'القدوس', label: t.preset2 },
          { text: 'ودود', label: t.preset3 },
          { text: 'لطيف', label: t.preset4 }
        ].map(p => (
          <button
            key={p.text}
            onClick={() => setInputText(p.text)}
            className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 text-center">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">{t.originalText}</span>
          <p className="text-2xl font-arabic font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">{rawChars.join(' - ') || '—'}</p>
        </div>

        <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800/40 text-center">
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold uppercase">{t.lettersCount}</span>
          <p className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-300 mt-0.5">{rawChars.length}</p>
        </div>

        <div className="p-3.5 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800/40 text-center">
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold uppercase">{t.abjadTotal}</span>
          <p className="text-2xl font-bold font-mono text-purple-700 dark:text-purple-300 mt-0.5">{calculateAbjadValue(rawChars.join(''))}</p>
        </div>
      </div>

      {/* Steps Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <Layers size={16} className="text-emerald-500" /> {t.stepsTableTitle}
          </h3>
          <button
            onClick={handleCopyAll}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            {copiedId === 'all' ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedId === 'all' ? t.copied : t.copyAllBtn}</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="w-full text-left text-xs text-gray-700 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3 text-center">{t.stepCol}</th>
                <th className="px-4 py-3 text-right">{t.lettersCol}</th>
                <th className="px-4 py-3 text-center">{t.abjadCol}</th>
                <th className="px-4 py-3 text-center">{t.actionCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {steps.map((s) => (
                <tr
                  key={s.stepIndex}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    s.stepIndex === 0 ? 'bg-emerald-50/50 dark:bg-emerald-950/20 font-bold' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    #{s.stepIndex}
                  </td>
                  <td className="px-4 py-3 text-right font-arabic text-base sm:text-lg text-emerald-800 dark:text-emerald-300" dir="rtl">
                    <span className="tracking-widest">
                      {s.letters.join(' • ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-purple-600 dark:text-purple-300">
                    {s.abjadValue}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleCopySingle(s.letters.join(' - '), `step-${s.stepIndex}`)}
                      className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title={t.copyAllBtn}
                    >
                      {copiedId === `step-${s.stepIndex}` ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanatory Info Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 space-y-1.5">
        <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
          <HelpCircle size={15} className="text-emerald-500 shrink-0" /> {t.howItWorksTitle}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          {t.howItWorksDesc}
        </p>
      </div>
    </div>
  );
};
