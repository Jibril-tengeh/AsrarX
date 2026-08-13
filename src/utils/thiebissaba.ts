export interface MandingueFigure {
  id: string;
  binary: [number, number, number]; // [Row1, Row2, Row3] where 1 = 1 dot (Tek), 2 = 2 dots (Gnan)
  code: string; // e.g. "1-1-1"
  nameFr: string;
  nameEn: string;
  nameHa: string;
  titleFr: string;
  titleEn: string;
  titleHa: string;
  element: string;
  symbol: string;
  sacredTree: string;
  totemAnimal: string;
  nature: string;
  virtueFr: string;
  virtueEn: string;
  virtueHa: string;
  sarakaNatureFr: string;
  sarakaNatureEn: string;
  sarakaNatureHa: string;
  sarakaColor: string;
  sarakaQuantity: string;
  sarakaTargetFr: string;
  sarakaTargetEn: string;
  sarakaTargetHa: string;
}

export const MANDINGUE_FIGURES: MandingueFigure[] = [
  {
    id: "manssa",
    binary: [1, 1, 1],
    code: "1-1-1",
    nameFr: "Manssa (Le Roi)",
    nameEn: "Manssa (The King)",
    nameHa: "Manssa (Sarki)",
    titleFr: "Le Souverain - Pouvoir & Majesté",
    titleEn: "The Sovereign - Power & Majesty",
    titleHa: "Sarki Mai Iko da Daukaka",
    element: "Feu (Kouma / Agni)",
    symbol: "👑",
    sacredTree: "Baobab (Lahi)",
    totemAnimal: "Lion (Jara)",
    nature: "Solaire & Dominante",
    virtueFr: "Autorité légitime, clarté de décision, réussite dans les hautes sphères.",
    virtueEn: "Legitimate authority, clarity of decision, success in high spheres.",
    virtueHa: "Iko na sharia, fayyace shawara, nasara a cikin manyan al'amurran rayuwa.",
    sarakaNatureFr: "Kola blanches & tissu blanc ou piécettes d'argent",
    sarakaNatureEn: "White kola nuts & white cloth or silver coins",
    sarakaNatureHa: "Goro fari da fari tufa ko tsabar azurfa",
    sarakaColor: "Blanc Pur",
    sarakaQuantity: "7 ou 11 pièces",
    sarakaTargetFr: "Un chef de famille, un aîné vénéré ou une autorité",
    sarakaTargetEn: "A family head, revered elder, or authority figure",
    sarakaTargetHa: "Shugaban iyali ko tsoho mai alfarma",
  },
  {
    id: "mori",
    binary: [2, 1, 1],
    code: "2-1-1",
    nameFr: "Mori (Le Marabout)",
    nameEn: "Mori (The Scholar)",
    nameHa: "Mori (Malam)",
    titleFr: "Le Savant - Spiritualité & Connaissance",
    titleEn: "The Scholar - Spirituality & Knowledge",
    titleHa: "Mai Ilimi da Tsoron Allah",
    element: "Air (Foy-Foy)",
    symbol: "📜",
    sacredTree: "Karité (Sée)",
    totemAnimal: "Aigle (Bamanan-Kono)",
    nature: "Céleste & Inspirée",
    virtueFr: "Élévation spirituelle, maîtrise des écritures, protection invisible.",
    virtueEn: "Spiritual elevation, mastery of scriptures, invisible protection.",
    virtueHa: "Daukaka ta ruhi, sanin littattafai, kariya ta sirri.",
    sarakaNatureFr: "Lait frais, dattes douces ou livre sacré / chapelet",
    sarakaNatureEn: "Fresh milk, sweet dates, or sacred book / prayer beads",
    sarakaNatureHa: "Madara sabuwa, dabino ko carbi",
    sarakaColor: "Blanc & Jaune paille",
    sarakaQuantity: "12 dattes / 1 litre de lait",
    sarakaTargetFr: "Un enseignant, un étudiant en sciences divines ou un mendiant pieux",
    sarakaTargetEn: "A teacher, divine science student, or pious beggar",
    sarakaTargetHa: "Malamin makanta ko mai neman ilimi",
  },
  {
    id: "fama",
    binary: [1, 2, 1],
    code: "1-2-1",
    nameFr: "Fama (Le Guerrier)",
    nameEn: "Fama (The Warrior)",
    nameHa: "Fama (Jarumi)",
    titleFr: "Le Chef d'Action - Courage & Conquête",
    titleEn: "The Action Chief - Courage & Conquest",
    titleHa: "Sarkin Yaki da Jaruntaka",
    element: "Feu / Fer (Tasou)",
    symbol: "⚔️",
    sacredTree: "Néré (Néré-Soun)",
    totemAnimal: "Panthère (Kélé-Solou)",
    nature: "Martiale & Énergique",
    virtueFr: "Bravoure face au danger, triomphe sur les adversaires, force de frappe.",
    virtueEn: "Bravery facing danger, triumph over rivals, striking momentum.",
    virtueHa: "Jaruntaka a wajen tsananin yaki, nasara a kan makiya.",
    sarakaNatureFr: "Viande rouge sans os, kola rouge & objet métallique",
    sarakaNatureEn: "Red meat without bone, red kola & metallic item",
    sarakaNatureHa: "Nama ja maras kashi, goro ja",
    sarakaColor: "Rouge Brique & Fer",
    sarakaQuantity: "3 morceaux de viande ou 3 kolas",
    sarakaTargetFr: "Un forgeron, un protecteur de la communauté ou un travailleur manuel",
    sarakaTargetEn: "A blacksmith, community protector, or manual worker",
    sarakaTargetHa: "Makeri ko mai tsaron al'umma",
  },
  {
    id: "balla",
    binary: [1, 1, 2],
    code: "1-1-2",
    nameFr: "Balla (Le Sage)",
    nameEn: "Balla (The Sage)",
    nameHa: "Balla (Mai Hikima)",
    titleFr: "Le Griot & Médiateur - Harmonie & Parole",
    titleEn: "The Sage & Bard - Harmony & Speech",
    titleHa: "Mai Hikima da Shawara",
    element: "Air / Eau (Sene)",
    symbol: "🪕",
    sacredTree: "Cailcedrat (Kélé-Jiri)",
    totemAnimal: "Éléphant (Sama)",
    nature: "Conciliante & Éloquente",
    virtueFr: "Art de la diplomatie, apaisement des rancœurs, réconciliation.",
    virtueEn: "Art of diplomacy, soothing grudges, reconciliation.",
    virtueHa: "Hikimar daitawa, kwantar da hankali, sassaftawa.",
    sarakaNatureFr: "Honey (Miel pur), pain chaud ou graines de sésame",
    sarakaNatureEn: "Pure honey, warm bread, or sesame seeds",
    sarakaNatureHa: "Zuma mai kyau, burodin mai xumi",
    sarakaColor: "Doré & Ambre",
    sarakaQuantity: "1 pot de miel ou 7 pains",
    sarakaTargetFr: "Un poète, un artisan de la parole ou un voisin en difficulté",
    sarakaTargetEn: "A poet, wordsmith, or neighbor in hardship",
    sarakaTargetHa: "Makoraci ko makwabci mai buqata",
  },
  {
    id: "den",
    binary: [2, 2, 1],
    code: "2-2-1",
    nameFr: "Dén (L'Enfant)",
    nameEn: "Dén (The Child)",
    nameHa: "Dén (Yaro)",
    titleFr: "L'Innocent - Nouveauté & Espoir",
    titleEn: "The Innocent - Novelty & Hope",
    titleHa: "Sabuwar Fara da Tsarki",
    element: "Eau (Ji)",
    symbol: "🌱",
    sacredTree: "Rônier (Sébè)",
    totemAnimal: "Gazelle (Sègè)",
    nature: "Pure & Naïve",
    virtueFr: "Renouveau fertilisateur, sincérité, naissance d'un nouveau projet.",
    virtueEn: "Fertilizing renewal, sincerity, birth of a new venture.",
    virtueHa: "Fara sabon al'amari mai albarka, tsantsar gaskiya.",
    sarakaNatureFr: "Friandises, galettes de mil, bonbons ou fruits doux",
    sarakaNatureEn: "Sweets, millet cakes, candies, or sweet fruits",
    sarakaNatureHa: "Zakazakai, wainar hatsi, 'ya'yan itatuwa",
    sarakaColor: "Multicolore & Vert clair",
    sarakaQuantity: "Distribution à 7 enfants",
    sarakaTargetFr: "Un groupe d'enfants orphelins ou une école",
    sarakaTargetEn: "A group of orphan children or a school",
    sarakaTargetHa: "Marayu ko yara kanana a makaranta",
  },
  {
    id: "musso",
    binary: [2, 1, 2],
    code: "2-1-2",
    nameFr: "Musso (La Femme)",
    nameEn: "Musso (The Woman)",
    nameHa: "Musso (Mace)",
    titleFr: "La Matrice - Fécondité & Protection",
    titleEn: "The Matrix - Fertility & Nurture",
    titleHa: "Mahaifiya Mai Taimako da Albarka",
    element: "Terre (Dugu)",
    symbol: "🏺",
    sacredTree: "Kapokier (Bantan)",
    totemAnimal: "Vache (Nissí)",
    nature: "Maternelle & Généreuse",
    virtueFr: "Abondance domestique, intuition profonde, guérison des cœurs.",
    virtueEn: "Domestic abundance, deep intuition, healing of hearts.",
    virtueHa: "Arzikin gida, manazarta mai zurfi, maganin damuwa.",
    sarakaNatureFr: "Beurre de karité, farine de maïs, sel ou condiments précieux",
    sarakaNatureEn: "Shea butter, corn flour, salt, or precious spices",
    sarakaNatureHa: "Man kaɗanya, gishiri, garin masara",
    sarakaColor: "Blanc Crème & Ocre",
    sarakaQuantity: "1 calebasse de condiments ou 3 kilos de grain",
    sarakaTargetFr: "Une mère de famille, une femme enceinte ou une nourricière",
    sarakaTargetEn: "A mother, pregnant woman, or caregiver",
    sarakaTargetHa: "Mahaifiya ko mace mai juna biyu",
  },
  {
    id: "sogoma",
    binary: [1, 2, 2],
    code: "1-2-2",
    nameFr: "Sogoma (L'Aube)",
    nameEn: "Sogoma (The Dawn)",
    nameHa: "Sogoma (Asubahi)",
    titleFr: "Le Messager - Ouverture & Clarté",
    titleEn: "The Messenger - Opening & Clarity",
    titleHa: "Asubahi Mai Isar da Sako",
    element: "Air / Ciel (Sanko)",
    symbol: "🌅",
    sacredTree: "Acajou (Jala)",
    totemAnimal: "Colombe (Bélébélé-Kono)",
    nature: "Lumineuse & Rapide",
    virtueFr: "Déblocage des nouvelles, arrivée de courriers ou opportunités matinales.",
    virtueEn: "Unblocking of news, arrival of letters or morning opportunities.",
    virtueHa: "Bude hanyan labari mai dadi, labarin asubahi.",
    sarakaNatureFr: "Eau claire bénie, riz blanc cuit & parfum de fleurs",
    sarakaNatureEn: "Blessed clear water, cooked white rice & floral perfume",
    sarakaNatureHa: "Ruwa mai kyau, shinkafa dafaffiya faɗa",
    sarakaColor: "Blanc Argenté",
    sarakaQuantity: "3 bols de riz ou 1 gourde d'eau",
    sarakaTargetFr: "Un voyageur de passage ou un messager",
    sarakaTargetEn: "A passing traveler or a messenger",
    sarakaTargetHa: "Bako mai tafiya ko mai isar da sako",
  },
  {
    id: "kani",
    binary: [2, 2, 2],
    code: "2-2-2",
    nameFr: "Kani (La Conquête)",
    nameEn: "Kani (Conquest)",
    nameHa: "Kani (Nasara)",
    titleFr: "La Victoire - Stabilité & Ancrage",
    titleEn: "Victory - Stability & Grounding",
    titleHa: "Nasarar Yaki da Tabbata",
    element: "Feu / Terre (Solou)",
    symbol: "🛡️",
    sacredTree: "Tamarinier (Tomi)",
    totemAnimal: "Taureau (Tora)",
    nature: "Solide & Imprenable",
    virtueFr: "Victoire éclatante après l'effort, consolidation irréversible.",
    virtueEn: "Striking victory after exertion, irreversible consolidation.",
    virtueHa: "Cikakken nasara bayan wuya, tabbatar da matsayi.",
    sarakaNatureFr: "Grands grains (haricots, maïs), viande grillée ou tissu résistant",
    sarakaNatureEn: "Large grains (beans, corn), roasted meat, or durable cloth",
    sarakaNatureHa: "Wake, tsabar masara, nama gasasshe",
    sarakaColor: "Brun Terre & Noir",
    sarakaQuantity: "1 mesure de grains (Moud)",
    sarakaTargetFr: "Un groupe de travailleurs ou les bâtisseurs du village",
    sarakaTargetEn: "A work crew or village builders",
    sarakaTargetHa: "Masu gini ko mutane masu aikin karfi",
  },
];

