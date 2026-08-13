import { calculateAbjadValue, numberToAbjadLetters, vocalizeAbjadRoot, getElementalBreakdown } from './abjad';

export interface CelestialAngelResult {
  nameAr: string;
  nameTrans: string;
  rootLetters: string;
  remainderValue: number;
  formulaUsed: string;
  invocationAr: string;
  invocationTrans: string;
}

export interface TerrestrialGuardianResult {
  nameAr: string;
  nameTrans: string;
  rootLetters: string;
  remainderValue: number;
  formulaUsed: string;
  invocationAr: string;
  invocationTrans: string;
}

export interface SpiritualKingResult {
  kingNameAr: string;
  kingNameTrans: string;
  angelNameAr: string;
  angelNameTrans: string;
  dayIndex: number; // 1-7
  dayNameAr: string;
  dayNameTrans: string;
  planetNameAr: string;
  planetNameTrans: string;
  elementAr: string;
  elementTrans: string;
  incenseAr: string;
  incenseTrans: string;
  sigilSymbol: string;
}

export interface AuxiliaryServant {
  levelKey: 'units' | 'tens' | 'hundreds' | 'thousands';
  levelValue: number;
  rootLetters: string;
  nameAr: string;
  nameTrans: string;
  roleAr: string;
  roleTrans: string;
}

export interface VocalizationScheme {
  schemeKey: 'faail' | 'failush' | 'mafulash';
  schemeNameAr: string;
  schemeNameTrans: string;
  vocalizedNameAr: string;
  vocalizedNameTrans: string;
  descriptionKey: string;
}

export interface ConnectionScheduleResult {
  bestDayAr: string;
  bestDayTrans: string;
  bestPlanetAr: string;
  bestPlanetTrans: string;
  optimalHours: string[];
  incenseAr: string;
  incenseTrans: string;
  directionAr: string;
  directionTrans: string;
  zikrCount: number;
  reducedCount: number;
  isCurrentlyAligned: boolean;
}

export interface RouhaniyyaExtractionData {
  inputText: string;
  abjadTotal: number;
  celestial: CelestialAngelResult;
  terrestrial: TerrestrialGuardianResult;
  king: SpiritualKingResult;
  auxiliaries: AuxiliaryServant[];
  vocalizations: VocalizationScheme[];
  schedule: ConnectionScheduleResult;
  elementalBreakdown: { fire: number; air: number; water: number; earth: number };
}

