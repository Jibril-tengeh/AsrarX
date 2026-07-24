import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, Sun, Moon, Info, Settings2, MapPin, Bell, Database, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

const planets = [
  { 
    name: 'Soleil', 
    arabic: 'الشمس', 
    color: 'text-amber-500', 
    bg: 'bg-amber-100 dark:bg-amber-900/30', 
    border: 'border-amber-200 dark:border-amber-800', 
    desc: 'Succès, pouvoir, guérison, illumination',
    angel: 'Ruqiyail (روفيائيل)',
    jinnKing: 'Al-Mudhib (المذهب / Roi du Dimanche)',
    incense: 'Luban Mâle, Oud & Safran',
    auspicity: { status: 'neutral', label: 'Favorable / Neutre (Noblesse)', color: 'bg-amber-500 text-white' }
  },
  { 
    name: 'Vénus', 
    arabic: 'الزهرة', 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
    border: 'border-emerald-200 dark:border-emerald-800', 
    desc: 'Amour, beauté, attraction, harmonie',
    angel: 'Aniyail (عنيائيل)',
    jinnKing: 'Zouba\'ah (زوبعة / Roi du Vendredi)',
    incense: 'Mastic, Oud Blanc & Eau de Rose',
    auspicity: { status: 'favorable', label: 'Très Favorable (Grâce & Amour)', color: 'bg-emerald-500 text-white' }
  },
  { 
    name: 'Mercure', 
    arabic: 'عطارد', 
    color: 'text-blue-400', 
    bg: 'bg-blue-100 dark:bg-blue-900/30', 
    border: 'border-blue-200 dark:border-blue-800', 
    desc: 'Communication, intelligence, commerce, rapidité',
    angel: 'Mikail (ميكائيل)',
    jinnKing: 'Barqan (برقان / Roi du Mercredi)',
    incense: 'Sandaraque, Mastic & Musc',
    auspicity: { status: 'neutral', label: 'Favorable / Neutre (Commerce)', color: 'bg-blue-500 text-white' }
  },
  { 
    name: 'Lune', 
    arabic: 'القمر', 
    color: 'text-slate-400', 
    bg: 'bg-slate-100 dark:bg-slate-800', 
    border: 'border-slate-200 dark:border-slate-700', 
    desc: 'Rêves, intuition, émotions, magie d\'eau',
    angel: 'Jibril / Gabriel (جبرائيل)',
    jinnKing: 'Al-Abyad (الأبيض / Roi du Lundi)',
    incense: 'Musc Blanc & Encens de Cambodge',
    auspicity: { status: 'neutral', label: 'Favorable / Neutre (Intuition)', color: 'bg-slate-500 text-white' }
  },
  { 
    name: 'Saturne', 
    arabic: 'زحل', 
    color: 'text-zinc-600 dark:text-zinc-400', 
    bg: 'bg-zinc-100 dark:bg-zinc-800', 
    border: 'border-zinc-200 dark:border-zinc-700', 
    desc: 'Discipline, karma, séparation, protection, bannissement',
    angel: 'Kasfiyail (كسفيائيل)',
    jinnKing: 'Maymun (ميمون / Roi du Samedi)',
    incense: 'Myrrhe, Santal Noir & Soufre',
    auspicity: { status: 'unfavorable', label: 'Prudence / Défavorable (Rigoureux)', color: 'bg-zinc-700 text-white' }
  },
  { 
    name: 'Jupiter', 
    arabic: 'المشتري', 
    color: 'text-orange-500', 
    bg: 'bg-orange-100 dark:bg-orange-900/30', 
    border: 'border-orange-200 dark:border-orange-800', 
    desc: 'Chance, richesse, expansion, justice',
    angel: 'Sarfiyail (صرفيائيل)',
    jinnKing: 'Shamhurish (شمهورش / Roi du Jeudi)',
    incense: 'Ambre Gris, Oud & Santal',
    auspicity: { status: 'favorable', label: 'Très Favorable (Prospérité)', color: 'bg-emerald-500 text-white' }
  },
  { 
    name: 'Mars', 
    arabic: 'المريخ', 
    color: 'text-red-500', 
    bg: 'bg-red-100 dark:bg-red-900/30', 
    border: 'border-red-200 dark:border-red-800', 
    desc: 'Courage, force, conflit, victoire',
    angel: 'Samsamail (سمسائيل)',
    jinnKing: 'Al-Ahmar (الأحمر / Roi du Mardi)',
    incense: 'Santal Rouge, Poivre & Casserole',
    auspicity: { status: 'unfavorable', label: 'Prudence / Défavorable (Combat)', color: 'bg-red-600 text-white' }
  }
];

