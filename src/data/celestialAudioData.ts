export type Language = 'fr' | 'en' | 'ha';

export interface SacredFrequency {
  freq: number;
  label: string;
  name: string;
  planet: string;
  planetSymbol: string;
  arabicName: string;
  description: string;
  celestialDetails: string;
  lunarPhaseMatch: string;
  spiritualEffect: string;
  color: string;
  badgeBg: string;
}

export interface PlanetaryInfo {
  dayName: string;
  dayIndex: number;
  planetName: string;
  arabicName: string;
  symbol: string;
  recommendedFreq: number;
  angelRuler: string;
  element: string;
  spiritualFocus: string;
  description: string;
}

export interface LunarInfo {
  ageDays: number;
  illumination: number;
  phaseName: string;
  arabicPhase: string;
  recommendedFreq: number;
  description: string;
  icon: string;
}

interface MultiLangFrequencyData {
  freq: number;
  label: string;
  planetSymbol: string;
  arabicName: string;
  color: string;
  badgeBg: string;
  fr: {
    name: string;
    planet: string;
    description: string;
    celestialDetails: string;
    lunarPhaseMatch: string;
    spiritualEffect: string;
  };
  en: {
    name: string;
    planet: string;
    description: string;
    celestialDetails: string;
    lunarPhaseMatch: string;
    spiritualEffect: string;
  };
  ha: {
    name: string;
    planet: string;
    description: string;
    celestialDetails: string;
    lunarPhaseMatch: string;
    spiritualEffect: string;
  };
}

