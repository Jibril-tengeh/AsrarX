import React, { useState, useRef } from 'react';
import { ArrowLeft, Hexagon, Info, Flame, Wind, Droplets, Mountain, Compass, Sparkles, Check, Copy, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { motion } from 'motion/react';
import { useFeatures } from '../../../contexts/FeatureContext';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { toCanvas } from 'html-to-image';

const awfaqDict = {
  fr: {
    title: "Générateur d'Awfaq Supérieurs (3x3 à 10x10)",
    desc: "Générez des carrés magiques sacrés (Muthallath, Murabba, Mukhammas, etc.) avec répartition du Kasr (fraction) et alignement des 4 éléments.",
    targetLabel: "Valeur Numérique Cible (Adad Total / Jummal)",
    targetPlaceholder: "Ex: 129 ou 1000",
    gridTypeLabel: "Type de Carré (Tard / Wafq)",
    generateBtn: "Générer le Carré & Alignement Élémenaire",
    invalidValue: "Veuillez entrer une valeur numérique valide.",
    yourWafq: (size: number) => `Wafq Ordinaire et Répartition (${size}x${size})`,
    ruleTitle: "Règle de Remplissage (Ordre du Sayr) :",
    ruleDesc: "Pour activer le Wafq spirituellement, gravez ou écrivez les cases dans l'ordre croissant des maisons (de la Miftah - case 1 - jusqu'à la Mughlaq - dernière case).",
    kasrTitle: "Analyse du Kasr (Fraction / Reste) :",
    elementalTitle: "Alignement des 4 Éléments (Tabai' al-Wafq)"
  },
  en: {
    title: "Higher Awfaq Generator (3x3 to 10x10)",
    desc: "Generate sacred magic squares with Kasr (fraction) distribution and 4-element alignment.",
    targetLabel: "Target Numerical Value (Total Adad)",
    targetPlaceholder: "Ex: 129 or 1000",
    gridTypeLabel: "Square Type (Wafq)",
    generateBtn: "Generate Square & Elemental Alignment",
    invalidValue: "Please enter a valid numerical value.",
    yourWafq: (size: number) => `Wafq Grid (${size}x${size})`,
    ruleTitle: "Filling Rule (Sayr Order):",
    ruleDesc: "To activate the Wafq spiritually, fill the cells in ascending house order from cell 1 (Miftah) to the final cell (Mughlaq).",
    kasrTitle: "Kasr (Remainder/Fraction) Analysis:",
    elementalTitle: "4 Elements Alignment"
  },
  ha: {
    title: "Générateur d'Awfaq (3x3 zuwa 10x10)",
    desc: "Hada rukunin murabba'ai masu albarka tare da rarraba Kasr da daidaiton abubuwa 4.",
    targetLabel: "Darajar Lambar Buƙata (Adad)",
    targetPlaceholder: "Alal misali: 129",
    gridTypeLabel: "Nau'in Murabba'i",
    generateBtn: "Générer Wafq",
    invalidValue: "Shigar da darajar lamba mai kyau.",
    yourWafq: (size: number) => `Wafq (${size}x${size})`,
    ruleTitle: "Dokar Cikawa (Sayr):",
    ruleDesc: "Cika gidajen daga gida na 1 zuwa na ƙarshe.",
    kasrTitle: "Kasr Analysis:",
    elementalTitle: "Daidaiton Abubuwa 4"
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

  const [targetValue, setTargetValue] = useState<string>('129');
  const [gridSize, setGridSize] = useState<number>(3); // 3x3 to 10x10
  const [viewMode, setViewMode] = useState<'values' | 'houses'>('values');
  const [grid, setGrid] = useState<number[][]>([]);
  const [baseHousesGrid, setBaseHousesGrid] = useState<number[][]>([]);
  const [kasrInfo, setKasrInfo] = useState<{ base: number; rem: number; kasrCellIndex: number; minRequired: number } | null>(null);
  const [copiedGrid, setCopiedGrid] = useState(false);
  const [error, setError] = useState<string>('');
  const wafqRef = useRef<HTMLDivElement>(null);

  const handleDownloadWafqImage = async () => {
    if (!wafqRef.current) return;
    try {
      const canvas = await toCanvas(wafqRef.current, { backgroundColor: '#0f172a', skipFonts: true });
      await downloadCanvasImage(canvas, `wafq-${gridSize}x${gridSize}-${targetValue}.png`);
    } catch (err) {
      console.error('Error exporting Wafq image:', err);
    }
  };

  const generateWafq = () => {
    const val = parseInt(targetValue, 10);
    if (isNaN(val) || val <= 0) {
      setError(dict.invalidValue);
      return;
    }
    setError('');

    // Sum of sequence 0 to n^2 - 1 = n * (n^2 - 1) / 2
    const cn = (gridSize * (gridSize * gridSize - 1)) / 2;
    const minVal = cn + gridSize;

    if (val < minVal) {
      setError(language === 'fr' 
        ? `Le nombre cible doit être supérieur ou égal à ${minVal} pour ce type de carré (${gridSize}x${gridSize}).`
        : language === 'ha'
        ? `Lambar buƙata dole ne ta kasance aƙalla ${minVal} don wannan murabba'i.`
        : `The target value must be at least ${minVal} for this square type.`
      );
      return;
    }

    const base = Math.floor((val - cn) / gridSize);
    const rem = (val - cn) % gridSize;

    const baseSq = generateBaseMagicSquare(gridSize);
    
    // Kasr cell target is based on the specific house index
    const targetHouseIndex = KASR_HOUSES[gridSize]?.house || (gridSize * gridSize - 2);
    // Find cell containing value equal to targetHouseIndex - 1
    let kasrCellVal = targetHouseIndex - 1;
    if (kasrCellVal >= gridSize * gridSize) {
      kasrCellVal = gridSize * gridSize - 1;
    }

    const newGrid = baseSq.map((row) => 
      row.map((cell) => {
        let finalVal = cell + base;
        if (cell === kasrCellVal) {
          finalVal += rem;
        }
        return finalVal;
      })
    );

    setGrid(newGrid);
    setBaseHousesGrid(baseSq);
    setKasrInfo({
      base,
      rem,
      kasrCellIndex: kasrCellVal + 1,
      minRequired: minVal
    });
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
        // Element distribution by position and cell value
        const elemIndex = (r + c + val) % 4;
        if (elemIndex === 0) fireSum += val;
        else if (elemIndex === 1) airSum += val;
        else if (elemIndex === 2) waterSum += val;
        else earthSum += val;
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/tools" className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft className="text-gray-600 dark:text-gray-300" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Hexagon className="text-fuchsia-500" />
            {dict.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{dict.desc}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
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

      {grid.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Main Grid View */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {dict.yourWafq(gridSize)}
              </h3>

              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl">
                <button
                  onClick={() => setViewMode('values')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'values' ? 'bg-white dark:bg-gray-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Valeurs (Adad)
                </button>
                <button
                  onClick={() => setViewMode('houses')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'houses' ? 'bg-white dark:bg-gray-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Ordre Sayr (Gidaje)
                </button>
              </div>
            </div>

            <div ref={wafqRef} className="w-full overflow-x-auto pb-4 scrollbar-thin flex justify-start sm:justify-center p-2 bg-slate-900/10 dark:bg-slate-950/40 rounded-3xl">
              <div className="p-3 bg-gray-100 dark:bg-gray-900/80 rounded-3xl border border-gray-200 dark:border-gray-700/60 shadow-inner">
                <div className={`grid gap-1.5 sm:gap-2`} style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
                  {grid.map((row, i) => (
                    row.map((cell, j) => {
                      const houseNum = baseHousesGrid[i][j] + 1;
                      const isKasrCell = kasrInfo && houseNum === kasrInfo.kasrCellIndex;
                      const displayVal = viewMode === 'values' ? cell : `M.${houseNum}`;

                      return (
                        <div 
                          key={`${i}-${j}`}
                          className={`${cellSizeClass} relative bg-white dark:bg-gray-800 border ${
                            isKasrCell && kasrInfo && kasrInfo.rem > 0
                              ? 'border-amber-500 ring-2 ring-amber-400/50 bg-amber-50/50 dark:bg-amber-950/30' 
                              : 'border-gray-200 dark:border-gray-700'
                          } flex flex-col items-center justify-center font-bold text-gray-900 dark:text-white hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/30 transition-all shadow-sm group`}
                        >
                          <span>{displayVal}</span>
                          {viewMode === 'values' && (
                            <span className="text-[9px] text-gray-400 dark:text-gray-500 absolute bottom-1 right-1 font-mono">
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

            <div className="flex flex-wrap items-center gap-3 mt-4">
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
                className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <Download size={14} />
                <span>Télécharger l'Image Sacrée (Watermarquée)</span>
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
                  <span className="text-gray-500 dark:text-gray-400 text-xs block">Base Miftah (Case 1)</span>
                  <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">{kasrInfo.base}</span>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                  <span className="text-gray-500 dark:text-gray-400 text-xs block">Reste du Kasr (Fraction)</span>
                  <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                    {kasrInfo.rem > 0 ? `+${kasrInfo.rem}` : '0 (Parfait sans fraction)'}
                  </span>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                  <span className="text-gray-500 dark:text-gray-400 text-xs block">Maison du Kasr ({gridSize}x{gridSize})</span>
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
    </div>
  );
};
