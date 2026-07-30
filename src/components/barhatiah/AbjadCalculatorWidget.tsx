import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Hash, Sparkles, User, RefreshCw, Feather, Shield, Download, Check, Copy } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { BARHATIAH_28_NAMES, BarhatiahNameSecret } from '../../data/barhatiahSecrets';

const ABJAD_MAP: Record<string, number> = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1, 'ى': 10,
  'ب': 2,
  'ج': 3,
  'د': 4,
  'ه': 5, 'هـ': 5, 'ة': 400,
  'و': 6,
  'ز': 7,
  'ح': 8,
  'ط': 9,
  'ي': 10,
  'ك': 20,
  'ل': 30,
  'م': 40,
  'ن': 50,
  'س': 60,
  'ع': 70,
  'ف': 80,
  'ص': 90,
  'ق': 100,
  'ر': 200,
  'ش': 300,
  'ت': 400,
  'ث': 500,
  'خ': 600,
  'ذ': 700,
  'ض': 800,
  'ظ': 900,
  'غ': 1000,
};

export const calculateAbjadKabir = (text: string): { total: number; breakdown: { char: string; val: number }[] } => {
  let total = 0;
  const breakdown: { char: string; val: number }[] = [];

  for (const char of text) {
    if (ABJAD_MAP[char]) {
      const val = ABJAD_MAP[char];
      total += val;
      breakdown.push({ char, val });
    }
  }

  return { total, breakdown };
};

export const calculateAbjadSaghir = (totalKabir: number): number => {
  if (totalKabir === 0) return 0;
  const rem = totalKabir % 9;
  return rem === 0 ? 9 : rem;
};

// Classical 3x3 Ghazali Wafq Generator
export const generate3x3Wafq = (targetSum: number): { grid: number[][]; miftah: number; mughlaq: number } => {
  // Base Ghazali 3x3 positions:
  // [2, 9, 4]
  // [7, 5, 3]
  // [6, 1, 8]
  const base = [
    [2, 9, 4],
    [7, 5, 3],
    [6, 1, 8],
  ];

  let sum = Math.max(targetSum, 15); // Minimum valid sum is 15
  let baseOffset = Math.floor((sum - 15) / 3);
  let remainder = (sum - 15) % 3;

  const grid = base.map((row) =>
    row.map((val) => {
      let cellVal = val + baseOffset;
      // If remainder exists, add to 7th cell in sequence (which is 7)
      if (val >= 7 && remainder > 0) {
        cellVal += remainder;
      }
      return cellVal;
    })
  );

  const miftah = grid[2][1]; // Cell 1 position
  const mughlaq = grid[0][1]; // Cell 9 position

  return { grid, miftah, mughlaq };
};

interface AbjadCalculatorWidgetProps {
  onExportParchment?: (title: string, wafqGrid: string[][], formula: string) => void;
  onSelectNameForParchment?: (name: BarhatiahNameSecret) => void;
}

