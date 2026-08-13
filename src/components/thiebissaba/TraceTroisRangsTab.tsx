import React, { useState, useRef } from 'react';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Download,
  Layers,
  Save,
  Circle,
  Eye,
  Feather
} from 'lucide-react';
import { exportElementToCanvas } from '../../utils/exportSerializationHelper';
import { ParchmentExporterModal } from '../ParchmentExporterModal';
import { ThiebissabaTranslation } from './thiebissabaTranslations';
import { getParity, getFigureByBinary } from '../../utils/thiebissaba';
import { saveThiebissabaHistoryEntry } from '../../utils/thiebissabaHistory';

interface TraceTroisRangsTabProps {
  t: ThiebissabaTranslation;
  langKey: 'fr' | 'en' | 'ha';
  initialIntention?: string;
  initialDots?: { r1: number; r2: number; r3: number };
}

export default function TraceTroisRangsTab({
  t,
  langKey,
  initialIntention = '',
  initialDots = { r1: 7, r2: 8, r3: 9 },
}: TraceTroisRangsTabProps) {
  const [intention, setIntention] = useState(initialIntention);
  const [dotsRow1, setDotsRow1] = useState<number>(initialDots.r1);
  const [dotsRow2, setDotsRow2] = useState<number>(initialDots.r2);
  const [dotsRow3, setDotsRow3] = useState<number>(initialDots.r3);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isParchmentOpen, setIsParchmentOpen] = useState(false);

  const exportCardRef = useRef<HTMLDivElement>(null);

  // Sand canvas dot clicks simulation
  const [sandDots, setSandDots] = useState<{ x: number; y: number; row: 1 | 2 | 3 }[]>([]);

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let row: 1 | 2 | 3 = 1;
    if (y > 100 && y <= 200) row = 2;
    if (y > 200) row = 3;

    setSandDots((prev) => [...prev, { x, y, row }]);

    if (row === 1) setDotsRow1((prev) => prev + 1);
    if (row === 2) setDotsRow2((prev) => prev + 1);
    if (row === 3) setDotsRow3((prev) => prev + 1);
    setIsSaved(false);
  };

  const handleClear = () => {
    setSandDots([]);
    setDotsRow1(7);
    setDotsRow2(8);
    setDotsRow3(9);
    setIsSaved(false);
  };

  const handlePulseDraw = () => {
    const r1 = Math.floor(Math.random() * 12) + 5;
    const r2 = Math.floor(Math.random() * 12) + 5;
    const r3 = Math.floor(Math.random() * 12) + 5;

    setDotsRow1(r1);
    setDotsRow2(r2);
    setDotsRow3(r3);

    const newDots = [];
    for (let i = 0; i < r1; i++) {
      newDots.push({ x: 40 + Math.random() * 320, y: 20 + Math.random() * 60, row: 1 as const });
    }
    for (let i = 0; i < r2; i++) {
      newDots.push({ x: 40 + Math.random() * 320, y: 120 + Math.random() * 60, row: 2 as const });
    }
    for (let i = 0; i < r3; i++) {
      newDots.push({ x: 40 + Math.random() * 320, y: 220 + Math.random() * 60, row: 3 as const });
    }
    setSandDots(newDots);
    setIsSaved(false);
  };

  const parity1 = getParity(dotsRow1);
  const parity2 = getParity(dotsRow2);
  const parity3 = getParity(dotsRow3);

  const figure = getFigureByBinary(parity1, parity2, parity3);

  const figureName = langKey === 'en' ? figure.nameEn : langKey === 'ha' ? figure.nameHa : figure.nameFr;
  const figureTitle = langKey === 'en' ? figure.titleEn : langKey === 'ha' ? figure.titleHa : figure.titleFr;
  const figureVirtue = langKey === 'en' ? figure.virtueEn : langKey === 'ha' ? figure.virtueHa : figure.virtueFr;

  const handleCopy = () => {
    const report = `Tracé Thiebissaba (3 Rangs)\nQuestion: ${intention || 'Consultation'}\nRang 1 (Koun): ${dotsRow1} dots -> ${parity1} point(s)\nRang 2 (Dousso): ${dotsRow2} dots -> ${parity2} point(s)\nRang 3 (Sen): ${dotsRow3} dots -> ${parity3} point(s)\nFigure: ${figureName} (${figure.code})\nÉlément: ${figure.element}`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveHistory = () => {
    saveThiebissabaHistoryEntry({
      intention: intention || 'Consultation Thiebissaba',
      dotsRow1,
      dotsRow2,
      dotsRow3,
      parity1,
      parity2,
      parity3,
      figureCode: figure.code,
      figureName,
      figureSymbol: figure.symbol,
      element: figure.element,
    });
    setIsSaved(true);
  };

  const handleExportPNG = async () => {
    if (!exportCardRef.current) return;
    try {
      setIsExporting(true);
      const canvas = await exportElementToCanvas(exportCardRef.current, '#0c0a09');
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Thiebissaba_${figure.code}_${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
    } catch (err) {
      console.error('Error exporting image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Helper to render animated dot grid row
  const renderAnimatedRowDots = (count: number, parity: number, label: string) => {
    const dotsArray = Array.from({ length: Math.min(count, 20) });
    return (
      <div className="p-3 rounded-2xl bg-stone-900/80 border border-amber-500/20 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-300">{label}</span>
          <span className="font-mono text-amber-400 font-bold">
            {count} dots → {parity === 1 ? '1 Point (Tek / Impair)' : '2 Points (Gnan / Pair)'}
          </span>
        </div>

        {/* Animated Dot Line */}
        <div className="flex flex-wrap items-center gap-1.5 py-1">
          {dotsArray.map((_, idx) => (
            <div
              key={idx}
              className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse"
              style={{ animationDelay: `${idx * 40}ms` }}
            />
          ))}
          {count > 20 && <span className="text-[10px] text-amber-300 font-bold">+{count - 20}</span>}
        </div>

        {/* Final Parity Output Representation */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-amber-500/10">
          <span className="text-[10px] uppercase font-bold text-amber-400/70">Parité :</span>
          <div className="flex items-center gap-1.5">
            {parity === 1 ? (
              <div className="w-4 h-4 rounded-full bg-amber-400 ring-2 ring-amber-300 shadow-md animate-ping" />
            ) : (
              <>
                <div className="w-4 h-4 rounded-full bg-amber-400 ring-2 ring-amber-300 shadow-md animate-ping" />
                <div className="w-4 h-4 rounded-full bg-amber-400 ring-2 ring-amber-300 shadow-md animate-ping" />
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-amber-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0 mt-1">
            <Sparkles className="text-amber-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
              {t.trace.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.trace.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                {t.trace.intentionInput}
              </label>
              <input
                type="text"
                value={intention}
                onChange={(e) => {
                  setIntention(e.target.value);
                  setIsSaved(false);
                }}
                placeholder="Ex: Réussite du projet ou santé de la famille..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            {/* Manual Dot Sliders */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                  <span>{t.trace.row1Label}</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">
                    {dotsRow1} {t.trace.dotsCount} ({parity1 === 1 ? t.trace.parityOdd : t.trace.parityEven})
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={dotsRow1}
                  onChange={(e) => {
                    setDotsRow1(parseInt(e.target.value));
                    setIsSaved(false);
                  }}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                  <span>{t.trace.row2Label}</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">
                    {dotsRow2} {t.trace.dotsCount} ({parity2 === 1 ? t.trace.parityOdd : t.trace.parityEven})
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={dotsRow2}
                  onChange={(e) => {
                    setDotsRow2(parseInt(e.target.value));
                    setIsSaved(false);
                  }}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                  <span>{t.trace.row3Label}</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">
                    {dotsRow3} {t.trace.dotsCount} ({parity3 === 1 ? t.trace.parityOdd : t.trace.parityEven})
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={dotsRow3}
                  onChange={(e) => {
                    setDotsRow3(parseInt(e.target.value));
                    setIsSaved(false);
                  }}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={handlePulseDraw}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <RefreshCw size={16} />
                <span>{t.trace.drawRandom}</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
              >
                {t.trace.clearSand}
              </button>
            </div>
          </div>

          {/* Live Visual Parity Matrix */}
          <div className="bg-gradient-to-br from-slate-950 via-stone-950 to-amber-950 p-5 rounded-2xl border border-amber-500/30 text-white space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block flex items-center gap-2">
              <Eye size={16} />
              <span>Matrice Visuelle de Parité Animée</span>
            </span>
            {renderAnimatedRowDots(dotsRow1, parity1, 'Rang 1 (Koun / Tête)')}
            {renderAnimatedRowDots(dotsRow2, parity2, 'Rang 2 (Dousso / Cœur)')}
            {renderAnimatedRowDots(dotsRow3, parity3, 'Rang 3 (Sen / Pied)')}
          </div>
        </div>

        {/* Sand Canvas & Figure Display */}
        <div className="lg:col-span-7 space-y-6">
          {/* Virtual Sand Canvas */}
          <div className="bg-gradient-to-br from-amber-950 via-stone-900 to-slate-950 rounded-3xl p-6 border border-amber-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <Layers size={16} />
                <span>{t.trace.sandCanvasTitle}</span>
              </span>
              <span className="text-[11px] text-slate-400 italic">
                {t.trace.sandCanvasInstruction}
              </span>
            </div>

            <svg
              onClick={handleCanvasClick}
              viewBox="0 0 400 300"
              className="w-full h-56 bg-stone-950/80 rounded-2xl border border-amber-500/20 cursor-crosshair select-none"
            >
              {/* Row dividers */}
              <line x1="0" y1="100" x2="400" y2="100" stroke="#78350f" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="#78350f" strokeWidth="1" strokeDasharray="4,4" />

              {/* Row labels */}
              <text x="15" y="55" fill="#f59e0b" fontSize="11" fontWeight="bold">Rang 1 (Koun)</text>
              <text x="15" y="155" fill="#f59e0b" fontSize="11" fontWeight="bold">Rang 2 (Dousso)</text>
              <text x="15" y="255" fill="#f59e0b" fontSize="11" fontWeight="bold">Rang 3 (Sen)</text>

              {/* Clicked Dots */}
              {sandDots.map((dot, idx) => (
                <circle key={idx} cx={dot.x} cy={dot.y} r="5" fill="#f59e0b" stroke="#fef3c7" strokeWidth="1" />
              ))}
            </svg>

            {/* Exportable Generated Figure Card */}
            <div
              ref={exportCardRef}
              className="p-6 rounded-2xl bg-stone-900/95 border border-amber-500/40 text-white space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                    Thiebissaba Mystique Mandingue
                  </span>
                  <p className="text-xs font-semibold text-slate-300 italic">
                    "{intention || 'Consultation Spontanée'}"
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-mono font-bold">
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Visual Trigram */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-stone-950 border border-amber-500/30 space-y-3">
                  <span className="text-4xl">{figure.symbol}</span>
                  <div className="space-y-2">
                    <div className="flex justify-center gap-2">
                      {parity1 === 1 ? (
                        <span className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-1 ring-amber-300" />
                      ) : (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-1 ring-amber-300" />
                          <span className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-1 ring-amber-300" />
                        </>
                      )}
                    </div>
                    <div className="flex justify-center gap-2">
                      {parity2 === 1 ? (
                        <span className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-1 ring-amber-300" />
                      ) : (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-1 ring-amber-300" />
                          <span className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-1 ring-amber-300" />
                        </>
                      )}
                    </div>
                    <div className="flex justify-center gap-2">
                      {parity3 === 1 ? (
                        <span className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-1 ring-amber-300" />
                      ) : (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-1 ring-amber-300" />
                          <span className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-1 ring-amber-300" />
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">Code: {figure.code}</span>
                </div>

                {/* Details */}
                <div className="sm:col-span-8 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                    {t.trace.resultingFigure}
                  </span>
                  <h3 className="text-xl font-black text-amber-200">{figureName}</h3>
                  <p className="text-xs font-medium text-slate-300">{figureTitle}</p>

                  <div className="pt-2 text-xs space-y-1">
                    <p className="text-slate-300">
                      <strong className="text-amber-400">{t.trace.element}:</strong> {figure.element}
                    </p>
                    <p className="text-slate-300">
                      <strong className="text-amber-400">{t.trace.archetype}:</strong> {figure.sacredTree} • {figure.totemAnimal}
                    </p>
                    <p className="text-slate-300 leading-relaxed pt-1 border-t border-stone-800">
                      {figureVirtue}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Save History, Export Image, Copy */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveHistory}
                className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/20'
                }`}
              >
                {isSaved ? <Check size={16} /> : <Save size={16} />}
                <span>{isSaved ? t.trace.savedInHistory : t.trace.saveToHistory}</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsParchmentOpen(true)}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Feather size={16} />
                  <span>Parchemin Sacré</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportPNG}
                  disabled={isExporting}
                  className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Download size={16} className={isExporting ? 'animate-bounce' : ''} />
                  <span>{t.trace.exportImage}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border border-amber-500/20"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? t.copied : ''}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parchment Exporter Modal for Thiebissaba */}
      <ParchmentExporterModal
        isOpen={isParchmentOpen}
        onClose={() => setIsParchmentOpen(false)}
        title={`Sceau Thiebissaba — ${figureName}`}
        subtitle={`Intention: ${intention || 'Consultation Spontanée'}`}
        content={
          <div className="space-y-6 text-amber-950 font-serif">
            {/* Central Khatim Trigram Display */}
            <div className="text-center p-6 rounded-2xl bg-amber-100/80 border-2 border-amber-700/40 shadow-inner space-y-4">
              <span className="text-5xl font-black text-amber-900 block">{figure.symbol}</span>
              <div className="flex justify-center gap-3 text-amber-800 text-sm font-bold">
                <span>Code: {figure.code}</span>
                <span>•</span>
                <span>Élément: {figure.element}</span>
              </div>

              {/* 3 Rows Dot Breakdown Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amber-700/30 text-xs font-semibold">
                <div className="p-2 rounded bg-amber-200/50">
                  <span className="block text-[10px] uppercase text-amber-800 font-bold">Rang 1 (Koun)</span>
                  <span className="text-sm font-bold">{dotsRow1} dots ({parity1 === 1 ? '1 Pt' : '2 Pts'})</span>
                </div>
                <div className="p-2 rounded bg-amber-200/50">
                  <span className="block text-[10px] uppercase text-amber-800 font-bold">Rang 2 (Dousso)</span>
                  <span className="text-sm font-bold">{dotsRow2} dots ({parity2 === 1 ? '1 Pt' : '2 Pts'})</span>
                </div>
                <div className="p-2 rounded bg-amber-200/50">
                  <span className="block text-[10px] uppercase text-amber-800 font-bold">Rang 3 (Sen)</span>
                  <span className="text-sm font-bold">{dotsRow3} dots ({parity3 === 1 ? '1 Pt' : '2 Pts'})</span>
                </div>
              </div>
            </div>

            {/* Analysis Details Table */}
            <div className="space-y-3 bg-amber-50/60 p-4 rounded-xl border border-amber-700/30">
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-900 border-b border-amber-700/30 pb-1">
                Analyse & Vertus Mystiques
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div><strong className="text-amber-900">Figure :</strong> {figureName}</div>
                <div><strong className="text-amber-900">Signification :</strong> {figureTitle}</div>
                <div><strong className="text-amber-900">Arbre Sacré :</strong> {figure.sacredTree}</div>
                <div><strong className="text-amber-900">Animal Totem :</strong> {figure.totemAnimal}</div>
              </div>
              <p className="text-xs italic leading-relaxed pt-2 border-t border-amber-700/20 text-amber-900">
                « {figureVirtue} »
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
}
