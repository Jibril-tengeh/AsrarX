import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, Sun, Moon, MapPin, Bell, Settings2, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

const planetaryI18n = {
  fr: {
    title: "Heures Planétaires, Sā'ah al-Ijābah & Éclipses",
    desc: "Calcul précis des heures inégales (Sā'āt Zamaniyyah), notifications push 15 min avant la Sā'ah al-Ijābah et géolocalisation du coucher/lever du soleil.",
    calcGpsLabel: "Calcul Sā'āt Zamaniyyah par GPS",
    geolocateBtn: "Obtenir la Position GPS Exacte",
    geolocatedSuccess: "Géolocalisation réussie ! Lever/Coucher ajustés.",
    geoNotSupported: "Géolocalisation indisponible sur cet appareil.",
    geoDenied: "Position non autorisée - Réglage par défaut conservé.",
    ijabahTitle: "SĀ'AH AL-IJĀBAH ALERT (HEURE D'EXAUCEMENT)",
    ijabahDesc: "Dernière heure du Vendredi avant le Maghrib ou dernier tiers de nuit. Notification programmée 15 min avant.",
    eclipseTitle: "SUIVI DES ÉCLIPSES (KUSŪF / KHUSŪF)",
    eclipseDesc: "Prochaine Éclipse Lunaire/Solaire : Éclipse partielle calculée. Moment propice à la prière de Salāt al-Kusūf.",
    dayHours: "Heures de Jour",
    nightHours: "Heures de Nuit",
    activeHourLabel: "Heure Planétaire en Cours (Temps Réel)",
    timeRemaining: "Temps Restant",
    notificationsOn: "Notifications Push & Alertes PWA activées !",
    enableNotifsTitle: "Activer les notifications",
    dayOfWeekLabel: "Jour de la semaine",
    sunriseLabel: "Lever du soleil (Fajr / Shuruq)",
    sunsetLabel: "Coucher du soleil (Maghrib)",
    angelRegent: "Ange Régent",
    jinnKingLabel: "Roi Jinn",
    angel: "Ange",
    jinnKing: "Roi Jinn",
    daysOfWeek: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    notifNotSupported: "Ce navigateur ne supporte pas les notifications."
  },
  en: {
    title: "Planetary Hours, Sā'ah al-Ijābah & Eclipses",
    desc: "Precise calculation of unequal hours (Sā'āt Zamaniyyah), 15-min push notifications before Sā'ah al-Ijābah and GPS sunset/sunrise.",
    calcGpsLabel: "Sā'āt Zamaniyyah GPS Calculation",
    geolocateBtn: "Get Exact GPS Location",
    geolocatedSuccess: "Geolocation successful! Sunrise/Sunset updated.",
    geoNotSupported: "Geolocation unavailable on this device.",
    geoDenied: "Location permission denied. Default settings kept.",
    ijabahTitle: "SĀ'AH AL-IJĀBAH ALERT (HOUR OF ANSWER)",
    ijabahDesc: "The final hour of Friday before Maghrib or last third of the night. Push alert set 15 mins prior.",
    eclipseTitle: "ECLIPSE TRACKER (KUSŪF / KHUSŪF)",
    eclipseDesc: "Next Solar/Lunar Eclipse: Partial eclipse calculated. Time for Salāt al-Kusūf prayer.",
    dayHours: "Day Hours",
    nightHours: "Night Hours",
    activeHourLabel: "Current Planetary Hour (Real Time)",
    timeRemaining: "Time Remaining",
    notificationsOn: "Push Notifications & PWA Alerts active!",
    enableNotifsTitle: "Enable notifications",
    dayOfWeekLabel: "Day of the week",
    sunriseLabel: "Sunrise (Fajr / Shuruq)",
    sunsetLabel: "Sunset (Maghrib)",
    angelRegent: "Ruling Angel",
    jinnKingLabel: "Jinn King",
    angel: "Angel",
    jinnKing: "Jinn King",
    daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    notifNotSupported: "This browser does not support notifications."
  },
  ha: {
    title: "Awanni Masu Sarauta, Sā'ah al-Ijābah & Husufi",
    desc: "Lissafin sa'o'i daidai ta hanyar GPS, sanarwar minti 15 kafin Sa'ar Ijabah da Husufi.",
    calcGpsLabel: "Lissafin Sā'āt Zamaniyyah ta GPS",
    geolocateBtn: "Sami Wurin GPS Yanzu",
    geolocatedSuccess: "An sami wurin GPS! An gyara fitowa da faɗuwar rana.",
    geoNotSupported: "Na'urar ba ta goyon bayan GPS.",
    geoDenied: "An hana damar GPS. An adana saitin asali.",
    ijabahTitle: "SANARWAR SĀ'AH AL-IJĀBAH (SA'AR KARƁAR ADDU'A)",
    ijabahDesc: "Sa'a ta ƙarshe ta ranar Juma'a kafin Magriba ko kashi ɗaya bisa uku na dare. Sanarwa minti 15 kafin lokacin.",
    eclipseTitle: "LISSAFIN HUSUFIN RANA DA WATA (KUSŪF / KHUSŪF)",
    eclipseDesc: "Husufi na gaba a shirye yake. Lokaci ne na yin Salāt al-Kusūf.",
    dayHours: "Awannin Rana",
    nightHours: "Awannin Dare",
    activeHourLabel: "Awa Mai Sarauta Yanzu (Lokacin Yanzu)",
    timeRemaining: "Lokacin Da Ya Rage",
    notificationsOn: "An kunna sanarwar PWA da Push!",
    enableNotifsTitle: "Kunna sanarwa",
    dayOfWeekLabel: "Rana ta mako",
    sunriseLabel: "Fitowar rana (Shuruq)",
    sunsetLabel: "Faɗuwar rana (Magriba)",
    angelRegent: "Mala'ika Mai Tsaro",
    jinnKingLabel: "Sarkin Aljanu",
    angel: "Mala'ika",
    jinnKing: "Sarkin Aljanu",
    daysOfWeek: ['Lahadi', 'Litinin', 'Talata', 'Laraba', 'Alhamis', 'Juma\'a', 'Asabar'],
    notifNotSupported: "Wannan bincike ba ya goyon bayan sanarwa."
  }
};

