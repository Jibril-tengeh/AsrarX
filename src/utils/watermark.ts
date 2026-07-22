/**
 * AsrarHub Watermark & Branding Export Utility
 * Adds the official AsrarHub emblem/footer bar to exported images, charts, and talismans.
 */

export function applyAsrarHubWatermark(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  
  // Height for branding footer banner
  const bannerHeight = Math.max(48, Math.round(height * 0.08));
  
  // Create composite target canvas
  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = width;
  targetCanvas.height = height + bannerHeight;

  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return sourceCanvas;

  // 1. Draw original canvas content
  ctx.drawImage(sourceCanvas, 0, 0);

  // 1b. Subtle semi-transparent watermark on the image body itself
  ctx.save();
  ctx.globalAlpha = 0.18;
  const overlayFontSize = Math.max(12, Math.round(width * 0.035));
  ctx.font = `bold ${overlayFontSize}px system-ui, sans-serif`;
  ctx.fillStyle = '#f59e0b'; // Gold watermark
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText("AsrarHub ✦ أسرار هاب", width - 16, height - 12);
  ctx.restore();

  // 2. Draw branded footer banner at the bottom
  const bannerY = height;

  // Background gradient: Emerald to Dark Teal
  const grad = ctx.createLinearGradient(0, bannerY, width, bannerY + bannerHeight);
  grad.addColorStop(0, '#064e3b'); // Dark emerald
  grad.addColorStop(0.5, '#022c22'); // Deep teal
  grad.addColorStop(1, '#0f172a'); // Dark slate

  ctx.fillStyle = grad;
  ctx.fillRect(0, bannerY, width, bannerHeight);

  // Top metallic gold accent line
  const goldGrad = ctx.createLinearGradient(0, 0, width, 0);
  goldGrad.addColorStop(0, '#f59e0b');
  goldGrad.addColorStop(0.5, '#10b981');
  goldGrad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = goldGrad;
  ctx.fillRect(0, bannerY, width, Math.max(2, Math.round(bannerHeight * 0.05)));

  // Brand text setup
  const fontSize = Math.max(12, Math.round(bannerHeight * 0.32));
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.textBaseline = 'middle';

  // Left Branding
  const paddingX = Math.max(12, Math.round(width * 0.04));
  const centerY = bannerY + bannerHeight / 2 + 1;

  ctx.fillText("✦ AsrarHub — Sirr Al-Asrar & Ruhaniyat", paddingX, centerY);

  // Right Branding (Arabic Calligraphy or URL tag)
  ctx.fillStyle = '#10b981'; // Emerald accent
  ctx.font = `bold ${fontSize}px "Amiri", "Traditional Arabic", system-ui, sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillText("أسرار هاب ✦", width - paddingX, centerY);

  // Reset text alignment
  ctx.textAlign = 'left';

  return targetCanvas;
}
