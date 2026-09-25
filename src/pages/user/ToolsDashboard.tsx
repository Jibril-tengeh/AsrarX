import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ChevronDown,
  X,
  Search,
  Share2,
  ShieldAlert,
  RefreshCw,
  History,
  CheckSquare,
  Square,
  Check,
  Folder,
  FolderPlus,
  Plus,
  Trash2,
  Battery,
  BatteryCharging,
  BatteryWarning,
  Zap,
  Bookmark,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import { useFeatures } from "../../contexts/FeatureContext";

import { db, isAutoSaveEnabled } from "../../lib/firebase";
import { tools } from "../../data/tools";
import { CalculationHistoryModal } from "../../components/CalculationHistoryModal";
import { getCalculationHistory } from "../../utils/calculationHistory";
import { checkFeatureAccess } from "../../utils/featureAccess";
import { PremiumLockScreen } from "../../components/PremiumLockScreen";
import { ToolShareModal, ToolShareData } from "../../components/tools/ToolShareModal";
import {
  getToolGroups,
  batchAddToolsToGroup,
  batchRemoveToolsFromGroup,
  toggleQuickAccessTool,
  isToolInQuickAccess,
  deleteCustomToolGroup,
  ToolGroup,
} from "../../utils/toolGroupsManager";
import {
  getFavoriteToolIds,
  toggleFavoriteTool,
  batchUpdateFavorites,
} from "../../utils/toolFavoritesManager";
import {
  getRecentTools,
  recordRecentTool,
  clearRecentTools,
  RecentToolItem,
} from "../../utils/toolRecentHistory";
import { RecentToolsShelf } from "../../components/tools/RecentToolsShelf";
import { useBatteryPerformance } from "../../hooks/useBatteryPerformance";
import { BatchCategoryModal } from "../../components/tools/BatchCategoryModal";
import {
  LowResourceBatteryModal,
  HighDrainAlertBanner,
} from "../../components/tools/LowResourceBatteryModal";

import { BannerAd } from "../../components/BannerAd";