const RAW_FREQUENCIES_DATA: MultiLangFrequencyData[] = [
  {
    freq: 174,
    label: "174 Hz",
    planetSymbol: "⊕",
    arabicName: "As-Sakinah (La Sérénité)",
    color: "from-amber-700 to-stone-900",
    badgeBg: "bg-amber-900/30 text-amber-300 border-amber-700/50",
    fr: {
      name: "Ancrage Terrestre & Apaisement",
      planet: "Terre / Fondations",
      description: "Fréquence fondamentale de soulagement et d'ancrage physique. Elle crée un sentiment de sécurité et de chaleur.",
      celestialDetails: "Harmonise les énergies physiques avec le centre de gravité terrestre. Élimine les tensions musculaires et calme le système nerveux lors du Dhikr initial.",
      lunarPhaseMatch: "Nouvelle Lune (Al-Muhaq)",
      spiritualEffect: "Soulagement des douleurs, sécurité émotionnelle et fondation du temple corporel."
    },
    en: {
      name: "Earth Grounding & Healing",
      planet: "Earth / Foundations",
      description: "Fundamental frequency for physical relief and grounding. Creates a sense of safety and warmth.",
      celestialDetails: "Harmonizes physical energy with Earth's center of gravity. Relieves muscle tension and calms the nervous system during initial Dhikr.",
      lunarPhaseMatch: "New Moon (Al-Muhaq)",
      spiritualEffect: "Pain relief, emotional security, and foundation of the physical vessel."
    },
    ha: {
      name: "Natsuwa da Jin Dadin Qasa",
      planet: "Duniya / Tushiya",
      description: "Sauraron sautin tushe wanda ke kawo natsuwa da sauki a jiki. Yana samar da kwanciyar hankali da aminci.",
      celestialDetails: "Yana daidaita karfin jiki da tsakiyar duniya. Yana cire damuwar tsoka da kwantar da hankali yayin Dhikr na farko.",
      lunarPhaseMatch: "Watan Kamawa (Al-Muhaq)",
      spiritualEffect: "Rage radadi na jiki, tsaro na zuciya da kariya ga jiki."
    }
  },
  {
    freq: 285,
    label: "285 Hz",
    planetSymbol: "✧",
    arabicName: "Al-'Afiya (La Guérison)",
    color: "from-orange-600 to-amber-800",
    badgeBg: "bg-orange-900/30 text-orange-300 border-orange-700/50",
    fr: {
      name: "Régénération & Restauration de l'Aura",
      planet: "Éthère / Matrice",
      description: "Intervient sur le champ bio-énergétique et éthérique pour réparer les empreintes d'épuisement et restaurer le fluide vital.",
      celestialDetails: "Restructure le champ aurique en alignant les fréquences cellulaires avec l'énergie de croissance des constellations.",
      lunarPhaseMatch: "Premier Croissant (Al-Hilal)",
      spiritualEffect: "Restauration des tissus subtils, dynamisation de l'énergie vitale et clarté intentionnelle."
    },
    en: {
      name: "Cellular Regeneration & Aura Restoration",
      planet: "Ether / Matrix",
      description: "Acts on the bio-energetic and etheric field to repair exhaustion marks and restore vital fluid.",
      celestialDetails: "Restructures the auric field by aligning cellular frequencies with constellation growth energy.",
      lunarPhaseMatch: "First Crescent (Al-Hilal)",
      spiritualEffect: "Restoration of subtle tissues, vital energy boost, and intentional clarity."
    },
    ha: {
      name: "Maimaitawa da Sabunta Aura",
      planet: "Sammai / Ginshiki",
      description: "Yana gyara karfin jiki da kariya daga gajiya, yana dawo da karfin rai.",
      celestialDetails: "Yana tsara lafiyar sel na jiki tare da karfin taurari a sama da girmar jinjirin wata.",
      lunarPhaseMatch: "Jinjirin Wata (Al-Hilal)",
      spiritualEffect: "Sabunta karfin jiki, karfafa kuzari da bayyanar kyakkyawar niyya."
    }
  },
  {
    freq: 396,
    label: "396 Hz",
    planetSymbol: "♄",
    arabicName: "Zuhal - As-Sabr (La Patience & Protection)",
    color: "from-zinc-700 to-slate-900",
    badgeBg: "bg-slate-800/40 text-slate-300 border-slate-600/50",
    fr: {
      name: "Dissolution de la Peur & Stabilité",
      planet: "Saturne",
      description: "Élimine les sentiments de culpabilité, la peur et l'anxiété. Transforme le doute en une foi inébranlable.",
      celestialDetails: "Correspond à la sphère de Saturne (Zuhal), gardienne des portes du temps. La vibration 396Hz brise les structures énergétiques denses.",
      lunarPhaseMatch: "Dernier Croissant & Lune Noire",
      spiritualEffect: "Libération des phobies, renforcement de la fermeté spirituelle et dissolution du mauvais œil."
    },
    en: {
      name: "Dissolution of Fear & Stability",
      planet: "Saturn",
      description: "Eliminates guilt, fear, and anxiety. Transforms doubt into unwavering faith.",
      celestialDetails: "Corresponds to Saturn's sphere (Zuhal), guardian of time. 396Hz breaks dense energy structures.",
      lunarPhaseMatch: "Waning Crescent & Dark Moon",
      spiritualEffect: "Release of phobias, spiritual steadfastness, and dissolution of evil eye."
    },
    ha: {
      name: "Kauyar da Tsoro da Tabbata",
      planet: "Saturn (Zuhal)",
      description: "Yana goge damuwa, tsoro da laifi. Yana maida kokanto zuwa imani mai karfi.",
      celestialDetails: "Yana dace da tauraron Zuhal, mai tsaron kofofin lokaci. Yana karya nauyin damuwa.",
      lunarPhaseMatch: "Karshen Jinjiri & Watan Duhu",
      spiritualEffect: "Yanci daga tsoro, karfafa imani da kariya daga sharrin ido."
    }
  },
  {
    freq: 417,
    label: "417 Hz",
    planetSymbol: "♂",
    arabicName: "Al-Mirrikh - Al-Fath (L'Ouverture)",
    color: "from-rose-600 to-red-900",
    badgeBg: "bg-rose-900/30 text-rose-300 border-rose-700/50",
    fr: {
      name: "Transmutation & Renouveau Spirituel",
      planet: "Mars",
      description: "Fréquence du changement positif. Nettoie les expériences négatives et facilite le pardon et le renouveau.",
      celestialDetails: "Sous l'égide de Mars (Al-Mirrikh), cette onde rompt la stagnation et libère l'énergie de l'action sainte.",
      lunarPhaseMatch: "Premier Quartier",
      spiritualEffect: "Transmutation des mauvaises habitudes, clarté décisionnelle et courage dans le cheminement."
    },
    en: {
      name: "Transmutation & Spiritual Renewal",
      planet: "Mars",
      description: "Frequency of positive change. Clears negative experiences and facilitates forgiveness and renewal.",
      celestialDetails: "Under Mars (Al-Mirrikh), breaks stagnation and releases holy action energy.",
      lunarPhaseMatch: "First Quarter",
      spiritualEffect: "Transmutation of bad habits, decisive clarity, and courage on the spiritual path."
    },
    ha: {
      name: "Canji da Sabuntawar Ruhu",
      planet: "Mars (Al-Mirrikh)",
      description: "Sautin canji mai kyau. Yana wanke bakin ciki da saukaka gafarawa.",
      celestialDetails: "A karkashin tauraron Al-Mirrikh, yana karya sakaci da bude karfin gudanar da aiki.",
      lunarPhaseMatch: "Tsakiyar Jinjiri",
      spiritualEffect: "Gyara dabi'u marasa kyau, hasken shawara da karfin gwiwa a tafiya."
    }
  },
  {
    freq: 432,
    label: "432 Hz",
    planetSymbol: "☽",
    arabicName: "Al-Qamar - Al-Mizan (L'Équilibre Universel)",
    color: "from-amber-500 to-yellow-600",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    fr: {
      name: "Résonance Cosmique de la Lune & Terre",
      planet: "Lune & Terre",
      description: "Accordage naturel de l'Univers. Elle fait vibrer l'eau du corps (70%) en parfaite cohérence avec les marées célestes.",
      celestialDetails: "432 Hz est le multiple sacré des fréquences orbitales de la Lune et de la fréquence de Schumann (8Hz x 54). C'est la note sacrée qui apaise immédiatement l'esprit.",
      lunarPhaseMatch: "Toutes les phases de la Lune",
      spiritualEffect: "Ralentissement des ondes cérébrales, réduction du cortisol, harmonie du rythme cardiaque et paix profonde."
    },
    en: {
      name: "Cosmic Resonance of Moon & Earth",
      planet: "Moon & Earth",
      description: "Natural tuning of the Universe. Vibrates cellular water (70%) in harmony with celestial tides.",
      celestialDetails: "432 Hz is a sacred multiple of Moon orbital frequencies and Schumann resonance (8Hz x 54). Natural sacred note for peace during Dhikr.",
      lunarPhaseMatch: "All Lunar Phases",
      spiritualEffect: "Brainwave calming, cortisol reduction, heart rate harmony, and deep peace."
    },
    ha: {
      name: "Amon Sararin Samaniya da Watan Duniya",
      planet: "Wata & Duniya",
      description: "Sautin daidaito na halitta. Yana girgiza ruwan jiki (70%) tare da tsarin sama.",
      celestialDetails: "432 Hz shine ninkin sautin Duniya da Wata (8Hz x 54). Sautin aminci ne da ke kwantar da hankali yayin Dhikr.",
      lunarPhaseMatch: "Dukkanin Sassan Wata",
      spiritualEffect: "Saukar da hauhawar tunani, rage damuwa, daidaita bugun zuciya da kwanciyar hankali."
    }
  },
  {
    freq: 528,
    label: "528 Hz",
    planetSymbol: "☉",
    arabicName: "Ash-Shams - An-Nur (La Lumière Divine)",
    color: "from-emerald-500 to-teal-700",
    badgeBg: "bg-emerald-900/30 text-emerald-300 border-emerald-700/50",
    fr: {
      name: "Onde Solaire & Transmutation de l'ADN",
      planet: "Soleil",
      description: "Surnommée la fréquence des 'Miracles'. Elle stimule la réparation biologique, le rajeunissement et l'éveil du cœur.",
      celestialDetails: "Alignée sur l'énergie du Soleil (Ash-Shams), la fréquence 528Hz véhicule la géométrie sacrée de la lumière centrale.",
      lunarPhaseMatch: "Pleine Lune (Al-Badr)",
      spiritualEffect: "Réparation cellulaire, clarté de vision, amour divin et transformation des énergies denses en lumière."
    },
    en: {
      name: "Solar Wave & DNA Repair",
      planet: "Sun",
      description: "Known as the 'Miracle' frequency. Stimulates biological repair, rejuvenation, and awakening of the heart.",
      celestialDetails: "Aligned with Sun energy (Ash-Shams), 528Hz carries the sacred geometry of light into the spiritual heart (Qalb).",
      lunarPhaseMatch: "Full Moon (Al-Badr)",
      spiritualEffect: "Cellular repair, vision clarity, divine love, and transformation of dense energy into light."
    },
    ha: {
      name: "Rana & Sabunta Halitta",
      planet: "Rana (Ash-Shams)",
      description: "Sautin mu'ujiza. Yana motsa lafiyar kwayoyin halitta da farfado da hasken zuciya.",
      celestialDetails: "Yana tafiya tare da karfin Rana, 528Hz yana kawo haske cikin zuciya (Qalb).",
      lunarPhaseMatch: "Cikakken Wata (Al-Badr)",
      spiritualEffect: "Gyaran sel na jiki, bayyanar haske, soyayyar Ubangiji da canza duhu zuwa haske."
    }
  },
  {
    freq: 639,
    label: "639 Hz",
    planetSymbol: "♀",
    arabicName: "Az-Zuharah - Al-Wadud (L'Amour Pur)",
    color: "from-teal-600 to-cyan-800",
    badgeBg: "bg-teal-900/30 text-teal-300 border-teal-700/50",
    fr: {
      name: "Harmonie du Cœur & Vénus",
      planet: "Vénus",
      description: "Facilite l'harmonie dans la communauté, la réconciliation, la compassion et la connexion fraternelle.",
      celestialDetails: "Régie par la sphère de Vénus (Az-Zuharah), elle adoucit les relations humaines et ouvre le chakra du cœur (Al-Sadr).",
      lunarPhaseMatch: "Lune Gibbeuse Croissante",
      spiritualEffect: "Réconciliation, bonté de cœur, résonance spirituelle avec les proches et paix relationnelle."
    },
    en: {
      name: "Heart Harmony & Venus",
      planet: "Venus",
      description: "Facilitates community harmony, reconciliation, compassion, and brotherly connection.",
      celestialDetails: "Governed by Venus (Az-Zuharah), softens human relationships and opens the spiritual heart.",
      lunarPhaseMatch: "Waxing Gibbous Moon",
      spiritualEffect: "Reconciliation, heart kindness, spiritual resonance, and relational peace."
    },
    ha: {
      name: "Daidaiton Zuciya da Tauraron Zuhra",
      planet: "Venus (Az-Zuharah)",
      description: "Yana kawo zaman lafiya tsakanin mutane, so da kauna da sulhu.",
      celestialDetails: "Karkashin tauraron Zuhra, yana saukaka mu'amala da bude hasken zuciya.",
      lunarPhaseMatch: "Wata Mai Cikakku",
      spiritualEffect: "Sulhu, alheri, karfafa zumunci da zaman lafiya."
    }
  },
  {
    freq: 741,
    label: "741 Hz",
    planetSymbol: "☿",
    arabicName: "'Utarid - Al-Hikmah (La Sagesse)",
    color: "from-blue-600 to-indigo-900",
    badgeBg: "bg-blue-900/30 text-blue-300 border-blue-700/50",
    fr: {
      name: "Éloquence & Purification de Mercure",
      planet: "Mercure",
      description: "Fréquence de l'expression pure, de la purification de l'esprit et de la compréhension des vérités subtiles.",
      celestialDetails: "Sous le patronage de Mercure ('Utarid), planète de l'intellect spirituel. Dissout les toxines psychiques et améliore la récitation.",
      lunarPhaseMatch: "Dernier Quartier",
      spiritualEffect: "Purification des pensées, verbe inspiré, compréhension des mystères des lettres (Ilm al-Huroof)."
    },
    en: {
      name: "Eloquence & Mercury Purification",
      planet: "Mercury",
      description: "Frequency of pure expression, mental detox, and understanding of subtle truths.",
      celestialDetails: "Under Mercury ('Utarid), planet of spiritual intellect. Clears psychic toxins and enhances recitation.",
      lunarPhaseMatch: "Last Quarter",
      spiritualEffect: "Mental purification, inspired speech, comprehension of letter mysteries (Ilm al-Huroof)."
    },
    ha: {
      name: "Bayani da Tsarkake Hankali",
      planet: "Mercury ('Utarid)",
      description: "Sautin tsabtace tunani da fahimtar zurfin gaskiya.",
      celestialDetails: "A karkashin tauraron 'Utarid, yana goge mummunan tunani da bunkasa karatu.",
      lunarPhaseMatch: "Karshen Tsakiyar Wata",
      spiritualEffect: "Tsarkake tunani, kalmomi masu haske, da fahimtar ilmin haruffa."
    }
  },
  {
    freq: 852,
    label: "852 Hz",
    planetSymbol: "♃",
    arabicName: "Al-Mushtari - Al-Basirah (La Vision Subtile)",
    color: "from-purple-600 to-violet-950",
    badgeBg: "bg-purple-900/30 text-purple-300 border-purple-700/50",
    fr: {
      name: "Éveil de l'Intuition & Jupiter",
      planet: "Jupiter",
      description: "Stimule la vision intérieure (Basirah), rétablit l'ordre spirituel et ouvre la perception du monde invisible (Al-Ghayb).",
      celestialDetails: "Associée à la grandeur de Jupiter (Al-Mushtari), elle élève l'âme vers les réalités célestes et l'inspiration.",
      lunarPhaseMatch: "Pleine Lune & Nuits Blanches",
      spiritualEffect: "Éveil du troisième œil (Basirah), rêves prémonitoires et sérénité face aux épreuves."
    },
    en: {
      name: "Intuition Awakening & Jupiter",
      planet: "Jupiter",
      description: "Stimulates spiritual vision (Basirah), restores spiritual order, and opens perception of the unseen (Al-Ghayb).",
      celestialDetails: "Associated with Jupiter (Al-Mushtari), elevates the soul to celestial realities.",
      lunarPhaseMatch: "Full Moon & White Nights",
      spiritualEffect: "Awakening of spiritual vision (Basirah), meaningful dreams, and serenity in trials."
    },
    ha: {
      name: "Fahimta da Budewar Zuciya",
      planet: "Jupiter (Al-Mushtari)",
      description: "Yana bude idon zuciya (Basirah) da fahimtar abubuwan fakuru (Al-Ghayb).",
      celestialDetails: "Tare da tauraron Al-Mushtari, yana daga ruhu zuwa sama.",
      lunarPhaseMatch: "Cikakken Wata & Kwenikweni",
      spiritualEffect: "Bude basira, mafarki mai kyau da karfin gwiwa."
    }
  },
  {
    freq: 963,
    label: "963 Hz",
    planetSymbol: "👑",
    arabicName: "Al-'Arsh - Al-Hudur (La Présence Unique)",
    color: "from-amber-400 via-purple-500 to-indigo-950",
    badgeBg: "bg-amber-400/20 text-amber-200 border-amber-400/40",
    fr: {
      name: "Couronne Céleste & Trône Divine",
      planet: "Sphère du Trône (Al-'Arsh)",
      description: "Surnommée 'La Fréquence des Anges'. Elle reconnecte la conscience individuelle à la Présence Divine absolue.",
      celestialDetails: "Octave suprême de la création, le seuil de la lumière absolue (Nur 'ala Nur). Utilisée lors des hauts états de contemplation.",
      lunarPhaseMatch: "Nuit du Qadr / Nuit de la Pleine Lune",
      spiritualEffect: "Sentiment d'Unité absolue (Tawhid), illumination de l'esprit et paix supra-consciente."
    },
    en: {
      name: "Celestial Crown & Divine Throne",
      planet: "Throne Sphere (Al-'Arsh)",
      description: "Known as 'The Frequency of Angels'. Reconnects individual consciousness to Absolute Divine Presence.",
      celestialDetails: "Supreme octave of creation, threshold of Light upon Light (Nur 'ala Nur). Used in high contemplation.",
      lunarPhaseMatch: "Night of Power / Full Moon Night",
      spiritualEffect: "Sense of Absolute Unity (Tawhid), spiritual illumination, and supreme peace."
    },
    ha: {
      name: "Kambun Sama da Al'arshi",
      planet: "Sama ta Al'arshi",
      description: "Sautin Mala'iku. Yana hada tunanin mutum da Girman Ubangiji.",
      celestialDetails: "Babban matsayi na halitta (Nur 'ala Nur). Yana taimakawa a babban bimbini.",
      lunarPhaseMatch: "Lailatul Qadr / Daren Cikakken Wata",
      spiritualEffect: "Tawhid, illumination na ruhu da kwanciyar hankali na koli."
    }
  }
];

