import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calculator,
  Clock,
  Activity,
  Compass,
  BookOpen,
  Star,
  Sparkles,
  Users,
  Key,
  Shield,
  Eye,
  Hexagon,
  Coins,
  Scale,
  Moon,
  ListTodo,
  Layers,
  Shuffle,
  Target,
  ChevronRight,
  ChevronLeft,
  X,
  Search,
  Share2,
  ShieldAlert,
  RefreshCw,
  History,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import { doc, onSnapshot } from "firebase/firestore";
import { db, isAutoSaveEnabled } from "../../lib/firebase";
import { tools } from "../../data/tools";
import { CelestialRecommendations } from "../../components/CelestialRecommendations";
import { DirectAbjadWidget } from "../../components/DirectAbjadWidget";
import { CalculationHistoryModal } from "../../components/CalculationHistoryModal";
import { getCalculationHistory } from "../../utils/calculationHistory";
import { checkFeatureAccess } from "../../utils/featureAccess";


import { BannerAd } from "../../components/BannerAd";

export const ToolsDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isPremium: isAuthPremium } = useAuth();
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"simple" | "advanced">(
    () => (localStorage.getItem("active_tools_tab") as "simple" | "advanced") || "simple"
  );

  useEffect(() => {
    const updateCount = () => {
      setHistoryCount(getCalculationHistory().length);
    };
    updateCount();
    window.addEventListener('calculation_history_updated', updateCount);
    return () => window.removeEventListener('calculation_history_updated', updateCount);
  }, []);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const minSwipeDistance = 45;

    // Check if horizontal swipe is dominant over vertical scroll
    if (Math.abs(distanceX) > minSwipeDistance && Math.abs(distanceX) > Math.abs(distanceY) * 1.2) {
      if (distanceX > 0) {
        // Swiped Left -> Switch to Advanced
        if (activeTab === "simple") {
          setActiveTab("advanced");
        }
      } else {
        // Swiped Right -> Switch to Simple
        if (activeTab === "advanced") {
          setActiveTab("simple");
        }
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("active_tools_tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const savedScrollPos = localStorage.getItem("tools_scroll_pos");
    if (savedScrollPos) {
      const y = parseInt(savedScrollPos, 10);
      if (!isNaN(y)) {
        const timer = setTimeout(() => {
          window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      localStorage.setItem("tools_scroll_pos", String(window.scrollY));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [featureToggles, setFeatureToggles] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastToolId, setLastToolId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("asrarhub_last_tool");
    if (saved) {
      setLastToolId(saved);
    }
  }, []);

  const [premiumModalOpen, setPremiumModalOpen] = useState<{
    isOpen: boolean;
    title: string;
  }>({ isOpen: false, title: "" });

  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState<{
    isOpen: boolean;
    title: string;
  }>({ isOpen: false, title: "" });

  const [blockedModalOpen, setBlockedModalOpen] = useState<{
    isOpen: boolean;
    title: string;
  }>({ isOpen: false, title: "" });

  useEffect(() => {
    const hasSeenGuide = true;

    if (!hasSeenGuide) {
      setShowGuide(true);
    }

    const unsubscribeFeatures = onSnapshot(
      doc(db, "settings", "features"),
      (docSnap) => {
        if (docSnap.exists()) {
          setFeatureToggles(docSnap.data());
        } else {
          setFeatureToggles({});
        }
        setIsLoading(false);
      },
      (error) => {
        console.warn("ToolsDashboard features onSnapshot error (operating offline):", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribeFeatures();
  }, [user]);

  const closeGuide = () => {
    setShowGuide(false);
    localStorage.setItem("hasSeenMysticToolsGuide", "true");
    sessionStorage.setItem("hasSeenMysticToolsGuide", "true");
    if (user && isAutoSaveEnabled()) {
      import('firebase/firestore').then(({ setDoc, doc }) => {
        setDoc(doc(db, 'users', user.uid), { hasSeenMysticToolsGuide: true }, { merge: true }).catch(console.error);
      });
    }
  };

  const guideSteps = [
    {
      title: t(
        "toolsDashboard.guide.welcomeTitle",
        "Bienvenue dans les Outils Mystiques",
      ),
      description: t(
        "toolsDashboard.guide.welcomeDesc",
        "Ce tableau de bord regroupe des outils professionnels pour l'étude et la pratique spirituelle. Suivez ce guide pour découvrir comment les utiliser efficacement.",
      ),
      icon: Compass,
      color: "text-emerald-500",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: t("toolsDashboard.guide.abjadTitle", "Calculateur Abjad"),
      description: t(
        "toolsDashboard.guide.abjadDesc",
        "Le calcul du poids mystique (Adad) est la base de toute opération. Utilisez cet outil pour convertir vos noms ou invocations en nombres selon différentes méthodes (Maghrébi, Machriqi).",
      ),
      icon: Calculator,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: t("toolsDashboard.guide.khatimTitle", "Générateur de Khatim"),
      description: t(
        "toolsDashboard.guide.khatimDesc",
        "Une fois le poids mystique connu, entrez-le dans le générateur de Khatim pour créer un carré magique (Wafq) 3x3 équilibré, prêt pour vos travaux spirituels.",
      ),
      icon: Hexagon,
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: t(
        "toolsDashboard.guide.namesTitle",
        "Extraction des Noms (Istikhraj)",
      ),
      description: t(
        "toolsDashboard.guide.namesDesc",
        "Utilisez les outils 'Générateur de Wird' ou 'Noms Divins Personnels' pour découvrir les Noms d'Allah qui correspondent exactement à votre poids mystique.",
      ),
      icon: Sparkles,
      color: "text-amber-500",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: t("toolsDashboard.guide.divineTitle", "Noms Divins et Coran"),
      description: t(
        "toolsDashboard.guide.divineDesc",
        "Explorez les 99 Noms d'Allah et leurs secrets. Utilisez le Coran pour vos récitations (Tilawa) et trouvez les versets appropriés à vos intentions.",
      ),
      icon: Star,
      color: "text-indigo-500",
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
    },

    {
      title: t("toolsDashboard.guide.zikrTitle", "Compteur de Zikr"),
      description: t(
        "toolsDashboard.guide.zikrDesc",
        "Une fois votre recette ou secret établi, utilisez notre Tasbih intelligent pour compter vos invocations avec précision tout en vous concentrant.",
      ),
      icon: Target,
      color: "text-cyan-500",
      bg: "bg-cyan-100 dark:bg-cyan-900/30",
    },
  ];

  const displayedTools = tools.filter((tool) => {
    const status = featureToggles[`tool_${tool.id}`] || "active";
    if (status === "inactive") return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const title = (
        t(`tools.${tool.id}.title`) !== `tools.${tool.id}.title`
          ? t(`tools.${tool.id}.title`)
          : tool.title
      ).toLowerCase();
      const desc = (
        t(`tools.${tool.id}.description`) !== `tools.${tool.id}.description`
          ? t(`tools.${tool.id}.description`)
          : tool.description
      ).toLowerCase();
      if (!title.includes(q) && !desc.includes(q)) return false;
    } else {
      if (tool.level !== activeTab) return false;
    }
    return true;
  });

  const handleShareTool = async (e: React.MouseEvent, tool: any) => {
    e.preventDefault();
    e.stopPropagation();
    const toolTitle = t(`tools.${tool.id}.title`) !== `tools.${tool.id}.title` ? t(`tools.${tool.id}.title`) : tool.title;
    const toolDesc = t(`tools.${tool.id}.description`) !== `tools.${tool.id}.description` ? t(`tools.${tool.id}.description`) : tool.description;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: toolTitle,
          text: `Découvrez l'outil "${toolTitle}" : ${toolDesc}`,
          url: `${window.location.origin}/tools/${tool.id}`,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Share error:", err);
        }
      }
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Découvrez l'outil "${toolTitle}" : ${toolDesc}`)} ${encodeURIComponent(`${window.location.origin}/tools/${tool.id}`)}`, '_blank');
    }
  };

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 safe-area-pt pb-24 w-full max-w-full overflow-x-hidden min-w-0 touch-pan-y"
    >
      <BannerAd />
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Compass className="text-emerald-500" />
          {t("toolsDashboard.title")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 mb-4">
          {t("toolsDashboard.description")}
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t("toolsDashboard.searchPlaceholder", "Rechercher un outil mystique (Abjad, Wafq, Noms...)")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 sm:py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm text-gray-900 dark:text-white shadow-xs transition-all outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                title="Effacer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
          >
            <History size={18} />
            <span>{language === 'ha' ? 'Tarihin Hisabi' : language === 'en' ? 'Calculation History' : 'Historique des Calculs'}</span>
            {historyCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-600 text-white">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <CalculationHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-3 relative">
        <button
          onClick={() => setActiveTab("simple")}
          className={`relative flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "simple" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
        >
          {activeTab === "simple" && (
            <motion.div
              layoutId="activeTabTools"
              className="absolute inset-0 bg-white dark:bg-gray-700 shadow-sm rounded-lg"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              style={{ zIndex: 0 }}
            />
          )}
          <span className="relative z-10">
            {t("toolsDashboard.simpleTools", "Outils Simples")}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("advanced")}
          className={`relative flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "advanced" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
        >
          {activeTab === "advanced" && (
            <motion.div
              layoutId="activeTabTools"
              className="absolute inset-0 bg-white dark:bg-gray-700 shadow-sm rounded-lg"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              style={{ zIndex: 0 }}
            />
          )}
          <span className="relative z-10">
            {t("toolsDashboard.advancedTools", "Outils Avancés")}
          </span>
        </button>
      </div>

      {/* Mobile Swipe Hint Indicator */}
      <div className="flex justify-center items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500 mb-6 select-none sm:hidden bg-gray-50 dark:bg-gray-800/50 py-1.5 px-3 rounded-full w-fit mx-auto border border-gray-200/50 dark:border-gray-700/50">
        <span className="text-emerald-500 font-bold animate-pulse">👈</span>
        <span>
          {language === 'fr'
            ? 'Balayez l\'écran pour basculer d\'outil'
            : language === 'ha'
            ? 'Goga allon domin sauya kayan aiki'
            : 'Swipe screen to switch tools'}
        </span>
        <span className="text-emerald-500 font-bold animate-pulse">👉</span>
      </div>

      {(() => {
        const lastTool = lastToolId ? tools.find(t => t.id === lastToolId) : null;
        if (!lastTool) return null;
        return (
          <div className="mb-8 p-5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br ${lastTool.color} text-white flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform`}>
                {React.createElement(lastTool.icon, { size: 24 })}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {t("tools.lastConsulted", "Dernier outil consulté")}
                </span>
                <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg mt-0.5">
                  {t(`tools.${lastTool.id}.title`) !== `tools.${lastTool.id}.title`
                    ? t(`tools.${lastTool.id}.title`)
                    : lastTool.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                  {t(`tools.${lastTool.id}.description`) !== `tools.${lastTool.id}.description`
                    ? t(`tools.${lastTool.id}.description`)
                    : lastTool.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(lastTool.path)}
              className="shrink-0 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
            >
              <span>{t("tools.resumePractice", "Reprendre la pratique")}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        );
      })()}

      {/* Direct Abjad Calculator Widget (Admin controllable) */}
      {featureToggles.direct_abjad_widget !== false &&
        featureToggles.tool_direct_abjad_widget !== 'inactive' &&
        featureToggles.tool_direct_abjad_widget !== 'disabled' && (
          <div className="mb-8">
            <DirectAbjadWidget />
          </div>
      )}

      <div className="mb-8">
        <CelestialRecommendations />
      </div>


      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(16,185,129,0.3),0_0_30px_rgba(0,0,0,0.2)] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border-2 border-emerald-500/30 dark:border-emerald-500/20 transform-gpu hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700/80 shrink-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10" style={{ transform: "translateZ(10px)" }}>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Compass size={18} />
                  </span>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                    Guide de Démarrage
                  </h3>
                </div>
                <button
                  onClick={closeGuide}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 sm:p-8 flex-1 overflow-y-auto min-h-[220px] sm:min-h-[260px] flex flex-col items-center justify-center text-center relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={guideStep}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="flex flex-col items-center"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <motion.div
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                      style={{ transform: "translateZ(30px)" }}
                      className={`w-24 h-24 rounded-3xl ${guideSteps[guideStep].bg} ${guideSteps[guideStep].color} flex items-center justify-center mb-6 shadow-xl border-2 border-white/40 dark:border-white/10`}
                    >
                      {React.createElement(guideSteps[guideStep].icon, {
                        size: 44,
                        className: "drop-shadow-md stroke-[2.2]"
                      })}
                    </motion.div>
                    <h4
                      style={{ transform: "translateZ(15px)" }}
                      className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight"
                    >
                      {guideSteps[guideStep].title}
                    </h4>
                    <p
                      style={{ transform: "translateZ(10px)" }}
                      className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base font-medium max-w-sm"
                    >
                      {guideSteps[guideStep].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="p-4 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-700/80 flex items-center justify-between" style={{ transform: "translateZ(10px)" }}>
                <div className="flex gap-2 items-center">
                  {guideSteps.map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        width: i === guideStep ? 24 : 8,
                        backgroundColor: i === guideStep ? "#10B981" : "#D1D5DB"
                      }}
                      className="h-2 rounded-full shadow-xs dark:bg-gray-700"
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setGuideStep(Math.max(0, guideStep - 1))}
                    disabled={guideStep === 0}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {guideStep < guideSteps.length - 1 ? (
                    <button
                      onClick={() => setGuideStep(guideStep + 1)}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all shadow-md shadow-emerald-600/25 active:scale-95 cursor-pointer border border-emerald-400/30"
                    >
                      Suivant
                      <ChevronRight size={16} className="stroke-[3]" />
                    </button>
                  ) : (
                    <button
                      onClick={closeGuide}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all shadow-lg shadow-emerald-600/30 active:scale-95 cursor-pointer border border-emerald-400/30"
                    >
                      Commencer
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-[180px] rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-150 dark:border-gray-700 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0"></div>
                  <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
                </div>
                <div className="space-y-2.5">
                  <div className="h-3.5 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
                  <div className="h-3.5 w-5/6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-2">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === "advanced" ? 25 : -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {displayedTools.map((tool, index) => {
              const toolTitle = t(`tools.${tool.id}.title`) !== `tools.${tool.id}.title` ? t(`tools.${tool.id}.title`) : tool.title;
              const accessResult = checkFeatureAccess(tool.id, toolTitle, featureToggles, user, isAuthPremium);
              
              const isMaintenance = accessResult.restrictionType === "maintenance";
              const isPremium = accessResult.status === "premium";
              const isBlockedForUser = !accessResult.allowed && (accessResult.restrictionType === "blocked" || accessResult.restrictionType === "phone_blocked");
              const isAllowed = accessResult.allowed;

              const content = (
                <div
                  className={`h-full w-full max-w-full min-w-0 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-all duration-300 relative overflow-hidden group ${!tool.comingSoon && isAllowed ? "hover:shadow-md hover:-translate-y-1" : "opacity-80"}`}
                >
                  {/* Background Decoration */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} rounded-bl-full opacity-10 transition-opacity ${!tool.comingSoon && isAllowed ? "group-hover:opacity-20" : ""}`}
                  ></div>

                  <div className="relative z-10 flex flex-col h-full min-w-0">
                    <div className="flex items-center gap-3 mb-2 min-w-0">
                      <div
                        className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center shadow-sm ${!tool.comingSoon && isAllowed ? "group-hover:scale-110 transition-transform relative" : "relative"}`}
                      >
                        <tool.icon size={20} />
                        {isPremium && (
                          <div className="absolute -top-1 -right-1 bg-violet-500 text-white p-0.5 rounded-full shadow border border-white dark:border-gray-800">
                            <Sparkles size={10} />
                          </div>
                        )}
                      </div>
                      <h3 className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 leading-tight min-w-0 break-words flex-wrap">
                        {toolTitle}
                        {tool.comingSoon && (
                          <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-widest shrink-0">
                            Bientôt
                          </span>
                        )}
                        {isMaintenance && !tool.comingSoon && (
                          <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-widest shrink-0">
                            Maintenance
                          </span>
                        )}
                        {isBlockedForUser && !tool.comingSoon && (
                          <span className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-widest shrink-0">
                            {language === 'fr' ? 'Bloqué' : language === 'ha' ? 'Kulle' : 'Blocked'}
                          </span>
                        )}
                        {isPremium && !tool.comingSoon && !isMaintenance && !isBlockedForUser && (
                          <span className="bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-widest shrink-0">
                            Premium
                          </span>
                        )}
                      </h3>
                    </div>

                    <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-3">
                      {t(`tools.${tool.id}.description`) !==
                      `tools.${tool.id}.description`
                        ? t(`tools.${tool.id}.description`)
                        : tool.description}
                    </p>
                    
                    <div className="mt-auto pt-4 flex justify-between items-center relative z-20">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        {t("tools.access", "Accéder")} →
                      </span>
                      {featureToggles.share_tools_enabled !== false && (
                        <button
                          onClick={(e) => handleShareTool(e, tool)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Partager l'outil"
                        >
                          <Share2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );

              return (
                <motion.div
                  layout
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  {tool.comingSoon ? (
                    <div className="cursor-not-allowed">{content}</div>
                  ) : (
                    <div
                      onClick={() => {
                        if (isBlockedForUser) {
                          setBlockedModalOpen({
                            isOpen: true,
                            title: toolTitle,
                          });
                        } else if (isMaintenance) {
                          setMaintenanceModalOpen({
                            isOpen: true,
                            title: toolTitle,
                          });
                        } else if (accessResult.restrictionType === 'premium') {
                          setPremiumModalOpen({
                            isOpen: true,
                            title: toolTitle,
                          });
                        } else {
                          navigate(tool.path);
                        }
                      }}
                      className="block h-full cursor-pointer"
                    >
                      {content}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Premium Access Modal */}
      {premiumModalOpen.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center shadow-lg mb-6 shadow-violet-500/30">
              <Sparkles size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {premiumModalOpen.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Cet outil est réservé aux membres Premium. Débloquez-le pour y
              accéder.
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() =>
                  setPremiumModalOpen({ isOpen: false, title: "" })
                }
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => navigate("/payment")}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold hover:from-amber-500 hover:to-orange-600 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                Débloquer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Modal */}
      {maintenanceModalOpen.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center border border-amber-100 dark:border-amber-900/30"
          >
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
              <RefreshCw size={32} className="animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {maintenanceModalOpen.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-sm">
              {language === 'fr' 
                ? 'Cet outil est actuellement en maintenance pour des améliorations techniques ou spirituelles. Veuillez réessayer plus tard.'
                : language === 'ha'
                ? 'Wannan kayan aiki yana fuskantar gyara a halin yanzu. Da fatan za a sake gwadawa daga baya.'
                : 'This tool is currently undergoing maintenance for technical or spiritual improvements. Please try again later.'}
            </p>
            <button
              onClick={() => setMaintenanceModalOpen({ isOpen: false, title: "" })}
              className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {language === 'fr' ? 'Fermer' : language === 'ha' ? 'Rufe' : 'Close'}
            </button>
          </motion.div>
        </div>
      )}

      {/* Blocked Tool Modal */}
      {blockedModalOpen.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center border border-red-100 dark:border-red-900/30"
          >
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-6">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {blockedModalOpen.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-sm">
              {language === 'fr' 
                ? 'L\'accès à cette fonctionnalité ou outil spirituel est bloqué pour votre compte. Veuillez contacter l\'administrateur.'
                : language === 'ha'
                ? 'An rufe damar shiga wannan kayan aiki ga asusunka. Da fatan za a tuntuɓi mai gudanarwa.'
                : 'Access to this feature or spiritual tool is blocked for your account. Please contact the administrator.'}
            </p>
            <button
              onClick={() => setBlockedModalOpen({ isOpen: false, title: "" })}
              className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {language === 'fr' ? 'Fermer' : language === 'ha' ? 'Rufe' : 'Close'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ToolsDashboard;
