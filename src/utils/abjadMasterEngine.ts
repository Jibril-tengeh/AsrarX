import { asmaListData, AsmaName } from '../data/asmaListData';

// 1. Dual Abjad Alphabet Tables
export const ABJAD_MASHRIQI: Record<string, number> = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1, 'ٱ': 1,
  'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5, 'هـ': 5,
  'و': 6, 'ؤ': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ى': 10, 'ئ': 10, 'ك': 20, 'ل': 30,
  'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80,
  'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400,
  'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900,
  'غ': 1000
};

export const ABJAD_MAGHRIBI: Record<string, number> = {
  ...ABJAD_MASHRIQI,
  // Key variations in Maghribi tradition:
  // Sa'fad (ص=60, ع=70, ف=80, ض=90)
  // Qarasat (ق=100, ر=200, س=300, ت=400)
  // Za-Gha-Shin (ظ=800, غ=900, ش=1000)
  'ص': 60,
  'ض': 90,
  'س': 300,
  'ظ': 800,
  'غ': 900,
  'ش': 1000
};

// 2. Elemental Letter Classifications (Standard Shams al-Ma'arif Order)
export type ElementType = 'fire' | 'earth' | 'air' | 'water';

export const ELEMENT_LETTERS: Record<ElementType, string[]> = {
  fire: ['ا', 'أ', 'إ', 'آ', 'ء', 'ه', 'ة', 'ط', 'م', 'ف', 'ش', 'ذ'],
  earth: ['د', 'ح', 'ل', 'ع', 'ر', 'خ', 'غ'],
  air: ['ب', 'و', 'ؤ', 'ي', 'ى', 'ئ', 'ن', 'ص', 'ت', 'ض'],
  water: ['ج', 'ز', 'ك', 'س', 'ق', 'ث', 'ظ']
};

export const LETTER_TO_ELEMENT: Record<string, ElementType> = {};
(Object.keys(ELEMENT_LETTERS) as ElementType[]).forEach((el) => {
  ELEMENT_LETTERS[el].forEach((char) => {
    LETTER_TO_ELEMENT[char] = el;
  });
});

// 3. Luminous (Nuraniyya) & Dark (Zulmaniyyah) Classification
// 14 Luminous letters: ن - ص - ح - ك - ي - م - ق - ا - ط - ع - ل - ه - س - ر ("نص حكيم قاطع له سر")
export const LUMINOUS_LETTERS = ['ا', 'أ', 'إ', 'آ', 'ء', 'ح', 'ر', 'س', 'ص', 'ط', 'ع', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'ة', 'ي', 'ى', 'ئ'];
// 14 Dark letters: ب - ت - ث - ج - خ - د - ذ - ز - ش - ض - ظ - غ - ف - و
export const DARK_LETTERS = ['ب', 'ت', 'ث', 'ج', 'خ', 'د', 'ذ', 'ز', 'ش', 'ض', 'ظ', 'غ', 'ف', 'و', 'ؤ'];

export function isLuminous(char: string): boolean {
  return LUMINOUS_LETTERS.includes(char);
}

export function isDark(char: string): boolean {
  return DARK_LETTERS.includes(char);
}

// 4. Dotless (Muhmalah) vs Dotted (Mu'jamah) classification
export const DOTTED_LETTERS = ['ب', 'ت', 'ث', 'ج', 'خ', 'ذ', 'ز', 'ش', 'ض', 'ظ', 'غ', 'ف', 'ق', 'ن', 'ي', 'ئ', 'ة', 'ؤ'];
export const DOTLESS_LETTERS = ['ا', 'أ', 'إ', 'آ', 'ء', 'د', 'ر', 'س', 'ص', 'ط', 'ع', 'ك', 'ل', 'م', 'ه', 'و', 'ى'];

// 5. Quranic Verses & Sacred Formulas Database with Precomputed Abjad Weights
export interface SacredFormulaItem {
  id: string;
  arabic: string;
  transliteration: string;
  meaningFr: string;
  meaningEn: string;
  source: string;
  abjadMashriqi: number;
  abjadMaghribi: number;
  benefit: string;
  category: 'ayat' | 'dhikr' | 'dua' | 'salawat';
}

