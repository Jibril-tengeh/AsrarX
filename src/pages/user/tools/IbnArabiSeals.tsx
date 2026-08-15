import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Sparkles, Crown, Compass, Layers, GitBranch, Star, 
  Download, Copy, Check, Info, RefreshCw, Eye, Share2, Shield,
  Feather, BookOpen, ChevronRight, HelpCircle, Flame, Droplets,
  Wind, Mountain, Crosshair, Zap, Award, ChevronDown, ChevronUp, Languages,
  Radio, Volume2, Activity, CheckCircle2, Sparkle, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useFeatures } from '../../../contexts/FeatureContext';
import { ParchmentExporterModal } from '../../../components/ParchmentExporterModal';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { SealExportButtons } from '../../../components/SealExportButtons';
import { AccessRestrictionModal, RestrictionType } from '../../../components/AccessRestrictionModal';
import { checkFeatureAccess } from '../../../utils/featureAccess';
import { IBN_ARABI_TRANSLATIONS, IbnArabiTranslations } from '../../../data/ibnArabiTranslations';
import { 
  ARABIC_LETTERS_METAPHYSICS, 
  ARABIC_LETTER_MAP, 
  ArabicLetterMeta, 
  cleanAndExtractLetters, 
  computeTotalAdad, 
  AKBARI_PRESETS, 
  PENTAGRAM_PRESETS, 
  ARCHANGELS_DATA, 
  computeDualInterlockingWafq, 
  SHAJARAT_NODES,
  ShajaratNode
} from '../../../data/ibnArabiData';

