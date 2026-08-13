export interface RouhaniyyaTranslation {
  pageTitle: string;
  pageSubtitle: string;
  backToTools: string;
  headerBadge: string;
  infoNotice: string;

  // Input Controls
  inputLabelText: string;
  inputLabelNumber: string;
  placeholderText: string;
  placeholderNumber: string;
  extractButton: string;
  modeText: string;
  modeNumber: string;
  formulaLabel: string;
  formula41: string;
  formula51: string;
  suffixLabel: string;
  suffixYael: string;
  suffixAel: string;

  // Summary Banner
  totalWeight: string;
  sourceText: string;
  elementalComposition: string;
  fire: string;
  air: string;
  water: string;
  earth: string;

  // Navigation Tabs
  tabs: {
    celestial: string;
    terrestrial: string;
    kings: string;
    auxiliaries: string;
    vocalization: string;
    schedule: string;
  };

  // 1. Muwakkil 'Alawi
  celestialTitle: string;
  celestialSubtitle: string;
  celestialFormulaInfo: string;
  celestialInvocationTitle: string;
  celestialAttributesTitle: string;
  celestialAttr1: string;
  celestialAttr2: string;
  celestialAttr3: string;

  // 2. Muwakkil Sifli
  terrestrialTitle: string;
  terrestrialSubtitle: string;
  terrestrialFormulaInfo: string;
  terrestrialInvocationTitle: string;
  terrestrialAttributesTitle: string;
  terrestrialAttr1: string;
  terrestrialAttr2: string;
  terrestrialAttr3: string;

  // 3. Moulouk al-Sab'ah
  kingsTitle: string;
  kingsSubtitle: string;
  rulingAngel: string;
  governingPlanet: string;
  sacredDay: string;
  element: string;
  sacredIncense: string;
  spiritualSeal: string;

  // 4. A'wan
  auxiliariesTitle: string;
  auxiliariesSubtitle: string;
  unitServant: string;
  tenServant: string;
  hundredServant: string;
  thousandServant: string;

  // 5. Dabt al-Asma
  vocalizationTitle: string;
  vocalizationSubtitle: string;
  schemeTitle: string;
  exactPronunciation: string;
  vocalFaailDesc: string;
  vocalFailushDesc: string;
  vocalMafulashDesc: string;

  // 6. Connection Schedule
  scheduleTitle: string;
  scheduleSubtitle: string;
  alignmentActive: string;
  alignmentInactive: string;
  bestTiming: string;
  repetitionCount: string;
  fullZimām: string;
  reducedAsl: string;
  directionQibla: string;

  // Exports & Actions
  exportPng: string;
  exportParchment: string;
  copySuccess: string;
  copyName: string;
  noticeFooterTitle: string;
  noticeFooterText: string;
}

