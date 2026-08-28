import { calculateAbjadValue } from './abjad';
import { asmaListData } from '../data/asmaListData';

export type KhatimMethod = 'ghazali' | 'dahmouch' | 'kountiyou' | 'verset_besoin' | 'custom';

export interface KhatimDoor {
  id: number;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  purposeFr: string;
  purposeEn: string;
  purposeAr: string;
  miftahDescFr: string;
  miftahDescEn: string;
}

export interface VersetNeedPreset {
  id: string;
  category: 'verset' | 'besoin';
  titleFr: string;
  titleEn: string;
  titleAr: string;
  textAr: string;
  textFr: string;
  textEn: string;
  abjadValue: number;
  recommendedSize: number;
  descriptionFr: string;
  descriptionEn: string;
  keywords: string[];
}

export interface CustomKhatimConfig {
  titleFr: string;
  titleEn: string;
  titleAr: string;
  gridSize: number;
  contentType: 'numbers' | 'text';
  numericGrid: number[][];
  textGrid: string[][];
  tawqTop: string;
  tawqRight: string;
  tawqBottom: string;
  tawqLeft: string;
  cornerTopLeft: string;
  cornerTopRight: string;
  cornerBottomLeft: string;
  cornerBottomRight: string;
  centerSecretNote?: string;
  badgeLabel?: string;
}

export interface OrderMetadata {
  size: number;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  elementFr: string;
  elementAr: string;
  planetFr: string;
  planetAr: string;
  baseAsas: number; // Usul / Asas = n*(n^2-1)/2
  minMagicSum: number; // n*(n^2+1)/2
  kasrFormulaDescFr: string;
  kasrFormulaDescEn: string;
  spiritualVirtueFr: string;
  spiritualVirtueEn: string;
}

