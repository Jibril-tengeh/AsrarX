import { BookChapter, BARHATIAH_CHAPTERS } from './barhatiahChapters';
export type { BookChapter, BookChapterSection } from './barhatiahChapters';

export interface BookKhatim {
  titleAr: string;
  titleFr: string;
  titleEn: string;
  titleHa: string;
  gridSize: number; // 3, 4, 5, 6
  cells: string[][];
  arabicFormula: string;
  descriptionFr: string;
  descriptionEn: string;
  descriptionHa: string;
  abjadWeight: number;
  element: 'fire' | 'water' | 'air' | 'earth';
}

export interface SacredBook {
  id: string; // e.g. 'book_barhatiah'
  titleAr: string;
  titleFr: string;
  titleEn: string;
  titleHa: string;
  authorAr: string;
  authorFr: string;
  authorEn: string;
  authorHa: string;
  century: string;
  centuryFr?: string;
  centuryEn?: string;
  centuryHa?: string;
  categoryFr: string;
  categoryEn: string;
  categoryHa: string;
  themeColor: string; // gradient classes or hex
  bgGlow: string;
  icon3dType: 'barhatiah' | 'picatrix' | 'lataif' | 'ajnas' | 'futuhat' | 'shumush' | 'jifr' | 'sirr' | 'kanz' | 'ufuk' | 'lumah' | 'diryak' | 'dalail' | 'sahifah' | 'ahzab_shadhili' | 'adhkar_nawawi' | 'hizb_azam' | 'awrad_fathiyyah' | 'jaljalutiyah' | 'mujarrabat_dirby' | 'dawah_harutiyyah' | 'durr_manthum' | 'ahzab_irfaniyyah';
  
  // Introductions in 3 languages
  introFr: {
    summary: string;
    historicalContext: string;
    esotericSignificance: string;
    keyThemes: string[];
    chapterBreakdown: string[];
    practicalEthics: string;
  };
  introEn: {
    summary: string;
    historicalContext: string;
    esotericSignificance: string;
    keyThemes: string[];
    chapterBreakdown: string[];
    practicalEthics: string;
  };
  introHa: {
    summary: string;
    historicalContext: string;
    esotericSignificance: string;
    keyThemes: string[];
    chapterBreakdown: string[];
    practicalEthics: string;
  };

  // Full Chapters
  chapters?: BookChapter[];

  // Khatim Seal data
  khatim: BookKhatim;
}

