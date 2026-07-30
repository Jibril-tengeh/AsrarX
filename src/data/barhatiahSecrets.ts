export interface BarhatiahNameSecret {
  id: number;
  nameAr: string;
  nameTranslit: string;
  divineAttributeAr: string;
  divineAttributeFr: string;
  divineAttributeEn: string;
  divineAttributeHa: string;
  abjadWeight: number;
  lunarMansion: string;
  element: 'fire' | 'air' | 'water' | 'earth';
  secretFr: string;
  secretEn: string;
  secretHa: string;
  recipeFr: string;
  recipeEn: string;
  recipeHa: string;
  invocationAr: string;
  invocationTranslit: string;
  invocationFr: string;
  invocationEn: string;
  invocationHa: string;
  talsamCode: string;
  wafq3x3?: string[][];
}

export interface BarhatiahRecipe {
  id: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  titleHa: string;
  category: 'protection' | 'prosperity' | 'healing' | 'spiritual';
  descriptionFr: string;
  descriptionEn: string;
  descriptionHa: string;
  materialsFr: string[];
  materialsEn: string[];
  materialsHa: string[];
  timingFr: string;
  timingEn: string;
  timingHa: string;
  stepsFr: string[];
  stepsEn: string[];
  stepsHa: string[];
  arabicFormula: string;
  transliteration: string;
  talsamCode: string;
}

export interface BarhatiahInvocation {
  id: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  titleHa: string;
  type: 'dawah' | 'kasm' | 'insiraf';
  arabicText: string;
  transliteration: string;
  translationFr: string;
  translationEn: string;
  translationHa: string;
  usageInstructionsFr: string;
  usageInstructionsEn: string;
  usageInstructionsHa: string;
}

