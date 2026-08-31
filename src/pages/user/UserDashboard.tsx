import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth, handleFirestoreError, OperationType } from '../../contexts/AuthContext';
import { useFeatures } from '../../contexts/FeatureContext';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDocsFromServer, getDocs, where, limit } from 'firebase/firestore';
import { Search, LayoutGrid, Square, List, Filter, X, BookOpen, Store, Award, MapPin, Trophy, ShieldCheck, ChevronDown, Bookmark, Flame, Shield, RefreshCw, Quote, Folder, Plus, Library, Music, Pencil, Trash2, Sliders, Sparkles, Calendar, FolderOpen, Star, FileText, HardDrive, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { SecretCard, LayoutMode } from '../../components/SecretCard';
import { HabitTracker } from '../../components/HabitTracker';
import { DailyGoalsTracker } from '../../components/DailyGoalsTracker';
import { HijriCalendarWidget } from '../../components/HijriCalendarWidget';
import { OnboardingTour } from '../../components/OnboardingTour';
import { GlobalSearchModal } from '../../components/GlobalSearchModal';
import { MysticCalendarModal } from '../../components/MysticCalendarModal';
import { AsrarQuickWidget } from '../../components/AsrarQuickWidget';
import { ToolsVideoSlider } from '../../components/ToolsVideoSlider';
import { PullToRefresh } from '../../components/PullToRefresh';
import { OfflineDashboardSection } from '../../components/OfflineDashboardSection';
import { PromoAnnouncementBanner } from '../../components/videoCards/PromoAnnouncementBanner';

import { INITIAL_DEFAULT_ARTICLES, DefaultArticle } from '../../data/defaultArticles';
import { fetchArticlesFromRest } from '../../lib/firestoreRest';
import { isPubliclyVisibleArticle, getTranslatedArticleTitle, getTranslatedArticleHook, sortArticlesInOrder } from '../../lib/articleUtils';
import { ArticleService } from '../../services/ArticleService';
import { mergeWithLocalArticles, saveCachedArticlesList, combineWithDefaultArticles, setHideMockArticles, isMockArticlesHidden, getCachedArticlesListAsync } from '../../lib/localArticles';
import { SWR_EVENT_NAME } from '../../lib/swrArticleCache';
import { useBackButton } from '../../hooks/useBackButton';
import { getArticleImageUrl } from '../../utils/articleImageUtils';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { OfflineArticlesPopup } from '../../components/OfflineArticlesPopup';

const LucideIcon = ({ name, className, size }: { name: string; className?: string; size?: number }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    return <Icons.FolderOpen className={className} size={size} />;
  }
  return <IconComponent className={className} size={size} />;
};
import { getAsrarItems } from '../../data/store';
import { AsrarItem, Category } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import { tools } from '../../data/tools';

import { getApiUrl } from '../../lib/api';

interface Props {
  initialFilter?: Category | 'all' | 'favoris' | 'offline';
}

