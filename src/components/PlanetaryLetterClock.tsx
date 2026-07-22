import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Sparkles, Compass, Flame, Droplets, Mountain, Wind, CheckCircle2, ChevronRight, RefreshCw, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { FULL_28_LETTERS_DATA, LetterInfo } from '../pages/user/tools/ScienceOfLetters';

interface PlanetInfo {
  id: string;
  nameFr: string;
  nameEn: string;
  symbol: string;
  letters: string[];
  element: 'Feu' | 'Terre' | 'Air' | 'Eau';
  angel: string;
  angelAr: string;
  wird: string;
  wirdAr: string;
  wirdCount: number;
  bestFor: string;
}

const PLANETS_DATA: { [key: string]: PlanetInfo } = {
  Soleil: {
    id: 'Soleil',
    nameFr: 'Soleil (Al-Shams)',
    nameEn: 'Sun',
    symbol: '☉',
    letters: ['ا', 'ح', 'ت'],
    element: 'Feu',
    angel: 'Rukya\'il',
    angelAr: 'رُوقَيَائِيلُ',
    wird: "Ya Allahu ya Hayyu ya Qayyumu",
    wirdAr: "يَا أَللَّهُ يَا حَيُّ يَا قَيُّومُ",
    wirdCount: 111,
    bestFor: "Autorité, prestige auprès des rois/décideurs, clarté mentale, santé et illumination spirituelle."
  },
  Lune: {
    id: 'Lune',
    nameFr: 'Lune (Al-Qamar)',
    nameEn: 'Moon',
    symbol: '☽',
    letters: ['ب', 'ط', 'ث'],
    element: 'Eau',
    angel: 'Jibra\'il',
    angelAr: 'جِبْرَائِيلُ',
    wird: "Ya Bari'u ya Basitu ya Mubin",
    wirdAr: "يَا بَارِئُ يَا بَاسِطُ يَا مُبِينُ",
    wirdCount: 128,
    bestFor: "Guérison des cœurs, rêves prémonitoires, fertilité, réconciliation et voyage serein."
  },
  Mars: {
    id: 'Mars',
    nameFr: 'Mars (Al-Mirrikh)',
    nameEn: 'Mars',
    symbol: '♂',
    letters: ['ج', 'ي', 'ف', 'خ'],
    element: 'Feu',
    angel: 'Samsama\'il',
    angelAr: 'سَمْسَمَائِيلُ',
    wird: "Ya Qahharu ya Jabbaru ya Qawiyyu",
    wirdAr: "يَا قَهَّارُ يَا جَبَّارُ يَا قَوِيُّ",
    wirdCount: 306,
    bestFor: "Victoire contre les tyrans, destruction de la magie noire, courage et invulnérabilité."
  },
  Mercure: {
    id: 'Mercure',
    nameFr: 'Mercure (Al-Utarid)',
    nameEn: 'Mercury',
    symbol: '☿',
    letters: ['د', 'ك', 'ص', 'ذ'],
    element: 'Air',
    angel: 'Mika\'il',
    angelAr: 'مِيكَائِيلُ',
    wird: "Ya 'Alimu ya Kafi ya Sadiqu",
    wirdAr: "يَا عَلِيمُ يَا كَافِي يَا صَادِقُ",
    wirdCount: 150,
    bestFor: "Intelligence supérieure, commerce, rédaction des talismans, apprentissage rapide et écriture."
  },
  Jupiter: {
    id: 'Jupiter',
    nameFr: 'Jupiter (Al-Mushtari)',
    nameEn: 'Jupiter',
    symbol: '♃',
    letters: ['ه', 'ل', 'ق', 'ض'],
    element: 'Air',
    angel: 'Sarfaya\'il',
    angelAr: 'صَرْفَيَائِيلُ',
    wird: "Ya Latifu ya Razzaqu ya Ghaniyu",
    wirdAr: "يَا لَطِيفُ يَا رَزَّاقُ يَا غَنِيُّ",
    wirdCount: 129,
    bestFor: "Prospérité financière majeure, bénédiction des affaires, justice favorable et paix profonde."
  },
  Venus: {
    id: 'Venus',
    nameFr: 'Vénus (Al-Zuhara)',
    nameEn: 'Venus',
    symbol: '♀',
    letters: ['و', 'م', 'ر', 'ظ'],
    element: 'Terre',
    angel: 'Anya\'il',
    angelAr: 'عَنْيَائِيلُ',
    wird: "Ya Wadudu ya Jami'u ya Rahmanu",
    wirdAr: "يَا وَدُودُ يَا جَامِعُ يَا رَحْمَنُ",
    wirdCount: 114,
    bestFor: "Harmonie conjugale, amour réciproque, beauté du visage, charisme et sympathie de la foule."
  },
  Saturne: {
    id: 'Saturne',
    nameFr: 'Saturne (Al-Zuhal)',
    nameEn: 'Saturn',
    symbol: '♄',
    letters: ['ز', 'ن', 'ش', 'غ'],
    element: 'Terre',
    angel: 'Kasfaya\'il',
    angelAr: 'كَسْفَيَائِيلُ',
    wird: "Ya Qaddusu ya Saburu ya Ghaniyu",
    wirdAr: "يَا قُدُّوسُ يَا صَبُورُ يَا غَنِيُّ",
    wirdCount: 300,
    bestFor: "Inamovibilité, protection du patrimoine immobilier, solitude contemplative et rupture des sortilèges."
  }
};

