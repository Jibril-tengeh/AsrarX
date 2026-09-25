import React from 'react';
import { createRoot } from 'react-dom/client';
import { jsPDF } from 'jspdf';
import { toCanvas } from 'html-to-image';
import html2canvas from 'html2canvas';
import { StructuredInterpretationMarkdown, normalizeInterpretationMarkdown } from '../pages/user/tools/DreamJournal';
import { downloadPdfDoc } from './downloadHelper';
import { notifyDownloadStart, notifyDownloadSuccess, notifyDownloadError } from './downloadNotification';

export interface PrintableDreamData {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'rahmani' | 'nafsani' | 'shaytani' | 'unknown' | string;
  wirdDone?: string;
  interpretation?: string;
  scholar?: string;
}

/**
 * Printable visual template matching AsrarHub high-definition UI.
 * Pure white background, high contrast, branded headers, authentic typography,
 * watermark, and fully rendered structured interpretation.
 */
const DreamPrintableDocument: React.FC<{
  dream: PrintableDreamData;
  dreamNumber?: number;
  totalDreams?: number;
}> = ({ dream, dreamNumber, totalDreams }) => {
  const formattedDate = new Date(dream.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const typeConfig: Record<string, { label: string; bg: string; color: string; icon: string }> = {
    rahmani: {
      label: 'Vision Rahmani (Véridique & Divine)',
      bg: '#ecfdf5',
      color: '#065f46',
      icon: '🌙'
    },
    nafsani: {
      label: 'Songe Nafsani (Psychologique)',
      bg: '#fef3c7',
      color: '#92400e',
      icon: '🧠'
    },
    shaytani: {
      label: 'Cauchemar Shaytani (À conjurer)',
      bg: '#ffe4e6',
      color: '#9f1239',
      icon: '⚠️'
    },
    unknown: {
      label: 'Vision Spirituelle',
      bg: '#f3e8ff',
      color: '#6b21a8',
      icon: '✨'
    }
  };

  const typeInfo = typeConfig[dream.type] || typeConfig.unknown;

  return (
    <div
      style={{
        width: '800px',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        padding: '36px 36px 48px 36px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Watermark Grid */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          opacity: 0.04,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          transform: 'rotate(-20deg)',
          zIndex: 0
        }}
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={`dreampdfexporter-i-${i}`}
            style={{
              fontSize: '32px',
              fontWeight: 900,
              letterSpacing: '8px',
              color: '#d97706',
              whiteSpace: 'nowrap'
            }}
          >
            ASRARHUB ✦ أسرار هاب ✦ ASRARHUB ✦ أسرار هاب
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #3730a3 0%, #4f46e5 50%, #7c3aed 100%)',
            borderRadius: '16px',
            padding: '24px 28px',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
            marginBottom: '28px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#c7d2fe' }}>
              ✦ ASRARHUB • ARCHIVES ONIRIQUES & TA'BĪR
            </div>
            {totalDreams && totalDreams > 1 && (
              <div
                style={{
                  fontSize: '11px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontWeight: 700
                }}
              >
                Rêve {dreamNumber} sur {totalDreams}
              </div>
            )}
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
            Journal des Rêves & Vision Spirituelle
          </h1>
          <p style={{ fontSize: '12px', margin: 0, color: '#e0e7ff', opacity: 0.9 }}>
            Plateforme d'interprétation authentique selon la Sunnah, Ibn Sīrīn, Al-Nābulusī & les Savants
          </p>
        </div>

        {/* Dream Title & Metadata Card */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '24px'
          }}
        >
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#1e1b4b',
              margin: '0 0 12px 0',
              lineHeight: 1.3
            }}
          >
            {dream.title}
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '11.5px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '4px 10px',
                borderRadius: '8px',
                color: '#475569',
                fontWeight: 600
              }}
            >
              📅 {formattedDate}
            </span>

            <span
              style={{
                fontSize: '11.5px',
                backgroundColor: typeInfo.bg,
                color: typeInfo.color,
                border: `1px solid ${typeInfo.color}30`,
                padding: '4px 10px',
                borderRadius: '8px',
                fontWeight: 700
              }}
            >
              {typeInfo.icon} {typeInfo.label}
            </span>

            {dream.wirdDone && (
              <span
                style={{
                  fontSize: '11.5px',
                  backgroundColor: '#eef2ff',
                  color: '#4338ca',
                  border: '1px solid #c7d2fe',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontWeight: 600
                }}
              >
                📿 Prélude (Wird) : {dream.wirdDone}
              </span>
            )}
          </div>
        </div>

        {/* Story Narrative Box */}
        <div style={{ marginBottom: '26px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#4338ca',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>📖</span> RÉCIT DU RÊVE (LE SONGE)
          </div>
          <div
            style={{
              backgroundColor: '#fdfdfe',
              border: '1px solid #e0e7ff',
              borderLeft: '5px solid #6366f1',
              borderRadius: '12px',
              padding: '18px 22px',
              fontSize: '14px',
              lineHeight: '1.7',
              color: '#334155',
              whiteSpace: 'pre-wrap',
              fontStyle: 'italic'
            }}
          >
            « {dream.content} »
          </div>
        </div>

        {/* Interpretation Section */}
        {dream.interpretation && (
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '10px',
                borderBottom: '2px solid #e0e7ff',
                marginBottom: '18px'
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#3730a3',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🔮</span> INTERPRÉTATION SPIRITUELLE & TA'BĪR
              </div>
              <div
                style={{
                  fontSize: '11px',
                  backgroundColor: '#eef2ff',
                  color: '#4338ca',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '12px'
                }}
              >
                Méthode : Ibn Sīrīn, Al-Nābulusī & Savants
              </div>
            </div>

            {/* Rendered Structured Markdown */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e7ff',
                borderRadius: '16px',
                padding: '24px 28px',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.05)'
              }}
            >
              <StructuredInterpretationMarkdown content={dream.interpretation} />
            </div>
          </div>
        )}

        {/* Official Authentication Stamp Box */}
        <div
          style={{
            marginTop: '28px',
            padding: '16px 20px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155' }}>
              ✦ ASRARHUB • DOCUMENT D'INTERPRÉTATION ONIRIQUE
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
              Document personnel d'accompagnement spirituel • Id: {dream.id}
            </div>
          </div>
          <div
            style={{
              fontSize: '10.5px',
              fontWeight: 700,
              color: '#d97706',
              border: '1px dashed #d97706',
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#fffbeb'
            }}
          >
            CERTIFIÉ ASRARHUB
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Smart Canvas Page Slicer
 * Scans vertical intervals for clean whitespace rows so text lines are never cut across pages.
 */