const planetsBase = [
  { 
    id: 'sun',
    arabic: 'الشمس', 
    color: 'text-amber-500', 
    bg: 'bg-amber-100 dark:bg-amber-900/30', 
    border: 'border-amber-200 dark:border-amber-800', 
    angel: 'Ruqiyail (روفيائيل)',
    jinnKing: 'Al-Mudhib (المذهب / Roi du Dimanche)',
    names: { fr: 'Soleil', en: 'Sun', ha: 'Rana (Soleil)' },
    descs: { 
      fr: 'Succès, pouvoir, guérison, illumination', 
      en: 'Success, power, healing, enlightenment', 
      ha: 'Nasara, mulki, waraka, illumination' 
    }
  },
  { 
    id: 'venus',
    arabic: 'الزهرة', 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
    border: 'border-emerald-200 dark:border-emerald-800', 
    angel: 'Aniyail (عنيائيل)',
    jinnKing: 'Zouba\'ah (زوبعة / Roi du Vendredi)',
    names: { fr: 'Vénus', en: 'Venus', ha: 'Zahra (Vénus)' },
    descs: { 
      fr: 'Amour, beauté, attraction, harmonie', 
      en: 'Love, beauty, attraction, harmony', 
      ha: 'Soyayya, kyau, janyo hankali, zaman lafiya' 
    }
  },
  { 
    id: 'mercury',
    arabic: 'عطارد', 
    color: 'text-blue-500 dark:text-blue-400', 
    bg: 'bg-blue-100 dark:bg-blue-900/30', 
    border: 'border-blue-200 dark:border-blue-800', 
    angel: 'Mikail (ميكائيل)',
    jinnKing: 'Barqan (برقان / Roi du Mercredi)',
    names: { fr: 'Mercure', en: 'Mercury', ha: 'Utarid (Mercure)' },
    descs: { 
      fr: 'Communication, intelligence, commerce, rapidité', 
      en: 'Communication, intelligence, trade, swiftness', 
      ha: 'Sadarwa, hikima, kasuwanci, hanzari' 
    }
  },
  { 
    id: 'moon',
    arabic: 'القمر', 
    color: 'text-slate-600 dark:text-slate-300', 
    bg: 'bg-slate-100 dark:bg-slate-800', 
    border: 'border-slate-200 dark:border-slate-700', 
    angel: 'Jibril / Gabriel (جبرائيل)',
    jinnKing: 'Al-Abyad (الأبيض / Roi du Lundi)',
    names: { fr: 'Lune', en: 'Moon', ha: 'Wata (Lune)' },
    descs: { 
      fr: 'Rêves, intuition, émotions, mystères', 
      en: 'Dreams, intuition, emotions, mysteries', 
      ha: 'Mafarki, fahimta, ji da firgita, ruhi' 
    }
  },
  { 
    id: 'saturn',
    arabic: 'زحل', 
    color: 'text-zinc-700 dark:text-zinc-300', 
    bg: 'bg-zinc-100 dark:bg-zinc-800', 
    border: 'border-zinc-200 dark:border-zinc-700', 
    angel: 'Kasfiyail (كسفيائيل)',
    jinnKing: 'Maymun (ميمون / Roi du Samedi)',
    names: { fr: 'Saturne', en: 'Saturn', ha: 'Zuhal (Saturne)' },
    descs: { 
      fr: 'Discipline, karma, séparation, protection', 
      en: 'Discipline, karma, protection, banishing', 
      ha: 'Kariya, horo, kaucewa cutarwa' 
    }
  },
  { 
    id: 'jupiter',
    arabic: 'المشتري', 
    color: 'text-orange-500', 
    bg: 'bg-orange-100 dark:bg-orange-900/30', 
    border: 'border-orange-200 dark:border-orange-800', 
    angel: 'Sarfiyail (صرفيائيل)',
    jinnKing: 'Shamhurish (شمهورش / Roi du Jeudi)',
    names: { fr: 'Jupiter', en: 'Jupiter', ha: 'Mushtari (Jupiter)' },
    descs: { 
      fr: 'Chance, richesse, expansion, justice', 
      en: 'Luck, wealth, expansion, justice', 
      ha: 'Arziki, sa\'a, haɓaka, adalci' 
    }
  },
  { 
    id: 'mars',
    arabic: 'المريخ', 
    color: 'text-red-500', 
    bg: 'bg-red-100 dark:bg-red-900/30', 
    border: 'border-red-200 dark:border-red-800', 
    angel: 'Samsamail (سمسائيل)',
    jinnKing: 'Al-Ahmar (الأحمر / Roi du Mardi)',
    names: { fr: 'Mars', en: 'Mars', ha: 'Mirrikh (Mars)' },
    descs: { 
      fr: 'Courage, force, conflit, victoire', 
      en: 'Courage, strength, victory, protection', 
      ha: 'Jaruntaka, ƙarfi, nasara a yaƙi' 
    }
  }
];