export function getSacredFrequencies(lang: Language = 'fr'): SacredFrequency[] {
  const l = lang === 'ha' ? 'ha' : lang === 'en' ? 'en' : 'fr';
  return RAW_FREQUENCIES_DATA.map(item => ({
    freq: item.freq,
    label: item.label,
    name: item[l].name,
    planet: item[l].planet,
    planetSymbol: item.planetSymbol,
    arabicName: item.arabicName,
    description: item[l].description,
    celestialDetails: item[l].celestialDetails,
    lunarPhaseMatch: item[l].lunarPhaseMatch,
    spiritualEffect: item[l].spiritualEffect,
    color: item.color,
    badgeBg: item.badgeBg
  }));
}

// Fallback constant for fr compatibility
export const SACRED_FREQUENCIES_DATA = getSacredFrequencies('fr');

interface RawPlanetaryInfo {
  dayIndex: number;
  arabicName: string;
  symbol: string;
  recommendedFreq: number;
  angelRuler: string;
  fr: { dayName: string; planetName: string; element: string; spiritualFocus: string; description: string };
  en: { dayName: string; planetName: string; element: string; spiritualFocus: string; description: string };
  ha: { dayName: string; planetName: string; element: string; spiritualFocus: string; description: string };
}

const RAW_PLANETARY_DAYS: Record<number, RawPlanetaryInfo> = {
  0: {
    dayIndex: 0,
    arabicName: "Ash-Shams (الشمس)",
    symbol: "☉",
    recommendedFreq: 528,
    angelRuler: "Rufa'il (رُوفَائِيل)",
    fr: {
      dayName: "Dimanche",
      planetName: "Soleil",
      element: "Feu Lumineux / Esprit",
      spiritualFocus: "Rayonnement du Cœur, Vitalité & Guérison",
      description: "Le dimanche est régi par le Soleil. C'est le jour idéal pour les invocations de lumière (An-Nur), le renouvellement de la foi et la purification du cœur."
    },
    en: {
      dayName: "Sunday",
      planetName: "Sun",
      element: "Luminous Fire / Spirit",
      spiritualFocus: "Heart Radiance, Vitality & Healing",
      description: "Sunday is governed by the Sun. Ideal day for light invocations (An-Nur), renewal of faith, and heart purification."
    },
    ha: {
      dayName: "Lahadi",
      planetName: "Rana",
      element: "Wuta Mai Haske / Ruhu",
      spiritualFocus: "Hasken Zuciya, Kuzari da Lafiya",
      description: "Ranar Lahadi tana karkashin kariya ta Rana. Rana ce mai kyau don addu'o'in haske, sabunta imani da tsarkake zuciya."
    }
  },
  1: {
    dayIndex: 1,
    arabicName: "Al-Qamar (القمر)",
    symbol: "☽",
    recommendedFreq: 432,
    angelRuler: "Jibra'il (جِبْرَائِيل)",
    fr: {
      dayName: "Lundi",
      planetName: "Lune",
      element: "Eau Céleste / Intuition",
      spiritualFocus: "Paix Intérieure, Révélation & Équilibre Émotionnel",
      description: "Le lundi est le jour de la Lune, gouverné par Jibril. Jour béni de la naissance du Prophète (ﷺ)."
    },
    en: {
      dayName: "Monday",
      planetName: "Moon",
      element: "Celestial Water / Intuition",
      spiritualFocus: "Inner Peace, Revelation & Emotional Balance",
      description: "Monday is the Moon's day, governed by Jibril. Blessed day of the Prophet's (ﷺ) birth."
    },
    ha: {
      dayName: "Litinin",
      planetName: "Wata",
      element: "Ruwan Sama / Basira",
      spiritualFocus: "Natsuwa, Wahayi da Daidaiton Zuciya",
      description: "Ranar Litinin tana karkashin Wata da Mala'ika Jibril. Ranar haihuwar Annabi (ﷺ)."
    }
  },
  2: {
    dayIndex: 2,
    arabicName: "Al-Mirrikh (المرّيخ)",
    symbol: "♂",
    recommendedFreq: 417,
    angelRuler: "Samsama'il (سَمْسَمَائِيل)",
    fr: {
      dayName: "Mardi",
      planetName: "Mars",
      element: "Feu Protecteur",
      spiritualFocus: "Dissolution des Obstacles, Force du Zikr & Protection",
      description: "Gouverné par Mars, ce jour est propice à la protection contre les ruses et le Zikr énergique."
    },
    en: {
      dayName: "Tuesday",
      planetName: "Mars",
      element: "Protective Fire",
      spiritualFocus: "Overcoming Obstacles, Powerful Zikr & Protection",
      description: "Governed by Mars, ideal for spiritual protection and energetic Zikr."
    },
    ha: {
      dayName: "Talata",
      planetName: "Mars (Al-Mirrikh)",
      element: "Wutar Kariya",
      spiritualFocus: "Kauyar da Obstacles, Karfin Zikiri da Kariya",
      description: "Karkashin tauraron Al-Mirrikh, rana ce ta kariya daga sharri da karfafa Zikiri."
    }
  },
  3: {
    dayIndex: 3,
    arabicName: "'Utarid (عطارد)",
    symbol: "☿",
    recommendedFreq: 741,
    angelRuler: "Mika'il (مِيكَائِيل)",
    fr: {
      dayName: "Mercredi",
      planetName: "Mercure",
      element: "Air & Intellect",
      spiritualFocus: "Étude des Livres Sacrés, Éloquence & Sagesse",
      description: "Régi par Mercure et l'Ange Mika'il. Jour d'apprentissage, de méditation sur les lettres sacrées."
    },
    en: {
      dayName: "Wednesday",
      planetName: "Mercury",
      element: "Air & Intellect",
      spiritualFocus: "Sacred Book Study, Eloquence & Wisdom",
      description: "Governed by Mercury and Angel Mika'il. Day of learning and meditation on sacred letters."
    },
    ha: {
      dayName: "Laraba",
      planetName: "Mercury ('Utarid)",
      element: "Iska da Hankali",
      spiritualFocus: "Karatun Littattafai, Bayani da Hikima",
      description: "Karkashin 'Utarid da Mala'ika Mika'il. Ranar neman ilmi da bimbini a kan haruffa."
    }
  },
  4: {
    dayIndex: 4,
    arabicName: "Al-Mushtari (المشتري)",
    symbol: "♃",
    recommendedFreq: 852,
    angelRuler: "Sarfiya'il (صَرْفَيَائِيل)",
    fr: {
      dayName: "Jeudi",
      planetName: "Jupiter",
      element: "Air Éthéré / Expansion",
      spiritualFocus: "Abondance Spirituelle, Ouverture des Portes (Fath) & Vision",
      description: "La noble planète Jupiter gouverne le jeudi. Moment par excellence pour réciter le Dalail al-Khayrat et le Dhikr élevé."
    },
    en: {
      dayName: "Thursday",
      planetName: "Jupiter",
      element: "Etheric Air / Expansion",
      spiritualFocus: "Spiritual Abundance, Opening of Doors (Fath) & Vision",
      description: "Jupiter governs Thursday. Prime moment for reciting Dalail al-Khayrat and high Dhikr."
    },
    ha: {
      dayName: "Alhamis",
      planetName: "Jupiter (Al-Mushtari)",
      element: "Iskar Sama / Fadada",
      spiritualFocus: "Arzikin Ruhu, Bude Kofofi da Basira",
      description: "Tauraron Mushtari ke mulkin Alhamis. Lokaci ne mai albarka don salati da zikiri."
    }
  },
  5: {
    dayIndex: 5,
    arabicName: "Az-Zuharah (الزهرة)",
    symbol: "♀",
    recommendedFreq: 639,
    angelRuler: "Anya'il (عَنْيَائِيل)",
    fr: {
      dayName: "Vendredi",
      planetName: "Vénus",
      element: "Eau Divine & Terre Bénie",
      spiritualFocus: "Prière du Jumu'ah, Salawat, Amour Divin & Harmonie",
      description: "Le maître des jours (Sayyid al-Ayyam). La vibration amplifie la bénédiction de la prière sur le Prophète (ﷺ)."
    },
    en: {
      dayName: "Friday",
      planetName: "Venus",
      element: "Divine Water & Blessed Earth",
      spiritualFocus: "Jumu'ah Prayer, Salawat, Divine Love & Harmony",
      description: "The master of days (Sayyid al-Ayyam). Amplifies blessings of prayers upon the Prophet (ﷺ)."
    },
    ha: {
      dayName: "Juma'a",
      planetName: "Venus (Az-Zuharah)",
      element: "Ruwan Ubangiji da Qasa",
      spiritualFocus: "Addu'ar Juma'a, Salatin Annabi, Soyayya da Zumunci",
      description: "Shugaban Ranakun (Sayyid al-Ayyam). Yana ninkawa albarkar salati ga Annabi (ﷺ)."
    }
  },
  6: {
    dayIndex: 6,
    arabicName: "Zuhal (زحل)",
    symbol: "♄",
    recommendedFreq: 396,
    angelRuler: "Kasfiya'il (كَسْفَيَائِيل)",
    fr: {
      dayName: "Samedi",
      planetName: "Saturne",
      element: "Terre Droite & Profondeur",
      spiritualFocus: "Ancrage, Patience (Sabr), Retraite & Protection",
      description: "Gouverné par Saturne, ce jour invite à l'introspection, la patience et la libération des peurs."
    },
    en: {
      dayName: "Saturday",
      planetName: "Saturn",
      element: "Deep Earth & Grounding",
      spiritualFocus: "Grounding, Patience (Sabr), Retreat & Protection",
      description: "Governed by Saturn, invites introspection, patience, and release of deep fears."
    },
    ha: {
      dayName: "Asabar",
      planetName: "Saturn (Zuhal)",
      element: "Daukakar Kasa da Zurfi",
      spiritualFocus: "Tabbata, Hakuri (Sabr), Kadaitaka da Kariya",
      description: "Karkashin tauraron Zuhal, rana ce ta hakuri, tuba da samun natsuwa."
    }
  }
};

