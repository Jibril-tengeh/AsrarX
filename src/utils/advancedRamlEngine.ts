export interface RamlFigure {
  id: string;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  nameAr: string;
  lines: [number, number, number, number]; // 1 = single dot, 2 = double dots
  element: 'fire' | 'air' | 'water' | 'earth';
  elementAr: string;
  planet: string;
  meaningFr: string;
  meaningEn: string;
  meaningHa: string;
}

export const RAML_FIGURES: RamlFigure[] = [
  {
    id: 'tariq',
    nameFr: 'Al-Tariq (Le Chemin)',
    nameEn: 'Al-Tariq (The Path)',
    nameHa: 'Al-Tariq (Hanya)',
    nameAr: 'الطريق',
    lines: [1, 1, 1, 1],
    element: 'water',
    elementAr: 'ماء',
    planet: 'Lune (Qamar)',
    meaningFr: 'Voyage, mouvement, fluidité, évolution rapide',
    meaningEn: 'Journey, movement, fluidity, rapid evolution',
    meaningHa: 'Tafiya, motsi, samun hanya cikin sauki',
  },
  {
    id: 'kousaj',
    nameFr: 'Al-Kousaj (Le Seuil / Jaune)',
    nameEn: 'Al-Kousaj (The Threshold)',
    nameHa: 'Al-Kousaj (Kofar Shiga)',
    nameAr: 'الكوسج',
    lines: [1, 2, 2, 1],
    element: 'earth',
    elementAr: 'تراب',
    planet: 'Mercure (Utarid)',
    meaningFr: 'Intelligence pratique, négociation, transition',
    meaningEn: 'Practical intelligence, negotiation, transition',
    meaningHa: 'Tunanin hankali, cinikayya, canjin yanayi',
  },
  {
    id: 'humra',
    nameFr: 'Al-Humra (Le Rouge)',
    nameEn: 'Al-Humra (The Redness)',
    nameHa: 'Al-Humra (Jaja)',
    nameAr: 'الحمرة',
    lines: [2, 1, 2, 2],
    element: 'fire',
    elementAr: 'نار',
    planet: 'Mars (Mirrikh)',
    meaningFr: 'Passions, énergie brute, conflit potentiel, courage',
    meaningEn: 'Passions, raw energy, potential conflict, courage',
    meaningHa: 'Zafi, nuna karfi, yaki, gaba da jajircewa',
  },
  {
    id: 'bayad',
    nameFr: 'Al-Bayad (Le Blanc)',
    nameEn: 'Al-Bayad (The Whiteness)',
    nameHa: 'Al-Bayad (Farara)',
    nameAr: 'البياض',
    lines: [2, 2, 1, 2],
    element: 'water',
    elementAr: 'ماء',
    planet: 'Vénus (Zuhara)',
    meaningFr: 'Paix, sérénité, pureté des intentions, harmonie',
    meaningEn: 'Peace, serenity, purity of intentions, harmony',
    meaningHa: 'Lafiya, kwanciyar hankali, tsarki da kauna',
  },
  {
    id: 'nusra_kharija',
    nameFr: 'Nusra Kharija (Victoire Extérieure)',
    nameEn: 'Nusra Kharija (Outward Victory)',
    nameHa: 'Nusra Kharija (Nasara ta Waje)',
    nameAr: 'النصرة الخارجة',
    lines: [2, 2, 1, 1],
    element: 'fire',
    elementAr: 'نار',
    planet: 'Soleil (Shams)',
    meaningFr: 'Succès visible, expansion, honneur public',
    meaningEn: 'Visible success, expansion, public honor',
    meaningHa: 'Nasara ta fili, daukaka, daukaka ga jama’a',
  },
  {
    id: 'nusra_dakhila',
    nameFr: 'Nusra Dakhila (Victoire Intérieure)',
    nameEn: 'Nusra Dakhila (Inward Victory)',
    nameHa: 'Nusra Dakhila (Nasara ta Ciki)',
    nameAr: 'النصرة الداخلة',
    lines: [1, 1, 2, 2],
    element: 'earth',
    elementAr: 'تراب',
    planet: 'Jupiter (Mushtari)',
    meaningFr: 'Gain durable, paix intérieure, réalisation spirituelle',
    meaningEn: 'Durable gain, inner peace, spiritual realization',
    meaningHa: 'Nasara ta ciki, dorewar arziki da aminci',
  },
  {
    id: 'utaba_kharija',
    nameFr: 'Utaba Kharija (Seuil Extérieur)',
    nameEn: 'Utaba Kharija (Outward Threshold)',
    nameHa: 'Utaba Kharija (Kofar Waje)',
    nameAr: 'العتبة الخارجة',
    lines: [1, 2, 2, 2],
    element: 'air',
    elementAr: 'هواء',
    planet: 'Saturne (Zuhal)',
    meaningFr: 'Dépense, sortie de crise, fin d’un cycle dur',
    meaningEn: 'Expense, exit from crisis, end of a hard cycle',
    meaningHa: 'Kewayawar matsala, fita daga kunci',
  },
  {
    id: 'utaba_dakhila',
    nameFr: 'Utaba Dakhila (Seuil Intérieur)',
    nameEn: 'Utaba Dakhila (Inward Threshold)',
    nameHa: 'Utaba Dakhila (Kofar Ciki)',
    nameAr: 'العتبة الداخلة',
    lines: [2, 2, 2, 1],
    element: 'earth',
    elementAr: 'تراب',
    planet: 'Lune (Qamar)',
    meaningFr: 'Stabilisation, préservation, accueil favorable',
    meaningEn: 'Stabilization, preservation, favorable reception',
    meaningHa: 'Natsuwa, kariya, samun kyakkyawan maraba',
  },
  {
    id: 'qabd_kharij',
    nameFr: 'Qabd Kharij (Prise Extérieure)',
    nameEn: 'Qabd Kharij (Outward Possession)',
    nameHa: 'Qabd Kharij (Rike na Waje)',
    nameAr: 'القبض الخارج',
    lines: [1, 2, 1, 2],
    element: 'air',
    elementAr: 'هواء',
    planet: 'Soleil (Shams)',
    meaningFr: 'Libération de dette, perte temporaire puis gain',
    meaningEn: 'Debt release, temporary loss followed by gain',
    meaningHa: 'Biyan bashi, asara ta dan lokaci sannan samu',
  },
  {
    id: 'qabd_dakhil',
    nameFr: 'Qabd Dakhil (Prise Intérieure)',
    nameEn: 'Qabd Dakhil (Inward Possession)',
    nameHa: 'Qabd Dakhil (Rike na Ciki)',
    nameAr: 'القبض الداخل',
    lines: [2, 1, 2, 1],
    element: 'fire',
    elementAr: 'نار',
    planet: 'Jupiter (Mushtari)',
    meaningFr: 'Acquisition ferme, épargne, conservation des biens',
    meaningEn: 'Firm acquisition, savings, property retention',
    meaningHa: 'Karbar abu da karfi, ajiyar dukiya mai ma\'ana',
  },
  {
    id: 'jamaa',
    nameFr: 'Al-Jama\'a (L\'Assemblée)',
    nameEn: 'Al-Jama\'a (The Congregation)',
    nameHa: 'Al-Jama\'a (Taro)',
    nameAr: 'الجماعة',
    lines: [2, 2, 2, 2],
    element: 'air',
    elementAr: 'هواء',
    planet: 'Mercure (Utarid)',
    meaningFr: 'Reunion, réseau social, alliance, synergie collective',
    meaningEn: 'Reunion, social network, alliance, collective synergy',
    meaningHa: 'Taron mutane, kawance, zumunci da hadin kai',
  },
  {
    id: 'uqla',
    nameFr: 'Al-Uqla (Le Nœud / Lien)',
    nameEn: 'Al-Uqla (The Lock)',
    nameHa: 'Al-Uqla (Kulli)',
    nameAr: 'العقلة',
    lines: [2, 1, 1, 2],
    element: 'earth',
    elementAr: 'تراب',
    planet: 'Saturne (Zuhal)',
    meaningFr: 'Blocage, fermeture, concentration intense, secret',
    meaningEn: 'Blockage, lock, intense focus, secrecy',
    meaningHa: 'Kulli, kulle, takura da adana sirri',
  },
  {
    id: 'inkis',
    nameFr: 'Al-Inkis (Le Renversement)',
    nameEn: 'Al-Inkis (The Reversal)',
    nameHa: 'Al-Inkis (Juya)',
    nameAr: 'الإنكيس',
    lines: [2, 2, 2, 1], // variant represented symbolically
    element: 'earth',
    elementAr: 'تراب',
    planet: 'Saturne (Zuhal)',
    meaningFr: 'Prudence, réorientation, retard nécessaire',
    meaningEn: 'Prudence, reorientation, necessary delay',
    meaningHa: 'Kare kai, jinkiri mai kyau, sake tsara fasali',
  },
  {
    id: 'naqi_khadd',
    nameFr: 'Naqi al-Khadd (Joues Pures)',
    nameEn: 'Naqi al-Khadd (Pure Cheek)',
    nameHa: 'Naqi al-Khadd (Fuska Mai Tsarki)',
    nameAr: 'نقي الخد',
    lines: [1, 1, 2, 1],
    element: 'air',
    elementAr: 'هواء',
    planet: 'Vénus (Zuhara)',
    meaningFr: 'Beauté, inspiration, bonne nouvelle, douceur',
    meaningEn: 'Beauty, inspiration, good news, gentleness',
    meaningHa: 'Kyau, albishir, taushi da kyakkyawar lafiya',
  },
  {
    id: 'dahik',
    nameFr: 'Al-Dahik (Le Rieur)',
    nameEn: 'Al-Dahik (The Laugher)',
    nameHa: 'Al-Dahik (Mai Dariya)',
    nameAr: 'الضاحك',
    lines: [1, 2, 1, 1],
    element: 'fire',
    elementAr: 'نار',
    planet: 'Jupiter (Mushtari)',
    meaningFr: 'Joie, festivités, optimisme, solution lumineuse',
    meaningEn: 'Joy, festivities, optimism, luminous solution',
    meaningHa: 'Murna, biki, kyakkyawan zato da haske',
  },
  {
    id: 'rayah',
    nameFr: 'Al-Rayah / Mizan (L\'Étendard)',
    nameEn: 'Al-Rayah / Mizan (The Banner)',
    nameHa: 'Al-Rayah (Tuta / Sikel)',
    nameAr: 'الراية',
    lines: [1, 1, 1, 2],
    element: 'water',
    elementAr: 'ماء',
    planet: 'Lune (Qamar)',
    meaningFr: 'Équilibre final, arbitrage, autorité morale',
    meaningEn: 'Final balance, arbitration, moral authority',
    meaningHa: 'Daidaito na karshe, adalci da karfin mulki',
  },
];

