import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Moon, 
  Sun, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Info, 
  Clock, 
  Award,
  Flame,
  Droplets,
  CalendarDays,
  RotateCcw,
  BookOpen,
  ListFilter,
  LayoutGrid,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateHijriDate, HIJRI_MONTHS_FR, HIJRI_MONTHS_EN, HIJRI_MONTHS_HA, HIJRI_MONTHS_AR } from '../utils/hijriDate';

interface RiyadahFastingCalendarProps {
  abjadValue?: number;
  ritualName?: string;
}

export type CalendarViewMode = 'gregorian' | 'hijri';
export type DisplayTabMode = 'grid' | 'monthly_detail' | 'pedagogy_guide';
export type RetreatMode = 'white_days' | 'mon_thu' | '7_days' | '40_days' | 'abjad_custom';

export type FastingCategoryType = 'fard' | 'sunnah' | 'recommended' | 'riyadah' | 'neutral' | 'forbidden';

export const RiyadahFastingCalendar: React.FC<RiyadahFastingCalendarProps> = ({
  abjadValue = 129,
  ritualName = "يا لطيف"
}) => {
  const { language } = useLanguage();
  
  // Display Mode: 'gregorian' or 'hijri'
  const [viewMode, setViewMode] = useState<CalendarViewMode>('hijri');

  // Tab View: 'grid' (Interactive calendar grid), 'monthly_detail' (Detailed Day-by-day month breakdown), 'pedagogy_guide' (Jurisprudential & Spiritual Guide)
  const [displayTab, setDisplayTab] = useState<DisplayTabMode>('grid');
  
  // Retreat selection mode
  const [retreatMode, setRetreatMode] = useState<RetreatMode>('white_days');

  // Month navigation: offset from current date
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

  // Selected date for day drawer/details
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  // Filter category in monthly detail view
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<'all' | 'fasting_only' | 'sunnah' | 'white_days' | 'riyadah'>('all');

  // Completed fast tracking (locally stored)
  const [fastedDays, setFastedDays] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('asrarhub_riyadah_fasted_days');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleFastedDay = (dateKey: string) => {
    const next = { ...fastedDays, [dateKey]: !fastedDays[dateKey] };
    setFastedDays(next);
    try {
      localStorage.setItem('asrarhub_riyadah_fasted_days', JSON.stringify(next));
    } catch {}
  };

  // Base date representing the active viewed month
  const viewedBaseDate = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + currentMonthOffset);
    return d;
  }, [currentMonthOffset]);

  // Translations
  const t = {
    fr: {
      title: "Calendrier Rituels de Jeûne & Riyadah",
      subtitle: "Cartographie interactive des jours bénis, jours blancs et retraites selon les calendriers Grégorien et Hijri.",
      toggleHijri: "Vue Hijri (Lunaire)",
      toggleGregorian: "Vue Grégorienne (Solaire)",
      tabGrid: "📅 Grille Calendrier",
      tabMonthlyDetail: "📋 Détail par Mois & Analyse",
      tabPedagogy: "📖 Guide Pédagogique des Jeûnes",
      todayBtn: "Aujourd'hui",
      modeWhiteDays: "🌕 Jours Blancs (13, 14, 15)",
      modeMonThu: "🌿 Sunnah Lundi & Jeudi",
      mode7Days: "✨ Retraite 7 Jours",
      mode40Days: "🕊️ Grand Arba'in (40 Jours)",
      modeCustom: "🎯 Cycle Personnalisé Abjad",
      daysHeader: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      
      // Fasting types labels
      typeFard: "Jeûne Obligatoire (Fard)",
      typeSunnah: "Jeûne Prophétique Sunnah",
      typeRecommended: "Jeûne Recommandé (Mustahabb)",
      typeRiyadah: "Retraite Spirituelle (Riyadah)",
      typeNeutral: "Jour d'Oraisons Libres",
      typeForbidden: "Jeûne Déconseillé / Interdit",

      legendWhiteDay: "Jour Blanc (Pleine Lune / 13-14-15 Hijri)",
      legendSunnah: "Jeûne Sunnah (Lundi / Jeudi)",
      legendRetreat: "Période de Retraite / Riyadah Active",
      legendFasted: "Jour Marqué comme Jeûné",
      dayDetailsTitle: "Détails & Vibrations du Jour",
      gregorianLabel: "Date Grégorienne :",
      hijriLabel: "Date Hijri :",
      fastingStatus: "Statut du Jeûne :",
      moonPhase: "Phase Lunaire :",
      spiritualPractice: "Pratique Recommandée :",
      markAsFasted: "Noter ce jour comme Jeûné",
      markAsUnfasted: "Annuler la validation du jeûne",
      
      whiteDayVirtue: "Jour Blanc : Rapprochement mystique suprême, résonance spirituelle intense et équivalent d'un jeûne perpétuel.",
      sunnahVirtue: "Sunnah : Présentation des actions divines le lundi et jeudi, élévation des invocations et bénédiction continue.",
      retreatVirtue: "Retraite Riyadah : Assimilation théurgique du Wird personnel, affinement des sens subtils et renforcement de l'aura.",
      ramadanVirtue: "Mois Saint de Ramadan : Obligation divine suprême, révélation coranique et purification totale.",
      neutralDayVirtue: "Jour d'oraisons régulières, prières sur le Prophète et maintien de la constance spirituelle.",
      forbiddenVirtue: "Jour de fête de l'Aïd ou Tashriq : Le jeûne est formellement prohibé; célébrer la subsistance et la gratitude.",
      
      monthlyStats: "Synthèse du Mois",
      totalFastingDays: "Jours de jeûne recommandés ce mois :",
      daysUnit: "jours",
      filterAll: "Tous les jours",
      filterFastingOnly: "Jours de jeûne uniquement",
      filterSunnah: "Lundis & Jeudis",
      filterWhiteDays: "Jours Blancs",
      filterRiyadah: "Retraites Riyadah",
      
      // Pedagogical Guide Texts
      pedagogyTitle: "Comprendre les Catégories de Jeûne en Islam & dans la Riyadah",
      pedagogySubtitle: "Les degrés d'intensité spirituelle et les bienfaits ésotériques selon la tradition soufie et prophétique :",
      fardTitle: "1. Le Jeûne Obligatoire (Fard)",
      fardDesc: "Le jeûne du mois de Ramadan est le 4ème pilier de l'Islam. Obligatoire pour tout croyant pubère et sain, il constitue la base absolue de purification de l'âme (Nafs). En dehors de Ramadan, le rattrapage (Qada) et les jeûnes expiatoires (Kaffara) relèvent également de cette catégorie.",
      
      sunnahTitle: "2. Le Jeûne Prophétique Sunnah (Lundi & Jeudi)",
      sunnahDesc: "Le Prophète ﷺ jeûnait fidèlement le lundi (jour de sa naissance et de la première révélation) et le jeudi (jour où les actions des serviteurs sont présentées à Allah). Ce rythme bi-hebdomadaire équilibre les humeurs corporelles et amplifie l'exaucement des prières.",
      
      recommendedTitle: "3. Le Jeûne Recommandé des Jours Blancs (Ayyam al-Bid)",
      recommendedDesc: "Les 13, 14 et 15 de chaque mois hégirien coïncident avec l'apogée de la Pleine Lune (Badr). Sur le plan mystique et cosmologique, le jeûne durant ces 3 jours apaise les marées intérieures du corps humain, dissipe les impuretés astrales et équivaut selon le hadith au jeûne de l'année entière.",
      
      riyadahTitle: "4. Le Jeûne de Retraite & Khulwa (Riyadah Spirituelle)",
      riyadahDesc: "Dans la voie initiatique des Maîtres d'Asrar, le jeûne de Riyadah est un outil de transmutation vibratoire. Il s'accompagne d'une réduction progressive des nourritures lourdes, d'un maintien constant des ablutions (Wudu), et d'une récitation ciblée du Nom Divin ou du Verset (selon la valeur Abjad calculée). Il affine le cœur pour capter les dévoilements (Kashf) et les secours célestes (Madad).",
      
      forbiddenTitle: "5. Jours Interdits ou Déconseillés (Haram & Makruh)",
      forbiddenDesc: "Il est strictement interdit (Haram) de jeûner le jour de l'Aïd al-Fitr (1er Shawwal) et le jour de l'Aïd al-Adha (10 Dhul-Hijjah), ainsi que les trois jours de Tashriq (11, 12, 13 Dhul-Hijjah). Le croyant doit alors honorer le banquet offert par le Créateur."
    },
    en: {
      title: "Fasting Rituals & Riyadah Calendar",
      subtitle: "Interactive mapping of blessed fasting days, white days, and spiritual retreats across Gregorian and Hijri calendars.",
      toggleHijri: "Hijri View (Lunar)",
      toggleGregorian: "Gregorian View (Solar)",
      tabGrid: "📅 Calendar Grid",
      tabMonthlyDetail: "📋 Monthly Detail & Analysis",
      tabPedagogy: "📖 Fasting Educational Guide",
      todayBtn: "Today",
      modeWhiteDays: "🌕 White Days (13, 14, 15)",
      modeMonThu: "🌿 Mon & Thu Sunnah",
      mode7Days: "✨ 7-Day Retreat",
      mode40Days: "🕊️ Grand 40-Day Arba'in",
      modeCustom: "🎯 Custom Abjad Cycle",
      daysHeader: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      
      typeFard: "Obligatory Fast (Fard)",
      typeSunnah: "Prophetic Sunnah Fast",
      typeRecommended: "Recommended Fast (Mustahabb)",
      typeRiyadah: "Spiritual Retreat Fast (Riyadah)",
      typeNeutral: "Free Devotion Day",
      typeForbidden: "Disliked / Forbidden Fast",

      legendWhiteDay: "White Day (Full Moon / 13-14-15 Hijri)",
      legendSunnah: "Prophetic Sunnah Fast (Monday / Thursday)",
      legendRetreat: "Active Retreat / Riyadah Period",
      legendFasted: "Marked as Fasted",
      dayDetailsTitle: "Day Vibrations & Details",
      gregorianLabel: "Gregorian Date:",
      hijriLabel: "Hijri Date:",
      fastingStatus: "Fasting Status:",
      moonPhase: "Moon Phase:",
      spiritualPractice: "Recommended Practice:",
      markAsFasted: "Mark this day as Fasted",
      markAsUnfasted: "Unmark fasting completion",
      
      whiteDayVirtue: "White Day: Supreme mystical connection, intense spiritual resonance, and equivalent to a perpetual fast.",
      sunnahVirtue: "Sunnah: Presentation of deeds to Allah on Mondays and Thursdays, elevated prayers, and lasting barakah.",
      retreatVirtue: "Riyadah Retreat: Theurgic assimilation of personal Wird, refinement of inner perception, and aura empowerment.",
      ramadanVirtue: "Holy Month of Ramadan: Supreme divine obligation, Quranic descent, and absolute soul purification.",
      neutralDayVirtue: "Standard day of spiritual constancy, Salawat, and sustained remembrance.",
      forbiddenVirtue: "Eid and Tashriq days: Fasting is strictly prohibited; celebrate divine hospitality and gratitude.",
      
      monthlyStats: "Monthly Summary",
      totalFastingDays: "Recommended fasting days this month:",
      daysUnit: "days",
      filterAll: "All days",
      filterFastingOnly: "Fasting days only",
      filterSunnah: "Mondays & Thursdays",
      filterWhiteDays: "White Days",
      filterRiyadah: "Riyadah Retreats",
      
      pedagogyTitle: "Understanding Fasting Categories in Islam & Riyadah",
      pedagogySubtitle: "Degrees of spiritual intensity and esoteric benefits according to prophetic and Sufi tradition:",
      fardTitle: "1. Obligatory Fasting (Fard)",
      fardDesc: "Fasting the month of Ramadan is the 4th pillar of Islam. Mandatory for every sane and adult believer, it forms the foundation of soul purification (Nafs). Makeup fasts (Qada) and expiatory fasts (Kaffara) also fall under this essential tier.",
      
      sunnahTitle: "2. Prophetic Sunnah Fasting (Monday & Thursday)",
      sunnahDesc: "The Prophet ﷺ faithfully fasted on Mondays (his birthday and initial revelation) and Thursdays (when deeds are presented to Allah). This bi-weekly rhythm balances physical energies and multiplies prayer acceptance.",
      
      recommendedTitle: "3. Recommended White Days (Ayyam al-Bid)",
      recommendedDesc: "The 13th, 14th, and 15th of each lunar month coincide with the Full Moon apex (Badr). Mystically, fasting during these 3 days calms bodily fluids, clears astral impurities, and carries the reward of fasting the entire year.",
      
      riyadahTitle: "4. Spiritual Retreat & Khulwa (Riyadah Fasting)",
      riyadahDesc: "In the initiatic tradition of Asrar masters, Riyadah fasting is a tool for vibrational transmutation. It involves gradual dietary restraint, unbroken purity (Wudu), and focused repetition of a Divine Name aligned with the calculated Abjad value.",
      
      forbiddenTitle: "5. Prohibited and Disliked Days (Haram & Makruh)",
      forbiddenDesc: "Fasting is strictly forbidden on Eid al-Fitr (1st Shawwal), Eid al-Adha (10th Dhul-Hijjah), and the 3 days of Tashriq (11-13 Dhul-Hijjah). The believer must partake in the Creator's feast with joyful gratitude."
    },
    ha: {
      title: "Kalandar Azumi da Khulwa (Riyadah)",
      subtitle: "Taswirar kwanakin azumi masu albarka, kwanakin haske da lokutan komawa ga Allah bisa kalandar Hijriyya da Miladiyya.",
      toggleHijri: "Kalandar Hijri (Wata)",
      toggleGregorian: "Kalandar Miladiyya (Rana)",
      tabGrid: "📅 Taswirar Kalandar",
      tabMonthlyDetail: "📋 Bayani Cikin Wata & Bincike",
      tabPedagogy: "📖 Jagorar Ilimin Azumi",
      todayBtn: "Yau",
      modeWhiteDays: "🌕 Kwanakin Haske (13, 14, 15)",
      modeMonThu: "🌿 Sunnar Litinin & Alhamis",
      mode7Days: "✨ Riyadar Kwanaki 7",
      mode40Days: "🕊️ Arba'in na Kwanaki 40",
      modeCustom: "🎯 Shirin Abjad na Musamman",
      daysHeader: ['Lit', 'Tal', 'Lar', 'Alh', 'Jum', 'Asa', 'Lah'],
      
      typeFard: "Azumi na Wajibi (Fard)",
      typeSunnah: "Azumin Sunnah na Annabi",
      typeRecommended: "Azumi Mai Mustahabbi (Kwanakin Haske)",
      typeRiyadah: "Azumin Khulwa / Riyadah",
      typeNeutral: "Ranar Ibada ta Kullum",
      typeForbidden: "Azumin da Aka Haramta / Makruhi",

      legendWhiteDay: "Kwanakin Haske (Cikar Wata / 13-14-15 Hijri)",
      legendSunnah: "Azumin Sunnah (Litinin / Alhamis)",
      legendRetreat: "Lokacin Riyadah / Khulwa",
      legendFasted: "An Shigar da Azumi",
      dayDetailsTitle: "Bayanin Ranar da Haskenta",
      gregorianLabel: "Ranar Miladiyya:",
      hijriLabel: "Ranar Hijriyya:",
      fastingStatus: "Matsayin Azumi:",
      moonPhase: "Matsayin Wata:",
      spiritualPractice: "Aikin da Aka Shawarta:",
      markAsFasted: "Shigar da cewa an yi azumi",
      markAsUnfasted: "Cire alamar azumi",
      
      whiteDayVirtue: "Ranar Haske: Babban kusanci ga Allah, hasken zuciya da samun ladan azumin shekara duka.",
      sunnahVirtue: "Sunnah: Gabatar da ayyuka ga Allah a ranakun Litinin da Alhamis da karbar addu'o'i.",
      retreatVirtue: "Riyada: Shiga cikin sirrin wirdi, tsarkake ruhi da samun kariya ta musamman.",
      ramadanVirtue: "Watan Ramadana: Babban wajibi na addini, saukar Alkur'ani da gafara ga dukkan zunubai.",
      neutralDayVirtue: "Ranar aiki na yau da kullum da dawwama kan salatin Annabi da zikiri.",
      forbiddenVirtue: "Ranar Idin Karama ko Babba da kwanakin Tashriq: An haramta azumi a cikinsu.",
      
      monthlyStats: "Takaitaccen Bayanin Wata",
      totalFastingDays: "Adadin kwanakin azumi da aka shawarta a wannan watan:",
      daysUnit: "kwanaki",
      filterAll: "Dukkan ranaku",
      filterFastingOnly: "Ranakun azumi kawai",
      filterSunnah: "Litinin & Alhamis",
      filterWhiteDays: "Kwanakin Haske",
      filterRiyadah: "Kwanakin Riyadah",
      
      pedagogyTitle: "Fahimtar Rabe-raben Azumi a Musulunci da Riyadah",
      pedagogySubtitle: "Matakan lada da sirrin ruhi bisa koyarwar Manzon Allah da manyan malamai:",
      fardTitle: "1. Azumi na Wajibi (Fard)",
      fardDesc: "Azumin watan Ramadana shi ne rukuni na hudu a Musulunci. Wajibi ne kan kowane Musulmi balagagge, mai hankali da lafiya. Ramuwar azumi (Kada'i) da kaffara suna karkashin wannan mataki.",
      
      sunnahTitle: "2. Azumin Sunnah (Litinin da Alhamis)",
      sunnahDesc: "Annabi ﷺ ya kasance yana azumtar ranakun Litinin (ranar haihuwarsa da saukar wahayi) da Alhamis (ranar da ake gabatar da ayyukan bayi ga Allah).",
      
      recommendedTitle: "3. Azumin Kwanakin Haske (Ayyamul Bid)",
      recommendedDesc: "Kwanaki 13, 14, da 15 na kowanne watan Hijriyya lokacin da wata ya cika (Badr). Yana daidaita yanayin jiki da ruhi kuma yana daidai da azumin shekara.",
      
      riyadahTitle: "4. Azumin Riyadah da Khulwa",
      riyadahDesc: "A fagen asrar da sanin Allah, azumin riyadah hanya ce ta daukaka ruhi tare da kiyaye alwala a koda yaushe da karanta sunan Allah gwargwadon lissafin Abjad.",
      
      forbiddenTitle: "5. Ranakun da Aka Haramta Azumi (Haram da Makruhi)",
      forbiddenDesc: "An haramta azumi a ranakun Sallah (Idin Karama da Idin Babba) da kwanakin Tashriq guda uku (11, 12, 13 ga Dhul Hijja)."
    }
  }[language as 'fr' | 'en' | 'ha'] || {
    title: "Calendrier Rituels de Jeûne & Riyadah",
    subtitle: "Cartographie interactive des jours bénis de jeûne.",
    toggleHijri: "Vue Hijri",
    toggleGregorian: "Vue Grégorienne",
    tabGrid: "📅 Grille",
    tabMonthlyDetail: "📋 Détail par Mois",
    tabPedagogy: "📖 Guide Pédagogique",
    todayBtn: "Aujourd'hui",
    modeWhiteDays: "🌕 Jours Blancs (13, 14, 15)",
    modeMonThu: "🌿 Sunnah Lundi & Jeudi",
    mode7Days: "✨ Retraite 7 Jours",
    mode40Days: "🕊️ Grand Arba'in (40 Jours)",
    modeCustom: "🎯 Cycle Personnalisé",
    daysHeader: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    typeFard: "Obligatoire (Fard)",
    typeSunnah: "Sunnah",
    typeRecommended: "Recommandé (Mustahabb)",
    typeRiyadah: "Retraite (Riyadah)",
    typeNeutral: "Jour Libre",
    typeForbidden: "Interdit (Haram)",
    legendWhiteDay: "Jour Blanc (13-14-15 Hijri)",
    legendSunnah: "Sunnah (Lundi / Jeudi)",
    legendRetreat: "Période de Retraite",
    legendFasted: "Jeûné",
    dayDetailsTitle: "Détails du Jour",
    gregorianLabel: "Date Grégorienne :",
    hijriLabel: "Date Hijri :",
    fastingStatus: "Statut du Jeûne :",
    moonPhase: "Phase Lunaire :",
    spiritualPractice: "Pratique Recommandée :",
    markAsFasted: "Noter comme Jeûné",
    markAsUnfasted: "Annuler",
    whiteDayVirtue: "Jour Blanc : Rapprochement mystique suprême.",
    sunnahVirtue: "Sunnah : Élévation des invocations.",
    retreatVirtue: "Retraite : Assimilation théurgique du Wird.",
    ramadanVirtue: "Ramadan : Obligation et purification totale.",
    neutralDayVirtue: "Jour d'oraisons régulières.",
    forbiddenVirtue: "Jour d'Aïd : Jeûne interdit.",
    monthlyStats: "Synthèse du Mois",
    totalFastingDays: "Jours de jeûne recommandés ce mois :",
    daysUnit: "jours",
    filterAll: "Tous",
    filterFastingOnly: "Jeûnes uniquement",
    filterSunnah: "Lundis/Jeudis",
    filterWhiteDays: "Jours Blancs",
    filterRiyadah: "Riyadah",
    pedagogyTitle: "Catégories de Jeûne en Islam",
    pedagogySubtitle: "Les degrés et vertus spirituelles :",
    fardTitle: "1. Le Jeûne Obligatoire (Fard)",
    fardDesc: "Le jeûne de Ramadan, pilier de l'Islam.",
    sunnahTitle: "2. Le Jeûne Sunnah (Lundi & Jeudi)",
    sunnahDesc: "Présentation des actes le lundi et jeudi.",
    recommendedTitle: "3. Jours Blancs (13, 14, 15 Hijri)",
    recommendedDesc: "Pleine lune et pardon des péchés.",
    riyadahTitle: "4. Jeûne de Retraite (Riyadah)",
    riyadahDesc: "Purification et élévation avec le Nom Divin.",
    forbiddenTitle: "5. Jours Interdits (Haram)",
    forbiddenDesc: "Jours de l'Aïd et Tashriq."
  };

  // Helper to format Arabic numerals
  const toArabicDigits = (num: number | string): string => {
    const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/\d/g, (d) => digits[parseInt(d, 10)]);
  };

  // Calculate current viewed month Hijri & Gregorian representations
  const viewedHijri = useMemo(() => {
    return calculateHijriDate(viewedBaseDate);
  }, [viewedBaseDate]);

  // Format Month Title
  const monthTitle = useMemo(() => {
    if (viewMode === 'hijri') {
      const hMonthName = language === 'ha' ? viewedHijri.monthNameHa : language === 'fr' ? viewedHijri.monthNameFr : viewedHijri.monthNameEn;
      return `${hMonthName} ${viewedHijri.year} هـ (${toArabicDigits(viewedHijri.year)})`;
    } else {
      const monthNamesFr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthNamesHa = ['Janairu', 'Febrairu', 'Maris', 'Apirilu', 'Mayu', 'Yuni', 'Yuli', 'Augusta', 'Satumba', 'Oktoba', 'Nuwamba', 'Disamba'];
      const mName = language === 'ha' ? monthNamesHa[viewedBaseDate.getMonth()] : language === 'fr' ? monthNamesFr[viewedBaseDate.getMonth()] : monthNamesEn[viewedBaseDate.getMonth()];
      return `${mName} ${viewedBaseDate.getFullYear()}`;
    }
  }, [viewMode, viewedBaseDate, viewedHijri, language]);

  // Build the 35 or 42 grid cells for the active month + Month detailed listing
  const calendarDays = useMemo(() => {
    const year = viewedBaseDate.getFullYear();
    const month = viewedBaseDate.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    // Number of days in month
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    // Starting day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    // Convert so Monday = 0, Sunday = 6
    let startingDayOfWeek = firstDay.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    const daysArray: Array<{
      date: Date;
      isCurrentMonth: boolean;
      gregorianDay: number;
      hijriDay: number;
      hijriMonthIndex: number;
      hijriMonthName: string;
      isWhiteDay: boolean;
      isMonOrThu: boolean;
      isRetreatDay: boolean;
      isRamadan: boolean;
      isForbiddenDay: boolean;
      fastingCategory: FastingCategoryType;
      isToday: boolean;
      dateKey: string;
      weekdayName: string;
    }> = [];

    // Today comparison
    const today = new Date();
    const isSameDay = (d1: Date, d2: Date) => 
      d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

    // Previous month padding
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthTotalDays - i);
      const hDate = calculateHijriDate(prevDate);
      const dayOfWeek = prevDate.getDay();
      const isMonOrThu = dayOfWeek === 1 || dayOfWeek === 4;
      const isWhiteDay = hDate.day === 13 || hDate.day === 14 || hDate.day === 15;
      const isRamadan = hDate.monthIndex === 8;
      const isForbiddenDay = (hDate.monthIndex === 9 && hDate.day === 1) || (hDate.monthIndex === 11 && (hDate.day >= 10 && hDate.day <= 13));
      const dateKey = `${prevDate.getFullYear()}-${prevDate.getMonth() + 1}-${prevDate.getDate()}`;

      let category: FastingCategoryType = 'neutral';
      if (isForbiddenDay) category = 'forbidden';
      else if (isRamadan) category = 'fard';
      else if (isWhiteDay) category = 'recommended';
      else if (isMonOrThu) category = 'sunnah';

      daysArray.push({
        date: prevDate,
        isCurrentMonth: false,
        gregorianDay: prevDate.getDate(),
        hijriDay: hDate.day,
        hijriMonthIndex: hDate.monthIndex,
        hijriMonthName: hDate.monthNameFr,
        isWhiteDay,
        isMonOrThu,
        isRetreatDay: false,
        isRamadan,
        isForbiddenDay,
        fastingCategory: category,
        isToday: isSameDay(prevDate, today),
        dateKey,
        weekdayName: prevDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'ha' ? 'ha-NG' : 'en-US', { weekday: 'short' })
      });
    }

    // Custom retreat start anchor (derived from Abjad or 13th)
    const retreatStartDay = retreatMode === 'abjad_custom' 
      ? Math.max(1, (abjadValue % 20) + 1)
      : 13;

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const currDate = new Date(year, month, d);
      const hDate = calculateHijriDate(currDate);
      const dayOfWeek = currDate.getDay();
      const isMonOrThu = dayOfWeek === 1 || dayOfWeek === 4;
      const isWhiteDay = hDate.day === 13 || hDate.day === 14 || hDate.day === 15;
      const isRamadan = hDate.monthIndex === 8;
      const isForbiddenDay = (hDate.monthIndex === 9 && hDate.day === 1) || (hDate.monthIndex === 11 && (hDate.day >= 10 && hDate.day <= 13));
      const dateKey = `${currDate.getFullYear()}-${currDate.getMonth() + 1}-${currDate.getDate()}`;

      // Retreat calculations
      let isRetreatDay = false;
      if (retreatMode === 'white_days' && isWhiteDay) {
        isRetreatDay = true;
      } else if (retreatMode === 'mon_thu' && isMonOrThu) {
        isRetreatDay = true;
      } else if (retreatMode === '7_days') {
        if (hDate.day >= 13 && hDate.day <= 19) isRetreatDay = true;
      } else if (retreatMode === '40_days') {
        isRetreatDay = true;
      } else if (retreatMode === 'abjad_custom') {
        if (hDate.day >= retreatStartDay && hDate.day < retreatStartDay + 3) isRetreatDay = true;
      }

      let category: FastingCategoryType = 'neutral';
      if (isForbiddenDay) category = 'forbidden';
      else if (isRamadan) category = 'fard';
      else if (isRetreatDay) category = 'riyadah';
      else if (isWhiteDay) category = 'recommended';
      else if (isMonOrThu) category = 'sunnah';

      daysArray.push({
        date: currDate,
        isCurrentMonth: true,
        gregorianDay: d,
        hijriDay: hDate.day,
        hijriMonthIndex: hDate.monthIndex,
        hijriMonthName: hDate.monthNameFr,
        isWhiteDay,
        isMonOrThu,
        isRetreatDay,
        isRamadan,
        isForbiddenDay,
        fastingCategory: category,
        isToday: isSameDay(currDate, today),
        dateKey,
        weekdayName: currDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'ha' ? 'ha-NG' : 'en-US', { weekday: 'short' })
      });
    }

    // Next month padding to make full 35 or 42 grid
    const remainingCells = 35 - daysArray.length;
    const finalPadding = remainingCells >= 0 ? remainingCells : (42 - daysArray.length);
    for (let nextDay = 1; nextDay <= finalPadding; nextDay++) {
      const nextDate = new Date(year, month + 1, nextDay);
      const hDate = calculateHijriDate(nextDate);
      const dayOfWeek = nextDate.getDay();
      const isMonOrThu = dayOfWeek === 1 || dayOfWeek === 4;
      const isWhiteDay = hDate.day === 13 || hDate.day === 14 || hDate.day === 15;
      const isRamadan = hDate.monthIndex === 8;
      const isForbiddenDay = (hDate.monthIndex === 9 && hDate.day === 1) || (hDate.monthIndex === 11 && (hDate.day >= 10 && hDate.day <= 13));
      const dateKey = `${nextDate.getFullYear()}-${nextDate.getMonth() + 1}-${nextDate.getDate()}`;

      let category: FastingCategoryType = 'neutral';
      if (isForbiddenDay) category = 'forbidden';
      else if (isRamadan) category = 'fard';
      else if (isWhiteDay) category = 'recommended';
      else if (isMonOrThu) category = 'sunnah';

      daysArray.push({
        date: nextDate,
        isCurrentMonth: false,
        gregorianDay: nextDay,
        hijriDay: hDate.day,
        hijriMonthIndex: hDate.monthIndex,
        hijriMonthName: hDate.monthNameFr,
        isWhiteDay,
        isMonOrThu,
        isRetreatDay: false,
        isRamadan,
        isForbiddenDay,
        fastingCategory: category,
        isToday: isSameDay(nextDate, today),
        dateKey,
        weekdayName: nextDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'ha' ? 'ha-NG' : 'en-US', { weekday: 'short' })
      });
    }

    return daysArray;
  }, [viewedBaseDate, retreatMode, abjadValue, language]);

  // Active month current days only for detailed list view
  const currentMonthDaysList = useMemo(() => {
    return calendarDays.filter(d => d.isCurrentMonth);
  }, [calendarDays]);

  // Filtered days for monthly detailed view
  const filteredMonthDays = useMemo(() => {
    if (selectedFilterCategory === 'fasting_only') {
      return currentMonthDaysList.filter(d => d.fastingCategory !== 'neutral' && d.fastingCategory !== 'forbidden');
    }
    if (selectedFilterCategory === 'sunnah') {
      return currentMonthDaysList.filter(d => d.isMonOrThu);
    }
    if (selectedFilterCategory === 'white_days') {
      return currentMonthDaysList.filter(d => d.isWhiteDay);
    }
    if (selectedFilterCategory === 'riyadah') {
      return currentMonthDaysList.filter(d => d.isRetreatDay);
    }
    return currentMonthDaysList;
  }, [currentMonthDaysList, selectedFilterCategory]);

  // Selected date details
  const selectedHijri = useMemo(() => calculateHijriDate(selectedDate), [selectedDate]);
  const selectedDateKey = useMemo(() => {
    return `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
  }, [selectedDate]);

  const selectedIsWhiteDay = selectedHijri.day === 13 || selectedHijri.day === 14 || selectedHijri.day === 15;
  const selectedIsMonThu = selectedDate.getDay() === 1 || selectedDate.getDay() === 4;
  const selectedIsRamadan = selectedHijri.monthIndex === 8;
  const isSelectedFasted = !!fastedDays[selectedDateKey];

  // Moon phase calculation for selected day
  const moonPhaseInfo = useMemo(() => {
    const hDay = selectedHijri.day;
    if (hDay === 1) return { phase: "Nouvelle Lune (Hilal)", icon: "🌑", aura: "Renouveau & Intention" };
    if (hDay >= 2 && hDay <= 6) return { phase: "Premier Croissant (Hilal)", icon: "🌒", aura: "Croissance & Bénédiction" };
    if (hDay >= 7 && hDay <= 10) return { phase: "Premier Quartier (Tarbī')", icon: "🌓", aura: "Équilibre & Action" };
    if (hDay >= 11 && hDay <= 12) return { phase: "Lune Gibbeuse", icon: "🌔", aura: "Intensification d'Énergie" };
    if (hDay >= 13 && hDay <= 15) return { phase: "Pleine Lune (Badr Suprême)", icon: "🌕", aura: "Apogée Spirituelle & Jeûne Blanc" };
    if (hDay >= 16 && hDay <= 21) return { phase: "Gibbeuse Décroissante", icon: "🌖", aura: "Diffusion & Rétention" };
    if (hDay >= 22 && hDay <= 25) return { phase: "Dernier Quartier", icon: "🌗", aura: "Purification & Libération" };
    return { phase: "Dernier Croissant (Mahaq)", icon: "🌘", aura: "Recueillement & Introspection" };
  }, [selectedHijri]);

  // Total fasting days count in current viewed month
  const totalRecommendedFastingDays = useMemo(() => {
    return currentMonthDaysList.filter(d => d.isWhiteDay || d.isMonOrThu || d.isRetreatDay || d.isRamadan).length;
  }, [currentMonthDaysList]);

  // Helper badge color per category
  const getCategoryBadge = (cat: FastingCategoryType) => {
    switch (cat) {
      case 'fard':
        return { label: t.typeFard, bg: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30', icon: '🕋' };
      case 'recommended':
        return { label: t.typeRecommended, bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30', icon: '🌕' };
      case 'sunnah':
        return { label: t.typeSunnah, bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30', icon: '🌿' };
      case 'riyadah':
        return { label: t.typeRiyadah, bg: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30', icon: '✨' };
      case 'forbidden':
        return { label: t.typeForbidden, bg: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30', icon: '⛔' };
      default:
        return { label: t.typeNeutral, bg: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700', icon: '🕊️' };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-md p-4 sm:p-6 space-y-6">
      {/* Title & Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Moon size={22} className="stroke-[2.2]" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
              {t.title}
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t.subtitle}
          </p>
        </div>

        {/* View Toggle: Gregorian <-> Hijri */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-700/70 p-1 rounded-2xl self-start sm:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => setViewMode('hijri')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'hijri'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600'
            }`}
          >
            <Moon size={14} />
            <span>{t.toggleHijri}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('gregorian')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'gregorian'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600'
            }`}
          >
            <Sun size={14} />
            <span>{t.toggleGregorian}</span>
          </button>
        </div>
      </div>

      {/* Primary Display Mode Tabs: Calendar Grid | Monthly Detail | Pedagogy Guide */}
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setDisplayTab('grid')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            displayTab === 'grid'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-gray-100 dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <LayoutGrid size={15} />
          <span>{t.tabGrid}</span>
        </button>

        <button
          type="button"
          onClick={() => setDisplayTab('monthly_detail')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            displayTab === 'monthly_detail'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-gray-100 dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <ListFilter size={15} />
          <span>{t.tabMonthlyDetail}</span>
        </button>

        <button
          type="button"
          onClick={() => setDisplayTab('pedagogy_guide')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            displayTab === 'pedagogy_guide'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-gray-100 dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <BookOpen size={15} />
          <span>{t.tabPedagogy}</span>
        </button>
      </div>

      {/* Tab 1: Calendar Grid View */}
      {displayTab === 'grid' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Retreat Presets Selector */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
              Cycle de Retraite Actif :
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'white_days' as RetreatMode, label: t.modeWhiteDays, color: 'border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300' },
                { id: 'mon_thu' as RetreatMode, label: t.modeMonThu, color: 'border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' },
                { id: '7_days' as RetreatMode, label: t.mode7Days, color: 'border-indigo-400 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' },
                { id: '40_days' as RetreatMode, label: t.mode40Days, color: 'border-purple-400 bg-purple-500/10 text-purple-700 dark:text-purple-300' },
                { id: 'abjad_custom' as RetreatMode, label: `${t.modeCustom} (${abjadValue})`, color: 'border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setRetreatMode(mode.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
                    retreatMode === mode.id
                      ? `${mode.color} ring-2 ring-indigo-500/30 scale-[1.02]`
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Month Navigation Header */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span>{monthTitle}</span>
              </h4>
              <span className="text-xs px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                {viewMode === 'hijri' ? 'Hijri' : 'Grégorien'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentMonthOffset(currentMonthOffset - 1)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                title="Mois précédent"
              >
                <ChevronLeft size={18} />
              </button>
              {currentMonthOffset !== 0 && (
                <button
                  onClick={() => setCurrentMonthOffset(0)}
                  className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors cursor-pointer border border-indigo-200 dark:border-indigo-800"
                >
                  {t.todayBtn}
                </button>
              )}
              <button
                onClick={() => setCurrentMonthOffset(currentMonthOffset + 1)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                title="Mois suivant"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm bg-gray-50/50 dark:bg-gray-900/30">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-100/70 dark:bg-gray-800/80 text-center py-2">
              {t.daysHeader.map((dName, idx) => (
                <div key={idx} className="text-[11px] font-extrabold uppercase text-gray-600 dark:text-gray-300">
                  {dName}
                </div>
              ))}
            </div>

            {/* Days Cells */}
            <div className="grid grid-cols-7 gap-[1px] bg-gray-200 dark:bg-gray-700">
              {calendarDays.map((dayItem, idx) => {
                const isSelected = selectedDate.getDate() === dayItem.date.getDate() && 
                                   selectedDate.getMonth() === dayItem.date.getMonth() && 
                                   selectedDate.getFullYear() === dayItem.date.getFullYear();
                const isFasted = !!fastedDays[dayItem.dateKey];

                const primaryNum = viewMode === 'hijri' ? dayItem.hijriDay : dayItem.gregorianDay;
                const secondaryNum = viewMode === 'hijri' ? `G ${dayItem.gregorianDay}` : `H ${dayItem.hijriDay}`;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(dayItem.date)}
                    className={`min-h-[70px] sm:min-h-[85px] p-1.5 sm:p-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      dayItem.isCurrentMonth
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        : 'bg-gray-50/70 dark:bg-gray-850/50 text-gray-400 dark:text-gray-600'
                    } ${
                      isSelected ? 'ring-2 ring-indigo-500 z-10 bg-indigo-50/50 dark:bg-indigo-950/40' : ''
                    } ${
                      dayItem.isToday ? 'border border-indigo-400 dark:border-indigo-500' : ''
                    }`}
                  >
                    {/* Top row: day number & today indicator */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1">
                        <span className={`text-xs sm:text-sm font-black font-mono ${
                          isSelected ? 'text-indigo-600 dark:text-indigo-400' : ''
                        }`}>
                          {primaryNum}
                        </span>
                        {dayItem.isToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" title="Aujourd'hui" />
                        )}
                      </div>

                      <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">
                        {secondaryNum}
                      </span>
                    </div>

                    {/* Badges / Highlights for fasting days */}
                    <div className="flex flex-col gap-1 mt-1">
                      {/* Ramadan */}
                      {dayItem.isRamadan && (
                        <div className="px-1.5 py-0.5 rounded-md bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-300 text-[9px] font-bold flex items-center gap-1 w-fit">
                          <span>🕋</span>
                          <span className="hidden sm:inline">Ramadan</span>
                        </div>
                      )}

                      {/* White Day (13, 14, 15 Hijri) */}
                      {!dayItem.isRamadan && dayItem.isWhiteDay && (
                        <div className="px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[9px] font-bold flex items-center gap-1 w-fit">
                          <span>🌕</span>
                          <span className="hidden sm:inline">Jour Blanc</span>
                        </div>
                      )}

                      {/* Sunnah Fast (Mon / Thu) */}
                      {!dayItem.isRamadan && !dayItem.isWhiteDay && dayItem.isMonOrThu && (
                        <div className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold flex items-center gap-1 w-fit">
                          <span>🌿</span>
                          <span className="hidden sm:inline">Sunnah</span>
                        </div>
                      )}

                      {/* Active Retreat Day */}
                      {!dayItem.isRamadan && dayItem.isRetreatDay && !dayItem.isWhiteDay && !dayItem.isMonOrThu && (
                        <div className="px-1.5 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-[9px] font-bold flex items-center gap-1 w-fit">
                          <span>✨</span>
                          <span className="hidden sm:inline">Riyadah</span>
                        </div>
                      )}

                      {/* Fasted Check */}
                      {isFasted && (
                        <div className="absolute bottom-1 right-1 p-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                          <Check size={10} className="stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Legend Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs pt-1 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-500/20 border border-amber-500 flex items-center justify-center text-[8px]">🌕</span>
              <span className="text-gray-600 dark:text-gray-400">{t.legendWhiteDay}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[8px]">🌿</span>
              <span className="text-gray-600 dark:text-gray-400">{t.legendSunnah}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-indigo-500/20 border border-indigo-500 flex items-center justify-center text-[8px]">✨</span>
              <span className="text-gray-600 dark:text-gray-400">{t.legendRetreat}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px]"><Check size={8} /></span>
              <span className="text-gray-600 dark:text-gray-400">{t.legendFasted}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Monthly Detail & Pedagogical List View */}
      {displayTab === 'monthly_detail' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Month Header with Filter Buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 dark:bg-gray-850 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <span>{monthTitle}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                  {filteredMonthDays.length} {t.daysUnit}
                </span>
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Vue analytique des cycles de jeûne, vertus mystiques et suivi individuel.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all' as const, label: t.filterAll },
                { id: 'fasting_only' as const, label: t.filterFastingOnly },
                { id: 'sunnah' as const, label: t.filterSunnah },
                { id: 'white_days' as const, label: t.filterWhiteDays },
                { id: 'riyadah' as const, label: t.filterRiyadah },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFilterCategory(f.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedFilterCategory === f.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Day-by-Day List */}
          <div className="space-y-3">
            {filteredMonthDays.map((dItem) => {
              const badge = getCategoryBadge(dItem.fastingCategory);
              const isFasted = !!fastedDays[dItem.dateKey];
              const isSelected = selectedDate.getDate() === dItem.date.getDate() && 
                                 selectedDate.getMonth() === dItem.date.getMonth() && 
                                 selectedDate.getFullYear() === dItem.date.getFullYear();

              return (
                <div
                  key={dItem.dateKey}
                  onClick={() => setSelectedDate(dItem.date)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {/* Left info: dates & type badge */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center shrink-0 border border-gray-200 dark:border-gray-600">
                      <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">
                        {dItem.weekdayName}
                      </span>
                      <span className="text-base font-black font-mono text-gray-900 dark:text-white">
                        {dItem.gregorianDay}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {dItem.hijriDay} {dItem.hijriMonthName}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${badge.bg}`}>
                          <span>{badge.icon}</span>
                          <span>{badge.label}</span>
                        </span>
                        {dItem.isToday && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                            {t.todayBtn}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {dItem.isRamadan 
                          ? t.ramadanVirtue 
                          : dItem.isWhiteDay 
                          ? t.whiteDayVirtue 
                          : dItem.isMonOrThu 
                          ? t.sunnahVirtue 
                          : dItem.isRetreatDay 
                          ? t.retreatVirtue 
                          : dItem.isForbiddenDay 
                          ? t.forbiddenVirtue 
                          : t.neutralDayVirtue}
                      </p>
                    </div>
                  </div>

                  {/* Right actions: completion toggle */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFastedDay(dItem.dateKey);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isFasted
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-emerald-50 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <Check size={13} className={isFasted ? 'stroke-[3]' : ''} />
                      <span>{isFasted ? 'Jeûné ✓' : 'Marquer comme Jeûné'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Fasting Educational & Pedagogical Guide */}
      {displayTab === 'pedagogy_guide' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-gradient-to-r from-emerald-700 to-teal-900 rounded-2xl p-5 text-white shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-amber-400" />
              <h4 className="text-lg font-black tracking-tight">
                {t.pedagogyTitle}
              </h4>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed max-w-3xl">
              {t.pedagogySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Obligatoire (Fard) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border-2 border-red-500/30 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🕋</span>
                <h5 className="font-extrabold text-sm text-red-700 dark:text-red-300">
                  {t.fardTitle}
                </h5>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {t.fardDesc}
              </p>
            </div>

            {/* 2. Sunnah Prophétique */}
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-500/30 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌿</span>
                <h5 className="font-extrabold text-sm text-emerald-700 dark:text-emerald-300">
                  {t.sunnahTitle}
                </h5>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {t.sunnahDesc}
              </p>
            </div>

            {/* 3. Jours Blancs (Mustahabb) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border-2 border-amber-500/30 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌕</span>
                <h5 className="font-extrabold text-sm text-amber-700 dark:text-amber-300">
                  {t.recommendedTitle}
                </h5>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {t.recommendedDesc}
              </p>
            </div>

            {/* 4. Retraite & Riyadah */}
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border-2 border-indigo-500/30 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h5 className="font-extrabold text-sm text-indigo-700 dark:text-indigo-300">
                  {t.riyadahTitle}
                </h5>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {t.riyadahDesc}
              </p>
            </div>
          </div>

          {/* 5. Jours Interdits Warning */}
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-300">
              <AlertCircle size={16} />
              <span>{t.forbiddenTitle}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t.forbiddenDesc}
            </p>
          </div>
        </div>
      )}

      {/* Selected Day Details Panel */}
      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-200/60 dark:border-indigo-800/40 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-indigo-600 dark:text-indigo-400" />
              <h4 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                {t.dayDetailsTitle}
              </h4>
            </div>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium mt-0.5">
              {selectedDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'ha' ? 'ha-NG' : 'en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>

          {/* Toggle Fasted Button */}
          <button
            onClick={() => toggleFastedDay(selectedDateKey)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
              isSelectedFasted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-indigo-300 dark:border-indigo-700'
            }`}
          >
            <Check size={14} className={isSelectedFasted ? 'stroke-[3]' : ''} />
            <span>{isSelectedFasted ? t.markAsUnfasted : t.markAsFasted}</span>
          </button>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Hijri Date Box */}
          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-indigo-100 dark:border-indigo-900/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
              {t.hijriLabel}
            </span>
            <div className="font-bold text-gray-900 dark:text-white text-sm">
              {selectedHijri.day} {selectedHijri.monthNameFr} {selectedHijri.year} هـ
            </div>
            <div className="font-arabic text-xs text-indigo-600 dark:text-indigo-400 font-bold">
              {toArabicDigits(selectedHijri.day)} {selectedHijri.monthNameAr} {toArabicDigits(selectedHijri.year)}
            </div>
          </div>

          {/* Moon Phase Box */}
          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-indigo-100 dark:border-indigo-900/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
              {t.moonPhase}
            </span>
            <div className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
              <span>{moonPhaseInfo.icon}</span>
              <span>{moonPhaseInfo.phase}</span>
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              {moonPhaseInfo.aura}
            </div>
          </div>

          {/* Fasting Recommendation Status */}
          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-indigo-100 dark:border-indigo-900/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
              {t.fastingStatus}
            </span>
            <div className="font-bold text-sm">
              {selectedIsRamadan ? (
                <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                  🕋 {t.typeFard}
                </span>
              ) : selectedIsWhiteDay ? (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  🌕 {t.legendWhiteDay}
                </span>
              ) : selectedIsMonThu ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  🌿 {t.legendSunnah}
                </span>
              ) : (
                <span className="text-gray-600 dark:text-gray-400">
                  {t.typeNeutral}
                </span>
              )}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
              Wird lié : {ritualName} ({abjadValue})
            </div>
          </div>
        </div>

        {/* Spiritual Guidance Banner */}
        <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
          <strong>{t.spiritualPractice} : </strong>
          {selectedIsRamadan
            ? t.ramadanVirtue
            : selectedIsWhiteDay
            ? t.whiteDayVirtue
            : selectedIsMonThu
            ? t.sunnahVirtue
            : t.neutralDayVirtue}
        </div>
      </div>

      {/* Monthly Fasting Statistics Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Award size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
            {t.monthlyStats} : {t.totalFastingDays}
          </span>
        </div>
        <div className="text-base font-extrabold font-mono text-emerald-700 dark:text-emerald-300">
          {totalRecommendedFastingDays} {t.daysUnit}
        </div>
      </div>
    </div>
  );
};