export const SACRED_FORMULAS_DB: SacredFormulaItem[] = [
  {
    id: 'basmala',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    transliteration: 'Bismillāh ir-Rahmān ir-Rahīm',
    meaningFr: 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux',
    meaningEn: 'In the name of Allah, the Most Gracious, the Most Merciful',
    source: 'Sourate Al-Fatiha (1:1)',
    abjadMashriqi: 786,
    abjadMaghribi: 786,
    benefit: 'Clef universelle de toute ouverture, bénédiction et protection absolue.',
    category: 'ayat'
  },
  {
    id: 'tahlil',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'Lā ilāha illallāh',
    meaningFr: 'Il n\'y a de divinité digne d\'adoration qu\'Allah',
    meaningEn: 'There is no deity except Allah',
    source: 'Parole suprême du Tawhid',
    abjadMashriqi: 165,
    abjadMaghribi: 165,
    benefit: 'Purification du cœur, illumination de l\'âme et salut éternel.',
    category: 'dhikr'
  },
  {
    id: 'allah_huwa',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ',
    transliteration: 'Allāhu lā ilāha illā Huwa',
    meaningFr: 'Allah ! Point de divinité à part Lui',
    meaningEn: 'Allah - there is no deity except Him',
    source: 'Début d\'Ayat al-Kursi (2:255)',
    abjadMashriqi: 231,
    abjadMaghribi: 231,
    benefit: 'Affirmation de la souveraineté divine absolue.',
    category: 'ayat'
  },
  {
    id: 'ayat_kursi_hayy',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    transliteration: 'Allāhu lā ilāha illā Huwal-Hayyul-Qayyūm',
    meaningFr: 'Allah ! Point de divinité à part Lui, le Vivant, le Subsistant par Lui-même',
    meaningEn: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence',
    source: 'Ayat al-Kursi (2:255)',
    abjadMashriqi: 598,
    abjadMaghribi: 598,
    benefit: 'Forteresse imprenable contre tout maléfice et toute attaque occulte.',
    category: 'ayat'
  },
  {
    id: 'surah_ikhlas_1',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    transliteration: 'Qul Huwallāhu Ahad',
    meaningFr: 'Dis : « Il est Allah, Unique »',
    meaningEn: 'Say: He is Allah, [who is] One',
    source: 'Sourate Al-Ikhlas (112:1)',
    abjadMashriqi: 473,
    abjadMaghribi: 473,
    benefit: 'Équivaut au tiers du Coran en pureté monothéiste.',
    category: 'ayat'
  },
  {
    id: 'hasbunallah',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Hasbunallāhu wa ni\'mal wakīl',
    meaningFr: 'Allah nous suffit ; Il est notre meilleur garant',
    meaningEn: 'Sufficient for us is Allah, and [He is] the best Disposer of affairs',
    source: 'Sourate Ali \'Imran (3:173)',
    abjadMashriqi: 450,
    abjadMaghribi: 690, // 'س' = 300 in Maghribi
    benefit: 'Victoire sur les ennemis, délivrance des angoisses et triomphe.',
    category: 'ayat'
  },
  {
    id: 'hawqala',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    transliteration: 'Lā hawla wa lā quwwata illā billāhil-\'Aliyyil-\'Azīm',
    meaningFr: 'Il n\'y a de force ni de puissance que par Allah le Très-Haut, l\'Immense',
    meaningEn: 'There is no power nor might except with Allah, the Most High, the Supreme',
    source: 'Trésor sous le Trône Céleste',
    abjadMashriqi: 1111,
    abjadMaghribi: 1011, // 'ظ' = 800 in Maghribi
    benefit: 'Dissipe 99 portes de soucis, la plus légère étant la tristesse.',
    category: 'dhikr'
  },
  {
    id: 'inna_fatahna',
    arabic: 'إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا',
    transliteration: 'Innā fatahnā laka fathan mubīnā',
    meaningFr: 'En vérité, Nous t\'avons accordé une victoire éclatante',
    meaningEn: 'Indeed, We have given you a clear conquest',
    source: 'Sourate Al-Fath (48:1)',
    abjadMashriqi: 638,
    abjadMaghribi: 638,
    benefit: 'Ouverture grandiose dans les affaires, le commerce et l\'honneur.',
    category: 'ayat'
  },
  {
    id: 'salamun_qawlan',
    arabic: 'سَلَامٌ قَوْلًا مِنْ رَبٍّ رَحِيمٍ',
    transliteration: 'Salāmun qawlam mir-Rabbin Rahīm',
    meaningFr: '« Paix et salut ! » telle est la parole d\'un Seigneur Très Miséricordieux',
    meaningEn: '« Peace », a word from a Merciful Lord',
    source: 'Sourate Ya-Sin (36:58)',
    abjadMashriqi: 818,
    abjadMaghribi: 1058, // 'س' = 300 in Maghribi
    benefit: 'Cœur de la sourate Ya-Sin, paix intérieure et guérison des maux.',
    category: 'ayat'
  },
  {
    id: 'nur_samawat',
    arabic: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
    transliteration: 'Allāhu nūrus-samāwāti wal-ard',
    meaningFr: 'Allah est la Lumière des cieux et de la terre',
    meaningEn: 'Allah is the Light of the heavens and the earth',
    source: 'Sourate An-Nur (24:35)',
    abjadMashriqi: 682,
    abjadMaghribi: 922,
    benefit: 'Clairvoyance spirituelle (Kashf) et illumination de la pensée.',
    category: 'ayat'
  },
  {
    id: 'rabbi_inni_lima',
    arabic: 'رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',
    transliteration: 'Rabbi innī limā anzalta ilayya min khayrin faqīr',
    meaningFr: 'Seigneur, j\'ai grand besoin du bien que Tu feras descendre sur moi',
    meaningEn: 'My Lord, indeed I am, for whatever good You would send down to me, in need',
    source: 'Invocation de Moïse (28:24)',
    abjadMashriqi: 1456,
    abjadMaghribi: 1456,
    benefit: 'Attire subsistance immédiate, travail et mariage harmonieux.',
    category: 'dua'
  },
  {
    id: 'wa_ufawwidu',
    arabic: 'وَأُفَوِّضُ أَمْرِي إِلَى اللَّهِ',
    transliteration: 'Wa ufawwidu amrī ilallāh',
    meaningFr: 'Et je confie mon sort à Allah',
    meaningEn: 'And I entrust my affair to Allah',
    source: 'Sourate Ghafir (40:44)',
    abjadMashriqi: 571,
    abjadMaghribi: 571,
    benefit: 'Rempart invincible contre les complots et les ruses humaines.',
    category: 'ayat'
  },
  {
    id: 'inshirah_yusr',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    transliteration: 'Fa inna ma\'al-\'usri yusrā',
    meaningFr: 'À côté de la difficulté est certes une facilité !',
    meaningEn: 'For indeed, with hardship [will be] ease',
    source: 'Sourate Ash-Sharh (94:5)',
    abjadMashriqi: 475,
    abjadMaghribi: 715,
    benefit: 'Soulagement après les blocages et dénouement des épreuves.',
    category: 'ayat'
  },
  {
    id: 'nasrun_minallah',
    arabic: 'نَصْرٌ مِنَ اللَّهِ وَفَتْحٌ قَرِيبٌ',
    transliteration: 'Nasrun minallāhi wa fathun qarīb',
    meaningFr: 'Un secours venant d\'Allah et une victoire prochaine',
    meaningEn: 'Help from Allah and an imminent victory',
    source: 'Sourate As-Saff (61:13)',
    abjadMashriqi: 848,
    abjadMaghribi: 848,
    benefit: 'Victoire rapide, succès aux examens et concours.',
    category: 'ayat'
  },
  {
    id: 'ya_latif',
    arabic: 'يَا لَطِيفُ',
    transliteration: 'Yā Latīf',
    meaningFr: 'Ô Bienveillant et Subtil',
    meaningEn: 'O Most Gentle and Subtle',
    source: 'Nom Divin Majeur',
    abjadMashriqi: 129,
    abjadMaghribi: 129,
    benefit: 'Apaisement instantané des crises et bonté miraculeuse.',
    category: 'dhikr'
  },
  {
    id: 'ya_wadud',
    arabic: 'يَا وَدُودُ',
    transliteration: 'Yā Wadūd',
    meaningFr: 'Ô Tout-Aimant',
    meaningEn: 'O Loving One',
    source: 'Nom Divin de l\'Amour',
    abjadMashriqi: 31,
    abjadMaghribi: 31,
    benefit: 'Attraction de la bienveillance, affection sincère et entente.',
    category: 'dhikr'
  },
  {
    id: 'ya_razzaq',
    arabic: 'يَا رَزَّاقُ',
    transliteration: 'Yā Razzāq',
    meaningFr: 'Ô Dispensateur suprême de la subsistance',
    meaningEn: 'O Supreme Provider',
    source: 'Nom Divin de l\'Abondance',
    abjadMashriqi: 319,
    abjadMaghribi: 319,
    benefit: 'Ouverture des portes financières et flux ininterrompu de bienfaits.',
    category: 'dhikr'
  },
  {
    id: 'ya_fattah',
    arabic: 'يَا فَتَّاحُ',
    transliteration: 'Yā Fattāh',
    meaningFr: 'Ô Grand Ouvrier des portes du succès',
    meaningEn: 'O Opener of all Gates',
    source: 'Nom Divin de la Victoire',
    abjadMashriqi: 499,
    abjadMaghribi: 499,
    benefit: 'Débloque les situations désespérées et ouvre les opportunités.',
    category: 'dhikr'
  },
  {
    id: 'salawat_fatih',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ',
    transliteration: 'Allāhumma salli \'alā sayyidinā Muhammadin al-Fātihi limā ughliq',
    meaningFr: 'Ô Allah, prie sur notre Maître Muhammad, qui ouvre ce qui était fermé',
    meaningEn: 'O Allah, send blessings upon our Master Muhammad, the Opener of what was closed',
    source: 'Salat al-Fatih (Prière d\'Ouverture)',
    abjadMashriqi: 1144,
    abjadMaghribi: 1384,
    benefit: 'Élévation spirituelle suprême et dissolution des ténèbres intérieures.',
    category: 'salawat'
  }
];

