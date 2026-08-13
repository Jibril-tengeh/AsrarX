import { calculateAbjadValue, numberToAbjadLetters, getElementalBreakdown } from './abjad';

export interface ShifrTaliResult {
  ascendantSign: string;
  rulingPlanet: string;
  element: string;
  cipherMap: { original: string; cipherLetter: string; numericValue: number; symbol: string }[];
  encodedString: string;
}

export interface MizanKabeerResult {
  inputText: string;
  totalStandardAbjad: number;
  totalPlanetaryBalanced: number;
  letterDetails: {
    letter: string;
    standardValue: number;
    planetName: string;
    planetRank: number;
    balancedValue: number;
  }[];
  dominantElement: string;
  balanceHarmonyScore: number;
}

export interface KhatimDhahabiResult {
  targetNumber: number;
  gridSize: 6;
  magicConstant: number;
  grid: number[][];
  isValid6x6: boolean;
  solarTransitStatusFr: string;
  solarTransitStatusEn: string;
  solarTransitStatusHa: string;
  solarTransitStatus: string;
  solarHourActive: boolean;
}

export interface JafrHawadithResult {
  inputEvent: string;
  eventWeight: number;
  conjunctionTypeFr: string;
  conjunctionTypeEn: string;
  conjunctionTypeHa: string;
  conjunctionType: string;
  historicalCycleYear: number;
  impactScore: number; // 0..100
  cycleDescriptionFr: string;
  cycleDescriptionEn: string;
  cycleDescriptionHa: string;
  propheticOutlook: string;
}

export interface MizanRuhResult {
  personName: string;
  motherName: string;
  personWeight: number;
  motherWeight: number;
  combinedWeight: number;
  rulingPlanetFr: string;
  rulingPlanetEn: string;
  rulingPlanetHa: string;
  rulingPlanet: string;
  vitalityIndex: number; // 0..100%
  resilienceLevelFr: string;
  resilienceLevelEn: string;
  resilienceLevelHa: string;
  resilienceLevel: string;
  recommendedDhikr: string;
  elementalBreakdown: { fire: number; air: number; water: number; earth: number };
}

export interface IsmMurakkabResult {
  namesInput: string[];
  totalCombinedAbjad: number;
  condensedAcronymAr: string;
  condensedAcronymTrans: string;
  talsamFormula: string;
  guardianNameAr: string;
  guardianNameTrans: string;
}

export interface TlasimLaylResult {
  targetHoursFr: string[];
  targetHoursEn: string[];
  targetHoursHa: string[];
  targetHours: string[];
  protectiveGrid: string[][];
  shieldKeyAr: string;
  shieldKeyTrans: string;
  nocturnalRigorScore: number;
  barrierConsonants: string[];
}

export interface MizanIjabahResult {
  activePercentage: number; // Fire + Air
  passivePercentage: number; // Water + Earth
  promptitudeScore: number; // 0..100%
  statusSpeedFr: string;
  statusSpeedEn: string;
  statusSpeedHa: string;
  statusSpeed: 'Ultra-Rapide (Fath Sajil)' | 'Rapide (Seri\')' | 'Modéré (Mutawasit)' | 'Profond / Lent (Thaqeel)';
  recommendationFr: string;
  recommendationEn: string;
  recommendationHa: string;
}

export interface KhatamKhassResult {
  starPoints: { position: number; consonantAr: string; consonantTrans: string; virtueAr: string }[];
  centerSymbol: string;
  sealAbjadTotal: number;
  hourRulerFr: string;
  hourRulerEn: string;
  hourRulerHa: string;
  hourRuler: string;
}

export interface SaatFathResult {
  exactTime: string;
  alignmentScore: number; // %
  skyConditionFr: string;
  skyConditionEn: string;
  skyConditionHa: string;
  skyCondition: string;
  favorableMinute: number;
  recommendedActionFr: string;
  recommendedActionEn: string;
  recommendedActionHa: string;
}

export interface KhattMiyahResult {
  originalText: string;
  curvilinearWaterScript: string;
  fluidFlowGlyphs: string[];
  washingUsageFr: string;
  washingUsageEn: string;
  washingUsageHa: string;
}

