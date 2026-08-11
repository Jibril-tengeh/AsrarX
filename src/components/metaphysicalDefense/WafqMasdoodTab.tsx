import React, { useState, useMemo } from 'react';
import { ShieldAlert, Sparkles, Lock, RefreshCw } from 'lucide-react';
import { calculateAbjadValue } from '../../utils/abjad';
import { ExportFormatButtons } from '../common/ExportFormatButtons';

interface WafqMasdoodTabProps {
  language: string;
}

export default function WafqMasdoodTab({ language }: WafqMasdoodTabProps) {
  const [targetIntention, setTargetIntention] = useState<string>('سلام قولا من رب رحيم');
  const [gridSize, setGridSize] = useState<number>(4);

  const activeAbjad = useMemo(() => calculateAbjadValue(targetIntention) || 818, [targetIntention]);

  // Generate Wafq al-Masdood (outer border locked at 0 / seal, inner cells active)
  const wafqGrid = useMemo(() => {
    const size = gridSize;
    const matrix: number[][] = Array.from({ length: size }, () => Array(size).fill(0));

    // Inner core size
    const innerSize = size - 2;
    if (innerSize >= 2) {
      const base = Math.floor(activeAbjad / (innerSize * innerSize));
      let current = base;
      for (let r = 1; r <= innerSize; r++) {
        for (let c = 1; c <= innerSize; c++) {
          matrix[r][c] = current;
          current += 3;
        }
      }
    } else {
      matrix[1][1] = activeAbjad;
    }

    return matrix;
  }, [gridSize, activeAbjad]);

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('wafq-masdood-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wafq_masdood_${gridSize}x${gridSize}_${activeAbjad}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-2xl text-amber-600 dark:text-amber-400">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? 'Wafq al-Masdood (Sealed Outer Border Fortress Square)'
              : language === 'ha'
              ? 'Wafq al-Masdood (Gidan Wafq mai Kariya da Tufafi)'
              : 'Wafq al-Masdood (Carré Magique Forteresse aux Bordures Scellées)'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? 'A defensive magic square where all outer perimeter cells are sealed at zero to trap negative forces and protect the inner core.'
              : language === 'ha'
              ? 'Gidan wafq na kariya inda dukkan saman ginin ke a rufe da sifili domin tsare tsakiyar gidan.'
              : 'Carré défensif où toutes les cases de la bordure externe sont scellées à zéro pour neutraliser les attaques extérieures.'}
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Protection Verset or Name (Arabic):' : language === 'ha' ? 'Aya ko Sunan Kariya (Larabci):' : 'Verset ou Nom de Protection (en Arabe) :'}
          </label>
          <input
            type="text"
            value={targetIntention}
            onChange={(e) => setTargetIntention(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Fortress Grid Dimension:' : language === 'ha' ? 'Girma da Girman Gidan Wafq:' : 'Dimension de la Grille :'}
          </label>
          <select
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value={4}>4 x 4 ({language === 'en' ? '2x2 Active Core' : language === 'ha' ? 'Cinside 2x2' : 'Cœur 2x2'})</option>
            <option value={5}>5 x 5 ({language === 'en' ? '3x3 Active Core' : language === 'ha' ? 'Cinside 3x3' : 'Cœur 3x3'})</option>
            <option value={6}>6 x 6 ({language === 'en' ? '4x4 Active Core' : language === 'ha' ? 'Cinside 4x4' : 'Cœur 4x4'})</option>
          </select>
        </div>
      </div>

      {/* Display & Download */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Fortress Square (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-950 via-gray-950 to-slate-950 rounded-3xl border border-amber-600/40 shadow-2xl text-center space-y-4">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>Wafq Masdood {gridSize}x{gridSize}</span>
          </div>

          <svg id="wafq-masdood-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto drop-shadow-2xl">
            <rect width="320" height="320" fill="#180e02" rx="20" />
            <rect x="10" y="10" width="300" height="300" fill="#2d1b04" stroke="#f59e0b" strokeWidth="3" rx="16" />

            {/* Grid Render */}
            {wafqGrid.map((row, r) => {
              const cellSize = 300 / gridSize;
              return row.map((val, c) => {
                const isBorder = r === 0 || r === gridSize - 1 || c === 0 || c === gridSize - 1;
                const x = 10 + c * cellSize;
                const y = 10 + r * cellSize;
                return (
                  <g key={`${r}-${c}`}>
                    <rect
                      x={x}
                      y={y}
                      width={cellSize}
                      height={cellSize}
                      fill={isBorder ? '#451a03' : '#78350f'}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                    <text
                      x={x + cellSize / 2}
                      y={y + cellSize / 2 + 5}
                      textAnchor="middle"
                      fill={isBorder ? '#d97706' : '#fef3c7'}
                      fontSize={isBorder ? 14 : 16}
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {isBorder ? '٠' : val}
                    </text>
                  </g>
                );
              });
            })}
          </svg>

          <ExportFormatButtons
            svgId="wafq-masdood-svg"
            filename={`wafq_masdood_${gridSize}x${gridSize}_${activeAbjad}`}
            title={language === 'en' ? `Wafq Masdood (${gridSize}x${gridSize})` : language === 'ha' ? `Wafq Masdood (${gridSize}x${gridSize})` : `Wafq Scellé Masdood (${gridSize}x${gridSize})`}
            subtitle={`Intention Abjad: ${activeAbjad} • Grille Hermétique Clôturée`}
            language={language}
          />
        </div>

        {/* Structural Matrix Details (7 cols) */}
        <div className="lg:col-span-7 space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
            <h3 className="font-bold uppercase tracking-widest text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <Lock size={16} />
              <span>{language === 'en' ? 'Sealed Outer Rim Matrix Structure:' : language === 'ha' ? 'Ganuwar Masdood da Sifili:' : 'Structure de la Grille Scellée (Masdood) :'}</span>
            </h3>

            <div className="grid gap-1 text-center font-mono" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
              {wafqGrid.map((row, r) =>
                row.map((val, c) => {
                  const isBorder = r === 0 || r === gridSize - 1 || c === 0 || c === gridSize - 1;
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`p-2 rounded-lg border font-bold ${
                        isBorder
                          ? 'bg-amber-200 dark:bg-amber-950/80 border-amber-400 text-amber-900 dark:text-amber-300'
                          : 'bg-white dark:bg-gray-800 border-amber-300 text-amber-800 dark:text-amber-100'
                      }`}
                    >
                      {isBorder ? '٠ (Lock)' : val}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-2 text-gray-600 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-white block">
              {language === 'en' ? 'Fortress Magic Square Principle:' : language === 'ha' ? 'Bayanin Kariya na Wafq Masdood:' : 'Principe de la Forteresse aux Bordures Scellées :'}
            </span>
            <p className="leading-relaxed">
              {language === 'en'
                ? 'Wafq al-Masdood seals the outer perimeter cells with zeros (٠), forming an impenetrable perimeter fence around the inner active spiritual square.'
                : language === 'ha'
                ? 'Wafq al-Masdood yana rufe dukkan kananan dakunan dake waje da sifili (٠) domin gina ganuwa mai karfi dake kiyaye cinside na asiri.'
                : 'Le Wafq al-Masdood scelle la bordure externe avec des zéros (٠), créant un rempart infranchissable qui protège le cœur spirituel actif.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
