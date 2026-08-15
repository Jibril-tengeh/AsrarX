import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Clock, 
  Compass, 
  ChevronRight, 
  ShieldCheck, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain,
  Sun,
  Moon,
  Zap,
  Bookmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { PlanetaryModalData } from '../../utils/notificationRouter';
import { getCurrentPlanetaryHour, multilingualPlanets } from '../../utils/planetaryNotifications';

interface PlanetaryHourDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PlanetaryModalData | null;
}

const PLANETARY_DETAILS: Record<number, {
  element: { fr: string; en: string; ha: string };
  elementIcon: string;
  angel: string;
  zikr: string;
  recommendedWorks: { fr: string; en: string; ha: string };
  color: string;
  accentBg: string;
}> = {
  0: { // Soleil
    element: { fr: 'Feu Sacré', en: 'Sacred Fire', ha: 'Wuta Mai Tsarki' },
    elementIcon: 'fire',
    angel: 'Rūqyā’īl (روقيائيل)',
    zikr: 'Yā Hayyu Yā Qayyūm (يا حي يا قيوم) - 174 fois',
    recommendedWorks: {
      fr: 'Rayonnement, prestige, autorité, charisme et réussite auprès des gouvernants.',
      en: 'Radiance, authority, prestige, charisma, and success with leaders.',
      ha: 'Daukaka, kwarjini, iko da samun nasara a wajen shugabanni.',
    },
    color: 'from-amber-500 to-yellow-600',
    accentBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  },
  1: { // Vénus
    element: { fr: 'Air Harmonieux', en: 'Harmonious Air', ha: 'Iska Mai Dadi' },
    elementIcon: 'air',
    angel: '‘Anyā’īl (عنيائيل)',
    zikr: 'Yā Wadūd Yā Jāmi‘ (يا ودود يا جامع) - 114 fois',
    recommendedWorks: {
      fr: 'Amour, réconciliation, attraction, paix familiale, mariage et bien-être.',
      en: 'Love, reconciliation, attraction, family peace, marriage, and well-being.',
      ha: 'Soyayya, sulhu, jituwa, zaman lafiya na iyali da aure.',
    },
    color: 'from-emerald-500 to-teal-600',
    accentBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  },
  2: { // Mercure
    element: { fr: 'Terre & Souffle', en: 'Earth & Breath', ha: 'Kasa da Iska' },
    elementIcon: 'wind',
    angel: 'Mīkhā’īl (ميخائيل)',
    zikr: 'Yā ‘Alīm Yā Hakīm (يا عليم يا حكيم) - 150 fois',
    recommendedWorks: {
      fr: 'Étude des sciences mystiques, commerce, rédaction de traités, diplomatie et sagesse.',
      en: 'Mystical studies, commerce, talismanic writing, diplomacy, and wisdom.',
      ha: 'Neman ilmi, kasuwanci, rubuce-rubucen asirai da fasaha.',
    },
    color: 'from-cyan-500 to-blue-600',
    accentBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
  },
  3: { // Lune
    element: { fr: 'Eau Pure', en: 'Pure Water', ha: 'Ruwa Mai Tsarki' },
    elementIcon: 'water',
    angel: 'Jibrā’īl (جبرائيل)',
    zikr: 'Yā Salām Yā Latīf (يا سلام يا لطيف) - 129 fois',
    recommendedWorks: {
      fr: 'Voyages, purification, rêves prémonitoires, protection nocturne et apaisement.',
      en: 'Journeys, spiritual purification, prophetic dreams, and emotional peace.',
      ha: 'Tafiye-tafiye, tsarkake zuciya, mafarkai na gaskiya da kariya.',
    },
    color: 'from-blue-400 to-indigo-600',
    accentBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  },
  4: { // Saturne
    element: { fr: 'Terre Sombre', en: 'Deep Earth', ha: 'Kasa Mai Nauyi' },
    elementIcon: 'earth',
    angel: 'Kasfiyā’īl (كسفيائيل)',
    zikr: 'Yā Qahhār Yā Mumīt (يا قهار يا مميت) - 306 fois',
    recommendedWorks: {
      fr: 'Bannissement des énergies négatives, clôtures de protection, endurance et patience.',
      en: 'Banishing negative energies, spiritual shields, discipline, and perseverance.',
      ha: 'Kore muggan abubuwa, katangar kariya, hakuri da juriya.',
    },
    color: 'from-gray-600 to-slate-800',
    accentBg: 'bg-slate-500/10 border-slate-500/30 text-slate-300',
  },
  5: { // Jupiter
    element: { fr: 'Feu Majestueux', en: 'Royal Fire', ha: 'Wuta Mai Albarka' },
    elementIcon: 'fire',
    angel: 'Tsadqiyā’īl (صدقيائيل)',
    zikr: 'Yā Bāsit Yā Fattāh Yā Razzāq (يا باسط يا فتاح يا رزاق) - 308 fois',
    recommendedWorks: {
      fr: 'Richesse abondante, ouverture des portes fermées, victoire juridique et bienveillance.',
      en: 'Abundance, wealth, opening locked gates, divine victory, and fortune.',
      ha: 'Bude kofofin arziki, dukiya mai albarka, da samun nasara a dukkan lamari.',
    },
    color: 'from-purple-500 to-amber-600',
    accentBg: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
  },
  6: { // Mars
    element: { fr: 'Feu Ardent', en: 'Blazing Fire', ha: 'Wuta Mai Zafi' },
    elementIcon: 'fire',
    angel: 'Samsamā’īl (سمسمائيل)',
    zikr: 'Yā Qawiyyu Yā Matīn (يا قوي يا متين) - 116 fois',
    recommendedWorks: {
      fr: 'Courage, neutralisation des ennemis, défense énergétique et détermination absolue.',
      en: 'Courage, overcoming obstacles, energetic defense, and heroic resolve.',
      ha: 'Jarumtaka, karya sihirin makiya, kariya mai karfi da kwarin gwiwa.',
    },
    color: 'from-red-500 to-orange-600',
    accentBg: 'bg-red-500/10 border-red-500/30 text-red-400',
  },
};

