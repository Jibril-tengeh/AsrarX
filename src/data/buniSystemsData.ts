export interface BuniSystem {
  id: string;
  number: number;
  titleFr: string;
  titleEn: string;
  titleHa: string;
  titleAr: string;
  category: 'divination' | 'taksir' | 'astrology' | 'awfaq' | 'secrets' | 'rituals';
  descriptionFr: string;
  descriptionEn: string;
  descriptionHa: string;
  detailsFr: string;
  detailsEn: string;
  detailsHa: string;
  khatimType: string;
  khatimFormulaAr: string;
  rulesFr: string;
  rulesEn: string;
  rulesHa: string;
}

export const BUNI_40_SYSTEMS: BuniSystem[] = [
  {
    id: 'sys-1',
    number: 1,
    titleFr: "1. La Za'irajah (La Machine Divinatoire Astrologique)",
    titleEn: "1. The Za'irajah (Astrological Divination Machine)",
    titleHa: "1. Za'irajah (Injin Hasashen Taurari)",
    titleAr: "الزايرجة - الآلة الفلكية الاستخراجية",
    category: 'divination',
    descriptionFr: "Un instrument complexe composé de cercles concentriques mobiles et de tables numériques de 28x28 cases. En y introduisant une question en lettres et le degré de l'ascendant astrologique, l'appareil génère des réponses rimées en vers poétiques.",
    descriptionEn: "A complex instrument composed of mobile concentric circles and 28x28 numerical tables. By introducing a question in letters and the degree of the ascendant, it generates rhymed responses in poetic verses.",
    descriptionHa: "Wani ingantaccen ma'auni ne mai haɗakar zobe da tebura mai dakuna 28x28. Bayan shigar da tambaya a haruffa da darajar tauraron lokacin, yana fito da amsoshi masu tsari cikin wake.",
    detailsFr: `### Description Profonde & Fonctionnement
La Za'irajah d'Ahmad Al-Buni est considérée comme l'ancêtre ésotérique de la cybernétique et des algorithmes de génération textuelle. Composée de cercles célestes mobiles (représentant les 28 maisons lunaires, les 12 signes du zodiaque, les 4 éléments et les planètes), elle est couplée à une matrice principale de 28 sur 28 cases (784 cellules).

### Méthodologie d'Utilisation
1. **Transcription de la Question :** Convertir la question en lettres arabes pures, débarrassées des voyelles et des répétitions superflues.
2. **Prise de l'Ascendant (Tali') :** Déterminer le degré exact de l'ascendant astrologique au moment où la question est posée à l'aide d'un astrolabe.
3. **Pondération Abjad & Rotation des Cercles :** Aligner le cercle des éléments sur le degré de l'ascendant. Insérer chaque lettre dans la grille 28x28 selon les pas de déplacement (*Dawar*).
4. **Extraction des Lettres Réponses :** En suivant la règle des sauts de cases (*Al-Tafrah*) et des correspondances cosmiques, l'opérateur extrait une série de lettres qui, une fois réassemblées, forment des vers poétiques explicites (*Qasidah*) apportant une réponse claire et prophétique.`,
    detailsEn: `### Deep Description & Operation
Ahmad Al-Buni's Za'irajah is considered the esoteric precursor to cybernetics and textual algorithms. Composed of mobile celestial circles (representing the 28 lunar mansions, 12 zodiac signs, 4 elements, and planets), it is paired with a primary 28x28 grid (784 cells).

### Step-by-Step Methodology
1. **Question Transcription:** Convert the query into pure Arabic letters, removing vowels and unnecessary repetitions.
2. **Astrological Ascendant:** Calculate the exact degree of the ascendant at the moment of the inquiry using an astrolabe.
3. **Abjad Weighting & Circle Alignment:** Rotate elemental circles to match the ascendant degree. Map letters into the 28x28 matrix following defined shift steps (*Dawar*).
4. **Answer Extraction:** Following the rules of cell jumps (*Al-Tafrah*) and cosmic correspondences, extract letters that combine into poetic verses (*Qasidah*) answering the query with prophetic precision.`,
    detailsHa: `### Cikakken Bayani da Hanyar Aiki
Za'irajah ta Sheikh Ahmad Al-Buni ana daukarsa azaman harsashen ilimin na'ura mai kwakwalwa ta tsarin rufintaka. Tana kunshe da zobuna masu juyawa na taurari 28, alamomin zodiac 12, da teburi mai gidaje 28x28.

### Matakan Aiki
1. **Rubuta Tambaya:** Canza tambaya zuwa haruffan Larabci masu tsarki.
2. **Duba Tauraron Lokacin:** Gano darajar tauraron da yake fitowa a lokacin tambayar.
3. **Juyar da Zobuna:** Jeranta haruffa a cikin dakuna 28x28 bisa tsarin Abjad.
4. **Fitar da Amsa:** Fitar da haruffan da zasu haɗe su zama waka mai ma'ana da amsa bayyananna.`,
    khatimType: 'zaIrajah',
    khatimFormulaAr: "سُؤَالٌ عَنْ غَيْبِ الأُمُورِ تُجِيبُهُ دَوَائِرُ الأَفْلَاكِ بِالحِكْمَةِ الإِلَهِيَّةِ",
    rulesFr: "À utiliser uniquement pendant l'heure de Jupiter ou de Mercure, en état de pureté rituelle complète (Wudu).",
    rulesEn: "Perform strictly during the hour of Jupiter or Mercury under full ritual purity (Wudu).",
    rulesHa: "A gudanar kawai a sa'ar Mushtari (Jupiter) ko Utarid (Mercury) tare da cikakken tsarki."
  },
  {
    id: 'sys-2',
    number: 2,
    titleFr: "2. Le Taksir Avancé (La Permutation Spirale)",
    titleEn: "2. Advanced Taksir (Spiral Permutation)",
    titleHa: "2. Taksir na Cikakkiya (Juya Haruffa a Spiral)",
    titleAr: "التكسير المتقدم - التداخل الحلزوني للحروف",
    category: 'taksir',
    descriptionFr: "Technique de permutation textuelle alternant la dernière, la première, l'avant-dernière et la deuxième lettre d'une ligne jusqu'à ce que la ligne initiale réapparaisse (Zimam).",
    descriptionEn: "A text permutation technique alternating the last, first, second-to-last, and second letter of a line until the original row reappears (Zimam).",
    descriptionHa: "Dabarar sake tsara haruffa ta hanyar ɗaukar na ƙarshe, na farko, na kafin ƙarshe, da na biyu har sai layin farko ya sake dawowa.",
    detailsFr: `### Description Profonde
Le Taksir (ou broyage/permutation des lettres) est l'une des pierres angulaires de la science des lettres (*'Ilm al-Huruf*). Il permet de fusionner la vibration d'un être humain (prénom et nom) avec un Nom Divin ou un verset d'intervention divine.

### Méthodologie d'Extraction Spirale
1. **Ligne de Base (Satr al-Asl) :** Écrire côte à côte le Nom du Demandeur et le Nom Divin choisi (ex: 'عَلِي' + 'لَطِيف').
2. **Génération de la Ligne 2 :** Prendre la *dernière* lettre du Satr al-Asl, puis la *première*, puis l'*avant-dernière*, puis la *deuxième*, et ainsi de suite.
3. **Répétition du Cycle :** Appliquer le même algorithme sur la ligne 2 pour obtenir la ligne 3.
4. **Le Zimam (La Clôture) :** Continuer jusqu'à ce que la ligne générée soit rigoureusement IDENTIQUE à la première ligne. Le nombre de lignes obtenues constitue le *Zimam* (la clé numérique sacrée du talisman).`,
    detailsEn: `### Deep Description
Taksir (letter fracturing/permutation) is a fundamental technique in the Science of Letters (*'Ilm al-Huruf*). It merges the energetic frequency of an individual with Divine Names or sacred verses.

### Spiral Permutation Protocol
1. **Base Row (Satr al-Asl):** Combine the Target Person's Name with the chosen Divine Name (e.g., 'ALI' + 'LATIF').
2. **Generating Row 2:** Take the *last* letter of Row 1, then the *first*, then the *second-to-last*, then the *second*, continuing inward.
3. **Cyclic Iteration:** Repeat the process row by row.
4. **The Zimam (Closure):** The cycle ends when a generated row matches the initial base row. The total number of rows yields the *Zimam*, forming the exact mathematical code for the talisman.`,
    detailsHa: `### Cikakken Bayani
Taksir shine lalata ko haɗa haruffa tsakanin sunan mutum da Sunan Allah ko Aya ta Alqur'ani don samun ƙarfin ruhi.

### Hanyar Aiki
1. **Layin Farko:** Rubuta sunan mutum da Sunan Allah a jere.
2. **Layi na Biyu:** Ɗauki harafi na ƙarshe, sannan na farko, sannan na kafin ƙarshe, sannan na biyu.
3. **Cigaba da Aiki:** Maimaita wannan tsarin akan kowane layi.
4. **Zimam:** Zai ƙare ne lokacin da layin ya dawo daidai da layin farko.`,
    khatimType: 'taksir',
    khatimFormulaAr: "عَلِيٌّ لَطِيفٌ - فَنِصْفُ الحُرُوفِ لِلسِّرِّ وَنِصْفُهَا لِلنُّورِ",
    rulesFr: "Tracer le tableau de Taksir sur du papier jaune ou du parchemin naturel à l'encre de safran.",
    rulesEn: "Write the Taksir table on yellow paper or natural parchment using saffron ink.",
    rulesHa: "Rubuta teburin Taksir akan takarda ma rawaya ko fatar dabbobi da tawadar za'afaran."
  },
  {
    id: 'sys-3',
    number: 3,
    titleFr: "3. La Cryptographie et Alphabets Secrets (Al-Aqlam al-Siriya)",
    titleEn: "3. Cryptography and Secret Alphabets (Al-Aqlam al-Siriya)",
    titleHa: "3. Harsunan Asiri da Rubuce-rubucen Boye (Al-Aqlam al-Siriya)",
    titleAr: "الأقلام السرية والرموز الهرمسية المعماة",
    category: 'secrets',
    descriptionFr: "Alphabets de substitution secrets (Alphabet d'Hermès, Kufi crypté, Caractères Célestes) garantissant que seuls les initiés puissent décoder et employer les formules talismaniques.",
    descriptionEn: "Secret substitution alphabets (Hermetic script, encrypted Kufic, Celestial symbols) ensuring that only initiates can decode and employ power formulas.",
    descriptionHa: "Haruffan asiri na musamman da aka kirkira don ɓoye sunayen ruhohi da kalaman asiri don kada kowa ya gane sai masana.",
    detailsFr: `### Description Profonde
Ahmad Al-Buni consacre des chapitres entiers aux *Aqlam* (pluriel de Qalam - écritures sacrées secrets). Ces alphabets ne sont pas de simples codes d'espionnage, mais des glyphes dont la forme géométrique résonne directement avec les fréquences des entités spirituelles.

### Les Principaux Alphabets d'Al-Buni
1. **Qalam al-Hukama (L'Écriture des Sages/Hermétique) :** Basée sur des cercles et des traits d'angles droits.
2. **Qalam al-Tiyyah (L'Alphabet Céleste) :** Utilisé pour transcrire les Noms Suprêmes d'Allah et les Sceaux des Archanges.
3. **Al-Kufi al-Mu'amma (Le Kufi Crypté) :** Style calligraphique géométrique entrelacé rendant les mots illisibles pour le profane.

### Application Talismanique
Lors de la rédaction d'un Khatim, les mots de pouvoir ou les noms des gardiens ne sont jamais inscrits en arabe courant. Ils sont traduits lettre par lettre dans l'un des *Aqlam* sacrés afin de concentrer la force psychique de l'opérateur.`,
    detailsEn: `### Deep Description
Ahmad Al-Buni dedicated extensive sections to the *Aqlam* (sacred secret scripts). Rather than simple ciphers, these glyphs are geometric shapes engineered to resonate with spiritual dimensions.

### Core Alphabets in Al-Buni's Corpus
1. **Qalam al-Hukama (Hermetic Script):** Built upon circles and right-angled points.
2. **Qalam al-Tiyyah (Celestial Alphabet):** Employed for the Supreme Names of God and Archangelic Seals.
3. **Al-Kufi al-Mu'amma (Encrypted Kufic):** Interlaced geometric calligraphy concealing secret formulas.

### Method of Usage
When inscribing a Khatim, sacred names and guardian keys are rendered in these secret alphabets to intensify mental focus and shield esoteric formulas from unauthorized usage.`,
    detailsHa: `### Cikakken Bayani
Al-Buni ya bayyana hanyoyin rubuta haruffan asiri (Aqlam) waɗanda ba ko da yaushe mutane ke iya karanta su ba. Tekun ilimin haruffa yana buƙatar ɓoye asirai.

### Nau'ikan Haruffan
1. **Qalam al-Hukama:** Rubutun masana na dā.
2. **Qalam al-Tiyyah:** Rubutun Mala'iku da Sunaye Masu Girma.
3. **Al-Kufi al-Mu'amma:** Rubutun Kufi mai rikiɗewa.`,
    khatimType: 'cryptography',
    khatimFormulaAr: "أ ق ل ا م  ا ل سِّ رِّ  ا ل هَ رْ مَ سِ يَّ ةِ",
    rulesFr: "Chaque caractère secret doit être gravé d'un seul trait ininterrompu sans rature.",
    rulesEn: "Each secret glyph must be drawn in a single continuous stroke without retouching.",
    rulesHa: "Kowane harafi na asiri dole ne a rubuta shi da hannu daya ba tare da gogewa ba."
  },
  {
    id: 'sys-4',
    number: 4,
    titleFr: "4. Le Calcul d'Extraction d'Entités (Istikhraj)",
    titleEn: "4. Entity Extraction Algorithm (Istikhraj)",
    titleHa: "4. Isar da Sunan Mala'ika ko Ruhi (Istikhraj)",
    titleAr: "الاستخراج العاددي لأسماء الأملاك والخدام",
    category: 'secrets',
    descriptionFr: "Méthode algébrique déduisant le nom d'un gardien spirituel. On calcule la valeur Abjad d'un vœu, on soustrait des constantes fixes, puis on convertit en lettres avec le suffixe '-ya'il' ou '-tush'.",
    descriptionEn: "Algebraic method deriving a spiritual guardian's name. Calculate the Abjad value of a intent, subtract fixed constants, and convert the remainder into letters with '-ya'il' or '-tush' suffixes.",
    descriptionHa: "Lissafin cire sunan mala'ika ko aljani mai hidima ta hanyar lissafin Abjad na bukatar mutum, sannan a ƙara '-ya'il' ko '-tush'.",
    detailsFr: `### Description Profonde
L'Istikhraj est l'algorithme par lequel on génère le nom de l'ange céleste (*Malak*) ou du serviteur terrestre (*Khadim*) gouvernant une intention ou un carré magique.

### Formule de Calcul
1. **Valeur Totale (Jumla) :** Soit $V$ la valeur Abjad totale du verset ou du vœu (ex: $V = 1209$).
2. **Extraction Angélique Céleste (Suffixe "-ياغيل" ou "-يَائِيل" = 51) :**
   $$\text{Reste} = V - 51$$
   Convertir le Reste en lettres Abjad, puis ajouter le suffixe **ياائيل** (-ya'il).
3. **Extraction d'Entité Terrestre (Suffixe "-طَوَشْ" ou "-طَشْ" = 319) :**
   $$\text{Reste} = V - 319$$
   Convertir le Reste en lettres Abjad, puis ajouter le suffixe **طَشْ** (-tush).`,
    detailsEn: `### Deep Description
Istikhraj is the exact mathematical operation used to deduce the governing celestial angel (*Malak*) or terrestrial servant (*Khadim*) for any desire or magic square.

### Algebraic Protocol
1. **Total Weight (Jumla):** Let $V$ be the Abjad sum of the intention (e.g., $V = 1209$).
2. **Celestial Angel Derivation (Suffix "-ya'il" = 51):**
   $$\text{Remainder} = V - 51$$
   Convert Remainder into Abjad letters and append **ياائيل** (-ya'il).
3. **Terrestrial Entity Derivation (Suffix "-tush" = 319):**
   $$\text{Remainder} = V - 319$$
   Convert Remainder into Abjad letters and append **طَشْ** (-tush).`,
    detailsHa: `### Cikakken Bayani
Istikhraj shine hanyar lissafi da ake ciro sunan Mala'ika mai tsaro ko Ruhi ta hanyar Abjad na aya ko buƙata.

### Tsarin Lissafi
1. **Jimillar Abjad (V):** Lissafa adadin Abjad na kalaman buƙatarka.
2. **Ciro Sunan Mala'ika:** Cire 51 daga jimillar, sannan a maida sauran zuwa haruffa a ƙara "-ya'il".
3. **Ciro Sunan Ruhi:** Cire 319 sannan a maida sauran zuwa haruffa a ƙara "-tush".`,
    khatimType: 'istikhraj',
    khatimFormulaAr: "جُمْلَةُ العَدَدِ - ٥١ = حُرُوفُ المَلَكِ (يَائِيل)",
    rulesFr: "Répéter le nom d'ange extrait au nombre exact du reste avant d'inscrire le Wafq.",
    rulesEn: "Recite the extracted angelic name the exact number of times equal to the remainder before sealing.",
    rulesHa: "Karanta sunan mala'ika adadin da ya rage kafin rufewa."
  },
  {
    id: 'sys-5',
    number: 5,
    titleFr: "5. La Balance des Tempéraments (Mizan al-Huruf)",
    titleEn: "5. The Balance of Temperaments (Mizan al-Huruf)",
    titleHa: "5. Mizanan Yanayi da Halaye (Mizan al-Huruf)",
    titleAr: "ميزان الحروف والطبائع الأربع",
    category: 'awfaq',
    descriptionFr: "Système classant chaque lettre selon les 4 éléments (Feu, Terre, Air, Eau). Pour traiter un déséquilibre, l'opérateur construit un talisman aux propriétés élémentaires opposées.",
    descriptionEn: "System classifying letters into the 4 elements (Fire, Earth, Air, Water). To cure an imbalance, construct a talisman with opposing elemental properties.",
    descriptionHa: "Raba haruffa zuwa muhallai 4 (Wuta, Kasa, Iska, Ruwa) don daidaita yanayi ko jiki ta hanyar katsa haruffan da suka dace.",
    detailsFr: `### Classification des 28 Lettres selon Al-Buni
- **Feu (Chaud & Sec) - 7 Lettres :** ا ، هـ ، ط ، م ، ف ، ش ، ذ
- **Terre (Froid & Sec) - 7 Lettres :** ب ، و ، ي ، ن ، ص ، ت ، ض
- **Air (Chaud & Humide) - 7 Lettres :** ج ، ز ، ك ، س ، ق ، ث ، ظ
- **Eau (Froid & Humide) - 7 Lettres :** د ، ح ، ل ، ع ، ر ، خ ، غ

### Application Thérapeutique & Théurgique
Si une personne souffre d'un excès d'élément Feu (fèvre, colère, inflammation), Al-Buni préconise de composer une grille talismanique (*Mizan*) dominée par l'élément Eau (د ، ح ، ل ، ع ، ر ، خ ، غ) pour refroidir et harmoniser les humeurs biologiques et spirituelles.`,
    detailsEn: `### Al-Buni's 28 Letter Elemental Distribution
- **Fire (Hot & Dry):** ا ، هـ ، ط ، م ، ف ، ش ، ذ
- **Earth (Cold & Dry):** ب ، و ، ي ، ن ، ص ، ت ، ض
- **Air (Hot & Wet):** ج ، ز ، ك ، س ، ق ، ث ، ظ
- **Water (Cold & Wet):** د ، ح ، ل ، ع ، ر ، خ ، غ

### Therapeutic & Esoteric Application
If an individual experiences a Fire elemental surge (fever, anger, inflammation), Al-Buni designs a balancing talisman (*Mizan*) dominated by Water letters to cool and restore physical and subtle equilibrium.`,
    detailsHa: `### Rabon Haruffan 28 zuwa Muhalli
- **Wuta:** ا ، هـ ، ط ، م ، ف ، ش ، ذ
- **Ƙasa:** ب ، و ، ي ، ن ، ص ، ت ، ض
- **Iska:** ج ، ز ، ك ، س ، ق ، ث ، ظ
- **Ruwa:** د ، ح ، ل ، ع ، ر ، خ ، غ`,
    khatimType: 'mizan',
    khatimFormulaAr: "نَارٌ - تُرَابٌ - هَوَاءٌ - مَاءٌ = تَعَادُلُ الطَّبَائِعِ",
    rulesFr: "Écrire les lettres d'Eau à l'encre rose ou bleue pour éteindre le Feu.",
    rulesEn: "Inscribe Water letters using rose or blue ink to quench Fire.",
    rulesHa: "Rubuta haruffan Ruwa da tawadar shuɗi ko ja don kashe wuta."
  },
  {
    id: 'sys-6',
    number: 6,
    titleFr: "6. La Théurgie Astronomique de Précision (Al-Rasad)",
    titleEn: "6. Precision Astronomical Theurgy (Al-Rasad)",
    titleHa: "6. Duban Taurari na Daidaito (Al-Rasad)",
    titleAr: "الرصد الفلكي والساعات الكوكبية",
    category: 'astrology',
    descriptionFr: "Calcul de la position exacte des corps célestes à l'astrolabe pour agir lors de l'exaltation d'une planète. Un talisman tracé en dehors de cette fenêtre de quelques minutes est inefficace.",
    descriptionEn: "Calculating exact planetary positions with an astrolabe during planetary exaltations. Talismans drawn outside this exact multi-minute window lose efficacy.",
    descriptionHa: "Lissafin daidaitaccen matsayin taurari da wata. Rubuta laya ko khatim a wajen sa'ar da aka diba ba zai yi aiki ba.",
    detailsFr: `### Le Concept d'Al-Rasad
Pour Ahmad Al-Buni, les astres ne sont pas des dieux, mais des horloges cosmiques orchestrées par la Volonté Divinement décrétée. Chaque planète possède un moment d'Exaltation (*Sharaf*) et un domicile (*Bayt*).

### Règles des Fenêtres Temporelles
- **Exaltation du Soleil (Sharaf al-Shams) :** 19ème degré du Signe du Bélier (Aries). Moment suprême pour l'autorité, la lumière et la souveraineté.
- **Exaltation de la Lune (Sharaf al-Qamar) :** 3ème degré du Taureau (Taurus). Pour la prospérité, la mémoire et l'harmonie familiale.
- **Exaltation de Jupiter (Sharaf al-Mushtari) :** 15ème degré du Cancer. Pour l'abondance financière et la haute sagesse.`,
    detailsEn: `### The Principle of Al-Rasad
For Al-Buni, planets act as celestial clocks governed by Divine Decree. Each planet possesses an Exaltation point (*Sharaf*) and a House (*Bayt*).

### Key Astrological Windows
- **Sun Exaltation (Sharaf al-Shams):** 19th degree of Aries. Unmatched for authority, enlightenment, and victory.
- **Moon Exaltation (Sharaf al-Qamar):** 3rd degree of Taurus. For prosperity, memory retention, and domestic harmony.
- **Jupiter Exaltation (Sharaf al-Mushtari):** 15th degree of Cancer. For wealth accumulation and divine wisdom.`,
    detailsHa: `### Sharadin Al-Rasad
Taurari clocks ne na halitta. Kowane tauraro yana da lokacin samun nasara (Sharaf).

### Mafi Muhimmancin Lokuta
- **Ranar Sharaf al-Shams:** Ranar 19 ga watan Bélier.
- **Ranar Sharaf al-Qamar:** Ranar 3 ga watan Taureau.`,
    khatimType: 'astrolabe',
    khatimFormulaAr: "الشَّرَفُ الفَلَكِيُّ وَسَاعَةُ الاِسْتِجَابَةِ العُلْيَا",
    rulesFr: "Utiliser une boussole astro-géodésique ou un logiciel d'astronomie de précision.",
    rulesEn: "Utilize precise astronomical software or an astrolabe to pinpoint exact degrees.",
    rulesHa: "Yi amfani da hanyoyin duba taurari na zamani ko na gargajiya don gano sa'ar."
  },
  {
    id: 'sys-7',
    number: 7,
    titleFr: "7. Localisation des Rijal al-Ghayb (La Boussole Spirituelle)",
    titleEn: "7. Tracking the Rijal al-Ghayb (Spiritual Compass)",
    titleHa: "7. Nemar Mutanen Ɓoye (Rijal al-Ghayb)",
    titleAr: "بوصلة رجال الغيب والتوجه المكاني",
    category: 'astrology',
    descriptionFr: "Diagramme circulaire divisé en 32 directions pour calculer la position quotidienne des 30 Hommes de l'Invisible selon le jour lunaire. L'invocateur s'oriente pour les avoir dans son dos ou à sa gauche.",
    descriptionEn: "A 32-direction compass calculating the daily location of the 30 Unseen Beings according to the lunar calendar. The practitioner positions them behind or to the left.",
    descriptionHa: "Zane mai bangarori 32 na gano inda Rijal al-Ghayb ke zama a kowace ranar wata, domin mai addu'a ya sa su a bayansa ko ta hagunsa.",
    detailsFr: `### Qui sont les Rijal al-Ghayb ?
Ce sont des hiérarchies d'êtres spirituels hautement évolués qui arpentent la Terre pour maintenir l'équilibre invisible du monde.

### La Méthode d'Orientation
Selon le jour de la lune (du 1er au 30ème jour du mois hijri), les Rijal al-Ghayb se situent dans une direction géographique précise (Nord, Sud-Est, Ouest-Sud-Ouest...).
- **Règle Absolue d'Al-Buni :** Ne jamais prier ou invoquer en faisant FACE aux Rijal al-Ghayb, sous peine de voir ses énergies dispersées.
- **Orientation Correcte :** Placer les Rijal al-Ghayb **derrière soi** (Sutrah) ou à sa **gauche** pour recevoir leur soutien spirituel sans leur faire affront.`,
    detailsEn: `### Who are the Rijal al-Ghayb?
They are hidden spiritual hierarchies wandering the earth to maintain global spiritual equilibrium.

### Directional Positioning
Depending on the Hijri lunar day (1 to 30), the Rijal al-Ghayb occupy a specific geographical sector.
- **Al-Buni's Iron Rule:** Never face the Rijal al-Ghayb directly during invocations.
- **Proper Orientation:** Keep them **behind you** or to your **left** to absorb their spiritual support safely.`,
    detailsHa: `### Su wane ne Rijal al-Ghayb?
Mutane ne na ruhi da ke kewaya duniya don kiyaye daidaiton ruhi.

### Hanyar Fuskanta
Dangane da ranar wata (1 zuwa 30), ka sanya su a bayan ka ko ta hagun ka lokacin addu'a.`,
    khatimType: 'rijalGhayb',
    khatimFormulaAr: "السَّلاَمُ عَلَيْكُمْ يَا رِجَالَ الغَيْبِ وَيَا أَرْوَاحَ القُدْسِ",
    rulesFr: "Consulter la table des 30 jours hijris avant chaque grand Dhikr.",
    rulesEn: "Check the 30-day Hijri compass table before commencing major Dhikr.",
    rulesHa: "Duba teburin kwanaki 30 na Hijira kafin fara wazifa."
  },
  {
    id: 'sys-8',
    number: 8,
    titleFr: "8. L'Entrelacement des Textes (Al-Imtizaj)",
    titleEn: "8. Textual Interlacing (Al-Imtizaj)",
    titleHa: "8. Gwada Haruffan Sunaye da Ayoyi (Al-Imtizaj)",
    titleAr: "الامتزاج بين الأسماء والآيات الشريفة",
    category: 'taksir',
    descriptionFr: "Fusion lettre par lettre du nom d'une personne avec un verset coranique ou un Nom Divin (ex: alterner une lettre du prénom et une lettre du verset) pour construire un carré magique personnalisé.",
    descriptionEn: "Letter-by-letter fusion of a person's name with a sacred verse or Divine Name, producing a hybrid text to construct a customized magic square.",
    descriptionHa: "Gauraya haruffan sunan mutum da haruffan Ayar Alkur'ani ɗaya bayan ɗaya don gina wafq na musamman.",
    detailsFr: `### Procédé d'Imtizaj
L'Imtizaj crée un pont vibratoire indissoluble entre le demandeur et le texte sacré.

### Exemple Pratique
- **Nom du demandeur :** مُحَمَّد (M - H - M - D)
- **Nom Divin :** نُور (N - W - R)
- **Résultat de l'Imtizaj :** مـ - ن - حـ - و - مـ - ر - د
Ce texte entrelacé est ensuite converti en Abjad pour alimenter la case initiale d'un Wafq (Carré Magique).`,
    detailsEn: `### Imtizaj Procedure
Imtizaj builds a resonance bridge between an individual and sacred scriptures.

### Practical Example
- **Target Name:** MUHAMMAD (M - H - M - D)
- **Divine Name:** NUR (N - W - R)
- **Interlaced Result:** M - N - H - W - M - R - D
This hybrid sequence is converted into Abjad to seed a magic square.`,
    detailsHa: `### Hanyar Imtizaj
Haɗa harafi ɗaya na suna da harafi ɗaya na ayar Alkur'ani.

### Misali
Suna: MUHAMMAD, Sunan Allah: NUR.
Sakamakon: M - N - H - W - M - R - D.`,
    khatimType: 'taksir',
    khatimFormulaAr: "امتزاج اسم الطالب بالآية الكريمة نُورٌ عَلَى نُورٍ",
    rulesFr: "Veiller à équilibrer le nombre de lettres de part et d'autre.",
    rulesEn: "Ensure equal distribution of letters from both source words.",
    rulesHa: "Tabbatar da adadin haruffan biyu sun daidaita."
  },
  {
    id: 'sys-9',
    number: 9,
    titleFr: "9. Les Carrés Magiques Emboîtés (Al-Awfaq al-Mutadakhilah)",
    titleEn: "9. Nested Magic Squares (Al-Awfaq al-Mutadakhilah)",
    titleHa: "9. Wafq Mai Gida a Cikin Gida (Al-Awfaq al-Mutadakhilah)",
    titleAr: "الأوفاق المتداخلة والشرائح المزدوجة",
    category: 'awfaq',
    descriptionFr: "Figures géométriques où plusieurs sous-carrés numériques d'ordre inférieur (ex: d'ordre 3) sont insérés et calculés à l'intérieur d'un carré magique global d'ordre supérieur (ex: d'ordre 9).",
    descriptionEn: "Complex geometric figures where smaller magic squares (e.g., 3x3) are inserted and calculated inside a larger overarching square (e.g., 9x9).",
    descriptionHa: "Ginshikin wafq inda ake sanya ƙananan wafq na 3x3 a cikin babban wafq na 9x9 don gudanar da bukatu daban-daban.",
    detailsFr: `### Architecture d'un Wafq Emboîté
Au lieu de calculer un simple carré 3x3 ou 4x4, Ahmad Al-Buni élabore des structures matricielles fractales. Un carré 9x9 contient 9 sous-carrés de 3x3. Chaque sous-carré résout une sous-intention (ex: protection, richesse, sagesse) tandis que la somme globale du carré 9x9 harmonise l'ensemble de la vie du sujet.`,
    detailsEn: `### Nested Wafq Architecture
Instead of single 3x3 or 4x4 grids, Al-Buni crafts fractal matrices. A 9x9 square embeds nine 3x3 sub-squares. Each sub-square addresses a specific sub-intent while the total 9x9 sum governs the user's holistic life pattern.`,
    detailsHa: `### Tsarin Wafq Mai Gida a Cikin Gida
Babban wafq na 9x9 yana ɗauke da ƙananan wafq 9 na 3x3 a ciki.`,
    khatimType: 'awfaqNested',
    khatimFormulaAr: "وَفْقٌ فِي وَفْقٍ - ثَلاَثِيٌّ فِي تِسْعَاوِيٍّ مُبَارَكٍ",
    rulesFr: "Calculer d'abord la case centrale du grand carré avant de remplir les sous-matrices.",
    rulesEn: "Calculate the central core of the master grid before populating inner sub-matrices.",
    rulesHa: "Fara lissafin dakin tsakiya na babban wafq kafin cike ƙananan."
  },
  {
    id: 'sys-10',
    number: 10,
    titleFr: "10. La Gestion Algébrique des Restes (Al-Kasr)",
    titleEn: "10. Algebraic Remainder Management (Al-Kasr)",
    titleHa: "10. Sarrafa Ragowar Lissafi (Al-Kasr bini Bayt al-Tafrah)",
    titleAr: "الكسر الرياضي وبيت الطفرة في الأوفاق",
    category: 'awfaq',
    descriptionFr: "Traitement du reste d'une division lorsque la valeur d'un vœu ne se divise pas parfaitement dans la grille. On ajoute +1 dans une case précise appelée 'la case du saut' (Bayt al-Tafrah).",
    descriptionEn: "Handling mathematical remainders when a target sum doesn't divide evenly. A +1 offset is added to a specific cell called the 'jump cell' (Bayt al-Tafrah).",
    descriptionHa: "Idan lissafin Abjad bai kasu daidai a gidajen wafq ba, ana ƙara 1 a cikin dakin da ake kira 'Bayt al-Tafrah'.",
    detailsFr: `### La Règle du Kasr
Pour un carré 3x3, la formule standard est : $(V - 12) / 3$.
Si le reste de la division est 1 ou 2, le carré ne serait pas en équilibre parfait si l'on utilisait des nombres entiers purs.
- **Si Reste = 1 :** Ajouter +1 à la case N°7 (Bayt al-Tafrah).
- **Si Reste = 2 :** Ajouter +1 à la case N°5 et +1 à la case N°9.
Ceci préserve la somme diagonale et horizontale absolue du carré magique.`,
    detailsEn: `### The Kasr Offset Rule
For a 3x3 magic square, the formula is: $(V - 12) / 3$.
If the remainder is 1 or 2, integers cannot naturally sum evenly.
- **If Remainder = 1:** Add +1 to Cell #7 (Bayt al-Tafrah).
- **If Remainder = 2:** Add +1 to Cell #5 and Cell #9.
This maintains absolute diagonal and horizontal row totals.`,
    detailsHa: `### Dokar Kasr
A wafq 3x3, tsarin shine $(V - 12) / 3$.
- Idan ragowar 1 ne, ƙara 1 a ɗaki na 7.
- Idan ragowar 2 ne, ƙara 1 a ɗaki na 5 da ɗaki na 9.`,
    khatimType: 'awfaq3x3',
    khatimFormulaAr: "مَفْتَاحُ الكَسْرِ فِي بَيْتِ الطَّفْرَةِ السَّابِعِ",
    rulesFr: "Ne jamais arrondir avec des décimales, utiliser uniquement la technique de la case du saut.",
    rulesEn: "Never use decimals; rely exclusively on the jump cell offset method.",
    rulesHa: "Kada ka yi amfani da sabani na lamba, yi amfani da Bayt al-Tafrah."
  },
  {
    id: 'sys-11',
    number: 11,
    titleFr: "11. Le Chiffrement Temporel Dynamique",
    titleEn: "11. Dynamic Time Encryption",
    titleHa: "11. Sauyin Darajar Haruffa sa'a-sa'a",
    titleAr: "التشفير الزمني المتغير بحسب الساعات",
    category: 'secrets',
    descriptionFr: "Système où la valeur numérique attribuée à une lettre change dynamiquement selon le jour de la semaine et la planète régente du moment de l'opération.",
    descriptionEn: "A system where a letter's numerical value shifts dynamically based on the day of the week and planetary ruler at the moment of execution.",
    descriptionHa: "Tsarin da darajar harafi ke canzawa dangane da ranar mako da tauraro mai mulkin wannan sa'ar.",
    detailsFr: `### Concept
L'Abjad standard attribue une valeur fixe (Alif=1, Ba=2...). Cependant, dans le Chiffrement Temporel Dynamique, si l'opération est réalisée le Mardi (jour de Mars), la lettre Alif prend la valeur 1 * multipliée par la constante martienne (9), soit 9. Ce chiffrement adapte le pouvoir talismanique au flux temporel instantané.`,
    detailsEn: `### Concept
Standard Abjad assigns static values (Alif=1, Ba=2...). In Dynamic Time Encryption, executing a rite on Tuesday (ruled by Mars) multiplies Alif's value by the Martian constant (9), yielding 9. This locks the talisman's force into the temporal wave.`,
    detailsHa: `### Bayani
Darajar haruffa tana nunka kanta dangane da tauraron ranar (misali ranar Talata ta Mars).`,
    khatimType: 'cryptography',
    khatimFormulaAr: "حِسَابُ حُرُوفِ الزَّمَانِ المُمَتَّدِ عَبْرَ السَّاعَاتِ",
    rulesFr: "Calculer les constantes planétaires avant d'établir l'Abjad temporel.",
    rulesEn: "Calculate planetary constants before applying temporal Abjad multipliers.",
    rulesHa: "Lissafa tauraron ranar kafin saita darajar haruffa."
  },
  {
    id: 'sys-12',
    number: 12,
    titleFr: "12. La Physiologie du Souffle (Ilm al-Nafas)",
    titleEn: "12. Physiology of Breath (Ilm al-Nafas)",
    titleHa: "12. Ilimin Numfashi da Magana (Ilm al-Nafas)",
    titleAr: "علم النفس والنفث في المحابر والرقوق",
    category: 'rituals',
    descriptionFr: "Association de la calligraphie des talismans avec des techniques de rétention et d'expiration du souffle. Le souffle transmet l'énergie spirituelle du cœur vers l'encre.",
    descriptionEn: "Linking talisman calligraphy with breath retention and controlled exhalation. Breath transfers heart energy directly into ink and substrate.",
    descriptionHa: "Haɗa rubutun khatim da sarrafa numfashi. Numfashi shine ke ɗaukar ƙarfin zuciya zuwa alkalamin za'afaran.",
    detailsFr: `### La Règle du Nafas
Pendant la gravure d'une case de Wafq ou la récitation d'un Nom Divin :
1. Inspirer profondément en visualisant la lumière du Nom Divin entrant par le sommet du crâne.
2. Retenir son souffle (*Habs al-Nafas*) pendant l'écriture du nombre.
3. Expirer doucement sur le parchemin (*Al-Naft*) pour sceller l'esprit du mot dans la matière.`,
    detailsEn: `### The Nafas Rule
When inscribing a cell or chanting a Divine Name:
1. Inhale deeply, visualizing Divine light entering through the crown chakra.
2. Hold your breath (*Habs al-Nafas*) while writing the symbol or digit.
3. Exhale softly over the parchment (*Al-Naft*) to seal spiritual force into physical form.`,
    detailsHa: `### Tsarin Nafas
1. Shaka numfashi cike da haske.
2. Riƙe numfashi lokacin rubuta lamba.
3. Hura numfashi a hankali akan takarda don rufe sirri.`,
    khatimType: 'genericKhatim',
    khatimFormulaAr: "نَفْثُ الرُّوحِ فِي المَادَّةِ بِإِذْنِ بَارِئِ النَّسَمِ",
    rulesFr: "Garder le corps détendu et le cœur concentré sur la présence divine.",
    rulesEn: "Maintain body relaxation and heart focus on Divine Presence.",
    rulesHa: "Kiyaye nutsuwar jiki da mai da hankali ga Allah."
  },
  {
    id: 'sys-13',
    number: 13,
    titleFr: "13. Le Cadran des 24 Heures du Jour et de la Nuit",
    titleEn: "13. Dial of the 24 Hours of Day and Night",
    titleHa: "13. Sa'o'i 24 na Rana da Dare (Al-Sa'at al-Falakiyah)",
    titleAr: "ساعات الليل والنهار والملوك الموكلين بها",
    category: 'astrology',
    descriptionFr: "Division du jour et de la nuit en 12 heures chacun, où chaque heure possède un nom propre, un ange régent et un génie gouverneur pour adapter les invocations.",
    descriptionEn: "Division of day and night into 12 hours each, with every hour possessing a unique name, ruling angel, and governing spirit.",
    descriptionHa: "Raba rana da dare zuwa sa'o'i 12 kowanne, tare da sunan Mala'ika da ruhi mai mulki a sa'ar.",
    detailsFr: `### Les 12 Heures du Jour (exemples) :
1. *Al-Shuruq* (L'Aurore) - Gouvernée par l'Ange Yāfī'īl (Amour & Clarté).
2. *Al-Buhur* (Le Milieu de Matinée) - Gouvernée par Shahyā'īl (Richesse & Commerce).
...
Chaque heure exige un encens spécifique (Safran, Mastic, Oudh, Benjoin).`,
    detailsEn: `### The 12 Day Hours (Examples):
1. *Al-Shuruq* (Dawn) - Governed by Angel Yāfī'īl (Love & Clarity).
2. *Al-Buhur* (Mid-Morning) - Governed by Shahyā'īl (Wealth & Commerce).
Each hour requires dedicated incense (Saffron, Mastic, Oud, Benzoin).`,
    detailsHa: `### Sa'o'i 12 na Rana:
1. *Al-Shuruq* (Gatari): Mala'ika Yāfī'īl.
2. *Al-Buhur* (Hantsi): Mala'ika Shahyā'īl.`,
    khatimType: 'astrolabe',
    khatimFormulaAr: "تَقْسِيمُ السَّاعَاتِ الاِثْنَتَيْ عَشْرَةَ لِلنَّهَارِ وَاللَّيْلِ",
    rulesFr: "Calculer la durée de l'heure plannétaire selon la latitude exacte.",
    rulesEn: "Calculate planetary hour length tailored to precise geographic latitude.",
    rulesHa: "Lissafa tsawon sa'a dangane da garin da kake."
  },
  {
    id: 'sys-14',
    number: 14,
    titleFr: "14. Le Sceau des 4 Fleuves du Paradis (Khatim Anhar al-Jannah)",
    titleEn: "14. Seal of the 4 Rivers of Paradise (Khatim Anhar al-Jannah)",
    titleHa: "14. Hatimin Ayyukan Rafukan Aljanna Guda 4",
    titleAr: "خاتم أنهَارِ الجَنَّةِ الأَرْبَعَةِ (مَاء، حَلِيب، خَمْر، عَسَل)",
    category: 'awfaq',
    descriptionFr: "Diagramme géométrique basé sur la représentation des 4 fleuves du Paradis (Eau, Lait, Vin, Miel). Tracé à l'encre de safran pour la purification mentale et la clarté.",
    descriptionEn: "Geometric seal based on the 4 rivers of Paradise (Water, Milk, Wine, Honey). Inscribed with saffron ink for mental purification and intellectual power.",
    descriptionHa: "Hatimi na rafuka 4 na Aljanna (Ruwa, Madara, Giya na Aljanna, Zuma) don tsarkake hankali da basira.",
    detailsFr: `### Symbolisme des 4 Fleuves
- **Eau Purifiante (Mā') :** Dissout les doutes et la négativité.
- **Lait de la Connaissance (Laban) :** Nourrit la mémoire et l'intuition.
- **Vin Spirituel (Khamr) :** Évocation de l'extase divine et de la joie intérieure.
- **Miel de la Sagesse ('Asal) :** Guérison et douceur des relations.
Tracé au centre d'une assiette blanche laveuse d'eau de rose.`,
    detailsEn: `### Symbolism of the 4 Rivers
- **Purifying Water (Mā'):** Clears mental doubts and blockages.
- **Milk of Knowledge (Laban):** Feeds spiritual intuition and memory.
- **Spiritual Wine (Khamr):** Sparks divine ecstasy and inner peace.
- **Honey of Wisdom ('Asal):** Heals subtle bodies and brings harmony.
Drawn at the center of a white porcelain plate washed with rose water.`,
    detailsHa: `### Ma'anar Rafuka 4
- Ruwa: Tsarkake zuciya.
- Madara: Ilimi da kwakwalwa.
- Giya: Farin cikin ruhi.
- Zuma: Warkarwa.`,
    khatimType: 'khatimAnhar',
    khatimFormulaAr: "فِيهَا أَنْهَارٌ مِّن مَّاءٍ غَيْرِ آسِنٍ وَأَنْهَارٌ مِّن لَّبَنٍ",
    rulesFr: "Boire l'eau de rinçage du talisman pendant 7 matins à jeun.",
    rulesEn: "Drink the rose water washings from the plate for 7 consecutive mornings.",
    rulesHa: "Sha ruwan hatimin na kwanaki 7 a jere kafin cin komai da safe."
  },
  {
    id: 'sys-15',
    number: 15,
    titleFr: "15. L'Éveil Thermique des Métaux (Tash'il al-Ma'adin)",
    titleEn: "15. Thermal Metal Activation (Tash'il al-Ma'adin)",
    titleHa: "15. Dumi da Tsarkake Karafa (Tash'il al-Ma'adin)",
    titleAr: "تسهيل المعادن وتسخين السطوح قبل النقش",
    category: 'rituals',
    descriptionFr: "Protocole où la plaque métallique (Or, Argent, Cuivre, Fer) est chauffée à température exacte pendant sa purification avant la gravure des carrés numériques.",
    descriptionEn: "A sacred metallurgy protocol heating metal plates (Gold, Silver, Copper, Iron) during purification before engraving numeric magic squares.",
    descriptionHa: "Dumi da tsarkake kwano na Zinare, Azurfa, ko Jar Karfe kafin meza masa lambobin wafq.",
    detailsFr: `### Correspondances Métalliques
- **Or (Shams) :** Soleil - Pouvoir et rayonnement.
- **Argent (Qamar) :** Lune - Protection et psychisme.
- **Cuivre (Zuhrah) :** Vénus - Amour et art.
- **Fer (Mirrikh) :** Mars - Force et bouclier.
Chauffer le métal au feu de bois odorant (Santal ou Olivier) en psalmodiant le Nom Divin correspondant.`,
    detailsEn: `### Metal Correspondences
- **Gold (Shams):** Sun - Authority and radiance.
- **Silver (Qamar):** Moon - Intuition and psychic defense.
- **Copper (Zuhrah):** Venus - Harmony and affection.
- **Iron (Mirrikh):** Mars - Shielding and strength.
Heat over fragrant hardwood fire while chanting the corresponding Divine Name.`,
    detailsHa: `### Dangantakar Karafa
- Zinari: Ranar Rana.
- Azurfa: Ranar Wata.
- Jar Karfe: Vénus.
- Karfe: Mars.`,
    khatimType: 'genericKhatim',
    khatimFormulaAr: "وَأَنزَلْنَا الحَدِيدَ فِيهِ بَأْسٌ شَدِيدٌ وَمَنَافِعُ لِلنَّاسِ",
    rulesFr: "Engraver le métal pendant qu'il est encore tiède.",
    rulesEn: "Engrave numerical glyphs while the metal remains warm.",
    rulesHa: "Yi rubutu ko meza lamba lokacin da karfen yake da dumi."
  },
  {
    id: 'sys-16',
    number: 16,
    titleFr: "16. Le Sceau de l'Éclipse (Khatim al-Kusuf)",
    titleEn: "16. Seal of the Eclipse (Khatim al-Kusuf)",
    titleHa: "16. Hatimin Mutuwar Rana ko Wata (Khatim al-Kusuf)",
    titleAr: "خاتم الكسوف والخسوف لفك العقد المستعصية",
    category: 'astrology',
    descriptionFr: "Talisman très rare fabriqué exclusivement pendant les quelques minutes d'une éclipse solaire ou lunaire pour débloquer des situations désespérées.",
    descriptionEn: "A rare talisman forged exclusively during the brief minutes of a solar or lunar eclipse to unblock seemingly impossible situations.",
    descriptionHa: "Hatimi na musamman da ake rubutawa kawai a lokacin mutuwar rana ko wata don buɗe ƙulle-ƙullen da suka gagara.",
    detailsFr: `### Le Pouvoir de l'Éclipse
Lorsque la Lune masque le Soleil (Kusuf) ou entre dans l'ombre terrestre (Khusuf), les forces cosmiques opposées s'annulent temporairement. C'est le moment critique de la "Remise à Zéro" (*Al-Faskh*).
Al-Buni enseigne qu'un Sceau de l'Éclipse brise les blocages karmiques les plus sombres.`,
    detailsEn: `### The Power of Eclipses
When the Moon veils the Sun (Kusuf) or enters Earth's shadow (Khusuf), opposing cosmic forces momentarily reset. This creates the 'Nullification Gate' (*Al-Faskh*), breaking severe blockage cords.`,
    detailsHa: `### Garabasar Mutuwar Rana
Lokacin da wata ya rufe rana, karfin halitta yana tsaya na wani dan lokaci. Shiyasa hatimin yake karya duk wani kulle.`,
    khatimType: 'khatimKusuf',
    khatimFormulaAr: "وَخَسَفَ القَمَرُ وَجُمِعَ الشَّمْسُ وَالقَمَرُ",
    rulesFr: "Gravure ultra-rapide sur plomb ou argent pendant l'éclipse exacte.",
    rulesEn: "Engrave rapidly on lead or silver during peak eclipse obscurity.",
    rulesHa: "Rubuta da sauri akan kwanon dalma ko azurfa lokacin da ake cikin mutuwar ranar."
  },
  {
    id: 'sys-17',
    number: 17,
    titleFr: "17. Le Calcul Diagonal du Wafq (Qutr al-Wafq)",
    titleEn: "17. Diagonal Wafq Calculation (Qutr al-Wafq)",
    titleHa: "17. Lissafin Bangaren Diagonal na Wafq (Qutr al-Wafq)",
    titleAr: "قطر الوفق واستخراج اسم الحاكم المباشر",
    category: 'awfaq',
    descriptionFr: "Méthode d'extraction où l'opérateur calcule uniquement la valeur des nombres sur les diagonales du carré magique pour générer le nom d'un esprit souverain.",
    descriptionEn: "Extraction technique calculating values exclusively along the magic square's diagonals to generate a sovereign ruling entity.",
    descriptionHa: "Lissafa lambobin da ke kan layin siket (diagonal) na wafq kawai don ciro sunan mala'ika mai sarauta.",
    detailsFr: `### Formule du Qutr
Dans tout carré magique parfait, la somme des diagonales est égale à la somme des lignes horizontales. En isolant la valeur $D$ de la diagonale principale et en y appliquant la méthode de l'Istikhraj (-51), on déduit l'Ange du Pôle (*Angelus Diagonalis*).`,
    detailsEn: `### The Qutr Formula
In a perfect magic square, diagonal sums mirror horizontal rows. Isolating the master diagonal sum $D$ and applying Istikhraj (-51) derives the presiding Diagonal Sovereign.`,
    detailsHa: `### Lissafin Qutr
Lambar diagonal ita ake amfani da ita wajen cire sunan Mala'ika mai mulki.`,
    khatimType: 'awfaq3x3',
    khatimFormulaAr: "حِسَابُ الأَقْطَارِ وَاسْتِخْرَاجُ السِّرِّ المَكْتُومِ",
    rulesFr: "Tracer les diagonales du carré avec une encre rouge vif.",
    rulesEn: "Highlight the square's diagonals with bright crimson ink.",
    rulesHa: "Zana layukan diagonal da tawada mai jini ko ja."
  },
  {
    id: 'sys-18',
    number: 18,
    titleFr: "18. Le Miroir d'Eau Divinatoire (Al-Mir'at al-Ma'iyyah)",
    titleEn: "18. Scrying Water Mirror (Al-Mir'at al-Ma'iyyah)",
    titleHa: "18. Mudubin Ruwa na Gano Asiri (Al-Mir'at al-Ma'iyyah)",
    titleAr: "المرآة المائية للكشف والروحانيات",
    category: 'divination',
    descriptionFr: "Écrire des formules au safran au fond d'une coupe en argile blanche, la remplir d'eau de source et fixer la surface pour obtenir des visions de résolution.",
    descriptionEn: "Writing saffron formulas inside a white clay bowl, filling it with spring water, and scrying the surface to reveal intuitive insights.",
    descriptionHa: "Rubuta hatimi da za'afaran a kasan kwayan kasar farar katsa, sannan a zuba ruwan ma'ani don gani da fahimtar asiri.",
    detailsFr: `### Protocole de Scrying
1. Écrire le Sceau de Clarté au safran à l'intérieur de la coupe.
2. Verser l'eau de source pure sous la lumière de la pleine lune.
3. Fixer le centre du reflet de la lune en récitant *Ya Nur Ya Batin* (100 fois). Les réponses émergent sous forme de formes et de symboles lumineux.`,
    detailsEn: `### Scrying Protocol
1. Inscribe the Seal of Clarity inside the bowl using saffron ink.
2. Fill with spring water under moonlight.
3. Gaze into the lunar reflection while chanting *Ya Nur Ya Batin* (100x). Symbolic visions manifest across the water's plane.`,
    detailsHa: `### Matakan Gani
1. Rubuta hatimin za'afaran a kwanon katakoni.
2. Zuba ruwa sannan ka kalli ruwan kana karatun *Ya Nur Ya Batin* so 100.`,
    khatimType: 'genericKhatim',
    khatimFormulaAr: "فَكَشَفْنَا عَنكَ غِطَاءَكَ فَبَصَرُكَ اليَوْمَ حَدِيدٌ",
    rulesFr: "Effectuer la séance dans une pièce totalement sombre éclairée par une seule bougie.",
    rulesEn: "Conduct in a dark room illuminated solely by a single beeswax candle.",
    rulesHa: "A gudanar a daki mai duhu tare da kyandir guda daya."
  },
  {
    id: 'sys-19',
    number: 19,
    titleFr: "19. L'Abjad Mineur (Al-Abjad al-Saghir)",
    titleEn: "19. Minor Abjad Reduction (Al-Abjad al-Saghir)",
    titleHa: "19. Karamin Lissafin Abjad (Al-Abjad al-Saghir)",
    titleAr: "الأبجد الصغير والتقليل العددي",
    category: 'secrets',
    descriptionFr: "Réduction numérologique basée sur le modulo 12 ou 9 pour simplifier les calculs de prénoms complexes et concevoir des talismans d'urgence.",
    descriptionEn: "Numerological reduction based on modulo 12 or 9 to simplify complex long names for rapid emergency talisman creation.",
    descriptionHa: "Rage lambobin Abjad ta hanyar modulo 12 ko 9 don sauƙaƙe lissafin dogayen sunaye wajen rubuta hatimi na gaggawa.",
    detailsFr: `### Table de Réduction Modulo 12
Chaque lettre est réduite par le reste de sa valeur divisée par 12 (ex: Ghayn = 1000 -> 1000 mod 12 = 4).
Cela permet d'insérer de grands versets dans des carrés 3x3 sans dépasser les limites de capacité matricielle.`,
    detailsEn: `### Modulo 12 Reduction Table
Every letter reduces to its remainder divided by 12 (e.g., Ghayn = 1000 -> 1000 mod 12 = 4).
This allows massive verses to fit inside compact 3x3 squares smoothly.`,
    detailsHa: `### Rage Lambobi
Rage lambobi irin su 1000 zuwa karamar lamba ta hanyar kasawa da 12 ko 9.`,
    khatimType: 'cryptography',
    khatimFormulaAr: "حِسَابُ الأَبْجَدِ الصَّغِيرِ لِلتَّسْهِيلِ وَالتَّيْسِيرِ",
    rulesFr: "Employer uniquement lorsque le temps d'écriture est extrêmement restreint.",
    rulesEn: "Use when time constraints demand accelerated talisman design.",
    rulesHa: "Yi amfani da shi kawai lokacin da buƙatar gaggawa ta taso."
  },
  {
    id: 'sys-20',
    number: 20,
    titleFr: "20. La Clé d'Alliance des Sceaux (Al-Ism al-Mushtarak)",
    titleEn: "20. Dual Seal Alliance Key (Al-Ism al-Mushtarak)",
    titleHa: "20. Mabudin Hada Hatimi Biyu (Al-Ism al-Mushtarak)",
    titleAr: "الاسم المشترك وتوأمة الخواتم الشريفة",
    category: 'awfaq',
    descriptionFr: "Deux talismans distincts sont gravés avec un 'nom d'alliance' partagé. Ils sont inactifs séparément et ne s'activent que lorsqu'ils sont réunis.",
    descriptionEn: "Two separate talismans engraved with a shared 'alliance key'. Inactive individually, they awaken only when brought into proximity.",
    descriptionHa: "Hatimi biyu mabanbanta da ke dauke da mabudi guda. Ba za su yi aiki ba sai idan aka hada su waje guda.",
    detailsFr: `### Mécanisme
Deux personnes (ou deux associés) portent chacune une moitié du Sceau d'Alliance. Le nom partagé est dérivé de l'addition des deux identités. L'énergie du talisman ne circule que lorsque les deux porteurs se rencontrent.`,
    detailsEn: `### Mechanism
Two partners hold matching halves of the Alliance Seal. The shared key derives from combining both identities. Spiritual energy flows exclusively when both holders convene.`,
    detailsHa: `### Tsari
Mutane biyu suna rike da rabi-rabi na hatimi. Zai yi aiki ne kawai idan sun sadu.`,
    khatimType: 'genericKhatim',
    khatimFormulaAr: "وَأَلَّفَ بَيْنَ قُلُوبِهِمْ لَوْ أَنفَقْتَ مَا فِي الأَرْضِ جَمِيعاً",
    rulesFr: "Gravure simultanée des deux plaques sur le même autel.",
    rulesEn: "Simultaneously engrave both plates upon the same altar space.",
    rulesHa: "A rubuta bangarorin biyu a lokaci guda."
  },
  {
    id: 'sys-21',
    number: 21,
    titleFr: "21. La Science des Nombres Alliés (Al-A'dad al-Mutahabbah)",
    titleEn: "21. Science of Amicable Numbers (Al-A'dad al-Mutahabbah)",
    titleHa: "21. Ilimin Lambobi Masu Soyayya (Al-A'dad al-Mutahabbah)",
    titleAr: "الأعداد المتحابة (٢٢٠ - ٢٨٤) للتآلف والمحبة",
    category: 'awfaq',
    descriptionFr: "Protocole basé sur des paires de nombres amicaux (ex: 220 et 284). Chaque nombre est gravé sur un support distinct (or et argent) pour harmoniser deux personnes.",
    descriptionEn: "Protocol utilizing amicable number pairs (e.g., 220 and 284). Each number is engraved on separate materials (gold and silver) to harmonize relationships.",
    descriptionHa: "Amfani da lambobi masu soyayya (kamarr 220 da 284). A rubuta daya a zinare daya a azurfa don haɗa kan mutane.",
    detailsFr: `### Propriété Mathématique
220 et 284 sont des nombres amicaux : la somme des diviseurs propres de 220 est égale à 284, et vice versa.
Al-Buni utilise cette résonance mathématique sacrée pour sceller l'amour sincère et la loyauté inébranlable entre deux âmes.`,
    detailsEn: `### Mathematical Resonance
220 and 284 are amicable numbers: the sum of proper divisors of 220 equals 284, and vice versa.
Al-Buni leverages this sacred numeric symmetry to weave unbreakable harmony and loyalty.`,
    detailsHa: `### Sirrin Lambobin
Sum na divisors na 220 yana basu 284. Wannan yana sanya aminci na har abada.`,
    khatimType: 'awfaq3x3',
    khatimFormulaAr: "الأَعْدَادُ المُتَحَابَّةُ ٢٢٠ وَ ٢٨٤ لِلتَّآلُفِ الدَّائِمِ",
    rulesFr: "Offrir le talisman de 220 à l'un et garder celui de 284.",
    rulesEn: "Give the 220 talisman to one party and retain the 284 counterpart.",
    rulesHa: "Bawa guda daya 220, kai kuma ka rike 284."
  },
  {
    id: 'sys-22',
    number: 22,
    titleFr: "22. La Détermination du Point Critique (Nuqtat al-Bayan)",
    titleEn: "22. Critical Point Localization (Nuqtat al-Bayan)",
    titleHa: "22. Gano Dakin Tsakiya na Wafq (Nuqtat al-Bayan)",
    titleAr: "نقطة البيان والمركز الإشعاعي للوفق",
    category: 'awfaq',
    descriptionFr: "Identifier la case centrale d'un carré d'ordre impair et la laisser vide ou y insérer un symbole représentant l'essence invisible (le cœur du talisman).",
    descriptionEn: "Locating the exact central cell of an odd-order magic square, leaving it open or placing an essence symbol to focus energy.",
    descriptionHa: "Barin dakin tsakiya na wafq a wofi ko sanya alamar sirri a ciki don tattara karfin ruhi.",
    detailsFr: `### Le Cœur du Talisman
Dans un carré 3x3 ou 5x5, la case centrale (*Nuqtat al-Bayan*) est la porte par laquelle la grâce divine s'écoule. En la laissant ouverte ou en y inscrivant le point suprême (*Al-Nuqta*), le talisman agit comme une lentille optique concentrant la lumière céleste.`,
    detailsEn: `### The Heart of the Talisman
In odd squares (3x3, 5x5), the absolute center (*Nuqtat al-Bayan*) acts as the portal for Divine Overflow. Leaving it open or placing *Al-Nuqta* (the Supreme Point) focuses spiritual energy like an optical lens.`,
    detailsHa: `### Zuciyar Wafq
Dakin tsakiya shine kofar saukar albarka na wafq.`,
    khatimType: 'awfaq3x3',
    khatimFormulaAr: "نُقْطَةُ البَيَانِ فِي مَرْكَزِ العَرْشِ الصَّغِيرِ",
    rulesFr: "Inscrire le point central en dernier lieu.",
    rulesEn: "Dot or seal the central point as the final closing action.",
    rulesHa: "Yi rubutun dakin tsakiya a matsayin karshe."
  },
  {
    id: 'sys-23',
    number: 23,
    titleFr: "23. La Substitution de l'Élément Dominant (Tahrif al-Tab')",
    titleEn: "23. Dominant Element Substitution (Tahrif al-Tab')",
    titleHa: "23. Sauya Muhallin Haruffa (Tahrif al-Tab')",
    titleAr: "تحريف الطبع وتعديل القوى العنصرية",
    category: 'taksir',
    descriptionFr: "Modifier artificiellement la nature élémentaire d'une formule en remplaçant ses lettres dominantes par des lettres d'un élément compatible de valeur équivalente.",
    descriptionEn: "Artificially modifying a formula's elemental nature by substituting dominant letters with compatible same-value elemental letters.",
    descriptionHa: "Sauya kancin haruffa zuwa wani muhallin mai sauki ta amfani da haruffa masu dacewa.",
    detailsFr: `### Technique
Si un verset contient trop de lettres de Feu et risque de provoquer de l'agitation, l'opérateur substitue les lettres de Feu par des lettres d'Air de valeur équivalente pour adoucir l'impact tout en conservant la somme Abjad exacte.`,
    detailsEn: `### Technique
If a verse contains excessive Fire letters causing volatility, substitute Fire letters with Air letters of identical numerical value to smooth execution while preserving exact Abjad totals.`,
    detailsHa: `### Haya
Sauya haruffan Wuta zuwa na Iska don kwantar da tarzoma.`,
    khatimType: 'taksir',
    khatimFormulaAr: "تَبْدِيلُ الطَّبَائِعِ لِتَوَافُقِ الأَرْوَاحِ وَالأَجْسَادِ",
    rulesFr: "Conserver impérativement la somme Abjad totale.",
    rulesEn: "Strictly preserve the total master Abjad sum.",
    rulesHa: "Kiyaye jimillar Abjad kar ta canza."
  },
  {
    id: 'sys-24',
    number: 24,
    titleFr: "24. Le Sceau de la Grande Conjonction (Kiran al-Sa'dayn)",
    titleEn: "24. Great Conjunction Seal (Kiran al-Sa'dayn)",
    titleHa: "24. Hatimin Saduwa ta Taurari Masu Albarka (Kiran al-Sa'dayn)",
    titleAr: "خاتم قران السعدين (المشتري والزهرة / المشتري وزحل)",
    category: 'astrology',
    descriptionFr: "Talisman géométrique complexe écrit lors de la conjonction exacte de Jupiter et de Saturne (tous les 20 ans) ou Jupiter et Vénus pour sécuriser des projets de long terme.",
    descriptionEn: "A grand geometric seal drawn during the exact conjunction of Jupiter and Saturn (every 20 years) or Jupiter and Venus for generational endurance.",
    descriptionHa: "Hatimi mai girma da ake rubutawa yayin saduwar tauraron Jupiter da Saturn ko Venus don tabbatar da nasara ta dogon lokaci.",
    detailsFr: `### L'Alignement des Bénéfiques
Le *Kiran al-Sa'dayn* (Conjonction des Deux Fortune) scelle les dynasties, les grandes fondations et les projets de toute une vie. Tracé sur plaque d'argent pur scellée dans de la cire d'abeille.`,
    detailsEn: `### Alignment of Benefics
The *Kiran al-Sa'dayn* (Conjunction of the Two Fortunes) anchors empires, institutions, and lifelong pursuits. Engraved on pure silver plates sealed in organic beeswax.`,
    detailsHa: `### Hada Taurari
Wannan hatimin yana tabbatar da gina masarauta ko kasuwanci na tsawon shekaru.`,
    khatimType: 'khatimKiran',
    khatimFormulaAr: "قِرَانُ السَّعْدَيْنِ فِي المَشْرِقَيْنِ وَالمَغْرِبَيْنِ",
    rulesFr: "Conserver le talisman dans un coffret en bois de cèdre.",
    rulesEn: "Store the physical seal inside a cedar wood chest.",
    rulesHa: "A adana hatimin a cikin akwatin karfe ko katako."
  },
  {
    id: 'sys-25',
    number: 25,
    titleFr: "25. La Clé des Portes de l'Invisible (Miftah al-Ghayb)",
    titleEn: "25. Key to Unseen Portals (Miftah al-Ghayb)",
    titleHa: "25. Mabudin Kofofin Gaibi (Miftah al-Ghayb)",
    titleAr: "مفتاح الغيب والحروف النورانية الأربعة عشر",
    category: 'secrets',
    descriptionFr: "Grille de décodage basée sur l'agencement des 14 lettres lumineuses (Muqatta'at) pour déduire des réponses conceptuelles sur l'avenir.",
    descriptionEn: "A decoding grid built on the 14 Mysterious/Luminous Letters (Muqatta'at) to derive profound conceptual answers about unseen futures.",
    descriptionHa: "Teburi na haruffa masu haske 14 na Alkur'ani (Muqatta'at) don gano amsoshi na abubuwan da zasu faru nan gaba.",
    detailsFr: `### Les 14 Lettres Lumineuses
ص ، ر ، ك ، هـ ، ي ، ع ، ط ، س ، م ، ح ، ق ، ن ، ا ، ل
Combinées dans la grille *Miftah al-Ghayb*, elles dévoilent les secrets enfouis et ouvrent les portes de l'illumination spirituelle (*Kashf*).`,
    detailsEn: `### The 14 Luminous Letters
ص ، ر ، ك ، هـ ، ي ، ع ، ط ، س ، م ، ح ، ق ، ن ، ا ، ل
Arranged within the *Miftah al-Ghayb* matrix, they unlock hidden spiritual insight (*Kashf*).`,
    detailsHa: `### Haruffa 14 Masu Haske
A - L - M - R - K - H - Y - A - S - T - M - H - Q - N.
Suna bude kofofin ilimin gaibi.`,
    khatimType: 'cryptography',
    khatimFormulaAr: "الم - المر - كهيعص - طه - طسم - يس - ص - حم - ق - ن",
    rulesFr: "Réciter les 14 lettres 14 fois avant la consultation.",
    rulesEn: "Chant the 14 luminous letters 14 times prior to consultation.",
    rulesHa: "Karanta haruffan 14 har sau 14 kafin dubawa."
  },
  {
    id: 'sys-26',
    number: 26,
    titleFr: "26. La Récitation Circulaire (Al-Dawa'ir al-Lafziyyah)",
    titleEn: "26. Circular Intonation Loops (Al-Dawa'ir al-Lafziyyah)",
    titleHa: "26. Karatun Zobe na Kalaman Allah (Al-Dawa'ir al-Lafziyyah)",
    titleAr: "الدوائر اللفظية والتكرار الدائري للأسماء",
    category: 'rituals',
    descriptionFr: "Lier des Noms Divins dans un cycle phonétique continu où la dernière lettre d'un nom devient la première du nom suivant.",
    descriptionEn: "Linking Divine Names in a seamless phonetic loop where the final letter of one Name becomes the opening letter of the next.",
    descriptionHa: "Hada Sunayen Allah a wani zobe na magana inda harafin karshe na sunan farko yake zama harafin farko na sunan biyu.",
    detailsFr: `### Exemple de Boucle Phonétique
الله (Allāh - finit par H) -> هَادِي (Hādī - finit par Y) -> يَا سَلاَمُ (Yā Salām - finit par M) -> مَالِكُ (Mālik)...
Cette boucle ininterrompue crée un vortex vibratoire lors du Dhikr, plongeant l'esprit dans un état d'absorption profonde (*Fana'*).`,
    detailsEn: `### Phonetic Loop Example
Allāh (ends in H) -> Hādī (ends in Y) -> Yā Salām (ends in M) -> Mālik...
This seamless audio loop generates a spiritual vortex during Dhikr, dissolving mental chatter into divine contemplation (*Fana'*).`,
    detailsHa: `### Misali
Allah (ƙarshe H) -> Hadi (farkon H, ƙarshe Y) -> Ya Salam (farkon Y)...`,
    khatimType: 'jadhbSpiral',
    khatimFormulaAr: "اللهُ هَادِي يَا سَلاَمُ مَالِكُ المُلْكِ - دَائِرَةٌ لاَ تَنْتَهِي",
    rulesFr: "Pratiquer la boucle en tenant un chapelet de 1000 perles.",
    rulesEn: "Execute loop chants using a 1000-bead Sufi rosary.",
    rulesHa: "A gudanar da karatun da tasbaha mai guraye 1000."
  },
  {
    id: 'sys-27',
    number: 27,
    titleFr: "27. Le Calcul de l'Harmonisation du Sol (Tatheer al-Buq'ah)",
    titleEn: "27. Land Harmonization Formula (Tatheer al-Buq'ah)",
    titleHa: "27. Lissafin Tsarkake Wuri ko Gida (Tatheer al-Buq'ah)",
    titleAr: "تطهير البقعة وتثبيت الخواتم الأرضية",
    category: 'rituals',
    descriptionFr: "Formule mathématique combinant les coordonnées d'un lieu avec la valeur de son nom pour déterminer l'emplacement exact où enterrer un talisman protecteur.",
    descriptionEn: "A mathematical formula combining a site's location with its name value to determine the exact spot to bury a protective talisman.",
    descriptionHa: "Lissafa sunan waje da muhallinsa don gano daidaitaccen wurin da za a birne hatimin kariya.",
    detailsFr: `### Formule de Localisation
1. Calculer la somme Abjad du nom de la ville/maison.
2. Diviser par 4 pour obtenir la direction cardinale dominante.
3. Entrer le talisman aux quatre coins du terrain pour former un bouclier électromagnétique et spirituel infranchissable.`,
    detailsEn: `### Location Formula
1. Calculate the Abjad sum of the location name.
2. Divide by 4 to reveal the ruling cardinal quadrant.
3. Bury four linked talismans at property boundaries to cast an impenetrable protective barrier.`,
    detailsHa: `### Lissafin
Lissafa sunan garin ko gidan, sannan ka birne hatimi a kusurwoyi 4 na gidan.`,
    khatimType: 'genericKhatim',
    khatimFormulaAr: "تَطْهِيرُ الأَرْضِ وَتَحْصِينُ البُقْعَةِ المُمَتَّدَةِ",
    rulesFr: "Utiliser des récipients en terre cuite pour enterrer les talismans.",
    rulesEn: "Encase buried talismans inside sealed terracotta vessels.",
    rulesHa: "Sanya hatiman a cikin tukunyar kasa kafin birne su."
  },
  {
    id: 'sys-28',
    number: 28,
    titleFr: "28. La Méthode d'Inversion Énergétique (Al-Radd wal-Aks)",
    titleEn: "28. Energy Reversal Shield (Al-Radd wal-Aks)",
    titleHa: "28. Mayar da Sharri zuwa ga Mai Yinsa (Al-Radd wal-Aks)",
    titleAr: "الرد والعكس وتدوير الطاقات السلبية",
    category: 'rituals',
    descriptionFr: "Schéma géométrique protecteur renvoyant les intentions néfastes ou attaques vers leur source émettrice, agissant comme un miroir théurgique.",
    descriptionEn: "A protective geometric shield returning harmful intentions or psychic attacks back to their source like a spiritual mirror.",
    descriptionHa: "Zanen kariya da ke maida dukkan maita ko sharrin mutum zuwa kansa kamar mudubi.",
    detailsFr: `### Le Principe du Miroir Théurgique
En écrivant les versets de protection à l'envers (*Ma'kus*) selon des règles précises, le talisman ne bloque pas seulement l'onde négative : il la renvoie amplifiée vers l'expéditeur, neutralisant l'agression à sa source.`,
    detailsEn: `### The Spiritual Mirror Principle
By inscribing protective verses in precise inverted order (*Ma'kus*), the seal doesn't merely absorb hostility: it reflects and amplifies it back to the aggressor.`,
    detailsHa: `### Tsarin Mudubi
Rubuta ayoyin kariya a komai da komai ma'ks don maida sharrin.`,
    khatimType: 'genericKhatim',
    khatimFormulaAr: "وَرَدَّ اللَّهُ الَّذِينَ كَفَرُوا بِغَيْظِهِمْ لَمْ يَنَالُوا خَيْراً",
    rulesFr: "Graver le Sceau sur une plaque de fer réfléchissante.",
    rulesEn: "Engrave upon a polished reflective iron mirror surface.",
    rulesHa: "Rubuta a kan karfe mai sheki kamar mudubi."
  },
  {
    id: 'sys-29',
    number: 29,
    titleFr: "29. L'Extraction de l'Esprit du Verset (Rouh al-Ayah)",
    titleEn: "29. Extracting the Verse Spirit (Rouh al-Ayah)",
    titleHa: "29. Cire Ruhi da Karfin Aya (Rouh al-Ayah)",
    titleAr: "استخراج روح الآية والجملة الكبيرة",
    category: 'secrets',
    descriptionFr: "Calcul arithmétique complexe qui extrait la racine numérique fondamentale d'un verset coranique pour déduire un nom de pouvoir unique.",
    descriptionEn: "A complex arithmetic calculation extracting the core numeric root of a Quranic verse to derive a unique Name of Power.",
    descriptionHa: "Lissafin cire asalin karfin lambobin aya don kirkirar sunan asiri mai karfi.",
    detailsFr: `### Algorithme
Prendre la valeur Abjad totale du verset, soustraire la valeur des lettres muettes, puis diviser par le nombre de mots. Le résultat donne le mot de pouvoir (*Rouh*) régissant ce verset.`,
    detailsEn: `### Algorithm
Take the verse's total Abjad sum, subtract silent letter values, and divide by total word count. The resultant integer yields the ruling Name of Power (*Rouh*).`,
    detailsHa: `### Tsari
Dauki jimillar aya, cire haruffan da ba a karantawa, sannan ka rabata da adadin kalmomin.`,
    khatimType: 'cryptography',
    khatimFormulaAr: "رُوحُ الآيَةِ الشَّرِيفَةِ وَسِرُّهَا المَكْنُونُ",
    rulesFr: "Utiliser ce nom comme mantra de méditation silencieuse.",
    rulesEn: "Employ this generated Name as a silent contemplation mantra.",
    rulesHa: "Karanta wannan sunan a cikin zuciya lokacin yin wa'azi."
  },
  {
    id: 'sys-30',
    number: 30,
    titleFr: "30. L'Alliage des Métaux Amis (Imtizaj al-Ma'adin)",
    titleEn: "30. Amicable Metal Alloys (Imtizaj al-Ma'adin)",
    titleHa: "30. Narke da Hada Karafa Masu Aminci (Imtizaj al-Ma'adin)",
    titleAr: "امتزاج المعادن وسبائك الخواتم المباركة",
    category: 'rituals',
    descriptionFr: "Fusion de deux métaux spécifiques (ex: argent et cuivre) selon des proportions calculées sous une conjonction planétaire pour créer un support hybride.",
    descriptionEn: "Melting and casting two specific metals (e.g., silver and copper) in calculated ratios under precise planetary alignments for hybrid seals.",
    descriptionHa: "Narke karafa biyu (azurfa da jar karfe) a gwada su waje guda a sa'ar tauraro don yin zobe ko hatimi.",
    detailsFr: `### proportions Sacrées
- **Electrum (Or + Argent) :** Équilibre Soleil-Lune (Souveraineté & Intuition).
- **Bronze Sacré (Cuivre + Étain) :** Équilibre Vénus-Jupiter (Prospérité & Amour).
Couler l'alliage au moment exact de la conjonction.`,
    detailsEn: `### Sacred Ratios
- **Electrum (Gold + Silver):** Sun-Moon Balance (Royalty & Intuition).
- **Sacred Bronze (Copper + Tin):** Venus-Jupiter Balance (Wealth & Charm).
Cast the alloy precisely at exact planetary alignment peaks.`,
    detailsHa: `### Hada Karafa
- Zinare da Azurfa: Ranar Sun-Moon.
- Jar Karfe da Dalma: Ranar Venus-Jupiter.`,
    khatimType: 'genericKhatim',
    khatimFormulaAr: "سَبِيكَةُ العَهْدِ المُبَارَكَةِ بَيْنَ الشَّمْسِ وَالقَمَرِ",
    rulesFr: "Polir la plaque avec de la poudre de safran avant gravure.",
    rulesEn: "Polish the cast plate with saffron dust prior to engraving.",
    rulesHa: "Goge kwanon da hular za'afaran kafin meza masa lamba."
  },
  {
    id: 'sys-31',
    number: 31,
    titleFr: "31. Le Carré Magique d'Ordre 100 (Al-Wafq al-Mi'awi)",
    titleEn: "31. Magic Square of Order 100 (Al-Wafq al-Mi'awi)",
    titleHa: "31. Babban Wafq Mai Gidaje 10,000 (Al-Wafq al-Mi'awi 100x100)",
    titleAr: "الوفق المئوي (١٠٠ × ١٠٠) لحماية المدن والجيوش",
    category: 'awfaq',
    descriptionFr: "Grille de 100x100 cases contenant 10 000 nombres distincts sans répétition, décrite comme un outil destiné à la protection collective et des cités.",
    descriptionEn: "A monumental 100x100 grid containing 10,000 unique integers without repetition, designed for shielding entire cities or communities.",
    descriptionHa: "Wafq mai girma na gidaje 100x100 (gidaje 10,000) don kariyar al'umma ko birni baki daya.",
    detailsFr: `### Le Chef-d'Œuvre d'Al-Buni
Le Wafq al-Mi'awi exige plusieurs semaines de calculs rigoureux. La somme de chaque ligne, colonne et diagonale est rigoureusement constante. Gravé sur une plaque de bronze géante placée aux portes d'une cité pour stopper les épidémies et les guerres.`,
    detailsEn: `### Al-Buni's Masterpiece
The Wafq al-Mi'awi demands weeks of rigorous verification. Every row, column, and diagonal sums to the identical master total. Engraved on massive bronze plates mounted at city gates against plagues and warfare.`,
    detailsHa: `### Aikin Al-Buni
Irin wannan wafq ana adana shi ne a kofar gari don kare birni daga cututtuka da yaki.`,
    khatimType: 'wafq100',
    khatimFormulaAr: "الوَفْقُ المِئَوِيُّ العَظِيمُ - عَشَرَةُ آلاَفِ خَلِيَّةٍ مُبَارَكَةٍ",
    rulesFr: "Vérifier la somme de la 100ème ligne avant activation.",
    rulesEn: "Audit row sum #100 rigorously before consecrated installation.",
    rulesHa: "Duba lissafin layi na 100 kafin bayar da shi."
  },
  {
    id: 'sys-32',
    number: 32,
    titleFr: "32. Sceau de la Mansion Lunaire Royale (Al-Iklil al-A'zam)",
    titleEn: "32. Seal of the Royal Lunar Mansion (Al-Iklil al-A'zam)",
    titleHa: "32. Hatimin Gidajen Wata na Sarauta (Al-Iklil al-A'zam)",
    titleAr: "خاتم المنزلة السابعة عشرة (الإكليل) للجاه والتمكين",
    category: 'astrology',
    descriptionFr: "Talisman écrit uniquement lorsque la Lune transite par la 17ème demeure (Al-Iklil) pour consolider la stabilité professionnelle et le prestige.",
    descriptionEn: "A talisman inscribed exclusively when the Moon transits the 17th Mansion (Al-Iklil) to secure professional stability and authority.",
    descriptionHa: "Hatimin da ake rubutawa lokacin da wata yake gida na 17 (Al-Iklil) don samun daukaka da kariya daga makiya.",
    detailsFr: `### La Demeure Al-Iklil (La Couronne)
Cette demeure lunaire confère la force d'attraction, le respect des pairs et la protection contre le complot. Tracé sur parchemin de gazelle à l'encre de safran et de musc.`,
    detailsEn: `### The Mansion Al-Iklil (The Crown)
This lunar mansion grants commanding presence, professional reverence, and immunity from political sabotage. Drawn on gazelle parchment using saffron-musk ink.`,
    detailsHa: `### Gida na 17 (Al-Iklil)
Yana bawa mutum kwarjini da samun nasara abun kasuwanci ko mulki.`,
    khatimType: 'astrolabe',
    khatimFormulaAr: "سِرُّ المَنْزِلَةِ السَّابِعَةَ عَشْرَةَ - الإِكْلِيلِ المَلَكِيِّ",
    rulesFr: "Brûler du mastic et de l'ambre pendant la rédaction.",
    rulesEn: "Burn pure mastic and ambergris resin throughout scribe work.",
    rulesHa: "Ƙona turaren mastic da ambar lokacin rubutu."
  },
  {
    id: 'sys-33',
    number: 33,
    titleFr: "33. L'Abjad Moyen (Al-Abjad al-Wasat)",
    titleEn: "33. Intermediate Abjad Method (Al-Abjad al-Wasat)",
    titleHa: "33. Matsakaicin Lissafin Abjad (Al-Abjad al-Wasat)",
    titleAr: "الأبجد الوسطي لتعديل الجمل المتوسطة",
    category: 'secrets',
    descriptionFr: "Système de calcul intermédiaire réduisant les valeurs numériques de prénoms trop longs pour les insérer de manière fluide dans de petits carrés 3x3.",
    descriptionEn: "An intermediate calculation scale reducing long names to fit fluidly inside compact 3x3 magic squares.",
    descriptionHa: "Matsakaicin lissafi na rage tsawon lamba don sanya ta a ciki karamin wafq na 3x3.",
    detailsFr: `### Formule al-Wasat
L'Abjad Moyen divise les valeurs des centaines par 10 et les milliers par 100, maintenant des ratios relatifs parfaits sans surcharger les cases du Wafq.`,
    detailsEn: `### Al-Wasat Formula
The Intermediate Abjad divides hundreds by 10 and thousands by 100, preserving proportional ratios while preventing grid overcrowding.`,
    detailsHa: `### Tsari
Rage darajar 100 zuwa 10, 1000 zuwa 100.`,
    khatimType: 'cryptography',
    khatimFormulaAr: "الأَبْجَدُ الوَسَطِيُّ لِتَوْفِيقِ الأَسْمَاءِ الطَّوِيلَةِ",
    rulesFr: "Utiliser pour les prénoms composés de plus de 4 mots.",
    rulesEn: "Deploy when dealing with compound names exceeding 4 words.",
    rulesHa: "Yi amfani da shi ga sunaye masu tsawo."
  },
  {
    id: 'sys-34',
    number: 34,
    titleFr: "34. Le Sceau de Sang Végétal (Ilm al-Tashikh)",
    titleEn: "34. Plant Resin Seal Science (Ilm al-Tashikh)",
    titleHa: "34. Hatimin Jinin Bishiya da Resins (Ilm al-Tashikh)",
    titleAr: "علم التشخيخ بالحبر النباتي الملون (دم الأخوين)",
    category: 'rituals',
    descriptionFr: "Résines végétales colorées (sang-dragon, mastic) chauffées et liquéfiées, employées comme encre pour tracer des symboles de rigueur et de protection.",
    descriptionEn: "Natural botanical resins (dragon's blood, mastic) liquefied into vibrant ink to trace seals of defense and rigor.",
    descriptionHa: "Gums da jinin bishiyar Dragon's blood da aka narke don amfani azaman tawadar rubuta hatimin kariya.",
    detailsFr: `### Encre Sacrée Végétale
La résine du Dragonnier (*Damm al-Akhawayn*) fournit une encre rouge rubis naturelle d'une puissance vibratoire exceptionnelle. Elle fixe le talisman dans le monde physique avec une tenue inaltérable.`,
    detailsEn: `### Sacred Botanical Ink
Dragon's Blood resin (*Damm al-Akhawayn*) yields a ruby-red ink with remarkable spiritual grounding energy, embedding talismans permanently.`,
    detailsHa: `### Tawada ta Bishiya
Jinin bishiyar Damm al-Akhawayn yana bada tawada mai ja wadda ke sanya karfin rufewa.`,
    khatimType: 'genericKhatim',
    khatimFormulaAr: "حِبْرُ دَمِ الأَخَوَيْنِ المُمَزَّجِ بِالمُصْطَكِي وَمَاءِ الوَرْدِ",
    rulesFr: "Mélanger la résine chaude avec de l'eau de rose distillée.",
    rulesEn: "Blend warm liquefied resin with distilled rose floral water.",
    rulesHa: "Haɗa garin daddawa tare da ruwan wardi."
  },
  {
    id: 'sys-35',
    number: 35,
    titleFr: "35. La Synchronisation Planétaire Individuelle",
    titleEn: "35. Individual Planetary Synchronization",
    titleHa: "35. Daidaita Tauraron Mutum da Lokaci",
    titleAr: "التوافق الشخصي بين الطالع الساعي والولادي",
    category: 'astrology',
    descriptionFr: "Calcul croisé entre le thème astrologique de naissance et les mansions lunaires pour identifier l'heure exacte de la journée où les invocations ont la plus grande clarté.",
    descriptionEn: "Cross-calculating natal birth charts with real-time lunar mansions to pinpoint the exact daily hour of peak personal clarity.",
    descriptionHa: "Gwada tauraron haihuwar mutum da gidajen wata na ranar don samun sa'ar da addu'arsa tafi karfi.",
    detailsFr: `### Le Trine Personnel
Quand la Lune en transit forme un angle exact de 120° (Trine) avec le Soleil natal de l'individu, les portes de l'exaucement personnel s'ouvrent en grand. C'est le moment idéal pour lancer un vœu majeur.`,
    detailsEn: `### The Personal Trine
When the transiting Moon forms a 120° Trine aspect with the individual's natal Sun, divine receptivity reaches its apex—the optimal window for major endeavors.`,
    detailsHa: `### Lokacin Dama
Lokacin da wata ya daidaita da tauraron haihuwarka, addu'a tana samun karɓuwa nan take.`,
    khatimType: 'astrolabe',
    khatimFormulaAr: "التَّوَافُقُ الشَّخْصِيُّ بَيْنَ الفَلَكِ الوِلاَدِيِّ وَالمَنْزِلَةِ",
    rulesFr: "Connaître avec précision l'heure et la date de naissance.",
    rulesEn: "Require exact birth time and geographic coordinates.",
    rulesHa: "Dole ne ka sani lokacin da aka haife ka daidai."
  },
  {
    id: 'sys-36',
    number: 36,
    titleFr: "36. Le Sceau de la Lune Rousse (Khatim al-Badr al-Ahmar)",
    titleEn: "36. Red Blood Moon Seal (Khatim al-Badr al-Ahmar)",
    titleHa: "36. Hatimin Jajayen Wata (Khatim al-Badr al-Ahmar)",
    titleAr: "خاتم البدر الأحمر عند الخسوف الكلي",
    category: 'astrology',
    descriptionFr: "Talisman tracé durant l'obscurcissement total d'une éclipse lunaire (lune de sang) pour défaire des blocages anciens ou rompre des habitudes ancrées.",
    descriptionEn: "Inscribed during total lunar eclipse totality (Blood Moon) to sever deep-seated blockages and break ancient unwanted patterns.",
    descriptionHa: "Hatimin da ake rubutawa lokacin da wata yayi ja wur a cikin mutuwar wata don karya sihiri da tsoffin kulle-kulle.",
    detailsFr: `### La Lune de Sang
L'atmosphère terrestre filtre la lumière solaire ne laissant passer que le spectre rouge. Ce moment théurgique d'exception permet de dissoudre les liens énergétiques toxiques les plus tenaces.`,
    detailsEn: `### The Blood Moon Aspect
Earth's atmosphere refractorily isolates red spectral wavelengths. This rare window allows ritual severance of deep energetic ties and ancient blockages.`,
    detailsHa: `### Watan Jini
Irin wannan watan yana rusa kowane ire-irene sarkakiya na aljanu ko sihiri.`,
    khatimType: 'khatimKusuf',
    khatimFormulaAr: "سِرُّ البَدْرِ الأَحْمَرِ وَقَطْعُ العَلَائِقِ الظَّلْمَائِيَّةِ",
    rulesFr: "Graver sur une médaille d'argent trempée dans l'eau salée.",
    rulesEn: "Inscribe upon a silver medallion quenched in sea salt brine.",
    rulesHa: "Rubuta a kan azurfa sannan a sanya a ruwan gishiri."
  },
  {
    id: 'sys-37',
    number: 37,
    titleFr: "37. La Spirale d'Attraction (Al-Jadhb)",
    titleEn: "37. Attraction Spiral (Al-Jadhb)",
    titleHa: "37. Zauren Spirale na Janyo Nasara (Al-Jadhb)",
    titleAr: "حلزونة الجذب والدوائر المغناطيسية",
    category: 'taksir',
    descriptionFr: "Agencement géométrique de lettres écrit en forme de spirale logarithmique, destiné à attirer l'harmonie et les opportunités vers le foyer de l'opérateur.",
    descriptionEn: "Logarithmic spiral letter arrangement designed to draw prosperity, harmony, and opportunities inward toward the practitioner's home.",
    descriptionHa: "Tsara haruffa a hanyar zobe na spiral don janyo arzikin da nasara zuwa shagon ko gidan mutum.",
    detailsFr: `### Géométrie Sacrée du Jadhb
La spirale se trace du bord extérieur vers le centre exact (sens anti-horaire). Les lettres du nom et des désirs s'enroulent en resserrant les fréquences jusqu'au point focal divin.`,
    detailsEn: `### Sacred Spiral Geometry
Traced counter-clockwise from the outer perimeter toward the epicenter. Letters of intent condense inward, amplifying focus into divine manifestation.`,
    detailsHa: `### Zanen Spiral
Fara rubutu daga waje kana shiga ciki har zuwa tsakiya.`,
    khatimType: 'jadhbSpiral',
    khatimFormulaAr: "جَذْبُ الخَيْرَاتِ وَتَدْوِيرُ الأَرْزَاقِ كَالرَّحَى",
    rulesFr: "Placer la spirale au-dessus de la porte d'entrée.",
    rulesEn: "Mount the spiral seal directly above the main entrance threshold.",
    rulesHa: "A sanya hatimin spirale a samfurin kofar gida."
  },
  {
    id: 'sys-38',
    number: 38,
    titleFr: "38. La Science des Heures de la Nuit (Sa'at al-Layl)",
    titleEn: "38. Science of Night Hours (Sa'at al-Layl)",
    titleHa: "38. Ilimin Sa'o'i na Dare (Sa'at al-Layl)",
    titleAr: "ساعات الليل والملوك السبعة الروحانيين",
    category: 'astrology',
    descriptionFr: "Classification des 12 heures nocturnes attribuant un ange et un verset de protection pour guider les rituels menés durant la nuit.",
    descriptionEn: "Classification of the 12 nocturnal hours, matching each with a governing angel and shielding verse for midnight rituals.",
    descriptionHa: "Raba dare zuwa sa'o'i 12 tare da Mala'ikan kariya na kowace sa'a don gudanar da ibadar dare.",
    detailsFr: `### Les Heures Mystiques Nocturnes
- **3ème Heure (Al-Sahar) :** Moment d'ouverture divine suprême pour le Tahajjud et la méditation théurgique profonde.
- **6ème Heure (Milieu de Nuit) :** Réception des illuminations et des secrets enfouis.`,
    detailsEn: `### Mystical Night Hours
- **3rd Hour (Al-Sahar):** Supreme portal for Tahajjud and deep esoteric meditation.
- **6th Hour (Midnight Core):** Receptivity for spiritual illumination and hidden dreams.`,
    detailsHa: `### Lokutan Dare
- Sa'a ta 3 (Linzami/Sahar): Lokacin Tahajjud da addu'a.
- Sa'a ta 6 (Tsakiyar dare): Samun wahayi da haske.`,
    khatimType: 'astrolabe',
    khatimFormulaAr: "سَاعَاتُ اللَّيْلِ المُمَتَّدَةِ وَالنُّورُ السَّاطِعُ فِي الظَّلاَمِ",
    rulesFr: "S'allumer une bougie d'abeille naturelle pendant le travail nocturne.",
    rulesEn: "Illuminate workspace solely with natural beeswax candles.",
    rulesHa: "Yi amfani da kyandir na kawan zuma a daren."
  },
  {
    id: 'sys-39',
    number: 39,
    titleFr: "39. Le Sceau de l'Alliance des Éléments (Khatim al-Anasir)",
    titleEn: "39. Seal of Elemental Alliance (Khatim al-Anasir)",
    titleHa: "39. Hatimin Hada Muhallai Guda 4 (Khatim al-Anasir)",
    titleAr: "خاتم العناصر الأربعة والملائكة الأربعة",
    category: 'awfaq',
    descriptionFr: "Talisman combinant les noms des 4 archanges (Jibril, Mika'il, Israfil, Azra'il) et les symboles des 4 éléments pour restaurer l'harmonie spatiale.",
    descriptionEn: "A talisman merging the names of the 4 archangels (Jibril, Mika'il, Israfil, Azra'il) with elemental symbols to restore spatial equilibrium.",
    descriptionHa: "Hatimin da ke haɗa sunayen Mala'iku 4 (Jibril, Mika'il, Israfil, Azra'il) da muhallai 4 don gyara gida.",
    detailsFr: `### Quadrangulation Archangélique
- **Jibril (Air - Est) :** Sagesse et Révélation.
- **Mika'il (Eau - Ouest) :** Substance et Prospérité.
- **Israfil (Feu - Sud) :** Éveil et Souffle de Vie.
- **Azra'il (Terre - Nord) :** Stabilité et Protection Finale.`,
    detailsEn: `### Archangelic Quadrangulation
- **Jibril (Air - East):** Wisdom and Revelation.
- **Mika'il (Water - West):** Provision and Abundance.
- **Israfil (Fire - South):** Awakening and Life Force.
- **Azra'il (Earth - North):** Grounding and Unyielding Shielding.`,
    detailsHa: `### Mala'iku 4
- Jibril: Iska (Gabas).
- Mika'il: Ruwa (Yamma).
- Israfil: Wuta (Kudu).
- Azra'il: Kasa (Arewa).`,
    khatimType: 'khatimAnasir',
    khatimFormulaAr: "جِبْرِيل - مِيكَائِيل - إِسْرَافِيل - عِزْرَائِيل - أَرْكَانُ العَرْشِ",
    rulesFr: "Inscrire les 4 noms aux 4 coins extérieurs du cadre.",
    rulesEn: "Inscribe the 4 Archangelic names at the exact 4 outer corners of the frame.",
    rulesHa: "Rubuta sunayen Mala'iku 4 a kusurwoyin hatimin 4."
  },
  {
    id: 'sys-40',
    number: 40,
    titleFr: "40. Le Secret de la Clôture Théurgique (Khatim al-Kitab)",
    titleEn: "40. The Seal of Esoteric Closure (Khatim al-Kitab)",
    titleHa: "40. Sirrin Rufe Hatimi ko Layya (Khatim al-Kitab)",
    titleAr: "خاتم الكتاب والتأمين النهائي للشغل المبارك",
    category: 'secrets',
    descriptionFr: "Protocol final consistant à 'verrouiller' l'influence d'un talisman en traçant une ligne circulaire ininterrompue tout autour, inscrite de versets de préservation.",
    descriptionEn: "The mandatory final protocol sealing a talisman's influence by drawing an unbroken circular perimeter inscribed with preservation verses.",
    descriptionHa: "Tsari na karshe na rufe kowace laya ko hatimi ta hanyar zana layin zobe mai ayoyin kariya a kewaye.",
    detailsFr: `### La Clôture du Sceau
Sans le *Khatim al-Kitab*, l'énergie calligraphiée risque de se dissiper progressivement. La ligne circulaire ininterrompue agit comme une cage de Faraday théurgique, conservant le pouvoir du talisman intact pendant des décennies.`,
    detailsEn: `### The Esoteric Lock
Without the *Khatim al-Kitab*, calligraphic force leaks over time. Drawing an unbroken outer circular boundary acts as a spiritual Faraday cage, preserving the seal's potency for decades.`,
    detailsHa: `### Rufe Sirri
Zana zobe a kewaye yana hana karfin hatimin fita ko lalacewa gaba daya.`,
    khatimType: 'genericKhatim',
    khatimFormulaAr: "وَحَفِظْنَاهَا مِن كُلِّ شَيْطَانٍ رَّجِيمٍ - خِتَامُهُ مِسْكٌ",
    rulesFr: "Ne jamais fermer la boucle tant que le séchage de l'encre n'est pas achevé.",
    rulesEn: "Complete the outer circular line only after interior ink has dried.",
    rulesHa: "Kar ka rufe zoben har sai tawadar ciki ta bushe."
  }
];
