import React, { useState, useMemo } from 'react';
import { Clock, Calendar, Sparkles, AlertCircle, ChevronRight, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { NAKSHATRAS_LIST, VIMSHOTTARI_DASHAS_CONFIG } from '../../data/comparativeTraditionsData';

interface VedicDashasTabProps {
  t: any;
  lang: 'fr' | 'en' | 'ha';
}

export const VedicDashasTab: React.FC<VedicDashasTabProps> = ({ t, lang }) => {
  const [birthDate, setBirthDate] = useState('1990-05-15');
  const [selectedNakshatraId, setSelectedNakshatraId] = useState<number>(1);
  const [calculated, setCalculated] = useState(false);

  const calculateTimeline = useMemo(() => {
    const selectedNakshatra = NAKSHATRAS_LIST.find(n => n.id === selectedNakshatraId) || NAKSHATRAS_LIST[0];
    const bDate = new Date(birthDate);
    if (isNaN(bDate.getTime())) return null;

    // Find the starting planet index in Vimshottari order based on Nakshatra's ruler
    const rulerName = selectedNakshatra.ruler.split(' ')[0]; // Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury
    let startIndex = VIMSHOTTARI_DASHAS_CONFIG.findIndex(d => d.planet.toLowerCase() === rulerName.toLowerCase());
    if (startIndex === -1) startIndex = 0;

    const timeline = [];
    let currentStartDate = new Date(bDate);
    const now = new Date();
    let currentActiveDasha = null;

    // Build the 120-year sequence of 9 Mahadashas
    for (let i = 0; i < VIMSHOTTARI_DASHAS_CONFIG.length; i++) {
      const configIndex = (startIndex + i) % VIMSHOTTARI_DASHAS_CONFIG.length;
      const dashaConfig = VIMSHOTTARI_DASHAS_CONFIG[configIndex];

      const startDate = new Date(currentStartDate);
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + dashaConfig.years);

      const isActive = now >= startDate && now < endDate;

      // Antardashas (sub-periods proportional to planet years / 120)
      const antardashas = [];
      let subStartDate = new Date(startDate);
      for (let j = 0; j < VIMSHOTTARI_DASHAS_CONFIG.length; j++) {
        const subConfigIndex = (configIndex + j) % VIMSHOTTARI_DASHAS_CONFIG.length;
        const subConfig = VIMSHOTTARI_DASHAS_CONFIG[subConfigIndex];
        const subDurationMonths = (dashaConfig.years * subConfig.years * 12) / 120;
        
        const subEndDate = new Date(subStartDate);
        subEndDate.setMonth(subEndDate.getMonth() + Math.round(subDurationMonths));

        const isSubActive = now >= subStartDate && now < subEndDate;

        antardashas.push({
          planet: subConfig.planet,
          planetLabel: lang === 'ha' ? subConfig.planetHa : lang === 'en' ? subConfig.planetEn : subConfig.planetFr,
          startDate: new Date(subStartDate),
          endDate: new Date(subEndDate),
          isSubActive,
          color: subConfig.color
        });

        subStartDate = new Date(subEndDate);
      }

      const dashaItem = {
        planet: dashaConfig.planet,
        planetLabel: lang === 'ha' ? dashaConfig.planetHa : lang === 'en' ? dashaConfig.planetEn : dashaConfig.planetFr,
        years: dashaConfig.years,
        startDate,
        endDate,
        isActive,
        color: dashaConfig.color,
        antardashas
      };

      if (isActive) {
        currentActiveDasha = dashaItem;
      }

      timeline.push(dashaItem);
      currentStartDate = new Date(endDate);
    }

    return {
      selectedNakshatra,
      timeline,
      currentActiveDasha: currentActiveDasha || timeline[0]
    };
  }, [birthDate, selectedNakshatraId, lang]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-amber-500/10 border border-indigo-500/20 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-500 border border-indigo-500/30">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {t.dashas.title}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono">
                120 Years Cycle
              </span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {t.dashas.subtitle}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 leading-relaxed bg-white/50 dark:bg-gray-800/50 p-3.5 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
          <AlertCircle className="inline w-4 h-4 mr-1 text-indigo-500" />
          {t.dashas.methodNote}
        </p>
      </div>

      {/* Input Parameters Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t.dashas.birthDateLabel}
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {t.dashas.nakshatraLabel}
            </label>
            <select
              value={selectedNakshatraId}
              onChange={(e) => setSelectedNakshatraId(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
            >
              {NAKSHATRAS_LIST.map((n) => (
                <option key={n.id} value={n.id}>
                  #{n.id} {n.name} ({n.ruler} - {n.zodiacSign})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => setCalculated(true)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          {t.dashas.calculateBtn}
        </button>
      </div>

      {/* Results Display */}
      {calculateTimeline && (
        <div className="space-y-6">
          {/* Current Active Dasha Highlight */}
          {calculateTimeline.currentActiveDasha && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50/70 to-slate-50 dark:from-indigo-900/40 dark:via-purple-900/30 dark:to-slate-900/60 border border-indigo-200 dark:border-indigo-500/40 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {t.dashas.currentDasha}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono border border-indigo-200 dark:border-indigo-500/30 font-semibold">
                  {calculateTimeline.currentActiveDasha.startDate.getFullYear()} - {calculateTimeline.currentActiveDasha.endDate.getFullYear()}
                </span>
              </div>

              <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    {calculateTimeline.currentActiveDasha.planetLabel}
                    <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-white/10 text-indigo-800 dark:text-gray-200">
                      {calculateTimeline.currentActiveDasha.years} ans de règne
                    </span>
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {t.dashas.rulingDesc.replace('{planet}', calculateTimeline.currentActiveDasha.planetLabel)}
                  </p>
                </div>
              </div>

              {/* Sub periods / Antardashas */}
              <div className="mt-5 pt-4 border-t border-indigo-100 dark:border-white/10">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-2.5">
                  Sous-périodes (Antardashas) en cours :
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-2">
                  {calculateTimeline.currentActiveDasha.antardashas.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      className={`p-2 rounded-xl text-center border text-xs transition-all ${
                        sub.isSubActive
                          ? 'bg-amber-500 border-amber-400 text-white font-bold shadow-md'
                          : 'bg-white/90 dark:bg-white/5 border-indigo-100 dark:border-white/10 text-gray-700 dark:text-gray-400 shadow-sm'
                      }`}
                    >
                      <div className="font-semibold truncate">{sub.planet}</div>
                      <div className="text-[10px] font-mono opacity-80 mt-0.5">
                        {sub.startDate.getFullYear()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Complete 120-Year Timeline */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              {t.dashas.timeline}
            </h4>

            <div className="space-y-3">
              {calculateTimeline.timeline.map((dasha, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    dasha.isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/60 shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: dasha.color }}
                    />
                    <div>
                      <h5 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {dasha.planetLabel}
                        {dasha.isActive && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono">
                            Actif
                          </span>
                        )}
                      </h5>
                      <span className="text-xs text-gray-500 font-mono">
                        {dasha.startDate.toLocaleDateString()} — {dasha.endDate.toLocaleDateString()} ({dasha.years} ans)
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {Math.round((dasha.years / 120) * 100)}% du cycle
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
