import React, { useState } from 'react';
import { Sparkles, Calendar, Heart, Shield, Compass, Layers, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { calculateChineseAstrology } from '../../data/comparativeTraditionsData';

interface ChineseAstrologyTabProps {
  t: any;
  lang: 'fr' | 'en' | 'ha';
}

export const ChineseAstrologyTab: React.FC<ChineseAstrologyTabProps> = ({ t, lang }) => {
  const [year, setYear] = useState(1996);
  const [month, setMonth] = useState(8);
  const [day, setDay] = useState(15);

  const result = calculateChineseAstrology(year, month, day);

  const getAnimalName = (animal: any) => {
    if (lang === 'ha') return animal.nameHa;
    if (lang === 'en') return animal.nameEn;
    return animal.nameFr;
  };

  const getElementName = (el: any) => {
    if (lang === 'ha') return el.nameHa;
    if (lang === 'en') return el.nameEn;
    return el.nameFr;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-red-500/10 via-amber-500/5 to-rose-500/10 border border-red-500/20 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-red-500/20 text-red-500 border border-red-500/30">
            <span className="text-2xl">🐉</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {t.chinese.title}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 font-mono">
                Wu Xing 60 Years
              </span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {t.chinese.subtitle}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 leading-relaxed bg-white/50 dark:bg-gray-800/50 p-3.5 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
          <Info className="inline w-4 h-4 mr-1 text-red-500" />
          {t.chinese.wuXingExplanation}
        </p>
      </div>

      {/* Input Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t.chinese.yearLabel}
            </label>
            <input
              type="number"
              min={1900}
              max={2100}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t.chinese.monthLabel}
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t.chinese.dayLabel}
            </label>
            <input
              type="number"
              min={1}
              max={31}
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* Main Animal & Element Card */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-red-50 via-rose-50/70 to-amber-50/50 dark:from-red-950/40 dark:via-rose-950/30 dark:to-gray-900/60 border border-red-200 dark:border-red-500/30 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
                {t.chinese.animalCard}
              </span>
              <span className="text-3xl">{result.animal.icon}</span>
            </div>

            <div>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                {getAnimalName(result.animal)}
                <span className="text-2xl font-serif text-red-600 dark:text-red-400 font-normal">
                  {result.animal.char}
                </span>
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 font-mono">
                {t.chinese.branchStem}: {result.animal.branch} • {result.element.stem}
              </p>
            </div>

            <div className="pt-3 border-t border-red-100 dark:border-white/10 text-xs space-y-2 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t.chinese.cycleNumber}:</span>
                <span className="font-mono font-bold text-red-600 dark:text-red-400">{result.cycleIndex} / 60</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Élément de base & Polarité:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{result.animal.elementFr} ({result.animal.polarity})</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                {t.chinese.elementCard}
              </span>
              <span
                className="w-3.5 h-3.5 rounded-full shadow-sm"
                style={{ backgroundColor: result.element.color }}
              />
            </div>

            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getElementName(result.element)} {result.yinYang}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Année Céleste {result.effectiveYear} selon le calendrier luni-solaire
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-700 text-xs space-y-2 text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Couleur associée:</span>
                <span className="font-medium" style={{ color: result.element.color }}>
                  {result.element.nameFr} Vibratoire
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rythme énergétique:</span>
                <span className="font-mono">{result.yinYang === 'Yang' ? 'Actif, Émissif, Dynamique' : 'Introspectif, Réceptif, Profond'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