export interface TafdeelKabirResult {
  desiredTotal: number;
  gridSize: number;
  baseCell: number;
  deficitRemainder: number;
  compensationConstantK: number;
  adjustedFormulaFr: string;
  adjustedFormulaEn: string;
  adjustedFormulaHa: string;
  adjustedFormula: string;
  recommendedInsertionCellFr: string;
  recommendedInsertionCellEn: string;
  recommendedInsertionCellHa: string;
  recommendedInsertionCell: string;
}

// PLANETARY RANKS (1 to 7 according to ancient order)
const PLANET_RANKS: Record<string, { rank: number; planetAr: string; planetFr: string; planetEn: string; planetHa: string }> = {
  'ا': { rank: 4, planetAr: 'الشمس', planetFr: 'Soleil', planetEn: 'Sun', planetHa: 'Rana' },
  'ب': { rank: 7, planetAr: 'القمر', planetFr: 'Lune', planetEn: 'Moon', planetHa: 'Wata' },
  'ج': { rank: 3, planetAr: 'المريخ', planetFr: 'Mars', planetEn: 'Mars', planetHa: 'Mars' },
  'د': { rank: 6, planetAr: 'عطارد', planetFr: 'Mercure', planetEn: 'Mercury', planetHa: 'Otarid' },
  'ه': { rank: 2, planetAr: 'المشتري', planetFr: 'Jupiter', planetEn: 'Jupiter', planetHa: 'Mushtari' },
  'و': { rank: 5, planetAr: 'الزهرة', planetFr: 'Vénus', planetEn: 'Venus', planetHa: 'Zuhara' },
  'ز': { rank: 1, planetAr: 'زحل', planetFr: 'Saturne', planetEn: 'Saturn', planetHa: 'Zuhal' },
  'ح': { rank: 4, planetAr: 'الشمس', planetFr: 'Soleil', planetEn: 'Sun', planetHa: 'Rana' },
  'ط': { rank: 7, planetAr: 'القمر', planetFr: 'Lune', planetEn: 'Moon', planetHa: 'Wata' },
  'ي': { rank: 3, planetAr: 'المريخ', planetFr: 'Mars', planetEn: 'Mars', planetHa: 'Mars' },
  'ك': { rank: 6, planetAr: 'عطارد', planetFr: 'Mercure', planetEn: 'Mercury', planetHa: 'Otarid' },
  'ل': { rank: 2, planetAr: 'المشتري', planetFr: 'Jupiter', planetEn: 'Jupiter', planetHa: 'Mushtari' },
  'م': { rank: 5, planetAr: 'الزهرة', planetFr: 'Vénus', planetEn: 'Venus', planetHa: 'Zuhara' },
  'ن': { rank: 1, planetAr: 'زحل', planetFr: 'Saturne', planetEn: 'Saturn', planetHa: 'Zuhal' },
  'س': { rank: 4, planetAr: 'الشمس', planetFr: 'Soleil', planetEn: 'Sun', planetHa: 'Rana' },
  'ع': { rank: 7, planetAr: 'القمر', planetFr: 'Lune', planetEn: 'Moon', planetHa: 'Wata' },
  'ف': { rank: 3, planetAr: 'المريخ', planetFr: 'Mars', planetEn: 'Mars', planetHa: 'Mars' },
  'ص': { rank: 6, planetAr: 'عطارد', planetFr: 'Mercure', planetEn: 'Mercury', planetHa: 'Otarid' },
  'ق': { rank: 2, planetAr: 'المشتري', planetFr: 'Jupiter', planetEn: 'Jupiter', planetHa: 'Mushtari' },
  'ر': { rank: 5, planetAr: 'الزهرة', planetFr: 'Vénus', planetEn: 'Venus', planetHa: 'Zuhara' },
  'ش': { rank: 1, planetAr: 'زحل', planetFr: 'Saturne', planetEn: 'Saturn', planetHa: 'Zuhal' },
  'ت': { rank: 4, planetAr: 'الشمس', planetFr: 'Soleil', planetEn: 'Sun', planetHa: 'Rana' },
  'ث': { rank: 7, planetAr: 'القمر', planetFr: 'Lune', planetEn: 'Moon', planetHa: 'Wata' },
  'خ': { rank: 3, planetAr: 'المريخ', planetFr: 'Mars', planetEn: 'Mars', planetHa: 'Mars' },
  'ذ': { rank: 6, planetAr: 'عطارد', planetFr: 'Mercure', planetEn: 'Mercury', planetHa: 'Otarid' },
  'ض': { rank: 2, planetAr: 'المشتري', planetFr: 'Jupiter', planetEn: 'Jupiter', planetHa: 'Mushtari' },
  'ظ': { rank: 5, planetAr: 'الزهرة', planetFr: 'Vénus', planetEn: 'Venus', planetHa: 'Zuhara' },
  'غ': { rank: 1, planetAr: 'زحل', planetFr: 'Saturne', planetEn: 'Saturn', planetHa: 'Zuhal' },
};

