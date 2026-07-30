import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Sparkles, Shield, Eye, EyeOff, Heart, BookOpen, Sun, Moon, 
  Crown, Compass, Download, Feather, Check, Info, Lock, Zap, Star,
  Volume2, VolumeX, Copy, Bookmark, Trash2, Layers, Grid, Share2, Filter, RefreshCw, Activity, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { db } from '../../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { ParchmentExporterModal } from '../../../components/ParchmentExporterModal';
import { ExternalScreenWidgetModal } from '../../../components/ExternalScreenWidgetModal';
import { triggerSystemWidgetNotification, launchPictureInPictureWidget } from '../../../utils/externalWidgetSystem';
import { toCanvas } from 'html-to-image';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { getDailyMysticalData } from '../../../data/rajmaDailyMystical';

export interface RajmaCharm {
  id: number;
  titleFr: string;
  titleEn: string;
  titleHa: string;
  arabicTitle: string;
  monthNameFr: string;
  monthNameAr: string;
  monthNameEn: string;
  monthNameHa: string;
  category: 'fath' | 'hifz' | 'mahabbah' | 'hikmah' | 'power' | 'nur';
  categoryFr: string;
  categoryEn: string;
  categoryHa: string;
  abjadValue: number;
  celestialAngel: string;
  celestialAngelAr: string;
  terrestrialKhadim: string;
  terrestrialKhadimAr: string;
  verseAr: string;
  verseFr: string;
  verseEn: string;
  verseHa: string;
  phonetic: string;
  benefitsFr: string[];
  benefitsEn: string[];
  benefitsHa: string[];
  repCount: number;
  bestHourFr: string;
  bestHourEn: string;
  bestHourHa: string;
  incenseFr: string;
  incenseEn: string;
  incenseHa: string;
  elementFr: string;
  elementEn: string;
  elementHa: string;
  colorGradient: string;
  strokeColor: string;
  glowColor: string;
  gridCells: string[][];
  cornerSymbols: [string, string, string, string];
  talsamFormula: string;
  talsamConnectedAr: string;
  frequencyHz: number;
  monthlyRitualFocusFr: string;
  monthlyRitualFocusEn: string;
  monthlyRitualFocusHa: string;
}

// Language getter helpers
export const getCharmTitle = (charm: RajmaCharm, lang: string) => {
  if (lang === 'ha') return charm.titleHa;
  if (lang === 'en') return charm.titleEn;
  return charm.titleFr;
};

export const getCharmCategoryName = (charm: RajmaCharm, lang: string) => {
  if (lang === 'ha') return charm.categoryHa;
  if (lang === 'en') return charm.categoryEn;
  return charm.categoryFr;
};

export const getCharmMonthName = (charm: RajmaCharm, lang: string) => {
  if (lang === 'ha') return charm.monthNameHa;
  if (lang === 'en') return charm.monthNameEn;
  return charm.monthNameFr;
};

export const getCharmVerseText = (charm: RajmaCharm, lang: string) => {
  if (lang === 'ha') return charm.verseHa;
  if (lang === 'en') return charm.verseEn;
  return charm.verseFr;
};

export const getCharmBenefitsList = (charm: RajmaCharm, lang: string) => {
  if (lang === 'ha') return charm.benefitsHa;
  if (lang === 'en') return charm.benefitsEn;
  return charm.benefitsFr;
};

export const getCharmBestHour = (charm: RajmaCharm, lang: string) => {
  if (lang === 'ha') return charm.bestHourHa;
  if (lang === 'en') return charm.bestHourEn;
  return charm.bestHourFr;
};

export const getCharmIncense = (charm: RajmaCharm, lang: string) => {
  if (lang === 'ha') return charm.incenseHa;
  if (lang === 'en') return charm.incenseEn;
  return charm.incenseFr;
};

export const getCharmElement = (charm: RajmaCharm, lang: string) => {
  if (lang === 'ha') return charm.elementHa;
  if (lang === 'en') return charm.elementEn;
  return charm.elementFr;
};

export const getCharmMonthlyFocus = (charm: RajmaCharm, lang: string) => {
  if (lang === 'ha') return charm.monthlyRitualFocusHa;
  if (lang === 'en') return charm.monthlyRitualFocusEn;
  return charm.monthlyRitualFocusFr;
};

