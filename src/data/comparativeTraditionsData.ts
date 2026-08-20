// Comparative Traditions & Advanced Astroscience Data and Calculation Engine
// nakshatras, dashas, zodiac comparison, chinese astrology, feng shui kua, ba gua, tasyir, synastry, subtle centers, sacred plants

export interface NakshatraItem {
  id: number;
  name: string;
  sanskrit: string;
  transliteration: string;
  ruler: string; // Vedic Planet
  deity: string;
  symbol: string;
  degrees: string;
  spanStartDeg: number;
  spanEndDeg: number;
  zodiacSign: string;
  gana: 'Deva' | 'Manushya' | 'Rakshasa';
  element: 'Feu' | 'Terre' | 'Air' | 'Eau' | 'Éther';
  arabicManzilNumber: number;
  arabicManzilName: string;
  qualitiesFr: string;
  qualitiesEn: string;
  qualitiesHa: string;
  bijaMantra: string;
}

export interface PlantItem {
  id: string;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  botanicalName: string;
  arabicName: string;
  planetaryRuler: string;
  element: string;
  type: 'Resin' | 'Herb' | 'Wood' | 'Flower' | 'Seed' | 'Root';
  historicalSources: string;
  symbolicVirtuesFr: string;
  symbolicVirtuesEn: string;
  symbolicVirtuesHa: string;
  traditionalUsesFr: string;
  traditionalUsesEn: string;
  traditionalUsesHa: string;
}

export interface SubtleCenterItem {
  id: number;
  level: number;
  // Chakra (Hindu)
  chakraName: string;
  chakraSanskrit: string;
  chakraLocationFr: string;
  chakraLocationEn: string;
  chakraLocationHa: string;
  chakraElementFr: string;
  chakraElementEn: string;
  chakraElementHa: string;
  chakraColor: string;
  chakraColorHex: string;
  chakraPetals: number;
  chakraBija: string;
  chakraSignificanceFr: string;
  chakraSignificanceEn: string;
  chakraSignificanceHa: string;
  // Latifa (Sufi Lataif-e-Sitta)
  latifaName: string;
  latifaArabic: string;
  latifaLocationFr: string;
  latifaLocationEn: string;
  latifaLocationHa: string;
  latifaProphetFr: string;
  latifaProphetEn: string;
  latifaProphetHa: string;
  latifaColor: string;
  latifaColorHex: string;
  latifaDhikr: string;
  latifaSignificanceFr: string;
  latifaSignificanceEn: string;
  latifaSignificanceHa: string;
}

