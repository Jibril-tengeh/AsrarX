import { downloadCanvasImage } from './downloadHelper';

interface ExportSealParams {
  title: string;
  subtitle: string;
  arabicName: string;
  formula: string;
  abjadValue: string;
  graphicSymbol: string;
  groupTitle: string;
  lang: 'fr' | 'en' | 'ha';
  versionTitle?: string;
}

/**
 * Renders a Lunar Seal onto a high-resolution canvas with gold & dark velvet aesthetic,
 * sacred borders, and triggers a clean download.
 */
export async function generateAndDownloadSealCard(params: ExportSealParams): Promise<boolean> {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 1500;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  // Background - Deep Royal Velvet Dark Gradient
  const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, width);
  bgGradient.addColorStop(0, '#1a0b2e');
  bgGradient.addColorStop(0.5, '#0d0418');
  bgGradient.addColorStop(1, '#05010a');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Outer Gold & Purple Decorative Border
  ctx.strokeStyle = '#d97706'; // Amber 600
  ctx.lineWidth = 12;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = '#a855f7'; // Purple 500
  ctx.lineWidth = 4;
  ctx.strokeRect(45, 45, width - 90, height - 90);

  // Corner Ornaments
  const drawCorner = (x: number, y: number) => {
    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  drawCorner(45, 45);
  drawCorner(width - 45, 45);
  drawCorner(45, height - 45);
  drawCorner(width - 45, height - 45);

  // Header Title - AsrarHub
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 32px serif';
  ctx.textAlign = 'center';
  ctx.fillText('ASRARHUB • SCEAUX ET KHAWATIM DE LA LUNE', width / 2, 100);

  // Group Badge
  ctx.fillStyle = '#c084fc';
  ctx.font = '22px sans-serif';
  ctx.fillText(params.groupTitle.toUpperCase(), width / 2, 140);

  // Main Seal Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px serif';
  ctx.fillText(params.title, width / 2, 200);

  // Subtitle
  ctx.fillStyle = '#fef08a';
  ctx.font = '24px sans-serif';
  ctx.fillText(params.subtitle, width / 2, 240);

  // Arabic Name Calligraphy
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 44px serif';
  ctx.fillText(params.arabicName, width / 2, 300);

  // Decorative Line
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 330);
  ctx.lineTo(width - 100, 330);
  ctx.stroke();

  // Version Badge if provided
  if (params.versionTitle) {
    ctx.fillStyle = '#e9d5ff';
    ctx.font = 'italic 22px sans-serif';
    ctx.fillText(params.versionTitle, width / 2, 365);
  }

  // Graphic Symbol Card Box
  const boxX = 80;
  const boxY = params.versionTitle ? 390 : 360;
  const boxW = width - 160;
  const boxH = 760;

  ctx.fillStyle = '#030008';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = '#9333ea';
  ctx.lineWidth = 3;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  // Render Graphic Symbol Text
  ctx.fillStyle = '#d8b4fe'; // Light Purple
  ctx.font = '20px monospace';
  ctx.textAlign = 'center';

  const symbolLines = params.graphicSymbol.split('\n');
  const lineSpacing = 30;
  const startY = boxY + 50 + Math.max(0, (boxH - symbolLines.length * lineSpacing) / 2);

  symbolLines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, startY + idx * lineSpacing);
  });

  // Footer Section - Formula and Abjad Value
  const footerY = boxY + boxH + 60;
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 26px serif';
  ctx.fillText(`FORMULE : ${params.formula}`, width / 2, footerY);

  ctx.fillStyle = '#c084fc';
  ctx.font = '22px sans-serif';
  ctx.fillText(`VALEUR ABJAD : ${params.abjadValue}`, width / 2, footerY + 36);

  // File Name formatting
  const sanitizedTitle = params.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
  const fileName = `asrarhub_seal_${sanitizedTitle}.png`;

  return await downloadCanvasImage(canvas, fileName, false);
}

/**
 * Generates an SVG vector version of the Lunar Seal card and triggers download.
 */
