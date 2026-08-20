import React, { useRef, useEffect, useState } from 'react';
import { VideoCardPreset } from '../../types/updateCards';

interface VideoCardBackgroundProps {
  preset: VideoCardPreset;
  className?: string;
  isPaused?: boolean;
}

const ARABIC_LETTERS = ['ا', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ن', 'س', 'ع', 'ف', 'ص', 'ق', 'ر', 'ش', 'ت', 'ث', 'خ', 'ذ', 'ض', 'ظ', 'غ'];

export const VideoCardBackground: React.FC<VideoCardBackgroundProps> = ({
  preset,
  className = '',
  isPaused = false
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Play video with safe fallback
  useEffect(() => {
    setVideoLoaded(false);
    setVideoError(false);

    if (videoRef.current && preset.videoUrl) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setVideoLoaded(true))
          .catch((err) => {
            console.log("Video autoplay prevented or network error, falling back to dynamic canvas:", err);
            setVideoError(true);
          });
      }
    }
  }, [preset.videoUrl, preset.id]);

  // Procedural Canvas Particles for ultra-smooth fluid dynamics
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

    // Generate Particles based on preset type
    const particleCount = preset.particleType === 'abjad-glyphs' ? 24 : 45;
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
      angle?: number;
      rotSpeed?: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const char = ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (preset.particleType === 'warp-lines' ? 4 : 0.8),
        vy: preset.particleType === 'sand-sparks' || preset.particleType === 'solar-plasma'
          ? -(Math.random() * 1.5 + 0.5)
          : (Math.random() - 0.5) * 0.8,
        size: Math.random() * 4 + 1.5,
        alpha: Math.random() * 0.7 + 0.3,
        char,
        color: preset.accentColor,
        pulse: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Draw background radiant radial glow
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        width * 0.75
      );
      grad.addColorStop(0, `${preset.accentColor}25`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw geometric or particle motifs
      particles.forEach((p) => {
        if (!isPaused) {
          p.x += p.vx;
          p.y += p.vy;
          p.pulse += 0.03;
          if (p.angle !== undefined && p.rotSpeed !== undefined) {
            p.angle += p.rotSpeed;
          }

          // Boundary wrapping
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }

        const dynamicAlpha = Math.max(0.15, Math.sin(p.pulse) * 0.3 + p.alpha);

        if (preset.particleType === 'abjad-glyphs' && p.char) {
          ctx.save();
          ctx.translate(p.x, p.y);
          if (p.angle !== undefined) ctx.rotate(p.angle);
          ctx.font = 'bold 16px "Amiri", "Traditional Arabic", serif';
          ctx.fillStyle = `${p.color}${Math.floor(dynamicAlpha * 255).toString(16).padStart(2, '0')}`;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          ctx.fillText(p.char, 0, 0);
          ctx.restore();
        } else if (preset.particleType === 'warp-lines') {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 15, p.y - p.vy * 15);
          ctx.strokeStyle = `${p.color}${Math.floor(dynamicAlpha * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = p.size * 0.8;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.stroke();
        } else if (preset.particleType === 'gold-dust' || preset.particleType === 'amethyst-gems') {
          ctx.save();
          ctx.translate(p.x, p.y);
          if (p.angle !== undefined) ctx.rotate(p.angle);
          ctx.beginPath();
          // Draw diamond shape
          ctx.moveTo(0, -p.size * 1.6);
          ctx.lineTo(p.size * 1.2, 0);
          ctx.lineTo(0, p.size * 1.6);
          ctx.lineTo(-p.size * 1.2, 0);
          ctx.closePath();
          ctx.fillStyle = `${p.color}${Math.floor(dynamicAlpha * 255).toString(16).padStart(2, '0')}`;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        } else {
          // Standard glowing circle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (Math.sin(p.pulse) * 0.3 + 1), 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.floor(dynamicAlpha * 255).toString(16).padStart(2, '0')}`;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
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
  }, [preset, isPaused]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Background Gradient base */}
      <div className={`absolute inset-0 bg-gradient-to-br ${preset.overlayGradient}`} />

      {/* HTML5 Video loop */}
      {preset.videoUrl && !videoError && (
        <video
          ref={videoRef}
          src={preset.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover mix-blend-screen transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-45' : 'opacity-0'
          }`}
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
        />
      )}

      {/* Dynamic Animated Canvas for Particles & Light Aura */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full mix-blend-plus-lighter pointer-events-none"
      />

      {/* Geometric Sacred Matrix Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(${preset.accentColor} 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Vignette border shadow */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%]" />
    </div>
  );
};
