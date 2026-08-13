export interface ThiebissabaTranslation {
  backToTools: string;
  headerBadge: string;
  pageTitle: string;
  pageSubtitle: string;
  noticeTitle: string;
  noticeText: string;
  copied: string;
  downloadSVG: string;
  copyReport: string;
  tabs: {
    traceTroisRangs: string;
    quatreMaisons: string;
    figuresMandingues: string;
    calculateurKadyo: string;
    analyseurSaraka: string;
    kounWaSen: string;
    chronometreTiming: string;
    fusionAbjad: string;
    kouroukanFouga: string;
    historique: string;
  };
  history: {
    title: string;
    subtitle: string;
    emptyText: string;
    clearHistory: string;
    reloadTheme: string;
    exportImage: string;
    itemIntention: string;
    itemResult: string;
    savedOn: string;
    deleteEntry: string;
  };
  trace: {
    title: string;
    subtitle: string;
    sandCanvasTitle: string;
    sandCanvasInstruction: string;
    clearSand: string;
    drawRandom: string;
    intentionInput: string;
    row1Label: string;
    row2Label: string;
    row3Label: string;
    dotsCount: string;
    parityOdd: string;
    parityEven: string;
    resultingFigure: string;
    element: string;
    nature: string;
    archetype: string;
    exportImage: string;
    exportSuccess: string;
    saveToHistory: string;
    savedInHistory: string;
  };
  maisons: {
    title: string;
    subtitle: string;
    house1Title: string;
    house1Role: string;
    house2Title: string;
    house2Role: string;
    house3Title: string;
    house3Role: string;
    house4Title: string;
    house4Role: string;
    generateTheme: string;
    themeSummary: string;
    overallBalance: string;
  };
  figures: {
    title: string;
    subtitle: string;
    archetypeManssa: string;
    archetypeMori: string;
    archetypeFama: string;
    archetypeBalla: string;
    archetypeDen: string;
    archetypeMusso: string;
    archetypeSogoma: string;
    archetypeKani: string;
    selectArchetype: string;
    rulerTitle: string;
    virtueTitle: string;
    elementTitle: string;
    sacredTree: string;
    totemAnimal: string;
  };
  kadyo: {
    title: string;
    subtitle: string;
    formulaTitle: string;
    formulaDesc: string;
    moduloMode: string;
    mod12: string;
    mod16: string;
    computeVerdict: string;
    verdictResult: string;
    spiritualMeaning: string;
    favorableAction: string;
    warningNotice: string;
  };
  saraka: {
    title: string;
    subtitle: string;
    sacrificeNature: string;
    colorRequired: string;
    recommendedQuantity: string;
    recipient: string;
    blessingFormula: string;
    actionAdvice: string;
  };
  kounWaSen: {
    title: string;
    subtitle: string;
    headLabel: string;
    footLabel: string;
    energyDirection: string;
    ascending: string;
    descending: string;
    balanced: string;
    ascDescDesc: string;
    impactTitle: string;
    recommendation: string;
  };
  timing: {
    title: string;
    subtitle: string;
    currentPhase: string;
    sogomaTitle: string;
    sogomaTime: string;
    sogomaDesc: string;
    teleKarabaTitle: string;
    teleKarabaTime: string;
    teleKarabaDesc: string;
    woulaTitle: string;
    woulaTime: string;
    woulaDesc: string;
    optimalHour: string;
    planetaryRuler: string;
    mystiqueMode: string;
    mystiqueToggle: string;
    mystiqueActive: string;
    mystiqueCoordinates: string;
    solarElevation: string;
    solarAzimuth: string;
    mystiqueStatusActive: string;
    mystiqueFetching: string;
    mystiquePermissionDenied: string;
  };
  fusion: {
    title: string;
    subtitle: string;
    userNameInput: string;
    abjadValue: string;
    overriddenHouse1: string;
    generatedTalisman: string;
    wafqGridTitle: string;
    sacredIncantation: string;
  };
  kouroukan: {
    title: string;
    subtitle: string;
    oathTitle: string;
    oathText: string;
    shieldProtection: string;
    zikrFrequency: string;
  };
}

