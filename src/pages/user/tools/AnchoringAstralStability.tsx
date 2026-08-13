import React, { useState } from 'react';
import {
  Anchor,
  Sparkles,
  Lock,
  Star,
  Crosshair,
  ArrowLeft,
  Info,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { ANCHORING_TRANSLATIONS } from '../../../components/anchoring/anchoringTranslations';
import IsmBatinTab from '../../../components/anchoring/IsmBatinTab';
import KhatamThabatTab from '../../../components/anchoring/KhatamThabatTab';
import MizanThawabitTab from '../../../components/anchoring/MizanThawabitTab';
import KhatimIrtikazTab from '../../../components/anchoring/KhatimIrtikazTab';

export default function AnchoringAstralStability() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isPremium } = useAuth();
  const detailsRef = React.useRef<HTMLDivElement>(null);

  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const t = ANCHORING_TRANSLATIONS[langKey] || ANCHORING_TRANSLATIONS.fr;

  const [activeTab, setActiveTab] = useState<'ismBatin' | 'khatamThabat' | 'mizanThawabit' | 'khatimIrtikaz'>('ismBatin');

  const handleTabChange = (tabId: 'ismBatin' | 'khatamThabat' | 'mizanThawabit' | 'khatimIrtikaz') => {
    setActiveTab(tabId);
    setTimeout(() => {
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tools')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-gray-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{t.backToTools}</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold">
          <Anchor size={14} />
          <span>{t.headerBadge}</span>
        </div>
      </div>

      {/* Main Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-2xl border border-slate-800">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={14} />
            <span>Thabat & Mizan al-Nujum</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-300">
            {t.pageTitle}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            {t.pageSubtitle}
          </p>
        </div>

        {/* Decorative Background Icon */}
        <Anchor size={280} className="absolute -right-12 -bottom-20 text-slate-800/20 pointer-events-none" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-slate-800 pb-3">
        {[
          { id: 'ismBatin', label: t.tabs.ismBatin, icon: Sparkles },
          { id: 'khatamThabat', label: t.tabs.khatamThabat, icon: Lock },
          { id: 'mizanThawabit', label: t.tabs.mizanThawabit, icon: Star },
          { id: 'khatimIrtikaz', label: t.tabs.khatimIrtikaz, icon: Crosshair }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg scale-105'
                  : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sub-Tool Content */}
      <div ref={detailsRef} className="transition-all duration-300 scroll-mt-6">
        {activeTab === 'ismBatin' && <IsmBatinTab t={t} />}
        {activeTab === 'khatamThabat' && <KhatamThabatTab t={t} />}
        {activeTab === 'mizanThawabit' && <MizanThawabitTab t={t} />}
        {activeTab === 'khatimIrtikaz' && <KhatimIrtikazTab t={t} />}
      </div>

      {/* Sacred Principle Notice Footer */}
      <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
          <Info size={16} />
          <span>{t.noticeTitle}</span>
        </div>
        <p className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed">
          {t.noticeText}
        </p>
      </div>
    </div>
  );
}
