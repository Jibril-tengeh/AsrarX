import React, { useState } from 'react';
import { Compass, Sparkles, User, ShieldCheck, ShieldAlert, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';
import { calculateFengShuiKua } from '../../data/comparativeTraditionsData';

interface FengShuiKuaTabProps {
  t: any;
  lang: 'fr' | 'en' | 'ha';
}

export const FengShuiKuaTab: React.FC<FengShuiKuaTabProps> = ({ t, lang }) => {
  const [birthYear, setBirthYear] = useState(1994);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthMonth, setBirthMonth] = useState(6);
  const [birthDay, setBirthDay] = useState(15);

  const result = calculateFengShuiKua(birthYear, gender, birthMonth, birthDay);

  const getFavorable = () => {
    if (lang === 'ha') return result.profile.favorableHa;
    if (lang === 'en') return result.profile.favorableEn;
    return result.profile.favorableFr;
  };

  const getUnfavorable = () => {
    if (lang === 'ha') return result.profile.unfavorableHa;
    if (lang === 'en') return result.profile.unfavorableEn;
    return result.profile.unfavorableFr;
  };

  const favorable = getFavorable();
  const unfavorable = getUnfavorable();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-amber-500/10 border border-emerald-500/20 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {t.kua.title}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono">
                8 Mansions (Ba Zhai)
              </span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {t.kua.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Input Parameters Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t.kua.genderLabel}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  gender === 'male'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {t.kua.male}
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  gender === 'female'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {t.kua.female}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t.kua.birthYearLabel}
            </label>
            <input
              type="number"
              min={1920}
              max={2040}
              value={birthYear}
              onChange={(e) => setBirthYear(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* Results Overview Card */}
      {result && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/70 to-slate-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-gray-900/60 border border-emerald-200 dark:border-emerald-500/30 shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  {t.kua.groupText.replace('{group}', result.profile.group)}
                </span>
                <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1 flex items-center gap-3">
                  {t.kua.kuaResult.replace('{kua}', String(result.kua))}
                  <span className="text-2xl font-serif text-emerald-600 dark:text-emerald-400">
                    ({result.profile.trigramChinese})
                  </span>
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {t.kua.trigramName}: <span className="font-semibold text-gray-900 dark:text-white">{result.profile.trigram}</span> • Élément : <span className="font-semibold text-gray-900 dark:text-white">{result.profile.elementFr}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-white/10 border border-emerald-200 dark:border-white/20 text-center sm:text-right font-mono text-xs text-emerald-700 dark:text-emerald-300 shadow-sm">
                <span className="font-bold">Groupe {result.profile.group}</span>
                <div className="text-[10px] text-gray-500 dark:text-gray-300 mt-0.5 font-sans font-medium">
                  {result.profile.group === 'Est' ? 'Kua 1, 3, 4, 9' : 'Kua 2, 6, 7, 8'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4 Favorable vs 4 Unfavorable Directions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Favorable */}
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-900/40 shadow-sm space-y-3">
              <h5 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {t.kua.favorableDirections}
              </h5>

              <div className="space-y-2.5 text-xs text-gray-700 dark:text-gray-200">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    {t.kua.shengQi}
                  </span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{favorable.shengQi}</span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    {t.kua.tianYi}
                  </span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{favorable.tianYi}</span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    {t.kua.yanNian}
                  </span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{favorable.yanNian}</span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    {t.kua.fuWei}
                  </span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{favorable.fuWei}</span>
                </div>
              </div>
            </div>

            {/* Unfavorable */}
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/40 shadow-sm space-y-3">
              <h5 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                {t.kua.unfavorableDirections}
              </h5>

              <div className="space-y-2.5 text-xs text-gray-700 dark:text-gray-200">
                <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/30 flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5 text-red-700 dark:text-red-300">
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                    {t.kua.huoHai}
                  </span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{unfavorable.huoHai}</span>
                </div>

                <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/30 flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5 text-red-700 dark:text-red-300">
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                    {t.kua.wuGui}
                  </span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{unfavorable.wuGui}</span>
                </div>

                <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/30 flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5 text-red-700 dark:text-red-300">
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                    {t.kua.liuSha}
                  </span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{unfavorable.liuSha}</span>
                </div>

                <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/30 flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5 text-red-700 dark:text-red-300">
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                    {t.kua.jueMing}
                  </span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{unfavorable.jueMing}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
