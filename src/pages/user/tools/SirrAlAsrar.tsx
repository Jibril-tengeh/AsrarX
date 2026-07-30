import React, { useState, useEffect, useMemo } from 'react';
import { 
  Eye, ArrowLeft, RefreshCw, Key, Flame, Wind, Droplets, Mountain, 
  Sparkles, Lock, BookOpen, Compass, Calendar, Feather, Copy, Check, 
  Share2, Download, Star, Shield, Heart, Award, Info, Save, User, 
  Users, CheckCircle2, Volume2, Printer, Trash2, ExternalLink 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useFeatures } from '../../../contexts/FeatureContext';
import { motion, AnimatePresence } from 'motion/react';
import { PremiumWrapper } from '../../../components/PremiumWrapper';
import { asmaListData } from '../../../data/asmaListData';

// Localized Dictionary for Sirr Al-Asrar
const sirrDict = {
  fr: {
    backToTools: "Retour aux outils",
    title: "Sirr Al-Asrar (Le Secret des Secrets)",
    subtitle: "Extraction ésotérique absolue de votre essence : Jafr, Khuddam, Wafq & Aura",
    warningNotice: "Ce module extrait les secrets les plus profonds de la science du Jafr et du Ruhaniyat. Il révèle la signature cosmique, l'ange céleste (Ulwi), le serviteur terrestre (Sufli) et le Khatim de votre essence.",
    yourName: "Votre Prénom",
    motherName: "Prénom de la Mère",
    motherPlaceholder: "Obligatoire dans la tradition (Ex: Fatima)",
    namePlaceholder: "Ex: Ahmad",
    arabicNameLabel: "Représentation Arabe (Ajustable pour précision)",
    arabicMotherLabel: "Représentation Arabe Mère (Ajustable)",
    abjadSystem: "Système d'Abjad",
    mashriqi: "Mashriqi (Orient / Standard)",
    maghribi: "Maghribi (Afrique du Nord / Ouest)",
    presets: "Profils d'exemples rapides :",
    extractBtn: "Extraire le Code Spirituel",
    calculating: "Extraction de l'Essence Cosmique...",
    recalculate: "Nouvelle Analyse",
    saveProfile: "Sauvegarder ce Profil",
    profileSaved: "Profil sauvegardé dans votre espace !",
    savedProfiles: "Profils Enregistrés",
    noSavedProfiles: "Aucun profil enregistré",

    // Tabs
    tabOverview: "Extraction & Essence",
    tabKhatim: "Carré Magique 3x3",
    tabWird: "Wird & Noms Divins",
    tabAura: "Aura & Éléments",
    tabScroll: "Parchemin & Sceau",

    // Tab 1: Essence
    totalWeight: "Poids Mystique Global (Adad al-Jumla)",
    personWeight: "Poids Prénom",
    motherWeight: "Poids Mère",
    adadSaghir: "Poids Réduit (Adad Saghir)",
    angelicIdentity: "Ange de Lumière Céleste (Ulwi)",
    angelicDesc: "Entité angélique régissant la protection et l'élévation spirituelle liée à votre nom.",
    servantIdentity: "Serviteur Terrestre (Sufli)",
    servantDesc: "Esprit servant de la matière et du monde physique agissant en accord avec votre vibration.",
    secretCode: "Sceau Numérique Ancien",
    divineNamesResonance: "Résonance avec les Noms Divins (Asma al-Husna)",
    divineNamesDesc: "Noms d'Allah dont les énergies s'harmonisent directement avec votre poids abjad :",

    // Tab 2: Khatim
    khatimTitle: "Carré Magique d'Essence (Wafq Muthalath 3x3)",
    khatimSub: "Basé sur la règle de l'Imam Al-Ghazali pour équilibrer les 4 éléments et attirer la Baraka",
    miftah: "Miftah (Clé d'entrée)",
    maghlag: "Maghlag (Fermeture)",
    rowColSum: "Somme Magique de chaque Ligne / Colonne / Diagonale",
    khatimRules: "Consignes de traçage : Tracer sur du papier propre avec du Safran et de l'Eau de Rose au jour et à l'heure indiqués.",

    // Tab 3: Wird
    wirdTitle: "Wird Personnel & Prescriptions Spirituelles",
    wirdSub: "Pratiques d'évocation quotidienne pour activer les Khuddam et purifier votre aura",
    dailyZikrCount: "Nombre de Zikr Quotidien Recommandé",
    zikrTime: "Moment d'Invocation Optimal",
    bestTimeVal: "Après la prière du Fajr ou lors du dernier tiers de la nuit (Tahajjud)",
    recommendedAyah: "Verset Coranique d'Harmonie",
    quranicEx: "Ce verset contient la fréquence exacte de votre élément dominant.",
    recitationAudio: "Écouter la prononciation",

    // Tab 4: Aura
    cosmicProfile: "Profil Élémental & Cosmologique",
    elementalBalance: "Répartition des 4 Éléments (Tabai')",
    dominantElement: "Élément Dominant",
    dominantPlanet: "Astre / Planète Dominante",
    powerDay: "Jour de Pouvoir Quotidien",
    incenseBakhur: "Encens (Bakhur) d'Invocation",
    lunarMansion: "Demeure Lonaire Rattachée (Manzil al-Qamar)",
    auraScore: "Indice de Protection Spirituelle & Baraka",
    auraLevelHigh: "Très Élevé — Aura Lumineuse & Réceptive",

    // Tab 5: Parchment
    scrollTitle: "Parchemin de Transmission Mystique",
    scrollSub: "Attestation complète imprimable contenant l'intégralité de vos attributs spirituels",
    copyScroll: "Copier le Parchemin",
    copied: "Copié dans le presse-papier !",
    printScroll: "Imprimer / Télécharger",
    shareScroll: "Partager"
  },
  en: {
    backToTools: "Back to tools",
    title: "Sirr Al-Asrar (The Secret of Secrets)",
    subtitle: "Absolute esoteric extraction of your essence: Jafr, Khuddam, Wafq & Aura",
    warningNotice: "This module extracts the deepest secrets of Jafr and Ruhaniyat science. It reveals the cosmic signature, heavenly angel (Ulwi), terrestrial servant (Sufli), and Khatim of your essence.",
    yourName: "Your First Name",
    motherName: "Mother's First Name",
    motherPlaceholder: "Required in traditional practice (E.g.: Fatima)",
    namePlaceholder: "E.g.: Ahmad",
    arabicNameLabel: "Arabic Representation (Adjustable for precision)",
    arabicMotherLabel: "Mother's Arabic Representation (Adjustable)",
    abjadSystem: "Abjad Calculation System",
    mashriqi: "Mashriqi (Eastern / Standard)",
    maghribi: "Maghribi (North/West African)",
    presets: "Quick sample profiles:",
    extractBtn: "Extract Spiritual Code",
    calculating: "Extracting Cosmic Essence...",
    recalculate: "New Analysis",
    saveProfile: "Save Profile",
    profileSaved: "Profile saved to your space!",
    savedProfiles: "Saved Profiles",
    noSavedProfiles: "No saved profiles yet",

    // Tabs
    tabOverview: "Extraction & Essence",
    tabKhatim: "3x3 Magic Square",
    tabWird: "Wird & Divine Names",
    tabAura: "Aura & Elements",
    tabScroll: "Scroll & Seal",

    // Tab 1: Essence
    totalWeight: "Global Mystical Weight (Adad al-Jumla)",
    personWeight: "Name Weight",
    motherWeight: "Mother Weight",
    adadSaghir: "Reduced Weight (Adad Saghir)",
    angelicIdentity: "Heavenly Light Angel (Ulwi)",
    angelicDesc: "Angelic entity governing spiritual elevation and divine protection linked to your name.",
    servantIdentity: "Terrestrial Servant (Sufli)",
    servantDesc: "Material realm servant acting in harmony with your name's vibration.",
    secretCode: "Ancient Numerical Cipher",
    divineNamesResonance: "Resonance with Divine Names (Asma al-Husna)",
    divineNamesDesc: "Names of Allah whose frequencies directly resonate with your Abjad weight:",

    // Tab 2: Khatim
    khatimTitle: "3x3 Magic Square of Essence (Wafq Muthalath)",
    khatimSub: "Based on Imam Al-Ghazali's rule to balance the 4 elements and attract Baraka",
    miftah: "Miftah (Entry Key)",
    maghlag: "Maghlag (Closing House)",
    rowColSum: "Magic Sum of each Row / Column / Diagonal",
    khatimRules: "Tracing instructions: Draw on clean parchment with Saffron and Rosewater on your day and hour of power.",

    // Tab 3: Wird
    wirdTitle: "Personal Wird & Spiritual Prescriptions",
    wirdSub: "Daily invocation practices to activate Khuddam and purify your aura",
    dailyZikrCount: "Recommended Daily Zikr Count",
    zikrTime: "Optimal Recitation Timing",
    bestTimeVal: "After Fajr prayer or during the last third of the night (Tahajjud)",
    recommendedAyah: "Harmonious Quranic Verse",
    quranicEx: "This verse embodies the frequency of your dominant element.",
    recitationAudio: "Pronounce Khuddam",

    // Tab 4: Aura
    cosmicProfile: "Elemental & Cosmological Profile",
    elementalBalance: "4 Elements Distribution (Tabai')",
    dominantElement: "Dominant Element",
    dominantPlanet: "Dominant Planet / Star",
    powerDay: "Daily Power Day",
    incenseBakhur: "Invocation Incense (Bakhur)",
    lunarMansion: "Associated Lunar Mansion (Manzil al-Qamar)",
    auraScore: "Spiritual Protection & Baraka Index",
    auraLevelHigh: "Very High — Luminous & Receptive Aura",

    // Tab 5: Parchment
    scrollTitle: "Mystic Transmission Parchment",
    scrollSub: "Full printable certificate containing all your spiritual attributes",
    copyScroll: "Copy Parchment",
    copied: "Copied to clipboard!",
    printScroll: "Print / Download",
    shareScroll: "Share"
  },
  ha: {
    backToTools: "Koma zuwa kayan aiki",
    title: "Sirr Al-Asrar (Sirrin Sirru)",
    subtitle: "Fitar da zurfin asirin ruhi, Khuddam, Wafq da Aura",
    warningNotice: "Wannan bangare yana fitar da sirri mafi zurfi na ilimin Jafr da Ruhaniyat. Yana bayyana Mala'ikan sama (Ulwi), Khadimin qasa (Sufli), da Hatimin ruhin sunayenku.",
    yourName: "Sunanka",
    motherName: "Sunan Uwa",
    motherPlaceholder: "Lalle ne acikin al'ada (Misali: Fatima)",
    namePlaceholder: "Misali: Ahmad",
    arabicNameLabel: "Rubutun Larabci (Za ka iya gyara)",
    arabicMotherLabel: "Rubutun Larabcin Mame (Za ka iya gyara)",
    abjadSystem: "Tsarin Lissafin Abjad",
    mashriqi: "Mashriqi (Gabashi / Daidaitaccen)",
    maghribi: "Maghribi (Yammacin Afirka)",
    presets: "Samfuran sunaye da sauri:",
    extractBtn: "Fitar da Lambar Ruhi",
    calculating: "Ana Fitar da Sirrin Ruhi...",
    recalculate: "Sabuwar Bincike",
    saveProfile: "Ajiye Wannan Sunan",
    profileSaved: "An ajiye sunan a muhallinki!",
    savedProfiles: "Sunayen da aka Ajiye",
    noSavedProfiles: "Babu sunan da aka ajiye tukuna",

    // Tabs
    tabOverview: "Binciken Sirri",
    tabKhatim: "Hatimin Wafq 3x3",
    tabWird: "Wuridi & Sunayen Allah",
    tabAura: "Aura & Parman Ruhi",
    tabScroll: "Takardar Sirri",

    // Tab 1: Essence
    totalWeight: "Cikakken Nauyin Sirri (Adad al-Jumla)",
    personWeight: "Nauyin Suna",
    motherWeight: "Nauyin Uwa",
    adadSaghir: "Rage Nauyi (Adad Saghir)",
    angelicIdentity: "Mala'ikan Hasken Sama (Ulwi)",
    angelicDesc: "Mala'ika mai kula da daukaka da kariya ta ruhi ga sunanku.",
    servantIdentity: "Khadimin Duniya (Sufli)",
    servantDesc: "Aba mai hidima a duniyar al'amuran yau da kullum dake amsa amsawar sunanka.",
    secretCode: "Lambar Asiri Ta Tsohuwar Harshe",
    divineNamesResonance: "Gamuwa da Sunayen Allah (Asma al-Husna)",
    divineNamesDesc: "Sunayen Allah masu karfi dake dacewa da lissafin abjad na sunayenku:",

    // Tab 2: Khatim
    khatimTitle: "Hatimin Wafq na Sirri 3x3",
    khatimSub: "Bisa tafarkin Imam Al-Ghazali don daidaita kariya da janyo albarka",
    miftah: "Miftah (Makullin Shiga)",
    maghlag: "Maghlag (Rufe Gida)",
    rowColSum: "Jimillar Sirri na Kowane Layi / Tsawo / Kwana",
    khatimRules: "Ka'idojin Rubutu: Rubuta a kan takarda mai kyau da Za'afaran da Ruwan Ward, a ranar girmamawa da sa'a mai albarka.",

    // Tab 3: Wird
    wirdTitle: "Wuridin Kanka & Jagorancin Ruhi",
    wirdSub: "Bada hakkin wuridi na yau da kullum don kunna Khuddam da tsarkake zuciya",
    dailyZikrCount: "Adadin Zikiri na Yau da Kullum",
    zikrTime: "Lokaci Mafi Kyawun Zikiri",
    bestTimeVal: "Bayan sallar Subahi ko a sulusin karshe na dare (Tahajjud)",
    recommendedAyah: "Ayar Kur'ani mai Dacewa",
    quranicEx: "Wannan aya tana dauke da karfin cikar sinadarin ruhin sunanku.",
    recitationAudio: "Furta Sunan Khuddam",

    // Tab 4: Aura
    cosmicProfile: "Binciken Sinadaran Halitta da Taurari",
    elementalBalance: "Rabowar Sinadari 4 (Tabai')",
    dominantElement: "Sinadari Mafi Karfi",
    dominantPlanet: "Tauraron Shugabanci",
    powerDay: "Ranar Karfi",
    incenseBakhur: "Turaren Wuta (Bakhur)",
    lunarMansion: "Manzilin Wata (Manzil al-Qamar)",
    auraScore: "Darajar Kariyar Ruhi & Albarka",
    auraLevelHigh: "Mafi Daukaka — Hasken Aura Mai Karfi",

    // Tab 5: Parchment
    scrollTitle: "Shaidar Takardar Sirri",
    scrollSub: "Cikakken sakamakon binciken ruhi da za ka iya saukewa ko bugawa",
    copyScroll: "Kwapfe Rubutun",
    copied: "An kwapfe zuwa allon kwapfe!",
    printScroll: "Buga / Sauke",
    shareScroll: "Raba"
  }
};

