import React, { useState, useRef, useEffect } from 'react';
import { 
  Star, ArrowLeft, Grid, Type, Download, Share2, FileDown, Image, Sparkles, Feather, Key, BookOpen, Crown, Edit3, Check, Compass, Info, Trash2, RefreshCw, Layers, Sliders, Eye, History, ChevronDown, ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { AsrarHubWatermark } from '../../../components/AsrarHubWatermark';
import { KhatimUsageGuide } from '../../../components/KhatimUsageGuide';
import { motion, AnimatePresence } from 'motion/react';
import { calculateAbjadValue } from '../../../utils/abjad';
import { toCanvas, toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';

import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { exportElementToCanvas } from '../../../utils/exportSerializationHelper';
import { notifyDownloadStart, notifyDownloadSuccess, notifyDownloadError } from '../../../utils/downloadNotification';
import { ShareToCommunityModal } from '../../../components/ShareToCommunityModal';
import { CalculationHistoryModal } from '../../../components/CalculationHistoryModal';
import { saveCalculationToHistory } from '../../../utils/calculationHistory';
import { 
  KhatimMethod, 
  KhatimDoor, 
  DAHMOUCH_DOORS, 
  KOUNTIYOU_DOORS, 
  VERSETS_BESOINS_PRESETS, 
  VersetNeedPreset, 
  generateAdvancedKhatim,
  CustomKhatimConfig,
  getBaseHouseMatrix,
  ORDERS_METADATA,
  ARCHANGELS_PRESET,
  QURANIC_TAWQ_PRESETS,
  findMatchingDivineNames,
  calculateRuhaniyyaNames,
  calculateMagicSumsAudit
} from '../../../utils/khatimEngine';
import { asmaListData } from '../../../data/asmaListData';

// Multilingual Dictionary
const khatimI18n = {
  fr: {
    dynamicTitle: "Générateur de Khatim Dynamique & Sceaux",
    subtitle: "Générez des Carrés Magiques Sacrés : Ghazali, Dahmouch (9 Portes), Kountiyou (9 Portes), Versets Coraniques et Khatim Sur-Mesure Personnalisé.",
    bannerTitle: "Générateur Intégré : Dahmouch, Kountiyou, Versets & Khatim Sur-Mesure",
    bannerDesc: "Sélectionnez la méthode rituelle : Ghazali, Dahmouch (9 Portes), Kountiyou (9 Portes), Versets Coraniques ou Création de Khatim Personnalisé Sur-Mesure.",
    methodGhazali: "Ghazali Classique",
    methodGhazaliDesc: "Carré magique standard par répartition équilibrée du Kasr.",
    methodDahmouch: "Dahmouch (دهموش)",
    methodDahmouchDesc: "Méthode sacrée de Dahmouch avec choix des 9 portes d'entrée.",
    methodKountiyou: "Kountiyou (الكنتي)",
    methodKountiyouDesc: "Système Kountiyyou des 9 portes de sagesse et de puissance.",
    methodVerset: "Versets & Besoins",
    methodVersetDesc: "Sceaux tirés des Versets Coraniques sacrés et Besoins rituels.",
    methodCustom: "Khatim Sur-Mesure",
    methodCustomDesc: "Créez votre propre Khatim totalement personnalisé avec cellules éditables.",
    doorSelectLabel: "Sélectionnez la Porte Ritualisée :",
    doorOfNine: (door: number) => `Porte ${door} sur 9`,
    customSectionTitle: "Configuration du Khatim Personnalisé Sur-Mesure :",
    customTitleLabel: "Titre du Khatim (Français / Anglais) :",
    customTitleArLabel: "Titre en Arabe (العنوان بالعربية) :",
    contentTypeLabel: "Type de Contenu des Cases :",
    contentTypeNumbers: "Nombres / Valeurs Numériques",
    contentTypeText: "Texte Arabe / Noms Divins / Lettres",
    gridEditingTitle: "Édition Interactive de la Grille (Saisissez les valeurs de chaque case) :",
    autoMagicBtn: "Remplir Carré Magique Auto",
    autoSeqBtn: "Nombres Consécutifs (1..N²)",
    autoNamesBtn: "Noms Divins (Asma)",
    clearGridBtn: "Effacer la Grille",
    tawqSectionTitle: "Cadre & Inscriptions des 4 Bordures (Tawq) :",
    tawqTopLabel: "Bordure Haute :",
    tawqRightLabel: "Bordure Droite :",
    tawqBottomLabel: "Bordure Basse :",
    tawqLeftLabel: "Bordure Gauche :",
    cornersSectionTitle: "Calligraphie des 4 Coins :",
    cornerTLLabel: "Haut-Gauche :",
    cornerTRLabel: "Haut-Droite :",
    cornerBLLabel: "Bas-Gauche :",
    cornerBRLabel: "Bas-Droite :",
    badgeLabel: "Sous-Titre / Badge de l'En-tête :",
    generateBtn: "GÉNÉRER LE KHATIM SACRÉ",
    exportSectionTitle: "Espace d'Exportation & Téléchargement Haute Définition",
    exportPngHd: "PNG HD",
    exportParchment: "Parchemin",
    exportPngTransp: "PNG Transp.",
    exportSvg: "Vecteur SVG",
    exportPdf: "PDF Imprimable",
    shareLink: "Partager (Lien)",
    publishCommunity: "Publier dans la Communauté",
    intentionTextLabel: "Texte en Arabe (Nom, Intention) ou Nombre Direct :",
    intentionPresetLabel: "Intention / Texte du Verset Sélectionné :",
    calculatedWeight: "Poids Abjad Calculé :",
    dimensionLabel: "Dimension du Sceau (Khatim)",
    errorEmpty: "Veuillez entrer un nombre, un texte en arabe ou sélectionner un verset.",
    errorZeroWeight: "Le poids calculé doit être supérieur à zéro.",
    placeholderInput: "Ex: جلب رزق ou آية الكرسي ou 66",
    shareNotSupported: "Le partage direct n'est pas supporté sur ce navigateur.",
    customDefaultTitleFr: "Khatim Sur-Mesure Sacré",
    customDefaultTitleAr: "خاتم مبارك مخصص",
    customBadgeDefault: "KHATIM SUR-MESURE",
    longNamesTitle: "Ajustement Taille Noms Longs (ex: ذو الجلال والاكرام)",
    longNamesDesc: "Ajustez la taille du texte pour « ذو الجلال والإكرام » et les noms très longs : agrandissez jusqu'à +30% ou réduisez jusqu'à -50% pour un cadrage parfait dans les cases du Khatim.",
    presetEnlargeMax: "+20% (Agrandir)",
    presetEnlargeLight: "+10% (Lég. Agrandir)",
    presetStandard: "0% (Standard)",
    presetRecommended: "-30% (Réduire)",
    presetMax: "-50% (Réduction Max)",
    livePreviewLabel: "Aperçu en Direct dans une Case de Khatim :",
    emptyCenterTitle: "Case Centrale Vide / Bait Al-Khali (الوفق الخالي الجوف)",
    emptyCenterDesc: "Laisse la case du milieu du Khatim vide (بيت الخالي / Wafq Khalawi) pour y inscrire manuellement votre vœu, intention ou nom propre.",
    emptyCenterLabel: "Activer la Case Centrale Vide (Bait Al-Khali)",
    centerCustomTextPlaceholder: "Texte optionnel pour la case centrale (ex: النية / الاسم / الدعاء) ou laisser vide",
  },
  en: {
    dynamicTitle: "Dynamic Khatim & Sacred Seal Generator",
    subtitle: "Generate Sacred Magic Squares: Ghazali, Dahmouch (9 Gates), Kountiyou (9 Gates), Quranic Verses, and Fully Custom Seals.",
    bannerTitle: "Integrated Generator: Dahmouch, Kountiyou, Verses & Custom Khatim",
    bannerDesc: "Select your ritual method: Ghazali, Dahmouch (9 Gates), Kountiyou (9 Gates), Quranic Verses, or Custom Khatim creation.",
    methodGhazali: "Classic Ghazali",
    methodGhazaliDesc: "Standard magic square balanced by Kasr distribution.",
    methodDahmouch: "Dahmouch (دهموش)",
    methodDahmouchDesc: "Sacred Dahmouch system with selection of 9 entrance gates.",
    methodKountiyou: "Kountiyou (الكنتي)",
    methodKountiyouDesc: "Kountiyya system of 9 gates of wisdom and power.",
    methodVerset: "Verses & Needs",
    methodVersetDesc: "Seals derived from Sacred Quranic Verses and Spiritual Needs.",
    methodCustom: "Custom Khatim",
    methodCustomDesc: "Create your own fully customized Khatim with editable cells.",
    doorSelectLabel: "Select Ritualized Gate:",
    doorOfNine: (door: number) => `Gate ${door} of 9`,
    customSectionTitle: "Custom Khatim Configuration:",
    customTitleLabel: "Khatim Title (English / French):",
    customTitleArLabel: "Arabic Title (العنوان بالعربية):",
    contentTypeLabel: "Cell Content Type:",
    contentTypeNumbers: "Numbers / Numeric Values",
    contentTypeText: "Arabic Text / Divine Names / Letters",
    gridEditingTitle: "Interactive Grid Cell Editor (Fill each cell value):",
    autoMagicBtn: "Auto Magic Square Fill",
    autoSeqBtn: "Sequential Numbers (1..N²)",
    autoNamesBtn: "Divine Names (Asma)",
    clearGridBtn: "Clear Grid",
    tawqSectionTitle: "Framing Calligraphy (4 Borders / Tawq):",
    tawqTopLabel: "Top Border:",
    tawqRightLabel: "Right Border:",
    tawqBottomLabel: "Bottom Border:",
    tawqLeftLabel: "Left Border:",
    cornersSectionTitle: "4 Corner Calligraphy:",
    cornerTLLabel: "Top-Left:",
    cornerTRLabel: "Top-Right:",
    cornerBLLabel: "Bottom-Left:",
    cornerBRLabel: "Bottom-Right:",
    badgeLabel: "Header Subtitle / Badge:",
    generateBtn: "GENERATE SACRED KHATIM",
    exportSectionTitle: "High-Definition Export & Download Space",
    exportPngHd: "HD PNG",
    exportParchment: "Parchment",
    exportPngTransp: "Transparent PNG",
    exportSvg: "SVG Vector",
    exportPdf: "Printable PDF",
    shareLink: "Share (Link)",
    publishCommunity: "Publish to Community",
    intentionTextLabel: "Arabic Text (Name, Intention) or Direct Number:",
    intentionPresetLabel: "Selected Verse / Intention Text:",
    calculatedWeight: "Calculated Abjad Weight:",
    dimensionLabel: "Seal Dimension (Khatim)",
    errorEmpty: "Please enter a number, Arabic text, or select a verse.",
    errorZeroWeight: "The calculated weight must be greater than zero.",
    placeholderInput: "Ex: جلب رزق or Ayat Al-Kursi or 66",
    shareNotSupported: "Direct sharing is not supported on this browser.",
    customDefaultTitleFr: "Sacred Custom Khatim",
    customDefaultTitleAr: "خاتم مبارك مخصص",
    customBadgeDefault: "CUSTOM KHATIM",
    longNamesTitle: "Long Names Size Adjustment (e.g. ذو الجلال والاكرام)",
    longNamesDesc: "Adjust text size for 'ذو الجلال والإكرام' and long names: enlarge up to +30% or reduce down to -50% for a perfect fit inside cells.",
    presetEnlargeMax: "+20% (Enlarge)",
    presetEnlargeLight: "+10% (Slight Enlarge)",
    presetStandard: "0% (Standard)",
    presetRecommended: "-30% (Reduce)",
    presetMax: "-50% (Max Reduction)",
    livePreviewLabel: "Live Preview in a Khatim Cell:",
    emptyCenterTitle: "Empty Center Cell / Bait Al-Khali (الوفق الخالي الجوف)",
    emptyCenterDesc: "Leaves the middle cell of the Khatim empty (بيت الخالي / Wafq Khalawi) to manually write your wish, intention, or name.",
    emptyCenterLabel: "Enable Empty Center Cell (Bait Al-Khali)",
    centerCustomTextPlaceholder: "Optional text for center cell (ex: Intention / Name / Prayer) or leave blank",
  },
  ha: {
    dynamicTitle: "Mai Hada Khatim & Hatimai na Asirru",
    subtitle: "Hada Murabba'an Asirru: Ghazali, Dahmouch (Ƙofofi 9), Kountiyou (Ƙofofi 9), Ayoyin Al-Qur'ani da Khatim Na Musamman.",
    bannerTitle: "Kayan Hada Khatim: Dahmouch, Kountiyou, Ayoyi da Khatim Na Musamman",
    bannerDesc: "Zaɓi hanyar da kake buƙata: Ghazali, Dahmouch (Ƙofofi 9), Kountiyou (Ƙofofi 9), Ayoyi ko Khatim na Musamman.",
    methodGhazali: "Ghazali Na Asali",
    methodGhazaliDesc: "Daidaitaccen murabba'i ta hanyar rarraba Kasr.",
    methodDahmouch: "Dahmouch (دهموش)",
    methodDahmouchDesc: "Hanyar asirrin Dahmouch tare da zaɓin ƙofofi 9.",
    methodKountiyou: "Kountiyou (الكنتي)",
    methodKountiyouDesc: "Tsarin Kountiyya na ƙofofi 9 na hikima da ƙarfi.",
    methodVerset: "Ayoyi & Buƙatu",
    methodVersetDesc: "Hatimai daga Ayoyin Qur'ani da buƙatu na ruhaniyya.",
    methodCustom: "Khatim Na Musamman",
    methodCustomDesc: "Ƙirƙiri naka Khatim na musamman mai gyaran gidaje.",
    doorSelectLabel: "Zaɓi Ƙofa:",
    doorOfNine: (door: number) => `Ƙofa ${door} cikin 9`,
    customSectionTitle: "Saita Khatim Na Musamman:",
    customTitleLabel: "Suna Khatim:",
    customTitleArLabel: "Suna da Larabci:",
    contentTypeLabel: "Nau'in Abun Ciki:",
    contentTypeNumbers: "Lambobi",
    contentTypeText: "Rubutun Larabci / Asma'u",
    gridEditingTitle: "Cika Gidajen Murabba'i:",
    autoMagicBtn: "Cika Murabba'i na Asirru",
    autoSeqBtn: "Cika bi da bi (1..N²)",
    autoNamesBtn: "Cika Asma'ul Husna",
    clearGridBtn: "Goge Gidaje",
    tawqSectionTitle: "Katanga & Rubutu kewayawa (Tawq):",
    tawqTopLabel: "Rubutun Sama:",
    tawqRightLabel: "Rubutun Dama:",
    tawqBottomLabel: "Rubutun Ƙasa:",
    tawqLeftLabel: "Rubutun Hagu:",
    cornersSectionTitle: "Rubutun Harsuna 4:",
    cornerTLLabel: "Sama-Hagu:",
    cornerTRLabel: "Sama-Dama:",
    cornerBLLabel: "Ƙasa-Hagu:",
    cornerBRLabel: "Ƙasa-Dama:",
    badgeLabel: "Sauran Suna / Badge:",
    generateBtn: "HADA KHATIM",
    exportSectionTitle: "Guraren Sakewa & Zazzagewa",
    exportPngHd: "PNG HD",
    exportParchment: "Takardar Parchemin",
    exportPngTransp: "PNG Mai Haske",
    exportSvg: "SVG Vector",
    exportPdf: "PDF na Buga",
    shareLink: "Raba Hada",
    publishCommunity: "Buga a Al'umma",
    intentionTextLabel: "Larabci ko Lamba:",
    intentionPresetLabel: "Ayah ko Niyya da aka zaɓa:",
    calculatedWeight: "Adad Abjad:",
    dimensionLabel: "Girma (Khatim)",
    errorEmpty: "Shigar da lamba, rubutun Larabci, ko zaɓi aya.",
    errorZeroWeight: "Adad yana buƙatar ya fi zeru girma.",
    placeholderInput: "Misali: جلب رزق ko Ayat Al-Kursi ko 66",
    shareNotSupported: "Aikin raba bai samuwa a wannan mai bincike ba.",
    customDefaultTitleFr: "Khatim Na Musamman",
    customDefaultTitleAr: "خاتم مبارك مخصص",
    customBadgeDefault: "KHATIM NA MUSAMMAN",
    longNamesTitle: "Daidaita Girman Suna Mai Tsawon Gaske (misali: ذو الجلال والاكرام)",
    longNamesDesc: "Daidaita girman rubutun 'ذو الجلال والإكرام' da dogayen sunaye: girmama har +30% ko rage har -50% don su zauna sosai a cikin gidajen Khatim.",
    presetEnlargeMax: "+20% (Girmama)",
    presetEnlargeLight: "+10% (Girmama Kadan)",
    presetStandard: "0% (A'ada)",
    presetRecommended: "-30% (Ragi)",
    presetMax: "-50% (Ragi Mafi Yawa)",
    livePreviewLabel: "Bayanin Gwaji na Kai Tsaye a Gidan Khatim:",
    emptyCenterTitle: "Gidan Tsakiya Wofi / Bait Al-Khali (الوفق الخالي الجوف)",
    emptyCenterDesc: "Barin gidan tsakiyar Khatim wofi (بيت الخالي / Wafq Khalawi) don rubuta buƙata, suna, ko niyya da hannu.",
    emptyCenterLabel: "Raza Gidan Tsakiya Wofi (Bait Al-Khali)",
    centerCustomTextPlaceholder: "Rubutun zaɓi na gidan tsakiya (misali: Niyya / Suna) ko barin shi wofi",
  }
};

import { KasrMathBreakdown } from '../../../components/khatim/KasrMathBreakdown';
import { SacredFramingControls } from '../../../components/khatim/SacredFramingControls';
import { WritingPathPlayer } from '../../../components/khatim/WritingPathPlayer';

const DIVINE_NAMES_PRESETS = asmaListData.map((item) => item.ar);

export const KhatimGenerator: React.FC = () => {
  const { language } = useLanguage();
  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const i18n = khatimI18n[langKey] || khatimI18n.fr;

  // Creation States
  const [method, setMethod] = useState<KhatimMethod>('ghazali');
  const [selectedDoor, setSelectedDoor] = useState<number>(1); // 1 to 9
  const [selectedPreset, setSelectedPreset] = useState<VersetNeedPreset | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const [inputText, setInputText] = useState('');
  const [gridSize, setGridSize] = useState<number>(3);
  const [grid, setGrid] = useState<(number | string)[][] | null>(null);
  const [housesGrid, setHousesGrid] = useState<number[][] | null>(null);
  const [activeDoorInfo, setActiveDoorInfo] = useState<KhatimDoor | null>(null);
  const [tawqFrame, setTawqFrame] = useState<string[]>([]);
  const [cornerCalligraphy, setCornerCalligraphy] = useState({
    topLeft: '﷽',
    topRight: 'الله',
    bottomLeft: 'محمد',
    bottomRight: 'علي',
  });
  const [activeBadge, setActiveBadge] = useState<string>('');

  // Custom Khatim Mode State
  const [customTitleFr, setCustomTitleFr] = useState(i18n.customDefaultTitleFr);
  const [customTitleAr, setCustomTitleAr] = useState(i18n.customDefaultTitleAr);
  const [customContentType, setCustomContentType] = useState<'numbers' | 'text'>('numbers');
  const [customNumericGrid, setCustomNumericGrid] = useState<number[][]>(() => 
    Array.from({ length: 3 }, (_, r) => Array.from({ length: 3 }, (_, c) => r * 3 + c + 1))
  );
  const [customTextGrid, setCustomTextGrid] = useState<string[][]>(() => {
    const baseHouses = getBaseHouseMatrix(3);
    return Array.from({ length: 3 }, (_, r) => 
      Array.from({ length: 3 }, (_, c) => DIVINE_NAMES_PRESETS[(baseHouses[r][c] - 1) % DIVINE_NAMES_PRESETS.length])
    );
  });
  const [customTawqTop, setCustomTawqTop] = useState('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
  const [customTawqRight, setCustomTawqRight] = useState('فَتْحٌ وَنَصْرٌ مِنَ اللَّهِ');
  const [customTawqBottom, setCustomTawqBottom] = useState('سَلاَمٌ قَوْلاً مِنْ رَبٍّ رَحِيمٍ');
  const [customTawqLeft, setCustomTawqLeft] = useState('حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ');
  const [customCornerTL, setCustomCornerTL] = useState('﷽');
  const [customCornerTR, setCustomCornerTR] = useState('الله');
  const [customCornerBL, setCustomCornerBL] = useState('محمد');
  const [customCornerBR, setCustomCornerBR] = useState('علي');
  const [customBadgeInput, setCustomBadgeInput] = useState(i18n.customBadgeDefault);

  const [error, setError] = useState<string | null>(null);
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [exportTheme, setExportTheme] = useState<'dark' | 'parchment' | 'emerald' | 'circular' | 'white'>('dark');
  
  // Mathematical Kasr Breakdown & Audit State
  const [kasrBreakdown, setKasrBreakdown] = useState<{
    step: number;
    remainder: number;
    kasrHouse: number;
    minRequired: number;
    magicAudit: any;
  } | null>(null);

  // Ritual Writing Sequence Step-by-Step Player
  const [activeWritingStep, setActiveWritingStep] = useState<number>(0);

  // Bait Al-Khali (Empty center cell option)
  const [isCenterEmpty, setIsCenterEmpty] = useState<boolean>(false);
  const [centerCustomText, setCenterCustomText] = useState<string>('');
  const [isCenterEmptyCardOpen, setIsCenterEmptyCardOpen] = useState<boolean>(false);

  // Tawq framing borders option (enable / disable)
  const [isTawqEnabled, setIsTawqEnabled] = useState<boolean>(true);

  // Long names adjustment card collapse state (closed by default)
  const [isLongNamesCardOpen, setIsLongNamesCardOpen] = useState<boolean>(false);

  // Helper to override center cell when Bait Al-Khali is active
  const applyCenterCellOverride = (
    rawGrid: (number | string)[][] | null,
    isEmpty: boolean,
    customTxt: string,
    n: number
  ): (number | string)[][] | null => {
    if (!rawGrid) return null;
    if (!isEmpty) return rawGrid;
    const gridCopy = rawGrid.map((row) => [...row]);
    const val = customTxt.trim();
    if (n % 2 !== 0) {
      const centerIdx = Math.floor(n / 2);
      gridCopy[centerIdx][centerIdx] = val;
    } else {
      const mid1 = n / 2 - 1;
      const mid2 = n / 2;
      gridCopy[mid1][mid1] = val;
      gridCopy[mid1][mid2] = val;
      gridCopy[mid2][mid1] = val;
      gridCopy[mid2][mid2] = val;
    }
    return gridCopy;
  };

  // Font reduction control for long names (0% to 50% reduction)
  const [longNamesReduction, setLongNamesReduction] = useState<number>(() => {
    const saved = localStorage.getItem('asrar_khatim_long_names_reduction');
    return saved !== null ? Number(saved) : 30;
  });

  const handleLongNamesReductionChange = (val: number) => {
    const clamped = Math.max(-30, Math.min(50, val));
    setLongNamesReduction(clamped);
    localStorage.setItem('asrar_khatim_long_names_reduction', String(clamped));
  };

  const resultRef = useRef<HTMLDivElement>(null);

  // Helper to split multi-word Arabic names onto individual lines inside grid cells
  const renderFormattedCellValue = (val: string | number) => {
    if (typeof val !== 'string') return val;
    const str = val.trim();
    if (!str) return '';
    if (str.includes(' ')) {
      const words = str.split(/\s+/);
      if (words.length >= 2) {
        return words.join('\n');
      }
    }
    return str;
  };

  // Responsive dynamic text styling for Khatim cells (reduced by 3px for text names)
  const getCellTextStyle = (val: number | string, size: number) => {
    if (typeof val === 'number') {
      const str = val.toString();
      if (size <= 3) return str.length > 6 ? 'text-xs sm:text-sm' : 'text-base sm:text-lg';
      if (size <= 4) return str.length > 6 ? 'text-[10px] sm:text-xs' : 'text-sm sm:text-base';
      if (size <= 5) return str.length > 6 ? 'text-[8px] sm:text-[9px]' : 'text-xs sm:text-sm';
      if (size <= 6) return 'text-[9px] sm:text-[10px]';
      if (size <= 8) return str.length > 6 ? 'text-[6px] sm:text-[7px]' : 'text-[7px] sm:text-[8px]';
      if (size === 9) return str.length > 5 ? 'text-[4.5px] sm:text-[5.5px]' : 'text-[5.5px] sm:text-[6.5px]';
      return str.length > 6 ? 'text-[3.5px] sm:text-[4.5px]' : str.length > 4 ? 'text-[4.5px] sm:text-[5.5px]' : 'text-[5px] sm:text-[6px]';
    }

    const strVal = (val || '').toString().trim();
    const len = strVal.length;
    // Reduced by another ~5px so long names like ذو الجلال والإكرام fit completely without overflow
    if (size <= 3) {
      if (len > 15) return 'text-[2.5px] sm:text-[3.2px]';
      if (len > 10) return 'text-[3.2px] sm:text-[4px]';
      if (len > 6)  return 'text-[4px] sm:text-[5px]';
      if (len >= 4) return 'text-[5px] sm:text-[6px]';
      return 'text-[6px] sm:text-[7.5px]';
    }
    if (size <= 4) {
      if (len > 15) return 'text-[2px] sm:text-[2.5px]';
      if (len > 10) return 'text-[2.5px] sm:text-[3.2px]';
      if (len > 6)  return 'text-[3.2px] sm:text-[4px]';
      if (len >= 4) return 'text-[4px] sm:text-[5px]';
      return 'text-[5px] sm:text-[6px]';
    }
    if (size <= 5) {
      if (len > 15) return 'text-[1.8px] sm:text-[2.2px]';
      if (len > 10) return 'text-[2.2px] sm:text-[2.8px]';
      if (len > 6)  return 'text-[2.8px] sm:text-[3.5px]';
      return 'text-[3.5px] sm:text-[4.5px]';
    }
    if (size <= 6) {
      if (len > 12) return 'text-[1.5px] sm:text-[1.8px]';
      if (len > 8)  return 'text-[1.8px] sm:text-[2.2px]';
      if (len >= 5) return 'text-[2.2px] sm:text-[2.8px]';
      return 'text-[2.8px] sm:text-[3.5px]';
    }
    if (size <= 7) {
      if (len > 10) return 'text-[1.2px] sm:text-[1.5px]';
      if (len >= 5) return 'text-[1.5px] sm:text-[1.8px]';
      return 'text-[2px] sm:text-[2.5px]';
    }
    if (size <= 8) {
      if (len > 12) return 'text-[1px] sm:text-[1.3px]';
      if (len >= 5) return 'text-[1.3px] sm:text-[1.6px]';
      return 'text-[1.8px] sm:text-[2.2px]';
    }
    if (size === 9) {
      if (len > 12) return 'text-[1px] sm:text-[1.2px]';
      if (len > 8)  return 'text-[1.2px] sm:text-[1.5px]';
      return 'text-[1.5px] sm:text-[1.8px]';
    }
    // Size 10
    if (len > 12) return 'text-[1px] sm:text-[1.2px] md:text-[1.4px]';
    if (len > 8)  return 'text-[1.2px] sm:text-[1.4px] md:text-[1.6px]';
    if (len >= 5) return 'text-[1.4px] sm:text-[1.6px] md:text-[1.8px]';
    return 'text-[1.6px] sm:text-[1.8px] md:text-[2px]';
  };

  // Inline style calculator for cell font-size, line-height & transform scale to strictly contain long names
  const getCellInlineStyle = (val: number | string, size: number): React.CSSProperties => {
    if (typeof val !== 'string') return {};
    const raw = val.trim();
    if (!raw) return {};

    // Remove diacritics/tashkeel to ensure 100% detection of "ذو الجلال والاكرام" and all variants
    const normalized = raw
      .replace(/[\u064B-\u065F\u0670\u0671]/g, '')
      .replace(/[أإآ]/g, 'ا')
      .toLowerCase();

    const len = normalized.length;

    // Detect ultra-long names like "ذو الجلال والإكرام", "مالك الملك", or strings with len >= 12
    const isUltraLongName = 
      normalized.includes('جلال') || 
      normalized.includes('اكرام') || 
      normalized.includes('ملك الملك') || 
      len >= 12;

    // Apply scale reduction factor based on longNamesReduction setting (0 to 50% reduction)
    const userReductionFactor = 1 - (longNamesReduction / 100);

    let baseScale = 1.0;
    let lineHeight = '1.0';

    if (size >= 9) { // 9x9, 10x10
      if (isUltraLongName) {
        baseScale = 0.52 * userReductionFactor;
        lineHeight = '0.80';
      } else if (len > 10) {
        baseScale = 0.65 * (1 - (longNamesReduction * 0.5) / 100);
        lineHeight = '0.85';
      } else if (len > 6) {
        baseScale = 0.80;
        lineHeight = '0.90';
      } else {
        baseScale = 1.0;
      }
    } else if (size >= 7) { // 7x7, 8x8
      if (isUltraLongName) {
        baseScale = 0.60 * userReductionFactor;
        lineHeight = '0.82';
      } else if (len > 10) {
        baseScale = 0.75 * (1 - (longNamesReduction * 0.5) / 100);
        lineHeight = '0.88';
      } else if (len > 6) {
        baseScale = 0.88;
        lineHeight = '0.92';
      } else {
        baseScale = 1.0;
      }
    } else if (size >= 5) { // 5x5, 6x6
      if (isUltraLongName) {
        baseScale = 0.70 * userReductionFactor;
        lineHeight = '0.85';
      } else if (len > 10) {
        baseScale = 0.82 * (1 - (longNamesReduction * 0.5) / 100);
        lineHeight = '0.90';
      } else if (len > 6) {
        baseScale = 0.92;
        lineHeight = '0.95';
      } else {
        baseScale = 1.0;
      }
    } else { // size <= 4 (3x3, 4x4)
      if (isUltraLongName) {
        baseScale = 0.80 * userReductionFactor;
        lineHeight = '0.88';
      } else if (len > 10) {
        baseScale = 0.90 * (1 - (longNamesReduction * 0.5) / 100);
        lineHeight = '0.92';
      } else {
        baseScale = 1.0;
      }
    }

    const finalScale = Math.max(0.18, baseScale);

    return {
      fontSize: '11px',
      lineHeight,
      padding: '0px',
      margin: '0px',
      transform: `scale(${finalScale.toFixed(3)})`,
      transformOrigin: 'center center',
      display: 'inline-block',
      maxWidth: '100%',
      whiteSpace: 'pre-line',
      wordBreak: 'break-word',
      ...(isUltraLongName ? { letterSpacing: '-0.03em' } : {})
    };
  };

  // Resize custom grids when gridSize changes
  useEffect(() => {
    setCustomNumericGrid((prev) => {
      const newG = Array.from({ length: gridSize }, (_, r) =>
        Array.from({ length: gridSize }, (_, c) => prev[r]?.[c] ?? (r * gridSize + c + 1))
      );
      return newG;
    });

    setCustomTextGrid((prev) => {
      const baseHouses = getBaseHouseMatrix(gridSize);
      const newG = Array.from({ length: gridSize }, (_, r) =>
        Array.from({ length: gridSize }, (_, c) => prev[r]?.[c] ?? DIVINE_NAMES_PRESETS[(baseHouses[r][c] - 1) % DIVINE_NAMES_PRESETS.length])
      );
      return newG;
    });
  }, [gridSize]);

  // Apply a preset from Versets / Besoins
  const handleSelectPreset = (preset: VersetNeedPreset) => {
    setSelectedPreset(preset);
    setInputText(preset.textAr);
    setGridSize(preset.recommendedSize);
  };

  // Custom Grid Actions
  const handleCellNumericChange = (r: number, c: number, val: string) => {
    const num = parseInt(val, 10) || 0;
    setCustomNumericGrid((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[r][c] = num;
      return copy;
    });
  };

  const handleCellTextChange = (r: number, c: number, val: string) => {
    setCustomTextGrid((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[r][c] = val;
      return copy;
    });
  };

  const handleAutoMagicSquareFill = () => {
    const n = gridSize;
    const stdSum = (n * (n * n + 1)) / 2;
    const weight = Math.max(stdSum, calculatedTotal || 786);
    const baseDiff = weight - stdSum;
    const step = Math.floor(baseDiff / n);
    const remainder = baseDiff % n;
    const baseHouses = getBaseHouseMatrix(n);

    const kasrHouseMap: Record<number, number> = { 3: 7, 4: 13, 5: 21, 6: 31, 7: 43, 8: 57, 9: 73, 10: 91 };
    const kasrHouse = kasrHouseMap[n] || (n * n - n);

    const filled = Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => {
        const houseVal = baseHouses[r][c];
        let val = houseVal + step * houseVal;
        if (houseVal >= kasrHouse) val += remainder;
        return val;
      })
    );
    setCustomNumericGrid(filled);
  };

  const handleSequentialFill = () => {
    const n = gridSize;
    const filled = Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => r * n + c + 1)
    );
    setCustomNumericGrid(filled);
  };

  const handleNamesFill = () => {
    const n = gridSize;
    const baseHouses = getBaseHouseMatrix(n);
    const filled = Array.from({ length: n }, () => Array(n).fill(''));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const houseNum = baseHouses[r][c];
        const nameIndex = (houseNum - 1) % DIVINE_NAMES_PRESETS.length;
        filled[r][c] = DIVINE_NAMES_PRESETS[nameIndex];
      }
    }
    setCustomTextGrid(filled);
  };

  const handleClearCustomGrid = () => {
    const n = gridSize;
    setCustomNumericGrid(Array.from({ length: n }, () => Array(n).fill(0)));
    setCustomTextGrid(Array.from({ length: n }, () => Array(n).fill('')));
  };

  // Export handlers
  const downloadImage = async () => {
    if (!resultRef.current) return;
    const fname = `khatim-${method}-porte${selectedDoor}-${gridSize}x${gridSize}.png`;
    notifyDownloadStart(fname);
    try {
      const bgColor = exportTheme === 'parchment' ? '#fef3c7' : '#18181b';
      const canvas = await exportElementToCanvas(resultRef.current, bgColor, {
        pixelRatio: 2.5,
        quality: 0.98,
      });
      await downloadCanvasImage(canvas, fname);
      notifyDownloadSuccess(fname);
    } catch (e) {
      console.error('Error generating canvas image:', e);
      notifyDownloadError(fname);
    }
  };

  const downloadParchmentPNG = async () => {
    if (!resultRef.current) return;
    const fname = `khatim-${method}-parchemin-${gridSize}x${gridSize}.png`;
    notifyDownloadStart(fname);
    const prevTheme = exportTheme;
    setExportTheme('parchment');
    try {
      // Ensure layout and font rendering complete after theme state update
      await new Promise(r => setTimeout(r, 120));
      if (!resultRef.current) return;
      const canvas = await exportElementToCanvas(resultRef.current, '#fef3c7', {
        pixelRatio: 2.5,
        quality: 0.98,
      });
      await downloadCanvasImage(canvas, fname, true);
      notifyDownloadSuccess(fname);
    } catch (e) {
      console.error('Error generating parchment image:', e);
      notifyDownloadError(fname);
    } finally {
      if (prevTheme !== 'parchment') {
        setExportTheme(prevTheme);
      }
    }
  };

  const downloadTransparentPNG = async () => {
    if (!resultRef.current) return;
    const fname = `khatim-${method}-${gridSize}x${gridSize}-transparent.png`;
    notifyDownloadStart(fname);
    try {
      const url = await toPng(resultRef.current, { 
        backgroundColor: null,
        pixelRatio: 2,
        quality: 0.98,
        cacheBust: true,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          border: 'none',
        }
      });
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

  const downloadSVG = async () => {
    if (!resultRef.current) return;
    const fname = `khatim-${method}-${gridSize}x${gridSize}.svg`;
    notifyDownloadStart(fname);
    try {
      const url = await toSvg(resultRef.current, {
        backgroundColor: null,
        skipFonts: true,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          border: 'none',
        }
      });
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

  const downloadPDF = async () => {
    if (!resultRef.current) return;
    const fname = `AsrarHub_Khatim_${method}_${gridSize}x${gridSize}_${calculatedTotal}.pdf`;
    notifyDownloadStart(fname);
    try {
      const canvas = await toCanvas(resultRef.current, { backgroundColor: '#18181b', skipFonts: true });
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
      pdf.setFontSize(22);
      pdf.text("AsrarHub - Khatim Sacre", 105, 30, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Methode: ${method.toUpperCase()} | Taille: ${gridSize}x${gridSize}`, 105, 42, { align: 'center' });
      pdf.text(`Poids Mystique (Adad Jummal): ${calculatedTotal}`, 105, 50, { align: 'center' });

      const imgWidth = 120;
      const imgHeight = 120;
      const x = (210 - imgWidth) / 2;
      const y = 65;
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text("Inscrivez ce Khatim sacre avec de l'encre de safran et de l'eau de rose", 105, 205, { align: 'center' });
      pdf.text("lors de l'heure planetaire correspondante a votre intention.", 105, 211, { align: 'center' });
      
      pdf.setFontSize(8);
      pdf.text("Genere via AsrarHub. Tous droits reserves.", 105, 280, { align: 'center' });
      
      pdf.save(fname);
      notifyDownloadSuccess(fname);
    } catch (e) {
      console.error(e);
      notifyDownloadError(fname);
    }
  };

  const shareResult = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await toCanvas(resultRef.current, { backgroundColor: '#18181b', skipFonts: true });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `khatim-${method}-${gridSize}x${gridSize}.png`, { type: 'image/png' });
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: i18n.dynamicTitle,
            text: `Khatim ${method.toUpperCase()} (${calculatedTotal})`,
            files: [file]
          });
        } else {
          alert(i18n.shareNotSupported);
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const generateKhatim = () => {
    setError(null);
    try {
      if (method === 'custom') {
        const customConfig: CustomKhatimConfig = {
          titleFr: customTitleFr,
          titleEn: customTitleFr,
          titleAr: customTitleAr,
          gridSize,
          contentType: customContentType,
          numericGrid: customNumericGrid,
          textGrid: customTextGrid,
          tawqTop: customTawqTop,
          tawqRight: customTawqRight,
          tawqBottom: customTawqBottom,
          tawqLeft: customTawqLeft,
          cornerTopLeft: customCornerTL,
          cornerTopRight: customCornerTR,
          cornerBottomLeft: customCornerBL,
          cornerBottomRight: customCornerBR,
          badgeLabel: customBadgeInput,
        };

        let total = 0;
        if (customContentType === 'numbers') {
          total = customNumericGrid.flat().reduce((acc, curr) => acc + curr, 0);
        } else {
          total = customTextGrid.flat().reduce((acc, curr) => acc + calculateAbjadValue(curr), 0);
        }
        setCalculatedTotal(total);

        const res = generateAdvancedKhatim('custom', 1, gridSize, total, '', customConfig);
        const finalGrid = applyCenterCellOverride(res.grid, isCenterEmpty, centerCustomText, gridSize);
        setGrid(finalGrid);
        setHousesGrid(res.housesGrid);
        setActiveDoorInfo(null);
        setTawqFrame(res.tawqFrameText);
        setCornerCalligraphy(res.cornerTexts);
        setActiveBadge(res.customBadge || 'KHATIM SUR-MESURE');
        return;
      }

      let weight = 0;
      if (method === 'verset_besoin' && selectedPreset) {
        weight = selectedPreset.abjadValue;
      } else if (/^\d+$/.test(inputText.trim())) {
        weight = parseInt(inputText.trim(), 10);
      } else if (inputText.trim()) {
        weight = calculateAbjadValue(inputText);
      } else {
        throw new Error(i18n.errorEmpty);
      }

      if (weight <= 0) throw new Error(i18n.errorZeroWeight);

      setCalculatedTotal(weight);
      
      saveCalculationToHistory({
        toolId: 'khatim',
        toolName: 'Générateur de Khatim & Wafq',
        title: inputText.trim() || (selectedPreset ? selectedPreset.titleFr : 'Khatim Wafq'),
        summary: `Grille ${gridSize}x${gridSize} | Poids Mystique: ${weight} | Méthode: ${method}`,
        details: { inputText: inputText.trim(), weight, gridSize, method, selectedPresetId: selectedPreset?.id },
        tags: ['Khatim', 'Wafq', `${gridSize}x${gridSize}`]
      });

      let stats; try { stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}'); if (!stats || typeof stats !== 'object') stats = {}; } catch(e) { stats = {}; }
      stats.tools_used = (stats.tools_used || 0) + 1;
      localStorage.setItem('asrar_stats', JSON.stringify(stats));

      const versetTawq = selectedPreset ? selectedPreset.textAr : inputText;
      const customConfig: CustomKhatimConfig = {
        titleFr: customTitleFr,
        titleEn: customTitleFr,
        titleAr: customTitleAr,
        gridSize,
        contentType: customContentType,
        numericGrid: customNumericGrid,
        textGrid: customTextGrid,
        tawqTop: customTawqTop,
        tawqRight: customTawqRight,
        tawqBottom: customTawqBottom,
        tawqLeft: customTawqLeft,
        cornerTopLeft: customCornerTL,
        cornerTopRight: customCornerTR,
        cornerBottomLeft: customCornerBL,
        cornerBottomRight: customCornerBR,
        badgeLabel: customBadgeInput,
      };
      const res = generateAdvancedKhatim(method, selectedDoor, gridSize, weight, versetTawq, customConfig);
      
      const finalGrid = applyCenterCellOverride(res.grid, isCenterEmpty, centerCustomText, gridSize);
      setGrid(finalGrid);
      setHousesGrid(res.housesGrid);
      setActiveDoorInfo(res.doorInfo || null);
      setTawqFrame(res.tawqFrameText);
      setCornerCalligraphy(res.cornerTexts);
      setActiveBadge(`ASRARHUB • KHATIM ${method.toUpperCase()}`);

      // Compute mathematical Kasr & audit breakdown
      const orderMeta = ORDERS_METADATA[gridSize] || {
        baseAsas: Math.floor((gridSize * (gridSize * gridSize - 1)) / 2),
        minMagicSum: Math.floor((gridSize * (gridSize * gridSize + 1)) / 2),
      };
      const baseAsas = orderMeta.baseAsas;
      const delta = weight - baseAsas;
      const step = Math.floor(delta / gridSize);
      const remainder = ((delta % gridSize) + gridSize) % gridSize;
      const kasrHouse = gridSize === 3 ? 7 : gridSize === 4 ? 13 : gridSize === 5 ? 21 : gridSize === 6 ? 31 : gridSize === 7 ? 43 : gridSize === 8 ? 57 : gridSize === 9 ? 73 : Math.floor(gridSize * gridSize * 0.85);

      const audit = calculateMagicSumsAudit(finalGrid);
      setKasrBreakdown({
        step,
        remainder,
        kasrHouse,
        minRequired: orderMeta.minMagicSum,
        magicAudit: audit,
      });
      setActiveWritingStep(0);

    } catch (err: any) {
      setError(err.message);
      setGrid(null);
      setHousesGrid(null);
      setKasrBreakdown(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, bounce: 0.5 } }
  };

  const getCellRadiusClass = (size: number) => {
    if (size <= 4) return 'rounded-xl';
    if (size <= 6) return 'rounded-lg';
    if (size <= 8) return 'rounded-md';
    return 'rounded-sm';
  };

  const getGridMinWidthClass = (size: number) => {
    return 'w-full max-w-full';
  };

  const gridGapClassMap: Record<number, string> = {
    3: 'gap-2 sm:gap-3',
    4: 'gap-2 sm:gap-2.5',
    5: 'gap-1.5 sm:gap-2',
    6: 'gap-1.5 sm:gap-2',
    7: 'gap-1 sm:gap-1.5',
    8: 'gap-0.5 sm:gap-1',
    9: 'gap-[1px] sm:gap-0.5',
    10: 'gap-[1px] sm:gap-[2px]',
    11: 'gap-[1px] sm:gap-[1px]',
    12: 'gap-[1px] sm:gap-[1px]',
  };

  const gridColsClassMap: Record<number, string> = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12',
  };

  const textPercentSizeMap: Record<number, string> = {
    3: 'text-2xl sm:text-3xl',
    4: 'text-xl sm:text-2xl',
    5: 'text-lg sm:text-xl',
    6: 'text-base sm:text-lg',
    7: 'text-xs sm:text-sm',
    8: 'text-[11px] sm:text-xs',
    9: 'text-[9px] sm:text-[11px]',
    10: 'text-[8px] sm:text-[10px]',
    11: 'text-[7px] sm:text-[9px]',
    12: 'text-[6px] sm:text-[8px]',
  };

  const gridCellPaddingMap: Record<number, string> = {
    3: 'p-2 sm:p-4 aspect-square',
    4: 'p-2 sm:p-3 aspect-square',
    5: 'p-1.5 sm:p-2.5 aspect-square',
    6: 'p-1 sm:p-2 aspect-square',
    7: 'p-0.5 sm:p-1 aspect-square',
    8: 'p-0.5 sm:p-1 aspect-square',
    9: 'p-[1px] sm:p-0.5 aspect-square',
    10: 'p-0 sm:p-[1px] aspect-square',
    11: 'p-0 sm:p-[1px] aspect-square',
    12: 'p-0 sm:p-[1px] aspect-square',
  };

  const activeDoorList = method === 'dahmouch' ? DAHMOUCH_DOORS : KOUNTIYOU_DOORS;

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 safe-area-pt min-h-screen pb-24 flex flex-col">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 shrink-0 min-w-0">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <Link 
            to="/tools" 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors shrink-0 mt-0.5 sm:mt-0"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="text-purple-500 shrink-0" size={22} />
              <span className="break-words leading-tight">{i18n.dynamicTitle}</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1 leading-relaxed break-words">
              {i18n.subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowHistory(true)}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
        >
          <History size={16} />
          <span>{language === 'ha' ? 'Tarihi' : language === 'en' ? 'History' : 'Historique'}</span>
        </button>
      </div>

      <CalculationHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        toolFilter="khatim"
        onSelectCalculation={(item) => {
          if (item.details?.inputText) {
            setInputText(item.details.inputText);
          } else if (item.title) {
            setInputText(item.title);
          }
        }}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-0.5 min-w-0">

      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 rounded-3xl p-4 sm:p-6 mb-6 relative overflow-hidden text-amber-100 shadow-lg min-w-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-0">
          <div className="space-y-1 min-w-0 max-w-full">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/30 max-w-full">
              <Sparkles size={12} className="shrink-0" />
              <span className="truncate">Science des Awfaq & Khatims</span>
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-white break-words">
              {i18n.bannerTitle}
            </h2>
            <p className="text-xs text-amber-200/80 leading-relaxed max-w-3xl break-words">
              {i18n.bannerDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Main Controls Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 relative z-20 space-y-6">
        
        {/* Step 1: System / Method Selector */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Compass size={16} className="text-purple-500" />
            <span>1. Choisissez la Méthode de Khatim / Sceau :</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Ghazali Standard */}
            <button
              type="button"
              onClick={() => { setMethod('ghazali'); setSelectedPreset(null); }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                method === 'ghazali'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/20'
                  : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                  <Grid size={15} /> {i18n.methodGhazali}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${method === 'ghazali' ? 'bg-purple-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                  الغزالي
                </span>
              </div>
              <p className={`text-[11px] leading-tight ${method === 'ghazali' ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {i18n.methodGhazaliDesc}
              </p>
            </button>

            {/* Dahmouch */}
            <button
              type="button"
              onClick={() => { setMethod('dahmouch'); setSelectedPreset(null); }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                method === 'dahmouch'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-500/20'
                  : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                  <Key size={15} /> {i18n.methodDahmouch}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${method === 'dahmouch' ? 'bg-amber-700 text-white' : 'bg-amber-500/20 text-amber-600 dark:text-amber-300'}`}>
                  Portes 1 à 9
                </span>
              </div>
              <p className={`text-[11px] leading-tight ${method === 'dahmouch' ? 'text-amber-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {i18n.methodDahmouchDesc}
              </p>
            </button>

            {/* Kountiyou */}
            <button
              type="button"
              onClick={() => { setMethod('kountiyou'); setSelectedPreset(null); }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                method === 'kountiyou'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                  : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                  <Crown size={15} /> {i18n.methodKountiyou}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${method === 'kountiyou' ? 'bg-indigo-700 text-white' : 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300'}`}>
                  Cheikh Al-Kounti
                </span>
              </div>
              <p className={`text-[11px] leading-tight ${method === 'kountiyou' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {i18n.methodKountiyouDesc}
              </p>
            </button>

            {/* Versets & Besoins */}
            <button
              type="button"
              onClick={() => { setMethod('verset_besoin'); }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                method === 'verset_besoin'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                  : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                  <BookOpen size={15} /> {i18n.methodVerset}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${method === 'verset_besoin' ? 'bg-emerald-700 text-white' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'}`}>
                  الآيات والحوائج
                </span>
              </div>
              <p className={`text-[11px] leading-tight ${method === 'verset_besoin' ? 'text-emerald-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {i18n.methodVersetDesc}
              </p>
            </button>

            {/* Custom Khatim Mode */}
            <button
              type="button"
              onClick={() => { setMethod('custom'); setSelectedPreset(null); }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                method === 'custom'
                  ? 'bg-fuchsia-600 text-white border-fuchsia-500 shadow-md shadow-fuchsia-500/20'
                  : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                  <Edit3 size={15} /> {i18n.methodCustom}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${method === 'custom' ? 'bg-fuchsia-700 text-white' : 'bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-300'}`}>
                  مخصص
                </span>
              </div>
              <p className={`text-[11px] leading-tight ${method === 'custom' ? 'text-fuchsia-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {i18n.methodCustomDesc}
              </p>
            </button>
          </div>
        </div>

        {/* Door Selector for Dahmouch or Kountiyou */}
        {(method === 'dahmouch' || method === 'kountiyou') && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-amber-100 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs sm:text-sm font-extrabold text-amber-300 flex items-center gap-2">
                <Key size={16} className="text-amber-400" />
                <span>{i18n.doorSelectLabel} ({method === 'dahmouch' ? 'Dahmouch' : 'Cheikh Al-Kounti'})</span>
              </label>
              <span className="text-[11px] font-bold text-amber-400/80 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                {i18n.doorOfNine(selectedDoor)}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 sm:gap-2">
              {activeDoorList.map((door) => {
                const nameText = langKey === 'en' ? door.nameEn : door.nameFr;
                return (
                  <button
                    key={door.id}
                    type="button"
                    onClick={() => setSelectedDoor(door.id)}
                    className={`py-2 px-1 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      selectedDoor === door.id
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-md scale-105'
                        : 'bg-black/40 hover:bg-black/70 border-amber-500/20 text-amber-200/90'
                    }`}
                  >
                    <span className="text-xs font-black">Porte {door.id}</span>
                    <span className="text-[9px] truncate max-w-[80px] opacity-80" dir="rtl">{door.nameAr.split('—')[1] || door.nameAr}</span>
                  </button>
                );
              })}
            </div>

            {activeDoorList[selectedDoor - 1] && (
              <div className="p-3 bg-black/60 rounded-xl border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200/90 mt-2">
                <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-extrabold text-amber-300 flex items-center gap-2">
                    <span>{langKey === 'en' ? activeDoorList[selectedDoor - 1].nameEn : activeDoorList[selectedDoor - 1].nameFr}</span>
                    <span className="font-arabic text-amber-400" dir="rtl">{activeDoorList[selectedDoor - 1].nameAr}</span>
                  </div>
                  <p className="text-[11px] text-gray-300">
                    <strong className="text-amber-300">Intention :</strong> {langKey === 'en' ? activeDoorList[selectedDoor - 1].purposeEn : activeDoorList[selectedDoor - 1].purposeFr}
                  </p>
                  <p className="text-[10px] text-amber-400/80 font-mono">
                    ✦ {langKey === 'en' ? activeDoorList[selectedDoor - 1].miftahDescEn : activeDoorList[selectedDoor - 1].miftahDescFr}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Presets for Versets & Besoins */}
        {method === 'verset_besoin' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3 bg-emerald-950/20 border border-emerald-500/30 p-4 sm:p-5 rounded-2xl"
          >
            <label className="text-xs sm:text-sm font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <BookOpen size={16} className="text-emerald-500" />
              <span>Choisissez un Verset Coranique ou Besoin Spirituel :</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
              {VERSETS_BESOINS_PRESETS.map((preset) => {
                const isSelected = selectedPreset?.id === preset.id;
                const titleText = langKey === 'en' ? preset.titleEn : preset.titleFr;
                const descText = langKey === 'en' ? preset.descriptionEn : preset.descriptionFr;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                        : 'bg-white dark:bg-gray-900 hover:bg-emerald-50/50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-xs sm:text-sm truncate max-w-[220px]">
                        {titleText}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'}`}>
                        {preset.abjadValue}
                      </span>
                    </div>

                    <p className={`font-arabic text-sm text-right font-bold truncate ${isSelected ? 'text-amber-200' : 'text-emerald-700 dark:text-emerald-400'}`} dir="rtl">
                      {preset.textAr}
                    </p>

                    <p className={`text-[10px] line-clamp-1 ${isSelected ? 'text-emerald-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {descText}
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* CUSTOM KHATIM CONFIGURATION PANEL */}
        {method === 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-6 bg-fuchsia-50/80 dark:bg-fuchsia-950/20 border border-fuchsia-300 dark:border-fuchsia-500/30 p-5 rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-fuchsia-300 dark:border-fuchsia-500/20 pb-3">
              <h3 className="text-sm sm:text-base font-extrabold text-fuchsia-950 dark:text-fuchsia-300 flex items-center gap-2">
                <Edit3 size={18} className="text-fuchsia-600 dark:text-fuchsia-400" />
                <span>{i18n.customSectionTitle}</span>
              </h3>
              <span className="text-xs text-fuchsia-900 dark:text-fuchsia-300 font-mono bg-fuchsia-200/70 dark:bg-fuchsia-500/10 px-3 py-1 rounded-full border border-fuchsia-300 dark:border-fuchsia-500/30 font-bold">
                Mode Sur-Mesure
              </span>
            </div>

            {/* Custom Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-fuchsia-950 dark:text-fuchsia-200 mb-1">
                  {i18n.customTitleLabel}
                </label>
                <input
                  type="text"
                  value={customTitleFr}
                  onChange={(e) => setCustomTitleFr(e.target.value)}
                  className="w-full bg-white dark:bg-black/40 border border-fuchsia-300 dark:border-fuchsia-500/30 rounded-xl p-2.5 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-fuchsia-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-fuchsia-950 dark:text-fuchsia-200 mb-1">
                  {i18n.customTitleArLabel}
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={customTitleAr}
                  onChange={(e) => setCustomTitleAr(e.target.value)}
                  className="w-full bg-white dark:bg-black/40 border border-fuchsia-300 dark:border-fuchsia-500/30 rounded-xl p-2.5 text-xs font-bold text-amber-800 dark:text-amber-300 font-arabic focus:outline-none focus:border-fuchsia-500 shadow-sm"
                />
              </div>
            </div>

            {/* Content Type Selector */}
            <div>
              <label className="block text-xs font-bold text-fuchsia-950 dark:text-fuchsia-200 mb-2">
                {i18n.contentTypeLabel}
              </label>
              <div className="grid grid-cols-2 gap-2 bg-fuchsia-100/80 dark:bg-black/40 p-1 rounded-xl border border-fuchsia-200 dark:border-fuchsia-500/30">
                <button
                  type="button"
                  onClick={() => setCustomContentType('numbers')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    customContentType === 'numbers'
                      ? 'bg-fuchsia-600 text-white shadow'
                      : 'text-fuchsia-900 dark:text-fuchsia-200 hover:text-fuchsia-950 dark:hover:text-white'
                  }`}
                >
                  {i18n.contentTypeNumbers}
                </button>
                <button
                  type="button"
                  onClick={() => setCustomContentType('text')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    customContentType === 'text'
                      ? 'bg-fuchsia-600 text-white shadow'
                      : 'text-fuchsia-900 dark:text-fuchsia-200 hover:text-fuchsia-950 dark:hover:text-white'
                  }`}
                >
                  {i18n.contentTypeText}
                </button>
              </div>
            </div>

            {/* Cell Value Grid Editor */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-fuchsia-950 dark:text-fuchsia-200">
                  {i18n.gridEditingTitle}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {customContentType === 'numbers' ? (
                    <>
                      <button
                        type="button"
                        onClick={handleAutoMagicSquareFill}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <Sparkles size={11} /> {i18n.autoMagicBtn}
                      </button>
                      <button
                        type="button"
                        onClick={handleSequentialFill}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <Layers size={11} /> {i18n.autoSeqBtn}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNamesFill}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <BookOpen size={11} /> {i18n.autoNamesBtn}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleClearCustomGrid}
                    className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/60 hover:bg-red-200 dark:hover:bg-red-800 text-red-800 dark:text-red-200 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-red-300 dark:border-red-500/30 shadow-sm"
                  >
                    <Trash2 size={11} /> {i18n.clearGridBtn}
                  </button>
                </div>
              </div>

              {/* Grid Input Form Matrix */}
              <div className="overflow-x-auto pb-1">
                <div 
                  className={`grid ${gridGapClassMap[gridSize] || 'gap-1.5'} p-2.5 sm:p-4 bg-fuchsia-100/70 dark:bg-black/60 rounded-2xl border border-fuchsia-300 dark:border-fuchsia-500/30 ${getGridMinWidthClass(gridSize)} ${gridColsClassMap[gridSize] || 'grid-cols-3'}`}
                >
                  {Array.from({ length: gridSize }).map((_, r) =>
                    Array.from({ length: gridSize }).map((_, c) => (
                      <div key={`cell-${r}-${c}`} className="flex flex-col items-center">
                        <span className="text-[8px] font-mono text-fuchsia-800 dark:text-fuchsia-400/80 mb-0.5 font-bold">#{getBaseHouseMatrix(gridSize)[r][c]}</span>
                        {customContentType === 'numbers' ? (
                          <input
                            type="number"
                            value={customNumericGrid[r]?.[c] ?? ''}
                            onChange={(e) => handleCellNumericChange(r, c, e.target.value)}
                            className={`w-full text-center bg-white dark:bg-fuchsia-950/40 border border-fuchsia-300 dark:border-fuchsia-500/40 rounded ${
                              gridSize >= 7 ? 'p-0.5 text-[10px]' : 'p-1 text-xs'
                            } font-mono font-bold text-gray-900 dark:text-amber-200 focus:outline-none focus:border-fuchsia-500 shadow-sm`}
                          />
                        ) : (
                          <input
                            type="text"
                            dir="rtl"
                            value={customTextGrid[r]?.[c] ?? ''}
                            onChange={(e) => handleCellTextChange(r, c, e.target.value)}
                            className={`w-full text-center bg-white dark:bg-fuchsia-950/40 border border-fuchsia-300 dark:border-fuchsia-500/40 rounded ${
                              gridSize >= 7 ? 'p-0.5 text-[10px]' : 'p-1 text-xs'
                            } font-arabic font-bold text-amber-800 dark:text-amber-200 focus:outline-none focus:border-fuchsia-500 shadow-sm`}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Tawq Framing Borders Inputs */}
            <div className="space-y-3 pt-2 border-t border-fuchsia-300 dark:border-fuchsia-500/20">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-xs font-bold text-fuchsia-950 dark:text-fuchsia-200">
                  {i18n.tawqSectionTitle}
                </label>
                <button
                  type="button"
                  onClick={() => setIsTawqEnabled(!isTawqEnabled)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-sm ${
                    isTawqEnabled
                      ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{isTawqEnabled ? '✓ Bordures Activées' : '✕ Bordures Désactivées'}</span>
                </button>
              </div>

              {isTawqEnabled ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-fuchsia-900 dark:text-fuchsia-300 font-semibold">{i18n.tawqTopLabel}</span>
                    <input
                      type="text"
                      dir="rtl"
                      value={customTawqTop}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomTawqTop(val);
                        setTawqFrame((prev) => [val, prev[1] ?? customTawqRight, prev[2] ?? customTawqBottom, prev[3] ?? customTawqLeft]);
                      }}
                      className="w-full bg-white dark:bg-black/40 border border-fuchsia-300 dark:border-fuchsia-500/30 rounded-xl p-2 text-xs font-arabic text-amber-800 dark:text-amber-300 focus:outline-none focus:border-fuchsia-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-fuchsia-900 dark:text-fuchsia-300 font-semibold">{i18n.tawqRightLabel}</span>
                    <input
                      type="text"
                      dir="rtl"
                      value={customTawqRight}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomTawqRight(val);
                        setTawqFrame((prev) => [prev[0] ?? customTawqTop, val, prev[2] ?? customTawqBottom, prev[3] ?? customTawqLeft]);
                      }}
                      className="w-full bg-white dark:bg-black/40 border border-fuchsia-300 dark:border-fuchsia-500/30 rounded-xl p-2 text-xs font-arabic text-amber-800 dark:text-amber-300 focus:outline-none focus:border-fuchsia-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-fuchsia-900 dark:text-fuchsia-300 font-semibold">{i18n.tawqBottomLabel}</span>
                    <input
                      type="text"
                      dir="rtl"
                      value={customTawqBottom}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomTawqBottom(val);
                        setTawqFrame((prev) => [prev[0] ?? customTawqTop, prev[1] ?? customTawqRight, val, prev[3] ?? customTawqLeft]);
                      }}
                      className="w-full bg-white dark:bg-black/40 border border-fuchsia-300 dark:border-fuchsia-500/30 rounded-xl p-2 text-xs font-arabic text-amber-800 dark:text-amber-300 focus:outline-none focus:border-fuchsia-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-fuchsia-900 dark:text-fuchsia-300 font-semibold">{i18n.tawqLeftLabel}</span>
                    <input
                      type="text"
                      dir="rtl"
                      value={customTawqLeft}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomTawqLeft(val);
                        setTawqFrame((prev) => [prev[0] ?? customTawqTop, prev[1] ?? customTawqRight, prev[2] ?? customTawqBottom, val]);
                      }}
                      className="w-full bg-white dark:bg-black/40 border border-fuchsia-300 dark:border-fuchsia-500/30 rounded-xl p-2 text-xs font-arabic text-amber-800 dark:text-amber-300 focus:outline-none focus:border-fuchsia-500 shadow-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-fuchsia-100/50 dark:bg-black/30 rounded-xl border border-dashed border-fuchsia-300 dark:border-fuchsia-500/30 text-xs text-fuchsia-900 dark:text-fuchsia-300 font-medium italic text-center">
                  Les 4 bordures extérieures (Tawq) sont désactivées. Le Khatim sera généré sans les inscriptions de cadrage.
                </div>
              )}
            </div>

            {/* Corner Calligraphy Custom Inputs */}
            <div className="space-y-3 pt-2 border-t border-fuchsia-300 dark:border-fuchsia-500/20">
              <label className="block text-xs font-bold text-fuchsia-950 dark:text-fuchsia-200">
                {i18n.cornersSectionTitle}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] text-fuchsia-900 dark:text-fuchsia-300 font-semibold">{i18n.cornerTLLabel}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomCornerTL('﷽');
                        setCornerCalligraphy((prev) => ({ ...prev, topLeft: '﷽' }));
                      }}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/40 cursor-pointer font-arabic font-bold transition-all"
                      title="Utiliser la Basmala ﷽"
                    >
                      ﷽
                    </button>
                  </div>
                  <input
                    type="text"
                    dir="rtl"
                    value={customCornerTL}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomCornerTL(val);
                      setCornerCalligraphy((prev) => ({ ...prev, topLeft: val }));
                    }}
                    className="w-full bg-white dark:bg-black/40 border border-fuchsia-300 dark:border-fuchsia-500/30 rounded-xl p-1.5 text-center text-xs font-arabic text-amber-800 dark:text-amber-300 focus:outline-none focus:border-fuchsia-500 shadow-sm"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-fuchsia-900 dark:text-fuchsia-300 font-semibold">{i18n.cornerTRLabel}</span>
                  <input
                    type="text"
                    dir="rtl"
                    value={customCornerTR}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomCornerTR(val);
                      setCornerCalligraphy((prev) => ({ ...prev, topRight: val }));
                    }}
                    className="w-full bg-white dark:bg-black/40 border border-fuchsia-300 dark:border-fuchsia-500/30 rounded-xl p-1.5 text-center text-xs font-arabic text-amber-800 dark:text-amber-300 focus:outline-none focus:border-fuchsia-500 shadow-sm"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-fuchsia-900 dark:text-fuchsia-300 font-semibold">{i18n.cornerBLLabel}</span>
                  <input
                    type="text"
                    dir="rtl"
                    value={customCornerBL}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomCornerBL(val);
                      setCornerCalligraphy((prev) => ({ ...prev, bottomLeft: val }));
                    }}
                    className="w-full bg-white dark:bg-black/40 border border-fuchsia-300 dark:border-fuchsia-500/30 rounded-xl p-1.5 text-center text-xs font-arabic text-amber-800 dark:text-amber-300 focus:outline-none focus:border-fuchsia-500 shadow-sm"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-fuchsia-900 dark:text-fuchsia-300 font-semibold">{i18n.cornerBRLabel}</span>
                  <input
                    type="text"
                    dir="rtl"
                    value={customCornerBR}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomCornerBR(val);
                      setCornerCalligraphy((prev) => ({ ...prev, bottomRight: val }));
                    }}
                    className="w-full bg-white dark:bg-black/40 border border-fuchsia-300 dark:border-fuchsia-500/30 rounded-xl p-1.5 text-center text-xs font-arabic text-amber-800 dark:text-amber-300 focus:outline-none focus:border-fuchsia-500 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Subtitle / Badge Input */}
            <div>
              <label className="block text-xs font-bold text-fuchsia-950 dark:text-fuchsia-200 mb-1">
                {i18n.badgeLabel}
              </label>
              <input
                type="text"
                value={customBadgeInput}
                onChange={(e) => setCustomBadgeInput(e.target.value)}
                className="w-full bg-white dark:bg-black/40 border border-fuchsia-300 dark:border-fuchsia-500/30 rounded-xl p-2 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 uppercase focus:outline-none focus:border-fuchsia-500 shadow-sm"
              />
            </div>
          </motion.div>
        )}

        {/* Input Text or Number for standard modes */}
        {method !== 'custom' && (
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Type size={16} /> 
                <span>
                  {method === 'verset_besoin' && selectedPreset 
                    ? i18n.intentionPresetLabel 
                    : i18n.intentionTextLabel}
                </span>
              </span>
              {inputText && (
                <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">
                  {i18n.calculatedWeight} {calculateAbjadValue(inputText)}
                </span>
              )}
            </label>

            <input
              type="text"
              dir="auto"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setSelectedPreset(null);
              }}
              placeholder={i18n.placeholderInput}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-base sm:text-lg font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-arabic"
            />
          </div>
        )}

        {/* Dimension of Square (Grid Size 3x3 to 12x12) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Grid size={16} /> {i18n.dimensionLabel} (3×3 à 12×12)
            </label>
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
              {ORDERS_METADATA[gridSize]?.nameAr || `وفق ${gridSize}×${gridSize}`} • {ORDERS_METADATA[gridSize]?.planetFr || 'Planète'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {[
              { size: 3, name: 'Muthallath', ar: 'المثلث' },
              { size: 4, name: 'Murabba\'', ar: 'المربع' },
              { size: 5, name: 'Mukhammas', ar: 'المخمس' },
              { size: 6, name: 'Musaddas', ar: 'المسدس' },
              { size: 7, name: 'Musabba\'', ar: 'المسبع' },
              { size: 8, name: 'Muthamman', ar: 'المثمن' },
              { size: 9, name: 'Mutassa\'', ar: 'المتسع' },
              { size: 10, name: 'Mu\'ashshar', ar: 'المعشر' },
              { size: 11, name: 'Ahada \'Ashari', ar: 'الحادي عشر' },
              { size: 12, name: 'Ithna \'Ashari', ar: 'الثاني عشر' },
            ].map(({ size, name, ar }) => (
              <button
                key={size}
                type="button"
                onClick={() => setGridSize(size)}
                className={`py-2 px-1.5 rounded-xl text-xs font-bold border transition-all duration-200 text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                  gridSize === size
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/20 scale-102'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="truncate text-[11px]">{name}</span>
                <span className={`text-[10px] font-arabic truncate ${gridSize === size ? 'text-amber-200' : 'text-gray-400 dark:text-gray-400'}`}>{ar}</span>
                <span className={`text-[9px] font-mono ${gridSize === size ? 'text-purple-200' : 'text-gray-400 dark:text-gray-400'}`}>({size}x{size})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bait Al-Khali Option (Carré Khalawi / Case centrale vide) */}
        <div className="bg-gradient-to-r from-indigo-950/70 via-purple-950/60 to-amber-950/50 border border-amber-500/40 rounded-2xl p-4 shadow-md transition-all">
          <div 
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setIsCenterEmptyCardOpen((prev) => !prev)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
              <Sparkles size={16} className="text-amber-400 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-amber-200 truncate">
                {i18n.emptyCenterTitle}
              </span>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <label 
                className="flex items-center gap-1.5 cursor-pointer text-[11px] text-amber-300 font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={isCenterEmpty}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsCenterEmpty(checked);
                    if (grid) {
                      setGrid((prev) => applyCenterCellOverride(prev, checked, centerCustomText, gridSize));
                    }
                  }}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>
              <button 
                type="button" 
                className="p-1 text-amber-300/80 hover:text-amber-200 transition-colors"
                aria-label="Toggle card"
              >
                {isCenterEmptyCardOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isCenterEmptyCardOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-[11px] text-gray-300 mt-3 mb-2 leading-relaxed">
                  {i18n.emptyCenterDesc}
                </p>

                <div className="mt-2.5 pt-2.5 border-t border-amber-500/20">
                  <input
                    type="text"
                    value={centerCustomText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCenterCustomText(val);
                      if (grid && isCenterEmpty) {
                        setGrid((prev) => applyCenterCellOverride(prev, true, val, gridSize));
                      }
                    }}
                    placeholder={i18n.centerCustomTextPlaceholder}
                    className="w-full bg-black/60 border border-amber-500/40 rounded-xl px-3 py-2 text-xs font-arabic text-amber-200 focus:outline-none focus:border-amber-400 shadow-inner"
                    dir="rtl"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Long Names Font Size Adjustment Setting (Admin & Typography Control +20% to -50%) */}
        <div className="bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-amber-950/50 border border-amber-500/40 rounded-2xl p-4 shadow-md transition-all">
          <div 
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setIsLongNamesCardOpen((prev) => !prev)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
              <Sliders size={16} className="text-amber-400 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-amber-200 truncate">
                {i18n.longNamesTitle}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {longNamesReduction < 0 ? (
                <span className="text-xs font-mono font-black text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                  +{Math.abs(longNamesReduction)}%
                </span>
              ) : longNamesReduction > 0 ? (
                <span className="text-xs font-mono font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30">
                  -{longNamesReduction}%
                </span>
              ) : (
                <span className="text-xs font-mono font-black text-gray-300 bg-gray-500/20 px-2 py-0.5 rounded-lg border border-gray-500/30">
                  0%
                </span>
              )}
              <button 
                type="button" 
                className="p-1 text-amber-300/80 hover:text-amber-200 transition-colors"
                aria-label="Toggle card"
              >
                {isLongNamesCardOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isLongNamesCardOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-[11px] text-gray-300 mt-3 mb-3 leading-relaxed">
                  {i18n.longNamesDesc}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold text-emerald-400">+20%</span>
                  <input
                    type="range"
                    min="-20"
                    max="50"
                    step="1"
                    value={longNamesReduction}
                    onChange={(e) => handleLongNamesReductionChange(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-gray-700 rounded-lg"
                  />
                  <span className="text-[10px] font-mono font-bold text-amber-400">-50%</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mt-3">
                  {[
                    { label: i18n.presetEnlargeMax, val: -20 },
                    { label: i18n.presetEnlargeLight, val: -10 },
                    { label: i18n.presetStandard, val: 0 },
                    { label: i18n.presetRecommended, val: 30 },
                    { label: i18n.presetMax, val: 50 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => handleLongNamesReductionChange(preset.val)}
                      className={`py-1.5 px-1.5 rounded-xl text-[10px] sm:text-[11px] font-bold border transition-all cursor-pointer text-center ${
                        longNamesReduction === preset.val
                          ? 'bg-amber-500 border-amber-400 text-black font-black shadow-md'
                          : 'bg-black/50 border-gray-700 text-gray-300 hover:border-amber-500/50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Live Preview Window for 'ذو الجلال والاكرام' */}
                <div className="mt-4 pt-3 border-t border-amber-500/30">
                  <div className="text-xs font-bold text-amber-200 mb-2.5 flex items-center gap-1.5">
                    <Eye size={14} className="text-amber-400" />
                    <span>{i18n.livePreviewLabel}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-4 bg-black/40 p-3 rounded-xl border border-amber-500/20">
                    {/* Parchment preview */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-amber-300/80 font-semibold">Parchemin (Parchment)</span>
                      <div className="w-18 h-18 sm:w-22 sm:h-22 bg-[#fef3c7] border-2 border-[#b45309] rounded-xl shadow-inner flex items-center justify-center p-1 overflow-hidden relative">
                        <span
                          style={getCellInlineStyle('ذو الجلال والاكرام', gridSize)}
                          className="font-arabic font-black text-[#451a03] text-center px-0.5 max-w-full flex items-center justify-center leading-[1.05] whitespace-pre-line break-words"
                          dir="rtl"
                        >
                          ذو الجلال والاكرام
                        </span>
                      </div>
                    </div>

                    {/* Dark Mystique preview */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-amber-300/80 font-semibold">Nuit Mystique (Dark)</span>
                      <div className="w-18 h-18 sm:w-22 sm:h-22 bg-stone-900 border-2 border-amber-500/70 rounded-xl shadow-inner flex items-center justify-center p-1 overflow-hidden relative">
                        <span
                          style={getCellInlineStyle('ذو الجلال والاكرام', gridSize)}
                          className="font-arabic font-black text-amber-100 text-center px-0.5 max-w-full flex items-center justify-center leading-[1.05] whitespace-pre-line break-words drop-shadow-md"
                          dir="rtl"
                        >
                          ذو الجلال والاكرام
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Generate Action Button */}
        <button
          onClick={generateKhatim}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-amber-700 hover:from-purple-600 hover:to-amber-600 text-white font-black text-sm sm:text-base transition-transform hover:scale-101 active:scale-99 shadow-xl flex items-center justify-center gap-2 tracking-wide cursor-pointer uppercase"
        >
          <Sparkles size={20} className="text-amber-300 animate-pulse" /> 
          <span>{i18n.generateBtn} ({method.toUpperCase()})</span>
        </button>
        
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-sm font-bold bg-red-50/80 dark:bg-red-900/20 p-3.5 rounded-2xl border border-red-200 dark:border-red-900/50">
              ⚠️ {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mb-8">
        <ToolInfoTooltip toolId="khatim" />
      </div>

      {/* Generated Result Container */}
      <AnimatePresence>
        {grid && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative flex flex-col items-center gap-6"
          >
            {/* Theme Selector Toggle Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 bg-zinc-900/90 dark:bg-zinc-900 p-2 rounded-2xl border border-amber-500/30">
              <button
                type="button"
                onClick={() => setExportTheme('dark')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  exportTheme === 'dark'
                    ? 'bg-gradient-to-r from-purple-900 to-indigo-900 text-amber-300 shadow-md border border-amber-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>🌙 Nuit Mystique</span>
              </button>
              <button
                type="button"
                onClick={() => setExportTheme('parchment')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  exportTheme === 'parchment'
                    ? 'bg-amber-100 text-amber-950 font-black shadow-md border border-amber-600'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>📜 Parchemin Doré</span>
              </button>
              <button
                type="button"
                onClick={() => setExportTheme('emerald')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  exportTheme === 'emerald'
                    ? 'bg-emerald-800 text-amber-300 font-black shadow-md border border-amber-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>💎 Velours Émeraude</span>
              </button>
              <button
                type="button"
                onClick={() => setExportTheme('white')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  exportTheme === 'white'
                    ? 'bg-white text-zinc-950 font-black shadow-md border border-zinc-900'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>📄 Papier Céleste</span>
              </button>
              <button
                type="button"
                onClick={() => setIsTawqEnabled(!isTawqEnabled)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isTawqEnabled
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-md'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                }`}
                title="Activer ou désactiver l'affichage des 4 bordures (Tawq)"
              >
                <span>{isTawqEnabled ? '🖼️ Tawq Activé' : '🖼️ Tawq Désactivé'}</span>
              </button>
            </div>

            {/* Writing Path Step-by-Step Player */}
            <WritingPathPlayer
              gridSize={gridSize}
              totalHouses={gridSize * gridSize}
              currentStep={activeWritingStep}
              onStepChange={setActiveWritingStep}
              className="w-full max-w-lg"
            />

            {/* Khatim Canvas Box */}
            <div 
              ref={resultRef} 
              className={`rounded-2xl sm:rounded-3xl ${
                gridSize >= 9 ? 'p-2 sm:p-5' : gridSize >= 7 ? 'p-3 sm:p-6' : 'p-5 sm:p-8'
              } shadow-2xl mx-auto max-w-lg relative overflow-hidden w-full font-serif transition-colors ${
                exportTheme === 'parchment'
                  ? 'bg-[#fef3c7] text-[#451a03] border-4 border-double border-[#b45309]'
                  : exportTheme === 'emerald'
                  ? 'bg-gradient-to-b from-[#022c22] via-[#064e3b] to-[#022c22] border-4 border-amber-400 text-amber-100'
                  : exportTheme === 'white'
                  ? 'bg-white text-zinc-900 border-4 border-zinc-900 shadow-xl'
                  : 'bg-gradient-to-b from-zinc-950 via-purple-950/40 to-zinc-950 border-4 border-amber-500/70 text-amber-100'
              }`}
              style={exportTheme === 'parchment' ? {
                backgroundColor: '#fef3c7',
                backgroundImage: 'radial-gradient(#d97706 0.5px, transparent 0.5px), radial-gradient(#d97706 0.5px, #fef3c7 0.5px)',
                backgroundSize: '20px 20px',
                color: '#451a03'
              } : undefined}
            >
               {exportTheme === 'dark' && (
                 <>
                   <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-950/30 pointer-events-none" />
                   <div className="absolute inset-1.5 border border-amber-500/30 rounded-2xl pointer-events-none" />
                 </>
               )}
               {exportTheme === 'emerald' && (
                 <>
                   <div className="absolute inset-0 bg-gradient-to-br from-amber-400/15 via-transparent to-emerald-950/40 pointer-events-none" />
                   <div className="absolute inset-1.5 border border-amber-400/40 rounded-2xl pointer-events-none" />
                 </>
               )}
               {exportTheme === 'parchment' && (
                 <div className="absolute inset-1.5 border border-[#b45309]/40 rounded-2xl pointer-events-none" />
               )}
               {exportTheme === 'white' && (
                 <div className="absolute inset-1.5 border border-zinc-900/20 rounded-2xl pointer-events-none" />
               )}

               {/* Traditional Corner Calligraphy Marks */}
               <span className={`absolute top-2 left-2.5 sm:top-2.5 sm:left-3 font-arabic select-none pointer-events-none z-20 text-left leading-none ${
                 exportTheme === 'parchment' ? 'text-[#92400e]' : exportTheme === 'white' ? 'text-zinc-950' : 'text-amber-400'
               } ${
                 cornerCalligraphy.topLeft === '﷽' || cornerCalligraphy.topLeft.includes('بسم') || cornerCalligraphy.topLeft.includes('بِسْمِ')
                   ? 'text-[11px] sm:text-xs font-black max-w-[38px] sm:max-w-[48px] overflow-hidden whitespace-nowrap block'
                   : cornerCalligraphy.topLeft.length > 12 
                     ? 'text-[9px] sm:text-[10px] max-w-[90px] sm:max-w-[120px] break-words line-clamp-2' 
                     : 'text-xs sm:text-sm font-bold max-w-[80px] sm:max-w-[110px]'
               }`} dir="rtl">
                 {(cornerCalligraphy.topLeft.includes('بسم') || cornerCalligraphy.topLeft.includes('بِسْمِ')) || cornerCalligraphy.topLeft === '﷽'
                   ? '﷽'
                   : cornerCalligraphy.topLeft}
               </span>
               <span className={`absolute top-2.5 right-3.5 max-w-[110px] sm:max-w-[140px] font-arabic select-none pointer-events-none z-20 text-right leading-snug ${
                 exportTheme === 'parchment' ? 'text-[#92400e]' : exportTheme === 'white' ? 'text-zinc-950 font-bold' : 'text-amber-400/80'
               } ${cornerCalligraphy.topRight.length > 12 ? 'text-[9px] sm:text-[10px] break-words line-clamp-2' : 'text-xs sm:text-sm'}`} dir="rtl">{cornerCalligraphy.topRight}</span>
               <span className={`absolute bottom-2.5 left-3.5 max-w-[110px] sm:max-w-[140px] font-arabic select-none pointer-events-none z-20 text-left leading-snug ${
                 exportTheme === 'parchment' ? 'text-[#92400e]' : exportTheme === 'white' ? 'text-zinc-950 font-bold' : 'text-amber-400/80'
               } ${cornerCalligraphy.bottomLeft.length > 12 ? 'text-[9px] sm:text-[10px] break-words line-clamp-2' : 'text-xs sm:text-sm'}`} dir="rtl">{cornerCalligraphy.bottomLeft}</span>
               <span className={`absolute bottom-2.5 right-3.5 max-w-[110px] sm:max-w-[140px] font-arabic select-none pointer-events-none z-20 text-right leading-snug ${
                 exportTheme === 'parchment' ? 'text-[#92400e]' : exportTheme === 'white' ? 'text-zinc-950 font-bold' : 'text-amber-400/80'
               } ${cornerCalligraphy.bottomRight.length > 12 ? 'text-[9px] sm:text-[10px] break-words line-clamp-2' : 'text-xs sm:text-sm'}`} dir="rtl">{cornerCalligraphy.bottomRight}</span>

               {/* Watermark */}
               <AsrarHubWatermark variant={exportTheme === 'parchment' ? 'parchment' : exportTheme === 'white' ? 'parchment' : 'dark'} opacity={0.16} showCentralSeal={true} />

               {/* Header Badge */}
               <div className={`text-center space-y-1 relative z-10 pb-3 mb-4 border-b ${
                 exportTheme === 'parchment' ? 'border-[#b45309]/30' : exportTheme === 'white' ? 'border-zinc-900/20' : 'border-amber-500/30'
               }`}>
                 <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm ${
                   exportTheme === 'parchment'
                     ? 'bg-[#fde68a] border border-[#b45309] text-[#78350f]'
                     : exportTheme === 'white'
                     ? 'bg-zinc-100 border border-zinc-900 text-zinc-950'
                     : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                 }`}>
                   <Sparkles className={`w-3.5 h-3.5 ${exportTheme === 'parchment' ? 'text-[#b45309]' : exportTheme === 'white' ? 'text-zinc-950' : 'text-amber-400'}`} />
                   <span>{activeBadge}</span>
                 </div>

                 {method === 'custom' && (
                   <div className="space-y-0.5 mt-1">
                     <h3 className={`text-sm font-extrabold ${exportTheme === 'parchment' ? 'text-[#78350f]' : exportTheme === 'white' ? 'text-zinc-950' : 'text-amber-200'}`}>
                       {customTitleFr}
                     </h3>
                     <p className={`text-base font-arabic font-bold ${exportTheme === 'parchment' ? 'text-[#b45309]' : exportTheme === 'white' ? 'text-zinc-900' : 'text-amber-300'}`} dir="rtl">
                       {customTitleAr}
                     </p>
                   </div>
                 )}

                 {activeDoorInfo && (
                   <h3 className={`text-xs sm:text-sm font-extrabold tracking-wide mt-1 ${exportTheme === 'parchment' ? 'text-[#78350f]' : exportTheme === 'white' ? 'text-zinc-950' : 'text-amber-300'}`}>
                     {langKey === 'en' ? activeDoorInfo.nameEn : activeDoorInfo.nameFr}
                   </h3>
                 )}

                 {selectedPreset && (
                   <h3 className={`text-xs sm:text-sm font-extrabold tracking-wide mt-1 ${exportTheme === 'parchment' ? 'text-[#065f46]' : exportTheme === 'white' ? 'text-zinc-950' : 'text-emerald-300'}`}>
                     {langKey === 'en' ? selectedPreset.titleEn : selectedPreset.titleFr}
                   </h3>
                 )}

                 <div className="pt-2">
                   <span className={`inline-block border-2 px-5 py-1.5 rounded-full text-xs sm:text-sm font-black tracking-[0.2em] ${
                     exportTheme === 'parchment'
                       ? 'border-[#b45309] text-[#78350f] bg-[#fde68a] shadow-sm'
                       : exportTheme === 'white'
                       ? 'border-zinc-900 text-zinc-950 bg-zinc-100 shadow-sm'
                       : 'border-amber-500/60 text-amber-300 bg-black/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                   }`}>
                     POIDS JUMMAL : {calculatedTotal}
                   </span>
                 </div>
               </div>

               {/* Tawq Framing Borders System (4 Sides) */}
               <div className="w-full my-3 space-y-2 z-10 relative">
                 {/* Top Border (Bordure Haute: tawqFrame[0]) */}
                 {isTawqEnabled && tawqFrame[0] && (
                   <div className={`text-center font-uthmani text-xs sm:text-sm font-bold tracking-wider leading-relaxed px-4 py-1.5 rounded-xl border max-w-fit mx-auto shadow-md ${
                      exportTheme === 'parchment'
                        ? 'bg-[#fde68a]/90 text-[#5c2406] border-[#b45309]/60 shadow-[#b45309]/15'
                        : exportTheme === 'white'
                        ? 'bg-zinc-100 text-zinc-950 border-zinc-900/40 shadow-sm'
                        : 'bg-gradient-to-r from-amber-950/80 via-black/90 to-amber-950/80 text-amber-300 border-amber-500/50 shadow-amber-500/20'
                    }`} dir="rtl">
                     {tawqFrame[0]}
                   </div>
                 )}

                 {/* Middle Section: Left Border (tawqFrame[3]), Central Matrix, Right Border (tawqFrame[1]) */}
                 <div className="flex flex-row items-stretch justify-center gap-1.5 sm:gap-2.5 w-full">
                   {/* Left Border (Bordure Gauche: tawqFrame[3]) */}
                   {isTawqEnabled && tawqFrame[3] && (
                     <div className={`text-center font-arabic text-[11px] sm:text-xs font-medium px-1.5 py-3 rounded-l-xl border-l border-y shadow-sm flex items-center justify-center [writing-mode:vertical-rl] rotate-180 select-none ${
                       exportTheme === 'parchment'
                         ? 'bg-[#fde68a]/60 text-[#78350f] border-[#b45309]/30'
                         : exportTheme === 'white'
                         ? 'bg-zinc-100 text-zinc-950 border-zinc-900/30'
                         : 'bg-black/40 text-amber-300/90 border-amber-500/30'
                     }`} dir="rtl">
                       {tawqFrame[3]}
                     </div>
                   )}

                   {/* Main Grid Matrix */}
                   <div className="overflow-x-auto pb-1 scrollbar-thin flex justify-center items-center min-w-0">
                     <div className={getGridMinWidthClass(gridSize)}>
                       <motion.div 
                         variants={container}
                         initial="hidden"
                         animate="show"
                         className={`grid ${gridGapClassMap[gridSize] || 'gap-1.5'} relative z-10 ${gridColsClassMap[gridSize] || 'grid-cols-3'}`}
                       >
                         {grid.map((row, i) => (
                           row.map((val, j) => {
                             const houseNum = housesGrid ? housesGrid[i][j] : (i * gridSize + j + 1);
                             const isWritten = activeWritingStep === 0 || houseNum <= activeWritingStep;
                             const isCurrentTarget = activeWritingStep > 0 && houseNum === activeWritingStep;

                             return (
                               <motion.div 
                                 key={`${i}-${j}`}
                                 variants={item}
                                 className={`${gridCellPaddingMap[gridSize] || 'p-2 aspect-square'} ${
                                   exportTheme === 'parchment'
                                     ? `${gridSize >= 9 ? 'border' : 'border-2'} border-[#b45309] bg-[#fffbeb] shadow-sm`
                                     : exportTheme === 'emerald'
                                     ? `${gridSize >= 9 ? 'border' : 'border-2'} border-amber-400/60 bg-emerald-950/90 shadow-md`
                                     : exportTheme === 'white'
                                     ? `${gridSize >= 9 ? 'border' : 'border-2'} border-zinc-800 bg-zinc-50 shadow-sm`
                                     : `${gridSize >= 9 ? 'border' : 'border-2'} border-amber-500/50 bg-gradient-to-br from-amber-500/20 via-purple-950/70 to-black shadow-md`
                                 } ${getCellRadiusClass(gridSize)} ${
                                   isCurrentTarget ? 'ring-2 ring-amber-400 scale-105 z-20 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : ''
                                 } ${!isWritten ? 'opacity-20' : 'opacity-100'} flex items-center justify-center relative group min-h-0 min-w-0 transition-all`}
                               >
                                 <span 
                                   style={getCellInlineStyle(val, gridSize)}
                                   className={`font-black tabular-nums z-10 text-center px-0.5 max-w-full flex items-center justify-center ${
                                      exportTheme === 'parchment'
                                        ? 'text-[#451a03] group-hover:text-black'
                                        : exportTheme === 'white'
                                        ? 'text-zinc-950 font-black'
                                        : 'text-amber-100 group-hover:text-white drop-shadow-md'
                                   } ${getCellTextStyle(val, gridSize)} ${
                                     typeof val === 'string'
                                       ? 'font-arabic leading-[1.05] sm:leading-[1.1] py-0 whitespace-pre-line break-words'
                                       : 'leading-tight whitespace-nowrap'
                                   }`}
                                   dir="rtl"
                                 >
                                   {isWritten ? renderFormattedCellValue(val) : '·'}
                                 </span>
                                 {housesGrid && method !== 'custom' && gridSize <= 6 && (
                                   <span className={`absolute bottom-0.5 right-1 text-[8px] font-mono select-none ${
                                     exportTheme === 'parchment' ? 'text-[#b45309]' : exportTheme === 'white' ? 'text-zinc-500' : 'text-amber-400/60'
                                   }`}>
                                     #{housesGrid[i][j]}
                                   </span>
                                 )}
                               </motion.div>
                             );
                           })
                         ))}
                       </motion.div>
                     </div>
                   </div>

                   {/* Right Border (Bordure Droite: tawqFrame[1]) */}
                   {isTawqEnabled && tawqFrame[1] && (
                     <div className={`text-center font-arabic text-[11px] sm:text-xs font-medium px-1.5 py-3 rounded-r-xl border-r border-y shadow-sm flex items-center justify-center [writing-mode:vertical-rl] select-none ${
                       exportTheme === 'parchment'
                         ? 'bg-[#fde68a]/60 text-[#78350f] border-[#b45309]/30'
                         : exportTheme === 'white'
                         ? 'bg-zinc-100 text-zinc-950 border-zinc-900/30'
                         : 'bg-black/40 text-amber-300/90 border-amber-500/30'
                     }`} dir="rtl">
                       {tawqFrame[1]}
                     </div>
                   )}
                 </div>

                 {/* Bottom Border (Bordure Basse: tawqFrame[2]) */}
                 {isTawqEnabled && tawqFrame[2] && (
                   <div className={`text-center font-arabic text-xs sm:text-sm font-medium px-4 py-1.5 rounded-xl border max-w-fit mx-auto shadow-sm ${
                     exportTheme === 'parchment' 
                       ? 'bg-[#fde68a]/70 text-[#78350f] border-[#b45309]/40' 
                       : exportTheme === 'white'
                       ? 'bg-zinc-100 text-zinc-950 border-zinc-900/30'
                       : 'bg-black/40 text-amber-300/90 border-amber-500/30'
                   }`} dir="rtl">
                     {tawqFrame[2]}
                   </div>
                 )}
               </div>

               {/* Footer Details */}
               <div className={`text-center mt-6 relative z-10 pt-3 border-t ${
                 exportTheme === 'parchment' ? 'border-[#b45309]/30' : exportTheme === 'white' ? 'border-zinc-900/20' : 'border-amber-500/30'
               }`}>
                  <p className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${
                    exportTheme === 'parchment' ? 'text-[#78350f]' : exportTheme === 'white' ? 'text-zinc-900' : 'text-amber-400/80'
                  }`}>Harmonie & Sceau Sacré</p>
                  <p className={`text-[11px] ${
                    exportTheme === 'parchment' ? 'text-[#92400e]' : exportTheme === 'white' ? 'text-zinc-700' : 'text-amber-200/70'
                  }`}>Taille : {gridSize}x{gridSize} • Somme Totale : {calculatedTotal}</p>
                  <p className={`text-[9px] font-mono uppercase mt-0.5 ${
                    exportTheme === 'parchment' ? 'text-[#b45309]' : exportTheme === 'white' ? 'text-zinc-500' : 'text-amber-400/60'
                  }`}>AsrarHub • Ruhaniyat & Science des Awfaq</p>
               </div>
            </div>

            {/* Sacred Framing & Archangels Customizer Component */}
            <SacredFramingControls
              totalAdad={calculatedTotal}
              tawqFrame={tawqFrame}
              cornerCalligraphy={cornerCalligraphy}
              onUpdateTawq={setTawqFrame}
              onUpdateCorners={setCornerCalligraphy}
              className="w-full"
            />

            {/* Automatic Kasr & Mathematical Audit Breakdown Component */}
            {kasrBreakdown && (
              <KasrMathBreakdown
                gridSize={gridSize}
                totalAdad={calculatedTotal}
                step={kasrBreakdown.step}
                remainder={kasrBreakdown.remainder}
                kasrHouse={kasrBreakdown.kasrHouse}
                minRequired={kasrBreakdown.minRequired}
                magicAudit={kasrBreakdown.magicAudit}
                className="w-full"
              />
            )}
            
            {/* Export & Download Space */}
            <div className="mt-4 bg-zinc-900/80 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 w-full relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  {i18n.exportSectionTitle}
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                <button 
                  onClick={downloadImage}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center group border border-zinc-700/50"
                >
                  <Image size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
                  <span className="text-xs font-bold">{i18n.exportPngHd}</span>
                  <span className="text-[10px] text-zinc-400">Fond sombre</span>
                </button>
                <button 
                  onClick={downloadParchmentPNG}
                  className="p-3 bg-amber-900/60 hover:bg-amber-900 text-amber-200 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center group border border-amber-700/50"
                >
                  <Feather size={18} className="text-amber-400 group-hover:text-amber-300 transition-colors" />
                  <span className="text-xs font-bold">{i18n.exportParchment}</span>
                  <span className="text-[10px] text-amber-300/80">Style papyrus</span>
                </button>
                <button 
                  onClick={downloadTransparentPNG}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center group border border-zinc-700/50"
                >
                  <Download size={18} className="text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                  <span className="text-xs font-bold">{i18n.exportPngTransp}</span>
                  <span className="text-[10px] text-zinc-400">Fond transparent</span>
                </button>
                <button 
                  onClick={downloadSVG}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center group border border-zinc-700/50"
                >
                  <FileDown size={18} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span className="text-xs font-bold">{i18n.exportSvg}</span>
                  <span className="text-[10px] text-zinc-400">Agrandissement</span>
                </button>
                <button 
                  onClick={downloadPDF}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center group border border-zinc-700/50"
                >
                  <FileDown size={18} className="text-red-400 group-hover:text-red-300 transition-colors" />
                  <span className="text-xs font-bold">{i18n.exportPdf}</span>
                  <span className="text-[10px] text-zinc-400">Format A4</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
                <button 
                  onClick={shareResult}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/80 text-white hover:bg-purple-600 text-xs font-bold transition-all cursor-pointer"
                >
                  <Share2 size={14} />
                  <span>{i18n.shareLink}</span>
                </button>
                <button 
                  onClick={() => setIsCommunityModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>{i18n.publishCommunity}</span>
                </button>
              </div>
            </div>

            {/* Share to Community Modal */}
            <ShareToCommunityModal
              isOpen={isCommunityModalOpen}
              onClose={() => setIsCommunityModalOpen(false)}
              title="Publier le Khatim dans la Communauté"
              category="khatim"
              itemTitle={`Khatim ${method.toUpperCase()} - "${method === 'custom' ? customTitleFr : (inputText || 'Poids ' + calculatedTotal)}"`}
              gridData={grid || undefined}
              detailsText={`Méthode : ${method.toUpperCase()}\nPoids Total : ${calculatedTotal}\nGrille ${gridSize}x${gridSize} :\n${
                grid ? grid.map((r) => r.join("\t|\t")).join("\n") : ""
              }`}
            />

            {/* Comprehensive Sacred Ritual & Usage Guide */}
            <KhatimUsageGuide defaultExpanded={true} className="w-full mt-4" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Guide when no grid generated yet */}
      {!grid && (
        <KhatimUsageGuide defaultExpanded={false} className="w-full mt-6" />
      )}
      </div>
    </div>
  );
};
