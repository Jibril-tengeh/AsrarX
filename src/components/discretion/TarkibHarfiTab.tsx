import React, { useState, useMemo } from 'react';
import { Layers, Download, Copy, Check, Info, Sparkles, Feather } from 'lucide-react';
import { DiscretionTranslation } from './discretionTranslations';
import { MUTE_LETTERS_MAP } from './KhatamKhummTab';
import { calculateAbjadValue } from '../../utils/abjad';

interface TarkibHarfiTabProps {
  t: DiscretionTranslation;
}

// Arabic consonants mapping to elements
const ARABIC_ELEMENTS: Record<string, { name: string; element: 'Fire' | 'Air' | 'Water' | 'Earth' }> = {
  'ا': { name: 'Alif', element: 'Fire' },
  'ب': { name: 'Bā', element: 'Water' },
  'ج': { name: 'Jīm', element: 'Air' },
  'د': { name: 'Dāl', element: 'Earth' },
  'ه': { name: 'Hā', element: 'Fire' },
  'و': { name: 'Wāw', element: 'Air' },
  'ز': { name: 'Zāy', element: 'Water' },
  'ح': { name: 'Ḥā', element: 'Earth' },
  'ط': { name: 'Ṭā', element: 'Fire' },
  'ي': { name: 'Yā', element: 'Air' },
  'ك': { name: 'Kāf', element: 'Water' },
  'ل': { name: 'Lām', element: 'Earth' },
  'م': { name: 'Mīm', element: 'Fire' },
  'ن': { name: 'Nūn', element: 'Air' },
  'س': { name: 'Sīn', element: 'Water' },
  'ع': { name: 'Ayn', element: 'Earth' },
  'ف': { name: 'Fā', element: 'Fire' },
  'ص': { name: 'Ṣād', element: 'Air' },
  'ق': { name: 'Qāf', element: 'Water' },
  'ر': { name: 'Rā', element: 'Earth' },
  'ش': { name: 'Shīn', element: 'Fire' },
  'ت': { name: 'Tā', element: 'Air' },
  'ث': { name: 'Thā', element: 'Water' },
  'خ': { name: 'Khā', element: 'Earth' },
  'ذ': { name: 'Dhāl', element: 'Fire' },
  'ض': { name: 'Ḍād', element: 'Air' },
  'ظ': { name: 'Ẓā', element: 'Water' },
  'غ': { name: 'Ghayn', element: 'Earth' }
};

