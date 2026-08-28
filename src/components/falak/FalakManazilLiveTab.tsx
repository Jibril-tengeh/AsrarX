import React, { useState, useMemo } from 'react';
import {
  Moon,
  Sparkles,
  Search,
  Filter,
  Flame,
  Wind,
  Droplets,
  Mountain,
  CheckCircle2,
  AlertTriangle,
  Flame as FireIcon,
  Shield,
  Heart,
  Coins,
  BookOpen,
  Info,
  ChevronRight,
  X,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ActiveLunarMansionInfo,
  getAll28MansionsList
} from '../../utils/falakEngine';

interface FalakManazilLiveTabProps {
  activeMansion: ActiveLunarMansionInfo;
  nowTime: Date;
}

export const FalakManazilLiveTab: React.FC<FalakManazilLiveTabProps> = ({
  activeMansion,
  nowTime
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<string>('all');
  const [selectedNature, setSelectedNature] = useState<string>('all');
  const [inspectedMansion, setInspectedMansion] = useState<ActiveLunarMansionInfo | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const allMansions = useMemo(() => getAll28MansionsList(), []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredMansions = useMemo(() => {
    return allMansions.filter((m) => {
      const matchSearch =
        m.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.nameAr.includes(searchQuery) ||
        m.angelFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.incenseFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.descFr.toLowerCase().includes(searchQuery.toLowerCase());

      const matchElement = selectedElement === 'all' || m.element === selectedElement;
      const matchNature = selectedNature === 'all' || m.nature.includes(selectedNature);

      return matchSearch && matchElement && matchNature;
    });
  }, [allMansions, searchQuery, selectedElement, selectedNature]);

  const renderElementIcon = (elem: string) => {
    switch (elem) {
      case 'Feu':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'Air':
        return <Wind className="w-4 h-4 text-cyan-500" />;
      case 'Eau':
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'Terre':
        return <Mountain className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const getNatureBadge = (nature: string) => {
    if (nature === 'Très Bénéfique') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-[11px] font-black flex items-center gap-1">
          ✨ Très Bénéfique (Félicité)
        </span>
      );
    }
    if (nature === 'Bénéfique') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/70 border border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-300 text-[11px] font-black flex items-center gap-1">
          🟢 Bénéfique (Faste)
        </span>
      );
    }
    if (nature === 'Mixte') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300 text-[11px] font-black flex items-center gap-1">
          🔵 Neutre / Mixte
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 text-[11px] font-black flex items-center gap-1">
        🔴 Maléfique (Rigueur)
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Active Mansion Live Spotlight Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950 text-white p-6 sm:p-7 border border-indigo-500/40 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-300">
                Demeure Lunaire Active en Temps Réel (Manzil N°{activeMansion.mansionNumber} / 28)
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {activeMansion.nameFr}
              </span>
              <span className="text-3xl sm:text-4xl font-arabic font-bold text-amber-300" dir="rtl">
                {activeMansion.nameAr}
              </span>
              {getNatureBadge(activeMansion.nature)}
            </div>

            <p className="text-sm text-zinc-300 font-medium leading-relaxed max-w-2xl">
              {activeMansion.descFr}
            </p>

            {/* Metaphysical Rulers & Incense */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider block">
                  Ange Gardien (Malak)
                </span>
                <div className="text-sm font-black text-white flex items-center justify-between mt-0.5">
                  <span>{activeMansion.angelFr}</span>
                  <span className="font-arabic text-amber-200 text-base" dir="rtl">
                    {activeMansion.angelAr}
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block">
                  Encens Sacré (Bakhūr)
                </span>
                <div className="text-xs font-black text-white mt-1 leading-snug">
                  {activeMansion.incenseFr}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider block">
                  Noms Divins & Wird (Adad)
                </span>
                <div className="text-xs font-black text-emerald-200 mt-1 truncate">
                  {activeMansion.asmaAr} ({activeMansion.wirdCount}x)
                </div>
              </div>
            </div>

            {/* Propitious & Unpropitious Works */}
            <div className="pt-2 space-y-2">
              {activeMansion.propitious.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-300 mr-1">Actions Fastes :</span>
                  {activeMansion.propitious.map((act, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {act}
                    </span>
                  ))}
                </div>
              )}

              {activeMansion.unpropitious.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-rose-300 mr-1">Déconseillé :</span>
                  {activeMansion.unpropitious.map((act, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-semibold flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3 text-rose-400" /> {act}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Mansion Astrological Gauge */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-center text-center shrink-0 min-w-[230px]">
            <div className="w-20 h-20 rounded-full bg-indigo-500/20 border-2 border-indigo-400/50 flex flex-col items-center justify-center mb-3">
              <Moon className="w-8 h-8 text-indigo-300 mb-0.5" />
              <span className="text-[10px] font-black text-amber-300 uppercase">
                {activeMansion.element}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold">
                Degré Céleste
              </span>
              <div className="text-sm font-mono font-bold text-indigo-200">
                {activeMansion.degreeSpan}
              </div>
              <div className="text-[11px] text-zinc-400 mt-1">
                Aumône : <strong className="text-zinc-200">{activeMansion.sadaqahFr}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Mansion Transit Progress */}
        <div className="mt-5 space-y-1">
          <div className="flex justify-between text-[11px] text-indigo-200 font-mono font-bold">
            <span>Début du Manzil</span>
            <span>Transit Actif : {activeMansion.progressPercentage}%</span>
            <span>Fin du Manzil</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-amber-400 transition-all duration-1000"
              style={{ width: `${Math.max(5, activeMansion.progressPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Explorer: Filters & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Répertoire Exhaustif des 28 Demeures Célestes (Manāzil)
          </h2>

          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, ange, encens..."
              className="pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filtres :
          </span>

          {/* Element Pills */}
          {['all', 'Feu', 'Terre', 'Air', 'Eau'].map((elem) => (
            <button
              key={elem}
              onClick={() => setSelectedElement(elem)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedElement === elem
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
              }`}
            >
              {elem === 'all' ? 'Tous Éléments' : elem}
            </button>
          ))}

          <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />

          {/* Nature Pills */}
          {['all', 'Très Bénéfique', 'Bénéfique', 'Mixte', 'Maléfique'].map((nat) => (
            <button
              key={nat}
              onClick={() => setSelectedNature(nat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedNature === nat
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
              }`}
            >
              {nat === 'all' ? 'Toutes Natures' : nat}
            </button>
          ))}
        </div>

        {/* Grid of 28 Mansions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredMansions.map((m) => {
            const isActive = m.mansionNumber === activeMansion.mansionNumber;

            return (
              <motion.div
                key={m.mansionNumber}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setInspectedMansion(m)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  isActive
                    ? 'ring-2 ring-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 shadow-md'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-indigo-300'
                }`}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider">
                    ACTIVE
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-mono text-xs font-black">
                      {m.mansionNumber}
                    </span>
                    <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      {renderElementIcon(m.element)} {m.element}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-sm text-zinc-900 dark:text-white truncate">{m.nameFr}</h3>
                    <div className="font-arabic font-bold text-sm text-amber-700 dark:text-amber-300" dir="rtl">
                      {m.nameAr}
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-snug">
                    {m.descFr}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-2 space-y-1">
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 flex justify-between">
                    <span>Ange :</span>
                    <strong className="text-zinc-800 dark:text-zinc-200 truncate">{m.angelFr}</strong>
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 flex justify-between">
                    <span>Encens :</span>
                    <strong className="text-amber-600 dark:text-amber-400 truncate">{m.incenseFr}</strong>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal / Drawer for Inspected Mansion */}
      <AnimatePresence>
        {inspectedMansion && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-black">
                      Demeure N°{inspectedMansion.mansionNumber} / 28
                    </span>
                    {getNatureBadge(inspectedMansion.nature)}
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
                    {inspectedMansion.nameFr}
                  </h3>
                  <div className="text-2xl font-arabic font-bold text-amber-600 dark:text-amber-400" dir="rtl">
                    {inspectedMansion.nameAr}
                  </div>
                </div>

                <button
                  onClick={() => setInspectedMansion(null)}
                  className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                {inspectedMansion.descFr}
              </p>

              {/* Mystical Attributes Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-500 dark:text-zinc-400 block font-bold">Ange Gardien</span>
                  <strong className="text-zinc-900 dark:text-white">{inspectedMansion.angelFr}</strong>
                  <div className="font-arabic text-amber-600 dark:text-amber-400">{inspectedMansion.angelAr}</div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-500 dark:text-zinc-400 block font-bold">Encens Sacré (Bakhūr)</span>
                  <strong className="text-amber-700 dark:text-amber-300">{inspectedMansion.incenseFr}</strong>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-500 dark:text-zinc-400 block font-bold">Degrés Astronomiques</span>
                  <strong className="text-zinc-900 dark:text-white">{inspectedMansion.degreeSpan}</strong>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-500 dark:text-zinc-400 block font-bold">Aumône (Sadaqah)</span>
                  <strong className="text-zinc-900 dark:text-white">{inspectedMansion.sadaqahFr}</strong>
                </div>
              </div>

              {/* Recommended Wird Box */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                    Dhikr & Noms Divins Recommandés
                  </span>
                  <button
                    onClick={() => handleCopy(inspectedMansion.wirdAr, 'wird')}
                    className="p-1.5 rounded-lg bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'wird' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copier
                  </button>
                </div>
                <div className="text-lg font-arabic font-bold text-amber-950 dark:text-amber-100 text-center" dir="rtl">
                  {inspectedMansion.wirdAr} ({inspectedMansion.wirdCount}x)
                </div>
              </div>

              {/* Propitious Works */}
              {inspectedMansion.propitious.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    Œuvres Spirituelles Fastes :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectedMansion.propitious.map((p, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