// 7 Spiritual Kings Database
const KINGS_DATABASE: Record<number, Omit<SpiritualKingResult, 'dayIndex'>> = {
  1: {
    kingNameAr: 'المَلِكُ المُذْهَبُ',
    kingNameTrans: 'Al-Malik Al-Mudhib',
    angelNameAr: 'رُوقَيَائِيلُ',
    angelNameTrans: 'Rukya’il',
    dayNameAr: 'الأَحَدُ',
    dayNameTrans: 'Al-Ahad (Dimanche)',
    planetNameAr: 'الشَّمْسُ',
    planetNameTrans: 'Al-Shams (Soleil)',
    elementAr: 'نَارٌ (عُنْصُرٌ نَارِيٌّ)',
    elementTrans: 'Feu (Nari)',
    incenseAr: 'اللُّبَانُ الذَّكَرُ والزَّعْفَرَانُ',
    incenseTrans: 'Frankincense (Luban Dkar) & Saffron',
    sigilSymbol: '☉ ۞ ☉',
  },
  2: {
    kingNameAr: 'المَلِكُ مُرَّةَ الأَبْيَضُ',
    kingNameTrans: 'Al-Malik Murrah Al-Abyad',
    angelNameAr: 'جَبْرَائِيلُ',
    angelNameTrans: 'Jibra’il',
    dayNameAr: 'الإِثْنَيْنِ',
    dayNameTrans: 'Al-Ithnayn (Lundi)',
    planetNameAr: 'القَمَرُ',
    planetNameTrans: 'Al-Qamar (Lune)',
    elementAr: 'مَاءٌ (عُنْصُرٌ مَائِيٌّ)',
    elementTrans: 'Eau (Ma’i)',
    incenseAr: 'المِسْكُ الأَبْيَضُ والكَافُورُ',
    incenseTrans: 'White Musk & Camphor',
    sigilSymbol: '☽ ☽ ☾',
  },
  3: {
    kingNameAr: 'المَلِكُ الأَحْمَرُ',
    kingNameTrans: 'Al-Malik Al-Ahmar',
    angelNameAr: 'سَمْسَمَائِيلُ',
    angelNameTrans: 'Samsama’il',
    dayNameAr: 'الثُّلَاثَاءِ',
    dayNameTrans: 'Al-Thulatha (Mardi)',
    planetNameAr: 'المِرِّيخُ',
    planetNameTrans: 'Al-Mirrikh (Mars)',
    elementAr: 'نَارٌ (عُنْصُرٌ نَارِيٌّ حَارٌّ)',
    elementTrans: 'Feu Intensa (Nari)',
    incenseAr: 'الصَّنْدَلُ الأَحْمَرُ والقُسْطُ',
    incenseTrans: 'Red Sandalwood & Qist',
    sigilSymbol: '♂ 🝔 ♂',
  },
  4: {
    kingNameAr: 'المَلِكُ بَرْقَانُ',
    kingNameTrans: 'Al-Malik Barqan',
    angelNameAr: 'مِيكَائِيلُ',
    angelNameTrans: 'Mika’il',
    dayNameAr: 'الأَرْبِعَاءِ',
    dayNameTrans: 'Al-Arbi’a (Mercredi)',
    planetNameAr: 'عُطَارِدُ',
    planetNameTrans: 'Utarid (Mercure)',
    elementAr: 'تُرَابٌ (عُنْصُرٌ تُرَابِيٌّ)',
    elementTrans: 'Terre (Turabi)',
    incenseAr: 'المَصْطَكَى واللُّبَانُ',
    incenseTrans: 'Mastic (Al-Mastaka) & Luban',
    sigilSymbol: '☿ ☿ ☿',
  },
  5: {
    kingNameAr: 'المَلِكُ شَمْهُورُشُ',
    kingNameTrans: 'Al-Malik Shamhurish',
    angelNameAr: 'صَرْفَيَائِيلُ',
    angelNameTrans: 'Sarfya’il',
    dayNameAr: 'الخَمِيسُ',
    dayNameTrans: 'Al-Khamis (Jeudi)',
    planetNameAr: 'المُشْتَرِي',
    planetNameTrans: 'Al-Mushtari (Jupiter)',
    elementAr: 'هَوَاءٌ (عُنْصُرٌ هَوَائِيٌّ)',
    elementTrans: 'Air (Hawai)',
    incenseAr: 'العَنْبَرُ الخَالِصُ والزَّعْفَرَانُ',
    incenseTrans: 'Pure Ambergris & Saffron',
    sigilSymbol: '♃ ۞ ♃',
  },
  6: {
    kingNameAr: 'المَلِكُ مَيْمُونُ أَبُو نُوخٍ',
    kingNameTrans: 'Al-Malik Maimun Abu Nukh',
    angelNameAr: 'عَنِيَائِيلُ',
    angelNameTrans: '‘Anya’il',
    dayNameAr: 'الجُمُعَةِ',
    dayNameTrans: 'Al-Jumu’ah (Vendredi)',
    planetNameAr: 'الزُّهَرَةُ',
    planetNameTrans: 'Al-Zuhara (Vénus)',
    elementAr: 'هَوَاءٌ مَائِيٌّ',
    elementTrans: 'Air / Eau',
    incenseAr: 'عُودُ النَّدِّ والوَرْدُ والمِسْكُ',
    incenseTrans: 'Oud, Rose Oil & Musk',
    sigilSymbol: '♀ ♀ ♀',
  },
  7: {
    kingNameAr: 'المَلِكُ زَوْبَعَةُ (مَيْمُونُ الأَسْوَدُ)',
    kingNameTrans: 'Al-Malik Zawba’ah (Maymun Al-Aswad)',
    angelNameAr: 'كَسْفَيَائِيلُ',
    angelNameTrans: 'Kasfya’il',
    dayNameAr: 'السَّبْتُ',
    dayNameTrans: 'Al-Sabt (Samedi)',
    planetNameAr: 'زُحَلُ',
    planetNameTrans: 'Zuhal (Saturne)',
    elementAr: 'تُرَابٌ يَابِسٌ',
    elementTrans: 'Terre Sèche (Turabi)',
    incenseAr: 'المُرُّ والـحَرْمَلُ والمَيْعَةُ',
    incenseTrans: 'Myrrh, Harmal & Storax',
    sigilSymbol: '♄ 🜏 ♄',
  },
};