export function generateAndDownloadSealSVG(params: ExportSealParams): boolean {
  const width = 1200;
  const height = 1500;
  
  const symbolLines = params.graphicSymbol.split('\n');
  const lineSpacing = 32;
  const startY = 480;

  const escapeXml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const svgLinesText = symbolLines
    .map((line, idx) => {
      const y = startY + idx * lineSpacing;
      return `<text x="${width / 2}" y="${y}" fill="#d8b4fe" font-family="monospace" font-size="20" text-anchor="middle" xml:space="preserve">${escapeXml(line)}</text>`;
    })
    .join('\n    ');

  const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1a0b2e" />
      <stop offset="50%" stop-color="#0d0418" />
      <stop offset="100%" stop-color="#05010a" />
    </radialGradient>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

  <!-- Borders -->
  <rect x="30" y="30" width="${width - 60}" height="${height - 60}" fill="none" stroke="#d97706" stroke-width="12" />
  <rect x="45" y="45" width="${width - 90}" height="${height - 90}" fill="none" stroke="#a855f7" stroke-width="4" />

  <!-- Corner Ornaments -->
  <circle cx="45" cy="45" r="16" fill="#f59e0b" />
  <circle cx="${width - 45}" cy="45" r="16" fill="#f59e0b" />
  <circle cx="45" cy="${height - 45}" r="16" fill="#f59e0b" />
  <circle cx="${width - 45}" cy="${height - 45}" r="16" fill="#f59e0b" />

  <!-- Header -->
  <text x="${width / 2}" y="100" fill="#f59e0b" font-family="serif" font-size="32" font-weight="bold" text-anchor="middle">ASRARHUB • SCEAUX ET KHAWATIM DE LA LUNE</text>
  <text x="${width / 2}" y="140" fill="#c084fc" font-family="sans-serif" font-size="22" text-anchor="middle">${escapeXml(params.groupTitle.toUpperCase())}</text>
  <text x="${width / 2}" y="200" fill="#ffffff" font-family="serif" font-size="42" font-weight="bold" text-anchor="middle">${escapeXml(params.title)}</text>
  <text x="${width / 2}" y="240" fill="#fef08a" font-family="sans-serif" font-size="24" text-anchor="middle">${escapeXml(params.subtitle)}</text>
  <text x="${width / 2}" y="300" fill="#fbbf24" font-family="serif" font-size="44" font-weight="bold" text-anchor="middle">${escapeXml(params.arabicName)}</text>

  <!-- Decorative Line -->
  <line x1="100" y1="330" x2="${width - 100}" y2="330" stroke="#d97706" stroke-width="2" opacity="0.6" />

  ${params.versionTitle ? `<text x="${width / 2}" y="365" fill="#e9d5ff" font-family="sans-serif" font-size="22" font-style="italic" text-anchor="middle">${escapeXml(params.versionTitle)}</text>` : ''}

  <!-- Symbol Box Container -->
  <rect x="80" y="${params.versionTitle ? 390 : 360}" width="${width - 160}" height="760" fill="#030008" stroke="#9333ea" stroke-width="3" rx="16" />

  <!-- Monospace Seal Graphic Symbol Lines -->
  ${svgLinesText}

  <!-- Footer Info -->
  <text x="${width / 2}" y="1220" fill="#fef08a" font-family="serif" font-size="26" font-weight="bold" text-anchor="middle">FORMULE : ${escapeXml(params.formula)}</text>
  <text x="${width / 2}" y="1260" fill="#c084fc" font-family="sans-serif" font-size="22" text-anchor="middle">VALEUR ABJAD : ${escapeXml(params.abjadValue)}</text>
  <text x="${width / 2}" y="1320" fill="#a855f7" font-family="sans-serif" font-size="18" text-anchor="middle">Propriété Spirituelle Explicative - AsrarHub Sacred Seal Collection</text>
</svg>`;

  try {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const sanitizedTitle = params.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
    link.download = `asrarhub_seal_${sanitizedTitle}.svg`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (e) {
    console.error("Failed to download SVG seal", e);
    return false;
  }
}