export const UserDashboard: React.FC<Props> = ({ initialFilter = 'all' }) => {
  const { t, language } = useLanguage();
  const { user, isPremium: isAuthPremium } = useAuth();
  const { featureToggles } = useFeatures();
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [items, setItems] = useState<AsrarItem[]>(() => {
    try {
      const cached = localStorage.getItem('asrarhub_cached_articles_list') || localStorage.getItem('asrarhub_cached_explore_articles');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((art: any) => art && art.id && !String(art.id).startsWith('default_art_') && ArticleService.isPublished(art));
          if (valid.length > 0) return mergeWithLocalArticles(valid, false);
        }
      }
    } catch (e) {}
    return mergeWithLocalArticles([], false);
  });
  const { isOffline, isOnline } = useNetworkStatus();
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<Category | 'all' | 'favoris' | 'offline'>(() => {
    const locState = (location.state as any)?.filter;
    if (locState === 'offline') return 'offline';
    return initialFilter;
  });
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid2');
  const [lastToolId, setLastToolId] = useState<string | null>(null);

  useEffect(() => {
    const handleOpenOfflineVault = () => {
      setFilter('offline');
    };
    window.addEventListener('asrarhub_open_offline_vault', handleOpenOfflineVault);
    return () => {
      window.removeEventListener('asrarhub_open_offline_vault', handleOpenOfflineVault);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("asrarhub_last_tool");
    if (saved) {
      setLastToolId(saved);
    }
  }, []);

  
  const isLayoutFree = featureToggles?.home_articles_layout_free !== false && 
                       !featureToggles?.lockArticlesDisplayMode && 
                       !featureToggles?.home_articles_layout_locked;

  useEffect(() => {
    const layoutSetting = featureToggles?.home_articles_layout || featureToggles?.articles_layout_mode || featureToggles?.articlesDisplayMode;
    if (layoutSetting) {
      if (layoutSetting === 'grid' || layoutSetting === 'grid2') {
        setLayoutMode('grid2');
      } else if (layoutSetting === 'large' || layoutSetting === 'grid1') {
        setLayoutMode('grid1');
      } else if (layoutSetting === 'list') {
        setLayoutMode('list');
      } else {
        setLayoutMode('grid2');
      }
    }
  }, [featureToggles?.home_articles_layout, featureToggles?.articles_layout_mode, featureToggles?.articlesDisplayMode, featureToggles?.home_articles_layout_free, featureToggles?.lockArticlesDisplayMode]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const isCalendarOpen = location.search.includes('calendar=true');
  const setIsCalendarOpen = (open: boolean) => {
    const params = new URLSearchParams(location.search);
    if (open) {
      params.set('calendar', 'true');
    } else {
      params.delete('calendar');
    }
    const newSearch = params.toString();
    navigate({
      pathname: location.pathname,
      search: newSearch ? `?${newSearch}` : '',
    }, { replace: true });
  };
  const [isTopContributorsOpen, setIsTopContributorsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [bookmarkFolders, setBookmarkFolders] = useState<{ id: string, name: string, items: string[] }[]>([]);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [quranBookmarks, setQuranBookmarks] = useState<any[]>([]);
  const [lastReadPosition, setLastReadPosition] = useState<{ surahNumber: number, ayahNumberInSurah: number, surahName: string } | null>(null);
  const [activityData, setActivityData] = useState<{ [date: string]: number }>({});
  const [readingHistory, setReadingHistory] = useState<any[]>([]);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const [aiSearchResults, setAiSearchResults] = useState<string[] | null>(null);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [announcement, setAnnouncement] = useState<{ title: string; text: string; visible: boolean; link?: string; buttonText?: string; uniqueId?: string } | null>(null);
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = useState(false);
  const [isPremiumPromoDismissed, setIsPremiumPromoDismissed] = useState(false);

  const [affirmation, setAffirmation] = useState({ verse: '', reference: '' });
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  useBackButton(() => setIsSearchOpen(false), isSearchOpen);
  useBackButton(() => setIsFilterOpen(false), isFilterOpen);
  useBackButton(() => setIsCategoryModalOpen(false), isCategoryModalOpen);
  useBackButton(() => setIsTopContributorsOpen(false), isTopContributorsOpen);
  useBackButton(() => setIsGlobalSearchOpen(false), isGlobalSearchOpen);
  useBackButton(() => setIsCalendarOpen(false), isCalendarOpen);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get('search');
    if (s) {
      setSearchQuery(decodeURIComponent(s));
      setIsSearchOpen(true);
    }
  }, [location.search]);

  useEffect(() => {
    const affirmations = [
      { verse: "Certes, avec la difficulté est la facilité.", reference: "Coran 94:5" },
      { verse: "Invoquez-Moi, Je vous répondrai.", reference: "Coran 40:60" },
      { verse: "Et Il a trouvé que tu étais égaré, alors Il t'a guidé.", reference: "Coran 93:7" },
      { verse: "N'est-ce point par l'évocation d'Allah que se tranquillisent les cœurs?", reference: "Coran 13:28" },
      { verse: "Allah ne charge aucune âme au-delà de sa capacité.", reference: "Coran 2:286" },
      { verse: "Celui qui se confie à Allah, Allah lui suffit.", reference: "Coran 65:3" },
      { verse: "Seigneur ! Ne laisse pas dévier nos cœurs après que Tu nous aies guidés.", reference: "Coran 3:8" }
    ];
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    setAffirmation(affirmations[day % affirmations.length]);
  }, []);

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsAiSearching(true);
    setAiMessage(null);
    setAiSearchResults(null);
    try {
      const payload = {
        query: searchQuery,
        availableItems: items.map(i => ({ id: i.id, title: i.title, category: i.category, hook: i.hook }))
      };
      
      const res = await fetch(getApiUrl("/api/assistant/search"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.recommendedIds) {
        setAiSearchResults(data.recommendedIds);
      }
      if (data.message) {
        setAiMessage(data.message);
      }
    } catch (e) {
      console.error(e);
      setAiMessage("Une erreur s'est produite lors de la recherche IA.");
    } finally {
      setIsAiSearching(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      setFilter(categoryId as any);
    } else {
      setFilter(initialFilter);
    }
  }, [categoryId, initialFilter, location.pathname]);

  // Sync category filter from URL params

    const formatCreatedAt = (val: any): string => {
      if (!val) return new Date().toISOString();
      try {
        if (typeof val === 'object' && typeof val.toDate === 'function') {
          return val.toDate().toISOString();
        }
        if (typeof val === 'object' && typeof val.seconds === 'number') {
          return new Date(val.seconds * 1000).toISOString();
        }
        const d = new Date(val);
        if (isNaN(d.getTime())) {
          return new Date().toISOString();
        }
        return d.toISOString();
      } catch (e) {
        return new Date().toISOString();
      }
    };

    const isPublishedArticleStatus = (st: any) => {
      return isPubliclyVisibleArticle(st);
    };

    // Master in-memory accumulator to prevent any flicker or disappearances
    const articleMapRef = useRef<Map<string, AsrarItem>>(new Map());

    const applyAccumulatedArticles = useCallback((incoming: AsrarItem[]) => {
      if (!Array.isArray(incoming)) return;
      for (const it of incoming) {
        if (it && it.id && ArticleService.isPublished(it)) {
          const existing = articleMapRef.current.get(it.id);
          articleMapRef.current.set(it.id, { ...existing, ...it });
        }
      }
      const allAccumulated = Array.from(articleMapRef.current.values());
      const merged = mergeWithLocalArticles(allAccumulated, false);
      const publicOnly = merged.filter((it: any) => ArticleService.isPublished(it));
      const sorted = sortArticlesInOrder(publicOnly, true);
      if (sorted.length > 0) {
        setItems(sorted);
        setIsLoading(false);
        saveCachedArticlesList('asrarhub_cached_articles_list', sorted);
      }
    }, []);

    const processRawObject = useCallback((data: any, docId: string) => {
      if (!data) return null;

      // User Dashboard feed displays all articles EXCEPT Draft and Archive
      if (!isPublishedArticleStatus(data.status)) {
        return null;
      }

      let activeContent = data.content || '';
      if (language === 'en' && data.content_en) activeContent = data.content_en;
      if (language === 'ha' && data.content_ha) activeContent = data.content_ha;

      let hookText = getTranslatedArticleHook(data, language);
      if (!hookText && activeContent) {
        hookText = activeContent.replace(/<[^>]+>/g, '').substring(0, 120) + '...';
      }
      
      let titleText = getTranslatedArticleTitle(data, language);

      const hasManual = language !== 'fr' && !!(data[`title_${language}`] || data[`content_${language}`]);
      const img = getArticleImageUrl(data);
      return {
        id: docId || data.id,
        title: titleText || data.title || 'Sans titre',
        hook: hookText,
        category: data.category || 'recette',
        subCategory: data.subCategory || '',
        status: data.status || 'Published',
        content: activeContent,
        benefits: data.benefits || [],
        imageUrl: img,
        thumbnail: img,
        isPremium: data.isPremium || false,
        order: data.order,
        orderIndex: data.orderIndex,
        isPinned: data.isPinned || data.pinned || false,
        createdAt: formatCreatedAt(data.createdAt),
        publishDate: data.publishDate,
        title_en: data.title_en,
        content_en: data.content_en,
        hook_en: data.hook_en,
        title_ha: data.title_ha,
        content_ha: data.content_ha,
        hook_ha: data.hook_ha,
        title_fr: data.title,
        content_fr: data.content,
        hook_fr: data.hook,
        hasManualTranslation: hasManual
      } as AsrarItem;
    }, [language]);

    const processDocData = useCallback((docSnap: any) => {
      try {
        const data = docSnap.data();
        return processRawObject(data, docSnap.id);
      } catch (err) {
        console.error("Error parsing article document:", docSnap.id, err);
        return null;
      }
    }, [processRawObject]);

    // Pull-to-refresh data revalidation handler
    const revalidateDashboardData = async () => {
      try {
        console.log('[UserDashboard] Manual pull-to-refresh: revalidating articles & categories...');
        
        const fetchTasks: Promise<any>[] = [];

        // 1. Re-fetch fresh articles via REST
        fetchTasks.push(
          fetchArticlesFromRest().then(restDocs => {
            if (Array.isArray(restDocs) && restDocs.length > 0) {
              const parsed = restDocs
                .map(d => processRawObject(d, d.id))
                .filter((item): item is AsrarItem => item !== null);
              if (parsed.length > 0) {
                applyAccumulatedArticles(parsed);
              }
            }
          }).catch(e => console.warn('[PullToRefresh] REST fetch note:', e))
        );

        // 2. Re-fetch fresh articles via Firestore SDK
        fetchTasks.push(
          getDocs(collection(db, 'articles')).then(snap => {
            const freshItems = snap.docs
              .map(d => processDocData(d))
              .filter((item): item is AsrarItem => item !== null);
            if (freshItems.length > 0) {
              applyAccumulatedArticles(freshItems);
            }
          }).catch(e => console.warn('[PullToRefresh] Firestore getDocs note:', e))
        );

        // 3. Re-fetch categories
        fetchTasks.push(
          getDocs(collection(db, 'categories')).then(snapshot => {
            if (!snapshot.empty) {
              let deletedIds: string[] = [];
              try { deletedIds = JSON.parse(localStorage.getItem('asrarhub_deleted_categories') || '[]'); } catch (e) {}
              const list = snapshot.docs
                .map(doc => ({ ...doc.data(), id: doc.id }))
                .filter((cat: any) => !deletedIds.includes(cat.id));
              list.sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));
              setCategories(list);
              try { localStorage.setItem('asrarhub_cached_categories', JSON.stringify(list)); } catch (e) {}
            }
          }).catch(e => console.warn('[PullToRefresh] Categories getDocs note:', e))
        );

        // 4. Reload local bookmarks & history
        try {
          const parsed = JSON.parse(localStorage.getItem('asrar_bookmarks') || '[]');
          setBookmarks(Array.isArray(parsed) ? parsed : []);
        } catch (e) {}
        try {
          const rawHistory = localStorage.getItem('asrar_reading_history');
          if (rawHistory) setReadingHistory(JSON.parse(rawHistory));
        } catch (e) {}

        // 5. Broadcast SWR synchronization
        window.dispatchEvent(new CustomEvent('asrarhub_swr_articles_updated', {
          detail: { articles: Array.from(articleMapRef.current.values()) }
        }));

        // Fluid delay for UX
        await Promise.all([
          ...fetchTasks,
          new Promise(resolve => setTimeout(resolve, 450))
        ]);
      } catch (err) {
        console.error('[UserDashboard] Revalidation error:', err);
      }
    };

  useEffect(() => {
    // 1. Instant cache restoration (IndexedDB + localStorage)
    const restoreCachedArticles = () => {
      let baseItems: AsrarItem[] = [];
      try {
        const cached = localStorage.getItem('asrarhub_cached_articles_list') || localStorage.getItem('asrarhub_cached_explore_articles');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const validItems = parsed.filter((it: any) => it && it.id && !String(it.id).startsWith('default_art_') && isPublishedArticleStatus(it.status));
            if (validItems.length > 0) {
              baseItems = validItems;
            }
          }
        }
      } catch (e) {}

      applyAccumulatedArticles(baseItems);

      getCachedArticlesListAsync('asrarhub_cached_articles_list').then(idbItems => {
        if (Array.isArray(idbItems) && idbItems.length > 0) {
          const validItems = idbItems.filter((it: any) => it && it.id && !String(it.id).startsWith('default_art_') && isPublishedArticleStatus(it.status));
          if (validItems.length > 0) {
            applyAccumulatedArticles(validItems as AsrarItem[]);
          }
        }
      }).catch(() => {});
    };

    restoreCachedArticles();

    // 2. Direct REST API fetch to ensure all articles load instantly on mobile / Capacitor WebViews
    fetchArticlesFromRest().then(restDocs => {
      if (Array.isArray(restDocs) && restDocs.length > 0) {
        const parsed = restDocs
          .map(d => processRawObject(d, d.id))
          .filter((item): item is AsrarItem => item !== null);
        if (parsed.length > 0) {
          console.log(`[Articles REST - UserDashboard] Loaded ${parsed.length} public articles via REST API`);
          applyAccumulatedArticles(parsed);
        }
      }
    }).catch(err => {
      console.warn("[Articles REST - UserDashboard] REST fetch note:", err);
    });

    // 3. Firestore getDocs query
    const q = collection(db, 'articles');
    getDocs(q).then((snap) => {
      const freshItems = snap.docs
        .map(d => processDocData(d))
        .filter((item): item is AsrarItem => item !== null);
      if (freshItems.length > 0) {
        console.log(`[Articles getDocs - UserDashboard] Loaded ${freshItems.length} public articles via getDocs`);
        applyAccumulatedArticles(freshItems);
      }
    }).catch(err => {
      console.warn("[Articles getDocs - UserDashboard] Firestore getDocs note:", err?.code || err?.message || err);
    });

    // 4. Firestore real-time onSnapshot listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreItems = snapshot.docs
        .map(d => processDocData(d))
        .filter((item): item is AsrarItem => item !== null);
      if (firestoreItems.length > 0) {
        console.log(`[Articles onSnapshot - UserDashboard] Realtime update: ${firestoreItems.length} public articles`);
        applyAccumulatedArticles(firestoreItems);
      }
      setIsLoading(false);
    }, (error) => {
      console.warn("[Articles onSnapshot - UserDashboard] Firestore listener note:", error?.code || error?.message || error);
      setIsLoading(false);
    });

    try {
      const parsed = JSON.parse(localStorage.getItem('asrar_bookmarks') || '[]');
      setBookmarks(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setBookmarks([]);
    }
    
    try {
      const parsedFolders = JSON.parse(localStorage.getItem('asrar_bookmark_folders') || '[]');
      setBookmarkFolders(Array.isArray(parsedFolders) ? parsedFolders : []);
    } catch (e) {
      setBookmarkFolders([]);
    }
    
    try {
      const parsedQuran = JSON.parse(localStorage.getItem('asrarhub_quran_bookmarks') || '[]');
      setQuranBookmarks(Array.isArray(parsedQuran) ? parsedQuran : []);
    } catch (e) {
      setQuranBookmarks([]);
    }
    
    try {
      const savedRead = localStorage.getItem('asrarhub_last_read_position');
      if (savedRead) {
        setLastReadPosition(JSON.parse(savedRead));
      }
    } catch(e) {}

    try {
      const rawHistory = localStorage.getItem('asrar_reading_history');
      if (rawHistory) {
        setReadingHistory(JSON.parse(rawHistory));
      }
    } catch (e) {
      setReadingHistory([]);
    }
    
    // Mock activity data or generate from stats
    try {
      const stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}');
      const data: { [date: string]: number } = {};
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const randomFactor = Math.random();
        data[dateStr] = Math.floor(randomFactor * 10) * (randomFactor > 0.5 ? 1 : 0);
      }
      const todayStr = today.toISOString().split('T')[0];
      data[todayStr] = Math.max(1, data[todayStr]);
      setActivityData(data);
    } catch(e) {}

    const handleSWRUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.articles && Array.isArray(customEvent.detail.articles)) {
        console.log(`[SWR Event - UserDashboard] SWR updated with ${customEvent.detail.articles.length} items`);
        applyAccumulatedArticles(customEvent.detail.articles);
      }
    };
    window.addEventListener(SWR_EVENT_NAME, handleSWRUpdate);
    window.addEventListener('asrarhub_swr_articles_updated', handleSWRUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener(SWR_EVENT_NAME, handleSWRUpdate);
      window.removeEventListener('asrarhub_swr_articles_updated', handleSWRUpdate);
    };
  }, [language]);

  // Refresh bookmarks when window gets focus (in case they changed it on another page)
  useEffect(() => {
    const handleFocus = () => {
      try {
        const parsed = JSON.parse(localStorage.getItem('asrar_bookmarks') || '[]');
        setBookmarks(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setBookmarks([]);
      }
      try {
        const rawHistory = localStorage.getItem('asrar_reading_history');
        if (rawHistory) {
          setReadingHistory(JSON.parse(rawHistory));
        }
      } catch (e) {
        setReadingHistory([]);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    // 1. Check if Home Announcement from settings/features is enabled
    const isManualEnabled = featureToggles?.home_announcement_enabled === true || 
                            featureToggles?.home_announcement_enabled === 'true' || 
                            featureToggles?.announcementVisible === true || 
                            featureToggles?.announcementVisible === 'true';

    const manualText = (language === 'ha' ? featureToggles?.home_announcement_text_ha : language === 'en' ? featureToggles?.home_announcement_text_en : null) ||
                       featureToggles?.home_announcement_text || 
                       featureToggles?.home_announcement_text_fr || 
                       featureToggles?.announcementText;

    const manualTitle = (language === 'ha' ? featureToggles?.home_announcement_title_ha : language === 'en' ? featureToggles?.home_announcement_title_en : null) ||
                        featureToggles?.home_announcement_title || 
                        featureToggles?.home_announcement_title_fr || 
                        featureToggles?.announcementTitle || 
                        t('dashboardContent.announcementTitle', 'Nouvelles mises à jour disponibles !');

    const manualLink = featureToggles?.home_announcement_link || featureToggles?.announcementLink || '';
    const manualBtnText = featureToggles?.home_announcement_btn_text || featureToggles?.announcementBtnText || '';

    if (isManualEnabled && manualText) {
      const dismissedKey = localStorage.getItem('asrarhub_dismissed_announcement_text');
      const uniqueId = `manual_${manualText}`;
      if (dismissedKey !== uniqueId && dismissedKey !== manualText) {
        setIsAnnouncementDismissed(false);
      } else {
        setIsAnnouncementDismissed(true);
      }
      setAnnouncement({
        title: manualTitle,
        text: manualText,
        visible: true,
        link: manualLink,
        buttonText: manualBtnText,
        uniqueId: uniqueId
      });
      return;
    }

    // 2. If manual announcement is not explicitly configured, listen for the latest active notification in Firestore
    let isSubscribed = true;
    let unsubNotifs: (() => void) | null = null;

    try {
      const notifsQuery = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(1));
      unsubNotifs = onSnapshot(notifsQuery, (snapshot) => {
        if (!isSubscribed) return;
        if (!snapshot.empty) {
          const latestDoc = snapshot.docs[0];
          const data = latestDoc.data();
          const notifTitle = (language === 'ha' ? data.title_ha : language === 'en' ? data.title_en : data.title_fr) || data.title || '';
          const notifText = (language === 'ha' ? data.message_ha : language === 'en' ? data.message_en : data.message_fr) || data.message || '';
          
          if (notifText) {
            const uniqueId = `notif_${latestDoc.id}_${notifText}`;
            const dismissedKey = localStorage.getItem('asrarhub_dismissed_announcement_text');
            if (dismissedKey !== uniqueId && dismissedKey !== notifText) {
              setIsAnnouncementDismissed(false);
            } else {
              setIsAnnouncementDismissed(true);
            }
            setAnnouncement({
              title: notifTitle || t('dashboardContent.announcementTitle', 'Annonce'),
              text: notifText,
              visible: true,
              uniqueId: uniqueId
            });
            return;
          }
        }
        setAnnouncement(null);
      }, (err) => {
        console.warn("Notifications onSnapshot in UserDashboard:", err);
        setAnnouncement(null);
      });
    } catch (e) {
      console.warn("Failed to subscribe to notifications for dashboard banner:", e);
      setAnnouncement(null);
    }

    return () => {
      isSubscribed = false;
      if (unsubNotifs) {
        try { unsubNotifs(); } catch (_) {}
      }
    };
  }, [featureToggles, language, t]);

  useEffect(() => {
    if (featureToggles?.premiumPromoText) {
      const dismissedPromoText = localStorage.getItem('asrarhub_dismissed_premium_promo_text');
      if (dismissedPromoText !== featureToggles.premiumPromoText) {
        setIsPremiumPromoDismissed(false);
      } else {
        setIsPremiumPromoDismissed(true);
      }
    } else {
      setIsPremiumPromoDismissed(false);
    }
  }, [featureToggles?.premiumPromoText]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem('asrarhub_cached_categories');
      if (cached) {
        setCategories(JSON.parse(cached));
      }
    } catch (e) {
      console.warn("Notice pre-loading categories from cache:", e);
    }

    const defaultCats = [
      {
        id: 'wird',
        name: 'Versets & Wirds',
        name_en: 'Verses & Wirds',
        name_ha: 'Wirdoshi & Ayoyi',
        iconName: 'BookOpen',
        subCategories: [
          { id: 'wird-protection', name: 'Protection', name_en: 'Protection', name_ha: 'Kariya' },
          { id: 'wird-guerison', name: 'Guérison', name_en: 'Healing', name_ha: 'Waraka' }
        ]
      },
      {
        id: 'secret',
        name: "Secrets d'Asrar",
        name_en: 'Secrets of Asrar',
        name_ha: 'Asrarai',
        iconName: 'Sparkles',
        subCategories: [
          { id: 'secret-richesse', name: 'Prospérité', name_en: 'Prosperity', name_ha: 'Arziki' },
          { id: 'secret-amour', name: 'Affection', name_en: 'Affection', name_ha: 'Soyayya' }
        ]
      },
      {
        id: 'recette',
        name: 'Recettes Spirituelles',
        name_en: 'Spiritual Recipes',
        name_ha: 'Hanyoyi',
        iconName: 'Shield',
        subCategories: [
          { id: 'recette-sante', name: 'Santé', name_en: 'Health', name_ha: 'Lafiya' }
        ]
      }
    ];

    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      let deletedIds: string[] = [];
      try { deletedIds = JSON.parse(localStorage.getItem('asrarhub_deleted_categories') || '[]'); } catch (e) {}

      if (!snapshot.empty) {
        const list = snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
          .filter((cat: any) => !deletedIds.includes(cat.id));
        list.sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));
        setCategories(list);
        try {
          localStorage.setItem('asrarhub_cached_categories', JSON.stringify(list));
        } catch (e) {}
      } else {
        const remainingDefaults = defaultCats.filter(c => !deletedIds.includes(c.id));
        setCategories(remainingDefaults);
      }
    }, (error) => {
      console.warn("Categories fetch note (using local fallback):", error);
      let deletedIds: string[] = [];
      try { deletedIds = JSON.parse(localStorage.getItem('asrarhub_deleted_categories') || '[]'); } catch (e) {}
      const remainingDefaults = defaultCats.filter(c => !deletedIds.includes(c.id));
      setCategories(remainingDefaults);
    });

    return () => unsubscribe();
  }, []);

  const filteredItems = React.useMemo(() => {
    const raw = items.filter(item => {
      let matchesSearch = true;
      
      if (aiSearchResults) {
        matchesSearch = aiSearchResults.includes(item.id);
      } else {
        const q = searchQuery.toLowerCase().trim();
        matchesSearch = !q || [
          item.title,
          item.content,
          item.hook,
          item.verse,
          item.reference,
          ...(item.benefits || [])
        ].some(field => field?.toLowerCase().includes(q));
      }
      
      let matchesFilter = false;
      if (filter === 'all') {
        matchesFilter = true;
      } else if (filter === 'favoris') {
        if (activeFolder) {
          const folder = bookmarkFolders.find(f => f.id === activeFolder);
          matchesFilter = folder ? folder.items.includes(item.id) : false;
        } else {
          matchesFilter = bookmarks.includes(item.id);
        }
      } else {
        const itemCat = (item.category || '').toString().toLowerCase().trim();
        const filterCat = (filter || '').toString().toLowerCase().trim();
        
        const categoryObj = categories.find(c => c.id === filter || c.id?.toLowerCase() === filterCat);
        const categoryName = categoryObj ? (categoryObj.name || '').toLowerCase().trim() : '';

        const isRecette = (filterCat === 'recette' || filterCat === 'recipes') && (itemCat.includes('recette') || itemCat.includes('recipe'));
        const isWird = (filterCat === 'wird' || filterCat === 'wirds' || filterCat === 'zikr') && (itemCat.includes('wird') || itemCat.includes('zikr'));
        const isSecret = (filterCat === 'secret' || filterCat === 'secrets' || filterCat === 'sirr') && (itemCat.includes('secret') || itemCat.includes('sirr'));
        const isRouqyah = (filterCat === 'rouqyah' || filterCat === 'ruqyah') && (itemCat.includes('rouqyah') || itemCat.includes('ruqyah'));
        const isMuraqabah = (filterCat === 'muraqabah' || filterCat === 'meditation') && (itemCat.includes('muraqabah') || itemCat.includes('meditation'));

        const matchesCategory = itemCat === filterCat 
          || (categoryName && (itemCat === categoryName || itemCat.includes(categoryName) || categoryName.includes(itemCat)))
          || isRecette || isWird || isSecret || isRouqyah || isMuraqabah;
        const itemSubCat = (item as any).subCategory || '';
        const matchesSubCat = !selectedSubCategory || itemSubCat === selectedSubCategory;

        matchesFilter = matchesCategory && matchesSubCat;
      }

      return matchesSearch && matchesFilter;
    });

    return sortArticlesInOrder(raw, true);
  }, [items, aiSearchResults, searchQuery, filter, activeFolder, bookmarkFolders, bookmarks, categories, selectedSubCategory]);

  // Force Vite HMR invalidation
  // console.log("UserDashboard loaded");

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-0 pb-24 relative w-full max-w-full overflow-x-clip min-w-0">
      {/* Toolbar - Locked Fixed Second Header flush below main Header */}
      <div className="fixed top-[48px] sm:top-[54px] left-0 right-0 z-40 h-[44px] sm:h-[48px] bg-white dark:bg-gray-900 border-b border-gray-200/80 dark:border-gray-800 px-3 sm:px-6 lg:px-8 shadow-xs flex items-center transition-colors">
        <div className="max-w-5xl mx-auto flex w-full justify-between sm:justify-center items-center gap-1.5 sm:gap-3 px-0 overflow-x-auto hide-scrollbar">
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ width: 40, opacity: 0 }}
              animate={{ width: '100%', maxWidth: '400px', opacity: 1 }}
              exit={{ width: 40, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 overflow-hidden z-10 w-full px-4 sm:px-0"
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('dashboardContent.searchPlaceholder', "Mots-clés, sourates, versets...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAiSearch();
                }}
                className="w-full h-10 pl-10 pr-20 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-sm shadow-sm"
              />
              <Search className="absolute left-7 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              
              <div className="absolute right-6 sm:right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    onClick={handleAiSearch}
                    disabled={isAiSearching}
                    className="p-1.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors flex items-center justify-center"
                    title="Recherche Sémantique IA"
                  >
                    {isAiSearching ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Flame size={16} />
                    )}
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    setAiSearchResults(null);
                    setAiMessage(null);
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {featureToggles['tool_store'] !== 'inactive' && (
          <motion.div
            whileHover={{ scale: 1.08, y: -1.5 }}
            whileTap={{ scale: 0.92 }}
            className={`relative flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <Link
              id="tour-store"
              to="/store"
              className="group relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-amber-600/20 dark:from-amber-900/40 dark:via-amber-800/30 dark:to-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-300/50 dark:border-amber-700/50 h-[34px] w-[34px] sm:h-[42px] sm:w-[42px] flex items-center justify-center shadow-sm overflow-hidden"
              title="Store"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-200/30 dark:via-amber-400/20 to-transparent opacity-0 group-hover:opacity-100"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
              />
              <motion.div
                animate={{ y: [0, -1.5, 0], scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <Store className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] drop-shadow-[0_1px_3px_rgba(245,158,11,0.4)]" />
              </motion.div>
            </Link>
          </motion.div>
        )}

        {featureToggles['tool_lexique'] !== 'inactive' && (
          <motion.div
            whileHover={{ scale: 1.08, y: -1.5 }}
            whileTap={{ scale: 0.92 }}
            className={`relative flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <Link
              id="tour-lexique"
              to="/explore/lexique"
              className="group relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500/15 via-purple-500/10 to-indigo-600/20 dark:from-purple-900/40 dark:via-purple-800/30 dark:to-indigo-950/50 text-purple-600 dark:text-purple-400 border border-purple-300/50 dark:border-purple-700/50 h-[34px] w-[34px] sm:h-[42px] sm:w-[42px] flex items-center justify-center shadow-sm overflow-hidden"
              title={t('nav.lexique', 'Lexique')}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-200/30 dark:via-purple-400/20 to-transparent opacity-0 group-hover:opacity-100"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
              />
              <motion.div
                animate={{ rotate: [0, -3, 3, 0], scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
              >
                <Library className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] drop-shadow-[0_1px_3px_rgba(168,85,247,0.4)]" />
              </motion.div>
            </Link>
          </motion.div>
        )}

        {featureToggles['tool_quran'] !== 'inactive' && (
          <motion.div
            whileHover={{ scale: 1.08, y: -1.5 }}
            whileTap={{ scale: 0.92 }}
            className={`relative flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <Link
              id="tour-quran"
              to="/tools/quran"
              className="group relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500/15 via-emerald-500/10 to-teal-600/20 dark:from-emerald-900/40 dark:via-emerald-800/30 dark:to-teal-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-300/50 dark:border-emerald-700/50 h-[34px] w-[34px] sm:h-[42px] sm:w-[42px] flex items-center justify-center shadow-sm overflow-hidden"
              title="Le Saint Coran"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-200/30 dark:via-emerald-400/20 to-transparent opacity-0 group-hover:opacity-100"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.3, ease: 'linear' }}
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2.7, ease: 'easeInOut' }}
              >
                <BookOpen className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] drop-shadow-[0_1px_3px_rgba(16,185,129,0.4)]" />
              </motion.div>
            </Link>
          </motion.div>
        )}

        <motion.div
          whileHover={{ scale: 1.08, y: -1.5 }}
          whileTap={{ scale: 0.92 }}
          className={`relative flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <Link
            id="tour-calendar-mystic"
            to="/explore/calendar"
            className="group relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-orange-600/20 dark:from-amber-900/40 dark:via-amber-800/30 dark:to-orange-950/50 text-amber-600 dark:text-amber-400 border border-amber-300/50 dark:border-amber-700/50 h-[34px] w-[34px] sm:h-[42px] sm:w-[42px] flex items-center justify-center shadow-sm overflow-hidden"
            title="Calendrier Mystique"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-200/30 dark:via-amber-400/20 to-transparent opacity-0 group-hover:opacity-100"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            />
            <motion.div
              animate={{ y: [0, -1.5, 0], rotate: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            >
              <Calendar className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] drop-shadow-[0_1px_3px_rgba(245,158,11,0.4)]" />
            </motion.div>
          </Link>
        </motion.div>

        {/* PDF Documents Library Icon */}
        <motion.div
          whileHover={{ scale: 1.08, y: -1.5 }}
          whileTap={{ scale: 0.92 }}
          className={`relative flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <Link
            id="tour-pdf-library"
            to="/pdf-library"
            className="group relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-rose-500/15 via-red-500/10 to-red-600/20 dark:from-rose-950/40 dark:via-red-900/30 dark:to-red-950/50 text-red-600 dark:text-red-400 border border-red-300/50 dark:border-red-700/50 h-[34px] w-[34px] sm:h-[42px] sm:w-[42px] flex items-center justify-center shadow-sm overflow-hidden"
            title={language === 'fr' ? 'Bibliothèque PDF & Manuscrits' : 'PDF Sacred Library'}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-200/30 dark:via-red-400/20 to-transparent opacity-0 group-hover:opacity-100"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: 'linear' }}
            />
            <motion.div
              animate={{ scale: [1, 1.06, 1], rotate: [0, -2, 2, 0] }}
              transition={{ repeat: Infinity, duration: 3.1, ease: 'easeInOut' }}
              className="relative flex items-center justify-center"
            >
              <FileText className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] drop-shadow-[0_1px_3px_rgba(239,68,68,0.4)]" />
              <span className="absolute -top-1.5 -right-2 text-[7px] font-black bg-red-600 text-white px-0.5 rounded leading-none">
                PDF
              </span>
            </motion.div>
          </Link>
        </motion.div>

        {/* Contenu Hors-Ligne (IndexedDB) Vault Button */}
        <motion.div
          whileHover={{ scale: 1.08, y: -1.5 }}
          whileTap={{ scale: 0.92 }}
          className={`relative flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <button
            id="tour-offline-vault"
            onClick={() => {
              setFilter(filter === 'offline' ? 'all' : 'offline');
            }}
            className={`group relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl border h-[34px] w-[34px] sm:h-[42px] sm:w-[42px] flex items-center justify-center shadow-sm overflow-hidden transition-all ${
              filter === 'offline'
                ? 'bg-gradient-to-br from-teal-500/30 via-emerald-500/25 to-cyan-600/35 text-teal-600 dark:text-teal-300 border-teal-500 dark:border-teal-400 ring-2 ring-teal-400/40'
                : 'bg-gradient-to-br from-teal-500/15 via-teal-500/10 to-cyan-600/20 dark:from-teal-950/40 dark:via-teal-900/30 dark:to-cyan-950/50 text-teal-600 dark:text-teal-400 border-teal-300/50 dark:border-teal-700/50'
            }`}
            title={language === 'fr' ? 'Contenu Hors-Ligne (Articles & Outils enregistrés)' : 'Offline Vault (Saved Articles & Tools)'}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-teal-200/30 dark:via-teal-400/20 to-transparent opacity-0 group-hover:opacity-100"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
            />
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="relative flex items-center justify-center"
            >
              <HardDrive className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] drop-shadow-[0_1px_3px_rgba(20,184,166,0.4)]" />
            </motion.div>
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.08, y: -1.5 }}
          whileTap={{ scale: 0.92 }}
          className={`relative flex-shrink-0 transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <button
            id="tour-search"
            onClick={() => setIsGlobalSearchOpen(true)}
            className="group relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-200 border border-gray-300/60 dark:border-gray-700 h-[34px] w-[34px] sm:h-[42px] sm:w-[42px] flex items-center justify-center shadow-sm overflow-hidden"
            aria-label="Search"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-200/30 dark:via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
            />
            <motion.div
              animate={{ scale: [1, 1.08, 1], rotate: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}
            >
              <Search className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
            </motion.div>
          </button>
        </motion.div>

        <div className={`relative transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <motion.div
            whileHover={{ scale: 1.08, y: -1.5 }}
            whileTap={{ scale: 0.92 }}
          >
            <button
              id="tour-filter"
              onClick={() => setIsCategoryModalOpen(true)}
              className={`group relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl border h-[34px] w-[34px] sm:h-[42px] sm:w-[42px] flex items-center justify-center transition-colors shadow-sm flex-shrink-0 overflow-hidden ${
                filter !== 'all' || isCategoryModalOpen
                  ? 'bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-teal-600/20 dark:from-emerald-900/50 dark:via-emerald-800/40 dark:to-teal-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-400/60 dark:border-emerald-700'
                  : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-200 border-gray-300/60 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              aria-label="Filter"
              title="Catégories"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-200/30 dark:via-emerald-400/20 to-transparent opacity-0 group-hover:opacity-100"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
              />
              <motion.div
                animate={{ scale: [1, 1.06, 1], y: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 3.1, ease: 'easeInOut' }}
              >
                <Filter className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px]" />
              </motion.div>
              {filter !== 'all' && (
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-0.5 right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 border border-white dark:border-gray-800 shadow-[0_0_6px_rgba(16,185,129,0.8)]"
                />
              )}
            </button>
          </motion.div>

          {/* Categories Filter Modal */}
          <AnimatePresence>
            {isCategoryModalOpen && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', duration: 0.35 }}
                  className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col max-h-[85vh] z-[120]"
                >
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50 dark:bg-gray-800/80 backdrop-blur-md">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {t('filterByCategory', 'Filtrer par Catégorie')}
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {t('filterByCategoryDesc', 'Explorez les articles par thématiques spirituelles')}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[60vh] scrollbar-thin">
                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        onClick={() => {
                          setFilter('all');
                          setSelectedSubCategory('');
                          setIsCategoryModalOpen(false);
                        }}
                        className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all shadow-sm ${
                          filter === 'all'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
                            : 'bg-white border-gray-200 text-gray-650 hover:bg-gray-50 dark:bg-gray-850 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        <FolderOpen size={20} />
                        <span className="text-xs font-bold">{t('all', 'Tout')}</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">{items.length} {t('articles', 'art.')}</span>
                      </button>

                      <button
                        onClick={() => {
                          setFilter('favoris');
                          setSelectedSubCategory('');
                          setIsCategoryModalOpen(false);
                        }}
                        className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all shadow-sm ${
                          filter === 'favoris'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
                            : 'bg-white border-gray-200 text-gray-650 hover:bg-gray-50 dark:bg-gray-850 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Star size={20} />
                        <span className="text-xs font-bold">{t('favorites', 'Favoris')}</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">{bookmarks.length} {t('saved', 'sauv.')}</span>
                      </button>

                      <button
                        onClick={() => {
                          setFilter('offline');
                          setSelectedSubCategory('');
                          setIsCategoryModalOpen(false);
                        }}
                        className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all shadow-sm ${
                          filter === 'offline'
                            ? 'bg-teal-50 border-teal-200 text-teal-600 dark:bg-teal-900/30 dark:border-teal-700 dark:text-teal-300 ring-1 ring-teal-400/40'
                            : 'bg-white border-gray-200 text-gray-650 hover:bg-gray-50 dark:bg-gray-850 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        <HardDrive size={20} className="text-teal-600 dark:text-teal-400" />
                        <span className="text-xs font-bold">Hors-Ligne</span>
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">Local</span>
                      </button>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-gray-700/50 my-2" />

                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('categories', 'Thématiques')}</h4>
                    
                    <div className="space-y-3">
                      {categories.map((cat, catIdx) => {
                        const isSelected = filter === cat.id;
                        const artCount = items.filter(a => a.category === cat.id).length;
                        
                        let displayName = cat.name;
                        if (language === 'en' && cat.name_en) displayName = cat.name_en;
                        if (language === 'ha' && cat.name_ha) displayName = cat.name_ha;

                        return (
                          <div key={cat.id ? `cat-${cat.id}` : `cat-${catIdx}`} className={`rounded-2xl border transition-all ${
                            isSelected 
                              ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/10 dark:bg-emerald-900/5'
                              : 'border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30'
                          }`}>
                            <button
                              onClick={() => {
                                setFilter(cat.id);
                                setSelectedSubCategory('');
                              }}
                              className="w-full p-4 flex items-center justify-between text-left transition-colors hover:bg-emerald-50/5 dark:hover:bg-emerald-900/5 rounded-t-2xl"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${
                                  isSelected 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-white dark:bg-gray-850 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700'
                                }`}>
                                  <LucideIcon name={cat.iconName || 'FolderOpen'} size={20} />
                                </div>
                                <div>
                                  <span className={`text-sm font-bold block ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {displayName}
                                  </span>
                                  <span className="text-xs text-gray-400 dark:text-gray-500">
                                    {artCount} {artCount > 1 ? t('articlesCountPlural', 'articles') : t('articlesCountSingular', 'article')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                              </div>
                            </button>

                            {isSelected && (cat.subCategories || []).length > 0 && (
                              <div className="px-4 pb-4 pt-1 flex flex-wrap gap-2 border-t border-dashed border-gray-100 dark:border-gray-700/50">
                                <button
                                  onClick={() => {
                                    setSelectedSubCategory('');
                                    setIsCategoryModalOpen(false);
                                  }}
                                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                    !selectedSubCategory
                                      ? 'bg-emerald-600 text-white shadow-sm'
                                      : 'bg-white border border-gray-150 text-gray-600 hover:bg-gray-50 dark:bg-gray-850 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  {t('allSub', 'Tout')}
                                </button>
                                {(cat.subCategories || []).map((sub: any, subIdx: number) => {
                                  const isSubSelected = selectedSubCategory === sub.id;
                                  let subDisplayName = sub.name;
                                  if (language === 'en' && sub.name_en) subDisplayName = sub.name_en;
                                  if (language === 'ha' && sub.name_ha) subDisplayName = sub.name_ha;

                                  return (
                                    <button
                                      key={sub.id ? `sub-${cat.id}-${sub.id}` : `sub-${catIdx}-${subIdx}`}
                                      onClick={() => {
                                        setSelectedSubCategory(sub.id);
                                        setIsCategoryModalOpen(false);
                                      }}
                                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                        isSubSelected
                                          ? 'bg-emerald-600 text-white shadow-sm'
                                          : 'bg-white border border-gray-150 text-gray-600 hover:bg-gray-50 dark:bg-gray-850 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                                      }`}
                                    >
                                      {subDisplayName}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/80 backdrop-blur-md flex justify-end">
                    <button
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
                    >
                      {t('apply', 'Appliquer')}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {isLayoutFree && (
          <div id="tour-layout" className={`flex bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-0.5 sm:p-1 flex-shrink-0 h-[34px] sm:h-[42px] items-center transition-opacity duration-200 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <button 
              onClick={() => setLayoutMode('grid2')}
              className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-colors ${layoutMode === 'grid2' ? 'bg-gray-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              title="2 Colonnes"
            >
              <LayoutGrid className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px]" />
            </button>
            <button 
              onClick={() => setLayoutMode('grid1')}
              className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-colors ${layoutMode === 'grid1' ? 'bg-gray-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              title="1 Colonne"
            >
              <Square className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px]" />
            </button>
            <button 
              onClick={() => setLayoutMode('list')}
              className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-colors ${layoutMode === 'list' ? 'bg-gray-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              title="Liste"
            >
              <List className="w-[15px] h-[15px] sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Spacer for fixed second toolbar with scroll-margin compensation & Admin Dynamic Feed Offset */}
      <div 
        style={{ 
          height: `max(0px, calc(42px + var(--feed-home-offset, 0px) + var(--feed-global-offset, 0px)))` 
        }} 
        aria-hidden="true" 
      />

      {/* Pull To Refresh for live view revalidation */}
      <PullToRefresh
        onRefresh={revalidateDashboardData}
        className="scroll-mt-[88px] pt-0"
        pullText={t('pullToRefresh.pull', 'Tirer pour actualiser')}
        releaseText={t('pullToRefresh.release', 'Relâcher pour actualiser')}
        refreshingText={t('pullToRefresh.refreshing', 'Actualisation...')}
        successText={t('pullToRefresh.success', 'À jour')}
      >
        {/* Onboarding Tour */}
        <OnboardingTour />

      {/* Tools Video Animated Slider */}
      <div 
        className="scroll-mt-[88px] snap-start mb-1.5"
        style={{
          marginTop: `calc(var(--feed-home-slider-offset, 0px))`
        }}
      >
        <ToolsVideoSlider />
      </div>

      {/* Interactive Quick Favorites Widget (Exact design & translation as requested) */}
      <div className="mb-2.5 sm:mb-3">
        <AsrarQuickWidget variant="inline" />
      </div>

      {/* Banner Section */}
      <div className="mb-2.5 sm:mb-3 grid grid-cols-1 gap-3">
        {/* Promo Announcement Banner if published by admin */}
        <PromoAnnouncementBanner pageLocation="home" className="shadow-md" />

        {/* Annonce Board */}
        {announcement && announcement.visible && !isAnnouncementDismissed && (
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-900 dark:to-teal-900 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden text-white flex flex-col justify-between">
            <div className="relative z-10 flex flex-col justify-center mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider backdrop-blur-sm">{t('dashboardContent.announcement', 'Annonce')}</span>
                {user?.streakDays !== undefined && user.streakDays > 0 && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-orange-500/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm border border-orange-400/50"
                  >
                    <Flame size={12} className="text-yellow-300" />
                    {user.streakDays} Jours de suite
                  </motion.div>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">{announcement.title || t('dashboardContent.announcementTitle', 'Nouvelles mises à jour disponibles !')}</h3>
              <p className="text-emerald-50 dark:text-emerald-100 max-w-lg text-sm sm:text-base leading-relaxed">
                {announcement.text || t('dashboardContent.announcementText', 'Découvrez la nouvelle version des outils d\'AsrarHub. Le Saint Coran est désormais disponible avec une option de téléchargement pour une lecture hors ligne fluide et rapide.')}
              </p>
            </div>
            
            <div className="relative z-10 mt-auto flex flex-wrap items-center gap-3">
              {announcement.link ? (
                announcement.link.startsWith('http') ? (
                  <a
                    href={announcement.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-sm"
                  >
                    <span>{announcement.buttonText || (language === 'ha' ? 'Duba' : language === 'en' ? 'Open' : 'Ouvrir')}</span>
                    <ArrowRight size={15} />
                  </a>
                ) : (
                  <Link
                    to={announcement.link}
                    className="inline-flex items-center gap-1.5 bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-sm"
                  >
                    <span>{announcement.buttonText || (language === 'ha' ? 'Duba' : language === 'en' ? 'Ouvrir' : 'Ouvrir')}</span>
                    <ArrowRight size={15} />
                  </Link>
                )
              ) : lastReadPosition ? (
                <Link to="/tools/quran?resume=true" className="inline-flex items-center gap-1.5 bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-3 py-1.5 rounded-lg text-sm transition-colors shadow-sm">
                  <BookOpen size={16} />
                  Reprendre : {lastReadPosition.surahName} (Verset {lastReadPosition.ayahNumberInSurah})
                </Link>
              ) : null}

              <button 
                onClick={() => {
                  const keyToDismiss = announcement.uniqueId || announcement.text;
                  localStorage.setItem('asrarhub_dismissed_announcement_text', keyToDismiss);
                  setIsAnnouncementDismissed(true);
                }}
                className="inline-flex items-center gap-1.5 bg-emerald-700/50 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-lg text-sm transition-colors cursor-pointer"
              >
                {language === 'ha' ? 'Na gani' : language === 'en' ? 'Got it' : 'Compris'}
              </button>
            </div>
          </div>
        )}

        {/* Annonce d'incitation Premium */}
        {!(user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'pro' || user?.role === 'admin' || isAuthPremium) && featureToggles?.premiumPromoActive && !isPremiumPromoDismissed && (
          <div className={`rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden text-white flex flex-col justify-between ${
            featureToggles.premiumPromoTheme === 'gold' 
              ? 'bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-500 border border-amber-400/30' 
              : featureToggles.premiumPromoTheme === 'cosmic' 
              ? 'bg-gradient-to-br from-gray-950 via-purple-950 to-indigo-950 border border-purple-800/30'
              : featureToggles.premiumPromoTheme === 'emerald'
              ? 'bg-gradient-to-br from-teal-500 to-emerald-700 border border-teal-400/30'
              : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 border border-purple-500/30' // default violet
          }`}>
            {/* Arrière-plan stylisé */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-black/15 rounded-full blur-xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col justify-center mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-white/20 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                  <Sparkles size={12} className="text-yellow-300 animate-pulse" /> Offre Spéciale
                </span>
                
                <button 
                  onClick={() => {
                    localStorage.setItem('asrarhub_dismissed_premium_promo_text', featureToggles.premiumPromoText || '');
                    setIsPremiumPromoDismissed(true);
                  }}
                  className="bg-black/10 hover:bg-black/20 text-white/80 hover:text-white p-1.5 rounded-full transition-colors"
                  title="Fermer la promotion"
                >
                  <X size={16} />
                </button>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-2 flex items-center gap-2">
                {featureToggles.premiumPromoTitle || "Devenez membre Premium !"}
              </h3>
              <p className="text-white/95 max-w-2xl text-sm sm:text-base leading-relaxed">
                {featureToggles.premiumPromoText || "Débloquez tous les secrets de l'Asrar, l'assistant IA et tous les outils spirituels."}
              </p>
            </div>
            
            <div className="relative z-10 mt-auto flex flex-wrap items-center gap-3 pt-2">
              <Link to="/payment" className="inline-flex items-center gap-2 bg-white text-gray-950 hover:bg-gray-100 font-extrabold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md transform hover:-translate-y-0.5">
                <Sparkles size={16} className="text-purple-600 fill-purple-200" />
                {featureToggles.premiumPromoBtnText || "Passer au Premium"}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Hijri Calendar Widget */}
      <div className="mb-2.5 sm:mb-3">
        <HijriCalendarWidget />
      </div>

      {/* Daily Goals Tracking */}
      <div className="mb-2.5 sm:mb-3">
        <DailyGoalsTracker />
      </div>

      {/* Last Consulted Tool Widget */}
      {(() => {
        const lastTool = lastToolId ? tools.find(t => t.id === lastToolId) : null;
        if (!lastTool) return null;
        return (
          <div className="mb-2.5 sm:mb-3 bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${lastTool.color} text-white flex items-center justify-center shadow-sm`}>
                  {React.createElement(lastTool.icon, { size: 20 })}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base">
                    {language === 'fr' ? 'Dernier outil consulté' : language === 'ha' ? 'Kayan aiki na baya' : 'Last consulted tool'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                    {t(`tools.${lastTool.id}.title`) !== `tools.${lastTool.id}.title`
                      ? t(`tools.${lastTool.id}.title`)
                      : lastTool.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(lastTool.path)}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'fr' ? 'Reprendre la pratique' : language === 'ha' ? 'Koma aiki' : 'Resume practice'}</span>
                <ChevronDown size={14} className="-rotate-90" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* Reading History */}
      {readingHistory.length > 0 && (
        <div className="mb-4 bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              className="flex items-start gap-3 text-left focus:outline-none select-none flex-1 group"
            >
              <div className="mt-1 p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                <RefreshCw className="animate-spin-slow" size={18} />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base sm:text-lg">
                  {language === 'fr' ? 'Dernières lectures' : language === 'ha' ? 'Tarihin Karatu' : 'Reading History'}
                  <ChevronDown size={18} className={`text-gray-400 transition-transform duration-250 shrink-0 ${isHistoryExpanded ? 'rotate-180' : ''}`} />
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {language === 'fr' ? 'Reprenez rapidement la lecture de vos derniers secrets ou wirds consultés.' :
                   language === 'ha' ? 'Koma baya cikin sauƙi don duba sirruka da zikirai na baya.' :
                   'Quickly resume reading your recently viewed secrets or wirds.'}
                </p>
              </div>
            </button>
            <button
              onClick={() => {
                if (confirm(language === 'fr' ? 'Voulez-vous effacer votre historique de lecture ?' : language === 'ha' ? 'Shin kuna son goge tarihin karatun ku?' : 'Do you want to clear your reading history?')) {
                  localStorage.removeItem('asrar_reading_history');
                  setReadingHistory([]);
                }
              }}
              className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all shrink-0 ml-2"
            >
              {language === 'fr' ? "Effacer" : language === 'ha' ? "Goge" : "Clear"}
            </button>
          </div>
          
          <AnimatePresence initial={false}>
            {isHistoryExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {readingHistory.map((item, histIdx) => {
                    const formatTimeAgo = (timestamp: number) => {
                      const seconds = Math.floor((Date.now() - timestamp) / 1000);
                      const minutes = Math.floor(seconds / 60);
                      const hours = Math.floor(minutes / 60);
                      const days = Math.floor(hours / 24);

                      if (language === 'fr') {
                        if (seconds < 60) return "À l'instant";
                        if (minutes < 60) return `Il y a ${minutes} min`;
                        if (hours < 24) return `Il y a ${hours} h`;
                        return `Il y a ${days} j`;
                      } else if (language === 'ha') {
                        if (seconds < 60) return "Yanzu-yanzu";
                        if (minutes < 60) return `Minti ${minutes} da suka wuce`;
                        if (hours < 24) return `Awanni ${hours} da suka wuce`;
                        return `Kwana ${days} da suka wuce`;
                      } else {
                        if (seconds < 60) return "Just now";
                        if (minutes < 60) return `${minutes}m ago`;
                        if (hours < 24) return `${hours}h ago`;
                        return `${days}d ago`;
                      }
                    };

                    const categoryColors: Record<string, string> = {
                      secret: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
                      wird: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
                      recette: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
                    };

                    return (
                      <Link
                        key={item.id ? `history-${item.id}-${item.viewedAt || histIdx}` : `history-${histIdx}`}
                        to={`/secret/${item.id}`}
                        className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-750/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-emerald-100 dark:hover:border-emerald-800 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-emerald-500/10 flex-shrink-0 flex items-center justify-center relative">
                          {item.imageUrl ? (
                            <img
                              referrerPolicy="no-referrer"
                              src={item.imageUrl}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <BookOpen className="text-emerald-500 w-5 h-5" />
                          )}
                          {item.isPremium && (
                            <div className="absolute top-0 right-0 bg-amber-500 text-white p-0.5 rounded-bl-lg text-[8px] font-bold">
                              ★
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md border ${categoryColors[item.category] || categoryColors.secret}`}>
                              {item.category === 'wird' ? (language === 'fr' ? 'Verset' : language === 'ha' ? 'Wirdi' : 'Verse') :
                               item.category === 'secret' ? 'Secret' :
                               (language === 'fr' ? 'Recette' : language === 'ha' ? 'Girke-girke' : 'Recipe')}
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                              {formatTimeAgo(item.viewedAt)}
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {item.title}
                          </h4>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="mb-4 grid grid-cols-1 gap-4">
        {/* My Quran Bookmarks */}
        {quranBookmarks.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Bookmark className="text-emerald-500" size={18} /> Signets du Coran
            </h3>
            <div className="space-y-3">
              {quranBookmarks.map((bookmark, idx) => (
                <Link
                  key={bookmark.id ? `quran-bm-${bookmark.id}-${idx}` : `quran-bm-${bookmark.surahNumber}-${bookmark.ayahNumberInSurah}-${idx}`}
                  to={`/tools/quran?surah=${bookmark.surahNumber}&ayah=${bookmark.ayahNumberInSurah}`}
                  className="block bg-gray-50 dark:bg-gray-750 rounded-xl p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Sourate {bookmark.surahName}
                    </h4>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400 px-2 py-1 rounded-full">
                      Verset {bookmark.ayahNumberInSurah}
                    </span>
                  </div>
                  {bookmark.note && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">"{bookmark.note}"</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>


      
      {searchQuery && (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex flex-shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Search size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('searchInQuran', `Rechercher "{searchQuery}" dans le Saint Coran`).replace('{searchQuery}', searchQuery)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('searchInQuranDesc', 'Explorez les versets et traductions correspondants.')}</p>
            </div>
          </div>
          <Link
            to={`/tools/quran?search=${encodeURIComponent(searchQuery)}`}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-sm transition-colors text-center shrink-0 flex items-center justify-center gap-2"
          >
            <BookOpen size={16} /> {t('searchButton', 'Rechercher')}
          </Link>
        </div>
      )}

      {aiMessage && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex flex-shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Flame size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-300 mb-1">Assistant Spirituel IA</h3>
            <p className="text-sm text-emerald-800 dark:text-emerald-400/90 leading-relaxed whitespace-pre-wrap">{aiMessage}</p>
          </div>
        </div>
      )}

      {filter === 'favoris' && (
        <div className="space-y-4 mb-6">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-3 pb-2">
              <button
                onClick={() => setActiveFolder(null)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors border ${
                  activeFolder === null 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:border-emerald-800 dark:text-emerald-300' 
                    : 'bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                }`}
              >
                <Bookmark size={16} /> Tous les favoris
              </button>
              {bookmarkFolders.map((folder, fIdx) => (
                <button
                  key={folder.id ? `folder-btn-${folder.id}` : `folder-btn-${fIdx}`}
                  onClick={() => setActiveFolder(folder.id)}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors border ${
                    activeFolder === folder.id 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:border-emerald-800 dark:text-emerald-300' 
                      : 'bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Folder size={16} /> {folder.name}
                </button>
              ))}
              <button
                onClick={() => {
                  const name = prompt("Nom du nouveau dossier :");
                  if (name && name.trim()) {
                    const newFolder = { id: Date.now().toString(), name: name.trim(), items: [] };
                    const newFolders = [...bookmarkFolders, newFolder];
                    setBookmarkFolders(newFolders);
                    localStorage.setItem('asrar_bookmark_folders', JSON.stringify(newFolders));
                  }
                }}
                className="px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors border bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Plus size={16} /> Nouveau
              </button>
            </div>
          </div>

          {activeFolder && (
            <div className="flex items-center gap-3 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 px-4 py-2.5 rounded-2xl w-fit">
              <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                Dossier : <span className="font-bold underline">{bookmarkFolders.find(f => f.id === activeFolder)?.name}</span>
              </span>
              <div className="flex items-center gap-1.5 border-l border-emerald-500/20 pl-3">
                <button
                  onClick={() => {
                    const folder = bookmarkFolders.find(f => f.id === activeFolder);
                    if (!folder) return;
                    const newName = prompt("Nouveau nom du dossier :", folder.name);
                    if (newName && newName.trim()) {
                      const updated = bookmarkFolders.map(f => f.id === activeFolder ? { ...f, name: newName.trim() } : f);
                      setBookmarkFolders(updated);
                      localStorage.setItem('asrar_bookmark_folders', JSON.stringify(updated));
                    }
                  }}
                  className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                  title="Renommer le dossier"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Êtes-vous sûr de vouloir supprimer ce dossier ? Les Wirds et Secrets resteront dans vos favoris, mais ne seront plus classés dans ce dossier.")) {
                      const updated = bookmarkFolders.filter(f => f.id !== activeFolder);
                      setBookmarkFolders(updated);
                      localStorage.setItem('asrar_bookmark_folders', JSON.stringify(updated));
                      setActiveFolder(null);
                    }
                  }}
                  className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  title="Supprimer le dossier"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {filter === 'offline' ? (
        <div className="mb-8">
          <OfflineDashboardSection />
        </div>
      ) : (
        <div className={`grid gap-3 sm:gap-6 lg:gap-8 w-full max-w-full min-w-0 ${
          layoutMode === 'grid2' ? 'grid-cols-2 lg:grid-cols-3' : 
          layoutMode === 'list' ? 'grid-cols-1 lg:grid-cols-2' : 
          'grid-cols-1'
        }`}>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/80 p-4 animate-pulse h-48 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 dark:bg-gray-750 rounded-md w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-750 rounded-full w-8"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-750 rounded-md w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-750 rounded-md w-5/6"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-750 rounded-md w-1/3"></div>
            </div>
          ))
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item, itemIdx) => {
            const currentFolder = bookmarkFolders.find(f => f.items.includes(item.id));
            return (
              <div key={item.id ? `card-item-${item.id}-${itemIdx}` : `card-item-${itemIdx}`} className="flex flex-col h-full">
                <div className="flex-1">
                  <SecretCard item={item} layoutMode={layoutMode} categories={categories} />
                </div>
                
                {filter === 'favoris' && (
                  <div className="mt-2 p-2 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-between gap-2 shadow-sm">
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 pl-1 truncate">
                      <Folder size={12} className="text-emerald-500 shrink-0" />
                      <span className="truncate max-w-[100px] sm:max-w-[130px]" title={currentFolder?.name || "Sans dossier"}>
                        {currentFolder?.name || "Sans dossier"}
                      </span>
                    </span>
                    
                    <select
                      value={currentFolder?.id || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__new__') {
                          const name = prompt("Nom du nouveau dossier :");
                          if (name && name.trim()) {
                            const newId = Date.now().toString();
                            const newFolder = { id: newId, name: name.trim(), items: [item.id] };
                            const updated = bookmarkFolders.map(f => {
                              f.items = f.items.filter(id => id !== item.id);
                              return f;
                            });
                            const finalFolders = [...updated, newFolder];
                            setBookmarkFolders(finalFolders);
                            localStorage.setItem('asrar_bookmark_folders', JSON.stringify(finalFolders));
                          }
                        } else {
                          const updated = bookmarkFolders.map(f => {
                            f.items = f.items.filter(id => id !== item.id);
                            if (f.id === val) {
                              f.items.push(item.id);
                            }
                            return f;
                          });
                          setBookmarkFolders(updated);
                          localStorage.setItem('asrar_bookmark_folders', JSON.stringify(updated));
                        }
                      }}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-2 py-1 text-[11px] text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
                    >
                      <option value="">📁 Aucun dossier</option>
                      {bookmarkFolders.map((f, optIdx) => (
                        <option key={f.id ? `f-opt-${f.id}` : `f-opt-${optIdx}`} value={f.id}>{f.name}</option>
                      ))}
                      <option value="__new__" className="text-emerald-600 dark:text-emerald-400 font-semibold">+ Nouveau dossier...</option>
                    </select>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 px-4 text-center flex flex-col items-center bg-white dark:bg-gray-800/60 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm my-4">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-800/50 shadow-inner">
              <Search size={28} />
            </div>
            
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              {filter === 'favoris'
                ? (language === 'fr' ? 'Aucun article favori' : 'No saved favorites')
                : searchQuery
                ? (language === 'fr' ? `Aucun résultat pour "${searchQuery}"` : `No results for "${searchQuery}"`)
                : items.length > 0
                ? (language === 'fr' ? 'Aucun article dans cette catégorie' : 'No articles in this category')
                : (language === 'fr' ? 'Aucun article disponible' : 'No articles available')}
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mb-5 leading-relaxed">
              {filter === 'favoris'
                ? (language === 'fr' ? 'Vous n\'avez pas encore ajouté d\'articles à vos favoris. Cliquez sur l\'icône marque-page pour sauvegarder un article.' : 'You have not added any articles to your favorites yet.')
                : searchQuery
                ? (language === 'fr' ? 'Essayez de chercher avec d\'autres mots-clés ou réinitialisez le filtre.' : 'Try searching with other keywords.')
                : items.length > 0
                ? (language === 'fr' ? `Les ${items.length} articles disponibles appartiennent à d'autres catégories.` : `Articles belong to other categories.`)
                : (language === 'fr' ? 'La base de données ne contient aucun article publié pour le moment.' : 'No articles found in database.')}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {(filter !== 'all' || searchQuery || selectedSubCategory || aiSearchResults) && (
                <button
                  onClick={() => {
                    setFilter('all');
                    setSelectedSubCategory('');
                    setSearchQuery('');
                    setAiSearchResults(null);
                    setAiMessage(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FolderOpen size={15} />
                  <span>{language === 'fr' ? `Voir tous les articles (${items.length})` : `Show all articles (${items.length})`}</span>
                </button>
              )}

              {isOffline && items.length === 0 && (
                <button
                  onClick={() => setShowOfflineModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={15} />
                  <span>{language === 'fr' ? 'Notification Hors Ligne' : 'Offline Notification'}</span>
                </button>
              )}

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Sparkles size={15} />
                  <span>{language === 'fr' ? 'Publier un article (Admin)' : 'Publish an article (Admin)'}</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      )}
      </PullToRefresh>
      <GlobalSearchModal isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />
      <MysticCalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
      
      {/* Offline sync notification popup */}
      <OfflineArticlesPopup
        isOpen={showOfflineModal || (isOffline && items.length === 0)}
        onClose={() => setShowOfflineModal(false)}
        onConnectedAndSynced={(synced) => {
          if (Array.isArray(synced) && synced.length > 0) {
            setItems(synced);
          }
        }}
        articleCount={items.length}
      />
    </div>
  );
};

export default UserDashboard;
