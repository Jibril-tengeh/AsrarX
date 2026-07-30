import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, Filter, Shield, Key, HeartPulse, Crown, DollarSign, BookOpen, ChevronRight, Play } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { BARHATIAH_28_NAMES, BARHATIAH_GRAND_RECIPES, BarhatiahNameSecret, BarhatiahRecipe } from '../../data/barhatiahSecrets';

interface SmartProblemSearchWidgetProps {
  onSelectName?: (name: BarhatiahNameSecret) => void;
  onSelectRecipe?: (recipe: BarhatiahRecipe) => void;
  onOpenTasbih?: (name: BarhatiahNameSecret) => void;
}

export const SmartProblemSearchWidget: React.FC<SmartProblemSearchWidgetProps> = ({
  onSelectName,
  onSelectRecipe,
  onOpenTasbih,
}) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', icon: Sparkles, labelFr: 'Tout', labelEn: 'All', labelHa: 'Dukkaninsu' },
    { id: 'prosperity', icon: DollarSign, labelFr: 'Dettes & Richesse', labelEn: 'Debt & Prosperity', labelHa: 'Bashi & Arziqi' },
    { id: 'protection', icon: Shield, labelFr: 'Protection & Cauchemars', labelEn: 'Protection & Exorcism', labelHa: 'Kariya & Firgita' },
    { id: 'charisma', icon: Crown, labelFr: 'Charisme & Prestige', labelEn: 'Charisma & Prestige', labelHa: 'Kwarjini & Daukaka' },
    { id: 'doors', icon: Key, labelFr: 'Ouverture des Portes', labelEn: 'Unlocking Doors', labelHa: 'Bude Kofofi' },
    { id: 'healing', icon: HeartPulse, labelFr: 'Guérison & Santé', labelEn: 'Healing & Health', labelHa: 'Lafiya & Magani' },
  ];

  // Search logic
  const query = searchTerm.toLowerCase();

  const filteredRecipes = BARHATIAH_GRAND_RECIPES.filter((rec) => {
    const matchesCat = activeCategory === 'all' || rec.category === activeCategory;
    const matchesSearch =
      !searchTerm ||
      rec.titleAr.includes(searchTerm) ||
      rec.titleFr.toLowerCase().includes(query) ||
      rec.titleEn.toLowerCase().includes(query) ||
      rec.titleHa.toLowerCase().includes(query) ||
      rec.descriptionFr.toLowerCase().includes(query) ||
      rec.descriptionEn.toLowerCase().includes(query) ||
      rec.descriptionHa.toLowerCase().includes(query);

    return matchesCat && matchesSearch;
  });

  const filteredNames = BARHATIAH_28_NAMES.filter((item) => {
    const matchesSearch =
      searchTerm &&
      (item.nameAr.includes(searchTerm) ||
        item.nameTranslit.toLowerCase().includes(query) ||
        item.secretFr.toLowerCase().includes(query) ||
        item.secretEn.toLowerCase().includes(query) ||
        item.secretHa.toLowerCase().includes(query) ||
        item.recipeFr.toLowerCase().includes(query) ||
        item.recipeEn.toLowerCase().includes(query) ||
        item.recipeHa.toLowerCase().includes(query));

    return matchesSearch;
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black p-5 sm:p-7 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
            <Search size={22} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-amber-300 flex items-center gap-2">
              {language === 'ha'
                ? 'Neman Magani bisa Matsala ko Bukata (Search)'
                : language === 'en'
                ? 'Smart Problem / Need Search Engine'
                : 'Module de Recherche Intelligente par Besoin / Problème'}
              <span className="text-xs font-arabic px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                البَحْثُ الذَّكِيُّ
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              {language === 'ha'
                ? "Rubuta matsalarka (misali: \"Dettes\", \"Cauchemars\", \"Kwarjini\") domin samun asiri da addu'a"
                : language === 'en'
                ? 'Type your need (e.g. "debt", "nightmares", "charisma") to get instant matching recipes & zikr'
                : 'Tapez votre problème (ex: "dettes", "cauchemars", "protection") pour trouver la recette et le zikr adaptés'}
            </p>
          </div>
        </div>
      </div>

      {/* Input Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={
            language === 'ha'
              ? 'Nemi bayani (misali: Dettes, Cauchemars, Commerce, Kwarjini, Maita...)'
              : language === 'en'
              ? 'Search issue (e.g., Debt, Nightmares, Protection, Charisma, Healing...)'
              : 'Tapez votre besoin (ex: Dettes, Cauchemars, Protection, Commerce, Prestige...)'
          }
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-900 border-2 border-amber-500/40 text-amber-200 text-sm focus:outline-none focus:border-amber-400 font-medium"
        />
      </div>

      {/* Quick Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-gray-950 shadow-lg'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={14} />
              <span>{language === 'ha' ? cat.labelHa : language === 'en' ? cat.labelEn : cat.labelFr}</span>
            </button>
          );
        })}
      </div>

      {/* Search Results Display */}
      <div className="space-y-4">
        {/* Grand Recipes Results */}
        {filteredRecipes.length > 0 && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              {language === 'ha' ? 'Hanyoyin Aiki da Babban Sirri (Grand Recipes):' : language === 'en' ? 'Matching Grand Recipes:' : 'Recettes Majeures Détectées :'} ({filteredRecipes.length})
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredRecipes.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => onSelectRecipe && onSelectRecipe(rec)}
                  className="p-4 rounded-2xl bg-gradient-to-r from-gray-950 via-amber-950/20 to-black border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer space-y-2 shadow-lg group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-300 group-hover:text-amber-200 transition-colors line-clamp-1">
                      {language === 'ha' ? rec.titleHa : language === 'en' ? rec.titleEn : rec.titleFr}
                    </span>
                    <span className="font-arabic text-sm text-amber-400 font-bold shrink-0">
                      {rec.titleAr.split(' ')[0]}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 line-clamp-2">
                    {language === 'ha' ? rec.descriptionHa : language === 'en' ? rec.descriptionEn : rec.descriptionFr}
                  </p>

                  <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[10px] text-amber-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} />
                      {rec.category.toUpperCase()}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      {language === 'ha' ? 'Duba Cikakken Bayani' : language === 'en' ? 'View Protocol' : 'Voir Protocole'} →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Barhatiah Names Results */}
        {filteredNames.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-gray-800">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              {language === 'ha' ? 'Sunaye na Barhatiah da Kuka Nema:' : language === 'en' ? 'Matching Barhatiah Names:' : 'Noms de la Barhatiah Recommandés :'} ({filteredNames.length})
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredNames.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-gradient-to-r from-gray-950 via-gray-900 to-black border border-amber-500/30 space-y-2.5 shadow-lg"
                >
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-arabic text-lg font-bold text-amber-300">
                        {item.nameAr}
                      </span>
                      <span className="text-xs text-amber-200 font-mono">
                        ({item.nameTranslit})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenTasbih && onOpenTasbih(item)}
                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold rounded-lg border border-amber-500/40 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Play size={10} />
                      <span>Tasbih ({item.abjadWeight})</span>
                    </button>
                  </div>

                  <p className="text-xs text-amber-100 italic bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20">
                    "{language === 'ha' ? item.secretHa : language === 'en' ? item.secretEn : item.secretFr}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
