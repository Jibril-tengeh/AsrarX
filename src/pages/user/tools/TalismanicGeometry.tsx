import React, { useState, useMemo, useRef } from 'react';
import {
  Shapes,
  Sparkles,
  Compass,
  RotateCcw,
  Copy,
  Check,
  Download,
  Eye,
  Grid,
  Circle,
  PenTool,
  Layers,
  Feather,
  Info,
  Award,
  Maximize2,
  Share2,
  ShieldAlert,
  Star,
  RefreshCw,
  Wind
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { calculateAbjadValue, numberToAbjadLetters } from '../../../utils/abjad';
import KhatamBurujTab from '../../../components/talismanicGeometry/KhatamBurujTab';
import KhattMismarTab from '../../../components/talismanicGeometry/KhattMismarTab';
import KhatamRiyahTab from '../../../components/talismanicGeometry/KhatamRiyahTab';
import TashfeerHajarTab from '../../../components/talismanicGeometry/TashfeerHajarTab';
import EquilibreAlchimiqueTab from '../../../components/talismanicGeometry/EquilibreAlchimiqueTab';

const UI_TEXTS = {
  fr: {
    pageTitle: "Géométrie Talismanique (Tilasim & Khawatim)",
    pageSubtitle: "Sciences des formes sacrees, sceaux circulaires, calligraphie kufique, miroir, Dairat Al-Ghazali et tracés géométriques secrets",
    
    tabs: {
      salomon: "Sceau de Salomon",
      buruj: "Khatam al-Buruj (Zodiaque)",
      mismar: "Khatt al-Mismar (Clous)",
      riyah: "Khatam al-Riyah (Vents)",
      rupestre: "Tashfeer al-Hajar (Rupestre)",
      alchimie: "Équilibre Alchimique",
      kufi: "Calligraphie Kufique",
      ghazali: "Dairat Al-Ghazali 3x3",
      circle: "Sceau Circulaire",
      mirror: "Symétrie Miroir",
      qalam: "Angle du Qalam",
      shapes: "Formes & Chiffres"
    },

    // 1. Salomon
    salomonTitle: "1. Le Sceau des 7 Symboles de Salomon (Al-Khatam As-Suleymani)",
    salomonDesc: "Les sept caractères théurgiques majeurs attribués au Prophète Sulayman (paix sur lui) avec leurs valeurs numériques, éléments et planètes.",
    salomonCombinedAbjad: "Valeur Abjad Combinée des 7 Symboles : 992 (Lumière de Protection)",

    // 2. Kufi
    kufiTitle: "2. Générateur Calligraphique Kufique Géométrique",
    kufiDesc: "Convertit une formule ou un nom divin en matrice de pavés carrés Kufi Murabba.",
    inputTextPlaceholder: "Entrez un mot ou un Verset (ex: الله, محمد, سلام)",
    kufiColorTheme: "Thème de Couleur",

    // 3. Ghazali
    ghazaliTitle: "3. Dairat Al-Ghazali (Carré 3x3 & 8 Rotations)",
    ghazaliDesc: "Calcul du Wafq 3x3 de l'Imam Al-Ghazali (Budooh) selon une somme d'Abjad cible avec génération des 8 orientations célestes.",
    targetSumLabel: "Somme d'Abjad Cible (N)",
    miftahLabel: "Miftah (Clé - Case 1)",
    mughlaqLabel: "Mughlaq (Verrou - Case 9)",
    baqiyahLabel: "Reste (Baqiyah)",
    orientationLabel: "Orientation Céleste",

    // 4. Circular Seal
    circleTitle: "4. Sceau Circulaire Concentrique (Al-Halqah)",
    circleDesc: "Composition d'amulettes circulaires avec versets, lettres détachées et Khadim central.",
    outerTextLabel: "Cercle Extérieur (Verset / Asma)",
    middleTextLabel: "Cercle Médian (Huruf Muqatta'at)",
    coreTextLabel: "Cœur Central (Invocateur)",

    // 5. Mirror Symmetry
    mirrorTitle: "5. Symétrie Miroir Protectrice (Taqabil)",
    mirrorDesc: "Création de formules équilibrées en miroir pour les linteaux de portes et talismans.",
    presetFormulasLabel: "Formules Classiques Pré-enregistrées",

    // 6. Qalam Angle
    qalamTitle: "6. Angle de Taille du Qalam & Climat Planétaire",
    qalamDesc: "Détermine l'angle d'affûtage du roseau selon le style calligraphique et le jour de la semaine.",
    scriptTypeLabel: "Style Calligraphique",
    dayLabel: "Jour & Planète Gouvernante",

    // 7. Shapes in Numbers
    shapesTitle: "7. Analyse des Formes Géométriques Fermées",
    shapesDesc: "Correspondance ésotérique entre polygones, cercles, nombres de sommets et valeur Abjad.",

    qalamBadge: "Science des Formes Sacrées & Tilasim",
    kufiInputLabel: "Texte / Mot Divin à convertir",
    abjadWeightLabel: "Poids Abjad Correspondant :",
    celestialRotationLabel: "Rotation Céleste",
    mirrorBadge: "Amulette de Linteau en Miromorphisme",
    kufiThemes: {
      emerald: "Émeraude & Or",
      gold: "Or & Noir Sacré",
      blue: "Lapis-Lazuli & Argent",
      black: "Obsidienne & Blanc"
    },
    orientations: ['Est (شرق)', 'Nord (شمال)', 'Ouest (غرب)', 'Sud (جنوب)'],

    labels: {
      calculate: "Générer",
      copied: "Copié !",
      copy: "Copier la formule",
      downloadSVG: "Télécharger le Sceau (SVG)",
      symbolName: "Symbole",
      abjadVal: "Valeur Abjad",
      element: "Élément",
      planet: "Planète",
      meaning: "Signification Spirituelle",
      downloadParchment: "Télécharger la Fiche Talismanique",
      angle: "Angle d'Attaque (Degrés)",
      ink: "Encre Recommandée"
    }
  },
  en: {
    pageTitle: "Talismanic Geometry (Tilasim & Khawatim)",
    pageSubtitle: "Science of sacred shapes, circular seals, square Kufic calligraphy, mirror symmetry, Dairat Al-Ghazali and secret geometric seals",

    tabs: {
      salomon: "Seal of Solomon",
      buruj: "Khatam al-Buruj (Zodiac)",
      mismar: "Khatt al-Mismar (Nails)",
      riyah: "Khatam al-Riyah (Winds)",
      rupestre: "Tashfeer al-Hajar (Rock)",
      alchimie: "Alchemical Balance",
      kufi: "Kufic Calligraphy",
      ghazali: "Dairat Al-Ghazali 3x3",
      circle: "Circular Seal",
      mirror: "Mirror Symmetry",
      qalam: "Qalam Angle",
      shapes: "Shapes & Numbers"
    },

    salomonTitle: "1. The 7 Symbols Seal of Solomon (Al-Khatam As-Suleymani)",
    salomonDesc: "The seven major theurgic characters attributed to Prophet Solomon with their Abjad values, elements, and governing planets.",
    salomonCombinedAbjad: "Combined Abjad Value of 7 Symbols: 992 (Light of Protection)",

    kufiTitle: "2. Square Kufic Calligraphy Generator",
    kufiDesc: "Converts a phrase or divine name into a geometric Kufi Murabba square grid.",
    inputTextPlaceholder: "Enter a name or Verse (e.g. Allah, Muhammad, Salam)",
    kufiColorTheme: "Color Theme",

    ghazaliTitle: "3. Dairat Al-Ghazali (3x3 Square & 8 Rotations)",
    ghazaliDesc: "Calculates Imam Al-Ghazali's 3x3 Wafq (Budooh) for any target Abjad sum with 8 celestial orientations.",
    targetSumLabel: "Target Abjad Sum (N)",
    miftahLabel: "Miftah (Key - Cell 1)",
    mughlaqLabel: "Mughlaq (Lock - Cell 9)",
    baqiyahLabel: "Remainder (Baqiyah)",
    orientationLabel: "Celestial Orientation",

    circleTitle: "4. Concentric Circular Seal (Al-Halqah)",
    circleDesc: "Constructs circular talismans with concentric rings of verses, disjointed letters, and central Khadim.",
    outerTextLabel: "Outer Ring (Verse / Asma)",
    middleTextLabel: "Middle Ring (Huruf Muqatta'at)",
    coreTextLabel: "Central Core (Invocator)",

    mirrorTitle: "5. Protective Mirror Symmetry (Taqabil)",
    mirrorDesc: "Creates mirrored protective calligraphic formulas for doorway lintels and talismans.",
    presetFormulasLabel: "Preset Classical Formulas",

    qalamTitle: "6. Qalam Reed Nib Angle & Planetary Timing",
    qalamDesc: "Determines reed pen nib trimming angle according to script style and day of the week.",
    scriptTypeLabel: "Calligraphic Style",
    dayLabel: "Day & Governing Planet",

    shapesTitle: "7. Analysis of Closed Geometric Shapes",
    shapesDesc: "Esoteric resonance between polygons, circles, vertex counts, and Abjad values.",

    qalamBadge: "Science of Sacred Shapes & Tilasim",
    kufiInputLabel: "Text / Divine Word to convert",
    abjadWeightLabel: "Corresponding Abjad Weight:",
    celestialRotationLabel: "Celestial Rotation",
    mirrorBadge: "Lintel Amulet in Mirror Symmetry",
    kufiThemes: {
      emerald: "Emerald & Gold",
      gold: "Gold & Sacred Black",
      blue: "Lapis Lazuli & Silver",
      black: "Obsidian & White"
    },
    orientations: ['East (شرق)', 'North (شمال)', 'West (غرب)', 'South (جنوب)'],

    labels: {
      calculate: "Generate",
      copied: "Copied!",
      copy: "Copy Formula",
      downloadSVG: "Download Seal (SVG)",
      symbolName: "Symbol",
      abjadVal: "Abjad Value",
      element: "Element",
      planet: "Planet",
      meaning: "Spiritual Meaning",
      downloadParchment: "Download Talismanic Sheet",
      angle: "Attack Angle (Degrees)",
      ink: "Recommended Ink"
    }
  },
  ha: {
    pageTitle: "Ilimin Kayan Asiri da Siffofi (Tilasim & Khawatim)",
    pageSubtitle: "Ilimin surori na musamman, hatimai na da'ira, rubutun Kufi, rubutun madubi, Dairat Al-Ghazali da sirrin siffofi na musamman",

    tabs: {
      salomon: "Hatimin Sulaiman",
      buruj: "Khatam al-Buruj (Taurari)",
      mismar: "Khatt al-Mismar (Kusa)",
      riyah: "Khatam al-Riyah (Iska 8)",
      rupestre: "Tashfeer al-Hajar (Dutse)",
      alchimie: "Daituwar Alchimie",
      kufi: "Rubutun Kufi",
      ghazali: "Dairat Al-Ghazali 3x3",
      circle: "Hatimin Da'ira",
      mirror: "Rubutun Madubi",
      qalam: "Madaidaicin Alqalam",
      shapes: "Siffofi da Lambobi"
    },

    salomonTitle: "1. Hatimin Sulaiman mai Alamomi 7 (Al-Khatam As-Suleymani)",
    salomonDesc: "Alamomi bakwai na asiri da aka rawaito daga Annabi Sulaiman (A.S) tare da lambobinsu na Abjad.",
    salomonCombinedAbjad: "Cikakken Abjad na Alamomin 7: 992 (Hasken Kariya)",

    kufiTitle: "2. Na'urar Rubutun Kufi Murabba (Square Kufic)",
    kufiDesc: "Riddar da sunan Allah ko kalmar asiri zuwa gidan square Kufi.",
    inputTextPlaceholder: "Shigar da suna ko aya (misali: Allah, Muhammad, Salam)",
    kufiColorTheme: "Launin Hatimi",

    ghazaliTitle: "3. Dairat Al-Ghazali (Gidan Wafq 3x3 na Imam Ghazali)",
    ghazaliDesc: "Lissafin wafq 3x3 na Imam Ghazali bisa jimlar Abjad da aka zaba da jujjuyawa guda 8.",
    targetSumLabel: "Cikakken Abjad da ake bukata (N)",
    miftahLabel: "Miftah (Makulli - Gida 1)",
    mughlaqLabel: "Mughlaq (Kulle - Gida 9)",
    baqiyahLabel: "Sauran Lissafi (Baqiyah)",
    orientationLabel: "Gabas/Yamma/Arewa/Kudu",

    circleTitle: "4. Hatimin Da'ira (Al-Halqah)",
    circleDesc: "Tsara hatimi mai da'ira guda uku tare da ayoyi da haruffa.",
    outerTextLabel: "Da'irar Waje (Aya / Asma)",
    middleTextLabel: "Da'irar Tsakiya (Haruffan Asiri)",
    coreTextLabel: "Tsakiyar Hatimi (Ciki)",

    mirrorTitle: "5. Rubutun Madubi na Kariya (Taqabil)",
    mirrorDesc: "Tsara rubutun madubi na ratayawa a kofa ko jiki domin kariya.",
    presetFormulasLabel: "Zababbun Rubutun Asiri",

    qalamTitle: "6. Kwana da Fensir din Alqalam",
    qalamDesc: "Gano sirrin tsayi da kwanar alqalami don kowace ranar mako da tauraro.",
    scriptTypeLabel: "Nau'in Rubutu",
    dayLabel: "Ranar Mako & Tauraro",

    shapesTitle: "7. Binciken Siffofi da Lambobi",
    shapesDesc: "Gano sirrin triangle, square, pentagon, da da'ira a fannin Abjad.",

    qalamBadge: "Ilimin Siffofi na Musamman & Tilasim",
    kufiInputLabel: "Rubutu / Sunan Allah da za a shigar",
    abjadWeightLabel: "Nauyin Abjad da ke Tattare:",
    celestialRotationLabel: "Jujjuyawar Sama",
    mirrorBadge: "Hatimin Kofa na Rubutun Madubi",
    kufiThemes: {
      emerald: "Emerald & Gold",
      gold: "Gold & Sacred Black",
      blue: "Lapis Lazuli & Silver",
      black: "Obsidian & White"
    },
    orientations: ['Gabas (شرق)', 'Arewa (شمال)', 'Yamma (غرب)', 'Kudu (جنوب)'],

    labels: {
      calculate: "Lissafa",
      copied: "An Kwafa!",
      copy: "Kwafi Rubutu",
      downloadSVG: "Sauke Hatimi (SVG)",
      symbolName: "Alama",
      abjadVal: "Abjad",
      element: "Yanayi",
      planet: "Tauraro",
      meaning: "Ma'anar Asiri",
      downloadParchment: "Sauke Takardun Hatimi",
      angle: "Kwana (Degrees)",
      ink: "Tawada da Aka Ba da Shawara"
    }
  }
};

// Solomon symbols static reference
const SOLOMON_SYMBOLS = [
  {
    id: 1,
    symbol: "★",
    abjad: 111,
    nameFr: "Étoile à 5/6 branches (Kawkab - الكوكب)",
    nameEn: "5/6-Pointed Star (Kawkab - الكوكب)",
    nameHa: "Tauraro Mai Rassa 5/6 (Kawkab - الكوكب)",
    elementFr: "Feu", elementEn: "Fire", elementHa: "Wuta",
    planetFr: "Soleil (Shams)", planetEn: "Sun (Shams)", planetHa: "Rana (Shams)",
    meaningFr: "Lumière divine originelle, dissipation des ténèbres et victoire sur les illusions.",
    meaningEn: "Original divine light, dissipation of darkness, and victory over illusions.",
    meaningHa: "Hasken Allah na asali, kawar da duhu da nasara a kan rudani."
  },
  {
    id: 2,
    symbol: "⫴⫴⫴",
    abjad: 300,
    nameFr: "Trois Sceptres Parallèles (Sawa'il - الصوالج الثلاثة)",
    nameEn: "Three Parallel Scepters (Sawa'il)",
    nameHa: "Sanduna Uku Masu Gaba Daya (Sawa'il)",
    elementFr: "Air", elementEn: "Air", elementHa: "Iska",
    planetFr: "Mars (Mrikh)", planetEn: "Mars (Mrikh)", planetHa: "Mrikh (Mars)",
    meaningFr: "Les trois lignes de commandement spirituel et autorité sur les forces terrestres.",
    meaningEn: "The three lines of spiritual command and authority over earthly forces.",
    meaningHa: "Layi guda uku na ikon ruhi da samun nasara a kan dakarun duniya."
  },
  {
    id: 3,
    symbol: "مـ",
    abjad: 40,
    nameFr: "La Mīm Troncée (Al-Mim Al-Mubtarah - الميم المبتورة)",
    nameEn: "The Truncated Mīm (Al-Mim Al-Mubtarah)",
    nameHa: "Mim Yanke (Al-Mim Al-Mubtarah)",
    elementFr: "Eau", elementEn: "Water", elementHa: "Ruwa",
    planetFr: "Mercure (Utarid)", planetEn: "Mercury (Utarid)", planetHa: "Utarid (Mercury)",
    meaningFr: "Le secret de la royauté de Salomon et la fermeture des failles énergétiques.",
    meaningEn: "The secret of Solomon's kingship and sealing of energetic flaws.",
    meaningHa: "Sirrin mulkin Sulaiman da kulle dukkan kofofin lalacewa."
  },
  {
    id: 4,
    symbol: "⩲",
    abjad: 130,
    nameFr: "L'Échelle d'Ascension (Al-Sullam - السلم)",
    nameEn: "The Ladder of Ascension (Al-Sullam)",
    nameHa: "Tsani Na Daukaka (Al-Sullam)",
    elementFr: "Terre", elementEn: "Earth", elementHa: "Kasa",
    planetFr: "Saturne (Zuhal)", planetEn: "Saturn (Zuhal)", planetHa: "Zuhal (Saturn)",
    meaningFr: "Élévation graduelle à travers les sept sphères célestes et persévérance.",
    meaningEn: "Gradual elevation through the seven celestial spheres and perseverance.",
    meaningHa: "Daukaka sannu a hankali ta tsallake sammai bakwai da juriya."
  },
  {
    id: 5,
    symbol: "⧉",
    abjad: 400,
    nameFr: "Les Quatre Traits Quadrillés (Al-Arba'a - الأربعة)",
    nameEn: "The Four Grid Traits (Al-Arba'a)",
    nameHa: "Zane Hudu Na Gida (Al-Arba'a)",
    elementFr: "Eau", elementEn: "Water", elementHa: "Ruwa",
    planetFr: "Vénus (Zuhara)", planetEn: "Venus (Zuhara)", planetHa: "Zuhara (Venus)",
    meaningFr: "Les quatre archanges protecteurs (Jibril, Mikail, Israfil, Azrail) et stabilité.",
    meaningEn: "The four protective archangels (Jibril, Mikail, Israfil, Azrail) and stability.",
    meaningHa: "Mala'iku hudu masu tsaro (Jibril, Mikail, Israfil, Azrail) da karfi."
  },
  {
    id: 6,
    symbol: "هـ",
    abjad: 5,
    nameFr: "La Hā' Suspendue (Al-Haa - الهاء الشقيقة)",
    nameEn: "The Suspended Hā' (Al-Haa)",
    nameHa: "Ha Mai Sakayawa (Al-Haa)",
    elementFr: "Feu", elementEn: "Fire", elementHa: "Wuta",
    planetFr: "Lune (Qamar)", planetEn: "Moon (Qamar)", planetHa: "Wata (Qamar)",
    meaningFr: "Le souffle créateur (Huwa) et présence de la sakina divine dans la demeure.",
    meaningEn: "The creative breath (Huwa) and divine tranquility (Sakina) in the home.",
    meaningHa: "Lumfashi na halitta (Huwa) da natsuwa ta Allah (Sakina) a gida."
  },
  {
    id: 7,
    symbol: "و",
    abjad: 6,
    nameFr: "La Wāw Courbée (Al-Waw Al-Ma'quf - الواو المعقوف)",
    nameEn: "The Curved Wāw (Al-Waw Al-Ma'quf)",
    nameHa: "Waw Mai Lankwasa (Al-Waw Al-Ma'quf)",
    elementFr: "Air", elementEn: "Air", elementHa: "Iska",
    planetFr: "Jupiter (Mushtari)", planetEn: "Jupiter (Mushtari)", planetHa: "Mushtari (Jupiter)",
    meaningFr: "L'alliance éternelle, le lien indissoluble entre le monde céleste et terrestre.",
    meaningEn: "The eternal covenant, the unbreakable link between heavenly and earthly realms.",
    meaningHa: "Alkawari na har abada, hadin gwiwa mara tsayawa tsakanin sama da kasa."
  }
];

// Presets for Mirror Symmetry
const MIRROR_PRESETS = [
  { label: "Salamun Qawlam mir-Rabbir-Rahim", ar: "سَلاَمٌ قَوْلاً مِّن رَّبٍّ رَّحِيمٍ" },
  { label: "Masha'Allah la quwwata illa billah", ar: "مَا شَاءَ اللَّهُ لاَ قُوَّةَ إِلاَّ بِاللَّهِ" },
  { label: "Inna Fatahna Laka Fathan Mubina", ar: "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا" },
  { label: "Bismillah Ar-Rahman Ar-Rahim", ar: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ" },
  { label: "Nasrun min Allahi wa Fathun Qarib", ar: "نَصْرٌ مِّنَ اللَّهِ وَفَتْحٌ قَرِيبٌ" }
];

// Presets for Shapes
const SHAPES_DATA = [
  {
    vertices: 3,
    nameFr: "Triangle (Al-Muthallath / المثلث)",
    nameEn: "Triangle (Al-Muthallath)",
    nameHa: "Siffar Kusurwa 3 (Muthallath)",
    elementFr: "Feu (النار)", elementEn: "Fire", elementHa: "Wuta",
    abjadBase: 3,
    mysticMeaningFr: "Principe trinitaire de la création (Esprit, Âme, Corps). Symbolise la stabilité spirituelle et la condensation de la lumière.",
    mysticMeaningEn: "Trinitarian principle of creation (Spirit, Soul, Body). Symbolizes spiritual stability and light condensation.",
    mysticMeaningHa: "Tushen halitta na abubuwa uku (Ruh, Rahi, Jiki). Yana wakiltar kwanciyar hankali na ruhi."
  },
  {
    vertices: 4,
    nameFr: "Carré (Al-Murabba / المربع)",
    nameEn: "Square (Al-Murabba)",
    nameHa: "Siffar Kusurwa 4 (Murabba)",
    elementFr: "Terre (الأرض)", elementEn: "Earth", elementHa: "Kasa",
    abjadBase: 4,
    mysticMeaningFr: "Manifestation matérielle complète, 4 éléments, 4 points cardinaux et 4 archanges majeurs. Base de la science des Awfaq.",
    mysticMeaningEn: "Complete material manifestation, 4 elements, 4 cardinal points, and 4 major archangels. Foundation of Awfaq science.",
    mysticMeaningHa: "Bayyanar duniya ta cika, yanayi 4, kusurwoyi 4 da mala'iku 4. Tushen ilimin Awfaq."
  },
  {
    vertices: 5,
    nameFr: "Pentagone (Al-Mukhammas / المخمس)",
    nameEn: "Pentagon (Al-Mukhammas)",
    nameHa: "Siffar Kusurwa 5 (Mukhammas)",
    elementFr: "Air (الهواء)", elementEn: "Air", elementHa: "Iska",
    abjadBase: 5,
    mysticMeaningFr: "Symbole de la protection intégrale (Khamsa), 5 piliers, 5 prières canoniques et clé des mystères occultés.",
    mysticMeaningEn: "Symbol of complete protection (Khamsa), 5 pillars, 5 daily prayers, and key to hidden mysteries.",
    mysticMeaningHa: "Alamar kariya ta cika (Khamsa), shukoki 5, saloli 5 da mabuɗin asirai."
  },
  {
    vertices: 6,
    nameFr: "Hexagone / Étoile (Al-Musaddas / السادس)",
    nameEn: "Hexagram (Al-Musaddas)",
    nameHa: "Siffar Kusurwa 6 (Musaddas)",
    elementFr: "Eau (الماء)", elementEn: "Water", elementHa: "Ruwa",
    abjadBase: 6,
    mysticMeaningFr: "Harmonie macrocosme-microcosme, Sceau de Salomon classique, 6 jours de la création et équilibre parfait.",
    mysticMeaningEn: "Macrocosm-microcosm harmony, classic Seal of Solomon, 6 days of creation, and perfect balance.",
    mysticMeaningHa: "Daituwa ta sama da kasa, Hatimin Sulaiman na gargajiya, kwanaki 6 na halitta."
  },
  {
    vertices: 8,
    nameFr: "Octogone (Al-Muthamman / الثماني)",
    nameEn: "Octagram (Al-Muthamman)",
    nameHa: "Siffar Kusurwa 8 (Muthamman)",
    elementFr: "Axe Céleste (النور)", elementEn: "Celestial Axis", elementHa: "Gatan Sama",
    abjadBase: 8,
    mysticMeaningFr: "Les 8 Portes du Paradis et les 8 Anges porteurs du Trône Céleste (Hamalat al-Arsh). Renommé dans l'art andalou.",
    mysticMeaningEn: "The 8 Gates of Paradise and the 8 Angels bearing the Celestial Throne (Hamalat al-Arsh). Renowned in Andalusian art.",
    mysticMeaningHa: "Kofofi 8 na Aljanna da Mala'iku 8 masu dauke da Al'arshi. Sananne a fasahar Andalus."
  },
  {
    vertices: 360,
    nameFr: "Cercle Parfait (Al-Da'irah / الدائرة)",
    nameEn: "Perfect Circle (Al-Da'irah)",
    nameHa: "Da'ira mai cika (Al-Da'irah)",
    elementFr: "Lumière Absolue (Eternité)", elementEn: "Absolute Light", elementHa: "Haske Mai Dawa",
    abjadBase: 360,
    mysticMeaningFr: "L'Infini, l'Unité Absolue (Tawhid), le cycle perpétuel de l'existence sans commencement ni fin.",
    mysticMeaningEn: "Infinity, Absolute Unity (Tawhid), the perpetual cycle of existence without beginning or end.",
    mysticMeaningHa: "Kammalawa, Kadaita Allah (Tawhid), kewaye marar iyaka na rayuwa."
  }
];

export const TalismanicGeometry: React.FC = () => {
  const { language } = useLanguage();
  const { isPremium } = useAuth();
  const t = UI_TEXTS[(language as keyof typeof UI_TEXTS)] || UI_TEXTS.fr;

  const [activeTab, setActiveTab] = useState<
    'salomon' | 'buruj' | 'mismar' | 'riyah' | 'rupestre' | 'alchimie' | 'kufi' | 'ghazali' | 'circle' | 'mirror' | 'qalam' | 'shapes'
  >('salomon');

  // Selected Salomon Symbol State
  const [selectedSymbol, setSelectedSymbol] = useState(SOLOMON_SYMBOLS[0]);

  // Kufic Calligraphy State
  const [kufiInput, setKufiInput] = useState('الله');
  const [kufiTheme, setKufiTheme] = useState<'emerald' | 'gold' | 'blue' | 'black'>('emerald');

  // Ghazali 3x3 State
  const [ghazaliTargetSum, setGhazaliTargetSum] = useState<number>(66); // Default 66 (Allah)
  const [ghazaliOrientation, setGhazaliOrientation] = useState<number>(0); // 0 to 7 rotations

  // Circular Seal State
  const [outerCircleText, setOuterCircleText] = useState('سَلاَمٌ قَوْلاً مِّن رَّبٍّ رَّحِيمٍ');
  const [middleCircleText, setMiddleCircleText] = useState('كهيعص حمعسق طه يس');
  const [coreText, setCoreText] = useState('يا الله');

  // Mirror Symmetry State
  const [mirrorInput, setMirrorInput] = useState('سَلاَمٌ قَوْلاً مِّن رَّبٍّ رَّحِيمٍ');

  // Qalam Angle State
  const [scriptStyle, setScriptStyle] = useState('Thuluth');
  const [selectedDay, setSelectedDay] = useState('Vendredi');

  // Shapes State
  const [selectedShape, setSelectedShape] = useState(SHAPES_DATA[0]);

  const [copied, setCopied] = useState(false);

  // Ghazali Matrix Calculation
  const ghazaliData = useMemo(() => {
    const N = Math.max(15, ghazaliTargetSum);
    const Q = Math.floor((N - 12) / 3);
    const R = (N - 12) % 3;

    // Base Ghazali sequence relative placement (Buduh arrangement)
    //  4  9  2
    //  3  5  7
    //  8  1  6
    let baseCells = [
      Q + 3, Q + 8, Q + 1,
      Q + 2, Q + 4, Q + 6,
      Q + 7, Q + 0, Q + 5
    ];

    // Adjust for remainder according to classical rules
    if (R === 1) {
      baseCells[2] += 1; // Cell 7 (value 7) gets +1 or cell 9
    } else if (R === 2) {
      baseCells[2] += 1;
      baseCells[6] += 1;
    }

    // Orientations rotations
    const orientations = [
      [baseCells[0], baseCells[1], baseCells[2], baseCells[3], baseCells[4], baseCells[5], baseCells[6], baseCells[7], baseCells[8]], // Est
      [baseCells[6], baseCells[3], baseCells[0], baseCells[7], baseCells[4], baseCells[1], baseCells[8], baseCells[5], baseCells[2]], // Nord
      [baseCells[8], baseCells[7], baseCells[6], baseCells[5], baseCells[4], baseCells[3], baseCells[2], baseCells[1], baseCells[0]], // Ouest
      [baseCells[2], baseCells[5], baseCells[8], baseCells[1], baseCells[4], baseCells[7], baseCells[0], baseCells[3], baseCells[6]], // Sud
    ];

    const currentCells = orientations[ghazaliOrientation % 4];

    return {
      N,
      Q,
      R,
      miftah: Math.min(...currentCells),
      mughlaq: Math.max(...currentCells),
      cells: currentCells
    };
  }, [ghazaliTargetSum, ghazaliOrientation]);

  // Kufic Grid Matrix Builder
  const kufiGrid = useMemo(() => {
    const abjad = calculateAbjadValue(kufiInput);
    const size = 8;
    const grid: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

    // Seed deterministic pattern based on characters
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const val = (r * 7 + c * 13 + abjad) % 100;
        // Symmetric grid layout
        if (val > 45 || r === 0 || c === 0 || r === size - 1 || c === size - 1) {
          if ((r + c) % 2 === 0 || (r * c) % 3 === 0) {
            grid[r][c] = true;
          }
        }
      }
    }

    return { abjad, size, grid };
  }, [kufiInput]);

  // Qalam Angle Logic
  const qalamDetails = useMemo(() => {
    const stylesMap: Record<string, { angle: number; ink: { fr: string; en: string; ha: string }; desc: { fr: string; en: string; ha: string } }> = {
      Thuluth: {
        angle: 35,
        ink: { fr: "Encre de Safran & Eau de Rose", en: "Saffron Ink & Rose Water", ha: "Tawada ta Za'afaran da Ruwan Ward" },
        desc: { fr: "Angle élancé à 35° pour la puissance visuelle des versets sacrés.", en: "Slender 35° angle for visual impact of sacred verses.", ha: "Kwana na 35° domin tsayin gani na ayoyi masu tsarki." }
      },
      Kufi: {
        angle: 90,
        ink: { fr: "Encre Noire au Galle de Chêne", en: "Black Oak Gall Ink", ha: "Tawada Baka ta Itacen Oak" },
        desc: { fr: "Angle perpendiculaire pur à 90° pour la géométrie monumentale.", en: "Pure 90° perpendicular angle for monumental geometry.", ha: "Kwana na 90° na ainihi domin siffa ta gini." }
      },
      Naskh: {
        angle: 45,
        ink: { fr: "Encre Brune Traditionnelle", en: "Traditional Brown Ink", ha: "Tawada Mai Ruwan Kasa ta Gargajiya" },
        desc: { fr: "Angle équilibré à 45° pour la clarté et la fluidité des textes coraniques.", en: "Balanced 45° angle for clarity and fluidity of Quranic texts.", ha: "Kwana na 45° domin bayyanar rubutun Alqur'ani." }
      },
      Diwani: {
        angle: 60,
        ink: { fr: "Encre d'Or & Safran", en: "Gold Ink & Saffron", ha: "Tawada ta Zinare da Za'afaran" },
        desc: { fr: "Angle prononcé à 60° pour les entrelacements royaux et secrets.", en: "Pronounced 60° angle for royal and secret interlacings.", ha: "Kwana na 60° domin rubutun sarakuna da asiri." }
      },
      Nastaliq: {
        angle: 30,
        ink: { fr: "Encre de Suie de Soie", en: "Silk Soot Ink", ha: "Tawada ta Siliki da Tozan" },
        desc: { fr: "Angle fin à 30° pour la poésie spirituelle et la finesse.", en: "Fine 30° angle for spiritual poetry and delicacy.", ha: "Kwana na 30° domin rubutu mai laushi da waka." }
      }
    };

    const sel = stylesMap[scriptStyle] || stylesMap.Thuluth;
    const lang = (language as 'fr' | 'en' | 'ha') || 'fr';
    return {
      angle: sel.angle,
      ink: sel.ink[lang] || sel.ink.fr,
      desc: sel.desc[lang] || sel.desc.fr
    };
  }, [scriptStyle, language]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-purple-950 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-amber-500/30">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Shapes size={320} />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} /> {t.qalamBadge}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-amber-100">
            {t.pageTitle}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.pageSubtitle}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        {[
          { id: 'salomon', label: t.tabs.salomon, icon: Star },
          { id: 'buruj', label: t.tabs.buruj, icon: Compass },
          { id: 'mismar', label: t.tabs.mismar, icon: PenTool },
          { id: 'riyah', label: t.tabs.riyah, icon: Wind },
          { id: 'rupestre', label: t.tabs.rupestre, icon: Layers },
          { id: 'alchimie', label: t.tabs.alchimie, icon: Grid },
          { id: 'kufi', label: t.tabs.kufi, icon: Sparkles },
          { id: 'ghazali', label: t.tabs.ghazali, icon: RotateCcw },
          { id: 'circle', label: t.tabs.circle, icon: Circle },
          { id: 'mirror', label: t.tabs.mirror, icon: Maximize2 },
          { id: 'qalam', label: t.tabs.qalam, icon: Feather },
          { id: 'shapes', label: t.tabs.shapes, icon: Shapes }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SEAL OF SOLOMON */}
      {activeTab === 'salomon' && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-2xl text-amber-600 dark:text-amber-400">
                <Star size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t.salomonTitle}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t.salomonDesc}
                </p>
              </div>
            </div>

            {/* Total Combined Abjad Badge */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-center">
              <p className="font-extrabold text-amber-900 dark:text-amber-200 text-sm sm:text-base">
                {t.salomonCombinedAbjad}
              </p>
            </div>

            {/* Symbols Horizontal Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {SOLOMON_SYMBOLS.map((sym) => {
                const isSelected = selectedSymbol.id === sym.id;
                return (
                  <button
                    key={sym.id}
                    onClick={() => setSelectedSymbol(sym)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-500 shadow-xl scale-105'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-amber-400 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <span className="text-3xl font-extrabold">{sym.symbol}</span>
                    <span className="text-xs font-bold truncate max-w-full">
                      {(language === 'en' ? sym.nameEn : language === 'ha' ? sym.nameHa : sym.nameFr).split(' ')[0]}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      isSelected ? 'bg-amber-800 text-amber-100' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      Abjad {sym.abjad}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Symbol Deep Detail Card */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800/80 rounded-3xl border border-gray-200 dark:border-gray-700 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedSymbol.symbol}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">
                      {language === 'en' ? selectedSymbol.nameEn : language === 'ha' ? selectedSymbol.nameHa : selectedSymbol.nameFr}
                    </h3>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      {t.labels.abjadVal} : {selectedSymbol.abjad}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs space-y-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold">
                    {language === 'en' ? selectedSymbol.elementEn : language === 'ha' ? selectedSymbol.elementHa : selectedSymbol.elementFr}
                  </span>
                  <p className="text-gray-500 dark:text-gray-400">
                    {language === 'en' ? selectedSymbol.planetEn : language === 'ha' ? selectedSymbol.planetHa : selectedSymbol.planetFr}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.labels.meaning} :
                </span>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 leading-relaxed bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                  {language === 'en' ? selectedSymbol.meaningEn : language === 'ha' ? selectedSymbol.meaningHa : selectedSymbol.meaningFr}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: KHATAM AL-BURUJ */}
      {activeTab === 'buruj' && <KhatamBurujTab language={language} />}

      {/* TAB: KHATT AL-MISMAR */}
      {activeTab === 'mismar' && <KhattMismarTab language={language} />}

      {/* TAB: KHATAM AL-RIYAH */}
      {activeTab === 'riyah' && <KhatamRiyahTab language={language} />}

      {/* TAB: TASHFEER AL-HAJAR */}
      {activeTab === 'rupestre' && <TashfeerHajarTab language={language} />}

      {/* TAB: EQUILIBRE ALCHIMIQUE SPATIAL */}
      {activeTab === 'alchimie' && <EquilibreAlchimiqueTab language={language} />}

      {/* TAB 2: KUFIC CALLIGRAPHY */}
      {activeTab === 'kufi' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <Grid size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t.kufiTitle}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.kufiDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.kufiInputLabel}
              </label>
              <input
                type="text"
                value={kufiInput}
                onChange={(e) => setKufiInput(e.target.value)}
                placeholder={t.inputTextPlaceholder}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-bold dir-rtl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.kufiColorTheme}
              </label>
              <select
                value={kufiTheme}
                onChange={(e) => setKufiTheme(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="emerald">{t.kufiThemes.emerald}</option>
                <option value="gold">{t.kufiThemes.gold}</option>
                <option value="blue">{t.kufiThemes.blue}</option>
                <option value="black">{t.kufiThemes.black}</option>
              </select>
            </div>
          </div>

          {/* Kufic Grid Display */}
          <div className="flex flex-col items-center justify-center p-8 bg-gray-950 rounded-3xl border border-gray-800 space-y-6">
            <div className="text-center space-y-1">
              <p className="text-amber-400 font-bold text-lg dir-rtl">{kufiInput}</p>
              <p className="text-xs text-gray-400">{t.abjadWeightLabel} <strong className="text-emerald-400">{kufiGrid.abjad}</strong></p>
            </div>

            {/* Pixel Grid Rendering */}
            <div className="grid grid-cols-8 gap-1.5 p-4 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl">
              {kufiGrid.grid.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  let cellBg = cell
                    ? kufiTheme === 'emerald' ? 'bg-emerald-500 shadow-md shadow-emerald-500/50' :
                      kufiTheme === 'gold' ? 'bg-amber-400 shadow-md shadow-amber-400/50' :
                      kufiTheme === 'blue' ? 'bg-blue-500 shadow-md shadow-blue-500/50' : 'bg-white'
                    : 'bg-gray-950';

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-sm transition-all duration-300 ${cellBg}`}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DAIRAT AL-GHAZALI 3x3 */}
      {activeTab === 'ghazali' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-500/30 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-2xl text-purple-600 dark:text-purple-400">
              <Layers size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t.ghazaliTitle}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.ghazaliDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.targetSumLabel}
              </label>
              <input
                type="number"
                min={15}
                value={ghazaliTargetSum}
                onChange={(e) => setGhazaliTargetSum(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-extrabold focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.orientationLabel}
              </label>
              <button
                onClick={() => setGhazaliOrientation((prev) => (prev + 1) % 4)}
                className="w-full px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <RefreshCw size={16} />
                <span>{t.celestialRotationLabel} ({t.orientations[ghazaliOrientation % 4]})</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">{t.miftahLabel}</span>
              <span className="text-base font-extrabold text-purple-700 dark:text-purple-300">{ghazaliData.miftah}</span>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">{t.mughlaqLabel}</span>
              <span className="text-base font-extrabold text-purple-700 dark:text-purple-300">{ghazaliData.mughlaq}</span>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">{t.baqiyahLabel}</span>
              <span className="text-base font-extrabold text-purple-700 dark:text-purple-300">{ghazaliData.R}</span>
            </div>
          </div>

          {/* 3x3 Matrix Wafq */}
          <div className="max-w-md mx-auto p-6 bg-gradient-to-b from-purple-950 to-slate-950 rounded-3xl border border-purple-500/40 shadow-2xl">
            <div className="grid grid-cols-3 gap-3 text-center">
              {ghazaliData.cells.map((val, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-purple-900/40 border border-purple-400/30 rounded-2xl text-amber-300 font-extrabold text-xl sm:text-2xl shadow-inner flex flex-col items-center justify-center"
                >
                  <span>{val}</span>
                  <span className="text-[10px] text-purple-300 font-normal mt-1 dir-rtl">{numberToAbjadLetters(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CIRCULAR SEAL */}
      {activeTab === 'circle' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/30 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-2xl text-blue-600 dark:text-blue-400">
              <Circle size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t.circleTitle}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.circleDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.outerTextLabel}</label>
              <input
                type="text"
                value={outerCircleText}
                onChange={(e) => setOuterCircleText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white dir-rtl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.middleTextLabel}</label>
              <input
                type="text"
                value={middleCircleText}
                onChange={(e) => setMiddleCircleText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white dir-rtl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.coreTextLabel}</label>
              <input
                type="text"
                value={coreText}
                onChange={(e) => setCoreText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white dir-rtl"
              />
            </div>
          </div>

          {/* SVG Concentric Rendering */}
          <div className="flex flex-col items-center justify-center p-8 bg-slate-950 rounded-3xl border border-slate-800">
            <svg width="280" height="280" viewBox="0 0 300 300" className="text-amber-400">
              <circle cx="150" cy="150" r="140" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
              <circle cx="150" cy="150" r="105" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="70" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="150" cy="150" r="35" fill="none" stroke="#10b981" strokeWidth="2" />

              {/* Text paths */}
              <path id="outerPath" d="M 150, 150 m -125, 0 a 125,125 0 1,1 250,0 a 125,125 0 1,1 -250,0" fill="none" />
              <text fontSize="10" fill="#f59e0b" fontWeight="bold">
                <textPath href="#outerPath" startOffset="0%">{outerCircleText}</textPath>
              </text>

              <path id="middlePath" d="M 150, 150 m -90, 0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0" fill="none" />
              <text fontSize="11" fill="#38bdf8" fontWeight="bold">
                <textPath href="#middlePath" startOffset="0%">{middleCircleText}</textPath>
              </text>

              {/* Core Text */}
              <text x="150" y="155" textAnchor="middle" fontSize="16" fill="#10b981" fontWeight="extrabold">
                {coreText}
              </text>
            </svg>
          </div>
        </div>
      )}

      {/* TAB 5: MIRROR SYMMETRY */}
      {activeTab === 'mirror' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-500/30 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-3 bg-teal-100 dark:bg-teal-900/50 rounded-2xl text-teal-600 dark:text-teal-400">
              <Maximize2 size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t.mirrorTitle}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.mirrorDesc}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              {t.presetFormulasLabel}
            </label>
            <div className="flex flex-wrap gap-2">
              {MIRROR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setMirrorInput(preset.ar)}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-all cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <input
              type="text"
              value={mirrorInput}
              onChange={(e) => setMirrorInput(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-base font-bold text-center dir-rtl focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          {/* Mirror Display Panel */}
          <div className="p-8 bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 rounded-3xl border border-teal-500/40 text-center space-y-6">
            <div className="text-xs text-amber-400 font-bold uppercase tracking-widest">{t.mirrorBadge}</div>
            <div className="flex items-center justify-center gap-6 text-xl sm:text-3xl font-extrabold text-amber-300 dir-rtl">
              <span>{mirrorInput}</span>
              <span className="text-teal-400 font-normal">| ⚜ |</span>
              <span className="inline-block transform scale-x-[-1]">{mirrorInput}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: QALAM ANGLE */}
      {activeTab === 'qalam' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/30 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl text-indigo-600 dark:text-indigo-400">
              <PenTool size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t.qalamTitle}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.qalamDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.scriptTypeLabel}</label>
              <select
                value={scriptStyle}
                onChange={(e) => setScriptStyle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Thuluth">Thuluth (الscript الثلث)</option>
                <option value="Kufi">Kufi (الخط الكوفي Monumental)</option>
                <option value="Naskh">Naskh (الخط النسخي Coranique)</option>
                <option value="Diwani">Diwani (الخط الديواني Royal)</option>
                <option value="Nastaliq">Nasta'liq (الخط النستعليق Fine)</option>
              </select>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-1">
              <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300">{t.labels.angle} :</span>
              <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{qalamDetails.angle}°</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{qalamDetails.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SHAPES & NUMBERS */}
      {activeTab === 'shapes' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-2xl text-amber-600 dark:text-amber-400">
              <Shapes size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t.shapesTitle}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.shapesDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SHAPES_DATA.map((s) => {
              const isSelected = selectedShape.vertices === s.vertices;
              return (
                <button
                  key={s.vertices}
                  onClick={() => setSelectedShape(s)}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-500 shadow-xl scale-105'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-amber-400 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <span className="text-2xl font-extrabold">{s.vertices === 360 ? "◯" : `${s.vertices}★`}</span>
                  <span className="text-xs font-bold truncate max-w-full">
                    {language === 'en' ? s.nameEn.split(' ')[0] : language === 'ha' ? s.nameHa.split(' ')[0] : s.nameFr.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Shape Detail */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800/80 rounded-3xl border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                {language === 'en' ? selectedShape.nameEn : language === 'ha' ? selectedShape.nameHa : selectedShape.nameFr}
              </h3>
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-extrabold text-xs rounded-full">
                {language === 'en' ? selectedShape.elementEn : language === 'ha' ? selectedShape.elementHa : selectedShape.elementFr}
              </span>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              {language === 'en' ? selectedShape.mysticMeaningEn : language === 'ha' ? selectedShape.mysticMeaningHa : selectedShape.mysticMeaningFr}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalismanicGeometry;
