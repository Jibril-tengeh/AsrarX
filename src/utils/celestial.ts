// Utility for calculating current planetary hour and lunar mansion recommendations

export interface PlanetaryHour {
  id: string;
  name: string;
  arabic: string;
  color: string;
  bg: string;
  border: string;
  desc: string;
  isDay: boolean;
  hourIndex: number;
  recommendedWird: {
    name: string;
    arabic: string;
    count: number;
    benefitFr: string;
    benefitEn: string;
    benefitHa: string;
  };
}

export interface LunarMansion {
  id: number;
  name: string;
  arabic: string;
  element: string;
  nature: string;
  descFr: string;
  descEn: string;
  descHa: string;
  propitious: string[];
}

const PLANETS = [
  { 
    id: 'sun',
    name: 'Soleil', 
    arabic: 'الشمس', 
    color: 'text-amber-500', 
    bg: 'bg-amber-100 dark:bg-amber-900/30', 
    border: 'border-amber-200 dark:border-amber-800', 
    desc: 'Succès, pouvoir, guérison, illumination',
    recommendedWird: {
      name: "Ya Hayyu Ya Qayyum",
      arabic: "يَا حَيُّ يَا قَيُّومُ",
      count: 174,
      benefitFr: "Élévation spirituelle, illumination du cœur et charisme d'attraction.",
      benefitEn: "Spiritual elevation, illumination of the heart, and magnetic charisma.",
      benefitHa: "Daukaka ta ruhaniya, hasken zuciya, da kwarjini na musamman."
    }
  },
  { 
    id: 'venus',
    name: 'Vénus', 
    arabic: 'الزهرة', 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
    border: 'border-emerald-200 dark:border-emerald-800', 
    desc: 'Amour, beauté, attraction, harmonie',
    recommendedWird: {
      name: "Ya Wadud",
      arabic: "يَا وَدُودُ",
      count: 20,
      benefitFr: "Harmonie relationnelle, affection sincère, paix et réconciliation.",
      benefitEn: "Relational harmony, sincere affection, peace, and reconciliation.",
      benefitHa: "Daidaiton dangantaka, soyayya ta gaskiya, zaman lafiya da sulhu."
    }
  },
  { 
    id: 'mercury',
    name: 'Mercure', 
    arabic: 'عطارد', 
    color: 'text-blue-400', 
    bg: 'bg-blue-100 dark:bg-blue-900/30', 
    border: 'border-blue-200 dark:border-blue-800', 
    desc: 'Communication, intelligence, commerce, rapidité',
    recommendedWird: {
      name: "Ya Alim Ya Hakim",
      arabic: "يَا عَلِيمُ يَا حَكِيمُ",
      count: 228,
      benefitFr: "Clarté mentale, réussite des examens, inspiration et ouverture des secrets.",
      benefitEn: "Mental clarity, success in studies/business, inspiration, and discovery of secrets.",
      benefitHa: "Hasken tunani, nasara a jarabawa, kwararan ra'ayoyi, da sanin asirai."
    }
  },
  { 
    id: 'moon',
    name: 'Lune', 
    arabic: 'القمر', 
    color: 'text-slate-400', 
    bg: 'bg-slate-100 dark:bg-slate-800', 
    border: 'border-slate-200 dark:border-slate-700', 
    desc: 'Rêves, intuition, émotions, magie d\'eau',
    recommendedWird: {
      name: "Ya Latif",
      arabic: "يَا لَطِيفُ",
      count: 129,
      benefitFr: "Résolution invisible des difficultés, paix du cœur, intuition et rêves prophétiques.",
      benefitEn: "Subtle resolution of difficulties, peace of mind, intuition, and prophetic dreams.",
      benefitHa: "Sauƙaƙa abubuwa cikin sauƙi, kwanciyar hankali, da mafarkai masu kyau."
    }
  },
  { 
    id: 'saturn',
    name: 'Saturne', 
    arabic: 'زحل', 
    color: 'text-zinc-600 dark:text-zinc-400', 
    bg: 'bg-zinc-100 dark:bg-zinc-800', 
    border: 'border-zinc-200 dark:border-zinc-700', 
    desc: 'Discipline, karma, protection, bannissement',
    recommendedWird: {
      name: "Ya Qahhar",
      arabic: "يَا قَهَّارُ",
      count: 306,
      benefitFr: "Bannissement des blocages, protection suprême contre les nuisances et patience.",
      benefitEn: "Banishing obstacles, supreme protection against harm, and heavy discipline.",
      benefitHa: "Karyar shingen matsaloli, kariya daga cutarwa, da samun juriya."
    }
  },
  { 
    id: 'jupiter',
    name: 'Jupiter', 
    arabic: 'المشتري', 
    color: 'text-orange-500', 
    bg: 'bg-orange-100 dark:bg-orange-900/30', 
    border: 'border-orange-200 dark:border-orange-800', 
    desc: 'Chance, richesse, expansion, justice',
    recommendedWird: {
      name: "Ya Wahhab Ya Razzaq",
      arabic: "يَا وَهَّابُ يَا رَزَّاقُ",
      count: 322,
      benefitFr: "Ouverture des portes de la subsistance, prospérité financière et chance abondante.",
      benefitEn: "Opening the gates of sustenance, financial prosperity, and abundant luck.",
      benefitHa: "Bude kofofin arziki, bunkasar kudi, da samun rabo mai yawa."
    }
  },
  { 
    id: 'mars',
    name: 'Mars', 
    arabic: 'المريخ', 
    color: 'text-red-500', 
    bg: 'bg-red-100 dark:bg-red-900/30', 
    border: 'border-red-200 dark:border-red-800', 
    desc: 'Courage, force, conflit, victoire',
    recommendedWird: {
      name: "Ya Aziz Ya Qawiyy",
      arabic: "يَا عَزِيزُ يَا قَوِيُّ",
      count: 210,
      benefitFr: "Puissance et victoire spirituelle, force morale invincible face aux épreuves.",
      benefitEn: "Spiritual victory, physical and mental strength to overcome hard trials.",
      benefitHa: "Nassara da ƙarfi na ruhaniya, juriya mai ƙarfi wajen fuskantar kalubale."
    }
  }
];

