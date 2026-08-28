import React, { useState } from 'react';
import { Heart, Users, Scale, Sparkles, Flame, Droplets, Wind, Mountain, Check, Copy, RefreshCw } from 'lucide-react';
import { calculateComprehensiveTawafuq, TawafuqResult } from '../../utils/abjadMasterEngine';

interface AbjadTawafuqTabProps {
  system: 'mashriqi' | 'maghribi';
}

export const AbjadTawafuqTab: React.FC<AbjadTawafuqTabProps> = ({ system }) => {
  const [name1, setName1] = useState('');
  const [mother1, setMother1] = useState('');
  const [name2, setName2] = useState('');
  const [mother2, setMother2] = useState('');

  const [copied, setCopied] = useState(false);

  const result: TawafuqResult | null = calculateComprehensiveTawafuq(name1, mother1, name2, mother2, system);

  const handleCopyWird = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickPreset = (n1: string, m1: string, n2: string, m2: string) => {
    setName1(n1);
    setMother1(m1);
    setName2(n2);
    setMother2(m2);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-900/15 via-pink-900/15 to-purple-900/15 dark:from-rose-950/40 dark:to-purple-950/40 border border-rose-200 dark:border-rose-800/40">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-base">
          <Heart size={20} />
          <span>Test d'Affinité & de Compatibilité Mystique (Hisāb al-Tawāfuq)</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
          Analyse onomastique sacrée basée sur la règle du Modulo 9 de l'Imam Ahmad Al-Buni, la conciliation des 4 éléments et l'attribution du wird d'harmonisation.
        </p>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-rose-200/60 dark:border-rose-800/60">
          <span className="text-[11px] font-bold text-gray-500">Exemples historiques :</span>
          <button
            type="button"
            onClick={() => handleQuickPreset('محمد', 'امنة', 'خديجة', 'فاطمة')}
            className="px-2.5 py-1 bg-white dark:bg-gray-800 hover:bg-rose-50 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-semibold border border-rose-200 dark:border-rose-800 shadow-2xs"
          >
            Muhammad & Khadija
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('علي', 'فاطمة', 'فاطمة', 'خديجة')}
            className="px-2.5 py-1 bg-white dark:bg-gray-800 hover:bg-rose-50 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-semibold border border-rose-200 dark:border-rose-800 shadow-2xs"
          >
            Ali & Fatima
          </button>
        </div>
      </div>

      {/* Input Section (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Person 1 */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-sm">
            <Users size={16} />
            <span>Première Personne (Partenaire 1 / Demandeur)</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Prénom (en arabe de préférence) *
            </label>
            <input
              type="text"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="Ex: محمد ou Ahmad"
              dir="auto"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-rose-500 font-arabic text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Nom de la Mère (Optionnel selon la tradition)
            </label>
            <input
              type="text"
              value={mother1}
              onChange={(e) => setMother1(e.target.value)}
              placeholder="Ex: آمنة / Mariam"
              dir="auto"
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-rose-500 font-arabic text-sm"
            />
          </div>
        </div>

        {/* Person 2 */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
            <Users size={16} />
            <span>Deuxième Personne (Partenaire 2 / Conjoint / Associé)</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Prénom (en arabe de préférence) *
            </label>
            <input
              type="text"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="Ex: فاطمة ou Fatima"
              dir="auto"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 font-arabic text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Nom de la Mère (Optionnel selon la tradition)
            </label>
            <input
              type="text"
              value={mother2}
              onChange={(e) => setMother2(e.target.value)}
              placeholder="Ex: خديجة / Aicha"
              dir="auto"
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 font-arabic text-sm"
            />
          </div>
        </div>
      </div>

      {/* Results Display */}
      {result ? (
        <div className="space-y-5">
          {/* Main Verdict & Score Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-gray-900 via-slate-900 to-rose-950 text-white shadow-xl border border-rose-900/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-800/40">
              <div>
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-rose-400" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-rose-300">
                    Verdict de l'Imam Al-Buni (Règle du Modulo 9)
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {result.buniTitleFr}
                </h3>
              </div>

              {/* Score Gauge */}
              <div className="flex items-center gap-3 bg-rose-500/20 px-4 py-2 rounded-2xl border border-rose-400/30 self-start sm:self-auto">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-rose-200 block">Indice de Concordance</span>
                  <span className="text-2xl sm:text-3xl font-black text-rose-300">{result.scorePercentage}%</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-rose-600/40 flex items-center justify-center font-bold text-sm">
                  {result.mod9}/9
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed my-4">
              {result.buniDescFr}
            </p>

            {/* Numerical Math details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-rose-800/40 text-center">
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-[10px] text-gray-400 uppercase block">Abjad P1</span>
                <span className="text-base font-extrabold text-white">{result.p1.abjadVal}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-[10px] text-gray-400 uppercase block">Abjad P2</span>
                <span className="text-base font-extrabold text-white">{result.p2.abjadVal}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-[10px] text-gray-400 uppercase block">Total Combiné</span>
                <span className="text-base font-extrabold text-rose-300">{result.totalCombined}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-[10px] text-gray-400 uppercase block">Reste Modulo 9</span>
                <span className="text-base font-extrabold text-amber-300">{result.mod9}</span>
              </div>
            </div>
          </div>

          {/* Elemental Synergy Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h4 className="font-extrabold text-base text-gray-900 dark:text-white">
                  Synergie des Tempéraments Élémentaires
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                {result.elementalSynergyFr}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {result.elementalDescFr}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <span className="text-xs font-bold text-gray-500 block mb-1">
                  Élément Dominant Partenaire 1 :
                </span>
                <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 uppercase">
                  {result.p1.dominantElement}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <span className="text-xs font-bold text-gray-500 block mb-1">
                  Élément Dominant Partenaire 2 :
                </span>
                <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 uppercase">
                  {result.p2.dominantElement}
                </span>
              </div>
            </div>
          </div>

          {/* Harmonization Wird & Secret Formula */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 dark:from-emerald-950/40 dark:to-indigo-950/30 border border-emerald-200 dark:border-emerald-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                Wird d'Harmonisation & d'Amour Spirituel Conseillé
              </span>
              <div className="font-arabic font-black text-2xl text-gray-900 dark:text-white">
                {result.recommendedWirdAr}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 italic">
                « {result.recommendedWirdFr} » — À réciter <span className="font-bold text-emerald-600 dark:text-emerald-400">{result.recommendedWirdCount} fois</span> ensemble ou par le demandeur.
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopyWird(`${result.recommendedWirdAr}\n${result.recommendedWirdFr}\nRépétition : ${result.recommendedWirdCount}x`)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>Wird Copié !</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copier le Wird</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
          <Heart className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-60" />
          <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300">
            Saisissez les deux prénoms pour calculer l'harmonie
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            Les lettres arabes révèlent la résonance du couple, le modulo sacré d'Al-Buni et le remède d'accordance.
          </p>
        </div>
      )}
    </div>
  );
};
