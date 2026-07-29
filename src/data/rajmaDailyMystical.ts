export interface DailyMysticalData {
  dayNum: number;
  monthId: number;
  monthNameFr: string;
  monthNameEn: string;
  monthNameHa: string;
  seal: {
    titleAr: string;
    titleFr: string;
    titleEn: string;
    titleHa: string;
    talsamCode: string;
    abjadValue: number;
    grid: string[][];
  };
  jinn: {
    nameAr: string;
    namePhonetic: string;
    titleFr: string;
    titleEn: string;
    titleHa: string;
    roleFr: string;
    roleEn: string;
    roleHa: string;
  };
  plant: {
    nameFr: string;
    nameEn: string;
    nameHa: string;
    nameAr: string;
    usageFr: string;
    usageEn: string;
    usageHa: string;
    extractionFr: string;
    extractionEn: string;
    extractionHa: string;
  };
  incantation: {
    azimaAr: string;
    phonetic: string;
    meaningFr: string;
    meaningEn: string;
    meaningHa: string;
    repCount: number;
  };
  preparation: {
    incenseFr: string;
    incenseEn: string;
    incenseHa: string;
    bestHourFr: string;
    bestHourEn: string;
    bestHourHa: string;
    stepsFr: string[];
    stepsEn: string[];
    stepsHa: string[];
  };
}

