import React, { useState, useEffect, useRef } from 'react';
import {
  Calculator,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Calendar,
  Coins,
  Moon,
  Clock,
  Shield,
  Layers,
  Users,
  Activity,
  Award,
  BookOpen,
  Check,
  Copy,
  Plus,
  Trash2,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Heart,
  ChevronRight,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { triggerProtectionModal } from './ContentProtectionManager';
import { calculateAbjadValue } from '../utils/abjad';
import { motion, AnimatePresence } from 'motion/react';

const translations = {
  fr: {
    title: "Calculs de Rituels (Awrad & Dhikr)",
    subtitle: "Module avancé de planification, d'harmonisation numérique et de gestion des rituels de récitation.",
    
    // Tabs
    tabPlanner: "Planificateur",
    tabCounter: "Compteur Intelligent",
    tabMultipliers: "Multiplicateurs",
    tabWeekly: "Répartition Hebdo",
    tabZakat: "Zakat du Nom",
    tabRiyadah: "Jeûne (Riyadah)",
    tabVerseTiming: "Timing Versets",
    tabSalatInqadh: "Salat al-Inqadh",
    tabTextSplitter: "Séparateur Texte",
    tabTracker: "Traqueur Constance",
    tabSalawat: "Salawat Harmo",
    tabIstighfar: "Istighfar Compens.",
    tabHissn: "Planif. Hissn",
    tabGroup: "Dhikr de Groupe",

    // Input labels
    inputLabel: "Nom, Formule ou Verset (en arabe) :",
    inputPlaceholder: "ex: يا لطيف, يا رزاق, محمد...",
    abjadValue: "Valeur Abjad Total :",
    lettersCount: "Nombre de lettres :",
    copyBtn: "Copier",
    copied: "Copié !",

    // 1. Planificateur
    plannerTitle: "Planificateur de Dhikr",
    plannerDesc: "Détermine le nombre de répétitions optimales d'après l'Abjad d'un nom ou d'une formule.",
    modeAsli: "Mode Asli (Valeur Directe)",
    modeWasat: "Mode Wasat (Poids de Résonance)",
    modeKabir: "Mode Kabir (Abjad × Lettres)",
    daysTargetLabel: "Durée du rituel (jours) :",
    dailyQuota: "Quota Quotidien :",
    perDay: "récitations/jour",

    // 2. Compteur Intelligent
    counterTitle: "Compteur Intelligent",
    counterDesc: "Chapelet virtuel vibrant et sonore alertant lorsque le nombre cible est atteint.",
    targetLabel: "Nombre Cible :",
    currentCount: "Répétitions :",
    targetReached: "Objectif Atteint ! Mabrouk 📿",
    vibrationOn: "Vibration Activée",
    vibrationOff: "Vibration Désactivée",
    soundOn: "Son Activé",
    soundOff: "Son Désactivé",
    resetBtn: "Réinitialiser",
    tapToCount: "Appuyez pour compter",

    // 3. Multiplicateurs Spirituels
    multipliersTitle: "Multiplicateurs Spirituels",
    multipliersDesc: "Paliers de récitation basés sur les coefficients sacrés de la tradition soufie.",
    sendToCounter: "Lancer dans le Compteur",

    // 4. Répartition Hebdomadaire
    weeklyTitle: "Répartition Hebdomadaire",
    weeklyDesc: "Divise un grand calcul en portions asymétriques sur les 7 jours de la semaine.",
    fridayWeight: "Vendredi (Jour Béni / x1.5)",
    mondayWeight: "Lundi (Jour Prophétique / x1.3)",
    otherDays: "Autres jours (Équilibré)",
    markDone: "Terminé",

    // 5. Zakat du Nom
    zakatTitle: "Zakat du Nom (Aumône Rituelle)",
    zakatDesc: "Calcule l'équivalent d'aumône recommandé pour sceller et accompagner un cycle d'invocation.",
    recommendedCharity: "Aumône Recommandée :",
    charityTypesTitle: "Formes d'Aumônes Suggérées :",
    charityBread: "Pains ou repas partagés aux nécessiteux",
    charityDates: "MNS de Dattes fraîches ou lait pur",
    charityCoins: "Pièces de monnaie en aumône discrète",

    // 6. Jeûne Temporel (Riyadah)
    riyadahTitle: "Jeûne Temporel & Retraite (Riyadah)",
    riyadahDesc: "Calcule les dates idéales de retraite et de purification d'après le cycle lunaire personnel.",
    ayyamBidTitle: "Les Jours Blancs (13, 14, 15 Hijri)",
    retreat3Days: "Retraite Spirituelle de 3 Jours",
    retreat7Days: "Retraite de 7 Jours (Riyadah Suprême)",
    retreat40Days: "Grand Arba'in (40 Jours)",
    dietAdvice: "Conseil de Diète : Éviter les produits animaux (Zalalat) et maintenir la pureté rituelle (Wudu).",

    // 7. Timing de Versets
    timingTitle: "Timing & Résonance de Versets",
    timingDesc: "Détermine le moment exact de la journée où un verset a sa résonance vibratoire maximale.",
    elementFire: "Nature Feu → Heure du Duha (Plein Soleil)",
    elementWater: "Nature Eau → Heure du Maghrib (Coucher du Soleil)",
    elementAir: "Nature Air → Heure du Fajr (Aube Céleste)",
    elementEarth: "Nature Terre → Heure du Sahar (Dernier Tiers de Nuit)",

    // 8. Salat al-Inqadh
    inqadhTitle: "Répartition de Salat al-Inqadh",
    inqadhDesc: "Calcule la distribution horaire des prières d'urgence pour le dénouement des épreuves.",
    totalRakaats: "Total Raka'ats d'Urgence :",
    scheduleSlots: "Créneaux d'Exécution :",

    // 9. Séparateur de Texte
    splitterTitle: "Séparateur de Texte par Abjad",
    splitterDesc: "Divise un long texte en portions de valeurs numériques globales identiques.",
    textInputPlaceholder: "Collez un long texte ou plusieurs mots arabes...",
    segmentsResult: "Portions Équilibrées :",

    // 10. Traqueur de Constance
    trackerTitle: "Traqueur de Constance",
    trackerDesc: "Enregistre la régularité des cycles de récitation quotidienne et votre assiduité.",
    currentStreak: "Série Actuelle :",
    daysCount: "jours consécutifs",
    logTodayBtn: "Valider le Dhikr d'Aujourd'hui",
    loggedToday: "Aujourd'hui validé !",
    historyLog: "Historique des Réalisations :",

    // 11. Générateur de Salawat
    salawatTitle: "Générateur de Salawat Harmonisées",
    salawatDesc: "Propose des prières prophétiques dont la somme d'Abjad s'accorde avec le prénom ou l'intention.",
    matchScore: "Harmonie Spirituelle :",

    // 12. Istighfar Compensateur
    istighfarTitle: "Istighfar Compensateur (الاستغفار المجبّر)",
    istighfarDesc: "Calcule le nombre de demandes de pardon requis pour neutraliser un excès ou un écart d'Abjad.",
    excessVal: "Écart ou Excès calculé :",
    requiredIstighfar: "Nombre d'Istighfar Compensateurs :",

    // 13. Planificateur de Hissn
    hissnTitle: "Planificateur de Hissn (Bouclier de Protection)",
    hissnDesc: "Détermine les créneaux quotidiens pour réactiver les 4 couches de protections spirituelles.",
    fajrSlot: "Aube (Fajr) : Récitation Ayat al-Kursi (1x ou 7x)",
    duhaSlot: "Matin (Duha) : Récitation Sourate Al-Ikhlas (3x)",
    maghribSlot: "Crépuscule (Maghrib) : Récitation Al-Falaq & An-Nas (3x)",
    nightSlot: "Coucher : Récitation Bouclier des 3 Quls (3x)",

    // 14. Dhikr de Groupe
    groupTitle: "Dhikr de Groupe & Cible Collective",
    groupDesc: "Additionne les Abjads de plusieurs participants pour définir une cible collective.",
    participantName: "Nom du Participant :",
    addParticipant: "Ajouter Participant",
    collectiveTarget: "Cible Collective Totale :",
    perPersonShare: "Quota moyen par personne :"
  },
  en: {
    title: "Ritual Calculations (Awrad & Dhikr)",
    subtitle: "Advanced module for planning, numerical harmonization, and managing recitation rituals.",
    
    // Tabs
    tabPlanner: "Dhikr Planner",
    tabCounter: "Smart Counter",
    tabMultipliers: "Multipliers",
    tabWeekly: "Weekly Split",
    tabZakat: "Name Zakat",
    tabRiyadah: "Fasting (Riyadah)",
    tabVerseTiming: "Verse Timing",
    tabSalatInqadh: "Salat al-Inqadh",
    tabTextSplitter: "Text Splitter",
    tabTracker: "Constancy Tracker",
    tabSalawat: "Salawat Harmo",
    tabIstighfar: "Comp. Istighfar",
    tabHissn: "Hissn Planner",
    tabGroup: "Group Dhikr",

    // Input labels
    inputLabel: "Name, Formula or Verse (in Arabic):",
    inputPlaceholder: "e.g., يا لطيف, يا رزاق, محمد...",
    abjadValue: "Total Abjad Value:",
    lettersCount: "Letter Count:",
    copyBtn: "Copy",
    copied: "Copied!",

    // 1. Planner
    plannerTitle: "Dhikr Planner",
    plannerDesc: "Determines optimal repetition counts based on a name's or formula's Abjad value.",
    modeAsli: "Asli Mode (Direct Value)",
    modeWasat: "Wasat Mode (Resonance Weight)",
    modeKabir: "Kabir Mode (Abjad × Letters)",
    daysTargetLabel: "Ritual duration (days):",
    dailyQuota: "Daily Quota:",
    perDay: "recitations/day",

    // 2. Smart Counter
    counterTitle: "Smart Counter",
    counterDesc: "Virtual rosary with vibration and sound alerts when reaching target count.",
    targetLabel: "Target Count:",
    currentCount: "Recitations:",
    targetReached: "Target Reached! Mabrouk 📿",
    vibrationOn: "Vibration Enabled",
    vibrationOff: "Vibration Disabled",
    soundOn: "Sound Enabled",
    soundOff: "Sound Disabled",
    resetBtn: "Reset",
    tapToCount: "Tap to count",

    // 3. Multipliers
    multipliersTitle: "Spiritual Multipliers",
    multipliersDesc: "Recitation tiers based on sacred coefficients from Sufi tradition.",
    sendToCounter: "Launch in Counter",

    // 4. Weekly Distribution
    weeklyTitle: "Weekly Distribution",
    weeklyDesc: "Splits a large total count into asymmetric daily portions across 7 days.",
    fridayWeight: "Friday (Blessed Day / x1.5)",
    mondayWeight: "Monday (Prophetic Day / x1.3)",
    otherDays: "Other Days (Balanced)",
    markDone: "Completed",

    // 5. Name Zakat
    zakatTitle: "Name Zakat (Ritual Charity)",
    zakatDesc: "Calculates recommended charity equivalent to seal and accompany an invocation cycle.",
    recommendedCharity: "Recommended Charity:",
    charityTypesTitle: "Suggested Charity Forms:",
    charityBread: "Loaves of bread or meals shared with the needy",
    charityDates: "Fresh dates or pure milk",
    charityCoins: "Coins given as discrete charity",

    // 6. Riyadah
    riyadahTitle: "Temporal Fasting & Retreat (Riyadah)",
    riyadahDesc: "Calculates ideal retreat and purification dates based on lunar cycle.",
    ayyamBidTitle: "The White Days (13th, 14th, 15th Hijri)",
    retreat3Days: "3-Day Spiritual Retreat",
    retreat7Days: "7-Day Retreat (Supreme Riyadah)",
    retreat40Days: "Grand Arba'in (40 Days)",
    dietAdvice: "Dietary Advice: Avoid animal products (Zalalat) and maintain ritual purity (Wudu).",

    // 7. Verse Timing
    timingTitle: "Verse Timing & Resonance",
    timingDesc: "Determines exact time of day where a verse reaches maximum vibrational resonance.",
    elementFire: "Fire Nature → Duha Hour (Midday Sun)",
    elementWater: "Water Nature → Maghrib Hour (Sunset)",
    elementAir: "Air Nature → Fajr Hour (Celestial Dawn)",
    elementEarth: "Earth Nature → Sahar Hour (Last 3rd of Night)",

    // 8. Salat al-Inqadh
    inqadhTitle: "Salat al-Inqadh Distribution",
    inqadhDesc: "Calculates hourly distribution of emergency prayers for rapid relief.",
    totalRakaats: "Total Emergency Raka'ats:",
    scheduleSlots: "Execution Slots:",

    // 9. Text Splitter
    splitterTitle: "Abjad Text Splitter",
    splitterDesc: "Splits long text into segments with identical or balanced global numerical values.",
    textInputPlaceholder: "Paste long text or multiple Arabic words...",
    segmentsResult: "Balanced Portions:",

    // 10. Tracker
    trackerTitle: "Constancy Tracker",
    trackerDesc: "Records regularity of daily recitation cycles and tracks your streaks.",
    currentStreak: "Current Streak:",
    daysCount: "consecutive days",
    logTodayBtn: "Log Today's Dhikr",
    loggedToday: "Today Logged!",
    historyLog: "Completion History:",

    // 11. Salawat
    salawatTitle: "Harmonized Salawat Generator",
    salawatDesc: "Suggests prophetic blessings whose Abjad sum accords with your name or intention.",
    matchScore: "Spiritual Harmony:",

    // 12. Istighfar
    istighfarTitle: "Compensatory Istighfar (الاستغفار المجبّر)",
    istighfarDesc: "Calculates number of seeking forgiveness needed to balance an Abjad excess.",
    excessVal: "Calculated Gap/Excess:",
    requiredIstighfar: "Required Compensatory Istighfar:",

    // 13. Hissn
    hissnTitle: "Hissn Protection Planner",
    hissnDesc: "Determines daily time windows to reactivate 4 layers of spiritual protection.",
    fajrSlot: "Dawn (Fajr): Ayat al-Kursi Recitation (1x or 7x)",
    duhaSlot: "Morning (Duha): Surah Al-Ikhlas Recitation (3x)",
    maghribSlot: "Dusk (Maghrib): Al-Falaq & An-Nas Recitation (3x)",
    nightSlot: "Bedtime: 3 Quls Protection Shield (3x)",

    // 14. Group
    groupTitle: "Group Dhikr & Collective Target",
    groupDesc: "Sum Abjad values of multiple participants to define a collective target.",
    participantName: "Participant Name:",
    addParticipant: "Add Participant",
    collectiveTarget: "Total Collective Target:",
    perPersonShare: "Average Quota Per Person:"
  },
  ha: {
    title: "Lissafin Ayyuka (Awrad & Dhikr)",
    subtitle: "Ingantaccen tsari na shirya zikiri, daidaita lambobi da gudanar da ayyuka.",
    
    // Tabs
    tabPlanner: "Mai Tsara Zikiri",
    tabCounter: "Carbi Mai Wayo",
    tabMultipliers: "Masu Ninka Zikiri",
    tabWeekly: "Rabon Mako",
    tabZakat: "Zakat na Suna",
    tabRiyadah: "Azumi (Riyada)",
    tabVerseTiming: "Lokacin Aya",
    tabSalatInqadh: "Sallar Inqadh",
    tabTextSplitter: "Raba Rubutu",
    tabTracker: "Binciken Dauwama",
    tabSalawat: "Salatin Annabi",
    tabIstighfar: "Istigfari Mai Maimaitawa",
    tabHissn: "Tsaron Hissn",
    tabGroup: "Zikirin Rukunai",

    // Input labels
    inputLabel: "Suna, Zikiri ko Ayar Larabci:",
    inputPlaceholder: "Misali: يا لطيف, يا رزاق, محمد...",
    abjadValue: "Cikakken Lissafin Abjad:",
    lettersCount: "Yawan Haruffa:",
    copyBtn: "Kwafa",
    copied: "An Kwafa!",

    // 1. Planner
    plannerTitle: "Mai Tsara Zikiri",
    plannerDesc: "Yana fitar da adadin da ya dace da lissafin Abjad na suna ko zikiri.",
    modeAsli: "Tsarin Asli (Lissafi Kai Tsaye)",
    modeWasat: "Tsarin Wasat (Nauyin Suna)",
    modeKabir: "Tsarin Kabir (Abjad × Haruffa)",
    daysTargetLabel: "Tsawon kwanakin aiki:",
    dailyQuota: "Adadin Kullum:",
    perDay: "zikiri/rana",

    // 2. Smart Counter
    counterTitle: "Carbi Mai Wayo",
    counterDesc: "Carbi na waya mai girgiza da fidda sauti idan aka kai adadin da aka sa.",
    targetLabel: "Adadin da ake Nema:",
    currentCount: "Karatu:",
    targetReached: "An Kai Matakin Cika! Mabrouk 📿",
    vibrationOn: "An Citta Girgiza",
    vibrationOff: "An Kashe Girgiza",
    soundOn: "An Citta Sauti",
    soundOff: "An Kashe Sauti",
    resetBtn: "Maimaita",
    tapToCount: "Taba don kirgawa",

    // 3. Multipliers
    multipliersTitle: "Masu Ninka Zikiri",
    multipliersDesc: "Rabe-raben karatun zikiri bisa tsarin ilimin malamai.",
    sendToCounter: "Aika zuwa Carbi",

    // 4. Weekly Distribution
    weeklyTitle: "Raba Zikiri na Mako",
    weeklyDesc: "Raba adadi mai yawa zuwa kwanaki 7 na mako.",
    fridayWeight: "Jumma'a (Ranar Albarka / x1.5)",
    mondayWeight: "Litinin (Ranar Annabi / x1.3)",
    otherDays: "Sauran Kwanaki (Daidai)",
    markDone: "An Kammala",

    // 5. Name Zakat
    zakatTitle: "Zakat na Suna (Sadakar Aiki)",
    zakatDesc: "Calcule l'équivalent d'aumône recommandé pour accompagner un cycle d'invocation.",
    recommendedCharity: "Sadakar da Ake Shawara:",
    charityTypesTitle: "Irinta Sadaka:",
    charityBread: "Abinci ko buledi ga mabukata",
    charityDates: "Dabinai sababbi ko madara mai tsarki",
    charityCoins: "Kurɗi na sadaka cikin sirri",

    // 6. Riyadah
    riyadahTitle: "Azumi & Khulwa (Riyadah)",
    riyadahDesc: "Fitar da kwanakin da suka dace don komawa ga Allah duba da watan Hijri.",
    ayyamBidTitle: "Kwanakin Haske (13, 14, 15 Hijri)",
    retreat3Days: "Kwanaki 3 na Khulwa",
    retreat7Days: "Kwanaki 7 na Riyada Mafi Girma",
    retreat40Days: "Kwanaki 40 na Arba'in",
    dietAdvice: "Shawara: Guje wa cin nama ko abubuwan dabba (Zalalat) da riƙe alwala.",

    // 7. Verse Timing
    timingTitle: "Lokacin Amsar Aya",
    timingDesc: "Yana nuna lokacin da aya ta fi amsawa a cikin yini.",
    elementFire: "Wuta → Lokacin Walahi (Rana Tsaka)",
    elementWater: "Ruwa → Lokacin Magariba (Fadawar Rana)",
    elementAir: "Iska → Lokacin Asuba (Fitowar Haske)",
    elementEarth: "Ƙasa → Lokacin Tahajjud (Ƙarshen Dare)",

    // 8. Salat al-Inqadh
    inqadhTitle: "Rabon Sallar Inqadh",
    inqadhDesc: "Rabon raka'o'in sallolin gaggawa a cikin sa'o'i don samun tsira.",
    totalRakaats: "Jimillar Raka'o'in Gaggawa:",
    scheduleSlots: "Lokutan Yi:",

    // 9. Text Splitter
    splitterTitle: "Raba Rubutu da Abjad",
    splitterDesc: "Yana raba rubutu zuwa shafuka masu adadin Abjad daidai.",
    textInputPlaceholder: "Manpta rubutun Larabci a nan...",
    segmentsResult: "Rabon Rubutu:",

    // 10. Tracker
    trackerTitle: "Binciken Dauwama na Zikiri",
    trackerDesc: "Rikodi da bibiyar dauwamar zikiri kullum da jerin kwanaki.",
    currentStreak: "Jerin Kwanaki:",
    daysCount: "kwanaki a jere",
    logTodayBtn: "Yi Rijistar Yau",
    loggedToday: "An yi rijistar yau!",
    historyLog: "Tarihin Yin Aiki:",

    // 11. Salawat
    salawatTitle: "Mai Samar da Salatin Annabi",
    salawatDesc: "Yana zakulo salatin da ya dace da lissafin sunanka.",
    matchScore: "Daidaitun Ruhi:",

    // 12. Istighfar
    istighfarTitle: "Istigfari Mai Maimaitawa (الاستغفار المجبّر)",
    istighfarDesc: "Lissafin adadin istigfari da ake bukata don daidaita kuskuren lissafi.",
    excessVal: "Kuskure/Rarrafe a Lissafi:",
    requiredIstighfar: "Adadin Istigfari na Maimaitawa:",

    // 13. Hissn
    hissnTitle: "Mai Tsara Hissn (Garkuwa)",
    hissnDesc: "Fitar da lokutan sabunta garkuwar ruhi a cikin yini.",
    fajrSlot: "Asuba: Karanta Ayat al-Kursi (1 ko 7)",
    duhaSlot: "Hantsi: Karanta Suratul Ikhlas (3)",
    maghribSlot: "Ladan: Karanta Al-Falaq & An-Nas (3)",
    nightSlot: "Barci: Garkuwar Qul guda 3 (3)",

    // 14. Group
    groupTitle: "Zikirin Jama'a & Manufa Ɗaya",
    groupDesc: "Haɗa lissafin mutane da yawa don samun manufa guda na zikiri.",
    participantName: "Sunan Dan Majalisa:",
    addParticipant: "Ƙara Mutum",
    collectiveTarget: "Jimillar Zikirin Jama'a:",
    perPersonShare: "Rabon kowane mutum:"
  }
};

const SALAWAT_PRESETS = [
  { nameFr: "Salawat Ibrahimiyyah", nameEn: "Salawat Ibrahimiyyah", nameHa: "Salatin Ibrahimiyya", arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ", abjad: 818 },
  { nameFr: "Salawat Al-Fatih", nameEn: "Salawat Al-Fatih", nameHa: "Salatin Fatih", arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ", abjad: 1122 },
  { nameFr: "Salawat Al-Ummiyyah", nameEn: "Salawat Al-Ummiyyah", nameHa: "Salatin Ummiyyi", arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الأُمِّيِّ", abjad: 757 },
  { nameFr: "Salawat Al-Tanjiyyah (Inqadh)", nameEn: "Salawat Al-Tanjiyyah", nameHa: "Salatin Tanjiyyah", arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلاَةً تُنْجِينَا بِهَا مِنْ جَمِيعِ الأَهْوَالِ", abjad: 1414 },
  { nameFr: "Salawat Al-Nariyyah", nameEn: "Salawat Al-Nariyyah", nameHa: "Salatin Nariyyah", arabic: "اللَّهُمَّ صَلِّ صَلاَةً كَامِلَةً وَسَلِّمْ سَلاَماً تَامّاً عَلَى سَيِّدِنَا مُحَمَّدٍ", abjad: 1233 }
];

export const RitualDhikrCalculator: React.FC = () => {
  const { language } = useLanguage();
  const { isPremium } = useAuth();
  const t = translations[(language as 'fr' | 'en' | 'ha') || 'fr'] || translations.fr;

  const [activeTab, setActiveTab] = useState<
    'planner' | 'counter' | 'multipliers' | 'weekly' | 'zakat' | 'riyadah' |
    'versetiming' | 'inqadh' | 'splitter' | 'tracker' | 'salawat' | 'istighfar' | 'hissn' | 'group'
  >('planner');

  // Core State
  const [inputText, setInputText] = useState('يا لطيف');
  const [targetDays, setTargetDays] = useState(7);
  const [copied, setCopied] = useState(false);

  // Counter state
  const [count, setCount] = useState(0);
  const [targetCount, setTargetCount] = useState(129);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Group Dhikr state
  const [participants, setParticipants] = useState<{ name: string; abjad: number }[]>([
    { name: 'محمد', abjad: 92 },
    { name: 'علي', abjad: 110 }
  ]);
  const [newParticipantName, setNewParticipantName] = useState('');

  // Weekly State
  const [weeklyDone, setWeeklyDone] = useState<Record<number, boolean>>({});

  // Tracker State
  const [streak, setStreak] = useState(() => {
    return Number(localStorage.getItem('asrarhub_dhikr_streak') || 3);
  });
  const [todayLogged, setTodayLogged] = useState(() => {
    return localStorage.getItem('asrarhub_dhikr_logged_' + new Date().toISOString().slice(0, 10)) === 'true';
  });

  // Text Splitter State
  const [longText, setLongText] = useState('الله لطيف بعباده يرزق من يشاء وهو القوي العزيز');

  // Computations
  const cleanArabic = inputText.replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED\s]/g, '');
  const letterCount = cleanArabic.length || 1;
  const wasatAbjad = calculateAbjadValue(cleanArabic);
  const kabirAbjad = wasatAbjad * letterCount;

  // Sound Synth via Web Audio API
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880; // A5 note
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  const handleIncrement = () => {
    const next = count + 1;
    setCount(next);

    if (vibrationEnabled && navigator.vibrate) {
      if (next === targetCount) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      } else {
        navigator.vibrate(30);
      }
    }

    if (next === targetCount) {
      if (soundEnabled) playBeep();
    }
  };

  const handleLaunchToCounter = (val: number) => {
    setTargetCount(val);
    setCount(0);
    setActiveTab('counter');
  };

  const handleAddParticipant = () => {
    if (!newParticipantName) return;
    const val = calculateAbjadValue(newParticipantName);
    setParticipants([...participants, { name: newParticipantName, abjad: val }]);
    setNewParticipantName('');
  };

  const handleRemoveParticipant = (idx: number) => {
    setParticipants(participants.filter((_, i) => i !== idx));
  };

  const handleLogToday = () => {
    if (!todayLogged) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setTodayLogged(true);
      const todayStr = new Date().toISOString().slice(0, 10);
      localStorage.setItem('asrarhub_dhikr_streak', String(newStreak));
      localStorage.setItem('asrarhub_dhikr_logged_' + todayStr, 'true');
    }
  };

  // Weekly asymmetric distribution weights: Friday (1.5), Monday (1.3), Wed (1.1), Tue/Sun/Thu/Sat (1.0)
  const dayWeights = [1.5, 1.0, 1.3, 1.1, 1.0, 1.0, 1.0]; // Fri, Sat, Sun, Mon, Tue, Wed, Thu
  const dayNamesFr = ['Vendredi (الجمعة)', 'Samedi (السبت)', 'Dimanche (الأحد)', 'Lundi (الإثنين)', 'Mardi (الثلاثاء)', 'Mercredi (الأربعاء)', 'Jeudi (الخميس)'];
  const dayNamesEn = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const dayNamesHa = ['Jumma\'a', 'Asabar', 'Lahadi', 'Litinin', 'Talata', 'Laraba', 'Alhamis'];
  const currentDayNames = language === 'en' ? dayNamesEn : language === 'ha' ? dayNamesHa : dayNamesFr;

  const totalWeights = dayWeights.reduce((a, b) => a + b, 0);
  const weeklyPortions = dayWeights.map(w => Math.round((wasatAbjad * w * 7) / totalWeights));

  const groupTotalAbjad = participants.reduce((acc, p) => acc + p.abjad, 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-7 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6 w-full max-w-full overflow-hidden">
      {/* Title Header */}
      <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
          <Calculator className="text-emerald-500 shrink-0" size={26} />
          <span>{t.title}</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Main Input Control */}
      <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">{t.inputLabel}</label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-xl font-arabic font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            dir="rtl"
          />
        </div>

        <div className="flex items-center justify-around bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-bold">{t.abjadValue}</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{wasatAbjad}</span>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-bold">{t.lettersCount}</span>
            <span className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">{letterCount}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-gray-200 dark:border-gray-700 text-xs font-bold">
        {[
          { id: 'planner', label: t.tabPlanner, icon: <Calendar size={14} /> },
          { id: 'counter', label: t.tabCounter, icon: <Activity size={14} /> },
          { id: 'multipliers', label: t.tabMultipliers, icon: <Layers size={14} /> },
          { id: 'weekly', label: t.tabWeekly, icon: <Clock size={14} /> },
          { id: 'zakat', label: t.tabZakat, icon: <Coins size={14} /> },
          { id: 'riyadah', label: t.tabRiyadah, icon: <Moon size={14} /> },
          { id: 'versetiming', label: t.tabVerseTiming, icon: <Sparkles size={14} /> },
          { id: 'inqadh', label: t.tabSalatInqadh, icon: <Shield size={14} /> },
          { id: 'splitter', label: t.tabTextSplitter, icon: <BookOpen size={14} /> },
          { id: 'tracker', label: t.tabTracker, icon: <Award size={14} /> },
          { id: 'salawat', label: t.tabSalawat, icon: <Heart size={14} /> },
          { id: 'istighfar', label: t.tabIstighfar, icon: <RotateCcw size={14} /> },
          { id: 'hissn', label: t.tabHissn, icon: <Shield size={14} /> },
          { id: 'group', label: t.tabGroup, icon: <Users size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. PLANIFICATEUR DE DHIKR */}
      {activeTab === 'planner' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-emerald-500" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.plannerTitle}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.plannerDesc}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase">{t.modeAsli}</span>
              <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{wasatAbjad}</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase">{t.modeWasat}</span>
              <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">{wasatAbjad * 3}</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase">{t.modeKabir}</span>
              <span className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">{kabirAbjad}</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span>{t.daysTargetLabel}</span>
              <span className="text-emerald-600 font-mono text-sm">{targetDays} jours</span>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              value={targetDays}
              onChange={(e) => setTargetDays(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl flex justify-between items-center text-xs">
              <span className="font-bold text-gray-700 dark:text-gray-300">{t.dailyQuota}</span>
              <span className="font-mono font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                {Math.ceil(wasatAbjad / targetDays)} {t.perDay}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPTEUR INTELLIGENT */}
      {activeTab === 'counter' && (
        <div className="space-y-4 text-center max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2">
            <Activity className="text-emerald-500" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.counterTitle}</h3>
          </div>

          <div className="flex justify-center gap-3 text-xs font-bold">
            <button
              onClick={() => setVibrationEnabled(!vibrationEnabled)}
              className={`px-3 py-1.5 rounded-xl border transition-colors ${
                vibrationEnabled ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {vibrationEnabled ? t.vibrationOn : t.vibrationOff}
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1.5 rounded-xl border transition-colors ${
                soundEnabled ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {soundEnabled ? t.soundOn : t.soundOff}
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-b from-emerald-500/10 to-teal-500/5 border-2 border-emerald-500/30 space-y-4">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 flex justify-between">
              <span>{t.targetLabel} <strong className="font-mono text-emerald-600">{targetCount}</strong></span>
              <span>{Math.round((count / (targetCount || 1)) * 100)}%</span>
            </div>

            {/* Tap Button */}
            <button
              onClick={handleIncrement}
              className="w-40 h-40 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full shadow-2xl flex flex-col items-center justify-center active:scale-95 transition-transform cursor-pointer border-4 border-white dark:border-gray-800"
            >
              <span className="text-4xl font-extrabold font-mono">{count}</span>
              <span className="text-[10px] uppercase font-bold opacity-80 mt-1">{t.tapToCount}</span>
            </button>

            {count >= targetCount && (
              <div className="p-3 bg-emerald-500 text-white rounded-xl font-bold text-xs animate-bounce">
                {t.targetReached}
              </div>
            )}

            <button
              onClick={() => setCount(0)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <RotateCcw size={14} /> {t.resetBtn}
            </button>
          </div>
        </div>
      )}

      {/* 3. MULTIPLICATEURS SPIRITUELS */}
      {activeTab === 'multipliers' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="text-emerald-500" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.multipliersTitle}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.multipliersDesc}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { factor: 1, label: 'x1 (Base)', count: wasatAbjad },
              { factor: 3, label: 'x3 (Sceau Badr)', count: wasatAbjad * 3 },
              { factor: 7, label: 'x7 (Piliers)', count: wasatAbjad * 7 },
              { factor: 11, label: 'x11 (Lumières)', count: wasatAbjad * 11 },
              { factor: 33, label: 'x33 (Tasbih)', count: wasatAbjad * 33 },
              { factor: 66, label: 'x66 (Nom Allah)', count: wasatAbjad * 66 },
              { factor: 111, label: 'x111 (Alif)', count: wasatAbjad * 111 },
              { factor: 313, label: 'x313 (Badr)', count: wasatAbjad * 313 },
              { factor: 1000, label: 'x1000 (Fath)', count: wasatAbjad * 1000 },
            ].map((item) => (
              <div key={item.factor} className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">{item.label}</span>
                  <span className="text-xl font-bold font-mono text-gray-900 dark:text-white mt-1 block">{item.count}</span>
                </div>
                <button
                  onClick={() => handleLaunchToCounter(item.count)}
                  className="mt-3 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Activity size={12} /> {t.sendToCounter}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. REPARTITION HEBDOMADAIRE */}
      {activeTab === 'weekly' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="text-emerald-500" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.weeklyTitle}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.weeklyDesc}</p>

          <div className="space-y-2">
            {weeklyPortions.map((portion, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-colors ${
                  weeklyDone[idx] ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">{currentDayNames[idx]}</span>
                  <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">{portion} récits</span>
                </div>
                <button
                  onClick={() => setWeeklyDone({ ...weeklyDone, [idx]: !weeklyDone[idx] })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    weeklyDone[idx] ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Check size={14} /> {t.markDone}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ZAKAT DU NOM */}
      {activeTab === 'zakat' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Coins className="text-amber-500" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.zakatTitle}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.zakatDesc}</p>

          <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 space-y-3">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase block">{t.recommendedCharity}</span>
            <div className="text-3xl font-mono font-extrabold text-amber-700 dark:text-amber-400">
              {Math.ceil(wasatAbjad * 0.025)} pièces / unités
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Équivalent à 2,5% de la fréquence d'Abjad ({wasatAbjad}) pour sceller l'action rituelle.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">{t.charityTypesTitle}</h4>
            <ul className="text-xs space-y-2 text-gray-600 dark:text-gray-300">
              <li className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> {t.charityBread}
              </li>
              <li className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> {t.charityDates}
              </li>
              <li className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> {t.charityCoins}
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* 6. RIYADAH */}
      {activeTab === 'riyadah' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Moon className="text-indigo-500" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.riyadahTitle}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.riyadahDesc}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-1">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{t.ayyamBidTitle}</span>
              <p className="text-xs text-gray-600 dark:text-gray-300">13, 14, 15 de chaque mois Hijri (Pleine Lune).</p>
            </div>

            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-1">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{t.retreat3Days}</span>
              <p className="text-xs text-gray-600 dark:text-gray-300">Purification rapide du cœur et purification mentale.</p>
            </div>

            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-1">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{t.retreat7Days}</span>
              <p className="text-xs text-gray-600 dark:text-gray-300">Intégration profonde du secret du Nom Divin.</p>
            </div>

            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-1">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{t.retreat40Days}</span>
              <p className="text-xs text-gray-600 dark:text-gray-300">Grand Arba'in de sublimation spirituelle.</p>
            </div>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-800 dark:text-amber-300">
            {t.dietAdvice}
          </div>
        </div>
      )}

      {/* 7. VERSE TIMING */}
      {activeTab === 'versetiming' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-500" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.timingTitle}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.timingDesc}</p>

          <div className="space-y-2.5">
            <div className="p-3.5 bg-red-50/50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-800/40 text-xs font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
              <Flame size={16} /> {t.elementFire}
            </div>
            <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800/40 text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Droplets size={16} /> {t.elementWater}
            </div>
            <div className="p-3.5 bg-cyan-50/50 dark:bg-cyan-950/30 rounded-2xl border border-cyan-200 dark:border-cyan-800/40 text-xs font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-2">
              <Wind size={16} /> {t.elementAir}
            </div>
            <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/40 text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Mountain size={16} /> {t.elementEarth}
            </div>
          </div>
        </div>
      )}

      {/* 8. SALAT AL-INQADH */}
      {activeTab === 'inqadh' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="text-emerald-500" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.inqadhTitle}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.inqadhDesc}</p>

          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">{t.totalRakaats}</span>
            <span className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">12 Raka'ats</span>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-bold text-gray-800 dark:text-gray-200">{t.scheduleSlots}</span>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              4 Raka'ats au Sahar (Tiers de Nuit)
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              4 Raka'ats au Duha (Matin)
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              4 Raka'ats après Isha
            </div>
          </div>
        </div>
      )}

      {/* 9. SEPARATEUR DE TEXTE */}
      {activeTab === 'splitter' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="text-emerald-500" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.splitterTitle}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.splitterDesc}</p>

          <textarea
            value={longText}
            onChange={(e) => setLongText(e.target.value)}
            placeholder={t.textInputPlaceholder}
            className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-2xl text-base font-arabic text-gray-900 dark:text-white h-24 focus:ring-2 focus:ring-emerald-500 outline-none"
            dir="rtl"
          />

          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{t.segmentsResult}</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {longText.split(/\s+/).reduce((acc: string[][], word, idx) => {
                if (idx % 3 === 0) acc.push([word]);
                else acc[acc.length - 1].push(word);
                return acc;
              }, []).map((seg, i) => {
                const segText = seg.join(' ');
                const val = calculateAbjadValue(segText);
                return (
                  <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs">
                    <span className="font-arabic text-sm font-bold text-emerald-800 dark:text-emerald-300" dir="rtl">{segText}</span>
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 10. TRAQUEUR DE CONSTANCE */}
      {activeTab === 'tracker' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="text-emerald-500" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.trackerTitle}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.trackerDesc}</p>

          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-2 border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase block">{t.currentStreak}</span>
              <span className="text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{streak} {t.daysCount}</span>
            </div>

            <button
              onClick={handleLogToday}
              disabled={todayLogged}
              className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md ${
                todayLogged ? 'bg-emerald-800 text-white opacity-80 cursor-default' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Check size={18} />
              <span>{todayLogged ? t.loggedToday : t.logTodayBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* 11. SALAWAT HARMONISEES */}
      {activeTab === 'salawat' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="text-rose-500" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.salawatTitle}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.salawatDesc}</p>

          <div className="space-y-3">
            {SALAWAT_PRESETS.map((sal, idx) => {
              const nameLabel = language === 'en' ? sal.nameEn : language === 'ha' ? sal.nameHa : sal.nameFr;
              return (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{nameLabel}</span>
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">Abjad: {sal.abjad}</span>
                  </div>
                  <p className="text-lg font-arabic font-bold text-emerald-800 dark:text-emerald-300" dir="rtl">{sal.arabic}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 12. ISTIGHFAR COMPENSATEUR */}
      {activeTab === 'istighfar' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <RotateCcw className="text-purple-500" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.istighfarTitle}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.istighfarDesc}</p>

          <div className="p-5 rounded-2xl bg-purple-500/10 border-2 border-purple-500/30 space-y-3">
            <span className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase block">{t.requiredIstighfar}</span>
            <div className="text-4xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
              {wasatAbjad * 3} Istighfar
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Astaghfirullah al-Adheem (أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ) pour harmoniser et dénouer les excès vibratoires.
            </p>
          </div>
        </div>
      )}

      {/* 13. HISSN PROTECTION */}
      {activeTab === 'hissn' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="text-emerald-500" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.hissnTitle}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.hissnDesc}</p>

          <div className="space-y-2.5 text-xs font-bold">
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 rounded-2xl text-emerald-800 dark:text-emerald-300">
              {t.fajrSlot}
            </div>
            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-2xl text-blue-800 dark:text-blue-300">
              {t.duhaSlot}
            </div>
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 rounded-2xl text-amber-800 dark:text-amber-300">
              {t.maghribSlot}
            </div>
            <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 rounded-2xl text-indigo-800 dark:text-indigo-300">
              {t.nightSlot}
            </div>
          </div>
        </div>
      )}

      {/* 14. DHIKR DE GROUPE */}
      {activeTab === 'group' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="text-emerald-500" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.groupTitle}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.groupDesc}</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              placeholder={t.participantName}
              className="flex-1 px-3.5 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-arabic font-bold text-gray-900 dark:text-white outline-none"
              dir="rtl"
            />
            <button
              onClick={handleAddParticipant}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={16} /> {t.addParticipant}
            </button>
          </div>

          <div className="space-y-2">
            {participants.map((p, idx) => (
              <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs">
                <span className="font-arabic font-bold text-base text-gray-900 dark:text-white" dir="rtl">{p.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-emerald-600">Abjad: {p.abjad}</span>
                  <button onClick={() => handleRemoveParticipant(idx)} className="text-red-500 hover:text-red-700 cursor-pointer">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl grid grid-cols-2 gap-2 text-center">
            <div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold block">{t.collectiveTarget}</span>
              <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{groupTotalAbjad}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold block">{t.perPersonShare}</span>
              <span className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">
                {Math.ceil(groupTotalAbjad / (participants.length || 1))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
