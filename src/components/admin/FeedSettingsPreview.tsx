import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers, Smartphone, Tablet, Monitor, Eye, Sun, Moon, RotateCcw,
  Sparkles, Check, Compass, BookOpen, Headphones, MessageSquare,
  ShoppingBag, Calendar, Plus, Minus, Info, AlertTriangle,
  Play, Flame, Search, Bell, Heart, Bookmark, Layout, Grid,
  Sliders, CheckCircle2, Music, Award, Shield, ChevronDown
} from 'lucide-react';

interface FeedSettingsPreviewProps {
  featureToggles: Record<string, any>;
  handleToggleFeature: (key: string, value: any) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type FeedType = 'home' | 'tools' | 'article' | 'explore' | 'community' | 'store' | 'journal';
type DeviceType = 'mobile' | 'tablet' | 'desktop';

export const FeedSettingsPreview: React.FC<FeedSettingsPreviewProps> = ({
  featureToggles,
  handleToggleFeature,
  showToast = () => {}
}) => {
  const [selectedFeed, setSelectedFeed] = useState<FeedType>('home');
  const [deviceView, setDeviceView] = useState<DeviceType>('mobile');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [showGuides, setShowGuides] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Offset key map
  const feedConfig: Record<FeedType, {
    key: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    defaultTopPadding: number;
    hasSliderOffset?: boolean;
  }> = {
    home: {
      key: 'feedHomeOffset',
      label: 'Page Accueil',
      icon: <Layout size={16} />,
      color: 'emerald',
      description: 'Flux principal des secrets, wirds quotidiens, bannières et carrousels.',
      defaultTopPadding: 60,
      hasSliderOffset: true
    },
    tools: {
      key: 'feedToolsOffset',
      label: 'Outils Mystiques',
      icon: <Compass size={16} />,
      color: 'amber',
      description: 'Grille des outils sacrés, calculateurs Abjad et carrés magiques (Wifq).',
      defaultTopPadding: 4
    },
    article: {
      key: 'feedArticleOffset',
      label: 'Lecture Secret',
      icon: <BookOpen size={16} />,
      color: 'blue',
      description: 'Page de lecture immersive des secrets, calligraphies arabes et rituels.',
      defaultTopPadding: 2
    },
    explore: {
      key: 'feedExploreOffset',
      label: 'Explorer & Audios',
      icon: <Headphones size={16} />,
      color: 'purple',
      description: 'Lecteur audio coranique, stations de récitateurs et wirds sonores.',
      defaultTopPadding: 8
    },
    community: {
      key: 'feedCommunityOffset',
      label: 'Communauté',
      icon: <MessageSquare size={16} />,
      color: 'teal',
      description: 'Forums spirituels, partages de recettes, questions et échanges fraternels.',
      defaultTopPadding: 16
    },
    store: {
      key: 'feedStoreOffset',
      label: 'Boutique Sacrée',
      icon: <ShoppingBag size={16} />,
      color: 'orange',
      description: 'Boutique des manuscrits rares, parchemins, encens et livres sacrés.',
      defaultTopPadding: 16
    },
    journal: {
      key: 'feedJournalOffset',
      label: 'Journal & Prières',
      icon: <Calendar size={16} />,
      color: 'indigo',
      description: 'Calendrier Hijri, heures de prières, suivi des wirds et points barakah.',
      defaultTopPadding: 16
    }
  };

  const globalOffset = Number(featureToggles.feedGlobalOffset || 0);
  const currentFeedConfig = feedConfig[selectedFeed];
  const currentFeedOffset = Number(featureToggles[currentFeedConfig.key] || 0);
  const currentSliderOffset = Number(featureToggles.feedHomeSliderOffset || 0);
  const totalOffset = globalOffset + currentFeedOffset;

  // Preset handlers
  const applyPreset = (presetName: string, values: { global: number; page: number; slider?: number }) => {
    handleToggleFeature('feedGlobalOffset', values.global);
    handleToggleFeature(currentFeedConfig.key, values.page);
    if (values.slider !== undefined) {
      handleToggleFeature('feedHomeSliderOffset', values.slider);
    }
    showToast(`Préréglage appliqué : ${presetName}`, 'success');
  };

  const resetAllOffsets = () => {
    const allKeys = [
      'feedGlobalOffset', 'feedHomeOffset', 'feedToolsOffset', 'feedArticleOffset',
      'feedExploreOffset', 'feedCommunityOffset', 'feedStoreOffset', 'feedJournalOffset',
      'feedHomeSliderOffset'
    ];
    allKeys.forEach(k => handleToggleFeature(k, 0));
    showToast('Tous les décalages ont été réinitialisés à 0 px', 'info');
  };

  const changeOffsetBy = (key: string, delta: number) => {
    const curr = Number(featureToggles[key] || 0);
    const next = Math.max(-60, Math.min(60, curr + delta));
    handleToggleFeature(key, next);
  };

  // Status diagnostics
  const getOffsetDiagnostic = (offset: number) => {
    if (offset < -15) {
      return {
        badge: 'Risque de collision',
        color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
        icon: <AlertTriangle size={13} className="shrink-0" />,
        text: 'Décalage très haut : risque de chevauchement avec la barre de statut ou le header.'
      };
    }
    if (offset === 0) {
      return {
        badge: 'Alignement Standard',
        color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
        icon: <CheckCircle2 size={13} className="shrink-0" />,
        text: 'Position nominale équilibrée (0 px).'
      };
    }
    if (offset > 0 && offset <= 24) {
      return {
        badge: 'Dégagement Aéré',
        color: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
        icon: <Sparkles size={13} className="shrink-0" />,
        text: `Dégagement supérieur aéré de +${offset} px idéal pour écrans avec encoche.`
      };
    }
    return {
      badge: 'Espacement Élevé',
      color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      icon: <Info size={13} className="shrink-0" />,
      text: `Espacement supérieur généreux (+${offset} px).`
    };
  };

  const diagnostic = getOffsetDiagnostic(totalOffset);

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar with Feed Navigation Tabs */}
      <div className="bg-white dark:bg-gray-850 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Sliders size={16} />
              </span>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Gestionnaire Précis des Flux & Dégagements Verticaux
              </h4>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Sélectionnez un flux pour prévisualiser son rendu exact sur smartphone et ajuster son décalage au pixel près.
            </p>
          </div>

