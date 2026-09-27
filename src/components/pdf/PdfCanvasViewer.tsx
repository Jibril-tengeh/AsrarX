import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  ExternalLink, 
  Download, 
  AlertCircle,
  FileText,
  Rows3,
  Columns2,
  Eye,
  EyeOff,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { getApiUrl } from '../../lib/api';

interface PdfCanvasViewerProps {
  url: string;
  title: string;
  onClose?: () => void;
  language?: 'fr' | 'en' | 'ha';
}

/**
 * Individual Page Renderer for both Page-by-Page and Vertical Continuous Scroll modes.
 * Uses IntersectionObserver for lazy-loading so large PDF documents don't exhaust memory.
 */
interface SinglePageProps {
  pdfDoc: any;
  pageNumber: number;
  scale: number;
  rotation: number;
  containerWidth: number;
  isVerticalMode?: boolean;
  onVisible?: (pageNum: number) => void;
  priority?: boolean;
}

const SinglePdfPage: React.FC<SinglePageProps> = ({
  pdfDoc,
  pageNumber,
  scale,
  rotation,
  containerWidth,
  isVerticalMode = false,
  onVisible,
  priority = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerDivRef = useRef<HTMLDivElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  const [isVisible, setIsVisible] = useState<boolean>(priority);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  // Lazy loading observer for vertical mode
  useEffect(() => {
    if (priority) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (entry.intersectionRatio > 0.4 && onVisible) {
              onVisible(pageNumber);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '300px 0px 300px 0px', // Pre-render before scrolling into view
        threshold: [0.1, 0.5, 0.8]
      }
    );

    const elem = containerDivRef.current;
    if (elem) observer.observe(elem);

    return () => {
      if (elem) observer.unobserve(elem);
      observer.disconnect();
    };
  }, [pageNumber, onVisible, priority]);

  // Render page to canvas
  useEffect(() => {
    if (!pdfDoc || !isVisible) return;
    let isCancelled = false;

    const render = async () => {
      try {
        if (renderTaskRef.current) {
          try { renderTaskRef.current.cancel(); } catch (_) {}
        }

        setIsRendering(true);
        const page = await pdfDoc.getPage(pageNumber);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Adapt scale to container width on mobile
        let activeScale = scale;
        const unscaledViewport = page.getViewport({ scale: 1, rotation });
        if (containerWidth > 120 && unscaledViewport.width > 0) {
          // In vertical mode or small mobile screens, ensure page fits comfortably
          const targetWidth = Math.min(containerWidth - 24, 900);
          const autoFitScale = targetWidth / unscaledViewport.width;
          activeScale = autoFitScale * (scale / 1.2);
        }

        const viewport = page.getViewport({ scale: activeScale, rotation });
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance

        setDimensions({
          width: viewport.width,
          height: viewport.height
        });

        canvas.height = viewport.height * pixelRatio;
        canvas.width = viewport.width * pixelRatio;
        canvas.style.height = `${viewport.height}px`;
        canvas.style.width = `${viewport.width}px`;

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException' && !isCancelled) {
          console.warn(`Render error page ${pageNumber}:`, err);
        }
      } finally {
        if (!isCancelled) {
          setIsRendering(false);
        }
      }
    };

    render();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch (_) {}
      }
    };
  }, [pdfDoc, pageNumber, isVisible, scale, rotation, containerWidth]);

  return (
    <div
      ref={containerDivRef}
      id={`pdf-page-container-${pageNumber}`}
      className={`relative flex flex-col items-center justify-center transition-all ${
        isVerticalMode 
          ? 'w-full my-3 sm:my-5' 
          : 'my-auto'
      }`}
      style={{
        minHeight: dimensions ? `${dimensions.height}px` : '380px',
        minWidth: dimensions ? `${dimensions.width}px` : '260px'
      }}
    >
      {/* Vertical Mode Page Header Badge */}
      {isVerticalMode && (
        <div className="mb-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 text-[11px] font-mono font-bold shadow-md flex items-center gap-1.5 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Page {pageNumber} / {pdfDoc.numPages}</span>
        </div>
      )}

      {/* Page Canvas Container with Shadow and Paper Styling */}
      <div 
        className="relative bg-white rounded-lg sm:rounded-xl shadow-2xl overflow-hidden border border-slate-700/30"
        style={{
          width: dimensions ? `${dimensions.width}px` : 'auto',
          height: dimensions ? `${dimensions.height}px` : 'auto'
        }}
      >
        {isRendering && (
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] flex items-center justify-center z-10">
            <RefreshCw size={22} className="animate-spin text-emerald-400" />
          </div>
        )}
        <canvas ref={canvasRef} className="block mx-auto max-w-full" />
      </div>
    </div>
  );
};

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  url,
  title,
  language = 'fr',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pageInput, setPageInput] = useState<string>('1');
  const [containerWidth, setContainerWidth] = useState<number>(() => typeof window !== 'undefined' ? window.innerWidth : 600);

  // New Modes: 'page' (Page by page with swipe) vs 'vertical' (Continuous scroll)
  const [readingMode, setReadingMode] = useState<'page' | 'vertical'>(() => {
    try {
      const saved = localStorage.getItem('asrar_pdf_reading_mode');
      if (saved === 'vertical' || saved === 'page') return saved as 'page' | 'vertical';
    } catch (_) {}
    return 'page';
  });

  // Immersive mode: Hides toolbars for distraction-free 100% full screen reading
  const [isImmersive, setIsImmersive] = useState<boolean>(false);
  const [useFallbackViewer, setUseFallbackViewer] = useState<boolean>(false);

  // Touch Swipe State
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [swipeFeedback, setSwipeFeedback] = useState<string | null>(null);
  const swipeFeedbackTimer = useRef<any>(null);

  // Monitor container width for responsive scaling
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Sync fullscreen change events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  // Load PDF Document
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const loadDocument = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        try {
          const origin = typeof window !== 'undefined' ? window.location.origin : '';
          pdfjsLib.GlobalWorkerOptions.workerSrc = `${origin}/pdf.worker.min.mjs`;
        } catch (_) {}

        // Handle base64 data URLs directly without network overhead
        if (url.startsWith('data:')) {
          const parts = url.split(';base64,');
          const b64 = parts.length > 1 ? parts[1] : parts[0];
          const binaryString = atob(b64);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const loadingTask = pdfjsLib.getDocument({
            data: bytes,
            cMapUrl: '/pdfjs/cmaps/',
            cMapPacked: true,
            standardFontDataUrl: '/pdfjs/standard_fonts/',
          });
          const doc = await loadingTask.promise;
          if (isCancelled) return;
          setPdfDoc(doc);
          setTotalPages(doc.numPages || 1);
          setCurrentPage(1);
          setPageInput('1');
          setLoading(false);
          return;
        }

        // Resolve absolute URL or proxy if needed
        let resolvedUrl = url;
        if (resolvedUrl.startsWith('/')) {
          resolvedUrl = getApiUrl(resolvedUrl);
        } else if (
          (resolvedUrl.startsWith('http://') || resolvedUrl.startsWith('https://')) &&
          typeof window !== 'undefined' &&
          !resolvedUrl.includes(window.location.host)
        ) {
          // Use proxy for remote external URLs to bypass CORS & Google Drive redirects
          resolvedUrl = getApiUrl(`/api/pdf/proxy?url=${encodeURIComponent(resolvedUrl)}`);
        }

        // Fetch as arrayBuffer for reliable cross-origin loading
        const response = await fetch(resolvedUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Impossible de récupérer le fichier PDF`);
        }
        const data = await response.arrayBuffer();
        if (isCancelled) return;

        let doc: any = null;
        try {
          const loadingTask = pdfjsLib.getDocument({
            data: new Uint8Array(data),
            cMapUrl: '/pdfjs/cmaps/',
            cMapPacked: true,
            standardFontDataUrl: '/pdfjs/standard_fonts/',
          });
          doc = await loadingTask.promise;
        } catch (workerErr: any) {
          console.warn('PDF worker load notice, falling back to direct rendering:', workerErr);
          try {
            pdfjsLib.GlobalWorkerOptions.workerSrc = '';
            const fallbackTask = pdfjsLib.getDocument({
              data: new Uint8Array(data),
              cMapUrl: '/pdfjs/cmaps/',
              cMapPacked: true,
              isEvalSupported: false,
            });
            doc = await fallbackTask.promise;
          } catch (innerErr) {
            throw workerErr;
          }
        }

        if (isCancelled) return;

        setPdfDoc(doc);
        setTotalPages(doc.numPages || 1);
        setCurrentPage(1);
        setPageInput('1');
        setLoading(false);
      } catch (err: any) {
        if (!isCancelled) {
          console.warn('PDF Canvas Viewer load error:', err);
          setError(
            err?.message ||
              (language === 'fr'
                ? "Impossible d'afficher le document dans le lecteur intégré."
                : "Unable to display document in embedded reader.")
          );
          setLoading(false);
        }
      }
    };

    loadDocument();

    return () => {
      isCancelled = true;
    };
  }, [url, language]);

  // Page Navigation Handlers
  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      const p = currentPage - 1;
      setCurrentPage(p);
      setPageInput(String(p));

      // Show temporary swipe feedback
      showFeedback(`← Page ${p}`);

      // In vertical mode, scroll page into view
      if (readingMode === 'vertical') {
        const target = document.getElementById(`pdf-page-container-${p}`);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentPage, readingMode]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      const p = currentPage + 1;
      setCurrentPage(p);
      setPageInput(String(p));

      // Show temporary swipe feedback
      showFeedback(`Page ${p} →`);

      // In vertical mode, scroll page into view
      if (readingMode === 'vertical') {
        const target = document.getElementById(`pdf-page-container-${p}`);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentPage, totalPages, readingMode]);

  const showFeedback = (text: string) => {
    if (swipeFeedbackTimer.current) clearTimeout(swipeFeedbackTimer.current);
    setSwipeFeedback(text);
    swipeFeedbackTimer.current = setTimeout(() => {
      setSwipeFeedback(null);
    }, 1200);
  };

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3.0));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.6));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  // Toggle Reading Mode (Page by Page vs Vertical Continuous Scroll)
  const handleToggleReadingMode = () => {
    const nextMode = readingMode === 'page' ? 'vertical' : 'page';
    setReadingMode(nextMode);
    try {
      localStorage.setItem('asrar_pdf_reading_mode', nextMode);
    } catch (_) {}

    showFeedback(
      nextMode === 'vertical' 
        ? (language === 'fr' ? 'Lecture verticale continue' : 'Vertical reading mode')
        : (language === 'fr' ? 'Mode Page par page (Balayage)' : 'Page-by-page swipe mode')
    );

    // Scroll to current page when entering vertical mode
    setTimeout(() => {
      if (nextMode === 'vertical') {
        const target = document.getElementById(`pdf-page-container-${currentPage}`);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Fullscreen Handler (Cross-device Android, iOS, Desktop)
  const toggleFullscreen = () => {
    const elem = containerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Touch Swipe Gestures (Balayage d'écran)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (readingMode === 'vertical') return; // Natural scroll handles vertical mode
    if (e.touches.length !== 1) return;

    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
    setIsSwiping(false);
    setSwipeOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (readingMode === 'vertical' || !touchStartRef.current) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartRef.current.x;
    const diffY = currentY - touchStartRef.current.y;

    // Detect primarily horizontal intent
    if (Math.abs(diffX) > Math.abs(diffY) * 1.15 && Math.abs(diffX) > 12) {
      setIsSwiping(true);
      // Dampen offset at book boundaries
      if ((currentPage === 1 && diffX > 0) || (currentPage === totalPages && diffX < 0)) {
        setSwipeOffset(diffX * 0.25);
      } else {
        setSwipeOffset(diffX * 0.75);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (readingMode === 'vertical' || !touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartRef.current.x;
    const diffY = touch.clientY - touchStartRef.current.y;
    const elapsed = Date.now() - touchStartRef.current.time;

    const isQuickSwipe = elapsed < 350 && Math.abs(diffX) > 35;
    const isLongSwipe = Math.abs(diffX) > 70;

    if ((isQuickSwipe || isLongSwipe) && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0 && currentPage < totalPages) {
        // Balayage vers la gauche -> Page Suivante
        handleNextPage();
      } else if (diffX > 0 && currentPage > 1) {
        // Balayage vers la droite -> Page Précédente
        handlePrevPage();
      }
    }

    touchStartRef.current = null;
    setIsSwiping(false);
    setSwipeOffset(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage]);

  const directOpenUrl = url.startsWith('/') ? getApiUrl(url) : url;

  return (
    <div
      ref={containerRef}
      className={`flex-1 flex flex-col w-full h-full bg-slate-950 relative overflow-hidden select-none ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Top Controls Toolbar (Can be toggled with immersive mode) */}
      <div 
        className={`bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-2 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 z-20 shrink-0 text-xs transition-all duration-300 ${
          isImmersive ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Navigation & Page Number */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || loading}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors cursor-pointer active:scale-95 shadow-xs"
            title="Page précédente (ou glisser vers la droite)"
            aria-label="Précédent"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1 px-1 font-mono text-slate-300">
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = parseInt(pageInput, 10);
                  if (!isNaN(val) && val >= 1 && val <= totalPages) {
                    setCurrentPage(val);
                    if (readingMode === 'vertical') {
                      document.getElementById(`pdf-page-container-${val}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  } else {
                    setPageInput(String(currentPage));
                  }
                }
              }}
              className="w-9 sm:w-11 bg-slate-800 border border-slate-700 rounded-lg px-1.5 py-0.5 text-center text-xs text-white font-bold focus:outline-none focus:border-emerald-500 shadow-inner"
            />
            <span className="text-slate-500 text-xs">/</span>
            <span className="text-slate-400 font-bold text-xs">{totalPages || '–'}</span>
          </div>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || loading}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors cursor-pointer active:scale-95 shadow-xs"
            title="Page suivante (ou glisser vers la gauche)"
            aria-label="Suivant"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Feature 1: Mode Lecture Verticale vs Page par Page */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleReadingMode}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
              readingMode === 'vertical'
                ? 'bg-emerald-600 text-white shadow-emerald-900/40 ring-1 ring-emerald-400/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title={
              readingMode === 'vertical' 
                ? "Lecture verticale active. Cliquez pour basculer en mode Page par page"
                : "Mode Page par page actif. Cliquez pour basculer en Lecture verticale continue"
            }
          >
            {readingMode === 'vertical' ? (
              <>
                <Rows3 size={15} className="text-emerald-200" />
                <span className="text-[11px] hidden xs:inline">Vertical</span>
              </>
            ) : (
              <>
                <Columns2 size={15} />
                <span className="text-[11px] hidden xs:inline">Pages</span>
              </>
            )}
          </button>

          {/* Zoom controls */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 0.6 || loading}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors cursor-pointer shadow-xs"
            title="Zoom arrière"
          >
            <ZoomOut size={15} />
          </button>
          <span className="font-mono text-[11px] text-slate-400 min-w-8 text-center font-bold">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 3.0 || loading}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors cursor-pointer shadow-xs"
            title="Zoom avant"
          >
            <ZoomIn size={15} />
          </button>

          <button
            type="button"
            onClick={handleRotate}
            disabled={loading}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer hidden md:inline-flex shadow-xs"
            title="Pivoter de 90°"
          >
            <RotateCw size={15} />
          </button>
        </div>

        {/* Feature 2: Option Plein Écran (Mobile & Desktop) */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95 ${
              isFullscreen 
                ? 'bg-amber-600 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran complet'}
            aria-label="Plein écran"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span className="text-[11px] font-bold hidden lg:inline">
              {isFullscreen ? 'Réduire' : 'Plein Écran'}
            </span>
          </button>

          {/* Immersive Mode (Masquer les barres pour lecture pure) */}
          <button
            type="button"
            onClick={() => setIsImmersive(!isImmersive)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer hidden sm:inline-flex shadow-xs"
            title={isImmersive ? 'Afficher les barres' : 'Mode Immersion (Plein écran pur)'}
          >
            {isImmersive ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>

          <a
            href={directOpenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-xs"
            title="Ouvrir le PDF directement"
          >
            <ExternalLink size={14} />
          </a>

          <a
            href={directOpenUrl}
            download={title ? `${title.slice(0, 30)}.pdf` : 'livre.pdf'}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer shadow-xs"
            title="Télécharger"
          >
            <Download size={14} />
          </a>
        </div>
      </div>

      {/* Floating Exit Button when Immersive or Fullscreen */}
      {(isImmersive || isFullscreen) && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          {isImmersive && (
            <button
              type="button"
              onClick={() => setIsImmersive(false)}
              className="p-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white shadow-xl border border-slate-700 transition-all cursor-pointer backdrop-blur"
              title="Réafficher les commandes"
            >
              <Eye size={16} />
            </button>
          )}
          {isFullscreen && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white shadow-xl border border-slate-700 transition-all cursor-pointer backdrop-blur"
              title="Quitter le plein écran"
            >
              <Minimize2 size={16} />
            </button>
          )}
        </div>
      )}

      {/* Floating Swipe / Action Toast Feedback */}
      {swipeFeedback && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all">
          <div className="px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-emerald-500/40 text-emerald-400 font-bold text-xs shadow-2xl backdrop-blur flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
            <Sparkles size={13} className="text-emerald-400" />
            <span>{swipeFeedback}</span>
          </div>
        </div>
      )}

      {/* Main Canvas Scroll / Reader Area */}
      <div 
        ref={scrollAreaRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 overflow-auto flex flex-col items-center bg-slate-950 p-2 sm:p-5 relative ${
          readingMode === 'vertical' 
            ? 'justify-start space-y-4' 
            : 'justify-center'
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center my-auto p-6 text-center">
            <RefreshCw size={36} className="animate-spin text-emerald-400 mb-3" />
            <p className="text-sm text-white font-bold mb-1">
              {language === 'fr' ? 'Chargement du document PDF...' : 'Loading PDF document...'}
            </p>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              {language === 'fr' ? 'Rendu haute fidélité en cours' : 'High fidelity rendering in progress'}
            </p>
            <a
              href={directOpenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold inline-flex items-center gap-1.5 border border-slate-700 cursor-pointer shadow-md"
            >
              <ExternalLink size={14} />
              <span>{language === 'fr' ? 'Ouvrir directement' : 'Open directly'}</span>
            </a>
          </div>
        ) : useFallbackViewer ? (
          <div className="w-full h-full flex flex-col flex-1 relative bg-slate-900">
            <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-emerald-400">
                {language === 'fr' ? 'Lecteur Alternatif de Secours' : 'Alternative Fallback Reader'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setUseFallbackViewer(false);
                  loadDocument();
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <RefreshCw size={12} />
                <span>{language === 'fr' ? 'Revenir au Lecteur HD' : 'Back to HD'}</span>
              </button>
            </div>
            <iframe
              src={
                (directOpenUrl.startsWith('http://') || directOpenUrl.startsWith('https://')) &&
                !directOpenUrl.includes(window.location.host)
                  ? `https://docs.google.com/viewer?url=${encodeURIComponent(directOpenUrl)}&embedded=true`
                  : `${directOpenUrl}#toolbar=1&navpanes=1`
              }
              title={title || 'Document PDF'}
              className="w-full h-full flex-1 border-0 bg-slate-900"
              style={{ minHeight: '100%', height: '100%' }}
            />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center my-auto p-6 text-center max-w-md bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            <h4 className="text-sm font-bold text-white">
              {language === 'fr' ? 'Lecture du document' : 'Document reading'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'fr'
                ? "Le document est prêt. Cliquez ci-dessous pour l'afficher directement dans le lecteur intégré ou l'ouvrir sur votre appareil."
                : 'The document is ready. Click below to view it directly or open in your device.'}
            </p>
            <div className="flex flex-col gap-2 w-full pt-1">
              <button
                type="button"
                onClick={() => setUseFallbackViewer(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <FileText size={15} />
                <span>{language === 'fr' ? 'Afficher dans le lecteur intégré' : 'Open in embedded viewer'}</span>
              </button>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <a
                  href={directOpenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                >
                  <ExternalLink size={14} />
                  <span>{language === 'fr' ? 'Ouvrir nouvel onglet' : 'Open tab'}</span>
                </a>
                <a
                  href={directOpenUrl}
                  download
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                >
                  <Download size={14} />
                  <span>{language === 'fr' ? 'Télécharger' : 'Download'}</span>
                </a>
              </div>
              <button
                type="button"
                onClick={() => loadDocument()}
                className="py-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <RefreshCw size={13} />
                <span>{language === 'fr' ? 'Réessayer le rendu haute définition' : 'Retry HD rendering'}</span>
              </button>
            </div>
          </div>
        ) : readingMode === 'vertical' ? (
          /* ================= MODE LECTURE VERTICALE ================= */
          <div className="w-full max-w-4xl flex flex-col items-center py-2 space-y-4">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pNum) => (
              <SinglePdfPage
                key={`vert-page-${pNum}`}
                pdfDoc={pdfDoc}
                pageNumber={pNum}
                scale={scale}
                rotation={rotation}
                containerWidth={containerWidth}
                isVerticalMode={true}
                onVisible={(pageInView) => {
                  setCurrentPage(pageInView);
                  setPageInput(String(pageInView));
                }}
              />
            ))}
          </div>
        ) : (
          /* ================= MODE PAGE PAR PAGE (Avec Balayage / Swipe) ================= */
          <div 
            className="relative flex items-center justify-center my-auto transition-transform duration-150 ease-out"
            style={{
              transform: isSwiping ? `translateX(${swipeOffset}px)` : 'translateX(0px)',
              cursor: isSwiping ? 'grabbing' : 'grab'
            }}
          >
            <SinglePdfPage
              key={`single-page-${currentPage}`}
              pdfDoc={pdfDoc}
              pageNumber={currentPage}
              scale={scale}
              rotation={rotation}
              containerWidth={containerWidth}
              isVerticalMode={false}
              priority={true}
            />

            {/* Mobile Subtle Swipe Edge Tap Zones for Quick Navigation */}
            {currentPage > 1 && (
              <button
                type="button"
                onClick={handlePrevPage}
                className="absolute left-1 top-1/2 -translate-y-1/2 w-9 h-14 rounded-r-2xl bg-slate-900/60 hover:bg-slate-900/90 text-slate-300 hover:text-white flex items-center justify-center transition-all opacity-40 hover:opacity-100 backdrop-blur-xs border-r border-y border-slate-700/60 shadow-lg cursor-pointer"
                title="Page précédente (ou glisser vers la droite)"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            {currentPage < totalPages && (
              <button
                type="button"
                onClick={handleNextPage}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-14 rounded-l-2xl bg-slate-900/60 hover:bg-slate-900/90 text-slate-300 hover:text-white flex items-center justify-center transition-all opacity-40 hover:opacity-100 backdrop-blur-xs border-l border-y border-slate-700/60 shadow-lg cursor-pointer"
                title="Page suivante (ou glisser vers la gauche)"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar Hints & Mode Indicator */}
      {!isImmersive && !loading && !error && (
        <div className="bg-slate-900/80 backdrop-blur border-t border-slate-800/80 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-400 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {readingMode === 'vertical' ? 'Lecture verticale' : 'Page par page'}
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-400">
              {readingMode === 'vertical' 
                ? 'Faites défiler de haut en bas' 
                : 'Glissez l\'écran horizontalement (balayage) ou utilisez les flèches'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {readingMode === 'page' && (
              <span className="text-[10px] text-slate-400 hidden xs:inline">
                ← Glisser pour tourner →
              </span>
            )}
            <button
              type="button"
              onClick={handleToggleReadingMode}
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowUpDown size={12} />
              <span>{readingMode === 'vertical' ? 'Passer en Page/Page' : 'Passer en Vertical'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
