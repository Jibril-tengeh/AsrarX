import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, Sparkles, X, Award, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { BarhatiahNameSecret } from '../../data/barhatiahSecrets';

// Pure Web Audio API Chime Synthesizer
const playChimeSound = (type: 'bead' | 'complete' = 'bead') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'bead') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else {
      // Golden singing bowl chord for completion
      const freqs = [528, 660, 792, 1056]; // Solfeggio 528Hz harmony
      freqs.forEach((freq) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, ctx.currentTime);
        g.gain.setValueAtTime(0.2, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 2.5);
      });
    }
  } catch (err) {
    // Silent fallback
  }
};

interface InteractiveTasbihModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName?: BarhatiahNameSecret | null;
  customTargetCount?: number;
  customTitle?: string;
}

export const InteractiveTasbihModal: React.FC<InteractiveTasbihModalProps> = ({
  isOpen,
  onClose,
  targetName,
  customTargetCount,
  customTitle,
}) => {
  const { language } = useLanguage();
  const targetCount = customTargetCount || targetName?.abjadWeight || 100;
  const titleAr = targetName ? targetName.nameAr : (customTitle || 'الذِّكْرُ المُمَيَّزُ');
  const titleFr = targetName ? targetName.nameTranslit : (customTitle || 'Tasbih Intelligent Barhatiah');

  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speedMs, setSpeedMs] = useState(1200); // 1.2s per zikr
  const [isCompleted, setIsCompleted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger increment
  const handleIncrement = () => {
    if (count >= targetCount) return;

    const nextCount = count + 1;
    setCount(nextCount);

    if (soundEnabled) {
      playChimeSound('bead');
    }

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    if (nextCount >= targetCount) {
      setIsCompleted(true);
      setIsPlaying(false);
      if (soundEnabled) {
        playChimeSound('complete');
      }
    }
  };

  const handleReset = () => {
    setCount(0);
    setIsCompleted(false);
    setIsPlaying(false);
  };

  // Auto Play Mode
  useEffect(() => {
    if (isPlaying && count < targetCount) {
      timerRef.current = setInterval(() => {
        setCount((prev) => {
          if (prev >= targetCount - 1) {
            setIsCompleted(true);
            setIsPlaying(false);
            if (soundEnabled) playChimeSound('complete');
            return targetCount;
          }
          if (soundEnabled) playChimeSound('bead');
          return prev + 1;
        });
      }, speedMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, count, targetCount, speedMs, soundEnabled]);

  if (!isOpen) return null;

  const progressPercentage = Math.min(100, Math.round((count / targetCount) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md p-6 bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-3xl border-2 border-amber-500/50 shadow-2xl text-white space-y-6"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center space-y-1 pr-6">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-full border border-amber-500/30">
              {language === 'ha' ? 'Tasbih na Barhatiah' : language === 'en' ? 'Smart Zikr Mode' : 'Tasbih Intelligent Barhatiah'}
            </span>
            <h3 className="text-2xl font-extrabold text-amber-300 font-arabic pt-1">
              {titleAr}
            </h3>
            <p className="text-xs text-gray-400">
              {titleFr}
            </p>
          </div>

          {/* Circular Counter Display */}
          <div className="flex flex-col items-center justify-center py-4">
            <div
              onClick={handleIncrement}
              className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-gray-950 via-amber-950/40 to-black border-4 border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.2)] flex flex-col items-center justify-center cursor-pointer select-none active:scale-95 transition-transform group"
            >
              {/* Outer Ring Progress */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="46%"
                  className="stroke-gray-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="46%"
                  className="stroke-amber-400 transition-all duration-300"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="290"
                  strokeDashoffset={290 - (290 * progressPercentage) / 100}
                  strokeLinecap="round"
                />
              </svg>

              <span className="text-4xl sm:text-5xl font-mono font-extrabold text-amber-300 group-hover:scale-105 transition-transform">
                {count}
              </span>
              <span className="text-xs font-mono text-gray-400 pt-1">
                / {targetCount} ({progressPercentage}%)
              </span>
              <span className="text-[10px] text-amber-400/80 font-semibold pt-2 uppercase tracking-wider">
                {language === 'ha' ? 'Taba domin Lissafi' : language === 'en' ? 'Tap to Count' : 'Appuyez pour compter'}
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-900 border border-gray-800">
            {/* Auto Play Button */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isCompleted}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 text-gray-950 shadow-lg'
                  : 'bg-gray-800 text-amber-300 hover:bg-gray-750'
              }`}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-gray-800 text-amber-300 hover:bg-gray-750 transition-all cursor-pointer"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-gray-800 text-amber-300 hover:bg-gray-750 transition-all cursor-pointer"
              title="Reset"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Auto-Play Speed Slider */}
          {isPlaying && (
            <div className="space-y-1 bg-black/60 p-3 rounded-xl border border-amber-500/30">
              <div className="flex items-center justify-between text-[10px] text-gray-300">
                <span>Auto-Speed:</span>
                <span className="font-mono text-amber-300 font-bold">{(speedMs / 1000).toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={speedMs}
                onChange={(e) => setSpeedMs(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500"
              />
            </div>
          )}

          {/* Completion Modal Overlay inside Tasbih */}
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-gray-950 text-center space-y-2 shadow-2xl"
            >
              <Award size={32} className="mx-auto text-gray-950" />
              <h4 className="text-lg font-extrabold">
                {language === 'ha' ? 'Mubarak! An Kammala Zikiri' : language === 'en' ? 'Mubarak! Recitation Completed' : 'Mubarak ! Récitation Complétée'}
              </h4>
              <p className="text-xs font-semibold">
                {language === 'ha'
                  ? `Kashin zikiri ${targetCount} an kammala shi cikin nasara.`
                  : language === 'en'
                  ? `The prescribed target count of ${targetCount} has been reached successfully.`
                  : `Le quota prescrit de ${targetCount} récitations a été atteint avec succès.`}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 px-4 py-2 bg-gray-950 text-amber-300 rounded-xl text-xs font-bold hover:bg-gray-900 transition-all cursor-pointer"
              >
                {language === 'ha' ? 'Sake Fara Zikiri' : language === 'en' ? 'Restart Zikr' : 'Recommencer le Zikr'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
