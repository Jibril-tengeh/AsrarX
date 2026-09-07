import React, { useState, useEffect } from 'react';
import { Clock, Moon, Sun, Compass, Sparkles, ArrowRight, Play, Flame, Wind, Droplet, Globe, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { getCurrentCelestialContext } from '../utils/celestial';

export const CelestialRecommendations: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [context, setContext] = useState(getCurrentCelestialContext());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Update celestial context every minute
    const interval = setInterval(() => {
      setContext(getCurrentCelestialContext());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const { planet, mansion } = context;

  const isFr = language === 'fr';
  const isHa = language === 'ha';

  const getTranslatedNature = (nature: string) => {
    if (nature === 'Bénéfique' || nature === 'Très Bénéfique') {
      return isFr ? nature : isHa ? 'Mai Albarka' : 'Propitious';
    }
    if (nature === 'Maléfique') {
      return isFr ? 'Maléfique' : isHa ? 'Mai Haɗari' : 'Unpropitious';
    }
    return isFr ? 'Mixte' : isHa ? 'Gauraye' : 'Mixed';
  };

  const getElementIcon = (element: string) => {
    switch (element.toLowerCase()) {
      case 'feu':
        return <Flame className="text-red-500" size={16} />;
      case 'air':
        return <Wind className="text-sky-500" size={16} />;
      case 'eau':
        return <Droplet className="text-blue-500" size={16} />;
      default:
        return <Globe className="text-emerald-500" size={16} />;
    }
  };

  const getTranslatedElement = (element: string) => {
    switch (element.toLowerCase()) {
      case 'feu': return isFr ? 'Feu' : isHa ? 'Wuta' : 'Fire';
      case 'air': return isFr ? 'Air' : isHa ? 'Iska' : 'Air';
      case 'eau': return isFr ? 'Eau' : isHa ? 'Ruwa' : 'Water';
      default: return isFr ? 'Terre' : isHa ? 'Ƙasa' : 'Earth';
    }
  };

  const startPractice = () => {
    const nameEnc = encodeURIComponent(planet.recommendedWird.name);
    const arabicEnc = encodeURIComponent(planet.recommendedWird.arabic);
    const targetVal = planet.recommendedWird.count;
    navigate(`/tools/tasbih?name=${nameEnc}&arabic=${arabicEnc}&target=${targetVal}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center relative z-10 cursor-pointer select-none group/header"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="text-indigo-500 animate-[pulse_2s_infinite] shrink-0" size={20} />
          <h2 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg group-hover/header:text-indigo-600 dark:group-hover/header:text-indigo-400 transition-colors">
            {isFr ? "Recommandations Célestes de l'Instant" : isHa ? "Shawarin Sararin Samaniya Na Yanzu" : "Celestial Recommendations of the Moment"}
          </h2>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:flex text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full items-center gap-1">
            <Clock size={12} />
            {planet.timeStart} - {planet.timeEnd}
          </span>
          <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 group-hover/header:bg-indigo-50 dark:group-hover/header:bg-indigo-950/40 group-hover/header:text-indigo-600 dark:group-hover/header:text-indigo-400 transition-all">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>

      {/* Mobile time start/end when collapsed */}
      {!isOpen && (
        <div className="flex sm:hidden mt-2 relative z-10">
          <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock size={12} />
            {planet.timeStart} - {planet.timeEnd}
          </span>
        </div>
      )}

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 20 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden relative z-10"
          >
            {/* Grid containing Planet & Mansion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {/* Planet Hour Box */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 flex items-start gap-3">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm shrink-0">
                  {planet.isDay ? (
                    <Sun className="text-amber-500" size={20} />
                  ) : (
                    <Moon className="text-indigo-400" size={20} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {isFr ? `Heure planétaire ${planet.hourIndex}/12` : isHa ? `Awar Tauraro ${planet.hourIndex}/12` : `Planetary hour ${planet.hourIndex}/12`}
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                      {isFr ? planet.name : planet.id === 'sun' ? 'Sun' : planet.id === 'venus' ? 'Venus' : planet.id === 'mercury' ? 'Mercury' : planet.id === 'moon' ? 'Moon' : planet.id === 'saturn' ? 'Saturn' : planet.id === 'jupiter' ? 'Jupiter' : 'Mars'}
                    </h3>
                    <span className="text-xs font-arabic text-gray-400 dark:text-gray-500" dir="rtl">{planet.arabic}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {isFr ? planet.desc : planet.id === 'sun' ? 'Success, power, healing, illumination' : planet.id === 'venus' ? 'Love, beauty, attraction, harmony' : planet.id === 'mercury' ? 'Communication, intelligence, commerce, speed' : planet.id === 'moon' ? 'Dreams, intuition, emotions, water magic' : planet.id === 'saturn' ? 'Discipline, karma, protection, banishing' : planet.id === 'jupiter' ? 'Luck, wealth, expansion, justice' : 'Courage, strength, conflict, victory'}
                  </p>
                </div>
              </div>

              {/* Lunar Mansion Box */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 flex items-start gap-3">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm shrink-0">
                  <Compass className="text-indigo-500" size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    {isFr ? `Demeure Lunaire #${mansion.id}` : isHa ? `Gidan Wata #${mansion.id}` : `Lunar Mansion #${mansion.id}`}
                    <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                      mansion.nature.includes('Bénéfique') ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400' :
                      mansion.nature.includes('Maléfique') ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400'
                    }`}>
                      {getTranslatedNature(mansion.nature)}
                    </span>
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                      {mansion.name}
                    </h3>
                    <span className="text-xs font-arabic text-gray-400 dark:text-gray-500" dir="rtl">{mansion.arabic}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400 mt-1">
                    {getElementIcon(mansion.element)}
                    <span>{isFr ? "Élément" : isHa ? "Hali" : "Element"} : {getTranslatedElement(mansion.element)}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {isFr ? mansion.descFr : isHa ? mansion.descHa : mansion.descEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Suggested Wird Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 dark:border-indigo-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 flex flex-col items-center justify-center shadow-md border border-indigo-500/10">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 leading-none">{planet.recommendedWird.count}x</span>
                  <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold mt-1">recits</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {isFr ? "Wird optimal recommandé" : isHa ? "Zikiri da aka shawarta" : "Recommended optimal wird"}
                  </span>
                  <h4 className="font-bold text-gray-900 dark:text-white text-base mt-0.5 flex items-baseline gap-2 flex-wrap">
                    <span>{planet.recommendedWird.name}</span>
                    <span className="text-sm font-arabic text-indigo-500 font-semibold" dir="rtl">{planet.recommendedWird.arabic}</span>
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                    {isFr ? planet.recommendedWird.benefitFr : isHa ? planet.recommendedWird.benefitHa : planet.recommendedWird.benefitEn}
                  </p>
                </div>
              </div>
              <button
                onClick={startPractice}
                className="shrink-0 px-5 py-3 w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play size={14} fill="currentColor" />
                <span>{isFr ? "Lancer le Tasbih" : isHa ? "Fara Tasbihi" : "Start Tasbih"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
