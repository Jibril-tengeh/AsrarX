import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Moon,
  Clock,
  Compass,
  Sparkles,
  Layers,
  Leaf,
  Heart,
  Grid3X3,
  BookOpen,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { COMPARATIVE_TRANSLATIONS } from '../../../components/comparative/comparativeTranslations';
import { NakshatrasTab } from '../../../components/comparative/NakshatrasTab';
import { VedicDashasTab } from '../../../components/comparative/VedicDashasTab';
import { ZodiacComparatorTab } from '../../../components/comparative/ZodiacComparatorTab';
import { ChineseAstrologyTab } from '../../../components/comparative/ChineseAstrologyTab';
import { FengShuiKuaTab } from '../../../components/comparative/FengShuiKuaTab';
import { BaGuaGeneratorTab } from '../../../components/comparative/BaGuaGeneratorTab';
import { TasyirCalculatorTab } from '../../../components/comparative/TasyirCalculatorTab';
import { SynastryModuleTab } from '../../../components/comparative/SynastryModuleTab';
import { SubtleCentersTab } from '../../../components/comparative/SubtleCentersTab';
import { SacredPlantsLibraryTab } from '../../../components/comparative/SacredPlantsLibraryTab';

export const ComparativeTraditionsHub: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang: 'fr' | 'en' | 'ha' = (language === 'en' || language === 'ha') ? language : 'fr';
  const t = COMPARATIVE_TRANSLATIONS[lang] || COMPARATIVE_TRANSLATIONS.fr;

  const [activeSection, setActiveSection] = useState<'comparative' | 'fengshui' | 'astrology' | 'subtle'>('comparative');
  const [activeTab, setActiveTab] = useState<string>('nakshatras');

  const sections = [
    {
      id: 'comparative',
      label: t.sections.comparative,
      icon: Compass,
      tabs: [
        { id: 'nakshatras', label: t.tabs.nakshatras, icon: Moon },
        { id: 'dashas', label: t.tabs.dashas, icon: Clock },
        { id: 'zodiacs', label: t.tabs.zodiacs, icon: Compass },
        { id: 'chinese', label: t.tabs.chinese, icon: Sparkles }
      ]
    },
    {
      id: 'fengshui',
      label: t.sections.fengshui,
      icon: Grid3X3,
      tabs: [
        { id: 'kua', label: t.tabs.kua, icon: Compass },
        { id: 'bagua', label: t.tabs.bagua, icon: Grid3X3 }
      ]
    },
    {
      id: 'astrology',
      label: t.sections.astrology,
      icon: Sparkles,
      tabs: [
        { id: 'tasyir', label: t.tabs.tasyir, icon: Clock },
        { id: 'synastry', label: t.tabs.synastry, icon: Heart }
      ]
    },
    {
      id: 'subtle',
      label: t.sections.subtle,
      icon: Layers,
      tabs: [
        { id: 'subtleCenters', label: t.tabs.subtleCenters, icon: Layers },
        { id: 'plants', label: t.tabs.plants, icon: Leaf }
      ]
    }
  ];

  const currentSectionData = sections.find(s => s.id === activeSection) || sections[0];

  const handleSectionChange = (sectionId: 'comparative' | 'fengshui' | 'astrology' | 'subtle') => {
    setActiveSection(sectionId);
    const targetSection = sections.find(s => s.id === sectionId);
    if (targetSection && targetSection.tabs.length > 0) {
      setActiveTab(targetSection.tabs[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <button
              onClick={() => navigate('/user/tools')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToTools}
            </button>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              <span className="p-2 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-purple-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Compass className="w-6 h-6" />
              </span>
              {t.pageTitle}
            </h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-3xl">
              {t.pageSubtitle}
            </p>
          </div>
        </div>

        {/* Major Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 rounded-3xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60">
          {sections.map((sec) => {
            const isSelected = activeSection === sec.id;
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleSectionChange(sec.id as any)}
                className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-gray-900 text-amber-600 dark:text-amber-400 shadow-md shadow-amber-500/10 border border-gray-200/80 dark:border-gray-700'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-Tabs Pills */}
        <div className="flex flex-wrap gap-2">
          {currentSectionData.tabs.map((tab) => {
            const isTabActive = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                  isTabActive
                    ? 'bg-amber-600 dark:bg-amber-500 text-white border-amber-600 dark:border-amber-500 shadow-md shadow-amber-500/20'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-amber-500/40'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Viewport */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'nakshatras' && <NakshatrasTab t={t} lang={lang} />}
              {activeTab === 'dashas' && <VedicDashasTab t={t} lang={lang} />}
              {activeTab === 'zodiacs' && <ZodiacComparatorTab t={t} lang={lang} />}
              {activeTab === 'chinese' && <ChineseAstrologyTab t={t} lang={lang} />}
              {activeTab === 'kua' && <FengShuiKuaTab t={t} lang={lang} />}
              {activeTab === 'bagua' && <BaGuaGeneratorTab t={t} lang={lang} />}
              {activeTab === 'tasyir' && <TasyirCalculatorTab t={t} lang={lang} />}
              {activeTab === 'synastry' && <SynastryModuleTab t={t} lang={lang} />}
              {activeTab === 'subtleCenters' && <SubtleCentersTab t={t} lang={lang} />}
              {activeTab === 'plants' && <SacredPlantsLibraryTab t={t} lang={lang} />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