// ============================================================================
// COMPENDIUM DES 28 NOMS SECRETS DE LA BARHATIAH (28 NAMES COMPENDIUM)
// ============================================================================
export const BARHATIAH_28_NAMES: BarhatiahNameSecret[] = 
[
  {
    "id": 1,
    "nameAr": "بَرْهَتِيهٍ",
    "nameTranslit": "Barhatihin",
    "divineAttributeAr": "القُدُّوسُ",
    "divineAttributeFr": "Al-Quddus (Le Très-Saint, L'Absolument Pur)",
    "divineAttributeEn": "Al-Quddus (The Most Holy, Pure Beyond Measure)",
    "divineAttributeHa": "Al-Quddus (Mafi Tsarki, Tsatttakan Sarki)",
    "abjadWeight": 662,
    "lunarMansion": "Al-Sharatan (الشرطان)",
    "element": "fire",
    "secretFr": "Grand Secret de la Purification Divine & Clé Primordiale du Serment. Dans la tradition théurgique d'Ibn al-Hajj et du Sheikh Ahmad al-Buni dans \"Sharh al-Barhatiyyah\", Barhatihin est le premier nom sacré du pacte immémorial. Il correspond à l'attribut divin \"Al-Quddus\" (Le Très-Saint). Ce nom possède la vertu cosmique de diffuser un feu céleste purificateur qui calcine instantanément les parasites de l'astral, les résidus de magie noire, les miasmes spirituels et les envoûtements familiaux anciens. \n\nLorsqu'il est prononcé avec une intention pure et la présence du cœur, Barhatihin éveille le centre spirituel du cœur (Latifah al-Qalb), efface l'angoisse existentielle et projette une aura d'une clarté étincelante qui fait fuir les esprits bas et les démons. Il agit comme un dissolvant universel des voiles d'ignorance et de doute, permettant à l'opérateur de percevoir la Présence Divine sans interférence. Il est dit que quiconque médite quotidiennement sur sa fréquence (662) voit sa mémoire illuminée et son esprit protégé contre la démence et la dépression.",
    "secretEn": "Grand Secret of Divine Purification & Primordial Covenant Key. In the classical theurgic tradition of Sheikh Ahmad al-Buni in \"Sharh al-Barhatiyyah\", Barhatihin is the premier sacred name of the ancient oath, corresponding to \"Al-Quddus\" (The All-Holy). It radiates a celestial purifying fire that instantly burns away astral parasites, lingering curses, and ancestral spiritual miasmas.\n\nWhen recited with heart presence, Barhatihin awakens the spiritual heart center (Latifah al-Qalb), dispels existential fear, and projects a brilliant aura of divine light that repels lower entities. It acts as a universal solvent against veils of doubt, enabling direct perception of spiritual truth. Daily contemplation on its numerical frequency (662) illuminates memory and shields the mind from despair and delusion.",
    "secretHa": "Babban Sirrin Tsarkakewar Samaniya da Mukullun Farko na Yarjejeniyar Barhatiah. A cikin littafin \"Sharh al-Barhatiyyah\" na Sheikh Ahmad al-Buni, Barhatihin shi ne suna na farko mai tsarki wanda ya dace da sunan Allah \"Al-Quddus\" (Mafi Tsarki). Yana fitar da hasken wuta na samaniya wanda ke kona dukkan shaidanu, sihiri na gado, da dukkan duhun ruhani a cikin daqika kadan.\n\nIdan aka karanta shi da kyakkyawar zuciya, yana buɗe idon basira na zuciya (Latifah al-Qalb), yana cire fargaba da damuwa, kuma yana kewaye mutum da garkuwar haske mai karfi. Shi ne ke ruguza dukkan shamaki da ke tsakanin mutum da nasararsa. Karanta shi da yawa yana haskaka kwakwalwa da kiyaye zuciya daga firgita.",
    "recipeFr": "Grand Protocole Canonique de Purification & Délivrance des Lieux et des Âmes :\n1. Timing & Préparation : Effectuez ce rituel le dimanche au lever du soleil (première heure du Soleil) ou la nuit du jeudi au vendredi. Soyez en état de pureté rituelle majeure et mineure (Ghusl & Wudu), vêtu de blanc.\n2. Encensement : Brûlez de l'encens de Benjoin blanc pur (Jawi) et du Mastic sur des charbons ardents pour sanctifier l'atmosphère.\n3. Calligraphie Sacrée : À l'encre de safran pur infusée dans de l'eau de rose et une goutte de musc, écrivez le nom \"Barhatihin\" (بَرْهَتِيهٍ) 66 fois (ou 662 fois pour un cas lourd) sur une assiette neuve en céramique blanche ou sur du papier parchemin pur.\n4. Activation & Récitation : Lisez la grande invocation (Da'wah) de la Barhatiah puis répétez le nom \"Barhatihin\" 662 fois en maintenant votre regard fixé sur l'écriture.\n5. Emploi : Dissolvez la calligraphie dans 7 litres d'eau de source pure. Utilisez cette eau bénie pour laver votre visage et votre corps au lever du soleil pendant 7 jours consécutifs. Aspergez également les quatre coins de votre demeure pour purifier le lieu des présences nuisibles.",
    "recipeEn": "Canonical Purification & Exorcism Protocol:\n1. Timing & Preparation: Perform on Sunday at sunrise (first hour of the Sun) or Thursday night. Be in complete ritual purity (Ghusl & Wudu) wearing clean white garments.\n2. Incense: Burn pure white benzoin resin (Jawi) and mastic over hot coals to sanctify the atmosphere.\n3. Sacred Calligraphy: Using saffron ink dissolved in rosewater and musk, write \"Barhatihin\" (بَرْهَتِيهٍ) 66 times (or 662 times for severe cases) on a white ceramic plate or parchment paper.\n4. Activation & Recitation: Recite the Grand Barhatiah Invocation then repeat \"Barhatihin\" 662 times while gazing focused at the calligraphy.\n5. Application: Wash off the ink with 7 liters of pure spring water. Use this water to wash face and body every morning for 7 consecutive days, and sprinkle all four interior corners of your residence to cleanse space.",
    "recipeHa": "Cikakken Shirin Tsabta da Warware Matse-Matse:\n1. Lokaci da Shirye-shirye: Yi wannan aikin ranar Lahadi da asuba (sa'a ta farko ta rana) ko daren Juma'a. Yi wanka da alwala ka saka tufafi farare masu tsarki.\n2. Turare: Kona turaren Jawi fari da Mastaki a kan garwashin wuta domin tsarkake dakin.\n3. Rubutun Asiri: Da tawadar za'afaran da ruwan rosewater da musk, rubuta \"Barhatihin\" (بَرْهَتِيهٍ) sau 66 (ko sau 662 domin matsala mai tsanani) a kwanon faranti fari sabo.\n4. Karatu: Karanta karatun Barhatiah sannan ka maimaita \"Barhatihin\" sau 662 kana kallon rubutun.\n5. Amfani: Wanke rubutun da lita 7 na ruwan rijiya ko Zamzam. Yi amfani da ruwan wajen wanke fuska da jiki kowace safe har kwana 7, kuma ka yayafa a kusurwoyin gidan domin korar shaidanu.",
    "invocationAr": "يا قدوسُ قِدِّسْنِي مِنْ كُلِّ آفَةٍ وَعَاهَةٍ بِحَقِّ بَرْهَتِيهٍ",
    "invocationTranslit": "Ya Quddusu qiddisnee min kulli afatin wa aahatin bi-haqqi Barhatihin",
    "invocationFr": "Ô Très-Saint, purifie-moi de tout fléau, de toute infirmité et de tout obscurcissement par la vérité sacrée du nom Barhatihin.",
    "invocationEn": "O All-Holy One, sanctify me from every affliction, defect, and darkness by the sacred truth of Barhatihin.",
    "invocationHa": "Ya Tsatttakan Sarki, ka tsalkafani daga kowane cuta da jarrabawa albarkacin Barhatihin.",
    "talsamCode": "١١١ ٩٩٩ ٦٢ ط ط ط 🕯️",
    "wafq3x3": [
      [
        "221",
        "226",
        "215"
      ],
      [
        "216",
        "221",
        "225"
      ],
      [
        "225",
        "215",
        "222"
      ]
    ]
  },
  {
    "id": 2,
    "nameAr": "كَرَرٍ",
    "nameTranslit": "Kararin",
    "divineAttributeAr": "إِلٰهُ كُلِّ شَيْءٍ",
    "divineAttributeFr": "Ilah Kull Shai (Dieu de toute chose, Le Protecteur Infaillible)",
    "divineAttributeEn": "Ilah Kull Shai (God of All Creation, Unfailing Shield)",
    "divineAttributeHa": "Ubangijin Komai da Kowa (Katanga Mai Karfi)",
    "abjadWeight": 430,
    "lunarMansion": "Al-Butayn (البطين)",
    "element": "earth",
    "secretFr": "Grand Secret de la Bastion Occulte & Bouclier de Force Tellurique. Dans les traités anciens, Kararin est associé au Nom Divin \"Ilah Kull Shai\" (Le Dieu de toute chose) et possède la puissance d'une muraille d'acier invisible. Il ancre la fréquence vibratoire de l'opérateur dans la stabilité inébranlable de la terre, rendant son aura totalement imperméable aux attaques psychiques, aux mauvais yeux d'envie destructrice, à la sorcellerie enfouie (Sihr Maqbur) et aux complots feutrés.\n\nCe nom a la propriété spirituelle de retourner automatiquement les malédictions vers leurs auteurs avec une force multipliée. Il accorde une présence impressionnante qui impose la prudence et le respect aux ennemis déclarés. En méditant sur sa valeur numérique (430), l'esprit acquiert un sang-froid imperturbable lors des situations de danger imminent et les peurs irrationnelles sont définitivement éliminées.",
    "secretEn": "Grand Secret of Occult Fortification & Earthly Armor. In ancient esoteric texts, Kararin correlates with \"Ilah Kull Shai\" (God of All Things) and bestows the strength of an invisible steel bastion. It grounds the practitioner's aura into absolute stability, rendering it impervious to psychic assaults, evil eye, buried sorcery, and covert betrayals.\n\nThis divine name automatically deflects hostile energies back to their origin with amplified intensity. It imparts a formidable spiritual gravity that commands instant caution and respect from opponents. Daily alignment with its weight (430) bestows unshakeable composure in peril and neutralizes phantom anxieties.",
    "secretHa": "Babban Sirrin Katangar Kariya da Karfen Ruhani. A cikin tsoffin littattafan asiri, Kararin yana tafiya ne da sunan Allah \"Ilah Kull Shai\" (Ubangijin Kowa da Komai). Yana ba mutum garkuwa mai karfi kamar katangar karfe wadda babu asiri, maita, sammu na binne, ko maitan idon hassada da zai iya ratsawa.\n\nWannan suna yana da ikon mayar da asirin makiyayi zuwa kansa da sauri. Yana cika mutum da kwarjini na kariya wanda ke sa makiya tsoron cutar da shi. Karanta shi da lissafinsa (430) yana cire fargaba da tsoro a zuciya, yana ba mutum karfin gwiwa a lokacin matsi.",
    "recipeFr": "Protocole Canonique de Fortification Aurique & Protection des Biens :\n1. Timing : Le dimanche soir après le coucher du soleil ou le mardi à l'heure de Mars.\n2. Encensement : Brûlez du Sang-de-Dragon (Dam al-Akhas), de la Myrrhe purifiée et du Mastic.\n3. Calligraphie : Écrivez \"Kararin\" (كَرَرٍ) 430 fois sur un parchemin naturel ou du papier blanc épais à l'encre de safran et d'eau de rose. Autour du bloc d'écriture, tracez le verset de protection Ayat al-Kursi en cercle fermé.\n4. Récitation : Lisez le nom \"Kararin\" 430 fois après la prière de l'Isha chaque soir durant 7 nuits consécutives.\n5. Porter & Fixer : Pliez soigneusement le document et portez-le sur vous dans un étui en cuir propre, ou fixez-le au-dessus de la porte d'entrée de votre foyer pour empêcher tout esprit malveillant ou voleur d'y pénétrer.",
    "recipeEn": "Canonical Aura Fortification & Property Shield Protocol:\n1. Timing: Sunday evening after sunset or Tuesday during the planetary hour of Mars.\n2. Incense: Burn Dragon's Blood resin, purified myrrh, and mastic.\n3. Writing: Inscribe \"Kararin\" (كَرَرٍ) 430 times on natural parchment using saffron ink. Encircle the text block with Ayat al-Kursi in a seamless loop.\n4. Recitation: Recite \"Kararin\" 430 times after Isha prayer every night for 7 consecutive nights.\n5. Application: Fold the amulet and carry it in a clean leather pouch, or affix above your main entrance to prevent evil forces and thieves from entering.",
    "recipeHa": "Hanyar Kariya daga Makiya da Maita:\n1. Lokaci: Ranar Lahadi da daddare ko ranar Talata lokacin tauraron Mars.\n2. Turare: Kona turaren Dam al-Akhas da Murr da Mastaki.\n3. Rubutu: Rubuta \"Kararin\" (كَرَرٍ) sau 430 a takarda fara da za'afaran. Trace Ayatul Kursiyyu a kewaye a matsayin da'ira.\n4. Karatu: Karanta \"Kararin\" sau 430 bayan sallar Isha kowace daddare har kwana 7.\n5. Rike ko Ratayawa: Nalle takardar ka saka a gidan fata mai tsarki ka rike a aljihu, ko ka rataya a saman kofar gida domin tsare gida daga shaidanu da barayi.",
    "invocationAr": "يا إِلٰهَ كُلِّ شَيْءٍ احْفَظْنِي مِنْ كَيْدِ الْحَاسِدِينَ بِحَقِّ كَرَرٍ",
    "invocationTranslit": "Ya Ilaha kulli sha'in ihfadhnee min kaydi al-hasideena bi-haqqi Kararin",
    "invocationFr": "Ô Dieu de toute chose, préserve-moi des pièges des envieux, des complots des malveillants et des regards sombres par la vérité du nom Kararin.",
    "invocationEn": "O God of all creation, protect me from the schemes of the envious, the plots of the ill-willed, and dark eyes by Kararin.",
    "invocationHa": "Ya Ubangijin kowa da komai, ka tsareni daga makircin masu hassada albarkacin Kararin.",
    "talsamCode": "٤٣٠ ٧٧٧ ككك 🛡️",
    "wafq3x3": [
      ["147", "139", "144"],
      ["141", "143", "146"],
      ["142", "148", "140"]
    ]
  },
  {
    "id": 3,
    "nameAr": "تَتْلِيهٍ",
    "nameTranslit": "Tatlihin",
    "divineAttributeAr": "القَادِرُ الخَبِيرُ",
    "divineAttributeFr": "Al-Qadir Al-Khabir (Le Puissant Omniscient, L'Apaisateur des Cœurs)",
    "divineAttributeEn": "Al-Qadir Al-Khabir (The All-Powerful, The All-Aware Pacifier)",
    "divineAttributeHa": "Al-Qadir Al-Khabir (Mai Iko, Mai Cikakken Labari)",
    "abjadWeight": 845,
    "lunarMansion": "Al-Thurayya (الثريا)",
    "element": "air",
    "secretFr": "Grand Secret de l'Harmonie Cosmique, Réconciliation & Clarté Ésotérique. Tatlihin correspond aux attributs de Puissance et d'Omniscience \"Al-Qadir Al-Khabir\". Ce nom sacré détient la fréquence subtile qui adoucit les cœurs les plus endurcis, éteint les disputes familiales venimeuses et restaure la concorde au sein des communautés divisées.\n\nAu niveau intellectuel et spirituel, Tatlihin ouvre les facultés supérieures de l'esprit : il amplifie la mémoire photographique, accélère la compréhension intuitive des sciences ésotériques complexes (Ilm al-Huruf, Alchimie, Géomancie) et permet d'assimiler avec aisance les textes sacrés. Il dissipe la brume mentale et le doute, permettant de discerner clairement les intentions réelles de ses interlocuteurs.",
    "secretEn": "Grand Secret of Cosmic Harmony, Reconciliation & Intellectual Illumination. Tatlihin embodies the divine attributes \"Al-Qadir Al-Khabir\" (The All-Powerful, The All-Aware). It carries a gentle spiritual frequency that softens hardened hearts, quenches bitter family feuds, and restores enduring peace in fractured communities.\n\nOn the mental plane, Tatlihin unlocks higher cognitive channels: it enhances memory retention, accelerates intuitive comprehension of profound esoteric sciences (Ilm al-Huruf, Sacred Geometry), and grants effortless mastery over spiritual texts. It dissolves cognitive fog, enabling one to clearly perceive underlying motives.",
    "secretHa": "Babban Sirrin Zaman Lafiya, Sasanta Mutane da Bude Basira. Tatlihin yana wakiltar sunayen Allah \"Al-Qadir Al-Khabir\" (Mai Iko, Mai Labarin Komai). Yana da wani asiri na musamman da ke kwantar da fushin zuciya, yana kashe rigima tsakanin yan uwa ko ma'aurata, kuma yana kawo zumunci da kauna.\n\nA fannin ilimi da basira, Tatlihin yana bude kwakwalwa wajen harda da fahimtar ilimin asiri mai zurfi. Yana kawo fahimta ta gaggawa, yana cire daushin mantuwa, kuma yana goge duhun tunani domin gane gaskiyar mutane.",
    "recipeFr": "Grand Protocole d'Apaisement & Illumination de l'Esprit :\n1. Timing : Le mercredi soir ou durant la nuit du jeudi à la troisième heure spirituelle.\n2. Encensement : Brûlez du Benjoin blanc pur et du Mastic de Chios.\n3. Calligraphie : À l'encre de safran infusée à l'eau de fleur d'oranger, écrivez \"Tatlihin\" (تَتْلِيهٍ) 19 fois en cercle parfait autour d'une coupe d'eau pure.\n4. Récitation : Répétez le nom \"Tatlihin\" 845 fois avec une concentration immobile sur la paix, l'harmonie et l'ouverture de l'intelligence.\n5. Utilisation : Faites boire cette eau parfumée aux personnes en conflit ou buvez-la vous-même avant d'étudier pour ouvrir votre capacité de mémorisation et d'assimilation.",
    "recipeEn": "Grand Harmony & Mind Illumination Protocol:\n1. Timing: Wednesday night or Thursday night during the 3rd spiritual hour.\n2. Incense: Burn pure white benzoin and Chios mastic resin.\n3. Calligraphy: Write \"Tatlihin\" (تَتْلِيهٍ) 19 times in a perfect circle using saffron ink infused with orange blossom water onto paper or inside a bowl.\n4. Recitation: Recite \"Tatlihin\" 845 times focusing intently on reconciliation and wisdom.\n5. Application: Serve this blessed water to individuals in dispute, or drink it yourself before study sessions to unlock extraordinary retention.",
    "recipeHa": "Hanyar Kawo Zaman Lafiya da Bude Ilimi:\n1. Lokaci: Daren Laraba ko daren Alhamis.\n2. Turare: Kona turaren Jawi fari da Mastaki.\n3. Rubutu: Rubuta \"Tatlihin\" (تَتْلِيهٍ) sau 19 da za'afaran a da'ira a takarda fara ko a kwanon gilashi.\n4. Karatu: Karanta \"Tatlihin\" sau 845 da kyakkyawan nufin zaman lafiya ko samun ilimi.\n5. Amfani: Ba masu rigima ruwan su sha domin sasanta su, ko ka sha kafin karatu domin bude kwakwalwa da saurin harda.",
    "invocationAr": "يا قَادِرُ يا خَبِيرُ أَلِّفْ بَيْنَ القُلُوبِ وَاهْدِنَا سُبُلَ السَّلَامِ بِحَقِّ تَتْلِيهٍ",
    "invocationTranslit": "Ya Qadiru ya Khabiru allif bayna al-quloobi wahdina subula as-salami bi-haqqi Tatlihin",
    "invocationFr": "Ô Puissant, ô Informé, unis nos cœurs dans l'amour divin et guide-nous sur les sentiers de la paix sacrée par la vérité de Tatlihin.",
    "invocationEn": "O All-Powerful, O All-Aware, unite our hearts in divine love and guide us upon paths of peace by Tatlihin.",
    "invocationHa": "Ya Mai Iko, Ya Mai labarin komai, ka hada kawunanmu ka shirye mu zuwa hanyar aminci albarkacin Tatlihin.",
    "talsamCode": "٨٤٥ ٣٣٣ ت ت ت 🕊️",
    "wafq3x3": [
      ["286", "277", "282"],
      ["279", "281", "285"],
      ["280", "287", "278"]
    ]
  },
  {
    "id": 4,
    "nameAr": "طَوْرَانٍ",
    "nameTranslit": "Tawran",
    "divineAttributeAr": "الحَيُّ القَيُّومُ",
    "divineAttributeFr": "Al-Hayy Al-Qayyum (Le Vivant, Le Subsistant Suprême)",
    "divineAttributeEn": "Al-Hayy Al-Qayyum (The Ever-Living, The Self-Sustaining Source)",
    "divineAttributeHa": "Al-Hayy Al-Qayyum (Raye wanda ba ya mutuwa, Mai tsayuwa da kowa)",
    "abjadWeight": 266,
    "lunarMansion": "Al-Dabaran (الدبران)",
    "element": "fire",
    "secretFr": "Grand Secret de la Régénération Vitale, Guérison Physio-Énergétique & Exorcisme des Maladies. Tawran vibre sous la fréquence des Noms Suprêmes \"Al-Hayy Al-Qayyum\" (Le Vivant, Le Subsistant). C'est l'étincelle de feu sacré qui réanime les corps épuisés, dissout la léthargie chronique, surmonte la dépression profonde et purge l'organisme des toxines physiques et occultes.\n\nCe nom possède un pouvoir régénérateur exceptionnel sur les cellules et les fluides corporels. Il combat les maladies mystérieuses que la médecine conventionnelle peine à diagnostiquer, brise les attaques d'envoûtement visant la détérioration de la santé physique et insuffle un dynamisme irrésistible. Son usage est recommandé pour quiconque traverse une période de convalescence ou de grande fatigue spirituelle.",
    "secretEn": "Grand Secret of Vital Regeneration, Bio-Energetic Healing & Physical Exorcism. Tawran vibrates to the frequency of \"Al-Hayy Al-Qayyum\" (The Ever-Living, The Self-Subsisting). It represents the spark of sacred fire that resurrects depleted vitality, dissolves chronic fatigue, lifts clinical depression, and purges physical and etheric toxins.\n\nThis divine name exerts extraordinary regenerative force over biological systems. It counters mysterious ailments that evade conventional diagnosis, shatters curses aimed at physical decline, and infuses unyielding vigor. It is highly recommended for those recovering from severe illness or spiritual burnout.",
    "secretHa": "Babban Sirrin Sabunta Karfin Jiki, Maganin Cututtuka da Samun Lafiya. Tawran yana tafiya ne da sunan Allah \"Al-Hayy Al-Qayyum\" (Raye wanda ba ya mutuwa, Mai Tsayuwa da Komai). Shi ne kibrit na wutar samaniya wanda ke dawo da karfin jiki, yana yaye kasala, damuwa mai zurfi, da ciwo mai wuya.\n\nWannan suna yana da tasiri mai karfi wajen warkar da ciwon da likitoci suka kasa gane kansa, yana karya sihiri na lallata lafiyar jiki, kuma yana cika mutum da karfi da karsashi. Yana da kyau ga duk wanda ke jin nauyin jiki ko ciwo na tsawon lokaci.",
    "recipeFr": "Protocole de Revitalisation & Guérison Holistique :\n1. Timing : Le dimanche matin au lever du soleil ou lors du premier jour de la nouvelle lune.\n2. Encensement : Brûlez du Mastic pur, du Santal rouge et des clous de girofle.\n3. Calligraphie : À l'encre de safran pur infusée dans de l'eau de Zamzam ou de l'eau de pluie pure, écrivez \"Tawran\" (طَوْرَانٍ) 266 fois sur une feuille blanche neuve sans lignes.\n4. Récitation : Lisez le nom \"Tawran\" 266 fois au-dessus de la feuille et d'une carafe d'eau de 1 à 3 litres.\n5. Consommation : Faites tremper le document dans l'eau. Buvez-en un verre à jeun chaque matin pendant 7 jours consécutifs tout en récitant le nom 266 fois.",
    "recipeEn": "Holistic Healing & Vitality Regeneration Protocol:\n1. Timing: Sunday morning at sunrise or on the 1st day of the new moon.\n2. Incense: Burn pure mastic resin, red sandalwood, and whole cloves.\n3. Calligraphy: Write \"Tawran\" (طَوْرَانٍ) 266 times using pure saffron ink dissolved in Zamzam or rainwater onto an unlined sheet.\n4. Recitation: Recite \"Tawran\" 266 times over the sheet and a pitcher containing 1-3 liters of pure water.\n5. Application: Submerge the paper in the water. Drink one glass on an empty stomach every morning for 7 days while reciting the name 266 times.",
    "recipeHa": "Hanyar Samun Cikakkiyar Lafiya da Karfi:\n1. Lokaci: Ranar Lahadi da asuba ko ranar farko ta samun sabon wata.\n2. Turare: Kona turaren Mastaki da itacen Santal da Kanumfari.\n3. Rubutu: Rubuta \"Tawran\" (طَوْرَانٍ) sau 266 da za'afaran a ruwan Zamzam ko ruwan sama a farar takarda.\n4. Karatu: Karanta \"Tawran\" sau 266 a kan takardar da kwanon ruwa lita 1 zuwa 3.\n5. Amfani: Jiqa takardar a ruwan. Sha kofina daya kowace safe kafin cin abinci har kwana 7 kana karatun sunan sau 266.",
    "invocationAr": "يا حَيُّ يا قَيُّومُ أَحْيِ قَلْبِي وَبَدَنِي بِحَقِّ طَوْرَانٍ",
    "invocationTranslit": "Ya Hayyu ya Qayyumu ahyi qalbee wa badanee bi-haqqi Tawran",
    "invocationFr": "Ô Vivant, ô Subsistant, vivifie mon cœur, régénère mon corps et dissipe tout mal par la vérité du nom Tawran.",
    "invocationEn": "O Ever-Living, O Self-Subsisting, revitalize my heart, regenerate my body, and dispel all harm by Tawran.",
    "invocationHa": "Ya Raye da ke tsaye da komai, ka rayar da zuciyata da jikina albarkacin Tawran.",
    "talsamCode": "٢٦٦ ٥٥٥ ط ط ط 🌿",
    "wafq3x3": [
      ["93", "84", "89"],
      ["86", "88", "92"],
      ["87", "94", "85"]
    ]
  },
  {
    "id": 5,
    "nameAr": "مَزْجَلٍ",
    "nameTranslit": "Mazjalin",
    "divineAttributeAr": "القَيُّومُ الأَحَدُ",
    "divineAttributeFr": "Al-Qayyum Al-Ahad (Le Subsistant, L'Unique Sublimé)",
    "divineAttributeEn": "Al-Qayyum Al-Ahad (The Self-Sustaining, The Singular One)",
    "divineAttributeHa": "Al-Qayyum Al-Ahad (Mai Tsayuwa da Komai, Shi Kadai Tilo)",
    "abjadWeight": 83,
    "lunarMansion": "Al-Haq'ah (الهقعة)",
    "element": "water",
    "secretFr": "Grand Secret du Charisme Royal, Élévation de Rang & Déblocage des Portes Fermées. Mazjalin est lié aux noms de Majesté \"Al-Qayyum Al-Ahad\". Ce nom porte l'onde de choc spirituelle qui débloque les situations administratives apparemment intricables, attire la faveur des gouvernants, des juges et des décideurs, et accorde un prestige naturel irrésistible.\n\nIl confère à celui qui le maîtrise une aura d'autorité douce mais inébranlable. Lorsqu'un individu est confronté à des refus répétés, des dossiers bloqués ou des discriminations injustes, Mazjalin dissout les résistances psychologiques de ses interlocuteurs et inspire le respect immédiat. Il élève le statut social et protège contre les manœuvres d'abaissement.",
    "secretEn": "Grand Secret of Majestic Charisma, Elevation of Status & Unblocking Closed Doors. Mazjalin aligns with \"Al-Qayyum Al-Ahad\" (The Self-Sustaining, The Singular). It releases an energetic force that dissolves complex administrative blockages, commands favor from authorities and decision-makers, and bestows effortless, dignified prestige.\n\nIt wraps the practitioner in a commanding yet gracious aura. When facing institutional deadlocks, bureaucratic rejections, or unfair opposition, Mazjalin neutralizes hostility and inspires immediate deference. It elevates social standing and shields against humilation.",
    "secretHa": "Babban Sirrin Kwarjini na Sarakuna, Daukakar Ranki da Bude Kofofin da Suka Rufe. Mazjalin yana tafiya ne da sunayen Allah \"Al-Qayyum Al-Ahad\" (Mai Tsayuwa da Komai, Shi Kadai Tilo). Shi ne ke buɗe ayyukan da suka tsaya a hukuma, yana janyo masoya a tsakanin shugabanni da alkallai, kuma yana ba mutum kwarjini na ban mamaki.\n\nYana sa mutum ya kasance mai kwarjini a idon kowa wanda ba za a iya raina shi ba. Idan an sami aiki ko neman takarda da ya ki fitowa, Mazjalin yana kawar da kowane cikas a cikin sauri. Yana daukaka mutum kuma yana tsare shi daga wulakanci.",
    "recipeFr": "Protocole de Charisme, Élévation & Réussite aux Entretiens :\n1. Timing : Le jeudi matin au lever du soleil (heure de Jupiter).\n2. Encensement : Brûlez de l'Oliban supérieur (Luban Dhakar) et de l'Ambre pur.\n3. Calligraphie : Écrivez \"Mazjalin\" (مَزْجَلٍ) 83 fois à l'encre de safran et de musc sur une feuille blanche. Ajoutez au bas du texte votre nom et celui de votre mère.\n4. Récitation : Lisez le nom \"Mazjalin\" 83 fois (ou 830 fois pour un grand enjeu) en tenant le papier devant vos lèvres.\n5. Application : Pliez le document et portez-le sur vous (poche de poitrine ou bras droit). Avant de vous présenter à un rendez-vous capital ou un examen, récitez le nom 83 fois.",
    "recipeEn": "Charisma, Elevation & Official Interview Success Protocol:\n1. Timing: Thursday morning at sunrise (planetary hour of Jupiter).\n2. Incense: Burn high-grade Frankincense (Luban Dhakar) and amber resin.\n3. Writing: Write \"Mazjalin\" (مَزْجَلٍ) 83 times using saffron and musk ink on a clean sheet. Include your full name and mother's name at the bottom.\n4. Recitation: Recite \"Mazjalin\" 83 times (or 830 times for high-stakes affairs) close to the paper.\n5. Application: Fold the document and carry it in your chest pocket or upper right arm. Before entering crucial meetings, recite the name 83 times.",
    "recipeHa": "Hanyar Samun Kwarjini da Nasara a Neman Aiki ko Wurin Shugabanni:\n1. Lokaci: Ranar Alhamis da hantsi (sa'a ta farko ta Jupiter).\n2. Turare: Kona turaren Luban Dankar da Turaren Ambar.\n3. Rubutu: Rubuta \"Mazjalin\" (مَزْجَلٍ) sau 83 da za'afaran da musk a takarda fara. Rubuta sunanka da na mahaifiyarka a kasan rubutun.\n4. Karatu: Karanta \"Mazjalin\" sau 83 (ko sau 830 domin babban al'amari).\n5. Amfani: Nalle takardar ka saka a aljihun gaba na riga. Kafin ka shiga taro ko wurin shugaba, karanta sunan sau 83.",
    "invocationAr": "يا قَيُّومُ يا أَحَدُ ارْفَعْ قَدْرِي وَسَهِّلْ أَمْرِي بِحَقِّ مَزْجَلٍ",
    "invocationTranslit": "Ya Qayyumu ya Ahadu irfa' qadree wa sahhil amree bi-haqqi Mazjalin",
    "invocationFr": "Ô Subsistant, ô Unique, élève mon rang, facilite mes démarches et accorde-moi la victoire par la vérité de Mazjalin.",
    "invocationEn": "O Self-Sustaining, O One, elevate my rank, ease my affairs, and grant me success by Mazjalin.",
    "invocationHa": "Ya Mai tsayuwa da kowa, Ya Tilo, ka daga matsayina ka saukaka al'amarina albarkacin Mazjalin.",
    "talsamCode": "٨٣ ١١١ ممم 👑",
    "wafq3x3": [
      ["32", "23", "28"],
      ["25", "27", "31"],
      ["26", "33", "24"]
    ]
  },
  {
    "id": 6,
    "nameAr": "بَزْجَلٍ",
    "nameTranslit": "Bazjalin",
    "divineAttributeAr": "الوَدُودُ الرَّؤُوفُ",
    "divineAttributeFr": "Al-Wadud Al-Raoof (Le Particulièrement Aimant, Le Compatissant)",
    "divineAttributeEn": "Al-Wadud Al-Raoof (The Loving One, The Compassionate)",
    "divineAttributeHa": "Al-Wadud Al-Raoof (Mai Masoyi, Mai Tausayi)",
    "abjadWeight": 41,
    "lunarMansion": "Al-Hana'ah (الهنعة)",
    "element": "air",
    "secretFr": "Grand Secret de l'Amour Pur, de l'Attraction Légitime & de l'Harmonie Conjugale. Bazjalin incarne les attributs d'Affection et de Compassion Divines \"Al-Wadud Al-Raoof\". Ce nom d'une douceur céleste dissout les rancœurs tenaces, éteint la froideur sentimentale entre époux et inspire une sympathie universelle et sincère auprès de tous ceux qui croisent la route de l'opérateur.\n\nEn affaires et dans le commerce, Bazjalin attire une clientèle fidèle et bienveillante, adoucit les négociations tendues et facilite les accords équitables. Il purifie l'énergie du cœur des sentiments d'amertume ou de jalousie, permettant d'émettre une fréquence d'amour inconditionnel qui transforme naturellement les oppositions en alliances durables.",
    "secretEn": "Grand Secret of Pure Love, Sacred Attraction & Marital Harmony. Bazjalin manifests the divine attributes \"Al-Wadud Al-Raoof\" (The All-Loving, The Compassionate). This name releases a celestial frequency that melts resentment, restores emotional warmth between estranged spouses, and inspires genuine affection from everyone encountered.\n\nIn commerce, Bazjalin draws loyal, benevolent clients, softens tense contract negotiations, and fosters equitable deals. It purifies the heart of bitterness, enabling one to radiate unconditional warmth that naturally transforms conflict into lasting unity.",
    "secretHa": "Babban Sirrin Kauna ta Halal, Janyo Soyayya da Zaman Lafiya na Ma'aurata. Bazjalin yana dauke da sunayen Allah \"Al-Wadud Al-Raoof\" (Mai Masoyi, Mai Tausayi). Wannan suna yana da asiri na ban mamaki wanda ke goge kiyayya a zuciya, yana dawo da soyayya da karsashi tsakanin mata da miji, kuma yana sa mutane su ji daɗin mu'amala da kai.\n\nA fannin kasuwanci, Bazjalin yana janyo masu sayen kaya masu albarka, yana saukaka ciniki, kuma yana sa a amince da kai cikin sauri. Yana tsarkake zuciya daga kiyayya ko tsana, yana maida makiya su koma abokai na kusa.",
    "recipeFr": "Protocole d'Amour Sacré, Réconciliation & Succès Commercial :\n1. Timing : Le vendredi soir après la prière du Maghrib (heure de Vénus).\n2. Encensement : Brûlez du Benjoin blanc, du Bois de Santal et de la Cannelle moulue.\n3. Calligraphie : À l'encre de safran parfumée à l'eau de fleur d'oranger, écrivez \"Bazjalin\" (بَزْجَلٍ) 41 fois sur une feuille fine ou directement à l'intérieur d'un verre en cristal.\n4. Récitation : Répétez le nom \"Bazjalin\" 410 fois (ou 41 fois sur la boisson) en visualisant la paix et l'affection pure.\n5. Application : Partagez cette boisson bénie avec votre conjoint, ou aspergez-en le seuil de votre boutique pour attirer l'abondance des clients.",
    "recipeEn": "Sacred Love, Marriage Reconciliation & Business Success Protocol:\n1. Timing: Friday evening after Maghrib prayer (planetary hour of Venus).\n2. Incense: Burn white benzoin, sandalwood powder, and ground cinnamon.\n3. Calligraphy: Using saffron ink infused with orange blossom water, write \"Bazjalin\" (بَزْجَلٍ) 41 times on parchment or inside a clean glass vessel.\n4. Recitation: Recite \"Bazjalin\" 410 times (or 41 times directly over the cup) focusing on pure love and harmony.\n5. Application: Share the drink with your spouse, or sprinkle the entrance of your store to draw prosperous customers.",
    "recipeHa": "Hanyar Karfafa Soyayya da Samun Masu Sayen Kaya:\n1. Lokaci: Ranar Juma'a da daddare bayan sallar Magriba.\n2. Turare: Kona turaren Jawi fari, Santal da Kirfa.\n3. Rubutu: Rubuta \"Bazjalin\" (بَزْجَلٍ) sau 41 da za'afaran da ruwan hure a takarda ko a cikin kwanon gilashi.\n4. Karatu: Karanta \"Bazjalin\" sau 410 (ko sau 41 a kan ruwan) kana rokon Allah kauna da zaman lafiya.\n5. Amfani: Ba matarka ko mijinki ku sha tare, ko ka yayafa ruwan a bakin shagon kasuwancinca domin janyo masu ciniki.",
    "invocationAr": "يا وَدُودُ يا رَؤُوفُ أَلْقِ المَحَبَّةَ فِي القُلُوبِ بِحَقِّ بَزْجَلٍ",
    "invocationTranslit": "Ya Wadoodu ya Raoofu alqi al-mahabbata fee al-quloobi bi-haqqi Bazjalin",
    "invocationFr": "Ô Particulièrement Aimant, ô Compatissant, insuffle la charité et l'amour sincère dans les cœurs par la vérité de Bazjalin.",
    "invocationEn": "O Most Loving, O Compassionate, instill love and affection in hearts by Bazjalin.",
    "invocationHa": "Ya Mai Masoyi, Ya Mai Tausayi, ka jefa soyayya a zukatan mutane albarkacin Bazjalin.",
    "talsamCode": "٤١ ٤٤٤ ب ب ب ❤️",
    "wafq3x3": [
      ["18", "9", "14"],
      ["11", "13", "17"],
      ["12", "19", "10"]
    ]
  },
  {
    "id": 7,
    "nameAr": "تَرَقَّبٍ",
    "nameTranslit": "Tarqabin",
    "divineAttributeAr": "السَّلَامُ المُنْتَقِمُ",
    "divineAttributeFr": "Al-Salam Al-Muheit (La Paix Suprême, Le Protecteur des Biens)",
    "divineAttributeEn": "Al-Salam Al-Muheit (The Peace, The Universal Guardian)",
    "divineAttributeHa": "Al-Salam (Mai Aminci, Mai Kariya ta Dukiya)",
    "abjadWeight": 712,
    "lunarMansion": "Al-Dhira' (الذراع)",
    "element": "earth",
    "secretFr": "Grand Secret de la Garde Céleste & Préservation des Richesses et Domaines. Tarqabin correspond à l'attribut de Sécurité et de Paix Suprême \"Al-Salam Al-Muheit\". Ce nom établit un périmètre occulte inviolable autour de la propriété privée, des usines, des véhicules, des stocks commerciaux et des coffres-forts. Il repousse les cambrioleurs, les voleurs, les incendies accidentels et les pillages.\n\nPour les voyageurs et les commerçants en déplacement, Tarqabin offre un bouclier contre les agressions, les accidents de route et les extorsions. Il surveille la demeure en l'absence de son propriétaire et paralyse l'intention de quiconque cherche à s'emparer injustement de ses biens.",
    "secretEn": "Grand Secret of Celestial Guardianship & Protection of Assets. Tarqabin aligns with \"Al-Salam Al-Muheit\" (The Supreme Peace, The All-Encompassing Shield). It establishes an inviolable boundary around real estate, vehicles, commercial inventory, and vaults, repelling burglars, arson, and financial ruin.\n\nFor travelers and merchants, Tarqabin grants unfailing defense against robbery, highway hazards, and extortion. It guards premises during absence, neutralizing ill intent before harm occurs.",
    "secretHa": "Babban Sirrin Tsare Dukiya, Gida da Shaguna. Tarqabin yana tafiya ne da sunan Allah \"Al-Salam\" (Mai Aminci da Kariya). Shi ne ke kafa garkuwa mai karfi a kewaye da gida, mota, kayan kasuwanci, da akwatin kudi. Yana korar barayi, yan fashi, gobe, da asarar dukiya ta ba-zata.\n\nDomin masafira da yan kasuwa, Tarqabin yana ba da kariya daga hatsarin hanya da mutane marasa kyau. Yana tsare gida lokacin da babu kowa, yana sa makiya su kasa shiga gidan.",
    "recipeFr": "Protocole de Sécurisation Inviolable des Lieux & Véhicules :\n1. Timing : Le samedi matin au lever du soleil ou le mardi la nuit.\n2. Encensement : Brûlez du Mastic, de la Myrrhe et du Styrax (Mani).\n3. Calligraphie : Écrivez \"Tarqabin\" (تَرَقَّبٍ) 712 fois sur du parchemin ou une plaque métallique fine (cuivre/laiton). Encerclez avec Ayat al-Kursi.\n4. Récitation : Répétez le nom \"Tarqabin\" 712 fois en brûlant l'encens.\n5. Emplacement : Fixez le document ou la plaque au-dessus de la porte d'entrée principale, dans le coffre-fort de l'entreprise ou sous le siège du véhicule.",
    "recipeEn": "Inviolable Property & Vehicle Security Protocol:\n1. Timing: Saturday morning at sunrise or Tuesday night.\n2. Incense: Burn mastic resin, myrrh, and storax incense.\n3. Writing: Inscribe \"Tarqabin\" (تَرَقَّبٍ) 712 times on parchment paper or thin copper sheet. Encircle with Ayat al-Kursi.\n4. Recitation: Recite \"Tarqabin\" 712 times over the incense smoke.\n5. Placement: Affix above main entrance, inside business safe, or beneath vehicle driver seat.",
    "recipeHa": "Hanyar Tsare Gida, Shago ko Mota daga Barayi:\n1. Lokaci: Ranar Asabar da hantsi ko ranar Talata da daddare.\n2. Turare: Kona turaren Mastaki da Murr da Mani.\n3. Rubutu: Rubuta \"Tarqabin\" (تَرَقَّبٍ) sau 712 a takarda ko fatar karfe. Trace Ayatul Kursiyyu a kewaye.\n4. Karatu: Karanta \"Tarqabin\" sau 712 a kan turaren.\n5. Aje: Saka takardar a saman kofar gida, ko cikin akwatin kudi, ko a karkashin kujerar mota.",
    "invocationAr": "يا سَلَامُ سَلِّمْنِي وَمَالِي مِنْ كُلِّ طَارِقٍ بِحَقِّ تَرَقَّبٍ",
    "invocationTranslit": "Ya Salamu sallimnee wa malee min kulli tariqin bi-haqqi Tarqabin",
    "invocationFr": "Ô Paix, préserve-moi ainsi que mes biens et ma demeure de tout agresseur et intrus par la vérité du nom Tarqabin.",
    "invocationEn": "O Peace, safeguard me, my wealth, and my home from every intruder by Tarqabin.",
    "invocationHa": "Ya Mai Aminci, ka tsareni da dukiyata daga kowane makiyayi albarkacin Tarqabin.",
    "talsamCode": "٧١٢ ٨٨٨ ت ت ت 🏠",
    "wafq3x3": [
      ["241", "233", "238"],
      ["235", "237", "240"],
      ["236", "242", "234"]
    ]
  },
  {
    "id": 8,
    "nameAr": "بَرْهَشٍ",
    "nameTranslit": "Barhashin",
    "divineAttributeAr": "المُقْتَدِرُ العَزِيزُ",
    "divineAttributeFr": "Al-Muqtadir Al-Aziz (Le Tout-Puissant, Le Glorieux Vainqueur)",
    "divineAttributeEn": "Al-Muqtadir Al-Aziz (The Omnipotent, The Mighty Overcomer)",
    "divineAttributeHa": "Al-Muqtadir Al-Aziz (Mai Cikakken Iko, Mafi Mabayyanan Sarki)",
    "abjadWeight": 508,
    "lunarMansion": "Al-Nathrah (النثرة)",
    "element": "fire",
    "secretFr": "Grand Secret de la Victoire Décisive & Secours Fulgurant Contre l'Oppression. Barhashin vibre avec l'intensité des Noms de Domination Divins \"Al-Muqtadir Al-Aziz\". C'est la foudre spirituelle qui foudroie la tyrannie, brise les pièges des ennemis injustes et dissipe les crises existentielles majeures qui menacent de détruire la vie d'un croyant.\n\nLorsque toutes les portes semblent fermées et que l'oppression d'un ennemi puissant devient insupportable, la récitation de Barhashin déclenche une intervention céleste rapide. Il libère l'opérateur des blocages financiers ou sociaux causés par la jalousie noire et rétablit la justice avec un éclat saisissant.",
    "secretEn": "Grand Secret of Decisive Victory & Swift Relief from Tyranny. Barhashin vibrates with the force of \"Al-Muqtadir Al-Aziz\" (The Omnipotent, The Mighty). It acts as divine thunder that shatters oppression, dismantles hostile traps, and delivers swift rescue during critical life crises.\n\nWhen all doors appear locked and the pressure of powerful enemies becomes overwhelming, invoking Barhashin triggers rapid spiritual intervention. It frees the practitioner from financial stagnation caused by envy and restores justice with decisive power.",
    "secretHa": "Babban Sirrin Samun Nasara akan Azzalumai da Dauki na Gaggawa. Barhashin yana tafiya ne da sunan Allah \"Al-Muqtadir Al-Aziz\" (Mai Cikakken Iko, Glorious King). Shi ne tsawa na samaniya wanda ke ruguza azzalumai, yana lalata makircin makiya, kuma yana yaye matsi mai tsanani a rayuwa.\n\nLokacin da kofofi suka rufe kuma aka matsawa mutum da zalunci, karanta Barhashin yana kawo agaji na gaggawa daga Allah. Yana 'yanta mutum daga cikas na kudi ko na rayuwa da makiya suka kulla.",
    "recipeFr": "Protocole de Délivrance & Victoire Éclatante :\n1. Timing : Le mardi à l'aube après la prière du Fajr.\n2. Encensement : Brûlez de la Myrrhe, du Poivre noir et du Soufre purifié.\n3. Calligraphie : Écrivez \"Barhashin\" (بَرْهَشٍ) 508 fois à l'encre de safran sur une feuille rouge ou blanche.\n4. Récitation : Répétez le nom \"Barhashin\" 508 fois pendant 3 jours consécutifs en faisant face à la Qibla.\n5. Application : Portez la feuille pliée sur vous lors des confrontations ou récitez le nom avant de rencontrer un adversaire pour paralyser sa malveillance.",
    "recipeEn": "Relief & Decisive Triumph Protocol:\n1. Timing: Tuesday dawn following Fajr prayer.\n2. Incense: Burn myrrh resin, black pepper, and purified sulfur.\n3. Writing: Inscribe \"Barhashin\" (بَرْهَشٍ) 508 times on red or white paper using saffron ink.\n4. Recitation: Recite \"Barhashin\" 508 times daily for 3 consecutive days facing Qibla.\n5. Application: Carry the folded amulet during confrontations or recite before meeting opponents to neutralize hostility.",
    "recipeHa": "Hanyar Samun Nasara a Kan Azzalumai:\n1. Lokaci: Ranar Talata da asuba bayan sallar Fajr.\n2. Turare: Kona turaren Murr, Masoro da Ciki.\n3. Rubutu: Rubuta \"Barhashin\" (بَرْهَشٍ) sau 508 da za'afaran a takarda ja ko fara.\n4. Karatu: Karanta \"Barhashin\" sau 508 har kwana 3 a jera kana fuskantar Alkibla.\n5. Amfani: Rike takardar lokacin zuwa wurin shari'a ko wurin makiyayi domin ruguza fushinsa.",
    "invocationAr": "يا مُقْتَدِرُ انْصُرْنِي عَلَى مَنْ ظَلَمَنِي بِحَقِّ بَرْهَشٍ",
    "invocationTranslit": "Ya Muqtadiru unsurnee ala man dhalamanee bi-haqqi Barhashin",
    "invocationFr": "Ô Tout-Puissant, accorde-moi une victoire éclatante sur quiconque m'opprime ou me nuit par la vérité de Barhashin.",
    "invocationEn": "O Omnipotent One, grant me victory over whoever oppresses or harms me by Barhashin.",
    "invocationHa": "Ya Mai Cikakken Iko, ka taimakeni akan wanda ya zalunce ni albarkacin Barhashin.",
    "talsamCode": "٥٠٨ ٩٩٩ ب ب ب ⚔️",
    "wafq3x3": [
      ["172", "165", "170"],
      ["167", "169", "171"],
      ["168", "173", "166"]
    ]
  },
  {
    "id": 9,
    "nameAr": "غَلْمَشٍ",
    "nameTranslit": "Ghalmashin",
    "divineAttributeAr": "الأَوَّلُ الآخِرُ",
    "divineAttributeFr": "Al-Awwal Al-Akhir (Le Premier sans Début, Le Dernier sans Fin)",
    "divineAttributeEn": "Al-Awwal Al-Akhir (The First, The Last)",
    "divineAttributeHa": "Al-Awwal Al-Akhir (Na Farko, Na Karshe)",
    "abjadWeight": 1370,
    "lunarMansion": "Al-Tarf (الطرف)",
    "element": "water",
    "secretFr": "Grand Secret de l'Exorcisme des Lieux, Expulsion des Esprits Perturbateurs & Nettoyage Astral. Ghalmashin est associé aux Noms d'Éternité \"Al-Awwal Al-Akhir\" (Le Premier et le Dernier). C'est le marteau céleste utilisé par les maîtres pour purifier les maisons hantées, dissiper les entités astrales négatives, briser les blocages fonciers et chasser les djinns rebelles qui perturbent la paix d'un foyer.\n\nCe nom rétablit l'ordre vibratoire originel d'un espace souillé par des rituels sombres ou des évènements tragiques passés. Il ramène la sérénité, permet un sommeil réparateur sans cauchemars et attire la bénédiction divine sur la demeure.",
    "secretEn": "Grand Secret of Place Exorcism, Banishing Distracting Spirits & Space Cleansing. Ghalmashin aligns with \"Al-Awwal Al-Akhir\" (The First and The Last). It serves as a celestial hammer used to cleanse haunted premises, banish negative entities, dissolve land curses, and expel rebellious spirits disrupting household peace.\n\nThis name restores primordial energetic equilibrium to spaces polluted by negative history or dark practices, bringing serene atmosphere and restorative sleep.",
    "secretHa": "Babban Sirrin Korar Aljannu a Gida da Tsarkake Muhalli. Ghalmashin yana tafiya ne da sunayen Allah \"Al-Awwal Al-Akhir\" (Na Farko, Na Karshe). Shi ne guduma na samaniya da ake amfani da shi domin wanke gidan da aljannu suka damu, korar mugayen ruhanai, da tsarkake wuri daga tsohon asiri.\n\nYana maida daki da muhalli su kasance cikin aminci da tsarkake, yana sa ayi barci mai dadi ba tare da mafarki mai firgitarwa ba.",
    "recipeFr": "Protocole Canonique d'Exorcisme & Purification des Lieux :\n1. Timing : Le lundi ou le jeudi soir après la prière du Maghrib.\n2. Encensement : Brûlez de la Myrrhe, du Benjoin et de l'Oliban.\n3. Calligraphie : À l'encre de safran, écrivez \"Ghalmashin\" (غَلْمَشٍ) 1370 fois sur une assiette ou du papier.\n4. Solution : Dissolvez l'écriture dans un grand récipient contenant 7 litres d'eau de source et 3 poignées de gros sel de mer.\n5. Aspergement : Aspergez abondamment les sols, murs, coins et seuils de la maison durant 3 soirs d'affilée.",
    "recipeEn": "Canonical Exorcism & Space Purification Protocol:\n1. Timing: Monday or Thursday evening following Maghrib prayer.\n2. Incense: Burn myrrh resin, benzoin, and frankincense.\n3. Writing: Write \"Ghalmashin\" (غَلْمَشٍ) 1370 times using saffron ink on paper or plate.\n4. Solution: Dissolve into 7 liters of spring water mixed with 3 handfuls of coarse sea salt.\n5. Application: Sprinkle floors, walls, corners, and doorways for 3 consecutive nights.",
    "recipeHa": "Hanyar Korar Aljannu da Tsaftace Gida:\n1. Lokaci: Ranar Litinin ko Alhamis da daddare.\n2. Turare: Kona turaren Murr, Jawi da Luban.\n3. Rubutu: Rubuta \"Ghalmashin\" (غَلْمَشٍ) sau 1370 da za'afaran.\n4. Wanke: Wanke a lita 7 na ruwa da gishiri mai yawa.\n5. Yayafawa: Yayafa a kasan daki, bango, da kusurwoyin gida har tsawon daren kwana 3.",
    "invocationAr": "يا أَوَّلُ يا آخِرُ أُخْرُجْ كُلَّ شَيْطَانٍ مَرِيدٍ بِحَقِّ غَلْمَشٍ",
    "invocationTranslit": "Ya Awwalu ya Akhiru ukhruj kulla shaytanin mareedin bi-haqqi Ghalmashin",
    "invocationFr": "Ô Premier, ô Dernier, chasse tout esprit perturbateur et purifie cet espace par la vérité du nom Ghalmashin.",
    "invocationEn": "O First, O Last, expel every disturbing spirit and cleanse this space by Ghalmashin.",
    "invocationHa": "Ya Na Farko, Ya Na Karshe, ka fitar da kowane shaidan mai tawaye albarkacin Ghalmashin.",
    "talsamCode": "١٣٧٠ ٣٣٣ غ غ غ 🌀",
    "wafq3x3": [
      ["461", "452", "457"],
      ["454", "456", "460"],
      ["455", "462", "453"]
    ]
  },
  {
    "id": 10,
    "nameAr": "خَوْطِيرٍ",
    "nameTranslit": "Khutirin",
    "divineAttributeAr": "القَوِيُّ المَتِينُ",
    "divineAttributeFr": "Al-Qawiyy Al-Mateen (Le Fort Inébranlable, Le Roc Inlassable)",
    "divineAttributeEn": "Al-Qawiyy Al-Mateen (The Strong, The Firm Rock)",
    "divineAttributeHa": "Al-Qawiyy Al-Mateen (Mafi Karfi, Mai Kafuwa)",
    "abjadWeight": 825,
    "lunarMansion": "Al-Jabhah (الجبهة)",
    "element": "earth",
    "secretFr": "Grand Secret de l'Autorité Naturelle, Volonté d'Acier & Inébranlabilité Spirituelle. Khutirin vibre sous la fréquence de \"Al-Qawiyy Al-Mateen\" (Le Fort, Le Inébranlable). Ce nom insuffle une puissance morale d'une fermeté colossale, élimine la paresse, la procrastination, l'hésitation maladive et la peur de l'échec.\n\nIl confère au praticien une prestance majestueuse, renforce sa discipline personnelle et lui permet de mener à bien des projets gigantesques sans faiblir. Face aux obstacles redoutables, Khutirin agit comme une enclume spirituelle qui absorbe les chocs et renvoie une force irrésistible.",
    "secretEn": "Grand Secret of Natural Authority, Iron Willpower & Spiritual Steadfastness. Khutirin resonates with \"Al-Qawiyy Al-Mateen\" (The Strong, The Firm). It infuses heroic moral endurance, eradicates procrastination, hesitation, and fear of failure.\n\nIt endows the practitioner with commanding presence, reinforces personal discipline, and enables the completion of monumental tasks without weakness. Facing severe trials, Khutirin acts as a spiritual anvil absorbing shocks and projecting power.",
    "secretHa": "Babban Sirrin Karfin Zuciya, Kwarjini da Kauda Kasala. Khutirin yana tafiya ne da sunayen Allah \"Al-Qawiyy Al-Mateen\" (Mafi Karfi, Mai Kafuwa). Yana cika zuciya da karfi na ban mamaki, yana kauda kasala, tsoro, da fargabar gazawa.\n\nYana ba mutum kwarjini na shugabanci, yana karfafa juriya da natsuwa, kuma yana sa a kammala ayyuka masu nauyi cikin nasara. Idan aka fuskanci babban cikas, Khutirin yana ba zuciya tsaiwa mai karfi.",
    "recipeFr": "Protocole de Volonté Inébranlable & Charisme d'Autorité :\n1. Timing : Le mardi matin au lever du soleil.\n2. Encensement : Brûlez de l'Oliban et du Mastic.\n3. Calligraphie : Écrivez \"Khutirin\" (خَوْطِيرٍ) 825 fois à l'encre de safran sur papier.\n4. Récitation : Répétez le nom 825 fois chaque matin durant 7 jours.\n5. Application : Portez le talisman au bras droit ou dans votre poche.",
    "recipeEn": "Iron Willpower & Command Charisma Protocol:\n1. Timing: Tuesday morning at sunrise.\n2. Incense: Burn frankincense and mastic resin.\n3. Writing: Write \"Khutirin\" (خَوْطِيرٍ) 825 times with saffron ink.\n4. Recitation: Recite 825 times every morning for 7 days.\n5. Application: Carry on right arm or chest pocket.",
    "recipeHa": "Hanyar Karfafa Volonte da Samun Kwarjini:\n1. Lokaci: Ranar Talata da hantsi.\n2. Turare: Kona turaren Luban da Mastaki.\n3. Rubutu: Rubuta \"Khutirin\" (خَوْطِيرٍ) sau 825 da za'afaran.\n4. Karatu: Karanta sau 825 kowace safe har kwana 7.\n5. Amfani: Daure a hannun dama ko a aljihu.",
    "invocationAr": "يا قَوِيُّ يا مَتِينُ قَوِّ عَزِيمَتِي وَحُصْنِي بِحَقِّ خَوْطِيرٍ",
    "invocationTranslit": "Ya Qawiyyu ya Mateenu qawwi azeematei wa husnee bi-haqqi Khutirin",
    "invocationFr": "Ô Fort, ô Inébranlable, fortifie ma résolution, mon esprit et ma protection par la vérité de Khutirin.",
    "invocationEn": "O Strong One, O Firm One, strengthen my resolve, spirit, and defense by Khutirin.",
    "invocationHa": "Ya Mafi Karfi, Ya Mai Kafuwa, ka karfafa niyetana da kariyata albarkacin Khutirin.",
    "talsamCode": "٨٢٥ ٦٦٦ خ خ خ 🏰",
    "wafq3x3": [
      ["278", "271", "276"],
      ["273", "275", "277"],
      ["274", "279", "272"]
    ]
  },
  {
    "id": 11,
    "nameAr": "قَلْنَهُودٍ",
    "nameTranslit": "Qalanhoodin",
    "divineAttributeAr": "السَّمِيعُ البَصِيرُ",
    "divineAttributeFr": "Al-Sami' Al-Basir (L'Audient, Le Clairvoyant Suprême)",
    "divineAttributeEn": "Al-Sami' Al-Basir (The All-Hearing, The All-Seeing)",
    "divineAttributeHa": "Al-Sami' Al-Basir (Mai Ji, Mai Gani)",
    "abjadWeight": 285,
    "lunarMansion": "Al-Zubrah (الزبرة)",
    "element": "air",
    "secretFr": "Grand Secret de l'Exaucement Éclair, Éveil de la Vision Spirituelle (Basirah) & Dévoilement des Secrets. Qalanhoodin correspond aux attributs d'Audition et de Vision Divines \"Al-Sami' Al-Basir\". Ce nom possède la vertu d'accélérer la réponse aux invocations sincères et de percer les voiles de la tromperie.\n\nIl aiguise la perception extrasensorielle, développe l'intuition spirituelle et permet de discerner la vérité cachée derrière les apparences flatteuses ou mensongères.",
    "secretEn": "Grand Secret of Swift Answered Prayers, Awakening Spiritual Vision & Unveiling Mysteries. Qalanhoodin embodies \"Al-Sami' Al-Basir\" (The All-Hearing, The All-Seeing). It accelerates answered prayers and pierces illusionary veils.\n\nIt sharpens intuitive perception, unlocks inner spiritual vision (Basirah), and exposes hidden truths behind deceitful appearances.",
    "secretHa": "Babban Sirrin Amsar Addu'a da Sauri da Bude Idon Basira. Qalanhoodin yana wakiltar sunayen Allah \"Al-Sami' Al-Basir\" (Mai Ji, Mai Gani). Yana sa addu'a ta amsu da sauri kuma yana gane boyayyen sirri.\n\nYana bude idon basira na zuciya, yana gane kage ko yaudara, kuma yana nuna gaskiyar lamari.",
    "recipeFr": "Protocole pour l'Exaucement Immédiat :\n1. Timing : La nuit durant le dernier tiers (entre 2h et 4h du matin).\n2. Encensement : Brûlez du Benjoin pur.\n3. Calligraphie : Écrivez \"Qalanhoodin\" (قَلْنَهُودٍ) 285 fois sur papier.\n4. Récitation : Répétez le nom 285 fois suivi de votre invocation sincère.\n5. Conservation : Gardez le document dans votre livre de prière.",
    "recipeEn": "Immediate Prayer Answer Protocol:\n1. Timing: Last third of the night (2 AM to 4 AM).\n2. Incense: Burn pure benzoin.\n3. Writing: Write \"Qalanhoodin\" (قَلْنَهُودٍ) 285 times.\n4. Recitation: Recite 285 times followed by personal prayer.\n5. Application: Keep inside prayer book.",
    "recipeHa": "Hanyar Amsar Addu'a da Sauri:\n1. Lokaci: Karshen dare (tsakanin karfe 2 zuwa 4 na dare).\n2. Turare: Kona turaren Jawi.\n3. Rubutu: Rubuta \"Qalanhoodin\" (قَلْنَهُودٍ) sau 285.\n4. Karatu: Karanta sau 285 sannan yi addu'arka.\n5. Aje: Saka a littafin addu'a.",
    "invocationAr": "يا سَمِيعُ يا بَصِيرُ اسْتَجِبْ دُعَائِي بِحَقِّ قَلْنَهُودٍ",
    "invocationTranslit": "Ya Samee'u ya Baseeru istajib du'a'ee bi-haqqi Qalanhoodin",
    "invocationFr": "Ô Audient, ô Clairvoyant, écoute mon appel et exauce ma prière par la vérité du nom Qalanhoodin.",
    "invocationEn": "O All-Hearing, O All-Seeing, hear my cry and answer my prayer by Qalanhoodin.",
    "invocationHa": "Ya Mai ji, Ya Mai gani, ka amsa addu'ata albarkacin Qalanhoodin.",
    "talsamCode": "٢٨٥ ٧٧٧ ق ق ق 👁️",
    "wafq3x3": [
      ["98", "91", "96"],
      ["93", "95", "97"],
      ["94", "99", "92"]
    ]
  },
  {
    "id": 12,
    "nameAr": "بَرْشَانٍ",
    "nameTranslit": "Barshanin",
    "divineAttributeAr": "المُحِيطُ القَادِرُ",
    "divineAttributeFr": "Al-Muheit Al-Qadir (Le Tout-Englobant, Le Protecteur des Terres)",
    "divineAttributeEn": "Al-Muheit Al-Qadir (The All-Encompassing, Guardian of Lands)",
    "divineAttributeHa": "Al-Muheit (Mai Kewaye da Komai da Kariyata)",
    "abjadWeight": 553,
    "lunarMansion": "Al-Sarfah (الصرفة)",
    "element": "water",
    "secretFr": "Grand Secret de la Bénédiction des Récoltes, Fertilité des Terres, Protection du Magasin & Abondance des Réserves. Barshanin est rattaché à \"Al-Muheit Al-Qadir\" (Le Tout-Englobant). Ce nom possède la vertu spirituelle d'infuser la fertilité divine dans les sols arides, de protéger les plantations contre la sécheresse et la vermine, et de préserver les stocks commerciaux de la détérioration et des pertes matérielles.\n\nSur le plan spirituel, Barshanin établit un périmètre d'abondance autour du foyer ou du lieu de commerce, attirant les subsistances légitimes et fermant la porte aux échecs financiers.",
    "secretEn": "Grand Secret of Agricultural Blessing, Soil Fertility, Store Protection & Abundant Inventory. Barshanin correlates with \"Al-Muheit Al-Qadir\" (The All-Encompassing). This name carries the spiritual virtue of infusing divine fertility into dry land, protecting crops from drought and pests, and preserving commercial stock from decay and theft.\n\nOn a spiritual plane, Barshanin establishes an envelope of abundance around the home or business, attracting lawful sustenance while locking out financial ruin.",
    "secretHa": "Babban Sirrin Albarkatar Gona, Kyautata Kasa, Kariyar Shago da Wadatar Dukiya. Barshanin yana tafiya ne da sunan Allah \"Al-Muheit\" (Mai Kewaye da Komai). Wannan suna yana da sirrin saukar da albarka a kan gona, kiyaye amfanin gona daga fari da kwari, da kare dukiyar kasuwanci daga asara.\n\nA fannin ruhani, Barshanin yana kewaye gida ko shago da katangar arziqi na samaniya, yana janyo halak din samu kuma yana toshe kofar fatarau.",
    "recipeFr": "Protocole de Bénédiction & Fertilité des Domaines :\n1. Timing : Le vendredi matin au lever du soleil (Heure de Vénus).\n2. Encensement : Brûlez de la résine de Mastic et du Benjoin blanc.\n3. Calligraphie : Écrivez \"Barshanin\" (بَرْشَانٍ) 553 fois à l'encre de safran et d'eau de rose sur du parchemin ou papier pur.\n4. Récitation : Répétez le nom 553 fois sur une grande jarre d'eau de source.\n5. Aspergement : Arrosez doucement les quatre coins de votre terrain, gona ou magasin.",
    "recipeEn": "Land Blessing & Store Fertility Protocol:\n1. Timing: Friday morning at sunrise (Hour of Venus).\n2. Incense: Burn mastic resin and white benzoin.\n3. Writing: Write \"Barshanin\" (بَرْشَانٍ) 553 times using saffron ink and rosewater on clean paper.\n4. Recitation: Recite 553 times over a jar of spring water.\n5. Application: Gently sprinkle the water at the four corners of your land or business venue.",
    "recipeHa": "Hanyar Albarkaci Gona da Kariyar Shago:\n1. Lokaci: Ranar Juma'a da hantsi lokacin fitar rana.\n2. Turare: Kona turaren Mastaki da Luban fari.\n3. Rubutu: Rubuta \"Barshanin\" (بَرْشَانٍ) sau 553 da za'afaran da ruwan wardi.\n4. Karatu: Karanta sau 553 a kwanon ruwan mazauna.\n5. Yayafawa: Yayafa ruwan a kusurwoyi hudu na gona ko shagonku.",
    "invocationAr": "يا مُحِيطُ يا قَادِرُ بَارِكْ لِي فِي رِزْقِي وَزَرْعِي وَتِجَارَتِي بِحَقِّ بَرْشَانٍ",
    "invocationTranslit": "Ya Muheetu ya Qadeeru barik lee fee rizqee wa zar'ee wa tijaratee bi-haqqi Barshanin",
    "invocationFr": "Ô Tout-Englobant, ô Omnipotent, bénis ma subsistance, fertilise mes cultures et fais prospérer mon commerce par la vérité sacrée de Barshanin.",
    "invocationEn": "O All-Encompassing, O All-Powerful, bless my provision, fertilize my crops, and prosper my commerce by the sacred truth of Barshanin.",
    "invocationHa": "Ya Mai kewaye da komai, Ya Mai Iko, ka albarkaci arzikina da amfanin gonata da kasuwancina albarkacin Barshanin.",
    "talsamCode": "٥٥٣ ١١١ ب ب ب 🌾",
    "wafq3x3": [
      ["188", "180", "185"],
      ["182", "184", "187"],
      ["183", "189", "181"]
    ]
  },
  {
    "id": 13,
    "nameAr": "كِظَهِيرٍ",
    "nameTranslit": "Kathirin",
    "divineAttributeAr": "المُتَعَالِي الحَكِيمُ",
    "divineAttributeFr": "Al-Muta'ali Al-Hakim (Le Sublimement Élevé, Le Juste Arbitre)",
    "divineAttributeEn": "Al-Muta'ali Al-Hakim (The Supremely Exalted, The Wise Judge)",
    "divineAttributeHa": "Al-Muta'ali (Mafi Daukaka da Hikima)",
    "abjadWeight": 1135,
    "lunarMansion": "Al-Awwa (العواء)",
    "element": "fire",
    "secretFr": "Grand Secret du Triomphe Judiciaire, Démantèlement des Calomnies, Restauration de l'Honneur & Victoire sur les Oppresseurs. Kathirin s'aligne sur l'attribut divin \"Al-Muta'ali Al-Hakim\". Il brise les complots juridiques malveillants, réfutant les faux témoignages et faisant éclater l'innocence dans les prétoires.\n\nIl neutralise l'arrogance des adversaires iniques et rétablit l'équité pour celui qui subit une injustice caractérisée.",
    "secretEn": "Grand Secret of Legal Victory, Overturning Slander, Restoring Honor & Triumph over Oppressors. Kathirin aligns with \"Al-Muta'ali Al-Hakim\". It shatters malicious court conspiracies, refutes false testimony, and exposes innocence before tribunals.\n\nIt neutralizes enemy arrogance and enforces divine equity for those suffering unlawful oppression.",
    "secretHa": "Babban Sirrin Samun Nasara a Shari'a, Ruguza Kage da Neman Adalci. Kathirin yana tafiya ne da sunan Allah \"Al-Muta'ali Al-Hakim\" (Mafi Daukaka). Yana karya kage da shaidar zur a court ko gaban alƙali, yana nuna gaskiya da kubutar da wanda aka zalunta.\n\nYana murqushe takama ta masu zalunci kuma yana maidawa mutum mutuncinsa da daukakarsa.",
    "recipeFr": "Protocole de Victoire en Justice & Démantèlement des Pièges :\n1. Timing : Le vendredi avant la prière congrégationnelle du Jumu'ah.\n2. Encensement : Brûlez du Mastic et du Bois d'Aloès.\n3. Calligraphie : Écrivez \"Kathirin\" (كِظَهِيرٍ) 1135 fois à l'encre de safran pur.\n4. Récitation : Répétez le nom 1135 fois juste après la prière du vendredi.\n5. Port mystique : Gardez la feuille pliée dans un étui sur votre poitrine lors des audiences.",
    "recipeEn": "Legal Victory & Conspiracy Overturn Protocol:\n1. Timing: Friday prior to Jumu'ah congregational prayer.\n2. Incense: Burn mastic and aloeswood.\n3. Writing: Write \"Kathirin\" (كِظَهِيرٍ) 1135 times with pure saffron ink.\n4. Recitation: Recite the name 1135 times immediately following Friday prayer.\n5. Application: Carry the folded talisman near your chest during legal hearings.",
    "recipeHa": "Hanyar Nasara a Shari'a da Ruguza Zargin Karya:\n1. Lokaci: Ranar Juma'a kafin salla.\n2. Turare: Kona Mastaki da Oudh.\n3. Rubutu: Rubuta \"Kathirin\" (كِظَهِيرٍ) sau 1135 da tawada ta za'afaran.\n4. Karatu: Karanta sau 1135 nan take bayan an idar da sallar Juma'a.\n5. Amfani: Saka takardar a aljihu ko sanya a wuya yayin gudanar da shari'a.",
    "invocationAr": "يا مُتَعَالِي يا حَكِيمُ انْصُرِ الحَقَّ وَأَزْهِقِ البَاطِلَ وَابْطِلْ كَيْدَ الظَّالِمِينَ بِحَقِّ كِظَهِيرٍ",
    "invocationTranslit": "Ya Muta'alee ya Hakeemu unsur al-haqqa wa azhiq al-batila wa abtil kayda ad-dalimeena bi-haqqi Kathirin",
    "invocationFr": "Ô Sublimement Élevé, ô Sage Arbitre, fais triompher le droit, anéantis le faux et brise les pièges des oppresseurs par la vérité de Kathirin.",
    "invocationEn": "O Supremely Exalted, O Wise Judge, champion the truth, vanish falsehood, and shatter the plots of wrongdoers by Kathirin.",
    "invocationHa": "Ya Mafi Daukaka, Ya Mai Hikima, ka ba gaskiya nasara, ka ruguza karya, ka warware kaidin azzalumai albarkacin Kathirin.",
    "talsamCode": "١١٣٥ ١١١ ك ك ك ⚖️",
    "wafq3x3": [
      ["379", "374", "382"],
      ["384", "378", "373"],
      ["372", "383", "380"]
    ]
  },
  {
    "id": 14,
    "nameAr": "نَمُوشَلَخٍ",
    "nameTranslit": "Namushalakhin",
    "divineAttributeAr": "العَزِيزُ الحَكِيمُ",
    "divineAttributeFr": "Al-Aziz Al-Hakim (Le Puissant Sage, Le Pacificateur de l'Âme)",
    "divineAttributeEn": "Al-Aziz Al-Hakim (The Almighty, Wise Soul Pacifier)",
    "divineAttributeHa": "Al-Aziz Al-Hakim (Mai Mabayyanan Iko da Hikima)",
    "abjadWeight": 1086,
    "lunarMansion": "Al-Simak (السماك)",
    "element": "air",
    "secretFr": "Grand Secret de la Sérénité Intérieure, Curation de l'Anxiété Sévere, Extinction des Obsessions (Waswas) & Paix Familiale. Namushalakhin insuffle une quiétude inébranlable dans le cœur troublé. Il guérit la détresse psychologique, dissout la peur irraisonnée et dissipe les cauchemars récurrents.\n\nIl est considéré par les sages comme la clé de la délivrance contre les chocs émotionnels et les crises d'angoisse profondes.",
    "secretEn": "Grand Secret of Inner Serenity, Severe Anxiety Relief, Quenching Waswas (Obsessions) & Family Harmony. Namushalakhin breathes unshakeable stillness into a troubled heart. It heals emotional distress, dissolves irrational fear, and dispels recurring nightmares.\n\nMaster sages regard this name as the master key to liberation from emotional trauma and deep panic attacks.",
    "secretHa": "Babban Sirrin Natsuwar Zuciya, Maganin Fargaba da Waswasi da Kwanciyar Hankali. Namushalakhin yana hura natsuwa mara girgiza a cikin zuciya mai damuwa. Yana warkar da razana, yana soke tsoro mara dalili, kuma yana korar mafarkai marasa kyau.\n\nMasana sirri suna daukar wannan suna a matsayin mukullin samun lafiyar hankali da samun ruhi mai dadi.",
    "recipeFr": "Protocole de Sérénité Mentale & Curation du Cœur :\n1. Timing : Le soir juste avant le coucher.\n2. Encensement : Brûlez du Santal doux et de la Myrrhe.\n3. Calligraphie : Écrivez \"Namushalakhin\" (نَمُوشَلَخٍ) 1086 fois sur du papier blanc pur.\n4. Récitation : Répétez le nom 1086 fois sur un bol d'eau distillée ou d'eau de fleur d'oranger.\n5. Consommation : Buvez une gorgée chaque soir avant de dormir pendant 7 jours consécutifs.",
    "recipeEn": "Mental Peace & Emotional Healing Protocol:\n1. Timing: Evening right before sleeping.\n2. Incense: Burn sweet sandalwood and myrrh.\n3. Writing: Write \"Namushalakhin\" (نَمُوشَلَخٍ) 1086 times on pure white paper.\n4. Recitation: Recite the name 1086 times over a bowl of distilled water or orange blossom water.\n5. Application: Drink a glass every night before sleep for 7 consecutive days.",
    "recipeHa": "Hanyar Samun Natsuwar Zuciya da Warkar da Tsoro:\n1. Lokaci: Daddare kafin barci.\n2. Turare: Kona sandalko da turaren Mirra.\n3. Rubutu: Rubuta \"Namushalakhin\" (نَمُوشَلَخٍ) sau 1086 a farar takarda.\n4. Karatu: Karanta sau 1086 a kwanon ruwan sanyi ko ruwan fure.\n5. Amfani: Sha kwano daya kowane daddare kafin barci har tsawon kwana 7.",
    "invocationAr": "يا عَزِيزُ يا حَكِيمُ أَنْزِلِ السَّكِينَةَ فِي قَلْبِي وَاطْرُدِ الوَسْوَاسَ وَالهَمَّ عَنِّي بِحَقِّ نَمُوشَلَخٍ",
    "invocationTranslit": "Ya Azeezu ya Hakeemu anzil as-sakeenata fee qalbee wa utrud al-waswasa wa al-hamma annee bi-haqqi Namushalakhin",
    "invocationFr": "Ô Puissant, ô Sage, fais descendre une sérénité inébranlable dans mon cœur, chasse le doute et dissipe l'anxiété par la vérité de Namushalakhin.",
    "invocationEn": "O Almighty, O Wise, send down unshakeable tranquility into my heart, drive away doubt and anxiety by Namushalakhin.",
    "invocationHa": "Ya Mai Iko, Ya Mai Hikima, ka saukar da natsuwa a zuciyata, ka nisanta waswasi da damuwa daga gare ni albarkacin Namushalakhin.",
    "talsamCode": "١٠٨٦ ٥٥٥ ن ن ن 🕊️",
    "wafq3x3": [
      ["363", "358", "365"],
      ["367", "362", "357"],
      ["356", "366", "364"]
    ]
  },
  {
    "id": 15,
    "nameAr": "بَرَهَيُولا",
    "nameTranslit": "Barhayula",
    "divineAttributeAr": "الخَبِيرُ العَلِيمُ",
    "divineAttributeFr": "Al-Khabir Al-Alim (L'Informé, Le Connaisseur des Mystères Occultés)",
    "divineAttributeEn": "Al-Khabir Al-Alim (The All-Aware, Knower of Unseen Mysteries)",
    "divineAttributeHa": "Al-Khabir Al-Alim (Mai Labari, Mai Sani da Boyayyun Abubuwa)",
    "abjadWeight": 261,
    "lunarMansion": "Al-Ghafr (الغفر)",
    "element": "water",
    "secretFr": "Grand Secret des Songes Véridiques (Ru'ya Sadiqa), Istikhara Céleste, Clairvoyance Spirituelle & Révélation des Choses Cachées. Barhayula permet d'ouvrir le canal des songes prophétiques et d'obtenir des réponses claires pendant le sommeil sur toute question complexe.\n\nIl purifie l'esprit des voiles terrestres et permet au disciple d'entrevoir les événements futurs et les vérités dissimulées.",
    "secretEn": "Grand Secret of Truthful Dream Visions (Ru'ya Sadiqa), Celestial Istikhara, Spiritual Clairvoyance & Unveiling Hidden Truths. Barhayula unlocks prophetic dream channels and delivers unequivocal spiritual guidance during sleep concerning complex life decisions.\n\nIt purifies the mind from earthly noise, allowing the seeker to perceive unseen events and veiled realities.",
    "secretHa": "Babban Sirrin Ganin Mafarki na Gaskiya (Ru'ya Sadiqa), Istikhara ta Samaniya da Bayyana Boyayyen Lamari. Barhayula yana bude hanyar ganin shiriya ta gaskiya a mafarki da samun amsoshi a bayyane akan tambayoyi masu wuyar fahimta.\n\nYana tsarkake zuciya daga duhun duniya, yana bama dan adam ikon hango gaskiyar abin da ke boye.",
    "recipeFr": "Protocole de Vision Céleste en Songe (Istikhara Divine) :\n1. Timing : Avant de se coucher en état d'ablution accomplie (Wudu).\n2. Encensement : Brûlez du Benjoin pur (Luban Jawi).\n3. Récitation : Répétez \"Barhayula\" (بَرَهَيُولا) 261 fois avec une intention claire.\n4. Calligraphie : Écrivez le nom 7 fois sur la paume de votre main droite à l'encre de safran.\n5. Posture : Endormez-vous allongé sur le côté droit en faisant face à la Qibla.",
    "recipeEn": "Celestial Dream Vision Protocol (Divine Istikhara):\n1. Timing: Immediately before sleep in total ritual purity (Wudu).\n2. Incense: Burn pure frankincense (Luban Jawi).\n3. Recitation: Recite \"Barhayula\" (بَرَهَيُولا) 261 times with focused intention.\n4. Writing: Write the name 7 times on your right palm using saffron ink.\n5. Posture: Sleep on your right side facing the Qibla direction.",
    "recipeHa": "Hanyar Istikhara da Ganin Mafarki Mai Kyau:\n1. Lokaci: Kafin barci a kan cikakken tsarki (Alwala).\n2. Turare: Kona turaren Luban Jawi.\n3. Karatu: Karanta \"Barhayula\" (بَرَهَيُولا) sau 261 da niyya a bayyane.\n4. Rubutu: Rubuta sunan sau 7 a tafarin hannunka na dama da za'afaran.\n5. Kwanciya: Kwanta a bangaren dama kana fuskantar Qibla.",
    "invocationAr": "يا خَبِيرُ يا عَلِيمُ أَرِنِي الحَقَّ حَقّاً فِي مَنَامِي وَاكْشِفْ لِي عَنِ المَسْتُورِ بِحَقِّ بَرَهَيُولا",
    "invocationTranslit": "Ya Khabeeru ya Aleemu arinee al-haqqa haqqan fee manamee wakshif lee an al-mastoori bi-haqqi Barhayula",
    "invocationFr": "Ô Informé, ô Omniscient, dévoile-moi la vérité pure dans mon sommeil et révèle-moi ce qui est caché par la vérité de Barhayula.",
    "invocationEn": "O All-Aware, O All-Knowing, show me pure truth in my dreams and unveil what is hidden by Barhayula.",
    "invocationHa": "Ya Mai labari, Ya Mai sani, ka nuna min gaskiya a mafarkina, ka bayyana min abin da ke boye albarkacin Barhayula.",
    "talsamCode": "٢٦١ ٧٧٧ ب ب ب 🌙",
    "wafq3x3": [
      ["88", "83", "90"],
      ["92", "87", "82"],
      ["81", "91", "89"]
    ]
  },
  {
    "id": 16,
    "nameAr": "بَشْكِيلَخٍ",
    "nameTranslit": "Bashkilakhin",
    "divineAttributeAr": "الرَّؤُوفُ الرَّحِيمُ",
    "divineAttributeFr": "Al-Raoof Al-Rahim (Le Compatissant, Le Libérateur des Dettes Étouffantes)",
    "divineAttributeEn": "Al-Raoof Al-Rahim (The Compassionate, Deliverer from Heavy Debt)",
    "divineAttributeHa": "Al-Raoof Al-Rahim (Mai Tausayi da Rahama da Biyan Bashi)",
    "abjadWeight": 1362,
    "lunarMansion": "Al-Zubana (الزبانى)",
    "element": "earth",
    "secretFr": "Grand Secret du Soulagement des Dettes Étouffantes, Secours Financier Imprévu & Allègement des Fardeaux. Bashkilakhin est le nom de compassion divine qui dénoue les crises économiques graves. Il adoucit la dureté des créanciers, génère des moyens financiers inattendus et sauve de l'endettement ruineux.\n\nIl est réputé ouvrir les voies financières fermées et apporter la providence divine là où l'on n'espérait plus aucun secours.",
    "secretEn": "Grand Secret of Debt Deliverance, Unexpected Financial Relief & Easing Heavy Burdens. Bashkilakhin is the divine name of compassion that unlocks severe economic paralysis. It softens hardhearted creditors, generates unexpected financial means, and prevents ruinous debt.\n\nIt is renowned for opening blocked financial channels and delivering divine providence when all hope seems lost.",
    "secretHa": "Babban Sirrin Biyan Bashi Mai Nauyi, Samun Sauki na Kudi da Yaye Kunci. Bashkilakhin yana tafiya ne da tausayi na samaniya wanda yake bude kulle-kullen tattalin arziki. Yana tausasa zuciyar masu bashi, yana kawo hanyoyin kudi na ba-zata, kuma yana ceto daga fatarau.\n\nYana bude hanyoyin arziqi da aka toshe kuma yana kawo dauki lokacin da aka caye tsammani.",
    "recipeFr": "Protocole de Libération des Dettes & Providence :\n1. Timing : Le dimanche matin à l'aube (Heure du Soleil).\n2. Encensement : Brûlez du Mastic et du Coriandre sec.\n3. Calligraphie : Écrivez \"Bashkilakhin\" (بَشْكِيلَخٍ) 1362 fois à l'encre de safran.\n4. Récitation : Répétez le nom 1362 fois après la prière de l'Isha pendant 7 nuits consécutives.\n5. Aumône : Donnez une sadaka discrète aux pauvres le 7ème jour.",
    "recipeEn": "Debt Deliverance & Financial Relief Protocol:\n1. Timing: Sunday morning at dawn (Hour of the Sun).\n2. Incense: Burn mastic and dried coriander.\n3. Writing: Write \"Bashkilakhin\" (بَشْكِيلَخٍ) 1362 times using saffron ink.\n4. Recitation: Recite 1362 times after Isha prayer for 7 consecutive nights.\n5. Alms: Give quiet charity to the poor on the 7th day.",
    "recipeHa": "Hanyar Biyan Bashi da Samun Daukin Kudi:\n1. Lokaci: Lahadi da asuba lokacin fitar rana.\n2. Turare: Kona Mastaki da kuryar kosan koli.\n3. Rubutu: Rubuta \"Bashkilakhin\" (بَشْكِيلَخٍ) sau 1362 da za'afaran.\n4. Karatu: Karanta sau 1362 bayan sallar Isha har kwana 7 a jere.\n5. Sadaka: Yi sadaka ta boye ga mabukata a rana ta 7.",
    "invocationAr": "يا رَؤُوفُ يا رَحِيمُ اقْضِ دَيْنِي وَفَرِّجْ هَمِّي وَايَسِّرْ رِزْقِي بِحَقِّ بَشْكِيلَخٍ",
    "invocationTranslit": "Ya Raoofu ya Raheemu iqdi daynee wa farrij hammee wa yassir rizqee bi-haqqi Bashkilakhin",
    "invocationFr": "Ô Compatissant, ô Miséricordieux, règle mes dettes, dissipe mon souci et facilite ma subsistance par la vérité de Bashkilakhin.",
    "invocationEn": "O Compassionate, O Merciful, settle my debts, dispel my distress, and ease my provision by Bashkilakhin.",
    "invocationHa": "Ya Mai Tausayi, Ya Mai Rahama, ka biya min bashina, ka yaye damuwata, ka saukaka arzikina albarkacin Bashkilakhin.",
    "talsamCode": "١٣٦٢ ٤٤٤ ب ب ب 💰",
    "wafq3x3": [
      ["455", "450", "457"],
      ["459", "454", "449"],
      ["448", "458", "456"]
    ]
  },
  {
    "id": 17,
    "nameAr": "قَزْمَزٍ",
    "nameTranslit": "Qazmazin",
    "divineAttributeAr": "المُعِزُّ المَانِعُ",
    "divineAttributeFr": "Al-Mu'izz Al-Mani' (Le Donneur de Dignité, Le Protecteur du Prestige)",
    "divineAttributeEn": "Al-Mu'izz Al-Mani' (Bestower of Honor, Guardian of Reputation)",
    "divineAttributeHa": "Al-Mu'izz Al-Mani' (Mai Ba da Daukaka da Kare Mutunci)",
    "abjadWeight": 157,
    "lunarMansion": "Al-Iklil (الإكليل)",
    "element": "fire",
    "secretFr": "Grand Secret de la Restauration de l'Honneur, Dignité Protégée, Prestige Social & Immunité contre l'Humiliation. Qazmazin écarte la honte, protège le rang social contre les complots de dégradation et accorde une vénération naturelle auprès des hommes.\n\nIl entoure la réputation de l'invocateur d'une armure spirituelle impénétrable aux médisances et aux attaques d'orgueil.",
    "secretEn": "Grand Secret of Restoring Honor, Shielding Reputation, Social Prestige & Immunity from Humiliation. Qazmazin wards off public shame, guards career rank against sabotage, and grants natural veneration among people.\n\nIt envelopes the seeker's reputation in a spiritual shield impervious to slander and arrogant attacks.",
    "secretHa": "Babban Sirrin Kare Mutunci, Daukaka da Martaba a Idon Jama'a da Kariyar Humiliation. Qazmazin yana korar wulakanci, yana tsare matsayi da mutuncin mutum daga zagon kasa, kuma yana sanya kwarjini a idon mutane.\n\nYana kewaye martabar mutum da garkuwar samaniya wadda ba zata huje da sharri ko kagi ba.",
    "recipeFr": "Protocole de Dignité & Protection du Prestige :\n1. Timing : Chaque matin après la prière du Fajr (Heure de Mars/Soleil).\n2. Encensement : Brûlez du Santal rouge et de l'Encens mâle.\n3. Calligraphie : Écrivez \"Qazmazin\" (قَزْمَزٍ) 157 fois sur un morceau de soie blanche.\n4. Récitation : Répétez le nom 157 fois chaque matin avec ferveur.\n5. Conservation : Portez le tissu de soie sur votre bras droit ou dans votre veste.",
    "recipeEn": "Honor Preservation & Prestige Shield Protocol:\n1. Timing: Every morning after Fajr prayer (Hour of Sun/Mars).\n2. Incense: Burn red sandalwood and frankincense.\n3. Writing: Write \"Qazmazin\" (قَزْمَزٍ) 157 times on white silk cloth.\n4. Recitation: Recite the name 157 times daily with devotion.\n5. Application: Carry the silk cloth in your coat pocket or right arm pouch.",
    "recipeHa": "Hanyar Kare Mutunci da Samun Kwarjini:\n1. Lokaci: Kowace safe bayan idar da sallar Fajr.\n2. Turare: Kona turaren Sandal ja da Luban الذكر.\n3. Rubutu: Rubuta \"Qazmazin\" (قَزْمَزٍ) sau 157 a yadin siliki fari.\n4. Karatu: Karanta sau 157 kowace safe da natsuwa.\n5. Amfani: Sanya silikin a aljihun riga ko damara a hannun dama.",
    "invocationAr": "يا مُعِزُّ يا مَانِعُ أَعِزَّنِي بِطَاعَتِكَ وَاحْفَظْ كَرَامَتِي وَمَقَامِي بِحَقِّ قَزْمَزٍ",
    "invocationTranslit": "Ya Mu'izzu ya Mani'u a'izzanee bi-ta'atika wahfadh karamatee wa maqamee bi-haqqi Qazmazin",
    "invocationFr": "Ô Donneur d'Honneur, ô Protecteur, élève-moi dans ton obéissance et préserve ma dignité et mon rang par la vérité de Qazmazin.",
    "invocationEn": "O Bestower of Honor, O Guardian, exalt me in Your obedience and protect my dignity and position by Qazmazin.",
    "invocationHa": "Ya Mai ba da daukaka, Ya Mai kariya, ka daukaka ni da biyayyarka, ka tsare mutuncina da matsayina albarkacin Qazmazin.",
    "talsamCode": "١٥٧ ٨٨٨ ق ق ق 👑",
    "wafq3x3": [
      ["53", "48", "55"],
      ["57", "52", "47"],
      ["46", "56", "54"]
    ]
  },
  {
    "id": 18,
    "nameAr": "أَنْغَلَلِيطٍ",
    "nameTranslit": "Anaghlalitin",
    "divineAttributeAr": "الحَكِيمُ العَدْلُ",
    "divineAttributeFr": "Al-Hakim Al-Adl (Le Sage, Le Juste Arbitre des Conflits)",
    "divineAttributeEn": "Al-Hakim Al-Adl (The Wise, The Just Arbitrator of Conflicts)",
    "divineAttributeHa": "Al-Hakim Al-Adl (Mai Hikima, Mai Adalci da Sasanta Mutane)",
    "abjadWeight": 1150,
    "lunarMansion": "Al-Qalb (القلب)",
    "element": "air",
    "secretFr": "Grand Secret de l'Arbitrage Équitable, Conciliation des Litiges Complexes & Éteignement des Haines. Anaghlalitin possède la puissance spirituelle de rétablir l'entente cordiale entre associés en conflit, membres de familles divisées ou parties opposées.\n\nIl diffuse la lumière de la justice et inspire des solutions équitables qui satisfont les cœurs et étouffent la rancœur.",
    "secretEn": "Grand Secret of Just Mediation, Resolving Deep Feuds & Extinguishing Hatred. Anaghlalitin holds the spiritual authority to restore harmony between warring partners, divided families, or disputing parties.\n\nIt radiates the illumination of justice and inspires equitable solutions that calm hearts and erase animosity.",
    "secretHa": "Babban Sirrin Sasanta Rigima cikin Adalci da Kashe Kiyayya. Anaghlalitin yana da ikon samaniya na daidaita mutanen da ke rigima, abokan kasuwanci da aka samu sabani, ko yan uwa da ke adawa da juna.\n\nYana baza hasken adalci kuma yana kawo amincewa mai gamsar da zukata da kawar da kiyayya.",
    "recipeFr": "Protocole d'Arbitrage & Reconciliation :\n1. Timing : Le mardi à l'aube (Heure de Mars).\n2. Encensement : Brûlez du Benjoin et des graines de Coriandre.\n3. Calligraphie : Écrivez \"Anaghlalitin\" (أَنْغَلَلِيطٍ) 1150 fois sur du papier blanc.\n4. Récitation : Répétez le nom 1150 fois sur un récipient d'eau pure.\n5. Consommation : Faites boire cette eau aux parties en conflit ou aspergez discrètement leur lieu de rencontre.",
    "recipeEn": "Mediation & Harmony Protocol:\n1. Timing: Tuesday dawn (Hour of Mars).\n2. Incense: Burn benzoin and coriander seeds.\n3. Writing: Write \"Anaghlalitin\" (أَنْغَلَلِيطٍ) 1150 times on white paper.\n4. Recitation: Recite 1150 times over a container of pure water.\n5. Application: Serve this water to the conflicting parties or sprinkle discreetly at their meeting hall.",
    "recipeHa": "Hanyar Sasanta Rigima da Daidaita Tsakanin Mutane:\n1. Lokaci: Talata da asuba.\n2. Turare: Kona Jawi da kuryar kosan koli.\n3. Rubutu: Rubuta \"Anaghlalitin\" (أَنْغَلَلِيطٍ) sau 1150 a farar takarda.\n4. Karatu: Karanta sau 1150 a kan ruwa mai kyau.\n5. Amfani: Ba mutanen da ke rigima su sha ko yayafa a wurin zamansu.",
    "invocationAr": "يا حَكِيمُ يا عَدْلُ احْكُمْ بَيْنَنَا بِالحَقِّ وَأَلِّفْ بَيْنَ قُلُوبِنَا بِحَقِّ أَنْغَلَلِيطٍ",
    "invocationTranslit": "Ya Hakeemu ya Adlu uhkum baynana bi-al-haqqi wa allif bayna quloobina bi-haqqi Anaghlalitin",
    "invocationFr": "Ô Sage, ô Juste, arbitre entre nous avec équité, unis nos cœurs dans la concorde par la vertu d'Anaghlalitin.",
    "invocationEn": "O Wise, O Just, judge between us with equity and unite our hearts in harmony by Anaghlalitin.",
    "invocationHa": "Ya Mai Hikima, Ya Mai Adalci, ka yi shari'a tsakaninmu da gaskiya, ka haɗa zukatanmu albarkacin Anaghlalitin.",
    "talsamCode": "١١٥٠ ٣٣٣ أ أ أ ⚖️",
    "wafq3x3": [
      ["384", "379", "387"],
      ["389", "383", "378"],
      ["377", "388", "385"]
    ]
  },
  {
    "id": 19,
    "nameAr": "قَبَرَاَتٍ",
    "nameTranslit": "Qabratin",
    "divineAttributeAr": "البَاقِي الدَّائِمُ",
    "divineAttributeFr": "Al-Baqi Al-Da'im (Le Permanent, Le Consolidateur des Acquis & du Capital)",
    "divineAttributeEn": "Al-Baqi Al-Da'im (The Everlasting, Solidifier of Wealth & Capital)",
    "divineAttributeHa": "Al-Baqi Al-Da'im (Mai Dawwama da Tabbatar da Dukiya)",
    "abjadWeight": 303,
    "lunarMansion": "Al-Shaulah (الشولة)",
    "element": "earth",
    "secretFr": "Grand Secret de la Consolidation de la Richesse, Pérennité des Entreprises & Protection du Patrimoine. Qabratin scelle la stabilité des acquêts et protège le capital contre la faillite subite, l'inflation ruineuse ou la perte involontaire.\n\nIl ancre les projets professionnels dans la durée, empêchant les effondrements financiers et assurant la transmission saine des biens.",
    "secretEn": "Grand Secret of Wealth Permanence, Business Stability & Asset Protection. Qabratin seals acquired assets and protects investment capital against unexpected bankruptcy, inflation, or sudden loss.\n\nIt anchors commercial projects into long-term stability, shielding businesses from market collapses.",
    "secretHa": "Babban Sirrin Dawwamar Dukiya, Tabbatar da Kasuwanci da Tsare Arziqi. Qabratin yana tabbatar da dukiyar da aka samu kuma yana tsare jari daga rushewa, fatarau ko asarar ba-zata.\n\nYana kafawa kasuwanci tushe mai karfe ta yadda ba zai rushe ba kuma gado yayi amfani.",
    "recipeFr": "Protocole de Pérennité & Protection du Capital :\n1. Timing : Le samedi matin au lever du soleil (Heure de Saturne).\n2. Encensement : Brûlez du Myrrhe et de l'Encens noir.\n3. Calligraphie : Écrivez \"Qabratin\" (قَبَرَاَتٍ) 303 fois à l'encre de safran.\n4. Récitation : Répétez le nom 303 fois avec intention de pérennité.\n5. Conservation : Placez le parchemin plié dans le coffre-fort de votre entreprise ou le lieu de stockage des actes.",
    "recipeEn": "Longevity & Capital Shield Protocol:\n1. Timing: Saturday morning at sunrise (Hour of Saturn).\n2. Incense: Burn myrrh and black frankincense.\n3. Writing: Write \"Qabratin\" (قَبَرَاَتٍ) 303 times with saffron ink.\n4. Recitation: Recite the name 303 times focusing on wealth endurance.\n5. Application: Keep the document inside your business safe or deed vault.",
    "recipeHa": "Hanyar Tabbatar da Dukiya da Kasuwanci:\n1. Lokaci: Ranar Asabar da hantsi.\n2. Turare: Kona turaren Mirra da Luban baki.\n3. Rubutu: Rubuta \"Qabratin\" (قَبَرَاَتٍ) sau 303 da za'afaran.\n4. Karatu: Karanta sau 303 da niyyar dawwamar dukiya.\n5. Aje: Saka takardar a cikin akwatin ajiyar kudi ko asusun kasuwanci.",
    "invocationAr": "يا بَاقِي يا دَائِمُ ثَبِّتْ نِعْمَتَكَ عَلَيَّ وَاحْفَظْ مَالِي مِنْ الزَّوَالِ بِحَقِّ قَبَرَاَتٍ",
    "invocationTranslit": "Ya Baqee ya Da'imu thabbit ni'mataka alayya wahfadh malee min az-zawali bi-haqqi Qabratin",
    "invocationFr": "Ô Éternel, ô Permanent, consolide tes bienfaits sur moi et préserve mon patrimoine du déclin par la vérité de Qabratin.",
    "invocationEn": "O Everlasting, O Permanent, solidify Your blessings upon me and preserve my wealth from decay by Qabratin.",
    "invocationHa": "Ya Mai Dawwama, ka tabbatar da ni'marka a gare ni, ka tsare dukiyata daga rushewa albarkacin Qabratin.",
    "talsamCode": "٣٠٣ ٩٩٩ ق ق ق 🏛️",
    "wafq3x3": [
      ["102", "97", "104"],
      ["106", "101", "96"],
      ["95", "105", "103"]
    ]
  },
  {
    "id": 20,
    "nameAr": "غَيَاهَا",
    "nameTranslit": "Ghiya-ha",
    "divineAttributeAr": "المُغِيثُ الكَافِي",
    "divineAttributeFr": "Al-Ghiyath Al-Kafi (Le Secoureur Suprême dans les Urgences Extrêmes)",
    "divineAttributeEn": "Al-Ghiyath Al-Kafi (The Supreme Emergency Rescuer)",
    "divineAttributeHa": "Al-Ghiyath Al-Kafi (Mai Kawo Daukin Gaggawa lokacin Matsi)",
    "abjadWeight": 1016,
    "lunarMansion": "Al-Na'a'im (النعائم)",
    "element": "water",
    "secretFr": "Grand Secret du Secours d'Urgence Immédiat, Intervention Divine Rapide & Délivrance des Détresses Aiguës. Ghiya-ha déclenche le secours céleste fulgurant dans les moments d'imminence tragique, d'encerclement par des ennemis ou de pièges insurmontables.\n\nIl est le cri d'appel suprême des mystiques assiégés, apportant l'aide miraculeuse avant l'effondrement.",
    "secretEn": "Grand Secret of Immediate Emergency Rescue, Rapid Divine Intervention & Deliverance from Severe Peril. Ghiya-ha triggers swift celestial rescue during moments of critical danger, enemy surrounding, or inescapable entrapment.\n\nIt acts as the supreme emergency call of spiritual seekers, delivering miraculous aid before total collapse.",
    "secretHa": "Babban Sirrin Agaji na Gaggawa da Ceto Daga Hatsari Babba. Ghiya-ha yana kawo dauki na samaniya cikin hanzari lokacin da mutum ya shiga matsi na rayuwa ko makiya suka kewaye shi.\n\nShi ne kiran gaggawa na masana sirri lokacin da abubuwa suka tabarbare, yana kawo taimakon miliki kafin halaka.",
    "recipeFr": "Protocole du Secours d'Urgence Immédiat :\n1. Timing : À exécuter immédiatement lors d'une détresse ou crise majeure.\n2. Purification : Réalisez les ablutions si possible.\n3. Récitation : Répétez \"Ghiya-ha\" (غَيَاهَا) 1016 fois sans interrompre la diction.\n4. Intention : Visualisez la délivrance et tournez-vous vers le ciel.\n5. Clôture : Répétez l'invocation sacrée 3 fois.",
    "recipeEn": "Immediate Emergency Rescue Protocol:\n1. Timing: Execute immediately during critical distress or acute emergency.\n2. Purity: Perform ablution (Wudu) if situation allows.\n3. Recitation: Recite \"Ghiya-ha\" (غَيَاهَا) 1016 times continuously without breaking speech.\n4. Intention: Focus completely on divine rescue.\n5. Seal: Recite the holy invocation 3 times at completion.",
    "recipeHa": "Hanyar Neman Agaji na Gaggawa:\n1. Lokaci: A kowane lokaci idan aka shiga hatsari ko matsi babba.\n2. Tsarki: Yi alwala idan da dama.\n3. Karatu: Karanta \"Ghiya-ha\" (غَيَاهَا) sau 1016 ba tare da yin magana da kowa ba.\n4. Niyya: Maida hankali gaba daya zuwa ga ceto na samaniya.\n5. Rufe: Karanta addu'ar sau 3 a karshe.",
    "invocationAr": "يا مُغِيثُ يا كَافِي أَغِثْنِي وَعَجِّلْ بِالفَرَجِ وَنَجِّنِي مِنْ كُلِّ كَرْبٍ بِحَقِّ غَيَاهَا",
    "invocationTranslit": "Ya Mugheesu ya Kafee aghisnee wa ajjeel bi-al-faraji wa najjinee min kulli karbin bi-haqqi Ghiya-ha",
    "invocationFr": "Ô Secoureur Suprême, ô Suffisant, secours-moi en hâtant la délivrance et sauve-moi de toute détresse par la vérité de Ghiya-ha.",
    "invocationEn": "O Supreme Rescuer, O All-Sufficient, come to my aid, hasten deliverance, and save me from all distress by Ghiya-ha.",
    "invocationHa": "Ya Mai kawo dauki, Ya Mai wadatarwa, ka kawo min agaji cikin sauri, ka tsatar da ni daga kowane matsi albarkacin Ghiya-ha.",
    "talsamCode": "١٠١٦ ٧٧٧ غ غ غ 🚨",
    "wafq3x3": [
      ["340", "335", "342"],
      ["344", "339", "334"],
      ["333", "343", "341"]
    ]
  },
  {
    "id": 21,
    "nameAr": "كَيْدَهوُلَا",
    "nameTranslit": "Kaydahoola",
    "divineAttributeAr": "القَادِرُ القَاهِرُ",
    "divineAttributeFr": "Al-Qahir Al-Qadir (Le Dominateur, Le Marteau des Sortilèges & Nœuds Occultes)",
    "divineAttributeEn": "Al-Qahir Al-Qadir (The Subduer, Destroyer of Sorcery & Occult Bindings)",
    "divineAttributeHa": "Al-Qahir Al-Qadir (Mai Rushe Asiri, Sammu da Kullun Dujal)",
    "abjadWeight": 76,
    "lunarMansion": "Al-Baldah (البلدة)",
    "element": "fire",
    "secretFr": "Grand Secret de l'Anéantissement Absolu de la Magie Noire, Dissolution des Nœuds & Libération des Envoûtements. Kaydahoola est le marteau céleste qui brise instantanément toutes les liaisons occultes, les sortilèges de blocage et les malédictions anciennes.\n\nIl agit avec la force du feu divin purificateur, consumant les pièges des sorciers et restaurant la liberté spirituelle de la victime.",
    "secretEn": "Grand Secret of Total Sorcery Annihilation, Unbinding Curses & Shattering Occult Chains. Kaydahoola acts as the celestial hammer that instantly shatters dark magic bindings, blockage curses, and inherited hexes.\n\nIt burns with the intensity of divine purifying fire, consuming sorcery nets and restoring spiritual autonomy to the victim.",
    "secretHa": "Babban Sirrin Rushe Kowane Sihiri, Sammu da Kulli na Asiri. Kaydahoola guduma ce ta samaniya wadda ke karya kowane irin sirrin baka, sammu ko katangar asiri da aka kulla a kan mutum.\n\nYana cin wutar tsarkakewa ta samaniya wadda ke qona kaidin masusihiri kuma yana dawo da 'yancin ruhi na mutum.",
    "recipeFr": "Protocole d'Anéantissement des Sortilèges & Libération :\n1. Timing : Le mardi soir après le coucher du soleil (Heure de Mars).\n2. Encensement : Brûlez du Soufre pur, de l'Encens mâle et des clous de Girofle.\n3. Calligraphie : Écrivez \"Kaydahoola\" (كَيْدَهوُلَا) 76 fois à l'encre de safran mélangée à un peu d'eau de mer ou d'eau salée.\n4. Récitation : Répétez le nom 76 fois sur l'eau calligraphiée.\n5. Bain thérapeutique : Lavez-vous le corps avec cette eau bénite pendant 3 soirs consécutifs hors des sanitaires.",
    "recipeEn": "Sorcery Annihilation & Unbinding Protocol:\n1. Timing: Tuesday evening after sunset (Hour of Mars).\n2. Incense: Burn sulfur resin, frankincense, and whole cloves.\n3. Writing: Write \"Kaydahoola\" (كَيْدَهوُلَا) 76 times using saffron ink mixed with spring water and a pinch of salt.\n4. Recitation: Recite 76 times over the written solution.\n5. Purification Bath: Wash your body with this holy water for 3 consecutive evenings.",
    "recipeHa": "Hanyar Karya Sihiri da Rushe Sammu:\n1. Lokaci: Ranar Talata da daddare bayan faɗuwar rana.\n2. Turare: Kona turaren Farin Kibriya da Luban الذكر da kanumfari.\n3. Rubutu: Rubuta \"Kaydahoola\" (كَيْدَهوُلَا) sau 76 da za'afaran a ruwan gishiri ko ruwan teku.\n4. Karatu: Karanta sau 76 a kan ruwan rubutun.\n5. Wankan Tsarki: Yi wanka da ruwan har daren kwana 3 a jere a wurin tsarki.",
    "invocationAr": "يا قَاهِرُ يا قَادِرُ ابْطِلْ كُلَّ سِحْرٍ وَعَقْدٍ وَكَيْدٍ بِحَقِّ كَيْدَهوُلَا",
    "invocationTranslit": "Ya Qahiru ya Qadeeru abtil kulla sihrin wa aqdin wa kaydin bi-haqqi Kaydahoola",
    "invocationFr": "Ô Dominateur, ô Puissant, anéantis tout sortilège, dissous tout nœud occulte et brise les pièges par la vérité sacrée de Kaydahoola.",
    "invocationEn": "O Subduer, O All-Powerful, destroy every spell, dissolve every binding, and crush every plot by Kaydahoola.",
    "invocationHa": "Ya Mai Rushe asiri, Ya Mai Iko, ka karyata kowane sihiri, kulli da kaidin maqiya albarkacin Kaydahoola.",
    "talsamCode": "٧٦ ٣٣٣ ك ك ك ⚡",
    "wafq3x3": [
      ["26", "21", "28"],
      ["30", "25", "20"],
      ["19", "29", "27"]
    ]
  },
  {
    "id": 22,
    "nameAr": "شَمْخَاهِرٍ",
    "nameTranslit": "Shamkhahirin",
    "divineAttributeAr": "التَّوَّابُ الخَبِيرُ",
    "divineAttributeFr": "Al-Khabir Al-Tawwab (Le Dévoileur des Vérités, L'Accueillant au Repentir)",
    "divineAttributeEn": "Al-Khabir Al-Tawwab (Unveiler of Hidden Traps, The Relenting)",
    "divineAttributeHa": "Al-Khabir Al-Tawwab (Mai Bayyana Gaskiya da Karɓar Tuba)",
    "abjadWeight": 1146,
    "lunarMansion": "Sa'd al-Dhabih (سعد الذابح)",
    "element": "air",
    "secretFr": "Grand Secret du Dévoilement des Pièges Cachés, Discernement Spirituel & Protection contre la Trahison. Shamkhahirin prévient les escroqueries financières, démasque les faux amis et révèle les intentions malveillantes des associés avant qu'elles ne causent du tort.\n\nIl dote l'esprit d'une intuition pénétrante capable de déceler le mensonge sous toutes ses formes.",
    "secretEn": "Grand Secret of Unveiling Hidden Traps, Spiritual Discernment & Shield from Betrayal. Shamkhahirin thwarts financial fraud, unmasks deceitful allies, and exposes evil intentions before harm is done.\n\nIt grants the seeker sharp intuitive discernment that pierces through deception and false pretenses.",
    "secretHa": "Babban Sirrin Bayyana Yaudara, Gane Zagon Kasa da Tsarewa Daga Algus. Shamkhahirin yana kiyaye mutum daga fada a komar yan damfara, yana bayyana fuskar marasa gaskiya kuma yana bankado nufin sharri na abokan kasuwanci kafin su cutar.\n\nYana bawa mutum kaifin basira wanda ke gane karya da ha'inci a bayyane.",
    "recipeFr": "Protocole de Discernement & Dévoilement des Tromperies :\n1. Timing : La nuit du jeudi au vendredi (Dernier tiers de la nuit).\n2. Encensement : Brûlez du Benjoin pur et des feuilles de Sauge.\n3. Récitation : Répétez \"Shamkhahirin\" (شَمْخَاهِرٍ) 1146 fois dans la pénombre.\n4. Calligraphie : Écrivez le nom 11 fois sur du papier vert et placez sous votre oreiller.\n5. Révélation : Observez les signes et rêves éclairants reçus les jours suivants.",
    "recipeEn": "Discernment & Deceit Unveiling Protocol:\n1. Timing: Night between Thursday and Friday (Last third of night).\n2. Incense: Burn pure benzoin and dried sage.\n3. Recitation: Recite \"Shamkhahirin\" (شَمْخَاهِرٍ) 1146 times in quiet darkness.\n4. Writing: Write the name 11 times on green paper and place under pillow.\n5. Guidance: Pay close attention to clear symbolic dreams during subsequent nights.",
    "recipeHa": "Hanyar Gane Gaskiya da Korar Ha'inci:\n1. Lokaci: Daren Alhamis zuwa Juma'a (Wurin karshen dare).\n2. Turare: Kona turaren Jawi da ganyen kauri.\n3. Karatu: Karanta \"Shamkhahirin\" (شَمْخَاهِرٍ) sau 1146 a dakin zikiri.\n4. Rubutu: Rubuta sunan sau 11 a korayen takarda ka saka a karkashin matashin kai.\n5. Bayyana: Maida hankali akan mafarkai da fahimtar da zaka samu.",
    "invocationAr": "يا خَبِيرُ يا تَوَّابُ اكْشِفْ لِي العَوَاقِبَ وَاحْمِنِي مِنْ الخِيَانَةِ بِحَقِّ شَمْخَاهِرٍ",
    "invocationTranslit": "Ya Khabeeru ya Tawwabu ikshif lee al-awaqiba wahminee min al-khiyanati bi-haqqi Shamkhahirin",
    "invocationFr": "Ô Informé, ô Accueillant au repentir, dévoile-moi les conséquences cachées et préserve-moi de la trahison par Shamkhahirin.",
    "invocationEn": "O All-Aware, O Acceptor of Repentance, reveal secret consequences to me and guard me against betrayal by Shamkhahirin.",
    "invocationHa": "Ya Mai labari, Ya Mai karɓar tuba, ka bayyana min karshen lamari, ka kare ni daga ha'inci albarkacin Shamkhahirin.",
    "talsamCode": "١١٤٦ ٥٥٥ ش ش ش 🔍",
    "wafq3x3": [
      ["383", "378", "385"],
      ["387", "382", "377"],
      ["376", "386", "384"]
    ]
  },
  {
    "id": 23,
    "nameAr": "شَمْخَاهِيرٍ",
    "nameTranslit": "Shamkhahirin (Grand)",
    "divineAttributeAr": "القَادِرُ المَلِكُ",
    "divineAttributeFr": "Al-Qadir Al-Malik (Le Souverain Invincible, La Fortification du Foyer)",
    "divineAttributeEn": "Al-Qadir Al-Malik (The Invincible Sovereign, Fortifier of Residences)",
    "divineAttributeHa": "Al-Qadir Al-Malik (Mai Mulki Invincible, Kariyar Gida da Iyali)",
    "abjadWeight": 1156,
    "lunarMansion": "Sa'd Bula' (سعد بلع)",
    "element": "earth",
    "secretFr": "Grand Secret du Bouclier Inviolable du Foyer, Protection de la Famille & Immunisation des Propriétés. Shamkhahirin (Grand) dresse un rempart spirituel infranchissable autour de la demeure familiale, repoussant les cambrioleurs, les esprits perturbateurs et les jalousies de voisinage.\n\nIl procure la tranquillité aux habitants et assure la sécurité constante des biens matériels et humains.",
    "secretEn": "Grand Secret of the Inviolable Home Shield, Family Fortification & Property Protection. Shamkhahirin (Grand) erects an impenetrable spiritual wall around the family residence, repelling intruders, negative entities, and envious attacks.\n\nIt grants lasting peace to residents and guarantees safety for physical assets.",
    "secretHa": "Babban Sirrin Katangar Karfe ta Gida, Kariyar Iyali da Dukiyoyin Gida. Shamkhahirin Mai Girma yana gina katangar ruhi mara huje a kewaye da gidan iyali, yana korar ɓayi, aljannu masu takura da kishin makwabta.\n\nYana kawo kwanciyar hankali ga ma'aikata da iyalai kuma yana ba da kariya ta dindindin.",
    "recipeFr": "Protocole de Fortification du Foyer :\n1. Timing : Le jeudi matin avant midi.\n2. Encensement : Brûlez du Mastic, de l'Encens mâle et du Sel gemme.\n3. Calligraphie : Écrivez \"Shamkhahirin Grand\" (شَمْخَاهِيرٍ) 1156 fois sur un parchemin pur à l'encre de safran.\n4. Récitation : Répétez le nom 1156 fois en faisant le tour de votre maison.\n5. Protection : Encadrez et suspendez le parchemin au-dessus de la porte principale d'entrée.",
    "recipeEn": "Home Fortification Protocol:\n1. Timing: Thursday morning before noon.\n2. Incense: Burn mastic, frankincense, and rock salt.\n3. Writing: Write \"Shamkhahirin Grand\" (شَمْخَاهِيرٍ) 1156 times on clean paper using saffron ink.\n4. Recitation: Recite 1156 times while walking around the perimeter of your residence.\n5. Placement: Frame and hang the sacred text above the main entrance door.",
    "recipeHa": "Hanyar Ginsa Katangar Kariyar Gida:\n1. Lokaci: Ranar Alhamis da safe kafin azahar.\n2. Turare: Kona Mastaki, Luban الذكر da gishirin kankara.\n3. Rubutu: Rubuta \"Shamkhahirin Mai Girma\" (شَمْخَاهِيرٍ) sau 1156 da za'afaran.\n4. Karatu: Karanta sau 1156 yayin da kake kewaye da gidan.\n5. Ratayawa: Saka a firam ka rataya a saman babbar kofar shiga gida.",
    "invocationAr": "يا مَلِكُ يا قَادِرُ احْمِ دَارِي وَأَهْلِي وَمَالِي مِنْ كُلِّ طَارِقٍ وَحَاسِدٍ بِحَقِّ شَمْخَاهِيرٍ",
    "invocationTranslit": "Ya Maliku ya Qadeeru ihmi daree wa ahlee wa malee min kulli tariqin wa hasidin bi-haqqi Shamkhahirin",
    "invocationFr": "Ô Souverain, ô Puissant, protège ma demeure, ma famille et mes biens contre tout intrus et tout envieux par Shamkhahirin.",
    "invocationEn": "O Sovereign, O Powerful, shield my home, family, and assets from every intruder and envious eye by Shamkhahirin.",
    "invocationHa": "Ya Mai Mulki, Ya Mai Iko, ka tsare gidana, iyalina da dukiyata daga kowane mugun bako da mai hassada albarkacin Shamkhahirin.",
    "talsamCode": "١١٥٦ ٨٨٨ ش ش ش 🏰",
    "wafq3x3": [
      ["386", "381", "389"],
      ["391", "385", "380"],
      ["379", "390", "387"]
    ]
  },
  {
    "id": 24,
    "nameAr": "بَكَهَطَطَهُونِيَةٍ",
    "nameTranslit": "Bakahtatahoniyatin",
    "divineAttributeAr": "القَدِيمُ الأَزَلِيُّ",
    "divineAttributeFr": "Al-Qadeem Al-Azali (L'Éternel Sans Début, Le Scelleur de Grâce)",
    "divineAttributeEn": "Al-Qadeem Al-Azali (The Eternal Without Beginning, Seal of Grace)",
    "divineAttributeHa": "Al-Qadeem Al-Azali (Na Farko Mara Fari, Mai Tabbatar da Albarka)",
    "abjadWeight": 112,
    "lunarMansion": "Sa'd al-Su'ud (سعد السعود)",
    "element": "water",
    "secretFr": "Grand Secret de l'Ancrage Éternel des Bénédictions, Constance Spirituelle & Scellement des Faveurs Divines. Bakahtatahoniyatin permet de fixer les grâces reçues afin qu'elles ne s'évanouissent pas avec le temps.\n\nIl stabilise la foi, élimine la versatilité spirituelle et accorde une tranquillité constante dans les états de grâce.",
    "secretEn": "Grand Secret of Permanent Blessings, Spiritual Consistency & Sealing Divine Favors. Bakahtatahoniyatin locks in divine graces so they do not fade over time.\n\nIt stabilizes spiritual faith, eliminates spiritual mood swings, and bestows steady serenity in moments of divine favor.",
    "secretHa": "Babban Sirrin Dawwamar Albarka, Dazawa akan Zikiri da Tabbatar da Ni'ima. Bakahtatahoniyatin yana kulle ni'imomi da aka samu domin kada su gushe a hankali.\n\nYana daidaita imani, yana korar shakku da rashin tabbas a cikin ruhi kuma yana kawo natsuwa ta dindindin.",
    "recipeFr": "Protocole d'Ancrage & Fixation des Bénédictions :\n1. Timing : Le vendredi après-midi après la prière du Jumu'ah.\n2. Encensement : Brûlez du Benjoin blanc et de l'Eau de rose.\n3. Récitation : Répétez \"Bakahtatahoniyatin\" (بَكَهَطَطَهُونِيَةٍ) 112 fois avec gratitude intense.\n4. Calligraphie : Écrivez le nom 112 fois sur papier blanc pur et conservez-le dans votre exemplaire du Coran ou livre de prières.\n5. Pratique : Maintenez ce zikr hebdomadaire pour préserver la stabilité de votre vie.",
    "recipeEn": "Blessing Anchoring & Permanence Protocol:\n1. Timing: Friday afternoon following Jumu'ah prayer.\n2. Incense: Burn white benzoin and rosewater mist.\n3. Recitation: Recite \"Bakahtatahoniyatin\" (بَكَهَطَطَهُونِيَةٍ) 112 times with deep gratitude.\n4. Writing: Write the name 112 times on white paper and place inside your Quran or prayer book.\n5. Continuation: Keep this weekly practice to permanently retain divine favors.",
    "recipeHa": "Hanyar Dawwamar Ni'ima da Kariyar Albarka:\n1. Lokaci: Ranar Juma'a da rana bayan amsa sallar Juma'a.\n2. Turare: Kona Luban fari da feshin ruwan fure.\n3. Karatu: Karanta \"Bakahtatahoniyatin\" (بَكَهَطَطَهُونِيَةٍ) sau 112 da nuna godiya.\n4. Rubutu: Rubuta sunan sau 112 a farar takarda ka saka a cikin Littafin Addu'a.\n5. Tsari: Ci gaba da wannan zikiri kowace mako domin kare samunka.",
    "invocationAr": "يا قَدِيمُ يا أَزَلِيُّ أَدِمْ عَلَيَّ نِعَمَكَ وَثَبِّتْ قَلْبِي عَلَى دِينِكَ بِحَقِّ بَكَهَطَطَهُونِيَةٍ",
    "invocationTranslit": "Ya Qadeemu ya Azaliyyu adim alayya ni'amaka wa thabbit qalbee ala deenika bi-haqqi Bakahtatahoniyatin",
    "invocationFr": "Ô Éternel, ô Sans-Début, perpétue sur moi tes bienfaits et affermis mon cœur dans ta vérité par Bakahtatahoniyatin.",
    "invocationEn": "O Eternal, O Unbegotten, perpetuate Your blessings upon me and firm my heart in Your truth by Bakahtatahoniyatin.",
    "invocationHa": "Ya Na Farko mara fari, ka dawwamar da ni'mominka a gare ni, ka tabbatar da zuciyata a kan tafarkinka albarkacin Bakahtatahoniyatin.",
    "talsamCode": "١١٢ ١١١ ب ب ب ✨",
    "wafq3x3": [
      ["38", "33", "40"],
      ["42", "37", "32"],
      ["31", "41", "39"]
    ]
  },
  {
    "id": 25,
    "nameAr": "بَشَارَشٍ",
    "nameTranslit": "Basharashin",
    "divineAttributeAr": "القَادِرُ المُتَعَالِي",
    "divineAttributeFr": "Al-Qadir Al-Muta'ali (Le Puissant, L'Apaisateur des Guerres & Discordes)",
    "divineAttributeEn": "Al-Qadir Al-Muta'ali (The Mighty, Pacifier of Mass Discord & Strife)",
    "divineAttributeHa": "Al-Qadir Al-Muta'ali (Mai Ikon Kwantar da Kura da Kashe Fitinar Al'umma)",
    "abjadWeight": 802,
    "lunarMansion": "Sa'd al-Akhbiya (سعد الأخبية)",
    "element": "fire",
    "secretFr": "Grand Secret de l'Extinction des Haines Tribales, Conflits Communautaires & Pacification des Rivalités. Basharashin éteint les flammes de la discorde collective et ramène l'entente sereine au sein des cités ou des familles déchirées.\n\nIl neutralise la fureur des foules, calme les colères aveugles et restaure le dialogue constructif.",
    "secretEn": "Grand Secret of Quenching Mass Strife, Community Feuds & Pacifying Rivalries. Basharashin extinguishes the flames of collective conflict and brings peaceful harmony to divided communities or clans.\n\nIt neutralizes mob fury, calms blind anger, and re-establishes constructive communication.",
    "secretHa": "Babban Sirrin Kashe Fitinar Al'umma, Rigimar Qabila da Daidaita Zukata. Basharashin yana kashe wutar rigima tsakanin mutane masu yawa kuma yana kawo zaman lafiya a tsakanin al'umma ko yan uwa da ke fada.\n\nYana kwantar da fusatar jama'a, yana kwantar da husuma kuma yana dawo da fahimtar juna.",
    "recipeFr": "Protocole d'Extinction des Discordes Communautaires :\n1. Timing : Au milieu de la nuit (entre 1h et 3h du matin).\n2. Encensement : Brûlez du Mastic et des feuilles de Camphre.\n3. Récitation : Répétez \"Basharashin\" (بَشَارَشٍ) 802 fois avec l'intention d'apaiser le conflit.\n4. Calligraphie : Écrivez le nom 802 fois à l'encre de safran sur papier pur.\n5. Action mystique : Dissolvez la calligraphie dans de l'eau claire et aspergez la zone de conflit.",
    "recipeEn": "Community Strife Extinction Protocol:\n1. Timing: Midnight (Between 1 AM and 3 AM).\n2. Incense: Burn mastic resin and camphor leaves.\n3. Recitation: Recite \"Basharashin\" (بَشَارَشٍ) 802 times intending peace restoration.\n4. Writing: Write the name 802 times with saffron ink on clean paper.\n5. Application: Dissolve the text in clear water and sprinkle at the conflict area.",
    "recipeHa": "Hanyar Kashe Rigima da Kwantar da Fitinar Mutane:\n1. Lokaci: Tsakiyar dare (Tsakanin karfe 1 zuwa 3 na dare).\n2. Turare: Kona Mastaki da ganyen Kafur.\n3. Karatu: Karanta \"Basharashin\" (بَشَارَشٍ) sau 802 da niyyar samar da zaman lafiya.\n4. Rubutu: Rubuta sunan sau 802 da za'afaran a Farar takarda.\n5. Amfani: Wanke rubutun a ruwa mai sanyi ka yayafa a wurin husumar.",
    "invocationAr": "يا قَادِرُ يا مُتَعَالِي اَطْفِئْ نَارَ الفِتْنَةِ وَأَصْلِحْ ذَاتَ بَيْنِنَا بِحَقِّ بَشَارَشٍ",
    "invocationTranslit": "Ya Qadiru ya Muta'alee atfi' nara al-fitnati wa aslih dhata baynina bi-haqqi Basharashin",
    "invocationFr": "Ô Puissant, ô Sublimement Élevé, éteins le feu de la discorde et réconcilie nos cœurs par la vérité de Basharashin.",
    "invocationEn": "O Mighty, O Supremely Exalted, quench the fire of strife and reconcile our hearts by Basharashin.",
    "invocationHa": "Ya Mai Iko, Ya Mafi Daukaka, ka kashe wutar fitina, ka kyautata tsakaninmu albarkacin Basharashin.",
    "talsamCode": "٨٠٢ ٤٤٤ ب ب ب 🌊",
    "wafq3x3": [
      ["268", "263", "271"],
      ["273", "267", "262"],
      ["261", "272", "270"]
    ]
  },
  {
    "id": 26,
    "nameAr": "طُونِشٍ",
    "nameTranslit": "Tuneshin",
    "divineAttributeAr": "الشَّكُورُ الرَّزَّاقُ",
    "divineAttributeFr": "Al-Shakur Al-Razzaq (Le Reconnaissant, Le Pourvoyeur d'Abondance Commerciale)",
    "divineAttributeEn": "Al-Shakur Al-Razzaq (The Appreciative, Provider of Commercial Prosperity)",
    "divineAttributeHa": "Al-Shakur Al-Razzaq (Mai Godiya, Mai Arziqawa da Janyo Masu Sayen Kaya)",
    "abjadWeight": 369,
    "lunarMansion": "Al-Fargh al-Muqaddam (الفرغ المقدم)",
    "element": "air",
    "secretFr": "Grand Secret de l'Abondance Financière Fulgurante, Attraction des Clients & Prospérité des Ventes. Tuneshin ouvre les vannes de la prospérité commerciale, magnétisant les opportunités d'affaires et accélérant l'écoulement des marchandises stagnant en stock.\n\nIl entoure le commerce d'une aura d'attraction irrésistible qui inspire la confiance immédiate des acheteurs.",
    "secretEn": "Grand Secret of Rapid Financial Abundance, Customer Attraction & Sales Explosion. Tuneshin opens commercial abundance channels, magnetizing business deals and liquidating stagnant inventory.\n\nIt surrounds the commercial venue with an attractive aura that inspires immediate trust and buyer eagerness.",
    "secretHa": "Babban Sirrin Buɗe Arziqi da Wuri, Janyo Masu Sayen Kaya da Samun Nasara a Kasuwanci. Tuneshin yana bude hanyoyin kudi na shago, yana janyo abokan kasuwanci daga kowane soko kuma yana maganin maqale war kaya.\n\nYana sanya kwarjini da sha'awa a shagonka ta yadda masu saye za su riqa cincirindo.",
    "recipeFr": "Protocole de Prospérité Commerciale & Attraction des Clients :\n1. Timing : Le jeudi matin au lever du soleil (Heure de Jupiter).\n2. Encensement : Brûlez du Santal blanc, du Benjoin et de la Cannelle.\n3. Calligraphie : Écrivez \"Tuneshin\" (طُونِشٍ) 369 fois à l'encre de safran et eau de rose.\n4. Récitation : Répétez le nom 369 fois sur le talisman rédigé.\n5. Exposition : Encadrez et accrochez le talisman au-dessus du comptoir de votre magasin ou bureau.",
    "recipeEn": "Commercial Abundance & Customer Attraction Protocol:\n1. Timing: Thursday morning at sunrise (Hour of Jupiter).\n2. Incense: Burn white sandalwood, benzoin, and cinnamon powder.\n3. Writing: Write \"Tuneshin\" (طُونِشٍ) 369 times with saffron ink and rosewater.\n4. Recitation: Recite the name 369 times over the completed document.\n5. Application: Frame and mount above the main counter of your store or office.",
    "recipeHa": "Hanyar Samun Kasuwa da Janyo Masu Sayen Kaya:\n1. Lokaci: Ranar Alhamis da hantsi lokacin fitar rana.\n2. Turare: Kona Sandalko fari, Jawi da qirfa.\n3. Rubutu: Rubuta \"Tuneshin\" (طُونِشٍ) sau 369 da za'afaran da ruwan fure.\n4. Karatu: Karanta sau 369 a kan rubutun.\n5. Rataya: Saka a firam ka rataya a saman kanti ko mashigar shagonka.",
    "invocationAr": "يا شَكُورُ يا رَزَّاقُ ارْزُقْنِي مِنْ حَيْثُ لا أَحْتَسِبُ وَاجْلِبْ لِي الزُّبَنَاءَ بِحَقِّ طُونِشٍ",
    "invocationTranslit": "Ya Shakooru ya Razzaqu urzuqnee min haythu la ahtasibu wajlib lee az-zubana'a bi-haqqi Tuneshin",
    "invocationFr": "Ô Reconnaissant, ô Grand Pourvoyeur, accorde-moi ma subsistance d'où je ne m'attends pas et attire à moi la clientèle par la vérité de Tuneshin.",
    "invocationEn": "O Appreciative, O Grand Provider, grant me sustenance from unexpected sources and draw buyers to me by Tuneshin.",
    "invocationHa": "Ya Mai Godiya, Ya Mai Arziqawa, ka arziqeni daga inda ban tsammata ba, ka janyo min masu sayen kaya albarkacin Tuneshin.",
    "talsamCode": "٣٦٩ ٧٧٧ ط ط ط 💰",
    "wafq3x3": [
      ["124", "119", "126"],
      ["128", "123", "118"],
      ["117", "127", "125"]
    ]
  },
  {
    "id": 27,
    "nameAr": "شَمْخَابَارُوحٍ",
    "nameTranslit": "Shamkhabaroohin",
    "divineAttributeAr": "الرَّبُّ القَادِرُ",
    "divineAttributeFr": "Al-Rabb Al-Qadir (Le Seigneur Nourricier, Le Régénérateur de la Force Vitale)",
    "divineAttributeEn": "Al-Rabb Al-Qadir (The Nurturing Lord, Regenerator of Vital Energy)",
    "divineAttributeHa": "Al-Rabb Al-Qadir (Ubangiji Mai Gidandama da Sabunta Karfin Ruhi)",
    "abjadWeight": 1135,
    "lunarMansion": "Al-Fargh al-Mu'akhar (الفرغ المؤخر)",
    "element": "water",
    "secretFr": "Grand Secret de la Régénération Spirituelle Profonde, Purification de l'Âme & Revitalisation du Corps. Shamkhabaroohin ravive la ferveur mystique de l'invocateur épuisé, dissolvant les lassitudes spirituelles et la lourdeur d'esprit.\n\nIl restaure la force vitale (Ruhiyyah) et élève la fréquence vibratoire du chercheur de vérité.",
    "secretEn": "Grand Secret of Deep Spiritual Regeneration, Soul Purification & Vital Energy Revitalization. Shamkhabaroohin reignites divine fervor in exhausted seekers, dissolving spiritual fatigue and mental heaviness.\n\nIt restores vital life force (Ruhiyyah) and elevates the spiritual frequency of the seeker of truth.",
    "secretHa": "Babban Sirrin Sabunta Karfin Ruhi, Tsaftace Zuciya da Maida Karfin Jiki. Shamkhabaroohin yana maida karfin bauta ga wanda yaji kasala a zikiri, yana wanke kuncin hankali da nauyin zuciya.\n\nYana gyara karfin samaniya (Ruhiyyah) kuma yana daukaka matsayin dan adam a wurin bauta.",
    "recipeFr": "Protocole de Régénération & Revitalisation Spirituelle :\n1. Timing : La nuit durant les heures de Tahajjud (entre 2h et 4h du matin).\n2. Encensement : Brûlez du Benjoin pur et des graines d'Encens mâle.\n3. Récitation : Répétez \"Shamkhabaroohin\" (شَمْخَابَارُوحٍ) 1135 fois en état de méditation profonde.\n4. Purification : Buvez un verre d'eau de zamzam ou d'eau pure récité 113 fois du même nom.\n5. Clôture : Remerciez le Créateur pour le renouveau de votre énergie intérieure.",
    "recipeEn": "Spiritual Regeneration & Energy Revitalization Protocol:\n1. Timing: Night during Tahajjud prayer hours (2 AM to 4 AM).\n2. Incense: Burn pure benzoin and frankincense tears.\n3. Recitation: Recite \"Shamkhabaroohin\" (شَمْخَابَارُوحٍ) 1135 times in deep quiet meditation.\n4. Purification: Drink a cup of water over which you recited the name 113 times.\n5. Seal: Offer heartfelt praise for the renewal of your inner spiritual force.",
    "recipeHa": "Hanyar Sabunta Karfin Ruhi da Kwarin Jiki:\n1. Lokaci: Daddare lokacin sallar Tahajjud (Tsakanin karfe 2 zuwa 4 na dare).\n2. Turare: Kona Jawi da Luban الذكر.\n3. Karatu: Karanta \"Shamkhabaroohin\" (شَمْخَابَارُوحٍ) sau 1135 cikin natsuwa da tunani.\n4. Tsarkakewa: Sha kofin ruwa mai kyau wanda ka karanta sunan sau 113 a kai.\n5. Rufe: Yi godiya ga Ubangiji domin sabunta karfin bautar zuciyarka.",
    "invocationAr": "يا رَبُّ يا قَادِرُ جَدِّدِ الرُّوحَ فِي بَدَنِي وَقَوِّ عِزْمَتِي عَلَى طَاعَتِكَ بِحَقِّ شَمْخَابَارُوحٍ",
    "invocationTranslit": "Ya Rabbu ya Qadeeru jaddid ar-rooha fee badanee wa qawwi izmatee ala ta'atika bi-haqqi Shamkhabaroohin",
    "invocationFr": "Ô Seigneur, ô Puissant, régénère le souffle spirituel en mon être et fortifie ma détermination dans ton obéissance par Shamkhabaroohin.",
    "invocationEn": "O Lord, O Powerful One, renew the spiritual breath within my body and strengthen my resolve in Your obedience by Shamkhabaroohin.",
    "invocationHa": "Ya Ubangiji, Ya Mai Iko, ka sabunta karfin ruhi a jikina, ka karfafa niyyata akan biyayyarka albarkacin Shamkhabaroohin.",
    "talsamCode": "١١٣٥ ٩٩٩ ش ش ش 🌟",
    "wafq3x3": [
      ["379", "374", "382"],
      ["384", "378", "373"],
      ["372", "383", "380"]
    ]
  },
  {
    "id": 28,
    "nameAr": "بَيَعْرَشٍ",
    "nameTranslit": "Baya'ra'ashin",
    "divineAttributeAr": "الكَافِي الحَسِيبُ",
    "divineAttributeFr": "Al-Khabi Al-Hasib (Le Suffisant Suprême, Le Sceau des Rituels & Garant du Pacte)",
    "divineAttributeEn": "Al-Khabi Al-Hasib (The Supreme All-Sufficient, Seal of Rituals & Covenant)",
    "divineAttributeHa": "Al-Khabi Al-Hasib (Mai Wadatarwa, Mai Rufewar Zikiri da Yarjejeniya)",
    "abjadWeight": 583,
    "lunarMansion": "Risha / Batn al-Hut (الرشاء / بطن الحوت)",
    "element": "earth",
    "secretFr": "Grand Secret du Scellement Sacré des Travaux (Khatm), Auto-Suffisance Divine & Clôture Parfaite de la Barhatiah. Baya'ra'ashin est le 28ème nom ultime qui scelle la récitation sacrée des 28 Noms. Il verrouille le travail spirituel accompli contre la dissipation et empêche les dérives spirituelles.\n\nIl apporte au disciple le sentiment d'auto-suffisance divine et la plénitude de l'accomplissement spirituel.",
    "secretEn": "Grand Secret of Sacred Work Closure (Khatm), Divine Self-Sufficiency & Ultimate Seal of the Barhatiah. Baya'ra'ashin is the 28th final name that seals the sacred series of the 28 Names. It locks spiritual practices against dissipation and protects spiritual gains.\n\nIt bestows upon the practitioner divine self-sufficiency and the completion of spiritual realization.",
    "secretHa": "Babban Sirrin Rufe Zikiri (Khatm), Wadatar Zuciya da Kammala Zikirin Barhatiah. Baya'ra'ashin shi ne suna na 28 na karshe wanda ke rufe karatun Sunaye 28. Yana kulle duk wani aikin ruhi da aka gudanar domin kada ladansa ya watsar.\n\nYana bawa mai zikiri wadatar zuciya daga Allah da cikar samun nasara a cikin zikirinsa.",
    "recipeFr": "Protocole de Clôture & Scellement Sacré :\n1. Timing : À la fin de toute retraite spirituelle (Khalwah) ou récitation de la Barhatiah.\n2. Encensement : Brûlez du Mastic, du Benjoin et du Bois d'Aloès pur.\n3. Récitation : Répétez \"Baya'ra'ashin\" (بَيَعْرَشٍ) 583 fois pour sceller le zikr.\n4. Calligraphie : Écrivez le nom 28 fois sur du papier blanc et conservez-le en conclusion de vos écrits mystiques.\n5. Clôture : Réciter l'Insiraf (prière de congé) et remercier pour la réalisation des gratifications.",
    "recipeEn": "Sacred Work Closure & Sealing Protocol:\n1. Timing: At the conclusion of any spiritual retreat (Khalwah) or Barhatiah series.\n2. Incense: Burn mastic, benzoin, and pure aloeswood.\n3. Recitation: Recite \"Baya'ra'ashin\" (بَيَعْرَشٍ) 583 times to seal all preceding work.\n4. Writing: Write the name 28 times on white paper as the final seal of your notes.\n5. Conclusion: Recite the Insiraf formula and offer gratitude for spiritual realization.",
    "recipeHa": "Hanyar Rufe Zikiri da Sanya Harsashi na Karshe:\n1. Lokaci: A karshen babban zikiri ko kammala karatun Sunayen Barhatiah.\n2. Turare: Kona Mastaki, Jawi da Oudh mai kyau.\n3. Karatu: Karanta \"Baya'ra'ashin\" (بَيَعْرَشٍ) sau 583 domin kulle aikin zikirin.\n4. Rubutu: Rubuta sunan sau 28 a farar takarda a matsayin rufewar littafinka.\n5. Rufe: Karanta addu'ar Insiraf ka godewa Allah bisa kammala zikirin da nasara.",
    "invocationAr": "يا كَافِي يا حَسِيبُ اكْفِنِي كُلَّ المَهَامِّ وَاخْتِمْ لِي بِالخَيْرِ وَالسَّلاَمَةِ بِحَقِّ بَيَعْرَشٍ",
    "invocationTranslit": "Ya Kafee ya Haseebu ikfinee kulla al-mahammi wakhtim lee bi-al-khayri wa as-salamati bi-haqqi Baya'ra'ashin",
    "invocationFr": "Ô Suffisant, ô Comptable, suffi-moi dans toutes mes entreprises et scelle mon œuvre dans le bien et la paix par la vérité de Baya'ra'ashin.",
    "invocationEn": "O All-Sufficient, O Reckoner, suffice me in all my affairs and seal my deeds in goodness and peace by Baya'ra'ashin.",
    "invocationHa": "Ya Mai Wadatarwa, Ya Mai Lissafi, ka wadatar da ni a duk ayyukana, ka rufe min aikina da alheri da zaman lafiya albarkacin Baya'ra'ashin.",
    "talsamCode": "٥٨٣ ٣٣٣ ب ب ب 🏁",
    "wafq3x3": [
      ["195", "190", "198"],
      ["200", "194", "189"],
      ["188", "199", "197"]
    ]
  }
];

