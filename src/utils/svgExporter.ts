import { downloadCanvasImage } from './downloadHelper';

export interface SvgExportOptions {
  svgId: string;
  filename: string;
  title?: string;
  subtitle?: string;
  language?: string;
}

/**
 * Converts an SVG element to an HTMLImageElement for canvas rendering.
 */
export function svgElementToImage(svgElement: SVGElement): Promise<{ img: HTMLImageElement; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const clone = svgElement.cloneNode(true) as SVGElement;
    if (!clone.getAttribute('xmlns')) {
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }

    const viewBox = clone.getAttribute('viewBox');
    let width = 320;
    let height = 320;

    if (viewBox) {
      const parts = viewBox.split(/\s+/).map(Number);
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        width = parts[2];
        height = parts[3];
      }
    } else {
      width = parseFloat(clone.getAttribute('width') || '320') || 320;
      height = parseFloat(clone.getAttribute('height') || '320') || 320;
    }

    const svgData = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ img, width, height });
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Direct SVG Vector download
 */
export function exportAsSVG({ svgId, filename }: SvgExportOptions): boolean {
  const svgElement = document.getElementById(svgId) as unknown as SVGElement;
  if (!svgElement) return false;

  const clone = svgElement.cloneNode(true) as SVGElement;
  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }

  const svgData = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

/**
 * Standard HD PNG Download
 */
export async function exportAsPNG({ svgId, filename }: SvgExportOptions): Promise<boolean> {
  const svgElement = document.getElementById(svgId) as unknown as SVGElement;
  if (!svgElement) return false;

  try {
    const { img, width, height } = await svgElementToImage(svgElement);

    const scale = 3; // 3x HD resolution
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, width, height);

    const cleanFilename = filename.endsWith('.png') ? filename : `${filename}.png`;
    return await downloadCanvasImage(canvas, cleanFilename);
  } catch (err) {
    console.error('Error exporting PNG:', err);
    return false;
  }
}

/**
 * Ritual Aged Parchment (Parchemin Sacré) PNG Download
 */
export async function exportAsParchment({
  svgId,
  filename,
  title = 'SCEAU SACRÉ ASRARHUB',
  subtitle = 'Défense Métaphysique & Science Hermétique',
  language = 'fr'
}: SvgExportOptions): Promise<boolean> {
  const svgElement = document.getElementById(svgId) as unknown as SVGElement;
  if (!svgElement) return false;

  try {
    const { img, width: svgW, height: svgH } = await svgElementToImage(svgElement);

    // Parchment Canvas Dimensions
    const canvasW = 1000;
    const canvasH = 1300;

    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // 1. Aged Warm Parchment Background Gradient
    const bgGrad = ctx.createRadialGradient(
      canvasW / 2, canvasH / 2, 100,
      canvasW / 2, canvasH / 2, canvasW * 0.8
    );
    bgGrad.addColorStop(0, '#fef9c3'); // Warm light parchment
    bgGrad.addColorStop(0.5, '#fde68a'); // Warm amber parchment
    bgGrad.addColorStop(1, '#d97706'); // Burnt golden amber edge

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvasW, canvasH);

    // 2. Burnt Edge Vignette Effect
    const edgeGrad = ctx.createRadialGradient(
      canvasW / 2, canvasH / 2, canvasW * 0.35,
      canvasW / 2, canvasH / 2, canvasW * 0.75
    );
    edgeGrad.addColorStop(0, 'rgba(120, 53, 15, 0)');
    edgeGrad.addColorStop(0.7, 'rgba(120, 53, 15, 0.35)');
    edgeGrad.addColorStop(1, 'rgba(69, 26, 3, 0.75)');

    ctx.fillStyle = edgeGrad;
    ctx.fillRect(0, 0, canvasW, canvasH);

    // 3. Ornate Double Sepia Border
    ctx.strokeStyle = '#78350f'; // Dark amber / sepia
    ctx.lineWidth = 8;
    ctx.strokeRect(35, 35, canvasW - 70, canvasH - 70);

    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(50, 50, canvasW - 100, canvasH - 100);

    // Corner Ornaments
    const drawOrnament = (cx: number, cy: number) => {
      ctx.save();
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };
    drawOrnament(50, 50);
    drawOrnament(canvasW - 50, 50);
    drawOrnament(50, canvasH - 50);
    drawOrnament(canvasW - 50, canvasH - 50);

    // 4. Header Banner Text
    ctx.save();
    ctx.textAlign = 'center';

    // AsrarHub Header
    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 16px serif';
    const headerText =
      language === 'ha'
        ? 'ASRARHUB • PARCHEMIN SACRÉ DA KARIYA'
        : language === 'en'
        ? 'ASRARHUB • SACRED HERMETIC PARCHMENT'
        : 'ASRARHUB • PARCHEMIN SACRÉ HERMÉTIQUE';
    ctx.fillText(headerText, canvasW / 2, 95);

    // Main Title
    ctx.fillStyle = '#451a03';
    ctx.font = 'bold 28px serif';
    ctx.fillText(title, canvasW / 2, 135);

    if (subtitle) {
      ctx.fillStyle = '#78350f';
      ctx.font = 'italic 16px serif';
      ctx.fillText(subtitle, canvasW / 2, 168);
    }
    ctx.restore();

    // 5. Center Diagram (SVG rendered onto Parchment Frame)
    const targetSvgWidth = 620;
    const targetSvgHeight = (svgH / svgW) * targetSvgWidth;

    const svgX = (canvasW - targetSvgWidth) / 2;
    const svgY = 200 + (canvasH - 280 - targetSvgHeight) / 2;

    // Shadow under diagram on parchment
    ctx.save();
    ctx.shadowColor = 'rgba(69, 26, 3, 0.4)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;

    // Draw backing card for SVG inside parchment
    ctx.fillStyle = '#0f172a'; // Elegant dark contrast backing
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(svgX - 15, svgY - 15, targetSvgWidth + 30, targetSvgHeight + 30, 20);
    } else {
      ctx.rect(svgX - 15, svgY - 15, targetSvgWidth + 30, targetSvgHeight + 30);
    }
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Draw the SVG Image centered inside
    ctx.drawImage(img, svgX, svgY, targetSvgWidth, targetSvgHeight);

    // 6. Bottom Seal / Footer Note
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 14px serif';
    const footerText =
      language === 'ha'
        ? 'Amsar AsrarHub - Ganuwar Kariya ta Musamman'
        : language === 'en'
        ? 'AsrarHub Sacred Collection - Metaphysical Protection Seal'
        : 'Collection Sacrée AsrarHub - Sceau de Protection Métaphysique';
    ctx.fillText(footerText, canvasW / 2, canvasH - 85);
    ctx.restore();

    const baseName = filename.replace(/\.(png|svg)$/i, '');
    const cleanFilename = `parchemin_${baseName}.png`;

    return await downloadCanvasImage(canvas, cleanFilename);
  } catch (err) {
    console.error('Error exporting parchment PNG:', err);
    return false;
  }
}