// 27 Nakshatras of Vedic Astrology
export const NAKSHATRAS_LIST: NakshatraItem[] = [
  {
    id: 1,
    name: 'Ashwini',
    sanskrit: 'अश्विनी',
    transliteration: 'Aśvinī',
    ruler: 'Ketu',
    deity: 'Ashvins (Médecins divins)',
    symbol: 'Tête de cheval',
    degrees: '0°00 - 13°20 Bélier (Mesha)',
    spanStartDeg: 0,
    spanEndDeg: 13.333,
    zodiacSign: 'Bélier (Mesha)',
    gana: 'Deva',
    element: 'Terre',
    arabicManzilNumber: 1,
    arabicManzilName: 'Al-Sharatain (الشرطين)',
    qualitiesFr: 'Rapidité, guérison, nouveau départ, énergie vitale et courage héroïque.',
    qualitiesEn: 'Speed, healing, new beginnings, vital energy, and heroic courage.',
    qualitiesHa: 'Gaggawa, warkarwa, sabon mafari, kuzari da jajircewa.',
    bijaMantra: 'Om Ashwibhyam Namah'
  },
  {
    id: 2,
    name: 'Bharani',
    sanskrit: 'भरणी',
    transliteration: 'Bharaṇī',
    ruler: 'Venus (Shukra)',
    deity: 'Yama (Seigneur du Dharma & Passage)',
    symbol: 'Yoni (Ventre créateur)',
    degrees: '13°20 - 26°40 Bélier (Mesha)',
    spanStartDeg: 13.333,
    spanEndDeg: 26.666,
    zodiacSign: 'Bélier (Mesha)',
    gana: 'Manushya',
    element: 'Terre',
    arabicManzilNumber: 2,
    arabicManzilName: 'Al-Butain (البطين)',
    qualitiesFr: 'Transformation, gestation, purification par l\'épreuve, devoir sacré.',
    qualitiesEn: 'Transformation, gestation, purification through trials, sacred duty.',
    qualitiesHa: 'Sauyi, ɗaukar ciki, tsarkakewa ta hanyar gwaji da nauyi.',
    bijaMantra: 'Om Yamaya Namah'
  },
  {
    id: 3,
    name: 'Krittika',
    sanskrit: 'कृत्तिका',
    transliteration: 'Kṛttikā',
    ruler: 'Sun (Surya)',
    deity: 'Agni (Feu sacré)',
    symbol: 'Lame tranchante / Flamme',
    degrees: '26°40 Bélier - 10°00 Taureau',
    spanStartDeg: 26.666,
    spanEndDeg: 40.0,
    zodiacSign: 'Bélier / Taureau',
    gana: 'Rakshasa',
    element: 'Feu',
    arabicManzilNumber: 3,
    arabicManzilName: 'Al-Thurayya / Pléiades (الثريا)',
    qualitiesFr: 'Discernement tranchant, purification ignée, courage protecteur.',
    qualitiesEn: 'Sharp discernment, fiery purification, protective courage.',
    qualitiesHa: 'Kaifin hankali, tsarkake wuta, kariya da haske.',
    bijaMantra: 'Om Agnaye Namah'
  },
  {
    id: 4,
    name: 'Rohini',
    sanskrit: 'रोहिणी',
    transliteration: 'Rohiṇī',
    ruler: 'Moon (Chandra)',
    deity: 'Brahma / Prajapati (Créateur)',
    symbol: 'Chariot / Temple fleuri',
    degrees: '10°00 - 23°20 Taureau (Vrishabha)',
    spanStartDeg: 40.0,
    spanEndDeg: 53.333,
    zodiacSign: 'Taureau (Vrishabha)',
    gana: 'Manushya',
    element: 'Terre',
    arabicManzilNumber: 4,
    arabicManzilName: 'Al-Dabaran (الدبران)',
    qualitiesFr: 'Fécondité, beauté sensorielle, abondance matérielle et dévotion artistique.',
    qualitiesEn: 'Fertility, sensory beauty, material abundance, and artistic devotion.',
    qualitiesHa: 'Albarka, kyau, yalwar arziki da fasaha.',
    bijaMantra: 'Om Brahmane Namah'
  },
  {
    id: 5,
    name: 'Mrigashira',
    sanskrit: 'मृगशिरा',
    transliteration: 'Mṛgaśīrṣā',
    ruler: 'Mars (Mangala)',
    deity: 'Soma (Nectar céleste)',
    symbol: 'Tête de cerf',
    degrees: '23°20 Taureau - 6°40 Gémeaux',
    spanStartDeg: 53.333,
    spanEndDeg: 66.666,
    zodiacSign: 'Taureau / Gémeaux',
    gana: 'Deva',
    element: 'Terre',
    arabicManzilNumber: 5,
    arabicManzilName: 'Al-Haq\'ah (الهقعة)',
    qualitiesFr: 'Quête spirituelle, curiosité intellectuelle, exploration et paix intérieure.',
    qualitiesEn: 'Spiritual quest, intellectual curiosity, exploration, and inner peace.',
    qualitiesHa: 'Neman sani, binciken hikima, tafiya da natsuwa.',
    bijaMantra: 'Om Somaya Namah'
  },
  {
    id: 6,
    name: 'Ardra',
    sanskrit: 'आर्द्रा',
    transliteration: 'Ārdrā',
    ruler: 'Rahu',
    deity: 'Rudra (Forme tempétueuse de Shiva)',
    symbol: 'Larme / Joyau scintillant',
    degrees: '6°40 - 20°00 Gémeaux (Mithuna)',
    spanStartDeg: 66.666,
    spanEndDeg: 80.0,
    zodiacSign: 'Gémeaux (Mithuna)',
    gana: 'Manushya',
    element: 'Eau',
    arabicManzilNumber: 6,
    arabicManzilName: 'Al-Han\'ah (الهنعة)',
    qualitiesFr: 'Résilience face aux tempêtes émotionnelles, clairvoyance après l\'épreuve.',
    qualitiesEn: 'Resilience facing emotional storms, clarity and renewal after trials.',
    qualitiesHa: 'Juriya a lokacin guguwar rayuwa, tsarkake zuciya da sabon haske.',
    bijaMantra: 'Om Rudraya Namah'
  },
  {
    id: 7,
    name: 'Punarvasu',
    sanskrit: 'पुनर्वसु',
    transliteration: 'Punarvasu',
    ruler: 'Jupiter (Guru)',
    deity: 'Aditi (Mère cosmique infinie)',
    symbol: 'Carquois de flèches',
    degrees: '20°00 Gémeaux - 3°20 Cancer',
    spanStartDeg: 80.0,
    spanEndDeg: 93.333,
    zodiacSign: 'Gémeaux / Cancer',
    gana: 'Deva',
    element: 'Eau',
    arabicManzilNumber: 7,
    arabicManzilName: 'Al-Dhira\' (الذراع)',
    qualitiesFr: 'Retour de la lumière, régénération, bonté d\'âme et prospérité bienveillante.',
    qualitiesEn: 'Return of light, regeneration, spiritual benevolence, and prosperity.',
    qualitiesHa: 'Komowar haske, sabuntawa, alheri da yalwa mai albarka.',
    bijaMantra: 'Om Aditye Namah'
  },
  {
    id: 8,
    name: 'Pushya',
    sanskrit: 'पुष्य',
    transliteration: 'Puṣya',
    ruler: 'Saturn (Shani)',
    deity: 'Brihaspati (Précepteur spirituel des Dieux)',
    symbol: 'Pis de vache / Fleur de Lotus',
    degrees: '3°20 - 16°40 Cancer (Karka)',
    spanStartDeg: 93.333,
    spanEndDeg: 106.666,
    zodiacSign: 'Cancer (Karka)',
    gana: 'Deva',
    element: 'Eau',
    arabicManzilNumber: 8,
    arabicManzilName: 'Al-Nathrah (النثرة)',
    qualitiesFr: 'Nourriture spirituelle, très hautement faste, sagesse, stabilité et bénédictions.',
    qualitiesEn: 'Spiritual nourishment, most auspicious star, wisdom, stability, and blessings.',
    qualitiesHa: 'Ciyarwar ruhi, tauraro mai cike da albarka, hikima da kariya.',
    bijaMantra: 'Om Brihaspataye Namah'
  },
  {
    id: 9,
    name: 'Ashlesha',
    sanskrit: 'आश्लेषा',
    transliteration: 'Āśleṣā',
    ruler: 'Mercury (Budha)',
    deity: 'Nagas (Serpents mystiques sacrés)',
    symbol: 'Serpent enroulé',
    degrees: '16°40 - 30°00 Cancer (Karka)',
    spanStartDeg: 106.666,
    spanEndDeg: 120.0,
    zodiacSign: 'Cancer (Karka)',
    gana: 'Rakshasa',
    element: 'Eau',
    arabicManzilNumber: 9,
    arabicManzilName: 'Al-Tarf (الطرف)',
    qualitiesFr: 'Éveil de la Kundalini, intuition profonde, pénétration occulte et prudence.',
    qualitiesEn: 'Kundalini awakening, deep intuitive perception, occult wisdom, and prudence.',
    qualitiesHa: 'Farkawar ruhin sirri, basira mai zurfi, ilimin ɓoye da taka-tsantsan.',
    bijaMantra: 'Om Sarpebhyo Namah'
  },
  {
    id: 10,
    name: 'Magha',
    sanskrit: 'मघा',
    transliteration: 'Maghā',
    ruler: 'Ketu',
    deity: 'Pitris (Ancêtres vénérés)',
    symbol: 'Trône royal / Palanquin',
    degrees: '0°00 - 13°20 Lion (Simha)',
    spanStartDeg: 120.0,
    spanEndDeg: 133.333,
    zodiacSign: 'Lion (Simha)',
    gana: 'Rakshasa',
    element: 'Eau',
    arabicManzilNumber: 10,
    arabicManzilName: 'Al-Jabhah (الجبهة)',
    qualitiesFr: 'Noblesse de lignée, autorité légitime, fidélité aux racines et grandeur morale.',
    qualitiesEn: 'Ancestral nobility, legitimate authority, loyalty to lineage, and moral grandeur.',
    qualitiesHa: 'Darajar dangi, mulki da iko, girmama magabata da shugabanci.',
    bijaMantra: 'Om Pitribhyo Namah'
  },
  {
    id: 11,
    name: 'Purva Phalguni',
    sanskrit: 'पूर्व फाल्गुनी',
    transliteration: 'Pūrva Phālgunī',
    ruler: 'Venus (Shukra)',
    deity: 'Bhaga (Dieu de la félicité)',
    symbol: 'Hamac / Pieds antérieurs du lit',
    degrees: '13°20 - 26°40 Lion (Simha)',
    spanStartDeg: 133.333,
    spanEndDeg: 146.666,
    zodiacSign: 'Lion (Simha)',
    gana: 'Manushya',
    element: 'Eau',
    arabicManzilNumber: 11,
    arabicManzilName: 'Al-Zubrah / Al-Kharatan (الزبرة)',
    qualitiesFr: 'Charme magnétique, réjouissance de vivre, créativité affective et prospérité.',
    qualitiesEn: 'Magnetic charm, joy of living, creative affection, and prosperity.',
    qualitiesHa: 'Kwarjini, farin ciki, soyayya da jin daɗin rayuwa.',
    bijaMantra: 'Om Bhagaya Namah'
  },
  {
    id: 12,
    name: 'Uttara Phalguni',
    sanskrit: 'उत्तर फाल्गुनी',
    transliteration: 'Uttara Phālgunī',
    ruler: 'Sun (Surya)',
    deity: 'Aryaman (Dieu de l\'amitié et des alliances)',
    symbol: 'Lit royal / Deux bâtons',
    degrees: '26°40 Lion - 10°00 Vierge',
    spanStartDeg: 146.666,
    spanEndDeg: 160.0,
    zodiacSign: 'Lion / Vierge',
    gana: 'Manushya',
    element: 'Feu',
    arabicManzilNumber: 12,
    arabicManzilName: 'Al-Sarfah (الصرفة)',
    qualitiesFr: 'Fidélité aux engagements, alliances généreuses, honneur et patronage.',
    qualitiesEn: 'Fidelity to vows, generous partnerships, honor, and noble patronage.',
    qualitiesHa: 'Cika alkawari, aminci a abota, daraja da taimakon na kasa.',
    bijaMantra: 'Om Aryamne Namah'
  },
  {
    id: 13,
    name: 'Hasta',
    sanskrit: 'हस्त',
    transliteration: 'Hasta',
    ruler: 'Moon (Chandra)',
    deity: 'Savitur (Soleil vivifiant de l\'aube)',
    symbol: 'Main ouverte / Doigts bénissants',
    degrees: '10°00 - 23°20 Vierge (Kanya)',
    spanStartDeg: 160.0,
    spanEndDeg: 173.333,
    zodiacSign: 'Vierge (Kanya)',
    gana: 'Deva',
    element: 'Feu',
    arabicManzilNumber: 13,
    arabicManzilName: 'Al-Awwa (العواء)',
    qualitiesFr: 'Dextérité manuelle, pouvoir guérisseur des mains, clarté mentale et artisanat.',
    qualitiesEn: 'Manual dexterity, healing power of hands, mental clarity, and artisan mastery.',
    qualitiesHa: 'Gwanintar hannu, warkarwa, hasken basira da fasahar kera.',
    bijaMantra: 'Om Savitre Namah'
  },
  {
    id: 14,
    name: 'Chitra',
    sanskrit: 'चित्रा',
    transliteration: 'Citrā',
    ruler: 'Mars (Mangala)',
    deity: 'Vishvakarma (Architecte divin de l\'univers)',
    symbol: 'Perle éclatante / Joyau taillé',
    degrees: '23°20 Vierge - 6°40 Balance',
    spanStartDeg: 173.333,
    spanEndDeg: 186.666,
    zodiacSign: 'Vierge / Balance',
    gana: 'Rakshasa',
    element: 'Feu',
    arabicManzilNumber: 14,
    arabicManzilName: 'Al-Simak al-A\'zal / Spica (السماك الأعزل)',
    qualitiesFr: 'Éclat esthétique, architecture sacrée, éclat créatif et splendeur visuelle.',
    qualitiesEn: 'Aesthetic brilliance, sacred design, craftsmanship, and dazzling elegance.',
    qualitiesHa: 'Kyakkyawan zane, ginin hikima, haske da kyawun gani.',
    bijaMantra: 'Om Vishvakarmane Namah'
  },
  {
    id: 15,
    name: 'Swati',
    sanskrit: 'स्वाति',
    transliteration: 'Svātī',
    ruler: 'Rahu',
    deity: 'Vayu (Seigneur du vent et du souffle vital)',
    symbol: 'Jeune pousse de corail oscillant au vent',
    degrees: '6°40 - 20°00 Balance (Tula)',
    spanStartDeg: 186.666,
    spanEndDeg: 200.0,
    zodiacSign: 'Balance (Tula)',
    gana: 'Deva',
    element: 'Feu',
    arabicManzilNumber: 15,
    arabicManzilName: 'Al-Ghafr (الغفر)',
    qualitiesFr: 'Indépendance d\'esprit, flexibilité diplomatique, souffle vital et liberté.',
    qualitiesEn: 'Independence of mind, diplomatic flexibility, vital breath (Prana), and freedom.',
    qualitiesHa: 'Kare kai, sassaucin ra\'ayi, iskar rayuwa da \'yanci.',
    bijaMantra: 'Om Vayave Namah'
  },
  {
    id: 16,
    name: 'Vishakha',
    sanskrit: 'विशाखा',
    transliteration: 'Viśākhā',
    ruler: 'Jupiter (Guru)',
    deity: 'Indra & Agni (Souveraineté & Feu)',
    symbol: 'Arc triomphal / Potier',
    degrees: '20°00 Balance - 3°20 Scorpion',
    spanStartDeg: 200.0,
    spanEndDeg: 213.333,
    zodiacSign: 'Balance / Scorpion',
    gana: 'Rakshasa',
    element: 'Feu',
    arabicManzilNumber: 16,
    arabicManzilName: 'Al-Zubana (الزبانا)',
    qualitiesFr: 'Détermination inébranlable, accomplissement des buts majeurs, ferveur et triomphe.',
    qualitiesEn: 'Unwavering determination, goal achievement, focused fervor, and triumph.',
    qualitiesHa: 'Dabara da naci wajen cin nasara, cimma buri da daukaka.',
    bijaMantra: 'Om Indragnibhyam Namah'
  },
  {
    id: 17,
    name: 'Anuradha',
    sanskrit: 'अनुराधा',
    transliteration: 'Anurādhā',
    ruler: 'Saturn (Shani)',
    deity: 'Mitra (Divinité de la concorde)',
    symbol: 'Fleur de Lotus épanouie',
    degrees: '3°20 - 16°40 Scorpion (Vrishchika)',
    spanStartDeg: 213.333,
    spanEndDeg: 226.666,
    zodiacSign: 'Scorpion (Vrishchika)',
    gana: 'Deva',
    element: 'Feu',
    arabicManzilNumber: 17,
    arabicManzilName: 'Al-Iklil (الإكليل)',
    qualitiesFr: 'Dévotion mystique (Bhakti), amitié loyale, capacité à fleurir dans l\'adversité.',
    qualitiesEn: 'Mystic devotion (Bhakti), loyal friendship, blooming through adversity.',
    qualitiesHa: 'Ikhlasi na ruhi, aminci na dindindin, juriya cikin mawuyacin hali.',
    bijaMantra: 'Om Mitraya Namah'
  },
  {
    id: 18,
    name: 'Jyeshtha',
    sanskrit: 'ज्येष्ठा',
    transliteration: 'Jyeṣṭhā',
    ruler: 'Mercury (Budha)',
    deity: 'Indra (Roi des Cieux)',
    symbol: 'Amulette protectrice / Talisman circulaire',
    degrees: '16°40 - 30°00 Scorpion (Vrishchika)',
    spanStartDeg: 226.666,
    spanEndDeg: 240.0,
    zodiacSign: 'Scorpion (Vrishchika)',
    gana: 'Rakshasa',
    element: 'Air',
    arabicManzilNumber: 18,
    arabicManzilName: 'Al-Qalb / Antarès (القلب)',
    qualitiesFr: 'Maturité d\'esprit, pouvoir protecteur, autorité aînée et bravoure occulte.',
    qualitiesEn: 'Elder maturity, protective prowess, spiritual mastery, and occult courage.',
    qualitiesHa: 'Girma da hikima, kariya ta koli, jarumta da kwarjini.',
    bijaMantra: 'Om Indraya Namah'
  },
  {
    id: 19,
    name: 'Mula',
    sanskrit: 'मूल',
    transliteration: 'Mūla',
    ruler: 'Ketu',
    deity: 'Nirriti (Déesse de la dissolution cosmique)',
    symbol: 'Faisceau de racines liées',
    degrees: '0°00 - 13°20 Sagittaire (Dhanu)',
    spanStartDeg: 240.0,
    spanEndDeg: 253.333,
    zodiacSign: 'Sagittaire (Dhanu)',
    gana: 'Rakshasa',
    element: 'Air',
    arabicManzilNumber: 19,
    arabicManzilName: 'Al-Shawlah (الشولة)',
    qualitiesFr: 'Enquête au tréfonds des causes, transmutation des illusions, racine mystique.',
    qualitiesEn: 'Root investigation, dissolution of illusions, deep transformation, and core truth.',
    qualitiesHa: 'Tono asali da gaskiya, warware rudani, sabon gini daga tushe.',
    bijaMantra: 'Om Nirritaye Namah'
  },
  {
    id: 20,
    name: 'Purva Ashadha',
    sanskrit: 'पूर्वाषाढा',
    transliteration: 'Pūrvāṣāḍhā',
    ruler: 'Venus (Shukra)',
    deity: 'Apas (Eaux célestes primordiales)',
    symbol: 'Éventail / Van de purification',
    degrees: '13°20 - 26°40 Sagittaire (Dhanu)',
    spanStartDeg: 253.333,
    spanEndDeg: 266.666,
    zodiacSign: 'Sagittaire (Dhanu)',
    gana: 'Manushya',
    element: 'Air',
    arabicManzilNumber: 20,
    arabicManzilName: 'Al-Na\'am (النعائم)',
    qualitiesFr: 'Invincibilité par la foi, purification par l\'eau sacrée, éloquence victorieuse.',
    qualitiesEn: 'Invincibility through faith, holy water purification, victorious eloquence.',
    qualitiesHa: 'Nasara da babu kokwanto, tsarkin ruwan asiri, fasahar zance da daukaka.',
    bijaMantra: 'Om Adbhyo Namah'
  },
  {
    id: 21,
    name: 'Uttara Ashadha',
    sanskrit: 'उत्तराषाढा',
    transliteration: 'Uttarāṣāḍhā',
    ruler: 'Sun (Surya)',
    deity: 'Vishwadevas (Vertus cosmiques unifiées)',
    symbol: 'Défenses d\'éléphant',
    degrees: '26°40 Sagittaire - 10°00 Capricorne',
    spanStartDeg: 266.666,
    spanEndDeg: 280.0,
    zodiacSign: 'Sagittaire / Capricorne',
    gana: 'Manushya',
    element: 'Air',
    arabicManzilNumber: 21,
    arabicManzilName: 'Al-Baldah (البلدة)',
    qualitiesFr: 'Victoire durable et définitive, rectitude morale, humilité et accomplissement.',
    qualitiesEn: 'Permanent lasting victory, moral rectitude, universal duty, and endurance.',
    qualitiesHa: 'Nasara mai dorewa, gaskiya da rikon amana, cikar aiki.',
    bijaMantra: 'Om Vishvedevebhyo Namah'
  },
  {
    id: 22,
    name: 'Shravana',
    sanskrit: 'श्रवण',
    transliteration: 'Śravaṇa',
    ruler: 'Moon (Chandra)',
    deity: 'Vishnu (Préservateur de la création)',
    symbol: 'Oreille / Trois pas divins',
    degrees: '10°00 - 23°20 Capricorne (Makara)',
    spanStartDeg: 280.0,
    spanEndDeg: 293.333,
    zodiacSign: 'Capricorne (Makara)',
    gana: 'Deva',
    element: 'Air',
    arabicManzilNumber: 22,
    arabicManzilName: 'Sa\'d al-Dhabih (سعد الذابح)',
    qualitiesFr: 'Écoute méditative (Shruti), transmission orale sacrée, érudition et illumination.',
    qualitiesEn: 'Meditative listening (Shruti), sacred oral transmission, deep study, and illumination.',
    qualitiesHa: 'Sauraron asiri da koyarwa, ilimin ruhi, fahimta da hasken zuciya.',
    bijaMantra: 'Om Vishnave Namah'
  },
  {
    id: 23,
    name: 'Dhanishta',
    sanskrit: 'धनिष्ठा',
    transliteration: 'Dhaniṣṭhā',
    ruler: 'Mars (Mangala)',
    deity: 'Ashta Vasus (Huit déités de l\'abondance)',
    symbol: 'Tambour de Shiva (Damaru) / Flûte',
    degrees: '23°20 Capricorne - 6°40 Verseau',
    spanStartDeg: 293.333,
    spanEndDeg: 306.666,
    zodiacSign: 'Capricorne / Verseau',
    gana: 'Rakshasa',
    element: 'Éther',
    arabicManzilNumber: 23,
    arabicManzilName: 'Sa\'d Bula\' (سعد بلع)',
    qualitiesFr: 'Rythme universel, prospérité opulente, talent musical et générosité d\'âme.',
    qualitiesEn: 'Cosmic rhythm, opulent prosperity, musical genius, and wealth sharing.',
    qualitiesHa: 'Kida da sautin hikima, yalwar arziki, fasahar kide-kide da kyauta.',
    bijaMantra: 'Om Vasubhyo Namah'
  },
  {
    id: 24,
    name: 'Shatabhisha',
    sanskrit: 'शतभिषा',
    transliteration: 'Śatabhiṣā',
    ruler: 'Rahu',
    deity: 'Varuna (Seigneur des eaux célestes et du ciel étoilé)',
    symbol: 'Cercle vide / Cent médecins',
    degrees: '6°40 - 20°00 Verseau (Kumbha)',
    spanStartDeg: 306.666,
    spanEndDeg: 320.0,
    zodiacSign: 'Verseau (Kumbha)',
    gana: 'Rakshasa',
    element: 'Éther',
    arabicManzilNumber: 24,
    arabicManzilName: 'Sa\'d al-Su\'ud (سعد السعود)',
    qualitiesFr: 'Cent remèdes mystiques, vision holistique, guérison des afflictions complexes.',
    qualitiesEn: 'Hundred divine healers, holistic veil penetration, healing complex ailments.',
    qualitiesHa: 'Magunguna dari na asiri, warkar da cututtuka masu wuya, sirrin sararin samaniya.',
    bijaMantra: 'Om Varunaya Namah'
  },
  {
    id: 25,
    name: 'Purva Bhadrapada',
    sanskrit: 'पूर्व भाद्रपदा',
    transliteration: 'Pūrva Bhādrapadā',
    ruler: 'Jupiter (Guru)',
    deity: 'Aja Ekapada (Le bouc cosmique unijambiste / Éclair mystique)',
    symbol: 'Épée / Deux faces d\'un homme',
    degrees: '20°00 Verseau - 3°20 Poissons',
    spanStartDeg: 320.0,
    spanEndDeg: 333.333,
    zodiacSign: 'Verseau / Poissons',
    gana: 'Manushya',
    element: 'Éther',
    arabicManzilNumber: 25,
    arabicManzilName: 'Sa\'d al-Akhbiyah (سعد الأخبية)',
    qualitiesFr: 'Ascèse intense, transcendance des limites du monde matériel, feu mystique.',
    qualitiesEn: 'Intense asceticism, spiritual transcendence beyond the material realm, sacred fire.',
    qualitiesHa: 'Kaurace wa duniya, zurfafa a ibada da hasken wutar asiri.',
    bijaMantra: 'Om Ajaikapadaya Namah'
  },
  {
    id: 26,
    name: 'Uttara Bhadrapada',
    sanskrit: 'उत्तर भाद्रपदा',
    transliteration: 'Uttara Bhādrapadā',
    ruler: 'Saturn (Shani)',
    deity: 'Ahir Budhnya (Le Dragon des profondeurs abyssales)',
    symbol: 'Lit funéraire / Serpent jumeau',
    degrees: '3°20 - 16°40 Poissons (Meena)',
    spanStartDeg: 333.333,
    spanEndDeg: 346.666,
    zodiacSign: 'Poissons (Meena)',
    gana: 'Manushya',
    element: 'Éther',
    arabicManzilNumber: 26,
    arabicManzilName: 'Al-Fargh al-Muqaddim (الفرغ المقدم)',
    qualitiesFr: 'Sérénité méditative, compassion sans bornes, retenue et profondeur philosophique.',
    qualitiesEn: 'Meditative stillness, boundless compassion, patient restraint, and deep wisdom.',
    qualitiesHa: 'Natsuwar koli, tausayi mara iyaka, hakuri da zurfin ilimin rai.',
    bijaMantra: 'Om Ahirbudhnyaya Namah'
  },
  {
    id: 27,
    name: 'Revati',
    sanskrit: 'रेवती',
    transliteration: 'Revatī',
    ruler: 'Mercury (Budha)',
    deity: 'Pushan (Le guide protecteur des voyageurs et des âmes)',
    symbol: 'Paire de poissons nageant / Tambour de route',
    degrees: '16°40 - 30°00 Poissons (Meena)',
    spanStartDeg: 346.666,
    spanEndDeg: 360.0,
    zodiacSign: 'Poissons (Meena)',
    gana: 'Deva',
    element: 'Éther',
    arabicManzilNumber: 27,
    arabicManzilName: 'Al-Fargh al-Mu\'akhar / Al-Risha (الفرغ المؤخر)',
    qualitiesFr: 'Bienveillance protectrice lors des voyages, achèvement heureux du cycle, grâce finale.',
    qualitiesEn: 'Nourishing protection on journeys, joyful cycle completion, ultimate grace and bliss.',
    qualitiesHa: 'Kariya a lokacin tafiya, cikar zagaye cikin nasara da alheri.',
    bijaMantra: 'Om Pushne Namah'
  }
];