export const ToolsDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isPremium: isAuthPremium } = useAuth();
  const { featureToggles } = useFeatures();
  const navigate = useNavigate();

  const [shareModalTool, setShareModalTool] = useState<ToolShareData | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"simple" | "advanced">(
    () => (localStorage.getItem("active_tools_tab") as "simple" | "advanced") || "simple"
  );
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastToolId, setLastToolId] = useState<string | null>(null);
  const [isLastToolOpen, setIsLastToolOpen] = useState(false);

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

  // Battery Performance Hook & Modal
  const {
    batteryLevel,
    isCharging,
    isLowResourceMode,
    highDrainDetected,
    drainRatePerHour,
    cpuLoadEstimate,
    longTasksCount,
    batteryLogs,
    setLowResourceMode,
    toggleLowResourceMode,
    dismissHighDrainAlert,
    clearBatteryLogs,
    simulateHighDrainTest,
  } = useBatteryPerformance();
  const [isBatteryModalOpen, setIsBatteryModalOpen] = useState(false);

  // Tool Groups & Batch Favorites
  const [toolGroups, setToolGroups] = useState<ToolGroup[]>(() => getToolGroups());
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [isBatchMode, setIsBatchMode] = useState<boolean>(false);
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [popToolId, setPopToolId] = useState<string | null>(null);

  // Favorites & 5 Recent Tools History
  const [favoriteToolIds, setFavoriteToolIds] = useState<string[]>(() => getFavoriteToolIds());
  const [recentTools, setRecentTools] = useState<RecentToolItem[]>(() => getRecentTools());
  const [bookmarkedArticlesCount, setBookmarkedArticlesCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem("asrar_bookmarks");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const handleGroupsUpdate = () => {
      setToolGroups(getToolGroups());
    };
    const handleFavUpdate = () => {
      setFavoriteToolIds(getFavoriteToolIds());
    };
    const handleRecentUpdate = () => {
      setRecentTools(getRecentTools());
    };
    const handleBookmarksUpdate = () => {
      try {
        const raw = localStorage.getItem("asrar_bookmarks");
        const parsed = raw ? JSON.parse(raw) : [];
        setBookmarkedArticlesCount(Array.isArray(parsed) ? parsed.length : 0);
      } catch {
        setBookmarkedArticlesCount(0);
      }
    };

    window.addEventListener("asrarhub_tool_groups_updated", handleGroupsUpdate);
    window.addEventListener("asrar_tool_favorites_updated", handleFavUpdate);
    window.addEventListener("asrarhub_recent_tools_updated", handleRecentUpdate);
    window.addEventListener("storage", handleBookmarksUpdate);
    window.addEventListener("asrar_bookmarks_updated", handleBookmarksUpdate);

    return () => {
      window.removeEventListener("asrarhub_tool_groups_updated", handleGroupsUpdate);
      window.removeEventListener("asrar_tool_favorites_updated", handleFavUpdate);
      window.removeEventListener("asrarhub_recent_tools_updated", handleRecentUpdate);
      window.removeEventListener("storage", handleBookmarksUpdate);
      window.removeEventListener("asrar_bookmarks_updated", handleBookmarksUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleFavorite = (toolId: string) => {
    const isNowFav = toggleFavoriteTool(toolId);
    setFavoriteToolIds(getFavoriteToolIds());

    // Synchronize with quick access group in toolGroupsManager
    const qaGroup = toolGroups.find((g) => g.id === "quick_access");
    if (qaGroup) {
      if (isNowFav && !qaGroup.toolIds.includes(toolId)) {
        batchAddToolsToGroup("quick_access", [toolId]);
      } else if (!isNowFav && qaGroup.toolIds.includes(toolId)) {
        batchRemoveToolsFromGroup("quick_access", [toolId]);
      }
      setToolGroups(getToolGroups());
    }

    if (isNowFav) {
      setPopToolId(toolId);
      setTimeout(() => setPopToolId(null), 850);
    }

    showToast(
      isNowFav
        ? language === "fr"
          ? "Outil ajouté aux favoris ⭐"
          : language === "ha"
          ? "An saka a cikin wadanda aka fi so ⭐"
          : "Tool added to favorites ⭐"
        : language === "fr"
        ? "Outil retiré des favoris"
        : language === "ha"
        ? "An cire daga wadanda aka fi so"
        : "Tool removed from favorites"
    );
  };

  const handleBatchFavorite = (shouldFavorite = true) => {
    if (selectedToolIds.length === 0) return;
    batchUpdateFavorites(selectedToolIds, shouldFavorite);
    if (shouldFavorite) {
      batchAddToolsToGroup("quick_access", selectedToolIds);
      if (selectedToolIds[0]) {
        setPopToolId(selectedToolIds[0]);
        setTimeout(() => setPopToolId(null), 850);
      }
    } else {
      batchRemoveToolsFromGroup("quick_access", selectedToolIds);
    }
    setFavoriteToolIds(getFavoriteToolIds());
    setToolGroups(getToolGroups());
    showToast(
      shouldFavorite
        ? language === "fr"
          ? `${selectedToolIds.length} outil(s) ajouté(s) aux favoris ⭐`
          : `${selectedToolIds.length} tool(s) added to favorites ⭐`
        : language === "fr"
        ? `${selectedToolIds.length} outil(s) retiré(s) des favoris`
        : `${selectedToolIds.length} tool(s) removed from favorites`
    );
    setSelectedToolIds([]);
    setIsBatchMode(false);
  };

  const handleBatchFavoriteQuickAccess = () => {
    handleBatchFavorite(true);
  };

  const handleBatchDeleteFromFavorites = () => {
    if (selectedToolIds.length === 0) return;
    const count = selectedToolIds.length;
    batchUpdateFavorites(selectedToolIds, false);
    batchRemoveToolsFromGroup("quick_access", selectedToolIds);
    if (
      activeCategoryFilter !== "all" &&
      activeCategoryFilter !== "favorites" &&
      activeCategoryFilter !== "quick_access"
    ) {
      batchRemoveToolsFromGroup(activeCategoryFilter, selectedToolIds);
    }
    setFavoriteToolIds(getFavoriteToolIds());
    setToolGroups(getToolGroups());
    showToast(
      language === "fr"
        ? `${count} outil(s) supprimé(s) des favoris 🗑️`
        : language === "ha"
        ? `An cire kayan aiki ${count} daga wadanda aka fi so 🗑️`
        : `${count} tool(s) removed from favorites 🗑️`
    );
    setSelectedToolIds([]);
    setIsBatchMode(false);
  };

  const handleBatchShare = async () => {
    if (selectedToolIds.length === 0) return;

    const selectedTools = tools.filter((t) => selectedToolIds.includes(t.id));
    if (selectedTools.length === 0) return;

    const toolNames = selectedTools
      .map((toolItem) => {
        const localizedTitle =
          t(`tools.${toolItem.id}.title`) !== `tools.${toolItem.id}.title`
            ? t(`tools.${toolItem.id}.title`)
            : toolItem.title;
        return `• ${localizedTitle}`;
      })
      .join("\n");

    const shareTitle =
      language === "fr"
        ? "Mes outils spirituels favoris - AsrarHub"
        : language === "ha"
        ? "Kayan aikin ruhaniya da aka fi so - AsrarHub"
        : "My Favorite Spiritual Tools - AsrarHub";

    const shareText =
      language === "fr"
        ? `Découvrez cette sélection de ${selectedTools.length} outil(s) spirituel(s) sur AsrarHub :\n\n${toolNames}\n\nExplorez-les sur :`
        : language === "ha"
        ? `Gano wannan tarin kayan aiki ${selectedTools.length} a AsrarHub:\n\n${toolNames}\n\nDuba su a:`
        : `Check out this selection of ${selectedTools.length} spiritual tool(s) on AsrarHub:\n\n${toolNames}\n\nExplore them at:`;

    const shareUrl = `${window.location.origin}/tools`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        showToast(
          language === "fr"
            ? "Collection d'outils partagée avec succès ! ✨"
            : language === "ha"
            ? "An raba tarin cikin nasara! ✨"
            : "Tools collection shared successfully! ✨"
        );
        return;
      } catch (err: any) {
        if (err.name === "AbortError") {
          // User canceled native share dialog
          return;
        }
        console.warn("Native Web Share failed, falling back to clipboard:", err);
      }
    }

    // Fallback: Copy to clipboard
    try {
      const fullClipboardText = `${shareTitle}\n\n${shareText}\n${shareUrl}`;
      await navigator.clipboard.writeText(fullClipboardText);
      showToast(
        language === "fr"
          ? "Lien et sélection copiés dans le presse-papier ! 📋"
          : language === "ha"
          ? "An kwafi hanyar haɗi da zabi a allon allo! 📋"
          : "Tools collection link copied to clipboard! 📋"
      );
    } catch (clipboardErr) {
      console.error("Clipboard copy failed:", clipboardErr);
      showToast(
        language === "fr"
          ? "Impossible de partager sur cet appareil"
          : "Unable to share on this device"
      );
    }
  };

  const handleOpenTool = (tool: any) => {
    recordRecentTool(tool.id);
    setRecentTools(getRecentTools());
    navigate(tool.path);
  };

  const handleClearRecent = () => {
    clearRecentTools();
    setRecentTools([]);
    showToast(
      language === "fr"
        ? "Historique des outils récents effacé"
        : "Recent tools history cleared"
    );
  };

  const handleBatchRemoveFromCurrentGroup = () => {
    if (selectedToolIds.length === 0 || activeCategoryFilter === "all") return;
    batchRemoveToolsFromGroup(activeCategoryFilter, selectedToolIds);
    setToolGroups(getToolGroups());
    showToast(
      language === "fr"
        ? `${selectedToolIds.length} outil(s) retiré(s) du groupe`
        : `${selectedToolIds.length} tool(s) removed from group`
    );
    setSelectedToolIds([]);
  };

  const handleSelectAllVisible = (visibleIds: string[]) => {
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedToolIds.includes(id));
    if (allSelected) {
      setSelectedToolIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedToolIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleSelectAll = () => {
    const visibleIds = displayedTools.map((t) => t.id);
    handleSelectAllVisible(visibleIds);
  };

  const toggleSelectTool = (toolId: string) => {
    setSelectedToolIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  useEffect(() => {
    const updateCount = () => {
      setHistoryCount(getCalculationHistory().length);
    };
    updateCount();
    window.addEventListener('calculation_history_updated', updateCount);
    return () => window.removeEventListener('calculation_history_updated', updateCount);
  }, []);

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

  useEffect(() => {
    const saved = localStorage.getItem("asrarhub_last_tool");
    if (saved) {
      setLastToolId(saved);
    }
  }, []);

  useEffect(() => {
    const hasSeenGuide = true;
    if (!hasSeenGuide) {
      setShowGuide(true);
    }
  }, [user]);

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

  const quickAccessGroup = toolGroups.find((g) => g.id === "quick_access");
  const quickAccessTools = (quickAccessGroup?.toolIds || [])
    .map((id) => tools.find((t) => t.id === id))
    .filter(Boolean) as typeof tools;

  const displayedTools = tools.filter((tool) => {
    const status = featureToggles[`tool_${tool.id}`] || "active";
    if (status === "inactive" || status === "disabled") return false;

    // Filter by selected category or group
    if (activeCategoryFilter === "favorites" || activeCategoryFilter === "quick_access") {
      if (!favoriteToolIds.includes(tool.id)) {
        return false;
      }
    } else if (activeCategoryFilter !== "all") {
      const currentGroup = toolGroups.find((g) => g.id === activeCategoryFilter);
      if (!currentGroup || !currentGroup.toolIds.includes(tool.id)) {
        return false;
      }
    }

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
    } else if (activeCategoryFilter === "all") {
      // Only filter by simple/advanced level tab if viewing all tools without search
      if (tool.level !== activeTab) return false;
    }
    return true;
  }).sort((a, b) => {
    const orderList: string[] = Array.isArray(featureToggles?.feature_nav_order)
      ? featureToggles.feature_nav_order
      : (Array.isArray(featureToggles?.tools_order) ? featureToggles.tools_order : []);
    if (orderList.length > 0) {
      const indexA = orderList.indexOf(a.id);
      const indexB = orderList.indexOf(b.id);
      const posA = indexA === -1 ? 9999 : indexA;
      const posB = indexB === -1 ? 9999 : indexB;
      if (posA !== posB) return posA - posB;
    }
    return 0;
  });

  const handleShareTool = async (e: React.MouseEvent, tool: any) => {
    e.preventDefault();
    e.stopPropagation();
    const toolTitle = t(`tools.${tool.id}.title`) !== `tools.${tool.id}.title` ? t(`tools.${tool.id}.title`) : tool.title;
    const toolDesc = t(`tools.${tool.id}.description`) !== `tools.${tool.id}.description` ? t(`tools.${tool.id}.description`) : tool.description;
    const toolActualPath = tool.path?.startsWith('/') ? tool.path : `/${tool.path || ''}`;
    const directToolUrl = `${window.location.origin}${toolActualPath}`;
    
    const sharePayload = {
      id: tool.id,
      title: toolTitle,
      description: toolDesc,
      path: toolActualPath,
      color: tool.color,
      icon: tool.icon
    };

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${toolTitle} - AsrarHub`,
          text: `Découvrez l'outil spirituel "${toolTitle}" sur AsrarHub : ${toolDesc}`,
          url: directToolUrl,
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // User intentionally closed native share dialog
          return;
        }
        console.warn("Native Web Share failed, falling back to modal:", err);
      }
    }

    // Fallback: Open friendly social share modal with copy link, WhatsApp, Telegram, etc.
    setShareModalTool(sharePayload);
    setIsShareModalOpen(true);
  };

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        paddingTop: `max(0px, calc(4px + var(--feed-tools-offset, 0px) + var(--feed-global-offset, 0px)))`
      }}
      className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pb-24 w-full max-w-full overflow-x-hidden min-w-0 touch-pan-y transition-all"
    >
      <div className="mb-3">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap sm:flex-nowrap">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <Compass className="text-emerald-500 w-5 h-5 sm:w-6 sm:h-6" />
            <span>{t("toolsDashboard.title")}</span>
          </h1>

          <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap">
            {/* Battery & Low Resource Mode Button */}
            <button
              type="button"
              onClick={() => setIsBatteryModalOpen(true)}
              className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0 border ${
                isLowResourceMode
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                  : batteryLevel !== null && batteryLevel <= 20 && !isCharging
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400"
                  : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750"
              }`}
              title={
                language === "fr"
                  ? "Moniteur de batterie & Mode basse consommation"
                  : language === "ha"
                  ? "Kula da batir & Yanayin adana makamashi"
                  : "Battery monitor & Low resource mode"
              }
            >
              {isCharging ? (
                <BatteryCharging size={15} className="text-emerald-500" />
              ) : batteryLevel !== null && batteryLevel <= 20 ? (
                <BatteryWarning size={15} className="text-amber-500" />
              ) : (
                <Battery size={15} />
              )}
              <span>{batteryLevel !== null ? `${batteryLevel}%` : "Éco"}</span>
              {isLowResourceMode && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            {/* Quick Favorites Shortcut Button */}
            <button
              type="button"
              onClick={() => {
                setActiveCategoryFilter(activeCategoryFilter === "favorites" ? "all" : "favorites");
              }}
              className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0 border ${
                activeCategoryFilter === "favorites"
                  ? "bg-amber-500 border-amber-500 text-gray-950 font-black"
                  : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30"
              }`}
              title={
                language === "fr"
                  ? "Afficher mes outils favoris"
                  : language === "ha"
                  ? "Nuna kayan aiki da aka fi so"
                  : "Show my favorite tools"
              }
            >
              <Star
                size={14}
                className={
                  activeCategoryFilter === "favorites"
                    ? "fill-gray-950 text-gray-950"
                    : "fill-amber-400 text-amber-500"
                }
              />
              <span className="hidden xs:inline">
                {language === "fr"
                  ? "Favoris"
                  : language === "ha"
                  ? "Wadanda aka fi so"
                  : "Favorites"}
              </span>
              {favoriteToolIds.length > 0 && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-black rounded-full ${
                    activeCategoryFilter === "favorites"
                      ? "bg-gray-950 text-white"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {favoriteToolIds.length}
                </span>
              )}
            </button>

            {/* Batch Selection Mode Button */}
            <button
              type="button"
              onClick={() => {
                setIsBatchMode(!isBatchMode);
                if (isBatchMode) setSelectedToolIds([]);
              }}
              className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0 border ${
                isBatchMode
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              }`}
              title={
                language === "fr"
                  ? "Sélectionner plusieurs outils pour les classer en favoris ou catégories"
                  : "Batch select tools to favorite or group"
              }
            >
              <CheckSquare size={14} />
              <span>
                {language === "fr"
                  ? isBatchMode
                    ? "Terminer"
                    : "Sélection"
                  : language === "ha"
                  ? isBatchMode
                    ? "Gama"
                    : "Zaɓi"
                  : isBatchMode
                  ? "Done"
                  : "Select"}
              </span>
              {selectedToolIds.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-white text-emerald-700">
                  {selectedToolIds.length}
                </span>
              )}
            </button>

            {/* History Button */}
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              <History size={15} />
              <span className="hidden xs:inline">{language === 'ha' ? 'Tarihi' : language === 'en' ? 'History' : 'Historique'}</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-emerald-600 text-white">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* High Battery Drain Alert Banner */}
        {highDrainDetected && !isLowResourceMode && (
          <HighDrainAlertBanner
            batteryLevel={batteryLevel}
            drainRatePerHour={drainRatePerHour}
            onEnableLowResourceMode={() => setLowResourceMode(true)}
            onOpenDetails={() => setIsBatteryModalOpen(true)}
            onDismiss={dismissHighDrainAlert}
          />
        )}

        {/* Toast Notification Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-2.5 px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-between gap-2"
            >
              <span>{toastMessage}</span>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-white/80 hover:text-white"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full mb-2.5">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t("toolsDashboard.searchPlaceholder", "Rechercher un outil mystique (Abjad, Wafq, Noms...)")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm text-gray-900 dark:text-white shadow-xs transition-all outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              title="Effacer"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <CalculationHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* 5 Recently Consulted Tools Shelf */}
      <RecentToolsShelf
        recentItems={recentTools}
        allTools={tools}
        favoriteToolIds={favoriteToolIds}
        onToggleFavorite={handleToggleFavorite}
        onSelectTool={handleOpenTool}
        onClearRecent={handleClearRecent}
      />

      {/* Category / Group Filter Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2.5 no-scrollbar">
        {/* All tools tab */}
        <button
          type="button"
          onClick={() => setActiveCategoryFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 border ${
            activeCategoryFilter === "all"
              ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-500/50"
          }`}
        >
          <Layers size={14} />
          <span>{language === 'fr' ? 'Tous les outils' : language === 'ha' ? 'Duk Kayan Aiki' : 'All Tools'}</span>
        </button>

        {/* Dedicated Favorites tab */}
        <button
          type="button"
          onClick={() => setActiveCategoryFilter("favorites")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 border ${
            activeCategoryFilter === "favorites" || activeCategoryFilter === "quick_access"
              ? "bg-amber-500 border-amber-500 text-gray-950 font-black shadow-xs"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-amber-500/50"
          }`}
        >
          <Star
            size={14}
            className={
              activeCategoryFilter === "favorites" || activeCategoryFilter === "quick_access"
                ? "fill-gray-950"
                : "text-amber-500 fill-amber-400"
            }
          />
          <span>{language === 'fr' ? 'Favoris' : language === 'ha' ? 'Wadanda aka fi so' : 'Favorites'}</span>
          {favoriteToolIds.length > 0 && (
            <span
              className={`px-1.5 py-0.2 text-[10px] font-black rounded-full ${
                activeCategoryFilter === "favorites" || activeCategoryFilter === "quick_access"
                  ? "bg-gray-950 text-white"
                  : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
              }`}
            >
              {favoriteToolIds.length}
            </span>
          )}
        </button>

        {/* Custom groups */}
        {toolGroups.filter((g) => g.isCustom).map((group) => {
          const isSelected = activeCategoryFilter === group.id;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setActiveCategoryFilter(group.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                isSelected
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-500/50"
              }`}
            >
              <Folder size={14} />
              <span>{group.name}</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                {group.toolIds.length}
              </span>
            </button>
          );
        })}

        {/* Create new custom group */}
        <button
          type="button"
          onClick={() => setIsBatchModalOpen(true)}
          className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-dashed border-emerald-500/40 whitespace-nowrap flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
          title={language === 'fr' ? 'Créer une nouvelle catégorie personnalisée' : 'Create new category'}
        >
          <Plus size={13} />
          <span>{language === 'fr' ? 'Nouveau groupe' : language === 'ha' ? 'Sabuwar rukuni' : 'New Group'}</span>
        </button>
      </div>

      {/* Group Info / Actions Header (when a specific group or favorites is selected) */}
      {activeCategoryFilter !== "all" && (() => {
        const isFavView = activeCategoryFilter === "favorites" || activeCategoryFilter === "quick_access";
        if (isFavView) {
          return (
            <div className="mb-3 p-3 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-gray-950 flex items-center justify-center shrink-0 shadow-xs font-bold">
                  <Star size={16} className="fill-gray-950 text-gray-950" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate text-xs sm:text-sm">
                      {language === 'fr' ? 'Mes Outils Favoris' : language === 'ha' ? 'Kayan Aikin da Aka Fi So' : 'My Favorite Tools'}
                    </h3>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                      {favoriteToolIds.length} {language === 'fr' ? 'favoris' : 'favorites'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    {language === 'fr'
                      ? 'Accédez rapidement à tous les outils spirituels que vous avez marqués d\'une étoile'
                      : 'Quickly access all spiritual tools bookmarked with a star'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsBatchMode(true)}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-[11px] rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <CheckSquare size={13} />
                  <span>{language === 'fr' ? 'Sélectionner' : 'Select'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter("all")}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  title={language === 'fr' ? 'Tous les outils' : 'All tools'}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        }

        const currentGroup = toolGroups.find((g) => g.id === activeCategoryFilter);
        if (!currentGroup) return null;

        return (
          <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Folder size={15} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">
                    {currentGroup.name}
                  </h3>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {displayedTools.length} {language === 'fr' ? 'outils' : 'tools'}
                  </span>
                </div>
                {currentGroup.description && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    {currentGroup.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {currentGroup.isCustom && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(language === 'fr' ? `Supprimer la catégorie "${currentGroup.name}" ?` : `Delete group "${currentGroup.name}"?`)) {
                      deleteCustomToolGroup(currentGroup.id);
                      setActiveCategoryFilter("all");
                      setToolGroups(getToolGroups());
                      showToast(language === 'fr' ? 'Catégorie supprimée' : 'Category deleted');
                    }
                  }}
                  className="px-2 py-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  title="Supprimer ce groupe"
                >
                  <Trash2 size={13} />
                  <span className="hidden sm:inline">{language === 'fr' ? 'Supprimer' : 'Delete'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsBatchMode(true);
                }}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <CheckSquare size={13} />
                <span>{language === 'fr' ? 'Gérer' : 'Manage'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategoryFilter("all")}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                title={language === 'fr' ? 'Tous les outils' : 'All tools'}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })()}

      {/* Pinned Favorites chips banner (visible on 'all' view when favorites exist and not searching) */}
      {activeCategoryFilter === "all" && favoriteToolIds.length > 0 && !searchQuery && (
        <div className="mb-3 p-2.5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-400">
              <Star size={14} className="fill-amber-400 text-amber-500" />
              <span>{language === 'fr' ? 'Mes Outils Favoris' : 'My Favorite Tools'}</span>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded-full font-bold">
                {favoriteToolIds.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveCategoryFilter("favorites")}
              className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>{language === 'fr' ? 'Voir tous les favoris' : 'View all favorites'}</span>
              <ChevronRight size={13} />
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {tools
              .filter((tool) => favoriteToolIds.includes(tool.id))
              .slice(0, 10)
              .map((fTool) => (
                <button
                  key={`fav-chip-${fTool.id}`}
                  type="button"
                  onClick={() => handleOpenTool(fTool)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-gray-200/80 dark:border-gray-700/80 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-200 transition-all shadow-2xs whitespace-nowrap cursor-pointer shrink-0 active:scale-95"
                >
                  <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${fTool.color} text-white flex items-center justify-center text-[10px]`}>
                    {React.createElement(fTool.icon, { size: 12 })}
                  </div>
                  <span className="truncate max-w-[130px]">
                    {t(`tools.${fTool.id}.title`) !== `tools.${fTool.id}.title` ? t(`tools.${fTool.id}.title`) : fTool.title}
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Tabs (Simple vs Advanced - shown in 'all' view) */}
      {activeCategoryFilter === "all" && (
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
      )}

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
                      key={`tools-guide-step-${i}`}
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

      {/* Tools Grid Flow */}
      <div className="mb-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={`tools-dash-skel-${idx}`} className="h-[180px] rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-150 dark:border-gray-700 p-5 flex flex-col justify-between">
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
              {displayedTools.length === 0 ? (
                activeCategoryFilter === 'favorites' || activeCategoryFilter === 'quick_access' ? (
                  /* Dedicated Empty State for Favorites Section */
                  <div className="col-span-full py-12 px-6 text-center rounded-3xl bg-gradient-to-b from-amber-500/5 via-white to-white dark:from-amber-500/10 dark:via-gray-800 dark:to-gray-800 border border-amber-500/20 dark:border-amber-500/20 shadow-sm max-w-2xl mx-auto my-4">
                    <div className="relative w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Star size={30} className="fill-amber-400 text-amber-500" />
                      <Bookmark size={15} className="absolute -bottom-1 -right-1 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-800 rounded-full p-0.5 border border-amber-500/30" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 mb-3">
                      <Sparkles size={12} />
                      <span>
                        {language === 'fr' 
                          ? 'Section Favoris vide' 
                          : language === 'ha'
                          ? 'Babu komai a wadanda aka fi so'
                          : 'Favorites section empty'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white mb-2">
                      {searchQuery
                        ? (language === 'fr' ? 'Aucun outil favori ne correspond à votre recherche' : 'No favorite tools match your search')
                        : (favoriteToolIds.length === 0 && bookmarkedArticlesCount === 0)
                        ? (language === 'fr'
                            ? 'Aucun outil ni article dans vos favoris'
                            : language === 'ha'
                            ? 'Babu kayan aiki ko labarai da aka fi so tukuna'
                            : 'No tools or articles favorited yet')
                        : (language === 'fr'
                            ? 'Aucun outil dans vos favoris'
                            : language === 'ha'
                            ? 'Babu kayan aiki a cikin wadanda aka fi so'
                            : 'No favorite tools saved')}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6 leading-relaxed">
                      {searchQuery
                        ? (language === 'fr'
                            ? `Aucun de vos favoris ne correspond au terme "${searchQuery}".`
                            : `None of your favorites match "${searchQuery}".`)
                        : (favoriteToolIds.length === 0 && bookmarkedArticlesCount === 0)
                        ? (language === 'fr'
                            ? "Vous n'avez pas encore ajouté d'outils mystiques ni d'articles à vos favoris. Parcourez la collection spirituelle et cliquez sur l'étoile ou le marque-page pour les sauvegarder ici."
                            : language === 'ha'
                            ? "Ba ku saka wani kayan aiki ko labari a cikin wadanda kuka fi so ba tukuna. Bincika tarinmu na ruhaniya kuma danna tauraro ko alamar shafi don adana su a nan."
                            : "You haven't favorited any spiritual tools or articles yet. Explore the tool library and star tools or bookmark articles to easily access them here.")
                        : (language === 'fr'
                            ? `Vous avez déjà ${bookmarkedArticlesCount} article(s) enregistré(s) dans vos favoris, mais aucun outil mystique. Cliquez sur l'étoile d'un outil pour l'ajouter à vos favoris.`
                            : language === 'ha'
                            ? `Kuna da labarai ${bookmarkedArticlesCount} a cikin wadanda aka fi so, amma babu kayan aiki. Danna tauraro akan kayan aiki don karawa.`
                            : `You have ${bookmarkedArticlesCount} article(s) saved in your bookmarks, but no spiritual tools favorited yet. Star tools to access them here quickly.`)}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {/* Helpful 'Discover Tools' button */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCategoryFilter('all');
                          setSearchQuery('');
                          setIsBatchMode(false);
                        }}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Compass size={16} />
                        <span>
                          {language === 'fr'
                            ? 'Découvrir les outils'
                            : language === 'ha'
                            ? 'Gano Kayan Aiki'
                            : 'Discover Tools'}
                        </span>
                      </button>

                      {bookmarkedArticlesCount > 0 ? (
                        <Link
                          to="/profile"
                          className="px-4 py-2.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-200 border border-amber-500/30 font-semibold text-xs sm:text-sm rounded-xl transition-all inline-flex items-center gap-1.5"
                        >
                          <Bookmark size={15} />
                          <span>
                            {language === 'fr' ? 'Voir mes articles enregistrés' : 'View Saved Articles'}
                          </span>
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-xs sm:text-sm rounded-xl transition-all inline-flex items-center gap-1.5"
                        >
                          <BookOpen size={15} />
                          <span>
                            {language === 'fr' ? 'Découvrir les articles' : language === 'ha' ? 'Duba Labarai' : 'Discover Articles'}
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Generic Empty State for Other Categories / Search */
                  <div className="col-span-full py-12 px-4 text-center rounded-2xl bg-white dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-400 flex items-center justify-center mx-auto mb-3">
                      {activeCategoryFilter === 'all' ? (
                        <Search size={24} />
                      ) : (
                        <Folder size={24} />
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1">
                      {searchQuery
                        ? (language === 'fr' ? 'Aucun outil trouvé' : 'No tools found')
                        : (language === 'fr' ? 'Aucun outil dans ce groupe' : 'No tools in this group')}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-4">
                      {searchQuery
                        ? (language === 'fr' ? `Aucun résultat pour "${searchQuery}". Essayez avec un autre mot-clé.` : `No results for "${searchQuery}".`)
                        : (language === 'fr' ? 'Sélectionnez des outils depuis la vue complète pour les ajouter à cette catégorie.' : 'Select tools to add them to this category.')}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategoryFilter('all');
                        setSearchQuery('');
                        setIsBatchMode(true);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>{language === 'fr' ? 'Ajouter des outils' : 'Add Tools'}</span>
                    </button>
                  </div>
                )
              ) : (
                displayedTools.map((tool, index) => {
                  const toolTitle = t(`tools.${tool.id}.title`) !== `tools.${tool.id}.title` ? t(`tools.${tool.id}.title`) : tool.title;
                  const accessResult = checkFeatureAccess(tool.id, toolTitle, featureToggles, user, isAuthPremium);
                  
                  const isMaintenance = accessResult.restrictionType === "maintenance";
                  const isPremium = accessResult.status === "premium";
                  const isBlockedForUser = !accessResult.allowed && (accessResult.restrictionType === "blocked" || accessResult.restrictionType === "phone_blocked");
                  const isAllowed = accessResult.allowed;

                  const isSelected = selectedToolIds.includes(tool.id);
                  const isFav = favoriteToolIds.includes(tool.id) || isToolInQuickAccess(tool.id);

                  const content = (
                    <div
                      className={`h-full w-full max-w-full min-w-0 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border p-4 transition-all duration-300 relative overflow-hidden group ${
                        isSelected
                          ? "ring-2 ring-emerald-500 border-emerald-500 dark:border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/25 shadow-md"
                          : "border-gray-100 dark:border-gray-700"
                      } ${!tool.comingSoon && isAllowed ? "hover:shadow-md hover:-translate-y-1" : "opacity-80"}`}
                    >
                      {/* Background Decoration */}
                      <div
                        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} rounded-bl-full opacity-10 transition-opacity ${!tool.comingSoon && isAllowed ? "group-hover:opacity-20" : ""}`}
                      ></div>

                      <div className="relative z-10 flex flex-col h-full min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2 min-w-0">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
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

                          {/* Top-Right Action: Checkbox & Favorite Star with Heart-Pop */}
                          <div className="flex items-center gap-1.5 shrink-0 relative z-30">
                            {/* Checkbox on each tool card */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                toggleSelectTool(tool.id);
                              }}
                              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-emerald-600 border-emerald-600 text-white shadow-xs scale-105"
                                  : "border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 text-transparent hover:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                              }`}
                              title={
                                isSelected
                                  ? language === "fr"
                                    ? "Désélectionner"
                                    : "Deselect"
                                  : language === "fr"
                                  ? "Sélectionner pour action groupée"
                                  : "Select for batch action"
                              }
                            >
                              <Check size={14} className={`stroke-[3] ${isSelected ? "text-white" : "hover:opacity-40"}`} />
                            </button>

                            {/* Favorite Star Button with Heart-Pop Animation */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleToggleFavorite(tool.id);
                                }}
                                className={`p-1.5 rounded-xl transition-all cursor-pointer relative ${
                                  isFav
                                    ? "text-amber-500 bg-amber-500/15 hover:bg-amber-500/25 shadow-xs"
                                    : "text-gray-300 dark:text-gray-600 hover:text-amber-500 hover:bg-amber-500/10"
                                }`}
                                title={
                                  isFav
                                    ? language === "fr"
                                      ? "Retirer des Favoris"
                                      : "Remove from Favorites"
                                    : language === "fr"
                                    ? "Ajouter aux Favoris"
                                    : "Add to Favorites"
                                }
                              >
                                <Star size={16} className={isFav ? "fill-amber-400 text-amber-500" : ""} />
                              </button>

                              {/* Subtle Heart-Pop Animation */}
                              <AnimatePresence>
                                {popToolId === tool.id && (
                                  <motion.div
                                    initial={{ scale: 0.2, opacity: 0, y: 0 }}
                                    animate={{ scale: [0.3, 1.4, 1.1], opacity: [0, 1, 0], y: -24 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.75, ease: "easeOut" }}
                                    className="absolute -top-3 -right-2 pointer-events-none z-50 flex items-center justify-center"
                                  >
                                    <div className="relative">
                                      <Heart size={24} className="fill-rose-500 text-rose-500 drop-shadow-md" />
                                      <Star size={12} className="fill-amber-400 text-amber-400 absolute -top-1 -right-1" />
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-3">
                          {t(`tools.${tool.id}.description`) !==
                          `tools.${tool.id}.description`
                            ? t(`tools.${tool.id}.description`)
                            : tool.description}
                        </p>
                        
                        <div className="mt-auto pt-3.5 flex flex-wrap items-center justify-between gap-2 relative z-20 border-t border-gray-100 dark:border-gray-700/60">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            {t("tools.access", "Accéder")} →
                          </span>

                          <div className="flex items-center gap-1.5">
                            {/* Dedicated 'Ajouter aux Favoris' button with Heart-Pop */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleToggleFavorite(tool.id);
                                }}
                                className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 border ${
                                  isFav
                                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/25"
                                    : "bg-gray-50 dark:bg-gray-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 border-gray-200 dark:border-gray-700"
                                }`}
                                title={
                                  isFav
                                    ? language === "fr"
                                      ? "Retirer des Favoris"
                                      : "Remove from Favorites"
                                    : language === "fr"
                                    ? "Ajouter aux Favoris"
                                    : "Add to Favorites"
                                }
                              >
                                <Star
                                  size={13}
                                  className={isFav ? "fill-amber-400 text-amber-500" : "text-gray-400 dark:text-gray-500"}
                                />
                                <span className="text-[11px] font-bold">
                                  {isFav
                                    ? language === "fr"
                                      ? "Favori"
                                      : language === "ha"
                                      ? "Wanda aka fi so"
                                      : "Favorited"
                                    : language === "fr"
                                    ? "Favoris"
                                    : language === "ha"
                                    ? "A fi so"
                                    : "Favorite"}
                                </span>
                              </button>

                              <AnimatePresence>
                                {popToolId === tool.id && (
                                  <motion.div
                                    initial={{ scale: 0.2, opacity: 0, y: 0 }}
                                    animate={{ scale: [0.4, 1.4, 1], opacity: [0, 1, 0], y: -20 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                    className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-50 flex items-center justify-center"
                                  >
                                    <Heart size={20} className="fill-rose-500 text-rose-500 drop-shadow-md" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {featureToggles.share_tools_enabled !== false && (
                              <button
                                type="button"
                                onClick={(e) => handleShareTool(e, tool)}
                                className="p-1.5 sm:px-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-transparent hover:border-emerald-200/50 dark:hover:border-emerald-800/40 flex items-center gap-1 group/share cursor-pointer active:scale-95"
                                title={language === 'ha' ? "Raba wannan kayan aiki" : language === 'en' ? "Share this tool" : "Partager cet outil avec des amis"}
                              >
                                <Share2 size={13} className="group-hover/share:scale-110 transition-transform" />
                                <span className="hidden sm:inline text-[11px] font-semibold text-gray-500 group-hover/share:text-emerald-600 dark:group-hover/share:text-emerald-400">
                                  {language === 'ha' ? 'Raba' : language === 'en' ? 'Share' : 'Partager'}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );

                  return (
                    <motion.div
                      layout
                      key={`user-tool-${tool.id}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    >
                      {tool.comingSoon ? (
                        <div className="cursor-not-allowed">{content}</div>
                      ) : (
                        <div
                          onClick={() => {
                            if (isBatchMode || selectedToolIds.length > 0) {
                              toggleSelectTool(tool.id);
                              return;
                            }
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
                              handleOpenTool(tool);
                            }
                          }}
                          className="block h-full cursor-pointer"
                        >
                          {content}
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Sponsored Banner Ad */}
      <div className="mt-4 mb-4">
        <BannerAd />
      </div>

      {/* Premium Access Modal */}
      {premiumModalOpen.isOpen && (
        <PremiumLockScreen
          variant="modal"
          toolName={premiumModalOpen.title}
          onClose={() => setPremiumModalOpen({ isOpen: false, title: "" })}
        />
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

      {/* Social Web Share Modal Fallback */}
      <ToolShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        tool={shareModalTool}
      />

      {/* Floating Docked Batch Action Bar */}
      <AnimatePresence>
        {(isBatchMode || selectedToolIds.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-16 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:right-6 sm:left-auto z-40 max-w-2xl mx-auto sm:mx-0"
          >
            <div className="bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-md text-white px-3.5 sm:px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                  {selectedToolIds.length}
                </span>
                <span className="text-xs font-medium text-gray-200 whitespace-nowrap">
                  {language === 'fr'
                    ? `${selectedToolIds.length} sélectionné${selectedToolIds.length > 1 ? 's' : ''}`
                    : language === 'ha'
                    ? `${selectedToolIds.length} aka zaba`
                    : `${selectedToolIds.length} selected`}
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Select / Deselect all */}
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-[11px] font-bold transition-colors cursor-pointer"
                >
                  {selectedToolIds.length === displayedTools.length && displayedTools.length > 0
                    ? (language === 'fr' ? 'Tout désél.' : language === 'ha' ? 'Cire duka' : 'Clear')
                    : (language === 'fr' ? 'Tout sél.' : language === 'ha' ? 'Zabi duka' : 'Select all')}
                </button>

                {/* Batch Favorite Button */}
                <button
                  type="button"
                  disabled={selectedToolIds.length === 0}
                  onClick={() => handleBatchFavorite(true)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border ${
                    selectedToolIds.length > 0
                      ? "bg-amber-500 hover:bg-amber-400 text-gray-950 font-black border-amber-400 shadow-xs"
                      : "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed"
                  }`}
                  title={
                    language === 'fr'
                      ? "Ajouter tous les outils sélectionnés aux favoris"
                      : "Add all selected tools to favorites"
                  }
                >
                  <Star size={13} className="fill-gray-950 text-gray-950" />
                  <span className="whitespace-nowrap">{language === 'fr' ? 'Favoris' : language === 'ha' ? 'Favori' : 'Favorite'}</span>
                </button>

                {/* Batch Delete Action (Removes multiple selected items from favorites) */}
                <button
                  type="button"
                  disabled={selectedToolIds.length === 0}
                  onClick={handleBatchDeleteFromFavorites}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border ${
                    selectedToolIds.length > 0
                      ? "bg-rose-500/20 hover:bg-rose-600 text-rose-200 hover:text-white border-rose-500/40 shadow-xs"
                      : "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed"
                  }`}
                  title={
                    language === 'fr'
                      ? "Supprimer les outils sélectionnés des favoris"
                      : language === 'ha'
                      ? "Goge kayan aikin da aka zaba daga wadanda aka fi so"
                      : "Remove selected tools from favorites"
                  }
                >
                  <Trash2 size={13} className={selectedToolIds.length > 0 ? "text-rose-300" : ""} />
                  <span className="whitespace-nowrap">
                    {language === 'fr' ? 'Supprimer des favoris' : language === 'ha' ? 'Goge daga favoris' : 'Batch Delete'}
                  </span>
                </button>

                {/* Batch Share Option (Shares collection of selected tools via Web Share API) */}
                <button
                  type="button"
                  disabled={selectedToolIds.length === 0}
                  onClick={handleBatchShare}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border ${
                    selectedToolIds.length > 0
                      ? "bg-sky-500/20 hover:bg-sky-600 text-sky-200 hover:text-white border-sky-400/40 shadow-xs"
                      : "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed"
                  }`}
                  title={
                    language === 'fr'
                      ? "Partager la sélection d'outils via l'API Web Share"
                      : language === 'ha'
                      ? "Raba tarin kayan aiki da aka zaba"
                      : "Share collection of selected tools via Web Share API"
                  }
                >
                  <Share2 size={13} className={selectedToolIds.length > 0 ? "text-sky-300" : ""} />
                  <span className="whitespace-nowrap">{language === 'fr' ? 'Partager' : language === 'ha' ? 'Raba' : 'Batch Share'}</span>
                </button>

                {/* Organize / Categorize modal button */}
                <button
                  type="button"
                  disabled={selectedToolIds.length === 0}
                  onClick={() => setIsBatchModalOpen(true)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border ${
                    selectedToolIds.length > 0
                      ? "bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white border-emerald-500/40 shadow-xs"
                      : "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed"
                  }`}
                  title={language === 'fr' ? 'Classer dans un groupe' : 'Categorize tools'}
                >
                  <FolderPlus size={13} />
                  <span className="whitespace-nowrap">{language === 'fr' ? 'Classer...' : language === 'ha' ? 'Rukuni...' : 'Group...'}</span>
                </button>

                {/* Close batch mode */}
                <button
                  type="button"
                  onClick={() => {
                    setIsBatchMode(false);
                    setSelectedToolIds([]);
                  }}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg cursor-pointer transition-colors"
                  title="Fermer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Batch Categorization Modal */}
      <BatchCategoryModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        selectedToolIds={selectedToolIds}
        onComplete={(groupName) => {
          setSelectedToolIds([]);
          setIsBatchMode(false);
          setToolGroups(getToolGroups());
          showToast(
            language === 'fr'
              ? `Outils ajoutés avec succès à "${groupName}"`
              : `Tools added to "${groupName}"`
          );
        }}
      />

      {/* Battery Performance & Low Resource Mode Modal */}
      <LowResourceBatteryModal
        isOpen={isBatteryModalOpen}
        onClose={() => setIsBatteryModalOpen(false)}
        batteryLevel={batteryLevel}
        isCharging={isCharging}
        drainRatePerHour={drainRatePerHour}
        cpuLoadEstimate={cpuLoadEstimate}
        longTasksCount={longTasksCount}
        isLowResourceMode={isLowResourceMode}
        batteryLogs={batteryLogs}
        onToggleLowResourceMode={toggleLowResourceMode}
        onClearLogs={clearBatteryLogs}
        onSimulateDrain={simulateHighDrainTest}
      />
    </div>
  );
};

export default ToolsDashboard;
