// Real-Time Falak & Manazil Astro-Spiritual Calculation Engine
// Precise NOAA-based Solar Calculations, Equal/Unequal Hours (Sā'āt Zamaniyyah),
// Real-time Moon Longitude & 28 Lunar Mansions (Manazil al-Qamar),
// and Smart Spiritual Timing Matrix (Planificateur d'Invocations).

import { calculateHijriDate, HijriDateResult } from './hijriDate';
import { EXTRA_MANSIONS_DATA, ExtraMansionData } from '../data/lunarMansionDetails';

export interface CityPreset {
  id: string;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  countryFr: string;
  lat: number;
  lng: number;
  timezone: string;
}

export const HOLY_AND_MAJOR_CITIES: CityPreset[] = [
  { id: 'makkah', nameFr: 'La Mecque', nameEn: 'Makkah', nameAr: 'مكة المكرمة', countryFr: 'Arabie Saoudite', lat: 21.4225, lng: 39.8262, timezone: 'Asia/Riyadh' },
  { id: 'madinah', nameFr: 'Médine', nameEn: 'Madinah', nameAr: 'المدينة المنورة', countryFr: 'Arabie Saoudite', lat: 24.4672, lng: 39.6111, timezone: 'Asia/Riyadh' },
  { id: 'jerusalem', nameFr: 'Al-Quds (Jérusalem)', nameEn: 'Jerusalem', nameAr: 'القدس الشريف', countryFr: 'Palestine', lat: 31.7767, lng: 35.2342, timezone: 'Asia/Jerusalem' },
  { id: 'cairo', nameFr: 'Le Caire', nameEn: 'Cairo', nameAr: 'القاهرة', countryFr: 'Égypte', lat: 30.0444, lng: 31.2357, timezone: 'Africa/Cairo' },
  { id: 'fes', nameFr: 'Fès', nameEn: 'Fez', nameAr: 'فاس', countryFr: 'Maroc', lat: 34.0333, lng: -5.0000, timezone: 'Africa/Casablanca' },
  { id: 'casablanca', nameFr: 'Casablanca', nameEn: 'Casablanca', nameAr: 'الدار البيضاء', countryFr: 'Maroc', lat: 33.5731, lng: -7.5898, timezone: 'Africa/Casablanca' },
  { id: 'timbuktu', nameFr: 'Tombouctou', nameEn: 'Timbuktu', nameAr: 'تمبكتو', countryFr: 'Mali', lat: 16.7666, lng: -3.0026, timezone: 'Africa/Bamako' },
  { id: 'dakar', nameFr: 'Dakar', nameEn: 'Dakar', nameAr: 'داكار', countryFr: 'Sénégal', lat: 14.7167, lng: -17.4677, timezone: 'Africa/Dakar' },
  { id: 'lagos', nameFr: 'Lagos', nameEn: 'Lagos', nameAr: 'لاغوس', countryFr: 'Nigeria', lat: 6.5244, lng: 3.3792, timezone: 'Africa/Lagos' },
  { id: 'kano', nameFr: 'Kano', nameEn: 'Kano', nameAr: 'كانو', countryFr: 'Nigeria', lat: 12.0022, lng: 8.5920, timezone: 'Africa/Lagos' },
  { id: 'niamey', nameFr: 'Niamey', nameEn: 'Niamey', nameAr: 'نيامي', countryFr: 'Niger', lat: 13.5116, lng: 2.1254, timezone: 'Africa/Niamey' },
  { id: 'istanbul', nameFr: 'Istanbul', nameEn: 'Istanbul', nameAr: 'إسطنبول', countryFr: 'Turquie', lat: 41.0082, lng: 28.9784, timezone: 'Europe/Istanbul' },
  { id: 'dubai', nameFr: 'Dubaï', nameEn: 'Dubai', nameAr: 'دبي', countryFr: 'Émirats Arabes Unis', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai' },
  { id: 'paris', nameFr: 'Paris', nameEn: 'Paris', nameAr: 'باريس', countryFr: 'France', lat: 48.8566, lng: 2.3522, timezone: 'Europe/Paris' },
  { id: 'london', nameFr: 'Londres', nameEn: 'London', nameAr: 'لندن', countryFr: 'Royaume-Uni', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' },
  { id: 'newyork', nameFr: 'New York', nameEn: 'New York', nameAr: 'نيويورك', countryFr: 'États-Unis', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York' },
  { id: 'jakarta', nameFr: 'Jakarta', nameEn: 'Jakarta', nameAr: 'جاكرتا', countryFr: 'Indonésie', lat: -6.2088, lng: 106.8456, timezone: 'Asia/Jakarta' }
];

export interface PlanetDetails {
  id: 'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn';
  index: number;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  arabic: string;
  symbol: string;
  color: string;
  bgLight: string;
  bgDark: string;
  borderColor: string;
  angelAr: string;
  angelFr: string;
  angelEn: string;
  jinnKingAr: string;
  jinnKingFr: string;
  dayIndex: number; // 0 Sun, 1 Mon...
  element: 'Feu' | 'Terre' | 'Air' | 'Eau';
  temperamentFr: string;
  metalFr: string;
  incenseFr: string;
  nature: 'Bénéfique' | 'Très Bénéfique' | 'Maléfique' | 'Mixte';
  descFr: string;
  recommendedWorksFr: string[];
  unpropitiousWorksFr: string[];
  wird: {
    name: string;
    arabic: string;
    count: number;
    virtueFr: string;
  };
}

export const PLANETS_DATA: Record<string, PlanetDetails> = {
  sun: {
    id: 'sun',
    index: 0,
    nameFr: 'Soleil',
    nameEn: 'Sun',
    nameHa: 'Rana',
    arabic: 'الشمس',
    symbol: '☉',
    color: 'text-amber-500',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-950/30',
    borderColor: 'border-amber-400 dark:border-amber-700',
    angelAr: 'رُوقْيَائِيل',
    angelFr: 'Rūqiyā’īl',
    angelEn: 'Ruqiyail',
    jinnKingAr: 'المُذْهِب',
    jinnKingFr: 'Al-Mudhib (Roi du Dimanche)',
    dayIndex: 0,
    element: 'Feu',
    temperamentFr: 'Chaud & Sec',
    metalFr: 'Or Pur (Dhahab)',
    incenseFr: 'Oud Royal, Santal Blanc & Safran',
    nature: 'Très Bénéfique',
    descFr: 'Rayonnement, noblesse, autorité, charisme, exaucement auprès des dirigeants et guérison vitale.',
    recommendedWorksFr: ['Élévation sociale', 'Rencontre des autorités', 'Talismans de charisme (Haybah)', 'Guérison générale'],
    unpropitiousWorksFr: ['Opérations de séparation', 'Complots secrets'],
    wird: {
      name: 'Yā Ḥayyu Yā Qayyūm',
      arabic: 'يَا حَيُّ يَا قَيُّومُ',
      count: 174,
      virtueFr: 'Illumination du cœur, prestige et énergie vitale inébranlable.'
    }
  },
  venus: {
    id: 'venus',
    index: 1,
    nameFr: 'Vénus',
    nameEn: 'Venus',
    nameHa: 'Zahra',
    arabic: 'الزهرة',
    symbol: '♀',
    color: 'text-emerald-500',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/30',
    borderColor: 'border-emerald-400 dark:border-emerald-700',
    angelAr: 'عَنْيَائِيل',
    angelFr: '‘Aniyā’īl',
    angelEn: 'Aniyail',
    jinnKingAr: 'زَوْبَعَة',
    jinnKingFr: 'Zawba‘ah / Abū Ḥasan (Roi du Vendredi)',
    dayIndex: 5,
    element: 'Air',
    temperamentFr: 'Chaud & Humide',
    metalFr: 'Cuivre Rouge (Nuhas)',
    incenseFr: 'Musc Blanc, Rose de Damas & Ambre Gris',
    nature: 'Très Bénéfique',
    descFr: 'Amour céleste, concorde conjugale, attraction magnétique, beauté, art et prospérité douce.',
    recommendedWorksFr: ['Mariage (Nikah)', 'Attraction d’amour sincère (Mahabbah)', 'Réconciliation', 'Commerce de luxe & Beauté'],
    unpropitiousWorksFr: ['Conflits armés', 'Ruptures'],
    wird: {
      name: 'Yā Wadūd Yā Laṭīf',
      arabic: 'يَا وَدُودُ يَا لَطِيفُ',
      count: 149,
      virtueFr: 'Harmonie totale dans le couple, douceur de vivre et paix relationnelle.'
    }
  },
  mercury: {
    id: 'mercury',
    index: 2,
    nameFr: 'Mercure',
    nameEn: 'Mercury',
    nameHa: 'Utarid',
    arabic: 'عطارد',
    symbol: '☿',
    color: 'text-cyan-500 dark:text-cyan-400',
    bgLight: 'bg-cyan-50',
    bgDark: 'dark:bg-cyan-950/30',
    borderColor: 'border-cyan-400 dark:border-cyan-700',
    angelAr: 'مِيكَائِيل',
    angelFr: 'Mīkā’īl',
    angelEn: 'Mikail',
    jinnKingAr: 'بَرْقَان',
    jinnKingFr: 'Barqān (Roi du Mercredi)',
    dayIndex: 3,
    element: 'Air',
    temperamentFr: 'Froid & Sec / Adaptable',
    metalFr: 'Vif-argent / Mercure (Zaybaq)',
    incenseFr: 'Mastic (Mastik), Coriandre & Graines de Céleri',
    nature: 'Mixte',
    descFr: 'Intelligence vive, éloquence, sciences ésotériques (Jafar/Raml/Abjad), contrats et commerce.',
    recommendedWorksFr: ['Études & Examens', 'Écriture de Khawatim & Awfaq', 'Calculs d’Asrar', 'Négociations commerciales'],
    unpropitiousWorksFr: ['Engagements sentimentaux rigides'],
    wird: {
      name: 'Yā ‘Alīmu Yā Ḥakīm',
      arabic: 'يَا عَلِيمُ يَا حَكِيمُ',
      count: 228,
      virtueFr: 'Ouverture fulgurante de la mémoire, compréhension des textes sacrés et inspiration.'
    }
  },
  moon: {
    id: 'moon',
    index: 3,
    nameFr: 'Lune',
    nameEn: 'Moon',
    nameHa: 'Wata',
    arabic: 'القمر',
    symbol: '☽',
    color: 'text-indigo-400 dark:text-indigo-300',
    bgLight: 'bg-indigo-50',
    bgDark: 'dark:bg-indigo-950/30',
    borderColor: 'border-indigo-400 dark:border-indigo-700',
    angelAr: 'جِبْرَائِيل',
    angelFr: 'Jibrā’īl',
    angelEn: 'Gabriel',
    jinnKingAr: 'الأَبْيَض',
    jinnKingFr: 'Al-Abyaḍ / Murrah (Roi du Lundi)',
    dayIndex: 1,
    element: 'Eau',
    temperamentFr: 'Froid & Humide',
    metalFr: 'Argent Pur (Fiddah)',
    incenseFr: 'Camphre (Kafur), Benjoin Blanc & Jasmin',
    nature: 'Bénéfique',
    descFr: 'Voyages maritimes ou terrestres, réceptivité spirituelle, rêves véridiques, fécondité et eaux vivifiantes.',
    recommendedWorksFr: ['Déplacements & Traversées', 'Rituels de fécondité', 'Soins de l’âme et du psychisme', 'Transmission de secrets'],
    unpropitiousWorksFr: ['Affaires nécessitant une stabilité immobile'],
    wird: {
      name: 'Yā Laṭīf Yā Nūr',
      arabic: 'يَا لَطِيفُ يَا نُورُ',
      count: 385,
      virtueFr: 'Guidance intuitive dans le noir, rêves prophétiques et apaisement profond du cœur.'
    }
  },
  saturn: {
    id: 'saturn',
    index: 4,
    nameFr: 'Saturne',
    nameEn: 'Saturn',
    nameHa: 'Zuhal',
    arabic: 'زحل',
    symbol: '♄',
    color: 'text-slate-700 dark:text-slate-300',
    bgLight: 'bg-slate-100',
    bgDark: 'dark:bg-slate-900',
    borderColor: 'border-slate-400 dark:border-slate-700',
    angelAr: 'كَسْفَيَائِيل',
    angelFr: 'Kasfayā’īl',
    angelEn: 'Kasfiyail',
    jinnKingAr: 'مَيْمُون',
    jinnKingFr: 'Maymūn Aba Nūkh (Roi du Samedi)',
    dayIndex: 6,
    element: 'Terre',
    temperamentFr: 'Froid & Sec',
    metalFr: 'Plomb (Rasas)',
    incenseFr: 'Myrrhe Noire, Rue Sauvage & Ail Séché',
    nature: 'Maléfique',
    descFr: 'Ancrage séculaire, protection contre les sorts, immobilisation d’ennemis, discipline et œuvres de longue durée.',
    recommendedWorksFr: ['Désenvoûtement lourd', 'Construction durable de murailles', 'Protection contre les attaques occultes'],
    unpropitiousWorksFr: ['Mariage', 'Fêtes', 'Lancements commerciaux festifs'],
    wird: {
      name: 'Yā Quddūs Yā Salām',
      arabic: 'يَا قُدُّوسُ يَا سَلَامُ',
      count: 301,
      virtueFr: 'Purification absolue des impuretés astrales et bouclier contre les machinations.'
    }
  },
  jupiter: {
    id: 'jupiter',
    index: 5,
    nameFr: 'Jupiter',
    nameEn: 'Jupiter',
    nameHa: 'Mushtari',
    arabic: 'المشتري',
    symbol: '♃',
    color: 'text-purple-600 dark:text-purple-400',
    bgLight: 'bg-purple-50',
    bgDark: 'dark:bg-purple-950/30',
    borderColor: 'border-purple-400 dark:border-purple-700',
    angelAr: 'صَرْفَيَائِيل',
    angelFr: 'Sarfayā’īl',
    angelEn: 'Sarfiyail',
    jinnKingAr: 'شَمْهُورَش',
    jinnKingFr: 'Shamhūresh (Juge & Roi du Jeudi)',
    dayIndex: 4,
    element: 'Air',
    temperamentFr: 'Chaud & Humide',
    metalFr: 'Étain (Qasdir)',
    incenseFr: 'Encens Mâle (Luban Dhakar), Benjoin (Jawi) & Cannelle',
    nature: 'Très Bénéfique',
    descFr: 'Le Grand Bénéfique (Al-Sa‘d al-Akbar) : Richesse abondante, expansion, justice divine, sagesse et délivrance des opprimés.',
    recommendedWorksFr: ['Attraction de subsistance (Jalb al-Rizq)', 'Affaires juridiques & Procès', 'Ouverture de trésors & Grands investissements'],
    unpropitiousWorksFr: ['Aucune (Heure la plus faste du zodiaque)'],
    wird: {
      name: 'Yā Fattāḥ Yā Razzāq Yā Bāsiṭ',
      arabic: 'يَا فَتَّاحُ يَا رَزَّاقُ يَا بَاسِطُ',
      count: 869,
      virtueFr: 'Ouverture immédiate des portes de la richesse et abondance matérielle et spirituelle.'
    }
  },
  mars: {
    id: 'mars',
    index: 6,
    nameFr: 'Mars',
    nameEn: 'Mars',
    nameHa: 'Mirrikh',
    arabic: 'المريخ',
    symbol: '♂',
    color: 'text-rose-600 dark:text-rose-400',
    bgLight: 'bg-rose-50',
    bgDark: 'dark:bg-rose-950/30',
    borderColor: 'border-rose-400 dark:border-rose-700',
    angelAr: 'سَمْسَمَائِيل',
    angelFr: 'Samsamā’īl',
    angelEn: 'Samsamail',
    jinnKingAr: 'الأَحْمَر',
    jinnKingFr: 'Al-Aḥmar Aba Ya‘qūb (Roi du Mardi)',
    dayIndex: 2,
    element: 'Feu',
    temperamentFr: 'Chaud & Sec',
    metalFr: 'Fer Forgé (Hadid)',
    incenseFr: 'Poivre Noir, Soufre & Graines de Moutarde',
    nature: 'Maléfique',
    descFr: 'Le Petit Maléfique (Al-Nahs al-Asghar) : Énergie guerrière, courage intrépide, châtiment des injustes et domination.',
    recommendedWorksFr: ['Bannissement de tyrans (Dafe al-Zalim)', 'Bravoure et protection martiale', 'Brûlage des entités hostiles'],
    unpropitiousWorksFr: ['Opérations d’amour', 'Associations d’affaires'],
    wird: {
      name: 'Yā Qawiyyu Yā Matīn Yā Jabbār',
      arabic: 'يَا قَوِيُّ يَا مَتِينُ يَا جَبَّارُ',
      count: 736,
      virtueFr: 'Victoire éclatante face aux oppresseurs et protection infranchissable.'
    }
  }
};

// Chaldean Sequence of Planetary Orbits: Saturn (4), Jupiter (5), Mars (6), Sun (0), Venus (1), Mercury (2), Moon (3)
export const CHALDEAN_ORDER: ('saturn' | 'jupiter' | 'mars' | 'sun' | 'venus' | 'mercury' | 'moon')[] = [
  'saturn',
  'jupiter',
  'mars',
  'sun',
  'venus',
  'mercury',
  'moon'
];

// Day Ruler mapping for days of the week: 0=Sunday (Sun), 1=Monday (Moon), 2=Tuesday (Mars), 3=Wednesday (Mercury), 4=Thursday (Jupiter), 5=Friday (Venus), 6=Saturday (Saturn)
export const DAY_RULERS = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];

export interface CalculatedPlanetaryHour {
  hourIndex: number; // 1 to 12
  isDay: boolean;
  planet: PlanetDetails;
  timeStartStr: string;
  timeEndStr: string;
  startMinutes: number;
  endMinutes: number;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  isIjabahHour?: boolean;
}

export interface AccurateSolarData {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  fajrTwilight: Date;
  ishaTwilight: Date;
  dayLengthMinutes: number;
  nightLengthMinutes: number;
  dayHourDurationMinutes: number;
  nightHourDurationMinutes: number;
  dayRulerPlanet: PlanetDetails;
  saahIjabahWindow: {
    start: Date;
    end: Date;
    descriptionFr: string;
  };
}

export interface ActiveLunarMansionInfo {
  mansionNumber: number; // 1 to 28
  nameAr: string;
  nameFr: string;
  nameEn: string;
  degreeSpan: string;
  currentDegreeInZodiac: number;
  progressPercentage: number;
  element: string;
  nature: string;
  angelAr: string;
  angelFr: string;
  incenseFr: string;
  asmaAr: string;
  asmaFr: string;
  wirdAr: string;
  wirdCount: number;
  sadaqahFr: string;
  propitious: string[];
  unpropitious: string[];
  descFr: string;
}

export interface SmartTimingWindow {
  id: string;
  date: Date;
  dateStr: string;
  timeRangeStr: string;
  planet: PlanetDetails;
  mansion: ActiveLunarMansionInfo;
  intentionId: string;
  intentionTitleFr: string;
  harmonyScore: number; // 0 to 100
  harmonyTitleFr: string;
  alignmentReasonFr: string;
  isIjabahSynchronized: boolean;
  recommendedZikr: string;
  recommendedIncense: string;
}

// ----------------------------------------------------
// ASTRONOMICAL COMPUTATIONS (NOAA Exact Solar Equations)
// ----------------------------------------------------

function toRad(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function toDeg(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

/**
 * Computes exact NOAA Solar times for a given GPS location & date
 */
export function calculateAccurateSolarTimes(
  lat: number,
  lng: number,
  targetDate: Date = new Date()
): AccurateSolarData {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();

  // Julian Day
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const julianDay =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  const julianCentury = (julianDay - 2451545.0) / 36525.0;

  // Geometric Mean Longitude of the Sun (deg)
  const geomMeanLongSun = (280.46646 + julianCentury * (36000.76983 + julianCentury * 0.0003032)) % 360;

  // Geometric Mean Anomaly of the Sun (deg)
  const geomMeanAnomSun = 357.52911 + julianCentury * (35999.05029 - 0.0001537 * julianCentury);

  // Eccentricity of Earth's orbit
  const eccentEarthOrbit = 0.016708634 - julianCentury * (0.000042037 + 0.0000001267 * julianCentury);

  // Sun Equation of the Center
  const sunEqOfCtr =
    Math.sin(toRad(geomMeanAnomSun)) * (1.914602 - julianCentury * (0.004817 + 0.000014 * julianCentury)) +
    Math.sin(toRad(2 * geomMeanAnomSun)) * (0.019993 - 0.000101 * julianCentury) +
    Math.sin(toRad(3 * geomMeanAnomSun)) * 0.000289;

  // Sun True Longitude
  const sunTrueLong = geomMeanLongSun + sunEqOfCtr;

  // Sun Apparent Longitude
  const sunAppLong = sunTrueLong - 0.00569 - 0.00478 * Math.sin(toRad(125.04 - 1934.136 * julianCentury));

  // Mean Obliquity of the Ecliptic
  const meanObliqEcliptic =
    23 + (26 + (21.448 - julianCentury * (46.815 + julianCentury * (0.00059 - julianCentury * 0.001813))) / 60) / 60;

  // Obliquity Correction
  const obliqCorr = meanObliqEcliptic + 0.00256 * Math.cos(toRad(125.04 - 1934.136 * julianCentury));

  // Sun Declination
  const sunDeclin = toDeg(Math.asin(Math.sin(toRad(obliqCorr)) * Math.sin(toRad(sunAppLong))));

  // Equation of Time (minutes)
  const varY = Math.tan(toRad(obliqCorr / 2)) * Math.tan(toRad(obliqCorr / 2));
  const eqOfTime =
    4 *
    toDeg(
      varY * Math.sin(2 * toRad(geomMeanLongSun)) -
        2 * eccentEarthOrbit * Math.sin(toRad(geomMeanAnomSun)) +
        4 * eccentEarthOrbit * varY * Math.sin(toRad(geomMeanAnomSun)) * Math.cos(2 * toRad(geomMeanLongSun)) -
        0.5 * varY * varY * Math.sin(4 * toRad(geomMeanLongSun)) -
        1.25 * eccentEarthOrbit * eccentEarthOrbit * Math.sin(2 * toRad(geomMeanAnomSun))
    );

  // Hour Angle for Sunrise / Sunset (Zenith angle = 90.833° for atmospheric refraction)
  const zenithSunrise = 90.833;
  const haArg =
    Math.cos(toRad(zenithSunrise)) / (Math.cos(toRad(lat)) * Math.cos(toRad(sunDeclin))) -
    Math.tan(toRad(lat)) * Math.tan(toRad(sunDeclin));

  const clampedHa = Math.max(-1, Math.min(1, haArg));
  const haSunrise = toDeg(Math.acos(clampedHa));

  // Solar Noon in minutes from midnight UTC
  const solarNoonUTC = (720 - 4 * lng - eqOfTime + 1440) % 1440;

  // Local Timezone Offset in minutes
  const tzOffsetMin = -targetDate.getTimezoneOffset();

  // Local Solar Noon, Sunrise, Sunset in minutes from 00:00 local time
  const localSolarNoonMin = (solarNoonUTC + tzOffsetMin + 1440) % 1440;
  const sunriseMin = (localSolarNoonMin - haSunrise * 4 + 1440) % 1440;
  const sunsetMin = (localSolarNoonMin + haSunrise * 4 + 1440) % 1440;

  // Astronomical Dawn (Fajr, ~18° below horizon) & Dusk (Isha, ~18° below horizon)
  const haFajrArg =
    Math.cos(toRad(108)) / (Math.cos(toRad(lat)) * Math.cos(toRad(sunDeclin))) -
    Math.tan(toRad(lat)) * Math.tan(toRad(sunDeclin));
  const haFajr = toDeg(Math.acos(Math.max(-1, Math.min(1, haFajrArg))));
  const fajrMin = (localSolarNoonMin - haFajr * 4 + 1440) % 1440;
  const ishaMin = (localSolarNoonMin + haFajr * 4 + 1440) % 1440;

  // Helper date creator
  const createDateFromMinutes = (mins: number) => {
    const d = new Date(targetDate);
    const h = Math.floor(mins / 60);
    const m = Math.floor(mins % 60);
    const s = Math.round((mins * 60) % 60);
    d.setHours(h, m, s, 0);
    return d;
  };

  const sunriseDate = createDateFromMinutes(sunriseMin);
  let sunsetDate = createDateFromMinutes(sunsetMin);
  if (sunsetDate.getTime() <= sunriseDate.getTime()) {
    sunsetDate = new Date(sunsetDate.getTime() + 24 * 3600 * 1000);
  }

  const noonDate = createDateFromMinutes(localSolarNoonMin);
  const fajrDate = createDateFromMinutes(fajrMin);
  const ishaDate = createDateFromMinutes(ishaMin);

  // Day & Night Durations
  const dayLengthMinutes = (sunsetDate.getTime() - sunriseDate.getTime()) / (60 * 1000);
  const nightLengthMinutes = 1440 - dayLengthMinutes;

  const dayHourDurationMinutes = dayLengthMinutes / 12;
  const nightHourDurationMinutes = nightLengthMinutes / 12;

  // Day ruler
  const dayOfWeek = targetDate.getDay(); // 0 Sun, 1 Mon...
  const rulerKey = DAY_RULERS[dayOfWeek];
  const dayRulerPlanet = PLANETS_DATA[rulerKey];

  // Sā'ah al-Ijābah: Last unequal hour of Friday before Sunset
  const isFriday = dayOfWeek === 5;
  const saahIjabahStart = isFriday
    ? new Date(sunsetDate.getTime() - dayHourDurationMinutes * 60 * 1000)
    : new Date(sunriseDate.getTime() - (nightHourDurationMinutes * 2) * 60 * 1000); // Or last 1/3 of the night
  const saahIjabahEnd = isFriday ? sunsetDate : new Date(sunriseDate.getTime());

  return {
    sunrise: sunriseDate,
    sunset: sunsetDate,
    solarNoon: noonDate,
    fajrTwilight: fajrDate,
    ishaTwilight: ishaDate,
    dayLengthMinutes,
    nightLengthMinutes,
    dayHourDurationMinutes,
    nightHourDurationMinutes,
    dayRulerPlanet,
    saahIjabahWindow: {
      start: saahIjabahStart,
      end: saahIjabahEnd,
      descriptionFr: isFriday
        ? "Dernière heure du Vendredi avant le coucher du soleil (Moment suprême d'exaucement selon la Sunnah)."
        : "Dernier tiers de la nuit avant l'aube (Descente de la Miséricorde divine)."
    }
  };
}

/**
 * Computes all 24 unequal planetary hours for a given day
 */
export function generateAll24PlanetaryHours(
  lat: number,
  lng: number,
  date: Date = new Date()
): {
  allHours: CalculatedPlanetaryHour[];
  dayHours: CalculatedPlanetaryHour[];
  nightHours: CalculatedPlanetaryHour[];
  currentHour: CalculatedPlanetaryHour;
  activeSolar: AccurateSolarData;
} {
  const solar = calculateAccurateSolarTimes(lat, lng, date);
  const dayOfWeek = date.getDay();
  const dayRulerKey = DAY_RULERS[dayOfWeek];

  const startIndexInChaldean = CHALDEAN_ORDER.indexOf(dayRulerKey as any);

  const dayHours: CalculatedPlanetaryHour[] = [];
  const nightHours: CalculatedPlanetaryHour[] = [];
  const allHours: CalculatedPlanetaryHour[] = [];

  const nowTimeMs = date.getTime();

  // 12 Diurnal unequal hours
  for (let i = 0; i < 12; i++) {
    const planetKey = CHALDEAN_ORDER[(startIndexInChaldean + i) % 7];
    const planet = PLANETS_DATA[planetKey];

    const startMs = solar.sunrise.getTime() + i * solar.dayHourDurationMinutes * 60 * 1000;
    const endMs = solar.sunrise.getTime() + (i + 1) * solar.dayHourDurationMinutes * 60 * 1000;

    const startDate = new Date(startMs);
    const endDate = new Date(endMs);

    const isCurrent = nowTimeMs >= startMs && nowTimeMs < endMs;
    const isIjabahHour = dayOfWeek === 5 && i === 11; // 12th hour of Friday

    const hourObj: CalculatedPlanetaryHour = {
      hourIndex: i + 1,
      isDay: true,
      planet,
      timeStartStr: formatHoursMinutes(startDate),
      timeEndStr: formatHoursMinutes(endDate),
      startMinutes: startDate.getHours() * 60 + startDate.getMinutes(),
      endMinutes: endDate.getHours() * 60 + endDate.getMinutes(),
      startDate,
      endDate,
      isCurrent,
      isIjabahHour
    };

    dayHours.push(hourObj);
    allHours.push(hourObj);
  }

  // 12 Nocturnal unequal hours
  for (let i = 0; i < 12; i++) {
    const planetKey = CHALDEAN_ORDER[(startIndexInChaldean + 12 + i) % 7];
    const planet = PLANETS_DATA[planetKey];

    const startMs = solar.sunset.getTime() + i * solar.nightHourDurationMinutes * 60 * 1000;
    const endMs = solar.sunset.getTime() + (i + 1) * solar.nightHourDurationMinutes * 60 * 1000;

    const startDate = new Date(startMs);
    const endDate = new Date(endMs);

    const isCurrent = nowTimeMs >= startMs && nowTimeMs < endMs;
    const isIjabahHour = (dayOfWeek === 4 || dayOfWeek === 5) && i >= 8; // last third of night

    const hourObj: CalculatedPlanetaryHour = {
      hourIndex: i + 1,
      isDay: false,
      planet,
      timeStartStr: formatHoursMinutes(startDate),
      timeEndStr: formatHoursMinutes(endDate),
      startMinutes: startDate.getHours() * 60 + startDate.getMinutes(),
      endMinutes: endDate.getHours() * 60 + endDate.getMinutes(),
      startDate,
      endDate,
      isCurrent,
      isIjabahHour
    };

    nightHours.push(hourObj);
    allHours.push(hourObj);
  }

  // Find currently active hour (or default to the first one)
  let currentHour = allHours.find((h) => h.isCurrent);
  if (!currentHour) {
    currentHour = allHours[0];
  }

  return {
    allHours,
    dayHours,
    nightHours,
    currentHour,
    activeSolar: solar
  };
}

// ----------------------------------------------------
// 28 DEMEURES DE LA LUNE (MANAZIL AL-QAMAR)
// ----------------------------------------------------

const MANSIONS_STATIC = [
  { id: 1, name: "Al-Sharatain", arabic: "الشرطين", element: "Feu", nature: "Bénéfique", desc: "Les deux cornes du Bélier. Début du zodiaque lunaire. Favorable aux initiatives rapides, aux voyages et au courage.", propitious: ["Voyages", "Commerce", "Nouvelles initiatives"], unpropitious: ["Mariage", "Construction"] },
  { id: 2, name: "Al-Butayn", arabic: "البطين", element: "Terre", nature: "Mixte", desc: "Le ventre du Bélier. Favorable à la recherche de trésors, l'ancrage, la plantation et l'acquisition.", propitious: ["Recherche de trésors", "Plantations", "Achats"], unpropitious: ["Voyages sur l'eau", "Vente"] },
  { id: 3, name: "Al-Thurayya", arabic: "الثريا", element: "Air", nature: "Très Bénéfique", desc: "Les Pléiades. Siège d'abondance, d'amour, d'alchimie spirituelle et de charisme rayonnant.", propitious: ["Amour (Mahabba)", "Alchimie", "Bénédictions", "Richesse"], unpropitious: ["Séparation", "Conflits"] },
  { id: 4, name: "Al-Dabaran", arabic: "الدبران", element: "Terre", nature: "Maléfique", desc: "Le suiveur (Aldébaran). Énergie martiale sévère, rupture des liens malfaisants et destruction d'ennemis.", propitious: ["Destruction d'ennemis", "Séparation justifiée"], unpropitious: ["Mariage", "Commerce", "Voyage"] },
  { id: 5, name: "Al-Haq'a", arabic: "الهقعة", element: "Air", nature: "Mixte", desc: "La tête d'Orion. Favorable aux sciences occultes, à la méditation, l'apprentissage du Coran et l'intellect.", propitious: ["Études mystiques", "Méditation", "Compréhension"], unpropitious: ["Confrontations", "Guerres"] },
  { id: 6, name: "Al-Han'a", arabic: "الهنعة", element: "Feu", nature: "Bénéfique", desc: "La marque d'honneur. Faste pour s'adresser aux souverains, solliciter des faveurs et chasser la pauvreté.", propitious: ["Chasse", "Demandes aux rois", "Audace"], unpropitious: ["Prêts d'argent", "Dettes"] },
  { id: 7, name: "Al-Dhira", arabic: "الذراع", element: "Eau", nature: "Bénéfique", desc: "Le bras puissant. Demeure de guérison, de fertilité, de santé et d'abondance commerciale.", propitious: ["Guérison", "Commerce", "Agriculture", "Nouvel emploi"], unpropitious: [] },
  { id: 8, name: "Al-Nathra", arabic: "النثرة", element: "Feu", nature: "Mixte", desc: "La crèche du Lion. Apporte une victoire fulgurante et des résultats rapides à court terme.", propitious: ["Opérations rapides", "Victoire soudaine"], unpropitious: ["Projets de longue durée", "Contrats permanents"] },
  { id: 9, name: "Al-Tarf", arabic: "الطرف", element: "Terre", nature: "Maléfique", desc: "Le regard perçant du Lion. Châtiment des oppresseurs et protection agressive contre le mauvais œil.", propitious: ["Défense agressive", "Protection contre tyrans"], unpropitious: ["Mariage", "Voyages", "Commerce"] },
  { id: 10, name: "Al-Jabha", arabic: "الجبهة", element: "Feu", nature: "Très Bénéfique", desc: "Le front royal du Lion (Régulus). Charisme suprême, prestige, amour noble et triomphe politique.", propitious: ["Amour noble", "Réussite royale", "Charisme", "Renommée"], unpropitious: [] },
  { id: 11, name: "Al-Zubra", arabic: "الزبرة", element: "Terre", nature: "Bénéfique", desc: "La crinière du Lion. Accumulation de richesses licites, protection des biens et prestige professionnel.", propitious: ["Acquisition de biens", "Succès financier", "Protection"], unpropitious: [] },
  { id: 12, name: "Al-Sarfah", arabic: "الصرفة", element: "Air", nature: "Mixte", desc: "Le tournant céleste. Favorable pour débloquer des situations enkystées et libérer les prisonniers.", propitious: ["Libération", "Agriculture", "Changement de vie"], unpropitious: ["Voyages en mer", "Stabilité fixe"] },
  { id: 13, name: "Al-Awwa", arabic: "العواء", element: "Terre", nature: "Bénéfique", desc: "Le rassembleur de la Vierge. Favorable aux mariages solides, partenariats fructueux et réconciliations.", propitious: ["Mariage", "Accords commerciaux", "Réconciliation"], unpropitious: [] },
  { id: 14, name: "Al-Simak", arabic: "السماك", element: "Feu", nature: "Mixte", desc: "L'étoile Spica. Grande attraction magnétique, déménagement et voyages favorables.", propitious: ["Attraction amoureuse", "Voyage", "Déménagement"], unpropitious: ["Traitement des maladies lourdes"] },
  { id: 15, name: "Al-Ghafr", arabic: "الغفر", element: "Terre", nature: "Très Bénéfique", desc: "Le voile divin. Sanctuaire de haute spiritualité, exaucement des invocations et découverte des secrets.", propitious: ["Toutes les bonnes œuvres", "Prières exaucées", "Secrets"], unpropitious: [] },
  { id: 16, name: "Al-Zubana", arabic: "الزبانا", element: "Air", nature: "Maléfique", desc: "Les pinces du Scorpion. Rupture des pactes mensongers, séparation et discorde des corrompus.", propitious: ["Séparation légitime", "Rupture de liens toxiques"], unpropitious: ["Voyage", "Mariage", "Commerce"] },
  { id: 17, name: "Al-Iklil", arabic: "الإكليل", element: "Eau", nature: "Mixte", desc: "La couronne boréale. Favorable pour sceller des fondations solides et protéger ses acquis.", propitious: ["Bâtir", "Animaux", "Protection de demeure"], unpropitious: [] },
  { id: 18, name: "Al-Qalb", arabic: "القلب", element: "Feu", nature: "Maléfique", desc: "Le cœur du Scorpion (Antarès). Énergie martiale tranchante, courage inébranlable et protection.", propitious: ["Domination d'ennemis", "Guerre spirituelle"], unpropitious: ["Amour", "Paix", "Voyages calmes"] },
  { id: 19, name: "Al-Shaulah", arabic: "الشولة", element: "Eau", nature: "Mixte", desc: "Le dard du Scorpion. Actions secrètes, protection contre les trahisons et capture du gibier.", propitious: ["Opérations secrètes", "Poursuites", "Vigilance"], unpropitious: [] },
  { id: 20, name: "Al-Na'aim", arabic: "النعائم", element: "Feu", nature: "Bénéfique", desc: "Les autruches du Sagittaire. Voyage sans péril, expansion commerciale lointaine et bénédictions.", propitious: ["Voyages", "Commerce international", "Montures & Voitures"], unpropitious: [] },
  { id: 21, name: "Al-Baldah", arabic: "البلدة", element: "Terre", nature: "Bénéfique", desc: "Le sanctuaire de construction. Fonder un foyer, acquérir des terrains et bâtir pour l'avenir.", propitious: ["Bâtir", "Mariage", "Récoltes", "Établissement"], unpropitious: [] },
  { id: 22, name: "Sa'd al-Dhabih", arabic: "سعد الذابح", element: "Feu", nature: "Maléfique", desc: "L'étoile du sacrifice. Énergie de coupure, fuite du danger et rupture d'attaches néfastes.", propitious: ["Fuite du danger", "Libération d'emprises"], unpropitious: ["Toute bonne alliance", "Mariage"] },
  { id: 23, name: "Sa'd Bula", arabic: "سعد بلع", element: "Terre", nature: "Mixte", desc: "L'absorption céleste. Très favorable à la médecine (ingérer les remèdes) et dissolution des litiges.", propitious: ["Médecine", "Dissolution des conflits", "Traitements"], unpropitious: [] },
  { id: 24, name: "Sa'd al-Su'ud", arabic: "سعد السعود", element: "Air", nature: "Très Bénéfique", desc: "La Félicité des Félicités. La demeure la plus souverainement fortunée de tout le zodiaque.", propitious: ["Amour suprême", "Richesse royale", "Mariage béni", "Élévation"], unpropitious: [] },
  { id: 25, name: "Sa'd al-Akhbiya", arabic: "سعد الأخبية", element: "Eau", nature: "Bénéfique", desc: "La demeure des trésors cachés. Révélation de secrets mystiques, confection de talismans et protection.", propitious: ["Talismans protecteurs", "Secrets de l'invisible", "Défense"], unpropitious: [] },
  { id: 26, name: "Al-Fargh al-Muqaddam", arabic: "الفرغ المقدم", element: "Feu", nature: "Mixte", desc: "Le premier déversement céleste. Guérison rapide, voyages terrestres et interventions audacieuses.", propitious: ["Voyage", "Traitements médicaux", "Soins"], unpropitious: ["Mariage", "Contrats immobiles"] },
  { id: 27, name: "Al-Fargh al-Mu'akkhar", arabic: "الفرغ المؤخر", element: "Eau", nature: "Bénéfique", desc: "Le second déversement d'abondance. Flux financier continu, commerce florissant et investissements.", propitious: ["Commerce", "Achats majeurs", "Gains financiers"], unpropitious: ["Contracter des dettes"] },
  { id: 28, name: "Rasha", arabic: "الرشا", element: "Eau", nature: "Bénéfique", desc: "Le ventre du poisson (Baton al-Hut). Clôture majestueuse du cycle, plénitude, paix et attraction universelle.", propitious: ["Attraction universelle", "Finalisation de projets", "Paix"], unpropitious: [] }
];

/**
 * Calculates current Moon longitude and active Lunar Mansion (Manzil) in real-time
 */
export function calculateCurrentActiveLunarMansion(date: Date = new Date()): ActiveLunarMansionInfo {
  const timeMs = date.getTime();
  const KNOWN_NEW_MOON_EPOCH_MS = new Date('2026-01-18T19:52:00Z').getTime();
  const SYNODIC_MONTH = 29.530588853;

  const diffDays = (timeMs - KNOWN_NEW_MOON_EPOCH_MS) / (1000 * 60 * 60 * 24);
  let ageDays = diffDays % SYNODIC_MONTH;
  if (ageDays < 0) ageDays += SYNODIC_MONTH;

  const phaseAngleDeg = (ageDays / SYNODIC_MONTH) * 360;

  // Approximate celestial moon ecliptic longitude (0-360 degrees)
  const moonLongitude =
    (phaseAngleDeg + ((date.getUTCFullYear() - 2000) * 360 + date.getUTCMonth() * 30 + date.getUTCDate())) % 360;

  const mansionSpanDeg = 360 / 28; // ~12.85714 degrees
  const mansionIndex = Math.floor(moonLongitude / mansionSpanDeg) % 28;
  const mansionNumber = mansionIndex + 1;

  const degInMansion = moonLongitude % mansionSpanDeg;
  const progressPercentage = Math.round((degInMansion / mansionSpanDeg) * 100);

  const staticData = MANSIONS_STATIC[mansionIndex] || MANSIONS_STATIC[0];
  const extraData: ExtraMansionData | undefined = EXTRA_MANSIONS_DATA[mansionNumber];

  return {
    mansionNumber,
    nameAr: staticData.arabic,
    nameFr: staticData.name,
    nameEn: staticData.name,
    degreeSpan: extraData?.degree || `${Math.floor(mansionIndex * mansionSpanDeg)}° - ${Math.floor((mansionIndex + 1) * mansionSpanDeg)}°`,
    currentDegreeInZodiac: Math.round(moonLongitude * 10) / 10,
    progressPercentage,
    element: staticData.element,
    nature: staticData.nature,
    angelAr: extraData?.angelAr || 'جبرائيل',
    angelFr: extraData?.angelFr || 'Jibra’il',
    incenseFr: extraData?.incenseFr || 'Encens Mâle (Luban Dhakar) & Musc',
    asmaAr: extraData?.asmaAr || 'يَا حَيُّ يَا قَيُّومُ',
    asmaFr: extraData?.asmaFr || 'Ya Hayyu Ya Qayyum',
    wirdAr: extraData?.wirdAr || 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    wirdCount: extraData?.wirdCount || 100,
    sadaqahFr: extraData?.sadaqahFr || 'Pain blanc ou dattes',
    propitious: staticData.propitious,
    unpropitious: staticData.unpropitious,
    descFr: staticData.desc
  };
}

export function getAll28MansionsList(): ActiveLunarMansionInfo[] {
  return MANSIONS_STATIC.map((m, idx) => {
    const num = idx + 1;
    const extra = EXTRA_MANSIONS_DATA[num];
    const spanDeg = 360 / 28;
    return {
      mansionNumber: num,
      nameAr: m.arabic,
      nameFr: m.name,
      nameEn: m.name,
      degreeSpan: extra?.degree || `${Math.floor(idx * spanDeg)}° - ${Math.floor((idx + 1) * spanDeg)}°`,
      currentDegreeInZodiac: Math.floor(idx * spanDeg),
      progressPercentage: 0,
      element: m.element,
      nature: m.nature,
      angelAr: extra?.angelAr || 'جبرائيل',
      angelFr: extra?.angelFr || 'Jibra’il',
      incenseFr: extra?.incenseFr || 'Luban Dhakar',
      asmaAr: extra?.asmaAr || 'يا الله',
      asmaFr: extra?.asmaFr || 'Ya Allah',
      wirdAr: extra?.wirdAr || 'سُبْحَانَ اللَّهِ',
      wirdCount: extra?.wirdCount || 100,
      sadaqahFr: extra?.sadaqahFr || 'Aumône',
      propitious: m.propitious,
      unpropitious: m.unpropitious,
      descFr: m.desc
    };
  });
}

// ----------------------------------------------------
// SMART SPIRITUAL TIMING (PLANIFICATEUR D'INVOCATIONS)
// ----------------------------------------------------

export interface SpiritualIntention {
  id: string;
  titleFr: string;
  titleEn: string;
  titleAr: string;
  icon: string;
  idealPlanets: ('sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn')[];
  idealElements: ('Feu' | 'Terre' | 'Air' | 'Eau')[];
  descriptionFr: string;
  recommendedAsma: string;
  recommendedIncense: string;
}

export const SPIRITUAL_INTENTIONS: SpiritualIntention[] = [
  {
    id: 'protection',
    titleFr: 'Protection & Défense Métaphysique (Ḥifẓ)',
    titleEn: 'Metaphysical Protection & Shield',
    titleAr: 'الحفظ والتحصين ودفع الضرر',
    icon: 'Shield',
    idealPlanets: ['saturn', 'mars', 'sun'],
    idealElements: ['Feu', 'Terre'],
    descriptionFr: 'Destruction des sorts, neutralisation des ennemis et bouclier impénétrable.',
    recommendedAsma: 'يَا حَفِيظُ يَا مَانِعُ يَا سَلَامُ (Ya Hafizu Ya Mani‘u Ya Salam - 407x)',
    recommendedIncense: 'Myrrhe noire, Rue sauvage (Harmel) et Benjoin'
  },
  {
    id: 'rizq',
    titleFr: 'Subsistance, Prospérité & Richesse (Rizq)',
    titleEn: 'Wealth, Abundance & Prosperity',
    titleAr: 'جلب الرزق والتجارة والبركة',
    icon: 'Coins',
    idealPlanets: ['jupiter', 'venus', 'sun'],
    idealElements: ['Air', 'Eau'],
    descriptionFr: 'Ouverture fulgurante des voies financières, succès commercial et gains licites.',
    recommendedAsma: 'يَا فَتَّاحُ يَا رَزَّاقُ يَا غَنِيُّ يَا مُغْنِي (Ya Fattahu Ya Razzaqu Ya Ghaniyyu - 869x)',
    recommendedIncense: 'Luban Dhakar (Encens Mâle), Jawi & Ambre Gris'
  },
  {
    id: 'fath',
    titleFr: 'Ouverture Spirituelle, Sagesse & Khalf (Fatḥ)',
    titleEn: 'Spiritual Illumination & Secrets',
    titleAr: 'الفتح الرباني والعلم والحكمة',
    icon: 'Sparkles',
    idealPlanets: ['mercury', 'sun', 'moon'],
    idealElements: ['Air', 'Feu'],
    descriptionFr: 'Élévation de la conscience, compréhension des sciences secrètes et vision intuitive.',
    recommendedAsma: 'يَا عَلِيمُ يَا حَكِيمُ يَا نُورُ يَا هَادِي (Ya ‘Alimu Ya Hakimu Ya Nur - 584x)',
    recommendedIncense: 'Bois d’Oud Royal, Santal Blanc & Mastic'
  },
  {
    id: 'shifa',
    titleFr: 'Guérison & Santé Globale (Shifā’)',
    titleEn: 'Healing, Vitality & Recovery',
    titleAr: 'الشفاء من الأمراض والصحة',
    icon: 'HeartPulse',
    idealPlanets: ['sun', 'moon', 'jupiter'],
    idealElements: ['Eau', 'Feu'],
    descriptionFr: 'Restauration de la force vitale, guérison des maladies physiques et spirituelles.',
    recommendedAsma: 'يَا شَافِي يَا كَافِي يَا مُعَافِي يَا حَيُّ (Ya Shafi Ya Kafi Ya Mu‘afi - 391x)',
    recommendedIncense: 'Camphre pur, Rose de Damas & Benjoin blanc'
  },
  {
    id: 'mahabba',
    titleFr: 'Amour, Réconciliation & Harmonie (Maḥabbah)',
    titleEn: 'Love, Concord & Reconciliation',
    titleAr: 'المحبة والألفة والوفاق بين الزوجين',
    icon: 'Heart',
    idealPlanets: ['venus', 'moon', 'jupiter'],
    idealElements: ['Air', 'Eau'],
    descriptionFr: 'Attachement sincère, harmonie conjugale et effacement de la discorde.',
    recommendedAsma: 'يَا وَدُودُ يَا رَؤُوفُ يَا عَطُوفُ (Ya Wadudu Ya Ra’ufu Ya ‘Atuf - 129x)',
    recommendedIncense: 'Musc blanc, Eau de rose & Ambre'
  },
  {
    id: 'haybah',
    titleFr: 'Prestige, Élite & Autorité (Haybah & Qubūl)',
    titleEn: 'Charisma, Prestige & Authority',
    titleAr: 'الهيبة والقبول عند الملوك والرؤساء',
    icon: 'Crown',
    idealPlanets: ['sun', 'jupiter'],
    idealElements: ['Feu', 'Air'],
    descriptionFr: 'Charisme magnétique royal, victoire lors d’audiences et respect unanime.',
    recommendedAsma: 'يَا عَزِيزُ يَا جَبَّارُ يَا مُتَكَبِّرُ يَا مَلِكُ (Ya ‘Azizu Ya Jabbar - 638x)',
    recommendedIncense: 'Oud Pur de Birmanie, Safran & Santal Rouge'
  }
];

/**
 * Scans the next 7 days (168 planetary hours) to find the best upcoming Golden Windows for a chosen intention
 */
export function findUpcomingSpiritualWindows(
  intentionId: string,
  lat: number,
  lng: number,
  baseDate: Date = new Date(),
  limitResults: number = 8
): SmartTimingWindow[] {
  const intention = SPIRITUAL_INTENTIONS.find((i) => i.id === intentionId) || SPIRITUAL_INTENTIONS[0];
  const results: SmartTimingWindow[] = [];

  // Iterate across 7 days
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const dayDate = new Date(baseDate.getTime() + dayOffset * 24 * 3600 * 1000);
    const daySolar = calculateAccurateSolarTimes(lat, lng, dayDate);
    const { allHours } = generateAll24PlanetaryHours(lat, lng, dayDate);

    for (const h of allHours) {
      // Don't propose hours that are already in the past
      if (h.endDate.getTime() < baseDate.getTime()) {
        continue;
      }

      const isIdealPlanet = intention.idealPlanets.includes(h.planet.id);
      const isBeneficPlanet = h.planet.nature === 'Très Bénéfique' || h.planet.nature === 'Bénéfique';

      // Compute mansion active at that hour's midpoint
      const midHourDate = new Date((h.startDate.getTime() + h.endDate.getTime()) / 2);
      const mansion = calculateCurrentActiveLunarMansion(midHourDate);

      const isIdealMansionElement = intention.idealElements.includes(mansion.element as any);
      const isBeneficMansion = mansion.nature.includes('Bénéfique');

      // Calculate Alignment / Harmony Score (0 - 100)
      let score = 50;

      if (isIdealPlanet) score += 30;
      else if (isBeneficPlanet) score += 15;

      if (isIdealMansionElement) score += 15;
      if (isBeneficMansion) score += 10;
      if (h.isIjabahHour) score += 15;

      // Filter only matching high-synergy windows (score >= 70)
      if (score >= 70) {
        let harmonyTitle = 'Favorable (Bonne Synergie)';
        if (score >= 90) harmonyTitle = '🌟 Fenêtre d’Exaucement Suprême (Or)';
        else if (score >= 80) harmonyTitle = '✨ Très Faste (Haute Affinité)';

        results.push({
          id: `win-${h.startDate.toISOString()}-${h.planet.id}`,
          date: h.startDate,
          dateStr: formatDateFr(h.startDate),
          timeRangeStr: `${h.timeStartStr} - ${h.timeEndStr}`,
          planet: h.planet,
          mansion,
          intentionId: intention.id,
          intentionTitleFr: intention.titleFr,
          harmonyScore: Math.min(100, score),
          harmonyTitleFr: harmonyTitle,
          alignmentReasonFr: `Heure de ${h.planet.nameFr} (${h.planet.element}) + Demeure N°${mansion.mansionNumber} ${mansion.nameFr} (${mansion.element})${h.isIjabahHour ? ' + Heure d’Exaucement (Sā‘ah al-Ijābah)' : ''}.`,
          isIjabahSynchronized: !!h.isIjabahHour,
          recommendedZikr: intention.recommendedAsma,
          recommendedIncense: `${intention.recommendedIncense} ou ${mansion.incenseFr}`
        });
      }
    }
  }

  // Sort by highest harmony score and proximity
  results.sort((a, b) => b.harmonyScore - a.harmonyScore || a.date.getTime() - b.date.getTime());

  return results.slice(0, limitResults);
}

// ----------------------------------------------------
// HELPER FORMATTERS
// ----------------------------------------------------

export function formatHoursMinutes(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatDateFr(d: Date): string {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const months = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}
