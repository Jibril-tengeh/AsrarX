export interface DiscretionTranslation {
  pageTitle: string;
  pageSubtitle: string;
  headerBadge: string;
  backToTools: string;

  tabs: {
    khatamKhumm: string;
    hissnAql: string;
    tarkibHarfi: string;
    usturlabAsrar: string;
  };

  noticeTitle: string;
  noticeText: string;

  // 1. Khatam al-Khumm
  khumm: {
    title: string;
    subtitle: string;
    inputLabel: string;
    inputPlaceholder: string;
    analyzeBtn: string;
    statsMuteLetters: string;
    statsAbjadValue: string;
    statsMuteRatio: string;
    lettersListTitle: string;
    all19LettersNotice: string;
    sealStyle: string;
    themeGold: string;
    themeEmerald: string;
    themeObsidian: string;
    themeParchment: string;
    strokeWidth: string;
    rotation: string;
    showNodeLabels: string;
    showLines: string;
    downloadSeal: string;
    copyFormula: string;
    formulaCopied: string;
    explanationTitle: string;
    explanationBody: string;
    the19MuteLettersList: string;
    virtuesTitle: string;
    virtue1: string;
    virtue2: string;
    virtue3: string;
  };

  // 2. Hissn al-Aql
  hissn: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    motherLabel: string;
    motherPlaceholder: string;
    intentionLabel: string;
    intentionPlaceholder: string;
    calculateBtn: string;
    gridSizeLabel: string;
    grid3x3: string;
    grid4x4: string;
    resultsTitle: string;
    totalAbjad: string;
    clarityScore: string;
    dominantElement: string;
    shieldIndex: string;
    gridTitle: string;
    elementalBalanceTitle: string;
    airClarity: string;
    waterCalm: string;
    earthGrounding: string;
    fireFocus: string;
    awradTitle: string;
    awradDesc: string;
    downloadGrid: string;
    explanationTitle: string;
    explanationBody: string;
  };

  // 3. Al-Tarkib al-Harfi
  tarkib: {
    title: string;
    subtitle: string;
    inputLabel: string;
    inputPlaceholder: string;
    generateBtn: string;
    extractedConsonants: string;
    themeLabel: string;
    themeObsidianGold: string;
    themeEmeraldGlow: string;
    themeRoyalRuby: string;
    themeMidnightSilver: string;
    thicknessLabel: string;
    spacingLabel: string;
    rotationAngle: string;
    showMandalaRings: string;
    downloadGlyph: string;
    copyConsonants: string;
    glyphAnalysisTitle: string;
    consonantTableLetter: string;
    consonantTableValue: string;
    consonantTableElement: string;
    consonantTableRole: string;
    symbolicMeaningTitle: string;
    symbolicMeaningBody: string;
  };

  // 4. Usturlab al-Asrar
  usturlab: {
    title: string;
    subtitle: string;
    azimuthLabel: string;
    liveGeoBtn: string;
    geoActive: string;
    manualMode: string;
    activeLetter: string;
    celestialMansion: string;
    skyDirection: string;
    discretionLevel: string;
    dominantElement: string;
    astrolabeDialTitle: string;
    guidanceTitle: string;
    guidanceBody: string;
    timeWindow: string;
    recommendedDhikr: string;
    mansionDetails: string;
  };
}

