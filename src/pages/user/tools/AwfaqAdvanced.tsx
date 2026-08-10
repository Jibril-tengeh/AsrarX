import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Hexagon, Info, Flame, Wind, Droplets, Mountain, Compass, Sparkles, Check, Copy, Download, Play, Pause, SkipForward, SkipBack, RotateCcw, FileCode, Printer, Sun, Moon, Layers, Calculator, Feather, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { motion } from 'motion/react';
import { useFeatures } from '../../../contexts/FeatureContext';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { toCanvas } from 'html-to-image';
import { AsrarHubWatermark } from '../../../components/AsrarHubWatermark';
import { KhatimUsageGuide } from '../../../components/KhatimUsageGuide';
import { numberToAbjadLetters } from '../../../utils/abjad';
import { WafqValidator } from '../../../components/WafqValidator';
import { WafqCombine } from '../../../components/WafqCombine';
import { 
  KhatimMethod, 
  KhatimDoor, 
  DAHMOUCH_DOORS, 
  KOUNTIYOU_DOORS, 
  generateAdvancedKhatim 
} from '../../../utils/khatimEngine';

const awfaqDict = {
  fr: {
    title: "Générateur d'Awfaq & Carrés Magiques",
    desc: "Générez des carrés magiques sacrés (Ghazali, Khali al-Wast, Soleil 6x6, Lune 9x9, Wafq al-Huruf, Wafq Combiné & Correcteur).",
    tabGenerator: "1. Générateur d'Awfaq (3x3 à 10x10)",
    tabCombine: "2. Wafq Combiné (Nom Divin + Verset)",
    tabValidator: "3. Wafq Validator (Correcteur - 27)",
    targetLabel: "Valeur Numérique Cible (Adad Total / Jummal)",
    targetPlaceholder: "Ex: 129, 111, 369 ou 1000",
    gridTypeLabel: "Type de Carré (Matrice / Ordre)",
    generateBtn: "Générer le Carré & Alignement Élémentaire",
    invalidValue: "Veuillez entrer une valeur numérique valide.",
    yourWafq: (size: number) => `Wafq Ordinaire et Répartition (${size}x${size})`,
    ruleTitle: "Règle de Remplissage (Ordre du Sayr) :",
    ruleDesc: "Pour activer le Wafq spirituellement, gravez ou écrivez les cases dans l'ordre croissant des maisons (de la Miftah - case 1 - jusqu'à la Mughlaq - dernière case).",
    kasrTitle: "Analyse du Kasr (Fraction / Reste) :",
    elementalTitle: "Alignement des 4 Éléments (Tabai' al-Wafq)",
    khaliWastLabel: "Symbole / Nom de la Case Centrale (Khali al-Wast) :",
    khaliWastPlaceholder: "Ex: الله, يا لطيف, أو اسم الطالب...",
    presetSolarTitle: "Wafq du Soleil (Shamsi 6x6)",
    presetLunarTitle: "Wafq de la Lune (Qamari 9x9)",
    solarDesc: "Proportions solaires (6x6) • Constante 111 • Total 666 • Métal : Or • Dimanche",
    lunarDesc: "Proportions lunaires (9x9) • Constante 369 • Total 3321 • Métal : Argent • Lundi",
    viewModeValues: "Chiffres (Arqam)",
    viewModeLetters: "Lettres Abjad (Wafq al-Huruf / Littéral)",
    viewModeHouses: "Ordre Sayr (Gidaje)",
    viewModeAnim: "Animation du Tracé"
  },
  en: {
    title: "Awfaq & Magic Squares Generator",
    desc: "Generate sacred magic squares (Ghazali, Khali al-Wast, Sun 6x6, Moon 9x9, Wafq al-Huruf, Combined Wafq & Validator).",
    tabGenerator: "1. Awfaq Generator (3x3 to 10x10)",
    tabCombine: "2. Combined Wafq (Divine Name + Verse)",
    tabValidator: "3. Wafq Validator (Corrector - 27)",
    targetLabel: "Target Numerical Value (Total Adad)",
    targetPlaceholder: "Ex: 129, 111, 369 or 1000",
    gridTypeLabel: "Square Type (Grid Order)",
    generateBtn: "Generate Square & Elemental Alignment",
    invalidValue: "Please enter a valid numerical value.",
    yourWafq: (size: number) => `Wafq Grid (${size}x${size})`,
    ruleTitle: "Filling Rule (Sayr Order):",
    ruleDesc: "To activate the Wafq spiritually, fill the cells in ascending house order from cell 1 (Miftah) to the final cell (Mughlaq).",
    kasrTitle: "Kasr (Remainder/Fraction) Analysis:",
    elementalTitle: "4 Elements Alignment",
    khaliWastLabel: "Center Cell Name / Symbol (Khali al-Wast):",
    khaliWastPlaceholder: "Ex: Allah, Ya Latif, or Intention Name...",
    presetSolarTitle: "Wafq of the Sun (Shamsi 6x6)",
    presetLunarTitle: "Wafq of the Moon (Qamari 9x9)",
    solarDesc: "Solar proportions (6x6) • Constant 111 • Total 666 • Metal: Gold • Sunday",
    lunarDesc: "Lunar proportions (9x9) • Constant 369 • Total 3321 • Metal: Silver • Monday",
    viewModeValues: "Numbers (Arqam)",
    viewModeLetters: "Abjad Letters (Wafq al-Huruf)",
    viewModeHouses: "Sayr Order (Houses)",
    viewModeAnim: "Trace Animation"
  },
  ha: {
    title: "Mai Kera Awfaq da Hatimi",
    desc: "Hada Wafq na Ghazali, Khali al-Wast, Rana 6x6, Wata 9x9, Wafq al-Huruf da Hadadden Wafq.",
    tabGenerator: "1. Mai Kera Wafq (3x3 zuwa 10x10)",
    tabCombine: "2. Haɗaɗɗen Wafq (Sunan Allah + Aya)",
    tabValidator: "3. Gwada Wafq (Mai Gyaran Hatimi - 27)",
    targetLabel: "Darajar Lambar Buƙata (Adad)",
    targetPlaceholder: "Alal misali: 129, 111, 369",
    gridTypeLabel: "Nau'in Murabba'i",
    generateBtn: "Générer Wafq",
    invalidValue: "Shigar da darajar lamba mai kyau.",
    yourWafq: (size: number) => `Wafq (${size}x${size})`,
    ruleTitle: "Dokar Cikawa (Sayr):",
    ruleDesc: "Cika gidajen daga gida na 1 zuwa na ƙarshe.",
    kasrTitle: "Kasr Analysis:",
    elementalTitle: "Daidaiton Abubuwa 4",
    khaliWastLabel: "Sunan Tsakiyar Gida (Khali al-Wast):",
    khaliWastPlaceholder: "Misali: Allah, Ya Latif...",
    presetSolarTitle: "Wafq na Rana (Shamsi 6x6)",
    presetLunarTitle: "Wafq na Wata (Qamari 9x9)",
    solarDesc: "Siffar Rana (6x6) • Constant 111 • Total 666 • Zariya • Lahadi",
    lunarDesc: "Siffar Wata (9x9) • Constant 369 • Total 3321 • Azurfa • Litinin",
    viewModeValues: "Lambobi (Arqam)",
    viewModeLetters: "Haruffan Abjad (Wafq al-Huruf)",
    viewModeHouses: "Tsarin Sayr (Gidaje)",
    viewModeAnim: "Kallo na Tracé"
  }
};

