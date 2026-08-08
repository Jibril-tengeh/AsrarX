import React, { useState, useRef } from "react";
import { Sparkles, Maximize2, Copy, Check, Grid, AlignLeft, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toCanvas } from "html-to-image";
import { downloadCanvasImage } from "../utils/downloadHelper";
import { getKhatimGridData } from "./KhatimVisualizer";

interface CommunityPostContentProps {
  content: string;
  khatimGrid?: (string | number)[][];
  isOurPost?: boolean;
}

const formatCellMultiLine = (val: string | number) => {
  if (typeof val !== 'string') return val;
  const str = val.trim();
  if (!str) return '';
  if (str.includes(' ')) {
    const words = str.split(/\s+/);
    if (words.length >= 2) {
      return words.join('\n');
    }
  }
  return str;
};

const getCommunityCellInlineStyle = (val: string | number, cols: number): React.CSSProperties => {
  if (typeof val !== 'string') return {};
  const raw = val.trim();
  if (!raw) return {};

  const normalized = raw
    .replace(/[\u064B-\u065F\u0670\u0671]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .toLowerCase();

  const len = normalized.length;

  const isUltraLongName = 
    normalized.includes('جلال') || 
    normalized.includes('اكرام') || 
    normalized.includes('ملك الملك') || 
    len >= 12;

  let baseScale = 1.0;
  let lineHeight = '1.0';

  if (cols >= 9) {
    if (isUltraLongName) {
      baseScale = 0.36;
      lineHeight = '0.80';
    } else if (len > 10) {
      baseScale = 0.50;
      lineHeight = '0.85';
    } else if (len > 6) {
      baseScale = 0.75;
      lineHeight = '0.90';
    }
  } else if (cols >= 7) {
    if (isUltraLongName) {
      baseScale = 0.45;
      lineHeight = '0.82';
    } else if (len > 10) {
      baseScale = 0.60;
      lineHeight = '0.88';
    } else if (len > 6) {
      baseScale = 0.82;
      lineHeight = '0.92';
    }
  } else if (cols >= 5) {
    if (isUltraLongName) {
      baseScale = 0.58;
      lineHeight = '0.85';
    } else if (len > 10) {
      baseScale = 0.72;
      lineHeight = '0.90';
    } else if (len > 6) {
      baseScale = 0.88;
      lineHeight = '0.95';
    }
  } else {
    if (isUltraLongName) {
      baseScale = 0.70;
      lineHeight = '0.88';
    } else if (len > 10) {
      baseScale = 0.82;
      lineHeight = '0.92';
    }
  }

  return {
    fontSize: '11px',
    lineHeight,
    padding: '0px',
    margin: '0px',
    transform: `scale(${baseScale.toFixed(3)})`,
    transformOrigin: 'center center',
    display: 'inline-block',
    maxWidth: '100%',
    whiteSpace: 'pre-line',
    wordBreak: 'break-word',
    ...(isUltraLongName ? { letterSpacing: '-0.03em' } : {})
  };
};

const getCommunityCellFontSize = (val: string | number, cols: number) => {
  const str = (val || '').toString().trim();
  const len = str.length;
  if (cols >= 9) {
    if (len > 12) return 'text-[1px] sm:text-[1.3px]';
    if (len > 6) return 'text-[1.3px] sm:text-[1.8px]';
    return 'text-[1.8px] sm:text-[2.2px]';
  }
  if (cols >= 7) {
    if (len > 12) return 'text-[1.3px] sm:text-[1.8px]';
    if (len > 6) return 'text-[1.8px] sm:text-[2.4px]';
    return 'text-[2.4px] sm:text-[3px]';
  }
  if (cols >= 5) {
    if (len > 12) return 'text-[1.8px] sm:text-[2.5px]';
    if (len > 6) return 'text-[2.5px] sm:text-[3.2px]';
    return 'text-[3.2px] sm:text-[4px]';
  }
  // cols <= 4
  if (len > 15) return 'text-[2.8px] sm:text-[3.8px]';
  if (len > 8) return 'text-[3.8px] sm:text-[5px]';
  return 'text-[5px] sm:text-[6.5px] md:text-[8px]';
};

export function parsePostContent(content: string) {
  if (!content) {
    return {
      isSharedTool: false,
      headerText: "",
      matrixGrid: null,
      footerText: "",
      extractedTitle: "",
      extractedArabicTitle: "",
    };
  }

  const isSharedTool = content.includes("[Partage de la Communauté") || content.includes("DÉTAILS DU CALCUL / MATRICE");
  const lines = content.split("\n");

  const matrixRowIndices: number[] = [];
  const matrixRows: string[][] = [];

  let extractedTitle = "";
  let extractedArabicTitle = "";

  // Extract titles if present
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes("Item :") || trimmed.includes("Sceau :")) {
      const titlePart = trimmed.split(":")[1]?.trim() || "";
      // E.g. "2. The Seal of the First Crescent (Hilal) (خَاتَمُ الهِلاَلِ الأَوَّلِ)"
      const arabicMatch = titlePart.match(/([\u0600-\u06FF\s()]+)$/);
      if (arabicMatch) {
        extractedArabicTitle = arabicMatch[0].trim();
        extractedTitle = titlePart.replace(arabicMatch[0], "").trim();
      } else {
        extractedTitle = titlePart;
      }
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if line contains pipe characters '|'
    const hasPipes = line.includes("|");
    if (hasPipes) {
      const cleaned = line.replace(/^\|+/, "").replace(/\|+$/, "").trim();
      let rawCells: string[] = [];

      if (cleaned.includes("|")) {
        rawCells = cleaned.split("|").map((c) => c.trim()).filter((c) => c !== "");
      } else {
        // Space-separated values inside pipes e.g. "| 19 09 66 111 |" or "| ( هـ ل ا ل ) |"
        const innerClean = cleaned.replace(/[()]/g, "").trim();
        rawCells = innerClean.split(/\s+/).filter((c) => c !== "");
      }

      if (rawCells.length >= 2) {
        matrixRowIndices.push(i);
        matrixRows.push(rawCells);
      }
    } else if (line.startsWith("[") && line.endsWith("]")) {
      const inner = line.slice(1, -1).trim();
      const rawCells = inner.split(/[,|\s]+/).map((c) => c.trim()).filter((c) => c !== "");
      if (rawCells.length >= 2) {
        matrixRowIndices.push(i);
        matrixRows.push(rawCells);
      }
    }
  }

  const hasValidMatrix = matrixRows.length >= 2;

  if (!hasValidMatrix) {
    return {
      isSharedTool,
      headerText: content,
      matrixGrid: null,
      footerText: "",
      extractedTitle,
      extractedArabicTitle,
    };
  }

  const firstMatrixIdx = matrixRowIndices[0];
  const lastMatrixIdx = matrixRowIndices[matrixRowIndices.length - 1];

  const headerLines = lines.slice(0, firstMatrixIdx).filter((l) => l.trim().length > 0);
  const footerLines = lines.slice(lastMatrixIdx + 1).filter((l) => l.trim().length > 0);

  return {
    isSharedTool,
    headerText: headerLines.join("\n"),
    matrixGrid: matrixRows,
    footerText: footerLines.join("\n"),
    extractedTitle,
    extractedArabicTitle,
  };
}

