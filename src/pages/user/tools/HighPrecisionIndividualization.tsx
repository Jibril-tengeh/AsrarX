import React, { useState, useMemo } from 'react';
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
  Sliders,
  Scale,
  Sun,
  Clock,
  Shield,
  Activity,
  Key,
  Star,
  Flame,
  Droplets,
  Wind,
  Mountain,
  CheckCircle2,
  BookOpen,
  Eye,
  Grid,
  Layers,
  Award,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { exportWirdToImage } from '../../../utils/wirdExporter';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import {
  generateShifrTali,
  calculateMizanKabeer,
  generateKhatimDhahabi,
  calculateJafrHawadith,
  calculateMizanRuh,
  calculateIsmMurakkab,
  calculateTlasimLayl,
  calculateMizanIjabah,
  calculateKhatamKhass,
  calculateSaatFath,
  generateKhattMiyah,
  calculateTafdeelKabir,
} from '../../../utils/highPrecisionEngine';
import {
  HIGH_PRECISION_TRANSLATIONS,
  HighPrecisionTranslation,
} from '../../../components/highPrecision/highPrecisionTranslations';

type ModuleTab =
  | 'shifrTali'
  | 'mizanKabeer'
  | 'khatimDhahabi'
  | 'jafrHawadith'
  | 'mizanRuh'
  | 'ismMurakkab'
  | 'tlasimLayl'
  | 'mizanIjabah'
  | 'khatamKhass'
  | 'saatFath'
  | 'khattMiyah'
  | 'tafdeelKabir';

