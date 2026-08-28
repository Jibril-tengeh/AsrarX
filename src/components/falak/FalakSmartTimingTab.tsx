import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Bell,
  Clock,
  Calendar,
  Shield,
  Coins,
  HeartPulse,
  Heart,
  Crown,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Zap,
  Volume2,
  ChevronRight,
  Flame,
  Wind,
  Droplets,
  Mountain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  SPIRITUAL_INTENTIONS,
  SpiritualIntention,
  findUpcomingSpiritualWindows,
  SmartTimingWindow
} from '../../utils/falakEngine';

interface FalakSmartTimingTabProps {
  userCoords: { lat: number; lng: number } | null;
  nowTime: Date;
  onEnableNotification: () => void;
}

export const FalakSmartTimingTab: React.FC<FalakSmartTimingTabProps> = ({
  userCoords,
  nowTime,
  onEnableNotification
}) => {
  const [selectedIntentionId, setSelectedIntentionId] = useState<string>('protection');
  const [scheduledAlerts, setScheduledAlerts] = useState<Record<string, boolean>>({});
  const [alertSuccessMsg, setAlertSuccessMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const lat = userCoords ? userCoords.lat : 21.4225; // Default Makkah
  const lng = userCoords ? userCoords.lng : 39.8262;

  const currentIntention = useMemo(() => {
    return SPIRITUAL_INTENTIONS.find((i) => i.id === selectedIntentionId) || SPIRITUAL_INTENTIONS[0];
  }, [selectedIntentionId]);

  // Compute the top upcoming Golden Windows for the selected intention
  const goldenWindows = useMemo(() => {
    return findUpcomingSpiritualWindows(selectedIntentionId, lat, lng, nowTime, 8);
  }, [selectedIntentionId, lat, lng, nowTime]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleScheduleAlert = (windowObj: SmartTimingWindow) => {
    setScheduledAlerts((prev) => ({
      ...prev,
      [windowObj.id]: true
    }));

    // Trigger notification permission request if not granted
    onEnableNotification();

    // Play gentle chime sound if possible
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, audioCtx.currentTime); // 528 Hz Love & Transformation frequency
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      // Audio context might be restricted before interaction
    }

    setAlertSuccessMsg(`Rappel programmé pour la fenêtre du ${windowObj.dateStr} (${windowObj.timeRangeStr}) !`);
    setTimeout(() => setAlertSuccessMsg(null), 4000);
  };

  const getIntentionIcon = (id: string) => {
    switch (id) {
      case 'protection':
        return <Shield className="w-5 h-5" />;
      case 'rizq':
        return <Coins className="w-5 h-5" />;
      case 'fath':
        return <Sparkles className="w-5 h-5" />;
      case 'shifa':
        return <HeartPulse className="w-5 h-5" />;
      case 'mahabba':
        return <Heart className="w-5 h-5" />;
      case 'haybah':
        return <Crown className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Overview */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-amber-300/60 dark:border-amber-700/40 rounded-3xl p-5 sm:p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
          <Zap className="w-4 h-4 text-amber-500" />
          Moteur d'Optimisation Astro-Spirituel
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
          Planificateur d'Invocations (Smart Spiritual Timing)
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Sélectionnez votre intention sacrée. L'algorithme analyse les 168 heures de la semaine et la
          trajectoire lunaire pour identifier les <strong>Fenêtres d'Exaucement Suprêmes</strong> (alignement parfait
          entre la planète régent, la demeure lunaire et l'heure d'Ijabah).
        </p>
      </div>

      {/* Intention Selector Grid */}
      <div className="space-y-3">
        <div className="text-xs font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
          1. Choisissez votre Intention Spirituelle :
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SPIRITUAL_INTENTIONS.map((intention) => {
            const isSelected = intention.id === selectedIntentionId;
            return (
              <button
                key={intention.id}
                onClick={() => setSelectedIntentionId(intention.id)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-zinc-950 border-amber-600 font-black shadow-md scale-102 ring-2 ring-amber-400/50'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-amber-300 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-zinc-950 text-amber-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'}`}>
                    {getIntentionIcon(intention.id)}
                  </div>
                  {isSelected && <Zap className="w-4 h-4 fill-zinc-950" />}
                </div>

                <div>
                  <div className="text-xs font-black truncate">{intention.titleFr.split('(')[0]}</div>
                  <div className="text-[10px] opacity-80 font-arabic truncate mt-0.5" dir="rtl">
                    {intention.titleAr}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Intention Prescriptions Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
              {getIntentionIcon(currentIntention.id)}
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-zinc-900 dark:text-white">
                {currentIntention.titleFr}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                {currentIntention.descriptionFr}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">Planètes idéales :</span>
            {currentIntention.idealPlanets.map((p) => (
              <span key={p} className="px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-black capitalize">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider text-[11px]">
                Dhikr & Noms Divins Spécifiques
              </span>
              <button
                onClick={() => handleCopy(currentIntention.recommendedAsma, 'asma')}
                className="p-1 rounded-md bg-amber-200 dark:bg-amber-800 text-amber-950 dark:text-amber-100 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'asma' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                Copier
              </button>
            </div>
            <p className="font-arabic text-sm text-amber-950 dark:text-amber-100 font-bold" dir="rtl">
              {currentIntention.recommendedAsma}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-1">
            <span className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider text-[11px] block">
              Encens Recommandé (Bakhūr)
            </span>
            <p className="text-zinc-800 dark:text-zinc-200 font-semibold leading-relaxed">
              {currentIntention.recommendedIncense}
            </p>
          </div>
        </div>
      </div>

      {alertSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-500/60 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{alertSuccessMsg}</span>
        </div>
      )}

      {/* Golden Windows Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Fenêtres d'Exaucement Détectées pour les 7 Prochains Jours
          </h3>
          <span className="text-xs text-zinc-500 font-bold">
            {goldenWindows.length} créneaux optimaux
          </span>
        </div>

        {goldenWindows.length === 0 ? (
          <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-800/40 rounded-3xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 text-sm">
            Aucun créneau optimal trouvé pour cette sélection dans les prochaines heures.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goldenWindows.map((win, idx) => {
              const isScheduled = !!scheduledAlerts[win.id];

              return (
                <motion.div
                  key={win.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`p-5 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between space-y-4 ${
                    win.harmonyScore >= 90
                      ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50/40 dark:from-amber-950/30 dark:via-zinc-900 dark:to-zinc-950 border-amber-400/80 shadow-md ring-1 ring-amber-400/40'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="font-black text-sm text-zinc-900 dark:text-white">
                          {win.dateStr}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                            win.harmonyScore >= 90
                              ? 'bg-amber-500 text-zinc-950'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {win.harmonyScore}% Affinité
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-zinc-500" />
                        <span className="font-mono text-base font-black text-zinc-900 dark:text-white">
                          {win.timeRangeStr}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${win.planet.color}`}>
                          {win.planet.symbol} {win.planet.nameFr}
                        </span>
                        <span className="font-arabic font-bold text-zinc-700 dark:text-zinc-300" dir="rtl">
                          {win.planet.arabic}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                      <div className="font-medium">
                        🌙 Demeure : <strong>N°{win.mansion.mansionNumber} {win.mansion.nameFr}</strong> ({win.mansion.nameAr})
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic">
                        {win.alignmentReasonFr}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 font-bold truncate">
                      🪵 Encens : {win.mansion.incenseFr}
                    </div>

                    <button
                      onClick={() => handleScheduleAlert(win)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        isScheduled
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-amber-500 hover:text-zinc-950'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      {isScheduled ? 'Rappel Actif ✓' : 'Alerter ce Moment'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