// Vimshottari Dasha Planetary Periods (Total: 120 Years)
export const VIMSHOTTARI_DASHAS_CONFIG = [
  { planet: 'Ketu', planetFr: 'Ketu (Nœud Sud)', planetEn: 'Ketu (South Node)', planetHa: 'Ketu', years: 7, color: '#9333ea' },
  { planet: 'Venus', planetFr: 'Vénus (Shukra)', planetEn: 'Venus (Shukra)', planetHa: 'Zuhra', years: 20, color: '#ec4899' },
  { planet: 'Sun', planetFr: 'Soleil (Surya)', planetEn: 'Sun (Surya)', planetHa: 'Rana', years: 6, color: '#f59e0b' },
  { planet: 'Moon', planetFr: 'Lune (Chandra)', planetEn: 'Moon (Chandra)', planetHa: 'Wata', years: 10, color: '#38bdf8' },
  { planet: 'Mars', planetFr: 'Mars (Mangala)', planetEn: 'Mars (Mangala)', planetHa: 'Marik', years: 7, color: '#ef4444' },
  { planet: 'Rahu', planetFr: 'Rahu (Nœud Nord)', planetEn: 'Rahu (North Node)', planetHa: 'Rahu', years: 18, color: '#6366f1' },
  { planet: 'Jupiter', planetFr: 'Jupiter (Guru)', planetEn: 'Jupiter (Guru)', planetHa: 'Mushtari', years: 16, color: '#eab308' },
  { planet: 'Saturn', planetFr: 'Saturne (Shani)', planetEn: 'Saturn (Shani)', planetHa: 'Zuhal', years: 19, color: '#475569' },
  { planet: 'Mercury', planetFr: 'Mercure (Budha)', planetEn: 'Mercury (Budha)', planetHa: 'Utarid', years: 17, color: '#10b981' }
];

