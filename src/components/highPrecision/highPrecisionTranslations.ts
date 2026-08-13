export interface HighPrecisionTranslation {
  backToTools: string;
  headerBadge: string;
  pageTitle: string;
  pageSubtitle: string;
  infoNotice: string;
  tabs: {
    shifrTali: string;
    mizanKabeer: string;
    khatimDhahabi: string;
    jafrHawadith: string;
    mizanRuh: string;
    ismMurakkab: string;
    tlasimLayl: string;
    mizanIjabah: string;
    khatamKhass: string;
    saatFath: string;
    khattMiyah: string;
    tafdeelKabir: string;
  };
  labels: {
    inputText: string;
    inputName: string;
    motherName: string;
    zodiacAscendant: string;
    targetNumber: string;
    gridSizeLabel: string;
    birthHourLabel: string;
    addDivineName: string;
    divineNamesList: string;
    calculate: string;
    copy: string;
    copied: string;
    exportPng: string;
    exportParchment: string;
    exportBannerTitle: string;
    exportBannerSubtitle: string;
  };
  shifrTaliSection: {
    title: string;
    subtitle: string;
    encodedResult: string;
    cipherTable: string;
    originalChar: string;
    cipherChar: string;
    value: string;
    symbol: string;
  };
  mizanKabeerSection: {
    title: string;
    subtitle: string;
    totalStandard: string;
    totalBalanced: string;
    harmonyScore: string;
    dominantElement: string;
    breakdownTable: string;
    letter: string;
    standardVal: string;
    planet: string;
    rank: string;
    weightedVal: string;
  };
  khatimDhahabiSection: {
    title: string;
    subtitle: string;
    magicConstant: string;
    grid6x6: string;
    transitStatus: string;
  };
  jafrHawadithSection: {
    title: string;
    subtitle: string;
    weight: string;
    cycleYear: string;
    conjunction: string;
    impactScore: string;
    description: string;
  };
  mizanRuhSection: {
    title: string;
    subtitle: string;
    vitalityIndex: string;
    resilienceLevel: string;
    rulingPlanet: string;
    recommendedDhikr: string;
  };
  ismMurakkabSection: {
    title: string;
    subtitle: string;
    totalAbjad: string;
    acronymAr: string;
    formula: string;
    guardian: string;
  };
  tlasimLaylSection: {
    title: string;
    subtitle: string;
    nocturnalShield: string;
    rigorScore: string;
    nightSchedule: string;
  };
  mizanIjabahSection: {
    title: string;
    subtitle: string;
    promptitudeScore: string;
    activeElements: string;
    passiveElements: string;
    status: string;
    recommendation: string;
  };
  khatamKhassSection: {
    title: string;
    subtitle: string;
    centerSymbol: string;
    hourRuler: string;
    consonantsPoints: string;
  };
  saatFathSection: {
    title: string;
    subtitle: string;
    exactTime: string;
    alignmentScore: string;
    skyCondition: string;
    recommendation: string;
  };
  khattMiyahSection: {
    title: string;
    subtitle: string;
    waterScript: string;
    washingInstructions: string;
  };
  tafdeelKabirSection: {
    title: string;
    subtitle: string;
    baseCell: string;
    remainder: string;
    compensationK: string;
    insertionCell: string;
    formulaText: string;
  };
}