// Complete Metadata for Orders 3x3 to 12x12
export const ORDERS_METADATA: Record<number, OrderMetadata> = {
  3: {
    size: 3,
    nameFr: "Muthallath (المثلث — Ghazali)",
    nameEn: "Muthallath (3x3 — Ghazali)",
    nameAr: "المثلث الغزالي المبارك",
    elementFr: "Feu / Saturne",
    elementAr: "ناري / زحل",
    planetFr: "Saturne (Zuhal)",
    planetAr: "زحل",
    baseAsas: 12,
    minMagicSum: 15,
    kasrFormulaDescFr: "(Total - 12) / 3 = Miftah (Clé). Si reste 1: saut à la maison 7. Si reste 2: saut à la maison 4 & 7.",
    kasrFormulaDescEn: "(Total - 12) / 3 = Key. If remainder 1: jump at house 7. If remainder 2: jump at house 4 & 7.",
    spiritualVirtueFr: "Le sceau mère de la tradition asrar. Action rapide, déblocages majeurs, protection et vœux ciblés.",
    spiritualVirtueEn: "The mother seal of spiritual sciences. Swift action, major unblockings, and targeted petitions.",
  },
  4: {
    size: 4,
    nameFr: "Murabba' (المربع — Al-Buni)",
    nameEn: "Murabba' (4x4 — Al-Buni)",
    nameAr: "المربع البوني الشريف",
    elementFr: "Terre / Jupiter",
    elementAr: "ترابي / المشتري",
    planetFr: "Jupiter (Mushtari)",
    planetAr: "المشتري",
    baseAsas: 30,
    minMagicSum: 34,
    kasrFormulaDescFr: "(Total - 30) / 4 = Miftah. Si reste 1: case 13. Si reste 2: case 9. Si reste 3: case 5.",
    kasrFormulaDescEn: "(Total - 30) / 4 = Key. If rem 1: house 13. If rem 2: house 9. If rem 3: house 5.",
    spiritualVirtueFr: "Sceau royal de stabilité, attraction durable de la richesse, victoires judiciaires et charisme imposant.",
    spiritualVirtueEn: "Royal seal of stability, lasting wealth attraction, judicial victory, and commanding awe.",
  },
  5: {
    size: 5,
    nameFr: "Mukhammas (المخمس — Mars)",
    nameEn: "Mukhammas (5x5 — Mars)",
    nameAr: "المخمس المريخي القاهر",
    elementFr: "Air / Mars",
    elementAr: "هوائي / المريخ",
    planetFr: "Mars (Marrikh)",
    planetAr: "المريخ",
    baseAsas: 60,
    minMagicSum: 65,
    kasrFormulaDescFr: "(Total - 60) / 5 = Miftah. Reste 1..4 réparti sur les maisons 21, 16, 11, 6.",
    kasrFormulaDescEn: "(Total - 60) / 5 = Key. Remainder 1..4 distributed on houses 21, 16, 11, 6.",
    spiritualVirtueFr: "Puissance de destruction des ennemis et blocages occultes, courage et protection invincible.",
    spiritualVirtueEn: "Destruction of spiritual blockages and adversaries, divine courage, and impenetrable shielding.",
  },
  6: {
    size: 6,
    nameFr: "Musaddas (المسدس — Soleil)",
    nameEn: "Musaddas (6x6 — Sun)",
    nameAr: "المسدس الشمسي الذهبي",
    elementFr: "Eau / Soleil",
    elementAr: "مائي / الشمس",
    planetFr: "Soleil (Shams)",
    planetAr: "الشمس",
    baseAsas: 105,
    minMagicSum: 111,
    kasrFormulaDescFr: "(Total - 105) / 6 = Miftah. Reste 1..5 réparti sur les maisons 31, 25, 19, 13, 7.",
    kasrFormulaDescEn: "(Total - 60) / 6 = Key. Remainder 1..5 distributed across corresponding houses.",
    spiritualVirtueFr: "Rayonnement suprême, honneurs des rois et dirigeants, succès universel et santé vivifiante.",
    spiritualVirtueEn: "Supreme charisma, high honors, universal success, radiant health, and gold baraka.",
  },
  7: {
    size: 7,
    nameFr: "Musabba' (المسبع — Vénus)",
    nameEn: "Musabba' (7x7 — Venus)",
    nameAr: "المسبع الزهري الجامع",
    elementFr: "Feu / Vénus",
    elementAr: "ناري / الزهرة",
    planetFr: "Vénus (Zuhrah)",
    planetAr: "الزهرة",
    baseAsas: 168,
    minMagicSum: 175,
    kasrFormulaDescFr: "(Total - 168) / 7 = Miftah. Reste 1..6 réparti sur les maisons 43, 36, 29, 22, 15, 8.",
    kasrFormulaDescEn: "(Total - 168) / 7 = Key. Remainder 1..6 on houses 43, 36, 29, 22, 15, 8.",
    spiritualVirtueFr: "Amour divin, réconciliation des couples, attraction universelle des cœurs et créativité.",
    spiritualVirtueEn: "Divine love, marital harmony, universal attraction of hearts, and profound artistic bliss.",
  },
  8: {
    size: 8,
    nameFr: "Muthamman (المثمن — Mercure)",
    nameEn: "Muthamman (8x8 — Mercury)",
    nameAr: "المثمن العطاردي الحكيم",
    elementFr: "Terre / Mercure",
    elementAr: "ترابي / عطارد",
    planetFr: "Mercure ('Utarid)",
    planetAr: "عطارد",
    baseAsas: 252,
    minMagicSum: 260,
    kasrFormulaDescFr: "(Total - 252) / 8 = Miftah. Reste 1..7 réparti sur les maisons 57, 49, 41, 33, 25, 17, 9.",
    kasrFormulaDescEn: "(Total - 252) / 8 = Key. Remainder 1..7 on houses 57, 49, 41, 33, 25, 17, 9.",
    spiritualVirtueFr: "Sagesse supérieure, mémorisation prodigieuse, réussite aux examens et éloquence.",
    spiritualVirtueEn: "Superior wisdom, rapid Quranic memorization, academic eloquence, and business intellect.",
  },
  9: {
    size: 9,
    nameFr: "Mutassa' (المتسع — Lune)",
    nameEn: "Mutassa' (9x9 — Moon)",
    nameAr: "المتسع القمري النوراني",
    elementFr: "Air / Lune",
    elementAr: "هوائي / القمر",
    planetFr: "Lune (Qamar)",
    planetAr: "القمر",
    baseAsas: 360,
    minMagicSum: 369,
    kasrFormulaDescFr: "(Total - 360) / 9 = Miftah. Reste 1..8 réparti sur les maisons 73, 64, 55, 46, 37, 28, 19, 10.",
    kasrFormulaDescEn: "(Total - 360) / 9 = Key. Remainder 1..8 on houses 73, 64, 55, 46, 37, 28, 19, 10.",
    spiritualVirtueFr: "Intuition spirituelle, visions véridiques, secrets ésotériques profonds et paix intérieure.",
    spiritualVirtueEn: "Spiritual intuition, true oneiric visions, esoteric secrets, and emotional tranquility.",
  },
  10: {
    size: 10,
    nameFr: "Mu'ashshar (المعشر — Sphère des Étoiles)",
    nameEn: "Mu'ashshar (10x10 — Decuple)",
    nameAr: "المعشر الفلكي العظيم",
    elementFr: "Eau / Étoiles",
    elementAr: "مائي / الفلك",
    planetFr: "Sphère céleste (Falak)",
    planetAr: "الفلك الأعظم",
    baseAsas: 495,
    minMagicSum: 505,
    kasrFormulaDescFr: "(Total - 495) / 10 = Miftah. Reste 1..9 réparti selon l'échelle décuple.",
    kasrFormulaDescEn: "(Total - 495) / 10 = Key. Remainder 1..9 on decuple scale.",
    spiritualVirtueFr: "Accomplissement total des projets de grande envergure et couronnement de la destinée.",
    spiritualVirtueEn: "Total fulfillment of monumental endeavors and spiritual coronation.",
  },
  11: {
    size: 11,
    nameFr: "Ahada 'Ashari (الأحد عشري — Trône)",
    nameEn: "Ahada 'Ashari (11x11 — Throne)",
    nameAr: "الأحد عشري العرشي",
    elementFr: "Lumière Pure / Kursi",
    elementAr: "نوراني / الكرسي",
    planetFr: "Le Siège Divin (Al-Kursi)",
    planetAr: "الكرسي",
    baseAsas: 660,
    minMagicSum: 671,
    kasrFormulaDescFr: "(Total - 660) / 11 = Miftah. Répartition sacrée des 11 degrés.",
    kasrFormulaDescEn: "(Total - 660) / 11 = Key. Sacred distribution of the 11 degrees.",
    spiritualVirtueFr: "Élévation spirituelle suprême, ouverture des voiles mystiques et dévoilement des secrets.",
    spiritualVirtueEn: "Supreme spiritual ascension, unveiling of celestial secrets, and direct divine presence.",
  },
  12: {
    size: 12,
    nameFr: "Ithna 'Ashari (الاثنا عشري — Zodiaque)",
    nameEn: "Ithna 'Ashari (12x12 — Zodiac)",
    nameAr: "الاثنا عشري البروجي التام",
    elementFr: "Totalité des 12 Constellations",
    elementAr: "جامع البروج الاثنا عشر",
    planetFr: "Les 12 Constellations (Al-Buruj)",
    planetAr: "البروج",
    baseAsas: 858,
    minMagicSum: 870,
    kasrFormulaDescFr: "(Total - 858) / 12 = Miftah. Répartition intégrale sur les 12 maisons astrologiques.",
    kasrFormulaDescEn: "(Total - 858) / 12 = Key. Harmonization across the 12 astrological houses.",
    spiritualVirtueFr: "Harmonisation universelle avec le zodiaque, neutralisation de toutes les afflictions astrales.",
    spiritualVirtueEn: "Universal zodiac harmonization, nullifying all astral afflictions and bad planetary aspects.",
  },
};

// 4 Archangels Framing Preset
export const ARCHANGELS_PRESET = {
  corners: {
    topLeft: "جِبْرِيلُ",
    topRight: "مِيكَائِيلُ",
    bottomLeft: "إِسْرَافِيلُ",
    bottomRight: "عِزْرَائِيلُ",
  },
  borders: {
    top: "جِبْرِيلُ عَلَيْهِ السَّلاَمُ — مَلَكُ الوَحْيِ وَالقُوَّةِ",
    right: "مِيكَائِيلُ عَلَيْهِ السَّلاَمُ — مَلَكُ الرِّزْقِ وَالبَرَكَةِ",
    bottom: "إِسْرَافِيلُ عَلَيْهِ السَّلاَمُ — مَلَكُ الصُّورِ وَالحَيَاةِ",
    left: "عِزْرَائِيلُ عَلَيْهِ السَّلاَمُ — مَلَكُ القَبْضِ وَالسِّرِّ",
  },
  namesList: [
    { ar: "جبريل", fr: "Jibril (Gabriel)", en: "Jibreel (Gabriel)", virtue: "Révélation & Force" },
    { ar: "ميكائيل", fr: "Mika'il (Michel)", en: "Mikaeel (Michael)", virtue: "Subsistance & Pluies" },
    { ar: "إسرافيل", fr: "Israfil (Raphaël)", en: "Israfeel (Raphael)", virtue: "Souffle de Vie & Résurrection" },
    { ar: "عزرائيل", fr: "Izra'il (Azraël)", en: "Azrael (Izraeel)", virtue: "Secret & Passage Céleste" },
  ]
};

