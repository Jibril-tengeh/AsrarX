import React, { useState, useEffect } from 'react';
import {
  Calculator,
  RotateCcw,
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
  Volume2,
  VolumeX,
  Zap,
  CheckCircle2,
  Share2,
  Download
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateAbjadValue } from '../utils/abjad';
import { motion, AnimatePresence } from 'motion/react';
import { RiyadahFastingCalendar } from './RiyadahFastingCalendar';

interface TranslationSet {
  title: string;
  subtitle: string;
  
  // Tabs
  tabPlanner: string;
  tabCounter: string;
  tabMultipliers: string;
  tabWeekly: string;
  tabZakat: string;
  tabRiyadah: string;
  tabVerseTiming: string;
  tabSalatInqadh: string;
  tabTextSplitter: string;
  tabTracker: string;
  tabSalawat: string;
  tabIstighfar: string;
  tabHissn: string;
  tabGroup: string;

  // Common labels
  inputLabel: string;
  inputPlaceholder: string;
  abjadValue: string;
  lettersCount: string;
  copyBtn: string;
  copied: string;
  daysUnit: string;
  recitationsUnit: string;
  piecesUnit: string;

  // 1. Planner
  plannerTitle: string;
  plannerDesc: string;
  modeAsli: string;
  modeAsliDesc: string;
  modeWasat: string;
  modeWasatDesc: string;
  modeKabir: string;
  modeKabirDesc: string;
  daysTargetLabel: string;
  dailyQuota: string;
  perDay: string;

  // 2. Smart Counter
  counterTitle: string;
  counterDesc: string;
  targetLabel: string;
  currentCount: string;
  targetReached: string;
  vibrationOn: string;
  vibrationOff: string;
  soundOn: string;
  soundOff: string;
  resetBtn: string;
  tapToCount: string;
  quickPresets: string;

  // 3. Multipliers
  multipliersTitle: string;
  multipliersDesc: string;
  sendToCounter: string;
  multBase: string;
  multBadrSeal: string;
  multPillars: string;
  multLights: string;
  multTasbih: string;
  multAllahName: string;
  multAlif: string;
  multBadrArmy: string;
  multFath: string;

  // 4. Weekly Split
  weeklyTitle: string;
  weeklyDesc: string;
  fridayWeight: string;
  mondayWeight: string;
  wednesdayWeight: string;
  otherDays: string;
  markDone: string;
  completed: string;
  daysList: string[];

  // 5. Name Zakat
  zakatTitle: string;
  zakatDesc: string;
  recommendedCharity: string;
  charityRateDesc: string;
  charityTypesTitle: string;
  charityBread: string;
  charityDates: string;
  charityCoins: string;

  // 6. Riyadah
  riyadahTitle: string;
  riyadahDesc: string;
  ayyamBidTitle: string;
  ayyamBidDesc: string;
  retreat3Days: string;
  retreat3DaysDesc: string;
  retreat7Days: string;
  retreat7DaysDesc: string;
  retreat40Days: string;
  retreat40DaysDesc: string;
  dietAdvice: string;

  // 7. Verse Timing
  timingTitle: string;
  timingDesc: string;
  elementFire: string;
  elementWater: string;
  elementAir: string;
  elementEarth: string;

  // 8. Salat al-Inqadh
  inqadhTitle: string;
  inqadhDesc: string;
  totalRakaats: string;
  scheduleSlots: string;
  inqadhSlot1: string;
  inqadhSlot2: string;
  inqadhSlot3: string;

  // 9. Text Splitter
  splitterTitle: string;
  splitterDesc: string;
  textInputPlaceholder: string;
  segmentsResult: string;
  splitInfo: string;

  // 10. Constancy Tracker
  trackerTitle: string;
  trackerDesc: string;
  currentStreak: string;
  daysCount: string;
  logTodayBtn: string;
  loggedToday: string;
  streakAdvice: string;

  // 11. Salawat
  salawatTitle: string;
  salawatDesc: string;
  harmonyScore: string;
  salawatAbjadLabel: string;
  salawatList: { name: string; arabic: string; abjad: number }[];

  // 12. Istighfar
  istighfarTitle: string;
  istighfarDesc: string;
  excessVal: string;
  requiredIstighfar: string;
  istighfarFormula: string;
  istighfarExplanation: string;

  // 13. Hissn
  hissnTitle: string;
  hissnDesc: string;
  fajrSlot: string;
  duhaSlot: string;
  maghribSlot: string;
  nightSlot: string;
  layerActive: string;
  layerPending: string;

  // 14. Group Dhikr
  groupTitle: string;
  groupDesc: string;
  participantName: string;
  addParticipant: string;
  collectiveTarget: string;
  perPersonShare: string;
  noParticipants: string;
}

