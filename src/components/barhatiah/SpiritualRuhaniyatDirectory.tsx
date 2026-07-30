import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Filter, Search, Crown, Flame, Compass, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { BARHATIAH_28_NAMES, BarhatiahNameSecret } from '../../data/barhatiahSecrets';

export const SpiritualRuhaniyatDirectory: React.FC = () => {
  const { language } = useLanguage();
  const [elementFilter, setElementFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredNames = BARHATIAH_28_NAMES.filter((item) => {
    const matchesElement = elementFilter === 'all' || item.element.toLowerCase() === elementFilter.toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      item.nameAr.includes(searchTerm) ||
      item.nameTranslit.toLowerCase().includes(query) ||
      item.divineAttributeFr.toLowerCase().includes(query) ||
      item.divineAttributeEn.toLowerCase().includes(query) ||
      item.divineAttributeHa.toLowerCase().includes(query) ||
      item.lunarMansion.toLowerCase().includes(query);

    return matchesElement && matchesSearch;
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black p-5 sm:p-7 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 text-white">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
            <Crown size={22} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-amber-300 flex items-center gap-2">
              {language === 'ha'
                ? 'Ruhaniyat da Mala\'ikun Barhatiah 28'
                : language === 'en'
                ? 'Ruhaniyat & Angelic Correspondences of the 28 Names'
                : 'Répertoire des Correspondances Angéliques & Rois Spirituels'}
              <span className="text-xs font-arabic px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                المَلاَئِكَةُ وَالرُّوحَانِيَّاتُ
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              {language === 'ha'
                ? 'Tsarin haɗin Asma Allah al-Husna, Mala\'iku, Haruffa da Sinadirai na Barhatiah'
                : language === 'en'
                ? 'Matrix of Divine Attributes, Heavenly Angels, Arabic Letters, and Elemental Rulers'
                : 'Matrice sacrée associant Noms Divins, Anges Célestes, Lettres Arabes et Éléments'}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              language === 'ha'
                ? 'Nemi mala\'ika, suna ko harf...'
                : language === 'en'
                ? 'Search name, angel, letter or attribute...'
                : 'Rechercher nom, ange, lettre, attribut...'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-amber-500/30 text-amber-200 text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Element Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: language === 'ha' ? 'Duk Sinadirai' : language === 'en' ? 'All Elements' : 'Tous' },
            { id: 'Feu', label: '🔥 Feu (Nar)' },
            { id: 'Air', label: '💨 Air (Hawa)' },
            { id: 'Eau', label: '💧 Eau (Ma)' },
            { id: 'Terre', label: '🌱 Terre (Turab)' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setElementFilter(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                elementFilter === btn.id
                  ? 'bg-amber-500 text-gray-950 shadow-md'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Matrix of 28 Names Ruhaniyat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNames.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-gradient-to-r from-gray-950 via-gray-900 to-black border border-amber-500/30 hover:border-amber-400/60 transition-all space-y-3 shadow-lg group"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold flex items-center justify-center border border-amber-500/30">
                  {item.id}
                </span>
                <span className="font-arabic text-lg font-extrabold text-amber-300 dir-rtl">
                  {item.nameAr}
                </span>
                <span className="text-xs text-amber-200 font-mono">
                  ({item.nameTranslit})
                </span>
              </div>

              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Abjad: {item.abjadWeight}
              </span>
            </div>

            {/* Matrix Data */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Divine Attribute */}
              <div className="p-2 rounded-xl bg-black/60 border border-gray-800 space-y-0.5">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                  {language === 'ha' ? 'Suna na Allah (Asma Husna):' : language === 'en' ? 'Divine Attribute:' : 'Attribut Divin :'}
                </span>
                <span className="font-arabic font-bold text-amber-300 block">
                  {item.divineAttributeAr}
                </span>
              </div>

              {/* Angelic Ruler */}
              <div className="p-2 rounded-xl bg-black/60 border border-gray-800 space-y-0.5">
                <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider block">
                  {language === 'ha' ? 'Mala\'ika (Al-Malak):' : language === 'en' ? 'Heavenly Angel Ruler:' : 'Ange Céleste Gouverneur :'}
                </span>
                <span className="font-bold text-indigo-200 block flex items-center gap-1">
                  <Shield size={12} className="text-indigo-400" />
                  {item.nameTranslit.endsWith('in') ? `Malak ${item.nameTranslit}iya'il` : `Malak ${item.nameTranslit}`}
                </span>
              </div>

              {/* Lunar Mansion */}
              <div className="p-2 rounded-xl bg-black/60 border border-gray-800 space-y-0.5">
                <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider block">
                  {language === 'ha' ? 'Manzil (Demeure):' : language === 'en' ? 'Lunar Mansion:' : 'Demeure Lunaire :'}
                </span>
                <span className="font-semibold text-purple-200 block truncate">
                  {item.lunarMansion}
                </span>
              </div>

              {/* Element */}
              <div className="p-2 rounded-xl bg-black/60 border border-gray-800 space-y-0.5">
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">
                  {language === 'ha' ? 'Sinadiri (Element):' : language === 'en' ? 'Element:' : 'Élément :'}
                </span>
                <span className="font-semibold text-amber-200 block">
                  {item.element}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
