import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Sunrise, Sparkles, Eye, MapPin, Zap } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { ThiebissabaTranslation } from './thiebissabaTranslations';
import { getCurrentMandingueTiming, getCelestialMandingueTiming } from '../../utils/thiebissaba';

interface ChronometreTimingTabProps {
  t: ThiebissabaTranslation;
  langKey: 'fr' | 'en' | 'ha';
  isMystiqueMode?: boolean;
  geoCoords?: { lat: number; lon: number } | null;
  geoStatus?: 'idle' | 'fetching' | 'success' | 'error';
  onToggleMystique?: () => void;
}

export default function ChronometreTimingTab({
  t,
  langKey,
  isMystiqueMode: propMystique,
  geoCoords: propCoords,
  geoStatus: propStatus,
  onToggleMystique: propToggle,
}: ChronometreTimingTabProps) {
  const [now, setNow] = useState(new Date());
  const [localMystiqueMode, setLocalMystiqueMode] = useState<boolean>(false);
  const [localCoords, setLocalCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [localStatus, setLocalStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');

  const isMystique = propMystique !== undefined ? propMystique : localMystiqueMode;
  const coords = propCoords !== undefined ? propCoords : localCoords;
  const status = propStatus !== undefined ? propStatus : localStatus;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleMystique = async () => {
    if (propToggle) {
      propToggle();
      return;
    }

    if (!localMystiqueMode) {
      setLocalMystiqueMode(true);
      if (!localCoords) {
        setLocalStatus('fetching');
        try {
          const position = await Geolocation.getCurrentPosition({ timeout: 10000 });
          setLocalCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocalStatus('success');
        } catch (capacitorErr) {
          console.warn('Capacitor Geolocation fallback to web:', capacitorErr);
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setLocalCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                setLocalStatus('success');
              },
              (err) => {
                console.warn('Web Geolocation error:', err);
                setLocalStatus('error');
              },
              { timeout: 10000 }
            );
          } else {
            setLocalStatus('error');
          }
        }
      }
    } else {
      setLocalMystiqueMode(false);
    }
  };

  const celestialTiming = (isMystique && coords)
    ? getCelestialMandingueTiming(now, coords.lat, coords.lon)
    : null;

  const activeTiming = celestialTiming || getCurrentMandingueTiming(now);

  const phaseDesc = langKey === 'en' ? activeTiming.descriptionEn : langKey === 'ha' ? activeTiming.descriptionHa : activeTiming.descriptionFr;
  const phaseRuler = langKey === 'en' ? activeTiming.rulerEn : langKey === 'ha' ? activeTiming.rulerHa : activeTiming.rulerFr;

  return (
    <div className="space-y-8">
      {/* Intro Banner with Mode Mystique Switch */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-amber-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0 mt-1">
              <Clock className="text-amber-400" size={28} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
                  {t.timing.title}
                </h2>
                {isMystique && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 animate-pulse">
                    <Sparkles size={12} />
                    <span>Mode Mystique Céleste (Capacitor GPS)</span>
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {t.timing.subtitle}
              </p>
            </div>
          </div>

          {/* Mode Mystique Toggle Switch */}
          <button
            onClick={handleToggleMystique}
            className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer border shrink-0 ${
              isMystique
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg ring-2 ring-amber-400/50'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/30'
            }`}
          >
            <Eye size={18} className={isMystique ? 'animate-spin' : ''} />
            <span>{isMystique ? t.timing.mystiqueActive : t.timing.mystiqueToggle}</span>
          </button>
        </div>
      </div>

      {/* Mode Mystique GPS & Solar Telemetry Panel */}
      {isMystique && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/80 via-slate-950 to-amber-900/60 border border-amber-500/40 text-amber-100 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2 font-black text-amber-300 text-xs uppercase tracking-wider">
              <Zap size={16} />
              <span>{t.timing.mystiqueMode} — Télémétrie Solaire Capacitor GPS</span>
            </div>
            {status === 'fetching' && (
              <span className="text-xs text-amber-300 animate-pulse font-medium">
                {t.timing.mystiqueFetching}
              </span>
            )}
            {status === 'error' && (
              <span className="text-xs text-rose-300 font-medium">
                {t.timing.mystiquePermissionDenied}
              </span>
            )}
          </div>

          {coords && celestialTiming && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] uppercase font-bold text-amber-300/80 block">
                  {t.timing.mystiqueCoordinates}
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-amber-200 flex items-center gap-1 mt-1">
                  <MapPin size={12} />
                  {coords.lat.toFixed(2)}°, {coords.lon.toFixed(2)}°
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] uppercase font-bold text-amber-300/80 block">
                  Lever / Zénith / Coucher
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-amber-200 mt-1 block">
                  {celestialTiming.sunriseTimeStr} | {celestialTiming.solarNoonStr} | {celestialTiming.sunsetTimeStr}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] uppercase font-bold text-amber-300/80 block">
                  {t.timing.solarElevation}
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-amber-200 mt-1 block">
                  {celestialTiming.solarElevationStr}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] uppercase font-bold text-amber-300/80 block">
                  {t.timing.solarAzimuth}
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-amber-200 mt-1 block">
                  {celestialTiming.solarAzimuthStr}
                </span>
              </div>
            </div>
          )}

          <p className="text-xs text-amber-200/90 italic pt-1">
            {t.timing.mystiqueStatusActive}
          </p>
        </div>
      )}

      {/* Live Clock & Active Phase Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              {t.timing.currentPhase}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-200">
              {langKey === 'en' ? activeTiming.phaseNameEn : langKey === 'ha' ? activeTiming.phaseNameHa : activeTiming.phaseNameFr}
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-right">
            <span className="text-xs text-amber-300 block font-bold">Heure Locale Solaire</span>
            <span className="text-2xl font-mono font-black text-amber-400">
              {now.toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {phaseDesc}
          </p>
          <p className="text-xs text-amber-300 pt-2 border-t border-slate-800">
            <strong>Régent Céleste :</strong> {phaseRuler}
          </p>
        </div>
      </div>

      {/* 3 Phases Detailed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Phase 1: Sogoma */}
        <div className={`p-6 rounded-3xl border transition-all space-y-4 ${
          activeTiming.phaseKey === 'sogoma'
            ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white border-amber-400 ring-2 ring-amber-400/50 shadow-2xl'
            : 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-gray-200 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="p-3 bg-amber-500/20 rounded-2xl text-amber-500">
              <Sunrise size={24} />
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300">
              {celestialTiming ? `${celestialTiming.sunriseTimeStr} - ${celestialTiming.solarNoonStr}` : t.timing.sogomaTime}
            </span>
          </div>
          <div>
            <h4 className="text-lg font-bold">{t.timing.sogomaTitle}</h4>
            <p className="text-xs opacity-80 leading-relaxed mt-2">{t.timing.sogomaDesc}</p>
          </div>
        </div>

        {/* Phase 2: Tele-Karaba */}
        <div className={`p-6 rounded-3xl border transition-all space-y-4 ${
          activeTiming.phaseKey === 'teleKaraba'
            ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white border-amber-400 ring-2 ring-amber-400/50 shadow-2xl'
            : 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-gray-200 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="p-3 bg-amber-500/20 rounded-2xl text-amber-500">
              <Sun size={24} />
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300">
              {celestialTiming ? `${celestialTiming.solarNoonStr} - ${celestialTiming.sunsetTimeStr}` : t.timing.teleKarabaTime}
            </span>
          </div>
          <div>
            <h4 className="text-lg font-bold">{t.timing.teleKarabaTitle}</h4>
            <p className="text-xs opacity-80 leading-relaxed mt-2">{t.timing.teleKarabaDesc}</p>
          </div>
        </div>

        {/* Phase 3: Woula */}
        <div className={`p-6 rounded-3xl border transition-all space-y-4 ${
          activeTiming.phaseKey === 'woula'
            ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white border-amber-400 ring-2 ring-amber-400/50 shadow-2xl'
            : 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-gray-200 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="p-3 bg-amber-500/20 rounded-2xl text-amber-500">
              <Moon size={24} />
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300">
              {celestialTiming ? `${celestialTiming.sunsetTimeStr} - ${celestialTiming.sunriseTimeStr}` : t.timing.woulaTime}
            </span>
          </div>
          <div>
            <h4 className="text-lg font-bold">{t.timing.woulaTitle}</h4>
            <p className="text-xs opacity-80 leading-relaxed mt-2">{t.timing.woulaDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
