// Comprehensive Geomancy Traditions Data & Calculation Engines
// 1. Classical Arabic Geomancy (Damir, Tashteed, Mizan al-Anasir, Mizan al-Mizan, Inqilab)
// 2. Maghrebi Geomancy (Dairat as-Souss, Mizan al-Gharb, Khatam Zanati, Voyage Saharien, Jiwar)
// 3. African Geomancy (Opele Ifa, Opon Ifa, Amulu Odus 256, Sikidy Malgache, Ebo, Hakata Shona, Sikidy Rano, Odu Ori)

export interface Geomantic16Figure {
  id: string;
  code: string; // e.g. "1-1-1-1"
  dots: [number, number, number, number]; // [Fire, Air, Water, Earth] (1 = single dot, 2 = double dots)
  nameAr: string;
  namePhonetic: string;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  element: 'fire' | 'air' | 'water' | 'earth';
  nature: 'dakhil' | 'kharij' | 'munqalib' | 'thabit'; // Entering, Exiting, Mutating, Stationary
  rulingPlanetAr: string;
  rulingPlanetFr: string;
  rulingPlanetEn: string;
  rulingPlanetHa: string;
  zodiacSign: string;
  abjadVal: number;
  ifaName: string;
  sikidyName: string;
  soussMonthBerber: string;
  soussSeason: string;
}

export const CLASSICAL_16_FIGURES: Geomantic16Figure[] = [
  {
    id: 'tariq',
    code: '1-1-1-1',
    dots: [1, 1, 1, 1],
    nameAr: 'الطريق',
    namePhonetic: 'At-Tarīq',
    nameFr: 'La Voie (Via)',
    nameEn: 'The Way (Via)',
    nameHa: 'Hanya (Via)',
    element: 'water',
    nature: 'munqalib',
    rulingPlanetAr: 'القمر (Al-Qamar)',
    rulingPlanetFr: 'Lune',
    rulingPlanetEn: 'Moon',
    rulingPlanetHa: 'Wata',
    zodiacSign: 'Cancer (Al-Saratan)',
    abjadVal: 4,
    ifaName: 'Owonrin Meji',
    sikidyName: 'Taraiky / Yissourou',
    soussMonthBerber: 'Yennayer (Janvier)',
    soussSeason: 'Hiver (Tagrest)'
  },
  {
    id: 'jamaa',
    code: '2-2-2-2',
    dots: [2, 2, 2, 2],
    nameAr: 'الجماعة',
    namePhonetic: "Al-Jamā'ah",
    nameFr: "L'Assemblée (Populus)",
    nameEn: 'The Assembly (Populus)',
    nameHa: "Taron Jama'a (Populus)",
    element: 'water',
    nature: 'thabit',
    rulingPlanetAr: 'القمر (Al-Qamar)',
    rulingPlanetFr: 'Lune',
    rulingPlanetEn: 'Moon',
    rulingPlanetHa: 'Wata',
    zodiacSign: 'Capricorne (Al-Jady)',
    abjadVal: 8,
    ifaName: 'Oyeku Meji',
    sikidyName: 'Asombola / Jamana',
    soussMonthBerber: 'Furar (Février)',
    soussSeason: 'Hiver (Tagrest)'
  },
  {
    id: 'lahyan',
    code: '1-2-2-1',
    dots: [1, 2, 2, 1],
    nameAr: 'اللحية الخارجة',
    namePhonetic: 'Al-Liḥyah al-Khārijah',
    nameFr: 'Barbe Rousse (Caput Draconis)',
    nameEn: "Head of Dragon / Beard",
    nameHa: 'Garin Shugaba (Caput)',
    element: 'fire',
    nature: 'kharij',
    rulingPlanetAr: 'المشتري (Al-Mushtari)',
    rulingPlanetFr: 'Jupiter',
    rulingPlanetEn: 'Jupiter',
    rulingPlanetHa: 'Mushtari',
    zodiacSign: 'Sagittaire (Al-Qaws)',
    abjadVal: 6,
    ifaName: 'Ogbe Meji',
    sikidyName: 'Adabara / Lahana',
    soussMonthBerber: 'Maghres (Mars)',
    soussSeason: 'Printemps (Tafsut)'
  },
  {
    id: 'bayad',
    code: '2-2-1-2',
    dots: [2, 2, 1, 2],
    nameAr: 'البياض',
    namePhonetic: 'Al-Bayāḍ',
    nameFr: 'La Blancheur (Albus)',
    nameEn: 'The Whiteness (Albus)',
    nameHa: 'Fari Tsarki (Albus)',
    element: 'water',
    nature: 'dakhil',
    rulingPlanetAr: 'الزهرة (Al-Zuharah)',
    rulingPlanetFr: 'Vénus',
    rulingPlanetEn: 'Venus',
    rulingPlanetHa: 'Zuhra',
    zodiacSign: 'Gémeaux (Al-Jawza)',
    abjadVal: 7,
    ifaName: 'Iwori Meji',
    sikidyName: 'Alibiavo / Bayadi',
    soussMonthBerber: 'Ibrir (Avril)',
    soussSeason: 'Printemps (Tafsut)'
  },
  {
    id: 'humra',
    code: '2-1-2-2',
    dots: [2, 1, 2, 2],
    nameAr: 'الحمرة',
    namePhonetic: 'Al-Ḥumrah',
    nameFr: 'La Rougeur (Rubeus)',
    nameEn: 'The Redness (Rubeus)',
    nameHa: 'Ja Karfi (Rubeus)',
    element: 'fire',
    nature: 'kharij',
    rulingPlanetAr: 'المريخ (Al-Mirrikh)',
    rulingPlanetFr: 'Mars',
    rulingPlanetEn: 'Mars',
    rulingPlanetHa: 'Mirrikh',
    zodiacSign: 'Bélier (Al-Hamal)',
    abjadVal: 7,
    ifaName: 'Odi Meji',
    sikidyName: 'Alakarabo / Oumarou',
    soussMonthBerber: 'Mayyu (Mai)',
    soussSeason: 'Printemps (Tafsut)'
  },
  {
    id: 'inkis',
    code: '2-2-2-1',
    dots: [2, 2, 2, 1],
    nameAr: 'الإنكيس (عقلة)',
    namePhonetic: 'Al-Inkis',
    nameFr: 'Le Renversement (Tristitia)',
    nameEn: 'The Inversion (Tristitia)',
    nameHa: 'Juya / Bakin Ciki (Tristitia)',
    element: 'earth',
    nature: 'kharij',
    rulingPlanetAr: 'زحل (Zuhal)',
    rulingPlanetFr: 'Saturne',
    rulingPlanetEn: 'Saturn',
    rulingPlanetHa: 'Zuhal',
    zodiacSign: 'Scorpion (Al-Aqrab)',
    abjadVal: 7,
    ifaName: 'Irosun Meji',
    sikidyName: 'Renilany / Ayyouba',
    soussMonthBerber: 'Yunyu (Juin)',
    soussSeason: 'Été (Iwilen)'
  },
  {
    id: 'nasr_kharij',
    code: '1-1-2-2',
    dots: [1, 1, 2, 2],
    nameAr: 'النصرة الخارجة',
    namePhonetic: 'An-Naṣrah al-Khārijah',
    nameFr: 'Victoire Majeure (Fortuna Major)',
    nameEn: 'Major Fortune (Fortuna Major)',
    nameHa: 'Babbar Nasara (Fortuna Major)',
    element: 'fire',
    nature: 'kharij',
    rulingPlanetAr: 'الشمس (Al-Shams)',
    rulingPlanetFr: 'Soleil',
    rulingPlanetEn: 'Sun',
    rulingPlanetHa: 'Rana',
    zodiacSign: 'Lion (Al-Asad)',
    abjadVal: 6,
    ifaName: 'Obara Meji',
    sikidyName: 'Alatsimay / Souleymane',
    soussMonthBerber: 'Yulyuz (Juillet)',
    soussSeason: 'Été (Iwilen)'
  },
  {
    id: 'nasr_dakhil',
    code: '2-2-1-1',
    dots: [2, 2, 1, 1],
    nameAr: 'النصرة الداخلة',
    namePhonetic: 'An-Naṣrah ad-Dākhilah',
    nameFr: 'Fortune Mineure (Fortuna Minor)',
    nameEn: 'Minor Fortune (Fortuna Minor)',
    nameHa: 'Karamar Nasara (Fortuna Minor)',
    element: 'fire',
    nature: 'dakhil',
    rulingPlanetAr: 'الشمس (Al-Shams)',
    rulingPlanetFr: 'Soleil',
    rulingPlanetEn: 'Sun',
    rulingPlanetHa: 'Rana',
    zodiacSign: 'Taureau (Al-Thawr)',
    abjadVal: 6,
    ifaName: 'Okanran Meji',
    sikidyName: 'Alakaosy / Nouhou',
    soussMonthBerber: 'Ghusht (Août)',
    soussSeason: 'Été (Iwilen)'
  },
  {
    id: 'utba_dakhila',
    code: '2-1-1-1',
    dots: [2, 1, 1, 1],
    nameAr: 'العتبة الداخلة',
    namePhonetic: "Al-'Utbah ad-Dākhilah",
    nameFr: "Seuil Entrant (Acquisitio)",
    nameEn: "Entering Threshold (Acquisitio)",
    nameHa: 'Shigar Arziki (Acquisitio)',
    element: 'air',
    nature: 'dakhil',
    rulingPlanetAr: 'المشتري (Al-Mushtari)',
    rulingPlanetFr: 'Jupiter',
    rulingPlanetEn: 'Jupiter',
    rulingPlanetHa: 'Mushtari',
    zodiacSign: 'Poissons (Al-Hut)',
    abjadVal: 5,
    ifaName: 'Ogunda Meji',
    sikidyName: 'Alahasady / Moussa',
    soussMonthBerber: 'Shutambir (Septembre)',
    soussSeason: 'Automne (Amwan)'
  },
  {
    id: 'utba_kharija',
    code: '1-1-1-2',
    dots: [1, 1, 1, 2],
    nameAr: 'العتبة الخارجة',
    namePhonetic: "Al-'Utbah al-Khārijah",
    nameFr: "Seuil Sortant (Amissio)",
    nameEn: "Exiting Threshold (Amissio)",
    nameHa: 'Fitar Asara (Amissio)',
    element: 'earth',
    nature: 'kharij',
    rulingPlanetAr: 'الزهرة (Al-Zuharah)',
    rulingPlanetFr: 'Vénus',
    rulingPlanetEn: 'Venus',
    rulingPlanetHa: 'Zuhra',
    zodiacSign: 'Balance (Al-Mizan)',
    abjadVal: 5,
    ifaName: 'Osa Meji',
    sikidyName: 'Alokola / Younous',
    soussMonthBerber: 'Ktuber (Octobre)',
    soussSeason: 'Automne (Amwan)'
  },
  {
    id: 'qabd_dakhil',
    code: '2-1-2-1',
    dots: [2, 1, 2, 1],
    nameAr: 'القبض الداخل',
    namePhonetic: 'Al-Qabḍ ad-Dākhil',
    nameFr: 'Prise Intérieure (Carcer)',
    nameEn: 'Internal Prison (Carcer)',
    nameHa: 'Kullewa (Carcer)',
    element: 'earth',
    nature: 'thabit',
    rulingPlanetAr: 'زحل (Zuhal)',
    rulingPlanetFr: 'Saturne',
    rulingPlanetEn: 'Saturn',
    rulingPlanetHa: 'Zuhal',
    zodiacSign: 'Poissons (Al-Hut)',
    abjadVal: 6,
    ifaName: 'Ika Meji',
    sikidyName: 'Alavalo / Bandiou',
    soussMonthBerber: 'Nuwambir (Novembre)',
    soussSeason: 'Automne (Amwan)'
  },
  {
    id: 'qabd_kharij',
    code: '1-2-1-2',
    dots: [1, 2, 1, 2],
    nameAr: 'القبض الخارج',
    namePhonetic: 'Al-Qabḍ al-Khārij',
    nameFr: 'Prise Extérieure (Conjunctio)',
    nameEn: 'External Union (Conjunctio)',
    nameHa: 'Hadin Gwiwa (Conjunctio)',
    element: 'air',
    nature: 'munqalib',
    rulingPlanetAr: 'عطارد (Utarid)',
    rulingPlanetFr: 'Mercure',
    rulingPlanetEn: 'Mercury',
    rulingPlanetHa: 'Utarid',
    zodiacSign: 'Vierge (Al-Sunbula)',
    abjadVal: 6,
    ifaName: 'Oturupon Meji',
    sikidyName: 'Alikisy / Ousmane',
    soussMonthBerber: 'Dujambir (Décembre)',
    soussSeason: 'Hiver (Tagrest)'
  },
  {
    id: 'ijtima',
    code: '1-2-2-2',
    dots: [1, 2, 2, 2],
    nameAr: 'الاجتماع',
    namePhonetic: "Al-Ijtimā'",
    nameFr: 'La Réunion (Conjunctio)',
    nameEn: 'The Conjunction (Conjunctio)',
    nameHa: 'Gamayya (Conjunctio)',
    element: 'air',
    nature: 'thabit',
    rulingPlanetAr: 'عطارد (Utarid)',
    rulingPlanetFr: 'Mercure',
    rulingPlanetEn: 'Mercury',
    rulingPlanetHa: 'Utarid',
    zodiacSign: 'Vierge (Al-Sunbula)',
    abjadVal: 7,
    ifaName: 'Otura Meji',
    sikidyName: 'Alakarabo / Moriba',
    soussMonthBerber: 'Yennayer (Janvier)',
    soussSeason: 'Hiver (Tagrest)'
  },
  {
    id: 'uqla',
    code: '2-1-1-2',
    dots: [2, 1, 1, 2],
    nameAr: 'العقلة',
    namePhonetic: "Al-'Uqlah",
    nameFr: "L'Entrave (Carcer / Noeud)",
    nameEn: "The Knot / Entanglement",
    nameHa: 'Daurewa (Uqlah)',
    element: 'earth',
    nature: 'thabit',
    rulingPlanetAr: 'زحل (Zuhal)',
    rulingPlanetFr: 'Saturne',
    rulingPlanetEn: 'Saturn',
    rulingPlanetHa: 'Zuhal',
    zodiacSign: 'Capricorne (Al-Jady)',
    abjadVal: 6,
    ifaName: 'Irete Meji',
    sikidyName: 'Alimizana / Kounta',
    soussMonthBerber: 'Mayyu (Mai)',
    soussSeason: 'Printemps (Tafsut)'
  },
  {
    id: 'kawsaj',
    code: '1-2-1-1',
    dots: [1, 2, 1, 1],
    nameAr: 'الكوسج (اللحية البيضاء)',
    namePhonetic: 'Al-Kawsaj',
    nameFr: 'La Queue du Dragon (Cauda Draconis)',
    nameEn: 'Tail of Dragon (Cauda)',
    nameHa: 'Wutsiyar Maciji (Cauda)',
    element: 'earth',
    nature: 'kharij',
    rulingPlanetAr: 'زحل / العقدة الجنوبية',
    rulingPlanetFr: 'Nœud Sud (Cauda)',
    rulingPlanetEn: 'South Node (Cauda)',
    rulingPlanetHa: 'Kudancin Wata',
    zodiacSign: 'Scorpion (Al-Aqrab)',
    abjadVal: 5,
    ifaName: 'Ose Meji',
    sikidyName: 'Karija / Tontoroky',
    soussMonthBerber: 'Shutambir (Septembre)',
    soussSeason: 'Automne (Amwan)'
  },
  {
    id: 'naqiyy_khadd',
    code: '1-1-2-1',
    dots: [1, 1, 2, 1],
    nameAr: 'نقي الخد',
    namePhonetic: 'Naqiyy al-Khadd',
    nameFr: 'Fille Pure (Puella)',
    nameEn: 'Pure Maiden (Puella)',
    nameHa: 'Yarinya Mai Kyau (Puella)',
    element: 'air',
    nature: 'dakhil',
    rulingPlanetAr: 'الزهرة (Al-Zuharah)',
    rulingPlanetFr: 'Vénus',
    rulingPlanetEn: 'Venus',
    rulingPlanetHa: 'Zuhra',
    zodiacSign: 'Balance (Al-Mizan)',
    abjadVal: 5,
    ifaName: 'Ofun Meji',
    sikidyName: 'Aliba / Tany',
    soussMonthBerber: 'Ibrir (Avril)',
    soussSeason: 'Printemps (Tafsut)'
  }
];

