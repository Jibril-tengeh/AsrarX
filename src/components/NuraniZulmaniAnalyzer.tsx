import React, { useState } from 'react';
import { Sun, Moon, Sparkles, Filter, ShieldAlert, BarChart2, Check, Copy } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { triggerProtectionModal } from './ContentProtectionManager';
import { calculateAbjadValue } from '../utils/abjad';
import { FULL_28_LETTERS_DATA, LetterInfo } from '../pages/user/tools/ScienceOfLetters';

export const LUMINOUS_LETTERS = ['أ', 'ا', 'ح', 'ه', 'هـ', 'ك', 'م', 'ص', 'ر', 'س', 'ط', 'ي', 'ق', 'ل', 'ن', 'ع'];
export const DARK_LETTERS = ['ب', 'ت', 'ث', 'ج', 'خ', 'د', 'ذ', 'ز', 'ش', 'ض', 'ظ', 'غ', 'ف', 'و'];

const translations = {
  fr: {
    title: "Lettres Lumineuses & Sombres (Nuraniyyah & Zulmaniyyah)",
    subtitle: "Analyse et séparation des 14 consonnes lumineuses coraniques et 14 consonnes sombres dans un texte",
    inputLabel: "Texte ou Formule Coranique :",
    inputPlaceholder: "Entrez un mot, nom ou verset (ex: كهيعص ou يس)...",
    muqattaatLabel: "Séquences Coraniques Disjointes (Huruf Muqatta'at) :",
    luminousTitle: "14 Lettres Lumineuses (Al-Huruf al-Nuraniyyah)",
    luminousSubtitle: "Mnémonique: « نص حكيم قاطع له سر » (Un texte sage et tranchant détient son secret)",
    darkTitle: "14 Lettres Sombres (Al-Huruf al-Zulmaniyyah)",
    darkSubtitle: "Lettres liées aux manifestations terrestres, enveloppes et réceptacles matériel",
    foundCount: "Lettres trouvées :",
    abjadVal: "Valeur Abjad :",
    percentage: "Proportion :",
    isolatedLetters: "Lettres Isolées :",
    breakdownTitle: "Analyse Détaillée par Lettre",
    charCol: "Lettre",
    natureCol: "Nature",
    elementCol: "Élément",
    abjadCol: "Abjad",
    copyAnalysisBtn: "Copier le rapport d'analyse",
    copied: "Copié !",
  },
  en: {
    title: "Luminous & Dark Letters (Nuraniyyah & Zulmaniyyah)",
    subtitle: "Analysis and isolation of the 14 Quranic luminous consonants and 14 dark consonants in any text",
    inputLabel: "Text or Quranic Formula:",
    inputPlaceholder: "Enter a word, name or verse (e.g., كهيعص or يس)...",
    muqattaatLabel: "Disjointed Quranic Letters (Huruf Muqatta'at):",
    luminousTitle: "14 Luminous Letters (Al-Huruf al-Nuraniyyah)",
    luminousSubtitle: "Mnemonic: « نص حكيم قاطع له سر » (A wise, decisive text holds its secret)",
    darkTitle: "14 Dark Letters (Al-Huruf al-Zulmaniyyah)",
    darkSubtitle: "Letters associated with terrestrial manifestations and physical receptacles",
    foundCount: "Letters Found:",
    abjadVal: "Abjad Value:",
    percentage: "Proportion:",
    isolatedLetters: "Isolated Letters:",
    breakdownTitle: "Detailed Letter Breakdown",
    charCol: "Letter",
    natureCol: "Nature",
    elementCol: "Abjad",
    abjadCol: "Abjad",
    copyAnalysisBtn: "Copy Analysis Report",
    copied: "Copied!",
  },
  ha: {
    title: "Haruffan Haske & Duhu (Nuraniyyah & Zulmaniyyah)",
    subtitle: "Rabe da lissafin haruffan Haske 14 da haruffan Duhu 14 na Alqur'ani a cikin rubutu",
    inputLabel: "Rubutu ko Ayar Alqur'ani:",
    inputPlaceholder: "Shigar da suna ko aya (misali: كهيعص ko يس)...",
    muqattaatLabel: "Haruffan Muqatta'at na Alqur'ani:",
    luminousTitle: "Haruffan Haske 14 (Al-Huruf al-Nuraniyyah)",
    luminousSubtitle: "Mnemonic: « نص حكيم قاطع له سر »",
    darkTitle: "Haruffan Duhu 14 (Al-Huruf al-Zulmaniyyah)",
    darkSubtitle: "Haruffa masu alaƙa da abubuwan duniya da jiki",
    foundCount: "Haruffan da Aka Samu:",
    abjadVal: "Lissafin Abjad:",
    percentage: "Rabo %:",
    isolatedLetters: "Haruffan da Kuka Raba:",
    breakdownTitle: "Rarrabawar Haruffa Daki-daki",
    charCol: "Harafi",
    natureCol: "Yanayi",
    elementCol: "Mazauni",
    abjadCol: "Abjad",
    copyAnalysisBtn: "Kwafa Rahoton Bincike",
    copied: "An Kwafa!",
  }
};