/**
 * Given 3 binary rows (each 1 or 2 dots), return matching MandingueFigure
 */
export function getFigureByBinary(row1: number, row2: number, row3: number): MandingueFigure {
  const code = `${row1}-${row2}-${row3}`;
  const found = MANDINGUE_FIGURES.find((f) => f.code === code);
  return (
    found || {
      id: "manssa",
      binary: [1, 1, 1],
      code: "1-1-1",
      nameFr: "Manssa (Le Roi)",
      nameEn: "Manssa (The King)",
      nameHa: "Manssa (Sarki)",
      titleFr: "Le Souverain",
      titleEn: "The Sovereign",
      titleHa: "Sarki Mai Iko",
      element: "Feu",
      symbol: "👑",
      sacredTree: "Baobab",
      totemAnimal: "Lion",
      nature: "Solaire",
      virtueFr: "Autorité légitime",
      virtueEn: "Legitimate authority",
      virtueHa: "Iko na sharia",
      sarakaNatureFr: "Kola blanche",
      sarakaNatureEn: "White kola",
      sarakaNatureHa: "Goro fari",
      sarakaColor: "Blanc",
      sarakaQuantity: "7 pièces",
      sarakaTargetFr: "Un aîné",
      sarakaTargetEn: "An elder",
      sarakaTargetHa: "Tsoho",
    }
  );
}

