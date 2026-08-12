import React, { useState, useMemo } from 'react';
import { Sparkles, Layers, Palette, RefreshCw, Eye } from 'lucide-react';
import { ExportFormatButtons } from '../common/ExportFormatButtons';

interface CalligraphieFractaleTabProps {
  language: string;
}

const DIVINE_PRESETS = [
  { text: 'الله', nameFr: 'ALLAH (الله)', nameEn: 'ALLAH', nameHa: 'ALLAH' },
  { text: 'هو', nameFr: 'HUWA (هو)', nameEn: 'HUWA', nameHa: 'HUWA' },
  { text: 'نور', nameFr: 'NUR (نور)', nameEn: 'NUR', nameHa: 'NUR' },
  { text: 'حي قيوم', nameFr: 'HAYY QAYYUM (حي قيوم)', nameEn: 'HAYY QAYYUM', nameHa: 'HAYY QAYYUM' },
];

const PALETTES = {
  gold: { nameFr: 'Or & Émeraude', nameEn: 'Gold & Emerald', nameHa: 'Zaratan da Kore', bg: '#022c22', stroke: '#fbbf24', text: '#fef08a' },
  sapphire: { nameFr: 'Saphir & Argent', nameEn: 'Sapphire & Silver', nameHa: 'Shudi da Azurfa', bg: '#0f172a', stroke: '#38bdf8', text: '#e0f2fe' },
  ruby: { nameFr: 'Rubis & Nuit', nameEn: 'Ruby & Night', nameHa: 'Ja da Duhu', bg: '#4c0519', stroke: '#fb7185', text: '#ffe4e6' },
  violet: { nameFr: 'Violet Céleste', nameEn: 'Celestial Violet', nameHa: 'Porphyre', bg: '#2e1065', stroke: '#c084fc', text: '#f3e8ff' }
};