export const PlanetaryHourDetailModal: React.FC<PlanetaryHourDetailModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const langKey = (language === 'ha' || language === 'en' ? language : 'fr') as 'fr' | 'en' | 'ha';

  const [currentPlanetIndex, setCurrentPlanetIndex] = useState<number>(0);
  const [currentHourNumber, setCurrentHourNumber] = useState<number>(1);
  const [isDaytime, setIsDaytime] = useState<boolean>(true);
  const [minutesRemaining, setMinutesRemaining] = useState<number>(35);

  useEffect(() => {
    if (initialData?.planetIndex !== undefined) {
      setCurrentPlanetIndex(initialData.planetIndex);
      if (initialData.hourNumber !== undefined) setCurrentHourNumber(initialData.hourNumber);
      if (initialData.isDaytime !== undefined) setIsDaytime(initialData.isDaytime);
    } else {
      const nowInfo = getCurrentPlanetaryHour();
      setCurrentPlanetIndex(nowInfo.planetIndex);
      setCurrentHourNumber(nowInfo.hourNumber);
      setIsDaytime(nowInfo.isDaytime);
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    // Dynamic remaining minutes estimation
    const now = new Date();
    const mins = 60 - (now.getMinutes() % 60);
    setMinutesRemaining(mins);
  }, [isOpen]);

  if (!isOpen) return null;

  const rawPlanet = multilingualPlanets[currentPlanetIndex] || multilingualPlanets[0];
  const details = PLANETARY_DETAILS[currentPlanetIndex] || PLANETARY_DETAILS[0];
  const planetName = rawPlanet.name[langKey] || rawPlanet.name.fr;
  const favorabilityText = rawPlanet.favorability[langKey] || rawPlanet.favorability.fr;

  const handleOpenPlanetaryTool = () => {
    onClose();
    navigate('/tools/planetary');
  };

  const handleOpenTasbihWithZikr = () => {
    onClose();
    navigate('/tools/tasbih');
  };

  return (
    <AnimatePresence>
      <div 
        id="planetary-hour-modal-overlay"
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          id="planetary-hour-modal-container"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-gray-900 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden w-full max-w-lg max-h-[92vh] text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Cosmic Header Banner */}
          <div className={`relative p-6 bg-gradient-to-br ${details.color} overflow-hidden`}>
            {/* Background Symbols Watermark */}
            <div className="absolute -right-4 -bottom-6 text-white/10 text-9xl font-serif select-none pointer-events-none">
              {rawPlanet.symbol}
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={14} className="animate-pulse" />
              <span>
                {language === 'fr' ? 'Heure Planétaire Active' : language === 'ha' ? 'Lokacin Tauraro Mai Aiki' : 'Active Planetary Hour'}
              </span>
              <span>•</span>
              <span>{isDaytime ? (language === 'fr' ? 'Jour' : 'Day') : (language === 'fr' ? 'Nuit' : 'Night')} H{currentHourNumber}</span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                  <span>{planetName}</span>
                  <span className="text-3xl">{rawPlanet.symbol}</span>
                </h2>
                <div className="text-xl font-serif text-white/90 mt-1 font-bold">
                  {rawPlanet.arabic}
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-2xl flex flex-col items-center">
                <Clock size={16} className="text-amber-200" />
                <span className="text-[11px] font-bold text-white/90 mt-0.5">
                  ~ {minutesRemaining} min
                </span>
                <span className="text-[9px] text-white/60">
                  {language === 'fr' ? 'restantes' : 'left'}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Body Content */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-gray-950/70">
            {/* Status / Favorability Pill */}
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${details.accentBg}`}>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={20} className="shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                    {language === 'fr' ? 'Influence Astrale' : 'Astral Influence'}
                  </div>
                  <div className="text-xs sm:text-sm font-bold">
                    {favorabilityText}
                  </div>
                </div>
              </div>
            </div>

            {/* Spiritual Parameters Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-gray-900/80 p-3 rounded-2xl border border-gray-800 flex items-center gap-2.5">
                {details.elementIcon === 'fire' && <Flame size={18} className="text-amber-500 shrink-0" />}
                {details.elementIcon === 'water' && <Droplets size={18} className="text-blue-400 shrink-0" />}
                {details.elementIcon === 'air' && <Wind size={18} className="text-teal-400 shrink-0" />}
                {details.elementIcon === 'earth' && <Mountain size={18} className="text-emerald-500 shrink-0" />}
                {details.elementIcon === 'wind' && <Zap size={18} className="text-cyan-400 shrink-0" />}
                <div>
                  <div className="text-gray-500 text-[10px] font-medium">{language === 'fr' ? 'Élément' : 'Element'}</div>
                  <div className="font-bold text-gray-200">{details.element[langKey] || details.element.fr}</div>
                </div>
              </div>

              <div className="bg-gray-900/80 p-3 rounded-2xl border border-gray-800 flex items-center gap-2.5">
                <Compass size={18} className="text-purple-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-gray-500 text-[10px] font-medium">{language === 'fr' ? 'Ange Gardien' : 'Guardian Angel'}</div>
                  <div className="font-bold text-gray-200 truncate">{details.angel}</div>
                </div>
              </div>
            </div>

            {/* Recommended Zikr & Invocations */}
            <div className="bg-gray-900/90 p-4 rounded-2xl border border-amber-500/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Bookmark size={15} />
                  <span>{language === 'fr' ? 'Zikr & Noms Divins Recommandés' : 'Recommended Zikr & Names'}</span>
                </div>
              </div>
              <div className="p-2.5 bg-black/40 rounded-xl border border-amber-500/10 text-amber-200 text-xs sm:text-sm font-bold font-serif">
                {details.zikr}
              </div>
            </div>

            {/* Recommended Works */}
            <div className="bg-gray-900/80 p-4 rounded-2xl border border-gray-800 flex flex-col gap-1.5">
              <div className="text-xs font-bold text-gray-300">
                {language === 'fr' ? 'Travaux & Écritures Favorables' : 'Propitious Works & Rituals'}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {details.recommendedWorks[langKey] || details.recommendedWorks.fr}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                id="btn-view-planetary-hours-tool"
                onClick={handleOpenPlanetaryTool}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Compass size={17} />
                <span>
                  {language === 'fr' ? 'Roue des Heures Planétaires' : language === 'ha' ? 'Duba Lokutan Taurari' : 'Planetary Hours Table'}
                </span>
                <ChevronRight size={16} />
              </button>

              <button
                id="btn-view-tasbih-tool"
                onClick={handleOpenTasbihWithZikr}
                className="py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-gray-700 cursor-pointer"
              >
                <span>📿 Tasbih</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
