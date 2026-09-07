import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Crown, 
  Sparkles, 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  Zap, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ArrowRight, 
  Star,
  Flame,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Secret3DVideoPaywallCardProps {
  title?: string;
  description?: string;
  buttonText?: string;
  secretTitle?: string;
  className?: string;
}

const ARABIC_LETTERS = ['ا', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ن', 'س', 'ع', 'ف', 'ص', 'ق', 'ر', 'ش', 'ت', 'ث', 'خ', 'ذ', 'ض', 'ظ', 'غ'];

export const Secret3DVideoPaywallCard: React.FC<Secret3DVideoPaywallCardProps> = ({
  title,
  description,
  buttonText,
  secretTitle,
  className = ''
}) => {
  const { language, t } = useLanguage();

  // Card reference & 3D Tilt states
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Localized defaults
  const displayTitle = title || t("secretDetail.unlockSecretTitle", "Révélez le Secret Complet");
  const displayDesc = description || t(
    "secretDetail.unlockSecretDesc",
    "La suite de ce secret (les formules exactes, la méthode d'activation spirituelle et les détails de pratique) est réservée aux membres Premium de l'AsrarHub."
  );
  const displayBtn = buttonText || t("secretDetail.unlockSecretBtn", "Passer au Premium");

  // Feature highlights locked inside this secret
  const lockedFeatures = [
    {
      icon: KeyRound,
      labelFr: "Formules & Nombres Sacrés complets",
      labelEn: "Complete Sacred Formulas & Numbers",
      labelHa: "Cikakkun Kalmomi da Lissafin Asirai"
    },
    {
      icon: Zap,
      labelFr: "Protocole d'activation théurgique exact",
      labelEn: "Exact Theurgic Activation Protocol",
      labelHa: "Hanyar Kunnawa da Fara Aiki Na Asali"
    },
    {
      icon: ShieldCheck,
      labelFr: "Rituels de protection & heures propices",
      labelEn: "Protective Rituals & Auspicious Hours",
      labelHa: "Kariya ta Musamman da Sa'o'in Aiki"
    }
  ];

  // Harmonious sound chime (528 Hz - Miracle / Transformation frequency)
  const playHarmonicChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1056, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // Audio not supported or blocked
    }
  };

  // 3D Tilt calculation based on cursor or touch
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
    const rotateY = ((x - centerX) / centerX) * 10;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY, isHovered: true });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = card.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });
  };

  // Video autoplay with safe fallback
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => setIsVideoLoaded(true))
          .catch(() => setIsVideoError(true));
      }
    }
  }, [isMuted]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Dynamic particle canvas (radiant golden particles and celestial Arabic glyphs)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      char?: string;
      color: string;
      pulse: number;
    }> = [];

    const count = 35;
    for (let i = 0; i < count; i++) {
      const isChar = i % 3 === 0;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 0.8 + 0.3), // Float upwards like sacred embers
        size: isChar ? 14 : Math.random() * 3 + 1.5,
        alpha: Math.random() * 0.6 + 0.2,
        char: isChar ? ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)] : undefined,
        color: '#fbbf24', // Amber/Gold
        pulse: Math.random() * Math.PI * 2
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (!isPaused) {
          p.x += p.vx;
          p.y += p.vy;
          p.pulse += 0.03;

          if (p.y < -20) p.y = height + 20;
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
        }

        const dynamicAlpha = Math.max(0.1, Math.sin(p.pulse) * 0.35 + p.alpha);

        if (p.char) {
          ctx.save();
          ctx.font = 'bold 15px "Amiri", "Traditional Arabic", serif';
          ctx.fillStyle = `rgba(251, 191, 36, ${dynamicAlpha * 0.7})`;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 10;
          ctx.fillText(p.char, p.x, p.y);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(252, 211, 77, ${dynamicAlpha})`;
          ctx.shadowColor = '#d97706';
          ctx.shadowBlur = 12;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPaused]);

  return (
    <div 
      className={`my-8 sm:my-10 w-full perspective-[1200px] select-none ${className}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="relative w-full rounded-3xl sm:rounded-[32px] overflow-hidden border border-amber-400/50 dark:border-amber-500/40 shadow-[0_20px_60px_-15px_rgba(217,119,6,0.5)] dark:shadow-[0_25px_70px_-15px_rgba(245,158,11,0.35)] transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.isHovered ? 1.015 : 1}, ${tilt.isHovered ? 1.015 : 1}, 1)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Layer 0: Video and Visual Backgrounds */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Deep Luxurious Obsidian & Golden Amber Base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1c1206] via-[#2a1705] to-[#0d0903]" />

          {/* Real Looping HD Video: Golden Particles Floating in Air */}
          <video
            ref={videoRef}
            src="https://assets.mixkit.co/videos/preview/mixkit-golden-particles-floating-in-the-air-42358-large.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover mix-blend-screen transition-opacity duration-1000 ${
              isVideoLoaded && !isVideoError ? 'opacity-70' : 'opacity-0'
            }`}
            onLoadedData={() => setIsVideoLoaded(true)}
            onError={() => setIsVideoError(true)}
          />

          {/* Interactive Particle & Sacred Abjad Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full mix-blend-plus-lighter pointer-events-none"
          />

          {/* Rotating Sacred Talismanic Geometry Rings */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-amber-400/20 animate-spin opacity-40 pointer-events-none" style={{ animationDuration: '45s' }}>
            <div className="absolute inset-4 rounded-full border border-dashed border-amber-300/30" />
            <div className="absolute inset-10 rounded-full border border-amber-500/25" />
          </div>
          <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full border border-yellow-400/20 animate-spin opacity-35 pointer-events-none" style={{ animationDuration: '60s', animationDirection: 'reverse' }}>
            <div className="absolute inset-6 rounded-full border border-dashed border-yellow-300/25" />
          </div>

          {/* Soft Vignette & Radiant Core Glow */}
          <div className="absolute inset-0 bg-radial-[circle_at_50%_35%,rgba(245,158,11,0.25)_0%,transparent_65%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60" />
        </div>

        {/* 3D Specular Glare / Holographic Foil Highlight */}
        <div
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 rounded-3xl"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.18) 0%, rgba(251, 191, 36, 0.08) 35%, transparent 70%)`,
            opacity: tilt.isHovered ? 1 : 0.4,
          }}
        />

        {/* Floating Controls Bar (Video play/pause, Mute) */}
        <div className="relative z-30 px-5 sm:px-7 pt-5 flex items-center justify-between gap-3">
          {/* VIP Live Badge */}
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/40 shadow-lg"
            style={{ transform: 'translateZ(30px)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              {language === 'fr' ? 'Accès Sacré Réservé' : language === 'ha' ? 'Kebantaccen Asiri' : 'Sacred VIP Reserve'}
            </span>
          </div>

          {/* Discreet Media Controls */}
          <div 
            className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/10"
            style={{ transform: 'translateZ(30px)' }}
          >
            <button
              type="button"
              onClick={togglePlay}
              className="p-1 text-amber-200/80 hover:text-amber-100 transition-colors cursor-pointer"
              title={isPaused ? "Lancer l'ambiance vidéo" : "Mettre en pause"}
              aria-label="Pause ou lecture de la vidéo"
            >
              {isPaused ? <Play size={13} /> : <Pause size={13} />}
            </button>
            <div className="w-[1px] h-3 bg-white/20" />
            <button
              type="button"
              onClick={toggleMute}
              className="p-1 text-amber-200/80 hover:text-amber-100 transition-colors cursor-pointer"
              title={isMuted ? "Activer le son" : "Couper le son"}
              aria-label="Couper ou activer le son"
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
          </div>
        </div>

        {/* Content Body with 3D Depth Hierarchy */}
        <div className="relative z-20 px-5 sm:px-8 pt-4 pb-7 sm:pb-8 flex flex-col items-center text-center">
          
          {/* 3D Holographic Crown Medallion */}
          <div 
            className="relative mb-4 group cursor-pointer"
            style={{ transform: 'translateZ(45px)' }}
            onClick={playHarmonicChime}
          >
            {/* Pulsing Light Rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 blur-xl opacity-60 animate-pulse pointer-events-none" />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-700 p-0.5 shadow-2xl shadow-amber-500/50 flex items-center justify-center border border-yellow-200/40">
              <div className="w-full h-full rounded-[22px] sm:rounded-[30px] bg-gradient-to-br from-black/80 via-amber-950/70 to-black/90 backdrop-blur-md flex items-center justify-center">
                <Crown size={32} className="text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.8)] animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
            </div>
            {/* Sparkle orbiting badge */}
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-black p-1 rounded-full shadow-md border border-white">
              <Sparkles size={12} className="animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>

          {/* Title */}
          <div style={{ transform: 'translateZ(35px)' }}>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white mb-2 drop-shadow-md">
              <span className="bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                {displayTitle}
              </span>
            </h3>

            {secretTitle && (
              <p className="text-xs sm:text-sm font-semibold text-amber-200/80 mb-2 font-mono">
                « {secretTitle} »
              </p>
            )}

            {/* Description */}
            <p className="text-gray-200/95 max-w-xl text-xs sm:text-sm sm:leading-relaxed leading-normal mb-5 drop-shadow-sm font-medium">
              {displayDesc}
            </p>
          </div>

          {/* Holographic 3D Locked Perks Checklist */}
          <div 
            className="w-full max-w-md grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 mb-6"
            style={{ transform: 'translateZ(25px)' }}
          >
            {lockedFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              const featLabel = language === 'fr' 
                ? feat.labelFr 
                : language === 'ha' 
                ? feat.labelHa 
                : feat.labelEn;
              return (
                <div 
                  key={idx}
                  className="flex items-center sm:flex-col sm:text-center gap-2 p-2.5 rounded-xl bg-white/5 dark:bg-black/40 backdrop-blur-md border border-amber-400/20 hover:border-amber-400/40 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
                    <Icon size={14} />
                  </div>
                  <span className="text-[11px] sm:text-[10px] font-bold text-gray-200 leading-tight">
                    {featLabel}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 3D Action Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md"
            style={{ transform: 'translateZ(55px)' }}
          >
            {/* Primary Golden High-Impact CTA */}
            <Link
              to="/payment"
              onClick={playHarmonicChime}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl font-black text-sm sm:text-base text-gray-950 overflow-hidden shadow-[0_10px_35px_-5px_rgba(245,158,11,0.7)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #fef08a 0%, #fbbf24 45%, #d97706 100%)',
              }}
            >
              {/* Shimmer Light Sweeping Ray */}
              <div 
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                  width: '200%',
                }}
              />

              <Crown size={19} className="text-amber-950 fill-amber-900 group-hover:rotate-12 transition-transform shrink-0" />
              <span className="tracking-wide">{displayBtn}</span>
              <ArrowRight size={17} className="text-amber-950 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>

            {/* Secondary Promo/Alternative Activation Option */}
            <Link
              to="/payment?tab=promo"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 hover:text-white border border-amber-300/30 text-xs font-bold transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Tag size={13} className="text-amber-400" />
              <span>{language === 'fr' ? "Code Promo ou Points" : language === 'ha' ? "Lambar Rangwame" : "Promo Code or Points"}</span>
            </Link>
          </div>

          {/* Guarantee / Sacred Safe Seal */}
          <div 
            className="mt-4 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-amber-300/70 font-medium"
            style={{ transform: 'translateZ(20px)' }}
          >
            <ShieldCheck size={12} className="text-amber-400" />
            <span>
              {language === 'fr' 
                ? "Accès immédiat & illimité • Paiement 100% sécurisé" 
                : language === 'ha' 
                ? "Bude nan take • Tsaro 100%" 
                : "Instant & Unlimited Access • 100% Secure"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