// Subtle Centers Comparison (Chakras vs Sufi Latâ'if)
export const SUBTLE_CENTERS_COMPARISON: SubtleCenterItem[] = [
  {
    id: 1,
    level: 1,
    chakraName: 'Muladhara',
    chakraSanskrit: 'मूलाधार',
    chakraLocationFr: 'Base de la colonne vertébrale / Périnée',
    chakraLocationEn: 'Base of the spine / Perineum',
    chakraLocationHa: 'Gindin kashin baya / Wurin zama',
    chakraElementFr: 'Terre (Prithvi)',
    chakraElementEn: 'Earth (Prithvi)',
    chakraElementHa: 'Kasa',
    chakraColor: 'Rouge profond',
    chakraColorHex: '#dc2626',
    chakraPetals: 4,
    chakraBija: 'LAM (लं)',
    chakraSignificanceFr: 'Ancrage terrestre, survie physique, stabilité fondamentale et préservation vitale.',
    chakraSignificanceEn: 'Grounding, physical survival, foundational stability, and instinctual roots.',
    chakraSignificanceHa: 'Kafuwa a kasa, rayuwa, natsuwar jiki da tsaro.',
    latifaName: 'Latifa al-Nafs / Qalab',
    latifaArabic: 'لطيفة النفس / القالب',
    latifaLocationFr: 'Sous le nombril / Centre corporel inférieur',
    latifaLocationEn: 'Below the navel / Lower physical center',
    latifaLocationHa: 'Karkashin cibiya / Sashin jiki na kasa',
    latifaProphetFr: 'Adam (آدم)',
    latifaProphetEn: 'Adam (alayhi as-salam)',
    latifaProphetHa: 'Annabi Adam (A.S)',
    latifaColor: 'Bleu / Noir terreux',
    latifaColorHex: '#1e293b',
    latifaDhikr: 'Lā ilāha illā Allāh (لا إله إلا الله)',
    latifaSignificanceFr: 'Purification de l\'âme charnelle (Nafs al-Ammara) pour l\'élever vers l\'apaisement (Nafs al-Mutma\'inna).',
    latifaSignificanceEn: 'Purification of the lower self (Nafs) evolving toward tranquil contentment (Mutma\'inna).',
    latifaSignificanceHa: 'Tsarkake son zuciya da horar da jiki don samun natsuwa.'
  },
  {
    id: 2,
    level: 2,
    chakraName: 'Svadhisthana',
    chakraSanskrit: 'स्वाधिष्ठान',
    chakraLocationFr: 'Bas-ventre / Sacrum (2 doigts sous le nombril)',
    chakraLocationEn: 'Lower abdomen / Sacrum',
    chakraLocationHa: 'Kasan ciki / Matsayin mafitsara',
    chakraElementFr: 'Eau (Jala)',
    chakraElementEn: 'Water (Jala)',
    chakraElementHa: 'Ruwa',
    chakraColor: 'Orange lumineux',
    chakraColorHex: '#ea580c',
    chakraPetals: 6,
    chakraBija: 'VAM (वं)',
    chakraSignificanceFr: 'Fluidité émotionnelle, créativité, réceptivité et énergie de vie.',
    chakraSignificanceEn: 'Emotional fluidity, creativity, receptivity, and vitality.',
    chakraSignificanceHa: 'Gudanar da ruhi, kirkire-kirkire da motsin rai.',
    latifaName: 'Latifa al-Qalb',
    latifaArabic: 'لطيفة القلب',
    latifaLocationFr: 'Deux doigts sous le sein gauche (Pôle de la foi)',
    latifaLocationEn: 'Two fingers below the left breast',
    latifaLocationHa: 'Yatsu biyu karkashin nono na hagu',
    latifaProphetFr: 'Abraham / Noé (إبراهيم / نوح)',
    latifaProphetEn: 'Abraham / Noah',
    latifaProphetHa: 'Annabi Ibrahim / Nuhu (A.S)',
    latifaColor: 'Jaune doré éclatant',
    latifaColorHex: '#eab308',
    latifaDhikr: 'Yā Allāh / Allāh (يا الله)',
    latifaSignificanceFr: 'Le Cœur spirituel : siège de l\'amour divin, réceptacle des inspirations célestes et du discernement.',
    latifaSignificanceEn: 'The spiritual heart: seat of divine love, celestial intuitions, and moral discernment.',
    latifaSignificanceHa: 'Zuciyar ruhi: matattarar soyayyar Ubangiji da hasken imani.'
  },
  {
    id: 3,
    level: 3,
    chakraName: 'Manipura',
    chakraSanskrit: 'मणिपूर',
    chakraLocationFr: 'Plexus solaire / Estomac',
    chakraLocationEn: 'Solar plexus / Upper abdomen',
    chakraLocationHa: 'Tsakiyar ciki / Sama da cibiya',
    chakraElementFr: 'Feu (Agni)',
    chakraElementEn: 'Fire (Agni)',
    chakraElementHa: 'Wuta',
    chakraColor: 'Jaune solaire',
    chakraColorHex: '#facc15',
    chakraPetals: 10,
    chakraBija: 'RAM (रं)',
    chakraSignificanceFr: 'Volonté, rayonnement individuel, courage et feu digestif/métabolique.',
    chakraSignificanceEn: 'Willpower, personal radiance, courage, and metabolic inner fire.',
    chakraSignificanceHa: 'Ikon aiwatarwa, kwarjini, jarumta da zafin aiki.',
    latifaName: 'Latifa ar-Ruh',
    latifaArabic: 'لطيفة الروح',
    latifaLocationFr: 'Deux doigts sous le sein droit (Pôle du Souffle)',
    latifaLocationEn: 'Two fingers below the right breast',
    latifaLocationHa: 'Yatsu biyu karkashin nono na dama',
    latifaProphetFr: 'Moïse (موسى)',
    latifaProphetEn: 'Moses',
    latifaProphetHa: 'Annabi Musa (A.S)',
    latifaColor: 'Rouge rubis éclatant',
    latifaColorHex: '#ef4444',
    latifaDhikr: 'Allāh (الله)',
    latifaSignificanceFr: 'L\'Esprit : immersion dans la contemplation des attributs divins, sérénité et transcendance.',
    latifaSignificanceEn: 'The Spirit: immersion in contemplation of Divine attributes and tranquil awe.',
    latifaSignificanceHa: 'Ruhin bawa: zurfafa a cikin bimbini kan sifofin Ubangiji.'
  },
  {
    id: 4,
    level: 4,
    chakraName: 'Anahata',
    chakraSanskrit: 'अनाहत',
    chakraLocationFr: 'Centre de la poitrine / Cœur',
    chakraLocationEn: 'Center of the chest / Heart',
    chakraLocationHa: 'Tsakiyar kirji',
    chakraElementFr: 'Air (Vayu)',
    chakraElementEn: 'Air (Vayu)',
    chakraElementHa: 'Iska',
    chakraColor: 'Vert émeraude',
    chakraColorHex: '#10b981',
    chakraPetals: 12,
    chakraBija: 'YAM (यं)',
    chakraSignificanceFr: 'Compassion inconditionnelle, harmonie, amour universel et équilibre.',
    chakraSignificanceEn: 'Unconditional compassion, harmony, universal love, and inner balance.',
    chakraSignificanceHa: 'Tausayi ga halittu, soyayya ta gaskiya da daidaito.',
    latifaName: 'Latifa as-Sirr',
    latifaArabic: 'لطيفة السر',
    latifaLocationFr: 'À gauche au niveau du cœur supérieur (Le Secret)',
    latifaLocationEn: 'Upper left chest above the heart',
    latifaLocationHa: 'Saman zuciya a bangaren hagu',
    latifaProphetFr: 'Jésus (عيسى)',
    latifaProphetEn: 'Jesus',
    latifaProphetHa: 'Annabi Isa (A.S)',
    latifaColor: 'Blanc pur immaculé',
    latifaColorHex: '#f8fafc',
    latifaDhikr: 'Yā Hayy Yā Qayyūm (يا حي يا قيوم)',
    latifaSignificanceFr: 'Le Secret intime : intimité avec le Divin, révélation des mystères cachés et dépouillement.',
    latifaSignificanceEn: 'The Inner Secret: intimate communion with the Divine and revelation of mysteries.',
    latifaSignificanceHa: 'Sirrin boye: kusanci da Ubangiji da fahimtar asirai.'
  },
  {
    id: 5,
    level: 5,
    chakraName: 'Vishuddha',
    chakraSanskrit: 'विशुद्ध',
    chakraLocationFr: 'Gorge / Centre laryngé',
    chakraLocationEn: 'Throat center',
    chakraLocationHa: 'Makamashin makogwaro',
    chakraElementFr: 'Éther (Akasha)',
    chakraElementEn: 'Ether / Space (Akasha)',
    chakraElementHa: 'Sararin samaniya',
    chakraColor: 'Bleu azur ciel',
    chakraColorHex: '#0284c7',
    chakraPetals: 16,
    chakraBija: 'HAM (हं)',
    chakraSignificanceFr: 'Vérité du verbe, expression authentique, résonance spirituelle et écoute subtile.',
    chakraSignificanceEn: 'Truthful speech, authentic expression, spiritual vibration, and subtle listening.',
    chakraSignificanceHa: 'Gaskiyar magana, bayyana ra\'ayi da tsarkin lafazi.',
    latifaName: 'Latifa al-Khafi',
    latifaArabic: 'لطيفة الخفي',
    latifaLocationFr: 'À droite au niveau de la poitrine supérieure',
    latifaLocationEn: 'Upper right chest',
    latifaLocationHa: 'Saman kirji a bangaren dama',
    latifaProphetFr: 'Muhammad (محمد)',
    latifaProphetEn: 'Muhammad (sallallahu alayhi wa sallam)',
    latifaProphetHa: 'Annabi Muhammad (S.A.W)',
    latifaColor: 'Vert émeraude profond',
    latifaColorHex: '#047857',
    latifaDhikr: 'Yā Wāhid Yā Ahad (يا واحد يا أحد)',
    latifaSignificanceFr: 'Le Caché : station de l\'anéantissement dans l\'amour divin et contemplation de l\'Unicité.',
    latifaSignificanceEn: 'The Hidden: state of absorption in Divine Oneness and quiet ecstasy.',
    latifaSignificanceHa: 'Boyayyen matsayi: narkewa a cikin kadaita Ubangiji.'
  },
  {
    id: 6,
    level: 6,
    chakraName: 'Ajna',
    chakraSanskrit: 'आज्ञा',
    chakraLocationFr: 'Entre les sourcils / Troisième œil',
    chakraLocationEn: 'Between the eyebrows / Third eye',
    chakraLocationHa: 'Tsakanin girare biyu / Ido na uku',
    chakraElementFr: 'Lumière / Conscience pure (Mahat)',
    chakraElementEn: 'Light / Pure Mind',
    chakraElementHa: 'Haske da hankali',
    chakraColor: 'Indigo royal',
    chakraColorHex: '#4338ca',
    chakraPetals: 2,
    chakraBija: 'OM (ॐ)',
    chakraSignificanceFr: 'Vision intérieure (Kashf), intuition supérieure, clarté mentale et commandement.',
    chakraSignificanceEn: 'Inner vision, high spiritual intuition, clarity of intellect, and discernment.',
    chakraSignificanceHa: 'Kashfi na asiri, basirar zuciya da kaifin hankali.',
    latifaName: 'Latifa al-Akhfa',
    latifaArabic: 'لطيفة الأخفى',
    latifaLocationFr: 'Milieu de la poitrine / Centre sternal profond',
    latifaLocationEn: 'Center of chest sternum (Deepest center)',
    latifaLocationHa: 'Tsakiyar kirji a can karkashi',
    latifaProphetFr: 'Le Sceau prophétique (حقيقة المحمدية)',
    latifaProphetEn: 'The Prophetic Reality (Haqiqa Muhammadiyya)',
    latifaProphetHa: 'Haqiqar Annabta',
    latifaColor: 'Noir pur transcendant / Lumière incandescente',
    latifaColorHex: '#0f172a',
    latifaDhikr: 'Yā Samad (يا صمد)',
    latifaSignificanceFr: 'Le Plus-Caché : proximité suprême, sanctuaire du secret des secrets et présence pure.',
    latifaSignificanceEn: 'The Most-Hidden: supreme nearness, sanctuary of core mysteries, and pure Divine presence.',
    latifaSignificanceHa: 'Mafi boyuwa: sirrin asirai da tsarkin kusanci.'
  },
  {
    id: 7,
    level: 7,
    chakraName: 'Sahasrara',
    chakraSanskrit: 'सहस्रार',
    chakraLocationFr: 'Sommet du crâne / Couronne',
    chakraLocationEn: 'Crown of the head',
    chakraLocationHa: 'Kankanar ka / Tsakiyar kai',
    chakraElementFr: 'Pensée / Conscience cosmique universelle',
    chakraElementEn: 'Pure Cosmic Consciousness',
    chakraElementHa: 'Koli na ruhi',
    chakraColor: 'Violet / Blanc doré',
    chakraColorHex: '#8b5cf6',
    chakraPetals: 1000,
    chakraBija: 'Silence suprême',
    chakraSignificanceFr: 'Union avec l\'Absolu (Samadhi), illumination, libération et transcendance suprême.',
    chakraSignificanceEn: 'Union with the Supreme Divine (Samadhi), enlightenment, liberation (Moksha).',
    chakraSignificanceHa: 'Haduwa da Madaukaki, haske da \'yantar da ruhi.',
    latifaName: 'Martabat al-Dhat (Fana & Baqa)',
    latifaArabic: 'مرتبة الذات (الفناء والبقاء)',
    latifaLocationFr: 'Sommet de la tête / Pôle de la Réalité Suprême',
    latifaLocationEn: 'Crown / Axis of Divine Reality',
    latifaLocationHa: 'Koli na kai / Matsayin gaskiyar Ubangiji',
    latifaProphetFr: 'Transcendance Divine Absolue',
    latifaProphetEn: 'Absolute Divine Transcendence',
    latifaProphetHa: 'Tsarki mara iyaka ga Allah',
    latifaColor: 'Lumière sans couleur / Clarté infinie',
    latifaColorHex: '#e0e7ff',
    latifaDhikr: 'Hū (هو)',
    latifaSignificanceFr: 'L\'extinction en Dieu (Fana) suivie de la subsistance en Sa Présence (Baqa bi-Llah).',
    latifaSignificanceEn: 'Extinction in God (Fana) followed by eternal subsistence in His Light (Baqa bi-Llah).',
    latifaSignificanceHa: 'Fana\'u da zama tare da hasken Ubangiji (Baqa\'u).'
  }
];

