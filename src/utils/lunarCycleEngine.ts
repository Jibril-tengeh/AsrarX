import { calculateHijriDate, HijriDateResult } from './hijriDate';

export type LunarPhaseId =
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'last_quarter'
  | 'waning_crescent';

export interface LunarPhaseDetails {
  id: LunarPhaseId;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  arabicName: string;
  fraction: number; // 0 to 1
  illuminationPercentage: number; // 0 to 100
  ageDays: number; // 0 to 29.53
  phaseAngleDeg: number; // 0 to 360
  isWaxing: boolean;
  isFullMoonPeriod: boolean; // Days 13, 14, 15 (White days)
  isWhiteNight: boolean;
  distanceKm: number;
  isSupermoon: boolean;
  isMicromoon: boolean;
  
  // Zodiac & Astroscience
  zodiacSignFr: string;
  zodiacSignEn: string;
  zodiacSignHa: string;
  zodiacSignAr: string;
  zodiacDegree: number; // 0 - 29
  element: 'Feu' | 'Terre' | 'Air' | 'Eau';
  elementEn: string;
  elementHa: string;
  
  // Lunar Mansion (Manzil al-Qamar)
  mansionNumber: number; // 1 to 28
  mansionNameAr: string;
  mansionNameFr: string;
  mansionNameEn: string;
  mansionNameHa: string;
  
  // Hijri Date
  hijriDate: HijriDateResult;
  
  // Spiritual Recommendations (Rouhaniyya)
  spiritualDomainFr: string;
  spiritualDomainEn: string;
  spiritualDomainHa: string;
  recommendedPracticesFr: string[];
  recommendedPracticesEn: string[];
  recommendedPracticesHa: string[];
  recommendedAsma: {
    arabic: string;
    transliteration: string;
    meaningFr: string;
    meaningEn: string;
    meaningHa: string;
    abjadValue: number;
    recommendedCount: number;
  }[];
  recommendedSurah: {
    number: number;
    nameAr: string;
    nameFr: string;
    nameEn: string;
    nameHa: string;
    virtueFr: string;
    virtueEn: string;
    virtueHa: string;
  };
  recommendedIncenseFr: string;
  recommendedIncenseEn: string;
  recommendedIncenseHa: string;
  cautionAlertFr?: string;
  cautionAlertEn?: string;
  cautionAlertHa?: string;
}

export interface LunarEvent {
  date: Date;
  type: 'new_moon' | 'first_quarter' | 'full_moon' | 'last_quarter';
  nameFr: string;
  nameEn: string;
  nameHa: string;
  illumination: number;
  isSupermoon: boolean;
  zodiacSignFr: string;
  zodiacSignEn: string;
  zodiacSignHa: string;
}

// Synodic month length in days
const SYNODIC_MONTH = 29.530588853;
// Known New Moon reference epoch: Jan 18, 2026 19:52 UTC (JD 2461059.32778)
const KNOWN_NEW_MOON_EPOCH_MS = new Date('2026-01-18T19:52:00Z').getTime();

