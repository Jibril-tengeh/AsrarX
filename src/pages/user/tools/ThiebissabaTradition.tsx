import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Layers,
  Home,
  Crown,
  Calculator,
  HeartHandshake,
  Compass,
  Clock,
  ShieldCheck,
  Info,
  History,
  Eye,
  Zap,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Geolocation } from '@capacitor/geolocation';
import { useLanguage } from '../../../contexts/LanguageContext';
import { THIEBISSABA_TRANSLATIONS, ThiebissabaTranslation } from '../../../components/thiebissaba/thiebissabaTranslations';

// Sub-Tool Components
import TraceTroisRangsTab from '../../../components/thiebissaba/TraceTroisRangsTab';
import QuatreMaisonsTab from '../../../components/thiebissaba/QuatreMaisonsTab';
import FiguresMandinguesTab from '../../../components/thiebissaba/FiguresMandinguesTab';
import CalculateurKadyoTab from '../../../components/thiebissaba/CalculateurKadyoTab';
import AnalyseurSarakaTab from '../../../components/thiebissaba/AnalyseurSarakaTab';
import KounWaSenTab from '../../../components/thiebissaba/KounWaSenTab';
import ChronometreTimingTab from '../../../components/thiebissaba/ChronometreTimingTab';
import FusionAbjadTab from '../../../components/thiebissaba/FusionAbjadTab';
import KouroukanFougaTab from '../../../components/thiebissaba/KouroukanFougaTab';
import HistoriqueTab from '../../../components/thiebissaba/HistoriqueTab';
import { ThiebissabaHistoryEntry } from '../../../utils/thiebissabaHistory';

type SubTab =
  | 'trace'
  | 'maisons'
  | 'figures'
  | 'kadyo'
  | 'saraka'
  | 'koun'
  | 'timing'
  | 'fusion'
  | 'kouroukan'
  | 'historique';