// Sacred Traditional Plants Library (Exhaustive Documentary Botanical Collection)
export const SACRED_PLANTS_LIBRARY: PlantItem[] = [
  {
    id: 'olibanum',
    nameFr: 'Encens Oliban (Luban dakar)',
    nameEn: 'Frankincense (Boswellia)',
    nameHa: 'Luban / Hankin kuka',
    botanicalName: 'Boswellia carterii / sacra',
    arabicName: 'اللُّبَان الذَّكَر (Al-Lubān ad-Dakar)',
    planetaryRuler: 'Soleil (Surya / Al-Shams)',
    element: 'Feu / Air',
    type: 'Resin',
    historicalSources: 'Ibn Sina (Canon de la Médecine), Al-Antaki (Tadhkirat), Dioscoride.',
    symbolicVirtuesFr: 'Purification des atmosphères, élévation de la prière, fortification de la mémoire et clarté spirituelle.',
    symbolicVirtuesEn: 'Atmospheric purification, elevation of prayer, mental fortification, and spiritual clarity.',
    symbolicVirtuesHa: 'Tsarkake wuri, daga addu\'a, karfafa kwakwalwa da hasken ruhi.',
    traditionalUsesFr: 'Fumigation lors des veillées spirituelles et de la récitation coranique; mâché traditionnellement pour tonifier l\'esprit.',
    traditionalUsesEn: 'Fumigation during spiritual vigils and sacred recitations; traditionally chewed to strengthen focus.',
    traditionalUsesHa: 'Turare yayin tilawa da ambaton Allah; tauna shi don karfafa basira.'
  },
  {
    id: 'myrrh',
    nameFr: 'Myrrhe sacrée',
    nameEn: 'Myrrh (Commiphora myrrha)',
    nameHa: 'Murru / Turaren murru',
    botanicalName: 'Commiphora myrrha',
    arabicName: 'المُرّ (Al-Murr)',
    planetaryRuler: 'Saturne / Soleil',
    element: 'Terre / Eau',
    type: 'Resin',
    historicalSources: 'Ibn al-Baytar (Al-Jami), Papyrus Ebers, Charaka Samhita.',
    symbolicVirtuesFr: 'Ancrage profond, purification des miasmes, protection contre les influences lourdes et préservation.',
    symbolicVirtuesEn: 'Deep grounding, cleansing heavy energies, shielding against dense influences, and preservation.',
    symbolicVirtuesHa: 'Natsuwa a kasa, kawar da cututtuka da kariya daga sharri.',
    traditionalUsesFr: 'Fumigation protectrice, composition d\'onguents traditionnels et assainissement des demeures.',
    traditionalUsesEn: 'Protective fumigation, preparation of traditional balms, and sanctification of sacred spaces.',
    traditionalUsesHa: 'Turaren kariya ga gidaje da magungunan gargajiya na fata.'
  },
  {
    id: 'nigella',
    nameFr: 'Nigelle / Graine Noire',
    nameEn: 'Black Seed (Nigella sativa)',
    nameHa: 'Habbatus Sauda / Bakar kwaya',
    botanicalName: 'Nigella sativa',
    arabicName: 'الحَبَّة السَّوْدَاء (Al-Habbah as-Sawdā\')',
    planetaryRuler: 'Mars / Soleil',
    element: 'Feu / Terre',
    type: 'Seed',
    historicalSources: 'Sahih Al-Bukhari (Hadith de la graine bénie), Ibn Qayyim (Médecine Prophétique).',
    symbolicVirtuesFr: 'Bénédiction universelle (Barakah), renforcement du bouclier vital, dissipation des toxines et chaleur vitale.',
    symbolicVirtuesEn: 'Universal blessing (Barakah), vital shield fortification, toxin clearing, and inner vital warmth.',
    symbolicVirtuesHa: 'Albarka mai yawa, karfafa garkuwar jiki da maganin cututtuka.',
    traditionalUsesFr: 'Consommation avec du miel pur, huile en friction douce et protection traditionnelle de la maisonnée.',
    traditionalUsesEn: 'Consumed with raw honey, applied as a soothing oil massage, and home traditional protection.',
    traditionalUsesHa: 'Hada shi da zuma don sha, shafa man a jiki da kariya ga iyali.'
  },
  {
    id: 'saffron',
    nameFr: 'Safran pur',
    nameEn: 'Pure Saffron (Crocus sativus)',
    nameHa: 'Za\'afaran',
    botanicalName: 'Crocus sativus',
    arabicName: 'الزَّعْفَرَان (Az-Za\'farān)',
    planetaryRuler: 'Soleil / Jupiter',
    element: 'Feu / Air',
    type: 'Flower',
    historicalSources: 'Al-Buni (Shams al-Ma\'arif), Ibn Sina, Al-Razi.',
    symbolicVirtuesFr: 'Encre sacrée noble pour l\'écriture des versets et carrés magiques (Awfaq), joie du cœur et illumination.',
    symbolicVirtuesEn: 'Noble sacred ink for writing verses and Awfaq grids, heart joy, and spiritual illumination.',
    symbolicVirtuesHa: 'Tawada mai daraja don rubutun ayoyi da hatimai, farin cikin zuciya da haske.',
    traditionalUsesFr: 'Confection de l\'encre spirituelle avec eau de rose et musc pour l\'écriture calligraphique protectrice.',
    traditionalUsesEn: 'Prepared with rose water and musk as spiritual calligraphy ink for protective charters.',
    traditionalUsesHa: 'Hada shi da ruwan wardi da miski don rubutun allo da sha.'
  },
  {
    id: 'sandalwood',
    nameFr: 'Santal blanc',
    nameEn: 'White Sandalwood',
    nameHa: 'Chandal / Santal',
    botanicalName: 'Santalum album',
    arabicName: 'الصَّنْدَل الأَبْيَض (As-Sandal al-Abyad)',
    planetaryRuler: 'Vénus / Lune',
    element: 'Eau / Air',
    type: 'Wood',
    historicalSources: 'Ayurveda Sushruta Samhita, Ibn al-Nafis, Al-Biruni.',
    symbolicVirtuesFr: 'Apaisement des feux intérieurs, clarté méditative, paix de l\'esprit et harmonie affective.',
    symbolicVirtuesEn: 'Cooling inner fires, meditative clarity, peace of mind, and compassionate harmony.',
    symbolicVirtuesHa: 'Kwantar da zafi, natsuwar tunani a lokacin ibada da kwanciyar hankali.',
    traditionalUsesFr: 'Pâte appliquée sur le front pour rafraîchir l\'intellect, fumigation de haute sérénité.',
    traditionalUsesEn: 'Paste applied to the forehead for mental coolness, burned as serene contemplative incense.',
    traditionalUsesHa: 'Shafe goshi da garinsa don natsuwa, da turare a dakin ibada.'
  },
  {
    id: 'agarwood',
    nameFr: 'Bois d\'Oud / Aloès',
    nameEn: 'Agarwood / Oud',
    nameHa: 'Itacen Oud / Turaren wuta',
    botanicalName: 'Aquilaria agallocha / malaccensis',
    arabicName: 'عُود النَّدّ / العُود القَمَارِي (Al-\'Ūd)',
    planetaryRuler: 'Jupiter / Vénus',
    element: 'Air / Feu',
    type: 'Wood',
    historicalSources: 'Mille et Une Nuits, Al-Kindi (Livre de la chimie des parfums), Hadiths prophétiques.',
    symbolicVirtuesFr: 'Majesté royale, attraction des présences bienveillantes, sanctification et noblesse d\'âme.',
    symbolicVirtuesEn: 'Royal majesty, attracting noble spiritual presences, sanctification, and soul elevation.',
    symbolicVirtuesHa: 'Kwarjinin sarauta, janyo mala\'ikun rahama da daukakar ruhi.',
    traditionalUsesFr: 'Fumigation lors des assemblées de Dhikr majeures et des célébrations sacrées.',
    traditionalUsesEn: 'Fumigation during major Dhikr circles, sacred celebrations, and royal hospitality.',
    traditionalUsesHa: 'Turare a majalisar zikiri da manyan tarukan ibada.'
  },
  {
    id: 'sidr',
    nameFr: 'Feuilles de Sidr (Jujubier)',
    nameEn: 'Sidr / Lote Tree Leaves',
    nameHa: 'Ganyen Magarya (Sidr)',
    botanicalName: 'Ziziphus spina-christi',
    arabicName: 'السِّدْر (As-Sidr)',
    planetaryRuler: 'Lune / Jupiter',
    element: 'Eau / Terre',
    type: 'Herb',
    historicalSources: 'Coran (Sidrat al-Muntaha), Ibn Battuta, Al-Tabari.',
    symbolicVirtuesFr: 'Purification rituelle majeure, rupture des énergies stagnantes, protection de l\'aura et paix.',
    symbolicVirtuesEn: 'Major ritual cleansing, breaking stagnant negative patterns, aura shielding, and peace.',
    symbolicVirtuesHa: 'Wankan tsarki na asiri, karyar asiri da kariya ga mutum.',
    traditionalUsesFr: 'Broyé dans de l\'eau coranisée pour le bain de purification (Ruqyah) et la toilette sacrée.',
    traditionalUsesEn: 'Crushed in blessed water for spiritual bathing (Ruqyah) and traditional purification wash.',
    traditionalUsesHa: 'Daka ganye bakwai a zuba a ruwan addu\'a don wanka da sha.'
  },
  {
    id: 'harmal',
    nameFr: 'Harmal / Rue Sauvage',
    nameEn: 'Syrian Rue (Peganum harmala)',
    nameHa: 'Harmal / Ismandal',
    botanicalName: 'Peganum harmala',
    arabicName: 'الحَرْمَل (Al-Harmal)',
    planetaryRuler: 'Mars / Saturne',
    element: 'Feu',
    type: 'Seed',
    historicalSources: 'Al-Antaki, Dioscoride, Textes perses d\'Avicenne.',
    symbolicVirtuesFr: 'Bouclier impénétrable contre les nuisances nocturnes, chasse les énergies perturbatrices.',
    symbolicVirtuesEn: 'Impenetrable shield against night disturbances, dispersing disruptive energies.',
    symbolicVirtuesHa: 'Kariya daga sharrin dare da jinnu, korar mugayen abubuwa.',
    traditionalUsesFr: 'Fumigation des seuils de maison au coucher du soleil pour sceller la demeure.',
    traditionalUsesEn: 'Fumigation of door thresholds at dusk to seal and protect household serenity.',
    traditionalUsesHa: 'Turara kofofin gida da yamma don kariya.'
  },
  {
    id: 'damask_rose',
    nameFr: 'Rose de Damas',
    nameEn: 'Damask Rose',
    nameHa: 'Furen Wardi / Ward',
    botanicalName: 'Rosa damascena',
    arabicName: 'الوَرْد الجُورِي (Al-Ward al-Jūrī)',
    planetaryRuler: 'Vénus (Az-Zuhrah)',
    element: 'Eau / Air',
    type: 'Flower',
    historicalSources: 'Ibn Sina (Distillation des essences florales), Al-Samarqandi.',
    symbolicVirtuesFr: 'Amour pur et compassion, douceur de vivre, élévation de l\'humeur et paix du cœur.',
    symbolicVirtuesEn: 'Pure love and compassion, sweetness of living, mood uplifting, and heartfelt serenity.',
    symbolicVirtuesHa: 'Soyayya mai tsarki, taushin zuciya, farin ciki da kwanciyar hankali.',
    traditionalUsesFr: 'Eau de rose pour l\'onction spirituelle, la préparation de l\'encre safranée et l\'apaisement.',
    traditionalUsesEn: 'Rose water used for spiritual anointing, saffron ink dilution, and heart calming.',
    traditionalUsesHa: 'Shafe fuska da ruwan wardi don haske, da hada shi a tawadar za\'afaran.'
  },
  {
    id: 'camphor',
    nameFr: 'Camphre pur',
    nameEn: 'Pure Camphor',
    nameHa: 'Kafur / Kafur mai haske',
    botanicalName: 'Cinnamomum camphora',
    arabicName: 'الكافُور (Al-Kāfūr)',
    planetaryRuler: 'Lune (Al-Qamar)',
    element: 'Eau / Éther',
    type: 'Resin',
    historicalSources: 'Coran (Sourate Al-Insan verset 5), Ibn Sina, Médecine ayurvédique.',
    symbolicVirtuesFr: 'Fraîcheur paradisiaque, clarté cristalline, chasteté des pensées et neutralisation des chaleurs morbides.',
    symbolicVirtuesEn: 'Paradisal coolness, crystalline clarity, mental chastity, and pacifying morbid heat.',
    symbolicVirtuesHa: 'Sanyi mai dadi, haske da tsarkin tunani, sanyaya zafin rai.',
    traditionalUsesFr: 'Préservateur et purificateur traditionnel, brûlé en infime quantité pour purifier l\'air.',
    traditionalUsesEn: 'Traditional purifying agent, burned in tiny amounts to freshen and clear heavy rooms.',
    traditionalUsesHa: 'Turare mai sanyi don kawar da zafi da tsarkake daki.'
  }
];

