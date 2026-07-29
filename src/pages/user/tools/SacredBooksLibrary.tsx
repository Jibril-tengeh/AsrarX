import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Shield, 
  Download, 
  FileText, 
  ArrowLeft, 
  Crown, 
  Lock, 
  Wrench, 
  CheckCircle2, 
  HelpCircle,
  Eye,
  Feather,
  Layers,
  Globe,
  Share2,
  ChevronLeft,
  ChevronRight,
  Hash,
  Moon
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useFeatures } from '../../../contexts/FeatureContext';
import { useAuth } from '../../../contexts/AuthContext';
import { checkFeatureAccess } from '../../../utils/featureAccess';
import { AccessRestrictionModal, RestrictionType } from '../../../components/AccessRestrictionModal';
import { SACRED_BOOKS, SacredBook } from '../../../data/sacredBooksData';
import { Animated3DBookIcon } from '../../../components/3d/Animated3DBookIcon';
import { ParchmentExporterModal } from '../../../components/ParchmentExporterModal';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';

export const SacredBooksLibrary: React.FC = () => {
  const { language, t } = useLanguage();
  const { featureToggles } = useFeatures();
  const { user, isPremium } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBook, setSelectedBook] = useState<SacredBook | null>(null);
  const [activeTab, setActiveTab] = useState<'intro' | 'history' | 'themes' | 'chapters' | 'ethics' | 'khatim'>('intro');
  const [activeChapterNumber, setActiveChapterNumber] = useState<number | null>(null);
  const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);

  // Restriction Modal state
  const [restrictionModal, setRestrictionModal] = useState<{
    isOpen: boolean;
    type: RestrictionType;
    featureName: string;
  }>({
    isOpen: false,
    type: null,
    featureName: '',
  });

  // Parchment Exporter Modal state
  const [parchmentModalOpen, setParchmentModalOpen] = useState(false);

  // Filter books based on search & category
  const filteredBooks = SACRED_BOOKS.filter((book) => {
    const title = language === 'en' ? book.titleEn : language === 'ha' ? book.titleHa : book.titleFr;
    const author = language === 'en' ? book.authorEn : language === 'ha' ? book.authorHa : book.authorFr;
    const searchMatch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.titleAr.includes(searchQuery) ||
      author.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return searchMatch;
    return searchMatch && book.categoryFr.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  // Handle book click with strict feature access check
  const handleSelectBook = (book: SacredBook) => {
    const access = checkFeatureAccess(book.id, book.titleFr, featureToggles, user, isPremium);

    if (!access.allowed) {
      setRestrictionModal({
        isOpen: true,
        type: access.restrictionType,
        featureName: book.titleFr,
      });
      return;
    }

    setSelectedBook(book);
    setActiveTab('intro');
    setActiveChapterNumber(null);
  };

  // Chapter Localized Helpers
  const getChapterTitle = (ch: any) => {
    if (language === 'en') return ch.titleEn || ch.titleFr;
    if (language === 'ha') return ch.titleHa || ch.titleFr;
    return ch.titleFr;
  };

  const getChapterSummary = (ch: any) => {
    if (language === 'en') return ch.summaryEn || ch.summaryFr;
    if (language === 'ha') return ch.summaryHa || ch.summaryFr;
    return ch.summaryFr;
  };

  const getSectionSubtitle = (sec: any) => {
    if (language === 'en') return sec.subtitleEn || sec.subtitleFr;
    if (language === 'ha') return sec.subtitleHa || sec.subtitleFr;
    return sec.subtitleFr;
  };

  const getSectionContent = (sec: any) => {
    if (language === 'en') return sec.contentEn || sec.contentFr;
    if (language === 'ha') return sec.contentHa || sec.contentFr;
    return sec.contentFr;
  };

  const getSectionKeyTakeaway = (sec: any) => {
    if (language === 'en') return sec.keyTakeawayEn || sec.keyTakeawayFr;
    if (language === 'ha') return sec.keyTakeawayHa || sec.keyTakeawayFr;
    return sec.keyTakeawayFr;
  };

  // Helper to get localized field
  const getLocalizedTitle = (b: SacredBook) => {
    if (language === 'en') return b.titleEn;
    if (language === 'ha') return b.titleHa;
    return b.titleFr;
  };

  const getLocalizedAuthor = (b: SacredBook) => {
    if (language === 'en') return b.authorEn;
    if (language === 'ha') return b.authorHa;
    return b.authorFr;
  };

  const getLocalizedCategory = (b: SacredBook) => {
    if (language === 'en') return b.categoryEn;
    if (language === 'ha') return b.categoryHa;
    return b.categoryFr;
  };

  const getLocalizedCentury = (b: SacredBook) => {
    if (language === 'en') {
      if (b.centuryEn) return b.centuryEn;
      const c = b.century;
      if (c.includes('XIIIe') || c.includes('XIIIᵉ')) return c.replace(/XIII[eᵉ] Siècle/g, '13th Century').replace(/7e S. Hégire/g, '7th C. AH').replace(/Égypte \/ Le Caire/g, 'Egypt / Cairo').replace(/Égypte \/ Maghreb/g, 'Egypt / Maghreb').replace(/Damas \/ Syrie/g, 'Damascus / Syria').replace(/Le Caire \/ Maghreb/g, 'Cairo / Maghreb');
      if (c.includes('XIVe') || c.includes('XIVᵉ')) return c.replace(/XIV[eᵉ]-XIX[eᵉ] Siècle/g, '14th-19th Century').replace(/XIV[eᵉ] Siècle/g, '14th Century').replace(/Irak \/ Perse/g, 'Iraq / Persia').replace(/Maghreb \/ Fès/g, 'Maghreb / Fez');
      if (c.includes('Xe') || c.includes('Xᵉ')) return c.replace(/Xe Siècle/g, '10th Century').replace(/Cordoue/g, 'Cordoba');
      if (c.includes('VIIIe') || c.includes('VIIIᵉ')) return c.replace(/VIII[eᵉ] Siècle/g, '8th Century').replace(/Médine \/ Irak/g, 'Medina / Iraq');
      if (c.includes('VIIe') || c.includes('VIIᵉ')) return c.replace(/VII[eᵉ] Siècle/g, '7th Century').replace(/Médine/g, 'Medina');
      if (c.includes('XVe') || c.includes('XVᵉ')) return c.replace(/XV[eᵉ] Siècle/g, '15th Century').replace(/Fès \/ Maghreb/g, 'Fez / Maghreb');
      if (c.includes('XVIe') || c.includes('XVIᵉ')) return c.replace(/XVI[eᵉ] Siècle/g, '16th Century');
      if (c.includes('XVIIe') || c.includes('XVIIᵉ')) return c.replace(/XVII[eᵉ] Siècle/g, '17th Century').replace(/La Mecque/g, 'Mecca').replace(/Empire Ottoman/g, 'Ottoman Empire');
      if (c.includes('XVIIIe') || c.includes('XVIIIᵉ')) return c.replace(/XVIII[eᵉ] Siècle/g, '18th Century');
      if (c.includes('Antiquité Salomunique')) return 'Solomonic Antiquity';
      if (c.includes('Manuscrit Ancien')) return 'Ancient Manuscript';
      if (c.includes('Tradition Hermétique')) return c.replace(/Tradition Hermétique/g, 'Hermetic Tradition').replace(/Ier/g, '1st').replace(/VIIIe Siècle/g, '8th Century');
      return c;
    }
    if (language === 'ha') {
      if (b.centuryHa) return b.centuryHa;
      const c = b.century;
      if (c.includes('XIIIe') || c.includes('XIIIᵉ')) return c.replace(/XIII[eᵉ] Siècle/g, 'Karni na 13').replace(/7e S. Hégire/g, 'Karni na 7 BH').replace(/Égypte \/ Le Caire/g, 'Masar / Alqahira').replace(/Égypte \/ Maghreb/g, 'Masar / Maghreb').replace(/Damas \/ Syrie/g, 'Damascus / Sham').replace(/Le Caire \/ Maghreb/g, 'Alqahira / Maghreb');
      if (c.includes('XIVe') || c.includes('XIVᵉ')) return c.replace(/XIV[eᵉ]-XIX[eᵉ] Siècle/g, 'Karni na 14-19').replace(/XIV[eᵉ] Siècle/g, 'Karni na 14').replace(/Irak \/ Perse/g, 'Iraq / Farsa').replace(/Maghreb \/ Fès/g, 'Maghreb / Fes');
      if (c.includes('Xe') || c.includes('Xᵉ')) return c.replace(/Xe Siècle/g, 'Karni na 10');
      if (c.includes('VIIIe') || c.includes('VIIIᵉ')) return c.replace(/VIII[eᵉ] Siècle/g, 'Karni na 8').replace(/Médine \/ Irak/g, 'Madina / Iraq');
      if (c.includes('VIIe') || c.includes('VIIᵉ')) return c.replace(/VII[eᵉ] Siècle/g, 'Karni na 7').replace(/Médine/g, 'Madina');
      if (c.includes('XVe') || c.includes('XVᵉ')) return c.replace(/XV[eᵉ] Siècle/g, 'Karni na 15').replace(/Fès \/ Maghreb/g, 'Fes / Maghreb');
      if (c.includes('XVIe') || c.includes('XVIᵉ')) return c.replace(/XVI[eᵉ] Siècle/g, 'Karni na 16');
      if (c.includes('XVIIe') || c.includes('XVIIᵉ')) return c.replace(/XVII[eᵉ] Siècle/g, 'Karni na 17').replace(/La Mecque/g, 'Makkah').replace(/Empire Ottoman/g, 'Daular Usmaniyya');
      if (c.includes('XVIIIe') || c.includes('XVIIIᵉ')) return c.replace(/XVIII[eᵉ] Siècle/g, 'Karni na 18');
      if (c.includes('Antiquité Salomunique')) return 'Tsohon Zamani na Annabi Sulaiman';
      if (c.includes('Manuscrit Ancien')) return 'Tsohon Rubutun Hannu';
      if (c.includes('Tradition Hermétique')) return c.replace(/Tradition Hermétique/g, 'Sirrin Hermetic').replace(/Ier/g, '1st').replace(/VIIIe Siècle/g, 'Karni na 8');
      return c;
    }
    return b.centuryFr || b.century;
  };

  const getLocalizedIntro = (b: SacredBook) => {
    if (language === 'en') return b.introEn;
    if (language === 'ha') return b.introHa;
    return b.introFr;
  };

  const getLocalizedKhatimTitle = (b: SacredBook) => {
    if (language === 'en') return b.khatim.titleEn;
    if (language === 'ha') return b.khatim.titleHa;
    return b.khatim.titleFr;
  };

  const getLocalizedKhatimDesc = (b: SacredBook) => {
    if (language === 'en') return b.khatim.descriptionEn;
    if (language === 'ha') return b.khatim.descriptionHa;
    return b.khatim.descriptionFr;
  };

  // Download Seal as PNG Image
  const handleDownloadPNG = async (book: SacredBook) => {
    // Check download access permission
    const downloadAccess = checkFeatureAccess(`download_${book.id}`, `${book.titleFr} (PNG)`, featureToggles, user, isPremium);
    if (!downloadAccess.allowed) {
      setRestrictionModal({
        isOpen: true,
        type: downloadAccess.restrictionType,
        featureName: `${book.titleFr} (PNG)`,
      });
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background - Dark Mystical Gradient
    const bgGrad = ctx.createRadialGradient(500, 600, 50, 500, 600, 700);
    bgGrad.addColorStop(0, '#111827');
    bgGrad.addColorStop(1, '#030712');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1000, 1200);

    // Decorative Borders
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, 940, 1140);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, 910, 1110);

    // Header Title
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(book.titleAr, 500, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = '22px Arial';
    ctx.fillText(getLocalizedTitle(book), 500, 155);

    ctx.fillStyle = '#9ca3af';
    ctx.font = 'italic 18px Arial';
    ctx.fillText(`${getLocalizedAuthor(book)} • ${book.century}`, 500, 190);

    // Formula
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(book.khatim.arabicFormula, 500, 250);

    // Draw Grid Table
    const gridSize = book.khatim.gridSize;
    const cellSize = Math.min(600 / gridSize, 130);
    const gridWidth = cellSize * gridSize;
    const startX = (1000 - gridWidth) / 2;
    const startY = 320;

    // Table BG
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(startX, startY, gridWidth, gridWidth);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.strokeRect(startX, startY, gridWidth, gridWidth);

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const x = startX + c * cellSize;
        const y = startY + r * cellSize;

        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, cellSize, cellSize);

        const val = book.khatim.cells[r]?.[c] || '';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val, x + cellSize / 2, y + cellSize / 2);
      }
    }

    // Footer Info
    const footerY = startY + gridWidth + 80;
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`${t('shams.card.weight', 'Poids Mystique (Abjad)')}: ${book.khatim.abjadWeight}`, 500, footerY);

    ctx.fillStyle = '#d1d5db';
    ctx.font = '16px Arial';
    ctx.fillText(getLocalizedKhatimDesc(book), 500, footerY + 35);

    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Arial';
    ctx.fillText('AsrarHub Sacred Manuscripts Archive • Sceau Officiel Authentifié', 500, footerY + 90);

    await downloadCanvasImage(canvas, `khatim_${book.id}.png`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pb-20 pt-6 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-amber-950/80 via-purple-950/60 to-gray-900 border border-amber-500/30 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="z-10">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30 shadow-lg">
                <BookOpen size={28} />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                  {t('sacred-books.title', 'Bibliothèque des Manuscrits Sacrés')}
                  <ToolInfoTooltip
                    title={t('sacred-books.title', 'Bibliothèque des Manuscrits Sacrés')}
                    content={t('sacred-books.tooltip', 'Compendium d\'études approfondies des livres ésotériques majeurs d\'Al-Buni, Ibn Arabi, Majriti, Jazuli et des sages anciens. Chaque manuscrit comprend une analyse en 3 langues et son Khatim sacrée téléchargeable.')}
                  />
                </h1>
                <p className="text-sm text-amber-200/80 mt-1">
                  {t('sacred-books.subtitle', 'Analyses théurgiques approfondies, introductions trilingues & Sceaux téléchargeables (PNG & Parchemin)')}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {!selectedBook ? (
          <>
            {/* Search & Categories */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              {/* Search input */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('sacred-books.search', 'Rechercher un livre, un auteur...')}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700/80 rounded-2xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: language === 'en' ? 'All' : language === 'ha' ? 'Duk' : 'Tous' },
                  { id: 'théurgie', label: language === 'en' ? 'Theurgy' : language === 'ha' ? 'Ayukan Sirri' : 'Théurgie' },
                  { id: 'astrologie', label: language === 'en' ? 'Astrology' : language === 'ha' ? 'Taurari' : 'Astrologie' },
                  { id: 'lettres', label: language === 'en' ? 'Letter Science' : language === 'ha' ? 'Ilimin Haruffa' : 'Science des Lettres' },
                  { id: 'sufie', label: language === 'en' ? 'Sufi Gnosis' : language === 'ha' ? 'Tassawuf' : 'Gnose Sufie' },
                  { id: 'awfaq', label: language === 'en' ? 'Awfaq & Squares' : language === 'ha' ? 'Khatimai & Awfaq' : 'Awfaq & Carrés' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20'
                        : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-amber-500/50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 12 Books Grid with 3D Animated Video Icons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => {
                const status = featureToggles[book.id] || 'active';
                const isLocked = status === 'premium' && !isPremium && user?.role !== 'admin';
                const isMaintenance = status === 'maintenance';
                const isDisabled = status === 'disabled' || status === 'inactive' || status === 'blocked';

                return (
                  <motion.div
                    key={book.id}
                    whileHover={{ scale: 1.02 }}
                    onHoverStart={() => setHoveredBookId(book.id)}
                    onHoverEnd={() => setHoveredBookId(null)}
                    onClick={() => handleSelectBook(book)}
                    className={`relative p-5 bg-gradient-to-b from-gray-800/90 to-gray-850/90 border rounded-3xl cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                      isDisabled
                        ? 'border-red-900/50 opacity-60'
                        : isMaintenance
                        ? 'border-amber-900/50'
                        : isLocked
                        ? 'border-purple-900/50'
                        : 'border-gray-750 hover:border-amber-500/60 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10'
                    }`}
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
                      {status === 'premium' && (
                        <span className="px-2.5 py-1 bg-purple-900/80 border border-purple-500/40 text-purple-300 text-[10px] font-bold rounded-full flex items-center gap-1">
                          <Crown size={12} />
                          Premium
                        </span>
                      )}
                      {status === 'maintenance' && (
                        <span className="px-2.5 py-1 bg-amber-900/80 border border-amber-500/40 text-amber-300 text-[10px] font-bold rounded-full flex items-center gap-1">
                          <Wrench size={12} />
                          Maintenance
                        </span>
                      )}
                      {isDisabled && (
                        <span className="px-2.5 py-1 bg-red-900/80 border border-red-500/40 text-red-300 text-[10px] font-bold rounded-full flex items-center gap-1">
                          <Lock size={12} />
                          {language === 'en' ? 'Blocked' : language === 'ha' ? 'Kange' : 'Bloqué'}
                        </span>
                      )}
                    </div>

                    {/* Book 3D Icon Presentation */}
                    <div className="pt-2 pb-4 flex items-center justify-center">
                      <Animated3DBookIcon
                        type={book.icon3dType}
                        titleAr={book.titleAr}
                        titleFr={getLocalizedTitle(book)}
                        themeColor={book.themeColor}
                        bgGlow={book.bgGlow}
                        size="md"
                        isHovered={hoveredBookId === book.id}
                      />
                    </div>

                    {/* Info */}
                    <div className="space-y-2 mt-2 z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider">
                          {getLocalizedCategory(book)}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {getLocalizedCentury(book)}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {getLocalizedTitle(book)}
                      </h3>

                      <p className="text-xs font-arabic text-amber-200/80 dir-rtl line-clamp-1">
                        {book.titleAr}
                      </p>

                      <p className="text-xs text-gray-400 line-clamp-2 pt-1">
                        {getLocalizedIntro(book).summary}
                      </p>

                      <div className="pt-3 border-t border-gray-700/50 flex items-center justify-between text-xs font-semibold text-amber-400">
                        <span className="flex items-center gap-1">
                          <Feather size={14} />
                          {getLocalizedAuthor(book)}
                        </span>
                        <span className="text-amber-300 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          {language === 'en' ? 'Explore' : language === 'ha' ? 'Bincika' : 'Explorer'} →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          /* Book Deep Reader View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-850 border border-gray-750 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8"
          >
            {/* Top Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-750 pb-6">
              <button
                onClick={() => setSelectedBook(null)}
                className="flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 bg-gray-800 px-4 py-2 rounded-2xl border border-gray-700 transition-colors"
              >
                <ArrowLeft size={18} />
                {language === 'en' ? 'Back to Library' : language === 'ha' ? 'Komawa Zaure' : 'Retour à la Bibliothèque'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPNG(selectedBook)}
                  className="flex items-center gap-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-gray-950 px-4 py-2 rounded-2xl shadow-lg transition-all"
                >
                  <Download size={15} />
                  {language === 'en' ? 'PNG Seal' : language === 'ha' ? 'Khatim PNG' : 'Sceau PNG'}
                </button>
                <button
                  onClick={() => setParchmentModalOpen(true)}
                  className="flex items-center gap-2 text-xs font-bold bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white px-4 py-2 rounded-2xl shadow-lg transition-all"
                >
                  <Feather size={15} />
                  {language === 'en' ? 'Sacred Parchment' : language === 'ha' ? 'Parchemin Maikada' : 'Parchemin Sacré'}
                </button>
              </div>
            </div>

            {/* Book Header Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-gray-900/80 p-6 rounded-3xl border border-amber-500/20">
              <div className="flex justify-center">
                <Animated3DBookIcon
                  type={selectedBook.icon3dType}
                  titleAr={selectedBook.titleAr}
                  titleFr={getLocalizedTitle(selectedBook)}
                  themeColor={selectedBook.themeColor}
                  bgGlow={selectedBook.bgGlow}
                  size="lg"
                  isHovered={true}
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full">
                  {getLocalizedCategory(selectedBook)} • {getLocalizedCentury(selectedBook)}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {getLocalizedTitle(selectedBook)}
                </h1>

                <p className="font-arabic text-xl text-amber-200 dir-rtl font-bold">
                  {selectedBook.titleAr}
                </p>

                <p className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Feather size={16} className="text-amber-400" />
                  {language === 'en' ? 'Author' : language === 'ha' ? 'Marubuci' : 'Auteur'}: {getLocalizedAuthor(selectedBook)} ({selectedBook.authorAr})
                </p>
              </div>
            </div>

            {/* Section Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-750 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'intro', label: language === 'en' ? 'Overview' : language === 'ha' ? 'Takaitaccen Bayani' : 'Vue d\'ensemble' },
                { id: 'history', label: language === 'en' ? 'Historical Context' : language === 'ha' ? 'Tarihin Littafi' : 'Contexte Historique' },
                { id: 'themes', label: language === 'en' ? 'Themes & Concepts' : language === 'ha' ? 'Jigogin Littafi' : 'Thèmes & Concepts' },
                { id: 'chapters', label: language === 'en' ? 'Book Structure' : language === 'ha' ? 'Tsarin Babobi' : 'Structure du Livre' },
                { id: 'ethics', label: language === 'en' ? 'Rules & Ethics' : language === 'ha' ? 'Dokoki da Sharudda' : 'Règles & Éthique' },
                { id: 'khatim', label: language === 'en' ? 'Seal & Khatim' : language === 'ha' ? 'Khatim & Sceo' : 'Sceau & Khatim' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="pt-2 text-gray-200 leading-relaxed text-sm sm:text-base space-y-6">
              {activeTab === 'intro' && (
                <div className="space-y-4 bg-gray-900/60 p-6 rounded-2xl border border-gray-750">
                  <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                    <Sparkles size={20} />
                    {language === 'en' ? 'Theurgic & Esoteric Summary' : language === 'ha' ? 'Takaitaccen Bayanin Sirri da Ruhani' : 'Résumé Théurgique & Ésotérique'}
                  </h3>
                  <p>{getLocalizedIntro(selectedBook).summary}</p>
                  
                  <div className="pt-4 border-t border-gray-800 space-y-2">
                    <h4 className="font-bold text-white text-sm">
                      {language === 'en' ? 'Major Esoteric Significance:' : language === 'ha' ? 'Matukar Muhimmancin Sirri:' : 'Signification ésotérique majeure :'}
                    </h4>
                    <p className="text-sm text-gray-300">{getLocalizedIntro(selectedBook).esotericSignificance}</p>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4 bg-gray-900/60 p-6 rounded-2xl border border-gray-750">
                  <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                    <FileText size={20} />
                    {language === 'en' ? 'Origins & Historical Context' : language === 'ha' ? 'Asali da Tarihin Littafin' : 'Origines & Contexte Historique'}
                  </h3>
                  <p>{getLocalizedIntro(selectedBook).historicalContext}</p>
                </div>
              )}

              {activeTab === 'themes' && (
                <div className="space-y-4 bg-gray-900/60 p-6 rounded-2xl border border-gray-750">
                  <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                    <Layers size={20} />
                    {language === 'en' ? 'Key Themes & Pillars' : language === 'ha' ? 'Muhimman Jigogi da Ginshiƙan Littafi' : 'Thèmes Clés & Piliers de l\'Ouvrage'}
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getLocalizedIntro(selectedBook).keyThemes.map((theme, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-3 bg-gray-800/80 rounded-xl border border-gray-700">
                        <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-semibold">{theme}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'chapters' && (
                <div className="space-y-6">
                  {selectedBook.chapters && selectedBook.chapters.length > 0 ? (
                    <>
                      {/* Chapter Navigation Selector Bar */}
                      <div className="bg-gray-900/80 p-4 rounded-2xl border border-gray-750 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="text-amber-400 shrink-0" size={20} />
                          <span className="font-bold text-white text-sm">
                            {language === 'en' ? 'Sacred Chapters' : language === 'ha' ? 'Babobin Asiri' : 'Chapitres Sacrés du Livre'} ({selectedBook.chapters.length})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => setActiveChapterNumber(null)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              activeChapterNumber === null
                                ? 'bg-amber-500 text-gray-950 shadow-md'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                            }`}
                          >
                            {language === 'en' ? 'All Chapters' : language === 'ha' ? 'Duk Babobi' : 'Tous les Chapitres'}
                          </button>
                          {selectedBook.chapters.map((ch) => (
                            <button
                              key={ch.id}
                              onClick={() => setActiveChapterNumber(ch.chapterNumber)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                activeChapterNumber === ch.chapterNumber
                                  ? 'bg-amber-500 text-gray-950 shadow-md'
                                  : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                              }`}
                            >
                              Ch. {ch.chapterNumber}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Detailed View when a chapter is selected */}
                      {activeChapterNumber !== null ? (
                        (() => {
                          const currentChapter = selectedBook.chapters!.find((c) => c.chapterNumber === activeChapterNumber);
                          if (!currentChapter) return null;

                          return (
                            <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-750 space-y-6">
                              {/* Chapter Header */}
                              <div className="border-b border-gray-800 pb-5 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full border border-amber-500/30">
                                    Chapitre {currentChapter.chapterNumber} / {selectedBook.chapters!.length}
                                  </span>
                                  <span className="font-arabic text-amber-300 text-lg font-bold">
                                    {currentChapter.titleAr}
                                  </span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                                  {getChapterTitle(currentChapter)}
                                </h2>
                                <p className="text-sm text-gray-300 italic bg-amber-950/20 p-3.5 rounded-xl border border-amber-500/20">
                                  {getChapterSummary(currentChapter)}
                                </p>
                              </div>

                              {/* Chapter Sections */}
                              <div className="space-y-6">
                                {currentChapter.sections.map((sec, idx) => (
                                  <div key={idx} className="p-5 bg-gray-800/80 rounded-2xl border border-gray-700 space-y-4 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-700/80 pb-3">
                                      <h3 className="font-bold text-amber-300 text-base flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">
                                          {idx + 1}
                                        </span>
                                        {getSectionSubtitle(sec)}
                                      </h3>
                                      {sec.subtitleAr && (
                                        <span className="font-arabic text-amber-200 text-base font-bold dir-rtl">
                                          {sec.subtitleAr}
                                        </span>
                                      )}
                                    </div>

                                    <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                                      {getSectionContent(sec)}
                                    </p>

                                    {/* Calligraphy Box */}
                                    {sec.arabicText && (
                                      <div className="p-4 bg-black/60 rounded-xl border border-amber-500/30 text-center space-y-2">
                                        <p className="font-arabic text-xl sm:text-2xl text-amber-300 font-bold leading-loose dir-rtl">
                                          {sec.arabicText}
                                        </p>
                                        {sec.transliteration && (
                                          <p className="text-xs text-amber-200/80 font-mono italic">
                                            "{sec.transliteration}"
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    {/* Badges for Abjad & Lunar Mansion */}
                                    {(sec.abjadWeight || sec.lunarMansion) && (
                                      <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                                        {sec.abjadWeight && (
                                          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold rounded-lg flex items-center gap-1">
                                            <Hash size={13} />
                                            Abjad: {sec.abjadWeight}
                                          </span>
                                        )}
                                        {sec.lunarMansion && (
                                          <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold rounded-lg flex items-center gap-1">
                                            <Moon size={13} />
                                            {sec.lunarMansion}
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {/* Key Takeaway / Secret */}
                                    {getSectionKeyTakeaway(sec) && (
                                      <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-200 font-medium flex items-start gap-2">
                                        <Sparkles size={15} className="text-amber-400 shrink-0 mt-0.5" />
                                        <span><strong>{language === 'en' ? 'Esoteric Insight:' : language === 'ha' ? 'Hikimar Asiri:' : 'Secret / Enseignement Théurgique :'}</strong> {getSectionKeyTakeaway(sec)}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Navigation Buttons */}
                              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                <button
                                  disabled={currentChapter.chapterNumber <= 1}
                                  onClick={() => setActiveChapterNumber(currentChapter.chapterNumber - 1)}
                                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl border border-gray-700 flex items-center gap-2 transition-all"
                                >
                                  <ChevronLeft size={16} />
                                  {language === 'en' ? 'Previous Chapter' : language === 'ha' ? 'Babi na Baya' : 'Chapitre Précédent'}
                                </button>

                                <button
                                  onClick={() => setActiveChapterNumber(null)}
                                  className="px-3 py-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold"
                                >
                                  {language === 'en' ? 'Index of Chapters' : language === 'ha' ? 'Bayanin Babobi' : 'Index des Chapitres'}
                                </button>

                                <button
                                  disabled={currentChapter.chapterNumber >= selectedBook.chapters!.length}
                                  onClick={() => setActiveChapterNumber(currentChapter.chapterNumber + 1)}
                                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-gray-950 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md"
                                >
                                  {language === 'en' ? 'Next Chapter' : language === 'ha' ? 'Babi na Gaba' : 'Chapitre Suivant'}
                                  <ChevronRight size={16} />
                                </button>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        /* Overview grid of all chapters */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedBook.chapters.map((ch) => (
                            <div
                              key={ch.id}
                              onClick={() => setActiveChapterNumber(ch.chapterNumber)}
                              className="p-5 bg-gray-900/80 hover:bg-gray-800/90 rounded-2xl border border-gray-750 hover:border-amber-500/50 transition-all cursor-pointer group space-y-3 flex flex-col justify-between"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center text-xs border border-amber-500/30">
                                    {ch.chapterNumber}
                                  </span>
                                  <span className="font-arabic text-amber-300 text-base font-bold">
                                    {ch.titleAr}
                                  </span>
                                </div>
                                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                                  {getChapterTitle(ch)}
                                </h3>
                                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                                  {getChapterSummary(ch)}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-xs text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">
                                <span>{ch.sections.length} {language === 'en' ? 'Sections & Secrets' : language === 'ha' ? 'Bangarori da Asirori' : 'Sections & Rituels'}</span>
                                <span className="flex items-center gap-1">
                                  {language === 'en' ? 'Read Chapter' : language === 'ha' ? 'Karanta Babin' : 'Lire le Chapitre'} →
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    /* Fallback to simple chapter breakdown if book has no chapters object */
                    <div className="space-y-4 bg-gray-900/60 p-6 rounded-2xl border border-gray-750">
                      <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                        <BookOpen size={20} />
                        {language === 'en' ? 'Chapter Breakdown & Content' : language === 'ha' ? 'Baje Kolin Babobi da Abinda ke Ciki' : 'Découpage des Chapitres & Contenu'}
                      </h3>
                      <div className="space-y-3">
                        {getLocalizedIntro(selectedBook).chapterBreakdown.map((ch, i) => (
                          <div key={i} className="p-3.5 bg-gray-800/80 rounded-xl border border-gray-700 text-xs sm:text-sm font-semibold flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                              {i + 1}
                            </span>
                            <span>{ch}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ethics' && (
                <div className="space-y-4 bg-gray-900/60 p-6 rounded-2xl border border-gray-750">
                  <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                    <Shield size={20} />
                    {language === 'en' ? 'Practice Conditions & Spiritual Ethics' : language === 'ha' ? 'Dokokin Aiki da Sharuddan Ruhani' : 'Conditions de Pratique & Éthique Spiritualiste'}
                  </h3>
                  <p className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-amber-200 text-sm">
                    {getLocalizedIntro(selectedBook).practicalEthics}
                  </p>
                </div>
              )}

              {activeTab === 'khatim' && (
                <div className="space-y-6 bg-gray-900/60 p-6 rounded-2xl border border-gray-750 text-center">
                  <h3 className="text-lg font-bold text-amber-400">
                    {getLocalizedKhatimTitle(selectedBook)} ({selectedBook.khatim.titleAr})
                  </h3>

                  <p className="font-arabic text-xl text-amber-200 font-bold dir-rtl">
                    {selectedBook.khatim.arabicFormula}
                  </p>

                  <p className="text-xs text-gray-300 max-w-xl mx-auto">
                    {getLocalizedKhatimDesc(selectedBook)}
                  </p>

                  {/* Render Visual Grid */}
                  <div className="flex justify-center py-4">
                    <div 
                      className="inline-grid gap-2 p-4 bg-gradient-to-b from-gray-950 to-amber-950/40 border-2 border-amber-500/50 rounded-2xl shadow-2xl"
                      style={{
                        gridTemplateColumns: `repeat(${selectedBook.khatim.gridSize}, minmax(0, 1fr))`
                      }}
                    >
                      {selectedBook.khatim.cells.map((row, r) =>
                        row.map((val, c) => (
                          <div
                            key={`${r}-${c}`}
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-900 border border-amber-500/40 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold font-arabic text-amber-200 shadow-inner"
                          >
                            {val}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-amber-400 font-bold">
                    {language === 'en' ? 'Mystic Abjad Weight:' : language === 'ha' ? 'Lissafin Abjad (Sirri):' : 'Poids Mystique (Abjad):'} {selectedBook.khatim.abjadWeight}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-3 pt-4">
                    <button
                      onClick={() => handleDownloadPNG(selectedBook)}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
                    >
                      <Download size={16} />
                      {language === 'en' ? 'Download Seal (PNG)' : language === 'ha' ? 'Sauke Khatim (PNG)' : 'Télécharger Sceau (PNG)'}
                    </button>
                    <button
                      onClick={() => setParchmentModalOpen(true)}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
                    >
                      <Feather size={16} />
                      {language === 'en' ? 'Export as Sacred Parchment' : language === 'ha' ? 'Fitar da Parchemin Sacré' : 'Exporter en Parchemin Sacré'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Access Restriction Modal */}
      <AccessRestrictionModal
        isOpen={restrictionModal.isOpen}
        onClose={() => setRestrictionModal({ ...restrictionModal, isOpen: false })}
        restrictionType={restrictionModal.type}
        featureName={restrictionModal.featureName}
        language={language}
      />

      {/* Parchment Exporter Modal */}
      {selectedBook && (
        <ParchmentExporterModal
          isOpen={parchmentModalOpen}
          onClose={() => setParchmentModalOpen(false)}
          title={selectedBook.titleFr}
          subtitle={`${selectedBook.titleAr} • Poids: ${selectedBook.khatim.abjadWeight}`}
          recipientName={user?.name || user?.email || 'Chercheur d\'Asrar'}
          abjadWeight={selectedBook.khatim.abjadWeight}
          content={
            <div className="space-y-4 text-center">
              <h2 className="text-xl font-bold font-arabic text-amber-900 dir-rtl">
                {selectedBook.titleAr}
              </h2>
              <p className="text-sm font-semibold text-amber-950">
                {getLocalizedTitle(selectedBook)}
              </p>
              <p className="text-xs italic text-amber-800">
                Auteur : {getLocalizedAuthor(selectedBook)} ({selectedBook.century})
              </p>

              <div className="my-4 p-4 border-2 border-amber-800/40 rounded-xl bg-amber-100/50">
                <p className="font-arabic text-lg font-bold text-amber-950 dir-rtl mb-3">
                  {selectedBook.khatim.arabicFormula}
                </p>

                <div className="flex justify-center">
                  <div 
                    className="inline-grid gap-1.5 p-3 border border-amber-800 rounded-lg bg-amber-50"
                    style={{ gridTemplateColumns: `repeat(${selectedBook.khatim.gridSize}, minmax(0, 1fr))` }}
                  >
                    {selectedBook.khatim.cells.map((row, r) =>
                      row.map((val, c) => (
                        <div key={`${r}-${c}`} className="w-12 h-12 border border-amber-700 flex items-center justify-center font-arabic text-xs font-bold text-amber-950">
                          {val}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-amber-900 leading-relaxed text-left">
                {getLocalizedIntro(selectedBook).summary}
              </p>
            </div>
          }
        />
      )}
    </div>
  );
};

export default SacredBooksLibrary;