// Abjad mapping Tables
const abjadMashriqi: Record<string, number> = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1,
  'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5,
  'و': 6, 'ؤ': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ى': 10, 'ئ': 10, 'ك': 20, 'ل': 30,
  'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80,
  'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400,
  'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900,
  'غ': 1000
};

const abjadMaghribi: Record<string, number> = {
  ...abjadMashriqi,
  'س': 300, 'ش': 1000, 'ص': 60, 'ض': 90, 'ظ': 800, 'غ': 900
};

// Letter to element mapping
const LETTER_ELEMENTS: Record<string, 'fire' | 'air' | 'water' | 'earth'> = {
  'ا': 'fire', 'أ': 'fire', 'إ': 'fire', 'آ': 'fire', 'ء': 'fire', 'ه': 'fire', 'ة': 'fire', 'ط': 'fire', 'م': 'fire', 'ف': 'fire', 'ش': 'fire', 'ذ': 'fire',
  'ب': 'air', 'و': 'air', 'ؤ': 'air', 'ي': 'air', 'ى': 'air', 'ئ': 'air', 'ن': 'air', 'ص': 'air', 'ت': 'air', 'ض': 'air',
  'ج': 'water', 'ز': 'water', 'ك': 'water', 'س': 'water', 'ق': 'water', 'ث': 'water', 'ظ': 'water',
  'د': 'earth', 'ح': 'earth', 'ل': 'earth', 'ع': 'earth', 'ر': 'earth', 'خ': 'earth', 'غ': 'earth'
};

