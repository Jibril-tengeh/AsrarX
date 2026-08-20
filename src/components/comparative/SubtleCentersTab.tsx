import React, { useState } from 'react';
import { Activity, Sparkles, Heart, CircleDot, Info, Layers, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { SUBTLE_CENTERS_COMPARISON, SubtleCenterItem } from '../../data/comparativeTraditionsData';

interface SubtleCentersTabProps {
  t: any;
  lang: 'fr' | 'en' | 'ha';
}

export const SubtleCentersTab: React.FC<SubtleCentersTabProps> = ({ t, lang }) => {
  const [selectedCenterId, setSelectedCenterId] = useState<number>(1);

  const subtleT = t?.subtleCenters || t?.subtle || {};

  const selectedCenter = SUBTLE_CENTERS_COMPARISON.find(c => c.id === selectedCenterId) || SUBTLE_CENTERS_COMPARISON[0];

  const getChakraLocation = (c: SubtleCenterItem) => {
    if (lang === 'ha') return c.chakraLocationHa;
    if (lang === 'en') return c.chakraLocationEn;
    return c.chakraLocationFr;
  };

  const getLatifaLocation = (c: SubtleCenterItem) => {
    if (lang === 'ha') return c.latifaLocationHa;
    if (lang === 'en') return c.latifaLocationEn;
    return c.latifaLocationFr;
  };

  const getChakraElement = (c: SubtleCenterItem) => {
    if (lang === 'ha') return c.chakraElementHa;
    if (lang === 'en') return c.chakraElementEn;
    return c.chakraElementFr;
  };

  const getLatifaProphet = (c: SubtleCenterItem) => {
    if (lang === 'ha') return c.latifaProphetHa;
    if (lang === 'en') return c.latifaProphetEn;
    return c.latifaProphetFr;
  };

  const getChakraSignificance = (c: SubtleCenterItem) => {
    if (lang === 'ha') return c.chakraSignificanceHa;
    if (lang === 'en') return c.chakraSignificanceEn;
    return c.chakraSignificanceFr;
  };

  const getLatifaSignificance = (c: SubtleCenterItem) => {
    if (lang === 'ha') return c.latifaSignificanceHa;
    if (lang === 'en') return c.latifaSignificanceEn;
    return c.latifaSignificanceFr;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-emerald-500/10 border border-indigo-500/20 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-500 border border-indigo-500/30">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {subtleT.title || "Comparateur des Centres Subtils"}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono">
                Comparative Subtle Anatomy
              </span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {subtleT.subtitle || "Chakras vs Latâ'if"}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Center Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {SUBTLE_CENTERS_COMPARISON.map((center) => {
          const isSelected = selectedCenterId === center.id;
          return (
            <button
              key={center.id}
              type="button"
              onClick={() => setSelectedCenterId(center.id)}
              className={`p-3 rounded-2xl text-center flex flex-col items-center justify-center transition-all cursor-pointer border ${
                isSelected
                  ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/40 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-500/40'
              }`}
            >
              <div
                className="w-3.5 h-3.5 rounded-full mb-1.5 shadow-sm"
                style={{ backgroundColor: center.chakraColorHex }}
              />
              <span className="text-xs font-bold text-gray-900 dark:text-white truncate w-full">
                {center.chakraName}
              </span>
              <span className="text-[10px] text-gray-400 font-arabic truncate w-full">
                {center.latifaArabic}
              </span>
            </button>
          );
        })}
      </div>

      {/* Side-by-Side In-Depth Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chakra Column (Hindu Tradition) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-900/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
              Tradition Védique & Tantrique
            </span>
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: selectedCenter.chakraColorHex }}
            />
          </div>

          <div>
            <h4 className="text-xl font-black text-gray-900 dark:text-white">
              {selectedCenter.chakraName}
            </h4>
            <p className="text-xs font-mono text-purple-600 dark:text-purple-400">
              {selectedCenter.chakraSanskrit} • {selectedCenter.chakraPetals} Pétales
            </p>
          </div>

          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <div className="p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
              <span className="font-semibold text-gray-400 block text-[10px] uppercase">{subtleT.anatomicalLocation || subtleT.location || "Localisation"}</span>
              <span className="font-bold text-gray-900 dark:text-white">{getChakraLocation(selectedCenter)}</span>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
              <span className="font-semibold text-gray-400 block text-[10px] uppercase">{subtleT.element || subtleT.elementAndColor || "Élément"} / Bija Mantra</span>
              <span className="font-bold text-gray-900 dark:text-white">{getChakraElement(selectedCenter)} • {selectedCenter.chakraBija}</span>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 leading-relaxed">
              <span className="font-semibold text-gray-400 block text-[10px] uppercase mb-1">{subtleT.significance || subtleT.spiritualDimension || "Signification"}</span>
              {getChakraSignificance(selectedCenter)}
            </div>
          </div>
        </div>

        {/* Latifa Column (Sufi Tradition) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-900/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Tradition Soufie (Latā'if As-Sitta)
            </span>
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: selectedCenter.latifaColorHex }}
            />
          </div>

          <div>
            <h4 className="text-xl font-black text-gray-900 dark:text-white">
              {selectedCenter.latifaName}
            </h4>
            <p className="text-base font-arabic font-bold text-emerald-600 dark:text-emerald-400">
              {selectedCenter.latifaArabic}
            </p>
          </div>

          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
              <span className="font-semibold text-gray-400 block text-[10px] uppercase">{subtleT.latifaLocation || subtleT.location || "Localisation Latifa"}</span>
              <span className="font-bold text-gray-900 dark:text-white">{getLatifaLocation(selectedCenter)}</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
              <span className="font-semibold text-gray-400 block text-[10px] uppercase">{subtleT.propheticAttribution || subtleT.associatedProphet || "Pôle Prophétique"} / Dhikr</span>
              <span className="font-bold text-gray-900 dark:text-white">{getLatifaProphet(selectedCenter)} • {selectedCenter.latifaDhikr}</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 leading-relaxed">
              <span className="font-semibold text-gray-400 block text-[10px] uppercase mb-1">{subtleT.spiritualGoal || subtleT.spiritualDimension || "Objectif Spirituel"}</span>
              {getLatifaSignificance(selectedCenter)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