// Curated Quranic Framing Presets (Tawq)
export const QURANIC_TAWQ_PRESETS = [
  {
    id: 'ayat_kursi',
    nameFr: 'Ayat Al-Kursi (Verset du Trône)',
    nameEn: 'Ayat Al-Kursi (Throne Verse)',
    nameAr: 'آية الكرسي الشريفة',
    top: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    right: "لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
    bottom: "مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ",
    left: "وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
  },
  {
    id: 'surah_ikhlas',
    nameFr: 'Sourate Al-Ikhlas (Le Monothéisme Pur)',
    nameEn: 'Surah Al-Ikhlas (Pure Faith)',
    nameAr: 'سورة الإخلاص المباركة',
    top: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    right: "اللَّهُ الصَّمَدُ",
    bottom: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    left: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
  },
  {
    id: 'surah_nasr',
    nameFr: 'Sourate An-Nasr (La Victoire Divine)',
    nameEn: 'Surah An-Nasr (Divine Victory)',
    nameAr: 'سورة النصر والفتح',
    top: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
    right: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
    bottom: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ",
    left: "إِنَّهُ كَانَ تَوَّابًا",
  },
  {
    id: 'fath_mubeen',
    nameFr: 'Verset de l\'Ouverture & Gloire (Fath)',
    nameEn: 'Verse of Manifest Opening & Victory',
    nameAr: 'آية الفتح المبين والنصر العزيز',
    top: "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا",
    right: "لِيَغْفِرَ لَكَ اللَّهُ مَا تَقَدَّمَ مِن ذَنبِكَ وَمَا تَأَخَّرَ",
    bottom: "وَيُتِمَّ نِعْمَتَهُ عَلَيْكَ وَيَهْدِيَكَ صِرَاطًا مُّسْتَقِيمًا",
    left: "وَيَنصُرَكَ اللَّهُ نَصْرًا عَزِيزًا",
  },
  {
    id: 'rizq_baraka',
    nameFr: 'Verset de la Subsistance Céleste (Rizq)',
    nameEn: 'Verse of Boundless Provision (Rizq)',
    nameAr: 'آية الرزق الواسع وتيسير العسير',
    top: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    right: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ",
    bottom: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    left: "إِنَّ اللَّهَ بَالِغُ أَمْرِهِ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا",
  },
  {
    id: 'hifz_aman',
    nameFr: 'Verset de Protection Absolue (Hifz)',
    nameEn: 'Verse of Total Guardianship & Shield',
    nameAr: 'آية الحفظ والتحصين المنيع',
    top: "فَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ",
    right: "وَحَفِظْنَاهَا مِن كُلِّ شَيْطَانٍ رَّجِيمٍ",
    bottom: "لَهُ مُعَقِّبَاتٌ مِّن بَيْنِ يَدَيْهِ وَمِنْ خَلْفِهِ يَحْفَظُونَهُ",
    left: "إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ",
  }
];

// 9 Dahmouch Doors Definitions (Multilingual)
export const DAHMOUCH_DOORS: KhatimDoor[] = [
  {
    id: 1,
    nameFr: "Porte 1 — Bab Ar-Rizq (Porte de la Subsistance)",
    nameEn: "Gate 1 — Bab Ar-Rizq (Gate of Sustenance)",
    nameAr: "الباب الأول — باب الرزق والبركة",
    purposeFr: "Attraction des biens, prospérité financière et ouverture commerciale",
    purposeEn: "Attraction of wealth, financial prosperity, and commercial opening",
    purposeAr: "جلب الرزق والبركة والتيسير المالي",
    miftahDescFr: "Miftah (Clé) positionnée en Maison 1 (Haut-Centre)",
    miftahDescEn: "Key (Miftah) positioned in House 1 (Top-Center)",
  },
  {
    id: 2,
    nameFr: "Porte 2 — Bab Al-Mahabba (Porte de l'Amour & Attraction)",
    nameEn: "Gate 2 — Bab Al-Mahabba (Gate of Love & Harmony)",
    nameAr: "الباب الثاني — باب المحبة والقبول",
    purposeFr: "Harmonie relationnelle, affection sincère et sympathie",
    purposeEn: "Relational harmony, sincere affection, and mutual love",
    purposeAr: "جلب المحبة والمودة وتأليف القلوب",
    miftahDescFr: "Miftah orientée en Maison 2 (Bas-Droite)",
    miftahDescEn: "Key (Miftah) oriented in House 2 (Bottom-Right)",
  },
  {
    id: 3,
    nameFr: "Porte 3 — Bab Al-Hifz (Porte de Protection Aura)",
    nameEn: "Gate 3 — Bab Al-Hifz (Gate of Aura Protection)",
    nameAr: "الباب الثالث — باب الحفظ والوقاية",
    purposeFr: "Protection contre le mauvais œil, jalousie et énergies sombres",
    purposeEn: "Shield against the evil eye, envy, and negative forces",
    purposeAr: "الحماية من العين والتحصين الشامل",
    miftahDescFr: "Miftah fixée en Maison 3 (Milieu-Gauche)",
    miftahDescEn: "Key (Miftah) fixed in House 3 (Middle-Left)",
  },
  {
    id: 4,
    nameFr: "Porte 4 — Bab Al-Fath (Porte d'Ouverture & Victoire)",
    nameEn: "Gate 4 — Bab Al-Fath (Gate of Opening & Victory)",
    nameAr: "الباب الرابع — باب الفتح والنصر",
    purposeFr: "Résolution des affaires bloquées et succès dans les épreuves",
    purposeEn: "Unlocking blocked situations and triumph in trials",
    purposeAr: "فتح المغاليق والظفر على العوائق",
    miftahDescFr: "Miftah ancrée en Maison 4 (Haut-Droite)",
    miftahDescEn: "Key (Miftah) anchored in House 4 (Top-Right)",
  },
  {
    id: 5,
    nameFr: "Porte 5 — Bab Ash-Shifa' (Porte de Guérison & Vitalité)",
    nameEn: "Gate 5 — Bab Ash-Shifa' (Gate of Healing & Vitality)",
    nameAr: "الباب الخامس — باب الشفاء والعافية",
    purposeFr: "Régénération énergétique, santé globale et apaisement",
    purposeEn: "Energy regeneration, holistic health, and spiritual comfort",
    purposeAr: "الشفاء من الأمراض ورفع البلاء",
    miftahDescFr: "Miftah centrée en Maison 5 (Cœur du Wafq / Sirr)",
    miftahDescEn: "Key (Miftah) centered in House 5 (Core of Wafq / Sirr)",
  },
  {
    id: 6,
    nameFr: "Porte 6 — Bab Al-Jah (Porte de Dignité & Charisme)",
    nameEn: "Gate 6 — Bab Al-Jah (Gate of Dignity & Prestige)",
    nameAr: "الباب السادس — باب الجاه والعظمة",
    purposeFr: "Élévation de rang, respect naturel et autorité bienveillante",
    purposeEn: "Elevation of rank, natural respect, and benevolent authority",
    purposeAr: "نيل العظمة والمهابة بين الناس",
    miftahDescFr: "Miftah placée en Maison 6 (Bas-Gauche)",
    miftahDescEn: "Key (Miftah) placed in House 6 (Bottom-Left)",
  },
  {
    id: 7,
    nameFr: "Porte 7 — Bab At-Taysir (Porte de Facilitation des Vœux)",
    nameEn: "Gate 7 — Bab At-Taysir (Gate of Facilitation)",
    nameAr: "الباب السابع — باب التيسير وقضاء الحوائج",
    purposeFr: "Facilitation des démarches complexes et exaucement",
    purposeEn: "Facilitating complex endeavors and fulfillment of wishes",
    purposeAr: "تيسير الأمور الصعبة وقضاء الحوائج",
    miftahDescFr: "Miftah positionnée en Maison 7 (Milieu-Droite)",
    miftahDescEn: "Key (Miftah) positioned in House 7 (Middle-Right)",
  },
  {
    id: 8,
    nameFr: "Porte 8 — Bab Al-Hayba (Porte de Prestance & Respect)",
    nameEn: "Gate 8 — Bab Al-Hayba (Gate of Awe & Charisma)",
    nameAr: "الباب الثامن — باب الهيبة والقبول",
    purposeFr: "Protection du prestige et apaisement des opposants",
    purposeEn: "Preserving honor and subduing hostiles",
    purposeAr: "نيل الهيبة وقبول الكلمة",
    miftahDescFr: "Miftah orientée en Maison 8 (Haut-Gauche)",
    miftahDescEn: "Key (Miftah) oriented in House 8 (Top-Left)",
  },
  {
    id: 9,
    nameFr: "Porte 9 — Bab As-Sirr (Porte du Secret & Accomplissement)",
    nameEn: "Gate 9 — Bab As-Sirr (Gate of Secrets & Fulfillment)",
    nameAr: "الباب التاسع — باب سر الأسرار والختم",
    purposeFr: "Illumination spirituelle, scellement des demandes et couronne",
    purposeEn: "Spiritual illumination, sealing of prayers, and spiritual crown",
    purposeAr: "بلوغ أقصى الغايات وسر الأسرار",
    miftahDescFr: "Miftah verrouillée en Maison 9 (Bas-Centre / Mughlaq)",
    miftahDescEn: "Key (Miftah) locked in House 9 (Bottom-Center / Mughlaq)",
  },
];