export interface HouseInfo {
  houseNumber: number;
  houseNameAr: string;
  domainFr: string;
  domainEn: string;
  domainHa: string;
  figure: RamlFigure;
}

// Combine 2 figures modulo 2 (Line by line: 1+1=2, 2+2=2, 1+2=1, 2+1=1)
export function addLinesModulo2(f1: RamlFigure, f2: RamlFigure): RamlFigure {
  const newLines: [number, number, number, number] = [
    f1.lines[0] === f2.lines[0] ? 2 : 1,
    f1.lines[1] === f2.lines[1] ? 2 : 1,
    f1.lines[2] === f2.lines[2] ? 2 : 1,
    f1.lines[3] === f2.lines[3] ? 2 : 1,
  ];

  const matched = RAML_FIGURES.find(
    (f) =>
      f.lines[0] === newLines[0] &&
      f.lines[1] === newLines[1] &&
      f.lines[2] === newLines[2] &&
      f.lines[3] === newLines[3]
  );

  return matched || RAML_FIGURES[0];
}

// Generate full 16 houses chart from 4 mothers
export function generateFull16Houses(mothers: [RamlFigure, RamlFigure, RamlFigure, RamlFigure]): HouseInfo[] {
  const [m1, m2, m3, m4] = mothers;

  // Daughters (B1..B4): Lines extracted across mothers
  const b1Lines: [number, number, number, number] = [m1.lines[0], m2.lines[0], m3.lines[0], m4.lines[0]];
  const b2Lines: [number, number, number, number] = [m1.lines[1], m2.lines[1], m3.lines[1], m4.lines[1]];
  const b3Lines: [number, number, number, number] = [m1.lines[2], m2.lines[2], m3.lines[2], m4.lines[2]];
  const b4Lines: [number, number, number, number] = [m1.lines[3], m2.lines[3], m3.lines[3], m4.lines[3]];

  const findFigByLines = (lines: [number, number, number, number]) =>
    RAML_FIGURES.find(
      (f) =>
        f.lines[0] === lines[0] &&
        f.lines[1] === lines[1] &&
        f.lines[2] === lines[2] &&
        f.lines[3] === lines[3]
    ) || RAML_FIGURES[0];

  const b1 = findFigByLines(b1Lines);
  const b2 = findFigByLines(b2Lines);
  const b3 = findFigByLines(b3Lines);
  const b4 = findFigByLines(b4Lines);

  // Nephews (Z1..Z4)
  const z1 = addLinesModulo2(m1, m2);
  const z2 = addLinesModulo2(m3, m4);
  const z3 = addLinesModulo2(b1, b2);
  const z4 = addLinesModulo2(b3, b4);

  // Witnesses (W1..W2)
  const w1 = addLinesModulo2(z1, z2);
  const w2 = addLinesModulo2(z3, z4);

  // Judge (H15)
  const h15 = addLinesModulo2(w1, w2);

  // Outcome (H16)
  const h16 = addLinesModulo2(h15, m1);

  const houseDomains = [
    { ar: 'النفس', fr: 'L\'Ame, le Consultant, la Santé', en: 'The Self, Consultant, Health', ha: 'Rai, Mai Bincike, Lafiya' },
    { ar: 'المال', fr: 'Les Biens, la Fortune, le Gain', en: 'Wealth, Assets, Gain', ha: 'Dukiya, Samun Kudi' },
    { ar: 'الإخوة', fr: 'Les Frères, Entourage, Proches', en: 'Siblings, Relatives, Entourage', ha: '\'Yan Uwa, Abokan Tattaki' },
    { ar: 'الآباء', fr: 'Les Parents, le Foyer, l\'Héritage', en: 'Parents, Home, Heritage', ha: 'Iyayen Fari, Gida, Gada' },
    { ar: 'الأولاد', fr: 'Les Enfants, la Joie, la Création', en: 'Children, Joy, Creation', ha: 'Yara, Murna, Halitta' },
    { ar: 'المرض', fr: 'La Maladie, les Serviteurs, les Kains', en: 'Sickness, Servants, Obstacles', ha: 'Cuta, Masu Taimako, Kunci' },
    { ar: 'الزوج', fr: 'Le Conjoint, l\'Associé, le Rival', en: 'Spouse, Partner, Rival', ha: 'Abokin Aure, Abokin Kasuwanci' },
    { ar: 'الموت', fr: 'La Transformation, la Dette, la Peur', en: 'Transformation, Debt, Fear', ha: 'Canjin Rayuwa, Bashi, Tsoro' },
    { ar: 'السفر', fr: 'Le Voyage, la Science, la Spiritualité', en: 'Travel, Knowledge, Spirituality', ha: 'Tafiya, Ilimi, Ruhani' },
    { ar: 'العز', fr: 'Le Pouvoir, la Profession, l\'Honneur', en: 'Power, Profession, Honor', ha: 'Mulki, Aiki, Daukaka' },
    { ar: 'الرجاء', fr: 'Les Espoirs, les Amis, les Souhaits', en: 'Hopes, Friends, Wishes', ha: 'Fatan Alheri, Abokan Arziki' },
    { ar: 'الأعداء', fr: 'Les Épreuves, les Ennemis Cachés', en: 'Trials, Hidden Enemies', ha: 'Jarabawa, Makiyan Boye' },
    { ar: 'السائل', fr: 'Témoin de Droite (Le Présent)', en: 'Right Witness (The Present)', ha: 'Shaidar Dama (Ahalin Yanzu)' },
    { ar: 'المسؤول', fr: 'Témoin de Gauche (Le Futur)', en: 'Left Witness (The Future)', ha: 'Shaidar Hagu (Ahalin Gaba)' },
    { ar: 'القاضي', fr: 'Le Juge (L\'Arbitrage du Thème)', en: 'The Judge (Chart Arbitration)', ha: 'Alkali (Hukuncin Karshe)' },
    { ar: 'عاقبة العاقبة', fr: 'L\'Issue Ultime & Synthèse Finale', en: 'Ultimate Outcome & Final Synthesis', ha: 'Karshen Alamura da Sakamako' },
  ];

  const figuresArr = [m1, m2, m3, m4, b1, b2, b3, b4, z1, z2, z3, z4, w1, w2, h15, h16];

  return figuresArr.map((fig, idx) => ({
    houseNumber: idx + 1,
    houseNameAr: houseDomains[idx].ar,
    domainFr: houseDomains[idx].fr,
    domainEn: houseDomains[idx].en,
    domainHa: houseDomains[idx].ha,
    figure: fig,
  }));
}

