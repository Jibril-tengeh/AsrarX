import React, { useState } from 'react';
import { Sparkles, BookOpen, Heart, Copy, Check, Filter, Search, ArrowRight } from 'lucide-react';
import { findDivineCorrespondences, DivineMatchResult } from '../../utils/abjadMasterEngine';

interface AbjadDivineMatchesTabProps {
  abjadValue: number;
  system: 'mashriqi' | 'maghribi';
}

export const AbjadDivineMatchesTab: React.FC<AbjadDivineMatchesTabProps> = ({ abjadValue, system }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSubFilter, setActiveSubFilter] = useState<'all' | 'exact' | 'resonant'>('all');

  const matches: DivineMatchResult = findDivineCorrespondences(abjadValue, system);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasExact = matches.exactNames.length > 0 || matches.exactVerses.length > 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900/15 via-teal-900/15 to-indigo-900/15 dark:from-emerald-950/40 dark:to-indigo-950/40 border border-emerald-200 dark:border-emerald-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-base">
              <BookOpen size={20} />
              <span>Correspondances Divines & Versets Coraniques</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
              Recherche automatique des Noms d'Allah et Versets sacrés résonnant avec le poids numérique <span className="font-extrabold text-emerald-600 dark:text-emerald-400">({abjadValue})</span>.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveSubFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeSubFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              Tous
            </button>
            <button
              type="button"
              onClick={() => setActiveSubFilter('exact')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeSubFilter === 'exact'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              Exacts ({matches.exactNames.length + matches.exactVerses.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubFilter('resonant')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeSubFilter === 'resonant'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              Harmoniques
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Asma Allah al-Husna (Noms Divins) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
              Les Noms Sublimes d'Allah (Asmā' al-Husnā)
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Valeur cible : {abjadValue}
          </span>
        </div>

        {/* Exact Matches */}
        {(activeSubFilter === 'all' || activeSubFilter === 'exact') && matches.exactNames.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {matches.exactNames.map((item, idx) => (
              <div
                key={`exact-asma-${idx}`}
                className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/20 border-2 border-emerald-500/60 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                      Correspondance Exacte
                    </span>
                    <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                      Adad: {item.abjad}
                    </span>
                  </div>

                  <div className="my-2 text-center">
                    <div className="font-arabic font-black text-2xl text-gray-900 dark:text-white">
                      {item.ar}
                    </div>
                    <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      {item.tr}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic">
                      {item.fr}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-medium">
                    Zikr conseillé : {item.abjad}x
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${item.ar} (${item.tr}) - Adad: ${item.abjad}`, `exact-asma-${idx}`)}
                    className="p-1.5 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 cursor-pointer"
                    title="Copier"
                  >
                    {copiedId === `exact-asma-${idx}` ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resonant Matches */}
        {(activeSubFilter === 'all' || activeSubFilter === 'resonant') && matches.resonantNames.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {matches.resonantNames.map((resItem, idx) => {
              const item = resItem.name;
              return (
                <div
                  key={`res-asma-${idx}`}
                  className="p-4 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                        {resItem.ratioLabel}
                      </span>
                      <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                        Adad: {item.abjad}
                      </span>
                    </div>

                    <div className="my-2 text-center">
                      <div className="font-arabic font-black text-xl text-gray-900 dark:text-white">
                        {item.ar}
                      </div>
                      <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {item.tr}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 italic">
                        {item.fr}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">
                      Écart : {resItem.diff > 0 ? `±${resItem.diff}` : 'Harmonique'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${item.ar} (${item.tr}) - Adad: ${item.abjad}`, `res-asma-${idx}`)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                      {copiedId === `res-asma-${idx}` ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {matches.exactNames.length === 0 && matches.resonantNames.length === 0 && (
          <div className="p-6 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">
              Aucun Nom Divin direct pour ce nombre exact. Utilisez les versets coraniques ci-dessous ou essayez un multiple harmonique.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 2: Sacred Verses & Formulas (Versets & Formules Coraniques) */}
      <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
              Versets & Invocations Coraniques Clés
            </h3>
          </div>
        </div>

        {/* Exact Verses */}
        {(activeSubFilter === 'all' || activeSubFilter === 'exact') && matches.exactVerses.length > 0 && (
          <div className="space-y-3">
            {matches.exactVerses.map((verse) => (
              <div
                key={verse.id}
                className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-indigo-50/30 dark:from-emerald-950/40 dark:to-indigo-950/20 border-2 border-emerald-500/60 shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
                    Verset Correspondant Exact ({abjadValue})
                  </span>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    {verse.source}
                  </span>
                </div>

                <div className="my-3 text-right">
                  <div className="font-arabic font-black text-2xl text-gray-900 dark:text-white leading-loose">
                    {verse.arabic}
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
                    {verse.transliteration}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                    {verse.meaningFr}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-900/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
                  <span className="font-medium">✨ {verse.benefit}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${verse.arabic}\n${verse.meaningFr}`, `exact-verse-${verse.id}`)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold ml-2 shrink-0"
                  >
                    {copiedId === `exact-verse-${verse.id}` ? <Check size={14} /> : <Copy size={14} />}
                    <span>Copier</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resonant Verses */}
        {(activeSubFilter === 'all' || activeSubFilter === 'resonant') && matches.resonantVerses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {matches.resonantVerses.map((resVerse, idx) => {
              const v = resVerse.verse;
              const verseWeight = system === 'maghribi' ? v.abjadMaghribi : v.abjadMashriqi;
              return (
                <div
                  key={`res-v-${idx}`}
                  className="p-4 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                        {resVerse.ratioLabel}
                      </span>
                      <span className="text-xs font-extrabold text-gray-500 dark:text-gray-400">
                        Poids: {verseWeight}
                      </span>
                    </div>

                    <div className="text-right my-2">
                      <div className="font-arabic font-bold text-lg text-gray-900 dark:text-white leading-relaxed">
                        {v.arabic}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {v.meaningFr}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[200px]">
                      {v.source}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(v.arabic, `res-v-${idx}`)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {copiedId === `res-v-${idx}` ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
