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
  Circle,
  Layers,
  Award,
  AlertTriangle,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Grid,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { exportWirdToImage } from '../../../utils/wirdExporter';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import {
  RAML_FIGURES,
  RamlFigure,
  generateFull16Houses,
  calculateSaatTacht,
  analyzeTafshee,
} from '../../../utils/advancedRamlEngine';
import {
  ADVANCED_RAML_TRANSLATIONS,
  AdvancedRamlTranslation,
} from '../../../components/advancedRaml/advancedRamlTranslations';

type ModuleTab = 'khatamRaml' | 'saatTacht' | 'tafshee';

export const AdvancedRamlProcessing: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const t: AdvancedRamlTranslation = ADVANCED_RAML_TRANSLATIONS[langKey] || ADVANCED_RAML_TRANSLATIONS.fr;

  const [activeTab, setActiveTab] = useState<ModuleTab>('khatamRaml');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Selected 4 Mothers
  const [m1Id, setM1Id] = useState<string>('tariq');
  const [m2Id, setM2Id] = useState<string>('nusra_dakhila');
  const [m3Id, setM3Id] = useState<string>('bayad');
  const [m4Id, setM4Id] = useState<string>('jamaa');

  // Sa'at al-Tacht inputs
  const [selectedDay, setSelectedDay] = useState<number>(0); // Sunday
  const [operatorElement, setOperatorElement] = useState<'fire' | 'air' | 'water' | 'earth'>('fire');
  const [selectedIntention, setSelectedIntention] = useState<string>('protection');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate random harmonic mothers
  const handleRandomMothers = () => {
    const r1 = RAML_FIGURES[Math.floor(Math.random() * RAML_FIGURES.length)].id;
    const r2 = RAML_FIGURES[Math.floor(Math.random() * RAML_FIGURES.length)].id;
    const r3 = RAML_FIGURES[Math.floor(Math.random() * RAML_FIGURES.length)].id;
    const r4 = RAML_FIGURES[Math.floor(Math.random() * RAML_FIGURES.length)].id;
    setM1Id(r1);
    setM2Id(r2);
    setM3Id(r3);
    setM4Id(r4);
  };

  // Calculation Memoization
  const mothers = useMemo(() => {
    const f1 = RAML_FIGURES.find((f) => f.id === m1Id) || RAML_FIGURES[0];
    const f2 = RAML_FIGURES.find((f) => f.id === m2Id) || RAML_FIGURES[1];
    const f3 = RAML_FIGURES.find((f) => f.id === m3Id) || RAML_FIGURES[3];
    const f4 = RAML_FIGURES.find((f) => f.id === m4Id) || RAML_FIGURES[10];
    return [f1, f2, f3, f4] as [RamlFigure, RamlFigure, RamlFigure, RamlFigure];
  }, [m1Id, m2Id, m3Id, m4Id]);

  const houses = useMemo(() => generateFull16Houses(mothers), [mothers]);

  const saatData = useMemo(
    () => calculateSaatTacht(selectedDay, operatorElement, selectedIntention),
    [selectedDay, operatorElement, selectedIntention]
  );

  const tafsheeData = useMemo(() => analyzeTafshee(houses), [houses]);

  const tabsConfig = [
    { id: 'khatamRaml' as ModuleTab, label: t.tabs.khatamRaml, icon: Circle, color: 'text-amber-500' },
    { id: 'saatTacht' as ModuleTab, label: t.tabs.saatTacht, icon: Clock, color: 'text-cyan-500' },
    { id: 'tafshee' as ModuleTab, label: t.tabs.tafshee, icon: Layers, color: 'text-rose-500' },
  ];

  // Helper to render binary dots of a figure
  const renderBinaryDots = (lines: [number, number, number, number]) => {
    return (
      <div className="flex flex-col items-center gap-1 font-mono my-1">
        {lines.map((lineVal, idx) => (
          <div key={idx} className="flex items-center justify-center gap-1">
            {lineVal === 1 ? (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
            ) : (
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3.5 py-4 sm:p-6 lg:p-8 safe-area-pt pb-28 space-y-6 sm:space-y-8 min-h-screen min-w-0 overflow-x-hidden box-border">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 w-full">
        <button
          onClick={() => navigate('/tools')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gray-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-gray-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0 active:scale-95"
        >
          <ArrowLeft size={16} />
          <span>{t.backToTools}</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold shadow-sm max-w-full">
          <Award size={14} className="shrink-0" />
          <span className="truncate">{t.headerBadge}</span>
        </div>
      </div>

      {/* Main Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-amber-950 to-stone-900 p-5 sm:p-8 text-white shadow-2xl border border-amber-500/30 w-full max-w-full">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider max-w-full">
            <Compass size={14} className="shrink-0" />
            <span className="truncate">Ilm al-Raml • Géomancie Avancée</span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-100 break-words leading-tight">
            {t.pageTitle}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed break-words">
            {t.pageSubtitle}
          </p>
        </div>

        <Layers size={240} className="absolute -right-10 -bottom-16 text-amber-500/10 pointer-events-none" />
      </div>

      {/* Info Notice */}
      <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-4 sm:p-5 flex items-start gap-3 w-full max-w-full overflow-hidden">
        <Info className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={18} />
        <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 font-medium leading-relaxed break-words flex-1 min-w-0">
          {t.infoNotice}
        </p>
      </div>

      {/* Shared Inputs Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-7 border border-gray-200 dark:border-slate-800 shadow-md space-y-5 w-full max-w-full min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-3">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <Sliders size={16} className="shrink-0" />
            <span className="truncate">Saisie des 4 Mères (Mahaat) & Configuration</span>
          </h3>

          <button
            onClick={handleRandomMothers}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition-all border border-amber-500/30 cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <Sparkles size={14} />
            <span>{t.labels.randomTheme}</span>
          </button>
        </div>

        {/* 4 Mothers Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
              {t.labels.selectMother1}
            </label>
            <select
              value={m1Id}
              onChange={(e) => setM1Id(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {RAML_FIGURES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nameAr} - {langKey === 'fr' ? f.nameFr : langKey === 'en' ? f.nameEn : f.nameHa}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
              {t.labels.selectMother2}
            </label>
            <select
              value={m2Id}
              onChange={(e) => setM2Id(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {RAML_FIGURES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nameAr} - {langKey === 'fr' ? f.nameFr : langKey === 'en' ? f.nameEn : f.nameHa}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
              {t.labels.selectMother3}
            </label>
            <select
              value={m3Id}
              onChange={(e) => setM3Id(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {RAML_FIGURES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nameAr} - {langKey === 'fr' ? f.nameFr : langKey === 'en' ? f.nameEn : f.nameHa}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
              {t.labels.selectMother4}
            </label>
            <select
              value={m4Id}
              onChange={(e) => setM4Id(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {RAML_FIGURES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nameAr} - {langKey === 'fr' ? f.nameFr : langKey === 'en' ? f.nameEn : f.nameHa}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sa'at al-Tacht Configuration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100 dark:border-slate-800">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
              {t.labels.selectDay}
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value, 10))}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value={0}>{t.days.sunday}</option>
              <option value={1}>{t.days.monday}</option>
              <option value={2}>{t.days.tuesday}</option>
              <option value={3}>{t.days.wednesday}</option>
              <option value={4}>{t.days.thursday}</option>
              <option value={5}>{t.days.friday}</option>
              <option value={6}>{t.days.saturday}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
              {t.labels.selectElement}
            </label>
            <select
              value={operatorElement}
              onChange={(e) => setOperatorElement(e.target.value as any)}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="fire">{t.elements.fire}</option>
              <option value="air">{t.elements.air}</option>
              <option value="water">{t.elements.water}</option>
              <option value="earth">{t.elements.earth}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
              {t.labels.selectIntention}
            </label>
            <select
              value={selectedIntention}
              onChange={(e) => setSelectedIntention(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="protection">{t.intentions.protection}</option>
              <option value="opening">{t.intentions.opening}</option>
              <option value="healing">{t.intentions.healing}</option>
              <option value="reconciliation">{t.intentions.reconciliation}</option>
              <option value="wisdom">{t.intentions.wisdom}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tool Info Tooltip */}
      <ToolInfoTooltip toolId="advanced-raml-processing" />

      {/* Module Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-md scale-105'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon size={16} className={isSelected ? 'text-white' : tab.color} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Module View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          {/* MODULE 1: KHATAM AL-RAML (SCEAU DE SABLE CONCENTRIQUE) */}
          {activeTab === 'khatamRaml' && (
            <div className="bg-gradient-to-br from-stone-950 via-slate-900 to-amber-950/50 rounded-3xl p-6 sm:p-8 border border-amber-500/30 text-white shadow-xl space-y-8">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-amber-300 flex items-center gap-2">
                    <Circle size={22} className="text-amber-400" />
                    <span>{t.khatamRamlSection.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.khatamRamlSection.subtitle}</p>
                </div>
              </div>

              {/* Concentric SVG Mandala Seal Display */}
              <div className="flex flex-col items-center justify-center space-y-4 bg-slate-950/80 p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
                <div className="text-center space-y-1 z-10">
                  <span className="text-xs uppercase tracking-widest font-bold text-amber-400 block">
                    {t.khatamRamlSection.sealTitle}
                  </span>
                  <p className="text-xs text-slate-300">{t.khatamRamlSection.sealDesc}</p>
                </div>

                {/* SVG Concentric Ring Render */}
                <div className="relative w-full max-w-lg aspect-square flex items-center justify-center z-10 py-4">
                  <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
                    {/* Background Glow */}
                    <circle cx="200" cy="200" r="190" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                    <circle cx="200" cy="200" r="160" fill="none" stroke="#d97706" strokeWidth="2" opacity="0.5" />
                    <circle cx="200" cy="200" r="115" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.6" />
                    <circle cx="200" cy="200" r="65" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="2" opacity="0.9" />

                    {/* Central Core Text */}
                    <text x="200" y="195" textAnchor="middle" fill="#fef08a" fontSize="16" className="font-arabic font-bold">
                      خاتم الرمل
                    </text>
                    <text x="200" y="215" textAnchor="middle" fill="#93c5fd" fontSize="10" className="font-mono font-bold">
                      {houses[14].figure.nameAr}
                    </text>

                    {/* 16 Radial Lines & House Nodes */}
                    {houses.map((h, i) => {
                      const angle = (i * 360) / 16 - 90;
                      const rad = (angle * Math.PI) / 180;
                      const xOuter = 200 + 155 * Math.cos(rad);
                      const yOuter = 200 + 155 * Math.sin(rad);
                      const xInner = 200 + 120 * Math.cos(rad);
                      const yInner = 200 + 120 * Math.sin(rad);
                      const xText = 200 + 178 * Math.cos(rad);
                      const yText = 200 + 178 * Math.sin(rad);

                      return (
                        <g key={i}>
                          <line x1={xInner} y1={yInner} x2={xOuter} y2={yOuter} stroke="#78350f" strokeWidth="1" />
                          <circle cx={xOuter} cy={yOuter} r="14" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                          <text
                            x={xOuter}
                            y={yOuter + 4}
                            textAnchor="middle"
                            fill="#fde68a"
                            fontSize="10"
                            className="font-arabic font-bold"
                          >
                            {h.figure.nameAr.slice(0, 3)}
                          </text>
                          <text
                            x={xText}
                            y={yText + 3}
                            textAnchor="middle"
                            fill="#cbd5e1"
                            fontSize="8"
                            className="font-mono font-bold"
                          >
                            M{h.houseNumber}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Concentric Layers Legend */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-xs z-10 pt-2">
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-0.5">
                    <span className="font-bold text-amber-400 block">{t.khatamRamlSection.concentricLayers.outer}</span>
                    <span className="text-slate-300 text-[11px]">Gidaje 1..16 ka tambi na filin yashi.</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-0.5">
                    <span className="font-bold text-amber-400 block">{t.khatamRamlSection.concentricLayers.middle}</span>
                    <span className="text-slate-300 text-[11px]">Alamomin Ramli, digogi da sunayensu.</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-0.5">
                    <span className="font-bold text-amber-400 block">{t.khatamRamlSection.concentricLayers.inner}</span>
                    <span className="text-slate-300 text-[11px]">Rarrabar Wuta, Iska, Ruwa da Kasa.</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-0.5">
                    <span className="font-bold text-amber-400 block">{t.khatamRamlSection.concentricLayers.core}</span>
                    <span className="text-slate-300 text-[11px]">Tushen hukuncin Alkali (H15/H16).</span>
                  </div>
                </div>
              </div>

              {/* 16 Houses Detailed Table */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Grid size={16} />
                  <span>{t.khatamRamlSection.housesTableTitle}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {houses.map((h) => (
                    <div
                      key={h.houseNumber}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 hover:border-amber-500/50 transition-all space-y-2 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold">
                          {t.labels.houseNumber} #{h.houseNumber}
                        </span>
                        <span className="text-xs font-arabic font-bold text-amber-200">{h.houseNameAr}</span>
                      </div>

                      <div className="text-center py-1">
                        <div className="font-arabic text-lg font-bold text-white">{h.figure.nameAr}</div>
                        <div className="text-[11px] text-amber-300/80 font-medium">
                          {langKey === 'fr' ? h.figure.nameFr : langKey === 'en' ? h.figure.nameEn : h.figure.nameHa}
                        </div>
                        {renderBinaryDots(h.figure.lines)}
                      </div>

                      <div className="pt-1 text-[11px] text-slate-300 leading-relaxed border-t border-slate-800/80">
                        <strong className="text-slate-400 block">{t.labels.houseMeaning}:</strong>
                        <span>
                          {langKey === 'fr' ? h.domainFr : langKey === 'en' ? h.domainEn : h.domainHa}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: SA'AT AL-TACHT (HEURE DE TRACÉ) */}
          {activeTab === 'saatTacht' && (
            <div className="bg-gradient-to-br from-blue-950/50 via-slate-900 to-cyan-950/50 rounded-3xl p-6 sm:p-8 border border-cyan-500/30 text-white shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-cyan-300 flex items-center gap-2">
                    <Clock size={22} className="text-cyan-400" />
                    <span>{t.saatTachtSection.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.saatTachtSection.subtitle}</p>
                </div>
              </div>

              {/* Best Slot Card */}
              <div className="bg-slate-900/90 rounded-3xl p-6 border border-cyan-500/40 space-y-4 shadow-2xl">
                <span className="text-xs uppercase tracking-widest font-bold text-cyan-400 block">
                  {t.saatTachtSection.bestHourTitle}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 space-y-1">
                    <span className="text-slate-400 block">Créneau Horaire</span>
                    <div className="text-2xl font-black font-mono text-cyan-200">{saatData.bestSlot.timeRange}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 space-y-1">
                    <span className="text-slate-400 block">{t.saatTachtSection.stabilityScore}</span>
                    <div className="text-2xl font-black font-mono text-emerald-400">{saatData.bestSlot.stabilityScore}%</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 space-y-1">
                    <span className="text-slate-400 block">{t.saatTachtSection.planetaryRuler}</span>
                    <div className="text-sm font-bold text-amber-300">
                      {langKey === 'fr' ? saatData.bestSlot.rulerFr : langKey === 'en' ? saatData.bestSlot.rulerEn : saatData.bestSlot.rulerHa}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 space-y-1">
                    <span className="text-slate-400 block">{t.saatTachtSection.drawingDirection}</span>
                    <div className="text-sm font-bold text-cyan-300">{saatData.direction}</div>
                  </div>
                </div>
              </div>

              {/* Sand Preparation Ritual Steps */}
              <div className="bg-slate-900/80 rounded-2xl p-5 border border-cyan-500/20 space-y-3">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Shield size={16} />
                  <span>{t.saatTachtSection.sandPreparation}</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-200">
                  {t.saatTachtSection.preparationSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/10">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 12 Daytime Hours Chart */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  {t.saatTachtSection.hourlyScheduleTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {saatData.hourlySlots.map((slot) => (
                    <div
                      key={slot.hourIndex}
                      className={`p-3.5 rounded-2xl bg-slate-900/80 border text-xs space-y-2 ${
                        slot.status === 'stable'
                          ? 'border-emerald-500/40'
                          : slot.status === 'unstable'
                          ? 'border-rose-500/40'
                          : 'border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white">{slot.timeRange}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            slot.status === 'stable'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : slot.status === 'unstable'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {slot.status === 'stable'
                            ? t.saatTachtSection.stable
                            : slot.status === 'unstable'
                            ? t.saatTachtSection.unstable
                            : t.saatTachtSection.neutral}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300 truncate">
                        {langKey === 'fr' ? slot.rulerFr : langKey === 'en' ? slot.rulerEn : slot.rulerHa}
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            slot.status === 'stable' ? 'bg-emerald-400' : slot.status === 'unstable' ? 'bg-rose-400' : 'bg-amber-400'
                          }`}
                          style={{ width: `${slot.stabilityScore}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 3: TAFSHEE (FIGURES RÉPÉTÉES & BLOCAGES) */}
          {activeTab === 'tafshee' && (
            <div className="bg-gradient-to-br from-rose-950/50 via-slate-900 to-purple-950/50 rounded-3xl p-6 sm:p-8 border border-rose-500/30 text-white shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-rose-300 flex items-center gap-2">
                    <Layers size={22} className="text-rose-400" />
                    <span>{t.tafsheeSection.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.tafsheeSection.subtitle}</p>
                </div>
              </div>

              {/* Diagnostic Status Card */}
              <div className="bg-slate-900/90 rounded-3xl p-6 border border-rose-500/40 space-y-3 shadow-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                  <AlertTriangle size={16} />
                  <span>{t.tafsheeSection.redundancyStatus}</span>
                </div>

                <p className="text-sm font-medium text-rose-100 leading-relaxed">
                  {langKey === 'fr' && tafsheeData.blockageSummaryFr}
                  {langKey === 'en' && tafsheeData.blockageSummaryEn}
                  {langKey === 'ha' && tafsheeData.blockageSummaryHa}
                </p>
              </div>

              {/* Redundant Figures Inventory */}
              {tafsheeData.redundancies.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wider">
                    {t.tafsheeSection.repeatedFiguresTitle}
                  </h3>

                  <div className="space-y-4">
                    {tafsheeData.redundancies.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-arabic font-bold text-white">{item.figure.nameAr}</span>
                            <span className="text-xs text-amber-300 font-bold">
                              {langKey === 'fr' ? item.figure.nameFr : langKey === 'en' ? item.figure.nameEn : item.figure.nameHa}
                            </span>
                          </div>

                          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-bold">
                            {item.count} {t.tafsheeSection.countLabel}
                          </span>
                        </div>

                        {/* Affected Houses & Axis */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 space-y-1">
                            <span className="text-slate-400 block font-bold">{t.tafsheeSection.housesOccurrences}</span>
                            <div className="flex flex-wrap gap-1">
                              {item.houses.map((hNum) => (
                                <span key={hNum} className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold">
                                  Maison #{hNum}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 space-y-1">
                            <span className="text-slate-400 block font-bold">{t.tafsheeSection.blockageAxesTitle}</span>
                            <span className="text-rose-200">
                              {langKey === 'fr' ? item.axesFr : langKey === 'en' ? item.axesEn : item.axesHa}
                            </span>
                          </div>
                        </div>

                        {/* Elementary Remedy */}
                        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs space-y-1">
                          <span className="font-bold text-amber-300 block">{t.tafsheeSection.remedialTitle}</span>
                          <p className="text-amber-100">
                            {langKey === 'fr' ? item.remedyFr : langKey === 'en' ? item.remedyEn : item.remedyHa}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs">
                  {t.tafsheeSection.noRedundancy}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Export Options Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            Exporter la Synthèse de Raml
          </h4>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Téléchargez le Sceau Concentrique & le thème sous forme d'Image HD ou Parchemin traditionnel
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              const ramlKhatamMatrix = [
                [houses[0].figure.nameAr, houses[1].figure.nameAr, houses[2].figure.nameAr, houses[3].figure.nameAr],
                [houses[4].figure.nameAr, houses[5].figure.nameAr, houses[6].figure.nameAr, houses[7].figure.nameAr],
                [houses[8].figure.nameAr, houses[9].figure.nameAr, houses[10].figure.nameAr, houses[11].figure.nameAr],
                [houses[12].figure.nameAr, houses[13].figure.nameAr, houses[14].figure.nameAr, houses[15].figure.nameAr],
              ];

              const ramlDetails = [
                { label: 'M1 (Âme)', value: `${houses[0].figure.nameAr} - ${houses[0].figure.nameFr}` },
                { label: 'M2 (Biens)', value: `${houses[1].figure.nameAr} - ${houses[1].figure.nameFr}` },
                { label: 'M3 (Frères)', value: `${houses[2].figure.nameAr} - ${houses[2].figure.nameFr}` },
                { label: 'M4 (Père)', value: `${houses[3].figure.nameAr} - ${houses[3].figure.nameFr}` },
                { label: 'M5 (Enfants)', value: `${houses[4].figure.nameAr} - ${houses[4].figure.nameFr}` },
                { label: 'M6 (Maladies)', value: `${houses[5].figure.nameAr} - ${houses[5].figure.nameFr}` },
                { label: 'M7 (Mariage)', value: `${houses[6].figure.nameAr} - ${houses[6].figure.nameFr}` },
                { label: 'M8 (Mort)', value: `${houses[7].figure.nameAr} - ${houses[7].figure.nameFr}` },
                { label: 'M9 (Voyages)', value: `${houses[8].figure.nameAr} - ${houses[8].figure.nameFr}` },
                { label: 'M10 (Honneur)', value: `${houses[9].figure.nameAr} - ${houses[9].figure.nameFr}` },
                { label: 'M11 (Espoirs)', value: `${houses[10].figure.nameAr} - ${houses[10].figure.nameFr}` },
                { label: 'M12 (Épreuves)', value: `${houses[11].figure.nameAr} - ${houses[11].figure.nameFr}` },
                { label: 'M13 (Demandeur)', value: `${houses[12].figure.nameAr} - ${houses[12].figure.nameFr}` },
                { label: 'M14 (Demandé)', value: `${houses[13].figure.nameAr} - ${houses[13].figure.nameFr}` },
                { label: 'M15 (Juge)', value: `${houses[14].figure.nameAr} - ${houses[14].figure.nameFr}` },
                { label: 'M16 (Issue)', value: `${houses[15].figure.nameAr} - ${houses[15].figure.nameFr}` },
                { label: 'Heure Propice', value: saatData.bestSlot.timeRange },
                { label: 'Tafshee', value: `${tafsheeData.redundancies.length} redondance(s)` },
              ];

              exportWirdToImage({
                arabicZikr: `خاتم الرمل: ${houses[14].figure.nameAr}`,
                transliteration: `Sa'at: ${saatData.bestSlot.timeRange} | Tafshee: ${tafsheeData.redundancies.length} redondances`,
                abjadWeight: 16,
                title: `TRAITEMENT AVANCÉ DE RAML`,
                meaningFr: `Sceau Concentrique 16 Maisons — Heure Optimal: ${saatData.bestSlot.timeRange}`,
                isParchment: false,
                lang: langKey,
                khatamMatrix: ramlKhatamMatrix,
                detailsList: ramlDetails,
              });
            }}
            className="flex-1 sm:flex-none py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Download size={15} className="text-amber-400" />
            <span>{t.labels.exportPng}</span>
          </button>

          <button
            onClick={() => {
              const ramlKhatamMatrix = [
                [houses[0].figure.nameAr, houses[1].figure.nameAr, houses[2].figure.nameAr, houses[3].figure.nameAr],
                [houses[4].figure.nameAr, houses[5].figure.nameAr, houses[6].figure.nameAr, houses[7].figure.nameAr],
                [houses[8].figure.nameAr, houses[9].figure.nameAr, houses[10].figure.nameAr, houses[11].figure.nameAr],
                [houses[12].figure.nameAr, houses[13].figure.nameAr, houses[14].figure.nameAr, houses[15].figure.nameAr],
              ];

              const ramlDetails = [
                { label: 'M1 (Âme)', value: `${houses[0].figure.nameAr} - ${houses[0].figure.nameFr}` },
                { label: 'M2 (Biens)', value: `${houses[1].figure.nameAr} - ${houses[1].figure.nameFr}` },
                { label: 'M3 (Frères)', value: `${houses[2].figure.nameAr} - ${houses[2].figure.nameFr}` },
                { label: 'M4 (Père)', value: `${houses[3].figure.nameAr} - ${houses[3].figure.nameFr}` },
                { label: 'M5 (Enfants)', value: `${houses[4].figure.nameAr} - ${houses[4].figure.nameFr}` },
                { label: 'M6 (Maladies)', value: `${houses[5].figure.nameAr} - ${houses[5].figure.nameFr}` },
                { label: 'M7 (Mariage)', value: `${houses[6].figure.nameAr} - ${houses[6].figure.nameFr}` },
                { label: 'M8 (Mort)', value: `${houses[7].figure.nameAr} - ${houses[7].figure.nameFr}` },
                { label: 'M9 (Voyages)', value: `${houses[8].figure.nameAr} - ${houses[8].figure.nameFr}` },
                { label: 'M10 (Honneur)', value: `${houses[9].figure.nameAr} - ${houses[9].figure.nameFr}` },
                { label: 'M11 (Espoirs)', value: `${houses[10].figure.nameAr} - ${houses[10].figure.nameFr}` },
                { label: 'M12 (Épreuves)', value: `${houses[11].figure.nameAr} - ${houses[11].figure.nameFr}` },
                { label: 'M13 (Demandeur)', value: `${houses[12].figure.nameAr} - ${houses[12].figure.nameFr}` },
                { label: 'M14 (Demandé)', value: `${houses[13].figure.nameAr} - ${houses[13].figure.nameFr}` },
                { label: 'M15 (Juge)', value: `${houses[14].figure.nameAr} - ${houses[14].figure.nameFr}` },
                { label: 'M16 (Issue)', value: `${houses[15].figure.nameAr} - ${houses[15].figure.nameFr}` },
                { label: 'Heure Propice', value: saatData.bestSlot.timeRange },
                { label: 'Tafshee', value: `${tafsheeData.redundancies.length} redondance(s)` },
              ];

              exportWirdToImage({
                arabicZikr: `خاتم الرمل: ${houses[14].figure.nameAr}`,
                transliteration: `Sa'at: ${saatData.bestSlot.timeRange} | Tafshee: ${tafsheeData.redundancies.length} redondances`,
                abjadWeight: 16,
                title: `PARCHEMIN DE RAML (KHATAM)`,
                meaningFr: `Sceau Concentrique 16 Maisons — Heure Optimal: ${saatData.bestSlot.timeRange}`,
                isParchment: true,
                lang: langKey,
                khatamMatrix: ramlKhatamMatrix,
                detailsList: ramlDetails,
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

export default AdvancedRamlProcessing;
