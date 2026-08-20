import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Moon,
  Sun,
  Sparkles,
  Calendar,
  Compass,
  Star,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Flame,
  Droplets,
  Wind,
  Mountain,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  BookOpen,
  Share2,
  Download,
  Filter,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import {
  calculateLunarPhaseDetails,
  getMonthlyLunarTimeline,
  getYearlyLunarEvents,
  LunarPhaseDetails
} from '../../../utils/lunarCycleEngine';
import { ParchmentExporterModal } from '../../../components/ParchmentExporterModal';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';

const translations = {
  fr: {
    title: "Calculateur de Cycles Lunaires",
    subtitle: "Phases de la Lune, Manazil al-Qamar & Guide Astroscientifique des Pratiques Spirituelles",
    today: "Aujourd'hui",
    prevDay: "Jour Précédent",
    nextDay: "Jour Suivant",
    jumpToFullMoon: "Prochaine Pleine Lune",
    jumpToNewMoon: "Prochaine Nouvelle Lune",
    selectDateLabel: "Sélectionner une Date Grégorienne",
    quickNavigation: "Navigation Rapide",
    
    // Cards & Tabs
    tabOverview: "Aperçu & Énergies",
    tabPractices: "Pratiques & Invocations",
    tabTimeline: "Cycle Mensuel (29.5j)",
    tabEphemeris: "Éphéméride Annuelle",
    tabIntentions: "Guide par Intention",

    // Metrics
    phaseTitle: "Phase Lunaire",
    illumination: "Illumination",
    lunarAge: "Âge Lunaire",
    daysOld: "jours",
    whiteNightBadge: "Nuit Blanche Bénie (Ayyām Bīḍ)",
    supermoonBadge: "Superlune (Périgée)",
    micromoonBadge: "Microlune (Apogée)",
    waxing: "Croissante (Attraction & Croissance)",
    waning: "Décroissante (Purification & Libération)",
    
    hijriDateTitle: "Date Hégirienne Correspondante",
    lunarMansionTitle: "Demeure Lunaire (Manzil al-Qamar)",
    mansionIndex: "Demeure",
    zodiacPositionTitle: "Position Zodiacale de la Lune",
    lunarDistanceTitle: "Distance Terre-Lune",
    
    // Elements
    elementFeu: "Feu (Hararah / Énergie & Action)",
    elementTerre: "Terre (Yubusah / Stabilité & Ancrage)",
    elementAir: "Air (Rutubah / Pensée & Communication)",
    elementEau: "Eau (Burudah / Intuition & Émotion)",

    // Spiritual Panel
    spiritualDomainTitle: "Nature Énergétique & Champ d'Action",
    recommendedPracticesTitle: "Recommandations & Rituels Bénéfiques",
    asmaTitle: "Noms Divins Alignés (Asmā' Allāh) & Poids Abjad",
    asmaCount: "Répétitions recommandées :",
    abjadWeight: "Poids Abjad :",
    surahTitle: "Sourate Coranique Correspondante",
    incenseTitle: "Encens & Bakhūr Sacré Aligné",
    cautionTitle: "Mise en Garde Spirituelle",

    // Synodic Timeline
    timelineTitle: "Ruban du Cycle Synodique (29.5 Jours)",
    timelineSubtitle: "Cliquez sur n'importe quel jour pour inspecter sa configuration énergétique",
    selectedDay: "Sélectionné",

    // Yearly Ephemeris
    ephemerisTitle: "Grandes Lunes & Événements de l'Année",
    ephemerisSubtitle: "Calendrier des Nouvelles Lunes et Pleines Lunes de l'année",
    filterYear: "Année :",

    // Intention Guide
    intentionsTitle: "Guide d'Alignement par Intention Spirituelle",
    intentionsSubtitle: "Choisissez votre objectif spirituel pour découvrir la phase lunaire idéale et les dates favorables",
    intentions: {
      jalb: {
        title: "Attraction, Richesse & Ouverture (Jalb al-Rizq)",
        desc: "Idéal pendant le Premier Croissant et la Lune Croissante. Favorise l'accroissement des affaires, l'abondance matérielle et l'affection pure.",
        bestPhase: "Du 3e au 12e jour lunaire (Lune Croissante)"
      },
      kashf: {
        title: "Illumination, Retraite & Invocations Majeures (Kashf & Badr)",
        desc: "Idéal pendant la Pleine Lune et les Nuits Blanches (13, 14, 15). Moment propice au jeûne, à la bénédiction des anneaux et aux grandes veillées.",
        bestPhase: "13, 14 et 15 du mois hégirien (Pleine Lune)"
      },
      tathir: {
        title: "Purification, Désenvoûtement & Déblocage (Daf' & Ibtāl)",
        desc: "Idéal pendant la Lune Décroissante et le Dernier Quartier. Excellent pour briser les blocages, couper les liens négatifs et purifier les lieux.",
        bestPhase: "Du 18e au 26e jour lunaire (Lune Décroissante)"
      },
      khalwa: {
        title: "Renouveau, Introspection & Nouvelles Intentions (Muhāq / Hilal)",
        desc: "Idéal lors de la Nouvelle Lune et du croissant naissant. Moment de silence intérieur, de planification et d'initiation d'un nouveau wird.",
        bestPhase: "1er et 2e jour lunaire (Nouvelle Lune)"
      }
    },

    exportParchment: "Exporter Fiche Lunaire",
    parchmentCardTitle: "Fiche d'Alignement Lunaire & Spirituel"
  },
  en: {
    title: "Lunar Cycles Calculator",
    subtitle: "Moon Phases, Manazil al-Qamar & Astroscientific Guide for Spiritual Practices",
    today: "Today",
    prevDay: "Previous Day",
    nextDay: "Next Day",
    jumpToFullMoon: "Next Full Moon",
    jumpToNewMoon: "Next New Moon",
    selectDateLabel: "Select Gregorian Date",
    quickNavigation: "Quick Navigation",

    // Cards & Tabs
    tabOverview: "Overview & Energies",
    tabPractices: "Practices & Invocations",
    tabTimeline: "Monthly Cycle (29.5d)",
    tabEphemeris: "Yearly Ephemeris",
    tabIntentions: "Intentions Guide",

    // Metrics
    phaseTitle: "Lunar Phase",
    illumination: "Illumination",
    lunarAge: "Lunar Age",
    daysOld: "days",
    whiteNightBadge: "Blessed White Night (Ayyam Bid)",
    supermoonBadge: "Supermoon (Perigee)",
    micromoonBadge: "Micromoon (Apogee)",
    waxing: "Waxing (Attraction & Expansion)",
    waning: "Waning (Purification & Release)",

    hijriDateTitle: "Corresponding Hijri Date",
    lunarMansionTitle: "Lunar Mansion (Manzil al-Qamar)",
    mansionIndex: "Mansion",
    zodiacPositionTitle: "Moon Zodiac Position",
    lunarDistanceTitle: "Earth-Moon Distance",

    // Elements
    elementFeu: "Fire (Energy & Action)",
    elementTerre: "Earth (Stability & Grounding)",
    elementAir: "Air (Thought & Expression)",
    elementEau: "Water (Intuition & Emotions)",

    // Spiritual Panel
    spiritualDomainTitle: "Energetic Nature & Action Sphere",
    recommendedPracticesTitle: "Beneficial Rituals & Recommendations",
    asmaTitle: "Aligned Divine Names (Asma' Allah) & Abjad Value",
    asmaCount: "Recommended repetitions:",
    abjadWeight: "Abjad Value:",
    surahTitle: "Corresponding Quranic Surah",
    incenseTitle: "Sacred Incense & Bakhoor",
    cautionTitle: "Spiritual Caution Note",

    // Synodic Timeline
    timelineTitle: "Synodic Cycle Ribbon (29.5 Days)",
    timelineSubtitle: "Click any day to inspect its energetic configuration",
    selectedDay: "Selected",

    // Yearly Ephemeris
    ephemerisTitle: "Major Moons & Cosmic Events of the Year",
    ephemerisSubtitle: "Calendar of all New Moons and Full Moons of the year",
    filterYear: "Year:",

    // Intention Guide
    intentionsTitle: "Spiritual Intention Alignment Guide",
    intentionsSubtitle: "Choose your spiritual goal to discover the optimal lunar window and dates",
    intentions: {
      jalb: {
        title: "Attraction, Sustenance & Expansion (Jalb al-Rizq)",
        desc: "Ideal during the Waxing Crescent and Gibbous phases. Promotes business growth, material abundance, and harmonious love.",
        bestPhase: "Days 3 to 12 of the lunar cycle (Waxing Moon)"
      },
      kashf: {
        title: "Illumination, Retreat & Major Prayers (Kashf & Badr)",
        desc: "Ideal during the Full Moon and White Nights (13, 14, 15). Auspicious for fasting, ring consecration, and major night vigils.",
        bestPhase: "13th, 14th, and 15th of the Hijri month (Full Moon)"
      },
      tathir: {
        title: "Purification, Shielding & Unblocking (Daf' & Ibtal)",
        desc: "Ideal during the Waning Moon and Last Quarter. Excellent for neutralizing negative energy, cutting heavy cords, and space cleansing.",
        bestPhase: "Days 18 to 26 of the lunar cycle (Waning Moon)"
      },
      khalwa: {
        title: "Renewal, Introspection & New Seeds (Muhaq / Hilal)",
        desc: "Ideal during the New Moon and nascent crescent. A time for internal stillness, planning, and starting a new personal wird.",
        bestPhase: "Days 1 and 2 of the lunar cycle (New Moon)"
      }
    },

    exportParchment: "Export Lunar Card",
    parchmentCardTitle: "Lunar & Spiritual Alignment Sheet"
  },
  ha: {
    title: "Kwandatsin Zagayowar Wata",
    subtitle: "Ranakun Wata, Manazil al-Qamar da Shiryarwar Ayyukan Ruhu da Asirai",
    today: "Yau",
    prevDay: "Rana Mai Gabata",
    nextDay: "Rana Mai Zuwa",
    jumpToFullMoon: "Cikakken Wata Mai Zuwa",
    jumpToNewMoon: "Sabon Wata Mai Zuwa",
    selectDateLabel: "Zaɓi Kwanan Wata na Turawa",
    quickNavigation: "Saurin Shiga",

    // Cards & Tabs
    tabOverview: "Bayanin Karfi",
    tabPractices: "Ayyukan Ibada da Zikiri",
    tabTimeline: "Zagayowar Wata (Kwanaki 29.5)",
    tabEphemeris: "Kwandatsin Shekara",
    tabIntentions: "Jagoran Manufofi",

    // Metrics
    phaseTitle: "Yanayin Wata",
    illumination: "Hasken Wata",
    lunarAge: "Kwanakin Wata",
    daysOld: "kwanaki",
    whiteNightBadge: "Fararen Darare Masu Albarka (Ayyam Bid)",
    supermoonBadge: "Babban Wata (Supermoon)",
    micromoonBadge: "Karamin Wata (Micromoon)",
    waxing: "Yana Hauhawa (Jawo Alheri da Yalwa)",
    waning: "Yana Ragewa (Tsarkaka da Yaye Matsaloli)",

    hijriDateTitle: "Kwanan Watan Musulunci (Hijri)",
    lunarMansionTitle: "Tashar Wata (Manzil al-Qamar)",
    mansionIndex: "Tasha",
    zodiacPositionTitle: "Matsayin Wata a Buruji",
    lunarDistanceTitle: "Nisan Wata da Kasa",

    // Elements
    elementFeu: "Wuta (Karfi da Zafi)",
    elementTerre: "Kasa (Tsayawa da Karfi)",
    elementAir: "Iska (Tunani da Hikima)",
    elementEau: "Ruwa (Nutsuwa da Rahama)",

    // Spiritual Panel
    spiritualDomainTitle: "Karfin Karama da Tasirin Ranar",
    recommendedPracticesTitle: "Ayyukan Ibada Masu Albarka",
    asmaTitle: "Sunayen Allah Masu Daidaito da Nauyin Abjad",
    asmaCount: "Adadin Karanta :",
    abjadWeight: "Nauyin Lambar Abjad :",
    surahTitle: "Surar Alkur'ani Mai Dace",
    incenseTitle: "Kansassaki da Turaren Wuta",
    cautionTitle: "Gargadi da Kula a Ruhu",

    // Synodic Timeline
    timelineTitle: "Zagayen Wata Cikin Kwanaki 29.5",
    timelineSubtitle: "Latsa kowace rana don duba yanayin haske da karfinta",
    selectedDay: "Wanda aka Zaɓa",

    // Yearly Ephemeris
    ephemerisTitle: "Manyan Dararen Wata na Shekara",
    ephemerisSubtitle: "Jadawalin Sabbin Watanni da Cikakkun Watanni a duk shekara",
    filterYear: "Shekara :",

    // Intention Guide
    intentionsTitle: "Jagoran Daidaita Niyya da Karfin Wata",
    intentionsSubtitle: "Zaɓi abin da kake nema don ganin lokaci da ranakun da suka fi dacewa",
    intentions: {
      jalb: {
        title: "Jawo Arziki, Bude Kofofi da Soyayya (Jalbur Rizqi)",
        desc: "Yana da kyau a lokacin da wata ke girma. Yana taimakawa wajen ciniki, bunkasar kudi da samun kauna ta gaskiya.",
        bestPhase: "Daga ranar 3 zuwa 12 na wata (Lokacin Hauhawar Wata)"
      },
      kashf: {
        title: "Hasken Zuciya, Khalwa da Babban Zikiri (Kashf da Badr)",
        desc: "Yana da kyau a daren cikakken wata da Fararen Darare (13, 14, 15). Lokaci ne na azumi, tsarkake zobba da rokon bukata.",
        bestPhase: "Ranar 13, 14 da 15 ga watan Hijri (Cikakken Wata)"
      },
      tathir: {
        title: "Tsarkaka, Karya Sihiri da Magance Matsaloli (Daf' da Ibtal)",
        desc: "Yana da kyau a lokacin da wata ke raguwa. Mai matukar kyau wajen karya asiri, tsarkake jiki da gida.",
        bestPhase: "Daga ranar 18 zuwa 26 na wata (Lokacin Ragewar Wata)"
      },
      khalwa: {
        title: "Sabunta Niyya, Nutsuwa da Sabon Wirdi (Hilal)",
        desc: "Yana da kyau a lokacin bayyanar sabon wata. Lokaci ne na yin shuru, tsara ayyuka da fara sabon wirdi.",
        bestPhase: "Ranar 1 da 2 na wata (Sabon Wata)"
      }
    },

    exportParchment: "Fitar da Takardar Wata",
    parchmentCardTitle: "Takardar Karfin Wata da Ayyukan Ruhu"
  }
};

