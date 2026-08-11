import React, { useRef, useState } from 'react';
import { Sparkles, Layers, Check, Copy, Download, Feather } from 'lucide-react';
import { toCanvas } from 'html-to-image';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateAbjadValue, numberToAbjadLetters, extractCelestialKhadimName } from '../utils/abjad';
import { AsrarHubWatermark } from './AsrarHubWatermark';
import { ParchmentExporterModal } from './ParchmentExporterModal';
import { downloadCanvasImage } from '../utils/downloadHelper';

const DIVINE_NAME_PRESETS = [
  { ar: "الله", fr: "Allah (Le Nom Suprême)", en: "Allah (The Supreme Name)", weight: 66 },
  { ar: "يا لطيف", fr: "Ya Latif (Le Subtil, Le Bienveillant)", en: "Ya Latif (The Subtle, Most Kind)", weight: 129 },
  { ar: "الرَّزَّاقُ", fr: "Ar-Razzaq (Le Pourvoyeur Inépuisable)", en: "Ar-Razzaq (The All-Provider)", weight: 308 },
  { ar: "الفَتَّاحُ", fr: "Al-Fattah (L'Ouvreur Suprême)", en: "Al-Fattah (The Supreme Opener)", weight: 489 },
  { ar: "الوَدُودُ", fr: "Al-Wadud (L'Aimant, Le Bien-Aimé)", en: "Al-Wadud (The Loving One)", weight: 20 },
  { ar: "الحَيُّ القَيُّومُ", fr: "Al-Hayy Al-Qayyum (Le Vivant, L'Immuable)", en: "Al-Hayy Al-Qayyum (The Ever-Living)", weight: 174 },
  { ar: "السَّلاَمُ", fr: "As-Salam (La Paix Sérénissime)", en: "As-Salam (The Source of Peace)", weight: 131 },
  { ar: "المُجِيبُ", fr: "Al-Mujeeb (L'Exauceur des Prières)", en: "Al-Mujeeb (The Answerer)", weight: 55 },
  { ar: "الوَهَّابُ", fr: "Al-Wahhab (Le Donateur Gracieux)", en: "Al-Wahhab (The Bestower)", weight: 14 }
];

