import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Crown, Sun, Moon, Flame, Shield, Download, Feather, 
  Check, Info, Eye, Sparkles, Layers, BookOpen, Globe, Volume2, Zap, Lock, Grid,
  Bookmark, Trash2, Clock, CheckCircle2, Library, FolderHeart, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { db } from '../../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
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
  frequencyFr: string;
  frequencyEn: string;
  frequencyHa: string;
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
    frequencyFr: "528 Hz (Fréquence Solaire / Miracle)",
    frequencyEn: "528 Hz (Solar Frequency / Miracle)",
    frequencyHa: "528 Hz (Mita na Rana / Al'ajabi)"
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
    frequencyFr: "432 Hz (Résonance Lunique / Intuition)",
    frequencyEn: "432 Hz (Lunar Resonance / Intuition)",
    frequencyHa: "432 Hz (Amsawar Wata / Hankali)"
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
    frequencyFr: "639 Hz (Force & Courage Martien)",
    frequencyEn: "639 Hz (Martian Strength & Courage)",
    frequencyHa: "639 Hz (Karfin Mars da Jarumta)"
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
    frequencyFr: "741 Hz (Sagesse & Éloquence Mercurienne)",
    frequencyEn: "741 Hz (Mercurian Wisdom & Eloquence)",
    frequencyHa: "741 Hz (Hikimar Utarid da Jawabi)"
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
    frequencyFr: "852 Hz (Expansion & Prospérité Jupitérienne)",
    frequencyEn: "852 Hz (Juperiain Expansion & Prosperity)",
    frequencyHa: "852 Hz (Fadaɗa da Arzikin Mushtari)"
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
    frequencyFr: "639 Hz (Harmonie & Amour Vénusien)",
    frequencyEn: "639 Hz (Venusian Harmony & Love)",
    frequencyHa: "639 Hz (Daidaito da Soyayyar Zuhrah)"
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
    frequencyFr: "396 Hz (Ancrage & Dénouement Saturnien)",
    frequencyEn: "396 Hz (Saturnian Grounding & Release)",
    frequencyHa: "396 Hz (Tabbata da Maganin Zuhal)"
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

interface SealSvgGraphicProps {
  selectedDay: SevenKingData;
  wafqSize: number;
  currentWafqGrid: number[][];
  formatCellValue: (val: number) => string;
  activeSealSegment?: string | null;
  onSelectSegment?: (seg: string) => void;
  className?: string;
  isParchment?: boolean;
}