export const SACRED_BOOKS: SacredBook[] = [
  // 1. Sharh al-Barhatiah
  {
    id: 'book_barhatiah',
    titleAr: 'شرح البرهتية (العهد القديم)',
    titleFr: 'Sharh al-Barhatiah (Le Commentaire sur le Grand Serment)',
    titleEn: 'Sharh al-Barhatiah (Commentary on the Great Oath)',
    titleHa: 'Sharh al-Barhatiah (Sharhin Rantsuwa Mai Tsarki)',
    authorAr: 'الشيخ أحمد بن علي البوني',
    authorFr: 'Ahmad al-Buni',
    authorEn: 'Ahmad al-Buni',
    authorHa: 'Ahmad al-Buni',
    century: 'XIIIe Siècle (7e S. Hégire)',
    centuryFr: 'XIIIe Siècle (7e S. Hégire)',
    centuryEn: '13th Century (7th C. AH)',
    centuryHa: 'Karni na 13 (7 BH)',
    categoryFr: 'Théurgie & Serments Sacrés',
    categoryEn: 'Theurgy & Sacred Oaths',
    categoryHa: 'Aikin Asiri da Rantsuwa',
    themeColor: 'from-amber-600 via-yellow-500 to-amber-700',
    bgGlow: '#f59e0b',
    icon3dType: 'barhatiah',
    chapters: BARHATIAH_CHAPTERS,
    introFr: {
      summary: 'Le Sharh al-Barhatiah est le commentaire canonique du Grand Serment d\'Alliance (Al-Ahad al-Qadim), rédigé par Sheikh Ahmad al-Buni. Ce texte dévoile la puissance des 28 Noms de Pouvoir syriaques et hébraïques qui régissent les entités spirituelles et les sphères célestes.',
      historicalContext: 'Transmis depuis les prophètes Salomon et Enoch (Idris), le serment de la Barhatiah fut commenté au XIIIe siècle par Al-Buni pour en établir les règles de sécurité, de pureté rituelle et d\'alignement planétaire.',
      esotericSignificance: 'Chaque nom de la Barhatiah (Barhatihin, Kararin, Tatlihin, etc.) correspond à l\'une des 28 Demeures de la Lune (Manazil al-Qamar) et porte un poids Abjad spécifique débloquant les forces élémentaires.',
      keyThemes: [
        'Les 28 Noms de Pouvoir Sacrés et leurs traductions divines',
        'Le Serment d\'Alliance et les pactes de protection céleste',
        'Correspondances avec les 28 Demeures de la Lune',
        'Invocations d\'exorcisme (Ruqyah) et de défense spirituelle'
      ],
      chapterBreakdown: [
        'Chapitre I : L\'Origine du Serment et le Pacte Salomunique',
        'Chapitre II : Analyse des 28 Noms et de leurs valeurs numériques Abjad',
        'Chapitre III : Rituels d\'encensement et purification du cercle',
        'Chapitre IV : Construction des Wafqs et Khatims de la Barhatiah'
      ],
      practicalEthics: 'L\'utilisation de ce serment exige un jeûne préalable, la propreté physique et vestimentaire, ainsi qu\'une intention pure exclusive au bien et à la protection.'
    },
    introEn: {
      summary: 'Sharh al-Barhatiah is the canonical commentary on the Ancient Covenant (Al-Ahad al-Qadim), written by Sheikh Ahmad al-Buni. It reveals the mystical power of the 28 Syriac and Hebrew Names of Power governing spiritual realms and planetary spheres.',
      historicalContext: 'Transmitted since Solomon and Enoch (Idris), the Barhatiah oath was systematically expounded in the 13th century by Al-Buni to provide precise safety measures, ritual purity guidelines, and astronomical timings.',
      esotericSignificance: 'Each Barhatiah name (Barhatihin, Kararin, Tatlihin, etc.) aligns with one of the 28 Lunar Mansions and possesses a specific numerical Abjad weight that commands elemental forces.',
      keyThemes: [
        'The 28 Sacred Names of Power & Divine Attributes',
        'The Covenant of Protection and Celestial Guardians',
        'Alignment with the 28 Mansions of the Moon',
        'Exorcism rituals (Ruqyah) and spiritual defense'
      ],
      chapterBreakdown: [
        'Chapter I: Origins of the Covenant & Solomonic Oath',
        'Chapter II: Structural Analysis of the 28 Names & Abjad Weights',
        'Chapter III: Fumigation Protocols & Circle Purification',
        'Chapter IV: Construction of Barhatiah Wafqs & Sacred Seals'
      ],
      practicalEthics: 'Engaging with this Oath requires prior fasting, complete spiritual cleanliness, and a pure intention focused strictly on divine harmony and protection.'
    },
    introHa: {
      summary: 'Sharh al-Barhatiah shine fassarar da sharhin Rantsuwa Mai Tsarki ta Al-Ahad al-Qadim da Sheikh Ahmad al-Buni ya rubuta. Yana bayyana asirin Suna 28 na iko waɗanda ke sarrafa halittun asiri da taurari.',
      historicalContext: 'Wannan rantsuwa ta fito tun daga Annabi Sulaiman da Annabi Idris, inda Al-Buni ya tsara dokokinta a karni na 13 domin kiyaye tsarki da amfani da ita cikin aminci.',
      esotericSignificance: 'Kowace suna a cikin Barhatiah tana dacewa da daya daga Manazil al-Qamar (Wajajen Wata 28) kuma tana da nauyin lamba na Abjad na musamman.',
      keyThemes: [
        'Sunaye 28 Masu Tsarki da Ma\'anarsu',
        'Alhki me Rantsuwar Tsaro da Kariyar Mala\'iku',
        'Dacewa da Manazil al-Qamar 28',
        'Hanyoyin Ruqyah da Kariyar Asiri'
      ],
      chapterBreakdown: [
        'Babi na 1: Asalin Rantsuwa da Yarjejeniyar Sulaiman',
        'Babi na 2: Fassarar Sunaye 28 da Lambobinsu na Abjad',
        'Babi na 3: Turaren Asiri da Wanke Wuri',
        'Babi na 4: Zana Khatim da Wafq na Barhatiah'
      ],
      practicalEthics: 'Rantsuwar tana buƙatar azumi, tsabtar jiki da ta zuciya, da kyakkyawar niyya kawai.'
    },
    khatim: {
      titleAr: 'خاتم البرهتية الكبير (٥×٥)',
      titleFr: 'Grand Khatim 5x5 de la Barhatiah',
      titleEn: 'Grand 5x5 Barhatiah Khatim',
      titleHa: 'Babbar Khatim 5x5 ta Barhatiah',
      gridSize: 5,
      cells: [
        ['برهتيه', 'كرير', 'تتليه', 'طوران', 'مزجل'],
        ['ترقب', 'برهەش', 'غلمش', 'خوطير', 'قلنهود'],
        ['برشان', 'كظهير', 'نموشلخ', 'برهيولا', 'بشكيلخ'],
        ['قزمز', 'أنغلليط', 'قبرات', 'غياها', 'كيدهولا'],
        ['شمخاهر', 'شمخاهير', 'بكهططهونية', 'بشارش', 'طunesh']
      ],
      arabicFormula: 'باسم الله العظيم الأعظم، بحق عهد البرهتية وبسلطان الأوراد العلوية، أجيبوا يا خدام الأسماء.',
      descriptionFr: 'Sceau 5x5 réunissant les 25 premiers noms primordiaux de la Barhatiah pour la protection absolue et l\'harmonisation des 4 éléments.',
      descriptionEn: '5x5 Seal unifying the 25 primary Barhatiah names for ultimate spiritual shield and elemental harmony.',
      descriptionHa: 'Khatim 5x5 mai haɗa sunaye 25 na Barhatiah domin kariya mai ƙarfi da daidaiton iska, wuta, ruwa da ƙasa.',
      abjadWeight: 6625,
      element: 'fire'
    }
  },

  // 2. Ghayat al-Hakim / Picatrix
  {
    id: 'book_picatrix',
    titleAr: 'غاية الحكيم (بيكاتريكس)',
    titleFr: 'Ghayat al-Hakim / Picatrix (Le But du Sage)',
    titleEn: 'Ghayat al-Hakim / Picatrix (The Goal of the Wise)',
    titleHa: 'Ghayat al-Hakim / Picatrix (Burin Mai Hikima)',
    authorAr: 'المجريطي (أبو القاسم مسعدة بن أحمد)',
    authorFr: 'Maslama al-Majriti (Attribué)',
    authorEn: 'Maslama al-Majriti (Attributed)',
    authorHa: 'Maslama al-Majriti',
    century: 'Xe Siècle (Córdoba / Al-Andalus)',
    centuryFr: 'Xe Siècle (Cordoue / Al-Andalus)',
    centuryEn: '10th Century (Cordoba / Al-Andalus)',
    centuryHa: 'Karni na 10 (Cordoba / Al-Andalus)',
    categoryFr: 'Astrologie Talismanique & Magicia Naturalis',
    categoryEn: 'Talismanic Astrology & Magicia Naturalis',
    categoryHa: 'Taurari da Talisman na Asiri',
    themeColor: 'from-purple-600 via-indigo-600 to-blue-800',
    bgGlow: '#8b5cf6',
    icon3dType: 'picatrix',
    introFr: {
      summary: 'Reconnu dans tout l\'Occident médiéval sous le nom de Picatrix, Ghayat al-Hakim est le compendium suprême de la philosophie hermétique, de l\'astronomie théurgique et de l\'art des talismans planétaires rédigé en Al-Andalus.',
      historicalContext: 'Rédigé à Cordoue au Xe siècle et traduit en latin sur ordre du roi Alphonse X de Castille, le texte servit de pont entre la sagesse babylonienne, grecque, arabe et la Renaissance européenne.',
      esotericSignificance: 'Le livre établit la doctrine des influx célestes (Su\'ud et Nuhus), montrant comment capter la lumière des 7 planètes et des 36 Décans à travers des talismans gravés lors d\'alignements précis.',
      keyThemes: [
        'L\'Astrologie Hermétique et l\'esprit des 7 Planètes',
        'La gravure de Talismans lors des électifs astrologiques (Intikhabat)',
        'Les 36 Décans et leurs génies gardiens',
        'Les invocations des intelligences célestes'
      ],
      chapterBreakdown: [
        'Livre I : Les principes de la magie et l\'ordre des sphères',
        'Livre II : Les figures des planètes et la fabrication des talismans',
        'Livre III : Les propriétés des minéraux, plantes et suffumigations',
        'Livre IV : Les rituels d\'invocation des 7 Rois Célestes'
      ],
      practicalEthics: 'Nécessite une maîtrise exacte des éphémérides astronomiques et une éthique rigoureuse pour éviter les répercussions des mauvais alignements.'
    },
    introEn: {
      summary: 'Famous in medieval Europe as Picatrix, Ghayat al-Hakim is the ultimate encyclopedia of Hermetic philosophy, talismanic astrology, and astral magic written in Islamic Al-Andalus.',
      historicalContext: 'Composed in 10th-century Cordoba and translated into Latin by order of King Alfonso X of Castile, it formed the cornerstone of Renaissance astral magic.',
      esotericSignificance: 'The work articulates the mechanics of celestial influx (Su\'ud & Nuhus), detailing how to channel rays from the 7 planets and 36 Decans into physical metal talismans.',
      keyThemes: [
        'Hermetic Astrology & Planetary Spirits',
        'Elective Astrology (Intikhabat) for Talisman Consecration',
        'The 36 Decans and their Guardian Genii',
        'Suffumigations, Invocations, and Celestial Rites'
      ],
      chapterBreakdown: [
        'Book I: Principles of Astral Magic & Cosmic Spheres',
        'Book II: Planetary Images & Talisman Crafts',
        'Book III: Correspondences of Minerals, Herbs & Incenses',
        'Book IV: Celestial Rituals & Invocations of the 7 Kings'
      ],
      practicalEthics: 'Demands absolute precision in calculating planetary hours, aspects, and ascendants.'
    },
    introHa: {
      summary: 'Ghayat al-Hakim (Picatrix) shine littafi mafi shahara a dukan Turai da gabas wajen ilimin taurari, kariya, da kera talisman na asiri daga Andalus.',
      historicalContext: 'An rubuta shi a Cordoba a karni na 10 kuma aka fassara shi zuwa Latin da sauran harsuna.',
      esotericSignificance: 'Yana koya yadda ake jawo ƙarfin taurari 7 da manazil domin yin talisman na jan hankali, kariya da nasara.',
      keyThemes: [
        'Ilimin Taurari 7 da Ruhu',
        'Kera Talisman a Lokacin da Mafi Kyau',
        'Hanyoyin Turare da Incense na Asiri',
        'Kiraye-kirayen Sarakunan Sama'
      ],
      chapterBreakdown: [
        'Littafi 1: Dokokin Asirin Taurari da Samaniya',
        'Littafi 2: Siffofin Taurari da Kera Talisman',
        'Littafi 3: Bishiyoyi, Duwatsu da Turarensa',
        'Littafi 4: Invocations na Sarakunan Samaniya 7'
      ],
      practicalEthics: 'Yana buƙatar kiyaye lokacin taurari na gaskiya da niyya mai kyau.'
    },
    khatim: {
      titleAr: 'خاتم كوكب المشتري والزهرة (طبيعة الفلك)',
      titleFr: 'Khatim Octogonal de Jupiter & Vénus',
      titleEn: 'Octagonal Jupiter & Venus Seal',
      titleHa: 'Khatim 8-Square ta Tauraron Jupiter da Venus',
      gridSize: 4,
      cells: [
        ['١٣٦', '١٤٣', '١٤٤', '١٣٧'],
        ['١٤٥', '١٣٨', '١٣٥', '١٤٢'],
        ['١٣٩', '١٤٦', '١٤١', '١٣٤'],
        ['١٤٠', '١٣٣', '١٤٠', '١٤٧']
      ],
      arabicFormula: 'يا روحانيات كوكب المشتري والزهرة، اجلبوا السعادة والقبول والتيسير.',
      descriptionFr: 'Sceau 4x4 d\'alignement auspicieux sous l\'influence de Jupiter et Vénus pour la prospérité et la grâce spirituelle.',
      descriptionEn: '4x4 Auspicious seal under Jupiter-Venus alignment for prosperity, charisma, and divine favor.',
      descriptionHa: 'Khatim 4x4 domin jawo arziƙi, farin jini da nasara karkashin tauraron Jupiter da Venus.',
      abjadWeight: 2240,
      element: 'air'
    }
  },

  // 3. Lata'if al-Isharat fi al-Hurf al-Alawiyyat
  {
    id: 'book_lataif_isharat',
    titleAr: 'لطائف الإشارات في الحروف العلويات',
    titleFr: 'Lata\'if al-Isharat (Subtilités des Lettres Célestes)',
    titleEn: 'Lata\'if al-Isharat (Subtleties of Celestial Letters)',
    titleHa: 'Lata\'if al-Isharat (Sirrin Haruffa na Samaniya)',
    authorAr: 'الشيخ أحمد بن علي البوني',
    authorFr: 'Ahmad al-Buni',
    authorEn: 'Ahmad al-Buni',
    authorHa: 'Ahmad al-Buni',
    century: 'XIIIe Siècle (Cairo / Maghreb)',
    centuryFr: 'XIIIe Siècle (Le Caire / Maghreb)',
    centuryEn: '13th Century (Cairo / Maghreb)',
    centuryHa: 'Karni na 13 (Alqahira / Maghreb)',
    categoryFr: 'Science des Lettres & Métaphysique (Ilm al-Huruf)',
    categoryEn: 'Science of Letters & Metaphysics',
    categoryHa: 'Ilimin Haruffan Larabci da Asirinsu',
    themeColor: 'from-emerald-600 via-teal-500 to-cyan-700',
    bgGlow: '#10b981',
    icon3dType: 'lataif',
    introFr: {
      summary: 'Dans Lata\'if al-Isharat, Al-Buni traite de la science contemplative des 28 lettres arabes considérées comme les matrices vivantes de la création céleste et la charpente de l\'univers.',
      historicalContext: 'Ouvrage fondamental rédigé par Al-Buni pour compléter la dimension pratique de Shams al-Ma\'arif par une doctrine théologique et cosmologique approfondie de l\'Abjad.',
      esotericSignificance: 'Les lettres ne sont pas de simples symboles phonétiques, mais des récipients de lumière (Awani al-Nur) contenant des intelligences et des forces élémentaires précises.',
      keyThemes: [
        'Les 28 Haruf et leurs dimensions lumineuses',
        'La classification des Lettres Naines, Médianes et Majeures',
        'Correspondances entre lettres, humeurs et organes',
        'L\'extraction des Noms Divins cachés par la brisure (Taksir)'
      ],
      chapterBreakdown: [
        'Partie I : L\'Origine de l\'Alif et le Point Primordial (Al-Nuqtah)',
        'Partie II : Les 4 Groupes Éléments (Lettres de Feu, Air, Eau, Terre)',
        'Partie III : Les Tables de Correspondance avec les 99 Noms d\'Allah',
        'Partie IV : La composition des talismans lettriques d\'harmonie'
      ],
      practicalEthics: 'Exige une méditation silencieuse sur le mystère du Calame (Al-Qalam) et une pureté vocale parfaite lors de la prononciation des invocations.'
    },
    introEn: {
      summary: 'In Lata\'if al-Isharat, Al-Buni explores the contemplative science of the 28 Arabic letters viewed as living metaphysical building blocks of the universe.',
      historicalContext: 'Composed by Al-Buni to provide the deep spiritual philosophy underlying the practical applications found in Shams al-Ma\'arif.',
      esotericSignificance: 'Letters are vessels of light (Awani al-Nur) carrying divine attributes, elemental temperaments, and spiritual guardians.',
      keyThemes: [
        'The 28 Celestial Letters & Vessels of Light',
        'Elemental Classification (Fire, Air, Water, Earth letters)',
        'Anatomical & Planetary Correspondences',
        'Permutation (Taksir) methods for extracting hidden Divine Names'
      ],
      chapterBreakdown: [
        'Part I: Origin of the Alif & The Primordial Point (Al-Nuqtah)',
        'Part II: The Four Elemental Quartets of the Alphabet',
        'Part III: Matrix of 99 Names & Letter Correspondences',
        'Part IV: Constructing Letter Litanies & Harmonic Talismans'
      ],
      practicalEthics: 'Requires meditative focus on the Divine Pen (Al-Qalam) and meticulous phonetic accuracy.'
    },
    introHa: {
      summary: 'Wannan littafi na Al-Buni yana amsa tambayoyi kan sirrin haruffan Larabci 28 a matsayin haske da ke gina kowa da komai a duniya.',
      historicalContext: 'Al-Buni ya rubuta shi domin bayyana zurfin ilimin haruffa ga masu neman ilimin asiri.',
      esotericSignificance: 'Haruffa ba kawai rubutu ba ne; kowanne harfi yana ɗauke da mala\'ika, lamba da nauyin wuta, ruwa, iska ko ƙasa.',
      keyThemes: [
        'Haruffa 28 da Haskensu na Samaniya',
        'Raba Haruffa zuwa Wuta, Ruwa, Iska da Ƙasa',
        'Dangantakar Haruffa da Nawa 99 na Allah',
        'Taksir da Cire Sunayen Mala\'iku'
      ],
      chapterBreakdown: [
        'Sashe 1: Asalin Alif da Dogo (Al-Nuqtah)',
        'Sashe 2: Kungiyoyin Haruffa 4 na Halitta',
        'Sashe 3: Jadawalin Sunayen Allah da Haruffansu',
        'Sashe 4: Rubuta Litanies da Khatim na Haruffa'
      ],
      practicalEthics: 'Yana buƙatar nutsuwa da kyakkyawan karatun haruffa lokacin ambato.'
    },
    khatim: {
      titleAr: 'دائرة الحروف الإلهية الثمانية والعشرين',
      titleFr: 'Roue Circulaire des 28 Lettres Célestes',
      titleEn: 'Circular Wheel of 28 Celestial Letters',
      titleHa: 'Khatim Mai Kewaye ta Haruffa 28',
      gridSize: 3,
      cells: [
        ['أ ب ج', 'د هـ و', 'ز ح ط'],
        ['ي ك ل', 'م ن س', 'ع ف ص'],
        ['ق ر ش', 'ت ث خ', 'ذ ض ظ غ']
      ],
      arabicFormula: 'أبجد هوز حطي كلمن سعفص قرشت ثخذ ضظغ، نور السموات والأرض.',
      descriptionFr: 'Matrice 3x3 synthétisant les 28 lettres fondamentales réparties selon les 4 pôles élémentaires.',
      descriptionEn: '3x3 Matrix unifying the 28 fundamental letters partitioned across the 4 elemental poles.',
      descriptionHa: 'Khatim 3x3 mai haɗa haruffa 28 na Abjad domin daidaita ƙarfin halitta.',
      abjadWeight: 5995,
      element: 'air'
    }
  },

  // 4. Al-Ajnas
  {
    id: 'book_al_ajnas',
    titleAr: 'كتاب الأجناس (سفر الآصفية)',
    titleFr: 'Kitab al-Ajnas (Le Livre des Genres et des Espèces)',
    titleEn: 'Kitab al-Ajnas (The Book of Species)',
    titleHa: 'Kitab al-Ajnas (Littafin Iru-irun Halittu)',
    authorAr: 'آصف بن برخيا (وزير سليمان)',
    authorFr: 'Attribué à Asif ibn Barkhiya',
    authorEn: 'Attributed to Asif ibn Barkhiya',
    authorHa: 'Asif ibn Barkhiya',
    century: 'Antiquité Salomunique / Corpus Classique',
    centuryFr: 'Antiquité Salomunique / Corpus Classique',
    centuryEn: 'Solomonic Antiquity / Classical Corpus',
    centuryHa: 'Tsohon Zamani na Annabi Sulaiman',
    categoryFr: 'Sceaux Salomuniques & Esprits Terrestres',
    categoryEn: 'Solomonic Seals & Terrestrial Spirits',
    categoryHa: 'Sceaux na Annabi Sulaiman da Aljannu',
    themeColor: 'from-red-600 via-rose-600 to-amber-800',
    bgGlow: '#ef4444',
    icon3dType: 'ajnas',
    introFr: {
      summary: 'Le Kitab al-Ajnas est l\'un des grimoires les plus mystérieux attribués à Asif ibn Barkhiya, le vizir du Prophète Salomon qui possédait le savoir du Livre (Ilm min al-Kitab).',
      historicalContext: 'Conservé à travers les siècles par la tradition théurgique orientale, il contient la description des ordres spirituels, des peuples invisibles (Ajnas) et des sceaux solomoniques.',
      esotericSignificance: 'Détaille les méthodes de soumission pacifique des esprits terrestres et célestes par les 7 Formules Royales gravées sur l\'Anneau de Salomon.',
      keyThemes: [
        'Le Savoir du Livre (Ilm min al-Kitab) et la téléportation du trône de Bilqis',
        'Les Sceaux des 7 Symboles du Grand Nom de Salomon',
        'Classifications des esprits et gardiens des trésors cachés',
        'Rituels de libération contre les malédictions et blocages sombres'
      ],
      chapterBreakdown: [
        'Partie I : Le Secret de l\'Anneau Salomunique et des 7 Symboles',
        'Partie II : Catalogue des Espèces (Ajnas) et leurs sceaux d\'alignement',
        'Partie III : Invocations royales pour le déblocage des trésors et nœuds',
        'Partie IV : Protection contre les entités perturbatrices'
      ],
      practicalEthics: 'Requiert une pureté d\'esprit absolue. Interdit d\'utiliser ces formules pour le mal ou la cupidité sous peine d\'annulation immédiate.'
    },
    introEn: {
      summary: 'Kitab al-Ajnas is one of the most mysterious grimoires attributed to Asif ibn Barkhiya, Prophet Solomon’s vizier who possessed knowledge of the Celestial Book.',
      historicalContext: 'Preserved through centuries in Middle Eastern esoteric lore, it catalogues spiritual realms, invisible nations (Ajnas), and royal Solomonic talismans.',
      esotericSignificance: 'Explains peaceful command over planetary and elemental entities using the 7 Sacred Symbols engraved upon Solomon\'s Signet Ring.',
      keyThemes: [
        'Knowledge of the Book (Ilm min al-Kitab) & Bilqis\' Throne',
        'The 7 Symbols of Solomon’s Signet Ring',
        'Classifications of Spirits & Hidden Treasures Guardians',
        'Unbinding rituals for heavy spiritual blocks & curses'
      ],
      chapterBreakdown: [
        'Part I: Mystery of Solomon\'s Ring & 7 Seals',
        'Part II: Catalogue of the Ajnas (Spiritual Species) & Glyphs',
        'Part III: Royal Conjurations for Clearing Spiritual Obstacles',
        'Part IV: Universal Shields against Malicious Spirits'
      ],
      practicalEthics: 'Demands total integrity and pure intent. Misuse invalidates spiritual authorization instantly.'
    },
    introHa: {
      summary: 'Kitab al-Ajnas littafi ne na asiri da aka danganta ga Asif ibn Barkhiya, wazirin Annabi Sulaiman wanda yake da ilimin Littafi.',
      historicalContext: 'Yana kunshe da asirin zoben Annabi Sulaiman da hanyoyin kare kai daga aljannu da taurari.',
      esotericSignificance: 'Yana bayyana alamomi 7 na Zoben Sulaiman da hanyoyin warware sihiri da kulle-kullen asiri.',
      keyThemes: [
        'Ilimin Littafi da Kawo Siminti na Bilqis',
        'Alamomi 7 na Zoben Annabi Sulaiman',
        'Raba Aljannu da Halittun Asiri zuwa Gidaje',
        'Warware Sihiri da Buɗe Hanyoyin Arziƙi'
      ],
      chapterBreakdown: [
        'Sashe 1: Asirin Zoben Sulaiman da Alamominsa 7',
        'Sashe 2: Jerin Iru-irun Aljannu da Khatim dinsu',
        'Sashe 3: Addu\'o\'in Sarakuna domin Bude Kulle-kulle',
        'Sashe 4: Kariyar Gaske daga Cutar Aljannu'
      ],
      practicalEthics: 'Ba a amfani da shi sai da kyakkyawar niyya da tsabtar zuciya.'
    },
    khatim: {
      titleAr: 'خاتم الأسطورة الأصفية (خاتم سليمان السبعة)',
      titleFr: 'Sceau des 7 Symboles Salomuniques d\'Asif',
      titleEn: 'Solomonic 7-Symbol Seal of Asif',
      titleHa: 'Khatim na Alamomi 7 na Annabi Sulaiman',
      gridSize: 3,
      cells: [
        ['فَجَشٍ', 'ثَظَخٍ', 'مَخْفِيّ'],
        ['فرد', 'جبار', 'شكور'],
        ['ثابت', 'ظهير', 'خبیر']
      ],
      arabicFormula: 'فَجَشٍ ثَظَخٍ مَخْفِيّ - بحق خاتم سليمان ووزيره آصف بن برخيا.',
      descriptionFr: 'Sceau 3x3 gravé des 7 lettres d\'assainissement (FAJASH THATHAKH MAKHFIY) combiné aux 7 Noms d\'Allah.',
      descriptionEn: '3x3 Seal engraved with the 7 purifying letters (FAJASH THATHAKH MAKHFIY) paired with Divine Names.',
      descriptionHa: 'Khatim 3x3 na haruffa 7 da Sunayen Allah domin kariya da warware sihiri.',
      abjadWeight: 4404,
      element: 'earth'
    }
  },

  // 5. Al-Futuhat al-Makkiyya
  {
    id: 'book_futuhat_makkiyya',
    titleAr: 'الفتوحات المكية (شيخ الأكبر)',
    titleFr: 'Al-Futuhat al-Makkiyya (Les Illuminations de la Mecque)',
    titleEn: 'Al-Futuhat al-Makkiyya (The Meccan Illuminations)',
    titleHa: 'Al-Futuhat al-Makkiyya (Wahayin Makkah)',
    authorAr: 'الشيخ الأكبر محيي الدين بن عربي',
    authorFr: 'Ibn Arabi (Sheikh al-Akbar)',
    authorEn: 'Ibn Arabi (Sheikh al-Akbar)',
    authorHa: 'Ibn Arabi',
    century: 'XIIIe Siècle (1202 - 1238 CE)',
    centuryFr: 'XIIIe Siècle (1202 - 1238 CE)',
    centuryEn: '13th Century (1202 - 1238 CE)',
    centuryHa: 'Karni na 13 (1202 - 1238 CE)',
    categoryFr: 'Gnose Sufie & Métaphysique (Tasawwuf & Haqiqah)',
    categoryEn: 'Sufi Gnosis & Metaphysics',
    categoryHa: 'Tasawwuf da Ilimin Zukata',
    themeColor: 'from-amber-500 via-yellow-600 to-emerald-800',
    bgGlow: '#d97706',
    icon3dType: 'futuhat',
    introFr: {
      summary: 'Al-Futuhat al-Makkiyya est le chef-d\'œuvre monumental de la mystique musulmane rédigé par Ibn Arabi lors de ses contemplations à La Mecque devant la Kaaba.',
      historicalContext: 'Composé en 560 chapitres, cet ouvrage encyclopédique embrasse la théologie, la gnose (Ma\'rifah), la science des lettres, la cosmologie et la psychologie spirituelle.',
      esotericSignificance: 'Dévoile la doctrine de l\'Unité de l\'Être (Wahdat al-Wujud), la hiérarchie invisible des Saints (Qutb, Abdal, Autad) et le mystère de l\'Homme Parfait (Al-Insan al-Kamil).',
      keyThemes: [
        'La doctrine métaphysique de Wahdat al-Wujud (Unité de l\'Être)',
        'La hiérarchie des 360 Saints et le Pôle Spirituel (Al-Qutb)',
        'Le monde des images et des symboles (Alam al-Mithal)',
        'La science des 28 lettres dans le chapitre 2'
      ],
      chapterBreakdown: [
        'Tome I : Les Ma\'arif (Connaissances directes et vision de la Kaaba)',
        'Tome II : Les Mu\'amalat (Relations spirituelles et éthique du Murid)',
        'Tome III : Les Ahwal (États mystiques et extases spirituelles)',
        'Tome IV : Les Manazil (Demeures de perfectionnement spirituel)'
      ],
      practicalEthics: 'Exige une soumission totale à la Loi divine (Shari\'ah) alliée à la réalisation contemplative de la Vérité (Haqiqah).'
    },
    introEn: {
      summary: 'Al-Futuhat al-Makkiyya is the masterwork of Islamic mysticism, dictated to Ibn Arabi during his visionary contemplations around the Kaaba in Mecca.',
      historicalContext: 'Spanning 560 chapters, this monumental encyclopedia synthesizes Sufi metaphysics, letter symbolism, jurisprudence, and divine cosmology.',
      esotericSignificance: 'Expounds the Unity of Being (Wahdat al-Wujud), the hidden hierarchy of Saints (Qutb, Abdal), and the archetype of the Perfect Human (Insan Kamil).',
      keyThemes: [
        'Metaphysics of Wahdat al-Wujud (Unity of Being)',
        'The Invisible Hierarchy of Saints & The Pole (Qutb)',
        'The Imaginal Realm (Alam al-Mithal)',
        'Chapter 2: Letter Metaphysics & Creation Dynamics'
      ],
      chapterBreakdown: [
        'Volume I: The Ma\'arif (Direct Divine Gnosis & Kaaba Visions)',
        'Volume II: The Mu\'amalat (Spiritual Conduct & Ethics of the Wayfarer)',
        'Volume III: The Ahwal (Mystic States & Spiritual Transformations)',
        'Volume IV: The Manazil (Stations of Divine Proximity)'
      ],
      practicalEthics: 'Requires anchoring in divine law (Shari\'ah) as the essential gateway to spiritual truth (Haqiqah).'
    },
    introHa: {
      summary: 'Al-Futuhat al-Makkiyya littafi ne mai girma na Tasawwuf da Sheikh Ibn Arabi ya rubuta lokacin da yake Makkah kusa da Ka\'aba.',
      historicalContext: 'Yana da babbar daraja a dukan duniyar Musulunci saboda zurfin ilimin da ke ciki na sanin Allah.',
      esotericSignificance: 'Yana bayyana matsayin Shehunan asiri (Qutb, Abdal), yadda zuciya ke samun samaniya da sanin Sunayen Allah.',
      keyThemes: [
        'Kadaitakar Samuwa (Wahdat al-Wujud)',
        'Tsarin Waliyyai da Shehin Zamani (Al-Qutb)',
        'Alam al-Mithal (Duniyar Siffofi da Mafarki)',
        'Sirrin Haruffa a Babi na 2'
      ],
      chapterBreakdown: [
        'Juz\'i 1: Ilimin Sanin Allah da Wahayin Ka\'aba',
        'Juz\'i 2: Zamantakewar Zuciya da Adab na Saliki',
        'Juz\'i 3: Halaye da Matsayoyin Zukata',
        'Juz\'i 4: Manazil na Kusanci da Allah'
      ],
      practicalEthics: 'Yana koya kiyaye Shari\'a tare da gaskiyar zuciya wajen neman Allah.'
    },
    khatim: {
      titleAr: 'دائرة الإنسان الكامل والقطبانية',
      titleFr: 'Sceau Concentrique du Pôle Spirituel & Insan Kamil',
      titleEn: 'Concentric Seal of the Spiritual Pole & Insan Kamil',
      titleHa: 'Khatim ta Zukatan Waliyyai da Al-Qutb',
      gridSize: 4,
      cells: [
        ['قطب', 'غوث', 'أوتاد', 'إبدال'],
        ['عقل', 'نفس', 'روح', 'سر'],
        ['حقيقة', 'شريعة', 'طريقة', 'معرفة'],
        ['ظاهر', 'باطن', 'أول', 'آخر']
      ],
      arabicFormula: 'هو الأول والآخر والظاهر والباطن وهو بكل شيء عليم - دائرة قطب الأقطاب.',
      descriptionFr: 'Sceau 4x4 représentant les 4 piliers (Autad), les 4 niveaux de conscience et la présence divine.',
      descriptionEn: '4x4 Seal depicting the 4 Pillars (Autad), 4 consciousness levels, and divine omnipresence.',
      descriptionHa: 'Khatim 4x4 mai sanya tsari da kwanciyar hankali a zuciya.',
      abjadWeight: 3110,
      element: 'water'
    }
  },

  // 6. Shumush al-Anwar wa Kunuz al-Asrar
  {
    id: 'book_shumush_anwar',
    titleAr: 'شموس الأنوار وكنوز الأسرار',
    titleFr: 'Shumush al-Anwar (Soleils des Lumières et Trésors des Secrets)',
    titleEn: 'Shumush al-Anwar (Suns of Lights and Treasures of Secrets)',
    titleHa: 'Shumush al-Anwar (Ranar Haske da Asiri)',
    authorAr: 'ابن الحاج التلمساني المغربي',
    authorFr: 'Ibn al-Hajj al-Tilimsani',
    authorEn: 'Ibn al-Hajj al-Tilimsani',
    authorHa: 'Ibn al-Hajj al-Tilimsani',
    century: 'XIVe Siècle (Tlemcen / Maghreb)',
    centuryFr: 'XIVe Siècle (Tlemcen / Maghreb)',
    centuryEn: '14th Century (Tlemcen / Maghreb)',
    centuryHa: 'Karni na 14 (Tlemcen / Maghreb)',
    categoryFr: 'Secret des Propriétés & Rituels (Khawas & Asrar)',
    categoryEn: 'Secrets of Properties & Sacred Rituals',
    categoryHa: 'Asirin Ayoyi da Wuridi',
    themeColor: 'from-amber-600 via-orange-500 to-rose-700',
    bgGlow: '#f59e0b',
    icon3dType: 'shumush',
    introFr: {
      summary: 'Shumush al-Anwar est l\'un des traités pratiques les plus célèbres d\'Afrique du Nord, offrant un répertoire complet des propriétés (Khawas) des Versets coraniques et des Noms Divins.',
      historicalContext: 'Rédigé à Tlemcen par Ibn al-Hajj, l\'ouvrage s\'est diffusé dans tout le Maghreb et l\'Afrique de l\'Ouest comme manuel référence pour les maîtres spirituels et praticiens.',
      esotericSignificance: 'Combine la puissance du Dhikr avec des carrés magiques (Awfaq) précis et l\'utilisation d\'encens alchimiques sacrés.',
      keyThemes: [
        'Les Propriétés occultes (Khawas) des 114 Sourates du Coran',
        'L\'extraction des Carrés 4x4 (Al-Wafq al-Murabba\')',
        'Les encens mystiques et les moments d\'exaucement',
        'Soins spirituels contre les blocages, le mauvais œil et la maladie'
      ],
      chapterBreakdown: [
        'Chapitre 1 : Les secrets de la Sourate Al-Fatiha et du verset Ayat al-Kursi',
        'Chapitre 2 : Les carrés 3x3 et 4x4 pour l\'attraction du bien et l\'écartement du mal',
        'Chapitre 3 : Les remèdes spirituels et la préparation des encens',
        'Chapitre 4 : Les invocations de protection pour la maison et la famille'
      ],
      practicalEthics: 'Doit être pratiqué avec la plus haute dévotion, le respect des heures de prière et la discrétion.'
    },
    introEn: {
      summary: 'Shumush al-Anwar is one of North Africa\'s most renowned practical manuals, presenting the esoteric properties (Khawas) of Quranic Surahs and Divine Names.',
      historicalContext: 'Authored in Tlemcen by Ibn al-Hajj, this text became a standard reference across North and West Africa for spiritual healing and protective arts.',
      esotericSignificance: 'Combines the power of Dhikr with precise 4x4 Magic Squares (Awfaq) and sacred herbal suffumigations.',
      keyThemes: [
        'Esoteric Properties (Khawas) of the 114 Quranic Surahs',
        'Construction of 4x4 Magic Squares (Al-Wafq al-Murabba\')',
        'Mystical incenses & Auspicious prayer hours',
        'Spiritual remedies against evil eye, hexes, and distress'
      ],
      chapterBreakdown: [
        'Chapter 1: Secrets of Surah Al-Fatihah & Ayat al-Kursi',
        'Chapter 2: 3x3 & 4x4 Wafqs for Prosperity & Defense',
        'Chapter 3: Spiritual Remedies & Sacred Incense Preparation',
        'Chapter 4: House Protection & Family Blessing Litanies'
      ],
      practicalEthics: 'Requires absolute devotion, respect for prayer times, and utmost confidentiality.'
    },
    introHa: {
      summary: 'Shumush al-Anwar littafi ne sananne sosai a Arewacin da Yammacin Afirka wanda ke kunshe da asirin Ayoyin Al-Qur\'ani da Wafq.',
      historicalContext: 'Ibn al-Hajj ya rubuta shi a garin Tlemcen domin zama jagora ga malamai da masu neman waraka.',
      esotericSignificance: 'Yana haɗa wuridi, addu\'o\'i, da zana Khatim 4x4 tare da amfani da turaren asiri domin samun baki daya.',
      keyThemes: [
        'Asirin Surorin Qur\'ani 114',
        'Zana Khatim 4x4 (Al-Wafq al-Murabba\')',
        'Hadawa da Amfani da Turaren Asiri',
        'Maganin Ciki, Kariya daga Camfi da Shaidanu'
      ],
      chapterBreakdown: [
        'Babi na 1: Asirin Suratul Fatiha da Ayat al-Kursi',
        'Babi na 2: Zana Khatim 3x3 da 4x4 na Nasara',
        'Babi na 3: Hanyoyin Turare da Wanke Jiki',
        'Babi na 4: Addu\'o\'in Kariya ga Gida da Iyali'
      ],
      practicalEthics: 'Yana buƙatar kiyaye sallah, tsarki da kiyaye asiri.'
    },
    khatim: {
      titleAr: 'خاتم الشموس الإلهي (وفق ٤×٤)',
      titleFr: 'Sceau 4x4 du Soleil des Lumières',
      titleEn: '4x4 Sun of Lights Sacred Wafq',
      titleHa: 'Khatim 4x4 ta Shumush al-Anwar',
      gridSize: 4,
      cells: [
        ['١٦', '٣', '٢', '١٣'],
        ['٥', '١٠', '١١', '٨'],
        ['٩', '٦', '٧', '١٢'],
        ['٤', '١٥', '١٤', '١']
      ],
      arabicFormula: 'الله نور السموات والأرض - وفق الشموس والأنوار المبارك.',
      descriptionFr: 'Carré 4x4 parfait de valeur constante 34 sur toutes les lignes et colonnes, attirant la lumière et la barakah.',
      descriptionEn: 'Perfect 4x4 square with a constant magic sum of 34, channeling divine radiance and blessing.',
      descriptionHa: 'Khatim 4x4 da kowace shafi ke bawa lamba 34 domin haske da albarka.',
      abjadWeight: 1034,
      element: 'fire'
    }
  },

  // 7. Kitab al-Jifr
  {
    id: 'book_kitab_jifr',
    titleAr: 'كتاب الجفر والجامع',
    titleFr: 'Kitab al-Jifr (Le Livre de la Prescience et du Jafar)',
    titleEn: 'Kitab al-Jifr (The Book of Ja\'far & Prescience)',
    titleHa: 'Kitab al-Jifr (Littafin Ilimin Ja\'far)',
    authorAr: 'الإمام جعفر بن محمد الصادق',
    authorFr: 'Attribué à l\'Imam Ja\'far al-Sadiq',
    authorEn: 'Attributed to Imam Ja\'far al-Sadiq',
    authorHa: 'Imam Ja\'far al-Sadiq',
    century: 'VIIIe Siècle (Medina / Iraq)',
    centuryFr: 'VIIIe Siècle (Médine / Irak)',
    centuryEn: '8th Century (Medina / Iraq)',
    centuryHa: 'Karni na 8 (Madina / Iraq)',
    categoryFr: 'Divination Lettrique & Prescience (Ilm al-Jifr)',
    categoryEn: 'Letter Divination & Cosmic Prescience',
    categoryHa: 'Ilimin Bayyana Asirin Gobe da Haruffa',
    themeColor: 'from-indigo-700 via-purple-700 to-slate-900',
    bgGlow: '#6366f1',
    icon3dType: 'jifr',
    introFr: {
      summary: 'Kitab al-Jifr est le texte fondateur de la science de la prescience et de la divination par les lettres (Ilm al-Jifr wa al-Jami\'), attribué au 6e Imam Ja\'far al-Sadiq.',
      historicalContext: 'Selon la tradition, le Jifr (Jifr Abyad et Jifr Ahmar) contient les rouleaux de savoir ésotérique hérités de la famille du Prophète (Ahl al-Bayt).',
      esotericSignificance: 'Permet la résolution de questions complexes (Istikhraj) par la manipulation des tables de 28x28 lettres et la décomposition des noms en éléments premiers.',
      keyThemes: [
        'Le Jifr Blanc (Jifr Abyad) et le Jifr Rouge (Jifr Ahmar)',
        'Les tables de permutation 28x28 (Al-Jami\')',
        'Méthodes de questionnement et réponses inspirées (Sawa\'il et Ajwibah)',
        'Les prophéties sur les époques futures et les évènements cosmologiques'
      ],
      chapterBreakdown: [
        'Tome I : Les Fondements du Jifr et le Grand Tableau des 784 lettres',
        'Tome II : Méthodes de cassure (Taksir) et extraction des réponses',
        'Tome III : La géomancie et l\'astrologie intégrées au Jifr',
        'Tome IV : Les sceaux divins de confirmation'
      ],
      practicalEthics: 'Nécessite une grande sagesse spirituelle pour ne pas altérer les réponses ni utiliser le savoir à des fins de vanité.'
    },
    introEn: {
      summary: 'Kitab al-Jifr is the foundational text of divine prescience and letter divination (Ilm al-Jifr wa al-Jami\'), attributed to Imam Ja\'far al-Sadiq.',
      historicalContext: 'According to esoteric tradition, the Jifr rolls (White Jifr & Red Jifr) transmit the secret knowledge of the Ahl al-Bayt.',
      esotericSignificance: 'Provides systematic methods for extracting mystical answers (Istikhraj) by permutating 28x28 letter matrices.',
      keyThemes: [
        'The White Jifr (Jifr Abyad) & Red Jifr (Jifr Ahmar)',
        'The 28x28 Letter Permutation Tables (Al-Jami\')',
        'Query Formulation & Inspired Answers (Sawa\'il & Ajwibah)',
        'Cosmic Prophecies & Cyclic Eras'
      ],
      chapterBreakdown: [
        'Volume I: Principles of Jifr & The 784 Letter Matrix',
        'Volume II: Permutation (Taksir) & Answer Extraction',
        'Volume III: Integrating Geomancy & Planetary Aspects with Jifr',
        'Volume IV: Confirmation Seals & Divine Authorizations'
      ],
      practicalEthics: 'Demands profound spiritual wisdom and restraint in interpreting cosmic signs.'
    },
    introHa: {
      summary: 'Kitab al-Jifr littafi ne mai tsohon tarihi na ilimin sanin abin da zai faru a nan gaba ta hanyar lissafin haruffa da Imam Ja\'far al-Sadiq ya koya.',
      historicalContext: 'Littafin yana dauke da asirin Jifr Fari da Jifr Ja na Ahl al-Bayt.',
      esotericSignificance: 'Yana ba da damar amsa tambayoyi masu zurfi ta hanyar karya haruffa 28x28.',
      keyThemes: [
        'Jifr Fari (Jifr Abyad) da Jifr Ja (Jifr Ahmar)',
        'Jadawalin Haruffa 28x28 na Jami\'',
        'Hanyar Tambaya da Cire Amsa',
        'Annabce-annabce na Lokuta masu Zuwa'
      ],
      chapterBreakdown: [
        'Juz\'i 1: Dokokin Jifr da Jadawalin Haruffa 784',
        'Juz\'i 2: Hanyar Taksir da Fitar da Amsa',
        'Juz\'i 3: Hadawa da Ilimin Kasa da Taurari',
        'Juz\'i 4: Khatim din Tabtabawa'
      ],
      practicalEthics: 'Yana buƙatar hikima da kame kai wajen magana.'
    },
    khatim: {
      titleAr: 'جدول الجفر الكبير (تكسير ٦×٦)',
      titleFr: 'Matrice 6x6 du Jifr Grand Taksir',
      titleEn: '6x6 Grand Jifr Permutation Grid',
      titleHa: 'Khatim 6x6 ta Ilimin Jifr',
      gridSize: 6,
      cells: [
        ['أ', 'ل', 'م', 'ص', 'ر', 'ك'],
        ['هـ', 'ي', 'ع', 'ص', 'ط', 'س'],
        ['ح', 'م', 'ع', 'س', 'ق', 'ن'],
        ['ق', 'س', 'ط', 'ع', 'ي', 'هـ'],
        ['ك', 'ر', 'ص', 'م', 'ل', 'أ'],
        ['ن', 'ق', 'س', 'ع', 'م', 'ح']
      ],
      arabicFormula: 'الر كهيعص طه طسم يس حم عسق ق ن - سر الجفر الجامع.',
      descriptionFr: 'Grille 6x6 réunissant les 14 Lettres Mystérieuses (Muqatta\'at) du Coran sous la clé du Jifr.',
      descriptionEn: '6x6 Grid combining the 14 Disconnected Quranic Letters (Muqatta\'at) under the key of Jifr.',
      descriptionHa: 'Khatim 6x6 ta haruffan Muqatta\'at domin fitar da amsar tambayoyin asiri.',
      abjadWeight: 7840,
      element: 'air'
    }
  },

  // 8. Sirr al-Khalqah wa San'at al-Tabi'ah
  {
    id: 'book_sirr_khalqah',
    titleAr: 'سر الخلقة وصنعة الطبيعة (اللوح الزمردي)',
    titleFr: 'Sirr al-Khalqah (Secret de la Création & Table d\'Émeraude)',
    titleEn: 'Sirr al-Khalqah (Secret of Creation & Emerald Tablet)',
    titleHa: 'Sirr al-Khalqah (Asirin Halitta da Tabula Smaragdina)',
    authorAr: 'بليناس الحكيم (أبولونيوس التباني)',
    authorFr: 'Balinas al-Hakim (Apollonius de Tyane)',
    authorEn: 'Balinas al-Hakim (Apollonius of Tyana)',
    authorHa: 'Balinas al-Hakim',
    century: 'Ist - VIIIe Siècle (Tradition Hermétique)',
    centuryFr: 'Ier - VIIIe Siècle (Tradition Hermétique)',
    centuryEn: '1st - 8th Century (Hermetic Tradition)',
    centuryHa: 'Karni na 1 - 8 (Sirrin Hermetic)',
    categoryFr: 'Hermétisme, Alchimie & Cosmologie',
    categoryEn: 'Hermeticism, Alchemy & Cosmology',
    categoryHa: 'Ilimin Alchimie da Hermetic',
    themeColor: 'from-emerald-700 via-green-600 to-teal-900',
    bgGlow: '#059669',
    icon3dType: 'sirr',
    introFr: {
      summary: 'Sirr al-Khalqah est le plus ancien texte conservé en langue arabe contenant la célèbre Table d\'Émeraude (Tabula Smaragdina) d\'Hermès Trismégiste.',
      historicalContext: 'Rédigé par le philosophe Apollonius de Tyane (Balinas), le manuscrit dévoile la cosmogonie hermétique et les principes fondamentaux de l\'alchimie spirituelle et matérielle.',
      esotericSignificance: 'Formule l\'adage fondamental : "Ce qui est en bas est comme ce qui est en haut, pour accomplir les miracles d\'une seule chose."',
      keyThemes: [
        'La Table d\'Émeraude d\'Hermès (Al-Lawh al-Zumurruzi)',
        'L\'origine des 4 Éléments (Feu, Air, Eau, Terre) et du Mercure/Soufre',
        'La transmutation des métaux et la purification du corps mystique',
        'Les talismans des 7 métaux sacrés'
      ],
      chapterBreakdown: [
        'Partie I : La découverte de la grotte sous la statue d\'Hermès',
        'Partie II : Le texte original de la Table d\'Émeraude en arabe',
        'Partie III : Les lois de la sympathie universelle et des 4 Éléments',
        'Partie IV : La préparation des élixirs et sceaux métalliques'
      ],
      practicalEthics: 'L\'alchimie hermétique vise d\'abord la transmutation intérieure de l\'âme avant tout travail sur les métaux.'
    },
    introEn: {
      summary: 'Sirr al-Khalqah is the oldest surviving Arabic manuscript containing the legendary Emerald Tablet (Tabula Smaragdina) of Hermes Trismegistus.',
      historicalContext: 'Penned by Apollonius of Tyana (Balinas), it transmits Hermetic cosmology and the foundation of spiritual and physical alchemy.',
      esotericSignificance: 'Formulates the Hermetic axiom: "That which is Below is like that which is Above, to accomplish the miracles of the One Thing."',
      keyThemes: [
        'The Emerald Tablet of Hermes (Al-Lawh al-Zumurruzi)',
        'The 4 Elements & The Mercury-Sulfur Theory of Alchemy',
        'Transmutation & Spiritual Alchemy of the Soul',
        'Talismans of the 7 Sacred Metals'
      ],
      chapterBreakdown: [
        'Part I: Discovery of the Vault beneath the Statue of Hermes',
        'Part II: The Original Arabic Text of the Emerald Tablet',
        'Part III: Laws of Universal Sympathy & Elemental Balances',
        'Part IV: Elixir Preparations & Metal Consecration Seals'
      ],
      practicalEthics: 'Hermetic alchemy prioritizes inner purification and spiritual enlightenment over material wealth.'
    },
    introHa: {
      summary: 'Sirr al-Khalqah littafi ne na Hermetic da ke dauke da shafuka na farko na Allon Emerald (Tabula Smaragdina).',
      historicalContext: 'Balinas al-Hakim ya gano asirin a cikin kogoni karkashin mutummutumi na Annabi Idris (Hermes).',
      esotericSignificance: 'Yana bayyana cewa duk abin da ke sama yana da daidaito da abin da ke kasa a duniyar halitta.',
      keyThemes: [
        'Allon Emerald (Tabula Smaragdina)',
        'Elements 4 (Wuta, Iska, Ruwa, Kasa) da Alchimie',
        'Kera Talisman daga Karfe 7 na Taurari',
        'Tace Zuciya da Maganin Asiri'
      ],
      chapterBreakdown: [
        'Sashe 1: Gano Kogwata da Maganganun Hermes',
        'Sashe 2: Rubutun Asali na Tabula Smaragdina',
        'Sashe 3: Dokokin Daidaiton Halitta da Karfe 7',
        'Sashe 4: Zana Khatim din Emerald'
      ],
      practicalEthics: 'Yana koya tace zuciya da samun hikimar Ubangiji.'
    },
    khatim: {
      titleAr: 'خاتم اللوح الزمردي الكوني (هرمس)',
      titleFr: 'Sceau Émeraude des 4 Éléments d\'Hermès',
      titleEn: 'Emerald Hermetic 4-Element Seal',
      titleHa: 'Khatim ta Allon Emerald (Tabula Smaragdina)',
      gridSize: 3,
      cells: [
        ['نار', 'أثير', 'هواء'],
        ['زئبق', 'كبير', 'كبريت'],
        ['ماء', 'معدن', 'أرض']
      ],
      arabicFormula: 'أعلى كما أسفل، وأسفل كما أعلى - لإنجاز عجائب الشيء الواحد.',
      descriptionFr: 'Sceau 3x3 alchimique équilibrant le Soufre, le Mercure et le Sel à travers les 4 Éléments.',
      descriptionEn: '3x3 Alchemical seal balancing Sulfur, Mercury, and Salt through the 4 Elements.',
      descriptionHa: 'Khatim 3x3 na daidaita sinadaran alchimie da halitta.',
      abjadWeight: 1440,
      element: 'earth'
    }
  },

  // 9. Kanz al-Asrar fi al-Khawas wal-Awfaq
  {
    id: 'book_kanz_asrar',
    titleAr: 'كنز الأسرار في الخواص والأوفاق',
    titleFr: 'Kanz al-Asrar (Le Trésor des Secrets et des Carrés)',
    titleEn: 'Kanz al-Asrar (Treasure of Secrets & Magic Squares)',
    titleHa: 'Kanz al-Asrar (Rikicin Asiri da Khatim)',
    authorAr: 'الشيخ أحمد بن علي البوني',
    authorFr: 'Ahmad al-Buni',
    authorEn: 'Ahmad al-Buni',
    authorHa: 'Ahmad al-Buni',
    century: 'XIIIe Siècle (Maghreb / Le Caire)',
    categoryFr: 'Carrés Magiques & Mathématiques Sacrées (Awfaq)',
    categoryEn: 'Sacred Mathematics & Magic Squares',
    categoryHa: 'Ilimin Lissafi da Khatim na Wafq',
    themeColor: 'from-amber-700 via-yellow-600 to-yellow-800',
    bgGlow: '#eab308',
    icon3dType: 'kanz',
    introFr: {
      summary: 'Kanz al-Asrar est le manuel technique le plus précis d\'Al-Buni consacré exclusivement à l\'art mathématique et théurgique de la construction des Awfaq (Carrés Magiques).',
      historicalContext: 'Conçu comme un guide pratique pour les étudiants avancés, l\'ouvrage détaille les règles rigoureuses d\'insertion des poids Abjad sans erreur d\'arithmétique.',
      esotericSignificance: 'Explique la répartition exacte de la fraction (Al-Kasr) pour les carrés 3x3 (Muthallath), 4x4 (Murabba\'), 5x5 (Mukhammas) jusqu\'au 10x10 (Mu\'ashshar).',
      keyThemes: [
        'La règle de calcul du Kasr (Reste de division par 12, 40, etc.)',
        'Le Carré 3x3 à centre vide (Al-Muthallath Al-Khali al-Wasat)',
        'L\'harmonie des diagonales et des 4 coins élémentaires',
        'La gravure sur plaques de métal sacrées (Or, Argent, Cuivre, Plomb)'
      ],
      chapterBreakdown: [
        'Chapitre I : Règle générale du Muthallath 3x3 (Ghazali)',
        'Chapitre II : Le Murabba\' 4x4 et ses 384 combinaisons magiques',
        'Chapitre III : Les Awfaq pairs (4x4, 6x6, 8x8) et impairs (3x3, 5x5, 7x7)',
        'Chapitre IV : L\'animation spirituelle des carrés (Tashkiyya)'
      ],
      practicalEthics: 'Toute erreur de calcul annule la charge du carré. Nécessite une vérification minutieuse des sommes.'
    },
    introEn: {
      summary: 'Kanz al-Asrar is Al-Buni\'s most precise technical handbook dedicated exclusively to the mathematical and theurgic construction of Awfaq (Magic Squares).',
      historicalContext: 'Written as a practical guide for advanced practitioners, it details flawless arithmetic methods for populating squares with Abjad totals.',
      esotericSignificance: 'Formulates exact rules for handling fractions (Al-Kasr) across 3x3 (Muthallath), 4x4 (Murabba\'), up to 10x10 (Mu\'ashshar) grids.',
      keyThemes: [
        'Fraction Management (Al-Kasr division rules)',
        'The Empty-Center 3x3 Wafq (Al-Muthallath Al-Khali al-Wasat)',
        'Diagonal Harmony & Elemental Corner Alignment',
        'Engraving on Sacred Metals (Gold, Silver, Copper, Lead)'
      ],
      chapterBreakdown: [
        'Chapter I: General Rules of the 3x3 Muthallath (Ghazali Square)',
        'Chapter II: The 4x4 Murabba\' & Its 384 Magic Combinations',
        'Chapter III: Even (4x4, 6x6) & Odd (3x3, 5x5) Wafq Architectures',
        'Chapter IV: Spiritual Consecration (Tashkiyya) of Magic Squares'
      ],
      practicalEthics: 'A single calculation error nullifies the Wafq. Precision in arithmetic is mandatory.'
    },
    introHa: {
      summary: 'Kanz al-Asrar shine littafi mafi inganci na Al-Buni kan yadda ake lissafin Khatim da sanya lambobi ba tare da kuskure ba.',
      historicalContext: 'Al-Buni ya bayyana hanyoyin lissafi 3x3, 4x4 har zuwa 10x10 cikin sauki.',
      esotericSignificance: 'Yana nuna yadda ake raba lambobi idan akwai saura (Al-Kasr) da yadda ake zana Khatim mara cibiya.',
      keyThemes: [
        'Lissafin Kasr (Saura)',
        'Khatim 3x3 Mai Wofi a Tsakiya',
        'Daidaiton Lambobi a Kowace Shafi',
        'Zana Khatim a Karfen Zinare, Azurfa da Kudi'
      ],
      chapterBreakdown: [
        'Babi na 1: Dokokin Khatim 3x3 (Muthallath)',
        'Babi na 2: Khatim 4x4 (Murabba\') da Hanyoyinta 384',
        'Babi na 3: Khatim Maura da Khatim Cika',
        'Babi na 4: Karanta Wuridi kan Khatim (Tashkiyya)'
      ],
      practicalEthics: 'Kuskure daya a lissafi yana ɓata Khatim din, don haka ana buƙatar kulawa.'
    },
    khatim: {
      titleAr: 'مثلث الغزالي الخالي الوسط (وفق ٣×٣)',
      titleFr: 'Khatim 3x3 Al-Muthallath à Centre Vide',
      titleEn: 'Empty-Center 3x3 Ghazali Magic Square',
      titleHa: 'Khatim 3x3 ta Ghazali Mai Wofi a Tsakiya',
      gridSize: 3,
      cells: [
        ['٤', '٩', '٢'],
        ['٣', 'مستجاب', '٧'],
        ['٨', '١', '٦']
      ],
      arabicFormula: 'بطد زهج واح - وفق الخالي الوسط المجاب.',
      descriptionFr: 'Carré 3x3 parfait de Ghazali où le centre est réservé au voeu ou au Nom Divin.',
      descriptionEn: 'Classic 3x3 Ghazali square with an open center reserved for the intention or Divine Name.',
      descriptionHa: 'Khatim 3x3 mai cibiya a bude domin sanya niyya ko Sunan Allah.',
      abjadWeight: 45,
      element: 'fire'
    }
  },

  // 10. Al-Ufuk al-Mubin
  {
    id: 'book_ufuk_mubin',
    titleAr: 'الأفق المبين (مير داماد)',
    titleFr: 'Al-Ufuk al-Mubin (L\'Horizon Lumineux)',
    titleEn: 'Al-Ufuk al-Mubin (The Manifest Horizon)',
    titleHa: 'Al-Ufuk al-Mubin (Mahaɗa Mai Haske)',
    authorAr: 'المير محمد باقر الإشراق (مير داماد)',
    authorFr: 'Mir Damad (Mir Muhammad Baqir)',
    authorEn: 'Mir Damad (Mir Muhammad Baqir)',
    authorHa: 'Mir Damad',
    century: 'XVIIe Siècle (Isfahan / École d\'Ispahan)',
    centuryFr: 'XVIIe Siècle (Isfahan / École d\'Ispahan)',
    centuryEn: '17th Century (Isfahan / School of Isfahan)',
    centuryHa: 'Karni na 17 (Isfahan)',
    categoryFr: 'Philosophie Illuminationniste & Théurgie',
    categoryEn: 'Illuminationist Philosophy & Theurgy',
    categoryHa: 'Hikimar Haske da Sanin Samaniya',
    themeColor: 'from-amber-500 via-rose-500 to-purple-800',
    bgGlow: '#f59e0b',
    icon3dType: 'ufuk',
    introFr: {
      summary: 'Al-Ufuk al-Mubin est l\'ouvrage magistral de Mir Damad, fondateur de l\'École d\'Ispahan, fusionnant la philosophie d\'Avicenne, la théosophie d\'Ibn Arabi et la gnose de la lumière (Hikmat al-Ishraq).',
      historicalContext: 'Rédigé à Ispahan au XVIIe siècle, ce texte représente l\'apogée de la métaphysique safavide et de l\'analyse contemplative du monde des formes intelligibles.',
      esotericSignificance: 'Traite de la nature du temps éternel (Dahr) par opposition au temps temporel (Zaman) et à l\'éternité absolue (Sarmad), et des talismans de la lumière rayonnante.',
      keyThemes: [
        'La métaphysique du Dahr (Temps éternel créatif)',
        'L\'École d\'Ispahan et la synthèse entre raison, révélation et gnose',
        'Les sceaux de lumière de la théosophie Illuminationniste (Ishraq)',
        'L\'harmonie des sphères célestes et des intelligences lumineuses'
      ],
      chapterBreakdown: [
        'Partie I : L\'Émanation des Lumières et les niveaux d\'existence (Sarmad, Dahr, Zaman)',
        'Partie II : Les formes intelligibles et les miroirs de la préscience',
        'Partie III : Les sceaux théurgiques de l\'Horizon Lumineux',
        'Partie IV : L\'élévation de l\'âme vers la Source des Lumières'
      ],
      practicalEthics: 'Exige une préparation philosophique et mystique élevée.'
    },
    introEn: {
      summary: 'Al-Ufuk al-Mubin is the masterpiece of Mir Damad, founder of the School of Isfahan, synthesizing Avicennian philosophy, Ibn Arabi\'s gnosis, and Illuminationist metaphysics (Hikmat al-Ishraq).',
      historicalContext: 'Composed in 17th-century Isfahan, it represents the zenith of Safavid philosophy and intellectual mysticism.',
      esotericSignificance: 'Explores the concept of perpetual time (Dahr) versus temporal time (Zaman) and absolute eternity (Sarmad), offering seals of radiant light.',
      keyThemes: [
        'Metaphysics of Dahr (Creative Perpetual Time)',
        'The School of Isfahan: Reason, Revelation & Gnosis',
        'Illuminationist (Ishraqi) Light Seals & Glyphs',
        'Harmony of Celestial Spheres & Luminous Intelligences'
      ],
      chapterBreakdown: [
        'Part I: Emanation of Lights & Cosmic Epochs (Sarmad, Dahr, Zaman)',
        'Part II: Intelligible Forms & Mirrors of Divine Knowledge',
        'Part III: Theurgic Seals of the Manifest Horizon',
        'Part IV: Ascension of the Soul to the Source of Lights'
      ],
      practicalEthics: 'Demands deep philosophical preparation and spiritual purity.'
    },
    introHa: {
      summary: 'Al-Ufuk al-Mubin littafi ne mai daraja ta Mir Damad da ke bayyana asirin Haske, lokaci da sanin Allah.',
      historicalContext: 'Mir Damad ya rubuta shi a garin Isfahan a karni na 17 domin haɗa hankali, Qur\'ani da ilimin asiri.',
      esotericSignificance: 'Yana nuna yadda zuciya ke samun haske da yadda ake fahimtar lokacin zamanai 3 (Sarmad, Dahr, Zaman).',
      keyThemes: [
        'Ilimin Lokaci da Halitta (Sarmad, Dahr, Zaman)',
        'Hikimar Haske (Hikmat al-Ishraq)',
        'Khatim na Hasken Samaniya',
        'Ɗaukakar Zuciya zuwa ga Ubangiji'
      ],
      chapterBreakdown: [
        'Sashe 1: Fitowar Haske da Yanayin Halitta',
        'Sashe 2: Madubin Sanin Allah da Siffofi',
        'Sashe 3: Khatim na Mahaɗa Mai Haske',
        'Sashe 4: Haɓakar Zuciya zuwa Haske'
      ],
      practicalEthics: 'Yana buƙatar zurfin tunani da gaskiyar zuciya.'
    },
    khatim: {
      titleAr: 'خاتم الإشراق والإشراق النوراني',
      titleFr: 'Sceau Rayonnant de l\'Horizon Lumineux',
      titleEn: 'Radiant Seal of the Manifest Horizon',
      titleHa: 'Khatim ta Hasken Al-Ufuk al-Mubin',
      gridSize: 3,
      cells: [
        ['سرمد', 'نور', 'دهر'],
        ['إشراق', 'إشراق', 'حكمة'],
        ['زمان', 'عقل', 'روح']
      ],
      arabicFormula: 'الله نور السموات والأرض - الإشراق والمشرق المبين.',
      descriptionFr: 'Sceau 3x3 de l\'école Ishraqi unissant les 3 dimensions du temps et du savoir.',
      descriptionEn: '3x3 Ishraqi seal unifying the 3 dimensions of time and divine wisdom.',
      descriptionHa: 'Khatim 3x3 ta haɗa lokaci da hikima domin samun basira.',
      abjadWeight: 2550,
      element: 'air'
    }
  },

  // 11. Al-Lum'ah al-Nuraniyyah fi Awrad al-Rabbaniyyah
  {
    id: 'book_lumah_nuraniyyah',
    titleAr: 'اللمعة النورانية في الأوراد الربانية',
    titleFr: 'Al-Lum\'ah al-Nuraniyyah (La Lueur Lumineuse des Litanies Divine)',
    titleEn: 'Al-Lum\'ah al-Nuraniyyah (The Luminous Gleam of Divine Litanies)',
    titleHa: 'Al-Lum\'ah al-Nuraniyyah (Hasken Wuridi na Ubangiji)',
    authorAr: 'الشيخ أحمد بن علي البوني',
    authorFr: 'Ahmad al-Buni',
    authorEn: 'Ahmad al-Buni',
    authorHa: 'Ahmad al-Buni',
    century: 'XIIIe Siècle (Maghreb / Le Caire)',
    categoryFr: 'Invocations & Litanies Divines (Awrad & Hizb)',
    categoryEn: 'Sacred Invocations & Divine Litanies',
    categoryHa: 'Wuridi da Addu\'o\'in Dare',
    themeColor: 'from-amber-400 via-teal-500 to-emerald-700',
    bgGlow: '#38bdf8',
    icon3dType: 'lumah',
    introFr: {
      summary: 'Al-Lum\'ah al-Nuraniyyah est le recueil sacré d\'Al-Buni regroupant les litanies nocturnes (Awrad Rabbaniyyah) et les invocations du Plus Grand Nom d\'Allah (Ism Allah al-Azam).',
      historicalContext: 'Transmis aux disciples de la voie théurgique, ce texte sert de bouclier de protection et de moyen d\'élévation spirituelle directe.',
      esotericSignificance: 'Révèle les combinaisons secrètes des 99 Noms d\'Allah à réciter lors des heures de contemplation nocturne (Sahar).',
      keyThemes: [
        'Le Mystère du Plus Grand Nom d\'Allah (Ism Allah al-Azam)',
        'Les Litanies des 4 Archanges (Jibril, Mika\'il, Israfil, Azra\'il)',
        'L\'ouverture des portes de l\'exaucement rapide',
        'Les cercles de protection (Hizb al-Wiqayah)'
      ],
      chapterBreakdown: [
        'Partie I : Les invocations de l\'Aube et du Dernier Tiers de la Nuit',
        'Partie II : Les 7 Litanies des Archanges et leurs sceaux',
        'Partie III : Le Secret du Nom Suprême et son carré magique',
        'Partie IV : Protection contre toutes les afflictions et attaques'
      ],
      practicalEthics: 'Pratique exclusive pendant les heures de quiétude, avec la concentration du cœur.'
    },
    introEn: {
      summary: 'Al-Lum\'ah al-Nuraniyyah is Al-Buni\'s sacred anthology of nocturnal litanies (Awrad Rabbaniyyah) and secrets of the Greatest Divine Name (Ism Allah al-Azam).',
      historicalContext: 'Passed down to spiritual initiates, it functions as both a cosmic shield and a vehicle for rapid spiritual ascension.',
      esotericSignificance: 'Unveils secret combinations of the 99 Names of Allah aligned with the quiet hours of night contemplation (Sahar).',
      keyThemes: [
        'The Mystery of the Supreme Divine Name (Ism Allah al-Azam)',
        'Litanies of the 4 Archanges (Gabriel, Michael, Raphael, Azrael)',
        'Keys to Rapid Prayer Fulfillment',
        'Protective Shields & Litanies (Hizb al-Wiqayah)'
      ],
      chapterBreakdown: [
        'Part I: Dawn & Pre-Dawn (Sahar) Devotional Litanies',
        'Part II: The 7 Archangelic Litanies & Consecrated Glyphs',
        'Part III: Mystery of the Greatest Name & Its Sacred Square',
        'Part IV: Universal Protection Shields against All Afflictions'
      ],
      practicalEthics: 'Must be recited in complete quietude with total focus of the heart.'
    },
    introHa: {
      summary: 'Al-Lum\'ah al-Nuraniyyah littafi ne na wuridi na Al-Buni wanda ke da addu\'o\'in da ake karantawa a cikin dare domin samun amsa da kariya.',
      historicalContext: 'Ana amfani da shi domin haɗa zuciya da Allah da samun kariya daga kowace irin cuta.',
      esotericSignificance: 'Yana bayyana Sunan Allah Mafi Girma (Ism Allah al-Azam) da addu\'o\'in Mala\'iku 4.',
      keyThemes: [
        'Asirin Sunan Allah Mafi Girma (Ism Allah al-Azam)',
        'Wuridai na Mala\'iku 4 (Jibril, Mika\'il, Israfil, Azra\'il)',
        'Hanyoyin Samun Amsar Addu\'a da Sauri',
        'Hizb al-Wiqayah (Garkuwar Asiri)'
      ],
      chapterBreakdown: [
        'Sashe 1: Addu\'o\'in Asuba da Cikin Dare',
        'Sashe 2: Wuridi 7 na Mala\'iku da Khatim dinsu',
        'Sashe 3: Asirin Ism al-Azam da Khatim dinsa',
        'Sashe 4: Garkuwa daga Cutar Shaidanu'
      ],
      practicalEthics: 'Yana buƙatar nutsuwa da rashin surutu lokacin karatu.'
    },
    khatim: {
      titleAr: 'وفق الاسم الأعظم والنورانيات',
      titleFr: 'Sceau Diamant du Plus Grand Nom (Ism al-Azam)',
      titleEn: 'Diamond Seal of the Greatest Divine Name',
      titleHa: 'Khatim ta Ism Allah al-Azam',
      gridSize: 3,
      cells: [
        ['حي', 'قيوم', 'فرد'],
        ['جبار', 'أعظم', 'شكور'],
        ['ثابت', 'ظهير', 'خبیر']
      ],
      arabicFormula: 'يا حي يا قيوم يا ذا الجلال والإكرام - سر اللمعة النورانية.',
      descriptionFr: 'Sceau 3x3 condensant les Noms Vivant et Subsistant (Ya Hayyu Ya Qayyumu) pour l\'illumination du cœur.',
      descriptionEn: '3x3 Seal embodying the Ever-Living and Sustaining Names (Ya Hayyu Ya Qayyumu) for spiritual awakening.',
      descriptionHa: 'Khatim 3x3 ta Ya Hayyu Ya Qayyumu domin samun nasara da hasken zuciya.',
      abjadWeight: 174,
      element: 'water'
    }
  },

  // 12. Kitab al-Diryak
  {
    id: 'book_kitab_diryak',
    titleAr: 'كتاب الدرياق (الدر الترياقي)',
    titleFr: 'Kitab al-Diryak (Le Livre de la Thériaque & Guérison)',
    titleEn: 'Kitab al-Diryak (The Book of Theriac & Healing)',
    titleHa: 'Kitab al-Diryak (Littafin Maganin Theriac da Waraka)',
    authorAr: 'جالينوس (المترجم إلى العربية)',
    authorFr: 'Pseudo-Galien / Al-Jalinus',
    authorEn: 'Pseudo-Galen / Al-Jalinus',
    authorHa: 'Jalinus',
    century: 'Antiquité / Traduction de l\'Âge d\'Or Islamique',
    centuryFr: 'Antiquité / Traduction de l\'Âge d\'Or Islamique',
    centuryEn: 'Antiquity / Islamic Golden Age Translation',
    centuryHa: 'Tsohon Zamani / Fassarar Zamanin Zinari na Musulunci',
    categoryFr: 'Médecine Spirituelle & Herbalisme Sacré',
    categoryEn: 'Spiritual Medicine & Sacred Herbalism',
    categoryHa: 'Ilimin Maganin Bishiyoyi da Kariya',
    themeColor: 'from-emerald-700 via-teal-600 to-green-900',
    bgGlow: '#10b981',
    icon3dType: 'diryak',
    introFr: {
      summary: 'Kitab al-Diryak (Le Livre de la Thériaque) est l\'un des manuscrits arabo-grecs les plus précieux combinant la pharmacopée sacrée, l\'astrologie médicale et la thérapie par les sceaux spirituels.',
      historicalContext: 'Célèbre pour ses illuminations et ses peintures médiévales, le texte détaille la confection du grand antidote (Thériaque) contre tous les venins, poisons et maladies occultes.',
      esotericSignificance: 'Associe la cueillette des herbes médicinales aux phases de la Lune et aux heures planétaires, gravant des sceaux de guérison sur les récipients de préparation.',
      keyThemes: [
        'La Thériaque Sacrée (Al-Tiryaq al-Farooq) et ses 64 ingrédients',
        'L\'Astrologie Médicale et l\'influence de la Lune sur la guérison',
        'Les sceaux de préservation de la santé et contre le venin',
        'L\'harmonisation des 4 humeurs physiques (Sang, Phlegme, Bile Jaune, Bile Noire)'
      ],
      chapterBreakdown: [
        'Chapitre 1 : L\'histoire d\'Andromaque et l\'invention de la Thériaque',
        'Chapitre 2 : La cueillette céleste des plantes selon les 28 Demeures',
        'Chapitre 3 : La préparation rituelle et la fermentation des élixirs',
        'Chapitre 4 : Les sceaux de guérison d\'Al-Diryak'
      ],
      practicalEthics: 'Doit être confectionné avec le respect strict de la pureté et de la nature.'
    },
    introEn: {
      summary: 'Kitab al-Diryak (The Book of Theriac) is a celebrated Arabic-Hellenistic manuscript blending sacred pharmacopeia, medical astrology, and spiritual healing seals.',
      historicalContext: 'Famous for its exquisite medieval illustrations, the text catalogues the supreme panacea (Theriac) protecting against all poisons, venoms, and esoteric afflictions.',
      esotericSignificance: 'Synchronizes herb gathering with lunar phases and planetary hours, engraving healing seals upon medicinal vessels.',
      keyThemes: [
        'The Sacred Theriac (Al-Tiryaq al-Farooq) & Its 64 Ingredients',
        'Medical Astrology & Lunar Influences on Healing',
        'Protective Seals against Poisons, Venoms & Hexes',
        'Balancing the 4 Bodily Humors (Blood, Phlegm, Yellow Bile, Black Bile)'
      ],
      chapterBreakdown: [
        'Chapter 1: History of Andromachus & Invention of the Theriac',
        'Chapter 2: Celestial Herb Harvesting by the 28 Lunar Mansions',
        'Chapter 3: Sacred Preparation & Elixir Fermentation Protocols',
        'Chapter 4: Healing Seals & Consecrated Remedies'
      ],
      practicalEthics: 'Demands reverence for natural herbs, ritual purity, and ethical medicine.'
    },
    introHa: {
      summary: 'Kitab al-Diryak littafi ne mai muhimmanci kan ilimin magani, bishiyoyi da zana Khatim din waraka daga kowace cuta da sihiri.',
      historicalContext: 'Yana da shahara wajen bayyana haɗa magani 64 domin kariya daga dafin maciji, poizin da aljannu.',
      esotericSignificance: 'Yana koya cewa ana debo maganin bishiyoyi ne lokacin da wata ke manazil mai kyau.',
      keyThemes: [
        'Babban Magani na Theriac da Kayan Hadawa 64',
        'Ilimin Taurari da Lokacin Debo Bishiyoyi',
        'Khatim din Waraka daga Cututtuka da Sihiri',
        'Daidaita Jini da Yanayin Jiki'
      ],
      chapterBreakdown: [
        'Babi na 1: Tarihin Maganin Theriac da Gano Shi',
        'Babi na 2: Debo Ganyaye ta Hanyar Manazil al-Qamar 28',
        'Babi na 3: Hadawa da Sarrafa Magani',
        'Babi na 4: Zana Khatim na Waraka'
      ],
      practicalEthics: 'Yana buƙatar kiyaye tsarki da gaskiya ga marasa lafiya.'
    },
    khatim: {
      titleAr: 'خاتم الشفاء والدرياق الترياقي',
      titleFr: 'Sceau 3x3 de Guérison & Thériaque Sacrée',
      titleEn: '3x3 Healing & Theriac Sacred Seal',
      titleHa: 'Khatim 3x3 ta Waraka da Theriac',
      gridSize: 3,
      cells: [
        ['شافي', 'معافي', 'سلام'],
        ['نور', 'ترياق', 'رحمة'],
        ['حي', 'قيوم', 'قدوس']
      ],
      arabicFormula: 'وننزل من القرآن ما هو شفاء ورحمة للمؤمنين - وفق الدرياق المبارك.',
      descriptionFr: 'Sceau 3x3 d\'invitation de la guérison divine et d\'annulation des toxines physiques et spirituelles.',
      descriptionEn: '3x3 Seal invokating divine healing and neutralization of physical and spiritual toxins.',
      descriptionHa: 'Khatim 3x3 domin samun lafiya da wanke jiki daga cuta.',
      abjadWeight: 1391,
      element: 'water'
    }
  },
  {
    id: 'book_dalail_khayrat',
    titleAr: 'دلائل الخيرات وشوارق الأنوار',
    titleFr: 'Dala\'il al-Khayrat (Les Preuves des Bienfaits)',
    titleEn: 'Dala\'il al-Khayrat (The Guide to Goodness)',
    titleHa: 'Dalail al-Khayrat (Masaidan Alheri da Haske)',
    authorAr: 'محمد بن سليمان الجزولي',
    authorFr: 'Muhammad al-Jazuli',
    authorEn: 'Muhammad al-Jazuli',
    authorHa: 'Muhammad al-Jazuli',
    century: 'XVᵉ Siècle',
    centuryFr: 'XVe Siècle',
    centuryEn: '15th Century',
    centuryHa: 'Karni na 15',
    categoryFr: 'Salawat & Litanies Soufies',
    categoryEn: 'Salawat & Sufi Litanies',
    categoryHa: 'Salawat da Addu\'o\'i',
    themeColor: 'from-emerald-700 via-teal-600 to-amber-700',
    bgGlow: '#059669',
    icon3dType: 'dalail',
    introFr: {
      summary: 'Dala\'il al-Khayrat est le recueil de bénédictions sur le Prophète (صلى الله عليه وسلم) le plus lu dans le monde musulman, compilé par le saint soufi marocain Muhammad al-Jazuli.',
      historicalContext: 'Rédigé au XVe siècle au Maroc, al-Jazuli l\'a composé après un miracle d\'eau jaillissant d\'un puits asséché grâce aux prières sur le Prophète.',
      esotericSignificance: 'Les prières contiennent les 201 Noms sacrés du Prophète (صلى الله عليه وسلم) et des formules d\'élévation spirituelle débloquant la subsistance et dissipant les peines.',
      keyThemes: [
        'Les 201 Noms Bénis du Prophète Muhammad (صلى الله عليه وسلم)',
        'Litanies quotidiennes structurées du Lundi au Dimanche',
        'Ouverture des portes de la miséricorde et purification du cœur',
        'Protection contre la détresse spirituelle et matérielle'
      ],
      chapterBreakdown: [
        'Chapitre 1 : Les 201 Noms sacrés du Prophète',
        'Chapitre 2 : Descriptions de la Rawdah bénie à Médine',
        'Chapitre 3 : Litanies du Lundi et Mardi',
        'Chapitre 4 : Litanies du Mercredi et Jeudi',
        'Chapitre 5 : Litanies du Vendredi, Samedi et Dimanche'
      ],
      practicalEthics: 'Réciter avec ablutions complètes, orientation vers la Qibla et amour profond envers le Messager d\'Allah.'
    },
    introEn: {
      summary: 'Dala\'il al-Khayrat is the most celebrated compilation of blessings upon the Prophet Muhammad (pbuh), authored by Moroccan Sufi master Muhammad al-Jazuli.',
      historicalContext: 'Composed in 15th-century Morocco following a miraculous event where water overflowed from a dry well through prayers upon the Prophet.',
      esotericSignificance: 'Contains 201 sacred names of the Prophet and spiritual formulas that unlock sustenance, dissolve distress, and elevate the seeker\'s soul.',
      keyThemes: [
        'The 201 Blessed Names of Prophet Muhammad (pbuh)',
        'Daily litanies divided into 7 weekly portions',
        'Opening doors of divine mercy and heart purification',
        'Protection from spiritual and worldly hardships'
      ],
      chapterBreakdown: [
        'Chapter 1: The 201 Sacred Names of the Prophet',
        'Chapter 2: Description of the Blessed Rawdah in Medina',
        'Chapter 3: Monday & Tuesday Litanies',
        'Chapter 4: Wednesday & Thursday Litanies',
        'Chapter 5: Friday, Saturday & Sunday Litanies'
      ],
      practicalEthics: 'Recite in state of purity, facing the Qibla, with sincere devotion to the Messenger of God.'
    },
    introHa: {
      summary: 'Dalail al-Khayrat shine mafi shaharar littafin Salatin Annabi (SAW) a duk fadin duniya, wanda Shehi Muhammad al-Jazuli na kasar Morocco ya rubuta.',
      historicalContext: 'An rubuta shi a karni na 15 bayan wata al\'ajabi ta ruwa da ta ɓulɓulo daga rijiya sakamakon amfanin salatin Annabi.',
      esotericSignificance: 'Yana ɗauke da Sunaye 201 na Annabi (SAW) da hanyoyin samun buɗaɗɗen arziki, maganin matsaloli da tsarkake zuciya.',
      keyThemes: [
        'Sunaye 201 Masu Albarka na Annabi Muhammad (SAW)',
        'Wiridodin kowace ranar mako daga Litinin zuwa Lahadi',
        'Buɗe ƙofofin rahama da tsarkake zuciya',
        'Kariya daga tsanani da damuwa'
      ],
      chapterBreakdown: [
        'Babi na 1: Sunaye 201 na Annabi (SAW)',
        'Babi na 2: Siffanta Rawdah Mai Albarka a Madina',
        'Babi na 3: Karatun Litinin da Talata',
        'Babi na 4: Karatun Laraba da Alhamis',
        'Babi na 5: Karatun Juma\'a, Asabar da Lahadi'
      ],
      practicalEthics: 'Ana karantawa da alwala, fuskantar alqibla da kuma kauna ta gaskiya ga Annabi.'
    },
    khatim: {
      titleAr: 'خاتم الدلائل النبوية المباركة',
      titleFr: 'Sceau 4x4 Muhammadi de Dala\'il al-Khayrat',
      titleEn: '4x4 Muhammadi Seal of Dala\'il al-Khayrat',
      titleHa: 'Khatim 4x4 na Dalail al-Khayrat',
      gridSize: 4,
      cells: [
        ['محمد', 'أحمد', 'حامد', 'محمود'],
        ['قاسم', 'شاهد', 'بشير', 'نذير'],
        ['داع', 'سراج', 'منير', 'طه'],
        ['يس', 'رؤوف', 'رحيم', 'مصطفى']
      ],
      arabicFormula: 'اللهم صل على سيدنا محمد وعلى آل سيدنا محمد عدد ما في علم الله صلاة دائمة بدوام ملك الله.',
      descriptionFr: 'Carré 4x4 d\'harmonie des Noms du Prophète pour attirer les bénédictions et dissiper les maux.',
      descriptionEn: '4x4 Sacred Square of Prophetic Names attracting divine blessings and driving away evil.',
      descriptionHa: 'Khatim 4x4 na Sunayen Annabi domin janyo albarka da kori dukkan cuta.',
      abjadWeight: 1472,
      element: 'water'
    }
  },
  {
    id: 'book_sahifah_sajjadiyyah',
    titleAr: 'الصحيفة السجادية الكاملة',
    titleFr: 'Al-Sahifah al-Sajjadiyyah (Le Livre de la Prostration)',
    titleEn: 'Al-Sahifah al-Sajjadiyyah (The Psalms of Islam)',
    titleHa: 'Al-Sahifah al-Sajjadiyyah (Littafin Sujuda da Munajati)',
    authorAr: 'الإمام علي بن الحسين زين العابدين',
    authorFr: 'Imam Ali ibn al-Husayn (Zayn al-Abidin)',
    authorEn: 'Imam Ali ibn al-Husayn (Zayn al-Abidin)',
    authorHa: 'Imam Ali ibn al-Husayn (Zayn al-Abidin)',
    century: 'VIIᵉ-VIIIᵉ Siècle',
    centuryFr: 'VIIe-VIIIe Siècle',
    centuryEn: '7th-8th Century',
    centuryHa: 'Karni na 7-8',
    categoryFr: 'Invocations Gnostiques & Sujuda',
    categoryEn: 'Gnostic Prayers & Psalms',
    categoryHa: 'Addu\'o\'in Gnosis da Munajati',
    themeColor: 'from-teal-800 via-emerald-700 to-indigo-900',
    bgGlow: '#0d9488',
    icon3dType: 'sahifah',
    introFr: {
      summary: 'Surnommé "Les Psaumes de l\'Islam", ce chef-d\'œuvre rassemble 54 invocations sublimes de l\'Imam Zayn al-Abidin (petit-fils d\'Ali ibn Abi Talib), alliance parfaite de haute métaphysique et d\'humilité.',
      historicalContext: 'Rédigé après les tragédies de Karbala au Ier siècle de l\'Hégire, l\'Imam y a préservé l\'éthique spirituelle pure à travers l\'art de l\'invocation contemplative.',
      esotericSignificance: 'Chaque invocation agit comme une médecine sacrée pour l\'âme, enseignant la soumission complète aux Noms divins et l\'annulation du faux ego.',
      keyThemes: [
        'La prière pour le repentir (Al-Tawbah) et la demande de pardon',
        'La demande d\'éviction des périls et la guérison des maladies',
        'La prière pour les parents et les devoirs de fraternité',
        'La quête de la certitude (Yaqin) et la sérénité du cœur'
      ],
      chapterBreakdown: [
        'Prière 1 : Sur la louange d\'Allah et la grandeur divine',
        'Prière 7 : Dans les difficultés et les peines écrasantes',
        'Prière 20 : Sur les nobles caractères (Makarim al-Akhlaq)',
        'Prière 31 : Sur le repentir et le retour sincère',
        'Prière 54 : Sur l\'éloignement des soucis et des frayeurs'
      ],
      practicalEthics: 'À lire lors des moments de solitude, dans la posture de prostration et d\'abandon confiant à la Providence.'
    },
    introEn: {
      summary: 'Known as "The Psalms of Islam", this timeless spiritual treasure contains 54 profound supplications by Imam Zayn al-Abidin, blending lofty metaphysics with intense devotion.',
      historicalContext: 'Composed following the tragedy of Karbala in the 7th century, the Imam preserved spiritual wisdom through poetic, intimate prayers to God.',
      esotericSignificance: 'Serves as spiritual medicine for the inner heart, cultivating complete trust (Tawakkul) and purifying the seeker from worldly anxieties.',
      keyThemes: [
        'Supplication for repentance and seeking divine forgiveness',
        'Prayer in times of crushing hardship and illness',
        'Blessings upon parents and communal harmony',
        'Attaining unwavering faith (Yaqin) and inner peace'
      ],
      chapterBreakdown: [
        'Prayer 1: Praise of Allah and divine majesty',
        'Prayer 7: In times of hardship and severe trials',
        'Prayer 20: On Noble Moral Virtues (Makarim al-Akhlaq)',
        'Prayer 31: On Repentance and sincere returning to God',
        'Prayer 54: On removing worries and anxieties'
      ],
      practicalEthics: 'Best recited during nighttime solitude, in prostration, with profound presence of heart.'
    },
    introHa: {
      summary: 'Wanda ake kira da "Zabura ta Musulunci", littafi ne da ke ɗauke da addu\'o\'i 54 masu zurfi daga Imam Zayn al-Abidin.',
      historicalContext: 'An rubuta shi a karni na 7 bayan abubuwan da suka faru a Karbala, domin kiyaye hikimomin addini ta hanyar addu\'a.',
      esotericSignificance: 'Magani ne na ruhin mutum wanda ke koya mika wuya ga Allah da tsarkake zuciya daga damuwa.',
      keyThemes: [
        'Addu\'ar Tuba da Neman Gafara',
        'Addu\'a a lokacin Tsanani da Cuta',
        'Addu\'ar Iyayenmu da Sada Zumunci',
        'Samun Tabbataccen Imani da Natsuwa'
      ],
      chapterBreakdown: [
        'Addu\'a 1: Yabon Allah da Girmansa',
        'Addu\'a 7: A Lokacin Tsanani da Gwaji',
        'Addu\'a 20: Halaye Masu Kyau (Makarim al-Akhlaq)',
        'Addu\'a 31: Tuba na Gaskiya',
        'Addu\'a 54: Yayewar Damuwa da Tsoro'
      ],
      practicalEthics: 'Ana karantawa lokacin tsakar dare da lokacin sujuda ga Allah.'
    },
    khatim: {
      titleAr: 'خاتم الصحيفة والسكينة السجادية',
      titleFr: 'Sceau 3x3 de Sérénité & Sujuda',
      titleEn: '3x3 Seal of Serenity & Prostration',
      titleHa: 'Khatim 3x3 na Natsuwa da Sujuda',
      gridSize: 3,
      cells: [
        ['حليم', 'عفو', 'غفور'],
        ['سلام', 'سجود', 'رحيم'],
        ['ودود', 'قريب', 'مجيب']
      ],
      arabicFormula: 'يا من يحل به عقد المكاره ويا من يفثأ به حد الشدائد - الصحيفة السجادية.',
      descriptionFr: 'Khatim de paix intérieure et de déliement des nœuds d\'adversité.',
      descriptionEn: 'Sacred 3x3 Khatim for inner peace and untying knots of hardship.',
      descriptionHa: 'Khatim 3x3 domin samun natsuwa da warware matsaloli.',
      abjadWeight: 1280,
      element: 'earth'
    }
  },
  {
    id: 'book_ahzab_shadhili',
    titleAr: 'الأحزاب المباركة (حزب البحر وحزب النصر)',
    titleFr: 'Les Ahzab (Hizb al-Bahr et Hizb al-Nasr)',
    titleEn: 'The Litanies of Shadhili (Hizb al-Bahr & Hizb al-Nasr)',
    titleHa: 'Ahzab al-Shadhili (Hizb al-Bahr da Hizb al-Nasr)',
    authorAr: 'أبو الحسن الشاذلي',
    authorFr: 'Abul Hasan al-Shadhili',
    authorEn: 'Abul Hasan al-Shadhili',
    authorHa: 'Abul Hasan al-Shadhili',
    century: 'XIIIᵉ Siècle',
    categoryFr: 'Protections Théurgiques & Victoire',
    categoryEn: 'Theurgic Shield & Victory Litanies',
    categoryHa: 'Addu\'o\'in Kariyar Shadhili',
    themeColor: 'from-cyan-800 via-blue-700 to-amber-800',
    bgGlow: '#0891b2',
    icon3dType: 'ahzab_shadhili',
    introFr: {
      summary: 'Les Ahzab du Cheikh Abul Hasan al-Shadhili (fondateur de la voie Shadhiliyya) comptent parmi les boucliers théurgiques les plus puissants du patrimoine soufi, en particulier Hizb al-Bahr (Litanie de la Mer) et Hizb al-Nasr (Litanie de la Victoire).',
      historicalContext: 'Composé au XIIIe siècle alors que le Cheikh traversait la Mer Rouge vers la Mecque, Hizb al-Bahr lui fut dicté par le Prophète (صلى الله عليه وسلم) en vision spirituelle.',
      esotericSignificance: 'Formulés avec les mystérieuses lettres disjointes (Huruf Muqatta\'at) et les Versets de protection, ces Ahzab soumettent les éléments contraires et anéantissent le mal occulte.',
      keyThemes: [
        'Hizb al-Bahr : Traversée sécurisée, apaisement des tempêtes et domination spirituelle',
        'Hizb al-Nasr : Victoire sur les oppresseurs et déjouement des pièges invisibles',
        'Utilisation des mystères des voyelles et des 7 Ha-Mim',
        'Protection inviolable contre l\'envie (Hasad) et la sorcellerie'
      ],
      chapterBreakdown: [
        'Partie 1 : Hizb al-Bahr - La grande litanie navale et céleste',
        'Partie 2 : Hizb al-Nasr - La litanie de la foudre et de la victoire',
        'Partie 3 : Hizb al-Birr - La litanie de la piété et des grâces',
        'Partie 4 : Invocations d\'immersion et clés de lecture'
      ],
      practicalEthics: 'Doit être récité avec la certitude absolue en la victoire divine et l\'interdiction stricte d\'utiliser ces prières pour léser l\'innocent.'
    },
    introEn: {
      summary: 'The Ahzab of Sheikh Abul Hasan al-Shadhili (founder of the Shadhiliyya order) are world-renowned spiritual shields, notably Hizb al-Bahr (Litanie of the Sea) and Hizb al-Nasr (Litanie of Victory).',
      historicalContext: 'Composed in the 13th century while crossing the Red Sea, Hizb al-Bahr was dictated directly by the Prophet (pbuh) in a blessed vision.',
      esotericSignificance: 'Infused with Quranic disjoined letters (Muqatta\'at) and powerful verses, these litanies calm stormy waters and neutralize hostile spiritual forces.',
      keyThemes: [
        'Hizb al-Bahr: Safe travels, calming storms, and spiritual mastery',
        'Hizb al-Nasr: Victory over oppressors and crushing invisible traps',
        'Mysteries of the 7 Ha-Mim and divine seals',
        'Impenetrable shield against envy, evil eye, and sorcery'
      ],
      chapterBreakdown: [
        'Part 1: Hizb al-Bahr - The Great Sea & Celestial Litany',
        'Part 2: Hizb al-Nasr - The Sword of Victory',
        'Part 3: Hizb al-Birr - Litany of Righteousness',
        'Part 4: Ritual keys and recitation guidelines'
      ],
      practicalEthics: 'Requires unwavering faith in God\'s protection and strict prohibition of invoking harm against the innocent.'
    },
    introHa: {
      summary: 'Ahzab na Shehi Abul Hasan al-Shadhili suna daga cikin mafi ƙarfin addu\'o\'in tsaro na Sufaye, musamman Hizb al-Bahr da Hizb al-Nasr.',
      historicalContext: 'An rubuta Hizb al-Bahr ne a karni na 13 lokacin da Shehi yake tsallaka teku zuwa Makkah.',
      esotericSignificance: 'Yana ɗauke da haruffa na sirri (Muqatta\'at) da akayi amfani da su wajen korar dukkan sanyin gwiwa da sihiri.',
      keyThemes: [
        'Hizb al-Bahr: Tsaron tafiya teku/tudu da natsuwa',
        'Hizb al-Nasr: Nasara akan makiya da mugayen mutane',
        'Asirin Haruffa 7 na Ha-Mim',
        'Kariya daga hassada da sihiri'
      ],
      chapterBreakdown: [
        'Babi na 1: Hizb al-Bahr',
        'Babi na 2: Hizb al-Nasr',
        'Babi na 3: Hizb al-Birr',
        'Babi na 4: Ka\'idojin Karatu da Tsaro'
      ],
      practicalEthics: 'Karantawa da yakini kan kariya daga Allah da guje wa cutar da wani.'
    },
    khatim: {
      titleAr: 'خاتم النصر وحجاب البحر الشاذلي',
      titleFr: 'Sceau 4x4 de Victoire & Hizb al-Bahr',
      titleEn: '4x4 Seal of Victory & Hizb al-Bahr',
      titleHa: 'Khatim 4x4 na Hizb al-Bahr da Nasara',
      gridSize: 4,
      cells: [
        ['كهيعص', 'حمعسق', 'نصر', 'عزيز'],
        ['حفيظ', 'مانع', 'قاهر', 'قادر'],
        ['غالـب', 'ظافر', 'قوي', 'متين'],
        ['سلام', 'أمان', 'نجاة', 'ظفر']
      ],
      arabicFormula: 'يا علي يا عظيم يا حليم يا عليم انت ربي وعلمك حسبي - حزب البحر.',
      descriptionFr: 'Carré 4x4 théurgique de protection absolue contre la noyade, les périls et les batailles.',
      descriptionEn: 'Theurgic 4x4 Square ensuring absolute protection against hardship, peril, and attacks.',
      descriptionHa: 'Khatim 4x4 na kariya daga dukkan tsanani da abokan gaba.',
      abjadWeight: 1655,
      element: 'water'
    }
  },
  {
    id: 'book_adhkar_nawawi',
    titleAr: 'الأذكار النواوية (حلية الأبرار وشعار الأخيار)',
    titleFr: 'Al-Adhkar al-Nawawiyyah (Le Livre des Rappels)',
    titleEn: 'Al-Adhkar al-Nawawiyyah (The Book of Remembrances)',
    titleHa: 'Al-Adhkar al-Nawawiyyah (Littafin Askar da Addu\'o\'in Sunnah)',
    authorAr: 'الإمام يحيى بن شرف النووي',
    authorFr: 'Imam Yahya ibn Sharaf al-Nawawi',
    authorEn: 'Imam Yahya ibn Sharaf al-Nawawi',
    authorHa: 'Imam Yahya ibn Sharaf al-Nawawi',
    century: 'XIIIᵉ Siècle',
    categoryFr: 'Adhkar Sunnah & Protection Quotidienne',
    categoryEn: 'Prophetic Dhikr & Daily Protection',
    categoryHa: 'Azkar na Sunnah da Kariya',
    themeColor: 'from-amber-700 via-yellow-600 to-emerald-800',
    bgGlow: '#d97706',
    icon3dType: 'adhkar_nawawi',
    introFr: {
      summary: 'L\'encyclopédie incontournable des rappels et invocations de la Sunnah prophétique rassemblée par l\'illustre Imam al-Nawawi, guidant le croyant du réveil jusqu\'au sommeil.',
      historicalContext: 'Rédigé à Damas au XIIIe siècle, ce classique a établi la référence universelle de l\'invocation authentique pour chaque acte de la vie quotidienne.',
      esotericSignificance: 'Répéter ces adhkars crée un bouclier de lumière (Nur) permanent autour de la personne, purifiant l\'aura et maintenant la conscience divine constante (Hudur).',
      keyThemes: [
        'Adhkar du matin et du soir (Adhkar al-Sabah wa al-Masa)',
        'Invocations lors des voyages, repas, sommeil et épreuves',
        'Invocations de guérison (Ruqyah) et protection des enfants',
        'Les mérites du Tasbih, Tahmid, Tahlil et Takbir'
      ],
      chapterBreakdown: [
        'Chapitre 1 : L\'excellence du Dhikr et les conditions de sincérité',
        'Chapitre 2 : Les rappels du réveil, de la prière et de la nuit',
        'Chapitre 3 : Les adhkars des situations d\'urgence et peurs',
        'Chapitre 4 : La médecine prophétique par les versets et dhikrs',
        'Chapitre 5 : Les étiquettes de l\'invocation exaucée'
      ],
      practicalEthics: 'Assiduité quotidienne et régularité sans ostentation.'
    },
    introEn: {
      summary: 'The essential encyclopedia of Prophetic remembrances compiled by Imam al-Nawawi, guiding the seeker from morning awakening to night rest.',
      historicalContext: 'Authored in 13th-century Damascus, it remains the gold standard for authentic daily invocations rooted in the Sunnah.',
      esotericSignificance: 'Regular recitation establishes a permanent light fortress around the seeker, maintaining unbroken divine presence.',
      keyThemes: [
        'Morning and Evening Remembrances (Sabah & Masa)',
        'Invocations for travel, meals, sleep, and trials',
        'Spiritual healing (Ruqyah) and shielding children',
        'Excellence of Tasbih, Tahmid, Tahlil, and Takbir'
      ],
      chapterBreakdown: [
        'Chapter 1: Virtues of Dhikr and sincerity',
        'Chapter 2: Remembrances of waking, prayers, and sleep',
        'Chapter 3: Supplications during distress and fear',
        'Chapter 4: Prophetic healing litanies',
        'Chapter 5: Etiquettes of accepted prayer'
      ],
      practicalEthics: 'Daily consistency with humility and mindful heart.'
    },
    introHa: {
      summary: 'Manhajar addu\'o\'i da azkar na Sunnah da Imam al-Nawawi ya tattara domin gudanar da rayuwar yau da kullum.',
      historicalContext: 'An rubuta shi a kasar Damas a karni na 13 kuma ya zama madubin dubawa na azkar ingantattu.',
      esotericSignificance: 'Maimaita wadannan azkar yana sanya haske na mala\'iku da kariya a jikin mutum.',
      keyThemes: [
        'Azkar na Safe da Yamma',
        'Addu\'o\'in Tafiya, Abinci da Barci',
        'Ruqyah na Sunnah da Kariyar Yara',
        'Falalar Tasbihi da Tahmidi da Takbiri'
      ],
      chapterBreakdown: [
        'Babi na 1: Falalar Zikiri',
        'Babi na 2: Azkar na Tashi Daga Barci zuwa Kwanta',
        'Babi na 3: Addu\'a a Lokacin Tsoro',
        'Babi na 4: Magani ta Hanyar Ayoyi',
        'Babi na 5: Laduban Amsa Addu\'a'
      ],
      practicalEthics: 'Dorewa a kowace ranar ba tare da fariya ba.'
    },
    khatim: {
      titleAr: 'خاتم الحصن والذكر النواوي',
      titleFr: 'Sceau 3x3 de Protection Quotidienne',
      titleEn: '3x3 Seal of Daily Protection',
      titleHa: 'Khatim 3x3 na Azkar da Kariya',
      gridSize: 3,
      cells: [
        ['سبحان الله', 'الحمد لله', 'الله أكبر'],
        ['حفيظ', 'سلام', 'لطيف'],
        ['لا إله إلا الله', 'توكلت على الله', 'استغفر الله']
      ],
      arabicFormula: 'حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم - الأذكار النواوية.',
      descriptionFr: 'Carré 3x3 ancrant les 4 piliers du Dhikr pour une immunité spirituelle permanente.',
      descriptionEn: '3x3 Sacred Square reinforcing spiritual immunity through core remembrances.',
      descriptionHa: 'Khatim 3x3 na samun kariya ta hanyar ambaton Allah.',
      abjadWeight: 1111,
      element: 'air'
    }
  },
  {
    id: 'book_hizb_azam',
    titleAr: 'الحزب الأعظم والورد الأفخم',
    titleFr: 'Al-Hizb al-Azam wa al-Wird al-Afkham',
    titleEn: 'Al-Hizb al-Azam (The Supreme Invocation Book)',
    titleHa: 'Al-Hizb al-Azam (Babban Littafin Addu\'o\'i da Wiridi)',
    authorAr: 'الملا علي القاري',
    authorFr: 'Ali al-Qari (Mulla Ali al-Qari)',
    authorEn: 'Ali al-Qari (Mulla Ali al-Qari)',
    authorHa: 'Ali al-Qari (Mulla Ali al-Qari)',
    century: 'XVIᵉ-XVIIᵉ Siècle',
    centuryFr: 'XVIe-XVIIe Siècle',
    centuryEn: '16th-17th Century',
    centuryHa: 'Karni na 16-17',
    categoryFr: 'Grande Litanie Quotidienne',
    categoryEn: 'Supreme Daily Devotional',
    categoryHa: 'Babban Wiridin Mako',
    themeColor: 'from-yellow-700 via-amber-600 to-purple-900',
    bgGlow: '#eab308',
    icon3dType: 'hizb_azam',
    introFr: {
      summary: 'Compilation monumentale des plus belles invocations Coraniques et Hadiths authentiques, structurée par Mulla Ali al-Qari en 7 sections (une pour chaque jour de la semaine).',
      historicalContext: 'Rédigé à la Mecque au XVIIe siècle, ce texte est l\'un des recueils de dévotion les plus vénérés dans tout le monde arabe et asiatique.',
      esotericSignificance: 'Considéré comme un trésor d\'Ism al-Azam, la récitation méthodique de cet Hizb garantit l\'exaucement des vœux et le réconfort dans les épreuves.',
      keyThemes: [
        'Rassemblement exhaustif des supplications des Prophètes (d\'Adam à Muhammad)',
        'Répartition hebdomadaire en 7 Manzils',
        'Appel aux Noms Suprêmes d\'Allah (Al-Asma al-Husna)',
        'Obtention du salut ici-bas et dans l\'au-delà'
      ],
      chapterBreakdown: [
        'Manzil 1 (Lundi) : Les prières d\'ouverture et louanges suprêmes',
        'Manzil 2 (Mardi) : Invocations de protection et pardon',
        'Manzil 3 (Mercredi) : Supplications de guidance et lumière',
        'Manzil 4 (Jeudi) : Invocations de subsistance et santé',
        'Manzil 5 à 7 (Vendredi - Dimanche) : Couronnement des invocations et Salawat'
      ],
      practicalEthics: 'Réciter une section chaque jour après le Fajr ou le Maghrib.'
    },
    introEn: {
      summary: 'A monumental collection of authentic Quranic and Prophetic prayers organized into 7 daily portions by the great scholar Mulla Ali al-Qari.',
      historicalContext: 'Compiled in Mecca during the 17th century, it is universally cherished across Islamic spiritual traditions.',
      esotericSignificance: 'Embedded with secrets of Ism al-Azam, its disciplined daily recitation brings divine relief and guaranteed spiritual elevation.',
      keyThemes: [
        'Complete anthology of prayers from all Prophets',
        'Weekly division into 7 daily Manzils',
        'Invocation through Allah\'s Supreme Names',
        'Attaining salvation in this life and the hereafter'
      ],
      chapterBreakdown: [
        'Manzil 1 (Monday): Opening praise and supreme supplications',
        'Manzil 2 (Tuesday): Shielding and forgiveness prayers',
        'Manzil 3 (Wednesday): Guidance and enlightenment litanies',
        'Manzil 4 (Thursday): Sustenance and well-being',
        'Manzil 5-7 (Friday-Sunday): Concluding devotions & blessings'
      ],
      practicalEthics: 'Recite one portion daily following Dawn or Dusk prayers.'
    },
    introHa: {
      summary: 'Manhajar addu\'o\'in Alqur\'ani da Hadisi da Mulla Ali al-Qari ya shirya kashi 7 domin karantawa a kowace ranar mako.',
      historicalContext: 'An rubuta shi a Makkah a karni na 17 kuma ya zama daya daga littattafai mafi daraja.',
      esotericSignificance: 'Yana ɗauke da sirrin Ism al-Azam wanda ke sauƙaƙa amsa addu\'a da warware matsaloli.',
      keyThemes: [
        'Tattara addu\'o\'in dukkan Annabawa',
        'Raba karatun zuwa kashi 7 na ranakun mako',
        'Kiran Allah ta hanyar Sunayensa Masu Daraja',
        'Samun Rabauta duniya da lahira'
      ],
      chapterBreakdown: [
        'Kashi na 1 (Litinin): Yabo da Nemam Taimako',
        'Kashi na 2 (Talata): Addu\'ar Kariya da Gafara',
        'Kashi na 3 (Laraba): Addu\'ar Shiriya',
        'Kashi na 4 (Alhamis): Addu\'ar Arziki da Lafiya',
        'Kashi 5-7 (Juma\'a - Lahadi): Cikawar Addu\'o\'i'
      ],
      practicalEthics: 'Karantar kashi guda a kowace rana bayan sallar Asuba ko Magriba.'
    },
    khatim: {
      titleAr: 'خاتم الحزب الأعظم والاسم الأعظم',
      titleFr: 'Sceau 4x4 d\'Ism al-Azam & Hizb al-Azam',
      titleEn: '4x4 Seal of Ism al-Azam & Hizb al-Azam',
      titleHa: 'Khatim 4x4 na Hizb al-Azam',
      gridSize: 4,
      cells: [
        ['الله', 'حي', 'قيوم', 'رب'],
        ['رحيم', 'عظيم', 'كريم', 'مجيد'],
        ['سميع', 'قريب', 'مجيب', 'وهاب'],
        ['فتاح', 'رزاق', 'حافظ', 'نصير']
      ],
      arabicFormula: 'اللهم إنـي أسألك بأن لك الحمد لا إله إلا أنت المنان بديع السماوات والأرض - الحزب الأعظم.',
      descriptionFr: 'Carré 4x4 des Noms d\'Exaucement pour l\'ouverture des portes de réussite.',
      descriptionEn: '4x4 Sacred Square of Divine Names unlocking doors of success and divine response.',
      descriptionHa: 'Khatim 4x4 domin buɗe ƙofofin nasara da amsa addu\'a.',
      abjadWeight: 1780,
      element: 'fire'
    }
  },
  {
    id: 'book_awrad_fathiyyah',
    titleAr: 'الأوراد الفتحية والإشارات الروحية',
    titleFr: 'Al-Awrad al-Fathiyyah (Les Litanies de l\'Ouverture)',
    titleEn: 'Al-Awrad al-Fathiyyah (The Litanies of Opening)',
    titleHa: 'Al-Awrad al-Fathiyyah (Wiridin Buɗi da Haske)',
    authorAr: 'میر سید علی ہمدانی',
    authorFr: 'Mir Sayyid Ali Hamadani',
    authorEn: 'Mir Sayyid Ali Hamadani',
    authorHa: 'Mir Sayyid Ali Hamadani',
    century: 'XIVᵉ Siècle',
    centuryFr: 'XIVe Siècle',
    centuryEn: '14th Century',
    centuryHa: 'Karni na 14',
    categoryFr: 'Ouvertures Spirituelles & Illumination',
    categoryEn: 'Spiritual Openings & Illumination',
    categoryHa: 'Wiridin Buɗi da Nasara',
    themeColor: 'from-orange-700 via-amber-600 to-indigo-900',
    bgGlow: '#ea580c',
    icon3dType: 'awrad_fathiyyah',
    introFr: {
      summary: 'Les Litanies de l\'Ouverture du grand saint du Cachemire Sayyid Ali Hamadani, réputées pour conférer l\'illumination du cœur et l\'ouverture des portes du succès matériel et spirituel.',
      historicalContext: 'Composé au XIVe siècle, ce texte fut compilé par Hamadani après avoir rencontré 1400 saints au cours de ses pérégrinations en Orient.',
      esotericSignificance: 'Considéré comme une clé (Miftah) d\'ouverture spirituelle (Fath), il dissipe le voile de l\'ignorance et attire la clairvoyance (Basirah).',
      keyThemes: [
        'Invocations d\'ouverture des cœurs et des intelligences',
        'Attraction de la lumière divine (Nur) et des secrets de la gnose',
        'Dissipation de la pauvreté et déblocage des affaires',
        'Récitation matinale collective ou individuelle'
      ],
      chapterBreakdown: [
        'Section 1 : L\'Ouverture par la louange divine suprême',
        'Section 2 : Les formules d\'Istighfar et de purification',
        'Section 3 : Les invocations pour l\'éveil de la clairvoyance',
        'Section 4 : Clôture par les prières sur le Prophète'
      ],
      practicalEthics: 'Réciter particulièrement après la prière du Fajr pour bénéficier de la bénédiction de la journée.'
    },
    introEn: {
      summary: 'The Litanies of Opening by the famous saint of Kashmir, Sayyid Ali Hamadani, celebrated for bestowing heart illumination and spiritual openings.',
      historicalContext: 'Compiled in the 14th century after Hamadani met 1,400 holy men across his Eastern spiritual travels.',
      esotericSignificance: 'Functions as a divine key (Miftah) for spiritual opening (Fath), purifying inner perception and granting wisdom.',
      keyThemes: [
        'Supplications for opening minds and hearts',
        'Attracting divine light and gnostic secrets',
        'Dispelling poverty and financial stagnation',
        'Morning litanies for daily illumination'
      ],
      chapterBreakdown: [
        'Section 1: The Great Opening through Supreme Praise',
        'Section 2: Purification formulas and seeking forgiveness',
        'Section 3: Prayers for inner vision (Basirah)',
        'Section 4: Concluding blessings upon the Prophet'
      ],
      practicalEthics: 'Recite following Dawn prayer to secure daily blessings.'
    },
    introHa: {
      summary: 'Wiridi ne na buɗaɗɗen zuciya da nasara wanda babban waliyi Sayyid Ali Hamadani ya rubuta.',
      historicalContext: 'An rubuta shi a karni na 14 bayan ya haɗu da waliyyai guda 1400 a tafiye-tafiyensa.',
      esotericSignificance: 'Mabuɗi ne na samun basira, cire duhun zuciya da buɗe ƙofofin arziki.',
      keyThemes: [
        'Addu\'o\'in Buɗe Zuciya da Basira',
        'Janyo Hasken Ubangiji da Ilimi',
        'Kori Talauci da Kullewar Lamura',
        'Wiridin Safe na Samun Albarka'
      ],
      chapterBreakdown: [
        'Babi na 1: Buɗi ta hanyar Yabon Allah',
        'Babi na 2: Nemam Gafara da Tsarkakewa',
        'Babi na 3: Addu\'ar Samun Basira',
        'Babi na 4: Salatin Annabi na Gamawa'
      ],
      practicalEthics: 'Karantawa bayan sallar Asuba domin samun albarkar rana.'
    },
    khatim: {
      titleAr: 'خاتم الفتح المبين والنور الهمداني',
      titleFr: 'Sceau 3x3 de Fath & Ouverture Divine',
      titleEn: '3x3 Seal of Fath & Divine Opening',
      titleHa: 'Khatim 3x3 na Budi da Nasara',
      gridSize: 3,
      cells: [
        ['فتاح', 'عليم', 'نور'],
        ['هادي', 'فتح', 'بصير'],
        ['وهاب', 'رزاق', 'كريم']
      ],
      arabicFormula: 'إنا فتحنا لك فتحاً مبيناً ليغفر لك الله ما تقدم من ذنبك وما تأخر - الأوراد الفتحية.',
      descriptionFr: 'Sceau 3x3 d\'ouverture des portes de la connaissance, du commerce et de la lumière.',
      descriptionEn: '3x3 Sacred Seal opening doors of knowledge, prosperity, and light.',
      descriptionHa: 'Khatim 3x3 domin samun buɗin sana\'a, ilimi da haske.',
      abjadWeight: 1489,
      element: 'fire'
    }
  },
  {
    id: 'book_jaljalutiyah',
    titleAr: 'القصيدة الجلجلوتية وشروحها الروحانية',
    titleFr: 'Al-Jaljalutiyah (Le Poème et Commentaires)',
    titleEn: 'Al-Jaljalutiyah (The Poem & Spiritual Commentary)',
    titleHa: 'Al-Jaljalutiyah (Wakar Jaljalutiyyah da Asiranta)',
    authorAr: 'المقترن بالإمام علي بن أبي طالب',
    authorFr: 'Attribué à l\'Imam Ali ibn Abi Talib',
    authorEn: 'Attributed to Imam Ali ibn Abi Talib',
    authorHa: 'An danganta ga Imam Ali ibn Abi Talib',
    century: 'Iᵉr / VIIᵉ Siècle',
    centuryFr: 'Ier / VIIe Siècle',
    centuryEn: '1st / 7th Century',
    centuryHa: 'Karni na 1 / 7',
    categoryFr: 'Poème Théurgique & Ism al-Azam',
    categoryEn: 'Theurgic Poem & Supreme Names',
    categoryHa: 'Wakar Sirrin Ism al-Azam',
    themeColor: 'from-purple-800 via-violet-700 to-amber-700',
    bgGlow: '#9333ea',
    icon3dType: 'jaljalutiyah',
    introFr: {
      summary: 'Le poème ésotérique suprême de la tradition arabo-islamique, composé de vers rhétoriques renfermant les Noms de Dieu en langue syriano-hébraïque ancienne (Suryaniyya) et arabe.',
      historicalContext: 'Transmit selon la tradition par l\'Imam Ali (que la grâce soit sur lui), commenté ensuite par Al-Buni et Al-Ghazali.',
      esotericSignificance: 'Contient les 60 versets sacrés invoquant le Nom Suprême (Ism al-Azam) pour maîtriser les forces cosmologiques et la protection physique.',
      keyThemes: [
        'Les secrets des Noms Syriens anciens (Bada\'t bi Bismillah, Jaljalat...)',
        'Les talismans et sceaux planétaires associés à chaque vers',
        'L\'asservissement des esprits terrestres et célestes au bien',
        'L\'acquisition de l\'autorité (Haybah) et du charisme spirituel'
      ],
      chapterBreakdown: [
        'Partie 1 : Les vers d\'ouverture et les Noms de Majesté',
        'Partie 2 : Les vers d\'invocation des 4 Éléments et de la victoire',
        'Partie 3 : Les talismans des 7 Sceaux Salomoniens de la Jaljalutiyah',
        'Partie 4 : Le commentaire d\'Al-Buni sur la Jaljalutiyah Grande et Petite'
      ],
      practicalEthics: 'Nécessite une initiation stricte, un jeûne rituel (Riyadah) et l\'abstention de toute intention négative.'
    },
    introEn: {
      summary: 'The pinnacle of esoteric spiritual poems in the Islamic tradition, consisting of verses containing Ancient Syriac and Arabic Divine Names.',
      historicalContext: 'Attributed to Imam Ali ibn Abi Talib and extensively commented upon by masters such as Al-Buni and Al-Ghazali.',
      esotericSignificance: 'Contains 60 sacred stanzas invoking Ism al-Azam to harmonize cosmic forces and grant divine protection.',
      keyThemes: [
        'Secrets of Ancient Syriac Divine Names (Jaljalat, Halhalat...)',
        'Planetary talismans and seals linked to each verse',
        'Commanding celestial and terrestrial harmony',
        'Bestowal of spiritual aura (Haybah) and reverence'
      ],
      chapterBreakdown: [
        'Part 1: Opening verses and Names of Divine Majesty',
        'Part 2: Verses of elemental harmony and victory',
        'Part 3: The 7 Solomonic Seals of Jaljalutiyah',
        'Part 4: Al-Buni\'s commentary on Greater and Lesser Jaljalutiyah'
      ],
      practicalEthics: 'Demands spiritual readiness, ritual purity, and noble intent.'
    },
    introHa: {
      summary: 'Mafi ɗaukakar waƙar sirri da ke ɗauke da Sunayen Allah na harshen Suryani da Larabci.',
      historicalContext: 'An danganta waƙar ga Imam Ali (KW) kuma malamai irin su Al-Buni da Al-Ghazali suka yi mata sharhi.',
      esotericSignificance: 'Tana ɗauke da baitu 60 da ke kiran Ism al-Azam domin samun tsaro da kwarjini.',
      keyThemes: [
        'Sirrin Sunayen Suryani (Jaljalat, Halhalat...)',
        'Khatim da Sassan kowace baitu',
        'Samun kwarjini da kariya ta musamman',
        'Bayanin Hatimai 7 na Annabi Sulaiman'
      ],
      chapterBreakdown: [
        'Babi na 1: Baitocin Buɗi da Sunayen Girma',
        'Babi na 2: Baitocin Kariyar Element 4',
        'Babi na 3: Hatimai 7 na Jaljalutiyyah',
        'Babi na 4: Sharhin Al-Buni kan Jaljalutiyyah'
      ],
      practicalEthics: 'Ana buƙatar tsarki da kauce wa amfani da ita wajen sharri.'
    },
    khatim: {
      titleAr: 'خاتم الجلجلوتية الخماسي العظيم',
      titleFr: 'Sceau 5x5 de la Jaljalutiyah & Ism al-Azam',
      titleEn: '5x5 Seal of Jaljalutiyah & Ism al-Azam',
      titleHa: 'Khatim 5x5 na Jaljalutiyyah',
      gridSize: 5,
      cells: [
        ['جلجلوت', 'هلحلت', 'اهطم', 'فشذ', 'جلـيل'],
        ['عظيم', 'قدوس', 'حي', 'قيوم', 'فتاح'],
        ['مقتدر', 'عزيز', 'الله', 'كبير', 'متعال'],
        ['قاهر', 'ظاهر', 'باطن', 'قريب', 'مجيب'],
        ['مهيمن', 'عليم', 'حكيم', 'خبير', 'نصير']
      ],
      arabicFormula: 'بدأت ببسم الله روحي به اهتدت إلى كشف أسرار بباطنه انطوت - الجلجلوتية.',
      descriptionFr: 'Carré 5x5 Jaljaluti pour la protection contre le mal occulte et la souveraineté spirituelle.',
      descriptionEn: '5x5 Sacred Square granting protection against esoteric attacks and conferring spiritual authority.',
      descriptionHa: 'Khatim 5x5 na Jaljalutiyyah domin samu daukaka da kariya.',
      abjadWeight: 2450,
      element: 'fire'
    }
  },
  {
    id: 'book_mujarrabat_dirby',
    titleAr: 'مجربات الديربي الكبير (فتح الملك المجيد)',
    titleFr: 'Mujarrabat al-Dirby al-Kabir (Le Grand Recueil de Dirby)',
    titleEn: 'Mujarrabat al-Dirby al-Kabir (Dirby\'s Tested Remedies)',
    titleHa: 'Mujarrabat al-Dirby al-Kabir (Nasarorin Dirby na Sirri)',
    authorAr: 'الشيخ أحمد الديربي الشافعي',
    authorFr: 'Ahmad al-Dirby',
    authorEn: 'Ahmad al-Dirby',
    authorHa: 'Ahmad al-Dirby',
    century: 'XVIIIᵉ Siècle',
    centuryFr: 'XVIIIe Siècle',
    centuryEn: '18th Century',
    centuryHa: 'Karni na 18',
    categoryFr: 'Formules Éprouvées & Awfaq Pratiques',
    categoryEn: 'Tested Remedies & Practical Awfaq',
    categoryHa: 'Sirrin Ayyuka da Khatimai',
    themeColor: 'from-indigo-800 via-purple-700 to-rose-900',
    bgGlow: '#4f46e5',
    icon3dType: 'mujarrabat_dirby',
    introFr: {
      summary: 'Le classique le plus populaire d\'Orient pour l\'application pratique des sourates coraniques, des carrés magiques (Awfaq) et des traitements spirituels éprouvés.',
      historicalContext: 'Rédigé au XVIIIe siècle par le savant égyptien Ahmad al-Dirby, cet ouvrage rassemble des siècles d\'expérimentations réussies en médecine spirituelle.',
      esotericSignificance: 'Propose des recettes théurgiques précises pour le déblocage des mariages, la protection des récoltes, l\'apaisement des dettes et la guerison du mauvais œil.',
      keyThemes: [
        'Utilisation des Sourates Yasin, Al-Waqi\'ah et Al-Mulk pour les besoins urgents',
        'Les carrés 3x3 et 4x4 vérifiés pour le commerce et la concorde',
        'Traitements du mauvais œil (Ayn) et du harcèlement des djinns (Mas)',
        'Formules d\'harmonie familiale et réconciliation'
      ],
      chapterBreakdown: [
        'Chapitre 1 : Les secrets éprouvés de la Sourate Al-Fatihah',
        'Chapitre 2 : Les bienfaits de l\'Ayat al-Kursi et son carré 3x3',
        'Chapitre 3 : Les opérations pour le déblocage des affaires financières',
        'Chapitre 4 : La médecine spirituelle et les talismans d\'eau',
        'Chapitre 5 : Les invocations d\'urgence et de facilitation'
      ],
      practicalEthics: 'Utiliser exclusivement pour des causes licites et bénéfiques.'
    },
    introEn: {
      summary: 'The most famous practical manual of Quranic spiritual remedies, verified squares (Awfaq), and holistic healing rituals in the Arab world.',
      historicalContext: 'Authored in 18th-century Egypt by Sheikh Ahmad al-Dirby, compiling centuries of tested spiritual practices.',
      esotericSignificance: 'Offers exact formulas for resolving debts, harmonizing marriages, healing evil eye, and protecting livelihoods.',
      keyThemes: [
        'Practical uses of Surahs Yasin, Al-Waqi\'ah, and Al-Mulk',
        'Verified 3x3 and 4x4 squares for business and harmony',
        'Treatments for evil eye (Ayn) and demonic afflictions',
        'Formulas for family unity and conflict resolution'
      ],
      chapterBreakdown: [
        'Chapter 1: Tested secrets of Surah Al-Fatihah',
        'Chapter 2: Virtues of Ayat al-Kursi and its 3x3 square',
        'Chapter 3: Operations for financial breakthroughs',
        'Chapter 4: Spiritual medicine and holy water talismans',
        'Chapter 5: Emergency prayers for rapid facilitation'
      ],
      practicalEthics: 'Strictly reserved for lawful, beneficial endeavors.'
    },
    introHa: {
      summary: 'Littafi ne mai shahara a wajen bayar da addu\'o\'in gwaji na Alqur\'ani, Khatim da magungunan matsatsun rayuwa.',
      historicalContext: 'Malam Ahmad al-Dirby na kasar Masar ya rubuta shi a karni na 18.',
      esotericSignificance: 'Yana bayar da hanyoyi tabbataccu na biya ma kai buƙata, biyan bashi, da samun jituwa a iyali.',
      keyThemes: [
        'Sirrin Surah Yasin, Al-Waqi\'ah da Al-Mulk',
        'Khatim 3x3 da 4x4 na kasuwanci da samu',
        'Maganin Kambun baka da shaidanu',
        'Ayyukan neman jituwa a zamantakewa'
      ],
      chapterBreakdown: [
        'Babi na 1: Sirrin Surah Al-Fatihah',
        'Babi na 2: Falalar Ayat al-Kursi da Khatim dinta',
        'Babi na 3: Hanyoyin Buɗe Samun Kudaye',
        'Babi na 4: Maganin Ruhani ta Ruwan Ayoyi',
        'Babi na 5: Addu\'o\'in Gaggawa'
      ],
      practicalEthics: 'Aywatar da shi kawai a hanyar da ta dace da Sharia.'
    },
    khatim: {
      titleAr: 'خاتم الديربي لقضاء الحوائج وتيسير الأرزاق',
      titleFr: 'Sceau 4x4 de Facilitation & Prospérité de Dirby',
      titleEn: '4x4 Seal of Facilitation & Prosperity of Dirby',
      titleHa: 'Khatim 4x4 na Dirby domin Biyan Buƙata',
      gridSize: 4,
      cells: [
        ['رزاق', 'فتاح', 'وهاب', 'غني'],
        ['كريم', 'معطي', 'واسع', 'بسط'],
        ['يسر', 'تيسير', 'نجاح', 'بركة'],
        ['لطيف', 'رؤوف', 'رحيم', 'ودود']
      ],
      arabicFormula: 'ففتحنا أبواب السماء بماء منهمر - مجربات الديربي الكبير.',
      descriptionFr: 'Carré 4x4 de déblocage rapide des moyens de subsistance et résolution des crises.',
      descriptionEn: '4x4 Square designed for rapid resolution of financial blockages and crises.',
      descriptionHa: 'Khatim 4x4 domin warware kowane irin kulle a sana\'a da arziki.',
      abjadWeight: 1540,
      element: 'earth'
    }
  },
  {
    id: 'book_dawah_harutiyyah',
    titleAr: 'الدعوة الهاروتية والحلول الروحانية',
    titleFr: 'Al-Da\'wah al-Harutiyyah (L\'Invocation de Harut et Marut)',
    titleEn: 'Al-Da\'wah al-Harutiyyah (The Harutian Invocation)',
    titleHa: 'Al-Da\'wah al-Harutiyyah (Kiran Harut da Marut na Kariya)',
    authorAr: 'مخطوط قديم مجهول النسب',
    authorFr: 'Auteur Anonyme',
    authorEn: 'Anonymous Author',
    authorHa: 'Marubuci da ba a sani ba',
    century: 'Manuscrit Ancien',
    centuryFr: 'Manuscrit Ancien',
    centuryEn: 'Ancient Manuscript',
    centuryHa: 'Tsohon Rubutun Hannu',
    categoryFr: 'Protections Célestes & Invocations',
    categoryEn: 'Celestial Seals & Counter-Magic',
    categoryHa: 'Kariya da Warware Sihiri',
    themeColor: 'from-red-900 via-rose-800 to-amber-900',
    bgGlow: '#dc2626',
    icon3dType: 'dawah_harutiyyah',
    introFr: {
      summary: 'Un manuscrit théurgique rare consacré à la neutralisation des illusions occultes et à l\'annulation des magies liées aux mystères de Babylone mentionnés dans le Coran (Harut et Marut).',
      historicalContext: 'Transmis à travers des codex d\'Afrique du Nord et du Levant, ce texte avertit solennellement contre la magie noire tout en fournissant l\'antidote sacré.',
      esotericSignificance: 'Dévoile les formules d\'invocation des anges gardiens et les sceaux de feu détruisant les pactes négatifs et les envoûtements anciens.',
      keyThemes: [
        'Explication du verset de Babylone (Sourate Al-Baqarah, v. 102)',
        'Les sceaux de protection angélique contre la séparation des couples',
        'L\'annulation définitive des talismans enfouis ou immergés',
        'Le désenvoûtement des demeures et des lieux hantés'
      ],
      chapterBreakdown: [
        'Partie 1 : L\'histoire et le mystère de Babylone',
        'Partie 2 : L\'antidote théurgique par la Da\'wah divine',
        'Partie 3 : Le grand carré de feu 3x3 d\'annulation du mal',
        'Partie 4 : Prières d\'immunisation perpétuelle'
      ],
      practicalEthics: 'Strictement réservé à la délivrance des victimes de magie et au bien universel.'
    },
    introEn: {
      summary: 'A rare ancient manuscript dedicated to neutralizing black magic and dissolving occult illusions linked to the Babylonian mysteries mentioned in the Quran.',
      historicalContext: 'Preserved through ancient North African and Levantine codices, warning against dark sorcery while providing the sacred antidote.',
      esotericSignificance: 'Reveals guardian angelic formulas and fiery seals that break dark pacts and ancient curses.',
      keyThemes: [
        'Exegesis of the Babylonian verse (Surah Al-Baqarah 102)',
        'Angelic protective seals preserving marriages',
        'Destruction of buried or submerged sorcery',
        'Cleansing haunted homes and places'
      ],
      chapterBreakdown: [
        'Part 1: The history and truth of Babylon',
        'Part 2: The divine antidote through sacred Da\'wah',
        'Part 3: The 3x3 Fire Square of purification',
        'Part 4: Perpetual shielding supplications'
      ],
      practicalEthics: 'Exclusively intended for unbinding victims of sorcery and doing good.'
    },
    introHa: {
      summary: 'Tsohon littafi mai matukar muhimmanci wanda ke koya hanyoyin karya sihiri da yaudara irin ta Babila.',
      historicalContext: 'An samo shi daga tsofaffin rubuce-rubucen Arewacin Afirka domin kariya daga sihiri.',
      esotericSignificance: 'Yana nuna addu\'o\'i da hatiman wuta da ke soke mugayen yarjejeniyoyi da sihiri.',
      keyThemes: [
        'Bayanin ayar Babila (Surah Al-Baqarah v. 102)',
        'Hatimin Mala\'iku domin kiyaye auren mutane',
        'Lalata sihiri da aka binne ko aka jefa a ruwa',
        'Tsarkake gida daga aljannu'
      ],
      chapterBreakdown: [
        'Babi na 1: Tarihi da Gaskiyar Babila',
        'Babi na 2: Maganinta ta hanyar Addu\'a',
        'Babi na 3: Khatim 3x3 na Wuta na Lalata Sihiri',
        'Babi na 4: Addu\'ar Kariya ta har Abada'
      ],
      practicalEthics: 'Kawaicayi amfani da shi domin taimakon wanda aka yima sihiri.'
    },
    khatim: {
      titleAr: 'خاتم الأبطال والحل الهاروتي',
      titleFr: 'Sceau 3x3 d\'Annulation des Magies & Harut',
      titleEn: '3x3 Seal of Counter-Magic & Harut',
      titleHa: 'Khatim 3x3 na Karya Sihiri da Kariya',
      gridSize: 3,
      cells: [
        ['جبرائيل', 'ميكائيل', 'إسرافيل'],
        ['عزرائيل', 'حجاب', 'نور'],
        ['قاهر', 'غالب', 'قوي']
      ],
      arabicFormula: 'ما جئتم به السحر إن الله سيبطله إن الله لا يصلح عمل المفسدين - الدعوة الهاروتية.',
      descriptionFr: 'Carré 3x3 de dissolution immédiate de tout sortilège et blocage occulte.',
      descriptionEn: '3x3 Sacred Square for immediate dissolution of spells and dark blockages.',
      descriptionHa: 'Khatim 3x3 domin karya kowace irin sihiri a take.',
      abjadWeight: 1310,
      element: 'fire'
    }
  },
  {
    id: 'book_durr_manthum',
    titleAr: 'الدر المنظوم في الأعمال الروحانية والزايرجة',
    titleFr: 'Ad-Durr al-Manthum (La Perle Disposée)',
    titleEn: 'Ad-Durr al-Manthum (The Strung Pearl)',
    titleHa: 'Ad-Durr al-Manthum (Duba da Ilimin Zairajah na Sirri)',
    authorAr: 'الشيخ الخناجي',
    authorFr: 'Al-Khnaji',
    authorEn: 'Al-Khnaji',
    authorHa: 'Al-Khnaji',
    century: 'XVIᵉ Siècle',
    centuryFr: 'XVIe Siècle',
    centuryEn: '16th Century',
    centuryHa: 'Karni na 16',
    categoryFr: 'Zairajah & Astrologie Théurgique',
    categoryEn: 'Zairajah & Planetary Science',
    categoryHa: 'Ilimin Zairajah da Taurari',
    themeColor: 'from-teal-700 via-emerald-600 to-cyan-900',
    bgGlow: '#0d9488',
    icon3dType: 'durr_manthum',
    introFr: {
      summary: 'L\'un des rares traités consacrés à la science de la Zairajah (les cercles divinatoires et astronomiques permettant de découvrir des réponses précises à travers les chiffres et lettres).',
      historicalContext: 'Rédigé au XVIe siècle par Al-Khnaji, ce texte fait la synthèse entre la science des nombres d\'Al-Buni et l\'astronomie d\'Ibn Shatir.',
      esotericSignificance: 'Explique la construction des tables divinatoires circulaires (Zairajah) et la méthode de résolution des équations numériques pour la prescience.',
      keyThemes: [
        'La construction des 12 cercles de la Zairajah',
        'L\'extraction des réponses mystiques à partir de la question et de l\'heure',
        'Correspondances entre les 7 planètes et les métaux',
        'Talismans d\'harmonie stellaire'
      ],
      chapterBreakdown: [
        'Chapitre 1 : Principes fondamentaux de la Zairajah',
        'Chapitre 2 : Les cercles des 28 lettres et 12 signes du Zodiaque',
        'Chapitre 3 : La méthode de calcul du Poids Spirituel',
        'Chapitre 4 : Exemples de réponses tirées des manuscrits anciens'
      ],
      practicalEthics: 'Exige des connaissances approfondies en calcul Abjad et astronomie.'
    },
    introEn: {
      summary: 'A rare treatise dedicated to the science of Zairajah—astronomical and numerical circles used to extract precise answers through letters and numbers.',
      historicalContext: 'Authored in the 16th century by Al-Khnaji, synthesizing Al-Buni\'s number science with classical astronomy.',
      esotericSignificance: 'Explains how to construct circular divinatory wheels and solve numerical equations for spiritual foresight.',
      keyThemes: [
        'Construction of the 12 Zairajah circles',
        'Extracting mystical answers from time and letters',
        'Correspondences of the 7 planets and metals',
        'Stellar harmony talismans'
      ],
      chapterBreakdown: [
        'Chapter 1: Core principles of Zairajah',
        'Chapter 2: Circles of 28 letters and 12 Zodiac signs',
        'Chapter 3: Spiritual Weight calculation methods',
        'Chapter 4: Historical examples of verified queries'
      ],
      practicalEthics: 'Requires deep proficiency in Abjad arithmetic and astronomy.'
    },
    introHa: {
      summary: 'Littafin sirri na ilimin Zairajah (Zane da da\'irar lissafi domin gano amsoshin tambayoyi da taurari).',
      historicalContext: 'Al-Khnaji ya rubuta shi a karni na 16 domin haɗa ilimin lambobi da na taurari.',
      esotericSignificance: 'Yana bayyana yadda ake zana da\'irori 12 na Zairajah domin sanin asirai.',
      keyThemes: [
        'Zana Da\'irori 12 na Zairajah',
        'Cire Amsoshin Tambaya ta Hanyar Haruffa da Lissafi',
        'Zaman Taurari 7 da Karfe',
        'Khatim na Taurari'
      ],
      chapterBreakdown: [
        'Babi na 1: Dokokin Ilimin Zairajah',
        'Babi na 2: Da\'irar Haruffa 28 da Buruj 12',
        'Babi na 3: Hanyar Lissafawa ta Abjad',
        'Babi na 4: Misalan Amsoshi daga Littattafan da'
      ],
      practicalEthics: 'Buƙatar zurfin ilimin lissafi da na taurari.'
    },
    khatim: {
      titleAr: 'خاتم الزايرجة والدرة المنظومة',
      titleFr: 'Sceau 4x4 de la Zairajah & Astrologie',
      titleEn: '4x4 Seal of Zairajah & Astrology',
      titleHa: 'Khatim 4x4 na Zairajah da Taurari',
      gridSize: 4,
      cells: [
        ['حكمة', 'علـم', 'حساب', 'فلك'],
        ['شمس', 'قمر', 'مشتري', 'زهرة'],
        ['زحل', 'عطارد', 'مريخ', 'برج'],
        ['نور', 'سر', 'كشف', 'بيان']
      ],
      arabicFormula: 'وكذلك نري إبراهيم ملكوت السماوات والأرض وليكون من الموقنين - الدر المنظوم.',
      descriptionFr: 'Carré 4x4 d\'alignement avec les 7 planètes et clarté intellectuelle.',
      descriptionEn: '4x4 Sacred Square for planetary alignment and mental clarity.',
      descriptionHa: 'Khatim 4x4 domin samun fahemicinta ilimi da hassasa.',
      abjadWeight: 1620,
      element: 'air'
    }
  },
  {
    id: 'book_ahzab_irfaniyyah',
    titleAr: 'الأحزاب العرفانية لمهندسي الطرق الصوفية',
    titleFr: 'Al-Ahzab al-Irfaniyyah (Litanies Gnostiques Soufies)',
    titleEn: 'Al-Ahzab al-Irfaniyyah (Gnostic Sufi Litanies)',
    titleHa: 'Al-Ahzab al-Irfaniyyah (Wiridodin Gnosis na Shaihunan Tassawuf)',
    authorAr: 'جامع أوراد النقشبندية والقادرية والشاذلية',
    authorFr: 'Recueils Naqshbandiyyah / Qadiriyyah / Shadhiliyyah',
    authorEn: 'Naqshbandi / Qadiri / Shadhili Compendiums',
    authorHa: 'Tattaran Naqshbandiyyah / Qadiriyyah',
    century: 'XIVᵉ-XIXᵉ Siècle',
    centuryFr: 'XIVe-XIXe Siècle',
    centuryEn: '14th-19th Century',
    centuryHa: 'Karni na 14-19',
    categoryFr: 'Gnose & Litanies des Maîtres',
    categoryEn: 'Gnosis & Masters\' Litanies',
    categoryHa: 'Hasken Tassawuf da Zikiri',
    themeColor: 'from-blue-800 via-indigo-700 to-amber-700',
    bgGlow: '#2563eb',
    icon3dType: 'ahzab_irfaniyyah',
    introFr: {
      summary: 'Compendium suprême réunissant les litanies ésotériques et secrets gnostiques des plus grands Maîtres des voies Naqshbandiyyah, Qadiriyyah, Rifa\'iyyah et Shadhiliyya.',
      historicalContext: 'Transmis de Maître à Disciple (Silsilah) sur plusieurs siècles, ce recueil garantit la préservation du dépôt sacré (Amanah).',
      esotericSignificance: 'Accélère l\'ascension de l\'âme (Suluk), éveille l\'amour divin (Mahabbah) et accorde la présence constante auprès de l\'Esprit saint.',
      keyThemes: [
        'Le Wird al-Khas et le Dhikr silencieux du Cœur (Khafi)',
        'Les invocations d\'extinction en Dieu (Fana) et de subsistance (Baqa)',
        'Les secrets d\'affilier son âme à la chaîne des Maîtres (Silsilah)',
        'Litanies de protection contre les pièges de l\'ego (Nafs)'
      ],
      chapterBreakdown: [
        'Partie 1 : Les litanies de la Voie Qadiriyyah de Sheikh Abdul Qadir Al-Jilani',
        'Partie 2 : Les secrets du Dhikr du Cœur Naqshbandi',
        'Partie 3 : Les prières d\'extinction Rifa\'ite',
        'Partie 4 : Le couronnement par le Salawat al-Mashishiyyah'
      ],
      practicalEthics: 'Requiert la guidance d\'un Maître spirituel accompli (Murshid).'
    },
    introEn: {
      summary: 'Supreme compendium gathering gnostic litanies and esoteric secrets of the founding Masters of Naqshbandi, Qadiri, Rifa\'i, and Shadhili paths.',
      historicalContext: 'Transmitted from Sheikh to Disciple (Silsilah) across centuries to preserve the holy spiritual trust (Amanah).',
      esotericSignificance: 'Accelerates the soul\'s journey (Suluk), kindles divine love (Mahabbah), and grants unbroken spiritual focus.',
      keyThemes: [
        'The Silent Heart Remembrance (Dhikr Khafi)',
        'Invocations of annihilation (Fana) and abiding in God (Baqa)',
        'Connecting to the unbroken chain of spiritual Masters (Silsilah)',
        'Shielding against the deceptions of the ego (Nafs)'
      ],
      chapterBreakdown: [
        'Part 1: Qadiri litanies of Sheikh Abdul Qadir Al-Jilani',
        'Part 2: Secrets of Naqshbandi Heart Dhikr',
        'Part 3: Rifa\'i prayers of spiritual longing',
        'Part 4: The crown litany: Salawat al-Mashishiyyah'
      ],
      practicalEthics: 'Requires guidance from a verified spiritual mentor (Murshid).'
    },
    introHa: {
      summary: 'Babban littafi da ke tattare da addu\'o\'in gnostic da asirarrun shaihunansu na dariku irin su Naqshbandiyyah, Qadiriyyah da Shadhiliyyah.',
      historicalContext: 'An samo shi ne ta hanyar Silsilah daga shehi zuwa al-murid na tsawon sekoli.',
      esotericSignificance: 'Yana hanzarta tafiyar ruhin mutum zuwa ga Allah da sa soyayyar Ubangiji a zuciya.',
      keyThemes: [
        'Zikiri na Zuciya na Sirri (Dhikr Khafi)',
        'Addu\'o\'in Samun Fana da Baqa',
        'Sada Ruhi da Silsilar Waliyyai',
        'Kariya daga yaudaran Nafsi'
      ],
      chapterBreakdown: [
        'Babi na 1: Wiridin Qadiriyyah na Sheikh Abdul Qadir Al-Jilani',
        'Babi na 2: Sirrin Zikirin Zuciya na Naqshbandi',
        'Babi na 3: Addu\'o\'in Rifa\'iyyah',
        'Babi na 4: Salatin Mashishiyyah'
      ],
      practicalEthics: 'Ana neman jagorancin Shehi malami.'
    },
    khatim: {
      titleAr: 'خاتم السلسلة والولاية العرفانية',
      titleFr: 'Sceau 3x3 de la Silsilah & Gnose Soufie',
      titleEn: '3x3 Seal of Silsilah & Sufi Gnosis',
      titleHa: 'Khatim 3x3 na Darika da Gnosis',
      gridSize: 3,
      cells: [
        ['ولي', 'مرشد', 'مربـي'],
        ['محبة', 'فناء', 'بقاء'],
        ['نور', 'حقيقة', 'معرفة']
      ],
      arabicFormula: 'ألا إن أولياء الله لا خوف عليهم ولا هم يحزنون - الأحزاب العرفانية.',
      descriptionFr: 'Carré 3x3 d\'élévation spirituelle et de raccordement à la chaîne des Saints.',
      descriptionEn: '3x3 Sacred Square for spiritual elevation and connection to the Saints.',
      descriptionHa: 'Khatim 3x3 domin samun daukaka a addini da kusanci ga Allah.',
      abjadWeight: 1296,
      element: 'water'
    }
  }
];
