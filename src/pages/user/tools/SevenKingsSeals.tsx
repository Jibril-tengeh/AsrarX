import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Crown, Sun, Moon, Flame, Shield, Download, Feather, 
  Check, Info, Eye, Sparkles, Layers, BookOpen, Globe, Volume2, Zap, Lock, Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { ParchmentExporterModal } from '../../../components/ParchmentExporterModal';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';

interface SevenKingData {
  dayId: string;
  dayFr: string;
  dayHa: string;
  dayEn: string;
  dayAr: string;
  celestialAngel: string;
  celestialAngelAr: string;
  terrestrialKing: string;
  terrestrialKingAr: string;
  planetFr: string;
  planetEn: string;
  planetHa: string;
  planetAr: string;
  planetSymbol: string;
  metalFr: string;
  metalEn: string;
  metalHa: string;
  metalAr: string;
  incenseFr: string;
  incenseEn: string;
  incenseHa: string;
  incenseAr: string;
  divineName: string;
  divineNameAr: string;
  color: string;
  strokeColor: string;
  glowColor: string;
  invocationFr: string;
  invocationEn: string;
  invocationHa: string;
  invocationAr: string;
  invocationPhonetic: string;
  frequency: string;
}

const SEVEN_KINGS_DATA: SevenKingData[] = [
  {
    dayId: "sunday",
    dayFr: "Dimanche",
    dayHa: "Lahadi",
    dayEn: "Sunday",
    dayAr: "الأحد",
    celestialAngel: "Rūqyā'īl",
    celestialAngelAr: "روقيائيل",
    terrestrialKing: "Al-Mudhib",
    terrestrialKingAr: "المذهب",
    planetFr: "Soleil",
    planetEn: "Sun",
    planetHa: "Rana",
    planetAr: "الشمس",
    planetSymbol: "☉",
    metalFr: "Or",
    metalEn: "Gold",
    metalHa: "Zinariya",
    metalAr: "ذهب",
    incenseFr: "Santal & Lban",
    incenseEn: "Sandalwood & Frankincense",
    incenseHa: "Sandal da Lban",
    incenseAr: "سندروس و لبان",
    divineName: "Yā Hayyu Yā Qayyūm",
    divineNameAr: "يا حي يا قيوم",
    color: "from-amber-500 to-yellow-600",
    strokeColor: "#f59e0b",
    glowColor: "#fbbf24",
    invocationFr: "Au nom d'Allah le Tout Miséricordieux, le Très Miséricordieux. Réponds, ô Rūqyā'īl, par le droit du Soleil et du Roi Al-Mudhib, et par le droit de 'O Vivant, O Immuable'.",
    invocationEn: "In the name of Allah, the Most Gracious, the Most Merciful. Answer, O Rūqyā'īl, by the right of the Sun and King Al-Mudhib, and by the right of 'O Ever-Living, O Self-Subsisting'.",
    invocationHa: "Da sunan Allah Mai rahama Mai jin kai. Ka amsa, ya Rūqyā'īl, saboda hakkin Rana da Sarki Al-Mudhib, da kuma hakkin 'Ya Hayyu Ya Qayyūm'.",
    invocationAr: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ، أَجِبْ يَا رُوقَيَائِيلُ بِحَقِّ الشَّمْسِ وَالْمَلِكِ الْمُذْهِبِ، وَبِحَقِّ يَا حَيُّ يَا قَيُّومُ",
    invocationPhonetic: "Bismillāhi ar-Rahmāni ar-Rahīm, ajib yā Rūqyā'īl bi-haqqi ash-Shamsi wa al-Malik Al-Mudhib, wa bi-haqqi Yā Hayyu Yā Qayyūm.",
    frequency: "528 Hz (Fréquence Solaire / Miracle)"
  },
  {
    dayId: "monday",
    dayFr: "Lundi",
    dayHa: "Litinin",
    dayEn: "Monday",
    dayAr: "الإثنين",
    celestialAngel: "Jibrā'īl",
    celestialAngelAr: "جبرائيل",
    terrestrialKing: "Murrah",
    terrestrialKingAr: "مرة",
    planetFr: "Lune",
    planetEn: "Moon",
    planetHa: "Wata",
    planetAr: "القمر",
    planetSymbol: "☽",
    metalFr: "Argent",
    metalEn: "Silver",
    metalHa: "Azurfa",
    metalAr: "فضة",
    incenseFr: "Camphre & Musc blanc",
    incenseEn: "Camphor & White Musk",
    incenseHa: "Kafur da Muske fari",
    incenseAr: "كافور و مسك أبيض",
    divineName: "Yā Rahmān Yā Rahīm",
    divineNameAr: "يا رحمن يا رحيم",
    color: "from-slate-300 to-cyan-500",
    strokeColor: "#38bdf8",
    glowColor: "#e2e8f0",
    invocationFr: "Au nom d'Allah le Tout Miséricordieux. Réponds, ô Jibrā'īl, par le droit de la Lune et du Roi Murrah, et par le droit de 'O Tout Miséricordieux, O Très Miséricordieux'.",
    invocationEn: "In the name of Allah, the Most Gracious. Answer, O Jibrā'īl, by the right of the Moon and King Murrah, and by the right of 'O Most Gracious, O Most Merciful'.",
    invocationHa: "Da sunan Allah Mai rahama. Ka amsa, ya Jibrā'īl, saboda hakkin Wata da Sarki Murrah, da kuma hakkin 'Ya Rahmān Ya Rahīm'.",
    invocationAr: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ، أَجِبْ يَا جَبْرَائِيلُ بِحَقِّ الْقَمَرِ وَالْمَلِكِ مُرَّةَ، وَبِحَقِّ يَا رَحْمَٰنُ يَا رَحِيمُ",
    invocationPhonetic: "Bismillāhi ar-Rahmāni ar-Rahīm, ajib yā Jibrā'īl bi-haqqi al-Qamari wa al-Malik Murrah, wa bi-haqqi Yā Rahmān Yā Rahīm.",
    frequency: "432 Hz (Résonance Lunique / Intuition)"
  },
  {
    dayId: "tuesday",
    dayFr: "Mardi",
    dayHa: "Talata",
    dayEn: "Tuesday",
    dayAr: "الثلاثاء",
    celestialAngel: "Samsamā'īl",
    celestialAngelAr: "سمسمائيل",
    terrestrialKing: "Al-Ahmar",
    terrestrialKingAr: "الأحمر",
    planetFr: "Mars",
    planetEn: "Mars",
    planetHa: "Marrīkh / Mars",
    planetAr: "المريخ",
    planetSymbol: "♂",
    metalFr: "Fer",
    metalEn: "Iron",
    metalHa: "Karfe",
    metalAr: "حديد",
    incenseFr: "Girofle & Mastic",
    incenseEn: "Clove & Mastic",
    incenseHa: "Kanumfari da Mastaki",
    incenseAr: "قرنفل و مصطكى",
    divineName: "Yā Qawiyyu Yā Matīn",
    divineNameAr: "يا قوي يا متين",
    color: "from-red-600 to-rose-700",
    strokeColor: "#ef4444",
    glowColor: "#f87171",
    invocationFr: "Au nom d'Allah le Tout Miséricordieux. Réponds, ô Samsamā'īl, par le droit de Mars et du Roi Al-Ahmar, et par le droit de 'O Fort, O Inébranlable'.",
    invocationEn: "In the name of Allah, the Most Gracious. Answer, O Samsamā'īl, by the right of Mars and King Al-Ahmar, and by the right of 'O All-Strong, O Firm'.",
    invocationHa: "Da sunan Allah Mai rahama. Ka amsa, ya Samsamā'īl, saboda hakkin Tauraro Mars da Sarki Al-Ahmar, da kuma hakkin 'Ya Qawiyyu Ya Matīn'.",
    invocationAr: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ، أَجِبْ يَا سَمْسَمَائِيلُ بِحَقِّ الْمِرِّيخِ وَالْمَلِكِ الأَحْمَرِ، وَبِحَقِّ يَا قَوِيُّ يَا مَتِينُ",
    invocationPhonetic: "Bismillāhi ar-Rahmāni ar-Rahīm, ajib yā Samsamā'īl bi-haqqi al-Mirrīkh wa al-Malik Al-Ahmar, wa bi-haqqi Yā Qawiyyu Yā Matīn.",
    frequency: "639 Hz (Force & Courage Martien)"
  },
  {
    dayId: "wednesday",
    dayFr: "Mercredi",
    dayHa: "Larabawa",
    dayEn: "Wednesday",
    dayAr: "الأربعاء",
    celestialAngel: "Mīkhā'īl",
    celestialAngelAr: "ميكائيل",
    terrestrialKing: "Burqān",
    terrestrialKingAr: "برقان",
    planetFr: "Mercure",
    planetEn: "Mercury",
    planetHa: "Utārid",
    planetAr: "عطارد",
    planetSymbol: "☿",
    metalFr: "Vif-argent / Mercure",
    metalEn: "Quicksilver / Mercury",
    metalHa: "Za'ibak",
    metalAr: "زئبق",
    incenseFr: "Coriandre & Anis",
    incenseEn: "Coriander & Anise",
    incenseHa: "Koriyanda da Anise",
    incenseAr: "كزبرة و أنيسون",
    divineName: "Yā 'Alīmu Yā Hakīm",
    divineNameAr: "يا عليم يا حكيم",
    color: "from-blue-500 to-cyan-600",
    strokeColor: "#06b6d4",
    glowColor: "#67e8f9",
    invocationFr: "Au nom d'Allah le Tout Miséricordieux. Réponds, ô Mīkhā'īl, par le droit de Mercure et du Roi Burqān, et par le droit de 'O Omniscient, O Sage'.",
    invocationEn: "In the name of Allah, the Most Gracious. Answer, O Mīkhā'īl, by the right of Mercury and King Burqān, and by the right of 'O All-Knowing, O All-Wise'.",
    invocationHa: "Da sunan Allah Mai rahama. Ka amsa, ya Mīkhā'īl, saboda hakkin Tauraro Utārid da Sarki Burqān, da kuma hakkin 'Ya 'Alīmu Ya Hakīm'.",
    invocationAr: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ، أَجِبْ يَا مِيكَائِيلُ بِحَقِّ عُطَارِدَ وَالْمَلِكِ بَرْقَانَ، وَبِحَقِّ يَا عَلِيمُ يَا حَكِيمُ",
    invocationPhonetic: "Bismillāhi ar-Rahmāni ar-Rahīm, ajib yā Mīkhā'īl bi-haqqi 'Utārid wa al-Malik Burqān, wa bi-haqqi Yā 'Alīmu Yā Hakīm.",
    frequency: "741 Hz (Sagesse & Éloquence Mercurienne)"
  },
  {
    dayId: "thursday",
    dayFr: "Jeudi",
    dayHa: "Alhamis",
    dayEn: "Thursday",
    dayAr: "الخميس",
    celestialAngel: "Sarfīyā'īl",
    celestialAngelAr: "صرفيائيل",
    terrestrialKing: "Shamhurish",
    terrestrialKingAr: "شمهورش",
    planetFr: "Jupiter",
    planetEn: "Jupiter",
    planetHa: "Mushtari",
    planetAr: "المشتري",
    planetSymbol: "♃",
    metalFr: "Étain",
    metalEn: "Tin",
    metalHa: "Kasdir",
    metalAr: "قصدير",
    incenseFr: "Ambre & Oudh pur",
    incenseEn: "Amber & Pure Oud",
    incenseHa: "Ambar da Oudh",
    incenseAr: "عنبر و عود",
    divineName: "Yā Kabīru Yā Mut'āl",
    divineNameAr: "يا كبير يا متعال",
    color: "from-purple-600 to-indigo-700",
    strokeColor: "#a855f7",
    glowColor: "#c084fc",
    invocationFr: "Au nom d'Allah le Tout Miséricordieux. Réponds, ô Sarfīyā'īl, par le droit de Jupiter et du Roi Shamhurish, et par le droit de 'O Grand, O Le Sublime'.",
    invocationEn: "In the name of Allah, the Most Gracious. Answer, O Sarfīyā'īl, by the right of Jupiter and King Shamhurish, and by the right of 'O Most Great, O Exalted'.",
    invocationHa: "Da sunan Allah Mai rahama. Ka amsa, ya Sarfīyā'īl, saboda hakkin Tauraro Mushtari da Sarki Shamhurish, da kuma hakkin 'Ya Kabīru Ya Mut'āl'.",
    invocationAr: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ، أَجِبْ يَا صَرْفِيَائِيلُ بِحَقِّ الْمُشْتَرِي وَالْمَلِكِ شَمْهُورَشَ، وَبِحَقِّ يَا كَبِيرُ يَا مُتَعَالُ",
    invocationPhonetic: "Bismillāhi ar-Rahmāni ar-Rahīm, ajib yā Sarfīyā'īl bi-haqqi al-Mushtarī wa al-Malik Shamhurish, wa bi-haqqi Yā Kabīru Yā Mut'āl.",
    frequency: "852 Hz (Expansion & Prospérité Jupitérienne)"
  },
  {
    dayId: "friday",
    dayFr: "Vendredi",
    dayHa: "Juma'a",
    dayEn: "Friday",
    dayAr: "الجمعة",
    celestialAngel: "'Anyā'īl",
    celestialAngelAr: "عنيائيل",
    terrestrialKing: "Zawba'ah",
    terrestrialKingAr: "زوبعة",
    planetFr: "Vénus",
    planetEn: "Venus",
    planetHa: "Zuhrah",
    planetAr: "الزهرة",
    planetSymbol: "♀",
    metalFr: "Cuivre",
    metalEn: "Copper",
    metalHa: "Tagulla",
    metalAr: "نحاس",
    incenseFr: "Safran & Rose blanche",
    incenseEn: "Saffron & White Rose",
    incenseHa: "Zafaran da Furen Rose",
    incenseAr: "زعفران و ورد",
    divineName: "Yā Wadūdu Yā Latīf",
    divineNameAr: "يا ودود يا لطيف",
    color: "from-emerald-500 to-teal-600",
    strokeColor: "#10b981",
    glowColor: "#34d399",
    invocationFr: "Au nom d'Allah le Tout Miséricordieux. Réponds, ô 'Anyā'īl, par le droit de Vénus et du Roi Zawba'ah, et par le droit de 'O Aimant, O Le Bienveillant'.",
    invocationEn: "In the name of Allah, the Most Gracious. Answer, O 'Anyā'īl, by the right of Venus and King Zawba'ah, and by the right of 'O Loving One, O Subtly Kind'.",
    invocationHa: "Da sunan Allah Mai rahama. Ka amsa, ya 'Anyā'īl, saboda hakkin Tauraro Zuhrah da Sarki Zawba'ah, da kuma hakkin 'Ya Wadūdu Ya Latīf'.",
    invocationAr: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ، أَجِبْ يَا عَنِيَائِيلُ بِحَقِّ الزُّهَرَةِ وَالْمَلِكِ زَوْبَعَةَ، وَبِحَقِّ يَا وَدُودُ يَا لَطِيفُ",
    invocationPhonetic: "Bismillāhi ar-Rahmāni ar-Rahīm, ajib yā 'Anyā'īl bi-haqqi az-Zuharah wa al-Malik Zawba'ah, wa bi-haqqi Yā Wadūdu Yā Latīf.",
    frequency: "639 Hz (Harmonie & Amour Vénusien)"
  },
  {
    dayId: "saturday",
    dayFr: "Samedi",
    dayHa: "Asabar",
    dayEn: "Saturday",
    dayAr: "السبت",
    celestialAngel: "Kasfīyā'īl",
    celestialAngelAr: "كسفيائيل",
    terrestrialKing: "Maymūn",
    terrestrialKingAr: "ميمون",
    planetFr: "Saturne",
    planetEn: "Saturn",
    planetHa: "Zuhal",
    planetAr: "زحل",
    planetSymbol: "♄",
    metalFr: "Plomb",
    metalEn: "Lead",
    metalHa: "Dalma",
    metalAr: "رصاص",
    incenseFr: "Myrrhe noire & Asafoetida",
    incenseEn: "Black Myrrh & Asafoetida",
    incenseHa: "Murru da Haltit",
    incenseAr: "مر و حلتيت",
    divineName: "Yā Fattāhu Yā Razzāq",
    divineNameAr: "يا فتاح يا رزاق",
    color: "from-zinc-700 to-neutral-900",
    strokeColor: "#a3a3a3",
    glowColor: "#e4e4e7",
    invocationFr: "Au nom d'Allah le Tout Miséricordieux. Réponds, ô Kasfīyā'īl, par le droit de Saturne et du Roi Maymūn, et par le droit de 'O Le Grand Ouvreur, O Le Pourvoyeur'.",
    invocationEn: "In the name of Allah, the Most Gracious. Answer, O Kasfīyā'īl, by the right of Saturn and King Maymūn, and by the right of 'O All-Opener, O All-Provider'.",
    invocationHa: "Da sunan Allah Mai rahama. Ka amsa, ya Kasfīyā'īl, saboda hakkin Tauraro Zuhal da Sarki Maymūn, da kuma hakkin 'Ya Fattāhu Ya Razzāq'.",
    invocationAr: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ، أَجِبْ يَا كَسْفِيَائِيلُ بِحَقِّ زُحَلَ وَالْمَلِكِ مَيْمُونَ، وَبِحَقِّ يَا فَتَّاحُ يَا رَزَّاقُ",
    invocationPhonetic: "Bismillāhi ar-Rahmāni ar-Rahīm, ajib yā Kasfīyā'īl bi-haqqi Zuhal wa al-Malik Maymūn, wa bi-haqqi Yā Fattāhu Yā Razzāq.",
    frequency: "396 Hz (Ancrage & Dénouement Saturnien)"
  }
];