export const RAJMA_CHARMS_DATA: RajmaCharm[] = [
  {
    id: 1,
    titleFr: "1. Sceau d'Ouverture & Victoire Éclatante (Fath al-Mubeen)",
    titleEn: "1. Seal of Opening & Manifest Victory (Fath al-Mubeen)",
    titleHa: "1. Hatimin Buɗe Kofa da Nasara (Fath al-Mubeen)",
    arabicTitle: "الخاتم الأوّل: فتحٌ مُبينٌ",
    monthNameFr: "Mois 1: Muharram (محرم)",
    monthNameAr: "المحرم",
    monthNameEn: "Month 1: Muharram",
    monthNameHa: "Wata 1: Muharram",
    monthlyRitualFocusFr: "Purification du Nouvel An, déblocage des portes fermées et protection annuelle des finances.",
    monthlyRitualFocusEn: "New Year spiritual purification, opening closed doors, and annual financial shielding.",
    monthlyRitualFocusHa: "Tsarkakewa na Sabuwar Shekara da bude kofofin arziki.",
    category: 'fath',
    categoryFr: "Ouverture & Succès",
    categoryEn: "Opening & Success",
    categoryHa: "Buɗi da Nasara",
    abjadValue: 489,
    celestialAngel: "Rūqyā'īl",
    celestialAngelAr: "رُوقِيَائِيلُ (عَلَيْهِ السَّلَامُ)",
    terrestrialKhadim: "Al-Mudhib",
    terrestrialKhadimAr: "الْمُذْهِبُ (الْخَادِمُ الْأَرْضِيُّ)",
    verseAr: "إنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا",
    verseFr: "En vérité, Nous t'avons accordé une victoire éclatante.",
    verseEn: "Indeed, We have granted you a clear triumph.",
    verseHa: "Lalle ne Muka buɗe muku buɗi na gaskiya.",
    phonetic: "Inna fatahnam laka fathan mubeena",
    benefitsFr: [
      "Déblocage immédiat des voies financières et commerciales fermées.",
      "Accord du succès dans les concours, examens et négociations cruciales.",
      "Victoire morale et spirituelle sur tous les obstacles matériels."
    ],
    benefitsEn: [
      "Immediate unlocking of closed financial and commercial paths.",
      "Grants victory in competitions, exams, and crucial negotiations.",
      "Spiritual and material triumph over worldly obstacles."
    ],
    benefitsHa: [
      "Buɗe hanyoyin arziki da kasuwanci da aka rufe nan take.",
      "Nasarar jarrabawa, hira, da kuma tattaunawa ta kasuwanci.",
      "Nasarar ruhi da ta duniya akan duk wani shammace."
    ],
    repCount: 489,
    bestHourFr: "Heure du Soleil (Rana) ou du Jupiter (Musteri)",
    bestHourEn: "Hour of the Sun or Jupiter",
    bestHourHa: "Awa na Rana ko na Musteri",
    incenseFr: "Lban Jawi & Santal Blanc",
    incenseEn: "Frankincense & White Sandalwood",
    incenseHa: "Sandal da Lban Jawi",
    elementFr: "Feu (Nār)",
    elementEn: "Fire (Nār)",
    elementHa: "Wuta (Nār)",
    colorGradient: "from-amber-500 via-orange-600 to-yellow-500",
    strokeColor: "#f59e0b",
    glowColor: "#fbbf24",
    gridCells: [
      ["٤٨٩", "فتح", "نصر"],
      ["مبين", "ر", "خير"],
      ["عز", "رزق", "٤٨٩"]
    ],
    cornerSymbols: ["ف", "ت", "ح", "ن"],
    talsamFormula: "ر ج م ا - ٤ ٨ ٩ - ف ت ح",
    talsamConnectedAr: "رَجْمَاء٤٨٩فَتْحٌ",
    frequencyHz: 528
  },
  {
    id: 2,
    titleFr: "2. Sceau du Bouclier Invincible (Hifz wa Uzz)",
    titleEn: "2. Seal of the Invincible Shield (Hifz wa Uzz)",
    titleHa: "2. Hatimin Kariyar Tsaro (Hifz wa Uzz)",
    arabicTitle: "الخاتم الثاني: حِفْزٌ وَعِزٌّ",
    monthNameFr: "Mois 2: Safar (صفر)",
    monthNameAr: "صفر",
    monthNameEn: "Month 2: Safar",
    monthNameHa: "Wata 2: Safar",
    monthlyRitualFocusFr: "Neutralisation des épreuves et fléaux attribués au mois de Safar, immunité totale.",
    monthlyRitualFocusEn: "Neutralizing trials and afflictions associated with Safar, absolute immunity.",
    monthlyRitualFocusHa: "Kariyar ruhi daga abubuwa marasa kyau a watan Safar.",
    category: 'hifz',
    categoryFr: "Protection & Bouclier",
    categoryEn: "Protection & Shield",
    categoryHa: "Kariya da Tsaro",
    abjadValue: 662,
    celestialAngel: "Jibrā'īl",
    celestialAngelAr: "جَبْرَائِيلُ (عَلَيْهِ السَّلَامُ)",
    terrestrialKhadim: "Murrah",
    terrestrialKhadimAr: "مُرَّةُ (الْخَادِمُ الْأَرْضِيُّ)",
    verseAr: "فَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ",
    verseFr: "Mais Allah est le meilleur gardien, et Il est le plus Miséricordieux des miséricordieux.",
    verseEn: "But Allah is the best guardian, and He is the Most Merciful of the merciful.",
    verseHa: "To Allah ne Mafi alkhairin mai kariya, kuma Shi ne Mafi jin ƙan masu jin ƙai.",
    phonetic: "Fallahu khayrun hafidhan wa huwa arhamur raahimeen",
    benefitsFr: [
      "Immunisation totale contre la sorcellerie (Sihr), le mauvais œil et l'envie.",
      "Protection du corps, de la maison et de la famille contre tout danger visible et invisible.",
      "Sérénité absolue et dissolution des angoisses psychiques."
    ],
    benefitsEn: [
      "Complete immunity against black magic, evil eye, and envy.",
      "Protection of body, home, and family from visible and hidden dangers.",
      "Absolute peace of mind and dissolution of psychic anxieties."
    ],
    benefitsHa: [
      "Kariya ta ciki da waje daga sammu, maita, da hassada.",
      "Tsare gida, iyali, da dukiya daga kowace irin ambaliyar sabo.",
      "Natsuwar zuciya da cire tsoro da damuwa."
    ],
    repCount: 662,
    bestHourFr: "Heure de la Lune (Al-Qamar) ou de Mars",
    bestHourEn: "Hour of the Moon or Mars",
    bestHourHa: "Awa na Wata ko na Mirrikh",
    incenseFr: "Myrrhe & Harmal (Sanza)",
    incenseEn: "Myrrh & Peganum Harmala",
    incenseHa: "Daddoya da Murr",
    elementFr: "Eau (Mā')",
    elementEn: "Water (Mā')",
    elementHa: "Ruwa (Mā')",
    colorGradient: "from-blue-600 via-indigo-700 to-cyan-500",
    strokeColor: "#3b82f6",
    glowColor: "#60a5fa",
    gridCells: [
      ["٦٦٢", "حفيظ", "سلام"],
      ["مانع", "ج", "حرز"],
      ["عزيز", "أمان", "٦٦٢"]
    ],
    cornerSymbols: ["ح", "ف", "ظ", "م"],
    talsamFormula: "ر ج م ا - ٦ ٦ ٢ - ح ف ظ",
    talsamConnectedAr: "رَجْمَاء٦٦٢حِفْظٌ",
    frequencyHz: 432
  },
  {
    id: 3,
    titleFr: "3. Sceau d'Attraction & Harmonie Universelle (Mahabbah)",
    titleEn: "3. Seal of Attraction & Universal Harmony (Mahabbah)",
    titleHa: "3. Hatimin Kauna da Farin Jini (Mahabbah)",
    arabicTitle: "الخاتم الثالث: المَحَبَّةُ وَالوِدّ",
    monthNameFr: "Mois 3: Rabi' al-Awwal (ربيع الأول)",
    monthNameAr: "ربيع الأول",
    monthNameEn: "Month 3: Rabi' al-Awwal",
    monthNameHa: "Wata 3: Rabi' al-Awwal",
    monthlyRitualFocusFr: "Célébration de la lumière prophétique (Mawlid), rayonnement d'amour et de compassion.",
    monthlyRitualFocusEn: "Celebrating prophetic illumination (Mawlid), radiating divine love and mercy.",
    monthlyRitualFocusHa: "Girma da kaunar Annabi (SAW) da samun farin jini a duniya.",
    category: 'mahabbah',
    categoryFr: "Amour & Attirance",
    categoryEn: "Love & Attraction",
    categoryHa: "Ƙauna da Farin Jini",
    abjadValue: 320,
    celestialAngel: "Mīkā'īl",
    celestialAngelAr: "مِيكَائِيلُ (عَلَيْهِ السَّلَامُ)",
    terrestrialKhadim: "Al-Ahmar",
    terrestrialKhadimAr: "الْأَحْمَرُ (الْخَادِمُ الْأَرْضِيُّ)",
    verseAr: "يُحِبُّونَهُمْ كَحُبِّ اللَّهِ وَالَّذِينَ آمَنُوا أَشَدُّ حُبًّا لِلَّهِ",
    verseFr: "Ils les aiment comme on aime Allah; mais les croyants ont un amour plus intense pour Allah.",
    verseEn: "They love them as they love Allah; but those who believe are stronger in love for Allah.",
    verseHa: "Suna ƙunse da ƙaunarsu kamar ƙaunar Allah, amma waɗanda suka yi imani sun fi tsananin ƙauna ga Allah.",
    phonetic: "Yuhibboonahum kahubbillah walladheena aamanoo ashaddu hubban lillah",
    benefitsFr: [
      "Attraction de la sympathie, du respect et de la bienveillance d'autrui.",
      "Réconciliation profonde des couples et harmonisation des foyers.",
      "Charisme magnétique et aura lumineuse irrésistible."
    ],
    benefitsEn: [
      "Attracts sympathy, respect, and goodwill from everyone.",
      "Deep reconciliation for couples and household harmony.",
      "Magnetic charisma and an irresistible luminous aura."
    ],
    benefitsHa: [
      "Janyo soyayyar mutane, girma, da kyautata zato.",
      "Daidaita tsakanin ma'aurata da samar da zaman lafiya a gida.",
      "Kwarjini, kwarjinin fuska, da kwarjinin magana."
    ],
    repCount: 320,
    bestHourFr: "Heure de Vénus (Al-Zuhara)",
    bestHourEn: "Hour of Venus",
    bestHourHa: "Awa na Al-Zuhara (Zuhura)",
    incenseFr: "Musc Blanc, Rose & Oud",
    incenseEn: "White Musk, Rose & Oud",
    incenseHa: "Musk, Fure da Turaren Oud",
    elementFr: "Air (Hawā')",
    elementEn: "Air (Hawā')",
    elementHa: "Iska (Hawā')",
    colorGradient: "from-rose-500 via-pink-600 to-purple-600",
    strokeColor: "#f43f5e",
    glowColor: "#fb7185",
    gridCells: [
      ["٣٢٠", "ودود", "عطف"],
      ["محبة", "م", "قبول"],
      ["ود", "جلب", "٣٢٠"]
    ],
    cornerSymbols: ["و", "د", "و", "د"],
    talsamFormula: "ر ج م ا - ٣ ٢ ٠ - و د د",
    talsamConnectedAr: "رَجْمَاء٣٢٠وُدٌّ",
    frequencyHz: 639
  },
  {
    id: 4,
    titleFr: "4. Sceau de la Sagesse & Clarté Mentale (Hikmah)",
    titleEn: "4. Seal of Wisdom & Mental Clarity (Hikmah)",
    titleHa: "4. Hatimin Hikima da Faha'imi (Hikmah)",
    arabicTitle: "الخاتم الرابع: الحِكْمَةُ وَالفَهْم",
    monthNameFr: "Mois 4: Rabi' al-Thani (ربيع الثاني)",
    monthNameAr: "ربيع الثاني",
    monthNameEn: "Month 4: Rabi' al-Thani",
    monthNameHa: "Wata 4: Rabi' al-Thani",
    monthlyRitualFocusFr: "Initiation aux sciences ésotériques (Ilm al-Asrar), mémorisation et intuition.",
    monthlyRitualFocusEn: "Initiation into esoteric sciences (Ilm al-Asrar), memory retention, and intuition.",
    monthlyRitualFocusHa: "Fahimtar ilmin asiri da bunkasa basira.",
    category: 'hikmah',
    categoryFr: "Sagesse & Connaissance",
    categoryEn: "Wisdom & Knowledge",
    categoryHa: "Hikima da Imi",
    abjadValue: 786,
    celestialAngel: "Isrāfīl",
    celestialAngelAr: "إِسْرَافِيلُ (عَلَيْهِ السَّلَامُ)",
    terrestrialKhadim: "Burqan",
    terrestrialKhadimAr: "بُرْقَانُ (الْخَادِمُ الْأَرْضِيُّ)",
    verseAr: "وَيُعَلِّمُكُمُ الْكِتَابَ وَالْحِكْمَةَ وَيُعَلِّمُكُمْ مَا لَمْ تَكُونُوا تَعْلَمُونَ",
    verseFr: "Il vous enseigne le Livre et la Sagesse, et vous enseigne ce que vous ne saviez pas.",
    verseEn: "He teaches you the Scripture and Wisdom, and teaches you that which you did not know.",
    verseHa: "Kuma yana koya muku Littafi da Hikima, kuma yana koya muku abin da kuka kasance ba ku sani ba.",
    phonetic: "Wa yu'allimukumul kitaba wal hikmata wa yu'allimukum ma lam takoonoo ta'lamoon",
    benefitsFr: [
      "Ouverture des facultés intellectuelles, mémoire prodigieuse et concentration.",
      "Compréhension rapide des textes sacrés, des sciences d'Abjad et de la géomancie.",
      "Inspiration créative et sagesse dans la prise de décision."
    ],
    benefitsEn: [
      "Unlocks intellectual faculties, sharp memory, and deep focus.",
      "Rapid comprehension of sacred texts, Abjad sciences, and geomancy.",
      "Creative inspiration and spiritual wisdom in decision making."
    ],
    benefitsHa: [
      "Bude kwakwalwa, kaifin basira, da rike karatu nan take.",
      "Gane ilmin sirri, haruffa, da kimiyyar abjad cikin sauki.",
      "Hikima wajen yanke shawara a tsakanin mutane."
    ],
    repCount: 786,
    bestHourFr: "Heure de Mercure (Al-'Utarid)",
    bestHourEn: "Hour of Mercury",
    bestHourHa: "Awa na Al-Utarid",
    incenseFr: "Mastic (Mastaka) & Camphre",
    incenseEn: "Mastic Gum & Camphor",
    incenseHa: "Mastaka da Kafur",
    elementFr: "Terre (Turāb)",
    elementEn: "Earth (Turāb)",
    elementHa: "Ƙasa (Turāb)",
    colorGradient: "from-emerald-600 via-teal-700 to-green-500",
    strokeColor: "#10b981",
    glowColor: "#34d399",
    gridCells: [
      ["٧٨٦", "عليم", "حكيم"],
      ["فهم", "إ", "علم"],
      ["نور", "بصيرة", "٧٨٦"]
    ],
    cornerSymbols: ["ع", "ل", "م", "ح"],
    talsamFormula: "ر ج م ا - ٧ ٨ ٦ - ع ل م",
    talsamConnectedAr: "رَجْمَاء٧٨٦عِلْمٌ",
    frequencyHz: 741
  },
  {
    id: 5,
    titleFr: "5. Sceau de Dignité & Élévation Sociale (Izza wa Rifa'a)",
    titleEn: "5. Seal of Dignity & Social Elevation (Izza wa Rifa'a)",
    titleHa: "5. Hatimin Daukaka da Girma (Izza wa Rifa'a)",
    arabicTitle: "الخاتم الخامس: العِزَّةُ وَالرِّفْعَة",
    monthNameFr: "Mois 5: Jumada al-Ula (جمادى الأولى)",
    monthNameAr: "جمادى الأولى",
    monthNameEn: "Month 5: Jumada al-Ula",
    monthNameHa: "Wata 5: Jumada al-Ula",
    monthlyRitualFocusFr: "Affirmation de la dignité, autorité légitime et avancement dans les rangs de leadership.",
    monthlyRitualFocusEn: "Affirmation of noble dignity, legitimate authority, and leadership promotion.",
    monthlyRitualFocusHa: "Samun daukaka a wurin aiki da shugabanci.",
    category: 'power',
    categoryFr: "Élévation & Pouvoir",
    categoryEn: "Elevation & Power",
    categoryHa: "Ɗaukaka da Mulki",
    abjadValue: 529,
    celestialAngel: "Azrā'īl",
    celestialAngelAr: "عَزْرَائِيلُ (عَلَيْهِ السَّلَامُ)",
    terrestrialKhadim: "Shamhoorish",
    terrestrialKhadimAr: "شَمْهُورَشُ (الْخَادِمُ الْأَرْضِيُّ)",
    verseAr: "مَنْ كَانَ يُرِيدُ الْعِزَّةَ فَلِلَّهِ الْعِزَّةُ جَمِيعًا",
    verseFr: "Quiconque veut la puissance, qu'il sache que la puissance appartient tout entière à Allah.",
    verseEn: "Whoever desires honor and power, to Allah belongs all honor and power.",
    verseHa: "Wanda yake nufin daukaka, to daukaka gaba daya ta Allah ce.",
    phonetic: "Man kana yureedul 'izzata falillahi al-'izzatu jamee'an",
    benefitsFr: [
      "Respect imposé et autorité bienveillante auprès des autorités et collègues.",
      "Élévation rapide dans les fonctions professionnelles et sociales.",
      "Protection contre la déchéance, le mépris et les calomnies."
    ],
    benefitsEn: [
      "Respect and benevolent authority in front of leaders and peers.",
      "Rapid promotion and elevation in professional and social ranks.",
      "Shield against downfall, contempt, and false slanders."
    ],
    benefitsHa: [
      "Kwarjini mai tsananin girma a gaban sarakuna da ma'aikata.",
      "Sami matsayi mai girma da daukaka a wurin aiki da al'umma.",
      "Tsari daga wulakanci, zargi, da munafunci."
    ],
    repCount: 529,
    bestHourFr: "Heure du Soleil ou de Jupiter",
    bestHourEn: "Hour of Sun or Jupiter",
    bestHourHa: "Awa na Rana ko na Musteri",
    incenseFr: "Lban Thakar (Frankincense royal) & Ambre",
    incenseEn: "Royal Frankincense & Amber",
    incenseHa: "Lban Thakar da Amber",
    elementFr: "Feu (Nār)",
    elementEn: "Fire (Nār)",
    elementHa: "Wuta (Nār)",
    colorGradient: "from-purple-600 via-indigo-800 to-fuchsia-700",
    strokeColor: "#a855f7",
    glowColor: "#c084fc",
    gridCells: [
      ["٥٢٩", "عزيز", "رفيع"],
      ["عزة", "ع", "ملك"],
      ["سلطان", "مقام", "٥٢٩"]
    ],
    cornerSymbols: ["ع", "ز", "ز", "ر"],
    talsamFormula: "ر ج م ا - ٥ ٢ ٩ - ع ز ز",
    talsamConnectedAr: "رَجْمَاء٥٢٩عِزٌّ",
    frequencyHz: 852
  },
  {
    id: 6,
    titleFr: "6. Sceau d'Abondance & Richesse Inépuisable (Barakah)",
    titleEn: "6. Seal of Abundance & Endless Wealth (Barakah)",
    titleHa: "6. Hatimin Arziki da Albarka (Barakah)",
    arabicTitle: "الخاتم السادس: البَرَكَةُ وَالرِّزْقُ الوَاسِع",
    monthNameFr: "Mois 6: Jumada al-Akhirah (جمادى الآخرة)",
    monthNameAr: "جمادى الآخرة",
    monthNameEn: "Month 6: Jumada al-Akhirah",
    monthNameHa: "Wata 6: Jumada al-Akhirah",
    monthlyRitualFocusFr: "Ancrage de la baraka matérielle, accroissement des revenus et prospérité durable.",
    monthlyRitualFocusEn: "Anchoring material barakah, revenue growth, and lasting prosperity.",
    monthlyRitualFocusHa: "Habaka sana'a da dukiya a watan Jumada al-Akhirah.",
    category: 'fath',
    categoryFr: "Abondance & Prospérité",
    categoryEn: "Abundance & Prosperity",
    categoryHa: "Arziki da Albarka",
    abjadValue: 1059,
    celestialAngel: "Anyā'īl",
    celestialAngelAr: "عَنْيَائِيلُ (عَلَيْهِ السَّلَامُ)",
    terrestrialKhadim: "Zawba'ah",
    terrestrialKhadimAr: "زَوْبَعَةُ (الْخَادِمُ الْأَرْضِيُّ)",
    verseAr: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    verseFr: "Et Il lui accordera Ses dons par des moyens sur lesquels il ne comptait pas.",
    verseEn: "And He will provide for him from where he does not expect.",
    verseHa: "Kuma Yana arzurta shi daga inda ba ya zatto.",
    phonetic: "Wa yarzuqhu min haythu la yahtasib wa man yatawakkal 'alallahi fahuwa hasbuh",
    benefitsFr: [
      "Prospérité financière miraculeuse et entrées d'argent inattendues.",
      "Bénédiction dans les récoltes, le commerce, les épargnes et les projets.",
      "Élimination des dettes et soulagement de la pauvreté."
    ],
    benefitsEn: [
      "Miraculous financial prosperity and unexpected wealth streams.",
      "Barakah in business, savings, investments, and family wealth.",
      "Freedom from debt and relief from financial hardship."
    ],
    benefitsHa: [
      "Arziki na ba-zata da samun kudi daga inda ba a tsammani.",
      "Albarka a cikin sana'a, kasuwanci, da dukiyar gida.",
      "Biyan bashi da samun saukin rayuwa."
    ],
    repCount: 1059,
    bestHourFr: "Heure de Jupiter (Musteri)",
    bestHourEn: "Hour of Jupiter",
    bestHourHa: "Awa na Musteri",
    incenseFr: "Benjoin Jaune, Safran & Cannelle",
    incenseEn: "Yellow Benzoin, Saffron & Cinnamon",
    incenseHa: "Jawi, Safran da Kanumfari",
    elementFr: "Terre (Turāb)",
    elementEn: "Earth (Turāb)",
    elementHa: "Ƙasa (Turāb)",
    colorGradient: "from-amber-400 via-yellow-600 to-amber-700",
    strokeColor: "#eab308",
    glowColor: "#fde047",
    gridCells: [
      ["١٠٥٩", "رزاق", "غني"],
      ["بركة", "ع", "وفرة"],
      ["جود", "كرم", "١٠٥٩"]
    ],
    cornerSymbols: ["ر", "ز", "ق", "ب"],
    talsamFormula: "ر ج م ا - ١ ٠ ٥ ٩ - ر ز ق",
    talsamConnectedAr: "رَجْمَاء١٠٥٩رِزْقٌ",
    frequencyHz: 888
  },
  {
    id: 7,
    titleFr: "7. Sceau de Guérison & Vitalité Sacrée (Shifa')",
    titleEn: "7. Seal of Healing & Sacred Vitality (Shifa')",
    titleHa: "7. Hatimin Magoni da Lafiya (Shifa')",
    arabicTitle: "الخاتم السابع: الشِّفَاءُ وَالعَافِيَة",
    monthNameFr: "Mois 7: Rajab al-Murajjab (رجب)",
    monthNameAr: "رجب",
    monthNameEn: "Month 7: Rajab",
    monthNameHa: "Wata 7: Rajab",
    monthlyRitualFocusFr: "Mois sacré de Rajab: régénération cellulaire, guérison des maux du corps et de l'esprit.",
    monthlyRitualFocusEn: "Sacred month of Rajab: cellular regeneration, physical and spiritual healing.",
    monthlyRitualFocusHa: "Tsarkake jiki da samun lafiya a cikin watan Rajab.",
    category: 'hifz',
    categoryFr: "Santé & Guérison",
    categoryEn: "Health & Healing",
    categoryHa: "Lafiya da Warkewa",
    abjadValue: 391,
    celestialAngel: "Kasfyā'īl",
    celestialAngelAr: "كَفْصَيَائِيلُ (عَلَيْهِ السَّلَامُ)",
    terrestrialKhadim: "Maimoon",
    terrestrialKhadimAr: "مَيْمُونُ (الْخَادِمُ الْأَرْضِيُّ)",
    verseAr: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ",
    verseFr: "Et quand je suis malade, c'est Lui qui me guérit.",
    verseEn: "And when I am ill, it is He who cures me.",
    verseHa: "Kuma idan na yi jinya, to Shi ne Yake warkar da ni.",
    phonetic: "Wa idha maridtu fahuwa yashfeen",
    benefitsFr: [
      "Rétablissement rapide lors des maladies chroniques ou inexplicables.",
      "Délivrance des blocages énergétiques et rajeunissement de la vitalité.",
      "Apaisement des douleurs physiques et purification du sang."
    ],
    benefitsEn: [
      "Rapid recovery from chronic or mysterious illnesses.",
      "Release of energetic blockages and revitalization of stamina.",
      "Soothes physical pain and purifies the spiritual bloodstream."
    ],
    benefitsHa: [
      "Warkewa daga cututtuka masu wuyar magani ko na aljanu.",
      "Samun kuzari, karfi, da cire gajiyar jiki.",
      "Cire radadin ciwo da gyaran jini na ruhi."
    ],
    repCount: 391,
    bestHourFr: "Heure du Soleil ou de Mercure",
    bestHourEn: "Hour of Sun or Mercury",
    bestHourHa: "Awa na Rana ko Utarid",
    incenseFr: "Graines de Nigelle (Habbat al-Barakah) & Camphre",
    incenseEn: "Black Seed & Camphor",
    incenseHa: "Habbatul Sauda da Kafur",
    elementFr: "Eau (Mā')",
    elementEn: "Water (Mā')",
    elementHa: "Ruwa (Mā')",
    colorGradient: "from-teal-500 via-emerald-600 to-cyan-700",
    strokeColor: "#14b8a6",
    glowColor: "#2dd4bf",
    gridCells: [
      ["٣٩١", "شافي", "معافي"],
      ["شفاء", "ك", "عافية"],
      ["نور", "صحة", "٣٩١"]
    ],
    cornerSymbols: ["ش", "ف", "ا", "ء"],
    talsamFormula: "ر ج م ا - ٣ ٩ ١ - ش ف ا",
    talsamConnectedAr: "رَجْمَاء٣٩١شِفَاءٌ",
    frequencyHz: 528
  },
  {
    id: 8,
    titleFr: "8. Sceau de l'Illumination & Visions Prophétiques (Nur wa Basira)",
    titleEn: "8. Seal of Illumination & Prophetic Visions (Nur wa Basira)",
    titleHa: "8. Hatimin Haske da Hankalantar Ruhi (Nur wa Basira)",
    arabicTitle: "الخاتم الثامن: النُّورُ وَالبَصِيرَة",
    monthNameFr: "Mois 8: Sha'ban al-Mu'azzam (شعبان)",
    monthNameAr: "شعبان",
    monthNameEn: "Month 8: Sha'ban",
    monthNameHa: "Wata 8: Sha'ban",
    monthlyRitualFocusFr: "Nuit médiane (Nisf Sha'ban): élévation des actes, illumination du cœur et dévoilement.",
    monthlyRitualFocusEn: "Mid-Sha'ban night: raising of deeds, heart illumination, and spiritual unveils.",
    monthlyRitualFocusHa: "Haskaka zuciya da samun kashfi a daren tsakiyar Sha'ban.",
    category: 'nur',
    categoryFr: "Éveil Spirituel & Vision",
    categoryEn: "Spiritual Vision & Light",
    categoryHa: "Haske da Basira",
    abjadValue: 256,
    celestialAngel: "Nūriyā'īl",
    celestialAngelAr: "نُورِيَائِيلُ (عَلَيْهِ السَّلَامُ)",
    terrestrialKhadim: "Tariq",
    terrestrialKhadimAr: "طَارِقٌ (الْخَادِمُ الْأَرْضِيُّ)",
    verseAr: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ",
    verseFr: "Allah est la Lumière des cieux et de la terre. Sa lumière est semblable à une niche où se trouve une lampe.",
    verseEn: "Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp.",
    verseHa: "Allah Shi ne Hasken sammai da ƙasa. Misalin Haskensa kamar ta goce ce wadda a cikinta akwai fitila.",
    phonetic: "Allahu noorus samawati wal ard mathalu noorihi kamishkaatin feeha misbaah",
    benefitsFr: [
      "Éveil de l'œil du cœur (Basira) et clarté des conseils spirituels.",
      "Rêves prémonitoires limpides et guidance directe lors du sommeil.",
      "Dissipation des ténèbres du doute et de la confusion mentale."
    ],
    benefitsEn: [
      "Awakening of inner vision (Basira) and spiritual perception.",
      "Clear prophetic dreams and divine guidance during sleep.",
      "Dissolves darkness of doubt and mental confusion."
    ],
    benefitsHa: [
      "Budewar idon zuciya (Basira) da gane gaskiyar al'amura.",
      "Mafarkai na gaskiya masu haskaka hanya lokacin barci.",
      "Cire duhun kokanto da rikicewar tunani."
    ],
    repCount: 256,
    bestHourFr: "Fin de Nuit (Sahar / Dernier Tiers)",
    bestHourEn: "End of Night (Sahar / Last Third)",
    bestHourHa: "Karshen Dare (Lokacin Tahajjud)",
    incenseFr: "Oud Pur & Huile de Rose de Taïf",
    incenseEn: "Pure Oud & Taif Rose Oil",
    incenseHa: "Turaren Oud da Furen Ta'if",
    elementFr: "Air (Hawā')",
    elementEn: "Air (Hawā')",
    elementHa: "Iska (Hawā')",
    colorGradient: "from-indigo-500 via-purple-600 to-pink-500",
    strokeColor: "#818cf8",
    glowColor: "#a5b4fc",
    gridCells: [
      ["٢٥٦", "نور", "بصير"],
      ["كشف", "ن", "هدى"],
      ["ضياء", "سر", "٢٥٦"]
    ],
    cornerSymbols: ["ن", "و", "ر", "ك"],
    talsamFormula: "ر ج م ا - ٢ ٥ ٦ - ن و ر",
    talsamConnectedAr: "رَجْمَاء٢٥٦نُورٌ",
    frequencyHz: 963
  },
  {
    id: 9,
    titleFr: "9. Sceau de la Victoire contre les Oppresseurs (Nasr wa Qahr)",
    titleEn: "9. Seal of Victory over Oppressors (Nasr wa Qahr)",
    titleHa: "9. Hatimin Nasara akan Makiya (Nasr wa Qahr)",
    arabicTitle: "الخاتم التاسع: النَّصْرُ وَالقَهْر",
    monthNameFr: "Mois 9: Ramadan al-Mubarak (رمضان)",
    monthNameAr: "رمضان",
    monthNameEn: "Month 9: Ramadan",
    monthNameHa: "Wata 9: Ramadan",
    monthlyRitualFocusFr: "Mois sacré de Ramadan & Laylat al-Qadr: victoire totale sur le nafs, shayatins et tyrans.",
    monthlyRitualFocusEn: "Holy Month of Ramadan & Laylat al-Qadr: complete victory over lower self and oppressors.",
    monthlyRitualFocusHa: "Nasarar ruhi a watan Ramadan da Daren Laylatul Qadr.",
    category: 'power',
    categoryFr: "Victoire & Triomphe",
    categoryEn: "Victory & Triumph",
    categoryHa: "Nasara akan Makiya",
    abjadValue: 450,
    celestialAngel: "Shamhā'īl",
    celestialAngelAr: "شَمْهَائِيلُ (عَلَيْهِ السَّلَامُ)",
    terrestrialKhadim: "Qaswarah",
    terrestrialKhadimAr: "قَسْوَرَةُ (الْخَادِمُ الْأَرْضِيُّ)",
    verseAr: "نَصْرٌ مِنَ اللَّهِ وَفَتْحٌ قَرِيبٌ وَبَشِّرِ الْمُؤْمِنِينَ",
    verseFr: "Un secours venant d'Allah et une victoire prochaine. Et annonce la bonne nouvelle aux croyants.",
    verseEn: "Help from Allah and an imminent victory. And give good tidings to the believers.",
    verseHa: "Taimako daga Allah da buɗi kusa. Kuma ka ba muminai bushara.",
    phonetic: "Nasrun minallahi wa fathun qareeb wa bashshiril mu'mineen",
    benefitsFr: [
      "Triomphe certain dans les procès, litiges et conflits inégaux.",
      "Annulation et retournement des pièges tendus par les comploteurs.",
      "Protection contre la tyrannie et la domination injuste."
    ],
    benefitsEn: [
      "Certain triumph in court trials, conflicts, and unfair disputes.",
      "Cancellation and reversal of traps set by schemers.",
      "Shield against tyranny and unjust domination."
    ],
    benefitsHa: [
      "Nasara a shari'a, rikici, da rigingimu na zalunci.",
      "Rushe kaite da sharrin makiranta ya koma kan mai shi.",
      "Kariya daga zaluncin sarakuna da mahukunta."
    ],
    repCount: 450,
    bestHourFr: "Heure de Mars (Al-Mirrikh)",
    bestHourEn: "Hour of Mars",
    bestHourHa: "Awa na Mirrikh",
    incenseFr: "Poivre Noir, Harmal & Coriandre",
    incenseEn: "Black Pepper, Harmal & Coriander",
    incenseHa: "Masoro, Sanza da Koriyanda",
    elementFr: "Feu (Nār)",
    elementEn: "Fire (Nār)",
    elementHa: "Wuta (Nār)",
    colorGradient: "from-red-600 via-rose-700 to-amber-700",
    strokeColor: "#ef4444",
    glowColor: "#f87171",
    gridCells: [
      ["٤٥٠", "ناصر", "قاهر"],
      ["فتح", "ش", "غلبة"],
      ["عز", "قوة", "٤٥٠"]
    ],
    cornerSymbols: ["ن", "ص", "ر", "ق"],
    talsamFormula: "ر ج م ا - ٤ ٥ ٠ - ن ص ر",
    talsamConnectedAr: "رَجْمَاء٤٥٠نَصْرٌ",
    frequencyHz: 417
  },
  {
    id: 10,
    titleFr: "10. Sceau de Sérénité & Paix de l'Âme (Sakinah)",
    titleEn: "10. Seal of Tranquility & Inner Peace (Sakinah)",
    titleHa: "10. Hatimin Salama da Natsuwa (Sakinah)",
    arabicTitle: "الخاتم العاشر: السَّكِينَةُ وَالطَّمَأْنِينَة",
    monthNameFr: "Mois 10: Shawwal (شوال)",
    monthNameAr: "شوال",
    monthNameEn: "Month 10: Shawwal",
    monthNameHa: "Wata 10: Shawwal",
    monthlyRitualFocusFr: "Récompense de l'Aïd, consolidation des acquis spirituels et paix du cœur.",
    monthlyRitualFocusEn: "Eid rewards, consolidation of spiritual achievements, and heart tranquility.",
    monthlyRitualFocusHa: "Cikar ibada da natsuwa a watan Shawwal.",
    category: 'nur',
    categoryFr: "Sérénité & Paix",
    categoryEn: "Peace & Tranquility",
    categoryHa: "Natsuwa da Salama",
    abjadValue: 512,
    celestialAngel: "Tahfā'īl",
    celestialAngelAr: "طَهْفَيَائِيلُ (عَلَيْهِ السَّلَامُ)",
    terrestrialKhadim: "Saleh",
    terrestrialKhadimAr: "صَالِحٌ (الْخَادِمُ الْأَرْضِيُّ)",
    verseAr: "هُوَ الَّذِي أَنْزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ لِيَزْدَادُوا إِيمَانًا مَعَ إِيمَانِهِمْ",
    verseFr: "C'est Lui qui a fait descendre la quiétude dans les cœurs des croyants pour qu'ils ajoutent une foi à leur foi.",
    verseEn: "It is He who sent down tranquility into the hearts of the believers that they would increase in faith upon their faith.",
    verseHa: "Shi ne Wanda Ya saukar da kwanciyar hankali a cikin zakatun muminai domin su ƙara imani kan imaninsu.",
    phonetic: "Huwalladhi anzalas sakeenata fee quloobil mu'mineena liyazdaadoo eemanan ma'a eemanihim",
    benefitsFr: [
      "Apaisement profond du stress, de la dépression et des attaques de panique.",
      "Sommeil réparateur et protection contre les cauchemars et la terreur nocturne.",
      "Stabilité émotionnelle et harmonie intérieure inébranlable."
    ],
    benefitsEn: [
      "Deep relief from anxiety, stress, and panic attacks.",
      "Restful sleep and shield against nightmares and night terrors.",
      "Emotional resilience and unshakeable inner peace."
    ],
    benefitsHa: [
      "Kwantar da hankali, firgita, da bacin rai nan take.",
      "Baccin lafiya ba tare da mugun mafarki ko tsoron dare ba.",
      "Natsuwar zuciya da tsayin daka wajen ibada."
    ],
    repCount: 512,
    bestHourFr: "Heure de la Lune ou de Vénus",
    bestHourEn: "Hour of Moon or Venus",
    bestHourHa: "Awa na Wata ko Zuhura",
    incenseFr: "Lavande, Santal & Fleur d'Oranger",
    incenseEn: "Lavender, Sandalwood & Orange Blossom",
    incenseHa: "Sandal, Fure da Furen Lemun Tsami",
    elementFr: "Eau (Mā')",
    elementEn: "Water (Mā')",
    elementHa: "Ruwa (Mā')",
    colorGradient: "from-sky-500 via-teal-600 to-indigo-600",
    strokeColor: "#0ea5e9",
    glowColor: "#38bdf8",
    gridCells: [
      ["٥١٢", "سلام", "سكينة"],
      ["أمن", "ط", "راحة"],
      ["اطمئنان", "طهر", "٥١٢"]
    ],
    cornerSymbols: ["س", "ك", "ن", "هـ"],
    talsamFormula: "ر ج م ا - ٥ ١ ٢ - س ك ن",
    talsamConnectedAr: "رَجْمَاء٥١٢سَكَنٌ",
    frequencyHz: 396
  },
  {
    id: 11,
    titleFr: "11. Sceau du Secret Inviolable & Couverture Divines (Sirr wa Sitr)",
    titleEn: "11. Seal of the Inviolable Secret & Divine Cover (Sirr wa Sitr)",
    titleHa: "11. Hatimin Asiri da Sutura (Sirr wa Sitr)",
    arabicTitle: "الخاتم الحادي عشر: السِّرُّ وَالسِّتْرُ الإِلَهِي",
    monthNameFr: "Mois 11: Dhu al-Qi'dah (ذو القعدة)",
    monthNameAr: "ذو القعدة",
    monthNameEn: "Month 11: Dhu al-Qi'dah",
    monthNameHa: "Wata 11: Dhu al-Qi'dah",
    monthlyRitualFocusFr: "Retraite mystique (Khalwa), protection des secrets et préparation au pèlerinage.",
    monthlyRitualFocusEn: "Mystic retreat (Khalwa), protecting secret teachings, and pilgrimage prep.",
    monthlyRitualFocusHa: "Kariya ta asiri da zama a khalwa a Dhu al-Qi'dah.",
    category: 'hifz',
    categoryFr: "Secret & Protection",
    categoryEn: "Secret & Protection",
    categoryHa: "Asiri da Sutura",
    abjadValue: 818,
    celestialAngel: "Batmyā'īl",
    celestialAngelAr: "بَطْمَيَائِيلُ (عَلَيْهِ السَّلَامُ)",
    terrestrialKhadim: "Khafiyy",
    terrestrialKhadimAr: "خَفِيٌّ (الْخَادِمُ الْأَرْضِيُّ)",
    verseAr: "وَعِنْدَهُ مَفَاتِحُ الْغَيْبِ لَا يَعْلَمُهَا إِلَّا هُوَ",
    verseFr: "C'est Lui qui détient les clefs de l'Inconnaissable. Nul autre que Lui ne les connaît.",
    verseEn: "And with Him are the keys of the unseen; none knows them except Him.",
    verseHa: "Kuma a wurinsa maballan gaibi suke, babu wanda ya sansu sai Shi.",
    phonetic: "Wa 'indahu mafatihul ghaybi la ya'lamuha illa huwa",
    benefitsFr: [
      "Protection absolue des secrets professionnels, rituels et personnels.",
      "Sutura (couverture divine) contre l'inquisition des curieux et des espions.",
      "Invisibilité mystique face aux yeux malveillants."
    ],
    benefitsEn: [
      "Absolute confidentiality for professional, ritual, and personal secrets.",
      "Sutura (Divine veil) against spies and intrusive eyes.",
      "Mystic invisibility in the face of hostile scrutiny."
    ],
    benefitsHa: [
      "Kariya ta sirri kan ayyuka, kasuwanci, da rayuwar gida.",
      "Sutura ta Ubangiji daga sharrin yan leken asiri da 'yan sa ido.",
      "Boye al'amuran mutum daga idon makiya."
    ],
    repCount: 818,
    bestHourFr: "Dernière heure du Vendredi avant le Maghrib",
    bestHourEn: "Last hour of Friday before Maghrib",
    bestHourHa: "Awar karshe na Ranar Juma'a kafin Magriba",
    incenseFr: "Styrax (Mebkhara), Storax & Musc Noir",
    incenseEn: "Storax Resin & Black Musk",
    incenseHa: "Musk Baki da Turaren Storax",
    elementFr: "Terre (Turāb)",
    elementEn: "Earth (Turāb)",
    elementHa: "Ƙasa (Turāb)",
    colorGradient: "from-zinc-700 via-slate-800 to-stone-900",
    strokeColor: "#94a3b8",
    glowColor: "#cbd5e1",
    gridCells: [
      ["٨١٨", "ستار", "خفي"],
      ["سر", "ب", "حجاب"],
      ["غيب", "صيانة", "٨١٨"]
    ],
    cornerSymbols: ["س", "ت", "ر", "خ"],
    talsamFormula: "ر ج م ا - ٨ ١ ٨ - س ت ر",
    talsamConnectedAr: "رَجْمَاء٨١٨سِتْرٌ",
    frequencyHz: 741
  },
  {
    id: 12,
    titleFr: "12. Sceau de la Synthèse & Couronnement Suprême (Jami' al-Asrar)",
    titleEn: "12. Seal of Synthesis & Supreme Crown (Jami' al-Asrar)",
    titleHa: "12. Hatimin Kamala da Cikar Asiri (Jami' al-Asrar)",
    arabicTitle: "الخاتم الثاني عشر: جَامِعُ الأَسْرَارِ وَالأَنْوَار",
    monthNameFr: "Mois 12: Dhu al-Hijjah (ذو الحجة)",
    monthNameAr: "ذو الحجة",
    monthNameEn: "Month 12: Dhu al-Hijjah",
    monthNameHa: "Wata 12: Dhu al-Hijjah",
    monthlyRitualFocusFr: "Couronnement annuel des 10 premiers jours de Dhu al-Hijjah & Jour d'Arafat: accomplissement suprême.",
    monthlyRitualFocusEn: "Crowning 10 days of Dhu al-Hijjah & Arafah: ultimate spiritual fulfillment.",
    monthlyRitualFocusHa: "Kammala riyada da samun amsa addu'a a ranar Arafat.",
    category: 'hikmah',
    categoryFr: "Couronnement & Synthèse",
    categoryEn: "Crown & Synthesis",
    categoryHa: "Cikar Asiri da Kamala",
    abjadValue: 1111,
    celestialAngel: "Quṭbiyā'īl",
    celestialAngelAr: "قُطْبِيَائِيلُ (عَلَيْهِ السَّلَامُ)",
    terrestrialKhadim: "Al-Malik Al-Kabeer",
    terrestrialKhadimAr: "الْمَلِكُ الْكَبِيرُ (الْخَادِمُ الْأَرْضِيُّ)",
    verseAr: "رَبَّنَا إِنَّكَ جَامِعُ النَّاسِ لِيَوْمٍ لَا رَيْبَ فِيهِ إِنَّ اللَّهَ لَا يُخْلِفُ الْمِيعَادَ",
    verseFr: "Seigneur! C'est Toi qui rassembleras les gens, un jour en quoi il n'y a point de doute, car Allah ne manque jamais à Sa promesse.",
    verseEn: "Our Lord, surely You will gather the people for a Day about which there is no doubt. Indeed, Allah does not fail in His promise.",
    verseHa: "Ubangijinmu! Lalle ne Kai ne Mai tara mutane a ranar da babu shakka a cikinta; lalle ne Allah ba Ya saba alkawari.",
    phonetic: "Rabbana innaka jaami'un naasi liyawmin la rayba feeh innallaha la yukhliful mee'aad",
    benefitsFr: [
      "Couronnement de toutes les entreprises et rassemblement de toutes les bénédictions.",
      "Harmonisation parfaite des 4 éléments (Feu, Eau, Air, Terre) dans la vie de l'adepte.",
      "Clé maîtresse (Al-Muftah) activant et amplifiant l'efficacité des 11 autres charmes."
    ],
    benefitsEn: [
      "Crowning of all endeavors and gathering of all spiritual blessings.",
      "Perfect alignment of the 4 elements (Fire, Water, Air, Earth) in life.",
      "Master Key activating and amplifying the power of all 11 other charms."
    ],
    benefitsHa: [
      "Tattaro duk wata albarka da kammala duk wani shiri cikin nasara.",
      "Daidaita abubuwa guda hudu (Wuta, Ruwa, Iska, Kasa) a rayuwa.",
      "Mabuɗin karshe mai kunnatawa da ƙarfafa sauran hatimai guda 11."
    ],
    repCount: 1111,
    bestHourFr: "Nuit du Jeudi au Vendredi (Heure de la Prière de Tahajjud)",
    bestHourEn: "Night of Thursday to Friday (Hour of Tahajjud)",
    bestHourHa: "Daren Alhamis zuwa Juma'a (Lokacin Tahajjud)",
    incenseFr: "Lban Jawi Royal, Oud, Amber & saffron",
    incenseEn: "Royal Frankincense, Oud, Amber & Saffron",
    incenseHa: "Lban Thakar, Oud, Amber da Safran",
    elementFr: "Éther (Al-Atheer / 4 Éléments)",
    elementEn: "Ether (4 Elements)",
    elementHa: "Ruhaniya (Abubuwa 4)",
    colorGradient: "from-amber-500 via-purple-700 to-emerald-600",
    strokeColor: "#f59e0b",
    glowColor: "#fef08a",
    gridCells: [
      ["١١١١", "جامع", "محيط"],
      ["كمال", "ق", "نور"],
      ["عز", "ختم", "١١١١"]
    ],
    cornerSymbols: ["ج", "ا", "م", "ع"],
    talsamFormula: "ر ج م ا - ١ ١ ١ ١ - ج ا م ع",
    talsamConnectedAr: "رَجْمَاء١١١١جَامِعٌ",
    frequencyHz: 1111
  }
];

