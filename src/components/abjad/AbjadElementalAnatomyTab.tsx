import React, { useState } from 'react';
import { Flame, Droplets, Wind, Mountain, Sun, Moon, Sparkles, Shield, Info, Check, Copy } from 'lucide-react';
import { DetailedAbjadCalculation } from '../../utils/abjadMasterEngine';

interface AbjadElementalAnatomyTabProps {
  calculation: DetailedAbjadCalculation;
}

export const AbjadElementalAnatomyTab: React.FC<AbjadElementalAnatomyTabProps> = ({ calculation }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const { elemental, radiance, characters } = calculation;

  const handleCopyReport = () => {
    const text = `=== ANATOMIE ÉLÉMENTAIRE & LETTRES SACRÉES ===
Texte : ${calculation.cleanText}
Valeur Abjad (${calculation.activeSystem.toUpperCase()}) : ${calculation.activeTotal}

ÉLÉMENTS :
- Feu (Nārī) : ${elemental.fire.percentage}% (${elemental.fire.count} lettres, poids : ${calculation.activeSystem === 'maghribi' ? elemental.fire.weightMaghribi : elemental.fire.weightMashriqi})
- Air (Hawā'ī) : ${elemental.air.percentage}% (${elemental.air.count} lettres, poids : ${calculation.activeSystem === 'maghribi' ? elemental.air.weightMaghribi : elemental.air.weightMashriqi})
- Eau (Mā'ī) : ${elemental.water.percentage}% (${elemental.water.count} lettres, poids : ${calculation.activeSystem === 'maghribi' ? elemental.water.weightMaghribi : elemental.water.weightMashriqi})
- Terre (Turābī) : ${elemental.earth.percentage}% (${elemental.earth.count} lettres, poids : ${calculation.activeSystem === 'maghribi' ? elemental.earth.weightMaghribi : elemental.earth.weightMashriqi})
Tempérament dominant : ${elemental.temperamentTitleFr}

NATURE SACRÉE :
- Lettres Lumineuses (Nūrāniyya) : ${radiance.luminousPercentage}% (${radiance.luminousCount} lettres, poids : ${radiance.luminousWeight})
- Lettres Sombres (Zulmāniyya) : ${radiance.darkPercentage}% (${radiance.darkCount} lettres, poids : ${radiance.darkWeight})
Statut : ${radiance.statusFr}`;

    navigator.clipboard.writeText(text);
    setCopiedSection('report');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 dark:from-amber-950/30 dark:to-red-950/30 rounded-2xl border border-amber-200/60 dark:border-amber-800/40">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              Anatomie des 4 Éléments & Lettres Lumineuses
            </h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
            Décomposition selon la tradition d'Ibn Arabi et de l'Imam Al-Buni (Shams al-Ma'arif).
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyReport}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
        >
          {copiedSection === 'report' ? (
            <>
              <Check size={14} />
              <span>Rapport Copié !</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copier le rapport</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Elements Visual Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Fire */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-red-50 to-orange-50/50 dark:from-red-950/30 dark:to-orange-950/10 border border-red-200/80 dark:border-red-800/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
              <Flame size={18} />
              <span>Feu (Nārī)</span>
            </div>
            <span className="text-lg font-black text-red-700 dark:text-red-300">
              {elemental.fire.percentage}%
            </span>
          </div>
          <div className="w-full bg-red-200/60 dark:bg-red-900/40 rounded-full h-2.5 overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${elemental.fire.percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-300 font-medium">
            <span>{elemental.fire.count} lettre(s)</span>
            <span>Poids: {calculation.activeSystem === 'maghribi' ? elemental.fire.weightMaghribi : elemental.fire.weightMashriqi}</span>
          </div>
        </div>

        {/* Air */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-sky-50 to-indigo-50/50 dark:from-sky-950/30 dark:to-indigo-950/10 border border-sky-200/80 dark:border-sky-800/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
              <Wind size={18} />
              <span>Air (Hawā'ī)</span>
            </div>
            <span className="text-lg font-black text-sky-700 dark:text-sky-300">
              {elemental.air.percentage}%
            </span>
          </div>
          <div className="w-full bg-sky-200/60 dark:bg-sky-900/40 rounded-full h-2.5 overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${elemental.air.percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-300 font-medium">
            <span>{elemental.air.count} lettre(s)</span>
            <span>Poids: {calculation.activeSystem === 'maghribi' ? elemental.air.weightMaghribi : elemental.air.weightMashriqi}</span>
          </div>
        </div>

        {/* Water */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/10 border border-blue-200/80 dark:border-blue-800/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <Droplets size={18} />
              <span>Eau (Mā'ī)</span>
            </div>
            <span className="text-lg font-black text-blue-700 dark:text-blue-300">
              {elemental.water.percentage}%
            </span>
          </div>
          <div className="w-full bg-blue-200/60 dark:bg-blue-900/40 rounded-full h-2.5 overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${elemental.water.percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-300 font-medium">
            <span>{elemental.water.count} lettre(s)</span>
            <span>Poids: {calculation.activeSystem === 'maghribi' ? elemental.water.weightMaghribi : elemental.water.weightMashriqi}</span>
          </div>
        </div>

        {/* Earth */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-50 to-emerald-50/50 dark:from-amber-950/30 dark:to-emerald-950/10 border border-amber-200/80 dark:border-amber-800/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
              <Mountain size={18} />
              <span>Terre (Turābī)</span>
            </div>
            <span className="text-lg font-black text-amber-800 dark:text-amber-300">
              {elemental.earth.percentage}%
            </span>
          </div>
          <div className="w-full bg-amber-200/60 dark:bg-amber-900/40 rounded-full h-2.5 overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-amber-600 to-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${elemental.earth.percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-300 font-medium">
            <span>{elemental.earth.count} lettre(s)</span>
            <span>Poids: {calculation.activeSystem === 'maghribi' ? elemental.earth.weightMaghribi : elemental.earth.weightMashriqi}</span>
          </div>
        </div>
      </div>

      {/* Temperament Diagnosis Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-2">
          <Info size={18} />
          <span>Diagnostic du Tempérament Spirituel (Mizāj al-Ism)</span>
        </div>
        <h4 className="text-base font-extrabold text-gray-900 dark:text-white mb-1">
          {elemental.temperamentTitleFr}
        </h4>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {elemental.temperamentDescFr}
        </p>
      </div>

      {/* Luminous (Nūrāniyya) vs Dark (Zulmāniyya) Analysis */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-gray-900 via-slate-900 to-indigo-950 text-white shadow-lg border border-indigo-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-indigo-800/40">
          <div>
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-cyan-400" />
              <h3 className="font-extrabold text-base text-cyan-100">
                Classification des 14 Lettres Lumineuses vs 14 Sombres
              </h3>
            </div>
            <p className="text-xs text-indigo-200/80 mt-0.5">
              Mnémonique sacré : <span className="font-arabic font-bold text-cyan-300">« نَصٌّ حَكِيمٌ قَاطِعٌ لَهُ سِرٌّ »</span>
            </p>
          </div>
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-bold border border-cyan-400/30">
            {radiance.statusFr}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Luminous Box */}
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Sun size={18} />
                <span>Lettres Lumineuses (Nūrāniyya)</span>
              </div>
              <span className="text-xl font-black text-cyan-300">{radiance.luminousPercentage}%</span>
            </div>
            <p className="text-xs text-cyan-100/70 mb-3">
              Associées aux sphères célestes, aux anges et aux secrets de la révélation coranique.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {radiance.luminousChars.length > 0 ? (
                radiance.luminousChars.map((ch, idx) => (
                  <span
                    key={idx}
                    className="w-8 h-8 flex items-center justify-center font-arabic font-bold text-base bg-cyan-500/20 text-cyan-200 rounded-lg border border-cyan-400/40 shadow-xs"
                  >
                    {ch}
                  </span>
                ))
              ) : (
                <span className="text-xs text-cyan-300/60 italic">Aucune consonne lumineuse présente</span>
              )}
            </div>
            <div className="mt-3 text-[11px] text-cyan-200/80 flex justify-between font-medium pt-2 border-t border-cyan-800/40">
              <span>{radiance.luminousCount} lettre(s)</span>
              <span>Poids lumineux : {radiance.luminousWeight}</span>
            </div>
          </div>

          {/* Dark Box */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                <Moon size={18} />
                <span>Lettres Sombres (Zulmāniyya)</span>
              </div>
              <span className="text-xl font-black text-indigo-300">{radiance.darkPercentage}%</span>
            </div>
            <p className="text-xs text-indigo-100/70 mb-3">
              Associées au monde physique, aux corps matériels et aux réceptacles de la manifestation.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {radiance.darkChars.length > 0 ? (
                radiance.darkChars.map((ch, idx) => (
                  <span
                    key={idx}
                    className="w-8 h-8 flex items-center justify-center font-arabic font-bold text-base bg-indigo-500/20 text-indigo-200 rounded-lg border border-indigo-400/40 shadow-xs"
                  >
                    {ch}
                  </span>
                ))
              ) : (
                <span className="text-xs text-indigo-300/60 italic">Aucune consonne sombre présente</span>
              )}
            </div>
            <div className="mt-3 text-[11px] text-indigo-200/80 flex justify-between font-medium pt-2 border-t border-indigo-800/40">
              <span>{radiance.darkCount} lettre(s)</span>
              <span>Poids matériel : {radiance.darkWeight}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Letter-by-Letter Table */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-xs">
        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-3">
          Anatomie Détaillée Caractère par Caractère
        </h4>
        <div className="overflow-x-auto">
          <div className="flex flex-wrap gap-2">
            {characters.map((item, idx) => {
              const val = calculation.activeSystem === 'maghribi' ? item.valMaghribi : item.valMashriqi;
              const elemBadge =
                item.element === 'fire'
                  ? 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800'
                  : item.element === 'air'
                  ? 'bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800'
                  : item.element === 'water'
                  ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
                  : 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/80 min-w-[65px]"
                >
                  <span className="font-arabic font-extrabold text-xl text-gray-900 dark:text-white">
                    {item.char}
                  </span>
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400 mt-0.5">
                    {val}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border mt-1 ${elemBadge}`}>
                    {item.element.toUpperCase()}
                  </span>
                  <span
                    className={`text-[8px] font-semibold mt-1 ${
                      item.nature === 'luminous'
                        ? 'text-cyan-600 dark:text-cyan-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {item.nature === 'luminous' ? '✨ Lumineuse' : '🌑 Sombre'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