export default function CalligraphieFractaleTab({ language }: CalligraphieFractaleTabProps) {
  const [selectedText, setSelectedText] = useState<string>('الله');
  const [customText, setCustomText] = useState<string>('الله');
  const [geometry, setGeometry] = useState<'rosette' | 'tree' | 'snowflake'>('rosette');
  const [depth, setDepth] = useState<number>(3);
  const [paletteKey, setPaletteKey] = useState<keyof typeof PALETTES>('gold');

  const activeText = useMemo(() => {
    if (selectedText === 'custom') return customText || 'الله';
    return selectedText;
  }, [selectedText, customText]);

  const palette = PALETTES[paletteKey] || PALETTES.gold;

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('calligraphie-fractale-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fractal_calligraphy_${activeText}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate fractal vector elements
  const fractalNodes = useMemo(() => {
    const nodes: Array<{ x: number; y: number; scale: number; angle: number; text: string }> = [];

    if (geometry === 'rosette') {
      const petals = 8;
      for (let d = 1; d <= depth; d++) {
        const radius = d * 35;
        const count = petals * d;
        for (let i = 0; i < count; i++) {
          const angle = (i * 2 * Math.PI) / count;
          nodes.push({
            x: 200 + radius * Math.cos(angle),
            y: 200 + radius * Math.sin(angle),
            scale: 1.4 - d * 0.25,
            angle: (angle * 180) / Math.PI + 90,
            text: activeText
          });
        }
      }
    } else if (geometry === 'tree') {
      const addBranch = (x: number, y: number, len: number, angleDeg: number, currentDepth: number) => {
        if (currentDepth > depth) return;
        const rad = (angleDeg * Math.PI) / 180;
        const nx = x + len * Math.cos(rad);
        const ny = y + len * Math.sin(rad);

        nodes.push({
          x: nx,
          y: ny,
          scale: 1.2 - currentDepth * 0.2,
          angle: angleDeg,
          text: activeText
        });

        addBranch(nx, ny, len * 0.7, angleDeg - 30, currentDepth + 1);
        addBranch(nx, ny, len * 0.7, angleDeg + 30, currentDepth + 1);
      };

      addBranch(200, 320, 60, -90, 1);
    } else {
      // Snowflake geometry
      for (let i = 0; i < 6; i++) {
        const baseAngle = (i * 60 * Math.PI) / 180;
        for (let d = 1; d <= depth; d++) {
          const r = d * 40;
          nodes.push({
            x: 200 + r * Math.cos(baseAngle),
            y: 200 + r * Math.sin(baseAngle),
            scale: 1.3 - d * 0.2,
            angle: (baseAngle * 180) / Math.PI,
            text: activeText
          });
        }
      }
    }

    return nodes;
  }, [geometry, depth, activeText]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-2xl text-purple-600 dark:text-purple-400">
          <Layers size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? 'Fractal Calligraphy Generator'
              : language === 'ha'
              ? 'Mai Kirkirar Rubutun Micro-Letter Fractal'
              : 'Générateur Calligraphique Fractal'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? 'Draws vector fractal geometries composed of micro-letters of Divine Names and holy litanies.'
              : language === 'ha'
              ? 'Yana zana siffofin fractal na haruffa masu matukar kyau na sunayen Allah.'
              : 'Génère des figures géométriques fractales composées de micro-lettres des Noms Divins.'}
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Divine Name / Micro-Text:' : language === 'ha' ? 'Sunan Allah / Haruffa:' : 'Nom Divin / Micro-Texte :'}
          </label>
          <select
            value={selectedText}
            onChange={(e) => setSelectedText(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold outline-none"
          >
            {DIVINE_PRESETS.map((p, idx) => (
              <option key={idx} value={p.text}>
                {language === 'en' ? p.nameEn : language === 'ha' ? p.nameHa : p.nameFr}
              </option>
            ))}
            <option value="custom">
              {language === 'en' ? 'Custom Text' : language === 'ha' ? 'Rubutu na Musamman' : 'Texte Personnalisé'}
            </option>
          </select>
        </div>

        {selectedText === 'custom' && (
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              {language === 'en' ? 'Custom Text (Arabic):' : language === 'ha' ? 'Rubutu (Larabci):' : 'Texte Arabe :'}
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold outline-none"
            />
          </div>
        )}

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Fractal Geometry:' : language === 'ha' ? 'Siffar Fractal:' : 'Géométrie Fractale :'}
          </label>
          <select
            value={geometry}
            onChange={(e) => setGeometry(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold outline-none"
          >
            <option value="rosette">{language === 'en' ? 'Sacred Rosette' : language === 'ha' ? 'Rosette Mai Tsarki' : 'Rosace Sacrée'}</option>
            <option value="tree">{language === 'en' ? 'Tree of Life' : language === 'ha' ? 'Bishiyar Rayuwa' : 'Arbre de Vie'}</option>
            <option value="snowflake">{language === 'en' ? 'Hexagonal Snowflake' : language === 'ha' ? 'Kankarar Hexagon' : 'Flocon Hexagonal'}</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Fractal Depth (1 to 4):' : language === 'ha' ? 'Zurfi (1-4):' : 'Profondeur Fractale (1 à 4) :'}
          </label>
          <input
            type="range"
            min="1"
            max="4"
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
            className="w-full accent-purple-600 mt-2"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Color Palette Theme:' : language === 'ha' ? 'Launi da Kalar Haruffa:' : 'Thème de Couleurs :'}
          </label>
          <select
            value={paletteKey}
            onChange={(e) => setPaletteKey(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold outline-none"
          >
            {Object.entries(PALETTES).map(([k, v]) => (
              <option key={k} value={k}>
                {language === 'en' ? v.nameEn : language === 'ha' ? v.nameHa : v.nameFr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="flex flex-col items-center justify-center p-6 rounded-3xl border border-purple-500/40 shadow-2xl text-center space-y-4" style={{ backgroundColor: palette.bg }}>
        <svg id="calligraphie-fractale-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" className="w-full max-w-[360px] h-auto drop-shadow-2xl">
          <rect width="400" height="400" fill={palette.bg} rx="24" />
          <circle cx="200" cy="200" r="190" fill="none" stroke={palette.stroke} strokeWidth="2" opacity="0.4" />
          <circle cx="200" cy="200" r="180" fill="none" stroke={palette.stroke} strokeWidth="1" opacity="0.2" />

          {/* Central Calligraphic Core */}
          <text
            x="200"
            y="210"
            textAnchor="middle"
            fill={palette.text}
            fontSize="32"
            fontFamily="serif"
            fontWeight="bold"
          >
            {activeText}
          </text>

          {/* Fractal Micro-Letter Nodes */}
          {fractalNodes.map((n, idx) => (
            <text
              key={idx}
              x={n.x}
              y={n.y}
              transform={`rotate(${n.angle}, ${n.x}, ${n.y})`}
              textAnchor="middle"
              fill={palette.stroke}
              fontSize={14 * n.scale}
              fontFamily="serif"
              fontWeight="bold"
              opacity={0.85}
            >
              {n.text}
            </text>
          ))}
        </svg>

        <ExportFormatButtons
          svgId="calligraphie-fractale-svg"
          filename={`fractal_calligraphy_${activeText}`}
          title={language === 'en' ? 'Fractal Calligraphy' : 'Calligraphie Fractale'}
          subtitle={`Géométrie: ${geometry} • Profondeur: ${depth}`}
          language={language}
        />
      </div>
    </div>
  );
}