// Helper: Calculate Chinese Year and Animal based on Gregorian Year
export function calculateChineseAstrology(year: number, month = 1, day = 1) {
  // Approximate Lunar New Year adjustment (if before ~Feb 4, belongs to previous year)
  let effectiveYear = year;
  if (month === 1 || (month === 2 && day < 4)) {
    effectiveYear = year - 1;
  }

  const animals = [
    { nameFr: 'Rat', nameEn: 'Rat', nameHa: 'Bera', char: '鼠', icon: '🐭', branch: 'Zi (子)', elementFr: 'Eau', polarity: 'Yang' },
    { nameFr: 'Buffle / Bœuf', nameEn: 'Ox', nameHa: 'Sa', char: '牛', icon: '🐂', branch: 'Chou (丑)', elementFr: 'Terre', polarity: 'Yin' },
    { nameFr: 'Tigre', nameEn: 'Tiger', nameHa: 'Damo / Kura / Daji', char: '虎', icon: '🐅', branch: 'Yin (寅)', elementFr: 'Bois', polarity: 'Yang' },
    { nameFr: 'Lapin / Lièvre', nameEn: 'Rabbit', nameHa: 'Zomo', char: '兔', icon: '🐇', branch: 'Mao (卯)', elementFr: 'Bois', polarity: 'Yin' },
    { nameFr: 'Dragon', nameEn: 'Dragon', nameHa: 'Dodanniya / Dragon', char: '龙', icon: '🐉', branch: 'Chen (辰)', elementFr: 'Terre', polarity: 'Yang' },
    { nameFr: 'Serpent', nameEn: 'Snake', nameHa: 'Maciji', char: '蛇', icon: '🐍', branch: 'Si (巳)', elementFr: 'Feu', polarity: 'Yin' },
    { nameFr: 'Cheval', nameEn: 'Horse', nameHa: 'Doki', char: '马', icon: '🐎', branch: 'Wu (午)', elementFr: 'Feu', polarity: 'Yang' },
    { nameFr: 'Chèvre / Mouton', nameEn: 'Goat / Sheep', nameHa: 'Akwiya / Rago', char: '羊', icon: '🐐', branch: 'Wei (未)', elementFr: 'Terre', polarity: 'Yin' },
    { nameFr: 'Singe', nameEn: 'Monkey', nameHa: 'Biri', char: '猴', icon: '🐒', branch: 'Shen (申)', elementFr: 'Métal', polarity: 'Yang' },
    { nameFr: 'Coq', nameEn: 'Rooster', nameHa: 'Zakara', char: '鸡', icon: '🐓', branch: 'You (酉)', elementFr: 'Métal', polarity: 'Yin' },
    { nameFr: 'Chien', nameEn: 'Dog', nameHa: 'Kare', char: '狗', icon: '🐕', branch: 'Xu (戌)', elementFr: 'Terre', polarity: 'Yang' },
    { nameFr: 'Cochon / Sanglier', nameEn: 'Pig / Boar', nameHa: 'Alade / Daji', char: '猪', icon: '🐖', branch: 'Hai (亥)', elementFr: 'Eau', polarity: 'Yin' }
  ];

  const elementsWuXing = [
    { stem: 'Jia (甲)', nameFr: 'Bois', nameEn: 'Wood', nameHa: 'Itace', polarity: 'Yang', color: '#10b981' },
    { stem: 'Yi (乙)', nameFr: 'Bois', nameEn: 'Wood', nameHa: 'Itace', polarity: 'Yin', color: '#10b981' },
    { stem: 'Bing (丙)', nameFr: 'Feu', nameEn: 'Fire', nameHa: 'Wuta', polarity: 'Yang', color: '#ef4444' },
    { stem: 'Ding (丁)', nameFr: 'Feu', nameEn: 'Fire', nameHa: 'Wuta', polarity: 'Yin', color: '#ef4444' },
    { stem: 'Wu (戊)', nameFr: 'Terre', nameEn: 'Earth', nameHa: 'Kasa', polarity: 'Yang', color: '#f59e0b' },
    { stem: 'Ji (己)', nameFr: 'Terre', nameEn: 'Earth', nameHa: 'Kasa', polarity: 'Yin', color: '#f59e0b' },
    { stem: 'Geng (庚)', nameFr: 'Métal', nameEn: 'Metal', nameHa: 'Karfe', polarity: 'Yang', color: '#94a3b8' },
    { stem: 'Xin (辛)', nameFr: 'Métal', nameEn: 'Metal', nameHa: 'Karfe', polarity: 'Yin', color: '#94a3b8' },
    { stem: 'Ren (壬)', nameFr: 'Eau', nameEn: 'Water', nameHa: 'Ruwa', polarity: 'Yang', color: '#38bdf8' },
    { stem: 'Gui (癸)', nameFr: 'Eau', nameEn: 'Water', nameHa: 'Ruwa', polarity: 'Yin', color: '#38bdf8' }
  ];

  // 1984 is Year of the Wood Rat (Base 0 in 60-year sexagenary cycle)
  const offset = effectiveYear - 1984;
  const cycleIndex = ((offset % 60) + 60) % 60;
  const animalIndex = ((effectiveYear - 4) % 12 + 12) % 12;
  const stemIndex = ((effectiveYear - 4) % 10 + 10) % 10;

  const animal = animals[animalIndex];
  const element = elementsWuXing[stemIndex];

  return {
    effectiveYear,
    cycleIndex: cycleIndex + 1,
    animal,
    element,
    yinYang: element.polarity
  };
}