export const THIEBISSABA_TRANSLATIONS: Record<'fr' | 'en' | 'ha', ThiebissabaTranslation> = {
  fr: {
    backToTools: "Retour aux Outils",
    headerBadge: "Tradition Géomantique Mandingue",
    pageTitle: "Tradition Thiebissaba (Cèbèsaba)",
    pageSubtitle: "Science sacrée des trois rangs, des 4 Maisons (Sô), des Archétypes Mandingues, du Verdict Kadyo et du Saraka de redressement.",
    noticeTitle: "Principe de la Tradition Thiebissaba",
    noticeText: "Le Thiebissaba repose sur l'harmonie entre l'esprit humain, la terre et le ciel. Chaque tracé doit être accompli avec intention pure et respect des lois d'aumône (Saraka).",
    copied: "Copié !",
    downloadSVG: "Télécharger le Sceau (SVG)",
    copyReport: "Copier l'Analyse Compréhensive",
    tabs: {
      traceTroisRangs: "Tracé 3 Rangs",
      quatreMaisons: "4 Maisons (Sô)",
      figuresMandingues: "Figures & Archétypes",
      calculateurKadyo: "Verdict Kadyo",
      analyseurSaraka: "Saraka (Charité)",
      kounWaSen: "Koun wa Sen (Énergie)",
      chronometreTiming: "Timing (3 Phases)",
      fusionAbjad: "Fusion Abjad",
      kouroukanFouga: "Sceau Kouroukan",
      historique: "Historique (10 Derniers)",
    },
    history: {
      title: "Historique des Thèmes Thiebissaba",
      subtitle: "Consultez et comparez vos 10 derniers tirages géomantiques sauvegardés automatiquement.",
      emptyText: "Aucun thème Thiebissaba enregistré pour le moment. Effectuez un tracé pour le retrouver ici.",
      clearHistory: "Effacer l'Historique",
      reloadTheme: "Charger ce Thème",
      exportImage: "Exporter en Image (PNG)",
      itemIntention: "Intention",
      itemResult: "Figure Récurrente",
      savedOn: "Enregistré le",
      deleteEntry: "Supprimer",
    },
    trace: {
      title: "Tracé Thiebissaba (Trois Rangs)",
      subtitle: "Simulez le tracé des trois lignes de points dans le sable ou sur papier pour calculer la parité (Impaire = 1 point, Paire = 2 points).",
      sandCanvasTitle: "Table de Sable Virtuelle",
      sandCanvasInstruction: "Cliquez sur la zone pour déposer des points ou générez un tracé intuitif.",
      clearSand: "Effacer le Sable",
      drawRandom: "Tracer par Impulsion",
      intentionInput: "Intention / Question du Tracé",
      row1Label: "Rang 1 (Tête - Koun)",
      row2Label: "Rang 2 (Cœur - Dousso)",
      row3Label: "Rang 3 (Pied - Sen)",
      dotsCount: "points",
      parityOdd: "Impair (1 point - Tek)",
      parityEven: "Pair (2 points - Gnan)",
      resultingFigure: "Figure Générée",
      element: "Élément Majeur",
      nature: "Nature Vibratoire",
      archetype: "Archétype Mandingue",
      exportImage: "Exporter la Carte en Image (PNG)",
      exportSuccess: "Image exportée avec succès !",
      saveToHistory: "Sauvegarder dans l'Historique",
      savedInHistory: "Enregistré dans l'Historique",
    },
    maisons: {
      title: "Quatre Maisons de Base (Sô)",
      subtitle: "Répartition des 4 figures fondatrices représentant le Consultant, les Biens, les Épreuves et l'Issue.",
      house1Title: "Sô 1 : N'Goro (Consultant)",
      house1Role: "État présent, pensée et énergie du demandeur.",
      house2Title: "Sô 2 : Nafolo (Les Biens & Vœux)",
      house2Role: "Acquisitions, prospérité, relation aux finances.",
      house3Title: "Sô 3 : Gueleya (Les Épreuves & Entraves)",
      house3Role: "Obstacles cachés, retards et résistances.",
      house4Title: "Sô 4 : Banan / Kadyo (L'Issue Final)",
      house4Role: "Résultat suprême et orientation du destin.",
      generateTheme: "Générer le Thème Complèt des 4 Maisons",
      themeSummary: "Synthèse du Thème des 4 Maisons",
      overallBalance: "Équilibre Global du Thème",
    },
    figures: {
      title: "Figures & Archétypes Mandingues",
      subtitle: "Exploration des figures sacrées du Manden et de leurs correspondances sociales et végétales.",
      archetypeManssa: "Manssa (Le Roi / Pouvoir Suprême)",
      archetypeMori: "Mori (Le Marabout / Guide Spirituel)",
      archetypeFama: "Fama (Le Guerrier / Chef d'Action)",
      archetypeBalla: "Balla (Le Sage / Griot Éloquent)",
      archetypeDen: "Dén (L'Enfant / Pureté & Nouveauté)",
      archetypeMusso: "Musso (La Femme / Matrice & Fécondité)",
      archetypeSogoma: "Sogoma (L'Aube / Messager)",
      archetypeKani: "Kani (La Victoire / Conquête)",
      selectArchetype: "Choisir une Figure à Examiner",
      rulerTitle: "Archétype & Rang",
      virtueTitle: "Vertu & Attributs",
      elementTitle: "Élément & Tempérament",
      sacredTree: "Arbre Totem / Sacré",
      totemAnimal: "Animal Totem",
    },
    kadyo: {
      title: "Calculateur du Kadyo (Verdict Suprême)",
      subtitle: "Somme algébrique des maisons Sô 1 + Sô 2 + Sô 3 modulos 12 ou 16 pour dégager la sentence géomantique.",
      formulaTitle: "Règle de Calcul du Kadyo",
      formulaDesc: "Kadyo = (Sô 1 + Sô 2 + Sô 3) mod N. Le résultat indique la porte de sortie de l'affaire.",
      moduloMode: "Mode de Modulo",
      mod12: "Modulo 12 (Ancienne Tradition Mandingue)",
      mod16: "Modulo 16 (Système Complet des 16 Figures)",
      computeVerdict: "Calculer le Verdict Kadyo",
      verdictResult: "Verdict Kadyo Obtenu",
      spiritualMeaning: "Signification Spirituelle & Sentence",
      favorableAction: "Conduite à Tenir Conseillée",
      warningNotice: "Avertissement Mystique",
    },
    saraka: {
      title: "Analyseur de Saraka (Charité de Redressement)",
      subtitle: "Identification de l'aumône équilibrante prescrite par la tradition pour ouvrir les chemins et lever les blocages.",
      sacrificeNature: "Nature de l'Aumône (Saraka)",
      colorRequired: "Couleur / Attribut Requis",
      recommendedQuantity: "Quantité / Nombre Symbolique",
      recipient: "Destinataire Privilégié",
      blessingFormula: "Formule de Bénédiction d'Aumône",
      actionAdvice: "Moment Conseillé pour Donner",
    },
    kounWaSen: {
      title: "Koun wa Sen (Tête et Pied - Flux d'Énergie)",
      subtitle: "Analyse du rapport entre la Tête (Koun - Rang 1) et le Pied (Sen - Rang 3) pour déterminer la polarité du tracé.",
      headLabel: "Tête (Koun - Ciel)",
      footLabel: "Pied (Sen - Terre)",
      energyDirection: "Orientation du Flux Énergétique",
      ascending: "Énergie Ascendante (Koun Superieur)",
      descending: "Énergie Descendante (Sen Superieur)",
      balanced: "Énergie Équilibrée (Mizan Parfait)",
      ascDescDesc: "L'énergie s'élève vers le spirituel et la renommée, favorisant l'élévation sociale et l'inspiration.",
      impactTitle: "Impact sur l'Entreprise",
      recommendation: "Conseil de Stabilisation",
    },
    timing: {
      title: "Chronomètre de Tracé (Timing Mandingue)",
      subtitle: "Déterminez le moment propice pour réaliser votre consultation ou vos rituels selon les 3 moments de la journée.",
      currentPhase: "Phase Actuelle de la Journée",
      sogomaTitle: "Sogoma (Matin / Aube)",
      sogomaTime: "06h00 - 10h00",
      sogomaDesc: "Propice aux démarrages, vœux de prospérité, mariages et nouvelles ouvertures.",
      teleKarabaTitle: "Tele-Karaba (Midi / Zénith)",
      teleKarabaTime: "11h30 - 14h00",
      teleKarabaDesc: "Moment de grande puissance pour les affaires de pouvoir, justice et trancher les conflits.",
      woulaTitle: "Woula (Crépuscule / Soir)",
      woulaTime: "17h00 - 20h00",
      woulaDesc: "Favorable à la protection, l'apaisement, la guérison et le pardon des rancœurs.",
      optimalHour: "Heure Optimale Recommandée",
      planetaryRuler: "Régent Céleste de la Phase",
      mystiqueMode: "Mode Mystique Céleste",
      mystiqueToggle: "Activer le Mode Mystique (GPS Céleste)",
      mystiqueActive: "Mode Mystique Céleste Actif",
      mystiqueCoordinates: "Coordonnées Géographiques",
      solarElevation: "Hauteur Solaire (Élévation)",
      solarAzimuth: "Azimut Solaire (Orientation)",
      mystiqueStatusActive: "Horloge réajustée selon les événements célestes (Lever / Zénith / Coucher de Soleil) locaux.",
      mystiqueFetching: "Obtention des coordonnées GPS pour l'alignement céleste...",
      mystiquePermissionDenied: "Géolocalisation refusée ou indisponible. Basculement sur l'heure système locale.",
    },
    fusion: {
      title: "Fusion Thiebissaba-Abjad",
      subtitle: "Incorporez la valeur numérique Abjad de votre prénom pour fertiliser et personnaliser la Maison 1 (Sô 1).",
      userNameInput: "Nom ou Prénom du Consultant",
      abjadValue: "Valeur Abjad Calculée",
      overriddenHouse1: "Sô 1 Personnalisé par l'Abjad",
      generatedTalisman: "Talisman Wafq Thiebissaba-Abjad",
      wafqGridTitle: "Matrice Sacrée du Nom & Kadyo",
      sacredIncantation: "Incantation de Scellement",
    },
    kouroukan: {
      title: "Sceau Kouroukan Fouga & Charte Mystique",
      subtitle: "Incantation sacrée et serment de protection des anciens rois du Manden.",
      oathTitle: "Serment de Kouroukan Fouga",
      oathText: "Par le ciel, le sable et le souffle des ancêtres, que la vérité prévale et que la charité détourne le malheur.",
      shieldProtection: "Forteresse de Protection Spirituelle",
      zikrFrequency: "Fréquence Rhythmique (BPM & Répétitions)",
    },
  },

  en: {
    backToTools: "Back to Tools",
    headerBadge: "Mandingue Geomantic Tradition",
    pageTitle: "Thiebissaba Tradition (Cèbèsaba)",
    pageSubtitle: "Sacred science of the three rows, the 4 Houses (Sô), Mandingue Archetypes, Kadyo Verdict, and balancing Saraka alms.",
    noticeTitle: "Principle of Thiebissaba Tradition",
    noticeText: "Thiebissaba relies on harmony between human spirit, earth, and sky. Every trace must be drawn with pure intention and respect for charity (Saraka).",
    copied: "Copied!",
    downloadSVG: "Download Seal (SVG)",
    copyReport: "Copy Comprehensive Analysis",
    tabs: {
      traceTroisRangs: "3 Rows Trace",
      quatreMaisons: "4 Houses (Sô)",
      figuresMandingues: "Figures & Archetypes",
      calculateurKadyo: "Kadyo Verdict",
      analyseurSaraka: "Saraka (Alms)",
      kounWaSen: "Koun wa Sen (Energy)",
      chronometreTiming: "Timing (3 Phases)",
      fusionAbjad: "Abjad Fusion",
      kouroukanFouga: "Kouroukan Seal",
      historique: "History (Last 10)",
    },
    history: {
      title: "Thiebissaba Themes History",
      subtitle: "View and compare your last 10 automatically saved geomantic charts.",
      emptyText: "No Thiebissaba theme recorded yet. Draw a trace to see it here.",
      clearHistory: "Clear History",
      reloadTheme: "Load This Theme",
      exportImage: "Export Image (PNG)",
      itemIntention: "Intention",
      itemResult: "Recurring Figure",
      savedOn: "Saved On",
      deleteEntry: "Delete",
    },
    trace: {
      title: "Thiebissaba Trace (Three Rows)",
      subtitle: "Simulate rapid dot tracing in sand or paper to calculate parity (Odd = 1 dot, Even = 2 dots).",
      sandCanvasTitle: "Virtual Sand Table",
      sandCanvasInstruction: "Click canvas area to drop dots or generate an intuitive pulse trace.",
      clearSand: "Clear Sand",
      drawRandom: "Pulse Trace",
      intentionInput: "Intention / Question for the Trace",
      row1Label: "Row 1 (Head - Koun)",
      row2Label: "Row 2 (Heart - Dousso)",
      row3Label: "Row 3 (Foot - Sen)",
      dotsCount: "dots",
      parityOdd: "Odd (1 dot - Tek)",
      parityEven: "Even (2 dots - Gnan)",
      resultingFigure: "Generated Figure",
      element: "Major Element",
      nature: "Vibrational Nature",
      archetype: "Mandingue Archetype",
      exportImage: "Export Chart as Image (PNG)",
      exportSuccess: "Image exported successfully!",
      saveToHistory: "Save to History",
      savedInHistory: "Saved in History",
    },
    maisons: {
      title: "Four Base Houses (Sô)",
      subtitle: "Distribution of the 4 founding figures representing the Seeker, Assets, Trials, and Final Outcome.",
      house1Title: "Sô 1: N'Goro (Seeker)",
      house1Role: "Present state, mind, and energy of the querent.",
      house2Title: "Sô 2: Nafolo (Assets & Wishes)",
      house2Role: "Acquisitions, prosperity, financial relationship.",
      house3Title: "Sô 3: Gueleya (Trials & Impediments)",
      house3Role: "Hidden obstacles, delays, and friction.",
      house4Title: "Sô 4: Banan / Kadyo (Final Outcome)",
      house4Role: "Supreme result and destiny orientation.",
      generateTheme: "Generate Complete 4 Houses Theme",
      themeSummary: "4 Houses Theme Summary",
      overallBalance: "Global Theme Balance",
    },
    figures: {
      title: "Mandingue Figures & Archetypes",
      subtitle: "Exploration of sacred Manden figures and their social and botanical correspondences.",
      archetypeManssa: "Manssa (The King / Supreme Power)",
      archetypeMori: "Mori (The Scholar / Spiritual Guide)",
      archetypeFama: "Fama (The Warrior / Military Chief)",
      archetypeBalla: "Balla (The Sage / Eloquent Bard)",
      archetypeDen: "Dén (The Child / Purity & New Start)",
      archetypeMusso: "Musso (The Woman / Matrix & Fertility)",
      archetypeSogoma: "Sogoma (Dawn / Messenger)",
      archetypeKani: "Kani (Victory / Conquest)",
      selectArchetype: "Select Figure to Examine",
      rulerTitle: "Archetype & Rank",
      virtueTitle: "Virtue & Attributes",
      elementTitle: "Element & Temperament",
      sacredTree: "Sacred / Totem Tree",
      totemAnimal: "Totem Animal",
    },
    kadyo: {
      title: "Kadyo Calculator (Supreme Verdict)",
      subtitle: "Algebraic sum of houses Sô 1 + Sô 2 + Sô 3 modulo 12 or 16 to reveal geomantic sentence.",
      formulaTitle: "Kadyo Calculation Rule",
      formulaDesc: "Kadyo = (Sô 1 + Sô 2 + Sô 3) mod N. Indicates the issue resolution gate.",
      moduloMode: "Modulo Mode",
      mod12: "Modulo 12 (Ancient Mandingue Tradition)",
      mod16: "Modulo 16 (Full 16 Figures System)",
      computeVerdict: "Calculate Kadyo Verdict",
      verdictResult: "Resulting Kadyo Verdict",
      spiritualMeaning: "Spiritual Meaning & Sentence",
      favorableAction: "Recommended Course of Action",
      warningNotice: "Mystical Warning",
    },
    saraka: {
      title: "Saraka Analyzer (Balancing Alms)",
      subtitle: "Identification of corrective alms prescribed by tradition to open roads and remove blockages.",
      sacrificeNature: "Nature of Alms (Saraka)",
      colorRequired: "Required Color / Attribute",
      recommendedQuantity: "Symbolic Quantity / Count",
      recipient: "Privileged Recipient",
      blessingFormula: "Alms Blessing Formula",
      actionAdvice: "Recommended Time for Giving",
    },
    kounWaSen: {
      title: "Koun wa Sen (Head and Foot - Energy Flow)",
      subtitle: "Analysis of the relationship between Head (Koun - Row 1) and Foot (Sen - Row 3) to determine polarity.",
      headLabel: "Head (Koun - Sky)",
      footLabel: "Foot (Sen - Earth)",
      energyDirection: "Energy Flow Direction",
      ascending: "Ascending Energy (Higher Koun)",
      descending: "Descending Energy (Higher Sen)",
      balanced: "Balanced Energy (Perfect Mizan)",
      ascDescDesc: "Energy rises toward spiritual elevation and renown, favoring social growth and inspiration.",
      impactTitle: "Impact on Enterprise",
      recommendation: "Stabilization Advice",
    },
    timing: {
      title: "Trace Chronometer (Mandingue Timing)",
      subtitle: "Determine auspicious timing for consultation or rituals across the 3 daily phases.",
      currentPhase: "Current Daily Phase",
      sogomaTitle: "Sogoma (Morning / Dawn)",
      sogomaTime: "06:00 AM - 10:00 AM",
      sogomaDesc: "Auspicious for fresh starts, prosperity wishes, marriages, and new openings.",
      teleKarabaTitle: "Tele-Karaba (Midday / Zenith)",
      teleKarabaTime: "11:30 AM - 02:00 PM",
      teleKarabaDesc: "High power phase for governance, justice matters, and resolving conflicts.",
      woulaTitle: "Woula (Dusk / Evening)",
      woulaTime: "05:00 PM - 08:00 PM",
      woulaDesc: "Favorable for protection, calming mind, healing, and forgiving grievances.",
      optimalHour: "Recommended Optimal Hour",
      planetaryRuler: "Celestial Phase Ruler",
      mystiqueMode: "Celestial Mystique Mode",
      mystiqueToggle: "Enable Mystique Mode (Celestial GPS)",
      mystiqueActive: "Celestial Mystique Mode Active",
      mystiqueCoordinates: "Geographic Coordinates",
      solarElevation: "Solar Elevation Angle",
      solarAzimuth: "Solar Azimuth Orientation",
      mystiqueStatusActive: "Clock re-aligned according to local celestial astronomical events (Sunrise / Solar Zenith / Sunset).",
      mystiqueFetching: "Obtaining GPS coordinates for celestial alignment...",
      mystiquePermissionDenied: "Geolocation denied or unavailable. Falling back to local system time.",
    },
    fusion: {
      title: "Thiebissaba-Abjad Fusion",
      subtitle: "Incorporate querent name Abjad value to fertilize and personalize House 1 (Sô 1).",
      userNameInput: "Querent Name",
      abjadValue: "Calculated Abjad Value",
      overriddenHouse1: "Sô 1 Personalized by Abjad",
      generatedTalisman: "Thiebissaba-Abjad Wafq Talisman",
      wafqGridTitle: "Sacred Matrix of Name & Kadyo",
      sacredIncantation: "Sealing Incantation",
    },
    kouroukan: {
      title: "Kouroukan Fouga Seal & Mystical Charter",
      subtitle: "Sacred incantation and oath of protection from ancient Manden kings.",
      oathTitle: "Oath of Kouroukan Fouga",
      oathText: "By the sky, sand, and ancestral breath, let truth prevail and charity turn away misfortune.",
      shieldProtection: "Spiritual Protection Fortress",
      zikrFrequency: "Rhythmic Frequency (BPM & Repetitions)",
    },
  },

  ha: {
    backToTools: "Koma zuwa Kayan Aiki",
    headerBadge: "Dukiyoyi da Aikin Duban Mandingue",
    pageTitle: "Al'adar Thiebissaba (Cèbèsaba)",
    pageSubtitle: "Ilimin sirri na layi uku, Gidaje 4 (Sô), Siffofin Mandingue, Hukuncin Kadyo, da Awo na Sadaka (Saraka).",
    noticeTitle: "Rarrabuwar Al'adar Thiebissaba",
    noticeText: "Thiebissaba ya dogara ne a kan daidaito tsakanin ruhi, kasa da samaniya. Kowane zane dole ne a yi shi da kyakkyawar niyya da girmama sadaka.",
    copied: "An kope!",
    downloadSVG: "Sauke Hatimi (SVG)",
    copyReport: "Kope Cikakken Rahoto",
    tabs: {
      traceTroisRangs: "Zana Layi 3",
      quatreMaisons: "Gidaje 4 (Sô)",
      figuresMandingues: "Siffofi da Haruffa",
      calculateurKadyo: "Hukuncin Kadyo",
      analyseurSaraka: "Saraka (Sadaka)",
      kounWaSen: "Koun wa Sen (Karfin Ruhi)",
      chronometreTiming: "Lokaci (Mabiya 3)",
      fusionAbjad: "Awon Abjad",
      kouroukanFouga: "Hatimin Kouroukan",
      historique: "Tarihin Aniyar (Guda 10)",
    },
    history: {
      title: "Tarihin Zanen Thiebissaba",
      subtitle: "Duba sannan ka kwatanta zanenku 10 na baya da aka adana ta atomatik.",
      emptyText: "Ba a adana wani zanen Thiebissaba ba tukuna. Yi sabon zane domin ya bayyana a nan.",
      clearHistory: "Goge Tarihi",
      reloadTheme: "Haɗa Wannan Zanen",
      exportImage: "Ajiye Hoton Zanen (PNG)",
      itemIntention: "Niyya",
      itemResult: "Siffar da ta Fito",
      savedOn: "An adana Ranar",
      deleteEntry: "Goge",
    },
    trace: {
      title: "Zanen Thiebissaba (Layi Uku)",
      subtitle: "Gwajin saurin zana ɗawafi a kan yashi ko takarda domin gano daidai ko maras daidai (Guda 1 = Tek, Guda 2 = Gnan).",
      sandCanvasTitle: "Teburin Yashi na Sirri",
      sandCanvasInstruction: "Danna kan yashi domin ajiye digo ko zana cikin sauri.",
      clearSand: "Goge Yashi",
      drawRandom: "Fara Zanen Tahiri",
      intentionInput: "Niyya ko Tambaya",
      row1Label: "Layi na 1 (Kai - Koun)",
      row2Label: "Layi na 2 (Zuciya - Dousso)",
      row3Label: "Layi na 3 (Kafa - Sen)",
      dotsCount: "digo-digo",
      parityOdd: "Maras Daidai (Guda 1 - Tek)",
      parityEven: "Mai Daidai (Guda 2 - Gnan)",
      resultingFigure: "Siffar da ta Fito",
      element: "Babban Mahadi",
      nature: "Yanayin Karfin Ruhi",
      archetype: "Babban Mazaunin Mandingue",
      exportImage: "Ajiye Katikati a Hoton (PNG)",
      exportSuccess: "An fitar da hoto cikin nasara!",
      saveToHistory: "Ajiye a Tarihi",
      savedInHistory: "An adana a Tarihi",
    },
    maisons: {
      title: "Gidaje guda Huda (Sô)",
      subtitle: "Rarraba siffofi guda 4 da suka shafi Mai Tambaya, Dukiya, Gwaji da Sakamakon Karshe.",
      house1Title: "Sô 1: N'Goro (Mai Tambaya)",
      house1Role: "Yanayin yanzu, tunani da karfin mai tambaya.",
      house2Title: "Sô 2: Nafolo (Dukiya da Buri)",
      house2Role: "Samun arziki, dukiya da nasarar kudi.",
      house3Title: "Sô 3: Gueleya (Gwajin Haniya)",
      house3Role: "Matsalolin boye da jinkiri a al'amari.",
      house4Title: "Sô 4: Banan / Kadyo (Sakamako)",
      house4Role: "Karshen al'amari da abin da zai faru.",
      generateTheme: "Haɗa Dukkan Gidaje 4",
      themeSummary: "Takaitaccen Bayanin Gidaje 4",
      overallBalance: "Cikakken Daidaiton Al'amari",
    },
    figures: {
      title: "Siffofi da Archtypes na Mandingue",
      subtitle: "Binciken siffofi masu tsarki na kasar Manden da dangantakarsu da bishiyoyi da dabbobi.",
      archetypeManssa: "Manssa (Sarki / Karfin Sarauta)",
      archetypeMori: "Mori (Malam / Mai Jagoranci)",
      archetypeFama: "Fama (Sarkin Yaki / Mai Aiki)",
      archetypeBalla: "Balla (Mai Hikima / Mai Magana)",
      archetypeDen: "Dén (Yaro / Tsarki da Sabon Fara)",
      archetypeMusso: "Musso (Mace / Mahaifiya da Albarka)",
      archetypeSogoma: "Sogoma (Asubahi / Mai Isar da Sako)",
      archetypeKani: "Kani (Nasarar Yaki)",
      selectArchetype: "Zaɓi Siffa domin Bincike",
      rulerTitle: "Archtype da Matsayi",
      virtueTitle: "Daraja da Siffofi",
      elementTitle: "Mahadi da Yanayi",
      sacredTree: "Bishiyar Tsarki",
      totemAnimal: "Dabba Mai Tsarki",
    },
    kadyo: {
      title: "Ma'aunin Kadyo (Hukuncin Karshe)",
      subtitle: "Tara lambobi na Sô 1 + Sô 2 + Sô 3 da raba su da 12 ko 16 don gano sakamako.",
      formulaTitle: "Tsarin Lissafin Kadyo",
      formulaDesc: "Kadyo = (Sô 1 + Sô 2 + Sô 3) mod N. Yana nuna hanyar fita daga al'amari.",
      moduloMode: "Yanayin Modulo",
      mod12: "Modulo 12 (Tsohuwar Al'adar Mandingue)",
      mod16: "Modulo 16 (Cikakken Tsarin Siffofi 16)",
      computeVerdict: "Lissafa Hukuncin Kadyo",
      verdictResult: "Hukuncin Kadyo da Aka Samu",
      spiritualMeaning: "Ma'anar Ruhi da Hukunci",
      favorableAction: "Hanyar da ya Kamata a Bi",
      warningNotice: "Gargadi na Sirri",
    },
    saraka: {
      title: "Binciken Saraka (Sadaka ta Gyaran Al'amari)",
      subtitle: "Gano nau'in sadakar da ta dace domin bude hanya da kauar da cikas.",
      sacrificeNature: "Nau'in Sadaka (Saraka)",
      colorRequired: "Launin da ake Buqata",
      recommendedQuantity: "Adadi mai Albarka",
      recipient: "Wanda ya Dace a Bawa",
      blessingFormula: "Addu'ar Sadaka",
      actionAdvice: "Lokacin da ya Dace a Bayar",
    },
    kounWaSen: {
      title: "Koun wa Sen (Kai da Kafa - Gwaji da Karfi)",
      subtitle: "Gwada haɗin kai tsakanin Kai (Koun - Layi 1) da Kafa (Sen - Layi 3) domin gano tafiyar karfi.",
      headLabel: "Kai (Koun - Sama)",
      footLabel: "Kafa (Sen - Kasa)",
      energyDirection: "Tafiyar Karfin Ruhi",
      ascending: "Karfi mai Hauwa Sama (Koun guda 1/2)",
      descending: "Karfi mai Sauka Kasa (Sen guda 1/2)",
      balanced: "Karfi mai Daidaito (Mizan)",
      ascDescDesc: "Karfi yana hauwa sama zuwa daukaka da kyakkyawan suna a tsakanin mutane.",
      impactTitle: "Tasiri a kan Kasuwanci da Buri",
      recommendation: "Shawarwari na Tabbatar da Karfi",
    },
    timing: {
      title: "Lokacin Zanen Sirri (Mandingue Timing)",
      subtitle: "Gano lokacin da ya fi dacewa domin gudanar da bincike ko addu'a a tsawon yini.",
      currentPhase: "Yanayin Yanzu na Yini",
      sogomaTitle: "Sogoma (Asubahi / Safe)",
      sogomaTime: "06:00 AM - 10:00 AM",
      sogomaDesc: "Yanayi mai kyau domin fara sabon al'amari, neman buqata da daurin aure.",
      teleKarabaTitle: "Tele-Karaba (Tsakar Rana)",
      teleKarabaTime: "11:30 AM - 02:00 PM",
      teleKarabaDesc: "Lokaci mai karfi domin warware shari'a, iko da yanke hukunci.",
      woulaTitle: "Woula (Yammaci / Magariba)",
      woulaTime: "05:00 PM - 08:00 PM",
      woulaDesc: "Mai kyau domin neman kariya, samun kwanciyar hankali da gafara.",
      optimalHour: "Mafi Kyawun Sa'a",
      planetaryRuler: "Tauraro Mai Mulki na Sa'a",
      mystiqueMode: "Yanayin Asirra na Samaniya",
      mystiqueToggle: "Kunna Yanayin Asirra (GPS na Samaniya)",
      mystiqueActive: "Yanayin Asirra na Samaniya yana Aiki",
      mystiqueCoordinates: "Mazaunin Taswira (GPS)",
      solarElevation: "Tsayin Rana a Samaniya",
      solarAzimuth: "Kwarin Rana da Jagora",
      mystiqueStatusActive: "An daidaita agogo bisa fitowar rana, tsakar rana da faɗuwar rana a wannan mazaunin.",
      mystiqueFetching: "Ana neman mazaunin GPS domin daidaita samaniya...",
      mystiquePermissionDenied: "An hana GPS. Coma kan agogon na'ura.",
    },
    fusion: {
      title: "Hada Thiebissaba da Abjad",
      subtitle: "Shigar da adadin Abjad na sunanka domin gyarawa da karfafa Gida na 1 (Sô 1).",
      userNameInput: "Sunan Mai Bincike",
      abjadValue: "Lissafin Abjad",
      overriddenHouse1: "Sô 1 da Aka Karfafa da Abjad",
      generatedTalisman: "Laya ta Thiebissaba-Abjad Wafq",
      wafqGridTitle: "Gidajen Tsarki na Suna da Kadyo",
      sacredIncantation: "Addu'ar Hatim",
    },
    kouroukan: {
      title: "Hatimin Kouroukan Fouga da Yarjejeniyar Sirri",
      subtitle: "Cikakken rantsuwa da kariya daga sarakunan dā na kasar Manden.",
      oathTitle: "Rantsuwar Kouroukan Fouga",
      oathText: "Da sunan samaniya, yashi da numfashin magabata, gaskiya za ta yi nasara kuma sadaka za ta tunkude masifa.",
      shieldProtection: "Ganuwar Kariya ta Ruhi",
      zikrFrequency: "Maimaitawa da Karfin Zikiri",
    },
  },
};