/**
 * Calculate Parity of a line based on dot count
 * Odd -> 1 (Tek), Even -> 2 (Gnan)
 */
export function getParity(dotsCount: number): 1 | 2 {
  if (dotsCount <= 0) return 1;
  return dotsCount % 2 === 1 ? 1 : 2;
}

/**
 * Calculate Kadyo Verdict Modulo 12 or Modulo 16
 */
export function calculateKadyo(
  f1: MandingueFigure,
  f2: MandingueFigure,
  f3: MandingueFigure,
  modulo: 12 | 16 = 12
): {
  sumValue: number;
  verdictIndex: number;
  verdictFigure: MandingueFigure;
  sentenceFr: string;
  sentenceEn: string;
  sentenceHa: string;
} {
  // Each figure has a numeric weight based on its binary code (1 or 2)
  const val1 = f1.binary[0] + f1.binary[1] + f1.binary[2];
  const val2 = f2.binary[0] + f2.binary[1] + f2.binary[2];
  const val3 = f3.binary[0] + f3.binary[1] + f3.binary[2];

  const sumValue = val1 + val2 + val3;
  const verdictIndex = ((sumValue - 1) % modulo) % MANDINGUE_FIGURES.length;
  const verdictFigure = MANDINGUE_FIGURES[verdictIndex];

  let sentenceFr = "";
  let sentenceEn = "";
  let sentenceHa = "";

  if (verdictFigure.id === "manssa" || verdictFigure.id === "kani") {
    sentenceFr = "Dénouement glorieux ! L'affaire trouve son accomplissement par voie d'autorité et d'ancrage solide.";
    sentenceEn = "Glorious outcome! The matter finds completion through authority and solid grounding.";
    sentenceHa = "Sakamako mai kyau da albarka! Al'amari zai yiwu cikin nasara da daukaka.";
  } else if (verdictFigure.id === "mori" || verdictFigure.id === "sogoma") {
    sentenceFr = "Lumière divine et clarté ! Une nouvelle matinale ou un conseil sage viendra débloquer la situation.";
    sentenceEn = "Divine light and clarity! Morning news or wise counsel will unblock the situation.";
    sentenceHa = "Hasken ruhi da sauki! Labari mai kyau ko shawara mai kyau za ta bude hanya.";
  } else if (verdictFigure.id === "fama") {
    sentenceFr = "Action ferme requise. Nécessité de trancher sans hésitation et d'accomplir le Saraka prescrit.";
    sentenceEn = "Firm action required. Need to decide without hesitation and perform the prescribed Saraka.";
    sentenceHa = "Tashi tsaye yana da kyau. Yanke shawara cikin sauri da bayar da sadaka.";
  } else {
    sentenceFr = "Évolution favorable sous condition de partage et d'apaisement des rancœurs passées.";
    sentenceEn = "Favorable evolution provided past grievances are shared and quieted.";
    sentenceHa = "Al'amari zai yi kyau muddin aka kyautatawa mutane da bayar da sadaka.";
  }

  return {
    sumValue,
    verdictIndex,
    verdictFigure,
    sentenceFr,
    sentenceEn,
    sentenceHa,
  };
}