const QURANIC_PRESETS = [
  'كهيعص', 'الم', 'يس', 'طه', 'حم', 'حمعسق', 'المر', 'الر', 'طسم', 'طس', 'ص', 'ق', 'ن'
];

export const NuraniZulmaniAnalyzer: React.FC = () => {
  const { language } = useLanguage();
  const { isPremium } = useAuth();
  const t = translations[(language as 'fr' | 'en' | 'ha') || 'fr'] || translations.fr;

  const [inputText, setInputText] = useState('كهيعص');
  const [copied, setCopied] = useState(false);

  // Clean letters
  const cleanStr = inputText.replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED\s]/g, '');
  const chars = Array.from(cleanStr);

  const luminousFound: string[] = [];
  const darkFound: string[] = [];

  chars.forEach(ch => {
    if (['ا', 'أ', 'إ', 'آ', 'ح', 'ه', 'هـ', 'ك', 'م', 'ص', 'ر', 'س', 'ط', 'ي', 'ق', 'ل', 'ن', 'ع'].includes(ch)) {
      luminousFound.push(ch);
    } else if (['ب', 'ت', 'ث', 'ج', 'خ', 'د', 'ذ', 'ز', 'ش', 'ض', 'ظ', 'غ', 'ف', 'و'].includes(ch)) {
      darkFound.push(ch);
    }
  });

  const luminousAbjad = calculateAbjadValue(luminousFound.join(''));
  const darkAbjad = calculateAbjadValue(darkFound.join(''));
  const totalAbjad = luminousAbjad + darkAbjad;

  const totalChars = chars.length || 1;
  const luminousPct = Math.round((luminousFound.length / totalChars) * 100);
  const darkPct = Math.round((darkFound.length / totalChars) * 100);

  const handleCopyReport = () => {
    if (!isPremium) {
      triggerProtectionModal('copy');
      return;
    }
    const report = `=== ${t.title} ===
Texte: ${inputText}
- Lettres Lumineuses (${luminousFound.length}): ${luminousFound.join(' ')} (Abjad: ${luminousAbjad}, ${luminousPct}%)
- Lettres Sombres (${darkFound.length}): ${darkFound.join(' ')} (Abjad: ${darkAbjad}, ${darkPct}%)
Total Abjad: ${totalAbjad}`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-7 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sun className="text-amber-500 shrink-0" size={22} />
          <span>{t.title}</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Input controls */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
          {t.inputLabel}
        </label>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-2xl text-lg font-arabic text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            dir="rtl"
          />
          <button
            onClick={handleCopyReport}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shrink-0 transition-colors cursor-pointer"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? t.copied : t.copyAnalysisBtn}</span>
          </button>
        </div>

        {/* Quranic Disjointed Presets */}
        <div className="pt-2">
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400 block mb-1.5">{t.muqattaatLabel}</span>
          <div className="flex flex-wrap gap-1.5">
            {QURANIC_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setInputText(p)}
                className={`px-3 py-1 rounded-xl text-xs font-arabic font-bold transition-all cursor-pointer ${
                  inputText === p
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side-by-side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lumineuses Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <h3 className="font-extrabold text-amber-800 dark:text-amber-300 text-base flex items-center gap-2">
              <Sun size={20} className="text-amber-500 shrink-0" />
              <span>{t.luminousTitle}</span>
            </h3>
            <span className="text-xs font-bold font-mono px-2.5 py-1 bg-amber-500 text-white rounded-full">
              {luminousFound.length} {t.foundCount}
            </span>
          </div>

          <p className="text-[11px] text-amber-700 dark:text-amber-300/80 italic leading-relaxed">
            {t.luminousSubtitle}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-amber-200 dark:border-amber-900/50">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block">{t.abjadVal}</span>
              <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">{luminousAbjad}</span>
            </div>
            <div className="p-2.5 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-amber-200 dark:border-amber-900/50">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block">{t.percentage}</span>
              <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">{luminousPct}%</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block mb-1.5">{t.isolatedLetters}</span>
            <div className="flex flex-wrap gap-1.5 font-arabic text-lg" dir="rtl">
              {luminousFound.length > 0 ? (
                luminousFound.map((ch, idx) => (
                  <span key={idx} className="w-8 h-8 flex items-center justify-center bg-amber-500 text-white rounded-lg shadow-sm font-bold">
                    {ch}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400 italic font-sans">—</span>
              )}
            </div>
          </div>
        </div>

        {/* Sombres Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-2 border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-800/50 pb-3">
            <h3 className="font-extrabold text-indigo-200 text-base flex items-center gap-2">
              <Moon size={20} className="text-indigo-400 shrink-0" />
              <span>{t.darkTitle}</span>
            </h3>
            <span className="text-xs font-bold font-mono px-2.5 py-1 bg-indigo-600 text-white rounded-full">
              {darkFound.length} {t.foundCount}
            </span>
          </div>

          <p className="text-[11px] text-indigo-300/80 italic leading-relaxed">
            {t.darkSubtitle}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-900 dark:text-white">
            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-indigo-800/50">
              <span className="text-[10px] text-indigo-300/70 block">{t.abjadVal}</span>
              <span className="text-xl font-bold font-mono text-indigo-300">{darkAbjad}</span>
            </div>
            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-indigo-800/50">
              <span className="text-[10px] text-indigo-300/70 block">{t.percentage}</span>
              <span className="text-xl font-bold font-mono text-indigo-300">{darkPct}%</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-indigo-200 block mb-1.5">{t.isolatedLetters}</span>
            <div className="flex flex-wrap gap-1.5 font-arabic text-lg" dir="rtl">
              {darkFound.length > 0 ? (
                darkFound.map((ch, idx) => (
                  <span key={idx} className="w-8 h-8 flex items-center justify-center bg-indigo-700 text-white rounded-lg shadow-sm font-bold">
                    {ch}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500 italic font-sans">—</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Energy Balance Ratio Bar */}
      <div className="space-y-1.5 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Sun size={14} /> Lumineuses: {luminousPct}%
          </span>
          <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <Moon size={14} /> Sombres: {darkPct}%
          </span>
        </div>
        <div className="h-3 w-full bg-indigo-950 rounded-full overflow-hidden flex">
          <div style={{ width: `${luminousPct}%` }} className="bg-gradient-to-r from-amber-400 to-amber-500 h-full transition-all duration-500" />
          <div style={{ width: `${darkPct}%` }} className="bg-gradient-to-r from-indigo-600 to-slate-800 h-full transition-all duration-500" />
        </div>
      </div>

      {/* Individual Breakdown Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
          <BarChart2 size={16} className="text-amber-500" /> {t.breakdownTitle}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
          {chars.map((ch, idx) => {
            const letterInfo = FULL_28_LETTERS_DATA.find(l => l.char === ch);
            const isLum = ['ا', 'أ', 'إ', 'آ', 'ح', 'ه', 'هـ', 'ك', 'م', 'ص', 'ر', 'س', 'ط', 'ي', 'ق', 'ل', 'ن', 'ع'].includes(ch);
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex flex-col justify-between ${
                  isLum
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
                    : 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/40'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-2xl font-arabic font-bold text-gray-900 dark:text-white">{ch}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    isLum ? 'bg-amber-400 text-amber-950' : 'bg-indigo-600 text-white'
                  }`}>
                    {isLum ? 'Nurani' : 'Zulmani'}
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-gray-600 dark:text-gray-300 font-mono flex justify-between">
                  <span>{letterInfo?.name || ch}</span>
                  <span className="font-bold">{calculateAbjadValue(ch)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