export const LunarCyclesCalculator: React.FC = () => {
  const { language } = useLanguage();
  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const t = translations[langKey] || translations.fr;

  // Selected date state
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'practices' | 'timeline' | 'ephemeris' | 'intentions'>('overview');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showParchmentModal, setShowParchmentModal] = useState<boolean>(false);
  const [selectedIntention, setSelectedIntention] = useState<'jalb' | 'kashf' | 'tathir' | 'khalwa'>('jalb');

  // Convert selected string to Date
  const selectedDate = useMemo(() => {
    const [y, m, d] = selectedDateStr.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  }, [selectedDateStr]);

  // Calculate detailed phase metrics
  const lunarDetails: LunarPhaseDetails = useMemo(() => {
    return calculateLunarPhaseDetails(selectedDate);
  }, [selectedDate]);

  // Monthly 30-day timeline
  const monthlyTimeline = useMemo(() => {
    return getMonthlyLunarTimeline(selectedDate);
  }, [selectedDate]);

  // Yearly major events
  const yearlyEvents = useMemo(() => {
    return getYearlyLunarEvents(selectedYear);
  }, [selectedYear]);

  // Date Navigation handlers
  const handleToday = () => {
    setSelectedDateStr(new Date().toISOString().split('T')[0]);
  };

  const handleStepDay = (days: number) => {
    const nextDate = new Date(selectedDate.getTime() + days * 86400000);
    setSelectedDateStr(nextDate.toISOString().split('T')[0]);
  };

  const handleJumpToNextFullMoon = () => {
    let checkDate = new Date(selectedDate.getTime() + 86400000);
    for (let i = 0; i < 35; i++) {
      const details = calculateLunarPhaseDetails(checkDate);
      if (details.id === 'full_moon' || details.isWhiteNight) {
        setSelectedDateStr(checkDate.toISOString().split('T')[0]);
        return;
      }
      checkDate = new Date(checkDate.getTime() + 86400000);
    }
  };

  const handleJumpToNextNewMoon = () => {
    let checkDate = new Date(selectedDate.getTime() + 86400000);
    for (let i = 0; i < 35; i++) {
      const details = calculateLunarPhaseDetails(checkDate);
      if (details.id === 'new_moon') {
        setSelectedDateStr(checkDate.toISOString().split('T')[0]);
        return;
      }
      checkDate = new Date(checkDate.getTime() + 86400000);
    }
  };

  const getPhaseName = (details: LunarPhaseDetails) => {
    if (langKey === 'ha') return details.nameHa;
    if (langKey === 'en') return details.nameEn;
    return details.nameFr;
  };

  const getHijriMonthName = (details: LunarPhaseDetails) => {
    if (langKey === 'ha') return details.hijriDate.monthNameHa;
    if (langKey === 'en') return details.hijriDate.monthNameEn;
    return details.hijriDate.monthNameFr;
  };

  const getMansionName = (details: LunarPhaseDetails) => {
    if (langKey === 'ha') return details.mansionNameHa;
    if (langKey === 'en') return details.mansionNameEn;
    return details.mansionNameFr;
  };

  const getZodiacName = (details: LunarPhaseDetails) => {
    if (langKey === 'ha') return details.zodiacSignHa;
    if (langKey === 'en') return details.zodiacSignEn;
    return details.zodiacSignFr;
  };

  const getElementLabel = (elem: string) => {
    if (elem === 'Feu') return t.elementFeu;
    if (elem === 'Terre') return t.elementTerre;
    if (elem === 'Air') return t.elementAir;
    return t.elementEau;
  };

  const getElementIcon = (elem: string) => {
    if (elem === 'Feu') return <Flame className="w-4 h-4 text-amber-500" />;
    if (elem === 'Terre') return <Mountain className="w-4 h-4 text-emerald-500" />;
    if (elem === 'Air') return <Wind className="w-4 h-4 text-sky-500" />;
    return <Droplets className="w-4 h-4 text-blue-500" />;
  };

  // Helper to render dynamic realistic Moon SVG
  const renderMoonSvg = (illumination: number, isWaxing: boolean) => {
    // illumination: 0 to 100
    const r = 58;
    const cx = 64;
    const cy = 64;
    
    // Normalized phase from 0 (New) to 0.5 (Full) to 1.0 (New)
    const phaseFraction = illumination / 100;
    
    // Calculate ellipse rx for terminator line
    // If illumination is 50%, terminator is a straight line (rx = 0)
    // If illumination > 50%, gibbous curve. If < 50%, crescent curve.
    const rx = Math.abs(r * (1 - 2 * phaseFraction));
    const sweep = isWaxing ? (phaseFraction > 0.5 ? 1 : 0) : (phaseFraction > 0.5 ? 0 : 1);

    return (
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Ambient Glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl transition-all duration-700 pointer-events-none"
          style={{
            background: illumination > 70
              ? 'radial-gradient(circle, rgba(251, 191, 36, 0.45) 0%, rgba(147, 51, 234, 0.2) 70%, transparent 100%)'
              : illumination > 30
              ? 'radial-gradient(circle, rgba(147, 197, 253, 0.35) 0%, rgba(99, 102, 241, 0.15) 70%, transparent 100%)'
              : 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(30, 27, 75, 0.3) 70%, transparent 100%)'
          }}
        />

        <svg viewBox="0 0 128 128" className="w-32 h-32 relative drop-shadow-2xl z-10">
          <defs>
            {/* Dark Side Gradient */}
            <radialGradient id="darkSide" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="60%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            {/* Lit Side Gradient with Realistic Lunar Texture Accent */}
            <radialGradient id="litSide" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="45%" stopColor="#fef3c7" />
              <stop offset="85%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            {/* Silver Shimmer for Waning / Neutral */}
            <radialGradient id="silverLit" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f1f5f9" />
              <stop offset="85%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </radialGradient>
          </defs>

          {/* Dark Base Moon Disc */}
          <circle cx={cx} cy={cy} r={r} fill="url(#darkSide)" stroke="#334155" strokeWidth="1.5" />

          {/* Subdued Craters on Dark Side */}
          <circle cx="50" cy="50" r="7" fill="#0f172a" opacity="0.6" />
          <circle cx="75" cy="45" r="9" fill="#0f172a" opacity="0.5" />
          <circle cx="68" cy="78" r="11" fill="#0f172a" opacity="0.6" />
          <circle cx="42" cy="80" r="6" fill="#0f172a" opacity="0.5" />

          {/* Illumination Path */}
          {illumination > 0 && illumination < 100 && (
            <path
              d={
                isWaxing
                  ? `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 ${sweep} ${cx} ${cy - r}`
                  : `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${rx} ${r} 0 0 ${sweep} ${cx} ${cy - r}`
              }
              fill={illumination > 60 ? "url(#litSide)" : "url(#silverLit)"}
            />
          )}

          {illumination >= 100 && (
            <circle cx={cx} cy={cy} r={r} fill="url(#litSide)" />
          )}

          {/* Lunar Crater Overlays on Lit Side for Realism */}
          {illumination > 25 && (
            <g opacity="0.18">
              <circle cx="52" cy="48" r="7" fill="#78350f" />
              <circle cx="76" cy="42" r="9" fill="#78350f" />
              <circle cx="70" cy="76" r="11" fill="#78350f" />
              <circle cx="44" cy="82" r="6" fill="#78350f" />
            </g>
          )}

          {/* Outer Border Highlight Ring */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-900/40">
          <div className="flex items-center gap-3">
            <Link
              to="/tools"
              className="p-2.5 rounded-2xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/50 text-indigo-300 hover:text-white transition-all shadow-sm flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour aux Outils</span>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Moon className="w-6 h-6 text-amber-400 fill-amber-400/20" />
                {t.title}
                <ToolInfoTooltip title={t.title} content={t.subtitle} />
              </h1>
              <p className="text-xs sm:text-sm text-indigo-300/80 mt-0.5">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowParchmentModal(true)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {t.exportParchment}
            </button>
          </div>
        </div>

        {/* Date Selector & Quick Navigation Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Date Input with Next/Prev Steppers */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs font-semibold text-indigo-300 block w-full sm:w-auto">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                {t.selectDateLabel} :
              </label>
              
              <div className="flex items-center gap-1.5 bg-indigo-950/60 p-1 rounded-2xl border border-indigo-800/40">
                <button
                  type="button"
                  onClick={() => handleStepDay(-1)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-indigo-300 hover:text-white transition-colors"
                  title={t.prevDay}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <input
                  type="date"
                  value={selectedDateStr}
                  onChange={(e) => setSelectedDateStr(e.target.value)}
                  className="px-3 py-1.5 bg-transparent text-white font-mono text-sm focus:outline-none cursor-pointer"
                />

                <button
                  type="button"
                  onClick={() => handleStepDay(1)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-indigo-300 hover:text-white transition-colors"
                  title={t.nextDay}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleToday}
                className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-bold text-indigo-200 transition-all"
              >
                {t.today}
              </button>
            </div>

            {/* Quick Jumps to Full / New Moon */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 hidden sm:inline font-mono">
                {t.quickNavigation}:
              </span>
              <button
                type="button"
                onClick={handleJumpToNextFullMoon}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                {t.jumpToFullMoon}
              </button>

              <button
                type="button"
                onClick={handleJumpToNextNewMoon}
                className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                {t.jumpToNewMoon}
              </button>
            </div>
          </div>
        </div>

        {/* Hero Interactive Moon Stage & Key Celestial Telemetry */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-purple-950/60 border border-indigo-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Starry Ambient */}
          <div className="absolute top-4 right-8 w-2 h-2 rounded-full bg-amber-200/40 animate-ping" />
          <div className="absolute bottom-8 left-12 w-1.5 h-1.5 rounded-full bg-indigo-300/40 animate-pulse" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Dynamic Realistic Visual Moon Render */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-3">
              {renderMoonSvg(lunarDetails.illuminationPercentage, lunarDetails.isWaxing)}
              
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/90 border border-indigo-500/40 text-amber-300 text-xs font-mono font-bold shadow-md">
                  <span>{t.illumination} : {lunarDetails.illuminationPercentage}%</span>
                  <span>•</span>
                  <span>{lunarDetails.ageDays} {t.daysOld}</span>
                </div>
                <div className="text-[11px] text-indigo-300/70 mt-1 font-medium">
                  {lunarDetails.isWaxing ? t.waxing : t.waning}
                </div>
              </div>
            </div>

            {/* Right: Key Spiritual & Astroscience Coordinates */}
            <div className="lg:col-span-8 space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                    {lunarDetails.isWaxing ? "Phase Montante (Al-Iqbāl)" : "Phase Descendante (Al-Idbār)"}
                  </span>
                  {lunarDetails.isWhiteNight && (
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      {t.whiteNightBadge}
                    </span>
                  )}
                  {lunarDetails.isSupermoon && (
                    <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                      {t.supermoonBadge}
                    </span>
                  )}
                  {lunarDetails.isMicromoon && (
                    <span className="text-xs font-bold text-slate-300 bg-slate-700/50 px-2.5 py-0.5 rounded-full border border-slate-600">
                      {t.micromoonBadge}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                  {getPhaseName(lunarDetails)}
                </h2>
                <p className="text-lg font-arabic font-bold text-amber-300/90 mt-1">
                  {lunarDetails.arabicName}
                </p>
              </div>

              {/* 4 Multi-Dimension Telemetry Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Hijri Date */}
                <div className="p-3.5 rounded-2xl bg-indigo-950/50 border border-indigo-800/40">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                    {t.hijriDateTitle}
                  </span>
                  <div className="font-bold text-sm text-white mt-1">
                    {lunarDetails.hijriDate.day} {getHijriMonthName(lunarDetails)} {lunarDetails.hijriDate.year}
                  </div>
                  <div className="text-[11px] font-arabic text-amber-400/80">
                    {lunarDetails.hijriDate.day} {lunarDetails.hijriDate.monthNameAr}
                  </div>
                </div>

                {/* 2. Lunar Mansion (Manzil) */}
                <div className="p-3.5 rounded-2xl bg-indigo-950/50 border border-indigo-800/40">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                    {t.lunarMansionTitle}
                  </span>
                  <div className="font-bold text-sm text-white mt-1 truncate">
                    #{lunarDetails.mansionNumber} {getMansionName(lunarDetails)}
                  </div>
                  <div className="text-[11px] font-arabic text-amber-400/80">
                    {lunarDetails.mansionNameAr}
                  </div>
                </div>

                {/* 3. Zodiac Sign & Degree */}
                <div className="p-3.5 rounded-2xl bg-indigo-950/50 border border-indigo-800/40">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                    {t.zodiacPositionTitle}
                  </span>
                  <div className="font-bold text-sm text-white mt-1 flex items-center gap-1.5">
                    {getElementIcon(lunarDetails.element)}
                    <span>{lunarDetails.zodiacDegree}° {getZodiacName(lunarDetails)}</span>
                  </div>
                  <div className="text-[11px] text-indigo-300/70">
                    {getElementLabel(lunarDetails.element)}
                  </div>
                </div>

                {/* 4. Lunar Distance */}
                <div className="p-3.5 rounded-2xl bg-indigo-950/50 border border-indigo-800/40">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                    {t.lunarDistanceTitle}
                  </span>
                  <div className="font-bold text-sm text-white mt-1 font-mono">
                    {lunarDetails.distanceKm.toLocaleString()} km
                  </div>
                  <div className="text-[11px] text-indigo-300/70">
                    {lunarDetails.distanceKm < 365000 ? "Périgée proche" : lunarDetails.distanceKm > 400000 ? "Apogée lointain" : "Distance moyenne"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-indigo-900/40 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/40 border border-indigo-800/30'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {t.tabOverview}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('practices')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'practices'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/40 border border-indigo-800/30'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {t.tabPractices}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/40 border border-indigo-800/30'
            }`}
          >
            <Layers className="w-4 h-4" />
            {t.tabTimeline}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('intentions')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'intentions'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/40 border border-indigo-800/30'
            }`}
          >
            <Compass className="w-4 h-4" />
            {t.tabIntentions}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ephemeris')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'ephemeris'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/40 border border-indigo-800/30'
            }`}
          >
            <Calendar className="w-4 h-4" />
            {t.tabEphemeris}
          </button>
        </div>

        {/* Tab 1: Overview & Astroscience Energies */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Spiritual Domain Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900/80 to-amber-950/40 border border-indigo-500/20 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <Sparkles className="w-5 h-5" />
                {t.spiritualDomainTitle}
              </div>
              <p className="text-sm sm:text-base text-indigo-100 leading-relaxed font-medium">
                {langKey === 'ha'
                  ? lunarDetails.spiritualDomainHa
                  : langKey === 'en'
                  ? lunarDetails.spiritualDomainEn
                  : lunarDetails.spiritualDomainFr}
              </p>
            </div>

            {/* Side-by-side Practices & Asma */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Recommended Practices */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-800/40 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  {t.recommendedPracticesTitle}
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                  {(langKey === 'ha'
                    ? lunarDetails.recommendedPracticesHa
                    : langKey === 'en'
                    ? lunarDetails.recommendedPracticesEn
                    : lunarDetails.recommendedPracticesFr
                  ).map((practice, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-900/40">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Incense & Quranic Surah */}
              <div className="space-y-4">
                {/* Quranic Surah */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-slate-900/80 border border-emerald-500/30 space-y-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                    {t.surahTitle}
                  </span>
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white">
                      {langKey === 'ha'
                        ? lunarDetails.recommendedSurah.nameHa
                        : langKey === 'en'
                        ? lunarDetails.recommendedSurah.nameEn
                        : lunarDetails.recommendedSurah.nameFr}
                    </h4>
                    <span className="text-xl font-arabic font-bold text-emerald-400">
                      {lunarDetails.recommendedSurah.nameAr}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-emerald-500/20">
                    {langKey === 'ha'
                      ? lunarDetails.recommendedSurah.virtueHa
                      : langKey === 'en'
                      ? lunarDetails.recommendedSurah.virtueEn
                      : lunarDetails.recommendedSurah.virtueFr}
                  </p>
                </div>

                {/* Sacred Incense */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/40 to-slate-900/80 border border-amber-500/30 space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                    {t.incenseTitle}
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {langKey === 'ha'
                      ? lunarDetails.recommendedIncenseHa
                      : langKey === 'en'
                      ? lunarDetails.recommendedIncenseEn
                      : lunarDetails.recommendedIncenseFr}
                  </p>
                </div>
              </div>

            </div>

            {/* Caution Alert if available */}
            {lunarDetails.cautionAlertFr && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-300 mb-0.5">{t.cautionTitle}</span>
                  {langKey === 'ha'
                    ? lunarDetails.cautionAlertHa
                    : langKey === 'en'
                    ? lunarDetails.cautionAlertEn
                    : lunarDetails.cautionAlertFr}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 2: Practices & Asma al-Husna */}
        {activeTab === 'practices' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-800/40 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                {t.asmaTitle}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lunarDetails.recommendedAsma.map((asma, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900/90 border border-indigo-500/20 hover:border-amber-500/40 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300">
                        {t.abjadWeight} {asma.abjadValue}
                      </span>
                      <span className="text-xl font-arabic font-bold text-amber-400">
                        {asma.arabic}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base">
                        {asma.transliteration}
                      </h4>
                      <p className="text-xs text-indigo-200/80 mt-0.5">
                        {langKey === 'ha'
                          ? asma.meaningHa
                          : langKey === 'en'
                          ? asma.meaningEn
                          : asma.meaningFr}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-indigo-900/40 flex items-center justify-between text-xs font-mono">
                      <span className="text-indigo-400">{t.asmaCount}</span>
                      <span className="font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {asma.recommendedCount}x
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Monthly Synodic Timeline */}
        {activeTab === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-800/40 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  {t.timelineTitle}
                </h3>
                <p className="text-xs text-indigo-300/80 mt-1">
                  {t.timelineSubtitle}
                </p>
              </div>

              {/* Day-by-Day Ribbon Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2.5">
                {monthlyTimeline.map((item, idx) => {
                  const itemDateStr = new Date(selectedDate.getTime() + (idx - 14) * 86400000)
                    .toISOString()
                    .split('T')[0];
                  const isCurrent = itemDateStr === selectedDateStr;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDateStr(itemDateStr)}
                      className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
                        isCurrent
                          ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-lg scale-105 z-10'
                          : 'bg-indigo-950/40 border-indigo-900/40 hover:border-indigo-600/60'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-indigo-300">
                        {itemDateStr.slice(5)}
                      </span>
                      
                      <div className="my-1.5">
                        <Moon className={`w-5 h-5 ${
                          item.illuminationPercentage > 75
                            ? 'text-amber-300 fill-amber-300/30'
                            : item.illuminationPercentage > 25
                            ? 'text-indigo-300'
                            : 'text-slate-500'
                        }`} />
                      </div>

                      <span className="text-xs font-bold text-white font-mono">
                        {item.illuminationPercentage}%
                      </span>
                      
                      <span className="text-[9px] text-indigo-400 truncate w-full mt-0.5">
                        {item.hijriDate.day} {getHijriMonthName(item)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 4: Intentions Guide */}
        {activeTab === 'intentions' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-800/40 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-400" />
                  {t.intentionsTitle}
                </h3>
                <p className="text-xs text-indigo-300/80 mt-1">
                  {t.intentionsSubtitle}
                </p>
              </div>

              {/* Clickable Intention Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(['jalb', 'kashf', 'tathir', 'khalwa'] as const).map((key) => {
                  const item = t.intentions[key];
                  const isSelected = selectedIntention === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedIntention(key)}
                      className={`p-5 rounded-2xl text-left transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/40 shadow-xl'
                          : 'bg-indigo-950/30 border-indigo-900/40 hover:border-indigo-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm sm:text-base text-white">
                          {item.title}
                        </h4>
                        {isSelected && (
                          <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-indigo-200/80 mt-2 leading-relaxed">
                        {item.desc}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-indigo-900/40 text-[11px] font-mono font-bold text-amber-300">
                        {item.bestPhase}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 5: Yearly Major Lunar Ephemeris */}
        {activeTab === 'ephemeris' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-800/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    {t.ephemerisTitle}
                  </h3>
                  <p className="text-xs text-indigo-300/80 mt-1">
                    {t.ephemerisSubtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-indigo-300 font-semibold">{t.filterYear}</span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-xl bg-indigo-950 border border-indigo-700/50 text-xs font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table of Major Moons */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-indigo-800/60 text-indigo-400 font-mono uppercase text-[10px]">
                      <th className="pb-3 px-3">Date Grégorienne</th>
                      <th className="pb-3 px-3">Événement</th>
                      <th className="pb-3 px-3">Illumination</th>
                      <th className="pb-3 px-3">Signe Zodiacal</th>
                      <th className="pb-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-900/40">
                    {yearlyEvents.map((evt, idx) => (
                      <tr key={idx} className="hover:bg-indigo-950/40 transition-colors">
                        <td className="py-3 px-3 font-mono text-white">
                          {evt.date.toISOString().split('T')[0]}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1.5 font-bold ${
                            evt.type === 'full_moon' ? 'text-amber-300' : 'text-indigo-300'
                          }`}>
                            {evt.type === 'full_moon' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                            {langKey === 'ha' ? evt.nameHa : langKey === 'en' ? evt.nameEn : evt.nameFr}
                            {evt.isSupermoon && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                Superlune
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-indigo-200">
                          {evt.illumination}%
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {langKey === 'ha' ? evt.zodiacSignHa : langKey === 'en' ? evt.zodiacSignEn : evt.zodiacSignFr}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDateStr(evt.date.toISOString().split('T')[0]);
                              setActiveTab('overview');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 text-xs font-semibold transition-all"
                          >
                            Inspecter
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Parchment Exporter Modal */}
        {showParchmentModal && (
          <ParchmentExporterModal
            isOpen={showParchmentModal}
            onClose={() => setShowParchmentModal(false)}
            title={t.parchmentCardTitle}
            subtitle={`${getPhaseName(lunarDetails)} — ${selectedDateStr}`}
            content={
              <div className="space-y-4 text-xs text-amber-950 font-serif leading-relaxed">
                <div className="p-4 rounded-xl border border-amber-900/30 bg-amber-50/50 space-y-2">
                  <div className="flex justify-between font-bold border-b border-amber-900/20 pb-1">
                    <span>Date Grégorienne : {selectedDateStr}</span>
                    <span>Date Hijri : {lunarDetails.hijriDate.day} {getHijriMonthName(lunarDetails)} {lunarDetails.hijriDate.year}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div><strong>Phase :</strong> {getPhaseName(lunarDetails)} ({lunarDetails.arabicName})</div>
                    <div><strong>Illumination :</strong> {lunarDetails.illuminationPercentage}% ({lunarDetails.ageDays} jours)</div>
                    <div><strong>Manoir Lunaire :</strong> #{lunarDetails.mansionNumber} {getMansionName(lunarDetails)} ({lunarDetails.mansionNameAr})</div>
                    <div><strong>Position :</strong> {lunarDetails.zodiacDegree}° {getZodiacName(lunarDetails)} ({lunarDetails.element})</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-amber-900 mb-1">✦ Orientation Énergétique & Spirituelle :</h4>
                  <p className="italic bg-amber-50/40 p-2.5 rounded-lg border border-amber-900/20">
                    "{langKey === 'ha' ? lunarDetails.spiritualDomainHa : langKey === 'en' ? lunarDetails.spiritualDomainEn : lunarDetails.spiritualDomainFr}"
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-amber-900 mb-1">✦ Noms Divins Aligné(s) & Invocations :</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {lunarDetails.recommendedAsma.map((asma, idx) => (
                      <li key={idx}>
                        <strong>{asma.transliteration}</strong> ({asma.arabic}) — {asma.recommendedCount}x (Adad: {asma.abjadValue}) : {langKey === 'ha' ? asma.meaningHa : langKey === 'en' ? asma.meaningEn : asma.meaningFr}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-900/20">
                  <div>
                    <strong>Sourate Coranique :</strong> {langKey === 'ha' ? lunarDetails.recommendedSurah.nameHa : langKey === 'en' ? lunarDetails.recommendedSurah.nameEn : lunarDetails.recommendedSurah.nameFr} ({lunarDetails.recommendedSurah.nameAr})
                  </div>
                  <div>
                    <strong>Encens Aligné :</strong> {langKey === 'ha' ? lunarDetails.recommendedIncenseHa : langKey === 'en' ? lunarDetails.recommendedIncenseEn : lunarDetails.recommendedIncenseFr}
                  </div>
                </div>
              </div>
            }
          />
        )}

      </div>
    </div>
  );
};
