import React, { useState } from 'react';
import { HeartHandshake, Sparkles, Gift, Users, Clock, Copy, Check } from 'lucide-react';
import { ThiebissabaTranslation } from './thiebissabaTranslations';
import { MANDINGUE_FIGURES, MandingueFigure } from '../../utils/thiebissaba';

interface AnalyseurSarakaTabProps {
  t: ThiebissabaTranslation;
  langKey: 'fr' | 'en' | 'ha';
}

export default function AnalyseurSarakaTab({ t, langKey }: AnalyseurSarakaTabProps) {
  const [selectedId, setSelectedId] = useState<string>('manssa');
  const [copied, setCopied] = useState(false);

  const selectedFigure = MANDINGUE_FIGURES.find((f) => f.id === selectedId) || MANDINGUE_FIGURES[0];

  const getFigName = (fig: MandingueFigure) => {
    if (langKey === 'en') return fig.nameEn;
    if (langKey === 'ha') return fig.nameHa;
    return fig.nameFr;
  };

  const getSarakaNature = (fig: MandingueFigure) => {
    if (langKey === 'en') return fig.sarakaNatureEn;
    if (langKey === 'ha') return fig.sarakaNatureHa;
    return fig.sarakaNatureFr;
  };

  const getSarakaTarget = (fig: MandingueFigure) => {
    if (langKey === 'en') return fig.sarakaTargetEn;
    if (langKey === 'ha') return fig.sarakaTargetHa;
    return fig.sarakaTargetFr;
  };

  const handleCopy = () => {
    const report = `Analyse de Saraka (Charité Thiebissaba):\nFigure: ${getFigName(selectedFigure)}\nNature de l'Aumône: ${getSarakaNature(selectedFigure)}\nCouleur: ${selectedFigure.sarakaColor}\nQuantité: ${selectedFigure.sarakaQuantity}\nDestinataire: ${getSarakaTarget(selectedFigure)}`;
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
            <HeartHandshake className="text-amber-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
              {t.saraka.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.saraka.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Select Figure */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">
          Sélectionnez la Figure Active pour Prescrire le Saraka
        </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500"
        >
          {MANDINGUE_FIGURES.map((fig) => (
            <option key={fig.id} value={fig.id}>
              {getFigName(fig)} ({fig.code}) — {fig.symbol}
            </option>
          ))}
        </select>
      </div>

      {/* Prescription Display */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-3 bg-amber-500/20 rounded-2xl border border-amber-500/40">{selectedFigure.symbol}</span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Prescription Sacrée de Saraka
              </span>
              <h3 className="text-2xl font-black text-amber-200">
                {getFigName(selectedFigure)}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? t.copied : t.copyReport}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block flex items-center gap-2">
              <Gift size={16} />
              <span>{t.saraka.sacrificeNature}</span>
            </span>
            <p className="text-sm font-bold text-amber-200">
              {getSarakaNature(selectedFigure)}
            </p>
            <div className="text-xs space-y-1 text-slate-300 pt-2 border-t border-slate-800">
              <p><strong>{t.saraka.colorRequired}:</strong> {selectedFigure.sarakaColor}</p>
              <p><strong>{t.saraka.recommendedQuantity}:</strong> {selectedFigure.sarakaQuantity}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block flex items-center gap-2">
              <Users size={16} />
              <span>{t.saraka.recipient}</span>
            </span>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {getSarakaTarget(selectedFigure)}
            </p>
            <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 flex items-center gap-2">
              <Clock size={14} className="text-amber-400" />
              <span>Moment propice: Au lever du jour (Sogoma) avec l'intention formulée à voix basse.</span>
            </div>
          </div>
        </div>

        {/* Blessing Formula */}
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
            {t.saraka.blessingFormula} (Bénédiction Douga)
          </span>
          <p className="text-xs sm:text-sm text-amber-100 italic leading-relaxed">
            « Que la terre reçoive cet acte avec gratitude, que le malheur soit écarté à jamais et que la lumière de la sérénité éclaire notre demeure. »
          </p>
        </div>
      </div>
    </div>
  );
}
