export interface AdvancedRamlTranslation {
  backToTools: string;
  headerBadge: string;
  pageTitle: string;
  pageSubtitle: string;
  infoNotice: string;
  tabs: {
    khatamRaml: string;
    saatTacht: string;
    tafshee: string;
  };
  labels: {
    selectMother1: string;
    selectMother2: string;
    selectMother3: string;
    selectMother4: string;
    generateTheme: string;
    randomTheme: string;
    selectDay: string;
    selectElement: string;
    selectIntention: string;
    copy: string;
    copied: string;
    exportPng: string;
    exportParchment: string;
    houseNumber: string;
    figureName: string;
    element: string;
    houseMeaning: string;
    remedy: string;
  };
  khatamRamlSection: {
    title: string;
    subtitle: string;
    sealTitle: string;
    sealDesc: string;
    concentricLayers: {
      outer: string;
      middle: string;
      inner: string;
      core: string;
    };
    housesTableTitle: string;
    concentricOverview: string;
  };
  saatTachtSection: {
    title: string;
    subtitle: string;
    bestHourTitle: string;
    stabilityScore: string;
    planetaryRuler: string;
    drawingDirection: string;
    sandPreparation: string;
    preparationSteps: string[];
    hourlyScheduleTitle: string;
    stable: string;
    neutral: string;
    unstable: string;
  };
  tafsheeSection: {
    title: string;
    subtitle: string;
    redundancyStatus: string;
    noRedundancy: string;
    moderateRedundancy: string;
    severeRedundancy: string;
    blockageAxesTitle: string;
    repeatedFiguresTitle: string;
    countLabel: string;
    housesOccurrences: string;
    remedialTitle: string;
    remedialDesc: string;
  };
  days: {
    sunday: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
  };
  elements: {
    fire: string;
    air: string;
    water: string;
    earth: string;
  };
  intentions: {
    protection: string;
    opening: string;
    healing: string;
    reconciliation: string;
    wisdom: string;
  };
}