// Chaldean Order sequence
const CHALDEAN_SEQUENCE = ['Saturne', 'Jupiter', 'Mars', 'Soleil', 'Venus', 'Mercure', 'Lune'];

// Day rulers (1st hour after sunrise on that day of week: Sunday = 0 ... Saturday = 6)
const DAY_RULERS = ['Soleil', 'Lune', 'Mars', 'Mercure', 'Jupiter', 'Venus', 'Saturne'];

export const PlanetaryLetterClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [selectedHourIndex, setSelectedHourIndex] = useState<number>(-1);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayOfWeek = currentTime.getDay(); // 0 = Sun, 1 = Mon...
  const currentHour = currentTime.getHours();

  // Calculate planetary ruler for a given hour of the day (0..23)
  const getPlanetaryRulerForHour = (hour24: number): PlanetInfo => {
    const dayRulerName = DAY_RULERS[dayOfWeek];
    const startIndex = CHALDEAN_SEQUENCE.indexOf(dayRulerName);
    const offset = hour24 % 7;
    const planetName = CHALDEAN_SEQUENCE[(startIndex + offset) % 7];
    return PLANETS_DATA[planetName] || PLANETS_DATA['Soleil'];
  };

  const activeRuler = selectedHourIndex >= 0 
    ? getPlanetaryRulerForHour(selectedHourIndex)
    : getPlanetaryRulerForHour(currentHour);

  // Get matching letter objects
  const activeLetterObjects = activeRuler.letters.map(char => 
    FULL_28_LETTERS_DATA.find(l => l.char === char)
  ).filter(Boolean) as LetterInfo[];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
      {/* Module Title */}
      <div className="border-b border-gray-100 dark:border-gray-700 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="text-indigo-500" /> Horloge Astronomique & Planétaire des Lettres
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Découvrez en temps réel quelle planète et quelles lettres régissent l'heure courante pour optimiser l'efficacité spirituelle de vos invocations (Wirds & Zikr).
          </p>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/40 px-4 py-2 rounded-2xl flex items-center gap-2 self-start sm:self-auto">
          <Clock size={16} className="text-indigo-600 dark:text-indigo-400 animate-spin-slow" />
          <span className="font-mono font-black text-sm text-indigo-700 dark:text-indigo-300">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Main Active Planetary Hour Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white shadow-2xl border border-indigo-500/40 space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-indigo-500/20 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1">
              <Sparkles size={12} /> {selectedHourIndex >= 0 ? `Heure Sélectionnée : ${selectedHourIndex}:00` : "Heure Planétaire Active (Instant Présent)"}
            </span>
            <h3 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
              <span className="text-amber-300 text-3xl">{activeRuler.symbol}</span>
              <span>{activeRuler.nameFr}</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-900/80 border border-indigo-500/40 text-amber-300 rounded-full font-mono text-xs font-bold">
              Ange : {activeRuler.angel} ({activeRuler.angelAr})
            </span>
            {selectedHourIndex >= 0 && (
              <button
                onClick={() => setSelectedHourIndex(-1)}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-full transition-colors cursor-pointer"
              >
                Revenir à maintenant
              </button>
            )}
          </div>
        </div>

        {/* Active Ruling Letters Grid */}
        <div>
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3">
            Lettres Régisseuses de cette Heure ({activeLetterObjects.length})
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeLetterObjects.map((l) => (
              <div key={l.char} className="p-3 bg-slate-900/90 border border-indigo-500/30 rounded-2xl flex items-center justify-between">
                <span className="text-3xl font-arabic font-extrabold text-amber-300">{l.char}</span>
                <div className="text-right">
                  <p className="text-xs font-bold text-white">{l.name}</p>
                  <p className="text-[10px] text-gray-400">Abjad: {l.abjad}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Wird to recite right now */}
        <div className="p-4 bg-slate-900/90 rounded-2xl border border-indigo-500/30 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Invocation (Wird) Recommandée
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-mono font-bold">
              Répétition : {activeRuler.wirdCount}x
            </span>
          </div>

          <p dir="rtl" className="text-2xl sm:text-3xl font-quran text-amber-100 text-center leading-[2.2]" style={{ fontFamily: '"Amiri Quran", "Uthmani", "Scheherazade New", "Amiri", serif', direction: 'rtl' }}>
            {activeRuler.wirdAr}
          </p>
          <p className="text-xs text-indigo-200 text-center italic">
            "{activeRuler.wird}"
          </p>

          <p className="text-xs text-gray-300 pt-1 border-t border-indigo-900/50">
            <strong>Vertus de cette heure :</strong> {activeRuler.bestFor}
          </p>
        </div>
      </div>

      {/* 24-Hour Planetary Day Timeline */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Compass size={16} className="text-indigo-500" /> Programme Planétaire des 24 Heures de la Journée
        </h3>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5">
          {Array.from({ length: 24 }).map((_, h) => {
            const ruler = getPlanetaryRulerForHour(h);
            const isCurrent = h === currentHour;
            const isSelected = h === selectedHourIndex;

            return (
              <button
                key={h}
                onClick={() => setSelectedHourIndex(h)}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-lg scale-105'
                    : isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-400 font-extrabold ring-2 ring-indigo-400 animate-pulse'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-indigo-500'
                }`}
              >
                <span className="text-[10px] font-mono block opacity-80">{h}:00</span>
                <span className="text-base block my-0.5">{ruler.symbol}</span>
                <span className="text-[9px] font-arabic font-bold block truncate">{ruler.letters.join(' ')}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
