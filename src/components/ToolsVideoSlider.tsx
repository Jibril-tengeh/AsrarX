import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
  Crown,
  Compass,
  Star,
  BookOpen,
  ArrowRight,
  Flame,
  CheckCircle2,
  Bookmark,
  Layers,
  Wand2,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useFeatures } from "../contexts/FeatureContext";
import { useAuth } from "../contexts/AuthContext";
import { tools, ToolItem } from "../data/tools";

// Curated high quality cinematic spiritual looping video backgrounds
// with reliable CDNs and instant CSS/Canvas fallbacks
const VIDEO_PRESETS = [
  {
    id: "cosmic",
    name: "Cosmique Mystique",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
    poster: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-indigo-950/80 via-slate-900/85 to-purple-950/90",
    accentColor: "from-cyan-400 to-blue-500",
    borderColor: "border-cyan-500/30",
  },
  {
    id: "golden",
    name: "Lumière Dorée Sacrée",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-golden-particles-floating-slowly-41525-large.mp4",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-amber-950/85 via-stone-900/85 to-yellow-950/90",
    accentColor: "from-amber-400 to-yellow-500",
    borderColor: "border-amber-500/30",
  },
  {
    id: "emerald",
    name: "Aurore Émeraude",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-green-aurora-borealis-in-the-night-sky-40097-large.mp4",
    poster: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-emerald-950/85 via-teal-950/85 to-slate-900/90",
    accentColor: "from-emerald-400 to-teal-400",
    borderColor: "border-emerald-500/30",
  },
  {
    id: "twilight",
    name: "Nébuleuse Royale",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-starfield-in-space-41526-large.mp4",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-purple-950/85 via-fuchsia-950/80 to-slate-950/90",
    accentColor: "from-fuchsia-400 to-purple-400",
    borderColor: "border-purple-500/30",
  },
];

interface ToolsVideoSliderProps {
  className?: string;
}