// 6. Detailed Abjad Calculation Output
export interface CharacterBreakdown {
  char: string;
  valMashriqi: number;
  valMaghribi: number;
  element: ElementType;
  nature: 'luminous' | 'dark';
  dotted: boolean;
}

export interface WordBreakdown {
  word: string;
  valMashriqi: number;
  valMaghribi: number;
  chars: CharacterBreakdown[];
}

export interface DetailedAbjadCalculation {
  rawText: string;
  cleanText: string;
  totalMashriqi: number;
  totalMaghribi: number;
  activeSystem: 'mashriqi' | 'maghribi';
  activeTotal: number;
  wordCount: number;
  letterCount: number;
  uniqueLetterCount: number;
  words: WordBreakdown[];
  characters: CharacterBreakdown[];
  
  // Elemental Anatomy
  elemental: {
    fire: { count: number; percentage: number; weightMashriqi: number; weightMaghribi: number };
    earth: { count: number; percentage: number; weightMashriqi: number; weightMaghribi: number };
    air: { count: number; percentage: number; weightMashriqi: number; weightMaghribi: number };
    water: { count: number; percentage: number; weightMashriqi: number; weightMaghribi: number };
    dominant: ElementType;
    temperamentTitleFr: string;
    temperamentTitleEn: string;
    temperamentDescFr: string;
    temperamentDescEn: string;
  };

  // Sacred Nature (Luminous vs Dark)
  radiance: {
    luminousCount: number;
    luminousPercentage: number;
    luminousWeight: number;
    luminousChars: string[];
    darkCount: number;
    darkPercentage: number;
    darkWeight: number;
    darkChars: string[];
    ratio: number;
    statusFr: string;
    statusEn: string;
  };

  // Dotted vs Dotless
  dots: {
    dottedCount: number;
    dotlessCount: number;
    dottedPercentage: number;
  };
}