export const BARHATIAH_GRAND_RECIPES: BarhatiahRecipe[] = [
  {
    id: 'recipe_exorcism_unbinding',
    titleAr: 'وصفة الحل الكبرى وفك السحر والتوابع',
    titleFr: 'Grand Protocole de Désenvoûtement & Dissolution des Nœuds',
    titleEn: 'Grand Protocol for Exorcism & Unbinding Curses',
    titleHa: 'Hanyar Rushe Sihiri da Warware Kulle-Kulle',
    category: 'protection',
    descriptionFr: 'Méthode canonique majeure du Sharh al-Barhatiah pour dissoudre les sortilèges tenaces, les liaisons d\'attachement occulte, le mauvais œil destructeur et les blocages inexpliqués qui entravent la santé, le mariage ou la réussite financière.',
    descriptionEn: 'Canonical method from Sharh al-Barhatiah to dissolve persistent curses, evil eye, and unexplained life stagnation blocking health or marriage.',
    descriptionHa: 'Hanyar asali ta Sharh al-Barhatiah domin ruguza sihiri mai tsanani, bakin ido, da cikas a rayuwa.',
    materialsFr: [
      'Encre de safran pur et eau de rose distillée',
      'Plat ou assiette neuve en céramique blanche',
      '7 litres d\'eau de source pure ou eau de Zamzam',
      'Encens de benjoin blanc (Jawi) et myrrhe purifiée',
      'Feuille de papier parchemin pur sans impression'
    ],
    materialsEn: [
      'Pure saffron and distilled rosewater ink',
      'New white ceramic plate',
      '7 liters of pure spring water or Zamzam water',
      'White benzoin gum and purified myrrh incense',
      'Clean unlined parchment paper sheet'
    ],
    materialsHa: [
      'Tawadar Za\'afaran da ruwan Rosewater',
      'Farantin karfe ko na alminiyon sabo fari',
      'Lita 7 na ruwan rijiya mai tsarki ko Zamzam',
      'Turaren Jawi fari da Murr',
      'Farar takarda mai tsarki'
    ],
    timingFr: 'À entreprendre le lundi au lever du soleil ou la nuit du jeudi au vendredi (1er tiers de la nuit).',
    timingEn: 'Begin on Monday sunrise or Thursday night (1st third of the night).',
    timingHa: 'A fara ranar Litinin da hantsi ko daren Juma\'a tsakiyar dare.',
    stepsFr: [
      'Faire l\'ablution complète (Wudu) et porter des vêtements propres de couleur claire.',
      'Allumer l\'encens de Benjoin et réciter 3 fois la sourate Al-Fatiha et Ayat al-Kursi.',
      'Écrire à l\'encre de safran les 7 premiers noms (Barhatihin, Kararin, Tatlihin, Tawran, Mazjalin, Bazjalin, Tarqabin) ainsi que le nom "Kaydahoola" (قزمز / كيدهولا).',
      'Dissoudre l\'écriture dans l\'eau de source.',
      'Répéter la formule d\'adjuration (Da\'wah) 7 fois au-dessus de l\'eau.',
      'Se laver avec cette eau pendant 3 jours consécutifs (en jetant l\'eau utilisée au pied d\'un arbre propre).'
    ],
    stepsEn: [
      'Perform full ablution (Wudu) and wear clean light-colored garments.',
      'Ignite the Benzoin incense and recite Surah Al-Fatiha and Ayat al-Kursi 3 times.',
      'Inscribe the first 7 names plus Kaydahoola with saffron ink onto the white plate.',
      'Dissolve the saffron calligraphy into the 7 liters of spring water.',
      'Recite the Barhatiah adjuration 7 times over the water bowl.',
      'Bathe with this water for 3 consecutive days (discarding runoff at the base of a clean tree).'
    ],
    stepsHa: [
      'Yi alwala ta cika ka saka tufafi masu tsarki.',
      'Kona turaren Jawi ka karanta Fatiha da Ayatul Kursiyyu sau 3.',
      'Rubuta sunaye 7 na farko da Kaydahoola da za\'afaran a kwanon faranti.',
      'Wanke rubutun a cikin lita 7 na ruwa mai tsarki.',
      'Karanta addu\'ar Barhatiah sau 7 a kan ruwan.',
      'Yi wankan asiri da ruwan har kwana 3 (ka zubar da ruwan a gindin itaciya mai tsarki).'
    ],
    arabicFormula: 'بِسْمِ اللَّهِ العَظِيمِ، ابْطِلْ كُلَّ سِحْرٍ وَعَقْدٍ بِحَقِّ بَرْهَتِيهٍ كَرَرٍ كَيَدَهوُلَا',
    transliteration: 'Bismillahi al-Azeem, abtil kulla sihrin wa aqdin bi-haqqi Barhatihin, Kararin, Kaydahoola',
    talsamCode: '٧٧٧ ٩٩٩ ١٨٠١٩ 🔓'
  },
  {
    id: 'recipe_sustenance_prosperity',
    titleAr: 'وصفة جلب الرزق وتيسير التجارة',
    titleFr: 'Grand Protocole de Prospérité & Ouverture de la Subsistance',
    titleEn: 'Grand Protocol for Prosperity & Abundance',
    titleHa: 'Hanyar Buɗe Arziqi da Nasarar Kasuwanci',
    category: 'prosperity',
    descriptionFr: 'Protocole royal d\'attirance de la subsistance légitime, de déblocage financier et de prospérité commerciale basé sur le nom "Tuneshin" (طُونِشٍ) et le Sceau 3x3 de la Barhatiah.',
    descriptionEn: 'Royal protocol for attracting lawful abundance, financial unblocking, and business growth based on "Tuneshin" and the 3x3 Barhatiah Seal.',
    descriptionHa: 'Hanyar janyo arziqi na halal, buɗe kasuwanci, da samun nasara a harkokin kudi.',
    materialsFr: [
      'Feuille de parchemin végétal ou papier blanc',
      'Encre de safran parfumée au musc',
      'Encens d\'Oliban (Luban Dhakar) et Mastic'
    ],
    materialsEn: [
      'Vegetable parchment sheet or clean white paper',
      'Musk-infused saffron ink',
      'Frankincense (Luban Dhakar) and Mastic resin'
    ],
    materialsHa: [
      'Takarda fara mai tsarki',
      'Tawadar Za\'afaran mai turaren Musk',
      'Turaren Luban Dankar da Mastaki'
    ],
    timingFr: 'Le jeudi matin au lever du soleil durant la première heure de Jupiter (Al-Mushtari).',
    timingEn: 'Thursday morning at sunrise during the 1st hour of Jupiter.',
    timingHa: 'Ranar Alhamis da hantsi lokacin Tauraron Mushtari.',
    stepsFr: [
      'Se purifier et brûler de l\'encens d\'Oliban.',
      'Tracer le Wafq 3x3 de la valeur 369 au centre du parchemin.',
      'Écrire autour du carré le nom "Tuneshin" (طُونِشٍ) 19 fois avec le verset de la subsistance (Surah At-Talaq 2-3).',
      'Répéter le nom "Tuneshin" 369 fois.',
      'Placer le parchemin dans son lieu de travail ou coffre-fort.'
    ],
    stepsEn: [
      'Purify yourself and burn Frankincense.',
      'Inscribe the 3x3 Wafq of numerical value 369 at the center.',
      'Surround the square with "Tuneshin" written 19 times along with Surah At-Talaq v. 2-3.',
      'Recite "Tuneshin" 369 times.',
      'Keep the parchment at your business place, cash register, or safe.'
    ],
    stepsHa: [
      'Yi alwala ka kona turaren Luban.',
      'Zana Wafq 3x3 na lambar 369 a tsakiyar takarda.',
      'Rubuta sunan "Tuneshin" sau 19 da ayar arziqi (Suratut-Talaq v. 2-3) a kewaye.',
      'Karanta sunan "Tuneshin" sau 369.',
      'Aje takardar a cikin shagon kasuwancinca ko akwatin kudi.'
    ],
    arabicFormula: 'يا رَزَّاقُ يا شَكُورُ ارْزُقْنِي رِزْقاً حَلَالاً واسِعاً بِحَقِّ طُونِشٍ',
    transliteration: 'Ya Razzaqu ya Shakooru urzuqnee rizqan halalan wasi\'an bi-haqqi Tuneshin',
    talsamCode: '٣٦٩ ٥٥٥ ١٩١٩ 💰'
  },
  {
    id: 'recipe_love_reconciliation',
    titleAr: 'وصفة التآلف والتصالح والمحبة الشرعية',
    titleFr: 'Grand Protocole d\'Harmonie, Réconciliation & Affection Légitime',
    titleEn: 'Grand Protocol for Love, Reconciliation & Harmony',
    titleHa: 'Hanyar Karfafa Soyayya da Sasanta Ma\'aurata',
    category: 'spiritual',
    descriptionFr: 'Méthode d\'apaisement des rancœurs, de réconciliation entre conjoints séparés et d\'attirance de l\'affection mutuelle basée sur la combinaison sacrée des noms "Tatlihin" et "Bazjalin".',
    descriptionEn: 'Method for soothing grudges, reconciling estranged couples, and drawing mutual affection using "Tatlihin" and "Bazjalin".',
    descriptionHa: 'Hanyar sasanta ma\'aurata, goge tsana, da kara soyayya a tsakanin mutane.',
    materialsFr: [
      'Carafe en verre transparent remplie d\'eau de fleur d\'oranger',
      'Encre de safran infusée à l\'eau de rose',
      'Encens de benjoin blanc et de cannelle'
    ],
    materialsEn: [
      'Glass pitcher filled with orange blossom water',
      'Rosewater-infused saffron ink',
      'White benzoin and cinnamon incense'
    ],
    materialsHa: [
      'Kwanon gilashi da ruwan rosewater',
      'Tawadar za\'afaran da ruwan hure',
      'Turaren Jawi da Kirfa'
    ],
    timingFr: 'Le vendredi soir après le coucher du soleil (heure de Vénus).',
    timingEn: 'Friday evening after sunset (planetary hour of Venus).',
    timingHa: 'Ranar Juma\'a da daddare bayan Magriba.',
    stepsFr: [
      'Se purifier parfaitement et allumer l\'encens de benjoin.',
      'Écrire à l\'encre de safran les noms "Tatlihin" (845 fois en miniature) et "Bazjalin" (41 fois) au centre du parchemin.',
      'Dissoudre le document dans la carafe d\'eau de fleur d\'oranger.',
      'Répéter l\'invocation de l\'amour sincère 100 fois au-dessus de la préparation.',
      'Faire boire cette eau bénie aux deux époux durant 3 jours consécutifs.'
    ],
    stepsEn: [
      'Perform full ritual purification and ignite benzoin incense.',
      'Inscribe "Tatlihin" and "Bazjalin" with saffron ink onto clean parchment.',
      'Dissolve into the glass pitcher of orange blossom water.',
      'Recite the invocation of mutual affection 100 times over the vessel.',
      'Serve this blessed drink to both spouses over 3 consecutive days.'
    ],
    stepsHa: [
      'Yi alwala ka kona turaren Jawi da Kirfa.',
      'Rubuta "Tatlihin" da "Bazjalin" da za\'afaran a takarda fara.',
      'Wanke a kwanon ruwan rosewater.',
      'Karanta addu\'ar soyayya sau 100 a kan ruwan.',
      'Ba ma\'auratan ku sha har kwana 3.'
    ],
    arabicFormula: 'يا وَدُودُ يا رَؤُوفُ أَلِّفْ بَيْنَ القُلُوبِ بِحَقِّ تَتْلِيهٍ وَبَزْجَلٍ',
    transliteration: 'Ya Wadoodu ya Raoofu allif bayna al-quloobi bi-haqqi Tatlihin wa Bazjalin',
    talsamCode: '٨٤٥ ٤١ ٧٧٧ ❤️'
  },
  {
    id: 'recipe_healing_vitality',
    titleAr: 'وصفة الشفاء التام وطرد الأمراض المستعصية',
    titleFr: 'Grand Protocole de Guérison Spirituelle & Vitalité',
    titleEn: 'Grand Protocol for Healing & Spiritual Vitality',
    titleHa: 'Hanyar Samun Waraka da Sabunta Karfin Jiki',
    category: 'healing',
    descriptionFr: 'Protocole de revitalisation de la force vitale, de dissolution des maladies d\'origine inconnue et de renforcement de l\'immunité naturelle fondé sur le nom "Tawran" (طَوْرَانٍ).',
    descriptionEn: 'Protocol for vital force regeneration, clearing mystery ailments, and bolstering natural immunity based on "Tawran".',
    descriptionHa: 'Hanyar samun lafiya daga ciwo mai wuya da sabunta karfin jiki.',
    materialsFr: [
      '1 litre d\'eau de Zamzam ou d\'eau de pluie pure',
      'Encre de safran pur et miel de montagne sauvage',
      'Encens de mastic et de myrrhe'
    ],
    materialsEn: [
      '1 liter of Zamzam or pure rainwater',
      'Pure saffron ink and raw mountain honey',
      'Mastic and myrrh incense'
    ],
    materialsHa: [
      'Lita 1 na ruwan Zamzam ko na ruwan sama',
      'Tawadar za\'afaran da zuma mai kyau',
      'Turaren Mastaki da Murr'
    ],
    timingFr: 'Le dimanche matin au lever du soleil ou durant les nuits de pleine lune.',
    timingEn: 'Sunday morning at sunrise or full moon nights.',
    timingHa: 'Ranar Lahadi da hantsi ko daren cikar wata.',
    stepsFr: [
      'Préparer le plateau de travail en brûlant du mastic.',
      'Écrire "Tawran" 266 fois à l\'encre de safran sur une assiette neuve.',
      'Diluer le motif avec l\'eau de Zamzam et ajouter 3 cuillères de miel sauvage.',
      'Répéter l\'invocation de la santé 266 fois au-dessus du récipient.',
      'Consommer une tasse à jeun chaque matin pendant 7 jours.'
    ],
    stepsEn: [
      'Prepare workspace while burning mastic resin.',
      'Inscribe "Tawran" 266 times using saffron ink on a white plate.',
      'Dissolve into Zamzam water and stir in 3 spoonfuls of raw honey.',
      'Recite the health invocation 266 times over the bowl.',
      'Drink one cup on an empty stomach every morning for 7 days.'
    ],
    stepsHa: [
      'Kona turaren Mastaki a wurin aiki.',
      'Rubuta "Tawran" sau 266 da za\'afaran a kwanon faranti.',
      'Wanke da ruwan Zamzam ka zuba zuma cokali 3.',
      'Karanta addu\'ar samun lafiya sau 266 a kan ruwan.',
      'Sha kowace safe kafin cin abinci har kwana 7.'
    ],
    arabicFormula: 'يا حَيُّ يا قَيُّومُ اشْفِنِي مِنْ كُلِّ دَاءٍ وَبَلَاءٍ بِحَقِّ طَوْرَانٍ',
    transliteration: 'Ya Hayyu ya Qayyumu ishfinee min kulli da\'in wa bala\'in bi-haqqi Tawran',
    talsamCode: '٢٦٦ ٥٥٥ ٩٩٩ 🌿'
  },
  {
    id: 'recipe_master_khatim_28',
    titleAr: 'الحاتم الأكبر لأسماء البرهتية الثمانية والعشرين للحماية والجاه والمُلك',
    titleFr: 'Le Sceau Majeur Supérieur des 28 Noms de la Barhatiah (Khatim Al-Akbar)',
    titleEn: 'Grand Master Seal of the 28 Barhatiah Names (Khatim Al-Akbar)',
    titleHa: 'Babban Hatimin Sarakuna na Sunayen Barhatiah 28 (Khatim Al-Akbar)',
    category: 'spiritual',
    descriptionFr: 'Le Sceau Suprême attribué au Sheikh Ahmad al-Buni dans "Sharh al-Barhatiyyah". Ce diagramme maître englobe la totalité des fréquences des 28 Noms de la Barhatiah. Il confère à celui qui le porte une aura de majesté inébranlable, une protection absolue contre toutes les magies créées sur terre et une autorité spirituelle respectée par les hommes et les esprits.',
    descriptionEn: 'The Supreme Seal attributed to Sheikh Ahmad al-Buni in "Sharh al-Barhatiyyah". This master talisman encapsulates all 28 Barhatiah frequencies, granting its bearer overwhelming majesty, total immunity against all earthbound sorcery, and high spiritual authority.',
    descriptionHa: 'Babban Hatimi na Sheikh Ahmad al-Buni a cikin "Sharh al-Barhatiyyah". Wannan hatimi yana haɗa dukkan karfin Sunaye 28 na Barhatiah. Yana bawa mai sanye da shi kwarjini, kariya daga dukkan maita da sihiri, da daukaka a wurin mutane.',
    materialsFr: [
      'Parchemin animal ou papier parchemin végétal pur',
      'Encre royale faite de safran pur, eau de Zamzam, eau de rose et musc d\'orient',
      'Plume de calame en roseau taillée à la main',
      'Encens noble : mélange équivalent d\'Oliban (Luban Dhakar), Mastic et Bois d\'Aloès (Oudh)'
    ],
    materialsEn: [
      'Pure animal or vegetable parchment paper sheet',
      'Royal ink made from pure saffron, Zamzam water, rosewater, and oriental musk',
      'Hand-carved reed pen (Qalam)',
      'Noble incense blend: equal parts Frankincense, Mastic resin, and pure Aloeswood'
    ],
    materialsHa: [
      'Tattabara ko Farar takarda mai kyau da tsarki',
      'Tawadar mulki ta Za\'afaran da ruwan Zamzam, rosewater da turaren Musk',
      'Alkalamin cewa na icce',
      'Turare mai daraja: Hadin Luban Dankar, Mastaki da Oudh'
    ],
    timingFr: 'Le premier dimanche du mois lunaire, durant l\'heure du Soleil juste au lever du jour.',
    timingEn: 'First Sunday of the lunar month, during the planetary hour of the Sun at dawn.',
    timingHa: 'Lahadi ta farko ta watan Musulunci, da hantsi lokacin fitar rana.',
    stepsFr: [
      'Accomplir le grand lavage purificateur (Ghusl) et revêtir des habits blancs sanctifiés.',
      'Allumer l\'encens noble et réciter la Grande Da\'wah de la Barhatiah 3 fois pour sacraliser l\'espace.',
      'Calligraphier le carré magique 4x4 ou le cercle des 28 noms avec l\'encre de safran et de musc.',
      'Inscrire autour du sceau le verset du Trône (Ayat al-Kursi) et les 28 Noms Sacrés en numération Abjad.',
      'Exposer le talisman à la fumée d\'encens pendant la récitation complète des 28 Noms (chaque nom répété selon son poids Abjad).',
      'Plier le document dans un étui de cuir vert ou doré et le porter sur soi ou le suspendre à l\'entrée principale.'
    ],
    stepsEn: [
      'Perform complete ritual purification (Ghusl) and wear sanctified white robes.',
      'Light the noble incense blend and recite the Grand Barhatiah Invocation 3 times.',
      'Inscribe the 4x4 master square or 28-Name circle using the musk-saffron royal ink.',
      'Surround the seal with Ayat al-Kursi and the 28 Sacred Names in Abjad numerical order.',
      'Pass the talisman through the sacred incense smoke while reciting each of the 28 Names according to its Abjad count.',
      'Fold inside a green or gold leather pouch and wear near the heart or hang above main entrance.'
    ],
    stepsHa: [
      'Yi wankan tsarki da saka tufafi farare masu kyau.',
      'Kona turare mai daraja ka karanta Babbar Addu\'ar Barhatiah sau 3 domin tsarkake dakin.',
      'Rubuta Hatimi da tawadar za\'afaran da musk cikin natsuwa.',
      'Zana Ayatul Kursiyyu da Sunaye 28 na Barhatiah a kewaye da hatimin.',
      'Turaka takardar a turaren yayin karanta Sunaye 28 (kowane suna da adadin lamba ta Abjad).',
      'Ninke takardar a lalle ko fatar kore ko zinari ka sanya a aljihu ko sama da kofar gida.'
    ],
    arabicFormula: 'بِسْمِ اللَّهِ العَظِيمِ الأَعْظَمِ، خَتَمْتُ عَلَى نَفْسِي وَأَهْلِي وَمَالِي بِسِرِّ المِيثَاقِ المَكْنُونِ فِي الأَسْمَاءِ الثَّمَانِيَةِ وَالعِشْرِينَ',
    transliteration: 'Bismillahi al-Azeemi al-A\'dham, khatamtu ala nafsee wa ahlee wa malee bi-sirri al-meethaqi al-maknooni fee al-asma\'i ath-thamaniyati wal-ishreen',
    talsamCode: '٢٨ ٢٨ ٢٨ 💎👑🛡️'
  },
  {
    id: 'recipe_hidden_treasure_unveiling',
    titleAr: 'وصفة فتح المغاليق وكشف الكنوز والغيوب والفرص المخبأة',
    titleFr: 'Grand Protocole d\'Ouverture des Portes Scellées & Unlocking Opportunities',
    titleEn: 'Grand Protocol for Opening Sealed Doors & Unveiling Hidden Blessings',
    titleHa: 'Hanyar Buɗe Kofofin da Aka Kulle da Bayyana Nasara da Arziqi',
    category: 'prosperity',
    descriptionFr: 'Secret d\'élite tiré des annotations rares du Sharh al-Barhatiah. Utilisé pour briser les blocages karmiques et financiers extrêmes, ouvrir les portes d\'opportunités professionnelles auparavant inaccessibles et inspirer des intuitions géniales pour les affaires.',
    descriptionEn: 'Elite secret derived from rare Sharh al-Barhatiah commentaries. Used to smash severe financial locks, open previously closed career doors, and spark brilliant business intuition.',
    descriptionHa: 'Babban sirri na musamman domin ruguza cikas na arziqi, bude kofofin aiki da kasuwanci da aka kulle, da samun dubara ta samaniya.',
    materialsFr: [
      'Eau de zamzam ou eau de pluie captée le vendredi',
      'Encre de safran mélangée à de la poudre d\'ambre pur',
      'Encens de benjoin blanc et de graines de myrrhe'
    ],
    materialsEn: [
      'Zamzam water or Friday rainwater',
      'Saffron ink mixed with pure ambergris powder',
      'White benzoin and myrrh resin incense'
    ],
    materialsHa: [
      'Ruwan Zamzam ko ruwan sama na ranar Juma\'a',
      'Tawadar za\'afaran da amber',
      'Turaren Jawi da Murr'
    ],
    timingFr: 'Le vendredi soir à la troisième heure de la nuit (Heure de la Lune/Mercure).',
    timingEn: 'Friday night during the 3rd hour of the night.',
    timingHa: 'Ranar Juma\'a daddare karfe 11 na dare.',
    stepsFr: [
      'Répéter le nom "Barhatihin" (662 fois) puis "Qalanhoodin" (285 fois) et "Kaydahoola" (85 fois).',
      'Rédiger la formule d\'ouverture divine sur une feuille blanche neuve.',
      'Diluer l\'encre dans l\'eau de Zamzam et en asperger les mains et le visage avant toute réunion ou négociation financière.',
      'Répéter l\'invocation de déblocage 21 fois après chaque prière obligatoire pendant 7 jours.'
    ],
    stepsEn: [
      'Recite "Barhatihin" (662 times), "Qalanhoodin" (285 times), and "Kaydahoola" (85 times).',
      'Inscribe the divine opening formula onto a fresh unlined sheet.',
      'Dissolve into Zamzam water and wash hands and face prior to important business negotiations.',
      'Recite the unbinding invocation 21 times after each obligatory prayer for 7 consecutive days.'
    ],
    stepsHa: [
      'Karanta "Barhatihin" (sau 662), "Qalanhoodin" (sau 285), da "Kaydahoola" (sau 85).',
      'Rubuta addu\'ar bude kofa a takarda fara.',
      'Wanke da ruwan Zamzam ka shafa a fuska da hannaye kafin fita neman aiki ko kasuwanci.',
      'Maimaita addu\'ar sau 21 bayan kowace sallar farilla har kwana 7.'
    ],
    arabicFormula: 'يا فَتَّاحُ يا عَلِيمُ افْتَحْ لِي أَبْوَابَ الخَيْرِ وَالرِزْقِ الكَرِيمِ بِحَقِّ بَرْهَتِيهٍ وَقَلْنَهُودٍ وَكَيْدَهُولَا',
    transliteration: 'Ya Fattahu ya Aleemu iftah lee abwaba al-khayri war-rizqi al-karim bi-haqqi Barhatihin wa Qalanhoodin wa Kaydahoola',
    talsamCode: '٦٦٢ ٢٨٥ ٨٥ 🗝️🔓'
  },
  {
    id: 'recipe_royal_elevation_charisma',
    titleAr: 'وصفة الهيبة العظمى والقبول والرفعة بين الحكام والناس',
    titleFr: 'Grand Protocole de Prestige, Élévation Royale & Charisme Inégalé',
    titleEn: 'Grand Protocol for Royal Charisma, Prestige & Public Elevation',
    titleHa: 'Hanyar Samun Kwarjini, Daukaka da Karbuwa a Wurin Mutane',
    category: 'spiritual',
    descriptionFr: 'Formule d\'influence noble combinant les fréquences de Mazjalin (المعز), Barhashin (الرحيم) et Shamkhahishin. Elle entoure l\'opérateur d\'un magnétisme captivant, suscite le respect spontané des supérieurs et protège contre le mépris et l\'humiliation.',
    descriptionEn: 'Noble influence formula combining Mazjalin, Barhashin, and Shamkhahishin. It wraps the practitioner in captivating magnetic authority, commands instant respect from leaders, and shields against humiliation.',
    descriptionHa: 'Hanyar kwarjini da daukaka ta hanyar Mazjalin, Barhashin da Shamkhahishin. Yana sanya mutum ya kwarjini a idon mutane da mahukunta kuma yana kiyaye shi daga wulakanci.',
    materialsFr: [
      'Huile essentielle pure de bois de santal et de musc blanc',
      'Encre de safran infusée à l\'eau de rose',
      'Encens de bois d\'aloès (Oudh) et benjoin'
    ],
    materialsEn: [
      'Pure essential oil of sandalwood and white musk',
      'Saffron ink infused with natural rosewater',
      'Aloeswood (Oudh) and benzoin incense'
    ],
    materialsHa: [
      'Man turare mai inganci na Sandalwood da White Musk',
      'Tawadar za\'afaran da ruwan rosewater',
      'Turaren Oudh da Jawi'
    ],
    timingFr: 'Le dimanche matin au lever du soleil ou lors du transit lunaire dans la demeure d\'Al-Jabhah.',
    timingEn: 'Sunday morning at sunrise or during lunar transit in Al-Jabhah.',
    timingHa: 'Ranar Lahadi da hantsi lokacin hantsi.',
    stepsFr: [
      'Brûler le bois d\'aloès et oindre son front d\'une goutte de musc blanc.',
      'Répéter le nom "Mazjalin" 47 fois et "Barhashin" 509 fois.',
      'Écrire le talsam du prestige sur un carré de soie jaune ou papier parchemin.',
      'Porter le sceau plié dans la poche supérieure du vêtement lors des événements publics.'
    ],
    stepsEn: [
      'Burn aloeswood and apply a drop of white musk oil onto your forehead.',
      'Recite "Mazjalin" 47 times and "Barhashin" 509 times.',
      'Inscribe the charisma talisman onto yellow silk or fine parchment.',
      'Carry the folded seal in your chest pocket during public gatherings.'
    ],
    stepsHa: [
      'Kona turaren Oudh ka shafa almiski a goshi.',
      'Karanta "Mazjalin" sau 47 da "Barhashin" sau 509.',
      'Rubuta Hatimin kwarjini a takarda ko gidan siliki dorawa.',
      'Sanya a aljihun kirji lokacin fita taro ko ganawa da manyan mutane.'
    ],
    arabicFormula: 'يا مُعِزُّ يا عَزِيزُ أَلْقِ عَلَيَّ مَهَابَةً وَقَبُولاً وَرِفْعَةً بِحَقِّ مَزْجَلٍ وَبَرْهَشٍ',
    transliteration: 'Ya Mu\'izzu ya Azeezu alqi alayya mahabatan wa qaboolan wa rif\'atan bi-haqqi Mazjalin wa Barhashin',
    talsamCode: '٤٧ ٥٠٩ ٩٩٩ 👑✨'
  },
  {
    id: 'recipe_debt_elimination_abundance',
    titleAr: 'وصفة قضاء الديون الصعبة وتيسير الأرزاق المفاجئة',
    titleFr: 'Grand Protocole de Libération des Dettes & Abondance Inattendue',
    titleEn: 'Grand Protocol for Total Debt Relief & Unforeseen Sustenance',
    titleHa: 'Hanyar Biyan Bashi Mai Nauyi da Samun Arziqi na Ba-Zata',
    category: 'prosperity',
    descriptionFr: 'Procédé théurgique réputé dans le Sharh al-Barhatiah pour dissoudre les dettes écrasantes et attirer les ouvertures financières inattendues via les noms Barshanin, Tuneshin et Baya\'ra\'ashin.',
    descriptionEn: 'Renowned theurgic technique from Sharh al-Barhatiah to dissolve crushing financial debt and attract unexpected monetary relief via Barshanin, Tuneshin, and Baya\'ra\'ashin.',
    descriptionHa: 'Babbar hanyar warware bashi mai nauyi da samun kudi daga inda ba a tsammata ba ta hanyar Barshanin, Tuneshin da Baya\'ra\'ashin.',
    materialsFr: [
      'Papier vert ou blanc pur',
      'Encre de safran et d\'eau de rose',
      'Encens de mastic et de coriandre sèche'
    ],
    materialsEn: [
      'Green or pure white paper',
      'Saffron and rosewater ink',
      'Mastic resin and dry coriander incense'
    ],
    materialsHa: [
      'Kore ko farar takarda mai tsarki',
      'Tawadar za\'afaran da rosewater',
      'Turaren Mastaki da Kusbara'
    ],
    timingFr: 'Le mercredi soir après la prière d\'Isha ou durant le dernier tiers de la nuit du vendredi.',
    timingEn: 'Wednesday evening after Isha prayer or during the last third of Friday night.',
    timingHa: 'Ranar Laraba daddare bayan sallar Isha ko karshen daren Juma\'a.',
    stepsFr: [
      'Réciter 100 fois Astaghfirullah puis les noms "Barshanin" (553 fois) et "Tuneshin" (369 fois).',
      'Écrire le chiffre total du montant de la dette au centre du carré magique 3x3 entoure des noms divins.',
      'Répéter l\'invocation du remboursement sincère 33 fois.',
      'Conserver le talisman près de ses documents comptables jusqu\'à la résolution complète des dettes.'
    ],
    stepsEn: [
      'Recite Astaghfirullah 100 times, followed by "Barshanin" (553 times) and "Tuneshin" (369 times).',
      'Write the total debt numerical value inside a 3x3 magic square encircled by divine names.',
      'Recite the debt release invocation 33 times over the parchment.',
      'Keep the talisman near accounting records until debts are entirely cleared.'
    ],
    stepsHa: [
      'Karanta Astagfirullah sau 100, sannan "Barshanin" (sau 553) da "Tuneshin" (sau 369).',
      'Rubuta adadin kudin bashin a tsakiyar Hatimi 3x3 kewaye da sunayen Allah.',
      'Maimaita addu\'ar biyan bashi sau 33.',
      'Aje takardar tare da takardun kasuwanci ko asusu har kudin ya biyu.'
    ],
    arabicFormula: 'يا بَاسِطُ يا كَافِي اقْضِ دَيْنِي وَأَغْنِنِي بِحَلاَلِكَ عَنْ حَرَامِكَ بِحَقِّ بَرْشَانٍ وَطُونِشٍ وَبَيَعْرَشٍ',
    transliteration: 'Ya Basitu ya Kafee iqdi daynee wa aghninei bi-halalika an haramika bi-haqqi Barshanin wa Tuneshin wa Baya\'ra\'ashin',
    talsamCode: '٥٥٣ ٣٦٩ ٥٨٣ 💳💵'
  },
  {
    id: 'recipe_night_attacks_exorcism',
    titleAr: 'وصفة الحصن المنيع ضد طوارق الليل والكوابيس والشياطين',
    titleFr: 'Grand Protocole du Bouclier Nocturne & Destruction des Parasites de l\'Ombre',
    titleEn: 'Grand Protocol of the Night Shield & Nightmare Exorcism',
    titleHa: 'Garkuwar Dare Domin Kariya daga Firgitar Barchi da Shaidanu',
    category: 'protection',
    descriptionFr: 'Bouclier de protection intégrale contre les cauchemars récurrents, la paralysie du sommeil, les terreurs nocturnes des enfants et les attaques d\'entités astrales négatives. Il s\'appuie sur la combinaison vibratoire de Tarqabin, Khutirin et Kaydahoola.',
    descriptionEn: 'Full protection shield against recurring nightmares, sleep paralysis, night terrors in children, and astral entity attacks using Tarqabin, Khutirin, and Kaydahoola.',
    descriptionHa: 'Garkuwa mai karfi domin kariya daga firgitar barchi, maita ta dare, tsoratar yara, da shaidanu ta hanyar Tarqabin, Khutirin da Kaydahoola.',
    materialsFr: [
      'Flacon pulvérisateur rempli d\'eau de fleur d\'oranger et d\'une pincée de sel marin pur',
      'Encre de safran',
      'Encens de benjoin et de graines de nigelle'
    ],
    materialsEn: [
      'Spray bottle filled with orange blossom water and a pinch of pure sea salt',
      'Saffron ink',
      'Benzoin and black seed (Nigella) incense'
    ],
    materialsHa: [
      'Kwanon ruwan rosewater da gishirin karkara',
      'Tawadar za\'afaran',
      'Turaren Jawi da Habbatussauda'
    ],
    timingFr: 'Tous les soirs avant le coucher ou la nuit du lundi au mardi.',
    timingEn: 'Every evening before sleep or Monday night.',
    timingHa: 'Kowace daddare kafin kwanciya barchi.',
    stepsFr: [
      'Brûler la nigelle et le benjoin dans la chambre à coucher.',
      'Répéter "Tarqabin" 1202 fois et "Khutirin" 815 fois sur le récipient d\'eau salée.',
      'Vaporiser les coins de la chambre et sous le lit.',
      'Placer la calligraphie sacrée sous l\'oreiller pour garantir un sommeil paisible et réparateur.'
    ],
    stepsEn: [
      'Burn black seed and benzoin incense inside the bedroom.',
      'Recite "Tarqabin" 1202 times and "Khutirin" 815 times over the salted floral water.',
      'Mist the room corners and underneath the bed.',
      'Place the written sacred shield under the pillow for peaceful, undisturbed sleep.'
    ],
    stepsHa: [
      'Kona habbatussauda da Jawi a cikin dakin barchi.',
      'Karanta "Tarqabin" sau 1202 da "Khutirin" sau 815 a kan ruwan gishiri.',
      'Yayafa ruwan a kusurwoyin daki da karkashin gado.',
      'Sanya takardar rubutun a karkashin matashin kai domin barchi mai aminci.'
    ],
    arabicFormula: 'يا حَفِيظُ يا مَانِعُ احْفَظْنِي فِي مَنَامِي وَيَقَظَتِي مِنْ كُلِّ شَيْطَانٍ وَطَارِقٍ بِحَقِّ تَرَقَّبٍ وَخَوْطِيرٍ',
    transliteration: 'Ya Hafeedu ya Mani\'u ihfadhnee fee manamee wa yaqadhatee min kulli shaytanin wa tariqin bi-haqqi Tarqabin wa Khutirin',
    talsamCode: '١٢٠٢ ٨١٥ ٧٧٧ 🌙🛡️'
  }
];

