import React, { useState, useMemo } from 'react';
import {
  Layers,
  ArrowLeft,
  Info,
  Wand2,
  Download,
  Feather,
  Sparkles,
  ShieldCheck,
  Crown,
  Compass,
  BookOpen,
  Clock,
  Zap,
  Copy,
  Check,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Sun,
  Moon,
  Star,
  CheckCircle2,
  Calendar,
  Sliders,
  Volume2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { exportWirdToImage } from '../../../utils/wirdExporter';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import {
  extractRouhaniyyaData,
  RouhaniyyaExtractionData
} from '../../../utils/rouhaniyyaEngine';
import {
  ROUHANIYYA_TRANSLATIONS,
  RouhaniyyaTranslation
} from '../../../components/rouhaniyya/rouhaniyyaTranslations';

type ActiveTab = 'celestial' | 'terrestrial' | 'kings' | 'auxiliaries' | 'vocalization' | 'schedule';

export const RouhaniyyaExtractor: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const t: RouhaniyyaTranslation = ROUHANIYYA_TRANSLATIONS[langKey] || ROUHANIYYA_TRANSLATIONS.fr;

  // Input states
  const [inputMode, setInputMode] = useState<'text' | 'number'>('text');
  const [inputText, setInputText] = useState('يا لطيف');
  const [inputNumber, setInputNumber] = useState('129');

  // Formula settings
  const [celestialConstant, setCelestialConstant] = useState<41 | 51>(41);
  const [celestialSuffix, setCelestialSuffix] = useState<'yael' | 'ael'>('yael');

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('celestial');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Compute extraction data reactively
  const extractionData: RouhaniyyaExtractionData = useMemo(() => {
    const rawInput = inputMode === 'text' ? inputText : parseInt(inputNumber, 10) || 129;
    return extractRouhaniyyaData(rawInput, celestialConstant, celestialSuffix);
  }, [inputMode, inputText, inputNumber, celestialConstant, celestialSuffix]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const tabsConfig = [
    { id: 'celestial' as ActiveTab, label: t.tabs.celestial, icon: Sparkles, color: 'text-cyan-500' },
    { id: 'terrestrial' as ActiveTab, label: t.tabs.terrestrial, icon: ShieldCheck, color: 'text-amber-500' },
    { id: 'kings' as ActiveTab, label: t.tabs.kings, icon: Crown, color: 'text-purple-500' },
    { id: 'auxiliaries' as ActiveTab, label: t.tabs.auxiliaries, icon: Layers, color: 'text-emerald-500' },
    { id: 'vocalization' as ActiveTab, label: t.tabs.vocalization, icon: BookOpen, color: 'text-rose-500' },
    { id: 'schedule' as ActiveTab, label: t.tabs.schedule, icon: Clock, color: 'text-indigo-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-28 space-y-8 min-h-screen">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tools')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-gray-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>{t.backToTools}</span>
        </button>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-700 dark:text-fuchsia-300 text-xs font-bold shadow-sm">
          <Zap size={14} />
          <span>{t.headerBadge}</span>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-fuchsia-500/30">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Science d'Istintaq & Rouhaniyat</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-200 via-purple-300 to-amber-200">
            {t.pageTitle}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            {t.pageSubtitle}
          </p>
        </div>

        <Sparkles size={240} className="absolute -right-10 -bottom-16 text-fuchsia-500/10 pointer-events-none" />
      </div>

      {/* Information Notice */}
      <div className="bg-fuchsia-50/80 dark:bg-fuchsia-950/30 border border-fuchsia-200/80 dark:border-fuchsia-900/40 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <Info className="text-fuchsia-600 dark:text-fuchsia-400 shrink-0 mt-0.5" size={20} />
        <p className="text-xs sm:text-sm text-fuchsia-950 dark:text-fuchsia-200 font-medium leading-relaxed">
          {t.infoNotice}
        </p>
      </div>

      {/* Inputs & Parameters Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-gray-200 dark:border-slate-800 shadow-md space-y-6">
        {/* Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setInputMode('text')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                inputMode === 'text'
                  ? 'bg-fuchsia-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t.modeText}
            </button>
            <button
              onClick={() => setInputMode('number')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                inputMode === 'number'
                  ? 'bg-fuchsia-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t.modeNumber}
            </button>
          </div>

          {/* Formula Settings */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700">
              <Sliders size={14} className="text-fuchsia-500" />
              <span className="text-[11px] font-bold text-gray-700 dark:text-slate-300">{t.formulaLabel}:</span>
              <button
                onClick={() => setCelestialConstant(41)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                  celestialConstant === 41
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300'
                }`}
              >
                41
              </button>
              <button
                onClick={() => setCelestialConstant(51)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                  celestialConstant === 51
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300'
                }`}
              >
                51
              </button>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-gray-700 dark:text-slate-300">{t.suffixLabel}:</span>
              <button
                onClick={() => setCelestialSuffix('yael')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  celestialSuffix === 'yael'
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300'
                }`}
              >
                -yael
              </button>
              <button
                onClick={() => setCelestialSuffix('ael')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  celestialSuffix === 'ael'
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300'
                }`}
              >
                -ael
              </button>
            </div>
          </div>
        </div>

        {/* Input Field */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">
            {inputMode === 'text' ? t.inputLabelText : t.inputLabelNumber}
          </label>

          {inputMode === 'text' ? (
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.placeholderText}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-lg font-bold text-gray-900 dark:text-white font-arabic focus:outline-none focus:ring-2 focus:ring-fuchsia-500 shadow-inner"
              dir="rtl"
            />
          ) : (
            <input
              type="number"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              placeholder={t.placeholderNumber}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 text-xl font-bold text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-fuchsia-500 shadow-inner"
            />
          )}
        </div>

        {/* Summary Card Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/10 via-fuchsia-900/10 to-indigo-900/10 border border-purple-200/60 dark:border-purple-800/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500 dark:text-slate-400 block">
              {t.totalWeight}
            </span>
            <span className="text-2xl font-black text-fuchsia-700 dark:text-fuchsia-300 font-mono">
              {extractionData.abjadTotal}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500 dark:text-slate-400 block">
              {t.sourceText}
            </span>
            <span className="text-lg font-bold text-gray-800 dark:text-slate-200 font-arabic truncate block" dir="rtl">
              {extractionData.inputText}
            </span>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500 dark:text-slate-400 block mb-1">
              {t.elementalComposition}
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
              <div className="p-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <Flame size={12} />
                <span>{extractionData.elementalBreakdown.fire}%</span>
              </div>
              <div className="p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-1">
                <Wind size={12} />
                <span>{extractionData.elementalBreakdown.air}%</span>
              </div>
              <div className="p-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
                <Droplets size={12} />
                <span>{extractionData.elementalBreakdown.water}%</span>
              </div>
              <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                <Mountain size={12} />
                <span>{extractionData.elementalBreakdown.earth}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Info Tooltip Component */}
      <ToolInfoTooltip toolId="rouhaniyya" />

      {/* Sub-Tabs Selector Bar */}
      <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-fuchsia-600 text-white shadow-md scale-105'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon size={16} className={isSelected ? 'text-white' : tab.color} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Display Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          {/* TAB 1: MUWAKKIL 'ALAWI (ANGE CÉLESTE) */}
          {activeTab === 'celestial' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-cyan-950/40 via-purple-950/40 to-slate-900/60 rounded-3xl p-6 sm:p-8 border border-cyan-500/30 text-white shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-cyan-300 flex items-center gap-2">
                      <Sparkles size={22} className="text-cyan-400" />
                      <span>{t.celestialTitle}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.celestialSubtitle}</p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-mono font-bold">
                    {extractionData.celestial.formulaUsed}
                  </span>
                </div>

                {/* Main Name Banner */}
                <div className="bg-slate-900/80 rounded-2xl p-6 border border-cyan-500/30 text-center space-y-4">
                  <span className="text-xs uppercase tracking-widest font-bold text-cyan-400 block">
                    Ange Céleste Extrait (Muwakkil 'Alawi)
                  </span>

                  <div className="font-arabic text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-blue-200 tracking-wide" dir="rtl">
                    {extractionData.celestial.nameAr}
                  </div>

                  <div className="inline-block px-4 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-sm font-mono font-bold tracking-widest">
                    Transliteration: {extractionData.celestial.nameTrans}
                  </div>

                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={() => handleCopy(extractionData.celestial.nameAr, 'celestial')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      {copiedKey === 'celestial' ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedKey === 'celestial' ? t.copySuccess : t.copyName}</span>
                    </button>
                  </div>
                </div>

                {/* Invocation Box */}
                <div className="p-5 rounded-2xl bg-cyan-900/20 border border-cyan-500/30 space-y-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-cyan-300 block">
                    {t.celestialInvocationTitle}
                  </span>
                  <p className="font-arabic text-xl sm:text-2xl text-cyan-100 font-bold leading-relaxed" dir="rtl">
                    {extractionData.celestial.invocationAr}
                  </p>
                  <p className="text-xs font-mono text-cyan-200/80 pt-1">
                    {extractionData.celestial.invocationTrans}
                  </p>
                </div>

                {/* Attributes Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    {t.celestialAttributesTitle}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-cyan-500/20 flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                      <span>{t.celestialAttr1}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-cyan-500/20 flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                      <span>{t.celestialAttr2}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-cyan-500/20 flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                      <span>{t.celestialAttr3}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MUWAKKIL SIFLI (GARDIEN TERRESTRE) */}
          {activeTab === 'terrestrial' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-amber-950/40 via-red-950/40 to-slate-900/60 rounded-3xl p-6 sm:p-8 border border-amber-500/30 text-white shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-amber-300 flex items-center gap-2">
                      <ShieldCheck size={22} className="text-amber-400" />
                      <span>{t.terrestrialTitle}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.terrestrialSubtitle}</p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-mono font-bold">
                    {extractionData.terrestrial.formulaUsed}
                  </span>
                </div>

                {/* Main Terrestrial Name Banner */}
                <div className="bg-slate-900/80 rounded-2xl p-6 border border-amber-500/30 text-center space-y-4">
                  <span className="text-xs uppercase tracking-widest font-bold text-amber-400 block">
                    Gardien Terrestre Extrait (Muwakkil Sifli)
                  </span>

                  <div className="font-arabic text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-red-200 tracking-wide" dir="rtl">
                    {extractionData.terrestrial.nameAr}
                  </div>

                  <div className="inline-block px-4 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-sm font-mono font-bold tracking-widest">
                    Transliteration: {extractionData.terrestrial.nameTrans}
                  </div>

                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={() => handleCopy(extractionData.terrestrial.nameAr, 'terrestrial')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      {copiedKey === 'terrestrial' ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedKey === 'terrestrial' ? t.copySuccess : t.copyName}</span>
                    </button>
                  </div>
                </div>

                {/* Invocation Box */}
                <div className="p-5 rounded-2xl bg-amber-900/20 border border-amber-500/30 space-y-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-amber-300 block">
                    {t.terrestrialInvocationTitle}
                  </span>
                  <p className="font-arabic text-xl sm:text-2xl text-amber-100 font-bold leading-relaxed" dir="rtl">
                    {extractionData.terrestrial.invocationAr}
                  </p>
                  <p className="text-xs font-mono text-amber-200/80 pt-1">
                    {extractionData.terrestrial.invocationTrans}
                  </p>
                </div>

                {/* Attributes Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    {t.terrestrialAttributesTitle}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-amber-500/20 flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>{t.terrestrialAttr1}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-amber-500/20 flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>{t.terrestrialAttr2}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-amber-500/20 flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>{t.terrestrialAttr3}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MOULOUK AL-SAB'AH (ROIS DES 7 JOURS) */}
          {activeTab === 'kings' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-950/40 via-indigo-950/40 to-slate-900/60 rounded-3xl p-6 sm:p-8 border border-purple-500/30 text-white shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-purple-300 flex items-center gap-2">
                      <Crown size={22} className="text-purple-400" />
                      <span>{t.kingsTitle}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.kingsSubtitle}</p>
                  </div>

                  <span className="px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-xs font-mono font-bold">
                    {extractionData.abjadTotal} mod 7 = {extractionData.king.dayIndex}
                  </span>
                </div>

                {/* King Display Card */}
                <div className="bg-slate-900/80 rounded-3xl p-6 border border-purple-500/30 space-y-6">
                  <div className="text-center space-y-2">
                    <span className="text-xs uppercase tracking-widest font-bold text-purple-400 block">
                      Roi Spirituel de la Semaine
                    </span>
                    <h3 className="font-arabic text-3xl sm:text-5xl font-black text-purple-200" dir="rtl">
                      {extractionData.king.kingNameAr}
                    </h3>
                    <p className="text-sm font-mono text-purple-300 font-bold">
                      {extractionData.king.kingNameTrans}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-purple-900/20 border border-purple-500/20 space-y-1">
                      <span className="text-[11px] font-bold text-purple-400 block uppercase">
                        {t.rulingAngel}
                      </span>
                      <span className="font-arabic text-lg font-bold text-white block" dir="rtl">
                        {extractionData.king.angelNameAr}
                      </span>
                      <span className="text-slate-300 font-mono">{extractionData.king.angelNameTrans}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-900/20 border border-purple-500/20 space-y-1">
                      <span className="text-[11px] font-bold text-purple-400 block uppercase">
                        {t.governingPlanet}
                      </span>
                      <span className="font-arabic text-lg font-bold text-white block" dir="rtl">
                        {extractionData.king.planetNameAr}
                      </span>
                      <span className="text-slate-300 font-mono">{extractionData.king.planetNameTrans}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-900/20 border border-purple-500/20 space-y-1">
                      <span className="text-[11px] font-bold text-purple-400 block uppercase">
                        {t.sacredDay}
                      </span>
                      <span className="font-arabic text-lg font-bold text-white block" dir="rtl">
                        {extractionData.king.dayNameAr}
                      </span>
                      <span className="text-slate-300 font-mono">{extractionData.king.dayNameTrans}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-900/20 border border-purple-500/20 space-y-1">
                      <span className="text-[11px] font-bold text-purple-400 block uppercase">
                        {t.element}
                      </span>
                      <span className="font-arabic text-base font-bold text-white block" dir="rtl">
                        {extractionData.king.elementAr}
                      </span>
                      <span className="text-slate-300 font-mono">{extractionData.king.elementTrans}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-900/20 border border-purple-500/20 space-y-1 lg:col-span-2">
                      <span className="text-[11px] font-bold text-purple-400 block uppercase">
                        {t.sacredIncense}
                      </span>
                      <span className="font-arabic text-base font-bold text-white block" dir="rtl">
                        {extractionData.king.incenseAr}
                      </span>
                      <span className="text-slate-300 font-mono">{extractionData.king.incenseTrans}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: A'WAN (AUXILIAIRES) */}
          {activeTab === 'auxiliaries' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-950/40 via-teal-950/40 to-slate-900/60 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 text-white shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-emerald-300 flex items-center gap-2">
                      <Layers size={22} className="text-emerald-400" />
                      <span>{t.auxiliariesTitle}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.auxiliariesSubtitle}</p>
                  </div>
                </div>

                {/* Auxiliaries Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {extractionData.auxiliaries.map((aux, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                          {aux.levelKey === 'units' && t.unitServant}
                          {aux.levelKey === 'tens' && t.tenServant}
                          {aux.levelKey === 'hundreds' && t.hundredServant}
                          {aux.levelKey === 'thousands' && t.thousandServant}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                          {aux.levelValue}
                        </span>
                      </div>

                      <div className="text-center space-y-1">
                        <span className="font-arabic text-3xl font-bold text-white block" dir="rtl">
                          {aux.nameAr}
                        </span>
                        <span className="text-xs font-mono text-emerald-300 font-bold block">
                          {aux.nameTrans}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                        <span className="font-bold text-emerald-400 block">{aux.roleTrans}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DABT AL-ASMA (VOCALISATION) */}
          {activeTab === 'vocalization' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-rose-950/40 via-purple-950/40 to-slate-900/60 rounded-3xl p-6 sm:p-8 border border-rose-500/30 text-white shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-rose-300 flex items-center gap-2">
                      <BookOpen size={22} className="text-rose-400" />
                      <span>{t.vocalizationTitle}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.vocalizationSubtitle}</p>
                  </div>
                </div>

                {/* Vocalizations List */}
                <div className="space-y-4">
                  {extractionData.vocalizations.map((voc, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                          {voc.schemeNameTrans}
                        </span>
                        <Volume2 size={16} className="text-rose-400" />
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="space-y-1 text-center sm:text-left">
                          <span className="font-arabic text-2xl font-black text-rose-100 block" dir="rtl">
                            {voc.vocalizedNameAr}
                          </span>
                          <span className="text-xs font-mono text-rose-300 font-bold block">
                            {voc.vocalizedNameTrans}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 max-w-md">
                          {voc.schemeKey === 'faail' && t.vocalFaailDesc}
                          {voc.schemeKey === 'failush' && t.vocalFailushDesc}
                          {voc.schemeKey === 'mafulash' && t.vocalMafulashDesc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CALENDRIER DE CONNEXION */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-950/40 via-purple-950/40 to-slate-900/60 rounded-3xl p-6 sm:p-8 border border-indigo-500/30 text-white shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-indigo-300 flex items-center gap-2">
                      <Clock size={22} className="text-indigo-400" />
                      <span>{t.scheduleTitle}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.scheduleSubtitle}</p>
                  </div>

                  {extractionData.schedule.isCurrentlyAligned ? (
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                      <CheckCircle2 size={14} />
                      <span>{t.alignmentActive}</span>
                    </span>
                  ) : (
                    <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-xs font-bold">
                      {t.alignmentInactive} {extractionData.schedule.bestDayTrans}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-2">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase block">
                      {t.repetitionCount}
                    </span>
                    <div className="text-2xl font-black font-mono text-indigo-200">
                      {extractionData.schedule.zikrCount} fois
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {t.fullZimām} ({extractionData.abjadTotal}) • {t.reducedAsl}: {extractionData.schedule.reducedCount}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-2">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase block">
                      {t.sacredDay} & Planète
                    </span>
                    <div className="font-arabic text-lg font-bold text-white" dir="rtl">
                      {extractionData.schedule.bestDayAr} — {extractionData.schedule.bestPlanetAr}
                    </div>
                    <p className="text-slate-300 font-mono">
                      {extractionData.schedule.bestDayTrans}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-2">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase block">
                      {t.sacredIncense}
                    </span>
                    <div className="font-arabic text-base font-bold text-white" dir="rtl">
                      {extractionData.schedule.incenseAr}
                    </div>
                    <p className="text-slate-300 font-mono">
                      {extractionData.schedule.incenseTrans}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-2 sm:col-span-2 lg:col-span-3">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase block">
                      {t.bestTiming}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {extractionData.schedule.optimalHours.map((hr, i) => (
                        <div key={i} className="p-3 rounded-xl bg-indigo-950/50 border border-indigo-500/20 text-slate-200 flex items-center gap-2">
                          <Sun size={14} className="text-amber-400 shrink-0" />
                          <span>{hr}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Export Options Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            Exporter l'Extraction Rouhaniyya Completes
          </h4>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Téléchargez les noms sacrés sous forme de carte high-res PNG Deluxe ou Parchemin
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => exportWirdToImage({
              arabicZikr: `${extractionData.celestial.nameAr} • ${extractionData.terrestrial.nameAr}`,
              transliteration: `Malaikah: ${extractionData.celestial.nameTrans} | Ardi: ${extractionData.terrestrial.nameTrans}`,
              abjadWeight: extractionData.abjadTotal,
              title: `EXTRACTION ROUHANIYYA (${extractionData.inputText})`,
              meaningFr: `Ange Céleste: ${extractionData.celestial.nameAr} — Gardien Terrestre: ${extractionData.terrestrial.nameAr} — Roi: ${extractionData.king.kingNameAr}`,
              isParchment: false,
              lang: langKey,
            })}
            className="flex-1 sm:flex-none py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Download size={15} className="text-cyan-400" />
            <span>{t.exportPng}</span>
          </button>

          <button
            onClick={() => exportWirdToImage({
              arabicZikr: `${extractionData.celestial.nameAr} • ${extractionData.terrestrial.nameAr}`,
              transliteration: `Malaikah: ${extractionData.celestial.nameTrans} | Ardi: ${extractionData.terrestrial.nameTrans}`,
              abjadWeight: extractionData.abjadTotal,
              title: `PARCHEMIN ROUHANIYYA (${extractionData.inputText})`,
              meaningFr: `Ange Céleste: ${extractionData.celestial.nameAr} — Gardien Terrestre: ${extractionData.terrestrial.nameAr} — Roi: ${extractionData.king.kingNameAr}`,
              isParchment: true,
              lang: langKey,
            })}
            className="flex-1 sm:flex-none py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Feather size={15} />
            <span>{t.exportParchment}</span>
          </button>
        </div>
      </div>

      {/* Sacred Principle Notice Footer */}
      <div className="p-5 rounded-2xl bg-fuchsia-50/80 dark:bg-fuchsia-950/20 border border-fuchsia-200/80 dark:border-fuchsia-900/40 space-y-2">
        <div className="flex items-center gap-2 text-fuchsia-900 dark:text-fuchsia-300 font-bold text-xs uppercase tracking-wider">
          <Info size={16} />
          <span>{t.noticeFooterTitle}</span>
        </div>
        <p className="text-xs text-fuchsia-800 dark:text-fuchsia-200/90 leading-relaxed">
          {t.noticeFooterText}
        </p>
      </div>
    </div>
  );
};

export default RouhaniyyaExtractor;
