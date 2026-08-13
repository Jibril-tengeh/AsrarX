import React, { useState } from 'react';
import { Compass, ArrowUpRight, ArrowDownRight, Equal, Sparkles, Shield } from 'lucide-react';
import { ThiebissabaTranslation } from './thiebissabaTranslations';
import { calculateKounWaSen } from '../../utils/thiebissaba';

interface KounWaSenTabProps {
  t: ThiebissabaTranslation;
  langKey: 'fr' | 'en' | 'ha';
}

export default function KounWaSenTab({ t, langKey }: KounWaSenTabProps) {
  const [row1Parity, setRow1Parity] = useState<1 | 2>(1); // 1 = Tek, 2 = Gnan
  const [row3Parity, setRow3Parity] = useState<1 | 2>(2);

  const kounResult = calculateKounWaSen(row1Parity, row3Parity);

  const desc = langKey === 'en' ? kounResult.descriptionEn : langKey === 'ha' ? kounResult.descriptionHa : kounResult.descriptionFr;

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-amber-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0 mt-1">
            <Compass className="text-amber-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
              {t.kounWaSen.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.kounWaSen.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Selectors */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Row 1 (Koun) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">
              {t.kounWaSen.headLabel}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRow1Parity(1)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  row1Parity === 1
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300'
                }`}
              >
                1 Point (Tek - Impair)
              </button>
              <button
                type="button"
                onClick={() => setRow1Parity(2)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  row1Parity === 2
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300'
                }`}
              >
                2 Points (Gnan - Pair)
              </button>
            </div>
          </div>

          {/* Row 3 (Sen) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">
              {t.kounWaSen.footLabel}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRow3Parity(1)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  row3Parity === 1
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300'
                }`}
              >
                1 Point (Tek - Impair)
              </button>
              <button
                type="button"
                onClick={() => setRow3Parity(2)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  row3Parity === 2
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300'
                }`}
              >
                2 Points (Gnan - Pair)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Energy Direction Result */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
          <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/40 text-amber-400">
            {kounResult.type === 'ascending' && <ArrowUpRight size={32} />}
            {kounResult.type === 'descending' && <ArrowDownRight size={32} />}
            {kounResult.type === 'balanced' && <Equal size={32} />}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              {t.kounWaSen.energyDirection}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-amber-200">
              {kounResult.type === 'ascending' && t.kounWaSen.ascending}
              {kounResult.type === 'descending' && t.kounWaSen.descending}
              {kounResult.type === 'balanced' && t.kounWaSen.balanced}
            </h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {desc}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block flex items-center gap-2">
            <Shield size={16} />
            <span>Recommandation de Rééquilibrage</span>
          </span>
          <p className="text-xs text-amber-100/90 leading-relaxed">
            Pour maintenir ce flux au plus haut degré de bénéfice, il est recommandé de porter un talisman sur soi ou de réciter la formule de scellement de Kouroukan.
          </p>
        </div>
      </div>
    </div>
  );
}