export const HighPrecisionIndividualization: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const t: HighPrecisionTranslation = HIGH_PRECISION_TRANSLATIONS[langKey] || HIGH_PRECISION_TRANSLATIONS.fr;

  // Active Tab
  const [activeTab, setActiveTab] = useState<ModuleTab>('shifrTali');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Common User Inputs
  const [inputText, setInputText] = useState('يا لطيف يا رزاق');
  const [personName, setPersonName] = useState('موسى');
  const [motherName, setMotherName] = useState('مريم');
  const [zodiacIndex, setZodiacIndex] = useState<number>(0); // Aries by default
  const [targetNumber, setTargetNumber] = useState<string>('313');
  const [birthHour, setBirthHour] = useState<number>(12);

  // Divine names list for Ism al-Murakkab
  const [divineNamesList, setDivineNamesList] = useState<string[]>(['يا الله', 'يا لطيف', 'يا رزاق', 'يا فتاح']);
  const [newDivineName, setNewDivineName] = useState<string>('');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddDivineName = () => {
    if (newDivineName.trim()) {
      setDivineNamesList([...divineNamesList, newDivineName.trim()]);
      setNewDivineName('');
    }
  };

  // Calculations Memoization
  const shifrData = useMemo(() => generateShifrTali(inputText, zodiacIndex), [inputText, zodiacIndex]);
  const mizanKabeerData = useMemo(() => calculateMizanKabeer(inputText), [inputText]);
  const khatimDhahabiData = useMemo(() => generateKhatimDhahabi(parseInt(targetNumber, 10) || 313), [targetNumber]);
  const jafrData = useMemo(() => calculateJafrHawadith(inputText), [inputText]);
  const mizanRuhData = useMemo(() => calculateMizanRuh(personName, motherName), [personName, motherName]);
  const ismMurakkabData = useMemo(() => calculateIsmMurakkab(divineNamesList), [divineNamesList]);
  const tlasimLaylData = useMemo(() => calculateTlasimLayl(inputText), [inputText]);
  const mizanIjabahData = useMemo(() => calculateMizanIjabah(inputText), [inputText]);
  const khatamKhassData = useMemo(() => calculateKhatamKhass(inputText), [inputText]);
  const saatFathData = useMemo(() => calculateSaatFath(inputText, birthHour), [inputText, birthHour]);
  const khattMiyahData = useMemo(() => generateKhattMiyah(inputText), [inputText]);
  const tafdeelKabirData = useMemo(() => calculateTafdeelKabir(parseInt(targetNumber, 10) || 313, 3), [targetNumber]);

  const tabsConfig = [
    { id: 'shifrTali' as ModuleTab, label: t.tabs.shifrTali, icon: Key, color: 'text-amber-500' },
    { id: 'mizanKabeer' as ModuleTab, label: t.tabs.mizanKabeer, icon: Scale, color: 'text-purple-500' },
    { id: 'khatimDhahabi' as ModuleTab, label: t.tabs.khatimDhahabi, icon: Sun, color: 'text-yellow-500' },
    { id: 'jafrHawadith' as ModuleTab, label: t.tabs.jafrHawadith, icon: Compass, color: 'text-cyan-500' },
    { id: 'mizanRuh' as ModuleTab, label: t.tabs.mizanRuh, icon: Activity, color: 'text-emerald-500' },
    { id: 'ismMurakkab' as ModuleTab, label: t.tabs.ismMurakkab, icon: Sparkles, color: 'text-fuchsia-500' },
    { id: 'tlasimLayl' as ModuleTab, label: t.tabs.tlasimLayl, icon: Shield, color: 'text-indigo-500' },
    { id: 'mizanIjabah' as ModuleTab, label: t.tabs.mizanIjabah, icon: Zap, color: 'text-rose-500' },
    { id: 'khatamKhass' as ModuleTab, label: t.tabs.khatamKhass, icon: Star, color: 'text-amber-400' },
    { id: 'saatFath' as ModuleTab, label: t.tabs.saatFath, icon: Clock, color: 'text-blue-500' },
    { id: 'khattMiyah' as ModuleTab, label: t.tabs.khattMiyah, icon: Droplets, color: 'text-teal-400' },
    { id: 'tafdeelKabir' as ModuleTab, label: t.tabs.tafdeelKabir, icon: Grid, color: 'text-orange-500' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-6 lg:p-8 safe-area-pt pb-28 space-y-6 sm:space-y-8 min-h-screen overflow-x-hidden">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tools')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-gray-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>{t.backToTools}</span>
        </button>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold shadow-sm">
          <Award size={14} />
          <span>{t.headerBadge}</span>
        </div>
      </div>

      {/* Main Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-amber-950 to-purple-950 p-5 sm:p-8 text-white shadow-2xl border border-amber-500/30 min-w-0">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sliders size={14} />
            <span>Harmonisation Individuelle Millimétrée</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-rose-200">
            {t.pageTitle}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            {t.pageSubtitle}
          </p>
        </div>

        <Scale size={240} className="absolute -right-10 -bottom-16 text-amber-500/10 pointer-events-none" />
      </div>

      {/* Info Notice */}
      <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <Info className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={20} />
        <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 font-medium leading-relaxed">
          {t.infoNotice}
        </p>
      </div>

      {/* Shared Inputs Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-7 border border-gray-200 dark:border-slate-800 shadow-md space-y-5 max-w-full overflow-hidden">
        <h3 className="text-sm font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <Sliders size={16} />
          <span>Paramètres d'Individualisation</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Main Verse / Text */}
          <div className="space-y-1 sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
              {t.labels.inputText}
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 text-base font-bold text-gray-900 dark:text-white font-arabic focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
              dir="rtl"
            />
          </div>

          {/* Target Abjad Weight */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
              {t.labels.targetNumber}
            </label>
            <input
              type="number"
              value={targetNumber}
              onChange={(e) => setTargetNumber(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 text-base font-bold text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
            />
          </div>

          {/* User Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
              {t.labels.inputName}
            </label>
            <input
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 text-sm font-bold text-gray-900 dark:text-white font-arabic focus:outline-none focus:ring-2 focus:ring-amber-500"
              dir="rtl"
            />
          </div>

          {/* Mother Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
              {t.labels.motherName}
            </label>
            <input
              type="text"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 text-sm font-bold text-gray-900 dark:text-white font-arabic focus:outline-none focus:ring-2 focus:ring-amber-500"
              dir="rtl"
            />
          </div>

          {/* Zodiac Ascendant Selector */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
              {t.labels.zodiacAscendant}
            </label>
            <select
              value={zodiacIndex}
              onChange={(e) => setZodiacIndex(parseInt(e.target.value, 10))}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value={0}>Bélier / الحمل (Mars - Feu)</option>
              <option value={1}>Taureau / الثور (Vénus - Terre)</option>
              <option value={2}>Gémeaux / الجوزاء (Mercure - Air)</option>
              <option value={3}>Cancer / السرطان (Lune - Eau)</option>
              <option value={4}>Lion / الأسد (Soleil - Feu)</option>
              <option value={5}>Vierge / العذراء (Mercure - Terre)</option>
              <option value={6}>Balance / الميزان (Vénus - Air)</option>
              <option value={7}>Scorpion / العقرب (Mars - Eau)</option>
              <option value={8}>Sagittaire / القوس (Jupiter - Feu)</option>
              <option value={9}>Capricorne / الجدي (Saturne - Terre)</option>
              <option value={10}>Verseau / الدلو (Saturne - Air)</option>
              <option value={11}>Poissons / الحوت (Jupiter - Eau)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tool Info Tooltip Component */}
      <ToolInfoTooltip toolId="high-precision-individualization" />

      {/* Modules Selector Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 scrollbar-none p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm min-w-0">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-md scale-105'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon size={15} className={isSelected ? 'text-white' : tab.color} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Module Content View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-full min-w-0 overflow-hidden"
        >
          {/* MODULE 1: SHIFR AL-TALI' */}
          {activeTab === 'shifrTali' && (
            <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-purple-950/40 rounded-3xl p-4 sm:p-8 border border-amber-500/30 text-white shadow-xl space-y-6 max-w-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-amber-300 flex items-center gap-2">
                    <Key size={22} className="text-amber-400" />
                    <span>{t.shifrTaliSection.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.shifrTaliSection.subtitle}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold">
                  {shifrData.ascendantSign} • {shifrData.rulingPlanet}
                </span>
              </div>

              <div className="bg-slate-900/80 rounded-2xl p-6 border border-amber-500/30 space-y-3">
                <span className="text-xs uppercase tracking-widest font-bold text-amber-400 block">
                  {t.shifrTaliSection.encodedResult}
                </span>
                <div className="text-xl sm:text-3xl font-black text-amber-200 font-arabic leading-relaxed break-words" dir="rtl">
                  {shifrData.encodedString}
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleCopy(shifrData.encodedString, 'shifr')}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    {copiedKey === 'shifr' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedKey === 'shifr' ? t.labels.copied : t.labels.copy}</span>
                  </button>
                </div>
              </div>

              {/* Cipher Mapping Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  {t.shifrTaliSection.cipherTable}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                  {shifrData.cipherMap.map((item, idx) => (
                    <div key={idx} className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/60 border border-amber-500/20 text-center space-y-1 min-w-0 overflow-hidden">
                      <span className="text-xs text-slate-400 block">{t.shifrTaliSection.originalChar}: <strong className="text-white font-arabic">{item.original}</strong></span>
                      <div className="text-xl font-bold text-amber-300 font-arabic">{item.cipherLetter}</div>
                      <span className="text-[10px] text-amber-400/80 font-mono block">{item.symbol} ({item.numericValue})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: MIZAN AL-KABEER */}
          {activeTab === 'mizanKabeer' && (
            <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 rounded-3xl p-4 sm:p-8 border border-purple-500/30 text-white shadow-xl space-y-6 max-w-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-purple-300 flex items-center gap-2">
                    <Scale size={22} className="text-purple-400" />
                    <span>{t.mizanKabeerSection.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.mizanKabeerSection.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-purple-400 uppercase block">{t.mizanKabeerSection.totalStandard}</span>
                  <div className="text-3xl font-black font-mono text-purple-200">{mizanKabeerData.totalStandardAbjad}</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-purple-400 uppercase block">{t.mizanKabeerSection.totalBalanced}</span>
                  <div className="text-3xl font-black font-mono text-amber-300">{mizanKabeerData.totalPlanetaryBalanced}</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-purple-400 uppercase block">{t.mizanKabeerSection.harmonyScore}</span>
                  <div className="text-3xl font-black font-mono text-emerald-400">{mizanKabeerData.balanceHarmonyScore}%</div>
                </div>
              </div>

              {/* Letter details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">{t.mizanKabeerSection.breakdownTable}</h4>
                <div className="overflow-x-auto max-w-full rounded-2xl border border-purple-500/20">
                  <table className="w-full min-w-[480px] text-left text-xs">
                    <thead className="bg-purple-950/60 text-purple-200 text-[11px] uppercase">
                      <tr>
                        <th className="p-3">{t.mizanKabeerSection.letter}</th>
                        <th className="p-3">{t.mizanKabeerSection.standardVal}</th>
                        <th className="p-3">{t.mizanKabeerSection.planet}</th>
                        <th className="p-3">{t.mizanKabeerSection.rank}</th>
                        <th className="p-3">{t.mizanKabeerSection.weightedVal}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-900/30 bg-slate-900/60 text-slate-200">
                      {mizanKabeerData.letterDetails.map((item, idx) => (
                        <tr key={idx} className="hover:bg-purple-900/20">
                          <td className="p-3 font-arabic text-lg font-bold text-white">{item.letter}</td>
                          <td className="p-3 font-mono">{item.standardValue}</td>
                          <td className="p-3">{item.planetName}</td>
                          <td className="p-3 font-mono text-purple-300">x{item.planetRank}</td>
                          <td className="p-3 font-mono font-bold text-amber-300">{item.balancedValue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 3: KHATIM AL-DHAHABI */}
          {activeTab === 'khatimDhahabi' && (
            <div className="bg-gradient-to-br from-yellow-950/40 via-slate-900 to-amber-950/40 rounded-3xl p-4 sm:p-8 border border-yellow-500/30 text-white shadow-xl space-y-6 max-w-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-yellow-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-yellow-300 flex items-center gap-2">
                    <Sun size={22} className="text-yellow-400" />
                    <span>{t.khatimDhahabiSection.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.khatimDhahabiSection.subtitle}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/40 text-yellow-200 text-xs font-bold">
                  {langKey === 'fr' && khatimDhahabiData.solarTransitStatusFr}
                  {langKey === 'en' && khatimDhahabiData.solarTransitStatusEn}
                  {langKey === 'ha' && khatimDhahabiData.solarTransitStatusHa}
                </span>
              </div>

              <div className="text-center space-y-2">
                <span className="text-xs uppercase tracking-widest font-bold text-yellow-400 block">
                  {t.khatimDhahabiSection.magicConstant}: {khatimDhahabiData.magicConstant}
                </span>
              </div>

              {/* 6x6 Grid Display */}
              <div className="flex justify-center p-1 sm:p-4 max-w-full overflow-x-auto">
                <div className="grid grid-cols-6 gap-1 sm:gap-2 bg-slate-900/90 p-2 sm:p-4 rounded-2xl sm:rounded-3xl border border-yellow-500/40 shadow-2xl max-w-md w-full min-w-0">
                  {khatimDhahabiData.grid.map((row, r) =>
                    row.map((cellVal, c) => (
                      <div
                        key={`${r}-${c}`}
                        className="aspect-square flex items-center justify-center rounded-lg sm:rounded-xl bg-yellow-950/40 border border-yellow-500/30 text-yellow-200 font-mono text-[10px] min-[400px]:text-xs sm:text-base font-bold shadow-inner p-0.5 sm:p-1 truncate"
                      >
                        {cellVal}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 4: JAFR AL-HAWADITH */}
          {activeTab === 'jafrHawadith' && (
            <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/40 rounded-3xl p-4 sm:p-8 border border-cyan-500/30 text-white shadow-xl space-y-6 max-w-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-cyan-300 flex items-center gap-2">
                    <Compass size={22} className="text-cyan-400" />
                    <span>{t.jafrHawadithSection.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.jafrHawadithSection.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase block">{t.jafrHawadithSection.weight}</span>
                  <div className="text-3xl font-black font-mono text-cyan-200">{jafrData.eventWeight}</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase block">{t.jafrHawadithSection.cycleYear}</span>
                  <div className="text-3xl font-black font-mono text-amber-300">{jafrData.historicalCycleYear}</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase block">{t.jafrHawadithSection.impactScore}</span>
                  <div className="text-3xl font-black font-mono text-emerald-400">{jafrData.impactScore}/100</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-cyan-900/20 border border-cyan-500/30 space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-cyan-300 block">
                  {langKey === 'fr' && jafrData.conjunctionTypeFr}
                  {langKey === 'en' && jafrData.conjunctionTypeEn}
                  {langKey === 'ha' && jafrData.conjunctionTypeHa}
                </span>
                <p className="text-sm text-cyan-100 leading-relaxed">
                  {langKey === 'fr' && jafrData.cycleDescriptionFr}
                  {langKey === 'en' && jafrData.cycleDescriptionEn}
                  {langKey === 'ha' && jafrData.cycleDescriptionHa}
                </p>
                <div className="pt-2 font-arabic text-lg font-bold text-amber-200" dir="rtl">
                  {jafrData.propheticOutlook}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 5: MIZAN AL-RUH */}
          {activeTab === 'mizanRuh' && (
            <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-teal-950/40 rounded-3xl p-4 sm:p-8 border border-emerald-500/30 text-white shadow-xl space-y-6 max-w-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-emerald-300 flex items-center gap-2">
                    <Activity size={22} className="text-emerald-400" />
                    <span>{t.mizanRuhSection.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.mizanRuhSection.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase block">{t.mizanRuhSection.vitalityIndex}</span>
                  <div className="text-3xl font-black font-mono text-emerald-300">{mizanRuhData.vitalityIndex}%</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase block">{t.mizanRuhSection.resilienceLevel}</span>
                  <div className="text-sm font-bold text-white">
                    {langKey === 'fr' && mizanRuhData.resilienceLevelFr}
                    {langKey === 'en' && mizanRuhData.resilienceLevelEn}
                    {langKey === 'ha' && mizanRuhData.resilienceLevelHa}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase block">{t.mizanRuhSection.rulingPlanet}</span>
                  <div className="text-lg font-bold text-amber-300">
                    {langKey === 'fr' && mizanRuhData.rulingPlanetFr}
                    {langKey === 'en' && mizanRuhData.rulingPlanetEn}
                    {langKey === 'ha' && mizanRuhData.rulingPlanetHa}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase block">{t.mizanRuhSection.recommendedDhikr}</span>
                  <div className="font-arabic text-lg font-bold text-emerald-200" dir="rtl">{mizanRuhData.recommendedDhikr}</div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 6: ISM AL-MURAKKAB */}
          {activeTab === 'ismMurakkab' && (
            <div className="bg-gradient-to-br from-fuchsia-950/40 via-slate-900 to-purple-950/40 rounded-3xl p-4 sm:p-8 border border-fuchsia-500/30 text-white shadow-xl space-y-6 max-w-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-fuchsia-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-fuchsia-300 flex items-center gap-2">
                    <Sparkles size={22} className="text-fuchsia-400" />
                    <span>{t.ismMurakkabSection.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.ismMurakkabSection.subtitle}</p>
                </div>
              </div>

              {/* Add divine names */}
              <div className="space-y-3 bg-slate-900/80 p-5 rounded-2xl border border-fuchsia-500/20">
                <label className="block text-xs font-bold text-fuchsia-300">{t.labels.divineNamesList}</label>
                <div className="flex flex-wrap gap-2">
                  {divineNamesList.map((name, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-200 font-arabic text-sm font-bold flex items-center gap-1.5">
                      {name}
                      <button
                        onClick={() => setDivineNamesList(divineNamesList.filter((_, i) => i !== idx))}
                        className="text-fuchsia-400 hover:text-white ml-1 text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="يا رحمن"
                    value={newDivineName}
                    onChange={(e) => setNewDivineName(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-arabic text-white"
                    dir="rtl"
                  />
                  <button
                    onClick={handleAddDivineName}
                    className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {t.labels.addDivineName}
                  </button>
                </div>
              </div>

              {/* Acronym Result */}
              <div className="bg-slate-900/90 p-4 sm:p-6 rounded-2xl border border-fuchsia-500/40 text-center space-y-3">
                <span className="text-xs uppercase tracking-widest font-bold text-fuchsia-400 block">{t.ismMurakkabSection.acronymAr}</span>
                <div className="font-arabic text-2xl sm:text-4xl md:text-6xl font-black text-fuchsia-200 break-words" dir="rtl">
                  {ismMurakkabData.condensedAcronymAr}
                </div>
                <div className="text-xs font-mono text-slate-300 flex flex-wrap justify-center items-center gap-1.5 break-words">
                  <span>{t.ismMurakkabSection.totalAbjad}: <strong className="text-amber-300">{ismMurakkabData.totalCombinedAbjad}</strong></span>
                  <span>|</span>
                  <span>{t.ismMurakkabSection.guardian}: <strong className="text-cyan-300 font-arabic">{ismMurakkabData.guardianNameAr}</strong></span>
                </div>
                <p className="text-xs text-fuchsia-300 font-arabic pt-2 break-words" dir="rtl">{ismMurakkabData.talsamFormula}</p>
              </div>
            </div>
          )}

          {/* MODULE 7: TLASIM AL-LAYL */}
          {activeTab === 'tlasimLayl' && (
            <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/40 rounded-3xl p-4 sm:p-8 border border-indigo-500/30 text-white shadow-xl space-y-6 max-w-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-indigo-300 flex items-center gap-2">
                    <Shield size={22} className="text-indigo-400" />
                    <span>{t.tlasimLaylSection.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.tlasimLaylSection.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-indigo-500/30">
                  <span className="text-xs uppercase tracking-widest font-bold text-indigo-400 block">{t.tlasimLaylSection.nocturnalShield}</span>
                  <div className="font-arabic text-xl sm:text-2xl font-black text-indigo-200 break-words" dir="rtl">{tlasimLaylData.shieldKeyAr}</div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {tlasimLaylData.protectiveGrid.map((row, r) =>
                      row.map((val, c) => (
                        <div key={`${r}-${c}`} className="p-3 text-center bg-indigo-950/50 border border-indigo-500/20 rounded-xl font-arabic font-bold text-indigo-200 text-sm">
                          {val}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-3 bg-slate-900/80 p-5 rounded-2xl border border-indigo-500/30">
                  <span className="text-xs uppercase tracking-widest font-bold text-indigo-400 block">{t.tlasimLaylSection.nightSchedule}</span>
                  <ul className="space-y-2 text-xs text-slate-200">
                    {(langKey === 'fr' ? tlasimLaylData.targetHoursFr : langKey === 'ha' ? tlasimLaylData.targetHoursHa : tlasimLaylData.targetHoursEn).map((hr, idx) => (
                      <li key={idx} className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center gap-2">
                        <Clock size={14} className="text-indigo-400 shrink-0" />
                        <span>{hr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 8: MIZAN AL-IJABAH */}
          {activeTab === 'mizanIjabah' && (
            <div className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-amber-950/40 rounded-3xl p-4 sm:p-8 border border-rose-500/30 text-white shadow-xl space-y-6 max-w-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-rose-300 flex items-center gap-2">
                    <Zap size={22} className="text-rose-400" />
                    <span>{t.mizanIjabahSection.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.mizanIjabahSection.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-rose-400 uppercase block">{t.mizanIjabahSection.promptitudeScore}</span>
                  <div className="text-3xl font-black font-mono text-rose-300">{mizanIjabahData.promptitudeScore}%</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-rose-400 uppercase block">{t.mizanIjabahSection.activeElements}</span>
                  <div className="text-3xl font-black font-mono text-amber-300">{mizanIjabahData.activePercentage}%</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-rose-400 uppercase block">{t.mizanIjabahSection.passiveElements}</span>
                  <div className="text-3xl font-black font-mono text-blue-300">{mizanIjabahData.passivePercentage}%</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-rose-900/20 border border-rose-500/30 space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-rose-300 block">
                  {t.mizanIjabahSection.status}: {langKey === 'fr' ? mizanIjabahData.statusSpeedFr : langKey === 'ha' ? mizanIjabahData.statusSpeedHa : mizanIjabahData.statusSpeedEn}
                </span>
                <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
                  {langKey === 'fr' && mizanIjabahData.recommendationFr}
                  {langKey === 'en' && mizanIjabahData.recommendationEn}
                  {langKey === 'ha' && mizanIjabahData.recommendationHa}
                </p>
              </div>
            </div>
          )}

          {/* MODULE 9: KHATAM AL-KHASS */}
          {activeTab === 'khatamKhass' && (
            <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-yellow-950/40 rounded-3xl p-4 sm:p-8 border border-amber-500/30 text-white shadow-xl space-y-6 max-w-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-amber-300 flex items-center gap-2">
                    <Star size={22} className="text-amber-400" />
                    <span>{t.khatamKhassSection.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.khatamKhassSection.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {khatamKhassData.starPoints.map((pt) => (
                  <div key={pt.position} className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 text-center space-y-1">
                    <span className="text-[10px] text-amber-400/80 font-mono block">Point #{pt.position}</span>
                    <div className="font-arabic text-3xl font-black text-amber-200">{pt.consonantAr}</div>
                    <span className="text-[11px] text-slate-300 block font-arabic">{pt.virtueAr}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 10: SA'AT AL-FATH */}
          {activeTab === 'saatFath' && (
            <div className="bg-gradient-to-br from-blue-950/40 via-slate-900 to-cyan-950/40 rounded-3xl p-4 sm:p-8 border border-blue-500/30 text-white shadow-xl space-y-6 max-w-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-blue-300 flex items-center gap-2">
                    <Clock size={22} className="text-blue-400" />
                    <span>{t.saatFathSection.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.saatFathSection.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-blue-400 uppercase block">{t.saatFathSection.exactTime}</span>
                  <div className="text-4xl font-black font-mono text-blue-200">{saatFathData.exactTime}</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-blue-400 uppercase block">{t.saatFathSection.alignmentScore}</span>
                  <div className="text-4xl font-black font-mono text-emerald-400">{saatFathData.alignmentScore}%</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-blue-900/20 border border-blue-500/30 space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-blue-300 block">
                  {langKey === 'fr' && saatFathData.skyConditionFr}
                  {langKey === 'en' && saatFathData.skyConditionEn}
                  {langKey === 'ha' && saatFathData.skyConditionHa}
                </span>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  {langKey === 'fr' && saatFathData.recommendedActionFr}
                  {langKey === 'en' && saatFathData.recommendedActionEn}
                  {langKey === 'ha' && saatFathData.recommendedActionHa}
                </p>
              </div>
            </div>
          )}

          {/* MODULE 11: KHATT AL-MIYAH */}
          {activeTab === 'khattMiyah' && (
            <div className="bg-gradient-to-br from-teal-950/40 via-slate-900 to-blue-950/40 rounded-3xl p-4 sm:p-8 border border-teal-500/30 text-white shadow-xl space-y-6 max-w-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-teal-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-teal-300 flex items-center gap-2">
                    <Droplets size={22} className="text-teal-400" />
                    <span>{t.khattMiyahSection.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.khattMiyahSection.subtitle}</p>
                </div>
              </div>

              <div className="bg-slate-900/90 p-4 sm:p-6 rounded-2xl border border-teal-500/30 text-center space-y-3">
                <span className="text-xs uppercase tracking-widest font-bold text-teal-400 block">{t.khattMiyahSection.waterScript}</span>
                <div className="text-lg sm:text-3xl md:text-5xl font-mono tracking-normal sm:tracking-widest text-teal-200 break-all">
                  {khattMiyahData.curvilinearWaterScript}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-teal-900/20 border border-teal-500/30 space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-teal-300 block">{t.khattMiyahSection.washingInstructions}</span>
                <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
                  {langKey === 'fr' && khattMiyahData.washingUsageFr}
                  {langKey === 'en' && khattMiyahData.washingUsageEn}
                  {langKey === 'ha' && khattMiyahData.washingUsageHa}
                </p>
              </div>
            </div>
          )}

          {/* MODULE 12: AL-TAFDEEL AL-KABIR */}
          {activeTab === 'tafdeelKabir' && (
            <div className="bg-gradient-to-br from-orange-950/40 via-slate-900 to-amber-950/40 rounded-3xl p-4 sm:p-8 border border-orange-500/30 text-white shadow-xl space-y-6 max-w-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-orange-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-orange-300 flex items-center gap-2">
                    <Grid size={22} className="text-orange-400" />
                    <span>{t.tafdeelKabirSection.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.tafdeelKabirSection.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-orange-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-orange-400 uppercase block">{t.tafdeelKabirSection.baseCell}</span>
                  <div className="text-3xl font-black font-mono text-orange-200">{tafdeelKabirData.baseCell}</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-orange-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-orange-400 uppercase block">{t.tafdeelKabirSection.compensationK}</span>
                  <div className="text-3xl font-black font-mono text-amber-300">+{tafdeelKabirData.compensationConstantK}</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-orange-500/30 space-y-1">
                  <span className="text-[11px] font-bold text-orange-400 uppercase block">{t.tafdeelKabirSection.insertionCell}</span>
                  <div className="text-sm font-bold text-emerald-300">
                    {langKey === 'fr' && tafdeelKabirData.recommendedInsertionCellFr}
                    {langKey === 'en' && tafdeelKabirData.recommendedInsertionCellEn}
                    {langKey === 'ha' && tafdeelKabirData.recommendedInsertionCellHa}
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-orange-900/20 border border-orange-500/30 space-y-2">
                <span className="text-xs uppercase tracking-wider font-bold text-orange-300 block">{t.tafdeelKabirSection.formulaText}</span>
                <p className="text-xs sm:text-sm text-orange-100 font-mono leading-relaxed break-all">
                  {langKey === 'fr' && tafdeelKabirData.adjustedFormulaFr}
                  {langKey === 'en' && tafdeelKabirData.adjustedFormulaEn}
                  {langKey === 'ha' && tafdeelKabirData.adjustedFormulaHa}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Export Options Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-gray-200 dark:border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 max-w-full overflow-hidden">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            {t.labels.exportBannerTitle}
          </h4>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            {t.labels.exportBannerSubtitle}
          </p>
        </div>

        <div className="flex flex-col xs:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              const indDetails = [
                { label: 'Nom & Prénom', value: personName || '---' },
                { label: 'Nom de la Mère', value: motherName || '---' },
                { label: 'Poids Abjad Standard', value: `${mizanKabeerData.totalStandardAbjad}` },
                { label: 'Mizan Kabeer Équilibré', value: `${mizanKabeerData.totalPlanetaryBalanced}` },
                { label: 'Shifr (Ascendant)', value: shifrData.ascendantSign },
                { label: 'Indice Vitalité', value: `${mizanRuhData.vitalityIndex}%` },
                { label: 'Saat Fath', value: saatFathData.exactTime },
              ];

              exportWirdToImage({
                arabicZikr: inputText,
                transliteration: `Mizan: ${mizanKabeerData.totalPlanetaryBalanced} | Shifr: ${shifrData.ascendantSign}`,
                abjadWeight: mizanKabeerData.totalStandardAbjad,
                title: `INDIVIDUALISATION HAUTE PRÉCISION (${personName})`,
                meaningFr: `Ascendant: ${shifrData.ascendantSign} — Vitalité: ${mizanRuhData.vitalityIndex}% — Minute: ${saatFathData.exactTime}`,
                isParchment: false,
                lang: langKey,
                detailsList: indDetails,
              });
            }}
            className="flex-1 sm:flex-none py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Download size={15} className="text-amber-400" />
            <span>{t.labels.exportPng}</span>
          </button>

          <button
            onClick={() => {
              const indDetails = [
                { label: 'Nom & Prénom', value: personName || '---' },
                { label: 'Nom de la Mère', value: motherName || '---' },
                { label: 'Poids Abjad Standard', value: `${mizanKabeerData.totalStandardAbjad}` },
                { label: 'Mizan Kabeer Équilibré', value: `${mizanKabeerData.totalPlanetaryBalanced}` },
                { label: 'Shifr (Ascendant)', value: shifrData.ascendantSign },
                { label: 'Indice Vitalité', value: `${mizanRuhData.vitalityIndex}%` },
                { label: 'Saat Fath', value: saatFathData.exactTime },
              ];

              exportWirdToImage({
                arabicZikr: inputText,
                transliteration: `Mizan: ${mizanKabeerData.totalPlanetaryBalanced} | Shifr: ${shifrData.ascendantSign}`,
                abjadWeight: mizanKabeerData.totalStandardAbjad,
                title: `PARCHEMIN D'INDIVIDUALISATION (${personName})`,
                meaningFr: `Ascendant: ${shifrData.ascendantSign} — Vitalité: ${mizanRuhData.vitalityIndex}% — Minute: ${saatFathData.exactTime}`,
                isParchment: true,
                lang: langKey,
                detailsList: indDetails,
              });
            }}
            className="flex-1 sm:flex-none py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Feather size={15} />
            <span>{t.labels.exportParchment}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighPrecisionIndividualization;