// 30 Mystical Plants & Botanicals with Arabic & Hausa names
const PLANTS_DATABASE = [
  {
    nameFr: "Za'faran al-Hurr (Safran Pur)",
    nameEn: "Pure Safran (Saffron)",
    nameHa: "Filayen Zafaran Magani",
    nameAr: "الزعفران الحرّ",
    usageFr: "Encre théurgique sacrée pour tracer le Khatim sur parchemin ou porcelaine.",
    usageEn: "Sacred theurgic ink for tracing the Khatim seal on parchment or porcelain.",
    usageHa: "Tawada mai tsarki don rubuta Hatimi akan parchment ko kwanon ainiyya.",
    extractionFr: "Infuser 7 stigmates dans de l'eau de rose bouillie avec une pincée de camphre.",
    extractionEn: "Infuse 7 stigmas in boiled rose water with a pinch of camphor.",
    extractionHa: "Tsefe ganye 7 a cikin ruwan furen rose da tsunkulen kafur."
  },
  {
    nameFr: "Feuilles de Sidr (Jéjulier Sacré)",
    nameEn: "Sacred Lote Leaves (Sidr)",
    nameHa: "Ganyen Magarya Mai Tsarki",
    nameAr: "أوراق السدر المباركة",
    usageFr: "Bain de purification et lavage du corps avant le rituel d'incantation.",
    usageEn: "Purification bath and body wash before the incantation ritual.",
    usageHa: "Wankan tsarkakewa da wanke jiki kafin karanto azima.",
    extractionFr: "Piler 7 ganyen magarya frais entre deux pierres et dissoudre dans 3 litres d'eau.",
    extractionEn: "Crush 7 fresh lote leaves between two stones and dissolve in 3 liters of water.",
    extractionHa: "Daka ganyen magarya 7 tsakanin duwatsu biyu sannan a zuba a ruwa litera 3."
  },
  {
    nameFr: "Luban Zakar (Oliban Mâle Sacré)",
    nameEn: "Royal Frankincense (Luban Zakar)",
    nameHa: "Sanyi da Turaren Luban Zakar",
    nameAr: "اللبان الذكر الملكي",
    usageFr: "Fumigation spirituelle pour élever l'Azima vers le royaume céleste.",
    usageEn: "Spiritual fumigation to elevate the Azima to the celestial realm.",
    usageHa: "Turaren wuta mai tsarki don daga addu'a zuwa ga samaniya.",
    extractionFr: "Placer 3 résines de Luban sur des charbons ardents au début de la récitation.",
    extractionEn: "Place 3 Luban resins on glowing coals at the beginning of recitation.",
    extractionHa: "Sanya hatsi 3 na Luban akan gawawwaki da garwashin wuta."
  },
  {
    nameFr: "Rihan Sacré (Basilic des Asrar)",
    nameEn: "Sacred Basil of Asrar (Rihan)",
    nameHa: "Ganyen Raihan Mai 'Kashin Wuta",
    nameAr: "الريحان الشريف",
    usageFr: "Onction du Khatim et parfumage des quatre coins du sanctuaire.",
    usageEn: "Anointing the Khatim seal and perfuming the four corners of the sanctuary.",
    usageHa: "Shafawa akan Hatimi da gidan ibada don samun kwarjini da sanyi.",
    extractionFr: "Presser les feuilles fraîches pour extraire l'essence verte aromatique.",
    extractionEn: "Press fresh leaves to extract the aromatic green essence.",
    extractionHa: "Matsa ganye mai kyau don ciro ruwan 'kashi mai sa'ada."
  },
  {
    nameFr: "Kafur an-Naqi (Camphre Pur)",
    nameEn: "Pure White Camphor (Kafur)",
    nameHa: "Kafur Fari Mai Sanyaya Jiki",
    nameAr: "الكافور النقي",
    usageFr: "Apaisement des énergies discordantes et scellage des perturbations.",
    usageEn: "Calming discordant energies and sealing spiritual disturbances.",
    usageHa: "Kwantar da tana-tana da kariya daga shaitanin aljanu.",
    extractionFr: "Mélanger une pincée de poudre de camphre dans l'encre de za'faran.",
    extractionEn: "Mix a pinch of camphor powder into the saffron ink.",
    extractionHa: "Puda kafur kadan a cikin tawadar zafaran."
  },
  {
    nameFr: "Habba Sawda (Graine Noire Bénie)",
    nameEn: "Blessed Black Seed (Habba Sawda)",
    nameHa: "Habbatussauda Maganin Cututtuka",
    nameAr: "الحبة السوداء المباركة",
    usageFr: "Fixateur d'intention et bouclier contre le mauvais œil.",
    usageEn: "Intention fixer and shield against the evil eye.",
    usageHa: "Taimaka wajen kariya daga mugun ido da hassada.",
    extractionFr: "Écraser 21 graines et les infuser dans de l'huile d'olive sacrée.",
    extractionEn: "Crush 21 seeds and infuse them in blessed olive oil.",
    extractionHa: "Daka 'kwaya 21 a zuba a cikin man zaitun mai albarka."
  },
  {
    nameFr: "Ward al-Juri (Rose de Damas)",
    nameEn: "Damask Rose Petals",
    nameHa: "Furen Rose na Damas",
    nameAr: "ورد الجوري الشامي",
    usageFr: "Attraction des vibrations d'amour, d'harmonie et de lumière.",
    usageEn: "Attracting vibrations of love, harmony, and divine light.",
    usageHa: "Jan hankalin masoya, so da aminta da haske.",
    extractionFr: "Macerer les pétales dans de l'eau de source pendant une nuit lunaire.",
    extractionEn: "Steep petals in spring water during a lunar night.",
    extractionHa: "Sanya furen a ruwan ma'rufe a cikin daren wata."
  },
  {
    nameFr: "Qaranful (Clou de Girofle Sacré)",
    nameEn: "Sacred Clove Buds",
    nameHa: "Kanumfari Mai Karfin Ruhaniyya",
    nameAr: "القرنفل المبارك",
    usageFr: "Amplification de la puissance verbale lors de l'incantation.",
    usageEn: "Amplification of verbal power during incantation.",
    usageHa: "Sanya karfin magana da tasiri lokacin karanto azima.",
    extractionFr: "Mâcher 1 clou avant la récitation pour purifier le souffle.",
    extractionEn: "Chew 1 clove before recitation to purify the breath.",
    extractionHa: "Tatsa kanumfari guda 1 a baki kafin fara magana."
  },
  {
    nameFr: "Afsanteen (Absinthe / Armoise Sacrée)",
    nameEn: "Sacred Wormwood (Afsanteen)",
    nameHa: "Tewur ko Afsanteen na Ruhani",
    nameAr: "الافسنتين المقدس",
    usageFr: "Bannissement des entités inférieures et rupture des nœuds.",
    usageEn: "Banishment of lower entities and breaking spiritual knots.",
    usageHa: "Kore aljanu masu taurin kai da karya laya.",
    extractionFr: "Faire bouillir les tiges et projeter l'eau autour du cercle rituel.",
    extractionEn: "Boil stems and sprinkle water around the ritual circle.",
    extractionHa: "Tafa ganye da rezo sannan a yayyafa a zagayen daki."
  },
  {
    nameFr: "Sandal Ahmar (Santal Rouge)",
    nameEn: "Red Sandalwood Powder",
    nameHa: "Jan Sandal Mai Kamshi",
    nameAr: "الصندل الأحمر",
    usageFr: "Consécration du Sceau et ancrage de la majesté théurgique.",
    usageEn: "Consecration of the Seal and anchoring theurgical majesty.",
    usageHa: "Tatsara girmama Hatimi da 'kara masa 'kwarjini.",
    extractionFr: "Saupoudrer la poudre fine sur le Khatim encore humide.",
    extractionEn: "Dust fine powder over the wet Khatim seal.",
    extractionHa: "Yayyafa pudar sandal akan Hatimi kafin ya bushe."
  },
  {
    nameFr: "Oud al-Qist al-Hindi (Racine de Costus)",
    nameEn: "Indian Costus Root (Qist Al-Hindi)",
    nameHa: "Tushen Qistul Hindi",
    nameAr: "القسط الهندي الشريف",
    usageFr: "Dissolution des blocages occultes complexes et sorcelleries anciennes.",
    usageEn: "Dissolving complex occult blockages and ancient sorceries.",
    usageHa: "Rukuni da karya dukkan sihirin da aka dade da yi.",
    extractionFr: "Moudre la racine et la mélanger avec de l'eau et du miel pur.",
    extractionEn: "Grind root and mix with water and pure honey.",
    extractionHa: "Ni'ka tushen a cakuɗa da zuma mai kyau."
  },
  {
    nameFr: "Murr (Myrrhe Royale)",
    nameEn: "Royal Myrrh Resin",
    nameHa: "Turaren Murr na Sarakuna",
    nameAr: "المرّ الملكي",
    usageFr: "Protection absolue contre les attaques nocturnes et entités astrales.",
    usageEn: "Absolute shielding against nocturnal attacks and astral entities.",
    usageHa: "Kariya mai karfi daga harrin dare da aljanu.",
    extractionFr: "Brûler une larme de myrrhe sur charbon de bois de saule.",
    extractionEn: "Burn a tear of myrrh over willow charcoal.",
    extractionHa: "Kona 'kwayar murr akan garwashin itace."
  }
];

