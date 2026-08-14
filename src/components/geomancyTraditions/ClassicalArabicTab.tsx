import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, Compass, Scale, Shield, Sparkles, AlertCircle, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { 
  Geomantic16Figure, 
  computeDamir, 
  computeTashteedAspects, 
  computeMizanAnasir, 
  computeMizanMizan, 
  computeInqilab 
} from '../../data/geomancyTraditionsData';
import { GEOMANCY_TRADITIONS_I18N } from '../../data/geomancyTraditionsTranslations';

interface ClassicalArabicTabProps {
  houses: Geomantic16Figure[];
  lang: 'fr' | 'en' | 'ha';
}

export const ClassicalArabicTab: React.FC<ClassicalArabicTabProps> = ({ houses, lang }) => {
  const t = GEOMANCY_TRADITIONS_I18N[lang] || GEOMANCY_TRADITIONS_I18N.fr;

  const [activeSubTab, setActiveSubTab] = useState<'damir' | 'tashteed' | 'mizanAnasir' | 'mizanMizan' | 'inqilab'>('damir');

  // Compute all classical parameters
  const damir = computeDamir(houses);
  const aspects = computeTashteedAspects(houses);
  const mizanAnasir = computeMizanAnasir(houses);
  const mizanMizan = computeMizanMizan(houses);
  const inqilabList = computeInqilab(houses);

  // Helper to render figure dots
  const renderDotsVisual = (dots: [number, number, number, number]) => (
    <div className="flex flex-col items-center justify-center space-y-1.5 py-1 px-2.5 bg-amber-500/5 dark:bg-stone-900/60 rounded-md border border-amber-500/20 dark:border-amber-500/30">
      {dots.map((val, idx) => (
        <div key={idx} className="flex items-center space-x-1.5 h-3">
          {val === 1 ? (
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-amber-400 shadow-sm" />
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 shadow-sm" />
              <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 shadow-sm" />
            </>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-amber-500/10 dark:from-amber-950/40 dark:via-stone-900/50 dark:to-amber-950/40 border border-amber-500/30 dark:border-amber-600/30 rounded-xl p-5 shadow-sm dark:shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-amber-500/20 rounded-lg text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-amber-200">{t.arabicSectionTitle}</h3>
            <p className="text-sm text-stone-600 dark:text-stone-300">{t.arabicSectionDesc}</p>
          </div>
        </div>
      </div>

      {/* Subtabs Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <button
          onClick={() => setActiveSubTab('damir')}
          className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'damir'
              ? 'bg-amber-500/20 dark:bg-amber-600/30 text-amber-800 dark:text-amber-300 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-amber-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{t.subDamir}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tashteed')}
          className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'tashteed'
              ? 'bg-amber-500/20 dark:bg-amber-600/30 text-amber-800 dark:text-amber-300 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-amber-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{t.subTashteed}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mizanAnasir')}
          className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'mizanAnasir'
              ? 'bg-amber-500/20 dark:bg-amber-600/30 text-amber-800 dark:text-amber-300 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-amber-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{t.subMizanAnasir}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mizanMizan')}
          className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'mizanMizan'
              ? 'bg-amber-500/20 dark:bg-amber-600/30 text-amber-800 dark:text-amber-300 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-amber-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{t.subMizanMizan}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('inqilab')}
          className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'inqilab'
              ? 'bg-amber-500/20 dark:bg-amber-600/30 text-amber-800 dark:text-amber-300 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-amber-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{t.subInqilab}</span>
        </button>
      </div>

      {/* Subtab Contents */}
      <motion.div
        key={activeSubTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* 1. DAMIR (Hidden Intention) */}
        {activeSubTab === 'damir' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="flex items-start justify-between flex-wrap gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div>
                <h4 className="text-lg font-bold text-stone-900 dark:text-amber-300 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  {t.subDamir}
                </h4>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subDamirDesc}</p>
              </div>
              <div className="px-3 py-1 bg-amber-500/15 dark:bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-800 dark:text-amber-300">
                {damir.subConsciousAffinity}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-50/50 to-stone-50 dark:from-stone-950 dark:to-stone-900 rounded-xl border border-stone-200 dark:border-amber-600/30 text-center space-y-3 shadow-xs">
                <span className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400/80 font-bold">
                  {t.houseLabel} {damir.houseNumber}
                </span>
                {renderDotsVisual(damir.figure.dots)}
                <div>
                  <h5 className="text-xl font-bold text-stone-900 dark:text-amber-200">
                    {lang === 'fr' ? damir.figure.nameFr : lang === 'ha' ? damir.figure.nameHa : damir.figure.nameEn}
                  </h5>
                  <p className="text-sm font-serif text-amber-700 dark:text-amber-400/90 font-semibold">{damir.figure.nameAr}</p>
                </div>
                <div className="flex gap-2 text-xs text-stone-700 dark:text-stone-400">
                  <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700 font-medium">{damir.figure.element.toUpperCase()}</span>
                  <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700 font-medium">{damir.figure.nature.toUpperCase()}</span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="p-4 bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 rounded-lg">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide block mb-1">
                    {t.damirFoundTitle}
                  </span>
                  <p className="text-base font-semibold text-stone-900 dark:text-stone-200">
                    {lang === 'fr' ? damir.themeTitleFr : lang === 'ha' ? damir.themeTitleHa : damir.themeTitleEn}
                  </p>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-lg space-y-2">
                  <span className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide block">
                    {t.damirInsightLabel}
                  </span>
                  <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    {lang === 'fr' ? damir.explanationFr : lang === 'ha' ? damir.explanationHa : damir.explanationEn}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TASHTEED (Geomantic Aspects) */}
        {activeSubTab === 'tashteed' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <h4 className="text-lg font-bold text-stone-900 dark:text-amber-300 flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                {t.subTashteed}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subTashteedDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aspects.map((asp, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    asp.harmonicQuality === 'very_favorable'
                      ? 'bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/30'
                      : asp.harmonicQuality === 'challenging' || asp.harmonicQuality === 'critical'
                      ? 'bg-red-500/10 dark:bg-red-950/20 border-red-500/30'
                      : 'bg-stone-50 dark:bg-stone-950/40 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {lang === 'fr' ? asp.typeFr : lang === 'ha' ? asp.typeHa : asp.typeEn}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-200/80 dark:bg-stone-800 text-stone-800 dark:text-stone-300">
                      M{asp.houseA} ⟷ M{asp.houseB}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 my-3">
                    <div className="flex items-center space-x-2">
                      {renderDotsVisual(asp.figA.dots)}
                      <span className="text-xs font-semibold text-stone-800 dark:text-stone-300">
                        {lang === 'fr' ? asp.figA.nameFr : lang === 'ha' ? asp.figA.nameHa : asp.figA.nameEn}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 dark:text-stone-500" />
                    <div className="flex items-center space-x-2">
                      {renderDotsVisual(asp.figB.dots)}
                      <span className="text-xs font-semibold text-stone-800 dark:text-stone-300">
                        {lang === 'fr' ? asp.figB.nameFr : lang === 'ha' ? asp.figB.nameHa : asp.figB.nameEn}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed border-t border-stone-200 dark:border-stone-800/80 pt-2">
                    {lang === 'fr' ? asp.explanationFr : lang === 'ha' ? asp.explanationHa : asp.explanationEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. MIZAN AL-ANASIR (Elemental Balance) */}
        {activeSubTab === 'mizanAnasir' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <h4 className="text-lg font-bold text-stone-900 dark:text-amber-300 flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                {t.subMizanAnasir}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subMizanAnasirDesc}</p>
            </div>

            {/* Elements Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-b from-red-500/10 to-stone-50 dark:from-red-950/30 dark:to-stone-900 rounded-xl border border-red-500/20 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-red-600 dark:text-red-400">{t.elementFire}</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{mizanAnasir.firePercent}%</span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: `${mizanAnasir.firePercent}%` }} />
                </div>
                <span className="text-xs text-stone-600 dark:text-stone-400 block">{mizanAnasir.firePoints} pts</span>
              </div>

              <div className="p-4 bg-gradient-to-b from-sky-500/10 to-stone-50 dark:from-sky-950/30 dark:to-stone-900 rounded-xl border border-sky-500/20 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-sky-600 dark:text-sky-400">{t.elementAir}</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{mizanAnasir.airPercent}%</span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full transition-all duration-500" style={{ width: `${mizanAnasir.airPercent}%` }} />
                </div>
                <span className="text-xs text-stone-600 dark:text-stone-400 block">{mizanAnasir.airPoints} pts</span>
              </div>

              <div className="p-4 bg-gradient-to-b from-blue-500/10 to-stone-50 dark:from-blue-950/30 dark:to-stone-900 rounded-xl border border-blue-500/20 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{t.elementWater}</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{mizanAnasir.waterPercent}%</span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${mizanAnasir.waterPercent}%` }} />
                </div>
                <span className="text-xs text-stone-600 dark:text-stone-400 block">{mizanAnasir.waterPoints} pts</span>
              </div>

              <div className="p-4 bg-gradient-to-b from-emerald-500/10 to-stone-50 dark:from-emerald-950/30 dark:to-stone-900 rounded-xl border border-emerald-500/20 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{t.elementEarth}</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{mizanAnasir.earthPercent}%</span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${mizanAnasir.earthPercent}%` }} />
                </div>
                <span className="text-xs text-stone-600 dark:text-stone-400 block">{mizanAnasir.earthPoints} pts</span>
              </div>
            </div>

            {/* Dominant Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-lg space-y-2">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide block">
                  {t.dominantElementTitle}
                </span>
                <p className="text-base font-bold text-stone-900 dark:text-amber-200">
                  {lang === 'fr' ? mizanAnasir.dominantFr : lang === 'ha' ? mizanAnasir.dominantHa : mizanAnasir.dominantEn}
                </p>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed pt-1">
                  {lang === 'fr' ? mizanAnasir.temperamentFr : lang === 'ha' ? mizanAnasir.temperamentHa : mizanAnasir.temperamentEn}
                </p>
              </div>

              <div className="p-4 bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 rounded-lg space-y-2">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide block">
                  {t.remedyPrescriptionTitle}
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  {lang === 'fr' ? mizanAnasir.prescriptionFr : lang === 'ha' ? mizanAnasir.prescriptionHa : mizanAnasir.prescriptionEn}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. MIZAN AL-MIZAN (Supreme Judge 17th & 18th Houses) */}
        {activeSubTab === 'mizanMizan' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <h4 className="text-lg font-bold text-stone-900 dark:text-amber-300 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                {t.subMizanMizan}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subMizanMizanDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* House 17 */}
              <div className="p-5 bg-gradient-to-b from-amber-50/50 to-stone-50 dark:from-stone-950 dark:to-stone-900 border border-stone-200 dark:border-amber-600/40 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    {t.house17Title}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                    M1 + M15
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  {renderDotsVisual(mizanMizan.house17.dots)}
                  <div>
                    <h5 className="text-lg font-bold text-stone-900 dark:text-amber-200">
                      {lang === 'fr' ? mizanMizan.house17.nameFr : lang === 'ha' ? mizanMizan.house17.nameHa : mizanMizan.house17.nameEn}
                    </h5>
                    <p className="text-sm font-serif text-amber-700 dark:text-amber-400/90 font-medium">{mizanMizan.house17.nameAr}</p>
                  </div>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed border-t border-stone-200 dark:border-stone-800 pt-3">
                  {lang === 'fr' ? mizanMizan.verdict17Fr : lang === 'ha' ? mizanMizan.verdict17Ha : mizanMizan.verdict17En}
                </p>
              </div>

              {/* House 18 */}
              <div className="p-5 bg-gradient-to-b from-amber-50/50 to-stone-50 dark:from-stone-950 dark:to-stone-900 border border-stone-200 dark:border-amber-600/40 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    {t.house18Title}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                    M4 + M17
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  {renderDotsVisual(mizanMizan.house18.dots)}
                  <div>
                    <h5 className="text-lg font-bold text-stone-900 dark:text-amber-200">
                      {lang === 'fr' ? mizanMizan.house18.nameFr : lang === 'ha' ? mizanMizan.house18.nameHa : mizanMizan.house18.nameEn}
                    </h5>
                    <p className="text-sm font-serif text-amber-700 dark:text-amber-400/90 font-medium">{mizanMizan.house18.nameAr}</p>
                  </div>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed border-t border-stone-200 dark:border-stone-800 pt-3">
                  {lang === 'fr' ? mizanMizan.secret18Fr : lang === 'ha' ? mizanMizan.secret18Ha : mizanMizan.secret18En}
                </p>
              </div>
            </div>

            {/* Supreme Synthesis */}
            <div className="p-4 bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 rounded-xl">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide block mb-1">
                {t.supremeResolutionTitle}
              </span>
              <p className="text-sm font-medium text-stone-900 dark:text-stone-200 leading-relaxed">
                {lang === 'fr' ? mizanMizan.supremeSynthesisFr : lang === 'ha' ? mizanMizan.supremeSynthesisHa : mizanMizan.supremeSynthesisEn}
              </p>
            </div>
          </div>
        )}

        {/* 5. INQILAB (Mutations & House Migrations) */}
        {activeSubTab === 'inqilab' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <h4 className="text-lg font-bold text-stone-900 dark:text-amber-300 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                {t.subInqilab}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subInqilabDesc}</p>
            </div>

            {inqilabList.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 dark:bg-stone-950/40 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400 mb-2" />
                <p className="text-sm">{t.noInqilab}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                  {t.inqilabFound} ({inqilabList.length}) :
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inqilabList.map((entry, idx) => (
                    <div key={idx} className="p-4 bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {renderDotsVisual(entry.figure.dots)}
                          <div>
                            <h5 className="text-sm font-bold text-stone-900 dark:text-amber-200">
                              {lang === 'fr' ? entry.figure.nameFr : lang === 'ha' ? entry.figure.nameHa : entry.figure.nameEn}
                            </h5>
                            <p className="text-xs font-serif text-stone-600 dark:text-stone-400">{entry.figure.nameAr}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {entry.occurrences.map(num => (
                            <span key={num} className="px-2 py-0.5 bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30 dark:border-amber-500/40 rounded text-xs font-bold text-amber-800 dark:text-amber-300">
                              M{num}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed border-t border-stone-200 dark:border-stone-800/80 pt-2">
                        {lang === 'fr' ? entry.descriptionFr : lang === 'ha' ? entry.descriptionHa : entry.descriptionEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