function sliceCanvasIntoA4Pages(canvas: HTMLCanvasElement): HTMLCanvasElement[] {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  // A4 aspect ratio height for this canvas width:
  const a4PageHeight = Math.floor(canvasWidth * 1.4142);
  const bottomFooterHeight = 60; // pixel reserve for page footer
  const maxContentHeightPerPage = a4PageHeight - bottomFooterHeight;

  // If it fits on a single A4 page
  if (canvasHeight <= a4PageHeight) {
    const singleCanvas = document.createElement('canvas');
    singleCanvas.width = canvasWidth;
    singleCanvas.height = a4PageHeight;
    const ctx = singleCanvas.getContext('2d');
    if (!ctx) return [canvas];

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, a4PageHeight);
    ctx.drawImage(canvas, 0, 0);

    // Footer
    drawPageFooter(ctx, canvasWidth, a4PageHeight, 1, 1);
    return [singleCanvas];
  }

  // Multi-page slicing:
  const pages: HTMLCanvasElement[] = [];
  const ctx = canvas.getContext('2d');
  let currentY = 0;

  // Pre-calculate page slices
  const slices: { startY: number; endY: number }[] = [];

  while (currentY < canvasHeight) {
    const idealEndY = currentY + maxContentHeightPerPage;

    if (idealEndY >= canvasHeight) {
      slices.push({ startY: currentY, endY: canvasHeight });
      break;
    }

    // Scan backwards from idealEndY to find a safe blank horizontal line (margin)
    let bestCutY = idealEndY;
    let foundBlank = false;

    if (ctx) {
      const scanStart = idealEndY;
      const scanEnd = Math.max(currentY + 200, idealEndY - 160);

      for (let y = scanStart; y >= scanEnd; y -= 2) {
        // Check pixel values across this row
        const rowData = ctx.getImageData(40, y, canvasWidth - 80, 1).data;
        let isRowBlank = true;

        for (let x = 0; x < rowData.length; x += 16) {
          const r = rowData[x];
          const g = rowData[x + 1];
          const b = rowData[x + 2];
          // If any pixel is substantially darker than pure white/light cream
          if (r < 240 || g < 240 || b < 240) {
            isRowBlank = false;
            break;
          }
        }

        if (isRowBlank) {
          bestCutY = y;
          foundBlank = true;
          break;
        }
      }
    }

    slices.push({ startY: currentY, endY: bestCutY });
    currentY = bestCutY;
  }

  const totalPages = slices.length;

  // Render each slice into an independent A4 canvas
  slices.forEach((slice, idx) => {
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvasWidth;
    pageCanvas.height = a4PageHeight;
    const pageCtx = pageCanvas.getContext('2d');
    if (!pageCtx) return;

    // Fill page background
    pageCtx.fillStyle = '#ffffff';
    pageCtx.fillRect(0, 0, canvasWidth, a4PageHeight);

    const sliceHeight = slice.endY - slice.startY;
    pageCtx.drawImage(
      canvas,
      0, slice.startY, canvasWidth, sliceHeight,
      0, 20, canvasWidth, sliceHeight
    );

    // Draw Footer
    drawPageFooter(pageCtx, canvasWidth, a4PageHeight, idx + 1, totalPages);
    pages.push(pageCanvas);
  });

  return pages;
}

