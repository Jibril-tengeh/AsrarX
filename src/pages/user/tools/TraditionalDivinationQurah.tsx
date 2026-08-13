import React, { useState, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Info,
  Copy,
  Check,
  Download,
  Feather,
  Compass,
  SlidersHorizontal,
  Scale,
  Sun,
  Clock,
  Shield,
  Activity,
  Key,
  Star,
  Circle,
  Layers,
  Award,
  AlertTriangle,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Grid,
  RotateCw,
  Coins,
  Shuffle,
  HelpCircle,
  Heart,
  Briefcase,
  Plus,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { exportWirdToImage } from '../../../utils/wirdExporter';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import {
  QURAH_TRANSLATIONS,
  QurahTranslation,
} from '../../../components/qurah/qurahTranslations';
import {
  CauriShell,
  castCauris,
  getCauriResultKey,
  drawAzlamStick,
} from '../../../utils/qurahEngine';

type ActiveTab = 'cauris' | 'azlam' | 'dial';

export const TraditionalDivinationQurah: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const t: QurahTranslation = QURAH_TRANSLATIONS[langKey] || QURAH_TRANSLATIONS.fr;

  const [activeTab, setActiveTab] = useState<ActiveTab>('cauris');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<
    'general' | 'love' | 'business' | 'health' | 'protection' | 'spiritual'
  >('general');

  const exportRef = useRef<HTMLDivElement>(null);

  // ================= CAURIS STATE =================
  const [cauriCountMode, setCauriCountMode] = useState<4 | 8 | 16>(4);
  const [cauriShells, setCauriShells] = useState<CauriShell[]>(() => castCauris(4));
  const [isCauriTossing, setIsCauriTossing] = useState<boolean>(false);

  const handleTossCauris = () => {
    setIsCauriTossing(true);
    setTimeout(() => {
      setCauriShells(castCauris(cauriCountMode));
      setIsCauriTossing(false);
    }, 600);
  };

  const handleToggleCauriFace = (id: number) => {
    setCauriShells((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isOpen: !s.isOpen } : s))
    );
  };

  const cauriResultKey = useMemo(() => getCauriResultKey(cauriShells), [cauriShells]);
  const cauriResultData = useMemo(() => {
    return (
      t.cauris.results[cauriResultKey] ||
      t.cauris.results['kole'] || {
        name: 'Kole',
        arabicName: 'الكتمان',
        verdict: 'Retrait',
        summary: '',
        details: '',
        sadaka: '',
        dhikr: '',
        element: '',
      }
    );
  }, [cauriResultKey, t]);

  const openShellsCount = useMemo(
    () => cauriShells.filter((s) => s.isOpen).length,
    [cauriShells]
  );

  // ================= AZLAM STATE =================
  const [azlamMode, setAzlamMode] = useState<3 | 7>(3);
  const [isContainerShaking, setIsContainerShaking] = useState<boolean>(false);
  const [drawnStickKey, setDrawnStickKey] = useState<string | null>(null);

  const handleShakeAndDrawAzlam = () => {
    setIsContainerShaking(true);
    setDrawnStickKey(null);
    setTimeout(() => {
      setIsContainerShaking(false);
      const drawn = drawAzlamStick(azlamMode);
      setDrawnStickKey(drawn);
    }, 700);
  };

  const azlamResultData = useMemo(() => {
    if (!drawnStickKey) return null;
    return t.azlam.sticks[drawnStickKey] || null;
  }, [drawnStickKey, t]);

  // ================= DECISION DIAL STATE =================
  const [dialPreset, setDialPreset] = useState<'binary' | 'strategic' | 'daily' | 'custom'>('binary');
  const [customChoices, setCustomChoices] = useState<string[]>([
    'Option A - Projet 1',
    'Option B - Projet 2',
    'Option C - Attendre',
  ]);
  const [newChoiceInput, setNewChoiceInput] = useState<string>('');

  const activeDialItems = useMemo(() => {
    if (dialPreset === 'custom') return customChoices.length >= 2 ? customChoices : ['Option 1', 'Option 2'];
    return t.dial.presetItems[dialPreset] || t.dial.presetItems['binary'];
  }, [dialPreset, customChoices, t]);

  const [dialRotation, setDialRotation] = useState<number>(0);
  const [isDialSpinning, setIsDialSpinning] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSpinDial = () => {
    if (isDialSpinning || activeDialItems.length === 0) return;
    setIsDialSpinning(true);
    setSelectedIndex(null);

    const count = activeDialItems.length;
    const pickedIdx = Math.floor(Math.random() * count);
    const segmentAngle = 360 / count;

    // Target angle where top pointer lands on picked segment
    const targetSegmentCenter = pickedIdx * segmentAngle + segmentAngle / 2;
    // 5 full spins (1800 deg) + angle calculation
    const extraSpins = 360 * 5;
    const totalNewRotation = dialRotation + extraSpins + (360 - targetSegmentCenter);

    setDialRotation(totalNewRotation);

    setTimeout(() => {
      setIsDialSpinning(false);
      setSelectedIndex(pickedIdx);
    }, 3200);
  };

  const handleAddCustomChoice = () => {
    if (!newChoiceInput.trim()) return;
    setCustomChoices((prev) => [...prev, newChoiceInput.trim()]);
    setNewChoiceInput('');
  };

  const handleRemoveCustomChoice = (index: number) => {
    if (customChoices.length <= 2) return;
    setCustomChoices((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= GENERAL HELPERS =================
  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportImage = () => {
    const qurahDetails = [
      { label: 'Mode d\'Oracle', value: activeTab.toUpperCase() },
      { label: 'Nom de la Figure', value: `${cauriResultData.name} (${cauriResultData.arabicName || ''})` },
      { label: 'Verdict Spirituel', value: cauriResultData.verdict },
      { label: 'Nombre / Poids', value: `${openShellsCount}` },
      { label: 'Aumône (Saraka)', value: cauriResultData.sadaka || 'Prière & Aumône libre' },
      { label: 'Invocations', value: cauriResultData.dhikr || 'Astaghfirullah 100x' },
    ];

    exportWirdToImage({
      arabicZikr: cauriResultData.arabicName || 'قرعة الإستخارة',
      transliteration: userQuestion || 'Consultation Qur\'ah',
      abjadWeight: openShellsCount,
      title: `DIVINATION QUR'AH (${activeTab.toUpperCase()})`,
      meaningFr: `${cauriResultData.name} — ${cauriResultData.verdict}`,
      isParchment: true,
      lang: langKey,
      detailsList: qurahDetails,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-amber-500/30 p-5 sm:p-6 rounded-3xl shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/tools')}
              className="p-3 bg-slate-800/80 hover:bg-slate-700/80 text-amber-400 rounded-2xl transition-all border border-amber-500/20 shadow-inner group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
                  {t.title}
                </h1>
                <ToolInfoTooltip content={t.infoToolTip} />
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {t.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={handleExportImage}
            className="w-full md:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t.common.export}</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => setActiveTab('cauris')}
            className={`p-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
              activeTab === 'cauris'
                ? 'bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 shadow-lg border border-amber-400/30'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
            }`}
          >
            <Coins className="w-4 h-4" />
            <div className="text-left">
              <div className="font-bold">{t.tabs.cauris}</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('azlam')}
            className={`p-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
              activeTab === 'azlam'
                ? 'bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 shadow-lg border border-amber-400/30'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
            }`}
          >
            <Feather className="w-4 h-4" />
            <div className="text-left">
              <div className="font-bold">{t.tabs.azlam}</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('dial')}
            className={`p-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
              activeTab === 'dial'
                ? 'bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 shadow-lg border border-amber-400/30'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-4 h-4" />
            <div className="text-left">
              <div className="font-bold">{t.tabs.dial}</div>
            </div>
          </button>
        </div>

        {/* Intention & Domain Panel */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-amber-400/90 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Question ou Intention</span>
              </label>
              <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder={t.common.questionPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/60 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-amber-400/90 uppercase tracking-wider flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5" />
                <span>{t.common.intentionLabel}</span>
              </label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/60 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-amber-300 focus:outline-none transition-colors"
              >
                <option value="general">{t.common.intentionDomains.general}</option>
                <option value="love">{t.common.intentionDomains.love}</option>
                <option value="business">{t.common.intentionDomains.business}</option>
                <option value="health">{t.common.intentionDomains.health}</option>
                <option value="protection">{t.common.intentionDomains.protection}</option>
                <option value="spiritual">{t.common.intentionDomains.spiritual}</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= TAB 1: CAURIS (COWRIE SHELLS) ================= */}
        {activeTab === 'cauris' && (
          <div ref={exportRef} className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-400" />
                    <span>{t.cauris.title}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">{t.cauris.subtitle}</p>
                </div>

                {/* Mode Selector */}
                <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                  <button
                    onClick={() => {
                      setCauriCountMode(4);
                      setCauriShells(castCauris(4));
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      cauriCountMode === 4
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    4 Cauris
                  </button>
                  <button
                    onClick={() => {
                      setCauriCountMode(8);
                      setCauriShells(castCauris(8));
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      cauriCountMode === 8
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    8 Cauris
                  </button>
                  <button
                    onClick={() => {
                      setCauriCountMode(16);
                      setCauriShells(castCauris(16));
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      cauriCountMode === 16
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    16 Cauris
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic bg-amber-500/5 p-3 rounded-2xl border border-amber-500/10">
                {t.cauris.instructions}
              </p>

              {/* Mat / Canvas Canvas */}
              <div className="relative w-full h-80 sm:h-96 rounded-3xl bg-gradient-to-br from-amber-950/40 via-stone-900 to-slate-950 border-2 border-amber-500/30 overflow-hidden flex items-center justify-center shadow-inner">
                {/* Woven Mat Background Ring */}
                <div className="absolute inset-4 rounded-full border border-dashed border-amber-500/20 pointer-events-none" />
                <div className="absolute inset-16 rounded-full border border-amber-500/10 pointer-events-none" />
                <div className="absolute inset-28 rounded-full border border-dashed border-amber-500/15 pointer-events-none" />

                {/* Shells Representation */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <AnimatePresence>
                    {cauriShells.map((shell) => (
                      <motion.div
                        key={shell.id}
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{
                          scale: isCauriTossing ? [1, 1.3, 0.9, 1] : 1,
                          x: shell.xOffset,
                          y: shell.yOffset,
                          rotate: shell.rotation,
                        }}
                        transition={{
                          duration: 0.5,
                          delay: shell.id * 0.02,
                        }}
                        onClick={() => handleToggleCauriFace(shell.id)}
                        className="absolute cursor-pointer group"
                        title={t.cauris.toggleHelp}
                      >
                        {/* Custom SVG Cauri Shell */}
                        <div
                          className={`w-12 h-16 sm:w-14 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border ${
                            shell.isOpen
                              ? 'bg-gradient-to-b from-stone-100 via-amber-50 to-stone-200 border-amber-300/80 shadow-amber-500/20 group-hover:scale-110'
                              : 'bg-gradient-to-b from-amber-900 via-stone-800 to-amber-950 border-amber-700/50 shadow-black/60 group-hover:scale-110'
                          }`}
                        >
                          {shell.isOpen ? (
                            /* Aperture side: teeth/slit */
                            <div className="w-3.5 h-10 bg-stone-900/90 rounded-full flex flex-col justify-between items-center py-1 border border-stone-700/50">
                              <div className="w-2.5 h-0.5 bg-amber-200/80 rounded" />
                              <div className="w-2.5 h-0.5 bg-amber-200/80 rounded" />
                              <div className="w-2.5 h-0.5 bg-amber-200/80 rounded" />
                              <div className="w-2.5 h-0.5 bg-amber-200/80 rounded" />
                            </div>
                          ) : (
                            /* Dorsal smooth back */
                            <div className="w-6 h-10 rounded-full bg-gradient-to-b from-amber-800/40 to-stone-900/80 border border-amber-600/30 flex items-center justify-center">
                              <div className="w-1.5 h-5 rounded-full bg-amber-500/20" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="absolute bottom-3 left-3 text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span>
                    {openShellsCount} / {cauriShells.length} {t.cauris.openLabel}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleTossCauris}
                  disabled={isCauriTossing}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl shadow-xl transition-all flex items-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
                >
                  <Coins className={`w-5 h-5 ${isCauriTossing ? 'animate-spin' : ''}`} />
                  <span>{t.common.toss}</span>
                </button>
              </div>

              {/* Result Summary Card */}
              <div className="bg-slate-950 border border-amber-500/30 p-5 sm:p-6 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block">
                      {cauriResultData.arabicName}
                    </span>
                    <h3 className="text-xl font-black text-amber-200">{cauriResultData.name}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/20">
                      {cauriResultData.verdict}
                    </span>
                    <span className="px-3 py-1 bg-slate-900 text-slate-300 text-xs font-bold rounded-xl border border-slate-800">
                      {cauriResultData.element}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {cauriResultData.summary}
                </p>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>{t.common.advice}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {cauriResultData.details}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-amber-950/20 p-3.5 rounded-2xl border border-amber-500/20 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      {t.common.sadaka}
                    </span>
                    <p className="text-xs text-slate-200 font-medium">
                      {cauriResultData.sadaka}
                    </p>
                  </div>

                  <div className="bg-amber-950/20 p-3.5 rounded-2xl border border-amber-500/20 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      {t.common.dhikr}
                    </span>
                    <p className="text-xs text-slate-200 font-medium">
                      {cauriResultData.dhikr}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: AZLAM (SACRED STICKS) ================= */}
        {activeTab === 'azlam' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
                    <Feather className="w-5 h-5 text-amber-400" />
                    <span>{t.azlam.title}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">{t.azlam.subtitle}</p>
                </div>

                {/* Mode Selector */}
                <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                  <button
                    onClick={() => {
                      setAzlamMode(3);
                      setDrawnStickKey(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      azlamMode === 3
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    3 Bâtonnets
                  </button>
                  <button
                    onClick={() => {
                      setAzlamMode(7);
                      setDrawnStickKey(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      azlamMode === 7
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    7 Bâtonnets
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic bg-amber-500/5 p-3 rounded-2xl border border-amber-500/10">
                {t.azlam.instructions}
              </p>

              {/* Shaking Container & Stick Pull Visual */}
              <div className="relative w-full h-80 rounded-3xl bg-gradient-to-br from-amber-950/30 via-stone-900 to-slate-950 border border-amber-500/30 overflow-hidden flex flex-col items-center justify-center p-6 space-y-6">
                {/* Carved Container Graphic */}
                <motion.div
                  animate={isContainerShaking ? { rotate: [-8, 8, -6, 6, -3, 3, 0], y: [-5, 5, -3, 3, 0] } : {}}
                  transition={{ duration: 0.6 }}
                  className="w-28 h-44 rounded-b-3xl bg-gradient-to-b from-stone-800 via-amber-900 to-stone-950 border-2 border-amber-500/50 shadow-2xl flex flex-col items-center justify-start p-3 relative"
                >
                  <div className="w-full h-4 rounded-full bg-amber-500/20 border border-amber-500/30 mb-2" />
                  <span className="text-[9px] font-mono font-bold text-amber-300 uppercase tracking-widest text-center">
                    Miqlah
                  </span>
                  <div className="w-16 h-0.5 bg-amber-500/30 my-2" />
                  <div className="text-amber-400/40 text-xs font-serif italic">الأزلام</div>
                </motion.div>

                {/* Stick Extraction Animation */}
                <AnimatePresence>
                  {azlamResultData && (
                    <motion.div
                      initial={{ y: 50, opacity: 0, scale: 0.8 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: 50, opacity: 0 }}
                      className="w-full max-w-md bg-gradient-to-r from-amber-900 via-stone-800 to-amber-950 border-2 border-amber-400/60 p-4 rounded-2xl shadow-2xl flex items-center justify-between text-slate-100"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest block">
                          {azlamResultData.arabicName}
                        </span>
                        <h4 className="text-base font-black text-amber-200">
                          {azlamResultData.name}
                        </h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md uppercase tracking-wider">
                        {azlamResultData.verdict}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Draw Action Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleShakeAndDrawAzlam}
                  disabled={isContainerShaking}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl shadow-xl transition-all flex items-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
                >
                  <Feather className={`w-5 h-5 ${isContainerShaking ? 'animate-bounce' : ''}`} />
                  <span>{t.common.pullStick}</span>
                </button>
              </div>

              {/* Result Details */}
              {azlamResultData && (
                <div className="bg-slate-950 border border-amber-500/30 p-5 sm:p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-black text-amber-300">
                      {azlamResultData.name}
                    </h3>
                    <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                      {azlamResultData.element}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {azlamResultData.summary}
                  </p>

                  <div className="bg-amber-950/20 p-4 rounded-2xl border border-amber-500/20 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Proverbe & Sagesse Ancestraile
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 italic">
                      "{azlamResultData.proverb}"
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Stratégie d'Action
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {azlamResultData.strategy}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: DECISION DIAL ================= */}
        {activeTab === 'dial' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-amber-300 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-400" />
                    <span>{t.dial.title}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">{t.dial.subtitle}</p>
                </div>

                {/* Presets */}
                <select
                  value={dialPreset}
                  onChange={(e) => {
                    setDialPreset(e.target.value as any);
                    setSelectedIndex(null);
                  }}
                  className="bg-slate-950 border border-slate-800 text-amber-300 rounded-2xl px-4 py-2 text-xs font-bold focus:outline-none"
                >
                  <option value="binary">{t.dial.presets.binary}</option>
                  <option value="strategic">{t.dial.presets.strategic}</option>
                  <option value="daily">{t.dial.presets.daily}</option>
                  <option value="custom">{t.dial.presets.custom}</option>
                </select>
              </div>

              {/* Custom options builder */}
              {dialPreset === 'custom' && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    {t.common.customChoices}
                  </span>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newChoiceInput}
                      onChange={(e) => setNewChoiceInput(e.target.value)}
                      placeholder="Nouvelle option..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none"
                    />
                    <button
                      onClick={handleAddCustomChoice}
                      className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.common.addChoice}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {customChoices.map((choice, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-xs flex items-center gap-2 text-slate-200"
                      >
                        <span>{choice}</span>
                        {customChoices.length > 2 && (
                          <button
                            onClick={() => handleRemoveCustomChoice(idx)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Dial SVG Wheel */}
              <div className="relative w-full h-80 sm:h-96 flex flex-col items-center justify-center">
                {/* Pointer Arrow at top */}
                <div className="z-20 -mb-4 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400 filter drop-shadow-md" />

                {/* Rotating Wheel */}
                <motion.div
                  animate={{ rotate: dialRotation }}
                  transition={{
                    duration: isDialSpinning ? 3 : 0,
                    ease: [0.15, 0.85, 0.35, 1],
                  }}
                  className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-amber-500/50 shadow-2xl relative overflow-hidden bg-slate-950 flex items-center justify-center"
                >
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {activeDialItems.map((item, idx) => {
                      const count = activeDialItems.length;
                      const sliceAngle = 360 / count;
                      const startAngle = idx * sliceAngle;
                      const endAngle = (idx + 1) * sliceAngle;

                      // SVG Arc path calculation
                      const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                      const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                      const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                      const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                      const largeArc = sliceAngle > 180 ? 1 : 0;
                      const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;

                      const colors = [
                        '#78350f',
                        '#1e293b',
                        '#854d0e',
                        '#0f172a',
                        '#92400e',
                        '#334155',
                      ];
                      const fillColor = colors[idx % colors.length];

                      return (
                        <g key={idx}>
                          <path d={pathData} fill={fillColor} stroke="#b45309" strokeWidth="0.5" />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Central Emblem Pin */}
                  <div className="absolute w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 border-2 border-amber-200 shadow-xl flex items-center justify-center text-slate-950 font-bold text-xs">
                    <Compass className="w-6 h-6 animate-pulse" />
                  </div>
                </motion.div>
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSpinDial}
                  disabled={isDialSpinning}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl shadow-xl transition-all flex items-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
                >
                  <RotateCw className={`w-5 h-5 ${isDialSpinning ? 'animate-spin' : ''}`} />
                  <span>{t.common.spin}</span>
                </button>
              </div>

              {/* Result display */}
              {selectedIndex !== null && activeDialItems[selectedIndex] && (
                <div className="bg-slate-950 border border-amber-500/30 p-5 sm:p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                        Résultat du Cadran
                      </span>
                      <h3 className="text-xl font-black text-amber-200">
                        {activeDialItems[selectedIndex]}
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/20">
                      Choix Retenu
                    </span>
                  </div>

                  {t.dial.itemAdvice[activeDialItems[selectedIndex]] ? (
                    <div className="space-y-3">
                      <p className="text-xs sm:text-sm text-slate-300">
                        {t.dial.itemAdvice[activeDialItems[selectedIndex]].summary}
                      </p>
                      <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                          Conseil d'Action
                        </span>
                        <p className="text-xs text-slate-200">
                          {t.dial.itemAdvice[activeDialItems[selectedIndex]].recommendation}
                        </p>
                      </div>
                      <div className="bg-amber-950/20 p-3.5 rounded-2xl border border-amber-500/20 space-y-1">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                          Invocation Recommandée
                        </span>
                        <p className="text-xs text-slate-200 font-mono">
                          {t.dial.itemAdvice[activeDialItems[selectedIndex]].dhikr}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-300">
                      Le cadran a tranché en faveur de "{activeDialItems[selectedIndex]}". Procédez avec sérénité et bon sens.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TraditionalDivinationQurah;
