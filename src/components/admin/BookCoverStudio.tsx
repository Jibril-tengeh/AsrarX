import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, Sparkles, Image as ImageIcon, Download, Copy, Upload, X, RefreshCw, 
  Check, Palette, Type, Sliders, Layers, Crown, Shield, Wand2, Eye, Layout, FileText, Share2,
  ListPlus, Plus, Trash2, RotateCw, Box
} from 'lucide-react';

interface BookCoverStudioProps {
  onSelectCover?: (coverDataUrl: string) => void;
  initialTitle?: string;
  initialAuthor?: string;
  initialSubtitle?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export const BookCoverStudio: React.FC<BookCoverStudioProps> = ({
  onSelectCover,
  initialTitle = "6 WIRDS",
  initialAuthor = "By Jibril SBI",
  initialSubtitle = "La Noblesse, Le respect élevé & Rizq Abondant",
  isModal = false,
  onClose
}) => {
  // Main Tab Selection
  const [activeTab, setActiveTab] = useState<'3d' | 'canvas' | 'bullets' | 'ai' | 'templates'>('3d');
  
  // Book Content Details
  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle);
  const [author, setAuthor] = useState(initialAuthor);
  const [websiteUrl, setWebsiteUrl] = useState("www.asrarlabs.com");
  const [badgeText, setBadgeText] = useState("Édition Spéciale Asrar");

  // AsrarHub Header Banner
  const [showAsrarBanner, setShowAsrarBanner] = useState(true);
  const [asrarBannerTitle, setAsrarBannerTitle] = useState("AsrarHub");

  // Bullet Points List (Checkmark items)
  const [showBullets, setShowBullets] = useState(true);
  const [bulletPoints, setBulletPoints] = useState<string[]>([
    "La Noblesse",
    "Le respect élevé",
    "Rizq Abondant",
    "Attraction des personnes de haut niveau"
  ]);

  // Arabic Verse Option
  const [showArabicText, setShowArabicText] = useState(false);
  const [arabicSnippet, setArabicSnippet] = useState("صُمٌّ بُكْمٌ عُمْيٌ فَهُمْ لَا يَرْجِعُونَ");
  const [arabicTranslation, setArabicTranslation] = useState("Sourds, muets, aveugles : ils ne reviendront pas.");

  // Styling & Themes
  const [aspectRatio, setAspectRatio] = useState<'3:4' | '2:3' | '1:1'>('3:4');
  const [presetTheme, setPresetTheme] = useState<'gold-metal' | 'emerald' | 'lime-green' | 'velvet' | 'parchment' | 'obsidian' | 'crimson'>('gold-metal');
  const [fontFamily, setFontFamily] = useState<'serif' | 'display' | 'arabic' | 'gothic'>('display');
  const [titleColor, setTitleColor] = useState('#ffffff');
  const [goldAccent, setGoldAccent] = useState(true);
  const [showMedallion, setShowMedallion] = useState(false);
  const [showBorderFrame, setShowBorderFrame] = useState(true);
  const [showCornerFiligree, setShowCornerFiligree] = useState(false);

  // 3D Mockup Controls (Customizable 3D Book Shape)
  const [render3DMockup, setRender3DMockup] = useState(true);
  const [mockupAngle, setMockupAngle] = useState<'angle-left' | 'angle-right' | 'front-3d' | 'flat-2d'>('angle-left');
  const [rotationAngle, setRotationAngle] = useState<number>(-18); // Deg
  const [bookThickness, setBookThickness] = useState<number>(45); // px
  const [spineColor, setSpineColor] = useState<string>('#111111');
  const [spineTitle, setSpineTitle] = useState<string>('6 WIRDS - AsrarHub');
  const [enableFloorReflection, setEnableFloorReflection] = useState<boolean>(true);
  const [reflectionOpacity, setReflectionOpacity] = useState<number>(0.35);
  const [enableGroundShadow, setEnableGroundShadow] = useState<boolean>(true);

  // Custom Background Image or AI Image
  const [customBgImage, setCustomBgImage] = useState<string | null>(null);
  
