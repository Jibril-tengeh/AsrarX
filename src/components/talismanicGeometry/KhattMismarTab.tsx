import React, { useState, useMemo } from 'react';
import { PenTool, Download, Copy, Check, Sparkles, Layers } from 'lucide-react';
import { calculateAbjadValue } from '../../utils/abjad';

interface KhattMismarTabProps {
  language: string;
}

// Mapping Arabic letters to stylized geometric Mismar stroke vectors
// Each Mismar glyph consists of line segments [(x1,y1, x2,y2)] and terminal circles [(cx,cy, fill)]
interface MismarGlyph {
  letter: string;
  lines: { x1: number; y1: number; x2: number; y2: number }[];
  dots: { cx: number; cy: number; filled: boolean }[];
}

const MISMAR_ALPHABET: Record<string, MismarGlyph> = {
  'ا': {
    letter: 'ا',
    lines: [{ x1: 20, y1: 10, x2: 20, y2: 70 }],
    dots: [{ cx: 20, cy: 10, filled: true }, { cx: 20, cy: 70, filled: false }]
  },
  'ب': {
    letter: 'ب',
    lines: [{ x1: 10, y1: 50, x2: 30, y2: 50 }, { x1: 10, y1: 50, x2: 10, y2: 30 }, { x1: 30, y1: 50, x2: 30, y2: 30 }],
    dots: [{ cx: 20, cy: 65, filled: true }, { cx: 10, cy: 30, filled: false }, { cx: 30, cy: 30, filled: false }]
  },
  'ت': {
    letter: 'ت',
    lines: [{ x1: 10, y1: 50, x2: 30, y2: 50 }, { x1: 10, y1: 50, x2: 10, y2: 30 }, { x1: 30, y1: 50, x2: 30, y2: 30 }],
    dots: [{ cx: 15, cy: 20, filled: true }, { cx: 25, cy: 20, filled: true }]
  },
  'ث': {
    letter: 'ث',
    lines: [{ x1: 10, y1: 50, x2: 30, y2: 50 }, { x1: 10, y1: 50, x2: 10, y2: 30 }, { x1: 30, y1: 50, x2: 30, y2: 30 }],
    dots: [{ cx: 20, cy: 12, filled: true }, { cx: 12, cy: 22, filled: true }, { cx: 28, cy: 22, filled: true }]
  },
  'ج': {
    letter: 'ج',
    lines: [{ x1: 10, y1: 20, x2: 30, y2: 20 }, { x1: 30, y1: 20, x2: 10, y2: 60 }, { x1: 10, y1: 60, x2: 30, y2: 60 }],
    dots: [{ cx: 20, cy: 40, filled: true }, { cx: 10, cy: 20, filled: false }]
  },
  'ح': {
    letter: 'ح',
    lines: [{ x1: 10, y1: 20, x2: 30, y2: 20 }, { x1: 30, y1: 20, x2: 10, y2: 60 }, { x1: 10, y1: 60, x2: 30, y2: 60 }],
    dots: [{ cx: 10, cy: 20, filled: false }, { cx: 30, cy: 60, filled: false }]
  },
  'خ': {
    letter: 'خ',
    lines: [{ x1: 10, y1: 20, x2: 30, y2: 20 }, { x1: 30, y1: 20, x2: 10, y2: 60 }, { x1: 10, y1: 60, x2: 30, y2: 60 }],
    dots: [{ cx: 20, cy: 10, filled: true }]
  },
  'د': {
    letter: 'د',
    lines: [{ x1: 28, y1: 20, x2: 12, y2: 50 }, { x1: 12, y1: 50, x2: 32, y2: 50 }],
    dots: [{ cx: 28, cy: 20, filled: true }, { cx: 32, cy: 50, filled: false }]
  },
  'ذ': {
    letter: 'ذ',
    lines: [{ x1: 28, y1: 20, x2: 12, y2: 50 }, { x1: 12, y1: 50, x2: 32, y2: 50 }],
    dots: [{ cx: 20, cy: 10, filled: true }, { cx: 28, cy: 20, filled: false }]
  },
  'ر': {
    letter: 'ر',
    lines: [{ x1: 25, y1: 20, x2: 10, y2: 60 }],
    dots: [{ cx: 25, cy: 20, filled: true }, { cx: 10, cy: 60, filled: false }]
  },
  'ز': {
    letter: 'ز',
    lines: [{ x1: 25, y1: 20, x2: 10, y2: 60 }],
    dots: [{ cx: 25, cy: 10, filled: true }, { cx: 25, cy: 20, filled: false }]
  },
  'س': {
    letter: 'س',
    lines: [{ x1: 8, y1: 30, x2: 8, y2: 45 }, { x1: 18, y1: 30, x2: 18, y2: 45 }, { x1: 28, y1: 30, x2: 28, y2: 45 }, { x1: 8, y1: 45, x2: 28, y2: 45 }],
    dots: [{ cx: 8, cy: 30, filled: true }, { cx: 18, cy: 30, filled: true }, { cx: 28, cy: 30, filled: true }]
  },
  'ش': {
    letter: 'ش',
    lines: [{ x1: 8, y1: 35, x2: 8, y2: 50 }, { x1: 18, y1: 35, x2: 18, y2: 50 }, { x1: 28, y1: 35, x2: 28, y2: 50 }, { x1: 8, y1: 50, x2: 28, y2: 50 }],
    dots: [{ cx: 18, cy: 15, filled: true }, { cx: 10, cy: 22, filled: true }, { cx: 26, cy: 22, filled: true }]
  },
  'ص': {
    letter: 'ص',
    lines: [{ x1: 10, y1: 40, x2: 25, y2: 30 }, { x1: 25, y1: 30, x2: 30, y2: 45 }, { x1: 30, y1: 45, x2: 10, y2: 45 }],
    dots: [{ cx: 10, cy: 40, filled: true }, { cx: 25, cy: 30, filled: false }]
  },
  'ض': {
    letter: 'ض',
    lines: [{ x1: 10, y1: 40, x2: 25, y2: 30 }, { x1: 25, y1: 30, x2: 30, y2: 45 }, { x1: 30, y1: 45, x2: 10, y2: 45 }],
    dots: [{ cx: 20, cy: 18, filled: true }, { cx: 10, cy: 40, filled: false }]
  },
  'ط': {
    letter: 'ط',
    lines: [{ x1: 20, y1: 10, x2: 20, y2: 50 }, { x1: 10, y1: 50, x2: 30, y2: 50 }, { x1: 10, y1: 50, x2: 20, y2: 35 }],
    dots: [{ cx: 20, cy: 10, filled: true }, { cx: 30, cy: 50, filled: false }]
  },
  'ظ': {
    letter: 'ظ',
    lines: [{ x1: 20, y1: 10, x2: 20, y2: 50 }, { x1: 10, y1: 50, x2: 30, y2: 50 }, { x1: 10, y1: 50, x2: 20, y2: 35 }],
    dots: [{ cx: 12, cy: 12, filled: true }, { cx: 20, cy: 10, filled: false }]
  },
  'ع': {
    letter: 'ع',
    lines: [{ x1: 10, y1: 20, x2: 25, y2: 20 }, { x1: 25, y1: 20, x2: 10, y2: 40 }, { x1: 10, y1: 40, x2: 30, y2: 65 }],
    dots: [{ cx: 10, cy: 20, filled: true }, { cx: 30, cy: 65, filled: false }]
  },
  'غ': {
    letter: 'غ',
    lines: [{ x1: 10, y1: 20, x2: 25, y2: 20 }, { x1: 25, y1: 20, x2: 10, y2: 40 }, { x1: 10, y1: 40, x2: 30, y2: 65 }],
    dots: [{ cx: 18, cy: 10, filled: true }, { cx: 10, cy: 20, filled: false }]
  },
  'ف': {
    letter: 'ف',
    lines: [{ x1: 15, y1: 30, x2: 25, y2: 30 }, { x1: 25, y1: 30, x2: 25, y2: 50 }, { x1: 10, y1: 50, x2: 30, y2: 50 }],
    dots: [{ cx: 20, cy: 18, filled: true }, { cx: 15, cy: 30, filled: false }]
  },
  'ق': {
    letter: 'ق',
    lines: [{ x1: 15, y1: 35, x2: 25, y2: 35 }, { x1: 25, y1: 35, x2: 25, y2: 55 }, { x1: 10, y1: 55, x2: 30, y2: 55 }],
    dots: [{ cx: 14, cy: 20, filled: true }, { cx: 26, cy: 20, filled: true }]
  },
  'ك': {
    letter: 'ك',
    lines: [{ x1: 28, y1: 15, x2: 12, y2: 15 }, { x1: 12, y1: 15, x2: 12, y2: 55 }, { x1: 12, y1: 55, x2: 30, y2: 55 }],
    dots: [{ cx: 28, cy: 15, filled: true }, { cx: 20, cy: 35, filled: true }]
  },
  'ل': {
    letter: 'ل',
    lines: [{ x1: 25, y1: 10, x2: 25, y2: 50 }, { x1: 25, y1: 50, x2: 10, y2: 60 }],
    dots: [{ cx: 25, cy: 10, filled: true }, { cx: 10, cy: 60, filled: false }]
  },
  'م': {
    letter: 'م',
    lines: [{ x1: 15, y1: 25, x2: 25, y2: 25 }, { x1: 25, y1: 25, x2: 25, y2: 38 }, { x1: 25, y1: 38, x2: 15, y2: 38 }, { x1: 15, y1: 38, x2: 15, y2: 65 }],
    dots: [{ cx: 15, cy: 25, filled: false }, { cx: 15, cy: 65, filled: true }]
  },
  'ن': {
    letter: 'ن',
    lines: [{ x1: 10, y1: 35, x2: 10, y2: 55 }, { x1: 10, y1: 55, x2: 30, y2: 55 }, { x1: 30, y1: 55, x2: 30, y2: 35 }],
    dots: [{ cx: 20, cy: 22, filled: true }]
  },
  'ه': {
    letter: 'ه',
    lines: [{ x1: 10, y1: 35, x2: 20, y2: 20 }, { x1: 20, y1: 20, x2: 30, y2: 35 }, { x1: 30, y1: 35, x2: 20, y2: 50 }, { x1: 20, y1: 50, x2: 10, y2: 35 }],
    dots: [{ cx: 20, cy: 35, filled: true }]
  },
  'و': {
    letter: 'و',
    lines: [{ x1: 15, y1: 20, x2: 28, y2: 20 }, { x1: 28, y1: 20, x2: 28, y2: 35 }, { x1: 28, y1: 35, x2: 12, y2: 60 }],
    dots: [{ cx: 15, cy: 20, filled: false }, { cx: 12, cy: 60, filled: true }]
  },
  'ي': {
    letter: 'ي',
    lines: [{ x1: 10, y1: 25, x2: 28, y2: 25 }, { x1: 28, y1: 25, x2: 10, y2: 50 }, { x1: 10, y1: 50, x2: 30, y2: 50 }],
    dots: [{ cx: 15, cy: 62, filled: true }, { cx: 25, cy: 62, filled: true }]
  },
  'ة': {
    letter: 'ة',
    lines: [{ x1: 10, y1: 35, x2: 20, y2: 20 }, { x1: 20, y1: 20, x2: 30, y2: 35 }, { x1: 30, y1: 35, x2: 20, y2: 50 }, { x1: 20, y1: 50, x2: 10, y2: 35 }],
    dots: [{ cx: 15, cy: 10, filled: true }, { cx: 25, cy: 10, filled: true }]
  },
  'ى': {
    letter: 'ى',
    lines: [{ x1: 10, y1: 25, x2: 28, y2: 25 }, { x1: 28, y1: 25, x2: 10, y2: 50 }, { x1: 10, y1: 50, x2: 30, y2: 50 }],
    dots: [{ cx: 20, cy: 25, filled: false }]
  },
  'ء': {
    letter: 'ء',
    lines: [{ x1: 15, y1: 30, x2: 25, y2: 20 }, { x1: 25, y1: 20, x2: 15, y2: 40 }],
    dots: [{ cx: 15, cy: 30, filled: true }]
  }
};

