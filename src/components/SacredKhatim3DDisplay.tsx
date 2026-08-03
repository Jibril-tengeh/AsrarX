import React, { useRef, useState } from 'react';
import { Download, Eye, Printer, Sparkles, Check, Copy, Shield, Lock, FileDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { downloadCanvasImage } from '../utils/downloadHelper';

interface SacredKhatim3DDisplayProps {
  symbolText: string;
  title?: string;
  formula?: string;
  abjadValue?: number | string;
  angelName?: string;
  divineName?: string;
  vibration?: string;
  versionTitle?: string;
  elementalNature?: string;
  incense?: string;
  timingRule?: string;
  spiritualUtility?: string;
  isExpanded?: boolean;
  onExpand?: () => void;
  isUserPremium?: boolean;
  onRequestPremium?: () => void;
}

export interface ParsedSeal {
  topSymbol?: string;
  calligraphyHeader?: string;
  topCorners?: { left: string; right: string };
  gridRows: string[][];
  bottomCorners?: { left: string; right: string };
  bottomSymbol?: string;
  footerTitle?: string;
  rawText: string;
}

/**
 * Parses raw ASCII Khatim / Wafq symbols into structured grid data
 */
export function parseSealSymbol(asciiStr: string): ParsedSeal {
  const result: ParsedSeal = {
    gridRows: [],
    rawText: asciiStr,
  };

  if (!asciiStr) return result;

  const lines = asciiStr.split('\n').map(l => l.trim()).filter(Boolean);

  // Search for box top '┌' and box bottom '└'
  let boxTopIdx = -1;
  let boxBottomIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('┌')) boxTopIdx = i;
    if (lines[i].includes('└')) boxBottomIdx = i;
  }

  if (boxTopIdx !== -1 && boxBottomIdx !== -1 && boxBottomIdx > boxTopIdx) {
    // Extract top corners if present on boxTopIdx line or preceding line
    const topBoxLine = lines[boxTopIdx];
    // e.g. "د ┌───────────┐ ح" or "┌───────────┐"
    const topParts = topBoxLine.split('┌');
    if (topParts[0].trim()) result.topCorners = { ...(result.topCorners || { left: '', right: '' }), left: topParts[0].trim() };
    if (topParts[1] && topParts[1].includes('┐')) {
      const rightPart = topParts[1].split('┐')[1]?.trim();
      if (rightPart) result.topCorners = { ...(result.topCorners || { left: '', right: '' }), right: rightPart };
    }

    // Extract bottom corners
    const bottomBoxLine = lines[boxBottomIdx];
    const bottomParts = bottomBoxLine.split('└');
    if (bottomParts[0].trim()) result.bottomCorners = { ...(result.bottomCorners || { left: '', right: '' }), left: bottomParts[0].trim() };
    if (bottomParts[1] && bottomParts[1].includes('┘')) {
      const rightPart = bottomParts[1].split('┘')[1]?.trim();
      if (rightPart) result.bottomCorners = { ...(result.bottomCorners || { left: '', right: '' }), right: rightPart };
    }

    // Lines above boxTopIdx
    const topLines = lines.slice(0, boxTopIdx);
    if (topLines.length > 0) {
      if (topLines.length >= 2) {
        result.calligraphyHeader = topLines[0].replace(/[★🌟☆۞🛡️⚖️💖⚡👁️🗝️👑🕊️🌕💡👂📖🔓🏛️🌾🌊⚓⚛️𪞞]/g, '').trim();
        result.topSymbol = topLines[1].trim();
      } else {
        result.topSymbol = topLines[0].trim();
      }
    }

    // Lines inside box
    const insideLines = lines.slice(boxTopIdx + 1, boxBottomIdx);
    for (const line of insideLines) {
      // e.g. "│  2   9   4  │" or "│ 163 163 163│"
      const cleaned = line.replace(/[│|]/g, '').trim();
      if (cleaned) {
        const tokens = cleaned.split(/\s+/).filter(Boolean);
        if (tokens.length > 0) {
          result.gridRows.push(tokens);
        }
      }
    }

    // Lines below boxBottomIdx
    const bottomLines = lines.slice(boxBottomIdx + 1);
    if (bottomLines.length > 0) {
      result.bottomSymbol = bottomLines[0].trim();
      if (bottomLines.length > 1) {
        result.footerTitle = bottomLines[bottomLines.length - 1].replace(/[✦★🌟]/g, '').trim();
      }
    }
  }

  return result;
}

