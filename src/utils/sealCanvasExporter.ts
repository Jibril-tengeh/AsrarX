import { downloadCanvasImage } from './downloadHelper';
import { getKhatimGridData, KhatimGridData } from '../components/KhatimVisualizer';

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
  version?: number;
  sealId?: string;
}

/**
 * Renders a Lunar Seal onto a high-resolution canvas with gold & dark velvet aesthetic,
 * sacred borders, visual Khatim grid table, and triggers a clean download.
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

  // AsrarHub Engraved Watermark Pattern on Canvas
  ctx.save();
  ctx.rotate((-25 * Math.PI) / 180);
  ctx.fillStyle = 'rgba(192, 132, 252, 0.08)'; // purple-400 watermark
  ctx.font = 'bold 22px serif';
  for (let wy = -height; wy < height * 2; wy += 140) {
    for (let wx = -width; wx < width * 2; wx += 320) {
      ctx.fillText('ASRARHUB ✦ ASRARHUB', wx, wy);
    }
  }
  ctx.restore();

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

  const lang = params.lang || 'fr';
  const i18n = {
    fr: {
      header: 'ASRARHUB • SCEAUX ET KHAWATIM DE LA LUNE',
      formula: (f: string) => `FORMULE : ${f}`,
      abjadValue: (v: string) => `VALEUR ABJAD : ${v}`,
      footerNote: 'Propriété Spirituelle Explicative - AsrarHub Sacred Seal Collection',
    },
    en: {
      header: 'ASRARHUB • LUNAR SEALS AND KHAWATIM',
      formula: (f: string) => `FORMULA: ${f}`,
      abjadValue: (v: string) => `ABJAD VALUE: ${v}`,
      footerNote: 'Esoteric Spiritual Property - AsrarHub Sacred Seal Collection',
    },
    ha: {
      header: 'ASRARHUB • KHATIM DA HATIMIN WATA',
      formula: (f: string) => `KALMA: ${f}`,
      abjadValue: (v: string) => `LISSAFIN ABJAD: ${v}`,
      footerNote: 'Malamta da Asirin Ruhi - AsrarHub Sacred Seal Collection',
    }
  };
  const t = i18n[lang] || i18n.fr;

  // Max text width allowed inside the inner card borders (1200 - 160 = 1040px)
  const maxTextWidth = width - 160;

  // Header Title - AsrarHub
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  let headerFontSize = 32;
  const mainHeaderStr = t.header;
  ctx.font = `bold ${headerFontSize}px serif`;
  while (ctx.measureText(mainHeaderStr).width > maxTextWidth && headerFontSize > 16) {
    headerFontSize -= 1;
    ctx.font = `bold ${headerFontSize}px serif`;
  }
  ctx.fillText(mainHeaderStr, width / 2, 100);

  // Group Badge
  ctx.fillStyle = '#c084fc';
  let groupFontSize = 22;
  const groupStr = params.groupTitle.toUpperCase();
  ctx.font = `${groupFontSize}px sans-serif`;
  while (ctx.measureText(groupStr).width > maxTextWidth && groupFontSize > 12) {
    groupFontSize -= 1;
    ctx.font = `${groupFontSize}px sans-serif`;
  }
  ctx.fillText(groupStr, width / 2, 140);

  // Main Seal Title - Dynamic font scaling to ensure it never overflows borders
  ctx.fillStyle = '#ffffff';
  let titleFontSize = 38;
  ctx.font = `bold ${titleFontSize}px serif`;
  while (ctx.measureText(params.title).width > maxTextWidth && titleFontSize > 14) {
    titleFontSize -= 1;
    ctx.font = `bold ${titleFontSize}px serif`;
  }
  ctx.fillText(params.title, width / 2, 200);

  // Subtitle
  ctx.fillStyle = '#fef08a';
  let subFontSize = 24;
  ctx.font = `${subFontSize}px sans-serif`;
  while (ctx.measureText(params.subtitle).width > maxTextWidth && subFontSize > 12) {
    subFontSize -= 1;
    ctx.font = `${subFontSize}px sans-serif`;
  }
  ctx.fillText(params.subtitle, width / 2, 240);

  // Arabic Name Calligraphy
  ctx.fillStyle = '#fbbf24';
  let arabicFontSize = 42;
  ctx.font = `bold ${arabicFontSize}px serif`;
  while (ctx.measureText(params.arabicName).width > maxTextWidth && arabicFontSize > 16) {
    arabicFontSize -= 1;
    ctx.font = `bold ${arabicFontSize}px serif`;
  }
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
    let verFontSize = 22;
    ctx.font = `italic ${verFontSize}px sans-serif`;
    while (ctx.measureText(params.versionTitle).width > maxTextWidth && verFontSize > 12) {
      verFontSize -= 1;
      ctx.font = `italic ${verFontSize}px sans-serif`;
    }
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

  // Check if we can build visual Khatim Grid
  const gridData: KhatimGridData | null = params.version
    ? getKhatimGridData(params.version, params.title, params.arabicName, params.formula, params.sealId)
    : null;

  if (gridData) {
    // 1. Draw Grid Header
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 28px serif';
    ctx.textAlign = 'center';
    ctx.fillText(gridData.header, width / 2, boxY + 50);

    // 2. Draw Corner Texts if any
    if (gridData.cornerText) {
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 24px serif';
      if (gridData.cornerText.topLeft) {
        ctx.textAlign = 'left';
        ctx.fillText(gridData.cornerText.topLeft, boxX + 30, boxY + 50);
      }
      if (gridData.cornerText.topRight) {
        ctx.textAlign = 'right';
        ctx.fillText(gridData.cornerText.topRight, boxX + boxW - 30, boxY + 50);
      }
      if (gridData.cornerText.bottomLeft) {
        ctx.textAlign = 'left';
        ctx.fillText(gridData.cornerText.bottomLeft, boxX + 30, boxY + boxH - 30);
      }
      if (gridData.cornerText.bottomRight) {
        ctx.textAlign = 'right';
        ctx.fillText(gridData.cornerText.bottomRight, boxX + boxW - 30, boxY + boxH - 30);
      }
    }

    // 3. Draw Grid Footer
    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 22px serif';
    ctx.textAlign = 'center';
    ctx.fillText(gridData.footer, width / 2, boxY + boxH - 35);

    // 4. Draw Cells Matrix
    const size = gridData.gridSize;
    const topOffset = 75;
    const bottomOffset = 65;
    const availH = boxH - topOffset - bottomOffset;
    const availW = boxW - 60;

    const cellSize = Math.min(Math.floor(availW / size), Math.floor(availH / size));
    const gridTotalW = cellSize * size;
    const gridTotalH = cellSize * size;
    const startX = boxX + (boxW - gridTotalW) / 2;
    const startY = boxY + topOffset + (availH - gridTotalH) / 2;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cellX = startX + c * cellSize;
        const cellY = startY + r * cellSize;
        const val = gridData.cells[r][c];

        const isAlt = (r + c) % 2 === 0;
        ctx.fillStyle = isAlt ? '#1a0b2e' : '#07020f';
        ctx.fillRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);

        ctx.strokeStyle = isAlt ? '#d97706' : '#a855f7';
        ctx.lineWidth = 2;
        ctx.strokeRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);

        let fontSize = Math.floor(cellSize * 0.38);
        if (val.length > 6) {
          fontSize = Math.floor(cellSize * 0.18);
        } else if (val.length > 3) {
          fontSize = Math.floor(cellSize * 0.26);
        }

        ctx.fillStyle = '#fef08a';
        ctx.font = `bold ${Math.max(10, fontSize)}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val, cellX + cellSize / 2, cellY + cellSize / 2);
      }
    }
  } else {
    // Render Graphic Symbol Text (Monospace Fallback)
    ctx.fillStyle = '#d8b4fe';
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';

    const symbolLines = params.graphicSymbol.split('\n');
    const lineSpacing = 30;
    const startY = boxY + 50 + Math.max(0, (boxH - symbolLines.length * lineSpacing) / 2);

    symbolLines.forEach((line, idx) => {
      ctx.fillText(line, width / 2, startY + idx * lineSpacing);
    });
  }

  // Reset text baseline
  ctx.textBaseline = 'alphabetic';

  // Footer Section - Formula and Abjad Value
  const footerY = boxY + boxH + 60;
  ctx.fillStyle = '#fef08a';
  ctx.textAlign = 'center';

  let formulaFontSize = 26;
  const formulaStr = t.formula(params.formula);
  ctx.font = `bold ${formulaFontSize}px serif`;
  while (ctx.measureText(formulaStr).width > maxTextWidth && formulaFontSize > 12) {
    formulaFontSize -= 1;
    ctx.font = `bold ${formulaFontSize}px serif`;
  }
  ctx.fillText(formulaStr, width / 2, footerY);

  ctx.fillStyle = '#c084fc';
  let abjadFontSize = 22;
  const abjadStr = t.abjadValue(params.abjadValue);
  ctx.font = `${abjadFontSize}px sans-serif`;
  while (ctx.measureText(abjadStr).width > maxTextWidth && abjadFontSize > 12) {
    abjadFontSize -= 1;
    ctx.font = `${abjadFontSize}px sans-serif`;
  }
  ctx.fillText(abjadStr, width / 2, footerY + 36);

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
  const lang = params.lang || 'fr';

  const i18n = {
    fr: {
      header: 'ASRARHUB • SCEAUX ET KHAWATIM DE LA LUNE',
      formula: (f: string) => `FORMULE : ${f}`,
      abjadValue: (v: string) => `VALEUR ABJAD : ${v}`,
      footerNote: 'Propriété Spirituelle Explicative - AsrarHub Sacred Seal Collection',
    },
    en: {
      header: 'ASRARHUB • LUNAR SEALS AND KHAWATIM',
      formula: (f: string) => `FORMULA: ${f}`,
      abjadValue: (v: string) => `ABJAD VALUE: ${v}`,
      footerNote: 'Esoteric Spiritual Property - AsrarHub Sacred Seal Collection',
    },
    ha: {
      header: 'ASRARHUB • KHATIM DA HATIMIN WATA',
      formula: (f: string) => `KALMA: ${f}`,
      abjadValue: (v: string) => `LISSAFIN ABJAD: ${v}`,
      footerNote: 'Malamta da Asirin Ruhi - AsrarHub Sacred Seal Collection',
    }
  };
  const t = i18n[lang] || i18n.fr;

  const escapeXml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const boxX = 80;
  const boxY = params.versionTitle ? 390 : 360;
  const boxW = width - 160;
  const boxH = 760;

  const gridData: KhatimGridData | null = params.version
    ? getKhatimGridData(params.version, params.title, params.arabicName, params.formula, params.sealId)
    : null;

  let symbolBoxContentSvg = '';

  if (gridData) {
    const size = gridData.gridSize;
    const topOffset = 75;
    const bottomOffset = 65;
    const availH = boxH - topOffset - bottomOffset;
    const availW = boxW - 60;

    const cellSize = Math.min(Math.floor(availW / size), Math.floor(availH / size));
    const gridTotalW = cellSize * size;
    const gridTotalH = cellSize * size;
    const startX = boxX + (boxW - gridTotalW) / 2;
    const startY = boxY + topOffset + (availH - gridTotalH) / 2;

    let cellsSvg = '';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cellX = startX + c * cellSize;
        const cellY = startY + r * cellSize;
        const val = gridData.cells[r][c];
        const isAlt = (r + c) % 2 === 0;

        const bg = isAlt ? '#1a0b2e' : '#07020f';
        const stroke = isAlt ? '#d97706' : '#a855f7';

        let fontSize = Math.floor(cellSize * 0.38);
        if (val.length > 6) {
          fontSize = Math.floor(cellSize * 0.18);
        } else if (val.length > 3) {
          fontSize = Math.floor(cellSize * 0.26);
        }
        fontSize = Math.max(10, fontSize);

        const centerX = cellX + cellSize / 2;
        const centerY = cellY + cellSize / 2;

        cellsSvg += `
        <rect x="${cellX + 2}" y="${cellY + 2}" width="${cellSize - 4}" height="${cellSize - 4}" rx="4" fill="${bg}" stroke="${stroke}" stroke-width="2" />
        <text x="${centerX}" y="${centerY}" fill="#fef08a" font-family="serif" font-size="${fontSize}" font-weight="bold" text-anchor="middle" dominant-baseline="central">${escapeXml(val)}</text>`;
      }
    }

    let cornerSvg = '';
    if (gridData.cornerText) {
      if (gridData.cornerText.topLeft) {
        cornerSvg += `<text x="${boxX + 30}" y="${boxY + 50}" fill="#fef08a" font-family="serif" font-size="24" font-weight="bold" text-anchor="start">${escapeXml(gridData.cornerText.topLeft)}</text>`;
      }
      if (gridData.cornerText.topRight) {
        cornerSvg += `<text x="${boxX + boxW - 30}" y="${boxY + 50}" fill="#fef08a" font-family="serif" font-size="24" font-weight="bold" text-anchor="end">${escapeXml(gridData.cornerText.topRight)}</text>`;
      }
      if (gridData.cornerText.bottomLeft) {
        cornerSvg += `<text x="${boxX + 30}" y="${boxY + boxH - 30}" fill="#fef08a" font-family="serif" font-size="24" font-weight="bold" text-anchor="start">${escapeXml(gridData.cornerText.bottomLeft)}</text>`;
      }
      if (gridData.cornerText.bottomRight) {
        cornerSvg += `<text x="${boxX + boxW - 30}" y="${boxY + boxH - 30}" fill="#fef08a" font-family="serif" font-size="24" font-weight="bold" text-anchor="end">${escapeXml(gridData.cornerText.bottomRight)}</text>`;
      }
    }

    symbolBoxContentSvg = `
    <!-- Header -->
    <text x="${width / 2}" y="${boxY + 50}" fill="#fbbf24" font-family="serif" font-size="28" font-weight="bold" text-anchor="middle">${escapeXml(gridData.header)}</text>
    ${cornerSvg}
    <!-- Grid Cells -->
    ${cellsSvg}
    <!-- Footer -->
    <text x="${width / 2}" y="${boxY + boxH - 35}" fill="#c084fc" font-family="serif" font-size="22" font-weight="bold" text-anchor="middle">${escapeXml(gridData.footer)}</text>
    `;
  } else {
    const symbolLines = params.graphicSymbol.split('\n');
    const lineSpacing = 32;
    const startY = 480;

    symbolBoxContentSvg = symbolLines
      .map((line, idx) => {
        const y = startY + idx * lineSpacing;
        return `<text x="${width / 2}" y="${y}" fill="#d8b4fe" font-family="monospace" font-size="20" text-anchor="middle" xml:space="preserve">${escapeXml(line)}</text>`;
      })
      .join('\n    ');
  }

  const getSvgFontSize = (text: string, baseSize: number, charWidthMultiplier: number = 0.55) => {
    const maxAllowedWidth = 1000;
    const estimatedWidth = text.length * baseSize * charWidthMultiplier;
    if (estimatedWidth <= maxAllowedWidth) {
      return baseSize;
    }
    const scaled = Math.floor(baseSize * (maxAllowedWidth / estimatedWidth));
    return Math.max(14, scaled);
  };

  const svgGroupFontSize = getSvgFontSize(params.groupTitle.toUpperCase(), 22, 0.5);
  const svgTitleFontSize = getSvgFontSize(params.title, 38, 0.55);
  const svgSubTitleFontSize = getSvgFontSize(params.subtitle, 24, 0.5);
  const svgArabicFontSize = getSvgFontSize(params.arabicName, 42, 0.6);
  const svgVersionFontSize = params.versionTitle ? getSvgFontSize(params.versionTitle, 22, 0.5) : 22;
  const svgFormulaFontSize = getSvgFontSize(t.formula(params.formula), 26, 0.55);
  const svgAbjadFontSize = getSvgFontSize(t.abjadValue(params.abjadValue), 22, 0.5);

  const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1a0b2e" />
      <stop offset="50%" stop-color="#0d0418" />
      <stop offset="100%" stop-color="#05010a" />
    </radialGradient>
    <pattern id="asrarWatermarkPattern" width="300" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)">
      <text x="10" y="30" fill="#c084fc" opacity="0.1" font-size="16" font-weight="bold" font-family="serif">ASRARHUB</text>
      <text x="160" y="90" fill="#c084fc" opacity="0.1" font-size="16" font-weight="bold" font-family="serif">✦ ASRARHUB</text>
    </pattern>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
  <rect width="${width}" height="${height}" fill="url(#asrarWatermarkPattern)" />

  <!-- Borders -->
  <rect x="30" y="30" width="${width - 60}" height="${height - 60}" fill="none" stroke="#d97706" stroke-width="12" />
  <rect x="45" y="45" width="${width - 90}" height="${height - 90}" fill="none" stroke="#a855f7" stroke-width="4" />

  <!-- Corner Ornaments -->
  <circle cx="45" cy="45" r="16" fill="#f59e0b" />
  <circle cx="${width - 45}" cy="45" r="16" fill="#f59e0b" />
  <circle cx="45" cy="${height - 45}" r="16" fill="#f59e0b" />
  <circle cx="${width - 45}" cy="${height - 45}" r="16" fill="#f59e0b" />

  <!-- Header -->
  <text x="${width / 2}" y="100" fill="#f59e0b" font-family="serif" font-size="32" font-weight="bold" text-anchor="middle">${escapeXml(t.header)}</text>
  <text x="${width / 2}" y="140" fill="#c084fc" font-family="sans-serif" font-size="${svgGroupFontSize}" text-anchor="middle">${escapeXml(params.groupTitle.toUpperCase())}</text>
  <text x="${width / 2}" y="200" fill="#ffffff" font-family="serif" font-size="${svgTitleFontSize}" font-weight="bold" text-anchor="middle">${escapeXml(params.title)}</text>
  <text x="${width / 2}" y="240" fill="#fef08a" font-family="sans-serif" font-size="${svgSubTitleFontSize}" text-anchor="middle">${escapeXml(params.subtitle)}</text>
  <text x="${width / 2}" y="300" fill="#fbbf24" font-family="serif" font-size="${svgArabicFontSize}" font-weight="bold" text-anchor="middle">${escapeXml(params.arabicName)}</text>

  <!-- Decorative Line -->
  <line x1="100" y1="330" x2="${width - 100}" y2="330" stroke="#d97706" stroke-width="2" opacity="0.6" />

  ${params.versionTitle ? `<text x="${width / 2}" y="365" fill="#e9d5ff" font-family="sans-serif" font-size="${svgVersionFontSize}" font-style="italic" text-anchor="middle">${escapeXml(params.versionTitle)}</text>` : ''}

  <!-- Symbol Box Container -->
  <rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" fill="#030008" stroke="#9333ea" stroke-width="3" rx="16" />

  <!-- Visual Seal / Grid Content -->
  ${symbolBoxContentSvg}

  <!-- Footer Info -->
  <text x="${width / 2}" y="1220" fill="#fef08a" font-family="serif" font-size="${svgFormulaFontSize}" font-weight="bold" text-anchor="middle">${escapeXml(t.formula(params.formula))}</text>
  <text x="${width / 2}" y="1260" fill="#c084fc" font-family="sans-serif" font-size="${svgAbjadFontSize}" text-anchor="middle">${escapeXml(t.abjadValue(params.abjadValue))}</text>
  <text x="${width / 2}" y="1320" fill="#a855f7" font-family="sans-serif" font-size="18" text-anchor="middle">${escapeXml(t.footerNote)}</text>
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