// Information on Kasr house placement per square dimension
const KASR_HOUSES: Record<number, { house: number; name: string; desc: string }> = {
  3: { house: 7, name: "Maison 7 (Musabba)", desc: "Le Kasr s'ajoute à la 7ème maison dans le carré Muthallath 3x3 Ghazali." },
  4: { house: 13, name: "Maison 13 (Thalith 'Ashar)", desc: "Le Kasr s'ajoute à la 13ème maison dans le carré Murabba 4x4 Masa'a." },
  5: { house: 21, name: "Maison 21 (Hadi wa 'Ishrun)", desc: "Le Kasr s'ajoute à la 21ème maison dans le carré Mukhammas 5x5." },
  6: { house: 31, name: "Maison 31 (Hadi wa Thilathin)", desc: "Le Kasr s'ajoute à la 31ème maison dans le carré Musaddas 6x6." },
  7: { house: 43, name: "Maison 43 (Thalith wa Arba'in)", desc: "Le Kasr s'ajoute à la 43ème maison dans le carré Musabba 7x7." },
  8: { house: 57, name: "Maison 57 (Sab'a wa Khamsin)", desc: "Le Kasr s'ajoute à la 57ème maison dans le carré Muthamman 8x8." },
  9: { house: 73, name: "Maison 73 (Thalith wa Sab'in)", desc: "Le Kasr s'ajoute à la 73ème maison dans le carré Mutassa 9x9." },
  10: { house: 91, name: "Maison 91 (Hadi wa Tis'in)", desc: "Le Kasr s'ajoute à la 91ème maison dans le carré Mu'ashshar 10x10." },
};