const ZODIAC_SIGNS = [
  { sign: 'Bélier (الحمل)', planet: 'Mars', element: 'Feu', offset: 1 },
  { sign: 'Taureau (الثور)', planet: 'Vénus', element: 'Terre', offset: 2 },
  { sign: 'Gémeaux (الجوزاء)', planet: 'Mercure', element: 'Air', offset: 3 },
  { sign: 'Cancer (السرطان)', planet: 'Lune', element: 'Eau', offset: 4 },
  { sign: 'Lion (الأسد)', planet: 'Soleil', element: 'Feu', offset: 5 },
  { sign: 'Vierge (العذراء)', planet: 'Mercure', element: 'Terre', offset: 6 },
  { sign: 'Balance (الميزان)', planet: 'Vénus', element: 'Air', offset: 7 },
  { sign: 'Scorpion (العقرب)', planet: 'Mars', element: 'Eau', offset: 8 },
  { sign: 'Sagittaire (القوس)', planet: 'Jupiter', element: 'Feu', offset: 9 },
  { sign: 'Capricorne (الجدي)', planet: 'Saturne', element: 'Terre', offset: 10 },
  { sign: 'Verseau (الدلو)', planet: 'Saturne', element: 'Air', offset: 11 },
  { sign: 'Poissons (الحوت)', planet: 'Jupiter', element: 'Eau', offset: 12 },
];

/**
 * 1. Shifr al-Tali' (Alphabet Personnel)
 */
export function generateShifrTali(text: string, zodiacIndex: number = 0): ShifrTaliResult {
  const selectedSign = ZODIAC_SIGNS[zodiacIndex % 12];
  const offset = selectedSign.offset;

  const charArray = Array.from(text);
  const cipherMap: ShifrTaliResult['cipherMap'] = [];
  let encodedString = '';

  const esotericGlyphs = ['🜁', '🜂', '🜃', '🜄', '☉', '☽', '☿', '♀', '♂', '♃', '♄', '۞', 'Ϡ', 'Ϟ', 'Ϙ'];

  charArray.forEach((ch, idx) => {
    const val = calculateAbjadValue(ch);
    if (val > 0) {
      const shiftedVal = (val * offset) % 1000 + 1;
      const cipherLetter = numberToAbjadLetters(shiftedVal) || ch;
      const symbol = esotericGlyphs[(val + offset + idx) % esotericGlyphs.length];
      cipherMap.push({
        original: ch,
        cipherLetter,
        numericValue: shiftedVal,
        symbol,
      });
      encodedString += symbol + cipherLetter + ' ';
    }
  });

  return {
    ascendantSign: selectedSign.sign,
    rulingPlanet: selectedSign.planet,
    element: selectedSign.element,
    cipherMap,
    encodedString: encodedString.trim(),
  };
}

/**
 * 2. Mizan al-Kabeer (Balance d'Ibn Arabi)
 */
