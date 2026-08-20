import React, { useState } from 'react';
import { Compass, Sparkles, Grid3X3, Layers, Info, Check, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { BAGUA_SECTORS } from '../../data/comparativeTraditionsData';

interface BaGuaGeneratorTabProps {
  t: any;
  lang: 'fr' | 'en' | 'ha';
}

export const BaGuaGeneratorTab: React.FC<BaGuaGeneratorTabProps> = ({ t, lang }) => {
  const [selectedDirection, setSelectedDirection] = useState<string>('Sud');
  const [selectedSectorId, setSelectedSectorId] = useState<string>('south');

  const selectedSector = BAGUA_SECTORS.find(s => s.id === selectedSectorId) || BAGUA_SECTORS[0];

  const getSectorName = (sec: any) => {
    if (lang === 'ha') return sec.nameHa;
    if (lang === 'en') return sec.nameEn;
    return sec.nameFr;
  };

  const getLifeArea = (sec: any) => {
    if (lang === 'ha') return sec.lifeAreaHa;
    if (lang === 'en') return sec.lifeAreaEn;
    return sec.lifeAreaFr;
  };

  const getAdvice = (sec: any) => {
    return sec.adviceFr;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 border border-amber-500/20 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30">
            <Grid3X3 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {t.bagua.title}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono">
                Lo Shu 9 Palaces
              </span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {t.bagua.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 3x3 Lo Shu Energy Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* The 3x3 Interactive Grid */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              {t.bagua.gridMode}
            </h4>
            <span className="text-xs text-gray-400 font-mono">
              Orientation : {selectedDirection}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 aspect-square max-w-md mx-auto">
            {BAGUA_SECTORS.map((sector) => {
              const isSelected = selectedSectorId === sector.id;
              return (
                <button
                  key={sector.id}
                  type="button"
                  onClick={() => setSelectedSectorId(sector.id)}
                  className={`p-3 rounded-2xl text-center flex flex-col items-center justify-center transition-all cursor-pointer border ${
                    isSelected
                      ? 'border-amber-500 shadow-lg shadow-amber-500/20 scale-105 z-10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-amber-500/40'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${sector.colorHex}25` : `${sector.colorHex}10`
                  }}
                >
                  <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400">
                    {getSectorName(sector)}
                  </span>
                  <div className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white mt-1 line-clamp-1">
                    {getLifeArea(sector)}
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 mt-1">
                    {sector.elementFr}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Sector Details & Space Planning Advice */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/60 to-white dark:from-amber-950/30 dark:via-purple-950/20 dark:to-slate-900/40 border border-amber-200 dark:border-amber-500/30 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
              Secteur {getSectorName(selectedSector)}
            </span>
            <span
              className="w-3.5 h-3.5 rounded-full shadow-sm"
              style={{ backgroundColor: selectedSector.colorHex }}
            />
          </div>

          <div>
            <h4 className="text-2xl font-black text-gray-900 dark:text-white">
              {getLifeArea(selectedSector)}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
              {t.bagua.activatedElement}: <span className="font-semibold text-amber-700 dark:text-amber-400">{selectedSector.elementFr}</span>
            </p>
          </div>

          <div className="pt-3 border-t border-amber-200/60 dark:border-gray-700 space-y-3 text-xs text-gray-700 dark:text-gray-300">
            <div>
              <span className="text-gray-500 dark:text-gray-400 font-semibold block mb-1">{t.bagua.adviceTitle}:</span>
              <p className="leading-relaxed bg-white dark:bg-gray-800/80 p-3 rounded-2xl border border-amber-200/60 dark:border-gray-700/50 shadow-sm">
                {getAdvice(selectedSector)}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed font-medium">
              <Info className="inline w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400" />
              {t.bagua.remedyNotice}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