const CHALDEAN_SEQUENCE = [4, 5, 6, 0, 1, 2, 3]; // Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon
const DAY_RULERS = [0, 3, 6, 2, 5, 1, 4]; // Sun=0, Mon=3, Tue=6, Wed=2, Thu=5, Fri=1, Sat=4

const LUNAR_MANSIONS = [
  { id: 1, name: "Al-Sharatain", arabic: "الشرطين", element: "Feu", nature: "Bénéfique", descFr: "Favorable aux initiatives rapides, aux voyages et à l'acquisition de connaissances.", descEn: "Favorable for quick initiatives, travel, and gaining knowledge.", descHa: "Yana da kyau don tafiye-tafiye da neman ilimi da sauri." },
  { id: 3, name: "Al-Thurayya", arabic: "الثريا", element: "Air", nature: "Très Bénéfique", descFr: "Une des demeures les plus fastes. Idéale pour l'amour, la chance et les bénédictions spirituelles.", descEn: "One of the most auspicious mansions. Ideal for love, luck, and spiritual blessings.", descHa: "Gida mai albarka sosai. Yana da kyau don soyayya da sa'a." },
  { id: 7, name: "Al-Dhira", arabic: "الذراع", element: "Eau", nature: "Bénéfique", descFr: "Idéale pour la guérison, la croissance, l'abondance et le commerce prospère.", descEn: "Ideal for healing, growth, abundance, and prosperous business.", descHa: "Yana da kyau don waraka, bunkasa arziki da kasuwanci." },
  { id: 10, name: "Al-Jabha", arabic: "الجبهة", element: "Feu", nature: "Très Bénéfique", descFr: "Demeure royale conférant charisme, victoire éclatante, respect et célébrité.", descEn: "Royal mansion granting charisma, brilliant victory, respect, and fame.", descHa: "Gidan sarauta da ke ba da kwarjini, nasara, da girma." },
  { id: 15, name: "Al-Ghafr", arabic: "الغفر", element: "Terre", nature: "Très Bénéfique", descFr: "Excellente pour la spiritualité, l'exaucement des prières et le recueillement.", descEn: "Excellent for spirituality, answered prayers, and deep meditation.", descHa: "Yana da kyau don ayyukan ruhaniya da karɓar addu'o'i." },
  { id: 24, name: "Sa'd al-Su'ud", arabic: "سعد السعود", element: "Air", nature: "Très Bénéfique", descFr: "La chance suprême. Couronne de succès toutes les entreprises spirituelles et matérielles.", descEn: "Supreme luck. Crowns all spiritual and material undertakings with success.", descHa: "Babban rabo da albarka. Yana kawo nasara ga dukkan ayyuka." },
  { id: 28, name: "Rasha", arabic: "الرشا", element: "Eau", nature: "Bénéfique", descFr: "Énergie de plénitude, idéale pour finaliser les projets et attirer l'harmonie.", descEn: "Energy of completeness, ideal for finalizing projects and attracting harmony.", descHa: "Kammala al'amura cikin nasara da samar da kwanciyar hankali." }
];