// Helper: Calculate Feng Shui Kua Number & 8 Directions
export function calculateFengShuiKua(birthYear: number, gender: 'male' | 'female', birthMonth = 1, birthDay = 1) {
  // Adjust for Solar New Year (~Feb 4th)
  let solarYear = birthYear;
  if (birthMonth === 1 || (birthMonth === 2 && birthDay < 4)) {
    solarYear -= 1;
  }

  // Sum digits of year until single digit
  const sumDigits = (n: number): number => {
    let sum = String(n).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    while (sum > 9) {
      sum = String(sum).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    }
    return sum;
  };

  let kua = 0;
  const digitSum = sumDigits(solarYear);

  if (solarYear < 2000) {
    if (gender === 'male') {
      kua = 10 - digitSum;
    } else {
      kua = digitSum + 5;
    }
  } else {
    // 2000 and after
    if (gender === 'male') {
      kua = 9 - digitSum;
      if (kua === 0) kua = 9;
    } else {
      kua = digitSum + 6;
    }
  }

  while (kua > 9) {
    kua = String(kua).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }

  // Kua 5 conversion: Male -> 2 (Kun), Female -> 8 (Gen)
  if (kua === 5) {
    kua = gender === 'male' ? 2 : 8;
  }

  const kuaProfiles: Record<number, {
    trigram: string;
    trigramChinese: string;
    elementFr: string;
    elementEn: string;
    elementHa: string;
    group: 'Est' | 'Ouest';
    favorableFr: { shengQi: string; tianYi: string; yanNian: string; fuWei: string };
    favorableEn: { shengQi: string; tianYi: string; yanNian: string; fuWei: string };
    favorableHa: { shengQi: string; tianYi: string; yanNian: string; fuWei: string };
    unfavorableFr: { huoHai: string; wuGui: string; liuSha: string; jueMing: string };
    unfavorableEn: { huoHai: string; wuGui: string; liuSha: string; jueMing: string };
    unfavorableHa: { huoHai: string; wuGui: string; liuSha: string; jueMing: string };
  }> = {
    1: {
      trigram: 'Kan (L\'Eau)',
      trigramChinese: '坎',
      elementFr: 'Eau',
      elementEn: 'Water',
      elementHa: 'Ruwa',
      group: 'Est',
      favorableFr: { shengQi: 'Sud-Est (Prospérité)', tianYi: 'Est (Santé)', yanNian: 'Sud (Relations)', fuWei: 'Nord (Sérénité)' },
      favorableEn: { shengQi: 'South-East (Prosperity)', tianYi: 'East (Health)', yanNian: 'South (Love & Relationships)', fuWei: 'North (Peace)' },
      favorableHa: { shengQi: 'Kudu-Gabas (Arziki)', tianYi: 'Gabas (Lafiya)', yanNian: 'Kudu (Zamantakewa)', fuWei: 'Arewa (Natsuwa)' },
      unfavorableFr: { huoHai: 'Ouest (Tracas)', wuGui: 'Nord-Est (Conflits)', liuSha: 'Nord-Ouest (Trahison)', jueMing: 'Sud-Ouest (Pertes)' },
      unfavorableEn: { huoHai: 'West (Mishaps)', wuGui: 'North-East (Five Ghosts)', liuSha: 'North-West (Six Killings)', jueMing: 'South-West (Total Loss)' },
      unfavorableHa: { huoHai: 'Yamma (Matsaloli)', wuGui: 'Arewa-Gabas (Fada)', liuSha: 'Arewa-Yamma (Zamba)', jueMing: 'Kudu-Yamma (Rashi)' }
    },
    2: {
      trigram: 'Kun (La Terre Mère)',
      trigramChinese: '坤',
      elementFr: 'Terre',
      elementEn: 'Earth',
      elementHa: 'Kasa',
      group: 'Ouest',
      favorableFr: { shengQi: 'Nord-Est (Prospérité)', tianYi: 'Ouest (Santé)', yanNian: 'Nord-Ouest (Relations)', fuWei: 'Sud-Ouest (Sérénité)' },
      favorableEn: { shengQi: 'North-East (Prosperity)', tianYi: 'West (Health)', yanNian: 'North-West (Relationships)', fuWei: 'South-West (Peace)' },
      favorableHa: { shengQi: 'Arewa-Gabas (Arziki)', tianYi: 'Yamma (Lafiya)', yanNian: 'Arewa-Yamma (Zamantakewa)', fuWei: 'Kudu-Yamma (Natsuwa)' },
      unfavorableFr: { huoHai: 'Est (Tracas)', wuGui: 'Sud-Est (Conflits)', liuSha: 'Sud (Trahison)', jueMing: 'Nord (Pertes)' },
      unfavorableEn: { huoHai: 'East (Mishaps)', wuGui: 'South-East (Five Ghosts)', liuSha: 'South (Six Killings)', jueMing: 'North (Total Loss)' },
      unfavorableHa: { huoHai: 'Gabas (Matsaloli)', wuGui: 'Kudu-Gabas (Fada)', liuSha: 'Kudu (Zamba)', jueMing: 'Arewa (Rashi)' }
    },
    3: {
      trigram: 'Zhen (Le Tonnerre)',
      trigramChinese: '震',
      elementFr: 'Bois',
      elementEn: 'Wood',
      elementHa: 'Itace',
      group: 'Est',
      favorableFr: { shengQi: 'Sud (Prospérité)', tianYi: 'Nord (Santé)', yanNian: 'Sud-Est (Relations)', fuWei: 'Est (Sérénité)' },
      favorableEn: { shengQi: 'South (Prosperity)', tianYi: 'North (Health)', yanNian: 'South-East (Relationships)', fuWei: 'East (Peace)' },
      favorableHa: { shengQi: 'Kudu (Arziki)', tianYi: 'Arewa (Lafiya)', yanNian: 'Kudu-Gabas (Zamantakewa)', fuWei: 'Gabas (Natsuwa)' },
      unfavorableFr: { huoHai: 'Sud-Ouest (Tracas)', wuGui: 'Nord-Ouest (Conflits)', liuSha: 'Nord-Est (Trahison)', jueMing: 'Ouest (Pertes)' },
      unfavorableEn: { huoHai: 'South-West (Mishaps)', wuGui: 'North-West (Five Ghosts)', liuSha: 'North-East (Six Killings)', jueMing: 'West (Total Loss)' },
      unfavorableHa: { huoHai: 'Kudu-Yamma (Matsaloli)', wuGui: 'Arewa-Yamma (Fada)', liuSha: 'Arewa-Gabas (Zamba)', jueMing: 'Yamma (Rashi)' }
    },
    4: {
      trigram: 'Xun (Le Vent)',
      trigramChinese: '巽',
      elementFr: 'Bois',
      elementEn: 'Wood',
      elementHa: 'Itace',
      group: 'Est',
      favorableFr: { shengQi: 'Nord (Prospérité)', tianYi: 'Sud (Santé)', yanNian: 'Est (Relations)', fuWei: 'Sud-Est (Sérénité)' },
      favorableEn: { shengQi: 'North (Prosperity)', tianYi: 'South (Health)', yanNian: 'East (Relationships)', fuWei: 'South-East (Peace)' },
      favorableHa: { shengQi: 'Arewa (Arziki)', tianYi: 'Kudu (Lafiya)', yanNian: 'Gabas (Zamantakewa)', fuWei: 'Kudu-Gabas (Natsuwa)' },
      unfavorableFr: { huoHai: 'Nord-Ouest (Tracas)', wuGui: 'Sud-Ouest (Conflits)', liuSha: 'Ouest (Trahison)', jueMing: 'Nord-Est (Pertes)' },
      unfavorableEn: { huoHai: 'North-West (Mishaps)', wuGui: 'South-West (Five Ghosts)', liuSha: 'West (Six Killings)', jueMing: 'North-East (Total Loss)' },
      unfavorableHa: { huoHai: 'Arewa-Yamma (Matsaloli)', wuGui: 'Kudu-Yamma (Fada)', liuSha: 'Yamma (Zamba)', jueMing: 'Arewa-Gabas (Rashi)' }
    },
    6: {
      trigram: 'Qian (Le Ciel)',
      trigramChinese: '乾',
      elementFr: 'Métal',
      elementEn: 'Metal',
      elementHa: 'Karfe',
      group: 'Ouest',
      favorableFr: { shengQi: 'Ouest (Prospérité)', tianYi: 'Nord-Est (Santé)', yanNian: 'Sud-Ouest (Relations)', fuWei: 'Nord-Ouest (Sérénité)' },
      favorableEn: { shengQi: 'West (Prosperity)', tianYi: 'North-East (Health)', yanNian: 'South-West (Relationships)', fuWei: 'North-West (Peace)' },
      favorableHa: { shengQi: 'Yamma (Arziki)', tianYi: 'Arewa-Gabas (Lafiya)', yanNian: 'Kudu-Yamma (Zamantakewa)', fuWei: 'Arewa-Yamma (Natsuwa)' },
      unfavorableFr: { huoHai: 'Sud-Est (Tracas)', wuGui: 'Est (Conflits)', liuSha: 'Nord (Trahison)', jueMing: 'Sud (Pertes)' },
      unfavorableEn: { huoHai: 'South-East (Mishaps)', wuGui: 'East (Five Ghosts)', liuSha: 'North (Six Killings)', jueMing: 'South (Total Loss)' },
      unfavorableHa: { huoHai: 'Kudu-Gabas (Matsaloli)', wuGui: 'Gabas (Fada)', liuSha: 'Arewa (Zamba)', jueMing: 'Kudu (Rashi)' }
    },
    7: {
      trigram: 'Dui (Le Lac)',
      trigramChinese: '兌',
      elementFr: 'Métal',
      elementEn: 'Metal',
      elementHa: 'Karfe',
      group: 'Ouest',
      favorableFr: { shengQi: 'Nord-Ouest (Prospérité)', tianYi: 'Sud-Ouest (Santé)', yanNian: 'Nord-Est (Relations)', fuWei: 'Ouest (Sérénité)' },
      favorableEn: { shengQi: 'North-West (Prosperity)', tianYi: 'South-West (Health)', yanNian: 'North-East (Relationships)', fuWei: 'West (Peace)' },
      favorableHa: { shengQi: 'Arewa-Yamma (Arziki)', tianYi: 'Kudu-Yamma (Lafiya)', yanNian: 'Arewa-Gabas (Zamantakewa)', fuWei: 'Yamma (Natsuwa)' },
      unfavorableFr: { huoHai: 'Nord (Tracas)', wuGui: 'Sud (Conflits)', liuSha: 'Sud-Est (Trahison)', jueMing: 'Est (Pertes)' },
      unfavorableEn: { huoHai: 'North (Mishaps)', wuGui: 'South (Five Ghosts)', liuSha: 'South-East (Six Killings)', jueMing: 'East (Total Loss)' },
      unfavorableHa: { huoHai: 'Arewa (Matsaloli)', wuGui: 'Kudu (Fada)', liuSha: 'Kudu-Gabas (Zamba)', jueMing: 'Gabas (Rashi)' }
    },
    8: {
      trigram: 'Gen (La Montagne)',
      trigramChinese: '艮',
      elementFr: 'Terre',
      elementEn: 'Earth',
      elementHa: 'Kasa',
      group: 'Ouest',
      favorableFr: { shengQi: 'Sud-Ouest (Prospérité)', tianYi: 'Nord-Ouest (Santé)', yanNian: 'Ouest (Relations)', fuWei: 'Nord-Est (Sérénité)' },
      favorableEn: { shengQi: 'South-West (Prosperity)', tianYi: 'North-West (Health)', yanNian: 'West (Relationships)', fuWei: 'North-East (Peace)' },
      favorableHa: { shengQi: 'Kudu-Yamma (Arziki)', tianYi: 'Arewa-Yamma (Lafiya)', yanNian: 'Yamma (Zamantakewa)', fuWei: 'Arewa-Gabas (Natsuwa)' },
      unfavorableFr: { huoHai: 'Sud (Tracas)', wuGui: 'Nord (Conflits)', liuSha: 'Est (Trahison)', jueMing: 'Sud-Est (Pertes)' },
      unfavorableEn: { huoHai: 'South (Mishaps)', wuGui: 'North (Five Ghosts)', liuSha: 'East (Six Killings)', jueMing: 'South-East (Total Loss)' },
      unfavorableHa: { huoHai: 'Kudu (Matsaloli)', wuGui: 'Arewa (Fada)', liuSha: 'Gabas (Zamba)', jueMing: 'Kudu-Gabas (Rashi)' }
    },
    9: {
      trigram: 'Li (Le Feu)',
      trigramChinese: '離',
      elementFr: 'Feu',
      elementEn: 'Fire',
      elementHa: 'Wuta',
      group: 'Est',
      favorableFr: { shengQi: 'Est (Prospérité)', tianYi: 'Sud-Est (Santé)', yanNian: 'Nord (Relations)', fuWei: 'Sud (Sérénité)' },
      favorableEn: { shengQi: 'East (Prosperity)', tianYi: 'South-East (Health)', yanNian: 'North (Relationships)', fuWei: 'South (Peace)' },
      favorableHa: { shengQi: 'Gabas (Arziki)', tianYi: 'Kudu-Gabas (Lafiya)', yanNian: 'Arewa (Zamantakewa)', fuWei: 'Kudu (Natsuwa)' },
      unfavorableFr: { huoHai: 'Nord-Est (Tracas)', wuGui: 'Ouest (Conflits)', liuSha: 'Sud-Ouest (Trahison)', jueMing: 'Nord-Ouest (Pertes)' },
      unfavorableEn: { huoHai: 'North-East (Mishaps)', wuGui: 'West (Five Ghosts)', liuSha: 'South-West (Six Killings)', jueMing: 'North-West (Total Loss)' },
      unfavorableHa: { huoHai: 'Arewa-Gabas (Matsaloli)', wuGui: 'Yamma (Fada)', liuSha: 'Kudu-Yamma (Zamba)', jueMing: 'Arewa-Yamma (Rashi)' }
    }
  };

  return {
    kua,
    profile: kuaProfiles[kua] || kuaProfiles[1]
  };
}

