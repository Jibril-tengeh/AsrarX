import { downloadCanvasImage } from './downloadHelper';
import { applyTashkeel } from './tashkeel';

export interface ExportWirdParams {
  name?: string;           // User's name in Arabic (e.g., "محمد")
  motherName?: string;     // Mother's name in Arabic (e.g., "فاطمة")
  arabicZikr: string;      // Arabic Zikr string (e.g., "يَا مُهَيْمِنُ يَا وَدُودُ")
  transliteration: string; // Transliteration string
  abjadWeight: number;     // Abjad total / count
  meaningFr?: string;      // Meaning or description
  title?: string;          // Optional title (e.g., "WIRD SUPRÊME")
  isParchment?: boolean;   // Standard vs Parchment background
  includeZikrGuide?: boolean; // Whether to include Zikr Accomplishment Guide (default: true)
  lang?: 'fr' | 'en' | 'ha'; // Language parameter
  khatamMatrix?: (string | number)[][]; // 2D matrix for Khatam grid (e.g. 4x4, 3x3)
  khatamTitle?: string;                 // Subtitle above grid
  detailsList?: { label: string; value: string; highlight?: boolean }[]; // Detailed breakdown list
}

/**
 * Generates a high-resolution 1200x1750 Canvas for a Wird (Standard Luxury or Sacred Parchment)
 * with complete Zikr Accomplishment Guide & Protocol, downloaded as a PNG with the official AsrarHub watermark.
 */
