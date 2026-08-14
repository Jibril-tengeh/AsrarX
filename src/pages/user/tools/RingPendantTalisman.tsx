import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Circle, Disc, Sparkles, Download, Copy, Check, Shield, Info, 
  Eye, RefreshCw, Layers, FileDown, Share2, Compass, Moon, Sun, Flame, Feather, Gem, Scale, FileText, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { calculateAbjadValue } from '../../../utils/abjad';
import { useFeatures } from '../../../contexts/FeatureContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { toCanvas, toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { notifyDownloadStart, notifyDownloadSuccess, notifyDownloadError } from '../../../utils/downloadNotification';
import { AsrarHubWatermark } from '../../../components/AsrarHubWatermark';
import { ShareToCommunityModal } from '../../../components/ShareToCommunityModal';

interface MetalOption {
  id: string;
  nameFr: string;
  planetFr: string;
  dayFr: string;
  incenseFr: string;
  gradient: string;
  borderColor: string;
  textColor: string;
  shadow: string;
}

const METALS: MetalOption[] = [
  { id: 'silver', nameFr: 'Argent Pur (Fidda)', planetFr: 'Lune (Al-Qamar)', dayFr: 'Lundi', incenseFr: 'Jawi, Musc Blanc, Camphre', gradient: 'from-slate-200 via-gray-100 to-slate-400', borderColor: '#94a3b8', textColor: '#334155', shadow: 'rgba(148, 163, 184, 0.4)' },
  { id: 'gold', nameFr: 'Or Sacré (Dhahab)', planetFr: 'Soleil (Ash-Shams)', dayFr: 'Dimanche', incenseFr: 'Oud, Ambre, Safran', gradient: 'from-amber-200 via-yellow-300 to-amber-500', borderColor: '#eab308', textColor: '#78350f', shadow: 'rgba(234, 179, 8, 0.4)' },
  { id: 'copper', nameFr: 'Cuivre Rouge (Nahas)', planetFr: 'Vénus (Al-Zuhara)', dayFr: 'Vendredi', incenseFr: 'Bois de Santal, Rose, Mastic', gradient: 'from-orange-300 via-amber-600 to-orange-700', borderColor: '#ea580c', textColor: '#7c2d12', shadow: 'rgba(234, 88, 12, 0.4)' },
  { id: 'bronze', nameFr: 'Bronze Antique (Laiton)', planetFr: 'Jupiter (Al-Mushtari)', dayFr: 'Jeudi', incenseFr: 'Luban Dhakar (Oliban), Benjoin', gradient: 'from-yellow-700 via-amber-800 to-stone-900', borderColor: '#854d0e', textColor: '#451a03', shadow: 'rgba(133, 77, 14, 0.4)' },
  { id: 'iron', nameFr: 'Fer de Protection (Hadid)', planetFr: 'Mars (Al-Mirrikh)', dayFr: 'Mardi', incenseFr: 'Harmel, Poivre Noir, Mustard', gradient: 'from-zinc-400 via-zinc-600 to-zinc-900', borderColor: '#52525b', textColor: '#18181b', shadow: 'rgba(82, 82, 91, 0.4)' },
  { id: 'tin', nameFr: 'Étain Pur (Qasdir)', planetFr: 'Mercure (Al-Utarid)', dayFr: 'Mercredi', incenseFr: 'Mastic, Menthe, Camphre', gradient: 'from-teal-200 via-cyan-400 to-slate-600', borderColor: '#2dd4bf', textColor: '#134e4a', shadow: 'rgba(45, 212, 191, 0.4)' },
];

interface GemOption {
  id: string;
  nameFr: string;
  spiritualVirtueFr: string;
  colorHex: string;
  innerGlow: string;
}

const GEMSTONES: GemOption[] = [
  { id: 'aqeeq_red', nameFr: 'Agate Yéménite Rouge (Aqeeq Ahmar)', spiritualVirtueFr: 'Courage, Protection contre la pauvreté et les périls', colorHex: '#991b1b', innerGlow: '#f87171' },
  { id: 'aqeeq_yellow', nameFr: 'Agate Jaune (Sharaf al-Shams)', spiritualVirtueFr: 'Richesse, Rayonnement, Prestige, Accomplissement', colorHex: '#ca8a04', innerGlow: '#fef08a' },
  { id: 'emerald', nameFr: 'Émeraude Spirituelle (Zumurrud)', spiritualVirtueFr: 'Sagesse, Guérison des cœurs, Éloquence', colorHex: '#065f46', innerGlow: '#34d399' },
  { id: 'ruby', nameFr: 'Rubis Royal (Yaqut Ahmar)', spiritualVirtueFr: 'Charisme royal, Victoire sur les ennemis, Vitalité', colorHex: '#881337', innerGlow: '#fb7185' },
  { id: 'turquoise', nameFr: 'Turquoise Bénie (Firouz)', spiritualVirtueFr: 'Hassanat, Protection absolue contre le Mauvais Œil (Ayn)', colorHex: '#0e7490', innerGlow: '#22d3ee' },
  { id: 'lapis', nameFr: 'Lapis-Lazuli Bleu Nuit (Lajward)', spiritualVirtueFr: 'Évation mystique, Sérénité, Ouverture du cœur', colorHex: '#1e3a8a', innerGlow: '#60a5fa' },
  { id: 'amethyst', nameFr: 'Améthyste Violette (Jamlaz)', spiritualVirtueFr: 'Purification spirituelle, Calme mental', colorHex: '#581c87', innerGlow: '#c084fc' },
  { id: 'cornelian', nameFr: 'Cornaline Orange (Aqeeq Aqiq)', spiritualVirtueFr: 'Dissipation des chagrins et de la colère', colorHex: '#c2410c', innerGlow: '#fb923c' },
  { id: 'jade', nameFr: 'Jade Vert (Yashb)', spiritualVirtueFr: 'Harmonie divine, Abondance matérielle', colorHex: '#15803d', innerGlow: '#4ade80' },
  { id: 'none', nameFr: 'Aucune Pierre (Plaque Métal Purgée)', spiritualVirtueFr: 'Ciselure directe sur métal pur astrologique', colorHex: 'transparent', innerGlow: 'transparent' },
];