// 28 Lunar Mansions data
const LUNAR_MANSIONS = [
  { id: 1, ar: 'الشرطين', fr: 'Al-Sharatayn', en: 'Al-Sharatayn', ha: 'Ash-Sharatani' },
  { id: 2, ar: 'البطين', fr: 'Al-Butayn', en: 'Al-Butayn', ha: 'Al-Butaini' },
  { id: 3, ar: 'الثريا', fr: 'Al-Thurayya', en: 'Al-Thurayya (Pleiades)', ha: 'Ath-Thurayya' },
  { id: 4, ar: 'الدبران', fr: 'Al-Dabaran', en: 'Aldebaran', ha: 'Ad-Dabarani' },
  { id: 5, ar: 'الهقعة', fr: 'Al-Haq\'ah', en: 'Al-Haq\'ah', ha: 'Al-Hak\'a' },
  { id: 6, ar: 'الهنعة', fr: 'Al-Han\'ah', en: 'Al-Han\'ah', ha: 'Al-Han\'a' },
  { id: 7, ar: 'الذراع', fr: 'Al-Dhira\'', en: 'Al-Dhira\'', ha: 'Az-Zira\'i' },
  { id: 8, ar: 'النثرة', fr: 'Al-Nathrah', en: 'Al-Nathrah', ha: 'An-Nathra' },
  { id: 9, ar: 'الطرف', fr: 'Al-Tarf', en: 'Al-Tarf', ha: 'At-Tarfi' },
  { id: 10, ar: 'الجبهة', fr: 'Al-Jabhah', en: 'Al-Jabhah', ha: 'Al-Jabha' },
  { id: 11, ar: 'الزبرة', fr: 'Al-Zubrah', en: 'Al-Zubrah', ha: 'Az-Zubra' },
  { id: 12, ar: 'الصرفة', fr: 'Al-Sarfah', en: 'Al-Sarfah', ha: 'As-Sarfa' },
  { id: 13, ar: 'العواء', fr: 'Al-Awwa', en: 'Al-Awwa', ha: 'Al-Awwa\'i' },
  { id: 14, ar: 'السماك', fr: 'Al-Simak', en: 'Spica (Al-Simak)', ha: 'As-Simaku' },
  { id: 15, ar: 'الغفر', fr: 'Al-Ghafr', en: 'Al-Ghafr', ha: 'Al-Ghafru' },
  { id: 16, ar: 'الزبانا', fr: 'Al-Zubana', en: 'Al-Zubana', ha: 'Az-Zubana' },
  { id: 17, ar: 'الإكليل', fr: 'Al-Iklil', en: 'Al-Iklil (Crown)', ha: 'Al-Iklil' },
  { id: 18, ar: 'القلب', fr: 'Al-Qalb', en: 'Antares (Al-Qalb)', ha: 'Al-Kalbu' },
  { id: 19, ar: 'الشولة', fr: 'Al-Shawlah', en: 'Shaula (Al-Shawlah)', ha: 'Ash-Shaula' },
  { id: 20, ar: 'النعائم', fr: 'Al-Na\'a\'im', en: 'Al-Na\'a\'im', ha: 'An-Na\'a\'im' },
  { id: 21, ar: 'البلدة', fr: 'Al-Baldah', en: 'Al-Baldah', ha: 'Al-Balda' },
  { id: 22, ar: 'سعد الذابح', fr: 'Sa\'d al-Dhabih', en: 'Sa\'d al-Dhabih', ha: 'Sa\'aduz Zabih' },
  { id: 23, ar: 'سعد بلع', fr: 'Sa\'d Bula\'', en: 'Sa\'d Bula\'', ha: 'Sa\'adu Bula\'i' },
  { id: 24, ar: 'سعد السعود', fr: 'Sa\'d al-Su\'ud', en: 'Sa\'d al-Su\'ud', ha: 'Sa\'adus Su\'udu' },
  { id: 25, ar: 'سعد الأخبية', fr: 'Sa\'d al-Akhbiyah', en: 'Sa\'d al-Akhbiyah', ha: 'Sa\'adul Akhbiyya' },
  { id: 26, ar: 'الفرغ الأول', fr: 'Al-Fargh al-Muqaddam', en: 'Al-Fargh al-Awwal', ha: 'Al-Fargul Awwal' },
  { id: 27, ar: 'الفرغ الثاني', fr: 'Al-Fargh al-Mu\'akhkhar', en: 'Al-Fargh al-Thani', ha: 'Al-Farguth Thani' },
  { id: 28, ar: 'الرشاء (بطن الحوت)', fr: 'Al-Risha (Batn al-Hut)', en: 'Al-Risha', ha: 'Ar-Risha' }
];

// Zodiac Signs data
const ZODIAC_SIGNS = [
  { ar: 'الحمل', fr: 'Bélier', en: 'Aries', ha: 'Rago (Aries)', element: 'Feu', elementEn: 'Fire', elementHa: 'Wuta' },
  { ar: 'الثور', fr: 'Taureau', en: 'Taurus', ha: 'Saura (Taurus)', element: 'Terre', elementEn: 'Earth', elementHa: 'Kasa' },
  { ar: 'الجوزاء', fr: 'Gémeaux', en: 'Gemini', ha: 'Tagwaye (Gemini)', element: 'Air', elementEn: 'Air', elementHa: 'Iska' },
  { ar: 'السرطان', fr: 'Cancer', en: 'Cancer', ha: 'Kaguwa (Cancer)', element: 'Eau', elementEn: 'Water', elementHa: 'Ruwa' },
  { ar: 'الأسد', fr: 'Lion', en: 'Leo', ha: 'Zaki (Leo)', element: 'Feu', elementEn: 'Fire', elementHa: 'Wuta' },
  { ar: 'العذراء', fr: 'Vierge', en: 'Virgo', ha: 'Budurwa (Virgo)', element: 'Terre', elementEn: 'Earth', elementHa: 'Kasa' },
  { ar: 'الميزان', fr: 'Balance', en: 'Libra', ha: 'Ma\'auni (Libra)', element: 'Air', elementEn: 'Air', elementHa: 'Iska' },
  { ar: 'العقرب', fr: 'Scorpion', en: 'Scorpio', ha: 'Kunama (Scorpio)', element: 'Eau', elementEn: 'Water', elementHa: 'Ruwa' },
  { ar: 'القوس', fr: 'Sagittaire', en: 'Sagittarius', ha: 'Mashi (Sagittarius)', element: 'Feu', elementEn: 'Fire', elementHa: 'Wuta' },
  { ar: 'الجدي', fr: 'Capricorne', en: 'Capricorn', ha: 'Bunsuru (Capricorn)', element: 'Terre', elementEn: 'Earth', elementHa: 'Kasa' },
  { ar: 'الدلو', fr: 'Verseau', en: 'Aquarius', ha: 'Guga (Aquarius)', element: 'Air', elementEn: 'Air', elementHa: 'Iska' },
  { ar: 'الحوت', fr: 'Poissons', en: 'Pisces', ha: 'Kifi (Pisces)', element: 'Eau', elementEn: 'Water', elementHa: 'Ruwa' }
];