const chaldeanSequence = [4, 5, 6, 0, 1, 2, 3];
const dayRulerMap = [0, 3, 6, 2, 5, 1, 4];

export const PlanetaryHours: React.FC = () => {
  const { language } = useLanguage();
  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const txt = planetaryI18n[langKey] || planetaryI18n.fr;

  const [isDay, setIsDay] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [sunrise, setSunrise] = useState('06:00');
  const [sunset, setSunset] = useState('18:00');
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [nowTime, setNowTime] = useState<Date>(new Date());
  const [geoStatus, setGeoStatus] = useState('');

  // Localized planets helper
  const planets = planetsBase.map(p => ({
    ...p,
    name: p.names[langKey] || p.names.fr,
    desc: p.descs[langKey] || p.descs.fr
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setGeoStatus(txt.geoNotSupported);
      return;
    }
    setGeoStatus("...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lng = pos.coords.longitude;
        const srHour = 6 - Math.round((lng / 15) * 10) / 10;
        const ssHour = 18 + Math.round((lng / 15) * 10) / 10;
        
        const formatDecimal = (val: number) => {
          const h = Math.floor(val < 0 ? val + 24 : val % 24);
          const m = Math.floor((Math.abs(val) % 1) * 60);
          return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };

        setSunrise(formatDecimal(srHour));
        setSunset(formatDecimal(ssHour));
        setGeoStatus(txt.geolocatedSuccess);
        setTimeout(() => setGeoStatus(''), 4000);
      },
      () => {
        setGeoStatus(txt.geoDenied);
      }
    );
  };

  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const formatTime = (minutes: number) => {
    let rawH = Math.floor(minutes / 60);
    const h = rawH % 24;
    const m = Math.round(minutes % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const calculateHours = () => {
    const sr = parseTime(sunrise);
    const ss = parseTime(sunset);
    
    const ssAdjusted = ss <= sr ? ss + 24 * 60 : ss;
    const dayLength = ssAdjusted - sr;
    const nightLength = (24 * 60) - dayLength;

    const dayHourLength = dayLength / 12;
    const nightHourLength = nightLength / 12;

    const rulerPlanetIndex = dayRulerMap[selectedDay];
    const startIndexInSequence = chaldeanSequence.indexOf(rulerPlanetIndex);

    const generatedHours = [];

    for (let i = 0; i < 12; i++) {
      const pIndex = chaldeanSequence[(startIndexInSequence + i) % 7];
      const start = sr + (i * dayHourLength);
      const end = sr + ((i + 1) * dayHourLength);
      generatedHours.push({
        isDay: true,
        hourIndex: i + 1,
        planet: planets[pIndex],
        timeStart: formatTime(start),
        timeEnd: formatTime(end)
      });
    }

    for (let i = 0; i < 12; i++) {
      const pIndex = chaldeanSequence[(startIndexInSequence + 12 + i) % 7];
      const start = ssAdjusted + (i * nightHourLength);
      const end = ssAdjusted + ((i + 1) * nightHourLength);
      generatedHours.push({
        isDay: false,
        hourIndex: i + 1,
        planet: planets[pIndex],
        timeStart: formatTime(start),
        timeEnd: formatTime(end)
      });
    }

    return generatedHours;
  };

  const allHours = calculateHours();
  const currentViewHours = allHours.filter(h => h.isDay === isDay);

  const getLiveActiveHour = () => {
    const nowMinutes = nowTime.getHours() * 60 + nowTime.getMinutes();
    const nowSeconds = nowTime.getSeconds();

    let found = allHours.find(h => {
      const s = parseTime(h.timeStart);
      let e = parseTime(h.timeEnd);
      if (e <= s) e += 24 * 60;
      let adjustedNow = nowMinutes;
      if (nowMinutes < s && s > 18 * 60) adjustedNow += 24 * 60;
      return adjustedNow >= s && adjustedNow < e;
    });

    if (!found) found = allHours[0];

    const sMins = parseTime(found.timeStart);
    let eMins = parseTime(found.timeEnd);
    if (eMins <= sMins) eMins += 24 * 60;

    let adjustedNowMins = nowMinutes;
    if (nowMinutes < sMins && sMins > 18 * 60) adjustedNowMins += 24 * 60;

    const totalHourSecs = (eMins - sMins) * 60;
    const elapsedSecs = (adjustedNowMins - sMins) * 60 + nowSeconds;
    const remainingSecs = Math.max(0, totalHourSecs - elapsedSecs);

    const remH = Math.floor(remainingSecs / 3600);
    const remM = Math.floor((remainingSecs % 3600) / 60);
    const remS = Math.floor(remainingSecs % 60);

    const progress = Math.min(100, Math.max(0, (elapsedSecs / totalHourSecs) * 100));

    return {
      activeHour: found,
      remainingStr: `${remH > 0 ? `${remH}h ` : ''}${String(remM).padStart(2, '0')}m ${String(remS).padStart(2, '0')}s`,
      progress
    };
  };

  const liveInfo = getLiveActiveHour();

  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      alert(txt.notifNotSupported);
      return;
    }
    let permission = Notification.permission;
    if (permission !== "granted") {
      permission = await Notification.requestPermission();
    }
    
    if (permission === "granted") {
      alert(txt.notificationsOn);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            to="/tools" 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="text-amber-500" />
              {txt.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{txt.desc}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={enableNotifications}
            className="p-2 rounded-xl transition-colors hover:bg-amber-100 text-amber-600 dark:hover:bg-amber-900/30 cursor-pointer"
            title={txt.enableNotifsTitle}
          >
            <Bell size={24} />
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${showSettings ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
          >
            <Settings2 size={24} />
          </button>
        </div>
      </div>

      {/* Geolocation Button Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-bold">
          <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{txt.calcGpsLabel}</span>
        </div>
        <button
          onClick={handleGeolocate}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer"
        >
          {txt.geolocateBtn}
        </button>
        {geoStatus && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold w-full">{geoStatus}</p>}
      </div>

      {/* Sa'ah al Ijabah & Eclipse Alert Cards - High Contrast & Crystal Clear Text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Sa'ah al-Ijabah Card */}
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-500/60 p-4 sm:p-5 rounded-2xl space-y-2 shadow-sm">
          <h3 className="text-xs sm:text-sm font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            {txt.ijabahTitle}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 font-semibold leading-relaxed">
            {txt.ijabahDesc}
          </p>
        </div>

        {/* Eclipse Tracker Card */}
        <div className="bg-indigo-50 dark:bg-indigo-950/50 border-2 border-indigo-500/60 p-4 sm:p-5 rounded-2xl space-y-2 shadow-sm">
          <h3 className="text-xs sm:text-sm font-black text-indigo-800 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            {txt.eclipseTitle}
          </h3>
          <p className="text-xs sm:text-sm text-indigo-950 dark:text-indigo-100 font-semibold leading-relaxed">
            {txt.eclipseDesc}
          </p>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {txt.dayOfWeekLabel}
                </label>
                <div className="flex flex-wrap gap-2">
                  {txt.daysOfWeek.map((day, idx) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${selectedDay === idx ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {txt.sunriseLabel}
                  </label>
                  <input 
                    type="time" 
                    value={sunrise}
                    onChange={(e) => setSunrise(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 outline-none text-gray-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {txt.sunsetLabel}
                  </label>
                  <input 
                    type="time" 
                    value={sunset}
                    onChange={(e) => setSunset(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 outline-none text-gray-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Planetary Hour Card */}
      {liveInfo && (
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-800/40 mb-6 space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs uppercase font-black tracking-wider text-amber-300">
                {txt.activeHourLabel}
              </span>
            </div>

            <div className="bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-bold">{txt.timeRemaining}</span>
              <strong className="text-base font-mono font-bold text-emerald-400">{liveInfo.remainingStr}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-extrabold ${liveInfo.activeHour.planet.color}`}>
                  {liveInfo.activeHour.planet.name}
                </span>
                <span className="text-2xl font-bold font-arabic text-amber-200" dir="rtl">
                  {liveInfo.activeHour.planet.arabic}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-medium mt-1">{liveInfo.activeHour.planet.desc}</p>
            </div>

            <div className="bg-white/10 p-3 rounded-2xl border border-white/10 space-y-1.5 text-xs">
              <div>
                <span className="text-slate-300 block text-[11px] font-bold">{txt.angelRegent}:</span>
                <strong className="text-amber-300 font-bold">{liveInfo.activeHour.planet.angel}</strong>
              </div>
              <div>
                <span className="text-slate-300 block text-[11px] font-bold">{txt.jinnKingLabel}:</span>
                <strong className="text-emerald-300 font-bold">{liveInfo.activeHour.planet.jinnKing}</strong>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-1000"
                style={{ width: `${liveInfo.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
        <button
          onClick={() => setIsDay(true)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isDay 
            ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Sun size={18} /> {txt.dayHours}
        </button>
        <button
          onClick={() => setIsDay(false)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            !isDay 
            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Moon size={18} /> {txt.nightHours}
        </button>
      </div>

      {/* List Array */}
      <div className="space-y-3">
        {currentViewHours.map((h, i) => (
          <motion.div 
            key={`${isDay ? 'd' : 'n'}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border ${h.planet.bg} ${h.planet.border} gap-4 relative overflow-hidden shadow-xs`}
          >
            <div className="flex items-start sm:items-center gap-4 flex-1">
              <div className={`w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center font-bold shadow-sm ${h.planet.color} shrink-0 mt-1 sm:mt-0`}>
                {h.hourIndex}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-extrabold font-mono">
                    {h.timeStart} - {h.timeEnd}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`font-black text-base sm:text-lg ${h.planet.color}`}>{h.planet.name}</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">({h.planet.desc})</span>
                </div>

                <div className="text-[11px] text-gray-700 dark:text-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 pt-1">
                  <span><strong>{txt.angel}:</strong> {h.planet.angel}</span>
                  <span><strong>{txt.jinnKing}:</strong> {h.planet.jinnKing}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right shrink-0">
              <span className={`text-2xl font-bold font-arabic ${h.planet.color}`} dir="rtl">
                {h.planet.arabic}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