export async function exportWirdToImage(params: ExportWirdParams): Promise<boolean> {
  const includeGuide = params.includeZikrGuide !== false; // Default to true
  const lang = params.lang || 'fr';
  const width = 1200;

  const hasMatrix = !!(params.khatamMatrix && params.khatamMatrix.length > 0);
  const details = params.detailsList || [];
  const detailsCount = details.length;

  // Dynamic canvas height calculation to fit all content cleanly
  let baseHeight = 900;
  if (params.name || params.motherName) baseHeight += 48;
  if (hasMatrix) baseHeight += 120; // Larger central box for Khatam grid
  if (detailsCount > 0) {
    const detailRows = Math.ceil(detailsCount / (detailsCount > 4 ? 2 : 1));
    baseHeight += detailRows * 42 + 90;
  }
  if (includeGuide) baseHeight += 780;

  const height = Math.max(1500, baseHeight);

  // Dictionaries for localized export text
  const i18n = {
    fr: {
      header: 'ASRARHUB • KHAZINAT AL-ASRAR',
      defaultTitle: 'WIRD SUPRÊME & ISTIKHRAJ',
      imprint: (name: string, mother: string) => `EMPREINTE : ${name} (Mère: ${mother})`,
      abjadWeight: (weight: number) => `POIDS ABJAD (FRÉQUENCE) : ${weight}`,
      recitationCount: (weight: number) => `RÉCITATION QUOTIDIENNE : ${weight} FOIS`,
      protocolTitle: '۞ PROTOCOLE & GUIDE D\'ACCOMPLISSEMENT DU ZIKR ۞',
      steps: [
        {
          num: '1',
          title: 'PRÉPARATION (TAHAARAH)',
          desc: 'Ablutions complètes (Wudu), vêtements propres & parfum d\'encens pur sans alcool.'
        },
        {
          num: '2',
          title: 'OUVERTURE DU RITUEL',
          desc: 'Effectuer 2 Rakaats de prière surérogatoire, puis 100x Istighfar et 100x Salawat.'
        },
        {
          num: '3',
          title: 'FORMULATION DE L\'INTENTION (NIYYAH)',
          desc: 'Exprimer l\'intention sincère du cœur face à la Qibla avec humilité.'
        },
        {
          num: '4',
          title: 'RÉCITATION DU WIRD',
          desc: `Réciter le Zikr au nombre exact de son poids Abjad (${params.abjadWeight} fois) sans interruption.`
        },
        {
          num: '5',
          title: 'CLÔTURE ET INVOCATION',
          desc: 'Prière personnelle (Dua) pour votre besoin, clôturée par 10x ou 100x Salawat sur le Prophète.'
        }
      ],
      timesTitle: '🕒 MOMENTS PRIVILÉGIÉS DE PRATIQUE',
      timesLine1: 'Avant l\'aube (Tahajjud), après la prière du Fajr, ou après Maghrib / Isha.',
      timesLine2: 'Pratiquer dans un endroit propre, isolé et parfumé pour une résonance maximale.'
    },
    en: {
      header: 'ASRARHUB • KHAZINAT AL-ASRAR',
      defaultTitle: 'SUPREME WIRD & ISTIKHRAJ',
      imprint: (name: string, mother: string) => `SPIRITUAL IMPRINT: ${name} (Mother: ${mother})`,
      abjadWeight: (weight: number) => `ABJAD WEIGHT (FREQUENCY): ${weight}`,
      recitationCount: (weight: number) => `DAILY RECITATION: ${weight} TIMES`,
      protocolTitle: '۞ ZIKR ACCOMPLISHMENT PROTOCOL & GUIDE ۞',
      steps: [
        {
          num: '1',
          title: 'PREPARATION (TAHAARAH)',
          desc: 'Complete ablutions (Wudu), clean clothes & alcohol-free pure incense.'
        },
        {
          num: '2',
          title: 'RITUAL OPENING',
          desc: 'Perform 2 Rakaats supererogatory prayer, then 100x Istighfar and 100x Salawat.'
        },
        {
          num: '3',
          title: 'FORMULATION OF INTENTION (NIYYAH)',
          desc: 'Express the sincere intention of the heart facing Qibla with humility.'
        },
        {
          num: '4',
          title: 'RECITATION OF THE WIRD',
          desc: `Recite the Zikr to the exact Abjad weight count (${params.abjadWeight} times) without interruption.`
        },
        {
          num: '5',
          title: 'CLOSING & SUPPLICATION',
          desc: 'Personal prayer (Dua) for your need, closed with 10x or 100x Salawat upon the Prophet.'
        }
      ],
      timesTitle: '🕒 OPTIMAL PRACTICE TIMES',
      timesLine1: 'Before dawn (Tahajjud), after Fajr prayer, or after Maghrib / Isha.',
      timesLine2: 'Practice in a clean, quiet, and scented location for maximum resonance.'
    },
    ha: {
      header: 'ASRARHUB • KHAZINAT AL-ASRAR',
      defaultTitle: 'WIRDIL KAHAN & ISTIKHRAJ',
      imprint: (name: string, mother: string) => `AMALIN CIKI: ${name} (Mahaifiya: ${mother})`,
      abjadWeight: (weight: number) => `LISSAFIN ABJAD (RABA): ${weight}`,
      recitationCount: (weight: number) => `AMFANI KULLUM: SA'A ${weight}`,
      protocolTitle: '۞ SHARUƊƊA DA ARRASALIN CIKASUWAN ZIKIRI ۞',
      steps: [
        {
          num: '1',
          title: 'SHIRYE-SHIRYE (TAHAARAH)',
          desc: 'Tsarki na Wudu, tufafi masu tsarki da turare marar giya.'
        },
        {
          num: '2',
          title: 'BUƊE IBADA (RITUAL)',
          desc: 'Sallaci Raka\'a 2 na nafilah, sannan Istighfari sau 100 da Salatin Annabi sau 100.'
        },
        {
          num: '3',
          title: 'KULLA NIYYA (NIYYAH)',
          desc: 'Kulla niyya da gaskiyar zuciya wajen fuskantar Alqibla cikin kaskantar da kai.'
        },
        {
          num: '4',
          title: 'KARANTA WIRDIL',
          desc: `Karanta Zikirin zuwa adadin Abjad dinsa (${params.abjadWeight}) ba tare da yankewa ba.`
        },
        {
          num: '5',
          title: 'RUFE DA ADDU\'A',
          desc: 'Yi Addu\'a ta kanka game da buqatar ka, a rufe da Salatin Annabi sau 10 ko 100.'
        }
      ],
      timesTitle: '🕒 MAFI KYAWUN LOKUTAN AMFANI',
      timesLine1: 'Kafin asuba (Tahajjud), bayan sallat Subhi, ko bayan Magriba / Isha.',
      timesLine2: 'Yi amfani a wuri mai tsarki, na warewa da turare domin samun nasara.'
    }
  };

  const t = i18n[lang] || i18n.fr;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  const isParchment = !!params.isParchment;
  const formattedArabic = applyTashkeel(params.arabicZikr);

  // 1. Background Fill & Texture
  if (isParchment) {
    // Warm Vintage Parchment Gradient
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 950);
    bgGrad.addColorStop(0, '#fef9c3');   // Amber-100 center
    bgGrad.addColorStop(0.5, '#fef08a'); // Amber-200 mid
    bgGrad.addColorStop(0.85, '#fde047');// Amber-300
    bgGrad.addColorStop(1, '#d97706');   // Amber-600 aged edges

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle Noise / Texture lines on parchment
    ctx.fillStyle = 'rgba(120, 53, 15, 0.04)';
    for (let i = 0; i < 75; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const rw = Math.random() * 220 + 50;
      const rh = Math.random() * 2 + 1;
      ctx.fillRect(rx, ry, rw, rh);
    }

    // Outer Parchment Border (Double Line in Dark Amber)
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.strokeRect(52, 52, width - 104, height - 104);

    // Corner Sacred Stars / Ornaments
    const drawCornerOrnament = (cx: number, cy: number) => {
      ctx.save();
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawCornerOrnament(70, 70);
    drawCornerOrnament(width - 70, 70);
    drawCornerOrnament(70, height - 70);
    drawCornerOrnament(width - 70, height - 70);

  } else {
    // Luxury Deep Obsidian & Emerald Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#022c22');   // Deep Emerald
    bgGrad.addColorStop(0.35, '#064e3b'); // Emerald Dark
    bgGrad.addColorStop(0.75, '#0f172a'); // Slate Dark
    bgGrad.addColorStop(1, '#020617');   // Obsidian

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Geometric Grid Accent
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Outer Gold Card Border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(35, 35, width - 70, height - 70);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(45, 45, width - 90, height - 90);
  }

  // Max Text Width for Headers & Elements
  const maxAllowedWidth = width - 160;

  // 2. Main Header Title
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = isParchment ? '#78350f' : '#f59e0b';
  let topTitleSize = 44;
  const topTitleStr = t.header;
  ctx.font = `bold ${topTitleSize}px serif`;
  ctx.fillText(topTitleStr, width / 2, 100);

  // Subtitle / Section Title
  const categoryTitle = (params.title || t.defaultTitle).toUpperCase();
  ctx.fillStyle = isParchment ? '#b45309' : '#34d399';
  let catFontSize = 36;
  ctx.font = `bold ${catFontSize}px sans-serif`;
  while (ctx.measureText(categoryTitle).width > maxAllowedWidth && catFontSize > 22) {
    catFontSize -= 1;
    ctx.font = `bold ${catFontSize}px sans-serif`;
  }
  ctx.fillText(categoryTitle, width / 2, 155);

  // Decorative Line under header
  ctx.strokeStyle = isParchment ? '#d97706' : '#10b981';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(140, 180);
  ctx.lineTo(width - 140, 180);
  ctx.stroke();

  // 3. User & Mother Name Info Box (if available)
  let nextY = 230;
  if (params.name || params.motherName) {
    const nameStr = t.imprint(params.name || '---', params.motherName || '---');
    ctx.fillStyle = isParchment ? '#92400e' : '#a7f3d0';
    let nameFontSize = 28;
    ctx.font = `bold ${nameFontSize}px sans-serif`;
    while (ctx.measureText(nameStr).width > maxAllowedWidth && nameFontSize > 18) {
      nameFontSize -= 1;
      ctx.font = `bold ${nameFontSize}px sans-serif`;
    }
    ctx.fillText(nameStr, width / 2, nextY);
    nextY += 48;
  }

  // 4. Mystical Weight Badge
  const weightStr = t.abjadWeight(params.abjadWeight);
  ctx.fillStyle = isParchment ? '#78350f' : '#fbbf24';
  let weightFontSize = 34;
  ctx.font = `bold ${weightFontSize}px serif`;
  while (ctx.measureText(weightStr).width > maxAllowedWidth && weightFontSize > 20) {
    weightFontSize -= 1;
    ctx.font = `bold ${weightFontSize}px serif`;
  }
  ctx.fillText(weightStr, width / 2, nextY);

  // 5. Central Sacred Geometry Calligraphy Box or Khatam Matrix Grid
  const boxX = 80;
  const boxY = nextY + 38;
  const boxW = width - 160;
  const boxH = hasMatrix ? 440 : 370;

  // Box Background
  ctx.fillStyle = isParchment ? 'rgba(254, 243, 199, 0.85)' : 'rgba(6, 78, 59, 0.5)';
  ctx.fillRect(boxX, boxY, boxW, boxH);

  ctx.strokeStyle = isParchment ? '#b45309' : '#059669';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  ctx.strokeStyle = isParchment ? '#d97706' : '#34d399';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(boxX + 10, boxY + 10, boxW - 20, boxH - 20);

  const centerX = width / 2;
  const centerY = boxY + boxH / 2;

  if (hasMatrix && params.khatamMatrix) {
    // RENDER SACRED KHATAM / WAFQ MATRIX GRID
    const matrix = params.khatamMatrix;
    const rows = matrix.length;
    const cols = matrix[0]?.length || 1;

    const gridPadding = 20;
    const gridX = boxX + gridPadding;
    const gridY = boxY + gridPadding;
    const gridW = boxW - gridPadding * 2;
    const gridH = boxH - gridPadding * 2;

    const cellW = gridW / cols;
    const cellH = gridH / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cellX = gridX + c * cellW;
        const cellY = gridY + r * cellH;
        const cellVal = String(matrix[r][c] || '');

        // Cell background
        ctx.fillStyle = isParchment ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.12)';
        ctx.fillRect(cellX + 2, cellY + 2, cellW - 4, cellH - 4);

        // Cell border
        ctx.strokeStyle = isParchment ? '#b45309' : '#10b981';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cellX, cellY, cellW, cellH);

        // Cell index marker (e.g. M1..M16 or 1..16)
        const cellNum = r * cols + c + 1;
        ctx.fillStyle = isParchment ? '#92400e' : '#34d399';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${cellNum}`, cellX + cellW - 6, cellY + 16);

        // Cell Main Value
        ctx.fillStyle = isParchment ? '#451a03' : '#ffffff';
        ctx.textAlign = 'center';

        let fontSize = rows > 3 ? 24 : 32;
        ctx.font = `bold ${fontSize}px "Amiri", "Traditional Arabic", serif, sans-serif`;

        while (ctx.measureText(cellVal).width > cellW - 12 && fontSize > 12) {
          fontSize -= 1;
          ctx.font = `bold ${fontSize}px "Amiri", "Traditional Arabic", serif, sans-serif`;
        }

        ctx.fillText(cellVal, cellX + cellW / 2, cellY + cellH / 2 + fontSize / 3);
      }
    }
  } else {
    // Central Octagram Circle Overlay in Box background
    ctx.save();
    ctx.strokeStyle = isParchment ? 'rgba(180, 83, 9, 0.28)' : 'rgba(16, 185, 129, 0.28)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 145, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 125, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Main Arabic Zikr Calligraphy in Box
    ctx.fillStyle = isParchment ? '#451a03' : '#ffffff';
    
    let zikrFontSize = 72;
    ctx.font = `bold ${zikrFontSize}px "Amiri", "Traditional Arabic", serif`;
    
    // Measure width and dynamically shrink font if needed
    while (ctx.measureText(formattedArabic).width > boxW - 60 && zikrFontSize > 28) {
      zikrFontSize -= 2;
      ctx.font = `bold ${zikrFontSize}px "Amiri", "Traditional Arabic", serif`;
    }

    // Draw Main Arabic Zikr centered inside the box
    ctx.fillText(formattedArabic, centerX, centerY + 22);
  }

  // 6. Transliteration Section below Box
  let footerY = boxY + boxH + 52;

  ctx.fillStyle = isParchment ? '#92400e' : '#34d399';
  let translitFontSize = 34;
  ctx.font = `bold ${translitFontSize}px sans-serif`;
  while (ctx.measureText(params.transliteration).width > maxAllowedWidth && translitFontSize > 20) {
    translitFontSize -= 1;
    ctx.font = `bold ${translitFontSize}px sans-serif`;
  }
  ctx.fillText(params.transliteration, width / 2, footerY);

  // Recitation instruction count
  footerY += 46;
  const countInstruction = t.recitationCount(params.abjadWeight);
  ctx.fillStyle = isParchment ? '#78350f' : '#fbbf24';
  let countFontSize = 30;
  ctx.font = `bold ${countFontSize}px serif`;
  ctx.fillText(countInstruction, width / 2, footerY);

  // Meaning / Context if provided
  if (params.meaningFr) {
    footerY += 44;
    ctx.fillStyle = isParchment ? '#451a03' : '#e2e8f0';
    let meaningFontSize = 24;
    ctx.font = `italic ${meaningFontSize}px sans-serif`;
    
    // Wrap long meaning into max 2 lines
    const maxMeaningWidth = maxAllowedWidth - 40;
    const words = params.meaningFr.split(' ');
    let line1 = '';
    let line2 = '';

    for (const w of words) {
      if (ctx.measureText(line1 + ' ' + w).width < maxMeaningWidth) {
        line1 += (line1 ? ' ' : '') + w;
      } else {
        line2 += (line2 ? ' ' : '') + w;
      }
    }

    ctx.fillText(line1, width / 2, footerY);
    if (line2) {
      footerY += 32;
      ctx.fillText(line2, width / 2, footerY);
    }
  }

  // 6.5 DETAILED INFORMATION TABLE (If detailsList provided)
  if (detailsCount > 0) {
    const detailsX = 60;
    const detailsY = footerY + 35;
    const detailsW = width - 120;

    const useTwoCols = detailsCount > 4;
    const colCount = useTwoCols ? 2 : 1;
    const rowCount = Math.ceil(detailsCount / colCount);
    const itemH = 46;
    const detailsH = rowCount * itemH + 80;

    // Card Box
    ctx.fillStyle = isParchment ? 'rgba(120, 53, 15, 0.05)' : 'rgba(16, 185, 129, 0.08)';
    ctx.fillRect(detailsX, detailsY, detailsW, detailsH);

    ctx.strokeStyle = isParchment ? '#b45309' : '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(detailsX, detailsY, detailsW, detailsH);

    // Header Title for Details
    ctx.fillStyle = isParchment ? '#78350f' : '#f59e0b';
    ctx.font = 'bold 26px serif';
    ctx.textAlign = 'center';
    ctx.fillText('۞ DÉTAILS DE LA CONSULTATION & KHATAM ۞', width / 2, detailsY + 38);

    // Separator line
    ctx.strokeStyle = isParchment ? 'rgba(180, 83, 9, 0.3)' : 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(detailsX + 40, detailsY + 50);
    ctx.lineTo(detailsX + detailsW - 40, detailsY + 50);
    ctx.stroke();

    // Render Key-Value Rows
    const colW = (detailsW - 40) / colCount;

    details.forEach((item, idx) => {
      const colIdx = useTwoCols ? idx % 2 : 0;
      const rowIdx = useTwoCols ? Math.floor(idx / 2) : idx;

      const itemX = detailsX + 20 + colIdx * colW;
      const itemY = detailsY + 75 + rowIdx * itemH;

      // Label
      ctx.textAlign = 'left';
      ctx.fillStyle = isParchment ? '#78350f' : '#34d399';
      ctx.font = 'bold 18px sans-serif';
      const labelStr = item.label + ' : ';
      ctx.fillText(labelStr, itemX, itemY);

      // Value
      const labelW = ctx.measureText(labelStr).width;
      ctx.fillStyle = isParchment ? '#451a03' : '#ffffff';
      ctx.font = item.highlight ? 'bold 19px sans-serif' : '18px sans-serif';

      let valStr = item.value;
      const maxValW = colW - labelW - 10;
      while (ctx.measureText(valStr).width > maxValW && valStr.length > 5) {
        valStr = valStr.substring(0, valStr.length - 2) + '…';
      }

      ctx.fillText(valStr, itemX + labelW, itemY);
    });

    footerY = detailsY + detailsH + 20;
  }

  // 7. Zikr Accomplishment Guide (Protocol Section)
  if (includeGuide) {
    const guideBoxX = 60;
    const guideBoxY = footerY + 45;
    const guideBoxW = width - 120;
    const guideBoxH = 770;

    // Outer Protocol Container Box
    ctx.fillStyle = isParchment ? 'rgba(120, 53, 15, 0.06)' : 'rgba(16, 185, 129, 0.09)';
    ctx.fillRect(guideBoxX, guideBoxY, guideBoxW, guideBoxH);

    ctx.strokeStyle = isParchment ? '#b45309' : '#10b981';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(guideBoxX, guideBoxY, guideBoxW, guideBoxH);

    ctx.strokeStyle = isParchment ? 'rgba(180, 83, 9, 0.35)' : 'rgba(16, 185, 129, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(guideBoxX + 6, guideBoxY + 6, guideBoxW - 12, guideBoxH - 12);

    // Header Title for Protocol Box
    ctx.fillStyle = isParchment ? '#78350f' : '#f59e0b';
    ctx.font = 'bold 32px serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.protocolTitle, width / 2, guideBoxY + 48);

    // Decorative Separator Line
    ctx.strokeStyle = isParchment ? '#d97706' : '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(guideBoxX + 80, guideBoxY + 68);
    ctx.lineTo(guideBoxX + guideBoxW - 80, guideBoxY + 68);
    ctx.stroke();

    // 5 Protocol Steps
    const steps = t.steps;

    let currentStepY = guideBoxY + 120;

    steps.forEach((step) => {
      // Circle Badge Number
      const badgeX = guideBoxX + 48;
      const badgeY = currentStepY - 6;

      ctx.save();
      ctx.fillStyle = isParchment ? '#b45309' : '#059669';
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(step.num, badgeX, badgeY);
      ctx.restore();

      // Step Title
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = isParchment ? '#78350f' : '#fbbf24';
      ctx.font = 'bold 25px sans-serif';
      ctx.fillText(step.title, guideBoxX + 82, currentStepY - 12);

      // Step Description
      ctx.fillStyle = isParchment ? '#451a03' : '#e2e8f0';
      ctx.font = '21px sans-serif';
      ctx.fillText(step.desc, guideBoxX + 82, currentStepY + 16);

      currentStepY += 88;
    });

    // Optimal Times Banner inside Protocol Box
    const timesBoxY = currentStepY + 15;
    const timesBoxX = guideBoxX + 30;
    const timesBoxW = guideBoxW - 60;
    const timesBoxH = 145;

    ctx.fillStyle = isParchment ? 'rgba(217, 119, 6, 0.15)' : 'rgba(6, 78, 59, 0.55)';
    ctx.fillRect(timesBoxX, timesBoxY, timesBoxW, timesBoxH);

    ctx.strokeStyle = isParchment ? '#d97706' : '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(timesBoxX, timesBoxY, timesBoxW, timesBoxH);

    ctx.textAlign = 'center';
    ctx.fillStyle = isParchment ? '#78350f' : '#34d399';
    ctx.font = 'bold 25px sans-serif';
    ctx.fillText(t.timesTitle, width / 2, timesBoxY + 38);

    ctx.fillStyle = isParchment ? '#92400e' : '#cbd5e1';
    ctx.font = 'italic 21px sans-serif';
    ctx.fillText(t.timesLine1, width / 2, timesBoxY + 75);

    ctx.font = '20px sans-serif';
    ctx.fillStyle = isParchment ? '#b45309' : '#a7f3d0';
    ctx.fillText(t.timesLine2, width / 2, timesBoxY + 108);
  }

  // File Name formatting
  const sanitizedTitle = (params.title || 'wird')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 25);
  const modeName = isParchment ? 'parchemin' : 'deluxe_png';
  const fileName = `asrarhub_wird_${sanitizedTitle}_${params.abjadWeight}_${modeName}.png`;

  // Download canvas via downloadCanvasImage (which automatically adds the AsrarHub watermark)
  return await downloadCanvasImage(canvas, fileName, false);
}