// 9 Kountiyou Sacred Gates Definitions (Cheikh Sidi Al-Mukhtar Al-Kounti)
export const KOUNTIYOU_DOORS: KhatimDoor[] = [
  {
    id: 1,
    nameFr: "Porte 1 — Bab Al-Miftah Al-A'zam (La Grande Clé Kountiyya)",
    nameEn: "Gate 1 — Bab Al-Miftah Al-A'zam (The Great Kountiyya Key)",
    nameAr: "الباب الأول — مفتاح الفتوحات الكنتية",
    purposeFr: "Ouverture universelle des voies et connexion aux bénédictions suprêmes",
    purposeEn: "Universal opening of pathways and divine blessings",
    purposeAr: "مفتاح البركات والفتوحات الكبرى",
    miftahDescFr: "Porte Miftah Supérieure (الفتح الأعظم)",
    miftahDescEn: "Superior Key Gate (الفتح الأعظم)",
  },
  {
    id: 2,
    nameFr: "Porte 2 — Bab Al-Wisal (Porte d'Union & Sympathie)",
    nameEn: "Gate 2 — Bab Al-Wisal (Gate of Union & Affection)",
    nameAr: "الباب الثاني — باب الوصال والتهييج الحلال",
    purposeFr: "Union des cœurs, harmonie conjugale et réconciliation",
    purposeEn: "Union of hearts, marital harmony, and reconciliation",
    purposeAr: "تأليف القلوب والجمع بين الأحبة",
    miftahDescFr: "Porte de la Sympathie Divine (الوصال)",
    miftahDescEn: "Gate of Divine Sympathy (الوصال)",
  },
  {
    id: 3,
    nameFr: "Porte 3 — Bab Al-Tahfeeth (Porte de Fortification & Mémoire)",
    nameEn: "Gate 3 — Bab Al-Tahfeeth (Gate of Memory & Fortification)",
    nameAr: "الباب الثالث — باب التحفيظ والوقاية",
    purposeFr: "Fortification de la mémoire, sagesse et bouclier contre l'oubli",
    purposeEn: "Enhancement of memory, wisdom, and mental clarity",
    purposeAr: "حفظ العلم والوقاية من الشتات",
    miftahDescFr: "Porte de la Sagesse (التحفيظ)",
    miftahDescEn: "Gate of Divine Wisdom (التحفيظ)",
  },
  {
    id: 4,
    nameFr: "Porte 4 — Bab Al-Jalb Al-Akbar (Porte de la Grande Attraction)",
    nameEn: "Gate 4 — Bab Al-Jalb Al-Akbar (Gate of Supreme Attraction)",
    nameAr: "الباب الرابع — باب الجلب الأكبر والرزق",
    purposeFr: "Attraction massive de la subsistance et des opportunités bénies",
    purposeEn: "Abundant attraction of provision and blessed opportunities",
    purposeAr: "جلب الأرزاق والتسهيل الشامل",
    miftahDescFr: "Porte du Grand Flux (الجلب الأكبر)",
    miftahDescEn: "Gate of Supreme Abundance (الجلب الأكبر)",
  },
  {
    id: 5,
    nameFr: "Porte 5 — Bab Al-Fath Al-Mubeen (Porte de la Victoire Éclatante)",
    nameEn: "Gate 5 — Bab Al-Fath Al-Mubeen (Gate of Manifest Victory)",
    nameAr: "الباب الخامس — باب الفتح المبين والظفر",
    purposeFr: "Victoire sur les obstacles et réalisation rapide des projets",
    purposeEn: "Overcoming obstacles and swift achievement of goals",
    purposeAr: "الظفر بالنصر والفتح المبين",
    miftahDescFr: "Porte Centralisée Kountiyya (الفتح المبين)",
    miftahDescEn: "Centralized Kountiyya Gate (الفتح المبين)",
  },
  {
    id: 6,
    nameFr: "Porte 6 — Bab Al-Jah wa Al-Azama (Porte du Rayonnement)",
    nameEn: "Gate 6 — Bab Al-Jah wa Al-Azama (Gate of Glory & Eminence)",
    nameAr: "الباب السادس — باب الجاه والعظمة والرفعة",
    purposeFr: "Charisme spirituel, autorité pacifique et réputation honorable",
    purposeEn: "Spiritual charisma, noble authority, and high reputation",
    purposeAr: "نيل الجاه والرفعة العلية",
    miftahDescFr: "Porte du Rayonnement Royale (الجاه)",
    miftahDescEn: "Gate of Royal Prestige (الجاه)",
  },
  {
    id: 7,
    nameFr: "Porte 7 — Bab Qada' Al-Hawatidj (Exaucement des Vœux Urgents)",
    nameEn: "Gate 7 — Bab Qada' Al-Hawatidj (Fulfillment of Urgent Needs)",
    nameAr: "الباب السابع — باب قضاء الحوائج العاجلة",
    purposeFr: "Déblocage immédiat des situations urgentes et réponses favorables",
    purposeEn: "Immediate unlocking of urgent requests and favorable outcomes",
    purposeAr: "قضاء الحوائج المستعجلة",
    miftahDescFr: "Porte de la Réponse Rapide (قضاء الحوائج)",
    miftahDescEn: "Gate of Swift Response (قضاء الحوائج)",
  },
  {
    id: 8,
    nameFr: "Porte 8 — Bab Al-Mawadda (Porte de l'Affection & Concorde)",
    nameEn: "Gate 8 — Bab Al-Mawadda (Gate of Cordiality & Peace)",
    nameAr: "الباب الثامن — باب المودة والألفة المباركة",
    purposeFr: "Paix dans le foyer, amitié sincère et effacement des querelles",
    purposeEn: "Domestic peace, sincere friendship, and resolution of disputes",
    purposeAr: "نشر الألفة والمودة بين الأهل",
    miftahDescFr: "Porte de la Concorde (المودة)",
    miftahDescEn: "Gate of Harmony (المودة)",
  },
  {
    id: 9,
    nameFr: "Porte 9 — Bab Sirr Al-Asrar (Porte des Mystères & Élévation)",
    nameEn: "Gate 9 — Bab Sirr Al-Asrar (Gate of Mysteries & Elevation)",
    nameAr: "الباب التاسع — باب سر الأسرار والترقية",
    purposeFr: "Accès aux secrets subtils, méditation et couronne mystique",
    purposeEn: "Access to subtle mysteries, spiritual crown, and elevation",
    purposeAr: "بلوغ سر الأسرار والترقي الروحي",
    miftahDescFr: "Porte du Couronnement (سر الأسرار)",
    miftahDescEn: "Gate of Mystic Crown (سر الأسرار)",
  },
];

