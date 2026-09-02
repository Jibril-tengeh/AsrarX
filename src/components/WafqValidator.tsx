import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, RotateCcw, Sparkles, Calculator, Check, X, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const dict = {
  fr: {
    title: "27. Wafq Validator — Correcteur & Vérificateur",
    subtitle: "Saisissez les valeurs de votre carré magique pour vérifier mathématiquement la régularité des sommes (lignes, colonnes et diagonales).",
    sizeLabel: "Ordre du Carré :",
    validTitle: "Wafq Parfaitement Valide !",
    validDesc: "Toutes les sommes des lignes, colonnes et diagonales sont rigoureusement égales à la constante magique :",
    invalidTitle: "Erreurs de Sommes Détectées",
    invalidDesc: "Des divergences de sommes ont été identifiées dans la grille. Vérifiez les cases surlignées ci-dessous.",
    magicConstant: "Constante Magique (M) :",
    totalSum: "Somme Totale de la Grille :",
    rowSums: "Sommes des Lignes (R) :",
    colSums: "Sommes des Colonnes (C) :",
    diagPrimary: "Diagonale Principale (↘) :",
    diagSecondary: "Diagonale Secondaire (↙) :",
    presetValid3x3: "Exemple 3x3 Valide (Ghazali - 15)",
    presetValid4x4: "Exemple 4x4 Valide (Masa'a - 34)",
    resetBtn: "Réinitialiser la Grille",
    cellPlaceholder: "0",
    discrepancyNote: "Surlignage rouge : Somme incorrecte par rapport à la constante attendue."
  },
  en: {
    title: "27. Wafq Validator — Magic Square Corrector",
    subtitle: "Enter the values of your magic square to mathematically verify line, column, and diagonal sums.",
    sizeLabel: "Square Dimension:",
    validTitle: "Wafq Perfectly Valid!",
    validDesc: "All row, column, and diagonal sums strictly equal the magic constant:",
    invalidTitle: "Sum Errors Detected",
    invalidDesc: "Discrepancies found in grid sums. Please verify the highlighted cells below.",
    magicConstant: "Magic Constant (M):",
    totalSum: "Grid Total Sum:",
    rowSums: "Row Sums (R):",
    colSums: "Column Sums (C):",
    diagPrimary: "Main Diagonal (↘):",
    diagSecondary: "Secondary Diagonal (↙):",
    presetValid3x3: "Valid 3x3 Sample (Ghazali - 15)",
    presetValid4x4: "Valid 4x4 Sample (Masa'a - 34)",
    resetBtn: "Reset Grid",
    cellPlaceholder: "0",
    discrepancyNote: "Red highlight: Incorrect sum compared to expected magic constant."
  },
  ha: {
    title: "27. Injin Gwada Wafq — Mai Gyaran Hatimi",
    subtitle: "Shigar da lambobi a raga don tabbatar da daidaiton lissafin jimloli (layi, rukunai da kusurwoyi).",
    sizeLabel: "Girman Murabba'i:",
    validTitle: "Wafq Yana da Kyau da Daidaito!",
    validDesc: "Duk jimlolin layuka, rukunai da sassan daidaiku suna daidai da lambar albarka:",
    invalidTitle: "An Samu Kuskure a Lissafi",
    invalidDesc: "Akwai bambancin lissafi a cikin raga. Duba gidajen da aka maida ja.",
    magicConstant: "Lambar Daidaito (M):",
    totalSum: "Jimillar Raga Gaba Ɗaya:",
    rowSums: "Jimillar Layuka (R):",
    colSums: "Jimillar Rukunai (C):",
    diagPrimary: "Kusurwa ta 1 (↘):",
    diagSecondary: "Kusurwa ta 2 (↙):",
    presetValid3x3: "Kayan Gwada 3x3 (Ghazali - 15)",
    presetValid4x4: "Kayan Gwada 4x4 (Masa'a - 34)",
    resetBtn: "Sake Fara Raga",
    cellPlaceholder: "0",
    discrepancyNote: "Ja : Kuskuren lissafi a kan lambar da ake tsammani."
  }
};

