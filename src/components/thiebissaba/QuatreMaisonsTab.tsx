import React, { useState } from 'react';
import { Home, Layers, Sparkles, RefreshCw, Copy, Check, Feather } from 'lucide-react';
import { ParchmentExporterModal } from '../ParchmentExporterModal';
import { ThiebissabaTranslation } from './thiebissabaTranslations';
import { MANDINGUE_FIGURES, MandingueFigure, calculateKadyo } from '../../utils/thiebissaba';

interface QuatreMaisonsTabProps {
  t: ThiebissabaTranslation;
  langKey: 'fr' | 'en' | 'ha';
}

export default function QuatreMaisonsTab({ t, langKey }: QuatreMaisonsTabProps) {
  const [so1Index, setSo1Index] = useState<number>(0); // Manssa
  const [so2Index, setSo2Index] = useState<number>(1); // Mori
  const [so3Index, setSo3Index] = useState<number>(2); // Fama
  const [copied, setCopied] = useState(false);
  const [isParchmentOpen, setIsParchmentOpen] = useState(false);

  const f1 = MANDINGUE_FIGURES[so1Index];
  const f2 = MANDINGUE_FIGURES[so2Index];
  const f3 = MANDINGUE_FIGURES[so3Index];

  // House 4 (Sô 4 / Kadyo) calculated from Sô 1, 2, 3
  const kadyoResult = calculateKadyo(f1, f2, f3, 12);
  const f4 = kadyoResult.verdictFigure;

  const handleRandomize = () => {
    setSo1Index(Math.floor(Math.random() * MANDINGUE_FIGURES.length));
    setSo2Index(Math.floor(Math.random() * MANDINGUE_FIGURES.length));
    setSo3Index(Math.floor(Math.random() * MANDINGUE_FIGURES.length));
  };

  const getFigName = (fig: MandingueFigure) => {
    if (langKey === 'en') return fig.nameEn;
    if (langKey === 'ha') return fig.nameHa;
    return fig.nameFr;
  };

  const handleCopy = () => {
    const report = `Thème Thiebissaba des 4 Maisons (Sô):\nSô 1 (Consultant - N'Goro): ${getFigName(f1)}\nSô 2 (Biens - Nafolo): ${getFigName(f2)}\nSô 3 (Épreuves - Gueleya): ${getFigName(f3)}\nSô 4 (Issue - Kadyo): ${getFigName(f4)}\n\nSentence: ${langKey === 'en' ? kadyoResult.sentenceEn : langKey === 'ha' ? kadyoResult.sentenceHa : kadyoResult.sentenceFr}`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-amber-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0 mt-1">
            <Home className="text-amber-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
              {t.maisons.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.maisons.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Selectors & Randomizer */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">
            {t.maisons.generateTheme}
          </span>
          <button
            type="button"
            onClick={handleRandomize}
            className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw size={14} />
            <span>Tirage Aléatoire des Maisons</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* House 1 Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">
              {t.maisons.house1Title}
            </label>
            <select
              value={so1Index}
              onChange={(e) => setSo1Index(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
            >
              {MANDINGUE_FIGURES.map((fig, idx) => (
                <option key={fig.id} value={idx}>
                  {getFigName(fig)} ({fig.code})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">{t.maisons.house1Role}</p>
          </div>

          {/* House 2 Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">
              {t.maisons.house2Title}
            </label>
            <select
              value={so2Index}
              onChange={(e) => setSo2Index(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
            >
              {MANDINGUE_FIGURES.map((fig, idx) => (
                <option key={fig.id} value={idx}>
                  {getFigName(fig)} ({fig.code})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">{t.maisons.house2Role}</p>
          </div>

          {/* House 3 Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">
              {t.maisons.house3Title}
            </label>
            <select
              value={so3Index}
              onChange={(e) => setSo3Index(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
            >
              {MANDINGUE_FIGURES.map((fig, idx) => (
                <option key={fig.id} value={idx}>
                  {getFigName(fig)} ({fig.code})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">{t.maisons.house3Role}</p>
          </div>
        </div>
      </div>

      {/* Grid Display of 4 Houses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* House 1 Card */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white border border-amber-500/30 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Sô 1</span>
            <span className="text-2xl">{f1.symbol}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">{t.maisons.house1Title}</span>
            <h4 className="text-base font-black text-amber-300">{getFigName(f1)}</h4>
          </div>
          <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800/80">
            <p><strong>Élément:</strong> {f1.element}</p>
            <p><strong>Arbre:</strong> {f1.sacredTree}</p>
          </div>
        </div>

        {/* House 2 Card */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white border border-amber-500/30 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Sô 2</span>
            <span className="text-2xl">{f2.symbol}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">{t.maisons.house2Title}</span>
            <h4 className="text-base font-black text-amber-300">{getFigName(f2)}</h4>
          </div>
          <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800/80">
            <p><strong>Élément:</strong> {f2.element}</p>
            <p><strong>Arbre:</strong> {f2.sacredTree}</p>
          </div>
        </div>

        {/* House 3 Card */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white border border-amber-500/30 shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Sô 3</span>
            <span className="text-2xl">{f3.symbol}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block">{t.maisons.house3Title}</span>
            <h4 className="text-base font-black text-amber-300">{getFigName(f3)}</h4>
          </div>
          <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800/80">
            <p><strong>Élément:</strong> {f3.element}</p>
            <p><strong>Arbre:</strong> {f3.sacredTree}</p>
          </div>
        </div>

        {/* House 4 Card (Outcome) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950 via-slate-900 to-indigo-950 text-white border border-amber-400/60 shadow-2xl space-y-3 relative overflow-hidden ring-2 ring-amber-500/40">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Sô 4 (Verdict)</span>
            <span className="text-2xl">{f4.symbol}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-amber-200 block">{t.maisons.house4Title}</span>
            <h4 className="text-base font-black text-amber-300">{getFigName(f4)}</h4>
          </div>
          <div className="text-[11px] text-slate-200 space-y-1 pt-1 border-t border-amber-500/30">
            <p><strong>Élément:</strong> {f4.element}</p>
            <p><strong>Verdict:</strong> Kadyo Synthétique</p>
          </div>
        </div>
      </div>

      {/* Synthesis Report Card */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-amber-500/30 shadow-2xl text-white space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
            <Sparkles size={16} />
            <span>{t.maisons.themeSummary}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsParchmentOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Feather size={14} />
              <span>Parchemin Sacré</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? t.copied : t.copyReport}</span>
            </button>
          </div>
        </div>

        <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-300">
          <p>
            <strong className="text-amber-300">Diagnostic Global :</strong> La relation entre {getFigName(f1)} (Sô 1) et {getFigName(f2)} (Sô 2) indique un désir sincère d'expansion. L'épreuve soulevée par {getFigName(f3)} (Sô 3) se dissipe grâce à l'intervention victorieuse de la Maison 4 ({getFigName(f4)}).
          </p>
          <p className="p-4 rounded-xl bg-slate-900 border border-amber-500/20 text-amber-200 text-xs italic">
            « {langKey === 'en' ? kadyoResult.sentenceEn : langKey === 'ha' ? kadyoResult.sentenceHa : kadyoResult.sentenceFr} »
          </p>
        </div>
      </div>

      {/* Parchment Exporter Modal for Quatre Maisons Khatim */}
      <ParchmentExporterModal
        isOpen={isParchmentOpen}
        onClose={() => setIsParchmentOpen(false)}
        title={`Khatim Thiebissaba — 4 Maisons`}
        subtitle={`Verdict Sô 4: ${getFigName(f4)}`}
        content={
          <div className="space-y-6 text-amber-950 font-serif">
            {/* 4 Houses Matrix Display */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-amber-100/80 border-2 border-amber-700/40 shadow-inner">
              <div className="p-3 bg-amber-200/50 rounded-xl border border-amber-700/30 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-900 block">Sô 1 (Consultant)</span>
                <span className="text-3xl font-black text-amber-950 block my-1">{f1.symbol}</span>
                <span className="text-xs font-bold">{getFigName(f1)} ({f1.code})</span>
              </div>

              <div className="p-3 bg-amber-200/50 rounded-xl border border-amber-700/30 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-900 block">Sô 2 (Biens)</span>
                <span className="text-3xl font-black text-amber-950 block my-1">{f2.symbol}</span>
                <span className="text-xs font-bold">{getFigName(f2)} ({f2.code})</span>
              </div>

              <div className="p-3 bg-amber-200/50 rounded-xl border border-amber-700/30 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-900 block">Sô 3 (Épreuves)</span>
                <span className="text-3xl font-black text-amber-950 block my-1">{f3.symbol}</span>
                <span className="text-xs font-bold">{getFigName(f3)} ({f3.code})</span>
              </div>

              <div className="p-3 bg-amber-300/80 rounded-xl border-2 border-amber-700/60 text-center shadow">
                <span className="text-[10px] uppercase font-bold text-amber-950 block">Sô 4 (Verdict)</span>
                <span className="text-3xl font-black text-amber-950 block my-1">{f4.symbol}</span>
                <span className="text-xs font-bold">{getFigName(f4)} ({f4.code})</span>
              </div>
            </div>

            {/* Kadyo Verdict Synthesis */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-700/30 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Synthèse Rituelle & Verdict
              </h4>
              <p className="text-xs text-amber-950 italic leading-relaxed">
                « {langKey === 'en' ? kadyoResult.sentenceEn : langKey === 'ha' ? kadyoResult.sentenceHa : kadyoResult.sentenceFr} »
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
}