// Algorithms for generating 3x3 to 10x10 Magic Squares
function generateOddSquare(n: number): number[][] {
  const square = Array(n).fill(null).map(() => Array(n).fill(-1));
  let r = 0;
  let c = Math.floor(n / 2);
  for (let i = 0; i < n * n; i++) {
    square[r][c] = i;
    let nextR = r - 1;
    let nextC = c + 1;
    if (nextR < 0) nextR = n - 1;
    if (nextC >= n) nextC = 0;
    if (square[nextR][nextC] !== -1) {
      r = r + 1;
      if (r >= n) r = 0;
    } else {
      r = nextR;
      c = nextC;
    }
  }
  return square;
}

function generateDoublyEvenSquare(n: number): number[][] {
  const square = Array(n).fill(0).map(() => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      square[r][c] = r * n + c;
    }
  }
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const subR = r % 4;
      const subC = c % 4;
      if (subR === subC || subR + subC === 3) {
        square[r][c] = (n * n - 1) - square[r][c];
      }
    }
  }
  return square;
}

function generateSinglyEvenSquare(n: number): number[][] {
  const m = n / 2;
  const k = Math.floor((n - 2) / 4);
  const sub = generateOddSquare(m);
  const square = Array(n).fill(0).map(() => Array(n).fill(0));
  const halfSq = m * m;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < m; c++) {
      const val = sub[r][c];
      square[r][c] = val;
      square[r + m][c + m] = val + halfSq;
      square[r][c + m] = val + 2 * halfSq;
      square[r + m][c] = val + 3 * halfSq;
    }
  }
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < m; c++) {
      let shouldSwap = false;
      if (c < k) {
        if (r !== Math.floor(m / 2)) shouldSwap = true;
      } else if (c === k && r === Math.floor(m / 2)) {
        shouldSwap = true;
      }
      if (shouldSwap) {
        const temp = square[r][c];
        square[r][c] = square[r + m][c];
        square[r + m][c] = temp;
      }
    }
  }
  for (let r = 0; r < m; r++) {
    for (let c = n - k + 1; c < n; c++) {
      const temp = square[r][c];
      square[r][c] = square[r + m][c];
      square[r + m][c] = temp;
    }
  }
  return square;
}

