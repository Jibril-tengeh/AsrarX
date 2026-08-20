import React, { useState } from 'react';
import { Compass, Sparkles, Clock, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { calculateTasyirProgression } from '../../data/comparativeTraditionsData';

interface TasyirCalculatorTabProps {
  t: any;
  lang: 'fr' | 'en' | 'ha';
}

export const TasyirCalculatorTab: React.FC<TasyirCalculatorTabProps> = ({ t, lang }) => {
  const [natalDegree, setNatalDegree] = useState<number>(45); // e.g. 15° Taurus
  const [age, setAge] = useState<number>(33);

  const tasyir = calculateTasyirProgression(natalDegree, age);

  const getSignName = (sign: any) => {
    if (lang === 'ha') return sign.nameHa;
    if (lang === 'en') return sign.nameEn;
    return sign.nameFr;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/10 border border-indigo-500/20 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-500 border border-indigo-500/30">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {t.tasyir.title}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono">
                1° = 1 Année Solaire
              </span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {t.tasyir.subtitle}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 leading-relaxed bg-white/50 dark:bg-gray-800/50 p-3.5 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
          <Info className="inline w-4 h-4 mr-1 text-indigo-500" />
          {t.tasyir.tasyirExplanation}
        </p>
      </div>

      {/* Inputs Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t.tasyir.natalDegreeLabel}
            </label>
            <input
              type="number"
              min={0}
              max={359}
              value={natalDegree}
              onChange={(e) => setNatalDegree(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t.tasyir.ageLabel}
            </label>
            <input
              type="number"
              min={0}
              max={120}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* Progressed Result Card */}
      {tasyir && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50/70 to-slate-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900/60 border border-indigo-200 dark:border-indigo-500/30 shadow-md space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                {t.tasyir.progressedPoint}
              </span>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                {tasyir.degreeInSign}° {getSignName(tasyir.sign)}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 font-mono">
                Arc Total : {tasyir.progressedDegree}° (Cycle #{tasyir.symbolicCycle})
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-white/10 border border-indigo-100 dark:border-white/20 text-center sm:text-right font-mono text-xs text-indigo-700 dark:text-indigo-300 shadow-sm">
              <span className="font-bold">{t.tasyir.termRuler} : {tasyir.distributionRuler}</span>
              <div className="text-[10px] text-gray-600 dark:text-gray-300 mt-0.5 font-sans font-medium">
                Régent du Signe & Élément : {tasyir.sign.element}
              </div>
            </div>
          </div>

          {/* Status Note */}
          <div className="pt-4 border-t border-indigo-100 dark:border-white/10">
            {tasyir.isCritical ? (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                {t.tasyir.criticalDegreeWarning}
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                {t.tasyir.regularDegreeNote}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