// 8 Mansions Ba Gua Sectors
export const BAGUA_SECTORS = [
  { id: 'north', nameFr: 'Nord', nameEn: 'North', nameHa: 'Arewa', elementFr: 'Eau', lifeAreaFr: 'Carrière & Chemin de Vie', lifeAreaEn: 'Career & Life Path', lifeAreaHa: 'Aiki da Makoma', colorHex: '#0284c7', adviceFr: 'Activer avec fontaines d\'eau, miroirs, teintes sombres et formes ondulées.' },
  { id: 'northeast', nameFr: 'Nord-Est', nameEn: 'North-East', nameHa: 'Arewa-Gabas', elementFr: 'Terre', lifeAreaFr: 'Sagesse, Connaissance & Études', lifeAreaEn: 'Wisdom, Knowledge & Education', lifeAreaHa: 'Hikima da Neman Ilimi', colorHex: '#d97706', adviceFr: 'Idéal pour bureau, bibliothèque, cristaux de quartz et lampes de sel.' },
  { id: 'east', nameFr: 'Est', nameEn: 'East', nameHa: 'Gabas', elementFr: 'Bois', lifeAreaFr: 'Santé, Famille & Ancêtres', lifeAreaEn: 'Health, Family & Ancestors', lifeAreaHa: 'Lafiya da Iyali', colorHex: '#16a34a', adviceFr: 'Plantes vertes vivaces, mobilier en bois et lumière matinale.' },
  { id: 'southeast', nameFr: 'Sud-Est', nameEn: 'South-East', nameHa: 'Kudu-Gabas', elementFr: 'Bois', lifeAreaFr: 'Richesse, Abondance & Prospérité', lifeAreaEn: 'Wealth, Abundance & Prosperity', lifeAreaHa: 'Arziki da Wadatar Kudi', colorHex: '#059669', adviceFr: 'Plante de jade, tirelire, symboles de prospérité et carillons doux.' },
  { id: 'south', nameFr: 'Sud', nameEn: 'South', nameHa: 'Kudu', elementFr: 'Feu', lifeAreaFr: 'Renommée, Réputation & Rayonnement', lifeAreaEn: 'Fame, Reputation & Radiance', lifeAreaHa: 'Kwarjini da Shahara', colorHex: '#dc2626', adviceFr: 'Bougies, lampes chaleureuses, diplômes et teintes rougeoyantes.' },
  { id: 'southwest', nameFr: 'Sud-Ouest', nameEn: 'South-West', nameHa: 'Kudu-Yamma', elementFr: 'Terre', lifeAreaFr: 'Amour, Relations & Mariage', lifeAreaEn: 'Love, Relationships & Marriage', lifeAreaHa: 'Soyayya da Aure', colorHex: '#ec4899', adviceFr: 'Objets par paires, quartz rose, bougies parfumées et couleurs douces.' },
  { id: 'west', nameFr: 'Ouest', nameEn: 'West', nameHa: 'Yamma', elementFr: 'Métal', lifeAreaFr: 'Créativité, Projets & Enfants', lifeAreaEn: 'Creativity, Projects & Children', lifeAreaHa: 'Fasaha da Yara', colorHex: '#64748b', adviceFr: 'Objets métalliques, tableaux créatifs, couleurs blanches et pastel.' },
  { id: 'northwest', nameFr: 'Nord-Ouest', nameEn: 'North-West', nameHa: 'Arewa-Yamma', elementFr: 'Métal', lifeAreaFr: 'Bienfaiteurs, Mentorat & Voyages', lifeAreaEn: 'Helpful People, Mentors & Travel', lifeAreaHa: 'Mataimaka da Tafiye-tafiye', colorHex: '#475569', adviceFr: 'Cartes du monde, cloches tibétaines, symboles de protection spirituelle.' },
  { id: 'center', nameFr: 'Centre (Tai Ji)', nameEn: 'Center (Tai Ji)', nameHa: 'Tsakiya (Tai Ji)', elementFr: 'Terre', lifeAreaFr: 'Équilibre Global, Harmonie & Unité', lifeAreaEn: 'Overall Balance, Harmony & Wholeness', lifeAreaHa: 'Daidaito da Zaman Lafiya', colorHex: '#eab308', adviceFr: 'Maintenir propre et dégagé de tout encombrement; point de circulation du Chi.' }
];

// Helper: Tasyir (Arabic Symbolic Primary Progression: 1 Degree = 1 Year)
export function calculateTasyirProgression(natalAscDegree: number, ageYears: number) {
  const progressedDegree = (natalAscDegree + ageYears) % 360;
  const signs = [
    { nameFr: 'Bélier', nameEn: 'Aries', nameHa: 'Bélier', ruler: 'Mars', element: 'Feu' },
    { nameFr: 'Taureau', nameEn: 'Taurus', nameHa: 'Taureau', ruler: 'Vénus', element: 'Terre' },
    { nameFr: 'Gémeaux', nameEn: 'Gemini', nameHa: 'Gémeaux', ruler: 'Mercure', element: 'Air' },
    { nameFr: 'Cancer', nameEn: 'Cancer', nameHa: 'Cancer', ruler: 'Lune', element: 'Eau' },
    { nameFr: 'Lion', nameEn: 'Leo', nameHa: 'Lion', ruler: 'Soleil', element: 'Feu' },
    { nameFr: 'Vierge', nameEn: 'Virgo', nameHa: 'Vierge', ruler: 'Mercure', element: 'Terre' },
    { nameFr: 'Balance', nameEn: 'Libra', nameHa: 'Balance', ruler: 'Vénus', element: 'Air' },
    { nameFr: 'Scorpion', nameEn: 'Scorpio', nameHa: 'Scorpion', ruler: 'Mars', element: 'Eau' },
    { nameFr: 'Sagittaire', nameEn: 'Sagittarius', nameHa: 'Sagittaire', ruler: 'Jupiter', element: 'Feu' },
    { nameFr: 'Capricorne', nameEn: 'Capricorn', nameHa: 'Capricorne', ruler: 'Saturne', element: 'Terre' },
    { nameFr: 'Verseau', nameEn: 'Aquarius', nameHa: 'Verseau', ruler: 'Saturne', element: 'Air' },
    { nameFr: 'Poissons', nameEn: 'Pisces', nameHa: 'Poissons', ruler: 'Jupiter', element: 'Eau' }
  ];

  const signIndex = Math.floor(progressedDegree / 30);
  const degreeInSign = progressedDegree % 30;
  const sign = signs[signIndex] || signs[0];

  // Critical Degrees (Darajat al-Khatar) in traditional Arabic Astrology
  const isCritical = [0, 13, 26].includes(Math.floor(degreeInSign));

  return {
    progressedDegree: progressedDegree.toFixed(2),
    degreeInSign: degreeInSign.toFixed(2),
    sign,
    isCritical,
    symbolicCycle: Math.floor(progressedDegree / 360) + 1,
    distributionRuler: sign.ruler
  };
}

// Helper: Zodiacs Comparative Analysis
export function getComparativeZodiacInfo(birthDateStr: string) {
  const date = new Date(birthDateStr);
  if (isNaN(date.getTime())) return null;

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  // 1. Tropical Sun Sign (Western)
  const tropicalSigns = [
    { signFr: 'Capricorne', signEn: 'Capricorn', signHa: 'Capricorne', startM: 12, startD: 22, endM: 1, endD: 19, element: 'Terre', ruler: 'Saturne' },
    { signFr: 'Verseau', signEn: 'Aquarius', signHa: 'Verseau', startM: 1, startD: 20, endM: 2, endD: 18, element: 'Air', ruler: 'Saturne / Uranus' },
    { signFr: 'Poissons', signEn: 'Pisces', signHa: 'Poissons', startM: 2, startD: 19, endM: 3, endD: 20, element: 'Eau', ruler: 'Jupiter / Neptune' },
    { signFr: 'Bélier', signEn: 'Aries', signHa: 'Bélier', startM: 3, startD: 21, endM: 4, endD: 19, element: 'Feu', ruler: 'Mars' },
    { signFr: 'Taureau', signEn: 'Taurus', signHa: 'Taureau', startM: 4, startD: 20, endM: 5, endD: 20, element: 'Terre', ruler: 'Vénus' },
    { signFr: 'Gémeaux', signEn: 'Gemini', signHa: 'Gémeaux', startM: 5, startD: 21, endM: 6, endD: 20, element: 'Air', ruler: 'Mercure' },
    { signFr: 'Cancer', signEn: 'Cancer', signHa: 'Cancer', startM: 6, startD: 21, endM: 7, endD: 22, element: 'Eau', ruler: 'Lune' },
    { signFr: 'Lion', signEn: 'Leo', signHa: 'Lion', startM: 7, startD: 23, endM: 8, endD: 22, element: 'Feu', ruler: 'Soleil' },
    { signFr: 'Vierge', signEn: 'Virgo', signHa: 'Vierge', startM: 8, startD: 23, endM: 9, endD: 22, element: 'Terre', ruler: 'Mercure' },
    { signFr: 'Balance', signEn: 'Libra', signHa: 'Balance', startM: 9, startD: 23, endM: 10, endD: 22, element: 'Air', ruler: 'Vénus' },
    { signFr: 'Scorpion', signEn: 'Scorpio', signHa: 'Scorpion', startM: 10, startD: 23, endM: 11, endD: 21, element: 'Eau', ruler: 'Mars / Pluton' },
    { signFr: 'Sagittaire', signEn: 'Sagittarius', signHa: 'Sagittaire', startM: 11, startD: 22, endM: 12, endD: 21, element: 'Feu', ruler: 'Jupiter' }
  ];

  let tropical = tropicalSigns[0];
  for (const s of tropicalSigns) {
    if (
      (month === s.startM && day >= s.startD) ||
      (month === s.endM && day <= s.endD)
    ) {
      tropical = s;
      break;
    }
  }

  // 2. Sidereal / Vedic Sign (Lahiri Ayanamsha offset approx ~24 degrees, ~21-24 days later)
  const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const siderealDeg = ((dayOfYear - 79 - 24 + 360) % 360);
  const siderealIndex = Math.floor(siderealDeg / 30);
  const nakshatraIndex = Math.floor((siderealDeg / 360) * 27);
  const nakshatra = NAKSHATRAS_LIST[nakshatraIndex] || NAKSHATRAS_LIST[0];

  // 3. Chinese Astrology
  const chinese = calculateChineseAstrology(year, month, day);

  return {
    tropical,
    siderealDeg: siderealDeg.toFixed(1),
    nakshatra,
    chinese
  };
}