export const FIGURE_BY_CODE = new Map<string, Geomantic16Figure>(
  CLASSICAL_16_FIGURES.map(f => [f.code, f])
);

export const FIGURE_BY_ID = new Map<string, Geomantic16Figure>(
  CLASSICAL_16_FIGURES.map(f => [f.id, f])
);

// Helper to sum two figures binarily (1+1=2, 1+2=1, 2+2=2)
export function addGeomanticFigures(f1: Geomantic16Figure, f2: Geomantic16Figure): Geomantic16Figure {
  const newDots: [number, number, number, number] = [
    ((f1.dots[0] + f2.dots[0]) % 2 === 0) ? 2 : 1,
    ((f1.dots[1] + f2.dots[1]) % 2 === 0) ? 2 : 1,
    ((f1.dots[2] + f2.dots[2]) % 2 === 0) ? 2 : 1,
    ((f1.dots[3] + f2.dots[3]) % 2 === 0) ? 2 : 1,
  ];
  const code = newDots.join('-');
  return FIGURE_BY_CODE.get(code) || CLASSICAL_16_FIGURES[0];
}

// Generate all 16 Houses from 4 Mothers
export function generate16HousesFrom4Mothers(m1: Geomantic16Figure, m2: Geomantic16Figure, m3: Geomantic16Figure, m4: Geomantic16Figure): Geomantic16Figure[] {
  // Houses 1..4: Mothers
  const houses: Geomantic16Figure[] = [m1, m2, m3, m4];

  // Houses 5..8: Daughters (Banaat) derived from rows of mothers
  // H5 = Fire row [m1.dots[0], m2.dots[0], m3.dots[0], m4.dots[0]]
  const h5Code = [m1.dots[0], m2.dots[0], m3.dots[0], m4.dots[0]].join('-');
  const h6Code = [m1.dots[1], m2.dots[1], m3.dots[1], m4.dots[1]].join('-');
  const h7Code = [m1.dots[2], m2.dots[2], m3.dots[2], m4.dots[2]].join('-');
  const h8Code = [m1.dots[3], m2.dots[3], m3.dots[3], m4.dots[3]].join('-');

  houses.push(
    FIGURE_BY_CODE.get(h5Code) || CLASSICAL_16_FIGURES[0],
    FIGURE_BY_CODE.get(h6Code) || CLASSICAL_16_FIGURES[1],
    FIGURE_BY_CODE.get(h7Code) || CLASSICAL_16_FIGURES[2],
    FIGURE_BY_CODE.get(h8Code) || CLASSICAL_16_FIGURES[3]
  );

  // Houses 9..12: Nieces (Hawafeed)
  // H9 = H1 + H2
  // H10 = H3 + H4
  // H11 = H5 + H6
  // H12 = H7 + H8
  houses.push(
    addGeomanticFigures(houses[0], houses[1]),
    addGeomanticFigures(houses[2], houses[3]),
    addGeomanticFigures(houses[4], houses[5]),
    addGeomanticFigures(houses[6], houses[7])
  );

  // Houses 13..14: Witnesses (Shuhood)
  // H13 (Right Witness / Shāhid al-Yamīn) = H9 + H10
  // H14 (Left Witness / Shāhid al-Yasār) = H11 + H12
  houses.push(
    addGeomanticFigures(houses[8], houses[9]),
    addGeomanticFigures(houses[10], houses[11])
  );

  // House 15: The Judge (Al-Qāḍī / Mīzān) = H13 + H14
  houses.push(addGeomanticFigures(houses[12], houses[13]));

  // House 16: The Supreme Conclusion / Result (Muntahā al-Ghayb) = H15 + H1
  houses.push(addGeomanticFigures(houses[14], houses[0]));

  return houses;
}

// ----------------------------------------------------
// ARABIC CLASSICAL CALCULATIONS
// ----------------------------------------------------

// 1. Damir (Hidden Intention)
export interface DamirResult {
  targetHouseIndex: number; // 0 to 15 (M1 to M16)
  houseNumber: number; // 1 to 16
  figure: Geomantic16Figure;
  themeTitleFr: string;
  themeTitleEn: string;
  themeTitleHa: string;
  explanationFr: string;
  explanationEn: string;
  explanationHa: string;
  subConsciousAffinity: string;
}

const HOUSE_THEMES_I18N = [
  { fr: "L'Âme, l'état physique, la vie et le projet personnel", en: "The Soul, physical state, life and personal vision", ha: "Rai, lafiyar jiki da muradin zuciya" },
  { fr: "L'argent liquide, biens matériels et gains immédiats", en: "Liquid wealth, movable assets and imminent gains", ha: "Dukiya, kudi a hannu da ribar kasuwanci" },
  { fr: "Frères, sœurs, proches voisins et courts déplacements", en: "Siblings, neighbors, relatives and short trips", ha: "Yan'uwa, makwabta da gajerun tafiye-tafiye" },
  { fr: "Le père, le foyer, les terres, héritages et fins des choses", en: "Father, household, real estate, hidden treasures and ends", ha: "Uba, gida, gado da asalin al'amura" },
  { fr: "Enfants, amour, plaisirs, créativité et nouvelles", en: "Children, love, joy, creative works and messages", ha: "Yara, soyayya, farinciki da labarai" },
  { fr: "Maladies, serviteurs, soucis de santé et épreuves cachées", en: "Illnesses, employees, bodily ailments and hidden tests", ha: "Cuta, damuwa, masu yi maka aiki da wahalhalu" },
  { fr: "Mariage, conjoint, associés d'affaires et ennemis déclarés", en: "Marriage, spouse, business partners and open rivals", ha: "Aure, abokin zama, kasuwanci da makiya na fili" },
  { fr: "Mort, héritage, angoisses, transformations et dettes", en: "Death, inheritance, deep fears, rebirth and debts", ha: "Mutuwa, rabon gado, tsoro da basussuka" },
  { fr: "Grands voyages, spiritualité, songes, études et foi", en: "Long journeys, spirituality, divine dreams and higher wisdom", ha: "Doguwar tafiya, ilimi, mafarkai da imani" },
  { fr: "Pouvoir, gloire, carrière, roi, autorité et réputation", en: "Authority, honor, career, rulers and public standing", ha: "Sarauta, daukaka, aiki da mutunci a idon duniya" },
  { fr: "Espoirs sincères, amis fidèles, bienfaiteurs et alliances", en: "Hopes, faithful friends, benefactors and noble alliances", ha: "Fata nagari, aminan kwarai da masu taimako" },
  { fr: "Ennemis secrets, prisons, sorcellerie, trahisons et retraits", en: "Hidden foes, prisons, sorcery, betrayals and isolation", ha: "Makiya na boye, asiri, gidan yari da yaudara" },
  { fr: "Témoin du Passé & Origine de la Demande (Shāhid Yamīn)", en: "Witness of the Past & Question's Origin", ha: "Shaidar abubuwan da suka gabata" },
  { fr: "Témoin du Futur & Facteurs Extérieurs (Shāhid Yasār)", en: "Witness of the Future & External Influences", ha: "Shaidar abubuwan da za su zo nan gaba" },
  { fr: "Le Juge Tranchant & Verdict Présent (Al-Qāḍī)", en: "The Decisive Judge & Present Verdict", ha: "Alkali mai yanke hukuncin al'amari" },
  { fr: "Le Suprême Sceau & Clôture Ultime (Muntahā al-Ghayb)", en: "The Supreme Seal & Ultimate Destiny", ha: "Karshen kaddara da sirrin da ke boye" }
];

export function computeDamir(houses: Geomantic16Figure[]): DamirResult {
  // Classical Damir algorithm:
  // Count total single dots (fire+air+water+earth) across all 16 houses modulo 16
  let totalSingleDots = 0;
  houses.forEach(h => {
    h.dots.forEach(d => {
      if (d === 1) totalSingleDots += 1;
    });
  });

  // Calculate index: (totalSingleDots % 16). If remainder is 0 -> 16th house (index 15)
  const targetIndex = (totalSingleDots % 16 === 0) ? 15 : (totalSingleDots % 16) - 1;
  const houseNum = targetIndex + 1;
  const targetFig = houses[targetIndex];
  const theme = HOUSE_THEMES_I18N[targetIndex];

  return {
    targetHouseIndex: targetIndex,
    houseNumber: houseNum,
    figure: targetFig,
    themeTitleFr: `Maison ${houseNum} : ${theme.fr}`,
    themeTitleEn: `House ${houseNum}: ${theme.en}`,
    themeTitleHa: `Gida na ${houseNum}: ${theme.ha}`,
    explanationFr: `L'intention secrète (Damir) du consultant est capturée dans la Maison ${houseNum} avec la figure ${targetFig.nameFr} (${targetFig.nameAr}). Elle révèle que la véritable préoccupation sous-jacente porte sur : ${theme.fr}.`,
    explanationEn: `The querent's hidden intention (Damir) resides in House ${houseNum} with the figure ${targetFig.nameEn} (${targetFig.nameAr}). It indicates that the primary subconscious concern revolves around: ${theme.en}.`,
    explanationHa: `Boyayyen nufi (Damir) na mai tambaya yana cikin Gida na ${houseNum} da siffar ${targetFig.nameHa} (${targetFig.nameAr}). Yana bayyana cewa ainihin abin da ke damun zuciyarsa shine: ${theme.ha}.`,
    subConsciousAffinity: `${targetFig.element.toUpperCase()} • ${targetFig.nature}`
  };
}

// 2. Tashteed (Geomantic Aspects)
export interface GeomanticAspect {
  type: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
  typeFr: string;
  typeEn: string;
  typeHa: string;
  houseA: number;
  houseB: number;
  figA: Geomantic16Figure;
  figB: Geomantic16Figure;
  harmonicQuality: 'very_favorable' | 'favorable' | 'challenging' | 'critical' | 'neutral';
  explanationFr: string;
  explanationEn: string;
  explanationHa: string;
}