// Default fallback for spaces or non-Arabic characters
const FALLBACK_GLYPH: MismarGlyph = {
  letter: '?',
  lines: [{ x1: 20, y1: 20, x2: 20, y2: 60 }],
  dots: [{ cx: 20, cy: 20, filled: false }, { cx: 20, cy: 60, filled: false }]
};

export default function KhattMismarTab({ language }: KhattMismarTabProps) {
  const [inputText, setInputText] = useState<string>('الله سلام حكمة');
  const [colorTheme, setColorTheme] = useState<'gold' | 'emerald' | 'obsidian'>('gold');
  const [strokeThickness, setStrokeThickness] = useState<number>(3);
  const [dotRadius, setDotRadius] = useState<number>(4);
  const [copied, setCopied] = useState<boolean>(false);

  const abjadTotal = useMemo(() => calculateAbjadValue(inputText) || 0, [inputText]);

  // Clean letters array
  const parsedLetters = useMemo(() => {
    return inputText
      .split('')
      .filter((char) => char !== ' ')
      .map((char) => ({
        char,
        glyph: MISMAR_ALPHABET[char] || FALLBACK_GLYPH
      }));
  }, [inputText]);

  // Theme styling configurations
  const themes = {
    gold: {
      bg: 'from-amber-950 via-slate-950 to-amber-950',
      stroke: '#f59e0b',
      dotFill: '#fef08a',
      dotStroke: '#d97706',
      border: 'border-amber-500/40',
      text: 'text-amber-300'
    },
    emerald: {
      bg: 'from-emerald-950 via-slate-950 to-emerald-950',
      stroke: '#10b981',
      dotFill: '#a7f3d0',
      dotStroke: '#059669',
      border: 'border-emerald-500/40',
      text: 'text-emerald-300'
    },
    obsidian: {
      bg: 'from-slate-950 via-gray-900 to-slate-950',
      stroke: '#e2e8f0',
      dotFill: '#ffffff',
      dotStroke: '#94a3b8',
      border: 'border-slate-700',
      text: 'text-slate-200'
    }
  };

  const currentTheme = themes[colorTheme];

  const handleCopyText = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('khatt-mismar-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khatt_mismar_${inputText.substring(0, 10)}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-2xl text-amber-600 dark:text-amber-400">
          <PenTool size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? 'Khatt al-Mismar (Nails & Pins Script)'
              : language === 'ha'
              ? 'Khatt al-Mismar (Rubutun Kusa da Segments)'
              : 'Khatt al-Mismar (Écriture à Clous & Segments Circulaires)'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? 'Converts text into ancient talismanic pin-script consisting of straight line segments terminated by circular nail-heads.'
              : language === 'ha'
              ? 'Convert cike da asiri zuwa rubutun yanayi na zane da da\'ira.'
              : 'Convertit un texte en alphabet d\'écriture à segments rectilignes terminés par des cercles (Style Clous / Tilasim des Sages).'}
          </p>
        </div>
      </div>

      {/* Input & Customization Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="md:col-span-2">
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Arabic Phrase / Name to Convert:' : language === 'ha' ? 'Kalmar da zaka Canza:' : 'Texte / Nom Arabe à Convertir en Mismar :'}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="ex: الله, سلام, حكمة..."
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold text-base dir-rtl focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Color Theme:' : language === 'ha' ? 'Launi:' : 'Thème de Couleur :'}
          </label>
          <select
            value={colorTheme}
            onChange={(e) => setColorTheme(e.target.value as any)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="gold">{language === 'en' ? 'Golden Parchment' : 'Or Sacré (Parchment)'}</option>
            <option value="emerald">{language === 'en' ? 'Emerald Night' : 'Émeraude Céleste'}</option>
            <option value="obsidian">{language === 'en' ? 'Obsidian Silver' : 'Obsidienne & Argent'}</option>
          </select>
        </div>
      </div>

      {/* Sliders for Stroke & Dot Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div>
          <div className="flex justify-between font-bold text-gray-700 dark:text-gray-300 mb-1">
            <span>{language === 'en' ? 'Segment Thickness:' : 'Épaisseur des Clous :'}</span>
            <span>{strokeThickness}px</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={strokeThickness}
            onChange={(e) => setStrokeThickness(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between font-bold text-gray-700 dark:text-gray-300 mb-1">
            <span>{language === 'en' ? 'Circle Head Size:' : 'Tête de Clou (Tête Circulaire) :'}</span>
            <span>{dotRadius}px</span>
          </div>
          <input
            type="range"
            min="2"
            max="8"
            value={dotRadius}
            onChange={(e) => setDotRadius(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>

      {/* SVG Rendering Canvas */}
      <div className={`p-6 bg-gradient-to-br ${currentTheme.bg} rounded-3xl border ${currentTheme.border} flex flex-col items-center justify-center space-y-4 shadow-2xl`}>
        <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles size={14} />
          <span>{language === 'en' ? 'Mismar Inscription Rendering' : language === 'ha' ? 'Hoto Rubutun Mismar' : 'Rendu de l\'Inscription en Khatt al-Mismar'}</span>
        </div>

        <div className="w-full overflow-x-auto py-4 flex justify-center">
          <svg
            id="khatt-mismar-svg"
            viewBox={`0 0 ${Math.max(400, parsedLetters.length * 45 + 40)} 100`}
            className="h-28 max-w-full drop-shadow-md"
          >
            {/* Background Container */}
            <rect
              x="0"
              y="0"
              width={Math.max(400, parsedLetters.length * 45 + 40)}
              height="100"
              rx="16"
              fill="#090d16"
              stroke="#d97706"
              strokeWidth="1"
              strokeDasharray="4,4"
            />

            {/* Render Letter Glyphs from Right to Left */}
            {parsedLetters.map((item, idx) => {
              const xOffset = Math.max(400, parsedLetters.length * 45 + 40) - 50 - idx * 45;
              const { lines, dots } = item.glyph;

              return (
                <g key={idx} transform={`translate(${xOffset}, 10)`}>
                  {/* Lines */}
                  {lines.map((line, lIdx) => (
                    <line
                      key={lIdx}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke={currentTheme.stroke}
                      strokeWidth={strokeThickness}
                      strokeLinecap="round"
                    />
                  ))}

                  {/* Terminal Circle Dots */}
                  {dots.map((dot, dIdx) => (
                    <circle
                      key={dIdx}
                      cx={dot.cx}
                      cy={dot.cy}
                      r={dotRadius}
                      fill={dot.filled ? currentTheme.dotFill : '#090d16'}
                      stroke={currentTheme.dotStroke}
                      strokeWidth="1.5"
                    />
                  ))}

                  {/* Original letter label underneath */}
                  <text
                    x="20"
                    y="88"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="11"
                    fontFamily="serif"
                  >
                    {item.char}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Total Abjad Badge & SVG Export */}
        <div className="flex flex-wrap items-center justify-between w-full pt-3 border-t border-slate-800 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{language === 'en' ? 'Calculated Abjad Weight:' : 'Poids Abjad Inscription :'}</span>
            <span className="text-base font-mono font-black text-amber-400">{abjadTotal}</span>
          </div>

          <button
            onClick={handleDownloadSVG}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Download size={14} />
            <span>{language === 'en' ? 'Export Mismar SVG' : 'Exporter SVG Mismar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
