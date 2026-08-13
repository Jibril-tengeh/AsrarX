import React, { useState, useMemo } from 'react';
import { Lock, Anchor, Download, Copy, Check, RefreshCw, Layers } from 'lucide-react';
import { AnchoringTranslation } from './anchoringTranslations';
import { calculateAbjadValue } from '../../utils/abjad';

interface KhatamThabatTabProps {
  t: AnchoringTranslation;
}

export default function KhatamThabatTab({ t }: KhatamThabatTabProps) {
  const [intention, setIntention] = useState('ثبات العمل والمال');
  const [customWeight, setCustomWeight] = useState<string>('');
  const [squareSize, setSquareSize] = useState<3 | 4>(3);
  const [lockPivots, setLockPivots] = useState(true);
  const [copied, setCopied] = useState(false);

  // Compute Magic Square Grid
  const gridData = useMemo(() => {
    const rawIntention = intention.trim() || 'ثبات';
    const computedAbjad = customWeight && !isNaN(Number(customWeight)) && Number(customWeight) > 0
      ? Number(customWeight)
      : calculateAbjadValue(rawIntention);

    const size = squareSize;

    if (size === 3) {
      // 3x3 Ghazali Order
      // Formula: S = Target Weight. Base = (S - 12) / 3
      const S = Math.max(15, computedAbjad);
      const base = Math.floor((S - 12) / 3);
      const rem = (S - 12) % 3;

      // Base order: [4, 9, 2], [3, 5, 7], [8, 1, 6]
      const rawCells = [
        [4, 9, 2],
        [3, 5, 7],
        [8, 1, 6]
      ];

      const matrix = rawCells.map((row, r) =>
        row.map((val, c) => {
          let num = base + val - 1;
          // Apply remainder adjustment at highest position if rem > 0
          if (val >= 7 && rem >= 1) num += 1;
          if (val >= 9 && rem === 2) num += 1;
          return num;
        })
      );

      // Pivot cells are corners (0,0), (0,2), (2,0), (2,2) and center (1,1)
      const pivotMask = [
        [true, false, true],
        [false, true, false],
        [true, false, true]
      ];

      return { size, matrix, pivotMask, targetSum: S };
    } else {
      // 4x4 Standard Order
      const S = Math.max(34, computedAbjad);
      const base = Math.floor((S - 30) / 4);
      const rem = (S - 30) % 4;

      const rawCells = [
        [16, 2, 3, 13],
        [5, 11, 10, 8],
        [9, 7, 6, 12],
        [4, 14, 15, 1]
      ];

      const matrix = rawCells.map((row) =>
        row.map((val) => {
          let num = base + val - 1;
          if (val >= 13 && rem >= 1) num += 1;
          if (val >= 14 && rem >= 2) num += 1;
          if (val >= 15 && rem >= 3) num += 1;
          return num;
        })
      );

      const pivotMask = [
        [true, false, false, true],
        [false, true, true, false],
        [false, true, true, false],
        [true, false, false, true]
      ];

      return { size, matrix, pivotMask, targetSum: S };
    }
  }, [intention, customWeight, squareSize]);

  const handleCopy = () => {
    const rowsStr = gridData.matrix.map(r => r.join('\t')).join('\n');
    navigator.clipboard.writeText(rowsStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    const svgEl = document.getElementById('khatam-thabat-svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Khatam_Thabat_${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-amber-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0 mt-1">
            <Anchor className="text-amber-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
              {t.khatamThabat.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.khatamThabat.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Grid & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                {t.khatamThabat.intentionInput}
              </label>
              <input
                type="text"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Ex: ثبات المال والعمل"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                {t.khatamThabat.customWeightInput}
              </label>
              <input
                type="number"
                value={customWeight}
                onChange={(e) => setCustomWeight(e.target.value)}
                placeholder="Ex: 500"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none font-mono"
              />
            </div>

            {/* Matrix Size Choice */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                {t.khatamThabat.squareType}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSquareSize(3)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    squareSize === 3
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent'
                  }`}
                >
                  3 x 3 (Muthallath)
                </button>
                <button
                  type="button"
                  onClick={() => setSquareSize(4)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    squareSize === 4
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent'
                  }`}
                >
                  4 x 4 (Murabba)
                </button>
              </div>
            </div>

            {/* Pivot Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-slate-300 pt-2">
              <input
                type="checkbox"
                checked={lockPivots}
                onChange={(e) => setLockPivots(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500"
              />
              <span>{t.khatamThabat.lockPivotPoints}</span>
            </label>

            {/* Actions */}
            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={handleDownloadSVG}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Download size={16} />
                <span>{t.khatamThabat.downloadSquare}</span>
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                <span>{copied ? t.khatamThabat.copied : t.khatamThabat.copyMatrix}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Magic Square Display Column */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="w-full max-w-[480px] p-6 rounded-3xl bg-slate-950 border border-amber-500/30 shadow-2xl flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
            
            {/* SVG Square */}
            <svg
              id="khatam-thabat-svg"
              viewBox="0 0 400 400"
              className="w-full h-auto max-w-[380px] select-none drop-shadow-2xl"
            >
              <rect x="10" y="10" width="380" height="380" fill="#020617" rx="16" stroke="#f59e0b" strokeWidth="2" />
              <rect x="20" y="20" width="360" height="360" fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="4,4" />

              {/* Grid Lines & Cells */}
              {gridData.matrix.map((row, r) => {
                const cellSize = 360 / gridData.size;
                return row.map((val, c) => {
                  const x = 20 + c * cellSize;
                  const y = 20 + r * cellSize;
                  const isPivot = gridData.pivotMask[r][c] && lockPivots;

                  return (
                    <g key={`${r}-${c}`}>
                      {/* Cell Box */}
                      <rect
                        x={x}
                        y={y}
                        width={cellSize}
                        height={cellSize}
                        fill={isPivot ? 'rgba(245, 158, 11, 0.15)' : 'rgba(15, 23, 42, 0.6)'}
                        stroke={isPivot ? '#f59e0b' : '#334155'}
                        strokeWidth={isPivot ? '2' : '1'}
                      />

                      {/* Lock Anchor Icon for Pivots */}
                      {isPivot && (
                        <circle cx={x + cellSize - 14} cy={y + 14} r="6" fill="#f59e0b" />
                      )}

                      {/* Cell Value */}
                      <text
                        x={x + cellSize / 2}
                        y={y + cellSize / 2 + 6}
                        textAnchor="middle"
                        fill={isPivot ? '#fef3c7' : '#94a3b8'}
                        fontSize={gridData.size === 3 ? '22' : '18'}
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {val}
                      </text>
                    </g>
                  );
                });
              })}
            </svg>

            {/* Legend & Verification Footer */}
            <div className="w-full text-center pt-2 border-t border-slate-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block">
                {t.khatamThabat.gridTitle} • Poids Cible: {gridData.targetSum}
              </span>
              <p className="text-[10px] text-slate-400">
                {t.khatamThabat.pivotLegend} — Tous les axes verticaux & horizontaux verrouillés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
