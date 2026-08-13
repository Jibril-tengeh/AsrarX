import React, { useState } from 'react';
import { Calculator, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';
import { ThiebissabaTranslation } from './thiebissabaTranslations';
import { MANDINGUE_FIGURES, MandingueFigure, calculateKadyo } from '../../utils/thiebissaba';

interface CalculateurKadyoTabProps {
  t: ThiebissabaTranslation;
  langKey: 'fr' | 'en' | 'ha';
}

export default function CalculateurKadyoTab({ t, langKey }: CalculateurKadyoTabProps) {
  const [so1Index, setSo1Index] = useState<number>(0);
  const [so2Index, setSo2Index] = useState<number>(1);
  const [so3Index, setSo3Index] = useState<number>(2);
  const [moduloMode, setModuloMode] = useState<12 | 16>(12);
  const [copied, setCopied] = useState(false);

  const f1 = MANDINGUE_FIGURES[so1Index];
  const f2 = MANDINGUE_FIGURES[so2Index];
  const f3 = MANDINGUE_FIGURES[so3Index];

  const result = calculateKadyo(f1, f2, f3, moduloMode);
  const verdictFig = result.verdictFigure;

  const getFigName = (fig: MandingueFigure) => {
    if (langKey === 'en') return fig.nameEn;
    if (langKey === 'ha') return fig.nameHa;
    return fig.nameFr;
  };

  const sentence = langKey === 'en' ? result.sentenceEn : langKey === 'ha' ? result.sentenceHa : result.sentenceFr;

  const handleCopy = () => {
    const report = `Calculateur Kadyo (Verdict Thiebissaba):\nSô 1: ${getFigName(f1)}\nSô 2: ${getFigName(f2)}\nSô 3: ${getFigName(f3)}\nModulo: ${moduloMode}\nVerdict Kadyo: ${getFigName(verdictFig)} (${verdictFig.code})\nSentence: ${sentence}`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-amber-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0 mt-1">
            <Calculator className="text-amber-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
              {t.kadyo.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.kadyo.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-6">
        {/* Modulo Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">
            {t.kadyo.moduloMode}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setModuloMode(12)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                moduloMode === 12
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300'
              }`}
            >
              {t.kadyo.mod12}
            </button>
            <button
              type="button"
              onClick={() => setModuloMode(16)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                moduloMode === 16
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300'
              }`}
            >
              {t.kadyo.mod16}
            </button>
          </div>
        </div>

        {/* House Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">
              Maison 1 (Sô 1 - N'Goro)
            </label>
            <select
              value={so1Index}
              onChange={(e) => setSo1Index(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
            >
              {MANDINGUE_FIGURES.map((fig, idx) => (
                <option key={fig.id} value={idx}>
                  {getFigName(fig)} ({fig.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">
              Maison 2 (Sô 2 - Nafolo)
            </label>
            <select
              value={so2Index}
              onChange={(e) => setSo2Index(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
            >
              {MANDINGUE_FIGURES.map((fig, idx) => (
                <option key={fig.id} value={idx}>
                  {getFigName(fig)} ({fig.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">
              Maison 3 (Sô 3 - Gueleya)
            </label>
            <select
              value={so3Index}
              onChange={(e) => setSo3Index(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
            >
              {MANDINGUE_FIGURES.map((fig, idx) => (
                <option key={fig.id} value={idx}>
                  {getFigName(fig)} ({fig.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Formula Display */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-mono">
          <p className="font-bold">{t.kadyo.formulaTitle}</p>
          <p className="mt-1">
            Kadyo = ({f1.code} + {f2.code} + {f3.code}) mod {moduloMode} = {result.sumValue} mod {moduloMode} = <strong>{getFigName(verdictFig)} ({verdictFig.code})</strong>
          </p>
        </div>
      </div>

      {/* Result Card */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-3 bg-amber-500/20 rounded-2xl border border-amber-500/40">{verdictFig.symbol}</span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                {t.kadyo.verdictResult}
              </span>
              <h3 className="text-2xl font-black text-amber-200">
                {getFigName(verdictFig)}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? t.copied : t.copyReport}</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              {t.kadyo.spiritualMeaning}
            </span>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-medium">
              « {sentence} »
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
            <p>
              <strong className="text-amber-300">{t.kadyo.favorableAction}:</strong> Procéder avec confiance mais veiller à s'acquitter de la charité (Saraka) correspondante avant le lever du soleil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
