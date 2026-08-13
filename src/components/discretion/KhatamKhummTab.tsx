import React, { useState, useMemo } from 'react';
import { Sparkles, Download, Copy, Check, Info, Shield, EyeOff, RotateCw } from 'lucide-react';
import { DiscretionTranslation } from './discretionTranslations';
import { useAuth } from '../../contexts/AuthContext';

interface KhatamKhummTabProps {
  t: DiscretionTranslation;
}

// 19 Mute Letters in Abjad Tradition with Abjad values and element classifications
export const MUTE_LETTERS_MAP: Record<string, { value: number; name: string; element: 'fire' | 'air' | 'water' | 'earth' }> = {
  'ب': { value: 2, name: 'Bā', element: 'water' },
  'ج': { value: 3, name: 'Jīm', element: 'air' },
  'د': { value: 4, name: 'Dāl', element: 'earth' },
  'و': { value: 6, name: 'Wāw', element: 'air' },
  'ز': { value: 7, name: 'Zāy', element: 'water' },
  'ح': { value: 8, name: 'Ḥā', element: 'fire' },
  'ط': { value: 9, name: 'Ṭā', element: 'fire' },
  'ي': { value: 10, name: 'Yā', element: 'earth' },
  'ك': { value: 20, name: 'Kāf', element: 'water' },
  'ل': { value: 30, name: 'Lām', element: 'air' },
  'م': { value: 40, name: 'Mīm', element: 'fire' },
  'ن': { value: 50, name: 'Nūn', element: 'earth' },
  'س': { value: 60, name: 'Sīn', element: 'water' },
  'ع': { value: 70, name: 'Ayn', element: 'air' },
  'ف': { value: 80, name: 'Fā', element: 'fire' },
  'ص': { value: 90, name: 'Ṣād', element: 'earth' },
  'ق': { value: 100, name: 'Qāf', element: 'water' },
  'ر': { value: 200, name: 'Rā', element: 'air' },
  'ش': { value: 300, name: 'Shīn', element: 'fire' }
};

export const MUTE_LETTERS_ARRAY = Object.keys(MUTE_LETTERS_MAP);