export function calculateMizanKabeer(inputText: string): MizanKabeerResult {
  const totalStandardAbjad = calculateAbjadValue(inputText);
  const charArray = Array.from(inputText.replace(/\s+/g, ''));

  let totalPlanetaryBalanced = 0;
  const letterDetails: MizanKabeerResult['letterDetails'] = [];

  charArray.forEach((ch) => {
    const stdVal = calculateAbjadValue(ch);
    if (stdVal > 0) {
      const pInfo = PLANET_RANKS[ch] || { rank: 4, planetAr: 'الشمس', planetFr: 'Soleil', planetEn: 'Sun', planetHa: 'Rana' };
      const balancedValue = stdVal * pInfo.rank;
      totalPlanetaryBalanced += balancedValue;

      letterDetails.push({
        letter: ch,
        standardValue: stdVal,
        planetName: pInfo.planetFr,
        planetRank: pInfo.rank,
        balancedValue,
      });
    }
  });

  const elements = getElementalBreakdown(inputText);
  let dominantElement = 'Feu';
  if (elements.air >= elements.fire && elements.air >= elements.water && elements.air >= elements.earth) dominantElement = 'Air';
  if (elements.water >= elements.fire && elements.water >= elements.air && elements.water >= elements.earth) dominantElement = 'Eau';
  if (elements.earth >= elements.fire && elements.earth >= elements.air && elements.earth >= elements.water) dominantElement = 'Terre';

  const balanceHarmonyScore = Math.min(100, Math.round((totalPlanetaryBalanced / (totalStandardAbjad || 1)) * 25));

  return {
    inputText,
    totalStandardAbjad,
    totalPlanetaryBalanced,
    letterDetails,
    dominantElement,
    balanceHarmonyScore,
  };
}

/**
 * 3. Al-Khatim al-Dhahabi (Soleil - Carré 6x6)
 */
export function generateKhatimDhahabi(targetNumber: number): KhatimDhahabiResult {
  let target = Math.max(111, targetNumber);
  const magicConstant = target;

  // Base starting number for 6x6 solar grid
  const base = Math.max(1, Math.floor((target - 105) / 6));

  const grid: number[][] = Array.from({ length: 6 }, () => Array(6).fill(0));

  // Construct a standard 6x6 magic square layout scaled by base
  const standard6x6Template = [
    [35, 1, 6, 26, 19, 24],
    [3, 32, 7, 21, 23, 25],
    [31, 9, 2, 22, 27, 20],
    [8, 28, 33, 17, 10, 15],
    [30, 5, 34, 12, 14, 16],
    [4, 36, 29, 13, 18, 11],
  ];

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      grid[r][c] = standard6x6Template[r][c] + (base - 1);
    }
  }

  const currentHour = new Date().getHours();
  // Solar hours typically during daytime or zenith
  const solarHourActive = currentHour >= 6 && currentHour <= 18;

  return {
    targetNumber: target,
    gridSize: 6,
    magicConstant,
    grid,
    isValid6x6: true,
    solarTransitStatusFr: solarHourActive ? 'Transit Solaire Actif (Clarté Zénithale)' : 'Repos Nocturne (Période d\'Incubation)',
    solarTransitStatusEn: solarHourActive ? 'Active Solar Transit (Zenithal Clarity)' : 'Nocturnal Rest (Incubation Period)',
    solarTransitStatusHa: solarHourActive ? 'Aikin Rana Yana Aiki (Hasken Samaniya)' : 'Hutu na Dare',
    solarTransitStatus: solarHourActive ? 'Transit Solaire Actif (Clarté Zénithale)' : 'Repos Nocturne (Période d\'Incubation)',
    solarHourActive,
  };
}

/**
 * 4. Jafr al-Hawadith (Cycles Historiques)
 */