// Presets for Versets and Besoins Spirituels
export const VERSETS_BESOINS_PRESETS: VersetNeedPreset[] = [
  {
    id: 'ayat_kursi',
    category: 'verset',
    titleFr: 'Ayat al-Kursi (Verset du Trône)',
    titleEn: 'Ayat al-Kursi (Throne Verse)',
    titleAr: 'آيَةُ الكُرْسِيّ — ﴿اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ﴾',
    textAr: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    textFr: 'Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même.',
    textEn: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence.',
    abjadValue: 5995,
    recommendedSize: 4,
    descriptionFr: 'Protectorat absolu, bouclier contre toute entité négative et élévation de l\'aura.',
    descriptionEn: 'Absolute protection, impenetrable shield against negative energies, and aura elevation.',
    keywords: ['protection', 'hifz', 'trône', 'kursi', 'force']
  },
  {
    id: 'bismillah',
    category: 'verset',
    titleFr: 'Bismillah Ar-Rahman Ar-Rahim (786)',
    titleEn: 'Bismillah Ar-Rahman Ar-Rahim (786)',
    titleAr: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    textAr: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    textFr: 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux.',
    textEn: 'In the name of Allah, the Most Gracious, the Most Merciful.',
    abjadValue: 786,
    recommendedSize: 3,
    descriptionFr: 'La clé de toute bénédiction, ouverture facile et protection universelle.',
    descriptionEn: 'The master key of divine grace, effortless opening, and universal blessing.',
    keywords: ['bismillah', 'ouverture', 'bénédiction', 'baraka']
  },
  {
    id: 'hasbunallah',
    category: 'verset',
    titleFr: 'Hasbunallah wa Ni\'mal Wakil (450)',
    titleEn: 'Hasbunallah wa Ni\'mal Wakil (450)',
    titleAr: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    textAr: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    textFr: 'Allah nous suffit ; Il est notre meilleur garant.',
    textEn: 'Sufficient for us is Allah, and He is the best disposer of affairs.',
    abjadValue: 450,
    recommendedSize: 3,
    descriptionFr: 'Délivrance de l\'anxiété, victoire sur l\'injustice et protection invincible.',
    descriptionEn: 'Relief from anxiety, victory over injustice, and divine guardianship.',
    keywords: ['secours', 'protection', 'victoire', 'garant']
  },
  {
    id: 'fath_mubeen',
    category: 'verset',
    titleFr: 'Inna Fatahna Laka Fathan Mubeena (1233)',
    titleEn: 'Inna Fatahna Laka Fathan Mubeena (1233)',
    titleAr: 'إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا',
    textAr: 'إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا',
    textFr: 'En vérité, Nous t\'avons accordé une victoire éclatante.',
    textEn: 'Indeed, We have granted you a clear victory.',
    abjadValue: 1233,
    recommendedSize: 4,
    descriptionFr: 'Ouverture des portes fermées, succès aux examens et victoires éclatantes.',
    descriptionEn: 'Opening of locked doors, academic success, and triumphs.',
    keywords: ['fath', 'ouverture', 'succès', 'victoire']
  },
  {
    id: 'rizq_haythu_la_yahtasib',
    category: 'verset',
    titleFr: 'Wa Yarzuqhu Min Haythu La Yahtasib (1414)',
    titleEn: 'Wa Yarzuqhu Min Haythu La Yahtasib (1414)',
    titleAr: 'وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    textAr: 'وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    textFr: 'Et Il lui accorde Ses dons par des voies inattendues.',
    textEn: 'And He will provide for him from where he does not expect.',
    abjadValue: 1414,
    recommendedSize: 4,
    descriptionFr: 'Attraction des richesses inattendues, abondance et délivrance financière.',
    descriptionEn: 'Attracting unexpected wealth, financial ease, and divine abundance.',
    keywords: ['rizq', 'richesse', 'abondance', 'argent']
  },
  {
    id: 'mahabba_kahubbillah',
    category: 'verset',
    titleFr: 'Yuhibboonahum Ka-Hubbillah (757)',
    titleEn: 'Yuhibboonahum Ka-Hubbillah (757)',
    titleAr: 'يُحِبُّونَهُمْ كَحُبِّ اللَّهِ',
    textAr: 'يُحِبُّونَهُمْ كَحُبِّ اللَّهِ وَالَّذِينَ آمَنُوا أَشَدُّ حُبًّا لِلَّهِ',
    textFr: 'Ils les aiment comme on aime Allah, mais les croyants ont un amour plus vif pour Allah.',
    textEn: 'They love them as they love Allah, but those who believe are stronger in love for Allah.',
    abjadValue: 757,
    recommendedSize: 3,
    descriptionFr: 'Harmonie des cœurs, charisme d\'amour sincère et concorde familiale.',
    descriptionEn: 'Harmony of hearts, sincere charisma of affection, and family peace.',
    keywords: ['amour', 'mahabba', 'affection', 'harmonie']
  },
  {
    id: 'shifa_rabbi',
    category: 'verset',
    titleFr: 'Wa Idha Maridtu Fahuwa Yashfeen (1426)',
    titleEn: 'Wa Idha Maridtu Fahuwa Yashfeen (1426)',
    titleAr: 'وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ',
    textAr: 'وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ',
    textFr: 'Et quand je suis malade, c\'est Lui qui me guérit.',
    textEn: 'And when I am ill, it is He who cures me.',
    abjadValue: 1426,
    recommendedSize: 4,
    descriptionFr: 'Guérison des maux du corps et de l\'esprit, soulagement et vitalité.',
    descriptionEn: 'Healing of bodily and spiritual ailments, vitality and relief.',
    keywords: ['guérison', 'shifa', 'santé', 'vitalité']
  },
  {
    id: 'besoin_rizq',
    category: 'besoin',
    titleFr: 'Besoin : Abondance Financière & Prospérité (Rizq)',
    titleEn: 'Need: Financial Abundance & Business Wealth (Rizq)',
    titleAr: 'قضاء حاجَة : جَلْبُ الرِّزْقِ وَالْبَرَكَةِ المَالِيَّةِ',
    textAr: 'يا رزاق يا فتاح يا وهاب',
    textFr: 'Invocations des Noms d\'Abondance : Ya Razzaq, Ya Fattah, Ya Wahhab.',
    textEn: 'Invocation of Abundance Names: Ya Razzaq, Ya Fattah, Ya Wahhab.',
    abjadValue: 811,
    recommendedSize: 3,
    descriptionFr: 'Déblocage des finances, réussite des entreprises et apport de baraka.',
    descriptionEn: 'Financial unlocking, business growth, and baraka.',
    keywords: ['rizq', 'argent', 'commerce', 'prospérité']
  },
  {
    id: 'besoin_mahabba',
    category: 'besoin',
    titleFr: 'Besoin : Amour Halal & Harmonie Conjugale',
    titleEn: 'Need: Marital Love & Domestic Harmony',
    titleAr: 'قضاء حاجَة : المَحَبَّةُ الشَّرْعِيَّةُ وَتَأْلِيفُ القُلُوبِ',
    textAr: 'يا ودود يا جامع يا رؤوف',
    textFr: 'Invocations de la Confraternité : Ya Wadud, Ya Jami\', Ya Ra\'uf.',
    textEn: 'Invocations of Divine Love: Ya Wadud, Ya Jami\', Ya Ra\'uf.',
    abjadValue: 421,
    recommendedSize: 3,
    descriptionFr: 'Paix dans le couple, réunion des cœurs et affection sincère.',
    descriptionEn: 'Marital serenity, union of hearts, and genuine affection.',
    keywords: ['amour', 'mariage', 'couple', 'harmonie']
  },
  {
    id: 'besoin_protection',
    category: 'besoin',
    titleFr: 'Besoin : Protection Absolue (Sihr, Ain, Hasad)',
    titleEn: 'Need: Total Protection (Sihr, Evil Eye, Envy)',
    titleAr: 'قضاء حاجَة : التَّحْصِينُ الشَّامِلُ وَدَفْعُ العَيْنِ وَالسِّحْرِ',
    textAr: 'يا حفيظ يا مانع يا سلام',
    textFr: 'Protection Divine : Ya Hafiz, Ya Mani\', Ya Salam.',
    textEn: 'Divine Protection: Ya Hafiz, Ya Mani\', Ya Salam.',
    abjadValue: 881,
    recommendedSize: 3,
    descriptionFr: 'Bouclier impénétrable contre toute attaque psychique ou mauvaise intention.',
    descriptionEn: 'Impenetrable shield against spiritual harm or hostile intentions.',
    keywords: ['protection', 'sihr', 'ain', 'bouclier']
  },
  {
    id: 'besoin_taysir',
    category: 'besoin',
    titleFr: 'Besoin : Facilitation des Projets & Examens',
    titleEn: 'Need: Exam Success & Project Facilitation',
    titleAr: 'قضاء حاجَة : تَيْسِيرُ الأُمُورِ الصَّعْبَةِ وَالنَّجَاحُ',
    textAr: 'يا ميسر يا فتاح يا عليم',
    textFr: 'Facilitation & Sagesse : Ya Muyassir, Ya Fattah, Ya \'Alim.',
    textEn: 'Facilitation & Knowledge: Ya Muyassir, Ya Fattah, Ya \'Alim.',
    abjadValue: 739,
    recommendedSize: 3,
    descriptionFr: 'Aide à la réussite scolaire, concours, visas et projets professionnels.',
    descriptionEn: 'Academic success, exams, visa applications, and career goals.',
    keywords: ['examen', 'visa', 'projets', 'reussite']
  },
];

