export interface BookChapterSection {
  subtitleAr?: string;
  subtitleFr?: string;
  subtitleEn?: string;
  subtitleHa?: string;
  contentFr: string;
  contentEn?: string;
  contentHa?: string;
  arabicText?: string;
  transliteration?: string;
  abjadWeight?: number;
  lunarMansion?: string;
  keyTakeawayFr?: string;
  keyTakeawayEn?: string;
  keyTakeawayHa?: string;
}

export interface BookChapter {
  id: string;
  chapterNumber: number;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  titleHa: string;
  summaryFr: string;
  summaryEn?: string;
  summaryHa?: string;
  sections: BookChapterSection[];
}

export const BARHATIAH_CHAPTERS: BookChapter[] = [
  // CHAPITRE 1
  {
    id: 'barhatiah_ch1',
    chapterNumber: 1,
    titleAr: 'الفصل الأول: النشأة التاريخية والأصول الثيورجية للعهد',
    titleFr: 'Chapitre 1 : Introduction historique et origines théurgiques du Grand Serment de la Barhatiah',
    titleEn: 'Chapter 1: Historical Introduction & Theurgic Origins of the Grand Barhatiah Covenant',
    titleHa: 'Babi na 1: Tarihin Farko da Asalin Rantsuwar Asiri ta Barhatiah',
    summaryFr: 'Présente les origines salomoniennes du Serment, la langue primordiale (syriaque et hébreu ancien), le concept de l\'Alliance Sacrée (Al-Ahd), et la fiche technique du Sceau de l\'Alliance d\'Ouverture (Khatim al-Ahd).',
    summaryEn: 'Presents the Solomonic origins of the Covenant, the primordial language (Syriac & Ancient Hebrew), the concept of the Sacred Alliance (Al-Ahd), and the technical blueprint of the Opening Seal (Khatim al-Ahd).',
    summaryHa: 'Yana bayyana asalin rantsuwar daga Annabi Sulaiman, harshen farko na Syriac, manufar yarjejeniya mai tsarki (Al-Ahd), da kuma bayanin zana Khatim din Bude Yarjejeniya.',
    sections: [
      {
        subtitleAr: 'الأصول الأسطورية والسليمانية للعهد',
        subtitleFr: '1. Les Origines Légendaires et Salomoniennes du Serment',
        subtitleEn: '1. The Legendary & Solomonic Origins of the Covenant',
        subtitleHa: '1. Tarihin Farko da Asalin Rantsuwar Annabi Sulaiman',
        contentFr: 'Le Serment de la Barhatiah, également connu sous le nom de "Serment Ancien" (Al-Ahd al-Qadim), trouve sa source historique et spirituelle dans la tradition ésotérique du roi Salomon (Sulayman). Selon les écrits d\'Ahmad al-Buni, ce serment représente le pacte originel scellé entre le trône salomonien et les forces subtiles qui régissent les mondes invisibles (les djinns, les esprits élémentaires et les gardiens planétaires).\n\nAl-Buni explique que Salomon ne gouvernait pas ces forces par la contrainte brute, mais par l\'invocation de lois métaphysiques universelles codées dans ce serment. Les entités spirituelles ne se soumettent pas à l\'homme physique, mais aux Noms Sacrés primordiaux que l\'opérateur prononce. Ces noms agissent comme des décrets cosmiques irrévocables, forçant le respect et l\'obéissance des esprits les plus rebelles en vertu de l\'alliance originelle.',
        contentEn: 'The Barhatiah Covenant, also known as the "Ancient Covenant" (Al-Ahd al-Qadim), traces its historical and spiritual lineage to the esoteric traditions of King Solomon (Sulayman). According to the writings of Ahmad al-Buni, this covenant represents the primordial pact sealed between the Solomonic throne and the subtle forces governing the unseen worlds (jinn, elemental spirits, and planetary guardians).\n\nAl-Buni clarifies that Solomon governed these forces not through brute force, but by invoking universal metaphysical laws encoded within this oath. Spiritual entities do not submit to the physical human being, but to the primordial Sacred Names pronounced by the operator. These names function as irrevocable cosmic decrees, commanding respect and compliance from even the most rebellious spirits by virtue of the original pact.',
        contentHa: 'Rantsuwar Barhatiah, wadda aka fi sani da "Tsohuwar Rantsuwa" (Al-Ahad al-Qadim), tana samun asalinta ne daga ilimin asiri na Annabi Sulaiman. Kamar yadda Ahmad al-Buni ya bayyana, wannan rantsuwa tana wakiltar alƙawarin farko da aka ƙulla tsakanin mulkin Annabi Sulaiman da rundunonin halittun asiri da ke mulkin duniyar da ba a gani (aljannu, ruhanai, da masu tsaron taurari).\n\nAl-Buni ya bayyana cewa Annabi Sulaiman bai mulki wadannan halittu da karfin tsiya ba, a\'a ta hanyar amfani da dokokin asiri da ke kunshe a cikin wannan rantsuwa. Halittun ruhani ba sa mika wuya ga mutum saboda jikinsa, a\'a ga Sunaye Masu Tsarki da yake ambata. Wadannan sunaye suna aiki ne kamar umarni na samaniya wanda babu aljanin da ya isa ya tawaye shi.',
        arabicText: 'بِسْمِ اللَّهِ الْمَلِكِ الْقُدُّوسِ الَّذِي أَخَذَ الْعَهْدَ عَلَى سَائِرِ الْأَرْوَاحِ وَالْمُلُوكِ الْعُلْوِيَّةِ وَالسُّفْلِيَّةِ',
        transliteration: 'Bismillahi al-Maliki al-Quddus alladhi akhadha al-ahda ala sa\'ir al-arwahi wal-muluk al-alwiyyah wal-sufliyyah',
        abjadWeight: 18019,
        lunarMansion: 'Al-Sharatan (الشرطان)',
        keyTakeawayFr: 'Salomon gouvernait par les lois métaphysiques universelles codées dans le serment, et non par contrainte physique.',
        keyTakeawayEn: 'King Solomon governed through universal metaphysical laws encoded in the oath rather than physical force.',
        keyTakeawayHa: 'Annabi Sulaiman ya mulki aljannu ne da ikonsa Allah da ke kunshe a cikin rantsuwa.'
      },
      {
        subtitleAr: 'اللغة الأزلية السريانية والعبرانية القديمة',
        subtitleFr: '2. La Langue Primordiale (Le Syriaque et l\'Hébreu Ancien)',
        subtitleEn: '2. The Primordial Language (Ancient Syriac & Hebrew)',
        subtitleHa: '2. Harshen Asali na Dā (Syriac da Tsohon Larabci/Ibraniyanci)',
        contentFr: 'Les 28 noms de la Barhatiah ne sont pas d\'origine arabe. Al-Buni précise qu\'ils appartiennent à la langue primordiale de la théurgie orientale, qualifiée selon les manuscrits de syriaque ancien, de chaldéen ou d\'hébreu biblique. Dans la mystique soufie, cette langue est considérée comme la "langue des anges" ou la langue originelle de l\'humanité avant la dispersion de Babel.\n\nChacun de ces noms possède une vibration phonétique spécifique qui résonne directement avec les structures géométriques de la création. Pour Al-Buni, la traduction de ces noms en arabe n\'est pas une simple curiosité linguistique, mais une nécessité pour le praticien afin de lier la force opérationnelle du serment ancien à la théologie orthodoxe des attributs divins (Asma al-Husna). Le premier chapitre insiste sur le fait que la mauvaise prononciation de ces mots annule la résonance du rituel, car la géométrie du son émis doit être d\'une précision absolue pour ouvrir le canal spirituel souhaité.',
        contentEn: 'The 28 names of the Barhatiah are not of Arabic origin. Al-Buni specifies that they belong to the primordial language of Oriental theurgy, identified in ancient manuscripts as ancient Syriac, Chaldean, or biblical Hebrew. In Sufi mysticism, this tongue is revered as the "language of angels" or the original language of humanity prior to the dispersion at Babel.\n\nEach name possesses a unique phonetic frequency that vibrates in harmony with the geometric structures of creation. For Al-Buni, translating these names into classical Arabic is essential to anchor the operational power of the ancient covenant to orthodox divine theology (Asma al-Husna). A imprecise pronunciation disrupts the ritual resonance, as the sound geometry must be mathematically precise to open the intended spiritual channel.',
        contentHa: 'Sunaye 28 na Barhatiah ba harshen Larabci na yanzu bane. Al-Buni ya bayyana cewa sun fito ne daga tsohon harshen Syriac, Chaldean ko Ibraniyanci na dā. A wurin Sufaye, wannan harshe ana daukarsa a matsayin "harshen Mala\'iku" ko harshen farko na Dan Adam kafin rabewar harsuna.\n\nKowane suna yana da wata amsa kuwwa ta musamman da take aiki da tsarin halittar samaniya. Fassara wadannan sunaye zuwa Larabci tana taimakawa mai karatu gane cewa sunayen Allah ne (Asma\'ul Husna). Furta su daidai yana da muhimmanci domin bude kofofin nasara.',
        arabicText: 'بَرْهَتِيهٍ كَرَرٍ تَتْلِيهٍ طَوْرَانٍ مَزْجَلٍ بَزْجَلٍ تَرَقَّبٍ',
        transliteration: 'Barhatihin, Kararin, Tatlihin, Tawran, Mazjalin, Bazjalin, Tarqabin',
        abjadWeight: 662,
        lunarMansion: 'Al-Butayn (البطين)',
        keyTakeawayFr: 'La géométrie sonore exacte des mots syriaques résonne avec la structure géométrique de la création.',
        keyTakeawayEn: 'The precise sound geometry of Syriac terms resonates with the fundamental structure of creation.',
        keyTakeawayHa: 'Amsa kuwwar muryar harshen Syriac tana buɗe kofofin samaniya da sauri.'
      },
      {
        subtitleAr: 'مفهوم الميثاق والعهد المقدس',
        subtitleFr: '3. Le Concept de l\'Alliance Sacrée (Al-Ahd)',
        subtitleEn: '3. The Concept of the Sacred Covenant (Al-Ahd)',
        subtitleHa: '3. Manufar Yarjejeniya Mai Tsarki (Al-Ahd)',
        contentFr: 'Le pilier central de la Barhatiah repose sur la notion d\'Ahd, c\'est-à-dire le traité ou le pacte spirituel. Al-Buni enseigne que l\'univers est régi par des lois de sympathie et de correspondance. Lorsqu\'un être humain se purifie par le jeûne et la méditation, et qu\'il prononce les clauses de l\'alliance de la Barhatiah, il réactive ce pacte de Salomon.\n\nLes esprits qui ententend ces noms reconnaissent immédiatement l\'autorité du décret. S\'ils enfreignaient ce serment, ils s\'exposeraient, selon la cosmologie du livre, à une dissolution instantanée de leur propre énergie vitale par les forces angéliques supérieures qui veillent à l\'exécution de l\'alliance. C\'est pourquoi le premier chapitre présente la Barhatiah non pas comme un outil de contrainte violente, mais comme la réactivation d\'un traité de paix et de coopération entre le plan humain et le plan invisible.',
        contentEn: 'The central pillar of the Barhatiah rests upon the concept of Ahd (the sacred spiritual pact). Al-Buni teaches that the universe operates under divine laws of sympathy and cosmic correspondence. When a practitioner purifies themselves through fasting and meditation and recites the clauses of the Barhatiah covenant, they reactivate the ancient Solomonic pact.\n\nSubtle entities hearing these names instantly acknowledge the authority of the decree. Violating this oath would subject them to instant energetic dissolution by higher angelic overseers guarding the covenant. Thus, the Barhatiah is presented not as violent coercion, but as the reactivation of a treaty of peace and cosmic cooperation.',
        contentHa: 'Babban ginshikin Barhatiah yana kan amfani da Ahd, wato yarjejeniya ko alkawari mai tsarki. Al-Buni ya koyar da cewa duniyar asiri tana karkashin dokokin Allah ne. Idan mutum ya tsaftace jikinsa da azumi da zikiri ya karanta rantsuwar Barhatiah, yana raya yarjejeniyar Annabi Sulaiman ne.\n\nAljannu da ruhanai da suka ji wadannan sunaye suna mika wuya nan take. Wannan rantsuwa ba ta azabtarwa bace kadai, a\'a wata yarjejeniya ce ta aminci da zaman lafiya tsakanin Mutum da Ruhanai.',
        arabicText: 'وَأَوْفُوا بِعَهْدِ اللَّهِ إِذَا عَاهَدْتُمْ وَلَا تَنْقُضُوا الْأَيْمَانَ بَعْدَ تَوْكِيدِهَا',
        transliteration: 'Wa awfoo bi-ahdillahi idha aahadtum wa la tanqudoo al-aymana ba\'da tawkeediha',
        abjadWeight: 845,
        lunarMansion: 'Al-Thurayya (الثريا)',
        keyTakeawayFr: 'La Barhatiah est la réactivation d\'un traité de paix et de coopération légitime entre les mondes.',
        keyTakeawayEn: 'The Barhatiah reactivates a legitimate treaty of peace and cooperation between realms.',
        keyTakeawayHa: 'Rantsuwar tana sake raya yarjejeniyar aminci ce tsakanin Dan Adam da halittun samaniya.'
      },
      {
        subtitleAr: 'خاتم العهد والافتتاح الشريف',
        subtitleFr: '4. Le Sceau de l\'Alliance d\'Ouverture (Khatim al-Ahd)',
        subtitleEn: '4. The Seal of Opening Covenant (Khatim al-Ahd)',
        subtitleHa: '4. Khatim din Bude Yarjejeniya (Khatam al-Ahd)',
        contentFr: 'Pour valider l\'autorité de l\'opérateur avant d\'entamer la récitation des 28 noms de la Barhatiah, Al-Buni décrit la nécessité de tracer le "Sceau de l\'Alliance d\'Ouverture" (Khatim al-Ahd). Ce sceau sert de sauf-conduit spirituel et de protection pour le praticien durant tout le rituel.\n\nFiche technique et protocole de création du Sceau :\n• Forme géométrique : Un cercle parfait tracé à l\'encre d\'eau de rose et de safran, entourant une étoile à sept branches (septile).\n• Inscription des sommets : À chacune des sept pointes de l\'étoile est inscrit l\'un des sept premiers noms de la Barhatiah : Barhatiah (برهتية), Karirin (كرير), Tatlihin (تتليه), Turanin (طوران), Mazjalin (مزجل), Bazjalin (بزجل), et Taranin (تران).\n• Centre du Sceau : Au centre exact de l\'étoile est calligraphiée la formule d\'alliance : "Par l\'autorité du serment de Salomon" (بِسُلْطَانِ عَهْدِ سُلَيْمَان).\n• Encre requise : Safran jaune pur dilué dans de l\'eau de source bénie, parfumé d\'une goutte de musc blanc.\n• Support physique : Papier parcheminé blanc ou peau de gazelle vierge.\n• Heure de création : À l\'aube d\'un jeudi, durant la première heure de Jupiter, sous une Lune croissante.\n• Téléchargement : Disponible ci-dessous au format PNG haute définition (300 DPI) et parchemin d\'artisanat antique.',
        contentEn: 'To validate the practitioner\'s authority prior to reciting the 28 names of the Barhatiah, Al-Buni prescribes drafting the "Seal of Opening Covenant" (Khatim al-Ahd). This seal acts as a spiritual passport and protective shield during recitations.\n\nTechnical Blueprint & Seal Creation Protocol:\n• Geometric Form: A perfect circle inscribed with saffron and rosewater ink, surrounding a seven-pointed star (heptagram).\n• Vertex Inscriptions: At each of the seven star points, one of the first seven Barhatiah names is written: Barhatihin (برهتية), Karirin (كرير), Tatlihin (تتليه), Tawran (طوران), Mazjalin (مزجل), Bazjalin (بزجل), and Tarqabin (ترقب).\n• Center Inscription: In the exact center of the star, the covenant decree is calligraphed: "By the Authority of Solomon\'s Oath" (بِسُلْطَانِ عَهْدِ سُلَيْمَان).\n• Required Ink: Pure yellow saffron dissolved in blessed spring water, fragranced with a drop of white musk.\n• Physical Medium: White parchment paper or virgin parchment skin.\n• Creation Time: At dawn on a Thursday, during the 1st hour of Jupiter under a waxing moon.\n• Downloads: Available below as high-definition PNG (300 DPI) and antique parchment texture.',
        contentHa: 'Domin inganta ikonsa kafin fara karanta sunaye 28 na Barhatiah, Al-Buni ya umarci zana "Khatim din Bude Yarjejeniya" (Khatam al-Ahd). Wannan Khatim tana aiki ne kamar Takardar Shaidar Karatu da Rigar Karfe ta Kariya.\n\nBayanin Zana Khatim da Ka\'idodinta:\n• Siffa: Zakamin da\'ira tare da Tauraro mai tsinaye 7 a ciki.\n• Rubutun Tsintsa: A kowane tsinin tauraro ana rubuta daya daga cikin sunayen Barhatiah 7 na farko: Barhatiah (برهتية), Karirin (كرير), Tatlihin (تتليه), Turanin (طوران), Mazjalin (مزجل), Bazjalin (بزجل), Tarqabin (ترقب).\n• Tsakiyar Khatim: Ana rubuta: "Bi-sultani Ahdi Sulayman" (بِسُلْطَانِ عَهْدِ سُلَيْمَان).\n• Tawada: Ruwan Za\'afaran da ruwan Rosewater da diga na musk fari.\n• Takarda: Parchemin ko takarda fara mai tsarki.\n• Lokaci: Ranar Alhamis da asuba lokacin Tauraron Mushtari (Jupiter) da Fari Wata.\n• Saukewa: Ana iya sauke Khatim a matsayin Hoto (PNG 300 DPI) ko Parchemin a cikin laburaren.',
        arabicText: 'بِسُلْطَانِ عَهْدِ سُلَيْمَانَ عَلَيْهِ السَّلَامُ',
        transliteration: 'Bi-sultani ahdi Sulaymana alayhis-salam',
        abjadWeight: 266,
        lunarMansion: 'Al-Dabaran (الدبران)',
        keyTakeawayFr: 'Le Sceau de l\'Alliance sert de sauf-conduit spirituel et de protection absolue pour l\'opérateur.',
        keyTakeawayEn: 'The Covenant Seal serves as a spiritual passport and absolute protection shield for the practitioner.',
        keyTakeawayHa: 'Khatam al-Ahd tana ba mai karatu kariya da karfin gudanar da aikin asiri cikin nasara.'
      }
    ]
  },

  // CHAPITRE 2
  {
    id: 'barhatiah_ch2',
    chapterNumber: 2,
    titleAr: 'الفصل الثاني: الصوتيات وقواعد ضبط الأسماء الثمانية والعشرين',
    titleFr: 'Chapitre 2 : La phonétique et les règles de vocalisation des 28 noms secrets',
    titleEn: 'Chapter 2: Phonetics & Vocalization Rules of the 28 Secret Names',
    titleHa: 'Babi na 2: Karatun Furucci da Siffofin Furta Sunaye 28',
    summaryFr: 'Détaille la science de la vibration acoustique éso-phonétique (Al-Sada), les règles de vocalisation (Tashdid et Tanwin al-Kasr), l\'alignement du souffle et des points d\'articulation (Makharij al-Huruf), et la fiche technique du Sceau de la Juste Vibration (Khatim al-Nutq).',
    summaryEn: 'Details the science of esoteric acoustic vibration (Al-Sada), vocalization rules (Tashdid & Tanwin al-Kasr), breath alignment and points of articulation (Makharij), and the technical blueprint for the Seal of Right Utterance (Khatim al-Nutq).',
    summaryHa: 'Yana filla-filla bayanin ilimin amo na amsa kuwwa (Al-Sada), ka\'idojin furucci (Tashdid da Tanwin), daidaita numfashi da fitar sauti (Makharij), da kuma bayanin zana Khatim din Fitar Sauti Cikin Nasara (Khatam al-Nutq).',
    sections: [
      {
        subtitleAr: 'علم التردد الصوتي والصداء الإسو-فوناتيكي',
        subtitleFr: '1. La Science de la Vibration Acoustique Éso-Phonétique (Al-Sada)',
        subtitleEn: '1. The Science of Eso-Phonetic Acoustic Vibration (Al-Sada)',
        subtitleHa: '1. Ilimin Amo da Amsa Kuwwa ta Muryar Asiri (Al-Sada)',
        contentFr: 'Dans ce deuxième chapitre, Ahmad al-Buni introduit la science subtile de la vibration vocale. Pour l\'auteur, les 28 noms de la Barhatiah ne doivent pas être traités comme des mots ordinaires. La théurgie d\'Al-Buni repose sur l\'idée que le son émis par les cordes vocales humaines crée des ondes physiques réelles qui agissent comme des conducteurs d\'énergie vers le plan subtil.\n\nSi l\'opérateur modifie ne serait-ce qu\'une voyelle ou l\'accentuation d\'une lettre (par exemple, prononcer un son "a" au lieu d\'un "i"), la fréquence vibratoire change instantanément. L\'entité gardienne ou l\'ange affecté à ce nom ne reconnaîtra pas l\'appel, rendant l\'invocation stérile. Al-Buni compare cela à une clé dont on modifierait la forme des crans : la serrure cosmique refuse de s\'ouvrir. La phonétique est donc présentée comme la géométrie rigoureuse du souffle humain.',
        contentEn: 'In this second chapter, Ahmad al-Buni introduces the subtle science of vocal vibration. For the author, the 28 names of the Barhatiah must not be treated as ordinary words. Al-Buni\'s theurgy is grounded in the principle that physical sound emitted by human vocal cords generates physical acoustic waves that act as energetic conductors toward the subtle realm.\n\nIf the operator alters even a single short vowel or accent mark (for example, pronouncing an "a" sound instead of an "i"), the vibrational frequency shifts immediately. The guardian entity or angel assigned to that name will fail to recognize the call, rendering the invocation sterile. Al-Buni compares this to altering the notches on a key: the cosmic lock refuses to turn. Phonetics is thus presented as the rigorous geometry of human breath.',
        contentHa: 'A cikin wannan babi na biyu, Ahmad al-Buni ya gabatar da zurfin ilimin amsa kuwwa ta sautin murya. A wurin marubucin, sunaye 28 na Barhatiah ba kalmomi bane na yau da kullum. Ilimin asiri na Al-Buni yana kan cewa sautin da ke fitowa daga bakin Dan Adam yana samar da igiyoyin amsa kuwwa na gaskiya wadanda suke gudanar da karfin asiri zuwa samaniya.\n\nIdan mai karatu ya canza fatha ko kasra koda guda daya ce (kamar furta "a" a maimakon "i"), amsa kuwwar sautin tana sauyawa nan take. Mala\'ika ko ruhanin da aka wakilta a sunan ba zai gane kiran ba, wanda hakan zai sanya karatun ya zama mara amfani. Al-Buni ya kwatanta wannan da sakata ta kwadayi da aka sauya mata hakora: kulle na samaniya ba zai taba budewa ba. Don haka, furucci shine ainihin ma\'aunin numfashin Dan Adam.',
        arabicText: 'إنَّ الصَّوْتَ الإِنْسَانِيَّ إِذَا خَرَجَ بِمِقْدَارٍ مَضْبُوطٍ حَرَّكَ الأَرْوَاحَ العُلْوِيَّةَ',
        transliteration: 'Inna al-sawta al-insaniyya idha kharaja bi-miqdarin madbootin harraka al-arwaha al-alwiyyah',
        abjadWeight: 662,
        lunarMansion: 'Al-Botein (البطين)',
        keyTakeawayFr: 'La phonétique est la géométrie rigoureuse du souffle humain ; changer une seule voyelle annule la résonance du rituel.',
        keyTakeawayEn: 'Phonetics is the precise geometry of human breath; altering a single vowel disrupts ritual resonance.',
        keyTakeawayHa: 'Furucci mai kyau shine ma\'aunin numfashi; sauya haraha guda daya yana soke tasirin zikiri.'
      },
      {
        subtitleAr: 'قواعد الضبط والتثبيت: التشديد والتنوين',
        subtitleFr: '2. Les Règles de Vocalisation et de Stabilisation (Le Tanwin et la Tashdid)',
        subtitleEn: '2. Rules of Vocalization & Stabilization (Tashdid & Tanwin)',
        subtitleHa: '2. Ka\'idojin Kara Sauti da Tabbatar da Shi (Tashdid da Tanwin)',
        contentFr: 'L\'une des grandes clés phonétiques expliquées par Al-Buni dans ce chapitre concerne l\'utilisation du doublement des consonnes (Tashdid) et de la nunation finale (Tanwin).\n\n• Le rôle de la Tashdid (doubler la lettre) : Elle sert à accumuler l\'énergie phonétique. Par exemple, dans le nom "Karirin" (كرير), le double "r" doit être prononcé avec insistance pour créer une résonance continue.\n• Le rôle du Tanwin al-Kasr (le son "in" à la fin de chaque nom, comme dans "Barhatihin" / برهتيةٍ) : Al-Buni révèle que ce son "in" final agit comme une "prise de terre" théurgique. Il stabilise la force spirituelle du nom dans la matière physique du lieu où s\'effectue le rituel. C\'est pourquoi la plupart des manuscrits opérationnels de la Barhatiah écrivent les noms avec cette terminaison spécifique, garantissant que l\'énergie invoquée s\'ancre réellement au sol et ne se dissipe pas dans l\'air.',
        contentEn: 'One of the major phonetic keys explained by Al-Buni in this chapter concerns consonant gemination (Tashdid) and final nunation (Tanwin).\n\n• Role of Tashdid (Doubling the letter): It serves to accumulate acoustic energy. For example, in the name "Karirin" (كرير), the doubled "r" must be articulated with steady emphasis to maintain continuous vibration.\n• Role of Tanwin al-Kasr (The "in" sound ending each name, as in "Barhatihin"): Al-Buni reveals that this final "in" sound acts as a spiritual grounding wire. It anchors the divine force into the physical space of the ritual chamber. This is why standard operational manuscripts write the names with this explicit ending, ensuring the invoked light grounds firmly rather than dissipating into thin air.',
        contentHa: 'Daya daga cikin muhimman mabudan karatun da Al-Buni ya bayyana a wannan babi shine amfani da ninki haraha (Tashdid) da kuma tanwin na karshe (Tanwin al-Kasr).\n\n• Amfanin Tashdid (Ninka haraha): Tana tara karfin amsa kuwwa. Kamar a cikin sunan "Karirin" (كرير), r biyu tana bukatar jaddada muryar domin rike sautin.\n• Amfanin Tanwin al-Kasr (sautin "in" a karshen suna, kamar "Barhatihin"): Al-Buni ya bayyana cewa sautin "in" a karshe yana aiki ne kamar "daure tushe" a kasar dakin zikiri. Yana kwantar da karfin ruhani a matsayin gaskiya a fili, domin kada hasken zikiri ya tashi a iska ba tare da kafuwa ba.',
        arabicText: 'التَّشْدِيدُ لِتَجْمِيعِ الطَّاقَةِ وَالتَّنْوِينُ لِتَثْبِيتِ السِّرِّ فِي الأَرْضِ',
        transliteration: 'At-tashdeedu li-tajmee\'i at-taqati wat-tanweenu li-tasbeeti as-sirri fee al-ard',
        abjadWeight: 430,
        lunarMansion: 'Al-Thurayya (الثريا)',
        keyTakeawayFr: 'Le Tanwin "in" final agit comme un ancrage théurgique qui stabilise la force spirituelle dans la matière.',
        keyTakeawayEn: 'The final "in" Tanwin acts as a spiritual grounding mechanism anchoring subtle force into physical matter.',
        keyTakeawayHa: 'Sautin Tanwin "in" a karshen suna shine mai rike amfani da hasken zikiri a kasar daki.'
      },
      {
        subtitleAr: 'محارج الحروف وضبط التنفس الروحي',
        subtitleFr: '3. L\'alignement du Souffle et des Points d\'Articulation (Makharij al-Huruf)',
        subtitleEn: '3. Breath Alignment & Points of Articulation (Makharij al-Huruf)',
        subtitleHa: '3. Daidaita Numfashi da Fitar Sauti daga Makogwaro (Makharij)',
        contentFr: 'L\'opérateur doit s\'entraîner à prononcer les noms depuis les points d\'articulation corrects de la gorge et de la bouche (Makharij). Les consonnes gutturales lourdes (comme le Ha - ح, ou le \'Ayn - ع) doivent être émises profondément depuis la gorge pour transporter la force de l\'élément Eau ou Terre qui leur est associé.\n\nAl-Buni conseille au praticien de calmer sa respiration et d\'inspirer profondément avant de prononcer chaque mot, de sorte que l\'expiration porte le nom de manière continuous, sans tremblement ni hésitation de la voix. La récitation doit être ferme, posée et dénuée de précipitation. Un ton monocorde et solennel est recommandé pour stabiliser l\'atmosphère vibratoire de la pièce de rituel.',
        contentEn: 'The operator must train to articulate each name from its correct vocal emission point in the throat and oral cavity (Makharij). Deep guttural consonants (such as Ha - ح, or \'Ayn - ع) must resonate from deep within the throat to channel the element force (Water or Earth) assigned to them.\n\nAl-Buni advises practitioners to steady their breath and inhale deeply prior to uttering each word, allowing the exhalation to carry the name smoothly without vocal tremor or hesitation. Recitation should be firm, rhythmic, and unhurried. A solemn, steady tone is recommended to stabilize the room\'s vibrational atmosphere.',
        contentHa: 'Mai zikiri yana bukatar kwarewa wajen fitar da haruffa daga mazaunansu na kwarai a makogwaro da baki (Makharij). Haruffan nauyi na makogwaro (kamar Ha - ح, ko \'Ayn - ع) suna bukatar fitowa daga zurfin wuya domin fitar da karfin Ruwa ko Kasa da ke tattare da su.\n\nAl-Buni ya ba da shawara cewa mai zikiri ya natsu ya dauki numfashi mai zurfi kafin furta kowace kalma, domin numfashin ya fito da kalmar a hamzari ba tare da rawar murya ko hanzari ba. Karatun ya kasance mai karfi, a tsanake, kuma cike da kwarjini domin daidaita yanayin dakin zikiri.',
        arabicText: 'خُرُوجُ الحُرُوفِ مِنْ مَخَارِجِهَا الصَّحِيحَةِ يَسْتَجْلِبُ الإِجَابَةَ وَيَمْنَعُ الشَّتَاتَ',
        transliteration: 'Khurooju al-huroofi min makharijiha as-saheehati yastajlibu al-ijabata wa yamna\'u ash-shatat',
        abjadWeight: 845,
        lunarMansion: 'Al-Dabaran (الدبران)',
        keyTakeawayFr: 'Un souffle calme et une émission gutturale précise stabilisent la résonance et empêchent la dissipation de l\'énergie.',
        keyTakeawayEn: 'A calm breath and accurate guttural resonance stabilize the spiritual frequency, preventing energetic dissipation.',
        keyTakeawayHa: 'Natsuwa wajen numfashi da fito da sauti daidai daga makogwaro yana hana tarwatsewar karfin zikiri.'
      },
      {
        subtitleAr: 'خاتم النطق الفصيح والتثبيت الصوتي',
        subtitleFr: '4. Le Sceau de la Juste Vibration (Khatim al-Nutq)',
        subtitleEn: '4. The Seal of Right Utterance (Khatim al-Nutq)',
        subtitleHa: '4. Khatim din Fitar Sauti da Tsabtar Murya (Khatam al-Nutq)',
        contentFr: 'Pour préserver l\'opérateur contre les erreurs de prononciation involontaires ou les fourchements de langue (Zallat al-Lisan) durant les longues heures de récitation, Al-Buni décrit le tracé du "Sceau de la Juste Vibration" (Khatim al-Nutq). Ce sceau aide à maintenir la clarté de la voix et la force du souffle.\n\nFiche technique pour le téléchargement ou la création du Sceau (Khatim Blueprint) :\n• Forme géométrique : Un hexagone régulier entouré de deux cercles fins concentriques.\n• Inscription des côtés : Sur chacun des six côtés extérieurs de l\'hexagone sont écrites les lettres de l\'élément Air qui gouvernent la parole (Jim, Kaf, Sin, Qaf, Tha, Za).\n• Centre du Sceau : Au centre de l\'hexagone est calligraphié le verset coranique de l\'éloquence : "Seigneur, ouvre ma poitrine et facilite ma tâche, et dénoue le nœud de ma langue pour qu\'ils comprennent ma parole" (sourate Ta-Ha, v. 25-28).\n• Encre requise : Encre de safran pur distillée dans de l\'eau de rose, avec une pointe de miel d\'abeille naturel pour symboliser la douceur et la clarté de la voix.\n• Support physique : Papier de lin blanc très fin ou plaque de cuivre jaune polie.\n• Heure de création : Un mercredi matin, durant la première heure de Mercure (planète de la communication et de l\'intellect), sous une Lune croissante.\n• Téléchargement : Fichier disponible au format PNG transparent (300 DPI) et texture de parchemin antique de soie blanche.',
        contentEn: 'To safeguard the practitioner against unintentional pronunciation slips or tongue lapses (Zallat al-Lisan) during prolonged recitation hours, Al-Buni describes drafting the "Seal of Right Utterance" (Khatim al-Nutq). This seal preserves vocal clarity and breath stamina.\n\nTechnical Blueprint for Seal Creation & Download:\n• Geometric Form: A regular hexagon enclosed within two thin concentric circles.\n• Edge Inscriptions: Along the six outer sides of the hexagon, the Air element letters governing speech are written (Jim, Kaf, Sin, Qaf, Tha, Za).\n• Center Inscription: At the center of the hexagon, the Quranic verse of divine eloquence is calligraphed: "My Lord, expand for me my breast and ease for me my task and untie the knot from my tongue that they may understand my speech" (Surah Ta-Ha, v. 25-28).\n• Required Ink: Pure saffron ink distilled in rosewater, infused with a drop of natural honey symbolizing vocal sweetness and clarity.\n• Physical Medium: Very fine white linen paper or a polished yellow copper plate.\n• Creation Time: Wednesday morning during the 1st hour of Mercury (planet of communication and intellect) under a waxing moon.\n• Download Format: Available in high-definition transparent PNG (300 DPI) and antique white silk parchment texture.',
        contentHa: 'Domin kiyaye mai zikiri daga kuskuren harshe ko rawar murya a lokacin karatun zikiri na awanni masu tsawon gaske, Al-Buni ya bayyana hanyar zana "Khatim din Fitar Sauti Cikin Nasara" (Khatam al-Nutq). Wannan Khatim tana kiyaye tsaftar murya da karfin numfashi.\n\nBayanin Zana Khatim da Ka\'idodinta:\n• Siffa: Tauraro mai bangarori 6 (Hexagon) a ciki da da\'irori biyu na waje.\n• Rubutun Bangarori: A bangarori 6 ana rubuta haruffan Iska masu mulkin harshe (Jim, Kaf, Sin, Qaf, Tha, Za).\n• Tsakiyar Khatim: Ana rubuta aya mai tsarki ta Annabi Musa: "Rabbish-rah lee sadree wa yassir lee amree wahlul uqdatan min lisanee yafqahoo qawlee" (Surat Ta-Ha, v. 25-28).\n• Tawada: Ruwan Za\'afaran da ruwan rosewater tare da diga na zuma domin zaƙin murya.\n• Takarda: Takardar lilin fara ko katakon tagulla dorawa (copper).\n• Lokaci: Ranar Laraba da asuba a sa\'ar farko ta Tauraron Utarida (Mercury) da Fari Wata.\n• Saukewa: Ana iya sauke Khatim a matsayin Hoto (PNG 300 DPI) ko Parchemin mai kariya.',
        arabicText: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي',
        transliteration: 'Rabbi ishrah lee sadree wa yassir lee amree wahlul uqdatan min lisanee yafqahoo qawlee',
        abjadWeight: 266,
        lunarMansion: 'Al-Hana\'ah (الهنعة)',
        keyTakeawayFr: 'Le Khatim al-Nutq préserve la clarté de la voix et empêche les hésitations lors des longues récitations.',
        keyTakeawayEn: 'The Khatim al-Nutq maintains vocal stamina and prevents speech stumbles during long recitations.',
        keyTakeawayHa: 'Khatam al-Nutq tana taimakawa wajen kiyaye muryar mai karatu daga gajiya ko kuskure.'
      }
    ]
  },

  // CHAPITRE 3
  {
    id: 'barhatiah_ch3',
    chapterNumber: 3,
    titleAr: 'الفصل الثالث: التكافؤ اللغوي وترجمات الأسماء إلى العربية',
    titleFr: 'Chapitre 3 : Les équivalences linguistiques et traductions des noms',
    titleEn: 'Chapter 3: Linguistic Equivalences & Translations of the Names',
    titleHa: 'Babi na 3: Ma\'anonin Sunaye a Harshen Larabci da Ma\'anoninsu',
    summaryFr: 'Explique la traduction théologique de chaque terme syriaque et hébreu ancien vers la langue arabe orthodoxe, liant les noms aux attributs divins classiques.',
    summaryEn: 'Explains the theological translation of each ancient Syriac and Hebrew term into classical Arabic, linking the names to the Asma al-Husna.',
    summaryHa: 'Yana fassara kowane suna na Syriac zuwa harshen Larabci na Asma\'ul Husna domin gane ma\'anarsa ta ibada.',
    sections: [
      {
        subtitleAr: 'مقابلة الأسماء السريانية بالأسماء الحسنى',
        subtitleFr: 'Correspondances avec les 99 Noms Divins (Asma al-Husna)',
        subtitleEn: 'Correspondences with the 99 Divine Names',
        subtitleHa: 'Hadaka da Sunayen Allah 99',
        contentFr: 'Les 28 Noms de la Barhatiah ne sont pas des incantations profanes mais des équivalents archaïques en syriaque des Attributs Divins : Barhatihin correspond à "Al-Quddus" (Le Très-Saint), Kararin à "Ilah Kull Shai" (Dieu de toute chose), Tatlihin à "Al-Qadir Al-Khabir" (Le Puissant, L\'Informé), Tawran à "Al-Hayy Al-Qayyum" (Le Vivant, Le Subsistant).',
        contentEn: 'The 28 Names are archaical Syriac terms corresponding to the Divine Attributes: Barhatihin equals Al-Quddus (The Holy), Kararin equals Ilah Kull Shai, Tatlihin equals Al-Qadir Al-Khabir, Tawran equals Al-Hayy Al-Qayyum.',
        contentHa: 'Sunaye 28 ba maganganun banza bane, sunayen Allah ne a harshen Syriac na dā: Barhatihin shine Al-Quddus, Kararin shine Ilahu kulli sha\'in.',
        arabicText: 'بَرْهَتِيهٍ = القُدُّوسُ | كَرَرٍ = إِلٰهُ كُلِّ شَيْءٍ | تَتْلِيهٍ = القَادِرُ الخَبِيرُ',
        transliteration: 'Barhatihin = Al-Quddus | Kararin = Ilahu Kulli Shai | Tatlihin = Al-Qadir Al-Khabir',
        keyTakeawayFr: 'Comprendre le sens d\'un nom décuple la concentration mentale (Hudor al-Qalb) lors de la méditation.',
        keyTakeawayEn: 'Understanding the divine meanings elevates heart presence during spiritual work.',
        keyTakeawayHa: 'Gane ma\'anar suna yana samar da natsuwa da kusanci ga Allah.'
      }
    ]
  },

  // CHAPITRE 4
  {
    id: 'barhatiah_ch4',
    chapterNumber: 4,
    titleAr: 'الفصل الرابع: علم الجمل والأوزان العدديّة للأسماء',
    titleFr: 'Chapitre 4 : La science de l\'Abjad appliquée aux 28 noms de la Barhatiah',
    titleEn: 'Chapter 4: Abjad Numerology Applied to the 28 Names',
    titleHa: 'Babi na 4: Ilimin Abjad da Lissafin Lambobi na Sunaye 28',
    summaryFr: 'Détaille les valeurs numériques de chaque nom du serment et explique comment calculer leur somme mathématique pour structurer les opérations d\'écriture.',
    summaryEn: 'Details numerical Abjad values for each covenant name and explains how to calculate mathematical sums for talismanic construction.',
    summaryHa: 'Yana bayyana lissafin lambobi (Hisab al-Jummal) na kowane suna domin amfani a wurin zana khatim.',
    sections: [
      {
        subtitleAr: 'حساب الجمل الكبير والصغير',
        subtitleFr: 'Calcul de l\'Abjad Kabir et Structuration des Répartitions',
        subtitleEn: 'Abjad Kabir Calculations & Mathematical Balancing',
        subtitleHa: 'Lissafin Abjad Babba da Karami',
        contentFr: 'La valeur Abjad globale de la Barhatiah combinée s\'élève à 18 019. Chaque nom possède un poids propre : Barhatihin = 662, Kararin = 430, Tatlihin = 845, Tawran = 266, Mazjalin = 83, Tarqabin = 712. Ces nombres dictent le nombre exact de répétitions rituelles (Adad al-Thikr).',
        contentEn: 'The total Abjad sum of the combined oath equals 18,019. Individual weights (e.g., Barhatihin = 662, Kararin = 430) determine exact recitation counts.',
        contentHa: 'Jimillar lambobin rantsuwar Barhatiah baki daya shine 18,019. Kowane suna yana da lambarsa ta daban wadda take nuna adadin zikiri.',
        abjadWeight: 18019,
        keyTakeawayFr: 'Le respect strict du nombre d\'égrenages (Adad) est indispensable pour établir la résonance mathématique.',
        keyTakeawayEn: 'Strict adherence to calculated recitation counts ensures mathematical harmony.',
        keyTakeawayHa: 'Kiyaye adadin zikiri yana kawo cikar aiki da nasara.'
      }
    ]
  },

  // CHAPITRE 5
  {
    id: 'barhatiah_ch5',
    chapterNumber: 5,
    titleAr: 'الفصل الخامس: الأرواح الملكية والخدام العلويون والسفليون',
    titleFr: 'Chapitre 5 : Les anges gardiens et serviteurs spirituels associés',
    titleEn: 'Chapter 5: Guardian Angels & Associated Spiritual Servants',
    titleHa: 'Babi na 5: Mala\'iku Masu Tsari da Bayin Asiri',
    summaryFr: 'Identifie de manière rigoureuse le gardien céleste majeur et le serviteur terrestre intermédiaire affectés à chacun des 28 noms du serment d\'alliance.',
    summaryEn: 'Rigorously identifies celestial archangels and intermediary spiritual guardians assigned to each of the 28 covenant names.',
    summaryHa: 'Yana bayyana sunayen Mala\'ikun sama da na kasa masu tsaron kowane suna cikin sunaye 28.',
    sections: [
      {
        subtitleAr: 'الأعوان العلوية والمنازل القمرية',
        subtitleFr: 'Hiérarchie Céleste et Anges des 28 Demeures',
        subtitleEn: 'Celestial Hierarchy & Angels of the 28 Lunar Mansions',
        subtitleHa: 'Mala\'ikun Sama da Manazil al-Qamar',
        contentFr: 'Chaque nom est patronné par un ange supérieur céleste (Khadim Alwi) comme Jibril, Mikail, Israfil, Kasfiyail, Anyail, et correspond à l\'une des 28 Demeures de la Lune (Manazil al-Qamar). Ces entités veillent au respect de l\'ordre cosmique.',
        contentEn: 'Each name operates under high celestial angels (Jibril, Mikail, Israfil) mapped directly to the 28 Lunar Mansions, maintaining cosmic equilibrium.',
        contentHa: 'Kowane suna yana karkashin ikon Mala\'ika na sama kamar Jibril da Mikail da Kawkab na wata.',
        keyTakeawayFr: 'L\'opérateur ne commande pas aux anges mais sollicite la grâce divine par leur intercession autorisée.',
        keyTakeawayEn: 'The operator seeks divine grace through angelic intercession under God\'s command.',
        keyTakeawayHa: 'Ruhaniyyai suna aiki ne karkashin umarnin Allah ba karkashin son zuciya ba.'
      }
    ]
  },

  // CHAPITRE 6
  {
    id: 'barhatiah_ch6',
    chapterNumber: 6,
    titleAr: 'الفصل السادس: الأوفاق الخاصة بكل اسم من الأسماء الثمانية والعشرين',
    titleFr: 'Chapitre 6 : Les carrés magiques individuels des 28 noms secrets',
    titleEn: 'Chapter 6: Individual Magic Squares (Wafqs) of the 28 Secret Names',
    titleHa: 'Babi na 6: Zana Khatim da Wafq na Kowane Suna Guda-Guda',
    summaryFr: 'Explique pas à pas la construction géométrique et mathématique des 28 carrés magiques spécifiques (Awfaq) correspondants à chaque nom du serment.',
    summaryEn: 'Step-by-step guide to constructing the 28 specific magic squares (Awfaq) corresponding to each individual covenant name.',
    summaryHa: 'Hanyar zana Wafq da Khatim na musamman ga kowane suna daga cikin sunayen guda 28.',
    sections: [
      {
        subtitleAr: 'قواعد تعمير الوفق الثلاثي والرباعي',
        subtitleFr: 'Règles de Remplissage des Wafqs (3x3, 4x4 et 5x5)',
        subtitleEn: 'Rules for Inscribing 3x3, 4x4, and 5x5 Magic Squares',
        subtitleHa: 'Ka\'idojin Cike Wafq 3x3, 4x4 da 5x5',
        contentFr: 'Pour matérialiser l\'énergie d\'un nom (ex: Barhatihin = 662), on soustrait l\'asymptote rituelle (12 pour un 3x3, 30 pour un 4x4), puis on divise par le nombre de cases pour obtenir le chiffre de départ (Miftah al-Wafq) et la progression (Al-Mughlaq).',
        contentEn: 'To construct a Wafq for a name (e.g. Barhatihin = 662), subtract standard constants, divide by grid dimensions to find the key entry number (Miftah) and final closure number (Mughlaq).',
        contentHa: 'Wajen zana Khatim ta suna, ana cire lamba ta musamman a raba ta da gidajen khatim domin samun Miftah (Mabudi) da Mughlaq (Sirrefewa).',
        keyTakeawayFr: 'Aucune case ne doit comporter de rature ou de doublon pour préserver l\'équilibre géométrique.',
        keyTakeawayEn: 'Every cell must be written clearly with no duplicate numbers or scratches.',
        keyTakeawayHa: 'Khatim ba ta karbuwa idan aka samu gyara ko maimaita lamba.'
      }
    ]
  },

  // CHAPITRE 7
  {
    id: 'barhatiah_ch7',
    chapterNumber: 7,
    titleAr: 'الفصل السابع: الرياضة الروحية وأحكام الصيام والطهو',
    titleFr: 'Chapitre 7 : Les protocoles de purification et le jeûne spirituel (Riyada)',
    titleEn: 'Chapter 7: Purification Protocols & Spiritual Fasting (Riyada)',
    titleHa: 'Babi na 7: Horar da Kai (Riyada) da Dokokin Azumin Asiri',
    summaryFr: 'Manuel d\'instructions physiques concernant l\'abstention d\'aliments d\'origine animale pour purifier le corps avant d\'entamer l\'utilisation du serment.',
    summaryEn: 'Physical and dietary manual regarding abstinence from animal products to cleanse the body before spiritual operations.',
    summaryHa: 'Dokokin abinci da tsaftace jiki daga kayan nama da abincin da ke da karni kafin fara zikiri.',
    sections: [
      {
        subtitleAr: 'حمية التطهير واجتناب الروحيات',
        subtitleFr: 'Le Régime Végétalien Sacré (Tark al-Arwah)',
        subtitleEn: 'The Sacred Vegan Diet (Tark al-Arwah)',
        subtitleHa: 'Kaurace wa Nama da Kayan Dabba',
        contentFr: 'La Riyada implique la consommation exclusive d\'aliments simples (pain d\'orge, figues, olives, eau pure) et l\'abstention totale de viandes, laitages, œufs ou condiments à odeur forte (ail, oignon), afin de purifier le sang et d\'affiner les sens subtils.',
        contentEn: 'Riyada entails eating simple plant foods (barley bread, dates, olives) and avoiding meats, dairy, eggs, and pungent spices to refine spiritual perception.',
        contentHa: 'Riyada tana bukatar cin abinci mara karni kamar gurasa, dabinai, da man zaitun tare da barin nama da kwayaye.',
        keyTakeawayFr: 'La pureté biologique du corps prépare le réceptacle mental à accueillir la lumière des invocations.',
        keyTakeawayEn: 'Physical purity prepares the vessel to hold high vibrational spiritual light.',
        keyTakeawayHa: 'Tsabtar jiki da abinci tana bude idon zuciya ga hasken asiri.'
      }
    ]
  },

  // CHAPITRE 8
  {
    id: 'barhatiah_ch8',
    chapterNumber: 8,
    titleAr: 'الفصل الثامن: الخلوة والاعتكاف وشروط المكان',
    titleFr: 'Chapitre 8 : Les règles de la retraite solitaire (Khalwa) de la Barhatiah',
    titleEn: 'Chapter 8: Rules of Solitary Retreat (Khalwa)',
    titleHa: 'Babi na 8: Dokokin Zamanta a Karkashin Kadaitaka (Khalwa)',
    summaryFr: 'Détaille la durée, le parfum d\'oliban requis, l\'état d\'isolement sensoriel et l\'orientation géographique nécessaires pour mener à bien l\'évocation.',
    summaryEn: 'Details retreat duration, required frankincense gums, sensory isolation, and spatial orientation for spiritual retreats.',
    summaryHa: 'Bayanin zamanta a daki shi kadai domin zikiri, turaren olibanum, da nisantar maganganun banza.',
    sections: [
      {
        subtitleAr: 'آداب الخلوة وشروط المكان المبارك',
        subtitleFr: 'Concurrence des Sens et Consécration du Lieu',
        subtitleEn: 'Sensory Isolation & Sanctification of Space',
        subtitleHa: 'Tsaftace Dakin Zikiri da Nisantar Hayaniya',
        contentFr: 'La Khalwa se pratique généralement pendant 3, 7 ou 21 jours dans une pièce obscure, propre et parfumée en permanence à l\'Oliban (Luban Dhakar) et au Benjoin (Jawi). L\'opérateur demeure orienté vers la Qibla et évite toute parole profane.',
        contentEn: 'Khalwa retreats span 3, 7, or 21 days in a clean, dark room infused with pure Frankincense and Benzoin, facing the Qibla continuously.',
        contentHa: 'Ana yin Khalwa na kwana 3, 7 ko 21 a daki mai tsarki tare da kona turaren Luban da Jawi ba tare da magana da kowa ba.',
        keyTakeawayFr: 'Le silence absolu préserve l\'énergie accumulée lors des sessions de récitation.',
        keyTakeawayEn: 'Absolute silence preserves energy generated during recitation hours.',
        keyTakeawayHa: 'Yi shiru yana adana karfin natsuwa da zikiri.'
      }
    ]
  },

  // CHAPITRE 9
  {
    id: 'barhatiah_ch9',
    chapterNumber: 9,
    titleAr: 'الفصل التاسع: الصيغة الكبرى للدعوة والافتتاح',
    titleFr: 'Chapitre 9 : La formulation de la Grande Évocation (Da\'wah) du serment',
    titleEn: 'Chapter 9: Formulation of the Grand Barhatiah Invocation (Da\'wah)',
    titleHa: 'Babi na 9: Cikakken Karatun Babbar Addu\'ar Barhatiah',
    summaryFr: 'Le texte complet en versets et en formules d\'adjuration assemblant les 28 noms dans une résonance continue pour solliciter l\'ouverture spirituelle.',
    summaryEn: 'The full verse text and adjuration formulas assembling all 28 names in continuous resonance for spiritual opening.',
    summaryHa: 'Rubutun addu\'ar asali gaba daya wadda ke tattara sunaye 28 domin bude kofofin nasara.',
    sections: [
      {
        subtitleAr: 'متن الدعوة المباركة',
        subtitleFr: 'La Grande Invocation Canonique',
        subtitleEn: 'The Canonical Grand Invocation',
        subtitleHa: 'Cikakkiyar Addu\'ar Barhatiah',
        contentFr: 'Texte solennel combinant louanges divines, formules syriaques sacrées et prières sur le Prophète Mahomet. Elle récapitule la totalité des 28 vibrations pour débloquer les situations les plus complexes.',
        contentEn: 'Solemn liturgical text blending divine praises, sacred Syriac names, and blessings upon the Prophet to unlock complex situations.',
        contentHa: 'Addu\'a mai cike da godiya ga Allah, sunayen Syriac masu tsarki, da salatin Annabi domin yaye damuwa.',
        arabicText: 'بِاسْمِ اللهِ الْعَظِيمِ الأَعْظَمِ، بَرْهَتِيهٍ بَرْهَتِيهٍ، كَرَرٍ كَرَرٍ، تَتْلِيهٍ تَتْلِيهٍ، طَوْرَانٍ طَوْرَانٍ، مَزْجَلٍ مَزْجَلٍ، تَرْقَبٍ تَرْقَبٍ... أَنْقِذْنَا وَاحْفَظْنَا بِحَقِّ هٰذِهِ الأَسْمَاءِ الشَّرِيفَةِ.',
        transliteration: 'Bismillahi al-Azim al-A\'zam, Barhatihin Barhatihin, Kararin Kararin, Tatlihin Tatlihin, Tawran Tawran...',
        keyTakeawayFr: 'Récitée à l\'aube ou au tiers de la nuit, elle octroie la sérénité et la protection suprême.',
        keyTakeawayEn: 'Recited at dawn or late night, it yields profound peace and absolute protection.',
        keyTakeawayHa: 'Karantata da asuba ko tsakiyar dare yana kawo kariya da kwarjini.'
      }
    ]
  },

  // CHAPITRE 10
  {
    id: 'barhatiah_ch10',
    chapterNumber: 10,
    titleAr: 'الفصل العاشر: قسم الزجر والسيطرة على الترددات',
    titleFr: 'Chapitre 10 : Le Serment de contrainte (Kasm) pour la maîtrise des forces',
    titleEn: 'Chapter 10: The Oath of Adjuration (Kasm) for Spiritual Control',
    titleHa: 'Babi na 10: Addu\'ar Tsawa da Horar da Aljannu (Kasm)',
    summaryFr: 'Formules de clôture et d\'affirmation de la volonté de l\'opérateur, lues pour orienter les énergies invisibles et s\'assurer de leur calme.',
    summaryEn: 'Closing formulas and adjurations read to direct spiritual subtle energies and command peace.',
    summaryHa: 'Malamai suna amfani da wannan babin domin tsawatar wa aljannu masu tawaye da kiyaye lafiya.',
    sections: [
      {
        subtitleAr: 'صيغة الزجر الشديد والحل',
        subtitleFr: 'L\'Adjuration de Maintien et de Dissolution',
        subtitleEn: 'The Adjuration of Binding & Dissolution',
        subtitleHa: 'Karanta Addu\'ar Horarwa da Salwantar da Sammu',
        contentFr: 'Le Kasm Al-Zajr sert de verrou de sécurité : il rappelle aux entités le respect strict des lois divines et empêche toute interférence chaotique pendant ou après le rituel.',
        contentEn: 'The Kasm Al-Zajr acts as a spiritual safety latch, ensuring entities respect divine laws and preventing chaotic disturbances.',
        contentHa: 'Wannan addu\'a tana kiyaye dakin zikiri daga firgita ko harin aljannu a lokacin aiki.',
        keyTakeawayFr: 'Toujours clore la récitation par la formule de congé (Insiraf) pour libérer l\'espace.',
        keyTakeawayEn: 'Always conclude recitations with the dismissal prayer (Insiraf) to clear the room.',
        keyTakeawayHa: 'Koyaushe a karanta addu\'ar sallama (Insiraf) a karshen zikiri.'
      }
    ]
  },

  // CHAPITRE 11
  {
    id: 'barhatiah_ch11',
    chapterNumber: 11,
    titleAr: 'الفصل الحادي عشر: خاتم سليمان والحصن المنيع',
    titleFr: 'Chapitre 11 : Le Sceau de Salomon (Khatam Sulayman) comme bouclier',
    titleEn: 'Chapter 11: The Seal of Solomon (Khatam Sulayman) as a Shield',
    titleHa: 'Babi na 11: Khatim na Annabi Sulaiman domin Kariya',
    summaryFr: 'Le dessin géométrique à sept pointes et les règles de sa gravure sur argent, porté par le praticien comme protection absolue durant les rituels.',
    summaryEn: 'Geometric 7-pointed seal drawing and rules for silver engraving, worn as absolute spiritual shielding.',
    summaryHa: 'Bayanin yadda ake zana Khatim din Annabi Sulaiman a kan azurfa domin samun kariya daga kowace cuta.',
    sections: [
      {
        subtitleAr: 'الرموز السبعة الملوكية',
        subtitleFr: 'Les 7 Symboles Salomuniques Sacrés',
        subtitleEn: 'The 7 Sacred Solomonic Symbols',
        subtitleHa: 'Alamomi 7 Masu Albarka na Annabi Sulaiman',
        contentFr: 'Le Sceau de Salomon réunit les 7 Symboles Hermétiques (l\'étoile, la couronne, la portée, le miroir, le trident, le dalat, le waw). Gravé sur une médaille d\'argent pur à l\'heure du Soleil, il constitue un bouclier impénétrable.',
        contentEn: 'The Seal of Solomon fuses 7 sacred esoteric symbols. Engraved on pure silver during Solar hours, it forms an impenetrable shield.',
        contentHa: 'Wannan Khatim tana dauke da alamomi guda 7 wadanda idan aka rubuta a azurfa suke kiyaye Dan Adam.',
        keyTakeawayFr: 'Téléchargeable en image haute définition et en parchemin sacré dans la bibliothèque.',
        keyTakeawayEn: 'Available for download as a high-definition seal image or sacred parchment format.',
        keyTakeawayHa: 'Zaku iya sauke wannan Khatim a matsayin Hoto ko Parchemin a cikin zaure.'
      }
    ]
  },

  // CHAPITRE 12
  {
    id: 'barhatiah_ch12',
    chapterNumber: 12,
    titleAr: 'الفصل الثاني عشر: الطلاسم المعدنية والساعات الفلكية',
    titleFr: 'Chapitre 12 : Les talismans métalliques et les heures planétaires du serment',
    titleEn: 'Chapter 12: Metallic Talismans & Planetary Hours',
    titleHa: 'Babi na 12: Rubutun Asiri a Karfe da Duba Sassan Taurari',
    summaryFr: 'Détaille la correspondance entre les 28 noms et les planètes pour choisir le bon alliage métallique de gravure (or, argent, cuivre) selon l\'heure du jour.',
    summaryEn: 'Details correspondences between the 28 names and planets to select appropriate metals (gold, silver, copper) for engraving.',
    summaryHa: 'Yana bayyana yadda ake zana sunaye a kan zinari, azurfa, ko tagulla dangane da lokacin taurari.',
    sections: [
      {
        subtitleAr: 'الطبائع الأربع والمعادن السبعة',
        subtitleFr: 'Alliages Métalliques et Influences Astrologiques',
        subtitleEn: 'Metal Alloys & Astrological Influences',
        subtitleHa: 'Kayan Karfe 7 da Taurari 7',
        contentFr: 'L\'or est associé au Soleil (protection, prestige), l\'argent à la Lune (intuition, clarté), le cuivre à Vénus (harmonie, amour), le fer à Mars (force, désenvoûtement). Graver le nom approprié sur son métal maître décuple son efficacité.',
        contentEn: 'Gold relates to the Sun, Silver to the Moon, Copper to Venus, Iron to Mars. Inscribing names on matched metals amplifies efficacy.',
        contentHa: 'Zinari na Rana ne, Azurfa ta Wata ce, Tagulla ta Maho ce. Zana sunan asiri a karfensa yana kara karfinsa.',
        keyTakeawayFr: 'Toujours vérifier l\'absence d\'éclipse ou de lune vide de course avant la gravure.',
        keyTakeawayEn: 'Ensure no lunar eclipses or void-of-course moons occur during metal engraving.',
        keyTakeawayHa: 'Kada a yi aikin zana karfe lokacin duhun wata ko husufi.'
      }
    ]
  },

  // CHAPITRE 13
  {
    id: 'barhatiah_ch13',
    chapterNumber: 13,
    titleAr: 'الفصل الثالث عشر: علاج التعطيل وفك التوابع',
    titleFr: 'Chapitre 13 : Les méthodes de neutralisation des blocages complexes',
    titleEn: 'Chapter 13: Neutralization Methods for Complex Blockages',
    titleHa: 'Babi na 13: Hanyoyin Yaye Kulle-Kulle da Bashe Ayyuka',
    summaryFr: 'Protocoles d\'écriture spécifiques issus du serment pour dissiper les influences d\'anxiété chronique, d\'apathie et d\'échecs professionnels répétitifs.',
    summaryEn: 'Specific writing protocols derived from the oath to dispel chronic anxiety, apathy, and recurring professional blockages.',
    summaryHa: 'Hanyoyin rubutu da wanka domin cire sammu, rashin sa\'a, da cikas a harkokin yau da kullum.',
    sections: [
      {
        subtitleAr: 'طريقة الحل والإنقاذ من التعطيل',
        subtitleFr: 'Bain de Purification et Dissolution des Blocages',
        subtitleEn: 'Purification Wash & Dissolution of Stagnation',
        subtitleHa: 'Wankan Asiri domin Buɗe Kofofin Samari da Kasuwanci',
        contentFr: 'Écrire les 7 premiers noms avec de l\'encre de safran et d\'eau de rose sur une assiette blanche, puis dissoudre dans de l\'eau de source. Se laver avec cette eau pendant 3 jours consécutifs restaure l\'élan vital.',
        contentEn: 'Inscribe the first 7 names with saffron ink on a white plate, dissolve in spring water, and wash for 3 days to break spiritual stagnation.',
        contentHa: 'Rubuta sunaye 7 na farko da ruwan za\'afaran a kwanon karfe ko na faranti, a wanke a sha ko a yi wanka kwana 3 yana bude kofofin nasara.',
        keyTakeawayFr: 'L\'eau du lavage rituel doit être versée au pied d\'un arbre ou dans la terre propre.',
        keyTakeawayEn: 'Wash water from rituals should be returned respectfully to clean earth or tree roots.',
        keyTakeawayHa: 'Ruwan wankan asiri ana zubasa ne a gindin itaciya ko kasar da take da tsarki.'
      }
    ]
  },

  // CHAPITRE 14
  {
    id: 'barhatiah_ch14',
    chapterNumber: 14,
    titleAr: 'الفصل الرابع عشر: الطب الروحي والاستشفاء بالأسماء',
    titleFr: 'Chapitre 14 : Les applications de médecine spirituelle déduites du serment',
    titleEn: 'Chapter 14: Spiritual Medicine Applications Derived from the Oath',
    titleHa: 'Babi na 14: Magungunan Ruhani da Warkar da Cututtuka',
    summaryFr: 'Explications sur la manière de diluer l\'encre de safran de certains noms dans de l\'eau pure pour soutenir le rétablissement physique des malades.',
    summaryEn: 'Explanations on dissolving saffron-inscribed names into pure water to support physical and energetic healing.',
    summaryHa: 'Bayanan amfani da rubutun za\'afaran a matsayin maganin jiki da na zuciya.',
    sections: [
      {
        subtitleAr: 'الطب الروحي والشراب المبارك',
        subtitleFr: 'Les Boissons Bénies (Al-Sharab al-Mubarak)',
        subtitleEn: 'Blessed Water Preparations (Al-Sharab al-Mubarak)',
        subtitleHa: 'Shan Rubutun Za\'afaran domin Samun Lafiya',
        contentFr: 'Certains noms comme "Tawran" (Le Vivant) et "Mazjalin" possèdent des propriétés apaisantes pour les migraines, les insomnies et les peurs nocturnes. La récitation sur de l\'eau pure transmet la vibration rééquilibrante.',
        contentEn: 'Names like Tawran and Mazjalin hold rebalancing energy for migraines, insomnia, and restlessness when recited over clean drinking water.',
        contentHa: 'Sunaye kamar Tawran da Mazjalin suna taimakawa wajen ciwon kai, rashin boci, da firgita idan aka karanta a ruwa aka sha.',
        keyTakeawayFr: 'La médecine spirituelle complète les traitements médicaux conventionnels sans s\'y substituer.',
        keyTakeawayEn: 'Spiritual practices complement conventional medicine, supporting overall holistic well-being.',
        keyTakeawayHa: 'Maganin ruhani yana taimakawa maganin asibiti ne domin samun cikakkiyar lafiya.'
      }
    ]
  },

  // CHAPITRE 15
  {
    id: 'barhatiah_ch15',
    chapterNumber: 15,
    titleAr: 'الفصل الخامس عشر: الأمانة الأخلاقية والوصية الختامية للبوني',
    titleFr: 'Chapitre 15 : Les clauses de sécurité morale et la clôture éthique de l\'ouvrage',
    titleEn: 'Chapter 15: Moral Safeguards & Final Ethical Testament of Al-Buni',
    titleHa: 'Babi na 15: Amanar Dabi\'u da Gargadin Karshe na Al-Buni',
    summaryFr: 'Le rappel solennel d\'Al-Buni concernant la pureté d\'intention obligatoire du praticien pour préserver l\'accès à ces sciences et éviter le retour de force.',
    summaryEn: 'Solemn testament by Al-Buni mandating pure intentions to safeguard spiritual wisdom and prevent karmic backlash.',
    summaryHa: 'Gargadin karshe na Sheikh Al-Buni zuwa ga mai karatu domin yin aiki da kyakkyawan nufi kawai.',
    sections: [
      {
        subtitleAr: 'وصية البوني وتقوى الله',
        subtitleFr: 'L\'Avertissement Solennel et la Crainte Reverentielle (Taqwa)',
        subtitleEn: 'Solomon\'s Charge & Divine Reverence (Taqwa)',
        subtitleHa: 'Taqwallahi da Nisantar Barnatar Ilimi',
        contentFr: 'Cheikh Ahmad al-Buni conclut son ouvrage en jurant solennellement que quiconque utilise ces noms sacrés pour nuire, tromper, asservir ou assouvir une avidité matérielle verra la bénédiction se changer en épreuve. Seule l\'intention pure (Ikhlas) et la recherche du bien préservent la lumière de la Barhatiah.',
        contentEn: 'Sheikh Ahmad al-Buni closes his work with a stern warning: using sacred names for harm, greed, or manipulation strips their blessing. Only pure intention (Ikhlas) preserves spiritual light.',
        contentHa: 'Sheikh Ahmad Al-Buni ya gargadi kowa da kada a yi amfani da wadannan sunaye domin cutar da wani ko neman dukiyar haram, sai dai domin neman yardar Allah da taimakon mutane.',
        arabicText: 'واتقوا الله ويعلمكم الله، ولا تستخدموا هذه الأسماء إلا في خير وطاعة.',
        transliteration: 'Wat-taqullaha wa yu\'allimukumullah, wa la tastakhdimu hadhihil asma\'a illa fee khayrin wa ta\'ah.',
        keyTakeawayFr: 'La noblesse d\'intention (Niyyah) est le seul sceau ultime qui garantit l\'accès aux mystères.',
        keyTakeawayEn: 'Noble intention (Niyyah) is the ultimate master key to spiritual mysteries.',
        keyTakeawayHa: 'Kyakkyawan nufi shine mabudin karshe na duk wani sirri na ruhani.'
      }
    ]
  }
];