/**
 * Main Extraction Engine for Rouhaniyya Guardians
 */
export function extractRouhaniyyaData(
  input: string | number,
  celestialConstant: 41 | 51 = 41,
  celestialSuffix: 'yael' | 'ael' = 'yael'
): RouhaniyyaExtractionData {
  let text = '';
  let abjadTotal = 0;

  if (typeof input === 'number') {
    abjadTotal = Math.max(1, Math.floor(input));
    text = `Zimām ${abjadTotal}`;
  } else {
    text = input.trim();
    abjadTotal = calculateAbjadValue(text);
    if (abjadTotal === 0 && !isNaN(parseInt(text, 10))) {
      abjadTotal = parseInt(text, 10);
    }
  }

  if (abjadTotal <= 0) abjadTotal = 1;

  // 1. Muwakkil 'Alawi (Celestial Angel)
  let celestialRemainder = abjadTotal - celestialConstant;
  if (celestialRemainder <= 0) {
    celestialRemainder = ((abjadTotal + 360) - celestialConstant) || 12;
  }

  const celestialLetters = numberToAbjadLetters(celestialRemainder);
  const celestialVocalized = vocalizeAbjadRoot(celestialLetters);
  const suffixAr = celestialSuffix === 'yael' ? 'يَائِيلُ' : 'آئِيلُ';
  const suffixTrans = celestialSuffix === 'yael' ? 'yā’īl' : 'ā’īl';

  const celestialNameAr = `${celestialVocalized}${suffixAr}`;
  const celestialNameTrans = `${celestialVocalized.replace(/[\u064B-\u0652]/g, '')}-${suffixTrans}`;
  const celestialInvocationAr = `أَيُّهَا المَلَكُ العَلَوِيُّ المَوَّكَّلُ ${celestialNameAr}`;
  const celestialInvocationTrans = `Ayyuhāl-Malakul-‘Alawiyyu ${celestialNameTrans}`;

  const celestialResult: CelestialAngelResult = {
    nameAr: celestialNameAr,
    nameTrans: celestialNameTrans,
    rootLetters: celestialLetters,
    remainderValue: celestialRemainder,
    formulaUsed: `${abjadTotal} - ${celestialConstant} = ${celestialRemainder}`,
    invocationAr: celestialInvocationAr,
    invocationTrans: celestialInvocationTrans,
  };

  // 2. Muwakkil Sifli (Terrestrial Guardian)
  const terrestrialConstant = 419;
  let terrestrialRemainder = abjadTotal - terrestrialConstant;
  if (terrestrialRemainder <= 0) {
    terrestrialRemainder = (Math.abs(abjadTotal - terrestrialConstant) % 419) + 1;
  }

  const terrestrialLetters = numberToAbjadLetters(terrestrialRemainder);
  const terrestrialVocalized = vocalizeAbjadRoot(terrestrialLetters);
  const terrestrialSuffixAr = 'طَيْشُ';
  const terrestrialSuffixTrans = 'ṭayš';

  const terrestrialNameAr = `${terrestrialVocalized}${terrestrialSuffixAr}`;
  const terrestrialNameTrans = `${terrestrialVocalized.replace(/[\u064B-\u0652]/g, '')}-${terrestrialSuffixTrans}`;
  const terrestrialInvocationAr = `أَيُّهَا الرَّوحَانِيُّ السِّـفْلِيُّ ${terrestrialNameAr}`;
  const terrestrialInvocationTrans = `Ayyuhār-Rūḥāniyyus-Sifliyyu ${terrestrialNameTrans}`;

  const terrestrialResult: TerrestrialGuardianResult = {
    nameAr: terrestrialNameAr,
    nameTrans: terrestrialNameTrans,
    rootLetters: terrestrialLetters,
    remainderValue: terrestrialRemainder,
    formulaUsed: `${abjadTotal} - ${terrestrialConstant} = ${terrestrialRemainder}`,
    invocationAr: terrestrialInvocationAr,
    invocationTrans: terrestrialInvocationTrans,
  };

  // 3. Moulouk al-Sab'ah (Rois des 7 Jours)
  let dayIndex = abjadTotal % 7;
  if (dayIndex === 0) dayIndex = 7;

  const kingRaw = KINGS_DATABASE[dayIndex] || KINGS_DATABASE[1];
  const kingResult: SpiritualKingResult = {
    ...kingRaw,
    dayIndex,
  };

  // 4. A'wan (Auxiliaires / Serviteurs)
  const units = abjadTotal % 10;
  const tens = Math.floor((abjadTotal % 100) / 10) * 10;
  const hundreds = Math.floor((abjadTotal % 1000) / 100) * 100;
  const thousands = Math.floor(abjadTotal / 1000) * 1000;

  const auxiliaries: AuxiliaryServant[] = [
    {
      levelKey: 'units',
      levelValue: units,
      rootLetters: numberToAbjadLetters(units || 1),
      nameAr: `${vocalizeAbjadRoot(numberToAbjadLetters(units || 1))}يُوشُ`,
      nameTrans: `${vocalizeAbjadRoot(numberToAbjadLetters(units || 1)).replace(/[\u064B-\u0652]/g, '')}-Yūsh`,
      roleAr: 'خَادِمُ الآحَادِ (السُّرْعَةُ والتَّنْفِيذُ المَادِّيُّ)',
      roleTrans: 'Serviteur des Unités (Vitesse et Exécution Immédiate)',
    },
    {
      levelKey: 'tens',
      levelValue: tens,
      rootLetters: numberToAbjadLetters(tens || 10),
      nameAr: `${vocalizeAbjadRoot(numberToAbjadLetters(tens || 10))}طُوشُ`,
      nameTrans: `${vocalizeAbjadRoot(numberToAbjadLetters(tens || 10)).replace(/[\u064B-\u0652]/g, '')}-Ṭūsh`,
      roleAr: 'خَادِمُ العَشَرَاتِ (المَشَاعِرُ والـقُلُوبُ)',
      roleTrans: 'Serviteur des Dizaines (Cœurs et Émotions)',
    },
    {
      levelKey: 'hundreds',
      levelValue: hundreds,
      rootLetters: numberToAbjadLetters(hundreds || 100),
      nameAr: `${vocalizeAbjadRoot(numberToAbjadLetters(hundreds || 100))}وَوشُ`,
      nameTrans: `${vocalizeAbjadRoot(numberToAbjadLetters(hundreds || 100)).replace(/[\u064B-\u0652]/g, '')}-Wūsh`,
      roleAr: 'خَادِمُ المِئَاتِ (العَقْلُ والفَهْمُ الرُّوحِيُّ)',
      roleTrans: 'Serviteur des Centaines (Intellect et Compréhension Spirituelle)',
    },
    {
      levelKey: 'thousands',
      levelValue: thousands,
      rootLetters: numberToAbjadLetters(thousands || 1000),
      nameAr: `${vocalizeAbjadRoot(numberToAbjadLetters(thousands || 1000))}قُوشُ`,
      nameTrans: `${vocalizeAbjadRoot(numberToAbjadLetters(thousands || 1000)).replace(/[\u064B-\u0652]/g, '')}-Qūsh`,
      roleAr: 'خَادِمُ الآلَافِ (الحَضْرَةُ والسُّلْطَانُ العَالِي)',
      roleTrans: 'Serviteur des Milliers (Présence et Autorité Suprême)',
    },
  ];

  // 5. Dabt al-Asma (Vocalisation Grammaticale)
  const baseRoot = numberToAbjadLetters(abjadTotal);
  const vocalBase = vocalizeAbjadRoot(baseRoot);

  const vocalizations: VocalizationScheme[] = [
    {
      schemeKey: 'faail',
      schemeNameAr: 'وَزْنُ فَعَائِيلَ (أَطْهَرُ الأَوْزَانِ العَلَوِيَّةِ)',
      schemeNameTrans: 'Schéma Fa’ā’īl (Souveraineté Céleste)',
      vocalizedNameAr: `فَعَائِيلُ (${vocalBase}َائِيلُ)`,
      vocalizedNameTrans: `${vocalBase.replace(/[\u064B-\u0652]/g, '')}-A’īl`,
      descriptionKey: 'vocalFaailDesc',
    },
    {
      schemeKey: 'failush',
      schemeNameAr: 'وَزْنُ فَاعِلُوشٍ (أَمْرٌ وَتَصَرُّفٌ سِفْلِيٌّ)',
      schemeNameTrans: 'Schéma Fā’ilūsh (Commandement Terrestre)',
      vocalizedNameAr: `فَاعِلُوشٌ (${vocalBase}ِيلُوشٌ)`,
      vocalizedNameTrans: `${vocalBase.replace(/[\u064B-\u0652]/g, '')}-Īlūsh`,
      descriptionKey: 'vocalFailushDesc',
    },
    {
      schemeKey: 'mafulash',
      schemeNameAr: 'وَزْنُ مَفْعُولَاشٍ (حِفْظٌ وَعَوْنٌ مُسَاعِدٌ)',
      schemeNameTrans: 'Schéma Maf’ūlāsh (Garde et Assistance)',
      vocalizedNameAr: `مَفْعُولَاشٌ (مَـ${vocalBase}ـُولَاشٌ)`,
      vocalizedNameTrans: `Ma-${vocalBase.replace(/[\u064B-\u0652]/g, '')}-Ūlāsh`,
      descriptionKey: 'vocalMafulashDesc',
    },
  ];

  // 6. Calendrier de Connexion
  const currentDayOfWeek = new Date().getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  // Map JS Day (0..6) to our 1..7 Index (1=Sun, 2=Mon... 7=Sat)
  const mappedCurrentDay = currentDayOfWeek === 0 ? 1 : currentDayOfWeek + 1;
  const isCurrentlyAligned = mappedCurrentDay === dayIndex;

  const reducedCount = ((abjadTotal - 1) % 9) + 1;

  const scheduleResult: ConnectionScheduleResult = {
    bestDayAr: kingResult.dayNameAr,
    bestDayTrans: kingResult.dayNameTrans,
    bestPlanetAr: kingResult.planetNameAr,
    bestPlanetTrans: kingResult.planetNameTrans,
    optimalHours: [
      '1ère Heure après le Lever du Soleil (Sogoma)',
      '8ème Heure Planétaire (Milieu de Journée / Zénith)',
      '1ère Heure de la Nuit Solaire (Woula / Après Coucher)',
    ],
    incenseAr: kingResult.incenseAr,
    incenseTrans: kingResult.incenseTrans,
    directionAr: 'مُوَاجَهَةُ القِبْلَةِ الشَّرِيفَةِ (شَرْقٌ / جَنُوبٌ)',
    directionTrans: 'Orientation Qibla Sacrée (Est / Sud-Est)',
    zikrCount: abjadTotal,
    reducedCount,
    isCurrentlyAligned,
  };

  const elementalBreakdown = getElementalBreakdown(typeof input === 'string' ? input : baseRoot);

  return {
    inputText: text,
    abjadTotal,
    celestial: celestialResult,
    terrestrial: terrestrialResult,
    king: kingResult,
    auxiliaries,
    vocalizations,
    schedule: scheduleResult,
    elementalBreakdown,
  };
}
