import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Mic, 
  MapPin, 
  Bell, 
  HardDrive, 
  Check, 
  RefreshCw, 
  X, 
  Smartphone, 
  Laptop, 
  HelpCircle, 
  ExternalLink, 
  Compass, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  Volume2
} from 'lucide-react';
import { 
  requestMicrophonePermissionDetailed, 
  requestGeolocationPermissionDetailed,
  checkPermissionQuery,
  requestNotificationPermission,
  requestStoragePermission
} from '../utils/planetaryNotifications';
import { useLanguage } from '../contexts/LanguageContext';

export interface PermissionTroubleshooterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'microphone' | 'geolocation' | 'notifications' | 'storage' | 'manual_city';
}

const PRESET_CITIES = [
  { name: 'Dakar', country: 'Sénégal', lat: 14.7167, lng: -17.4677 },
  { name: 'Bamako', country: 'Mali', lat: 12.6392, lng: -8.0029 },
  { name: 'Niamey', country: 'Niger', lat: 13.5116, lng: 2.1254 },
  { name: 'Nouakchott', country: 'Mauritanie', lat: 18.0735, lng: -15.9582 },
  { name: 'Ouagadougou', country: 'Burkina Faso', lat: 12.3714, lng: -1.5197 },
  { name: 'Abidjan', country: "Côte d'Ivoire", lat: 5.3600, lng: -4.0083 },
  { name: 'Conakry', country: 'Guinée', lat: 9.6412, lng: -13.5784 },
  { name: 'Cotonou', country: 'Bénin', lat: 6.3703, lng: 2.3912 },
  { name: 'Lomé', country: 'Togo', lat: 6.1375, lng: 1.2123 },
  { name: 'Casablanca', country: 'Maroc', lat: 33.5731, lng: -7.5898 },
  { name: 'Alger', country: 'Algérie', lat: 36.7538, lng: 3.0588 },
  { name: 'Tunis', country: 'Tunisie', lat: 36.8065, lng: 10.1815 },
  { name: 'Le Caire', country: 'Égypte', lat: 30.0444, lng: 31.2357 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'Bruxelles', country: 'Belgique', lat: 50.8503, lng: 4.3517 },
  { name: 'Montréal', country: 'Canada', lat: 45.5017, lng: -73.5673 },
  { name: 'La Mecque (Makkah)', country: 'Arabie Saoudite', lat: 21.4225, lng: 39.8262 },
  { name: 'Médine (Madinah)', country: 'Arabie Saoudite', lat: 24.5247, lng: 39.5692 },
  { name: 'Dubaï', country: 'Émirats Arabes Unis', lat: 25.2048, lng: 55.2708 },
  { name: 'Kano', country: 'Nigéria', lat: 12.0022, lng: 8.5920 },
  { name: 'Lagos', country: 'Nigéria', lat: 6.5244, lng: 3.3792 },
  { name: 'Yaoundé', country: 'Cameroun', lat: 3.8480, lng: 11.5021 },
  { name: 'N\'Djaména', country: 'Tchad', lat: 12.1348, lng: 15.0557 },
];