export function getCurrentCelestialContext() {
  const now = new Date();
  const currentDay = now.getDay(); // 0-6 (Sunday-Saturday)
  
  // Calculate day of the year
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  // Calculate Lunar Mansion (simplified day-of-year approximation as used in LunarMansions.tsx)
  const mansionIndex = dayOfYear % 28;
  // Fallback map or custom mansion mapping
  const currentMansionId = (mansionIndex % 28) + 1;
  
  // Find mansion details or custom placeholder
  const activeMansion = LUNAR_MANSIONS.find(m => m.id === currentMansionId) || {
    id: currentMansionId,
    name: "Al-Manzil",
    arabic: "المنزل",
    element: mansionIndex % 2 === 0 ? "Air" : "Terre",
    nature: mansionIndex % 3 === 0 ? "Bénéfique" : mansionIndex % 3 === 1 ? "Mixte" : "Maléfique",
    descFr: "Demeure lunaire propice à l'alignement et à l'introspection.",
    descEn: "Lunar mansion propitious for alignment and introspection.",
    descHa: "Gidan wata mai kyau don natsuwa da duba zuciya."
  };

  // Planetary Hours Calculation (approximate using standard 6:00/18:00 model if geolocation is not set)
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const sr = 360; // 06:00
  const ss = 1080; // 18:00
  
  const isDay = currentMinutes >= sr && currentMinutes < ss;
  const dayLength = ss - sr;
  const nightLength = (24 * 60) - dayLength;
  
  const dayHourLength = dayLength / 12;
  const nightHourLength = nightLength / 12;
  
  const rulerPlanetIndex = DAY_RULERS[currentDay];
  const startIndexInSequence = CHALDEAN_SEQUENCE.indexOf(rulerPlanetIndex);
  
  let currentHourIndex = 0;
  let planetIndex = 0;
  let timeStart = "06:00";
  let timeEnd = "18:00";
  
  if (isDay) {
    currentHourIndex = Math.floor((currentMinutes - sr) / dayHourLength);
    planetIndex = CHALDEAN_SEQUENCE[(startIndexInSequence + currentHourIndex) % 7];
    const startMin = sr + currentHourIndex * dayHourLength;
    const endMin = sr + (currentHourIndex + 1) * dayHourLength;
    timeStart = `${String(Math.floor(startMin / 60)).padStart(2, '0')}:${String(Math.round(startMin % 60)).padStart(2, '0')}`;
    timeEnd = `${String(Math.floor(endMin / 60)).padStart(2, '0')}:${String(Math.round(endMin % 60)).padStart(2, '0')}`;
  } else {
    let minutesSinceSunset = currentMinutes >= ss ? currentMinutes - ss : currentMinutes + (24 * 60 - ss);
    currentHourIndex = Math.floor(minutesSinceSunset / nightHourLength);
    planetIndex = CHALDEAN_SEQUENCE[(startIndexInSequence + 12 + currentHourIndex) % 7];
    const startMin = ss + currentHourIndex * nightHourLength;
    const endMin = ss + (currentHourIndex + 1) * nightHourLength;
    timeStart = `${String(Math.floor((startMin % (24 * 60)) / 60)).padStart(2, '0')}:${String(Math.round(startMin % 60)).padStart(2, '0')}`;
    timeEnd = `${String(Math.floor((endMin % (24 * 60)) / 60)).padStart(2, '0')}:${String(Math.round(endMin % 60)).padStart(2, '0')}`;
  }
  
  const activePlanet = PLANETS[planetIndex] || PLANETS[0];
  
  return {
    planet: {
      id: activePlanet.id,
      name: activePlanet.name,
      arabic: activePlanet.arabic,
      color: activePlanet.color,
      bg: activePlanet.bg,
      border: activePlanet.border,
      desc: activePlanet.desc,
      hourIndex: currentHourIndex + 1,
      isDay,
      timeStart,
      timeEnd,
      recommendedWird: activePlanet.recommendedWird
    },
    mansion: {
      id: activeMansion.id,
      name: activeMansion.name,
      arabic: activeMansion.arabic,
      element: activeMansion.element,
      nature: activeMansion.nature,
      descFr: activeMansion.descFr,
      descEn: activeMansion.descEn,
      descHa: activeMansion.descHa
    }
  };
}
