import React, { useState, useMemo } from 'react';
import {
  Feather,
  Sparkles,
  Compass,
  RotateCcw,
  Copy,
  Check,
  Download,
  Eye,
  Grid,
  Layers,
  Shuffle,
  Target,
  Share2,
  RefreshCw,
  PenTool,
  Hash,
  Combine,
  Search,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { calculateAbjadValue, numberToAbjadLetters } from '../../../utils/abjad';
import { applyTashkeel } from '../../../utils/tashkeel';
import { downloadCanvasImage } from '../../../utils/downloadHelper';

// Multilingual UI texts for all tabs and sections
const UI_TEXTS = {
  fr: {
    pageTitle: "Extraction & Tracé de Talsams (التلاسم والطلاسم)",
    pageSubtitle: "Ingénierie sacrée des sigils de grilles, réduction littérale, conversion de glyphes, obscurcissement, fusion d'interlaçage et analyse de clés.",
    headerBadge: "Extraction & Tracé de Talsams",
    squareLabel: "Carré",
    cellLabel: "Cellule",
    openLoopText: "consonnes à boucles ouvertes",
    colorLabels: {
      gold: "Or Sacré",
      emerald: "Émeraude",
      crimson: "Rubis",
      indigo: "Lapis"
    },
    jumpOptions: {
      jump2: "Saut de 2 (Qafza Thana'iyyah)",
      jump3: "Saut de 3 (Qafza Thulathiyyah)",
      jump4: "Saut de 4 (Qafza Ruba'iyyah)"
    },
    
    tabs: {
      wafqSigil: "Khat al-Wafq (Sigil)",
      hurufTalsam: "Talsam al-Huruf (Littéral)",
      arqamGlyphs: "Talsam al-Arqam (Glyphes)",
      khafiyy: "Khatim al-Khafiyy (Obscurci)",
      imtizaj: "Talsam al-Imtizaj (Fusion)",
      miftah: "Miftah al-Talsam (Analyseur)"
    },

    // 1. Khat al-Wafq
    wafqTitle: "1. Khat al-Wafq - Générateur de Sigil de Grille",
    wafqDesc: "Trace la ligne sacrée continue reliant les nombres consécutifs d'un carré magique (1 à 9 pour 3x3, ou 1 à 16 pour 4x4).",
    gridSizeLabel: "Format de la Grille",
    lineColorLabel: "Couleur du Tracé",
    targetValueLabel: "Valeur Abjad Cible (Optionnel)",
    startNode: "Départ (Miftah)",
    endNode: "Arrivée (Qutb)",

    // 2. Talsam al-Huruf
    hurufTitle: "2. Talsam al-Huruf - Extraction & Méthode de Saut",
    hurufDesc: "Élimine les répétitions de lettres d'un verset et applique une permutation par saut (Qafza) pour extraire la formule synthétique.",
    verseInputLabel: "Verset ou Inscription Source",
    jumpStepLabel: "Pas de Saut (Méthode Qafza)",
    uniqueLetters: "Lettres Uniques Filtrées",
    extractedTalsam: "Talsam Final Extrait",
    abjadValueLabel: "Valeur Abjad de l'Extraction",

    // 3. Talsam al-Arqam
    arqamTitle: "3. Talsam al-Arqam - Glyphes & Chiffres Traditionnels",
    arqamDesc: "Convertit les nombres décimaux en chiffrages orientaux magiques et symboles ésotériques de référence.",
    numberInputLabel: "Nombre ou Somme à Convertir",
    easternArabicLabel: "Chiffres Orientaux (الأرقام المشرقية)",
    esotericGlyphsLabel: "Symboles Mystiques Correspondants",

    // 4. Khatim al-Khafiyy
    khafiyyTitle: "4. Khatim al-Khafiyy - Obscurcissement & Ouverture des Boucles",
    khafiyyDesc: "Dépouille le texte de ses points diacritiques (I'jam) et met en évidence l'ouverture des consonnes à boucles (Fath al-Huwar).",
    inputTextLabel: "Texte à Obscurcir",
    dotlessTextLabel: "Texte Sans Points (Rasm Khali min al-Nuqat)",
    openLoopsLabel: "Analyse des Consonnes à Boucles (م, ط, ظ, ص, ض, هـ)",

    // 5. Talsam al-Imtizaj
    imtizajTitle: "5. Talsam al-Imtizaj - Fusion & Interlaçage",
    imtizajDesc: "Entrelace alternativement les lettres du nom de l'intervenant et celles de la formule sacrée pour créer un vecteur d'alliance unique.",
    userNameLabel: "Nom / Intentions (Sujet)",
    divineFormulaLabel: "Formule Sacrée / Verset (Objet)",
    interlacedResultLabel: "Formule Fusionnée (Talsam al-Imtizaj)",
    elementalBalance: "Équilibre Élémentaire de la Fusion",

    // 6. Miftah al-Talsam
    miftahTitle: "6. Miftah al-Talsam - Analyseur de Trajectoires",
    miftahDesc: "Décompose un tracé sigillaire ou une chaîne mystique pour localiser le point d'entrée, les pivots de transition et le point de verrouillage.",
    sigilInputLabel: "Chaîne ou Formule à Analyser",
    entryPoint: "Clé d'Entrée (Miftah)",
    transitions: "Pivots de Transition (Mughlaq)",
    exitPoint: "Point de Verrouillage (Qutb)",

    labels: {
      calculate: "Générer",
      copied: "Copié !",
      copy: "Copier la formule",
      downloadSVG: "Télécharger le Sigil (SVG)",
      abjad: "Valeur Abjad",
      element: "Élément Dominant",
      action: "Action Spirituelle"
    }
  },
  en: {
    pageTitle: "Talsams Extraction & Drawing (التلاسم والطلاسم)",
    pageSubtitle: "Sacred engineering of grid sigils, literal reduction, glyph conversion, obfuscation, interlaced fusion, and key path analysis.",
    headerBadge: "Talsams Extraction & Drawing",
    squareLabel: "Square",
    cellLabel: "Cell",
    openLoopText: "open-loop consonants",
    colorLabels: {
      gold: "Sacred Gold",
      emerald: "Emerald",
      crimson: "Ruby",
      indigo: "Lapis"
    },
    jumpOptions: {
      jump2: "Step 2 Jump (Qafza Thana'iyyah)",
      jump3: "Step 3 Jump (Qafza Thulathiyyah)",
      jump4: "Step 4 Jump (Qafza Ruba'iyyah)"
    },

    tabs: {
      wafqSigil: "Khat al-Wafq (Sigil)",
      hurufTalsam: "Talsam al-Huruf (Literal)",
      arqamGlyphs: "Talsam al-Arqam (Glyphs)",
      khafiyy: "Khatim al-Khafiyy (Obfuscated)",
      imtizaj: "Talsam al-Imtizaj (Fusion)",
      miftah: "Miftah al-Talsam (Analyzer)"
    },

    wafqTitle: "1. Khat al-Wafq - Grid Sigil Generator",
    wafqDesc: "Traces the continuous sacred line connecting consecutive numbers in a magic square (1 to 9 for 3x3, or 1 to 16 for 4x4).",
    gridSizeLabel: "Grid Format",
    lineColorLabel: "Trace Color",
    targetValueLabel: "Target Abjad Value (Optional)",
    startNode: "Start (Miftah)",
    endNode: "End (Qutb)",

    hurufTitle: "2. Talsam al-Huruf - Extraction & Jump Method",
    hurufDesc: "Removes letter duplicates from a verse and applies a jump permutation (Qafza) to extract the synthetic formula.",
    verseInputLabel: "Source Verse or Inscription",
    jumpStepLabel: "Jump Step (Qafza Method)",
    uniqueLetters: "Filtered Unique Letters",
    extractedTalsam: "Extracted Final Talsam",
    abjadValueLabel: "Abjad Value of Extraction",

    arqamTitle: "3. Talsam al-Arqam - Traditional Glyphs & Numbers",
    arqamDesc: "Converts decimal numbers into Eastern Arabic magic numerals and esoteric reference symbols.",
    numberInputLabel: "Number or Sum to Convert",
    easternArabicLabel: "Eastern Arabic Numerals (الأرقام المشرقية)",
    esotericGlyphsLabel: "Corresponding Mystical Symbols",

    khafiyyTitle: "4. Khatim al-Khafiyy - Obfuscation & Loop Opening",
    khafiyyDesc: "Strips text of diacritic dots (I'jam) and highlights opened loop consonants (Fath al-Huwar).",
    inputTextLabel: "Text to Obfuscate",
    dotlessTextLabel: "Dotless Text (Rasm Khali min al-Nuqat)",
    openLoopsLabel: "Loop Consonant Analysis (م, ط, ظ, ص, ض, هـ)",

    imtizajTitle: "5. Talsam al-Imtizaj - Fusion & Interlacing",
    imtizajDesc: "Alternately weaves letters of the user's name with those of the sacred formula to create a unified alliance vector.",
    userNameLabel: "Name / Intentions (Subject)",
    divineFormulaLabel: "Sacred Formula / Verse (Object)",
    interlacedResultLabel: "Fused Formula (Talsam al-Imtizaj)",
    elementalBalance: "Elemental Balance of Fusion",

    miftahTitle: "6. Miftah al-Talsam - Path Analyzer",
    miftahDesc: "Deconstructs a sigil trace or mystical chain to pinpoint the entry node, transition pivots, and lock point.",
    sigilInputLabel: "Chain or Formula to Analyze",
    entryPoint: "Entry Key (Miftah)",
    transitions: "Transition Pivots (Mughlaq)",
    exitPoint: "Lock Point (Qutb)",

    labels: {
      calculate: "Generate",
      copied: "Copied!",
      copy: "Copy Formula",
      downloadSVG: "Download Sigil (SVG)",
      abjad: "Abjad Value",
      element: "Dominant Element",
      action: "Spiritual Action"
    }
  },
  ha: {
    pageTitle: "Haka da Zana Hatiman Talsam (التلاسم والطلاسم)",
    pageSubtitle: "Ilimin tsara hatimai na gida, cire haruffan maimaituwa, sauya lambobi zuwa alama, cire digogi da sarrafa rubutu.",
    headerBadge: "Haka da Zana Hatiman Talsam",
    squareLabel: "Gida",
    cellLabel: "Gida",
    openLoopText: "haruffa masu bucle buɗaɗɗu",
    colorLabels: {
      gold: "Zinare Mai Tsarki",
      emerald: "Tsawillu",
      crimson: "Jan Tsawillu",
      indigo: "Shudi"
    },
    jumpOptions: {
      jump2: "Tsallaken Haruffa 2 (Qafza Thana'iyyah)",
      jump3: "Tsallaken Haruffa 3 (Qafza Thulathiyyah)",
      jump4: "Tsallaken Haruffa 4 (Qafza Ruba'iyyah)"
    },

    tabs: {
      wafqSigil: "Khat al-Wafq (Hatimi)",
      hurufTalsam: "Talsam al-Huruf (Rubutu)",
      arqamGlyphs: "Talsam al-Arqam (Alamomi)",
      khafiyy: "Khatim al-Khafiyy (Sullube)",
      imtizaj: "Talsam al-Imtizaj (Patsa)",
      miftah: "Miftah al-Talsam (Mahadaki)"
    },

    wafqTitle: "1. Khat al-Wafq - Zanen Layi a Gidan Wafq",
    wafqDesc: "Zana layin asiri mai hada lambobi daga 1 zuwa 9 ko 16 a gidan kvadrat.",
    gridSizeLabel: "Girman Gida",
    lineColorLabel: "Launin Layi",
    targetValueLabel: "Cikakken Abjad da ake bukata",
    startNode: "Mafarari (Miftah)",
    endNode: "Masarkatariya (Qutb)",

    hurufTitle: "2. Talsam al-Huruf - Hakar Haruffa da Tsallake",
    hurufDesc: "Cire haruffa masu maimaituwa daga aya da tsallake haruffa domin samun kalmar talsam.",
    verseInputLabel: "Ayah ko Rubutun Asiri",
    jumpStepLabel: "Matakin Tsallake (Qafza)",
    uniqueLetters: "Zababbun Haruffa Masu Zaman Kansu",
    extractedTalsam: "Mabuwayin Talsam da aka Hako",
    abjadValueLabel: "Lissafin Abjad na Talsam",

    arqamTitle: "3. Talsam al-Arqam - Lambobin Asiri da Alamomi",
    arqamDesc: "Riddar da lambobin zamani zuwa lambobin gabas da alamomin asiri.",
    numberInputLabel: "Lamba ko Jimlar Abjad",
    easternArabicLabel: "Lambobin Gabas (الأرقام المشرقية)",
    esotericGlyphsLabel: "Alamomin Asiri na Musamman",

    khafiyyTitle: "4. Khatim al-Khafiyy - Cire Digogi da Bude Haruffa",
    khafiyyDesc: "Cire digogi daga rubutun larabci da bayyana bucle din haruffa.",
    inputTextLabel: "Rubutun da za a Sauya",
    dotlessTextLabel: "Rubutu Bada Digogi (Khali min al-Nuqat)",
    openLoopsLabel: "Binciken Haruffa Masu Bucle (م, ط, ظ, ص, ض, هـ)",

    imtizajTitle: "5. Talsam al-Imtizaj - Gamayyar Sunaye",
    imtizajDesc: "Saka haruffan sunan mutum a cikin haruffan aya domin kulla alakarsu.",
    userNameLabel: "Sunan Mutum / Buri",
    divineFormulaLabel: "Aya ko Sunan Allah",
    interlacedResultLabel: "Gamayyar Rubutu (Talsam al-Imtizaj)",
    elementalBalance: "Daidaiton Element na Gamayya",

    miftahTitle: "6. Miftah al-Talsam - Binciken Hanyar Hatimi",
    miftahDesc: "Bincika mafarari, tsakiyar hanyar layi da karshen talsam.",
    sigilInputLabel: "Rubutun Talsam da za a Bincika",
    entryPoint: "Makullin Shiga (Miftah)",
    transitions: "Gidajen Tsakiya (Mughlaq)",
    exitPoint: "Kullataccen Karshe (Qutb)",

    labels: {
      calculate: "Lissafa",
      copied: "An Kwafa!",
      copy: "Kwafi Rubutu",
      downloadSVG: "Sauke Hatimi (SVG)",
      abjad: "Lissafin Abjad",
      element: "Gwarzon Element",
      action: "Aikin Asiri"
    }
  }
};

// Map for Eastern Arabic digits
const EASTERN_ARABIC_DIGITS: Record<string, string> = {
  '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
  '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
};

// Map for esoteric glyph substitutes
const ESOTERIC_GLYPHS: Record<string, string> = {
  '0': '◯', '1': '丨', '2': '⫴', '3': '⩲', '4': '⧉',
  '5': '★', '6': '☿', '7': '☽', '8': '☉', '9': '⚚'
};

// Map to strip diacritic dots from Arabic characters
function stripArabicDots(text: string): string {
  const dotMap: Record<string, string> = {
    'ب': 'ٮ', 'ت': 'ٮ', 'ث': 'ٮ', 'ن': 'ٮ', 'ي': 'ى', 'ئ': 'ى',
    'ج': 'ﺡ', 'خ': 'ﺡ', 'ذ': 'د', 'ز': 'ر', 'ش': 'س', 'ض': 'ص',
    'ظ': 'ط', 'غ': 'ع', 'ف': 'ڡ', 'ق': 'ڡ', 'ة': 'ه'
  };

  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove harakat
    .split('')
    .map(char => dotMap[char] || char)
    .join('');
}

export const TalsamsExtraction: React.FC = () => {
  const { language } = useLanguage();
  const { isPremium } = useAuth();
  const t = UI_TEXTS[(language as keyof typeof UI_TEXTS)] || UI_TEXTS.fr;

  const [activeTab, setActiveTab] = useState<'wafqSigil' | 'hurufTalsam' | 'arqamGlyphs' | 'khafiyy' | 'imtizaj' | 'miftah'>('wafqSigil');

  // Tab 1: Wafq Sigil State
  const [gridType, setGridType] = useState<'3x3' | '4x4'>('3x3');
  const [lineColor, setLineColor] = useState<'gold' | 'emerald' | 'crimson' | 'indigo'>('gold');

  // Tab 2: Talsam Huruf State
  const [verseInput, setVerseInput] = useState('إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا');
  const [jumpStep, setJumpStep] = useState<number>(2);

  // Tab 3: Talsam Arqam State
  const [numberInput, setNumberInput] = useState<number>(786);

  // Tab 4: Khatim Khafiyy State
  const [khafiyyInput, setKhafiyyInput] = useState('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ');

  // Tab 5: Talsam Imtizaj State
  const [userName, setUserName] = useState('محمد');
  const [formulaTarget, setFormulaTarget] = useState('سلام');

  // Tab 6: Miftah Analyzer State
  const [miftahInput, setMiftahInput] = useState('كهيعص');

  const [copied, setCopied] = useState(false);

  // 1. Wafq Grid Nodes Coordinates Calculation
  const wafqGridData = useMemo(() => {
    // 3x3 Ghazali standard coordinates mapping for values 1..9
    //  4  9  2
    //  3  5  7
    //  8  1  6
    const matrix3x3 = [
      [4, 9, 2],
      [3, 5, 7],
      [8, 1, 6]
    ];

    // 4x4 Standard Wafq coordinates for 1..16
    const matrix4x4 = [
      [16, 2, 3, 13],
      [5, 11, 10, 8],
      [9, 7, 6, 12],
      [4, 14, 15, 1]
    ];

    const matrix = gridType === '3x3' ? matrix3x3 : matrix4x4;
    const maxVal = gridType === '3x3' ? 9 : 16;
    const size = gridType === '3x3' ? 3 : 4;

    // Find position of each number 1..maxVal
    const points: { num: number; x: number; y: number }[] = [];
    const cellSize = 280 / size;

    for (let target = 1; target <= maxVal; target++) {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (matrix[r][c] === target) {
            points.push({
              num: target,
              x: c * cellSize + cellSize / 2,
              y: r * cellSize + cellSize / 2
            });
          }
        }
      }
    }

    // Build SVG path string
    const svgPath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

    return { matrix, points, svgPath, size, cellSize };
  }, [gridType]);

  // 2. Huruf Extraction Calculation
  const hurufData = useMemo(() => {
    // Remove diacritics & spaces
    const cleanStr = verseInput
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^ا-ي]/g, '');

    // Get unique letters preserving first appearance
    const uniqueArray: string[] = [];
    for (const char of cleanStr) {
      if (!uniqueArray.includes(char)) {
        uniqueArray.push(char);
      }
    }

    // Apply Qafza jump permutation
    const extractedArray: string[] = [];
    const len = uniqueArray.length;
    if (len > 0) {
      let currIdx = 0;
      const visited = new Set<number>();
      for (let i = 0; i < len; i++) {
        while (visited.has(currIdx)) {
          currIdx = (currIdx + 1) % len;
        }
        extractedArray.push(uniqueArray[currIdx]);
        visited.add(currIdx);
        currIdx = (currIdx + jumpStep) % len;
      }
    }

    const rawTalsamString = extractedArray.join('');
    const talsamString = applyTashkeel(rawTalsamString);
    const abjad = calculateAbjadValue(rawTalsamString);

    return {
      cleanStr,
      uniqueString: uniqueArray.join(''),
      talsamString,
      abjad
    };
  }, [verseInput, jumpStep]);

  // 3. Arqam Conversion Calculation
  const arqamData = useMemo(() => {
    const strVal = String(Math.abs(numberInput));
    const eastern = strVal.split('').map(d => EASTERN_ARABIC_DIGITS[d] || d).join('');
    const esoteric = strVal.split('').map(d => ESOTERIC_GLYPHS[d] || d).join(' ');

    return { eastern, esoteric, original: numberInput };
  }, [numberInput]);

  // 4. Khafiyy Obfuscation Calculation
  const khafiyyData = useMemo(() => {
    const dotless = stripArabicDots(khafiyyInput);
    // Find consonants with closed loops: م, ط, ظ, ص, ض, هـ
    const loopChars = ['م', 'ط', 'ظ', 'ص', 'ض', 'ه'];
    const loopCount = dotless.split('').filter(c => loopChars.includes(c)).length;

    return { dotless, loopCount };
  }, [khafiyyInput]);

  // 5. Imtizaj Interlacing Calculation
  const imtizajData = useMemo(() => {
    const nameArr = userName.replace(/\s+/g, '').split('');
    const formArr = formulaTarget.replace(/\s+/g, '').split('');
    const maxLen = Math.max(nameArr.length, formArr.length);

    const fused: string[] = [];
    for (let i = 0; i < maxLen; i++) {
      if (i < nameArr.length) fused.push(nameArr[i]);
      if (i < formArr.length) fused.push(formArr[i]);
    }

    const rawFusedString = fused.join('');
    const fusedString = applyTashkeel(rawFusedString);
    const abjad = calculateAbjadValue(rawFusedString);

    return { fusedString, abjad };
  }, [userName, formulaTarget]);

  // 6. Miftah Analyzer Calculation
  const miftahData = useMemo(() => {
    const chars = miftahInput.replace(/\s+/g, '').split('');
    if (chars.length === 0) return { entry: '-', transitions: [], exit: '-' };

    const entry = chars[0];
    const exit = chars[chars.length - 1];
    const transitions = chars.slice(1, chars.length - 1);

    return { entry, transitions, exit, total: chars.length };
  }, [miftahInput]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSigilSVG = () => {
    const canvasSize = 600;
    const padding = 60;
    const gridDimension = 480;
    const size = wafqGridData.size;
    const cellSize = gridDimension / size;
    const matrix = wafqGridData.matrix;
    const maxVal = size * size;

    // Recalculate cell centers for centered 600x600 canvas
    const points600: { num: number; x: number; y: number }[] = [];
    for (let target = 1; target <= maxVal; target++) {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (matrix[r][c] === target) {
            points600.push({
              num: target,
              x: padding + c * cellSize + cellSize / 2,
              y: padding + r * cellSize + cellSize / 2
            });
          }
        }
      }
    }

    const svgPath600 = points600.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    const strokeHex = lineColor === 'gold' ? '#f59e0b' : lineColor === 'emerald' ? '#10b981' : lineColor === 'crimson' ? '#ef4444' : '#6366f1';

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasSize} ${canvasSize}" width="${canvasSize}" height="${canvasSize}">
      <rect width="${canvasSize}" height="${canvasSize}" fill="#020617" />
      <rect x="20" y="20" width="${canvasSize - 40}" height="${canvasSize - 40}" fill="none" stroke="#1e293b" stroke-width="2" rx="16" />
      <rect x="28" y="28" width="${canvasSize - 56}" height="${canvasSize - 56}" fill="none" stroke="#334155" stroke-width="1" rx="12" />
      ${Array.from({ length: size + 1 }).map((_, i) => {
        const pos = padding + i * cellSize;
        return `
          <line x1="${pos}" y1="${padding}" x2="${pos}" y2="${padding + gridDimension}" stroke="#334155" stroke-width="2" />
          <line x1="${padding}" y1="${pos}" x2="${padding + gridDimension}" y2="${pos}" stroke="#334155" stroke-width="2" />
        `;
      }).join('')}
      ${points600.map((p) => `<text x="${p.x}" y="${p.y + 6}" text-anchor="middle" fill="#64748b" font-size="18" font-weight="bold" font-family="sans-serif">${p.num}</text>`).join('')}
      <path d="${svgPath600}" fill="none" stroke="${strokeHex}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
      ${points600.length > 0 ? `<circle cx="${points600[0].x}" cy="${points600[0].y}" r="14" fill="none" stroke="#10b981" stroke-width="3.5" />` : ''}
      ${points600.length > 0 ? `<circle cx="${points600[points600.length - 1].x}" cy="${points600[points600.length - 1].y}" r="9" fill="#ef4444" />` : ''}
      <text x="${canvasSize / 2}" y="${canvasSize - 18}" text-anchor="middle" fill="#475569" font-size="12" font-family="sans-serif" font-weight="bold">AsrarHub • Sigil Wafq ${gridType}</text>
    </svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sigil_Wafq_${gridType}_AsrarHub.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadTalsamAsPNG = async (talsamText: string, title: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 600;
    canvas.height = 400;

    // Background
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 600, 400);

    // Border
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 560, 360);

    // Title
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ASRARHUB • TALSAM SACRÉ', 300, 60);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText(title, 300, 90);

    // Talsam Text with Tashkeel
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 36px serif';
    ctx.fillText(talsamText, 300, 220);

    // Footer
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`Poids Abjad : ${calculateAbjadValue(talsamText)}`, 300, 340);

    await downloadCanvasImage(canvas, `Talsam_${title.replace(/\s+/g, '_')}_AsrarHub.png`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 overflow-hidden">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-teal-950 to-indigo-950 text-white p-4 sm:p-8 shadow-2xl border border-teal-500/30">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Feather size={320} />
        </div>
        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} /> {t.headerBadge}
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-amber-100 break-words">
            {t.pageTitle}
          </h1>
          <p className="text-gray-300 text-xs sm:text-base leading-relaxed break-words">
            {t.pageSubtitle}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-gray-200 dark:border-gray-800 pb-3 max-w-full">
        {[
          { id: 'wafqSigil', label: t.tabs.wafqSigil, icon: Grid },
          { id: 'hurufTalsam', label: t.tabs.hurufTalsam, icon: Feather },
          { id: 'arqamGlyphs', label: t.tabs.arqamGlyphs, icon: Hash },
          { id: 'khafiyy', label: t.tabs.khafiyy, icon: Eye },
          { id: 'imtizaj', label: t.tabs.imtizaj, icon: Combine },
          { id: 'miftah', label: t.tabs.miftah, icon: Search }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                isActive
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-950/40'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: KHAT AL-WAFQ (GRID SIGIL) */}
      {activeTab === 'wafqSigil' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-teal-500/30 space-y-6 overflow-hidden max-w-full">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2.5 sm:p-3 bg-teal-100 dark:bg-teal-900/50 rounded-2xl text-teal-600 dark:text-teal-400 shrink-0">
              <Grid size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white break-words">
                {t.wafqTitle}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 break-words leading-normal">
                {t.wafqDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.gridSizeLabel}
              </label>
              <div className="flex gap-2">
                {(['3x3', '4x4'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setGridType(sz)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                      gridType === sz
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t.squareLabel} {sz}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.lineColorLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'gold', color: '#f59e0b', label: t.colorLabels.gold },
                  { id: 'emerald', color: '#10b981', label: t.colorLabels.emerald },
                  { id: 'crimson', color: '#ef4444', label: t.colorLabels.crimson },
                  { id: 'indigo', color: '#6366f1', label: t.colorLabels.indigo }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setLineColor(c.id as any)}
                    className={`flex-1 min-w-[65px] py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      lineColor === c.id ? 'border-teal-500 scale-105 shadow-md' : 'border-gray-200 dark:border-gray-700'
                    }`}
                    style={{ backgroundColor: c.color + '20', color: c.color }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SVG Sigil Trace Canvas */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl space-y-4 max-w-full overflow-hidden">
            <svg viewBox="0 0 280 280" className="w-full max-w-[280px] h-auto rounded-2xl bg-slate-900 border border-slate-800">
              {/* Grid Lines */}
              {Array.from({ length: wafqGridData.size + 1 }).map((_, i) => {
                const pos = i * wafqGridData.cellSize;
                return (
                  <React.Fragment key={i}>
                    <line x1={pos} y1="0" x2={pos} y2="280" stroke="#334155" strokeWidth="1" />
                    <line x1="0" y1={pos} x2="280" y2={pos} stroke="#334155" strokeWidth="1" />
                  </React.Fragment>
                );
              })}

              {/* Grid Cell Numbers */}
              {wafqGridData.points.map((p) => (
                <text
                  key={p.num}
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {p.num}
                </text>
              ))}

              {/* Continuous Sigil Path */}
              <path
                d={wafqGridData.svgPath}
                fill="none"
                stroke={lineColor === 'gold' ? '#f59e0b' : lineColor === 'emerald' ? '#10b981' : lineColor === 'crimson' ? '#ef4444' : '#6366f1'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-lg"
              />

              {/* Start Node Loop (Miftah) */}
              {wafqGridData.points.length > 0 && (
                <circle
                  cx={wafqGridData.points[0].x}
                  cy={wafqGridData.points[0].y}
                  r="8"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
              )}

              {/* End Node Bar (Qutb) */}
              {wafqGridData.points.length > 0 && (
                <circle
                  cx={wafqGridData.points[wafqGridData.points.length - 1].x}
                  cy={wafqGridData.points[wafqGridData.points.length - 1].y}
                  r="5"
                  fill="#ef4444"
                />
              )}
            </svg>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs font-bold text-gray-400 text-center">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> {t.startNode}: {t.cellLabel} 1</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> {t.endNode}: {t.cellLabel} {gridType === '3x3' ? 9 : 16}</span>
            </div>

            <button
              onClick={downloadSigilSVG}
              className="mt-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Download size={16} />
              <span>{t.labels.downloadSVG}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: TALSAM AL-HURUF */}
      {activeTab === 'hurufTalsam' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-amber-500/30 space-y-6 overflow-hidden max-w-full">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2.5 sm:p-3 bg-amber-100 dark:bg-amber-900/50 rounded-2xl text-amber-600 dark:text-amber-400 shrink-0">
              <Feather size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white break-words">
                {t.hurufTitle}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 break-words leading-normal">
                {t.hurufDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.verseInputLabel}
              </label>
              <input
                type="text"
                value={verseInput}
                onChange={(e) => setVerseInput(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold text-sm dir-rtl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.jumpStepLabel}
              </label>
              <select
                value={jumpStep}
                onChange={(e) => setJumpStep(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value={2}>Saut de 2 (Qafza Thana'iyyah)</option>
                <option value={3}>Saut de 3 (Qafza Thulathiyyah)</option>
                <option value={4}>Saut de 4 (Qafza Ruba'iyyah)</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1 overflow-hidden">
              <span className="text-xs font-bold text-gray-500 uppercase">{t.uniqueLetters} :</span>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400 dir-rtl break-all">{hurufData.uniqueString}</p>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase">{t.extractedTalsam} :</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => downloadTalsamAsPNG(hurufData.talsamString, 'Talsam al-Huruf')}
                    className="p-1 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-700 dark:text-amber-300 cursor-pointer"
                    title="Télécharger en PNG"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => handleCopy(hurufData.talsamString)}
                    className="p-1 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-700 dark:text-amber-300 cursor-pointer"
                    title="Copier le Talsam"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <p className="text-xl font-extrabold text-amber-700 dark:text-amber-200 dir-rtl break-all">{hurufData.talsamString}</p>
              <span className="text-xs font-semibold text-gray-500 block">{t.abjadValueLabel} : {hurufData.abjad}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TALSAM AL-ARQAM (GLYPHS) */}
      {activeTab === 'arqamGlyphs' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-indigo-500/30 space-y-6 overflow-hidden max-w-full">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2.5 sm:p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl text-indigo-600 dark:text-indigo-400 shrink-0">
              <Hash size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white break-words">
                {t.arqamTitle}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 break-words leading-normal">
                {t.arqamDesc}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              {t.numberInputLabel}
            </label>
            <input
              type="number"
              value={numberInput}
              onChange={(e) => setNumberInput(Number(e.target.value))}
              className="w-full sm:w-1/2 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-extrabold text-base focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 sm:p-6 bg-gradient-to-br from-indigo-950 to-slate-950 rounded-3xl border border-indigo-500/40 text-center space-y-2 overflow-hidden">
              <span className="text-xs text-indigo-300 font-bold uppercase">{t.easternArabicLabel}</span>
              <p className="text-2xl sm:text-4xl font-extrabold text-indigo-200 dir-rtl break-all">{arqamData.eastern}</p>
            </div>

            <div className="p-5 sm:p-6 bg-gradient-to-br from-purple-950 to-slate-950 rounded-3xl border border-purple-500/40 text-center space-y-2 overflow-hidden">
              <span className="text-xs text-purple-300 font-bold uppercase">{t.esotericGlyphsLabel}</span>
              <p className="text-2xl sm:text-4xl font-extrabold text-amber-300 tracking-widest break-words">{arqamData.esoteric}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KHATIM AL-KHAFIYY */}
      {activeTab === 'khafiyy' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-emerald-500/30 space-y-6 overflow-hidden max-w-full">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2.5 sm:p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400 shrink-0">
              <Eye size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white break-words">
                {t.khafiyyTitle}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 break-words leading-normal">
                {t.khafiyyDesc}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              {t.inputTextLabel}
            </label>
            <input
              type="text"
              value={khafiyyInput}
              onChange={(e) => setKhafiyyInput(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold text-base dir-rtl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="p-5 sm:p-6 bg-slate-950 rounded-3xl border border-slate-800 text-center space-y-4 overflow-hidden">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{t.dotlessTextLabel}</span>
            <p className="text-xl sm:text-3xl font-extrabold text-amber-200 dir-rtl break-all">{khafiyyData.dotless}</p>
            <span className="inline-block px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-full text-xs font-bold break-words">
              {t.openLoopsLabel} : {khafiyyData.loopCount} consonnes à boucles ouvertes
            </span>
          </div>
        </div>
      )}

      {/* TAB 5: TALSAM AL-IMTIZAJ (FUSION) */}
      {activeTab === 'imtizaj' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-purple-500/30 space-y-6 overflow-hidden max-w-full">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2.5 sm:p-3 bg-purple-100 dark:bg-purple-900/50 rounded-2xl text-purple-600 dark:text-purple-400 shrink-0">
              <Combine size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white break-words">
                {t.imtizajTitle}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 break-words leading-normal">
                {t.imtizajDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.userNameLabel}</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold text-sm dir-rtl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.divineFormulaLabel}</label>
              <input
                type="text"
                value={formulaTarget}
                onChange={(e) => setFormulaTarget(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold text-sm dir-rtl"
              />
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 rounded-3xl border border-purple-500/40 text-center space-y-3 overflow-hidden">
            <span className="text-xs font-bold text-amber-400 uppercase">{t.interlacedResultLabel}</span>
            <p className="text-xl sm:text-3xl font-extrabold text-amber-200 dir-rtl tracking-wide break-all">{imtizajData.fusedString}</p>
            <p className="text-xs text-purple-300 font-semibold">{t.labels.abjad} : {imtizajData.abjad}</p>
            <div className="flex justify-center pt-2">
              <button
                onClick={() => downloadTalsamAsPNG(imtizajData.fusedString, 'Talsam al-Imtizaj')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Download size={14} />
                <span>Télécharger le Talsam (PNG)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MIFTAH AL-TALSAM (ANALYZER) */}
      {activeTab === 'miftah' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-blue-500/30 space-y-6 overflow-hidden max-w-full">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2.5 sm:p-3 bg-blue-100 dark:bg-blue-900/50 rounded-2xl text-blue-600 dark:text-blue-400 shrink-0">
              <Search size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white break-words">
                {t.miftahTitle}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 break-words leading-normal">
                {t.miftahDesc}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.sigilInputLabel}</label>
            <input
              type="text"
              value={miftahInput}
              onChange={(e) => setMiftahInput(e.target.value)}
              className="w-full sm:w-2/3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold text-base dir-rtl"
            />
          </div>

          {/* Node Analysis Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 sm:p-5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1 overflow-hidden">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">{t.entryPoint}</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 dir-rtl break-all">{miftahData.entry}</p>
            </div>

            <div className="p-4 sm:p-5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-1 overflow-hidden">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">{t.transitions}</span>
              <p className="text-xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 dir-rtl break-all">
                {miftahData.transitions.join(' - ') || '-'}
              </p>
            </div>

            <div className="p-4 sm:p-5 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-800 space-y-1 overflow-hidden">
              <span className="text-xs font-bold text-red-800 dark:text-red-300 uppercase">{t.exitPoint}</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400 dir-rtl break-all">{miftahData.exit}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalsamsExtraction;