/**
 * Calculate Energy Flow Koun wa Sen (Head & Foot)
 */
export function calculateKounWaSen(r1: number, r3: number): {
  type: "ascending" | "descending" | "balanced";
  descriptionFr: string;
  descriptionEn: string;
  descriptionHa: string;
} {
  if (r1 === 1 && r3 === 2) {
    return {
      type: "ascending",
      descriptionFr: "Flux Ascendant (Koun -> Ciel) : L'énergie monte de la terre vers les sommets. Idéal pour la renommée, la spiritualité et les projets futurs.",
      descriptionEn: "Ascending Flow (Koun -> Sky): Energy rises from earth to heights. Ideal for renown, spirituality, and future ventures.",
      descriptionHa: "Karfi na Hauwa Sama (Koun -> Samaniya): Karfi yana hawa sama. Yana da kyau domin daukaka da sabon shiri.",
    };
  } else if (r1 === 2 && r3 === 1) {
    return {
      type: "descending",
      descriptionFr: "Flux Descendant (Sen -> Terre) : L'énergie s'enracine profondément. Parfait pour la concrétisation matérielle, l'achat immobilier et la protection.",
      descriptionEn: "Descending Flow (Sen -> Earth): Energy roots deeply. Perfect for material realization, real estate, and protection.",
      descriptionHa: "Karfi na Sauka Kasa (Sen -> Kasa): Karfi yana tabbata a kasa. Yana da kyau domin ginin gida da neman dukiya.",
    };
  } else {
    return {
      type: "balanced",
      descriptionFr: "Flux Équilibré (Mizan Parfait) : Alignement parfait entre le ciel et la terre. Stabilité absolue pour toute négociation.",
      descriptionEn: "Balanced Flow (Perfect Mizan): Perfect alignment between sky and earth. Absolute stability for all negotiations.",
      descriptionHa: "Karfi mai Daidaito (Mizan): Daidaito tsakanin samaniya da kasa. Tabbaci ga kowane irin magana.",
    };
  }
}