export function calculateDetailedAbjad(
  inputText: string,
  system: 'mashriqi' | 'maghribi' = 'mashriqi'
): DetailedAbjadCalculation {
  const cleanInput = inputText.trim();
  const wordsRaw = cleanInput.split(/\s+/).filter((w) => w.length > 0);

  let totalMashriqi = 0;
  let totalMaghribi = 0;
  const wordsBreakdown: WordBreakdown[] = [];
  const allCharacters: CharacterBreakdown[] = [];

  let fireCount = 0, fireWeightM = 0, fireWeightMag = 0;
  let earthCount = 0, earthWeightM = 0, earthWeightMag = 0;
  let airCount = 0, airWeightM = 0, airWeightMag = 0;
  let waterCount = 0, waterWeightM = 0, waterWeightMag = 0;

  let lumCount = 0, lumWeight = 0;
  const lumChars: string[] = [];
  let darkCount = 0, darkWeight = 0;
  const darkChars: string[] = [];

  let dottedCount = 0;
  let dotlessCount = 0;
  const uniqueCharsSet = new Set<string>();

  for (const word of wordsRaw) {
    let wordMash = 0;
    let wordMagh = 0;
    const wordChars: CharacterBreakdown[] = [];

    for (const char of word) {
      // Ignore diacritics / tashkeel and punctuation
      if (/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED\s،؟؛.!?,:;]/.test(char)) {
        continue;
      }

      const vM = ABJAD_MASHRIQI[char] || 0;
      const vMag = ABJAD_MAGHRIBI[char] || 0;

      if (vM > 0 || vMag > 0) {
        wordMash += vM;
        wordMagh += vMag;
        totalMashriqi += vM;
        totalMaghribi += vMag;
        uniqueCharsSet.add(char);

        const elem = LETTER_TO_ELEMENT[char] || 'fire';
        const isLum = isLuminous(char);
        const nature: 'luminous' | 'dark' = isLum ? 'luminous' : 'dark';
        const isDot = DOTTED_LETTERS.includes(char);

        if (elem === 'fire') { fireCount++; fireWeightM += vM; fireWeightMag += vMag; }
        else if (elem === 'earth') { earthCount++; earthWeightM += vM; earthWeightMag += vMag; }
        else if (elem === 'air') { airCount++; airWeightM += vM; airWeightMag += vMag; }
        else if (elem === 'water') { waterCount++; waterWeightM += vM; waterWeightMag += vMag; }

        if (isLum) {
          lumCount++;
          lumWeight += (system === 'maghribi' ? vMag : vM);
          if (!lumChars.includes(char)) lumChars.push(char);
        } else {
          darkCount++;
          darkWeight += (system === 'maghribi' ? vMag : vM);
          if (!darkChars.includes(char)) darkChars.push(char);
        }

        if (isDot) dottedCount++;
        else dotlessCount++;

        const charItem: CharacterBreakdown = {
          char,
          valMashriqi: vM,
          valMaghribi: vMag,
          element: elem,
          nature,
          dotted: isDot
        };

        wordChars.push(charItem);
        allCharacters.push(charItem);
      }
    }

    if (wordChars.length > 0) {
      wordsBreakdown.push({
        word,
        valMashriqi: wordMash,
        valMaghribi: wordMagh,
        chars: wordChars
      });
    }
  }

  const totalLetters = allCharacters.length;
  const safeTotal = totalLetters || 1;

  // Determine dominant element
  let dominant: ElementType = 'fire';
  let maxElemCount = fireCount;
  if (airCount > maxElemCount) { dominant = 'air'; maxElemCount = airCount; }
  if (waterCount > maxElemCount) { dominant = 'water'; maxElemCount = waterCount; }
  if (earthCount > maxElemCount) { dominant = 'earth'; maxElemCount = earthCount; }

  const temperamentData: Record<ElementType, { tFr: string; tEn: string; dFr: string; dEn: string }> = {
    fire: {
      tFr: 'Tempérament Nārī (Feu - Chaud & Sec)',
      tEn: 'Nārī Temperament (Fire - Hot & Dry)',
      dFr: 'Énergie d\'impulsion, de charisme et d\'action directe. Volonté forte, enthousiasme et autorité spirituelle. Résonance avec les Noms Divins de Puissance (Al-Qawiyy, Al-Qahhar, Al-Aziz).',
      dEn: 'Energy of drive, charisma, and direct action. Strong will, enthusiasm, and spiritual authority. Resonates with Divine Names of Power (Al-Qawiyy, Al-Qahhar, Al-Aziz).'
    },
    air: {
      tFr: 'Tempérament Hawā\'ī (Air - Chaud & Humide)',
      tEn: 'Hawā\'ī Temperament (Air - Hot & Wet)',
      dFr: 'Énergie communicative, intellectuelle et relationnelle. Éloquence, inspiration subtile et adaptabilité. Résonance avec les Noms d\'Ouverture et de Sagesse (Al-Alim, Al-Hakim, Al-Fattah).',
      dEn: 'Communicative, intellectual, and relational energy. Eloquence, subtle inspiration, and adaptability. Resonates with Names of Wisdom and Opening (Al-Alim, Al-Hakim, Al-Fattah).'
    },
    water: {
      tFr: 'Tempérament Mā\'ī (Eau - Froid & Humide)',
      tEn: 'Mā\'ī Temperament (Water - Cold & Wet)',
      dFr: 'Énergie de pureté, de réceptivité intuitive et de miséricorde. Paix intérieure, profondeur émotionnelle et régénération. Résonance avec les Noms de Grâce (Ar-Rahman, Ar-Rahim, Al-Latif).',
      dEn: 'Energy of purity, intuitive receptivity, and mercy. Inner peace, emotional depth, and regeneration. Resonates with Names of Grace (Ar-Rahman, Ar-Rahim, Al-Latif).'
    },
    earth: {
      tFr: 'Tempérament Turābī (Terre - Froid & Sec)',
      tEn: 'Turābī Temperament (Earth - Cold & Dry)',
      dFr: 'Énergie d\'ancrage, de persévérance et de concrétisation matérielle. Rigueur, patience et fidélité aux engagements. Résonance avec les Noms de Maintien (Al-Qayyum, Al-Matin, Al-Warith).',
      dEn: 'Energy of grounding, perseverance, and material realization. Rigor, patience, and loyalty. Resonates with Sustaining Names (Al-Qayyum, Al-Matin, Al-Warith).'
    }
  };

  const lumPct = totalLetters ? Math.round((lumCount / safeTotal) * 100) : 50;
  const darkPct = 100 - lumPct;

  let radianceStatusFr = 'Harmonie Équilibrée (Lumière & Réceptacle)';
  let radianceStatusEn = 'Balanced Harmony (Light & Receptacle)';
  if (lumPct >= 65) {
    radianceStatusFr = 'Haute Radiance Céleste (Dominante Nūrāniyya)';
    radianceStatusEn = 'High Celestial Radiance (Nūrāniyya Dominant)';
  } else if (lumPct <= 35) {
    radianceStatusFr = 'Ancrage & Manifestation Terrestre (Dominante Zulmāniyya)';
    radianceStatusEn = 'Grounding & Physical Manifestation (Zulmāniyya Dominant)';
  }

  return {
    rawText: inputText,
    cleanText: cleanInput,
    totalMashriqi,
    totalMaghribi,
    activeSystem: system,
    activeTotal: system === 'maghribi' ? totalMaghribi : totalMashriqi,
    wordCount: wordsBreakdown.length,
    letterCount: totalLetters,
    uniqueLetterCount: uniqueCharsSet.size,
    words: wordsBreakdown,
    characters: allCharacters,
    elemental: {
      fire: {
        count: fireCount,
        percentage: Math.round((fireCount / safeTotal) * 100),
        weightMashriqi: fireWeightM,
        weightMaghribi: fireWeightMag
      },
      earth: {
        count: earthCount,
        percentage: Math.round((earthCount / safeTotal) * 100),
        weightMashriqi: earthWeightM,
        weightMaghribi: earthWeightMag
      },
      air: {
        count: airCount,
        percentage: Math.round((airCount / safeTotal) * 100),
        weightMashriqi: airWeightM,
        weightMaghribi: airWeightMag
      },
      water: {
        count: waterCount,
        percentage: Math.round((waterCount / safeTotal) * 100),
        weightMashriqi: waterWeightM,
        weightMaghribi: waterWeightMag
      },
      dominant,
      temperamentTitleFr: temperamentData[dominant].tFr,
      temperamentTitleEn: temperamentData[dominant].tEn,
      temperamentDescFr: temperamentData[dominant].dFr,
      temperamentDescEn: temperamentData[dominant].dEn
    },
    radiance: {
      luminousCount: lumCount,
      luminousPercentage: lumPct,
      luminousWeight: lumWeight,
      luminousChars: lumChars,
      darkCount: darkCount,
      darkPercentage: darkPct,
      darkWeight: darkWeight,
      darkChars: darkChars,
      ratio: darkCount > 0 ? parseFloat((lumCount / darkCount).toFixed(2)) : lumCount,
      statusFr: radianceStatusFr,
      statusEn: radianceStatusEn
    },
    dots: {
      dottedCount,
      dotlessCount,
      dottedPercentage: Math.round((dottedCount / safeTotal) * 100)
    }
  };
}

// 7. Algorithmic Khoddam & Rūḥāniyya Generator
export interface KhoddamEntity {
  id: string;
  categoryFr: string;
  categoryEn: string;
  nameAr: string;
  nameTransliteration: string;
  suffixAr: string;
  suffixTrans: string;
  rootLetters: string;
  natureFr: string;
  natureEn: string;
  qasamInvocationAr: string;
  qasamInvocationFr: string;
  qasamInvocationEn: string;
  colorTheme: string;
}

export interface DegreeBreakdown {
  levelNameAr: string;
  levelNameFr: string;
  levelNameEn: string;
  value: number;
  letterAr: string;
  letterValue: number;
  khoddamNameAr: string;
}

