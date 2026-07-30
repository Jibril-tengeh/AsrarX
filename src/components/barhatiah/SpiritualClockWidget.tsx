import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Clock, Compass, Sparkles, Shield, AlertCircle, Calendar } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { BARHATIAH_28_NAMES } from '../../data/barhatiahSecrets';

interface PlanetaryHour {
  planet: 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';
  planetAr: string;
  planetFr: string;
  planetHa: string;
  planetEn: string;
  symbol: string;
  color: string;
  virtueFr: string;
  virtueEn: string;
  virtueHa: string;
  recommendedName: string;
}

const PLANETARY_DATA: Record<string, PlanetaryHour> = {
  Sun: {
    planet: 'Sun',
    planetAr: 'الشَّمْس (الشمس)',
    planetFr: 'Le Soleil (Shams)',
    planetEn: 'The Sun (Shams)',
    planetHa: 'Rana (Shams)',
    symbol: '☉',
    color: 'from-amber-500 to-yellow-600',
    virtueFr: 'Lumière, prestige royal, charisme, purification, santé et succès',
    virtueEn: 'Light, royal prestige, charisma, purification, health and success',
    virtueHa: 'Kwarjini, daukaka, kariya, lafiya da daukakar mulki',
    recommendedName: 'Barhatihin (برهتيه) & Khutirin (خوطير)'
  },
  Venus: {
    planet: 'Venus',
    planetAr: 'الزُّهَرَة (الزهرة)',
    planetFr: 'Vénus (Zuhara)',
    planetEn: 'Venus (Zuhara)',
    planetHa: 'Tauraron Zuhara',
    symbol: '♀',
    color: 'from-emerald-500 to-teal-600',
    virtueFr: 'Harmonie, affection, concorde, réconciliation et beauté',
    virtueEn: 'Harmony, affection, concord, reconciliation and beauty',
    virtueHa: 'Soyayya, zaman lafiya, jituwa da kyautata dangantaka',
    recommendedName: 'Bazjalin (بزجل) & Bashkilakhin (بشكيلخ)'
  },
  Mercury: {
    planet: 'Mercury',
    planetAr: 'عُطَارِد (عطارد)',
    planetFr: 'Mercure (Utarid)',
    planetEn: 'Mercury (Utarid)',
    planetHa: 'Utarid (Ilimi & Kasuwanci)',
    symbol: '☿',
    color: 'from-cyan-500 to-blue-600',
    virtueFr: 'Intelligence, écriture des talismans, commerce, mémoire et sagesse',
    virtueEn: 'Intelligence, talisman writing, trade, memory and wisdom',
    virtueHa: 'Ilimi, rubutun lamba da hatimi, kasuwanci da fasaha',
    recommendedName: 'Tatlihin (تتليه) & Tuneshin (طونش)'
  },
  Moon: {
    planet: 'Moon',
    planetAr: 'القَمَر (القمر)',
    planetFr: 'La Lune (Qamar)',
    planetEn: 'The Moon (Qamar)',
    planetHa: 'Wata (Qamar)',
    symbol: '☽',
    color: 'from-indigo-400 to-slate-500',
    virtueFr: 'Intuition, rêves prémonitoires, déblocage, voyage et marées spirituelles',
    virtueEn: 'Intuition, prophetic dreams, unbinding, travel and spiritual tides',
    virtueHa: 'Cikakken sirri, mafarki, bude hanya da tafiya',
    recommendedName: 'Kararin (كرر) & Barhayula (برهيولا)'
  },
  Saturn: {
    planet: 'Saturn',
    planetAr: 'زُحَل (زحل)',
    planetFr: 'Saturne (Zuhal)',
    planetEn: 'Saturn (Zuhal)',
    planetHa: 'Zuhal (Garkuwa & Daurawa)',
    symbol: '♄',
    color: 'from-purple-600 to-gray-800',
    virtueFr: 'Protection contre les attaques, désenvoûtement, désactivation de magie',
    virtueEn: 'Protection from attacks, exorcism, disabling sorcery and anchoring',
    virtueHa: 'Garkuwa daga maita, watsa sihiri da ruguza makiya',
    recommendedName: 'Tarqabin (ترقب) & Qazmazin (قزمز)'
  },
  Jupiter: {
    planet: 'Jupiter',
    planetAr: 'المُشْتَرِي (المشتري)',
    planetFr: 'Jupiter (Mushtari)',
    planetEn: 'Jupiter (Mushtari)',
    planetHa: 'Mushtari (Arziqi & Biyayya)',
    symbol: '♃',
    color: 'from-yellow-500 to-amber-700',
    virtueFr: 'Prospérité financière, abondance, justice, bénédictions et justice',
    virtueEn: 'Financial prosperity, abundance, righteousness, blessings and justice',
    virtueHa: 'Arziqi mai tarin yawa, biyan bashi da daukaka ta adalci',
    recommendedName: 'Barshanin (برشان) & Ghiya-ha (غياها)'
  },
  Mars: {
    planet: 'Mars',
    planetAr: 'المِرِّيخ (المريخ)',
    planetFr: 'Mars (Mirrikh)',
    planetEn: 'Mars (Mirrikh)',
    planetHa: 'Mirrikh (Jarumta & Nasara)',
    symbol: '♂',
    color: 'from-red-600 to-rose-700',
    virtueFr: 'Courage, puissance contre les démons, victoire sur les obstacles',
    virtueEn: 'Courage, power over demons, victory over obstacles and defense',
    virtueHa: 'Jarumta, fatattakar shaidanu da nasara a kan makiya',
    recommendedName: 'Tawran (طوران) & Kaydahoola (كيدهولا)'
  }
};