export const PermissionTroubleshooterModal: React.FC<PermissionTroubleshooterModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'microphone'
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'microphone' | 'geolocation' | 'notifications' | 'storage' | 'manual_city'>(initialTab);
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'desktop'>('android');
  
  // Real-time permission states
  const [micStatus, setMicStatus] = useState<'prompt' | 'granted' | 'denied' | 'checking'>('checking');
  const [geoStatus, setGeoStatus] = useState<'prompt' | 'granted' | 'denied' | 'checking'>('checking');
  const [lastErrorMsg, setLastErrorMsg] = useState<string | null>(null);
  
  // Testing feedback states
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [isTestingGeo, setIsTestingGeo] = useState(false);
  const [testResult, setTestResult] = useState<{ type: 'mic' | 'geo'; success: boolean; message: string } | null>(null);
  
  // Manual City Search State
  const [citySearch, setCitySearch] = useState('');
  const [savedCity, setSavedCity] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Detect platform automatically
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator) {
      const ua = navigator.userAgent.toLowerCase();
      if (/android/i.test(ua)) {
        setDeviceType('android');
      } else if (/iphone|ipad|ipod/i.test(ua)) {
        setDeviceType('ios');
      } else {
        setDeviceType('desktop');
      }
    }
  }, []);

  // Load cached city if any
  useEffect(() => {
    try {
      const cached = localStorage.getItem('asrarhub_user_location');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.city) {
          setSavedCity(`${parsed.city}${parsed.country ? ` (${parsed.country})` : ''}`);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Initial Permission Status Query
  const refreshStatuses = async () => {
    setMicStatus('checking');
    setGeoStatus('checking');
    
    const m = await checkPermissionQuery('microphone');
    const g = await checkPermissionQuery('geolocation');
    
    setMicStatus(m);
    setGeoStatus(g);
  };

  useEffect(() => {
    if (isOpen) {
      refreshStatuses();
      setTestResult(null);
      setLastErrorMsg(null);
    }
  }, [isOpen]);

  const handleTestMicrophone = async () => {
    setIsTestingMic(true);
    setTestResult(null);
    setLastErrorMsg(null);
    try {
      const res = await requestMicrophonePermissionDetailed();
      if (res.granted) {
        setMicStatus('granted');
        setTestResult({
          type: 'mic',
          success: true,
          message: 'Microphone connecté et opérationnel ! Le réciteur et le Zikr vocal peuvent maintenant fonctionner.'
        });
      } else {
        setMicStatus('denied');
        setLastErrorMsg(res.errorMessage || 'Accès refusé par le navigateur ou Android.');
        setTestResult({
          type: 'mic',
          success: false,
          message: res.errorMessage || "L'accès au microphone est actuellement bloqué."
        });
      }
    } catch (err: any) {
      setMicStatus('denied');
      setTestResult({
        type: 'mic',
        success: false,
        message: err.message || "Erreur d'accès au microphone."
      });
    } finally {
      setIsTestingMic(false);
    }
  };

  const handleTestGeolocation = async () => {
    setIsTestingGeo(true);
    setTestResult(null);
    setLastErrorMsg(null);
    try {
      const res = await requestGeolocationPermissionDetailed();
      if (res.granted) {
        setGeoStatus('granted');
        const coordsStr = res.coords ? ` (${res.coords.lat.toFixed(2)}°, ${res.coords.lng.toFixed(2)}°)` : '';
        setTestResult({
          type: 'geo',
          success: true,
          message: `Position GPS détectée avec succès${coordsStr} ! Qibla et heures de prières calculées.`
        });
      } else {
        setGeoStatus('denied');
        setLastErrorMsg(res.errorMessage || 'Position non disponible ou bloquée.');
        setTestResult({
          type: 'geo',
          success: false,
          message: res.errorMessage || "L'accès GPS est bloqué ou désactivé sur votre téléphone."
        });
      }
    } catch (err: any) {
      setGeoStatus('denied');
      setTestResult({
        type: 'geo',
        success: false,
        message: err.message || "Erreur de géolocalisation."
      });
    } finally {
      setIsTestingGeo(false);
    }
  };

  const handleSelectCity = (c: typeof PRESET_CITIES[0]) => {
    const locData = {
      latitude: c.lat,
      longitude: c.lng,
      city: c.name,
      country: c.country,
      isManual: true,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('asrarhub_user_location', JSON.stringify(locData));
    setSavedCity(`${c.name} (${c.country})`);
    setTestResult({
      type: 'geo',
      success: true,
      message: `Position enregistrée avec succès : ${c.name}, ${c.country}. Vos heures de prière, Qibla et calculs planétaires sont désormais exacts !`
    });
  };

  const filteredCities = PRESET_CITIES.filter(c => 
    c.name.toLowerCase().includes(citySearch.toLowerCase()) || 
    c.country.toLowerCase().includes(citySearch.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl overflow-hidden relative my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                  Résolution des Autorisations
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pourquoi l'accès est refusé et comment le débloquer en 2 clics
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Top Quick Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-4 shrink-0 overflow-x-auto text-xs font-bold scrollbar-none">
            <button
              onClick={() => { setActiveTab('microphone'); setTestResult(null); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'microphone'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Mic size={14} />
              <span>Microphone</span>
              {micStatus === 'granted' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
              {micStatus === 'denied' && <span className="w-2 h-2 rounded-full bg-rose-500" />}
            </button>

            <button
              onClick={() => { setActiveTab('geolocation'); setTestResult(null); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'geolocation'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <MapPin size={14} />
              <span>Position GPS</span>
              {geoStatus === 'granted' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
              {geoStatus === 'denied' && <span className="w-2 h-2 rounded-full bg-rose-500" />}
            </button>

            <button
              onClick={() => { setActiveTab('manual_city'); setTestResult(null); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'manual_city'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Compass size={14} />
              <span>Choisir ma ville</span>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs sm:text-sm">
            
            {/* Live Feedback Toast if tested */}
            {testResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
                  testResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-bold">{testResult.success ? 'Succès !' : 'Attention'}</p>
                  <p className="text-xs mt-0.5 opacity-90">{testResult.message}</p>
                </div>
              </motion.div>
            )}

            {/* TAB: MICROPHONE */}
            {activeTab === 'microphone' && (
              <div className="space-y-4">
                {/* Status Card */}
                <div className="bg-rose-500/10 dark:bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-500 text-white shrink-0">
                      <Mic size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        État du Microphone : {micStatus === 'granted' ? '✅ Autorisé' : micStatus === 'denied' ? '🚫 Bloqué / Refusé' : '⏳ En attente'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Utilisé pour le compteur vocal de Zikr et la récitation audio.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleTestMicrophone}
                    disabled={isTestingMic}
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {isTestingMic ? <RefreshCw className="animate-spin" size={14} /> : <Mic size={14} />}
                    <span>Tester</span>
                  </button>
                </div>

                {/* Root Cause Explanation */}
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-750 rounded-2xl p-4 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs sm:text-sm">
                    <HelpCircle size={16} className="text-amber-500" />
                    Pourquoi le navigateur refuse-t-il l'accès ?
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Lorsque vous ouvrez le site pour la première fois, si vous avez cliqué sur <strong>"Bloquer"</strong> ou fermé la fenêtre contextuelle, Android et Chrome se souviennent de ce choix et <strong>bloquent automatiquement toute nouvelle tentative</strong> sans afficher à nouveau la boîte de dialogue.
                  </p>
                </div>

                {/* Device Selector for Instructions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Procédure de déblocage pour votre appareil :
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setDeviceType('android')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          deviceType === 'android' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Android
                      </button>
                      <button
                        onClick={() => setDeviceType('ios')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          deviceType === 'ios' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        iPhone
                      </button>
                      <button
                        onClick={() => setDeviceType('desktop')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          deviceType === 'desktop' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        PC / Mac
                      </button>
                    </div>
                  </div>

                  {/* Android Step-by-Step */}
                  {deviceType === 'android' && (
                    <div className="space-y-2 text-xs bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-3.5">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>Sur Chrome :</strong> Appuyez sur l'icône de <strong>cadenas 🔒</strong> ou de <strong>réglages de site</strong> tout en haut à gauche de la barre d'adresse (URL).
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                        <p className="text-slate-700 dark:text-slate-300">
                          Appuyez sur <strong>« Autorisations »</strong> (ou « Paramètres du site »).
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                        <p className="text-slate-700 dark:text-slate-300">
                          Trouvez <strong>Microphone</strong> et cochez <strong>« Autoriser »</strong>.
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">4</span>
                        <p className="text-slate-700 dark:text-slate-300">
                          Revenez ici et cliquez sur le bouton <strong>« Tester le microphone »</strong> ci-dessus !
                        </p>
                      </div>
                    </div>
                  )}

                  {/* iOS Step-by-Step */}
                  {deviceType === 'ios' && (
                    <div className="space-y-2 text-xs bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-3.5">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                        <p className="text-slate-700 dark:text-slate-300">
                          Appuyez sur le bouton <strong>« aA »</strong> ou l'icône de réglages dans la barre d'adresse Safari en bas.
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                        <p className="text-slate-700 dark:text-slate-300">
                          Choisissez <strong>« Réglages du site web »</strong>.
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                        <p className="text-slate-700 dark:text-slate-300">
                          Passez l'option <strong>Microphone</strong> sur <strong>« Autoriser »</strong>.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Desktop Step-by-Step */}
                  {deviceType === 'desktop' && (
                    <div className="space-y-2 text-xs bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-3.5">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                        <p className="text-slate-700 dark:text-slate-300">
                          Cliquez sur le cadenas 🔒 ou l'icône des curseurs à gauche de l'adresse web.
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                        <p className="text-slate-700 dark:text-slate-300">
                          Basculez le bouton <strong>Microphone</strong> sur <strong>Activé (Autorisé)</strong>.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: GEOLOCATION */}
            {activeTab === 'geolocation' && (
              <div className="space-y-4">
                {/* Status Card */}
                <div className="bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        État du GPS : {geoStatus === 'granted' ? '✅ Autorisé' : geoStatus === 'denied' ? '🚫 Bloqué / Inaccessible' : '⏳ En attente'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Calcul précis de la Qibla, des heures de prière et des planètes.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleTestGeolocation}
                    disabled={isTestingGeo}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {isTestingGeo ? <RefreshCw className="animate-spin" size={14} /> : <MapPin size={14} />}
                    <span>Tester</span>
                  </button>
                </div>

                {/* Alternative Button */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
                      Vous ne souhaitez pas activer le GPS ?
                    </p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400">
                      {savedCity ? `Position actuelle : ${savedCity}` : 'Sélectionnez votre ville manuellement pour des calculs 100% exacts sans GPS.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('manual_city')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    Choisir ville
                  </button>
                </div>

                {/* Device Steps for GPS */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Les 2 raisons fréquentes sur Android :
                    </span>
                  </div>

                  <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-750 rounded-2xl p-3.5">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">1</span>
                        Le GPS de votre téléphone est éteint dans Android :
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 pl-5 text-[11px]">
                        Glissez votre doigt du haut vers le bas de l'écran de votre téléphone Android pour afficher le volet des raccourcis, et vérifiez que l'icône <strong>« Localisation »</strong> (ou GPS) est bien <strong>allumée en bleu/vert</strong>.
                      </p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">2</span>
                        Le site est bloqué dans les réglages Chrome :
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 pl-5 text-[11px]">
                        Appuyez sur le cadenas 🔒 tout en haut à gauche à côté de l'adresse du site &gt; <strong>Autorisations</strong> &gt; <strong>Localisation</strong> &gt; <strong>Autoriser</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MANUAL CITY (Alternative sans GPS) */}
            {activeTab === 'manual_city' && (
              <div className="space-y-3">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-xs text-amber-900 dark:text-amber-300">
                  <p className="font-bold">✨ Solution Alternative Garantie Sans GPS</p>
                  <p className="text-[11px] mt-0.5 opacity-90">
                    Si votre appareil refuse le GPS, choisissez votre ville ci-dessous. Le calcul de la Qibla, des heures de prière et des heures planétaires fonctionnera immédiatement.
                  </p>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="Rechercher une ville (ex: Dakar, Bamako, Paris, Casablanca...)"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* City List */}
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {filteredCities.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleSelectCity(c)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-100 dark:border-slate-750 hover:border-emerald-500/40 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1.5">
                          {c.country}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 group-hover:text-emerald-500 flex items-center gap-1 font-mono">
                        {c.lat > 0 ? `${c.lat}°N` : `${Math.abs(c.lat)}°S`}, {c.lng > 0 ? `${c.lng}°E` : `${Math.abs(c.lng)}°W`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={refreshStatuses}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Actualiser l'état</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
