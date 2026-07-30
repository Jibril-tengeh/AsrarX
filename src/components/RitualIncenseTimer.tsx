import React, { useState, useEffect, useRef } from 'react';
import { Flame, Play, Pause, RefreshCw, Volume2, VolumeX, Sparkles, Bell, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RitualIncenseTimerProps {
  plantName: string;
  element: string;
  binauralFreq?: number;
  frequencyName?: string;
  essentialOils?: string;
  usageMethod: string;
  language: string;
}

export const RitualIncenseTimer: React.FC<RitualIncenseTimerProps> = ({
  plantName,
  element,
  binauralFreq = 528,
  frequencyName,
  essentialOils,
  usageMethod,
  language
}) => {
  const [durationMinutes, setDurationMinutes] = useState<number>(3); // Default 3 min
  const [timeLeft, setTimeLeft] = useState<number>(3 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const timerRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    setTimeLeft(durationMinutes * 60);
    setIsActive(false);
    setIsCompleted(false);
    stopBinauralAudio();
  }, [durationMinutes]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            setIsCompleted(true);
            playCompletionBell();
            stopBinauralAudio();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const startBinauralAudio = () => {
    try {
      stopBinauralAudio();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(binauralFreq, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(isMuted ? 0 : 0.12, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.error("Failed to start incense binaural audio:", e);
    }
  };

  const stopBinauralAudio = () => {
    try {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.3);
        setTimeout(() => {
          if (oscRef.current) oscRef.current.stop();
          if (audioCtxRef.current) audioCtxRef.current.close();
          audioCtxRef.current = null;
        }, 300);
      } else {
        if (oscRef.current) oscRef.current.stop();
        if (audioCtxRef.current) audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {
      // ignore
    }
  };

  const playCompletionBell = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // Sacred Solfeggio 528Hz bell chime
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 4.0);
    } catch (e) {
      // ignore
    }
  };

  const toggleTimer = () => {
    if (isActive) {
      setIsActive(false);
      stopBinauralAudio();
    } else {
      if (timeLeft === 0) setTimeLeft(durationMinutes * 60);
      setIsActive(true);
      setIsCompleted(false);
      startBinauralAudio();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsCompleted(false);
    setTimeLeft(durationMinutes * 60);
    stopBinauralAudio();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = ((durationMinutes * 60 - timeLeft) / (durationMinutes * 60)) * 100;

  return (
    <div className="bg-gradient-to-br from-amber-950/80 via-stone-900/90 to-black border border-amber-500/30 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex justify-between items-center mb-3 border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30">
            <Flame size={14} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
              {language === 'fr' ? "RITUEL D'ENCENSEMENT SYNCHRONE" : language === 'ha' ? "TIMIN TURARE DA ZIKIRI" : "SYNCHRONOUS INCENSE RITUAL"}
            </span>
            <h5 className="text-xs font-bold text-amber-200">
              {plantName} ({binauralFreq} Hz)
            </h5>
          </div>
        </div>

        {/* Mute button */}
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            if (gainRef.current && audioCtxRef.current) {
              gainRef.current.gain.setValueAtTime(!isMuted ? 0 : 0.12, audioCtxRef.current.currentTime);
            }
          }}
          className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-gray-300 border border-amber-500/20 cursor-pointer transition-colors"
        >
          {isMuted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} className="text-amber-400" />}
        </button>
      </div>

      {/* Animated Incense Smoke & Charcoal Embers Display */}
      <div className="flex flex-col items-center justify-center py-4 my-2 bg-black/60 border border-amber-500/20 rounded-xl relative overflow-hidden">
        {/* Animated Smoke Particles when active */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [-10, -70, -110],
                  x: [0, (i % 2 === 0 ? 15 : -15), 0],
                  opacity: [0, 0.6, 0],
                  scale: [0.8, 1.8, 2.5]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3 + i * 0.5,
                  delay: i * 0.4,
                  ease: "easeOut"
                }}
                className="absolute w-6 h-6 bg-amber-200/20 rounded-full blur-md"
              />
            ))}
          </div>
        )}

        {/* Burning Ember Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
          isActive 
            ? 'bg-gradient-to-t from-red-600 via-amber-500 to-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-pulse'
            : isCompleted
            ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
            : 'bg-amber-950/80 border border-amber-500/30'
        }`}>
          {isCompleted ? (
            <Bell size={20} className="text-white animate-bounce" />
          ) : (
            <Flame size={20} className={isActive ? "text-white animate-bounce" : "text-amber-500/60"} />
          )}
        </div>

        {/* Countdown Digital Timer */}
        <div className="text-3xl font-mono font-black text-amber-200 tracking-wider">
          {formatTime(timeLeft)}
        </div>

        {/* Frequency & Oil Details */}
        <div className="mt-1 text-[10px] text-amber-400/90 font-mono flex items-center gap-1.5">
          <Sparkles size={10} />
          <span>{frequencyName || `${binauralFreq} Hz - Fréquence Harmonieuse`}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden border border-amber-500/20 mb-3">
        <motion.div
          className="bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-400 h-full rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Duration Selector & Timer Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-amber-500/20">
          {[1, 3, 5, 10].map((mins) => (
            <button
              key={mins}
              onClick={() => setDurationMinutes(mins)}
              disabled={isActive}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                durationMinutes === mins
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {mins} min
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTimer}
            className={`py-2 px-4 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all transform active:scale-95 shadow-md ${
              isActive
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black shadow-amber-500/20'
            }`}
          >
            {isActive ? (
              <>
                <Pause size={13} className="fill-current" />
                {language === 'fr' ? "Pause" : "Pause"}
              </>
            ) : (
              <>
                <Play size={13} className="fill-current" />
                {language === 'fr' ? "Démarrer la Fumigation" : "Start Fumigation"}
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-gray-300 border border-amber-500/20 cursor-pointer transition-colors"
            title="Réinitialiser"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Essential Oils & Usage Instruction */}
      {essentialOils && (
        <div className="mt-3 pt-2.5 border-t border-amber-500/15 text-[10px] text-gray-300 flex items-center gap-1.5">
          <Leaf size={11} className="text-emerald-400 shrink-0" />
          <span>
            <strong className="text-amber-300">{language === 'fr' ? "Huiles associées : " : "Associated oils: "}</strong>
            {essentialOils}
          </span>
        </div>
      )}
    </div>
  );
};