/**
 * Determine Mandingue Timing Phase based on hour
 */
export function getCurrentMandingueTiming(date = new Date()): {
  phaseKey: "sogoma" | "teleKaraba" | "woula";
  phaseNameFr: string;
  phaseNameEn: string;
  phaseNameHa: string;
  hourRange: string;
  descriptionFr: string;
  descriptionEn: string;
  descriptionHa: string;
  rulerFr: string;
  rulerEn: string;
  rulerHa: string;
} {
  const h = date.getHours();

  if (h >= 5 && h < 11) {
    return {
      phaseKey: "sogoma",
      phaseNameFr: "Sogoma (Matin / Aube)",
      phaseNameEn: "Sogoma (Morning / Dawn)",
      phaseNameHa: "Sogoma (Asubahi)",
      hourRange: "05h00 - 11h00",
      descriptionFr: "Phase sacrée de l'ouverture des portes et du premier souffle. Favorable à la bénédiction des affaires et aux vœux.",
      descriptionEn: "Sacred phase of opening gates and first breath. Favorable for business blessings and wishes.",
      descriptionHa: "Lokaci mai tsarki na bude kofofin albarka da neman buqata.",
      rulerFr: "Soleil Naissant & Ange Gabriel (Jibril)",
      rulerEn: "Rising Sun & Angel Gabriel (Jibril)",
      rulerHa: "Rana mai Fitowa da Mala'ika Jibrilu",
    };
  } else if (h >= 11 && h < 16) {
    return {
      phaseKey: "teleKaraba",
      phaseNameFr: "Tele-Karaba (Midi / Zénith)",
      phaseNameEn: "Tele-Karaba (Midday / Zenith)",
      phaseNameHa: "Tele-Karaba (Tsakar Rana)",
      hourRange: "11h00 - 16h00",
      descriptionFr: "Phase du feu solaire maximal. Moment propice pour trancher les litiges, conquérir et imposer l'autorité.",
      descriptionEn: "Peak solar fire phase. Auspicious for resolving litigation, conquering, and asserting authority.",
      descriptionHa: "Tsakar rana mai karfin wuta. Yana da kyau domin warware shari'a da nuna iko.",
      rulerFr: "Feu Zénithal & Ange Michaël (Mikail)",
      rulerEn: "Zenithal Fire & Angel Michael (Mikail)",
      rulerHa: "Wutar Tsakar Rana da Mala'ika Mikailu",
    };
  } else {
    return {
      phaseKey: "woula",
      phaseNameFr: "Woula (Crépuscule / Soir)",
      phaseNameEn: "Woula (Dusk / Evening)",
      phaseNameHa: "Woula (Yammaci)",
      hourRange: "16h00 - 22h00",
      descriptionFr: "Phase d'apaisement des esprits et de retour à la terre. Recommandée pour les consultations de protection et de pardon.",
      descriptionEn: "Phase of calming spirits and returning to earth. Recommended for protection and forgiveness consultations.",
      descriptionHa: "Lokacin kwantar da hankali da neman gafara da kariya.",
      rulerFr: "Ombre Protectrice & Ange Raphaël (Israfil)",
      rulerEn: "Protective Shadow & Angel Raphael (Israfil)",
      rulerHa: "Inuwar Kariya da Mala'ika Israfilu",
    };
  }
}