export function getPlanetaryDaysInfo(lang: Language = 'fr'): Record<number, PlanetaryInfo> {
  const l = lang === 'ha' ? 'ha' : lang === 'en' ? 'en' : 'fr';
  const result: Record<number, PlanetaryInfo> = {};
  for (let i = 0; i < 7; i++) {
    const raw = RAW_PLANETARY_DAYS[i];
    result[i] = {
      dayName: raw[l].dayName,
      dayIndex: raw.dayIndex,
      planetName: raw[l].planetName,
      arabicName: raw.arabicName,
      symbol: raw.symbol,
      recommendedFreq: raw.recommendedFreq,
      angelRuler: raw.angelRuler,
      element: raw[l].element,
      spiritualFocus: raw[l].spiritualFocus,
      description: raw[l].description
    };
  }
  return result;
}

export const PLANETARY_DAYS_INFO = getPlanetaryDaysInfo('fr');

export function calculateLunarInfo(date: Date = new Date(), lang: Language = 'fr'): LunarInfo {
  const refNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
  const synodicMonth = 29.53058867 * 86400 * 1000;
  
  const diff = date.getTime() - refNewMoon;
  const cycleProgress = (diff % synodicMonth) / synodicMonth;
  const ageDays = cycleProgress * 29.53058867;
  const illumination = Math.round((1 - Math.cos(cycleProgress * 2 * Math.PI)) / 2 * 100);

  const l = lang === 'ha' ? 'ha' : lang === 'en' ? 'en' : 'fr';

  let arabicPhase = "المحاق";
  let recommendedFreq = 396;
  let icon = "🌑";

  const phases: Record<string, { fr: { name: string; desc: string }; en: { name: string; desc: string }; ha: { name: string; desc: string } }> = {
    newMoon: {
      fr: { name: "Nouvelle Lune (Al-Muhaq)", desc: "Phase du Vide Sacré et du renouvellement des intentions. Période de purification intense." },
      en: { name: "New Moon (Al-Muhaq)", desc: "Phase of Sacred Space and intention renewal. Period of intense purification." },
      ha: { name: "Watan Kamawa (Al-Muhaq)", desc: "Lokacin sabunta niyya da tsarkake zuciya." }
    },
    crescent: {
      fr: { name: "Premier Croissant (Al-Hilal)", desc: "Le jeune croissant apparaît dans le ciel. Moment propice pour planter des intentions de Zikr." },
      en: { name: "First Crescent (Al-Hilal)", desc: "Young crescent appears. Propitious time for planting Dhikr intentions and renewal." },
      ha: { name: "Jinjirin Wata (Al-Hilal)", desc: "Farawar fito na jinjirin wata. Lokaci mai kyau don kulla niyyar Zikiri." }
    },
    firstQuarter: {
      fr: { name: "Premier Quartier (Al-Tarbii')", desc: "Lune à demi éclairée. Stabilisation des flux énergétiques et harmonie dans les prières." },
      en: { name: "First Quarter (Al-Tarbii')", desc: "Half-illuminated moon. Stabilization of energy flows and prayer harmony." },
      ha: { name: "Rabin Wata na Farko (Al-Tarbii')", desc: "Daidaition karfin haske da hadin kan addu'o'i." }
    },
    waxingGibbous: {
      fr: { name: "Lune Gibbeuse Croissante (Al-Ahdab)", desc: "Montée de l'énergie cosmique vers son zénith. Période d'expansion de la lumière du cœur." },
      en: { name: "Waxing Gibbous (Al-Ahdab)", desc: "Rise of cosmic energy towards its peak. Period of expanding heart light." },
      ha: { name: "Cikar Wata Mai Tattara (Al-Ahdab)", desc: "Gidagidancin karfin haske zuwa kololuwa." }
    },
    fullMoon: {
      fr: { name: "Pleine Lune Bénie (Al-Badr)", desc: "Zénith d'illumination. Les 3 nuits blanches hégiriennes. Les voiles spirituels sont affinés, l'intuition est maximale." },
      en: { name: "Blessed Full Moon (Al-Badr)", desc: "Peak illumination. The 3 White Nights. Spiritual veils thinned, maximum intuition." },
      ha: { name: "Cikakken Wata Mai Albarka (Al-Badr)", desc: "Kwamatsan haske na kwanaki 3 masu haske. Bude basira da amsa addu'a." }
    },
    waningGibbous: {
      fr: { name: "Lune Gibbeuse Décroissante", desc: "L'énergie accumulée pendant la pleine lune se diffuse avec compassion et partage de sagesse." },
      en: { name: "Waning Gibbous", desc: "Energy accumulated during full moon diffuses with compassion and wisdom sharing." },
      ha: { name: "Cikar Wata Mai Raguwa", desc: "Rarraba albarkar da aka samu zuwa al'umma da tausayi." }
    },
    lastQuarter: {
      fr: { name: "Dernier Quartier (Al-Tarbii' Al-Thani)", desc: "Purification et nettoyage des scories psychiques. Temps de récapitulation et de méditation silencieuse." },
      en: { name: "Last Quarter (Al-Tarbii' Al-Thani)", desc: "Purification and psychic detox. Time for reflection and silent meditation." },
      ha: { name: "Rabin Wata na Karshe", desc: "Tsarkake tunani da yin bimbini a cikin shiru." }
    },
    lastCrescent: {
      fr: { name: "Dernier Croissant (Al-Mahaq)", desc: "La lune s'efface doucement. Préparation à la nuit de contemplation pure et au repos de l'âme." },
      en: { name: "Waning Crescent (Al-Mahaq)", desc: "Moon gently fades. Preparation for pure contemplation night and soul rest." },
      ha: { name: "Karshen Jinjiri (Al-Mahaq)", desc: "Faduwar wata a hankali. Shirye-shiryen daren bimbini da hutar da rai." }
    }
  };

  let selectedPhaseKey = 'newMoon';

  if (ageDays >= 1.5 && ageDays < 7.4) {
    selectedPhaseKey = 'crescent';
    arabicPhase = "الهلال";
    recommendedFreq = 432;
    icon = "🌒";
  } else if (ageDays >= 7.4 && ageDays < 10.5) {
    selectedPhaseKey = 'firstQuarter';
    arabicPhase = "التربيع الأول";
    recommendedFreq = 639;
    icon = "🌓";
  } else if (ageDays >= 10.5 && ageDays < 14.5) {
    selectedPhaseKey = 'waxingGibbous';
    arabicPhase = "الأحدب";
    recommendedFreq = 528;
    icon = "🌔";
  } else if (ageDays >= 14.5 && ageDays < 16.5) {
    selectedPhaseKey = 'fullMoon';
    arabicPhase = "البدر المنير";
    recommendedFreq = 852;
    icon = "🌕";
  } else if (ageDays >= 16.5 && ageDays < 22.0) {
    selectedPhaseKey = 'waningGibbous';
    arabicPhase = "الأحدب الثاني";
    recommendedFreq = 639;
    icon = "🌖";
  } else if (ageDays >= 22.0 && ageDays < 25.0) {
    selectedPhaseKey = 'lastQuarter';
    arabicPhase = "التربيع الثاني";
    recommendedFreq = 741;
    icon = "🌗";
  } else if (ageDays >= 25.0) {
    selectedPhaseKey = 'lastCrescent';
    arabicPhase = "المحاق";
    recommendedFreq = 963;
    icon = "🌘";
  }

  const p = phases[selectedPhaseKey][l];

  return {
    ageDays: Math.round(ageDays * 10) / 10,
    illumination,
    phaseName: p.name,
    arabicPhase,
    recommendedFreq,
    description: p.desc,
    icon
  };
}
