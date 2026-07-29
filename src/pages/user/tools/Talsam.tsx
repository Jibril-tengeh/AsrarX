import React, { useState } from 'react';
import { 
  Key, 
  ArrowLeft, 
  RefreshCw, 
  AlertTriangle, 
  Sparkles, 
  BookOpen, 
  Info, 
  Activity, 
  ShieldCheck, 
  Flame, 
  Compass, 
  Calendar, 
  Bookmark, 
  Check, 
  Copy, 
  HelpCircle,
  Gem,
  Moon,
  Zap,
  Maximize,
  Download,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { motion, AnimatePresence } from 'motion/react';

const talsamDict = {
  fr: {
    title: "Générateur de Talsam & Khatim",
    warning: "Avertissement Majeur : Les Talsams concentrent une puissante charge théurgique. Veillez à respecter scrupuleusement les règles sacrées de pureté corporelle (Taharah) et de protection spirituelle (Tahsin) avant d'entamer la pratique.",
    intentionLabel: "Formulez votre Vœu ou Intention Sacrée (Niyyah)",
    intentionPlaceholder: "Ex: Obtenir l'ouverture financière et la prospérité commerciale...",
    generateBtn: "Extraire la Formule & le Khatim",
    sealedPowerWord: "Formule Talsamique Suprême",
    instruction: "Inscrivez ce Talsam au centre du Khatim (Carré Magique 3x3) ci-dessous, dessiné sur un support propre, puis récitez-le le nombre de fois indiqué sous la planète correspondante."
  },
  en: {
    title: "Talsam & Khatim Generator",
    warning: "Major Warning: Talsams concentrate a powerful theurgic charge. Ensure scrupulous respect for sacred rules of physical purity (Taharah) and spiritual protection (Tahsin) before commencing the practice.",
    intentionLabel: "Formulate your Holy Wish or Intention (Niyyah)",
    intentionPlaceholder: "Ex: Attracting financial opening and commercial prosperity...",
    generateBtn: "Extract Formula & Khatim",
    sealedPowerWord: "Supreme Talsamic Formula",
    instruction: "Write this Talsam in the center of the Khatim (3x3 Magic Square) below, drawn on a clean support, then recite it the number of times indicated under the corresponding planet."
  },
  ha: {
    title: "Mai Samar da Talsam da Khatim",
    warning: "Gargaɗi na Musamman: Talsam yana tara kuzari mai ƙarfi na ruhaniya. Tabbatar ka kiyaye dokokin tsarki (Taharah) da kariya ta ruhaniya (Tahsin) kafin fara wannan aiki.",
    intentionLabel: "Sanya Manufarka ko Bukatarka ta Gaskiya (Niyyah)",
    intentionPlaceholder: "Alal misali: Samun buɗi na arziki da nasara a kasuwanci...",
    generateBtn: "Fitar da Talsam da Khatim",
    sealedPowerWord: "Kalmar Iko Da Aka Hatimce",
    instruction: "Rubuta wannan Talsam ɗin a tsakiyar Khatim (Sikofin 3x3) na ƙasa, sannan ka karanta shi adadin sau da aka nuna a ƙarƙashin tauraron da ke da alaƙa."
  }
};

interface DivineName {
  ar: string;
  fr: string;
  meaning: string;
  value: number;
}

export const Talsam: React.FC = () => {
  const { t, language } = useLanguage();
  const { isPremium } = useAuth();
  const dict = talsamDict[(language as 'fr' | 'en' | 'ha') || 'fr'] || talsamDict.fr;
  const [intention, setIntention] = useState('');
  const [talsam, setTalsam] = useState('');
  const [talsamPhonetic, setTalsamPhonetic] = useState('');
  const [isSceauModalOpen, setIsSceauModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [abjad, setAbjad] = useState<number | null>(null);
  const [detectedTheme, setDetectedTheme] = useState<string>('');
  const [themeColor, setThemeColor] = useState<string>('');
  const [incense, setIncense] = useState<string>('');
  const [planet, setPlanet] = useState<any>(null);
  const [divineNames, setDivineNames] = useState<DivineName[]>([]);
  const [khatimGrid, setKhatimGrid] = useState<number[][] | null>(null);
  const [repetitionCount, setRepetitionCount] = useState<number>(0);

  // Converts Western numerals to classic Eastern Arabic numerals for authentic display
  const toArabicNumerals = (num: number): string => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => {
      return isNaN(parseInt(digit)) ? digit : arabicDigits[parseInt(digit)];
    }).join('');
  };

  // Computes real-time astronomical Moon phase and spiritual charge coefficient
  const getLunarDetails = () => {
    const date = new Date();
    // Known reference: Jan 6, 2000 was a New Moon.
    // Length of synodic month is approx 29.530588853 days.
    const refDate = new Date(2000, 0, 6);
    const diffTime = date.getTime() - refDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const lunarAge = diffDays % 29.530588853;

    let phaseName = "";
    let phaseNameAr = "";
    let chargeCoefficient = 50; 
    let suitability = "";
    let description = "";
    let icon = "🌙";

    if (lunarAge < 1.5) {
      phaseName = "Nouvelle Lune (Al-Muhâq)";
      phaseNameAr = "المحاق";
      chargeCoefficient = 15;
      suitability = "Idéal pour rituels de purification majeure, désenvoûtement et effacement des dettes.";
      description = "Le ciel nocturne est vide d'éclat. C'est l'instant du calme plat et du nouveau départ spirituel.";
      icon = "🌑";
    } else if (lunarAge < 7.0) {
      phaseName = "Premier Croissant (Al-Hilâl)";
      phaseNameAr = "الهلال";
      chargeCoefficient = 65;
      suitability = "Idéal pour semer de nouvelles intentions de prospérité commerciale, d'amour et de charisme.";
      description = "La première fente de lumière est visible. Les forces s'éveillent pour projeter les intentions.";
      icon = "🌒";
    } else if (lunarAge < 9.0) {
      phaseName = "Premier Quartier (At-Tarbî' Al-Awwal)";
      phaseNameAr = "التربيع الأول";
      chargeCoefficient = 80;
      suitability = "Propice aux décisions courageuses, à l'avancement professionnel et à la réussite d'un examen.";
      description = "La lune est à moitié illuminée. L'attraction ésotérique s'accélère avec force.";
      icon = "🌓";
    } else if (lunarAge < 13.5) {
      phaseName = "Lune Gibbeuse Croissante (Al-Gibbous)";
      phaseNameAr = "الأحدب المتزايد";
      chargeCoefficient = 92;
      suitability = "Formidable pour accumuler la force d'attraction d'argent, d'amour divin et de haute spiritualité.";
      description = "Presque entièrement pleine. Le magnétisme céleste est extrêmement dense et réceptif.";
      icon = "🌔";
    } else if (lunarAge < 16.0) {
      phaseName = "Pleine Lune (Al-Badr)";
      phaseNameAr = "البدر";
      chargeCoefficient = 100;
      suitability = "L'APOGÉE CÉLESTE SUPRÊME. Idéal pour activer tout talsam d'ouverture spirituelle et de réussite immédiate.";
      description = "La lune brille à 100%. Les canaux spirituels sont ouverts de manière fluide et directe.";
      icon = "🌕";
    } else if (lunarAge < 22.0) {
      phaseName = "Lune Gibbeuse Décroissante";
      phaseNameAr = "الأحدب المتnaqiṣ";
      chargeCoefficient = 75;
      suitability = "Idéal pour stabiliser une situation, protéger des actifs financiers et sceller une alliance.";
      description = "Le flux commence à refluer doucement. Recommandé pour fortifier et conserver la richesse.";
      icon = "🌖";
    } else if (lunarAge < 24.5) {
      phaseName = "Dernier Quartier";
      phaseNameAr = "التربيع الأخير";
      chargeCoefficient = 60;
      suitability = "Excellent pour chasser le mauvais œil, les doutes intérieurs et rompre les liens négatifs.";
      description = "Déclin de la lumière visible. Idéal pour chasser le superflu et éloigner les ennemis.";
      icon = "🌗";
    } else {
      phaseName = "Dernier Croissant (Al-Urjûn)";
      phaseNameAr = "العرجون القديم";
      chargeCoefficient = 35;
      suitability = "Parfait pour le blindage spirituel lourd, la discrétion d'un projet secret et la protection spirituelle.";
      description = "La lune retourne au secret. Son énergie scelle les mystères à l'abri du regard d'autrui.";
      icon = "🌘";
    }

    return {
      age: Math.round(lunarAge * 10) / 10,
      phaseName,
      phaseNameAr,
      chargeCoefficient,
      suitability,
      description,
      icon
    };
  };

  // Escoreric Abjad Calculation Algorithm
  const calculateAbjadValue = (text: string): number => {
    const cleanText = text.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z]/g, ""); // keep letters only
    
    let sum = 0;
    const mapping: Record<string, number> = {
      'a': 1, 'b': 2, 'j': 3, 'g': 3, 'd': 4, 'h': 5, 'w': 6, 'v': 6, 'o': 6, 'u': 6,
      'z': 7, 't': 9, 'y': 10, 'i': 10, 'k': 20, 'c': 20, 'q': 20, 'l': 30, 'm': 40,
      'n': 50, 's': 60, 'x': 60, 'e': 70, 'f': 80, 'p': 80, 'r': 200, 'sh': 300,
      'ch': 300, 'th': 500, 'kh': 600, 'dh': 700, 'dad': 800, 'gh': 1000
    };

    let i = 0;
    while (i < cleanText.length) {
      if (i + 1 < cleanText.length) {
        const doubleChar = cleanText.substring(i, i + 2);
        if (mapping[doubleChar]) {
          sum += mapping[doubleChar];
          i += 2;
          continue;
        }
      }
      const singleChar = cleanText[i];
      if (mapping[singleChar]) {
        sum += mapping[singleChar];
      } else {
        const code = singleChar.charCodeAt(0);
        if (code >= 97 && code <= 122) {
          sum += (code % 10) + 1;
        }
      }
      i++;
    }
    return sum > 0 ? sum : 313; // default sacred number if empty
  };

  // Identifies spiritual matches, Divine Names and corresponding planetary timings
  const getEsotericAttributes = (text: string, abjadValue: number) => {
    const lower = text.toLowerCase();
    
    // Default setup
    let theme = "Élévation Spirituelle & Bénédiction Globale";
    let color = "from-amber-600 to-amber-950";
    let currentIncense = "Encens de Santal blanc, de Safran ou de Myrrhe douce";
    let planetInfo = {
      name: "Le Soleil (Al-Shams)",
      day: "Dimanche",
      hour: "À l'aube (Première heure céleste) ou la 8ème heure de la journée.",
      virtue: "Prestige, charisme royal, illumination du cœur, réussite globale et protection divine."
    };
    let names: DivineName[] = [
      { ar: "اللَّه", fr: "Allah", meaning: "L'Unique Absolu, Source de l'Existence", value: 66 },
      { ar: "الْعَزِيز", fr: "Al-Aziz", meaning: "Le Tout-Puissant d'une Gloire Inégalée", value: 94 },
      { ar: "الرَّافِع", fr: "Al-Rafi", meaning: "Celui qui Élève les serviteurs sincères", value: 351 }
    ];

    // Theme matching
    if (
      lower.includes("rich") || lower.includes("argent") || lower.includes("commerce") || 
      lower.includes("client") || lower.includes("succes") || lower.includes("reussite") || 
      lower.includes("vent") || lower.includes("moyen") || lower.includes("prospere") || 
      lower.includes("travail") || lower.includes("rizq") || lower.includes("or") ||
      lower.includes("dinar") || lower.includes("business") || lower.includes("financ") ||
      lower.includes("wealth") || lower.includes("money") || lower.includes("prospérité")
    ) {
      theme = "Ouverture des Portes de la Subsistance (Rizq) & Prospérité Abondante";
      color = "from-emerald-600 to-emerald-950";
      currentIncense = "Encens de Luban Jawi (Frankincense royal), de Coriandre ou de Cannelle";
      planetInfo = {
        name: "Jupiter (Al-Mushtari)",
        day: "Jeudi",
        hour: "À la première heure de l'aube ou à la 8ème heure du jeudi.",
        virtue: "Acquisition de richesses honnêtes, expansion des affaires commerciales, facilitation des dettes."
      };
      names = [
        { ar: "الْوَهَّاب", fr: "Al-Wahhab", meaning: "Le Donateur Suprême sans contrepartie", value: 14 },
        { ar: "الرَّزَّاق", fr: "Al-Razzaq", meaning: "Le Pourvoyeur Universel de subsistance", value: 308 },
        { ar: "الْفَتَّاح", fr: "Al-Fattah", meaning: "Celui qui Ouvre toutes les portes closes", value: 489 }
      ];
    } else if (
      lower.includes("prote") || lower.includes("blind") || lower.includes("ennem") || 
      lower.includes("mal") || lower.includes("dang") || lower.includes("peur") || 
      lower.includes("bloqu") || lower.includes("jalou") || lower.includes("sorcel") || 
      lower.includes("mauvais oeil") || lower.includes("sihr") || lower.includes("shield") ||
      lower.includes("evil") || lower.includes("attak") || lower.includes("défense")
    ) {
      theme = "Blindage Spirituel Majeur, Protection Inviolable & Défense Sacrée";
      color = "from-red-600 to-red-950";
      currentIncense = "Encens d'Asafetida (Haltit), de Soufre brut ou de Myrrhe noire";
      planetInfo = {
        name: "Mars (Al-Mirrikh)",
        day: "Mardi (Rigueur divine) ou Samedi (Obstacles)",
        hour: "À la première heure de l'aube du mardi ou samedi.",
        virtue: "Dissolution instantanée des sorts, neutralisation absolue des jaloux et blindage du corps."
      };
      names = [
        { ar: "الْحَفِيظ", fr: "Al-Hafiz", meaning: "Le Protecteur Suprême et Vigilant", value: 998 },
        { ar: "الْمَانِع", fr: "Al-Mani", meaning: "Celui qui Interpose des barrières infranchissables", value: 161 },
        { ar: "الْقَوِيّ", fr: "Al-Qawiyy", meaning: "Le Très Fort, Détenteur d'une force infinie", value: 116 }
      ];
    } else if (
      lower.includes("amour") || lower.includes("mari") || lower.includes("aim") || 
      lower.includes("coupl") || lower.includes("fem") || lower.includes("attract") || 
      lower.includes("sympath") || lower.includes("foy") || lower.includes("paix") || 
      lower.includes("affect") || lower.includes("love") || lower.includes("union")
    ) {
      theme = "Attraction Divine, Union Mystique des Cœurs & Harmonie Conjugale";
      color = "from-rose-600 to-rose-950";
      currentIncense = "Encens de Musc pur, d'Eau de Rose céleste ou de Santal rouge";
      planetInfo = {
        name: "Vénus (Al-Zuharah)",
        day: "Vendredi",
        hour: "Première heure de l'aube du vendredi (Heure d'or de la sympathie).",
        virtue: "Union sacrée, réconciliation des cœurs divisés, affection intense et grand charisme."
      };
      names = [
        { ar: "الْوَدُود", fr: "Al-Wadud", meaning: "Le Tout-Affectueux, Source de l'Amour universel", value: 20 },
        { ar: "الْجَامِع", fr: "Al-Jami", meaning: "Celui qui Rassemble les cœurs et les destinées", value: 114 },
        { ar: "اللَّطِيف", fr: "Al-Latif", meaning: "Le Doux envers Ses serviteurs avec une extrême finesse", value: 129 }
      ];
    } else if (
      lower.includes("guer") || lower.includes("sant") || lower.includes("malad") || 
      lower.includes("chif") || lower.includes("rem") || lower.includes("phys") || 
      lower.includes("souff") || lower.includes("heal") || lower.includes("vital")
    ) {
      theme = "Guérison Divine Majeure (Chifa), Restauration Céleste & Santé Parfaite";
      color = "from-cyan-600 to-cyan-950";
      currentIncense = "Encens d'Eucalyptus pur, de Camphre ou de Luban mâle (oliban)";
      planetInfo = {
        name: "Le Soleil (Al-Shams)",
        day: "Dimanche",
        hour: "À l'aube du dimanche (Heure de la descente des souffles de vie).",
        virtue: "Purification des humeurs du corps, régénération énergétique et libération des blocages physiques."
      };
      names = [
        { ar: "الشَّافِي", fr: "Ash-Shafi", meaning: "Le Seul Guérisseur Véritable", value: 391 },
        { ar: "الْمُحْيِي", fr: "Al-Muhyi", meaning: "Celui qui Insuffle la vie et la santé", value: 46 },
        { ar: "السَّلَام", fr: "As-Salam", meaning: "L'Exempt de tout défaut et de toute maladie", value: 131 }
      ];
    } else if (
      lower.includes("savo") || lower.includes("intel") || lower.includes("memo") || 
      lower.includes("exam") || lower.includes("etud") || lower.includes("scien") || 
      lower.includes("secret") || lower.includes("revel") || lower.includes("knowle") ||
      lower.includes("sagesse") || lower.includes("jafar")
    ) {
      theme = "Illumination Mentale, Sagesse Divine Infuse & Maîtrise des Secrets";
      color = "from-indigo-600 to-indigo-950";
      currentIncense = "Encens de Myrrhe odorante, de Mastic de Chio ou de Safran pur";
      planetInfo = {
        name: "Mercure (Al-Utarid)",
        day: "Mercredi",
        hour: "Première heure de l'aube du mercredi.",
        virtue: "Clarté mentale parfaite pour les études, inspiration intuitive spirituelle, mémoire inébranlable."
      };
      names = [
        { ar: "الْعَلِيم", fr: "Al-Alim", meaning: "L'Omniscient dont rien n'échappe à la Conscience", value: 150 },
        { ar: "الْحَكِيم", fr: "Al-Hakim", meaning: "Le Sage suprême dont les décrets sont parfaits", value: 78 },
        { ar: "النُّور", fr: "An-Nur", meaning: "La Lumière Pure qui éclaire l'obscurité des esprits", value: 256 }
      ];
    }

    return { theme, color, currentIncense, planetInfo, names };
  };

  // Traditional Esoteric Word Extraction (Synthesized Theurgy)
  const generateFormulaWords = (abjadValue: number, names: DivineName[]) => {
    // Suffixes representing the spiritual guardian angelic entities of Rouhaniyat:
    // "-lashin", "-tashin", "-hayushin", "-yut", "-tamshin"
    const prefixes = ["طَمْ", "شَمْ", "بَرْ", "كَهْ", "غَلْ", "مَهْ", "أَهْ", "سَقْ", "خَفْ", "جَلْ"];
    const suffixes = ["شَلَشٍ", "هَيُوشٍ", "مَطَشٍ", "يُوطٍ", "قُوشٍ", "طَيٍّ", "جَالٍ", "كَدٍّ"];

    const prefixesTrans = ["Tam", "Sham", "Bar", "Kah", "Ghal", "Mah", "Ah", "Saq", "Khaf", "Jal"];
    const suffixesTrans = ["shalashin", "hayushin", "matashin", "yutin", "qushin", "tayyin", "jalin", "kaddin"];

    const idx1P = abjadValue % prefixes.length;
    const idx1S = (abjadValue * 3) % suffixes.length;
    const w1 = prefixes[idx1P] + suffixes[idx1S];
    const w1Phonetic = prefixesTrans[idx1P] + suffixesTrans[idx1S];
    
    const nameSum = names.reduce((acc, curr) => acc + curr.value, 0);
    const idx2P = (nameSum + abjadValue) % prefixes.length;
    const idx2S = (nameSum * 2) % suffixes.length;
    const w2 = prefixes[idx2P] + suffixes[idx2S];
    const w2Phonetic = prefixesTrans[idx2P] + suffixesTrans[idx2S];

    const idx3P = (nameSum * abjadValue) % prefixes.length;
    const idx3S = (abjadValue + 7) % suffixes.length;
    const w3 = prefixes[idx3P] + suffixes[idx3S];
    const w3Phonetic = prefixesTrans[idx3P] + suffixesTrans[idx3S];

    // Connects words using standard single spaces, keeping the Arabic cursive letters 
    // unified inside their respective words, avoiding any browser letter-spacing separation!
    const formulaText = `يَا ${w1} ${w2} ${w3}`;
    const phoneticText = `Yâ ${w1Phonetic} ${w2Phonetic} ${w3Phonetic}`;
    const repetition = abjadValue * 3 + nameSum;

    return { formulaText, phoneticText, repetition };
  };

  // Mathematically computes a perfect 3x3 Magic Square (Khatim Muthallath)
  const generateKhatimGrid = (targetSum: number): number[][] => {
    let S = targetSum;
    if (S < 66) S += 66; // offset to guarantee beautiful positive integers

    // Ghazali's 3x3 Muthallath Formula:
    // Each row, column, and diagonal equals S.
    // Row sum S = 3x + 12 => x = floor((S - 12) / 3)
    const x = Math.floor((S - 12) / 3);
    const remainder = (S - 12) % 3;

    let c1 = x;
    let c2 = x + 1;
    let c3 = x + 2;
    let c4 = x + 3;
    let c5 = x + 4;
    let c6 = x + 5;
    let c7 = x + 6;
    let c8 = x + 7;
    let c9 = x + 8;

    // Apply remainders (The sacred fractional adjustment or 'Kasr')
    if (remainder === 1) {
      c7 += 1;
      c8 += 1;
      c9 += 1;
    } else if (remainder === 2) {
      c4 += 1;
      c5 += 1;
      c6 += 1;
      c7 += 1;
      c8 += 1;
      c9 += 1;
    }

    // Classic Ghazali 3x3 Layout Grid:
    // Row 1: Cell 4 | Cell 9 | Cell 2
    // Row 2: Cell 3 | Cell 5 | Cell 7
    // Row 3: Cell 8 | Cell 1 | Cell 6
    return [
      [c4, c9, c2],
      [c3, c5, c7],
      [c8, c1, c6]
    ];
  };

  const handleGenerate = () => {
    if (!intention) return;

    const abjadVal = calculateAbjadValue(intention);
    const attrs = getEsotericAttributes(intention, abjadVal);
    const formulaData = generateFormulaWords(abjadVal, attrs.names);
    const grid = generateKhatimGrid(abjadVal);

    setAbjad(abjadVal);
    setDetectedTheme(attrs.theme);
    setThemeColor(attrs.color);
    setIncense(attrs.currentIncense);
    setPlanet(attrs.planetInfo);
    setDivineNames(attrs.names);
    setTalsam(formulaData.formulaText);
    setTalsamPhonetic(formulaData.phoneticText);
    setRepetitionCount(formulaData.repetition);
    setKhatimGrid(grid);
  };

  const copyFormulaToClipboard = () => {
    if (!talsam) return;
    if (!isPremium) {
      triggerProtectionModal('copy');
      return;
    }
    navigator.clipboard.writeText(talsam);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadKhatimAsImage = async () => {
    if (!khatimGrid) return;
    if (!isPremium) {
      triggerProtectionModal('download');
      return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 600;
    canvas.height = 600;
    
    // Background gradient
    const grad = ctx.createRadialGradient(300, 300, 50, 300, 300, 400);
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(1, '#020408');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 600);
    
    // Mystical stars background
    ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * 600;
      const y = Math.random() * 600;
      const r = Math.random() * 1.5 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Golden border
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.strokeRect(25, 25, 550, 550);
    
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 1;
    ctx.strokeRect(35, 35, 530, 530);

    // Decorative spiritual circles
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(300, 300, 245, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(300, 300, 252, 0, Math.PI * 2);
    ctx.stroke();

    // Corner Watermarks "AsrarHub"
    ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText("ASRARHUB", 45, 52);
    ctx.textAlign = 'right';
    ctx.fillText("ASRARHUB", 555, 52);
    ctx.textAlign = 'left';
    ctx.fillText("ASRARHUB", 45, 558);
    ctx.textAlign = 'right';
    ctx.fillText("ASRARHUB", 555, 558);

    // Header text
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("SCEAU THÉURGIQUE DE GHAZALI", 300, 75);
    
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText("ASRARHUB • TABLETTE SACRÉE DE TRANSMUTATION", 300, 100);

    // Grid details
    const gridX = 150;
    const gridY = 140;
    const cellSize = 100;
    
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    
    // Draw columns & rows of magic square
    for (let i = 0; i <= 3; i++) {
      // Horizontal
      ctx.beginPath();
      ctx.moveTo(gridX, gridY + i * cellSize);
      ctx.lineTo(gridX + 3 * cellSize, gridY + i * cellSize);
      ctx.stroke();
      
      // Vertical
      ctx.beginPath();
      ctx.moveTo(gridX + i * cellSize, gridY);
      ctx.lineTo(gridX + i * cellSize, gridY + 3 * cellSize);
      ctx.stroke();
    }
    
    // Draw the grid values inside cells
    khatimGrid.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        const cellCenterX = gridX + cIdx * cellSize + cellSize / 2;
        const cellCenterY = gridY + rIdx * cellSize + cellSize / 2;
        
        // Background cell highlight
        ctx.fillStyle = 'rgba(251, 191, 36, 0.03)';
        ctx.fillRect(gridX + cIdx * cellSize + 4, gridY + rIdx * cellSize + 4, cellSize - 8, cellSize - 8);

        // Standard number
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(cell.toString(), cellCenterX, cellCenterY - 6);
        
        // Eastern Arabic digit
        ctx.fillStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.font = 'normal 15px serif';
        ctx.fillText(toArabicNumerals(cell), cellCenterX, cellCenterY + 20);
      });
    });

    // Write intention or formula below grid
    if (intention) {
      const maxLen = 45;
      const shortIntention = intention.length > maxLen ? intention.substring(0, maxLen) + "..." : intention;
      ctx.fillStyle = 'rgba(254, 243, 199, 0.7)';
      ctx.font = 'italic 12px sans-serif';
      ctx.fillText(`Intention : "${shortIntention}"`, 300, 480);
    }
    
    if (talsam) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 24px serif';
      ctx.fillText(`Talsam : ${talsam}`, 300, 520);
    }

    ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.font = '9px monospace';
    ctx.fillText(`Poids Abjad: ${abjad} | Résonance: ${repetitionCount} Répétitions`, 300, 550);

    // Download flow with watermark & storage access
    await downloadCanvasImage(canvas, `Sceau_Khatim_Mystique_${abjad}.png`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 safe-area-pt max-h-[85vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <Link 
          to="/tools" 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Key className="text-amber-500 shrink-0" />
            <span className="truncate">{dict.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Sondez la dimension abjadique de votre intention, extrayez son mot céleste secret de puissance et dressez son carré théurgique (Khatim).
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-0.5">

      {/* Warnings & Spiritual Rules */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 mb-8 flex items-start gap-3">
        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-amber-800 dark:text-amber-200 font-medium">
          <p className="font-bold mb-1">Règle de Transmutation Sacrée :</p>
          <p>{dict.warning}</p>
        </div>
      </div>

      {/* Inputs Card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800/80 mb-8">
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
          {dict.intentionLabel}
        </label>
        <textarea
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder={dict.intentionPlaceholder}
          rows={3}
          className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all resize-none mb-4"
        />
        <button
          onClick={handleGenerate}
          disabled={!intention}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 dark:from-amber-600 dark:to-amber-800 text-white font-bold disabled:opacity-50 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw size={20} className="animate-spin-slow" /> 
          {dict.generateBtn}
        </button>
      </div>

      {/* Main Core Tool info / tooltip */}
      <div className="mb-8">
        <ToolInfoTooltip toolId="talsam" />
      </div>

      {/* Esoteric Results Section */}
      <AnimatePresence>
        {talsam && abjad && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="space-y-8"
          >
            {/* Medallion Display Box */}
            <div className={`relative overflow-hidden rounded-3xl p-8 border border-amber-500/20 bg-gradient-to-b ${themeColor} text-white shadow-2xl text-center`}>
              {/* Background Esoteric Circles */}
              <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                <div className="w-96 h-96 rounded-full border border-white animate-spin-slow flex items-center justify-center">
                  <div className="w-80 h-80 rounded-full border border-dashed border-white flex items-center justify-center">
                    <div className="w-60 h-60 rounded-full border border-white"></div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 space-y-6">
                <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-amber-200">
                  <Sparkles size={12} /> {detectedTheme}
                </span>

                <h3 className="text-amber-100 font-extrabold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                  <Key size={14} className="text-amber-300" />
                  {dict.sealedPowerWord}
                </h3>

                {/* THE PORTAL: MASSIVE TALSAM FORMULA */}
                <div className="py-8 px-6 bg-slate-950/90 rounded-3xl border border-amber-500/30 shadow-2xl inline-block mx-auto max-w-full relative group">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-widest shadow">
                    TRACÉ TRADITIONNEL DE PUISSANCE
                  </div>
                  
                  <p 
                    className="font-arabic text-5xl sm:text-7xl md:text-8xl text-amber-300 font-extrabold leading-normal text-center select-all tracking-normal drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                    style={{ letterSpacing: '0px', wordSpacing: '12px' }}
                    dir="rtl"
                  >
                    {talsam}
                  </p>

                  {/* Transliteration / Pronunciation block - MUCH LARGER & EXTREMELY CLEAR */}
                  <div className="mt-6 pt-4 border-t border-amber-500/10 space-y-1">
                    <span className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest block">PRONONCIATION SACRÉE (TRANSLITTÉRATION)</span>
                    <p className="text-xl sm:text-2xl font-black text-white tracking-wide font-serif italic text-center select-all bg-white/5 py-2 px-4 rounded-xl border border-white/5">
                      {talsamPhonetic}
                    </p>
                  </div>
                </div>

                {/* Copy Button */}
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={copyFormulaToClipboard}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-[0.98]"
                  >
                    {copied ? <Check size={14} className="stroke-[3]" /> : <Copy size={14} className="stroke-[3]" />}
                    {copied ? "Formule Copiée !" : "Copier la Formule Sacrée"}
                  </button>
                </div>

                {/* Word breakdown for educational / spiritual secrets */}
                <div className="max-w-xl mx-auto p-4 bg-slate-950/60 rounded-2xl border border-white/5 text-left space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest text-center pb-2 border-b border-white/5">
                    Anatomie Vibratoire du Talsam Extrait
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-gray-300">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                      <span className="font-extrabold text-amber-300 block mb-0.5">Yâ (يَا)</span>
                      Le vecteur de projection spirituelle et d'interpellation du flux divin.
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                      <span className="font-extrabold text-amber-300 block mb-0.5">Mot Spirituel 1</span>
                      {talsamPhonetic.split(' ')[1] || 'Angélique'} : Connecte votre intention pure à l'élément de la terre.
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                      <span className="font-extrabold text-amber-300 block mb-0.5">Mot Spirituel 2</span>
                      {talsamPhonetic.split(' ')[2] || 'Gardien'} : Harmonise le rythme cardiaque avec les ondes planétaires.
                    </div>
                  </div>
                </div>

                <p className="text-xs text-amber-100/70 max-w-lg mx-auto leading-relaxed">
                  {dict.instruction}
                </p>
              </div>
            </div>

            {/* Calculations & Esoteric Science */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Esoteric Science Card */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <Activity size={20} className="text-amber-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">
                    1. Décodage de la Vibration Numérique
                  </h3>
                </div>

                {/* Abjad Gauge */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 dark:text-gray-400 font-bold">VALEUR ABJAD GLOBALE DE L'INTENTION</span>
                    <span className="text-amber-600 dark:text-amber-400 font-mono font-bold text-sm bg-amber-50 dark:bg-amber-950/30 px-2.5 py-0.5 rounded-md">
                      {abjad}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (abjad / 2000) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    L'Abjad est un système de numérologie sémitique classique où chaque lettre possède une vibration arithmétique. Votre intention s'est condensée en la signature vibratoire de <strong className="font-mono">{abjad}</strong>.
                  </p>
                </div>

                {/* Recitation Info */}
                <div className="p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Clé de résonance (Répétitions)</span>
                    <span className="text-lg font-extrabold text-amber-500 font-mono">
                      {repetitionCount} fois
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-gray-100 dark:border-gray-800/80 pt-2">
                    <span className="text-gray-400">Calcul théurgique</span>
                    <span className="font-mono text-gray-400">({abjad} x 3) + Somme Noms</span>
                  </div>
                </div>

                {/* Divine Names of Allah matched */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Gem size={12} className="text-amber-500" />
                    Noms Divins Alignés sur la Fréquence
                  </h4>
                  <div className="space-y-2">
                    {divineNames.map((name, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900/50">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{name.fr}</span>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-gray-500 font-mono">
                              Val: {name.value}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-normal">{name.meaning}</p>
                        </div>
                        <span className="font-arabic text-xl font-bold text-amber-600 dark:text-amber-400 select-all" dir="rtl">
                          {name.ar}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* KHATIM (Magic Square 3x3) Card */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <Compass size={20} className="text-amber-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">
                    2. Le Carré Magique Sacré (Khatim)
                  </h3>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Voici le <strong>Khatim Muthallath de Ghazali</strong> calculé spécifiquement pour encapsuler la valeur vibratoire de votre souhait. Il équilibre parfaitement les forces cosmiques dans les 9 demeures de l'espace.
                </p>

                {/* MAGIC SQUARE GRID DISPLAY */}
                {khatimGrid && (
                  <div 
                    onClick={() => setIsSceauModalOpen(true)}
                    className="bg-slate-950 rounded-2xl p-4 sm:p-6 border border-amber-500/20 relative shadow-inner cursor-pointer hover:border-amber-500/50 transition-all duration-300 group overflow-hidden"
                    title="Cliquez pour agrandir et télécharger le sceau"
                  >
                    {/* Hover indicator */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl px-4 py-2 text-center shadow-2xl scale-95 group-hover:scale-100 transition-transform">
                        <Maximize className="text-amber-400 mx-auto mb-1 animate-pulse" size={20} />
                        <span className="text-[11px] font-extrabold uppercase text-amber-200 tracking-wider block">Agrandir & Télécharger</span>
                        <span className="text-[9px] text-gray-400">Cliquez pour ouvrir le Sceau Sacré</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 relative z-10 max-w-[280px] mx-auto border-2 border-amber-500/40 p-1.5 rounded-xl bg-slate-950">
                      {khatimGrid.map((row, rIdx) => 
                        row.map((cell, cIdx) => (
                           <div 
                            key={`${rIdx}-${cIdx}`} 
                            className="bg-slate-900 aspect-square flex flex-col items-center justify-center border border-amber-500/10 p-1 rounded-lg text-center select-all group-hover:bg-slate-800 transition-colors"
                          >
                            {/* Standard western digits */}
                            <span className="font-mono text-sm sm:text-base font-extrabold text-amber-400">
                              {cell}
                            </span>
                            {/* Classical Eastern Arabic digits */}
                            <span className="text-[10px] sm:text-[11px] text-amber-500/50 font-arabic font-bold">
                              {toArabicNumerals(cell)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2 p-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl text-xs text-gray-600 dark:text-gray-300">
                  <p className="font-bold text-amber-700 dark:text-amber-400">Le Secret du Tracé Cosmique :</p>
                  <p className="leading-relaxed">
                    Toutes les lignes horizontales, verticales et diagonales de ce carré magique possèdent exactement la même somme ésotérique divine. En enfermant le Talsam au centre de ce sceau, vous créez un amplificateur spirituel condensateur d'énergie.
                  </p>
                </div>
              </div>

              {/* LUNAR PHASE & CHARGE ALIGNMENT CARD */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <Moon size={20} className="text-amber-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">
                    3. Alignement Lunaire & Charge
                  </h3>
                </div>

                {(() => {
                  const lunar = getLunarDetails();
                  return (
                    <div className="space-y-5">
                      {/* Live Phase Display */}
                      <div className="p-4 bg-amber-50/30 dark:bg-amber-950/10 rounded-2xl border border-amber-100/50 dark:border-amber-900/20 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">Phase Lunaire Actuelle</span>
                          <span className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <span className="text-xl">{lunar.icon}</span> {lunar.phaseName}
                          </span>
                        </div>
                        <span className="font-arabic text-xl font-bold text-amber-600 dark:text-amber-400 select-all" dir="rtl">
                          {lunar.phaseNameAr}
                        </span>
                      </div>

                      {/* Spiritual Charge Indicator */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Taux de Charge Spatiale</span>
                          <span className="text-amber-600 dark:text-amber-400 font-mono font-bold text-sm bg-amber-50 dark:bg-amber-950/30 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <Zap size={12} className="fill-current text-amber-500" /> {lunar.chargeCoefficient}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${lunar.chargeCoefficient}%` }}
                          ></div>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          La résonance ésotérique de votre formule culmine à <strong className="text-amber-600 dark:text-amber-400">100% lors de la Pleine Lune (Al-Badr)</strong>. Actuellement, l'âge lunaire est de <strong className="font-mono">{lunar.age} jours</strong>, générant une réceptivité de <strong className="font-mono">{lunar.chargeCoefficient}%</strong>.
                        </p>
                      </div>

                      {/* Suitability and Recommendation */}
                      <div className="space-y-1 p-3.5 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-900/80">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Recommandation Spécifique</span>
                        <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                          {lunar.suitability}
                        </p>
                        <p className="text-[11px] text-gray-400 italic mt-1 leading-relaxed">
                          {lunar.description}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* Deep Secrets of Talsams, Allah's Names & Sacred Incantations */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
              <div className="flex items-center gap-3 pb-5 border-b border-gray-100 dark:border-gray-800">
                <BookOpen size={24} className="text-amber-500" />
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white uppercase tracking-wider text-base sm:text-lg">
                    Guide d'Usage Spirituel & Secrets du Talsam
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">La science millénaire de la transmutation spirituelle (Rouhaniyyat)</p>
                </div>
              </div>

              {/* Secrets Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Secret 1 */}
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500">
                    <Flame size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Le Mystère des Noms Talsamiques</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Les mots générés (<em>{talsam.split(' ').slice(1, 4).join(', ')}</em>) ne sont pas du jargon arbitraire. Ce sont des <strong>Noms de Pouvoir Esotériques</strong> (Assma'a Al-Tawassul) dérivés des vibrations de votre Niyyah (intention) mélangés à l'énergie des lettres arabes pures. Ils invoquent l'action bienveillante des intelligences spirituelles célestes (Mala'ikah) assignées à ces Noms pour matérialiser votre vœu.
                  </p>
                </div>

                {/* Secret 2 */}
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500">
                    <Calendar size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Heure Cosmique & Alignement Planétaire</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    La réussite ésotérique dépend de l'harmonie du temps. Pratiquez de préférence le <strong className="text-amber-600 dark:text-amber-400">{planet?.day}</strong> durant la <strong className="text-amber-600 dark:text-amber-400">{planet?.name}</strong> (<strong className="text-amber-600 dark:text-amber-400">{planet?.hour}</strong>). Brûlez l'encens recommandé (<strong className="text-amber-600 dark:text-amber-400">{incense}</strong>) pour harmoniser l'air ambiant et attirer les ondes de lumière pure.
                  </p>
                </div>

                {/* Secret 3 */}
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">La Règle Sacrée du Secret (Khitman)</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Le secret est le pilier de l'Alchimie théurgique. <strong>Ne révélez jamais votre formule générée ni l'image de votre Khatim</strong> à autrui. L'énergie accumulée dans le talisman est volatile ; s'il est exposé aux yeux de personnes incrédules ou envieuses, sa force spirituelle se dissipe et s'éteint immédiatement.
                  </p>
                </div>

              </div>

              {/* Ritual Execution Roadmap */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-900 space-y-4">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Bookmark size={16} className="text-amber-500" />
                  Protocole de Consécration en 4 Étapes
                </h4>

                <div className="space-y-4 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex gap-3">
                    <span className="font-mono font-bold text-amber-500 text-sm bg-white dark:bg-slate-900 w-6 h-6 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 shrink-0">1</span>
                    <div>
                      <strong className="text-gray-800 dark:text-gray-200 block mb-0.5">Purification Obligatoire (Taharah)</strong>
                      Lavez-vous avec soin (Grandes ou Petites Ablutions) et revêtez des vêtements amples de couleur claire (de préférence blanche). Parfumez vos mains et votre front avec de l'huile de Oud ou de Musc naturel. Installez-vous dans un espace calme à l'abri des bruits et de l'agitation.
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="font-mono font-bold text-amber-500 text-sm bg-white dark:bg-slate-900 w-6 h-6 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 shrink-0">2</span>
                    <div>
                      <strong className="text-gray-800 dark:text-gray-200 block mb-0.5">Le Tracé du Sceau Céleste (Khatim)</strong>
                      Prenez une feuille de papier blanche vierge et dessinez à l'encre pure (de préférence avec un calame et de l'encre de safran mélangée à de l'eau de rose) la grille du Khatim 3x3 telle qu'elle s'affiche ci-dessus avec ses valeurs numériques précises. Au centre exact du carré ou juste en dessous, écrivez soigneusement la Formule Talsamique Suprême : <span className="font-arabic text-amber-600 dark:text-amber-400 font-bold px-1 tracking-normal" style={{ letterSpacing: '0px' }}>{talsam}</span>.
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="font-mono font-bold text-amber-500 text-sm bg-white dark:bg-slate-900 w-6 h-6 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 shrink-0">3</span>
                    <div>
                      <strong className="text-gray-800 dark:text-gray-200 block mb-0.5">La Charge Vibratoire par l'Incantation</strong>
                      Allumez l'encens recommandé (<span className="font-semibold text-amber-600 dark:text-amber-400">{incense}</span>). Dirigez-vous face à la Qiblah (l'Est ou la direction sacrée), tenez le papier entre vos mains à hauteur du cœur et récitez la formule talsamique générée exactement <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">{repetitionCount} fois</span>. Visualisez l'intention se matérialiser sous forme de lumière dorée descendant des cieux pour habiter le papier.
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="font-mono font-bold text-amber-500 text-sm bg-white dark:bg-slate-900 w-6 h-6 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 shrink-0">4</span>
                    <div>
                      <strong className="text-gray-800 dark:text-gray-200 block mb-0.5">L'Utilisation Céleste</strong>
                      Pliez le papier soigneusement pour en faire un amulette (Ta'awidh), enveloppez-le d'un tissu propre ou de cire naturelle et conservez-le sur vous (poche droite, sac) ou disposez-le dans le lieu lié à votre intention (tiroir de caisse de commerce, entrée du foyer). Alternativement, infusez le parchemin de safran dans de l'eau pure et buvez-la pendant 7 matins d'affilée pour intégrer physiquement sa vibration bénéfique.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL-SCREEN SCEAU & TALSAM LIGHTBOX MODAL */}
      <AnimatePresence>
        {isSceauModalOpen && khatimGrid && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-md overflow-y-auto"
          >
            {/* Ambient Background Circles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-amber-500 animate-spin-slow"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-dashed border-amber-500/30"></div>
            </div>

            <div className="relative bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full mx-auto my-8 shadow-2xl shadow-amber-500/10 z-10 space-y-6 text-center">
              {/* Close button */}
              <button 
                onClick={() => setIsSceauModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer border border-white/5"
              >
                <X size={20} />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">GRAND SCEAU SACRÉ D'ASRARHUB</span>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                  Khatim Muthallath de Ghazali
                </h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Voici le tracé haute résolution du condensateur cosmique correspondant à votre intention : <span className="text-amber-300 italic">"{intention}"</span>
                </p>
              </div>

              {/* HIGH RESOLUTION SQUARE DESIGN */}
              <div className="bg-slate-950 rounded-2xl p-6 border-2 border-amber-500/30 inline-block mx-auto max-w-[320px] w-full shadow-inner relative">
                <div className="grid grid-cols-3 gap-1.5 border-4 border-amber-500/60 p-2 rounded-xl bg-slate-950">
                  {khatimGrid.map((row, rIdx) => 
                    row.map((cell, cIdx) => (
                      <div 
                        key={`${rIdx}-${cIdx}`} 
                        className="bg-slate-900 aspect-square flex flex-col items-center justify-center border-2 border-amber-500/20 p-2 rounded-xl text-center shadow-md shadow-black"
                      >
                        {/* Standard western digits */}
                        <span className="font-mono text-xl sm:text-2xl font-black text-amber-300">
                          {cell}
                        </span>
                        {/* Classical Eastern Arabic digits */}
                        <span className="text-xs sm:text-sm text-amber-500/70 font-arabic font-extrabold mt-0.5">
                          {toArabicNumerals(cell)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Talsam displays below */}
              <div className="space-y-2 max-w-md mx-auto">
                <span className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest block">Formule Talsamique Associée</span>
                <p 
                  className="font-arabic text-3xl sm:text-4xl text-amber-300 font-extrabold tracking-normal"
                  style={{ letterSpacing: '0px' }}
                  dir="rtl"
                >
                  {talsam}
                </p>
                <p className="text-sm font-bold text-white tracking-wide font-serif italic">
                  {talsamPhonetic}
                </p>
              </div>

              {/* Interactive buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                <button
                  onClick={downloadKhatimAsImage}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-6 py-3 rounded-2xl shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer text-xs uppercase tracking-wider"
                >
                  <Download size={16} className="stroke-[3]" />
                  Télécharger le Sceau (PNG)
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${talsam}\n(${talsamPhonetic})`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-extrabold px-6 py-3 rounded-2xl border border-white/10 transition-all cursor-pointer text-xs uppercase tracking-wider"
                >
                  {copied ? <Check size={16} className="text-emerald-400 stroke-[3]" /> : <Copy size={16} />}
                  {copied ? "Formule Copiée !" : "Copier le Texte"}
                </button>
              </div>

              {/* Secret guidelines inside modal */}
              <div className="text-left bg-slate-950/60 p-4 rounded-2xl border border-white/5 text-xs text-gray-400 space-y-2">
                <p className="font-extrabold text-amber-400 uppercase tracking-widest text-[10px] border-b border-white/5 pb-1 flex items-center gap-1.5">
                  <ShieldCheck size={12} /> Secrets d'Activation Sacrés :
                </p>
                <ul className="list-disc pl-4 space-y-1.5 leading-relaxed">
                  <li>Tracez cette grille exactement avec de l'encre de safran et de l'eau de rose sur du papier vierge.</li>
                  <li>Inscrivez la formule talsamique <strong className="text-amber-300">{talsam}</strong> juste sous le sceau.</li>
                  <li>Récitez la formule sacrée <strong className="text-amber-300 font-mono">{repetitionCount} fois</strong> de suite face à l'Est (Qiblah).</li>
                  <li>Une fois chargé, pliez et gardez le sceau sur vous, caché des yeux indiscrets pour sceller sa vibration mystique.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};
