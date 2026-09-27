import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  Download, 
  HardDrive, 
  Sparkles, 
  Filter, 
  BookOpen, 
  LayoutGrid, 
  List, 
  Plus, 
  Shield, 
  CheckCircle2, 
  FolderOpen, 
  AlertCircle, 
  RefreshCw,
  Layers,
  ArrowLeft,
  Share2,
  Check,
  Tag,
  ChevronRight,
  X
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PdfDocument } from '../../types/pdfDocument';
import { DEFAULT_PDF_DOCUMENTS } from '../../data/defaultPdfDocuments';
import { PdfCard } from '../../components/pdf/PdfCard';
import { PdfViewerModal } from '../../components/pdf/PdfViewerModal';
import { getAllOfflinePdfs, isPdfOfflineAvailable } from '../../utils/pdfOfflineVault';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getApiUrl } from '../../lib/api';
import { 
  PDF_AUTO_CATEGORIES, 
  detectPdfAutoCategories, 
  groupPdfsByAutoCategories, 
  PdfCategoryTag 
} from '../../utils/pdfAutoTagging';

export const PdfLibraryPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [pdfs, setPdfs] = useState<PdfDocument[]>(DEFAULT_PDF_DOCUMENTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAutoCategory, setSelectedAutoCategory] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<'all' | 'offline' | 'premium'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'grouped'>('grid');
  const [activePdfForReading, setActivePdfForReading] = useState<PdfDocument | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());
  const [offlineStats, setOfflineStats] = useState<{ count: number; totalBytes: number }>({ count: 0, totalBytes: 0 });
  const [copiedToast, setCopiedToast] = useState(false);

  const isAdmin = user?.role === 'admin' || sessionStorage.getItem('admin_bypass') === 'true';

  // Share entire library or link via Web Share API with clipboard fallback
  const handleShareLibrary = async () => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/pdf-library` : '';
    const shareTitle = language === 'fr' 
      ? 'Bibliothèque de Livres & Manuscrits Sacrés PDF - AsrarHub' 
      : 'Sacred PDF Books & Manuscripts Library - AsrarHub';
    const shareText = language === 'fr'
      ? 'Découvrez et consultez les livres rares, manuscrits spirituels et recettes ésotériques au format PDF sur AsrarHub :'
      : 'Explore and read rare sacred books, manuscripts, and spiritual secrets in PDF on AsrarHub:';

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError' && typeof navigator !== 'undefined' && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopiedToast(true);
          setTimeout(() => setCopiedToast(false), 2500);
        } catch (_) {}
      }
    }
  };

  // Load live PDFs from Firestore + Server Storage + Local Seed Fallback
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let isMounted = true;

    const loadPdfs = async () => {
      let serverCustoms: PdfDocument[] = [];
      try {
        const srvRes = await fetch(getApiUrl('/api/pdf/custom-list'));
        if (srvRes.ok) {
          const json = await srvRes.json();
          if (json.pdfs && Array.isArray(json.pdfs)) {
            serverCustoms = json.pdfs;
          }
        }
      } catch (_) {}

      try {
        const q = query(collection(db, 'pdf_documents'));
        unsubscribe = onSnapshot(q, (snapshot) => {
          if (!isMounted) return;
          const firestorePdfs = !snapshot.empty
            ? (snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as PdfDocument[])
            : [];

          const seen = new Set<string>();
          const merged: PdfDocument[] = [];

          // 1. Firestore docs
          for (const p of firestorePdfs) {
            if (!seen.has(p.id)) {
              seen.add(p.id);
              merged.push(p);
            }
          }

          // 2. Server Custom docs
          for (const p of serverCustoms) {
            if (!seen.has(p.id)) {
              seen.add(p.id);
              merged.push(p);
            }
          }

          // 3. Seed defaults
          for (const p of DEFAULT_PDF_DOCUMENTS) {
            if (!seen.has(p.id)) {
              seen.add(p.id);
              merged.push(p);
            }
          }

          merged.sort((a, b) => {
            const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
            const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
            return dateB - dateA;
          });

          setPdfs(merged);
          setLoading(false);
        }, (err) => {
          console.warn('Firestore PDF onSnapshot notice:', err);
          if (isMounted) {
            const defaultsAndServer = [...serverCustoms, ...DEFAULT_PDF_DOCUMENTS.filter(d => !serverCustoms.some(s => s.id === d.id))];
            setPdfs(defaultsAndServer.length > 0 ? defaultsAndServer : DEFAULT_PDF_DOCUMENTS);
            setLoading(false);
          }
        });
      } catch (e) {
        console.warn('PDF stream init notice:', e);
        if (isMounted) {
          const defaultsAndServer = [...serverCustoms, ...DEFAULT_PDF_DOCUMENTS.filter(d => !serverCustoms.some(s => s.id === d.id))];
          setPdfs(defaultsAndServer.length > 0 ? defaultsAndServer : DEFAULT_PDF_DOCUMENTS);
          setLoading(false);
        }
      }
    };

    loadPdfs();

    // Safety timeout: ensure loading state never hangs
    const safetyTimer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 3500);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Sync Offline Vault Downloaded IDs and Storage stats
  const refreshOfflineStats = async () => {
    try {
      const offlineList = await getAllOfflinePdfs();
      const idSet = new Set(offlineList.map((item) => item.id));
      setDownloadedIds(idSet);
      const totalBytes = offlineList.reduce((acc, curr) => acc + (curr.sizeBytes || 0), 0);
      setOfflineStats({ count: offlineList.length, totalBytes });
    } catch (e) {
      console.warn('Error refreshing offline stats:', e);
    }
  };

  useEffect(() => {
    refreshOfflineStats();
    const handleSync = () => refreshOfflineStats();
    window.addEventListener('asrarhub_pdf_offline_sync', handleSync);
    return () => {
      window.removeEventListener('asrarhub_pdf_offline_sync', handleSync);
    };
  }, []);

  // Calculate dynamic auto-category document counts
  const categoryCounts = useMemo(() => {
    const baseList = pdfs.filter((item) => {
      if (selectedTab === 'offline' && !downloadedIds.has(item.id)) return false;
      if (selectedTab === 'premium' && !item.isPremium) return false;
      return true;
    });

    const counts: Record<string, number> = { all: baseList.length };
    PDF_AUTO_CATEGORIES.forEach((cat) => {
      counts[cat.id] = baseList.filter((p) =>
        detectPdfAutoCategories(p).some((c) => c.id === cat.id)
      ).length;
    });
    return counts;
  }, [pdfs, selectedTab, downloadedIds]);

  // Filter & Search Logic with Automatic Tag Matching
  const filteredPdfs = useMemo(() => {
    return pdfs.filter((item) => {
      // Offline Tab filter
      if (selectedTab === 'offline' && !downloadedIds.has(item.id)) {
        return false;
      }
      // Premium Tab filter
      if (selectedTab === 'premium' && !item.isPremium) {
        return false;
      }
      // Auto Category Tag filter (Wirds, Secrets, Talsams, etc.)
      if (selectedAutoCategory !== 'all') {
        const itemCategories = detectPdfAutoCategories(item);
        if (!itemCategories.some((c) => c.id === selectedAutoCategory)) {
          return false;
        }
      }
      // Search Query filter (matches title, author, description, tags, and category keywords)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = 
          item.title.toLowerCase().includes(q) || 
          (item.title_en && item.title_en.toLowerCase().includes(q)) || 
          (item.title_ha && item.title_ha.toLowerCase().includes(q));
        const authorMatch = item.author && item.author.toLowerCase().includes(q);
        const descMatch = 
          item.description.toLowerCase().includes(q) ||
          (item.description_en && item.description_en.toLowerCase().includes(q));
        const tagMatch = item.tags && item.tags.some((t) => t.toLowerCase().includes(q));
        const autoCatMatch = detectPdfAutoCategories(item).some(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.name_en.toLowerCase().includes(q) ||
            c.name_ha.toLowerCase().includes(q) ||
            c.keywords.some((kw) => kw.includes(q))
        );

        if (!titleMatch && !authorMatch && !descMatch && !tagMatch && !autoCatMatch) {
          return false;
        }
      }
      return true;
    });
  }, [pdfs, selectedTab, selectedAutoCategory, searchQuery, downloadedIds]);

  // Grouped Collections by Automatic Categories
  const groupedSections = useMemo(() => {
    return groupPdfsByAutoCategories(filteredPdfs);
  }, [filteredPdfs]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Mo';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} Mo`;
  };

  const activeCategoryObject = useMemo(() => {
    if (selectedAutoCategory === 'all') return null;
    return PDF_AUTO_CATEGORIES.find((c) => c.id === selectedAutoCategory) || null;
  }, [selectedAutoCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-24 pt-2 sm:pt-4 min-h-screen bg-gray-50/50 dark:bg-gray-900/50 overflow-x-hidden box-border">
      
      {/* Top Breadcrumb & Return button */}
      <div className="flex items-center justify-between mb-4 w-full min-w-0 gap-2">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={16} />
          <span>{language === 'fr' ? 'Retour au tableau de bord' : 'Back to Dashboard'}</span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {/* Share Button via Web Share API */}
          <button
            type="button"
            onClick={handleShareLibrary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95"
            title={language === 'fr' ? 'Partager les fichiers PDF de la bibliothèque' : 'Share PDF files library'}
            aria-label="Partager les fichiers PDF"
          >
            {copiedToast ? (
              <>
                <Check size={14} className="text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">{language === 'fr' ? 'Lien copié !' : 'Link copied!'}</span>
              </>
            ) : (
              <>
                <Share2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'fr' ? 'Partager' : 'Share'}</span>
              </>
            )}
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate('/admin?tab=pdf_documents')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
            >
              <Plus size={14} />
              <span>{language === 'fr' ? 'Publier un PDF (Admin)' : 'Publish PDF (Admin)'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Banner dedicated exclusively to Published PDFs */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-600 via-rose-700 to-slate-900 text-white p-4 sm:p-7 mb-5 shadow-xl border border-red-500/30 w-full max-w-full box-border">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-red-500/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Banner Quick Share Action Button */}
        <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20">
          <button
            type="button"
            onClick={handleShareLibrary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95"
            title={language === 'fr' ? 'Partager les livres PDF via Web Share' : 'Share PDF books via Web Share'}
          >
            {copiedToast ? <Check size={14} className="text-emerald-300" /> : <Share2 size={14} className="text-white" />}
            <span className="hidden xs:inline">
              {copiedToast 
                ? (language === 'fr' ? 'Lien copié !' : 'Copied!') 
                : (language === 'fr' ? 'Partager les PDFs' : 'Share PDFs')}
            </span>
          </button>
        </div>
        
        <div className="relative z-10 max-w-3xl min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-red-200 text-[11px] font-bold uppercase tracking-wider mb-2.5 max-w-full">
            <FileText size={13} className="text-red-300 shrink-0" />
            <span className="truncate">{language === 'fr' ? 'Bibliothèque Exclusives PDF' : 'Exclusive PDF Library'}</span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight break-words">
            {language === 'fr' ? 'Documents & Livres Sacrés PDF' : 'Sacred PDF Books & Manuscripts'}
          </h1>
          <p className="text-xs sm:text-sm text-red-100/90 mt-2 leading-relaxed max-w-2xl break-words">
            {language === 'fr'
              ? 'Explorez les livres d\'Asrar, recueils de Wirds, Talasims sacrés et manuscrits rares. Consultez en ligne ou téléchargez sur votre appareil pour une lecture intégrale hors-ligne.'
              : 'Explore Asrar books, Wirds collections, sacred Talasims, and rare manuscripts. Read online or download for offline access.'}
          </p>

          {/* Offline Storage Status Bar inside Banner */}
          <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs bg-black/30 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/10 max-w-full">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px] sm:text-xs">
              <HardDrive size={14} className="shrink-0" />
              <span>{offlineStats.count} {language === 'fr' ? 'disponibles hors-ligne' : 'available offline'}</span>
            </div>
            <span className="text-white/30 hidden xs:inline">•</span>
            <div className="text-white/80 text-[11px] sm:text-xs">
              <span>{formatBytes(offlineStats.totalBytes)} {language === 'fr' ? 'stockés localement' : 'locally stored'}</span>
            </div>
            <span className="text-white/30 hidden xs:inline">•</span>
            <div className="text-amber-300 font-medium text-[11px] sm:text-xs">
              <span>{pdfs.length} {language === 'fr' ? 'ouvrages répertoriés' : 'titles available'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Main Controls Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl border border-gray-200/80 dark:border-gray-700/80 p-3 sm:p-4 mb-3 shadow-xs space-y-3 w-full max-w-full overflow-hidden box-border">
        <div className="flex items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 shrink-0" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'fr' ? 'Rechercher un livre, wird, secret, talsam...' : 'Search book, wird, secret, talsam...'}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle: Grid, List, Grouped by Categories */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shrink-0 gap-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold' 
                  : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
              title="Vue Grille"
              aria-label="Grille"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold' 
                  : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
              title="Vue Liste"
              aria-label="Liste"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-2 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'grouped' 
                  ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold' 
                  : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
              title="Vue Groupée par Thématiques (Wirds, Secrets, Talsams...)"
              aria-label="Groupé par catégories"
            >
              <Layers size={15} />
              <span className="text-[11px] hidden sm:inline">Groupé</span>
            </button>
          </div>
        </div>

        {/* Tab Buttons (All, Offline, Premium) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full hide-scrollbar min-w-0 pt-1 border-t border-gray-100 dark:border-gray-700/50">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedTab === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {language === 'fr' ? 'Tous les PDFs' : 'All PDFs'} ({pdfs.length})
          </button>

          <button
            onClick={() => setSelectedTab('offline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
              selectedTab === 'offline'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <HardDrive size={12} />
            <span>{language === 'fr' ? 'Hors-ligne' : 'Offline'} ({downloadedIds.size})</span>
          </button>

          <button
            onClick={() => setSelectedTab('premium')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
              selectedTab === 'premium'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Sparkles size={12} />
            <span>Premium VIP</span>
          </button>
        </div>
      </div>

      {/* Feature: Système d'étiquetage automatique & Barres de Filtres par Catégories */}
      <div className="mb-5 space-y-2.5">
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            <Tag size={13} className="text-emerald-500" />
            <span>{language === 'fr' ? 'Catégories Spirituelles (Étiquetage Automatique)' : 'Spiritual Categories'}</span>
          </div>
          {selectedAutoCategory !== 'all' && (
            <button
              onClick={() => setSelectedAutoCategory('all')}
              className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X size={12} />
              <span>{language === 'fr' ? 'Effacer le filtre' : 'Clear filter'}</span>
            </button>
          )}
        </div>

        {/* Scrollable Horizontal Pill Bar with counts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 max-w-full hide-scrollbar">
          {/* "Tous" Pill */}
          <button
            type="button"
            onClick={() => setSelectedAutoCategory('all')}
            className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 border ${
              selectedAutoCategory === 'all'
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white ring-2 ring-emerald-500/50'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-300'
            }`}
          >
            <span>✨</span>
            <span>{language === 'fr' ? 'Tous les Ouvrages' : 'All Works'}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              selectedAutoCategory === 'all'
                ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-950'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              {categoryCounts.all || 0}
            </span>
          </button>

          {/* Canonical Auto-detected Categories Pills (Wirds, Secrets, Talsams, etc.) */}
          {PDF_AUTO_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isSelected = selectedAutoCategory === cat.id;

            return (
              <button
                key={`cat-pill-${cat.id}`}
                type="button"
                onClick={() => setSelectedAutoCategory(isSelected ? 'all' : cat.id)}
                className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 border ${
                  isSelected
                    ? `${cat.bgColor} ${cat.textColor} ${cat.borderColor} ring-2 ring-emerald-500/50 shadow-md`
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-sm">{cat.emoji}</span>
                <span>{language === 'en' ? cat.name_en : language === 'ha' ? cat.name_ha : cat.name}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isSelected 
                    ? 'bg-black/10 dark:bg-white/10' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filter Helper Banner */}
        {activeCategoryObject && (
          <div className={`p-3 rounded-2xl border ${activeCategoryObject.bgColor} ${activeCategoryObject.borderColor} flex items-center justify-between gap-3 text-xs`}>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl shrink-0">{activeCategoryObject.emoji}</span>
              <div className="min-w-0">
                <span className={`font-bold ${activeCategoryObject.textColor}`}>
                  {language === 'en' ? activeCategoryObject.name_en : language === 'ha' ? activeCategoryObject.name_ha : activeCategoryObject.name}
                </span>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 line-clamp-1">
                  {activeCategoryObject.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedAutoCategory('all')}
              className="p-1 rounded-lg text-gray-500 hover:text-gray-800 dark:hover:text-white shrink-0 cursor-pointer"
              title="Afficher toutes les catégories"
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Main Content: Grouped by Categories OR Standard Grid/List */}
      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw size={28} className="animate-spin text-emerald-500 mx-auto mb-3" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'fr' ? 'Chargement des ouvrages et étiquetage automatique...' : 'Loading PDF manuscripts and auto-tagging...'}
          </p>
        </div>
      ) : filteredPdfs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center border border-gray-200/80 dark:border-gray-700/80 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-gray-700 text-gray-400 flex items-center justify-center mx-auto mb-4">
            <FileText size={32} />
          </div>
          <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
            {language === 'fr' ? 'Aucun document PDF trouvé' : 'No PDF documents found'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {selectedAutoCategory !== 'all'
              ? (language === 'fr' ? `Aucun document n'a été étiqueté dans la catégorie sélectionnée.` : 'No documents tagged in this category.')
              : selectedTab === 'offline'
              ? (language === 'fr' ? 'Vous n\'avez pas encore téléchargé de PDF pour le mode hors-ligne.' : 'No PDFs saved for offline yet.')
              : (language === 'fr' ? 'Essayez de modifier votre recherche ou vos filtres.' : 'Try adjusting your search query.')}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedAutoCategory('all');
              setSelectedTab('all');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            {language === 'fr' ? 'Réinitialiser tous les filtres' : 'Reset all filters'}
          </button>
        </div>
      ) : viewMode === 'grouped' && selectedAutoCategory === 'all' ? (
        /* ================= VUE GROUPÉE PAR CATÉGORIES THÉMATIQUES ================= */
        <div className="space-y-8 w-full max-w-full min-w-0">
          {groupedSections.map((group) => (
            <div 
              key={`group-section-${group.category.id}`} 
              className="bg-white dark:bg-gray-800/90 rounded-3xl p-4 sm:p-6 border border-gray-200/80 dark:border-gray-700/80 shadow-xs space-y-4"
            >
              {/* Category Group Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-700/60">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${group.category.bgColor} border ${group.category.borderColor}`}>
                    <span>{group.category.emoji}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white truncate">
                        {language === 'en' ? group.category.name_en : language === 'ha' ? group.category.name_ha : group.category.name}
                      </h2>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-black ${group.category.bgColor} ${group.category.textColor} border ${group.category.borderColor}`}>
                        {group.count} {language === 'fr' ? (group.count > 1 ? 'livres' : 'livre') : 'books'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                      {group.category.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedAutoCategory(group.category.id);
                    setViewMode('grid');
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 self-start sm:self-auto border ${group.category.bgColor} ${group.category.textColor} ${group.category.borderColor} hover:shadow-xs`}
                >
                  <span>{language === 'fr' ? 'Voir uniquement cette catégorie' : 'View this category'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Grid of Books for this group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full min-w-0">
                {group.pdfs.map((pdf, pIdx) => (
                  <PdfCard
                    key={`grouped-pdf-${group.category.id}-${pdf.id}-${pIdx}`}
                    pdf={pdf}
                    viewMode="grid"
                    onRead={(selected) => setActivePdfForReading(selected)}
                    onDownloadedChange={() => refreshOfflineStats()}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ================= VUE STANDARD (GRILLE OU LISTE) ================= */
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full min-w-0' : 'space-y-3 w-full max-w-full min-w-0'}>
          {filteredPdfs.map((pdf, pIdx) => (
            <PdfCard
              key={pdf.id ? `pdf-${pdf.id}-${pIdx}` : `pdf-${pIdx}`}
              pdf={pdf}
              viewMode={viewMode === 'grouped' ? 'grid' : viewMode}
              onRead={(selected) => setActivePdfForReading(selected)}
              onDownloadedChange={() => refreshOfflineStats()}
            />
          ))}
        </div>
      )}

      {/* PDF Interactive Viewer Modal */}
      <PdfViewerModal
        pdf={activePdfForReading}
        isOpen={!!activePdfForReading}
        onClose={() => setActivePdfForReading(null)}
        onDownloadedChange={() => refreshOfflineStats()}
      />
    </div>
  );
};