  // AI Generator state
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiEnhancedPrompt, setAiEnhancedPrompt] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Color Definitions
  const themeGradients = {
    'gold-metal': {
      canvasBg1: '#b8860b',
      canvasBg2: '#e5af33',
      bannerBg: '#09090b',
      text: '#ffffff',
      accent: '#3b82f6',
      border: '#d97706',
      bulletBg: '#d99b26',
      bulletIconBg: '#2563eb'
    },
    emerald: {
      canvasBg1: '#022c22',
      canvasBg2: '#064e3b',
      bannerBg: '#021812',
      text: '#fef08a',
      accent: '#fbbf24',
      border: '#d97706',
      bulletBg: '#065f46',
      bulletIconBg: '#eab308'
    },
    'lime-green': {
      canvasBg1: '#16a34a',
      canvasBg2: '#4ade80',
      bannerBg: '#09090b',
      text: '#1e3a8a',
      accent: '#2563eb',
      border: '#15803d',
      bulletBg: '#86efac',
      bulletIconBg: '#2563eb'
    },
    velvet: {
      canvasBg1: '#1e1b4b',
      canvasBg2: '#3b0764',
      bannerBg: '#09090b',
      text: '#fef08a',
      accent: '#eab308',
      border: '#ca8a04',
      bulletBg: '#4c1d95',
      bulletIconBg: '#eab308'
    },
    parchment: {
      canvasBg1: '#fef3c7',
      canvasBg2: '#fde68a',
      bannerBg: '#451a03',
      text: '#451a03',
      accent: '#78350f',
      border: '#92400e',
      bulletBg: '#fef3c7',
      bulletIconBg: '#92400e'
    },
    obsidian: {
      canvasBg1: '#020617',
      canvasBg2: '#1e1b4b',
      bannerBg: '#000000',
      text: '#fbbf24',
      accent: '#f59e0b',
      border: '#d97706',
      bulletBg: '#0f172a',
      bulletIconBg: '#f59e0b'
    },
    crimson: {
      canvasBg1: '#4c0519',
      canvasBg2: '#881337',
      bannerBg: '#1f030a',
      text: '#fef08a',
      accent: '#fbbf24',
      border: '#d97706',
      bulletBg: '#9f1239',
      bulletIconBg: '#fbbf24'
    }
  };

  // Helper: Draw 2D Cover Artwork onto an offscreen canvas
  const create2DCoverCanvas = (width: number, height: number): HTMLCanvasElement => {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const ctx = offCanvas.getContext('2d');
    if (!ctx) return offCanvas;

    const theme = themeGradients[presetTheme];

    // 1. Background Fill
    if (customBgImage) {
      const img = new Image();
      img.src = customBgImage;
      // Synchronous fill or cached draw
      try {
        ctx.drawImage(img, 0, 0, width, height);
      } catch (e) {
        ctx.fillStyle = theme.canvasBg1;
        ctx.fillRect(0, 0, width, height);
      }
      // Gradient Overlay for readability
      const overlayGrd = ctx.createLinearGradient(0, 0, 0, height);
      overlayGrd.addColorStop(0, 'rgba(0,0,0,0.4)');
      overlayGrd.addColorStop(0.5, 'rgba(0,0,0,0.1)');
      overlayGrd.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = overlayGrd;
      ctx.fillRect(0, 0, width, height);
    } else {
      const grd = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.85);
      grd.addColorStop(0, theme.canvasBg2);
      grd.addColorStop(1, theme.canvasBg1);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Header Banner (AsrarHub Style)
    let contentStartY = 30;
    if (showAsrarBanner) {
      const bannerHeight = 110;
      ctx.fillStyle = theme.bannerBg;
      ctx.fillRect(0, 0, width, bannerHeight);

      // Gold line separator under banner
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(0, bannerHeight - 3, width, 3);

      // AsrarHub Calligraphy Logo / Text
      ctx.save();
      ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
      ctx.shadowBlur = 12;

      // Crescent icon drawing
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(width / 2 - 110, bannerHeight / 2 - 2, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = theme.bannerBg;
      ctx.beginPath();
      ctx.arc(width / 2 - 102, bannerHeight / 2 - 6, 19, 0, Math.PI * 2);
      ctx.fill();

      // Logo Text "AsrarHub"
      const goldGrad = ctx.createLinearGradient(width / 2 - 80, 0, width / 2 + 100, 0);
      goldGrad.addColorStop(0, '#fef08a');
      goldGrad.addColorStop(0.5, '#f59e0b');
      goldGrad.addColorStop(1, '#fef08a');
      ctx.fillStyle = goldGrad;
      ctx.font = 'bold 36px "Cinzel", "Playfair Display", Georgia, serif';
      ctx.textAlign = 'left';
      ctx.fillText(asrarBannerTitle, width / 2 - 75, bannerHeight / 2 + 10);

      ctx.restore();

      contentStartY = bannerHeight + 25;
    }

    // 3. Borders & Frames
    const margin = showAsrarBanner ? 16 : 28;
    const topFrameMargin = showAsrarBanner ? 120 : margin;

    if (showBorderFrame) {
      ctx.strokeStyle = goldAccent ? '#D4AF37' : theme.border;
      ctx.lineWidth = 3.5;
      ctx.strokeRect(margin, topFrameMargin, width - margin * 2, height - topFrameMargin - margin);

      ctx.strokeStyle = goldAccent ? '#F3E5AB' : theme.accent;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(margin + 5, topFrameMargin + 5, width - (margin + 5) * 2, height - (topFrameMargin + 5) - margin);
    }

    // 4. Central Medallion (if enabled)
    if (showMedallion) {
      const centerX = width / 2;
      const centerY = height * 0.48;
      const radius = 70;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Glow behind medallion
      const radialGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, radius * 1.6);
      radialGlow.addColorStop(0, 'rgba(212, 175, 55, 0.3)');
      radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Outer Star Circle
      ctx.strokeStyle = goldAccent ? '#D4AF37' : theme.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 8-Pointed Star (Rub el Hizb)
      ctx.strokeStyle = goldAccent ? '#F3E5AB' : theme.text;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 2; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 4);
        ctx.strokeRect(-radius * 0.7, -radius * 0.7, radius * 1.4, radius * 1.4);
        ctx.restore();
      }
      ctx.restore();
    }

    // 5. Main Title
    let mainFont = 'Georgia, serif';
    if (fontFamily === 'display') mainFont = '"Cinzel", "Playfair Display", Georgia, serif';
    if (fontFamily === 'arabic') mainFont = '"Amiri", "Traditional Arabic", Georgia, serif';
    if (fontFamily === 'gothic') mainFont = '"Garamond", "Georgia", serif';

    ctx.textAlign = 'center';
    ctx.font = `extrabold 38px ${mainFont}`;
    ctx.fillStyle = titleColor || theme.text;

    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    let currentY = contentStartY + 30;

    // Wrap Title lines
    const titleLines = title.split('\n');
    titleLines.forEach((tLine) => {
      const words = tLine.split(' ');
      let line = '';
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > width - 100 && n > 0) {
          ctx.fillText(line.trim(), width / 2, currentY);
          line = words[n] + ' ';
          currentY += 46;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), width / 2, currentY);
      currentY += 48;
    });

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // 6. Subtitle (if present)
    if (subtitle) {
      ctx.font = `italic 16px ${mainFont}`;
      ctx.fillStyle = goldAccent ? '#F3E5AB' : '#e2e8f0';
      ctx.fillText(subtitle, width / 2, currentY - 10);
      currentY += 25;
    }

    // 7. Arabic Verse Block (if enabled)
    if (showArabicText && arabicSnippet) {
      currentY += 15;
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Amiri", "Traditional Arabic", serif';
      ctx.fillText(arabicSnippet, width / 2, currentY);
      currentY += 28;

      if (arabicTranslation) {
        ctx.font = 'italic 13px Georgia, serif';
        ctx.fillStyle = '#bfdbfe';
        ctx.fillText(arabicTranslation, width / 2, currentY);
        currentY += 30;
      }
      ctx.restore();
    }

    // 8. Bullet Points / Benefits List (Checkmark Bullets as in Image #1)
    if (showBullets && bulletPoints.length > 0) {
      currentY += 10;
      const bulletBoxWidth = width - 120;
      const startX = width / 2;

      bulletPoints.forEach((point) => {
        if (!point.trim()) return;

        // Checkmark Badge Icon
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 6;

        // Draw checkmark icon box
        const textMetrics = ctx.measureText(point);
        const textWidth = Math.min(textMetrics.width, bulletBoxWidth - 40);
        const itemX = startX - (textWidth / 2) - 15;

        // Checkmark badge
        ctx.fillStyle = '#2563eb'; // Blue check badge like in Image #1
        ctx.beginPath();
        ctx.roundRect(itemX - 18, currentY - 18, 24, 24, 6);
        ctx.fill();

        // Checkmark symbol
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(itemX - 13, currentY - 6);
        ctx.lineTo(itemX - 8, currentY - 1);
        ctx.lineTo(itemX + 1, currentY - 11);
        ctx.stroke();

        // Bullet Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'extrabold 21px "Cinzel", Georgia, serif';
        ctx.textAlign = 'left';
        ctx.fillText(point, itemX + 14, currentY + 1);

        // Underline line like image #1
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(itemX + 14, currentY + 6);
        ctx.lineTo(itemX + 14 + textWidth, currentY + 6);
        ctx.stroke();

        ctx.restore();
        currentY += 42;
      });
    }

    // 9. Bottom Footer: Website Domain & Author
    const footerY = height - 45;

    if (websiteUrl) {
      ctx.font = 'bold 16px "Cinzel", Georgia, serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(websiteUrl, width / 2, footerY - 22);
    }

    if (author) {
      ctx.font = 'extrabold 22px "Cinzel", Georgia, serif';
      ctx.fillStyle = goldAccent ? '#FDF0D5' : theme.text;
      ctx.textAlign = 'center';
      ctx.fillText(author, width / 2, footerY + 10);
    }

    return offCanvas;
  };

  // Main Render Function: Combines 2D Cover Artwork & Realistic 3D Perspective Book Rendering
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Output Dimensions
    const targetW = 850;
    const targetH = 950;
    canvas.width = targetW;
    canvas.height = targetH;

    // Clear Canvas
    ctx.clearRect(0, 0, targetW, targetH);

    // Create 2D Cover Artwork
    const coverW = 520;
    const coverH = 720;
    const coverCanvas = create2DCoverCanvas(coverW, coverH);

    // If pure 2D mode, center 2D cover
    if (!render3DMockup || mockupAngle === 'flat-2d') {
      const offX = (targetW - coverW) / 2;
      const offY = (targetH - coverH) / 2;

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 15;
      ctx.drawImage(coverCanvas, offX, offY);
      ctx.restore();
      return;
    }

    // -------------------------------------------------------------
    // REALISTIC 3D BOOK MOCKUP RENDERER (Perspective, Spine, Floor Reflection)
    // -------------------------------------------------------------

    const centerX = targetW / 2;
    const groundY = targetH * 0.76;
    const isLeft = mockupAngle === 'angle-left';
    const isRight = mockupAngle === 'angle-right';

    // 1. GROUND DROP SHADOW
    if (enableGroundShadow) {
      ctx.save();
      ctx.beginPath();
      const shadowGradient = ctx.createRadialGradient(
        centerX, groundY + 20, 30,
        centerX, groundY + 20, coverW * 0.65
      );
      shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
      shadowGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
      shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = shadowGradient;
      ctx.ellipse(centerX, groundY + 25, coverW * 0.55, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. FLOOR GLASS REFLECTION (As seen in Reference Image #2)
    if (enableFloorReflection) {
      ctx.save();
      ctx.translate(centerX, groundY + 30);
      ctx.scale(1, -0.4); // Invert vertically & flatten perspective
      if (isLeft) ctx.transform(1, 0, -0.22, 1, 0, 0);
      if (isRight) ctx.transform(1, 0, 0.22, 1, 0, 0);

      // Draw Flipped Cover
      ctx.drawImage(coverCanvas, -coverW / 2, -coverH / 2);

      // Linear Alpha Fade Overlay
      const reflGradient = ctx.createLinearGradient(0, -coverH / 2, 0, coverH / 2);
      reflGradient.addColorStop(0, `rgba(255, 255, 255, ${1 - reflectionOpacity})`);
      reflGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
      ctx.fillStyle = reflGradient;
      ctx.fillRect(-coverW, -coverH, coverW * 2, coverH * 2);

      ctx.restore();
    }

    // 3. DRAW 3D BOOK BODY
    const spineWidth = bookThickness;
    const bookH = 580;
    const bookW = 400;

    ctx.save();

    if (isLeft) {
      // Perspective Facing Left (Spine/Pages on Right, Front Cover Facing Left)
      const startX = centerX - 120;
      const startY = groundY - bookH + 15;

      // 3A. PAGE STACK (RIGHT SIDE & TOP)
      ctx.fillStyle = '#f8fafc'; // Off-white pages
      ctx.beginPath();
      ctx.moveTo(startX + bookW - 35, startY + 40);
      ctx.lineTo(startX + bookW + spineWidth - 35, startY + 20);
      ctx.lineTo(startX + bookW + spineWidth - 35, groundY - 20);
      ctx.lineTo(startX + bookW - 35, groundY);
      ctx.closePath();
      ctx.fill();

      // Page lines texture
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let p = 5; p < spineWidth; p += 6) {
        ctx.beginPath();
        ctx.moveTo(startX + bookW - 35 + p, startY + 40 - (p * 0.3));
        ctx.lineTo(startX + bookW - 35 + p, groundY - (p * 0.3));
        ctx.stroke();
      }

      // Top Pages
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + bookW - 35, startY + 40);
      ctx.lineTo(startX + bookW + spineWidth - 35, startY + 20);
      ctx.lineTo(startX + spineWidth, startY - 15);
      ctx.closePath();
      ctx.fill();

      // 3B. FRONT COVER (SKEWED PERSPECTIVE)
      ctx.save();
      ctx.translate(startX, startY);
      ctx.transform(0.85, 0.22, 0, 0.92, 0, 0);

      // Cover Shadow
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 15;
      ctx.drawImage(coverCanvas, 0, 0, bookW, bookH);

      // Glossy Diagonal Light Sheen
      const sheenGrd = ctx.createLinearGradient(0, 0, bookW, bookH);
      sheenGrd.addColorStop(0, 'rgba(255,255,255,0.22)');
      sheenGrd.addColorStop(0.3, 'rgba(255,255,255,0.05)');
      sheenGrd.addColorStop(0.6, 'rgba(0,0,0,0.08)');
      sheenGrd.addColorStop(1, 'rgba(255,255,255,0.15)');
      ctx.fillStyle = sheenGrd;
      ctx.fillRect(0, 0, bookW, bookH);

      ctx.restore();

      // 3C. SPINE (LEFT EDGE)
      ctx.save();
      ctx.translate(startX, startY);
      ctx.transform(0.2, 0.22, 0, 0.92, -spineWidth, -15);

      const spineGrd = ctx.createLinearGradient(0, 0, spineWidth, 0);
      spineGrd.addColorStop(0, spineColor);
      spineGrd.addColorStop(0.5, '#475569');
      spineGrd.addColorStop(1, spineColor);
      ctx.fillStyle = spineGrd;
      ctx.fillRect(0, 0, spineWidth * 2.2, bookH);

      // Spine Title
      ctx.fillStyle = '#F3E5AB';
      ctx.font = 'bold 22px "Cinzel", Georgia, serif';
      ctx.save();
      ctx.translate(spineWidth, bookH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(spineTitle, 0, 0);
      ctx.restore();

      ctx.restore();

    } else if (isRight) {
      // Perspective Facing Right (Spine on Left, Top Pages Visible - like Image #2!)
      const startX = centerX - 140;
      const startY = groundY - bookH + 20;

      // 3A. TOP PAGES BLOCK
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(startX, startY - 10);
      ctx.lineTo(startX + bookW, startY + 40);
      ctx.lineTo(startX + bookW - spineWidth, startY + 55);
      ctx.lineTo(startX - spineWidth, startY + 5);
      ctx.closePath();
      ctx.fill();

      // Page texture
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      for (let p = 4; p < spineWidth; p += 6) {
        ctx.beginPath();
        ctx.moveTo(startX - p, startY + (p * 0.2));
        ctx.lineTo(startX + bookW - p, startY + 40 + (p * 0.2));
        ctx.stroke();
      }

      // 3B. LEFT SPINE (DARK ROUNDED SPINE)
      ctx.save();
      ctx.translate(startX - spineWidth, startY + 5);
      ctx.transform(0.22, -0.18, 0, 0.92, 0, 0);

      const spineGrd = ctx.createLinearGradient(0, 0, spineWidth, 0);
      spineGrd.addColorStop(0, '#020617');
      spineGrd.addColorStop(0.4, spineColor);
      spineGrd.addColorStop(1, '#0f172a');
      ctx.fillStyle = spineGrd;
      ctx.fillRect(0, 0, spineWidth * 2.5, bookH);

      // Spine Title Text
      ctx.fillStyle = '#F3E5AB';
      ctx.font = 'bold 22px "Cinzel", Georgia, serif';
      ctx.save();
      ctx.translate(spineWidth * 1.2, bookH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText(spineTitle, 0, 0);
      ctx.restore();

      ctx.restore();

      // 3C. FRONT COVER (SKEWED FACING RIGHT)
      ctx.save();
      ctx.translate(startX, startY - 10);
      ctx.transform(0.85, -0.18, 0, 0.92, 0, 0);

      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = 20;
      ctx.drawImage(coverCanvas, 0, 0, bookW, bookH);

      // Glossy Sheen
      const sheenGrd = ctx.createLinearGradient(0, 0, bookW, bookH);
      sheenGrd.addColorStop(0, 'rgba(255,255,255,0.25)');
      sheenGrd.addColorStop(0.4, 'rgba(255,255,255,0.02)');
      sheenGrd.addColorStop(1, 'rgba(0,0,0,0.12)');
      ctx.fillStyle = sheenGrd;
      ctx.fillRect(0, 0, bookW, bookH);

      ctx.restore();

    } else {
      // FRONT 3D PERSPECTIVE
      const startX = centerX - (bookW / 2);
      const startY = groundY - bookH;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 20;
      ctx.drawImage(coverCanvas, startX, startY, bookW, bookH);
      ctx.restore();
    }

    ctx.restore();
  };

  useEffect(() => {
    renderCanvas();
  }, [
    title, subtitle, author, websiteUrl, badgeText, showAsrarBanner, asrarBannerTitle,
    showBullets, bulletPoints, showArabicText, arabicSnippet, arabicTranslation,
    aspectRatio, presetTheme, fontFamily, titleColor, goldAccent, showMedallion,
    showBorderFrame, showCornerFiligree, customBgImage, render3DMockup, mockupAngle,
    rotationAngle, bookThickness, spineColor, spineTitle, enableFloorReflection,
    reflectionOpacity, enableGroundShadow
  ]);

  // Handle AI Image Generation
  const handleGenerateAiCover = async () => {
    setIsGeneratingAi(true);
    setAiEnhancedPrompt(null);
    try {
      const res = await fetch('/api/admin/generate-book-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          title,
          subtitle,
          author,
          themeStyle: presetTheme
        })
      });

      const data = await res.json();
      if (data.enhancedPrompt) {
        setAiEnhancedPrompt(data.enhancedPrompt);
      }

      if (data.imageUrl) {
        setCustomBgImage(data.imageUrl);
        showToast("✨ Arrière-plan IA appliqué avec succès !");
      } else {
        showToast("ℹ️ Visualisation mise à jour.");
      }
    } catch (err) {
      console.error("Error generating AI cover:", err);
      showToast("Erreur lors de la génération IA.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Upload Image File
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomBgImage(event.target.result as string);
          showToast("Image personnalisée appliquée !");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Download HD 3D Book Mockup
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `Livre_3D_${title.replace(/\s+/g, '_')}.jpg`;
    link.href = dataUrl;
    link.click();
    showToast(" Couverture 3D téléchargée en haute résolution !");
  };

  // Apply to Book / Copy
  const handleApplyCover = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
    if (onSelectCover) {
      onSelectCover(dataUrl);
      showToast("✅ Couverture 3D appliquée à la publication !");
      if (onClose) onClose();
    } else {
      navigator.clipboard.writeText(dataUrl);
      showToast("Image 3D copiée dans le presse-papier !");
    }
  };

  // Bullet Point Array Handlers
  const handleAddBullet = () => {
    if (bulletPoints.length < 6) {
      setBulletPoints([...bulletPoints, "Nouveau bénéfice puissant"]);
    }
  };

  const handleUpdateBullet = (index: number, val: string) => {
    const updated = [...bulletPoints];
    updated[index] = val;
    setBulletPoints(updated);
  };

  const handleRemoveBullet = (index: number) => {
    setBulletPoints(bulletPoints.filter((_, i) => i !== index));
  };

  // Presets trigger
  const applyPreset1_SixWirds = () => {
    setTitle("6 WIRDS");
    setSubtitle("La Noblesse, Le respect élevé & Rizq Abondant");
    setAuthor("By Jibril SBI");
    setWebsiteUrl("www.asrarlabs.com");
    setPresetTheme("gold-metal");
    setShowAsrarBanner(true);
    setAsrarBannerTitle("AsrarHub");
    setShowBullets(true);
    setBulletPoints([
      "La Noblesse",
      "Le respect élevé",
      "Rizq Abondant",
      "Attraction des personnes de haut niveau"
    ]);
    setShowArabicText(false);
    setMockupAngle("angle-left");
    setSpineColor("#111111");
    setSpineTitle("6 WIRDS - AsrarHub");
    setBookThickness(45);
    setEnableFloorReflection(true);
    setCustomBgImage(null);
    showToast("Modèle 1: '6 WIRDS' appliqué !");
  };

  const applyPreset2_EmeraldGuide = () => {
    setTitle("6 WIRD POUR :\nNOBLESSE, ADMIRATION & RIZQ ABONDANT");
    setSubtitle("Guide Spirituel de 37 Pages");
    setAuthor("Jibril SBI");
    setWebsiteUrl("");
    setPresetTheme("emerald");
    setShowAsrarBanner(false);
    setShowBullets(false);
    setShowMedallion(true);
    setShowBorderFrame(true);
    setShowArabicText(false);
    setMockupAngle("angle-right");
    setSpineColor("#011a14");
    setSpineTitle("GUIDE SPIRITUEL - JIBRIL SBI");
    setBookThickness(65);
    setEnableFloorReflection(true);
    setCustomBgImage(null);
    showToast("Modèle 2: 'Guide Spirituel Émeraude' appliqué !");
  };

  const applyPreset3_SourdsMuets = () => {
    setTitle("Wird Puissant pour Rendre les Ennemis Sourds, Muets, Aveugles");
    setSubtitle("");
    setAuthor("www.asrarlabs.com");
    setWebsiteUrl("");
    setPresetTheme("lime-green");
    setShowAsrarBanner(true);
    setAsrarBannerTitle("AsrarHub");
    setShowArabicText(true);
    setArabicSnippet("صُمٌّ بُكْمٌ عُمْيٌ فَهُمْ لَا يَرْجِعُونَ");
    setArabicTranslation("Sourds, muets, aveugles : ils ne reviendront pas.");
    setShowBullets(true);
    setBulletPoints([
      "Protection Extrême Contre les Ennemis, l'Envie (Hasad) & la Sorcellerie (Sihr)"
    ]);
    setMockupAngle("angle-left");
    setSpineColor("#0033cc"); // Bright blue spine
    setSpineTitle("ASRARHUB - WIRD PUISSANT");
    setBookThickness(50);
    setEnableFloorReflection(true);
    setCustomBgImage(null);
    showToast("Modèle 3: 'Wird Puissant' appliqué !");
  };

  const containerContent = (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden text-gray-900 dark:text-white">
      {/* Header Bar */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-950 via-gray-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Studio de Couvertures 3D Personnalisables</span>
              <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">
                Réglages 3D Pro
              </span>
            </h2>
            <p className="text-xs text-gray-300">
              Ajustez l'angle, l'épaisseur, la tranche, l'ombre et le reflet au sol pour votre livre 3D.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-4 pt-3 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('3d')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === '3d'
              ? 'bg-white dark:bg-gray-900 text-amber-600 dark:text-amber-400 border-t-2 border-amber-500 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Box size={15} />
          <span>Réglages 3D & Forme</span>
        </button>

        <button
          onClick={() => setActiveTab('canvas')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'canvas'
              ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 border-t-2 border-emerald-500 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Type size={15} />
          <span>Textes & Design</span>
        </button>

        <button
          onClick={() => setActiveTab('bullets')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'bullets'
              ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-t-2 border-blue-500 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <ListPlus size={15} />
          <span>Bandeau & Puces (Avantages)</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'templates'
              ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 border-t-2 border-indigo-500 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Crown size={15} />
          <span>Exemples Asrar</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'ai'
              ? 'bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 border-t-2 border-purple-500 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Wand2 size={15} className="text-purple-500" />
          <span>Arrière-Plan IA</span>
        </button>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
        {/* LEFT COLUMN: Controls & Settings */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-6">
          
          {/* TAB: 3D FORM & SHAPE SETTINGS */}
          {activeTab === '3d' && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-750 space-y-4">
                <h3 className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Box size={16} />
                  <span>Perspective & Orientation 3D du Livre</span>
                </h3>

                {/* Perspective Angle Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'angle-left', name: 'Vue Gauche 3D', icon: '📐' },
                    { id: 'angle-right', name: 'Vue Droite 3D', icon: '📖' },
                    { id: 'front-3d', name: 'Vue Face 3D', icon: '🖼️' },
                    { id: 'flat-2d', name: 'Plat 2D', icon: '📄' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setMockupAngle(mode.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                        mockupAngle === mode.id
                          ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 shadow-sm'
                          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="block text-base mb-0.5">{mode.icon}</span>
                      <span>{mode.name}</span>
                    </button>
                  ))}
                </div>

                {/* Slider for Book Thickness */}
                <div className="space-y-1.5 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-xs font-semibold">
                    <label className="text-gray-700 dark:text-gray-300">Épaisseur du Livre (Pages) :</label>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{bookThickness} px</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    value={bookThickness}
                    onChange={(e) => setBookThickness(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Spine Customization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Couleur de la Tranche / Spine :</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={spineColor}
                        onChange={(e) => setSpineColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-700"
                      />
                      <span className="text-xs font-mono font-bold text-gray-600 dark:text-gray-300">{spineColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Texte de la Tranche :</label>
                    <input
                      type="text"
                      value={spineTitle}
                      onChange={(e) => setSpineTitle(e.target.value)}
                      placeholder="Titre sur le côté..."
                      className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Reflection and Ground Shadow Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setEnableFloorReflection(!enableFloorReflection)}
                      className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border cursor-pointer ${
                        enableFloorReflection
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500'
                      }`}
                    >
                      <span>Reflet Miroir au Sol</span>
                      <span>{enableFloorReflection ? '✨ Activé' : 'Désactivé'}</span>
                    </button>

                    {enableFloorReflection && (
                      <div className="space-y-1 px-1">
                        <div className="flex justify-between text-[11px]">
                          <span>Intensité du reflet :</span>
                          <span className="font-bold">{Math.round(reflectionOpacity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="0.8"
                          step="0.05"
                          value={reflectionOpacity}
                          onChange={(e) => setReflectionOpacity(Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setEnableGroundShadow(!enableGroundShadow)}
                      className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border cursor-pointer ${
                        enableGroundShadow
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500'
                      }`}
                    >
                      <span>Ombre Portée au Sol</span>
                      <span>{enableGroundShadow ? '🌑 Activé' : 'Désactivé'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TEXTS & DESIGN */}
          {activeTab === 'canvas' && (
            <div className="space-y-5">
              <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-750 space-y-3">
                <h3 className="text-xs font-extrabold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Type size={14} className="text-emerald-500" />
                  <span>Titres & Auteur</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Titre Principal :</label>
                  <textarea
                    rows={2}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre du livre..."
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Sous-titre / Description :</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Sous-titre explicatif..."
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Nom de l'Auteur :</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Ex: By Jibril SBI..."
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Site Web / Domaine (Bas) :</label>
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="Ex: www.asrarlabs.com"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Theme & Styling */}
              <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-750 space-y-4">
                <h3 className="text-xs font-extrabold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Palette size={14} className="text-emerald-500" />
                  <span>Theme de Fond & Style</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'gold-metal', name: 'Doré Métallique (Img #1)', bg: 'bg-amber-500' },
                    { id: 'emerald', name: 'Émeraude (Img #2)', bg: 'bg-emerald-800' },
                    { id: 'lime-green', name: 'Lime & Vert (Img #3)', bg: 'bg-green-500' },
                    { id: 'velvet', name: 'Velours Indigo', bg: 'bg-indigo-900' },
                    { id: 'parchment', name: 'Parchemin', bg: 'bg-amber-200 text-amber-900' },
                    { id: 'obsidian', name: 'Obsidienne', bg: 'bg-slate-900' }
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setPresetTheme(theme.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 border text-left cursor-pointer ${
                        presetTheme === theme.id
                          ? 'ring-2 ring-amber-500 border-amber-500'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full ${theme.bg} shrink-0 border border-white/20`} />
                      <span className="truncate">{theme.name}</span>
                    </button>
                  ))}
                </div>

                {/* Decoration Toggles */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setGoldAccent(!goldAccent)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer border ${
                      goldAccent 
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' 
                        : 'bg-white dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span>Détails Or</span>
                    <span>{goldAccent ? '✨ Oui' : 'Non'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMedallion(!showMedallion)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer border ${
                      showMedallion 
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' 
                        : 'bg-white dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span>Médaillon Sacré</span>
                    <span>{showMedallion ? '☀️ Oui' : 'Non'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowBorderFrame(!showBorderFrame)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer border ${
                      showBorderFrame 
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' 
                        : 'bg-white dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span>Cadre Bordure</span>
                    <span>{showBorderFrame ? '🖼️ Oui' : 'Non'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BANNER & BULLETS */}
          {activeTab === 'bullets' && (
            <div className="space-y-4 bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-750">
              {/* AsrarHub Top Banner Toggle */}
              <div className="space-y-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                      Bandeau Haut "AsrarHub"
                    </h4>
                    <p className="text-[11px] text-gray-500">Bandeau noir supérieur avec logo et croissant (comme Image #1 & #3)</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAsrarBanner(!showAsrarBanner)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      showAsrarBanner
                        ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300'
                        : 'bg-white dark:bg-gray-900 border-gray-200 text-gray-500'
                    }`}
                  >
                    {showAsrarBanner ? '✨ Affiché' : 'Masqué'}
                  </button>
                </div>

                {showAsrarBanner && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Texte du Logo :</label>
                    <input
                      type="text"
                      value={asrarBannerTitle}
                      onChange={(e) => setAsrarBannerTitle(e.target.value)}
                      placeholder="AsrarHub..."
                      className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold"
                    />
                  </div>
                )}
              </div>

              {/* Bullet Points List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                      Liste des Avantages avec Cocher (✓)
                    </h4>
                    <p className="text-[11px] text-gray-500">Puces de texte soulignées avec badge bleu (Image #1 & #3)</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowBullets(!showBullets)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      showBullets
                        ? 'bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-gray-900 border-gray-200 text-gray-500'
                    }`}
                  >
                    {showBullets ? '✓ Affichées' : 'Masquées'}
                  </button>
                </div>

                {showBullets && (
                  <div className="space-y-2">
                    {bulletPoints.map((point, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          ✓
                        </span>
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => handleUpdateBullet(index, e.target.value)}
                          placeholder="Ex: La Noblesse..."
                          className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(index)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}

                    {bulletPoints.length < 6 && (
                      <button
                        type="button"
                        onClick={handleAddBullet}
                        className="w-full py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-blue-200 dark:border-blue-800"
                      >
                        <Plus size={14} />
                        <span>Ajouter un élément de puce</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Arabic Verse Option */}
              <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                    Bloc Verset / Citation Arabe
                  </h4>

                  <button
                    type="button"
                    onClick={() => setShowArabicText(!showArabicText)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      showArabicText
                        ? 'bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300'
                        : 'bg-white dark:bg-gray-900 border-gray-200 text-gray-500'
                    }`}
                  >
                    {showArabicText ? '🌙 Affiché' : 'Masqué'}
                  </button>
                </div>

                {showArabicText && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      dir="rtl"
                      value={arabicSnippet}
                      onChange={(e) => setArabicSnippet(e.target.value)}
                      placeholder="Nصُمٌّ بُكْمٌ..."
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-bold text-right"
                    />
                    <input
                      type="text"
                      value={arabicTranslation}
                      onChange={(e) => setArabicTranslation(e.target.value)}
                      placeholder="Traduction..."
                      className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: PRESETS (EXEMPLES ASRAR) */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Reconstituer les Modèles Exacts des Photos de Référence
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Preset 1 */}
                <button
                  type="button"
                  onClick={applyPreset1_SixWirds}
                  className="p-4 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-950/80 to-zinc-900 text-left hover:scale-[1.02] transition-all cursor-pointer shadow-md space-y-2"
                >
                  <div className="w-full h-24 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 flex items-center justify-center text-white font-extrabold text-sm shadow-inner">
                    6 WIRDS
                  </div>
                  <span className="font-bold text-xs text-amber-300 block">Modèle 1: "6 WIRDS" (Doré)</span>
                  <p className="text-[11px] text-gray-300">
                    Fond doré, bandeau AsrarHub, puces avec checkmarks bleues.
                  </p>
                </button>

                {/* Preset 2 */}
                <button
                  type="button"
                  onClick={applyPreset2_EmeraldGuide}
                  className="p-4 rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/80 to-zinc-900 text-left hover:scale-[1.02] transition-all cursor-pointer shadow-md space-y-2"
                >
                  <div className="w-full h-24 rounded-xl bg-emerald-900 border border-amber-400/40 flex items-center justify-center text-amber-300 font-extrabold text-xs text-center p-1">
                    GUIDE SPIRITUEL
                  </div>
                  <span className="font-bold text-xs text-emerald-300 block">Modèle 2: "Émeraude & Reflet"</span>
                  <p className="text-[11px] text-gray-300">
                    Grand livre émeraude, rosette dorée, tranche épaisse & reflet miroir au sol.
                  </p>
                </button>

                {/* Preset 3 */}
                <button
                  type="button"
                  onClick={applyPreset3_SourdsMuets}
                  className="p-4 rounded-2xl border border-green-500/40 bg-gradient-to-b from-green-950/80 to-zinc-900 text-left hover:scale-[1.02] transition-all cursor-pointer shadow-md space-y-2"
                >
                  <div className="w-full h-24 rounded-xl bg-green-500 border-2 border-blue-600 flex items-center justify-center text-blue-900 font-extrabold text-xs text-center p-1">
                    WIRD PUISSANT
                  </div>
                  <span className="font-bold text-xs text-green-300 block">Modèle 3: "Sourds, Muets (Lime & Bleu)"</span>
                  <p className="text-[11px] text-gray-300">
                    Couverture vert lime, verset arabe, tranche bleue royale.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* TAB: AI GENERATION */}
          {activeTab === 'ai' && (
            <div className="space-y-4 bg-gray-50 dark:bg-gray-800/60 p-5 rounded-2xl border border-gray-200 dark:border-gray-750">
              <div className="flex items-center gap-2">
                <Wand2 className="text-purple-500" size={20} />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Générateur d'Arrière-Plan IA Gemini & Imagen 3</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Définissez l'ambiance visuelle et laissez l'IA générer l'arrière-plan du livre.
                  </p>
                </div>
              </div>

              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ex: Une illustration mystique d'un vieux livre en cuir vert émeraude avec des ornements en or sculpté..."
                className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 h-24 resize-none"
              />

              <button
                type="button"
                disabled={isGeneratingAi}
                onClick={handleGenerateAiCover}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Génération IA en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Générer l'Arrière-Plan avec Gemini</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Real-Time Studio Preview Canvas */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center justify-center space-y-4 bg-slate-900 p-4 sm:p-6 rounded-2xl border border-gray-800 min-h-[520px]">
          {/* Header Controls for Preview */}
          <div className="w-full flex items-center justify-between pb-2 border-b border-gray-800 text-white">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye size={15} />
              <span>Aperçu HD du Livre 3D</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRender3DMockup(!render3DMockup)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  render3DMockup
                    ? 'bg-amber-500 text-gray-950 font-extrabold shadow-sm'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {render3DMockup ? '📖 Vue 3D Livre' : '📄 Vue 2D Plat'}
              </button>
            </div>
          </div>

          {/* Real Canvas Rendering Output */}
          <div className="relative flex items-center justify-center w-full max-w-[380px] my-auto">
            <canvas
              ref={canvasRef}
              className="w-full h-auto max-h-[480px] object-contain block drop-shadow-2xl"
            />
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-2 pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full sm:flex-1 py-2.5 px-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm border border-gray-700"
            >
              <Download size={15} />
              <span>Télécharger HD 3D</span>
            </button>

            <button
              type="button"
              onClick={handleApplyCover}
              className="w-full sm:flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
            >
              <Check size={15} />
              <span>{onSelectCover ? "Appliquer au Livre" : "Copier le Lien"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-slate-900 text-white border border-amber-500/40 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Sparkles size={16} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div className="w-full max-w-5xl my-auto">
          {containerContent}
        </div>
      </div>
    );
  }

  return containerContent;
};