function drawPageFooter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pageNumber: number,
  totalPages: number
) {
  const footerY = height - 32;

  // Divider line
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(36, footerY - 14);
  ctx.lineTo(width - 36, footerY - 14);
  ctx.stroke();

  // Footer text
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('AsrarHub • Plateforme Spirituelle & Ésotérique — Recueil Onirique', 36, footerY);

  ctx.textAlign = 'right';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText(`Page ${pageNumber} sur ${totalPages}`, width - 36, footerY);
}

/**
 * Exports a single dream into a high-definition PDF matching the web application view.
 */
export async function exportDreamToHighDefPDF(dream: PrintableDreamData): Promise<boolean> {
  const fileName = `reve-${dream.id || 'asrarhub'}.pdf`;
  notifyDownloadStart(fileName);

  const container = document.createElement('div');
  container.id = 'asrarhub-dream-pdf-render-box';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.zIndex = '-9999';
  document.body.appendChild(container);

  try {
    const root = createRoot(container);
    root.render(<DreamPrintableDocument dream={dream} />);

    // Allow browser layout and fonts to settle
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Capture DOM to canvas
    let masterCanvas: HTMLCanvasElement;
    try {
      masterCanvas = await toCanvas(container, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        skipFonts: true,
        cacheBust: true
      });
    } catch (toCanvasErr) {
      console.warn('[PDF Exporter] toCanvas failed, attempting html2canvas fallback:', toCanvasErr);
      masterCanvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false
      });
    }

    // Clean up DOM container
    root.unmount();
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }

    // Slice canvas into clean A4 pages
    const a4Pages = sliceCanvasIntoA4Pages(masterCanvas);

    // Build PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    a4Pages.forEach((pageCanvas, i) => {
      if (i > 0) pdf.addPage();
      const imgData = pageCanvas.toDataURL('image/jpeg', 0.94);
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    });

    // Save PDF across web and native Android
    const success = await downloadPdfDoc(pdf, fileName);
    return success;
  } catch (err) {
    console.error('[PDF Exporter] Critical error generating dream PDF:', err);
    notifyDownloadError(fileName);
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    return false;
  }
}

/**
 * Exports multiple dreams into a consolidated high-definition PDF collection.
 */
export async function exportAllDreamsToHighDefPDF(dreams: PrintableDreamData[]): Promise<boolean> {
  if (!dreams || dreams.length === 0) return false;

  const fileName = 'journal-des-reves-asrarhub.pdf';
  notifyDownloadStart(fileName);

  const container = document.createElement('div');
  container.id = 'asrarhub-all-dreams-pdf-render-box';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.zIndex = '-9999';
  document.body.appendChild(container);

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let isFirstPageOverall = true;

    // Process each dream sequentially
    for (let dIdx = 0; dIdx < dreams.length; dIdx++) {
      const dream = dreams[dIdx];
      const root = createRoot(container);
      root.render(
        <DreamPrintableDocument
          dream={dream}
          dreamNumber={dIdx + 1}
          totalDreams={dreams.length}
        />
      );

      await new Promise((resolve) => setTimeout(resolve, 300));

      let masterCanvas: HTMLCanvasElement;
      try {
        masterCanvas = await toCanvas(container, {
          backgroundColor: '#ffffff',
          pixelRatio: 2,
          skipFonts: true,
          cacheBust: true
        });
      } catch (_) {
        masterCanvas = await html2canvas(container, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          logging: false
        });
      }

      root.unmount();

      const a4Pages = sliceCanvasIntoA4Pages(masterCanvas);
      a4Pages.forEach((pageCanvas) => {
        if (!isFirstPageOverall) {
          pdf.addPage();
        }
        isFirstPageOverall = false;
        const imgData = pageCanvas.toDataURL('image/jpeg', 0.94);
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      });
    }

    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }

    const success = await downloadPdfDoc(pdf, fileName);
    return success;
  } catch (err) {
    console.error('[PDF Exporter] Error exporting all dreams:', err);
    notifyDownloadError(fileName);
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    return false;
  }
}