export const ROUHANIYYA_TRANSLATIONS: Record<'fr' | 'en' | 'ha', RouhaniyyaTranslation> = {
  fr: {
    pageTitle: "Extraction de Rouhaniyya (Gardiens & Serviteurs)",
    pageSubtitle: "Science d'Istintaq : Découvrez les Anges Célestes, Gardiens Terrestres, Rois des 7 Jours, Auxiliaires A'wan et la Vocalisation Phonétique Sacrée.",
    backToTools: "Retour aux Outils",
    headerBadge: "Ilm al-Ruhaniyat & Istintaq",
    infoNotice: "Dans la science ésotérique des lettres, chaque nom ou verset révèle ses entités spirituelles régissantes. L'Istintaq convertit la valeur Abjad en racines vocalicées, scellées par les suffixes 'A'il / Yā'īl (Ange Céleste) et 'Tash / Ṭayš (Gardien Terrestre).",

    inputLabelText: "Entrez un Nom, Mot ou Verset Coranique",
    inputLabelNumber: "Ou entrez directement la valeur Abjad (Zimām)",
    placeholderText: "Ex: Ya Latif (يا لطيف) ou votre prénom...",
    placeholderNumber: "Ex: 129, 313, 1000...",
    extractButton: "Extraire les Gardiens",
    modeText: "Mode Texte / Nom",
    modeNumber: "Mode Poids Numérique",
    formulaLabel: "Soustraire pour Ange Céleste",
    formula41: "Soustraction 41 (Standard : Li / A'il)",
    formula51: "Soustraction 51 (Tradition Al-Buni : Ya'il)",
    suffixLabel: "Suffixe Angélique",
    suffixYael: "-yael (يَائِيلُ)",
    suffixAel: "-ael (آئِيلُ)",

    totalWeight: "Poids Abjad Total (Zimām)",
    sourceText: "Texte Source / Entrée",
    elementalComposition: "Composition Élémentaire",
    fire: "Feu (Nār)",
    air: "Air (Hawā')",
    water: "Eau (Mā')",
    earth: "Terre (Turāb)",

    tabs: {
      celestial: "1. Ange Céleste ('Alawi)",
      terrestrial: "2. Gardien Terrestre (Sifli)",
      kings: "3. Rois des 7 Jours",
      auxiliaries: "4. Auxiliaires (A'wan)",
      vocalization: "5. Vocalisation (Dabt)",
      schedule: "6. Calendrier & Horaires",
    },

    celestialTitle: "Muwakkil 'Alawi — L'Ange Céleste Supérieur",
    celestialSubtitle: "Régit l'influence éthérique et la lumière spirituelle (Noor). Extrait par la soustraction de la clé angélique et l'ajout de Yā'īl.",
    celestialFormulaInfo: "Formule appliquée : Poids Abjad minus la Constante de Lumière (41 ou 51), converti en lettres arabes + Suffixe Céleste.",
    celestialInvocationTitle: "Formule d'Invocation & Appel Angélique",
    celestialAttributesTitle: "Attributs & Domaine Spirituel",
    celestialAttr1: "Gouvernance éthérique des hautes sphères célestes",
    celestialAttr2: "Porteur de lumière divine et de protection éthérée",
    celestialAttr3: "Inspirateur des clartés mentales et ouvertures spirituelles",

    terrestrialTitle: "Muwakkil Sifli — Le Gardien Terrestre & Matériel",
    terrestrialSubtitle: "Régit l'exécution matérielle dans le monde physique. Extrait par la soustraction de la constante terrestre (419) et l'ajout du suffixe Ṭayš.",
    terrestrialFormulaInfo: "Formule appliquée : Poids Abjad minus la Clé Physique (419), converti en lettres arabes + Suffixe Terrestre (طَيْشُ).",
    terrestrialInvocationTitle: "Formule de Commandement Terrestre",
    terrestrialAttributesTitle: "Attributs & Action Dans la Matière",
    terrestrialAttr1: "Exécution concrète dans le monde physique et matériel",
    terrestrialAttr2: "Médiateur pour la manifestation des besoins terrestres",
    terrestrialAttr3: "Gardien des éléments denses (Terre & Eau)",

    kingsTitle: "Moulouk al-Sab'ah — Les Rois Spirituels des 7 Jours",
    kingsSubtitle: "Identifie le Roi Gouverneur du monde spirituel selon le modulo 7 du poids Abjad, son Ange Suprême et sa planète.",
    rulingAngel: "Ange Régisseur Suprême",
    governingPlanet: "Planète Gouvernante",
    sacredDay: "Jour Sacré d'Affinité",
    element: "Élément Dominant",
    sacredIncense: "Encens & Bakhour Sacré",
    spiritualSeal: "Sceau / Symbole Céleste",

    auxiliariesTitle: "A'wan — Les Serviteurs Secondaires Positifs",
    auxiliariesSubtitle: "Générés par la décomposition positionnelle du nombre (Unités, Dizaines, Centaines, Milliers) pour une action ciblée.",
    unitServant: "A'wan al-Ahad (Unités - Action Rapide)",
    tenServant: "A'wan al-Asharat (Dizaines - Cœur & Émotions)",
    hundredServant: "A'wan al-Miat (Centaines - Intellect & Esprit)",
    thousandServant: "A'wan al-Uluf (Milliers - Autorité & Présence)",

    vocalizationTitle: "Dabt al-Asma — Vocalisation Phonétique & Schémas Grammaticaux",
    vocalizationSubtitle: "Applique les schémas traditionnels (Wazn) pour garantir une prononciation exacte et sacrée lors du Nutaq (récitation orale).",
    schemeTitle: "Schéma Grammatical (Wazn)",
    exactPronunciation: "Prononciation Exacte & Phonétique",
    vocalFaailDesc: "Schéma céleste d'élévation sacrée (Fa'ā'īl). Utilisé pour la haute théurgie et l'invocation lumineuse.",
    vocalFailushDesc: "Schéma de commandement actif (Fā'ilūsh). Utilisé pour l'action rapide et la manifestation terrestre.",
    vocalMafulashDesc: "Schéma de protection et garde auxiliaire (Maf'ūlāsh). Utilisé pour le scellement et le bouclier.",

    scheduleTitle: "Calendrier de Connexion — Horaires & Rituels Optimales",
    scheduleSubtitle: "Planifiez votre communication rituelle selon les heures planétaires propices et le Bakhour recommandé.",
    alignmentActive: "Alignement Actif Aujourd'hui !",
    alignmentInactive: "Affinité Particulière avec :",
    bestTiming: "Horaires Planétaires Recommandés",
    repetitionCount: "Nombre de Répétitions (Zikr)",
    fullZimām: "Nombre Complet (Zimām Total)",
    reducedAsl: "Nombre Réduit (Asl Mufrad)",
    directionQibla: "Orientation & Qibla",

    exportPng: "Exporter la Fiche (PNG Deluxe)",
    exportParchment: "Exporter en Parchemin Sacré",
    copySuccess: "Copié dans le presse-papier !",
    copyName: "Copier le Nom",
    noticeFooterTitle: "Avertissement de Sagesse & Respect Sacré",
    noticeFooterText: "L'utilisation des Noms d'Istintaq et des Khuddam doit être faite dans une intention pure de dévotion, de recherche spirituelle et de bienfaisance. Respectez la pureté corporelle (Tahaarah) lors des récitations.",
  },

  en: {
    pageTitle: "Rouhaniyya Extraction (Guardians & Servants)",
    pageSubtitle: "Science of Istintaq: Discover Celestial Angels, Terrestrial Guardians, Kings of the 7 Days, Auxiliary A'wan, and Sacred Phonetic Vocalizations.",
    backToTools: "Back to Tools",
    headerBadge: "Ilm al-Ruhaniyat & Istintaq",
    infoNotice: "In esoteric letter science, every divine name or verse reveals its governing spiritual entities. Istintaq converts the Abjad total into vocalized root letters, sealed with suffixes 'A'il / Yā'īl (Celestial Angel) and 'Tash / Ṭayš (Terrestrial Guardian).",

    inputLabelText: "Enter a Name, Word, or Quranic Verse",
    inputLabelNumber: "Or enter direct Abjad numerical value (Zimām)",
    placeholderText: "e.g. Ya Latif (يا لطيف) or your name...",
    placeholderNumber: "e.g. 129, 313, 1000...",
    extractButton: "Extract Guardians",
    modeText: "Text / Name Mode",
    modeNumber: "Numerical Weight Mode",
    formulaLabel: "Subtract for Celestial Angel",
    formula41: "Subtraction 41 (Standard: Li / A'il)",
    formula51: "Subtraction 51 (Al-Buni Tradition: Ya'il)",
    suffixLabel: "Angelic Suffix",
    suffixYael: "-yael (يَائِيلُ)",
    suffixAel: "-ael (آئِيلُ)",

    totalWeight: "Total Abjad Weight (Zimām)",
    sourceText: "Source Text / Input",
    elementalComposition: "Elemental Composition",
    fire: "Fire (Nār)",
    air: "Air (Hawā')",
    water: "Water (Mā')",
    earth: "Earth (Turāb)",

    tabs: {
      celestial: "1. Celestial Angel ('Alawi)",
      terrestrial: "2. Terrestrial Guardian (Sifli)",
      kings: "3. Kings of the 7 Days",
      auxiliaries: "4. Auxiliaries (A'wan)",
      vocalization: "5. Vocalization (Dabt)",
      schedule: "6. Connection Schedule",
    },

    celestialTitle: "Muwakkil 'Alawi — High Celestial Angel",
    celestialSubtitle: "Governs etheric influence and spiritual light (Noor). Extracted by subtracting the angelic constant and adding Yā'īl.",
    celestialFormulaInfo: "Applied Formula: Abjad Weight minus Light Constant (41 or 51), converted to Arabic letters + Celestial Suffix.",
    celestialInvocationTitle: "Angelic Invocation Formula",
    celestialAttributesTitle: "Spiritual Attributes & Domain",
    celestialAttr1: "Etheric governance over higher celestial spheres",
    celestialAttr2: "Bearer of divine light and ethereal protection",
    celestialAttr3: "Inspires mental clarity and spiritual openings",

    terrestrialTitle: "Muwakkil Sifli — Terrestrial & Material Guardian",
    terrestrialSubtitle: "Governs physical execution in the material realm. Extracted by subtracting the physical constant (419) and adding Ṭayš.",
    terrestrialFormulaInfo: "Applied Formula: Abjad Weight minus Physical Key (419), converted to Arabic letters + Terrestrial Suffix (طَيْشُ).",
    terrestrialInvocationTitle: "Terrestrial Command Formula",
    terrestrialAttributesTitle: "Attributes & Action in Matter",
    terrestrialAttr1: "Concrete execution in the physical & material world",
    terrestrialAttr2: "Mediator for manifesting earthly needs",
    terrestrialAttr3: "Guardian of dense physical elements (Earth & Water)",

    kingsTitle: "Moulouk al-Sab'ah — Spiritual Kings of the 7 Days",
    kingsSubtitle: "Identifies the ruling Spiritual King using Abjad total modulo 7, his supreme Angel, and governing planet.",
    rulingAngel: "Supreme Ruling Angel",
    governingPlanet: "Governing Planet",
    sacredDay: "Sacred Day of Affinity",
    element: "Dominant Element",
    sacredIncense: "Sacred Incense & Bakhour",
    spiritualSeal: "Celestial Symbol / Seal",

    auxiliariesTitle: "A'wan — Secondary Positive Servants",
    auxiliariesSubtitle: "Generated by positional digit decomposition (Units, Tens, Hundreds, Thousands) for targeted action.",
    unitServant: "A'wan al-Ahad (Units - Fast Action)",
    tenServant: "A'wan al-Asharat (Tens - Heart & Emotions)",
    hundredServant: "A'wan al-Miat (Hundreds - Intellect & Spirit)",
    thousandServant: "A'wan al-Uluf (Thousands - Authority & Presence)",

    vocalizationTitle: "Dabt al-Asma — Phonetic Vocalization & Grammatical Schemes",
    vocalizationSubtitle: "Applies traditional grammatical schemes (Wazn) to guarantee accurate vocalization during oral recitation (Nutaq).",
    schemeTitle: "Grammatical Scheme (Wazn)",
    exactPronunciation: "Exact Pronunciation & Phonetics",
    vocalFaailDesc: "Celestial elevation scheme (Fa'ā'īl). Used for high theurgy and luminous invocation.",
    vocalFailushDesc: "Active command scheme (Fā'ilūsh). Used for rapid execution and earthly manifestation.",
    vocalMafulashDesc: "Auxiliary guard scheme (Maf'ūlāsh). Used for sealing and protective shielding.",

    scheduleTitle: "Connection Schedule — Optimal Timing & Rituals",
    scheduleSubtitle: "Plan your spiritual connection according to favorable planetary hours and recommended Bakhour.",
    alignmentActive: "Active Alignment Today!",
    alignmentInactive: "Special Affinity With:",
    bestTiming: "Recommended Planetary Hours",
    repetitionCount: "Repetition Count (Zikr)",
    fullZimām: "Full Number (Total Zimām)",
    reducedAsl: "Reduced Number (Asl Mufrad)",
    directionQibla: "Orientation & Qibla",

    exportPng: "Export Card (Deluxe PNG)",
    exportParchment: "Export Sacred Parchment",
    copySuccess: "Copied to clipboard!",
    copyName: "Copy Name",
    noticeFooterTitle: "Admonition of Wisdom & Sacred Respect",
    noticeFooterText: "Istintaq names and Khuddam must be approached with pure devotions, spiritual integrity, and noble intentions. Maintain bodily purity (Tahaarah) during recitations.",
  },

  ha: {
    pageTitle: "Cire Rouhaniyya (Masu Tsaro & Bayi)",
    pageSubtitle: "Ilimin Istintaq: Gano Mala'ikun Sama, Masu Tsaron Qasa, Sarakunan Ranakun 7, Taimakawa A'wan, da Karatun Haruffa Masu Alfarma.",
    backToTools: "Koma ga Kayan Aiki",
    headerBadge: "Ilm al-Ruhaniyat & Istintaq",
    infoNotice: "A ilimin sirrin haruffa, kowane suna ko aya yana bayyana ruhohin da ke gudanar da shi. Istintaq yana sauya adadin Abjad zuwa haruffa masu karatu tare da kari na Yā'īl da Ṭayš.",

    inputLabelText: "Shigar da Suna, Kalma, ko Ayar Alqur'ani",
    inputLabelNumber: "Ko ka shigar da adadin Abjad (Zimām) kai tsaye",
    placeholderText: "Misali: Ya Latif (يا لطيف) ko sunanka...",
    placeholderNumber: "Misali: 129, 313, 1000...",
    extractButton: "Ciro Masu Tsaro",
    modeText: "Hanyar Rubutu / Suna",
    modeNumber: "Hanyar Lamba (Zimām)",
    formulaLabel: "Cire Lamba don Mala'ikan Sama",
    formula41: "Cire 41 (Saba'a: Li / A'il)",
    formula51: "Cire 51 (Koyarwar Al-Buni: Ya'il)",
    suffixLabel: "Karin Suna na Mala'ika",
    suffixYael: "-yael (يَائِيلُ)",
    suffixAel: "-ael (آئِيلُ)",

    totalWeight: "Jimillar Nauyin Abjad (Zimām)",
    sourceText: "Rubutun Asali",
    elementalComposition: "Rarrabuwar Sunadaran",
    fire: "Wuta (Nār)",
    air: "Iska (Hawā')",
    water: "Ruwa (Mā')",
    earth: "Kasa (Turāb)",

    tabs: {
      celestial: "1. Mala'ikan Sama ('Alawi)",
      terrestrial: "2. Mai Tsaron Qasa (Sifli)",
      kings: "3. Sarakunan Ranakun 7",
      auxiliaries: "4. Masu Taimako (A'wan)",
      vocalization: "5. Karatun Suna (Dabt)",
      schedule: "6. Tsarin Lokaci & Waktu",
    },

    celestialTitle: "Muwakkil 'Alawi — Babban Mala'ikan Sama",
    celestialSubtitle: "Yana gudanar da hasken ruhaniyya na sama. Ana ciro shi ta hanyar cire lamba ta tsaro da kara Yā'īl.",
    celestialFormulaInfo: "Lissafi: Nauyin Abjad cire 41 ko 51, a sauya zuwa haruffa + kari na Sama.",
    celestialInvocationTitle: "Kirarin Mala'ikan Sama",
    celestialAttributesTitle: "Sifofin Ruhaniyya & Muhalli",
    celestialAttr1: "Gudanar da ruhohi a saman sama",
    celestialAttr2: "Mai ɗauke da hasken Allah da kariya",
    celestialAttr3: "Mai buɗe hankali da hanyoyin nasara",

    terrestrialTitle: "Muwakkil Sifli — Mai Tsaron Qasa & Sura",
    terrestrialSubtitle: "Yana gudanar da ayyukan fili a duniyar bil'adama. Ana ciro shi ta cire 419 da kara Ṭayš.",
    terrestrialFormulaInfo: "Lissafi: Nauyin Abjad cire 419, a sauya zuwa haruffa + kari na Qasa (طَيْشُ).",
    terrestrialInvocationTitle: "Hukuncin Qasa da Umarni",
    terrestrialAttributesTitle: "Sifofin Aiki a Filin Duniya",
    terrestrialAttr1: "Aiwatar da bukatu a duniyar mutane",
    terrestrialAttr2: "Gudanar da bukatun rayuwa na yau da kullum",
    terrestrialAttr3: "Mai tsaron sunadaran kasa da ruwa",

    kingsTitle: "Moulouk al-Sab'ah — Sarakunan Ranakun Mako 7",
    kingsSubtitle: "Yana bayyana Sarkin Ruhaniyya na mako ta lissafin modulo 7, Mala'ikansa na sama da duniyarsa.",
    rulingAngel: "Babban Mala'ika Mai Hukunci",
    governingPlanet: "Tauraron da Ke Mulki",
    sacredDay: "Rana Mai Albarka",
    element: "Sunadari Mafi Karfi",
    sacredIncense: "Turaren Wuta Masu Alfarma",
    spiritualSeal: "Alamar Ruhaniyya da Siga",

    auxiliariesTitle: "A'wan — Bayi da Masu Taimako",
    auxiliariesSubtitle: "Ana samar da su ta hanyar rarrabe lambobi (Guda, Goma, Dari, Dubu) don amfani na musamman.",
    unitServant: "A'wan al-Ahad (Guda - Aiki Mai Sauri)",
    tenServant: "A'wan al-Asharat (Goma - Zuciya & So)",
    hundredServant: "A'wan al-Miat (Dari - Hankali & Ruhaniyya)",
    thousandServant: "A'wan al-Uluf (Dubu - Iko & Bayyana)",

    vocalizationTitle: "Dabt al-Asma — Fitardda Karatu da Auna Haruffa",
    vocalizationSubtitle: "Yana amfani da ma'aunin nauyin larabci (Wazn) don tabbatar da karatu mai kyau da daidai (Nutaq).",
    schemeTitle: "Ma'aunin Larabci (Wazn)",
    exactPronunciation: "Karatun Harshe na Kwarai",
    vocalFaailDesc: "Ma'aunin sama mai daukaka (Fa'ā'īl). Don addu'o'i da neman haske.",
    vocalFailushDesc: "Ma'aunin umarni na aiki (Fā'ilūsh). Don aiki mai sauri a duniya.",
    vocalMafulashDesc: "Ma'aunin tsaro da gadi (Maf'ūlāsh). Don kariya da garkuwa.",

    scheduleTitle: "Tsarin Lokaci — Waktu & Turaren Wuta",
    scheduleSubtitle: "Tsara sadarwarku ta ruhaniyya a lokuta masu kyau na taurari da turaren da aka shawarta.",
    alignmentActive: "Lokaci Yana Dace Yau!",
    alignmentInactive: "Rana Mafi Dacewa:",
    bestTiming: "Sa'o'in Taurari Masu Kyau",
    repetitionCount: "Adadin Maimaitawa (Zikr)",
    fullZimām: "Cikakken Adadi (Zimām)",
    reducedAsl: "Adadi Mai Sauki (Asl Mufrad)",
    directionQibla: "Hanya & Qibla",

    exportPng: "Fitar da Kati (PNG Deluxe)",
    exportParchment: "Fitar da Parchemin Mai Tsarki",
    copySuccess: "An kopa zuwa clipboard!",
    copyName: "Kopa Suna",
    noticeFooterTitle: "Gargadi na Hikima da Tausayi",
    noticeFooterText: "Yi amfani da sunayen ruhaniyya cikin tsarkakakkiyar niyya da ibada. Kasance da tsarki na jiki (Tahaarah) yayin karatun zikr.",
  },
};
