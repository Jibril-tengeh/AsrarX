import React, { useState, useEffect } from 'react';
import {
  Calculator,
  ArrowLeft,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  History,
  Save,
  Download,
  Feather,
  Sparkles,
  PieChart,
  Flame,
  Wind,
  Droplets,
  Mountain,
  Heart,
  HelpCircle,
  X,
  BookOpen,
  Layers,
  Search,
  Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { CalculationHistoryModal } from '../../../components/CalculationHistoryModal';
import { saveCalculationToHistory } from '../../../utils/calculationHistory';
import { exportWirdToImage } from '../../../utils/wirdExporter';
import { ShareToCommunityModal } from '../../../components/ShareToCommunityModal';

import {
  calculateDetailedAbjad,
  DetailedAbjadCalculation
} from '../../../utils/abjadMasterEngine';

import { AbjadDualSystemBanner } from '../../../components/abjad/AbjadDualSystemBanner';
import { AbjadElementalAnatomyTab } from '../../../components/abjad/AbjadElementalAnatomyTab';
import { AbjadKhoddamTab } from '../../../components/abjad/AbjadKhoddamTab';
import { AbjadDivineMatchesTab } from '../../../components/abjad/AbjadDivineMatchesTab';
import { AbjadTawafuqTab } from '../../../components/abjad/AbjadTawafuqTab';

const QUICK_PRESETS = [
  { label: 'Basmala (786)', text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
  { label: 'Tawhid (165)', text: 'لَا إِلَٰهَ إِلَّا اللَّهُ' },
  { label: 'Ya Latif (129)', text: 'يَا لَطِيفُ' },
  { label: 'Ayat Kursi début (598)', text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ' },
  { label: 'Salat al-Fatih (1144)', text: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ' },
  { label: 'Kaf-Ha-Ya-Ain-Sad', text: 'كهيعص' }
];

export const AbjadCalculator: React.FC = () => {
  const { language } = useLanguage();

  // Active System State (Mashriqi vs Maghribi)
  const [system, setSystem] = useState<'mashriqi' | 'maghribi'>('mashriqi');

  // Navigation Tabs: 5 Dedicated Advanced Modes
  const [activeTab, setActiveTab] = useState<'calc' | 'elements' | 'khoddam' | 'divine' | 'tawafuq'>('calc');

  // Primary Input
  const [inputText, setInputText] = useState<string>('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
  const [copied, setCopied] = useState<boolean>(false);
  const [showWords, setShowWords] = useState<boolean>(true);
  const [showLetters, setShowLetters] = useState<boolean>(false);

  // Modals
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState<boolean>(false);

  // Load from local storage
  useEffect(() => {
    try {
      const savedText = localStorage.getItem('abjad_master_text');
      if (savedText) setInputText(savedText);
      const savedSystem = localStorage.getItem('abjad_master_system') as 'mashriqi' | 'maghribi';
      if (savedSystem) setSystem(savedSystem);
    } catch (e) {
      console.warn('Failed to load abjad master cache', e);
    }
  }, []);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem('abjad_master_text', inputText);
      localStorage.setItem('abjad_master_system', system);
    } catch (e) {}
  }, [inputText, system]);

  // Compute Full Breakdown via Master Engine
  const calculation: DetailedAbjadCalculation = calculateDetailedAbjad(inputText, system);

  const handleCopyVal = (val: number) => {
    navigator.clipboard.writeText(val.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToHistory = () => {
    if (!inputText.trim() || calculation.activeTotal === 0) return;
    saveCalculationToHistory({
      toolId: 'abjad',
      toolName: 'Moteur Abjad & Rūḥāniyya Master',
      title: inputText.trim().slice(0, 45),
      summary: `Total ${system.toUpperCase()}: ${calculation.activeTotal} (Mashriq: ${calculation.totalMashriqi} | Maghrib: ${calculation.totalMaghribi}) | ${calculation.wordCount} mots, ${calculation.letterCount} lettres`,
      details: {
        text: inputText.trim(),
        system,
        totalMashriqi: calculation.totalMashriqi,
        totalMaghribi: calculation.totalMaghribi,
        elemental: calculation.elemental,
        radiance: calculation.radiance
      },
      tags: ['Abjad', 'Khoddam', 'Éléments', 'Tawafuq']
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-6 lg:p-8 safe-area-pt min-h-screen pb-24 flex flex-col space-y-4">
      {/* Top Main Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/tools"
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            title="Retour aux outils"
          >
            <ArrowLeft size={22} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Calculator className="text-blue-600 dark:text-blue-400" />
                <span>Moteur Abjad & Rūḥāniyya Master</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold uppercase tracking-wide border border-blue-200 dark:border-blue-800">
                PRO 5-en-1
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Double système Abjad, anatomie élémentaire, Khoddam, correspondances divines & Tawāfuq.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title="Aide & Science de l'Abjad"
          >
            <HelpCircle size={18} />
          </button>

          <button
            type="button"
            onClick={() => setShowHistory(true)}
            className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <History size={15} />
            <span>Historique</span>
          </button>
        </div>
      </div>

      {/* Feature 1: Dual System Switcher Banner */}
      <AbjadDualSystemBanner
        activeSystem={system}
        onSystemChange={(sys) => setSystem(sys)}
        valMashriqi={calculation.totalMashriqi}
        valMaghribi={calculation.totalMaghribi}
        onCopyVal={handleCopyVal}
        copied={copied}
      />

      {/* 5 Main Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-gray-200 dark:border-gray-700 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('calc')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'calc'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <Calculator size={15} />
          <span>1. Calculateur & Mots</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('elements')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'elements'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <PieChart size={15} />
          <span>2. Anatomie Élémentaire (4 Éléments & Nūr/Zulm)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('khoddam')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'khoddam'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <Sparkles size={15} />
          <span>3. Générateur Khoddam & Rūḥāniyya</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('divine')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'divine'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <BookOpen size={15} />
          <span>4. Noms Divins & Versets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tawafuq')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'tawafuq'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <Heart size={15} />
          <span>5. Compatibilité (Tawafouq)</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {/* Primary Arabic Input Card (Displayed across primary calculation tabs) */}
        {activeTab !== 'tawafuq' && (
          <div className="bg-white dark:bg-gray-800/95 rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Saisie du Texte, Nom ou Formule (en Arabe) :
              </label>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {QUICK_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(p.text)}
                    className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 text-[11px] font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap transition-all cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Entrez votre nom, intention ou verset coranique en arabe..."
              dir="rtl"
              rows={3}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-2xl sm:text-3xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-arabic leading-relaxed"
            />

            {/* Input Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <span>Mots : <strong className="text-gray-900 dark:text-white">{calculation.wordCount}</strong></span>
                <span>Lettres : <strong className="text-gray-900 dark:text-white">{calculation.letterCount}</strong></span>
                <span>Lettres Uniques : <strong className="text-blue-600 dark:text-blue-400">{calculation.uniqueLetterCount}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveToHistory}
                  disabled={!inputText.trim() || calculation.activeTotal === 0}
                  className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Save size={14} />
                  <span>Enregistrer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Effacer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: CALCULATEUR & DÉCOMPOSITION */}
        {activeTab === 'calc' && (
          <div className="space-y-6">
            {/* Export & Community Actions */}
            {calculation.activeTotal > 0 && (
              <div className="flex flex-wrap items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    exportWirdToImage({
                      arabicZikr: inputText,
                      transliteration: `Abjad Oriental: ${calculation.totalMashriqi} | Abjad Maghrébin: ${calculation.totalMaghribi}`,
                      abjadWeight: calculation.activeTotal,
                      title: `ANALYSE ABJAD MASTER (${calculation.wordCount} Mots, ${calculation.letterCount} Lettres)`,
                      meaningFr: `Éléments : Feu ${calculation.elemental.fire.percentage}%, Air ${calculation.elemental.air.percentage}%, Eau ${calculation.elemental.water.percentage}%, Terre ${calculation.elemental.earth.percentage}% | Dominante: ${calculation.elemental.dominant.toUpperCase()}`,
                      isParchment: false
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                  title="Télécharger en PNG Deluxe"
                >
                  <Download size={14} className="text-emerald-400" />
                  <span>PNG Deluxe</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    exportWirdToImage({
                      arabicZikr: inputText,
                      transliteration: `Abjad Oriental: ${calculation.totalMashriqi} | Abjad Maghrébin: ${calculation.totalMaghribi}`,
                      abjadWeight: calculation.activeTotal,
                      title: `PARCHEMIN SACRÉ ABJAD`,
                      meaningFr: `Éléments : Feu ${calculation.elemental.fire.percentage}%, Air ${calculation.elemental.air.percentage}%, Eau ${calculation.elemental.water.percentage}%, Terre ${calculation.elemental.earth.percentage}%`,
                      isParchment: true
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                  title="Télécharger sous forme de Parchemin Sacré"
                >
                  <Feather size={14} />
                  <span>Parchemin Sacré</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCommunityModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Publier</span>
                </button>
              </div>
            )}

            {/* Word-by-Word Breakdown Accordion */}
            {calculation.words.length > 0 && (
              <div className="bg-white dark:bg-gray-800/95 rounded-3xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowWords(!showWords)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Layers size={16} className="text-blue-500" />
                    <span>Décomposition Mot par Mot ({calculation.words.length} Mots)</span>
                  </h3>
                  {showWords ? <ChevronUp className="text-gray-400" size={18} /> : <ChevronDown className="text-gray-400" size={18} />}
                </button>

                <AnimatePresence>
                  {showWords && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 flex flex-wrap gap-2.5 justify-end border-t border-gray-100 dark:border-gray-700" dir="rtl">
                        {calculation.words.map((item, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center bg-gray-50 dark:bg-gray-900 rounded-2xl p-3 min-w-[5rem] border border-gray-200 dark:border-gray-700 shadow-2xs"
                          >
                            <span className="text-xl font-bold text-gray-900 dark:text-white mb-1 font-arabic">
                              {item.word}
                            </span>
                            <div className="flex gap-2 text-xs w-full justify-center">
                              <span className="text-blue-600 dark:text-blue-400 font-extrabold" title="Mashriq">
                                {item.valMashriqi}
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold" title="Maghrib">
                                {item.valMaghribi}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Letter-by-Letter Breakdown Accordion */}
            {calculation.characters.length > 0 && (
              <div className="bg-white dark:bg-gray-800/95 rounded-3xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowLetters(!showLetters)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Search size={16} className="text-emerald-500" />
                    <span>Décomposition Lettre par Lettre ({calculation.letterCount} Lettres)</span>
                  </h3>
                  {showLetters ? <ChevronUp className="text-gray-400" size={18} /> : <ChevronDown className="text-gray-400" size={18} />}
                </button>

                <AnimatePresence>
                  {showLetters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 flex flex-wrap gap-2 justify-end border-t border-gray-100 dark:border-gray-700" dir="rtl">
                        {calculation.characters.map((item, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center rounded-xl p-2 min-w-[3.2rem] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                          >
                            <span className="text-lg font-bold text-gray-900 dark:text-white mb-0.5 font-arabic">
                              {item.char}
                            </span>
                            <div className="flex gap-1.5 text-[10px] w-full justify-center">
                              <span className="text-blue-600 dark:text-blue-400 font-bold">
                                {item.valMashriqi}
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                {item.valMaghribi}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ANATOMIE ÉLÉMENTAIRE & LETTRES LUMINEUSES */}
        {activeTab === 'elements' && (
          <AbjadElementalAnatomyTab calculation={calculation} />
        )}

        {/* TAB 3: GÉNÉRATEUR DE KHODDAM & RŪḤĀNIYYA */}
        {activeTab === 'khoddam' && (
          <AbjadKhoddamTab
            abjadValue={calculation.activeTotal}
            system={system}
            dominantElement={calculation.elemental.dominant}
            inputText={inputText}
          />
        )}

        {/* TAB 4: CORRESPONDANCES DIVINES & VERSETS */}
        {activeTab === 'divine' && (
          <AbjadDivineMatchesTab
            abjadValue={calculation.activeTotal}
            system={system}
          />
        )}

        {/* TAB 5: TEST D'AFFINITÉ & COMPATIBILITÉ (TAWAFOUQ) */}
        {activeTab === 'tawafuq' && (
          <AbjadTawafuqTab system={system} />
        )}
      </div>

      {/* Calculation History Modal */}
      <CalculationHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        toolFilter="abjad"
        onSelectCalculation={(item) => {
          if (item.details?.text) {
            setInputText(item.details.text);
          } else if (item.title) {
            setInputText(item.title);
          }
        }}
      />

      {/* Share to Community Modal */}
      <ShareToCommunityModal
        isOpen={isCommunityModalOpen}
        onClose={() => setIsCommunityModalOpen(false)}
        title="Publier l'Analyse Abjad & Khoddam"
        category="calcul"
        itemTitle={`Analyse Abjad : "${inputText.slice(0, 40)}${inputText.length > 40 ? '...' : ''}"`}
        detailsText={`Texte : "${inputText}"\nTotal Abjad Oriental : ${calculation.totalMashriqi}\nTotal Abjad Maghrébin : ${calculation.totalMaghribi}\nÉléments : Feu ${calculation.elemental.fire.percentage}%, Air ${calculation.elemental.air.percentage}%, Eau ${calculation.elemental.water.percentage}%, Terre ${calculation.elemental.earth.percentage}%\nTempérament Dominant : ${calculation.elemental.temperamentTitleFr}`}
      />

      {/* Abjad Science & Help Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfoModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl max-w-lg w-full relative border border-gray-100 dark:border-gray-700 z-10 max-h-[90vh] overflow-y-auto space-y-4"
            >
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                  <Calculator size={22} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Science de l'Abjad & Extraction des Serviteurs
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  <strong>L'Abjad (حساب الجمل)</strong> est le système millénaire de numérologie sacrée attribuant une valeur numérique à chacune des 28 lettres arabes.
                </p>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                  <p className="font-bold text-gray-900 dark:text-white">Différence des Deux Systèmes :</p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <li><strong>Abjad Oriental (Hawwaz) :</strong> Système standardisé au Moyen-Orient (سعفص / قرشت).</li>
                    <li><strong>Abjad Maghrébin (Abajad) :</strong> Système traditionnel du Maghreb et d'Afrique de l'Ouest (صعفض / قرست).</li>
                  </ul>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 space-y-1">
                  <p className="font-bold text-purple-900 dark:text-purple-300">Extraction des Khoddam (Istikhrāj) :</p>
                  <p className="text-xs text-purple-800 dark:text-purple-300">
                    Les chiffres sont convertis en leurs lettres racines respectives, puis associés à des suffixes angéliques (-īl pour les anges célestes, -ṭash pour l'action, -lūsh pour la protection).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                J'ai compris
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
