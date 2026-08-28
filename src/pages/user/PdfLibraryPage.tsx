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
  ArrowLeft
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

export const PdfLibraryPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [pdfs, setPdfs] = useState<PdfDocument[]>(DEFAULT_PDF_DOCUMENTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<'all' | 'offline' | 'premium'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activePdfForReading, setActivePdfForReading] = useState<PdfDocument | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());
  const [offlineStats, setOfflineStats] = useState<{ count: number; totalBytes: number }>({ count: 0, totalBytes: 0 });

  const isAdmin = user?.role === 'admin' || sessionStorage.getItem('admin_bypass') === 'true';

  // Load live PDFs from Firestore + Local Seed Fallback
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      const q = query(collection(db, 'pdf_documents'), orderBy('publishedAt', 'desc'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const firestorePdfs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as PdfDocument[];

          // Combine with default seed PDFs (avoid duplicate IDs)
          const customIds = new Set(firestorePdfs.map((p) => p.id));
          const merged = [
            ...firestorePdfs,
            ...DEFAULT_PDF_DOCUMENTS.filter((p) => !customIds.has(p.id)),
          ];
          setPdfs(merged);
        } else {
          setPdfs(DEFAULT_PDF_DOCUMENTS);
        }
        setLoading(false);
      }, (err) => {
        console.warn('Firestore PDF onSnapshot notice:', err);
        setPdfs(DEFAULT_PDF_DOCUMENTS);
        setLoading(false);
      });
    } catch (e) {
      console.warn('PDF stream init notice:', e);
      setPdfs(DEFAULT_PDF_DOCUMENTS);
      setLoading(false);
    }

    return () => {
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

  // Filter & Search Logic
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
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(q) || (item.title_en && item.title_en.toLowerCase().includes(q)) || (item.title_ha && item.title_ha.toLowerCase().includes(q));
        const authorMatch = item.author && item.author.toLowerCase().includes(q);
        const descMatch = item.description.toLowerCase().includes(q);
        const tagMatch = item.tags && item.tags.some((t) => t.toLowerCase().includes(q));
        if (!titleMatch && !authorMatch && !descMatch && !tagMatch) {
          return false;
        }
      }
      return true;
    });
  }, [pdfs, selectedTab, selectedCategory, searchQuery, downloadedIds]);

  const categories = [
    { id: 'all', label: language === 'fr' ? 'Toutes les catégories' : 'All Categories' },
    { id: 'asrar', label: language === 'fr' ? 'Asrar & Théurgie' : 'Asrar & Theurgy' },
    { id: 'invocations', label: language === 'fr' ? 'Invocations & Dua' : 'Prayers & Invocations' },
    { id: 'manuscrits', label: language === 'fr' ? 'Manuscrits Anciens' : 'Ancient Manuscripts' },
    { id: 'sciences_lettres', label: language === 'fr' ? 'Sciences des Lettres' : 'Science of Letters' },
    { id: 'spiritualite', label: language === 'fr' ? 'Spiritualité & Tasawwuf' : 'Spirituality & Sufism' },
    { id: 'tafsir', label: language === 'fr' ? 'Tafsir & Coran' : 'Tafsir & Quran' },
  ];

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Mo';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} Mo`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-24 pt-2 sm:pt-4 min-h-screen bg-gray-50/50 dark:bg-gray-900/50 overflow-x-hidden box-border">
      
      {/* Top Breadcrumb & Return button */}
      <div className="flex items-center justify-between mb-4 w-full min-w-0">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={16} />
          <span>{language === 'fr' ? 'Retour au tableau de bord' : 'Back to Dashboard'}</span>
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

      {/* Hero Banner dedicated exclusively to Published PDFs */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-600 via-rose-700 to-slate-900 text-white p-4 sm:p-7 mb-5 shadow-xl border border-red-500/30 w-full max-w-full box-border">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-red-500/20 rounded-full blur-3xl pointer-events-none" />
        
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
              ? 'Consultez en ligne ou téléchargez directement sur votre appareil pour une lecture complète en mode hors-ligne sans connexion Internet.'
              : 'Preview online or download directly to your device for complete offline reading without internet.'}
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
              <span>{pdfs.length} {language === 'fr' ? 'ouvrages publiés' : 'published titles'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Main Controls Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl border border-gray-200/80 dark:border-gray-700/80 p-3 sm:p-4 mb-5 shadow-xs space-y-3 w-full max-w-full overflow-hidden box-border">
        <div className="flex items-center justify-between gap-2 sm:gap-3 w-full min-w-0">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 shrink-0" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'fr' ? 'Rechercher un livre, un auteur...' : 'Search by title, author, keyword...'}
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

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-gray-400'
              }`}
              title="Grille"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-gray-400'
              }`}
              title="Liste"
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Tab Buttons & Category dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full min-w-0 pt-1 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full hide-scrollbar min-w-0">
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

          {/* Category Dropdown Filter */}
          <div className="w-full sm:w-auto shrink-0 min-w-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 border border-gray-200/80 dark:border-gray-600/60 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid or List Display */}
      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw size={28} className="animate-spin text-emerald-500 mx-auto mb-3" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'fr' ? 'Chargement des ouvrages PDF...' : 'Loading PDF manuscripts...'}
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
            {selectedTab === 'offline'
              ? (language === 'fr' ? 'Vous n\'avez pas encore téléchargé de PDF pour le mode hors-ligne.' : 'No PDFs saved for offline yet.')
              : (language === 'fr' ? 'Essayez de modifier votre recherche ou vos filtres.' : 'Try adjusting your search query.')}
          </p>
          {selectedTab === 'offline' ? (
            <button
              onClick={() => setSelectedTab('all')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              {language === 'fr' ? 'Voir tous les PDFs disponibles' : 'Browse all available PDFs'}
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs transition-all cursor-pointer"
            >
              {language === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full min-w-0' : 'space-y-3 w-full max-w-full min-w-0'}>
          {filteredPdfs.map((pdf) => (
            <PdfCard
              key={pdf.id}
              pdf={pdf}
              viewMode={viewMode}
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