// Helper to construct odd magic square base house indices (1 to N^2)
export function getOddHouseMatrix(n: number): number[][] {
  const grid = Array.from({ length: n }, () => Array(n).fill(0));
  let r = 0;
  let c = Math.floor(n / 2);
  for (let num = 1; num <= n * n; num++) {
    grid[r][c] = num;
    let nextR = (r - 1 + n) % n;
    let nextC = (c + 1) % n;
    if (grid[nextR][nextC] !== 0) {
      r = (r + 1) % n;
    } else {
      r = nextR;
      c = nextC;
    }
  }
  return grid;
}

// Doubly even house matrix
export function getDoublyEvenHouseMatrix(n: number): number[][] {
  const grid = Array.from({ length: n }, () => Array(n).fill(0));
  let num = 1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const isDiagonal = (i % 4 === j % 4) || ((i % 4) + (j % 4) === 3);
      if (isDiagonal) {
        grid[i][j] = n * n + 1 - num;
      } else {
        grid[i][j] = num;
      }
      num++;
    }
  }
  return grid;
}

// Singly even house matrix
export function getSinglyEvenHouseMatrix(n: number): number[][] {
  const k = n / 2;
  const grid = Array.from({ length: n }, () => Array(n).fill(0));
  const sub = getOddHouseMatrix(k);
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      grid[i][j] = sub[i][j];
      grid[i + k][j + k] = sub[i][j] + k * k;
      grid[i][j + k] = sub[i][j] + 2 * k * k;
      grid[i + k][j] = sub[i][j] + 3 * k * k;
    }
  }
  const m = Math.floor(k / 2);
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < m; j++) {
      let swapCol = j;
      if (i === m && j === 0) swapCol = m;
      const temp = grid[i][swapCol];
      grid[i][swapCol] = grid[i + k][swapCol];
      grid[i + k][swapCol] = temp;
    }
  }
  for (let i = 0; i < k; i++) {
    for (let j = k - (m - 1); j < k; j++) {
      const temp = grid[i][j + k];
      grid[i][j + k] = grid[i + k][j + k];
      grid[i + k][j + k] = temp;
    }
  }
  return grid;
}