export default function KhatamKhummTab({ t }: KhatamKhummTabProps) {
  const { isPremium } = useAuth();
  const [inputText, setInputText] = useState('');
  const [activeTheme, setActiveTheme] = useState<'gold' | 'emerald' | 'obsidian' | 'parchment'>('gold');
  const [strokeWidth, setStrokeWidth] = useState(1.5);
  const [rotation, setRotation] = useState(0);
  const [showNodeLabels, setShowNodeLabels] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [copied, setCopied] = useState(false);

  // Filter input text or use default all 19 mute letters
  const extractedAnalysis = useMemo(() => {
    const raw = inputText.trim();
    if (!raw) {
      // Default: all 19 mute letters loaded
      const totalScore = MUTE_LETTERS_ARRAY.reduce((acc, ch) => acc + MUTE_LETTERS_MAP[ch].value, 0);
      return {
        letters: MUTE_LETTERS_ARRAY,
        totalScore,
        ratio: 100,
        isCustom: false
      };
    }

    const filtered: string[] = [];
    let totalArabicChars = 0;

    for (const char of raw) {
      // Normalize Arabic diacritics
      const norm = char.replace(/[\u064B-\u065F]/g, '');
      if (/[\u0600-\u06FF]/.test(norm)) {
        totalArabicChars++;
        if (MUTE_LETTERS_MAP[norm]) {
          filtered.push(norm);
        }
      }
    }

    const uniqueLetters = Array.from(new Set(filtered));
    const activeList = uniqueLetters.length > 0 ? uniqueLetters : MUTE_LETTERS_ARRAY;
    const totalScore = activeList.reduce((acc, ch) => acc + (MUTE_LETTERS_MAP[ch]?.value || 0), 0);
    const ratio = totalArabicChars > 0 
      ? Math.round((filtered.length / totalArabicChars) * 100) 
      : 100;

    return {
      letters: activeList,
      totalScore,
      ratio: Math.min(100, Math.max(15, ratio)),
      isCustom: uniqueLetters.length > 0
    };
  }, [inputText]);

  // Handle Copy formula
  const handleCopyFormula = () => {
    const formulaStr = extractedAnalysis.letters.join(' - ') + ` | V-Khumm = ${extractedAnalysis.totalScore}`;
    navigator.clipboard.writeText(formulaStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // SVG dimensions
  const svgSize = 440;
  const center = svgSize / 2;
  const radius = 160;

  // Calculate vertices coordinates for the active 19 (or subset) mute letters
  const polygonVertices = useMemo(() => {
    const list = extractedAnalysis.letters;
    const count = list.length;
    return list.map((char, index) => {
      const angleDeg = (360 / count) * index - 90 + rotation;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = center + radius * Math.cos(angleRad);
      const y = center + radius * Math.sin(angleRad);
      return { char, index, x, y, angleDeg };
    });
  }, [extractedAnalysis.letters, rotation, center, radius]);

  // Color schemes for SVG Seal
  const themeStyles = {
    gold: {
      bg: 'bg-slate-950',
      border: 'border-amber-500/30',
      ringStroke: '#f59e0b',
      lineStroke: '#fbbf24',
      nodeFill: '#0f172a',
      nodeStroke: '#d97706',
      textFill: '#fef3c7',
      centerFill: 'rgba(217, 119, 6, 0.15)',
      glow: 'rgba(245, 158, 11, 0.25)'
    },
    emerald: {
      bg: 'bg-emerald-950',
      border: 'border-emerald-500/30',
      ringStroke: '#10b981',
      lineStroke: '#34d399',
      nodeFill: '#064e3b',
      nodeStroke: '#059669',
      textFill: '#d1fae5',
      centerFill: 'rgba(5, 150, 105, 0.2)',
      glow: 'rgba(16, 185, 129, 0.3)'
    },
    obsidian: {
      bg: 'bg-zinc-950',
      border: 'border-zinc-700',
      ringStroke: '#d4d4d8',
      lineStroke: '#a1a1aa',
      nodeFill: '#18181b',
      nodeStroke: '#71717a',
      textFill: '#ffffff',
      centerFill: 'rgba(113, 113, 122, 0.2)',
      glow: 'rgba(212, 212, 216, 0.2)'
    },
    parchment: {
      bg: 'bg-amber-50/90 dark:bg-amber-950/40',
      border: 'border-amber-700/30',
      ringStroke: '#b45309',
      lineStroke: '#d97706',
      nodeFill: '#fef3c7',
      nodeStroke: '#92400e',
      textFill: '#78350f',
      centerFill: 'rgba(180, 83, 9, 0.1)',
      glow: 'rgba(217, 119, 6, 0.15)'
    }
  };

  const currTheme = themeStyles[activeTheme];

  // Function to generate star/chord connection path for 19 vertices
  const chordLines = useMemo(() => {
    if (!showLines || polygonVertices.length < 3) return [];
    const lines = [];
    const len = polygonVertices.length;

    // Connect vertices using step intervals based on Abjad total
    const step = (extractedAnalysis.totalScore % (len - 1)) + 2;

    for (let i = 0; i < len; i++) {
      const p1 = polygonVertices[i];
      const p2 = polygonVertices[(i + step) % len];
      lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, id: `${i}-${step}` });
    }

    // Outer perimeter polygon
    for (let i = 0; i < len; i++) {
      const p1 = polygonVertices[i];
      const p2 = polygonVertices[(i + 1) % len];
      lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, id: `p-${i}` });
    }

    return lines;
  }, [polygonVertices, showLines, extractedAnalysis.totalScore]);

  // Download SVG
  const handleDownloadSVG = () => {
    const svgEl = document.getElementById('khatam-khumm-svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Khatam_al_Khumm_Mute_Seal_${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0 mt-1">
            <EyeOff className="text-amber-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
              {t.khumm.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.khumm.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Control Panel & Input */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                {t.khumm.inputLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.khumm.inputPlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500/50 outline-none transition-all"
                />
                {inputText && (
                  <button
                    onClick={() => setInputText('')}
                    className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-[10px] text-gray-500 dark:text-slate-400 font-medium">
                  {t.khumm.statsMuteLetters}
                </span>
                <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                  {extractedAnalysis.letters.length} / 19
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-[10px] text-gray-500 dark:text-slate-400 font-medium">
                  {t.khumm.statsAbjadValue}
                </span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                  {extractedAnalysis.totalScore}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-[10px] text-gray-500 dark:text-slate-400 font-medium">
                  {t.khumm.statsMuteRatio}
                </span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {extractedAnalysis.ratio}%
                </span>
              </div>
            </div>

            {/* Visual Customization Options */}
            <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                  {t.khumm.sealStyle}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveTheme('gold')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      activeTheme === 'gold'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent'
                    }`}
                  >
                    {t.khumm.themeGold}
                  </button>
                  <button
                    onClick={() => setActiveTheme('emerald')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      activeTheme === 'emerald'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent'
                    }`}
                  >
                    {t.khumm.themeEmerald}
                  </button>
                  <button
                    onClick={() => setActiveTheme('obsidian')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      activeTheme === 'obsidian'
                        ? 'bg-zinc-800 text-white border-zinc-500 shadow-md'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent'
                    }`}
                  >
                    {t.khumm.themeObsidian}
                  </button>
                  <button
                    onClick={() => setActiveTheme('parchment')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      activeTheme === 'parchment'
                        ? 'bg-amber-200 text-amber-950 border-amber-400 shadow-md'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent'
                    }`}
                  >
                    {t.khumm.themeParchment}
                  </button>
                </div>
              </div>

              {/* Sliders for Stroke & Rotation */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                    <span>{t.khumm.strokeWidth}</span>
                    <span className="font-bold">{strokeWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="3.5"
                    step="0.1"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                    <span>{t.khumm.rotation}</span>
                    <span className="font-bold">{rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="5"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={showNodeLabels}
                    onChange={(e) => setShowNodeLabels(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>{t.khumm.showNodeLabels}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={showLines}
                    onChange={(e) => setShowLines(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>{t.khumm.showLines}</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-3">
                <button
                  onClick={handleDownloadSVG}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg transition-all"
                >
                  <Download size={15} />
                  <span>{t.khumm.downloadSeal}</span>
                </button>

                <button
                  onClick={handleCopyFormula}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-white font-bold text-xs transition-all"
                >
                  {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                  <span>{copied ? t.khumm.formulaCopied : t.khumm.copyFormula}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className={`w-full max-w-[460px] p-6 rounded-3xl ${currTheme.bg} border ${currTheme.border} shadow-2xl flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300`}>
            
            <svg
              id="khatam-khumm-svg"
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              className="w-full h-auto max-w-[400px] select-none drop-shadow-2xl"
            >
              <defs>
                <radialGradient id="khummCenterGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={currTheme.lineStroke} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={currTheme.lineStroke} stopOpacity="0" />
                </radialGradient>
                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background ambient circle */}
              <circle cx={center} cy={center} r={radius + 30} fill="none" stroke={currTheme.ringStroke} strokeWidth="0.8" strokeDasharray="3,3" opacity="0.4" />
              <circle cx={center} cy={center} r={radius + 15} fill="none" stroke={currTheme.ringStroke} strokeWidth="1" opacity="0.7" />
              <circle cx={center} cy={center} r={radius} fill="none" stroke={currTheme.ringStroke} strokeWidth="1.8" />
              <circle cx={center} cy={center} r={radius - 20} fill="none" stroke={currTheme.ringStroke} strokeWidth="0.8" opacity="0.5" />

              {/* Center Glow Medallion */}
              <circle cx={center} cy={center} r={65} fill="url(#khummCenterGlow)" />
              <circle cx={center} cy={center} r={50} fill={currTheme.centerFill} stroke={currTheme.ringStroke} strokeWidth="1" />
              <circle cx={center} cy={center} r={42} fill="none" stroke={currTheme.ringStroke} strokeWidth="0.5" strokeDasharray="2,2" />

              {/* Calligraphic Center Text */}
              <text
                x={center}
                y={center - 6}
                textAnchor="middle"
                fill={currTheme.textFill}
                fontSize="18"
                fontWeight="900"
                fontFamily="Traditional Arabic, Amiri, serif"
              >
                ختم الخُمّ
              </text>
              <text
                x={center}
                y={center + 16}
                textAnchor="middle"
                fill={currTheme.lineStroke}
                fontSize="10"
                fontWeight="bold"
                letterSpacing="1"
              >
                V={extractedAnalysis.totalScore}
              </text>

              {/* Connecting Chord Lines */}
              {chordLines.map((line) => (
                <line
                  key={line.id}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={currTheme.lineStroke}
                  strokeWidth={strokeWidth}
                  opacity="0.65"
                />
              ))}

              {/* Node Vertices with Letters */}
              {polygonVertices.map((v) => (
                <g key={v.index} className="transition-transform duration-200">
                  <circle
                    cx={v.x}
                    cy={v.y}
                    r={18}
                    fill={currTheme.nodeFill}
                    stroke={currTheme.nodeStroke}
                    strokeWidth="2"
                    filter="url(#glowFilter)"
                  />

                  {showNodeLabels && (
                    <text
                      x={v.x}
                      y={v.y + 6}
                      textAnchor="middle"
                      fill={currTheme.textFill}
                      fontSize="17"
                      fontWeight="bold"
                      fontFamily="Traditional Arabic, Amiri, serif"
                    >
                      {v.char}
                    </text>
                  )}
                </g>
              ))}
            </svg>

            {/* Seal Legend Footer */}
            <div className="mt-4 text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                Khatam al-Khumm • {extractedAnalysis.letters.length} Mute Nodes
              </span>
              <p className="text-[10px] text-slate-400">
                {t.khumm.all19LettersNotice}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Traditional Virtues & Explanation Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <Info size={22} />
          <h3 className="text-base sm:text-lg font-bold">
            {t.khumm.explanationTitle}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
          {t.khumm.explanationBody}
        </p>

        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
            {t.khumm.virtuesTitle}
          </h4>
          <ul className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 space-y-1.5 list-disc list-inside">
            <li>{t.khumm.virtue1}</li>
            <li>{t.khumm.virtue2}</li>
            <li>{t.khumm.virtue3}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