// Automatic Latin to Arabic transliteration helper
const latinToArabicName = (str: string): string => {
  if (!str) return '';
  if (/[\u0600-\u06FF]/.test(str)) return str.trim();

  let cleaned = str.toLowerCase().trim();

  const digraphs: [RegExp, string][] = [
    [/ahmad/g, 'أحمد'],
    [/muhammad/g, 'محمد'],
    [/fatima/g, 'فاطمة'],
    [/ibrahim/g, 'إبراهيم'],
    [/mariam/g, 'مريم'],
    [/musa/g, 'موسى'],
    [/khadija/g, 'خديجة'],
    [/ali/g, 'علي'],
    [/aisha/g, 'عائشة'],
    [/ou/g, 'و'],
    [/kh/g, 'خ'],
    [/sh/g, 'ش'],
    [/ch/g, 'ش'],
    [/dh/g, 'ذ'],
    [/th/g, 'ث'],
    [/gh/g, 'غ'],
    [/ph/g, 'ف'],
    [/aa/g, 'ا'],
    [/ee/g, 'ي'],
    [/oo/g, 'و'],
  ];

  for (const [regex, replacement] of digraphs) {
    if (typeof replacement === 'string' && regex.test(cleaned)) {
      cleaned = cleaned.replace(regex, replacement);
    }
  }

  const charMap: Record<string, string> = {
    'a': 'ا', 'b': 'ب', 'c': 'ك', 'd': 'د', 'e': 'ي',
    'f': 'ف', 'g': 'ج', 'h': 'ه', 'i': 'ي', 'j': 'ج',
    'k': 'ك', 'l': 'ل', 'm': 'م', 'n': 'ن', 'o': 'و',
    'p': 'ب', 'q': 'ق', 'r': 'ر', 's': 'س', 't': 'ت',
    'u': 'و', 'v': 'ف', 'w': 'و', 'x': 'كس', 'y': 'ي',
    'z': 'ز', ' ': ' '
  };

  let res = '';
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (/[\u0600-\u06FF]/.test(ch)) {
      res += ch;
    } else if (charMap[ch]) {
      res += charMap[ch];
    }
  }
  return res || str;
};

// Calculate Abjad numerical value
const computeAbjad = (text: string, isMaghribi: boolean): number => {
  const table = isMaghribi ? abjadMaghribi : abjadMashriqi;
  let sum = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (table[ch]) {
      sum += table[ch];
    }
  }
  return sum;
};