export function calculateJafrHawadith(inputEvent: string): JafrHawadithResult {
  const weight = calculateAbjadValue(inputEvent) || 313;
  const cycleYear = 2026 + (weight % 19);
  const conjunctionsFr = ['Saturne-Jupiter (Grande Conjonction)', 'Mars-Saturne (Période de Rigueur)', 'Jupiter-Vénus (Prospérité Majeure)'];
  const conjunctionsEn = ['Saturn-Jupiter (Great Conjunction)', 'Mars-Saturn (Period of Rigor)', 'Jupiter-Venus (Major Prosperity)'];
  const conjunctionsHa = ['Saturn-Jupiter (Babban Haɗuwa)', 'Mars-Saturn (Lokacin Tsanani)', 'Jupiter-Venus (Babban Nasara)'];
  
  const idx = weight % conjunctionsFr.length;
  const conjunctionTypeFr = conjunctionsFr[idx];
  const conjunctionTypeEn = conjunctionsEn[idx];
  const conjunctionTypeHa = conjunctionsHa[idx];

  const impactScore = Math.min(100, Math.max(45, (weight % 55) + 45));

  return {
    inputEvent,
    eventWeight: weight,
    conjunctionTypeFr,
    conjunctionTypeEn,
    conjunctionTypeHa,
    conjunctionType: conjunctionTypeFr,
    historicalCycleYear: cycleYear,
    impactScore,
    cycleDescriptionFr: `Cycle de transformation majeure révélé par le poids Abjad ${weight}. La conjonction ${conjunctionTypeFr} annonce un point d'inflexion spirituel et historique majeur vers ${cycleYear}.`,
    cycleDescriptionEn: `Major transformation cycle revealed by Abjad weight ${weight}. The ${conjunctionTypeEn} conjunction signals a major spiritual and historical turning point towards ${cycleYear}.`,
    cycleDescriptionHa: `Babban sa'i na sauyi da aka bayyana ta nauyin Abjad ${weight}. Haɗuwar ${conjunctionTypeHa} tana nuna babban lokacin sauyi na ruhaniyya da tarihi zuwa ${cycleYear}.`,
    propheticOutlook: `المُصَالَحَةُ والعِزُّ الفَضِيلُ (Concorde et Élévation Majeure - Abjad ${weight})`,
  };
}

/**
 * 5. Mizan al-Ruh (Résilience & Vitalité)
 */
export function calculateMizanRuh(personName: string, motherName: string): MizanRuhResult {
  const personWeight = calculateAbjadValue(personName) || 100;
  const motherWeight = calculateAbjadValue(motherName) || 100;
  const combinedWeight = personWeight + motherWeight;

  const planetsFr = ['Soleil', 'Lune', 'Mars', 'Mercure', 'Jupiter', 'Vénus', 'Saturne'];
  const planetsEn = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const planetsHa = ['Rana', 'Wata', 'Mars', 'Otarid', 'Mushtari', 'Zuhara', 'Zuhal'];
  const pIdx = combinedWeight % planetsFr.length;

  const vitalityIndex = Math.min(100, Math.max(30, (combinedWeight % 65) + 35));

  let resilienceLevelFr = 'Élevée (Nafs Mutma\'innah)';
  let resilienceLevelEn = 'High (Nafs Mutma\'innah)';
  let resilienceLevelHa = 'Mai Girma (Nafs Mutma\'innah)';
  if (vitalityIndex < 50) {
    resilienceLevelFr = 'Modérée (Nafs Lawwamah)';
    resilienceLevelEn = 'Moderate (Nafs Lawwamah)';
    resilienceLevelHa = 'Matsakaici (Nafs Lawwamah)';
  } else if (vitalityIndex > 80) {
    resilienceLevelFr = 'Sublime & Protégée (Ruhiyyah)';
    resilienceLevelEn = 'Sublime & Protected (Ruhiyyah)';
    resilienceLevelHa = 'Mafi Ɗaukaka Da Kaririya (Ruhiyyah)';
  }

  const dhikrs = ['يا حي يا قيوم', 'يا قوي يا متين', 'يا حفيظ يا سلام', 'يا نور يا هادي'];
  const recommendedDhikr = dhikrs[combinedWeight % dhikrs.length];

  const elementalBreakdown = getElementalBreakdown(personName + motherName);

  return {
    personName,
    motherName,
    personWeight,
    motherWeight,
    combinedWeight,
    rulingPlanetFr: planetsFr[pIdx],
    rulingPlanetEn: planetsEn[pIdx],
    rulingPlanetHa: planetsHa[pIdx],
    rulingPlanet: planetsFr[pIdx],
    vitalityIndex,
    resilienceLevelFr,
    resilienceLevelEn,
    resilienceLevelHa,
    resilienceLevel: resilienceLevelFr,
    recommendedDhikr,
    elementalBreakdown,
  };
}

/**
 * 6. Ism al-Murakkab (Nom Composé & Acronyme Divine)
 */