// Chaldean sequence: Saturn -> Jupiter -> Mars -> Sun -> Venus -> Mercury -> Moon -> repeat
const chaldeanSequence = [4, 5, 6, 0, 1, 2, 3];

// Day rulers (Sunday = Sun, Monday = Moon...)
const dayRulerMap = [0, 3, 6, 2, 5, 1, 4]; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

export const PlanetaryHours: React.FC = () => {
  const { t } = useLanguage();
  const [isDay, setIsDay] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [sunrise, setSunrise] = useState('06:00');
  const [sunset, setSunset] = useState('18:00');
  const [selectedDay, setSelectedDay] = useState(new Date().getDay()); // 0-6
  const [isUsingCache, setIsUsingCache] = useState(true);
  const [nowTime, setNowTime] = useState<Date>(new Date());

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load saved state on mount
  useEffect(() => {
    try {
      const savedSunrise = localStorage.getItem('asrar_planetary_sunrise');
      if (savedSunrise) setSunrise(savedSunrise);
      const savedSunset = localStorage.getItem('asrar_planetary_sunset');
      if (savedSunset) setSunset(savedSunset);
      const savedSelectedDay = localStorage.getItem('asrar_planetary_selected_day');
      if (savedSelectedDay) setSelectedDay(Number(savedSelectedDay));
      const savedIsDay = localStorage.getItem('asrar_planetary_is_day');
      if (savedIsDay) setIsDay(savedIsDay === 'true');
    } catch (e) {
      console.warn("Failed to load planetary state", e);
    }
    setIsUsingCache(!navigator.onLine);
  }, []);

  // Save states on change
  useEffect(() => {
    try {
      localStorage.setItem('asrar_planetary_sunrise', sunrise);
    } catch (e) {}
  }, [sunrise]);

  useEffect(() => {
    try {
      localStorage.setItem('asrar_planetary_sunset', sunset);
    } catch (e) {}
  }, [sunset]);

  useEffect(() => {
    try {
      localStorage.setItem('asrar_planetary_selected_day', String(selectedDay));
    } catch (e) {}
  }, [selectedDay]);

  useEffect(() => {
    try {
      localStorage.setItem('asrar_planetary_is_day', String(isDay));
    } catch (e) {}
  }, [isDay]);

  const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m; // minutes from midnight
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
    
    // Handle sunset being before sunrise (next day)
    const ssAdjusted = ss <= sr ? ss + 24 * 60 : ss;
    const dayLength = ssAdjusted - sr;
    const nightLength = (24 * 60) - dayLength;

    const dayHourLength = dayLength / 12;
    const nightHourLength = nightLength / 12;

    const rulerPlanetIndex = dayRulerMap[selectedDay];
    const startIndexInSequence = chaldeanSequence.indexOf(rulerPlanetIndex);

    const generatedHours = [];

    // Calculate day hours
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

    // Calculate night hours
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
      alert("Ce navigateur ne supporte pas les notifications de bureau");
      return;
    }
    let permission = Notification.permission;
    if (permission !== "granted") {
      permission = await Notification.requestPermission();
    }
    
    if (permission === "granted") {
      alert("Notifications activées ! Vous recevrez des alertes pour les heures planétaires aujourd'hui.");
      // In a real app, this would register a Service Worker for push or use cron.
      // Here we simulate by scheduling timeouts for today's hours.
      const now = new Date();
      allHours.forEach(hour => {
        const [h, m] = hour.timeStart.split(':').map(Number);
        const hourTime = new Date();
        hourTime.setHours(h, m, 0, 0);
        
        const delay = hourTime.getTime() - now.getTime();
        if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
          setTimeout(() => {
            new Notification(`Heure de ${hour.planet.name}`, {
              body: `C'est l'heure de ${hour.planet.name} chez vous, le moment idéal pour accomplir votre wird de ${hour.planet.domain}.`,
              icon: '/icon.png'
            });
          }, delay);
        }
      });
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
              Heures Planétaires
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("tools.planetary.description")}</p>
            {isUsingCache ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 mt-2">
                <Database size={11} className="animate-pulse" />
                <span>Cache local (Mode Offline actif)</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 mt-2">
                <Wifi size={11} />
                <span>Synchronisé localement (Offline-first)</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={enableNotifications}
            className="p-2 rounded-xl transition-colors hover:bg-amber-100 text-amber-600 dark:hover:bg-amber-900/30"
            title="Activer les notifications locales"
          >
            <Bell size={24} />
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl transition-colors ${showSettings ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}
          >
            <Settings2 size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jour de la semaine</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day, idx) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(idx)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedDay === idx ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lever du soleil</label>
                  <input 
                    type="time" 
                    value={sunrise}
                    onChange={(e) => setSunrise(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Coucher du soleil</label>
                  <input 
                    type="time" 
                    value={sunset}
                    onChange={(e) => setSunset(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-900 dark:text-white"
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
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300">
                Heure Planétaire en Cours (Temps Réel)
              </span>
            </div>

            <div className="bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-300 block">Temps Restant</span>
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
              <p className="text-xs text-slate-300 mt-1">{liveInfo.activeHour.planet.desc}</p>
              <div className="mt-2 inline-block">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${liveInfo.activeHour.planet.auspicity.color}`}>
                  {liveInfo.activeHour.planet.auspicity.label}
                </span>
              </div>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-1.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Ange Régent du Ciel:</span>
                <strong className="text-amber-300">{liveInfo.activeHour.planet.angel}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Roi Jinn de la Terre:</span>
                <strong className="text-emerald-300">{liveInfo.activeHour.planet.jinnKing}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Encens à Brûler:</span>
                <span className="text-slate-200">{liveInfo.activeHour.planet.incense}</span>
              </div>
            </div>
          </div>

          {/* Hour completion progress bar */}
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-1000"
                style={{ width: `${liveInfo.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>{liveInfo.activeHour.timeStart}</span>
              <span>{liveInfo.activeHour.timeEnd}</span>
            </div>
          </div>
        </div>
      )}

      {/* Info banner */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50 rounded-2xl p-4 mb-6 flex gap-3">
        <Info className="text-amber-500 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-amber-800 dark:text-amber-200">
          La première heure du jour commence au lever du soleil et est gouvernée par la planète du jour (ex: Soleil le dimanche).
          La durée d'une heure planétaire varie selon la saison.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
        <button
          onClick={() => setIsDay(true)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            isDay 
            ? 'bg-white dark:bg-gray-700 text-amber-500 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Sun size={18} /> Heures de Jour
        </button>
        <button
          onClick={() => setIsDay(false)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            !isDay 
            ? 'bg-white dark:bg-gray-700 text-indigo-400 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Moon size={18} /> Heures de Nuit
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
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border ${h.planet.bg} ${h.planet.border} gap-4 relative overflow-hidden`}
          >
            <div className="flex items-start sm:items-center gap-4 flex-1">
              <div className={`w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center font-bold shadow-sm ${h.planet.color} shrink-0 mt-1 sm:mt-0`}>
                {h.hourIndex}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold font-mono">
                    {h.timeStart} - {h.timeEnd}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${h.planet.auspicity.color}`}>
                    {h.planet.auspicity.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`font-extrabold text-lg ${h.planet.color}`}>{h.planet.name}</span>
                  <span className="text-xs text-gray-500 font-medium">({h.planet.desc})</span>
                </div>

                <div className="text-[11px] text-gray-600 dark:text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 pt-1">
                  <span><strong>Ange:</strong> {h.planet.angel}</span>
                  <span><strong>Roi Jinn:</strong> {h.planet.jinnKing}</span>
                  <span className="col-span-1 sm:col-span-2 text-gray-500"><strong>Encens:</strong> {h.planet.incense}</span>
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