export const WafqValidator: React.FC = () => {
  const { language } = useLanguage();
  const t = dict[(language as 'fr' | 'en' | 'ha') || 'fr'] || dict.fr;

  const [gridSize, setGridSize] = useState<number>(3);
  const [gridValues, setGridValues] = useState<string[][]>(
    Array.from({ length: 3 }, () => Array(3).fill(''))
  );

  // Load sample 3x3
  const loadValid3x3 = () => {
    setGridSize(3);
    setGridValues([
      ['4', '9', '2'],
      ['3', '5', '7'],
      ['8', '1', '6']
    ]);
  };

  // Load sample 4x4
  const loadValid4x4 = () => {
    setGridSize(4);
    setGridValues([
      ['16', '2', '3', '13'],
      ['5', '11', '10', '8'],
      ['9', '7', '6', '12'],
      ['4', '14', '15', '1']
    ]);
  };

  const handleSizeChange = (newSize: number) => {
    setGridSize(newSize);
    setGridValues(Array.from({ length: newSize }, () => Array(newSize).fill('')));
  };

  const handleCellChange = (r: number, c: number, val: string) => {
    const updated = gridValues.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );
    setGridValues(updated);
  };

  const handleReset = () => {
    setGridValues(Array.from({ length: gridSize }, () => Array(gridSize).fill('')));
  };

  // Calculate row, column, and diagonal sums
  const numericGrid = gridValues.map(row =>
    row.map(cell => {
      const num = parseInt(cell, 10);
      return isNaN(num) ? 0 : num;
    })
  );

  const rowSums = numericGrid.map(row => row.reduce((a, b) => a + b, 0));
  const colSums = Array.from({ length: gridSize }, (_, c) =>
    numericGrid.reduce((sum, row) => sum + row[c], 0)
  );

  let diag1Sum = 0;
  let diag2Sum = 0;
  for (let i = 0; i < gridSize; i++) {
    diag1Sum += numericGrid[i][i];
    diag2Sum += numericGrid[i][gridSize - 1 - i];
  }

  const grandTotal = rowSums.reduce((a, b) => a + b, 0);

  // Expected magic constant if filled with 1..n^2
  const expectedMagicConstant = (gridSize * (gridSize * gridSize + 1)) / 2;

  // Determine target constant: first valid non-zero row sum or expected constant
  const targetConstant = rowSums.find(s => s > 0) || expectedMagicConstant;

  // Verification checks
  const allRowsValid = rowSums.every(s => s === targetConstant && s > 0);
  const allColsValid = colSums.every(s => s === targetConstant && s > 0);
  const diag1Valid = diag1Sum === targetConstant && diag1Sum > 0;
  const diag2Valid = diag2Sum === targetConstant && diag2Sum > 0;

  const isValidMagicSquare = allRowsValid && allColsValid && diag1Valid && diag2Valid;
  const isFilled = numericGrid.some(row => row.some(cell => cell > 0));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calculator className="text-amber-500" size={22} />
            <span>{t.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadValid3x3}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition-colors cursor-pointer"
          >
            {t.presetValid3x3}
          </button>
          <button
            type="button"
            onClick={loadValid4x4}
            className="px-3 py-1.5 rounded-xl bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-500/30 text-xs font-bold hover:bg-fuchsia-500/20 transition-colors cursor-pointer"
          >
            {t.presetValid4x4}
          </button>
        </div>
      </div>

      {/* Grid Dimension Selector */}
      <div className="flex flex-wrap items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{t.sizeLabel}</span>
        {[3, 4, 5, 6, 7].map((size, sIdx) => (
          <button
            key={`wafq-val-sz-${size}-${sIdx}`}
            type="button"
            onClick={() => handleSizeChange(size)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              gridSize === size
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {size}x{size}
          </button>
        ))}
        <button
          type="button"
          onClick={handleReset}
          className="ml-auto px-3 py-1.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-gray-300 flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>{t.resetBtn}</span>
        </button>
      </div>

      {/* Validation Result Banner */}
      {isFilled && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
            isValidMagicSquare
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
          }`}
        >
          {isValidMagicSquare ? (
            <CheckCircle2 size={24} className="text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle size={24} className="text-rose-500 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-bold text-base">
              {isValidMagicSquare ? t.validTitle : t.invalidTitle}
            </h4>
            <p className="text-xs mt-1 leading-relaxed">
              {isValidMagicSquare ? t.validDesc : t.invalidDesc}
            </p>
            {isValidMagicSquare && (
              <div className="mt-2 inline-flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-xl font-mono text-sm font-extrabold text-emerald-800 dark:text-emerald-200">
                <span>{t.magicConstant}</span>
                <span>{targetConstant}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Matrix Input & Sum Display */}
      <div className="overflow-x-auto pb-2 flex justify-center">
        <div className="inline-block p-4 bg-slate-900 rounded-3xl border border-amber-500/30 shadow-xl space-y-2">
          {/* Top Col Sum Headers */}
          <div className="flex gap-2 justify-center pl-10 pr-12">
            {colSums.map((cSum, cIdx) => (
              <div
                key={`col-head-${cIdx}`}
                className={`w-12 sm:w-14 text-center text-[10px] font-mono font-bold py-1 rounded-lg border ${
                  cSum === targetConstant && cSum > 0
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : cSum > 0
                    ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}
              >
                C{cIdx + 1}:{cSum}
              </div>
            ))}
          </div>

          {/* Matrix Rows */}
          {gridValues.map((row, rIdx) => (
            <div key={`row-${rIdx}`} className="flex items-center justify-center gap-2">
              {/* Row Label */}
              <span className="w-8 text-right font-mono text-[11px] font-bold text-amber-400 shrink-0">
                R{rIdx + 1}
              </span>

              {row.map((cellVal, cIdx) => {
                const numVal = parseInt(cellVal, 10) || 0;
                const isDiagonal1 = rIdx === cIdx;
                const isDiagonal2 = rIdx === gridSize - 1 - cIdx;

                return (
                  <input
                    key={`cell-${rIdx}-${cIdx}`}
                    type="number"
                    value={cellVal}
                    onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                    placeholder={t.cellPlaceholder}
                    className={`w-12 h-12 sm:w-14 sm:h-14 text-center font-extrabold text-base sm:text-lg rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all ${
                      cellVal
                        ? 'bg-slate-800 text-amber-300 border-amber-500/40'
                        : 'bg-slate-950/70 text-slate-500 border-slate-800'
                    } ${
                      isDiagonal1 || isDiagonal2 ? 'ring-1 ring-fuchsia-500/40' : ''
                    }`}
                  />
                );
              })}

              {/* Row Sum Badge */}
              <span
                className={`w-12 text-center font-mono text-xs font-bold py-2 rounded-lg border shrink-0 ${
                  rowSums[rIdx] === targetConstant && rowSums[rIdx] > 0
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : rowSums[rIdx] > 0
                    ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}
              >
                ={rowSums[rIdx]}
              </span>
            </div>
          ))}

          {/* Diagonals Footer */}
          <div className="flex justify-between items-center pt-2 px-2 text-xs font-mono font-bold text-slate-300 border-t border-slate-800">
            <span
              className={`px-3 py-1 rounded-lg border ${
                diag1Valid ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              {t.diagPrimary} {diag1Sum}
            </span>

            <span
              className={`px-3 py-1 rounded-lg border ${
                diag2Valid ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              {t.diagSecondary} {diag2Sum}
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-gray-50 dark:bg-gray-900 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800">
          <span className="text-gray-500 dark:text-gray-300 block">{t.magicConstant}</span>
          <span className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">
            {targetConstant}
          </span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800">
          <span className="text-gray-500 dark:text-gray-300 block">{t.totalSum}</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white font-mono">
            {grandTotal}
          </span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800">
          <span className="text-gray-500 dark:text-gray-300 block">Statut de la Matrice</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mt-1">
            {isValidMagicSquare ? (
              <span className="text-emerald-500 flex items-center gap-1"><Check size={14} /> Conforme</span>
            ) : (
              <span className="text-rose-500 flex items-center gap-1"><X size={14} /> Incongruence</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