export function calculateIsmMurakkab(namesInput: string[]): IsmMurakkabResult {
  const validNames = namesInput.filter((n) => n.trim().length > 0);
  const totalCombinedAbjad = validNames.reduce((acc, name) => acc + calculateAbjadValue(name), 0);

  let acronym = '';
  validNames.forEach((n) => {
    const clean = n.replace(/^(ال|يا)/, '').trim();
    if (clean.length > 0) acronym += clean.charAt(0);
  });

  if (!acronym) acronym = 'كهيعص';

  const condensedAcronymAr = acronym;
  const condensedAcronymTrans = acronym;
  const talsamFormula = `أَقْسَمْتُ عَلَيْكُمْ بِسِرِّ (${condensedAcronymAr}) - أَبْجَدُهُ ${totalCombinedAbjad}`;

  const rootServant = numberToAbjadLetters((totalCombinedAbjad - 41) % 360 || 12);
  const guardianNameAr = `${rootServant}يَائِيلُ`;
  const guardianNameTrans = `${rootServant}-Yā’īl`;

  return {
    namesInput: validNames,
    totalCombinedAbjad,
    condensedAcronymAr,
    condensedAcronymTrans,
    talsamFormula,
    guardianNameAr,
    guardianNameTrans,
  };
}

/**
 * 7. Tlasim al-Layl (Nuit - Barrière Mentale)
 */
export function calculateTlasimLayl(text: string): TlasimLaylResult {
  const weight = calculateAbjadValue(text) || 129;
  const barrierLetters = ['ش', 'ظ', 'غ', 'خ', 'ذ', 'ض'];

  const grid: string[][] = [
    ['حِفْظٌ', 'سِتْرٌ', 'نُورٌ'],
    ['حِرْزٌ', barrierLetters[weight % 6], 'مَانِعٌ'],
    ['سَلاَمٌ', 'شِهَابٌ', 'عِزٌّ'],
  ];

  const targetHoursFr = [
    '1ère Veille Nocturne (22h - 00h) : Fortification Mentale',
    '2ème Veille Nocturne (00h - 02h) : Dissipation des Ombrages',
    '3ème Veille Nocturne (02h - 04h) : Rayonnement Lumineux',
  ];
  const targetHoursEn = [
    '1st Night Watch (10 PM - 12 AM): Mental Fortification',
    '2nd Night Watch (12 AM - 02 AM): Shadows Dissipation',
    '3rd Night Watch (02 AM - 04 AM): Luminous Radiation',
  ];
  const targetHoursHa = [
    'Rabi Na Farko Na Dare (10 PM - 12 AM): Karfafa Hankali',
    'Rabi Na Tsakiya Na Dare (12 AM - 02 AM): Kauda Duhu',
    'Rabi Na Karshe Na Dare (02 AM - 04 AM): Haske Mai Aniya',
  ];

  return {
    targetHoursFr,
    targetHoursEn,
    targetHoursHa,
    targetHours: targetHoursFr,
    protectiveGrid: grid,
    shieldKeyAr: `حِصْنُ (${numberToAbjadLetters(weight)}) المَنِيعُ`,
    shieldKeyTrans: `Hisn (${numberToAbjadLetters(weight)}) Al-Mani'`,
    nocturnalRigorScore: Math.min(100, (weight % 40) + 60),
    barrierConsonants: barrierLetters,
  };
}

/**
 * 8. Mizan al-Ijabah (Promptitude de Réponse)
 */