/**
 * Calculates complete astronomical and spiritual lunar details for a given date
 */
export function calculateLunarPhaseDetails(targetDate: Date): LunarPhaseDetails {
  const timeMs = targetDate.getTime();
  const diffDays = (timeMs - KNOWN_NEW_MOON_EPOCH_MS) / (1000 * 60 * 60 * 24);
  
  // Normalized lunar age in the current cycle
  let ageDays = diffDays % SYNODIC_MONTH;
  if (ageDays < 0) ageDays += SYNODIC_MONTH;

  // Phase angle from 0 to 360 degrees
  const phaseAngleDeg = (ageDays / SYNODIC_MONTH) * 360;
  const phaseAngleRad = (phaseAngleDeg * Math.PI) / 180;

  // Illumination fraction (0 to 1) and percentage (0 to 100)
  const fraction = (1 - Math.cos(phaseAngleRad)) / 2;
  const illuminationPercentage = Math.round(fraction * 100);

  // Waxing vs Waning
  const isWaxing = ageDays < SYNODIC_MONTH / 2;

  // Determine Phase ID
  let id: LunarPhaseId = 'new_moon';
  if (ageDays < 1.84 || ageDays >= 27.69) {
    id = 'new_moon';
  } else if (ageDays < 5.53) {
    id = 'waxing_crescent';
  } else if (ageDays < 9.22) {
    id = 'first_quarter';
  } else if (ageDays < 12.91) {
    id = 'waxing_gibbous';
  } else if (ageDays < 16.61) {
    id = 'full_moon';
  } else if (ageDays < 20.30) {
    id = 'waning_gibbous';
  } else if (ageDays < 23.99) {
    id = 'last_quarter';
  } else {
    id = 'waning_crescent';
  }

  // Lunar Distance approximation (Anomalistic cycle ~27.55 days)
  const anomalisticEpochMs = new Date('2026-01-01T00:00:00Z').getTime();
  const anomalisticCycle = 27.554551;
  const daysSincePerigee = ((timeMs - anomalisticEpochMs) / 86400000) % anomalisticCycle;
  const meanDistance = 384400; // km
  const distanceVariation = 21000 * Math.cos((daysSincePerigee / anomalisticCycle) * 2 * Math.PI);
  const distanceKm = Math.round(meanDistance - distanceVariation);
  const isSupermoon = id === 'full_moon' && distanceKm < 360000;
  const isMicromoon = id === 'full_moon' && distanceKm > 400000;

  // Hijri Date correspondence
  const hijriDate = calculateHijriDate(targetDate);
  const isWhiteNight = hijriDate.day === 13 || hijriDate.day === 14 || hijriDate.day === 15;
  const isFullMoonPeriod = isWhiteNight || id === 'full_moon';

  // Approximate Moon Ecliptic Longitude for Zodiac and Mansion
  // Moon advances roughly 13.176 degrees per day
  const moonLongitude = (phaseAngleDeg + ((targetDate.getUTCFullYear() - 2000) * 360 + targetDate.getUTCMonth() * 30 + targetDate.getUTCDate())) % 360;
  const zodiacIndex = Math.floor(moonLongitude / 30) % 12;
  const zodiacSign = ZODIAC_SIGNS[zodiacIndex >= 0 ? zodiacIndex : 0];
  const zodiacDegree = Math.floor(moonLongitude % 30);

  // Lunar Mansion (360 / 28 = 12.857 degrees per mansion)
  const mansionIndex = Math.floor(moonLongitude / (360 / 28)) % 28;
  const mansion = LUNAR_MANSIONS[mansionIndex >= 0 ? mansionIndex : 0];

  // Phase metadata, spiritual domains, Asma, and recommendations
  const metadata = getPhaseSpiritualPrescriptions(id, isWhiteNight);

  return {
    id,
    nameFr: metadata.nameFr,
    nameEn: metadata.nameEn,
    nameHa: metadata.nameHa,
    arabicName: metadata.arabicName,
    fraction,
    illuminationPercentage,
    ageDays: Math.round(ageDays * 10) / 10,
    phaseAngleDeg: Math.round(phaseAngleDeg),
    isWaxing,
    isFullMoonPeriod,
    isWhiteNight,
    distanceKm,
    isSupermoon,
    isMicromoon,
    zodiacSignFr: zodiacSign.fr,
    zodiacSignEn: zodiacSign.en,
    zodiacSignHa: zodiacSign.ha,
    zodiacSignAr: zodiacSign.ar,
    zodiacDegree,
    element: zodiacSign.element as 'Feu' | 'Terre' | 'Air' | 'Eau',
    elementEn: zodiacSign.elementEn,
    elementHa: zodiacSign.elementHa,
    mansionNumber: mansion.id,
    mansionNameAr: mansion.ar,
    mansionNameFr: mansion.fr,
    mansionNameEn: mansion.en,
    mansionNameHa: mansion.ha,
    hijriDate,
    spiritualDomainFr: metadata.spiritualDomainFr,
    spiritualDomainEn: metadata.spiritualDomainEn,
    spiritualDomainHa: metadata.spiritualDomainHa,
    recommendedPracticesFr: metadata.recommendedPracticesFr,
    recommendedPracticesEn: metadata.recommendedPracticesEn,
    recommendedPracticesHa: metadata.recommendedPracticesHa,
    recommendedAsma: metadata.recommendedAsma,
    recommendedSurah: metadata.recommendedSurah,
    recommendedIncenseFr: metadata.recommendedIncenseFr,
    recommendedIncenseEn: metadata.recommendedIncenseEn,
    recommendedIncenseHa: metadata.recommendedIncenseHa,
    cautionAlertFr: metadata.cautionAlertFr,
    cautionAlertEn: metadata.cautionAlertEn,
    cautionAlertHa: metadata.cautionAlertHa,
  };
}

