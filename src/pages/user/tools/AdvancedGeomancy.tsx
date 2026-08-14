import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Compass, 
  Sparkles, 
  Globe, 
  Layers, 
  RefreshCw, 
  Copy, 
  Check, 
  Sliders, 
  Touchpad, 
  Calculator, 
  Download,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { 
  CLASSICAL_16_FIGURES, 
  Geomantic16Figure, 
  generate16HousesFrom4Mothers 
} from '../../../data/geomancyTraditionsData';
import { GEOMANCY_TRADITIONS_I18N } from '../../../data/geomancyTraditionsTranslations';
import { ClassicalArabicTab } from '../../../components/geomancyTraditions/ClassicalArabicTab';
import { MaghrebiGeomancyTab } from '../../../components/geomancyTraditions/MaghrebiGeomancyTab';
import { AfricanIfaSikidyTab } from '../../../components/geomancyTraditions/AfricanIfaSikidyTab';

export const AdvancedGeomancy: React.FC = () => {
  const { language } = useLanguage();
  const langKey = (language === 'fr' || language === 'en' || language === 'ha') ? language : 'fr';
  const t = GEOMANCY_TRADITIONS_I18N[langKey] || GEOMANCY_TRADITIONS_I18N.fr;

  // Master Tradition Tabs
  const [activeMainTab, setActiveMainTab] = useState<'arabic' | 'maghrebi' | 'african' | 'chart16'>('arabic');

  // 16 Houses Theme State (Defaults to Al-Jama'ah / Tariq / etc.)
  const [houses, setHouses] = useState<Geomantic16Figure[]>(() => {
    // Generate initial balanced theme
    return generate16HousesFrom4Mothers(
      CLASSICAL_16_FIGURES[0],
      CLASSICAL_16_FIGURES[2],
      CLASSICAL_16_FIGURES[7],
      CLASSICAL_16_FIGURES[10]
    );
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Random / Custom Theme Generator
  const generateNewTheme = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const shuffled = [...CLASSICAL_16_FIGURES].sort(() => 0.5 - Math.random());
      const m1 = shuffled[0];
      const m2 = shuffled[1];
      const m3 = shuffled[2];
      const m4 = shuffled[3];
      const newChart = generate16HousesFrom4Mothers(m1, m2, m3, m4);
      setHouses(newChart);
      setIsGenerating(false);
    }, 450);
  };

  const handleCopySynthesis = () => {
    const lines = houses.map((h, i) => `Maison ${i + 1}: ${h.nameFr} (${h.nameAr}) [${h.element.toUpperCase()}]`);
    const summary = `=== ASRARHUB - GÉOMANCIE AVANCÉE DES 3 TRADITIONS ===\nDate: ${new Date().toLocaleString()}\n\n${lines.join('\n')}`;
    navigator.clipboard.writeText(summary);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // Helper for dots
  const renderDotsVisual = (dots: [number, number, number, number]) => (
    <div className="flex flex-col items-center justify-center space-y-1 py-1.5 px-2.5 bg-amber-500/5 dark:bg-stone-900/60 rounded-lg border border-amber-500/20 dark:border-amber-500/30">
      {dots.map((val, idx) => (
        <div key={idx} className="flex items-center space-x-1 h-2.5">
          {val === 1 ? (
            <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 shadow-sm" />
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 shadow-sm" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 shadow-sm" />
            </>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 safe-area-pt min-h-screen pb-24 flex flex-col space-y-6">
      {/* Top Navigation & Header */}
      <div className="shrink-0">
        <Link 
          to="/tools" 
          className="inline-flex items-center text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium mb-3 transition-colors text-sm"
        >
          <ArrowLeft className="mr-2" size={18} />
          {langKey === 'fr' ? "Retour aux Outils" : langKey === 'ha' ? "Koma zuwa Kayan Aiki" : "Back to Tools"}
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{t.headerBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
              <Compass className="text-amber-600 dark:text-amber-400 shrink-0" size={32} />
              <span>{t.mainTitle}</span>
            </h1>
            <p className="text-stone-600 dark:text-stone-300 mt-1.5 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={generateNewTheme}
              disabled={isGenerating}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? "Génération..." : t.btnGenerateNewChart}</span>
            </button>

            <button
              onClick={handleCopySynthesis}
              className="px-3.5 py-2 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-amber-300 border border-stone-200 dark:border-amber-500/30 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              {copiedReport ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-stone-500 dark:text-stone-400" />}
              <span>{copiedReport ? t.copiedSuccess : t.btnCopyData}</span>
            </button>
          </div>
        </div>

        <div className="mt-2">
          <ToolInfoTooltip toolId="geomancy" />
        </div>
      </div>

      {/* Main Tradition Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 bg-stone-100 dark:bg-stone-900/80 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm dark:shadow-lg">
        <button
          onClick={() => setActiveMainTab('arabic')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'arabic'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md scale-[1.02]'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/80 dark:hover:bg-stone-800/60'
          }`}
        >
          <span>{t.tabArabic}</span>
        </button>

        <button
          onClick={() => setActiveMainTab('maghrebi')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'maghrebi'
              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-md scale-[1.02]'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/80 dark:hover:bg-stone-800/60'
          }`}
        >
          <span>{t.tabMaghrebi}</span>
        </button>

        <button
          onClick={() => setActiveMainTab('african')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'african'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md scale-[1.02]'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/80 dark:hover:bg-stone-800/60'
          }`}
        >
          <span>{t.tabAfrican}</span>
        </button>

        <button
          onClick={() => setActiveMainTab('chart16')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'chart16'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-stone-800 dark:to-stone-900 text-white dark:text-amber-300 border border-indigo-500 dark:border-amber-500/40 shadow-md scale-[1.02]'
              : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/80 dark:hover:bg-stone-800/60'
          }`}
        >
          <span>{t.tabChart16}</span>
        </button>
      </div>

      {/* Tradition Tab Panels */}
      <div className="space-y-6">
        {activeMainTab === 'arabic' && (
          <ClassicalArabicTab houses={houses} lang={langKey} />
        )}

        {activeMainTab === 'maghrebi' && (
          <MaghrebiGeomancyTab houses={houses} lang={langKey} />
        )}

        {activeMainTab === 'african' && (
          <AfricanIfaSikidyTab houses={houses} lang={langKey} />
        )}

        {/* 16 Houses Interactive Grid View */}
        {activeMainTab === 'chart16' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-6 shadow-sm dark:shadow-md"
          >
            <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-amber-300 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  {t.tabChart16}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  {langKey === 'fr' 
                    ? "Les 16 Maisons Géomantiques du Thème Actif (4 Mères, 4 Filles, 4 Nièces, 2 Témoins, 1 Juge, 1 Issue Suprême)"
                    : langKey === 'ha'
                    ? "Gidaje 16 na Teburin Ramli (Uwaye 4, 'Ya'ya 4, Jikoki 4, Shaidu 2, Alkali 1, Sirrin Karshe 1)"
                    : "The 16 Geomantic Houses of Current Theme (4 Mothers, 4 Daughters, 4 Nieces, 2 Witnesses, 1 Judge, 1 Supreme Verdict)"
                  }
                </p>
              </div>
            </div>

            {/* 16 Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {houses.map((fig, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 rounded-xl flex flex-col items-center text-center space-y-2 transition-all shadow-sm"
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                    M{idx + 1}
                  </span>

                  {renderDotsVisual(fig.dots)}

                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-stone-900 dark:text-stone-200 line-clamp-1">
                      {langKey === 'fr' ? fig.nameFr : langKey === 'ha' ? fig.nameHa : fig.nameEn}
                    </h5>
                    <p className="text-[11px] font-serif text-amber-700 dark:text-amber-400/90 font-medium">{fig.nameAr}</p>
                  </div>

                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-200/80 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-400 uppercase font-medium">
                    {fig.element}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
