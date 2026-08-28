import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Clock,
  MapPin,
  Sparkles,
  Compass,
  Volume2,
  Shield,
  Flame,
  Wind,
  Droplets,
  Mountain,
  ChevronRight,
  Info,
  CheckCircle2,
  Zap,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PlanetDetails,
  CalculatedPlanetaryHour,
  AccurateSolarData,
  HOLY_AND_MAJOR_CITIES,
  CityPreset
} from '../../utils/falakEngine';

interface FalakLiveClockTabProps {
  currentHour: CalculatedPlanetaryHour;
  allHours: CalculatedPlanetaryHour[];
  dayHours: CalculatedPlanetaryHour[];
  nightHours: CalculatedPlanetaryHour[];
  solarData: AccurateSolarData;
  nowTime: Date;
  selectedCity: CityPreset | null;
  onSelectCity: (city: CityPreset | null) => void;
  onGeolocate: () => void;
  geoStatus: string;
  isLocating: boolean;
  userCoords: { lat: number; lng: number } | null;
  onSelectCustomHour?: (hour: CalculatedPlanetaryHour) => void;
}

export const FalakLiveClockTab: React.FC<FalakLiveClockTabProps> = ({
  currentHour,
  allHours,
  dayHours,
  nightHours,
  solarData,
  nowTime,
  selectedCity,
  onSelectCity,
  onGeolocate,
  geoStatus,
  isLocating,
  userCoords
}) => {
  const [viewMode, setViewMode] = useState<'day' | 'night'>(currentHour.isDay ? 'day' : 'night');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [selectedDetailHour, setSelectedDetailHour] = useState<CalculatedPlanetaryHour>(currentHour);

  // Compute live seconds elapsed and remaining in current planetary hour
  const startMs = currentHour.startDate.getTime();
  const endMs = currentHour.endDate.getTime();
  const nowMs = nowTime.getTime();
  const totalDurationSec = Math.max(1, (endMs - startMs) / 1000);
  const elapsedSec = Math.max(0, Math.min(totalDurationSec, (nowMs - startMs) / 1000));
  const remainingSec = Math.max(0, totalDurationSec - elapsedSec);

  const remHours = Math.floor(remainingSec / 3600);
  const remMinutes = Math.floor((remainingSec % 3600) / 60);
  const remSecs = Math.floor(remainingSec % 60);
  const progressPercent = Math.min(100, Math.max(0, (elapsedSec / totalDurationSec) * 100));

  // Element icon helper
  const renderElementIcon = (elem: string) => {
    switch (elem) {
      case 'Feu':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'Air':
        return <Wind className="w-4 h-4 text-cyan-500" />;
      case 'Eau':
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'Terre':
        return <Mountain className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const displayedList = viewMode === 'day' ? dayHours : nightHours;

  return (
    <div className="space-y-6">
      {/* Geolocation & Holy Cities Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-amber-200/60 dark:border-amber-900/40 rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  {selectedCity ? selectedCity.nameFr : 'Position GPS Précise'}
                </span>
                {selectedCity && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold">
                    {selectedCity.countryFr}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                Lat: {userCoords ? userCoords.lat.toFixed(4) : solarData.sunrise.toLocaleDateString()}° | Lng:{' '}
                {userCoords ? userCoords.lng.toFixed(4) : 'Auto'}° • Sā'āt Zamaniyyah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onGeolocate}
              disabled={isLocating}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-zinc-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              {isLocating ? 'Calcul GPS...' : 'Ma Position GPS'}
            </button>

            <button
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              Villes Saintes & Métropoles
            </button>
          </div>
        </div>

        {geoStatus && (
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {geoStatus}
          </p>
        )}

        {/* City Selector Drawer */}
        <AnimatePresence>
          {showCityPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 overflow-hidden"
            >
              <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-2">
                Sélectionner un repère astronomique spirituel :
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {HOLY_AND_MAJOR_CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      onSelectCity(city);
                      setShowCityPicker(false);
                    }}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                      selectedCity?.id === city.id
                        ? 'bg-amber-500 text-zinc-950 border-amber-600 font-black shadow-xs'
                        : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 hover:border-amber-400 text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    <div className="font-bold truncate">{city.nameFr}</div>
                    <div className="text-[10px] opacity-75 font-arabic truncate" dir="rtl">
                      {city.nameAr}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Real-time Hero Card: Active Planetary Hour & Astrological Dynamics */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-indigo-950 text-white p-6 sm:p-7 border border-amber-500/30 shadow-xl">
        {/* Subtle Background Astral Watermark */}
        <div className="absolute right-0 top-0 -mr-10 -mt-10 opacity-10 pointer-events-none text-9xl font-serif">
          {currentHour.planet.symbol}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Left: Current Planet Details */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                Heure Planétaire Active (Sā'ah {currentHour.hourIndex} / 12 {currentHour.isDay ? 'Diurne' : 'Nocturne'})
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-2">
                  <span className={currentHour.planet.color}>{currentHour.planet.symbol}</span>
                  {currentHour.planet.nameFr}
                </span>
                <span className="text-3xl sm:text-4xl font-arabic font-bold text-amber-300" dir="rtl">
                  {currentHour.planet.arabic}
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-300 font-medium leading-relaxed max-w-xl">
              {currentHour.planet.descFr}
            </p>

            {/* Metaphysical Rulers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block">
                  Ange Régent (Al-Malak al-Rūḥānī)
                </span>
                <div className="text-sm font-black text-white flex items-center justify-between mt-0.5">
                  <span>{currentHour.planet.angelFr}</span>
                  <span className="font-arabic text-amber-200 text-base" dir="rtl">
                    {currentHour.planet.angelAr}
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider block">
                  Roi Terrestre (Malik al-Arḍ)
                </span>
                <div className="text-sm font-black text-white flex items-center justify-between mt-0.5">
                  <span>{currentHour.planet.jinnKingFr}</span>
                  <span className="font-arabic text-emerald-200 text-base" dir="rtl">
                    {currentHour.planet.jinnKingAr}
                  </span>
                </div>
              </div>
            </div>

            {/* Correspondences Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] font-bold text-zinc-200 flex items-center gap-1.5">
                {renderElementIcon(currentHour.planet.element)}
                {currentHour.planet.element} ({currentHour.planet.temperamentFr})
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] font-bold text-zinc-200">
                🪙 Métal : {currentHour.planet.metalFr}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] font-bold text-zinc-200">
                🪵 Encens : {currentHour.planet.incenseFr}
              </span>
            </div>
          </div>

          {/* Right: Live Gauge & Countdown Timer */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-center text-center shrink-0 min-w-[240px]">
            <div className="relative flex items-center justify-center w-28 h-28 mb-3">
              {/* Circular SVG Gauge */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="url(#planetGradient)"
                  strokeWidth="8"
                  strokeDasharray={263.89}
                  strokeDashoffset={263.89 - (263.89 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-linear"
                />
                <defs>
                  <linearGradient id="planetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <Clock className="w-5 h-5 text-amber-400 mb-0.5" />
                <span className="text-xs font-mono font-bold text-zinc-300">
                  {Math.round(progressPercent)}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold">
                Temps Restant dans l'Heure
              </span>
              <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
                {remHours > 0 && `${remHours}h `}
                {String(remMinutes).padStart(2, '0')}m {String(remSecs).padStart(2, '0')}s
              </div>
              <div className="text-xs font-mono font-bold text-zinc-400">
                {currentHour.timeStartStr} ➔ {currentHour.timeEndStr}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar Bottom */}
        <div className="w-full h-2 bg-white/10 rounded-full mt-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Sā'ah al-Ijābah & Solar Times Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sā'ah al-Ijābah Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border-2 border-emerald-500/50 rounded-3xl p-5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Heure d'Exaucement (Sā'ah al-Ijābah)
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-[10px] font-black text-emerald-900 dark:text-emerald-100">
              Sunnah
            </span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 font-semibold leading-relaxed">
            {solarData.saahIjabahWindow.descriptionFr}
          </p>
          <div className="pt-1 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <span>
              Fenêtre : {solarData.saahIjabahWindow.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
              {solarData.saahIjabahWindow.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Solar Ephemeris Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border-2 border-amber-500/50 rounded-3xl p-5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              Éphémérides Solaires & Durées
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-[10px] font-black text-amber-900 dark:text-amber-100">
              GPS Exact
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-amber-950 dark:text-amber-100">
            <div>
              🌅 Lever : <strong className="font-mono">{solarData.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
            </div>
            <div>
              🌇 Coucher : <strong className="font-mono">{solarData.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
            </div>
            <div>
              ☀️ 1h Diurne = <strong className="font-mono">{Math.round(solarData.dayHourDurationMinutes)} min</strong>
            </div>
            <div>
              🌙 1h Nocturne = <strong className="font-mono">{Math.round(solarData.nightHourDurationMinutes)} min</strong>
            </div>
          </div>
          <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
            Régent du Jour : <strong>{solarData.dayRulerPlanet.nameFr} ({solarData.dayRulerPlanet.arabic})</strong>
          </p>
        </div>
      </div>

      {/* 24 Unequal Hours Timeline (Day / Night Selector) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Découpage des 24 Heures Inégales du Jour
          </h2>

          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'day'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> 12h Diurnes
            </button>
            <button
              onClick={() => setViewMode('night')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'night'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5" /> 12h Nocturnes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayedList.map((h, idx) => (
            <motion.div
              key={`${h.isDay ? 'day' : 'night'}-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => setSelectedDetailHour(h)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                h.isCurrent
                  ? 'ring-2 ring-amber-500 bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 shadow-md'
                  : 'bg-white dark:bg-zinc-900 hover:border-amber-300 dark:hover:border-zinc-700 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {h.isCurrent && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black">
                  <Zap className="w-3 h-3 fill-zinc-950" /> ACTUELLE
                </div>
              )}

              {h.isIjabahHour && !h.isCurrent && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                  <Sparkles className="w-3 h-3" /> IJĀBAH
                </div>
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                    h.isCurrent
                      ? 'bg-amber-500 text-zinc-950'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {h.hourIndex}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-zinc-900 dark:text-zinc-100">
                      {h.timeStartStr} - {h.timeEndStr}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                        h.planet.nature === 'Très Bénéfique'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : h.planet.nature === 'Bénéfique'
                          ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                          : h.planet.nature === 'Mixte'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {h.planet.nature}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-black text-sm ${h.planet.color}`}>{h.planet.nameFr}</span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">({h.planet.element})</span>
                    </div>
                    <span className="font-arabic font-bold text-base text-zinc-800 dark:text-zinc-200" dir="rtl">
                      {h.planet.arabic}
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    Ange : <strong className="text-zinc-700 dark:text-zinc-300">{h.planet.angelFr}</strong> • Wird :{' '}
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">{h.planet.wird.name}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