// ============================================================================
// LES INVOCATIONS CANONIQUES (CANONICAL INVOCATIONS)
// ============================================================================
export const BARHATIAH_INVOCATIONS: BarhatiahInvocation[] = [
  {
    id: 'inv_grand_dawah',
    titleAr: 'الدعوة الكبرى الشريفة لعهد البرهتية',
    titleFr: 'La Grande Évocation Canonique (Da\'wah) du Serment',
    titleEn: 'The Canonical Grand Barhatiah Invocation (Da\'wah)',
    titleHa: 'Cikakken Karatun Babbar Addu\'ar Barhatiah',
    type: 'dawah',
    arabicText: `بِسْمِ اللهِ المَلِكِ القُدُّوسِ العَظِيمِ الأَعْظَمِ، الَّذِي أَخَذَ العَهْدَ عَلَى سَائِرِ الأَرْوَاحِ وَالمُلُوكِ العُلْوِيَّةِ وَالسُّفْلِيَّةِ.

بَرْهَتِيهٍ بَرْهَتِيهٍ، كَرَرٍ كَرَرٍ، تَتْلِيهٍ تَتْلِيهٍ، طَوْرَانٍ طَوْرَانٍ، مَزْجَلٍ مَزْجَلٍ، بَزْجَلٍ بَزْجَلٍ، تَرَقَّبٍ تَرَقَّبٍ، بَرْهَشٍ بَرْهَشٍ، غَلْمَشٍ غَلْمَشٍ، خَوْطِيرٍ خَوْطِيرٍ، قَلْنَهُودٍ قَلْنَهُودٍ، بَرْشَانٍ بَرْشَانٍ، كِظَهِيرٍ كِظَهِيرٍ، نَمُوشَلَخٍ نَمُوشَلَخٍ، بَرَهَيُولا بَرَهَيُولا، بَشْكِيلَخٍ بَشْكِيلَخٍ، قَزْمَزٍ قَزْمَزٍ، أَنْغَلَلِيطٍ أَنْغَلَلِيطٍ، قَبَرَاَتٍ قَبَرَاَتٍ، غَيَاهَا غَيَاهَا، كَيْدَهوُلَا كَيْدَهوُلَا، شَمْخَاهِرٍ شَمْخَاهِرٍ، شَمْخَاهِيرٍ شَمْخَاهِيرٍ، بَكَهَطَطَهُونِيَةٍ بَكَهَطَطَهُونِيَةٍ، بَشَارَشٍ بَشَارَشٍ، طُونِشٍ طُونِشٍ، شَمْخَابَارُوحٍ شَمْخَابَارُوحٍ، بَيَعْرَشٍ بَيَعْرَشٍ.

أَجِيبُوا أَيُّهَا المُلُوكُ وَالرُّوحَانِيُّونَ، وَاحْفَظُونَا وَاعِينُونَا بِحَقِّ المِيثَاقِ العَظِيمِ الَّذِي أُخِذَ عَلَيْكُمْ، وَبِعِزَّةِ اللهِ القَادِرِ العَلِيِّ العَظِيمِ.`,
    transliteration: `Bismillahi al-Maliki al-Quddusi al-Azeemi al-A'dham, alladhi akhadha al-ahda ala sa'iri al-arwahi wal-mulooki al-ulwiyyati was-sufliyyah.

Barhatihin Barhatihin, Kararin Kararin, Tatlihin Tatlihin, Tawran Tawran, Mazjalin Mazjalin, Bazjalin Bazjalin, Tarqabin Tarqabin, Barhashin Barhashin, Ghalmashin Ghalmashin, Khutirin Khutirin, Qalanhoodin Qalanhoodin, Barshanin Barshanin, Kathirin Kathirin, Namushalakhin Namushalakhin, Barhayula Barhayula, Bashkilakhin Bashkilakhin, Qazmazin Qazmazin, Anaghlalitin Anaghlalitin, Qabratin Qabratin, Ghiya-ha Ghiya-ha, Kaydahoola Kaydahoola, Shamkhahirin Shamkhahirin, Shamkhahirin Shamkhahirin, Bakahtatahoniyatin Bakahtatahoniyatin, Basharashin Basharashin, Tuneshin Tuneshin, Shamkhabaroohin Shamkhabaroohin, Baya'ra'ashin Baya'ra'ashin.

Ajeeboo ayyuha al-mulooku war-roohaniyyoon, wahfadhona wa a'eenoona bi-haqqi al-meethaqi al-azeemi alladhi ukhidha alaykum, wa bi-izzatillahi al-Qadiri al-Aliyyi al-Azeem.`,
    translationFr: `Au nom de Dieu, le Souverain, le Très-Saint, le Suprême, le Très-Grand, qui a scellé le pacte primordial sur l'ensemble des esprits et des rois célestes et terrestres.

[Les 28 Noms Sacrés du Serment] :
1. Barhatihin Barhatihin (Le Très-Saint, L'Absolument Pur)
2. Kararin Kararin (Le Dieu de toute chose)
3. Tatlihin Tatlihin (Le Puissant, L'Informé)
4. Tawran Tawran (Le Vivant, Le Subsistant)
5. Mazjalin Mazjalin (Le Fort, Le Créateur)
6. Bazjalin Bazjalin (Le Connaisseur, L'Unique)
7. Tarqabin Tarqabin (Le Vigilant, Le Protecteur)
8. Barhashin Barhashin (Le Maternant, Le Clément)
9. Ghalmashin Ghalmashin (Le Capable, Le Roi)
10. Khutirin Khutirin (Le Puissant, Le Vrai)
11. Qalanhoodin Qalanhoodin (Le Fort, L'Auditif)
12. Barshanin Barshanin (Le Bienveillant, Le Sage)
13. Kathirin Kathirin (Le Clément, Le Miséricordieux)
14. Namushalakhin Namushalakhin (Le Très-Haut, Le Grand)
15. Barhayula Barhayula (La Lumière Manifeste)
16. Bashkilakhin Bashkilakhin (Le Clément, Le Bienveillant)
17. Qazmazin Qazmazin (Le Protecteur, Le Fort)
18. Anaghlalitin Anaghlalitin (Le Sage, Le Clément)
19. Qabratin Qabratin (Le Puissant, Le Vainqueur)
20. Ghiya-ha Ghiya-ha (Le Secoureur, Le Sauveur)
21. Kaydahoola Kaydahoola (Le Créateur, Le Puissant)
22. Shamkhahirin Shamkhahirin (Le Juge Suprême)
23. Shamkhahirin Shamkhahirin (Le Très-Haut)
24. Bakahtatahoniyatin Bakahtatahoniyatin (Le Puissant, L'Éternel)
25. Basharashin Basharashin (Le Très-Grand, Le Clément)
26. Tuneshin Tuneshin (Le Répondant, Le Proche)
27. Shamkhabaroohin Shamkhabaroohin (Le Protecteur, Le Glorieux)
28. Baya'ra'ashin Baya'ra'ashin (Le Premier, Le Dernier).

Répondez, ô rois et entités spirituelles, protégez-nous et secourez-nous par la vérité de la grande alliance conclue avec vous, et par la toute-puissance et la majesté de Dieu, le Puissant, le Très-Haut, l'Incomparable.`,
    translationEn: `In the name of God, the Sovereign, the Most Holy, the Supreme, the Most Great, who sealed the ancient covenant upon all spirits and celestial and terrestrial kings.

[The 28 Sacred Names of the Covenant]:
1. Barhatihin Barhatihin (The All-Holy, Pure Beyond Measure)
2. Kararin Kararin (God of All Things)
3. Tatlihin Tatlihin (The Almighty, The All-Aware)
4. Tawran Tawran (The Ever-Living, The Self-Subsisting)
5. Mazjalin Mazjalin (The Mighty, The Creator)
6. Bazjalin Bazjalin (The All-Knowing, The One)
7. Tarqabin Tarqabin (The Watchful, The Shield)
8. Barhashin Barhashin (The Compassionate, The Merciful)
9. Ghalmashin Ghalmashin (The Capable, The Sovereign King)
10. Khutirin Khutirin (The Powerful, The Truth)
11. Qalanhoodin Qalanhoodin (The Strong, The All-Hearing)
12. Barshanin Barshanin (The Benevolent, The Wise)
13. Kathirin Kathirin (The Clement, The Merciful)
14. Namushalakhin Namushalakhin (The Exalted, The Supreme)
15. Barhayula Barhayula (The Manifest Light)
16. Bashkilakhin Bashkilakhin (The Most Gracious, The Gentle)
17. Qazmazin Qazmazin (The Protector, The Mighty)
18. Anaghlalitin Anaghlalitin (The Wise, The Clement)
19. Qabratin Qabratin (The Almighty, The Victorious)
20. Ghiya-ha Ghiya-ha (The Succorer, The Savior)
21. Kaydahoola Kaydahoola (The Creator, The Powerful)
22. Shamkhahirin Shamkhahirin (The Supreme Judge)
23. Shamkhahirin Shamkhahirin (The Most High)
24. Bakahtatahoniyatin Bakahtatahoniyatin (The Powerful, The Eternal)
25. Basharashin Basharashin (The Most Great, The Clement)
26. Tuneshin Tuneshin (The Responsive, The Near)
27. Shamkhabaroohin Shamkhabaroohin (The Protector, The Glorious)
28. Baya'ra'ashin Baya'ra'ashin (The First, The Last).

Answer, O spiritual kings and guardians, protect us and assist us by the truth of the grand covenant sealed upon you, and by the glory and majesty of God, the All-Powerful, the Exalted, the Supreme.`,
    translationHa: `Da sunan Allah, Mai Mulki, Mafi Tsarki, Mafi Girma, Mafi Daukaka, wanda ya kulla alkawari da dukkan ruhanai da sarakunan samaniya da na kasa.

[Sunaye 28 Masu Tsarki Maimaitatku]:
1. Barhatihin Barhatihin (Mafi Tsarki, Tsatttakan Sarki)
2. Kararin Kararin (Ubangijin Kowane Abu)
3. Tatlihin Tatlihin (Mafi Iko, Mafi Sani)
4. Tawran Tawran (Rai Rayayye, Rayayyen da ke Tsaye da Kansa)
5. Mazjalin Mazjalin (Mafi Karfi, Mai Halitta)
6. Bazjalin Bazjalin (Gwani, Mabuwayi, Makaɗaici)
7. Tarqabin Tarqabin (Mai Tsaro da Kariya)
8. Barhashin Barhashin (Mai Tausayi da Jinkai)
9. Ghalmashin Ghalmashin (Mai Iko, Sarkin Sarakuna)
10. Khutirin Khutirin (Mafi Karfi, Gaskiya Mai Abbada)
11. Qalanhoodin Qalanhoodin (Mafi Karfi, Mai Ji)
12. Barshanin Barshanin (Mai Kyautatawa, Mai Hikima)
13. Kathirin Kathirin (Mai Jinkai da Tausayi)
14. Namushalakhin Namushalakhin (Mafi Daukaka, Mafi Girma)
15. Barhayula Barhayula (Hasken Samaniya Bayyananne)
16. Bashkilakhin Bashkilakhin (Mai Rahama da Tausayi)
17. Qazmazin Qazmazin (Mai Tsaro da Karfi)
18. Anaghlalitin Anaghlalitin (Mai Hikima da Hakuri)
19. Qabratin Qabratin (Mabuwayi Mai Nasara)
20. Ghiya-ha Ghiya-ha (Mai Agaji da Ceto)
21. Kaydahoola Kaydahoola (Mai Halitta, Mabuwayi)
22. Shamkhahirin Shamkhahirin (Ubangiji Mai Hukunci)
23. Shamkhahirin Shamkhahirin (Mafi Daukaka)
24. Bakahtatahoniyatin Bakahtatahoniyatin (Mabuwayi Mai Vada)
25. Basharashin Basharashin (Mafi Girma, Mai Tausayi)
26. Tuneshin Tuneshin (Mai Amsawa, Mafi Kusa)
27. Shamkhabaroohin Shamkhabaroohin (Mai Tsaro, Mai Girma)
28. Baya'ra'ashin Baya'ra'ashin (Na Farko, Na Karshe).

Ku amsa ya sarakuna da ruhanai, ku tsare mu ku taimake mu albarkacin babbar yarjejeniya da aka kulla da ku, da daukaka da karfin Allah Mafi Iko, Mafi Daukaka, Mafi Girma.`,
    usageInstructionsFr: 'À lire 1 ou 3 fois au début de chaque séance de zikr ou de travail ésotérique pour sanctifier l\'espace et activer la protection céleste.',
    usageInstructionsEn: 'Recite 1 or 3 times at the opening of any spiritual session to sanctify space and activate divine shielding.',
    usageInstructionsHa: 'A karanta sau 1 ko 3 a farkon kowane zikiri domin tsabta da samun kariya ta samaniya.'
  },
  {
    id: 'inv_kasm',
    titleAr: 'قسم الزجر الشريف لعهد البرهتية',
    titleFr: 'Le Serment de Contrainte & d\'Adjuration (Kasm Al-Zajr)',
    titleEn: 'The Oath of Adjuration & Spiritual Control (Kasm Al-Zajr)',
    titleHa: 'Addu\'ar Tsawa da Horarwa na Barhatiah (Kasm Al-Zajr)',
    type: 'kasm',
    arabicText: `بِسْمِ اللهِ العَظِيمِ الأَعْظَمِ، أَقْسَمْتُ عَلَيْكُمْ أَيُّهَا المُلُوكُ الرُّوحَانِيُّونَ، بِعِزِّ عِزِّ اللهِ، وَبِنُورِ وَجْهِ اللهِ، وَبِمَا جَرَى بِهِ القَلَمُ مِنْ عِنْدِ اللهِ، إِلَى مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، أَنْ تُجِيبُوا دَعْوَتِي، وَتَقْضُوا حَاجَتِي، وَتَكُونُوا عَوْناً لِي فِي طَاعَةِ اللهِ.

بِعِزَّةِ بَرْهَتِيهٍ بَرْهَتِيهٍ، كَرَرٍ كَرَرٍ، تَتْلِيهٍ تَتْلِيهٍ، طَوْرَانٍ طَوْرَانٍ، مَزْجَلٍ مَزْجَلٍ، بَزْجَلٍ بَزْجَلٍ، تَرَقَّبٍ تَرَقَّبٍ.

أَجِيبُوا وَعَجِّلُوا بِالطَّاعَةِ وَالإِجَابَةِ، بَارَكَ اللهُ فِيكُمْ وَعَلَيْكُمْ.`,
    transliteration: `Bismillahi al-Azeemi al-A'dham, aqsamtu alaykum ayyuha al-mulooku ar-roohaniyyoon, bi-izzi izzillahi, wa bi-noori wajhillahi, wa bima jara bihi al-qalamu min indillahi, ila Muhammadin sallallahu alayhi wa sallam, an tujeeboo da'watee, wa taqdoo hajatee, wa takoonoo awnan lee fee ta'atillahi.

Bi-izzati Barhatihin Barhatihin, Kararin Kararin, Tatlihin Tatlihin, Tawran Tawran, Mazjalin Mazjalin, Bazjalin Bazjalin, Tarqabin Tarqabin.

Ajeeboo wa ajjiloo bit-ta'ati wal-ijabah, barakallahu feekum wa alaykum.`,
    translationFr: `Au nom de Dieu, le Grand, le Suprême. Je vous adjure, ô rois spirituels, par la puissance de la gloire de Dieu, par la lumière du Visage Divin, et par ce que la Plume Suprême a tracé par décret de Dieu envers le Prophète Mahomet (paix et bénédictions sur lui), de répondre à mon appel, d'accomplir mon besoin et d'être mes aides dans l'obéissance à Dieu.

Par la gloire de Barhatihin Barhatihin, Kararin Kararin, Tatlihin Tatlihin, Tawran Tawran, Mazjalin Mazjalin, Bazjalin Bazjalin, Tarqabin Tarqabin.

Répondez et hâtez-vous avec obéissance et exécution, que la bénédiction de Dieu soit sur vous et avec vous.`,
    translationEn: `In the name of God, the Great, the Supreme. I adjure you, O spiritual kings, by the glory of God's majesty, by the light of the Divine Countenance, and by what was written by the Supreme Pen from God unto Prophet Muhammad (peace and blessings be upon him), that you answer my call, fulfill my need, and be my helpers in obedience to God.

By the glory of Barhatihin Barhatihin, Kararin Kararin, Tatlihin Tatlihin, Tawran Tawran, Mazjalin Mazjalin, Bazjalin Bazjalin, Tarqabin Tarqabin.

Answer and hasten with obedience and response, may God's blessing be upon you and with you.`,
    translationHa: `Da sunan Allah Mafi Girma, Mafi Daukaka. Na rantsar da ku ya sarakunan ruhanai, da karfin daukakar Allah, da hasken fuskar Allah, da abinda alqalami ya rubuta daga Allah zuwa ga Annabi Muhammadu (tsira da amincin Allah su tabbata a gare shi), da ku amsa kira na, ku biya bukata ta, ku kasance mataimaka gare ni wajen yi wa Allah biyayya.

Albarkacin daukakar Barhatihin Barhatihin, Kararin Kararin, Tatlihin Tatlihin, Tawran Tawran, Mazjalin Mazjalin, Bazjalin Bazjalin, Tarqabin Tarqabin.

Ku amsa ku hanzarta da biyayya da cika bukata, Allah ya yi muku albarka kuma amincinsa ya tabbata a gare ku.`,
    usageInstructionsFr: 'Utilisé lors des moments critiques du zikr pour réaffirmer l\'autorité du décret divin et accélérer la réalisation du besoin.',
    usageInstructionsEn: 'Used during critical moments of recitation to reaffirm divine decree and accelerate the fulfillment of spiritual intentions.',
    usageInstructionsHa: 'Ana amfani da wannan a tsakiyar zikiri domin karfafa bukatar mutum da neman taimakon samaniya cikin hanzari.'
  },
  {
    id: 'inv_insiraf',
    titleAr: 'دعاء الانصراف الشريف',
    titleFr: 'Prière de Congé & Libération (Insiraf)',
    titleEn: 'Prayer of Dismissal & Release (Insiraf)',
    titleHa: 'Addu\'ar Sallama da Bada Dama (Insiraf)',
    type: 'insiraf',
    arabicText: `بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ.

انْصَرِفُوا كَمَا حَضَرْتُمْ مُعَزَّزِينَ مَكْرَمِينَ، بِحَقِّ مَا تَلَوْتُهُ عَلَيْكُمْ مِنْ أَسْمَاءِ اللهِ العِظَامِ.

﴿إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا ﴿١﴾ وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا ﴿٢﴾ وَقَالَ الْإِنْسَانُ مَا لَهَا ﴿٣﴾ يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا ﴿٤﴾ بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا ﴿٥﴾ يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِيُرَوْا أَعْمَالَهُمْ ﴿٦﴾﴾

انْصَرِفُوا أَشْتَاتاً، انْصَرِفُوا أَشْتَاتاً، انْصَرِفُوا أَشْتَاتاً. بَارَكَ اللهُ فِيكُمْ وَعَلَيْكُمْ.`,
    transliteration: `Bismillahi ar-Rahmani ar-Raheem.

Insarifoo kama hadartum mu'azzazeena mukarrameena, bi-haqqi ma talawtuhu alaykum min asma'illahi al-idham.

Idha zulzilati al-ardu zilzalaha. Wa akhrajati al-ardu athqalaha. Wa qala al-insanu ma laha. Yawma'idhin tuhaddithu akhbaraha. Bi-anna rabbaka awha laha. Yawma'idhin yasduru an-nasu ashtatan li-yuraw a'malahum.

Insarifoo ashtatan, Insarifoo ashtatan, Insarifoo ashtatan. Barakallahu feekum wa alaykum.`,
    translationFr: `Au nom de Dieu, le Clément, le Miséricordieux.

Retirez-vous dans la paix, l'honneur et le respect comme vous êtes venus, par la vérité sacrée des Noms Divins Suprêmes qui ont été récités sur vous.

« Quand la terre tremblera de son violent tremblement, et que la terre sortira ses fardeaux, et que l'homme dira: 'Qu'a-t-elle?', ce jour-là, elle contera ses informations, parce que ton Seigneur lui aura inspiré. Ce jour-là, les gens sortiront dispersés (Ashtatan) pour que leurs œuvres leur soient montrées. » (Sourate Az-Zalzalah, versets 1 à 6)

Retirez-vous dispersés, retirez-vous dispersés, retirez-vous dispersés ! Que la bénédiction et la paix de Dieu soient sur vous et avec vous.`,
    translationEn: `In the name of God, the Most Gracious, the Most Merciful.

Depart in peace, honor, and nobility as you arrived, by the sacred truth of the Supreme Divine Names recited upon you.

"When the earth is shaken with its ultimate earthquake, and the earth brings forth its burdens, and man says, 'What is wrong with it?', that Day it will report its news, because your Lord has inspired it. That Day, people will proceed in scattered groups (Ashtatan) to be shown their deeds." (Surah Az-Zalzalah, verses 1 to 6)

Depart scattered, depart scattered, depart scattered! May God's blessing and peace be upon you and with you.`,
    translationHa: `Da sunan Allah, Mai Rahama, Mai Tausayi.

Ku tafi cikin aminci, girma, da martaba kamar yadda kuka zo, albarkacin Sunayen Allah Masu Girma da aka karanta muku.

"Idan aka girgiza ƙasa da girgizawarta, kuma ƙasa ta fitar da kaya masu nauyi na cikinta, kuma ɗan adam ya ce: 'Me ke samunta?', A ranar nan za ta ba da labaranta, saboda Ubangijinka ne ya yi mata wahayi. A ranar nan mutane za su fito ƙungiyoyi rarrabe (Ashtatan) domin a nuna musu ayyukansu." (Surat Az-Zalzalah, ayoyi 1 zuwa 6)

Ku tafi rarrabe, ku tafi rarrabe, ku tafi rarrabe! Allah ya yi muku albarka kuma amincinsa ya tabbata a gare ku.`,
    usageInstructionsFr: 'Obligatoire à la fin de toute récitation de la Barhatiah pour libérer les énergies et restaurer l\'état ordinaire du lieu.',
    usageInstructionsEn: 'Mandatory at the conclusion of any Barhatiah session to release subtle energy and restore ordinary state.',
    usageInstructionsHa: 'Dole ne a karanta wannan a karshen zikiri domin sallamar ruhanai da maida daki daidai.'
  },
  {
    id: 'inv_sughra_fast_response',
    titleAr: 'الدعوة الصغرى السريعة الإجابة لعهد البرهتية',
    titleFr: 'La Petite Évocation Rapide (Da\'wah Al-Sughra)',
    titleEn: 'The Minor Fast-Response Invocation (Da\'wah Al-Sughra)',
    titleHa: 'Karatun Ciki da Sauri na Barhatiah (Da\'wah Al-Sughra)',
    type: 'dawah',
    arabicText: `بِسْمِ اللهِ العَظِيمِ الأَعْظَمِ.
بَرْهَتِيهٍ كَرَرٍ تَتْلِيهٍ طَوْرَانٍ مَزْجَلٍ بَزْجَلٍ تَرَقَّبٍ بَرْهَشٍ غَلْمَشٍ خَوْطِيرٍ قَلْنَهُودٍ بَرْشَانٍ كِظَهِيرٍ نَمُوشَلَخٍ بَرَهَيُولا بَشْكِيلَخٍ قَزْمَزٍ أَنْغَلَلِيطٍ قَبَرَاَتٍ غَيَاهَا كَيْدَهوُلَا شَمْخَاهِرٍ شَمْخَاهِيرٍ بَكَهَطَطَهُونِيَةٍ بَشَارَشٍ طُونِشٍ شَمْخَابَارُوحٍ بَيَعْرَشٍ.

أَجِيبُوا وَعَجِّلُوا بِقَضَاءِ حَاجَتِي فِي هَذِهِ السَّاعَةِ بِحَقِّ هَذِهِ الأَسْمَاءِ المَقْدَسَةِ، بَارَكَ اللهُ فِيكُمْ وَعَلَيْكُمْ.`,
    transliteration: `Bismillahi al-Azeemi al-A'dham.
Barhatihin, Kararin, Tatlihin, Tawran, Mazjalin, Bazjalin, Tarqabin, Barhashin, Ghalmashin, Khutirin, Qalanhoodin, Barshanin, Kathirin, Namushalakhin, Barhayula, Bashkilakhin, Qazmazin, Anaghlalitin, Qabratin, Ghiya-ha, Kaydahoola, Shamkhahirin, Shamkhahirin, Bakahtatahoniyatin, Basharashin, Tuneshin, Shamkhabaroohin, Baya'ra'ashin.

Ajeeboo wa ajjiloo bi-qada'i hajatee fee hadhihi as-sa'ati bi-haqqi hadhihi al-asma'i al-muqaddasah, barakallahu feekum wa alaykum.`,
    translationFr: `Au nom de Dieu, le Grand, le Suprême.
[Énumération synthétique des 28 Noms Sacrés de la Barhatiah].

Répondez et hâtez-vous d'accomplir mon besoin en cette heure même par la vérité sacrée de ces Noms Bénis, que la bénédiction de Dieu soit sur vous et avec vous !`,
    translationEn: `In the name of God, the Great, the Supreme.
[Concentrated enumeration of the 28 Sacred Barhatiah Names].

Answer and hasten to fulfill my need in this very hour by the sacred truth of these Holy Names, may God's blessing be upon you and with you!`,
    translationHa: `Da sunan Allah Mafi Girma, Mafi Daukaka.
[Jerin Sunaye 28 Masu Tsarki na Barhatiah a Takaice].

Ku amsa ku hanzarta biya min bukata ta a cikin wannan sa'a albarkacin wadannan sunaye masu tsarki, Allah ya yi muku albarka kuma amincinsa ya tabbata a gare ku!`,
    usageInstructionsFr: 'Formule concentrée utilisée en cas de besoin pressant ou pour les récitations quotidiennes de maintien vibratoire.',
    usageInstructionsEn: 'Concentrated formula used during urgent situations or for daily spiritual maintenance.',
    usageInstructionsHa: 'Gajeren karatu mai sauri lokacin bukatu na gaggawa ko zikiri na yau da kullum.'
  },
  {
    id: 'inv_kasm_tathbeet',
    titleAr: 'قسم التثبيت والتحصين النهائي وإغلاق الدائرة',
    titleFr: 'Prière de Confirmation, Ancrage & Verrouillage Permanent (Kasm Al-Tathbeet)',
    titleEn: 'Oath of Spiritual Anchoring & Permanent Lock (Kasm Al-Tathbeet)',
    titleHa: 'Addu\'ar Tabbatar da Aiki da Kulle Asiri (Kasm Al-Tathbeet)',
    type: 'kasm',
    arabicText: `ثَبَّتَ اللهُ نُورَ هَذِهِ الأَسْمَاءِ فِي قَلْبِي وَبَدَنِي، وَحَصَّنَنِي بِحِصْنِهِ الحَصِينِ، الَّذِي لاَ تَرُامُهُ السَّهَامُ وَلاَ تَخْتَرِقُهُ الشَّيَاطِينُ.

بِحَقِّ بَرْهَتِيهٍ بَرْهَتِيهٍ وَبِيَعْرَشٍ بَيَعْرَشٍ، خَتَمْتُ هَذَا العَمَلَ بِخَاتَمِ سُلَيْمَانَ بْنِ دَاوُدَ عَلَيْهِمَا السَّلاَمُ، وَبِلاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللهِ العَلِيِّ العَظِيمِ.`,
    transliteration: `Thabbata Allahu noora hadhihi al-asma'i fee qalbee wa badanee, wa hassananee bi-hisnihi al-haseen, alladhi la taramuhu as-sihamu wa la takhtariquhu ash-shayateen.

Bi-haqqi Barhatihin Barhatihin wa Baya'ra'ashin Baya'ra'ashin, khatamtu hadha al-amala bi-khatami Sulaymana ibni Dawooda alayhima as-salam, wa bi-la hawla wa la quwwata illa billahi al-Aliyyi al-Azeem.`,
    translationFr: `Que Dieu enracine la lumière de ces Noms Sacrés dans mon cœur et mon corps, et me fortifie dans Sa citadelle inexpugnable, inaccessible aux flèches du mal et impénétrable aux démons !

Par la vérité de Barhatihin Barhatihin et de Baya'ra'ashin Baya'ra'ashin, je scelle cet œuvre avec le Sceau de Salomon fils de David (paix sur eux), et par la formule : Il n'y a de force ni de puissance que par Dieu, le Très-Haut, le Suprême.`,
    translationEn: `May God anchor the light of these Sacred Names within my heart and body, and fortify me within His impregnable fortress, untouchable by evil arrows and impenetrable to demons!

By the truth of Barhatihin Barhatihin and Baya'ra'ashin Baya'ra'ashin, I seal this spiritual work with the Seal of Solomon son of David (peace be upon them), and through: There is no power nor might except with God, the Exalted, the Supreme.`,
    translationHa: `Allah ya tabbatar da hasken wadannan sunaye a cikin zuciyata da jikina, kuma ya kare ni da garkuwarsa mai karfi wadda kibiyar makiya ba ta huda ta kuma shaidanu ba za su iya shiga ba!

Albarkacin Barhatihin Barhatihin da Baya'ra'ashin Baya'ra'ashin, na kulle wannan aiki da Hatimin Annabi Sulaimanu dan Dauda (amincin Allah ya tabbata a gare su), kuma ba dubara ba karfi sai da izinin Allah Mafi Daukaka, Mafi Girma.`,
    usageInstructionsFr: 'Réciter 3 fois à la fin d\'un rituel avant l\'Insiraf pour verrouiller les résultats et empêcher toute déperdition d\'énergie.',
    usageInstructionsEn: 'Recite 3 times at ritual completion prior to Insiraf to lock in results and seal subtle energies.',
    usageInstructionsHa: 'A karanta sau 3 a karshen aiki kafin karatun sallama (Insiraf) domin kulle sakamakon zikiri.'
  }
];