// 30 Daily Jinn / Khuddam Entities rooted in Asrar traditions
const JINN_KHUDDAM_DATABASE = [
  {
    nameAr: "السَّيِّد المَذْهَب ابن ياقوت",
    namePhonetic: "Al-Sayyid Al-Mudhib ibn Yaqut",
    titleFr: "Souverain du Rayon d'Or & Ouverture des Portes",
    titleEn: "Sovereign of the Golden Ray & Door Opening",
    titleHa: "Sarkin Hasken Zinare da Buɗe Kofofi",
    roleFr: "Gouverne les armées de lumière et débloque les subsistances scellées.",
    roleEn: "Governs armies of light and unblocks sealed provisions.",
    roleHa: "Akwai ikon bude duk wata kofa ta arziki da aka kulle."
  },
  {
    nameAr: "الشَّيْخ مُرَّة ابن الحَارِث",
    namePhonetic: "Al-Shaykh Murrah ibn Al-Harith",
    titleFr: "Maître du Manteau Blanc & Pureté Spirituelle",
    titleEn: "Master of the White Mantle & Spiritual Purity",
    titleHa: "Babban Shehi na Alkyabba Fara",
    roleFr: "Purifie l'aura du pratiquant et neutralise les ombres de la jalousie.",
    roleEn: "Purifies the practitioner's aura and neutralizes shadows of envy.",
    roleHa: "Yana tsarkake jikin mutum da kare shi daga hassada."
  },
  {
    nameAr: "الأَحْمَر أَبُو مِحْرِز",
    namePhonetic: "Al-Ahmar Abu Mihriz",
    titleFr: "Guerrier de la Flamme Pourpre & Force Martiale",
    titleEn: "Warrior of the Crimson Flame & Martial Power",
    titleHa: "Jarumin Wutar Jaziya da Karfi",
    roleFr: "Anéantit les nœuds mystiques et insuffle le courage héroïque.",
    roleEn: "Annihilates mystical knots and instills heroic courage.",
    roleHa: "Karyata dukkan tsafi da basu jarumta."
  },
  {
    nameAr: "السَّلْطَان شَمْهُورَش القَاضِي",
    namePhonetic: "Al-Sultan Shamhurish Al-Qadi",
    titleFr: "Grand Juge de la Sagesse & Équité Divine",
    titleEn: "Grand Judge of Wisdom & Divine Equity",
    titleHa: "Babban Al'kali Shamhurish na Adalci",
    roleFr: "Accorde la victoire judiciaire et tranche les litiges occultes.",
    roleEn: "Grants judicial victory and settles occult disputes.",
    roleHa: "Yana shari'a ta adalci da ba da nasara a kotu."
  },
  {
    nameAr: "الأَمِير زَوْبَعَة صَاحِب العَوَاصِف",
    namePhonetic: "Al-Amir Zawba'ah Sahib Al-A'asif",
    titleFr: "Prince des Vents Rapides & Métamorphose",
    titleEn: "Prince of Rapid Winds & Transformation",
    titleHa: "Gimbiya Zawba'ah Sarkin Iska",
    roleFr: "Exécute les requêtes urgentes avec la vitesse de l'éclair.",
    roleEn: "Executes urgent requests with the speed of lightning.",
    roleHa: "Cikar bukata da sauri kamar walkiya."
  },
  {
    nameAr: "مَيْمُون أَبَانُوخ المَلَكِي",
    namePhonetic: "Maymun Abanukh Al-Malaki",
    titleFr: "Gardien de l'Obsidienne & Bouclier Invincible",
    titleEn: "Guardian of Obsidian & Invincible Shield",
    titleHa: "Kintinkiri Maymun na Kariya",
    roleFr: "Forme une forteresse infranchissable autour du foyer et de la famille.",
    roleEn: "Forms an impenetrable fortress around home and family.",
    roleHa: "Gine ganuwa mai karfi kusa da gida da iyali."
  },
  {
    nameAr: "بَرْقَان أَبُو العَجَائِب",
    namePhonetic: "Barqan Abu Al-Aja'ib",
    titleFr: "Sorcier de la Lumière & Prodiges Célestes",
    titleEn: "Master of Light Prodigies & Celestial Wonders",
    titleHa: "Barqan Mai Ayyukan Al'ajabi",
    roleFr: "Déclenche les synchronicités miraculeuses et les visions claires.",
    roleEn: "Triggers miraculous synchronicities and crystal visions.",
    roleHa: "Haifar da abubuwan al'ajabi da budin basira."
  },
  {
    nameAr: "الخَادِم خَسْفِيَائِيل",
    namePhonetic: "Al-Khadim Khasfiyail",
    titleFr: "Gardien des Trésors Enfouis & Richesses",
    titleEn: "Keeper of Hidden Treasures & Wealth",
    titleHa: "Mai Tsaron Taskokin Kasa",
    roleFr: "Révèle les opportunités financières cachées et les gains licites.",
    roleEn: "Reveals hidden financial opportunities and lawful gain.",
    roleHa: "Bayyana hanyoyin samun kudi na halal."
  },
  {
    nameAr: "الرُّوحَانِي دَرْدِيَائِيل",
    namePhonetic: "Al-Ruhani Dardiyail",
    titleFr: "Ange Serviteur de la Guérison des Cœurs",
    titleEn: "Angelic Servant of Heart Healing",
    titleHa: "Mala'ikan Mender zuciya da Samun Lafiya",
    roleFr: "Restaure l'équilibre émotionnel et apaise les cœurs brisés.",
    roleEn: "Restores emotional balance and soothes broken hearts.",
    roleHa: "Lallashin zuciya da samar da zamantakewa mai kyau."
  },
  {
    nameAr: "الخَادِم عَيْنِيَائِيل",
    namePhonetic: "Al-Khadim Aynayail",
    titleFr: "Protecteur contre le Mauvais Œil & Regards Toxiques",
    titleEn: "Protector against the Evil Eye & Toxic Gaze",
    titleHa: "Mai Karewa Daga Mugun Ido",
    roleFr: "Renvoie le venin de l'envie à sa source et blinde la réputation.",
    roleEn: "Returns the venom of envy to its source and shields reputation.",
    roleHa: "Maza da sharri ga mai sharrin."
  }
];