export function getBaseHouseMatrix(n: number): number[][] {
  if (n % 2 !== 0) return getOddHouseMatrix(n);
  if (n % 4 === 0) return getDoublyEvenHouseMatrix(n);
  return getSinglyEvenHouseMatrix(n);
}

// Core Khatim Generation Engine supporting Ghazali, Dahmouch (Portes 1..9), Kountiyou (Portes 1..9), Versets & Besoins, Custom
export function generateAdvancedKhatim(
  method: KhatimMethod,
  doorNumber: number, // 1 to 9
  gridSize: number, // 3 to 10
  totalWeight: number,
  versetTawqText?: string,
  customConfig?: CustomKhatimConfig
): {
  grid: (number | string)[][];
  housesGrid: number[][];
  step: number;
  remainder: number;
  minRequired: number;
  doorInfo?: KhatimDoor;
  kasrHouse: number;
  tawqFrameText: string[];
  cornerTexts: { topLeft: string; topRight: string; bottomLeft: string; bottomRight: string };
  customBadge?: string;
} {
  const n = gridSize;
  const numCells = n * n;
  const stdSum = (n * (numCells + 1)) / 2;

  // Handles Custom Mode
  if (method === 'custom' && customConfig) {
    const customGrid: (number | string)[][] = Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => {
        if (customConfig.contentType === 'text') {
          return customConfig.textGrid[r]?.[c] ?? '';
        } else {
          return customConfig.numericGrid[r]?.[c] ?? (r * n + c + 1);
        }
      })
    );

    const baseHouses = getBaseHouseMatrix(n);

    return {
      grid: customGrid,
      housesGrid: baseHouses,
      step: 0,
      remainder: 0,
      minRequired: stdSum,
      kasrHouse: 0,
      tawqFrameText: [
        customConfig.tawqTop || "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
        customConfig.tawqRight || "فَتْحٌ وَنَصْرٌ مِنَ اللَّهِ",
        customConfig.tawqBottom || "سَلاَمٌ قَوْلاً مِنْ رَبٍّ رَحِيمٍ",
        customConfig.tawqLeft || "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
      ],
      cornerTexts: {
        topLeft: customConfig.cornerTopLeft || "﷽",
        topRight: customConfig.cornerTopRight || "الله",
        bottomLeft: customConfig.cornerBottomLeft || "محمد",
        bottomRight: customConfig.cornerBottomRight || "علي",
      },
      customBadge: customConfig.badgeLabel || "KHATIM SUR-MESURE",
    };
  }

  if (totalWeight < stdSum) {
    throw new Error(
      `Le poids calculé (${totalWeight}) est inférieur au minimum requis (${stdSum}) pour un Wafq de taille ${n}x${n}.`
    );
  }

  const baseDiff = totalWeight - stdSum;
  const step = Math.floor(baseDiff / n);
  const remainder = baseDiff % n;

  // Get base houses 1..numCells
  let baseHouses = getBaseHouseMatrix(n);
  const housesGrid = Array.from({ length: n }, () => Array(n).fill(0));
  const grid: (number | string)[][] = Array.from({ length: n }, () => Array(n).fill(0));

  let doorInfo: KhatimDoor | undefined;

  if (method === 'dahmouch') {
    doorInfo = DAHMOUCH_DOORS.find((d) => d.id === doorNumber) || DAHMOUCH_DOORS[0];
    const doorShift = (doorNumber - 1);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const rawH = baseHouses[i][j];
        const shiftedH = ((rawH - 1 + doorShift) % numCells) + 1;
        housesGrid[i][j] = shiftedH;
      }
    }
  } else if (method === 'kountiyou') {
    doorInfo = KOUNTIYOU_DOORS.find((d) => d.id === doorNumber) || KOUNTIYOU_DOORS[0];
    const kountiShift = (doorNumber - 1) * Math.max(1, Math.floor(numCells / 9));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const rawH = baseHouses[i][j];
        const shiftedH = ((rawH - 1 + kountiShift) % numCells) + 1;
        housesGrid[i][j] = shiftedH;
      }
    }
  } else {
    // Ghazali or Verset/Besoin method
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        housesGrid[i][j] = baseHouses[i][j];
      }
    }
  }

  const kasrHouseMap: Record<number, number> = {
    3: 7,
    4: 13,
    5: 21,
    6: 31,
    7: 43,
    8: 57,
    9: 73,
    10: 91,
  };
  const kasrHouse = kasrHouseMap[n] || (numCells - n);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const houseVal = housesGrid[i][j];
      let val = houseVal + step * houseVal;

      if (houseVal >= kasrHouse) {
        val += remainder;
      }

      grid[i][j] = val;
    }
  }

  const tawqFrameText: string[] = [];
  if (customConfig?.tawqTop || customConfig?.tawqRight || customConfig?.tawqBottom || customConfig?.tawqLeft) {
    tawqFrameText.push(customConfig.tawqTop || "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ");
    tawqFrameText.push(customConfig.tawqRight || "فَتْحٌ وَنَصْرٌ مِنَ اللَّهِ");
    tawqFrameText.push(customConfig.tawqBottom || "سَلاَمٌ قَوْلاً مِنْ رَبٍّ رَحِيمٍ");
    tawqFrameText.push(customConfig.tawqLeft || "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ");
  } else if (versetTawqText && versetTawqText.trim()) {
    const cleanText = versetTawqText.trim();
    const words = cleanText.split(/\s+/);
    const quarter = Math.ceil(words.length / 4);
    tawqFrameText.push(words.slice(0, quarter).join(' ') || cleanText);
    tawqFrameText.push(words.slice(quarter, quarter * 2).join(' ') || cleanText);
    tawqFrameText.push(words.slice(quarter * 2, quarter * 3).join(' ') || cleanText);
    tawqFrameText.push(words.slice(quarter * 3).join(' ') || cleanText);
  } else {
    tawqFrameText.push("بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ");
    tawqFrameText.push("فَتْحٌ وَنَصْرٌ مِنَ اللَّهِ");
    tawqFrameText.push("سَلاَمٌ قَوْلاً مِنْ رَبٍّ رَحِيمٍ");
    tawqFrameText.push("حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ");
  }

  const cornerTexts = {
    topLeft: customConfig?.cornerTopLeft || "﷽",
    topRight: customConfig?.cornerTopRight || "الله",
    bottomLeft: customConfig?.cornerBottomLeft || "محمد",
    bottomRight: customConfig?.cornerBottomRight || "علي",
  };

  return {
    grid,
    housesGrid,
    step,
    remainder,
    minRequired: stdSum,
    doorInfo,
    kasrHouse,
    tawqFrameText,
    cornerTexts
  };
}