export type BezelShape = 'round' | 'oval' | 'octagon' | 'hexagon';
export type CenterGeometry = 'sharaf_symbols' | 'sulayman_star' | 'wafq_3x3' | 'center_text' | 'islamic_star' | 'crescent_star';

interface TalismanPreset {
  id: string;
  nameFr: string;
  nameAr: string;
  type: 'ring' | 'pendant';
  metalId: string;
  gemId: string;
  shape: BezelShape;
  geometry: CenterGeometry;
  outerText: string;
  centerText: string;
  innerNumber: string;
  descFr: string;
}

const TALISMAN_PRESETS: TalismanPreset[] = [
  {
    id: 'sharaf_shams',
    nameFr: 'Sceau Sacré Sharaf al-Shams (شرف الشمس)',
    nameAr: 'شرف الشمس الميمون',
    type: 'ring',
    metalId: 'gold',
    gemId: 'aqeeq_yellow',
    shape: 'oval',
    geometry: 'sharaf_symbols',
    outerText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ - يَا حَفِيظُ يَا سَلاَمُ',
    centerText: 'الله حفيظ',
    innerNumber: '111',
    descFr: 'Les 7 symboles ésotériques gravés traditionnellement sur Agate Jaune lors du passage du Soleil à 19° du Bélier pour la richesse et la protection souveraine.',
  },
  {
    id: 'khatim_sulaymani',
    nameFr: 'Khatim Sulaymani Royal (خاتم سليمان)',
    nameAr: 'خاتم سليمان عليه السلام',
    type: 'ring',
    metalId: 'silver',
    gemId: 'aqeeq_red',
    shape: 'round',
    geometry: 'sulayman_star',
    outerText: 'فَتَحْنَا لَكَ فَتْحًا مُبِينًا - سَلاَمٌ قَوْلاً مِنْ رَبٍّ رَحِيمٍ',
    centerText: 'سليمان',
    innerNumber: '1111',
    descFr: 'Sceau du Roi Sulayman (as) conférant autorité, domination noble sur les esprits et prestige auprès des dirigeants.',
  },
  {
    id: 'wafq_ghazali',
    nameFr: 'Pendentif Wafq Ghazali 3x3 (وفق الغزالي)',
    nameAr: 'وفق الغزالي الشريف 3x3',
    type: 'pendant',
    metalId: 'silver',
    gemId: 'emerald',
    shape: 'octagon',
    geometry: 'wafq_3x3',
    outerText: 'يَا حَيُّ يَا قَيُّومُ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ',
    centerText: '١٥',
    innerNumber: '15',
    descFr: 'Le carré magique 3x3 sacré de l’Imam Ghazali au total équilibré de 15 par ligne, vecteur d’harmonie divine et de prospérité.',
  },
  {
    id: 'ayat_kursi',
    nameFr: 'Médaille Ayat al-Kursi (آية الكرسي الحصين)',
    nameAr: 'آية الكرسي المباركة',
    type: 'pendant',
    metalId: 'silver',
    gemId: 'turquoise',
    shape: 'oval',
    geometry: 'center_text',
    outerText: 'اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ',
    centerText: 'يا حفيظ',
    innerNumber: '313',
    descFr: 'Cercle de protection suprême gravé du Verset du Trône pour préserver le porteur du mauvais œil, des démons et des calamités.',
  },
  {
    id: 'nad_ali',
    nameFr: 'Bague Nad Ali al-Kabeer (ناد علياً)',
    nameAr: 'ناد علياً مظهر العجائب',
    type: 'ring',
    metalId: 'silver',
    gemId: 'aqeeq_red',
    shape: 'oval',
    geometry: 'crescent_star',
    outerText: 'نَادِ عَلِيّاً مَظْهَرَ الْعَجَائِبِ تَجِدْهُ عَوْناً لَكَ فِي النَّوَائِبِ',
    centerText: 'يا علي',
    innerNumber: '110',
    descFr: 'Invocations théurgiques puissantes de l’Imam Ali pour dissiper les afflictions majeures et terrasser l’adversité.',
  },
];

