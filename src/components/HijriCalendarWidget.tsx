import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Moon, MapPin, RefreshCw, ChevronRight, Sparkles, Compass, Plus, Minus, CheckCircle2, ShieldCheck, ChevronDown, ChevronUp, Sliders, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFeatures } from '../contexts/FeatureContext';
import { useAuth } from '../contexts/AuthContext';
import { calculateHijriDate } from '../utils/hijriDate';
import { Link } from 'react-router-dom';

interface LocationInfo {
  city: string;
  country: string;
  lat?: number;
  lng?: number;
  status: 'idle' | 'loading' | 'success' | 'error';
}

const toArabicDigits = (val: number | string): string => {
  const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(val).replace(/\d/g, (d) => digits[parseInt(d, 10)]);
};

const getLocalizedGregorianDate = (date: Date, lang: string): string => {
  if (lang === 'fr') {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  if (lang === 'ha') {
    const daysHa = ['Lahadi', 'Litinin', 'Talata', 'Laraba', 'Alhamis', 'Jumma\'a', 'Asabar'];
    const monthsHa = ['Janairu', 'Febrairu', 'Maris', 'Apirilu', 'Mayu', 'Yuni', 'Yuli', 'Augusta', 'Satumba', 'Oktoba', 'Nuwamba', 'Disamba'];
    const dayName = daysHa[date.getDay()];
    const dayNum = date.getDate();
    const monthName = monthsHa[date.getMonth()];
    const yearNum = date.getFullYear();
    return `${dayName}, ${dayNum} ${monthName} ${yearNum}`;
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

export const HijriCalendarWidget: React.FC = () => {
  const { language } = useLanguage();
  const { featureToggles } = useFeatures();
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin' || 
                  user?.role === 'master' || 
                  user?.role === 'super_admin' || 
                  (user?.email && ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'].includes(user.email.toLowerCase()));

  const [globalCardScale, setGlobalCardScale] = useState<number>(() => {
    const saved = localStorage.getItem('asrarhub_admin_calendar_global_scale');
    return saved ? parseFloat(saved) : 1.0;
  });

  const [subCardScale, setSubCardScale] = useState<number>(() => {
    const saved = localStorage.getItem('asrarhub_admin_calendar_subcards_scale');
    return saved ? parseFloat(saved) : 1.0;
  });

  const [showAdminControls, setShowAdminControls] = useState<boolean>(false);

  const changeGlobalScale = (delta: number) => {
    const next = Math.min(1.8, Math.max(0.6, Math.round((globalCardScale + delta) * 100) / 100));
    setGlobalCardScale(next);
    localStorage.setItem('asrarhub_admin_calendar_global_scale', next.toString());
  };

  const changeSubCardScale = (delta: number) => {
    const next = Math.min(1.8, Math.max(0.6, Math.round((subCardScale + delta) * 100) / 100));
    setSubCardScale(next);
    localStorage.setItem('asrarhub_admin_calendar_subcards_scale', next.toString());
  };

  const resetScales = () => {
    setGlobalCardScale(1.0);
    setSubCardScale(1.0);
    localStorage.setItem('asrarhub_admin_calendar_global_scale', '1.0');
    localStorage.setItem('asrarhub_admin_calendar_subcards_scale', '1.0');
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const [hijriOffset, setHijriOffset] = useState<number>(() => {
    const saved = localStorage.getItem('asrarhub_hijri_user_offset');
    return saved !== null ? parseInt(saved, 10) : (featureToggles?.hijriOffset || 0);
  });

  const [locationInfo, setLocationInfo] = useState<LocationInfo>(() => {
    const cached = localStorage.getItem('asrarhub_user_location');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return { ...parsed, status: 'success' };
      } catch (e) {
        console.warn('Location cache parse error:', e);
      }
    }
    return {
      city: language === 'fr' ? 'Recherche GPS...' : language === 'ha' ? 'Neman GPS...' : 'Searching GPS...',
      country: '',
      status: 'idle'
    };
  });

  const [isRefreshingGps, setIsRefreshingGps] = useState(false);

  // Reverse geocoding helper
  const fetchReverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=${language}`);
      if (res.ok) {
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision || data.localityInfo?.administrative?.[2]?.name || 'Localité';
        const country = data.countryName || 'GPS';
        return { city, country };
      }
    } catch (e) {
      console.warn('Reverse geocode fallback:', e);
    }

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const city = addr.city || addr.town || addr.village || addr.suburb || addr.state || 'Localité';
        const country = addr.country || 'GPS';
        return { city, country };
      }
    } catch (e) {
      console.warn('Nominatim geocode error:', e);
    }

    return { city: `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`, country: 'GPS' };
  }, [language]);

  // Request GPS
  const detectLocation = useCallback(() => {
    if (typeof window === 'undefined' || !('navigator' in window) || !navigator.geolocation) {
      setLocationInfo(prev => ({
        ...prev,
        city: language === 'fr' ? 'GPS indisponible' : language === 'ha' ? 'Babu GPS' : 'GPS unavailable',
        status: 'error'
      }));
      return;
    }

    setIsRefreshingGps(true);
    setLocationInfo(prev => ({ ...prev, status: 'loading' }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const { city, country } = await fetchReverseGeocode(latitude, longitude);
        
        const newLoc: LocationInfo = {
          city,
          country,
          lat: latitude,
          lng: longitude,
          status: 'success'
        };

        setLocationInfo(newLoc);
        setIsRefreshingGps(false);
        try {
          localStorage.setItem('asrarhub_user_location', JSON.stringify(newLoc));
        } catch (e) {
          console.warn('Failed to cache location:', e);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setIsRefreshingGps(false);
        setLocationInfo(prev => ({
          ...prev,
          city: prev.city.includes('GPS') || prev.city.includes('Neman') || prev.city.includes('Recherche')
            ? (language === 'fr' ? 'Position GPS' : language === 'ha' ? 'Wurin GPS' : 'GPS Position')
            : prev.city,
          status: 'error'
        }));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [fetchReverseGeocode, language]);

  useEffect(() => {
    const cached = localStorage.getItem('asrarhub_user_location');
    if (!cached) {
      detectLocation();
    }
  }, [detectLocation]);

  const changeOffset = (delta: number) => {
    const newOffset = hijriOffset + delta;
    setHijriOffset(newOffset);
    localStorage.setItem('asrarhub_hijri_user_offset', newOffset.toString());
  };

  const now = new Date();
  const hijri = calculateHijriDate(now, hijriOffset);

  const monthName = language === 'en' 
    ? hijri.monthNameEn 
    : (language === 'ha' ? hijri.monthNameHa : hijri.monthNameFr);

  const gregorianStr = getLocalizedGregorianDate(now, language);

  const isWhiteDays = hijri.day >= 13 && hijri.day <= 15;

  const arabicDateStr = `${toArabicDigits(hijri.day)} ${hijri.monthNameAr} ${toArabicDigits(hijri.year)} هـ`;

  const i18n = {
    fr: {
      statusGps: 'GPS Synchronisé',
      searchPlaceholder: 'Rechercher dans le calendrier, versets, wirds...',
      hijriLabel: 'Mois Hijri',
      gpsLabel: 'Localité GPS',
      adjustOffset: 'Ajuster Lune',
      gregorianLabel: 'Date Grégorienne',
      monthNumber: `Mois Islamique n°${hijri.monthIndex + 1}`,
      whiteDays: '🌕 Jours Blancs (Ayyām al-Bīḍ)',
      refreshGps: 'Actualiser',
      openCalendar: 'Ouvrir le Calendrier Mystique',
      syncedText: "Observatoire & GPS actifs",
      expandWidget: 'Dérouler',
      collapseWidget: 'Réduire'
    },
    ha: {
      statusGps: 'GPS An Daidaita',
      searchPlaceholder: 'Nemi a cikin kalandar ruhi, wirdi, ayoyi...',
      hijriLabel: 'Watan Hijiriyya',
      gpsLabel: 'Wurin GPS',
      adjustOffset: 'Daidaita Wata',
      gregorianLabel: 'Kwanan Miladiyya',
      monthNumber: `Watan Musulunci na ${hijri.monthIndex + 1}`,
      whiteDays: '🌕 Kwanakin Farra (Ayyām al-Bīḍ)',
      refreshGps: 'Sabunta',
      openCalendar: 'Bude Kalandar Ruhi',
      syncedText: "An haɗa da duban wata da GPS",
      expandWidget: 'Fada',
      collapseWidget: 'Rage'
    },
    en: {
      statusGps: 'GPS Synchronized',
      searchPlaceholder: 'Search calendar, verses, wirds...',
      hijriLabel: 'Hijri Month',
      gpsLabel: 'GPS Location',
      adjustOffset: 'Adjust Moon',
      gregorianLabel: 'Gregorian Date',
      monthNumber: `Islamic Month #${hijri.monthIndex + 1}`,
      whiteDays: '🌕 White Days (Ayyām al-Bīḍ)',
      refreshGps: 'Refresh',
      openCalendar: 'Open Mystic Calendar',
      syncedText: "Observatory & GPS active",
      expandWidget: 'Expand',
      collapseWidget: 'Collapse'
    }
  };

  const txt = i18n[language as keyof typeof i18n] || i18n.fr;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: `${Math.round(20 * globalCardScale)}px`,
        borderRadius: `${Math.round(28 * globalCardScale)}px`,
        fontSize: `${Math.round(100 * globalCardScale)}%`
      }}
      className="relative w-full bg-white dark:bg-slate-900 shadow-xl border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 overflow-hidden transition-all duration-200"
    >
      {/* 1. TOP HEADER BAR */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between cursor-pointer select-none transition-all ${isExpanded ? 'pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800' : ''}`}
      >
        {/* App Branding & Quick Date Preview */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/20 shrink-0">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                Asrar<span className="text-emerald-600 dark:text-emerald-400">Hub</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {hijri.day} {monthName} {hijri.year} AH
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge & Toggle Expand/Collapse */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAdminControls(!showAdminControls);
                if (!isExpanded) setIsExpanded(true);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer border ${
                showAdminControls
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              }`}
              title="Ajuster les tailles du calendrier (Admin)"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Tailles</span>
            </button>
          )}

          <Link 
            to="/explore/calendar" 
            onClick={(e) => e.stopPropagation()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
            <span>{txt.statusGps}</span>
          </Link>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700"
          >
            <span>{isExpanded ? txt.collapseWidget : txt.expandWidget}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. EXPANDABLE CONTENT */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* ADMIN SIZE ADJUSTMENT PANEL */}
            <AnimatePresence>
              {showAdminControls && isAdmin && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-4 p-4 rounded-2xl bg-amber-50/95 dark:bg-amber-950/60 border-2 border-amber-500/40 text-xs shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                    <span className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Sliders className="w-4 h-4 text-amber-500" />
                      Ajustement des Tailles du Calendrier (Contrôle Admin)
                    </span>
                    <button
                      type="button"
                      onClick={resetScales}
                      className="px-2.5 py-1 rounded-lg bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-100 font-extrabold hover:bg-amber-300 transition-colors text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Réinitialiser (100%)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Control 1: Global Card Scale */}
                    <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-amber-500/30 flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                          Carte Globale du Calendrier
                        </span>
                        <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {Math.round(globalCardScale * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => changeGlobalScale(-0.05)}
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-amber-500 hover:text-white transition-colors cursor-pointer"
                          title="Réduire la carte globale"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="range"
                          min="0.6"
                          max="1.6"
                          step="0.05"
                          value={globalCardScale}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setGlobalCardScale(val);
                            localStorage.setItem('asrarhub_admin_calendar_global_scale', val.toString());
                          }}
                          className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => changeGlobalScale(0.05)}
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-amber-500 hover:text-white transition-colors cursor-pointer"
                          title="Augmenter la carte globale"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Control 2: Sub-Cards Scale */}
                    <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-amber-500/30 flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                          <Minimize2 className="w-3.5 h-3.5 text-emerald-600" />
                          Cartes Intérieures (Sous-Cartes)
                        </span>
                        <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {Math.round(subCardScale * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => changeSubCardScale(-0.05)}
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-amber-500 hover:text-white transition-colors cursor-pointer"
                          title="Réduire les sous-cartes"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="range"
                          min="0.6"
                          max="1.6"
                          step="0.05"
                          value={subCardScale}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setSubCardScale(val);
                            localStorage.setItem('asrarhub_admin_calendar_subcards_scale', val.toString());
                          }}
                          className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => changeSubCardScale(0.05)}
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-amber-500 hover:text-white transition-colors cursor-pointer"
                          title="Augmenter les sous-cartes"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MAIN CALENDAR DISPLAY CARD */}
            <div 
              style={{
                padding: `${Math.round(20 * subCardScale)}px`,
                borderRadius: `${Math.round(16 * subCardScale)}px`,
                marginBottom: `${Math.round(16 * subCardScale)}px`
              }}
              className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white border border-emerald-500/30 shadow-lg relative overflow-hidden transition-all duration-200"
            >
              <Moon className="absolute -bottom-8 -right-8 text-emerald-500/10 pointer-events-none stroke-[1]" size={Math.round(150 * subCardScale)} />

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-2">
                <span 
                  style={{ fontSize: `${Math.round(11 * subCardScale)}px` }}
                  className="font-bold uppercase tracking-wider text-emerald-400 bg-emerald-900/50 px-2.5 py-0.5 rounded-full border border-emerald-500/30"
                >
                  {txt.monthNumber}
                </span>

                <span 
                  style={{ fontSize: `${Math.round(12 * subCardScale)}px` }}
                  className="text-slate-300 font-medium capitalize flex items-center gap-1.5"
                >
                  <Calendar style={{ width: `${Math.round(14 * subCardScale)}px`, height: `${Math.round(14 * subCardScale)}px` }} className="text-emerald-400" />
                  {gregorianStr}
                </span>
              </div>

              {/* Arabic Calligraphy Big Title */}
              <div 
                dir="rtl" 
                style={{ fontSize: `${Math.round(28 * subCardScale)}px` }}
                className="font-black text-amber-300 font-serif tracking-wide leading-tight my-1 drop-shadow"
              >
                {arabicDateStr}
              </div>

              {/* Localized Date & White Days */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-emerald-800/50">
                <div 
                  style={{ fontSize: `${Math.round(14 * subCardScale)}px` }}
                  className="flex items-center gap-1.5 font-bold text-white"
                >
                  <Moon style={{ width: `${Math.round(16 * subCardScale)}px`, height: `${Math.round(16 * subCardScale)}px` }} className="text-emerald-400" />
                  <span>{hijri.day} {monthName} {hijri.year} AH</span>
                </div>

                {isWhiteDays && (
                  <span 
                    style={{ fontSize: `${Math.round(12 * subCardScale)}px` }}
                    className="px-2.5 py-0.5 rounded-full font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30"
                  >
                    {txt.whiteDays}
                  </span>
                )}
              </div>
            </div>

            {/* THREE CIRCULAR DETAIL BUTTONS (SUB-CARDS) */}
            <div 
              style={{
                gap: `${Math.round(12 * subCardScale)}px`,
                marginBottom: `${Math.round(12 * subCardScale)}px`
              }}
              className="grid grid-cols-3"
            >
              {/* Detail 1: Hijri Month Info */}
              <Link 
                to="/explore/calendar"
                style={{
                  padding: `${Math.round(12 * subCardScale)}px`,
                  borderRadius: `${Math.round(16 * subCardScale)}px`
                }}
                className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all text-center group cursor-pointer"
              >
                <div 
                  style={{
                    width: `${Math.round(48 * subCardScale)}px`,
                    height: `${Math.round(48 * subCardScale)}px`
                  }}
                  className="rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-sm shrink-0"
                >
                  <Moon style={{ width: `${Math.round(20 * subCardScale)}px`, height: `${Math.round(20 * subCardScale)}px` }} />
                </div>
                <span 
                  style={{ fontSize: `${Math.round(12 * subCardScale)}px` }}
                  className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-full"
                >
                  {monthName}
                </span>
                <span 
                  style={{ fontSize: `${Math.round(10 * subCardScale)}px` }}
                  className="text-slate-400 font-medium block truncate max-w-full"
                >
                  {txt.hijriLabel}
                </span>
              </Link>

              {/* Detail 2: GPS Location */}
              <div 
                onClick={detectLocation}
                style={{
                  padding: `${Math.round(12 * subCardScale)}px`,
                  borderRadius: `${Math.round(16 * subCardScale)}px`
                }}
                className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all text-center group cursor-pointer"
              >
                <div 
                  style={{
                    width: `${Math.round(48 * subCardScale)}px`,
                    height: `${Math.round(48 * subCardScale)}px`
                  }}
                  className="rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-sm relative shrink-0"
                >
                  <MapPin style={{ width: `${Math.round(20 * subCardScale)}px`, height: `${Math.round(20 * subCardScale)}px` }} />
                  {isRefreshingGps && (
                    <RefreshCw className="w-3 h-3 text-emerald-500 animate-spin absolute top-1 right-1" />
                  )}
                </div>
                <span 
                  style={{ fontSize: `${Math.round(12 * subCardScale)}px` }}
                  className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-full"
                >
                  {locationInfo.city}
                </span>
                <span 
                  style={{ fontSize: `${Math.round(10 * subCardScale)}px` }}
                  className="text-slate-400 font-medium block truncate max-w-full"
                >
                  {txt.gpsLabel}
                </span>
              </div>

              {/* Detail 3: Moon Offset Control */}
              <div 
                style={{
                  padding: `${Math.round(12 * subCardScale)}px`,
                  borderRadius: `${Math.round(16 * subCardScale)}px`
                }}
                className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all text-center group"
              >
                <div 
                  style={{
                    width: `${Math.round(48 * subCardScale)}px`,
                    height: `${Math.round(48 * subCardScale)}px`
                  }}
                  className="rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 shadow-sm shrink-0"
                >
                  <Compass style={{ width: `${Math.round(20 * subCardScale)}px`, height: `${Math.round(20 * subCardScale)}px` }} />
                </div>
                
                <div className="flex items-center gap-1.5 my-0.5">
                  <button
                    type="button"
                    onClick={() => changeOffset(-1)}
                    style={{
                      width: `${Math.round(20 * subCardScale)}px`,
                      height: `${Math.round(20 * subCardScale)}px`,
                      fontSize: `${Math.round(12 * subCardScale)}px`
                    }}
                    className="rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white flex items-center justify-center font-bold transition-colors cursor-pointer shrink-0"
                    title="-1 day"
                  >
                    -
                  </button>
                  <span 
                    style={{ fontSize: `${Math.round(12 * subCardScale)}px` }}
                    className="font-black text-emerald-600 dark:text-emerald-400 font-mono"
                  >
                    {hijriOffset > 0 ? `+${hijriOffset}` : hijriOffset}d
                  </span>
                  <button
                    type="button"
                    onClick={() => changeOffset(1)}
                    style={{
                      width: `${Math.round(20 * subCardScale)}px`,
                      height: `${Math.round(20 * subCardScale)}px`,
                      fontSize: `${Math.round(12 * subCardScale)}px`
                    }}
                    className="rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white flex items-center justify-center font-bold transition-colors cursor-pointer shrink-0"
                    title="+1 day"
                  >
                    +
                  </button>
                </div>

                <span 
                  style={{ fontSize: `${Math.round(10 * subCardScale)}px` }}
                  className="text-slate-400 font-medium block truncate max-w-full"
                >
                  {txt.adjustOffset}
                </span>
              </div>
            </div>

            {/* FOOTER LINK TO FULL MYSTIC CALENDAR */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{txt.syncedText}</span>
              </div>

              <Link
                to="/explore/calendar"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline group cursor-pointer"
              >
                <span>{txt.openCalendar}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

