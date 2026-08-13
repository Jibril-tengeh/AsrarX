export interface AnchoringTranslation {
  backToTools: string;
  headerBadge: string;
  pageTitle: string;
  pageSubtitle: string;
  noticeTitle: string;
  noticeText: string;
  tabs: {
    ismBatin: string;
    khatamThabat: string;
    mizanThawabit: string;
    khatimIrtikaz: string;
  };
  ismBatin: {
    title: string;
    subtitle: string;
    nameInput: string;
    motherInput: string;
    constellationSelect: string;
    calculateBtn: string;
    soulNameResult: string;
    spiritualSuffix: string;
    physicalWeight: string;
    constellationWeight: string;
    soulWeight: string;
    elementalResonance: string;
    divineInvocation: string;
    copySoulName: string;
    copied: string;
  };
  khatamThabat: {
    title: string;
    subtitle: string;
    intentionInput: string;
    customWeightInput: string;
    squareType: string;
    lockPivotPoints: string;
    downloadSquare: string;
    gridTitle: string;
    pivotLegend: string;
    matrixSum: string;
    copyMatrix: string;
    copied: string;
  };
  mizanThawabit: {
    title: string;
    subtitle: string;
    nameLabel: string;
    starTableTitle: string;
    starName: string;
    starConstellation: string;
    starWeight: string;
    harmonyScore: string;
    elementalMatch: string;
    dominantStar: string;
    talismanicRecommendation: string;
  };
  khatimIrtikaz: {
    title: string;
    subtitle: string;
    inputLabel: string;
    canvasWidth: string;
    canvasHeight: string;
    originQuadrant: string;
    startCoords: string;
    startAngle: string;
    initialRadius: string;
    pulseFreq: string;
    downloadCanvas: string;
    copyCoords: string;
    copied: string;
  };
}

