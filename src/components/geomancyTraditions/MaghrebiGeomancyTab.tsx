import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, ShieldAlert, Sparkles, Navigation, Users, CheckCircle2, AlertTriangle, Copy, Check } from 'lucide-react';
import { 
  Geomantic16Figure, 
  computeDairatAsSouss, 
  computeMizanAlGharb, 
  computeKhatamZanati, 
  computeSaharanVoyage, 
  computeJiwarConflicts 
} from '../../data/geomancyTraditionsData';
import { GEOMANCY_TRADITIONS_I18N } from '../../data/geomancyTraditionsTranslations';

interface MaghrebiGeomancyTabProps {
  houses: Geomantic16Figure[];
  lang: 'fr' | 'en' | 'ha';
}

export const MaghrebiGeomancyTab: React.FC<MaghrebiGeomancyTabProps> = ({ houses, lang }) => {
  const t = GEOMANCY_TRADITIONS_I18N[lang] || GEOMANCY_TRADITIONS_I18N.fr;
  const [activeSubTab, setActiveSubTab] = useState<'souss' | 'mizanGharb' | 'khatamZanati' | 'voyage' | 'jiwar'>('souss');
  const [copiedKhatam, setCopiedKhatam] = useState(false);

  const souss = computeDairatAsSouss(houses);
  const mizanGharb = computeMizanAlGharb(houses);
  const khatam = computeKhatamZanati(houses);
  const voyage = computeSaharanVoyage(houses);
  const jiwarList = computeJiwarConflicts(houses);

  const copyKhatamMatrix = () => {
    const text = `=== KHATAM AR-RAML DE ZANATI ===\n${khatam.grid.map(row => row.join(' | ')).join('\n')}\nKhadim: ${khatam.rulingKhadim}\nDivine Names: ${khatam.divineNameAr}`;
    navigator.clipboard.writeText(text);
    setCopiedKhatam(true);
    setTimeout(() => setCopiedKhatam(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-yellow-500/10 via-amber-100/40 to-yellow-500/10 dark:from-yellow-950/40 dark:via-stone-900/50 dark:to-amber-950/40 border border-yellow-500/30 dark:border-yellow-600/30 rounded-xl p-5 shadow-sm dark:shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-yellow-500/20 rounded-lg text-yellow-700 dark:text-yellow-400 border border-yellow-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-amber-200">{t.maghrebiSectionTitle}</h3>
            <p className="text-sm text-stone-600 dark:text-stone-300">{t.maghrebiSectionDesc}</p>
          </div>
        </div>
      </div>

      {/* Subtabs Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <button
          onClick={() => setActiveSubTab('souss')}
          className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'souss'
              ? 'bg-amber-500/20 dark:bg-amber-600/30 text-amber-800 dark:text-amber-300 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-amber-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{t.subSouss}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mizanGharb')}
          className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'mizanGharb'
              ? 'bg-amber-500/20 dark:bg-amber-600/30 text-amber-800 dark:text-amber-300 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-amber-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{t.subMizanGharb}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('khatamZanati')}
          className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'khatamZanati'
              ? 'bg-amber-500/20 dark:bg-amber-600/30 text-amber-800 dark:text-amber-300 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-amber-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{t.subKhatamZanati}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('voyage')}
          className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'voyage'
              ? 'bg-amber-500/20 dark:bg-amber-600/30 text-amber-800 dark:text-amber-300 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-amber-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <Navigation className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{t.subVoyage}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('jiwar')}
          className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'jiwar'
              ? 'bg-amber-500/20 dark:bg-amber-600/30 text-amber-800 dark:text-amber-300 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-amber-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{t.subJiwar}</span>
        </button>
      </div>

      {/* Subtab Contents */}
      <motion.div
        key={activeSubTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* 1. DAIRAT AS-SOUSS */}
        {activeSubTab === 'souss' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <h4 className="text-lg font-bold text-stone-900 dark:text-amber-300 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                {t.subSouss}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subSoussDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Dial Wheel Display */}
              <div className="p-6 bg-gradient-to-b from-amber-50/50 to-stone-50 dark:from-stone-950 dark:to-stone-900 rounded-xl border border-stone-200 dark:border-amber-600/30 text-center space-y-3 shadow-xs">
                <div className="w-28 h-28 mx-auto rounded-full border-4 border-amber-500/40 flex flex-col items-center justify-center bg-amber-500/10 dark:bg-amber-950/20 shadow-inner">
                  <span className="text-xs text-amber-700 dark:text-amber-400/80 font-bold uppercase">{souss.season}</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-amber-200 mt-1">{souss.berberMonth}</span>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-stone-900 dark:text-stone-200">{souss.astrologicalSign}</h5>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                    {lang === 'fr' ? souss.energyFlowFr : lang === 'ha' ? souss.energyFlowHa : souss.energyFlowEn}
                  </p>
                </div>
              </div>

              {/* Timing Details */}
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 rounded-lg space-y-2">
                  <div className="flex justify-between items-center text-xs text-amber-700 dark:text-amber-400 font-bold uppercase">
                    <span>{t.soussMonthLabel}</span>
                    <span className="text-stone-900 dark:text-stone-200">{souss.berberMonth}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-amber-700 dark:text-amber-400 font-bold uppercase">
                    <span>{t.soussSeasonLabel}</span>
                    <span className="text-stone-900 dark:text-stone-200">{souss.season}</span>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-lg space-y-2">
                  <span className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide block">
                    {t.soussTimingLabel}
                  </span>
                  <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    {lang === 'fr' ? souss.timingEstimateFr : lang === 'ha' ? souss.timingEstimateHa : souss.timingEstimateEn}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MIZAN AL-GHARB */}
        {activeSubTab === 'mizanGharb' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <h4 className="text-lg font-bold text-stone-900 dark:text-amber-300 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                {t.subMizanGharb}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subMizanGharbDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Baraka Gauge */}
              <div className={`p-6 rounded-xl border text-center space-y-3 ${
                mizanGharb.isFertile 
                  ? 'bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/40' 
                  : 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/40'
              }`}>
                <div className="text-4xl font-extrabold text-amber-600 dark:text-amber-300 font-mono">
                  {mizanGharb.barakaIndex}%
                </div>
                <span className="text-xs uppercase font-bold tracking-wider text-stone-600 dark:text-stone-400 block">
                  {t.barakaIndexLabel}
                </span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  mizanGharb.isFertile ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40'
                }`}>
                  {lang === 'fr' ? mizanGharb.statusFr : lang === 'ha' ? mizanGharb.statusHa : mizanGharb.statusEn}
                </span>
              </div>

              {/* Analysis */}
              <div className="md:col-span-2 p-5 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl space-y-3">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide block">
                  {lang === 'fr' ? "Analyse des Maisons de Fortune (M2, M8, M10, M11) :" : lang === 'ha' ? "Bayanin Gidajen Arziki (G2, G8, G10, G11) :" : "Fortune Houses Analysis (H2, H8, H10, H11):"}
                </span>
                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {lang === 'fr' ? mizanGharb.wealthHousesAnalysisFr : lang === 'ha' ? mizanGharb.wealthHousesAnalysisHa : mizanGharb.wealthHousesAnalysisEn}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. TALISMAN DE ZANATI */}
        {activeSubTab === 'khatamZanati' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="flex items-start justify-between flex-wrap gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div>
                <h4 className="text-lg font-bold text-stone-900 dark:text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  {t.subKhatamZanati}
                </h4>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subKhatamZanatiDesc}</p>
              </div>
              <button
                onClick={copyKhatamMatrix}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold transition-all shadow-xs"
              >
                {copiedKhatam ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKhatam ? t.copiedSuccess : t.btnCopyData}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Magic Square Visual */}
              <div className="p-6 bg-gradient-to-b from-amber-50/50 to-stone-50 dark:from-stone-950 dark:to-stone-900 border border-stone-200 dark:border-amber-500/40 rounded-xl flex flex-col items-center space-y-4 shadow-xs">
                <span className="text-xs font-serif text-amber-700 dark:text-amber-400 font-bold">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                  {khatam.grid.map((row, rIdx) => 
                    row.map((val, cIdx) => (
                      <div 
                        key={`${rIdx}-${cIdx}`}
                        className="aspect-square flex items-center justify-center bg-white dark:bg-stone-900 border border-amber-500/30 rounded-lg text-stone-900 dark:text-amber-200 font-mono font-bold text-base shadow-xs"
                      >
                        {val}
                      </div>
                    ))
                  )}
                </div>
                <span className="text-xs font-serif text-amber-700 dark:text-amber-300/80 font-semibold">{khatam.divineNameAr}</span>
              </div>

              {/* Khatam Metadata */}
              <div className="space-y-4">
                <div className="p-4 bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 rounded-lg space-y-2">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide block">
                    {t.zanatiKhadimLabel}
                  </span>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-200">{khatam.rulingKhadim}</p>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-lg space-y-2">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide block">
                    {t.zanatiDivineNames}
                  </span>
                  <p className="text-sm font-serif text-amber-700 dark:text-amber-200 font-semibold">{khatam.divineNameAr}</p>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {lang === 'fr' ? khatam.divineNameFr : lang === 'ha' ? khatam.divineNameHa : khatam.divineNameEn}
                  </p>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 italic bg-stone-50 dark:bg-stone-950/30 p-3 rounded-lg border border-stone-200 dark:border-stone-800/80">
                  {t.zanatiUsageGuide}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. VOYAGE SAHARIEN */}
        {activeSubTab === 'voyage' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <h4 className="text-lg font-bold text-stone-900 dark:text-amber-300 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                {t.subVoyage}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subVoyageDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase block">{t.voyageDeparture}</span>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  {lang === 'fr' ? voyage.departureStatusFr : lang === 'ha' ? voyage.departureStatusHa : voyage.departureStatusEn}
                </p>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase block">{t.voyageCrossing}</span>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  {lang === 'fr' ? voyage.transitRiskFr : lang === 'ha' ? voyage.transitRiskHa : voyage.transitRiskEn}
                </p>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase block">{t.voyageSecurity}</span>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  {lang === 'fr' ? voyage.arrivalFateFr : lang === 'ha' ? voyage.arrivalFateHa : voyage.arrivalFateEn}
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-2 text-center">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide block">
                {t.voyageDuaLabel}
              </span>
              <p className="text-base font-serif text-amber-800 dark:text-amber-200 tracking-wide font-medium">
                {voyage.travelDuaAr}
              </p>
            </div>
          </div>
        )}

        {/* 5. CONFLITS DE VOISINAGE (JIWAR) */}
        {activeSubTab === 'jiwar' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <h4 className="text-lg font-bold text-stone-900 dark:text-amber-300 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                {t.subJiwar}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subJiwarDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jiwarList.map((j, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    j.compatibility === 'combative' 
                      ? 'bg-red-500/10 dark:bg-red-950/20 border-red-500/30' 
                      : j.compatibility === 'peaceful'
                      ? 'bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-stone-50 dark:bg-stone-950/40 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">{j.pairName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      j.compatibility === 'combative' ? 'bg-red-500/20 text-red-700 dark:text-red-300' : j.compatibility === 'peaceful' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-stone-200/80 dark:bg-stone-800 text-stone-800 dark:text-stone-300'
                    }`}>
                      {j.compatibility === 'combative' ? t.jiwarCombative : j.compatibility === 'peaceful' ? t.jiwarPeaceful : t.jiwarTransformative}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    {lang === 'fr' ? j.interpretationFr : lang === 'ha' ? j.interpretationHa : j.interpretationEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