function generateBaseMagicSquare(n: number): number[][] {
  if (n % 2 !== 0) return generateOddSquare(n);
  if (n % 4 === 0) return generateDoublyEvenSquare(n);
  return generateSinglyEvenSquare(n);
}

const toEasternArabicNumerals = (num: number): string => {
  const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, (w) => digits[parseInt(w, 10)]);
};

const numberToAbjadLetter = (num: number): string => {
  const letterMap: { [val: number]: string } = {
    1: 'ا', 2: 'ب', 3: 'ج', 4: 'د', 5: 'ه', 6: 'و', 7: 'ز', 8: 'ح', 9: 'ط', 10: 'ي',
    11: 'يا', 12: 'يب', 13: 'يج', 14: 'يد', 15: 'يه', 16: 'يو', 17: 'يز', 18: 'يح', 19: 'يط', 20: 'ك',
    30: 'ل', 40: 'م', 50: 'ن', 60: 'س', 70: 'ع', 80: 'ف', 90: 'ص', 100: 'ق'
  };
  if (letterMap[num]) return letterMap[num];
  return toEasternArabicNumerals(num);
};

function generateWafqForDay(dayId: string, size: number): number[][] {
  const baseSq = generateBaseMagicSquare(size);
  const dayIndex = SEVEN_KINGS_DATA.findIndex(d => d.dayId === dayId);
  const dayOffset = (dayIndex >= 0 ? dayIndex : 0) * 3 + 1;
  return baseSq.map(row => row.map(v => v + dayOffset));
}