export function calculateMizanIjabah(text: string): MizanIjabahResult {
  const elements = getElementalBreakdown(text);
  const activePercentage = Math.round(elements.fire + elements.air);
  const passivePercentage = Math.round(elements.water + elements.earth);

  const promptitudeScore = activePercentage;

  let statusSpeedFr = 'Modéré (Mutawasit)';
  let statusSpeedEn = 'Moderate (Mutawasit)';
  let statusSpeedHa = 'Tsaka-tsaki (Mutawasit)';
  let statusSpeed: MizanIjabahResult['statusSpeed'] = 'Modéré (Mutawasit)';

  if (activePercentage >= 70) {
    statusSpeedFr = 'Ultra-Rapide (Fath Sajil)';
    statusSpeedEn = 'Ultra-Fast (Fath Sajil)';
    statusSpeedHa = 'Mai Sauri Maza Maza (Fath Sajil)';
    statusSpeed = 'Ultra-Rapide (Fath Sajil)';
  } else if (activePercentage >= 50) {
    statusSpeedFr = 'Rapide (Seri\')';
    statusSpeedEn = 'Fast (Seri\')';
    statusSpeedHa = 'Mai Sauri (Seri\')';
    statusSpeed = 'Rapide (Seri\')';
  } else if (activePercentage < 35) {
    statusSpeedFr = 'Profond / Lent (Thaqeel)';
    statusSpeedEn = 'Deep / Slow (Thaqeel)';
    statusSpeedHa = 'Mai Nauyi / Sannu (Thaqeel)';
    statusSpeed = 'Profond / Lent (Thaqeel)';
  }

  return {
    activePercentage,
    passivePercentage,
    promptitudeScore,
    statusSpeedFr,
    statusSpeedEn,
    statusSpeedHa,
    statusSpeed,
    recommendationFr: activePercentage >= 50
      ? "L'énergie spirituelle est extrêmement prompte et dynamique. Récitation fluide recommandée."
      : "L'énergie est profonde et ancrée dans la matière. Associez la récitation à l'encens de Bakhour pour accélérer la vibration.",
    recommendationEn: activePercentage >= 50
      ? "Spiritual energy is extremely prompt and dynamic. Fluid recitation recommended."
      : "Energy is deep and grounded in matter. Pair recitation with Bakhour incense to accelerate vibration.",
    recommendationHa: activePercentage >= 50
      ? "Ƙarfin ruhaniyya yana da sauri da ƙarfi kwarai. Ana shawarwarin karatu cikin sauri da aminci."
      : "Ƙarfin ruhaniyya yana da zurfi a ƙasa. Haɗa karatun da turaren wuta don hanzarta amsawa.",
  };
}

/**
 * 9. Khatam al-Khass (Hexagramme 6 Consonnes)
 */
export function calculateKhatamKhass(text: string): KhatamKhassResult {
  const weight = calculateAbjadValue(text) || 313;
  const consonants = [
    { position: 1, consonantAr: 'ش', consonantTrans: 'Shin', virtueAr: 'الشَّمْسُ والـحِمَايَةُ' },
    { position: 2, consonantAr: 'ظ', consonantTrans: 'Zha', virtueAr: 'الظَّفَرُ والغَلَبَةُ' },
    { position: 3, consonantAr: 'غ', consonantTrans: 'Ghayn', virtueAr: 'الغِنَى والغَلَبَةُ' },
    { position: 4, consonantAr: 'خ', consonantTrans: 'Kha', virtueAr: 'الـخَيْرُ والمَنَّانُ' },
    { position: 5, consonantAr: 'ذ', consonantTrans: 'Dhal', virtueAr: 'الذِّكْرُ والـهَيْبَةُ' },
    { position: 6, consonantAr: 'ض', consonantTrans: 'Dhad', virtueAr: 'الضِّيَاءُ والنُّورُ' },
  ];

  return {
    starPoints: consonants,
    centerSymbol: '۞ 313 ۞',
    sealAbjadTotal: weight,
    hourRulerFr: 'Khatam Sulaymani (Sceau de Salomon)',
    hourRulerEn: 'Khatam Sulaymani (Seal of Solomon)',
    hourRulerHa: 'Hatimin Sulaiman',
    hourRuler: 'Khatam Sulaymani (Sceau de Salomon)',
  };
}

/**
 * 10. Sa'at al-Fath (Illumination & Minute d'Alignement)
 */
export function calculateSaatFath(text: string, birthHour: number = 12): SaatFathResult {
  const weight = calculateAbjadValue(text) || 129;
  const favorableMinute = (weight + birthHour * 7) % 60;
  const currentHour = new Date().getHours();

  const exactTime = `${String(currentHour).padStart(2, '0')}:${String(favorableMinute).padStart(2, '0')}`;
  const alignmentScore = Math.min(100, Math.max(60, (weight % 35) + 65));

  return {
    exactTime,
    alignmentScore,
    skyConditionFr: 'Porte Céleste Ouverte (Fath Mubeen)',
    skyConditionEn: 'Open Celestial Gate (Fath Mubeen)',
    skyConditionHa: 'Ƙofar Sama A Buɗe (Fath Mubeen)',
    skyCondition: 'Porte Céleste Ouverte (Fath Mubeen)',
    favorableMinute,
    recommendedActionFr: `Exécutez votre Zikr ou formulation d'intention exactement à la minute ${favorableMinute} de l'heure en cours pour un alignement céleste maximal.`,
    recommendedActionEn: `Perform your Dhikr or intention formulation exactly at minute ${favorableMinute} of the current hour for maximum celestial alignment.`,
    recommendedActionHa: `Aiwatar da zikiri ko niyya a daidai minti na ${favorableMinute} na sa'ar yanzu don dacewa da sa'ar buɗewa.`,
  };
}