export const ADVANCED_RAML_TRANSLATIONS: Record<'fr' | 'en' | 'ha', AdvancedRamlTranslation> = {
  fr: {
    backToTools: "Retour aux Outils",
    headerBadge: "Traitement Avancé de Raml",
    pageTitle: "Traitement Avancé de Raml",
    pageSubtitle: "Sceau de Sable concentrique (Khatam al-Raml), Heure d'alignement du tracé (Sa'at al-Tacht) et Analyse des blocages par figures répétées (Tafshee).",
    infoNotice: "La Géomancie (Ilm al-Raml) est une science sacrée d'alignement tellurique et céleste. Utilisez ce module pour structurer le cercle des 16 maisons, optimiser l'heure de tracé du Tacht et neutraliser les nœuds répétitifs.",
    tabs: {
      khatamRaml: "Sceau de Sable (Khatam)",
      saatTacht: "Heure de Tracé (Sa'at)",
      tafshee: "Figures Répétées (Tafshee)",
    },
    labels: {
      selectMother1: "Mère 1 (House 1 - Al-Nafs)",
      selectMother2: "Mère 2 (House 2 - Al-Mal)",
      selectMother3: "Mère 3 (House 3 - Al-Ikhwa)",
      selectMother4: "Mère 4 (House 4 - Al-Aba')",
      generateTheme: "Générer le Thème Complet (16 Maisons)",
      randomTheme: "Thème Aléatoire Harmonique",
      selectDay: "Jour de Consultation",
      selectElement: "Élément Dominant de l'Opérateur",
      selectIntention: "Intention Spirituelle du Tracé",
      copy: "Copier",
      copied: "Copié !",
      exportPng: "Exporter en Image HD",
      exportParchment: "Exporter Parchemin Trad.",
      houseNumber: "Maison",
      figureName: "Figure de Raml",
      element: "Élément",
      houseMeaning: "Domaine / Signification",
      remedy: "Neutralisation",
    },
    khatamRamlSection: {
      title: "Sceau de Sable (Khatam al-Raml)",
      subtitle: "Disposition circulaire concentrique parfaite des 16 figures géomantiques pour la synthèse globale du thème.",
      sealTitle: "Sceau Concentrique Intégral",
      sealDesc: "Les 16 maisons disposées en 4 anneaux harmoniques autour du cœur synthétique.",
      concentricLayers: {
        outer: "Anneau Externe : Les 16 Maisons Géomantiques",
        middle: "Anneau Médian : Figures, Points & Noms Arables",
        inner: "Anneau Interne : Polarités Élémentaires",
        core: "Cœur du Sceau : Point d'Ancrage Spirituel",
      },
      housesTableTitle: "Tableau Détaillé des 16 Maisons du Sceau",
      concentricOverview: "Vision Concentrique des 16 Maisons",
    },
    saatTachtSection: {
      title: "Heure de Tracé du Sable (Sa'at al-Tacht)",
      subtitle: "Identification des créneaux horaires de stabilité maximale pour effectuer le tracé du thème sur le sable ou le papier.",
      bestHourTitle: "Créneau d'Alignement Optimal",
      stabilityScore: "Indice de Stabilité Tellurique",
      planetaryRuler: "Gouverneur Planétaire de l'Heure",
      drawingDirection: "Orientation Recommandée du Tracé",
      sandPreparation: "Protocole de Préparation du Support & Rituel",
      preparationSteps: [
        "Avoir ses ablutions complètes (Tahara) et s'orienter vers la Qibla.",
        "Réciter la Fatiha et la formule de protection Bismillah 3 fois avant de toucher le sable.",
        "Tracer les 4 premières lignes avec intention claire sans hésitation ni interruption.",
        "Procéder à l'extraction des Filles (Banat) et des Zawaid dans la sérénité.",
      ],
      hourlyScheduleTitle: "Graphique des 12 Heures du Jour & Niveau de Stabilité",
      stable: "Tracé Très Stable",
      neutral: "Stabilité Modérée",
      unstable: "Heure Inquiète (À Éviter)",
    },
    tafsheeSection: {
      title: "Figures Répétées & Blocages (Tafshee)",
      subtitle: "Analyse structurale des redondances de figures dans le thème pour déceler les nœuds énergétiques et leurs remèdes.",
      redundancyStatus: "Diagnostic Structural du Thème",
      noRedundancy: "Thème Fluide : Aucune répétition excessive détectée.",
      moderateRedundancy: "Thème Focalisé : Présence de 2 à 3 répétitions ciblant des secteurs clés.",
      severeRedundancy: "Nœud Majeur (Uqda) : Forte redondance d'une figure créant un blocage.",
      blockageAxesTitle: "Axes d'Interaction & Projection des Répétitions",
      repeatedFiguresTitle: "Inventaire des Figures Redondantes",
      countLabel: "Occurrences",
      housesOccurrences: "Maisons Affectées",
      remedialTitle: "Neutralisation & Remède Élémentaire",
      remedialDesc: "Invocations et préparations d'eau ou d'encens recommandées pour lever le nœud géomantique.",
    },
    days: {
      sunday: "Dimanche (Ahad - Soleil)",
      monday: "Lundi (Ithnayn - Lune)",
      tuesday: "Mardi (Thulatha - Mars)",
      wednesday: "Mercredi (Arbi'a - Mercure)",
      thursday: "Jeudi (Khamis - Jupiter)",
      friday: "Vendredi (Juma'a - Vénus)",
      saturday: "Samedi (Sabt - Saturne)",
    },
    elements: {
      fire: "Feu (Nari - Energetique & Rapide)",
      air: "Air (Hawai - Mental & Relationnel)",
      water: "Eau (Ma'i - Emotionnel & Intuitif)",
      earth: "Terre (Turabi - Materiel & Stable)",
    },
    intentions: {
      protection: "Protection & Neutralisation des Obstacles",
      opening: "Ouverture des Portes & Prosperite (Fath)",
      healing: "Guérison & Vitalite Physico-Spirituelle",
      reconciliation: "Harmonie, Amour & Réconciliation",
      wisdom: "Clarté Mentale, Sagesse & Prise de Décision",
    },
  },
  en: {
    backToTools: "Back to Tools",
    headerBadge: "Advanced Raml Processing",
    pageTitle: "Advanced Raml Processing",
    pageSubtitle: "Concentric Sand Seal (Khatam al-Raml), Optimal Drawing Hour (Sa'at al-Tacht), and Redundancy & Blockage Analysis (Tafshee).",
    infoNotice: "Geomancy (Ilm al-Raml) is a sacred science of telluric and celestial alignment. Use this module to structure the 16 houses in a circular seal, optimize the chart drawing window, and neutralize structural knots.",
    tabs: {
      khatamRaml: "Sand Seal (Khatam)",
      saatTacht: "Drawing Hour (Sa'at)",
      tafshee: "Repeated Figures (Tafshee)",
    },
    labels: {
      selectMother1: "Mother 1 (House 1 - Al-Nafs)",
      selectMother2: "Mother 2 (House 2 - Al-Mal)",
      selectMother3: "Mother 3 (House 3 - Al-Ikhwa)",
      selectMother4: "Mother 4 (House 4 - Al-Aba')",
      generateTheme: "Generate Full Chart (16 Houses)",
      randomTheme: "Harmonic Random Chart",
      selectDay: "Consultation Day",
      selectElement: "Operator's Dominant Element",
      selectIntention: "Spiritual Intention of the Drawing",
      copy: "Copy",
      copied: "Copied!",
      exportPng: "Export HD Image",
      exportParchment: "Export Trad. Parchment",
      houseNumber: "House",
      figureName: "Raml Figure",
      element: "Element",
      houseMeaning: "Domain / Meaning",
      remedy: "Neutralization",
    },
    khatamRamlSection: {
      title: "Sand Seal (Khatam al-Raml)",
      subtitle: "Perfect concentric circular arrangement of the 16 geomantic figures for global chart synthesis.",
      sealTitle: "Integral Concentric Seal",
      sealDesc: "The 16 houses arranged in 4 harmonic rings around the synthetic core.",
      concentricLayers: {
        outer: "Outer Ring: The 16 Geomantic Houses",
        middle: "Middle Ring: Figures, Dots & Arabic Names",
        inner: "Inner Ring: Elementary Polarities",
        core: "Seal Core: Spiritual Anchoring Point",
      },
      housesTableTitle: "Detailed Table of the 16 Seal Houses",
      concentricOverview: "Concentric Overview of the 16 Houses",
    },
    saatTachtSection: {
      title: "Drawing Hour (Sa'at al-Tacht)",
      subtitle: "Identification of maximum stability time slots for drawing the geomantic chart on sand or paper.",
      bestHourTitle: "Optimal Alignment Slot",
      stabilityScore: "Telluric Stability Score",
      planetaryRuler: "Hourly Planetary Ruler",
      drawingDirection: "Recommended Drawing Direction",
      sandPreparation: "Medium Preparation Protocol & Ritual",
      preparationSteps: [
        "Perform full ablutions (Tahara) and face the Qibla.",
        "Recite Al-Fatiha and Bismillah 3 times before touching the sand.",
        "Trace the first 4 lines with clear intention without hesitation or pause.",
        "Proceed to extract the Daughters (Banat) and Auxiliaries (Zawaid) calmly.",
      ],
      hourlyScheduleTitle: "12 Daytime Hours Chart & Stability Levels",
      stable: "Highly Stable Drawing",
      neutral: "Moderate Stability",
      unstable: "Restless Hour (Avoid)",
    },
    tafsheeSection: {
      title: "Repeated Figures & Blockages (Tafshee)",
      subtitle: "Structural analysis of figure redundancies to detect energetic knots and their remedies.",
      redundancyStatus: "Structural Chart Diagnosis",
      noRedundancy: "Fluid Chart: No excessive repetition detected.",
      moderateRedundancy: "Focused Chart: 2 to 3 repetitions targeting key sectors.",
      severeRedundancy: "Major Knot (Uqda): High redundancy of a single figure creating a blockage.",
      blockageAxesTitle: "Interaction Axes & Repetition Projections",
      repeatedFiguresTitle: "Inventory of Redundant Figures",
      countLabel: "Occurrences",
      housesOccurrences: "Affected Houses",
      remedialTitle: "Neutralization & Elementary Remedy",
      remedialDesc: "Recommended prayers, water preparations, or incense to lift the geomantic knot.",
    },
    days: {
      sunday: "Sunday (Ahad - Sun)",
      monday: "Monday (Ithnayn - Moon)",
      tuesday: "Tuesday (Thulatha - Mars)",
      wednesday: "Wednesday (Arbi'a - Mercury)",
      thursday: "Thursday (Khamis - Jupiter)",
      friday: "Friday (Juma'a - Venus)",
      saturday: "Saturday (Sabt - Saturn)",
    },
    elements: {
      fire: "Fire (Nari - Energetic & Swift)",
      air: "Air (Hawai - Mental & Relational)",
      water: "Water (Ma'i - Emotional & Intuitive)",
      earth: "Earth (Turabi - Material & Stable)",
    },
    intentions: {
      protection: "Protection & Obstacle Neutralization",
      opening: "Door Opening & Prosperity (Fath)",
      healing: "Physico-Spiritual Healing & Vitality",
      reconciliation: "Harmony, Love & Reconciliation",
      wisdom: "Mental Clarity, Wisdom & Decision Making",
    },
  },
  ha: {
    backToTools: "Moma zuwa Kayan Aiki",
    headerBadge: "Gwaninta na Ramli",
    pageTitle: "Gwaninta na Ramli (Traitement Avancé de Raml)",
    pageSubtitle: "Hatimin Yashi na Da'ira (Khatam al-Raml), Lokacin Zana Taswira (Sa'at al-Tacht) da Binciken Katsewa da Maimaituwar Alamomi (Tafshee).",
    infoNotice: "Ilimin Ramli ilimi ne mai alfarma na daidaita duniyar kasa da ta sama. Yi amfani da wannan manhaja don tsara gidaje 16 a cikin hatimi na da'ira, nemo mafi kyawun lokacin rubutu, da kawar da kullin matsaloli.",
    tabs: {
      khatamRaml: "Hatimin Yashi (Khatam)",
      saatTacht: "Lokacin Zana (Sa'at)",
      tafshee: "Maimaituwar Alamomi (Tafshee)",
    },
    labels: {
      selectMother1: "Uwa ta 1 (Gida na 1 - Al-Nafs)",
      selectMother2: "Uwa ta 2 (Gida na 2 - Al-Mal)",
      selectMother3: "Uwa ta 3 (Gida na 3 - Al-Ikhwa)",
      selectMother4: "Uwa ta 4 (Gida na 4 - Al-Aba')",
      generateTheme: "Fitartar Dukkan Gidaje 16",
      randomTheme: "Samar da Taswirar Ramli ta Dace",
      selectDay: "Rana ta Bincike",
      selectElement: "Cibiyar Halittar Mai Aiki",
      selectIntention: "Niyyar Ruhani ta Zana Ramli",
      copy: "Kwafa",
      copied: "An Kwafa!",
      exportPng: "Fitar da Hoto HD",
      exportParchment: "Fitar da Takardar Fata Trad.",
      houseNumber: "Gida",
      figureName: "Alamar Ramli",
      element: "Cibiyar Halitta",
      houseMeaning: "Rarraba / Ma'ana",
      remedy: "Warwarewa",
    },
    khatamRamlSection: {
      title: "Hatimin Yashi (Khatam al-Raml)",
      subtitle: "Tsara gidaje 16 a cikin zobe mai da'ira daidai domin gano sakamakon taswirar gaba daya.",
      sealTitle: "Khatimi na Da'ira Mai Cikakken Bayani",
      sealDesc: "Gidaje 16 an tsara su a zobe 4 kewaye da cibiyar ruhani.",
      concentricLayers: {
        outer: "Zoben Waje: Gidajen Ramli 16",
        middle: "Zoben Tsakiya: Alamomi, Digogi da Suna da Larabci",
        inner: "Zoben Ciki: Rarrabar Halitta (Wuta, Iska, Ruwa, Kasa)",
        core: "Cibiyar Hatimi: Tushen Karfin Ruhani",
      },
      housesTableTitle: "Cikakken Teburin Gidaje 16 na Hatimi",
      concentricOverview: "Kallo na Da'ira na Gidaje 16",
    },
    saatTachtSection: {
      title: "Lokacin Zana Ramli (Sa'at al-Tacht)",
      subtitle: "Gano lokutan da suka fi dacewa da nutsuwa wajen zana taswirar Ramli a yashi ko takarda.",
      bestHourTitle: "Mafi Kyawun Lokacin Zana",
      stabilityScore: "Awon Stabiliti na Kasa",
      planetaryRuler: "Tauraron da Ke Mulkin Sa'o'i",
      drawingDirection: "Kyawun Hanyar da Zaka Kalla",
      sandPreparation: "Tsidar Shirya Yashi da Rituwal",
      preparationSteps: [
        "Yi alwala cikakkiya kuma ka fuskanci Alkibla.",
        "Karanta Surat al-Fatiha da Bismillah sau 3 kafin ka taba yashi.",
        "Zana layuka 4 na farko da kyakkyawar niyya ba tare da shakku ba.",
        "Fitar da 'Ya'ya (Banat) da Masu Taimako cikin salama da nutsuwa.",
      ],
      hourlyScheduleTitle: "Jadawalin Awanni 12 na Rana da Motsin Nutsuwa",
      stable: "Mafi Nutsuwa don Zana",
      neutral: "Nutsuwa Matsakaiciya",
      unstable: "Lokacin Motsi (A Gujeta)",
    },
    tafsheeSection: {
      title: "Maimaituwar Alamomi & Katsewa (Tafshee)",
      subtitle: "Binciken sakamakon maimaituwar alamomi a gidaje 16 domin gano kullin matsaloli da maganinsu.",
      redundancyStatus: "Gwaninta da Binciken Taswira",
      noRedundancy: "Taswira Mai Sauki: Babu maimaituwa mai yawa.",
      moderateRedundancy: "Taswira Mai Maimaituwa Matsakaiciya: Alamomi 2 zuwa 3 sun maimaita.",
      severeRedundancy: "Babban Kulli (Uqda): Maimaituwar alama guda daya sau da yawa tana kawo katsewa.",
      blockageAxesTitle: "Hanyoyin Maimaituwa da Taba Bangarori",
      repeatedFiguresTitle: "Lissafin Alamomin da Suka Maimaita",
      countLabel: "Yawan Maimaituwa",
      housesOccurrences: "Gidajen da Suka Samu",
      remedialTitle: "Warwarewa da Maganin Ruhani",
      remedialDesc: "Addu'o'i da tsarin ruwan addu'a ko turare da ake shawarta don warware kullin Ramli.",
    },
    days: {
      sunday: "Lahadi (Ahad - Rana)",
      monday: "Litinin (Ithnayn - Wata)",
      tuesday: "Talata (Thulatha - Mars)",
      wednesday: "Larabawa (Arbi'a - Mercure)",
      thursday: "Alhamis (Khamis - Jupiter)",
      friday: "Jumma'a (Juma'a - Vénus)",
      saturday: "Asabar (Sabt - Saturne)",
    },
    elements: {
      fire: "Wuta (Nari - Mai Motsi da Sauri)",
      air: "Iska (Hawai - Mai Tunanin Hankali)",
      water: "Ruwa (Ma'i - Mai Sauri da Tabawa)",
      earth: "Kasa (Turabi - Mai Stabiliti da Karfi)",
    },
    intentions: {
      protection: "Kariya da Warware Matsaloli",
      opening: "Bude Kofofin Arziki da Bunkasa (Fath)",
      healing: "Lafiyar Jiki da Ruhani",
      reconciliation: "Salama, Kauna da Soyayya",
      wisdom: "Haske na Tunanin Hankali da Hikima",
    },
  },
};