export const AbjadCalculatorWidget: React.FC<AbjadCalculatorWidgetProps> = ({ onExportParchment }) => {
  const { language } = useLanguage();
  const [personName, setPersonName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [intentionText, setIntentionText] = useState('');
  const [gridSize, setGridSize] = useState<'3x3' | '4x4'>('3x3');
  const [copiedFormula, setCopiedFormula] = useState(false);

  // Calculated values
  const nameCalc = calculateAbjadKabir(personName);
  const motherCalc = calculateAbjadKabir(motherName);
  const intentionCalc = calculateAbjadKabir(intentionText);

  const combinedTotal = nameCalc.total + motherCalc.total + intentionCalc.total;
  const abjadSaghir = calculateAbjadSaghir(combinedTotal);

  // Find vibrational match among 28 Barhatiah Names
  const bestMatchedNameIndex = (combinedTotal > 0 ? (combinedTotal - 1) % 28 : 0);
  const matchedName: BarhatiahNameSecret = BARHATIAH_28_NAMES[bestMatchedNameIndex];

  // Secondary match by Abjad weight closeness
  const closestByWeight = combinedTotal > 0
    ? [...BARHATIAH_28_NAMES].sort((a, b) => Math.abs(a.abjadWeight - combinedTotal) - Math.abs(b.abjadWeight - combinedTotal))[0]
    : matchedName;

  // Wafq generation
  const targetWafqSum = combinedTotal > 0 ? combinedTotal : 662; // Default to Barhatihin if empty
  const wafqData3x3 = generate3x3Wafq(targetWafqSum);
  const wafqGridStrings = wafqData3x3.grid.map(row => row.map(v => v.toString()));

  const handleExport = () => {
    if (onExportParchment) {
      const title = personName
        ? `${personName} ${motherName ? `bint ${motherName}` : ''}`
        : (language === 'ha' ? 'Hatim din Barhatiah' : language === 'en' ? 'Personal Barhatiah Seal' : 'Sceau Parchemin Personnel');
      
      const formula = `يا ${matchedName.nameAr} - Adad Zikr: ${matchedName.abjadWeight} - Zimām Sum: ${targetWafqSum}`;
      onExportParchment(title, wafqGridStrings, formula);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black p-5 sm:p-7 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 text-white">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-gray-950">
            <Hash size={22} className="font-bold" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-amber-300 flex items-center gap-2">
              {language === 'ha'
                ? 'Kalkuleta ta Abjad da Wafq (Hisab al-Jumal)'
                : language === 'en'
                ? 'Personal Abjad & Wafq Calculator (Hisab al-Jumal)'
                : 'Calculateur Abjad & Wafq Sur-Mesure (Hisab al-Jumal)'}
              <span className="text-xs font-arabic px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                حِسَابُ الجُمَل
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              {language === 'ha'
                ? 'Lissafin sunan mutum da na mahaifiya domin samun lambar Barhatiah da Hatimi da ya dace da kai'
                : language === 'en'
                ? 'Calculate name & intention Abjad values to discover your matching Barhatiah vibrational frequencies'
                : 'Calculez la signature vibratoire de votre nom pour générer votre Wafq et trouver vos Noms de la Barhatiah'}
            </p>
          </div>
        </div>
      </div>

      {/* Input Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Person Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <User size={14} className="text-amber-400" />
            {language === 'ha' ? 'Sunanki / Sunanka (Larabci)' : language === 'en' ? 'Your Name (Arabic / Text)' : 'Votre Nom (Larabci / Texte) :'}
          </label>
          <input
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="مثال: أَبُوبَكَر / Aboubacar"
            className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-amber-500/30 text-amber-200 text-sm focus:outline-none focus:border-amber-400 font-arabic dir-rtl"
          />
          {nameCalc.total > 0 && (
            <div className="text-[10px] text-emerald-400 font-mono font-bold flex justify-between px-1">
              <span>Abjad Kabir:</span>
              <span>{nameCalc.total}</span>
            </div>
          )}
        </div>

        {/* Mother's Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <User size={14} className="text-amber-400" />
            {language === 'ha' ? 'Sunan Mahaifiya (Larabci)' : language === 'en' ? "Mother's Name (Arabic)" : 'Nom de la Mère (Larabci) :'}
          </label>
          <input
            type="text"
            value={motherName}
            onChange={(e) => setMotherName(e.target.value)}
            placeholder="مثال: فَاطِمَة / Fatima"
            className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-amber-500/30 text-amber-200 text-sm focus:outline-none focus:border-amber-400 font-arabic dir-rtl"
          />
          {motherCalc.total > 0 && (
            <div className="text-[10px] text-emerald-400 font-mono font-bold flex justify-between px-1">
              <span>Abjad Kabir:</span>
              <span>{motherCalc.total}</span>
            </div>
          )}
        </div>

        {/* Intention / Desire */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-400" />
            {language === 'ha' ? 'Bukata ko Niyya' : language === 'en' ? 'Intention / Desire' : 'Vœu / Intention :'}
          </label>
          <input
            type="text"
            value={intentionText}
            onChange={(e) => setIntentionText(e.target.value)}
            placeholder="مثال: رِزْقٌ وَشِفَاءٌ / Protection & Arziqi"
            className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-amber-500/30 text-amber-200 text-sm focus:outline-none focus:border-amber-400 font-arabic dir-rtl"
          />
          {intentionCalc.total > 0 && (
            <div className="text-[10px] text-emerald-400 font-mono font-bold flex justify-between px-1">
              <span>Abjad Kabir:</span>
              <span>{intentionCalc.total}</span>
            </div>
          )}
        </div>
      </div>

      {/* Numerical Synthesis Box */}
      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-2.5 rounded-xl bg-black/60 border border-amber-500/20">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
            {language === 'ha' ? 'Jumla Abjad Kabir' : language === 'en' ? 'Total Abjad Kabir' : 'Total Abjad Majeur'}
          </span>
          <span className="text-xl font-mono font-extrabold text-amber-300">
            {combinedTotal || '0'}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-black/60 border border-amber-500/20">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
            {language === 'ha' ? 'Abjad Saghir (Taba\'i)' : language === 'en' ? 'Abjad Saghir (Root)' : 'Abjad Mineur (1-9)'}
          </span>
          <span className="text-xl font-mono font-extrabold text-emerald-400">
            {abjadSaghir || '0'}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-black/60 border border-amber-500/20">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
            {language === 'ha' ? 'Miftah (Mabuɗi)' : language === 'en' ? 'Miftah (Key)' : 'Miftah (Clé)'}
          </span>
          <span className="text-xl font-mono font-extrabold text-yellow-300">
            {wafqData3x3.miftah}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-black/60 border border-amber-500/20">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
            {language === 'ha' ? 'Mughlaq (Kulle)' : language === 'en' ? 'Mughlaq (Lock)' : 'Mughlaq (Verrou)'}
          </span>
          <span className="text-xl font-mono font-extrabold text-purple-300">
            {wafqData3x3.mughlaq}
          </span>
        </div>
      </div>

      {/* Vibrational Match with Barhatiah Names */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-gray-900 to-black border border-amber-500/50 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            {language === 'ha'
              ? 'Neman Suna na Barhatiah da Ya Dace da Kai'
              : language === 'en'
              ? 'Barhatiah Vibrational Frequency Match'
              : 'Correspondance Vibratoire Barhatiah Détectée'}
          </h4>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            Match #{matchedName.id} / 28
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Principal Match */}
          <div className="p-3.5 rounded-xl bg-black/80 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-400 font-bold">
                {language === 'ha' ? 'Babban Suna da Ya Dace:' : language === 'en' ? 'Primary Matching Name:' : 'Nom Principal Recommandé :'}
              </span>
              <span className="text-xs font-mono text-gray-400">Adad Zikr: {matchedName.abjadWeight}</span>
            </div>

            <div className="flex items-center justify-between dir-rtl">
              <span className="font-arabic text-xl text-amber-300 font-bold">
                {matchedName.nameAr} ({matchedName.nameTranslit})
              </span>
              <span className="text-xs text-gray-300 font-sans dir-ltr">
                {matchedName.lunarMansion}
              </span>
            </div>

            <p className="text-xs text-gray-300 italic border-t border-gray-800 pt-1.5">
              "{language === 'ha' ? matchedName.divineAttributeHa : language === 'en' ? matchedName.divineAttributeEn : matchedName.divineAttributeFr}"
            </p>
          </div>

          {/* Secondary Match by Weight */}
          <div className="p-3.5 rounded-xl bg-black/80 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-yellow-400 font-bold">
                {language === 'ha' ? 'Suna na Biyu Mafi Kusa:' : language === 'en' ? 'Closest Name by Weight:' : 'Nom le Plus Proche en Poids :'}
              </span>
              <span className="text-xs font-mono text-gray-400">Adad: {closestByWeight.abjadWeight}</span>
            </div>

            <div className="flex items-center justify-between dir-rtl">
              <span className="font-arabic text-xl text-amber-300 font-bold">
                {closestByWeight.nameAr} ({closestByWeight.nameTranslit})
              </span>
              <span className="text-xs text-gray-300 font-sans dir-ltr">
                Element: {closestByWeight.element}
              </span>
            </div>

            <p className="text-xs text-gray-300 italic border-t border-gray-800 pt-1.5">
              "{language === 'ha' ? closestByWeight.divineAttributeHa : language === 'en' ? closestByWeight.divineAttributeEn : closestByWeight.divineAttributeFr}"
            </p>
          </div>
        </div>
      </div>

      {/* Custom Tailor-Made Wafq Display */}
      <div className="p-5 rounded-2xl bg-black/90 border-2 border-amber-500/60 shadow-xl space-y-4 text-center">
        <div className="flex items-center justify-between text-xs border-b border-gray-800 pb-2">
          <span className="font-bold text-amber-300 flex items-center gap-1.5">
            <Shield size={16} className="text-amber-400" />
            {language === 'ha'
              ? 'Hatimi 3x3 na Musamman (Wafq Ghazali)'
              : language === 'en'
              ? 'Your Tailor-Made 3x3 Magic Square (Wafq Ghazali)'
              : 'Votre Wafq Ghazali 3x3 Personnel Généré'}
          </span>
          <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            Zimām Sum: {targetWafqSum}
          </span>
        </div>

        {/* 3x3 Wafq Matrix Render */}
        <div className="flex justify-center my-3">
          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-amber-950/40 border-2 border-amber-500/70 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            {wafqData3x3.grid.map((row, rIdx) =>
              row.map((cellVal, cIdx) => {
                const isCenter = rIdx === 1 && cIdx === 1;
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center rounded-xl transition-all border ${
                      isCenter
                        ? 'bg-amber-500/40 border-amber-400 text-amber-100 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105'
                        : 'bg-gray-900/90 border-amber-500/40 text-amber-300 hover:border-amber-400'
                    }`}
                  >
                    <span className="font-mono font-bold text-base sm:text-lg">
                      {cellVal}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Action button */}
        {onExportParchment && (
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleExport}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-gray-950 font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-amber-300"
            >
              <Feather size={15} />
              <span>
                {language === 'ha'
                  ? 'Fitar da Hatimi zuwa Parchemin (PNG)'
                  : language === 'en'
                  ? 'Export Custom Wafq to Sacred Parchment (PNG)'
                  : 'Exporter ce Wafq en Parchemin Sacré (PNG)'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
