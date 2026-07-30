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
  ChevronDown,
  ChevronUp,
  Hash,
  Play,
  Moon,
  Copy,
  Check,
  Type,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTextScale } from '../../../contexts/TextScaleContext';
import { useFeatures } from '../../../contexts/FeatureContext';
import { useAuth } from '../../../contexts/AuthContext';
import { checkFeatureAccess } from '../../../utils/featureAccess';
import { AccessRestrictionModal, RestrictionType } from '../../../components/AccessRestrictionModal';
import { SACRED_BOOKS, SacredBook } from '../../../data/sacredBooksData';
import { Animated3DBookIcon } from '../../../components/3d/Animated3DBookIcon';
import { ParchmentExporterModal } from '../../../components/ParchmentExporterModal';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { FloatingTextResizer } from '../../../components/FloatingTextResizer';
import { BARHATIAH_28_NAMES, BARHATIAH_GRAND_RECIPES, BARHATIAH_INVOCATIONS, BarhatiahNameSecret } from '../../../data/barhatiahSecrets';
import { AbjadCalculatorWidget } from '../../../components/barhatiah/AbjadCalculatorWidget';
import { SpiritualClockWidget } from '../../../components/barhatiah/SpiritualClockWidget';
import { InteractiveTasbihModal } from '../../../components/barhatiah/InteractiveTasbihModal';
import { IncenseEncyclopediaWidget } from '../../../components/barhatiah/IncenseEncyclopediaWidget';
import { SpiritualRuhaniyatDirectory } from '../../../components/barhatiah/SpiritualRuhaniyatDirectory';
import { SmartProblemSearchWidget } from '../../../components/barhatiah/SmartProblemSearchWidget';

const toEasternArabicNumerals = (str: string | number): string => {
  const easternDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(str).replace(/[0-9]/g, (w) => easternDigits[parseInt(w, 10)]);
};

