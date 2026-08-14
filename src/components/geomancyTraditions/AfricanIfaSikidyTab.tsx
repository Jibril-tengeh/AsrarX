import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  RotateCcw, 
  Search, 
  Layers, 
  BookOpen, 
  Droplets, 
  User, 
  Flame, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  IFA_16_MEJI_ODUS, 
  getOduByCodes, 
  IfaOduDetail, 
  HAKATA_TABLETS, 
  evaluateHakataThrow, 
  computeSikidyMalgache, 
  computeOduBirth, 
  Geomantic16Figure,
  CLASSICAL_16_FIGURES
} from '../../data/geomancyTraditionsData';
import { GEOMANCY_TRADITIONS_I18N } from '../../data/geomancyTraditionsTranslations';

interface AfricanIfaSikidyTabProps {
  houses: Geomantic16Figure[];
  lang: 'fr' | 'en' | 'ha';
}

export const AfricanIfaSikidyTab: React.FC<AfricanIfaSikidyTabProps> = ({ houses, lang }) => {
  const t = GEOMANCY_TRADITIONS_I18N[lang] || GEOMANCY_TRADITIONS_I18N.fr;

  const [activeSubTab, setActiveSubTab] = useState<
    'opele' | 'opon' | 'amulu' | 'sikidy' | 'ebo' | 'hakata' | 'sikidyRano' | 'oduBirth'
  >('opele');

  // Opele State
  const [opeleRight, setOpeleRight] = useState<[number, number, number, number]>([1, 1, 1, 1]);
  const [opeleLeft, setOpeleLeft] = useState<[number, number, number, number]>([1, 1, 1, 1]);
  const [isCastingOpele, setIsCastingOpele] = useState(false);
  const currentOpeleOdu = getOduByCodes(opeleRight, opeleLeft);

  const castOpeleChain = () => {
    setIsCastingOpele(true);
    setTimeout(() => {
      const newRight: [number, number, number, number] = [
        Math.random() > 0.5 ? 1 : 2,
        Math.random() > 0.5 ? 1 : 2,
        Math.random() > 0.5 ? 1 : 2,
        Math.random() > 0.5 ? 1 : 2,
      ];
      const newLeft: [number, number, number, number] = [
        Math.random() > 0.5 ? 1 : 2,
        Math.random() > 0.5 ? 1 : 2,
        Math.random() > 0.5 ? 1 : 2,
        Math.random() > 0.5 ? 1 : 2,
      ];
      setOpeleRight(newRight);
      setOpeleLeft(newLeft);
      setIsCastingOpele(false);
    }, 600);
  };

  // Opon Ifa Interactive Powder State
  const [oponMarks, setOponMarks] = useState<[number, number, number, number]>([1, 2, 1, 2]);
  const toggleOponMark = (index: number) => {
    const updated = [...oponMarks] as [number, number, number, number];
    updated[index] = updated[index] === 1 ? 2 : 1;
    setOponMarks(updated);
  };
  const resetOpon = () => setOponMarks([1, 1, 1, 1]);

  // Amulu 256 Odus Explorer State
  const [searchOdu, setSearchOdu] = useState('');
  const [oduFilter, setOduFilter] = useState<'all' | 'meji' | 'amulu'>('meji');
  const [selectedOduModal, setSelectedOduModal] = useState<IfaOduDetail | null>(null);

  // Hakata State
  const [hakataStates, setHakataStates] = useState<[boolean, boolean, boolean, boolean]>([true, true, false, false]);
  const [isThrowingHakata, setIsThrowingHakata] = useState(false);
  const hakataResult = evaluateHakataThrow(hakataStates);

  const throwHakataRandomly = () => {
    setIsThrowingHakata(true);
    setTimeout(() => {
      setHakataStates([
        Math.random() > 0.5,
        Math.random() > 0.5,
        Math.random() > 0.5,
        Math.random() > 0.5,
      ]);
      setIsThrowingHakata(false);
    }, 500);
  };

  // Sikidy Malgache State
  const sikidyHouses = computeSikidyMalgache(houses);

  // Sikidy Rano (Water Ripples)
  const [waterRippleStep, setWaterRippleStep] = useState(false);
  const [waterMotherFigures, setWaterMotherFigures] = useState<Geomantic16Figure[]>([houses[0], houses[1], houses[2], houses[3]]);
  const triggerWaterRipples = () => {
    setWaterRippleStep(true);
    setTimeout(() => {
      const shuffled = [...CLASSICAL_16_FIGURES].sort(() => 0.5 - Math.random()).slice(0, 4);
      setWaterMotherFigures(shuffled);
      setWaterRippleStep(false);
    }, 700);
  };

  // Odu of Birth State
  const [birthName, setBirthName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthResult, setBirthResult] = useState<any>(null);

  const handleCalculateOduBirth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthName.trim()) return;
    const res = computeOduBirth(birthName, birthDate);
    setBirthResult(res);
  };

  // Helper to render Ifa Pod
  const renderOpelePod = (value: number) => (
    <div className={`w-8 h-10 rounded-lg flex items-center justify-center border transition-all ${
      value === 1 
        ? 'bg-amber-500/20 dark:bg-amber-500/30 border-amber-500 dark:border-amber-400 text-amber-900 dark:text-amber-200 shadow-sm' 
        : 'bg-stone-100 dark:bg-stone-800/80 border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400'
    }`}>
      <span className="text-xs font-bold font-mono">{value === 1 ? 'I' : 'II'}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-100/40 to-emerald-500/10 dark:from-emerald-950/40 dark:via-stone-900/50 dark:to-amber-950/40 border border-emerald-500/30 dark:border-emerald-600/30 rounded-xl p-5 shadow-sm dark:shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-emerald-500/20 rounded-lg text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-emerald-200">{t.africanSectionTitle}</h3>
            <p className="text-sm text-stone-600 dark:text-stone-300">{t.africanSectionDesc}</p>
          </div>
        </div>
      </div>

      {/* Subtabs Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        <button
          onClick={() => setActiveSubTab('opele')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'opele'
              ? 'bg-emerald-500/20 dark:bg-emerald-600/30 text-emerald-800 dark:text-emerald-300 border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-emerald-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-1 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">{t.subOpele}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('opon')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'opon'
              ? 'bg-emerald-500/20 dark:bg-emerald-600/30 text-emerald-800 dark:text-emerald-300 border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-emerald-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <Layers className="w-4 h-4 mb-1 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">{t.subOponIfa}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('amulu')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'amulu'
              ? 'bg-emerald-500/20 dark:bg-emerald-600/30 text-emerald-800 dark:text-emerald-300 border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-emerald-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-1 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">{t.subAmuluOdus}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sikidy')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'sikidy'
              ? 'bg-emerald-500/20 dark:bg-emerald-600/30 text-emerald-800 dark:text-emerald-300 border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-emerald-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <Layers className="w-4 h-4 mb-1 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">{t.subSikidyMalgache}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ebo')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'ebo'
              ? 'bg-emerald-500/20 dark:bg-emerald-600/30 text-emerald-800 dark:text-emerald-300 border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-emerald-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <Flame className="w-4 h-4 mb-1 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">{t.subEbo}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hakata')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'hakata'
              ? 'bg-emerald-500/20 dark:bg-emerald-600/30 text-emerald-800 dark:text-emerald-300 border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-emerald-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <ShieldCheck className="w-4 h-4 mb-1 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">{t.subHakata}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sikidyRano')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'sikidyRano'
              ? 'bg-emerald-500/20 dark:bg-emerald-600/30 text-emerald-800 dark:text-emerald-300 border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-emerald-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <Droplets className="w-4 h-4 mb-1 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">{t.subSikidyRano}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('oduBirth')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-xs font-semibold transition-all border ${
            activeSubTab === 'oduBirth'
              ? 'bg-emerald-500/20 dark:bg-emerald-600/30 text-emerald-800 dark:text-emerald-300 border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-stone-900/40 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-emerald-500/50 hover:text-stone-900 dark:hover:text-stone-200 shadow-xs'
          }`}
        >
          <User className="w-4 h-4 mb-1 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">{t.subOduBirth}</span>
        </button>
      </div>

      {/* Subtab Contents */}
      <motion.div
        key={activeSubTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* 1. OPELE VIRTUEL */}
        {activeSubTab === 'opele' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="flex items-start justify-between flex-wrap gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div>
                <h4 className="text-lg font-bold text-stone-900 dark:text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  {t.subOpele}
                </h4>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subOpeleDesc}</p>
              </div>
              <button
                onClick={castOpeleChain}
                disabled={isCastingOpele}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg text-sm font-bold shadow-md transition-all disabled:opacity-50"
              >
                <RotateCcw className={`w-4 h-4 ${isCastingOpele ? 'animate-spin' : ''}`} />
                <span>{isCastingOpele ? t.castingOpele : t.btnCastOpele}</span>
              </button>
            </div>

            {/* Opele Chain Visual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="p-6 bg-gradient-to-b from-emerald-50/50 to-stone-50 dark:from-stone-950 dark:to-stone-900 border border-stone-200 dark:border-emerald-500/30 rounded-xl flex flex-col items-center space-y-4 shadow-xs">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
                  {t.revealedOduBadge}
                </span>

                {/* 2 Legs of Opele */}
                <div className="flex space-x-8 items-center justify-center p-4 bg-white dark:bg-stone-900/80 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs">
                  {/* Right Leg */}
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-semibold">{t.rightLegLabel}</span>
                    {opeleRight.map((val, idx) => (
                      <div key={idx}>{renderOpelePod(val)}</div>
                    ))}
                  </div>

                  {/* Chain Center Link */}
                  <div className="h-40 w-0.5 bg-emerald-500/30 border-l border-dashed border-emerald-500/50" />

                  {/* Left Leg */}
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-semibold">{t.leftLegLabel}</span>
                    {opeleLeft.map((val, idx) => (
                      <div key={idx}>{renderOpelePod(val)}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Odu Wisdom & Oracle Card */}
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h5 className="text-xl font-extrabold text-stone-900 dark:text-emerald-200">
                      {currentOpeleOdu.nameYoruba}
                    </h5>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-500/40">
                      {currentOpeleOdu.orishaRuling}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Fa (Bénin / Togo) : <span className="text-stone-900 dark:text-stone-200 font-semibold">{currentOpeleOdu.nameFon}</span>
                  </p>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide block">
                    {t.proverbLabel} :
                  </span>
                  <p className="text-sm font-serif italic text-stone-800 dark:text-stone-200 leading-relaxed">
                    "{lang === 'fr' ? currentOpeleOdu.proverbFr : lang === 'ha' ? currentOpeleOdu.proverbHa : currentOpeleOdu.proverbEn}"
                  </p>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide block">
                    {t.itanLabel} :
                  </span>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    {lang === 'fr' ? currentOpeleOdu.itanStoryFr : lang === 'ha' ? currentOpeleOdu.itanStoryHa : currentOpeleOdu.itanStoryEn}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. OPON IFA (Sacred Board & Irosun Powder) */}
        {activeSubTab === 'opon' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="flex items-start justify-between flex-wrap gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div>
                <h4 className="text-lg font-bold text-stone-900 dark:text-emerald-300 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  {t.subOponIfa}
                </h4>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subOponIfaDesc}</p>
              </div>
              <button
                onClick={resetOpon}
                className="flex items-center space-x-2 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-semibold shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.btnClearOpon}</span>
              </button>
            </div>

            <p className="text-xs text-stone-700 dark:text-stone-300 bg-amber-500/10 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-500/20">
              {t.oponInstructions}
            </p>

            {/* Circular Sacred Tray Visual */}
            <div className="flex flex-col items-center justify-center p-6">
              <div className="w-72 h-72 rounded-full border-8 border-amber-700 dark:border-amber-800 bg-gradient-to-b from-amber-100 via-amber-200/60 to-amber-100 dark:from-yellow-800/40 dark:via-amber-700/30 dark:to-yellow-900/50 shadow-xl relative flex flex-col items-center justify-center p-4">
                {/* Eshu Head at Top */}
                <div className="absolute top-2 text-center text-[10px] font-bold uppercase tracking-widest text-amber-900 dark:text-amber-300 bg-amber-200/90 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-400 dark:border-amber-600/40 shadow-xs">
                  Èṣù-Ẹlẹ́gbára
                </div>

                {/* 4 Interactive Mark Quadrants */}
                <div className="space-y-3 mt-4">
                  {oponMarks.map((val, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleOponMark(idx)}
                      className="px-6 py-2 bg-amber-900/15 dark:bg-yellow-950/60 hover:bg-amber-900/25 dark:hover:bg-yellow-900/80 border border-amber-600/40 rounded-lg text-amber-900 dark:text-amber-200 font-mono font-bold text-lg tracking-widest transition-all shadow-sm"
                    >
                      {val === 1 ? '•  I  •' : '•• II ••'}
                    </button>
                  ))}
                </div>

                <span className="text-[10px] text-amber-800 dark:text-amber-400/80 uppercase font-semibold mt-3">
                  Irosun (Iyerosun)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. AMULU ODUS (256 ODUS ENCYCLOPEDIA) */}
        {activeSubTab === 'amulu' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <h4 className="text-lg font-bold text-stone-900 dark:text-emerald-300 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                {t.subAmuluOdus}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subAmuluOdusDesc}</p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchOdu}
                  onChange={(e) => setSearchOdu(e.target.value)}
                  placeholder={t.searchOduPlaceholder}
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-stone-200 focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setOduFilter('meji')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                    oduFilter === 'meji'
                      ? 'bg-emerald-500/20 dark:bg-emerald-600/30 text-emerald-800 dark:text-emerald-300 border-emerald-500'
                      : 'bg-stone-50 dark:bg-stone-950 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  {t.filterAllMeji}
                </button>
              </div>
            </div>

            {/* Grid of 16 Mejis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {IFA_16_MEJI_ODUS
                .filter(o => 
                  o.nameYoruba.toLowerCase().includes(searchOdu.toLowerCase()) || 
                  o.nameFon.toLowerCase().includes(searchOdu.toLowerCase()) ||
                  o.proverbFr.toLowerCase().includes(searchOdu.toLowerCase()) ||
                  o.proverbHa.toLowerCase().includes(searchOdu.toLowerCase())
                )
                .map((odu) => (
                  <div
                    key={odu.id}
                    onClick={() => setSelectedOduModal(odu)}
                    className="p-4 bg-stone-50 dark:bg-stone-950/60 hover:bg-white dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 rounded-xl cursor-pointer transition-all space-y-2 group shadow-xs hover:shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <h5 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-200">
                        {odu.nameYoruba}
                      </h5>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-400 font-medium">
                        {odu.element.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                      "{lang === 'fr' ? odu.proverbFr : lang === 'ha' ? odu.proverbHa : odu.proverbEn}"
                    </p>
                  </div>
                ))}
            </div>

            {/* Modal Detail for Selected Odu */}
            <AnimatePresence>
              {selectedOduModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-emerald-500/40 rounded-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl"
                  >
                    <div className="flex justify-between items-start border-b border-stone-200 dark:border-stone-800 pb-3">
                      <div>
                        <h4 className="text-xl font-extrabold text-stone-900 dark:text-emerald-200">
                          {selectedOduModal.nameYoruba}
                        </h4>
                        <p className="text-xs text-stone-600 dark:text-stone-400">
                          {selectedOduModal.orishaRuling} • Fa: {selectedOduModal.nameFon}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedOduModal(null)}
                        className="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white text-lg font-bold p-1"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-3 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                      <div className="p-3 bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-lg">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase block mb-1">{t.proverbLabel}</span>
                        <p className="font-serif italic text-stone-900 dark:text-stone-200 text-sm">
                          "{lang === 'fr' ? selectedOduModal.proverbFr : lang === 'ha' ? selectedOduModal.proverbHa : selectedOduModal.proverbEn}"
                        </p>
                      </div>

                      <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-lg border border-stone-200 dark:border-stone-800">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase block mb-1">{t.itanLabel}</span>
                        <p>{lang === 'fr' ? selectedOduModal.itanStoryFr : lang === 'ha' ? selectedOduModal.itanStoryHa : selectedOduModal.itanStoryEn}</p>
                      </div>

                      <div className="p-3 bg-amber-500/10 dark:bg-amber-950/20 rounded-lg border border-amber-500/20">
                        <span className="font-bold text-amber-700 dark:text-amber-400 uppercase block mb-1">{t.subEbo}</span>
                        <p>{lang === 'fr' ? selectedOduModal.eboSacrificeFr : lang === 'ha' ? selectedOduModal.eboSacrificeHa : selectedOduModal.eboSacrificeEn}</p>
                      </div>

                      <div className="p-3 bg-red-500/10 dark:bg-red-950/20 rounded-lg border border-red-500/20">
                        <span className="font-bold text-red-700 dark:text-red-400 uppercase block mb-1">{t.tabooLabel}</span>
                        <p>{lang === 'fr' ? selectedOduModal.tabooEwoFr : lang === 'ha' ? selectedOduModal.tabooEwoHa : selectedOduModal.tabooEwoEn}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* 4. SIKIDY MALGACHE */}
        {activeSubTab === 'sikidy' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <h4 className="text-lg font-bold text-stone-900 dark:text-emerald-300 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                {t.subSikidyMalgache}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subSikidyMalgacheDesc}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {sikidyHouses.map((s, idx) => (
                <div key={idx} className="p-3 bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 rounded-xl flex flex-col items-center text-center space-y-2 shadow-xs">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">{s.nameMalagasy}</span>
                  <div className="flex flex-col items-center space-y-1">
                    {s.figure.dots.map((val, dIdx) => (
                      <div key={dIdx} className="flex space-x-1">
                        {val === 1 ? <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" /> : (
                          <>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-700 dark:text-stone-300 font-medium line-clamp-1">{lang === 'fr' ? s.nameFr : lang === 'ha' ? s.nameHa : s.nameEn}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. OFFRANDE D'ÉQUILIBRE (EBO) */}
        {activeSubTab === 'ebo' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <h4 className="text-lg font-bold text-stone-900 dark:text-emerald-300 flex items-center gap-2">
                <Flame className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                {t.subEbo}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subEboDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-gradient-to-b from-emerald-50/50 to-stone-50 dark:from-stone-950 dark:to-stone-900 border border-stone-200 dark:border-emerald-500/30 rounded-xl space-y-3 shadow-xs">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide block">
                  {t.eboIngredientsTitle}
                </span>
                <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                  {lang === 'fr' ? currentOpeleOdu.eboSacrificeFr : lang === 'ha' ? currentOpeleOdu.eboSacrificeHa : currentOpeleOdu.eboSacrificeEn}
                </p>
              </div>

              <div className="p-5 bg-gradient-to-b from-amber-50/50 to-stone-50 dark:from-stone-950 dark:to-stone-900 border border-stone-200 dark:border-emerald-500/30 rounded-xl space-y-3 shadow-xs">
                <span className="text-xs font-bold text-amber-700 dark:text-emerald-400 uppercase tracking-wide block">
                  {t.warningLabel} :
                </span>
                <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                  {lang === 'fr' ? currentOpeleOdu.spiritualWarningFr : lang === 'ha' ? currentOpeleOdu.spiritualWarningHa : currentOpeleOdu.spiritualWarningEn}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 6. HAKATA (Shona Divination Tablets) */}
        {activeSubTab === 'hakata' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="flex items-start justify-between flex-wrap gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div>
                <h4 className="text-lg font-bold text-stone-900 dark:text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  {t.subHakata}
                </h4>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subHakataDesc}</p>
              </div>
              <button
                onClick={throwHakataRandomly}
                disabled={isThrowingHakata}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg text-sm font-bold shadow-md transition-all disabled:opacity-50"
              >
                <RotateCcw className={`w-4 h-4 ${isThrowingHakata ? 'animate-spin' : ''}`} />
                <span>{isThrowingHakata ? t.throwingHakata : t.btnThrowHakata}</span>
              </button>
            </div>

            {/* 4 Tablets Interactive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {HAKATA_TABLETS.map((tablet, idx) => {
                const isOpen = hakataStates[idx];
                return (
                  <div
                    key={tablet.id}
                    onClick={() => {
                      const upd = [...hakataStates] as [boolean, boolean, boolean, boolean];
                      upd[idx] = !upd[idx];
                      setHakataStates(upd);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center space-y-2 shadow-xs ${
                      isOpen
                        ? 'bg-gradient-to-b from-amber-50 to-stone-50 dark:from-amber-950/40 dark:to-stone-900 border-amber-400 dark:border-amber-500/50 shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-950/60 border-stone-200 dark:border-stone-800 opacity-60'
                    }`}
                  >
                    <div className={`w-12 h-16 rounded-md border flex items-center justify-center font-bold text-xs ${
                      isOpen ? 'border-amber-400 bg-amber-500/20 text-amber-800 dark:text-amber-200' : 'border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-900 text-stone-500'
                    }`}>
                      {isOpen ? '▲ UP' : '▼ DOWN'}
                    </div>
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-200">{tablet.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isOpen ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300' : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-500'
                    }`}>
                      {isOpen ? t.tabletFaceUp : t.tabletFaceDown}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Hakata Oracle Verdict */}
            <div className="p-5 bg-gradient-to-b from-emerald-50/50 to-stone-50 dark:from-stone-950 dark:to-stone-900 border border-stone-200 dark:border-emerald-500/30 rounded-xl space-y-3 shadow-xs">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide block">
                {t.hakataVerdictLabel} {lang === 'fr' ? hakataResult.combinationNameFr : lang === 'ha' ? hakataResult.combinationNameHa : hakataResult.combinationNameEn}
              </span>
              <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                {lang === 'fr' ? hakataResult.oracularMessageFr : lang === 'ha' ? hakataResult.oracularMessageHa : hakataResult.oracularMessageEn}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 italic border-t border-stone-200 dark:border-stone-800 pt-2">
                {lang === 'fr' ? hakataResult.recommendationFr : lang === 'ha' ? hakataResult.recommendationHa : hakataResult.recommendationEn}
              </p>
            </div>
          </div>
        )}

        {/* 7. SIKIDY D'EAU (RANO) */}
        {activeSubTab === 'sikidyRano' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="flex items-start justify-between flex-wrap gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div>
                <h4 className="text-lg font-bold text-stone-900 dark:text-emerald-300 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  {t.subSikidyRano}
                </h4>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subSikidyRanoDesc}</p>
              </div>
              <button
                onClick={triggerWaterRipples}
                disabled={waterRippleStep}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-500 hover:to-emerald-600 text-white rounded-lg text-sm font-bold shadow-md transition-all"
              >
                <Droplets className={`w-4 h-4 ${waterRippleStep ? 'animate-bounce' : ''}`} />
                <span>{waterRippleStep ? t.waterRippleStep : t.btnGenerateWaterRipples}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {waterMotherFigures.map((fig, idx) => (
                <div key={idx} className="p-4 bg-teal-500/10 dark:bg-teal-950/20 border border-teal-500/30 rounded-xl flex flex-col items-center text-center space-y-2 shadow-xs">
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase">Mère {idx + 1}</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-200">{lang === 'fr' ? fig.nameFr : lang === 'ha' ? fig.nameHa : fig.nameEn}</span>
                  <p className="text-xs font-serif text-teal-700 dark:text-teal-400/80">{fig.nameAr}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. ODU DE NAISSANCE (Ifa Astro / Odu Ori) */}
        {activeSubTab === 'oduBirth' && (
          <div className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-6 shadow-sm dark:shadow-md">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
              <h4 className="text-lg font-bold text-stone-900 dark:text-emerald-300 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                {t.subOduBirth}
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{t.subOduBirthDesc}</p>
            </div>

            <form onSubmit={handleCalculateOduBirth} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase block mb-1">{t.inputFullName}</label>
                <input
                  type="text"
                  required
                  value={birthName}
                  onChange={(e) => setBirthName(e.target.value)}
                  placeholder="ex: Ibrahim Olatunji"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-stone-200 focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase block mb-1">{t.inputBirthDate}</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-stone-200 focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg text-sm font-bold shadow-md transition-all"
                >
                  {t.btnCalculateOduOri}
                </button>
              </div>
            </form>

            {birthResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gradient-to-b from-emerald-50/50 to-stone-50 dark:from-stone-950 dark:to-stone-900 border border-stone-200 dark:border-emerald-500/40 rounded-xl space-y-4 shadow-xs"
              >
                <div className="flex justify-between items-center flex-wrap gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide block">
                      {t.oduOriTitle}
                    </span>
                    <h5 className="text-xl font-extrabold text-stone-900 dark:text-emerald-200">{birthResult.oduOri.nameYoruba}</h5>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full">
                    {birthResult.guardianOrisha}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-stone-700 dark:text-stone-300">
                  <div className="p-3 bg-white dark:bg-stone-950 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-xs block mb-1">{t.destinyPathTitle}</span>
                    <p>{lang === 'fr' ? birthResult.destinyPathFr : lang === 'ha' ? birthResult.destinyPathHa : birthResult.destinyPathEn}</p>
                  </div>

                  <div className="p-3 bg-red-500/10 dark:bg-red-950/20 rounded-lg border border-red-500/20">
                    <span className="font-bold text-red-700 dark:text-red-400 uppercase text-xs block mb-1">{t.dailyTabooTitle}</span>
                    <p className="text-xs">{lang === 'fr' ? birthResult.dailyTabooFr : lang === 'ha' ? birthResult.dailyTabooHa : birthResult.dailyTabooEn}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
