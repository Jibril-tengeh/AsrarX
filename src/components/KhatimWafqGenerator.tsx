import React, { useState, useRef } from 'react';
import { Grid, Sparkles, Copy, Check, RefreshCw, Key, Shield, Flame, BookOpen, Layers, Download, FileDown, Image } from 'lucide-react';
import { motion } from 'motion/react';
import { FULL_28_LETTERS_DATA, LetterInfo } from '../pages/user/tools/ScienceOfLetters';
import { useFeatures } from '../contexts/FeatureContext';
import { useAuth } from '../contexts/AuthContext';
import { triggerProtectionModal } from './ContentProtectionManager';
import { useLanguage } from '../contexts/LanguageContext';
import { KhatimUsageGuide } from './KhatimUsageGuide';
import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { downloadCanvasImage } from '../utils/downloadHelper';
import { notifyDownloadStart, notifyDownloadSuccess, notifyDownloadError } from '../utils/downloadNotification';
import { AsrarHubWatermark } from './AsrarHubWatermark';

const khatimDict = {
  fr: {
    title: "Générateur de Carrés Magiques (Awfaq / Khatim)",
    subtitle: "Génération automatique de carrés mystiques sacrés de 3x3 à 10x10 centrés sur la valeur de la lettre ou sur un montant Abjad personnalisé.",
    chooseLetter: "Choisir la Lettre Clé :",
    customAbjad: "Ou Valeur Abjad Personnalisée :",
    customPlaceholder: "Ex: 111, 353, 786...",
    wafqSize: "Taille du Wafq (3x3 à 10x10) :",
    displayFormat: "Format d'affichage des cases :",
    easternNumbers: "Chiffres Arabes (١٢٣)",
    westernNumbers: "Chiffres Latins (123)",
    letters: "Lettres (الحروف)",
    sacredSeal: "Sceau Sacré du Wafq ({size}x{size})",
    letterSquare: "Carré de la Lettre {name} ({char})",
    customSquare: "Carré Numérique Sur-Mesure",
    totalSum: "Somme Totale",
    rowConstant: "Constante par Ligne",
    angelGuardian: "Ange Gardien du Carré",
    angelInstruction: "À prononcer lors de la traçabilité du Khatim.",
    incenseSupport: "Encens & Support Recommandé",
    defaultIncense: "Luban Dhakar (Oliban) & Musc",
    tracingInstruction: "À tracer sur papier safran à l'heure du lever du Soleil.",
    copyGrid: "Copier la grille du Khatim",
    gridCopied: "Carré copié !"
  },
  en: {
    title: "Magic Square Generator (Awfaq / Khatim)",
    subtitle: "Automatic generation of sacred mystical squares from 3x3 to 10x10 centered on letter values or a custom Abjad total.",
    chooseLetter: "Choose Key Letter:",
    customAbjad: "Or Custom Abjad Value:",
    customPlaceholder: "Ex: 111, 353, 786...",
    wafqSize: "Wafq Size (3x3 to 10x10):",
    displayFormat: "Cell Display Format:",
    easternNumbers: "Eastern Arabic (١٢٣)",
    westernNumbers: "Western Digits (123)",
    letters: "Abjad Letters (الحروف)",
    sacredSeal: "Sacred Seal of Wafq ({size}x{size})",
    letterSquare: "Square of Letter {name} ({char})",
    customSquare: "Custom Numerical Square",
    totalSum: "Total Sum",
    rowConstant: "Row Constant",
    angelGuardian: "Guardian Angel of the Square",
    angelInstruction: "To be pronounced when tracing the Khatim.",
    incenseSupport: "Incense & Recommended Support",
    defaultIncense: "Frankincense (Luban) & Musk",
    tracingInstruction: "To be traced on saffron paper at sunrise.",
    copyGrid: "Copy Khatim Grid",
    gridCopied: "Square Copied!"
  },
  ha: {
    title: "Mai Wafq da Khatimi (Awfaq / Khatim)",
    subtitle: "Hada wafq na asiri na 3x3 zuwa 10x10 bisa ga ma'aunin harafi ko adadin Abjad da ka zaba.",
    chooseLetter: "Zabi Harfin Makulli:",
    customAbjad: "Ko Lambar Abjad Ta Musamman:",
    customPlaceholder: "Misali: 111, 353, 786...",
    wafqSize: "Girman Wafq (3x3 zuwa 10x10):",
    displayFormat: "Yanayin Nuna Kwayoyin Wafq:",
    easternNumbers: "Lambar Larabci (١٢٣)",
    westernNumbers: "Lambar Turanci (123)",
    letters: "Haruffan Abjad (الحروف)",
    sacredSeal: "Khatimin Wafq Mai Tsarki ({size}x{size})",
    letterSquare: "Wafq na Harafi {name} ({char})",
    customSquare: "Wafq na Lambobi na Musamman",
    totalSum: "Jimillar Adadi",
    rowConstant: "Adadin Layi Daya",
    angelGuardian: "Mala'ikan Tsaron Wafq",
    angelInstruction: "A karanta lokacin rubuta Khatimi.",
    incenseSupport: "Turare da Abin Rubutu",
    defaultIncense: "Turaren Luban Dhakar da Musk",
    tracingInstruction: "A rubuta a kan takardar za'afaran da hualowar rana.",
    copyGrid: "Kwafi Jadawalin Khatimi",
    gridCopied: "An Kwafi Jadawalin!"
  }
};