export function computeTashteedAspects(houses: Geomantic16Figure[]): GeomanticAspect[] {
  const aspects: GeomanticAspect[] = [];

  // Key astrological pairings on the 12-house circle:
  // Opposition (180° / 6 houses apart): M1-M7, M2-M8, M3-M9, M4-M10, M5-M11, M6-M12
  const oppPairs = [[1, 7], [2, 8], [3, 9], [4, 10], [5, 11], [6, 12]];
  // Trines (120° / 4 houses apart): M1-M5-M9 (Fire/Life), M2-M6-M10 (Earth/Action), M3-M7-M11 (Air/Intellect), M4-M8-M12 (Water/Occult)
  const trinePairs = [[1, 5], [5, 9], [1, 9], [2, 6], [6, 10], [2, 10], [3, 7], [7, 11], [3, 11], [4, 8], [8, 12], [4, 12]];
  // Squares (90° / 3 houses apart): M1-M4, M4-M7, M7-M10, M10-M1
  const squarePairs = [[1, 4], [4, 7], [7, 10], [10, 1], [2, 5], [5, 8], [8, 11], [11, 2]];
  // Sextiles (60° / 2 houses apart): M1-M3, M1-M11, M3-M5, M9-M11
  const sextilePairs = [[1, 3], [1, 11], [3, 5], [9, 11], [7, 9], [5, 7]];

  // Conjunctions: duplicate identical figures in different houses
  for (let i = 0; i < 12; i++) {
    for (let j = i + 1; j < 12; j++) {
      if (houses[i].id === houses[j].id) {
        aspects.push({
          type: 'conjunction',
          typeFr: 'Conjonction Mystique (Ittisal)',
          typeEn: 'Mystic Conjunction (Ittisal)',
          typeHa: 'Gamayyar Asiri (Ittisal)',
          houseA: i + 1,
          houseB: j + 1,
          figA: houses[i],
          figB: houses[j],
          harmonicQuality: houses[i].element === 'water' || houses[i].element === 'air' ? 'very_favorable' : 'neutral',
          explanationFr: `La figure ${houses[i].nameFr} se répète dans les Maisons ${i + 1} et ${j + 1}. Cela crée une résonance directe transmettant la force de la Maison ${i + 1} vers la Maison ${j + 1}.`,
          explanationEn: `The figure ${houses[i].nameEn} duplicates across Houses ${i + 1} and ${j + 1}. It creates a direct vibrational link channeling themes of House ${i + 1} into House ${j + 1}.`,
          explanationHa: `Siffar ${houses[i].nameHa} tana maimaita kanta a Gida na ${i + 1} da ${j + 1}. Wannan yana establishes hadin gwiwa tsakanin wadannan gidaje biyu.`
        });
      }
    }
  }

  // Add Trines
  trinePairs.slice(0, 4).forEach(([hA, hB]) => {
    const fA = houses[hA - 1];
    const fB = houses[hB - 1];
    aspects.push({
      type: 'trine',
      typeFr: 'Aspect de Trigone 120° (Tathlīth)',
      typeEn: 'Trine Aspect 120° (Tathleeth)',
      typeHa: 'Kusurwar Nasara 120° (Tathleeth)',
      houseA: hA,
      houseB: hB,
      figA: fA,
      figB: fB,
      harmonicQuality: 'very_favorable',
      explanationFr: `Harmonie parfaite et fluide entre la Maison ${hA} (${fA.nameFr}) et la Maison ${hB} (${fB.nameFr}). Succès sans friction.`,
      explanationEn: `Harmonious fluid synergy between House ${hA} (${fA.nameEn}) and House ${hB} (${fB.nameEn}). Frictionless success.`,
      explanationHa: `Daidaito da samun sauki tsakanin Gida na ${hA} (${fA.nameHa}) da Gida na ${hB} (${fB.nameHa}). Nasara ba tare da shan wahala ba.`
    });
  });

  // Add Oppositions
  oppPairs.slice(0, 3).forEach(([hA, hB]) => {
    const fA = houses[hA - 1];
    const fB = houses[hB - 1];
    aspects.push({
      type: 'opposition',
      typeFr: 'Aspect d\'Opposition 180° (Muqābalah)',
      typeEn: 'Opposition Aspect 180° (Muqabalah)',
      typeHa: 'Fuskar Karafafawa 180° (Muqabalah)',
      houseA: hA,
      houseB: hB,
      figA: fA,
      figB: fB,
      harmonicQuality: 'challenging',
      explanationFr: `Tension de face-à-face entre la Maison ${hA} (${fA.nameFr}) et la Maison ${hB} (${fB.nameFr}). Nécessite conciliation et arbitrage.`,
      explanationEn: `Face-to-face polar tension between House ${hA} (${fA.nameEn}) and House ${hB} (${fB.nameEn}). Requires arbitration and mediation.`,
      explanationHa: `Gaba da gaba da ja-in-ja tsakanin Gida na ${hA} (${fA.nameHa}) da Gida na ${hB} (${fB.nameHa}). Yana bukatar hakuri da sulhu.`
    });
  });

  // Add Squares
  squarePairs.slice(0, 2).forEach(([hA, hB]) => {
    const fA = houses[hA - 1];
    const fB = houses[hB - 1];
    aspects.push({
      type: 'square',
      typeFr: 'Aspect Carré 90° (Tarbī\')',
      typeEn: 'Square Aspect 90° (Tarbee)',
      typeHa: 'Kusurwa Mai Karfi 90° (Tarbee)',
      houseA: hA,
      houseB: hB,
      figA: fA,
      figB: fB,
      harmonicQuality: 'critical',
      explanationFr: `Obstacle et confrontation dynamique entre Maison ${hA} et Maison ${hB}. Force motrice mais exige un effort conscient.`,
      explanationEn: `Dynamic confrontation and hurdles between House ${hA} and House ${hB}. Catalyst that demands conscious perseverance.`,
      explanationHa: `Kalubale da cikas mai karfi tsakanin Gida na ${hA} da Gida na ${hB}. Yana bukatar jajircewa domin samun nasara.`
    });
  });

  return aspects;
}

// 3. Mizan al-Anasir (Elemental Balance)
export interface MizanAnasirResult {
  firePoints: number;
  airPoints: number;
  waterPoints: number;
  earthPoints: number;
  totalPoints: number;
  firePercent: number;
  airPercent: number;
  waterPercent: number;
  earthPercent: number;
  dominantElement: 'fire' | 'air' | 'water' | 'earth';
  dominantFr: string;
  dominantEn: string;
  dominantHa: string;
  temperamentFr: string;
  temperamentEn: string;
  temperamentHa: string;
  prescriptionFr: string;
  prescriptionEn: string;
  prescriptionHa: string;
}

export function computeMizanAnasir(houses: Geomantic16Figure[]): MizanAnasirResult {
  let fire = 0;
  let air = 0;
  let water = 0;
  let earth = 0;

  houses.forEach(h => {
    // Single dots = active seed (1 pt), Double dots = passive receptacle (2 pts)
    fire += (h.dots[0] === 1 ? 1 : 2);
    air += (h.dots[1] === 1 ? 1 : 2);
    water += (h.dots[2] === 1 ? 1 : 2);
    earth += (h.dots[3] === 1 ? 1 : 2);
  });

  const total = fire + air + water + earth;
  const firePct = Math.round((fire / total) * 100);
  const airPct = Math.round((air / total) * 100);
  const waterPct = Math.round((water / total) * 100);
  const earthPct = Math.round((earth / total) * 100);

  const scores = [
    { elem: 'fire' as const, val: fire },
    { elem: 'air' as const, val: air },
    { elem: 'water' as const, val: water },
    { elem: 'earth' as const, val: earth }
  ].sort((a, b) => b.val - a.val);

  const dominant = scores[0].elem;

  const labels = {
    fire: {
      elemFr: "Feu (Nār / ناري)",
      elemEn: "Fire (Nār / Choleric)",
      elemHa: "Wuta (Nār / Zafi)",
      tempFr: "Tempérament Bilieux & Impulsif (Chaleur, Action Rapide, Combativité)",
      tempEn: "Choleric & Dynamic Temperament (Heat, Swift Action, Courage)",
      tempHa: "Yanayin Wuta da Karfin Zuciya (Zafin rai, aiki da gaggawa)",
      recFr: "Préférer les rituels du midi, aumônes de métaux ou viandes, calmer l'esprit par l'eau fraîche.",
      recEn: "Favor noon prayers, alms of red food or metal, cool the spiritual aura with rose water.",
      recHa: "Yin zikiri a tsakiyar rana, sadakar naman yanka, da wanke fuska da ruwa mai sanyi."
    },
    air: {
      elemFr: "Air (Hawā' / هوائي)",
      elemEn: "Air (Hawā' / Sanguine)",
      elemHa: "Iska (Hawā' / Haske)",
      tempFr: "Tempérament Sanguin & Intellectuel (Communication, Fluidité, Mobilité)",
      tempEn: "Sanguine & Intellectual Temperament (Communication, Ideas, Movement)",
      tempHa: "Yanayin Iska da Hikimar Magana (Fasaha, hulda da jama'a da wayo)",
      recFr: "Encens de benjoin, dialogues clairs, éviter l'éparpillement des pensées.",
      recEn: "Benzoin incense, transparent negotiation, maintain mental grounding.",
      recHa: "Turaren benjoin mai dadi, magana mai dadi ga mutane da nisantar yawan tunani."
    },
    water: {
      elemFr: "Eau (Mā' / مائي)",
      elemEn: "Water (Mā' / Phlegmatic)",
      elemHa: "Ruwa (Mā' / Sanyi)",
      tempFr: "Tempérament Lymphatique & Intuitif (Émotions profondes, Patience, Rêves)",
      tempEn: "Phlegmatic & Intuitive Temperament (Empathy, Deep Dreams, Sensitivity)",
      tempHa: "Yanayin Ruwa da Basirar Boye (Tausayi, mafarkai na gaskiya da natsuwa)",
      recFr: "Aumône d'eau pure ou de lait, méditations nocturnes, zikr de purification du cœur.",
      recEn: "Charity of pure water or milk, nighttime litanies, heart cleansing zikr.",
      recHa: "Sadakar ruwan sha mai tsarki ko madara, zikirin dare da tsarkake zuciya."
    },
    earth: {
      elemFr: "Terre (Turāb / ترابي)",
      elemEn: "Earth (Turāb / Melancholic)",
      elemHa: "Kasa (Turāb / Nauyi)",
      tempFr: "Tempérament Mélancolique & Stable (Ancrage, Persévérance, Matérialité)",
      tempEn: "Melancholic & Grounded Temperament (Stability, Fortitude, Preservation)",
      tempHa: "Yanayin Kasa da Karfin Hakuri (Tabbata a wuri guda, juriya da dukiya)",
      recFr: "Aumône de céréales ou pain complet, construction patiente, éviter l'entêtement.",
      recEn: "Charity of wheat or grains, long-term investments, avoid rigid isolation.",
      recHa: "Sadakar hatsi, alkama ko buredi, aiki cikin tsari ba tare da garaje ba."
    }
  };

  const curr = labels[dominant];

  return {
    firePoints: fire,
    airPoints: air,
    waterPoints: water,
    earthPoints: earth,
    totalPoints: total,
    firePercent: firePct,
    airPercent: airPct,
    waterPercent: waterPct,
    earthPercent: earthPct,
    dominantElement: dominant,
    dominantFr: curr.elemFr,
    dominantEn: curr.elemEn,
    dominantHa: curr.elemHa,
    temperamentFr: curr.tempFr,
    temperamentEn: curr.tempEn,
    temperamentHa: curr.tempHa,
    prescriptionFr: curr.recFr,
    prescriptionEn: curr.recEn,
    prescriptionHa: curr.recHa
  };
}

// 4. Juge Suprême (Mizan al-Mizan : 17th and 18th Hidden Houses)
export interface MizanMizanResult {
  house17: Geomantic16Figure; // Rayonnement du Juge (H1 + H15)
  house18: Geomantic16Figure; // Clé de Voûte Cachée (H4 + H17)
  verdict17Fr: string;
  verdict17En: string;
  verdict17Ha: string;
  secret18Fr: string;
  secret18En: string;
  secret18Ha: string;
  supremeSynthesisFr: string;
  supremeSynthesisEn: string;
  supremeSynthesisHa: string;
}

export function computeMizanMizan(houses: Geomantic16Figure[]): MizanMizanResult {
  const h1 = houses[0];
  const h4 = houses[3];
  const h15 = houses[14];

  // House 17 = House 1 + House 15
  const h17 = addGeomanticFigures(h1, h15);
  // House 18 = House 4 + House 17
  const h18 = addGeomanticFigures(h4, h17);

  return {
    house17: h17,
    house18: h18,
    verdict17Fr: `Maison 17 (Rayonnement du Juge) : ${h17.nameFr} (${h17.nameAr}). Fusionne l'esprit du consultant (M1) avec le jugement brut (M15). Elle tranche les incertitudes immédiates.`,
    verdict17En: `House 17 (Judge's Radiance): ${h17.nameEn} (${h17.nameAr}). Fuses the querent's essence (M1) with the core verdict (M15) to dissolve ambiguity.`,
    verdict17Ha: `Gida na 17 (Hasken Alkali): ${h17.nameHa} (${h17.nameAr}). Yana hada ruhin mai tambaya (G1) da hukuncin alkali (G15) don yaye kokwanto.`,
    secret18Fr: `Maison 18 (Issue Cachée & Racine Céleste) : ${h18.nameFr} (${h18.nameAr}). Émane de la Maison 4 (Fondations et fin des choses) combinée à la Maison 17. Elle révèle la finalité spirituelle inaccessible aux yeux du profane.`,
    secret18En: `House 18 (Hidden Culmination & Celestial Root): ${h18.nameEn} (${h18.nameAr}). Derived from House 4 (Roots/Endings) plus House 17. It unveils the esoteric resolution.`,
    secret18Ha: `Gida na 18 (Sirrin Karshe da Tushen Samaniya): ${h18.nameHa} (${h18.nameAr}). An samo shi daga Gida na 4 da Gida na 17. Yana bayyana karshen lamari a asirce.`,
    supremeSynthesisFr: `La 18ème Maison (${h18.nameFr}) confirme que l'aboutissement final prendra la forme d'un état de type ${h18.element.toUpperCase()} avec une polarité ${h18.nature}.`,
    supremeSynthesisEn: `The 18th House (${h18.nameEn}) confirms that the ultimate outcome manifests under ${h18.element.toUpperCase()} resonance with ${h18.nature} polarity.`,
    supremeSynthesisHa: `Gida na 18 (${h18.nameHa}) yana tabbatar da cewa karshen al'amarin zai kasance a karkashin yanayin ${h18.element.toUpperCase()} da dabi'ar ${h18.nature}.`
  };
}

