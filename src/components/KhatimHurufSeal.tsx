import React, { useState, useRef } from 'react';
import { Grid, Sparkles, Download, Copy, Check, Eye, RefreshCw, Palette, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { triggerProtectionModal } from './ContentProtectionManager';
import { calculateAbjadValue } from '../utils/abjad';
import { FULL_28_LETTERS_DATA } from '../pages/user/tools/ScienceOfLetters';
import { downloadCanvasImage } from '../utils/downloadHelper';

const translations = {
  fr: {
    title: "Sceau de Lettres (Khatim al-Huruf / خاتم الحروف)",
    subtitle: "Génération automatique du symbole géométrique sacré en reliant les lettres d'un nom disposées en cercle",
    inputLabel: "Nom, Formule ou Mot pour le Sceau :",
    inputPlaceholder: "Entrez un nom ou prénom (ex: محمد, علي, نور)...",
    themeLabel: "Thème Visuel :",
    themeEmerald: "Émeraude Sacrée",
    themeGold: "Or Alchimique",
    themeObsidian: "Nuit d'Obsidienne",
    themeIndigo: "Mystique Indigo",
    showNodesLabel: "Afficher la valeur Abjad des nœuds",
    showPolygonFill: "Remplissage géométrique semi-transparent",
    sealDetailsTitle: "Propriétés Ésotériques du Sceau",
    totalAbjadVal: "Valeur Abjad Globale :",
    nodesCount: "Nombre de Nœuds (Lettres) :",
    downloadPngBtn: "Télécharger Image (PNG HD)",
    downloadSvgBtn: "Vectoriel (SVG)",
    copySvgBtn: "Copier le code SVG",
    copied: "Copié !",
    presetsTitle: "Noms & Formules Recommandés :",
    exporting: "Exportation...",
  },
  en: {
    title: "Letter Seal (Khatim al-Huruf / خاتم الحروف)",
    subtitle: "Automatic generation of sacred geometric symbols by connecting the letters of a name arranged in a circle",
    inputLabel: "Name, Formula or Word for the Seal:",
    inputPlaceholder: "Enter a name or word (e.g., محمد, علي, نور)...",
    themeLabel: "Visual Theme:",
    themeEmerald: "Sacred Emerald",
    themeGold: "Alchemical Gold",
    themeObsidian: "Obsidian Night",
    themeIndigo: "Mystic Indigo",
    showNodesLabel: "Show Node Abjad Values",
    showPolygonFill: "Semi-transparent polygon fill",
    sealDetailsTitle: "Esoteric Seal Properties",
    totalAbjadVal: "Global Abjad Value:",
    nodesCount: "Node Count (Letters):",
    downloadPngBtn: "Download Image (PNG HD)",
    downloadSvgBtn: "Vector (SVG)",
    copySvgBtn: "Copy SVG Code",
    copied: "Copied!",
    presetsTitle: "Recommended Names & Formulas:",
    exporting: "Exporting...",
  },
  ha: {
    title: "Hatimin Haruffa (Khatim al-Huruf / خاتم الحروف)",
    subtitle: "Ƙirƙirar adon sifar gida na asiri ta hanyar haɗa haruffan suna a kewaye",
    inputLabel: "Suna ko Kalmar Hatimi:",
    inputPlaceholder: "Shigar da suna (misali: محمد, علي, نور)...",
    themeLabel: "Sifar Launi:",
    themeEmerald: "Kore Mai Tsarki",
    themeGold: "Zarar Zinari",
    themeObsidian: "Duhun Obsidienne",
    themeIndigo: "Shula Indigo",
    showNodesLabel: "Nuna lissafin Abjad na kowane harafi",
    showPolygonFill: "Cika sifa da inuwa mai haske",
    sealDetailsTitle: "Masallatan Hatimi na Asiri",
    totalAbjadVal: "Cikakken Abjad na Hatimi:",
    nodesCount: "Yawan Haruffa (Nœuds):",
    downloadPngBtn: "Sauke Hoto (PNG HD)",
    downloadSvgBtn: "Fayil na SVG",
    copySvgBtn: "Kwafa Lamarin SVG",
    copied: "An Kwafa!",
    presetsTitle: "Sunayen da Ake Shawara:",
    exporting: "Aiwatarwa...",
  }
};

const PRESETS = ['محمد', 'علي', 'نور', 'الله', 'ودود', 'قدوس', 'سلام'];

export const KhatimHurufSeal: React.FC = () => {
  const { language } = useLanguage();
  const { isPremium } = useAuth();
  const t = translations[(language as 'fr' | 'en' | 'ha') || 'fr'] || translations.fr;

  const [inputName, setInputName] = useState('محمد');
  const [theme, setTheme] = useState<'emerald' | 'gold' | 'obsidian' | 'indigo'>('emerald');
  const [showNodeAbjad, setShowNodeAbjad] = useState(true);
  const [showFill, setShowFill] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Clean characters
  const cleanStr = inputName.replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED\s]/g, '');
  const letters = Array.from(cleanStr);
  const totalAbjad = calculateAbjadValue(cleanStr);

  // Geometry calculations
  const size = 360;
  const center = size / 2;
  const radius = 130;
  const numNodes = Math.max(letters.length, 1);

  // Generate node coordinates
  const nodeCoords = letters.map((char, i) => {
    const angle = (2 * Math.PI * i) / numNodes - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const abjad = calculateAbjadValue(char);
    return { char, index: i, x, y, angle, abjad };
  });

  // SVG Theme Colors
  const themeColors = {
    emerald: {
      bg: '#042f2e',
      circleStroke: '#14b8a6',
      lineStroke: '#34d399',
      fill: 'rgba(52, 211, 153, 0.15)',
      nodeBg: '#0f766e',
      nodeText: '#ffffff',
      centerText: '#6ee7b7',
      accent: '#2dd4bf',
    },
    gold: {
      bg: '#1c1917',
      circleStroke: '#d97706',
      lineStroke: '#fbbf24',
      fill: 'rgba(251, 191, 36, 0.15)',
      nodeBg: '#b45309',
      nodeText: '#ffffff',
      centerText: '#fef08a',
      accent: '#f59e0b',
    },
    obsidian: {
      bg: '#020617',
      circleStroke: '#64748b',
      lineStroke: '#38bdf8',
      fill: 'rgba(56, 189, 248, 0.12)',
      nodeBg: '#1e293b',
      nodeText: '#ffffff',
      centerText: '#7dd3fc',
      accent: '#0284c7',
    },
    indigo: {
      bg: '#1e1b4b',
      circleStroke: '#6366f1',
      lineStroke: '#a855f7',
      fill: 'rgba(168, 85, 247, 0.15)',
      nodeBg: '#4338ca',
      nodeText: '#ffffff',
      centerText: '#e9d5ff',
      accent: '#c084fc',
    }
  };

  const colors = themeColors[theme];

  // Path string connecting all points
  const polygonPoints = nodeCoords.map(n => `${n.x},${n.y}`).join(' ');

  const getFormattedSvgString = (): string => {
    if (!svgRef.current) return '';
    let svgString = new XMLSerializer().serializeToString(svgRef.current);
    if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    return svgString;
  };

  const handleCopySvg = () => {
    if (!isPremium) {
      triggerProtectionModal('copy');
      return;
    }
    const svgData = getFormattedSvgString();
    if (svgData) {
      navigator.clipboard.writeText(svgData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadSvg = () => {
    if (!isPremium) {
      triggerProtectionModal('download');
      return;
    }
    const svgData = getFormattedSvgString();
    if (svgData) {
      const fullXml = `<?xml version="1.0" encoding="UTF-8"?>\n` + svgData;
      const blob = new Blob([fullXml], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `khatim_huruf_${inputName || 'seal'}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    }
  };

  const handleDownloadPng = async () => {
    if (!isPremium) {
      triggerProtectionModal('download');
      return;
    }
    if (!svgRef.current) return;

    try {
      setDownloading(true);
      const svgString = getFormattedSvgString();
      // Embed background rect so PNG export retains theme background
      const svgWithBg = svgString.replace(
        /^(<svg[^>]*>)/i,
        `$1<rect width="100%" height="100%" fill="${colors.bg}"/>`
      );

      const img = new Image();
      const svgBlob = new Blob([svgWithBg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      await new Promise<void>((resolve, reject) => {
        img.onload = async () => {
          try {
            const scale = 3; // High resolution HD export
            const canvas = document.createElement('canvas');
            canvas.width = size * scale;
            canvas.height = size * scale;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = colors.bg;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.scale(scale, scale);
              ctx.drawImage(img, 0, 0, size, size);
            }
            URL.revokeObjectURL(url);
            await downloadCanvasImage(canvas, `khatim_huruf_${inputName || 'seal'}.png`);
            resolve();
          } catch (e) {
            reject(e);
          }
        };
        img.onerror = (err) => {
          URL.revokeObjectURL(url);
          reject(err);
        };
        img.src = url;
      });
    } catch (err) {
      console.error('Error downloading PNG image:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-7 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Grid className="text-emerald-500 shrink-0" size={22} />
          <span>{t.title}</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Input & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">{t.inputLabel}</label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-arabic text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            dir="rtl"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Palette size={14} /> {t.themeLabel}
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="emerald">{t.themeEmerald}</option>
            <option value="gold">{t.themeGold}</option>
            <option value="obsidian">{t.themeObsidian}</option>
            <option value="indigo">{t.themeIndigo}</option>
          </select>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{t.presetsTitle}</span>
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setInputName(p)}
            className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-arabic font-bold transition-all hover:bg-emerald-100 cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Interactive SVG Render Canvas */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative p-4 sm:p-6 rounded-3xl shadow-2xl border-2 border-emerald-500/30 overflow-hidden flex items-center justify-center max-w-full" style={{ backgroundColor: colors.bg }}>
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="w-full max-w-[320px] sm:max-w-[360px] h-auto drop-shadow-lg"
          >
            {/* Outer Decorative Circles */}
            <circle cx={center} cy={center} r={radius + 35} fill="none" stroke={colors.circleStroke} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <circle cx={center} cy={center} r={radius + 20} fill="none" stroke={colors.accent} strokeWidth="1.5" opacity="0.8" />
            <circle cx={center} cy={center} r={radius} fill="none" stroke={colors.circleStroke} strokeWidth="2" />
            <circle cx={center} cy={center} r={radius - 20} fill="none" stroke={colors.circleStroke} strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />

            {/* Connecting Polygon Path */}
            {nodeCoords.length > 1 && (
              <polygon
                points={polygonPoints}
                fill={showFill ? colors.fill : 'none'}
                stroke={colors.lineStroke}
                strokeWidth="2"
                strokeLinejoin="round"
              />
            )}

            {/* Star Diagonals / Star Polygon lines */}
            {nodeCoords.length > 3 && nodeCoords.map((n1, i) => {
              const n2 = nodeCoords[(i + 2) % nodeCoords.length];
              return (
                <line
                  key={i}
                  x1={n1.x}
                  y1={n1.y}
                  x2={n2.x}
                  y2={n2.y}
                  stroke={colors.accent}
                  strokeWidth="1"
                  opacity="0.3"
                />
              );
            })}

            {/* Center Motif (Total Abjad Value) */}
            <circle cx={center} cy={center} r="32" fill={colors.bg} stroke={colors.accent} strokeWidth="2" />
            <text
              x={center}
              y={center - 4}
              textAnchor="middle"
              fill={colors.centerText}
              fontSize="16"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              {totalAbjad}
            </text>
            <text
              x={center}
              y={center + 14}
              textAnchor="middle"
              fill={colors.circleStroke}
              fontSize="9"
              fontFamily="sans-serif"
            >
              ABJAD
            </text>

            {/* Nodes (Letters placed on the circle perimeter) */}
            {nodeCoords.map((node, i) => (
              <g key={i}>
                {/* Node Outer Circle */}
                <circle cx={node.x} cy={node.y} r="18" fill={colors.nodeBg} stroke={colors.accent} strokeWidth="2" />

                {/* Node Letter Text */}
                <text
                  x={node.x}
                  y={node.y + 6}
                  textAnchor="middle"
                  fill={colors.nodeText}
                  fontSize="18"
                  fontWeight="bold"
                  fontFamily="Traditional Arabic, Amiri, serif"
                >
                  {node.char}
                </text>

                {/* Node Abjad Value Badge */}
                {showNodeAbjad && (
                  <text
                    x={node.x}
                    y={node.y - 22}
                    textAnchor="middle"
                    fill={colors.centerText}
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {node.abjad}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Canvas Options & Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleDownloadPng}
            disabled={downloading}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ImageIcon size={16} />
            )}
            <span>{downloading ? t.exporting : t.downloadPngBtn}</span>
          </button>

          <button
            onClick={handleDownloadSvg}
            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-xs font-bold rounded-2xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} />
            <span>{t.downloadSvgBtn}</span>
          </button>

          <button
            onClick={handleCopySvg}
            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-xs font-bold rounded-2xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            <span>{copied ? t.copied : t.copySvgBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