/**
 * Finds Divine Names (Asma'ullah al-Husna) whose Abjad value matches or is closely resonant with target value.
 */
export function findMatchingDivineNames(targetAdad: number, limit = 6) {
  if (!targetAdad || targetAdad <= 0) return [];
  
  const exactMatches = asmaListData.filter(a => a.abjad === targetAdad);
  const factorMatches = asmaListData.filter(a => a.abjad !== targetAdad && (targetAdad % a.abjad === 0 || a.abjad % targetAdad === 0));
  
  const sorted = [...asmaListData].sort((a, b) => {
    const diffA = Math.abs(a.abjad - targetAdad);
    const diffB = Math.abs(b.abjad - targetAdad);
    return diffA - diffB;
  });

  const combined = Array.from(new Set([...exactMatches, ...factorMatches, ...sorted]));
  return combined.slice(0, limit);
}

/**
 * Calculates Spiritual Servants (Rūḥāniyya / Khoddam) from total Adad.
 * Returns Upper Angel (Malak 'Alawi - ending in 'āyā'īl or 'īl) and Lower Servant (Khadim Sufli - ending in 'ṭash' or 'ṭūsh').
 */
export function calculateRuhaniyyaNames(totalAdad: number): {
  malakAlawi: { ar: string; fr: string; meaningFr: string };
  khadimSufli: { ar: string; fr: string; meaningFr: string };
  rawLetters: string;
} {
  const numStr = String(totalAdad);
  
  // Abjad units map
  const onesMap: Record<number, string> = { 1: 'ا', 2: 'ب', 3: 'ج', 4: 'د', 5: 'ه', 6: 'و', 7: 'ز', 8: 'ح', 9: 'ط' };
  const tensMap: Record<number, string> = { 10: 'ي', 20: 'ك', 30: 'ل', 40: 'م', 50: 'ن', 60: 'س', 70: 'ع', 80: 'ف', 90: 'ص' };
  const hundredsMap: Record<number, string> = { 100: 'ق', 200: 'ر', 300: 'ش', 400: 'ت', 500: 'ث', 600: 'خ', 700: 'ذ', 800: 'ض', 900: 'ظ' };
  const thousandsMap: Record<number, string> = { 1000: 'غ' };

  let remaining = totalAdad;
  let lettersArr: string[] = [];

  if (remaining >= 1000) {
    const countGhayn = Math.floor(remaining / 1000);
    for (let i = 0; i < countGhayn; i++) lettersArr.push('غ');
    remaining = remaining % 1000;
  }
  if (remaining >= 100) {
    const h = Math.floor(remaining / 100) * 100;
    if (hundredsMap[h]) lettersArr.push(hundredsMap[h]);
    remaining = remaining % 100;
  }
  if (remaining >= 10) {
    const t = Math.floor(remaining / 10) * 10;
    if (tensMap[t]) lettersArr.push(tensMap[t]);
    remaining = remaining % 10;
  }
  if (remaining > 0) {
    if (onesMap[remaining]) lettersArr.push(onesMap[remaining]);
  }

  const rootArabic = lettersArr.join('');
  const malakAlawiAr = `${rootArabic}يَائِيلُ`;
  const khadimSufliAr = `${rootArabic}طَيْشٍ`;

  return {
    malakAlawi: {
      ar: malakAlawiAr,
      fr: `${lettersArr.join('-')}yā'īl`,
      meaningFr: "L'Ange Céleste Lumineux gouverneur du secret de ce nombre (Malak 'Alawi)",
    },
    khadimSufli: {
      ar: khadimSufliAr,
      fr: `${lettersArr.join('-')}ṭaysh`,
      meaningFr: "L'Esprit Serviteur Terrestre exécutant le décret de ce nombre (Khadim Sufli)",
    },
    rawLetters: lettersArr.join(' + ')
  };
}

/**
 * Calculates sum verification for all rows, cols, and diagonals.
 */
export function calculateMagicSumsAudit(grid: (number | string)[][]): {
  rowSums: number[];
  colSums: number[];
  diag1Sum: number;
  diag2Sum: number;
  isMagicSquare: boolean;
  targetSum: number;
} {
  const n = grid.length;
  if (!n) return { rowSums: [], colSums: [], diag1Sum: 0, diag2Sum: 0, isMagicSquare: false, targetSum: 0 };

  const numGrid: number[][] = grid.map(row =>
    row.map(val => (typeof val === 'number' ? val : parseInt(String(val), 10) || 0))
  );

  const rowSums: number[] = numGrid.map(row => row.reduce((acc, v) => acc + v, 0));
  const colSums: number[] = Array.from({ length: n }, (_, c) =>
    numGrid.reduce((acc, row) => acc + row[c], 0)
  );

  let diag1Sum = 0;
  let diag2Sum = 0;
  for (let i = 0; i < n; i++) {
    diag1Sum += numGrid[i][i];
    diag2Sum += numGrid[i][n - 1 - i];
  }

  const targetSum = rowSums[0] || 0;
  const isMagicSquare =
    targetSum > 0 &&
    rowSums.every(s => s === targetSum) &&
    colSums.every(s => s === targetSum) &&
    diag1Sum === targetSum &&
    diag2Sum === targetSum;

  return {
    rowSums,
    colSums,
    diag1Sum,
    diag2Sum,
    isMagicSquare,
    targetSum
  };
}
