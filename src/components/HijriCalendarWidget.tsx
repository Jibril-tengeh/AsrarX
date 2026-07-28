import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Moon, MapPin, RefreshCw, ChevronRight, Sparkles, Compass, Plus, Minus, CheckCircle2, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFeatures } from '../contexts/FeatureContext';
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
      className="relative w-full rounded-[28px] bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xl border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 overflow-hidden"
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
            {/* MAIN CALENDAR DISPLAY CARD */}
            <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 rounded-2xl p-4 sm:p-5 text-white mb-4 border border-emerald-500/30 shadow-lg relative overflow-hidden">
              <Moon className="absolute -bottom-8 -right-8 text-emerald-500/10 pointer-events-none stroke-[1]" size={150} />

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-900/50 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {txt.monthNumber}
                </span>

                <span className="text-xs text-slate-300 font-medium capitalize flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {gregorianStr}
                </span>
              </div>

              {/* Arabic Calligraphy Big Title */}
              <div dir="rtl" className="text-2xl sm:text-3xl font-black text-amber-300 font-serif tracking-wide leading-tight my-1 drop-shadow">
                {arabicDateStr}
              </div>

              {/* Localized Date & White Days */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-emerald-800/50">
                <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                  <Moon className="w-4 h-4 text-emerald-400" />
                  <span>{hijri.day} {monthName} {hijri.year} AH</span>
                </div>

                {isWhiteDays && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {txt.whiteDays}
                  </span>
                )}
              </div>
            </div>

            {/* THREE CIRCULAR DETAIL BUTTONS */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {/* Detail 1: Hijri Month Info */}
              <Link 
                to="/explore/calendar"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all text-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-sm">
                  <Moon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate max-w-full">
                  {monthName}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block truncate max-w-full">
                  {txt.hijriLabel}
                </span>
              </Link>

              {/* Detail 2: GPS Location */}
              <div 
                onClick={detectLocation}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all text-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-sm relative">
                  <MapPin className="w-5 h-5" />
                  {isRefreshingGps && (
                    <RefreshCw className="w-3 h-3 text-emerald-500 animate-spin absolute top-1 right-1" />
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate max-w-full">
                  {locationInfo.city}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block truncate max-w-full">
                  {txt.gpsLabel}
                </span>
              </div>

              {/* Detail 3: Moon Offset Control */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all text-center group">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 shadow-sm">
                  <Compass className="w-5 h-5" />
                </div>
                
                <div className="flex items-center gap-1.5 my-0.5">
                  <button
                    type="button"
                    onClick={() => changeOffset(-1)}
                    className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                    title="-1 day"
                  >
                    -
                  </button>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {hijriOffset > 0 ? `+${hijriOffset}` : hijriOffset}d
                  </span>
                  <button
                    type="button"
                    onClick={() => changeOffset(1)}
                    className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                    title="+1 day"
                  >
                    +
                  </button>
                </div>

                <span className="text-[10px] text-slate-400 font-medium block truncate max-w-full">
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