export const SacredKhatim3DDisplay: React.FC<SacredKhatim3DDisplayProps> = ({
  symbolText,
  title = "Khatim Sacré",
  formula,
  abjadValue,
  angelName,
  divineName,
  vibration,
  versionTitle,
  isExpanded = false,
  onExpand,
  isUserPremium = true,
  onRequestPremium,
}) => {
  const { language } = useLanguage();
  const parsed = parseSealSymbol(symbolText);
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const isFr = language === 'fr';
  const isHa = language === 'ha';

  // Direct High-Res Canvas rendering for 3D Seal Download
  const handleDownloadPNG = async () => {
    if (!isUserPremium && onRequestPremium) {
      onRequestPremium();
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 1200;
    const h = 1200;
    canvas.width = w;
    canvas.height = h;

    // Rich Dark Velvet Gold Radial Background
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, w / 2);
    bgGrad.addColorStop(0, '#1c0c30');
    bgGrad.addColorStop(0.5, '#0e051a');
    bgGrad.addColorStop(1, '#05010a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Decorative Watermarks
    ctx.save();
    ctx.rotate((-20 * Math.PI) / 180);
    ctx.fillStyle = 'rgba(217, 119, 6, 0.08)';
    ctx.font = 'bold 24px serif';
    for (let wy = -h; wy < h * 2; wy += 150) {
      for (let wx = -w; wx < w * 2; wx += 350) {
        ctx.fillText('ASRARHUB ✦ KHAWATIM SACRÉ', wx, wy);
      }
    }
    ctx.restore();

    // 3D Beveled Gold Border
    ctx.strokeStyle = '#f59e0b'; // Amber 500
    ctx.lineWidth = 10;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    ctx.strokeStyle = '#d97706'; // Amber 600
    ctx.lineWidth = 4;
    ctx.strokeRect(55, 55, w - 110, h - 110);

    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)'; // Purple glow inner
    ctx.lineWidth = 2;
    ctx.strokeRect(65, 65, w - 130, h - 130);

    // Corner Ornaments
    const drawCorner = (cx: number, cy: number) => {
      ctx.save();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(55, 55);
    drawCorner(w - 55, 55);
    drawCorner(55, h - 55);
    drawCorner(w - 55, h - 55);

    // Header
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 36px serif';
    ctx.textAlign = 'center';
    ctx.fillText('ASRARHUB • KHAWATIM SACRÉ DE LA LUNE', w / 2, 120);

    if (versionTitle) {
      ctx.fillStyle = '#c084fc';
      ctx.font = '22px sans-serif';
      ctx.fillText(versionTitle.toUpperCase(), w / 2, 160);
    }

    if (divineName || angelName) {
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 28px serif';
      ctx.fillText(`${divineName || ''} ${angelName ? `• ${angelName}` : ''}`, w / 2, 205);
    }

    // Render Grid Box if available
    const gridRows = parsed.gridRows;
    const numRows = gridRows.length;
    const numCols = numRows > 0 ? gridRows[0].length : 0;

    const boxX = 200;
    const boxY = 260;
    const boxW = w - 400;
    const boxH = 580;

    // Draw Grid Container Background
    ctx.fillStyle = '#0a0314';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Draw Corners if parsed
    if (parsed.topCorners?.left) {
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText(parsed.topCorners.left, boxX - 45, boxY + 40);
    }
    if (parsed.topCorners?.right) {
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText(parsed.topCorners.right, boxX + boxW + 45, boxY + 40);
    }
    if (parsed.bottomCorners?.left) {
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText(parsed.bottomCorners.left, boxX - 45, boxY + boxH - 20);
    }
    if (parsed.bottomCorners?.right) {
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText(parsed.bottomCorners.right, boxX + boxW + 45, boxY + boxH - 20);
    }

    if (numRows > 0 && numCols > 0) {
      const cellW = boxW / numCols;
      const cellH = boxH / numRows;

      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cx = boxX + c * cellW;
          const cy = boxY + r * cellH;
          const val = gridRows[r][c] || '';

          ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
          ctx.lineWidth = 2;
          ctx.strokeRect(cx + 4, cy + 4, cellW - 8, cellH - 8);

          ctx.fillStyle = '#fef08a';
          let fontSize = Math.floor(Math.min(cellW, cellH) * 0.38);
          if (val.length > 5) fontSize = Math.floor(fontSize * 0.6);
          ctx.font = `bold ${Math.max(18, fontSize)}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(val, cx + cellW / 2, cy + cellH / 2);
        }
      }
    } else {
      // Fallback text drawing
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const lines = symbolText.split('\n');
      const lh = 30;
      const sy = boxY + boxH / 2 - ((lines.length - 1) * lh) / 2;
      lines.forEach((line, idx) => {
        ctx.fillText(line, w / 2, sy + idx * lh);
      });
    }

    // Formula & Footer Details
    ctx.textBaseline = 'alphabetic';
    const footerY = boxY + boxH + 80;

    if (formula) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 38px serif';
      ctx.textAlign = 'center';
      ctx.fillText(formula, w / 2, footerY);
    }

    if (abjadValue) {
      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`VALEUR ABJAD TOTAL : ${abjadValue}`, w / 2, footerY + 50);
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AsrarHub © High-Resolution Printable Sacred Seal • Ready to Print 🖨️', w / 2, h - 50);

    const fileName = `AsrarHub_Khatim_${title.toLowerCase().replace(/\s+/g, '_')}.png`;
    await downloadCanvasImage(canvas, fileName);
  };

  // Direct Print Dialog Handler
  const handlePrint = () => {
    if (!isUserPremium && onRequestPremium) {
      onRequestPremium();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    const gridRows = parsed.gridRows;
    const numRows = gridRows.length;
    const numCols = numRows > 0 ? gridRows[0].length : 0;

    let gridHtml = '';
    if (numRows > 0 && numCols > 0) {
      gridHtml = `<div style="display: grid; grid-template-columns: repeat(${numCols}, 1fr); gap: 8px; width: 320px; height: 320px; margin: 20px auto; border: 4px solid #b45309; padding: 12px; background: #fff; box-shadow: 0 0 0 2px #d97706;">`;
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const val = gridRows[r][c] || '';
          gridHtml += `<div style="border: 2px solid #b45309; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: bold; font-family: serif; color: #000; background: #fff8f0;">${val}</div>`;
        }
      }
      gridHtml += `</div>`;
    } else {
      gridHtml = `<pre style="font-family: monospace; font-size: 16px; font-weight: bold; line-height: 1.6; text-align: center; margin: 20px auto; white-space: pre-wrap;">${symbolText}</pre>`;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Imprimer Sceau - ${title}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { font-family: 'Times New Roman', serif; text-align: center; background: #fff; color: #000; padding: 20px; }
            .border-box { border: 6px double #b45309; padding: 25px; max-width: 550px; margin: 0 auto; background: #fffdfa; }
            h1 { font-size: 24px; color: #78350f; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
            h2 { font-size: 18px; color: #92400e; margin-top: 0; font-style: italic; }
            .corners { display: flex; justify-content: space-between; font-size: 28px; font-weight: bold; color: #78350f; margin: 0 40px; }
            .formula { font-size: 32px; font-weight: bold; margin: 20px 0 10px; color: #000; direction: rtl; }
            .abjad { font-size: 16px; font-weight: bold; color: #92400e; }
            .watermark { font-size: 11px; color: #78350f; margin-top: 30px; border-t: 1px solid #fde68a; pt: 10px; text-transform: uppercase; letter-spacing: 2px; }
          </style>
        </head>
        <body>
          <div class="border-box">
            <h1>ASRARHUB • KHAWATIM SACRÉ</h1>
            <h2>${title} ${versionTitle ? `(${versionTitle})` : ''}</h2>
            
            ${parsed.topCorners ? `<div class="corners"><span>${parsed.topCorners.left || ''}</span><span>${parsed.topCorners.right || ''}</span></div>` : ''}
            
            ${gridHtml}

            ${parsed.bottomCorners ? `<div class="corners"><span>${parsed.bottomCorners.left || ''}</span><span>${parsed.bottomCorners.right || ''}</span></div>` : ''}

            ${formula ? `<div class="formula" dir="rtl">${formula}</div>` : ''}
            ${abjadValue ? `<div class="abjad">VALEUR ABJAD : ${abjadValue}</div>` : ''}
            
            <div class="watermark">Sceau Officiel Prêt à l'Emploi Rituel • AsrarHub</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const gridRows = parsed.gridRows;
  const numRows = gridRows.length;
  const numCols = numRows > 0 ? gridRows[0].length : 0;

  return (
    <div className="w-full flex flex-col items-center select-none" ref={containerRef}>
      {/* 3D Embossed Golden Metallic Seal Container */}
      <div 
        onClick={onExpand}
        className={`group relative w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#160a27] via-[#0d0418] to-[#06010b] border-2 border-amber-500/50 hover:border-amber-400 p-4 sm:p-5 rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(251,191,36,0.3)] hover:shadow-[0_15px_40px_rgba(217,119,6,0.3)] cursor-pointer overflow-hidden ${
          isExpanded ? 'max-w-xl p-6 sm:p-8' : 'max-w-md'
        }`}
      >
        {/* Sacred Geometry Watermark Ring */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border-2 border-dashed border-amber-400 animate-[spin_60s_linear_infinite]" />
          <div className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full border border-purple-500/40" />
        </div>

        {/* Corner Metallic Ornaments */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border border-amber-900 shadow-sm" />
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border border-amber-900 shadow-sm" />
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border border-amber-900 shadow-sm" />
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border border-amber-900 shadow-sm" />

        {/* Top Header symbol if present */}
        {parsed.topSymbol && (
          <div className="text-amber-300/90 text-xs sm:text-sm font-bold tracking-widest mb-2 flex items-center gap-2">
            <Sparkles size={12} className="text-amber-400 animate-pulse" />
            <span>{parsed.topSymbol}</span>
            <Sparkles size={12} className="text-amber-400 animate-pulse" />
          </div>
        )}

        {/* Seal Corner Letters & Grid Layout */}
        <div className="relative w-full flex flex-col items-center justify-center my-2">
          {/* Top Corners */}
          {parsed.topCorners && (
            <div className="w-full max-w-[280px] sm:max-w-[320px] flex items-center justify-between px-2 mb-1">
              <span className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 font-serif font-bold text-sm shadow-md">
                {parsed.topCorners.left}
              </span>
              <span className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 font-serif font-bold text-sm shadow-md">
                {parsed.topCorners.right}
              </span>
            </div>
          )}

          {/* SVG / Vector Grid Display (No text deformation) */}
          {numRows > 0 && numCols > 0 ? (
            <div className={`w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] ${numRows === 1 ? 'h-24' : 'aspect-square'} bg-[#0a0314] border-2 border-amber-500/70 rounded-xl p-1.5 sm:p-2 shadow-2xl shadow-amber-500/10 flex flex-col justify-between`}>
              <div 
                className={`w-full h-full grid ${numCols >= 5 ? 'gap-0.5 p-0.5' : 'gap-1 sm:gap-1.5 p-1'}`}
                style={{
                  gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))`,
                }}
              >
                {gridRows.map((row, rIdx) =>
                  row.map((cellVal, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`relative flex items-center justify-center bg-gradient-to-br from-purple-950/80 via-[#130722] to-black border border-amber-500/40 rounded-lg ${numCols >= 5 ? 'p-0.5' : 'p-1'} shadow-inner hover:border-amber-400 transition-colors overflow-hidden`}
                    >
                      <span className={`text-amber-300 font-serif font-extrabold ${
                        numCols <= 3 ? 'text-xs sm:text-base md:text-lg' :
                        numCols === 4 ? 'text-[10px] sm:text-sm md:text-base' :
                        numCols === 5 ? 'text-[9px] sm:text-xs md:text-sm' :
                        'text-[7px] sm:text-[9px] md:text-[11px]'
                      } tracking-tight text-center truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]`}>
                        {cellVal}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* Fallback crisp vector boxed view */
            <div className="w-full max-w-[280px] sm:max-w-[320px] bg-[#0a0314] border-2 border-amber-500/70 rounded-xl p-3 shadow-2xl flex items-center justify-center">
              <pre className="text-amber-300 font-mono text-xs sm:text-sm font-bold leading-relaxed text-center whitespace-pre overflow-x-auto max-w-full">
                {symbolText}
              </pre>
            </div>
          )}

          {/* Bottom Corners */}
          {parsed.bottomCorners && (
            <div className="w-full max-w-[280px] sm:max-w-[320px] flex items-center justify-between px-2 mt-1">
              <span className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 font-serif font-bold text-sm shadow-md">
                {parsed.bottomCorners.left}
              </span>
              <span className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 font-serif font-bold text-sm shadow-md">
                {parsed.bottomCorners.right}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Title / Formula Badge */}
        {formula && (
          <div className="mt-2 text-center">
            <span className="text-amber-300 font-serif font-bold text-base sm:text-lg tracking-wide dir-rtl" dir="rtl">
              {formula}
            </span>
          </div>
        )}

        {/* Hover Fullscreen Overlay */}
        <div className="absolute inset-0 bg-purple-950/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center backdrop-blur-[3px]">
          <span className="bg-amber-500 text-black font-extrabold text-xs px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xl flex items-center gap-1.5 uppercase tracking-wider">
            <Eye size={14} className="animate-pulse" />
            {isFr ? "Agrandir en Plein Écran 3D" : "Enlarge 3D Seal"}
          </span>
        </div>
      </div>

      {/* Direct Action Control Buttons Bar */}
      <div className="flex items-center gap-2 w-full mt-2.5">
        <button
          type="button"
          onClick={onExpand}
          className="flex-1 flex items-center justify-center gap-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold py-2 px-3 rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
          title={isFr ? "Afficher en plein écran" : "View seal full screen"}
        >
          <Eye size={14} className="text-purple-300" />
          <span>{isFr ? "Plein Écran" : "Full Screen"}</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-xs font-extrabold py-2 px-3 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
          title={isFr ? "Imprimer le Sceau au format A4" : "Print Seal on A4 paper"}
        >
          <Printer size={14} className="text-black" />
          <span>{isFr ? "Imprimer 🖨️" : "Print 🖨️"}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadPNG}
          className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-bold py-2 px-3 rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
          title={isFr ? "Télécharger l'image PNG Haute Résolution" : "Download High-Res PNG"}
        >
          <Download size={14} className="text-amber-400" />
          <span>{isFr ? "Télécharger" : "Download"}</span>
        </button>
      </div>
    </div>
  );
};
