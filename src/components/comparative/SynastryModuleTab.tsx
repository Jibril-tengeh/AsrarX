import React, { useState, useMemo } from 'react';
import { Heart, Sparkles, User, Users, Compass, Star, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getComparativeZodiacInfo } from '../../data/comparativeTraditionsData';

interface SynastryModuleTabProps {
  t: any;
  lang: 'fr' | 'en' | 'ha';
}

export const SynastryModuleTab: React.FC<SynastryModuleTabProps> = ({ t, lang }) => {
  const [nameA, setNameA] = useState('Zayd');
  const [birthDateA, setBirthDateA] = useState('1992-04-12');
  const [nameB, setNameB] = useState('Maryam');
  const [birthDateB, setBirthDateB] = useState('1994-11-23');

  const synastryResult = useMemo(() => {
    const chartA = getComparativeZodiacInfo(birthDateA);
    const chartB = getComparativeZodiacInfo(birthDateB);

    if (!chartA || !chartB) return null;

    // Calculate angular distance
    const degA = parseFloat(chartA.siderealDeg);
    const degB = parseFloat(chartB.siderealDeg);
    const degDiff = Math.abs(degA - degB) % 360;
    const aspectDiff = degDiff > 180 ? 360 - degDiff : degDiff;

    // Determine major aspect
    let aspectType = 'Neutre';
    let aspectName = 'Aspect Modéré';
    let harmonyBonus = 70;

    if (aspectDiff <= 10) {
      aspectType = 'Conjunction';
      aspectName = t.synastry.conjunction;
      harmonyBonus = 88;
    } else if (Math.abs(aspectDiff - 120) <= 8) {
      aspectType = 'Trine';
      aspectName = t.synastry.trine;
      harmonyBonus = 95;
    } else if (Math.abs(aspectDiff - 60) <= 6) {
      aspectType = 'Sextile';
      aspectName = t.synastry.sextile;
      harmonyBonus = 85;
    } else if (Math.abs(aspectDiff - 90) <= 7) {
      aspectType = 'Square';
      aspectName = t.synastry.square;
      harmonyBonus = 65;
    } else if (Math.abs(aspectDiff - 180) <= 8) {
      aspectType = 'Opposition';
      aspectName = t.synastry.opposition;
      harmonyBonus = 75;
    }

    const emotional = Math.min(98, Math.max(55, harmonyBonus + (chartA.tropical.element === chartB.tropical.element ? 10 : 0)));
    const intellectual = Math.min(96, Math.max(50, 78 + (chartA.chinese.effectiveYear % 2 === chartB.chinese.effectiveYear % 2 ? 8 : -4)));
    const spiritual = Math.min(99, Math.max(60, Math.round((emotional + intellectual) / 2 + 5)));
    const globalScore = Math.round((emotional + intellectual + spiritual) / 3);

    return {
      chartA,
      chartB,
      aspectDiff,
      aspectName,
      emotional,
      intellectual,
      spiritual,
      globalScore
    };
  }, [birthDateA, birthDateB, t]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-500/10 via-purple-500/5 to-amber-500/10 border border-rose-500/20 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/30">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {t.synastry.title}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 font-mono">
                Dual Synastry
              </span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {t.synastry.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Dual Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Person A */}
        <div className="p-5 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
          <h4 className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
            <User className="w-4 h-4" />
            {t.synastry.personA}
          </h4>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t.synastry.nameLabel}
            </label>
            <input
              type="text"
              value={nameA}
              onChange={(e) => setNameA(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t.synastry.birthDate}
            </label>
            <input
              type="date"
              value={birthDateA}
              onChange={(e) => setBirthDateA(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white font-mono"
            />
          </div>
        </div>

        {/* Person B */}
        <div className="p-5 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
          <h4 className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest flex items-center gap-2">
            <User className="w-4 h-4" />
            {t.synastry.personB}
          </h4>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t.synastry.nameLabel}
            </label>
            <input
              type="text"
              value={nameB}
              onChange={(e) => setNameB(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t.synastry.birthDate}
            </label>
            <input
              type="date"
              value={birthDateB}
              onChange={(e) => setBirthDateB(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* Synastry Report */}
      {synastryResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Main Score Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50 via-purple-50/70 to-slate-50 dark:from-rose-950/40 dark:via-purple-950/30 dark:to-gray-900/60 border border-rose-200 dark:border-rose-500/30 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
                  {nameA} & {nameB}
                </span>
                <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1 flex items-center gap-3">
                  {t.synastry.globalCompatibility}
                  <span className="text-2xl text-rose-600 dark:text-rose-400 font-mono">
                    {synastryResult.globalScore}%
                  </span>
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  Aspect inter-thèmes : <span className="font-semibold text-rose-600 dark:text-rose-300">{synastryResult.aspectName}</span> (Orbe : {Math.round(synastryResult.aspectDiff)}°)
                </p>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/40 flex items-center justify-center text-rose-600 dark:text-rose-400 text-xl font-bold font-mono shadow-sm">
                {synastryResult.globalScore}%
              </div>
            </div>

            {/* Score Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-rose-100 dark:border-white/10 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-white/5 border border-rose-100 dark:border-white/10 space-y-1.5 shadow-sm">
                <span className="text-gray-700 dark:text-gray-300 block font-semibold">{t.synastry.emotionalScore}</span>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden mr-3">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all"
                      style={{ width: `${synastryResult.emotional}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{synastryResult.emotional}%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-white/5 border border-rose-100 dark:border-white/10 space-y-1.5 shadow-sm">
                <span className="text-gray-700 dark:text-gray-300 block font-semibold">{t.synastry.intellectualScore}</span>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden mr-3">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all"
                      style={{ width: `${synastryResult.intellectual}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{synastryResult.intellectual}%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-white/5 border border-rose-100 dark:border-white/10 space-y-1.5 shadow-sm">
                <span className="text-gray-700 dark:text-gray-300 block font-semibold">{t.synastry.spiritualScore}</span>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden mr-3">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${synastryResult.spiritual}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{synastryResult.spiritual}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