// 5. Inqilab (Mutations & House Migrations)
export interface InqilabEntry {
  figure: Geomantic16Figure;
  occurrences: number[]; // House numbers 1..16
  relationType: 'domicile' | 'exil' | 'repetition_harmonique' | 'choc';
  descriptionFr: string;
  descriptionEn: string;
  descriptionHa: string;
}

export function computeInqilab(houses: Geomantic16Figure[]): InqilabEntry[] {
  const map = new Map<string, number[]>();
  houses.forEach((h, idx) => {
    const list = map.get(h.id) || [];
    list.push(idx + 1);
    map.set(h.id, list);
  });

  const results: InqilabEntry[] = [];

  map.forEach((houseNums, figId) => {
    if (houseNums.length > 1) {
      const fig = FIGURE_BY_ID.get(figId)!;
      results.push({
        figure: fig,
        occurrences: houseNums,
        relationType: houseNums.length >= 3 ? 'repetition_harmonique' : 'domicile',
        descriptionFr: `La figure ${fig.nameFr} (${fig.nameAr}) voyage et se manifeste dans ${houseNums.length} maisons (${houseNums.map(n => `M${n}`).join(', ')}). Cela indique une mutation d'énergie reliant directement ces secteurs de votre existence.`,
        descriptionEn: `The figure ${fig.nameEn} (${fig.nameAr}) migrates across ${houseNums.length} houses (${houseNums.map(n => `M${n}`).join(', ')}). It indicates dynamic energy transfer bridging those sectors.`,
        descriptionHa: `Siffar ${fig.nameHa} (${fig.nameAr}) tana bayyana a cikin gidaje ${houseNums.length} (${houseNums.map(n => `G${n}`).join(', ')}). Wannan yana nuna sauyin yanayi da ke hada wadannan bangarori na rayuwa.`
      });
    }
  });

  return results;
}

// ----------------------------------------------------
// MAGHREBI GEOMANCY CALCULATIONS
// ----------------------------------------------------

// 1. Dairat as-Souss (Berber Calendar & Timing)
export interface SoussDairaResult {
  rulingFigure: Geomantic16Figure;
  berberMonth: string;
  season: string;
  timingEstimateFr: string;
  timingEstimateEn: string;
  timingEstimateHa: string;
  astrologicalSign: string;
  energyFlowFr: string;
  energyFlowEn: string;
  energyFlowHa: string;
}

export function computeDairatAsSouss(houses: Geomantic16Figure[]): SoussDairaResult {
  // Take the Judge (M15) or Supreme (M16)
  const judge = houses[14];
  return {
    rulingFigure: judge,
    berberMonth: judge.soussMonthBerber,
    season: judge.soussSeason,
    astrologicalSign: judge.zodiacSign,
    timingEstimateFr: `D'après le cadran de Dairat as-Souss, la concrétisation est marquée par le cycle de ${judge.soussMonthBerber} durant la saison de ${judge.soussSeason}. Rythme estimé : dans les 1 à 4 semaines ou à l'entrée de la prochaine lune.`,
    timingEstimateEn: `According to Dairat as-Souss, realization peaks during ${judge.soussMonthBerber} in the ${judge.soussSeason} season. Estimated window: within 1 to 4 weeks or upon the next lunar ingress.`,
    timingEstimateHa: `A cewar Dairat as-Souss, biyan bukata yana bayyana a watan ${judge.soussMonthBerber} a lokacin ${judge.soussSeason}. Kimanin kwanaki 7 zuwa 30 ko a farkon sabon wata.`,
    energyFlowFr: `Le flux saisonnier soussi active l'élément ${judge.element.toUpperCase()} avec gouvernance de ${judge.rulingPlanetFr}.`,
    energyFlowEn: `The Soussi seasonal flow activates ${judge.element.toUpperCase()} under the dominion of ${judge.rulingPlanetEn}.`,
    energyFlowHa: `Zagayen lokaci na Souss yana motsa yanayin ${judge.element.toUpperCase()} a karkashin tauraron ${judge.rulingPlanetHa}.`
  };
}

// 2. Mizan al-Gharb (Western Fertility Balance)
export interface MizanGharbResult {
  fortuneScore: number;
  isFertile: boolean;
  statusFr: string;
  statusEn: string;
  statusHa: string;
  barakaIndex: number; // 0 to 100
  wealthHousesAnalysisFr: string;
  wealthHousesAnalysisEn: string;
  wealthHousesAnalysisHa: string;
}

export function computeMizanAlGharb(houses: Geomantic16Figure[]): MizanGharbResult {
  // Houses of Fortune: M2 (Gains), M8 (Inheritance/Debts), M10 (Status/Trade), M11 (Alliances/Hopes)
  const fortuneHouses = [houses[1], houses[7], houses[9], houses[10]];
  let score = 0;

  fortuneHouses.forEach(h => {
    if (h.nature === 'dakhil') score += 2;
    else if (h.nature === 'thabit') score += 1;
    else if (h.nature === 'kharij') score -= 1;
    if (h.element === 'water' || h.element === 'earth') score += 1;
  });

  const isFertile = score >= 3;
  const baraka = Math.min(100, Math.max(15, 50 + score * 10));

  return {
    fortuneScore: score,
    isFertile,
    barakaIndex: baraka,
    statusFr: isFertile ? "Thème Hautement Fertile (Mubārak / Fertile)" : "Thème Exigeant / Stérile (Nāqis / Stérile)",
    statusEn: isFertile ? "Highly Fertile Theme (Mubārak / Fertile)" : "Exacting / Barren Theme (Nāqis / Barren)",
    statusHa: isFertile ? "Teburi Mai Yawan Albarka da Arziki (Mubārak)" : "Teburi Mai Bukatar Jajircewa da Sadaka (Nāqis)",
    wealthHousesAnalysisFr: isFertile 
      ? `La somme des Maisons de Fortune (M2, M8, M10, M11) affiche un score de +${score} avec un indice de Baraka de ${baraka}%. Les affaires financières, investissements et projets de prospérité sont largement bénis.`
      : `Les Maisons de Fortune indiquent une déperdition d'énergie (-${score}) avec un indice de Baraka de ${baraka}%. Il est fortement conseillé de faire une aumône (Sadaqah) pour stabiliser les flux financiers.`,
    wealthHousesAnalysisEn: isFertile
      ? `The sum of Fortune Houses (M2, M8, M10, M11) registers a strong score of +${score} with a Baraka index of ${baraka}%. Financial ventures and prosperity endeavors receive favorable winds.`
      : `Fortune Houses reveal energetic dissipation (-${score}) with a Baraka index of ${baraka}%. Almsgiving (Sadaqah) is recommended to seal financial leakages.`,
    wealthHousesAnalysisHa: isFertile
      ? `Hadin gwiwar gidajen arziki (G2, G8, G10, G11) ya bada maki +${score} da albarkar kashi ${baraka}%. Kasuwanci, kudi da ayyukan neman dukiya za su sami bude kofa.`
      : `Gidajen arziki suna nuna fita ko jinkirin kudi da kashi ${baraka}%. Ana bada shawarar yin sadaka don toshe kofofin asara.`
  };
}

// 3. Khatam de Zanati (Zanati Talisman Matrix)
export interface KhatamZanatiResult {
  grid: number[][]; // 3x3
  rulingKhadim: string;
  divineNameAr: string;
  divineNameFr: string;
  divineNameEn: string;
  divineNameHa: string;
  sealPurposeFr: string;
  sealPurposeEn: string;
  sealPurposeHa: string;
}

export function computeKhatamZanati(houses: Geomantic16Figure[]): KhatamZanatiResult {
  const m1 = houses[0].abjadVal;
  const m13 = houses[12].abjadVal;
  const m14 = houses[13].abjadVal;
  const m15 = houses[14].abjadVal;
  const m16 = houses[15].abjadVal;

  const base = m1 + m13 + m14 + m15 + m16;

  // 3x3 Magic Square populated with Zanati geomantic values
  const grid: number[][] = [
    [base + 2, base + 9, base + 4],
    [base + 7, base + 5, base + 3],
    [base + 6, base + 1, base + 8]
  ];

  return {
    grid,
    rulingKhadim: "Tamyā'īl wa Shamhūrash (تمياييل وشمهورش)",
    divineNameAr: "يا فتاح يا حفيظ يا غني",
    divineNameFr: "Yā Fattāḥ Yā Ḥafīẓ Yā Ghaniyy (L'Ouvreur, Le Gardien, Le Riche)",
    divineNameEn: "Yā Fattāḥ Yā Ḥafīẓ Yā Ghaniyy (The Opener, The Preserver, The Self-Sufficient)",
    divineNameHa: "Yā Fattāḥ Yā Ḥafīẓ Yā Ghaniyy (Mai Budewa, Mai Tsaro, Mai Yalwa)",
    sealPurposeFr: "Ce Khatam de Zanati capture l'équilibre des 16 figures pour créer un bouclier protecteur et attirer les ouvertures matérielles.",
    sealPurposeEn: "This Zanati Khatam harnesses the 16 figures' harmony to construct a protective shield and unlock material blessings.",
    sealPurposeHa: "Wannan Hatimin Zanati yana hada albarkar dukkan siffofin 16 don zama garkuwar kariya da bude kofofin arziki."
  };
}

// 4. Voyage Saharien (Sahara Caravan Travel Analysis)
export interface SaharanVoyageResult {
  departureStatusFr: string;
  departureStatusEn: string;
  departureStatusHa: string;
  transitRiskFr: string;
  transitRiskEn: string;
  transitRiskHa: string;
  arrivalFateFr: string;
  arrivalFateEn: string;
  arrivalFateHa: string;
  isSafeToTravel: boolean;
  travelDuaAr: string;
}

export function computeSaharanVoyage(houses: Geomantic16Figure[]): SaharanVoyageResult {
  const h3 = houses[2]; // Short travels & preparation
  const h9 = houses[8]; // Long journeys, sea & desert crossing
  const h12 = houses[11]; // Road trials, ambushes, hidden tests

  const safe = (h9.nature === 'dakhil' || h9.nature === 'thabit') && h12.element !== 'fire';

  return {
    isSafeToTravel: safe,
    departureStatusFr: `Départ (Maison 3 - ${h3.nameFr}) : Préparation ${h3.nature === 'dakhil' ? 'favorable et aisée' : 'nécessitant prévoyance'}.`,
    departureStatusEn: `Departure (House 3 - ${h3.nameEn}): Preparation is ${h3.nature === 'dakhil' ? 'smooth and auspicious' : 'demanding extra caution'}.`,
    departureStatusHa: `Tashin Tafiya (Gida na 3 - ${h3.nameHa}): Shirye-shirye ${h3.nature === 'dakhil' ? 'na tafiya lafiya' : 'yana bukatar kiyayewa'}.`,
    transitRiskFr: `Traversée du Désert (Maison 9 - ${h9.nameFr}) : Le voyage au long cours sera marqué par l'élément ${h9.element.toUpperCase()}.`,
    transitRiskEn: `Desert Crossing (House 9 - ${h9.nameEn}): The long expedition operates under ${h9.element.toUpperCase()} forces.`,
    transitRiskHa: `Tsallaka Hamada (Gida na 9 - ${h9.nameHa}): Tafiyar nesa za ta kasance a karkashin yanayin ${h9.element.toUpperCase()}.`,
    arrivalFateFr: `Épreuves & Sécurité (Maison 12 - ${h12.nameFr}) : ${safe ? 'Aucun piège majeur ni embuscade sur le parcours.' : 'Faire preuve de grande vigilance face aux imprévus.'}`,
    arrivalFateEn: `Obstacles & Safety (House 12 - ${h12.nameEn}): ${safe ? 'No severe ambushes or critical perils detected.' : 'Exercise high vigilance against unexpected roadblocks.'}`,
    arrivalFateHa: `Kariya da Cikas (Gida na 12 - ${h12.nameHa}): ${safe ? 'Babu wani hadari ko tarkon makiya a kan hanya.' : 'A kiyaye sosai domin guje wa abubuwan bazata.'}`,
    travelDuaAr: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ"
  };
}

// 5. Conflits de Voisinage (Jiwar)
export interface JiwarEntry {
  pairName: string;
  houseA: number;
  houseB: number;
  figA: Geomantic16Figure;
  figB: Geomantic16Figure;
  compatibility: 'peaceful' | 'combative' | 'transformative';
  interpretationFr: string;
  interpretationEn: string;
  interpretationHa: string;
}