// Helper functions for Magic Squares construction
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
        if (r !== Math.floor(m / 2)) {
          shouldSwap = true;
        }
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
  if (n % 2 !== 0) {
    return generateOddSquare(n);
  } else if (n % 4 === 0) {
    return generateDoublyEvenSquare(n);
  } else {
    return generateSinglyEvenSquare(n);
  }
}

export const AwfaqAdvanced: React.FC = () => {
  const { t, language } = useLanguage();
  const { isPremium } = useAuth();
  const { featureToggles } = useFeatures();
  const disableDuaCopy = !!featureToggles?.disable_dua_copy;
  const dict = awfaqDict[(language as 'fr' | 'en' | 'ha') || 'fr'] || awfaqDict.fr;

  const [activeTab, setActiveTab] = useState<'generator' | 'combine' | 'validator'>('generator');

  const [targetValue, setTargetValue] = useState<string>('129');
  const [gridSize, setGridSize] = useState<number>(3); // 3x3 to 10x10
  const [method, setMethod] = useState<KhatimMethod | 'khali_wast'>('ghazali');
  const [centerSymbol, setCenterSymbol] = useState<string>('الله');
  const [selectedDoor, setSelectedDoor] = useState<number>(1);
  const [activeDoorInfo, setActiveDoorInfo] = useState<KhatimDoor | null>(null);

  const [viewMode, setViewMode] = useState<'values' | 'letters' | 'houses' | 'animation'>('values');
  const [grid, setGrid] = useState<(number | string)[][]>([]);
  const [baseHousesGrid, setBaseHousesGrid] = useState<number[][]>([]);
  const [kasrInfo, setKasrInfo] = useState<{ base: number; rem: number; kasrCellIndex: number; minRequired: number } | null>(null);
  const [copiedGrid, setCopiedGrid] = useState(false);
  const [error, setError] = useState<string>('');
  const wafqRef = useRef<HTMLDivElement>(null);

  // Quick preset handlers for Sun (6x6) and Moon (9x9)
  const applySolarPreset = () => {
    setGridSize(6);
    setTargetValue('111');
    setMethod('ghazali');
    setTimeout(() => {
      generateWafqWithParams(6, 111, 'ghazali');
    }, 50);
  };

  const applyLunarPreset = () => {
    setGridSize(9);
    setTargetValue('369');
    setMethod('ghazali');
    setTimeout(() => {
      generateWafqWithParams(9, 369, 'ghazali');
    }, 50);
  };

  const applyKhaliWastPreset = () => {
    setGridSize(3);
    setTargetValue('129');
    setMethod('khali_wast');
    setTimeout(() => {
      generateWafqWithParams(3, 129, 'khali_wast');
    }, 50);
  };

  // Animation Ghazali State
  const [animStep, setAnimStep] = useState<number>(1);
  const [isAnimPlaying, setIsAnimPlaying] = useState<boolean>(false);
  const [animSpeed, setAnimSpeed] = useState<number>(800);

  const maxSteps = gridSize * gridSize;

  // Auto-play timer for Ghazali order filling animation
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAnimPlaying) {
      timer = setInterval(() => {
        setAnimStep((prev) => {
          if (prev >= maxSteps) {
            setIsAnimPlaying(false);
            return maxSteps;
          }
          return prev + 1;
        });
      }, animSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAnimPlaying, animSpeed, maxSteps]);

  const downloadSVG = () => {
    if (!grid.length) return;
    const size = gridSize;
    const cellSize = 70;
    const padding = 80;
    const width = size * cellSize + padding * 2;
    const height = size * cellSize + padding * 2 + 70;

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#090d16" />
  <!-- Outer Ornate Border -->
  <rect x="15" y="15" width="${width - 30}" height="${height - 30}" fill="none" stroke="#d97706" stroke-width="2.5" rx="16" />
  <rect x="22" y="22" width="${width - 44}" height="${height - 44}" fill="none" stroke="#d97706" stroke-width="1" stroke-dasharray="6,4" rx="12" />
  <!-- Bismillah Header -->
  <text x="${width / 2}" y="52" font-family="'Amiri', 'Traditional Arabic', serif" font-size="22" fill="#f59e0b" text-anchor="middle" font-weight="bold">بسم الله الرحمن الرحيم</text>
  <text x="${width / 2}" y="74" font-family="sans-serif" font-size="12" fill="#9ca3af" text-anchor="middle">Khatim Wafq (${size}x${size}) - Adad Jummal: ${targetValue}</text>
  <!-- Grid Matrix -->
  <g transform="translate(${padding}, ${padding + 25})">
`;

    grid.forEach((row, r) => {
      row.forEach((val, c) => {
        const x = c * cellSize;
        const y = r * cellSize;
        const houseNum = baseHousesGrid[r] ? baseHousesGrid[r][c] + 1 : 0;
        const isKasr = kasrInfo && houseNum === kasrInfo.kasrCellIndex && kasrInfo.rem > 0;

        svgContent += `
    <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${isKasr ? '#1e1b10' : '#111827'}" stroke="#d97706" stroke-width="1.5" />
    <text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 7}" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">${val}</text>
    <text x="${x + cellSize - 6}" y="${y + cellSize - 6}" font-family="sans-serif" font-size="9" fill="#d97706" text-anchor="end">#${houseNum}</text>