export const ANCHORING_TRANSLATIONS: Record<'fr' | 'en' | 'ha', AnchoringTranslation> = {
  fr: {
    backToTools: "Retour aux outils",
    headerBadge: "Ancrage & Stabilité Astrale",
    pageTitle: "Ancrage, Stabilité et Étoiles Fixes",
    pageSubtitle: "Module complet pour le calcul d'Ism al-Batin (Nom de l'Âme), Khatam al-Thabat (Carré Magique Verrouillé), Mizan al-Thawabit (Résonance avec les Étoiles Fixes) et Khatim al-Irtikaz (Coordonnées d'Ancre Vectorielle).",
    noticeTitle: "Principe Théurgique d'Ancrage et Fixation",
    noticeText: "Les opérations d'ancrage astrale visent à fixer durablement une intention, stabiliser le psychisme et harmoniser le nom profane avec le nom secret de l'âme relié aux grandes étoiles fixes de référence.",
    tabs: {
      ismBatin: "Ism al-Batin (Nom de l'Âme)",
      khatamThabat: "Khatam al-Thabat (Stabilité)",
      mizanThawabit: "Mizan al-Thawabit (Étoiles Fixes)",
      khatimIrtikaz: "Khatim al-Irtikaz (Ancre Vectorielle)"
    },
    ismBatin: {
      title: "Ism al-Batin • Le Nom Secret de l'Âme",
      subtitle: "Calcule le Nom de l'Âme en soustrayant le poids du prénom physique de la constellation natale de référence.",
      nameInput: "Prénom physique",
      motherInput: "Prénom de la mère (optionnel)",
      constellationSelect: "Constellation / Signe Natal",
      calculateBtn: "Calculer le Nom de l'Âme",
      soulNameResult: "Nom Secret de l'Âme (Ism al-Batin)",
      spiritualSuffix: "Suffixe Théurgique / Angélique",
      physicalWeight: "Poids du Prénom Physique",
      constellationWeight: "Poids de la Constellation",
      soulWeight: "Poids Abjad de l'Âme",
      elementalResonance: "Résonance Élémentaire",
      divineInvocation: "Invocation d'Ancrage Spirituel",
      copySoulName: "Copier le Nom de l'Âme",
      copied: "Copié !"
    },
    khatamThabat: {
      title: "Khatam al-Thabat • Carré Magique Verrouillé",
      subtitle: "Génère un carré magique stabilisé par des points de pivot verrouillés aux sommets et au centre pour fixer une situation.",
      intentionInput: "Intention ou Situation à Fixer",
      customWeightInput: "Poids Numérique Personnalisé (optionnel)",
      squareType: "Format de la Matrice",
      lockPivotPoints: "Afficher les Points de Pivot de Verrouillage",
      downloadSquare: "Télécharger le Carré (SVG)",
      gridTitle: "Matrice d'Ancrage Verrouillée",
      pivotLegend: "Ancres de Pivot (Sommets & Centre)",
      matrixSum: "Somme de Fixation Totale",
      copyMatrix: "Copier les Valeurs de la Matrice",
      copied: "Matrice Copiée !"
    },
    mizanThawabit: {
      title: "Mizan al-Thawabit • Balance des Étoiles Fixes",
      subtitle: "Compare la valeur du prénom avec celles des grandes étoiles de référence (Étoiles Béhéniennes) pour déterminer les affinités.",
      nameLabel: "Prénom ou Intention à Évaluer",
      starTableTitle: "Tableau de Résonance avec les Étoiles Béhéniennes",
      starName: "Étoile Fixe",
      starConstellation: "Constellation",
      starWeight: "Valeur Abjad",
      harmonyScore: "Indice d'Harmonie",
      elementalMatch: "Élément",
      dominantStar: "Étoile Dominante d'Ancrage",
      talismanicRecommendation: "Support Minéral & Invocations de l'Étoile"
    },
    khatimIrtikaz: {
      title: "Khatim al-Irtikaz • Ancre Vectorielle du Tracé",
      subtitle: "Détermine les coordonnées géométriques précises (X, Y, Angle, Rayon) de départ pour entamer le tracé à l'écran.",
      inputLabel: "Texte ou Formule du Tracé",
      canvasWidth: "Largeur du Canevas (px)",
      canvasHeight: "Hauteur du Canevas (px)",
      originQuadrant: "Quadrant d'Origine",
      startCoords: "Coordonnées de Départ (X, Y)",
      startAngle: "Angle Initial Vectoriel (°)",
      initialRadius: "Rayon d'Impulsion (px)",
      pulseFreq: "Fréquence de Résonance (Hz)",
      downloadCanvas: "Télécharger le Tracé Vectoriel (SVG)",
      copyCoords: "Copier les Coordonnées",
      copied: "Coordonnées Copiées !"
    }
  },
  en: {
    backToTools: "Back to tools",
    headerBadge: "Astral Anchoring & Stability",
    pageTitle: "Anchoring, Stability & Fixed Stars",
    pageSubtitle: "Comprehensive module for calculating Ism al-Batin (Soul Name), Khatam al-Thabat (Locked Magic Square), Mizan al-Thawabit (Fixed Stars Resonance), and Khatim al-Irtikaz (Vector Anchor Coordinates).",
    noticeTitle: "Theurgic Principle of Anchoring and Fixation",
    noticeText: "Astral anchoring operations aim to permanently stabilize an intention, steady the psyche, and harmonize the physical name with the secret soul name connected to key fixed stars.",
    tabs: {
      ismBatin: "Ism al-Batin (Soul Name)",
      khatamThabat: "Khatam al-Thabat (Stability)",
      mizanThawabit: "Mizan al-Thawabit (Fixed Stars)",
      khatimIrtikaz: "Khatim al-Irtikaz (Vector Anchor)"
    },
    ismBatin: {
      title: "Ism al-Batin • Secret Soul Name",
      subtitle: "Calculates the Soul Name by subtracting the physical name's weight from the reference natal constellation.",
      nameInput: "Physical first name",
      motherInput: "Mother's name (optional)",
      constellationSelect: "Natal Constellation / Zodiac Sign",
      calculateBtn: "Calculate Soul Name",
      soulNameResult: "Secret Soul Name (Ism al-Batin)",
      spiritualSuffix: "Theurgic / Angelic Suffix",
      physicalWeight: "Physical Name Weight",
      constellationWeight: "Constellation Weight",
      soulWeight: "Soul Abjad Weight",
      elementalResonance: "Elemental Resonance",
      divineInvocation: "Spiritual Anchoring Invocation",
      copySoulName: "Copy Soul Name",
      copied: "Copied!"
    },
    khatamThabat: {
      title: "Khatam al-Thabat • Locked Magic Square",
      subtitle: "Generates a magic square stabilized by locked pivot points at corners and center to fix a situation.",
      intentionInput: "Intention or Situation to Fix",
      customWeightInput: "Custom Numerical Weight (optional)",
      squareType: "Matrix Format",
      lockPivotPoints: "Display Locking Pivot Points",
      downloadSquare: "Download Square (SVG)",
      gridTitle: "Locked Anchoring Matrix",
      pivotLegend: "Pivot Anchors (Corners & Center)",
      matrixSum: "Total Fixation Sum",
      copyMatrix: "Copy Matrix Values",
      copied: "Matrix Copied!"
    },
    mizanThawabit: {
      title: "Mizan al-Thawabit • Balance of Fixed Stars",
      subtitle: "Compares the name's Abjad weight with major Behenian fixed stars to evaluate spiritual affinity.",
      nameLabel: "Name or Intention to Evaluate",
      starTableTitle: "Resonance Table with Behenian Fixed Stars",
      starName: "Fixed Star",
      starConstellation: "Constellation",
      starWeight: "Abjad Value",
      harmonyScore: "Harmony Index",
      elementalMatch: "Element",
      dominantStar: "Dominant Anchoring Star",
      talismanicRecommendation: "Mineral Support & Star Invocations"
    },
    khatimIrtikaz: {
      title: "Khatim al-Irtikaz • Vector Canvas Anchor",
      subtitle: "Determines precise geometric coordinates (X, Y, Angle, Radius) to begin drawing on screen.",
      inputLabel: "Drawing Text or Formula",
      canvasWidth: "Canvas Width (px)",
      canvasHeight: "Canvas Height (px)",
      originQuadrant: "Origin Quadrant",
      startCoords: "Starting Coordinates (X, Y)",
      startAngle: "Initial Vector Angle (°)",
      initialRadius: "Impulse Radius (px)",
      pulseFreq: "Resonance Frequency (Hz)",
      downloadCanvas: "Download Vector Drawing (SVG)",
      copyCoords: "Copy Coordinates",
      copied: "Coordinates Copied!"
    }
  },
  ha: {
    backToTools: "Amo komawa zuwa kayan aiki",
    headerBadge: "Kariya da Tabbatar da Taurari",
    pageTitle: "Ancrage, Tabbata da Taurari Kafaffu",
    pageSubtitle: "Tsari mai cikakken bayani don lissafin Ism al-Batin (Sunan Kurwa), Khatam al-Thabat (Hatimin Tabbata), Mizan al-Thawabit (Awo da Taurari Kafaffu) da Khatim al-Irtikaz (Ma'aunin Fara Rubutu).",
    noticeTitle: "Ka'idar Tabbatar da Sirri da Tunanin Mutum",
    noticeText: "Ayyukan kafe sirri da tabbata suna nufin gyara niyya da tabbatar da tunani ta hanyar daidaita sunan fili da sunan sirri na kurwa tare da manyan taurari kafaffu.",
    tabs: {
      ismBatin: "Ism al-Batin (Sunan Kurwa)",
      khatamThabat: "Khatam al-Thabat (Tabbata)",
      mizanThawabit: "Mizan al-Thawabit (Taurari Kafaffu)",
      khatimIrtikaz: "Khatim al-Irtikaz (Farkon Zana)"
    },
    ismBatin: {
      title: "Ism al-Batin • Asalin Sunan Kurwa",
      subtitle: "Yana cire nauyin sunan fili daga tauraron haihuwa domin gano sunan sirri na kurwa.",
      nameInput: "Sunan Mutum na Fili",
      motherInput: "Sunan Uwa (Zaɓi)",
      constellationSelect: "Tauraron Haihuwa / Alama",
      calculateBtn: "Lissafa Sunan Kurwa",
      soulNameResult: "Sunan Sirri na Kurwa (Ism al-Batin)",
      spiritualSuffix: "Karshen Kalmar Ruhani",
      physicalWeight: "Nauyin Sunan Fili",
      constellationWeight: "Nauyin Tauraron Haihuwa",
      soulWeight: "Nauyin Abjad na Kurwa",
      elementalResonance: "Mahaɗar Abubuwa Huɗu",
      divineInvocation: "Addu'ar Tabbatar Ruhani",
      copySoulName: "Kafi Sunan Kurwa",
      copied: "An Kafi!"
    },
    khatamThabat: {
      title: "Khatam al-Thabat • Hatimin Tabbatar da Al'amari",
      subtitle: "Yana samar da ginshiƙin lambobi da aka kulle da maballin sakandare a kusurwoyi da tsakiya domin tabbatar da al'amari.",
      intentionInput: "Niyya ko Al'amarin da ake son Tabbatarwa",
      customWeightInput: "Lambar Musamman (Zaɓi)",
      squareType: "Tsarin Hatimi",
      lockPivotPoints: "Nuna Maballan Kullewa",
      downloadSquare: "Sauke Hatimi (SVG)",
      gridTitle: "Gidan Tabbata da Kullewa",
      pivotLegend: "Maballan Kullewa (Kusurwoyi & Tsakiya)",
      matrixSum: "Jimillar Tabbatarwa",
      copyMatrix: "Kafi Lambobin Gida",
      copied: "An Kafi Lambobi!"
    },
    mizanThawabit: {
      title: "Mizan al-Thawabit • Awo da Taurari Kafaffu",
      subtitle: "Yana kwatanta nauyin sunanka da manyan taurari kafaffu don gano ma'aunin kariya da dacewa.",
      nameLabel: "Sunan da ake auna",
      starTableTitle: "Jadawalin Dacewa da Taurari Kafaffu",
      starName: "Tauraron Kafa",
      starConstellation: "Gidan Tauraro",
      starWeight: "Nauyin Abjad",
      harmonyScore: "Matakin Dacewa (%)",
      elementalMatch: "Sinadari",
      dominantStar: "Tauraron Kariya Mafiya Ƙarfi",
      talismanicRecommendation: "Duwatsu da Addu'o'in Tauraro"
    },
    khatimIrtikaz: {
      title: "Khatim al-Irtikaz • Ma'aunin Fara Rubutun Zana",
      subtitle: "Yana gano madaidaicin wajen fara zana da rubutu a kan allo (X, Y, Kwana, Radiyo).",
      inputLabel: "Rubutun Zana ko Niyya",
      canvasWidth: "Faɗin Allo (px)",
      canvasHeight: "Tsawo Allo (px)",
      originQuadrant: "Kusurwar Fara",
      startCoords: "Madaidaicin Fara (X, Y)",
      startAngle: "Kwana na Fara (°)",
      initialRadius: "Tazarar Fara (px)",
      pulseFreq: "Gudun Motsi (Hz)",
      downloadCanvas: "Sauke Zanen (SVG)",
      copyCoords: "Kafi Madaidaici",
      copied: "An Kafi Madaidaici!"
    }
  }
};