// Sa'at al-Tacht: Planetary Hours and Stability Calculation
export interface HourlySlot {
  hourIndex: number; // 1 to 12
  timeRange: string;
  rulerFr: string;
  rulerEn: string;
  rulerHa: string;
  rulerAr: string;
  stabilityScore: number; // 0 to 100
  status: 'stable' | 'neutral' | 'unstable';
}

export function calculateSaatTacht(
  dayIndex: number, // 0 = Sunday .. 6 = Saturday
  operatorElement: 'fire' | 'air' | 'water' | 'earth',
  intention: string
): {
  bestSlot: HourlySlot;
  hourlySlots: HourlySlot[];
  direction: string;
} {
  const rulers = [
    { ar: 'الشمس', fr: 'Soleil (Lumière & Clarté)', en: 'Sun (Light & Clarity)', ha: 'Rana (Haske da Bayyanawa)' },
    { ar: 'Zuhara', fr: 'Vénus (Harmonie & Douceur)', en: 'Venus (Harmony & Softness)', ha: 'Vénus (Salama da Kauna)' },
    { ar: 'Utarid', fr: 'Mercure (Calcul & Écritures)', en: 'Mercury (Calculations & Scripts)', ha: 'Mercure (Lissafi da Rubutu)' },
    { ar: 'Qamar', fr: 'Lune (Fluide & Réception)', en: 'Moon (Fluidity & Reception)', ha: 'Wata (Gudanarwa da Karba)' },
    { ar: 'Zuhal', fr: 'Saturne (Rigueur & Stabilité)', en: 'Saturn (Rigor & Stability)', ha: 'Saturne (Natsuwa da Karfi)' },
    { ar: 'Mushtari', fr: 'Jupiter (Expansion & Grace)', en: 'Jupiter (Expansion & Grace)', ha: 'Jupiter (Bunkasa da Albarka)' },
    { ar: 'Mirrikh', fr: 'Mars (Action & Énergie)', en: 'Mars (Action & Energy)', ha: 'Mars (Motsi da Karfi)' },
  ];

  // Chaldean order sequence per day
  const dayStartRulerIndex = [0, 3, 6, 2, 5, 1, 4][dayIndex];

  const hourlySlots: HourlySlot[] = [];

  for (let i = 0; i < 12; i++) {
    const rulerObj = rulers[(dayStartRulerIndex + i) % 7];
    let score = 60 + ((i * 7 + dayIndex * 13) % 35);

    // Intentions / Element Boosts
    if (operatorElement === 'fire' && (rulerObj.fr.includes('Soleil') || rulerObj.fr.includes('Jupiter'))) score += 15;
    if (operatorElement === 'earth' && (rulerObj.fr.includes('Saturne') || rulerObj.fr.includes('Mercure'))) score += 15;
    if (operatorElement === 'water' && (rulerObj.fr.includes('Lune') || rulerObj.fr.includes('Vénus'))) score += 15;
    if (operatorElement === 'air' && (rulerObj.fr.includes('Mercure') || rulerObj.fr.includes('Soleil'))) score += 15;

    score = Math.min(98, Math.max(40, score));

    const startH = 6 + i;
    const timeRange = `${startH < 10 ? '0' : ''}${startH}:00 - ${startH + 1 < 10 ? '0' : ''}${startH + 1}:00`;

    let status: 'stable' | 'neutral' | 'unstable' = 'neutral';
    if (score >= 82) status = 'stable';
    else if (score < 60) status = 'unstable';

    hourlySlots.push({
      hourIndex: i + 1,
      timeRange,
      rulerFr: rulerObj.fr,
      rulerEn: rulerObj.en,
      rulerHa: rulerObj.ha,
      rulerAr: rulerObj.ar,
      stabilityScore: score,
      status,
    });
  }

  // Find highest stability slot
  const sorted = [...hourlySlots].sort((a, b) => b.stabilityScore - a.stabilityScore);
  const bestSlot = sorted[0];

  const directions = [
    'Est (Qibla / Al-Mashriq)',
    'Nord (Al-Shamal - Calme)',
    'Sud (Al-Janub - Énergie)',
    'Ouest (Al-Maghrib - Réception)',
  ];
  const direction = directions[(dayIndex + bestSlot.hourIndex) % 4];

  return { bestSlot, hourlySlots, direction };
}