          {/* Global Reset */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetAllOffsets}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw size={13} />
              <span>Réinitialiser tout à 0 px</span>
            </button>
          </div>
        </div>

        {/* Feed Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(Object.keys(feedConfig) as FeedType[]).map((feedKey) => {
            const conf = feedConfig[feedKey];
            const isSelected = selectedFeed === feedKey;
            const currentVal = Number(featureToggles[conf.key] || 0);

            return (
              <button
                key={feedKey}
                type="button"
                onClick={() => setSelectedFeed(feedKey)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200/80 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750'
                }`}
              >
                {conf.icon}
                <span>{conf.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {currentVal > 0 ? `+${currentVal}` : `${currentVal}`} px
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Grid: Controls Panel & Interactive Live Smartphone Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Fine-Tuning Controls & Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Feed Configuration Card */}
          <div className="p-4 bg-white dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40">
                  {currentFeedConfig.icon}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    {currentFeedConfig.label}
                  </h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                    {currentFeedConfig.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Diagnostics Banner */}
            <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-medium ${diagnostic.color}`}>
              {diagnostic.icon}
              <div className="min-w-0 flex-1">
                <span className="font-bold block text-[11px]">{diagnostic.badge}</span>
                <span className="text-[10px] leading-tight block">{diagnostic.text}</span>
              </div>
              <span className="font-mono font-black text-xs shrink-0">
                Total : {totalOffset > 0 ? `+${totalOffset}` : totalOffset} px
              </span>
            </div>

            {/* Slider 1: Page-Specific Offset */}
            <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <span>Décalage {currentFeedConfig.label} :</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => changeOffsetBy(currentFeedConfig.key, -1)}
                    className="p-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                    title="-1 px"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="font-mono font-bold text-xs text-purple-600 dark:text-purple-400 w-14 text-center">
                    {currentFeedOffset > 0 ? `+${currentFeedOffset}` : currentFeedOffset} px
                  </span>
                  <button
                    type="button"
                    onClick={() => changeOffsetBy(currentFeedConfig.key, 1)}
                    className="p-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                    title="+1 px"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>

              <input
                type="range"
                min="-40"
                max="40"
                step="1"
                value={currentFeedOffset}
                onChange={(e) => handleToggleFeature(currentFeedConfig.key, parseInt(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>-40 px (Haut)</span>
                <span>0 px (Nominal)</span>
                <span>+40 px (Bas)</span>
              </div>
            </div>

            {/* Slider 2: Home Slider Offset (if on Home tab) */}
            {currentFeedConfig.hasSliderOffset && (
              <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    Décalage Bannière & Carrousel :
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => changeOffsetBy('feedHomeSliderOffset', -1)}
                      className="p-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                      title="-1 px"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 w-14 text-center">
                      {currentSliderOffset > 0 ? `+${currentSliderOffset}` : currentSliderOffset} px
                    </span>
                    <button
                      type="button"
                      onClick={() => changeOffsetBy('feedHomeSliderOffset', 1)}
                      className="p-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                      title="+1 px"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="1"
                  value={currentSliderOffset}
                  onChange={(e) => handleToggleFeature('feedHomeSliderOffset', parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            )}

            {/* Slider 3: Global Offset (Affects all pages) */}
            <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <label className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    Décalage Global Maître :
                  </label>
                  <span className="text-[10px] text-gray-400 font-normal">(tous les flux)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => changeOffsetBy('feedGlobalOffset', -1)}
                    className="p-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                    title="-1 px"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 w-14 text-center">
                    {globalOffset > 0 ? `+${globalOffset}` : globalOffset} px
                  </span>
                  <button
                    type="button"
                    onClick={() => changeOffsetBy('feedGlobalOffset', 1)}
                    className="p-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                    title="+1 px"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>

              <input
                type="range"
                min="-30"
                max="30"
                step="1"
                value={globalOffset}
                onChange={(e) => handleToggleFeature('feedGlobalOffset', parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-2 pt-1 border-t border-gray-100 dark:border-gray-800">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Préréglages d'optimisation rapide :
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('Standard', { global: 0, page: 0, slider: 0 })}
                  className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-left transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">📱 Standard Mobile</span>
                  <span className="text-[10px] text-gray-500 font-mono">0 px nominal</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('Dynamic Island iOS', { global: 0, page: 14, slider: 6 })}
                  className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-left transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">🍎 Encoche / Dynamic Island</span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">+14 px safe</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('Confort Aéré', { global: 4, page: 16, slider: 8 })}
                  className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-left transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">✨ Confort Dégagé</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">+20 px total</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('Compact', { global: -4, page: -4, slider: -4 })}
                  className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-left transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">⚡ Vue Compacte</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">-8 px dense</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Live Multi-Device Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Simulator Bar Controls (Theme, Device, Guides) */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-900 text-white rounded-2xl border border-gray-800">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Simulateur :</span>
              <button
                type="button"
                onClick={() => setDeviceView('mobile')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  deviceView === 'mobile' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title="Format Smartphone (375x667)"
              >
                <Smartphone size={14} />
                <span className="hidden sm:inline">Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceView('tablet')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  deviceView === 'tablet' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title="Format Tablette"
              >
                <Tablet size={14} />
                <span className="hidden sm:inline">Tablette</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceView('desktop')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  deviceView === 'desktop' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title="Format Desktop"
              >
                <Monitor size={14} />
                <span className="hidden sm:inline">Desktop</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Guides Toggle */}
              <button
                type="button"
                onClick={() => setShowGuides(!showGuides)}
                className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 border transition-colors ${
                  showGuides
                    ? 'bg-purple-950/80 border-purple-500/50 text-purple-300'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <Eye size={12} />
                <span>Repères Safe Area</span>
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={() => setPreviewTheme(previewTheme === 'dark' ? 'light' : 'dark')}
                className="p-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:text-white transition-colors"
                title="Basculer thème Clair/Sombre dans la prévisualisation"
              >
                {previewTheme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-300" />}
              </button>
            </div>
          </div>

          {/* SIMULATOR SCREEN VIEWPORT CONTAINER */}
          <div className="flex justify-center p-4 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative min-h-[580px]">
            {/* Background Geometric Grid Accent */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Device Chassis Frame */}
            <div
              className={`transition-all duration-300 relative shadow-2xl overflow-hidden rounded-[36px] border-[6px] border-gray-800 flex flex-col ${
                deviceView === 'mobile'
                  ? 'w-[360px] max-w-full'
                  : deviceView === 'tablet'
                  ? 'w-[500px] max-w-full'
                  : 'w-full'
              } ${previewTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
              style={{ minHeight: '520px', maxHeight: '580px' }}
            >
              {/* Top Speaker & Dynamic Island */}
              <div className="w-full bg-black/90 py-2.5 px-5 flex items-center justify-between text-[10px] text-gray-300 font-mono shrink-0 z-30 select-none">
                <span className="font-bold">09:41</span>
                {/* Dynamic Island pill */}
                <div className="px-3 py-1 bg-black rounded-full border border-gray-800/80 flex items-center gap-1.5 shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] text-emerald-400 font-sans font-bold">AsrarHub</span>
                </div>
                <div className="flex items-center gap-1 text-[9px]">
                  <span>5G</span>
                  <span>📶</span>
                  <span>100% 🔋</span>
                </div>
              </div>

              {/* Application Top Bar / Navigation Header (Fixed) */}
              <div
                className={`w-full px-4 py-2.5 flex items-center justify-between border-b shrink-0 z-20 backdrop-blur-md ${
                  previewTheme === 'dark'
                    ? 'bg-gray-900/90 border-gray-800 text-white'
                    : 'bg-white/90 border-gray-200 text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    ✨
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-tight block leading-none">ASRARHUB</span>
                    <span className="text-[9px] text-emerald-500 font-bold block leading-none mt-0.5">
                      Plateforme Sacrée
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 text-[10px]">
                    <Search size={11} />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 text-[10px] relative">
                    <Bell size={11} />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-gray-900 font-bold text-[9px]">
                    👑
                  </div>
                </div>
              </div>

              {/* SAFE AREA GUIDES OVERLAY (If Enabled) */}
              {showGuides && (
                <div className="w-full bg-purple-950/60 border-b border-purple-500/40 px-3 py-1 flex items-center justify-between text-[10px] text-purple-300 font-mono z-10 shrink-0 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                    <span>Guide Safe-Area : {currentFeedConfig.defaultTopPadding}px nominal</span>
                  </div>
                  <span className="bg-purple-900/90 px-1.5 py-0.5 rounded border border-purple-500/50 font-bold">
                    Décalage actif : {totalOffset > 0 ? `+${totalOffset}` : totalOffset} px
                  </span>
                </div>
              )}

              {/* DYNAMIC SCROLLABLE FEED CONTAINER WITH LIVE OFFSET */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3 relative select-none scrollbar-thin">
                {/* Visual Spacer representing applied CSS Variable offset */}
                <div
                  className="transition-all duration-200"
                  style={{
                    height: `${Math.max(0, currentFeedConfig.defaultTopPadding + totalOffset)}px`
                  }}
                >
                  {showGuides && totalOffset !== 0 && (
                    <div className="w-full h-full border-b-2 border-dashed border-purple-500/60 flex items-center justify-center text-[9px] text-purple-400 font-mono bg-purple-500/10 rounded">
                      <span>↕ Dégagement calculé : {currentFeedConfig.defaultTopPadding + totalOffset} px</span>
                    </div>
                  )}
                </div>

                {/* 1. RENDER MOCK FEED FOR: HOME (ACCUEIL) */}
                {selectedFeed === 'home' && (
                  <div className="space-y-3">
                    {/* Optional Slider / Carousel with its own slider offset */}
                    <div
                      className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white shadow-md relative overflow-hidden transition-all duration-200"
                      style={{
                        marginTop: `${currentSliderOffset}px`
                      }}
                    >
                      <div className="relative z-10 space-y-1">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 inline-block">
                          Wird Sacré du Vendredi
                        </span>
                        <h6 className="text-xs font-bold leading-tight">
                          Salatoul Fatih & Invocation des 1000 Lumières
                        </h6>
                        <p className="text-[10px] text-emerald-200/80 line-clamp-1">
                          Pour l'ouverture spirituelle et la délivrance des blocages.
                        </p>
                      </div>
                      <div className="absolute right-2 bottom-2 opacity-15 text-3xl font-serif">
                        ﷽
                      </div>
                    </div>

                    {/* Stories / Quick Badges */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {['✨ Zikr', '🌙 Lune', '📿 Wird', '🛡️ Protec', '⭐ Asrar'].map((s, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-1 shrink-0"
                        >
                          <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-emerald-500">
                            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-[10px] text-white font-bold">
                              {s.split(' ')[0]}
                            </div>
                          </div>
                          <span className="text-[9px] text-gray-500 dark:text-gray-400 font-medium">
                            {s.split(' ')[1]}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Featured Article Card */}
                    <div
                      className={`p-3.5 rounded-2xl border transition-all ${
                        previewTheme === 'dark'
                          ? 'bg-gray-800/90 border-gray-700 text-white'
                          : 'bg-white border-gray-200 text-gray-900 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          Secret Majeur
                        </span>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Bookmark size={12} />
                          <Heart size={12} />
                        </div>
                      </div>
                      <h6 className="text-xs font-bold leading-tight mb-1">
                        Destruction Totale du Mauvais Œil par les 4 Quls
                      </h6>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed mb-2.5 line-clamp-2">
                        Rituel authentique transmis par les maîtres soufis pour désenvoûter une maison et purifier les auras.
                      </p>
                      <div className="flex items-center justify-between text-[10px] pt-2 border-t border-gray-100 dark:border-gray-700/60">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Flame size={10} className="text-amber-500" />
                          <span>450 récitations</span>
                        </span>
                        <span className="text-emerald-500 font-bold">Consulter →</span>
                      </div>
                    </div>

                    {/* Secondary 2-Column Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl bg-gray-800/40 border border-gray-700/60 space-y-1">
                        <span className="text-[9px] text-amber-400 font-bold block">★ Wifq 3x3</span>
                        <span className="text-[11px] font-bold block truncate">Ouverture de Richesse</span>
                        <span className="text-[9px] text-gray-400 block">Carré d'al-Ghazali</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-gray-800/40 border border-gray-700/60 space-y-1">
                        <span className="text-[9px] text-teal-400 font-bold block">★ Ayatul Kursi</span>
                        <span className="text-[11px] font-bold block truncate">Bouclier Suprême</span>
                        <span className="text-[9px] text-gray-400 block">7 Cercles de Fer</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. RENDER MOCK FEED FOR: TOOLS (OUTILS MYSTIQUES) */}
                {selectedFeed === 'tools' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-amber-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-400">
                        Sanctuaire des Outils ésotériques
                      </span>
                      <p className="text-[11px] leading-tight text-amber-100">
                        Calculez le poids mystique des noms, générez vos carrés magiques et tracez vos talismans.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { title: 'Calculateur Hisab Abjad', desc: 'Valeur numérique & éléments', icon: '🔢', color: 'from-amber-600 to-amber-800' },
                        { title: 'Carré Magique 3x3', desc: 'Wifq al-Ghazali parfait', icon: '📐', color: 'from-emerald-600 to-emerald-800' },
                        { title: 'Compatibilité Astrale', desc: 'Mariage & alliances d’âmes', icon: '⭐', color: 'from-purple-600 to-purple-800' },
                        { title: 'Heures Planétaires', desc: 'Moments propices aux douas', icon: '⏳', color: 'from-blue-600 to-blue-800' }
                      ].map((tool, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-2xl bg-gray-800 border border-gray-700 space-y-1.5 shadow-xs"
                        >
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-sm shadow-xs`}>
                            {tool.icon}
                          </div>
                          <h6 className="text-xs font-bold text-white leading-tight">{tool.title}</h6>
                          <p className="text-[9px] text-gray-400 leading-tight line-clamp-1">{tool.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. RENDER MOCK FEED FOR: ARTICLE / DETAIL */}
                {selectedFeed === 'article' && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-gradient-to-b from-[#fdfbf7] to-[#f7f2e7] dark:from-gray-800 dark:to-gray-850 rounded-2xl border border-amber-200/60 dark:border-gray-700 text-[#3a3226] dark:text-[#d6c7af] space-y-2 shadow-xs">
                      <div className="flex items-center justify-between text-[10px] text-amber-800 dark:text-amber-400 font-bold">
                        <span>📖 Secret d'Initiation</span>
                        <span>Niveau 3 • Autorisation Requise</span>
                      </div>
                      <h5 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                        Le Grand Nom Caché (Ismoullah al-A'zam) selon les Pôles
                      </h5>
                      <div className="p-3 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-amber-300/40 text-center space-y-1 font-serif">
                        <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </p>
                        <p className="text-[9px] text-gray-500 font-mono">
                          Poids mystique : 786 • Répéter 100 fois à l'aube
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                        Ce wird se pratique en état d'ablution majeure. Allumez un encens de benjoin pur et orientez-vous vers la Qibla.
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. RENDER MOCK FEED FOR: EXPLORE & AUDIOS */}
                {selectedFeed === 'explore' && (
                  <div className="space-y-3">
                    {/* Mini Audio Player Card */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white shadow-md space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-purple-200">
                          <Music size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] text-purple-300 font-mono block">EN COURS D'ÉCOUTE</span>
                          <span className="text-xs font-bold truncate block">Sourate Al-Waqiah (Richesse)</span>
                          <span className="text-[9px] text-gray-300">Cheikh Mishary Rashid Alafasy</span>
                        </div>
                        <button
                          type="button"
                          className="w-8 h-8 rounded-full bg-white text-purple-900 flex items-center justify-center shadow-md shrink-0"
                        >
                          <Play size={14} className="ml-0.5" />
                        </button>
                      </div>
                      {/* Fake Equalizer waveform */}
                      <div className="flex items-center gap-1 h-3 pt-1">
                        {[40, 75, 30, 90, 60, 45, 80, 100, 50, 70, 35, 85, 40].map((h, idx) => (
                          <div
                            key={idx}
                            className="flex-1 bg-purple-400/60 rounded-full"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {['Récitation de Protection Nocturne', 'Wird al-Nawawi Audio', 'Salawat al-Fatih 100x'].map((title, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-between text-xs text-gray-200"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-purple-400 font-mono">0{idx + 1}</span>
                            <span className="text-xs font-medium truncate">{title}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">14:30</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. RENDER MOCK FEED FOR: COMMUNITY */}
                {selectedFeed === 'community' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-teal-950/40 border border-teal-500/30 rounded-2xl text-teal-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-teal-400">
                        Cercle des Disciples & Fraternité
                      </span>
                      <p className="text-[11px] leading-tight">
                        Témoignages, questions rituelles et partages d'expériences spirituelles.
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-gray-800 border border-gray-700 space-y-2 text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold">
                          O
                        </div>
                        <div>
                          <span className="text-xs font-bold block">Ousmane D.</span>
                          <span className="text-[9px] text-gray-400 block">Il y a 20 min • Dakar</span>
                        </div>
                        <span className="ml-auto px-1.5 py-0.5 bg-teal-500/20 text-teal-300 rounded text-[9px] font-bold">
                          Témoignage
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-300 leading-relaxed">
                        Alhamdulillah, après avoir appliqué le wird de protection avec le carré 3x3 pendant 7 nuits, tous les cauchemars ont cessé.
                      </p>
                    </div>
                  </div>
                )}

                {/* 6. RENDER MOCK FEED FOR: STORE (BOUTIQUE SACRÉE) */}
                {selectedFeed === 'store' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { title: 'Manuscrit Shams al-Ma’arif', price: '25 000 FCFA', badge: 'Rare', img: '📜' },
                        { title: 'Encens Oudh Pur Royal', price: '15 000 FCFA', badge: 'Purifiant', img: '🌿' }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-gray-800 border border-gray-700 space-y-1.5 text-white"
                        >
                          <div className="w-full h-14 bg-gray-700/60 rounded-xl flex items-center justify-center text-2xl">
                            {item.img}
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold">
                            {item.badge}
                          </span>
                          <h6 className="text-[11px] font-bold truncate">{item.title}</h6>
                          <span className="text-xs font-mono font-bold text-emerald-400 block">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. RENDER MOCK FEED FOR: JOURNAL & PRIÈRES */}
                {selectedFeed === 'journal' && (
                  <div className="space-y-3">
                    {/* Hijri Card */}
                    <div className="p-3.5 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl border border-indigo-500/30 text-white space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-indigo-300">🌙 14 Safar 1448 H</span>
                        <span className="text-[10px] text-gray-300">Phase : Premier Quartier</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1 text-center pt-1 border-t border-indigo-800/60">
                        {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p, i) => (
                          <div key={i} className={`p-1 rounded-lg ${i === 3 ? 'bg-indigo-600 font-bold' : 'bg-gray-800/60'}`}>
                            <span className="text-[8px] block text-gray-300">{p}</span>
                            <span className="text-[9px] font-mono block">18:45</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Application Bottom Tab Bar (Fixed at bottom of phone) */}
              <div
                className={`w-full py-2 px-4 border-t flex items-center justify-around text-[10px] shrink-0 z-20 select-none ${
                  previewTheme === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                <div
                  onClick={() => setSelectedFeed('home')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                    selectedFeed === 'home' ? 'text-emerald-500 font-bold' : ''
                  }`}
                >
                  <Layout size={14} />
                  <span className="text-[9px]">Accueil</span>
                </div>
                <div
                  onClick={() => setSelectedFeed('tools')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                    selectedFeed === 'tools' ? 'text-amber-500 font-bold' : ''
                  }`}
                >
                  <Compass size={14} />
                  <span className="text-[9px]">Outils</span>
                </div>
                <div
                  onClick={() => setSelectedFeed('explore')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                    selectedFeed === 'explore' ? 'text-purple-500 font-bold' : ''
                  }`}
                >
                  <Headphones size={14} />
                  <span className="text-[9px]">Explorer</span>
                </div>
                <div
                  onClick={() => setSelectedFeed('store')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                    selectedFeed === 'store' ? 'text-orange-500 font-bold' : ''
                  }`}
                >
                  <ShoppingBag size={14} />
                  <span className="text-[9px]">Boutique</span>
                </div>
                <div
                  onClick={() => setSelectedFeed('journal')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                    selectedFeed === 'journal' ? 'text-indigo-500 font-bold' : ''
                  }`}
                >
                  <Calendar size={14} />
                  <span className="text-[9px]">Journal</span>
                </div>
              </div>

              {/* Bottom Home Indicator Bar (iPhone gesture bar) */}
              <div className="w-full bg-black/90 py-1.5 flex justify-center shrink-0">
                <div className="w-28 h-1 bg-gray-500/80 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