export function convertNumberToAbjadLetters(num: number, system: 'mashriqi' | 'maghribi' = 'mashriqi'): string {
  if (num <= 0 || isNaN(num)) return 'ا';
  let n = Math.floor(num);
  let res = '';

  // Thousands
  while (n >= 1000) {
    res += system === 'maghribi' ? 'ش' : 'غ';
    n -= 1000;
  }

  // Hundreds
  if (n >= 900) { res += system === 'maghribi' ? 'غ' : 'ظ'; n -= 900; }
  else if (n >= 800) { res += system === 'maghribi' ? 'ظ' : 'ض'; n -= 800; }
  else if (n >= 700) { res += 'ذ'; n -= 700; }
  else if (n >= 600) { res += 'خ'; n -= 600; }
  else if (n >= 500) { res += 'ث'; n -= 500; }
  else if (n >= 400) { res += 'ت'; n -= 400; }
  else if (n >= 300) { res += system === 'maghribi' ? 'س' : 'ش'; n -= 300; }
  else if (n >= 200) { res += 'ر'; n -= 200; }
  else if (n >= 100) { res += 'ق'; n -= 100; }

  // Tens
  if (n >= 90) { res += system === 'maghribi' ? 'ض' : 'ص'; n -= 90; }
  else if (n >= 80) { res += 'ف'; n -= 80; }
  else if (n >= 70) { res += 'ع'; n -= 70; }
  else if (n >= 60) { res += system === 'maghribi' ? 'ص' : 'س'; n -= 60; }
  else if (n >= 50) { res += 'ن'; n -= 50; }
  else if (n >= 40) { res += 'م'; n -= 40; }
  else if (n >= 30) { res += 'ل'; n -= 30; }
  else if (n >= 20) { res += 'ك'; n -= 20; }
  else if (n >= 10) { res += 'ي'; n -= 10; }

  // Units
  if (n === 9) res += 'ط';
  else if (n === 8) res += 'ح';
  else if (n === 7) res += 'ز';
  else if (n === 6) res += 'و';
  else if (n === 5) res += 'ه';
  else if (n === 4) res += 'د';
  else if (n === 3) res += 'ج';
  else if (n === 2) res += 'ب';
  else if (n === 1) res += 'أ';

  return res || 'ا';
}

export function vocalizeAbjadRootLetters(letters: string): string {
  const clean = letters.replace(/[\u0640\s]/g, '');
  if (!clean) return 'أَ';
  const chars = Array.from(clean);

  if (chars.length === 1) {
    const c = chars[0] === 'ا' || chars[0] === 'إ' || chars[0] === 'آ' ? 'أ' : chars[0];
    return `${c}َ`;
  }

  let res = '';
  chars.forEach((ch, idx) => {
    let base = ch;
    if (base === 'ا' || base === 'إ' || base === 'آ') base = 'أ';

    if (idx === 0) {
      res += `${base}َ`;
    } else if (idx === 1 && chars.length >= 3 && !['أ', 'و', 'ي', 'ا'].includes(base)) {
      res += `${base}ْ`;
    } else if (idx === chars.length - 1 && !['و', 'ي', 'ا'].includes(base)) {
      res += `${base}َ`;
    } else {
      res += `${base}َ`;
    }
  });

  return res;
}