export default function TarkibHarfiTab({ t }: TarkibHarfiTabProps) {
  const [inputText, setInputText] = useState('محمد');
  const [activeTheme, setActiveTheme] = useState<'obsidianGold' | 'emeraldGlow' | 'royalRuby' | 'midnightSilver'>('obsidianGold');
  const [strokeWidth, setStrokeWidth] = useState(2.2);
  const [spacing, setSpacing] = useState(30);
  const [rotationAngle, setRotationAngle] = useState(45);
  const [showMandalaRings, setShowMandalaRings] = useState(true);
  const [copied, setCopied] = useState(false);

  // Extract unique consonants & compute analysis
  const glyphData = useMemo(() => {
    const raw = inputText.trim() || 'محمد';
    const letters: { char: string; value: number; element: string; role: string }[] = [];
    const seen = new Set<string>();

    for (const char of raw) {
      const norm = char.replace(/[\u064B-\u065F]/g, '');
      if (/[\u0600-\u06FF]/.test(norm) && !seen.has(norm)) {
        seen.add(norm);
        const val = calculateAbjadValue(norm);
        const elemInfo = ARABIC_ELEMENTS[norm] || { name: norm, element: 'Air' };
        letters.push({
          char: norm,
          value: val,
          element: elemInfo.element,
          role: val > 50 ? 'Pillar' : val > 10 ? 'Connector' : 'Foundation'
        });
      }
    }

    const activeLetters = letters.length > 0 ? letters : [
      { char: 'م', value: 40, element: 'Fire', role: 'Pillar' },
      { char: 'ح', value: 8, element: 'Earth', role: 'Foundation' },
      { char: 'د', value: 4, element: 'Water', role: 'Connector' }
    ];

    const totalWeight = activeLetters.reduce((acc, l) => acc + l.value, 0);

    return {
      letters: activeLetters,
      totalWeight
    };
  }, [inputText]);

  // Color theme definitions
  const themeStyles = {
    obsidianGold: {
      bg: 'bg-zinc-950',
      border: 'border-amber-500/30',
      stroke: '#f59e0b',
      accent: '#fbbf24',
      ring: 'rgba(245, 158, 11, 0.2)',
      text: '#fef3c7'
    },
    emeraldGlow: {
      bg: 'bg-emerald-950',
      border: 'border-emerald-500/30',
      stroke: '#10b981',
      accent: '#34d399',
      ring: 'rgba(16, 185, 129, 0.2)',
      text: '#d1fae5'
    },
    royalRuby: {
      bg: 'bg-rose-950',
      border: 'border-rose-500/30',
      stroke: '#f43f5e',
      accent: '#fb7185',
      ring: 'rgba(244, 63, 94, 0.2)',
      text: '#ffe4e6'
    },
    midnightSilver: {
      bg: 'bg-slate-950',
      border: 'border-indigo-500/30',
      stroke: '#a5b4fc',
      accent: '#e0e7ff',
      ring: 'rgba(165, 180, 252, 0.2)',
      text: '#ffffff'
    }
  };

  const currTheme = themeStyles[activeTheme];

  const handleCopyConsonants = () => {
    const str = glyphData.letters.map(l => l.char).join(' - ') + ` (Weight: ${glyphData.totalWeight})`;
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    const svgEl = document.getElementById('tarkib-monogram-svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Al_Tarkib_Monogram_${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const canvasSize = 420;
  const center = canvasSize / 2;

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-purple-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0 mt-1">
            <Feather className="text-amber-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
              {t.tarkib.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.tarkib.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Controls & Input */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                {t.tarkib.inputLabel}
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.tarkib.inputPlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500/50 outline-none"
              />
            </div>

            {/* Extracted Consonants Badges */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                {t.tarkib.extractedConsonants}
              </label>
              <div className="flex flex-wrap gap-2">
                {glyphData.letters.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <span className="font-arabic text-base">{item.char}</span>
                    <span className="text-[10px] text-gray-500 dark:text-slate-400">({item.value})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Color Palette Choice */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                {t.tarkib.themeLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveTheme('obsidianGold')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    activeTheme === 'obsidianGold'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent'
                  }`}
                >
                  {t.tarkib.themeObsidianGold}
                </button>
                <button
                  onClick={() => setActiveTheme('emeraldGlow')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    activeTheme === 'emeraldGlow'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent'
                  }`}
                >
                  {t.tarkib.themeEmeraldGlow}
                </button>
                <button
                  onClick={() => setActiveTheme('royalRuby')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    activeTheme === 'royalRuby'
                      ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent'
                  }`}
                >
                  {t.tarkib.themeRoyalRuby}
                </button>
                <button
                  onClick={() => setActiveTheme('midnightSilver')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    activeTheme === 'midnightSilver'
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent'
                  }`}
                >
                  {t.tarkib.themeMidnightSilver}
                </button>
              </div>
            </div>

            {/* Geometry Sliders */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                  <span>{t.tarkib.thicknessLabel}</span>
                  <span className="font-bold">{strokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4.5"
                  step="0.1"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                  <span>{t.tarkib.spacingLabel}</span>
                  <span className="font-bold">{spacing}px</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="1"
                  value={spacing}
                  onChange={(e) => setSpacing(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                  <span>{t.tarkib.rotationAngle}</span>
                  <span className="font-bold">{rotationAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="15"
                  value={rotationAngle}
                  onChange={(e) => setRotationAngle(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-slate-300 pt-1">
              <input
                type="checkbox"
                checked={showMandalaRings}
                onChange={(e) => setShowMandalaRings(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500"
              />
              <span>{t.tarkib.showMandalaRings}</span>
            </label>

            {/* Export & Copy Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-3">
              <button
                onClick={handleDownloadSVG}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg transition-all"
              >
                <Download size={15} />
                <span>{t.tarkib.downloadGlyph}</span>
              </button>

              <button
                onClick={handleCopyConsonants}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-white font-bold text-xs transition-all"
              >
                {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                <span>{copied ? 'Copié !' : t.tarkib.copyConsonants}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Monogram SVG Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className={`w-full max-w-[460px] p-6 rounded-3xl ${currTheme.bg} border ${currTheme.border} shadow-2xl flex flex-col items-center justify-center relative overflow-hidden`}>
            
            <svg
              id="tarkib-monogram-svg"
              viewBox={`0 0 ${canvasSize} ${canvasSize}`}
              className="w-full h-auto max-w-[380px] select-none drop-shadow-2xl"
            >
              <defs>
                <filter id="monogramGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Protective Mandala Circles */}
              {showMandalaRings && (
                <>
                  <circle cx={center} cy={center} r={170} fill="none" stroke={currTheme.stroke} strokeWidth="0.8" opacity="0.3" strokeDasharray="4,4" />
                  <circle cx={center} cy={center} r={150} fill="none" stroke={currTheme.stroke} strokeWidth="1" opacity="0.6" />
                  <circle cx={center} cy={center} r={120} fill="none" stroke={currTheme.stroke} strokeWidth="0.5" strokeDasharray="2,2" opacity="0.4" />
                </>
              )}

              {/* Stacked Consonants Monogram Glyphs */}
              <g transform={`rotate(${rotationAngle} ${center} ${center})`}>
                {glyphData.letters.map((item, idx) => {
                  const count = glyphData.letters.length;
                  const stepAngle = (360 / count) * idx;
                  const radiusOffset = (idx + 1) * (spacing / 2.5);

                  return (
                    <g
                      key={idx}
                      transform={`rotate(${stepAngle} ${center} ${center}) translate(0, -${radiusOffset})`}
                      filter="url(#monogramGlow)"
                    >
                      {/* Stylized Glyph Geometric Stems */}
                      <path
                        d={`M ${center - 25} ${center} Q ${center} ${center - 45} ${center + 25} ${center} T ${center - 20} ${center + 35}`}
                        fill="none"
                        stroke={currTheme.stroke}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                      />
                      <circle cx={center} cy={center} r={strokeWidth * 2.5} fill={currTheme.accent} />

                      {/* Arabic Consonant Text */}
                      <text
                        x={center}
                        y={center - 10}
                        textAnchor="middle"
                        fill={currTheme.text}
                        fontSize="32"
                        fontWeight="900"
                        fontFamily="Traditional Arabic, Amiri, serif"
                      >
                        {item.char}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Center Emblem Core */}
              <circle cx={center} cy={center} r={14} fill={currTheme.bg} stroke={currTheme.stroke} strokeWidth="2" />
              <circle cx={center} cy={center} r={6} fill={currTheme.accent} />
            </svg>

            {/* Monogram Footer */}
            <div className="mt-4 text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                Al-Tarkib al-Harfi • {glyphData.letters.length} Consonants Stacked
              </span>
              <p className="text-[10px] text-slate-400">
                Total Abjad Weight: {glyphData.totalWeight}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Structural Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Layers className="text-purple-500" size={18} />
          <span>{t.tarkib.glyphAnalysisTitle}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-bold">{t.tarkib.consonantTableLetter}</th>
                <th className="py-2.5 px-3 font-bold">{t.tarkib.consonantTableValue}</th>
                <th className="py-2.5 px-3 font-bold">{t.tarkib.consonantTableElement}</th>
                <th className="py-2.5 px-3 font-bold">{t.tarkib.consonantTableRole}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-800 dark:text-slate-200">
              {glyphData.letters.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-arabic text-base font-bold text-amber-600 dark:text-amber-400">
                    {item.char}
                  </td>
                  <td className="py-2.5 px-3 font-bold">{item.value}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium">
                      {item.element}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-gray-600 dark:text-slate-400">
                    {item.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
