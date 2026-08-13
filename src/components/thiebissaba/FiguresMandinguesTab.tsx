import React, { useState } from 'react';
import { Crown, BookOpen, Sword, Music, Baby, HeartHandshake, Sun, Shield, Feather, Sparkles } from 'lucide-react';
import { ThiebissabaTranslation } from './thiebissabaTranslations';
import { MANDINGUE_FIGURES, MandingueFigure } from '../../utils/thiebissaba';

interface FiguresMandinguesTabProps {
  t: ThiebissabaTranslation;
  langKey: 'fr' | 'en' | 'ha';
}

export default function FiguresMandinguesTab({ t, langKey }: FiguresMandinguesTabProps) {
  const [selectedId, setSelectedId] = useState<string>('manssa');

  const selectedFigure = MANDINGUE_FIGURES.find((f) => f.id === selectedId) || MANDINGUE_FIGURES[0];

  const getFigName = (fig: MandingueFigure) => {
    if (langKey === 'en') return fig.nameEn;
    if (langKey === 'ha') return fig.nameHa;
    return fig.nameFr;
  };

  const getFigTitle = (fig: MandingueFigure) => {
    if (langKey === 'en') return fig.titleEn;
    if (langKey === 'ha') return fig.titleHa;
    return fig.titleFr;
  };

  const getFigVirtue = (fig: MandingueFigure) => {
    if (langKey === 'en') return fig.virtueEn;
    if (langKey === 'ha') return fig.virtueHa;
    return fig.virtueFr;
  };

  const getSarakaTarget = (fig: MandingueFigure) => {
    if (langKey === 'en') return fig.sarakaTargetEn;
    if (langKey === 'ha') return fig.sarakaTargetHa;
    return fig.sarakaTargetFr;
  };

  const getSarakaNature = (fig: MandingueFigure) => {
    if (langKey === 'en') return fig.sarakaNatureEn;
    if (langKey === 'ha') return fig.sarakaNatureHa;
    return fig.sarakaNatureFr;
  };

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-amber-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0 mt-1">
            <Crown className="text-amber-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
              {t.figures.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.figures.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Figures Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MANDINGUE_FIGURES.map((fig) => {
          const isSelected = fig.id === selectedId;
          return (
            <button
              key={fig.id}
              type="button"
              onClick={() => setSelectedId(fig.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-105 ring-2 ring-amber-400/50'
                  : 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-gray-200 dark:border-slate-800 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{fig.symbol}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                  {fig.code}
                </span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold truncate">{getFigName(fig)}</h4>
                <p className="text-[10px] opacity-80 truncate">{fig.element}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Figure Detailed Inspection Card */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-3 bg-amber-500/20 rounded-2xl border border-amber-500/40">{selectedFigure.symbol}</span>
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                Archétype: {selectedFigure.code}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-amber-200">
                {getFigName(selectedFigure)}
              </h3>
              <p className="text-xs text-slate-300">{getFigTitle(selectedFigure)}</p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
            Élément: {selectedFigure.element}
          </div>
        </div>

        {/* Detailed Attributes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block flex items-center gap-2">
                <Sparkles size={16} />
                <span>{t.figures.virtueTitle}</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {getFigVirtue(selectedFigure)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block flex items-center gap-2">
                <Feather size={16} />
                <span>Symbolique Botanique & Animalière</span>
              </span>
              <div className="text-xs space-y-1 text-slate-300">
                <p><strong className="text-amber-200">{t.figures.sacredTree}:</strong> {selectedFigure.sacredTree}</p>
                <p><strong className="text-amber-200">{t.figures.totemAnimal}:</strong> {selectedFigure.totemAnimal}</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
              Charité & Saraka Associé
            </span>
            <div className="text-xs space-y-2 text-slate-200">
              <p>
                <strong className="text-amber-300">Nature de l'Aumône:</strong> {getSarakaNature(selectedFigure)}
              </p>
              <p>
                <strong className="text-amber-300">Couleur & Quantité:</strong> {selectedFigure.sarakaColor} • {selectedFigure.sarakaQuantity}
              </p>
              <p>
                <strong className="text-amber-300">Destinataire:</strong> {getSarakaTarget(selectedFigure)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