export function generateRouhaniyyaEntities(
  abjadVal: number,
  system: 'mashriqi' | 'maghribi' = 'mashriqi',
  dominantElement: ElementType = 'fire'
): {
  entities: KhoddamEntity[];
  degrees: DegreeBreakdown[];
  rootLetters: string;
  vocalizedRoot: string;
} {
  const safeVal = Math.max(1, abjadVal);
  const rootLetters = convertNumberToAbjadLetters(safeVal, system);
  const vocalizedRoot = vocalizeAbjadRootLetters(rootLetters);

  // Degrees Decomposition (Ahād, 'Asharāt, Mi'āt, Ulūf)
  const thousands = Math.floor(safeVal / 1000) * 1000;
  const hundreds = Math.floor((safeVal % 1000) / 100) * 100;
  const tens = Math.floor((safeVal % 100) / 10) * 10;
  const units = safeVal % 10;

  const degrees: DegreeBreakdown[] = [];

  if (thousands > 0) {
    const letAr = convertNumberToAbjadLetters(thousands, system);
    degrees.push({
      levelNameAr: 'مَرْتَبَةُ الأُلُوفِ (عَالَمُ الجَبَرُوتِ)',
      levelNameFr: 'Rang des Milliers (Monde du Jabarut)',
      levelNameEn: 'Thousands Degree (Jabarut Realm)',
      value: thousands,
      letterAr: letAr,
      letterValue: thousands,
      khoddamNameAr: `${vocalizeAbjadRootLetters(letAr)}يَائِيلُ`
    });
  }

  if (hundreds > 0) {
    const letAr = convertNumberToAbjadLetters(hundreds, system);
    degrees.push({
      levelNameAr: 'مَرْتَبَةُ المِئَاتِ (عَالَمُ المَلَكُوتِ)',
      levelNameFr: 'Rang des Centaines (Monde du Malakut)',
      levelNameEn: 'Hundreds Degree (Malakut Realm)',
      value: hundreds,
      letterAr: letAr,
      letterValue: hundreds,
      khoddamNameAr: `${vocalizeAbjadRootLetters(letAr)}يَائِيلُ`
    });
  }

  if (tens > 0) {
    const letAr = convertNumberToAbjadLetters(tens, system);
    degrees.push({
      levelNameAr: 'مَرْتَبَةُ العَشَرَاتِ (عَالَمُ الأَنْفُسِ)',
      levelNameFr: 'Rang des Dizaines (Monde des Âmes)',
      levelNameEn: 'Tens Degree (Anfus Realm)',
      value: tens,
      letterAr: letAr,
      letterValue: tens,
      khoddamNameAr: `${vocalizeAbjadRootLetters(letAr)}يَائِيلُ`
    });
  }

  if (units > 0) {
    const letAr = convertNumberToAbjadLetters(units, system);
    degrees.push({
      levelNameAr: 'مَرْتَبَةُ الآحَادِ (عَالَمُ المُلْكِ وَالحِسِّ)',
      levelNameFr: 'Rang des Unités (Monde du Mulk & Matière)',
      levelNameEn: 'Units Degree (Mulk Realm)',
      value: units,
      letterAr: letAr,
      letterValue: units,
      khoddamNameAr: `${vocalizeAbjadRootLetters(letAr)}يَائِيلُ`
    });
  }

  // Khoddam Entities by Traditional Suffixes
  const entities: KhoddamEntity[] = [
    {
      id: 'celestial_angel',
      categoryFr: 'Ange Supérieur Céleste (Rūḥānī Nūrānī)',
      categoryEn: 'Higher Celestial Angel (Nūrānī Spirit)',
      nameAr: `${vocalizedRoot}يَائِيلُ`,
      nameTransliteration: `${rootLetters}-yā'īl`,
      suffixAr: 'ـيَائِيلُ',
      suffixTrans: '-yā\'īl',
      rootLetters,
      natureFr: 'Entité angélique lumineuse régissant les cieux et la transmission de la lumière spirituelle.',
      natureEn: 'Luminous angelic entity governing heavens and spiritual illumination.',
      qasamInvocationAr: `أَقْسَمْتُ عَلَيْكَ أَيُّهَا المَلَكُ الجَلِيلُ ${vocalizedRoot}يَائِيلُ بِحَقِّ اسْمِ اللَّهِ الأَعْظَمِ أَنْ تَمُدَّنِي بِأَنْوَارِ التَّوْفِيقِ وَالبَرَكَةِ.`,
      qasamInvocationFr: `Je t'adjure, noble Ange ${rootLetters}-yā'īl, par la vérité du Nom Suprême d'Allah, de m'assister par les lumières du succès et de la bénédiction.`,
      qasamInvocationEn: `I adjure thee, O noble Angel ${rootLetters}-yā'īl, by the truth of Allah's Supreme Name, to grant me spiritual success and blessing.`,
      colorTheme: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'action_servant',
      categoryFr: 'Serviteur d\'Exécution & d\'Action (Khādim al-Amal)',
      categoryEn: 'Servant of Execution & Action (Khādim al-Amal)',
      nameAr: `${vocalizedRoot}طَيْطَشٍ`,
      nameTransliteration: `${rootLetters}-taytash`,
      suffixAr: 'ـطَيْطَشٍ',
      suffixTrans: '-taytash',
      rootLetters,
      natureFr: 'Serviteur dynamique dédié à la concrétisation rapide et à la résolution des blocages matériels.',
      natureEn: 'Dynamic servant dedicated to rapid manifestation and removing physical blockages.',
      qasamInvocationAr: `أَجِبْ يَا ${vocalizedRoot}طَيْطَشٍ وَتَوَكَّلْ بِقَضَاءِ هَٰذِهِ الحَاجَةِ بِعِزَّةِ القَادِرِ المُقْتَدِرِ.`,
      qasamInvocationFr: `Réponds, ô ${rootLetters}-taytash, et prends en charge l'accomplissement de cette intention par la puissance du Tout-Puissant.`,
      qasamInvocationEn: `Respond, O ${rootLetters}-taytash, and take charge of fulfilling this need by the glory of the Almighty.`,
      colorTheme: 'from-amber-500 to-orange-600'
    },
    {
      id: 'guardian_servant',
      categoryFr: 'Serviteur de Protection & Voile (Khādim al-Hifz)',
      categoryEn: 'Guardian & Veiling Servant (Khādim al-Hifz)',
      nameAr: `${vocalizedRoot}لُوشٍ`,
      nameTransliteration: `${rootLetters}-lūsh`,
      suffixAr: 'ـلُوشٍ',
      suffixTrans: '-lūsh',
      rootLetters,
      natureFr: 'Gouverneur de discrétion, de bouclier contre les regards envieux et de préservation du secret.',
      natureEn: 'Governor of discretion, shielding against envy and preserving sacred confidentiality.',
      qasamInvocationAr: `احْفَظْ يَا ${vocalizedRoot}لُوشٍ هَٰذَا العَهْدَ وَاحْجُبْ عَنِّي كُلَّ عَيْنٍ حَاسِدَةٍ وَنَفْسٍ خَبِيثَةٍ.`,
      qasamInvocationFr: `Protège, ô ${rootLetters}-lūsh, ce pacte et voile-moi de tout œil envieux et de toute intention obscure.`,
      qasamInvocationEn: `Protect, O ${rootLetters}-lūsh, this covenant and shield me from every envious eye and harmful intent.`,
      colorTheme: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'elemental_servant',
      categoryFr: `Serviteur Élémentaire (${dominantElement === 'fire' ? 'Feu' : dominantElement === 'air' ? 'Air' : dominantElement === 'water' ? 'Eau' : 'Terre'})`,
      categoryEn: `Elemental Servant (${dominantElement.toUpperCase()})`,
      nameAr: dominantElement === 'fire' 
        ? `${vocalizedRoot}هَلْيُوشٍ`
        : dominantElement === 'air'
        ? `${vocalizedRoot}يُوشٍ`
        : dominantElement === 'water'
        ? `${vocalizedRoot}طَاشٍ`
        : `${vocalizedRoot}كَلَخٍ`,
      nameTransliteration: `${rootLetters}-${dominantElement === 'fire' ? 'halyūsh' : dominantElement === 'air' ? 'yūsh' : dominantElement === 'water' ? 'tāsh' : 'kalakh'}`,
      suffixAr: dominantElement === 'fire' ? 'ـهَلْيُوشٍ' : dominantElement === 'air' ? 'ـيُوشٍ' : dominantElement === 'water' ? 'ـطَاشٍ' : 'ـكَلَخٍ',
      suffixTrans: dominantElement === 'fire' ? '-halyūsh' : dominantElement === 'air' ? '-yūsh' : dominantElement === 'water' ? '-tāsh' : '-kalakh',
      rootLetters,
      natureFr: `Serviteur lié à la force tellurique de l'élément dominant (${dominantElement.toUpperCase()}).`,
      natureEn: `Servant linked to the telluric power of the dominant element (${dominantElement.toUpperCase()}).`,
      qasamInvocationAr: `بِحَقِّ العَنَاصِرِ وَطَبَائِعِ الحُرُوفِ، أَجِبْ بِالسَّمْعِ وَالطَّاعَةِ يَا صَاحِبَ العُنْصُرِ.`,
      qasamInvocationFr: `Par la vérité des Éléments et de la nature des Lettres, réponds dans l'obéissance sacrée.`,
      qasamInvocationEn: `By the truth of the Elements and the nature of Letters, respond in sacred obedience.`,
      colorTheme: 'from-emerald-500 to-teal-600'
    }
  ];

  return {
    entities,
    degrees,
    rootLetters,
    vocalizedRoot
  };
}

// 8. Divine Correspondences & Quranic Matches Finder
export interface DivineMatchResult {
  exactNames: AsmaName[];
  resonantNames: { name: AsmaName; diff: number; ratioLabel: string }[];
  exactVerses: SacredFormulaItem[];
  resonantVerses: { verse: SacredFormulaItem; diff: number; ratioLabel: string }[];
}