export const SacredBooksLibrary: React.FC = () => {
  const { language, t } = useLanguage();
  const { textScale, increaseScale, decreaseScale, resetScale } = useTextScale();
  const { featureToggles } = useFeatures();
  const { user, isPremium } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBook, setSelectedBook] = useState<SacredBook | null>(null);
  const [activeTab, setActiveTab] = useState<'intro' | 'history' | 'themes' | 'chapters' | 'secrets' | 'ethics' | 'khatim'>('secrets');
  const [secretsSubTab, setSecretsSubTab] = useState<
    'names' | 'abjad' | 'clock' | 'ruhaniyat' | 'incense' | 'search' | 'recipes' | 'invocations'
  >('names');
  const [tasbihModalOpen, setTasbihModalOpen] = useState(false);
  const [activeTasbihName, setActiveTasbihName] = useState<BarhatiahNameSecret | null>(null);
  const [secretSearchQuery, setSecretSearchQuery] = useState('');
  const [expandedSecrets, setExpandedSecrets] = useState<Record<string, boolean>>({});
  const [selectedNameForParchment, setSelectedNameForParchment] = useState<BarhatiahNameSecret | null>(null);
  const [copiedTalsamId, setCopiedTalsamId] = useState<number | null>(null);
  const [numeralFormat, setNumeralFormat] = useState<'eastern' | 'western'>('eastern');

  const toggleSecretExpand = (id: string) => {
    setExpandedSecrets((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderBarhatiahKhatimGrid = (wafq: string[][], isParchmentMode = false) => {
    if (!wafq || wafq.length !== 3) return null;
    
    // Calculate row sums to show magic constant sum
    const rowSums = wafq.map(row => row.reduce((acc, val) => acc + (parseInt(val, 10) || 0), 0));
    const magicConstant = rowSums[0];

    return (
      <div className={`p-4 rounded-2xl ${isParchmentMode ? 'bg-amber-100/80 border-2 border-amber-800/40' : 'bg-gradient-to-b from-gray-900 via-gray-950 to-black border border-amber-500/40'} shadow-xl my-3 text-center`}>
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className={`font-bold flex items-center gap-1.5 ${isParchmentMode ? 'text-amber-950' : 'text-amber-400'}`}>
            <Sparkles size={14} className={isParchmentMode ? 'text-amber-800' : 'text-amber-400'} />
            {language === 'en' ? 'Khatim 3x3 (Wafq Ghazali)' : language === 'ha' ? 'Hatim 3x3 (Wafq Ghazali)' : 'Khatim 3x3 (Wafq Ghazali Sacré)'}
          </span>
          <div className="flex items-center gap-2">
            {!isParchmentMode && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setNumeralFormat(prev => prev === 'eastern' ? 'western' : 'eastern');
                }}
                className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-mono font-bold rounded border border-amber-500/40 transition-all cursor-pointer"
              >
                {numeralFormat === 'eastern' ? 'Chiffres: ٠١٢' : 'Chiffres: 123'}
              </button>
            )}
            <span className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold ${isParchmentMode ? 'bg-amber-200 text-amber-900 border border-amber-500' : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'}`}>
              Zimām / Somme: {magicConstant}
            </span>
          </div>
        </div>

        {/* Grid Container */}
        <div className="flex justify-center my-2">
          <div className={`grid grid-cols-3 gap-1.5 p-2 rounded-xl ${isParchmentMode ? 'bg-amber-200/60 border-2 border-amber-900/60' : 'bg-amber-950/40 border-2 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]'}`}>
            {wafq.map((row, rIdx) =>
              row.map((val, cIdx) => {
                const isCenter = rIdx === 1 && cIdx === 1;
                const numericVal = parseInt(val, 10) || val;
                const easternVal = toEasternArabicNumerals(val);

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`w-14 h-14 sm:w-16 sm:h-16 flex flex-col items-center justify-center rounded-lg font-arabic transition-all border ${
                      isCenter
                        ? isParchmentMode 
                          ? 'bg-amber-400/60 border-amber-900 text-amber-950 font-extrabold shadow-inner'
                          : 'bg-amber-500/30 border-amber-400 text-amber-200 font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                        : isParchmentMode
                          ? 'bg-amber-50 border-amber-800/50 text-amber-950'
                          : 'bg-gray-900/90 border-amber-500/30 text-amber-300 hover:border-amber-500/60'
                    }`}
                  >
                    <span className="text-sm sm:text-base font-bold dir-rtl">
                      {numeralFormat === 'eastern' || isParchmentMode ? easternVal : numericVal}
                    </span>
                    <span className="text-[9px] font-mono opacity-60">
                      {numeralFormat === 'eastern' || isParchmentMode ? numericVal : easternVal}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const expandAllSubTab = (ids: string[]) => {
    setExpandedSecrets((prev) => {
      const updated = { ...prev };
      ids.forEach((id) => { updated[id] = true; });
      return updated;
    });
  };

  const collapseAllSubTab = (ids: string[]) => {
    setExpandedSecrets((prev) => {
      const updated = { ...prev };
      ids.forEach((id) => { updated[id] = false; });
      return updated;
    });
  };
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
    setActiveTab(book.id === 'book_barhatiah' ? 'secrets' : 'intro');
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
      if (c.includes('Xe') || c.includes('Xᵉ')) return c.replace(/Xe Siècle/g, '10th Century').replace(/Cordoue/g, 'Cordoba').replace(/Córdoba/g, 'Cordoba');
      if (c.includes('VIIIe') || c.includes('VIIIᵉ')) return c.replace(/VIII[eᵉ] Siècle/g, '8th Century').replace(/Médine \/ Irak/g, 'Medina / Iraq');
      if (c.includes('VIIe') || c.includes('VIIᵉ')) return c.replace(/VII[eᵉ] Siècle/g, '7th Century').replace(/Médine/g, 'Medina');
      if (c.includes('XVe') || c.includes('XVᵉ')) return c.replace(/XV[eᵉ] Siècle/g, '15th Century').replace(/Fès \/ Maghreb/g, 'Fez / Maghreb');
      if (c.includes('XVIe') || c.includes('XVIᵉ')) return c.replace(/XVI[eᵉ] Siècle/g, '16th Century');
      if (c.includes('XVIIe') || c.includes('XVIIᵉ')) return c.replace(/XVII[eᵉ] Siècle/g, '17th Century').replace(/La Mecque/g, 'Mecca').replace(/Empire Ottoman/g, 'Ottoman Empire');
      if (c.includes('XVIIIe') || c.includes('XVIIIᵉ')) return c.replace(/XVIII[eᵉ] Siècle/g, '18th Century');
      if (c.includes('Antiquité Salomunique')) return 'Solomonic Antiquity';
      if (c.includes('Antiquité')) return 'Antiquity / Islamic Golden Age Translation';
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
      if (c.includes('VIIe') || c.includes('VIIᵉ')) return c.replace(/VII[eᵉ] Siècle/g, '7th Century').replace(/Médine/g, 'Madina');
      if (c.includes('XVe') || c.includes('XVᵉ')) return c.replace(/XV[eᵉ] Siècle/g, 'Karni na 15').replace(/Fès \/ Maghreb/g, 'Fes / Maghreb');
      if (c.includes('XVIe') || c.includes('XVIᵉ')) return c.replace(/XVI[eᵉ] Siècle/g, 'Karni na 16');
      if (c.includes('XVIIe') || c.includes('XVIIᵉ')) return c.replace(/XVII[eᵉ] Siècle/g, 'Karni na 17').replace(/La Mecque/g, 'Makkah').replace(/Empire Ottoman/g, 'Daular Usmaniyya');
      if (c.includes('XVIIIe') || c.includes('XVIIIᵉ')) return c.replace(/XVIII[eᵉ] Siècle/g, 'Karni na 18');
      if (c.includes('Antiquité Salomunique')) return 'Tsohon Zamani na Annabi Sulaiman';
      if (c.includes('Antiquité')) return 'Tsohon Zamani / Fassarar Zamanin Zinari na Musulunci';
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
    ctx.fillText(`${getLocalizedAuthor(book)} • ${getLocalizedCentury(book)}`, 500, 190);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-20 pt-6 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-amber-100/90 via-purple-100/80 to-amber-50 dark:from-amber-950/80 dark:via-purple-950/60 dark:to-gray-900 border border-amber-300 dark:border-amber-500/30 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="z-10 w-full">
            <div className="flex items-start sm:items-center gap-3">
              <span className="p-3 bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-2xl border border-amber-500/30 shadow-lg shrink-0 mt-1 sm:mt-0">
                <BookOpen size={28} />
              </span>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  {t('sacred-books.title', 'Bibliothèque des Manuscrits Sacrés')}
                </h1>
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 mt-1 leading-relaxed">
                  {t('sacred-books.subtitle', 'Analyses théurgiques approfondies, introductions trilingues & Sceaux téléchargeables (PNG & Parchemin)')}
                </p>
              </div>
            </div>

            <div className="mt-4 w-full">
              <ToolInfoTooltip
                title={t('sacred-books.title', 'Bibliothèque des Manuscrits Sacrés')}
                content={t('sacred-books.tooltip', 'Compendium d\'études approfondies des livres ésotériques majeurs d\'Al-Buni, Ibn Arabi, Majriti, Jazuli et des sages anciens. Chaque manuscrit comprend une analyse en 3 langues et son Khatim sacrée téléchargeable.')}
              />
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
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-200" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('sacred-books.search', 'Rechercher un livre, un auteur...')}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
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
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-amber-500/50'
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
                    className={`relative p-5 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800/90 dark:to-gray-850/90 border rounded-3xl cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
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
                        <span className="px-2.5 py-1 bg-amber-900/80 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-full flex items-center gap-1">
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
                        <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                          {getLocalizedCategory(book)}
                        </span>
                        <span className="text-[11px] text-gray-700 dark:text-gray-200 font-mono">
                          {getLocalizedCentury(book)}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors line-clamp-1">
                        {getLocalizedTitle(book)}
                      </h3>

                      <p className="text-xs font-arabic text-amber-800 dark:text-amber-200 dir-rtl line-clamp-1">
                        {book.titleAr}
                      </p>

                      <p className="text-xs text-gray-700 dark:text-gray-200 line-clamp-2 pt-1">
                        {getLocalizedIntro(book).summary}
                      </p>

                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700/50 flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
                        <span className="flex items-center gap-1">
                          <Feather size={14} />
                          {getLocalizedAuthor(book)}
                        </span>
                        <span className="text-amber-700 dark:text-amber-300 group-hover:translate-x-1 transition-transform flex items-center gap-1">
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
            className="bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-750 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8"
          >
            {/* Top Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-750 pb-6">
              <button
                onClick={() => setSelectedBook(null)}
                className="flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-800 dark:text-amber-300 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <ArrowLeft size={18} />
                {language === 'en' ? 'Back to Library' : language === 'ha' ? 'Komawa Zaure' : 'Retour à la Bibliothèque'}
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {/* Text Zoom Pill Controller */}
                {featureToggles['enableBookTextResizer'] !== false && (
                  <div className="flex items-center gap-1 bg-amber-500/10 dark:bg-gray-800 p-1.5 rounded-2xl border border-amber-500/30">
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 px-1 flex items-center gap-1 hidden sm:flex">
                      <Type size={13} />
                      {language === 'ha' ? 'Rubutu' : language === 'en' ? 'Text' : 'Taille'}
                    </span>
                    <button
                      type="button"
                      onClick={decreaseScale}
                      disabled={textScale <= 0.85}
                      className="p-1.5 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-amber-500/20 disabled:opacity-40 text-amber-900 dark:text-amber-300 transition-all cursor-pointer"
                      title={language === 'ha' ? 'Rage girma' : language === 'en' ? 'Zoom out' : 'Diminuer texte'}
                    >
                      <ZoomOut size={14} />
                    </button>
                    <span className="font-mono text-xs font-extrabold px-1.5 text-amber-800 dark:text-amber-300 min-w-[42px] text-center">
                      {Math.round(textScale * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={increaseScale}
                      disabled={textScale >= 1.75}
                      className="p-1.5 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-amber-500/20 disabled:opacity-40 text-amber-900 dark:text-amber-300 transition-all cursor-pointer"
                      title={language === 'ha' ? 'Kara girma' : language === 'en' ? 'Zoom in' : 'Augmenter texte'}
                    >
                      <ZoomIn size={14} />
                    </button>
                    {textScale !== 1.0 && (
                      <button
                        type="button"
                        onClick={resetScale}
                        className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 transition-all cursor-pointer"
                        title="100% Reset"
                      >
                        <RotateCcw size={12} />
                      </button>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleDownloadPNG(selectedBook)}
                  className="flex items-center gap-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-gray-950 px-3.5 py-2 rounded-2xl shadow-lg transition-all"
                >
                  <Download size={15} />
                  {language === 'en' ? 'PNG Seal' : language === 'ha' ? 'Khatim PNG' : 'Sceau PNG'}
                </button>
                <button
                  onClick={() => setParchmentModalOpen(true)}
                  className="flex items-center gap-2 text-xs font-bold bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-gray-900 dark:text-white px-3.5 py-2 rounded-2xl shadow-lg transition-all"
                >
                  <Feather size={15} />
                  {language === 'en' ? 'Sacred Parchment' : language === 'ha' ? 'Parchemin Maikada' : 'Parchemin Sacré'}
                </button>
              </div>
            </div>

            {/* Book Header Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-amber-50/80 dark:bg-gray-900/80 p-6 rounded-3xl border border-amber-200 dark:border-amber-500/20">
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
                <div className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-bold rounded-full">
                  {getLocalizedCategory(selectedBook)} • {getLocalizedCentury(selectedBook)}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {getLocalizedTitle(selectedBook)}
                </h1>

                <p className="font-arabic text-xl text-amber-800 dark:text-amber-200 dir-rtl font-bold">
                  {selectedBook.titleAr}
                </p>

                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Feather size={16} className="text-amber-600 dark:text-amber-400" />
                  {language === 'en' ? 'Author' : language === 'ha' ? 'Marubuci' : 'Auteur'}: {getLocalizedAuthor(selectedBook)} ({selectedBook.authorAr})
                </p>
              </div>
            </div>

            {/* Section Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-750 overflow-x-auto pb-2 scrollbar-none">
              {[
                ...(selectedBook.id === 'book_barhatiah' ? [{ id: 'secrets', label: language === 'en' ? '★ Secrets, Recipes & Talsams' : language === 'ha' ? '★ Asirori, Magunguna da Talsam' : '★ Secrets Puissants, Recettes & Talsams' }] : []),
                { id: 'intro', label: language === 'en' ? 'Overview' : language === 'ha' ? 'Takaitaccen Bayani' : 'Vue d\'ensemble' },
                { id: 'history', label: language === 'en' ? 'Historical Context' : language === 'ha' ? 'Tarihin Littafi' : 'Contexte Historique' },
                { id: 'themes', label: language === 'en' ? 'Themes & Concepts' : language === 'ha' ? 'Jigogin Littafi' : 'Thèmes & Concepts' },
                { id: 'chapters', label: language === 'en' ? 'Book Structure' : language === 'ha' ? 'Tsarin Babobi' : 'Structure du Livre' },
                ...(selectedBook.id !== 'book_barhatiah' ? [{ id: 'secrets', label: language === 'en' ? 'Secrets, Recipes & Talsams' : language === 'ha' ? 'Asirori, Magunguna da Talsam' : 'Secrets, Recettes & Talsams' }] : []),
                { id: 'ethics', label: language === 'en' ? 'Rules & Ethics' : language === 'ha' ? 'Dokoki da Sharudda' : 'Règles & Éthique' },
                { id: 'khatim', label: language === 'en' ? 'Seal & Khatim' : language === 'ha' ? 'Khatim & Sceo' : 'Sceau & Khatim' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/20'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="pt-2 text-gray-800 dark:text-gray-200 leading-relaxed text-sm sm:text-base space-y-6">
              {activeTab === 'intro' && (
                <div className="space-y-4 bg-white dark:bg-gray-900/60 p-6 rounded-2xl border border-gray-750">
                  <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <Sparkles size={20} />
                    {language === 'en' ? 'Theurgic & Esoteric Summary' : language === 'ha' ? 'Takaitaccen Bayanin Sirri da Ruhani' : 'Résumé Théurgique & Ésotérique'}
                  </h3>
                  <p>{getLocalizedIntro(selectedBook).summary}</p>
                  
                  <div className="pt-4 border-t border-gray-800 space-y-2">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                      {language === 'en' ? 'Major Esoteric Significance:' : language === 'ha' ? 'Matukar Muhimmancin Sirri:' : 'Signification ésotérique majeure :'}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{getLocalizedIntro(selectedBook).esotericSignificance}</p>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4 bg-white dark:bg-gray-900/60 p-6 rounded-2xl border border-gray-750">
                  <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <FileText size={20} />
                    {language === 'en' ? 'Origins & Historical Context' : language === 'ha' ? 'Asali da Tarihin Littafin' : 'Origines & Contexte Historique'}
                  </h3>
                  <p>{getLocalizedIntro(selectedBook).historicalContext}</p>
                </div>
              )}

              {activeTab === 'themes' && (
                <div className="space-y-4 bg-white dark:bg-gray-900/60 p-6 rounded-2xl border border-gray-750">
                  <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <Layers size={20} />
                    {language === 'en' ? 'Key Themes & Pillars' : language === 'ha' ? 'Muhimman Jigogi da Ginshiƙan Littafi' : 'Thèmes Clés & Piliers de l\'Ouvrage'}
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getLocalizedIntro(selectedBook).keyThemes.map((theme, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-3 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700">
                        <CheckCircle2 size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
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
                      <div className="bg-white dark:bg-gray-900/80 p-4 rounded-2xl border border-gray-750 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="text-amber-600 dark:text-amber-400 shrink-0" size={20} />
                          <span className="font-bold text-gray-900 dark:text-white text-sm">
                            {language === 'en' ? 'Sacred Chapters' : language === 'ha' ? 'Babobin Asiri' : 'Chapitres Sacrés du Livre'} ({selectedBook.chapters.length})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => setActiveChapterNumber(null)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              activeChapterNumber === null
                                ? 'bg-amber-500 text-gray-950 shadow-md'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750'
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
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750'
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
                            <div className="bg-white dark:bg-gray-900/80 p-6 rounded-2xl border border-gray-750 space-y-6">
                              {/* Chapter Header */}
                              <div className="border-b border-gray-800 pb-5 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="px-3 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full border border-amber-500/30">
                                    Chapitre {currentChapter.chapterNumber} / {selectedBook.chapters!.length}
                                  </span>
                                  <span className="font-arabic text-amber-800 dark:text-amber-300 text-lg font-bold">
                                    {currentChapter.titleAr}
                                  </span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                                  {getChapterTitle(currentChapter)}
                                </h2>
                                <p className="text-sm text-gray-700 dark:text-gray-300 italic bg-amber-950/20 p-3.5 rounded-xl border border-amber-500/20">
                                  {getChapterSummary(currentChapter)}
                                </p>
                              </div>

                              {/* Chapter Sections */}
                              <div className="space-y-6">
                                {currentChapter.sections.map((sec, idx) => (
                                  <div key={idx} className="p-5 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700/80 pb-3">
                                      <h3 className="font-bold text-amber-800 dark:text-amber-300 text-base flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-center justify-center font-bold">
                                          {idx + 1}
                                        </span>
                                        {getSectionSubtitle(sec)}
                                      </h3>
                                      {sec.subtitleAr && (
                                        <span className="font-arabic text-amber-800 dark:text-amber-200 text-base font-bold dir-rtl">
                                          {sec.subtitleAr}
                                        </span>
                                      )}
                                    </div>

                                    <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                                      {getSectionContent(sec)}
                                    </p>

                                    {/* Calligraphy Box */}
                                    {sec.arabicText && (
                                      <div className="p-4 bg-gray-950 dark:bg-black/80 rounded-xl border border-amber-500/40 text-center space-y-2 shadow-inner">
                                        <p className="font-arabic text-xl sm:text-2xl text-amber-300 font-bold leading-loose dir-rtl">
                                          {sec.arabicText}
                                        </p>
                                        {sec.transliteration && (
                                          <p className="text-xs text-amber-200 font-mono italic">
                                            "{sec.transliteration}"
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    {/* Badges for Abjad & Lunar Mansion */}
                                    {(sec.abjadWeight || sec.lunarMansion) && (
                                      <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                                        {sec.abjadWeight && (
                                          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 font-mono font-bold rounded-lg flex items-center gap-1">
                                            <Hash size={13} />
                                            Abjad: {sec.abjadWeight}
                                          </span>
                                        )}
                                        {sec.lunarMansion && (
                                          <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-800 dark:text-indigo-300 font-bold rounded-lg flex items-center gap-1">
                                            <Moon size={13} />
                                            {sec.lunarMansion}
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {/* Key Takeaway / Secret */}
                                    {getSectionKeyTakeaway(sec) && (
                                      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 rounded-xl text-xs text-amber-950 dark:text-amber-200 font-medium flex items-start gap-2">
                                        <Sparkles size={15} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
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
                                  className="px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-900 dark:text-white text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-2 transition-all"
                                >
                                  <ChevronLeft size={16} />
                                  {language === 'en' ? 'Previous Chapter' : language === 'ha' ? 'Babi na Baya' : 'Chapitre Précédent'}
                                </button>

                                <button
                                  onClick={() => setActiveChapterNumber(null)}
                                  className="px-3 py-1.5 text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:text-amber-300 font-bold"
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
                              className="p-5 bg-white dark:bg-gray-900/80 hover:bg-gray-50 dark:bg-gray-800/90 rounded-2xl border border-gray-750 hover:border-amber-500/50 transition-all cursor-pointer group space-y-3 flex flex-col justify-between"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 font-extrabold flex items-center justify-center text-xs border border-amber-500/30">
                                    {ch.chapterNumber}
                                  </span>
                                  <span className="font-arabic text-amber-800 dark:text-amber-300 text-base font-bold">
                                    {ch.titleAr}
                                  </span>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">
                                  {getChapterTitle(ch)}
                                </h3>
                                <p className="text-xs text-gray-700 dark:text-gray-200 line-clamp-3 leading-relaxed">
                                  {getChapterSummary(ch)}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">
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
                    <div className="space-y-4 bg-white dark:bg-gray-900/60 p-6 rounded-2xl border border-gray-750">
                      <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                        <BookOpen size={20} />
                        {language === 'en' ? 'Chapter Breakdown & Content' : language === 'ha' ? 'Baje Kolin Babobi da Abinda ke Ciki' : 'Découpage des Chapitres & Contenu'}
                      </h3>
                      <div className="space-y-3">
                        {getLocalizedIntro(selectedBook).chapterBreakdown.map((ch, i) => (
                          <div key={i} className="p-3.5 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 text-xs sm:text-sm font-semibold flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center text-xs">
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

              {activeTab === 'secrets' && (
                <div className="space-y-6">
                  {/* Sub-tabs header */}
                  <div className="bg-white dark:bg-gray-900/80 p-4 rounded-2xl border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-amber-700 dark:text-amber-400" size={20} />
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        {language === 'en' ? 'Deep Secrets, Recipes & Invocations' : language === 'ha' ? 'Zurfin Asirori, Magunguna da Addu\'o\'i' : 'Secrets Profonds, Recettes & Invocations'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {[
                        { id: 'names', label: language === 'en' ? '28 Names' : language === 'ha' ? 'Sunaye 28' : 'Compendium 28 Noms' },
                        { id: 'abjad', label: language === 'en' ? 'Abjad & Wafq' : language === 'ha' ? 'Hisab & Wafq' : 'Calculateur Abjad' },
                        { id: 'clock', label: language === 'en' ? 'Spiritual Clock' : language === 'ha' ? 'Agogon Sawaya' : 'Horloge Spirituelle' },
                        { id: 'ruhaniyat', label: language === 'en' ? 'Ruhaniyat' : language === 'ha' ? 'Mala\'iku & Ruhaniyat' : 'Anges & Ruhaniyat' },
                        { id: 'incense', label: language === 'en' ? 'Incenses' : language === 'ha' ? 'Turare' : 'Encens & Substituts' },
                        { id: 'search', label: language === 'en' ? 'Smart Search' : language === 'ha' ? 'Neman Magani' : 'Recherche Intelligente' },
                        { id: 'recipes', label: language === 'en' ? 'Grand Recipes' : language === 'ha' ? 'Babban Aiki' : 'Grandes Recettes' },
                        { id: 'invocations', label: language === 'en' ? 'Invocations' : language === 'ha' ? 'Addu\'o\'i' : 'Invocations & Serment' },
                      ].map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setSecretsSubTab(sub.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                            secretsSubTab === sub.id
                              ? 'bg-amber-500 text-gray-950 shadow-md scale-105'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SUB-TAB 1: 28 NAMES COMPENDIUM */}
                  {secretsSubTab === 'names' && (
                    <div className="space-y-4">
                      {/* Search inside 28 names & Expand/Collapse Controls */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-200" size={16} />
                          <input
                            type="text"
                            value={secretSearchQuery}
                            onChange={(e) => setSecretSearchQuery(e.target.value)}
                            placeholder={
                              language === 'en' 
                                ? 'Filter among the 28 names, virtues, attributes...' 
                                : language === 'ha' 
                                ? 'Bincika tsakanin sunaye 28, asirori...' 
                                : 'Rechercher parmi les 28 noms, vertus, attributs...'
                            }
                            className="w-full bg-white dark:bg-gray-900 border border-gray-750 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => expandAllSubTab(BARHATIAH_28_NAMES.map(n => `name_${n.id}`))}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl border border-gray-300 dark:border-gray-700 transition-all shrink-0"
                          >
                            {language === 'en' ? 'Expand All' : language === 'ha' ? 'Buɗe Duka' : 'Tout déplier'}
                          </button>
                          <button
                            onClick={() => collapseAllSubTab(BARHATIAH_28_NAMES.map(n => `name_${n.id}`))}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl border border-gray-300 dark:border-gray-700 transition-all shrink-0"
                          >
                            {language === 'en' ? 'Collapse All' : language === 'ha' ? 'Rufe Duka' : 'Tout replier'}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {BARHATIAH_28_NAMES.filter((item) => {
                          const q = secretSearchQuery.toLowerCase();
                          return (
                            item.nameAr.includes(q) ||
                            item.nameTranslit.toLowerCase().includes(q) ||
                            item.secretFr.toLowerCase().includes(q) ||
                            item.secretEn.toLowerCase().includes(q) ||
                            item.secretHa.toLowerCase().includes(q) ||
                            item.recipeFr.toLowerCase().includes(q)
                          );
                        }).map((item) => {
                          const itemId = `name_${item.id}`;
                          const isExpanded = !!expandedSecrets[itemId];

                          return (
                            <div
                              key={item.id}
                              className="bg-white dark:bg-gray-900/90 rounded-2xl border border-gray-750 hover:border-amber-500/40 shadow-lg transition-all overflow-hidden flex flex-col justify-between"
                            >
                              {/* Header (Clickable Accordion) */}
                              <div
                                onClick={() => toggleSecretExpand(itemId)}
                                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none bg-gray-50/50 dark:bg-gray-900/50 hover:bg-amber-500/5 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 font-extrabold flex items-center justify-center text-xs border border-amber-500/30">
                                    #{item.id}
                                  </span>
                                  <div>
                                    <h4 className="text-xl font-bold font-arabic text-amber-800 dark:text-amber-300 dir-rtl">
                                      {item.nameAr}
                                    </h4>
                                    <p className="text-xs text-amber-900 dark:text-amber-200 font-bold font-mono">
                                      {item.nameTranslit}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="text-right hidden sm:block space-y-1">
                                    <span className="inline-block px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold rounded-md">
                                      Abjad: {item.abjadWeight}
                                    </span>
                                    <div className="text-[10px] text-gray-700 dark:text-gray-200 font-medium">
                                      {item.lunarMansion}
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-all flex items-center gap-1 text-xs font-bold"
                                  >
                                    <span className="hidden sm:inline">
                                      {isExpanded
                                        ? (language === 'en' ? 'Close' : language === 'ha' ? 'Rufe' : 'Masquer')
                                        : (language === 'en' ? 'Details' : language === 'ha' ? 'Bayanai' : 'Détails')}
                                    </span>
                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                  </button>
                                </div>
                              </div>

                              {/* Body Content (Collapsible) */}
                              {isExpanded && (
                                <div className="p-5 space-y-4 border-t border-gray-800/40 bg-white/50 dark:bg-gray-900/50">
                                  {/* Mobile-only info */}
                                  <div className="flex sm:hidden items-center justify-between border-b border-gray-800 pb-2 text-[10px]">
                                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono font-bold rounded">
                                      Abjad: {item.abjadWeight}
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                                      {item.lunarMansion}
                                    </span>
                                  </div>

                                  {/* Divine Attribute */}
                                  <div className="text-sm bg-gray-50 dark:bg-gray-800/80 p-3 rounded-xl border border-gray-200 dark:border-gray-700/80 flex items-center justify-between">
                                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                                      {language === 'en' ? 'Divine Attribute:' : language === 'ha' ? 'Atsayawa Allah:' : 'Attribut Divin :'}
                                    </span>
                                    <span className="text-amber-900 dark:text-amber-300 font-bold">
                                      {item.divineAttributeAr} — {language === 'en' ? item.divineAttributeEn : language === 'ha' ? item.divineAttributeHa : item.divineAttributeFr}
                                    </span>
                                  </div>

                                  {/* Secret & Virtues */}
                                  <div className="space-y-1">
                                    <h5 className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                      <Sparkles size={14} />
                                      {language === 'en' ? 'Esoteric Secret & Virtue:' : language === 'ha' ? 'Sirri da Amfanin Ruhani:' : 'Secret Ésotérique & Vertu :'}
                                    </h5>
                                    <p className="text-sm sm:text-base text-amber-950 dark:text-amber-100 leading-relaxed bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-200 dark:border-amber-500/30">
                                      {language === 'en' ? item.secretEn : language === 'ha' ? item.secretHa : item.secretFr}
                                    </p>
                                  </div>

                                  {/* Recipe & Protocol */}
                                  <div className="space-y-1">
                                    <h5 className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                      <Feather size={14} />
                                      {language === 'en' ? 'Recipe & Protocol:' : language === 'ha' ? 'Hanyar Aiki da Rubutu:' : 'Recette Pratique & Protocole :'}
                                    </h5>
                                    <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed bg-gray-50 dark:bg-gray-800/80 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700">
                                      {language === 'en' ? item.recipeEn : language === 'ha' ? item.recipeHa : item.recipeFr}
                                    </p>
                                  </div>

                                  {/* Specific Invocation */}
                                  <div className="p-3.5 bg-gray-950 dark:bg-black/80 rounded-xl border border-amber-500/40 space-y-1.5 text-center shadow-inner">
                                    <p className="font-arabic text-base sm:text-lg text-amber-300 font-bold dir-rtl">
                                      {item.invocationAr}
                                    </p>
                                    <p className="text-xs sm:text-sm text-amber-200 font-mono italic">
                                      "{item.invocationTranslit}"
                                    </p>
                                    <p className="text-sm text-gray-200 pt-1 border-t border-amber-500/20">
                                      {language === 'en' ? item.invocationEn : language === 'ha' ? item.invocationHa : item.invocationFr}
                                    </p>
                                  </div>

                                   {/* Full Talsam Code Box */}
                                   <div className="p-3.5 rounded-xl bg-amber-950/40 dark:bg-black/60 border border-amber-500/40 space-y-2">
                                     <div className="flex items-center justify-between">
                                       <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                         <Hash size={13} className="text-amber-500" />
                                         {language === 'en' ? 'Talsam Code & Sigils:' : language === 'ha' ? 'Lamba da Alamar Talsam:' : 'Code Talsam Sacré & Sigles :'}
                                       </span>
                                       <button
                                         type="button"
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           navigator.clipboard.writeText(item.talsamCode);
                                           setCopiedTalsamId(item.id);
                                           setTimeout(() => setCopiedTalsamId(null), 2000);
                                         }}
                                         className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold rounded-lg border border-amber-500/40 transition-all flex items-center gap-1 cursor-pointer"
                                       >
                                         {copiedTalsamId === item.id ? (
                                           <>
                                             <Check size={12} className="text-emerald-400" />
                                             <span>{language === 'en' ? 'Copied!' : language === 'ha' ? 'An kwafa!' : 'Copié !'}</span>
                                           </>
                                         ) : (
                                           <>
                                             <Copy size={12} />
                                             <span>{language === 'en' ? 'Copy Code' : language === 'ha' ? 'Kwafi Lamba' : 'Copier Code'}</span>
                                           </>
                                         )}
                                       </button>

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveTasbihName(item);
                                          setTasbihModalOpen(true);
                                        }}
                                        className="w-full sm:w-auto px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-500/40"
                                      >
                                        <Play size={14} />
                                        <span>
                                          {language === 'en' ? 'Start Tasbih Zikr' : language === 'ha' ? 'Fara Tasbih' : 'Lancer Tasbih Zikr'}
                                        </span>
                                      </button>
                                     </div>
                                     <div className="p-3 bg-black/80 rounded-lg border border-amber-500/30 text-center font-mono text-base sm:text-lg text-amber-300 font-bold tracking-widest dir-rtl shadow-inner">
                                       {item.talsamCode}
                                     </div>
                                   </div>

                                   {/* Full Visual Khatim 3x3 Grid (Wafq Ghazali) */}
                                   {item.wafq3x3 && renderBarhatiahKhatimGrid(item.wafq3x3)}

                                   {/* Actions Bar: Export Parchment & PNG */}
                                   <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800">
                                     <button
                                       type="button"
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         setSelectedNameForParchment(item);
                                       }}
                                       className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-yellow-500 text-gray-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400/50"
                                     >
                                       <Feather size={14} />
                                       <span>
                                         {language === 'en' ? 'Export Sacred Parchment (PNG)' : language === 'ha' ? 'Fitar da Parchemin (PNG)' : 'Exporter en Parchemin Sacré (PNG)'}
                                       </span>
                                     </button>

                                     <div className="flex items-center gap-2 text-[10px] text-amber-400 font-mono font-bold">
                                       <span className="capitalize px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/30">
                                         Element: {item.element}
                                       </span>
                                       <span className="px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/30">
                                         {item.lunarMansion.split(' ')[0]}
                                       </span>
                                     </div>
                                   </div>
                                 </div>
                               )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB: ABJAD CALCULATOR & WAFQ GENERATOR */}
                  {secretsSubTab === 'abjad' && (
                    <AbjadCalculatorWidget
                      onSelectNameForParchment={(name) => setSelectedNameForParchment(name)}
                    />
                  )}

                  {/* SUB-TAB: SPIRITUAL PLANETARY CLOCK */}
                  {secretsSubTab === 'clock' && <SpiritualClockWidget />}

                  {/* SUB-TAB: RUHANIYAT & ANGELIC DIRECTORY */}
                  {secretsSubTab === 'ruhaniyat' && <SpiritualRuhaniyatDirectory />}

                  {/* SUB-TAB: INCENSE ENCYCLOPEDIA */}
                  {secretsSubTab === 'incense' && <IncenseEncyclopediaWidget />}

                  {/* SUB-TAB: SMART PROBLEM / NEED SEARCH ENGINE */}
                  {secretsSubTab === 'search' && (
                    <SmartProblemSearchWidget
                      onOpenTasbih={(name) => {
                        setActiveTasbihName(name);
                        setTasbihModalOpen(true);
                      }}
                    />
                  )}

                  {/* SUB-TAB 2: GRAND CANONICAL RECIPES */}
                  {secretsSubTab === 'recipes' && (
                    <div className="space-y-6">
                      {/* Expand / Collapse all controls */}
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => expandAllSubTab(BARHATIAH_GRAND_RECIPES.map(r => `recipe_${r.id}`))}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl border border-gray-300 dark:border-gray-700 transition-all shrink-0"
                        >
                          {language === 'en' ? 'Expand All' : language === 'ha' ? 'Buɗe Duka' : 'Tout déplier'}
                        </button>
                        <button
                          onClick={() => collapseAllSubTab(BARHATIAH_GRAND_RECIPES.map(r => `recipe_${r.id}`))}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl border border-gray-300 dark:border-gray-700 transition-all shrink-0"
                        >
                          {language === 'en' ? 'Collapse All' : language === 'ha' ? 'Rufe Duka' : 'Tout replier'}
                        </button>
                      </div>

                      {BARHATIAH_GRAND_RECIPES.map((rec) => {
                        const recipeId = `recipe_${rec.id}`;
                        const isExpanded = !!expandedSecrets[recipeId];

                        return (
                          <div key={rec.id} className="bg-white dark:bg-gray-900/90 rounded-2xl border border-amber-500/30 shadow-xl overflow-hidden transition-all">
                            {/* Accordion Header */}
                            <div
                              onClick={() => toggleSecretExpand(recipeId)}
                              className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none bg-gray-50/50 dark:bg-gray-900/50 hover:bg-amber-500/5 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full border border-amber-500/30">
                                  {rec.category === 'protection' ? (language === 'en' ? 'Protection & Unbinding' : language === 'ha' ? 'Kariya da Rushe Sihiri' : 'Protection & Désenvoûtement') : (language === 'en' ? 'Prosperity & Sustenance' : language === 'ha' ? 'Arziqi da Kasuwanci' : 'Prospérité & Subsistance')}
                                </span>
                                <div>
                                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
                                    {language === 'en' ? rec.titleEn : language === 'ha' ? rec.titleHa : rec.titleFr}
                                  </h3>
                                  <span className="font-arabic text-amber-800 dark:text-amber-300 text-sm font-bold dir-rtl">
                                    {rec.titleAr}
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-all flex items-center gap-1 text-xs font-bold shrink-0"
                              >
                                <span>
                                  {isExpanded
                                    ? (language === 'en' ? 'Close' : language === 'ha' ? 'Rufe' : 'Fermer')
                                    : (language === 'en' ? 'View Recipe' : language === 'ha' ? 'Duba Aiki' : 'Voir la recette')}
                                </span>
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </div>

                            {/* Body (Expanded) */}
                            {isExpanded && (
                              <div className="p-6 space-y-5 border-t border-gray-800/40">
                                <p className="text-sm sm:text-base text-amber-950 dark:text-amber-100 leading-relaxed bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-500/30">
                                  {language === 'en' ? rec.descriptionEn : language === 'ha' ? rec.descriptionHa : rec.descriptionFr}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Required Materials */}
                                  <div className="p-4 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                                    <h4 className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                                      <Wrench size={14} />
                                      {language === 'en' ? 'Required Materials & Inks:' : language === 'ha' ? 'Abubuwan da ake Bukata:' : 'Matériels & Encres Requis :'}
                                    </h4>
                                    <ul className="space-y-1.5 text-sm text-gray-800 dark:text-gray-200">
                                      {(language === 'en' ? rec.materialsEn : language === 'ha' ? rec.materialsHa : rec.materialsFr).map((m, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                          <CheckCircle2 size={13} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                          <span>{m}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Timing */}
                                  <div className="p-4 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                                    <h4 className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                                      <Moon size={14} />
                                      {language === 'en' ? 'Optimal Timing & Planetary Hour:' : language === 'ha' ? 'Lokacin da ya Dace (Taurari):' : 'Moment Optimal & Heure Planétaire :'}
                                    </h4>
                                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                      {language === 'en' ? rec.timingEn : language === 'ha' ? rec.timingHa : rec.timingFr}
                                    </p>
                                    <div className="pt-2 text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-mono font-bold">
                                      Code Talsam: {rec.talsamCode}
                                    </div>
                                  </div>
                                </div>

                                {/* Step-by-step protocol */}
                                <div className="space-y-2">
                                  <h4 className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                                    <Layers size={14} />
                                    {language === 'en' ? 'Step-by-Step Protocol:' : language === 'ha' ? 'Mataki-mataki na Gudanarwa:' : 'Protocole Étape par Étape :'}
                                  </h4>
                                  <div className="space-y-2">
                                    {(language === 'en' ? rec.stepsEn : language === 'ha' ? rec.stepsHa : rec.stepsFr).map((st, idx) => (
                                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-750 text-sm text-gray-800 dark:text-gray-200">
                                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0">
                                          {idx + 1}
                                        </span>
                                        <span className="leading-relaxed">{st}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Formula */}
                                <div className="p-4 bg-gray-950 dark:bg-black/80 rounded-xl border border-amber-500/40 text-center space-y-1.5 shadow-inner">
                                  <p className="font-arabic text-lg sm:text-xl text-amber-300 font-bold dir-rtl">
                                    {rec.arabicFormula}
                                  </p>
                                  <p className="text-xs text-amber-200 font-mono italic">
                                    "{rec.transliteration}"
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* SUB-TAB 3: CANONICAL INVOCATIONS & OATH */}
                  {secretsSubTab === 'invocations' && (
                    <div className="space-y-6">
                      {/* Expand / Collapse all controls */}
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => expandAllSubTab(BARHATIAH_INVOCATIONS.map(i => `invocation_${i.id}`))}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl border border-gray-300 dark:border-gray-700 transition-all shrink-0"
                        >
                          {language === 'en' ? 'Expand All' : language === 'ha' ? 'Buɗe Duka' : 'Tout déplier'}
                        </button>
                        <button
                          onClick={() => collapseAllSubTab(BARHATIAH_INVOCATIONS.map(i => `invocation_${i.id}`))}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl border border-gray-300 dark:border-gray-700 transition-all shrink-0"
                        >
                          {language === 'en' ? 'Collapse All' : language === 'ha' ? 'Rufe Duka' : 'Tout replier'}
                        </button>
                      </div>

                      {BARHATIAH_INVOCATIONS.map((inv) => {
                        const invId = `invocation_${inv.id}`;
                        const isExpanded = !!expandedSecrets[invId];

                        return (
                          <div key={inv.id} className="bg-white dark:bg-gray-900/90 rounded-2xl border border-amber-500/30 shadow-xl overflow-hidden transition-all">
                            {/* Accordion Header */}
                            <div
                              onClick={() => toggleSecretExpand(invId)}
                              className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none bg-gray-50/50 dark:bg-gray-900/50 hover:bg-amber-500/5 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full border border-amber-500/30">
                                  {inv.type === 'dawah' ? 'Grand Da\'wah' : inv.type === 'kasm' ? 'Kasm al-Zajr' : 'Insiraf (Congé)'}
                                </span>
                                <div>
                                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
                                    {language === 'en' ? inv.titleEn : language === 'ha' ? inv.titleHa : inv.titleFr}
                                  </h3>
                                  <span className="font-arabic text-amber-800 dark:text-amber-300 text-sm font-bold dir-rtl">
                                    {inv.titleAr}
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-all flex items-center gap-1 text-xs font-bold shrink-0"
                              >
                                <span>
                                  {isExpanded
                                    ? (language === 'en' ? 'Close' : language === 'ha' ? 'Rufe' : 'Fermer')
                                    : (language === 'en' ? 'View Invocation' : language === 'ha' ? 'Karanta' : 'Voir l\'invocation')}
                                </span>
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </div>

                            {/* Body (Expanded) */}
                            {isExpanded && (
                              <div className="p-6 space-y-5 border-t border-gray-800/40">
                                {/* Calligraphy Box */}
                                <div className="p-5 bg-gray-950 dark:bg-black/80 rounded-2xl border border-amber-500/40 text-center space-y-4 shadow-inner">
                                  <p className="font-arabic text-xl sm:text-2xl text-amber-300 font-bold leading-loose dir-rtl whitespace-pre-line">
                                    {inv.arabicText}
                                  </p>
                                  <p className="text-xs text-amber-200 font-mono italic max-w-3xl mx-auto leading-relaxed border-t border-amber-500/20 pt-3">
                                    "{inv.transliteration}"
                                  </p>
                                </div>

                                {/* Translation */}
                                <div className="space-y-2 bg-gray-50 dark:bg-gray-800/80 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                  <h4 className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400">
                                    {language === 'en' ? 'Translation:' : language === 'ha' ? 'Fassaratas:' : 'Traduction Complète :'}
                                  </h4>
                                  <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                                    {language === 'en' ? inv.translationEn : language === 'ha' ? inv.translationHa : inv.translationFr}
                                  </p>
                                </div>

                                {/* Usage instructions */}
                                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 rounded-xl text-sm text-amber-950 dark:text-amber-200 font-medium flex items-start gap-2">
                                  <Sparkles size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                  <span>
                                    <strong>{language === 'en' ? 'Usage Instructions:' : language === 'ha' ? 'Maniymar Karatunta:' : 'Instructions d\'Usage :'}</strong>{' '}
                                    {language === 'en' ? inv.usageInstructionsEn : language === 'ha' ? inv.usageInstructionsHa : inv.usageInstructionsFr}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ethics' && (
                <div className="space-y-4 bg-white dark:bg-gray-900/60 p-6 rounded-2xl border border-gray-750">
                  <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <Shield size={20} />
                    {language === 'en' ? 'Practice Conditions & Spiritual Ethics' : language === 'ha' ? 'Dokokin Aiki da Sharuddan Ruhani' : 'Conditions de Pratique & Éthique Spiritualiste'}
                  </h3>
                  <p className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 rounded-2xl text-amber-950 dark:text-amber-200 text-sm">
                    {getLocalizedIntro(selectedBook).practicalEthics}
                  </p>
                </div>
              )}

              {activeTab === 'khatim' && (
                <div className="space-y-6 bg-white dark:bg-gray-900/60 p-6 rounded-2xl border border-gray-750 text-center">
                  <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400">
                    {getLocalizedKhatimTitle(selectedBook)} ({selectedBook.khatim.titleAr})
                  </h3>

                  <p className="font-arabic text-xl text-amber-800 dark:text-amber-200 font-bold dir-rtl">
                    {selectedBook.khatim.arabicFormula}
                  </p>

                  <p className="text-xs text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
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
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-gray-900 border border-amber-500/40 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold font-arabic text-amber-800 dark:text-amber-200 shadow-inner"
                          >
                            {val}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-amber-700 dark:text-amber-400 font-bold">
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
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-gray-900 dark:text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
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
      {/* Barhatiah Name Parchment Exporter Modal */}
      {selectedNameForParchment && (
        <ParchmentExporterModal
          isOpen={!!selectedNameForParchment}
          onClose={() => setSelectedNameForParchment(null)}
          title={`كَيْدَهوُلَا — ${selectedNameForParchment.nameAr}`}
          subtitle={`${selectedNameForParchment.nameTranslit} • Nom #${selectedNameForParchment.id} du Compendium de la Barhatiah`}
          recipientName={user?.name || user?.email || 'Chercheur d\'Asrar'}
          abjadWeight={selectedNameForParchment.abjadWeight}
          content={
            <div className="space-y-5 text-center font-serif text-amber-950">
              {/* Calligraphic Header */}
              <div>
                <h1 className="text-3xl font-extrabold font-arabic text-amber-950 dir-rtl mb-1">
                  {selectedNameForParchment.nameAr}
                </h1>
                <p className="text-sm font-bold text-amber-900 font-mono">
                  {selectedNameForParchment.nameTranslit} — (Nom #{selectedNameForParchment.id})
                </p>
                <p className="text-xs text-amber-800 mt-1 font-sans">
                  Attribut Divin : <strong>{selectedNameForParchment.divineAttributeAr}</strong> ({selectedNameForParchment.divineAttributeFr})
                </p>
              </div>

              {/* Badges Info */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-sans">
                <span className="px-3 py-1 bg-amber-200/80 border border-amber-600/40 rounded-full font-semibold">
                  🌙 Demeure : {selectedNameForParchment.lunarMansion}
                </span>
                <span className="px-3 py-1 bg-amber-200/80 border border-amber-600/40 rounded-full font-semibold capitalize">
                  🔥 Élement : {selectedNameForParchment.element}
                </span>
                <span className="px-3 py-1 bg-amber-200/80 border border-amber-600/40 rounded-full font-semibold">
                  🔢 Zimām (Abjad) : {selectedNameForParchment.abjadWeight}
                </span>
              </div>

              {/* Visual Khatim 3x3 Grid */}
              {selectedNameForParchment.wafq3x3 && (
                <div className="my-4">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-1 font-sans">
                    — Khatim Sacré 3x3 (Wafq Ghazali) —
                  </h4>
                  {renderBarhatiahKhatimGrid(selectedNameForParchment.wafq3x3, true)}
                </div>
              )}

              {/* Talsam Code */}
              <div className="p-3.5 bg-amber-200/60 rounded-xl border border-amber-700/50">
                <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-1.5 font-sans">
                  Code Talsam Sacré & Sigles :
                </p>
                <p className="font-mono text-lg font-bold text-amber-950 tracking-widest dir-rtl">
                  {selectedNameForParchment.talsamCode}
                </p>
              </div>

              {/* Sacred Invocation Box */}
              <div className="p-4 bg-amber-950 text-amber-50 rounded-xl border border-amber-800 shadow-md space-y-2">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider font-sans">
                  Invocation Canonique du Nom :
                </p>
                <p className="font-arabic text-lg sm:text-xl font-bold text-amber-200 dir-rtl">
                  {selectedNameForParchment.invocationAr}
                </p>
                <p className="text-xs font-mono italic text-amber-200">
                  "{selectedNameForParchment.invocationTranslit}"
                </p>
                <p className="text-xs text-amber-100 pt-1.5 border-t border-amber-800/80 font-sans">
                  {language === 'en' ? selectedNameForParchment.invocationEn : language === 'ha' ? selectedNameForParchment.invocationHa : selectedNameForParchment.invocationFr}
                </p>
              </div>

              {/* Esoteric Secret */}
              <div className="text-left space-y-1 bg-amber-100/80 p-4 rounded-xl border border-amber-700/40">
                <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1 uppercase tracking-wide font-sans">
                  ✨ Secret Ésotérique & Vertu Divine :
                </h5>
                <p className="text-xs text-amber-950 leading-relaxed whitespace-pre-line font-serif">
                  {language === 'en' ? selectedNameForParchment.secretEn : language === 'ha' ? selectedNameForParchment.secretHa : selectedNameForParchment.secretFr}
                </p>
              </div>

              {/* Recipe & Protocol */}
              <div className="text-left space-y-1 bg-amber-100/80 p-4 rounded-xl border border-amber-700/40">
                <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1 uppercase tracking-wide font-sans">
                  📜 Recette Pratique & Protocole Canonique :
                </h5>
                <p className="text-xs text-amber-950 leading-relaxed whitespace-pre-line font-serif">
                  {language === 'en' ? selectedNameForParchment.recipeEn : language === 'ha' ? selectedNameForParchment.recipeHa : selectedNameForParchment.recipeFr}
                </p>
              </div>
            </div>
          }
        />
      )}

      {/* Interactive Tasbih Modal */}
      <InteractiveTasbihModal
        isOpen={tasbihModalOpen}
        onClose={() => setTasbihModalOpen(false)}
        targetName={activeTasbihName}
      />

      {/* Floating Text Zoom & Resizer Icon - Displayed strictly when reading a book & admin enabled */}
      {selectedBook !== null && featureToggles['enableBookTextResizer'] !== false && (
        <FloatingTextResizer />
      )}
    </div>
  );
};

export default SacredBooksLibrary;