export const DISCRETION_TRANSLATIONS: Record<'fr' | 'en' | 'ha', DiscretionTranslation> = {
  fr: {
    pageTitle: "Discrétion et Protection Mentale",
    pageSubtitle: "Ingénierie hermétique de scellement, barrière psychologique, monogramme harfi et astrolabe céleste d'Abjad.",
    headerBadge: "Protection & Discrétion Absolue",
    backToTools: "Retour aux Outils",

    tabs: {
      khatamKhumm: "Khatam al-Khumm (Sceau Muet)",
      hissnAql: "Hissn al-Aql (Barrière Mentale)",
      tarkibHarfi: "Al-Tarkib al-Harfi (Monogramme)",
      usturlabAsrar: "Usturlab al-Asrar (Astrolabe)"
    },

    noticeTitle: "Principe du Kitmān (Discrétion Sacrée)",
    noticeText: "Ces 4 modules s'appuient sur la tradition ésotérique d'Al-Buni et de la science des lettres pour assurer la préservation du secret, le calme psychologique et la protection contre le mauvais œil et la distraction.",

    // 1. Khatam al-Khumm
    khumm: {
      title: "Khatam al-Khumm - Le Sceau des 19 Lettres Muettes",
      subtitle: "Générez un tracé polygonal sacré fondé sur les 19 lettres muettes (Al-Hurūf Al-Sāmitah) pour voiler vos secrets et protéger votre esprit.",
      inputLabel: "Intention ou Nom à Voiler :",
      inputPlaceholder: "Ex: Protection mentale, Kitmān, Ahmad...",
      analyzeBtn: "Générer le Sceau Muet",
      statsMuteLetters: "Lettres Muettes Extraites",
      statsAbjadValue: "Poids Abjad Muet (V-Khumm)",
      statsMuteRatio: "Ratio de Discrétion Muette",
      lettersListTitle: "Composition des Lettres Muettes Présentes :",
      all19LettersNotice: "Toutes les 19 lettres muettes sont mobilisées dans le matrice du sceau.",
      sealStyle: "Style du Sceau :",
      themeGold: "Or Céleste & Émeraude",
      themeEmerald: "Émeraude Profonde",
      themeObsidian: "Obsidienne & Or",
      themeParchment: "Parchemin Mystique",
      strokeWidth: "Épaisseur du Tracé :",
      rotation: "Angle de Rotation :",
      showNodeLabels: "Afficher les Lettres sur les Sommets",
      showLines: "Afficher la Toile de Connexions",
      downloadSeal: "Télécharger le Sceau (SVG/PNG)",
      copyFormula: "Copier la Formule Mue",
      formulaCopied: "Formule copiée dans le presse-papier !",
      explanationTitle: "Signification Traditionnelle du Sceau Muet",
      explanationBody: "Les 19 lettres muettes (ب، ج، د، و، ز، ح، ط، ي، ك، ل، م، ن، س، ع، ف، ص، ق، ر، ش) sont reconnues dans la théurgie d'Al-Buni pour leur absence de friction sonore stridente. Elles forment le voile de discrétion par excellence (Kitmān al-Sirr).",
      the19MuteLettersList: "Les 19 lettres : Bā, Jīm, Dāl, Wāw, Zāy, Ḥā, Ṭā, Yā, Kāf, Lām, Mīm, Nūn, Sīn, Ayn, Fā, Ṣād, Qāf, Rā, Shīn.",
      virtuesTitle: "Vertus de Protection & Discrétion :",
      virtue1: "Neutralise la curiosité indiscrète et le mauvais œil (Al-Ayn).",
      virtue2: "Instaure un silence mental et apaise le flux de pensées parasites.",
      virtue3: "Scelle les intentions sacrées avant leur concrétisation."
    },

    // 2. Hissn al-Aql
    hissn: {
      title: "Hissn al-Aql - Barrière Mentale & Grille de Fortification",
      subtitle: "Calculez une grille de stabilisation psychologique basée sur votre Abjad personnel pour fortifier l'esprit face au stress et aux attaques psychiques.",
      nameLabel: "Votre Prénom :",
      namePlaceholder: "Ex: Ibrahim",
      motherLabel: "Nom de la Mère :",
      motherPlaceholder: "Ex: Amina",
      intentionLabel: "Foyer de Tension / Intention :",
      intentionPlaceholder: "Ex: Sérénité, Clarté, Concentration...",
      calculateBtn: "Calculer la Barrière Mentale",
      gridSizeLabel: "Dimension de la Grille :",
      grid3x3: "Grille 3x3 (Wafq Muthallath)",
      grid4x4: "Grille 4x4 (Wafq Murabba)",
      resultsTitle: "Bilan de Fortification Psychologique",
      totalAbjad: "Poids Abjad Total (N)",
      clarityScore: "Indice de Clarté d'Esprit",
      dominantElement: "Élément Psychique Dominant",
      shieldIndex: "Niveau du Bouclier Mental",
      gridTitle: "Matrice de Stabilisation Psychologique (Hissn al-Aql)",
      elementalBalanceTitle: "Répartition Élémentaire du Psychisme :",
      airClarity: "Air (Clarté & Lucidité)",
      waterCalm: "Eau (Sérénité & Calme)",
      earthGrounding: "Terre (Ancrage & Stabilité)",
      fireFocus: "Feu (Volonté & Focus)",
      awradTitle: "Invocations de Maintien (Awrad al-Aql) :",
      awradDesc: "Répétez ces Noms Divins pour sceller la stabilité de votre esprit :",
      downloadGrid: "Télécharger la Grille (HD)",
      explanationTitle: "Fonctionnement du Hissn al-Aql",
      explanationBody: "En combinant le poids numérique de votre nom et de celui de votre mère, la matrice harmonise les 4 éléments de votre tempérament pour faire barrage aux doutes, à l'anxiété et aux suggestions parasites (Waswas)."
    },

    // 3. Al-Tarkib al-Harfi
    tarkib: {
      title: "Al-Tarkib al-Harfi - Monogramme Abrégé & Glyphe Abstrait",
      subtitle: "Empilez et fusionnez géométriquement les consonnes d'un nom en un glyphe abstrait unique pour porter discrètement votre sceau personnel.",
      inputLabel: "Entrez un Prénom ou Mot-Clé :",
      inputPlaceholder: "Ex: Muhammad, Yusuf, Zakariya...",
      generateBtn: "Générer le Monogramme",
      extractedConsonants: "Consonnes Extraites & Poids :",
      themeLabel: "Palette Chromatique :",
      themeObsidianGold: "Obsidienne & Feuille d'Or",
      themeEmeraldGlow: "Émeraude Mystique",
      themeRoyalRuby: "Rubis Impérial",
      themeMidnightSilver: "Argent de Minuit",
      thicknessLabel: "Épaisseur des Traits :",
      spacingLabel: "Écartement des Couches :",
      rotationAngle: "Angle de Structuration :",
      showMandalaRings: "Anneaux Concentriques de Protection",
      downloadGlyph: "Exporter le Glyphe (SVG)",
      copyConsonants: "Copier la Suite Consonantique",
      glyphAnalysisTitle: "Analyse Structurelle du Monogramme",
      consonantTableLetter: "Lettre",
      consonantTableValue: "Valeur Abjad",
      consonantTableElement: "Élément",
      consonantTableRole: "Rôle Symbolique",
      symbolicMeaningTitle: "Secret de la Synthèse Monogrammatique",
      symbolicMeaningBody: "En condensant les consonnes vitales en un seul glyphe, le nom perd sa lisibilité extérieure directe tout en conservant l'intégralité de sa charge vibratoire spirituelle."
    },

    // 4. Usturlab al-Asrar
    usturlab: {
      title: "Usturlab al-Asrar - Astrolabe des Secrets Célestes",
      subtitle: "Convertissez en direct l'azimut du ciel local (0° à 360°) en lettres d'Abjad correspondantes pour capter l'alignement de discrétion céleste.",
      azimuthLabel: "Azimut Céleste Actuel (°)",
      liveGeoBtn: "Activer la Géolocalisation / Boussole",
      geoActive: "Boussole Céleste Active",
      manualMode: "Mode Réglage Manuel d'Azimut",
      activeLetter: "Lettre Abjad du Ciel",
      celestialMansion: "Demeure Céleste (Manzil)",
      skyDirection: "Direction Céleste",
      discretionLevel: "Indice de Discrétion",
      dominantElement: "Élément Actif",
      astrolabeDialTitle: "Cadran de l'Astrolabe Abjad",
      guidanceTitle: "Guidance & Alignement Spirituel du Moment",
      guidanceBody: "L'azimut actuel correspond à une fréquence abjadique optimale. Utilisez ce moment pour la méditation silencieuse, le dhikr du cœur et la protection mentale.",
      timeWindow: "Fenêtre d'Alignement Céleste :",
      recommendedDhikr: "Récitation Recommandée :",
      mansionDetails: "Détails de la Demeure Azimutale :"
    }
  },

  en: {
    pageTitle: "Discretion and Mental Protection",
    pageSubtitle: "Hermetic sealing engineering, psychological shield, harfi monogram, and Abjad celestial astrolabe.",
    headerBadge: "Absolute Protection & Discretion",
    backToTools: "Back to Tools",

    tabs: {
      khatamKhumm: "Khatam al-Khumm (Silent Seal)",
      hissnAql: "Hissn al-Aql (Mental Barrier)",
      tarkibHarfi: "Al-Tarkib al-Harfi (Monogram)",
      usturlabAsrar: "Usturlab al-Asrar (Astrolabe)"
    },

    noticeTitle: "Principle of Kitmān (Sacred Secrecy)",
    noticeText: "These 4 modules leverage the esoteric tradition of Al-Buni and the science of letters to ensure secret preservation, psychological calm, and protection against negative energies.",

    // 1. Khatam al-Khumm
    khumm: {
      title: "Khatam al-Khumm - Seal of the 19 Mute Letters",
      subtitle: "Generate a sacred polygonal diagram based exclusively on the 19 mute letters (Al-Hurūf Al-Sāmitah) to veil your secrets and guard your mind.",
      inputLabel: "Intention or Name to Veil:",
      inputPlaceholder: "E.g., Mental protection, Kitmān, Ahmad...",
      analyzeBtn: "Generate Silent Seal",
      statsMuteLetters: "Extracted Mute Letters",
      statsAbjadValue: "Mute Abjad Score (V-Khumm)",
      statsMuteRatio: "Discretion Ratio",
      lettersListTitle: "Mute Letters Composition:",
      all19LettersNotice: "All 19 mute letters are mobilized in the seal's matrix.",
      sealStyle: "Seal Theme:",
      themeGold: "Celestial Gold & Emerald",
      themeEmerald: "Deep Emerald",
      themeObsidian: "Obsidian & Gold",
      themeParchment: "Mystic Parchment",
      strokeWidth: "Line Thickness:",
      rotation: "Rotation Angle:",
      showNodeLabels: "Show Letters on Vertices",
      showLines: "Show Connection Web",
      downloadSeal: "Download Seal (SVG/PNG)",
      copyFormula: "Copy Mute Formula",
      formulaCopied: "Formula copied to clipboard!",
      explanationTitle: "Traditional Meaning of the Silent Seal",
      explanationBody: "The 19 mute letters (ب، ج، د، و، ز، ح، ط، ي، ك، ل، م، ن، س، ع، ف، ص، ق، ر، ش) are revered in Al-Buni's theurgy for their smooth acoustic resonance. They form the ultimate veil of discretion (Kitmān al-Sirr).",
      the19MuteLettersList: "The 19 letters: Bā, Jīm, Dāl, Wāw, Zāy, Ḥā, Ṭā, Yā, Kāf, Lām, Mīm, Nūn, Sīn, Ayn, Fā, Ṣād, Qāf, Rā, Shīn.",
      virtuesTitle: "Protective & Discretion Virtues:",
      virtue1: "Neutralizes unwanted curiosity and the evil eye (Al-Ayn).",
      virtue2: "Instills mental silence and quiets intrusive thoughts.",
      virtue3: "Seals sacred intentions prior to manifestation."
    },

    // 2. Hissn al-Aql
    hissn: {
      title: "Hissn al-Aql - Mental Barrier & Stabilization Grid",
      subtitle: "Calculate a psychological fortification grid based on your personal Abjad score to shield the mind against stress and psychic fatigue.",
      nameLabel: "Your First Name:",
      namePlaceholder: "E.g., Ibrahim",
      motherLabel: "Mother's Name:",
      motherPlaceholder: "E.g., Amina",
      intentionLabel: "Focus of Tension / Intention:",
      intentionPlaceholder: "E.g., Peace, Clarity, Focus...",
      calculateBtn: "Calculate Mental Barrier",
      gridSizeLabel: "Grid Dimension:",
      grid3x3: "3x3 Grid (Wafq Muthallath)",
      grid4x4: "4x4 Grid (Wafq Murabba)",
      resultsTitle: "Psychological Fortification Summary",
      totalAbjad: "Total Abjad Score (N)",
      clarityScore: "Clarity Score",
      dominantElement: "Dominant Psychic Element",
      shieldIndex: "Mental Shield Level",
      gridTitle: "Psychological Stabilization Matrix (Hissn al-Aql)",
      elementalBalanceTitle: "Psychic Elemental Distribution:",
      airClarity: "Air (Lucidity & Clarity)",
      waterCalm: "Water (Serenity & Calm)",
      earthGrounding: "Earth (Grounding & Stability)",
      fireFocus: "Fire (Willpower & Focus)",
      awradTitle: "Sustaining Invocations (Awrad al-Aql):",
      awradDesc: "Recite these Divine Names to solidify mental equilibrium:",
      downloadGrid: "Download Grid (HD)",
      explanationTitle: "How Hissn al-Aql Works",
      explanationBody: "By combining the numeric weights of your name and mother's name, the matrix harmonizes the 4 elements of your temperament, shielding you against doubt and anxiety (Waswas)."
    },

    // 3. Al-Tarkib al-Harfi
    tarkib: {
      title: "Al-Tarkib al-Harfi - Monogram & Abstract Glyph",
      subtitle: "Geometrically stack and merge the consonants of any name into a unique abstract glyph to carry a subtle personal seal.",
      inputLabel: "Enter First Name or Key Word:",
      inputPlaceholder: "E.g., Muhammad, Yusuf, Zakariya...",
      generateBtn: "Generate Monogram",
      extractedConsonants: "Extracted Consonants & Weights:",
      themeLabel: "Color Palette:",
      themeObsidianGold: "Obsidian & Gold Leaf",
      themeEmeraldGlow: "Mystic Emerald",
      themeRoyalRuby: "Imperial Ruby",
      themeMidnightSilver: "Midnight Silver",
      thicknessLabel: "Stroke Weight:",
      spacingLabel: "Layer Spacing:",
      rotationAngle: "Structuring Angle:",
      showMandalaRings: "Concentric Protective Rings",
      downloadGlyph: "Export Glyph (SVG)",
      copyConsonants: "Copy Consonant Sequence",
      glyphAnalysisTitle: "Monogram Structural Analysis",
      consonantTableLetter: "Letter",
      consonantTableValue: "Abjad Value",
      consonantTableElement: "Element",
      consonantTableRole: "Symbolic Role",
      symbolicMeaningTitle: "Secret of Monogram Synthesis",
      symbolicMeaningBody: "By condensing vital consonants into a single glyph, the name conceals its literal reading while preserving its full spiritual vibratory power."
    },

    // 4. Usturlab al-Asrar
    usturlab: {
      title: "Usturlab al-Asrar - Celestial Secret Astrolabe",
      subtitle: "Convert the real-time local sky azimuth (0° to 360°) into corresponding Abjad letters to align with celestial discretion.",
      azimuthLabel: "Current Celestial Azimuth (°)",
      liveGeoBtn: "Enable Live Compass / Location",
      geoActive: "Live Celestial Compass Active",
      manualMode: "Manual Azimuth Adjustment",
      activeLetter: "Sky Abjad Letter",
      celestialMansion: "Celestial Mansion (Manzil)",
      skyDirection: "Sky Direction",
      discretionLevel: "Discretion Index",
      dominantElement: "Active Element",
      astrolabeDialTitle: "Abjad Astrolabe Dial",
      guidanceTitle: "Real-time Spiritual Guidance",
      guidanceBody: "The current azimuth corresponds to an optimal Abjad frequency. Use this window for silent meditation, heart dhikr, and mental protection.",
      timeWindow: "Celestial Alignment Window:",
      recommendedDhikr: "Recommended Recitation:",
      mansionDetails: "Azimuthal Mansion Details:"
    }
  },

  ha: {
    pageTitle: "Tsantsan Sirri da Kariya ga Tunanin Mutum",
    pageSubtitle: "Tsarin kariya na al-Buni, gidan kariya na tunani, tambarin haruffa da agogon taurari na Abjad.",
    headerBadge: "Tsantsan Kariya da Sirri",
    backToTools: "Koma kan Kayan Aiki",

    tabs: {
      khatamKhumm: "Khatam al-Khumm (Hatimin Shiru)",
      hissnAql: "Hissn al-Aql (Ganuwar Tunani)",
      tarkibHarfi: "Al-Tarkib al-Harfi (Tambarin Haruffa)",
      usturlabAsrar: "Usturlab al-Asrar (Agogon Taurari)"
    },

    noticeTitle: "Ka'idar Kitmān (Rike Sirri)",
    noticeText: "Wadannan sassa 4 suna amfani da ilimin sirrin haruffa na Sheikh Ahmad al-Buni wajen kare sirri, samar da natsuwa a tunani da kariya daga mummuna idanu.",

    // 1. Khatam al-Khumm
    khumm: {
      title: "Khatam al-Khumm - Hatimin Haruffa 19 Masu Shiru",
      subtitle: "Qulla taswirar hatimin haruffa 19 masu shiru (Al-Hurūf Al-Sāmitah) domin rufa asirin zuciyarka da kare tunaninka.",
      inputLabel: "Niyya ko Suna da kake son Rufewa:",
      inputPlaceholder: "Misali: Kariya, Kitmān, Ahmad...",
      analyzeBtn: "Qulla Hatimin Shiru",
      statsMuteLetters: "Haruffan Shiru da aka Tsakuro",
      statsAbjadValue: "Lissafin Abjad na Shiru (V-Khumm)",
      statsMuteRatio: "Girman Sirri na Hatimi",
      lettersListTitle: "Tsarin Haruffan Shiru:",
      all19LettersNotice: "Dukkan haruffa 19 masu shiru suna cikin wannan hatimi.",
      sealStyle: "Lallin Hatimi:",
      themeGold: "Zarru da Algash",
      themeEmerald: "Algash Mai Zurfi",
      themeObsidian: "Bakin Duwatsu da Zarru",
      themeParchment: "Takardar Tsohon Sirri",
      strokeWidth: "Kaurin Layuka:",
      rotation: "Karkatar Hatimi:",
      showNodeLabels: "Nuna Haruffa a Soshi",
      showLines: "Nuna Zaren Sadarwa",
      downloadSeal: "Sauke Hatimi (SVG/PNG)",
      copyFormula: "Kwafi Tsarin Shiru",
      formulaCopied: "An kwafi tsarin sirri!",
      explanationTitle: "Ma'anar Hatimin Shiru a Ilimin Sirri",
      explanationBody: "Haruffa 19 masu shiru (ب، ج، د، و، ز، ح، ط، ي، ك، ل، م، ن، س، ع، ف، ص، ق، ر، ش) an san su a ilimin Sheikh Al-Buni wajen rufa asiri (Kitmān al-Sirr) da hana mummunan tunani.",
      the19MuteLettersList: "Haruffa 19: Bā, Jīm, Dāl, Wāw, Zāy, Ḥā, Ṭā, Yā, Kāf, Lām, Mīm, Nūn, Sīn, Ayn, Fā, Ṣād, Qāf, Rā, Shīn.",
      virtuesTitle: "Amfanin Hatimi wajen Kariya da Sirri:",
      virtue1: "Toge hassada, mutane masu gulma da mummunan ido (Al-Ayn).",
      virtue2: "Samar da tsantsan natsuwa da kwantar da hankali.",
      virtue3: "Rufa asirin tsantsan niyya kafin cikar ta."
    },

    // 2. Hissn al-Aql
    hissn: {
      title: "Hissn al-Aql - Ganuwar Kariya da Natsuar Tunani",
      subtitle: "Lissafa gidan kariya na tunani daga lissafin Abjad dinka domin jure wahalhalu, damuwa da tsoro.",
      nameLabel: "Sunanka:",
      namePlaceholder: "Misali: Ibrahim",
      motherLabel: "Sunan Mahaifiya:",
      motherPlaceholder: "Misali: Amina",
      intentionLabel: "Abinda kake son Gyarawa a Zuciya:",
      intentionPlaceholder: "Misali: Natsuwa, Hasken Zuciya...",
      calculateBtn: "Lissafa Ganuwar Kariya",
      gridSizeLabel: "Girman Gida:",
      grid3x3: "Gidan Wafq 3x3 (Muthallath)",
      grid4x4: "Gidan Wafq 4x4 (Murabba)",
      resultsTitle: "Taikaitaccen Bayanin Kariyar Zuciya",
      totalAbjad: "Jimillar Abjad (N)",
      clarityScore: "Makin Hasken Tunani",
      dominantElement: "Abincin Tunani Mai Rinjaye",
      shieldIndex: "Matakin Ganuwar Kariya",
      gridTitle: "Jadawalin Ganuwar Kariya na Tunani (Hissn al-Aql)",
      elementalBalanceTitle: "Rabrabawar Hali a Zuciya:",
      airClarity: "Iska (Hasken Tunani da Lucidite)",
      waterCalm: "Ruwa (Natsuwa da Sanyi)",
      earthGrounding: "Kasa (Tsaituwa da Kwarjini)",
      fireFocus: "Wuta (Karfin Niyya da Mayar da Hankali)",
      awradTitle: "Azkar na Kariya (Awrad al-Aql):",
      awradDesc: "Karanta wadannan Asma'ul Husna domin karfafa zuciyarka:",
      downloadGrid: "Sauke Gida (HD)",
      explanationTitle: "Yadda Hissn al-Aql ke Aiki",
      explanationBody: "Wannan jadawali yana daidaita halittar tunaninka ta hanyar lissafin sunanka da na mahaifiyarka domin kare ka daga damuwa, kokanto da waswasi."
    },

    // 3. Al-Tarkib al-Harfi
    tarkib: {
      title: "Al-Tarkib al-Harfi - Tambarin Haruffa na Sirri",
      subtitle: "Gula haruffan sunanka waje guda a matsayin tambari mai ban mamaki domin tafiya da shi a matsayin lallin sirri.",
      inputLabel: "Rubuta Suna ko Kalmar Sirri:",
      inputPlaceholder: "Misali: Muhammad, Yusuf, Zakariya...",
      generateBtn: "Gula Tambari",
      extractedConsonants: "Haruffan da aka Ciro da Nauyinsu:",
      themeLabel: "Zabin Launi:",
      themeObsidianGold: "Bakin Duwatsu da Zarru",
      themeEmeraldGlow: "Algash Mai Haske",
      themeRoyalRuby: "Ja Mai Martaba",
      themeMidnightSilver: "Azurfa ta Cikin Dare",
      thicknessLabel: "Kaurin Layuka:",
      spacingLabel: "Nisan Soshi:",
      rotationAngle: "Kwanar Juya Tambari:",
      showMandalaRings: "Zoborun Kariya na Sirri",
      downloadGlyph: "Sauke Tambari (SVG)",
      copyConsonants: "Kwafi Jerin Haruffa",
      glyphAnalysisTitle: "Binciken Tsarin Tambari",
      consonantTableLetter: "Harafi",
      consonantTableValue: "Lissafin Abjad",
      consonantTableElement: "Cali",
      consonantTableRole: "Ma'ana a Sirri",
      symbolicMeaningTitle: "Sirrin Tambarin Haruffa",
      symbolicMeaningBody: "Tattara haruffan sunan zuwa tambari guda daya yana boye ainihin rubutun ga mutane amma yana rike da karfin sirrinsa na ruhi."
    },

    // 4. Usturlab al-Asrar
    usturlab: {
      title: "Usturlab al-Asrar - Agogon Taurari na Sirrin Samaniya",
      subtitle: "Juyar da kwanar samaniya (0° zuwa 360°) zuwa haruffan Abjad duka domin sanin lokacin da ya dace na sirri da kariya.",
      azimuthLabel: "Kwanar Samaniya Yanzu (°)",
      liveGeoBtn: "Kunna Agogon Samaniya ta Waya",
      geoActive: "Agogon Samaniya Yana Aiki",
      manualMode: "Tattara Kwanar Samaniya da Hannu",
      activeLetter: "Harafin Abjad na Samaniya",
      celestialMansion: "Mazaunin Tauraro (Manzil)",
      skyDirection: "Bangaren Samaniya",
      discretionLevel: "Matakin Sirri",
      dominantElement: "Elementi Mai Karfi",
      astrolabeDialTitle: "Kayan Agogon Abjad",
      guidanceTitle: "Hasken Shiryarwa na Wannan Lokaci",
      guidanceBody: "Wannan kwana ta samaniya tana daidai da kyakkyawan harfin Abjad. Yi amfani da wannan lokaci wajen zikiri na zuciya, addu'a da neman kariya.",
      timeWindow: "Tsawon Lokacin Haske:",
      recommendedDhikr: "Zikirin da aka Shawarta:",
      mansionDetails: "Bayanin Mazaunin Samaniya:"
    }
  }
};