// Convert integer to Eastern Arabic Numerals
const toEasternArabicNumerals = (num: number): string => {
  const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, (w) => digits[parseInt(w, 10)]);
};

// Convert number to corresponding Arabic Letter by Abjad value approximation
const numberToAbjadLetter = (num: number): string => {
  const letterMap: { [val: number]: string } = {
    1: 'ا', 2: 'ب', 3: 'ج', 4: 'د', 5: 'ه', 6: 'و', 7: 'ز', 8: 'ح', 9: 'ط', 10: 'ي',
    20: 'ك', 30: 'ل', 40: 'م', 50: 'ن', 60: 'س', 70: 'ع', 80: 'ف', 90: 'ص', 100: 'ق',
    200: 'ر', 300: 'ش', 400: 'ت', 500: 'ث', 600: 'خ', 700: 'ذ', 800: 'ض', 900: 'ظ', 1000: 'غ'
  };

  if (letterMap[num]) return letterMap[num];
  return toEasternArabicNumerals(num);
};

// Helper algorithms for 3x3 to 10x10 Magic Squares
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

export const KhatimWafqGenerator: React.FC = () => {
  const { language } = useLanguage();
  const dict = khatimDict[(language as 'fr' | 'en' | 'ha') || 'fr'] || khatimDict.fr;
  const { featureToggles } = useFeatures();
  const { isPremium } = useAuth();
  const disableDuaCopy = !!featureToggles?.disable_dua_copy;

  const [selectedLetterChar, setSelectedLetterChar] = useState<string>('ا');
  const [wafqSize, setWafqSize] = useState<number>(3); // 3x3 to 10x10
  const [displayMode, setDisplayMode] = useState<'western' | 'eastern' | 'letters'>('eastern');
  const [customValue, setCustomValue] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadWafqPNG = async () => {
    if (!cardRef.current) return;
    const fname = `wafq-${wafqSize}x${wafqSize}-${targetAbjad}.png`;
    notifyDownloadStart(fname);
    try {
      const canvas = await toCanvas(cardRef.current, { backgroundColor: '#0f172a', skipFonts: true });
      await downloadCanvasImage(canvas, fname);
    } catch (e) {
      console.error('Download Wafq error:', e);
      notifyDownloadError(fname);
    }
  };

  const downloadWafqPDF = async () => {
    if (!cardRef.current) return;
    const fname = `AsrarHub_Wafq_${wafqSize}x${wafqSize}_${targetAbjad}.pdf`;
    notifyDownloadStart(fname);
    try {
      const canvas = await toCanvas(cardRef.current, { backgroundColor: '#0f172a', skipFonts: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, 210, 297, 'F');
      pdf.setTextColor(245, 158, 11);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.text("AsrarHub - Khatim & Wafq Sacre", 105, 30, { align: 'center' });
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`Wafq ${wafqSize}x${wafqSize} (Poids Abjad: ${targetAbjad})`, 105, 42, { align: 'center' });
      
      const imgWidth = 130;
      const imgHeight = 130;
      const x = (210 - imgWidth) / 2;
      const y = 60;
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      pdf.setFontSize(10);
      pdf.setTextColor(156, 163, 175);
      pdf.text("À tracer avec de l'encre de safran et de l'eau de rose lors de l'heure favorable.", 105, 205, { align: 'center' });
      pdf.save(fname);
      notifyDownloadSuccess(fname);
    } catch (e) {
      console.error('PDF error:', e);
      notifyDownloadError(fname);
    }
  };

  // Compute total target Abjad
  const getTargetAbjad = (): number => {
    if (customValue.trim() && !isNaN(parseInt(customValue.trim(), 10))) {
      return Math.max(15, parseInt(customValue.trim(), 10));
    }

    const foundLetter = FULL_28_LETTERS_DATA.find(l => l.char === selectedLetterChar);
    if (foundLetter) {
      return foundLetter.abjadKabir > 0 ? foundLetter.abjadKabir : foundLetter.abjad * 12;
    }
    return 111; // Default Alif
  };

  const targetAbjad = getTargetAbjad();

  // Generate Wafq Grid for dimension size (3x3 to 10x10)
  const generateWafqGrid = (n: number, total: number): number[][] => {
    // Traditional 3x3 Ghazali
    if (n === 3) {
      const base = Math.floor((total - 12) / 3);
      const remainder = (total - 12) % 3;
      const seq = Array(10).fill(0);
      for (let i = 1; i <= 9; i++) {
        let val = base + (i - 1);
        if (i >= 7 && remainder >= 1) val += 1;
        if (i >= 8 && remainder >= 2) val += 1;
        seq[i] = Math.max(1, val);
      }
      return [
        [seq[4], seq[9], seq[2]],
        [seq[3], seq[5], seq[7]],
        [seq[8], seq[1], seq[6]]
      ];
    }

    // Traditional 4x4 Al-Masa'a
    if (n === 4) {
      const base = Math.floor((total - 30) / 4);
      const remainder = (total - 30) % 4;
      const seq = Array(17).fill(0);
      for (let i = 1; i <= 16; i++) {
        let val = base + (i - 1);
        if (i >= 13 && remainder >= 1) val += 1;
        if (i >= 14 && remainder >= 2) val += 1;
        if (i >= 15 && remainder >= 3) val += 1;
        seq[i] = Math.max(1, val);
      }
      return [
        [seq[1], seq[15], seq[14], seq[4]],
        [seq[12], seq[6], seq[7], seq[9]],
        [seq[8], seq[10], seq[11], seq[5]],
        [seq[13], seq[3], seq[2], seq[16]]
      ];
    }

    // Dynamic N x N (5x5 to 10x10)
    const cn = (n * (n * n - 1)) / 2;
    const base = Math.floor((total - cn) / n);
    const rem = (total - cn) % n;
    const baseSq = generateBaseMagicSquare(n);
    const maxVal = n * n - 1;

    return baseSq.map(row =>
      row.map(cell => {
        let val = cell + base + 1; // Convert 0-indexed to 1-indexed
        if (cell === maxVal) val += rem;
        return Math.max(1, val);
      })
    );
  };

  const wafqGrid = generateWafqGrid(wafqSize, targetAbjad);

  // Magic constant sum per row
  const rowSum = wafqGrid[0].reduce((a, b) => a + b, 0);

  // Derived Angelic Guardian: Target Abjad + 51
  const angelCodeVal = targetAbjad + 51;
  const angelName = `عَطْفَيَائِيلُ (Cote: ${angelCodeVal})`;

  const formatCellValue = (val: number): string => {
    if (displayMode === 'eastern') return toEasternArabicNumerals(val);
    if (displayMode === 'letters') return numberToAbjadLetter(val);
    return String(val);
  };

  const handleCopyGrid = () => {
    if (disableDuaCopy) return;
    if (!isPremium) {
      triggerProtectionModal('copy');
      return;
    }
    const gridText = wafqGrid.map(row => row.map(v => formatCellValue(v)).join('\t')).join('\n');
    navigator.clipboard.writeText(`Wafq Khatim (${wafqSize}x${wafqSize}) - Total Abjad: ${targetAbjad}\n\n${gridText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentLetterInfo = FULL_28_LETTERS_DATA.find(l => l.char === selectedLetterChar);

  // Responsive styling depending on grid size
  const getCellSizeClass = (size: number) => {
    if (size <= 3) return "w-16 h-16 sm:w-20 sm:h-20 text-lg sm:text-2xl font-bold rounded-xl sm:rounded-2xl";
    if (size <= 4) return "w-12 h-12 sm:w-16 sm:h-16 text-base sm:text-xl font-bold rounded-lg sm:rounded-xl";
    if (size <= 6) return "w-10 h-10 sm:w-12 sm:h-12 text-xs sm:text-base font-bold rounded-md sm:rounded-lg";
    if (size <= 8) return "w-8 h-8 sm:w-10 sm:h-10 text-[11px] sm:text-xs font-semibold rounded";
    return "w-7 h-7 sm:w-8 sm:h-8 text-[9px] sm:text-[11px] font-semibold rounded-[3px] p-0.5";
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
      {/* Title */}
      <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Grid className="text-amber-500" /> {dict.title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          {dict.subtitle}
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Letter Selector */}
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1 font-medium">{dict.chooseLetter}</label>
          <select
            value={selectedLetterChar}
            onChange={(e) => {
              setSelectedLetterChar(e.target.value);
              setCustomValue('');
            }}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-arabic font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {FULL_28_LETTERS_DATA.map(l => (
              <option key={l.char} value={l.char}>
                {l.char} - {l.name} (Abjad: {l.abjad})
              </option>
            ))}
          </select>
        </div>

        {/* Custom Abjad Value Input */}
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1 font-medium">{dict.customAbjad}</label>
          <input
            type="number"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder={dict.customPlaceholder}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Wafq Dimension & Format */}
        <div className="md:col-span-1">
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1 font-medium">{dict.wafqSize}</label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
            {[3, 4, 5, 6, 7, 8, 9, 10].map((sz) => (
              <button
                key={sz}
                onClick={() => setWafqSize(sz)}
                className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  wafqSize === sz ? 'bg-amber-500 text-black shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400'
                }`}
              >
                {sz}x{sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Display Mode Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 dark:bg-gray-900/60 p-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs gap-2">
        <span className="font-bold text-gray-700 dark:text-gray-300">{dict.displayFormat}</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDisplayMode('eastern')}
            className={`px-3 py-1 rounded-lg font-arabic font-bold cursor-pointer ${
              displayMode === 'eastern' ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {dict.easternNumbers}
          </button>
          <button
            onClick={() => setDisplayMode('western')}
            className={`px-3 py-1 rounded-lg font-mono font-bold cursor-pointer ${
              displayMode === 'western' ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {dict.westernNumbers}
          </button>
          <button
            onClick={() => setDisplayMode('letters')}
            className={`px-3 py-1 rounded-lg font-arabic font-bold cursor-pointer ${
              displayMode === 'letters' ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {dict.letters}
          </button>
        </div>
      </div>

      {/* Main Khatim Wafq Render Card */}
      <div ref={cardRef} className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-950/90 via-slate-900 to-amber-950/90 text-white shadow-2xl border border-amber-500/40 relative overflow-hidden space-y-6">
        {/* Automatic AsrarHub Watermark Overlay */}
        <AsrarHubWatermark variant="gold" opacity={0.18} showCentralSeal={true} />

        {/* Top Header info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-amber-500/20 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1">
              <Sparkles size={12} /> {dict.sacredSeal.replaceAll('{size}', String(wafqSize))}
            </span>
            <h3 className="text-xl font-black text-amber-100 mt-1">
              {currentLetterInfo ? dict.letterSquare.replace('{name}', currentLetterInfo.name).replace('{char}', currentLetterInfo.char) : dict.customSquare}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] text-gray-400 block font-mono">{dict.totalSum}</span>
              <span className="text-lg font-extrabold text-amber-300 font-mono">{targetAbjad}</span>
            </div>
            <div className="text-right pl-3 border-l border-amber-500/30">
              <span className="text-[10px] text-gray-400 block font-mono">{dict.rowConstant}</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{rowSum}</span>
            </div>
          </div>
        </div>

        {/* WAFQ GRID VISUAL DISPLAY */}
        <div className="w-full overflow-x-auto pb-2 custom-scrollbar touch-pan-x overscroll-x-contain flex justify-start sm:justify-center my-4">
          <div 
            className={`p-3 sm:p-5 bg-slate-950/90 border-2 border-amber-500/60 rounded-2xl shadow-2xl relative min-w-fit ${
              disableDuaCopy ? 'select-none' : ''
            }`}
            onCopy={(e) => { if (disableDuaCopy) e.preventDefault(); }}
            onContextMenu={(e) => { if (disableDuaCopy) e.preventDefault(); }}
          >
            {/* Corner Ornamental Symbols */}
            <span className="absolute top-1 left-2 text-[10px] text-amber-500/50 font-arabic">﷽</span>
            <span className="absolute top-1 right-2 text-[10px] text-amber-500/50 font-arabic">الله</span>
            <span className="absolute bottom-1 left-2 text-[10px] text-amber-500/50 font-arabic">محمد</span>
            <span className="absolute bottom-1 right-2 text-[10px] text-amber-500/50 font-arabic">علي</span>

            <div 
              className="grid gap-1 sm:gap-2 pt-2"
              style={{ gridTemplateColumns: `repeat(${wafqSize}, minmax(0, 1fr))` }}
            >
              {wafqGrid.map((row, rIdx) =>
                row.map((cellVal, cIdx) => (
                  <motion.div
                    key={`${rIdx}-${cIdx}`}
                    whileHover={{ scale: 1.03 }}
                    className={`${getCellSizeClass(wafqSize)} bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/40 flex items-center justify-center text-center shadow-inner group hover:border-amber-300 transition-colors cursor-pointer shrink-0`}
                  >
                    <span className="font-arabic text-amber-200 group-hover:text-white transition-colors" dir="rtl">
                      {formatCellValue(cellVal)}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Ritual & Servitor Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-amber-500/20">
          <div className="p-3 bg-black/40 rounded-xl border border-amber-500/20 space-y-1">
            <span className="text-amber-400 font-bold block flex items-center gap-1">
              <Shield size={12} /> {dict.angelGuardian}
            </span>
            <p className="text-gray-200 font-arabic text-sm">{angelName}</p>
            <p className="text-[10px] text-gray-400">{dict.angelInstruction}</p>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-amber-500/20 space-y-1">
            <span className="text-amber-400 font-bold block flex items-center gap-1">
              <Flame size={12} /> {dict.incenseSupport}
            </span>
            <p className="text-gray-200">
              {currentLetterInfo ? currentLetterInfo.incense : dict.defaultIncense}
            </p>
            <p className="text-[10px] text-gray-400">{dict.tracingInstruction}</p>
          </div>
        </div>

        {/* Actions Bar (Copy & Download Buttons) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-500/20">
          <div className="flex items-center gap-2">
            <button
              onClick={downloadWafqPNG}
              className="px-3.5 py-2 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-200 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Image size={14} className="text-amber-400" />
              <span>PNG HD</span>
            </button>
            <button
              onClick={downloadWafqPDF}
              className="px-3.5 py-2 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-200 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <FileDown size={14} className="text-red-400" />
              <span>PDF Imprimable</span>
            </button>
          </div>

          {!disableDuaCopy && (
            <button
              onClick={handleCopyGrid}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? dict.gridCopied : dict.copyGrid}</span>
            </button>
          )}
        </div>
      </div>

      {/* Comprehensive Ritual & Practice Usage Guide */}
      <KhatimUsageGuide className="mt-8" defaultExpanded={true} />
    </div>
  );
};