/**
 * Celestial Solar Calculator for Mode Mystique Mandingue
 * Computes exact local solar position, astronomical sunrise, solar noon, and sunset
 */
export function getCelestialMandingueTiming(
  date = new Date(),
  lat: number,
  lon: number
): {
  phaseKey: "sogoma" | "teleKaraba" | "woula";
  phaseNameFr: string;
  phaseNameEn: string;
  phaseNameHa: string;
  hourRange: string;
  descriptionFr: string;
  descriptionEn: string;
  descriptionHa: string;
  rulerFr: string;
  rulerEn: string;
  rulerHa: string;
  solarElevationStr: string;
  solarAzimuthStr: string;
  sunriseTimeStr: string;
  solarNoonStr: string;
  sunsetTimeStr: string;
  isMystiqueActive: boolean;
} {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Solar Declination in radians
  const declinationRad = (-23.45 * Math.PI / 180) * Math.cos((2 * Math.PI / 365) * (dayOfYear + 10));

  // Equation of time approximation in minutes
  const b = (2 * Math.PI / 365) * (dayOfYear - 81);
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);

  // Local Time Offset from UTC in hours
  const timezoneOffsetHours = -date.getTimezoneOffset() / 60;

  // Solar Noon in local decimal hours
  const solarNoonDec = 12 + (timezoneOffsetHours - lon / 15) - eot / 60;

  // Hour Angle at Sunrise/Sunset
  const latRad = lat * Math.PI / 180;
  const cosH0 = -Math.tan(latRad) * Math.tan(declinationRad);

  let hourAngleDeg = 90;
  if (cosH0 <= -1) {
    hourAngleDeg = 180; // 24h day
  } else if (cosH0 >= 1) {
    hourAngleDeg = 0; // 0h day
  } else {
    hourAngleDeg = (Math.acos(cosH0) * 180) / Math.PI;
  }

  const hourAngleHours = hourAngleDeg / 15;
  const sunriseDec = solarNoonDec - hourAngleHours;
  const sunsetDec = solarNoonDec + hourAngleHours;

  const formatDecTime = (dec: number) => {
    let normalized = (dec % 24 + 24) % 24;
    const h = Math.floor(normalized);
    const m = Math.floor((normalized - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const currentDecHour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

  // Compute Instantaneous Solar Elevation
  const localSolarHourAngleDeg = (currentDecHour - solarNoonDec) * 15;
  const hourAngleRad = localSolarHourAngleDeg * Math.PI / 180;
  const sinElevation = Math.sin(latRad) * Math.sin(declinationRad) + Math.cos(latRad) * Math.cos(declinationRad) * Math.cos(hourAngleRad);
  const elevationDeg = Math.asin(Math.max(-1, Math.min(1, sinElevation))) * 180 / Math.PI;

  // Compute Solar Azimuth
  const cosAzimuth = (Math.sin(declinationRad) - Math.sin(latRad) * sinElevation) / (Math.cos(latRad) * Math.cos(Math.asin(sinElevation)) || 0.0001);
  let azimuthDeg = Math.acos(Math.max(-1, Math.min(1, cosAzimuth))) * 180 / Math.PI;
  if (Math.sin(hourAngleRad) > 0) {
    azimuthDeg = 360 - azimuthDeg;
  }

  const sunriseStr = formatDecTime(sunriseDec);
  const noonStr = formatDecTime(solarNoonDec);
  const sunsetStr = formatDecTime(sunsetDec);

  let phaseKey: "sogoma" | "teleKaraba" | "woula" = "woula";
  if (currentDecHour >= sunriseDec && currentDecHour < solarNoonDec) {
    phaseKey = "sogoma";
  } else if (currentDecHour >= solarNoonDec && currentDecHour < sunsetDec) {
    phaseKey = "teleKaraba";
  } else {
    phaseKey = "woula";
  }

  const elevSign = elevationDeg >= 0 ? "+" : "";
  const solarElevationStr = `${elevSign}${elevationDeg.toFixed(1)}°`;
  const solarAzimuthStr = `${azimuthDeg.toFixed(1)}°`;

  if (phaseKey === "sogoma") {
    return {
      phaseKey: "sogoma",
      phaseNameFr: "Sogoma (Matin Céleste / Aube Solaire)",
      phaseNameEn: "Sogoma (Celestial Morning / Solar Dawn)",
      phaseNameHa: "Sogoma (Asubahi na Samaniya)",
      hourRange: `${sunriseStr} - ${noonStr}`,
      descriptionFr: `Phase d'ascension solaire (Lever: ${sunriseStr}, Zénith: ${noonStr}). Alignement précis sur les énergies d'ouverture matinale.`,
      descriptionEn: `Solar ascension phase (Sunrise: ${sunriseStr}, Zenith: ${noonStr}). Precise alignment with morning opening energies.`,
      descriptionHa: `Lokaci mai albarka na ascendant na rana (Fitowa: ${sunriseStr}, Tsakar Rana: ${noonStr}).`,
      rulerFr: "Soleil Naissant & Ange Gabriel (Jibril)",
      rulerEn: "Rising Sun & Angel Gabriel (Jibril)",
      rulerHa: "Rana mai Fitowa da Mala'ika Jibrilu",
      solarElevationStr,
      solarAzimuthStr,
      sunriseTimeStr: sunriseStr,
      solarNoonStr: noonStr,
      sunsetTimeStr: sunsetStr,
      isMystiqueActive: true,
    };
  } else if (phaseKey === "teleKaraba") {
    return {
      phaseKey: "teleKaraba",
      phaseNameFr: "Tele-Karaba (Zénith Céleste / Feu Solaire)",
      phaseNameEn: "Tele-Karaba (Celestial Zenith / Solar Fire)",
      phaseNameHa: "Tele-Karaba (Tsakar Rana na Samaniya)",
      hourRange: `${noonStr} - ${sunsetStr}`,
      descriptionFr: `Phase de culmination et d'action martiale (Zénith: ${noonStr}, Coucher: ${sunsetStr}). Puissance maximale de tranchant.`,
      descriptionEn: `Culmination and action phase (Zenith: ${noonStr}, Sunset: ${sunsetStr}). Peak cutting power.`,
      descriptionHa: `Lokaci na tsakar rana mai karfi (Tsakar Rana: ${noonStr}, Faɗuwa: ${sunsetStr}).`,
      rulerFr: "Feu Zénithal & Ange Michaël (Mikail)",
      rulerEn: "Zenithal Fire & Angel Michael (Mikail)",
      rulerHa: "Wutar Tsakar Rana da Mala'ika Mikailu",
      solarElevationStr,
      solarAzimuthStr,
      sunriseTimeStr: sunriseStr,
      solarNoonStr: noonStr,
      sunsetTimeStr: sunsetStr,
      isMystiqueActive: true,
    };
  } else {
    return {
      phaseKey: "woula",
      phaseNameFr: "Woula (Crépuscule Céleste / Ombre Protectrice)",
      phaseNameEn: "Woula (Celestial Dusk / Protective Shadow)",
      phaseNameHa: "Woula (Yammaci na Samaniya)",
      hourRange: `${sunsetStr} - ${sunriseStr}`,
      descriptionFr: `Phase crépusculaire et nocturne (Coucher: ${sunsetStr}, Aube Prochaine: ${sunriseStr}). Protection et ancrage profond.`,
      descriptionEn: `Dusk and nighttime phase (Sunset: ${sunsetStr}, Next Dawn: ${sunriseStr}). Deep protection and grounding.`,
      descriptionHa: `Lokaci na yammaci da dare (Faɗuwa: ${sunsetStr}, Asubahi: ${sunriseStr}).`,
      rulerFr: "Ombre Protectrice & Ange Raphaël (Israfil)",
      rulerEn: "Protective Shadow & Angel Raphael (Israfil)",
      rulerHa: "Inuwar Kariya da Mala'ika Israfilu",
      solarElevationStr,
      solarAzimuthStr,
      sunriseTimeStr: sunriseStr,
      solarNoonStr: noonStr,
      sunsetTimeStr: sunsetStr,
      isMystiqueActive: true,
    };
  }
}
