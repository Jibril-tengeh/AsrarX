import React, { useState, useMemo } from 'react';
import { Compass, Crosshair, Download, Copy, Check, Navigation, Target } from 'lucide-react';
import { AnchoringTranslation } from './anchoringTranslations';
import { calculateAbjadValue } from '../../utils/abjad';

interface KhatimIrtikazTabProps {
  t: AnchoringTranslation;
}

export default function KhatimIrtikazTab({ t }: KhatimIrtikazTabProps) {
  const [inputText, setInputText] = useState('يا حفيظ يا سلام');
  const [canvasWidth, setCanvasWidth] = useState<number>(400);
  const [canvasHeight, setCanvasHeight] = useState<number>(400);
  const [quadrant, setQuadrant] = useState<'center' | 'northEast' | 'southEast' | 'southWest' | 'northWest'>('center');
  const [copied, setCopied] = useState<boolean>(false);

  // Vector Anchor Calculations
  const vectorData = useMemo(() => {
    const raw = inputText.trim() || 'يا حفيظ';
    const abjad = calculateAbjadValue(raw);

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // Angle in degrees & radians
    const angleDeg = (abjad * 13.7) % 360;
    const angleRad = (angleDeg * Math.PI) / 180;

    // Impulse Radius
    const radius = 40 + (abjad % 110);

    // Quadrant Offset
    let qOffsetX = 0;
    let qOffsetY = 0;
    if (quadrant === 'northEast') { qOffsetX = 50; qOffsetY = -50; }
    else if (quadrant === 'southEast') { qOffsetX = 50; qOffsetY = 50; }
    else if (quadrant === 'southWest') { qOffsetX = -50; qOffsetY = 50; }
    else if (quadrant === 'northWest') { qOffsetX = -50; qOffsetY = -50; }

    const originX = Math.round(centerX + qOffsetX);
    const originY = Math.round(centerY + qOffsetY);

    // Vector Starting Coordinates (X0, Y0)
    const startX = Math.round(originX + radius * Math.cos(angleRad));
    const startY = Math.round(originY + radius * Math.sin(angleRad));

    const pulseFreq = 7 + (abjad % 21);

    return {
      abjad,
      centerX,
      centerY,
      originX,
      originY,
      angleDeg: Math.round(angleDeg),
      radius: Math.round(radius),
      startX,
      startY,
      pulseFreq
    };
  }, [inputText, canvasWidth, canvasHeight, quadrant]);

  const handleCopy = () => {
    const str = `Vector Anchor Coordinates: X = ${vectorData.startX}px, Y = ${vectorData.startY}px, Angle = ${vectorData.angleDeg}°, Radius = ${vectorData.radius}px, Freq = ${vectorData.pulseFreq}Hz`;
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    const svgEl = document.getElementById('khatim-irtikaz-svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Khatim_Irtikaz_Vector_${Date.now()}.svg`;
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
            <Crosshair className="text-amber-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
              {t.khatimIrtikaz.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.khatimIrtikaz.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Inputs & Vector Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                {t.khatimIrtikaz.inputLabel}
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ex: يا حفيظ يا سلام"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            {/* Quadrant Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                {t.khatimIrtikaz.originQuadrant}
              </label>
              <select
                value={quadrant}
                onChange={(e) => setQuadrant(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="center">Centre / Qalb (0, 0)</option>
                <option value="northEast">Nord-Est (Mashriq-Shamāl)</option>
                <option value="southEast">Sud-Est (Mashriq-Janūb)</option>
                <option value="southWest">Sud-Ouest (Maghrib-Janūb)</option>
                <option value="northWest">Nord-Ouest (Maghrib-Shamāl)</option>
              </select>
            </div>

            {/* Canvas Dimensions Sliders */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                  <span>{t.khatimIrtikaz.canvasWidth}</span>
                  <span className="font-bold">{canvasWidth}px</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="600"
                  step="20"
                  value={canvasWidth}
                  onChange={(e) => setCanvasWidth(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                  <span>{t.khatimIrtikaz.canvasHeight}</span>
                  <span className="font-bold">{canvasHeight}px</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="600"
                  step="20"
                  value={canvasHeight}
                  onChange={(e) => setCanvasHeight(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg"
                />
              </div>
            </div>

            {/* Readout Badges */}
            <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{t.khatimIrtikaz.startCoords}:</span>
                <span className="font-bold font-mono text-amber-400">({vectorData.startX}, {vectorData.startY})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t.khatimIrtikaz.startAngle}:</span>
                <span className="font-bold font-mono text-emerald-300">{vectorData.angleDeg}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t.khatimIrtikaz.initialRadius}:</span>
                <span className="font-bold font-mono text-indigo-300">{vectorData.radius}px</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadSVG}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Download size={16} />
                <span>{t.khatimIrtikaz.downloadCanvas}</span>
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                <span>{copied ? t.khatimIrtikaz.copied : t.khatimIrtikaz.copyCoords}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vector Canvas Visualizer */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="w-full max-w-[480px] p-6 rounded-3xl bg-slate-950 border border-amber-500/30 shadow-2xl flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
            
            <svg
              id="khatim-irtikaz-svg"
              viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
              className="w-full h-auto max-w-[380px] select-none drop-shadow-2xl"
            >
              {/* Background Grid */}
              <rect x="0" y="0" width={canvasWidth} height={canvasHeight} fill="#020617" rx="16" stroke="#334155" strokeWidth="1" />
              
              {/* Center Crosshairs */}
              <line x1="0" y1={vectorData.originY} x2={canvasWidth} y2={vectorData.originY} stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
              <line x1={vectorData.originX} y1="0" x2={vectorData.originX} y2={canvasHeight} stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />

              {/* Radius Circle */}
              <circle cx={vectorData.originX} cy={vectorData.originY} r={vectorData.radius} fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.3" strokeDasharray="3,3" />

              {/* Vector Trajectory Line */}
              <line
                x1={vectorData.originX}
                y1={vectorData.originY}
                x2={vectorData.startX}
                y2={vectorData.startY}
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="2,2"
              />

              {/* Origin Point */}
              <circle cx={vectorData.originX} cy={vectorData.originY} r="4" fill="#38bdf8" />

              {/* Vector Anchor Target Point */}
              <circle cx={vectorData.startX} cy={vectorData.startY} r="12" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" />
              <circle cx={vectorData.startX} cy={vectorData.startY} r="5" fill="#fef3c7" />

              {/* Coordinate Text Overlay */}
              <text
                x={vectorData.startX}
                y={vectorData.startY - 18}
                textAnchor="middle"
                fill="#f59e0b"
                fontSize="12"
                fontWeight="bold"
                fontFamily="monospace"
              >
                Ancre ({vectorData.startX}, {vectorData.startY})
              </text>
            </svg>

            <div className="w-full text-center pt-2 border-t border-slate-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block">
                Ancre Vectorielle • Coordonnées de départ du tracé
              </span>
              <p className="text-[10px] text-slate-400">
                Point d'impulsion initiale calculé à ({vectorData.startX}px, {vectorData.startY}px) avec un angle de {vectorData.angleDeg}°.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
