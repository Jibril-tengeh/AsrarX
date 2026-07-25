import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Bell, 
  BellOff, 
  Moon, 
  Sun, 
  X, 
  ChevronDown, 
  Play, 
  Pause, 
  Volume2, 
  Calculator, 
  ShieldCheck, 
  Check, 
  Radio, 
  Compass, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAudio } from '../contexts/AudioContext';
import { getCurrentPlanetaryHour, playNotificationTone, requestNotificationPermission } from '../utils/planetaryNotifications';
import { calculateAbjadValue } from '../utils/abjad';

export const CollapsibleFloatingWidget: React.FC = () => {
  const { language } = useLanguage();
  const { isPlaying, pause, resume, currentTrack } = useAudio();
  
  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'planetary' | 'tasbih' | 'abjad' | 'notifications'>('planetary');
  
  // Planetary State
  const [currentPlanet, setCurrentPlanet] = useState(getCurrentPlanetaryHour());
  
  // Quick Tasbih State
  const [tasbihCount, setTasbihCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState('Subhanallah');
  
  // Quick Abjad State
  const [abjadInput, setAbjadInput] = useState('');
  const [abjadValue, setAbjadValue] = useState(0);
  
  // Notification State
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [testSent, setTestSent] = useState(false);
  const [bgRemindersEnabled, setBgRemindersEnabled] = useState(() => {
    return localStorage.getItem('asrar_bg_reminders') === 'true';
  });

  // Update planetary info periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlanet(getCurrentPlanetaryHour());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Update Abjad calculation dynamically
  useEffect(() => {
    if (!abjadInput.trim()) {
      setAbjadValue(0);
      return;
    }
    const val = calculateAbjadValue(abjadInput);
    setAbjadValue(val);
  }, [abjadInput]);

  // Handle notification request
  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
    if (granted) {
      setBgRemindersEnabled(true);
      localStorage.setItem('asrar_bg_reminders', 'true');
      
      // Register service worker if available
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          reg.active?.postMessage({
            type: 'SHOW_NOTIFICATION',
            title: 'AsrarHub — Notifications Activées',
            body: 'Vous recevrez les rappels spirituels et heures planétaires en arrière-plan.',
          });
        } catch (e) {
          console.warn('Service worker registration notice:', e);
        }
      }
    }
  };

  // Trigger test background notification (delays 3 seconds so user can switch tabs)
  const handleTestBackgroundNotif = async () => {
    setTestSent(true);
    playNotificationTone();

    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        reg.active?.postMessage({
          type: 'SCHEDULE_BACKGROUND_REMINDER',
          title: '✨ Rappel Spirituel en Arrière-Plan',
          body: `Sceau Actif: ${currentPlanet.planet.name} (${currentPlanet.planet.arabic}) — C'est l'heure propice pour votre Zikr !`,
          delayMs: 3000,
        });
      } catch (e) {
        if ('Notification' in window && Notification.permission === 'granted') {
          setTimeout(() => {
            new Notification('✨ Rappel Spirituel AsrarHub', {
              body: `Heure Planétaire : ${currentPlanet.planet.name} (${currentPlanet.planet.arabic})`,
              icon: '/icon-192.png',
            });
          }, 3000);
        }
      }
    } else if ('Notification' in window && Notification.permission === 'granted') {
      setTimeout(() => {
        new Notification('✨ Rappel Spirituel AsrarHub', {
          body: `Heure Planétaire : ${currentPlanet.planet.name} (${currentPlanet.planet.arabic})`,
          icon: '/icon-192.png',
        });
      }, 3000);
    }

    setTimeout(() => setTestSent(false), 4000);
  };

  const getPlanetColor = (name: string) => {
    switch (name) {
      case 'Soleil': return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
      case 'Vénus': return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
      case 'Jupiter': return 'text-purple-400 border-purple-500/50 bg-purple-500/10';
      case 'Lune': return 'text-cyan-300 border-cyan-500/50 bg-cyan-500/10';
      case 'Mercure': return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
      case 'Mars': return 'text-rose-400 border-rose-500/50 bg-rose-500/10';
      default: return 'text-slate-400 border-slate-500/50 bg-slate-500/10';
    }
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[9990] flex flex-col items-end pointer-events-auto select-none">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-3 w-[calc(100vw-2rem)] sm:w-96 rounded-2xl bg-slate-900/95 dark:bg-gray-950/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 overflow-hidden text-slate-100 text-sm"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-b border-emerald-500/20">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">
                    AsrarHub Quick Hub
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {language === 'fr' ? 'Widget Flottant & Arrière-Plan' : language === 'ha' ? 'Rikitan Bayani da Badini' : 'Floating Widget & Background'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Réduire le widget"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/50 p-1 gap-1 text-xs">
              <button
                onClick={() => setActiveTab('planetary')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'planetary' 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Planétaire' : language === 'ha' ? 'Rana/Tauraro' : 'Planetary'}</span>
              </button>

              <button
                onClick={() => setActiveTab('tasbih')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'tasbih' 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Tasbih</span>
              </button>

              <button
                onClick={() => setActiveTab('abjad')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'abjad' 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Abjad</span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 relative ${
                  activeTab === 'notifications' 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Notifs</span>
                {notifPermission !== 'granted' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-1 right-1" />
                )}
              </button>
            </div>

            {/* Tab Body Content */}
            <div className="p-4 space-y-4 max-h-[380px] overflow-y-auto">
              {/* TAB 1: Planetary Hours */}
              {activeTab === 'planetary' && (
                <div className="space-y-3">
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${getPlanetColor(currentPlanet.planet.name)}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold font-serif">{currentPlanet.planet.symbol}</span>
                      <div>
                        <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                          {currentPlanet.planet.name}
                          <span className="font-serif text-amber-300 text-xs">({currentPlanet.planet.arabic})</span>
                        </div>
                        <p className="text-[11px] text-slate-300 opacity-90">{currentPlanet.planet.favorability}</p>
                      </div>
                    </div>

                    <button
                      onClick={playNotificationTone}
                      className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                      title="Tester la cloche 528Hz"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Heure Actuelle</span>
                      <span className="font-bold text-amber-400 text-sm">
                        Heure #{currentPlanet.hourNumber} ({currentPlanet.isDaytime ? 'Journée ☀️' : 'Nuit 🌙'})
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Arrière-Plan</span>
                      <span className="font-bold text-emerald-400 text-sm flex items-center gap-1">
                        <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                        {bgRemindersEnabled ? 'Surveillance Active' : 'Inactif'}
                      </span>
                    </div>
                  </div>

                  {/* Audio mini bar */}
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden pr-2">
                      <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-slate-300 truncate">
                        {currentTrack ? currentTrack.title : 'Ambiance 432Hz & Ruqyah'}
                      </span>
                    </div>
                    <button
                      onClick={togglePlay}
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shrink-0"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Quick Tasbih */}
              {activeTab === 'tasbih' && (
                <div className="space-y-3 text-center">
                  <div className="flex justify-center gap-1.5 text-xs">
                    {['Subhanallah', 'Alhamdulillah', 'Allahu Akbar', 'Astaghfirullah'].map((item) => (
                      <button
                        key={item}
                        onClick={() => setSelectedDhikr(item)}
                        className={`px-2 py-1 rounded-md border text-[10px] transition-all ${
                          selectedDhikr === item 
                            ? 'bg-emerald-600 border-emerald-500 text-white font-bold' 
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {item.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-950 to-emerald-950/40 border border-emerald-500/20 relative">
                    <p className="text-xs text-emerald-400 font-semibold mb-1">{selectedDhikr}</p>
                    <div className="text-4xl font-extrabold text-white my-2 tracking-tight">
                      {tasbihCount}
                    </div>

                    <div className="flex justify-center gap-3 mt-3">
                      <button
                        onClick={() => setTasbihCount(prev => prev + 1)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-900/50 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Compter (+1)</span>
                      </button>

                      <button
                        onClick={() => setTasbihCount(0)}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Réinitialiser"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Quick Abjad Calculator */}
              {activeTab === 'abjad' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-300">
                    Calculateur Abjad Instantané (Poids Numérique) :
                  </label>
                  <input
                    type="text"
                    value={abjadInput}
                    onChange={(e) => setAbjadInput(e.target.value)}
                    placeholder="Tapez un mot ou prénom..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                  />

                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Total Abjad :</span>
                    <span className="text-2xl font-bold text-amber-400">{abjadValue}</span>
                  </div>
                </div>
              )}

              {/* TAB 4: Background Notifications Control */}
              {activeTab === 'notifications' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">Statut Autorisation :</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        notifPermission === 'granted' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {notifPermission === 'granted' ? 'Autorisé ✓' : 'Permission Requise'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Recevez les rappels d'heures planétaires, Sa'ah Ijabah et Zikr quotidien directement en arrière-plan même lorsque vous n'êtes pas sur l'application.
                    </p>
                  </div>

                  {notifPermission !== 'granted' ? (
                    <button
                      onClick={handleEnableNotifications}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-900/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Activer les Notifications Arrière-Plan</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={handleTestBackgroundNotif}
                        disabled={testSent}
                        className="w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all flex items-center justify-center gap-2"
                      >
                        {testSent ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                            <span>Notification envoyée ! (Regardez en haut dans 3s)</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Tester la Notification d'Arrière-Plan (3s)</span>
                          </>
                        )}
                      </button>

                      <div className="text-[10px] text-slate-400 text-center italic">
                        Changez d'onglet ou réduisez le navigateur après avoir cliqué sur tester.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button (Collapsed Pill / Badge) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-slate-900/90 dark:bg-gray-950/90 backdrop-blur-md border border-emerald-500/40 shadow-xl shadow-emerald-950/60 text-white hover:border-emerald-400 transition-all group"
      >
        <div className="relative flex items-center justify-center">
          <span className="text-xl font-bold font-serif leading-none text-amber-300">
            {currentPlanet.planet.symbol}
          </span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
        </div>

        <div className="text-left hidden sm:block">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider leading-none">
            {currentPlanet.planet.name}
          </div>
          <div className="text-[9px] text-slate-300 opacity-80 leading-tight">
            Heure #{currentPlanet.hourNumber}
          </div>
        </div>

        <div className="pl-1 border-l border-slate-700 text-slate-400 group-hover:text-emerald-400 transition-colors">
          {isExpanded ? <X className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-emerald-400" />}
        </div>
      </motion.button>
    </div>
  );
};
