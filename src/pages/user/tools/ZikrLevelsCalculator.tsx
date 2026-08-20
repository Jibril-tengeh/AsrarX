import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Sparkles, Activity, Check, Feather } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { calculateAbjadValue } from '../../../utils/abjad';
import { ParchmentExporterModal } from '../../../components/ParchmentExporterModal';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { RitualDhikrCalculator } from '../../../components/RitualDhikrCalculator';

export const ZikrLevelsCalculator: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('يا لطيف');
  const [showParchment, setShowParchment] = useState(false);

  // Clean letters count (excluding spaces)
  const lettersOnly = inputText.replace(/[\s\u064B-\u065F]/g, '');
  const letterCount = lettersOnly.length;

  const wasatVal = calculateAbjadValue(inputText);
  const kabirVal = wasatVal * letterCount;

  // Digital root (Al-Saghir)
  const getDigitalRoot = (num: number): number => {
    if (num <= 0) return 0;
    let sum = num;
    while (sum >= 10) {
      sum = sum
        .toString()
        .split('')
        .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return sum;
  };

  const saghirVal = getDigitalRoot(wasatVal);

  const handleSendToTasbih = (count: number) => {
    localStorage.setItem('asrarhub_custom_tasbih_target', String(count));
    localStorage.setItem('asrarhub_custom_tasbih_title', inputText);
    navigate('/tools/tasbih');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Calculateur des 3 Niveaux de Zikr</span>
            <Calculator className="w-6 h-6 text-indigo-500" />
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            {language === 'fr'
              ? 'Déterminez les 3 régimes d\'incantation : Al-Kabīr, Al-Wasaṭ et Al-Ṣaghīr'
              : language === 'ha'
              ? 'Mawakan Hisabi 3 na Zikiri: Al-Kabir, Al-Wasat da Al-Saghir'
              : 'Calculate the 3 Incantation Modes: Al-Kabir, Al-Wasat & Al-Saghir'}
          </p>
        </div>
        <ToolInfoTooltip toolId="zikr-levels" />
      </div>

      {/* Input Box */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm mb-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {language === 'fr'
              ? 'Nom Divin, Verset ou Intention (en arabe)'
              : language === 'ha'
              ? 'Sunan Allah, Aya ko Niyya (da Larabci)'
              : 'Divine Name, Verse or Intention (in Arabic)'}
          </label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-serif text-xl text-right focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Ex: يا لطيف"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 flex justify-between">
            <span className="text-gray-500">
              {language === 'fr' ? 'Nombre de Lettres (Hurūf):' : language === 'ha' ? 'Yawan Haruffa (Huruf):' : 'Letter Count (Hurūf):'}
            </span>
            <span className="font-bold text-gray-900 dark:text-white font-mono">{letterCount}</span>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 flex justify-between">
            <span className="text-gray-500">
              {language === 'fr' ? 'Poids Zimām (Adad):' : language === 'ha' ? 'Nauyin Zimam (Adad):' : 'Zimam Weight (Adad):'}
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{wasatVal}</span>
          </div>
        </div>
      </div>

      {/* 3 Levels Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Level 1: Al-Kabīr */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-purple-200 dark:border-purple-800/40 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 uppercase tracking-widest">
              Al-Kabīr (الكبير)
            </span>
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono mt-3">
              {kabirVal}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
              {language === 'fr' ? (
                <><strong>Grand Mode Multiplicatif</strong> ({wasatVal} × {letterCount} lettres). Recommandé pour les grands besoins et intentions majeures.</>
              ) : language === 'ha' ? (
                <><strong>Babban Tsarin Ninkawa</strong> ({wasatVal} × haruffa {letterCount}). Don manyan bukatun ruhi da nasara.</>
              ) : (
                <><strong>Grand Multiplicative Mode</strong> ({wasatVal} × {letterCount} letters). Recommended for major needs and high intentions.</>
              )}
            </p>
          </div>
          <button
            onClick={() => handleSendToTasbih(kabirVal)}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>
              {language === 'fr' ? `Lancer sur Tasbih (${kabirVal})` : language === 'ha' ? `Aika zuwa Carbi (${kabirVal})` : `Launch on Tasbih (${kabirVal})`}
            </span>
          </button>
        </div>

        {/* Level 2: Al-Wasaṭ */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-indigo-200 dark:border-indigo-800/40 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
              Al-Wasaṭ (الوسط)
            </span>
            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-3">
              {wasatVal}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
              {language === 'fr' ? (
                <><strong>Mode Standard Intermédiaire</strong> (Valeur Abjad directe). Équilibre parfait pour la pratique hebdomadaire.</>
              ) : language === 'ha' ? (
                <><strong>Tsarin Tsaka-tsaki</strong> (Lissafin Abjad kai tsaye). Daidaito don aikin mako.</>
              ) : (
                <><strong>Standard Intermediate Mode</strong> (Direct Abjad value). Perfect balance for weekly practice.</>
              )}
            </p>
          </div>
          <button
            onClick={() => handleSendToTasbih(wasatVal)}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>
              {language === 'fr' ? `Lancer sur Tasbih (${wasatVal})` : language === 'ha' ? `Aika zuwa Carbi (${wasatVal})` : `Launch on Tasbih (${wasatVal})`}
            </span>
          </button>
        </div>

        {/* Level 3: Al-Ṣaghīr */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-800/40 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">
              Al-Ṣaghīr (الصغير)
            </span>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-3">
              {saghirVal}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
              {language === 'fr' ? (
                <><strong>Mode Réduit / Racine Spirituelle</strong> (Somme numérique unique). Idéal pour le zikr quotidien rapide après la prière.</>
              ) : language === 'ha' ? (
                <><strong>Gajeren Tsari / Tushen Ruhi</strong> (Hadakar lambobi guda). Don gajeren zikiri bayan kowace sallah.</>
              ) : (
                <><strong>Reduced Mode / Spiritual Root</strong> (Single-digit digital root). Ideal for quick daily dhikr after prayer.</>
              )}
            </p>
          </div>
          <button
            onClick={() => handleSendToTasbih(saghirVal)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>
              {language === 'fr' ? `Lancer sur Tasbih (${saghirVal})` : language === 'ha' ? `Aika zuwa Carbi (${saghirVal})` : `Launch on Tasbih (${saghirVal})`}
            </span>
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowParchment(true)}
        className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all mb-8"
      >
        <Feather className="w-4 h-4" />
        <span>
          {language === 'fr'
            ? 'Exporter la Fiche de Zikr en Parchemin'
            : language === 'ha'
            ? 'Fitar da Takardar Zikiri a Parchemin'
            : 'Export Zikr Sheet to Parchment'}
        </span>
      </button>

      <RitualDhikrCalculator />

      <ParchmentExporterModal
        isOpen={showParchment}
        onClose={() => setShowParchment(false)}
        title={
          language === 'fr'
            ? `Régime de Zikr — ${inputText}`
            : language === 'ha'
            ? `Tsarin Zikiri — ${inputText}`
            : `Zikr Regime — ${inputText}`
        }
        subtitle={
          language === 'fr'
            ? 'Calcul des 3 Niveaux Théurgiques (Al-Kabīr, Al-Wasaṭ, Al-Ṣaghīr)'
            : language === 'ha'
            ? 'Lissafin Matakai 3 na Zikiri (Al-Kabīr, Al-Wasaṭ, Al-Ṣaghīr)'
            : 'Calculation of 3 Theurgic Levels (Al-Kabīr, Al-Wasaṭ, Al-Ṣaghīr)'
        }
        abjadWeight={wasatVal}
        content={
          <div className="space-y-4 text-center">
            <p className="text-3xl font-serif text-amber-950 font-bold">{inputText}</p>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs text-amber-950 bg-amber-200/50 p-3 rounded-xl border border-amber-600/30">
              <div>Al-Kabīr: <strong>{kabirVal}</strong></div>
              <div>Al-Wasaṭ: <strong>{wasatVal}</strong></div>
              <div>Al-Ṣaghīr: <strong>{saghirVal}</strong></div>
            </div>
          </div>
        }
      />
    </div>
  );
};