export function computeJiwarConflicts(houses: Geomantic16Figure[]): JiwarEntry[] {
  const pairs = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12], [13, 14]];
  const results: JiwarEntry[] = [];

  pairs.forEach(([hA, hB]) => {
    const fA = houses[hA - 1];
    const fB = houses[hB - 1];

    let compat: 'peaceful' | 'combative' | 'transformative' = 'peaceful';
    if ((fA.element === 'fire' && fB.element === 'water') || (fA.element === 'water' && fB.element === 'fire')) {
      compat = 'combative';
    } else if (fA.element === fB.element) {
      compat = 'peaceful';
    } else {
      compat = 'transformative';
    }

    results.push({
      pairName: `Voisinage M${hA} & M${hB}`,
      houseA: hA,
      houseB: hB,
      figA: fA,
      figB: fB,
      compatibility: compat,
      interpretationFr: compat === 'combative' 
        ? `Choc d'éléments entre Maison ${hA} (${fA.nameFr} - ${fA.element}) et Maison ${hB} (${fB.nameFr} - ${fB.element}). Risque de frictions à court terme.`
        : compat === 'peaceful'
        ? `Harmonie de contiguïté entre Maison ${hA} et Maison ${hB}. Soutien direct et entraide naturelle.`
        : `Relation de métamorphose mutuelle entre Maison ${hA} et Maison ${hB}.`,
      interpretationEn: compat === 'combative'
        ? `Elemental friction between House ${hA} (${fA.nameEn} - ${fA.element}) and House ${hB} (${fB.nameEn} - ${fB.element}). Short-term friction expected.`
        : compat === 'peaceful'
        ? `Peaceful adjacency between House ${hA} and House ${hB}. Mutual reinforcement.`
        : `Transformational catalytic adjacency between House ${hA} and House ${hB}.`,
      interpretationHa: compat === 'combative'
        ? `Karo na yanayi tsakanin Gida na ${hA} (${fA.nameHa}) da Gida na ${hB} (${fB.nameHa}). Yana nuna sabani na dan lokaci.`
        : compat === 'peaceful'
        ? `Zaman lafiya da taimakekeniya tsakanin Gida na ${hA} da Gida na ${hB}.`
        : `Sauyi mai kyau tsakanin Gida na ${hA} da Gida na ${hB}.`
    });
  });

  return results;
}

// ----------------------------------------------------
// AFRICAN GEOMANCY (IFA, FA, SIKIDY, HAKATA)
// ----------------------------------------------------

export interface IfaOduDetail {
  id: string;
  nameYoruba: string;
  nameFon: string; // Fa tradition
  codeRight: [number, number, number, number]; // 1 = Single, 2 = Double
  codeLeft: [number, number, number, number];
  isMeji: boolean; // 16 Major Mejis
  element: 'fire' | 'air' | 'water' | 'earth';
  orishaRuling: string;
  proverbFr: string;
  proverbEn: string;
  proverbHa: string;
  itanStoryFr: string;
  itanStoryEn: string;
  itanStoryHa: string;
  eboSacrificeFr: string;
  eboSacrificeEn: string;
  eboSacrificeHa: string;
  spiritualWarningFr: string;
  spiritualWarningEn: string;
  spiritualWarningHa: string;
  tabooEwoFr: string;
  tabooEwoEn: string;
  tabooEwoHa: string;
}