const talismanDict = {
  fr: {
    back: "Retour aux outils",
    title: "Générateur de Talismans de Bague & Pendentifs",
    desc: "Concevez, personnalisez et gravez virtuellement des bijoux théurgiques sacrés (Khatim, Medaillons, Sharaf al-Shams) prêts pour un maître bijoutier orfèvre ou la méditation.",
    presetsTitle: "Bibliothèque de Préréglages Traditionnels Sacrés",
    selectPresetBtn: "Appliquer ce Modèle",
    step1: "1. Type de Bijou & Geometrie du Sertissage",
    ring: "Bague Théurgique (Khatim)",
    pendant: "Pendentif / Médaillon",
    shapeLabel: "Forme du Cabochon / Sertissage :",
    shapeRound: "Ronde (دائرية)",
    shapeOval: "Ovale (بيضاوية)",
    shapeOctagon: "Octogonale (مثمنة)",
    shapeHexagon: "Hexagonale (مسدسة)",
    step2: "2. Alliage Métallique Sacré",
    step3: "3. Gemme / Cabochon (Aqeeq, Zumurrud...)",
    step4: "4. Inscriptions & Symboles Ésoétériques",
    centerGeomLabel: "Motif / Symbole au Centre de la Pierre :",
    geomSharaf: "7 Symboles de Sharaf al-Shams (الرموز السبعة)",
    geomSulayman: "Sceau / Étoile de Sulayman (خاتم سليمان)",
    geomWafq: "Carré Magique 3x3 Gravé (وفق الغزالي)",
    geomText: "Calligraphie Nom Divin / Verset",
    geomStar: "Rosace Islamique 8 Branches",
    geomCrescent: "Croissant & Étoile Bénie",
    outerTextLabel: "Gravure Extérieure (Cercle / Ovale Biseau)",
    centerTextLabel: "Gravure Centrale (Sceau / Nom Divin)",
    innerNumLabel: "Sceau Numérique Secret (Adad / Jummal)",
    engraveSideLabel: "Emplacement de la Gravure :",
    sideFront: "Face Avant (Visuelle Extérieure)",
    sideBack: "Face Arrière (Sous Pierre - Contact Peau)",
    mirrorToggle: "Mode Gravure Inversée (Tampon Sceau)",
    protocolTitle: "Protocole Planétaire & Instructions de Consecration",
    planetPlanet: "Planète Gouvernante :",
    planetDay: "Jour Favorable :",
    planetIncense: "Encens de Fumigation :",
    jewelerNote: "Directives pour le Maître Bijoutier Orfèvre :",
    downloadBtn: "Télécharger PNG HD",
    downloadPdfBtn: "Fiche Technique PDF",
    downloadSvgBtn: "Fichier Vectoriel SVG",
    shareCommunityBtn: "Publier dans la Communauté",
    copyBtn: "Copier la Fiche Technique",
    copied: "Fiche Copiée !",
  },
  en: {
    back: "Back to tools",
    title: "Ring & Pendant Talisman Generator",
    desc: "Design, customize, and virtually engrave sacred theurgic jewelry (Khatim, Medallions, Sharaf al-Shams) ready for a master jeweler or meditation.",
    presetsTitle: "Sacred Traditional Presets Library",
    selectPresetBtn: "Apply This Preset",
    step1: "1. Type of Sacred Jewel & Setting Geometry",
    ring: "Theurgic Ring (Khatim)",
    pendant: "Pendant / Medallion",
    shapeLabel: "Setting / Gemstone Shape:",
    shapeRound: "Round (Circular)",
    shapeOval: "Oval",
    shapeOctagon: "Octagonal",
    shapeHexagon: "Hexagonal",
    step2: "2. Sacred Metallic Alloy",
    step3: "3. Gemstone / Cabochon (Aqeeq, Emerald...)",
    step4: "4. Inscriptions & Esoteric Symbols",
    centerGeomLabel: "Center Stone Motif / Symbol:",
    geomSharaf: "7 Symbols of Sharaf al-Shams",
    geomSulayman: "Seal of Solomon Star",
    geomWafq: "3x3 Magic Square Engraved",
    geomText: "Central Divine Name / Text",
    geomStar: "8-Pointed Islamic Star",
    geomCrescent: "Blessed Crescent & Star",
    outerTextLabel: "Outer Circle / Bevel Engraving",
    centerTextLabel: "Central Engraving (Divine Name)",
    innerNumLabel: "Secret Numerical Seal (Adad)",
    engraveSideLabel: "Engraving Location:",
    sideFront: "Front Face (Visual Outer)",
    sideBack: "Back Face (Under Stone - Skin Contact)",
    mirrorToggle: "Mirror Engraving Mode (Seal Stamp)",
    protocolTitle: "Planetary Protocol & Consecration Instructions",
    planetPlanet: "Ruling Planet:",
    planetDay: "Favorable Day:",
    planetIncense: "Fumigation Incense:",
    jewelerNote: "Master Jeweler Technical Directives:",
    downloadBtn: "Download HD PNG",
    downloadPdfBtn: "Jeweler PDF Sheet",
    downloadSvgBtn: "Vector SVG File",
    shareCommunityBtn: "Publish to Community",
    copyBtn: "Copy Technical Sheet",
    copied: "Sheet Copied!",
  },
  ha: {
    back: "Koma zuwa kayan aiki",
    title: "Mai Hada Hatimin Zobe da Lakani",
    desc: "Zane da yi wa kayan ado na kariya rubutun alfarma a shirye don maƙera ko tunani.",
    presetsTitle: "Rariyar Tsarin Asali na Alfarma",
    selectPresetBtn: "Zaɓi Wannan Tsari",
    step1: "1. Nau'in Kayan Ado & Siffar Dutse",
    ring: "Zoben Hatimi (Khatim)",
    pendant: "Lakanin Wuya / Kwando",
    shapeLabel: "Siffar Dutse da Karfe:",
    shapeRound: "Madaidaiciya (Kewaye)",
    shapeOval: "Kwai-kwai (Oval)",
    shapeOctagon: "Gidaje 8",
    shapeHexagon: "Gidaje 6",
    step2: "2. Sinar Karfe na Alfarma",
    step3: "3. Dutsen Alfarma (Aqeeq, Zumurrud...)",
    step4: "4. Rubutun Filaye da Sakonni",
    centerGeomLabel: "Siffar Tsakiya:",
    geomSharaf: "Alamomi 7 na Sharaf al-Shams",
    geomSulayman: "Tauraron Sulaimanu",
    geomWafq: "Murabba'i 3x3 na Asirru",
    geomText: "Sunan Allah / Rubutu",
    geomStar: "Tauraro Mai Harshe 8",
    geomCrescent: "Watan Fari da Tauraro",
    outerTextLabel: "Rubutun Waje na Da'ira",
    centerTextLabel: "Rubutun Tsakiya (Sunan Allah)",
    innerNumLabel: "Lambar Asiri (Adad)",
    engraveSideLabel: "Gurin Yin Rubutu:",
    sideFront: "Fuskarta Waje",
    sideBack: "Fuskarta Ciki (Karkashin Dutse - Zuwa Fata)",
    mirrorToggle: "Juya Rubutu (Hatsin Hatimi)",
    protocolTitle: "Bayanan Taurari da Hayaƙi",
    planetPlanet: "Tauraro Mai Mulki:",
    planetDay: "Rana Mai Albarka:",
    planetIncense: "Hayaƙi na turare:",
    jewelerNote: "Aikin Maƙeri:",
    downloadBtn: "Sauke Hoto (PNG HD)",
    downloadPdfBtn: "Takardar PDF ta Maƙeri",
    downloadSvgBtn: "Fayil na SVG",
    shareCommunityBtn: "Buga a Al'umma",
    copyBtn: "Kwashe Bayanan Maƙeri",
    copied: "An kwashe!",
  }
};