const CHALDEAN_ORDER: ('Saturn' | 'Jupiter' | 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon')[] = [
  'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'
];

// Day starting planet (at sunrise):
// Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
const DAY_START_PLANET: Record<number, 'Saturn' | 'Jupiter' | 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon'> = {
  0: 'Sun',      // Sunday
  1: 'Moon',     // Monday
  2: 'Mars',     // Tuesday
  3: 'Mercury',  // Wednesday
  4: 'Jupiter',  // Thursday
  5: 'Venus',    // Friday
  6: 'Saturn'    // Saturday
};

export const SpiritualClockWidget: React.FC = () => {
  const { language } = useLanguage();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const currentDayIndex = now.getDay(); // 0 to 6
  const currentHour24 = now.getHours();

  // Approximate planetary hour index (0 to 23 from dawn 6 AM)
  const hourOffsetFromDawn = (currentHour24 - 6 + 24) % 24;
  const startPlanet = DAY_START_PLANET[currentDayIndex];
  const startPlanetIndex = CHALDEAN_ORDER.indexOf(startPlanet);
  const activePlanetName = CHALDEAN_ORDER[(startPlanetIndex + hourOffsetFromDawn) % 7];
  const activePlanetaryHour = PLANETARY_DATA[activePlanetName];

  // Lunar Mansion Index (1 to 28 based on day of lunar month approximation)
  const dayOfMonth = now.getDate();
  const lunarMansionIndex = ((dayOfMonth - 1) % 28);
  const activeLunarMansion = BARHATIAH_28_NAMES[lunarMansionIndex];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black p-5 sm:p-7 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 text-white">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white font-bold">
            <Clock size={22} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-amber-300 flex items-center gap-2">
              {language === 'ha'
                ? 'Agogon Sawaya da Demeures Lunaires (Manazil al-Qamar)'
                : language === 'en'
                ? 'Spiritual Planetary Clock & Lunar Mansions'
                : 'Horloge Spirituelle & Demeures Lunaires (Manazil al-Qamar)'}
              <span className="text-xs font-arabic px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                سَاعَاتُ الكَوَاكِبِ
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              {language === 'ha'
                ? 'Koyaushe sanin lokacin da ya dace domin gudanar da kowace karanta ta Barhatiah'
                : language === 'en'
                ? 'Real-time planetary hour tracking and lunar mansion alignment for Barhatiah rituals'
                : 'Calcul en temps réel de l\'heure planétaire et alignment avec la demeure lunaire pour vos récitations'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-2xl border border-gray-800 text-xs font-mono">
          <Calendar size={14} className="text-amber-400" />
          <span className="text-amber-300 font-bold">
            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Active Planetary Hour Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-gray-950 via-amber-950/40 to-black border-2 border-amber-500/50 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Sparkles size={15} className="text-amber-400" />
            {language === 'ha' ? 'Sawa\'a (Heure Planétaire) na Yanzu:' : language === 'en' ? 'Current Planetary Hour:' : 'Heure Planétaire Actuelle :'}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${activePlanetaryHour.color} shadow-md`}>
            {activePlanetaryHour.symbol} {language === 'ha' ? activePlanetaryHour.planetHa : language === 'en' ? activePlanetaryHour.planetEn : activePlanetaryHour.planetFr}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-black/80 border border-amber-500/30 space-y-1.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
              {language === 'ha' ? 'Mani da Tasiri na Wannan Sa\'a' : language === 'en' ? 'Spiritual Virtue & Influence' : 'Vertu & Influence Spirituelle :'}
            </span>
            <p className="text-xs text-amber-200 font-medium leading-relaxed">
              {language === 'ha' ? activePlanetaryHour.virtueHa : language === 'en' ? activePlanetaryHour.virtueEn : activePlanetaryHour.virtueFr}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/80 border border-amber-500/30 space-y-1.5">
            <span className="text-[10px] text-amber-400 uppercase tracking-wider block font-bold">
              {language === 'ha' ? 'Suna na Barhatiah Mafi Dacewa:' : language === 'en' ? 'Recommended Barhatiah Name:' : 'Nom de la Barhatiah Recommandé :'}
            </span>
            <p className="text-sm font-bold text-emerald-300 flex items-center gap-1.5 font-arabic">
              <Shield size={14} className="text-emerald-400" />
              {activePlanetaryHour.recommendedName}
            </p>
          </div>
        </div>
      </div>

      {/* Active Lunar Mansion Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-gray-900 to-black border border-purple-500/40 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
            <Compass size={15} className="text-purple-400" />
            {language === 'ha' ? 'Demeure Lunaire (Manzil al-Qamar) na Ranar:' : language === 'en' ? 'Current Lunar Mansion (Manzil):' : 'Demeure Lunaire Actuelle (Manzil) :'}
          </span>
          <span className="px-3 py-1 bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-bold rounded-full">
            Manzil #{activeLunarMansion.id} / 28
          </span>
        </div>

        <div className="p-4 rounded-xl bg-black/80 border border-purple-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-amber-300">
              {activeLunarMansion.lunarMansion}
            </h4>
            <p className="text-xs text-gray-300">
              {language === 'ha' ? activeLunarMansion.divineAttributeHa : language === 'en' ? activeLunarMansion.divineAttributeEn : activeLunarMansion.divineAttributeFr}
            </p>
          </div>

          <div className="text-right space-y-1 dir-rtl">
            <span className="font-arabic text-lg text-amber-400 font-bold block">
              {activeLunarMansion.nameAr} ({activeLunarMansion.nameTranslit})
            </span>
            <span className="text-xs font-mono text-purple-300 dir-ltr block">
              Abjad Weight: {activeLunarMansion.abjadWeight}
            </span>
          </div>
        </div>
      </div>

      {/* Planetary Order Grid */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
          {language === 'ha' ? 'Tsarin Sa\'o\'i na Taurari (Chaldean Sequence)' : language === 'en' ? 'Chaldean Sequence of the 7 Planets' : 'Séquence Chaldéenne des 7 Planètes :'}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {CHALDEAN_ORDER.map((planetKey) => {
            const p = PLANETARY_DATA[planetKey];
            const isActive = p.planet === activePlanetaryHour.planet;
            return (
              <div
                key={planetKey}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isActive
                    ? 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-lg scale-105'
                    : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <span className="text-lg block font-bold">{p.symbol}</span>
                <span className="text-[10px] font-bold block truncate">
                  {language === 'ha' ? p.planetHa.split(' ')[0] : language === 'en' ? p.planet : p.planetFr.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
