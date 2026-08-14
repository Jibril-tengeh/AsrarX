// Complete UI Translations for Geomancy Traditions (Arabe Classique, Maghrébine, Africaine Fa/Ifa/Sikidy)
// 100% full coverage for French, English, and Hausa without any untranslated phrases.

export const GEOMANCY_TRADITIONS_I18N: Record<'fr' | 'en' | 'ha', any> = {
  fr: {
    // Header & Meta
    headerBadge: "Portail Majeur de Géomancie",
    mainTitle: "Géomancie Avancée des Trois Traditions",
    subtitle: "Systèmes divinatoires comparés : Science du Raml Arabe, Sceau Maghrébin de Zanati & Sagesses Africaines (Fa, Ifa, Sikidy).",
    
    // Main Tabs
    tabArabic: "🏛️ Arabe Classique",
    tabMaghrebi: "🏜️ Maghrébine (Zanati)",
    tabAfrican: "🌿 Africaine (Fa, Ifa, Sikidy)",
    tabChart16: "📊 Thème des 16 Maisons",

    // Common Actions & Tooltips
    btnGenerateNewChart: "Générer un Nouveau Thème",
    btnRecalculate: "Recalculer les Paramètres",
    btnExportPDF: "Exporter Synthèse",
    btnCopyData: "Copier les Résultats",
    copiedSuccess: "Résultats copiés dans le presse-papier !",
    activeFigureBadge: "Figure Active",
    houseLabel: "Maison",
    elementLabel: "Élément",
    planetLabel: "Planète Régente",
    natureLabel: "Nature & Mouvement",
    zodiacLabel: "Signe Zodiacal",
    abjadLabel: "Poids Abjad",

    // 1. Classical Arabic Geomancy
    arabicSectionTitle: "Géomancie Arabe Classique (Ilm al-Raml)",
    arabicSectionDesc: "L'art ésotérique transmis par les maîtres du désert pour scruter les intentions cachées, les aspects stellaires et la balance élémentaire.",
    
    // Arabic Sub-tools
    subDamir: "Intention Cachée (Damir)",
    subDamirDesc: "Extrait automatiquement le sujet réel de la préoccupation inconsciente du consultant.",
    damirFoundTitle: "Localisation du Damir Secret :",
    damirInsightLabel: "Révélation de l'Inconscient :",

    subTashteed: "Aspects Géomantiques (Tashteed)",
    subTashteedDesc: "Identifie les aspects de trigone, d'opposition, de carré et de conjonction harmonique du thème.",
    aspectTrine: "Trigone (120°) - Harmonie & Bénédiction",
    aspectOpposition: "Opposition (180°) - Tension & Arbitrage",
    aspectSquare: "Carré (90°) - Défi & Action",
    aspectConjunction: "Conjonction - Transmission d'Énergie",
    aspectsCountLabel: "Aspects Majeurs Détectés",

    subMizanAnasir: "Balance des Éléments (Mizan al-Anasir)",
    subMizanAnasirDesc: "Évalue la proportion élémentaire globale d'après les points simples et doubles du tracé.",
    elementFire: "Feu (Nār)",
    elementAir: "Air (Hawā')",
    elementWater: "Eau (Mā')",
    elementEarth: "Terre (Turāb)",
    dominantElementTitle: "Élément Dominant du Thème :",
    temperamentTitle: "Tempérament Psychospirituel :",
    remedyPrescriptionTitle: "Prescription d'Équilibrage :",

    subMizanMizan: "Juge Suprême (Mizan al-Mizan)",
    subMizanMizanDesc: "Calcule la 17ème et 18ème maison cachée du thème pour trancher définitivement les doutes.",
    house17Title: "17ème Maison (Tranchant du Juge / Rayonnement M1+M15)",
    house18Title: "18ème Maison (Clé de Voûte Cachée & Issue Ultime M4+M17)",
    supremeResolutionTitle: "Verdict Final Inébranlable :",

    subInqilab: "Mutation des Figures (Inqilab)",
    subInqilabDesc: "Analyse les déplacements, migrations et répétitions d'une figure d'une maison à l'autre.",
    inqilabFound: "Migrations Énergétiques Observées",
    noInqilab: "Aucune répétition multiple : le flux du thème est équilibré de façon linéaire.",

    // 2. Maghrebi Geomancy
    maghrebiSectionTitle: "Géomancie Maghrébine & Saharienne (Tradition Zanati)",
    maghrebiSectionDesc: "Méthodes traditionnelles d'Afrique du Nord reliant le sable aux cycles berbères, aux caravanes sahariennes et aux carrés magiques de protection.",

    // Maghrebi Sub-tools
    subSouss: "Dairat as-Souss (Calendrier Berbère)",
    subSoussDesc: "Cadran reliant les 16 figures au calendrier agraire berbère pour la datation temporelle exacte.",
    soussMonthLabel: "Mois Berbère Régent :",
    soussSeasonLabel: "Saison Agraire :",
    soussTimingLabel: "Estimation Temporelle de l'Événement :",

    subMizanGharb: "Mizan al-Gharb (Balance de l'Ouest)",
    subMizanGharbDesc: "Vérifie si le thème est stérile ou fertile selon la somme des maisons de fortune (M2, M8, M10, M11).",
    barakaIndexLabel: "Indice de Baraka & Prospérité",
    fertileStatus: "Thème Fertile & Prospère",
    sterileStatus: "Thème Exigeant / Stérile",

    subKhatamZanati: "Talisman de Zanati (Khatam ar-Raml)",
    subKhatamZanatiDesc: "Traduit les figures du thème final en carré magique 3x3 protecteur gravable.",
    zanatiKhadimLabel: "Ange Gardien (Khadim) du Sceau :",
    zanatiDivineNames: "Noms Divins Recteurs :",
    zanatiUsageGuide: "Mode d'Emploi : Écrire à l'encre de safran et d'eau de rose sur papier blanc un jeudi à l'aube.",

    subVoyage: "Voyage Saharien & Grandes Traversées",
    subVoyageDesc: "Analyse les déplacements de longue distance d'après les maisons 3, 9 et 12.",
    voyageDeparture: "Préparation & Départ (Maison 3)",
    voyageCrossing: "Traversée & Route Lointaine (Maison 9)",
    voyageSecurity: "Sécurité & Épreuves Cachées (Maison 12)",
    voyageSafeBadge: "Voyage Béni & Protégé",
    voyageCautionBadge: "Prudence & Vigilance Requises",
    voyageDuaLabel: "Invocation Protectrice du Voyageur :",

    subJiwar: "Conflits de Voisinage (Jiwar)",
    subJiwarDesc: "Évalue l'influence directe et court terme entre deux maisons adjacentes.",
    jiwarPeaceful: "Voisinage Harmonieux",
    jiwarCombative: "Frictions d'Éléments Voisins",
    jiwarTransformative: "Métamorphose Réciproque",

    // 3. African Geomancy (Fa, Ifa, Sikidy, Hakata)
    africanSectionTitle: "Géomancie Africaine (Fa, Ifa, Sikidy, Hakata)",
    africanSectionDesc: "Les grands corpus oraculaires d'Afrique de l'Ouest, de Madagascar et d'Afrique Australe unifiant la parole des Odus et la sagesse des ancêtres.",

    // African Sub-tools
    subOpele: "Opele Virtuel (Chaîne d'Ifa)",
    subOpeleDesc: "Simule le lancer de la chaîne yoruba à 8 demi-graines pour révéler l'un des 256 Odus.",
    btnCastOpele: "Lancer la Chaîne Sacrée d'Opele",
    castingOpele: "Lancer en cours dans l'éther sacré...",
    rightLegLabel: "Jambe Droite d'Ifa",
    leftLegLabel: "Jambe Gauche d'Ifa",
    revealedOduBadge: "Odu d'Ifa Révélé",

    subOponIfa: "Plateau Opon Ifa & Poudre Irosun",
    subOponIfaDesc: "Zone interactive pour tracer virtuellement dans la poudre sacrée d'Irosun avec la tête d'Eshu-Elegbara.",
    oponInstructions: "Touchez ou cliquez sur les 4 quadrants pour imprimer les marques simples (I) ou doubles (II) dans la poussière sacrée d'Irosun.",
    btnClearOpon: "Bénir & Lisser la Poudre d'Irosun",
    btnConfirmOponMarks: "Consacrer le Tracé d'Ifa",

    subAmuluOdus: "Encyclopédie des 256 Odus (Amulu Odus)",
    subAmuluOdusDesc: "Base de données complète des 256 combinaisons d'Ifa avec leurs récits initiatiques (Itan) et proverbes sacrés.",
    searchOduPlaceholder: "Rechercher un Odu par nom yoruba, fon ou proverbe...",
    filterAllMeji: "16 Meji Majeurs",
    filterAmulu: "Odus Mixtes (Amulu)",
    orishaLabel: "Divinité Protectrice (Orisha)",
    proverbLabel: "Proverbe Ancestral",
    itanLabel: "Récit Sacré (Itan)",
    warningLabel: "Avertissement Spirituel",
    tabooLabel: "Interdits & Tabous (Ewo)",

    subEbo: "Offrande d'Équilibre (Ebo)",
    subEboDesc: "Suggère les matériaux d'équilibrage, de purification et d'offrande rituelle recommandés pour rétablir l'harmonie.",
    eboIngredientsTitle: "Matériaux Rituels Recommandés :",
    eboPurposeTitle: "Finalité Spirituelle :",

    subHakata: "Hakata (Tablettes Shona d'Afrique Australe)",
    subHakataDesc: "Simule le jet des quatre tablettes sculptées sacrées : Kwami, Chilume, Nokwara et Chitokwadzima.",
    btnThrowHakata: "Jeter les 4 Tablettes d'Hakata",
    throwingHakata: "Les tablettes s'envolent dans les mains des Ancêtres...",
    tabletKwamiName: "Kwami (L'Homme Sage / Sceptre)",
    tabletChilumeName: "Chilume (Le Jeune Guerrier / Élan)",
    tabletNokwaraName: "Nokwara (La Mère / Fertilité)",
    tabletChitokwadzimaName: "Chitokwadzima (Le Vieillard / Seuil)",
    tabletFaceUp: "Face Ouverte (Active)",
    tabletFaceDown: "Face Cachée (Dormante)",
    hakataVerdictLabel: "Parole des Ancêtres Shona :",

    subSikidyRano: "Sikidy d'Eau (Sikidy Rano)",
    subSikidyRanoDesc: "Détermine les figures géomantiques mères d'après les ondulations de l'eau sacrée dans la calebasse des devins Antemoro.",
    btnGenerateWaterRipples: "Observer les Ondulations de l'Eau",
    waterRippleStep: "Génération de l'onde aquatique...",
    waterRippleInsight: "L'eau claire révèle la résonance des 4 Mères élémentaires.",

    subSikidyMalgache: "Sikidy Traditionnel de Madagascar",
    subSikidyMalgacheDesc: "Recrée le système divinatoire de Madagascar avec les termes traditionnels (Tale, Maly, Bilady, Sikidy Valo).",
    sikidyColumnsGrid: "Les 16 Maisons du Sikidy Malgache",

    subOduBirth: "Odu de Naissance (Ifa Astro / Odu Ori)",
    subOduBirthDesc: "Calcule l'Odu protecteur personnel combinant vos prénoms et votre date de naissance.",
    inputFullName: "Votre Nom et Prénoms Complets :",
    inputBirthDate: "Date de Naissance (JJ/MM/AAAA) :",
    btnCalculateOduOri: "Calculer mon Odu de Naissance (Ori)",
    oduOriTitle: "Votre Odu Protecteur de Naissance :",
    destinyPathTitle: "Chemin de Vie & Mission de l'Âme :",
    dailyTabooTitle: "Tabous & Interdits Quotidiens (Ewo) :"
  },

  en: {
    // Header & Meta
    headerBadge: "Master Geomancy Portal",
    mainTitle: "Advanced Geomancy of the Three Traditions",
    subtitle: "Comparative divination systems: Classical Arabic Ilm al-Raml, Maghrebi Zanati Seals & African Wisdom (Fa, Ifa, Sikidy).",

    // Main Tabs
    tabArabic: "🏛️ Classical Arabic",
    tabMaghrebi: "🏜️ Maghrebi (Zanati)",
    tabAfrican: "🌿 African (Fa, Ifa, Sikidy)",
    tabChart16: "📊 16 Houses Theme",

    // Common Actions & Tooltips
    btnGenerateNewChart: "Generate New Theme",
    btnRecalculate: "Recalculate Parameters",
    btnExportPDF: "Export Synthesis",
    btnCopyData: "Copy Results",
    copiedSuccess: "Results copied to clipboard!",
    activeFigureBadge: "Active Figure",
    houseLabel: "House",
    elementLabel: "Element",
    planetLabel: "Ruling Planet",
    natureLabel: "Nature & Movement",
    zodiacLabel: "Zodiac Sign",
    abjadLabel: "Abjad Value",

    // 1. Classical Arabic Geomancy
    arabicSectionTitle: "Classical Arabic Geomancy (Ilm al-Raml)",
    arabicSectionDesc: "The esoteric science passed down by desert masters to reveal hidden intentions, celestial aspects, and elemental harmony.",

    // Arabic Sub-tools
    subDamir: "Hidden Intention (Damir)",
    subDamirDesc: "Automatically extracts the querent's true underlying subconscious preoccupation.",
    damirFoundTitle: "Location of the Secret Damir:",
    damirInsightLabel: "Subconscious Revelation:",

    subTashteed: "Geomantic Aspects (Tashteed)",
    subTashteedDesc: "Identifies trines, oppositions, squares, and harmonic conjunctions across the chart.",
    aspectTrine: "Trine (120°) - Harmony & Blessing",
    aspectOpposition: "Opposition (180°) - Tension & Arbitration",
    aspectSquare: "Square (90°) - Challenge & Action",
    aspectConjunction: "Conjunction - Energy Transfer",
    aspectsCountLabel: "Major Aspects Detected",

    subMizanAnasir: "Elemental Balance (Mizan al-Anasir)",
    subMizanAnasirDesc: "Evaluates overall elemental distribution from single and double geomantic points.",
    elementFire: "Fire (Nār)",
    elementAir: "Air (Hawā')",
    elementWater: "Water (Mā')",
    elementEarth: "Earth (Turāb)",
    dominantElementTitle: "Dominant Element of Chart:",
    temperamentTitle: "Psychospiritual Temperament:",
    remedyPrescriptionTitle: "Balancing Prescription:",

    subMizanMizan: "Supreme Judge (Mizan al-Mizan)",
    subMizanMizanDesc: "Calculates the hidden 17th and 18th houses of the chart to resolve all doubts.",
    house17Title: "17th House (Judge's Radiance M1+M15)",
    house18Title: "18th House (Hidden Culmination M4+M17)",
    supremeResolutionTitle: "Final Infallible Verdict:",

    subInqilab: "Figure Mutations (Inqilab)",
    subInqilabDesc: "Analyzes the migrations, movements, and repetitions of figures between houses.",
    inqilabFound: "Energetic Migrations Observed",
    noInqilab: "No duplicate figures: theme flow is linearly harmonized.",

    // 2. Maghrebi Geomancy
    maghrebiSectionTitle: "Maghrebi & Saharan Geomancy (Zanati Tradition)",
    maghrebiSectionDesc: "North African ancestral methods linking sand casting to Berber calendars, Saharan caravans, and talismanic magic squares.",

    // Maghrebi Sub-tools
    subSouss: "Dairat as-Souss (Berber Calendar)",
    subSoussDesc: "Dial aligning the 16 figures with the Berber agrarian calendar for exact event timing.",
    soussMonthLabel: "Ruling Berber Month:",
    soussSeasonLabel: "Agrarian Season:",
    soussTimingLabel: "Estimated Event Realization Window:",

    subMizanGharb: "Mizan al-Gharb (Western Balance)",
    subMizanGharbDesc: "Checks whether the chart is fertile or barren based on the fortune houses (H2, H8, H10, H11).",
    barakaIndexLabel: "Baraka & Prosperity Index",
    fertileStatus: "Fertile & Blessed Theme",
    sterileStatus: "Exacting / Barren Theme",

    subKhatamZanati: "Zanati Talisman (Khatam ar-Raml)",
    subKhatamZanatiDesc: "Converts final theme figures into a protective 3x3 magic square ready for engraving.",
    zanatiKhadimLabel: "Guardian Angel (Khadim) of Seal:",
    zanatiDivineNames: "Governing Divine Names:",
    zanatiUsageGuide: "Instructions: Inscribe with saffron and rose water ink on clean white paper at dawn on a Thursday.",

    subVoyage: "Saharan Voyage & Long Journeys",
    subVoyageDesc: "Analyzes long-distance travels based on Houses 3, 9, and 12.",
    voyageDeparture: "Preparation & Departure (House 3)",
    voyageCrossing: "Distant Crossing & Desert (House 9)",
    voyageSecurity: "Safety & Hidden Perils (House 12)",
    voyageSafeBadge: "Blessed & Protected Journey",
    voyageCautionBadge: "Prudence & Vigilance Advised",
    voyageDuaLabel: "Traveler's Divine Protection Supplication:",

    subJiwar: "Neighborhood Conflicts (Jiwar)",
    subJiwarDesc: "Evaluates immediate short-term influence between adjacent houses.",
    jiwarPeaceful: "Harmonious Neighborhood",
    jiwarCombative: "Adjacent Elemental Clash",
    jiwarTransformative: "Reciprocal Metamorphosis",

    // 3. African Geomancy (Fa, Ifa, Sikidy, Hakata)
    africanSectionTitle: "African Geomancy (Fa, Ifa, Sikidy, Hakata)",
    africanSectionDesc: "Great oracular traditions of West Africa, Madagascar, and Southern Africa uniting Odu wisdom and ancestral guidance.",

    // African Sub-tools
    subOpele: "Virtual Opele (Ifa Chain)",
    subOpeleDesc: "Simulates casting the 8-pod Yoruba divination chain to reveal one of the 256 Odus.",
    btnCastOpele: "Cast Sacred Opele Chain",
    castingOpele: "Casting through sacred ether...",
    rightLegLabel: "Ifa Right Leg",
    leftLegLabel: "Ifa Left Leg",
    revealedOduBadge: "Revealed Ifa Odu",

    subOponIfa: "Opon Ifa Tray & Irosun Powder",
    subOponIfaDesc: "Interactive wooden board to mark single (I) or double (II) lines in sacred Irosun dust beneath Eshu's gaze.",
    oponInstructions: "Tap or click the 4 quadrants to imprint single (I) or double (II) sacred marks in Irosun powder.",
    btnClearOpon: "Bless & Smooth Irosun Powder",
    btnConfirmOponMarks: "Consecrate Ifa Marks",

    subAmuluOdus: "Encyclopedia of 256 Odus (Amulu Odus)",
    subAmuluOdusDesc: "Comprehensive database of all 256 Ifa Odus with ancestral stories (Itan) and sacred proverbs.",
    searchOduPlaceholder: "Search Odu by Yoruba, Fon name or keyword...",
    filterAllMeji: "16 Major Mejis",
    filterAmulu: "Mixed Odus (Amulu)",
    orishaLabel: "Ruling Deity (Orisha)",
    proverbLabel: "Ancestral Proverb",
    itanLabel: "Sacred Myth (Itan)",
    warningLabel: "Spiritual Warning",
    tabooLabel: "Taboos & Prohibitions (Ewo)",

    subEbo: "Equilibrium Offering (Ebo)",
    subEboDesc: "Prescribes ritual balancing materials, purifications, and offerings to restore cosmic harmony.",
    eboIngredientsTitle: "Recommended Ritual Materials:",
    eboPurposeTitle: "Spiritual Objective:",

    subHakata: "Hakata (Shona Divination Tablets)",
    subHakataDesc: "Simulates casting the 4 sacred carved tablets of Zimbabwe: Kwami, Chilume, Nokwara, and Chitokwadzima.",
    btnThrowHakata: "Cast 4 Hakata Tablets",
    throwingHakata: "Tablets tumbling in Ancestral hands...",
    tabletKwamiName: "Kwami (Wise Elder / Authority)",
    tabletChilumeName: "Chilume (Young Warrior / Action)",
    tabletNokwaraName: "Nokwara (Mother / Fertility)",
    tabletChitokwadzimaName: "Chitokwadzima (Elder / Threshold)",
    tabletFaceUp: "Face Up (Active)",
    tabletFaceDown: "Face Down (Dormant)",
    hakataVerdictLabel: "Word of the Shona Ancestors:",

    subSikidyRano: "Water Sikidy (Sikidy Rano)",
    subSikidyRanoDesc: "Extracts primordial mother figures from water ripples inside Antemoro diviner calabashes.",
    btnGenerateWaterRipples: "Observe Water Ripples",
    waterRippleStep: "Generating fluid water ripples...",
    waterRippleInsight: "Sacred water ripples reveal the 4 Elemental Mothers.",

    subSikidyMalgache: "Traditional Madagascar Sikidy",
    subSikidyMalgacheDesc: "Recreates the Malagasy divination layout with authentic terms (Tale, Maly, Bilady, Sikidy Valo).",
    sikidyColumnsGrid: "The 16 Houses of Malagasy Sikidy",

    subOduBirth: "Birth Odu (Ifa Astro / Odu Ori)",
    subOduBirthDesc: "Calculates your personal guardian Odu combining your name and birth date.",
    inputFullName: "Your Full Legal Name:",
    inputBirthDate: "Date of Birth (DD/MM/YYYY):",
    btnCalculateOduOri: "Calculate My Birth Odu (Ori)",
    oduOriTitle: "Your Personal Guardian Birth Odu:",
    destinyPathTitle: "Life Destiny & Soul Calling:",
    dailyTabooTitle: "Daily Taboos & Dietary Cautions (Ewo):"
  },

  ha: {
    // Header & Meta
    headerBadge: "Babban Zauren Ilimin Ramli da Duba",
    mainTitle: "Cikakken Ilimin Ramli na Hanyoyi Uku",
    subtitle: "Kwatanta hanyoyin duba: Ramlin Larabawa, Hatimin Zanati na Magariba da Hikimar Afirka (Fa, Ifa, Sikidy).",

    // Main Tabs
    tabArabic: "🏛️ Ramlin Larabawa",
    tabMaghrebi: "🏜️ Magariba (Zanati)",
    tabAfrican: "🌿 Afirka (Fa, Ifa, Sikidy)",
    tabChart16: "📊 Teburin Gidaje 16",

    // Common Actions & Tooltips
    btnGenerateNewChart: "Fara Sabon Teburin Ramli",
    btnRecalculate: "Sake Lissafa Dokoki",
    btnExportPDF: "Fitar da Sakamako",
    btnCopyData: "Kwafi Bayanai",
    copiedSuccess: "An kwafi sakamakon zuwa allo!",
    activeFigureBadge: "Siffar da ke Aiki",
    houseLabel: "Gida",
    elementLabel: "Yanayi",
    planetLabel: "Tauraro Mai Sarauta",
    natureLabel: "Dabi'a da Motsi",
    zodiacLabel: "Burji",
    abjadLabel: "Lissafin Abjad",

    // 1. Classical Arabic Geomancy
    arabicSectionTitle: "Ilimin Ramlin Larabawa na Asali (Ilm al-Raml)",
    arabicSectionDesc: "Hikimar boye ta malaman hamada domin gano boyayyen nufi, alakar taurari da daidaiton yanayi.",

    // Arabic Sub-tools
    subDamir: "Boyayyen Nufi (Damir)",
    subDamirDesc: "Gano ainihin abin da ke damun zuciyar mai tambaya a boye.",
    damirFoundTitle: "Wurin da Boyayyen Damir Yake:",
    damirInsightLabel: "Bayanin Abin da ke Zuciya:",

    subTashteed: "Kusurwoyin Ramli (Tashteed)",
    subTashteedDesc: "Gano fuskoki na nasara, adawa, cikas da hadin gwiwa tsakanin gidaje.",
    aspectTrine: "Kusurwar 120° - Nasara da Albarka",
    aspectOpposition: "Kusurwar 180° - Gaba da Sulhu",
    aspectSquare: "Kusurwar 90° - Kalubale da Aiki",
    aspectConjunction: "Gamayya - Isar da Karfi",
    aspectsCountLabel: "Kusurwoyin da aka Gano",

    subMizanAnasir: "Awo na Yanayi (Mizan al-Anasir)",
    subMizanAnasirDesc: "Lissafin rabon Wuta, Iska, Ruwa da Kasa daga digogin ramli.",
    elementFire: "Wuta (Nār)",
    elementAir: "Iska (Hawā')",
    elementWater: "Ruwa (Mā')",
    elementEarth: "Kasa (Turāb)",
    dominantElementTitle: "Yanayin da ya Fi Karfi a Teburi:",
    temperamentTitle: "Yanayin Hali da Dabi'ar Dan Adam:",
    remedyPrescriptionTitle: "Maganin Daidaita Yanayi:",

    subMizanMizan: "Babban Alkali (Mizan al-Mizan)",
    subMizanMizanDesc: "Lissafa gida na 17 da na 18 domin yanke hukunci da kawar da shakka.",
    house17Title: "Gida na 17 (Hasken Alkali G1+G15)",
    house18Title: "Gida na 18 (Sirrin Karshe G4+G17)",
    supremeResolutionTitle: "Hukunci na Karshe da ba ya Canzawa:",

    subInqilab: "Sauyin Siffofi (Inqilab)",
    subInqilabDesc: "Nazarin yadda siffa ke motsawa ko maimaita kanta daga wannan gida zuwa wancan.",
    inqilabFound: "Motsin Siffofi da aka Gano",
    noInqilab: "Babu maimaita siffa: teburin yana tafiya cikin tsari madaidaici.",

    // 2. Maghrebi Geomancy
    maghrebiSectionTitle: "Ramlin Magariba da Hamada (Hanyar Zanati)",
    maghrebiSectionDesc: "Hanyoyin Arewacin Afirka masu hada kasa da watannin Berber, matafiyan hamada da hatimin kariya.",

    // Maghrebi Sub-tools
    subSouss: "Dairat as-Souss (Kalandar Berber)",
    subSoussDesc: "Kayan lissafin lokaci mai hada siffofi 16 da watannin noma na Berber domin sanin ranar biyan bukata.",
    soussMonthLabel: "Watan Berber Mai Sarauta:",
    soussSeasonLabel: "Lokacin Shekara:",
    soussTimingLabel: "Kimanin Lokacin Biyan Bukata:",

    subMizanGharb: "Mizan al-Gharb (Awon Yamma)",
    subMizanGharbDesc: "Duba ko teburi yana da albarka ko jinkiri bisa lissafin gidajen arziki (G2, G8, G10, G11).",
    barakaIndexLabel: "Kashin Albarka da Arziki",
    fertileStatus: "Teburi Mai Yawan Albarka da Bude Kofa",
    sterileStatus: "Teburi Mai Bukatar Sadaka da Hakuri",

    subKhatamZanati: "Hatimin Zanati na Kariya (Khatam ar-Raml)",
    subKhatamZanatiDesc: "Mayar da siffofin karshe zuwa hatimi 3x3 na kariya da budi.",
    zanatiKhadimLabel: "Mala'ika Mai Tsaron Hatimi (Khadim):",
    zanatiDivineNames: "Kyawawan Sunayen Allah Masu Sarauta:",
    zanatiUsageGuide: "Yadda ake amfani da shi: Rubuta da ruwan zafran da ruwan fure a kan farar takarda ranar Alhamis da asuba.",

    subVoyage: "Tafiyar Hamada da Doguwar Hanya",
    subVoyageDesc: "Nazarin tafiyar nesa bisa Gida na 3, 9 da 12.",
    voyageDeparture: "Shiri da Tashin Tafiya (Gida na 3)",
    voyageCrossing: "Tsallaka Hamada da Hanya (Gida na 9)",
    voyageSecurity: "Tsaro da Hadarin Boye (Gida na 12)",
    voyageSafeBadge: "Tafiya Mai Albarka da Kariya",
    voyageCautionBadge: "Ana Bukatar Kula da Tsaro",
    voyageDuaLabel: "Addu'ar Kariya ta Matafiyi:",

    subJiwar: "Hadin Gwiwar Makwabta (Jiwar)",
    subJiwarDesc: "Nazarin tasirin da gidaje biyu da ke kusa da juna ke yi wa juna.",
    jiwarPeaceful: "Zaman Lafiyar Makwabtaka",
    jiwarCombative: "Karon Yanayi Tsakanin Makwabta",
    jiwarTransformative: "Sauyi Mai Kyau Tsakanin Gidaje",

    // 3. African Geomancy (Fa, Ifa, Sikidy, Hakata)
    africanSectionTitle: "Duban Afirka na Asali (Fa, Ifa, Sikidy, Hakata)",
    africanSectionDesc: "Babban ilimin duba na Yammacin Afirka, Madagascar da Kudancin Afirka mai hada maganar Odus da albarkar kakanni.",

    // African Sub-tools
    subOpele: "Sarkar Opele ta Ifa (Virtual Opele)",
    subOpeleDesc: "Jefa sarkar Ifa mai 'ya'ya 8 domin fitar da daya daga cikin Odus 256.",
    btnCastOpele: "Jefa Sarkar Opele Mai Albarka",
    castingOpele: "Ana jefa sarkar a sararin samaniya...",
    rightLegLabel: "Kafar Dama ta Ifa",
    leftLegLabel: "Kafar Hagu ta Ifa",
    revealedOduBadge: "Odu na Ifa da ya Bayyana",

    subOponIfa: "Faranti na Opon Ifa da Hodar Irosun",
    subOponIfaDesc: "Faranti na katako domin zana layi daya (I) ko biyu (II) a cikin hodar Irosun a gaban Eshu.",
    oponInstructions: "Taba wuraren 4 domin zana layi daya (I) ko biyu (II) a cikin hodar Irosun.",
    btnClearOpon: "Share da Tsarkake Hodar Irosun",
    btnConfirmOponMarks: "Tabbatar da Zanen Ifa",

    subAmuluOdus: "Kundin Ilmi na Odus 256 (Amulu Odus)",
    subAmuluOdusDesc: "Cikakken kundin bayanan dukkan Odus 256 tare da labarun asali (Itan) da karin magana.",
    searchOduPlaceholder: "Nemi Odu da sunan Yoruba, Fon ko kalma...",
    filterAllMeji: "Meji 16 na Asali",
    filterAmulu: "Odus Masu Hadin Gwiwa (Amulu)",
    orishaLabel: "Gunkin Kariya (Orisha)",
    proverbLabel: "Karin Maganar Kakanni",
    itanLabel: "Labarin Asiri (Itan)",
    warningLabel: "Gargadin Ruhi",
    tabooLabel: "Abubuwan da aka Haramta (Ewo)",

    subEbo: "Sadakar Daidaito (Ebo)",
    subEboDesc: "Kayan sadaka da tsarkakewa da aka bada shawara domin dawo da zaman lafiya da albarka.",
    eboIngredientsTitle: "Kayan Sadaka da ake Bukata:",
    eboPurposeTitle: "Babban Makasudin Sadaka:",

    subHakata: "Allunan Hakata na Shona (Kudancin Afirka)",
    subHakataDesc: "Jefa alluna 4 na katako: Kwami, Chilume, Nokwara da Chitokwadzima.",
    btnThrowHakata: "Jefa Allunan Hakata 4",
    throwingHakata: "Alluna na juyawa a hannun Kakanni...",
    tabletKwamiName: "Kwami (Dattijo / Sarauta)",
    tabletChilumeName: "Chilume (Saurayi Jarumi / Aiki)",
    tabletNokwaraName: "Nokwara (Uwa / Haihuwa)",
    tabletChitokwadzimaName: "Chitokwadzima (Tsoho / Karshen Zamani)",
    tabletFaceUp: "A Bude (Tana Aiki)",
    tabletFaceDown: "A Rufe (Tana Barci)",
    hakataVerdictLabel: "Maganar Kakannin Shona:",

    subSikidyRano: "Duban Ruwa (Sikidy Rano)",
    subSikidyRanoDesc: "Fitar da siffofin asali daga motsin ruwa a cikin kwaryar masana Antemoro.",
    btnGenerateWaterRipples: "Kalli Motsin Ruwa Mai Tsarki",
    waterRippleStep: "Ruwa yana bayyana motsin asiri...",
    waterRippleInsight: "Ruwan tsarki ya bayyana siffofin Uwaye 4.",

    subSikidyMalgache: "Duban Sikidy na Madagascar",
    subSikidyMalgacheDesc: "Sake fasalin tsarin duba na Madagascar da kalmomin asali (Tale, Maly, Bilady, Sikidy Valo).",
    sikidyColumnsGrid: "Gidaje 16 na Sikidy na Madagascar",

    subOduBirth: "Odu na Haihuwa (Ifa Astro / Odu Ori)",
    subOduBirthDesc: "Lissafa Odu na kariya mai kula da kanka ta hanyar hada sunanka da ranar haihuwarka.",
    inputFullName: "Cikakken Sunanka na Gaskiya:",
    inputBirthDate: "Ranar Haihuwa (Rana/Wata/Shekara):",
    btnCalculateOduOri: "Lissafa Odu na Haihuwata (Ori)",
    oduOriTitle: "Odu na Kariyarka na Haihuwa:",
    destinyPathTitle: "Hanyar Rayuwa da Nufin Ruhi:",
    dailyTabooTitle: "Abubuwan da ya Kamata ka Kiyaye (Ewo):"
  }
};
