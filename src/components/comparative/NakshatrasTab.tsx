import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Star, Compass, Moon, BookOpen, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NAKSHATRAS_LIST, NakshatraItem } from '../../data/comparativeTraditionsData';

interface NakshatrasTabProps {
  t: any;
  lang: 'fr' | 'en' | 'ha';
}

export const NakshatrasTab: React.FC<NakshatrasTabProps> = ({ t, lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGana, setSelectedGana] = useState<string>('all');
  const [selectedElement, setSelectedElement] = useState<string>('all');
  const [selectedNakshatra, setSelectedNakshatra] = useState<NakshatraItem | null>(null);

  const filteredNakshatras = useMemo(() => {
    return NAKSHATRAS_LIST.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.deity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ruler.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.arabicManzilName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.zodiacSign.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGana = selectedGana === 'all' || item.gana === selectedGana;
      const matchesElement = selectedElement === 'all' || item.element === selectedElement;

      return matchesSearch && matchesGana && matchesElement;
    });
  }, [searchTerm, selectedGana, selectedElement]);

  const getQualityText = (item: NakshatraItem) => {
    if (lang === 'ha') return item.qualitiesHa;
    if (lang === 'en') return item.qualitiesEn;
    return item.qualitiesFr;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-indigo-500/10 border border-amber-500/20 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30">
            <Moon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {t.nakshatras.title}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono">
                27 Mansions
              </span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {t.nakshatras.subtitle}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 leading-relaxed bg-white/50 dark:bg-gray-800/50 p-3.5 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
          <Info className="inline w-4 h-4 mr-1 text-amber-500" />
          {t.nakshatras.vedicExplanation}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.nakshatras.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all shadow-sm"
          />
        </div>

        <select
          value={selectedGana}
          onChange={(e) => setSelectedGana(e.target.value)}
          className="px-4 py-2.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all shadow-sm"
        >
          <option value="all">{t.nakshatras.allGanas}</option>
          <option value="Deva">Deva (Divin / Sattva)</option>
          <option value="Manushya">Manushya (Humain / Rajas)</option>
          <option value="Rakshasa">Rakshasa (Pénétrant / Tamas)</option>
        </select>

        <select
          value={selectedElement}
          onChange={(e) => setSelectedElement(e.target.value)}
          className="px-4 py-2.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all shadow-sm"
        >
          <option value="all">{t.nakshatras.allElements}</option>
          <option value="Feu">Feu (Tejas)</option>
          <option value="Terre">Terre (Prithvi)</option>
          <option value="Air">Air (Vayu)</option>
          <option value="Eau">Eau (Jala)</option>
          <option value="Éther">Éther (Akasha)</option>
        </select>
      </div>

      {/* Grid of Nakshatras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNakshatras.map((nakshatra) => {
          const isSelected = selectedNakshatra?.id === nakshatra.id;
          return (
            <motion.div
              key={nakshatra.id}
              layout
              onClick={() => setSelectedNakshatra(isSelected ? null : nakshatra)}
              className={`p-5 rounded-3xl cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-500/15 via-purple-500/10 to-indigo-500/15 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-white dark:bg-gray-800/90 border-gray-200 dark:border-gray-700/70 hover:border-amber-500/40 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    #{nakshatra.id} Nakshatra
                  </span>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-1.5 flex items-center gap-2">
                    {nakshatra.name}
                    <span className="text-xs font-serif text-gray-500 dark:text-gray-400 font-normal">
                      {nakshatra.sanskrit}
                    </span>
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold px-2 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                    {nakshatra.ruler}
                  </span>
                </div>
              </div>

              {/* Specs */}
              <div className="mt-3.5 space-y-1.5 text-xs text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700/60 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t.nakshatras.span}:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-200">{nakshatra.degrees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t.nakshatras.deity}:</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">{nakshatra.deity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t.nakshatras.symbol}:</span>
                  <span className="font-medium">{nakshatra.symbol}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-dashed border-gray-200 dark:border-gray-700/50">
                  <span className="text-gray-400">{t.nakshatras.manzilEquiv}:</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{nakshatra.arabicManzilName}</span>
                </div>
              </div>

              {/* Qualities & Mantra */}
              <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-gray-700/60">
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                  {getQualityText(nakshatra)}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-500/20">
                  <span>{t.nakshatras.mantra}:</span>
                  <span className="font-bold">{nakshatra.bijaMantra}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