export const IbnArabiSeals: React.FC = () => {
  const { language } = useLanguage();
  const langKey = (language === 'ha' || language === 'en' ? language : 'fr') as 'fr' | 'en' | 'ha';
  const tStrings: IbnArabiTranslations = IBN_ARABI_TRANSLATIONS[langKey];

  const { user, isPremium } = useAuth();
  const { featureToggles } = useFeatures();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'huroof' | 'angels' | 'mutaqati' | 'shajarat' | 'pentagram'>('huroof');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modals
  const [isParchmentOpen, setIsParchmentOpen] = useState(false);
  const [restrictionModal, setRestrictionModal] = useState<{
    isOpen: boolean;
    type: RestrictionType;
    featureName?: string;
  }>({ isOpen: false, type: null });

  // Dedicated DOM Refs for PNG and Parchment Direct Exports
  const wafqHuroofRef = useRef<HTMLDivElement>(null);
  const angelsSealRef = useRef<HTMLDivElement>(null);
  const mutaqatiSealRef = useRef<HTMLDivElement>(null);
  const shajaratTreeRef = useRef<HTMLDivElement>(null);
  const pentagramSealRef = useRef<HTMLDivElement>(null);

  // ----------------------------------------------------
  // TAB 1: WAFQ AL-HUROOF STATE & CALCULATIONS
  // ----------------------------------------------------
  const [huroofInput, setHuroofInput] = useState('الله الحي القيوم');
  const [huroofGridSize, setHuroofGridSize] = useState<number>(3);
  const [huroofMode, setHuroofMode] = useState<
    'metaphysical' | 'elemental' | 'polarity' | 'archangels' | 'triad' | 'makharij' | 'abjad_order' | 'spiral'
  >('metaphysical');
  const [selectedCellLetter, setSelectedCellLetter] = useState<ArabicLetterMeta | null>(null);

  const LUMINOUS_LETTERS = useMemo(() => new Set(['ا', 'ح', 'ر', 'س', 'ص', 'ط', 'ع', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'ه', 'ي']), []);

  const extractedLetters = useMemo(() => {
    const raw = cleanAndExtractLetters(huroofInput);
    if (raw.length === 0) {
      // Default fallback
      return cleanAndExtractLetters('الله');
    }
    return raw;
  }, [huroofInput]);

  const huroofAdadTotal = useMemo(() => computeTotalAdad(extractedLetters), [extractedLetters]);

  // Construct non-numeric consonant matrix according to dimension (3x3 up to 12x12) and mode
  const huroofMatrix = useMemo(() => {
    const totalCells = huroofGridSize * huroofGridSize;
    let basePool = extractedLetters.length > 0 ? [...extractedLetters] : [...ARABIC_LETTERS_METAPHYSICS];

    // Sort or reorganize pool according to active harmonic mode
    if (huroofMode === 'elemental') {
      const elementOrder = { fire: 0, air: 1, water: 2, earth: 3 };
      basePool.sort((a, b) => elementOrder[a.element] - elementOrder[b.element]);
    } else if (huroofMode === 'abjad_order') {
      basePool.sort((a, b) => a.adad - b.adad);
    } else if (huroofMode === 'polarity') {
      basePool.sort((a, b) => (LUMINOUS_LETTERS.has(b.letter) ? 1 : 0) - (LUMINOUS_LETTERS.has(a.letter) ? 1 : 0));
    }

    const rawCells: ArabicLetterMeta[] = [];
    for (let i = 0; i < totalCells; i++) {
      if (i < basePool.length) {
        rawCells.push(basePool[i]);
      } else {
        // Cyclical cosmological filling
        const offsetIndex = (i * 7) % ARABIC_LETTERS_METAPHYSICS.length;
        rawCells.push(ARABIC_LETTERS_METAPHYSICS[offsetIndex]);
      }
    }

    // Convert 1D to 2D grid (Support Spiral Tawaf mode or direct row-col)
    const grid: ArabicLetterMeta[][] = Array.from({ length: huroofGridSize }, () => Array(huroofGridSize).fill(null as any));

    if (huroofMode === 'spiral') {
      // Spiral placement from center outwards
      let top = 0, bottom = huroofGridSize - 1, left = 0, right = huroofGridSize - 1;
      let idx = 0;
      while (top <= bottom && left <= right && idx < totalCells) {
        for (let c = left; c <= right && idx < totalCells; c++) grid[top][c] = rawCells[idx++];
        top++;
        for (let r = top; r <= bottom && idx < totalCells; r++) grid[r][right] = rawCells[idx++];
        right--;
        if (top <= bottom) {
          for (let c = right; c >= left && idx < totalCells; c--) grid[bottom][c] = rawCells[idx++];
          bottom--;
        }
        if (left <= right) {
          for (let r = bottom; r >= top && idx < totalCells; r--) grid[r][left] = rawCells[idx++];
          left++;
        }
      }
    } else {
      for (let r = 0; r < huroofGridSize; r++) {
        for (let c = 0; c < huroofGridSize; c++) {
          grid[r][c] = rawCells[r * huroofGridSize + c];
        }
      }
    }

    return grid;
  }, [extractedLetters, huroofGridSize, huroofMode, LUMINOUS_LETTERS]);

  // World counts for distribution display
  const worldCounts = useMemo(() => {
    const counts = { hahut: 0, lahut: 0, jabarut: 0, malakut: 0, mulk: 0 };
    extractedLetters.forEach(l => {
      counts[l.world]++;
    });
    return counts;
  }, [extractedLetters]);

  // ----------------------------------------------------
  // TAB 2: FOUR ANGELS SEAL STATE & CALCULATIONS
  // ----------------------------------------------------
  const [angelsNameInput, setAngelsNameInput] = useState('');
  const [angelsIntention, setAngelsIntention] = useState<'wisdom' | 'abundance' | 'life' | 'victory'>('wisdom');
  const [showAngelInvocationTranslation, setShowAngelInvocationTranslation] = useState(false);

  const angelResonance = useMemo(() => {
    const nameAdad = computeTotalAdad(cleanAndExtractLetters(angelsNameInput || 'عبد الله'));
    const mod4 = nameAdad % 4;
    // 0: Israfil (North/Fire), 1: Jibril (East/Water), 2: Izrail (South/Air), 3: Mikail (West/Earth)
    const dominantIndex = mod4 === 1 ? 0 : mod4 === 3 ? 1 : mod4 === 0 ? 2 : 3;
    const dominantAngel = ARCHANGELS_DATA[dominantIndex];
    return {
      nameAdad,
      dominantAngel,
      rotationOffset: (nameAdad % 360)
    };
  }, [angelsNameInput]);

  // ----------------------------------------------------
  // TAB 3: WAFQ AL-MUTAQATI' (DUAL INTERLOCKING) STATE
  // ----------------------------------------------------
  const [mutaqatiValue, setMutaqatiValue] = useState<string>('66');
  const [mutaqatiStructure, setMutaqatiStructure] = useState<'concentric' | 'lattice'>('concentric');
  const [hoveredMutaqatiCell, setHoveredMutaqatiCell] = useState<{ r: number; c: number } | null>(null);

  const numericTarget = useMemo(() => {
    const val = parseInt(mutaqatiValue, 10);
    if (!isNaN(val) && val > 0) return val;
    const letters = cleanAndExtractLetters(mutaqatiValue);
    if (letters.length > 0) return computeTotalAdad(letters);
    return 66;
  }, [mutaqatiValue]);

  const dualWafqData = useMemo(() => computeDualInterlockingWafq(numericTarget), [numericTarget]);

  // ----------------------------------------------------
  // TAB 4: SHAJARAT AL-KAWN (TREE OF EXISTENCE) STATE
  // ----------------------------------------------------
  const [shajaratInputName, setShajaratInputName] = useState('');
  const [selectedShajaratNode, setSelectedShajaratNode] = useState<ShajaratNode>(SHAJARAT_NODES[0]);
  const [isNodeHighlighted, setIsNodeHighlighted] = useState(false);
  const shajaratDetailsRef = useRef<HTMLDivElement>(null);

  const handleSelectShajaratNode = (node: ShajaratNode) => {
    setSelectedShajaratNode(node);
    setIsNodeHighlighted(true);
    setTimeout(() => setIsNodeHighlighted(false), 1400);

    // Direct, seamless navigation into deep details section
    setTimeout(() => {
      if (shajaratDetailsRef.current) {
        shajaratDetailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const personalShajaratBranch = useMemo(() => {
    const letters = cleanAndExtractLetters(shajaratInputName || 'انسان');
    const adad = computeTotalAdad(letters);
    const nodeIndex = adad % SHAJARAT_NODES.length;
    return {
      adad,
      node: SHAJARAT_NODES[nodeIndex],
      rootLetter: letters[0] || ARABIC_LETTERS_METAPHYSICS[0]
    };
  }, [shajaratInputName]);

  // ----------------------------------------------------
  // TAB 5: NUMERICAL PENTAGRAMS STATE & CALCULATIONS
  // ----------------------------------------------------
  const [selectedPentagramPresetId, setSelectedPentagramPresetId] = useState<string>(PENTAGRAM_PRESETS[0].id);
  const [isRotatingPentagram, setIsRotatingPentagram] = useState(true);
  const [hoveredPentagramSummit, setHoveredPentagramSummit] = useState<number | null>(null);

  const activePentagramPreset = useMemo(() => {
    return PENTAGRAM_PRESETS.find(p => p.id === selectedPentagramPresetId) || PENTAGRAM_PRESETS[0];
  }, [selectedPentagramPresetId]);

  const pentagramTotalSum = useMemo(() => {
    const centerLetters = cleanAndExtractLetters(activePentagramPreset.centerNameAr);
    let total = computeTotalAdad(centerLetters);
    activePentagramPreset.namesAr.forEach(n => {
      total += computeTotalAdad(cleanAndExtractLetters(n));
    });
    return total;
  }, [activePentagramPreset]);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Safe action restriction check
  const handleProtectedAction = (action: () => void, featureId: string = 'ibn_arabi_download') => {
    const access = checkFeatureAccess(featureId, tStrings.toolTitle, featureToggles, user, isPremium);
    if (!access.allowed) {
      setRestrictionModal({ isOpen: true, type: access.restrictionType, featureName: access.featureName });
      return;
    }
    action();
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950 text-stone-900 dark:text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-900 dark:selection:text-amber-200">
      {/* Background Subtle Ambient Aura */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Top Header Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-amber-500/20 pb-6">
          <div className="space-y-2">
            <Link 
              to="/tools" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {tStrings.backToTools}
            </Link>
            
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 tracking-wide">
                <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                {tStrings.toolBadge}
              </span>
              <ToolInfoTooltip 
                title={tStrings.toolTitle} 
                content={tStrings.metaDesc} 
              />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight text-amber-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-amber-200 dark:via-amber-400 dark:to-amber-100">
              {tStrings.toolTitle}
            </h1>
            <p className="text-sm sm:text-base text-stone-700 dark:text-slate-300 max-w-3xl leading-relaxed">
              {tStrings.toolSubtitle}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              onClick={() => handleProtectedAction(() => setIsParchmentOpen(true), 'ibn_arabi_download')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-sm shadow-lg shadow-amber-900/20 transition-all transform active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{tStrings.saveParchment}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (5 Akbarian Sub-tools) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-1.5 bg-stone-200/80 dark:bg-slate-900/80 rounded-2xl border border-stone-300/80 dark:border-slate-800 backdrop-blur-md">
          {[
            { id: 'huroof', label: tStrings.tabWafqHuroof, icon: Feather },
            { id: 'angels', label: tStrings.tabFourAngels, icon: Compass },
            { id: 'mutaqati', label: tStrings.tabWafqMutaqati, icon: Layers },
            { id: 'shajarat', label: tStrings.tabShajarat, icon: GitBranch },
            { id: 'pentagram', label: tStrings.tabPentagram, icon: Star },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-white dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-400/50 dark:border-amber-500/40 shadow-sm font-bold' 
                    : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-stone-500 dark:text-slate-400'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: WAFQ AL-HUROOF (NON-NUMERIC CONSONANT SQUARE BY METAPHYSICAL REALMS) */}
        {/* ========================================================================= */}
        {activeTab === 'huroof' && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            {/* Concept Banner */}
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-gradient-to-r dark:from-amber-950/40 dark:via-slate-900/60 dark:to-slate-900/40 border border-amber-300 dark:border-amber-500/20 shadow-sm">
              <div className="flex items-start gap-3">
                <Feather className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h2 className="text-lg font-serif font-bold text-amber-900 dark:text-amber-200">{tStrings.huroofConceptTitle}</h2>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-slate-300 leading-relaxed">{tStrings.huroofConceptDesc}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    {tStrings.huroofInputLabel}
                  </label>
                  <input
                    type="text"
                    value={huroofInput}
                    onChange={(e) => setHuroofInput(e.target.value)}
                    placeholder={tStrings.huroofInputPlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-amber-200 text-lg font-serif focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-right shadow-inner"
                    dir="rtl"
                  />
                </div>

                {/* Presets */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-slate-400">
                    {tStrings.huroofPresetLabel}
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {AKBARI_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setHuroofInput(p.arabicText)}
                        className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                          huroofInput === p.arabicText
                            ? 'bg-amber-100/80 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 font-bold'
                            : 'bg-stone-50/80 dark:bg-slate-950/60 border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-300 hover:border-amber-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <span className="font-medium">
                          {langKey === 'ha' ? p.nameHa : langKey === 'en' ? p.nameEn : p.nameFr}
                        </span>
                        <span className="font-serif text-sm font-bold text-amber-700 dark:text-amber-400" dir="rtl">{p.arabicText}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Size & Mode Selection */}
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-stone-700 dark:text-slate-300">
                        {tStrings.huroofGridSizeLabel} <span className="text-amber-500 font-extrabold">({huroofGridSize}×{huroofGridSize} = {huroofGridSize * huroofGridSize} cases)</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 p-1 bg-stone-100 dark:bg-slate-950 rounded-xl border border-stone-300 dark:border-slate-800">
                      {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((size) => (
                        <button
                          key={size}
                          onClick={() => setHuroofGridSize(size)}
                          className={`py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                            huroofGridSize === size
                              ? 'bg-amber-500 text-stone-950 shadow-sm ring-1 ring-amber-400'
                              : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          {size}×{size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-slate-300 mb-1.5">
                      {tStrings.huroofClassifyBy}
                    </label>
                    <select
                      value={huroofMode}
                      onChange={(e) => setHuroofMode(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-300 dark:border-slate-800 text-xs font-medium text-stone-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="metaphysical">{tStrings.huroofClassifyMetaphysical}</option>
                      <option value="elemental">{tStrings.huroofClassifyElemental}</option>
                      <option value="polarity">{tStrings.huroofClassifyPolarity}</option>
                      <option value="archangels">{tStrings.huroofClassifyArchangels}</option>
                      <option value="triad">{tStrings.huroofClassifyTriad}</option>
                      <option value="makharij">{tStrings.huroofClassifyMakharij}</option>
                      <option value="abjad_order">{tStrings.huroofClassifyAbjad}</option>
                      <option value="spiral">{tStrings.huroofClassifySpiral}</option>
                    </select>
                  </div>
                </div>

                {/* Metrics Summary */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-stone-50 dark:bg-slate-950/80 border border-stone-200 dark:border-slate-800/80 text-xs">
                  <div>
                    <span className="text-stone-500 dark:text-slate-400 block">{tStrings.huroofLetterCount}</span>
                    <span className="text-base font-bold text-amber-700 dark:text-amber-300">{extractedLetters.length}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 dark:text-slate-400 block">{tStrings.huroofTotalAdad}</span>
                    <span className="text-base font-bold text-amber-700 dark:text-amber-400">{huroofAdadTotal}</span>
                  </div>
                </div>
              </div>

              {/* Matrix Display Column */}
              <div className="lg:col-span-7 space-y-5">
                <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-serif font-bold text-amber-900 dark:text-amber-200">{tStrings.huroofMatrixTitle}</h3>
                    <p className="text-xs text-stone-600 dark:text-slate-400">{tStrings.huroofMatrixSubtitle}</p>
                  </div>

                  {/* Pure Wafq Letter Matrix Display */}
                  <div 
                    ref={wafqHuroofRef}
                    className="p-3 sm:p-5 rounded-2xl bg-gradient-to-b from-stone-100 via-white to-stone-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-2 border-amber-500/40 shadow-xl dark:shadow-2xl dark:shadow-amber-950/40 w-full"
                    style={{ maxWidth: huroofGridSize > 8 ? '560px' : huroofGridSize > 5 ? '480px' : '420px' }}
                  >
                    <div 
                      className={`grid ${
                        huroofGridSize <= 4 ? 'gap-2' : huroofGridSize <= 6 ? 'gap-1.5' : huroofGridSize <= 9 ? 'gap-1' : 'gap-0.5'
                      }`}
                      style={{ gridTemplateColumns: `repeat(${huroofGridSize}, minmax(0, 1fr))` }}
                    >
                      {huroofMatrix.map((row, r) => 
                        row.map((item, c) => {
                          if (!item) return null;
                          const isSelected = selectedCellLetter?.letter === item.letter;
                          const isLuminous = LUMINOUS_LETTERS.has(item.letter);

                          // Color classes determined by active harmonic mode
                          let cellColorStyle = 'border-amber-400 dark:border-amber-400/80 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200';
                          if (huroofMode === 'elemental') {
                            cellColorStyle = 
                              item.element === 'fire' ? 'border-rose-400 dark:border-rose-500/80 bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200' :
                              item.element === 'air' ? 'border-amber-400 dark:border-amber-400/80 bg-amber-50 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200' :
                              item.element === 'water' ? 'border-sky-400 dark:border-sky-400/80 bg-sky-50 dark:bg-sky-950/50 text-sky-950 dark:text-sky-200' :
                              'border-emerald-400 dark:border-emerald-500/80 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200';
                          } else if (huroofMode === 'polarity') {
                            cellColorStyle = isLuminous 
                              ? 'border-amber-500 dark:border-amber-400 bg-amber-100 dark:bg-amber-500/20 text-amber-950 dark:text-amber-100 ring-1 ring-amber-400/40 font-bold' 
                              : 'border-stone-300 dark:border-slate-700 bg-stone-100 dark:bg-slate-900/60 text-stone-700 dark:text-slate-400';
                          } else if (huroofMode === 'archangels') {
                            cellColorStyle = 
                              item.element === 'fire' ? 'border-orange-400 dark:border-orange-500/80 bg-orange-50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200' : // Israfil
                              item.element === 'water' ? 'border-sky-400 dark:border-sky-400/80 bg-sky-50 dark:bg-sky-950/40 text-sky-950 dark:text-sky-200' : // Jibril
                              item.element === 'earth' ? 'border-emerald-400 dark:border-emerald-400/80 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200' : // Mikail
                              'border-purple-400 dark:border-purple-400/80 bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200'; // Izrail
                          } else if (huroofMode === 'triad') {
                            cellColorStyle = 
                              item.adad >= 100 ? 'border-violet-400 dark:border-violet-400/80 bg-violet-50 dark:bg-violet-950/40 text-violet-950 dark:text-violet-200' : // Ruh
                              item.adad >= 10 ? 'border-cyan-400 dark:border-cyan-400/80 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-950 dark:text-cyan-200' : // Nafs
                              'border-amber-400 dark:border-amber-400/80 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200'; // Jism
                          } else {
                            // Default: 5 Metaphysical Worlds
                            cellColorStyle = 
                              item.world === 'hahut' ? 'border-amber-400 dark:border-amber-400/80 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200' :
                              item.world === 'lahut' ? 'border-emerald-400 dark:border-emerald-400/80 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200' :
                              item.world === 'jabarut' ? 'border-indigo-400 dark:border-indigo-400/80 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200' :
                              item.world === 'malakut' ? 'border-sky-400 dark:border-sky-400/80 bg-sky-50 dark:bg-sky-950/40 text-sky-950 dark:text-sky-200' :
                              'border-rose-400 dark:border-rose-400/80 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200';
                          }

                          // Font sizing scaling based on grid dimensions
                          const letterFontSize = 
                            huroofGridSize <= 3 ? 'text-2xl sm:text-3xl' :
                            huroofGridSize <= 5 ? 'text-lg sm:text-2xl' :
                            huroofGridSize <= 7 ? 'text-base sm:text-lg' :
                            huroofGridSize <= 9 ? 'text-xs sm:text-sm' :
                            'text-[10px] sm:text-xs';

                          const adadFontSize = 
                            huroofGridSize <= 4 ? 'text-[10px]' :
                            huroofGridSize <= 6 ? 'text-[9px]' :
                            huroofGridSize <= 9 ? 'text-[8px]' :
                            'text-[7px]';

                          return (
                            <motion.button
                              key={`${r}-${c}`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedCellLetter(item)}
                              className={`aspect-square rounded-lg sm:rounded-xl border flex flex-col items-center justify-center p-0.5 sm:p-1 cursor-pointer transition-all ${cellColorStyle} ${
                                isSelected ? 'ring-2 ring-amber-500 dark:ring-amber-300 shadow-lg shadow-amber-500/20' : ''
                              }`}
                            >
                              <span className={`${letterFontSize} font-serif font-bold leading-none`}>{item.letter}</span>
                              <span className={`${adadFontSize} font-mono opacity-80 mt-0.5 leading-none`}>{item.adad}</span>
                            </motion.button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Actions Bar: Télécharger PNG & Parchemin */}
                  <SealExportButtons
                    targetRef={wafqHuroofRef}
                    title={`${tStrings.huroofMatrixTitle} (${huroofGridSize}×${huroofGridSize})`}
                    subtitle={`${tStrings.huroofTotalAdad} : ${huroofAdadTotal} • ${huroofInput}`}
                    parchmentContent={
                      <div className="space-y-4 text-center font-serif text-amber-950 p-2 sm:p-4">
                        <div className="bg-amber-50/80 border border-amber-900/40 rounded-xl p-3 shadow-xs">
                          <p className="text-sm font-arabic font-bold text-amber-950 text-base sm:text-lg">« {huroofInput} »</p>
                          <p className="text-xs text-amber-900/80 font-mono mt-1">
                            {tStrings.huroofTotalAdad} : <strong className="text-amber-950 font-bold">{huroofAdadTotal}</strong>
                          </p>
                        </div>
                        <div 
                          className="grid gap-1.5 max-w-[420px] mx-auto p-3.5 border-2 border-amber-900 bg-amber-50/90 rounded-2xl shadow-inner my-3"
                          style={{ gridTemplateColumns: `repeat(${huroofGridSize}, minmax(0, 1fr))` }}
                        >
                          {huroofMatrix.map((row, r) =>
                            row.map((cell, c) => {
                              if (!cell) return null;
                              return (
                                <div key={`${r}-${c}`} className="aspect-square border-2 border-amber-900/70 rounded-xl flex flex-col items-center justify-center p-1 bg-amber-100/70 shadow-xs">
                                  <span className={`${huroofGridSize > 7 ? 'text-sm' : huroofGridSize > 4 ? 'text-lg' : 'text-2xl'} font-bold text-amber-950 leading-none font-arabic`}>
                                    {cell.letter}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold text-amber-900 mt-1 leading-none">{cell.adad}</span>
                                </div>
                              );
                            })
                          )}
                        </div>
                        <div className="text-xs text-amber-900 pt-2 border-t border-amber-800/30 flex items-center justify-between px-2">
                          <span>{tStrings.huroofTotalAdad} : <strong className="text-amber-950">{huroofAdadTotal}</strong></span>
                          <span>Format : <strong>{huroofGridSize}×{huroofGridSize}</strong></span>
                        </div>
                      </div>
                    }
                  />

                  {/* Selected Letter Tooltip / Card */}
                  {selectedCellLetter && (
                    <motion.div 
                      initial={{ opacity: 0, y: 6 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full p-4 rounded-xl bg-stone-50 dark:bg-slate-950 border border-amber-400/50 dark:border-amber-500/30 text-xs space-y-2 shadow-sm"
                    >
                      <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-serif font-bold text-amber-700 dark:text-amber-400">{selectedCellLetter.letter}</span>
                          <span className="font-semibold text-stone-900 dark:text-slate-200">
                            {langKey === 'ha' ? selectedCellLetter.nameHa : langKey === 'en' ? selectedCellLetter.nameEn : selectedCellLetter.nameFr}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
                          {tStrings.huroofTooltipAdad} {selectedCellLetter.adad}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-700 dark:text-slate-300">
                        <div>
                          <span className="text-stone-500 dark:text-slate-400">{tStrings.huroofTooltipWorld} </span>
                          <span className="font-semibold text-amber-800 dark:text-amber-200 capitalize">{selectedCellLetter.world}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 dark:text-slate-400">{tStrings.huroofTooltipElement} </span>
                          <span className="font-semibold text-emerald-800 dark:text-emerald-300 capitalize">{selectedCellLetter.element}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-stone-500 dark:text-slate-400">{tStrings.huroofTooltipAngel} </span>
                          <span className="font-serif font-semibold text-amber-800 dark:text-amber-300">{selectedCellLetter.khadim}</span>
                        </div>
                        <div className="col-span-2 text-stone-800 dark:text-slate-200 italic pt-1 border-t border-stone-200 dark:border-slate-800/80">
                          "{langKey === 'ha' ? selectedCellLetter.esotericMeaningHa : langKey === 'en' ? selectedCellLetter.esotericMeaningEn : selectedCellLetter.esotericMeaningFr}"
                        </div>
                        <div className="col-span-2 pt-2">
                          <button
                            onClick={() => {
                              const match = SHAJARAT_NODES.find(n => n.letter === selectedCellLetter.letter) || SHAJARAT_NODES[0];
                              setActiveTab('shajarat');
                              handleSelectShajaratNode(match);
                            }}
                            className="w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <GitBranch className="w-3.5 h-3.5" />
                            <span>Découvrir cette lettre dans l'Arbre de l'Être (Shajarat al-Kawn)</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Dynamic Classification Legend */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-stone-200 dark:border-slate-800 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-slate-300">
                      {huroofMode === 'elemental' ? 'Harmonie des 4 Éléments (Ṭabā\'i\')' :
                       huroofMode === 'polarity' ? 'Polarité Lumineuse (Nūrāniyyah) & Obscure (Ẓulmāniyyah)' :
                       huroofMode === 'archangels' ? 'Les 4 Recteurs Archangéliques' :
                       huroofMode === 'triad' ? 'Triade Rūḥ (Esprit), Nafs (Âme), Jism (Corps)' :
                       huroofMode === 'spiral' ? 'Tawāf Cosmique (Émanation Spirale)' :
                       huroofMode === 'abjad_order' ? 'Ordre Théurgique Abjad' :
                       tStrings.huroofWorldsBreakdown}
                    </h4>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/20">
                      {huroofGridSize}×{huroofGridSize}
                    </span>
                  </div>

                  {huroofMode === 'elemental' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 text-rose-950 dark:text-rose-200">
                        <span className="font-bold">Feu (Nārī)</span>
                        <p className="text-[10px] text-stone-600 dark:text-slate-400 mt-0.5">Chaud & Sec • Volonté & Énergie</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/20 text-amber-950 dark:text-amber-200">
                        <span className="font-bold">Air (Hawā'ī)</span>
                        <p className="text-[10px] text-stone-600 dark:text-slate-400 mt-0.5">Chaud & Humide • Intellect & Souffle</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-500/20 text-sky-950 dark:text-sky-200">
                        <span className="font-bold">Eau (Mā'ī)</span>
                        <p className="text-[10px] text-stone-600 dark:text-slate-400 mt-0.5">Froid & Humide • Sagesse & Vie</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 text-emerald-950 dark:text-emerald-200">
                        <span className="font-bold">Terre (Turābī)</span>
                        <p className="text-[10px] text-stone-600 dark:text-slate-400 mt-0.5">Froid & Sec • Stabilité & Manifestation</p>
                      </div>
                    </div>
                  ) : huroofMode === 'polarity' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-500/40 text-amber-950 dark:text-amber-200">
                        <span className="font-bold text-amber-900 dark:text-amber-300">14 Lettres Lumineuses (الحروف النورانية)</span>
                        <p className="text-[11px] text-stone-900 dark:text-slate-300 mt-1 font-mono">ا ح ر س ص ط ع ق ك ل م ن هـ ي</p>
                        <p className="text-[10px] text-stone-600 dark:text-slate-400 mt-0.5">Lettres mystiques d'ouverture coranique (Muqatta'at).</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-stone-100 dark:bg-slate-950/40 border border-stone-300 dark:border-slate-700/40 text-stone-900 dark:text-slate-300">
                        <span className="font-bold text-stone-800 dark:text-slate-300">14 Lettres Obscures (الحروف الظلمانية)</span>
                        <p className="text-[11px] text-stone-700 dark:text-slate-400 mt-1 font-mono">ب ت ث ج خ د ذ ز ش ض ظ غ ف</p>
                        <p className="text-[10px] text-stone-600 dark:text-slate-400 mt-0.5">Lettres de consolidation matérielle et corporéité.</p>
                      </div>
                    </div>
                  ) : huroofMode === 'archangels' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-500/20 text-orange-950 dark:text-orange-200">
                        <span className="font-bold">Isrāfīl (Feu / Nord)</span>
                        <p className="text-[10px] text-stone-600 dark:text-slate-400 mt-0.5">Le Souffle de Résurrection</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-500/20 text-sky-950 dark:text-sky-200">
                        <span className="font-bold">Jibrīl (Eau / Est)</span>
                        <p className="text-[10px] text-stone-600 dark:text-slate-400 mt-0.5">La Révélation Spirituelle</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 text-emerald-950 dark:text-emerald-200">
                        <span className="font-bold">Mīkā'īl (Terre / Ouest)</span>
                        <p className="text-[10px] text-stone-600 dark:text-slate-400 mt-0.5">La Subsistance Universelle</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/20 text-purple-950 dark:text-purple-200">
                        <span className="font-bold">'Izrā'īl (Air / Sud)</span>
                        <p className="text-[10px] text-stone-600 dark:text-slate-400 mt-0.5">L'Ascension des Âmes</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-500/20 text-amber-950 dark:text-amber-200">
                        <span className="font-bold">{tStrings.huroofWorldHahut}</span>
                        <p className="text-[11px] text-stone-600 dark:text-slate-400 mt-0.5">{tStrings.huroofWorldHahutDesc}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/20 text-emerald-950 dark:text-emerald-200">
                        <span className="font-bold">{tStrings.huroofWorldLahut}</span>
                        <p className="text-[11px] text-stone-600 dark:text-slate-400 mt-0.5">{tStrings.huroofWorldLahutDesc}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-300 dark:border-indigo-500/20 text-indigo-950 dark:text-indigo-200">
                        <span className="font-bold">{tStrings.huroofWorldJabarut}</span>
                        <p className="text-[11px] text-stone-600 dark:text-slate-400 mt-0.5">{tStrings.huroofWorldJabarutDesc}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/20 border border-sky-300 dark:border-sky-500/20 text-sky-950 dark:text-sky-200">
                        <span className="font-bold">{tStrings.huroofWorldMalakut}</span>
                        <p className="text-[11px] text-stone-600 dark:text-slate-400 mt-0.5">{tStrings.huroofWorldMalakutDesc}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-500/20 text-rose-950 dark:text-rose-200 sm:col-span-2">
                        <span className="font-bold">{tStrings.huroofWorldMulk}</span>
                        <p className="text-[11px] text-stone-600 dark:text-slate-400 mt-0.5">{tStrings.huroofWorldMulkDesc}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FOUR ARCHANGELS / 4 CORNERS OF THE UNIVERSE */}
        {/* ========================================================================= */}
        {activeTab === 'angels' && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            {/* Concept Banner */}
            <div className="p-5 rounded-2xl bg-sky-50 dark:bg-gradient-to-r dark:from-sky-950/40 dark:via-slate-900/60 dark:to-slate-900/40 border border-sky-300 dark:border-sky-500/20 shadow-sm backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Compass className="w-6 h-6 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h2 className="text-lg font-serif font-bold text-sky-950 dark:text-sky-200">{tStrings.angelsConceptTitle}</h2>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-slate-300 leading-relaxed">{tStrings.angelsConceptDesc}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Input Form & Angel Resonance Card */}
              <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                    {tStrings.angelsNameInput}
                  </label>
                  <input
                    type="text"
                    value={angelsNameInput}
                    onChange={(e) => setAngelsNameInput(e.target.value)}
                    placeholder={tStrings.angelsNamePlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-sky-200 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  />
                </div>

                {/* Intention Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-slate-400">
                    {tStrings.angelsIntentionLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'wisdom', label: langKey === 'ha' ? 'Hikima & Wahayi' : langKey === 'en' ? 'Wisdom & Light' : 'Sagesse & Lumière' },
                      { id: 'abundance', label: langKey === 'ha' ? 'Arziki & Rahama' : langKey === 'en' ? 'Abundance & Mercy' : 'Subsistance & Miséricorde' },
                      { id: 'life', label: langKey === 'ha' ? 'Rayuwa & Farfadowa' : langKey === 'en' ? 'Vitality & Awakening' : 'Souffle Vital & Éveil' },
                      { id: 'victory', label: langKey === 'ha' ? 'Kariya & Nasara' : langKey === 'en' ? 'Protection & Victory' : 'Protection & Victoire' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setAngelsIntention(item.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                          angelsIntention === item.id
                            ? 'bg-sky-100 dark:bg-sky-500/20 border-sky-400 dark:border-sky-500/40 text-sky-950 dark:text-sky-200 font-bold'
                            : 'bg-stone-50 dark:bg-slate-950/60 border-stone-200 dark:border-slate-800 text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dominant Resonance Summary */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-950 border border-sky-300 dark:border-sky-500/30 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-2">
                    <span className="text-xs text-stone-500 dark:text-slate-400">{tStrings.angelsHarmonicAura}</span>
                    <span className="text-sm font-serif font-bold text-sky-800 dark:text-sky-300">
                      {angelResonance.dominantAngel.namePhonetic} ({angelResonance.dominantAngel.nameAr})
                    </span>
                  </div>
                  <div className="text-xs space-y-1.5 text-stone-700 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-stone-500 dark:text-slate-400">{tStrings.angelsDominantDirection}</span>
                      <span className="font-semibold text-stone-900 dark:text-slate-200">
                        {langKey === 'ha' ? angelResonance.dominantAngel.directionHa : langKey === 'en' ? angelResonance.dominantAngel.directionEn : angelResonance.dominantAngel.directionFr}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 dark:text-slate-400">{tStrings.angelsRitualIncense}</span>
                      <span className="text-amber-700 dark:text-amber-300 font-medium">
                        {langKey === 'ha' ? angelResonance.dominantAngel.incenseHa : langKey === 'en' ? angelResonance.dominantAngel.incenseEn : angelResonance.dominantAngel.incenseFr}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 dark:text-slate-400">{tStrings.angelsRitualHour}</span>
                      <span className="text-sky-700 dark:text-sky-300 font-medium">
                        {langKey === 'ha' ? angelResonance.dominantAngel.hourHa : langKey === 'en' ? angelResonance.dominantAngel.hourEn : angelResonance.dominantAngel.hourFr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Invocation Box */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-950/90 border border-amber-300 dark:border-amber-500/30 space-y-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                        {tStrings.angelsInvocationTitle}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(`${tStrings.angelsInvocationArabic}\n\n${tStrings.angelsInvocationTranslation}`, 'angels_invocation')}
                      className="inline-flex items-center gap-1 text-[11px] text-stone-500 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                      title={tStrings.copyFormula}
                    >
                      {copiedKey === 'angels_invocation' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'angels_invocation' ? tStrings.copied : tStrings.copyFormula}</span>
                    </button>
                  </div>

                  {/* Arabic Dua with Tashkeel */}
                  <div 
                    dir="rtl"
                    className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-slate-900/80 border border-amber-300 dark:border-amber-500/20 text-right leading-loose font-serif text-stone-950 dark:text-amber-200 text-sm sm:text-base selection:bg-amber-500/30 shadow-inner"
                    style={{ wordSpacing: '0.15em' }}
                  >
                    {tStrings.angelsInvocationArabic}
                  </div>

                  {/* Collapsible Translation Toggle (Closed by default) */}
                  <div className="pt-1">
                    <button
                      onClick={() => setShowAngelInvocationTranslation(!showAngelInvocationTranslation)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-slate-900/60 dark:hover:bg-slate-900 text-xs font-medium text-stone-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 border border-stone-300 dark:border-slate-800 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Languages className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                        <span>{showAngelInvocationTranslation ? tStrings.hideTranslation : tStrings.showTranslation}</span>
                      </div>
                      {showAngelInvocationTranslation ? (
                        <ChevronUp className="w-4 h-4 text-stone-500 dark:text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-500 dark:text-slate-400" />
                      )}
                    </button>

                    <AnimatePresence>
                      {showAngelInvocationTranslation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 p-3 rounded-lg bg-stone-100/80 dark:bg-slate-900/40 border border-stone-200 dark:border-slate-800/80 text-xs text-stone-700 dark:text-slate-300 italic leading-relaxed">
                            {tStrings.angelsInvocationTranslation}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Vector Geometric Compass Display */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-4 shadow-sm">
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-serif font-bold text-sky-900 dark:text-sky-200">{tStrings.angelsSealTitle}</h3>
                    <p className="text-xs text-stone-600 dark:text-slate-400">{tStrings.angelsCompassCenter}</p>
                  </div>

                  {/* Interactive SVG Compass Diagram */}
                  <div 
                    ref={angelsSealRef}
                    className="relative w-full max-w-[420px] aspect-square flex items-center justify-center p-2 rounded-2xl bg-stone-900 dark:bg-slate-950 border border-sky-500/30"
                  >
                    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
                      {/* Outer Concentric Spheres */}
                      <circle cx="200" cy="200" r="185" fill="none" stroke="#0369a1" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
                      <circle cx="200" cy="200" r="170" fill="#020617" stroke="#38bdf8" strokeWidth="2" opacity="0.9" />
                      <circle cx="200" cy="200" r="130" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.5" />
                      <circle cx="200" cy="200" r="70" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />

                      {/* Cardinal Rays / Azimuth Axis */}
                      <line x1="200" y1="30" x2="200" y2="370" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
                      <line x1="30" y1="200" x2="370" y2="200" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />

                      {/* Diagonal Geometric Diamond uniting the 4 Archangels */}
                      <polygon points="200,45 355,200 200,355 45,200" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
                      <polygon points="200,75 325,200 200,325 75,200" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

                      {/* North Node: Israfil (0°) */}
                      <circle cx="200" cy="45" r="20" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
                      <text x="200" y="49" textAnchor="middle" fill="#fef3c7" fontSize="11" fontWeight="bold" fontFamily="serif">إسرافيل</text>
                      <text x="200" y="22" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">000° N</text>

                      {/* East Node: Jibril (90°) */}
                      <circle cx="355" cy="200" r="20" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2" />
                      <text x="355" y="204" textAnchor="middle" fill="#e0f2fe" fontSize="11" fontWeight="bold" fontFamily="serif">جبريل</text>
                      <text x="375" y="185" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">090° E</text>

                      {/* South Node: Izrail (180°) */}
                      <circle cx="200" cy="355" r="20" fill="#4c1d95" stroke="#a855f7" strokeWidth="2" />
                      <text x="200" y="359" textAnchor="middle" fill="#f3e8ff" fontSize="11" fontWeight="bold" fontFamily="serif">عزرائيل</text>
                      <text x="200" y="388" textAnchor="middle" fill="#c084fc" fontSize="10" fontWeight="bold">180° S</text>

                      {/* West Node: Mikail (270°) */}
                      <circle cx="45" cy="200" r="20" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
                      <text x="45" y="204" textAnchor="middle" fill="#d1fae5" fontSize="11" fontWeight="bold" fontFamily="serif">ميكائيل</text>
                      <text x="25" y="185" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">270° W</text>

                      {/* Center Pivot: Allah / Al-Qutb */}
                      <circle cx="200" cy="200" r="30" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                      <text x="200" y="196" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold" fontFamily="serif">الله</text>
                      <text x="200" y="210" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">AL-QUTB</text>
                    </svg>
                  </div>

                  {/* Actions Bar: Télécharger PNG & Parchemin */}
                  <SealExportButtons
                    targetRef={angelsSealRef}
                    title={tStrings.angelsSealTitle}
                    subtitle={`${angelsNameInput ? `${langKey === 'ha' ? 'Mai cin gajiyarsa :' : langKey === 'en' ? 'Recipient:' : 'Bénéficiaire :'} ${angelsNameInput}` : (langKey === 'ha' ? 'Daidaiton Ginshikai 4' : langKey === 'en' ? 'Alignment of the 4 Pillars' : 'Alignement des 4 Piliers')} • ${angelResonance.dominantAngel.namePhonetic}`}
                    recipientName={angelsNameInput}
                    parchmentContent={
                      <div className="w-full space-y-4 text-center font-serif text-amber-950 p-1">
                        <h4 className="text-lg sm:text-xl font-bold text-amber-950">{tStrings.angelsSealTitle}</h4>
                        <p className="text-xs text-amber-900 italic">
                          {angelsNameInput ? `${langKey === 'ha' ? 'Mai cin gajiyarsa da Daidaiton Asiri :' : langKey === 'en' ? 'Recipient & Theurgic Alignment:' : 'Bénéficiaire & Alignement Théurgique :'} ${angelsNameInput}` : (langKey === 'ha' ? "Daidaiton Mala'iku 4 Masu Daukar Al'arshi" : langKey === 'en' ? 'Alignment of the 4 Angelic Pillars of the Throne' : "Alignement des 4 Piliers Angéliques du Trône")}
                        </p>

                        {/* Visual SVG Angels Seal on Parchment */}
                        <div className="w-full max-w-[340px] aspect-square mx-auto my-3 p-2 rounded-2xl bg-amber-50/90 border-2 border-amber-800/60 shadow-md relative overflow-hidden flex items-center justify-center">
                          <svg viewBox="0 0 400 400" className="w-full h-full">
                            {/* Sacred Concentric Rings */}
                            <circle cx="200" cy="200" r="185" fill="none" stroke="#78350f" strokeWidth="2" strokeDasharray="4 2" />
                            <circle cx="200" cy="200" r="175" fill="none" stroke="#b45309" strokeWidth="1.2" />
                            <circle cx="200" cy="200" r="120" fill="none" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 3" />
                            <circle cx="200" cy="200" r="70" fill="none" stroke="#78350f" strokeWidth="1" />

                            {/* Cross Lines & Cardinal Diamonds */}
                            <line x1="200" y1="25" x2="200" y2="375" stroke="#b45309" strokeWidth="1" strokeDasharray="2 2" />
                            <line x1="25" y1="200" x2="375" y2="200" stroke="#b45309" strokeWidth="1" strokeDasharray="2 2" />

                            {/* Outer 4 Cardinal Archangel Seals */}
                            {ARCHANGELS_DATA.map((ang) => {
                              const rad = (ang.azimuthDeg - 90) * (Math.PI / 180);
                              const x = 200 + 135 * Math.cos(rad);
                              const y = 200 + 135 * Math.sin(rad);
                              const isDominant = angelResonance.dominantAngel.id === ang.id;
                              return (
                                <g key={ang.id}>
                                  <circle 
                                    cx={x} 
                                    cy={y} 
                                    r={isDominant ? 34 : 30} 
                                    fill={isDominant ? '#fde68a' : '#ffffff'} 
                                    stroke={isDominant ? '#b45309' : '#78350f'} 
                                    strokeWidth={isDominant ? 2.2 : 1.2} 
                                  />
                                  <text x={x} y={y - 7} textAnchor="middle" fill="#451a03" fontSize="11" fontWeight="bold" fontFamily="serif">
                                    {ang.nameAr}
                                  </text>
                                  <text x={x} y={y + 7} textAnchor="middle" fill="#78350f" fontSize="7.5" fontWeight="bold">
                                    {ang.namePhonetic}
                                  </text>
                                  <text x={x} y={y + 17} textAnchor="middle" fill="#b45309" fontSize="6.5" fontFamily="monospace">
                                    {ang.azimuthDeg}° • {langKey === 'ha' ? ang.directionHa : langKey === 'en' ? ang.directionEn : ang.directionFr}
                                  </text>
                                </g>
                              );
                            })}

                            {/* Center Pivot: Allah / Al-Qutb */}
                            <circle cx="200" cy="200" r="30" fill="#fef3c7" stroke="#78350f" strokeWidth="2" />
                            <text x="200" y="196" textAnchor="middle" fill="#451a03" fontSize="13" fontWeight="bold" fontFamily="serif">الله</text>
                            <text x="200" y="210" textAnchor="middle" fill="#78350f" fontSize="8" fontWeight="bold">AL-QUTB</text>
                          </svg>
                        </div>

                        <div className="grid grid-cols-2 gap-2 w-full max-w-md mx-auto text-xs my-2">
                          {ARCHANGELS_DATA.map(a => (
                            <div key={a.id} className="p-2 border border-amber-900/40 rounded-xl bg-amber-100/70 shadow-xs text-left">
                              <strong className="block text-xs text-amber-950 font-serif">{a.namePhonetic} ({a.nameAr})</strong>
                              <span className="text-[10px] text-amber-900">{langKey === 'ha' ? a.directionHa : langKey === 'en' ? a.directionEn : a.directionFr} • Azimuth {a.azimuthDeg}°</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-3 bg-amber-100/70 rounded-xl border border-amber-900/40 text-xs text-amber-950 w-full max-w-md mx-auto space-y-2">
                          <p dir="rtl" className="text-sm font-serif font-bold text-amber-950 leading-relaxed text-right">
                            {tStrings.angelsInvocationArabic}
                          </p>
                          <p className="text-[11px] text-amber-900 italic text-left pt-1 border-t border-amber-900/20">
                            {tStrings.angelsInvocationTranslation}
                          </p>
                        </div>
                      </div>
                    }
                  />
                </div>

                {/* 4 Pillars Details Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ARCHANGELS_DATA.map((ang) => (
                    <div key={ang.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-stone-200 dark:border-slate-800 space-y-1.5 text-xs shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-serif text-stone-900 dark:text-slate-100">{ang.namePhonetic} ({ang.nameAr})</span>
                        <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400">{ang.azimuthDeg.toString().padStart(3, '0')}°</span>
                      </div>
                      <p className="text-stone-600 dark:text-slate-400 text-[11px]">
                        {langKey === 'ha' ? ang.elementHa : langKey === 'en' ? ang.elementEn : ang.elementFr}
                      </p>
                      <p className="text-stone-800 dark:text-slate-300 font-serif text-right text-xs pt-1 border-t border-stone-200 dark:border-slate-800/60" dir="rtl">
                        {ang.verseAr}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: WAFQ AL-MUTAQATI' (DUAL INTERLOCKING MAGIC SQUARES) */}
        {/* ========================================================================= */}
        {activeTab === 'mutaqati' && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            {/* Concept Banner */}
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-slate-900/40 border border-emerald-300 dark:border-emerald-500/20 shadow-sm backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h2 className="text-lg font-serif font-bold text-emerald-950 dark:text-emerald-200">{tStrings.mutaqatiConceptTitle}</h2>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-slate-300 leading-relaxed">{tStrings.mutaqatiConceptDesc}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    {tStrings.mutaqatiValueInput}
                  </label>
                  <input
                    type="text"
                    value={mutaqatiValue}
                    onChange={(e) => setMutaqatiValue(e.target.value)}
                    placeholder={tStrings.mutaqatiValuePlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-emerald-200 text-lg font-bold font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* Quick Presets */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-slate-400">
                    {tStrings.mutaqatiPresetLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Allāh (66)", val: "66" },
                      { label: "Muḥammad (92)", val: "92" },
                      { label: "Laṭīf (129)", val: "129" },
                      { label: "Jāmi' (114)", val: "114" },
                      { label: "Badr (313)", val: "313" },
                      { label: "Kāfī (111)", val: "111" }
                    ].map((p) => (
                      <button
                        key={p.val}
                        onClick={() => setMutaqatiValue(p.val)}
                        className={`p-2 rounded-xl border text-xs font-medium text-center transition-all ${
                          mutaqatiValue === p.val
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-200 font-bold'
                            : 'bg-stone-50 dark:bg-slate-950/60 border-stone-200 dark:border-slate-800 text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mathematical Balance Parameters */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-500/30 space-y-2.5 text-xs shadow-xs">
                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[11px]">
                    {tStrings.mutaqatiHarmonicBalance}
                  </h4>
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-stone-200 dark:border-slate-800">
                    <div>
                      <span className="text-stone-500 dark:text-slate-400 block text-[10px]">{tStrings.mutaqatiKeyMiftah}</span>
                      <span className="text-sm font-bold font-mono text-emerald-800 dark:text-emerald-300">{dualWafqData.miftah}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-slate-400 block text-[10px]">{tStrings.mutaqatiStepAdl}</span>
                      <span className="text-sm font-bold font-mono text-stone-900 dark:text-slate-200">{dualWafqData.adl}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-slate-400 block text-[10px]">{tStrings.mutaqatiLockQufi}</span>
                      <span className="text-sm font-bold font-mono text-amber-700 dark:text-amber-400">{dualWafqData.qufl}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-stone-200 dark:border-slate-800/80 text-[11px] text-stone-700 dark:text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-stone-500 dark:text-slate-400">{tStrings.mutaqatiSumRows}</span>
                      <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">{dualWafqData.innerSum}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 dark:text-slate-400">{tStrings.mutaqatiSharedBorder}</span>
                      <span className="font-mono font-bold text-amber-700 dark:text-amber-300">4 {langKey === 'ha' ? 'Dakuna' : 'Nœuds'}</span>
                    </div>
                  </div>
                </div>

                {/* Esoteric Meaning */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-950/80 border border-stone-200 dark:border-slate-800 space-y-2 text-xs">
                  <h4 className="font-semibold text-stone-900 dark:text-slate-200">{tStrings.mutaqatiEsotericSignificance}</h4>
                  <p className="text-stone-600 dark:text-slate-400 leading-relaxed">{tStrings.mutaqatiEsotericDesc}</p>
                </div>
              </div>

              {/* Nested Wafq Matrix Display */}
              <div className="lg:col-span-7 space-y-5">
                <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-4 shadow-sm">
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-serif font-bold text-emerald-900 dark:text-emerald-200">{tStrings.mutaqatiMatrixTitle}</h3>
                    <p className="text-xs text-stone-600 dark:text-slate-400">
                      {langKey === 'ha' 
                        ? 'Gidan Zinare na ciki (3x3) da Ganuwar waje (5x5)'
                        : langKey === 'en'
                        ? 'Golden Inner Core (3x3) & Outer Perimeter Shield (5x5)'
                        : 'Cœur Intérieur Doré (3x3) & Enceinte Extérieure Émeraude (5x5)'}
                    </p>
                  </div>

                  {/* 5x5 Matrix displaying 3x3 at center */}
                  <div 
                    ref={mutaqatiSealRef}
                    className="p-4 rounded-2xl bg-gradient-to-b from-stone-100 via-white to-stone-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-2 border-emerald-500/40 shadow-xl dark:shadow-2xl dark:shadow-emerald-950/40"
                    style={{ maxWidth: '420px', width: '100%' }}
                  >
                    <div className="grid grid-cols-5 gap-2">
                      {dualWafqData.outerGrid.map((row, r) =>
                        row.map((val, c) => {
                          const isInner = r >= 1 && r <= 3 && c >= 1 && c <= 3;
                          const isCenter = r === 2 && c === 2;
                          const isHovered = hoveredMutaqatiCell?.r === r && hoveredMutaqatiCell?.c === c;

                          return (
                            <motion.div
                              key={`${r}-${c}`}
                              onMouseEnter={() => setHoveredMutaqatiCell({ r, c })}
                              onMouseLeave={() => setHoveredMutaqatiCell(null)}
                              whileHover={{ scale: 1.06 }}
                              className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1.5 transition-all text-xs font-mono font-bold border ${
                                isCenter
                                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/30 font-extrabold'
                                  : isInner
                                  ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 border-amber-400 dark:border-amber-500/50'
                                  : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-500/30'
                              } ${isHovered ? 'ring-2 ring-amber-500 dark:ring-white shadow-lg' : ''}`}
                            >
                              <span className="text-sm sm:text-base font-bold">{val}</span>
                              <span className="text-[9px] opacity-70">
                                {isCenter ? 'Qalb' : isInner ? 'Batin' : 'Zahir'}
                              </span>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Actions Bar: Télécharger PNG & Parchemin */}
                  <SealExportButtons
                    targetRef={mutaqatiSealRef}
                    title={tStrings.mutaqatiMatrixTitle}
                    subtitle={`Valeur Numérique : ${numericTarget} • Wafq 5x5 Cœur 3x3`}
                    abjadWeight={numericTarget}
                    parchmentContent={
                      <div className="space-y-4 text-center font-serif text-amber-950 p-2">
                        <h4 className="text-xl font-bold">{tStrings.mutaqatiMatrixTitle}</h4>
                        <p className="text-xs text-amber-900 italic">Valeur Numérique Cible : <strong>{numericTarget}</strong></p>
                        <div className="grid grid-cols-5 gap-1.5 max-w-[340px] mx-auto p-3 border-2 border-amber-900 bg-amber-50 rounded-2xl shadow-inner my-2">
                          {dualWafqData.outerGrid.map((row, r) =>
                            row.map((val, c) => {
                              const isInner = r >= 1 && r <= 3 && c >= 1 && c <= 3;
                              const isCenter = r === 2 && c === 2;
                              return (
                                <div 
                                  key={`${r}-${c}`} 
                                  className={`aspect-square border rounded-lg flex items-center justify-center font-bold text-xs shadow-xs ${
                                    isCenter ? 'bg-amber-400 text-stone-950 border-amber-600' :
                                    isInner ? 'bg-amber-200/80 text-amber-950 border-amber-400' :
                                    'bg-emerald-100/80 text-emerald-950 border-emerald-300'
                                  }`}
                                >
                                  {val}
                                </div>
                              );
                            })
                          )}
                        </div>
                        <div className="text-xs text-amber-900 flex justify-center gap-4 pt-1 border-t border-amber-800/30">
                          <span>{tStrings.mutaqatiInnerCore} : <strong>Qalb (Bāṭin)</strong></span>
                          <span>{tStrings.mutaqatiOuterShield} : <strong>Ḥijāb (Ẓāhir)</strong></span>
                        </div>
                      </div>
                    }
                  />

                  {/* Visual Legend */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded bg-amber-100 dark:bg-amber-500/30 border border-amber-500 dark:border-amber-400" />
                      <span className="text-stone-700 dark:text-slate-300">{tStrings.mutaqatiInnerCore}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded bg-emerald-100 dark:bg-emerald-500/30 border border-emerald-500 dark:border-emerald-400" />
                      <span className="text-stone-700 dark:text-slate-300">{tStrings.mutaqatiOuterShield}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SHAJARAT AL-KAWN (TREE OF EXISTENCE & FIBONACCI LETTERS) */}
        {/* ========================================================================= */}
        {activeTab === 'shajarat' && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            {/* Concept Banner */}
            <div className="p-5 rounded-2xl bg-teal-50 dark:bg-gradient-to-r dark:from-teal-950/40 dark:via-slate-900/60 dark:to-slate-900/40 border border-teal-300 dark:border-teal-500/20 shadow-sm backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <GitBranch className="w-6 h-6 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h2 className="text-lg font-serif font-bold text-teal-950 dark:text-teal-200">{tStrings.shajaratConceptTitle}</h2>
                  <p className="text-xs sm:text-sm text-stone-800 dark:text-slate-300 leading-relaxed">{tStrings.shajaratConceptDesc}</p>
                </div>
              </div>
            </div>

            {/* Quick Letter Navigation Ribbon */}
            <div className="bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-stone-300 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-stone-900 dark:text-slate-200 uppercase tracking-wider">
                    {tStrings.shajaratLetterNav}
                  </span>
                </div>
                <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                  {tStrings.shajaratNodeClickPrompt}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                {SHAJARAT_NODES.map((node) => {
                  const isSelected = selectedShajaratNode.id === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => handleSelectShajaratNode(node)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-500 text-amber-950 dark:text-amber-200 ring-2 ring-amber-400/60 shadow-md font-bold' 
                          : 'bg-stone-50 dark:bg-slate-950 border-stone-200 dark:border-slate-800 text-stone-800 dark:text-slate-300 hover:border-teal-400 dark:hover:border-teal-500/50 hover:bg-teal-50 dark:hover:bg-teal-950/30'
                      }`}
                    >
                      <span className="text-2xl font-serif font-bold text-amber-800 dark:text-amber-300 leading-none">{node.letter}</span>
                      <span className="text-[11px] font-semibold text-stone-900 dark:text-slate-200 mt-1">{node.namePhonetic}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-slate-400">#{node.abjadValue}</span>
                        <span className="text-[9px] font-mono text-teal-700 dark:text-teal-400 font-bold">Φ{node.fibonacciRatio}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Input & Personal Branch Calculator */}
              <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300">
                    {tStrings.shajaratNameInput}
                  </label>
                  <input
                    type="text"
                    value={shajaratInputName}
                    onChange={(e) => setShajaratInputName(e.target.value)}
                    placeholder={tStrings.shajaratNamePlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-300 dark:border-slate-700 text-stone-900 dark:text-teal-200 text-sm font-medium focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-inner"
                  />
                </div>

                {/* Personal Branch Card */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-950 border border-teal-300 dark:border-teal-500/30 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-2">
                    <span className="text-xs font-semibold text-stone-600 dark:text-slate-400">{tStrings.shajaratPersonalAffinity}</span>
                    <span className="text-sm font-serif font-bold text-teal-900 dark:text-teal-300">
                      {langKey === 'ha' ? personalShajaratBranch.node.titleHa : langKey === 'en' ? personalShajaratBranch.node.titleEn : personalShajaratBranch.node.titleFr}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-800 dark:text-slate-300">
                    <div>
                      <span className="text-stone-500 dark:text-slate-400 block">{tStrings.shajaratCosmicLetter}</span>
                      <span className="text-xl font-serif font-bold text-amber-800 dark:text-amber-300">{personalShajaratBranch.rootLetter.letter} ({personalShajaratBranch.rootLetter.nameFr})</span>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-slate-400 block">{tStrings.shajaratFibonacciLabel}</span>
                      <span className="text-sm font-mono font-bold text-teal-800 dark:text-teal-300">Ratio {personalShajaratBranch.node.fibonacciRatio} (Niveau {personalShajaratBranch.node.level})</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-stone-200 dark:border-slate-800/80">
                      <span className="text-stone-500 dark:text-slate-400 block">{tStrings.shajaratDivinePresence}</span>
                      <span className="text-xs font-bold text-stone-900 dark:text-slate-200">
                        {langKey === 'ha' ? personalShajaratBranch.node.presenceHa : langKey === 'en' ? personalShajaratBranch.node.presenceEn : personalShajaratBranch.node.presenceFr}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectShajaratNode(personalShajaratBranch.node)}
                    className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Dévoiler les détails de cette lettre</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Fibonacci Levels Hierarchy */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-950/80 border border-stone-200 dark:border-slate-800 space-y-2 text-xs shadow-xs">
                  <h4 className="font-bold text-stone-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                    Hiérarchie des Niveaux de l'Arbre
                  </h4>
                  <ul className="space-y-1 text-stone-700 dark:text-slate-400 text-[11px]">
                    <li className="flex items-center justify-between"><span className="text-teal-800 dark:text-teal-300 font-semibold">{tStrings.shajaratLevelRoot}</span></li>
                    <li className="flex items-center justify-between"><span className="text-teal-800 dark:text-teal-300 font-semibold">{tStrings.shajaratLevelTrunk}</span></li>
                    <li className="flex items-center justify-between"><span className="text-teal-800 dark:text-teal-300 font-semibold">{tStrings.shajaratLevelBranches}</span></li>
                    <li className="flex items-center justify-between"><span className="text-teal-800 dark:text-teal-300 font-semibold">{tStrings.shajaratLevelTwigs}</span></li>
                    <li className="flex items-center justify-between"><span className="text-teal-800 dark:text-teal-300 font-semibold">{tStrings.shajaratLevelLeaves}</span></li>
                    <li className="flex items-center justify-between"><span className="text-teal-800 dark:text-teal-300 font-semibold">{tStrings.shajaratLevelFruits}</span></li>
                  </ul>
                </div>
              </div>

              {/* Interactive SVG Tree Diagram */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-3 shadow-sm">
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-serif font-bold text-teal-950 dark:text-teal-200">{tStrings.shajaratTreeTitle}</h3>
                    <p className="text-xs text-stone-700 dark:text-slate-400">{tStrings.shajaratNodeClickPrompt}</p>
                  </div>

                  {/* SVG Tree Canvas */}
                  <div 
                    ref={shajaratTreeRef}
                    className="relative w-full max-w-[460px] aspect-[4/5] flex items-center justify-center bg-stone-900 dark:bg-slate-950 rounded-2xl border border-stone-700 dark:border-slate-800/80 p-2 overflow-hidden shadow-2xl"
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Tree Branches Vector Path */}
                      <path d="M50,90 Q50,75 50,70" stroke="#78350f" strokeWidth="2.5" fill="none" />
                      <path d="M50,70 Q40,62 32,56" stroke="#92400e" strokeWidth="1.8" fill="none" />
                      <path d="M50,70 Q60,62 68,56" stroke="#92400e" strokeWidth="1.8" fill="none" />
                      <path d="M32,56 Q25,48 20,40" stroke="#0d9488" strokeWidth="1.2" fill="none" />
                      <path d="M32,56 Q40,46 50,38" stroke="#0d9488" strokeWidth="1.2" fill="none" />
                      <path d="M68,56 Q75,48 80,40" stroke="#0d9488" strokeWidth="1.2" fill="none" />
                      <path d="M50,38 Q50,28 50,18" stroke="#14b8a6" strokeWidth="1.2" fill="none" />
                      <path d="M50,38 Q38,30 30,22" stroke="#f59e0b" strokeWidth="1" strokeDasharray="1 1" fill="none" />
                      <path d="M50,38 Q62,30 70,22" stroke="#f59e0b" strokeWidth="1" strokeDasharray="1 1" fill="none" />

                      {/* Nodes Map */}
                      {SHAJARAT_NODES.map((node) => {
                        const isSelected = selectedShajaratNode.id === node.id;
                        return (
                          <g 
                            key={node.id} 
                            onClick={() => handleSelectShajaratNode(node)} 
                            className="cursor-pointer transition-transform duration-200"
                          >
                            <circle 
                              cx={node.x} 
                              cy={node.y} 
                              r={isSelected ? 6 : 4.2} 
                              fill={isSelected ? '#f59e0b' : '#0f172a'} 
                              stroke={isSelected ? '#fef3c7' : '#14b8a6'} 
                              strokeWidth={isSelected ? 1.5 : 0.9} 
                            />
                            {isSelected && (
                              <circle 
                                cx={node.x} 
                                cy={node.y} 
                                r={8} 
                                fill="none" 
                                stroke="#f59e0b" 
                                strokeWidth="0.6" 
                                strokeDasharray="1.5 1.5"
                                className="animate-spin"
                                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                              />
                            )}
                            <text 
                              x={node.x} 
                              y={node.y + 1.3} 
                              textAnchor="middle" 
                              fill={isSelected ? '#020617' : '#fef3c7'} 
                              fontSize="3.2" 
                              fontWeight="bold" 
                              fontFamily="serif"
                            >
                              {node.letter}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Actions Bar: Télécharger PNG & Parchemin */}
                  <SealExportButtons
                    targetRef={shajaratTreeRef}
                    title={tStrings.shajaratTreeTitle}
                    subtitle={`${shajaratInputName ? `${tStrings.shajaratPersonalAffinity} ${shajaratInputName}` : tStrings.shajaratSubtitle} • ${langKey === 'ha' ? personalShajaratBranch.node.titleHa : langKey === 'en' ? personalShajaratBranch.node.titleEn : personalShajaratBranch.node.titleFr}`}
                    recipientName={shajaratInputName}
                    parchmentContent={
                      <div className="w-full space-y-4 text-center font-serif text-amber-950 p-1">
                        <h4 className="text-lg sm:text-xl font-bold text-amber-950">{tStrings.shajaratTreeTitle}</h4>
                        <p className="text-xs text-amber-900 italic">
                          {shajaratInputName ? `${langKey === 'ha' ? 'Itacen Halitta da Rassan Ruhaniya na :' : langKey === 'en' ? 'Cosmic Tree & Spiritual Branch of :' : 'Arbre Cosmologique & Rameau Spirituel de :'} ${shajaratInputName}` : (langKey === 'ha' ? 'Itacen Halittar Duniya (Digiri 28 — Shajarat al-Kawn)' : langKey === 'en' ? 'The Cosmic Tree of Existence (28 Degrees — Shajarat al-Kawn)' : "L'Arbre Cosmique de l'Existence (28 Degrés — Shajarat al-Kawn)")}
                        </p>

                        {/* Visual SVG Tree on Sacred Parchment */}
                        <div className="w-full max-w-[420px] aspect-[1/1] mx-auto my-3 p-3 rounded-2xl bg-amber-50/95 border-2 border-amber-800/60 shadow-md relative overflow-hidden flex items-center justify-center">
                          {/* Background sacred geometry rings */}
                          <svg viewBox="0 0 100 102" className="w-full h-full">
                            <circle cx="50" cy="50" r="48" fill="none" stroke="#d97706" strokeWidth="0.6" strokeDasharray="1.5 1.5" opacity="0.4" />
                            <circle cx="50" cy="50" r="39" fill="none" stroke="#b45309" strokeWidth="0.4" opacity="0.3" />
                            <circle cx="50" cy="50" r="28" fill="none" stroke="#d97706" strokeWidth="0.4" strokeDasharray="1 1" opacity="0.3" />

                            {/* Tree Trunk & Branches */}
                            <path d="M50,92 Q50,78 50,72" stroke="#78350f" strokeWidth="3" strokeLinecap="round" fill="none" />
                            <path d="M50,72 Q40,62 32,56" stroke="#92400e" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                            <path d="M50,72 Q60,62 68,56" stroke="#92400e" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                            <path d="M32,56 Q25,48 20,40" stroke="#0f766e" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                            <path d="M32,56 Q40,46 50,38" stroke="#0f766e" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                            <path d="M68,56 Q75,48 80,40" stroke="#0f766e" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                            <path d="M50,38 Q50,28 50,18" stroke="#0f766e" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                            <path d="M50,38 Q38,30 30,22" stroke="#d97706" strokeWidth="1.2" strokeDasharray="1.2 1.2" fill="none" />
                            <path d="M50,38 Q62,30 70,22" stroke="#d97706" strokeWidth="1.2" strokeDasharray="1.2 1.2" fill="none" />

                            {/* Cosmic Nodes */}
                            {SHAJARAT_NODES.map((node) => {
                              const isSelected = selectedShajaratNode.id === node.id;
                              const isPersonal = personalShajaratBranch.node.id === node.id;
                              return (
                                <g key={node.id}>
                                  {/* Halo for selected/personal */}
                                  {(isSelected || isPersonal) && (
                                    <circle 
                                      cx={node.x} 
                                      cy={node.y} 
                                      r={isPersonal ? 7.5 : 6.8} 
                                      fill="none" 
                                      stroke="#d97706" 
                                      strokeWidth="0.8" 
                                      strokeDasharray="1.5 1.5"
                                    />
                                  )}
                                  <circle 
                                    cx={node.x} 
                                    cy={node.y} 
                                    r={isSelected || isPersonal ? 5.8 : 4.2} 
                                    fill={isPersonal ? '#fde68a' : isSelected ? '#fef3c7' : '#ffffff'} 
                                    stroke={isPersonal ? '#b45309' : isSelected ? '#d97706' : '#78350f'} 
                                    strokeWidth={isPersonal ? 1.6 : 1.1} 
                                  />
                                  <text 
                                    x={node.x} 
                                    y={node.y + 1.3} 
                                    textAnchor="middle" 
                                    fill="#451a03" 
                                    fontSize="3.4" 
                                    fontWeight="bold" 
                                    fontFamily="serif"
                                  >
                                    {node.letter}
                                  </text>
                                  {/* Golden Ratio Label */}
                                  <text 
                                    x={node.x} 
                                    y={node.y + 3.8} 
                                    textAnchor="middle" 
                                    fill="#78350f" 
                                    fontSize="1.6" 
                                    fontFamily="monospace"
                                    fontWeight="bold"
                                  >
                                    Φ{node.fibonacciRatio}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>

                        {/* Metaphysical & Theurgic Information Box */}
                        <div className="p-4 bg-amber-100/80 rounded-2xl border-2 border-amber-900/50 text-xs my-3 text-left space-y-2.5 w-full max-w-lg mx-auto shadow-inner">
                          <div className="flex items-center justify-between border-b border-amber-900/20 pb-2">
                            <span className="font-bold text-sm text-amber-950 font-serif">
                              {langKey === 'ha' ? personalShajaratBranch.node.titleHa : langKey === 'en' ? personalShajaratBranch.node.titleEn : personalShajaratBranch.node.titleFr} {personalShajaratBranch.rootLetter?.letter ? `(${personalShajaratBranch.rootLetter.letter})` : ''}
                            </span>
                            <span className="text-[11px] font-mono text-amber-900 font-bold px-2 py-0.5 rounded bg-amber-200/80 border border-amber-400/60">
                              Ratio Φ : {personalShajaratBranch.node.fibonacciRatio}
                            </span>
                          </div>

                          <p className="text-amber-950 leading-relaxed italic">
                            « {langKey === 'ha' ? personalShajaratBranch.node.theurgicSecretHa : langKey === 'en' ? personalShajaratBranch.node.theurgicSecretEn : personalShajaratBranch.node.theurgicSecretFr} »
                          </p>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-900/20 text-[11px]">
                            <div>
                              <span className="text-amber-800/80 block">{tStrings.shajaratDivinePresence}</span>
                              <strong className="text-amber-950">
                                {langKey === 'ha' ? personalShajaratBranch.node.presenceHa : langKey === 'en' ? personalShajaratBranch.node.presenceEn : personalShajaratBranch.node.presenceFr}
                              </strong>
                            </div>
                            <div>
                              <span className="text-amber-800/80 block">{tStrings.shajaratSpiritualSphere}</span>
                              <strong className="text-amber-950">{personalShajaratBranch.node.worldArabic}</strong>
                            </div>
                            <div>
                              <span className="text-amber-800/80 block">{langKey === 'ha' ? 'Sunayen Allah Larabci :' : langKey === 'en' ? 'Arabic Divine Names:' : 'Noms Divins Arabes :'}</span>
                              <span className="font-serif font-bold text-amber-950" dir="rtl">{personalShajaratBranch.node.divineNamesAr.join(' • ')}</span>
                            </div>
                            <div>
                              <span className="text-amber-800/80 block">{tStrings.shajaratMuwakkalLabel}</span>
                              <strong className="text-amber-950">{personalShajaratBranch.node.angelicGuardAr || personalShajaratBranch.node.angelicGuard}</strong>
                            </div>
                          </div>

                          {/* Recitation Dhikr Formula */}
                          <div className="pt-2 border-t border-amber-900/20 text-center space-y-1 bg-amber-200/50 p-2.5 rounded-xl">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-900 block">{tStrings.shajaratSacredFormulaLabel}</span>
                            <p className="text-base sm:text-lg font-serif font-bold text-amber-950 leading-relaxed" dir="rtl">
                              {personalShajaratBranch.node.dhikrFormulaAr}
                            </p>
                            <p className="text-[10px] text-amber-900 italic font-mono">
                              {personalShajaratBranch.node.dhikrFormulaPhonetic}
                            </p>
                            <span className="text-[10px] font-bold text-amber-950 block">
                              {tStrings.shajaratDhikrCount} <strong>{personalShajaratBranch.node.recommendedCount} {tStrings.shajaratTimesUnit}</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* MASTER SECTION: DEEP METAPHYSICAL UNVEILING OF THE SELECTED LETTER NODE */}
            {/* ========================================================================= */}
            <div 
              ref={shajaratDetailsRef}
              id="shajarat-node-details"
              className={`p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border-2 transition-all duration-500 shadow-xl space-y-6 ${
                isNodeHighlighted 
                  ? 'border-amber-500 ring-4 ring-amber-400/40 dark:ring-amber-500/30' 
                  : 'border-amber-400/60 dark:border-amber-500/30'
              }`}
            >
              {/* Header: Giant Letter Glyphs, Titles, Abjad & Fibonacci Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-800 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-900/20">
                    <span className="text-3xl sm:text-4xl font-serif font-black">{selectedShajaratNode.letter}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-500/30">
                        {selectedShajaratNode.namePhonetic} • {selectedShajaratNode.nameAr}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-500/20 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-500/30">
                        Niveau {selectedShajaratNode.level} (Ratio Φ = {selectedShajaratNode.fibonacciRatio})
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 border border-stone-300 dark:border-slate-700">
                        Abjad : {selectedShajaratNode.abjadValue}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-950 dark:text-amber-100">
                      {langKey === 'ha' ? selectedShajaratNode.titleHa : langKey === 'en' ? selectedShajaratNode.titleEn : selectedShajaratNode.titleFr}
                    </h3>
                    <p className="text-xs text-amber-800 dark:text-amber-300 font-serif font-semibold" dir="rtl">
                      {selectedShajaratNode.stationAr}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end gap-2 shrink-0">
                  <span className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-slate-950 border border-teal-300 dark:border-teal-500/40 text-xs font-mono font-bold text-teal-900 dark:text-teal-300 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    {selectedShajaratNode.frequencyHz} Hz
                  </span>
                </div>
              </div>

              {/* 6 Deep Esoteric and Theurgic Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Module 1: Cosmic Identity & Metaphysical Station */}
                <div className="p-5 rounded-2xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800/90 space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-200 dark:border-slate-800 pb-2">
                    <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300">
                      {tStrings.shajaratSectionMetaphysics}
                    </h4>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-stone-500 dark:text-slate-400 font-semibold block">{tStrings.shajaratStation}</span>
                      <p className="font-bold text-stone-900 dark:text-slate-200">
                        {langKey === 'ha' ? selectedShajaratNode.stationHa : langKey === 'en' ? selectedShajaratNode.stationEn : selectedShajaratNode.stationFr}
                      </p>
                    </div>

                    <div>
                      <span className="text-stone-500 dark:text-slate-400 font-semibold block">{tStrings.shajaratElement}</span>
                      <p className="text-emerald-800 dark:text-emerald-300 font-medium">
                        {langKey === 'ha' ? selectedShajaratNode.elementHa : langKey === 'en' ? selectedShajaratNode.elementEn : selectedShajaratNode.elementFr}
                      </p>
                    </div>

                    <div>
                      <span className="text-stone-500 dark:text-slate-400 font-semibold block">{tStrings.shajaratWorld}</span>
                      <p className="text-stone-900 dark:text-slate-200 font-medium">
                        <strong className="text-teal-800 dark:text-teal-300">{selectedShajaratNode.world}</strong> — {langKey === 'ha' ? selectedShajaratNode.worldExplanationHa : langKey === 'en' ? selectedShajaratNode.worldExplanationEn : selectedShajaratNode.worldExplanationFr}
                      </p>
                    </div>

                    <div>
                      <span className="text-stone-500 dark:text-slate-400 font-semibold block">{tStrings.shajaratDivinePresence}</span>
                      <p className="text-stone-900 dark:text-slate-200 font-bold">
                        {langKey === 'ha' ? selectedShajaratNode.presenceHa : langKey === 'en' ? selectedShajaratNode.presenceEn : selectedShajaratNode.presenceFr}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Module 2: Divine Names & Activation Keys */}
                <div className="p-5 rounded-2xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800/90 space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-200 dark:border-slate-800 pb-2">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                      {tStrings.shajaratSectionNames}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {/* Arabic Names Chips */}
                    <div className="flex items-center gap-2 flex-wrap" dir="rtl">
                      {selectedShajaratNode.divineNamesAr.map((name, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1 rounded-xl bg-amber-100/80 dark:bg-amber-500/15 border border-amber-400 dark:border-amber-500/30 text-amber-950 dark:text-amber-200 font-serif font-bold text-sm"
                        >
                          {name}
                        </span>
                      ))}
                    </div>

                    <div className="text-xs text-stone-800 dark:text-slate-300 leading-relaxed font-medium bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-stone-200 dark:border-slate-800">
                      {langKey === 'ha' ? selectedShajaratNode.divineNamesHa : langKey === 'en' ? selectedShajaratNode.divineNamesEn : selectedShajaratNode.divineNamesFr}
                    </div>

                    <div>
                      <span className="text-stone-500 dark:text-slate-400 text-xs font-semibold block">{tStrings.shajaratCosmicFunction}</span>
                      <p className="text-xs text-stone-800 dark:text-slate-200 leading-relaxed mt-1">
                        {langKey === 'ha' ? selectedShajaratNode.cosmicFunctionHa : langKey === 'en' ? selectedShajaratNode.cosmicFunctionEn : selectedShajaratNode.cosmicFunctionFr}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Module 3: Full Theurgic Secret from Futuhat al-Makkiyya */}
                <div className="md:col-span-2 p-5 sm:p-6 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-500/30 space-y-3">
                  <div className="flex items-center gap-2 border-b border-amber-200 dark:border-amber-500/20 pb-2">
                    <Feather className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200">
                      {tStrings.shajaratSectionTheurgy}
                    </h4>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-stone-800 dark:text-slate-200 leading-relaxed italic font-serif">
                    « {langKey === 'ha' ? selectedShajaratNode.theurgicSecretHa : langKey === 'en' ? selectedShajaratNode.theurgicSecretEn : selectedShajaratNode.theurgicSecretFr} »
                  </p>
                </div>

                {/* Module 4: Angelic Dominion & Celestial Guard */}
                <div className="p-5 rounded-2xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800/90 space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-200 dark:border-slate-800 pb-2">
                    <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                      {tStrings.shajaratSectionAngel}
                    </h4>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
                      <span className="text-stone-500 dark:text-slate-400 block text-[11px]">Muwakkal / Garde Spirituel :</span>
                      <span className="font-serif font-bold text-stone-900 dark:text-slate-100 text-sm block mt-0.5">
                        {selectedShajaratNode.angelicGuard}
                      </span>
                      <span className="font-serif text-amber-800 dark:text-amber-400 text-xs block mt-1" dir="rtl">
                        {selectedShajaratNode.angelicGuardAr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Module 5: Practical Meditation Protocol & Sacred Dhikr */}
                <div className="p-5 rounded-2xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800/90 space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-200 dark:border-slate-800 pb-2">
                    <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 dark:text-rose-300">
                      {tStrings.shajaratSectionMeditation}
                    </h4>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <p className="text-stone-800 dark:text-slate-300 leading-relaxed">
                      {langKey === 'ha' ? selectedShajaratNode.meditationProtocolHa : langKey === 'en' ? selectedShajaratNode.meditationProtocolEn : selectedShajaratNode.meditationProtocolFr}
                    </p>

                    {/* Sacred Dhikr Formula Card */}
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-950 dark:text-amber-300">Formule Sacrée de Dhikr :</span>
                        <button
                          onClick={() => handleCopy(selectedShajaratNode.dhikrFormulaAr, `dhikr-${selectedShajaratNode.id}`)}
                          className="px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-500/20 text-amber-950 dark:text-amber-200 hover:bg-amber-300 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          {copiedKey === `dhikr-${selectedShajaratNode.id}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Copié !</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{tStrings.shajaratCopyDhikr}</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-base font-serif font-bold text-amber-950 dark:text-amber-200 text-center py-1" dir="rtl">
                        {selectedShajaratNode.dhikrFormulaAr}
                      </p>
                      <p className="text-[11px] text-stone-600 dark:text-slate-400 italic text-center font-mono">
                        {selectedShajaratNode.dhikrFormulaPhonetic}
                      </p>
                      <div className="text-center pt-1 border-t border-amber-200 dark:border-amber-500/20 text-[11px] font-bold text-amber-900 dark:text-amber-300">
                        {tStrings.shajaratDhikrCount} {selectedShajaratNode.recommendedCount} fois
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: NUMERICAL PENTAGRAMS (5 DIVINE PRESENCES STAR) */}
        {/* ========================================================================= */}
        {activeTab === 'pentagram' && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            {/* Concept Banner */}
            <div className="p-5 rounded-2xl bg-purple-50 dark:bg-gradient-to-r dark:from-purple-950/40 dark:via-slate-900/60 dark:to-slate-900/40 border border-purple-300 dark:border-purple-500/20 shadow-sm backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h2 className="text-lg font-serif font-bold text-purple-950 dark:text-purple-200">{tStrings.pentagramConceptTitle}</h2>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-slate-300 leading-relaxed">{tStrings.pentagramConceptDesc}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Preset Selector & Details */}
              <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-purple-800 dark:text-purple-300">
                    {tStrings.pentagramPresetLabel}
                  </label>
                  <div className="space-y-2">
                    {PENTAGRAM_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPentagramPresetId(p.id)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all space-y-1 ${
                          selectedPentagramPresetId === p.id
                            ? 'bg-purple-100 dark:bg-purple-500/20 border-purple-400 dark:border-purple-500/50 text-purple-950 dark:text-purple-200 shadow-xs font-bold'
                            : 'bg-stone-50 dark:bg-slate-950/60 border-stone-200 dark:border-slate-800 text-stone-700 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{langKey === 'ha' ? p.nameHa : langKey === 'en' ? p.nameEn : p.nameFr}</span>
                          <span className="font-serif text-sm text-amber-600 dark:text-amber-400">{p.centerNameAr}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-slate-400">
                          {langKey === 'ha' ? p.descriptionHa : langKey === 'en' ? p.descriptionEn : p.descriptionFr}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5 Summits List */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-950 border border-purple-300 dark:border-purple-500/30 space-y-2 text-xs shadow-xs">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 uppercase tracking-wider text-[11px]">
                    {tStrings.pentagramTotalAdad} {pentagramTotalSum}
                  </h4>
                  <div className="space-y-1.5 pt-1 text-stone-700 dark:text-slate-300">
                    <div className="flex justify-between border-b border-stone-200 dark:border-slate-800 pb-1">
                      <span className="text-stone-500 dark:text-slate-400">{tStrings.pentagramPresenceCenter}</span>
                      <span className="font-serif font-bold text-amber-700 dark:text-amber-400">{activePentagramPreset.centerNameAr}</span>
                    </div>
                    {activePentagramPreset.namesAr.map((name, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span className="text-stone-500 dark:text-slate-400">
                          {idx === 0 ? tStrings.pentagramPresence1 :
                           idx === 1 ? tStrings.pentagramPresence2 :
                           idx === 2 ? tStrings.pentagramPresence3 :
                           idx === 3 ? tStrings.pentagramPresence4 :
                           tStrings.pentagramPresence5}
                        </span>
                        <span className="font-serif font-bold text-purple-900 dark:text-purple-200">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wird Recitation Guide */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-950/80 border border-stone-200 dark:border-slate-800 space-y-2 text-xs shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider text-[11px]">
                      {tStrings.pentagramWirdTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 font-mono text-[10px]">
                      {activePentagramPreset.wirdCount}x
                    </span>
                  </div>
                  <p className="text-stone-700 dark:text-slate-300 leading-relaxed">{tStrings.pentagramWirdInstructions}</p>
                </div>
              </div>

              {/* Interactive Vector Pentagram Star SVG Canvas */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-4 shadow-sm">
                  <div className="flex items-center justify-between w-full">
                    <div className="space-y-1">
                      <h3 className="text-base font-serif font-bold text-purple-900 dark:text-purple-200">{tStrings.pentagramStarTitle}</h3>
                      <p className="text-xs text-stone-600 dark:text-slate-400">{tStrings.pentagramRatioHarmonic}</p>
                    </div>
                    <button
                      onClick={() => setIsRotatingPentagram(!isRotatingPentagram)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        isRotatingPentagram
                          ? 'bg-purple-100 dark:bg-purple-500/20 border-purple-300 dark:border-purple-500/40 text-purple-900 dark:text-purple-300'
                          : 'bg-stone-100 dark:bg-slate-950 border-stone-300 dark:border-slate-800 text-stone-700 dark:text-slate-400'
                      }`}
                    >
                      {tStrings.pentagramAnimationToggle}
                    </button>
                  </div>

                  {/* Sacred Pentagram Star SVG */}
                  <div 
                    ref={pentagramSealRef}
                    className="relative w-full max-w-[420px] aspect-square flex items-center justify-center p-2 rounded-2xl bg-stone-950 border border-purple-500/30"
                  >
                    <svg 
                      viewBox="0 0 400 400" 
                      className={`w-full h-full drop-shadow-2xl transition-transform duration-1000 ${
                        isRotatingPentagram ? 'animate-spin' : ''
                      }`}
                      style={{ animationDuration: '60s' }}
                    >
                      {/* Outer Golden Concentric Circles */}
                      <circle cx="200" cy="200" r="185" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                      <circle cx="200" cy="200" r="165" fill="#090514" stroke="#c084fc" strokeWidth="2" opacity="0.9" />
                      <circle cx="200" cy="200" r="105" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />

                      {/* 5-Pointed Star Interlaced Golden Lines */}
                      {/* Points coordinates at radius ~140 */}
                      {/* P1: 90° (200, 60), P2: 18° (333, 156), P3: 306° (282, 313), P4: 234° (118, 313), P5: 162° (67, 156) */}
                      <polygon 
                        points="200,60 282,313 67,156 333,156 118,313" 
                        fill="none" 
                        stroke="#f59e0b" 
                        strokeWidth="2.5" 
                      />

                      {/* Inner Pentagram Polygon */}
                      <polygon 
                        points="200,60 333,156 282,313 118,313 67,156" 
                        fill="none" 
                        stroke="#a855f7" 
                        strokeWidth="1.5" 
                        strokeDasharray="4 4"
                        opacity="0.6"
                      />

                      {/* 5 Summit Circles & Names */}
                      {/* Summit 1: Top (200, 60) */}
                      <circle cx="200" cy="60" r="22" fill="#3b0764" stroke="#f59e0b" strokeWidth="2" />
                      <text x="200" y="65" textAnchor="middle" fill="#fef3c7" fontSize="11" fontWeight="bold" fontFamily="serif">
                        {activePentagramPreset.namesAr[0]}
                      </text>

                      {/* Summit 2: Top-Right (333, 156) */}
                      <circle cx="333" cy="156" r="22" fill="#3b0764" stroke="#f59e0b" strokeWidth="2" />
                      <text x="333" y="161" textAnchor="middle" fill="#fef3c7" fontSize="11" fontWeight="bold" fontFamily="serif">
                        {activePentagramPreset.namesAr[1]}
                      </text>

                      {/* Summit 3: Bottom-Right (282, 313) */}
                      <circle cx="282" cy="313" r="22" fill="#3b0764" stroke="#f59e0b" strokeWidth="2" />
                      <text x="282" y="318" textAnchor="middle" fill="#fef3c7" fontSize="11" fontWeight="bold" fontFamily="serif">
                        {activePentagramPreset.namesAr[2]}
                      </text>

                      {/* Summit 4: Bottom-Left (118, 313) */}
                      <circle cx="118" cy="313" r="22" fill="#3b0764" stroke="#f59e0b" strokeWidth="2" />
                      <text x="118" y="318" textAnchor="middle" fill="#fef3c7" fontSize="11" fontWeight="bold" fontFamily="serif">
                        {activePentagramPreset.namesAr[3]}
                      </text>

                      {/* Summit 5: Top-Left (67, 156) */}
                      <circle cx="67" cy="156" r="22" fill="#3b0764" stroke="#f59e0b" strokeWidth="2" />
                      <text x="67" y="161" textAnchor="middle" fill="#fef3c7" fontSize="11" fontWeight="bold" fontFamily="serif">
                        {activePentagramPreset.namesAr[4]}
                      </text>

                      {/* Central Heart: Insan Kamil / Center Name */}
                      <circle cx="200" cy="200" r="32" fill="#1e1b4b" stroke="#eab308" strokeWidth="2.5" />
                      <text x="200" y="206" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold" fontFamily="serif">
                        {activePentagramPreset.centerNameAr}
                      </text>
                    </svg>
                  </div>

                  {/* Actions Bar: Télécharger PNG & Parchemin */}
                  <SealExportButtons
                    targetRef={pentagramSealRef}
                    title={`${activePentagramPreset.nameFr} (${activePentagramPreset.centerNameAr})`}
                    subtitle={`Somme Totale : ${pentagramTotalSum} • Wird : ${activePentagramPreset.wirdCount}x`}
                    abjadWeight={pentagramTotalSum}
                    parchmentContent={
                      <div className="space-y-4 text-center font-serif text-amber-950 p-1">
                        <h4 className="text-lg sm:text-xl font-bold text-amber-950">{activePentagramPreset.nameFr}</h4>
                        <p className="text-xs text-amber-900 italic font-medium">
                          Khatim Khumasi Sacré • Nœud Central : <strong>{activePentagramPreset.centerNameAr}</strong> — Adad : <strong>{pentagramTotalSum}</strong>
                        </p>

                        {/* Visual SVG Pentagram Star on Parchment */}
                        <div className="w-full max-w-[340px] aspect-square mx-auto my-3 p-2 rounded-2xl bg-amber-50/90 border-2 border-amber-800/60 shadow-md relative overflow-hidden flex items-center justify-center">
                          <svg viewBox="0 0 400 400" className="w-full h-full">
                            {/* Outer Rings */}
                            <circle cx="200" cy="200" r="185" fill="none" stroke="#78350f" strokeWidth="1.5" strokeDasharray="4 2" />
                            <circle cx="200" cy="200" r="172" fill="none" stroke="#b45309" strokeWidth="1" />
                            <circle cx="200" cy="200" r="125" fill="none" stroke="#d97706" strokeWidth="1.2" strokeDasharray="3 3" />

                            {/* Golden Pentagram Star (5 Summits) */}
                            <polygon 
                              points="200,35 249,156 380,156 274,233 315,355 200,280 85,355 126,233 20,156 151,156" 
                              fill="none" 
                              stroke="#78350f" 
                              strokeWidth="2.2" 
                              strokeLinejoin="round"
                            />

                            {/* Inner Golden Pentagram */}
                            <polygon 
                              points="200,60 282,313 118,156 282,156 118,313" 
                              fill="none" 
                              stroke="#b45309" 
                              strokeWidth="1.5" 
                              strokeLinejoin="round"
                            />

                            {/* Summit 1: Top (200, 60) */}
                            <circle cx="200" cy="60" r="22" fill="#fde68a" stroke="#78350f" strokeWidth="1.8" />
                            <text x="200" y="65" textAnchor="middle" fill="#451a03" fontSize="12" fontWeight="bold" fontFamily="serif">
                              {activePentagramPreset.namesAr[0]}
                            </text>

                            {/* Summit 2: Top-Right (333, 156) */}
                            <circle cx="333" cy="156" r="22" fill="#fde68a" stroke="#78350f" strokeWidth="1.8" />
                            <text x="333" y="161" textAnchor="middle" fill="#451a03" fontSize="12" fontWeight="bold" fontFamily="serif">
                              {activePentagramPreset.namesAr[1]}
                            </text>

                            {/* Summit 3: Bottom-Right (282, 313) */}
                            <circle cx="282" cy="313" r="22" fill="#fde68a" stroke="#78350f" strokeWidth="1.8" />
                            <text x="282" y="318" textAnchor="middle" fill="#451a03" fontSize="12" fontWeight="bold" fontFamily="serif">
                              {activePentagramPreset.namesAr[2]}
                            </text>

                            {/* Summit 4: Bottom-Left (118, 313) */}
                            <circle cx="118" cy="313" r="22" fill="#fde68a" stroke="#78350f" strokeWidth="1.8" />
                            <text x="118" y="318" textAnchor="middle" fill="#451a03" fontSize="12" fontWeight="bold" fontFamily="serif">
                              {activePentagramPreset.namesAr[3]}
                            </text>

                            {/* Summit 5: Top-Left (67, 156) */}
                            <circle cx="67" cy="156" r="22" fill="#fde68a" stroke="#78350f" strokeWidth="1.8" />
                            <text x="67" y="161" textAnchor="middle" fill="#451a03" fontSize="12" fontWeight="bold" fontFamily="serif">
                              {activePentagramPreset.namesAr[4]}
                            </text>

                            {/* Central Heart */}
                            <circle cx="200" cy="200" r="30" fill="#fef3c7" stroke="#78350f" strokeWidth="2.2" />
                            <text x="200" y="206" textAnchor="middle" fill="#451a03" fontSize="13" fontWeight="bold" fontFamily="serif">
                              {activePentagramPreset.centerNameAr}
                            </text>
                          </svg>
                        </div>

                        <div className="grid grid-cols-5 gap-1.5 w-full max-w-md mx-auto my-2 text-center">
                          {activePentagramPreset.namesAr.map((name, i) => (
                            <div key={i} className="p-1.5 border border-amber-900/40 rounded-xl bg-amber-100/70 shadow-xs">
                              <span className="text-xs font-bold text-amber-950 block font-serif">{name}</span>
                              <span className="text-[9px] text-amber-800">{langKey === 'ha' ? 'Koliya' : langKey === 'en' ? 'Summit' : 'Sommet'} {i + 1}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-3 bg-amber-100/60 rounded-xl border border-amber-900/40 text-xs text-left w-full max-w-md mx-auto space-y-1">
                          <p className="font-bold text-amber-950">{tStrings.pentagramWirdTitle} ({activePentagramPreset.wirdCount} {tStrings.shajaratTimesUnit})</p>
                          <p className="text-amber-900 italic">{tStrings.pentagramWirdInstructions}</p>
                        </div>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Global Parchment Exporter Modal */}
        <ParchmentExporterModal
          isOpen={isParchmentOpen}
          onClose={() => setIsParchmentOpen(false)}
          title={tStrings.toolTitle}
          subtitle={tStrings.toolSubtitle}
          content={
            <div className="w-full space-y-6 text-slate-900 font-serif p-2 sm:p-4">
              <div className="text-center space-y-1 border-b-2 border-amber-800/40 pb-4">
                <h3 className="text-2xl font-bold font-serif text-amber-950">{tStrings.toolTitle}</h3>
                <p className="text-xs text-amber-900 italic">{tStrings.toolBadge}</p>
              </div>

              {/* Active Tab Parchment Content */}
              {activeTab === 'huroof' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-center text-amber-950">{tStrings.huroofMatrixTitle}</h4>
                  <div 
                    className="grid gap-2 max-w-[320px] mx-auto p-4 border-2 border-amber-900 bg-amber-50 rounded-xl"
                    style={{ gridTemplateColumns: `repeat(${huroofGridSize}, minmax(0, 1fr))` }}
                  >
                    {huroofMatrix.map((row, r) =>
                      row.map((cell, c) => (
                        <div key={`${r}-${c}`} className="aspect-square border border-amber-800/60 flex items-center justify-center text-xl font-bold text-amber-950">
                          {cell.letter}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="text-center text-xs text-amber-900">
                    <p>{tStrings.huroofTotalAdad} <strong>{huroofAdadTotal}</strong></p>
                  </div>
                </div>
              )}

              {activeTab === 'angels' && (
                <div className="space-y-4 text-center">
                  <h4 className="text-lg font-bold text-amber-950">{tStrings.angelsSealTitle}</h4>
                  <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto text-xs">
                    {ARCHANGELS_DATA.map(a => (
                      <div key={a.id} className="p-2 border border-amber-800 rounded bg-amber-50">
                        <strong className="block text-sm">{a.namePhonetic} ({a.nameAr})</strong>
                        <span>{langKey === 'ha' ? a.directionHa : langKey === 'en' ? a.directionEn : a.directionFr}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs italic text-amber-950 mt-2">"{tStrings.angelsInvocationText}"</p>
                </div>
              )}

              {activeTab === 'mutaqati' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-center text-amber-950">{tStrings.mutaqatiMatrixTitle}</h4>
                  <div className="grid grid-cols-5 gap-1.5 max-w-[320px] mx-auto p-3 border-2 border-amber-900 bg-amber-50 rounded-xl">
                    {dualWafqData.outerGrid.map((row, r) =>
                      row.map((val, c) => (
                        <div key={`${r}-${c}`} className="aspect-square border border-amber-800/40 flex items-center justify-center font-bold text-xs">
                          {val}
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-center text-xs text-amber-900">Target Adad: {numericTarget}</p>
                </div>
              )}

              {activeTab === 'shajarat' && (
                <div className="w-full space-y-4 text-center font-serif text-amber-950 p-1">
                  <h4 className="text-lg sm:text-xl font-bold text-amber-950">{tStrings.shajaratTreeTitle}</h4>
                  <p className="text-xs text-amber-900 italic">
                    {shajaratInputName ? `${langKey === 'ha' ? 'Itacen Halitta da Rassan Ruhaniya na :' : langKey === 'en' ? 'Cosmic Tree & Spiritual Branch of :' : 'Arbre Cosmologique & Rameau Spirituel de :'} ${shajaratInputName}` : (langKey === 'ha' ? 'Itacen Halittar Duniya (Digiri 28 — Shajarat al-Kawn)' : langKey === 'en' ? 'The Cosmic Tree of Existence (28 Degrees — Shajarat al-Kawn)' : "L'Arbre Cosmique de l'Existence (28 Degrés — Shajarat al-Kawn)")}
                  </p>

                  {/* Visual SVG Tree on Sacred Parchment */}
                  <div className="w-full max-w-[420px] aspect-[1/1] mx-auto my-3 p-3 rounded-2xl bg-amber-50/95 border-2 border-amber-800/60 shadow-md relative overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 100 102" className="w-full h-full">
                      <circle cx="50" cy="50" r="48" fill="none" stroke="#d97706" strokeWidth="0.6" strokeDasharray="1.5 1.5" opacity="0.4" />
                      <circle cx="50" cy="50" r="39" fill="none" stroke="#b45309" strokeWidth="0.4" opacity="0.3" />
                      <circle cx="50" cy="50" r="28" fill="none" stroke="#d97706" strokeWidth="0.4" strokeDasharray="1 1" opacity="0.3" />

                      {/* Tree Trunk & Branches */}
                      <path d="M50,92 Q50,78 50,72" stroke="#78350f" strokeWidth="3" strokeLinecap="round" fill="none" />
                      <path d="M50,72 Q40,62 32,56" stroke="#92400e" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                      <path d="M50,72 Q60,62 68,56" stroke="#92400e" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                      <path d="M32,56 Q25,48 20,40" stroke="#0f766e" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                      <path d="M32,56 Q40,46 50,38" stroke="#0f766e" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                      <path d="M68,56 Q75,48 80,40" stroke="#0f766e" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                      <path d="M50,38 Q50,28 50,18" stroke="#0f766e" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                      <path d="M50,38 Q38,30 30,22" stroke="#d97706" strokeWidth="1.2" strokeDasharray="1.2 1.2" fill="none" />
                      <path d="M50,38 Q62,30 70,22" stroke="#d97706" strokeWidth="1.2" strokeDasharray="1.2 1.2" fill="none" />

                      {/* Cosmic Nodes */}
                      {SHAJARAT_NODES.map((node) => {
                        const isSelected = selectedShajaratNode.id === node.id;
                        const isPersonal = personalShajaratBranch.node.id === node.id;
                        return (
                          <g key={node.id}>
                            {(isSelected || isPersonal) && (
                              <circle 
                                cx={node.x} 
                                cy={node.y} 
                                r={isPersonal ? 7.5 : 6.8} 
                                fill="none" 
                                stroke="#d97706" 
                                strokeWidth="0.8" 
                                strokeDasharray="1.5 1.5"
                              />
                            )}
                            <circle 
                              cx={node.x} 
                              cy={node.y} 
                              r={isSelected || isPersonal ? 5.8 : 4.2} 
                              fill={isPersonal ? '#fde68a' : isSelected ? '#fef3c7' : '#ffffff'} 
                              stroke={isPersonal ? '#b45309' : isSelected ? '#d97706' : '#78350f'} 
                              strokeWidth={isPersonal ? 1.6 : 1.1} 
                            />
                            <text 
                              x={node.x} 
                              y={node.y + 1.3} 
                              textAnchor="middle" 
                              fill="#451a03" 
                              fontSize="3.4" 
                              fontWeight="bold" 
                              fontFamily="serif"
                            >
                              {node.letter}
                            </text>
                            <text 
                              x={node.x} 
                              y={node.y + 3.8} 
                              textAnchor="middle" 
                              fill="#78350f" 
                              fontSize="1.6" 
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              Φ{node.fibonacciRatio}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Metaphysical & Theurgic Information Box */}
                  <div className="p-4 bg-amber-100/80 rounded-2xl border-2 border-amber-900/50 text-xs my-3 text-left space-y-2.5 w-full max-w-lg mx-auto shadow-inner">
                    <div className="flex items-center justify-between border-b border-amber-900/20 pb-2">
                      <span className="font-bold text-sm text-amber-950 font-serif">
                        {langKey === 'ha' ? personalShajaratBranch.node.titleHa : langKey === 'en' ? personalShajaratBranch.node.titleEn : personalShajaratBranch.node.titleFr} {personalShajaratBranch.rootLetter?.letter ? `(${personalShajaratBranch.rootLetter.letter})` : ''}
                      </span>
                      <span className="text-[11px] font-mono text-amber-900 font-bold px-2 py-0.5 rounded bg-amber-200/80 border border-amber-400/60">
                        Ratio Φ : {personalShajaratBranch.node.fibonacciRatio}
                      </span>
                    </div>

                    <p className="text-amber-950 leading-relaxed italic">
                      « {langKey === 'ha' ? personalShajaratBranch.node.theurgicSecretHa : langKey === 'en' ? personalShajaratBranch.node.theurgicSecretEn : personalShajaratBranch.node.theurgicSecretFr} »
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-900/20 text-[11px]">
                      <div>
                        <span className="text-amber-800/80 block">{tStrings.shajaratDivinePresence}</span>
                        <strong className="text-amber-950">
                          {langKey === 'ha' ? personalShajaratBranch.node.presenceHa : langKey === 'en' ? personalShajaratBranch.node.presenceEn : personalShajaratBranch.node.presenceFr}
                        </strong>
                      </div>
                      <div>
                        <span className="text-amber-800/80 block">{tStrings.shajaratSpiritualSphere}</span>
                        <strong className="text-amber-950">{personalShajaratBranch.node.worldArabic}</strong>
                      </div>
                      <div>
                        <span className="text-amber-800/80 block">{langKey === 'ha' ? 'Sunayen Allah Larabci :' : langKey === 'en' ? 'Arabic Divine Names:' : 'Noms Divins Arabes :'}</span>
                        <span className="font-serif font-bold text-amber-950" dir="rtl">{personalShajaratBranch.node.divineNamesAr.join(' • ')}</span>
                      </div>
                      <div>
                        <span className="text-amber-800/80 block">{tStrings.shajaratMuwakkalLabel}</span>
                        <strong className="text-amber-950">{personalShajaratBranch.node.angelicGuardAr || personalShajaratBranch.node.angelicGuard}</strong>
                      </div>
                    </div>

                    {/* Recitation Dhikr Formula */}
                    <div className="pt-2 border-t border-amber-900/20 text-center space-y-1 bg-amber-200/50 p-2.5 rounded-xl">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-amber-900 block">{tStrings.shajaratSacredFormulaLabel}</span>
                      <p className="text-base sm:text-lg font-serif font-bold text-amber-950 leading-relaxed" dir="rtl">
                        {personalShajaratBranch.node.dhikrFormulaAr}
                      </p>
                      <p className="text-[10px] text-amber-900 italic font-mono">
                        {personalShajaratBranch.node.dhikrFormulaPhonetic}
                      </p>
                      <span className="text-[10px] font-bold text-amber-950 block">
                        {tStrings.shajaratDhikrCount} <strong>{personalShajaratBranch.node.recommendedCount} {tStrings.shajaratTimesUnit}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'pentagram' && (
                <div className="space-y-4 text-center">
                  <h4 className="text-lg font-bold text-amber-950">{langKey === 'ha' ? activePentagramPreset.nameHa : langKey === 'en' ? activePentagramPreset.nameEn : activePentagramPreset.nameFr}</h4>
                  <p className="text-sm font-serif font-bold text-amber-900">
                    {langKey === 'ha' ? 'Tsakiya' : langKey === 'en' ? 'Center' : 'Centre'}: {activePentagramPreset.centerNameAr} — {langKey === 'ha' ? 'Jimilla' : langKey === 'en' ? 'Sum' : 'Somme'}: {pentagramTotalSum}
                  </p>
                </div>
              )}
            </div>
          }
        />

        {/* Access Restriction Modal */}
        <AccessRestrictionModal
          isOpen={restrictionModal.isOpen}
          onClose={() => setRestrictionModal({ isOpen: false, type: null })}
          restrictionType={restrictionModal.type}
          featureName={restrictionModal.featureName || tStrings.toolTitle}
          language={langKey}
        />

      </div>
    </div>
  );
};
