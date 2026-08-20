import React, { useState } from 'react';
import { Leaf, Sparkles, Search, BookOpen, Sun, Moon, Shield, Filter, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { SACRED_PLANTS_LIBRARY, PlantItem } from '../../data/comparativeTraditionsData';

interface SacredPlantsLibraryTabProps {
  t: any;
  lang: 'fr' | 'en' | 'ha';
}

export const SacredPlantsLibraryTab: React.FC<SacredPlantsLibraryTabProps> = ({ t, lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanetFilter, setSelectedPlanetFilter] = useState('all');
  const [selectedPlant, setSelectedPlant] = useState<PlantItem | null>(SACRED_PLANTS_LIBRARY[0] || null);

  const filteredPlants = SACRED_PLANTS_LIBRARY.filter(plant => {
    const matchesSearch =
      plant.nameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.nameHa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.botanicalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.arabicName.includes(searchTerm);

    const matchesPlanet = selectedPlanetFilter === 'all' || plant.planetaryRuler.toLowerCase().includes(selectedPlanetFilter.toLowerCase());

    return matchesSearch && matchesPlanet;
  });

  const getPlantName = (plant: PlantItem) => {
    if (lang === 'ha') return plant.nameHa;
    if (lang === 'en') return plant.nameEn;
    return plant.nameFr;
  };

  const getVirtues = (plant: PlantItem) => {
    if (lang === 'ha') return plant.symbolicVirtuesHa;
    if (lang === 'en') return plant.symbolicVirtuesEn;
    return plant.symbolicVirtuesFr;
  };

  const getUses = (plant: PlantItem) => {
    if (lang === 'ha') return plant.traditionalUsesHa;
    if (lang === 'en') return plant.traditionalUsesEn;
    return plant.traditionalUsesFr;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-amber-500/10 border border-emerald-500/20 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
            <Leaf className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {t.plants.title}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono">
                {SACRED_PLANTS_LIBRARY.length} Plantes & Résines Répertoriées
              </span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {t.plants.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.plants.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={selectedPlanetFilter}
          onChange={(e) => setSelectedPlanetFilter(e.target.value)}
          className="px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">{t.plants.allPlanets}</option>
          <option value="soleil">Soleil (Sun)</option>
          <option value="lune">Lune (Moon)</option>
          <option value="mars">Mars</option>
          <option value="mercure">Mercure (Mercury)</option>
          <option value="jupiter">Jupiter</option>
          <option value="vénus">Vénus (Venus)</option>
          <option value="saturne">Saturne (Saturn)</option>
        </select>
      </div>

      {/* Plants Grid & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List of Plants */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
          {filteredPlants.map((plant) => {
            const isSelected = selectedPlant?.id === plant.id;
            return (
              <button
                key={plant.id}
                type="button"
                onClick={() => setSelectedPlant(plant)}
                className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      {getPlantName(plant)}
                    </h4>
                    <p className="text-xs text-gray-400 italic">
                      {plant.botanicalName}
                    </p>
                  </div>
                  <span className="text-xs font-arabic text-emerald-600 dark:text-emerald-400">
                    {plant.arabicName}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                  <span className="font-medium text-amber-600 dark:text-amber-400">{plant.planetaryRuler}</span>
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 font-mono text-[10px]">{plant.type}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Plant Detail Card */}
        {selectedPlant && (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/60 to-amber-50/40 dark:from-emerald-950/40 dark:via-slate-900/40 dark:to-amber-950/30 border border-emerald-200 dark:border-emerald-500/30 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                Monographie Botanique
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-semibold">
                {selectedPlant.type}
              </span>
            </div>

            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                {getPlantName(selectedPlant)}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-0.5">
                {selectedPlant.botanicalName}
              </p>
              <p className="text-base font-arabic text-emerald-700 dark:text-emerald-400 mt-1 font-bold">
                {selectedPlant.arabicName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-white dark:bg-gray-800/70 border border-emerald-100 dark:border-gray-700/50 shadow-sm">
                <span className="text-gray-500 dark:text-gray-400 block text-[10px] uppercase font-bold">{t.plants.rulingPlanet}</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">{selectedPlant.planetaryRuler}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-gray-800/70 border border-emerald-100 dark:border-gray-700/50 shadow-sm">
                <span className="text-gray-500 dark:text-gray-400 block text-[10px] uppercase font-bold">{t.plants.element}</span>
                <span className="font-bold text-gray-900 dark:text-white">{selectedPlant.element}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
              <div>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">
                  {t.plants.symbolicVirtues}:
                </span>
                <p className="bg-white dark:bg-gray-800/70 p-3 rounded-xl border border-emerald-100 dark:border-gray-700/40 leading-relaxed shadow-sm">
                  {getVirtues(selectedPlant)}
                </p>
              </div>

              <div>
                <span className="font-semibold text-amber-700 dark:text-amber-400 block mb-1">
                  {t.plants.traditionalUses}:
                </span>
                <p className="bg-white dark:bg-gray-800/70 p-3 rounded-xl border border-emerald-100 dark:border-gray-700/40 leading-relaxed shadow-sm">
                  {getUses(selectedPlant)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/70 text-[11px] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-transparent">
                <span className="font-bold block text-gray-800 dark:text-gray-200 mb-0.5">{t.plants.sourcesTitle}:</span>
                {selectedPlant.historicalSources}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
