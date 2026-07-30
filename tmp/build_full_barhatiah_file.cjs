const fs = require('fs');

// Read the original file to extract BARHATIAH_GRAND_RECIPES and BARHATIAH_INVOCATIONS
const originalFile = fs.readFileSync('/src/data/barhatiahSecrets.ts', 'utf8');
const grandRecipesIndex = originalFile.indexOf('export const BARHATIAH_GRAND_RECIPES');

if (grandRecipesIndex === -1) {
  console.error("Could not find BARHATIAH_GRAND_RECIPES");
  process.exit(1);
}

const tailSection = originalFile.substring(grandRecipesIndex);

const fileHeader = `export interface BarhatiahNameSecret {
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
`;

const namesData = [
  {
    id: 1,
    nameAr: 'بَرْهَتِيهٍ',
    nameTranslit: 'Barhatihin',
    divineAttributeAr: 'القُدُّوسُ',
    divineAttributeFr: 'Al-Quddus (Le Très-Saint, L\'Absolument Pur)',
    divineAttributeEn: 'Al-Quddus (The Most Holy, Pure Beyond Measure)',
    divineAttributeHa: 'Al-Quddus (Mafi Tsarki, Tsatttakan Sarki)',
    abjadWeight: 662,
    lunarMansion: 'Al-Sharatan (الشرطان)',
    element: 'fire',
    secretFr: `Grand Secret de la Purification Divine & Clé Primordiale du Serment. Dans la tradition théurgique d'Ibn al-Hajj et du Sheikh Ahmad al-Buni dans "Sharh al-Barhatiyyah", Barhatihin est le premier nom sacré du pacte immémorial. Il correspond à l'attribut divin "Al-Quddus" (Le Très-Saint). Ce nom possède la vertu cosmique de diffuser un feu céleste purificateur qui calcine instantanément les parasites de l'astral, les résidus de magie noire, les miasmes spirituels et les envoûtements familiaux anciens. 

Lorsqu'il est prononcé avec une intention pure et la présence du cœur, Barhatihin éveille le centre spirituel du cœur (Latifah al-Qalb), efface l'angoisse existentielle et projette une aura d'une clarté étincelante qui fait fuir les esprits bas et les démons. Il agit comme un dissolvant universel des voiles d'ignorance et de doute, permettant à l'opérateur de percevoir la Présence Divine sans interférence. Il est dit que quiconque médite quotidiennement sur sa fréquence (662) voit sa mémoire illuminée et son esprit protégé contre la démence et la dépression.`,
    secretEn: `Grand Secret of Divine Purification & Primordial Covenant Key. In the classical theurgic tradition of Sheikh Ahmad al-Buni in "Sharh al-Barhatiyyah", Barhatihin is the premier sacred name of the ancient oath, corresponding to "Al-Quddus" (The All-Holy). It radiates a celestial purifying fire that instantly burns away astral parasites, lingering curses, and ancestral spiritual miasmas.

When recited with heart presence, Barhatihin awakens the spiritual heart center (Latifah al-Qalb), dispels existential fear, and projects a brilliant aura of divine light that repels lower entities. It acts as a universal solvent against veils of doubt, enabling direct perception of spiritual truth. Daily contemplation on its numerical frequency (662) illuminates memory and shields the mind from despair and delusion.`,
    secretHa: `Babban Sirrin Tsarkakewar Samaniya da Mukullun Farko na Yarjejeniyar Barhatiah. A cikin littafin "Sharh al-Barhatiyyah" na Sheikh Ahmad al-Buni, Barhatihin shi ne suna na farko mai tsarki wanda ya dace da sunan Allah "Al-Quddus" (Mafi Tsarki). Yana fitar da hasken wuta na samaniya wanda ke kona dukkan shaidanu, sihiri na gado, da dukkan duhun ruhani a cikin daqika kadan.

Idan aka karanta shi da kyakkyawar zuciya, yana buɗe idon basira na zuciya (Latifah al-Qalb), yana cire fargaba da damuwa, kuma yana kewaye mutum da garkuwar haske mai karfi. Shi ne ke ruguza dukkan shamaki da ke tsakanin mutum da nasararsa. Karanta shi da yawa yana haskaka kwakwalwa da kiyaye zuciya daga firgita.`,
    recipeFr: `Grand Protocole Canonique de Purification & Délivrance des Lieux et des Âmes :
1. Timing & Préparation : Effectuez ce rituel le dimanche au lever du soleil (première heure du Soleil) ou la nuit du jeudi au vendredi. Soyez en état de pureté rituelle majeure et mineure (Ghusl & Wudu), vêtu de blanc.
2. Encensement : Brûlez de l'encens de Benjoin blanc pur (Jawi) et du Mastic sur des charbons ardents pour sanctifier l'atmosphère.
3. Calligraphie Sacrée : À l'encre de safran pur infusée dans de l'eau de rose et une goutte de musc, écrivez le nom "Barhatihin" (بَرْهَتِيهٍ) 66 fois (ou 662 fois pour un cas lourd) sur une assiette neuve en céramique blanche ou sur du papier parchemin pur.
4. Activation & Récitation : Lisez la grande invocation (Da'wah) de la Barhatiah puis répétez le nom "Barhatihin" 662 fois en maintenant votre regard fixé sur l'écriture.
5. Emploi : Dissolvez la calligraphie dans 7 litres d'eau de source pure. Utilisez cette eau bénie pour laver votre visage et votre corps au lever du soleil pendant 7 jours consécutifs. Aspergez également les quatre coins de votre demeure pour purifier le lieu des présences nuisibles.`,
    recipeEn: `Canonical Purification & Exorcism Protocol:
1. Timing & Preparation: Perform on Sunday at sunrise (first hour of the Sun) or Thursday night. Be in complete ritual purity (Ghusl & Wudu) wearing clean white garments.
2. Incense: Burn pure white benzoin resin (Jawi) and mastic over hot coals to sanctify the atmosphere.
3. Sacred Calligraphy: Using saffron ink dissolved in rosewater and musk, write "Barhatihin" (بَرْهَتِيهٍ) 66 times (or 662 times for severe cases) on a white ceramic plate or parchment paper.
4. Activation & Recitation: Recite the Grand Barhatiah Invocation then repeat "Barhatihin" 662 times while gazing focused at the calligraphy.
5. Application: Wash off the ink with 7 liters of pure spring water. Use this water to wash face and body every morning for 7 consecutive days, and sprinkle all four interior corners of your residence to cleanse space.`,
    recipeHa: `Cikakken Shirin Tsabta da Warware Matse-Matse:
1. Lokaci da Shirye-shirye: Yi wannan aikin ranar Lahadi da asuba (sa'a ta farko ta rana) ko daren Juma'a. Yi wanka da alwala ka saka tufafi farare masu tsarki.
2. Turare: Kona turaren Jawi fari da Mastaki a kan garwashin wuta domin tsarkake dakin.
3. Rubutun Asiri: Da tawadar za'afaran da ruwan rosewater da musk, rubuta "Barhatihin" (بَرْهَتِيهٍ) sau 66 (ko sau 662 domin matsala mai tsanani) a kwanon faranti fari sabo.
4. Karatu: Karanta karatun Barhatiah sannan ka maimaita "Barhatihin" sau 662 kana kallon rubutun.
5. Amfani: Wanke rubutun da lita 7 na ruwan rijiya ko Zamzam. Yi amfani da ruwan wajen wanke fuska da jiki kowace safe har kwana 7, kuma ka yayafa a kusurwoyin gidan domin korar shaidanu.`,
    invocationAr: 'يا قدوسُ قِدِّسْنِي مِنْ كُلِّ آفَةٍ وَعَاهَةٍ بِحَقِّ بَرْهَتِيهٍ',
    invocationTranslit: 'Ya Quddusu qiddisnee min kulli afatin wa aahatin bi-haqqi Barhatihin',
    invocationFr: 'Ô Très-Saint, purifie-moi de tout fléau, de toute infirmité et de tout obscurcissement par la vérité sacrée du nom Barhatihin.',
    invocationEn: 'O All-Holy One, sanctify me from every affliction, defect, and darkness by the sacred truth of Barhatihin.',
    invocationHa: 'Ya Tsatttakan Sarki, ka tsalkafani daga kowane cuta da jarrabawa albarkacin Barhatihin.',
    talsamCode: '١١١ ٩٩٩ ٦٢ ط ط ط 🕯️',
    wafq3x3: [
      ['221', '226', '215'],
      ['216', '221', '225'],
      ['225', '215', '222']
    ]
  },
  {
    id: 2,
    nameAr: 'كَرَرٍ',
    nameTranslit: 'Kararin',
    divineAttributeAr: 'إِلٰهُ كُلِّ شَيْءٍ',
    divineAttributeFr: 'Ilah Kull Shai (Dieu de toute chose, Le Protecteur Infaillible)',
    divineAttributeEn: 'Ilah Kull Shai (God of All Creation, Unfailing Shield)',
    divineAttributeHa: 'Ubangijin Komai da Kowa (Katanga Mai Karfi)',
    abjadWeight: 430,
    lunarMansion: 'Al-Butayn (البطين)',
    element: 'earth',
    secretFr: `Grand Secret de la Bastion Occulte & Bouclier de Force Tellurique. Dans les traités anciens, Kararin est associé au Nom Divin "Ilah Kull Shai" (Le Dieu de toute chose) et possède la puissance d'une muraille d'acier invisible. Il ancre la fréquence vibratoire de l'opérateur dans la stabilité inébranlable de la terre, rendant son aura totalement imperméable aux attaques psychiques, aux mauvais yeux d'envie destructrice, à la sorcellerie enfouie (Sihr Maqbur) et aux complots feutrés.

Ce nom a la propriété spirituelle de retourner automatiquement les malédictions vers leurs auteurs avec une force multipliée. Il accorde une présence impressionnante qui impose la prudence et le respect aux ennemis déclarés. En méditant sur sa valeur numérique (430), l'esprit acquiert un sang-froid imperturbable lors des situations de danger imminent et les peurs irrationnelles sont définitivement éliminées.`,
    secretEn: `Grand Secret of Occult Fortification & Earthly Armor. In ancient esoteric texts, Kararin correlates with "Ilah Kull Shai" (God of All Things) and bestows the strength of an invisible steel bastion. It grounds the practitioner's aura into absolute stability, rendering it impervious to psychic assaults, evil eye, buried sorcery, and covert betrayals.

This divine name automatically deflects hostile energies back to their origin with amplified intensity. It imparts a formidable spiritual gravity that commands instant caution and respect from opponents. Daily alignment with its weight (430) bestows unshakeable composure in peril and neutralizes phantom anxieties.`,
    secretHa: `Babban Sirrin Katangar Kariya da Karfen Ruhani. A cikin tsoffin littattafan asiri, Kararin yana tafiya ne da sunan Allah "Ilah Kull Shai" (Ubangijin Kowa da Komai). Yana ba mutum garkuwa mai karfi kamar katangar karfe wadda babu asiri, maita, sammu na binne, ko maitan idon hassada da zai iya ratsawa.

Wannan suna yana da ikon mayar da asirin makiyayi zuwa kansa da sauri. Yana cika mutum da kwarjini na kariya wanda ke sa makiya tsoron cutar da shi. Karanta shi da lissafinsa (430) yana cire fargaba da tsoro a zuciya, yana ba mutum karfin gwiwa a lokacin matsi.`,
    recipeFr: `Protocole Canonique de Fortification Aurique & Protection des Biens :
1. Timing : Le dimanche soir après le coucher du soleil ou le mardi à l'heure de Mars.
2. Encensement : Brûlez du Sang-de-Dragon (Dam al-Akhas), de la Myrrhe purifiée et du Mastic.
3. Calligraphie : Écrivez "Kararin" (كَرَرٍ) 430 fois sur un parchemin naturel ou du papier blanc épais à l'encre de safran et d'eau de rose. Autour du bloc d'écriture, tracez le verset de protection Ayat al-Kursi en cercle fermé.
4. Récitation : Lisez le nom "Kararin" 430 fois après la prière de l'Isha chaque soir durant 7 nuits consécutives.
5. Porter & Fixer : Pliez soigneusement le document et portez-le sur vous dans un étui en cuir propre, ou fixez-le au-dessus de la porte d'entrée de votre foyer pour empêcher tout esprit malveillant ou voleur d'y pénétrer.`,
    recipeEn: `Canonical Aura Fortification & Property Shield Protocol:
1. Timing: Sunday evening after sunset or Tuesday during the planetary hour of Mars.
2. Incense: Burn Dragon's Blood resin, purified myrrh, and mastic.
3. Writing: Inscribe "Kararin" (كَرَرٍ) 430 times on natural parchment using saffron ink. Encircle the text block with Ayat al-Kursi in a seamless loop.
4. Recitation: Recite "Kararin" 430 times after Isha prayer every night for 7 consecutive nights.
5. Application: Fold the amulet and carry it in a clean leather pouch, or affix above your main entrance to prevent evil forces and thieves from entering.`,
    recipeHa: `Hanyar Kariya daga Makiya da Maita:
1. Lokaci: Ranar Lahadi da daddare ko ranar Talata lokacin tauraron Mars.
2. Turare: Kona turaren Dam al-Akhas da Murr da Mastaki.
3. Rubutu: Rubuta "Kararin" (كَرَرٍ) sau 430 a takarda fara da za'afaran. Trace Ayatul Kursiyyu a kewaye a matsayin da'ira.
4. Karatu: Karanta "Kararin" sau 430 bayan sallar Isha kowace daddare har kwana 7.
5. Rike ko Ratayawa: Nalle takardar ka saka a gidan fata mai tsarki ka rike a aljihu, ko ka rataya a saman kofar gida domin tsare gida daga shaidanu da barayi.`,
    invocationAr: 'يا إِلٰهَ كُلِّ شَيْءٍ احْفَظْنِي مِنْ كَيْدِ الْحَاسِدِينَ بِحَقِّ كَرَرٍ',
    invocationTranslit: 'Ya Ilaha kulli sha\'in ihfadhnee min kaydi al-hasideena bi-haqqi Kararin',
    invocationFr: 'Ô Dieu de toute chose, préserve-moi des pièges des envieux, des complots des malveillants et des regards sombres par la vérité du nom Kararin.',
    invocationEn: 'O God of all creation, protect me from the schemes of the envious, the plots of the ill-willed, and dark eyes by Kararin.',
    invocationHa: 'Ya Ubangijin kowa da komai, ka tsareni daga makircin masu hassada albarkacin Kararin.',
    talsamCode: '٤٣٠ ٧٧٧ ككك 🛡️'
  },
  {
    id: 3,
    nameAr: 'تَتْلِيهٍ',
    nameTranslit: 'Tatlihin',
    divineAttributeAr: 'القَادِرُ الخَبِيرُ',
    divineAttributeFr: 'Al-Qadir Al-Khabir (Le Puissant Omniscient, L\'Apaisateur des Cœurs)',
    divineAttributeEn: 'Al-Qadir Al-Khabir (The All-Powerful, The All-Aware Pacifier)',
    divineAttributeHa: 'Al-Qadir Al-Khabir (Mai Iko, Mai Cikakken Labari)',
    abjadWeight: 845,
    lunarMansion: 'Al-Thurayya (الثريا)',
    element: 'air',
    secretFr: `Grand Secret de l\'Harmonie Cosmique, Réconciliation & Clarté Ésotérique. Tatlihin correspond aux attributs de Puissance et d\'Omniscience "Al-Qadir Al-Khabir". Ce nom sacré détient la fréquence subtile qui adoucit les cœurs les plus endurcis, éteint les disputes familiales venimeuses et restaure la concorde au sein des communautés divisées.

Au niveau intellectuel et spirituel, Tatlihin ouvre les facultés supérieures de l\'esprit : il amplifie la mémoire photographique, accélère la compréhension intuitive des sciences ésotériques complexes (Ilm al-Huruf, Alchimie, Géomancie) et permet d\'assimiler avec aisance les textes sacrés. Il dissipe la brume mentale et le doute, permettant de discerner clairement les intentions réelles de ses interlocuteurs.`,
    secretEn: `Grand Secret of Cosmic Harmony, Reconciliation & Intellectual Illumination. Tatlihin embodies the divine attributes "Al-Qadir Al-Khabir" (The All-Powerful, The All-Aware). It carries a gentle spiritual frequency that softens hardened hearts, quenches bitter family feuds, and restores enduring peace in fractured communities.

On the mental plane, Tatlihin unlocks higher cognitive channels: it enhances memory retention, accelerates intuitive comprehension of profound esoteric sciences (Ilm al-Huruf, Sacred Geometry), and grants effortless mastery over spiritual texts. It dissolves cognitive fog, enabling one to clearly perceive underlying motives.`,
    secretHa: `Babban Sirrin Zaman Lafiya, Sasanta Mutane da Bude Basira. Tatlihin yana wakiltar sunayen Allah "Al-Qadir Al-Khabir" (Mai Iko, Mai Labarin Komai). Yana da wani asiri na musamman da ke kwantar da fushin zuciya, yana kashe rigima tsakanin yan uwa ko ma'aurata, kuma yana kawo zumunci da kauna.

A fannin ilimi da basira, Tatlihin yana bude kwakwalwa wajen harda da fahimtar ilimin asiri mai zurfi. Yana kawo fahimta ta gaggawa, yana cire daushin mantuwa, kuma yana goge duhun tunani domin gane gaskiyar mutane.`,
    recipeFr: `Grand Protocole d\'Apaisement & Illumination de l\'Esprit :
1. Timing : Le mercredi soir ou durant la nuit du jeudi à la troisième heure spirituelle.
2. Encensement : Brûlez du Benjoin blanc pur et du Mastic de Chios.
3. Calligraphie : À l'encre de safran infusée à l'eau de fleur d'oranger, écrivez "Tatlihin" (تَتْلِيهٍ) 19 fois en cercle parfait autour d'une coupe d'eau pure.
4. Récitation : Répétez le nom "Tatlihin" 845 fois avec une concentration immobile sur la paix, l'harmonie et l'ouverture de l'intelligence.
5. Utilisation : Faites boire cette eau parfumée aux personnes en conflit ou buvez-la vous-même avant d'étudier pour ouvrir votre capacité de mémorisation et d'assimilation.`,
    recipeEn: `Grand Harmony & Mind Illumination Protocol:
1. Timing: Wednesday night or Thursday night during the 3rd spiritual hour.
2. Incense: Burn pure white benzoin and Chios mastic resin.
3. Calligraphy: Write "Tatlihin" (تَتْلِيهٍ) 19 times in a perfect circle using saffron ink infused with orange blossom water onto paper or inside a bowl.
4. Recitation: Recite "Tatlihin" 845 times focusing intently on reconciliation and wisdom.
5. Application: Serve this blessed water to individuals in dispute, or drink it yourself before study sessions to unlock extraordinary retention.`,
    recipeHa: `Hanyar Kawo Zaman Lafiya da Bude Ilimi:
1. Lokaci: Daren Laraba ko daren Alhamis.
2. Turare: Kona turaren Jawi fari da Mastaki.
3. Rubutu: Rubuta "Tatlihin" (تَتْلِيهٍ) sau 19 da za'afaran a da'ira a takarda fara ko a kwanon gilashi.
4. Karatu: Karanta "Tatlihin" sau 845 da kyakkyawan nufin zaman lafiya ko samun ilimi.
5. Amfani: Ba masu rigima ruwan su sha domin sasanta su, ko ka sha kafin karatu domin bude kwakwalwa da saurin harda.`,
    invocationAr: 'يا قَادِرُ يا خَبِيرُ أَلِّفْ بَيْنَ القُلُوبِ وَاهْدِنَا سُبُلَ السَّلَامِ بِحَقِّ تَتْلِيهٍ',
    invocationTranslit: 'Ya Qadiru ya Khabiru allif bayna al-quloobi wahdina subula as-salami bi-haqqi Tatlihin',
    invocationFr: 'Ô Puissant, ô Informé, unis nos cœurs dans l\'amour divin et guide-nous sur les sentiers de la paix sacrée par la vérité de Tatlihin.',
    invocationEn: 'O All-Powerful, O All-Aware, unite our hearts in divine love and guide us upon paths of peace by Tatlihin.',
    invocationHa: 'Ya Mai Iko, Ya Mai labarin komai, ka hada kawunanmu ka shirye mu zuwa hanyar aminci albarkacin Tatlihin.',
    talsamCode: '٨٤٥ ٣٣٣ ت ت ت 🕊️'
  },
  {
    id: 4,
    nameAr: 'طَوْرَانٍ',
    nameTranslit: 'Tawran',
    divineAttributeAr: 'الحَيُّ القَيُّومُ',
    divineAttributeFr: 'Al-Hayy Al-Qayyum (Le Vivant, Le Subsistant Suprême)',
    divineAttributeEn: 'Al-Hayy Al-Qayyum (The Ever-Living, The Self-Sustaining Source)',
    divineAttributeHa: 'Al-Hayy Al-Qayyum (Raye wanda ba ya mutuwa, Mai tsayuwa da kowa)',
    abjadWeight: 266,
    lunarMansion: 'Al-Dabaran (الدبران)',
    element: 'fire',
    secretFr: `Grand Secret de la Régénération Vitale, Guérison Physio-Énergétique & Exorcisme des Maladies. Tawran vibre sous la fréquence des Noms Suprêmes "Al-Hayy Al-Qayyum" (Le Vivant, Le Subsistant). C\'est l\'étincelle de feu sacré qui réanime les corps épuisés, dissout la léthargie chronique, surmonte la dépression profonde et purge l\'organisme des toxines physiques et occultes.

Ce nom possède un pouvoir régénérateur exceptionnel sur les cellules et les fluides corporels. Il combat les maladies mystérieuses que la médecine conventionnelle peine à diagnostiquer, brise les attaques d\'envoûtement visant la détérioration de la santé physique et insuffle un dynamisme irrésistible. Son usage est recommandé pour quiconque traverse une période de convalescence ou de grande fatigue spirituelle.`,
    secretEn: `Grand Secret of Vital Regeneration, Bio-Energetic Healing & Physical Exorcism. Tawran vibrates to the frequency of "Al-Hayy Al-Qayyum" (The Ever-Living, The Self-Subsisting). It represents the spark of sacred fire that resurrects depleted vitality, dissolves chronic fatigue, lifts clinical depression, and purges physical and etheric toxins.

This divine name exerts extraordinary regenerative force over biological systems. It counters mysterious ailments that evade conventional diagnosis, shatters curses aimed at physical decline, and infuses unyielding vigor. It is highly recommended for those recovering from severe illness or spiritual burnout.`,
    secretHa: `Babban Sirrin Sabunta Karfin Jiki, Maganin Cututtuka da Samun Lafiya. Tawran yana tafiya ne da sunan Allah "Al-Hayy Al-Qayyum" (Raye wanda ba ya mutuwa, Mai Tsayuwa da Komai). Shi ne kibrit na wutar samaniya wanda ke dawo da karfin jiki, yana yaye kasala, damuwa mai zurfi, da ciwo mai wuya.

Wannan suna yana da tasiri mai karfi wajen warkar da ciwon da likitoci suka kasa gane kansa, yana karya sihiri na lallata lafiyar jiki, kuma yana cika mutum da karfi da karsashi. Yana da kyau ga duk wanda ke jin nauyin jiki ko ciwo na tsawon lokaci.`,
    recipeFr: `Protocole de Revitalisation & Guérison Holistique :
1. Timing : Le dimanche matin au lever du soleil ou lors du premier jour de la nouvelle lune.
2. Encensement : Brûlez du Mastic pur, du Santal rouge et des clous de girofle.
3. Calligraphie : À l'encre de safran pur infusée dans de l'eau de Zamzam ou de l'eau de pluie pure, écrivez "Tawran" (طَوْرَانٍ) 266 fois sur une feuille blanche neuve sans lignes.
4. Récitation : Lisez le nom "Tawran" 266 fois au-dessus de la feuille et d'une carafe d'eau de 1 à 3 litres.
5. Consommation : Faites tremper le document dans l\'eau. Buvez-en un verre à jeun chaque matin pendant 7 jours consécutifs tout en récitant le nom 266 fois.`,
    recipeEn: `Holistic Healing & Vitality Regeneration Protocol:
1. Timing: Sunday morning at sunrise or on the 1st day of the new moon.
2. Incense: Burn pure mastic resin, red sandalwood, and whole cloves.
3. Calligraphy: Write "Tawran" (طَوْرَانٍ) 266 times using pure saffron ink dissolved in Zamzam or rainwater onto an unlined sheet.
4. Recitation: Recite "Tawran" 266 times over the sheet and a pitcher containing 1-3 liters of pure water.
5. Application: Submerge the paper in the water. Drink one glass on an empty stomach every morning for 7 days while reciting the name 266 times.`,
    recipeHa: `Hanyar Samun Cikakkiyar Lafiya da Karfi:
1. Lokaci: Ranar Lahadi da asuba ko ranar farko ta samun sabon wata.
2. Turare: Kona turaren Mastaki da itacen Santal da Kanumfari.
3. Rubutu: Rubuta "Tawran" (طَوْرَانٍ) sau 266 da za'afaran a ruwan Zamzam ko ruwan sama a farar takarda.
4. Karatu: Karanta "Tawran" sau 266 a kan takardar da kwanon ruwa lita 1 zuwa 3.
5. Amfani: Jiqa takardar a ruwan. Sha kofina daya kowace safe kafin cin abinci har kwana 7 kana karatun sunan sau 266.`,
    invocationAr: 'يا حَيُّ يا قَيُّومُ أَحْيِ قَلْبِي وَبَدَنِي بِحَقِّ طَوْرَانٍ',
    invocationTranslit: 'Ya Hayyu ya Qayyumu ahyi qalbee wa badanee bi-haqqi Tawran',
    invocationFr: 'Ô Vivant, ô Subsistant, vivifie mon cœur, régénère mon corps et dissipe tout mal par la vérité du nom Tawran.',
    invocationEn: 'O Ever-Living, O Self-Subsisting, revitalize my heart, regenerate my body, and dispel all harm by Tawran.',
    invocationHa: 'Ya Raye da ke tsaye da komai, ka rayar da zuciyata da jikina albarkacin Tawran.',
    talsamCode: '٢٦٦ ٥٥٥ ط ط ط 🌿'
  },
  {
    id: 5,
    nameAr: 'مَزْجَلٍ',
    nameTranslit: 'Mazjalin',
    divineAttributeAr: 'القَيُّومُ الأَحَدُ',
    divineAttributeFr: 'Al-Qayyum Al-Ahad (Le Subsistant, L\'Unique Sublimé)',
    divineAttributeEn: 'Al-Qayyum Al-Ahad (The Self-Sustaining, The Singular One)',
    divineAttributeHa: 'Al-Qayyum Al-Ahad (Mai Tsayuwa da Komai, Shi Kadai Tilo)',
    abjadWeight: 83,
    lunarMansion: 'Al-Haq\'ah (الهقعة)',
    element: 'water',
    secretFr: `Grand Secret du Charisme Royal, Élévation de Rang & Déblocage des Portes Fermées. Mazjalin est lié aux noms de Majesté "Al-Qayyum Al-Ahad". Ce nom porte l'onde de choc spirituelle qui débloque les situations administratives apparemment intricables, attire la faveur des gouvernants, des juges et des décideurs, et accorde un prestige naturel irrésistible.

Il confère à celui qui le maîtrise une aura d'autorité douce mais inébranlable. Lorsqu'un individu est confronté à des refus répétés, des dossiers bloqués ou des discriminations injustes, Mazjalin dissout les résistances psychologiques de ses interlocuteurs et inspire le respect immédiat. Il élève le statut social et protège contre les manœuvres d'abaissement.`,
    secretEn: `Grand Secret of Majestic Charisma, Elevation of Status & Unblocking Closed Doors. Mazjalin aligns with "Al-Qayyum Al-Ahad" (The Self-Sustaining, The Singular). It releases an energetic force that dissolves complex administrative blockages, commands favor from authorities and decision-makers, and bestows effortless, dignified prestige.

It wraps the practitioner in a commanding yet gracious aura. When facing institutional deadlocks, bureaucratic rejections, or unfair opposition, Mazjalin neutralizes hostility and inspires immediate deference. It elevates social standing and shields against humilation.`,
    secretHa: `Babban Sirrin Kwarjini na Sarakuna, Daukakar Ranki da Bude Kofofin da Suka Rufe. Mazjalin yana tafiya ne da sunayen Allah "Al-Qayyum Al-Ahad" (Mai Tsayuwa da Komai, Shi Kadai Tilo). Shi ne ke buɗe ayyukan da suka tsaya a hukuma, yana janyo masoya a tsakanin shugabanni da alkallai, kuma yana ba mutum kwarjini na ban mamaki.

Yana sa mutum ya kasance mai kwarjini a idon kowa wanda ba za a iya raina shi ba. Idan an sami aiki ko neman takarda da ya ki fitowa, Mazjalin yana kawar da kowane cikas a cikin sauri. Yana daukaka mutum kuma yana tsare shi daga wulakanci.`,
    recipeFr: `Protocole de Charisme, Élévation & Réussite aux Entretiens :
1. Timing : Le jeudi matin au lever du soleil (heure de Jupiter).
2. Encensement : Brûlez de l\'Oliban supérieur (Luban Dhakar) et de l\'Ambre pur.
3. Calligraphie : Écrivez "Mazjalin" (مَزْجَلٍ) 83 fois à l\'encre de safran et de musc sur une feuille blanche. Ajoutez au bas du texte votre nom et celui de votre mère.
4. Récitation : Lisez le nom "Mazjalin" 83 fois (ou 830 fois pour un grand enjeu) en tenant le papier devant vos lèvres.
5. Application : Pliez le document et portez-le sur vous (poche de poitrine ou bras droit). Avant de vous présenter à un rendez-vous capital ou un examen, récitez le nom 83 fois.`,
    recipeEn: `Charisma, Elevation & Official Interview Success Protocol:
1. Timing: Thursday morning at sunrise (planetary hour of Jupiter).
2. Incense: Burn high-grade Frankincense (Luban Dhakar) and amber resin.
3. Writing: Write "Mazjalin" (مَزْجَلٍ) 83 times using saffron and musk ink on a clean sheet. Include your full name and mother\'s name at the bottom.
4. Recitation: Recite "Mazjalin" 83 times (or 830 times for high-stakes affairs) close to the paper.
5. Application: Fold the document and carry it in your chest pocket or upper right arm. Before entering crucial meetings, recite the name 83 times.`,
    recipeHa: `Hanyar Samun Kwarjini da Nasara a Neman Aiki ko Wurin Shugabanni:
1. Lokaci: Ranar Alhamis da hantsi (sa'a ta farko ta Jupiter).
2. Turare: Kona turaren Luban Dankar da Turaren Ambar.
3. Rubutu: Rubuta "Mazjalin" (مَزْجَلٍ) sau 83 da za'afaran da musk a takarda fara. Rubuta sunanka da na mahaifiyarka a kasan rubutun.
4. Karatu: Karanta "Mazjalin" sau 83 (ko sau 830 domin babban al'amari).
5. Amfani: Nalle takardar ka saka a aljihun gaba na riga. Kafin ka shiga taro ko wurin shugaba, karanta sunan sau 83.`,
    invocationAr: 'يا قَيُّومُ يا أَحَدُ ارْفَعْ قَدْرِي وَسَهِّلْ أَمْرِي بِحَقِّ مَزْجَلٍ',
    invocationTranslit: 'Ya Qayyumu ya Ahadu irfa\' qadree wa sahhil amree bi-haqqi Mazjalin',
    invocationFr: 'Ô Subsistant, ô Unique, élève mon rang, facilite mes démarches et accorde-moi la victoire par la vérité de Mazjalin.',
    invocationEn: 'O Self-Sustaining, O One, elevate my rank, ease my affairs, and grant me success by Mazjalin.',
    invocationHa: 'Ya Mai tsayuwa da kowa, Ya Tilo, ka daga matsayina ka saukaka al\'amarina albarkacin Mazjalin.',
    talsamCode: '٨٣ ١١١ ممم 👑'
  },
  {
    id: 6,
    nameAr: 'بَزْجَلٍ',
    nameTranslit: 'Bazjalin',
    divineAttributeAr: 'الوَدُودُ الرَّؤُوفُ',
    divineAttributeFr: 'Al-Wadud Al-Raoof (Le Particulièrement Aimant, Le Compatissant)',
    divineAttributeEn: 'Al-Wadud Al-Raoof (The Loving One, The Compassionate)',
    divineAttributeHa: 'Al-Wadud Al-Raoof (Mai Masoyi, Mai Tausayi)',
    abjadWeight: 41,
    lunarMansion: 'Al-Hana\'ah (الهنعة)',
    element: 'air',
    secretFr: `Grand Secret de l\'Amour Pur, de l\'Attraction Légitime & de l\'Harmonie Conjugale. Bazjalin incarne les attributs d\'Affection et de Compassion Divines "Al-Wadud Al-Raoof". Ce nom d\'une douceur céleste dissout les rancœurs tenaces, éteint la froideur sentimentale entre époux et inspire une sympathie universelle et sincère auprès de tous ceux qui croisent la route de l\'opérateur.

En affaires et dans le commerce, Bazjalin attire une clientèle fidèle et bienveillante, adoucit les négociations tendues et facilite les accords équitables. Il purifie l\'énergie du cœur des sentiments d\'amertume ou de jalousie, permettant d\'émettre une fréquence d\'amour inconditionnel qui transforme naturellement les oppositions en alliances durables.`,
    secretEn: `Grand Secret of Pure Love, Sacred Attraction & Marital Harmony. Bazjalin manifests the divine attributes "Al-Wadud Al-Raoof" (The All-Loving, The Compassionate). This name releases a celestial frequency that melts resentment, restores emotional warmth between estranged spouses, and inspires genuine affection from everyone encountered.

In commerce, Bazjalin draws loyal, benevolent clients, softens tense contract negotiations, and fosters equitable deals. It purifies the heart of bitterness, enabling one to radiate unconditional warmth that naturally transforms conflict into lasting unity.`,
    secretHa: `Babban Sirrin Kauna ta Halal, Janyo Soyayya da Zaman Lafiya na Ma'aurata. Bazjalin yana dauke da sunayen Allah "Al-Wadud Al-Raoof" (Mai Masoyi, Mai Tausayi). Wannan suna yana da asiri na ban mamaki wanda ke goge kiyayya a zuciya, yana dawo da soyayya da karsashi tsakanin mata da miji, kuma yana sa mutane su ji daɗin mu'amala da kai.

A fannin kasuwanci, Bazjalin yana janyo masu sayen kaya masu albarka, yana saukaka ciniki, kuma yana sa a amince da kai cikin sauri. Yana tsarkake zuciya daga kiyayya ko tsana, yana maida makiya su koma abokai na kusa.`,
    recipeFr: `Protocole d\'Amour Sacré, Réconciliation & Succès Commercial :
1. Timing : Le vendredi soir après la prière du Maghrib (heure de Vénus).
2. Encensement : Brûlez du Benjoin blanc, du Bois de Santal et de la Cannelle moulue.
3. Calligraphie : À l'encre de safran parfumée à l'eau de fleur d'oranger, écrivez "Bazjalin" (بَزْجَلٍ) 41 fois sur une feuille fine ou directement à l\'intérieur d\'un verre en cristal.
4. Récitation : Répétez le nom "Bazjalin" 410 fois (ou 41 fois sur la boisson) en visualisant la paix et l\'affection pure.
5. Application : Partagez cette boisson bénie avec votre conjoint, ou aspergez-en le seuil de votre boutique pour attirer l'abondance des clients.`,
    recipeEn: `Sacred Love, Marriage Reconciliation & Business Success Protocol:
1. Timing: Friday evening after Maghrib prayer (planetary hour of Venus).
2. Incense: Burn white benzoin, sandalwood powder, and ground cinnamon.
3. Calligraphy: Using saffron ink infused with orange blossom water, write "Bazjalin" (بَزْجَلٍ) 41 times on parchment or inside a clean glass vessel.
4. Recitation: Recite "Bazjalin" 410 times (or 41 times directly over the cup) focusing on pure love and harmony.
5. Application: Share the drink with your spouse, or sprinkle the entrance of your store to draw prosperous customers.`,
    recipeHa: `Hanyar Karfafa Soyayya da Samun Masu Sayen Kaya:
1. Lokaci: Ranar Juma'a da daddare bayan sallar Magriba.
2. Turare: Kona turaren Jawi fari, Santal da Kirfa.
3. Rubutu: Rubuta "Bazjalin" (بَزْجَلٍ) sau 41 da za'afaran da ruwan hure a takarda ko a cikin kwanon gilashi.
4. Karatu: Karanta "Bazjalin" sau 410 (ko sau 41 a kan ruwan) kana rokon Allah kauna da zaman lafiya.
5. Amfani: Ba matarka ko mijinki ku sha tare, ko ka yayafa ruwan a bakin shagon kasuwancinca domin janyo masu ciniki.`,
    invocationAr: 'يا وَدُودُ يا رَؤُوفُ أَلْقِ المَحَبَّةَ فِي القُلُوبِ بِحَقِّ بَزْجَلٍ',
    invocationTranslit: 'Ya Wadoodu ya Raoofu alqi al-mahabbata fee al-quloobi bi-haqqi Bazjalin',
    invocationFr: 'Ô Particulièrement Aimant, ô Compatissant, insuffle la charité et l\'amour sincère dans les cœurs par la vérité de Bazjalin.',
    invocationEn: 'O Most Loving, O Compassionate, instill love and affection in hearts by Bazjalin.',
    invocationHa: 'Ya Mai Masoyi, Ya Mai Tausayi, ka jefa soyayya a zukatan mutane albarkacin Bazjalin.',
    talsamCode: '٤١ ٤٤٤ ب ب ب ❤️'
  },
  {
    id: 7,
    nameAr: 'تَرَقَّبٍ',
    nameTranslit: 'Tarqabin',
    divineAttributeAr: 'السَّلَامُ المُنْتَقِمُ',
    divineAttributeFr: 'Al-Salam Al-Muheit (La Paix Suprême, Le Protecteur des Biens)',
    divineAttributeEn: 'Al-Salam Al-Muheit (The Peace, The Universal Guardian)',
    divineAttributeHa: 'Al-Salam (Mai Aminci, Mai Kariya ta Dukiya)',
    abjadWeight: 712,
    lunarMansion: 'Al-Dhira\' (الذراع)',
    element: 'earth',
    secretFr: `Grand Secret de la Garde Céleste & Préservation des Richesses et Domaines. Tarqabin correspond à l\'attribut de Sécurité et de Paix Suprême "Al-Salam Al-Muheit". Ce nom établit un périmètre occulte inviolable autour de la propriété privée, des usines, des véhicules, des stocks commerciaux et des coffres-forts. Il repousse les cambrioleurs, les voleurs, les incendies accidentels et les pillages.

Pour les voyageurs et les commerçants en déplacement, Tarqabin offre un bouclier contre les agressions, les accidents de route et les extorsions. Il surveille la demeure en l\'absence de son propriétaire et paralyse l\'intention de quiconque cherche à s\'emparer injustement de ses biens.`,
    secretEn: `Grand Secret of Celestial Guardianship & Protection of Assets. Tarqabin aligns with "Al-Salam Al-Muheit" (The Supreme Peace, The All-Encompassing Shield). It establishes an inviolable boundary around real estate, vehicles, commercial inventory, and vaults, repelling burglars, arson, and financial ruin.

For travelers and merchants, Tarqabin grants unfailing defense against robbery, highway hazards, and extortion. It guards premises during absence, neutralizing ill intent before harm occurs.`,
    secretHa: `Babban Sirrin Tsare Dukiya, Gida da Shaguna. Tarqabin yana tafiya ne da sunan Allah "Al-Salam" (Mai Aminci da Kariya). Shi ne ke kafa garkuwa mai karfi a kewaye da gida, mota, kayan kasuwanci, da akwatin kudi. Yana korar barayi, yan fashi, gobe, da asarar dukiya ta ba-zata.

Domin masafira da yan kasuwa, Tarqabin yana ba da kariya daga hatsarin hanya da mutane marasa kyau. Yana tsare gida lokacin da babu kowa, yana sa makiya su kasa shiga gidan.`,
    recipeFr: `Protocole de Sécurisation Inviolable des Lieux & Véhicules :
1. Timing : Le samedi matin au lever du soleil ou le mardi la nuit.
2. Encensement : Brûlez du Mastic, de la Myrrhe et du Styrax (Mani).
3. Calligraphie : Écrivez "Tarqabin" (تَرَقَّبٍ) 712 fois sur du parchemin ou une plaque métallique fine (cuivre/laiton). Encerclez avec Ayat al-Kursi.
4. Récitation : Répétez le nom "Tarqabin" 712 fois en brûlant l\'encens.
5. Emplacement : Fixez le document ou la plaque au-dessus de la porte d\'entrée principale, dans le coffre-fort de l\'entreprise ou sous le siège du véhicule.`,
    recipeEn: `Inviolable Property & Vehicle Security Protocol:
1. Timing: Saturday morning at sunrise or Tuesday night.
2. Incense: Burn mastic resin, myrrh, and storax incense.
3. Writing: Inscribe "Tarqabin" (تَرَقَّبٍ) 712 times on parchment paper or thin copper sheet. Encircle with Ayat al-Kursi.
4. Recitation: Recite "Tarqabin" 712 times over the incense smoke.
5. Placement: Affix above main entrance, inside business safe, or beneath vehicle driver seat.`,
    recipeHa: `Hanyar Tsare Gida, Shago ko Mota daga Barayi:
1. Lokaci: Ranar Asabar da hantsi ko ranar Talata da daddare.
2. Turare: Kona turaren Mastaki da Murr da Mani.
3. Rubutu: Rubuta "Tarqabin" (تَرَقَّبٍ) sau 712 a takarda ko fatar karfe. Trace Ayatul Kursiyyu a kewaye.
4. Karatu: Karanta "Tarqabin" sau 712 a kan turaren.
5. Aje: Saka takardar a saman kofar gida, ko cikin akwatin kudi, ko a karkashin kujerar mota.`,
    invocationAr: 'يا سَلَامُ سَلِّمْنِي وَمَالِي مِنْ كُلِّ طَارِقٍ بِحَقِّ تَرَقَّبٍ',
    invocationTranslit: 'Ya Salamu sallimnee wa malee min kulli tariqin bi-haqqi Tarqabin',
    invocationFr: 'Ô Paix, préserve-moi ainsi que mes biens et ma demeure de tout agresseur et intrus par la vérité du nom Tarqabin.',
    invocationEn: 'O Peace, safeguard me, my wealth, and my home from every intruder by Tarqabin.',
    invocationHa: 'Ya Mai Aminci, ka tsareni da dukiyata daga kowane makiyayi albarkacin Tarqabin.',
    talsamCode: '٧١٢ ٨٨٨ ت ت ت 🏠'
  },
  {
    id: 8,
    nameAr: 'بَرْهَشٍ',
    nameTranslit: 'Barhashin',
    divineAttributeAr: 'المُقْتَدِرُ العَزِيزُ',
    divineAttributeFr: 'Al-Muqtadir Al-Aziz (Le Tout-Puissant, Le Glorieux Vainqueur)',
    divineAttributeEn: 'Al-Muqtadir Al-Aziz (The Omnipotent, The Mighty Overcomer)',
    divineAttributeHa: 'Al-Muqtadir Al-Aziz (Mai Cikakken Iko, Mafi Mabayyanan Sarki)',
    abjadWeight: 508,
    lunarMansion: 'Al-Nathrah (النثرة)',
    element: 'fire',
    secretFr: `Grand Secret de la Victoire Décisive & Secours Fulgurant Contre l\'Oppression. Barhashin vibre avec l\'intensité des Noms de Domination Divins "Al-Muqtadir Al-Aziz". C\'est la foudre spirituelle qui foudroie la tyrannie, brise les pièges des ennemis injustes et dissipe les crises existentielles majeures qui menacent de détruire la life d\'un croyant.

Lorsque toutes les portes semblent fermées et que l\'oppression d\'un ennemi puissant devient insupportable, la récitation de Barhashin déclenche une intervention céleste rapide. Il libère l\'opérateur des blocages financiers ou sociaux causés par la jalousie noire et rétablit la justice avec un éclat saisissant.`,
    secretEn: `Grand Secret of Decisive Victory & Swift Relief from Tyranny. Barhashin vibrates with the force of "Al-Muqtadir Al-Aziz" (The Omnipotent, The Mighty). It acts as divine thunder that shatters oppression, dismantles hostile traps, and delivers swift rescue during critical life crises.

When all doors appear locked and the pressure of powerful enemies becomes overwhelming, invoking Barhashin triggers rapid spiritual intervention. It frees the practitioner from financial stagnation caused by envy and restores justice with decisive power.`,
    secretHa: `Babban Sirrin Samun Nasara akan Azzalumai da Dauki na Gaggawa. Barhashin yana tafiya ne da sunan Allah "Al-Muqtadir Al-Aziz" (Mai Cikakken Iko, Glorious King). Shi ne tsawa na samaniya wanda ke ruguza azzalumai, yana lalata makircin makiya, kuma yana yaye matsi mai tsanani a rayuwa.

Lokacin da kofofi suka rufe kuma aka matsawa mutum da zalunci, karanta Barhashin yana kawo agaji na gaggawa daga Allah. Yana 'yanta mutum daga cikas na kudi ko na rayuwa da makiya suka kulla.`,
    recipeFr: `Protocole de Délivrance & Victoire Éclatante :
1. Timing : Le mardi à l\'aube après la prière du Fajr.
2. Encensement : Brûlez de la Myrrhe, du Poivre noir et du Soufre purifié.
3. Calligraphie : Écrivez "Barhashin" (بَرْهَشٍ) 508 fois à l\'encre de safran sur une feuille rouge ou blanche.
4. Récitation : Répétez le nom "Barhashin" 508 fois pendant 3 jours consécutifs en faisant face à la Qibla.
5. Application : Portez la feuille pliée sur vous lors des confrontations ou récitez le nom avant de rencontrer un adversaire pour paralyser sa malveillance.`,
    recipeEn: `Relief & Decisive Triumph Protocol:
1. Timing: Tuesday dawn following Fajr prayer.
2. Incense: Burn myrrh resin, black pepper, and purified sulfur.
3. Writing: Inscribe "Barhashin" (بَرْهَشٍ) 508 times on red or white paper using saffron ink.
4. Recitation: Recite "Barhashin" 508 times daily for 3 consecutive days facing Qibla.
5. Application: Carry the folded amulet during confrontations or recite before meeting opponents to neutralize hostility.`,
    recipeHa: `Hanyar Samun Nasara a Kan Azzalumai:
1. Lokaci: Ranar Talata da asuba bayan sallar Fajr.
2. Turare: Kona turaren Murr, Masoro da Ciki.
3. Rubutu: Rubuta "Barhashin" (بَرْهَشٍ) sau 508 da za'afaran a takarda ja ko fara.
4. Karatu: Karanta "Barhashin" sau 508 har kwana 3 a jera kana fuskantar Alkibla.
5. Amfani: Rike takardar lokacin zuwa wurin shari'a ko wurin makiyayi domin ruguza fushinsa.`,
    invocationAr: 'يا مُقْتَدِرُ انْصُرْنِي عَلَى مَنْ ظَلَمَنِي بِحَقِّ بَرْهَشٍ',
    invocationTranslit: 'Ya Muqtadiru unsurnee ala man dhalamanee bi-haqqi Barhashin',
    invocationFr: 'Ô Tout-Puissant, accorde-moi une victoire éclatante sur quiconque m\'opprime ou me nuit par la vérité de Barhashin.',
    invocationEn: 'O Omnipotent One, grant me victory over whoever oppresses or harms me by Barhashin.',
    invocationHa: 'Ya Mai Cikakken Iko, ka taimakeni akan wanda ya zalunce ni albarkacin Barhashin.',
    talsamCode: '٥٠٨ ٩٩٩ ب ب ب ⚔️'
  },
  {
    id: 9,
    nameAr: 'غَلْمَشٍ',
    nameTranslit: 'Ghalmashin',
    divineAttributeAr: 'الأَوَّلُ الآخِرُ',
    divineAttributeFr: 'Al-Awwal Al-Akhir (Le Premier sans Début, Le Dernier sans Fin)',
    divineAttributeEn: 'Al-Awwal Al-Akhir (The First, The Last)',
    divineAttributeHa: 'Al-Awwal Al-Akhir (Na Farko, Na Karshe)',
    abjadWeight: 1370,
    lunarMansion: 'Al-Tarf (الطرف)',
    element: 'water',
    secretFr: `Grand Secret de l\'Exorcisme des Lieux, Expulsion des Esprits Perturbateurs & Nettoyage Astral. Ghalmashin est associé aux Noms d\'Éternité "Al-Awwal Al-Akhir" (Le Premier et le Dernier). C\'est le marteau céleste utilisé par les maîtres pour purifier les maisons hantées, dissiper les entités astrales négatives, briser les blocages fonciers et chasser les djinns rebelles qui perturbent la paix d\'un foyer.

Ce nom rétablit l\'ordre vibratoire originel d\'un espace souillé par des rituels sombres ou des évènements tragiques passés. Il ramène la sérénité, permet un sommeil réparateur sans cauchemars et attire la bénédiction divine sur la demeure.`,
    secretEn: `Grand Secret of Place Exorcism, Banishing Distracting Spirits & Space Cleansing. Ghalmashin aligns with "Al-Awwal Al-Akhir" (The First and The Last). It serves as a celestial hammer used to cleanse haunted premises, banish negative entities, dissolve land curses, and expel rebellious spirits disrupting household peace.

This name restores primordial energetic equilibrium to spaces polluted by negative history or dark practices, bringing serene atmosphere and restorative sleep.`,
    secretHa: `Babban Sirrin Korar Aljannu a Gida da Tsarkake Muhalli. Ghalmashin yana tafiya ne da sunayen Allah "Al-Awwal Al-Akhir" (Na Farko, Na Karshe). Shi ne guduma na samaniya da ake amfani da shi domin wanke gidan da aljannu suka damu, korar mugayen ruhanai, da tsarkake wuri daga tsohon asiri.

Yana maida daki da muhalli su kasance cikin aminci da tsarkake, yana sa ayi barci mai dadi ba tare da mafarki mai firgitarwa ba.`,
    recipeFr: `Protocole Canonique d\'Exorcisme & Purification des Lieux :
1. Timing : Le lundi ou le jeudi soir après la prière du Maghrib.
2. Encensement : Brûlez de la Myrrhe, du Benjoin et de l\'Oliban.
3. Calligraphie : À l'encre de safran, écrivez "Ghalmashin" (غَلْمَشٍ) 1370 fois sur une assiette ou du papier.
4. Solution : Dissolvez l\'écriture dans un grand récipient contenant 7 litres d\'eau de source et 3 poignées de gros sel de mer.
5. Aspergement : Aspergez abondamment les sols, murs, coins et seuils de la maison durant 3 soirs d\'affilée.`,
    recipeEn: `Canonical Exorcism & Space Purification Protocol:
1. Timing: Monday or Thursday evening following Maghrib prayer.
2. Incense: Burn myrrh resin, benzoin, and frankincense.
3. Writing: Write "Ghalmashin" (غَلْمَشٍ) 1370 times using saffron ink on paper or plate.
4. Solution: Dissolve into 7 liters of spring water mixed with 3 handfuls of coarse sea salt.
5. Application: Sprinkle floors, walls, corners, and doorways for 3 consecutive nights.`,
    recipeHa: `Hanyar Korar Aljannu da Tsaftace Gida:
1. Lokaci: Ranar Litinin ko Alhamis da daddare.
2. Turare: Kona turaren Murr, Jawi da Luban.
3. Rubutu: Rubuta "Ghalmashin" (غَلْمَشٍ) sau 1370 da za'afaran.
4. Wanke: Wanke a lita 7 na ruwa da gishiri mai yawa.
5. Yayafawa: Yayafa a kasan daki, bango, da kusurwoyin gida har tsawon daren kwana 3.`,
    invocationAr: 'يا أَوَّلُ يا آخِرُ أُخْرُجْ كُلَّ شَيْطَانٍ مَرِيدٍ بِحَقِّ غَلْمَشٍ',
    invocationTranslit: 'Ya Awwalu ya Akhiru ukhruj kulla shaytanin mareedin bi-haqqi Ghalmashin',
    invocationFr: 'Ô Premier, ô Dernier, chasse tout esprit perturbateur et purifie cet espace par la vérité du nom Ghalmashin.',
    invocationEn: 'O First, O Last, expel every disturbing spirit and cleanse this space by Ghalmashin.',
    invocationHa: 'Ya Na Farko, Ya Na Karshe, ka fitar da kowane shaidan mai tawaye albarkacin Ghalmashin.',
    talsamCode: '١٣٧٠ ٣٣٣ غ غ غ 🌀'
  },
  {
    id: 10,
    nameAr: 'خَوْطِيرٍ',
    nameTranslit: 'Khutirin',
    divineAttributeAr: 'القَوِيُّ المَتِينُ',
    divineAttributeFr: 'Al-Qawiyy Al-Mateen (Le Fort Inébranlable, Le Roc Inlassable)',
    divineAttributeEn: 'Al-Qawiyy Al-Mateen (The Strong, The Firm Rock)',
    divineAttributeHa: 'Al-Qawiyy Al-Mateen (Mafi Karfi, Mai Kafuwa)',
    abjadWeight: 825,
    lunarMansion: 'Al-Jabhah (الجبهة)',
    element: 'earth',
    secretFr: `Grand Secret de l\'Autorité Naturelle, Volonté d\'Acier & Inébranlabilité Spirituelle. Khutirin vibre sous la fréquence de "Al-Qawiyy Al-Mateen" (Le Fort, Le Inébranlable). Ce nom insuffle une puissance morale d\'une fermeté colossale, élimine la paresse, la procrastination, l\'hésitation maladive et la peur de l\'échec.

Il confère au praticien une prestance majestueuse, renforce sa discipline personnelle et lui permet de mener à bien des projets gigantesques sans faiblir. Face aux obstacles redoutables, Khutirin agit comme une enclume spirituelle qui absorbe les chocs et renvoie une force irrésistible.`,
    secretEn: `Grand Secret of Natural Authority, Iron Willpower & Spiritual Steadfastness. Khutirin resonates with "Al-Qawiyy Al-Mateen" (The Strong, The Firm). It infuses heroic moral endurance, eradicates procrastination, hesitation, and fear of failure.

It endows the practitioner with commanding presence, reinforces personal discipline, and enables the completion of monumental tasks without weakness. Facing severe trials, Khutirin acts as a spiritual anvil absorbing shocks and projecting power.`,
    secretHa: `Babban Sirrin Karfin Zuciya, Kwarjini da Kauda Kasala. Khutirin yana tafiya ne da sunayen Allah "Al-Qawiyy Al-Mateen" (Mafi Karfi, Mai Kafuwa). Yana cika zuciya da karfi na ban mamaki, yana kauda kasala, tsoro, da fargabar gazawa.

Yana ba mutum kwarjini na shugabanci, yana karfafa juriya da natsuwa, kuma yana sa a kammala ayyuka masu nauyi cikin nasara. Idan aka fuskanci babban cikas, Khutirin yana ba zuciya tsaiwa mai karfi.`,
    recipeFr: `Protocole de Volonté Inébranlable & Charisme d\'Autorité :
1. Timing : Le mardi matin au lever du soleil.
2. Encensement : Brûlez de l\'Oliban et du Mastic.
3. Calligraphie : Écrivez "Khutirin" (خَوْطِيرٍ) 825 fois à l\'encre de safran sur papier.
4. Récitation : Répétez le nom 825 fois chaque matin durant 7 jours.
5. Application : Portez le talisman au bras droit ou dans votre poche.`,
    recipeEn: `Iron Willpower & Command Charisma Protocol:
1. Timing: Tuesday morning at sunrise.
2. Incense: Burn frankincense and mastic resin.
3. Writing: Write "Khutirin" (خَوْطِيرٍ) 825 times with saffron ink.
4. Recitation: Recite 825 times every morning for 7 days.
5. Application: Carry on right arm or chest pocket.`,
    recipeHa: `Hanyar Karfafa Volonte da Samun Kwarjini:
1. Lokaci: Ranar Talata da hantsi.
2. Turare: Kona turaren Luban da Mastaki.
3. Rubutu: Rubuta "Khutirin" (خَوْطِيرٍ) sau 825 da za'afaran.
4. Karatu: Karanta sau 825 kowace safe har kwana 7.
5. Amfani: Daure a hannun dama ko a aljihu.`,
    invocationAr: 'يا قَوِيُّ يا مَتِينُ قَوِّ عَزِيمَتِي وَحُصْنِي بِحَقِّ خَوْطِيرٍ',
    invocationTranslit: 'Ya Qawiyyu ya Mateenu qawwi azeematei wa husnee bi-haqqi Khutirin',
    invocationFr: 'Ô Fort, ô Inébranlable, fortifie ma résolution, mon esprit et ma protection par la vérité de Khutirin.',
    invocationEn: 'O Strong One, O Firm One, strengthen my resolve, spirit, and defense by Khutirin.',
    invocationHa: 'Ya Mafi Karfi, Ya Mai Kafuwa, ka karfafa niyetana da kariyata albarkacin Khutirin.',
    talsamCode: '٨٢٥ ٦٦٦ خ خ خ 🏰'
  },
  {
    id: 11,
    nameAr: 'قَلْنَهُودٍ',
    nameTranslit: 'Qalanhoodin',
    divineAttributeAr: 'السَّمِيعُ البَصِيرُ',
    divineAttributeFr: 'Al-Sami\' Al-Basir (L\'Audient, Le Clairvoyant Suprême)',
    divineAttributeEn: 'Al-Sami\' Al-Basir (The All-Hearing, The All-Seeing)',
    divineAttributeHa: 'Al-Sami\' Al-Basir (Mai Ji, Mai Gani)',
    abjadWeight: 285,
    lunarMansion: 'Al-Zubrah (الزبرة)',
    element: 'air',
    secretFr: `Grand Secret de l\'Exaucement Éclair, Éveil de la Vision Spirituelle (Basirah) & Dévoilement des Secrets. Qalanhoodin correspond aux attributs d\'Audition et de Vision Divines "Al-Sami\' Al-Basir". Ce nom possède la vertu d\'accélérer la réponse aux invocations sincères et de percer les voiles de la tromperie.

Il aiguise la perception extrasensorielle, développe l\'intuition spirituelle et permet de discerner la vérité cachée derrière les apparences flatteuses ou mensongères.`,
    secretEn: `Grand Secret of Swift Answered Prayers, Awakening Spiritual Vision & Unveiling Mysteries. Qalanhoodin embodies "Al-Sami\' Al-Basir" (The All-Hearing, The All-Seeing). It accelerates answered prayers and pierces illusionary veils.

It sharpens intuitive perception, unlocks inner spiritual vision (Basirah), and exposes hidden truths behind deceitful appearances.`,
    secretHa: `Babban Sirrin Amsar Addu\'a da Sauri da Bude Idon Basira. Qalanhoodin yana wakiltar sunayen Allah "Al-Sami\' Al-Basir" (Mai Ji, Mai Gani). Yana sa addu'a ta amsu da sauri kuma yana gane boyayyen sirri.

Yana bude idon basira na zuciya, yana gane kage ko yaudara, kuma yana nuna gaskiyar lamari.`,
    recipeFr: `Protocole pour l\'Exaucement Immédiat :
1. Timing : La nuit durant le dernier tiers (entre 2h et 4h du matin).
2. Encensement : Brûlez du Benjoin pur.
3. Calligraphie : Écrivez "Qalanhoodin" (قَلْنَهُودٍ) 285 fois sur papier.
4. Récitation : Répétez le nom 285 fois suivi de votre invocation sincère.
5. Conservation : Gardez le document dans votre livre de prière.`,
    recipeEn: `Immediate Prayer Answer Protocol:
1. Timing: Last third of the night (2 AM to 4 AM).
2. Incense: Burn pure benzoin.
3. Writing: Write "Qalanhoodin" (قَلْنَهُودٍ) 285 times.
4. Recitation: Recite 285 times followed by personal prayer.
5. Application: Keep inside prayer book.`,
    recipeHa: `Hanyar Amsar Addu\'a da Sauri:
1. Lokaci: Karshen dare (tsakanin karfe 2 zuwa 4 na dare).
2. Turare: Kona turaren Jawi.
3. Rubutu: Rubuta "Qalanhoodin" (قَلْنَهُودٍ) sau 285.
4. Karatu: Karanta sau 285 sannan yi addu\'arka.
5. Aje: Saka a littafin addu\'a.`,
    invocationAr: 'يا سَمِيعُ يا بَصِيرُ اسْتَجِبْ دُعَائِي بِحَقِّ قَلْنَهُودٍ',
    invocationTranslit: 'Ya Samee\'u ya Baseeru istajib du\'a\'ee bi-haqqi Qalanhoodin',
    invocationFr: 'Ô Audient, ô Clairvoyant, écoute mon appel et exauce ma prière par la vérité du nom Qalanhoodin.',
    invocationEn: 'O All-Hearing, O All-Seeing, hear my cry and answer my prayer by Qalanhoodin.',
    invocationHa: 'Ya Mai ji, Ya Mai gani, ka amsa addu\'ata albarkacin Qalanhoodin.',
    talsamCode: '٢٨٥ ٧٧٧ ق ق ق 👁️'
  },
  {
    id: 12,
    nameAr: 'بَرْشَانٍ',
    nameTranslit: 'Barshanin',
    divineAttributeAr: 'المُحِيطُ القَادِرُ',
    divineAttributeFr: 'Al-Muheit Al-Qadir (Le Tout-Englobant, Le Protecteur des Terres)',
    divineAttributeEn: 'Al-Muheit Al-Qadir (The All-Encompassing, Guardian of Lands)',
    divineAttributeHa: 'Al-Muheit (Mai Kewaye da Komai da Kariyata)',
    abjadWeight: 553,
    lunarMansion: 'Al-Sarfah (الصرفة)',
    element: 'water',
    secretFr: `Grand Secret de la Bénédiction des Récoltes, Fertilité des Terres & Abondance des Réserves. Barshanin est rattaché à "Al-Muheit Al-Qadir" (Le Tout-Englobant). Ce nom infuse la fertilité dans les sols, protège les plantations contre la sécheresse et préserve les stocks agricoles et commerciaux de la détérioration.`,
    secretEn: `Grand Secret of Agricultural Blessing, Soil Fertility & Abundant Reserves. Barshanin correlates with "Al-Muheit Al-Qadir" (The All-Encompassing). It infuses fertility into land, protects crops from drought, and preserves commercial inventory.`,
    secretHa: `Babban Sirrin Albarkatar Gona da Dukiya. Barshanin yana tafiya ne da sunan Allah "Al-Muheit" (Mai Kewaye da Komai). Yana kawo albarka a gona, shago, da dukiyoyin amfanin gona.`,
    recipeFr: `Protocole de Bénédiction des Domaines :
1. Timing : Le vendredi matin au lever du soleil.
2. Encensement : Brûlez du Mastic.
3. Récitation : Répétez "Barshanin" 553 fois sur une grande jarre d\'eau.
4. Aspergement : Arrosez les quatre coins de votre terrain ou magasin.`,
    recipeEn: `Land Blessing Protocol:
1. Timing: Friday sunrise.
2. Incense: Burn mastic resin.
3. Recitation: Recite "Barshanin" 553 times over a jar of water.
4. Application: Sprinkle at boundaries of land or shop.`,
    recipeHa: `Hanyar Albarkaci Gona da Shago:
1. Lokaci: Ranar Juma\'a da hantsi.
2. Turare: Kona turaren Mastaki.
3. Karatu: Karanta sau 553 a kwanon ruwa.
4. Yayafawa: Yayafa a kusurwoyin gona ko shago.`,
    invocationAr: 'يا مُحِيطُ بَارِكْ لِي فِي رِزْقِي وَأَرْضِي بِحَقِّ بَرْشَانٍ',
    invocationTranslit: 'Ya Muheetu barik lee fee rizqee wa ardee bi-haqqi Barshanin',
    invocationFr: 'Ô Tout-Englobant, bénis ma subsistance, protège ma terre et fais prospérer mes récoltes par la vérité de Barshanin.',
    invocationEn: 'O All-Encompassing, bless my provision, protect my land, and prosper my harvests by Barshanin.',
    invocationHa: 'Ya Mai kewaye da komai, ka albarkaci arzikina da kasata albarkacin Barshanin.',
    talsamCode: '٥٥٣ ٢٢٢ ب ب ب 🌾'
  },
  {
    id: 13,
    nameAr: 'كِظَهِيرٍ',
    nameTranslit: 'Kathirin',
    divineAttributeAr: 'المُتَعَالِي الحَكِيمُ',
    divineAttributeFr: 'Al-Muta\'ali Al-Hakim (Le Sublimement Élevé, Le Juste)',
    divineAttributeEn: 'Al-Muta\'ali Al-Hakim (The Supremely Exalted, The Wise Judge)',
    divineAttributeHa: 'Al-Muta\'ali (Mafi Daukaka da Hikima)',
    abjadWeight: 1135,
    lunarMansion: 'Al-Awwa (العواء)',
    element: 'fire',
    secretFr: `Grand Secret du Triomphe Judiciaire, Démantèlement des Calomnies & Restauration de l\'Honneur. Kathirin s\'aligne sur "Al-Muta\'ali Al-Hakim". Il détruit les faux témoignages, fait triompher l\'innocence dans les litiges et confond les calomniateurs.`,
    secretEn: `Grand Secret of Legal Victory, Overturning Slander & Restoring Honor. Kathirin aligns with "Al-Muta\'ali Al-Hakim". It shatters false testimonies and grants triumph in court disputes.`,
    secretHa: `Babban Sirrin Samun Nasara a Shari\'a da Ruguza Kage. Kathirin yana tafiya ne da sunan Allah "Al-Muta\'ali" (Mafi Daukaka). Yana ruguza kage da shaidar zur a shari\'a.`,
    recipeFr: `Protocole de Victoire en Justice :
1. Timing : Le vendredi avant la prière du Jumu\'ah.
2. Encensement : Brûlez du Mastic.
3. Calligraphie : Écrivez "Kathirin" (كِظَهِيرٍ) 1135 fois à l\'encre de safran.
4. Récitation : Répétez 1135 fois après la prière.
5. Application : Portez le document lors des audiences.`,
    recipeEn: `Court Victory Protocol:
1. Timing: Friday before Jumu\'ah prayer.
2. Incense: Burn mastic.
3. Writing: Write 1135 times with saffron ink.
4. Recitation: Recite 1135 times after prayer.
5. Application: Carry during court sessions.`,
    recipeHa: `Hanyar Nasara a Shari\'a:
1. Lokaci: Juma\'a kafin salla.
2. Turare: Kona Mastaki.
3. Rubutu: Rubuta sau 1135.
4. Karatu: Karanta sau 1135 bayan salla.
5. Amfani: Rike a aljihu wurin shari\'a.`,
    invocationAr: 'يا مُتَعَالِي انْصُرِ الحَقَّ وَأَزْهِقِ البَاطِلَ بِحَقِّ كِظَهِيرٍ',
    invocationTranslit: 'Ya Muta\'alee unsur al-haqqa wa azhiq al-batila bi-haqqi Kathirin',
    invocationFr: 'Ô Sublimement Élevé, fais triompher le droit, détruis le mensonge et protège mon honneur par la vérité de Kathirin.',
    invocationEn: 'O Supremely Exalted, champion the right, destroy falsehood, and guard my honor by Kathirin.',
    invocationHa: 'Ya Mafi Daukaka, ka la\'anta karya ka bayyana gaskiya albarkacin Kathirin.',
    talsamCode: '١١٣٥ ١١١ ك ك ك ⚖️'
  },
  {
    id: 14,
    nameAr: 'نَمُوشَلَخٍ',
    nameTranslit: 'Namushalakhin',
    divineAttributeAr: 'العَزِيزُ الحَكِيمُ',
    divineAttributeFr: 'Al-Aziz Al-Hakim (Le Puissant Sage, Le Pacificateur de l\'Âme)',
    divineAttributeEn: 'Al-Aziz Al-Hakim (The Almighty, Wise Soul Pacifier)',
    divineAttributeHa: 'Al-Aziz Al-Hakim (Mai Mabayyanan Iko da Hikima)',
    abjadWeight: 1086,
    lunarMansion: 'Al-Simak (السماك)',
    element: 'air',
    secretFr: `Grand Secret de la Sérénité Intérieure, Curation de l\'Anxiété & Extinction des Obsessions (Waswas). Namushalakhin insuffle une paix profonde dans le cœur, guérit les phobies graves et libère des crises de panique.`,
    secretEn: `Grand Secret of Inner Serenity, Anxiety Relief & Quenching Waswas. Namushalakhin bestows profound peace, heals phobias, and lifts panic attacks.`,
    secretHa: `Babban Sirrin Natsuwar Zuciya da Kawar da Fargaba da Waswasi. Namushalakhin yana kawo natsuwa a zuciya, yana maganin firgita da waswasi.`,
    recipeFr: `Protocole de Paix Mentale :
1. Timing : Le soir avant le coucher.
2. Calligraphie : Écrivez "Namushalakhin" (نَمُوشَلَخٍ) 1086 fois sur papier.
3. Récitation : Répétez 1086 fois sur une coupe d\'eau de fleur d\'oranger.
4. Consommation : Buvez avant de dormir durant 5 soirs.`,
    recipeEn: `Mental Peace Protocol:
1. Timing: Evening before sleep.
2. Writing: Write 1086 times.
3. Recitation: Recite 1086 times over orange blossom water.
4. Application: Drink before sleeping for 5 nights.`,
    recipeHa: `Hanyar Natsuwar Zuciya:
1. Lokaci: Daddare kafin barci.
2. Rubutu: Rubuta sau 1086.
3. Karatu: Karanta sau 1086 a ruwa.
4. Amfani: Sha kafin barci har kwana 5.`,
    invocationAr: 'يا عَزِيزُ يا حَكِيمُ أَنْزِلِ السَّكِينَةَ فِي قَلْبِي بِحَقِّ نَمُوشَلَخٍ',
    invocationTranslit: 'Ya Azeezu ya Hakeemu anzil as-sakeenata fee qalbee bi-haqqi Namushalakhin',
    invocationFr: 'Ô Puissant, ô Sage, fais descendre une sérénité inébranlable dans mon cœur par la vérité de Namushalakhin.',
    invocationEn: 'O Almighty, O Wise, send down unshakeable tranquility into my heart by Namushalakhin.',
    invocationHa: 'Ya Mai Iko, Ya Mai Hikima, ka saukar da natsuwa a zuciyata albarkacin Namushalakhin.',
    talsamCode: '١٠٨٦ ٥٥٥ ن ن ن 🕊️'
  },
  {
    id: 15,
    nameAr: 'بَرَهَيُولا',
    nameTranslit: 'Barhayula',
    divineAttributeAr: 'الخَبِيرُ العَلِيمُ',
    divineAttributeFr: 'Al-Khabir Al-Alim (L\'Informé, Le Connaisseur des Mystères)',
    divineAttributeEn: 'Al-Khabir Al-Alim (The All-Aware, Knower of Mysteries)',
    divineAttributeHa: 'Al-Khabir Al-Alim (Mai Labari, Mai Sani)',
    abjadWeight: 261,
    lunarMansion: 'Al-Ghafr (الغفر)',
    element: 'water',
    secretFr: `Grand Secret des Songes Véridiques (Ru\'ya Sadiqa), Istikhara Céleste & Clairvoyance Spirituelle. Barhayula permet de recevoir des visions claires durant le sommeil et de percer les mystères occultés.`,
    secretEn: `Grand Secret of Truthful Dream Visions (Ru\'ya Sadiqa) & Celestial Istikhara. Barhayula unlocks clear dream guidance and spiritual revelations.`,
    secretHa: `Babban Sirrin Ganin Mafarki Mai Kyau da Istikhara na Gaskiya. Barhayula yana sa a gani gaskiya a mafarki da samun shiriya ta samaniya.`,
    recipeFr: `Protocole de Vision en Songe (Istikhara) :
1. Timing : Avant de vous coucher en état de pureté (Wudu).
2. Encensement : Brûlez du Benjoin.
3. Récitation : Répétez "Barhayula" 261 fois avec l\'intention de guidage.
4. Calligraphie : Écrivez le nom 7 fois sur la paume droite.`,
    recipeEn: `Dream Vision Protocol:
1. Timing: Before sleep in full purity (Wudu).
2. Incense: Burn frankincense.
3. Recitation: Recite "Barhayula" 261 times.
4. Application: Write name 7 times on right palm.`,
    recipeHa: `Hanyar Istikhara a Mafarki:
1. Lokaci: Kafin barci a kan tsarki.
2. Turare: Kona Luban.
3. Karatu: Karanta sau 261.
4. Amfani: Rubuta sau 7 a tafarin hannun dama.`,
    invocationAr: 'يا خَبِيرُ يا عَلِيمُ أَرِنِي الحَقَّ حَقّاً فِي مَنَامِي بِحَقِّ بَرَهَيُولا',
    invocationTranslit: 'Ya Khabeeru ya Aleemu arinee al-haqqa haqqan fee manamee bi-haqqi Barhayula',
    invocationFr: 'Ô Informé, ô Omniscient, dévoile-moi la vérité pure à travers mes rêves par la vérité de Barhayula.',
    invocationEn: 'O All-Aware, O All-Knowing, reveal absolute truth to me in my dreams by Barhayula.',
    invocationHa: 'Ya Mai labari, Ya Mai sani, ka nuna min gaskiya a mafarkina albarkacin Barhayula.',
    talsamCode: '٢٦١ ٧٧٧ ب ب ب 🌙'
  },
  {
    id: 16,
    nameAr: 'بَشْكِيلَخٍ',
    nameTranslit: 'Bashkilakhin',
    divineAttributeAr: 'الرَّؤُوفُ الرَّحِيمُ',
    divineAttributeFr: 'Al-Raoof Al-Rahim (Le Compatissant, Le Libérateur des Dettes)',
    divineAttributeEn: 'Al-Raoof Al-Rahim (The Compassionate, Deliverer from Debt)',
    divineAttributeHa: 'Al-Raoof Al-Rahim (Mai Tausayi, Mai Rahama)',
    abjadWeight: 1362,
    lunarMansion: 'Al-Zubana (الزبانى)',
    element: 'earth',
    secretFr: `Grand Secret du Soulagement des Dettes Étouffantes & Secours Financier. Bashkilakhin adoucit les épreuves financières sévères et ouvre des voies imprévues d\'allègement.`,
    secretEn: `Grand Secret of Debt Deliverance & Financial Relief. Bashkilakhin eases severe financial burdens and opens unexpected pathways of wealth.`,
    secretHa: `Babban Sirrin Biyan Bashi da Samun Sauki na Kudi. Bashkilakhin yana saukaka nauyin bashi da buɗe hanyoyin samun kudi ta ba-zata.`,
    recipeFr: `Protocole de Libération des Dettes :
1. Timing : Le dimanche matin à l\'aube.
2. Calligraphie : Écrivez "Bashkilakhin" (بَشْكِيلَخٍ) 1362 fois à l\'encre de safran.
3. Récitation : Répétez 1362 fois après la prière de l\'Isha pendant 7 soirs.`,
    recipeEn: `Debt Deliverance Protocol:
1. Timing: Sunday morning at dawn.
2. Writing: Write 1362 times with saffron ink.
3. Recitation: Recite 1362 times after Isha for 7 nights.`,
    recipeHa: `Hanyar Biyan Bashi:
1. Lokaci: Lahadi da asuba.
2. Rubutu: Rubuta sau 1362 da za'afaran.
3. Karatu: Karanta sau 1362 bayan Isha har kwana 7.`,
    invocationAr: 'يا رَؤُوفُ يا رَحِيمُ اقْضِ دَيْنِي وَفَرِّجْ هَمِّي بِحَقِّ بَشْكِيلَخٍ',
    invocationTranslit: 'Ya Raoofu ya Raheemu iqdi daynee wa farrij hammee bi-haqqi Bashkilakhin',
    invocationFr: 'Ô Compatissant, ô Miséricordieux, règle mes dettes, dissipe mon souci et soulage mon fardeau par la vérité de Bashkilakhin.',
    invocationEn: 'O Compassionate, O Merciful, clear my debts, ease my worry, and relieve my load by Bashkilakhin.',
    invocationHa: 'Ya Mai Tausayi, Ya Mai Rahama, ka biya min bashina ka yaye damuwata albarkacin Bashkilakhin.',
    talsamCode: '١٣٦٢ ٤٤٤ ب ب ب 💰'
  },
  {
    id: 17,
    nameAr: 'قَزْمَزٍ',
    nameTranslit: 'Qazmazin',
    divineAttributeAr: 'المُعِزُّ المَانِعُ',
    divineAttributeFr: 'Al-Mu\'izz Al-Mani\' (Le Donneur de Dignité, Le Protecteur de la Réputation)',
    divineAttributeEn: 'Al-Mu\'izz Al-Mani\' (Bestower of Honor, Shield of Reputation)',
    divineAttributeHa: 'Al-Mu\'izz (Mai Ba da Daukaka da Girma)',
    abjadWeight: 157,
    lunarMansion: 'Al-Iklil (الإكليل)',
    element: 'fire',
    secretFr: `Grand Secret de la Restauration de l\'Honneur & Dignité Protégée. Qazmazin protège contre l\'humiliation publique, élève le prestige moral et préserve la réputation.`,
    secretEn: `Grand Secret of Restoring Honor & Shielding Reputation. Qazmazin protects against public humiliation and elevates moral standing.`,
    secretHa: `Babban Sirrin Mutunci da Daukakar Girma. Qazmazin yana tsare mutun a idon jama\'a kuma yana daukaka martaba.`,
    recipeFr: `Protocole de Dignité :
1. Timing : Chaque matin après la prière du Fajr.
2. Récitation : Répétez "Qazmazin" 157 fois.
3. Calligraphie : Écrivez 157 fois sur soie blanche et portez sur vous.`,
    recipeEn: `Honor Preservation Protocol:
1. Timing: Every morning after Fajr.
2. Recitation: Recite 157 times.
3. Writing: Write 157 times on white silk and carry.`,
    recipeHa: `Hanyar Tsare Mutunci:
1. Lokaci: Kowace safe bayan Fajr.
2. Karatu: Karanta sau 157.
3. Rubutu: Rubuta sau 157 a gidan siliki.`,
    invocationAr: 'يا مُعِزُّ أَعِزَّنِي بِطَاعَتِكَ وَاحْفَظْ كَرَامَتِي بِحَقِّ قَزْمَزٍ',
    invocationTranslit: 'Ya Mu\'izzu a\'izzanee bi-ta\'atika wahfadh karamatee bi-haqqi Qazmazin',
    invocationFr: 'Ô Donneur d\'Honneur, élève mon rang dans ton obéissance et préserve ma dignité par la vérité de Qazmazin.',
    invocationEn: 'O Bestower of Honor, exalt my rank in Your obedience and guard my dignity by Qazmazin.',
    invocationHa: 'Ya Mai ba da daukaka, ka daukakani da biyayyarka ka tsare mutuncina albarkacin Qazmazin.',
    talsamCode: '١٥٧ ٨٨٨ ق ق ق 👑'
  },
  {
    id: 18,
    nameAr: 'أَنْغَلَلِيطٍ',
    nameTranslit: 'Anaghlalitin',
    divineAttributeAr: 'الحَكِيمُ العَدْلُ',
    divineAttributeFr: 'Al-Hakim Al-Adl (Le Sage, Le Juste Arbitre)',
    divineAttributeEn: 'Al-Hakim Al-Adl (The Wise, The Just Arbitrator)',
    divineAttributeHa: 'Al-Hakim Al-Adl (Mai Hikima, Mai Adalci)',
    abjadWeight: 1150,
    lunarMansion: 'Al-Qalb (القلب)',
    element: 'air',
    secretFr: `Grand Secret de l\'Arbitrage Équitable & Conciliation dans les Litiges Complexes. Anaghlalitin éteint les haines entre associés et rétablit l\'équité.`,
    secretEn: `Grand Secret of Just Mediation & Resolving Deep Feuds. Anaghlalitin restores equity among partners and extinguishes conflicts.`,
    secretHa: `Babban Sirrin Sasanta Rigima cikin Adalci. Anaghlalitin yana kashe kiyayya tsakanin abokan kasuwanci ko yan uwa.`,
    recipeFr: `Protocole d\'Arbitrage :
1. Timing : Le mardi à l\'aube.
2. Calligraphie : Écrivez "Anaghlalitin" (أَنْغَلَلِيطٍ) 1150 fois.
3. Récitation : Répétez 1150 fois sur une eau destinée aux parties.`,
    recipeEn: `Mediation Protocol:
1. Timing: Tuesday dawn.
2. Writing: Write 1150 times.
3. Recitation: Recite 1150 times over water for conflicting parties.`,
    recipeHa: `Hanyar Sasanta Mutane:
1. Lokaci: Talata da asuba.
2. Rubutu: Rubuta sau 1150.
3. Karatu: Karanta sau 1150 a ruwa ka ba su su sha.`,
    invocationAr: 'يا حَكِيمُ يا عَدْلُ احْكُمْ بَيْنَنَا بِالحَقِّ بِحَقِّ أَنْغَلَلِيطٍ',
    invocationTranslit: 'Ya Hakeemu ya Adlu uhkum baynana bi-al-haqqi bi-haqqi Anaghlalitin',
    invocationFr: 'Ô Sage, ô Juste, arbitre entre nous avec équité et vérité par la vertu d\'Anaghlalitin.',
    invocationEn: 'O Wise, O Just, judge between us with equity and truth by Anaghlalitin.',
    invocationHa: 'Ya Mai Hikima, Ya Mai Adalci, ka yi shari\'a tsakaninmu da gaskiya albarkacin Anaghlalitin.',
    talsamCode: '١١٥٠ ٣٣٣ أ أ أ ⚖️'
  },
  {
    id: 19,
    nameAr: 'قَبَرَاَتٍ',
    nameTranslit: 'Qabratin',
    divineAttributeAr: 'البَاقِي الدَّائِمُ',
    divineAttributeFr: 'Al-Baqi Al-Da\'im (Le Permanent, Le Consolidateur des Acquis)',
    divineAttributeEn: 'Al-Baqi Al-Da\'im (The Everlasting, Solidifier of Wealth)',
    divineAttributeHa: 'Al-Baqi (Mai Dawwama, Ba Ya Karewa)',
    abjadWeight: 303,
    lunarMansion: 'Al-Shaulah (الشولة)',
    element: 'earth',
    secretFr: `Grand Secret de la Consolidation de la Richesse & Pérennité des Entreprises. Qabratin protège le capital contre la faillite subite et consolide la stabilité.`,
    secretEn: `Grand Secret of Wealth Permanence & Business Stability. Qabratin secures acquired wealth against bankruptcy and collapse.`,
    secretHa: `Babban Sirrin Dawwamar Dukiya da Kasuwanci. Qabratin yana kiyaye kasuwanci daga rushewa ko fatarau.`,
    recipeFr: `Protocole de Pérennité :
1. Timing : Le samedi matin.
2. Calligraphie : Écrivez "Qabratin" (قَبَرَاَتٍ) 303 fois sur papier.
3. Emplacement : Placez dans le coffre-fort de l\'entreprise.`,
    recipeEn: `Longevity Protocol:
1. Timing: Saturday morning.
2. Writing: Write 303 times.
3. Application: Keep inside business vault.`,
    recipeHa: `Hanyar Tabbatar da Kasuwanci:
1. Lokaci: Asabar da safe.
2. Rubutu: Rubuta sau 303.
3. Aje: Saka a akwatin kudi.`,
    invocationAr: 'يا بَاقِي ثَبِّتْ نِعْمَتَكَ عَلَيَّ بِحَقِّ قَبَرَاَتٍ',
    invocationTranslit: 'Ya Baqee thabbit ni\'mataka alayya bi-haqqi Qabratin',
    invocationFr: 'Ô Éternel, consolide tes bienfaits sur moi et préserve mes acquêts par la vérité du nom Qabratin.',
    invocationEn: 'O Everlasting One, solidify Your blessings upon me and preserve my gains by Qabratin.',
    invocationHa: 'Ya Mai Dawwama, ka tabbatar da ni\'marka a gare ni albarkacin Qabratin.',
    talsamCode: '٣٠٣ ٩٩٩ ق ق ق 🏛️'
  },
  {
    id: 20,
    nameAr: 'غَيَاهَا',
    nameTranslit: 'Ghiya-ha',
    divineAttributeAr: 'المُغِيثُ الكَافِي',
    divineAttributeFr: 'Al-Ghiyath Al-Kafi (Le Secoureur Suprême des Dépressions)',
    divineAttributeEn: 'Al-Ghiyath Al-Kafi (The Supreme Emergency Rescuer)',
    divineAttributeHa: 'Al-Ghiyath (Mai Kawo Dauki da Wuri)',
    abjadWeight: 1016,
    lunarMansion: 'Al-Na\'a\'im (النعائم)',
    element: 'water',
    secretFr: `Grand Secret du Secours d\'Urgence Immédiat dans les Périls Majeurs. Ghiya-ha déclenche l\'intervention divine prompte lors des crises aiguës.`,
    secretEn: `Grand Secret of Swift Emergency Intervention. Ghiya-ha triggers immediate divine rescue during critical peril.`,
    secretHa: `Babban Sirrin Agaji na Gaggawa a Lokacin Hatsari. Ghiya-ha yana kawo dauki na gaggawa idan an shiga matsi.`,
    recipeFr: `Protocole d\'Urgence :
1. En cas de détresse aiguë, récitez "Ghiya-ha" (غَيَاهَا) 1016 fois avec foi absolue.`,
    recipeEn: `Emergency Rescue Protocol:
1. In severe crisis, recite "Ghiya-ha" 1016 times with total devotion.`,
    recipeHa: `Hanyar Agaji:
1. Idan aka shiga matsi, karanta "Ghiya-ha" sau 1016.`,
    invocationAr: 'يا مُغِيثُ أَغِثْنِي وَعَجِّلْ بِالفَرَجِ بِحَقِّ غَيَاهَا',
    invocationTranslit: 'Ya Mugheesu aghisnee wa ajjeel bi-al-faraji bi-haqqi Ghiya-ha',
    invocationFr: 'Ô Secoureur Suprême, secours-moi en hâtant la délivrance par la vérité de Ghiya-ha.',
    invocationEn: 'O Supreme Rescuer, come to my immediate aid and hasten deliverance by Ghiya-ha.',
    invocationHa: 'Ya Mai kawo dauki, ka kawo min agaji cikin sauri albarkacin Ghiya-ha.',
    talsamCode: '١٠١٦ ٧٧٧ غ غ غ 🚨'
  },
  {
    id: 21,
    nameAr: 'كَيْدَهوُلَا',
    nameTranslit: 'Kaydahoola',
    divineAttributeAr: 'القَادِرُ القَاهِرُ',
    divineAttributeFr: 'Al-Qahir Al-Qadir (Le Dominateur, Le Marteau des Sortilèges)',
    divineAttributeEn: 'Al-Qahir Al-Qadir (The Subduer, Destroyer of Sorcery)',
    divineAttributeHa: 'Al-Qahir (Mai Rushe Asiri da Sammu)',
    abjadWeight: 76,
    lunarMansion: 'Al-Baldah (البلدة)',
    element: 'fire',
    secretFr: `Grand Secret de l\'Anéantissement Absolu de la Magie Noire & Dissolution des Nœuds. Kaydahoola est le marteau qui brise tous les envoûtements.`,
    secretEn: `Grand Secret of Total Sorcery Annihilation & Unbinding Curses. Kaydahoola shatters all black magic locks.`,
    secretHa: `Babban Sirrin Rushe Kowane Sihiri da Kulli na Asiri. Kaydahoola yana karyata kowane irin sammu.`,
    recipeFr: `Protocole d\'Anéantissement de Magie :
1. Écrivez "Kaydahoola" (كَيْدَهوُلَا) 76 fois à l\'encre de safran.
2. Dissolvez dans l\'eau et lavez-vous durant 3 soirs.`,
    recipeEn: `Sorcery Annihilation Protocol:
1. Write "Kaydahoola" 76 times with saffron ink.
2. Dissolve in water and bathe for 3 nights.`,
    recipeHa: `Hanyar Karya Sihiri:
1. Rubuta "Kaydahoola" sau 76 da za'afaran.
2. Wanke a ruwa ka yi wanka har daren kwana 3.`,
    invocationAr: 'يا قَاهِرُ ابْطِلْ كُلَّ سِحْرٍ وَعَقْدٍ بِحَقِّ كَيْدَهوُلَا',
    invocationTranslit: 'Ya Qahiru abtil kulla sihrin wa aqdin bi-haqqi Kaydahoola',
    invocationFr: 'Ô Dominateur, brise tout sortilège et dissous tout nœud par la vérité sacrée du nom Kaydahoola.',
    invocationEn: 'O Subduer, shatter every spell and dissolve every binding by Kaydahoola.',
    invocationHa: 'Ya Mai Rushe asiri, ka karyata kowane sihiri da kulli albarkacin Kaydahoola.',
    talsamCode: '٧٦ ٣٣٣ ك ك ك ⚡'
  },
  {
    id: 22,
    nameAr: 'شَمْخَاهِرٍ',
    nameTranslit: 'Shamkhahirin',
    divineAttributeAr: 'التَّوَّابُ القَادِرُ',
    divineAttributeFr: 'Al-Khabir Al-Tawwab (Le Dévoileur des Vérités, L\'Accueillant)',
    divineAttributeEn: 'Al-Khabir Al-Tawwab (Unveiler of Hidden Truths)',
    divineAttributeHa: 'Al-Khabir (Mai Bayyana Gaskiya ta Samaniya)',
    abjadWeight: 1146,
    lunarMansion: 'Sa\'d al-Dhabih (سعد الذابح)',
    element: 'air',
    secretFr: `Grand Secret du Dévoilement des Pièges Cachés & Discernement Spirituel. Shamkhahirin protège contre la tromperie financière et les faux associés.`,
    secretEn: `Grand Secret of Unveiling Hidden Traps & Financial Discernment. Shamkhahirin guards against deceitful partners.`,
    secretHa: `Babban Sirrin Bayyana Yaudara da Samun Gaskiya. Shamkhahirin yana kiyaye mutum daga yaudarar abokan kasuwanci.`,
    recipeFr: `Protocole de Discernement :
1. Répétez "Shamkhahirin" (شَمْخَاهِرٍ) 1146 fois la nuit du jeudi au vendredi avec du benjoin.`,
    recipeEn: `Discernment Protocol:
1. Recite "Shamkhahirin" 1146 times on Thursday night with benzoin.`,
    recipeHa: `Hanyar Discernment:
1. Karanta sau 1146 daren Juma\'a da turaren Jawi.`,
    invocationAr: 'يا خَبِيرُ اكْشِفْ لِي العَوَاقِبَ بِحَقِّ شَمْخَاهِرٍ',
    invocationTranslit: 'Ya Khabeeru ikshif lee al-awaqiba bi-haqqi Shamkhahirin',
    invocationFr: 'Ô Informé, dévoile-moi les aboutissants secrets par la vérité de Shamkhahirin.',
    invocationEn: 'O All-Aware, unveil secret outcomes to me by Shamkhahirin.',
    invocationHa: 'Ya Mai labari, ka bayyana min karshen lamari albarkacin Shamkhahirin.',
    talsamCode: '١١٤٦ ٥٥٥ ش ش ش 🔍'
  },
  {
    id: 23,
    nameAr: 'شَمْخَاهِيرٍ',
    nameTranslit: 'Shamkhahirin (Grand)',
    divineAttributeAr: 'القَادِرُ المَلِكُ',
    divineAttributeFr: 'Al-Qadir Al-Malik (Le Souverain Invincible)',
    divineAttributeEn: 'Al-Qadir Al-Malik (The Invincible Sovereign)',
    divineAttributeHa: 'Al-Qadir Al-Malik (Mai Iko, Mai Mulki)',
    abjadWeight: 1156,
    lunarMansion: 'Sa\'d Bula\' (سعد بلع)',
    element: 'earth',
    secretFr: `Grand Secret du Bouclier Inviolable du Foyer. Shamkhahirin (Grand) fortifie la maison et préserve la famille.`,
    secretEn: `Grand Secret of the Inviolable Home Shield. Shamkhahirin (Grand) fortifies the residence and protects family.`,
    secretHa: `Babban Sirrin Karfe da Kariyar Gida. Shamkhahirin Mai Girma yana tsare gida da iyali.`,
    recipeFr: `Protocole de Fortification :
1. Écrivez le nom 1156 fois sur parchemin le jeudi.
2. Placez au-dessus de l\'entrée.`,
    recipeEn: `Home Shield Protocol:
1. Write 1156 times on parchment on Thursday.
2. Place above entrance.`,
    recipeHa: `Hanyar Kariyar Gida:
1. Rubuta sau 1156 a takarda ranar Alhamis.
2. Rataya a bakin kofa.`,
    invocationAr: 'يا مَلِكُ احْمِ دَارِي وَأَهْلِي بِحَقِّ شَمْخَاهِيرٍ',
    invocationTranslit: 'Ya Maliku ihmi daree wa ahlee bi-haqqi Shamkhahirin',
    invocationFr: 'Ô Souverain, protège ma demeure et ma famille par la vérité de Shamkhahirin.',
    invocationEn: 'O Sovereign, shield my home and family by Shamkhahirin.',
    invocationHa: 'Ya Mai Mulki, ka tsare gidana da iyalina albarkacin Shamkhahirin.',
    talsamCode: '١١٥٦ ٨٨٨ ش ش ش 🏰'
  },
  {
    id: 24,
    nameAr: 'بَكَهَطَطَهُونِيَةٍ',
    nameTranslit: 'Bakahtatahoniyatin',
    divineAttributeAr: 'القَدِيمُ الأَزَلِيُّ',
    divineAttributeFr: 'Al-Qadeem Al-Azali (L\'Éternel Sans Début)',
    divineAttributeEn: 'Al-Qadeem Al-Azali (The Eternal Without Beginning)',
    divineAttributeHa: 'Al-Qadeem (Na Farko wanda ba shi da Fari)',
    abjadWeight: 112,
    lunarMansion: 'Sa\'d al-Su\'ud (سعد السعود)',
    element: 'water',
    secretFr: `Grand Secret de l\'Ancrage Éternel des Bénédictions & Stabilité Spirituelle. Bakahtatahoniyatin scelle les faveurs reçues.`,
    secretEn: `Grand Secret of Permanent Blessings & Unshakeable Faith. Bakahtatahoniyatin seals divine favors.`,
    secretHa: `Babban Sirrin Dawwamar Albarka. Bakahtatahoniyatin yana tabbatar da ni\'imar da aka samu.`,
    recipeFr: `Protocole d\'Ancrage :
1. Répétez 112 fois le vendredi après le Jumu\'ah.`,
    recipeEn: `Perpetuity Protocol:
1. Recite 112 times on Friday after Jumu\'ah.`,
    recipeHa: `Hanyar Tabbatar da Ni\'ima:
1. Karanta sau 112 ranar Juma\'a bayan salla.`,
    invocationAr: 'يا قَدِيمُ أَدِمْ عَلَيَّ نِعْمَتَكَ بِحَقِّ بَكَهَطَطَهُونِيَةٍ',
    invocationTranslit: 'Ya Qadeemu adim alayya ni\'mataka bi-haqqi Bakahtatahoniyatin',
    invocationFr: 'Ô Éternel, perpétue sur moi tes bienfaits par la vérité de ce nom.',
    invocationEn: 'O Eternal One, perpetuate Your favors upon me by this name.',
    invocationHa: 'Ya Na Farko, ka dawwamar da ni\'marka gare ni albarkacin wannan suna.',
    talsamCode: '١١٢ ١١١ ب ب ب ✨'
  },
  {
    id: 25,
    nameAr: 'بَشَارَشٍ',
    nameTranslit: 'Basharashin',
    divineAttributeAr: 'القَادِرُ المُتَعَالِي',
    divineAttributeFr: 'Al-Qadir Al-Muta\'ali (Le Puissant Apaisateur des Conflits)',
    divineAttributeEn: 'Al-Qadir Al-Muta\'ali (The Mighty Pacifier of Strife)',
    divineAttributeHa: 'Al-Qadir (Mai Ikon Kwantar da Kura)',
    abjadWeight: 802,
    lunarMansion: 'Sa\'d al-Akhbiya (سعد الأخبية)',
    element: 'fire',
    secretFr: `Grand Secret de l\'Extinction des Haine Tribales & Guerres de Clans. Basharashin éteint les flammes des conflits majeurs.`,
    secretEn: `Grand Secret of Quenching Tribal Strife & Major Feuds. Basharashin quenches major community feuds.`,
    secretHa: `Babban Sirrin Kashe Fitina Babba da Kaba. Basharashin yana kashe wutar rigima tsakanin mutane.`,
    recipeFr: `Protocole d\'Extinction de Discorde :
1. Répétez "Basharashin" (بَشَارَشٍ) 802 fois au milieu de la nuit.`,
    recipeEn: `Strife Quenching Protocol:
1. Recite "Basharashin" 802 times at midnight.`,
    recipeHa: `Hanyar Kashe Fitina:
1. Karanta sau 802 tsakiyar dare.`,
    invocationAr: 'يا قَادِرُ اَطْفِئْ نَارَ الفِتْنَةِ بِحَقِّ بَشَارَشٍ',
    invocationTranslit: 'Ya Qadiru atfi\' nara al-fitnati bi-haqqi Basharashin',
    invocationFr: 'Ô Puissant, éteins le feu de la discorde par la vérité de Basharashin.',
    invocationEn: 'O Mighty One, quench the flames of strife by Basharashin.',
    invocationHa: 'Ya Mai Iko, ka kashe wutar fitina albarkacin Basharashin.',
    talsamCode: '٨٠٢ ٤٤٤ ب ب ب 🌊'
  },
  {
    id: 26,
    nameAr: 'طُونِشٍ',
    nameTranslit: 'Tuneshin',
    divineAttributeAr: 'الشَّكُورُ الرَّزَّاقُ',
    divineAttributeFr: 'Al-Shakur Al-Razzaq (Le Reconnaissant, Le Grand Pourvoyeur)',
    divineAttributeEn: 'Al-Shakur Al-Razzaq (The Appreciative, The Grand Provider)',
    divineAttributeHa: 'Al-Shakur (Mai Godiya, Mai Arziqawa)',
    abjadWeight: 369,
    lunarMansion: 'Al-Fargh al-Muqaddam (الفرغ المقدم)',
    element: 'air',
    secretFr: `Grand Secret de l\'Abondance Financière Fulgurante & Attraction des Clients. Tuneshin ouvre les vannes de la prospérité commerciale.`,
    secretEn: `Grand Secret of Rapid Financial Abundance & Drawing Clients. Tuneshin unlocks commercial wealth.`,
    secretHa: `Babban Sirrin Buɗe Arziqi da Janyo Masu Sayen Kaya. Tuneshin yana janyo kudi da nasara a shago.`,
    recipeFr: `Protocole de Prospérité Commerciale :
1. Écrivez "Tuneshin" (طُونِشٍ) 369 fois à l\'encre de safran le jeudi.
2. Suspendez dans votre magasin.`,
    recipeEn: `Commercial Success Protocol:
1. Write "Tuneshin" 369 times with saffron ink on Thursday.
2. Hang inside your store.`,
    recipeHa: `Hanyar Samun Masu Sayen Kaya:
1. Rubuta sau 369 ranar Alhamis da za'afaran.
2. Rataya a cikin shago.`,
    invocationAr: 'يا شَكُورُ ارْزُقْنِي مِنْ حَيْثُ لا أَحْتَسِبُ بِحَقِّ طُونِشٍ',
    invocationTranslit: 'Ya Shakooru urzuqnee min haythu la ahtasibu bi-haqqi Tuneshin',
    invocationFr: 'Ô Grand Pourvoyeur, accorde-moi ma subsistance d\'où je ne m\'attends pas par Tuneshin.',
    invocationEn: 'O Grand Provider, grant me abundance from unexpected sources by Tuneshin.',
    invocationHa: 'Ya Mai Arziqawa, ka arziqeni daga inda ban tsammata ba albarkacin Tuneshin.',
    talsamCode: '٣٩ ٧٧٧ ط ط ط 💰'
  },
  {
    id: 27,
    nameAr: 'شَمْخَابَارُوحٍ',
    nameTranslit: 'Shamkhabaroohin',
    divineAttributeAr: 'الرَّبُّ القَادِرُ',
    divineAttributeFr: 'Al-Rabb Al-Qadir (Le Seigneur Nourricier, Le Régénérateur)',
    divineAttributeEn: 'Al-Rabb Al-Qadir (The Nurturing Lord, Regenerator of Souls)',
    divineAttributeHa: 'Al-Rabb (Ubangiji Mai Gidandama)',
    abjadWeight: 1135,
    lunarMansion: 'Al-Fargh al-Mu\'akhar (الفرغ المؤخر)',
    element: 'water',
    secretFr: `Grand Secret de la Régénération Spirituelle Profonde & Purification de l\'Âme. Shamkhabaroohin ravive la ferveur dans l\'adoration.`,
    secretEn: `Grand Secret of Deep Spiritual Regeneration & Soul Purification. Shamkhabaroohin revives spiritual devotion.`,
    secretHa: `Babban Sirrin Sabunta Karfin Ruhani da Tsaftace Zuciya. Shamkhabaroohin yana karfafa zikiri da bauta.`,
    recipeFr: `Protocole de Régénération :
1. Répétez 1135 fois après Tahajjud en brûlant de l\'encens doux.`,
    recipeEn: `Spiritual Regeneration Protocol:
1. Recite 1135 times after Tahajjud prayer.`,
    recipeHa: `Hanyar Sabunta Zikiri:
1. Karanta sau 1135 bayan sallar Tahajjud.`,
    invocationAr: 'يا رَبُّ جَدِّدِ الرُّوحَ فِي بَدَنِي بِحَقِّ شَمْخَابَارُوحٍ',
    invocationTranslit: 'Ya Rabbu jaddid ar-rooha fee badanee bi-haqqi Shamkhabaroohin',
    invocationFr: 'Ô Seigneur, régénère le souffle spirituel et la force divine dans mon être par la vérité de ce nom.',
    invocationEn: 'O Lord, renew the spiritual breath and divine force within me by this name.',
    invocationHa: 'Ya Ubangiji, ka sabunta numfashin ruhani a jikina albarkacin wannan suna.',
    talsamCode: '١١٣٥ ٩٩٩ ش ش ش 🌟'
  },
  {
    id: 28,
    nameAr: 'بَيَعْرَشٍ',
    nameTranslit: 'Baya\'ra\'ashin',
    divineAttributeAr: 'الكَافِي الحَسِيبُ',
    divineAttributeFr: 'Al-Kafi Al-Hasib (Le Suffisant Suprême, Le Clôtureur des Rituels)',
    divineAttributeEn: 'Al-Kafi Al-Hasib (The Supreme All-Sufficient, Seal of Work)',
    divineAttributeHa: 'Al-Kafi (Mai Wadatarwa, Mai Rufewa)',
    abjadWeight: 583,
    lunarMansion: 'Risha / Batn al-Hut (الرشاء / بطن الحوت)',
    element: 'earth',
    secretFr: `Grand Secret du Scellement Sacré des Travaux (Khatm) & Auto-Suffisance Divine. Baya\'ra\'ashin est le sceau final du pacte.`,
    secretEn: `Grand Secret of Sacred Ritual Closure & Divine Self-Sufficiency. Baya\'ra\'ashin seals the grand covenant.`,
    secretHa: `Babban Sirrin Rufe Zikiri da Samun Wadatar Zuciya. Baya\'ra\'ashin shi ne rufewar yarjejeniya.`,
    recipeFr: `Protocole de Clôture & Scellement :
1. Répétez "Baya\'ra\'ashin" (بَيَعْرَشٍ) 583 fois à la fin de toute retraite ou grand zikr.`,
    recipeEn: `Sealing Protocol:
1. Recite "Baya\'ra\'ashin" 583 times at the conclusion of spiritual retreats.`,
    recipeHa: `Hanyar Rufe Zikiri:
1. Karanta sau 583 a karshen babban zikiri.`,
    invocationAr: 'يا كَافِي اكْفِنِي كُلَّ المَهَامِّ بِحَقِّ بَيَعْرَشٍ',
    invocationTranslit: 'Ya Kafee ikfinee kulla al-mahammi bi-haqqi Baya\'ra\'ashin',
    invocationFr: 'Ô Suffisant, suffi-moi dans toutes mes tâches et scelle ma protection par la vérité de Baya\'ra\'ashin.',
    invocationEn: 'O All-Sufficient One, suffice me in all my affairs and seal my shield by Baya\'ra\'ashin.',
    invocationHa: 'Ya Mai Wadatarwa, ka wadatar ni a duk ayyukana albarkacin Baya\'ra\'ashin.',
    talsamCode: '٥٨٣ ٣٣٣ ب ب ب 🏁'
  }
];

let fullOutput = fileHeader + JSON.stringify(namesData, null, 2) + ';\n\n' + tailSection;

fs.writeFileSync('/src/data/barhatiahSecrets.ts', fullOutput);
console.log("Successfully wrote updated barhatiahSecrets.ts file! Total characters:", fullOutput.length);