const VERSE_PRESETS = [
  { ar: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو القُوَّةِ المَتِينُ", fr: "Certes, c'est Allah qui est le Grand Pourvoyeur, le Denteur de la Force Inébranlable", en: "Indeed, Allah is the Provider, the possessor of firm strength", weight: 1016 },
  { ar: "فَتْحٌ مِنَ اللَّهِ وَفَتْحٌ قَرِيبٌ", fr: "Une victoire venant d'Allah et une conquête imminente", en: "Victory from Allah and an imminent conquest", weight: 811 },
  { ar: "اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الحَيُّ القَيُّومُ", fr: "Allah ! Point de divinité à part Lui, le Vivant, le Subsistant par Soi-même (Ayat al-Kursi)", en: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence", weight: 5929 },
  { ar: "حَسْبُنَا اللَّهُ وَنِعْمَ الوَكِيلُ", fr: "Allah nous suffit; Il est notre meilleur garant", en: "Sufficient for us is Allah, and He is the best Disposer of affairs", weight: 450 },
  { ar: "إِنَّا فَتَحْنَا لَكَ فَتْحاً مُبِيناً", fr: "En vérité Nous t'avons accordé une victoire éclatante", en: "Indeed, We have granted you a clear triumph", weight: 1233 },
  { ar: "قُلْ هُوَ اللَّهُ أَحَدٌ", fr: "Dis : Il est Allah, Unique", en: "Say: He is Allah, [who is] One", weight: 1002 }
];

const dict = {
  fr: {
    title: "Wafq Combiné (Nom Divin + Verset / Du'a)",
    subtitle: "Fusionnez la vibration d'un Nom Divin et d'un Verset Coranique dans une grille unique et équilibrée.",
    divineSection: "1. Sélection du Nom Divin (Asma Allah) :",
    verseSection: "2. Sélection du Verset Coranique ou Intention :",
    customNamePlaceholder: "Saisissez un autre Nom Divin en arabe...",
    customVersePlaceholder: "Saisissez un verset ou une intention en arabe...",
    gridSizeLabel: "3. Taille de la Grille du Wafq :",
    modeLabel: "4. Mode d'Affichage :",
    numbersMode: "Chiffres (Arqam)",
    lettersMode: "Lettres Abjad (Wafq al-Huruf / Littéral)",
    combineBtn: "Calculer & Fusionner le Wafq Combiné",
    synthesisTitle: "Synthèse Théurgique & Poids Combiné",
    divineWeightLabel: "Poids du Nom Divin :",
    verseWeightLabel: "Poids du Verset :",
    totalCombinedWeight: "Poids Total Combiné (Jummal) :",
    angelicKhadim: "Khadim Céleste Extrait (Mala'ikah) :",
    copySuccess: "Matrice copiée !",
    copyBtn: "Copier la Matrice",
    downloadPng: "Télécharger PNG",
    parchmentBtn: "Parchemin Sacré",
    exporting: "Exportation..."
  },
  en: {
    title: "Combined Wafq (Divine Name + Verse / Du'a)",
    subtitle: "Merge the spiritual frequency of a Divine Name and a Quranic Verse into a single balanced matrix.",
    divineSection: "1. Select Divine Name (Asma Allah):",
    verseSection: "2. Select Quranic Verse or Intention:",
    customNamePlaceholder: "Type custom Divine Name in Arabic...",
    customVersePlaceholder: "Type custom Verse or Intention in Arabic...",
    gridSizeLabel: "3. Wafq Grid Size:",
    modeLabel: "4. Display Mode:",
    numbersMode: "Numbers (Arqam)",
    lettersMode: "Abjad Letters (Wafq al-Huruf)",
    combineBtn: "Calculate & Merge Combined Wafq",
    synthesisTitle: "Theurgic Synthesis & Combined Weight",
    divineWeightLabel: "Divine Name Weight:",
    verseWeightLabel: "Verse Weight:",
    totalCombinedWeight: "Total Combined Weight (Jummal):",
    angelicKhadim: "Extracted Angelic Khadim:",
    copySuccess: "Matrix Copied!",
    copyBtn: "Copy Matrix",
    downloadPng: "Download PNG",
    parchmentBtn: "Sacred Parchment",
    exporting: "Exporting..."
  },
  ha: {
    title: "Haɗaɗɗen Wafq (Sunan Allah + Aya)",
    subtitle: "Haɗa karfin Sunan Allah da Aya ta Alkur'ani a cikin raga guda mai albarka.",
    divineSection: "1. Zaɓi Sunan Allah:",
    verseSection: "2. Zaɓi Ayar Alkur'ani ko Niyya:",
    customNamePlaceholder: "Rubuta wani Sunan Allah da Larabci...",
    customVersePlaceholder: "Rubuta wata Aya ko Niyya da Larabci...",
    gridSizeLabel: "3. Girman Wafq:",
    modeLabel: "4. Siffar Nuni:",
    numbersMode: "Lambobi (Arqam)",
    lettersMode: "Haruffan Abjad (Wafq al-Huruf)",
    combineBtn: "Lissafta da Haɗa Wafq",
    synthesisTitle: "Sirrin Lissafi da Nauyi Gaba Ɗaya",
    divineWeightLabel: "Nauyin Sunan Allah:",
    verseWeightLabel: "Nauyin Aya:",
    totalCombinedWeight: "Jimillar Nauyi (Jummal):",
    angelicKhadim: "Mala'ika Khadim da aka fitar:",
    copySuccess: "An kwafi raga!",
    copyBtn: "Kwafi Raga",
    downloadPng: "Zazzage PNG",
    parchmentBtn: "Parchemin Mai Tsarki",
    exporting: "Aina fitarwa..."
  }
};

export const WafqCombine: React.FC = () => {
  const { language } = useLanguage();
  const t = dict[(language as 'fr' | 'en' | 'ha') || 'fr'] || dict.fr;

  const [selectedDivine, setSelectedDivine] = useState(DIVINE_NAME_PRESETS[1]); // Ya Latif
  const [customDivineText, setCustomDivineText] = useState('');
  const [selectedVerse, setSelectedVerse] = useState(VERSE_PRESETS[0]);
  const [customVerseText, setCustomVerseText] = useState('');

  const [gridSize, setGridSize] = useState<number>(3);
  const [displayMode, setDisplayMode] = useState<'numbers' | 'letters'>('numbers');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isParchmentOpen, setIsParchmentOpen] = useState(false);
  const wafqCardRef = useRef<HTMLDivElement>(null);

  // Determine active Divine Name & Verse weight
  const activeDivineWeight = customDivineText.trim()
    ? calculateAbjadValue(customDivineText)
    : selectedDivine.weight;

  const activeVerseWeight = customVerseText.trim()
    ? calculateAbjadValue(customVerseText)
    : selectedVerse.weight;

  const combinedTotal = activeDivineWeight + activeVerseWeight;

  // Extract Angelic Khadim Name from Combined Total with Tashkeel
  const khadimData = extractCelestialKhadimName(combinedTotal);
  const extractKhadimName = (val: number): string => {
    return extractCelestialKhadimName(val).displayText;
  };

  // Generate 3x3 to 7x7 Ghazali Matrix for Combined Total
  const generateCombinedGrid = (): (number | string)[][] => {
    const n = gridSize;
    const cn = (n * (n * n - 1)) / 2;
    const minVal = cn + n;

    const baseVal = Math.max(minVal, combinedTotal);
    const base = Math.floor((baseVal - cn) / n);
    const rem = (baseVal - cn) % n;

    // Standard odd/even generator
    const grid: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    let r = 0;
    let c = Math.floor(n / 2);

    for (let i = 0; i < n * n; i++) {
      grid[r][c] = i;
      let nextR = (r - 1 + n) % n;
      let nextC = (c + 1) % n;
      if (grid[nextR][nextC] !== 0 || (nextR === 0 && nextC === Math.floor(n / 2) && i > 0)) {
        r = (r + 1) % n;
      } else {
        r = nextR;
        c = nextC;
      }
    }

    const kasrCellIndex = n * n - 2;

    return grid.map((row) =>
      row.map((cellVal) => {
        let finalVal = cellVal + base;
        if (cellVal === kasrCellIndex) {
          finalVal += rem;
        }
        if (displayMode === 'letters') {
          return numberToAbjadLetters(finalVal);
        }
        return finalVal;
      })
    );
  };

  const combinedGrid = generateCombinedGrid();

  const handleCopy = () => {
    const text = combinedGrid.map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = async () => {
    if (!wafqCardRef.current) return;
    setIsExporting(true);
    try {
      const el = wafqCardRef.current;
      const width = el.scrollWidth || el.offsetWidth || 500;
      const height = el.scrollHeight || el.offsetHeight || 500;

      const canvas = await toCanvas(el, {
        quality: 0.98,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
        fontEmbedCSS: '',
        width,
        height,
        style: {
          transform: 'none',
          margin: '0',
          maxHeight: 'none',
          maxWidth: 'none',
          height: `${height}px`,
          width: `${width}px`,
          overflow: 'visible',
        },
        backgroundColor: '#020617',
      });
      await downloadCanvasImage(canvas, `wafq_combine_${combinedTotal}.png`);
    } catch (err) {
      console.error('Error exporting combined wafq PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Layers className="text-fuchsia-500" size={22} />
          <span>{t.title}</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Divine Name Selector */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
          <label className="block text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider">
            {t.divineSection}
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto no-scrollbar">
            {DIVINE_NAME_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedDivine(p);
                  setCustomDivineText('');
                }}
                className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                  !customDivineText && selectedDivine.ar === p.ar
                    ? 'bg-fuchsia-600 text-white border-fuchsia-500 shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-fuchsia-400'
                }`}
              >
                <div>
                  <span className="font-extrabold text-sm block font-arabic">{p.ar}</span>
                  <span className="text-[11px] opacity-80">{language === 'en' ? p.en : p.fr}</span>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-black/20">
                  {p.weight}
                </span>
              </button>
            ))}
          </div>

          <input
            type="text"
            value={customDivineText}
            onChange={(e) => setCustomDivineText(e.target.value)}
            placeholder={t.customNamePlaceholder}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm font-arabic font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            dir="rtl"
          />
        </div>

        {/* Verse / Intention Selector */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
          <label className="block text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            {t.verseSection}
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto no-scrollbar">
            {VERSE_PRESETS.map((v, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedVerse(v);
                  setCustomVerseText('');
                }}
                className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                  !customVerseText && selectedVerse.ar === v.ar
                    ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-amber-400'
                }`}
              >
                <div className="max-w-[80%]">
                  <span className="font-extrabold text-xs block font-arabic truncate">{v.ar}</span>
                  <span className="text-[10px] opacity-80 truncate block">{language === 'en' ? v.en : v.fr}</span>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-black/20">
                  {v.weight}
                </span>
              </button>
            ))}
          </div>

          <input
            type="text"
            value={customVerseText}
            onChange={(e) => setCustomVerseText(e.target.value)}
            placeholder={t.customVersePlaceholder}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm font-arabic font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            dir="rtl"
          />
        </div>
      </div>

      {/* Synthesis Breakdown Bar */}
      <div className="bg-gradient-to-r from-fuchsia-900/80 to-amber-900/80 p-5 rounded-3xl border border-fuchsia-500/40 text-white shadow-lg grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div>
          <span className="text-[10px] text-fuchsia-200 uppercase tracking-wider font-bold block">{t.divineWeightLabel}</span>
          <span className="text-2xl font-black font-mono text-fuchsia-300">{activeDivineWeight}</span>
        </div>
        <div>
          <span className="text-[10px] text-amber-200 uppercase tracking-wider font-bold block">{t.verseWeightLabel}</span>
          <span className="text-2xl font-black font-mono text-amber-300">+{activeVerseWeight}</span>
        </div>
        <div className="sm:border-l border-white/20">
          <span className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold block">{t.totalCombinedWeight}</span>
          <span className="text-3xl font-black font-mono text-emerald-300">{combinedTotal}</span>
        </div>
        <div className="sm:border-l border-white/20">
          <span className="text-[10px] text-purple-200 uppercase tracking-wider font-bold block">{t.angelicKhadim}</span>
          <span className="text-sm font-bold font-arabic text-purple-200 mt-1 block">{extractKhadimName(combinedTotal)}</span>
        </div>
      </div>

      {/* Grid Controls (Size & Mode) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{t.gridSizeLabel}</span>
          {[3, 4, 5, 6, 7].map(sz => (
            <button
              key={sz}
              type="button"
              onClick={() => setGridSize(sz)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                gridSize === sz
                  ? 'bg-fuchsia-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
              }`}
            >
              {sz}x{sz}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{t.modeLabel}</span>
          <button
            type="button"
            onClick={() => setDisplayMode('numbers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              displayMode === 'numbers'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t.numbersMode}
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('letters')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              displayMode === 'letters'
                ? 'bg-gradient-to-r from-fuchsia-600 to-amber-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t.lettersMode}
          </button>
        </div>
      </div>

      {/* Render Combined Wafq Matrix */}
      <div
        ref={wafqCardRef}
        className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-3xl border border-fuchsia-500/30 relative overflow-hidden shadow-2xl"
      >
        <AsrarHubWatermark variant="dark" opacity={0.15} showCentralSeal={true} />

        <div className="text-center mb-4 z-10">
          <span className="text-amber-400 text-xs font-extrabold uppercase tracking-widest block">
            WAFQ COMBINÉ (TOTAL {combinedTotal})
          </span>
          <h3 className="text-white font-arabic text-lg font-bold mt-0.5">
            {customDivineText || selectedDivine.ar} • {customVerseText || selectedVerse.ar}
          </h3>
        </div>

        <div
          className="grid gap-2 z-10 p-3 bg-slate-900/90 rounded-2xl border border-amber-500/20"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {combinedGrid.map((row, rIdx) =>
            row.map((cellVal, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-800/90 border border-amber-500/40 rounded-xl flex items-center justify-center font-extrabold text-amber-300 text-base sm:text-xl font-arabic shadow-inner"
              >
                {cellVal}
              </div>
            ))
          )}
        </div>

        {/* Export & Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 z-10">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-xl flex items-center gap-2 border border-amber-500/30 transition-all cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? t.copySuccess : t.copyBtn}</span>
          </button>

          <button
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 border border-fuchsia-400/40 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            <Download size={14} />
            <span>{isExporting ? t.exporting : t.downloadPng}</span>
          </button>

          <button
            onClick={() => setIsParchmentOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 border border-amber-400/40 transition-all cursor-pointer shadow-md"
          >
            <Feather size={14} />
            <span>{t.parchmentBtn}</span>
          </button>
        </div>
      </div>

      {/* Parchment Exporter Modal */}
      <ParchmentExporterModal
        isOpen={isParchmentOpen}
        onClose={() => setIsParchmentOpen(false)}
        title={`${t.title} - ${customDivineText || selectedDivine.ar}`}
        subtitle={customVerseText || selectedVerse.ar}
        recipientName={extractKhadimName(combinedTotal)}
        abjadWeight={combinedTotal}
        content={
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-sans text-amber-900 bg-amber-200/40 p-3 rounded-xl border border-amber-400/40">
              <div>
                <span className="block text-[10px] uppercase font-bold opacity-75">{t.divineWeightLabel}</span>
                <span className="font-mono font-extrabold text-sm">{activeDivineWeight}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold opacity-75">{t.verseWeightLabel}</span>
                <span className="font-mono font-extrabold text-sm">+{activeVerseWeight}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold opacity-75">{t.totalCombinedWeight}</span>
                <span className="font-mono font-extrabold text-sm text-amber-950">{combinedTotal}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold opacity-75">{t.angelicKhadim}</span>
                <span className="font-arabic font-bold text-xs">{extractKhadimName(combinedTotal)}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-amber-100/80 rounded-2xl border-2 border-amber-800/40 my-2">
              <div
                className="grid gap-2 p-2 bg-amber-200/50 rounded-xl border border-amber-700/30"
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
              >
                {combinedGrid.map((row, rIdx) =>
                  row.map((cellVal, cIdx) => (
                    <div
                      key={`parch-${rIdx}-${cIdx}`}
                      className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-50 border border-amber-800/60 rounded-lg flex items-center justify-center font-extrabold text-amber-950 text-sm sm:text-lg font-arabic shadow-sm"
                    >
                      {cellVal}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};