// Tafshee (Repeated Figures & Blockage Analysis)
export interface RedundancyItem {
  figure: RamlFigure;
  count: number;
  houses: number[];
  axesFr: string;
  axesEn: string;
  axesHa: string;
  remedyFr: string;
  remedyEn: string;
  remedyHa: string;
}

export function analyzeTafshee(houses: HouseInfo[]): {
  redundancies: RedundancyItem[];
  overallStatus: 'noRedundancy' | 'moderateRedundancy' | 'severeRedundancy';
  blockageSummaryFr: string;
  blockageSummaryEn: string;
  blockageSummaryHa: string;
} {
  const countMap: Record<string, number[]> = {};

  houses.forEach((h) => {
    const id = h.figure.id;
    if (!countMap[id]) countMap[id] = [];
    countMap[id].push(h.houseNumber);
  });

  const redundancies: RedundancyItem[] = [];

  Object.keys(countMap).forEach((id) => {
    const houseNums = countMap[id];
    if (houseNums.length >= 2) {
      const fig = RAML_FIGURES.find((f) => f.id === id)!;

      // Determine interaction axes based on house numbers
      let axesFr = `Alignement sur les Maisons ${houseNums.join(', ')}`;
      let axesEn = `Alignment on Houses ${houseNums.join(', ')}`;
      let axesHa = `Hadin gwiwa a Gidaje ${houseNums.join(', ')}`;

      if (houseNums.includes(1) && houseNums.includes(7)) {
        axesFr = 'Axe Consultant (M1) ↔ Conjoint / Rival (M7) : Projection personnelle ou duel';
        axesEn = 'Consultant Axis (H1) ↔ Partner / Rival (H7): Personal projection or duel';
        axesHa = 'Tsakanin Mai Bincike (G1) ↔ Abokin Aure (G7): Fitowar matsalar kanta';
      } else if (houseNums.includes(2) && houseNums.includes(8)) {
        axesFr = 'Axe Biens (M2) ↔ Dette / Perte (M8) : Blocage financier ou stagne de dukiya';
        axesEn = 'Assets Axis (H2) ↔ Debt / Loss (H8): Financial blockage or asset stagnation';
        axesHa = 'Tsakanin Dukiya (G2) ↔ Bashi / Kunci (G8): Tsayawar kasuwanci da dukiya';
      } else if (houseNums.includes(1) && houseNums.includes(12)) {
        axesFr = 'Axe Soi (M1) ↔ Épreuves / Ennemis (M12) : Pression psychologique ou blocage interne';
        axesEn = 'Self Axis (H1) ↔ Trials / Enemies (H12): Psychological pressure or inner block';
        axesHa = 'Tsakanin Kai (G1) ↔ Makiyan Boye (G12): Matsalar takura na tunani';
      }

      // Elementary remedies
      let remedyFr = 'Réciter la Surah Al-Inshirah (94) 7 fois et faire l’ablution à l’eau de rose.';
      let remedyEn = 'Recite Surah Al-Inshirah (94) 7 times and perform ablution with rose water.';
      let remedyHa = 'Karanta Surah Al-Inshirah (94) sau 7 tare da shafa ruwan marawardi.';

      if (fig.element === 'fire') {
        remedyFr = 'Dissoudre l’écriture de Ayat al-Kursi dans l’eau froide et vaporiser le lieu.';
        remedyEn = 'Dissolve Ayat al-Kursi writing in cold water and spray the room.';
        remedyHa = 'Rene rubutun Ayat al-Kursi a ruwan sanyi sannan ka yayafa a daki.';
      } else if (fig.element === 'earth') {
        remedyFr = 'Brûler de l’encens de Louban Jawi et réciter Ya Latif 129 fois.';
        remedyEn = 'Burn Frankincense (Luban) and recite Ya Latif 129 times.';
        remedyHa = 'Kona turaren luban jawi sannan ka karanta Ya Latif sau 129.';
      }

      redundancies.push({
        figure: fig,
        count: houseNums.length,
        houses: houseNums,
        axesFr,
        axesEn,
        axesHa,
        remedyFr,
        remedyEn,
        remedyHa,
      });
    }
  });

  const maxCount = Math.max(0, ...redundancies.map((r) => r.count));

  let overallStatus: 'noRedundancy' | 'moderateRedundancy' | 'severeRedundancy' = 'noRedundancy';
  let blockageSummaryFr = 'Le thème présente une circulation fluide des énergies sans nœud majeur.';
  let blockageSummaryEn = 'The chart presents a fluid energy circulation with no major knots.';
  let blockageSummaryHa = 'Taswirar tana tafiya lafiya ba tare da wani babban kulli ba.';

  if (maxCount >= 4) {
    overallStatus = 'severeRedundancy';
    blockageSummaryFr = `Nœud Majeur (Uqda Al-Kabira) : La figure "${redundancies[0]?.figure.nameFr}" se répète ${maxCount} fois, signalant une obsession ou un frein systémique.`;
    blockageSummaryEn = `Major Knot (Uqda Al-Kabira): The figure "${redundancies[0]?.figure.nameEn}" repeats ${maxCount} times, signaling an obsession or systemic blockage.`;
    blockageSummaryHa = `Babban Kulli (Uqda Al-Kabira): Alamar "${redundancies[0]?.figure.nameHa}" ta maimaita sau ${maxCount}, tana nuna matsi mai karfi.`;
  } else if (maxCount >= 2) {
    overallStatus = 'moderateRedundancy';
    blockageSummaryFr = `Répétition Focalisée : ${redundancies.length} figure(s) apparaissent plusieurs fois. L’énergie du thème se concentre sur des domaines spécifiques.`;
    blockageSummaryEn = `Focused Repetition: ${redundancies.length} figure(s) appear multiple times. Chart energy focuses on specific domains.`;
    blockageSummaryHa = `Maimaituwa Matsakaiciya: Alamomi ${redundancies.length} sun bayyana sau da yawa. Karfin taswirar yana kan takamaiman bangarori.`;
  }

  return {
    redundancies,
    overallStatus,
    blockageSummaryFr,
    blockageSummaryEn,
    blockageSummaryHa,
  };
}