function getPhaseSpiritualPrescriptions(phaseId: LunarPhaseId, isWhiteNight: boolean) {
  switch (phaseId) {
    case 'new_moon':
      return {
        nameFr: 'Nouvelle Lune (Al-Muhāq / Hilal)',
        nameEn: 'New Moon (Al-Muhaq / Crescent Origin)',
        nameHa: 'Sabon Wata (Al-Muhaq / Hilal)',
        arabicName: 'المحاق / هلال البداية',
        spiritualDomainFr: 'Semences d\'intentions, renouveau spirituel, purification silencieuse et consécration de nouveaux départs.',
        spiritualDomainEn: 'Planting spiritual seeds, setting intentions, quiet purification, and consecrating new beginnings.',
        spiritualDomainHa: 'Shuka niyya ta ruhaniya, sabunta manufofi, tsarkaka a asirce da kaddamar da ayyuka.',
        recommendedPracticesFr: [
          'Écriture de nouvelles intentions et invocation de bénédiction (Baraka)',
          'Commencement d\'un wird personnel ou d\'une retraite spirituelle (Khalwa)',
          'Prière de deux rak\'ats pour demander la guidée (Salāt al-Istikhāra)',
          'Éviter les contrats extérieurs risqués pendant les heures sombres exactes'
        ],
        recommendedPracticesEn: [
          'Writing spiritual intentions and asking for divine blessing (Barakah)',
          'Initiating a personal daily wird or spiritual retreat (Khalwa)',
          'Two units of prayer for guidance and clarity (Salat al-Istikhara)',
          'Refraining from hasty material pledges during the exact dark window'
        ],
        recommendedPracticesHa: [
          'Rubuta sabbin manufofi da rokon albarka mai dorewa',
          'Fara sabon wirdi na yau da kullum ko shiga khalwa',
          'Sallar neman zabi da shiriya (Salatul Istikhara)',
          'Kauracewa kulla manyan harkokin duniya a lokacin da wata ke duhu'
        ],
        recommendedAsma: [
          { arabic: 'يَا بَدِيعُ', transliteration: 'Yā Badī\'', meaningFr: 'L\'Initiateur Incomparable', meaningEn: 'The Incomparable Originator', meaningHa: 'Mai Kaddamarwa ba tare da misali ba', abjadValue: 86, recommendedCount: 86 },
          { arabic: 'يَا فَتَّاحُ', transliteration: 'Yā Fattāḥ', meaningFr: 'Celui qui Ouvre toute porte', meaningEn: 'The Opener of All Doors', meaningHa: 'Mai Bude dukkan kofofi', abjadValue: 489, recommendedCount: 489 },
          { arabic: 'يَا هَادِي', transliteration: 'Yā Hādī', meaningFr: 'Le Guide Suprême', meaningEn: 'The Supreme Guide', meaningHa: 'Mai Shiryarwa', abjadValue: 20, recommendedCount: 200 }
        ],
        recommendedSurah: {
          number: 1,
          nameAr: 'الفاتحة',
          nameFr: 'Sourate Al-Fātihah (L\'Ouverture)',
          nameEn: 'Surah Al-Fatihah (The Opening)',
          nameHa: 'Suratul Fatiha (Mabudi)',
          virtueFr: 'Réciter 21 ou 70 fois au lever du croissant pour ouvrir les portes du Bien.',
          virtueEn: 'Recite 21 or 70 times at the crescent sight for opening blessed avenues.',
          virtueHa: 'Karanta kafa 21 ko 70 wajen bayyanar sabon wata don bude kofofin alheri.'
        },
        recommendedIncenseFr: 'Encens d\'Oliban pur (Lubān Dhakar) et résine de Benjoin.',
        recommendedIncenseEn: 'Pure Frankincense (Luban Dhakar) and Benzoin resin.',
        recommendedIncenseHa: 'Kansassaki na Luban Dhakar da hazo mai kamshi.',
        cautionAlertFr: 'Phase de transition cosmique : privilégier le recueillement intérieur plutôt que l\'agitation matérielle.',
        cautionAlertEn: 'Cosmic transition window: prioritize inner contemplation over hurried worldly friction.',
        cautionAlertHa: 'Lokaci ne na sauyin halitta: mayar da hankali kan nutsuwar ciki da ibada.'
      };

    case 'waxing_crescent':
    case 'first_quarter':
    case 'waxing_gibbous':
      return {
        nameFr: phaseId === 'first_quarter' ? 'Premier Quartier (Tarbī\' Awwal)' : phaseId === 'waxing_crescent' ? 'Premier Croissant (Hilāl)' : 'Gibbeuse Croissante (Ahdab Mutazāyid)',
        nameEn: phaseId === 'first_quarter' ? 'First Quarter (Waxing Balance)' : phaseId === 'waxing_crescent' ? 'Waxing Crescent (Growth Phase)' : 'Waxing Gibbous (Approaching Fullness)',
        nameHa: phaseId === 'first_quarter' ? 'Rubucin Farko na Wata' : phaseId === 'waxing_crescent' ? 'Wata mai Girma (Hilal)' : 'Wata mai Gabatowa Cika',
        arabicName: phaseId === 'first_quarter' ? 'التربيع الأول' : phaseId === 'waxing_crescent' ? 'الهلال المتزايد' : 'الأحدب المتزايد',
        spiritualDomainFr: 'Expansion, attraction de subsistance (Jalb al-Rizq), amour sincère (Mahabbah), succès, guérison et accroissement des mérites.',
        spiritualDomainEn: 'Expansion, attracting lawful sustenance (Jalb al-Rizq), sincere love, success, vitality, and compounding spiritual rewards.',
        spiritualDomainHa: 'Hauhawar karfi, jawo arziki na halal (Jalbur Rizqi), soyayya, nasara a ayyuka, da samun lafiya.',
        recommendedPracticesFr: [
          'Écriture des Khawatim et Talismans d\'attraction bienfaisante et de prospérité',
          'Séances de Dhikr pour l\'ouverture financière et l\'élévation sociale',
          'Préparation d\'eaux bénites (Mā\' al-Mahw) pour la vitalité et la santé',
          'Prières sur le Prophète (Salawāt) pour la facilitation des affaires'
        ],
        recommendedPracticesEn: [
          'Writing benevolent seals and talismans of prosperity, blessing, and love',
          'Dhikr sessions for financial abundance and respectful elevation',
          'Preparing holy water remedies (Ma\' al-Mahw) for health and vitality',
          'Abundant blessings on the Prophet (Salawat) for unfolding ease'
        ],
        recommendedPracticesHa: [
          'Rubuta hatimai na jawo arziki, soyyaya ta gaskiya da albarka',
          'Yin zikiri don bude hanyoyin kudi da daukaka daraja',
          'Hada ruwan rubutu na tsarki da warkaswa daga cututtuka',
          'Yawaita Salati ga Manzon Allah (S.A.W) don samun sauki'
        ],
        recommendedAsma: [
          { arabic: 'يَا رَزَّاقُ', transliteration: 'Yā Razzāq', meaningFr: 'Le Dispensateur Suprême des Biens', meaningEn: 'The Supreme Provider', meaningHa: 'Mai Arzurtarwa', abjadValue: 308, recommendedCount: 308 },
          { arabic: 'يَا بَاسِطُ', transliteration: 'Yā Bāsiṭ', meaningFr: 'Celui qui Étend Ses Dons', meaningEn: 'The Expander of Bounty', meaningHa: 'Mai Shimfida yalwa', abjadValue: 72, recommendedCount: 720 },
          { arabic: 'يَا وَدُودُ', transliteration: 'Yā Wadūd', meaningFr: 'Le Tout-Aimant, Source d\'Affection', meaningEn: 'The Loving One', meaningHa: 'Mai Yawan Kauna da Soyayya', abjadValue: 20, recommendedCount: 400 },
          { arabic: 'يَا كَرِيمُ', transliteration: 'Yā Karīm', meaningFr: 'Le Très Généreux et Noble', meaningEn: 'The Most Generous', meaningHa: 'Mai Yawan Karamci', abjadValue: 270, recommendedCount: 270 }
        ],
        recommendedSurah: {
          number: 56,
          nameAr: 'الواقعة',
          nameFr: 'Sourate Al-Wāqi\'ah (L\'Événement)',
          nameEn: 'Surah Al-Waqi\'ah (The Inevitable Event)',
          nameHa: 'Suratul Waki\'a',
          virtueFr: 'Récitation nocturne pour immuniser contre la pauvreté et attirer la richesse bénie.',
          virtueEn: 'Nightly recitation to safeguard against scarcity and invite radiant abundance.',
          virtueHa: 'Karatun dare don kariya daga talauci da jawo wadata mai albarka.'
        },
        recommendedIncenseFr: 'Bois de Santal, Musc pur et gomme Arabique parfumée.',
        recommendedIncenseEn: 'Sandalwood, pure White Musk, and aromatic floral gums.',
        recommendedIncenseHa: 'Itacen Sandal, Almiski da kamshi mai dadi.'
      };

    case 'full_moon':
      return {
        nameFr: isWhiteNight ? 'Pleine Lune Bénie — Nuits Blanches (Al-Ayyām Al-Bīḍ)' : 'Pleine Lune (Al-Badr Al-Munīr)',
        nameEn: isWhiteNight ? 'Blessed Full Moon — White Nights (Al-Ayyam Al-Bid)' : 'Full Moon (Al-Badr Al-Munir)',
        nameHa: isWhiteNight ? 'Cikakken Farin Wata — Fararen Darare (Al-Ayyam Al-Bid)' : 'Cikakken Farin Wata (Badr)',
        arabicName: isWhiteNight ? 'البدر المبارك — الأيام البيض' : 'البدر المنير',
        spiritualDomainFr: 'Apogée de l\'énergie cosmique, illumination spirituelle (Kashf), exaucement direct des invocations, purification totale et jeûne prophétique.',
        spiritualDomainEn: 'Peak cosmic illumination, spiritual unveiling (Kashf), direct prayer acceptance, total soul cleansing, and prophetic fasting.',
        spiritualDomainHa: 'Kololuwar hasken halitta, kwarjini da hasken zuciya (Kashf), amsar addu\'a nan take, da azumin ranakun fararen darare.',
        recommendedPracticesFr: [
          'Jeûne prophétique des 3 Jours Blancs (13, 14 et 15 du mois hégirien)',
          'Grande veillée de prières nocturnes (Qiyām al-Layl) et Awrad majeurs',
          'Consécration des anneaux, pierres précieuses, sceaux d\'argent et parchemins',
          'Lectures complètes du Coran ou de la Sourate Yā-Sīn avec intentions fortes'
        ],
        recommendedPracticesEn: [
          'Prophetic fasting on the 3 White Days (13th, 14th, and 15th Hijri)',
          'Nocturnal vigil of prayers (Qiyam al-Layl) and reciting major Awrad',
          'Consecrating sacred rings, gems, silver seals, and spiritual parchments',
          'Full recitations of the Holy Quran or Surah Ya-Sin with firm heartfelt focus'
        ],
        recommendedPracticesHa: [
          'Yin azumin ranakun fararen darare guda uku (13, 14, 15 ga watan Hijri)',
          'Tsayuwar dare (Kiyamul Laili) da yin zikiri na manyan asirai',
          'Tsarkake zobba, duwatsu masu daraja, da hatiman azurfa',
          'Karatun Alkur\'ani mai girma ko Suratul Yasin da tsarkakkiyar niyya'
        ],
        recommendedAsma: [
          { arabic: 'يَا نُورُ', transliteration: 'Yā Nūr', meaningFr: 'La Lumière Primordiale', meaningEn: 'The Light of Heavens and Earth', meaningHa: 'Hasken Sammai da Kasa', abjadValue: 256, recommendedCount: 256 },
          { arabic: 'يَا حَيُّ يَا قَيُّومُ', transliteration: 'Yā Ḥayyu Yā Qayyūm', meaningFr: 'Le Vivant Éternel, l\'Auto-Subsistant', meaningEn: 'The Ever-Living, Self-Sustaining', meaningHa: 'Mai Rai wanda baya mutuwa, Mai Tsaye da kowa', abjadValue: 174, recommendedCount: 174 },
          { arabic: 'يَا مُجِيبُ', transliteration: 'Yā Mujīb', meaningFr: 'Celui qui Exauce toute prière', meaningEn: 'The Answerer of Invocations', meaningHa: 'Mai Amsa Addu\'a', abjadValue: 55, recommendedCount: 550 },
          { arabic: 'يَا قُدُّوسُ', transliteration: 'Yā Quddūs', meaningFr: 'Le Très Saint, Pureté Absolue', meaningEn: 'The All-Holy, Pure of defect', meaningHa: 'Tsarkakakke daga dukkan aibi', abjadValue: 170, recommendedCount: 170 }
        ],
        recommendedSurah: {
          number: 36,
          nameAr: 'يس',
          nameFr: 'Sourate Yā-Sīn (Le Cœur du Coran)',
          nameEn: 'Surah Ya-Sin (Heart of the Quran)',
          nameHa: 'Suratu Ya-Sin (Zuciyar Alkur\'ani)',
          virtueFr: 'Récitée sous la pleine lune pour le dénouement des affaires difficiles et la grâce divine.',
          virtueEn: 'Recited under full moonlight for resolving difficult knots and seeking divine favor.',
          virtueHa: 'Karatunta a daren cikakken wata na magance dukkan matsaloli masu wuya.'
        },
        recommendedIncenseFr: 'Bois d\'Agarwood / Oud précieux, Oliban royal et eau de Rose pure.',
        recommendedIncenseEn: 'Precious Agarwood / Oud, Royal Frankincense, and pure Rose water.',
        recommendedIncenseHa: 'Itacen Oud mai tsada, Luban na sarki, da ruwan fure (Rose water).'
      };

    case 'waning_gibbous':
    case 'last_quarter':
    case 'waning_crescent':
    default:
      return {
        nameFr: phaseId === 'last_quarter' ? 'Dernier Quartier (Tarbī\' Thānī)' : phaseId === 'waning_gibbous' ? 'Gibbeuse Décroissante (Disseminating)' : 'Dernier Croissant / Balsamique (Mahāq)',
        nameEn: phaseId === 'last_quarter' ? 'Last Quarter (Waning Balance)' : phaseId === 'waning_gibbous' ? 'Waning Gibbous (Release Phase)' : 'Waning Crescent / Balsamic (Mahāq Cleansing)',
        nameHa: phaseId === 'last_quarter' ? 'Rubucin Karshe na Wata' : phaseId === 'waning_gibbous' ? 'Wata mai Ragewa' : 'Wata mai Shirin Bacewa (Mahaq)',
        arabicName: phaseId === 'last_quarter' ? 'التربيع الثاني' : phaseId === 'waning_gibbous' ? 'الأحدب المتناقص' : 'الهلال الأخير / المحاق',
        spiritualDomainFr: 'Purification des ondes néfastes, dissolution des blocages (Ibtāl al-Mawāni\'), désenvoûtement, coupure des attaches toxiques et protection de l\'âme.',
        spiritualDomainEn: 'Dispelling negative energies, neutralizing spiritual blockages (Ibtal), cleansing, breaking toxic bonds, and spiritual shielding.',
        spiritualDomainHa: 'Karya sihiri da kariya daga sharrin makiya (Ibtal), kawar da toshewar hanya, wanke zunubai da tsarkake jiki.',
        recommendedPracticesFr: [
          'Bains rituels de purification avec du sel marin, feuilles de Jujubier (Sidr) et eau coranisée',
          'Récitation intensive des versets de protection et des Sourates protectrices (Al-Mu\'awwidhatayn)',
          'Destruction et dissolution des anciens talismans inopérants ou impuretés',
          'Pardon, aumône d\'apaisement (Sadaqah) pour dissiper les épreuves et les rancœurs'
        ],
        recommendedPracticesEn: [
          'Spiritual purification baths with sea salt, Sidr (lote tree) leaves, and Quranic water',
          'Intensive recitation of protection verses and the 2 refuge Surahs (Al-Mu\'awwidhatayn)',
          'Dissolving spent seals and releasing old stagnant heavy burdens',
          'Forgiveness practices and charity (Sadaqah) to avert hardships and ease the spirit'
        ],
        recommendedPracticesHa: [
          'Wankan tsarki na musamman da gishirin kogi, ganyen Magarya (Sidr) da ruwan addu\'a',
          'Karatun ayoyin tsari da surorin kariya (Falaqi da Nasi)',
          'Wanke tsofaffin matsaloli da neman yafiyar Allah',
          'Bayar da sadaka don kawar da bala\'i da samun kariya daga sharri'
        ],
        recommendedAsma: [
          { arabic: 'يَا مَانِعُ', transliteration: 'Yā Māni\'', meaningFr: 'Le Protecteur Défenseur', meaningEn: 'The Preventer of Harm', meaningHa: 'Mai Hana Sharri ya riski bawa', abjadValue: 161, recommendedCount: 161 },
          { arabic: 'يَا دَافِعُ', transliteration: 'Yā Dāfi\'', meaningFr: 'Celui qui Repousse toute calamité', meaningEn: 'The Repeller of Afflictions', meaningHa: 'Mai Tunkude cuta da bala\'i', abjadValue: 155, recommendedCount: 155 },
          { arabic: 'يَا قَهَّارُ', transliteration: 'Yā Qahhār', meaningFr: 'Le Dominateur Suprême et Invincible', meaningEn: 'The All-Subduing', meaningHa: 'Mai Rinaye a kan dukkan halitta', abjadValue: 306, recommendedCount: 306 },
          { arabic: 'يَا سَلَامُ', transliteration: 'Yā Salām', meaningFr: 'La Source Immuable de Paix et Salut', meaningEn: 'The Giver of Peace and Safety', meaningHa: 'Mai Samar da Zaman Lafiya da Tsira', abjadValue: 131, recommendedCount: 131 }
        ],
        recommendedSurah: {
          number: 113,
          nameAr: 'الفلق والناس',
          nameFr: 'Sourates Al-Falaq & An-Nās (Les Protectrices)',
          nameEn: 'Surahs Al-Falaq & An-Nas (The Two Protections)',
          nameHa: 'Surorin Falaqi da Nasi (Masu Tsari)',
          virtueFr: 'Réciter 11 ou 100 fois matin et soir pour dissoudre tout nœud occulte et jalousie.',
          virtueEn: 'Recite 11 or 100 times dawn and evening to dissolve ties of envy and occult obstacles.',
          virtueHa: 'Karanta kafa 11 ko 100 safe da yamma don karya dukkan wani sharri ko hassada.'
        },
        recommendedIncenseFr: 'Rue sauvage (Harmal), Graines noires (Habbat Sawda) et Camphre.',
        recommendedIncenseEn: 'Wild Rue (Harmal), Black Seed (Habbat Sawda), and Camphor.',
        recommendedIncenseHa: 'Ganyen Harmal, Habbatussauda, da Kafur.'
      };
  }
}