export const CommunityPostContent: React.FC<CommunityPostContentProps> = ({
  content,
  khatimGrid: initialKhatimGrid,
}) => {
  const [viewMode, setViewMode] = useState<"visual" | "text">("visual");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloadingPNG, setIsDownloadingPNG] = useState(false);

  const khatimCardRef = useRef<HTMLDivElement>(null);

  const parsed = parsePostContent(content);

  // Parse matrix grid safely whether stored as object rows, JSON string, or standard array
  let parsedGrid: (string | number)[][] | null = null;
  if (initialKhatimGrid) {
    if (Array.isArray(initialKhatimGrid) && initialKhatimGrid.length > 0) {
      const firstRow = initialKhatimGrid[0];
      if (typeof firstRow === 'object' && firstRow !== null && 'cells' in (firstRow as any)) {
        parsedGrid = (initialKhatimGrid as any[]).map(r => r.cells);
      } else if (typeof firstRow === 'string' && (firstRow as string).includes('|')) {
        parsedGrid = (initialKhatimGrid as any[]).map(r => (r as string).split('|').map(c => c.trim()));
      } else if (Array.isArray(firstRow)) {
        parsedGrid = initialKhatimGrid as (string | number)[][];
      }
    } else if (typeof initialKhatimGrid === 'string') {
      try { parsedGrid = JSON.parse(initialKhatimGrid); } catch {}
    }
  }

  // Fallback to default matrix if this is a Seal post or parsed text matrix
  let activeGrid = parsedGrid || parsed.matrixGrid;

  if (!activeGrid && (content.includes("The Seal of") || content.includes("Sceau") || content.includes("Hilal"))) {
    const fallbackGridData = getKhatimGridData(1, parsed.extractedTitle || content);
    if (fallbackGridData && fallbackGridData.cells) {
      activeGrid = fallbackGridData.cells;
    }
  }

  const isParchmentStyle = content.includes("Style Parchemin") || content.includes("Parchemin Sacré");

  const handleCopyMatrix = () => {
    if (!activeGrid) return;
    const textMatrix = activeGrid.map((row) => row.join("\t|\t")).join("\n");
    navigator.clipboard.writeText(textMatrix);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadPNG = async () => {
    if (!khatimCardRef.current) return;
    setIsDownloadingPNG(true);
    try {
      const canvas = await toCanvas(khatimCardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#080214",
      });
      const fileName = `Khatim_${(parsed.extractedTitle || "Sceau").replace(/\s+/g, "_")}.png`;
      downloadCanvasImage(canvas, fileName);
    } catch (err) {
      console.error("Failed to download Khatim image:", err);
    } finally {
      setIsDownloadingPNG(false);
    }
  };

  const getWafqName = (rows: number, cols: number) => {
    const size = Math.max(rows, cols);
    switch (size) {
      case 3:
        return "المثلث (3×3)";
      case 4:
        return "المربع (4×4)";
      case 5:
        return "المخمس (5×5)";
      case 6:
        return "المسدس (6×6)";
      case 7:
        return "المسبع (7×7)";
      case 8:
        return "المثمن (8×8)";
      case 9:
        return "المتسع (9×9)";
      case 10:
        return "المعشر (10×10)";
      default:
        return `${size}×${size}`;
    }
  };

  const rows = activeGrid ? activeGrid.length : 0;
  const cols = activeGrid && activeGrid[0] ? activeGrid[0].length : 0;

  return (
    <div className="w-full min-w-0 max-w-full space-y-3 text-left overflow-hidden">
      {/* Header text content formatted nicely */}
      {parsed.headerText && (
        <div
          className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words min-w-0 ${
            isParchmentStyle
              ? "p-4 sm:p-5 bg-[#fef3c7] text-[#451a03] border-2 border-double border-amber-700/60 rounded-2xl shadow-inner font-serif relative"
              : parsed.isSharedTool
              ? "p-3 sm:p-4 bg-gradient-to-r from-purple-950/40 via-black/30 to-purple-950/20 dark:bg-white/5 border border-purple-500/30 dark:border-teal-500/30 rounded-2xl shadow-sm text-gray-900 dark:text-gray-100"
              : ""
          }`}
        >
          {isParchmentStyle && (
            <div className="text-center font-arabic text-amber-900 text-sm font-bold mb-2">
              ﷽
            </div>
          )}
          {parsed.headerText}
        </div>
      )}

      {/* Visual Majestic Khatim Matrix Card (Matching Image 2 Style) */}
      {activeGrid && (
        <div className="w-full min-w-0 max-w-full space-y-2 mt-2">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/95 dark:bg-slate-950 p-2 sm:p-2.5 rounded-xl border border-amber-500/40 shadow-md">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="p-1 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
                <Sparkles size={13} />
              </span>
              <span className="text-[11px] font-black text-amber-300 truncate">
                🕋 Khatim Sacré {getWafqName(rows, cols)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Mode Toggle */}
              <div className="flex bg-black/50 p-0.5 rounded-lg border border-amber-500/30">
                <button
                  type="button"
                  onClick={() => setViewMode("visual")}
                  className={`px-2 py-1 text-[10px] font-extrabold rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                    viewMode === "visual"
                      ? "bg-amber-500 text-black shadow-xs"
                      : "text-amber-200/70 hover:text-white"
                  }`}
                  title="Afficher en mode visuel (grille)"
                >
                  <Grid size={11} />
                  <span>Visuel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("text")}
                  className={`px-2 py-1 text-[10px] font-extrabold rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                    viewMode === "text"
                      ? "bg-amber-500 text-black shadow-xs"
                      : "text-amber-200/70 hover:text-white"
                  }`}
                  title="Afficher en mode texte bruts"
                >
                  <AlignLeft size={11} />
                  <span>Texte</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="p-1.5 text-amber-300/90 hover:text-amber-100 hover:bg-amber-500/20 rounded-lg transition-all cursor-pointer"
                title="Plein écran (Agrandir la matrice)"
              >
                <Maximize2 size={13} />
              </button>

              <button
                type="button"
                onClick={handleCopyMatrix}
                className="p-1.5 text-amber-300/90 hover:text-amber-100 hover:bg-amber-500/20 rounded-lg transition-all cursor-pointer"
                title="Copier la matrice"
              >
                {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              </button>

              <button
                type="button"
                onClick={handleDownloadPNG}
                disabled={isDownloadingPNG}
                className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[10px] rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                title="Télécharger l'image PNG du Khatim"
              >
                <Download size={11} />
                <span>PNG</span>
              </button>
            </div>
          </div>

          {/* Visual Card Display */}
          {viewMode === "visual" ? (
            <div
              ref={khatimCardRef}
              className={`w-full rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden font-serif my-2 ${
                isParchmentStyle
                  ? "bg-[#fef3c7] border-4 border-double border-amber-800 text-amber-950 shadow-amber-900/10"
                  : "bg-gradient-to-b from-[#180933] via-[#0d031c] to-[#05010a] border-2 border-amber-500/80 text-amber-100"
              }`}
            >
              {/* Outer Decorative Accent Border */}
              <div className={`absolute inset-1.5 border rounded-2xl pointer-events-none ${
                isParchmentStyle ? "border-amber-700/40" : "border-purple-500/30"
              }`} />

              {/* Corner Traditional Calligraphy Symbols */}
              <span className={`absolute top-2 left-3 sm:top-2.5 sm:left-3.5 max-w-[120px] text-xs sm:text-sm md:text-base font-uthmani select-none pointer-events-none z-20 leading-none text-left whitespace-nowrap ${
                isParchmentStyle ? "text-[#5c2406] font-bold" : "text-amber-300 font-bold"
              }`} dir="rtl">
                ﷽
              </span>
              <span className={`absolute top-2.5 right-3.5 max-w-[120px] text-xs sm:text-sm font-arabic select-none pointer-events-none z-20 leading-snug text-right ${
                isParchmentStyle ? "text-amber-900 font-bold" : "text-amber-400/80"
              }`} dir="rtl">
                الله
              </span>
              <span className={`absolute bottom-2.5 left-3.5 max-w-[120px] text-xs sm:text-sm font-arabic select-none pointer-events-none z-20 leading-snug text-left ${
                isParchmentStyle ? "text-amber-900 font-bold" : "text-amber-400/80"
              }`} dir="rtl">
                محمد
              </span>
              <span className={`absolute bottom-2.5 right-3.5 max-w-[120px] text-xs sm:text-sm font-arabic select-none pointer-events-none z-20 leading-snug text-right ${
                isParchmentStyle ? "text-amber-900 font-bold" : "text-amber-400/80"
              }`} dir="rtl">
                علي
              </span>

              {/* Card Title Header */}
              <div className={`text-center space-y-1 relative z-10 pb-3 border-b mb-3 ${
                isParchmentStyle ? "border-amber-800/40" : "border-amber-500/30"
              }`}>
                <div className={`flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase ${
                  isParchmentStyle ? "text-amber-850" : "text-amber-400"
                }`}>
                  <Sparkles size={12} className={isParchmentStyle ? "text-amber-700" : "text-amber-400"} />
                  <span>ASRARHUB • LUNAR SEALS AND KHAWATIM</span>
                  <Sparkles size={12} className={isParchmentStyle ? "text-amber-700" : "text-amber-400"} />
                </div>

                {parsed.extractedTitle && (
                  <h3 className={`text-sm sm:text-lg font-extrabold tracking-wide font-serif ${
                    isParchmentStyle ? "text-amber-950" : "text-white"
                  }`}>
                    {parsed.extractedTitle}
                  </h3>
                )}

                {parsed.extractedArabicTitle && (
                  <p className={`text-lg sm:text-2xl font-bold font-arabic py-0.5 tracking-wider ${
                    isParchmentStyle ? "text-amber-900" : "text-amber-300"
                  }`} dir="rtl">
                    {parsed.extractedArabicTitle}
                  </p>
                )}

                <p className={`text-[11px] font-medium ${
                  isParchmentStyle ? "text-amber-800" : "text-amber-200/80"
                }`}>
                  {rows}×{cols} Wafq Sacré • Puissance & Harmonic Matrices
                </p>
              </div>

              {/* Basmala Header above Grid */}
              <div className="flex justify-center mb-2">
                <div className={`text-center font-uthmani text-xs sm:text-sm font-bold tracking-wider leading-relaxed py-1 px-4 rounded-xl border shadow-md ${
                  isParchmentStyle 
                    ? "bg-[#fde68a]/90 text-[#5c2406] border-[#b45309]/50 shadow-[#b45309]/15" 
                    : "bg-gradient-to-r from-amber-950/80 via-black/90 to-amber-950/80 text-amber-300 border-amber-500/40 shadow-amber-500/20"
                }`} dir="rtl">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
              </div>

              {/* Centered Majestic Khatim Grid Box */}
              <div className="flex justify-center my-3 relative z-10">
                <div className={`border-2 rounded-2xl p-2 sm:p-3.5 shadow-2xl inline-block max-w-full ${
                  isParchmentStyle ? "bg-[#fffbeb] border-amber-800/80 shadow-amber-900/10" : "bg-black/80 border-amber-500/80"
                }`}>
                  <div
                    className="grid gap-1.5 sm:gap-2.5 max-w-full justify-center"
                    style={{
                      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    }}
                  >
                    {activeGrid.map((row, rIdx) =>
                      row.map((cell, cIdx) => (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={`border-2 rounded-xl flex items-center justify-center text-center font-black transition-all shadow-inner select-all min-h-0 min-w-0 overflow-hidden ${
                            isParchmentStyle
                              ? "bg-amber-100/90 hover:bg-amber-200/90 border-amber-700/70 text-amber-950 font-serif"
                              : "bg-gradient-to-br from-amber-500/25 via-purple-950/60 to-black hover:from-amber-500/40 hover:to-purple-900/60 border-amber-500/60 text-amber-100 hover:text-white font-mono"
                          } ${
                            cols >= 9
                              ? "min-w-[24px] sm:min-w-[32px] h-[24px] sm:h-[32px]"
                              : cols >= 7
                              ? "min-w-[30px] sm:min-w-[40px] h-[30px] sm:h-[40px]"
                              : cols >= 5
                              ? "min-w-[38px] sm:min-w-[50px] h-[38px] sm:h-[50px]"
                              : "min-w-[46px] sm:min-w-[64px] h-[46px] sm:h-[64px]"
                          }`}
                        >
                          <span 
                            className={`whitespace-pre-line text-center max-w-full max-h-full overflow-hidden flex flex-col items-center justify-center ${
                              typeof cell === 'string' && /[\u0600-\u06FF]/.test(cell)
                                ? "font-arabic py-0 px-0.5"
                                : "font-mono leading-tight px-0.5"
                            } ${getCommunityCellFontSize(cell, cols)}`} 
                            style={getCommunityCellInlineStyle(cell, cols)}
                            dir="rtl"
                          >
                            {formatCellMultiLine(cell)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className={`text-center space-y-1 text-xs pt-3 border-t mt-3 relative z-10 ${
                isParchmentStyle ? "border-amber-800/30 text-amber-900" : "border-amber-500/30 text-amber-200/90"
              }`}>
                <p className={`font-arabic text-sm font-bold ${
                  isParchmentStyle ? "text-amber-950" : "text-amber-300"
                }`}>
                  فَتْحٌ وَنَصْرٌ مِنَ اللَّهِ
                </p>
                <p className={`text-[10px] uppercase tracking-widest font-mono ${
                  isParchmentStyle ? "text-amber-800" : "text-amber-400/80"
                }`}>
                  ✦ ASRARHUB — SIRR AL-ASRAR & RUHANIYAT ✦
                </p>
              </div>
            </div>
          ) : (
            /* Plain Text Mode */
            <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-3 font-mono text-xs text-amber-300 overflow-x-auto max-h-[220px]">
              <pre className="whitespace-pre">
                {activeGrid.map((row) => row.join("\t|\t")).join("\n")}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Footer text content if any */}
      {parsed.footerText && (
        <div className="text-xs leading-relaxed whitespace-pre-wrap break-words text-gray-700 dark:text-gray-200 mt-2">
          {parsed.footerText}
        </div>
      )}

      {/* Fullscreen Zoom Modal for Large Wafqs */}
      <AnimatePresence>
        {isFullscreen && activeGrid && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-950 border-2 border-amber-500/70 rounded-3xl p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col space-y-4"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b border-amber-500/30 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-amber-200">
                      🕋 Matrice Sacrée Visuelle ({getWafqName(rows, cols)})
                    </h3>
                    <p className="text-[11px] text-amber-400/80 font-medium">
                      Mode Haute Résolution & Inspection Complète
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyMatrix}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold rounded-xl border border-amber-500/40 cursor-pointer transition-all"
                  >
                    {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{isCopied ? "Copié !" : "Copier"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFullscreen(false)}
                    className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer font-extrabold text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Fullscreen Grid Frame */}
              <div className="w-full overflow-x-auto p-4 sm:p-8 bg-slate-900/90 rounded-2xl border border-amber-500/40 shadow-inner relative flex justify-center items-center">
                {/* Traditional Calligraphy Corner Seals */}
                <span className="absolute top-2 left-3 text-sm sm:text-base text-amber-500/60 font-arabic select-none">
                  ﷽
                </span>
                <span className="absolute top-2 right-3 text-sm sm:text-base text-amber-500/60 font-arabic select-none">
                  الله
                </span>
                <span className="absolute bottom-2 left-3 text-sm sm:text-base text-amber-500/60 font-arabic select-none">
                  محمد
                </span>
                <span className="absolute bottom-2 right-3 text-sm sm:text-base text-amber-500/60 font-arabic select-none">
                  علي
                </span>

                <div
                  className="grid gap-2 sm:gap-3 max-w-full my-2"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  }}
                >
                  {activeGrid.map((row, rIdx) =>
                    row.map((cell, cIdx) => (
                      <div
                        key={`fs-${rIdx}-${cIdx}`}
                        className={`min-w-[44px] sm:min-w-[64px] h-[44px] sm:h-[64px] px-2 bg-gradient-to-br from-amber-500/25 via-purple-950/60 to-black hover:from-amber-500/40 hover:to-purple-900/60 border-2 border-amber-500/60 rounded-xl flex items-center justify-center text-center font-mono font-black text-amber-100 shadow-md ${
                          cols >= 7 ? "text-xs sm:text-sm" : "text-base sm:text-xl"
                        }`}
                      >
                        {cell}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