export function findDivineCorrespondences(
  targetAdad: number,
  system: 'mashriqi' | 'maghribi' = 'mashriqi'
): DivineMatchResult {
  const safeTarget = Math.max(1, targetAdad);

  // Exact & Resonant Asma al-Husna
  const exactNames: AsmaName[] = [];
  const resonantNames: { name: AsmaName; diff: number; ratioLabel: string }[] = [];

  asmaListData.forEach((asma) => {
    // Recalculate if Maghribi or use pre-stored
    let asmaWeight = asma.abjad;
    if (system === 'maghribi') {
      const calc = calculateDetailedAbjad(asma.ar, 'maghribi');
      asmaWeight = calc.totalMaghribi;
    }

    if (asmaWeight === safeTarget) {
      exactNames.push({ ...asma, abjad: asmaWeight });
    } else {
      const diff = Math.abs(asmaWeight - safeTarget);
      if (diff <= 3) {
        resonantNames.push({
          name: { ...asma, abjad: asmaWeight },
          diff,
          ratioLabel: diff === 1 ? 'Proximité Sacrée (±1)' : `Écart mineur (±${diff})`
        });
      } else if (safeTarget > 0 && safeTarget % asmaWeight === 0 && safeTarget / asmaWeight <= 10) {
        const factor = safeTarget / asmaWeight;
        resonantNames.push({
          name: { ...asma, abjad: asmaWeight },
          diff,
          ratioLabel: `Sous-multiple exact (×${factor})`
        });
      } else if (asmaWeight > 0 && asmaWeight % safeTarget === 0 && asmaWeight / safeTarget <= 10) {
        const factor = asmaWeight / safeTarget;
        resonantNames.push({
          name: { ...asma, abjad: asmaWeight },
          diff,
          ratioLabel: `Multiple harmonique (1/${factor})`
        });
      }
    }
  });

  // Exact & Resonant Sacred Verses
  const exactVerses: SacredFormulaItem[] = [];
  const resonantVerses: { verse: SacredFormulaItem; diff: number; ratioLabel: string }[] = [];

  SACRED_FORMULAS_DB.forEach((formula) => {
    const formulaWeight = system === 'maghribi' ? formula.abjadMaghribi : formula.abjadMashriqi;
    if (formulaWeight === safeTarget) {
      exactVerses.push(formula);
    } else {
      const diff = Math.abs(formulaWeight - safeTarget);
      if (diff <= 5) {
        resonantVerses.push({
          verse: formula,
          diff,
          ratioLabel: `Proximité immédiate (±${diff})`
        });
      } else if (safeTarget > 0 && safeTarget % formulaWeight === 0 && safeTarget / formulaWeight <= 10) {
        const factor = safeTarget / formulaWeight;
        resonantVerses.push({
          verse: formula,
          diff,
          ratioLabel: `Résonance harmonique (×${factor})`
        });
      }
    }
  });

  return {
    exactNames,
    resonantNames: resonantNames.sort((a, b) => a.diff - b.diff).slice(0, 8),
    exactVerses,
    resonantVerses: resonantVerses.sort((a, b) => a.diff - b.diff).slice(0, 6)
  };
}

// 9. Comprehensive Tawafuq Compatibility Engine (Al-Buni & Element Synergy)
export interface TawafuqResult {
  p1: {
    fullName: string;
    abjadVal: number;
    dominantElement: ElementType;
    elements: { fire: number; earth: number; air: number; water: number };
  };
  p2: {
    fullName: string;
    abjadVal: number;
    dominantElement: ElementType;
    elements: { fire: number; earth: number; air: number; water: number };
  };
  totalCombined: number;
  mod9: number;
  mod4: number;
  scorePercentage: number;
  buniTitleFr: string;
  buniTitleEn: string;
  buniDescFr: string;
  buniDescEn: string;
  buniCategory: 'excellent' | 'good' | 'neutral' | 'challenging';
  elementalSynergyFr: string;
  elementalSynergyEn: string;
  elementalDescFr: string;
  elementalDescEn: string;
  recommendedWirdAr: string;
  recommendedWirdTrans: string;
  recommendedWirdFr: string;
  recommendedWirdCount: number;
}

const BUNI_MOD9_MEANINGS: Record<number, {
  tFr: string; tEn: string; dFr: string; dEn: string; cat: 'excellent' | 'good' | 'neutral' | 'challenging';
}> = {
  1: {
    tFr: 'Amour Lumineux, Harmonie & Élévation Spirituelle',
    tEn: 'Luminous Love, Harmony & Spiritual Elevation',
    dFr: 'Union bénie sous les auspices de la lumière divine. Affinité mutuelle spontanée, respect indéfectible et succès partagé.',
    dEn: 'Blessed union under divine light. Spontaneous mutual affinity, unwavering respect, and shared success.',
    cat: 'excellent'
  },
  2: {
    tFr: 'Différences de Tempérament & Besoin d\'Adoucissement',
    tEn: 'Temperamental Divergence & Need for Softening',
    dFr: 'Union contrastée exigeant beaucoup de patience, de concessions mutuelles et la pratique régulière du zikr d\'apaisement.',
    dEn: 'Contrasted union requiring patience, mutual compromise, and regular practice of softening dhikr.',
    cat: 'challenging'
  },
  3: {
    tFr: 'Prospérité, Barakah Matérielle & Famille Féconde',
    tEn: 'Prosperity, Material Barakah & Fruitful Family',
    dFr: 'Excellente alliance pour la création d\'un foyer prospère, le commerce et l\'éducation d\'une descendance bénie.',
    dEn: 'Outstanding alliance for building a prosperous home, commerce, and raising blessed offspring.',
    cat: 'excellent'
  },
  4: {
    tFr: 'Stabilité Terrestre, Épreuves Surmontées & Loyauté',
    tEn: 'Grounded Stability, Overcoming Trials & Loyalty',
    dFr: 'Relation solide bâtie sur la franchise et l\'effort. Bien que les débuts puissent comporter des obstacles, la fidélité triomphe.',
    dEn: 'Solid relationship built on frankness and perseverance. While early phases may face hurdles, loyalty triumphs.',
    cat: 'good'
  },
  5: {
    tFr: 'Fécondité, Joie Mutuelle & Paix du Cœur',
    tEn: 'Fruitfulness, Mutual Joy & Heartfelt Peace',
    dFr: 'Alliance harmonieuse et chaleureuse. Les deux partenaires se complètent admirablement et attirent la sympathie de leur entourage.',
    dEn: 'Harmonious and warm alliance. Both partners complement each other wonderfully and attract communal goodwill.',
    cat: 'excellent'
  },
  6: {
    tFr: 'Épreuves de Jalousie Extérieure & Nécessité de Discrétion',
    tEn: 'Trials of External Envy & Need for Discretion',
    dFr: 'Le couple suscite la convoitise et les regards envieux. Il est impératif de protéger son intimité et de préserver le secret des projets.',
    dEn: 'The partnership attracts envy from surroundings. Protecting intimacy and maintaining strict discretion is essential.',
    cat: 'neutral'
  },
  7: {
    tFr: 'Respect Mutuel, Noblesse & Réussite Sociale',
    tEn: 'Mutual Respect, Nobility & Social Distinction',
    dFr: 'Alliance prestigieuse où chacun pousse l\'autre vers l\'excellence intellectuelle, morale et professionnelle.',
    dEn: 'Prestigious alliance where both inspire each other toward intellectual, moral, and professional excellence.',
    cat: 'excellent'
  },
  8: {
    tFr: 'Affrontement de Volontés & Nécessité de Partage',
    tEn: 'Clash of Wills & Need for Shared Leadership',
    dFr: 'Deux fortes personnalités qui doivent éviter la lutte d\'ego et instaurer une prise de décision concertée dans la douceur.',
    dEn: 'Two strong personalities that must transcend ego struggles and establish gentle, cooperative decision-making.',
    cat: 'challenging'
  },
  9: {
    tFr: 'Perfection Spirituelle, Sagesse Suprême & Bénédiction',
    tEn: 'Spiritual Perfection, Supreme Wisdom & Blessing',
    dFr: 'Le degré le plus élevé de la concordance d\'Al-Buni. Paix souveraine, rayonnement spirituel et protection providentielle sur le couple.',
    dEn: 'The highest degree of Al-Buni\'s concordance. Sovereign peace, spiritual radiance, and providential guardianship.',
    cat: 'excellent'
  }
};