/**
 * Calculates upcoming major lunar events for the specified year
 */
export function getYearlyLunarEvents(year: number): LunarEvent[] {
  const events: LunarEvent[] = [];
  
  // Search through all ~365 days of the year
  const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
  
  let currentMs = startDate.getTime();
  const stepMs = 6 * 3600 * 1000; // 6-hour steps for precise peak detection
  
  let prevFraction = 0;
  let prevTrend = 0; // 1 = increasing, -1 = decreasing
  
  while (currentMs <= endDate.getTime()) {
    const d = new Date(currentMs);
    const details = calculateLunarPhaseDetails(d);
    const frac = details.fraction;
    
    // Check for Full Moon (Local peak ~ 1.0)
    if (frac > 0.985 && details.id === 'full_moon') {
      const isAlreadyRecorded = events.some(
        e => e.type === 'full_moon' && Math.abs(e.date.getTime() - d.getTime()) < 15 * 86400000
      );
      if (!isAlreadyRecorded) {
        events.push({
          date: d,
          type: 'full_moon',
          nameFr: details.isWhiteNight ? 'Pleine Lune (Nuits Blanches)' : 'Pleine Lune',
          nameEn: details.isWhiteNight ? 'Full Moon (White Nights)' : 'Full Moon',
          nameHa: details.isWhiteNight ? 'Cikakken Wata (Fararen Darare)' : 'Cikakken Wata',
          illumination: details.illuminationPercentage,
          isSupermoon: details.isSupermoon,
          zodiacSignFr: details.zodiacSignFr,
          zodiacSignEn: details.zodiacSignEn,
          zodiacSignHa: details.zodiacSignHa,
        });
      }
    }

    // Check for New Moon (Local valley ~ 0.0)
    if (frac < 0.015 && details.id === 'new_moon') {
      const isAlreadyRecorded = events.some(
        e => e.type === 'new_moon' && Math.abs(e.date.getTime() - d.getTime()) < 15 * 86400000
      );
      if (!isAlreadyRecorded) {
        events.push({
          date: d,
          type: 'new_moon',
          nameFr: 'Nouvelle Lune (Hilal)',
          nameEn: 'New Moon (Hilal)',
          nameHa: 'Sabon Wata (Hilal)',
          illumination: details.illuminationPercentage,
          isSupermoon: false,
          zodiacSignFr: details.zodiacSignFr,
          zodiacSignEn: details.zodiacSignEn,
          zodiacSignHa: details.zodiacSignHa,
        });
      }
    }

    prevFraction = frac;
    currentMs += stepMs;
  }

  // Sort chronologically
  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Returns a 30-day timeline starting around the given reference date
 */
export function getMonthlyLunarTimeline(referenceDate: Date): LunarPhaseDetails[] {
  const timeline: LunarPhaseDetails[] = [];
  const startDay = new Date(referenceDate);
  startDay.setHours(12, 0, 0, 0);
  
  // Go 14 days before and 15 days after
  for (let offset = -14; offset <= 15; offset++) {
    const day = new Date(startDay.getTime() + offset * 86400000);
    timeline.push(calculateLunarPhaseDetails(day));
  }
  
  return timeline;
}
