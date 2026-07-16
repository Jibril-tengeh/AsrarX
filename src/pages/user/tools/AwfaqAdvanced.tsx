import React, { useState } from 'react';
import { ArrowLeft, Hexagon, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

const awfaqDict = {
  fr: {
    title: "Générateur de Awfaq",
    desc: "Générez des carrés magiques (Wafq) sacrés basés sur des calculs ésotériques précis pour vos intentions et zikrs.",
    targetLabel: "Valeur Numérique Cible (Adad)",
    targetPlaceholder: "Ex: 129",
    gridTypeLabel: "Type de Carré (Wafq)",
    generateBtn: "Générer le Carré Magique",
    invalidValue: "Veuillez entrer une valeur valide.",
    needFraction: (val: number) => `La valeur ${val} nécessite un "Kasr" (fraction) dans le carré 3x3.`,
    yourWafq: (size: number) => `Votre Wafq ${size}x${size}`,
    ruleTitle: "Règle de remplissage (Sayr) :",
    ruleDesc: "Pour que le Wafq soit actif spirituellement, il doit être rempli selon l'ordre numérique croissant des maisons (de la cellule 1 à la dernière), tout en respectant l'encens et l'heure planétaire associés à l'objectif."
  },
  en: {
    title: "Awfaq Generator",
    desc: "Generate sacred magic squares (Wafq) based on precise esoteric calculations for your intentions and dhikrs.",
    targetLabel: "Target Numerical Value (Adad)",
    targetPlaceholder: "Ex: 129",
    gridTypeLabel: "Square Type (Wafq)",
    generateBtn: "Generate Magic Square",
    invalidValue: "Please enter a valid value.",
    needFraction: (val: number) => `The value ${val} requires a "Kasr" (fraction) in the 3x3 square.`,
    yourWafq: (size: number) => `Your ${size}x${size} Wafq`,
    ruleTitle: "Filling Rule (Sayr):",
    ruleDesc: "For the Wafq to be spiritually active, it must be filled in ascending numerical order of the houses (from cell 1 to the last), while respecting the incense and planetary hour associated with the objective."
  },
  ha: {
    title: "Mai Samar da Awfaq",
    desc: "Hada rukunin murabba'ai masu albarka (Wafq) bisa ingantattun lissafin sirri don biyan buƙatunku da zikirai.",
    targetLabel: "Darajar Lambar Buƙata (Adad)",
    targetPlaceholder: "Alal misali: 129",
    gridTypeLabel: "Nau'in Murabba'i (Wafq)",
    generateBtn: "Hada Murabba'in Wafq",
    invalidValue: "Da fatan za a shigar da daraja mai kyau.",
    needFraction: (val: number) => `Darajar ${val} tana buƙatar "Kasr" (girma) a cikin murabba'in 3x3.`,
    yourWafq: (size: number) => `Wafq ɗinka na ${size}x${size}`,
    ruleTitle: "Dokar Cikawa (Sayr):",
    ruleDesc: "Don Wafq ya kasance mai tasiri a ruhance, dole ne a cika shi bisa tsari na lambobi masu girma na gidajen (daga gida na 1 zuwa na ƙarshe), tare da kiyaye turare da sa'ar tauraro da ke da alaƙa da manufar."
  }
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
  const dict = awfaqDict[(language as 'fr' | 'en' | 'ha') || 'fr'] || awfaqDict.fr;
  const [targetValue, setTargetValue] = useState<string>('');
  const [gridSize, setGridSize] = useState<number>(3); // 3x3 to 10x10
  const [grid, setGrid] = useState<number[][]>([]);
  const [error, setError] = useState<string>('');

  const generateWafq = () => {
    const val = parseInt(targetValue, 10);
    if (isNaN(val) || val <= 0) {
      setError(dict.invalidValue);
      return;
    }
    setError('');

    // Calculate sum of 0 to n^2 - 1 = n * (n^2 - 1) / 2
    const cn = (gridSize * (gridSize * gridSize - 1)) / 2;

    if (val < cn + gridSize) {
      setError(language === 'fr' 
        ? `Le nombre cible doit être supérieur ou égal à ${cn + gridSize} pour ce type de carré.`
        : language === 'ha'
        ? `Lambar buƙata dole ne ta kasance aƙalla ${cn + gridSize} don wannan nau'in murabba'i.`
        : `The target value must be at least ${cn + gridSize} for this type of square.`
      );
      return;
    }

    const base = Math.floor((val - cn) / gridSize);
    const rem = (val - cn) % gridSize;

    const baseSq = generateBaseMagicSquare(gridSize);
    
    // Add base to all elements, and add rem to the cell that contains (gridSize^2 - 1)
    const maxVal = gridSize * gridSize - 1;
    const newGrid = baseSq.map((row) => 
      row.map((cell) => {
        let finalVal = cell + base;
        if (cell === maxVal) {
          finalVal += rem;
        }
        return finalVal;
      })
    );

    setGrid(newGrid);
  };

  // Adaptive cellular sizes for high gridSize values
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
                { value: 3, label: '3x3' },
                { value: 4, label: '4x4' },
                { value: 5, label: '5x5' },
                { value: 6, label: '6x6' },
                { value: 7, label: '7x7' },
                { value: 8, label: '8x8' },
                { value: 9, label: '9x9' },
                { value: 10, label: '10x10' }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setGridSize(opt.value)}
                  className={`py-2 rounded-xl font-bold text-xs sm:text-sm transition-colors ${gridSize === opt.value ? 'bg-white dark:bg-gray-800 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={generateWafq}
          className="w-full h-[56px] rounded-2xl bg-gradient-to-br from-fuchsia-600 to-pink-700 text-white font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          {dict.generateBtn}
        </button>

        {error && (
          <p className="text-rose-500 font-medium text-sm mt-4 text-center">{error}</p>
        )}
      </div>

      {grid.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center max-w-full">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{dict.yourWafq(gridSize)}</h3>
          
          <div className="w-full overflow-x-auto pb-2 scrollbar-thin flex justify-start sm:justify-center">
            <div className="p-2 bg-gray-100 dark:bg-gray-900/55 rounded-3xl border border-gray-200 dark:border-gray-700/50 min-w-[280px]">
              <div className={`grid gap-1.5 sm:gap-2`} style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
                {grid.map((row, i) => (
                  row.map((cell, j) => (
                    <div 
                      key={`${i}-${j}`}
                      className={`${cellSizeClass} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center font-bold text-gray-900 dark:text-white hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 transition-colors shadow-sm`}
                    >
                      {cell}
                    </div>
                  ))
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 sm:p-6 border border-blue-100 dark:border-blue-800/30 flex items-start gap-4 max-w-2xl w-full">
            <Info className="text-blue-500 shrink-0 mt-1" />
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              <strong>{dict.ruleTitle}</strong> {dict.ruleDesc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