// 16 Primary Meji Odus of Ifa
export const IFA_16_MEJI_ODUS: IfaOduDetail[] = [
  {
    id: 'eji-ogbe',
    nameYoruba: 'Èjì Ogbè (Ogbè Méjì)',
    nameFon: 'Gbe Meji',
    codeRight: [1, 1, 1, 1],
    codeLeft: [1, 1, 1, 1],
    isMeji: true,
    element: 'air',
    orishaRuling: 'Obatala (L\'Architecte de la Lumière)',
    proverbFr: "La tête qui porte la couronne ne trébuche point sur la route droite.",
    proverbEn: "The head that bears the pure crown never stumbles upon the righteous road.",
    proverbHa: "Kan da ke dauke da rawani mai kyau ba ya tuntube a kan hanya madaidaiciya.",
    itanStoryFr: "Eji Ogbe est le Roi de tous les Odus, symbolisant l'ouverture de tous les chemins, la lumière sans ombre et la bénédiction absolue de la tête (Ori).",
    itanStoryEn: "Eji Ogbe is the King of all Odus, heralding total unblocking of paths, absolute clarity, and highest blessings upon one's Ori.",
    itanStoryHa: "Eji Ogbe shine Sarkin dukkan Odus, yana nuna bude dukkan kofofi da hasken nasara mai girma.",
    eboSacrificeFr: "Tissu blanc immaculé, 16 cauris, beurre de karité (ori), igname pilée et eau de source fraîche.",
    eboSacrificeEn: "Pure white cloth, 16 cowries, shea butter (ori), pounded yam, and fresh spring water.",
    eboSacrificeHa: "Farar kyalle mai tsarki, farar alawa, man kadanya da ruwan sha mai sanyi.",
    spiritualWarningFr: "Garder une humilité totale ; ne jamais s'enorgueillir du succès.",
    spiritualWarningEn: "Maintain utter humility; never succumb to vanity or pride.",
    spiritualWarningHa: "Kaskantar da kai ga kowa; nisantar girman kai da alfahari.",
    tabooEwoFr: "Interdiction de manger du chien, de boire du vin de palme trouble et de porter des vêtements noirs.",
    tabooEwoEn: "Avoid dog meat, cloudy palm wine, and wearing black clothing.",
    tabooEwoHa: "Nisantar sanya bakin kaya da cin abinci maras tsarki."
  },
  {
    id: 'oyeku-meji',
    nameYoruba: 'Ọ̀yẹ̀kú Méjì',
    nameFon: 'Yeku Meji',
    codeRight: [2, 2, 2, 2],
    codeLeft: [2, 2, 2, 2],
    isMeji: true,
    element: 'earth',
    orishaRuling: 'Oya & Iku (Maîtresse des Vents & Ancêtres)',
    proverbFr: "La nuit protège la graine jusqu'à l'aube nouvelle.",
    proverbEn: "The sacred night shelters the seed until the breaking of a new dawn.",
    proverbHa: "Duhu yana kare kwayar halitta har zuwa fitowar alfijir.",
    itanStoryFr: "Oyeku Meji est la Mère de la nuit, de la longévité et de la protection contre la mort prématurée et les attaques invisibles.",
    itanStoryEn: "Oyeku Meji is the Mother of night, longevity, and supreme shielding against premature death and spiritual arrows.",
    itanStoryHa: "Oyeku Meji shine uwar kariya daga mutuwa kwatsam da sharrin asirin dare.",
    eboSacrificeFr: "Tissu noir et rouge, 8 escargots (igbin), huile de palme rouge (epo pupa) et graines de sésame.",
    eboSacrificeEn: "Black and red cloth, 8 land snails (igbin), red palm oil (epo pupa), and sesame seeds.",
    eboSacrificeHa: "Kyallen baki da ja, dodon kodi, man ja da kwayoyin ridi.",
    spiritualWarningFr: "Honorer scrupuleusement les ancêtres paternels et maternels.",
    spiritualWarningEn: "Honor ancestral lineages and libations without neglect.",
    spiritualWarningHa: "Girmama iyaye da kakanni da yawaita musu addu'a.",
    tabooEwoFr: "Interdiction d'éteindre un feu avec de l'eau sale ou de marcher seul la nuit sans protection.",
    tabooEwoEn: "Do not extinguish fire with dirty water or wander at midnight unprotected.",
    tabooEwoHa: "Nisantar yawo a cikin dare ba tare da kariya ta addu'a ba."
  },
  {
    id: 'iwori-meji',
    nameYoruba: 'Ìwòrì Méjì',
    nameFon: 'Woli Meji',
    codeRight: [2, 1, 1, 2],
    codeLeft: [2, 1, 1, 2],
    isMeji: true,
    element: 'water',
    orishaRuling: 'Shango & Eshu',
    proverbFr: "Le regard perçant du faucon voit à travers les nuages les plus épais.",
    proverbEn: "The hawk's sharp vision pierces through the thickest tempest clouds.",
    proverbHa: "Idon shaho mai kaifi yana hango abu ko a cikin gajimare.",
    itanStoryFr: "Iwori Meji incarne la vision intérieure, le discernement prophétique et la transformation spirituelle par le feu purificateur.",
    itanStoryEn: "Iwori Meji embodies inner vision, prophetic insight, and spiritual transmutation.",
    itanStoryHa: "Iwori Meji yana nuna basira ta gani da fahimtar abubuwan da ke tafe.",
    eboSacrificeFr: "4 noix de cola (obi abata), coq rouge, maïs grillé et miel sauvage.",
    eboSacrificeEn: "4 kola nuts (obi abata), red rooster, roasted corn, and wild honey.",
    eboSacrificeHa: "Goro guda hudu, zakara ja, gasasshen masara da zuma.",
    spiritualWarningFr: "Ne jamais trahir une confidence ni juger avec précipitation.",
    spiritualWarningEn: "Never betray confidences nor pass rash judgment.",
    spiritualWarningHa: "Kada ka tona asirin wani ko yanke hukunci da garaje.",
    tabooEwoFr: "Interdiction de manger du porc ou des animaux à cornes recourbées.",
    tabooEwoEn: "Avoid pork and animals with coiled horns.",
    tabooEwoHa: "Nisantar cin naman da ba a tabbatar da tsarkinsa ba."
  },
  {
    id: 'odi-meji',
    nameYoruba: 'Òdí Méjì',
    nameFon: 'Di Meji',
    codeRight: [1, 2, 2, 1],
    codeLeft: [1, 2, 2, 1],
    isMeji: true,
    element: 'earth',
    orishaRuling: 'Yemoja (Mère des Océans)',
    proverbFr: "La forteresse fermée ne laisse entrer aucun voleur.",
    proverbEn: "The sealed fortress permits no thief to breach its sanctuary.",
    proverbHa: "Ganuwar da aka gina da kyau ba ta barin barawo ya shiga.",
    itanStoryFr: "Odi Meji représente la fertilité, la gestation, la régénération des corps et la protection de la famille.",
    itanStoryEn: "Odi Meji represents fertility, gestation, bodily rejuvenation, and family fortification.",
    itanStoryHa: "Odi Meji yana nuna samun haihuwa, kare iyali da daukakar zuriya.",
    eboSacrificeFr: "Canne à sucre, poisson frais d'eau douce, mélasse et 16 cauris.",
    eboSacrificeEn: "Sugar cane, fresh river fish, molasses, and 16 cowries.",
    eboSacrificeHa: "Rake, kifin ruwa mai dadi, da fararen alawa.",
    spiritualWarningFr: "Veiller sur les secrets intimes de sa maison.",
    spiritualWarningEn: "Safeguard intimate household secrets.",
    spiritualWarningHa: "Kare sirrin cikin gida da iyali.",
    tabooEwoFr: "Interdiction de dormir nu sans couverture ou de médire de sa mère.",
    tabooEwoEn: "Do not sleep uncovered or speak ill of motherhood.",
    tabooEwoHa: "Nisantar saba wa mahaifiya ko tozarta ta."
  },
  {
    id: 'irosun-meji',
    nameYoruba: 'Ìrosùn Méjì',
    nameFon: 'Losun Meji',
    codeRight: [1, 1, 2, 2],
    codeLeft: [1, 1, 2, 2],
    isMeji: true,
    element: 'fire',
    orishaRuling: 'Osun (Déesse de la Douceur & Prospérité)',
    proverbFr: "La poudre rouge d'Irosun guérit la terre blessée.",
    proverbEn: "The sacred red camwood powder heals the wounded soil.",
    proverbHa: "Jajayen hoda na asiri yana warkar da ciwon kasa.",
    itanStoryFr: "Irosun Meji est la bénédiction de la royauté, de la mémoire ancestrale et du triomphe sur les rivalités jalouses.",
    itanStoryEn: "Irosun Meji confers royal favor, ancestral memory, and victory over jealous adversaries.",
    itanStoryHa: "Irosun Meji yana kawo sarauta, daukaka da nasara a kan mahassada.",
    eboSacrificeFr: "Poudre d'Irosun (camwood), bananes douces, miel et étoffe dorée.",
    eboSacrificeEn: "Irosun powder (camwood), ripe bananas, honey, and golden cloth.",
    eboSacrificeHa: "Hoda mai kamshi, ayaba mai zaki, zuma da kyalle mai haske.",
    spiritualWarningFr: "Garder son calme face aux provocations de l'entourage.",
    spiritualWarningEn: "Remain poised and calm amidst hostile provocation.",
    spiritualWarningHa: "Yin hakuri a lokacin da mutane ke kokarin fusata ka.",
    tabooEwoFr: "Interdiction de creuser des trous profonds sans prière préalable.",
    tabooEwoEn: "Do not dig deep ditches without protective libation.",
    tabooEwoHa: "Nisantar rami mai zurfi ba tare da addu'a ba."
  },
  {
    id: 'owonrin-meji',
    nameYoruba: 'Ọ̀wọ́nrín Méjì',
    nameFon: 'Winlin Meji',
    codeRight: [2, 2, 1, 1],
    codeLeft: [2, 2, 1, 1],
    isMeji: true,
    element: 'water',
    orishaRuling: 'Eshu-Elegbara & Osanyin',
    proverbFr: "Le vent violent nettoie les branches mortes pour laisser place aux fruits nouveaux.",
    proverbEn: "The fierce wind strips dead branches to birth fresh sweet fruit.",
    proverbHa: "Iska mai karfi tana share busassun rassa don sabbin ya'ya su fito.",
    itanStoryFr: "Owonrin Meji apporte la fin des sécheresses, l'inversion des fortunes et l'abondance inattendue.",
    itanStoryEn: "Owonrin Meji turns drought into rain, reversing adversity into sudden wealth.",
    itanStoryHa: "Owonrin Meji yana kawo karshen fari da sauyin talauci zuwa wadata.",
    eboSacrificeFr: "Noix de coco, eau de pluie fraîche, maïs et pièces de monnaie.",
    eboSacrificeEn: "Coconut, fresh rainwater, whole maize, and metallic coins.",
    eboSacrificeHa: "Kwarkwaro, ruwan sama mai tsafta, masara da kudi.",
    spiritualWarningFr: "Ne jamais mépriser les petits commencements.",
    spiritualWarningEn: "Never despise humble beginnings.",
    spiritualWarningHa: "Kada ka rena karamin abu na alheri.",
    tabooEwoFr: "Interdiction de marcher sous la pluie battante sans couvre-chef.",
    tabooEwoEn: "Do not walk in downpours bareheaded.",
    tabooEwoHa: "Nisantar tafiya a cikin ruwan sama ba tare da hula ba."
  },
  {
    id: 'obara-meji',
    nameYoruba: 'Ọ̀bàrà Méjì',
    nameFon: 'Abla Meji',
    codeRight: [1, 2, 2, 2],
    codeLeft: [1, 2, 2, 2],
    isMeji: true,
    element: 'fire',
    orishaRuling: 'Shango (Seigneur du Tonnerre & de la Justice)',
    proverbFr: "La langue véridique transforme la pauvreté en un palais royal.",
    proverbEn: "The truthful tongue transforms humble poverty into a royal court.",
    proverbHa: "Harshe mai fadar gaskiya yana mayar da talaka sarki a fadarsa.",
    itanStoryFr: "Obara Meji est l'Odu du riche marchand, du verbe créateur et de la royauté obtenue par la sagesse et la foi.",
    itanStoryEn: "Obara Meji is the signature of the wealthy merchant, master of speech and crowned leader.",
    itanStoryHa: "Obara Meji shine alamar attajiri mai arziki, mai magana da basira da sarauta.",
    eboSacrificeFr: "Bélier vigoureux ou coq blanc, 6 bananes plantains mûres, tissu pourpre.",
    eboSacrificeEn: "Vigorous ram or white rooster, 6 ripe plantains, purple cloth.",
    eboSacrificeHa: "Rago mai karfi ko zakara fari, ayaba da kyalle mai kyau.",
    spiritualWarningFr: "Bannir tout mensonge ou vantardise de son discours.",
    spiritualWarningEn: "Banish all falsehood and boastfulness from your speech.",
    spiritualWarningHa: "Kaurace wa karya da cika baki.",
    tabooEwoFr: "Interdiction de manger de la citrouille et de se disputer en public.",
    tabooEwoEn: "Do not eat pumpkin or engage in public brawls.",
    tabooEwoHa: "Nisantar fada a bainar jama'a."
  },
  {
    id: 'okanran-meji',
    nameYoruba: 'Ọ̀kànràn Méjì',
    nameFon: 'Koli Meji',
    codeRight: [2, 2, 2, 1],
    codeLeft: [2, 2, 2, 1],
    isMeji: true,
    element: 'fire',
    orishaRuling: 'Ogun & Shango',
    proverbFr: "Quand le tonnerre gronde, le cœur résolu ne tremble point.",
    proverbEn: "When thunder roars across the firmament, the resolute heart wavers not.",
    proverbHa: "Idan tsawa ta fadi a sararin samaniya, zuciya mai karfi ba ta tsorata ba.",
    itanStoryFr: "Okanran Meji apporte le courage face aux épreuves, la victoire sur les ennemis déclarés et la justice divine tranchante.",
    itanStoryEn: "Okanran Meji bestows unyielding courage, triumphant victory over open foes, and righteous justice.",
    itanStoryHa: "Okanran Meji yana kawo jaruntaka da nasara a kan abokan gaba.",
    eboSacrificeFr: "Morceau de fer pur, piments rouges (ata), huile de palme et coq vigoureux.",
    eboSacrificeEn: "Piece of pure iron, red peppers (ata), palm oil, and a rooster.",
    eboSacrificeHa: "Karfe mai kyau, barkono ja, man ja da zakara.",
    spiritualWarningFr: "Canaliser sa colère pour éviter les paroles destructrices.",
    spiritualWarningEn: "Channel fiery anger to avoid regretful words.",
    spiritualWarningHa: "Kame fushi domin kauce wa maganganun da za a yi nadama a kansu.",
    tabooEwoFr: "Interdiction de frapper un animal sans nécessité ou de porter des armes rouillées.",
    tabooEwoEn: "Do not strike animals unnecessarily or carry rusted weapons.",
    tabooEwoHa: "Nisantar dukan dabba ba tare da dalili ba."
  },
  {
    id: 'ogunda-meji',
    nameYoruba: 'Ògúndá Méjì',
    nameFon: 'Guda Meji',
    codeRight: [1, 1, 1, 2],
    codeLeft: [1, 1, 1, 2],
    isMeji: true,
    element: 'earth',
    orishaRuling: 'Ogun (Dieu du Fer & de la Forge)',
    proverbFr: "La machette d'Ogun défriche la forêt vierge pour faire naître la cité.",
    proverbEn: "Ogun's sacred machete clears the wilderness to birth civilizations.",
    proverbHa: "Addar Ogun tana share daji domin gina birni mai albarka.",
    itanStoryFr: "Ogunda Meji est le maître de la technologie, de la chirurgie, de l'élimination des obstacles physiques et du travail travailleur.",
    itanStoryEn: "Ogunda Meji governs craftsmanship, technology, surgery, and overcoming hard obstacles.",
    itanStoryHa: "Ogunda Meji yana nuna aiki tukuru, sana'a da samun nasara a kan cikas.",
    eboSacrificeFr: "Igname rôti, huile de palme, escargot, et outils de fer forgé.",
    eboSacrificeEn: "Roasted yam, red palm oil, land snail, and forged iron implements.",
    eboSacrificeHa: "Doyan gashe, man ja, dodon kodi da kayan aiki na karfe.",
    spiritualWarningFr: "Éviter les querelles d'héritage et les disputes de terres.",
    spiritualWarningEn: "Avoid land disputes and sibling quarrels over inheritance.",
    spiritualWarningHa: "Nisantar jayayya a kan fili ko gadon iyaye.",
    tabooEwoFr: "Interdiction de jurer faussement sur le fer ou d'enjamber des outils coupants.",
    tabooEwoEn: "Never swear falsely on iron or step over sharp blades.",
    tabooEwoHa: "Nisantar rantsuwar karya a kan karfe."
  },
  {
    id: 'osa-meji',
    nameYoruba: 'Ọ̀sá Méjì',
    nameFon: 'Sa Meji',
    codeRight: [2, 1, 1, 1],
    codeLeft: [2, 1, 1, 1],
    isMeji: true,
    element: 'air',
    orishaRuling: 'Oya & Iyaami Osoronga (Les Mères Spirituelles)',
    proverbFr: "Le vent de tempête emporte les illusions et révèle la vérité cachée.",
    proverbEn: "The gusting storm sweeps away illusions to reveal naked truth.",
    proverbHa: "Guguwar iska tana share rudu domin bayyana gaskiyar al'amari.",
    itanStoryFr: "Osa Meji est le maître des forces mystiques féminines, de l'astral, du voyage chamanique et de la protection contre la sorcellerie.",
    itanStoryEn: "Osa Meji commands feminine mystical forces, astral planes, and defense against dark magic.",
    itanStoryHa: "Osa Meji yana nuna kariya daga asirin mata da samun nasarar ruhi.",
    eboSacrificeFr: "Poule noire, œufs frais de poule indigène, huile de palme rouge et noix d'acajou.",
    eboSacrificeEn: "Black hen, fresh native eggs, red palm oil, and mahogany nuts.",
    eboSacrificeHa: "Kaza baka, kwan kaza na gida, man ja da goro.",
    spiritualWarningFr: "Rendre hommage continuel aux mères et aux aînées spirituelles.",
    spiritualWarningEn: "Offer continual reverence to elder women and spiritual mothers.",
    spiritualWarningHa: "Girmama mata tsofaffi da neman addu'arsu.",
    tabooEwoFr: "Interdiction de maltraiter les oiseaux de nuit ou de se moquer des femmes âgées.",
    tabooEwoEn: "Do not harm nocturnal birds or mock elder women.",
    tabooEwoHa: "Nisantar cutar da tsuntsayen dare ko wulakanta tsofaffi."
  },
  {
    id: 'ika-meji',
    nameYoruba: 'Ìká Méjì',
    nameFon: 'Ka Meji',
    codeRight: [2, 1, 2, 2],
    codeLeft: [2, 1, 2, 2],
    isMeji: true,
    element: 'water',
    orishaRuling: 'Oshunmare (Le Serpent Arc-en-Ciel)',
    proverbFr: "Le serpent qui connaît sa force n'a pas besoin de mordre sans raison.",
    proverbEn: "The serpent conscious of its power needs not strike without cause.",
    proverbHa: "Macijin da ya san karfinsa ba ya sara ba tare da dalili ba.",
    itanStoryFr: "Ika Meji apporte la longévité, la maîtrise de soi, la neutralisation du venin des traîtres et la prospérité enveloppante.",
    itanStoryEn: "Ika Meji brings longevity, self-restraint, antidote to betrayal, and wealth.",
    itanStoryHa: "Ika Meji yana kawo tsawon rai, kamun kai da kariya daga maciya amana.",
    eboSacrificeFr: "Tissu multicolore, maïs blanc cuit, escargots et beurre végétal.",
    eboSacrificeEn: "Multicolored cloth, cooked white corn, snails, and vegetable butter.",
    eboSacrificeHa: "Kyalle mai launuka daban-daban, dafaffen masara da man shanu.",
    spiritualWarningFr: "Ne jamais comploter dans l'ombre contre autrui.",
    spiritualWarningEn: "Never plot stealthy malice against your neighbor.",
    spiritualWarningHa: "Kada ka kulla wa wani sharri a boye.",
    tabooEwoFr: "Interdiction de tuer les serpents non venimeux ou de porter du poison sur soi.",
    tabooEwoEn: "Do not kill non-venomous serpents or handle toxic poisons.",
    tabooEwoHa: "Nisantar kashe maciji mara dafi ba tare da dalili ba."
  },
  {
    id: 'oturupon-meji',
    nameYoruba: 'Òtúrúpọ̀n Méjì',
    nameFon: 'Trupin Meji',
    codeRight: [2, 2, 1, 2],
    codeLeft: [2, 2, 1, 2],
    isMeji: true,
    element: 'earth',
    orishaRuling: 'Babalu Aye & Osanyin (Guérison & Santé)',
    proverbFr: "Le corps guéri est le temple le plus précieux offert par Olodumare.",
    proverbEn: "The healed body is the most precious sanctuary bestowed by Olodumare.",
    proverbHa: "Jiki mai lafiya shine babban dakin ibada da Allah Ya bayar.",
    itanStoryFr: "Oturupon Meji est le médecin divin, chassant les épidémies, restaurant la vitalité des os et bénissant les nouveau-nés.",
    itanStoryEn: "Oturupon Meji is the divine physician, quelling pestilence and blessing newborn vitality.",
    itanStoryHa: "Oturupon Meji shine likitan samaniya, mai yaye cututtuka da sanya lafiya.",
    eboSacrificeFr: "Haricots rouges cuits (ekuru), huile de palme, eau de coco et tissu jaune.",
    eboSacrificeEn: "Cooked red beans (ekuru), palm oil, coconut water, and yellow cloth.",
    eboSacrificeHa: "Dafaffen wake, man ja, ruwan kwakwa da kyalle mai ruwan dorawa.",
    spiritualWarningFr: "Prendre un soin méticuleux de son hygiène et de sa santé.",
    spiritualWarningEn: "Maintain meticulous cleanliness and bodily wellness.",
    spiritualWarningHa: "Kula da tsaftar jiki da abinci a kowane lokaci.",
    tabooEwoFr: "Interdiction de consommer de la viande avariée ou d'ignorer les remèdes des sages.",
    tabooEwoEn: "Never consume spoiled meat or dismiss herbal wisdom.",
    tabooEwoHa: "Nisantar cin naman da ya lalace."
  },
  {
    id: 'otura-meji',
    nameYoruba: 'Òtúrá Méjì',
    nameFon: 'Tula Meji',
    codeRight: [1, 2, 1, 1],
    codeLeft: [1, 2, 1, 1],
    isMeji: true,
    element: 'air',
    orishaRuling: 'Orunmila & Al-Iman (Sagesse de l\'Islam & d\'Ifa)',
    proverbFr: "La paix du cœur est le tapis de prière sur lequel descendent les anges.",
    proverbEn: "Heartfelt peace is the prayer rug upon which celestial messengers descend.",
    proverbHa: "Zaman lafiyar zuciya shine daddumar da mala'iku ke sauka a kai.",
    itanStoryFr: "Otura Meji symbolise la paix universelle, la spiritualité élevée, la victoire de l'intellect et la réconciliation des peuples.",
    itanStoryEn: "Otura Meji stands for universal peace, spiritual elevation, and communal reconciliation.",
    itanStoryHa: "Otura Meji yana nuna zaman lafiya, daukakar ilimi da hadin kan jama'a.",
    eboSacrificeFr: "Chapelet de prière (tasbih), boubou blanc, dattes sucrées, lait et 16 cauris.",
    eboSacrificeEn: "Prayer beads (tasbih), white tunic, sweet dates, fresh milk, and 16 cowries.",
    eboSacrificeHa: "Carbi, farar jabba, dabino mai zaki, madara da farin kyalle.",
    spiritualWarningFr: "Pratiquer le pardon et chasser toute rancune du cœur.",
    spiritualWarningEn: "Practice forgiveness and root out bitterness.",
    spiritualWarningHa: "Yafiya ga wadanda suka yi maka laifi da cire gaba a zuciya.",
    tabooEwoFr: "Interdiction de consommer de l'alcool ou de trahir un serment religieux.",
    tabooEwoEn: "Do not consume intoxicants or breach sacred oaths.",
    tabooEwoHa: "Nisantar shan barasa da karya alkawari."
  },
  {
    id: 'irete-meji',
    nameYoruba: 'Ìrẹtẹ̀ Méjì',
    nameFon: 'Lete Meji',
    codeRight: [1, 1, 2, 1],
    codeLeft: [1, 1, 2, 1],
    isMeji: true,
    element: 'water',
    orishaRuling: 'Osanyin & Yemoja',
    proverbFr: "Celui qui écrase les herbes médicinales avec respect reçoit le don de guérison.",
    proverbEn: "He who crushes sacred herbs with devotion receives the mantle of healing.",
    proverbHa: "Wanda ya san darajar ganyen itatuwa yana samun maganin kowace cuta.",
    itanStoryFr: "Irete Meji est la maîtrise des plantes sacrées, de la résurrection des projets oubliés et de la victoire sur la lèpre spirituelle.",
    itanStoryEn: "Irete Meji governs herbal mastery, revamping dormant projects, and defeating spiritual decay.",
    itanStoryHa: "Irete Meji yana nuna ilimin magungunan gargajiya da farfado da al'amuran da suka mutu.",
    eboSacrificeFr: "Feuilles médicinales fraîches, poisson séché, huile de palme et calebasse d'eau.",
    eboSacrificeEn: "Fresh healing leaves, dried fish, red palm oil, and a water gourd.",
    eboSacrificeHa: "Ganyen magani mai laushi, busasshen kifi, man ja da kwaryar ruwa.",
    spiritualWarningFr: "Respecter la nature et ne jamais polluer les cours d'eau.",
    spiritualWarningEn: "Respect ecology and never pollute living waterways.",
    spiritualWarningHa: "Girmama halittar kasa da rashin gurbata ruwan kogi.",
    tabooEwoFr: "Interdiction de couper un arbre fruitier sans faire une offrande.",
    tabooEwoEn: "Do not fell fruit-bearing trees without prayerful offering.",
    tabooEwoHa: "Nisantar sare bishiya mai 'ya'ya ba tare da bukata ba."
  },
  {
    id: 'ose-meji',
    nameYoruba: 'Ọ̀sẹ́ Méjì',
    nameFon: 'Ce Meji',
    codeRight: [1, 2, 1, 2],
    codeLeft: [1, 2, 1, 2],
    isMeji: true,
    element: 'water',
    orishaRuling: 'Osun (Beauté, Amour & Richesse)',
    proverbFr: "La rivière qui chante attire les poissons et enrichit le pêcheur patient.",
    proverbEn: "The singing river gathers silver fish to enrich the patient fisher.",
    proverbHa: "Kogin da ke kwarara cikin dadi yana tara kifi mai albarka ga mai kamun kifi.",
    itanStoryFr: "Ose Meji est l'Odu de l'amour éclatant, de l'art, de la fertilité féminine, de la richesse ornementale et de la victoire sur les rivaux.",
    itanStoryEn: "Ose Meji is the beacon of radiant love, arts, feminine fertility, and joyful wealth.",
    itanStoryHa: "Ose Meji yana nuna soyayya mai dadi, kyawun fuska, haihuwa da arzikin zinare.",
    eboSacrificeFr: "Miel d'or, 5 œufs indigènes, parfum de fleurs douces, tissu jaune soyeux.",
    eboSacrificeEn: "Golden honey, 5 native eggs, floral perfume, and silky yellow cloth.",
    eboSacrificeHa: "Zuma mai kyau, kwan kaza 5, turare mai kamshi da kyalle mai launin zinare.",
    spiritualWarningFr: "Rester fidèle dans ses engagements d'amour et de partenariat.",
    spiritualWarningEn: "Remain loyal in romantic and business covenants.",
    spiritualWarningHa: "Riko da amana a cikin soyayya da abokantaka.",
    tabooEwoFr: "Interdiction de porter des vêtements sales ou de se baigner dans de l'eau croupie.",
    tabooEwoEn: "Do not wear soiled garments or bathe in stagnant waters.",
    tabooEwoHa: "Nisantar sanya kaya marasa tsafta ko wanka da ruwan kaba."
  },
  {
    id: 'ofun-meji',
    nameYoruba: 'Òfún Méjì (Òràngún Méjì)',
    nameFon: 'Fun Meji',
    codeRight: [2, 1, 2, 1],
    codeLeft: [2, 1, 2, 1],
    isMeji: true,
    element: 'air',
    orishaRuling: 'Oduduwa & Obatala (Les Grands Patriarches)',
    proverbFr: "Le blanc pur ne craint aucune teinture ; la bénédiction divine surpasse tous les obstacles.",
    proverbEn: "Pure white fears no dye; divine blessings outshine all earthly hurdles.",
    proverbHa: "Fari tsantsa ba ya tsoron rini; albarkar Allah ta fi gaban duk wani cikas.",
    itanStoryFr: "Ofun Meji est la matrice créatrice primordiale de laquelle tous les 256 Odus sont nés. Il apporte la délivrance miraculeuse et l'élévation suprême.",
    itanStoryEn: "Ofun Meji is the primordial womb from which all 256 Odus originated, delivering miraculous breakthroughs.",
    itanStoryHa: "Ofun Meji shine asalin dukkan Odus 256, yana kawo bude kofa na ban mamaki da daukaka.",
    eboSacrificeFr: "16 boules de craie blanche (efun), tissu blanc de soie, lait de chamelle ou de vache, beurre de karité.",
    eboSacrificeEn: "16 white chalk spheres (efun), white silk cloth, pure milk, and shea butter.",
    eboSacrificeHa: "Allura fari guda 16, farin kyalle, madara mai tsafta da man kadanya.",
    spiritualWarningFr: "Bannir tout acte d'injustice ; vivre dans une pureté morale exemplaire.",
    spiritualWarningEn: "Eradicate injustice; live in impeccable moral uprightness.",
    spiritualWarningHa: "Nisantar zalunci da zama a kan gaskiya da tsarki.",
    tabooEwoFr: "Interdiction formelle de manger du sel en excès ou de jurer sur son père.",
    tabooEwoEn: "Avoid excess salt and never swear falsely on your father's name.",
    tabooEwoHa: "Nisantar yawan gishiri da rantsuwa da sunan iyaye."
  }
];