export const SirrAlAsrar: React.FC = () => {
  const { language, t } = useLanguage();
  const lang = (language as 'fr' | 'en' | 'ha') || 'fr';
  const labels = sirrDict[lang] || sirrDict.fr;

  const { user } = useAuth();
  const { featureToggles } = useFeatures();
  const toolStatus = featureToggles['tool_sirr'] || 'active';
  const isPremiumRequired = toolStatus === 'premium';
  const navigate = useNavigate();

  // Inputs State
  const [name, setName] = useState('Ahmad');
  const [motherName, setMotherName] = useState('Fatima');
  const [arabicName, setArabicName] = useState('أحمد');
  const [arabicMother, setArabicMother] = useState('فاطمة');
  const [isMaghribi, setIsMaghribi] = useState(false);

  // Auto-update Arabic when Latin changes if user hasn't explicitly edited
  useEffect(() => {
    if (name) {
      setArabicName(latinToArabicName(name));
    }
  }, [name]);

  useEffect(() => {
    if (motherName) {
      setArabicMother(latinToArabicName(motherName));
    }
  }, [motherName]);

  // UI State
  const [activeTab, setActiveTab] = useState<'overview' | 'khatim' | 'wird' | 'aura' | 'scroll'>('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedScroll, setCopiedScroll] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState('');

  // Load saved profiles from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('asrar_profiles');
      if (saved) setSavedProfiles(JSON.parse(saved));
    } catch (e) {
      console.warn("Failed to load saved profiles", e);
    }
  }, []);

  const handleSaveProfile = () => {
    if (!result) return;
    const newProfile = {
      id: Date.now().toString(),
      name,
      motherName,
      arabicName,
      arabicMother,
      total: result.total,
      timestamp: new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'ha' ? 'ha-NG' : 'en-US')
    };
    const updated = [newProfile, ...savedProfiles.filter(p => p.name !== name || p.motherName !== motherName)].slice(0, 8);
    setSavedProfiles(updated);
    localStorage.setItem('asrar_profiles', JSON.stringify(updated));
    setToastMsg(labels.profileSaved);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleDeleteProfile = (id: string) => {
    const updated = savedProfiles.filter(p => p.id !== id);
    setSavedProfiles(updated);
    localStorage.setItem('asrar_profiles', JSON.stringify(updated));
  };

  // Perform Deep Esoteric Calculation
  const calculateSirr = () => {
    if (!name || !motherName) return;

    // Gamification stats update
    try {
      let stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}');
      if (!stats || typeof stats !== 'object') stats = {};
      stats.tools_used = (stats.tools_used || 0) + 1;
      localStorage.setItem('asrar_stats', JSON.stringify(stats));
    } catch (e) {
      console.warn("Stats update warning", e);
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Calculate Abjad scores
      const pAr = arabicName || latinToArabicName(name);
      const mAr = arabicMother || latinToArabicName(motherName);

      let score1 = computeAbjad(pAr, isMaghribi);
      let score2 = computeAbjad(mAr, isMaghribi);

      // Fallback if score is 0 due to non-Arabic script
      if (score1 === 0) {
        for (let i = 0; i < name.length; i++) score1 += name.charCodeAt(i) % 100;
      }
      if (score2 === 0) {
        for (let i = 0; i < motherName.length; i++) score2 += motherName.charCodeAt(i) % 100;
      }

      const total = score1 + score2;

      // Adad Saghir (Reduced Value)
      let saghir = total;
      while (saghir > 9) {
        saghir = saghir.toString().split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
      }

      // Elemental Breakdown by Letter Count
      const combinedArabic = pAr + mAr;
      const elementCounts = { fire: 0, air: 0, water: 0, earth: 0 };
      let totalLetters = 0;

      for (let i = 0; i < combinedArabic.length; i++) {
        const ch = combinedArabic[i];
        if (LETTER_ELEMENTS[ch]) {
          elementCounts[LETTER_ELEMENTS[ch]]++;
          totalLetters++;
        }
      }

      if (totalLetters === 0) {
        elementCounts.fire = 1; elementCounts.air = 1; elementCounts.water = 1; elementCounts.earth = 1;
        totalLetters = 4;
      }

      const elemPercents = {
        fire: Math.round((elementCounts.fire / totalLetters) * 100),
        air: Math.round((elementCounts.air / totalLetters) * 100),
        water: Math.round((elementCounts.water / totalLetters) * 100),
        earth: Math.round((elementCounts.earth / totalLetters) * 100)
      };

      // Tabai' Dominant Element
      const elementList = [
        { 
          type: 'water', 
          nameFr: "Eau (Ma' - ماء)", nameEn: "Water (Ma')", nameHa: "Ruwa (Ma')", 
          icon: Droplets, color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
          descFr: "Froide et humide. Attire l'intuition, les connaissances cachées, l'apaisement des cœurs et la réceptivité divine.",
          descEn: "Cold and humid. Attracts intuition, hidden wisdom, inner peace, and divine receptivity.",
          descHa: "Sanyi da danshi. Yana janyo basira, ilimin sirri, nutsuwa da samun hasken ruhi."
        },
        { 
          type: 'fire', 
          nameFr: "Feu (Nar - نار)", nameEn: "Fire (Nar)", nameHa: "Wuta (Nar)", 
          icon: Flame, color: "text-red-500 bg-red-500/10 border-red-500/30",
          descFr: "Chaud et sec. Énergie de domination, de rapidité, d'autorité, de courage et d'élimination des obstacles.",
          descEn: "Warm and dry. Energy of leadership, speed, authority, courage, and clearing obstacles.",
          descHa: "Zafi da bushewa. Karfin shugabanci, hanzari, kariya daga makiya da daukaka."
        },
        { 
          type: 'earth', 
          nameFr: "Terre (Turab - تراب)", nameEn: "Earth (Turab)", nameHa: "Ƙasa (Turab)", 
          icon: Mountain, color: "text-amber-600 bg-amber-500/10 border-amber-500/30",
          descFr: "Froide et sèche. Stabilité, ancrage, prospérité matérielle, richesses terrestres et grande patience.",
          descEn: "Cold and dry. Stability, grounding, material prosperity, worldly blessings, and deep patience.",
          descHa: "Sanyi da bushewa. Natsuwa, samun dukiya, albarkar gida da haquri mai yawa."
        },
        { 
          type: 'air', 
          nameFr: "Air (Hawa - هواء)", nameEn: "Air (Hawa)", nameHa: "Iska (Hawa)", 
          icon: Wind, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
          descFr: "Chaud et humide. Mouvement, communication, voyages, rayonnement intellectuel et harmonie.",
          descEn: "Warm and humid. Movement, communication, travel, intellectual brilliance, and social harmony.",
          descHa: "Zafi da danshi. Motsi, sadarwa, tafiye-tafiye, daukakar fahimta da zamantakewa."
        }
      ];
      const dominantElement = elementList[total % 4];

      // Kawakib (7 Astrological Planets) & Days
      const planets = [
        { 
          pFr: "Zuhal (Saturne - زحل)", pEn: "Saturn (Zuhal)", pHa: "Zuhal (Saturn)", 
          dFr: "Samedi", dEn: "Saturday", dHa: "Asabar", 
          bFr: "Myrrhe, Storax & Oliban", bEn: "Myrrh, Storax & Olibanum", bHa: "Kafin turare, Mistik",
          sFr: "Jour de purification, de fermeté et de protection contre les énergies lourdes.",
          sEn: "Day of purification, resilience, and shielding against heavy energies.",
          sHa: "Rana ce ta tsarkakewa, kariya daga sharri da karfafa zuciya."
        },
        { 
          pFr: "Shams (Soleil - شمس)", pEn: "Sun (Shams)", pHa: "Shams (Rana)", 
          dFr: "Dimanche", dEn: "Sunday", dHa: "Lahadi", 
          bFr: "Oliban pur, Mastic & Santal jaune", bEn: "Pure Olibanum, Mastic & Yellow Sandalwood", bHa: "Laddan, Luban mai kyau",
          sFr: "Jour d'élévation, de lumière divine, de prestige et d'ouverture de célébrité.",
          sEn: "Day of elevation, divine light, prestige, and opening of recognition.",
          sHa: "Rana ce ta daukaka, hasken nasara, kwarjini da samun babban rabo."
        },
        { 
          pFr: "Qamar (Lune - قمر)", pEn: "Moon (Qamar)", pHa: "Qamar (Wata)", 
          dFr: "Lundi", dEn: "Monday", dHa: "Litinin", 
          bFr: "Camphre, Santal blanc & Musc blanc", bEn: "Camphor, White Sandalwood & White Musk", bHa: "Turaren Kafur, Sandal fari",
          sFr: "Jour d'intuition, de paix familiale, de visions et de réceptivité mystique.",
          sEn: "Day of intuition, family peace, dream visions, and spiritual receptivity.",
          sHa: "Rana ce ta fahimtar mafarki, zaman lafiyar iyali da daukakar zuciya."
        },
        { 
          pFr: "Mirrikh (Mars - مريخ)", pEn: "Mars (Mirrikh)", pHa: "Mirrikh (Mars)", 
          dFr: "Mardi", dEn: "Tuesday", dHa: "Talata", 
          bFr: "Poivre rouge, Sang de dragon & Ail sec", bEn: "Dragon's Blood, Red Pepper & Dried Garlic", bHa: "Turare mai yaji, Jinin dodo",
          sFr: "Jour de victoire contre l'injustice, force d'action et dissolution du mal.",
          sEn: "Day of victory over injustice, martial strength, and dissolving negativity.",
          sHa: "Rana ce ta nasara a kan makiya, warware kulle-kulle da samun karfi."
        },
        { 
          pFr: "Utarid (Mercure - عطارد)", pEn: "Mercury (Utarid)", pHa: "Utarid (Mercury)", 
          dFr: "Mercredi", dEn: "Wednesday", dHa: "Laraba", 
          bFr: "Clou de girofle, Mastic & Écorce de cannelle", bEn: "Clove, Mastic & Cinnamon Bark", bHa: "Kanumfari, Mistik da Kananfari",
          sFr: "Jour du savoir, des affaires, de l'éloquence et des études supérieures.",
          sEn: "Day of knowledge, business contracts, eloquence, and higher learning.",
          sHa: "Rana ce ta ilimi, kasuwanci, iya magana da nasarar karatu."
        },
        { 
          pFr: "Mushtari (Jupiter - مشتری)", pEn: "Jupiter (Mushtari)", pHa: "Mushtari (Jupiter)", 
          dFr: "Jeudi", dEn: "Thursday", dHa: "Alhamis", 
          bFr: "Oud royal, Santal rouge & Ambergris", bEn: "Royal Oud, Red Sandalwood & Ambergris", bHa: "Iscacen Oud, Sandal ja",
          sFr: "Jour suprême d'abondance, de Baraka financière, de justice et de sagesse.",
          sEn: "Supreme day of wealth, financial Baraka, justice, and spiritual wisdom.",
          sHa: "Rana ce mai albarka ta samun arziki, yalwar abinci da adalci."
        },
        { 
          pFr: "Zuhara (Vénus - زهرة)", pEn: "Venus (Zuhara)", pHa: "Zuhara (Venus)", 
          dFr: "Vendredi", dEn: "Friday", dHa: "Jumma'a", 
          bFr: "Rose de Taif, Bois d'aloès & Musc pur", bEn: "Taif Rose, Agarwood & Pure Musk", bHa: "Furen Rose, Musk da Turaren al'ada",
          sFr: "Jour d'amour, d'harmonie conjugale, d'attraction bienveillante et de beauté.",
          sEn: "Day of love, marital harmony, graceful attraction, and divine beauty.",
          sHa: "Rana ce ta soyayya, jituwar ma'aurata, kwarjini da kyawun ruhi."
        }
      ];
      const planetInfo = planets[total % 7];

      // Angelic (Ulwi) & Servant (Sufli) Khuddam Extraction
      const prefixList = ["Taf", "Sham", "Qaf", "Ghal", "Zan", "Kam", "Khas", "Jal", "Ruh", "Bar"];
      const basePrefix = prefixList[total % prefixList.length];

      const angelAr = basePrefix + "ya'il (عزرائيل / " + basePrefix + "يائيل)";
      const servantAr = basePrefix + "tayush (" + basePrefix + "طيوش / خادم أرضي)";

      const angelName = basePrefix + "yā'īl";
      const servantName = basePrefix + "tayūsh";

      // Ghazali 3x3 Wafq Calculation
      // Base = Math.floor((total - 12) / 3)
      // Remainder R = (total - 12) % 3
      let baseVal = Math.floor((total - 12) / 3);
      if (baseVal < 1) baseVal = 1;
      const remVal = Math.max(0, (total - 12) % 3);

      // Standard Ghazali 3x3 positions (houses 1..9):
      // Row 1: H8, H1, H6
      // Row 2: H3, H5, H7
      // Row 3: H4, H9, H2
      const houseVal = (hNum: number) => {
        let v = baseVal + (hNum - 1);
        if (remVal === 1 && hNum >= 7) v += 1;
        if (remVal === 2 && hNum >= 4) v += 1;
        return v;
      };

      const wafqGrid = [
        [houseVal(8), houseVal(1), houseVal(6)],
        [houseVal(3), houseVal(5), houseVal(7)],
        [houseVal(4), houseVal(9), houseVal(2)]
      ];

      const magicSum = wafqGrid[0][0] + wafqGrid[0][1] + wafqGrid[0][2];

      // Resonant Divine Names
      const matchingNames = asmaListData
        .map(asma => ({
          ...asma,
          diff: Math.abs((total % 99) - (asma.abjad % 99))
        }))
        .sort((a, b) => a.diff - b.diff)
        .slice(0, 3);

      // Secret code cipher
      const secretCode = `✦-ASRAR-${total * 7}-${saghir}99-✦`;

      setResult({
        total,
        score1,
        score2,
        saghir,
        pAr,
        mAr,
        elemPercents,
        dominantElement,
        planetInfo,
        angelAr,
        servantAr,
        angelName,
        servantName,
        wafqGrid,
        magicSum,
        baseVal,
        matchingNames,
        secretCode,
        mansionId: (total % 28) + 1
      });

      setIsProcessing(false);
      setIsCalculated(true);
    }, 1500);
  };

  // Speak name audio
  const handleSpeak = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'ar-SA';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Preview UI for Premium Lock
  const previewUI = (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 border-none pointer-events-none opacity-50">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div>
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <div className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded-xl mb-4"></div>
        <div className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded-xl mb-6"></div>
      </div>
    </div>
  );

  return (
    <PremiumWrapper enabled={isPremiumRequired} fallbackTitle="Sirr Al-Asrar" previewContent={previewUI}>
      <div className="w-full max-w-4xl mx-auto p-3 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen overflow-x-hidden">
        
        {/* Toast Message */}
        {toastMsg && (
          <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 size={16} />
            {toastMsg}
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <Link 
            to="/tools" 
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium mb-3 transition-colors text-xs sm:text-sm"
          >
            <ArrowLeft size={18} />
            {labels.backToTools}
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                <Eye className="text-violet-600 shrink-0" size={28} />
                <span className="break-words">{labels.title}</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1 break-words">{labels.subtitle}</p>
            </div>

            <span className="self-start sm:self-auto bg-violet-50 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0">
              <Sparkles size={14} />
              Ilm al-Jafr & Ruhaniyat
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isCalculated ? (
            <motion.div key="form" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}>
              
              {/* Notice Banner */}
              <div className="bg-gradient-to-r from-violet-950/20 via-purple-900/10 to-indigo-950/20 border border-violet-800/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>
                <p className="text-xs sm:text-sm text-violet-900 dark:text-violet-200 font-medium leading-relaxed relative z-10 break-words">
                  {labels.warningNotice}
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-300 block mb-2">{labels.presets}</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { n: 'Ahmad', m: 'Fatima', arN: 'أحمد', arM: 'فاطمة' },
                    { n: 'Muhammad', m: 'Amina', arN: 'محمد', arM: 'آمنة' },
                    { n: 'Ibrahim', m: 'Mariam', arN: 'إبراهيم', arM: 'مريم' },
                    { n: 'Musa', m: 'Khadija', arN: 'موسى', arM: 'خديجة' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setName(preset.n);
                        setMotherName(preset.m);
                        setArabicName(preset.arN);
                        setArabicMother(preset.arM);
                      }}
                      className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 hover:bg-violet-50 dark:hover:bg-violet-900/30 text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-300 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      {preset.n} + {preset.m} ({preset.arN})
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Input Form */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    className="absolute inset-0 z-30 bg-gray-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center"
                  >
                    <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="mb-4">
                      <Eye size={54} className="text-violet-400 shadow-[0_0_20px_rgba(167,139,250,0.8)]" />
                    </motion.div>
                    <p className="tracking-[0.2em] uppercase text-xs sm:text-sm font-bold text-violet-300 animate-pulse">
                      {labels.calculating}
                    </p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  {/* Person Name Input */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {labels.yourName}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={labels.namePlaceholder}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 font-medium transition-all"
                    />
                    <div className="mt-2">
                      <label className="block text-[11px] font-semibold text-violet-600 dark:text-violet-400 mb-1">
                        {labels.arabicNameLabel}
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={arabicName}
                        onChange={(e) => setArabicName(e.target.value)}
                        className="w-full bg-violet-50/50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-xl p-2.5 text-base font-arabic text-amber-600 dark:text-amber-300 focus:ring-2 focus:ring-violet-500 font-bold"
                      />
                    </div>
                  </div>

                  {/* Mother Name Input */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {labels.motherName}
                    </label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder={labels.motherPlaceholder}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 font-medium transition-all"
                    />
                    <div className="mt-2">
                      <label className="block text-[11px] font-semibold text-violet-600 dark:text-violet-400 mb-1">
                        {labels.arabicMotherLabel}
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={arabicMother}
                        onChange={(e) => setArabicMother(e.target.value)}
                        className="w-full bg-violet-50/50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-xl p-2.5 text-base font-arabic text-amber-600 dark:text-amber-300 focus:ring-2 focus:ring-violet-500 font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculation Options */}
                <div className="mb-6 bg-gray-50 dark:bg-gray-900/60 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                    <Compass size={16} className="text-violet-500" />
                    <span>{labels.abjadSystem}:</span>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsMaghribi(false)}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        !isMaghribi
                          ? 'bg-violet-600 text-white shadow-sm'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {labels.mashriqi}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMaghribi(true)}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isMaghribi
                          ? 'bg-violet-600 text-white shadow-sm'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {labels.maghribi}
                    </button>
                  </div>
                </div>

                {/* Calculate Button */}
                <button
                  type="button"
                  onClick={calculateSirr}
                  disabled={!name || !motherName || isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-700 via-purple-800 to-indigo-900 text-white font-bold disabled:opacity-50 hover:shadow-[0_0_30px_rgba(109,40,217,0.5)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs sm:text-sm cursor-pointer shadow-lg"
                >
                  <Key size={18} /> {labels.extractBtn}
                </button>
              </div>

              {/* Saved Profiles Section */}
              {savedProfiles.length > 0 && (
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Save size={16} className="text-violet-500" />
                    {labels.savedProfiles}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {savedProfiles.map((p) => (
                      <div key={p.id} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center gap-2">
                        <div 
                          onClick={() => {
                            setName(p.name);
                            setMotherName(p.motherName);
                            setArabicName(p.arabicName);
                            setArabicMother(p.arabicMother);
                          }}
                          className="cursor-pointer flex-1 min-w-0"
                        >
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block truncate">{p.name} + {p.motherName}</span>
                          <span className="text-[10px] text-amber-500 font-arabic block">{p.arabicName} ({p.total})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteProfile(p.id)}
                          className="text-gray-600 dark:text-gray-300 hover:text-rose-500 p-1 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.2 }}>
              
              {/* Actions Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsCalculated(false)}
                  className="px-3.5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={14} />
                  {labels.recalculate}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="px-3.5 py-2 bg-violet-50 dark:bg-violet-900/40 hover:bg-violet-100 text-violet-700 dark:text-violet-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-violet-200 dark:border-violet-800"
                  >
                    <Save size={14} />
                    {labels.saveProfile}
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex overflow-x-auto gap-2 pb-2 mb-6 border-b border-gray-200 dark:border-gray-800 scrollbar-none max-w-full">
                {[
                  { id: 'overview', label: labels.tabOverview, icon: Eye },
                  { id: 'khatim', label: labels.tabKhatim, icon: Sparkles },
                  { id: 'wird', label: labels.tabWird, icon: BookOpen },
                  { id: 'aura', label: labels.tabAura, icon: Flame },
                  { id: 'scroll', label: labels.tabScroll, icon: Feather }
                ].map(tab => {
                  const isActive = activeTab === tab.id;
                  const IconComp = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <IconComp size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: OVERVIEW & ESSENCE */}
              {activeTab === 'overview' && (
                <div className="space-y-6 max-w-full">
                  
                  {/* Summary Header Card */}
                  <div className="bg-gradient-to-br from-violet-950 via-slate-950 to-purple-950 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl text-white relative overflow-hidden border border-violet-800/40">
                    <div className="absolute top-0 right-0 p-8 opacity-10 hidden sm:block pointer-events-none">
                      <Eye size={200} className="animate-pulse text-violet-300" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-violet-300 font-medium mb-4 text-xs">
                        <span className="bg-violet-900/60 px-3 py-1 rounded-full border border-violet-700/50">
                          {name} ({result.pAr}) + {motherName} ({result.mAr})
                        </span>
                        <span className="font-mono text-amber-800 dark:text-amber-300">
                          {labels.secretCode}: {result.secretCode}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
                        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                          <span className="text-[11px] text-violet-300 font-semibold uppercase block mb-1">{labels.personWeight}</span>
                          <span className="text-2xl sm:text-3xl font-black text-amber-800 dark:text-amber-300">{result.score1}</span>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                          <span className="text-[11px] text-violet-300 font-semibold uppercase block mb-1">{labels.motherWeight}</span>
                          <span className="text-2xl sm:text-3xl font-black text-amber-800 dark:text-amber-300">{result.score2}</span>
                        </div>
                        <div className="bg-gradient-to-r from-violet-600/30 to-purple-600/30 p-4 rounded-2xl border border-violet-500/50 shadow-inner">
                          <span className="text-[11px] text-amber-800 dark:text-amber-300 font-bold uppercase block mb-1">{labels.totalWeight}</span>
                          <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-violet-200 to-emerald-200">
                            {result.total}
                          </span>
                        </div>
                      </div>

                      {/* Khuddam Identities */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/80 p-4 rounded-2xl border border-violet-500/40 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.9)]"></div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-violet-300 uppercase font-bold tracking-wider">{labels.angelicIdentity}</span>
                            <button type="button" onClick={() => handleSpeak(result.angelAr)} className="text-violet-400 hover:text-white p-1 rounded">
                              <Volume2 size={16} />
                            </button>
                          </div>
                          <span className="text-xl sm:text-2xl font-bold font-arabic text-amber-800 dark:text-amber-300 block my-1" dir="rtl">{result.angelAr}</span>
                          <p className="text-xs text-violet-200/80 leading-relaxed">{labels.angelicDesc}</p>
                        </div>

                        <div className="bg-slate-900/80 p-4 rounded-2xl border border-rose-500/40 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)]"></div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-rose-300 uppercase font-bold tracking-wider">{labels.servantIdentity}</span>
                            <button type="button" onClick={() => handleSpeak(result.servantAr)} className="text-rose-400 hover:text-white p-1 rounded">
                              <Volume2 size={16} />
                            </button>
                          </div>
                          <span className="text-xl sm:text-2xl font-bold font-arabic text-rose-300 block my-1" dir="rtl">{result.servantAr}</span>
                          <p className="text-xs text-violet-200/80 leading-relaxed">{labels.servantDesc}</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Resonant Divine Names (Asma al-Husna) */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                      <Sparkles className="text-amber-500" size={18} />
                      {labels.divineNamesResonance}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-300 mb-4">{labels.divineNamesDesc}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {result.matchingNames.map((asma: any, idx: number) => (
                        <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-violet-600 dark:text-violet-400">Abjad: {asma.abjad}</span>
                              <span className="text-xs font-mono bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                                #{idx + 1}
                              </span>
                            </div>
                            <h4 className="text-2xl font-arabic font-bold text-gray-900 dark:text-white text-right my-1" dir="rtl">{asma.ar}</h4>
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{asma.tr}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5 italic">{asma.fr}</p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-800">
                            <span className="text-[10px] text-gray-600 dark:text-gray-300 block">{asma.ref}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: KHATIM / MAGIC SQUARE 3X3 */}
              {activeTab === 'khatim' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 max-w-full">
                  <div className="mb-6">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="text-amber-500 shrink-0" size={24} />
                      <span className="break-words">{labels.khatimTitle}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1 break-words">{labels.khatimSub}</p>
                  </div>

                  {/* 3x3 Ghazali Wafq Visual Grid */}
                  <div className="max-w-md mx-auto my-6 bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 p-4 sm:p-6 rounded-3xl border-4 border-amber-500/40 shadow-2xl text-white text-center">
                    <span className="text-xs font-bold uppercase text-amber-800 dark:text-amber-300 tracking-widest block mb-4">
                      Wafq Muthalath Ghazali (3x3)
                    </span>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-black/40 p-3 rounded-2xl border border-amber-500/30">
                      {result.wafqGrid.map((row: number[], rIdx: number) => 
                        row.map((cellVal: number, cIdx: number) => (
                          <div 
                            key={`${rIdx}-${cIdx}`}
                            className="bg-amber-950/80 hover:bg-amber-900/90 border border-amber-500/50 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center transition-all shadow-inner"
                          >
                            <span className="text-lg sm:text-2xl font-black text-amber-800 dark:text-amber-200">{cellVal}</span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="mt-4 flex justify-between items-center text-xs text-amber-800 dark:text-amber-200 border-t border-amber-500/30 pt-3">
                      <span>{labels.miftah}: <strong className="text-amber-800 dark:text-amber-300">{result.baseVal}</strong></span>
                      <span>{labels.rowColSum}: <strong className="text-emerald-300">{result.magicSum}</strong></span>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4 rounded-2xl text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                    <p className="font-semibold">{labels.khatimRules}</p>
                  </div>
                </div>
              )}

              {/* TAB 3: WIRD & PRESCRIPTIONS */}
              {activeTab === 'wird' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 max-w-full">
                  <div className="mb-6">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="text-emerald-500 shrink-0" size={24} />
                      <span className="break-words">{labels.wirdTitle}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1 break-words">{labels.wirdSub}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-5 rounded-2xl">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                        {labels.dailyZikrCount}
                      </span>
                      <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-300 block mb-2">
                        {result.total} <span className="text-xs font-normal text-gray-500">fois / times</span>
                      </span>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {labels.wirdSub}
                      </p>
                    </div>

                    <div className="bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 p-5 rounded-2xl">
                      <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                        {labels.zikrTime}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white block mb-2">
                        {labels.bestTimeVal}
                      </span>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Réciter à voix basse avec l'intention pure (Niyyah).
                      </p>
                    </div>
                  </div>

                  {/* Quranic Ayah Harmony */}
                  <div className="bg-gradient-to-r from-amber-950/20 via-slate-900/30 to-amber-950/20 p-5 rounded-2xl border border-amber-500/30 text-center">
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block mb-2">
                      {labels.recommendedAyah}
                    </span>
                    <p className="text-2xl sm:text-3xl font-arabic text-amber-800 dark:text-amber-300 my-3 leading-loose" dir="rtl">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 italic">
                      {labels.quranicEx}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: AURA & ELEMENTS */}
              {activeTab === 'aura' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 max-w-full">
                  <div className="mb-6">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Flame className="text-red-500 shrink-0" size={24} />
                      <span className="break-words">{labels.cosmicProfile}</span>
                    </h2>
                  </div>

                  {/* Elemental Distribution Bars */}
                  <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 mb-6">
                    <h3 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-300 mb-4">{labels.elementalBalance}</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-red-500">Feu (Nar)</span>
                          <span className="text-gray-700 dark:text-gray-300">{result.elemPercents.fire}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500" style={{ width: `${result.elemPercents.fire}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-emerald-500">Air (Hawa)</span>
                          <span className="text-gray-700 dark:text-gray-300">{result.elemPercents.air}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${result.elemPercents.air}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-blue-500">Eau (Ma')</span>
                          <span className="text-gray-700 dark:text-gray-300">{result.elemPercents.water}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${result.elemPercents.water}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-amber-600">Terre (Turab)</span>
                          <span className="text-gray-700 dark:text-gray-300">{result.elemPercents.earth}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-600" style={{ width: `${result.elemPercents.earth}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dominant Planet & Bakhur */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                      <span className="text-xs font-bold text-gray-500 uppercase block mb-1">{labels.dominantPlanet}</span>
                      <span className="text-base font-bold text-violet-600 dark:text-violet-300 block mb-2">
                        {lang === 'fr' ? result.planetInfo.pFr : lang === 'ha' ? result.planetInfo.pHa : result.planetInfo.pEn}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-300 block">
                        {labels.powerDay}: <strong>{lang === 'fr' ? result.planetInfo.dFr : lang === 'ha' ? result.planetInfo.dHa : result.planetInfo.dEn}</strong>
                      </span>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                      <span className="text-xs font-bold text-gray-500 uppercase block mb-1">{labels.incenseBakhur}</span>
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-300 block mb-2">
                        {lang === 'fr' ? result.planetInfo.bFr : lang === 'ha' ? result.planetInfo.bHa : result.planetInfo.bEn}
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: PARCHMENT SCROLL */}
              {activeTab === 'scroll' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 max-w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Feather className="text-amber-500 shrink-0" size={24} />
                        <span className="break-words">{labels.scrollTitle}</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1 break-words">{labels.scrollSub}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const scrollTxt = `✦ ASRARHUB — SIRR AL-ASRAR ✦\nName: ${name} (${result.pAr})\nMother: ${motherName} (${result.mAr})\nAbjad Total: ${result.total}\nAngel (Ulwi): ${result.angelAr}\nServant (Sufli): ${result.servantAr}\nCode: ${result.secretCode}`;
                          navigator.clipboard.writeText(scrollTxt);
                          setCopiedScroll(true);
                          setTimeout(() => setCopiedScroll(false), 2500);
                        }}
                        className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        {copiedScroll ? <Check size={16} /> : <Copy size={16} />}
                        {copiedScroll ? labels.copied : labels.copyScroll}
                      </button>

                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3.5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer size={16} />
                        {labels.printScroll}
                      </button>
                    </div>
                  </div>

                  {/* Parchment Display Certificate */}
                  <div className="relative bg-[#fbf6e9] dark:bg-[#1a1612] text-[#3d2f21] dark:text-[#e8d7c3] rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border-4 sm:border-8 border-[#d4af37]/40 shadow-2xl overflow-hidden font-serif max-w-full">
                    <div className="absolute top-2 left-2 text-[#d4af37] text-lg sm:text-2xl font-bold select-none">❖</div>
                    <div className="absolute top-2 right-2 text-[#d4af37] text-lg sm:text-2xl font-bold select-none">❖</div>
                    <div className="absolute bottom-2 left-2 text-[#d4af37] text-lg sm:text-2xl font-bold select-none">❖</div>
                    <div className="absolute bottom-2 right-2 text-[#d4af37] text-lg sm:text-2xl font-bold select-none">❖</div>

                    <div className="text-center border-b-2 border-[#d4af37]/40 pb-4 sm:pb-6 mb-4 sm:mb-6">
                      <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#8b5e34] dark:text-[#d4af37] block mb-1">
                        ✦ AsrarHub — Sirr Al-Asrar ✦
                      </span>
                      <h3 className="text-2xl sm:text-4xl font-extrabold text-[#2a1f17] dark:text-[#f3e5d8] tracking-tight break-words">
                        {name} & {motherName}
                      </h3>
                      <p className="text-xl sm:text-3xl font-arabic text-[#b8860b] dark:text-[#e6c662] mt-2 break-words" dir="rtl">
                        {result.pAr} + {result.mAr}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs sm:text-sm">
                      <div className="space-y-2">
                        <p><strong>{labels.totalWeight}:</strong> <span className="font-bold text-amber-700 dark:text-amber-300">{result.total}</span></p>
                        <p><strong>{labels.angelicIdentity}:</strong> <span className="font-bold text-amber-700 dark:text-amber-300 font-arabic">{result.angelAr}</span></p>
                        <p><strong>{labels.servantIdentity}:</strong> <span className="font-bold text-rose-700 dark:text-rose-400 font-arabic">{result.servantAr}</span></p>
                      </div>

                      <div className="space-y-2">
                        <p><strong>{labels.secretCode}:</strong> <span className="font-mono text-xs">{result.secretCode}</span></p>
                        <p><strong>{labels.incenseBakhur}:</strong> <span className="font-bold">{lang === 'fr' ? result.planetInfo.bFr : lang === 'ha' ? result.planetInfo.bHa : result.planetInfo.bEn}</span></p>
                      </div>
                    </div>

                    {/* Khatim in Parchment */}
                    <div className="bg-[#f2e7d3] dark:bg-[#26201a] p-4 rounded-2xl border border-[#d4af37]/40 text-center my-4">
                      <span className="text-xs font-bold uppercase text-[#8b5e34] dark:text-[#d4af37] block mb-2">
                        Sceau du Khatim (3x3 Wafq)
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 max-w-[200px] mx-auto text-xs font-bold">
                        {result.wafqGrid.map((row: number[], rIdx: number) => 
                          row.map((cellVal: number, cIdx: number) => (
                            <div key={`${rIdx}-${cIdx}`} className="bg-[#e6d8be] dark:bg-[#332b22] p-2 border border-[#d4af37]/30 rounded">
                              {cellVal}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <p className="text-xs italic text-center text-[#523d2b] dark:text-[#c2b19c] mt-4">
                      "Ce parchemin est extrait de la science ésotérique des lettres (Ilm al-Huruf). Gardez ce secret avec sagesse."
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PremiumWrapper>
  );
};

export default SirrAlAsrar;