const translations: Record<'fr' | 'en' | 'ha', TranslationSet> = {
  fr: {
    title: "Calculs de Rituels (Awrad & Dhikr)",
    subtitle: "Module avancé de planification, d'harmonisation numérique et de gestion des 14 dimensions de récitation spirituelle.",
    
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

    // Common labels
    inputLabel: "Nom, Formule ou Verset (en arabe) :",
    inputPlaceholder: "ex: يا لطيف, يا رزاق, محمد, سورة الإخلاص...",
    abjadValue: "Valeur Abjad Total :",
    lettersCount: "Nombre de lettres :",
    copyBtn: "Copier",
    copied: "Copié !",
    daysUnit: "jours",
    recitationsUnit: "récitations",
    piecesUnit: "pièces / portions",

    // 1. Planificateur
    plannerTitle: "Planificateur de Dhikr",
    plannerDesc: "Détermine le nombre de répétitions optimales d'après l'Abjad d'un nom ou d'une formule pour chaque palier.",
    modeAsli: "Mode Asli (Valeur Directe)",
    modeAsliDesc: "Valeur numérique brute issue du calcul des lettres arabes.",
    modeWasat: "Mode Wasat (Poids de Résonance)",
    modeWasatDesc: "Fréquence d'amplification médiane pour une récitation régulière.",
    modeKabir: "Mode Kabir (Abjad × Lettres)",
    modeKabirDesc: "Multiplication de la valeur totale par le nombre de lettres constituantes.",
    daysTargetLabel: "Durée du rituel (jours) :",
    dailyQuota: "Quota Quotidien :",
    perDay: "récitations / jour",

    // 2. Compteur Intelligent
    counterTitle: "Compteur Intelligent",
    counterDesc: "Chapelet virtuel vibrant et sonore alertant au nombre d'Abjad cible atteint.",
    targetLabel: "Nombre Cible :",
    currentCount: "Répétitions :",
    targetReached: "Objectif Atteint ! Mabrouk 📿",
    vibrationOn: "Vibration Activée",
    vibrationOff: "Vibration Désactivée",
    soundOn: "Son Activé",
    soundOff: "Son Désactivé",
    resetBtn: "Réinitialiser",
    tapToCount: "Appuyez pour compter",
    quickPresets: "Cibles Rapides :",

    // 3. Multiplicateurs Spirituels
    multipliersTitle: "Multiplicateurs Spirituels",
    multipliersDesc: "Propose des paliers de récitation basés sur les coefficients classiques de la tradition mystique.",
    sendToCounter: "Lancer dans le Compteur",
    multBase: "x1 (Base Asli)",
    multBadrSeal: "x3 (Sceau de Badr)",
    multPillars: "x7 (7 Piliers Célestes)",
    multLights: "x11 (11 Nombres de Lumière)",
    multTasbih: "x33 (Degré du Tasbih)",
    multAllahName: "x66 (Valeur du Nom Majestueux Allah)",
    multAlif: "x111 (Secret de l'Alif & Pôle)",
    multBadrArmy: "x313 (Compagnons de Badr & Messagers)",
    multFath: "x1000 (Fath & Ouverture Suprême)",

    // 4. Répartition Hebdomadaire
    weeklyTitle: "Répartition Hebdomadaire",
    weeklyDesc: "Divise un grand calcul en portions asymétriques sur les 7 jours de la semaine selon l'énergie des jours.",
    fridayWeight: "Vendredi (Jour Béni / x1.5)",
    mondayWeight: "Lundi (Jour Prophétique / x1.3)",
    wednesdayWeight: "Mercredi (Ouverture de Lumière / x1.1)",
    otherDays: "Autres jours (Équilibré / x1.0)",
    markDone: "Valider",
    completed: "Terminé",
    daysList: ['Vendredi (الجمعة)', 'Samedi (السبت)', 'Dimanche (الأحد)', 'Lundi (الإثنين)', 'Mardi (الثلاثاء)', 'Mercredi (الأربعاء)', 'Jeudi (الخميس)'],

    // 5. Zakat du Nom
    zakatTitle: "Zakat du Nom (Aumône Rituelle)",
    zakatDesc: "Calcule l'équivalent d'aumône recommandé pour accompagner un cycle d'invocation et sceller son efficacité.",
    recommendedCharity: "Aumône Recommandée :",
    charityRateDesc: "Correspond à 2,5% de la fréquence d'Abjad pour ancrer matériellement la bénédiction.",
    charityTypesTitle: "Formes d'Aumônes Suggérées :",
    charityBread: "Pains, galettes ou repas partagés aux personnes démunies",
    charityDates: "Dattes fraîches, fruits ou lait pur pour rompre le jeûne",
    charityCoins: "Pièces de monnaie données en aumône discrète et sincère",

    // 6. Jeûne Temporel (Riyadah)
    riyadahTitle: "Jeûne Temporel & Retraite (Riyadah)",
    riyadahDesc: "Calcule les dates idéales de retraite et de purification d'après le cycle lunaire personnel.",
    ayyamBidTitle: "Les Jours Blancs (13, 14, 15 Hijri)",
    ayyamBidDesc: "Période de pleine lune lunaire idéale pour le jeûne et l'ouverture des perceptions subtiles.",
    retreat3Days: "Retraite Spirituelle de 3 Jours",
    retreat3DaysDesc: "Purification rapide du cœur, jeûne diurne et isolement mental des distractions.",
    retreat7Days: "Retraite de 7 Jours (Riyadah Suprême)",
    retreat7DaysDesc: "Assimilation profonde des secrets du Nom Divin et immersion complète.",
    retreat40Days: "Grand Arba'in (40 Jours)",
    retreat40DaysDesc: "Sublimation de l'âme et consécration selon la voie des grands maîtres soufis.",
    dietAdvice: "Conseil de Diète (Riyadah) : Éviter les produits d'origine animale (Zalalat) et maintenir en permanence la pureté rituelle (Wudu).",

    // 7. Timing de Versets
    timingTitle: "Timing & Résonance de Versets",
    timingDesc: "Détermine le moment exact de la journée où un verset a sa résonance vibratoire maximale selon sa nature.",
    elementFire: "Nature Feu → Heure du Duha (Plein Soleil & Rayonnement)",
    elementWater: "Nature Eau → Heure du Maghrib (Coucher du Soleil & Apaisement)",
    elementAir: "Nature Air → Heure du Fajr (Aube Céleste & Inspiration)",
    elementEarth: "Nature Terre → Heure du Sahar (Dernier Tiers de Nuit & Ancrage)",

    // 8. Salat al-Inqadh
    inqadhTitle: "Répartition de Salat al-Inqadh",
    inqadhDesc: "Calcule la distribution horaire de prières d'urgence pour le dénouement des épreuves et le secours rapide.",
    totalRakaats: "Total Raka'ats d'Urgence :",
    scheduleSlots: "Créneaux d'Exécution Recommandés :",
    inqadhSlot1: "4 Raka'ats au Sahar (Dernier tiers de la nuit avant le Fajr)",
    inqadhSlot2: "4 Raka'ats au Duha (Matinée en plein rayonnement solaire)",
    inqadhSlot3: "4 Raka'ats après la prière de l'Isha (Avant le repos nocturne)",

    // 9. Séparateur de Texte
    splitterTitle: "Séparateur de Texte par Abjad",
    splitterDesc: "Divise un long texte en portions de valeurs numériques globales identiques pour une récitation équilibrée.",
    textInputPlaceholder: "Collez un long texte, des versets ou plusieurs formules arabes...",
    segmentsResult: "Portions Équilibrées Obtenues :",
    splitInfo: "Chaque segment est calibré pour conserver une harmonie numérique proportionnelle.",

    // 10. Traqueur de Constance
    trackerTitle: "Traqueur de Constance",
    trackerDesc: "Enregistre la régularité des cycles de récitation quotidienne de l'utilisateur.",
    currentStreak: "Série Actuelle d'Assiduité :",
    daysCount: "jours consécutifs",
    logTodayBtn: "Valider le Dhikr d'Aujourd'hui",
    loggedToday: "Aujourd'hui validé avec succès !",
    streakAdvice: "La constance dans les petits actes spirituels est plus aimée d'Allah que les grands actes sporadiques.",

    // 11. Salawat
    salawatTitle: "Générateur de Salawat Harmonisées",
    salawatDesc: "Propose des prières dont la somme d'Abjad s'accorde avec le prénom ou l'intention de l'utilisateur.",
    harmonyScore: "Accord Vibratoire :",
    salawatAbjadLabel: "Poids Abjad :",
    salawatList: [
      { name: "Salawat Ibrahimiyyah", arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ", abjad: 818 },
      { name: "Salawat Al-Fatih", arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ", abjad: 1122 },
      { name: "Salawat Al-Ummiyyah", arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الأُمِّيِّ", abjad: 757 },
      { name: "Salawat Al-Tanjiyyah (Secours)", arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلاَةً تُنْجِينَا بِهَا مِنْ جَمِيعِ الأَهْوَالِ", abjad: 1414 },
      { name: "Salawat Al-Nariyyah (Tafrijiyyah)", arabic: "اللَّهُمَّ صَلِّ صَلاَةً كَامِلَةً وَسَلِّمْ سَلاَماً تَامّاً عَلَى سَيِّدِنَا مُحَمَّدٍ", abjad: 1233 }
    ],

    // 12. Istighfar Compensateur
    istighfarTitle: "Istighfar Compensateur (الاستغفار المجبّر)",
    istighfarDesc: "Calcule le nombre de demandes de pardon requis pour neutraliser un excès ou un écart d'Abjad.",
    excessVal: "Écart ou Excès calculé :",
    requiredIstighfar: "Nombre d'Istighfar Recommandés :",
    istighfarFormula: "Formule : Astaghfirullah al-Adheem wa Atubu Ilayh (أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ)",
    istighfarExplanation: "Cette compensation purifie le rituel de toute surcharge énergétique ou distraction durant l'invocation.",

    // 13. Planificateur de Hissn
    hissnTitle: "Planificateur de Hissn (Protection)",
    hissnDesc: "Détermine les créneaux quotidiens pour réactiver les couches successives de protection spirituelle.",
    fajrSlot: "Aube (Fajr) : Récitation Ayat al-Kursi (1x ou 7x) - Sceau de Protection Diurne",
    duhaSlot: "Matin (Duha) : Récitation Sourate Al-Ikhlas (3x) - Lumière de Tawhid",
    maghribSlot: "Crépuscule (Maghrib) : Récitation Al-Falaq & An-Nas (3x) - Bouclier contre les Ombres",
    nightSlot: "Coucher (Nuit) : Récitation des 3 Quls & Ayat al-Kursi (3x) - Clôture Astrale",
    layerActive: "Protection Active",
    layerPending: "À réactiver",

    // 14. Dhikr de Groupe
    groupTitle: "Dhikr de Groupe & Cible Collective",
    groupDesc: "Additionne les Abjads de plusieurs participants pour définir une cible collective unifiée.",
    participantName: "Nom ou Prénom du Participant :",
    addParticipant: "Ajouter Participant",
    collectiveTarget: "Cible Collective Totale :",
    perPersonShare: "Quota moyen par personne :",
    noParticipants: "Aucun participant ajouté pour le moment."
  },

  en: {
    title: "Ritual Calculations (Awrad & Dhikr)",
    subtitle: "Advanced module for planning, numerical harmonization, and managing the 14 dimensions of spiritual recitation.",
    
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

    // Common labels
    inputLabel: "Name, Formula or Verse (in Arabic):",
    inputPlaceholder: "e.g., يا لطيف, يا رزاق, محمد, سورة الإخلاص...",
    abjadValue: "Total Abjad Value:",
    lettersCount: "Letter Count:",
    copyBtn: "Copy",
    copied: "Copied!",
    daysUnit: "days",
    recitationsUnit: "recitations",
    piecesUnit: "pieces / shares",

    // 1. Planner
    plannerTitle: "Dhikr Planner",
    plannerDesc: "Determines optimal repetition counts based on a name's or formula's Abjad value across each tier.",
    modeAsli: "Asli Mode (Direct Value)",
    modeAsliDesc: "Raw numerical value calculated from Arabic letters.",
    modeWasat: "Wasat Mode (Resonance Weight)",
    modeWasatDesc: "Median frequency amplification for regular recitation practice.",
    modeKabir: "Kabir Mode (Abjad × Letters)",
    modeKabirDesc: "Total value multiplied by the constituent letter count.",
    daysTargetLabel: "Ritual duration (days):",
    dailyQuota: "Daily Quota:",
    perDay: "recitations / day",

    // 2. Smart Counter
    counterTitle: "Smart Counter",
    counterDesc: "Virtual rosary with vibration and sound alerts when reaching the target Abjad count.",
    targetLabel: "Target Count:",
    currentCount: "Recitations:",
    targetReached: "Target Reached! Mabrouk 📿",
    vibrationOn: "Vibration Enabled",
    vibrationOff: "Vibration Disabled",
    soundOn: "Sound Enabled",
    soundOff: "Sound Disabled",
    resetBtn: "Reset",
    tapToCount: "Tap to count",
    quickPresets: "Quick Targets:",

    // 3. Multipliers
    multipliersTitle: "Spiritual Multipliers",
    multipliersDesc: "Proposes recitation tiers based on classic sacred coefficients from Sufi mystical tradition.",
    sendToCounter: "Launch in Counter",
    multBase: "x1 (Asli Base)",
    multBadrSeal: "x3 (Seal of Badr)",
    multPillars: "x7 (7 Celestial Pillars)",
    multLights: "x11 (11 Light Numbers)",
    multTasbih: "x33 (Tasbih Degree)",
    multAllahName: "x66 (Majestic Name Allah Value)",
    multAlif: "x111 (Secret of Alif & Pole)",
    multBadrArmy: "x313 (Companions of Badr & Messengers)",
    multFath: "x1000 (Fath & Supreme Victory)",

    // 4. Weekly Split
    weeklyTitle: "Weekly Distribution",
    weeklyDesc: "Splits a large total count into asymmetric portions across the 7 days according to each day's spiritual energy.",
    fridayWeight: "Friday (Blessed Day / x1.5)",
    mondayWeight: "Monday (Prophetic Day / x1.3)",
    wednesdayWeight: "Wednesday (Light Opening / x1.1)",
    otherDays: "Other Days (Balanced / x1.0)",
    markDone: "Mark Done",
    completed: "Completed",
    daysList: ['Friday (الجمعة)', 'Saturday (السبت)', 'Sunday (الأحد)', 'Monday (الإثنين)', 'Tuesday (الثلاثاء)', 'Wednesday (الأربعاء)', 'Thursday (الخميس)'],

    // 5. Name Zakat
    zakatTitle: "Name Zakat (Ritual Charity)",
    zakatDesc: "Calculates recommended charity equivalent to accompany and seal an invocation cycle.",
    recommendedCharity: "Recommended Charity:",
    charityRateDesc: "Equals 2.5% of the Abjad frequency to materially ground the spiritual blessing.",
    charityTypesTitle: "Suggested Charity Forms:",
    charityBread: "Loaves of bread, baked goods or meals shared with the needy",
    charityDates: "Fresh dates, seasonal fruits or pure milk",
    charityCoins: "Coins given as sincere and discrete charity",

    // 6. Riyadah
    riyadahTitle: "Temporal Fasting & Retreat (Riyadah)",
    riyadahDesc: "Calculates ideal retreat and purification dates based on your lunar cycle.",
    ayyamBidTitle: "The White Days (13th, 14th, 15th Hijri)",
    ayyamBidDesc: "Full moon lunar period ideal for fasting and sharpening subtle spiritual senses.",
    retreat3Days: "3-Day Spiritual Retreat",
    retreat3DaysDesc: "Fast heart purification, diurnal fasting, and mental isolation from worldly noise.",
    retreat7Days: "7-Day Retreat (Supreme Riyadah)",
    retreat7DaysDesc: "Deep assimilation of Divine Name secrets and total spiritual immersion.",
    retreat40Days: "Grand Arba'in (40 Days)",
    retreat40DaysDesc: "Soul elevation and lifelong consecration according to classical masters.",
    dietAdvice: "Dietary Advice (Riyadah): Avoid animal products (Zalalat) and continuously maintain ritual purity (Wudu).",

    // 7. Verse Timing
    timingTitle: "Verse Timing & Resonance",
    timingDesc: "Determines the exact time of day where a verse reaches maximum vibrational resonance based on its nature.",
    elementFire: "Fire Nature → Duha Hour (Midday Sun & Radiance)",
    elementWater: "Water Nature → Maghrib Hour (Sunset & Serenity)",
    elementAir: "Air Nature → Fajr Hour (Celestial Dawn & Inspiration)",
    elementEarth: "Earth Nature → Sahar Hour (Last 3rd of Night & Grounding)",

    // 8. Salat al-Inqadh
    inqadhTitle: "Salat al-Inqadh Distribution",
    inqadhDesc: "Calculates hourly distribution of emergency prayers for rapid relief in times of distress.",
    totalRakaats: "Total Emergency Raka'ats:",
    scheduleSlots: "Recommended Execution Slots:",
    inqadhSlot1: "4 Raka'ats at Sahar (Last third of the night before Fajr)",
    inqadhSlot2: "4 Raka'ats at Duha (Morning under radiant sunshine)",
    inqadhSlot3: "4 Raka'ats after Isha Prayer (Before night rest)",

    // 9. Text Splitter
    splitterTitle: "Abjad Text Splitter",
    splitterDesc: "Splits long text into portions with identical or balanced global numerical values for harmonious recitation.",
    textInputPlaceholder: "Paste long Arabic text, verses, or invocations...",
    segmentsResult: "Balanced Segments Obtained:",
    splitInfo: "Each segment is calibrated to maintain proportional numerical harmony.",

    // 10. Constancy Tracker
    trackerTitle: "Constancy Tracker",
    trackerDesc: "Records the regularity of the user's daily recitation cycles and streak progression.",
    currentStreak: "Current Constancy Streak:",
    daysCount: "consecutive days",
    logTodayBtn: "Log Today's Dhikr",
    loggedToday: "Today Logged Successfully!",
    streakAdvice: "Consistency in small spiritual deeds is more beloved to Allah than sporadic large acts.",

    // 11. Salawat
    salawatTitle: "Harmonized Salawat Generator",
    salawatDesc: "Suggests prophetic blessings whose Abjad sum accords with your name or intention.",
    harmonyScore: "Vibrational Accord:",
    salawatAbjadLabel: "Abjad Weight:",
    salawatList: [
      { name: "Salawat Ibrahimiyyah", arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ", abjad: 818 },
      { name: "Salawat Al-Fatih", arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ", abjad: 1122 },
      { name: "Salawat Al-Ummiyyah", arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الأُمِّيِّ", abjad: 757 },
      { name: "Salawat Al-Tanjiyyah (Relief)", arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلاَةً تُنْجِينَا بِهَا مِنْ جَمِيعِ الأَهْوَالِ", abjad: 1414 },
      { name: "Salawat Al-Nariyyah (Tafrijiyyah)", arabic: "اللَّهُمَّ صَلِّ صَلاَةً كَامِلَةً وَسَلِّمْ سَلاَماً تَامّاً عَلَى سَيِّدِنَا مُحَمَّدٍ", abjad: 1233 }
    ],

    // 12. Istighfar
    istighfarTitle: "Compensatory Istighfar (الاستغفار المجبّر)",
    istighfarDesc: "Calculates the number of seeking forgiveness needed to neutralize an Abjad excess or calculation variance.",
    excessVal: "Calculated Variance / Excess:",
    requiredIstighfar: "Recommended Istighfar Count:",
    istighfarFormula: "Formula: Astaghfirullah al-Adheem wa Atubu Ilayh (أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ)",
    istighfarExplanation: "This compensation purifies the ritual from energetic surplus or mental wandering during recitation.",

    // 13. Hissn
    hissnTitle: "Hissn Protection Planner",
    hissnDesc: "Determines daily time windows to reactivate successive layers of spiritual protection.",
    fajrSlot: "Dawn (Fajr): Ayat al-Kursi (1x or 7x) - Diurnal Protection Seal",
    duhaSlot: "Morning (Duha): Surah Al-Ikhlas (3x) - Light of Divine Tawhid",
    maghribSlot: "Dusk (Maghrib): Al-Falaq & An-Nas (3x) - Shield against Shadows",
    nightSlot: "Bedtime (Night): 3 Quls & Ayat al-Kursi (3x) - Astral Closure",
    layerActive: "Shield Active",
    layerPending: "Pending Activation",

    // 14. Group
    groupTitle: "Group Dhikr & Collective Target",
    groupDesc: "Adds together the Abjad values of multiple participants to define a unified collective target.",
    participantName: "Participant Full Name:",
    addParticipant: "Add Participant",
    collectiveTarget: "Total Collective Target:",
    perPersonShare: "Average Quota per Person:",
    noParticipants: "No participants added yet."
  },

  ha: {
    title: "Lissafin Ayyukan Zikiri (Awrad & Dhikr)",
    subtitle: "Ingantaccen tsarin lissafi na shirya zikiri, daidaita lambobi da gudanar da sassan aiki 14 na ruhi.",
    
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
    tabIstighfar: "Istigfari na Maimaitawa",
    tabHissn: "Tsaron Hissn",
    tabGroup: "Zikirin Jama'a",

    // Common labels
    inputLabel: "Suna, Zikiri ko Ayar Larabci:",
    inputPlaceholder: "Misali: يا لطيف, يا رزاق, محمد, سورة الإخلاص...",
    abjadValue: "Cikakken Lissafin Abjad:",
    lettersCount: "Yawan Haruffa:",
    copyBtn: "Kwafa",
    copied: "An Kwafa!",
    daysUnit: "kwanaki",
    recitationsUnit: "karatu",
    piecesUnit: "kudade / rabo",

    // 1. Planner
    plannerTitle: "Mai Tsara Zikiri",
    plannerDesc: "Yana fitar da adadin da ya dace da lissafin Abjad na suna ko zikiri a kowane mataki.",
    modeAsli: "Tsarin Asli (Lissafi Kai Tsaye)",
    modeAsliDesc: "Asalin lissafin haruffan Larabci kai tsaye.",
    modeWasat: "Tsarin Wasat (Nauyin Suna)",
    modeWasatDesc: "Lissafi na tsaka-tsaki don aikin kullum.",
    modeKabir: "Tsarin Kabir (Abjad × Haruffa)",
    modeKabirDesc: "Ninka jimillar lissafi da adadin haruffan kalmar.",
    daysTargetLabel: "Tsawon kwanakin aiki:",
    dailyQuota: "Adadin Kullum:",
    perDay: "karatu / rana",

    // 2. Smart Counter
    counterTitle: "Carbi Mai Wayo",
    counterDesc: "Carbi na waya mai girgiza da fidda sauti idan aka kai adadin da aka saita.",
    targetLabel: "Adadin da ake Nema:",
    currentCount: "Karatu:",
    targetReached: "An Kai Matakin Cika! Mabrouk 📿",
    vibrationOn: "An Citta Girgiza",
    vibrationOff: "An Kashe Girgiza",
    soundOn: "An Citta Sauti",
    soundOff: "An Kashe Sauti",
    resetBtn: "Maimaita",
    tapToCount: "Taba don kirgawa",
    quickPresets: "Adadin Gaggawa:",

    // 3. Multipliers
    multipliersTitle: "Masu Ninka Zikiri",
    multipliersDesc: "Rabe-raben karatun zikiri bisa tsarin ilimin lambobi na malamai.",
    sendToCounter: "Aika zuwa Carbi",
    multBase: "x1 (Asli na Farko)",
    multBadrSeal: "x3 (Hatimin Badr)",
    multPillars: "x7 (Rukunai 7 na Sama)",
    multLights: "x11 (Hasken Lambobi 11)",
    multTasbih: "x33 (Matakin Tasbihi)",
    multAllahName: "x66 (Lissafin Sunan Allah)",
    multAlif: "x111 (Sirrin Alif da Kutub)",
    multBadrArmy: "x313 (Mutanen Badr da Manzanni)",
    multFath: "x1000 (Bude Babban Nasara)",

    // 4. Weekly Split
    weeklyTitle: "Raba Zikiri na Mako",
    weeklyDesc: "Raba adadi mai yawa zuwa kwanaki 7 na mako duba da albarkar kowace rana.",
    fridayWeight: "Jumma'a (Ranar Albarka / x1.5)",
    mondayWeight: "Litinin (Ranar Annabi / x1.3)",
    wednesdayWeight: "Laraba (Budin Haske / x1.1)",
    otherDays: "Sauran Kwanaki (Daidai / x1.0)",
    markDone: "Tabbatar",
    completed: "An Kammala",
    daysList: ['Jumma\'a (الجمعة)', 'Asabar (السبت)', 'Lahadi (الأحد)', 'Litinin (الإثنين)', 'Talata (الثلاثاء)', 'Laraba (الأربعاء)', 'Alhamis (الخميس)'],

    // 5. Name Zakat
    zakatTitle: "Zakat na Suna (Sadakar Aiki)",
    zakatDesc: "Lissafin kudin sadakar da ta dace don rufewa da raka aikin zikiri.",
    recommendedCharity: "Sadakar da Ake Shawara:",
    charityRateDesc: "Daidai da kashi 2.5% na adadin Abjad don tabbatar da albarka a zahiri.",
    charityTypesTitle: "Irinta Sadakar da Aka Shawarta:",
    charityBread: "Abinci, biredi ko ciyar da mabukata",
    charityDates: "Dabinai sababbi, 'ya'yan itace ko madara mai tsarki",
    charityCoins: "Kudin sadaka na sirri cikin aminci",

    // 6. Riyadah
    riyadahTitle: "Azumi & Khulwa (Riyadah)",
    riyadahDesc: "Fitar da kwanakin da suka dace don komawa ga Allah duba da watan Hijri.",
    ayyamBidTitle: "Kwanakin Haske (13, 14, 15 Hijri)",
    ayyamBidDesc: "Lokacin cikar wata don azumi da bude hasken zuciya.",
    retreat3Days: "Kwanaki 3 na Khulwa",
    retreat3DaysDesc: "Tsarkake zuciya cikin sauri, azumin yini da nesanta kai daga hayaniya.",
    retreat7Days: "Kwanaki 7 na Riyada Mafi Girma",
    retreat7DaysDesc: "Cikakken shiga cikin sirrin Sunan Allah da nutsuwa.",
    retreat40Days: "Kwanaki 40 na Arba'in",
    retreat40DaysDesc: "Daukakar ruhi da komawa ga Allah bisa tsarin magabata.",
    dietAdvice: "Shawarar Abinci (Riyada): Guje wa cin naman dabba ko abubuwan dabba (Zalalat) da rike alwala a kowane lokaci.",

    // 7. Verse Timing
    timingTitle: "Lokacin Amsar Aya",
    timingDesc: "Yana nuna lokacin da aya ta fi karfin amsawa a cikin yini duba da dabi'arta.",
    elementFire: "Dabi'ar Wuta → Lokacin Walahi (Rana Tsaka & Haske)",
    elementWater: "Dabi'ar Ruwa → Lokacin Magariba (Fadawar Rana & Nutsuwa)",
    elementAir: "Dabi'ar Iska → Lokacin Asuba (Fitowar Hasken Asuba)",
    elementEarth: "Dabi'ar Kasa → Lokacin Sahar (Karshen Dare kafin Asuba)",

    // 8. Salat al-Inqadh
    inqadhTitle: "Rabon Sallar Inqadh",
    inqadhDesc: "Rabon raka'o'in sallolin gaggawa a cikin sa'o'i don samun tsira da biyan bukata cikin sauri.",
    totalRakaats: "Jimillar Raka'o'in Gaggawa:",
    scheduleSlots: "Lokutan da Aka Shawarta:",
    inqadhSlot1: "Raka'o'i 4 a Lokacin Sahar (Karshen dare kafin Asuba)",
    inqadhSlot2: "Raka'o'i 4 a Lokacin Walahi (Hantsi cikin hasken rana)",
    inqadhSlot3: "Raka'o'i 4 bayan Sallar Isha (Kafin kwanciya barci)",

    // 9. Text Splitter
    splitterTitle: "Raba Rubutu da Abjad",
    splitterDesc: "Yana raba dogon rubutu zuwa shafuka masu adadin Abjad daidai don karatun da ya daidaita.",
    textInputPlaceholder: "Manna rubutun Larabci, ayoyi ko addu'o'i a nan...",
    segmentsResult: "Rabon Rubutu da Aka Samu:",
    splitInfo: "Kowane sashi an tsara shi domin samun daidaiton lissafi.",

    // 10. Constancy Tracker
    trackerTitle: "Binciken Dauwama na Zikiri",
    trackerDesc: "Rikodi da bibiyar dauwamar zikiri na kowace rana da jerin kwanaki.",
    currentStreak: "Jerin Kwanakin da Aka Dauwama:",
    daysCount: "kwanaki a jere",
    logTodayBtn: "Yi Rijistar Zikirin Yau",
    loggedToday: "An yi rijistar yau cikin nasara!",
    streakAdvice: "Dauwama a kan 'yan kananan ayyuka ya fi soyuwa a wurin Allah fiye da aiki mai yawa da ba a dauwama a kansa ba.",

    // 11. Salawat
    salawatTitle: "Mai Samar da Salatin Annabi",
    salawatDesc: "Yana zakulo salatin Annabi da adadin Abjad dinsa ya dace da sunanka ko bukatarka.",
    harmonyScore: "Daidaitun Ruhi:",
    salawatAbjadLabel: "Nauyin Abjad:",
    salawatList: [
      { name: "Salawat Ibrahimiyyah", arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ", abjad: 818 },
      { name: "Salawat Al-Fatih", arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ", abjad: 1122 },
      { name: "Salawat Al-Ummiyyah", arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الأُمِّيِّ", abjad: 757 },
      { name: "Salawat Al-Tanjiyyah (Neman Tsira)", arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلاَةً تُنْجِينَا بِهَا مِنْ جَمِيعِ الأَهْوَالِ", abjad: 1414 },
      { name: "Salawat Al-Nariyyah (Tafrijiyyah)", arabic: "اللَّهُمَّ صَلِّ صَلاَةً كَامِلَةً وَسَلِّمْ سَلاَماً تَامّاً عَلَى سَيِّدِنَا مُحَمَّدٍ", abjad: 1233 }
    ],

    // 12. Istighfar
    istighfarTitle: "Istigfari Mai Maimaitawa (الاستغفار المجبّر)",
    istighfarDesc: "Lissafin adadin istigfari da ake bukata don daidaita kuskuren lissafi ko rarraba hankali.",
    excessVal: "Kuskure ko Kari a Lissafi:",
    requiredIstighfar: "Adadin Istigfarin da Ake Shawara:",
    istighfarFormula: "Lafazi: Astaghfirullah al-Adheem wa Atubu Ilayh (أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ)",
    istighfarExplanation: "Wannan istigfarin yana wanke aiki daga kowane irin rarraba hankali a lokacin zikiri.",

    // 13. Hissn
    hissnTitle: "Mai Tsara Hissn (Garkuwa)",
    hissnDesc: "Fitar da lokutan sabunta garkuwar ruhi a cikin yini a kowane mataki.",
    fajrSlot: "Asuba: Karanta Ayat al-Kursi (sau 1 ko 7) - Hatimin Tsaron Yini",
    duhaSlot: "Hantsi: Karanta Suratul Ikhlas (sau 3) - Hasken Tauhidi",
    maghribSlot: "Ladan: Karanta Al-Falaq & An-Nas (sau 3) - Garkuwar Yamma",
    nightSlot: "Barci: Karanta Qul guda 3 & Ayat al-Kursi (sau 3) - Kullewar Dare",
    layerActive: "Garkuwa tana aiki",
    layerPending: "Ana jiran kunnawa",

    // 14. Group
    groupTitle: "Zikirin Jama'a & Manufa Daya",
    groupDesc: "Hada lissafin mutane da yawa don samun manufa guda na zikiri.",
    participantName: "Sunan Dan Majalisa:",
    addParticipant: "Kara Mutum",
    collectiveTarget: "Jimillar Zikirin Jama'a:",
    perPersonShare: "Rabon kowane mutum:",
    noParticipants: "Ba a sa wani mutum ba tukuna."
  }
};

export const RitualDhikrCalculator: React.FC = () => {
  const { language } = useLanguage();
  const currentLang = (language as 'fr' | 'en' | 'ha') || 'fr';
  const t = translations[currentLang] || translations.fr;

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

  // Hissn Activation State
  const [hissnDone, setHissnDone] = useState<Record<string, boolean>>({
    fajr: true,
    duha: false,
    maghrib: false,
    night: false
  });

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
  const wasatAbjad = calculateAbjadValue(cleanArabic) || 129;
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
    if (!newParticipantName.trim()) return;
    const val = calculateAbjadValue(newParticipantName.trim());
    setParticipants([...participants, { name: newParticipantName.trim(), abjad: val }]);
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

  const handleCopyText = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Weekly asymmetric distribution weights: Friday (1.5), Monday (1.3), Wed (1.1), Tue/Sun/Thu/Sat (1.0)
  const dayWeights = [1.5, 1.0, 1.3, 1.1, 1.0, 1.0, 1.0];
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
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-xl font-arabic font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              dir="rtl"
            />
          </div>
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
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">{t.modeAsliDesc}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase">{t.modeWasat}</span>
              <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">{wasatAbjad * 3}</span>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">{t.modeWasatDesc}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase">{t.modeKabir}</span>
              <span className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">{kabirAbjad}</span>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">{t.modeKabirDesc}</p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span>{t.daysTargetLabel}</span>
              <span className="text-emerald-600 font-mono text-sm">{targetDays} {t.daysUnit}</span>
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
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.counterDesc}</p>

          <div className="flex justify-center gap-3 text-xs font-bold">
            <button
              onClick={() => setVibrationEnabled(!vibrationEnabled)}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                vibrationEnabled ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {vibrationEnabled ? t.vibrationOn : t.vibrationOff}
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                soundEnabled ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {soundEnabled ? t.soundOn : t.soundOff}
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-b from-emerald-500/10 to-teal-500/5 border-2 border-emerald-500/30 space-y-4">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 flex justify-between">
              <span>{t.targetLabel} <strong className="font-mono text-emerald-600">{targetCount}</strong></span>
              <span>{Math.min(100, Math.round((count / (targetCount || 1)) * 100))}%</span>
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

            <div className="pt-2">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block mb-2">{t.quickPresets}</span>
              <div className="flex justify-center gap-1.5 flex-wrap">
                {[33, 66, 99, 100, wasatAbjad, 313, 1000].map((presetVal) => (
                  <button
                    key={presetVal}
                    onClick={() => { setTargetCount(presetVal); setCount(0); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors ${
                      targetCount === presetVal ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {presetVal}
                  </button>
                ))}
              </div>
            </div>

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
              { factor: 1, label: t.multBase, count: wasatAbjad },
              { factor: 3, label: t.multBadrSeal, count: wasatAbjad * 3 },
              { factor: 7, label: t.multPillars, count: wasatAbjad * 7 },
              { factor: 11, label: t.multLights, count: wasatAbjad * 11 },
              { factor: 33, label: t.multTasbih, count: wasatAbjad * 33 },
              { factor: 66, label: t.multAllahName, count: wasatAbjad * 66 },
              { factor: 111, label: t.multAlif, count: wasatAbjad * 111 },
              { factor: 313, label: t.multBadrArmy, count: wasatAbjad * 313 },
              { factor: 1000, label: t.multFath, count: wasatAbjad * 1000 },
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
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">{t.daysList[idx]}</span>
                  <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">{portion} {t.recitationsUnit}</span>
                </div>
                <button
                  onClick={() => setWeeklyDone({ ...weeklyDone, [idx]: !weeklyDone[idx] })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    weeklyDone[idx] ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Check size={14} /> {weeklyDone[idx] ? t.completed : t.markDone}
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
              {Math.ceil(wasatAbjad * 0.025)} {t.piecesUnit}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {t.charityRateDesc} ({wasatAbjad})
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
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Moon className="text-indigo-500" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.riyadahTitle}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.riyadahDesc}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-1">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{t.ayyamBidTitle}</span>
              <p className="text-xs text-gray-600 dark:text-gray-300">{t.ayyamBidDesc}</p>
            </div>

            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-1">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{t.retreat3Days}</span>
              <p className="text-xs text-gray-600 dark:text-gray-300">{t.retreat3DaysDesc}</p>
            </div>

            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-1">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{t.retreat7Days}</span>
              <p className="text-xs text-gray-600 dark:text-gray-300">{t.retreat7DaysDesc}</p>
            </div>

            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-1">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{t.retreat40Days}</span>
              <p className="text-xs text-gray-600 dark:text-gray-300">{t.retreat40DaysDesc}</p>
            </div>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-800 dark:text-amber-300">
            {t.dietAdvice}
          </div>

          {/* Interactive Fasting Calendar with Gregorian / Hijri toggle */}
          <div className="pt-2">
            <RiyadahFastingCalendar abjadValue={wasatAbjad} ritualName={inputText} />
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
              {t.inqadhSlot1}
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              {t.inqadhSlot2}
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              {t.inqadhSlot3}
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
              {longText.split(/\s+/).filter(Boolean).reduce((acc: string[][], word, idx) => {
                if (idx % 3 === 0) acc.push([word]);
                else acc[acc.length - 1].push(word);
                return acc;
              }, []).map((seg, i) => {
                const segText = seg.join(' ');
                const val = calculateAbjadValue(segText);
                return (
                  <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs">
                    <span className="font-arabic text-sm font-bold text-emerald-800 dark:text-emerald-300" dir="rtl">{segText}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{val}</span>
                      <button
                        onClick={() => handleCopyText(segText)}
                        className="p-1 rounded text-gray-400 hover:text-emerald-500 cursor-pointer"
                        title={t.copyBtn}
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{t.splitInfo}</p>
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.streakAdvice}</p>
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
            {t.salawatList.map((sal, idx) => {
              const diff = Math.abs(sal.abjad - wasatAbjad);
              const harmonyPercent = Math.max(10, 100 - Math.min(90, Math.floor(diff / 20)));

              return (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{sal.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {t.harmonyScore} {harmonyPercent}%
                      </span>
                      <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">{t.salawatAbjadLabel} {sal.abjad}</span>
                    </div>
                  </div>
                  <p className="text-lg font-arabic font-bold text-emerald-800 dark:text-emerald-300" dir="rtl">{sal.arabic}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleLaunchToCounter(sal.abjad)}
                      className="py-1 px-2.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Activity size={10} /> {t.sendToCounter} ({sal.abjad})
                    </button>
                  </div>
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
              {wasatAbjad * 3} {t.recitationsUnit}
            </div>
            <p className="text-xs font-arabic text-purple-900 dark:text-purple-200 font-bold" dir="rtl">
              أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {t.istighfarExplanation}
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
            {[
              { key: 'fajr', label: t.fajrSlot, color: 'emerald' },
              { key: 'duha', label: t.duhaSlot, color: 'blue' },
              { key: 'maghrib', label: t.maghribSlot, color: 'amber' },
              { key: 'night', label: t.nightSlot, color: 'indigo' },
            ].map((slot) => (
              <div
                key={slot.key}
                onClick={() => setHissnDone({ ...hissnDone, [slot.key]: !hissnDone[slot.key] })}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                  hissnDone[slot.key]
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>{slot.label}</span>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                  hissnDone[slot.key] ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {hissnDone[slot.key] ? t.layerActive : t.layerPending}
                </span>
              </div>
            ))}
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
            {participants.length === 0 ? (
              <p className="text-xs text-gray-400 py-2 text-center">{t.noParticipants}</p>
            ) : (
              participants.map((p, idx) => (
                <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs">
                  <span className="font-arabic font-bold text-base text-gray-900 dark:text-white" dir="rtl">{p.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-emerald-600">Abjad: {p.abjad}</span>
                    <button onClick={() => handleRemoveParticipant(idx)} className="text-red-500 hover:text-red-700 cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
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
