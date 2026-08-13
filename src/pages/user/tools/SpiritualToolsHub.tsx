import React, { useState } from 'react';
import {
  ShieldCheck,
  Anchor,
  EyeOff,
  Brain,
  Feather,
  Compass,
  Sparkles,
  Lock,
  Star,
  Crosshair,
  ArrowLeft,
  Info,
  Layers,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { DISCRETION_TRANSLATIONS } from '../../../components/discretion/discretionTranslations';
import { ANCHORING_TRANSLATIONS } from '../../../components/anchoring/anchoringTranslations';

// Sub-Tool Components
import KhatamKhummTab from '../../../components/discretion/KhatamKhummTab';
import HissnAqlTab from '../../../components/discretion/HissnAqlTab';
import TarkibHarfiTab from '../../../components/discretion/TarkibHarfiTab';
import UsturlabAsrarTab from '../../../components/discretion/UsturlabAsrarTab';
import IsmBatinTab from '../../../components/anchoring/IsmBatinTab';
import KhatamThabatTab from '../../../components/anchoring/KhatamThabatTab';
import MizanThawabitTab from '../../../components/anchoring/MizanThawabitTab';
import KhatimIrtikazTab from '../../../components/anchoring/KhatimIrtikazTab';

type SubToolId =
  | 'khumm'
  | 'hissn'
  | 'tarkib'
  | 'usturlab'
  | 'ismBatin'
  | 'khatamThabat'
  | 'mizanThawabit'
  | 'khatimIrtikaz';

export default function SpiritualToolsHub() {
  const navigate = useNavigate();
  const { language, t: globalT } = useLanguage();
  const { isPremium } = useAuth();
  const detailsRef = React.useRef<HTMLDivElement>(null);

  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const discretionT = DISCRETION_TRANSLATIONS[langKey] || DISCRETION_TRANSLATIONS.fr;
  const anchoringT = ANCHORING_TRANSLATIONS[langKey] || ANCHORING_TRANSLATIONS.fr;

  const [activeCategory, setActiveCategory] = useState<'all' | 'discretion' | 'anchoring'>('all');
  const [activeTab, setActiveTab] = useState<SubToolId>('khumm');

  const handleSelectSubTool = (id: SubToolId) => {
    setActiveTab(id);
    setTimeout(() => {
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Sub-tools metadata configuration
  const allSubTools = [
    {
      id: 'khumm' as SubToolId,
      category: 'discretion',
      label: discretionT.tabs.khatamKhumm,
      icon: EyeOff,
      badge: '19 Hurūf Sāmitah',
      descFr: 'Sceau polygonale des 19 lettres muettes pour voiler les secrets.',
      descEn: 'Polygonal seal of the 19 mute letters to veil sacred secrets.',
      descHa: 'Hatimin haruffa 19 masu shiru domin rufa asiri.',
    },
    {
      id: 'hissn' as SubToolId,
      category: 'discretion',
      label: discretionT.tabs.hissnAql,
      icon: Brain,
      badge: 'Wafq 3x3 / 4x4',
      descFr: 'Grille de fortification psychologique face au stress et la fatigue.',
      descEn: 'Psychological fortification grid against stress and mental fatigue.',
      descHa: 'Gidajen kariya da daidaita tunani daga damuwa da tsoro.',
    },
    {
      id: 'tarkib' as SubToolId,
      category: 'discretion',
      label: discretionT.tabs.tarkibHarfi,
      icon: Feather,
      badge: 'Glyphe Harfi',
      descFr: 'Monogramme abrégé par fusion géométrique des consonnes.',
      descEn: 'Condensed monogram by geometric consonant fusion.',
      descHa: 'Tambarin haruffan suna domin tafiya da shi a sirrance.',
    },
    {
      id: 'usturlab' as SubToolId,
      category: 'discretion',
      label: discretionT.tabs.usturlabAsrar,
      icon: Compass,
      badge: 'Azimut Abjad',
      descFr: "Astrolabe céleste d'Abjad selon l'azimut du ciel local.",
      descEn: 'Celestial Abjad astrolabe aligned with local sky azimuth.',
      descHa: 'Agogon taurari na sirrin samaniya don gano lokacin addu\'a.',
    },
    {
      id: 'ismBatin' as SubToolId,
      category: 'anchoring',
      label: anchoringT.tabs.ismBatin,
      icon: Sparkles,
      badge: 'Ism al-Batin',
      descFr: "Nom Secret de l'Âme par déduction de la constellation natale.",
      descEn: 'Secret Soul Name deducted from reference natal constellation.',
      descHa: 'Asalin sunan sirri na kurwa daga tauraron haihuwa.',
    },
    {
      id: 'khatamThabat' as SubToolId,
      category: 'anchoring',
      label: anchoringT.tabs.khatamThabat,
      icon: Lock,
      badge: 'Thabat Verrouillé',
      descFr: 'Carré magique stabilisé avec points de pivot verrouillés.',
      descEn: 'Locked magic square with corner and center pivot anchors.',
      descHa: 'Hatimin tabbatar da al\'amari mai maballan kullewa.',
    },
    {
      id: 'mizanThawabit' as SubToolId,
      category: 'anchoring',
      label: anchoringT.tabs.mizanThawabit,
      icon: Star,
      badge: '10 Étoiles Béhéniennes',
      descFr: 'Balance des Étoiles Fixes et résonance talismanique.',
      descEn: 'Fixed Stars balance and Behenian talismanic resonance.',
      descHa: 'Awo da kwatanta nauyi da taurari kafaffu na kariya.',
    },
    {
      id: 'khatimIrtikaz' as SubToolId,
      category: 'anchoring',
      label: anchoringT.tabs.khatimIrtikaz,
      icon: Crosshair,
      badge: 'Vecteur Canvas',
      descFr: 'Coordonnées vectorielles de départ (X, Y, Angle, Rayon).',
      descEn: 'Vector anchor coordinates (X, Y, Angle, Radius) for canvas drawing.',
      descHa: 'Madaidaicin wajen fara zana da rubutu a kan allo.',
    },
  ];

  const filteredSubTools = allSubTools.filter(
    (st) => activeCategory === 'all' || st.category === activeCategory
  );

  const getSubToolDesc = (st: (typeof allSubTools)[0]) => {
    if (langKey === 'en') return st.descEn;
    if (langKey === 'ha') return st.descHa;
    return st.descFr;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tools')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-gray-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>{discretionT.backToTools}</span>
        </button>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold shadow-sm">
          <Layers size={14} />
          <span>
            {globalT('spiritualToolsHub.headerBadge', 'Centre Spirituel & Protection')}
          </span>
        </div>
      </div>

      {/* Main Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-amber-500/20">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Shield size={14} />
            <span>Kitmān, Hissn, Thabat & Mizan</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-300">
            {globalT('spiritualToolsHub.pageTitle', 'Centre de Protection & Ancrage Spirituel')}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            {globalT(
              'spiritualToolsHub.pageSubtitle',
              'Hub unifié regroupant les 8 sous-outils sacrés de Discrétion, Protection Mentale, Ancrage Astrale et Fixation de Noms et Talismans.'
            )}
          </p>
        </div>

        {/* Background Decorative Icon */}
        <ShieldCheck size={260} className="absolute -right-10 -bottom-16 text-amber-500/10 pointer-events-none" />
      </div>

      {/* Category Tabs Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            {globalT('spiritualToolsHub.categoryAll', 'Tous les 8 Sous-Outils')}
          </button>

          <button
            onClick={() => setActiveCategory('discretion')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeCategory === 'discretion'
                ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            <ShieldCheck size={16} />
            <span>{globalT('spiritualToolsHub.categoryDiscretion', 'Discrétion & Protection Mentale')}</span>
          </button>

          <button
            onClick={() => setActiveCategory('anchoring')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeCategory === 'anchoring'
                ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            <Anchor size={16} />
            <span>{globalT('spiritualToolsHub.categoryAnchoring', 'Ancrage & Stabilité Astrale')}</span>
          </button>
        </div>

        <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
          8 / 8 Sub-Tools Active
        </span>
      </div>

      {/* Sub-Tools Grid Overview / Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredSubTools.map((st) => {
          const Icon = st.icon;
          const isSelected = activeTab === st.id;
          return (
            <button
              key={st.id}
              onClick={() => handleSelectSubTool(st.id)}
              className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-500/20 via-slate-900 to-indigo-950 border-amber-500/60 shadow-lg ring-2 ring-amber-500/40 text-white'
                  : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-amber-500/40 text-gray-900 dark:text-white'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`p-2 rounded-xl border ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-300'
                      : 'bg-gray-100 dark:bg-slate-800 text-amber-500 border-gray-200 dark:border-slate-700'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20">
                  {st.badge}
                </span>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold line-clamp-1">{st.label}</h4>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                  {getSubToolDesc(st)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sub-Tool Content Display Area */}
      <div ref={detailsRef} className="pt-2 transition-all duration-300 scroll-mt-6">
        {/* Category 1: Discretion & Mental Protection Sub-tools */}
        {activeTab === 'khumm' && <KhatamKhummTab t={discretionT} />}
        {activeTab === 'hissn' && <HissnAqlTab t={discretionT} />}
        {activeTab === 'tarkib' && <TarkibHarfiTab t={discretionT} />}
        {activeTab === 'usturlab' && <UsturlabAsrarTab t={discretionT} />}

        {/* Category 2: Anchoring & Astral Stability Sub-tools */}
        {activeTab === 'ismBatin' && <IsmBatinTab t={anchoringT} />}
        {activeTab === 'khatamThabat' && <KhatamThabatTab t={anchoringT} />}
        {activeTab === 'mizanThawabit' && <MizanThawabitTab t={anchoringT} />}
        {activeTab === 'khatimIrtikaz' && <KhatimIrtikazTab t={anchoringT} />}
      </div>

      {/* Sacred Principle Notice Footer */}
      <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
          <Info size={16} />
          <span>{discretionT.noticeTitle}</span>
        </div>
        <p className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed">
          {discretionT.noticeText}
        </p>
      </div>
    </div>
  );
}
