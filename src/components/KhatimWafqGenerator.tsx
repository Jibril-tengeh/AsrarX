import React, { useState } from 'react';
import { Grid, Sparkles, Copy, Check, RefreshCw, Key, Shield, Flame, BookOpen, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { FULL_28_LETTERS_DATA, LetterInfo } from '../pages/user/tools/ScienceOfLetters';

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

export const KhatimWafqGenerator: React.FC = () => {
  const [selectedLetterChar, setSelectedLetterChar] = useState<string>('ا');
  const [wafqSize, setWafqSize] = useState<3 | 4>(3);
  const [displayMode, setDisplayMode] = useState<'western' | 'eastern' | 'letters'>('eastern');
  const [customValue, setCustomValue] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

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

  // Generate 3x3 Ghazali Wafq
  const generate3x3Wafq = (total: number): number[][] => {
    // Base formula: (Total - 12) / 3
    const base = Math.floor((total - 12) / 3);
    const remainder = (total - 12) % 3;

    // Standard sequence 1 to 9 mapped to base
    const seq = Array(10).fill(0);
    for (let i = 1; i <= 9; i++) {
      let val = base + (i - 1);
      if (i >= 7 && remainder >= 1) val += 1;
      if (i >= 8 && remainder >= 2) val += 1;
      seq[i] = Math.max(1, val);
    }

    // Ghazali Positions:
    // [ [4, 9, 2],
    //   [3, 5, 7],
    //   [8, 1, 6] ]
    return [
      [seq[4], seq[9], seq[2]],
      [seq[3], seq[5], seq[7]],
      [seq[8], seq[1], seq[6]]
    ];
  };

  // Generate 4x4 Al-Masa'a Wafq
  const generate4x4Wafq = (total: number): number[][] => {
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

    // Standard 4x4 Magic Layout:
    return [
      [seq[1], seq[15], seq[14], seq[4]],
      [seq[12], seq[6], seq[7], seq[9]],
      [seq[8], seq[10], seq[11], seq[5]],
      [seq[13], seq[3], seq[2], seq[16]]
    ];
  };

  const wafqGrid = wafqSize === 3 ? generate3x3Wafq(targetAbjad) : generate4x4Wafq(targetAbjad);

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
    const gridText = wafqGrid.map(row => row.map(v => formatCellValue(v)).join('\t')).join('\n');
    navigator.clipboard.writeText(`Wafq Khatim (${wafqSize}x${wafqSize}) - Total Abjad: ${targetAbjad}\n\n${gridText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentLetterInfo = FULL_28_LETTERS_DATA.find(l => l.char === selectedLetterChar);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
      {/* Title */}
      <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Grid className="text-amber-500" /> Générateur de Carrés Magiques (Awfaq / Khatim)
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Génération automatique du carré mystique 3x3 (Ghazali) ou 4x4 (Al-Masa'a) centré sur la valeur de la lettre ou sur un montant Abjad personnalisé.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Letter Selector */}
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1 font-medium">Choisir la Lettre Clé :</label>
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
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1 font-medium">Ou Valeur Abjad Personnalisée :</label>
          <input
            type="number"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Ex: 111, 353, 786..."
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Wafq Dimension & Format */}
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1 font-medium">Taille du Wafq :</label>
          <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl gap-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setWafqSize(3)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                wafqSize === 3 ? 'bg-amber-500 text-black shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-white'
              }`}
            >
              3x3 (Ghazali)
            </button>
            <button
              onClick={() => setWafqSize(4)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                wafqSize === 4 ? 'bg-amber-500 text-black shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-white'
              }`}
            >
              4x4 (Masa'a)
            </button>
          </div>
        </div>
      </div>

      {/* Display Mode Switcher */}
      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/60 p-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs">
        <span className="font-bold text-gray-700 dark:text-gray-300">Format d'affichage des cases :</span>
        <div className="flex gap-2">
          <button
            onClick={() => setDisplayMode('eastern')}
            className={`px-3 py-1 rounded-lg font-arabic font-bold cursor-pointer ${
              displayMode === 'eastern' ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Chiffres Arabes (١٢٣)
          </button>
          <button
            onClick={() => setDisplayMode('western')}
            className={`px-3 py-1 rounded-lg font-mono font-bold cursor-pointer ${
              displayMode === 'western' ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Chiffres Latins (123)
          </button>
          <button
            onClick={() => setDisplayMode('letters')}
            className={`px-3 py-1 rounded-lg font-arabic font-bold cursor-pointer ${
              displayMode === 'letters' ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Lettres (الحروف)
          </button>
        </div>
      </div>

      {/* Main Khatim Wafq Render Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/90 via-slate-900 to-amber-950/90 text-white shadow-2xl border border-amber-500/40 relative overflow-hidden space-y-6">
        {/* Top Header info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-amber-500/20 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1">
              <Sparkles size={12} /> Sceau Sacré du Wafq ({wafqSize}x{wafqSize})
            </span>
            <h3 className="text-xl font-black text-amber-100 mt-1">
              {currentLetterInfo ? `Carré de la Lettre ${currentLetterInfo.name} (${currentLetterInfo.char})` : 'Carré Numérique Sur-Mesure'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] text-gray-400 block font-mono">Somme Totale</span>
              <span className="text-lg font-extrabold text-amber-300 font-mono">{targetAbjad}</span>
            </div>
            <div className="text-right pl-3 border-l border-amber-500/30">
              <span className="text-[10px] text-gray-400 block font-mono">Constante par Ligne</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{rowSum}</span>
            </div>
          </div>
        </div>

        {/* WAFQ GRID VISUAL DISPLAY */}
        <div className="flex justify-center my-4">
          <div className={`grid ${wafqSize === 3 ? 'grid-cols-3' : 'grid-cols-4'} gap-2 sm:gap-3 p-4 sm:p-6 bg-slate-950/90 border-2 border-amber-500/60 rounded-2xl shadow-2xl relative`}>
            {/* Corner Ornamental Symbols */}
            <span className="absolute top-1 left-2 text-[10px] text-amber-500/50 font-arabic">﷽</span>
            <span className="absolute top-1 right-2 text-[10px] text-amber-500/50 font-arabic">الله</span>
            <span className="absolute bottom-1 left-2 text-[10px] text-amber-500/50 font-arabic">محمد</span>
            <span className="absolute bottom-1 right-2 text-[10px] text-amber-500/50 font-arabic">علي</span>

            {wafqGrid.map((row, rIdx) =>
              row.map((cellVal, cIdx) => (
                <motion.div
                  key={`${rIdx}-${cIdx}`}
                  whileHover={{ scale: 1.05 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/40 rounded-xl flex items-center justify-center text-center shadow-inner group hover:border-amber-300 transition-colors cursor-pointer"
                >
                  <span className="text-lg sm:text-2xl font-bold font-arabic text-amber-200 group-hover:text-white transition-colors" dir="rtl">
                    {formatCellValue(cellVal)}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Ritual & Servitor Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-amber-500/20">
          <div className="p-3 bg-black/40 rounded-xl border border-amber-500/20 space-y-1">
            <span className="text-amber-400 font-bold block flex items-center gap-1">
              <Shield size={12} /> Ange Gardien du Carré
            </span>
            <p className="text-gray-200 font-arabic text-sm">{angelName}</p>
            <p className="text-[10px] text-gray-400">À prononcer lors de la traçabilité du Khatim.</p>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-amber-500/20 space-y-1">
            <span className="text-amber-400 font-bold block flex items-center gap-1">
              <Flame size={12} /> Encens & Support Recommandé
            </span>
            <p className="text-gray-200">
              {currentLetterInfo ? currentLetterInfo.incense : 'Luban Dhakar (Oliban) & Musc'}
            </p>
            <p className="text-[10px] text-gray-400">À tracer sur papier safran à l'heure du lever du Soleil.</p>
          </div>
        </div>

        {/* Copy Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleCopyGrid}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "Carré copié !" : "Copier la grille du Khatim"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