export function calculateComprehensiveTawafuq(
  name1: string,
  mother1: string,
  name2: string,
  mother2: string,
  system: 'mashriqi' | 'maghribi' = 'mashriqi'
): TawafuqResult | null {
  const cleanN1 = name1.trim();
  const cleanM1 = mother1.trim();
  const cleanN2 = name2.trim();
  const cleanM2 = mother2.trim();

  const fullStr1 = [cleanN1, cleanM1].filter(Boolean).join(' ');
  const fullStr2 = [cleanN2, cleanM2].filter(Boolean).join(' ');

  if (!cleanN1 || !cleanN2) return null;

  const calc1 = calculateDetailedAbjad(fullStr1, system);
  const calc2 = calculateDetailedAbjad(fullStr2, system);

  if (calc1.activeTotal === 0 || calc2.activeTotal === 0) return null;

  const totalCombined = calc1.activeTotal + calc2.activeTotal;
  const mod9 = totalCombined % 9 === 0 ? 9 : totalCombined % 9;
  const mod4 = totalCombined % 4 === 0 ? 4 : totalCombined % 4;

  const buniEntry = BUNI_MOD9_MEANINGS[mod9];

  // Elemental Synergy
  const el1 = calc1.elemental.dominant;
  const el2 = calc2.elemental.dominant;

  let elemSynergyFr = 'Synergie Complémentaire';
  let elemSynergyEn = 'Complementary Synergy';
  let elemDescFr = 'Équilibre naturel des tempéraments permettant une communication sereine.';
  let elemDescEn = 'Natural balance of temperaments enabling serene communication.';
  let bonusScore = 0;

  if ((el1 === 'fire' && el2 === 'air') || (el1 === 'air' && el2 === 'fire')) {
    elemSynergyFr = 'Exaltation & Élan Créateur (Feu + Air)';
    elemSynergyEn = 'Exaltation & Creative Drive (Fire + Air)';
    elemDescFr = 'L\'Air attise et vivifie le Feu, tandis que le Feu réchauffe l\'Air. Dynamisme exceptionnel et inspiration constante.';
    elemDescEn = 'Air fuels and enlivens Fire, while Fire warms Air. Outstanding dynamism and continuous inspiration.';
    bonusScore = 8;
  } else if ((el1 === 'water' && el2 === 'earth') || (el1 === 'earth' && el2 === 'water')) {
    elemSynergyFr = 'Fécondité & Ancrage Solide (Eau + Terre)';
    elemSynergyEn = 'Fruitfulness & Solid Grounding (Water + Earth)';
    elemDescFr = 'L\'Eau nourrit et féconde la Terre, la Terre canalise et stabilise l\'Eau. Relation sécurisante, féconde et durable.';
    elemDescEn = 'Water nourishes Earth, Earth channels Water. Deeply secure, fertile, and long-lasting partnership.';
    bonusScore = 8;
  } else if (el1 === el2) {
    elemSynergyFr = `Résonance Directe (${el1 === 'fire' ? 'Double Feu' : el1 === 'air' ? 'Double Air' : el1 === 'water' ? 'Double Eau' : 'Double Terre'})`;
    elemSynergyEn = `Direct Mirror Resonance (${el1.toUpperCase()} + ${el2.toUpperCase()})`;
    elemDescFr = 'Même nature fondamentale : grande fluidité de compréhension mais attention à ne pas amplifier les excès du même élément.';
    elemDescEn = 'Identical core nature: immediate empathy, but beware of amplifying the excesses of that single element.';
    bonusScore = 5;
  } else if ((el1 === 'fire' && el2 === 'water') || (el1 === 'water' && el2 === 'fire')) {
    elemSynergyFr = 'Tension d\'Éléments Opposés (Feu & Eau)';
    elemSynergyEn = 'Tension of Opposing Elements (Fire & Water)';
    elemDescFr = 'Tempéraments contraires : nécessite la tempérance, l\'écoute bienveillante et le zikr régulier de Ya Latif pour harmoniser.';
    elemDescEn = 'Contrasting temperaments: requires gentle active listening, patience, and regular recitation of Ya Latif.';
    bonusScore = -5;
  }

  // Base score from Modulo 9
  let baseScore = 80;
  if (buniEntry.cat === 'excellent') baseScore = 92;
  else if (buniEntry.cat === 'good') baseScore = 85;
  else if (buniEntry.cat === 'neutral') baseScore = 75;
  else if (buniEntry.cat === 'challenging') baseScore = 68;

  const finalScore = Math.min(99, Math.max(50, baseScore + bonusScore));

  // Harmonization Wird
  let wirdAr = 'يَا وَدُودُ يَا جَامِعُ يَا لَطِيفُ';
  let wirdTrans = 'Yā Wadūdu Yā Jāmi\'u Yā Latīf';
  let wirdFr = 'Ô Tout-Aimant, Ô Rassembleur des cœurs, Ô Infiniment Bienveillant !';
  let wirdCount = totalCombined % 100 || 114;
  if (finalScore < 75) {
    wirdAr = 'يَا لَطِيفُ يَا سَلَامُ أَلِّفْ بَيْنَ قُلُوبِنَا';
    wirdTrans = 'Yā Latīfu Yā Salāmu allif bayna qulūbinā';
    wirdFr = 'Ô Subtil, Ô Source de Paix, insuffle l\'amour et la concorde entre nos cœurs.';
    wirdCount = 129;
  }

  return {
    p1: {
      fullName: fullStr1,
      abjadVal: calc1.activeTotal,
      dominantElement: calc1.elemental.dominant,
      elements: {
        fire: calc1.elemental.fire.percentage,
        earth: calc1.elemental.earth.percentage,
        air: calc1.elemental.air.percentage,
        water: calc1.elemental.water.percentage
      }
    },
    p2: {
      fullName: fullStr2,
      abjadVal: calc2.activeTotal,
      dominantElement: calc2.elemental.dominant,
      elements: {
        fire: calc2.elemental.fire.percentage,
        earth: calc2.elemental.earth.percentage,
        air: calc2.elemental.air.percentage,
        water: calc2.elemental.water.percentage
      }
    },
    totalCombined,
    mod9,
    mod4,
    scorePercentage: finalScore,
    buniTitleFr: buniEntry.tFr,
    buniTitleEn: buniEntry.tEn,
    buniDescFr: buniEntry.dFr,
    buniDescEn: buniEntry.dEn,
    buniCategory: buniEntry.cat,
    elementalSynergyFr: elemSynergyFr,
    elementalSynergyEn: elemSynergyEn,
    elementalDescFr: elemDescFr,
    elementalDescEn: elemDescEn,
    recommendedWirdAr: wirdAr,
    recommendedWirdTrans: wirdTrans,
    recommendedWirdFr: wirdFr,
    recommendedWirdCount: wirdCount
  };
}