export default function ThiebissabaTradition() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const t: ThiebissabaTranslation = THIEBISSABA_TRANSLATIONS[langKey] || THIEBISSABA_TRANSLATIONS.fr;
  const detailsRef = React.useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<SubTab>('trace');

  // Global Mode Mystique Geolocation state
  const [isMystiqueMode, setIsMystiqueMode] = useState<boolean>(false);
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');

  // Reloaded Theme State from History
  const [reloadedIntention, setReloadedIntention] = useState<string>('');
  const [reloadedDots, setReloadedDots] = useState<{ r1: number; r2: number; r3: number }>({ r1: 7, r2: 8, r3: 9 });

  const handleToggleGlobalMystique = async () => {
    if (!isMystiqueMode) {
      setIsMystiqueMode(true);
      if (!geoCoords) {
        setGeoStatus('fetching');
        try {
          const position = await Geolocation.getCurrentPosition({ timeout: 10000 });
          setGeoCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setGeoStatus('success');
        } catch (capErr) {
          console.warn('Capacitor Geolocation fallback to navigator:', capErr);
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setGeoCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                setGeoStatus('success');
              },
              (err) => {
                console.warn('Web geolocation error:', err);
                setGeoStatus('error');
              },
              { timeout: 10000 }
            );
          } else {
            setGeoStatus('error');
          }
        }
      }
    } else {
      setIsMystiqueMode(false);
    }
  };

  const handleReloadTheme = (entry: ThiebissabaHistoryEntry) => {
    setReloadedIntention(entry.intention);
    setReloadedDots({
      r1: entry.dotsRow1,
      r2: entry.dotsRow2,
      r3: entry.dotsRow3,
    });
    setActiveTab('trace');
    setTimeout(() => {
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleTabChange = (tabId: SubTab) => {
    setActiveTab(tabId);
    setTimeout(() => {
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const tabList = [
    { id: 'trace' as SubTab, label: t.tabs.traceTroisRangs, icon: Layers },
    { id: 'maisons' as SubTab, label: t.tabs.quatreMaisons, icon: Home },
    { id: 'figures' as SubTab, label: t.tabs.figuresMandingues, icon: Crown },
    { id: 'kadyo' as SubTab, label: t.tabs.calculateurKadyo, icon: Calculator },
    { id: 'saraka' as SubTab, label: t.tabs.analyseurSaraka, icon: HeartHandshake },
    { id: 'koun' as SubTab, label: t.tabs.kounWaSen, icon: Compass },
    { id: 'timing' as SubTab, label: t.tabs.chronometreTiming, icon: Clock },
    { id: 'fusion' as SubTab, label: t.tabs.fusionAbjad, icon: Sparkles },
    { id: 'kouroukan' as SubTab, label: t.tabs.kouroukanFouga, icon: ShieldCheck },
    { id: 'historique' as SubTab, label: t.tabs.historique, icon: History },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tools')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-gray-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>{t.backToTools}</span>
        </button>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold shadow-sm">
          <Sparkles size={14} />
          <span>{t.headerBadge}</span>
        </div>
      </div>

      {/* Main Banner Header with Global Mode Mystique Switch */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-950 via-amber-950 to-slate-950 p-6 sm:p-8 text-white shadow-2xl border border-amber-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} />
                <span>Science Mystique Mandingue</span>
              </div>
              {isMystiqueMode && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 animate-pulse">
                  <Sparkles size={12} />
                  <span>GPS Céleste Actif</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              {t.pageTitle}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              {t.pageSubtitle}
            </p>
          </div>

          {/* Global Mode Mystique Switch Banner */}
          <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/40 shrink-0 space-y-2 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2 text-xs font-bold text-amber-300">
              <Zap size={16} />
              <span>Mode Mystique Céleste</span>
            </div>
            <p className="text-[11px] text-slate-300 max-w-xs">
              Ajuste automatiquement les calculs du Chronomètre selon le lever/coucher réel du soleil via Capacitor GPS.
            </p>
            <button
              onClick={handleToggleGlobalMystique}
              className={`w-full mt-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isMystiqueMode
                  ? 'bg-amber-500 text-slate-950 shadow-lg ring-2 ring-amber-400/50'
                  : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30'
              }`}
            >
              <Eye size={16} className={isMystiqueMode ? 'animate-spin' : ''} />
              <span>{isMystiqueMode ? 'Mode Mystique Actif (GPS)' : 'Activer le Mode Mystique'}</span>
            </button>
            {isMystiqueMode && geoCoords && (
              <span className="text-[10px] text-amber-200/90 font-mono block pt-1">
                <MapPin size={10} className="inline mr-1" />
                GPS: {geoCoords.lat.toFixed(2)}°, {geoCoords.lon.toFixed(2)}°
              </span>
            )}
          </div>
        </div>

        {/* Background Decorative Graphic */}
        <Sparkles size={260} className="absolute -right-10 -bottom-16 text-amber-500/10 pointer-events-none" />
      </div>

      {/* Tab Switcher Grid */}
      <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
        {tabList.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-tool Display Area */}
      <div ref={detailsRef} className="pt-2 transition-all duration-300 scroll-mt-6">
        {activeTab === 'trace' && (
          <TraceTroisRangsTab
            t={t}
            langKey={langKey}
            initialIntention={reloadedIntention}
            initialDots={reloadedDots}
          />
        )}
        {activeTab === 'maisons' && <QuatreMaisonsTab t={t} langKey={langKey} />}
        {activeTab === 'figures' && <FiguresMandinguesTab t={t} langKey={langKey} />}
        {activeTab === 'kadyo' && <CalculateurKadyoTab t={t} langKey={langKey} />}
        {activeTab === 'saraka' && <AnalyseurSarakaTab t={t} langKey={langKey} />}
        {activeTab === 'koun' && <KounWaSenTab t={t} langKey={langKey} />}
        {activeTab === 'timing' && (
          <ChronometreTimingTab
            t={t}
            langKey={langKey}
            isMystiqueMode={isMystiqueMode}
            geoCoords={geoCoords}
            geoStatus={geoStatus}
            onToggleMystique={handleToggleGlobalMystique}
          />
        )}
        {activeTab === 'fusion' && <FusionAbjadTab t={t} langKey={langKey} />}
        {activeTab === 'kouroukan' && <KouroukanFougaTab t={t} langKey={langKey} />}
        {activeTab === 'historique' && (
          <HistoriqueTab t={t} langKey={langKey} onReloadTheme={handleReloadTheme} />
        )}
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