`;
      });
    });

    svgContent += `  </g>
  <!-- Footer -->
  <text x="${width / 2}" y="${height - 22}" font-family="sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">Sceau Théurgique - Asrar al-Hikmah</text>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khatim-wafq-${size}x${size}-${targetValue}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadWafqImage = async () => {
    if (!wafqRef.current) return;
    try {
      const canvas = await toCanvas(wafqRef.current, { 
        backgroundColor: '#0f172a',
        pixelRatio: 2,
        quality: 0.98,
        cacheBust: true,
      });
      await downloadCanvasImage(canvas, `wafq-${gridSize}x${gridSize}-${targetValue}.png`);
    } catch (err) {
      console.error('Error exporting Wafq image:', err);
    }
  };

  const generateWafqWithParams = (sz: number, targetVal: number, mth: string) => {
    setError('');
    const cn = (sz * (sz * sz - 1)) / 2;
    const minVal = cn + sz;

    if (targetVal < minVal) {
      setError(`Le nombre cible doit être d'au moins ${minVal} pour ${sz}x${sz}.`);
      return;
    }

    const base = Math.floor((targetVal - cn) / sz);
    const rem = (targetVal - cn) % sz;

    const baseSq = generateBaseMagicSquare(sz);
    const targetHouseIndex = KASR_HOUSES[sz]?.house || (sz * sz - 2);
    let kasrCellVal = targetHouseIndex - 1;

    const midR = Math.floor(sz / 2);
    const midC = Math.floor(sz / 2);

    const newGrid = baseSq.map((row, rIdx) => 
      row.map((cell, cIdx) => {
        if (mth === 'khali_wast' && rIdx === midR && cIdx === midC && sz % 2 !== 0) {
          return centerSymbol.trim() || 'خالي الوسط';
        }
        let finalVal = cell + base;
        if (cell === kasrCellVal) {
          finalVal += rem;
        }
        return finalVal;
      })
    );

    setGrid(newGrid);
    setBaseHousesGrid(baseSq);
    setActiveDoorInfo(null);
    setKasrInfo({
      base,
      rem,
      kasrCellIndex: kasrCellVal + 1,
      minRequired: minVal
    });
  };

  const generateWafq = () => {
    const val = parseInt(targetValue, 10);
    if (isNaN(val) || val <= 0) {
      setError(dict.invalidValue);
      return;
    }
    setError('');

    if (method === 'khali_wast') {
      generateWafqWithParams(gridSize, val, 'khali_wast');
      return;
    }

    if (method !== 'ghazali') {
      try {
        const res = generateAdvancedKhatim(method as KhatimMethod, selectedDoor, gridSize, val);
        setGrid(res.grid);
        setBaseHousesGrid(res.housesGrid);
        setActiveDoorInfo(res.doorInfo || null);
        setKasrInfo({
          base: res.step,
          rem: res.remainder,
          kasrCellIndex: res.kasrHouse,
          minRequired: res.minRequired
        });
        return;
      } catch (e: any) {
        setError(e.message);
        return;
      }
    }

    generateWafqWithParams(gridSize, val, 'ghazali');
  };

  const handleCopyGridText = () => {
    if (disableDuaCopy || grid.length === 0) return;
    if (!isPremium) {
      triggerProtectionModal('copy');
      return;
    }
    const text = grid.map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedGrid(true);
    setTimeout(() => setCopiedGrid(false), 2000);
  };

  // Elemental calculations
  const calculateElementalBalance = () => {
    if (!grid.length) return null;
    let fireSum = 0, airSum = 0, waterSum = 0, earthSum = 0;
    const totalCells = gridSize * gridSize;

    grid.forEach((row, r) => {
      row.forEach((val, c) => {
        const numVal = typeof val === 'number' ? val : (parseInt(val, 10) || 0);
        const elemIndex = (r + c + numVal) % 4;
        if (elemIndex === 0) fireSum += numVal;
        else if (elemIndex === 1) airSum += numVal;
        else if (elemIndex === 2) waterSum += numVal;
        else earthSum += numVal;
      });
    });

    const grandTotal = fireSum + airSum + waterSum + earthSum || 1;
    const firePct = Math.round((fireSum / grandTotal) * 100);
    const airPct = Math.round((airSum / grandTotal) * 100);
    const waterPct = Math.round((waterSum / grandTotal) * 100);
    const earthPct = Math.round((earthSum / grandTotal) * 100);

    // Dominant element
    const elements = [
      { name: 'Feu (Nari - 🌿)', pct: firePct, icon: Flame, color: 'text-rose-500', bg: 'bg-rose-500', incense: 'Luban (Ensens Mâle), Jawi', direction: 'Est (Orient)', hour: 'Soleil / Mars' },
      { name: 'Air (Hawai - 🌬️)', pct: airPct, icon: Wind, color: 'text-amber-500', bg: 'bg-amber-500', incense: 'Oud, Mastic (Santal Blanc)', direction: 'Sud', hour: 'Mercure / Jupiter' },
      { name: 'Eau (Ma\'i - 💧)', pct: waterPct, icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500', incense: 'Musc Blanc, Eau de Rose', direction: 'Nord', hour: 'Lune / Vénus' },
      { name: 'Terre (Turabi - ⛰️)', pct: earthPct, icon: Mountain, color: 'text-emerald-500', bg: 'bg-emerald-500', incense: 'Santal Rouge, Myrrhe', direction: 'Ouest', hour: 'Saturne' }
    ];

    elements.sort((a, b) => b.pct - a.pct);
    const dominant = elements[0];

    return { elements, dominant };
  };

  const elemAnalysis = calculateElementalBalance();

  let cellSizeClass = "w-16 h-16 sm:w-20 sm:h-20 text-lg sm:text-2xl rounded-2xl";
  if (gridSize > 8) {
    cellSizeClass = "w-8 h-8 sm:w-11 sm:h-11 text-xs sm:text-base rounded-md sm:rounded-lg";
  } else if (gridSize > 5) {
    cellSizeClass = "w-10 h-10 sm:w-14 sm:h-14 text-sm sm:text-xl rounded-lg sm:rounded-xl";
  } else if (gridSize > 3) {
    cellSizeClass = "w-12 h-12 sm:w-16 sm:h-16 text-base sm:text-2xl rounded-xl";
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 safe-area-pt min-h-screen pb-24 flex flex-col">
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <Link to="/tools" className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft className="text-gray-600 dark:text-gray-300" size={20} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Hexagon className="text-fuchsia-500 shrink-0" />
            <span className="truncate">{dict.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1">{dict.desc}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-0.5">

      {/* Top Tab Bar Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab('generator')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'generator'
              ? 'bg-fuchsia-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Sparkles size={16} />
          <span>{dict.tabGenerator}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('combine')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'combine'
              ? 'bg-gradient-to-r from-fuchsia-600 to-amber-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Layers size={16} />
          <span>{dict.tabCombine}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('validator')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'validator'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Calculator size={16} />
          <span>{dict.tabValidator}</span>
        </button>
      </div>

      {activeTab === 'combine' && <WafqCombine />}
      {activeTab === 'validator' && <WafqValidator />}

      {activeTab === 'generator' && (
        <>
          {/* Presets Banner for Specialized Wafq Types */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={applyKhaliWastPreset}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 text-left hover:border-amber-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-extrabold text-xs sm:text-sm">
                <Feather size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
                <span>Wafq Khali al-Wast</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-300 mt-1">
                Case centrale vacante pour y inscrire un nom ou symbole sacralisé.
              </p>
            </button>

            <button
              type="button"
              onClick={applySolarPreset}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 text-left hover:border-amber-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs sm:text-sm">
                <Sun size={16} className="text-amber-500 group-hover:rotate-45 transition-transform" />
                <span>{dict.presetSolarTitle}</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-300 mt-1">
                {dict.solarDesc}
              </p>
            </button>

            <button
              type="button"
              onClick={applyLunarPreset}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/30 text-left hover:border-purple-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300 font-extrabold text-xs sm:text-sm">
                <Moon size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
                <span>{dict.presetLunarTitle}</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-300 mt-1">
                {dict.lunarDesc}
              </p>
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm mb-8 space-y-6">
            {/* Method Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Méthode de Génération du Wafq :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-100 dark:bg-gray-900 rounded-2xl p-1.5">
                {[
                  { id: 'ghazali', label: 'Ghazali Standard (الغزالي)' },
                  { id: 'khali_wast', label: 'Khali al-Wast (خالي الوسط)' },
                  { id: 'dahmouch', label: 'Dahmouch (دهموش)' },
                  { id: 'kountiyou', label: 'Kountiyou (الكنتي)' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id as KhatimMethod | 'khali_wast')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      method === m.id
                        ? 'bg-fuchsia-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Center Symbol for Khali al-Wast */}
            {method === 'khali_wast' && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                  {dict.khaliWastLabel}
                </label>
                <input
                  type="text"
                  value={centerSymbol}
                  onChange={(e) => setCenterSymbol(e.target.value)}
                  placeholder={dict.khaliWastPlaceholder}
                  className="w-full bg-white dark:bg-gray-900 border border-amber-300 dark:border-amber-800 rounded-xl p-3 text-base font-arabic font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  dir="rtl"
                />
              </div>
            )}

            {/* Door Selector for Dahmouch / Kountiyou */}
            {(method === 'dahmouch' || method === 'kountiyou') && (
              <div className="bg-slate-900 border border-fuchsia-500/30 p-4 rounded-2xl text-fuchsia-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-fuchsia-300">
                    Choix de la Porte ({method === 'dahmouch' ? 'Dahmouch' : 'Cheikh Al-Kounti'}) :
                  </label>
                  <span className="text-[10px] font-mono text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded-full border border-fuchsia-500/30">
                    Porte {selectedDoor} sur 9
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
                  {(method === 'dahmouch' ? DAHMOUCH_DOORS : KOUNTIYOU_DOORS).map((door) => (
                    <button
                      key={door.id}
                      type="button"
                      onClick={() => setSelectedDoor(door.id)}
                      className={`py-1.5 px-1 text-center rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        selectedDoor === door.id
                          ? 'bg-fuchsia-600 text-white border-fuchsia-400 scale-105 shadow'
                          : 'bg-black/40 text-fuchsia-200/80 border-fuchsia-500/20 hover:bg-black/70'
                      }`}
                    >
                      Porte {door.id}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {dict.targetLabel}
                </label>
                <input
                  type="number"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder={dict.targetPlaceholder}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-xl font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {dict.gridTypeLabel}
                </label>
                <div className="grid grid-cols-4 gap-1.5 bg-gray-100 dark:bg-gray-900 rounded-2xl p-1.5">
                  {[
                    { value: 3, label: '3x3 (Muthallath)' },
                    { value: 4, label: '4x4 (Murabba)' },
                    { value: 5, label: '5x5 (Mukhammas)' },
                    { value: 6, label: '6x6 (Musaddas)' },
                    { value: 7, label: '7x7 (Musabba)' },
                    { value: 8, label: '8x8 (Muthamman)' },
                    { value: 9, label: '9x9 (Mutassa)' },
                    { value: 10, label: '10x10 (Mu\'ashshar)' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setGridSize(opt.value)}
                      className={`py-2 rounded-xl font-bold text-xs sm:text-sm transition-colors ${
                        gridSize === opt.value 
                          ? 'bg-white dark:bg-gray-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm' 
                          : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {opt.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={generateWafq}
              className="w-full h-[56px] rounded-2xl bg-gradient-to-br from-fuchsia-600 to-pink-700 hover:from-fuchsia-500 hover:to-pink-600 text-white font-bold transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={20} />
              {dict.generateBtn}
            </button>

            {error && (
              <p className="text-rose-500 font-medium text-sm mt-4 text-center">{error}</p>
            )}
          </div>
        </>
      )}

      {grid.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Main Grid View */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {dict.yourWafq(gridSize)}
              </h3>

              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setViewMode('values')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    viewMode === 'values' ? 'bg-white dark:bg-gray-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm' : 'text-gray-500 dark:text-gray-300'
                  }`}
                >
                  {dict.viewModeValues}
                </button>
                <button
                  onClick={() => setViewMode('letters')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    viewMode === 'letters' ? 'bg-gradient-to-r from-fuchsia-600 to-amber-600 text-white shadow-sm' : 'text-gray-500 dark:text-gray-300'
                  }`}
                >
                  {dict.viewModeLetters}
                </button>
                <button
                  onClick={() => setViewMode('houses')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    viewMode === 'houses' ? 'bg-white dark:bg-gray-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm' : 'text-gray-500 dark:text-gray-300'
                  }`}
                >
                  {dict.viewModeHouses}
                </button>
                <button
                  onClick={() => {
                    setViewMode('animation');
                    setAnimStep(1);
                    setIsAnimPlaying(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'animation' ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-sm' : 'text-fuchsia-600 dark:text-fuchsia-400 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/30'
                  }`}
                >
                  <Play size={12} />
                  <span>{dict.viewModeAnim}</span>
                </button>
              </div>
            </div>

            {/* Animation Player Control Bar */}
            {viewMode === 'animation' && (
              <div className="w-full bg-fuchsia-50 dark:bg-fuchsia-950/40 border border-fuchsia-200 dark:border-fuchsia-900/50 rounded-2xl p-4 mb-6 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setAnimStep(1);
                        setIsAnimPlaying(false);
                      }}
                      className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                      title="Réinitialiser le tracé"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={() => setAnimStep((prev) => Math.max(1, prev - 1))}
                      disabled={animStep <= 1}
                      className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-40 transition-colors cursor-pointer"
                      title="Étape précédente"
                    >
                      <SkipBack size={16} />
                    </button>
                    <button
                      onClick={() => setIsAnimPlaying(!isAnimPlaying)}
                      className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs flex items-center gap-2 transition-transform active:scale-95 shadow-md cursor-pointer"
                    >
                      {isAnimPlaying ? <Pause size={16} /> : <Play size={16} />}
                      <span>{isAnimPlaying ? "Pause" : animStep >= maxSteps ? "Rejouer" : "Lecture Tracé"}</span>
                    </button>
                    <button
                      onClick={() => setAnimStep((prev) => Math.min(maxSteps, prev + 1))}
                      disabled={animStep >= maxSteps}
                      className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-40 transition-colors cursor-pointer"
                      title="Étape suivante"
                    >
                      <SkipForward size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-300 font-semibold">Vitesse:</span>
                      <select
                        value={animSpeed}
                        onChange={(e) => setAnimSpeed(Number(e.target.value))}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 font-bold text-gray-800 dark:text-gray-200"
                      >
                        <option value={1500}>Lente (1.5s)</option>
                        <option value={800}>Normale (0.8s)</option>
                        <option value={400}>Rapide (0.4s)</option>
                      </select>
                    </div>

                    <span className="font-extrabold text-fuchsia-700 dark:text-fuchsia-300 bg-white dark:bg-gray-800 px-3 py-1 rounded-xl border border-fuchsia-200 dark:border-fuchsia-800">
                      Étape {animStep} / {maxSteps}
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-fuchsia-200 dark:bg-fuchsia-900/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${(animStep / maxSteps) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div ref={wafqRef} className="w-full overflow-x-auto pb-4 scrollbar-thin flex justify-start sm:justify-center p-2 bg-slate-900/10 dark:bg-slate-950/40 rounded-3xl">
              <div className="p-3 bg-gray-100 dark:bg-gray-900/80 rounded-3xl border border-gray-200 dark:border-gray-700/60 shadow-inner relative overflow-hidden">
                <AsrarHubWatermark variant="dark" opacity={0.12} showCentralSeal={true} />
                <div className={`grid gap-1.5 sm:gap-2`} style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
                  {grid.map((row, i) => (
                    row.map((cell, j) => {
                      const houseNum = baseHousesGrid[i][j] + 1;
                      const isKasrCell = kasrInfo && houseNum === kasrInfo.kasrCellIndex;
                      
                      let displayVal: any = cell;
                      if (viewMode === 'letters') {
                        displayVal = typeof cell === 'number' ? numberToAbjadLetters(cell) : cell;
                      } else if (viewMode === 'houses') {
                        displayVal = `M.${houseNum}`;
                      }
                      let isVisibleInAnim = true;
                      let isCurrentAnimHighlight = false;

                      if (viewMode === 'animation') {
                        isVisibleInAnim = houseNum <= animStep;
                        isCurrentAnimHighlight = houseNum === animStep;
                        displayVal = isVisibleInAnim ? cell : `(${houseNum})`;
                      }

                      return (
                        <div 
                          key={`${i}-${j}`}
                          className={`${cellSizeClass} relative ${
                            isCurrentAnimHighlight
                              ? 'bg-fuchsia-600 text-white border-fuchsia-400 ring-4 ring-fuchsia-400/60 scale-105 z-10 shadow-lg'
                              : isKasrCell && kasrInfo && kasrInfo.rem > 0
                              ? 'border-amber-500 ring-2 ring-amber-400/50 bg-amber-50/50 dark:bg-amber-950/30' 
                              : isVisibleInAnim || viewMode !== 'animation'
                              ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              : 'bg-gray-100 dark:bg-gray-900/40 border-gray-200/50 dark:border-gray-800 text-gray-400 dark:text-gray-600 opacity-60'
                          } border flex flex-col items-center justify-center font-bold text-gray-900 dark:text-white transition-all shadow-sm group`}
                        >
                          <span 
                            className={`whitespace-nowrap text-center leading-none px-0.5 max-w-full overflow-hidden ${
                              isCurrentAnimHighlight ? 'text-white text-xl sm:text-2xl font-extrabold animate-pulse' : ''
                            }`}
                            style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all' }}
                            dir="rtl"
                          >
                            {displayVal}
                          </span>

                          {viewMode === 'values' && gridSize <= 6 && (
                            <span className="text-[9px] text-gray-400 dark:text-gray-300 absolute bottom-1 right-1 font-mono">
                              #{houseNum}
                            </span>
                          )}

                          {viewMode === 'animation' && (
                            <span className={`text-[9px] absolute bottom-1 right-1 font-mono ${isCurrentAnimHighlight ? 'text-fuchsia-100' : 'text-gray-400'}`}>
                              #{houseNum}
                            </span>
                          )}

                          {isKasrCell && kasrInfo && kasrInfo.rem > 0 && (
                            <span className="absolute top-1 left-1 bg-amber-500 text-white text-[8px] font-bold px-1 rounded-full">
                              +Kasr ({kasrInfo.rem})
                            </span>
                          )}
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              {!disableDuaCopy && (
                <button
                  onClick={handleCopyGridText}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedGrid ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copiedGrid ? "Wafq copié !" : "Copier la grille (Matrice)"}</span>
                </button>
              )}
              <button
                onClick={handleDownloadWafqImage}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Download size={14} />
                <span>Image PNG</span>
              </button>
              <button
                onClick={downloadSVG}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-fuchsia-600 hover:from-amber-700 hover:to-fuchsia-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <FileCode size={14} />
                <span>Export Vectoriel SVG (Khatim Imprimable)</span>
              </button>
            </div>
          </div>

          {/* Kasr & Sayr Analysis Card */}
          {kasrInfo && (
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-950/30 dark:to-orange-950/30 rounded-3xl p-6 sm:p-8 border border-amber-200 dark:border-amber-800/40">
              <h4 className="text-lg font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 mb-4">
                <Info size={20} className="text-amber-600 dark:text-amber-400" />
                {dict.kasrTitle}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                  <span className="text-gray-500 dark:text-gray-300 text-xs block">Base Miftah (Case 1)</span>
                  <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">{kasrInfo.base}</span>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                  <span className="text-gray-500 dark:text-gray-300 text-xs block">Reste du Kasr (Fraction)</span>
                  <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                    {kasrInfo.rem > 0 ? `+${kasrInfo.rem}` : '0 (Parfait sans fraction)'}
                  </span>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                  <span className="text-gray-500 dark:text-gray-300 text-xs block">Maison du Kasr ({gridSize}x{gridSize})</span>
                  <span className="text-lg font-bold text-amber-700 dark:text-amber-300">
                    {KASR_HOUSES[gridSize]?.name || `Case ${kasrInfo.kasrCellIndex}`}
                  </span>
                </div>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-4 leading-relaxed">
                {KASR_HOUSES[gridSize]?.desc || "Le reste est réparti selon la règle classique des savants du Sirr."}
              </p>
            </div>
          )}

          {/* Elemental Balance Card */}
          {elemAnalysis && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <Sparkles className="text-fuchsia-500" size={20} />
                {dict.elementalTitle}
              </h4>

              {/* Dominant banner */}
              <div className="bg-fuchsia-50 dark:bg-fuchsia-950/30 border border-fuchsia-200 dark:border-fuchsia-800/40 rounded-2xl p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider block">
                    Élément Dominant de ce Wafq
                  </span>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                    {elemAnalysis.dominant.name} ({elemAnalysis.dominant.pct}%)
                  </p>
                </div>
                <div className="flex flex-col sm:items-end text-xs text-gray-600 dark:text-gray-300">
                  <span><strong>Encens Recommandé :</strong> {elemAnalysis.dominant.incense}</span>
                  <span><strong>Orientation :</strong> {elemAnalysis.dominant.direction} • <strong>Heure :</strong> {elemAnalysis.dominant.hour}</span>
                </div>
              </div>

              {/* Progress bars for 4 elements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {elemAnalysis.elements.map((elem) => {
                  const IconComp = elem.icon;
                  return (
                    <div key={elem.name} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                          <IconComp size={16} className={elem.color} />
                          {elem.name}
                        </span>
                        <span className="text-xs font-bold text-gray-500">{elem.pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full ${elem.bg} transition-all duration-500`} style={{ width: `${elem.pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Ritual Usage & Consecration Guide */}
      <KhatimUsageGuide className="mt-8" defaultExpanded={false} />
      </div>
    </div>
  );
};
