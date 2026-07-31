/**
 * AsrarHub Watermark & Branding Export Utility
 * Adds the official AsrarHub emblem/footer bar to exported images, charts, and talismans.
 */

export function applyAsrarHubWatermark(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  
  // Height for branding footer banner
  const bannerHeight = Math.max(48, Math.round(height * 0.075));
  
  // Create composite target canvas
  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = width;
  targetCanvas.height = height + bannerHeight;

  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return sourceCanvas;

  // 1. Draw original canvas content
  ctx.drawImage(sourceCanvas, 0, 0);

  // 1b. Central & Diagonal Watermark Overlay across the canvas body
  ctx.save();
  
  // A) Repeating Diagonal Grid Watermark
  ctx.rotate((-22 * Math.PI) / 180);
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#f59e0b'; // Gold / amber accent
  const gridFontSize = Math.max(14, Math.round(width * 0.026));
  ctx.font = `bold ${gridFontSize}px "Cinzel", Georgia, serif`;
  
  const stepX = Math.max(220, Math.round(width * 0.35));
  const stepY = Math.max(100, Math.round(height * 0.15));
  
  for (let wy = -height * 1.5; wy < height * 2.5; wy += stepY) {
    for (let wx = -width * 1.5; wx < width * 2.5; wx += stepX) {
      ctx.fillText('ASRARHUB ✦ أسرار هاب', wx, wy);
    }
  }
  ctx.restore();

  // B) Central Watermark Badge (Directly in the middle of the image)
  ctx.save();
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.globalAlpha = 0.16;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Central Circle & Octagram Geometry Outline
  const sealRadius = Math.max(60, Math.round(Math.min(width, height) * 0.22));
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = Math.max(1.5, Math.round(sealRadius * 0.02));
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.arc(centerX, centerY, sealRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(centerX, centerY, sealRadius * 0.85, 0, Math.PI * 2);
  ctx.stroke();

  // Central Big Typography "ASRARHUB"
  const centerFontSize = Math.max(18, Math.round(sealRadius * 0.28));
  ctx.font = `900 ${centerFontSize}px "Cinzel", Georgia, sans-serif`;
  ctx.fillStyle = '#fbbf24';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 6;
  ctx.fillText("ASRARHUB", centerX, centerY - centerFontSize * 0.3);

  // Central Arabic Typography "أسرار هاب"
  const arabicFontSize = Math.max(14, Math.round(sealRadius * 0.22));
  ctx.font = `bold ${arabicFontSize}px "Amiri", serif`;
  ctx.fillText("أسرار هاب", centerX, centerY + arabicFontSize * 0.8);

  ctx.restore();

  // 1c. Bottom-right subtle corner tag
  ctx.save();
  ctx.globalAlpha = 0.35;
  const overlayFontSize = Math.max(13, Math.round(width * 0.032));
  ctx.font = `bold ${overlayFontSize}px system-ui, sans-serif`;
  ctx.fillStyle = '#b45309'; // Warm amber gold
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
  ctx.shadowBlur = 4;
  ctx.fillText("AsrarHub", width - Math.max(16, width * 0.03), height - Math.max(14, height * 0.02));
  ctx.restore();

  // 2. Draw branded footer banner at the bottom
  const bannerY = height;

  // Rich Obsidian & Gold Gradient Background
  const grad = ctx.createLinearGradient(0, bannerY, width, bannerY + bannerHeight);
  grad.addColorStop(0, '#1c1917');   // Dark stone / obsidian
  grad.addColorStop(0.5, '#0c0a09'); // Deep luxury black
  grad.addColorStop(1, '#1c1917');

  ctx.fillStyle = grad;
  ctx.fillRect(0, bannerY, width, bannerHeight);

  // Top metallic gold accent line
  const goldGrad = ctx.createLinearGradient(0, 0, width, 0);
  goldGrad.addColorStop(0, '#d97706');
  goldGrad.addColorStop(0.5, '#fbbf24');
  goldGrad.addColorStop(1, '#d97706');
  ctx.fillStyle = goldGrad;
  ctx.fillRect(0, bannerY, width, Math.max(2, Math.round(bannerHeight * 0.05)));

  // Brand text setup with responsive text length to avoid collisions
  const paddingX = Math.max(12, Math.round(width * 0.035));
  const bannerCenterY = bannerY + bannerHeight / 2 + 1;

  ctx.textBaseline = 'middle';

  let leftText = "✦ AsrarHub — Sirr Al-Asrar & Ruhaniyat";
  let rightText = "أسرار هاب ✦";

  let fontSize = Math.max(11, Math.round(bannerHeight * 0.33));
  ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
  let leftWidth = ctx.measureText(leftText).width;
  
  ctx.font = `bold ${fontSize + 1}px "Amiri", "Traditional Arabic", system-ui, sans-serif`;
  let rightWidth = ctx.measureText(rightText).width;

  // Responsive fallbacks if canvas width is narrow
  if (leftWidth + rightWidth + paddingX * 3 > width) {
    leftText = "✦ AsrarHub — Sirr Al-Asrar";
    fontSize = Math.max(10, Math.round(bannerHeight * 0.28));
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
    leftWidth = ctx.measureText(leftText).width;
  }
  if (leftWidth + rightWidth + paddingX * 3 > width) {
    leftText = "✦ AsrarHub";
  }

  // Draw Left Branding
  ctx.fillStyle = '#fef08a'; // Warm light gold
  ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(leftText, paddingX, bannerCenterY);

  // Draw Right Branding (Arabic Calligraphy)
  ctx.fillStyle = '#fbbf24'; // Gold accent
  ctx.font = `bold ${fontSize + 1}px "Amiri", "Traditional Arabic", system-ui, sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillText(rightText, width - paddingX, bannerCenterY);

  ctx.textAlign = 'left';

  return targetCanvas;
}
