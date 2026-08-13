import React, { useState, useMemo } from 'react';
import { ShieldCheck, Brain, Download, Info, Sparkles, RefreshCw } from 'lucide-react';
import { DiscretionTranslation } from './discretionTranslations';
import { calculateAbjadValue } from '../../utils/abjad';

interface HissnAqlTabProps {
  t: DiscretionTranslation;
}

export default function HissnAqlTab({ t }: HissnAqlTabProps) {
  const [userName, setUserName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [intentionText, setIntentionText] = useState('');
  const [gridSize, setGridSize] = useState<'3x3' | '4x4'>('3x3');

  // Abjad Calculations
  const calculations = useMemo(() => {
    const nameVal = calculateAbjadValue(userName.trim() || 'إبراهيم');
    const motherVal = calculateAbjadValue(motherName.trim() || 'آمنة');
    const totalN = nameVal + motherVal;

    // Elemental distribution for mental temperament
    const airVal = (totalN * 3) % 100 + 35;
    const waterVal = (totalN * 7) % 100 + 40;
    const earthVal = (totalN * 5) % 100 + 30;
    const fireVal = (totalN * 2) % 100 + 25;

    const elemSum = airVal + waterVal + earthVal + fireVal;
    const airPct = Math.round((airVal / elemSum) * 100);
    const waterPct = Math.round((waterVal / elemSum) * 100);
    const earthPct = Math.round((earthVal / elemSum) * 100);
    const firePct = Math.round((fireVal / elemSum) * 100);

    // Dominant element
    const maxVal = Math.max(airPct, waterPct, earthPct, firePct);
    let dominant = t.hissn.airClarity;
    if (maxVal === waterPct) dominant = t.hissn.waterCalm;
    else if (maxVal === earthPct) dominant = t.hissn.earthGrounding;
    else if (maxVal === firePct) dominant = t.hissn.fireFocus;

    // Clarity score & Shield level
    const clarityScore = Math.min(99, Math.max(60, Math.round(80 + (totalN % 20))));
    const shieldLevel = Math.min(100, Math.max(70, Math.round(75 + ((totalN * 13) % 25))));

    // Build 3x3 or 4x4 Grid
    let gridCells: number[][] = [];
    if (gridSize === '3x3') {
      // 3x3 Magic Square base formula for N
      const base = Math.max(1, Math.floor((totalN - 12) / 3));
      const r = (totalN - 12) % 3;

      // Ghazali 3x3 pattern with offset
      gridCells = [
        [base + 7, base, base + 5],
        [base + 2, base + 4 + r, base + 6],
        [base + 3, base + 8, base + 1]
      ];
    } else {
      // 4x4 Magic Square base formula
      const base = Math.max(1, Math.floor((totalN - 30) / 4));
      const r = (totalN - 30) % 4;

      gridCells = [
        [base + 15, base + 1, base + 2, base + 12 + r],
        [base + 4, base + 10, base + 9, base + 7],
        [base + 8, base + 6, base + 5, base + 11],
        [base + 3, base + 13, base + 14, base + 0]
      ];
    }

    return {
      nameVal,
      motherVal,
      totalN,
      airPct,
      waterPct,
      earthPct,
      firePct,
      dominant,
      clarityScore,
      shieldLevel,
      gridCells
    };
  }, [userName, motherName, gridSize, t]);

  // Recommended Awrad names
  const awradList = [
    { name: 'يا حفيظ (Yā Ḥafīẓ)', count: 119, benefit: 'Protection du mental contre la distraction' },
    { name: 'يا عليم (Yā ‘Alīm)', count: 150, benefit: 'Inspiration divine & clarté de pensée' },
    { name: 'يا سلام (Yā Salām)', count: 131, benefit: 'Apaisement profond de l’anxiété' },
    { name: 'يا مؤمن (Yā Mu’min)', count: 136, benefit: 'Sécurité psychologique contre le doute' }
  ];

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/40 shrink-0 mt-1">
            <Brain className="text-emerald-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-200">
              {t.hissn.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.hissn.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Input Form & Grid Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
                {t.hissn.nameLabel}
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={t.hissn.namePlaceholder}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
                {t.hissn.motherLabel}
              </label>
              <input
                type="text"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder={t.hissn.motherPlaceholder}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
                {t.hissn.intentionLabel}
              </label>
              <input
                type="text"
                value={intentionText}
                onChange={(e) => setIntentionText(e.target.value)}
                placeholder={t.hissn.intentionPlaceholder}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                {t.hissn.gridSizeLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGridSize('3x3')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    gridSize === '3x3'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent'
                  }`}
                >
                  {t.hissn.grid3x3}
                </button>
                <button
                  onClick={() => setGridSize('4x4')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    gridSize === '4x4'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent'
                  }`}
                >
                  {t.hissn.grid4x4}
                </button>
              </div>
            </div>

            {/* Results Summary Box */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-3 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck size={16} />
                <span>{t.hissn.resultsTitle}</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500 dark:text-slate-400 block">{t.hissn.totalAbjad}</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                    {calculations.totalN}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-slate-400 block">{t.hissn.clarityScore}</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                    {calculations.clarityScore}%
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-slate-400 block">{t.hissn.shieldIndex}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                    {calculations.shieldLevel} / 100
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-slate-400 block">{t.hissn.dominantElement}</span>
                  <span className="font-bold text-teal-600 dark:text-teal-300 text-xs">
                    {calculations.dominant}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Magic Stabilization Grid & Elemental Balance */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-950 text-white rounded-2xl p-6 shadow-2xl border border-emerald-500/30 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-emerald-300 flex items-center gap-2">
                <Sparkles size={18} />
                <span>{t.hissn.gridTitle}</span>
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase border border-emerald-500/30">
                {gridSize} Wafq
              </span>
            </div>

            {/* Grid Table Display */}
            <div className="flex justify-center py-2">
              <div
                className={`grid gap-2 sm:gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner max-w-[380px] w-full ${
                  gridSize === '3x3' ? 'grid-cols-3' : 'grid-cols-4'
                }`}
              >
                {calculations.gridCells.map((row, rIdx) =>
                  row.map((cellVal, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className="aspect-square flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-emerald-500/30 hover:border-emerald-400 transition-all text-center shadow-md group"
                    >
                      <span className="text-base sm:text-lg font-black text-amber-300 tracking-tight group-hover:scale-110 transition-transform">
                        {cellVal}
                      </span>
                      <span className="text-[9px] text-emerald-400/80 font-mono mt-0.5">
                        R{rIdx + 1}C{cIdx + 1}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Elemental Balance Bars */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {t.hissn.elementalBalanceTitle}
              </h4>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>{t.hissn.airClarity}</span>
                    <span className="font-bold text-indigo-400">{calculations.airPct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${calculations.airPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>{t.hissn.waterCalm}</span>
                    <span className="font-bold text-emerald-400">{calculations.waterPct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${calculations.waterPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>{t.hissn.earthGrounding}</span>
                    <span className="font-bold text-amber-400">{calculations.earthPct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${calculations.earthPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>{t.hissn.fireFocus}</span>
                    <span className="font-bold text-rose-400">{calculations.firePct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${calculations.firePct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Awrad al-Aql - Sustaining Invocations */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="text-amber-500" size={18} />
          <span>{t.hissn.awradTitle}</span>
        </h3>

        <p className="text-xs text-gray-600 dark:text-slate-400">
          {t.hissn.awradDesc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {awradList.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700/60 space-y-2 hover:border-emerald-500 transition-all"
            >
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block font-arabic">
                {item.name}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-bold inline-block">
                {item.count} fois
              </span>
              <p className="text-[11px] text-gray-600 dark:text-slate-300">
                {item.benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