export const IFA_MEJI_MAP = new Map<string, IfaOduDetail>(
  IFA_16_MEJI_ODUS.map(o => [o.id, o])
);

// Function to construct one of the 256 Odus from right and left 4-dot codes
export function getOduByCodes(rightCode: [number, number, number, number], leftCode: [number, number, number, number]): IfaOduDetail {
  const rStr = rightCode.join('-');
  const lStr = leftCode.join('-');

  const rightMeji = CLASSICAL_16_FIGURES.find(f => f.code === rStr) || CLASSICAL_16_FIGURES[0];
  const leftMeji = CLASSICAL_16_FIGURES.find(f => f.code === lStr) || CLASSICAL_16_FIGURES[0];

  // If both legs are identical, return the pure Meji
  if (rStr === lStr) {
    const mejiFound = IFA_16_MEJI_ODUS.find(m => m.codeRight.join('-') === rStr);
    if (mejiFound) return mejiFound;
  }

  // Combined Amulu Odu (Mixed Odu)
  const combinedName = `${rightMeji.ifaName.replace(' Meji', '')} - ${leftMeji.ifaName.replace(' Meji', '')}`;

  return {
    id: `amulu-${rightMeji.id}-${leftMeji.id}`,
    nameYoruba: combinedName,
    nameFon: `${rightMeji.sikidyName} / ${leftMeji.sikidyName}`,
    codeRight: rightCode,
    codeLeft: leftCode,
    isMeji: false,
    element: rightMeji.element,
    orishaRuling: `${rightMeji.rulingPlanetFr} & ${leftMeji.rulingPlanetFr}`,
    proverbFr: `La jambe droite (${rightMeji.nameFr}) invite la jambe gauche (${leftMeji.nameFr}) pour franchir le fleuve sans péril.`,
    proverbEn: `The right leg (${rightMeji.nameEn}) calls upon the left leg (${leftMeji.nameEn}) to cross the raging river safely.`,
    proverbHa: `Kafar dama (${rightMeji.nameHa}) tana taimaka wa kafar hagu (${leftMeji.nameHa}) domin tsallaka kogi lafiya.`,
    itanStoryFr: `Cet Odu composé unit la puissance de ${rightMeji.nameFr} et la réceptivité de ${leftMeji.nameFr}. Il présage une période de transition où la stratégie et les alliances priment sur la force brute.`,
    itanStoryEn: `This combined Odu blends the impulse of ${rightMeji.nameEn} with the receptivity of ${leftMeji.nameEn}, signaling strategic diplomacy.`,
    itanStoryHa: `Wannan Odu yana hada karfin ${rightMeji.nameHa} da saukin ${leftMeji.nameHa}. Yana nuna lokacin samun nasara ta hanyar hikima da hadin kai.`,
    eboSacrificeFr: `Aumône de fruits mûrs, 8 cauris, huile de palme et libation d'eau fraîche au pied d'un grand arbre.`,
    eboSacrificeEn: `Offering of ripe fruits, 8 cowries, palm oil, and fresh water libation at the root of a sturdy tree.`,
    eboSacrificeHa: `Sadakar 'ya'yan itace masu zaki, farin kyalle, man ja da ruwan sha mai tsafta.`,
    spiritualWarningFr: `Éviter de précipiter les décisions importantes sans consultation.`,
    spiritualWarningEn: `Avoid hasty decisions without proper council and reflection.`,
    spiritualWarningHa: `Kada ka yanke shawara da garaje ba tare da neman shawara ba.`,
    tabooEwoFr: `Ne pas marcher la nuit sans lumière et respecter les promesses faites.`,
    tabooEwoEn: `Do not walk in utter darkness without light and keep vows unbroken.`,
    tabooEwoHa: `Nisantar tafiya a cikin duhu ba tare da haske ba da cika alkawari.`
  };
}

// ----------------------------------------------------
// HAKATA (Shona Divination Tablets of Southern Africa)
// ----------------------------------------------------
export interface HakataTablet {
  id: 'kwami' | 'chilume' | 'nokwara' | 'chitokwadzima';
  name: string;
  archetypeFr: string;
  archetypeEn: string;
  archetypeHa: string;
  symbolMeaningFr: string;
  symbolMeaningEn: string;
  symbolMeaningHa: string;
}

export const HAKATA_TABLETS: HakataTablet[] = [
  {
    id: 'kwami',
    name: 'Kwami (L\'Homme Aîné / Le Patriarche)',
    archetypeFr: 'Autorité, Sagesse Paternelle, Stabilité, Force',
    archetypeEn: 'Authority, Paternal Wisdom, Stability, Strength',
    archetypeHa: 'Sarauta, Hikimar Iyaye Maza, Tabbata da Karfi',
    symbolMeaningFr: 'Gravure de motifs géométriques solaires représentant la souveraineté.',
    symbolMeaningEn: 'Carved solar geometric motifs signifying leadership.',
    symbolMeaningHa: 'Zanen rana mai nuna shugabanci da kwarjini.'
  },
  {
    id: 'chilume',
    name: 'Chilume (Le Jeune Guerrier / Le Chasseur)',
    archetypeFr: 'Action Rapide, Conquête, Énergie, Audace',
    archetypeEn: 'Swift Action, Conquest, Vitality, Boldness',
    archetypeHa: 'Jaruntaka, Farauta, Kuzari da Zafin Nama',
    symbolMeaningFr: 'Gravure de pointes de sagaie et de chevrons représentant le mouvement.',
    symbolMeaningEn: 'Carved spearheads and chevrons signifying forward motion.',
    symbolMeaningHa: 'Zanen mashi mai nuna motsi da yaki.'
  },
  {
    id: 'nokwara',
    name: 'Nokwara (La Mère Bienveillante / La Matrice)',
    archetypeFr: 'Fécondité, Protection Maternelle, Guérison, Foyer',
    archetypeEn: 'Fertility, Maternal Shielding, Healing, Sanctuary',
    archetypeHa: 'Haihuwa, Kariya ta Uwa, Lafiya da Gida',
    symbolMeaningFr: 'Gravure de sillons fertiles et de graines représentant la vie.',
    symbolMeaningEn: 'Carved fertile furrows and seeds signifying genesis.',
    symbolMeaningHa: 'Zanen kasa mai albarka da kwayoyin shuka.'
  },
  {
    id: 'chitokwadzima',
    name: 'Chitokwadzima (Le Vieillard Ancêtre / Le Seuil)',
    archetypeFr: 'Transition, Fin de Cycle, Mystère de l\'Au-delà, Patience',
    archetypeEn: 'Transition, Cycle\'s End, Ancestral Veil, Patience',
    archetypeHa: 'Karshen Zamani, Sirrin Boye, Hakuri da Kakanni',
    symbolMeaningFr: 'Gravure de spirales et de cercles sacrés représentant le passage.',
    symbolMeaningEn: 'Carved sacred spirals and concentric circles signifying passage.',
    symbolMeaningHa: 'Zanen karkata mai nuna wucewar zamani.'
  }
];