export const ToolsVideoSlider: React.FC<ToolsVideoSliderProps> = ({ className = "" }) => {
  const { language, t } = useLanguage();
  const { featureToggles } = useFeatures();
  const { isPremium } = useAuth();
  const navigate = useNavigate();

  // Admin Feature Controls
  const isSliderEnabled = featureToggles?.tools_video_slider_enabled !== false;
  const autoplaySpeed = typeof featureToggles?.tools_slider_autoplay_speed === 'number' 
    ? featureToggles.tools_slider_autoplay_speed 
    : 6000; // 6 seconds default
  const isVideoBgActive = featureToggles?.tools_slider_video_bg !== false;
  const customVideoUrl = featureToggles?.tools_slider_custom_video_url || "";
  const filterSelection = featureToggles?.tools_slider_filter || "all"; // all, simple, advanced, popular
  const customTitle = featureToggles?.tools_slider_title || "";

  // Prepare tools list according to admin filter
  const filteredTools = useMemo(() => {
    let list = [...tools];
    if (filterSelection === "simple") {
      list = list.filter((t) => t.level === "simple");
    } else if (filterSelection === "advanced") {
      list = list.filter((t) => t.level === "advanced");
    } else if (filterSelection === "popular") {
      const popularIds = ["quran", "abjad", "tasbih", "daily-dhikr", "planetary", "asma", "99names", "dreams", "seals-catalogue", "advanced-raml-processing"];
      list = list.filter((t) => popularIds.includes(t.id));
    }
    return list.length > 0 ? list : tools;
  }, [filterSelection]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [savedTools, setSavedTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("asrarhub_saved_slider_tools");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const timerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-slide effect with pause on hover
  useEffect(() => {
    if (!isPlaying || isHovered || autoplaySpeed <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredTools.length);
    }, autoplaySpeed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, autoplaySpeed, filteredTools.length]);

  // If slider is disabled by Admin, don't render
  if (!isSliderEnabled || filteredTools.length === 0) {
    return null;
  }

  const currentTool = filteredTools[currentIndex] || filteredTools[0];
  const videoTheme = VIDEO_PRESETS[currentIndex % VIDEO_PRESETS.length];
  const activeVideoUrl = customVideoUrl || videoTheme.videoUrl;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? filteredTools.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % filteredTools.length);
  };

  const toggleBookmark = (e: React.MouseEvent, toolId: string) => {
    e.stopPropagation();
    setSavedTools((prev) => {
      const updated = prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      try {
        localStorage.setItem("asrarhub_saved_slider_tools", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const isSaved = savedTools.includes(currentTool.id);

  // Dynamic localized tool names & description
  const getToolTitle = (tool: ToolItem) => {
    const key = `tools.${tool.id}.title`;
    const translated = t(key);
    return translated !== key ? translated : tool.title;
  };

  const getToolDesc = (tool: ToolItem) => {
    const key = `tools.${tool.id}.desc`;
    const translated = t(key);
    return translated !== key ? translated : tool.description;
  };

  const getActionLabel = () => {
    if (language === 'fr') return "Ouvrir l'outil";
    if (language === 'ha') return "Bude Kayan Aiki";
    return "Launch Tool";
  };

  return (
    <section 
      id="tools-video-slider"
      className={`relative w-full mb-2 sm:mb-2.5 select-none pt-0.5 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slider Header / Bar */}
      <div className="flex items-center justify-between px-0.5 mb-1">
        <div className="flex items-center gap-2">
          <div className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Wand2 size={15} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>{customTitle || (language === 'fr' ? "Outils Spirituels" : language === 'ha' ? "Kayan Aikin Asrar" : "Spiritual Tools")}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                {currentIndex + 1}/{filteredTools.length}
              </span>
            </h3>
          </div>
        </div>

        {/* Play/Pause & Arrow Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 sm:p-1.5 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs transition-colors shadow-xs"
            title={isPlaying ? "Mettre en pause le slider" : "Reprendre la lecture automatique"}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <button
            onClick={handlePrev}
            className="p-1 sm:p-1.5 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors shadow-xs"
            aria-label="Previous tool"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={handleNext}
            className="p-1 sm:p-1.5 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors shadow-xs"
            aria-label="Next tool"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Main Video Slider Card with Gesture Dragging */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-gray-200/80 dark:border-gray-800 bg-gray-950 min-h-[160px] sm:min-h-[180px] flex flex-col justify-between">
        
        {/* Looping Background Video */}
        {isVideoBgActive && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <video
              ref={videoRef}
              key={activeVideoUrl}
              src={activeVideoUrl}
              poster={videoTheme.poster}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center opacity-45 sm:opacity-55 filter brightness-90 saturate-125 scale-105 transition-all duration-700"
            />
          </div>
        )}

        {/* Ambient Animated Gradient Overlays & Fallback Canvas Atmosphere */}
        <div className={`absolute inset-0 z-[1] bg-gradient-to-r ${videoTheme.gradient} backdrop-blur-[2px] transition-all duration-700`} />
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />

        {/* Animated Particles & Glow Lights */}
        <div className="absolute top-[-30%] -right-10 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-30%] -left-10 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none animate-pulse" />

        {/* Slide Content with Motion Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTool.id}
            initial={{ opacity: 0, x: 25, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -25, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 p-4 sm:p-5 flex flex-col justify-between flex-1"
          >
            {/* Top Bar: Tool Tag + Level Badge + Bookmark Button */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-xs">
                  <Sparkles size={11} className="text-amber-300 animate-spin" />
                  {currentTool.level === "advanced" ? (
                    <span className="text-amber-300">Khassa / Avancé</span>
                  ) : (
                    <span className="text-emerald-300">Essentiel</span>
                  )}
                </span>

                {currentTool.id === "quran" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                    <BookOpen size={10} /> Coran Complet
                  </span>
                )}
                {currentTool.id === "dreams" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/40">
                    <Wand2 size={10} /> IA Ibn Sirin
                  </span>
                )}
                {currentTool.id === "advanced-raml-processing" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/30 text-yellow-200 border border-yellow-400/40">
                    <Compass size={10} /> Sceau de Sable
                  </span>
                )}
              </div>

              {/* Bookmark Toggle */}
              <button
                onClick={(e) => toggleBookmark(e, currentTool.id)}
                className={`p-1.5 rounded-full backdrop-blur-md transition-all border ${
                  isSaved
                    ? "bg-amber-500 text-white border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                    : "bg-black/30 text-white/70 hover:text-white border-white/15 hover:bg-black/50"
                }`}
                title={isSaved ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Bookmark size={14} className={isSaved ? "fill-current" : ""} />
              </button>
            </div>

            {/* Middle Section: Icon + Title + Description */}
            <div className="flex items-start gap-3.5 my-auto">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 5 }}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${currentTool.color} p-0.5 shadow-lg flex-shrink-0 flex items-center justify-center border border-white/30`}
              >
                <div className="w-full h-full rounded-[14px] bg-black/25 flex items-center justify-center text-white backdrop-blur-xs">
                  {React.createElement(currentTool.icon, { size: 24, className: "drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" })}
                </div>
              </motion.div>

              <div className="flex-1 min-w-0">
                <h4 className="text-base sm:text-lg font-black text-white leading-tight tracking-tight drop-shadow-sm flex items-center gap-1.5 truncate">
                  {getToolTitle(currentTool)}
                </h4>
                <p className="text-xs sm:text-sm text-gray-200/90 mt-1 line-clamp-2 leading-relaxed">
                  {getToolDesc(currentTool)}
                </p>
              </div>
            </div>

            {/* Bottom Row: Direct Action Button */}
            <div className="flex items-center justify-between gap-3 pt-3 mt-2 border-t border-white/10">
              <div className="flex items-center gap-1 text-[11px] text-gray-300 font-medium hidden sm:flex">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Interactif & Rapide</span>
              </div>

              {/* Direct Open Button */}
              <Link
                to={currentTool.path}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 hover:shadow-emerald-500/25 transition-all transform active:scale-95 border border-emerald-400/40 group"
              >
                <span>{getActionLabel()}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Pagination Dots & Progress Bar */}
        <div className="relative z-10 px-4 pb-2.5 pt-1 flex items-center justify-center gap-1.5">
          {filteredTools.slice(0, Math.min(filteredTools.length, 12)).map((tool, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={tool.id}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-6 h-1.5 bg-gradient-to-r from-amber-400 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Aller à l'outil ${tool.title}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
