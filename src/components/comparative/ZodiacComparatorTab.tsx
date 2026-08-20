import React, { useState } from 'react';
import { Compass, Sparkles, Sun, Moon, Info, Shield, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { getComparativeZodiacInfo } from '../../data/comparativeTraditionsData';

interface ZodiacComparatorTabProps {
  t: any;
  lang: 'fr' | 'en' | 'ha';
}

export const ZodiacComparatorTab: React.FC<ZodiacComparatorTabProps> = ({ t, lang }) => {
  const [birthDate, setBirthDate] = useState('1992-08-17');

  const comparison = getComparativeZodiacInfo(birthDate);

  const getSignName = (tropical: any) => {
    if (lang === 'ha') return tropical.signHa;
    if (lang === 'en') return tropical.signEn;
    return tropical.signFr;
  };

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
      <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 border border-cyan-500/20 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-500 border border-cyan-500/30">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {t.zodiacs.title}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono">
                4 Systems
              </span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {t.zodiacs.subtitle}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 leading-relaxed bg-white/50 dark:bg-gray-800/50 p-3.5 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
          <Info className="inline w-4 h-4 mr-1 text-cyan-500" />
          {t.zodiacs.offsetNotice}
        </p>
      </div>

      {/* Date Picker */}
      <div className="p-5 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex-1">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {t.zodiacs.birthDateLabel}
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* 4 Systems Comparison Cards */}
      {comparison && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Tropical Zodiac */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white dark:to-gray-800/90 border border-amber-500/30 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sun className="w-4 h-4" />
                {t.zodiacs.tropicalTitle}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-semibold">
                Saisonnier
              </span>
            </div>

            <div>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                {getSignName(comparison.tropical)}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5 font-mono">
                {comparison.tropical.startD}/{comparison.tropical.startM} — {comparison.tropical.endD}/{comparison.tropical.endM}
              </p>
            </div>

            <div className="space-y-2 text-xs border-t border-amber-200/50 dark:border-gray-700 pt-3 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t.zodiacs.element}:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{comparison.tropical.element}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t.zodiacs.ruler}:</span>
                <span className="font-semibold text-amber-700 dark:text-amber-400">{comparison.tropical.ruler}</span>
              </div>
            </div>
          </motion.div>

          {/* 2. Sidereal / Vedic Zodiac */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-white dark:to-gray-800/90 border border-indigo-500/30 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                {t.zodiacs.siderealTitle}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono font-semibold">
                Lahiri Ayanamsha
              </span>
            </div>

            <div>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                {comparison.nakshatra.zodiacSign}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
                Position exacte : {comparison.siderealDeg}° du Zodiaque Fixe
              </p>
            </div>

            <div className="space-y-2 text-xs border-t border-indigo-200/50 dark:border-gray-700 pt-3 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t.zodiacs.element}:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{comparison.nakshatra.element}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t.zodiacs.ruler}:</span>
                <span className="font-semibold text-indigo-700 dark:text-indigo-400">{comparison.nakshatra.ruler}</span>
              </div>
            </div>
          </motion.div>

          {/* 3. Chinese Zodiac */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-red-500/10 via-rose-500/5 to-white dark:to-gray-800/90 border border-red-500/30 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="text-base">{comparison.chinese.animal.icon}</span>
                {t.zodiacs.chineseTitle}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-700 dark:text-red-300 font-mono font-semibold">
                Wu Xing
              </span>
            </div>

            <div>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                {getAnimalName(comparison.chinese.animal)}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 font-mono">({comparison.chinese.animal.char})</span>
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
                {getElementName(comparison.chinese.element)} {comparison.chinese.yinYang} • Année {comparison.chinese.effectiveYear}
              </p>
            </div>

            <div className="space-y-2 text-xs border-t border-red-200/50 dark:border-gray-700 pt-3 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Branche Terrestre:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{comparison.chinese.animal.branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tronc Céleste:</span>
                <span className="font-semibold text-red-700 dark:text-red-400">{comparison.chinese.element.stem}</span>
              </div>
            </div>
          </motion.div>

          {/* 4. Vedic Nakshatra */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white dark:to-gray-800/90 border border-emerald-500/30 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Moon className="w-4 h-4" />
                {t.zodiacs.nakshatraTitle}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-semibold">
                #{comparison.nakshatra.id} / 27
              </span>
            </div>

            <div>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                {comparison.nakshatra.name}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 font-serif">({comparison.nakshatra.sanskrit})</span>
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
                Demeure Arabe : {comparison.nakshatra.arabicManzilName}
              </p>
            </div>

            <div className="space-y-2 text-xs border-t border-emerald-200/50 dark:border-gray-700 pt-3 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Divinité:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{comparison.nakshatra.deity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Mantra:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{comparison.nakshatra.bijaMantra}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
