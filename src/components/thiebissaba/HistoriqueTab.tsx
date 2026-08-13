import React, { useState, useEffect, useRef } from 'react';
import { History, Trash2, RotateCcw, Download, Sparkles, Calendar, Layers, ShieldCheck } from 'lucide-react';
import { exportElementToCanvas } from '../../utils/exportSerializationHelper';
import { ThiebissabaTranslation } from './thiebissabaTranslations';
import {
  getThiebissabaHistory,
  deleteThiebissabaHistoryEntry,
  clearThiebissabaHistory,
  ThiebissabaHistoryEntry,
} from '../../utils/thiebissabaHistory';

interface HistoriqueTabProps {
  t: ThiebissabaTranslation;
  langKey: 'fr' | 'en' | 'ha';
  onReloadTheme: (entry: ThiebissabaHistoryEntry) => void;
}

export default function HistoriqueTab({ t, langKey, onReloadTheme }: HistoriqueTabProps) {
  const [history, setHistory] = useState<ThiebissabaHistoryEntry[]>([]);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setHistory(getThiebissabaHistory());
  }, []);

  const handleDelete = (id: string) => {
    const updated = deleteThiebissabaHistoryEntry(id);
    setHistory(updated);
  };

  const handleClearAll = () => {
    if (window.confirm(t.history.clearHistory + '?')) {
      const updated = clearThiebissabaHistory();
      setHistory(updated);
    }
  };

  const handleExportCard = async (entry: ThiebissabaHistoryEntry) => {
    const cardEl = cardRefs.current[entry.id];
    if (!cardEl) return;

    try {
      setExportingId(entry.id);
      const canvas = await exportElementToCanvas(cardEl, '#0c0a09');

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Thiebissaba_Theme_${new Date(entry.timestamp).toISOString().slice(0, 10)}_${entry.figureCode}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to export theme image:', err);
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-stone-950 via-amber-950 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-amber-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0 mt-1">
              <History className="text-amber-400" size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
                {t.history.title}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {t.history.subtitle}
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Trash2 size={16} />
              <span>{t.history.clearHistory}</span>
            </button>
          )}
        </div>
      </div>

      {/* History Cards Grid */}
      {history.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <History size={32} />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {t.history.emptyText}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((entry) => (
            <div
              key={entry.id}
              ref={(el) => {
                cardRefs.current[entry.id] = el;
              }}
              className="p-6 rounded-3xl bg-gradient-to-br from-stone-950 via-slate-950 to-amber-950 text-white border border-amber-500/30 shadow-2xl space-y-5 relative overflow-hidden"
            >
              {/* Card Header & Badge */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                  <Calendar size={14} />
                  <span>{new Date(entry.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300 uppercase">
                  <ShieldCheck size={12} />
                  <span>{entry.figureCode}</span>
                </div>
              </div>

              {/* Intention & Figure Details */}
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400/80 block">
                    {t.history.itemIntention}
                  </span>
                  <p className="text-sm font-semibold text-amber-100 italic">
                    "{entry.intention || 'Consultation Spontanée'}"
                  </p>
                </div>

                <div className="grid grid-cols-12 gap-3 p-4 rounded-2xl bg-stone-900/90 border border-stone-800">
                  {/* Symbol & Code */}
                  <div className="col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-stone-950 border border-amber-500/20 text-center">
                    <span className="text-3xl">{entry.figureSymbol}</span>
                    <span className="text-[10px] font-mono font-bold text-amber-400 mt-1">
                      {entry.figureCode}
                    </span>
                  </div>

                  {/* Figure Name & Breakdown */}
                  <div className="col-span-8 space-y-1.5">
                    <h4 className="text-base font-black text-amber-200">
                      {entry.figureName}
                    </h4>
                    <p className="text-xs text-slate-300">
                      <strong className="text-amber-400">Élément:</strong> {entry.element}
                    </p>
                    <div className="flex gap-3 text-[11px] font-mono text-slate-300 pt-1">
                      <span>R1: {entry.dotsRow1} ({entry.parity1 === 1 ? '1' : '2'})</span>
                      <span>R2: {entry.dotsRow2} ({entry.parity2 === 1 ? '1' : '2'})</span>
                      <span>R3: {entry.dotsRow3} ({entry.parity3 === 1 ? '1' : '2'})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-800">
                <button
                  onClick={() => onReloadTheme(entry)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <RotateCcw size={14} />
                  <span>{t.history.reloadTheme}</span>
                </button>

                <button
                  onClick={() => handleExportCard(entry)}
                  disabled={exportingId === entry.id}
                  className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-amber-500/20"
                >
                  <Download size={14} className={exportingId === entry.id ? 'animate-bounce' : ''} />
                  <span>PNG</span>
                </button>

                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all cursor-pointer border border-rose-500/20"
                  title={t.history.deleteEntry}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
