import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, Star, CheckCircle2, Zap, X, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PremiumUnlockCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  promoCode?: string;
  durationText?: string;
  onComplete?: () => void;
}

export const PremiumUnlockCelebrationModal: React.FC<PremiumUnlockCelebrationProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  promoCode,
  durationText,
  onComplete
}) => {
  const { t } = useLanguage();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Play a luxurious harmonic chime using Web Audio API (like Canva Pro unlock chime)
  const playCanvaChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // Master gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.3, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // Chime notes (Majestic Pentatonic E-Major chord progression: E5, G#5, B5, E6, G#6)
      const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        // Envelope
        const startTime = ctx.currentTime + idx * 0.12;
        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.35, startTime + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + 2.0);
      });

      // Shimmer synth sweep
      const sweepOsc = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweepOsc.type = 'sine';
      sweepOsc.frequency.setValueAtTime(400, ctx.currentTime);
      sweepOsc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 1.2);

      sweepGain.gain.setValueAtTime(0, ctx.currentTime);
      sweepGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.3);
      sweepGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);

      sweepOsc.connect(sweepGain);
      sweepGain.connect(masterGain);
      sweepOsc.start(ctx.currentTime);
      sweepOsc.stop(ctx.currentTime + 1.7);
    } catch (e) {
      console.warn("Audio chime note:", e);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    playCanvaChime();

    // Setup canvas celebration particle system
    const canvas = canvasRef.current;
    let animId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      rotation: number;
      rotSpeed: number;
      type: 'circle' | 'star' | 'ribbon';
    }> = [];

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = [
          '#FBBF24', '#F59E0B', '#D97706', // Gold
          '#A855F7', '#8B5CF6', '#EC4899', // Canva Pro Purple & Magenta
          '#38BDF8', '#34D399', '#FFFFFF'  // Cyan, Mint, Sparkle White
        ];

        // Spawn initial burst of 140 particles
        for (let i = 0; i < 140; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 9;
          particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 80,
            y: canvas.height * 0.38 + (Math.random() - 0.5) * 60,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2.5,
            size: 4 + Math.random() * 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.2,
            type: Math.random() > 0.6 ? 'star' : Math.random() > 0.4 ? 'ribbon' : 'circle'
          });
        }

        const render = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.12; // Gravity
            p.vx *= 0.985; // Air friction
            p.alpha -= 0.005; // Fade out slowly
            p.rotation += p.rotSpeed;

            if (p.alpha <= 0) return;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;

            if (p.type === 'ribbon') {
              ctx.fillRect(-p.size, -p.size / 3, p.size * 2, p.size / 1.5);
            } else if (p.type === 'star') {
              // Draw small 4-point star
              ctx.beginPath();
              ctx.moveTo(0, -p.size);
              ctx.lineTo(p.size * 0.3, -p.size * 0.3);
              ctx.lineTo(p.size, 0);
              ctx.lineTo(p.size * 0.3, p.size * 0.3);
              ctx.lineTo(0, p.size);
              ctx.lineTo(-p.size * 0.3, p.size * 0.3);
              ctx.lineTo(-p.size, 0);
              ctx.lineTo(-p.size * 0.3, -p.size * 0.3);
              ctx.closePath();
              ctx.fill();
            } else {
              ctx.beginPath();
              ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.restore();
          });

          // Continuously add soft ambient twinkling stars around
          if (Math.random() > 0.3 && particles.length < 220) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height * 0.8,
              vx: (Math.random() - 0.5) * 1.5,
              vy: Math.random() * 1.5 + 0.5,
              size: 2 + Math.random() * 5,
              color: colors[Math.floor(Math.random() * colors.length)],
              alpha: 0.9,
              rotation: Math.random() * Math.PI,
              rotSpeed: 0.05,
              type: 'star'
            });
          }

          particles = particles.filter(p => p.alpha > 0);
          animId = requestAnimationFrame(render);
        };

        animId = requestAnimationFrame(render);
      }
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isOpen]);

  const handleFinish = () => {
    onClose();
    if (onComplete) {
      onComplete();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="canva-premium-unlock-video-modal"
        className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden bg-slate-950/90 backdrop-blur-2xl select-none"
      >
        {/* Confetti & Particle Canvas overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-10 w-full h-full"
        />

        {/* Ambient Volumetric Rays & Glowing Gradients (Canva Pro cinematic vibe) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-purple-600/35 via-amber-500/30 to-indigo-600/30 rounded-full blur-[110px] animate-pulse duration-1000" />
          <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-amber-400/25 rounded-full blur-[90px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-violet-600/30 rounded-full blur-[100px]" />
          
          {/* Animated Rotating Light Rays */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-25 animate-[spin_18s_linear_infinite]">
            <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0_30deg,rgba(251,191,36,0.35)_35deg,transparent_40deg_80deg,rgba(168,85,247,0.35)_85deg,transparent_90deg_140deg,rgba(251,191,36,0.35)_145deg,transparent_150deg_200deg,rgba(168,85,247,0.35)_205deg,transparent_210deg_260deg,rgba(251,191,36,0.35)_265deg,transparent_270deg_320deg,rgba(168,85,247,0.35)_325deg,transparent_330deg_360deg)]" />
          </div>
        </div>

        {/* Top Controls: Sound toggle & Instant close */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-md transition-all border border-white/10"
            title={soundEnabled ? "Couper le son" : "Activer le son"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            type="button"
            onClick={handleFinish}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-md transition-all border border-white/10"
            title="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main Cinematic Video/Celebration Card */}
        <motion.div
          initial={{ scale: 0.65, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 220 }}
          className="relative z-20 w-full max-w-xl mx-4 p-7 sm:p-10 rounded-[36px] bg-gradient-to-b from-slate-900/90 via-slate-900/95 to-slate-950/95 border border-amber-400/40 shadow-[0_0_80px_rgba(245,158,11,0.35),0_0_120px_rgba(147,51,234,0.3)] text-center text-white backdrop-blur-3xl overflow-hidden"
        >
          {/* Glass Card Top Glow Line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-purple-500 to-amber-300 animate-pulse" />

          {/* Canva-style 3D Crown & Burst Badge */}
          <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 mb-6 flex items-center justify-center">
            {/* Concentric expanding glow rings */}
            <motion.div
              animate={{ scale: [1, 1.45, 1], opacity: [0.7, 0.15, 0.7] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/40 to-purple-600/40 blur-md"
            />
            <motion.div
              animate={{ scale: [1, 1.25, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 rounded-full border border-dashed border-amber-300/40"
            />

            {/* Glowing Golden Shield Circle */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-purple-700 p-1 shadow-2xl flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 via-transparent to-purple-400/30" />
                
                {/* 3D Animated Crown */}
                <motion.div
                  initial={{ rotate: -15, scale: 0.5 }}
                  animate={{ rotate: [ -5, 5, -5 ], scale: [ 1, 1.12, 1 ] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative drop-shadow-[0_0_18px_rgba(251,191,36,0.9)]"
                >
                  <Crown className="w-12 h-12 sm:w-14 sm:h-14 text-amber-300 fill-amber-400 drop-shadow-md" />
                </motion.div>
              </div>
            </div>

            {/* Floating Sparkle Stars */}
            <motion.div
              animate={{ y: [-4, 4, -4], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="absolute -top-1 right-2 p-1.5 rounded-full bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/60"
            >
              <Sparkles size={16} />
            </motion.div>
            <motion.div
              animate={{ y: [4, -4, 4], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="absolute -bottom-1 left-2 p-1.5 rounded-full bg-purple-500 text-white shadow-lg shadow-purple-500/60"
            >
              <Star size={14} className="fill-white" />
            </motion.div>
          </div>

          {/* Canva Pro style "PREMIUM UNLOCKED" Ribbon Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 via-purple-500/25 to-amber-400/20 border border-amber-400/50 text-amber-300 font-black text-xs sm:text-sm tracking-widest uppercase mb-3 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
          >
            <Zap size={14} className="fill-amber-300 animate-bounce" />
            <span>{t('payment.canvaCelebrationBadge', '★ ACCÈS PREMIUM DÉBLOQUÉ ★')}</span>
            <Zap size={14} className="fill-amber-300 animate-bounce" />
          </motion.div>

          {/* Headline & Subtitle */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2 leading-tight drop-shadow-md"
          >
            {title || t('payment.canvaCelebrationTitle', 'Félicitations ! Vous êtes Membre VIP')}
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-sm sm:text-base text-gray-300 font-medium mb-6 max-w-md mx-auto leading-relaxed"
          >
            {subtitle || t('payment.canvaCelebrationSubtitle', 'Votre code promo a déverrouillé l\'intégralité des secrets spirituels, recettes exclusives et fonctionnalités VIP d\'AsrarHub.')}
          </motion.p>

          {/* Promo code tag pill if applicable */}
          {(promoCode || durationText) && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mb-6 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 text-xs sm:text-sm text-gray-200"
            >
              {promoCode && (
                <span className="font-mono font-black text-amber-300 bg-amber-400/15 px-2.5 py-1 rounded-lg border border-amber-400/30">
                  CODE: {promoCode}
                </span>
              )}
              {durationText && (
                <span className="font-bold text-purple-300 flex items-center gap-1">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  {durationText}
                </span>
              )}
            </motion.div>
          )}

          {/* Direct Continue Button (stays on screen until user clicks) */}
          <div className="flex items-center justify-center mt-2">
            <button
              type="button"
              onClick={handleFinish}
              className="w-full sm:w-auto min-w-[220px] px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-slate-950 font-black text-base sm:text-lg shadow-[0_10px_35px_rgba(245,158,11,0.45)] transform active:scale-95 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>{t('payment.canvaCelebrationContinue', 'Continuer')}</span>
              <ArrowRight size={20} className="stroke-[3]" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