export const RingPendantTalisman: React.FC = () => {
  const { language } = useLanguage();
  const dict = talismanDict[(language as 'fr' | 'en' | 'ha') || 'fr'] || talismanDict.fr;
  const { featureToggles } = useFeatures();
  const disableDuaCopy = !!featureToggles?.disable_dua_copy;

  const [talismanType, setTalismanType] = useState<'ring' | 'pendant'>('ring');
  const [metal, setMetal] = useState<MetalOption>(METALS[0]);
  const [gemstone, setGemstone] = useState<GemOption>(GEMSTONES[0]);
  const [bezelShape, setBezelShape] = useState<BezelShape>('round');
  const [centerGeometry, setCenterGeometry] = useState<CenterGeometry>('sharaf_symbols');
  const [engravingSide, setEngravingSide] = useState<'front' | 'back'>('front');
  const [isMirrorMode, setIsMirrorMode] = useState<boolean>(false);

  // Engraving text
  const [outerText, setOuterText] = useState<string>('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ - يَا حَفِيظُ يَا سَلاَمُ');
  const [centerText, setCenterText] = useState<string>('الله حفيظ');
  const [innerNumber, setInnerNumber] = useState<string>('111');

  const [copied, setCopied] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const { isPremium } = useAuth();
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const totalAbjadOuter = calculateAbjadValue(outerText);
  const totalAbjadCenter = calculateAbjadValue(centerText);
  const grandTotal = totalAbjadOuter + totalAbjadCenter + (parseInt(innerNumber, 10) || 0);

  const applyPreset = (preset: TalismanPreset) => {
    setTalismanType(preset.type);
    const m = METALS.find(x => x.id === preset.metalId) || METALS[0];
    setMetal(m);
    const g = GEMSTONES.find(x => x.id === preset.gemId) || GEMSTONES[0];
    setGemstone(g);
    setBezelShape(preset.shape);
    setCenterGeometry(preset.geometry);
    setOuterText(preset.outerText);
    setCenterText(preset.centerText);
    setInnerNumber(preset.innerNumber);
  };

  const exportAsPng = async () => {
    if (!svgContainerRef.current) return;
    if (!isPremium) {
      triggerProtectionModal('download');
      return;
    }
    const fname = `talisman-${talismanType}-${metal.id}-${gemstone.id}.png`;
    notifyDownloadStart(fname);
    try {
      const canvas = await toCanvas(svgContainerRef.current, { backgroundColor: '#0f172a', skipFonts: true });
      await downloadCanvasImage(canvas, fname);
    } catch (e) {
      console.error(e);
      notifyDownloadError(fname);
    }
  };

  const exportAsPDF = async () => {
    if (!svgContainerRef.current) return;
    if (!isPremium) {
      triggerProtectionModal('download');
      return;
    }
    const fname = `AsrarHub_Talisman_${talismanType}_${metal.id}.pdf`;
    notifyDownloadStart(fname);
    try {
      const canvas = await toCanvas(svgContainerRef.current, { backgroundColor: '#0f172a', skipFonts: true });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, 210, 297, 'F');

      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text("AsrarHub - Fiche Technique de Gravure Bijoutier", 105, 25, { align: 'center' });

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Type: ${talismanType === 'ring' ? 'Bague Théurgique (Khatim)' : 'Pendentif / Médaillon'} | Alliage: ${metal.nameFr}`, 15, 38);
      pdf.text(`Pierre / Cabochon: ${gemstone.nameFr}`, 15, 45);
      pdf.text(`Forme Sertissage: ${bezelShape.toUpperCase()} | Motif Central: ${centerGeometry}`, 15, 52);
      pdf.text(`Emplacement Gravure: ${engravingSide === 'front' ? 'Face Avant' : 'Face Arrière (Contact Peau)'} | Mode Miroir: ${isMirrorMode ? 'OUI (Tampon Inversé)' : 'NON'}`, 15, 59);

      pdf.setDrawColor(229, 231, 235);
      pdf.line(15, 64, 195, 64);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Inscriptions et Poids Jummal (Abjad) :", 15, 73);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`• Gravure Extérieure: ${outerText} (Poids: ${totalAbjadOuter})`, 20, 81);
      pdf.text(`• Gravure Centrale: ${centerText} (Poids: ${totalAbjadCenter})`, 20, 88);
      pdf.text(`• Sceau Numérique: ${innerNumber}`, 20, 95);
      pdf.text(`• Grand Total Mystique (Adad Total): ${grandTotal}`, 20, 102);

      const imgWidth = 100;
      const imgHeight = 100;
      const x = (210 - imgWidth) / 2;
      const y = 112;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

      pdf.setFontSize(10);
      pdf.setTextColor(180, 83, 9);
      pdf.text("Consignes de Consecration Planetaire :", 15, 222);
      pdf.setTextColor(75, 85, 99);
      pdf.text(`Planete: ${metal.planetFr} | Jour Favorable: ${metal.dayFr}`, 20, 229);
      pdf.text(`Encens de Fumigation: ${metal.incenseFr}`, 20, 235);
      pdf.text(`Vertu Spirituelle de la Gemme: ${gemstone.spiritualVirtueFr}`, 20, 241);

      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175);
      pdf.text("Généré via AsrarHub • Plateforme Sacrée des Sciences Théurgiques.", 105, 280, { align: 'center' });

      pdf.save(fname);
      notifyDownloadSuccess(fname);
    } catch (e) {
      console.error(e);
      notifyDownloadError(fname);
    }
  };

  const exportAsSVG = async () => {
    if (!svgContainerRef.current) return;
    if (!isPremium) {
      triggerProtectionModal('download');
      return;
    }
    const fname = `talisman-${talismanType}-${metal.id}.svg`;
    notifyDownloadStart(fname);
    try {
      const url = await toSvg(svgContainerRef.current, { backgroundColor: null, skipFonts: true });
      const link = document.createElement('a');
      link.download = fname;
      link.href = url;
      link.click();
      notifyDownloadSuccess(fname);
    } catch (e) {
      console.error(e);
      notifyDownloadError(fname);
    }
  };

  const copyDetails = () => {
    if (disableDuaCopy) return;
    if (!isPremium) {
      triggerProtectionModal('copy');
      return;
    }
    const details = `ASRARHUB • FICHE TECHNIQUE TALISMAN (${talismanType === 'ring' ? 'Bague' : 'Pendentif'})
--------------------------------------------------
Alliage Métallique : ${metal.nameFr} (Planète: ${metal.planetFr}, Jour: ${metal.dayFr})
Pierre / Cabochon  : ${gemstone.nameFr} (${gemstone.spiritualVirtueFr})
Forme Sertissage   : ${bezelShape.toUpperCase()}
Emplacement        : ${engravingSide === 'front' ? 'Face Avant' : 'Face Arrière (Sous Pierre)'}
Mode Miroir        : ${isMirrorMode ? 'Inversé (Tampon Sceau)' : 'Standard'}

INCRIPTIONS & ABJAD :
- Gravure Circulaire : ${outerText} (Adad: ${totalAbjadOuter})
- Gravure Centrale   : ${centerText} (Adad: ${totalAbjadCenter})
- Sceau Numérique    : ${innerNumber}
- ADAD TOTAL MYSTIQUE: ${grandTotal}

CONSEILS RITUELS :
- Encens conseillé   : ${metal.incenseFr}
--------------------------------------------------`;
    navigator.clipboard.writeText(details);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render 7 Symbols of Sharaf al-Shams SVG component
  const renderSharafSymbols = () => (
    <g transform="translate(150, 150) scale(0.65)" textAnchor="middle" dominantBaseline="central">
      {/* 1. Star */}
      <polygon points="0,-45 10,-20 38,-20 16,-3 24,22 0,7 -24,22 -16,-3 -38,-20 -10,-20" fill={metal.borderColor} opacity="0.9" />
      {/* 2. Crown / Three Lines */}
      <path d="M -70,-10 L -70,20 M -55,-10 L -55,20 M -40,-10 L -40,20 M -75,-10 L -35,-10" stroke={metal.borderColor} strokeWidth="3" fill="none" />
      {/* 3. M / Ha shape */}
      <path d="M 55,-20 Q 75,-30 65,-5 Q 55,20 75,10" stroke={metal.borderColor} strokeWidth="3" fill="none" />
      {/* 4. Cross / Plus */}
      <path d="M 0,-15 L 0,15 M -15,0 L 15,0" stroke={metal.borderColor} strokeWidth="3.5" fill="none" />
      {/* 5. Ladder */}
      <path d="M -30,25 L -30,55 M -10,25 L -10,55 M -30,32 L -10,32 M -30,40 L -10,40 M -30,48 L -10,48" stroke={metal.borderColor} strokeWidth="2.5" fill="none" />
      {/* 6. Four Vertical Lines */}
      <path d="M 15,25 L 15,55 M 25,25 L 25,55 M 35,25 L 35,55 M 45,25 L 45,55 M 10,25 L 50,25" stroke={metal.borderColor} strokeWidth="2.5" fill="none" />
      {/* 7. Crescent Moon with Dot */}
      <path d="M -55,30 A 15,15 0 1,0 -55,55 A 12,12 0 1,1 -55,30" fill={metal.borderColor} />
      <circle cx="-65" cy="42" r="2.5" fill={metal.borderColor} />
    </g>
  );

  // Render 6-pointed Star of Solomon
  const renderSulaymanStar = () => (
    <g transform="translate(150, 150) scale(0.85)" textAnchor="middle" dominantBaseline="central">
      <polygon points="0,-40 35,20 -35,20" fill="none" stroke={metal.borderColor} strokeWidth="2.5" />
      <polygon points="0,40 35,-20 -35,-20" fill="none" stroke={metal.borderColor} strokeWidth="2.5" />
      <circle cx="0" cy="0" r="12" fill="none" stroke={metal.borderColor} strokeWidth="1.5" strokeDasharray="3,3" />
    </g>
  );

  // Render 3x3 Magic Square (Wafq Ghazali)
  const renderWafq3x3 = () => (
    <g transform="translate(150, 150) scale(0.85)">
      <rect x="-36" y="-36" width="72" height="72" fill="#090d16" stroke={metal.borderColor} strokeWidth="2" />
      {/* Grid lines */}
      <line x1="-12" y1="-36" x2="-12" y2="36" stroke={metal.borderColor} strokeWidth="1.5" />
      <line x1="12" y1="-36" x2="12" y2="36" stroke={metal.borderColor} strokeWidth="1.5" />
      <line x1="-36" y1="-12" x2="36" y2="-12" stroke={metal.borderColor} strokeWidth="1.5" />
      <line x1="-36" y1="12" x2="36" y2="12" stroke={metal.borderColor} strokeWidth="1.5" />

      {/* Numbers 3x3 Ghazali */}
      <g fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle" dominantBaseline="central">
        <text x="-24" y="-24">4</text><text x="0" y="-24">9</text><text x="24" y="-24">2</text>
        <text x="-24" y="0">3</text><text x="0" y="0">5</text><text x="24" y="0">7</text>
        <text x="-24" y="24">8</text><text x="0" y="24">1</text><text x="24" y="24">6</text>
      </g>
    </g>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 safe-area-pt pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tools" className="p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft className="text-gray-600 dark:text-gray-300" size={20} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-amber-500 shrink-0" />
            <span className="truncate">{dict.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-0.5">
            {dict.desc}
          </p>
        </div>
      </div>

      {/* Traditional Presets Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-5 border border-amber-500/30 shadow-lg text-amber-100 mb-8 space-y-3">
        <div className="flex items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
          <h2 className="text-xs sm:text-sm font-extrabold text-amber-300 flex items-center gap-2">
            <Compass size={16} className="text-amber-400" />
            <span>{dict.presetsTitle}</span>
          </h2>
          <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            5 Préréglages Authentiques
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {TALISMAN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className="p-3 bg-black/40 hover:bg-amber-500/10 rounded-2xl border border-amber-500/20 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group hover:border-amber-400/50"
            >
              <div>
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {preset.type === 'ring' ? 'Bague' : 'Pendentif'}
                  </span>
                  <span className="text-[10px] font-arabic font-bold text-amber-200" dir="rtl">
                    {preset.nameAr}
                  </span>
                </div>
                <h3 className="text-xs font-extrabold text-white group-hover:text-amber-300 line-clamp-1">
                  {preset.nameFr}
                </h3>
                <p className="text-[10px] text-gray-400 line-clamp-2 mt-1">
                  {preset.descFr}
                </p>
              </div>

              <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1 mt-1 opacity-90 group-hover:opacity-100">
                <Sparkles size={11} /> {dict.selectPresetBtn}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Step 1: Jewel Type & Shape Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <label className="block text-xs font-extrabold text-gray-500 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Gem size={15} className="text-amber-500" />
              <span>{dict.step1}</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTalismanType('ring')}
                className={`p-3.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  talismanType === 'ring'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-300 shadow-sm'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <Circle size={18} className="text-amber-500" />
                <span>{dict.ring}</span>
              </button>
              <button
                type="button"
                onClick={() => setTalismanType('pendant')}
                className={`p-3.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  talismanType === 'pendant'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-300 shadow-sm'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <Disc size={18} className="text-amber-500" />
                <span>{dict.pendant}</span>
              </button>
            </div>

            {/* Shape selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                {dict.shapeLabel}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['round', 'oval', 'octagon', 'hexagon'] as BezelShape[]).map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => setBezelShape(shape)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                      bezelShape === shape
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {shape === 'round' && dict.shapeRound}
                    {shape === 'oval' && dict.shapeOval}
                    {shape === 'octagon' && dict.shapeOctagon}
                    {shape === 'hexagon' && dict.shapeHexagon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2 & 3: Sacred Alloy & Gemstone */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{dict.step2}</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                  Planète: {metal.planetFr}
                </span>
              </label>
              <select
                value={metal.id}
                onChange={(e) => {
                  const found = METALS.find(m => m.id === e.target.value);
                  if (found) setMetal(found);
                }}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 font-bold text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              >
                {METALS.map(m => (
                  <option key={m.id} value={m.id}>{m.nameFr} — ({m.planetFr})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2">
                {dict.step3}
              </label>
              <select
                value={gemstone.id}
                onChange={(e) => {
                  const found = GEMSTONES.find(g => g.id === e.target.value);
                  if (found) setGemstone(found);
                }}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 font-bold text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              >
                {GEMSTONES.map(g => (
                  <option key={g.id} value={g.id}>{g.nameFr}</option>
                ))}
              </select>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 font-medium">
                ✦ Vertu Spirituelle : {gemstone.spiritualVirtueFr}
              </p>
            </div>
          </div>

          {/* Step 4: Engravings & Sacred Geometry */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {dict.step4}
            </h3>

            {/* Center Motif Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                {dict.centerGeomLabel}
              </label>
              <select
                value={centerGeometry}
                onChange={(e) => setCenterGeometry(e.target.value as CenterGeometry)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 font-bold text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              >
                <option value="sharaf_symbols">{dict.geomSharaf}</option>
                <option value="sulayman_star">{dict.geomSulayman}</option>
                <option value="wafq_3x3">{dict.geomWafq}</option>
                <option value="center_text">{dict.geomText}</option>
                <option value="islamic_star">{dict.geomStar}</option>
                <option value="crescent_star">{dict.geomCrescent}</option>
              </select>
            </div>

            {/* Outer Ring Text */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {dict.outerTextLabel}
              </label>
              <input
                type="text"
                value={outerText}
                onChange={(e) => setOuterText(e.target.value)}
                placeholder="Verset, Asma al-Husna..."
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 text-xs sm:text-sm font-arabic font-bold text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
                dir="rtl"
              />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 block">
                Adad Jummal : <strong className="text-amber-600 dark:text-amber-400">{totalAbjadOuter}</strong>
              </span>
            </div>

            {/* Center Text */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {dict.centerTextLabel}
              </label>
              <input
                type="text"
                value={centerText}
                onChange={(e) => setCenterText(e.target.value)}
                placeholder="Nom Divin, Khadim..."
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 text-xs sm:text-sm font-arabic font-bold text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
                dir="rtl"
              />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 block">
                Adad Jummal : <strong className="text-amber-600 dark:text-amber-400">{totalAbjadCenter}</strong>
              </span>
            </div>

            {/* Secret Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {dict.innerNumLabel}
              </label>
              <input
                type="text"
                value={innerNumber}
                onChange={(e) => setInnerNumber(e.target.value)}
                placeholder="Ex: 111, 786"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 text-xs sm:text-sm font-mono font-bold text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Engraving Location & Mirror Mode */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {dict.engraveSideLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEngravingSide('front')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      engravingSide === 'front'
                        ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {dict.sideFront}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEngravingSide('back')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      engravingSide === 'back'
                        ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {dict.sideBack}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                    {dict.mirrorToggle}
                  </span>
                  <span className="text-[10px] text-amber-700/80 dark:text-amber-300/80 block">
                    Inverse l'écriture pour imprimer le sceau sur cire ou musc
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMirrorMode(!isMirrorMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                    isMirrorMode ? 'bg-amber-600' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                      isMirrorMode ? 'transform translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview Canvas & Astrological Advice */}
        <div className="lg:col-span-6 flex flex-col items-center space-y-6">
          <div
            ref={svgContainerRef}
            className="w-full bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden min-h-[440px]"
          >
            {/* Automatic AsrarHub Watermark Overlay */}
            <AsrarHubWatermark variant="gold" opacity={0.16} showCentralSeal={true} />
            {/* Background subtle star grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

            {/* AsrarHub Watermarks overlay */}
            <div className="absolute top-3 left-4 text-[10px] font-bold tracking-widest text-amber-500/30 pointer-events-none select-none uppercase">
              AsrarHub
            </div>
            <div className="absolute top-3 right-4 text-[10px] font-bold tracking-widest text-amber-500/30 pointer-events-none select-none uppercase">
              AsrarHub
            </div>
            <div className="absolute bottom-3 left-4 text-[10px] font-bold tracking-widest text-amber-500/30 pointer-events-none select-none uppercase">
              AsrarHub
            </div>
            <div className="absolute bottom-3 right-4 text-[10px] font-bold tracking-widest text-amber-500/30 pointer-events-none select-none uppercase">
              AsrarHub
            </div>

            {/* AsrarHub Brand Header Badge */}
            <div className="relative z-10 flex items-center gap-1.5 mb-2 bg-slate-800/90 px-3.5 py-1 rounded-full border border-amber-500/30 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-black tracking-wider text-amber-300 uppercase">AsrarHub</span>
              <span className="text-[10px] text-slate-400 font-semibold">• {talismanType === 'ring' ? 'Khatim Bague' : 'Pendentif'}</span>
              {engravingSide === 'back' && (
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Sous-Pierre
                </span>
              )}
            </div>

            {/* SVG Visual Jewel */}
            <div className={`relative z-10 my-4 transform transition-transform hover:scale-105 ${isMirrorMode ? 'scale-x-[-1]' : ''}`}>
              <svg
                width="280"
                height="320"
                viewBox="0 0 300 320"
                className="drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
              >
                <defs>
                  {/* Metal Gradient */}
                  <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="40%" stopColor={metal.borderColor} />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>

                  {/* Gemstone Radial */}
                  <radialGradient id="gemGrad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor={gemstone.innerGlow} />
                    <stop offset="70%" stopColor={gemstone.colorHex} />
                    <stop offset="100%" stopColor="#000000" />
                  </radialGradient>

                  {/* Circular Text Path */}
                  <path id="circlePath" d="M 150,150 m -110,0 a 110,110 0 1,1 220,0 a 110,110 0 1,1 -220,0" />
                  <path id="ovalPath" d="M 150,150 m -100,0 a 100,120 0 1,1 200,0 a 100,120 0 1,1 -200,0" />
                </defs>

                {/* Outer Bezel by Shape */}
                {bezelShape === 'round' && (
                  <>
                    <circle cx="150" cy="150" r="140" fill="url(#metalGrad)" stroke={metal.borderColor} strokeWidth="4" />
                    <circle cx="150" cy="150" r="120" fill="#090d16" stroke={metal.borderColor} strokeWidth="2" />
                  </>
                )}
                {bezelShape === 'oval' && (
                  <>
                    <ellipse cx="150" cy="150" rx="135" ry="145" fill="url(#metalGrad)" stroke={metal.borderColor} strokeWidth="4" />
                    <ellipse cx="150" cy="150" rx="115" ry="125" fill="#090d16" stroke={metal.borderColor} strokeWidth="2" />
                  </>
                )}
                {bezelShape === 'octagon' && (
                  <>
                    <polygon points="70,20 230,20 280,70 280,230 230,280 70,280 20,230 20,70" fill="url(#metalGrad)" stroke={metal.borderColor} strokeWidth="4" />
                    <polygon points="80,35 220,35 265,80 265,220 220,265 80,265 35,220 35,80" fill="#090d16" stroke={metal.borderColor} strokeWidth="2" />
                  </>
                )}
                {bezelShape === 'hexagon' && (
                  <>
                    <polygon points="150,15 270,80 270,220 150,285 30,220 30,80" fill="url(#metalGrad)" stroke={metal.borderColor} strokeWidth="4" />
                    <polygon points="150,30 255,90 255,210 150,270 45,210 45,90" fill="#090d16" stroke={metal.borderColor} strokeWidth="2" />
                  </>
                )}

                {/* Gemstone Cabochon Overlay */}
                {gemstone.id !== 'none' && (
                  bezelShape === 'round' ? (
                    <circle cx="150" cy="150" r="82" fill="url(#gemGrad)" opacity={engravingSide === 'back' ? 0.6 : 0.88} stroke={metal.borderColor} strokeWidth="2" />
                  ) : bezelShape === 'oval' ? (
                    <ellipse cx="150" cy="150" rx="78" ry="88" fill="url(#gemGrad)" opacity={engravingSide === 'back' ? 0.6 : 0.88} stroke={metal.borderColor} strokeWidth="2" />
                  ) : bezelShape === 'octagon' ? (
                    <polygon points="95,65 205,65 240,100 240,200 205,235 95,235 60,200 60,100" fill="url(#gemGrad)" opacity={engravingSide === 'back' ? 0.6 : 0.88} stroke={metal.borderColor} strokeWidth="2" />
                  ) : (
                    <polygon points="150,60 225,100 225,200 150,240 75,200 75,100" fill="url(#gemGrad)" opacity={engravingSide === 'back' ? 0.6 : 0.88} stroke={metal.borderColor} strokeWidth="2" />
                  )
                )}

                {/* Outer Curved Arabic Text */}
                <text fill={gemstone.id === 'none' ? metal.borderColor : '#f8fafc'} fontSize="13" fontWeight="bold" fontFamily="Amiri, serif">
                  <textPath href={bezelShape === 'round' ? '#circlePath' : '#ovalPath'} startOffset="50%" textAnchor="middle">
                    {outerText}
                  </textPath>
                </text>

                {/* Center Geometry Motif Rendering */}
                {centerGeometry === 'sharaf_symbols' && renderSharafSymbols()}
                {centerGeometry === 'sulayman_star' && renderSulaymanStar()}
                {centerGeometry === 'wafq_3x3' && renderWafq3x3()}
                
                {centerGeometry === 'islamic_star' && (
                  <g transform="translate(150, 150) scale(0.85)">
                    <rect x="-30" y="-30" width="60" height="60" fill="none" stroke={metal.borderColor} strokeWidth="2" />
                    <rect x="-30" y="-30" width="60" height="60" fill="none" stroke={metal.borderColor} strokeWidth="2" transform="rotate(45)" />
                  </g>
                )}

                {centerGeometry === 'crescent_star' && (
                  <g transform="translate(150, 140) scale(0.85)">
                    <path d="M -20,-25 A 25,25 0 1,0 -20,25 A 20,20 0 1,1 -20,-25" fill={metal.borderColor} />
                    <polygon points="10,-10 14,-2 23,-2 16,3 19,12 10,6 2,12 5,3 -2,-2 7,-2" fill={metal.borderColor} />
                  </g>
                )}

                {/* Center Inscription Text */}
                {centerGeometry !== 'sharaf_symbols' && centerGeometry !== 'wafq_3x3' && (
                  <g textAnchor="middle" dominantBaseline="central">
                    <text
                      x="150"
                      y="145"
                      fill="#ffffff"
                      fontSize="17"
                      fontWeight="bold"
                      fontFamily="Amiri, serif"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                    >
                      {centerText}
                    </text>
                  </g>
                )}

                {/* Secret Number at Bottom of Stone */}
                <text
                  x="150"
                  y="205"
                  textAnchor="middle"
                  fill="#f59e0b"
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  [ {innerNumber} ]
                </text>
              </svg>
            </div>

            {/* Summary Metadata Card */}
            <div className="w-full bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 text-xs text-slate-300 space-y-1.5 mt-2">
              <div className="flex justify-between font-bold text-slate-100">
                <span>Métal : {metal.nameFr.split('(')[0]}</span>
                <span>Grand Total : <strong className="text-amber-400">{grandTotal}</strong></span>
              </div>
              <div className="flex justify-between text-[11px] text-amber-300">
                <span>Cabochon : {gemstone.nameFr.split('(')[0]}</span>
                <span>Sertissage : {bezelShape.toUpperCase()}</span>
              </div>
              <div className="truncate text-[11px] text-gray-300" dir="rtl">
                <span className="font-arabic">{outerText}</span>
              </div>
            </div>
          </div>

          {/* Planetary Protocol & Jeweler Directives Box */}
          <div className="w-full bg-amber-50/70 dark:bg-gradient-to-r dark:from-amber-950/30 dark:via-slate-900 dark:to-amber-950/30 border border-amber-200 dark:border-amber-500/30 rounded-3xl p-5 text-stone-800 dark:text-amber-100 space-y-3 shadow-md">
            <h3 className="text-xs font-extrabold text-amber-800 dark:text-amber-300 flex items-center gap-2 uppercase tracking-wider">
              <Flame size={16} className="text-amber-600 dark:text-amber-400" />
              <span>{dict.protocolTitle}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-white dark:bg-black/40 rounded-xl border border-amber-200/80 dark:border-amber-500/20 shadow-xs">
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block">{dict.planetPlanet}</span>
                <span className="font-extrabold text-stone-900 dark:text-white">{metal.planetFr}</span>
              </div>
              <div className="p-2.5 bg-white dark:bg-black/40 rounded-xl border border-amber-200/80 dark:border-amber-500/20 shadow-xs">
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block">{dict.planetDay}</span>
                <span className="font-extrabold text-stone-900 dark:text-white">{metal.dayFr}</span>
              </div>
              <div className="p-2.5 bg-white dark:bg-black/40 rounded-xl border border-amber-200/80 dark:border-amber-500/20 shadow-xs">
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block">{dict.planetIncense}</span>
                <span className="font-extrabold text-amber-800 dark:text-amber-200 truncate block">{metal.incenseFr}</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-700 dark:text-amber-200/80 leading-relaxed bg-white/80 dark:bg-black/30 p-3 rounded-2xl border border-amber-200/80 dark:border-amber-500/20">
              <strong className="text-amber-900 dark:text-amber-300">{dict.jewelerNote}</strong> Effectuer la gravure à l'heure planétaire correspondante. Purifier l'alliage avec l'eau de rose et la fumigation préconisée. {engravingSide === 'back' ? "Graveur en dessous de la gemme pour contact direct avec la peau." : "Ciselure nette en creux sur la face externe."}
            </p>
          </div>

          {/* Export Suite Buttons */}
          <div className="flex flex-wrap gap-2.5 w-full justify-center">
            <button
              type="button"
              onClick={exportAsPng}
              className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Download size={15} />
              {dict.downloadBtn}
            </button>

            <button
              type="button"
              onClick={exportAsPDF}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <FileDown size={15} />
              {dict.downloadPdfBtn}
            </button>

            <button
              type="button"
              onClick={exportAsSVG}
              className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Layers size={15} />
              {dict.downloadSvgBtn}
            </button>

            <button
              type="button"
              onClick={() => setIsCommunityModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Share2 size={15} />
              {dict.shareCommunityBtn}
            </button>

            {!disableDuaCopy && (
              <button
                type="button"
                onClick={copyDetails}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 dark:bg-gray-700 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                {copied ? dict.copied : dict.copyBtn}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Share to Community Modal */}
      <ShareToCommunityModal
        isOpen={isCommunityModalOpen}
        onClose={() => setIsCommunityModalOpen(false)}
        title="Publier votre Talisman de Bague/Pendentif"
        category="talisman"
        itemTitle={`Talisman ${talismanType === 'ring' ? 'Bague' : 'Pendentif'} - ${metal.nameFr}`}
        detailsText={`Sceau sacre en ${metal.nameFr} serti de ${gemstone.nameFr}. Inscription: ${outerText} (Adad total: ${grandTotal}).`}
      />
    </div>
  );
};
