import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  ArrowLeft,
  Moon,
  Sun,
  Sparkles,
  Compass,
  Bell,
  MapPin,
  Calendar,
  Shield,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2,
  Zap,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  generateAll24PlanetaryHours,
  calculateCurrentActiveLunarMansion,
  calculateAccurateSolarTimes,
  CityPreset,
  HOLY_AND_MAJOR_CITIES
} from '../../../utils/falakEngine';
import { FalakLiveClockTab } from '../../../components/falak/FalakLiveClockTab';
import { FalakManazilLiveTab } from '../../../components/falak/FalakManazilLiveTab';
import { FalakSmartTimingTab } from '../../../components/falak/FalakSmartTimingTab';
import { FalakParchmentModal } from '../../../components/falak/FalakParchmentModal';
import { AsrarHubWatermark } from '../../../components/AsrarHubWatermark';

export const PlanetaryHours: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'clock' | 'manazil' | 'smart_timing'>('clock');
  const [nowTime, setNowTime] = useState<Date>(new Date());
  const [selectedCity, setSelectedCity] = useState<CityPreset | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [showParchmentModal, setShowParchmentModal] = useState<boolean>(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Live real-time tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute effective coordinates (City, GPS, or default Makkah)
  const effectiveCoords = useMemo(() => {
    if (selectedCity) {
      return { lat: selectedCity.lat, lng: selectedCity.lng };
    }
    if (userCoords) {
      return userCoords;
    }
    // Default to Makkah Al-Mukarramah
    return { lat: 21.4225, lng: 39.8262 };
  }, [selectedCity, userCoords]);

  // Geolocation Handler
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setGeoStatus("La géolocalisation n'est pas prise en charge par ce navigateur.");
      return;
    }
    setIsLocating(true);
    setGeoStatus('Acquisition des coordonnées GPS en cours...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords({ lat, lng });
        setSelectedCity(null);
        setIsLocating(false);
        setGeoStatus(`GPS calibré avec succès (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`);
        setTimeout(() => setGeoStatus(''), 5000);
      },
      (err) => {
        setIsLocating(false);
        setGeoStatus(`Accès GPS refusé ou indisponible (${err.message}). Utilisation du repère par défaut.`);
        setTimeout(() => setGeoStatus(''), 5000);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // High precision planetary hours calculations
  const { allHours, dayHours, nightHours, currentHour, activeSolar } = useMemo(() => {
    return generateAll24PlanetaryHours(effectiveCoords.lat, effectiveCoords.lng, nowTime);
  }, [effectiveCoords, nowTime]);

  // Live Lunar Mansion calculations
  const activeMansion = useMemo(() => {
    return calculateCurrentActiveLunarMansion(nowTime);
  }, [nowTime]);

  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      setNotificationToast("Les notifications ne sont pas supportées par votre navigateur.");
      setTimeout(() => setNotificationToast(null), 4000);
      return;
    }

    let perm = Notification.permission;
    if (perm !== 'granted') {
      perm = await Notification.requestPermission();
    }

    if (perm === 'granted') {
      setNotificationToast("Alertes spirituelles activées avec succès !");
      setTimeout(() => setNotificationToast(null), 4000);
    } else {
      setNotificationToast("Permission de notification refusée.");
      setTimeout(() => setNotificationToast(null), 4000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-28 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/tools"
            className="p-2.5 -ml-2 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
                Falak & Manāzil al-Qamar
              </span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">
              Heures Planétaires & Demeures Lunaires en Temps Réel
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
              Horlogerie spirituelle dynamique basée sur des calculs astronomiques GPS ultra-précis, suivi des 28
              Demeures de la Lune (Manazil) et Planificateur d'Invocations (Smart Spiritual Timing).
            </p>
          </div>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setShowParchmentModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-zinc-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Générer la Carte Céleste en Parchemin"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Parchemin Astral</span>
          </button>

          <button
            onClick={handleEnableNotifications}
            className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-100 text-zinc-700 dark:text-zinc-300 dark:hover:text-amber-300 transition-colors cursor-pointer"
            title="Activer les Alertes Spirituelles"
          >
            <Bell className="w-5 h-5 text-amber-500" />
          </button>
        </div>
      </div>

      {notificationToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-400 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{notificationToast}</span>
        </motion.div>
      )}

      {/* Main Mode Navigation Tabs */}
      <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab('clock')}
          className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'clock'
              ? 'bg-amber-500 text-zinc-950 shadow-md scale-101'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="hidden sm:inline">1. Horloge Céleste & GPS</span>
          <span className="sm:hidden">1. Heures</span>
        </button>

        <button
          onClick={() => setActiveTab('manazil')}
          className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'manazil'
              ? 'bg-indigo-600 text-white shadow-md scale-101'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span className="hidden sm:inline">2. Les 28 Demeures (Manazil)</span>
          <span className="sm:hidden">2. Demeures</span>
        </button>

        <button
          onClick={() => setActiveTab('smart_timing')}
          className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'smart_timing'
              ? 'bg-emerald-600 text-white shadow-md scale-101'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">3. Smart Spiritual Timing</span>
          <span className="sm:hidden">3. Timing</span>
        </button>
      </div>

      {/* Tab Content Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'clock' && (
          <motion.div
            key="clock-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <FalakLiveClockTab
              currentHour={currentHour}
              allHours={allHours}
              dayHours={dayHours}
              nightHours={nightHours}
              solarData={activeSolar}
              nowTime={nowTime}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              onGeolocate={handleGeolocate}
              geoStatus={geoStatus}
              isLocating={isLocating}
              userCoords={userCoords}
            />
          </motion.div>
        )}

        {activeTab === 'manazil' && (
          <motion.div
            key="manazil-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <FalakManazilLiveTab activeMansion={activeMansion} nowTime={nowTime} />
          </motion.div>
        )}

        {activeTab === 'smart_timing' && (
          <motion.div
            key="timing-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <FalakSmartTimingTab
              userCoords={effectiveCoords}
              nowTime={nowTime}
              onEnableNotification={handleEnableNotifications}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sacred Parchment Modal */}
      {showParchmentModal && (
        <FalakParchmentModal
          currentHour={currentHour}
          activeMansion={activeMansion}
          solarData={activeSolar}
          nowTime={nowTime}
          selectedCity={selectedCity}
          onClose={() => setShowParchmentModal(false)}
        />
      )}

      {/* Watermark */}
      <div className="relative pt-8 pb-4">
        <div className="text-center text-xs font-semibold text-zinc-400 dark:text-zinc-500">
          Falak & Manāzil al-Qamar Master Suite • Calculs astronomiques GPS • Synchronisation Sā'āt Zamaniyyah • AsrarHub
        </div>
      </div>
    </div>
  );
};