export interface HakataThrowResult {
  tabletsUp: string[]; // Face up IDs
  tabletsDown: string[]; // Face down IDs
  combinationNameFr: string;
  combinationNameEn: string;
  combinationNameHa: string;
  oracularMessageFr: string;
  oracularMessageEn: string;
  oracularMessageHa: string;
  recommendationFr: string;
  recommendationEn: string;
  recommendationHa: string;
}

export function evaluateHakataThrow(states: [boolean, boolean, boolean, boolean]): HakataThrowResult {
  // states: [kwami, chilume, nokwara, chitokwadzima]
  const [kwami, chilume, nokwara, chitokwadzima] = states;
  const countUp = states.filter(Boolean).length;

  if (countUp === 4) {
    return {
      tabletsUp: ['kwami', 'chilume', 'nokwara', 'chitokwadzima'],
      tabletsDown: [],
      combinationNameFr: "Mutatu Suprême (Les 4 Tablettes Ouvertes)",
      combinationNameEn: "Supreme Mutatu (All 4 Tablets Open)",
      combinationNameHa: "Mutatu na Daukaka (Dukkan Alluna 4 a Bude)",
      oracularMessageFr: "Bénédiction totale et unanime des Ancêtres et des Éléments. Tout projet entrepris sous ce jet est couronné de gloire.",
      oracularMessageEn: "Total unanimous blessing from Ancestors and Elements. Every endeavor initiated under this cast will thrive.",
      oracularMessageHa: "Albarka mai girma daga kakanni da dukkan halittu. Duk abin da aka fara a wannan lokaci zai sami nasara.",
      recommendationFr: "Faire une libation d'eau pure pour remercier les esprits tutélaires.",
      recommendationEn: "Pour a pure water libation in thanksgiving to guardian spirits.",
      recommendationHa: "Zuba ruwa a kasa domin nuna godiya ga Allah da albarkar kakanni."
    };
  }

  if (countUp === 0) {
    return {
      tabletsUp: [],
      tabletsDown: ['kwami', 'chilume', 'nokwara', 'chitokwadzima'],
      combinationNameFr: "Vhumu (Toutes les Tablettes Fermées)",
      combinationNameEn: "Vhumu (All Tablets Closed)",
      combinationNameHa: "Vhumu (Dukkan Alluna a Rufe)",
      oracularMessageFr: "Silence des Ancêtres. La question posée est prématurée ou requiert un temps de recueillement et de purification.",
      oracularMessageEn: "Ancestral silence. The inquiry is premature and calls for patient purification.",
      oracularMessageHa: "Shirun kakanni. Lokacin bai yi ba tukuna, yana bukatar hakuri da addu'a.",
      recommendationFr: "Patienter 3 jours, faire une aumône et ne rien précipiter.",
      recommendationEn: "Wait 3 days, offer charity, and take no rash steps.",
      recommendationHa: "Yin hakuri na kwanaki uku tare da sadaka ba tare da garaje ba."
    };
  }

  if (kwami && nokwara && !chilume && !chitokwadzima) {
    return {
      tabletsUp: ['kwami', 'nokwara'],
      tabletsDown: ['chilume', 'chitokwadzima'],
      combinationNameFr: "Zuru / Union Royale (Père & Mère)",
      combinationNameEn: "Zuru / Royal Union (Father & Mother)",
      combinationNameHa: "Zuru / Hadin Gwiwar Iyaye (Uba da Uwa)",
      oracularMessageFr: "Harmonie parfaite du foyer, réconciliation familiale et prospérité conjugale durable.",
      oracularMessageEn: "Household harmony, matrimonial blessing, and enduring prosperity.",
      oracularMessageHa: "Zaman lafiya a gida, albarkar aure da dorewar arziki.",
      recommendationFr: "Offrir un repas partagé en famille dans la joie.",
      recommendationEn: "Share a joyful meal with family members.",
      recommendationHa: "Ciyar da iyali abinci mai dadi cikin farinciki."
    };
  }

  if (chilume && !kwami && !nokwara && !chitokwadzima) {
    return {
      tabletsUp: ['chilume'],
      tabletsDown: ['kwami', 'nokwara', 'chitokwadzima'],
      combinationNameFr: "Lumwe / Le Guerrier Solitaire",
      combinationNameEn: "Lumwe / The Solitary Warrior",
      combinationNameHa: "Lumwe / Jarumi Shi Kadai",
      oracularMessageFr: "Action rapide et courage nécessaire. Vous devez vous battre seul pour remporter cette victoire.",
      oracularMessageEn: "Swift action and boldness required. You must fight independently to claim victory.",
      oracularMessageHa: "Yin aiki da gaggawa da jaruntaka. Dole ne ka tsaya da kafafunka don samun nasara.",
      recommendationFr: "Faire preuve de fermeté et ne point hésiter.",
      recommendationEn: "Maintain firm resolve without vacillation.",
      recommendationHa: "Dage da azama ba tare da tsoro ba."
    };
  }

  // Generic composite
  const upNames = states.map((s, idx) => s ? HAKATA_TABLETS[idx].name : null).filter(Boolean);
  return {
    tabletsUp: states.map((s, idx) => s ? HAKATA_TABLETS[idx].id : '').filter(Boolean),
    tabletsDown: states.map((s, idx) => !s ? HAKATA_TABLETS[idx].id : '').filter(Boolean),
    combinationNameFr: `Combinaison ${upNames.length} Tablettes (${upNames.join(', ')})`,
    combinationNameEn: `Combination ${upNames.length} Tablets (${upNames.join(', ')})`,
    combinationNameHa: `Hadin Alluna ${upNames.length} (${upNames.join(', ')})`,
    oracularMessageFr: `Les forces en jeu combinent l'action des archétypes ouverts. Les Ancêtres demandent discernement et alignement moral.`,
    oracularMessageEn: `The prevailing forces blend the active open archetypes, requiring clear moral alignment.`,
    oracularMessageHa: `Karfin da ke aiki yana hada albarkar allunan da suka bude. Ana bukatar adalci da natsuwa.`,
    recommendationFr: "Consulter votre for intérieur et méditer avant d'agir.",
    recommendationEn: "Reflect deeply and meditate before acting.",
    recommendationHa: "Yin nazari a zuciya da addu'a kafin yanke shawara."
  };
}

// ----------------------------------------------------
// SIKIDY MALGACHE (Madagascar 8-Column Divination)
// ----------------------------------------------------
export interface SikidyHouse {
  id: string;
  nameMalagasy: string;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  figure: Geomantic16Figure;
  meaningFr: string;
  meaningEn: string;
  meaningHa: string;
}

export function computeSikidyMalgache(houses: Geomantic16Figure[]): SikidyHouse[] {
  // 16 classical houses mapped to Sikidy Antemoro terms
  const sikidyNames = [
    { m: 'Tale', fr: "Le Consultant / Le Questionneur (Tale)", en: "The Seeker / Querent (Tale)", ha: "Mai Tambaya (Tale)" },
    { m: 'Maly', fr: "La Richesse / Les Biens (Maly)", en: "Wealth & Possessions (Maly)", ha: "Dukiya da Kaya (Maly)" },
    { m: 'Ryhianja', fr: "Les Frères / L'Entourage (Ryhianja)", en: "Brothers & Companions (Ryhianja)", ha: "Yan'uwa da Abokan Zama (Ryhianja)" },
    { m: 'Bilady', fr: "La Terre / Le Foyer / La Tombe (Bilady)", en: "Earth / Home / Ancestral Land (Bilady)", ha: "Kasa / Gida / Tushen Iyaye (Bilady)" },
    { m: 'Fianakaviana', fr: "Les Enfants / La Lignée (Fianakaviana)", en: "Children & Lineage (Fianakaviana)", ha: "Yara da Zuriya (Fianakaviana)" },
    { m: 'Abily', fr: "La Maladie / Les Serviteurs (Abily)", en: "Illness / Ailments (Abily)", ha: "Cuta da Masu Yi Maka Aiki (Abily)" },
    { m: 'Alisany', fr: "L'Épouse / Le Conjoint (Alisany)", en: "Spouse & Partner (Alisany)", ha: "Abokin Aure da Hadin Gwiwa (Alisany)" },
    { m: 'Fahavalo', fr: "L'Ennemi / La Mort (Fahavalo)", en: "The Enemy / Demise (Fahavalo)", ha: "Makiya da Mutuwa (Fahavalo)" },
    { m: 'Fahasivy', fr: "L'Esprit / Le Voyage Lointain (Fahasivy)", en: "Spirit / Distant Journey (Fahasivy)", ha: "Ruhi da Tafiyar Nesa (Fahasivy)" },
    { m: 'Haja', fr: "Le Roi / L'Honneur / Le Destin (Haja)", en: "The Sovereign / Honor (Haja)", ha: "Sarki da Daukaka (Haja)" },
    { m: 'Hary', fr: "L'Espoir / Les Alliés Fidèles (Hary)", en: "Hope & Loyal Friends (Hary)", ha: "Fata da Masoya (Hary)" },
    { m: 'Tohan-drazana', fr: "L'Épreuve Cachée / La Prison (Tohan-drazana)", en: "Hidden Trial / Prison (Tohan-drazana)", ha: "Kullewa da Wahala ta Boye" },
    { m: 'Asorotany', fr: "Le Juge de la Terre (Asorotany)", en: "Judge of the Earth (Asorotany)", ha: "Alkalin Kasa (Asorotany)" },
    { m: 'Tovovavy', fr: "La Demoiselle Céleste (Tovovavy)", en: "The Celestial Maiden (Tovovavy)", ha: "Yarinya ta Samaniya (Tovovavy)" },
    { m: 'Sikidy Valo', fr: "L'Arbitre Suprême (Sikidy Valo)", en: "Supreme Arbitrator (Sikidy Valo)", ha: "Babban Alkali (Sikidy Valo)" },
    { m: 'Kiba', fr: "La Clôture du Destin (Kiba)", en: "Destiny's Closure (Kiba)", ha: "Rufewar Kaddara (Kiba)" }
  ];

  return houses.map((fig, idx) => ({
    id: `sikidy-${idx + 1}`,
    nameMalagasy: sikidyNames[idx].m,
    nameFr: sikidyNames[idx].fr,
    nameEn: sikidyNames[idx].en,
    nameHa: sikidyNames[idx].ha,
    figure: fig,
    meaningFr: `${fig.nameFr} dans la maison de ${sikidyNames[idx].m}. Indique une influence ${fig.nature} gouvernée par ${fig.element.toUpperCase()}.`,
    meaningEn: `${fig.nameEn} in the mansion of ${sikidyNames[idx].m}. Indicates ${fig.nature} movement under ${fig.element.toUpperCase()} forces.`,
    meaningHa: `${fig.nameHa} a cikin gidan ${sikidyNames[idx].m}. Yana nuna dabi'ar ${fig.nature} a karkashin yanayin ${fig.element.toUpperCase()}.`
  }));
}

// ----------------------------------------------------
// ODU DE NAISSANCE (Ifa Astro / Odu Ori)
// ----------------------------------------------------
export interface OduBirthResult {
  clientName: string;
  birthDate: string;
  oduOri: IfaOduDetail;
  guardianOrisha: string;
  soulElementFr: string;
  soulElementEn: string;
  soulElementHa: string;
  destinyPathFr: string;
  destinyPathEn: string;
  destinyPathHa: string;
  dailyTabooFr: string;
  dailyTabooEn: string;
  dailyTabooHa: string;
}

export function computeOduBirth(name: string, birthDate: string): OduBirthResult {
  // Hash name and date into index 0..15
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  if (birthDate) {
    birthDate.replace(/\D/g, '').split('').forEach(d => {
      sum += parseInt(d, 10) || 0;
    });
  }

  const oduIndex = sum % 16;
  const odu = IFA_16_MEJI_ODUS[oduIndex];

  return {
    clientName: name || "Chercheur de Vérité",
    birthDate: birthDate || "Aujourd'hui",
    oduOri: odu,
    guardianOrisha: odu.orishaRuling,
    soulElementFr: `Élément de l'Âme : ${odu.element.toUpperCase()} • Alignement Céleste`,
    soulElementEn: `Soul Element: ${odu.element.toUpperCase()} • Celestial Alignment`,
    soulElementHa: `Yanayin Ruhi: ${odu.element.toUpperCase()} • Hasken Samaniya`,
    destinyPathFr: `Votre Odu gardien de tête (Ori) est ${odu.nameYoruba}. Il confère une haute protection contre les obstacles et trace un chemin de vie orienté vers : ${odu.proverbFr}`,
    destinyPathEn: `Your head guardian Odu (Ori) is ${odu.nameYoruba}. It shields your spiritual aura and guides you with the ancestral maxim: ${odu.proverbEn}`,
    destinyPathHa: `Odu na kanka (Ori) shine ${odu.nameYoruba}. Yana zama garkuwa da shiryar da rayuwarka da wannan karin magana: ${odu.proverbHa}`,
    dailyTabooFr: odu.tabooEwoFr,
    dailyTabooEn: odu.tabooEwoEn,
    dailyTabooHa: odu.tabooEwoHa
  };
}