export default function RajmaCharms() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [selectedCharm, setSelectedCharm] = useState<RajmaCharm>(RAJMA_CHARMS_DATA[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'visual' | 'incantation' | 'benefits' | 'science' | 'calendar'>('visual');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [savedFavorites, setSavedFavorites] = useState<number[]>([]);
  const [showParchmentModal, setShowParchmentModal] = useState<boolean>(false);
  const [showDailyParchmentModal, setShowDailyParchmentModal] = useState<boolean>(false);
  const [showExternalWidgetModal, setShowExternalWidgetModal] = useState<boolean>(false);
  const [isExportingDailySeal, setIsExportingDailySeal] = useState<boolean>(false);
  const [showSealInscriptions, setShowSealInscriptions] = useState<boolean>(false);
  const [layoutCheckMode, setLayoutCheckMode] = useState<boolean>(false);
  const [layoutStatus, setLayoutStatus] = useState<{
    isFluid: boolean;
    viewportWidth: number;
    scrollWidth: number;
    overflowingCount: number;
  }>({ isFluid: true, viewportWidth: 0, scrollWidth: 0, overflowingCount: 0 });

  const pageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dailySealRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const handleDownloadDailySealPNG = async () => {
    if (!dailySealRef.current) return;
    setIsExportingDailySeal(true);
    try {
      const el = dailySealRef.current;
      const width = el.scrollWidth || el.offsetWidth || 650;
      const height = el.scrollHeight || el.offsetHeight || 850;

      const canvas = await toCanvas(el, {
        quality: 0.98,
        pixelRatio: 2,
        cacheBust: true,
        width: width,
        height: height,
        backgroundColor: '#030008',
      });
      await downloadCanvasImage(canvas, `Sceau_du_Jour_${selectedDay}_Mois_${selectedCharm.id}_AsrarHub.png`);
    } catch (err) {
      console.error('Error downloading daily seal PNG:', err);
    } finally {
      setIsExportingDailySeal(false);
    }
  };

  // Diagnostic layout inspection
  useEffect(() => {
    const checkLayout = () => {
      if (!pageRef.current) return;
      const vpWidth = window.innerWidth;
      const scWidth = document.documentElement.scrollWidth;
      const hasOverflow = scWidth > vpWidth + 1;

      let overflowCount = 0;
      const elements = pageRef.current.querySelectorAll('*');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > vpWidth + 1 || rect.left < -1) {
          overflowCount++;
        }
      });

      const isFluid = !hasOverflow && overflowCount === 0;
      setLayoutStatus({
        isFluid,
        viewportWidth: vpWidth,
        scrollWidth: scWidth,
        overflowingCount: overflowCount
      });

      if (layoutCheckMode || !isFluid) {
        console.info('[Rajma Charms Layout Check]', {
          isFluid,
          viewportWidth: vpWidth,
          scrollWidth: scWidth,
          overflowingElementsCount: overflowCount
        });
      }
    };

    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, [layoutCheckMode, selectedCharm, activeTab, selectedCategory]);

  useEffect(() => {
    if (user?.uid) {
      const favKey = `rajma_favs_${user.uid}`;
      const saved = localStorage.getItem(favKey);
      if (saved) {
        try {
          setSavedFavorites(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [user]);

  const toggleFavorite = (charmId: number) => {
    if (!user?.uid) {
      triggerProtectionModal("general");
      return;
    }
    const favKey = `rajma_favs_${user.uid}`;
    let updated: number[];
    if (savedFavorites.includes(charmId)) {
      updated = savedFavorites.filter(id => id !== charmId);
    } else {
      updated = [...savedFavorites, charmId];
    }
    setSavedFavorites(updated);
    localStorage.setItem(favKey, JSON.stringify(updated));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const filteredCharms = RAJMA_CHARMS_DATA.filter(charm => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'favs') return savedFavorites.includes(charm.id);
    return charm.category === selectedCategory;
  });

  const playFrequencyTone = (freq: number) => {
    if (isPlayingAudio) {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {}
      }
      setIsPlayingAudio(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscillatorRef.current = osc;
      setIsPlayingAudio(true);

      setTimeout(() => {
        try {
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
          setTimeout(() => {
            osc.stop();
            setIsPlayingAudio(false);
          }, 1000);
        } catch (e) {}
      }, 5000);
    } catch (e) {
      console.error("Audio error:", e);
    }
  };

  const handleDownloadPNG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#030008';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1000, 1000);
        downloadCanvasImage(canvas, `Sceau_RAJMA_Charm_${selectedCharm.id}_AsrarHub.png`);
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-4 sm:py-10 px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto min-w-0 w-full overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-purple-200 dark:border-purple-900/40 pb-6 min-w-0 w-full max-w-full">
        <div className="min-w-0 w-full sm:w-auto">
          <Link 
            to="/tools" 
            className="inline-flex items-center gap-2 text-sm text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:text-purple-300 font-medium mb-2 transition-colors"
          >
            <ArrowLeft size={16} />
            {language === 'fr' ? 'Retour aux Outils' : language === 'ha' ? 'Koma ga Kayan Aiki' : 'Back to Tools'}
          </Link>
          <h1 className="text-xl sm:text-4xl font-black bg-gradient-to-r from-amber-200 via-purple-300 to-amber-400 bg-clip-text text-transparent flex items-center gap-2 sm:gap-3 break-words">
            <Sparkles className="text-amber-700 dark:text-amber-400 animate-pulse shrink-0" size={28} />
            <span className="break-words">
              {language === 'fr' 
                ? 'Les 12 Charmes de RAJMA' 
                : language === 'ha' 
                ? 'Mawallafa 12 na RAJMA' 
                : 'The 12 Charms of RAJMA'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300/80 mt-1 max-w-2xl break-words">
            {language === 'fr'
              ? 'Sceaux théurgiques, talsams radiaux et khawatim sacrés issus de la tradition des grands maîtres des Asrar. Visualisation géométrique, invocations et propriétés spirituelles.'
              : language === 'ha'
              ? 'Talsam da hatimai na ruhi masu tsada daga littafai na asirin Ilm al-Huruf. Hotuna masu kyau, karanto, da amfaninsu.'
              : 'Theurgic seals, radial talsams, and sacred khawatim from the tradition of Asrar masters. Geometric visualization, invocations, and spiritual virtues.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setLayoutCheckMode(!layoutCheckMode)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              layoutCheckMode
                ? 'bg-amber-500 text-gray-950 border-amber-300 shadow-md'
                : 'bg-gray-900/80 text-purple-800 dark:text-purple-300 border-purple-800/60 hover:text-white hover:bg-gray-800'
            }`}
            title="Activer/Désactiver le Mode Diagnostic de Layout Anti-Débordement"
          >
            <Activity size={14} />
            <span>{language === 'fr' ? 'Diagnostic Layout' : 'Layout Diagnostic'}</span>
          </button>

          <ToolInfoTooltip toolId="khatim" />
        </div>
      </div>

      {/* Layout Check Diagnostic Banner */}
      {layoutCheckMode && (
        <div className={`p-4 rounded-2xl mb-6 border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-w-0 w-full max-w-full shadow-lg ${
          layoutStatus.isFluid 
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' 
            : 'bg-amber-950/90 border-amber-500/50 text-amber-800 dark:text-amber-200'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {layoutStatus.isFluid 
              ? <CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> 
              : <AlertTriangle size={18} className="text-amber-700 dark:text-amber-400 shrink-0" />}
            <div className="min-w-0">
              <span className="font-bold block">
                {language === 'fr' ? 'Contrôle Diagnostic Responsive Layout :' : 'Layout Responsiveness Diagnostic Check:'}
              </span>
              <p className="text-[11px] opacity-90 break-words mt-0.5">
                {layoutStatus.isFluid
                  ? (language === 'fr' ? 'Aucun débordement horizontal. Tous les éléments sont 100% fluides et alignés sur le viewport.' : 'Zero horizontal overflow detected. All elements are 100% fluid and contained.')
                  : (language === 'fr' ? `Attention : ${layoutStatus.overflowingCount} élément(s) dépassent la largeur du viewport.` : `Warning: ${layoutStatus.overflowingCount} element(s) exceed viewport width.`)}
              </p>
            </div>
          </div>
          <div className="font-mono text-[11px] bg-gray-100/50 dark:bg-black/50 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
            Viewport: <strong>{layoutStatus.viewportWidth}px</strong> | ScrollWidth: <strong>{layoutStatus.scrollWidth}px</strong>
          </div>
        </div>
      )}

      {/* Filter Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar min-w-0 w-full max-w-full">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/50'
              : 'bg-white dark:bg-gray-900/80 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700'
          }`}
        >
          {language === 'fr' ? 'Tous les 12 Charmes' : language === 'ha' ? 'Duk Charmes 12' : 'All 12 Charms'}
        </button>

        <button
          onClick={() => setSelectedCategory('fath')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
            selectedCategory === 'fath'
              ? 'bg-amber-600 text-white border-amber-400 shadow-lg shadow-amber-900/50'
              : 'bg-gray-900/80 text-gray-600 dark:text-gray-300 border-gray-800 hover:text-white'
          }`}
        >
          {language === 'fr' ? 'Ouverture & Arziki' : language === 'ha' ? 'Buɗi da Arziki' : 'Opening & Prosperity'}
        </button>

        <button
          onClick={() => setSelectedCategory('hifz')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
            selectedCategory === 'hifz'
              ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-900/50'
              : 'bg-gray-900/80 text-gray-600 dark:text-gray-300 border-gray-800 hover:text-white'
          }`}
        >
          {language === 'fr' ? 'Protection & Bouclier' : language === 'ha' ? 'Kariya da Tsaro' : 'Protection & Shield'}
        </button>

        <button
          onClick={() => setSelectedCategory('mahabbah')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
            selectedCategory === 'mahabbah'
              ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-900/50'
              : 'bg-gray-900/80 text-gray-600 dark:text-gray-300 border-gray-800 hover:text-white'
          }`}
        >
          {language === 'fr' ? 'Amour & Harmonie' : language === 'ha' ? 'Ƙauna da Farin Jini' : 'Love & Attraction'}
        </button>

        <button
          onClick={() => setSelectedCategory('hikmah')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
            selectedCategory === 'hikmah'
              ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-900/50'
              : 'bg-gray-900/80 text-gray-600 dark:text-gray-300 border-gray-800 hover:text-white'
          }`}
        >
          {language === 'fr' ? 'Sagesse & Science' : language === 'ha' ? 'Hikima da Imi' : 'Wisdom & Knowledge'}
        </button>

        <button
          onClick={() => setSelectedCategory('power')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
            selectedCategory === 'power'
              ? 'bg-fuchsia-600 text-white border-fuchsia-400 shadow-lg shadow-fuchsia-900/50'
              : 'bg-gray-900/80 text-gray-600 dark:text-gray-300 border-gray-800 hover:text-white'
          }`}
        >
          {language === 'fr' ? 'Élévation & Victoire' : language === 'ha' ? 'Ɗaukaka da Nasara' : 'Elevation & Victory'}
        </button>

        <button
          onClick={() => setSelectedCategory('favs')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5 ${
            selectedCategory === 'favs'
              ? 'bg-yellow-500 text-gray-950 border-yellow-300 font-bold shadow-lg shadow-yellow-900/50'
              : 'bg-gray-900/80 text-yellow-400 border-gray-800 hover:text-yellow-300'
          }`}
        >
          <Bookmark size={14} className="fill-current" />
          {language === 'fr' 
            ? `Mes Favoris (${savedFavorites.length})` 
            : language === 'ha' 
            ? `Wanda na Ajiye (${savedFavorites.length})` 
            : `Favorites (${savedFavorites.length})`}
        </button>
      </div>

      {/* Main Grid: Left Thumbnails List & Right Selected Interactive Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0 w-full max-w-full overflow-hidden sm:overflow-visible">
        
        {/* Left List of 12 Charms Cards */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1 custom-scrollbar min-w-0 w-full max-w-full">
          {filteredCharms.map((charm) => {
            const isSelected = selectedCharm.id === charm.id;
            const isFav = savedFavorites.includes(charm.id);
            const charmTitle = getCharmTitle(charm, language);
            const charmCategoryName = getCharmCategoryName(charm, language);

            return (
              <motion.div
                key={charm.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedCharm(charm)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden min-w-0 w-full max-w-full ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-900/70 via-gray-900 to-purple-950/80 border-purple-500 shadow-xl shadow-purple-950/60 ring-1 ring-purple-400/50'
                    : 'bg-gray-900/70 hover:bg-gray-900 border-gray-800/80 text-gray-700 dark:text-gray-300 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2 min-w-0 w-full">
                  <div className="flex items-center gap-2 min-w-0 shrink">
                    <span className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-700/60 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-400 shrink-0">
                      #{charm.id}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900/50 text-purple-800 dark:text-purple-300 border border-purple-700/40 truncate max-w-[130px] sm:max-w-none">
                      {charmCategoryName}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(charm.id);
                    }}
                    className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                      isFav 
                        ? 'text-yellow-400 bg-yellow-400/10' 
                        : 'text-gray-500 hover:text-yellow-400 hover:bg-gray-800'
                    }`}
                    title="Sauvegarder dans mes favoris"
                  >
                    <Bookmark size={16} className={isFav ? "fill-current" : ""} />
                  </button>
                </div>

                <div className="flex items-start justify-between gap-2 min-w-0 w-full">
                  <div className="min-w-0 w-full">
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-800 dark:text-purple-300 transition-colors break-words">
                      {charmTitle}
                    </h3>
                    <p className="text-xs text-purple-800 dark:text-purple-300/70 mt-1 font-serif dir-rtl text-right break-words">
                      {charm.arabicTitle}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-purple-900/30 flex items-center justify-between gap-2 text-[11px] text-gray-600 dark:text-gray-300 min-w-0 w-full">
                  <span className="truncate">Poids Abjad: <strong className="text-amber-700 dark:text-amber-400 font-mono">{charm.abjadValue}</strong></span>
                  <span className="truncate">Ange: <strong className="text-purple-800 dark:text-purple-300">{charm.celestialAngel}</strong></span>
                </div>
              </motion.div>
            );
          })}

          {filteredCharms.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {language === 'fr'
                  ? 'Aucun charme ne correspond à ce filtre.'
                  : 'No charms found for this filter.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Active Charm Details & Visualizer */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-900/90 rounded-3xl border border-purple-900/50 p-3.5 sm:p-6 shadow-2xl relative min-w-0 w-full max-w-full overflow-hidden">
          
          {/* Header of Active Charm */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-purple-900/40 pb-4 mb-6 min-w-0 w-full max-w-full">
            <div className="min-w-0 w-full sm:w-auto">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 min-w-0 w-full">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-500/30 truncate max-w-full">
                  {getCharmCategoryName(selectedCharm, language)}
                </span>
                <span className="text-xs text-purple-800 dark:text-purple-300 bg-purple-900/30 px-2.5 py-1 rounded-full border border-purple-700/30 whitespace-nowrap">
                  Abjad : <strong className="text-amber-800 dark:text-amber-300 font-mono">{selectedCharm.abjadValue}</strong>
                </span>
                <span className="text-xs text-amber-800 dark:text-amber-300/80 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-800/40 font-mono truncate max-w-full">
                  {getCharmMonthName(selectedCharm, language)}
                </span>
              </div>
              <h2 className="text-base sm:text-2xl font-black text-white mt-1 break-words">
                {getCharmTitle(selectedCharm, language)}
              </h2>
              <p className="text-sm sm:text-base text-amber-800 dark:text-amber-300 font-serif dir-rtl mt-0.5 break-words">
                {selectedCharm.arabicTitle}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center mt-1 sm:mt-0">
              <button
                onClick={() => playFrequencyTone(selectedCharm.frequencyHz)}
                className={`p-2 sm:p-2.5 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1.5 ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-gray-950 border-amber-300 animate-pulse'
                    : 'bg-purple-900/40 text-purple-900 dark:text-purple-200 border-purple-700/50 hover:bg-purple-800/60'
                }`}
                title="Écouter la fréquence sacrée de ce Sceau"
              >
                {isPlayingAudio ? <VolumeX size={16} /> : <Volume2 size={16} />}
                <span>{selectedCharm.frequencyHz} Hz</span>
              </button>

              <button
                onClick={() => toggleFavorite(selectedCharm.id)}
                className={`p-2 sm:p-2.5 rounded-xl border transition-all ${
                  savedFavorites.includes(selectedCharm.id)
                    ? 'bg-yellow-500 text-gray-950 border-yellow-300'
                    : 'bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-700 hover:text-white'
                }`}
              >
                <Bookmark size={18} className={savedFavorites.includes(selectedCharm.id) ? "fill-current" : ""} />
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex bg-gray-50 dark:bg-gray-950 p-1 rounded-2xl border border-purple-900/40 mb-6 overflow-x-auto no-scrollbar min-w-0 w-full max-w-full gap-1">
            <button
              onClick={() => setActiveTab('visual')}
              className={`shrink-0 sm:flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                activeTab === 'visual'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-white'
              }`}
            >
              <Grid size={14} />
              <span>{language === 'fr' ? 'Sceau Visuel (Khatim)' : language === 'ha' ? 'Hoton Hatimi' : 'Visual Seal'}</span>
            </button>

            <button
              onClick={() => setActiveTab('incantation')}
              className={`shrink-0 sm:flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                activeTab === 'incantation'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-white'
              }`}
            >
              <Feather size={14} />
              <span>{language === 'fr' ? 'Incantation & Rituel' : language === 'ha' ? 'Mani da Karanto' : 'Incantation'}</span>
            </button>

            <button
              onClick={() => setActiveTab('benefits')}
              className={`shrink-0 sm:flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                activeTab === 'benefits'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-white'
              }`}
            >
              <Sparkles size={14} />
              <span>{language === 'fr' ? 'Vertus & Benefits' : language === 'ha' ? 'Amfani da Falala' : 'Virtues'}</span>
            </button>

            <button
              onClick={() => setActiveTab('science')}
              className={`shrink-0 sm:flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                activeTab === 'science'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-white'
              }`}
            >
              <Compass size={14} />
              <span>{language === 'fr' ? 'Sciences & Khuddam' : language === 'ha' ? 'Ilimi da Ruhani' : 'Sciences'}</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`shrink-0 sm:flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-gray-950 font-black shadow-md'
                  : 'text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:text-amber-300'
              }`}
            >
              <Moon size={14} />
              <span>{language === 'fr' ? 'Rituel 30 Jours' : language === 'ha' ? 'Riyada Kwanaki 30' : '30-Day Ritual'}</span>
            </button>
          </div>

          {/* TAB 1: VISUAL KHATIM TALISMAN */}
          {activeTab === 'visual' && (
            <div className="space-y-6 min-w-0 w-full">
              <div className="bg-black p-4 sm:p-6 rounded-3xl border-2 border-purple-500/40 flex flex-col items-center justify-center relative overflow-hidden shadow-inner min-w-0 w-full">
                {/* Background Mystical Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.15)_0,transparent_70%)] pointer-events-none" />

                {/* Seal Clarity Toggle Toolbar */}
                <div className="w-full max-w-[400px] flex items-center justify-between gap-2 mb-2 px-1 z-10">
                  <div className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 font-semibold">
                    <Sparkles size={14} className="text-amber-700 dark:text-amber-400" />
                    <span>{language === 'fr' ? 'Sceau Épuré' : language === 'ha' ? 'Hatimi Mai Tsarki' : 'Pure Clear Seal'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSealInscriptions(!showSealInscriptions)}
                    className="px-3 py-1 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-[11px] font-bold text-purple-900 dark:text-purple-200 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    {showSealInscriptions ? (
                      <>
                        <EyeOff size={13} className="text-amber-700 dark:text-amber-400" />
                        <span>{language === 'fr' ? 'Masquer Textes du Sceau' : 'Hide Seal Text'}</span>
                      </>
                    ) : (
                      <>
                        <Eye size={13} className="text-purple-800 dark:text-purple-300" />
                        <span>{language === 'fr' ? 'Afficher Inscriptions' : 'Show Seal Text'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Vector SVG Sacred Seal Representation with Dynamic Geometry */}
                <svg
                  ref={svgRef}
                  viewBox="0 0 500 500"
                  className="w-full max-w-[280px] sm:max-w-[400px] h-auto drop-shadow-[0_0_25px_rgba(245,158,11,0.35)] my-2 min-w-0"
                >
                  <defs>
                    <radialGradient id={`sealBg_${selectedCharm.id}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#1e0c36" />
                      <stop offset="60%" stopColor="#0d041c" />
                      <stop offset="100%" stopColor="#030008" />
                    </radialGradient>
                    <linearGradient id={`goldGrad_${selectedCharm.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="50%" stopColor={selectedCharm.strokeColor} />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                  </defs>

                  {/* Outer Seal Circle & Double Border */}
                  <circle cx="250" cy="250" r="238" fill={`url(#sealBg_${selectedCharm.id})`} stroke={`url(#goldGrad_${selectedCharm.id})`} strokeWidth="4" />
                  <circle cx="250" cy="250" r="224" fill="none" stroke={selectedCharm.glowColor} strokeWidth="1.5" strokeDasharray="8 4" />

                  {/* Category-driven Geometry Ornaments */}
                  {selectedCharm.category === 'fath' && (
                    <g stroke={`url(#goldGrad_${selectedCharm.id})`} strokeWidth="1.5" opacity="0.75">
                      <rect x="85" y="85" width="330" height="330" fill="none" rx="8" />
                      <rect x="85" y="85" width="330" height="330" fill="none" rx="8" transform="rotate(45 250 250)" />
                    </g>
                  )}

                  {selectedCharm.category === 'hifz' && (
                    <g stroke={`url(#goldGrad_${selectedCharm.id})`} strokeWidth="1.5" opacity="0.75">
                      <polygon points="250,30 420,380 80,380" fill="none" />
                      <polygon points="250,470 420,120 80,120" fill="none" />
                    </g>
                  )}

                  {selectedCharm.category === 'mahabbah' && (
                    <g stroke={`url(#goldGrad_${selectedCharm.id})`} strokeWidth="1.5" opacity="0.75">
                      <circle cx="250" cy="250" r="180" fill="none" stroke="#f43f5e" strokeWidth="1" />
                      <circle cx="250" cy="250" r="195" fill="none" stroke="#fda4af" strokeWidth="1" strokeDasharray="4 4" />
                      <path d="M250,70 Q350,250 250,430 Q150,250 250,70 Z" fill="none" stroke="#fb7185" strokeWidth="1" />
                    </g>
                  )}

                  {selectedCharm.category === 'hikmah' && (
                    <g stroke={`url(#goldGrad_${selectedCharm.id})`} strokeWidth="1" opacity="0.65">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <line
                          key={i}
                          x1="250"
                          y1="250"
                          x2={250 + 210 * Math.cos((i * 30 * Math.PI) / 180)}
                          y2={250 + 210 * Math.sin((i * 30 * Math.PI) / 180)}
                          stroke="#a7f3d0"
                        />
                      ))}
                    </g>
                  )}

                  {(selectedCharm.category === 'power' || selectedCharm.category === 'nur') && (
                    <g stroke={`url(#goldGrad_${selectedCharm.id})`} strokeWidth="1.5" opacity="0.7">
                      <circle cx="250" cy="250" r="160" fill="none" stroke="#e9d5ff" strokeWidth="1.5" />
                      <polygon points="250,40 430,150 430,350 250,460 70,350 70,150" fill="none" />
                    </g>
                  )}

                  {/* Four Corner Sacred Symbols */}
                  <text x="75" y="75" fill="#fef08a" fontSize="24" fontFamily="'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" textAnchor="middle">{selectedCharm.cornerSymbols[0]}</text>
                  <text x="425" y="75" fill="#fef08a" fontSize="24" fontFamily="'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" textAnchor="middle">{selectedCharm.cornerSymbols[1]}</text>
                  <text x="75" y="440" fill="#fef08a" fontSize="24" fontFamily="'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" textAnchor="middle">{selectedCharm.cornerSymbols[2]}</text>
                  <text x="425" y="440" fill="#fef08a" fontSize="24" fontFamily="'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" textAnchor="middle">{selectedCharm.cornerSymbols[3]}</text>

                  {/* Top & Bottom Arch Inscriptions (Shown only when toggled) */}
                  {showSealInscriptions && (
                    <>
                      <text x="250" y="58" fill="#fef08a" fontSize="17" fontWeight="bold" fontFamily="'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" textAnchor="middle">
                        {selectedCharm.celestialAngelAr} • {selectedCharm.terrestrialKhadimAr}
                      </text>
                      <text x="250" y="452" fill="#e9d5ff" fontSize="15" fontWeight="bold" fontFamily="'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" textAnchor="middle">
                        {selectedCharm.talsamFormula}
                      </text>
                    </>
                  )}

                  {/* Central 3x3 Magical Grid */}
                  <g transform="translate(130, 130)">
                    <rect x="0" y="0" width="240" height="240" fill="#090314" stroke={`url(#goldGrad_${selectedCharm.id})`} strokeWidth="3" rx="8" />
                    
                    {/* Horizontal & Vertical Grid Lines */}
                    <line x1="80" y1="0" x2="80" y2="240" stroke="#9333ea" strokeWidth="2" />
                    <line x1="160" y1="0" x2="160" y2="240" stroke="#9333ea" strokeWidth="2" />
                    <line x1="0" y1="80" x2="240" y2="80" stroke="#9333ea" strokeWidth="2" />
                    <line x1="0" y1="160" x2="240" y2="160" stroke="#9333ea" strokeWidth="2" />

                    {/* Cell Values */}
                    {selectedCharm.gridCells.map((row, rIdx) => 
                      row.map((val, cIdx) => (
                        <text
                          key={`${rIdx}-${cIdx}`}
                          x={cIdx * 80 + 40}
                          y={rIdx * 80 + 48}
                          fill="#fef08a"
                          fontSize="22"
                          fontWeight="bold"
                          fontFamily="'Amiri Quran', 'Amiri', 'Traditional Arabic', serif"
                          textAnchor="middle"
                        >
                          {val}
                        </text>
                      ))
                    )}
                  </g>
                </svg>

                <div className="mt-4 text-center space-y-1">
                  <p className="text-xs text-amber-800 dark:text-amber-300/80 font-mono">
                    {language === 'fr' 
                      ? 'Formule Talsam: ' 
                      : 'Talsam Formula: '} 
                    <strong className="text-amber-800 dark:text-amber-200">{selectedCharm.talsamFormula}</strong>
                  </p>
                  <p className="text-[11px] text-purple-800 dark:text-purple-300/70 font-serif dir-rtl">
                    {selectedCharm.celestialAngelAr} • {selectedCharm.terrestrialKhadimAr}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Download PNG & Export Parchment */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleDownloadPNG}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
                >
                  <Download size={16} />
                  <span>{language === 'fr' ? 'Télécharger PNG Haute Résolution' : 'Download High-Res PNG'}</span>
                </button>

                <button
                  onClick={() => setShowParchmentModal(true)}
                  className="px-5 py-2.5 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-purple-900 dark:text-purple-200 border border-purple-700/60 font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <Feather size={16} />
                  <span>{language === 'fr' ? 'Générer Parchemin de Rituel' : 'Generate Ritual Parchment'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INCANTATION & RITUAL */}
          {activeTab === 'incantation' && (
            <div className="space-y-5 min-w-0 w-full">
              <div className="bg-gray-100/60 dark:bg-black/60 p-5 rounded-2xl border border-purple-900/40 text-center min-w-0 w-full">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-2">
                  {language === 'fr' ? 'Verset Sacré & Incantation' : language === 'ha' ? 'Aya da Karanto' : 'Sacred Verse & Incantation'}
                </p>
                <p className="text-xl sm:text-2xl font-serif text-amber-800 dark:text-amber-200 dir-rtl leading-relaxed my-3 break-words">
                  {selectedCharm.verseAr}
                </p>
                <p className="text-xs sm:text-sm text-purple-900 dark:text-purple-200 italic mb-2 break-words">
                  "{selectedCharm.phonetic}"
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300 break-words">
                  {getCharmVerseText(selectedCharm, language)}
                </p>

                <button
                  onClick={() => copyToClipboard(`${selectedCharm.verseAr}\n${selectedCharm.phonetic}`)}
                  className="mt-4 px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-800 dark:text-purple-300 text-xs font-semibold inline-flex items-center gap-2 border border-purple-700/40 transition-colors"
                >
                  {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{isCopied ? (language === 'fr' ? 'Copié dans le presse-papier !' : 'Copied!') : (language === 'fr' ? 'Copier l\'Invocation' : 'Copy Invocation')}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0 w-full">
                <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-800 min-w-0">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold mb-1">
                    <Sun size={16} />
                    <span>{language === 'fr' ? 'Nombre de Répétitions (Riyada)' : language === 'ha' ? 'Adadin Karanto' : 'Repetition Count'}</span>
                  </div>
                  <p className="text-2xl font-black text-white font-mono">
                    {selectedCharm.repCount} <span className="text-xs font-normal text-gray-600 dark:text-gray-300">fois / times</span>
                  </p>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1 break-words">
                    {language === 'fr'
                      ? 'Répétez la formule exacte en un seul enregistrement ou assise.'
                      : 'Repeat the exact formula in a single spiritual session.'}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-800 min-w-0">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold mb-1">
                    <Crown size={16} />
                    <span>{language === 'fr' ? 'Heure & Alignement Propice' : language === 'ha' ? 'Lokaci Mai Kyau' : 'Best Hour & Alignment'}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1 break-words">
                    {getCharmBestHour(selectedCharm, language)}
                  </p>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1 break-words">
                    {language === 'fr' ? 'Encens conseillé : ' : 'Incense: '}
                    <strong className="text-amber-800 dark:text-amber-300">{getCharmIncense(selectedCharm, language)}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VIRTUES & BENEFITS */}
          {activeTab === 'benefits' && (
            <div className="space-y-4 min-w-0 w-full">
              <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} />
                <span>{language === 'fr' ? 'Propriétés Spécifiques du Sceau' : language === 'ha' ? 'Amfanin Wannan Hatimi' : 'Specific Seal Virtues'}</span>
              </h3>

              <div className="space-y-2.5 min-w-0 w-full">
                {getCharmBenefitsList(selectedCharm, language).map((benefit, bIdx) => (
                  <div key={bIdx} className="p-3.5 bg-gray-100/50 dark:bg-black/50 rounded-2xl border border-purple-900/40 flex items-start gap-3 min-w-0 w-full">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {bIdx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed break-words min-w-0 flex-1">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SCIENCES & KHUDDAM */}
          {activeTab === 'science' && (
            <div className="space-y-4 min-w-0 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0 w-full">
                <div className="bg-gray-100/60 dark:bg-black/60 p-4 rounded-2xl border border-purple-900/40 min-w-0">
                  <span className="text-[11px] text-purple-700 dark:text-purple-400 font-semibold block">Ange Céleste (Mala'ika)</span>
                  <p className="text-base font-bold text-white mt-1">{selectedCharm.celestialAngel}</p>
                  <p className="text-sm font-serif text-amber-800 dark:text-amber-300 dir-rtl mt-0.5">{selectedCharm.celestialAngelAr}</p>
                </div>

                <div className="bg-gray-100/60 dark:bg-black/60 p-4 rounded-2xl border border-purple-900/40 min-w-0">
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold block">Serviteur Terrestre (Khadim)</span>
                  <p className="text-base font-bold text-white mt-1">{selectedCharm.terrestrialKhadim}</p>
                  <p className="text-sm font-serif text-amber-800 dark:text-amber-300 dir-rtl mt-0.5">{selectedCharm.terrestrialKhadimAr}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-800 min-w-0">
                <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 mb-2 min-w-0">
                  <span>Élément Canonique : <strong className="text-amber-700 dark:text-amber-400">{getCharmElement(selectedCharm, language)}</strong></span>
                  <span>Fréquence Sacrée : <strong className="text-purple-800 dark:text-purple-300 font-mono">{selectedCharm.frequencyHz} Hz</strong></span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed break-words">
                  {language === 'fr'
                    ? 'Ce Sceau opère par la résonance du système abjadique combiné aux carrés sacrés. L\'invocation de son Ange gouverneur scelle l\'aspiration dans la matrice céleste.'
                    : 'This Seal operates through the resonance of the Abjad system combined with sacred squares. Invoking its governing Angel anchors the petition into the celestial matrix.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: CALENDRIER THÉURGIQUE PERPÉTUEL DES 30 JOURS (12 MOIS HÉGIRIENS) */}
          {activeTab === 'calendar' && (
            <div className="space-y-6 min-w-0 w-full">
              {/* 12-Month Navigation Selector */}
              <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl border border-amber-500/40 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1 min-w-0">
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 truncate">
                    <Layers size={15} className="shrink-0 text-amber-700 dark:text-amber-400" />
                    <span>
                      {language === 'fr' 
                        ? 'Navigation par Mois Hégirien (1 à 12) :' 
                        : language === 'ha' 
                        ? 'Zaɓi Watan Hijra (1 zuwa 12) :' 
                        : 'Select Hijri Month (1 to 12):'}
                    </span>
                  </label>
                  <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-950/90 px-3 py-1 rounded-full border border-amber-700/80 shrink-0 self-start sm:self-auto">
                    {language === 'fr' ? `Mois #${selectedCharm.id} / 12` : language === 'ha' ? `Wata #${selectedCharm.id} / 12` : `Month #${selectedCharm.id} / 12`}
                  </span>
                </div>

                {/* Horizontal Scrollable 12 Month Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar min-w-0 w-full max-w-full">
                  {RAJMA_CHARMS_DATA.map((charm) => {
                    const isSelectedMonth = selectedCharm.id === charm.id;
                    const monthName = getCharmMonthName(charm, language);

                    return (
                      <button
                        key={charm.id}
                        onClick={() => setSelectedCharm(charm)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5 ${
                          isSelectedMonth
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 border-amber-300 shadow-lg scale-105 z-10 font-black'
                            : 'bg-gray-900/90 text-gray-700 dark:text-gray-300 border-gray-800 hover:text-amber-800 dark:text-amber-200 hover:bg-gray-800'
                        }`}
                      >
                        <span className="font-mono text-[10px] opacity-80 px-1.5 py-0.5 rounded bg-gray-100/30 dark:bg-black/30">M#{charm.id}</span>
                        <span>{monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Month Header Banner */}
              <div className="bg-gradient-to-r from-purple-950 via-gray-950 to-amber-950 p-5 rounded-2xl border border-amber-500/40 relative overflow-hidden min-w-0 w-full shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-500/30 inline-block">
                      {getCharmMonthName(selectedCharm, language)}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-2 break-words">
                      {language === 'fr' 
                        ? `Programme des 30 Jours de ${getCharmMonthName(selectedCharm, language)}`
                        : language === 'ha'
                        ? `Tsarin Kwanaki 30 na ${getCharmMonthName(selectedCharm, language)}`
                        : `30-Day Ritual Routine for ${getCharmMonthName(selectedCharm, language)}`}
                    </h3>
                    <p className="text-xs text-purple-900 dark:text-purple-200/90 mt-1 break-words">
                      {getCharmMonthlyFocus(selectedCharm, language)}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-gray-600 dark:text-gray-300 block">
                      {language === 'fr' ? 'Ange Céleste Gardien' : language === 'ha' ? 'Mala\'ikan Kiyayewa' : 'Guardian Celestial Angel'}
                    </span>
                    <span className="text-sm font-bold text-amber-800 dark:text-amber-300">{selectedCharm.celestialAngel}</span>
                    <span className="text-xs text-amber-700 dark:text-amber-400/90 block dir-rtl" style={{ fontFamily: '"Amiri Quran", "Uthmani", "Scheherazade New", "Amiri", "Traditional Arabic", serif', direction: 'rtl' }}>
                      {selectedCharm.celestialAngelAr}
                    </span>
                  </div>
                </div>
              </div>

              {/* Day Selector (1 to 30) */}
              <div className="min-w-0 w-full">
                <div className="flex items-center justify-between mb-2 min-w-0">
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 truncate">
                    <Sun size={14} className="shrink-0" />
                    <span>
                      {language === 'fr' 
                        ? 'Sélectionnez le Jour du Mois Hégirien (1 à 30) :' 
                        : language === 'ha' 
                        ? 'Zaɓi Ranar Watan Hijra (1 zuwa 30) :' 
                        : 'Select Hijri Day of Month (1 to 30):'}
                    </span>
                  </label>
                  <span className="text-xs font-mono font-bold text-purple-800 dark:text-purple-300 bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-800 shrink-0">
                    {language === 'fr' ? `Jour #${selectedDay} / 30` : language === 'ha' ? `Rana #${selectedDay} / 30` : `Day #${selectedDay} / 30`}
                  </span>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-15 gap-1.5 p-2 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-purple-900/40 min-w-0 w-full max-w-full overflow-x-auto">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
                    const isSelected = selectedDay === dayNum;
                    const isFullMoon = dayNum === 14 || dayNum === 15;

                    return (
                      <button
                        key={dayNum}
                        onClick={() => setSelectedDay(dayNum)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all relative shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 text-gray-950 border border-amber-300 shadow-md scale-105 z-10'
                            : isFullMoon
                            ? 'bg-purple-900/60 text-amber-800 dark:text-amber-200 border border-amber-500/40 hover:bg-purple-800'
                            : 'bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-800 hover:text-white hover:bg-gray-800'
                        }`}
                        title={isFullMoon ? (language === 'fr' ? "Pleine Lune (Badr)" : language === 'ha' ? "Cikakken Wata (Badr)" : "Full Moon (Badr)") : `Jour ${dayNum}`}
                      >
                        {dayNum}
                        {isFullMoon && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Day Ritual Cards */}
              {(() => {
                const dailyData = getDailyMysticalData(selectedCharm.id, selectedDay, language);
                const dayFactor = selectedDay === 15 ? 3 : selectedDay === 1 ? 2 : selectedDay === 30 ? 7 : 1;
                const dailyRepCount = dailyData.incantation.repCount * dayFactor;
                const moonPhase = selectedDay <= 3 
                  ? (language === 'fr' ? "Nouvelle Lune (Hilal)" : language === 'ha' ? "Sabuwar Wata (Hilal)" : "New Moon (Hilal)")
                  : selectedDay <= 13 
                  ? (language === 'fr' ? "Lune Croissante" : language === 'ha' ? "Girma Wata" : "Waxing Moon")
                  : selectedDay <= 16 
                  ? (language === 'fr' ? "Pleine Lune (Badr)" : language === 'ha' ? "Cikakken Wata (Badr)" : "Full Moon (Badr)")
                  : selectedDay <= 27 
                  ? (language === 'fr' ? "Lune Décroissante" : language === 'ha' ? "Raguwar Wata" : "Waning Moon")
                  : (language === 'fr' ? "Fin de Cycle (Mahaq)" : language === 'ha' ? "Karshen Wata (Mahaq)" : "Waning Crescent (Mahaq)");
                const dayHuruf = ["ا", "ب", "ج", "د", "هـ", "و", "ز", "ح", "ط", "ي", "ك", "ل", "م", "ن", "س", "ع", "ف", "ص", "ق", "ر", "ش", "ت", "ث", "خ", "ذ", "ض", "ظ", "غ", "ر", "ج"][(selectedDay - 1) % 28];

                const steps = language === 'fr' 
                  ? dailyData.preparation.stepsFr 
                  : language === 'ha' 
                  ? dailyData.preparation.stepsHa 
                  : dailyData.preparation.stepsEn;

                const sealTitle = language === 'fr' 
                  ? dailyData.seal.titleFr 
                  : language === 'ha' 
                  ? dailyData.seal.titleHa 
                  : dailyData.seal.titleEn;

                const plantName = language === 'fr' 
                  ? dailyData.plant.nameFr 
                  : language === 'ha' 
                  ? dailyData.plant.nameHa 
                  : dailyData.plant.nameEn;

                const plantUsage = language === 'fr' 
                  ? dailyData.plant.usageFr 
                  : language === 'ha' 
                  ? dailyData.plant.usageHa 
                  : dailyData.plant.usageEn;

                const plantExtraction = language === 'fr' 
                  ? dailyData.plant.extractionFr 
                  : language === 'ha' 
                  ? dailyData.plant.extractionHa 
                  : dailyData.plant.extractionEn;

                const jinnTitle = language === 'fr' 
                  ? dailyData.jinn.titleFr 
                  : language === 'ha' 
                  ? dailyData.jinn.titleHa 
                  : dailyData.jinn.titleEn;

                const jinnRole = language === 'fr' 
                  ? dailyData.jinn.roleFr 
                  : language === 'ha' 
                  ? dailyData.jinn.roleHa 
                  : dailyData.jinn.roleEn;

                const incense = language === 'fr' 
                  ? dailyData.preparation.incenseFr 
                  : language === 'ha' 
                  ? dailyData.preparation.incenseHa 
                  : dailyData.preparation.incenseEn;

                const bestHour = language === 'fr' 
                  ? dailyData.preparation.bestHourFr 
                  : language === 'ha' 
                  ? dailyData.preparation.bestHourHa 
                  : dailyData.preparation.bestHourEn;

                return (
                  <div ref={dailySealRef} className="space-y-6 min-w-0 w-full p-2 bg-gray-50 dark:bg-gray-950/40 rounded-2xl">
                    {/* Top Stats Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0 w-full">
                      <div className="bg-gray-100/80 dark:bg-black/80 p-4 rounded-2xl border border-amber-500/30 min-w-0">
                        <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold block uppercase">
                          {language === 'fr' ? `Répétition du Jour #${selectedDay}` : language === 'ha' ? `Maimaitawa na Rana #${selectedDay}` : `Daily Count #${selectedDay}`}
                        </span>
                        <p className="text-xl font-black text-amber-800 dark:text-amber-200 font-mono mt-1">
                          {dailyRepCount} <span className="text-xs font-normal text-gray-600 dark:text-gray-300">{language === 'fr' ? 'fois' : language === 'ha' ? 'sau' : 'times'}</span>
                        </p>
                        <p className="text-[10px] text-gray-600 dark:text-gray-300 mt-1 break-words">
                          {selectedDay === 15 
                            ? (language === 'fr' ? "Multiplier x3 de la Pleine Lune" : language === 'ha' ? "Cikakken Wata ya rika x3" : "Full Moon x3 Multiplier")
                            : selectedDay === 30 
                            ? (language === 'fr' ? "Sceau final du mois (x7)" : language === 'ha' ? "Karshen wata ya rika x7" : "Month End Seal x7")
                            : (language === 'fr' ? "Nombre canonique du jour" : language === 'ha' ? "Adadin rana mai tsarki" : "Canonical daily count")}
                        </p>
                      </div>

                      <div className="bg-gray-100/80 dark:bg-black/80 p-4 rounded-2xl border border-purple-500/30 min-w-0">
                        <span className="text-[11px] text-purple-700 dark:text-purple-400 font-semibold block uppercase">
                          {language === 'fr' ? 'Phase Lunaire' : language === 'ha' ? 'Yanayin Wata' : 'Moon Phase'}
                        </span>
                        <p className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                          <Moon size={16} className="text-purple-800 dark:text-purple-300 shrink-0" />
                          <span>{moonPhase}</span>
                        </p>
                        <p className="text-[10px] text-gray-600 dark:text-gray-300 mt-1 break-words">
                          {language === 'fr' ? 'Alignement des marées psychiques' : language === 'ha' ? 'Dai-daitawan ruhani' : 'Psychic alignment'}
                        </p>
                      </div>

                      <div className="bg-gray-100/80 dark:bg-black/80 p-4 rounded-2xl border border-emerald-500/30 min-w-0">
                        <span className="text-[11px] text-emerald-400 font-semibold block uppercase">
                          {language === 'fr' ? 'Lettre Sacrée' : language === 'ha' ? 'Harakin Rana' : 'Sacred Letter'}
                        </span>
                        <p className="text-2xl font-black text-emerald-300 font-quran mt-1 dir-rtl" style={{ fontFamily: '"Amiri Quran", "Uthmani", "Scheherazade New", "Amiri", "Traditional Arabic", serif', direction: 'rtl' }}>
                          حَرْفُ ({dayHuruf})
                        </p>
                        <p className="text-[10px] text-gray-600 dark:text-gray-300 mt-1 break-words">
                          {language === 'fr' ? 'Clé d\'activation du jour' : language === 'ha' ? 'Makullin budi na rana' : 'Daily activation key'}
                        </p>
                      </div>
                    </div>

                    {/* SECTION 1: SPECIFIC DAILY KHATIM / SCEAU */}
                    <div className="bg-gray-100/70 dark:bg-black/70 p-5 rounded-2xl border border-amber-500/40 space-y-4 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3 min-w-0">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                            {language === 'fr' ? `Sceau Spécifique du Jour #${selectedDay}` : language === 'ha' ? `Hatimin Ranar #${selectedDay}` : `Specific Daily Seal #${selectedDay}`}
                          </span>
                          <h4 className="text-base sm:text-lg font-bold text-amber-800 dark:text-amber-200 mt-1 break-words">
                            {sealTitle}
                          </h4>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-950/80 px-3 py-1 rounded-lg border border-amber-700/50 block">
                            {dailyData.seal.talsamCode}
                          </span>
                          <span className="text-[10px] text-gray-600 dark:text-gray-300 block mt-0.5">Poids Abjad : {dailyData.seal.abjadValue}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center min-w-0 w-full">
                        {/* Daily Magic Square Visual Render */}
                        <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-purple-900/50 flex flex-col items-center justify-center">
                          <span className="text-xs font-bold text-amber-800 dark:text-amber-300 font-quran dir-rtl mb-2" style={{ fontFamily: '"Amiri Quran", "Uthmani", "Scheherazade New", "Amiri", "Traditional Arabic", serif', direction: 'rtl' }}>{dailyData.seal.titleAr}</span>
                          <div className="grid grid-cols-3 gap-1 bg-amber-900/30 p-2 rounded-lg border border-amber-500/40 w-full max-w-[240px]">
                            {dailyData.seal.grid.map((row, rIdx) => (
                              <React.Fragment key={rIdx}>
                                {row.map((cell, cIdx) => (
                                  <div
                                    key={cIdx}
                                    className="bg-gray-100/90 dark:bg-black/90 text-amber-800 dark:text-amber-200 font-mono font-bold text-center py-2.5 text-sm rounded border border-amber-500/30 shadow-inner"
                                  >
                                    {cell}
                                  </div>
                                ))}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        {/* Seal Description */}
                        <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300 min-w-0">
                          <p className="leading-relaxed break-words">
                            {language === 'fr'
                              ? `Ce Carré Sacré (Khatim) du Jour #${selectedDay} concentre la matrice vibratoire du mois de ${dailyData.monthNameFr}. Il est conçu pour être tracé à l'encre de za'faran pendant l'heure bénie.`
                              : language === 'ha'
                              ? `Wannan Hatimi na Ranar #${selectedDay} yana tattara karfin ruhaniya na watan ${dailyData.monthNameHa}. Ana rubuta shi da tawadar zafaran a sa'a mai kyau.`
                              : `This Sacred Square (Khatim) for Day #${selectedDay} encapsulates the vibratory matrix of ${dailyData.monthNameEn}. It is designed to be traced in saffron ink during the auspicious hour.`}
                          </p>
                          <div className="p-2.5 bg-purple-950/40 rounded-lg border border-purple-800/40 text-[11px] text-purple-900 dark:text-purple-200">
                            <strong>{language === 'fr' ? 'Consécration :' : language === 'ha' ? 'Tsarkakewa :' : 'Consecration:'}</strong> {incense} • {bestHour}
                          </div>
                        </div>
                      </div>

                      {/* Daily Seal Action Buttons (Download PNG, Generate Daily Parchment & Launch Screen Widget) */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-amber-500/20 w-full">
                        <button
                          onClick={handleDownloadDailySealPNG}
                          disabled={isExportingDailySeal}
                          className="w-full sm:w-auto flex-1 py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Download size={14} />
                          <span>
                            {isExportingDailySeal
                              ? (language === 'fr' ? 'Génération...' : 'Downloading...')
                              : (language === 'fr' ? 'Télécharger PNG' : language === 'ha' ? 'Sauke PNG' : 'Download PNG')}
                          </span>
                        </button>

                        <button
                          onClick={() => setShowDailyParchmentModal(true)}
                          className="w-full sm:w-auto flex-1 py-2.5 px-3 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg border border-purple-400/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Feather size={14} className="text-amber-800 dark:text-amber-300" />
                          <span>
                            {language === 'fr' 
                              ? 'Parchemin du Jour' 
                              : language === 'ha' 
                              ? 'Takardan Asiri' 
                              : 'Daily Parchment'}
                          </span>
                        </button>

                        <button
                          onClick={() => setShowExternalWidgetModal(true)}
                          className="w-full sm:w-auto flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg border border-emerald-400/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <Zap size={14} className="text-amber-800 dark:text-amber-300 animate-pulse" />
                          <span>
                            {language === 'fr' 
                              ? 'Widget Écran (PIP & Notif)' 
                              : language === 'ha' 
                              ? 'Rikitan Allo na Waje' 
                              : 'Screen Widget (PIP)'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* SECTION 2: JINN & KHADIM GOUVERNEUR DU JOUR */}
                    <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-800 space-y-3 min-w-0 w-full">
                      <div className="flex items-center justify-between border-b border-gray-800 pb-2.5 min-w-0">
                        <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                          <Crown size={15} />
                          <span>{language === 'fr' ? 'Khadim & Jinn Gouverneur du Jour' : language === 'ha' ? 'Sarkin Aljanu / Khadim na Ranar' : 'Governing Jinn & Khadim of the Day'}</span>
                        </h4>
                        <span className="text-sm font-quran font-bold text-amber-800 dark:text-amber-300 dir-rtl" style={{ fontFamily: '"Amiri Quran", "Uthmani", "Scheherazade New", "Amiri", "Traditional Arabic", serif', direction: 'rtl' }}>{dailyData.jinn.nameAr}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 w-full">
                        <div className="p-3 bg-gray-100/60 dark:bg-black/60 rounded-xl border border-purple-900/40 min-w-0">
                          <span className="text-[10px] text-purple-700 dark:text-purple-400 block font-semibold">{language === 'fr' ? 'Nom Translitéré :' : language === 'ha' ? 'Sunan Garfani :' : 'Phonetic Name:'}</span>
                          <span className="text-sm font-bold text-white block mt-0.5">{dailyData.jinn.namePhonetic}</span>
                          <span className="text-xs text-amber-800 dark:text-amber-300 block mt-1 font-semibold">{jinnTitle}</span>
                        </div>
                        <div className="p-3 bg-gray-100/60 dark:bg-black/60 rounded-xl border border-purple-900/40 min-w-0">
                          <span className="text-[10px] text-purple-700 dark:text-purple-400 block font-semibold">{language === 'fr' ? 'Attribution & Rôle Spirituel :' : language === 'ha' ? 'Matsayi da Aikin Ruhani :' : 'Spiritual Function:'}</span>
                          <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed break-words">{jinnRole}</p>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: PLANTE MYSTIQUE & BOTANIQUE DU JOUR */}
                    <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-800 space-y-3 min-w-0 w-full">
                      <div className="flex items-center justify-between border-b border-gray-800 pb-2.5 min-w-0">
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                          <Feather size={15} />
                          <span>{language === 'fr' ? 'Plante Mystique & Éléments Botaniques du Jour' : language === 'ha' ? 'Bishiya & Ganyen Magani na Ranar' : 'Mystical Plant & Botanicals of the Day'}</span>
                        </h4>
                        <span className="text-sm font-quran font-bold text-emerald-300 dir-rtl" style={{ fontFamily: '"Amiri Quran", "Uthmani", "Scheherazade New", "Amiri", "Traditional Arabic", serif', direction: 'rtl' }}>{dailyData.plant.nameAr}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 w-full">
                        <div className="p-3 bg-gray-100/60 dark:bg-black/60 rounded-xl border border-emerald-900/40 min-w-0">
                          <span className="text-[10px] text-emerald-400 block font-semibold">{language === 'fr' ? 'Nom de la Plante :' : language === 'ha' ? 'Sunan Itace / Ganye :' : 'Plant Name:'}</span>
                          <span className="text-sm font-bold text-white block mt-0.5">{plantName}</span>
                          <span className="text-xs text-gray-700 dark:text-gray-300 block mt-1 leading-relaxed break-words">{plantUsage}</span>
                        </div>
                        <div className="p-3 bg-gray-100/60 dark:bg-black/60 rounded-xl border border-emerald-900/40 min-w-0">
                          <span className="text-[10px] text-emerald-400 block font-semibold">{language === 'fr' ? 'Méthode de Préparation Botanique :' : language === 'ha' ? 'Hanyar Shirya Maganin :' : 'Botanical Extraction Protocol:'}</span>
                          <p className="text-xs text-emerald-200 mt-1 leading-relaxed break-words">{plantExtraction}</p>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: AZIMA & INCANTATION SACRÉE DU JOUR */}
                    <div className="bg-gray-100/80 dark:bg-black/80 p-5 rounded-2xl border border-purple-900/60 space-y-3 text-center min-w-0 w-full">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 dark:text-purple-400 bg-purple-500/10 px-3 py-0.5 rounded-full border border-purple-500/30">
                        {language === 'fr' ? 'Azima Sacrée & Incantation du Jour' : language === 'ha' ? 'Azima da Maimaitawa na Ranar' : 'Sacred Daily Azima & Incantation'}
                      </span>

                      <p className="text-lg sm:text-2xl font-quran text-amber-800 dark:text-amber-200 dir-rtl leading-relaxed my-2 break-words" style={{ fontFamily: '"Amiri Quran", "Uthmani", "Scheherazade New", "Amiri", "Traditional Arabic", serif', direction: 'rtl' }}>
                        {dailyData.incantation.azimaAr}
                      </p>

                      <p className="text-xs sm:text-sm text-purple-900 dark:text-purple-200 italic break-words">
                        "{dailyData.incantation.phonetic}"
                      </p>

                      <p className="text-xs text-gray-700 dark:text-gray-300 break-words">
                        {language === 'fr' ? dailyData.incantation.meaningFr : language === 'ha' ? dailyData.incantation.meaningHa : dailyData.incantation.meaningEn}
                      </p>

                      <div className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold text-amber-800 dark:text-amber-300">
                        {language === 'fr' ? `Répéter ${dailyRepCount} fois` : language === 'ha' ? `Maimaita sau ${dailyRepCount}` : `Recite ${dailyRepCount} times`}
                      </div>
                    </div>

                    {/* SECTION 5: PROTOCOLE PRÉPARATION THÉURGIQUE PAS-À-PAS */}
                    <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-800 space-y-3 min-w-0 w-full">
                      <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles size={14} />
                        <span>{language === 'fr' ? 'Protocole Pas-à-Pas de Préparation Théurgique' : language === 'ha' ? 'Hanyar Gudanar da Aiki Mataki-Mataki' : 'Step-by-Step Theurgic Preparation Protocol'}</span>
                      </h4>

                      <div className="space-y-2.5">
                        {steps.map((stepText, sIdx) => (
                          <div key={sIdx} className="p-3 bg-gray-100/50 dark:bg-black/50 rounded-xl border border-purple-900/30 flex items-start gap-3 min-w-0 w-full">
                            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              {sIdx + 1}
                            </div>
                            <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed break-words min-w-0 flex-1">
                              {stepText}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

        </div>
      </div>

      {/* Parchment Exporter Modal */}
      {showParchmentModal && (
        <ParchmentExporterModal
          isOpen={showParchmentModal}
          onClose={() => setShowParchmentModal(false)}
          title={getCharmTitle(selectedCharm, language)}
          subtitle={`${selectedCharm.arabicTitle} • ${getCharmMonthName(selectedCharm, language)}`}
          abjadWeight={selectedCharm.abjadValue}
          content={
            <div className="space-y-4 text-center min-w-0 w-full max-w-full font-serif">
              {/* SACRED SEAL ENCLOSURE (SCEAU DU PARCHEMIN) */}
              <div className="p-3 sm:p-4 bg-amber-950/90 rounded-2xl border-2 border-amber-800/80 shadow-md relative overflow-hidden my-2 flex flex-col items-center justify-center">
                {/* Khatim Title */}
                <div className="mb-2 text-center">
                  <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-amber-800 dark:text-amber-300/80 block">
                    {language === 'fr' ? 'Khatim Sacré & Wafq Mystique' : language === 'ha' ? 'Hatimi da Wafq na Asiri' : 'Sacred Khatim & Mystical Wafq'}
                  </span>
                  <p className="text-lg sm:text-xl font-black font-serif dir-rtl text-amber-800 dark:text-amber-200 mt-0.5 break-words">
                    {selectedCharm.arabicTitle}
                  </p>
                </div>

                {/* SVG Geometric Khatim Seal matching the visual screen */}
                <svg
                  viewBox="0 0 500 500"
                  className="w-full max-w-[280px] sm:max-w-[340px] h-auto my-1 drop-shadow-md"
                >
                  <defs>
                    <radialGradient id={`parchmentBg_${selectedCharm.id}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#220b38" />
                      <stop offset="70%" stopColor="#11041f" />
                      <stop offset="100%" stopColor="#080112" />
                    </radialGradient>
                    <linearGradient id={`parchmentGold_${selectedCharm.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="50%" stopColor={selectedCharm.strokeColor} />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                  </defs>

                  {/* Outer Seal Circle & Double Border */}
                  <circle cx="250" cy="250" r="238" fill={`url(#parchmentBg_${selectedCharm.id})`} stroke={`url(#parchmentGold_${selectedCharm.id})`} strokeWidth="4" />
                  <circle cx="250" cy="250" r="224" fill="none" stroke={selectedCharm.glowColor} strokeWidth="1.5" strokeDasharray="8 4" />

                  {/* Category-driven Geometry Ornaments */}
                  {selectedCharm.category === 'fath' && (
                    <g stroke={`url(#parchmentGold_${selectedCharm.id})`} strokeWidth="1.5" opacity="0.75">
                      <rect x="85" y="85" width="330" height="330" fill="none" rx="8" />
                      <rect x="85" y="85" width="330" height="330" fill="none" rx="8" transform="rotate(45 250 250)" />
                    </g>
                  )}

                  {selectedCharm.category === 'hifz' && (
                    <g stroke={`url(#parchmentGold_${selectedCharm.id})`} strokeWidth="1.5" opacity="0.75">
                      <polygon points="250,30 420,380 80,380" fill="none" />
                      <polygon points="250,470 420,120 80,120" fill="none" />
                    </g>
                  )}

                  {selectedCharm.category === 'mahabbah' && (
                    <g stroke={`url(#parchmentGold_${selectedCharm.id})`} strokeWidth="1.5" opacity="0.75">
                      <circle cx="250" cy="250" r="180" fill="none" stroke="#f43f5e" strokeWidth="1" />
                      <circle cx="250" cy="250" r="195" fill="none" stroke="#fda4af" strokeWidth="1" strokeDasharray="4 4" />
                      <path d="M250,70 Q350,250 250,430 Q150,250 250,70 Z" fill="none" stroke="#fb7185" strokeWidth="1" />
                    </g>
                  )}

                  {selectedCharm.category === 'hikmah' && (
                    <g stroke={`url(#parchmentGold_${selectedCharm.id})`} strokeWidth="1" opacity="0.65">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <line
                          key={i}
                          x1="250"
                          y1="250"
                          x2={250 + 210 * Math.cos((i * 30 * Math.PI) / 180)}
                          y2={250 + 210 * Math.sin((i * 30 * Math.PI) / 180)}
                          stroke="#a7f3d0"
                        />
                      ))}
                    </g>
                  )}

                  {(selectedCharm.category === 'power' || selectedCharm.category === 'nur') && (
                    <g stroke={`url(#parchmentGold_${selectedCharm.id})`} strokeWidth="1.5" opacity="0.7">
                      <circle cx="250" cy="250" r="160" fill="none" stroke="#e9d5ff" strokeWidth="1.5" />
                      <polygon points="250,40 430,150 430,350 250,460 70,350 70,150" fill="none" />
                    </g>
                  )}

                  {/* Four Corner Sacred Symbols */}
                  <text x="75" y="75" fill="#fef08a" fontSize="24" fontFamily="'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" textAnchor="middle">{selectedCharm.cornerSymbols[0]}</text>
                  <text x="425" y="75" fill="#fef08a" fontSize="24" fontFamily="'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" textAnchor="middle">{selectedCharm.cornerSymbols[1]}</text>
                  <text x="75" y="440" fill="#fef08a" fontSize="24" fontFamily="'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" textAnchor="middle">{selectedCharm.cornerSymbols[2]}</text>
                  <text x="425" y="440" fill="#fef08a" fontSize="24" fontFamily="'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" textAnchor="middle">{selectedCharm.cornerSymbols[3]}</text>

                  {/* Top & Bottom Arch Inscriptions (if showSealInscriptions) */}
                  {showSealInscriptions && (
                    <>
                      <text x="250" y="58" fill="#fef08a" fontSize="17" fontWeight="bold" fontFamily="'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" textAnchor="middle">
                        {selectedCharm.celestialAngelAr} • {selectedCharm.terrestrialKhadimAr}
                      </text>
                      <text x="250" y="452" fill="#e9d5ff" fontSize="15" fontWeight="bold" fontFamily="'Amiri Quran', 'Amiri', 'Traditional Arabic', serif" textAnchor="middle">
                        {selectedCharm.talsamFormula}
                      </text>
                    </>
                  )}

                  {/* Central 3x3 Magical Grid */}
                  <g transform="translate(130, 130)">
                    <rect x="0" y="0" width="240" height="240" fill="#090314" stroke={`url(#parchmentGold_${selectedCharm.id})`} strokeWidth="3" rx="8" />
                    
                    <line x1="80" y1="0" x2="80" y2="240" stroke="#9333ea" strokeWidth="2" />
                    <line x1="160" y1="0" x2="160" y2="240" stroke="#9333ea" strokeWidth="2" />
                    <line x1="0" y1="80" x2="240" y2="80" stroke="#9333ea" strokeWidth="2" />
                    <line x1="0" y1="160" x2="240" y2="160" stroke="#9333ea" strokeWidth="2" />

                    {selectedCharm.gridCells.map((row, rIdx) =>
                      row.map((cell, cIdx) => (
                        <text
                          key={`${rIdx}-${cIdx}`}
                          x={cIdx * 80 + 40}
                          y={rIdx * 80 + 50}
                          fill="#fef08a"
                          fontSize="22"
                          fontWeight="bold"
                          fontFamily="'Amiri Quran', 'Amiri', 'Traditional Arabic', serif"
                          textAnchor="middle"
                        >
                          {cell}
                        </text>
                      ))
                    )}
                  </g>
                </svg>

                {/* Talsam Sacré Ligaturé / Sans Séparation des Lettres */}
                <div className="mt-2 pt-2 border-t border-amber-700/50 text-center w-full">
                  <span className="text-[10px] font-sans font-bold text-amber-800 dark:text-amber-300 uppercase tracking-widest block mb-1">
                    {language === 'fr' ? 'Talsam Sacré Ligaturé' : language === 'ha' ? 'Talsam na Asiri' : 'Sacred Connected Talsam'}
                  </span>
                  <div className="inline-block bg-amber-900/80 px-4 py-1 rounded-lg border border-amber-700/60 shadow-sm">
                    <span className="text-base sm:text-lg font-serif font-black text-amber-800 dark:text-amber-200 dir-rtl whitespace-nowrap tracking-normal">
                      {selectedCharm.talsamConnectedAr || selectedCharm.talsamFormula.replace(/\s+/g, '')}
                    </span>
                  </div>
                </div>
              </div>

              {/* SACRED QURANIC VERSE */}
              <div className="p-3.5 bg-amber-100/80 rounded-xl border border-amber-400/60 space-y-1">
                <span className="text-[10px] font-sans font-bold text-amber-900 uppercase tracking-wider block">
                  {language === 'fr' ? 'Verset Coranique d\'Évocation' : language === 'ha' ? 'Ayar Kur\'ani ta Aiki' : 'Quranic Evocation Verse'}
                </span>
                <p className="text-base sm:text-lg font-serif font-bold dir-rtl text-amber-950 leading-relaxed break-words">
                  {selectedCharm.verseAr}
                </p>
                <p className="text-xs italic text-amber-900 font-sans break-words">
                  "{selectedCharm.phonetic}"
                </p>
              </div>

              {/* SPIRITUAL CORRESPONDENCES & ENTITIES (ANGEL & JINN WITH TASHKEEL) */}
              <div className="p-3 bg-amber-200/60 rounded-xl border border-amber-500/50 text-left font-sans text-xs text-amber-950 space-y-2">
                <div className="font-bold border-b border-amber-800/30 pb-1 text-center text-amber-900 text-[11px] uppercase tracking-wider">
                  {language === 'fr' ? 'Serviteurs Sacrés & Timing Théurgique' : language === 'ha' ? 'Mala\'ika da Aljani na Aiki' : 'Sacred Servants & Timing'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {/* Celestial Angel with Tashkeel */}
                  <div className="p-2 bg-amber-100/90 rounded-lg border border-amber-300">
                    <span className="text-amber-900 text-[10px] block font-semibold">
                      {language === 'fr' ? '• Ange Céleste (مع التشكيل) :' : language === 'ha' ? '• Mala\'ika :' : '• Celestial Angel:'}
                    </span>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <span className="font-serif font-black text-amber-950 dir-rtl text-sm">
                        {selectedCharm.celestialAngelAr}
                      </span>
                      <span className="text-amber-900 text-[11px] font-medium">
                        ({selectedCharm.celestialAngel})
                      </span>
                    </div>
                  </div>

                  {/* Terrestrial Khadim / Jinn with Tashkeel */}
                  <div className="p-2 bg-amber-100/90 rounded-lg border border-amber-300">
                    <span className="text-amber-900 text-[10px] block font-semibold">
                      {language === 'fr' ? '• Khādim / Jinn du Jour (مع التشكيل) :' : language === 'ha' ? '• Khadim / Aljani :' : '• Governing Khadim / Jinn:'}
                    </span>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <span className="font-serif font-black text-amber-950 dir-rtl text-sm">
                        {selectedCharm.terrestrialKhadimAr}
                      </span>
                      <span className="text-amber-900 text-[11px] font-medium">
                        ({selectedCharm.terrestrialKhadim})
                      </span>
                    </div>
                  </div>

                  {/* Repetitions */}
                  <div className="p-2 bg-amber-100/90 rounded-lg border border-amber-300">
                    <span className="text-amber-900 text-[10px] block font-semibold">
                      {language === 'fr' ? '• Répétitions Zikr :' : language === 'ha' ? '• Maimaitawa :' : '• Zikr Recitations:'}
                    </span>
                    <span className="font-bold text-amber-950 mt-0.5 block">
                      {selectedCharm.repCount}x <span className="text-[10px] text-amber-800">(Poids: {selectedCharm.abjadValue})</span>
                    </span>
                  </div>

                  {/* Incense & Timing */}
                  <div className="p-2 bg-amber-100/90 rounded-lg border border-amber-300">
                    <span className="text-amber-900 text-[10px] block font-semibold">
                      {language === 'fr' ? '• Encens Propriétaire :' : language === 'ha' ? '• Turare :' : '• Incense:'}
                    </span>
                    <span className="font-medium text-amber-950 mt-0.5 block truncate">
                      {getCharmIncense(selectedCharm, language)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      )}

      {/* Daily Parchment Exporter Modal */}
      {showDailyParchmentModal && (() => {
        const dailyData = getDailyMysticalData(selectedCharm.id, selectedDay, language);
        const dayFactor = selectedDay === 15 ? 3 : selectedDay === 1 ? 2 : selectedDay === 30 ? 7 : 1;
        const dailyRepCount = dailyData.incantation.repCount * dayFactor;
        const sealTitle = language === 'fr' 
          ? dailyData.seal.titleFr 
          : language === 'ha' 
          ? dailyData.seal.titleHa 
          : dailyData.seal.titleEn;

        const plantName = language === 'fr' 
          ? dailyData.plant.nameFr 
          : language === 'ha' 
          ? dailyData.plant.nameHa 
          : dailyData.plant.nameEn;

        const plantUsage = language === 'fr' 
          ? dailyData.plant.usageFr 
          : language === 'ha' 
          ? dailyData.plant.usageHa 
          : dailyData.plant.usageEn;

        const jinnTitle = language === 'fr' 
          ? dailyData.jinn.titleFr 
          : language === 'ha' 
          ? dailyData.jinn.titleHa 
          : dailyData.jinn.titleEn;

        const jinnRole = language === 'fr' 
          ? dailyData.jinn.roleFr 
          : language === 'ha' 
          ? dailyData.jinn.roleHa 
          : dailyData.jinn.roleEn;

        const incense = language === 'fr' 
          ? dailyData.preparation.incenseFr 
          : language === 'ha' 
          ? dailyData.preparation.incenseHa 
          : dailyData.preparation.incenseEn;

        const bestHour = language === 'fr' 
          ? dailyData.preparation.bestHourFr 
          : language === 'ha' 
          ? dailyData.preparation.bestHourHa 
          : dailyData.preparation.bestHourEn;

        return (
          <ParchmentExporterModal
            isOpen={showDailyParchmentModal}
            onClose={() => setShowDailyParchmentModal(false)}
            title={language === 'fr' ? `PARCHEMIN DU JOUR #${selectedDay}` : language === 'ha' ? `TAKARDAN RANAR #${selectedDay}` : `DAILY PARCHMENT #${selectedDay}`}
            subtitle={`${sealTitle} • ${dailyData.seal.titleAr}`}
            abjadWeight={dailyData.seal.abjadValue}
            content={
              <div className="space-y-4 text-center min-w-0 w-full max-w-full font-serif">
                {/* DAILY KHATIM ENCLOSURE */}
                <div className="p-3 sm:p-4 bg-amber-950/90 rounded-2xl border-2 border-amber-800/80 shadow-md relative overflow-hidden my-2 flex flex-col items-center justify-center text-amber-100">
                  <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-amber-800 dark:text-amber-300 block mb-1">
                    {language === 'fr' ? `Khatim Sacré du Jour #${selectedDay}` : language === 'ha' ? `Hatimin Ranar #${selectedDay}` : `Sacred Daily Khatim #${selectedDay}`}
                  </span>
                  <p className="text-lg font-black font-serif dir-rtl text-amber-800 dark:text-amber-200 mb-2">
                    {dailyData.seal.titleAr}
                  </p>

                  {/* Daily Grid 3x3 */}
                  <div className="w-full max-w-[250px] mx-auto my-2 border-2 border-amber-500/80 rounded-lg overflow-hidden bg-zinc-950 shadow-md">
                    <table className="w-full border-collapse text-center">
                      <tbody>
                        {dailyData.seal.grid.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-amber-800/60 last:border-b-0">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="border-r border-amber-800/60 last:border-r-0 py-2 px-1 text-sm sm:text-base font-bold font-serif text-amber-800 dark:text-amber-200 bg-amber-950/40">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-2 text-xs font-mono text-amber-800 dark:text-amber-300 bg-amber-900/60 px-3 py-1 rounded border border-amber-700/60">
                    Code Talsam : <strong>{dailyData.seal.talsamCode}</strong> | Zimām : <strong>{dailyData.seal.abjadValue}</strong>
                  </div>
                </div>

                {/* KHADIM & JINN GOVERNOR DETAILS */}
                <div className="p-3 bg-amber-900/20 rounded-xl border border-amber-700/40 text-left text-xs space-y-1">
                  <div className="font-bold text-amber-900 text-sm flex items-center justify-between border-b border-amber-700/30 pb-1">
                    <span>👑 Khadim & Jinn Gouverneur :</span>
                    <span className="font-serif text-base dir-rtl text-amber-950">{dailyData.jinn.nameAr}</span>
                  </div>
                  <p className="text-amber-950 font-semibold">{dailyData.jinn.namePhonetic} ({jinnTitle})</p>
                  <p className="text-amber-900/90 italic">{jinnRole}</p>
                </div>

                {/* AZIMA & INCANTATION */}
                <div className="p-3 bg-amber-900/20 rounded-xl border border-amber-700/40 text-center text-xs space-y-1.5">
                  <span className="font-bold text-amber-950 block uppercase text-[10px] tracking-wider">
                    {language === 'fr' ? 'Azima Sacrée & Invocation du Jour' : 'Sacred Daily Azima'}
                  </span>
                  <p className="text-base sm:text-xl font-serif text-amber-950 dir-rtl font-bold my-1">
                    {dailyData.incantation.azimaAr}
                  </p>
                  <p className="text-amber-900 italic font-medium">"{dailyData.incantation.phonetic}"</p>
                  <div className="inline-block mt-1 px-3 py-0.5 bg-amber-800/20 text-amber-950 text-[11px] font-bold rounded-full border border-amber-700/30">
                    {language === 'fr' ? `Répétition : ${dailyRepCount} fois` : `Recite: ${dailyRepCount} times`}
                  </div>
                </div>

                {/* PLANT & CONSECRATION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left text-xs">
                  <div className="p-2.5 bg-amber-900/20 rounded-xl border border-amber-700/40">
                    <span className="font-bold text-amber-950 block">🌿 Plante Botanique du Jour :</span>
                    <p className="text-amber-950 font-semibold">{plantName} ({dailyData.plant.nameAr})</p>
                    <p className="text-amber-900/90 text-[11px] mt-0.5">{plantUsage}</p>
                  </div>
                  <div className="p-2.5 bg-amber-900/20 rounded-xl border border-amber-700/40">
                    <span className="font-bold text-amber-950 block">🕯️ Consécration & Heure :</span>
                    <p className="text-amber-950 text-[11px]">Encens: <strong>{incense}</strong></p>
                    <p className="text-amber-950 text-[11px]">Heure bénie: <strong>{bestHour}</strong></p>
                  </div>
                </div>
              </div>
            }
          />
        );
      })()}

      {/* External Screen Widget Modal */}
      <ExternalScreenWidgetModal
        isOpen={showExternalWidgetModal}
        onClose={() => setShowExternalWidgetModal(false)}
        sealData={(() => {
          const dailyData = getDailyMysticalData(selectedCharm.id, selectedDay, language);
          return {
            titleFr: language === 'fr' ? dailyData.seal.titleFr : language === 'ha' ? dailyData.seal.titleHa : dailyData.seal.titleEn,
            titleAr: dailyData.seal.titleAr,
            abjadValue: dailyData.seal.abjadValue,
            talsamCode: dailyData.seal.talsamCode,
          };
        })()}
      />
    </div>
  );
}