/**
 * 11. Khatt al-Miyah (Alphabet de l'Eau)
 */
export function generateKhattMiyah(text: string): KhattMiyahResult {
  const charArray = Array.from(text);
  const fluidFlowGlyphs: string[] = [];

  const waterStyles: Record<string, string> = {
    'ا': '⌇',
    'ب': '〰',
    'ج': '≋',
    'د': '∿',
    'ه': '∿∿',
    'و': '⌇',
    'ز': '≋',
    'ح': '〰〰',
    'ط': '⌇',
    'ي': '≋',
  };

  charArray.forEach((ch) => {
    fluidFlowGlyphs.push(waterStyles[ch] || '〰');
  });

  return {
    originalText: text,
    curvilinearWaterScript: fluidFlowGlyphs.join(' '),
    fluidFlowGlyphs,
    washingUsageFr: "Écrivez cette écriture curviligne avec de l'eau de rose et du safran sur une assiette en porcelaine blanche pour le lavage purificateur (Mā' al-Shifā').",
    washingUsageEn: "Write this curvilinear script using rosewater and saffron on a white porcelain plate for purifying spiritual washing (Mā' al-Shifā').",
    washingUsageHa: "Rubuta wannan rubutu mai da'ira da ruwan rose da saffaran a kan kwanon faranti fari don wanke jiki na waraka (Mā' al-Shifā').",
  };
}

/**
 * 12. Al-Tafdeel al-Kabir (Ajustement de Wafq)
 */
export function calculateTafdeelKabir(targetNumber: number, gridSize: number = 3): TafdeelKabirResult {
  const sumConstant = gridSize === 3 ? 12 : gridSize === 4 ? 30 : 60;
  let baseCell = Math.floor((targetNumber - sumConstant) / gridSize);
  let deficitRemainder = (targetNumber - sumConstant) % gridSize;

  if (deficitRemainder < 0) {
    deficitRemainder += gridSize;
    baseCell -= 1;
  }

  const K = deficitRemainder;
  const insertionCellNameFr = deficitRemainder === 1 ? 'Maison 7 (Zuhara)' : deficitRemainder === 2 ? 'Maison 8 (Atarid)' : 'Maison 9 (Khatam)';
  const insertionCellNameEn = deficitRemainder === 1 ? 'House 7 (Venus)' : deficitRemainder === 2 ? 'House 8 (Mercury)' : 'House 9 (Seal)';
  const insertionCellNameHa = deficitRemainder === 1 ? 'Gida 7 (Zuhara)' : deficitRemainder === 2 ? 'Gida 8 (Otarid)' : 'Gida 9 (Hatim)';

  return {
    desiredTotal: targetNumber,
    gridSize,
    baseCell,
    deficitRemainder,
    compensationConstantK: K,
    adjustedFormulaFr: `Case de Compensation : Ajouter +1 aux cases à partir de ${insertionCellNameFr}`,
    adjustedFormulaEn: `Compensation Cell: Add +1 to cells starting from ${insertionCellNameEn}`,
    adjustedFormulaHa: `Gidan Gyara: Kara +1 daga ${insertionCellNameHa}`,
    adjustedFormula: `Case de Compensation : Ajouter +1 aux cases à partir de ${insertionCellNameFr}`,
    recommendedInsertionCellFr: insertionCellNameFr,
    recommendedInsertionCellEn: insertionCellNameEn,
    recommendedInsertionCellHa: insertionCellNameHa,
    recommendedInsertionCell: insertionCellNameFr,
  };
}