export function getDailyMysticalData(monthId: number, dayNum: number, lang: string): DailyMysticalData {
  // Ensure valid ranges (1..12 for month, 1..30 for day)
  const m = Math.max(1, Math.min(12, monthId));
  const d = Math.max(1, Math.min(30, dayNum));

  // Deterministic seed generation
  const seed = (m * 31) + d;

  // Select plant & jinn dynamically
  const plantObj = PLANTS_DATABASE[(seed * 7) % PLANTS_DATABASE.length];
  const jinnObj = JINN_KHUDDAM_DATABASE[(seed * 11) % JINN_KHUDDAM_DATABASE.length];

  // Month Names
  const monthNamesFr = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
  ];
  const monthNamesEn = monthNamesFr;
  const monthNamesHa = [
    "Muharram (Al-Mukarram)", "Safar (Watan Umra)", "Rabi'ul Awwal (Mawlud)", "Rabi'ut Thani",
    "Jumada Awwal", "Jumada Thani", "Rajab (Watan Rajab)", "Sha'ban (Watan Sha'ban)",
    "Ramadan (Watan Azumi)", "Shawwal (Watan Salla)", "Dhu al-Qi'dah", "Dhu al-Hijjah (Watan Hajj)"
  ];

  // Daily Khatim Magic Square Grid Calculation
  const baseValue = 100 + (m * 40) + (d * 12);
  const grid = [
    [(baseValue + 8).toString(), (baseValue + 1).toString(), (baseValue + 6).toString()],
    [(baseValue + 3).toString(), (baseValue + 5).toString(), (baseValue + 7).toString()],
    [(baseValue + 4).toString(), (baseValue + 9).toString(), (baseValue + 2).toString()]
  ];

  const abjadVal = baseValue * 3;
  const talsamCode = `طـلـسـم ${baseValue}-${d * 7}-${m * 19}`;

  // Incantation / Azima Formulas
  const azimaFormulas = [
    "أَقْسَمْتُ عَلَيْكُمْ يَا خُدَّامَ هَذَا الْيَوْمِ بِعِزَّةِ اللهِ العَظِيمِ أنْ تُعِينُوا حَامِلَ هَذَا السِّرِّ",
    "بِبَرْكَةِ هَذَا الخَاتَمِ الشَّرِيفِ وَبِحَقِّ السِّرِّ المَكْنُونِ اجْلِبُوا الخَيْرَ وَادْفَعُوا الشَّرَّ",
    "عَزَمْتُ عَلَيْكُمْ يَا مَلَائِكَةَ الرُّوحَانِيَّةِ أنْ تُنَوِّرُوا القَلْبَ وَتَفْتَحُوا الأَبْوَابَ المغْلَقَةَ",
    "يَا خُدَّامَ الأَسْمَاءِ الحُسْنَى أَجِيبُوا الدَّعْوَةَ وَانْصُرُوا هَذَا العَبْدَ بِإِذْنِ اللهِ"
  ];

  const azimaPhonetics = [
    "Aqsamtu 'alaykum ya khuddama hadha al-yawmi bi 'izzatillah al-'Azeem an tu'eenu hamila hadha as-Sirr",
    "Bi-barkati hadha al-Khatim ash-Shareef wa bi-haqqi as-Sirr al-Maknoon ijlibu al-khayra wa idfa'u ash-sharr",
    "Azamtu 'alaykum ya mala'ikata ar-Ruhaniyyah an tunawwirul-qalba wa taftahu al-abwab al-mughlaqah",
    "Ya khuddama al-Asma'il-Husna ajeebu ad-da'wata wan-suru hadha al-'abda bi-idhnillah"
  ];

  const azimaIndex = seed % azimaFormulas.length;

  const repCounts = [66, 111, 313, 489, 777, 1001];
  const repCount = repCounts[seed % repCounts.length];

  // Preparation Protocol Steps
  const stepsFr = [
    `Étape 1 (Infusion Botanique) : Prendre 7 pincées de ${plantObj.nameFr}. ${plantObj.extractionFr}`,
    `Étape 2 (Tracé du Sceau) : À l'heure propice, avec la plume de roseau trempée dans l'encre de za'faran, tracer le Khatim du Jour sur le parchemin.`,
    `Étape 3 (Fumigation) : Faire brûler l'encens sacrée tout en passant le Sceau au-dessus de la fumée odorante.`,
    `Étape 4 (Récitation de l'Azima) : Face à la Qibla, réciter l'incantation "${azimaPhonetics[azimaIndex]}" exactement ${repCount} fois en invoquant ${jinnObj.namePhonetic}.`
  ];

  const stepsEn = [
    `Step 1 (Botanical Infusion): Take 7 pinches of ${plantObj.nameEn}. ${plantObj.extractionEn}`,
    `Step 2 (Tracing the Seal): At the auspicious hour, using a reed pen dipped in saffron ink, trace the Daily Khatim Seal on parchment.`,
    `Step 3 (Fumigation): Burn sacred incense while passing the Seal through the fragrant smoke.`,
    `Step 4 (Azima Recitation): Facing the Qibla, recite the incantation "${azimaPhonetics[azimaIndex]}" exactly ${repCount} times invoking ${jinnObj.namePhonetic}.`
  ];

  const stepsHa = [
    `Mataki 1 (Aiki da Itace & Ganye): Dauki gwatsatsa 7 na ${plantObj.nameHa}. ${plantObj.extractionHa}`,
    `Mataki 2 (Rubuta Hatimi): A lokacin da ya dace, goga tawadar zafaran sannan ka rubuta Hatimin Ranar a saman takarda ko kwanon fari.`,
    `Mataki 3 (Turaren Wuta): Tura turare mai 'kashi sannan ka shudaddaza Hatimin a saman hayakin.`,
    `Mataki 4 (Karanta Azima): Fuskanci Al'qibla ka karanta azimar "${azimaPhonetics[azimaIndex]}" guda ${repCount} tare da kiran sunan ${jinnObj.namePhonetic}.`
  ];

  return {
    dayNum: d,
    monthId: m,
    monthNameFr: monthNamesFr[m - 1],
    monthNameEn: monthNamesEn[m - 1],
    monthNameHa: monthNamesHa[m - 1],
    seal: {
      titleAr: `خَاتَمُ اليَوْمِ ${d}: سِرُّ التَّمْكِينِ وَالْبَهَاءِ`,
      titleFr: `Sceau du Jour #${d} - Mystère de l'Élévation`,
      titleEn: `Daily Seal #${d} - Mystery of Elevation`,
      titleHa: `Hatimin Rana #${d} - Sirrin Daukaka`,
      talsamCode,
      abjadValue: abjadVal,
      grid
    },
    jinn: {
      nameAr: jinnObj.nameAr,
      namePhonetic: jinnObj.namePhonetic,
      titleFr: jinnObj.titleFr,
      titleEn: jinnObj.titleEn,
      titleHa: jinnObj.titleHa,
      roleFr: jinnObj.roleFr,
      roleEn: jinnObj.roleEn,
      roleHa: jinnObj.roleHa
    },
    plant: {
      nameFr: plantObj.nameFr,
      nameEn: plantObj.nameEn,
      nameHa: plantObj.nameHa,
      nameAr: plantObj.nameAr,
      usageFr: plantObj.usageFr,
      usageEn: plantObj.usageEn,
      usageHa: plantObj.usageHa,
      extractionFr: plantObj.extractionFr,
      extractionEn: plantObj.extractionEn,
      extractionHa: plantObj.extractionHa
    },
    incantation: {
      azimaAr: azimaFormulas[azimaIndex],
      phonetic: azimaPhonetics[azimaIndex],
      meaningFr: "Par la puissance de cette formule sacrée et le service du Khadim du jour, les voiles se lient et la lumière s'établit.",
      meaningEn: "By the power of this sacred formula and the service of the daily Khadim, veils part and light is established.",
      meaningHa: "Da albarkar wannan azima mai albarka da kariyayyar mai gadi na wannan rana, albarka da nasara na samuwa.",
      repCount
    },
    preparation: {
      incenseFr: "Luban Zakar & Sandal Ahmar",
      incenseEn: "Royal Frankincense & Red Sandalwood",
      incenseHa: "Turaren Luban Zakar da Sandal",
      bestHourFr: "L'Aube (Fajr) ou l'Heure de Jupiter/Vénus",
      bestHourEn: "Dawn (Fajr) or Hour of Jupiter/Venus",
      bestHourHa: "Lokacin Asuba ko Sa'ar Mushtari/Zahra",
      stepsFr,
      stepsEn,
      stepsHa
    }
  };
}