export const SevenKingsSeals: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedDay, setSelectedDay] = useState<SevenKingData>(SEVEN_KINGS_DATA[0]);
  const [wafqSize, setWafqSize] = useState<number>(3); // 3x3 up to 10x10
  const [displayMode, setDisplayMode] = useState<'western' | 'eastern' | 'letters'>('eastern');
  const [invocationViewMode, setInvocationViewMode] = useState<'ar' | 'phonetic' | 'both'>('both');
  const [activeSealSegment, setActiveSealSegment] = useState<string | null>(null);
  const [showParchment, setShowParchment] = useState(false);
  const sealRef = useRef<HTMLDivElement>(null);

  const currentWafqGrid = generateWafqForDay(selectedDay.dayId, wafqSize);

  const getDayName = (day: SevenKingData) => {
    if ((language as string) === 'ha') return day.dayHa;
    if ((language as string) === 'en') return day.dayEn;
    if ((language as string) === 'ar') return day.dayAr;
    return day.dayFr;
  };

  const getPlanetName = (day: SevenKingData) => {
    if ((language as string) === 'ha') return day.planetHa;
    if ((language as string) === 'en') return day.planetEn;
    if ((language as string) === 'ar') return day.planetAr;
    return day.planetFr;
  };

  const getMetalName = (day: SevenKingData) => {
    if ((language as string) === 'ha') return day.metalHa;
    if ((language as string) === 'en') return day.metalEn;
    if ((language as string) === 'ar') return day.metalAr;
    return day.metalFr;
  };

  const getIncenseName = (day: SevenKingData) => {
    if ((language as string) === 'ha') return day.incenseHa;
    if ((language as string) === 'en') return day.incenseEn;
    if ((language as string) === 'ar') return day.incenseAr;
    return day.incenseFr;
  };

  const getInvocationMeaning = (day: SevenKingData) => {
    if ((language as string) === 'ha') return day.invocationHa;
    if ((language as string) === 'en') return day.invocationEn;
    if ((language as string) === 'ar') return day.invocationAr;
    return day.invocationFr;
  };

  const formatCellValue = (val: number): string => {
    if (displayMode === 'western') return String(val);
    if (displayMode === 'letters') return numberToAbjadLetter(val);
    return toEasternArabicNumerals(val);
  };

  // Generate PNG Canvas for seal download
  const handleDownloadSeal = async () => {
    if (!sealRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark Velvet Background
    const bgGrad = ctx.createRadialGradient(500, 500, 50, 500, 500, 500);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.7, '#070a12');
    bgGrad.addColorStop(1, '#020408');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1000, 1000);

    // Golden Outer Border
    ctx.strokeStyle = selectedDay.strokeColor;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(500, 500, 460, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 3;
    ctx.strokeStyle = selectedDay.glowColor;
    ctx.beginPath();
    ctx.arc(500, 500, 440, 0, Math.PI * 2);
    ctx.stroke();

    // Inscribed Divine Text Outer Ring
    ctx.fillStyle = selectedDay.glowColor;
    ctx.font = 'bold 26px "Amiri", "Traditional Arabic", serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${selectedDay.celestialAngelAr} — ${selectedDay.terrestrialKingAr} — ${selectedDay.divineNameAr}`, 500, 100);

    // 8-Pointed Star
    ctx.strokeStyle = `${selectedDay.strokeColor}66`;
    ctx.lineWidth = 3;
    for (let i = 0; i < 2; i++) {
      ctx.save();
      ctx.translate(500, 500);
      ctx.rotate((i * Math.PI) / 4);
      ctx.strokeRect(-220, -220, 440, 440);
      ctx.restore();
    }

    // Angel & King Calligraphy
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px "Amiri", serif';
    ctx.fillText(`الملك السماوي: ${selectedDay.celestialAngelAr} (${selectedDay.planetSymbol})`, 500, 310);

    ctx.fillStyle = selectedDay.glowColor;
    ctx.font = 'bold 34px "Amiri", serif';
    ctx.fillText(`الملك الأرضي: ${selectedDay.terrestrialKingAr}`, 500, 370);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 30px "Amiri", serif';
    ctx.fillText(selectedDay.divineNameAr, 500, 430);

    // Wafq Box (3x3 to 10x10)
    const gridSize = wafqSize;
    const boxSize = 280;
    const startX = 500 - boxSize / 2;
    const startY = 480;
    const cellSize = boxSize / gridSize;

    ctx.strokeStyle = selectedDay.strokeColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(startX, startY, boxSize, boxSize);

    const fontSize = Math.max(12, Math.floor(28 - gridSize * 1.5));
    ctx.font = `bold ${fontSize}px sans-serif`;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        ctx.strokeRect(startX + c * cellSize, startY + r * cellSize, cellSize, cellSize);
        ctx.fillStyle = selectedDay.glowColor;
        const cellText = formatCellValue(currentWafqGrid[r][c]);
        ctx.fillText(
          cellText,
          startX + c * cellSize + cellSize / 2,
          startY + r * cellSize + cellSize / 2 + fontSize / 3
        );
      }
    }

    // Bottom Metadata
    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px sans-serif';
    ctx.fillText(`الربط الكوكبي: ${selectedDay.planetAr} (${selectedDay.planetSymbol}) | المعدن: ${selectedDay.metalAr} | Wafq ${wafqSize}x${wafqSize}`, 500, 830);
    ctx.fillText(`البخور: ${selectedDay.incenseAr}`, 500, 870);

    ctx.fillStyle = selectedDay.glowColor;
    ctx.font = 'italic 18px serif';
    ctx.fillText(`"AsrarHub — Sceau Théurgique Authentique du ${getDayName(selectedDay)}"`, 500, 930);

    await downloadCanvasImage(canvas, `sceau_7_rois_${selectedDay.dayId}_${wafqSize}x${wafqSize}.png`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 safe-area-pt max-h-[85vh] overflow-hidden flex flex-col">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm shrink-0 mb-4">
        <div className="flex items-center gap-3">
          <Link 
            to="/tools" 
            className="p-2.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-700 dark:text-gray-200 transition-all shadow-xs"
            title={t('back', 'Retour')}
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <span>{t('seven-kings.title', 'Sceaux des 7 Rois Célestes')}</span>
              <Crown className="w-6 h-6 text-amber-500 animate-pulse" />
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {t('seven-kings.subtitle', 'Correspondances Théurgiques quotidiennes des 7 Anges & Rois (خواتم الملوك السبعة)')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ToolInfoTooltip toolId="seven-kings" />
          <button
            onClick={() => setShowParchment(true)}
            className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Feather size={16} />
            <span>{t('seven-kings.generateParchment', 'Format Parchemin Sacré')}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-0.5">

      {/* Days Selector Tabs (Dimanche à Samedi) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {SEVEN_KINGS_DATA.map((k) => (
          <button
            key={k.dayId}
            onClick={() => {
              setSelectedDay(k);
              setActiveSealSegment(null);
            }}
            className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
              selectedDay.dayId === k.dayId
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-[1.02] font-black'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="flex items-center gap-1 text-sm font-extrabold">
              <span>{k.planetSymbol}</span>
              <span>{getDayName(k)}</span>
            </span>
            <span className="font-serif text-xs opacity-90">({k.dayAr})</span>
          </button>
        ))}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Day Correspondences & Invocation (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Planetary & Theological Card */}
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-amber-500">{selectedDay.planetSymbol}</span>
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
                    {selectedDay.celestialAngel} ({selectedDay.celestialAngelAr})
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('seven-kings.celestialAngelGovernor', 'Ange Céleste Gouverneur du {day}').replace('{day}', getDayName(selectedDay))}
                  </p>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black border border-amber-500/20">
                {selectedDay.frequency}
              </span>
            </div>

            {/* Quick Metadata Matrix */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-200/80 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 block mb-0.5 text-[11px]">
                  {t('seven-kings.terrestrialKing', 'Roi Terrestre (الملك الأرضي)')}
                </span>
                <span className="font-extrabold text-gray-900 dark:text-white text-sm font-serif">
                  {selectedDay.terrestrialKing} ({selectedDay.terrestrialKingAr})
                </span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-200/80 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 block mb-0.5 text-[11px]">
                  {t('seven-kings.rulingPlanet', 'Planète Gouvernante (الكوكب)')}
                </span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">
                  {getPlanetName(selectedDay)} ({selectedDay.planetAr})
                </span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-200/80 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 block mb-0.5 text-[11px]">
                  {t('seven-kings.sacredMetal', 'Métal Sacré (المعدن)')}
                </span>
                <span className="font-extrabold text-gray-900 dark:text-white text-sm">
                  {getMetalName(selectedDay)} ({selectedDay.metalAr})
                </span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-200/80 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 block mb-0.5 text-[11px]">
                  {t('seven-kings.ritualIncense', 'Encens Rituel (البخور)')}
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                  {getIncenseName(selectedDay)}
                </span>
              </div>
            </div>

            {/* Key Divine Name */}
            <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-amber-700 dark:text-amber-400 block mb-0.5">
                  {t('seven-kings.keyDivineName', 'Nom Divin Clé (الاسم الإلهي)')}
                </span>
                <p className="text-lg font-extrabold text-amber-950 dark:text-amber-300 font-serif">
                  {selectedDay.divineName}
                </p>
              </div>
              <span className="text-2xl font-serif font-black text-amber-500">
                {selectedDay.divineNameAr}
              </span>
            </div>
          </div>

          {/* Invocation Ritual Formula */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
                <h3 className="text-sm font-extrabold text-amber-400 tracking-wider uppercase font-mono">
                  ✦ {t('seven-kings.invocationHeader', "Formule d'Invocation Rituelle")} ✦
                </h3>
              </div>

              {/* View mode buttons */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setInvocationViewMode('ar')}
                  className={`px-2.5 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                    invocationViewMode === 'ar'
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🇸🇦 {t('seven-kings.arabic', 'Arabe')}
                </button>
                <button
                  type="button"
                  onClick={() => setInvocationViewMode('phonetic')}
                  className={`px-2.5 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                    invocationViewMode === 'phonetic'
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🗣️ {t('seven-kings.phonetic', 'Phonétique')}
                </button>
                <button
                  type="button"
                  onClick={() => setInvocationViewMode('both')}
                  className={`px-2.5 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                    invocationViewMode === 'both'
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  ✨ {t('seven-kings.both', 'Les Deux')}
                </button>
              </div>
            </div>

            {/* Render Invocation according to view mode */}
            <div className="space-y-4 pt-1">
              {/* Arabic Original Script */}
              {(invocationViewMode === 'ar' || invocationViewMode === 'both') && (
                <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-2xl space-y-2 text-right">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block text-left">
                    {t('seven-kings.arabicScriptHeader', 'النص العربي الأصلي (مع التشكيل)')}
                  </span>
                  <p 
                    dir="rtl" 
                    className="text-xl sm:text-2xl font-serif text-amber-200 leading-relaxed font-semibold tracking-wide"
                  >
                    "{selectedDay.invocationAr}"
                  </p>
                </div>
              )}

              {/* Phonetic Transliteration */}
              {(invocationViewMode === 'phonetic' || invocationViewMode === 'both') && (
                <div className="p-4 bg-gray-900/80 border border-gray-800 rounded-2xl space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
                    {t('seven-kings.phoneticHeader', 'Translitération Phonétique Exacte')}
                  </span>
                  <p className="text-sm sm:text-base font-serif italic text-gray-200 leading-relaxed">
                    "{selectedDay.invocationPhonetic}"
                  </p>
                </div>
              )}

              {/* Localized Translation */}
              <div className="p-3 bg-gray-950/60 rounded-xl text-xs text-gray-400 border border-gray-800/80 flex items-start gap-2">
                <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-gray-300">{t('seven-kings.invocationMeaning', "Sens de l'Invocation :")} </strong>
                  {getInvocationMeaning(selectedDay)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentic Interactive SVG Seal Component (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Dimension & Display Settings Controls */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                <Grid size={16} className="text-amber-500" />
                <span>{t('seven-kings.wafqOrder', 'Ordre du Carré Wafq :')}</span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                {t('seven-kings.wafqCells', '{size}x{size} ({cells} cases)').replace(/{size}/g, String(wafqSize)).replace('{cells}', String(wafqSize * wafqSize))}
              </span>
            </div>

            {/* Wafq Dimension Buttons (3x3 to 10x10) */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {[3, 4, 5, 6, 7, 8, 9, 10].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setWafqSize(sz)}
                  className={`py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                    wafqSize === sz
                      ? 'bg-amber-500 text-black border-amber-400 font-black shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-amber-500'
                  }`}
                >
                  {sz}x{sz}
                </button>
              ))}
            </div>

            {/* Display Mode Tabs */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 text-xs">
              <span className="text-gray-500 dark:text-gray-400 font-medium">{t('seven-kings.numberDisplay', 'Affichage des chiffres :')}</span>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDisplayMode('eastern')}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                    displayMode === 'eastern'
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'text-gray-500 dark:text-gray-400 hover:text-amber-500'
                  }`}
                >
                  ١٢٣
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode('western')}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                    displayMode === 'western'
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'text-gray-500 dark:text-gray-400 hover:text-amber-500'
                  }`}
                >
                  123
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode('letters')}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                    displayMode === 'letters'
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'text-gray-500 dark:text-gray-400 hover:text-amber-500'
                  }`}
                >
                  أبج
                </button>
              </div>
            </div>
          </div>

          {/* Interactive SVG Seal Display */}
          <div
            ref={sealRef}
            className="bg-gradient-to-b from-gray-950 via-slate-950 to-black p-5 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group min-h-[420px]"
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="text-center mb-2 z-10">
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                ✦ Khatim Al-Mulūk As-Sab'ah ✦
              </span>
              <h3 className="text-lg font-bold text-white font-serif mt-0.5 flex items-center justify-center gap-1.5">
                <span>{t('seven-kings.sealHeader', 'Sceau Théurgique du {day}').replace('{day}', getDayName(selectedDay))}</span>
                <span className="text-amber-400">({selectedDay.planetSymbol})</span>
              </h3>
              <p className="text-[11px] text-gray-400">
                {t('seven-kings.sealSub', 'Sceau du {angel} & Wafq {size}x{size}').replace('{angel}', selectedDay.celestialAngel).replace(/{size}/g, String(wafqSize))}
              </p>
            </div>

            {/* SVG Interactive Celestial Seal */}
            <div className="relative w-full max-w-[320px] aspect-square my-2 z-10 flex items-center justify-center">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full drop-shadow-[0_0_20px_rgba(245,158,11,0.25)] select-none"
              >
                <defs>
                  <radialGradient id={`sealBg-${selectedDay.dayId}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e1b2e" />
                    <stop offset="70%" stopColor="#0b0f19" />
                    <stop offset="100%" stopColor="#030509" />
                  </radialGradient>
                </defs>

                {/* Base Circle */}
                <circle cx="200" cy="200" r="190" fill={`url(#sealBg-${selectedDay.dayId})`} stroke={selectedDay.strokeColor} strokeWidth="4" />

                {/* Outer Ring Hotline - Hotspot 1 */}
                <g 
                  onClick={() => setActiveSealSegment('outer-ring')}
                  className="cursor-pointer transition-all hover:opacity-100"
                >
                  <circle 
                    cx="200" 
                    cy="200" 
                    r="178" 
                    fill="none" 
                    stroke={activeSealSegment === 'outer-ring' ? selectedDay.glowColor : selectedDay.strokeColor} 
                    strokeWidth={activeSealSegment === 'outer-ring' ? '5' : '2'}
                    strokeDasharray="6 4"
                    className="animate-spin-slow origin-center"
                  />
                  <circle 
                    cx="200" 
                    cy="200" 
                    r="165" 
                    fill="none" 
                    stroke={selectedDay.glowColor} 
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  
                  {/* Outer Inscribed Dynamic Day Names */}
                  <text x="200" y="38" fill={selectedDay.glowColor} fontSize="12" fontFamily="Amiri, serif" textAnchor="middle" fontWeight="bold">
                    {selectedDay.celestialAngelAr} — {selectedDay.terrestrialKingAr} — {selectedDay.divineNameAr}
                  </text>
                  <text x="200" y="375" fill={selectedDay.glowColor} fontSize="12" fontFamily="Amiri, serif" textAnchor="middle" fontWeight="bold">
                    جبرائيل — ميكائيل — إسرائيل — عزرائيل
                  </text>
                </g>

                {/* 8-Pointed Star Polygon (Octagram) - Hotspot 2 */}
                <g 
                  onClick={() => setActiveSealSegment('octagram')}
                  className="cursor-pointer group-hover:scale-105 transition-transform origin-center"
                >
                  <polygon 
                    points="200,60 340,200 200,340 60,200" 
                    fill="none" 
                    stroke={activeSealSegment === 'octagram' ? '#34d399' : selectedDay.strokeColor} 
                    strokeWidth="2.5" 
                    opacity="0.85" 
                  />
                  <polygon 
                    points="299,101 299,299 101,299 101,101" 
                    fill="none" 
                    stroke={activeSealSegment === 'octagram' ? '#34d399' : selectedDay.strokeColor} 
                    strokeWidth="2.5" 
                    opacity="0.85" 
                  />
                </g>

                {/* 7 Solomon Talismanic Hieroglyphs - Hotspot 3 */}
                <g 
                  onClick={() => setActiveSealSegment('solomon-keys')}
                  className="cursor-pointer"
                >
                  <text x="130" y="100" fill={selectedDay.glowColor} fontSize="16" textAnchor="middle">⭐</text>
                  <text x="200" y="88" fill={selectedDay.glowColor} fontSize="16" textAnchor="middle">{selectedDay.planetSymbol}</text>
                  <text x="270" y="100" fill={selectedDay.glowColor} fontSize="16" textAnchor="middle">ا</text>
                  <text x="305" y="205" fill={selectedDay.glowColor} fontSize="16" textAnchor="middle">م</text>
                  <text x="270" y="310" fill={selectedDay.glowColor} fontSize="16" textAnchor="middle">🪜</text>
                  <text x="130" y="310" fill={selectedDay.glowColor} fontSize="16" textAnchor="middle">🌙</text>
                  <text x="95" y="205" fill={selectedDay.glowColor} fontSize="16" textAnchor="middle">۝</text>
                </g>

                {/* Central Dynamic Wafq Magic Square (3x3 to 10x10 Grid) - Hotspot 4 */}
                <g 
                  onClick={() => setActiveSealSegment('wafq-center')}
                  className="cursor-pointer"
                >
                  <rect 
                    x="130" 
                    y="130" 
                    width="140" 
                    height="140" 
                    fill="#0f172a" 
                    stroke={activeSealSegment === 'wafq-center' ? '#60a5fa' : selectedDay.glowColor} 
                    strokeWidth="3" 
                    rx="10"
                  />
                  
                  {/* Grid Lines Generation */}
                  {Array.from({ length: wafqSize - 1 }).map((_, idx) => {
                    const step = 140 / wafqSize;
                    const pos = 130 + (idx + 1) * step;
                    return (
                      <React.Fragment key={`gridline-${idx}`}>
                        <line x1={pos} y1="130" x2={pos} y2="270" stroke={selectedDay.strokeColor} strokeWidth="1.2" opacity="0.6" />
                        <line x1="130" y1={pos} x2="270" y2={pos} stroke={selectedDay.strokeColor} strokeWidth="1.2" opacity="0.6" />
                      </React.Fragment>
                    );
                  })}

                  {/* Dynamic Wafq Numbers Rendering */}
                  {currentWafqGrid.map((row, rIdx) => {
                    const step = 140 / wafqSize;
                    const fontSize = Math.max(8, Math.floor(22 - wafqSize * 1.5));
                    return row.map((val, cIdx) => (
                      <text
                        key={`wafq-${rIdx}-${cIdx}`}
                        x={130 + cIdx * step + step / 2}
                        y={130 + rIdx * step + step / 2 + fontSize / 3}
                        fill="#ffffff"
                        fontSize={fontSize}
                        fontWeight="bold"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                      >
                        {formatCellValue(val)}
                      </text>
                    ));
                  })}
                </g>
              </svg>
            </div>

            {/* Interactive Hotspot Pills Bar */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 z-10 mt-1">
              <button
                type="button"
                onClick={() => setActiveSealSegment('outer-ring')}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer border ${
                  activeSealSegment === 'outer-ring'
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-gray-900/80 text-gray-300 border-gray-800 hover:border-amber-500/50'
                }`}
              >
                {t('seven-kings.hotspots.ring', '1. Anneau Céleste')}
              </button>
              <button
                type="button"
                onClick={() => setActiveSealSegment('octagram')}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer border ${
                  activeSealSegment === 'octagram'
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-gray-900/80 text-gray-300 border-gray-800 hover:border-amber-500/50'
                }`}
              >
                {t('seven-kings.hotspots.octagram', '2. Octagramme 8P')}
              </button>
              <button
                type="button"
                onClick={() => setActiveSealSegment('solomon-keys')}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer border ${
                  activeSealSegment === 'solomon-keys'
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-gray-900/80 text-gray-300 border-gray-800 hover:border-amber-500/50'
                }`}
              >
                {t('seven-kings.hotspots.keys', '3. Sceaux Solomoniens')}
              </button>
              <button
                type="button"
                onClick={() => setActiveSealSegment('wafq-center')}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer border ${
                  activeSealSegment === 'wafq-center'
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-gray-900/80 text-gray-300 border-gray-800 hover:border-amber-500/50'
                }`}
              >
                {t('seven-kings.hotspots.wafq', '4. Carré Wafq {size}x{size}').replace(/{size}/g, String(wafqSize))}
              </button>
            </div>

            {/* Explanation drawer for selected segment */}
            <AnimatePresence mode="wait">
              {activeSealSegment && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="mt-3 p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-2xl text-xs text-amber-200 z-10 w-full space-y-1 text-left"
                >
                  {activeSealSegment === 'outer-ring' && (
                    <>
                      <div className="font-extrabold text-amber-400 text-sm flex items-center justify-between">
                        <span>{t('seven-kings.ringTitle', '💫 Anneau des Noms Divins & Rois Célestes')}</span>
                        <button onClick={() => setActiveSealSegment(null)} className="text-gray-400 hover:text-white">✕</button>
                      </div>
                      <p className="text-[11px] text-amber-100 leading-relaxed">
                        {t('seven-kings.ringDesc', "Inscriptions périphériques scellant le nom de l'Ange régissant le jour ({angel}) et du Roi terrestre ({king}), encadrant le talisman pour repousser les interférences négatives.").replace('{angel}', selectedDay.celestialAngel).replace('{king}', selectedDay.terrestrialKing)}
                      </p>
                    </>
                  )}

                  {activeSealSegment === 'octagram' && (
                    <>
                      <div className="font-extrabold text-amber-400 text-sm flex items-center justify-between">
                        <span>{t('seven-kings.octagramTitle', '⭐ Octagramme des 8 Directions Célestes')}</span>
                        <button onClick={() => setActiveSealSegment(null)} className="text-gray-400 hover:text-white">✕</button>
                      </div>
                      <p className="text-[11px] text-amber-100 leading-relaxed">
                        {t('seven-kings.octagramDesc', "Double carré entrelacé symbolisant l'ordre cosmique, stabilisant les flux d'énergie spirituelle émanant de la planète {planet}.").replace('{planet}', getPlanetName(selectedDay))}
                      </p>
                    </>
                  )}

                  {activeSealSegment === 'solomon-keys' && (
                    <>
                      <div className="font-extrabold text-amber-400 text-sm flex items-center justify-between">
                        <span>{t('seven-kings.solomonKeyTitle', '👑 Les 7 Symboles Solomoniens Sacrés')}</span>
                        <button onClick={() => setActiveSealSegment(null)} className="text-gray-400 hover:text-white">✕</button>
                      </div>
                      <p className="text-[11px] text-amber-100 leading-relaxed">
                        {t('seven-kings.solomonKeyDesc', 'Caractères théurgiques de la tradition attribuée au Prophète Sulayman, gravés pour activer le soutien du Roi {king}.').replace('{king}', selectedDay.terrestrialKing)}
                      </p>
                    </>
                  )}

                  {activeSealSegment === 'wafq-center' && (
                    <>
                      <div className="font-extrabold text-amber-400 text-sm flex items-center justify-between">
                        <span>{t('seven-kings.wafqCenterTitle', '📐 Carré Magique Wafq ({size}x{size})').replace(/{size}/g, String(wafqSize))}</span>
                        <button onClick={() => setActiveSealSegment(null)} className="text-gray-400 hover:text-white">✕</button>
                      </div>
                      <p className="text-[11px] text-amber-100 leading-relaxed">
                        {t('seven-kings.wafqCenterDesc', "Grille d'équilibre parfait de dimension {size}x{size} ({cells} cellules). Canalise les résonances du nom {name}.").replace(/{size}/g, String(wafqSize)).replace('{cells}', String(wafqSize * wafqSize)).replace('{name}', selectedDay.divineName)}
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Bar */}
            <div className="w-full mt-4 z-10 pt-3 border-t border-gray-800/80">
              <button
                onClick={handleDownloadSeal}
                className="w-full py-2.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 border border-gray-800 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>{t('seven-kings.downloadPNGSize', 'Télécharger Sceau {size}x{size} PNG').replace(/{size}/g, String(wafqSize))}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Educational & Protocol Section */}
      <div className="space-y-6">
        {/* Section 1: Signification & Décodage Théurgique */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2 font-serif">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span>{t('seven-kings.decodingTitle', 'Décodage Spirituel & Géométrie Sacrée du Sceau')}</span>
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('seven-kings.decodingIntro', "Le Khatim Al-Mulūk As-Sab'ah (Sceau des 7 Rois) est l'un des talismans théurgiques les plus célèbres de la tradition ésotérique orientale (issue notamment de Shams Al-Ma'ārif). Sa structure combine trois niveaux d'énergie :")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl space-y-1.5">
              <span className="font-extrabold text-amber-900 dark:text-amber-300 block text-sm">
                {t('seven-kings.solomonSymbols', '1. Les 7 Symboles Solomoniens')}
              </span>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('seven-kings.solomonDesc', "Représentés aux sommets de l'étoile, ces sept caractères sacrés scellent l'alliance entre le royaume céleste et le monde physique.")}
              </p>
            </div>

            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl space-y-1.5">
              <span className="font-extrabold text-emerald-900 dark:text-emerald-300 block text-sm">
                {t('seven-kings.harmonicWafq', '2. Le Wafq Harmonique ({size}x{size})').replace(/{size}/g, String(wafqSize))}
              </span>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('seven-kings.wafqDescDetail', "Le carré numérique de dimension {size}x{size} au centre équilibre les fréquences de la planète {planet} pour concentrer la bénédiction (Barakah).").replace(/{size}/g, String(wafqSize)).replace('{planet}', getPlanetName(selectedDay))}
              </p>
            </div>

            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 rounded-2xl space-y-1.5">
              <span className="font-extrabold text-blue-900 dark:text-blue-300 block text-sm">
                {t('seven-kings.dualKings', "3. L'Injonction des 2 Rois")}
              </span>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('seven-kings.dualKingsDescDetail', "L'association du Roi Céleste ({angel}) et du Roi Terrestre ({king}) assure l'exaucement du rituel.").replace('{angel}', selectedDay.celestialAngel).replace('{king}', selectedDay.terrestrialKing)}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Protocole Pratique & Règles de Sécurité (Adab) */}
        <div className="bg-gradient-to-br from-emerald-950/30 via-slate-900 to-gray-900 p-6 rounded-3xl border border-emerald-500/30 text-white shadow-lg space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-emerald-800/50">
            <Shield className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-emerald-400 font-serif">
                {t('seven-kings.protocolTitle', 'Protocole de Pratique Recommandé (Adab Al-Amal & Sécurité)')}
              </h3>
              <p className="text-xs text-gray-300">
                {t('seven-kings.protocolSubtitle', "Directives traditionnelles pour la contemplation et l'utilisation sereine du sceau")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-gray-900/80 rounded-2xl border border-gray-800 space-y-1">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Check size={14} /> {t('seven-kings.p1Title', '1. Purification (Taharah & Wudu)')}
              </span>
              <p className="text-gray-300 leading-relaxed">
                {t('seven-kings.p1Desc', 'Effectuez de douces ablutions rituelles, habillez-vous de vêtements propres et choisissez un endroit calme exempt de toute distraction.')}
              </p>
            </div>

            <div className="p-3.5 bg-gray-900/80 rounded-2xl border border-gray-800 space-y-1">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Check size={14} /> {t('seven-kings.p2Title', '2. Alignement & Heure Planétaire')}
              </span>
              <p className="text-gray-300 leading-relaxed">
                {t('seven-kings.p2DescDetail', "Pratiquez idéalement le jour du sceau (ex: {day} au lever du soleil) pour bénéficier de l'alignement de la planète {planet}.").replace('{day}', getDayName(selectedDay)).replace('{planet}', getPlanetName(selectedDay))}
              </p>
            </div>

            <div className="p-3.5 bg-gray-900/80 rounded-2xl border border-gray-800 space-y-1">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Check size={14} /> {t('seven-kings.p3Title', '3. Encens de Fumigation (Bakhour)')}
              </span>
              <p className="text-gray-300 leading-relaxed">
                {t('seven-kings.p3DescDetail', "Faites brûler une pincée d'encens naturel ({incense}) pour élever l'atmosphère vibratoire du lieu.").replace('{incense}', getIncenseName(selectedDay))}
              </p>
            </div>

            <div className="p-3.5 bg-gray-900/80 rounded-2xl border border-gray-800 space-y-1">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Check size={14} /> {t('seven-kings.p4Title', '4. Bouclier de Protection (Tahseen)')}
              </span>
              <p className="text-gray-300 leading-relaxed">
                {t('seven-kings.p4Desc', 'Récitez 7 fois le Verset du Trône (Ayat Al-Kursi) et les Sourates Al-Falaq et An-Nas avant toute méditation ou tracé du sceau.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Parchment Export */}
      <ParchmentExporterModal
        isOpen={showParchment}
        onClose={() => setShowParchment(false)}
        title={`${t('seven-kings.sealHeader', 'Sceau Théurgique du {day}').replace('{day}', getDayName(selectedDay))} (${wafqSize}x${wafqSize})`}
        subtitle={`Régence de l'Ange ${selectedDay.celestialAngel} (${selectedDay.celestialAngelAr}) & Roi ${selectedDay.terrestrialKing}`}
        content={
          <div className="space-y-4 text-center">
            <div className="p-4 bg-amber-100/60 rounded-2xl border border-amber-600/30">
              <p className="text-2xl font-serif text-amber-950 font-bold">{selectedDay.celestialAngelAr} ({selectedDay.planetSymbol})</p>
              <p className="text-lg font-serif text-amber-800 font-semibold">{selectedDay.terrestrialKingAr}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-sans text-amber-950 text-left bg-amber-200/50 p-3.5 rounded-xl border border-amber-600/30">
              <div>Planète : <strong>{getPlanetName(selectedDay)} ({selectedDay.planetSymbol})</strong></div>
              <div>Métal : <strong>{getMetalName(selectedDay)}</strong></div>
              <div>Encens : <strong>{getIncenseName(selectedDay)}</strong></div>
              <div>Dimensions Wafq : <strong>{wafqSize}x{wafqSize}</strong></div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-300/60 text-right space-y-1">
              <span className="text-[10px] text-amber-800 font-bold block text-left">Invocation Arabe :</span>
              <p dir="rtl" className="text-base font-serif font-bold text-amber-950">
                "{selectedDay.invocationAr}"
              </p>
            </div>
          </div>
        }
      />
      </div>
    </div>
  );
};