export const HIGH_PRECISION_TRANSLATIONS: Record<'fr' | 'en' | 'ha', HighPrecisionTranslation> = {
  fr: {
    backToTools: 'Retour aux Outils',
    headerBadge: 'Clés d’Haute Précision',
    pageTitle: 'Individualisation de Haute Précision',
    pageSubtitle:
      'Harmonisation ésotérique millimétrée : chiffrement astrologique, balances d’Ibn Arabi, carrés solaires, cycles historiques et géométrie sacrée d’ajustement.',
    infoNotice:
      'Chaque module de cette suite applique les règles les plus rigoureuses de la science des lettres (Ilm al-Huruf) pour individualiser vos rituels et vos récitations selon votre ciel natal et vos fréquences personnelles.',
    tabs: {
      shifrTali: '1. Shifr al-Tali’ (Alphabet)',
      mizanKabeer: '2. Mizan al-Kabeer (Ibn Arabi)',
      khatimDhahabi: '3. Khatim al-Dhahabi (Soleil)',
      jafrHawadith: '4. Jafr al-Hawadith (Cycles)',
      mizanRuh: '5. Mizan al-Ruh (Résilience)',
      ismMurakkab: '6. Ism al-Murakkab (Nom)',
      tlasimLayl: '7. Tlasim al-Layl (Nuit)',
      mizanIjabah: '8. Mizan al-Ijabah (Speed)',
      khatamKhass: '9. Khatam al-Khass (Étoile)',
      saatFath: '10. Sa’at al-Fath (Illumination)',
      khattMiyah: '11. Khatt al-Miyah (Eau)',
      tafdeelKabir: '12. Al-Tafdeel al-Kabir (Wafq)',
    },
    labels: {
      inputText: 'Texte ou Verset source',
      inputName: 'Votre Prénom',
      motherName: 'Prénom de la Mère',
      zodiacAscendant: 'Ascendant Natal',
      targetNumber: 'Nombre Cible (Poids Abjad)',
      gridSizeLabel: 'Taille du Wafq',
      birthHourLabel: 'Heure de Naissance (0-23)',
      addDivineName: 'Ajouter un Nom Divin',
      divineNamesList: 'Noms Divins Sélectionnés',
      calculate: 'Calculer & Harmoniser',
      copy: 'Copier',
      copied: 'Copié !',
      exportPng: 'Exporter Carte HD',
      exportParchment: 'Exporter Parchemin Sacré',
      exportBannerTitle: 'Exporter la Synthèse d\'Individualisation',
      exportBannerSubtitle: 'Téléchargez les calculs sous forme de carte HD ou Parchemin traditionnel',
    },
    shifrTaliSection: {
      title: 'Shifr al-Tali’ (Alphabet Personnel)',
      subtitle: 'Génère un alphabet cryptographique dérivé de votre ascendant natal',
      encodedResult: 'Texte Chiffré en Alphabet Astrologique',
      cipherTable: 'Correspondances des Consonnes & Symboles Célestes',
      originalChar: 'Lettre Originale',
      cipherChar: 'Lettre Chiffrée',
      value: 'Valeur Décalée',
      symbol: 'Glyphe Esotérique',
    },
    mizanKabeerSection: {
      title: 'Mizan al-Kabeer (Balance d’Ibn Arabi)',
      subtitle: 'Pondération exacte des lettres selon le rang des planètes gouvernantes',
      totalStandard: 'Poids Abjad Standard',
      totalBalanced: 'Poids Équilibré (Mizan)',
      harmonyScore: 'Indice d’Harmonie Spirituelle',
      dominantElement: 'Élément Dominant',
      breakdownTable: 'Détail de la Balance des Lettres',
      letter: 'Lettre',
      standardVal: 'Abjad Standard',
      planet: 'Planète Gouvernante',
      rank: 'Rang Planétaire',
      weightedVal: 'Valeur Pondérée',
    },
    khatimDhahabiSection: {
      title: 'Al-Khatim al-Dhahabi (Soleil - Carré 6x6)',
      subtitle: 'Carré magique solaire 6x6 actif lors des transits et heures solaires',
      magicConstant: 'Constante Magique Solaire',
      grid6x6: 'Matrice du Wafq Musaddas 6x6',
      transitStatus: 'Statut du Transit Solaire',
    },
    jafrHawadithSection: {
      title: 'Jafr al-Hawadith (Cycles Événementiels)',
      subtitle: 'Évaluation des grands cycles historiques selon les conjonctions majeures',
      weight: 'Poids Vibratoire de l’Événement',
      cycleYear: 'Année du Peak du Cycle',
      conjunction: 'Type de Conjonction Dominante',
      impactScore: 'Indice d’Impact Historique',
      description: 'Analyse Prophétique du Cycle',
    },
    mizanRuhSection: {
      title: 'Mizan al-Ruh (Résilience & Vitalité)',
      subtitle: 'Indice de résistance spirituelle et de vitalité selon l’ascendance maternelle',
      vitalityIndex: 'Indice de Vitalité Spirituelle',
      resilienceLevel: 'Niveau de Résilience du Nafs',
      rulingPlanet: 'Astre Protecteur Direct',
      recommendedDhikr: 'Dhikr d’Ancrage Recommandé',
    },
    ismMurakkabSection: {
      title: 'Ism al-Murakkab (Nom Composé & Acronyme Divine)',
      subtitle: 'Fusion et condensation de plusieurs Noms Divins en un acronyme talsamique',
      totalAbjad: 'Poids Abjad Total Fusionné',
      acronymAr: 'Acronyme Sacré Condensé',
      formula: 'Formule Talsamique de Commandement',
      guardian: 'Ange Gardien Extrait',
    },
    tlasimLaylSection: {
      title: 'Tlasim al-Layl (Barrière Mentale Nocturne)',
      subtitle: 'Protection psychique et bouclier de rigueur pour les heures nocturnes',
      nocturnalShield: 'Sceau de la Veille Nocturne',
      rigorScore: 'Intensité du Bouclier',
      nightSchedule: 'Horaires de Fortification',
    },
    mizanIjabahSection: {
      title: 'Mizan al-Ijabah (Promptitude de Réponse)',
      subtitle: 'Rapport des éléments actifs/passifs au moment de la récitation',
      promptitudeScore: 'Indice de Vitesse de Réponse',
      activeElements: 'Éléments Actifs (Feu + Air)',
      passiveElements: 'Éléments Passifs (Eau + Terre)',
      status: 'Statut de Vitesse',
      recommendation: 'Conseil d’Harmonisation',
    },
    khatamKhassSection: {
      title: 'Khatam al-Khass (Hexagramme des 6 Consonnes)',
      subtitle: 'Sceau à 6 branches contenant les consonnes de protection de l’heure',
      centerSymbol: 'Symbole du Cœur du Sceau',
      hourRuler: 'Régissant Horaire',
      consonantsPoints: 'Positions des 6 Consonnes Protectrices',
    },
    saatFathSection: {
      title: 'Sa’at al-Fath (Illumination Localisée)',
      subtitle: 'Minute d’alignement céleste parfait entre l’utilisateur et le ciel local',
      exactTime: 'Minute Exacte d’Ouverture',
      alignmentScore: 'Pourcentage d’Alignement',
      skyCondition: 'État de la Porte Céleste',
      recommendation: 'Recommandation Rituelle',
    },
    khattMiyahSection: {
      title: 'Khatt al-Miyah (Alphabet de l’Eau)',
      subtitle: 'Conversion en écriture fluide curviligne pour les soins et nettoyages',
      waterScript: 'Écriture Curviligne Fluviale',
      washingInstructions: 'Protocole de Lavage & Shifā’',
    },
    tafdeelKabirSection: {
      title: 'Al-Tafdeel al-Kabir (Ajustement de Wafq)',
      subtitle: 'Calcul de la constante de compensation pour équilibrer un carré magique',
      baseCell: 'Valeur de la Case de Base',
      remainder: 'Reste du Déficit (K)',
      compensationK: 'Constante d’Ajustement K',
      insertionCell: 'Case Recommandée pour Injection',
      formulaText: 'Règle de Correction du Carré',
    },
  },
  en: {
    backToTools: 'Back to Tools',
    headerBadge: 'High Precision Keys',
    pageTitle: 'High Precision Individualization',
    pageSubtitle:
      'Millimeter-precision esoteric harmonization: astrological encryption, Ibn Arabi balances, solar squares, historical cycles, and sacred geometry adjustments.',
    infoNotice:
      'Every module in this suite applies the strictest rules of letter science (Ilm al-Huruf) to personalize your rituals and recitations according to your natal sky and personal frequencies.',
    tabs: {
      shifrTali: '1. Shifr al-Tali’ (Cipher)',
      mizanKabeer: '2. Mizan al-Kabeer (Ibn Arabi)',
      khatimDhahabi: '3. Khatim al-Dhahabi (Sun)',
      jafrHawadith: '4. Jafr al-Hawadith (Cycles)',
      mizanRuh: '5. Mizan al-Ruh (Resilience)',
      ismMurakkab: '6. Ism al-Murakkab (Name)',
      tlasimLayl: '7. Tlasim al-Layl (Night)',
      mizanIjabah: '8. Mizan al-Ijabah (Speed)',
      khatamKhass: '9. Khatam al-Khass (Star)',
      saatFath: '10. Sa’at al-Fath (Illumination)',
      khattMiyah: '11. Khatt al-Miyah (Water)',
      tafdeelKabir: '12. Al-Tafdeel al-Kabir (Wafq)',
    },
    labels: {
      inputText: 'Source Text or Verse',
      inputName: 'First Name',
      motherName: 'Mother’s First Name',
      zodiacAscendant: 'Natal Ascendant',
      targetNumber: 'Target Value (Abjad Weight)',
      gridSizeLabel: 'Wafq Grid Size',
      birthHourLabel: 'Birth Hour (0-23)',
      addDivineName: 'Add Divine Name',
      divineNamesList: 'Selected Divine Names',
      calculate: 'Calculate & Harmonize',
      copy: 'Copy',
      copied: 'Copied!',
      exportPng: 'Export HD Card',
      exportParchment: 'Export Sacred Parchment',
      exportBannerTitle: 'Export Individualization Summary',
      exportBannerSubtitle: 'Download calculations as HD Card or Traditional Parchment',
    },
    shifrTaliSection: {
      title: 'Shifr al-Tali’ (Personal Cipher)',
      subtitle: 'Generates a cryptographic alphabet derived from your natal ascendant',
      encodedResult: 'Encrypted Text in Astrological Alphabet',
      cipherTable: 'Consonant & Celestial Symbol Mapping',
      originalChar: 'Original Letter',
      cipherChar: 'Ciphered Letter',
      value: 'Shifted Value',
      symbol: 'Esoteric Glyph',
    },
    mizanKabeerSection: {
      title: 'Mizan al-Kabeer (Ibn Arabi’s Balance)',
      subtitle: 'Exact letter weighting according to the rank of ruling planets',
      totalStandard: 'Standard Abjad Weight',
      totalBalanced: 'Balanced Weight (Mizan)',
      harmonyScore: 'Spiritual Harmony Score',
      dominantElement: 'Dominant Element',
      breakdownTable: 'Letter Balance Details',
      letter: 'Letter',
      standardVal: 'Standard Abjad',
      planet: 'Ruling Planet',
      rank: 'Planetary Rank',
      weightedVal: 'Weighted Value',
    },
    khatimDhahabiSection: {
      title: 'Al-Khatim al-Dhahabi (Sun - 6x6 Square)',
      subtitle: '6x6 solar magic square active during solar transits and hours',
      magicConstant: 'Solar Magic Constant',
      grid6x6: 'Wafq Musaddas 6x6 Matrix',
      transitStatus: 'Solar Transit Status',
    },
    jafrHawadithSection: {
      title: 'Jafr al-Hawadith (Event Cycles)',
      subtitle: 'Evaluating major historical cycles based on key planetary conjunctions',
      weight: 'Event Vibrational Weight',
      cycleYear: 'Cycle Peak Year',
      conjunction: 'Dominant Conjunction Type',
      impactScore: 'Historical Impact Score',
      description: 'Prophetic Cycle Analysis',
    },
    mizanRuhSection: {
      title: 'Mizan al-Ruh (Resilience & Vitality)',
      subtitle: 'Spiritual resistance and vitality index based on maternal lineage',
      vitalityIndex: 'Spiritual Vitality Index',
      resilienceLevel: 'Nafs Resilience Level',
      rulingPlanet: 'Direct Protective Astrological Ruler',
      recommendedDhikr: 'Recommended Anchoring Dhikr',
    },
    ismMurakkabSection: {
      title: 'Ism al-Murakkab (Composite Name & Acronym)',
      subtitle: 'Merging and condensing multiple Divine Names into a talsamic acronym',
      totalAbjad: 'Merged Total Abjad Weight',
      acronymAr: 'Condensed Sacred Acronym',
      formula: 'Talsamic Command Formula',
      guardian: 'Extracted Guardian Angel',
    },
    tlasimLaylSection: {
      title: 'Tlasim al-Layl (Nocturnal Mental Shield)',
      subtitle: 'Psychic protection and rigor shield for night hours',
      nocturnalShield: 'Night Watch Seal',
      rigorScore: 'Shield Intensity',
      nightSchedule: 'Fortification Schedule',
    },
    mizanIjabahSection: {
      title: 'Mizan al-Ijabah (Response Promptitude)',
      subtitle: 'Ratio of active/passive elements at the moment of recitation',
      promptitudeScore: 'Response Speed Index',
      activeElements: 'Active Elements (Fire + Air)',
      passiveElements: 'Passive Elements (Water + Earth)',
      status: 'Speed Status',
      recommendation: 'Harmonization Advice',
    },
    khatamKhassSection: {
      title: 'Khatam al-Khass (6-Consonant Hexagram)',
      subtitle: '6-pointed star seal containing the protective consonants of the hour',
      centerSymbol: 'Seal Center Symbol',
      hourRuler: 'Hourly Ruler',
      consonantsPoints: 'Positions of the 6 Protective Consonants',
    },
    saatFathSection: {
      title: 'Sa’at al-Fath (Localized Illumination)',
      subtitle: 'Exact minute of perfect celestial alignment between user and local sky',
      exactTime: 'Exact Opening Minute',
      alignmentScore: 'Alignment Percentage',
      skyCondition: 'Celestial Gate State',
      recommendation: 'Ritual Recommendation',
    },
    khattMiyahSection: {
      title: 'Khatt al-Miyah (Water Script)',
      subtitle: 'Curvilinear fluid writing conversion for healing and washing',
      waterScript: 'Fluid Curvilinear Script',
      washingInstructions: 'Washing Protocol & Healing (Shifā’)',
    },
    tafdeelKabirSection: {
      title: 'Al-Tafdeel al-Kabir (Wafq Adjustment)',
      subtitle: 'Calculating compensation constant to balance magic squares',
      baseCell: 'Base Cell Value',
      remainder: 'Deficit Remainder (K)',
      compensationK: 'Adjustment Constant K',
      insertionCell: 'Recommended Cell for Injection',
      formulaText: 'Square Correction Rule',
    },
  },
  ha: {
    backToTools: 'Koma ga Kayan Aiki',
    headerBadge: 'Mufe-mufen Sirri Na Musamman',
    pageTitle: 'Keɓancewa Da Daidaitawa ta Musamman',
    pageSubtitle:
      'Halarci mai zurfi da daidaitawa ta kintace: rubutun taurari, awo na Ibn Arabi, hatimin rana, zagayowar tarihi, da ma’aunin gyaran wafaqi.',
    infoNotice:
      'Duk wani ɓangare a wannan kayan aiki yana amfani da ka’idoji mafi tsauri na ilimin haruffa (Ilm al-Huruf) don keɓance addu’o’inku da karatunku zuwa daidai sararin samaniyarku.',
    tabs: {
      shifrTali: '1. Shifr al-Tali’ (Bidi’a)',
      mizanKabeer: '2. Mizan al-Kabeer (Ibn Arabi)',
      khatimDhahabi: '3. Khatim al-Dhahabi (Rana)',
      jafrHawadith: '4. Jafr al-Hawadith (Tarihi)',
      mizanRuh: '5. Mizan al-Ruh (Ruhaniyya)',
      ismMurakkab: '6. Ism al-Murakkab (Suna)',
      tlasimLayl: '7. Tlasim al-Layl (Dare)',
      mizanIjabah: '8. Mizan al-Ijabah (Sauri)',
      khatamKhass: '9. Khatam al-Khass (Tauraro)',
      saatFath: '10. Sa’at al-Fath (Sa’a)',
      khattMiyah: '11. Khatt al-Miyah (Ruwa)',
      tafdeelKabir: '12. Al-Tafdeel al-Kabir (Wafaqi)',
    },
    labels: {
      inputText: 'Rubutu ko Ayar Asali',
      inputName: 'Sunanki / Sunanka',
      motherName: 'Sunan Uwa',
      zodiacAscendant: 'Tauraron Haihuwa',
      targetNumber: 'Adadin Lamba (Nauyin Abjad)',
      gridSizeLabel: 'Girmar Wafaqi',
      birthHourLabel: 'Sa’ar Haihuwa (0-23)',
      addDivineName: 'Ƙara Sunan Allah',
      divineNamesList: 'Zaɓaɓɓun Sunayen Allah',
      calculate: 'Auna & Daidaita',
      copy: 'Kwafa',
      copied: 'An Kwafa!',
      exportPng: 'Sauke Hoto HD',
      exportParchment: 'Sauke Hoton Parchement',
      exportBannerTitle: 'Fitar da Takaitaccen Bayani',
      exportBannerSubtitle: 'Sauke lissafi a matsayin hoto na HD ko Parchement',
    },
    shifrTaliSection: {
      title: 'Shifr al-Tali’ (Rubutun Sirri na Tauraro)',
      subtitle: 'Yana ƙirƙirar rubutun sirri bisa tauraron haihuwa',
      encodedResult: 'Rufaffen Rubutu a Rubutun Taurari',
      cipherTable: 'Sada Haruffa & Alamu na Sama',
      originalChar: 'Harfin Asali',
      cipherChar: 'Harfin Sirri',
      value: 'Darajar Lamba',
      symbol: 'Alamar Sirri',
    },
    mizanKabeerSection: {
      title: 'Mizan al-Kabeer (Awo na Ibn Arabi)',
      subtitle: 'Gwajin haruffa bisa darajar taurari masu mulki',
      totalStandard: 'Nauyin Abjad na Asali',
      totalBalanced: 'Nauyi Mai Daidaituwa (Mizan)',
      harmonyScore: 'Maki na Daidaiton Ruhaniyya',
      dominantElement: 'Sinadari Mai Rinjaya',
      breakdownTable: 'Cikakken Bayanin Awon Haruffa',
      letter: 'Harfi',
      standardVal: 'Abjad na Asali',
      planet: 'Tauraro Mai Mulki',
      rank: 'Matsayin Tauraro',
      weightedVal: 'Daraja Mai Ninki',
    },
    khatimDhahabiSection: {
      title: 'Al-Khatim al-Dhahabi (Hatimin Rana 6x6)',
      subtitle: 'Wafaqi mai gefe 6x6 da ke aiki a lokacin rakyar rana',
      magicConstant: 'Adadin Hatimin Rana',
      grid6x6: 'Diddigen Wafaqi 6x6',
      transitStatus: 'Matsayin Rakiyar Rana',
    },
    jafrHawadithSection: {
      title: 'Jafr al-Hawadith (Zagayowar Abubuwan Tarihi)',
      subtitle: 'Auna manyan sa’o’i na tarihi ta hanyar haɗuwar taurari',
      weight: 'Nauyin Ruhaniyya na Abun Da Ke Faruwa',
      cycleYear: 'Shekarar Girmama Zagayowar',
      conjunction: 'Irin Haɗuwar Taurari',
      impactScore: 'Makin Tasiri a Tarihi',
      description: 'Bayanin Neman Annabci',
    },
    mizanRuhSection: {
      title: 'Mizan al-Ruh (Ƙarfin Ruhaniyya & Juriya)',
      subtitle: 'Awon ƙarfin jiki da rai bisa sunan uwa da tauraro',
      vitalityIndex: 'Makin Ƙarfin Rai',
      resilienceLevel: 'Matsayin Juriyar Nafsi',
      rulingPlanet: 'Tauraro Mai Tsaro',
      recommendedDhikr: 'Zikiri Mai Natsuwa',
    },
    ismMurakkabSection: {
      title: 'Ism al-Murakkab (Suna Mai Haɗe)',
      subtitle: 'Rage da haɗa sunayen Allah da yawa zuwa kalmar sirri guda',
      totalAbjad: 'Jimillar Nauyin Abjad',
      acronymAr: 'Taqaitaccen Sunan Sirri',
      formula: 'Addu’ar Umarni na Sirri',
      guardian: "Mala'ika Mai Tsaro",
    },
    tlasimLaylSection: {
      title: 'Tlasim al-Layl (Garkuwar Kwakwalwa na Dare)',
      subtitle: 'Garkuwar tsaro da kariya a lokutan dare',
      nocturnalShield: 'Hatimin Tsaron Dare',
      rigorScore: 'Ƙarfin Garkuwa',
      nightSchedule: 'Jadawalin Karfafa Tsaro',
    },
    mizanIjabahSection: {
      title: 'Mizan al-Ijabah (Saurin Amsawa)',
      subtitle: 'Gwajin sinadarai masu sauri da masu hankali a lokacin karatu',
      promptitudeScore: 'Makin Saurin Amsawa',
      activeElements: 'Sinadarai Masu Sauri (Wuta + Iska)',
      passiveElements: 'Sinadarai Masu Sanyi (Ruwa + Ƙasa)',
      status: 'Yanayin Sauri',
      recommendation: 'Shawarar Daidaitawa',
    },
    khatamKhassSection: {
      title: 'Khatam al-Khass (Hatimin Tauraro Mai Tsinu 6)',
      subtitle: 'Tauraro mai tsinu 6 yana ɗauke da haruffan kariya na sa’a',
      centerSymbol: 'Alamar Tsakiyar Hatimi',
      hourRuler: 'Mai Mulkin Sa’a',
      consonantsPoints: 'Haruffa 6 Masu Tsaro',
    },
    saatFathSection: {
      title: 'Sa’at al-Fath (Mintin Buɗewa)',
      subtitle: 'Mintin dacewa tsakanin mai amfani da sararin samaniya na kusa',
      exactTime: 'Daidai Mintin Buɗewa',
      alignmentScore: 'Makin Dacewa (%)',
      skyCondition: 'Yanayin Ƙofar Sama',
      recommendation: 'Shawarar Aiki',
    },
    khattMiyahSection: {
      title: 'Khatt al-Miyah (Rubutun Ruwa)',
      subtitle: 'Sauya rubutu zuwa sahu mai karkata don wanke jiki da waraka',
      waterScript: 'Rubutu Mai Sahu na Ruwa',
      washingInstructions: 'Hanyar Wankewa & Shifā’',
    },
    tafdeelKabirSection: {
      title: 'Al-Tafdeel al-Kabir (Gyaran Wafaqi)',
      subtitle: 'Lissafin adadin ciko don daidaita kowanne wafaqi',
      baseCell: 'Darajar Gidan Farko',
      remainder: 'Ragowar Ciko (K)',
      compensationK: 'Adadin Gyara K',
      insertionCell: 'Gidan Da Zai Karɓi Gyara',
      formulaText: 'Ka’idar Gyaran Hatimi',
    },
  },
};