const SealSvgGraphic: React.FC<SealSvgGraphicProps> = ({
  selectedDay,
  wafqSize,
  currentWafqGrid,
  formatCellValue,
  activeSealSegment,
  onSelectSegment,
  className = "w-full h-full",
  isParchment = false,
}) => {
  const strokeColor = isParchment ? '#f59e0b' : selectedDay.strokeColor;
  const glowColor = isParchment ? '#fbbf24' : selectedDay.glowColor;
  const activeColor = isParchment ? '#fef08a' : '#34d399';

  return (
    <svg
      viewBox="0 0 400 400"
      width="100%"
      height="100%"
      className={`${className} select-none`}
    >
      <defs>
        <radialGradient id={`sealBg-${selectedDay.dayId}${isParchment ? '-p' : ''}`} cx="50%" cy="50%" r="50%">
          {isParchment ? (
            <>
              <stop offset="0%" stopColor="#2e1003" />
              <stop offset="70%" stopColor="#1c0a02" />
              <stop offset="100%" stopColor="#0d0501" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#1e1b2e" />
              <stop offset="70%" stopColor="#0b0f19" />
              <stop offset="100%" stopColor="#030509" />
            </>
          )}
        </radialGradient>
      </defs>

      {/* Base Circle */}
      <circle cx="200" cy="200" r="185" fill={`url(#sealBg-${selectedDay.dayId}${isParchment ? '-p' : ''})`} stroke={strokeColor} strokeWidth="3.5" />

      {/* Outer Ring Hotline - Hotspot 1 */}
      <g 
        onClick={() => onSelectSegment?.('outer-ring')}
        className={onSelectSegment ? "cursor-pointer transition-all hover:opacity-100" : ""}
      >
        <circle 
          cx="200" 
          cy="200" 
          r="172" 
          fill="none" 
          stroke={activeSealSegment === 'outer-ring' ? glowColor : strokeColor} 
          strokeWidth={activeSealSegment === 'outer-ring' ? '3.5' : '2'}
          strokeDasharray="6 4"
          className={onSelectSegment ? "animate-spin-slow origin-center" : ""}
        />
        <circle 
          cx="200" 
          cy="200" 
          r="152" 
          fill="none" 
          stroke={glowColor} 
          strokeWidth="1.5"
          opacity="0.6"
        />
        
        {/* Outer Inscribed Dynamic Day Names */}
        <text x="200" y="38" fill={glowColor} fontSize="11" fontFamily="Amiri, serif" textAnchor="middle" fontWeight="bold">
          {selectedDay.celestialAngelAr} — {selectedDay.terrestrialKingAr} — {selectedDay.divineNameAr}
        </text>

        {/* 4 Cardinal Archangels in 4 cardinal directions */}
        {/* Est / Droite (3h) - جبرائيل (Jibrā'īl) */}
        <text x="360" y="200" transform="rotate(90, 360, 200)" fill={glowColor} fontSize="10.5" fontFamily="Amiri, serif" textAnchor="middle" fontWeight="bold">
          جبرائيل
        </text>

        {/* Sud / Bas (6h) - ميكائيل (Mīkā'īl) */}
        <text x="200" y="360" fill={glowColor} fontSize="10.5" fontFamily="Amiri, serif" textAnchor="middle" fontWeight="bold">
          ميكائيل
        </text>

        {/* Ouest / Gauche (9h) - إسرافيل (Isrāfīl) */}
        <text x="40" y="200" transform="rotate(-90, 40, 200)" fill={glowColor} fontSize="10.5" fontFamily="Amiri, serif" textAnchor="middle" fontWeight="bold">
          إسرافيل
        </text>

        {/* Nord / Haut (12h) - عزرائيل ('Azrā'īl) */}
        <text x="200" y="52" fill={glowColor} fontSize="10.5" fontFamily="Amiri, serif" textAnchor="middle" fontWeight="bold">
          عزرائيل
        </text>
      </g>

      {/* 8-Pointed Star Polygon (Octagram) - Hotspot 2 */}
      <g 
        onClick={() => onSelectSegment?.('octagram')}
        className={onSelectSegment ? "cursor-pointer transition-transform origin-center" : ""}
      >
        <polygon 
          points="200,60 340,200 200,340 60,200" 
          fill="none" 
          stroke={activeSealSegment === 'octagram' ? activeColor : strokeColor} 
          strokeWidth="2.5" 
          opacity="0.85" 
        />
        <polygon 
          points="299,101 299,299 101,299 101,101" 
          fill="none" 
          stroke={activeSealSegment === 'octagram' ? activeColor : strokeColor} 
          strokeWidth="2.5" 
          opacity="0.85" 
        />
      </g>

      {/* 7 Solomon Talismanic Hieroglyphs - Hotspot 3 */}
      <g 
        onClick={() => onSelectSegment?.('solomon-keys')}
        className={onSelectSegment ? "cursor-pointer" : ""}
      >
        <text x="122" y="102" fill={glowColor} fontSize="15" textAnchor="middle">⭐</text>
        <text x="200" y="94" fill={glowColor} fontSize="16" textAnchor="middle">{selectedDay.planetSymbol}</text>
        <text x="278" y="102" fill={glowColor} fontSize="15" textAnchor="middle">ا</text>
        <text x="308" y="205" fill={glowColor} fontSize="16" textAnchor="middle">م</text>
        <text x="278" y="298" fill={glowColor} fontSize="15" textAnchor="middle">🪜</text>
        <text x="122" y="298" fill={glowColor} fontSize="15" textAnchor="middle">🌙</text>
        <text x="92" y="205" fill={glowColor} fontSize="16" textAnchor="middle">۝</text>
      </g>

      {/* Central Dynamic Wafq Magic Square (3x3 to 10x10 Grid) - Hotspot 4 */}
      <g 
        onClick={() => onSelectSegment?.('wafq-center')}
        className={onSelectSegment ? "cursor-pointer" : ""}
      >
        <rect 
          x="130" 
          y="130" 
          width="140" 
          height="140" 
          fill={isParchment ? "#1c0a02" : "#0f172a"} 
          stroke={activeSealSegment === 'wafq-center' ? '#60a5fa' : glowColor} 
          strokeWidth="3" 
        />
        
        {/* Grid Lines Generation */}
        {Array.from({ length: wafqSize - 1 }).map((_, idx) => {
          const step = 140 / wafqSize;
          const pos = 130 + (idx + 1) * step;
          return (
            <React.Fragment key={`gridline-${idx}`}>
              <line x1={pos} y1="130" x2={pos} y2="270" stroke={strokeColor} strokeWidth="1.2" opacity="0.6" />
              <line x1="130" y1={pos} x2="270" y2={pos} stroke={strokeColor} strokeWidth="1.2" opacity="0.6" />
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
              fill={isParchment ? "#fef3c7" : "#ffffff"}
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
  );
};

interface SavedSeal {
  id: string;
  dayId: string;
  dayFr: string;
  celestialAngel: string;
  planetSymbol: string;
  wafqSize: number;
  displayMode: 'western' | 'eastern' | 'letters';
  timestamp: number;
}

export const SevenKingsSeals: React.FC = () => {
  const { t, language } = useLanguage();
  const { isPremium } = useAuth();
  const [isToolMaintenance, setIsToolMaintenance] = useState(false);
  const [selectedDay, setSelectedDay] = useState<SevenKingData>(SEVEN_KINGS_DATA[0]);
  const [wafqSize, setWafqSize] = useState<number>(3); // 3x3 up to 10x10
  const [displayMode, setDisplayMode] = useState<'western' | 'eastern' | 'letters'>('eastern');
  const [invocationViewMode, setInvocationViewMode] = useState<'ar' | 'phonetic' | 'both'>('both');
  const [activeSealSegment, setActiveSealSegment] = useState<string | null>(null);
  const [showParchment, setShowParchment] = useState(false);
  const [showSavedLibrary, setShowSavedLibrary] = useState(false);
  const [justSavedNotification, setJustSavedNotification] = useState(false);
  const sealRef = useRef<HTMLDivElement>(null);

  // Maintenance listener from Firestore settings/features
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'features'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data?.globalMaintenanceMode || data?.['tool_seven-kings'] === 'maintenance') {
          setIsToolMaintenance(true);
        } else {
          setIsToolMaintenance(false);
        }
      }
    }, () => {});
    return () => unsub();
  }, []);

  const [savedSeals, setSavedSeals] = useState<SavedSeal[]>(() => {
    try {
      const saved = localStorage.getItem('asrar_seven_kings_seals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Auto-save generated seal into local library whenever configuration changes
  useEffect(() => {
    const sealId = `${selectedDay.dayId}_${wafqSize}_${displayMode}`;
    const now = Date.now();

    setSavedSeals((prev) => {
      const existingIndex = prev.findIndex((s) => s.id === sealId);
      let updated: SavedSeal[];

      const newEntry: SavedSeal = {
        id: sealId,
        dayId: selectedDay.dayId,
        dayFr: selectedDay.dayFr,
        celestialAngel: selectedDay.celestialAngel,
        planetSymbol: selectedDay.planetSymbol,
        wafqSize,
        displayMode,
        timestamp: now,
      };

      if (existingIndex >= 0) {
        updated = [newEntry, ...prev.filter((s) => s.id !== sealId)];
      } else {
        updated = [newEntry, ...prev].slice(0, 50); // Keep last 50 saved seals
      }

      try {
        localStorage.setItem('asrar_seven_kings_seals', JSON.stringify(updated));
      } catch (e) {
        console.error('Error auto-saving seal to localStorage:', e);
      }
      return updated;
    });

    setJustSavedNotification(true);
    const timer = setTimeout(() => {
      setJustSavedNotification(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, [selectedDay.dayId, wafqSize, displayMode]);

  const handleLoadSeal = (seal: SavedSeal) => {
    const day = SEVEN_KINGS_DATA.find((d) => d.dayId === seal.dayId);
    if (day) {
      setSelectedDay(day);
      setWafqSize(seal.wafqSize);
      setDisplayMode(seal.displayMode);
      setActiveSealSegment(null);
      setShowSavedLibrary(false);
    }
  };

  const handleDeleteSavedSeal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedSeals((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem('asrar_seven_kings_seals', JSON.stringify(updated));
      } catch (e) {
        console.error('Error deleting saved seal:', e);
      }
      return updated;
    });
  };

  const handleClearLibrary = () => {
    if (window.confirm(t('seven-kings.confirmClear', 'Voulez-vous vraiment vider tous les sceaux sauvegardés ?'))) {
      setSavedSeals([]);
      try {
        localStorage.removeItem('asrar_seven_kings_seals');
      } catch (e) {
        console.error('Error clearing saved seals:', e);
      }
    }
  };

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

  const getFrequencyName = (day: SevenKingData) => {
    if ((language as string) === 'ha') return day.frequencyHa || day.frequencyFr;
    if ((language as string) === 'en') return day.frequencyEn || day.frequencyFr;
    return day.frequencyFr;
  };

  const formatCellValue = (val: number): string => {
    if (displayMode === 'western') return String(val);
    if (displayMode === 'letters') return numberToAbjadLetter(val);
    return toEasternArabicNumerals(val);
  };

  // Generate PNG Canvas for seal download with Premium/Maintenance guard
  const handleDownloadSeal = async () => {
    if (isToolMaintenance) {
      alert(t('seven-kings.maintenanceNotice', 'Cet outil est actuellement en maintenance spirituelle.'));
      return;
    }
    if (!isPremium) {
      triggerProtectionModal('download');
      return;
    }

    if (!sealRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark Velvet Background
    const bgGrad = ctx.createRadialGradient(500, 500, 50, 500, 500, 500);
    bgGrad.addColorStop(0, '#1e1b2e');
    bgGrad.addColorStop(0.7, '#0b0f19');
    bgGrad.addColorStop(1, '#030509');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1000, 1000);

    // Top Header Banner
    // Top Title & Subtitle based on active language
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = selectedDay.glowColor;
    ctx.font = 'bold 18px monospace';
    ctx.fillText('✦ KHATIM AL-MULŪK AS-SAB\'AH ✦', 500, 38);

    const dayTranslatedName = getDayName(selectedDay);
    const planetName = getPlanetName(selectedDay);
    const metalName = getMetalName(selectedDay);
    const incenseName = getIncenseName(selectedDay);

    const headerTitleText = `${t('seven-kings.sealHeader', 'Sceau Théurgique du {day}').replace('{day}', dayTranslatedName)} (${selectedDay.planetSymbol}) — ${selectedDay.celestialAngel}`;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px serif';
    ctx.fillText(headerTitleText, 500, 70);

    // Header Divider Line
    ctx.strokeStyle = selectedDay.glowColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(350, 92);
    ctx.lineTo(650, 92);
    ctx.stroke();

    // Golden Outer Border Circle (Center = 500, 515; Radius = 370)
    ctx.strokeStyle = selectedDay.strokeColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(500, 515, 370, 0, Math.PI * 2);
    ctx.stroke();

    // Dotted Inner Ring (Radius = 345)
    ctx.lineWidth = 2;
    ctx.strokeStyle = selectedDay.strokeColor;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(500, 515, 345, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Solid Inner Decorative Ring (Radius = 318)
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = selectedDay.glowColor;
    ctx.beginPath();
    ctx.arc(500, 515, 318, 0, Math.PI * 2);
    ctx.stroke();

    // Inscribed Divine Text & 4 Cardinal Archangels Outer Ring
    ctx.fillStyle = selectedDay.glowColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Upper Divine Text (celestialAngelAr — terrestrialKingAr — divineNameAr)
    ctx.font = 'bold 22px "Amiri", "Traditional Arabic", serif';
    ctx.fillText(`${selectedDay.celestialAngelAr} — ${selectedDay.terrestrialKingAr} — ${selectedDay.divineNameAr}`, 500, 185);

    // 4 Cardinal Archangels (Nord, Sud, Est, Ouest)
    ctx.font = 'bold 21px "Amiri", "Traditional Arabic", serif';
    
    // Nord (12h) - عزرائيل ('Azrā'īl)
    ctx.fillText('عزرائيل', 500, 218);

    // Sud (6h) - ميكائيل (Mīkā'īl)
    ctx.fillText('ميكائيل', 500, 812);

    // Est (3h) - جبرائيل (Jibrā'īl)
    ctx.save();
    ctx.translate(818, 515);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('جبرائيل', 0, 0);
    ctx.restore();

    // Ouest (9h) - إسرافيل (Isrāfīl)
    ctx.save();
    ctx.translate(182, 515);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('إسرافيل', 0, 0);
    ctx.restore();

    // 8-Pointed Star Polygons (Octagram - Centered at 500, 515 with R = 260)
    ctx.strokeStyle = selectedDay.strokeColor;
    ctx.lineWidth = 2.5;

    // Diamond / Rotated Square 45°
    ctx.beginPath();
    ctx.moveTo(500, 255);
    ctx.lineTo(760, 515);
    ctx.lineTo(500, 775);
    ctx.lineTo(240, 515);
    ctx.closePath();
    ctx.stroke();

    // Straight Square
    ctx.beginPath();
    ctx.strokeRect(316, 331, 368, 368);

    // 7 Solomon Talismanic Hieroglyphs
    ctx.fillStyle = selectedDay.glowColor;
    ctx.font = 'bold 28px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText('⭐', 355, 335);
    ctx.fillText(selectedDay.planetSymbol, 500, 305);
    ctx.fillText('ا', 645, 335);
    ctx.fillText('م', 705, 515);
    ctx.fillText('🪜', 645, 695);
    ctx.fillText('🌙', 355, 695);
    ctx.fillText('۝', 295, 515);

    // Central Dynamic Wafq Magic Square (270x270)
    const gridSize = wafqSize;
    const boxSize = 270;
    const startX = 500 - boxSize / 2; // = 365
    const startY = 515 - boxSize / 2; // = 380
    const cellSize = boxSize / gridSize;

    // Wafq Dark Background Container
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(startX, startY, boxSize, boxSize);

    // Outer Wafq Border
    ctx.strokeStyle = selectedDay.glowColor;
    ctx.lineWidth = 3.5;
    ctx.strokeRect(startX, startY, boxSize, boxSize);

    // Wafq Grid Lines and Cell Values
    const fontSize = Math.max(13, Math.floor(28 - gridSize * 1.5));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = selectedDay.strokeColor;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cellX = startX + c * cellSize;
        const cellY = startY + r * cellSize;

        ctx.strokeRect(cellX, cellY, cellSize, cellSize);

        ctx.fillStyle = '#ffffff';
        const cellText = formatCellValue(currentWafqGrid[r][c]);
        ctx.fillText(
          cellText,
          cellX + cellSize / 2,
          cellY + cellSize / 2
        );
      }
    }

    // Bottom Footer Divider Line
    ctx.strokeStyle = selectedDay.glowColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(350, 905);
    ctx.lineTo(650, 905);
    ctx.stroke();

    // Bottom Metadata & Attribution based on active language
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '17px sans-serif';

    let metaLine1 = '';
    let metaLine2 = '';
    let footerAttribution = '';

    if ((language as string) === 'ar') {
      metaLine1 = `الربط الكوكبي: ${planetName} (${selectedDay.planetSymbol}) | Wafq ${wafqSize}x${wafqSize} | المعدن: ${metalName}`;
      metaLine2 = `البخور: ${incenseName}`;
      footerAttribution = `✦ أسرار هاب — خاتم ملوكي مأثور لـ ${dayTranslatedName} ✦`;
    } else if ((language as string) === 'en') {
      metaLine1 = `Planetary Alignment: ${planetName} (${selectedDay.planetSymbol}) | Wafq ${wafqSize}x${wafqSize} | Metal: ${metalName}`;
      metaLine2 = `Incense: ${incenseName}`;
      footerAttribution = `✦ AsrarHub — Authentic Theurgic Seal of ${dayTranslatedName} ✦`;
    } else if ((language as string) === 'ha') {
      metaLine1 = `Rabon Duniyoyi: ${planetName} (${selectedDay.planetSymbol}) | Wafq ${wafqSize}x${wafqSize} | Karfe: ${metalName}`;
      metaLine2 = `Turare: ${incenseName}`;
      footerAttribution = `✦ AsrarHub — Hatimin Sarakuna na ${dayTranslatedName} ✦`;
    } else {
      metaLine1 = `Alignement Planétaire : ${planetName} (${selectedDay.planetSymbol}) | Wafq ${wafqSize}x${wafqSize} | Métal : ${metalName}`;
      metaLine2 = `Encens : ${incenseName}`;
      footerAttribution = `✦ AsrarHub — Sceau Théurgique Authentique du ${dayTranslatedName} ✦`;
    }

    ctx.fillText(metaLine1, 500, 932);
    ctx.fillText(metaLine2, 500, 958);

    ctx.fillStyle = selectedDay.glowColor;
    ctx.font = 'italic 15px serif';
    ctx.fillText(footerAttribution, 500, 982);

    await downloadCanvasImage(canvas, `sceau_7_rois_${selectedDay.dayId}_${wafqSize}x${wafqSize}.png`);
  };

  // Fixed viewBox Vector SVG Exporter for exact visual consistency across platforms
  const handleDownloadSVG = () => {
    if (isToolMaintenance) {
      alert(t('seven-kings.maintenanceNotice', 'Cet outil est actuellement en maintenance spirituelle.'));
      return;
    }
    if (!isPremium) {
      triggerProtectionModal('download');
      return;
    }

    const strokeColor = selectedDay.strokeColor;
    const glowColor = selectedDay.glowColor;
    const gridSize = wafqSize;

    const dayTranslatedName = getDayName(selectedDay);
    const planetName = getPlanetName(selectedDay);
    const metalName = getMetalName(selectedDay);
    const incenseName = getIncenseName(selectedDay);

    const headerTitleText = `${t('seven-kings.sealHeader', 'Sceau Théurgique du {day}').replace('{day}', dayTranslatedName)} (${selectedDay.planetSymbol}) — ${selectedDay.celestialAngel}`;

    let svgMetaLine1 = '';
    let svgMetaLine2 = '';
    let svgFooterAttribution = '';

    if ((language as string) === 'ar') {
      svgMetaLine1 = `الربط الكوكبي: ${planetName} (${selectedDay.planetSymbol}) | Wafq ${wafqSize}x${wafqSize} | المعدن: ${metalName}`;
      svgMetaLine2 = `البخور: ${incenseName}`;
      svgFooterAttribution = `✦ أسرار هاب — خاتم ملوكي مأثور لـ ${dayTranslatedName} ✦`;
    } else if ((language as string) === 'en') {
      svgMetaLine1 = `Planetary Alignment: ${planetName} (${selectedDay.planetSymbol}) | Wafq ${wafqSize}x${wafqSize} | Metal: ${metalName}`;
      svgMetaLine2 = `Incense: ${incenseName}`;
      svgFooterAttribution = `✦ AsrarHub — Authentic Theurgic Seal of ${dayTranslatedName} ✦`;
    } else if ((language as string) === 'ha') {
      svgMetaLine1 = `Rabon Duniyoyi: ${planetName} (${selectedDay.planetSymbol}) | Wafq ${wafqSize}x${wafqSize} | Karfe: ${metalName}`;
      svgMetaLine2 = `Turare: ${incenseName}`;
      svgFooterAttribution = `✦ AsrarHub — Hatimin Sarakuna na ${dayTranslatedName} ✦`;
    } else {
      svgMetaLine1 = `Alignement Planétaire : ${planetName} (${selectedDay.planetSymbol}) | Wafq ${wafqSize}x${wafqSize} | Métal : ${metalName}`;
      svgMetaLine2 = `Encens : ${incenseName}`;
      svgFooterAttribution = `✦ AsrarHub — Sceau Théurgique Authentique du ${dayTranslatedName} ✦`;
    }

    const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <radialGradient id="sealBgSpec" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e1b2e" />
      <stop offset="70%" stop-color="#0b0f19" />
      <stop offset="100%" stop-color="#030509" />
    </radialGradient>
  </defs>

  <rect width="1000" height="1000" fill="url(#sealBgSpec)"/>
  
  <!-- Header Title -->
  <text x="500" y="38" fill="${glowColor}" font-size="18" font-family="monospace" font-weight="bold" text-anchor="middle">✦ KHATIM AL-MULŪK AS-SAB'AH ✦</text>
  <text x="500" y="70" fill="#ffffff" font-size="22" font-family="serif" font-weight="bold" text-anchor="middle">${headerTitleText}</text>
  <line x1="350" y1="92" x2="650" y2="92" stroke="${glowColor}" stroke-width="1"/>

  <!-- Outer Circles -->
  <circle cx="500" cy="515" r="370" fill="none" stroke="${strokeColor}" stroke-width="4"/>
  <circle cx="500" cy="515" r="345" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-dasharray="8 6"/>
  <circle cx="500" cy="515" r="318" fill="none" stroke="${glowColor}" stroke-width="1.5"/>

  <!-- Upper Divine Text & 4 Cardinal Archangels -->
  <text x="500" y="185" fill="${glowColor}" font-size="22" font-family="'Amiri', 'Traditional Arabic', serif" font-weight="bold" text-anchor="middle">
    ${selectedDay.celestialAngelAr} — ${selectedDay.terrestrialKingAr} — ${selectedDay.divineNameAr}
  </text>
  <text x="500" y="218" fill="${glowColor}" font-size="21" font-family="'Amiri', 'Traditional Arabic', serif" font-weight="bold" text-anchor="middle">عزرائيل</text>
  <text x="500" y="812" fill="${glowColor}" font-size="21" font-family="'Amiri', 'Traditional Arabic', serif" font-weight="bold" text-anchor="middle">ميكائيل</text>
  <text x="818" y="515" transform="rotate(90, 818, 515)" fill="${glowColor}" font-size="21" font-family="'Amiri', 'Traditional Arabic', serif" font-weight="bold" text-anchor="middle">جبرائيل</text>
  <text x="182" y="515" transform="rotate(-90, 182, 515)" fill="${glowColor}" font-size="21" font-family="'Amiri', 'Traditional Arabic', serif" font-weight="bold" text-anchor="middle">إسرافيل</text>

  <!-- Octagram Star -->
  <polygon points="500,255 760,515 500,775 240,515" fill="none" stroke="${strokeColor}" stroke-width="2.5"/>
  <rect x="316" y="331" width="368" height="368" fill="none" stroke="${strokeColor}" stroke-width="2.5"/>

  <!-- Solomon Symbols -->
  <g fill="${glowColor}" font-size="28" font-family="serif" text-anchor="middle" dominant-baseline="middle">
    <text x="355" y="335">⭐</text>
    <text x="500" y="305">${selectedDay.planetSymbol}</text>
    <text x="645" y="335">ا</text>
    <text x="705" y="515">م</text>
    <text x="645" y="695">🪜</text>
    <text x="355" y="695">🌙</text>
    <text x="295" y="515">۝</text>
  </g>

  <!-- Central Wafq Container -->
  <rect x="365" y="380" width="270" height="270" fill="#0f172a" stroke="${glowColor}" stroke-width="3.5"/>

  ${(() => {
    let elems = '';
    const startX = 365;
    const startY = 380;
    const boxSize = 270;
    const cellSize = boxSize / gridSize;
    const fontSz = Math.max(13, Math.floor(28 - gridSize * 1.5));

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cx = startX + c * cellSize;
        const cy = startY + r * cellSize;
        elems += `<rect x="${cx}" y="${cy}" width="${cellSize}" height="${cellSize}" fill="none" stroke="${strokeColor}" stroke-width="1.5"/>`;
        
        const valText = formatCellValue(currentWafqGrid[r][c]);
        const textX = cx + cellSize / 2;
        const textY = cy + cellSize / 2;
        elems += `<text x="${textX}" y="${textY}" fill="#ffffff" font-size="${fontSz}" font-family="sans-serif" font-weight="bold" text-anchor="middle" dominant-baseline="central">${valText}</text>`;
      }
    }
    return elems;
  })()}

  <!-- Footer Metadata -->
  <line x1="350" y1="905" x2="650" y2="905" stroke="${glowColor}" stroke-width="1"/>
  <text x="500" y="932" fill="#94a3b8" font-size="17" font-family="sans-serif" text-anchor="middle">${svgMetaLine1}</text>
  <text x="500" y="958" fill="#94a3b8" font-size="16" font-family="sans-serif" text-anchor="middle">${svgMetaLine2}</text>
  <text x="500" y="982" fill="${glowColor}" font-size="15" font-family="serif" font-style="italic" text-anchor="middle">${svgFooterAttribution}</text>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sceau_Vectoriel_${selectedDay.dayId}_${wafqSize}x${wafqSize}_AsrarHub.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 safe-area-pt space-y-4">
      {/* Maintenance Alert Banner if Active */}
      {isToolMaintenance && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 p-4 rounded-3xl flex items-center gap-3">
          <Zap className="w-5 h-5 text-amber-500 shrink-0 animate-pulse" />
          <div className="text-xs">
            <span className="font-extrabold block text-sm">{t('seven-kings.maintenanceTitle', 'Maintenance Spirituelle Active')}</span>
            <span>{t('seven-kings.maintenanceDesc', "L'accès aux téléchargements et au générateur de sceaux des 7 Rois est temporairement suspendu pour maintenance astromystique.")}</span>
          </div>
        </div>
      )}

      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm shrink-0">
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

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowSavedLibrary(!showSavedLibrary)}
            className={`px-3.5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
              showSavedLibrary
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-amber-500/10 hover:text-amber-600'
            }`}
          >
            <Library size={16} className="text-amber-500" />
            <span>{t('seven-kings.savedLibraryTitle', 'Bibliothèque Locale')}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 font-mono font-black">
              {savedSeals.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (isToolMaintenance) {
                alert(t('seven-kings.maintenanceNotice', 'Cet outil est actuellement en maintenance spirituelle.'));
                return;
              }
              if (!isPremium) {
                triggerProtectionModal('download');
                return;
              }
              setShowParchment(true);
            }}
            className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Feather size={16} />
            <span>{t('seven-kings.generateParchment', 'Format Parchemin Sacré')}</span>
            {!isPremium && <Lock size={12} className="text-amber-500/80" />}
          </button>
        </div>
      </div>

      {/* Expandable Saved Seals Library Panel */}
      <AnimatePresence>
        {showSavedLibrary && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-amber-500/30 shadow-lg space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Library className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
                    {t('seven-kings.savedLibraryTitle', 'Bibliothèque Locale des Sceaux')}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('seven-kings.savedLibrarySub', 'Sceaux générés automatiquement et conservés sur votre appareil')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {savedSeals.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearLibrary}
                    className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 transition-all cursor-pointer px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50"
                  >
                    <Trash2 size={13} />
                    <span>{t('seven-kings.clearLibrary', 'Vider la bibliothèque')}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowSavedLibrary(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {savedSeals.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500 dark:text-gray-400 space-y-2">
                <Bookmark className="w-8 h-8 text-amber-500/40 mx-auto animate-bounce" />
                <p>{t('seven-kings.emptyLibrary', 'Aucun sceau sauvegardé dans la bibliothèque locale pour le moment.')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
                {savedSeals.map((seal) => {
                  const isCurrentlySelected =
                    seal.dayId === selectedDay.dayId &&
                    seal.wafqSize === wafqSize &&
                    seal.displayMode === displayMode;

                  return (
                    <div
                      key={seal.id}
                      onClick={() => handleLoadSeal(seal)}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between gap-2.5 relative group ${
                        isCurrentlySelected
                          ? 'bg-amber-500/15 border-amber-500 text-amber-950 dark:text-amber-200 shadow-sm ring-1 ring-amber-500/40'
                          : 'bg-gray-50 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 hover:border-amber-400/60 hover:bg-amber-500/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-amber-500">{seal.planetSymbol}</span>
                          <div>
                            <span className="font-extrabold block text-gray-900 dark:text-white text-xs">
                              Sceau du {seal.dayFr}
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-serif">
                              {seal.celestialAngel}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteSavedSeal(seal.id, e)}
                          className="p-1 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all opacity-60 group-hover:opacity-100"
                          title={t('seven-kings.deleteSeal', 'Supprimer')}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-gray-800 text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono font-bold">
                          Wafq {seal.wafqSize}x{seal.wafqSize} ({seal.displayMode === 'eastern' ? '١٢٣' : seal.displayMode === 'letters' ? 'أبج' : '123'})
                        </span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(seal.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ToolInfoTooltip toolId="seven-kings" />

      <div className="space-y-4">

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
                {getFrequencyName(selectedDay)}
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

            {/* Auto-saved notification pill badge */}
            <AnimatePresence>
              {justSavedNotification && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.9 }}
                  className="absolute top-3.5 right-3.5 z-20 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-extrabold flex items-center gap-1.5 shadow-lg backdrop-blur-md"
                >
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>{t('seven-kings.autoSavedBadge', 'Sauvegardé automatiquement')}</span>
                </motion.div>
              )}
            </AnimatePresence>

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

            {/* SVG Interactive Celestial Seal with Fade-In Animation */}
            <div className="relative w-full max-w-[320px] aspect-square my-2 z-10 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedDay.dayId}-${wafqSize}-${displayMode}`}
                  initial={{ opacity: 0, scale: 0.88, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <SealSvgGraphic
                    selectedDay={selectedDay}
                    wafqSize={wafqSize}
                    currentWafqGrid={currentWafqGrid}
                    formatCellValue={formatCellValue}
                    activeSealSegment={activeSealSegment}
                    onSelectSegment={(seg) => setActiveSealSegment(seg)}
                    className="w-full h-full drop-shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                  />
                </motion.div>
              </AnimatePresence>
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
            <div className="w-full mt-4 z-10 pt-3 border-t border-gray-800/80 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadSeal}
                  className="py-2.5 px-3 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 border border-gray-800 transition-all cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>{t('seven-kings.downloadPNGSize', 'Télécharger PNG ({size}x{size})').replace(/{size}/g, String(wafqSize))}</span>
                  {!isPremium && <Lock className="w-3.5 h-3.5 text-amber-500/80 ml-auto" />}
                </button>

                <button
                  onClick={handleDownloadSVG}
                  className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 font-extrabold text-xs flex items-center justify-center gap-2 border border-amber-500/30 transition-all cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t('seven-kings.downloadSVG', 'Vectoriel SVG (HD)')}</span>
                  {!isPremium && <Lock className="w-3.5 h-3.5 text-amber-400 ml-auto" />}
                </button>
              </div>

              {!isPremium && (
                <div className="text-center pt-1">
                  <span className="text-[10px] text-amber-400/90 font-medium flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" />
                    {t('seven-kings.premiumProtectionNotice', 'Réservé aux membres Premium — Protection & Qualité Vectorielle HD')}
                  </span>
                </div>
              )}
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
        subtitle={t('seven-kings.parchmentSubtitle', "Régence de l'Ange {angel} ({angelAr}) & Roi {king}")
          .replace('{angel}', selectedDay.celestialAngel)
          .replace('{angelAr}', selectedDay.celestialAngelAr)
          .replace('{king}', selectedDay.terrestrialKing)}
        content={
          <div className="space-y-5 text-center font-serif text-amber-950">
            {/* Divine Name Calligraphy Banner */}
            <div 
              className="p-3.5 rounded-2xl border shadow-xs space-y-1"
              style={{ backgroundColor: '#fef3c7', color: '#451a03', borderColor: '#d97706' }}
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest block" style={{ color: '#92400e' }}>
                {t('seven-kings.divineInvocation', "Nom Divin d'Invocations")}
              </span>
              <p className="text-2xl sm:text-3xl font-bold font-serif" style={{ color: '#451a03' }}>
                {selectedDay.divineNameAr}
              </p>
              <p className="text-xs italic font-sans" style={{ color: '#78350f' }}>
                "{selectedDay.divineName}"
              </p>
            </div>

            {/* SVG SEAL GRAPHIC CENTERPIECE */}
            <div className="flex flex-col items-center justify-center my-3">
              <div 
                className="p-2 rounded-full border-2 shadow-md"
                style={{ backgroundColor: '#fffbeb', borderColor: '#b45309' }}
              >
                <SealSvgGraphic
                  selectedDay={selectedDay}
                  wafqSize={wafqSize}
                  currentWafqGrid={currentWafqGrid}
                  formatCellValue={formatCellValue}
                  isParchment={true}
                  className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] drop-shadow-lg"
                />
              </div>
              <span className="text-[10px] font-mono font-bold mt-2 uppercase tracking-wider" style={{ color: '#78350f' }}>
                {t('seven-kings.khatimSymbol', 'Sceau Officiel de Régence (Khatim & Wafq)')}
              </span>
            </div>

            {/* Correspondences & Regencies Grid */}
            <div 
              className="grid grid-cols-2 gap-2 text-xs font-sans text-left p-3.5 rounded-xl border"
              style={{ backgroundColor: '#fde68a', color: '#451a03', borderColor: '#d97706' }}
            >
              <div>
                <span className="font-semibold block" style={{ color: '#78350f' }}>{t('seven-kings.angelLabel', 'Ange Céleste :')}</span>
                <strong>{selectedDay.celestialAngel} ({selectedDay.celestialAngelAr})</strong>
              </div>
              <div>
                <span className="font-semibold block" style={{ color: '#78350f' }}>{t('seven-kings.kingLabel', 'Roi Terrestre :')}</span>
                <strong>{selectedDay.terrestrialKing} ({selectedDay.terrestrialKingAr})</strong>
              </div>
              <div>
                <span className="font-semibold block" style={{ color: '#78350f' }}>{t('seven-kings.planetLabel', 'Planète & Symbole :')}</span>
                <strong>{getPlanetName(selectedDay)} ({selectedDay.planetSymbol})</strong>
              </div>
              <div>
                <span className="font-semibold block" style={{ color: '#78350f' }}>{t('seven-kings.metalLabel', 'Métal Sacré :')}</span>
                <strong>{getMetalName(selectedDay)}</strong>
              </div>
              <div>
                <span className="font-semibold block" style={{ color: '#78350f' }}>{t('seven-kings.incenseLabel', 'Encens :')}</span>
                <strong>{getIncenseName(selectedDay)}</strong>
              </div>
              <div>
                <span className="font-semibold block" style={{ color: '#78350f' }}>{t('seven-kings.wafqSizeLabel', 'Matrice du Wafq :')}</span>
                <strong>{wafqSize}x{wafqSize} ({wafqSize * wafqSize} {t('seven-kings.casesLabel', 'cases')})</strong>
              </div>
            </div>

            {/* Archangels of the 4 Directions */}
            <div 
              className="p-2.5 rounded-xl border text-xs font-sans"
              style={{ backgroundColor: '#fef3c7', color: '#451a03', borderColor: '#d97706' }}
            >
              <span className="text-[10px] font-bold block uppercase mb-1" style={{ color: '#78350f' }}>
                {t('seven-kings.cardinalArchangels', 'Les 4 Archanges Cardinaux du Cercle')}
              </span>
              <p className="font-serif text-xs sm:text-sm font-bold" style={{ color: '#451a03' }}>
                جبرائيل (Jibrā'īl) — ميكائيل (Mīkā'īl) — إسرائيل (Isrāfīl) — عزرائيل ('Azrā'īl)
              </p>
            </div>

            {/* Azīma Invocation Box */}
            <div 
              className="p-3.5 rounded-xl border text-center space-y-1.5"
              style={{ backgroundColor: '#fffbeb', color: '#451a03', borderColor: '#f59e0b' }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: '#78350f' }}>
                {t('seven-kings.arabicInvocationLabel', 'Azīma Sacrée (L\'Invocatoire)')}
              </span>
              <p dir="rtl" className="text-base sm:text-lg font-serif font-bold leading-relaxed" style={{ color: '#451a03' }}>
                "{selectedDay.invocationAr}"
              </p>
              <p className="text-[11px] italic font-sans" style={{ color: '#78350f' }}>
                "{selectedDay.invocationPhonetic}"
              </p>
              <p className="text-[11px] font-sans leading-snug" style={{ color: '#451a03' }}>
                {getInvocationMeaning(selectedDay)}
              </p>
            </div>

            {/* Protection & Conscription Guidelines */}
            <div 
              className="p-3 rounded-xl border text-xs text-left font-sans space-y-1"
              style={{ backgroundColor: '#fde68a', color: '#451a03', borderColor: '#d97706' }}
            >
              <span className="font-bold uppercase tracking-wide block" style={{ color: '#78350f' }}>
                {t('seven-kings.ritualGuidelinesTitle', 'Consignes de Conscription & Protection (Tahseen)')}
              </span>
              <p className="leading-relaxed text-[11px]" style={{ color: '#451a03' }}>
                • <strong>{t('seven-kings.protectionLabel', 'Protection (Tahseen) :')}</strong> {t('seven-kings.protectionText', 'Réciter 7x Ayat Al-Kursi, Sourates Al-Falaq et An-Nas.')}<br/>
                • <strong>{t('seven-kings.inkLabel', 'Encre Bénite :')}</strong> {t('seven-kings.inkText', 'Safran (Za\'farān), Eau de Rose et Musc.')}<br/>
                • <strong>{t('seven-kings.favorableHourLabel', 'Heure Favorable :')}</strong> {t('seven-kings.favorableHourText', 'Première heure planétaire du {day}.').replace('{day}', getDayName(selectedDay))}
              </p>
            </div>
          </div>
        }
      />
      </div>
    </div>
  );
};
