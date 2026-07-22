// Mystic Calendar localized data and structures
// Supports French (fr), English (en), and Hausa (ha)

export interface HijriMonthDetails {
  index: number; // 1-12
  arabic: string; // مُحَرَّم
  latin: string; // Muharram
  french: string; // Mouharram
  meaning: string; // Meaning of the month
  revelationLevel: string; // Spiritual energy description
}

export interface MysticEvent {
  title: string;
  type: 'verset' | 'douas' | 'arabe' | 'mystique';
  description: string;
  recommendation: string;
}

export interface MoonPhaseMystery {
  name: string;
  arabicName: string;
  manzil: string;
  energy: string;
  mysticMeaning: string;
  recommendedPractice: string;
  vibration: string;
  spiritualSecret: string; // Secret spirituel profond
  astronomicalInfo: string; // Details scientifique/calculs de visibilite
  recommendedAsma: string[]; // Les Noms d'Allah conseilles
  spiritualKey: string; // Cle d'elevation spirituelle
  wirdDetails?: {
    title: string;
    formula: string;
    count: number;
    description: string;
  };
  talsamDetails?: {
    formula: string;
    graphicSymbol: string;
    spiritualUtility: string;
    description: string;
    usageInstructions?: string;
    advancedDetails?: {
      abjadBasis?: string;
      elementalNature?: string;
      khuddamInfo?: string;
      recommendedIncense?: string;
      timingRule?: string;
    };
  };
  quranicVerseDetails?: {
    surahName: string;
    verseNumber: string;
    arabicText: string;
    phonetic: string;
    translation: string;
    spiritualBenefit: string;
  };
  sacredPlantsDetails?: {
    plantName: string;
    botanicalName?: string;
    element: string;
    spiritualProperties: string;
    usageMethod: string;
    binauralFreq?: number;
    frequencyName?: string;
    essentialOils?: string;
  };
  protectiveVerseDetails?: {
    surahName: string;
    verseNumber: string;
    arabicText: string;
    phonetic: string;
    translation: string;
    protectivePower: string;
  };
}

export interface InspirationalQuote {
  quote: string;
  author: string;
}

export interface FrequencyPreset {
  id: string;
  name: string;
  baseFreq: number;
  beatFreq: number;
  desc: string;
}

// 1. Hijri Months Localized Data
export const getLocalizedHijriMonths = (lang: 'fr' | 'en' | 'ha'): HijriMonthDetails[] => {
  const arabicNames = [
    "مُحَرَّم", "صَفَر", "رَبِيع الْأَوَّل", "رَبِيع الثَّانِي",
    "جُمَادَى الْأُولَى", "جُمَادَى الْآخِرَة", "رَجَب", "شَعْبَان",
    "رَمَضَان", "شَوَّال", "ذُو الْقَعْدَة", "ذُو الْحِجَّة"
  ];

  const latinNames = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' ath-Thani",
    "Jumada al-Ula", "Jumada al-Akhirah", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qa'dah", "Dhu al-Hijjah"
  ];

  const frenchNames = [
    "Mouharram", "Safar", "Rabi' al-Awwal", "Rabi' ath-Thany",
    "Joumada al-Oula", "Joumada al-Akhirah", "Rajab", "Cha'ban",
    "Ramadan", "Chawwal", "Dhou al-Qi'dah", "Dhou al-Hijjah"
  ];

  const meanings: Record<'fr' | 'en' | 'ha', string[]> = {
    fr: [
      "Mois sacré de la paix, du recueillement et du respect mutuel.",
      "Mois de l'ancrage, de la transition d'énergie et du voyage intérieur.",
      "Le premier printemps céleste, mois béni de la naissance de la Lumière prophétique.",
      "Le second printemps céleste, mois de l'enracinement et de la continuité.",
      "Le premier mois du gel céleste, de la préservation et du calme intérieur.",
      "Le second mois du recueillement céleste, propice aux bilans spirituels de l'âme.",
      "Mois sacré des semailles divines et de l'imploration du pardon céleste.",
      "Mois d'arrosage des semences spirituelles et de la dispersion des bénédictions.",
      "Le mois béni de la moisson sacrée, de la révélation du Coran et du jeûne purificateur.",
      "Mois de l'élévation, de la joie spirituelle sacrée et du renouvellement.",
      "Mois sacré de la trêve pacifique, du repos de l'âme et du silence contemplatif.",
      "Mois sacré du grand pèlerinage, du sacrifice et de l'extinction de l'ego devant le Très-Haut."
    ],
    en: [
      "Sacred month of peace, mindfulness, and mutual respect.",
      "Month of anchoring, energy transition, and inner journey.",
      "The first celestial spring, blessed month of the birth of Prophetic Light.",
      "The second celestial spring, month of rooting and continuity.",
      "The first month of celestial frost, preservation, and inner calm.",
      "The second month of celestial contemplation, propitious for spiritual assessment of the soul.",
      "Sacred month of divine sowing and imploring celestial forgiveness.",
      "Month of watering spiritual seeds and scattering blessings.",
      "The blessed month of sacred harvest, Quranic revelation, and purifying fast.",
      "Month of elevation, sacred spiritual joy, and renewal.",
      "Sacred month of peaceful truce, rest of the soul, and contemplative silence.",
      "Sacred month of the great pilgrimage, sacrifice, and extinction of the ego before the Most High."
    ],
    ha: [
      "Wata mai alfarma na zaman lafiya, natsuwa, da mutunta juna.",
      "Watan kafuwar ruhaniya, canjin kuzari, da tafiyar cikin gida.",
      "Lokacin bazara na farko na sama, watan haihuwar Hasken Annabi.",
      "Lokacin bazara na biyu na sama, watan dasa tushe da ci gaba.",
      "Wata na farko na sanyin sama, kiyayewa, da natsuwar ciki.",
      "Wata na biyu na natsuwar sama, lokaci mai kyau don lissafin kai.",
      "Wata mai alfarma na shuka iri na Ubangiji da neman gafarar sama.",
      "Watan ban ruwa ga irin ruhaniya da yada albarka.",
      "Wata mai albarka na girbin lada, saukar Alkur'ani, da azumi mai tsarkakewa.",
      "Watan daukaka, farin ciki na ruhaniya mai tsarki, da sabuntawa.",
      "Wata mai alfarma na tsagaitawa da zaman lafiya, hutun rai, da shiru na tunani.",
      "Wata mai alfarma na babban aikin Hajji, hadaya, da kawar da girman kai a gaban Ubangiji."
    ]
  };

  const revelations: Record<'fr' | 'en' | 'ha', string[]> = {
    fr: [
      "Tranquillité intérieure et purification spirituelle intense.",
      "Protection divine renforcée et régularité dans les prières de sauvegarde.",
      "Illumination du cœur, gratitude profonde et harmonie spirituelle.",
      "Sagesse constante, stabilité spirituelle et persévérance sacrée.",
      "Force morale, recueillement intense et constance spirituelle.",
      "Clarté de la conscience, repentir sincère et détachement du superflu.",
      "Méditation contemplative, jeûne béni et purification du corps et de l'esprit.",
      "Élévation vibratoire des actes, paix du cœur et préparation intense à l'illumination.",
      "Révélation absolue, levée des voiles mystiques et proximité suprême avec le Divin.",
      "Gratitude pure pour l'accomplissement spirituel, renouveau intime et joie paisible.",
      "Paix intérieure absolue, repos mental profond et introspection tranquille.",
      "Abandon total de soi, dévotion absolue et moisson de bénédictions infinies."
    ],
    en: [
      "Inner tranquility and intense spiritual purification.",
      "Reinforced divine protection and consistency in prayers.",
      "Illumination of the heart, deep gratitude, and spiritual harmony.",
      "Constant wisdom, spiritual stability, and sacred perseverance.",
      "Moral strength, intense contemplation, and spiritual constancy.",
      "Clarity of conscience, sincere repentance, and detachment from superfluous things.",
      "Contemplative meditation, blessed fasting, and purification of body and mind.",
      "Vibrational elevation of acts, peace of heart, and preparation for illumination.",
      "Absolute revelation, lifting of mystic veils, and supreme closeness to the Divine.",
      "Pure gratitude for spiritual accomplishment, intimate renewal, and peaceful joy.",
      "Absolute inner peace, deep mental rest, and quiet introspection.",
      "Total self-abandonment, absolute devotion, and harvest of infinite blessings."
    ],
    ha: [
      "Natsuwa ta cikin gida da tsarkake ruhaniya mai zurfi.",
      "Kariya ta Ubangiji da dorewa a cikin addu'o'in tsira.",
      "Hasken zuciya, godiya mai zurfi, da daidaituwar ruhaniya.",
      "Hikima ta har abada, natsuwar ruhaniya, da juriya mai tsarki.",
      "Karfin zuciya, natsuwa mai zurfi, da dorewar ruhaniya.",
      "Hasken lamiri, tuba na gaskiya, da nisantar abubuwan duniya.",
      "Zikiri na natsuwa, azumi mai albarka, da tsarkake jiki da rai.",
      "Daukakar ayyuka, zaman lafiyar zuciya, da shiri don hasken ruhaniya.",
      "Saukar wahayi, yaye labule na gaibu, da kusanci na karshe da Ubangiji.",
      "Godiya ta gaskiya don cika ayyukan ruhaniya, sabuntawa, da farin ciki.",
      "Cikakken zaman lafiya na ciki, hutun hankali, da zurfin tunani.",
      "Mika wuya ga Allah baki daya, cikakkiyar biyayya, da samun albarka maras iyaka."
    ]
  };

  return Array.from({ length: 12 }, (_, i) => ({
    index: i + 1,
    arabic: arabicNames[i],
    latin: latinNames[i],
    french: frenchNames[i],
    meaning: meanings[lang][i],
    revelationLevel: revelations[lang][i]
  }));
};

// 2. Localized Mystic Events for Hijri Dates
export const getLocalizedMysticEvent = (
  hYear: number,
  hMonthIndex: number,
  hDay: number,
  dayOfWeek: number,
  lang: 'fr' | 'en' | 'ha'
): MysticEvent => {
  const monthsList = getLocalizedHijriMonths(lang);
  const activeMonthName = monthsList[hMonthIndex].french;

  // Dictionary of major Islamic holidays & special events
  const holidays: Record<'fr' | 'en' | 'ha', Record<string, MysticEvent>> = {
    fr: {
      new_year: {
        title: "Nouvel An de l'Asrar",
        type: "mystique",
        description: "Premier jour de Mouharram. Un nouveau cycle d'énergie cosmique et spirituelle commence. Les portes du renouveau et du repentir s'ouvrent.",
        recommendation: "Formuler des voeux de pureté spirituelle et entamer le wird de protection quotidienne pour sanctifier l'année nouvelle."
      },
      ashura: {
        title: "Délivrance de l'Achoura",
        type: "douas",
        description: "Jour d'intenses bénédictions de l'Achoura. C'est le jour historique où le Prophète Moïse fut sauvé par décret divin des flots.",
        recommendation: "Réciter les prières traditionnelles de protection et de délivrance contre toute forme d'oppression extérieure."
      },
      mawlid: {
        title: "L'Illumination du Mawlid",
        type: "mystique",
        description: "Célébration spirituelle de la naissance du noble Prophète. Le flux de lumière et de bénédictions sur Terre atteint son apogée.",
        recommendation: "Multiplier les salutations spirituelles et s'imprégner de l'enseignement d'amour et de paix du messager de l'invisible."
      },
      isra_miraj: {
        title: "Ascension Spirituelle (Isra & Mi'raj)",
        type: "mystique",
        description: "Nuit céleste commémorant le voyage mystique et l'ascension suprême à travers les sept cieux.",
        recommendation: "Effectuer des prières de recueillement nocturne et méditer sur le rapprochement ultime de l'âme avec l'Essence unique."
      },
      baraah: {
        title: "Nuit de la Mi-Sha'ban (Bara'ah)",
        type: "douas",
        description: "La nuit sacrée de l'absolution, de la délivrance et de la fixation des destinées spirituelles de l'année.",
        recommendation: "Invoquer la préservation de la foi, solliciter la paix universelle et lire des versets de droiture."
      },
      ramadan_open: {
        title: "Ouverture du Ramadan",
        type: "mystique",
        description: "Début du mois béni du jeûne et de la descente coranique. Les cœurs s'allègent des lourdeurs du monde.",
        recommendation: "Établir l'intention pure d'un jeûne intérieur profond et réciter l'invocation d'accueil du mois saint."
      },
      badr_victory: {
        title: "Victoire Lumineuse de Badr",
        type: "verset",
        description: "Journée commémorative du triomphe de la vérité spirituelle sur les illusions de l'égo.",
        recommendation: "Réciter des prières d'affirmation spirituelle pour surmonter les obstacles personnels intérieurs."
      },
      laylat_al_qadr: {
        title: "Porte de la Destinée (Nuit du Destin)",
        type: "mystique",
        description: "Nuit impaire sacrée du Ramadan, recelant une puissance supérieure à mille mois terrestres.",
        recommendation: "Dédier sa nuit entière aux prières de pardon et de paix céleste en demandant la levée définitive des voiles."
      },
      ramadan_day: {
        title: "Spiritualité du Ramadan",
        type: "verset",
        description: "Chaque jour du Ramadan recèle un secret unique favorisant le rapprochement intime avec le Créateur.",
        recommendation: "S'accorder une heure de méditation silencieuse avant la rupture du jeûne et lire un passage inspirant."
      },
      eid_fitr: {
        title: "Harmonie de l'Aïd al-Fitr",
        type: "douas",
        description: "Journée de célébration, de pardon mutuel et de gratitude pour les forces spirituelles acquises durant le jeûne.",
        recommendation: "Réciter les formules de glorification céleste et répandre la bienveillance autour de soi."
      },
      eid_adha: {
        title: "Jour de l'Aïd al-Adha",
        type: "mystique",
        description: "Journée sacrée commémorant le détachement complet des passions terrestres et l'offrande de soi.",
        recommendation: "Se focaliser sur l'amour du prochain, formuler des prières de fraternité et d'abondance."
      },
      white_day: {
        title: "Jour Blanc Mystique",
        type: "mystique",
        description: "La lune est à son zénith d'illumination. Les énergies spirituelles terrestres et subtiles s'élèvent intensément.",
        recommendation: "Observer le jeûne prophétique recommandé de ces trois jours et consacrer la soirée à la récitation céleste."
      }
    },
    en: {
      new_year: {
        title: "Asrar New Year",
        type: "mystique",
        description: "First day of Muharram. A new cycle of cosmic and spiritual energy begins. Gates of renewal and repentance open.",
        recommendation: "Formulate spiritual purity wishes and begin the daily protection wird to sanctify the new year."
      },
      ashura: {
        title: "Deliverance of Ashura",
        type: "douas",
        description: "A day of intense blessings of Ashura. The historical day when Prophet Moses was saved from the waves by divine decree.",
        recommendation: "Recite the traditional prayers of protection and deliverance against any external oppression."
      },
      mawlid: {
        title: "Mawlid Illumination",
        type: "mystique",
        description: "Spiritual celebration of the birth of the noble Prophet. The flow of light and blessings upon Earth reaches its peak.",
        recommendation: "Multiply spiritual salutations and absorb the teachings of love and peace from the messenger of the unseen."
      },
      isra_miraj: {
        title: "Spiritual Ascension (Isra & Mi'raj)",
        type: "mystique",
        description: "Celestial night commemorating the mystical journey and supreme ascension through the seven heavens.",
        recommendation: "Perform night contemplation prayers and meditate on the ultimate alignment of the soul with the Unique Essence."
      },
      baraah: {
        title: "Night of Mid-Sha'ban (Bara'ah)",
        type: "douas",
        description: "The sacred night of absolution, deliverance, and determination of the spiritual destinies of the year.",
        recommendation: "Invoke preservation of faith, seek universal peace, and read verses of righteousness."
      },
      ramadan_open: {
        title: "Opening of Ramadan",
        type: "mystique",
        description: "Beginning of the blessed month of fasting and Quranic descent. Hearts lighten from the heavy burdens of the world.",
        recommendation: "Establish the pure intention of a deep inner fast and recite the welcoming prayer of the holy month."
      },
      badr_victory: {
        title: "Luminous Victory of Badr",
        type: "verset",
        description: "Commemorative day of the triumph of spiritual truth over ego's illusions.",
        recommendation: "Recite prayers of spiritual affirmation to overcome personal inner obstacles."
      },
      laylat_al_qadr: {
        title: "Gate of Destiny (Night of Destiny)",
        type: "mystique",
        description: "Sacred odd night of Ramadan, holding a power superior to a thousand earthly months.",
        recommendation: "Dedicate your entire night to prayers for forgiveness and celestial peace, asking for the permanent lifting of veils."
      },
      ramadan_day: {
        title: "Ramadan Spirituality",
        type: "verset",
        description: "Each day of Ramadan holds a unique secret favoring intimate closeness with the Creator.",
        recommendation: "Grant yourself an hour of silent meditation before breaking the fast and read an inspiring passage."
      },
      eid_fitr: {
        title: "Harmony of Eid al-Fitr",
        type: "douas",
        description: "Day of celebration, mutual forgiveness, and gratitude for the spiritual strengths gained during the fast.",
        recommendation: "Recite formulas of celestial glorification and spread kindness around you."
      },
      eid_adha: {
        title: "Day of Eid al-Adha",
        type: "mystique",
        description: "Sacred day commemorating complete detachment from earthly passions and self-offering.",
        recommendation: "Focus on love for neighbor, make prayers of fraternity and abundance."
      },
      white_day: {
        title: "Mystic White Day",
        type: "mystique",
        description: "The moon is at its zenith of illumination. Terrestrial and subtle spiritual energies rise intensely.",
        recommendation: "Observe the recommended prophetic fast of these three days and dedicate the evening to celestial recitation."
      }
    },
    ha: {
      new_year: {
        title: "Sabuwar Shekarar Asrar",
        type: "mystique",
        description: "Rana ta farko a watan Muharram. Wani sabon zagaye na kuzari na sararin samaniya da ruhaniya ya fara. Kofofin sabuntawa da tuba suna bude.",
        recommendation: "Kudiri niyyar samun tsarkin ruhaniya kuma ka fara wird na kariya don tsarkake sabuwar shekara."
      },
      ashura: {
        title: "Tsiran Ranar Ashura",
        type: "douas",
        description: "Rana ce mai dumbin albarka ta Ashura. Ranar tarihi lokacin da aka tseratar da Annabi Musa daga teku ta hanyar umarnin Ubangiji.",
        recommendation: "Karanta addu'o'in gargajiya na kariya da tsira daga kowane irin zalunci na waje."
      },
      mawlid: {
        title: "Hasken Ranar Mawlid",
        type: "mystique",
        description: "Bikin ruhaniya na haihuwar fiyayyen halitta Annabi Muhammadu (SAW). Gwarangwadar haske da albarka a Duniya tana kaiwa kololuwa.",
        recommendation: "Yawaita salati ga Annabi sannan ka siffantu da dabi'u na soyayya da zaman lafiya."
      },
      isra_miraj: {
        title: "Tafiyar Samaniya (Isra'i da Mi'raji)",
        type: "mystique",
        description: "Daren sama don tunawa da tafiyar ruhaniya ta musamman da hawa sammai guda bakwai.",
        recommendation: "Yin addu'o'in natsuwa na dare da yin tunani a kan kusancin karshe na rai da Ubangiji."
      },
      baraah: {
        title: "Daren Tsakiyar Sha'ban (Bara'ah)",
        type: "douas",
        description: "Daren gafara mai alfarma, tsira, da kayyade rabon kaddarorin ruhaniya na shekara.",
        recommendation: "Nemi dorewar imani, neman zaman lafiya na duniya baki daya, sannan ka karanta ayoyin shiriya."
      },
      ramadan_open: {
        title: "Farkon Watan Ramadan",
        type: "mystique",
        description: "Farkon wata mai albarka na azumi da saukar Alkur'ani. Zukata suna samun sauki daga nauyin duniya.",
        recommendation: "Kudiri niyyar azumi mai zurfi na ciki, sannan ka karanta addu'ar tarbar wata mai alfarma."
      },
      badr_victory: {
        title: "Nasara Mai Haske ta Badr",
        type: "verset",
        description: "Ranar tunawa da nasarar gaskiya ta ruhu a kan yaudarar girman kai.",
        recommendation: "Karanta addu'o'in tabbatar da ruhaniya don shawo kan matsalolin cikin zuciya."
      },
      laylat_al_qadr: {
        title: "Daren Lailatul Qadr",
        type: "mystique",
        description: "Daren maraici mai tsarki na Ramadan, wanda ya fi watanni dubu daraja da iko.",
        recommendation: "Kebe darenka baki daya don addu'o'in gafara da zaman lafiya, kana neman yaye labulen gaibu."
      },
      ramadan_day: {
        title: "Ruhaniyar Ramadan",
        type: "verset",
        description: "Kowace rana a watan Ramadan tana da sirri na musamman don kusanci mai zurfi da Mahalicci.",
        recommendation: "Kebe sa'a daya don yin tunani cikin shiru kafin shan ruwa, sannan ka karanta sashe mai ban sha'awa."
      },
      eid_fitr: {
        title: "Zaman Lafiyar Karamar Sallah",
        type: "douas",
        description: "Ranar murna, gafartawa juna, da nuna godiya ga karfin ruhaniya da aka samu a lokacin azumi.",
        recommendation: "Yawaita tasbahi da daukaka Ubangiji, sannan ka yada kyautatawa ga mutane."
      },
      eid_adha: {
        title: "Ranar Babbar Sallah",
        type: "mystique",
        description: "Ranar alfarma don tunawa da sadaukarwa baki daya da mika wuya ga umarnin Ubangiji.",
        recommendation: "Mayar da hankali kan son makwabci, ka yi addu'o'in zumunci da yalwa."
      },
      white_day: {
        title: "Kwanaki Masu Haske",
        type: "mystique",
        description: "Wata yana tsakiyar haskensa baki daya. Kuzari na ruhaniya yana daukaka sosai a Duniya.",
        recommendation: "Azumci kwanaki uku masu haske (Ayyamul Bidh - 13, 14, 15) sannan ka kebe daren don karatun Alkur'ani."
      }
    }
  };

  // 1. Check holidays
  if (hMonthIndex === 0 && hDay === 1) return holidays[lang].new_year;
  if (hMonthIndex === 0 && hDay === 10) return holidays[lang].ashura;
  if (hMonthIndex === 2 && hDay === 12) return holidays[lang].mawlid;
  if (hMonthIndex === 6 && hDay === 27) return holidays[lang].isra_miraj;
  if (hMonthIndex === 7 && hDay === 15) return holidays[lang].baraah;
  if (hMonthIndex === 8) {
    if (hDay === 1) return holidays[lang].ramadan_open;
    if (hDay === 17) return holidays[lang].badr_victory;
    if ([21, 23, 25, 27, 29].includes(hDay)) return holidays[lang].laylat_al_qadr;
    return {
      ...holidays[lang].ramadan_day,
      title: lang === 'fr' ? `Spiritualité du Ramadan - Jour ${hDay}` : lang === 'ha' ? `Ruhaniyar Ramadan - Rana ta ${hDay}` : `Ramadan Spirituality - Day ${hDay}`
    };
  }
  if (hMonthIndex === 9 && hDay === 1) return holidays[lang].eid_fitr;
  if (hMonthIndex === 11 && hDay === 10) return holidays[lang].eid_adha;

  // 2. White days of the moon (13, 14, 15)
  if ([13, 14, 15].includes(hDay)) {
    return {
      ...holidays[lang].white_day,
      title: lang === 'fr' ? `Jour Blanc Mystique (${hDay} ${activeMonthName})` : lang === 'ha' ? `Kwanaki Masu Haske (${hDay} ${activeMonthName})` : `Mystic White Day (${hDay} ${activeMonthName})`
    };
  }

  // 3. Jumu'ah (Fridays)
  if (dayOfWeek === 5) {
    const fridayThemes: Record<'fr' | 'en' | 'ha', { title: string; rec: string; desc: string }[]> = {
      fr: [
        { title: "Lumière du Vendredi", rec: "S'imprégner de l'esprit du vendredi en lisant des versets d'apaisement céleste.", desc: "Le Vendredi est le maître des jours spirituels, offrant un havre de paix et d'illumination pour l'âme croyante." },
        { title: "Heure Sacrée de l'Exaucement", rec: "Invoquer intensément durant la dernière heure avant le coucher du soleil pour obtenir la paix intérieure.", desc: "Le Vendredi est le maître des jours spirituels, offrant un havre de paix et d'illumination pour l'âme croyante." },
        { title: "Purification Spirituelle", rec: "Multiplier les louanges spirituelles afin d'élever son taux de sérénité.", desc: "Le Vendredi est le maître des jours spirituels, offrant un havre de paix et d'illumination pour l'âme croyante." },
        { title: "Armure Céleste de Protection", rec: "Réciter les trois dernières sourates courtes protectrices à l'aube pour s'envelopper de protection divine.", desc: "Le Vendredi est le maître des jours spirituels, offrant un havre de paix et d'illumination pour l'âme croyante." }
      ],
      en: [
        { title: "Friday Light", rec: "Immerse in the spirit of Friday by reading verses of celestial soothing.", desc: "Friday is the master of spiritual days, offering a haven of peace and illumination for the believing soul." },
        { title: "Sacred Hour of Acceptance", rec: "Invoke intensely during the last hour before sunset to obtain inner peace.", desc: "Friday is the master of spiritual days, offering a haven of peace and illumination for the believing soul." },
        { title: "Spiritual Purification", rec: "Multiply spiritual praises to elevate your serenity level.", desc: "Friday is the master of spiritual days, offering a haven of peace and illumination for the believing soul." },
        { title: "Celestial Armor of Protection", rec: "Recite the last three short protective Surahs at dawn to wrap yourself in divine protection.", desc: "Friday is the master of spiritual days, offering a haven of peace and illumination for the believing soul." }
      ],
      ha: [
        { title: "Hasken Ranar Juma'a", rec: "Samu natsuwar ranar Juma'a ta hanyar karatun ayoyin kwantar da hankali.", desc: "Ranar Juma'a ita ce uwar kwanaki, tana bayar da natsuwa da haske ga ran mai imani." },
        { title: "Lokaci Mai Alfarma na Karɓar Addu'a", rec: "Yawaita addu'a a sa'ar karshe kafin faduwar rana domin samun zaman lafiya na ciki.", desc: "Ranar Juma'a ita ce uwar kwanaki, tana bayar da natsuwa da haske ga ran mai imani." },
        { title: "Tsarkake Ruhaniya", rec: "Yawaita salati da zikiri domin daukaka natsuwar zuciyarka.", desc: "Ranar Juma'a ita ce uwar kwanaki, tana bayar da natsuwa da haske ga ran mai imani." },
        { title: "Garkuwar Kariya ta Sama", rec: "Karanta qul-huwallahu, qul-a'uzu birabbil falaq da nas a sanyin safiya don samun garkuwar Ubangiji.", desc: "Ranar Juma'a ita ce uwar kwanaki, tana bayar da natsuwa da haske ga ran mai imani." }
      ]
    };
    const theme = fridayThemes[lang][hDay % fridayThemes[lang].length];
    return {
      title: theme.title,
      type: "verset",
      description: theme.desc,
      recommendation: theme.rec
    };
  }

  // 4. Default Day alignments
  const alignments: Record<'fr' | 'en' | 'ha', MysticEvent[]> = {
    fr: [
      {
        title: "Pureté Intérieure",
        type: "douas",
        description: "Alignement vibratoire favorisant le nettoyage des blocages intérieurs et des énergies néfastes.",
        recommendation: "Formuler des requêtes de pardon sincère et cultiver l'humilité du cœur à chaque respiration."
      },
      {
        title: "Protection Absolue de l'Invocateur",
        type: "verset",
        description: "Préservation invisible contre l'envie, la médisance et les ondes négatives subtiles.",
        recommendation: "Réciter les versets de protection de l'esprit avant le repos pour former une barrière contre l'invisible."
      },
      {
        title: "Sagesse et Clarté Mentale",
        type: "mystique",
        description: "Ouverture des canaux spirituels favorisant l'acquisition d'une compréhension pure.",
        recommendation: "Contempler en silence l'horizon ou le ciel pendant quelques minutes pour apaiser le flux mental."
      },
      {
        title: "Illumination du Cœur d'Asrar",
        type: "mystique",
        description: "Journée bénéfique pour cultiver l'éveil intuitif et la lucidité face aux événements quotidiens.",
        recommendation: "Méditer silencieusement et invoquer intérieurement la paix spirituelle profonde."
      },
      {
        title: "Prières de Sagesse Spirituelle",
        type: "douas",
        description: "Activation des vérités cachées de l'âme et établissement de la paix intérieure souveraine.",
        recommendation: "Invoquer le Très-Haut pour réclamer une science utile guidant chaque pas vers la droiture."
      },
      {
        title: "Guidance Divine Infaillible",
        type: "verset",
        description: "Un souffle de clarté accompagne aujourd'hui l'aspirant sincère en quête d'harmonie absolue.",
        recommendation: "Méditer sur les paroles de miséricorde divine et poser un acte de bienveillance gratuit."
      },
      {
        title: "Paix Intérieure Sacrée",
        type: "mystique",
        description: "Apaisement céleste absolu pour libérer l'esprit des fardeaux matériels et de l'anxiété.",
        recommendation: "Visualiser une onde de calme bienfaisant enveloppant votre poitrine lors de vos prières."
      }
    ],
    en: [
      {
        title: "Inner Purity",
        type: "douas",
        description: "Vibrational alignment favoring the cleansing of inner blockages and harmful energies.",
        recommendation: "Formulate sincere requests for forgiveness and cultivate humility of the heart with every breath."
      },
      {
        title: "Absolute Protection of the Invoker",
        type: "verset",
        description: "Invisible preservation against envy, backbiting, and subtle negative energies.",
        recommendation: "Recite spiritual protection verses before resting to form a barrier against the unseen."
      },
      {
        title: "Wisdom and Mental Clarity",
        type: "mystique",
        description: "Opening of spiritual channels favoring the acquisition of pure understanding.",
        recommendation: "Contemplate the horizon or the sky in silence for a few minutes to calm mental chatter."
      },
      {
        title: "Illumination of Asrar's Heart",
        type: "mystique",
        description: "Beneficial day to cultivate intuitive awakening and clarity regarding daily events.",
        recommendation: "Meditate silently and invoke deep spiritual peace within."
      },
      {
        title: "Prayers of Spiritual Wisdom",
        type: "douas",
        description: "Activation of hidden truths of the soul and establishment of sovereign inner peace.",
        recommendation: "Invoke the Most High to request useful knowledge guiding every step towards righteousness."
      },
      {
        title: "Infallible Divine Guidance",
        type: "verset",
        description: "A breath of clarity accompanies the sincere seeker in search of absolute harmony today.",
        recommendation: "Meditate on words of divine mercy and perform an act of free kindness."
      },
      {
        title: "Sacred Inner Peace",
        type: "mystique",
        description: "Absolute celestial soothing to free the mind from material burdens and anxiety.",
        recommendation: "Visualize a wave of beneficial calm enveloping your chest during your prayers."
      }
    ],
    ha: [
      {
        title: "Tsarki na Ciki",
        type: "douas",
        description: "Daidaita sauti domin kawar da dukkan matsaloli da kuzari mara kyau na ciki.",
        recommendation: "Nemi gafarar Allah da gaskiya tare da tawali'u a kowane nishi."
      },
      {
        title: "Cikakkiyar Kariya ta Mai Zikiri",
        type: "verset",
        description: "Kariya ta gaibu daga hassada, gulma, da dukkan kuzari mara kyau na boye.",
        recommendation: "Karanta ayoyin kariya na ruhu kafin yin barci domin samun garkuwa daga gaibu."
      },
      {
        title: "Hikima da Hasken Hankali",
        type: "mystique",
        description: "Bude kofofin ruhaniya domin samun fahimta mai tsabta.",
        recommendation: "Yi tunani cikin shiru ga sararin sama na 'yan mintoci domin natsar da hankali."
      },
      {
        title: "Haskaka Zuciya ta Asrar",
        type: "mystique",
        description: "Rana mai albarka don samar da farkawar hankali da natsuwa a cikin ayyukan yau da kullum.",
        recommendation: "Yi zikiri cikin shiru ka nemi zaman lafiya mai zurfi a cikin zuciya."
      },
      {
        title: "Addu'o'in Hikimar Ruhaniya",
        type: "douas",
        description: "Kuna bayyanar da gaskiya ta ruhu da tabbatar da zaman lafiya a cikin zuciya.",
        recommendation: "Nemi ilimi mai amfani a wurin Ubangiji wanda zai shiryar da kai ga hanya madaidaciya."
      },
      {
        title: "Shiryatarwa ta Ubangiji",
        type: "verset",
        description: "Hasken zaman lafiya yana tare da mai neman gaskiya a yau domin samun daidaituwa baki daya.",
        recommendation: "Yi tunani a kan kalmomin rahamar Ubangiji, sannan ka yi kyautatawa ga wani domin Allah."
      },
      {
        title: "Zaman Lafiya Mai Tsarki na Ciki",
        type: "mystique",
        description: "Natsuwa ta sama baki daya domin yaye wa zuciya dukkan damuwa da nauyin duniya.",
        recommendation: "Yi tunanin hasken zaman lafiya yana mamaye kirjinka lokacin addu'o'inka."
      }
    ]
  };

  const dailyList = alignments[lang];
  return dailyList[hDay % dailyList.length];
};

// 3. Localized Moon Phase Mysteries
export const getLocalizedMoonDayMystery = (hDay: number, lang: 'fr' | 'en' | 'ha'): MoonPhaseMystery => {
  // Localized structures for each phase range
  if (hDay === 1 || hDay === 30 || hDay === 29) {
    return {
      name: lang === 'fr' ? "Nouvelle Lune (Al-Hilal Al-Khafi / Al-Muhag)" : lang === 'ha' ? "Sabuwar Wata (Al-Hilal Al-Khafi)" : "New Moon (Al-Hilal Al-Khafi)",
      arabicName: "الهلال الخفي - المحاق",
      manzil: lang === 'fr' ? "Al-Sharatan & Al-Butayn (الشَّرَطَان - Demeure des Signes Célestes)" : lang === 'ha' ? "Al-Sharatan da Al-Butayn (الشَّرَطَان)" : "Al-Sharatan & Al-Butayn (الشَّرَطَان)",
      energy: lang === 'fr' ? "Purification intégrale, Annihilation de l'ego (Fana') et Consécration de l'Intention Pure (Niyyah Qudsiyyah)"
            : lang === 'ha' ? "Tsarkake ruhaniya gaba daya, kashe girman kai (Fana') da sabunta Niyya mai tsarki"
            : "Integral purification, ego annihilation (Fana'), and consecration of Pure Intention (Niyyah Qudsiyyah)",
      mysticMeaning: lang === 'fr' ? "L'obscurité totale de cette phase est le réceptacle originel (Al-Fitrah al-Ula). C'est le miroir immaculé du cœur avant toute empreinte créaturelle. En cette nuit du silence divin, les voiles de la matière sont résorbés dans l'Unité (Al-Wahdaniyyah), offrant au chercheur spirituel (Salik) une occasion unique de réinitialiser son pacte de servitude ('Ubudiyyah) directement auprès de la Présence Divine."
                   : lang === 'ha' ? "Cikakken duhu na wannan lokaci yana wakiltar asalin ran mutum (Al-Fitrah) kafin dukkan hayaniyar duniya. Dare ne na cikakken shiru na ubangiji inda girman kai (An-Nafs) yake gushewa domin zuciya ta zama madubi mai tsabta don karbar hasken farko na sabon wata."
                   : "The total darkness of this phase is the primordial vessel (Al-Fitrah al-Ula). It is the pristine mirror of the heart before any creaturely imprint. In this night of divine silence, the veils of matter are reabsorbed into Oneness (Al-Wahdaniyyah), offering the spiritual seeker (Salik) a unique opportunity to reset their covenant of servitude ('Ubudiyyah).",
      recommendedPractice: lang === 'fr' ? "Accomplir un bain de purification intégrale (Ghusl al-Niyyah) avec l'intention de laver les traces spirituelles du mois écoulé. S'isoler au tiers de la nuit, orienté vers la Qiblah dans l'obscurité complète. Réciter la Sourate Al-Fatiha 7 fois avec méditation profonde sur chaque verset, suivie de la méditation du silence (Muraqabah) pendant 15 minutes."
                         : lang === 'ha' ? "Yi wankan tsarkake ruhaniya (Wankan Niyya), ka zauna kai kadai kana kallon Alqibla a cikin duhu, sannan ka fadi kyawawan niyoyinka na watan mai zuwa. Karanta Suratul Fatiha kafa 7 kana tunani a kan kowace aya, sannan ka yi Muraqabah (tunani shiru) kafa 15."
                         : "Perform a full ritual purification bath (Ghusl al-Niyyah) intending to cleanse spiritual traces of the past month. Isolate yourself in the last third of the night facing the Qiblah in complete darkness. Recite Surah Al-Fatiha 7 times with deep meditation on each verse, followed by 15 minutes of silent Muraqabah.",
      vibration: lang === 'fr' ? "Fréquence du vide sacré, de la réceptivité pure et du renouveau théurgique" : lang === 'ha' ? "Kuzari na farawa da cikakkiyar karba" : "Frequency of sacred void, pure receptivity, and theurgic renewal",
      spiritualSecret: lang === 'fr' ? "Le secret ésotérique de la Nouvelle Lune réside dans le principe du Vide Sacré (Al-Khala' al-Muqaddas). De même que le texte coranique exige une page blanche pour être transcrit, le cœur humain ne peut recevoir les illuminations célestes (Al-Futuhat al-Ilahiyyah) que lorsqu'il est débarrassé de tout attachement temporel. Ce vide n'est pas une absence, mais une réceptivité infinie."
                     : lang === 'ha' ? "Sirrin boye na wannan watan yana cikin zama babu komai (Al-Khala'): sai kawai lokacin da zuciya ta kasance babu dukkan yaudarar wannan duniya za a iya cika ta da hasken Ubangiji da albarka (Al-Futuhat al-Ilahiyyah)."
                     : "The esoteric secret of the New Moon lies in the principle of the Sacred Void (Al-Khala' al-Muqaddas). Just as Quranic script requires a blank parchment, the human heart can only receive celestial illuminations (Al-Futuhat al-Ilahiyyah) when cleared of worldly attachments.",
      astronomicalInfo: lang === 'fr' ? "Alignement synodique parfait entre la Terre, la Lune et le Soleil (Conjonction astrale à 0° d'élongation). La Lune fait face à la Terre avec sa face ténébreuse, masquant entièrement sa réflectivité solaire. C'est le point zéro de l'orbite elliptique synodique (période de 29,53 jours) marquant la naissance du nouveau mois hégirien."
                      : lang === 'ha' ? "Wata yana daidai da Rana baki daya (0° elongation). Fuskarsa da muke gani tana cikin duhu, wanda hakan ke sa ba a iya ganinsa da ido daga Duniya. Shi ne mafarin watan hégirien."
                      : "Perfect synodic alignment between Earth, Moon, and Sun (astral conjunction at 0° elongation). The Moon faces Earth with its dark side, completely concealing solar reflectivity. It is the zero point of the synodic orbit (29.53 days) marking the birth of the new Hijri month.",
      recommendedAsma: lang === 'fr' ? ["يَا بَادِئُ (Ya Badi' - Créateur Sans Modèle - 94)", "يَا خَالِقُ (Ya Khaliq - Concepteur Universel - 731)", "يَا هَادِي (Ya Hadi - Guide des Âmes - 20)", "يَا أَوَّلُ (Ya Awwal - Le Premier Sans Commencement - 37)"]
                     : lang === 'ha' ? ["يَا بَادِئُ (Ya Badi' - Mafari na Asali)", "يَا خَالِقُ (Ya Khaliq - Mahalicci)", "يَا هَادِي (Ya Hadi - Mai Shiryarwa)", "يَا أَوَّلُ (Ya Awwal - Na Farko)"]
                     : ["يَا بَادِئُ (Ya Badi' - O Originator)", "يَا خَالِقُ (Ya Khaliq - O Creator)", "يَا هَادِي (Ya Hadi - O Guide)", "يَا أَوَّلُ (Ya Awwal - O First)"],
      spiritualKey: lang === 'fr' ? "La clé réside dans la vacuité du cœur : vider la maison de l'âme de toute idole matérielle pour que le Roi Éternel y réside."
                  : lang === 'ha' ? "Mabuɗin yana cikin sabunta alkawari na bautar ruhaniya da gaskiya ('Ubudiyyah)."
                  : "The key lies in heart emptiness: clearing the soul's sanctuary of material idols so the Eternal King resides within.",
      wirdDetails: {
        title: lang === 'fr' ? "Wird du Commencement Sacré & de l'Origine Pure (Ya Badî')" : "Wird of the Sacred Origin (Ya Badi')",
        formula: "Yâ Badî'al-Aja'ibi bil-Khayri Yâ Badî' - Yâ Awwalu bi-lâ Bidayah",
        count: 111,
        description: lang === 'fr' ? "À réciter dans un isolement total juste après la prière de l'Isha ou lors du Sahar pour semer des graines de lumière et débloquer les projets du nouveau cycle." : "Recite in complete solitude right after Isha prayer or during Sahar to plant seeds of divine light and unlock new cycle endeavors."
      },
      talsamDetails: {
        formula: "بَدُوحُ (بَ-دُ-و-حُ / B-D-W-H) - ٨ ٦ ٤ ٢",
        graphicSymbol: "┌───────────┐\n│ 2   9   4 │\n│ 7   5   3 │\n│ 6   1   8 │\n└───────────┘",
        spiritualUtility: lang === 'fr' ? "Attraction des influences bénéfiques, harmonisation de l'aura et consécration sacrée des intentions de vie" : "Attraction of beneficial influences, aura harmonization, and sacred consecration of intentions",
        description: lang === 'fr' ? "Le talsam de Buduh repose sur un carré magique parfait (Wafq 3x3) dont la somme théurgique constante est de 15 sur chaque axe. Il canalise la vibration de la création primordiale pour protéger les semences de projets et conférer le succès béni." : "The Buduh talisman rests upon a perfectly proportioned 3x3 magic square with a constant magic sum of 15 across all axes. It channels primordial creation vibrations to safeguard new intentions and ensure blessed success."
      },
      quranicVerseDetails: {
        surahName: lang === 'fr' ? "Sourate Al-An'am (6:101)" : lang === 'ha' ? "Suratul An'am (6:101)" : "Surah Al-An'am (6:101)",
        verseNumber: "6:101",
        arabicText: "بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ ۖ أَنَّىٰ يَكُونُ لَهُ وَلَدٌ وَلَمْ تَكُن لَّهُ صَاحِبَةٌ ۖ وَخَلَقَ كُلَّ شَيْءٍ ۖ وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ",
        phonetic: "Badi'u as-samawati wal-ard...",
        translation: lang === 'fr' ? "Créateur des cieux et de la terre à partir du néant ! Comment aurait-Il un enfant alors qu'Il n'a pas de compagne ? C'est Lui qui a tout créé et Il est Omniscient." : lang === 'ha' ? "Shi ne Mai ƙira da ƙirƙirar sammai da ƙasa ba tare da wani misali ba! Ta yaya zai kasance yana da ɗa alhali ba shi da mata? Shi ne Ya halitta kowane abu..." : "Originator of the heavens and the earth! How could He have a son when He has no companion? He created all things, and He is Knowing of all things.",
        spiritualBenefit: lang === 'fr' ? "Réciter ce verset 7 fois à la Nouvelle Lune purifie l'esprit de toute idolâtrie matérielle et consacre la pureté des intentions créatrices." : lang === 'ha' ? "Maimaita wannan aya kafa 7 yana tsarkake zuciya daga damuwar duniya da buɗe hanyoyin sabuwar niyya." : "Reciting this verse 7 times at New Moon purifies the heart of worldly attachments and consecrates pure creative intentions."
      },
      sacredPlantsDetails: {
        plantName: lang === 'fr' ? "Oud Cambodgien & Myrrhe Sacrée" : lang === 'ha' ? "Oud da Myrrhe (Kumu)" : "Cambodian Oud & Sacred Myrrh",
        botanicalName: "Aquilaria agallocha / Commiphora myrrha",
        element: lang === 'fr' ? "Terre Subtile & Éther" : lang === 'ha' ? "Ƙasa da Iska" : "Subtle Earth & Ether",
        spiritualProperties: lang === 'fr' ? "Dissolution des mémoires négatives accumulées pendant le mois écoulé, sanctification de l'espace sacré et ancrage de la paix." : lang === 'ha' ? "Tatsar dukkan makamashi mara kyau na tsohon wata, tsarkake daki da kawo zaman lafiya." : "Dissolution of negative energies accumulated over the past month, space sanctification, and deep grounding.",
        usageMethod: lang === 'fr' ? "Consommer en fumigation douce sur du charbon ardent pendant la récitation du Zikr de la Nouvelle Lune ou l'onction d'huile essentielle d'Oud sur les poignets." : lang === 'ha' ? "Kona shi a kan garwashin wuta a lokacin zikiri ko shafa man Oud a hannaye." : "Burn gently over live coals during New Moon Zikr or apply Oud essential oil onto pulse points.",
        binauralFreq: 432,
        frequencyName: lang === 'fr' ? "432 Hz - Ancrage & Harmonie de la Création" : "432 Hz - Earth Grounding & Creation Resonance",
        essentialOils: lang === 'fr' ? "Huile Essentielle d'Oud Pur, Myrrhe & Encens d'Oman" : "Pure Oud Essential Oil, Myrrh & Frankincense"
      },
      protectiveVerseDetails: {
        surahName: lang === 'fr' ? "Sourate Al-Ikhlas (112:1-4) - Sincérité Absolue" : lang === 'ha' ? "Suratul Ikhlas (112:1-4)" : "Surah Al-Ikhlas (112:1-4) - Absolute Purity",
        verseNumber: "112:1-4",
        arabicText: "قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        phonetic: "Qul Huwallahu Ahad. Allahus-Samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
        translation: lang === 'fr' ? "Dis : 'Il est Allah, Unique. Allah, Le Seul à être imploré pour ce que nous désirons. Il n'a jamais engendré, n'a pas été engendré non plus. Et nul n'est égal à Lui.'" : lang === 'ha' ? "Ka ce: 'Shi ne Allah, Madaɗaici. Allah Shi ne Abin nufa da buƙata...'" : "Say, 'He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent.'",
        protectivePower: lang === 'fr' ? "Protection universelle contre toute forme d'associationnisme (Shirk), neutralisation des mauvaises intentions et consécration de la pureté du cœur au seuil du mois." : lang === 'ha' ? "Tsarin Ubangiji daga dukkan duhun zuciya, tsarkake niyya da kare mutum daga mugun nufi." : "Universal protective shield against spiritual impurities, purifying the heart at the cycle boundary."
      }
    };
  } else if (hDay >= 2 && hDay <= 6) {
    return {
      name: lang === 'fr' ? "Premier Croissant (Al-Hilal Al-Mubaraki)" : lang === 'ha' ? "Jinjirin Wata na Farko (Al-Hilal)" : "First Crescent (Al-Hilal)",
      arabicName: "الهلال المبارك",
      manzil: lang === 'fr' ? "Al-Thurayya (الثُّرَيَّا - Les Pléiades, Constellation du Rayonnement)" : lang === 'ha' ? "Al-Thurayya (الثُّرَيَّا)" : "Al-Thurayya (الثُّرَيَّا)",
      energy: lang === 'fr' ? "Émergence de la Lumière (Nur al-Ibtida'), Éveil de l'Intuition et Ouverture des Voix du Cœur"
            : lang === 'ha' ? "Ruhun wahayi, karuwar imani da bayyanar haske mai dorewa"
            : "Emergence of light (Nur al-Ibtida'), awakening of intuition, and opening of heart channels",
      mysticMeaning: lang === 'fr' ? "Le mince filet de lumière d'argent réapparaissant à l'Ouest symbolise la première théophanie (Tajalli) de la Vérité dans le monde manifeste. Tel l'arc du compas divin, ce croissant dessine la première trajectoire du dessein céleste. C'est l'étincelle de la foi qui dissipe le doute et annonce l'aube d'une illumination progressive pour l'âme en quête."
                   : lang === 'ha' ? "Siririn layin haske da ya sake bayyana yana wakiltar bayyanar kalmar Ubangiji (Tajalli) da shiriya a cikin duhu. Labule yana fara dagawa a hankali, yana bayyana sirrin farko na hikima za a karu da ita."
                   : "The thin sliver of silver light reappearing in the West symbolizes the initial divine epiphany (Tajalli) in the manifested world. Like the arc of a celestial compass, this crescent outlines the first trajectory of divine decree, dispelling doubt and declaring progressive illumination.",
      recommendedPractice: lang === 'fr' ? "Fixer la Lune du premier croissant avec un regard d'admiration et d'humilité, réciter l'invocation prophétique du Hilal, puis multiplier les Salawat sharifah ('Allahumma salli 'ala Sayyidina Muhammadin Nur al-Anwar') 100 fois. Faire un vœu noble pour la guidée et la subsistance bénie."
                         : lang === 'ha' ? "Kallon jinjirin wata da natsuwa da girmamawa, karanta addu'ar ganin wata, sannan ka yi Salatin Annabi kafa 100 domin illuminer hankali da buɗe fa'idojin zuciya."
                         : "Gaze upon the rising crescent with reverence, recite the prophetic Hilal supplication, then multiply Salawat ('Allahumma salli 'ala Sayyidina Muhammadin Nur al-Anwar') 100 times for mental clarity and spiritual blessing.",
      vibration: lang === 'fr' ? "Lumière naissante, clarté d'esprit et impulsion d'éveil céleste" : lang === 'ha' ? "Haske na farko da farkawar tunani na sama" : "Nascent light, mental clarity, and celestial awakening impulse",
      spiritualSecret: lang === 'fr' ? "Le secret de cette lune réside dans la science de la lettre Alif (أ), symbole de la rectitude et du premier canal de descente du souffle divin. Comme le croissant pointe vers les cieux, le Salik (cheminant) apprend que la moindre pensée tournée vers le Divin déclenche une cascade de bénédictions angéliques."
                     : lang === 'ha' ? "Sirrin boye na wannan watan yana da alaka mai karfi da harafin 'Alif' (أ), farkon motsin halitta. Yana koya wa mai imani cewa dukkan babban aiki yana farawa ne da kankanin haske mai dorewa."
                     : "The secret of this moon lies in the esoteric science of the letter Alif (أ), the symbol of rectitude and the primary channel of divine breath. As the crescent points skyward, even a subtle thought directed toward the Divine triggers angelic blessings.",
      astronomicalInfo: lang === 'fr' ? "L'élongation lunaire atteint 15 à 45° à l'Est du Soleil. Une minuscule portion de la surface lunaire occidentale réfléchit les rayons solaires, dessinant un arc d'argent d'une grande finesse visible pendant 30 à 60 minutes au-dessus de l'horizon occidental immédiatement après le coucher du soleil."
                      : lang === 'ha' ? "Wata yana nisantar Rana zuwa Gabas (15-45°). Kankanin haske a fuskarsa ta yamma ke bayyana bayan faduwar rana na kusan mintuna 30-60."
                      : "Lunar elongation reaches 15 to 45° East of the Sun. A delicate sliver of the western lunar surface reflects sunlight, forming a fine silver arc visible for 30 to 60 minutes above the western horizon right after sunset.",
      recommendedAsma: lang === 'fr' ? ["يَا نُورُ (Ya Nur - Lumière des Cieux - 256)", "يَا مُبِينُ (Ya Mubin - La Clarté Manifeste - 102)", "يَا فَتَّاحُ (Ya Fattah - L'Ouvreur Suprême - 489)", "يَا ظَاهِرُ (Ya Zahir - L'Apparent par Ses Signes - 1106)"]
                     : lang === 'ha' ? ["يَا نُورُ (Ya Nur - Haske)", "يَا مُبِينُ (Ya Mubin - Mai Bayyanawa)", "يَا فَتَّاحُ (Ya Fattah - Mai Bude Zukata)", "يَا ظَاهِرُ (Ya Zahir - Na Bayyane)"]
                     : ["يَا نُورُ (Ya Nur - O Light)", "يَا مُبِينُ (Ya Mubin - O Manifest)", "يَا فَتَّاحُ (Ya Fattah - O Opener)", "يَا ظَاهِرُ (Ya Zahir - O Evident)"],
      spiritualKey: lang === 'fr' ? "La clé est la constance (Istiqaamah) : entretenir l'étincelle de la foi avec régularité pour qu'elle devienne un brasier de certitude."
                  : lang === 'ha' ? "Mabudin shi ne dorewa (Istiqaamah) a farkon matakan kokarin ruhaniya."
                  : "The key is constancy (Istiqaamah): nurturing the spark of faith regularly until it turns into a beacon of absolute certainty.",
      wirdDetails: {
        title: lang === 'fr' ? "Wird de l'Illumination Mentale et de l'Ouverture (Ya Nûr)" : "Wird of Mental Illumination & Opening (Ya Nur)",
        formula: "Yâ Nûru Yâ Mubînu Yâ Fattâh, Iftah lî abwâba rahmatika wa 'ilmika",
        count: 489,
        description: lang === 'fr' ? "À réciter au lever du soleil ou au coucher du soleil pour dissoudre la nébulosité de l'esprit, recevoir des idées inspirées et débloquer les voies fermées." : "Recite at sunrise or sunset to clear mental vagueness, receive intuitive insights, and unlock closed pathways."
      },
      talsamDetails: {
        formula: "أَلِفٌ (أَ-لِ-فُ / A-L-F) - ٩ ١ ١",
        graphicSymbol: "║║║ 𐎃 ║║║ 𐎃 ║║║\n   ١    ١    ١   \n   ا    ل    ف   ",
        spiritualUtility: lang === 'fr' ? "Clarté d'esprit, éveil de la perception extrasensorielle et déblocage des nœuds mentaux" : "Mental clarity, spiritual perception awakening, and removal of mental blockages",
        description: lang === 'fr' ? "Ce talsam s'appuie sur le secret numérique du Alif (valeur 111 en Abjad kamil) et sa forme verticale inébranlable. Il aligne le canal médullaire et élève la fréquence vibratoire de l'esprit." : "This talisman leverages the numerical secret of Alif (value 111 in Abjad Kamil) and its vertical posture, aligning subtle energies and raising spiritual frequency."
      },
      quranicVerseDetails: {
        surahName: lang === 'fr' ? "Sourate Al-Baqarah (2:189)" : lang === 'ha' ? "Suratul Baqarah (2:189)" : "Surah Al-Baqarah (2:189)",
        verseNumber: "2:189",
        arabicText: "يَسْأَلُونَكَ عَنِ الْأَهِلَّةِ ۖ قُلْ هِيَ مَوَاقِيتُ لِلنَّاسِ وَالْحَجِّ",
        phonetic: "Yas'alunaka 'anil-ahillati qul hiya mawaqitu lin-nasi wal-hajj...",
        translation: lang === 'fr' ? "Ils t'interrogent sur les croissants de lune. Dis : 'Ce sont des repères temporels pour les hommes et pour le pèlerinage.'" : lang === 'ha' ? "Suna tambayarka game da jinjirin wata. Ka ce: 'Su abubuwan auna lokaci ne ga mutane da aikin Hajj.'" : "They ask you about the crescent moons. Say, 'They are measurements of time for the people and for Hajj.'",
        spiritualBenefit: lang === 'fr' ? "Accorde la bénédiction du temps, l'organisation spirituelle de la vie et la clarté dans la prise de décision." : lang === 'ha' ? "Yana kawo albarkar lokaci, tsara al'amuran yau da kullum da hasken hankali." : "Grants time blessing, spiritual life organization, and clarity in decision making."
      },
      sacredPlantsDetails: {
        plantName: lang === 'fr' ? "Jasmin d'Arabie & Benjoin Blanc (Styrax)" : lang === 'ha' ? "Jasmin da Benjoin Blanc" : "Arabian Jasmine & White Benzoin",
        botanicalName: "Jasminum sambac / Styrax benzoin",
        element: lang === 'fr' ? "Air & Feu Subtil" : lang === 'ha' ? "Iska da Haske" : "Air & Subtle Fire",
        spiritualProperties: lang === 'fr' ? "Élévation de la fréquence vibratoire de la pensée, éveil de l'intuition et attraction des pensées de lumière." : lang === 'ha' ? "Daukaka tunani mai kyau, buɗe hikima da jawo albarkar sama." : "Elevates thought vibrational frequency, awakens intuition, and attracts luminous inspirations.",
        usageMethod: lang === 'fr' ? "Diffusion d'encens au coucher du soleil à l'apparition du premier croissant ou infusion légère de fleurs de Jasmin." : lang === 'ha' ? "Kona turare da yamma yayin bayyanar wata ko shan shayin furen Jasmin." : "Diffuse as incense at sunset when the crescent rises, or sip light Jasmine tea.",
        binauralFreq: 528,
        frequencyName: lang === 'fr' ? "528 Hz - Clarté Mentale & Fréquence des Miracles" : "528 Hz - Miracle Frequency & Mental Clarity",
        essentialOils: lang === 'fr' ? "Huile Essentielle de Jasmin, Styrax Blanc & Néroli" : "Jasmine, White Benzoin & Neroli Essential Oil"
      },
      protectiveVerseDetails: {
        surahName: lang === 'fr' ? "Ayat Al-Kursi - Sourate Al-Baqarah (2:255)" : lang === 'ha' ? "Ayatul Kursiyyu (2:255)" : "Ayat Al-Kursi (2:255) - The Throne Verse",
        verseNumber: "2:255",
        arabicText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
        phonetic: "Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta'khudhuhu sinatuw-wa la nawm...",
        translation: lang === 'fr' ? "Allah ! Point de divinité à part Lui, Le Vivant, Celui qui subsiste par Lui-même. Ni l'assoupissement ni le sommeil n'ont de prise sur Lui..." : lang === 'ha' ? "Allah babu wani abin bautawa da gaskiya sai Shi, Mai Rayuwa, Mai tsayuwa da Kansa..." : "Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep...",
        protectivePower: lang === 'fr' ? "Le plus grand bouclier coranique erigeant un dôme d'invulnérabilité céleste autour du corps, de l'âme et du foyer." : lang === 'ha' ? "Mafi girman ayar tsaro a cikin Al-Qur'ani mai tsarki, tana korar shaidan da dukan duhu." : "The supreme protective Quranic verse establishing a fortress of divine light around mind and home."
      }
    };
  } else if (hDay >= 7 && hDay <= 9) {
    return {
      name: lang === 'fr' ? "Premier Quartier (Al-Tarbî' Al-Awwal)" : lang === 'ha' ? "Rabin Wata na Farko (Al-Tarbî' Al-Awwal)" : "First Quarter (Al-Tarbî' Al-Awwal)",
      arabicName: "التربيع الأول",
      manzil: lang === 'fr' ? "Al-Dabaran & Al-Haq'ah (الدَّبَرَان / الهَقْعَة – Demeures de l'Ancrage et de la Fermeté)" : lang === 'ha' ? "Al-Dabaran da Al-Haq'ah (الدَّبَرَان)" : "Al-Dabaran & Al-Haq'ah (الدَّبَرَان)",
      energy: lang === 'fr' ? "Équilibre Céleste, Unification des Opposés, Force de Volonté (Qudrah) et Ancrage"
            : lang === 'ha' ? "Daidaituwa, zaman lafiya, karfin zuciya da kiyaye ginshiƙi"
            : "Celestial equilibrium, unification of opposites, spiritual willpower (Qudrah), and grounding",
      mysticMeaning: lang === 'fr' ? "Séparé exactement en deux moitiés égales de lumière et d'ombre, le Premier Quartier incarne la géométrie sacrée de l'Équilibre Universel (Al-Mizan). Il enseigne le point de jonction entre le monde visible (Mulk) et le monde invisible (Malakut), la Crainte (Khawf) et l'Espérance (Raja'). C'est l'étape de la maturité où l'intention se transforme en action concrète."
                   : lang === 'ha' ? "Wata yana rabi a bude rabi a rufe. Yana wakiltar daidaituwa tsakanin Abin da ke bayyane (Mulk) da na Boye (Malakut), da tsoro da kaunar Allah. Lokaci ne na gaske na mayar da niyya zuwa aiki."
                   : "Split precisely into equal halves of light and shadow, the First Quarter embodies the sacred geometry of Universal Balance (Al-Mizan). It marks the junction between the seen world (Mulk) and unseen world (Malakut), reverent fear (Khawf) and loving hope (Raja').",
      recommendedPractice: lang === 'fr' ? "Réciter la Sourate Yasin à midi ou au zénith solaire en portant une attention profonde aux versets cosmiques. Pratiquer le Zikr d'ancrage en position assise fermement sur le sol, les mains sur les genoux, en répétant la formule d'alignement avec une respiration ventrale lente."
                         : lang === 'ha' ? "Karanta Suratul Yasin a tsakiyar rana kana mayar da hankali kan ayoyin da ke bayyana tsarin samaniya. Ka yi tunanin samun zaman lafiya da karfin zuciya."
                         : "Recite Surah Yasin at solar noon focusing on cosmic verses. Practice grounding Zikr seated firmly, hands on knees, repeating alignment formulas with rhythmic breathing.",
      vibration: lang === 'fr' ? "Alignement des sphères, souveraineté de l'esprit et fermeté décisionnelle" : lang === 'ha' ? "Daidaita duniya da juriya a cikin aiki" : "Sphere alignment, spiritual sovereignty, and decisive firmness",
      spiritualSecret: lang === 'fr' ? "Cette phase révèle le mystère de la Voie Médiane (As-Sirat al-Mustaqim). C'est le secret de la fermeté de l'âme qui refuse de basculer dans les excès de l'orgueil ou de la désespérance. Le cœur s'y stabilise comme la montagne sur la Terre, prêt à faire face à toutes les épreuves terrestres avec une sérénité inébranlable."
                     : lang === 'ha' ? "Wannan lokacin yana bayyana sirrin Hanya Madaidaciya (Siratal Mustaqim). Lokaci ne mai kyau don sarrafa son zuciya da tabbatar da zaman lafiya mai dorewa."
                     : "This phase unveils the mystery of the Straight Path (As-Sirat al-Mustaqim). It grants spiritual stability, anchoring the heart like a mountain on Earth against vanity and despair.",
      astronomicalInfo: lang === 'fr' ? "L'élongation quadrature est exactement de 90°. La Lune culmine au méridien sud au moment où le Soleil se couche. Sa moitié occidentale est baignée de lumière solaire directe, offrant un contraste saisissant sur la ligne du discriminateur (terminateur)."
                      : lang === 'ha' ? "Wata ya cika kwata daya na zagayensa. Daidai kusurwar digiri 90. Rabinsa na dama ne ke da haske me kyan gani."
                      : "Quadrature elongation is precisely 90°. The Moon culminates at the southern meridian as the Sun sets, its western hemisphere bathed in direct sunlight along the terminator line.",
      recommendedAsma: lang === 'fr' ? ["يَا عَدْلُ (Ya 'Adl - L'Équité Incarnée - 104)", "يَا قَوِيُّ (Ya Qawiyy - Le Fort Inébranlable - 117)", "يَا مُقْسِطُ (Ya Muqsit - Le Juste Parfait - 209)", "يَا مَتِينُ (Ya Matin - Le Solide Inflexible - 500)"]
                     : lang === 'ha' ? ["يَا عَدْلُ (Ya 'Adl - Mai Adalci)", "يَا قَوِيُّ (Ya Qawiyy - Mai Karfi)", "يَا مُقْسِطُ (Ya Muqsit - Mai Raba Gaskiya)", "يَا مَتِينُ (Ya Matin - Mai Tabbata)"]
                     : ["يَا عَدْلُ (Ya 'Adl - O Just)", "يَا قَوِيُّ (Ya Qawiyy - O Strong)", "يَا مُقْسِطُ (Ya Muqsit - O Equitable)", "يَا مَتِينُ (Ya Matin - O Firm)"],
      spiritualKey: lang === 'fr' ? "La clé réside dans l'intégration de la puissance et de la miséricorde : être fort sans dureté et doux sans faiblesse."
                  : lang === 'ha' ? "Mabudin yana cikin hada ilimin fili da na boye guri guda."
                  : "The key lies in combining strength with mercy: firm without hardness and gentle without weakness.",
      wirdDetails: {
        title: lang === 'fr' ? "Wird de la Force Spirituelle & de la Stabilité (Ya Qawîyy)" : "Wird of Spiritual Strength & Stability (Ya Qawiyy)",
        formula: "Yâ Qawiyyu Yâ Matînu, Thabbit Qalbî 'alâ Dînik wa 'alâ Tâ'atik",
        count: 117,
        description: lang === 'fr' ? "À réciter au zénith ou au milieu de la journée pour fortifier la volonté, vaincre la léthargie spirituelle et repousser les attaques psychiques." : "Recite at solar noon to solidify inner willpower, overcome spiritual lethargy, and ward off psychic disturbances."
      },
      talsamDetails: {
        formula: "عَدْلٌ قَوِيٌّ (عَ-دْ-لٌ / قَ-وِ-يٌّ) - ١٠٤ / ١١٧",
        graphicSymbol: "┌─────────┐\n│ ⚖️  𐎄  ⚖️ │\n│ 𐎍  𐎓  𐎊 │\n│ ⚖️  𐎖  ⚖️ │\n└─────────┘",
        spiritualUtility: lang === 'fr' ? "Bouclier de justice divine, équilibre émotionnel absolu et protection contre la tyrannie" : "Shield of divine justice, emotional balance, and protection against tyranny",
        description: lang === 'fr' ? "Ce talsam d'Équilibre souverain unit le chiffre d'Adl (104) et de Qawiyy (117) dans la grille céleste du Mizan. Il neutralise les déséquilibres énergétiques et protège le pratiquant contre l'injustice." : "This talisman of Sovereign Balance unites the numerical values of 'Adl (104) and Qawiyy (117) within the celestial grid of Al-Mizan, shielding against inequity and harmonizing the aura."
      },
      quranicVerseDetails: {
        surahName: lang === 'fr' ? "Sourate Ar-Rahman (55:7-9)" : lang === 'ha' ? "Suratul Rahman (55:7-9)" : "Surah Ar-Rahman (55:7-9)",
        verseNumber: "55:7-9",
        arabicText: "وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ ۞ أَلَّا تَطْغَوْا فِي الْمِيزَانِ ۞ وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ",
        phonetic: "Was-sama'a rafa'aha wa wada'al-mizan...",
        translation: lang === 'fr' ? "Et quant au ciel, Il l'a élevé et Il a établi la Balance, afin que vous ne transgressiez pas dans la pesée. Et observez l'équité sans fausser la balance." : lang === 'ha' ? "Kuma samaniya Ya ɗaukaka ta kuma Ya ajiye Sikelin Adalci (Mizan)..." : "And the heaven He raised and imposed the balance, that you not transgress within the balance.",
        spiritualBenefit: lang === 'fr' ? "Harmonise les pôles énergétiques du corps et de l'esprit, protège contre les excès émotionnels et apporte la justice dans les affaires." : lang === 'ha' ? "Daidaita makamashin jiki da rai, kare mutum daga gaggawa da keta adalci." : "Harmonizes physical and subtle energy poles, protects against emotional extremes, and establishes equity."
      },
      sacredPlantsDetails: {
        plantName: lang === 'fr' ? "Cèdre de l'Atlas & Camphre Doux" : lang === 'ha' ? "Cèdre da Camphre" : "Atlas Cedarwood & Sweet Camphor",
        botanicalName: "Cedrus atlantica / Cinnamomum camphora",
        element: lang === 'fr' ? "Terre & Eau Harmonisée" : lang === 'ha' ? "Ƙasa da Ruwa" : "Earth & Harmonized Water",
        spiritualProperties: lang === 'fr' ? "Ancrage, purification de l'atmosphère des énergies stagnantes et renforcement de la colonne vertébrale spirituelle." : lang === 'ha' ? "Ginin juriya, tsarkake iskar daki da karfafa baya da ginshiki." : "Grounding, static energy cleansing, and reinforcement of spiritual resilience.",
        usageMethod: lang === 'fr' ? "Brûler des morceaux de bois de cèdre avec une pincée de camphre pur au zénith solaire." : lang === 'ha' ? "Kona Cèdre tare da Camphre a tsakiyar rana." : "Burn cedar wood chips with a pinch of natural camphor at solar noon.",
        binauralFreq: 639,
        frequencyName: lang === 'fr' ? "639 Hz - Harmonie Relationnelle & Équilibre Énergétique" : "639 Hz - Relational Harmony & Energy Balance",
        essentialOils: lang === 'fr' ? "Huile Essentielle de Cèdre de l'Atlas & Camphre Naturel" : "Atlas Cedarwood & Natural Camphor Oil"
      },
      protectiveVerseDetails: {
        surahName: lang === 'fr' ? "Sourate Yasin (36:9) - Voile de Protection" : lang === 'ha' ? "Suratul Yasin (36:9)" : "Surah Yasin (36:9) - Shield of Invisibility",
        verseNumber: "36:9",
        arabicText: "وَجَعَلْنَا مِن بَيْنِ أَيْدِيهِمْ سُدًّا وَمِنْ خَلْفِهِمْ سُدًّا فَأَغْشَيْنَاهُمْ فَهُمْ لَا يُبْصِرُونَ",
        phonetic: "Wa ja'alna min bayni aydihim saddaw-wa min khalfihim saddan fa-aghshaynahum fahum la yubsirun.",
        translation: lang === 'fr' ? "Et Nous mettrons une barrière devant eux et une barrière derrière eux, Nous les recouvrirons d'un voile et ils ne verront rien." : lang === 'ha' ? "Kuma Muka sanya shamaki a gaba gare su da shamaki a baya gare su Muka rufe idanunsu su ba sa gani." : "And We have put before them a barrier and behind them a barrier and We have covered them, so they do not see.",
        protectivePower: lang === 'fr' ? "Érige un écran d'invisibilité et de neutralisation contre les regards malveillants, complots occultes et mauvaises langues." : lang === 'ha' ? "Shamakin Ubangiji mai aveugler makiya da kare mutum daga muggan makircin mutane da aljanu." : "Establishes a divine barrier blinding ill-intentioned adversaries and deflecting psychic attacks."
      }
    };
  } else if (hDay >= 10 && hDay <= 12) {
    return {
      name: lang === 'fr' ? "Lune Gibbeuse Croissante (Al-Ahdab Al-Mutazayid)" : lang === 'ha' ? "Wata Mai Karuwa (Al-Ahdab)" : "Waxing Gibbous (Al-Ahdab)",
      arabicName: "الأحدب المتزايد",
      manzil: lang === 'fr' ? "Al-Han'ah & Al-Dhira' (الهَنْعَة / الذِّرَاع – Demeures de l'Expansion et de la Réception)" : lang === 'ha' ? "Al-Han'ah da Al-Dhira' (الهَنْعَة)" : "Al-Han'ah & Al-Dhira' (الهَنْعَة)",
      energy: lang === 'fr' ? "Expansion de Conscience (Inshirah), Absorption des Hautes Vibrations, Abondance Mystique"
            : lang === 'ha' ? "Daukakar ruhaniya mai zurfi, yaɗuwar albarka da bude zuciya don karbar haske"
            : "Consciousness expansion (Inshirah), high-vibration absorption, mystical abundance",
      mysticMeaning: lang === 'fr' ? "Illuminée à plus de 80%, la Lune s'approche du faîte de sa majesté. Cette phase représente l'expansion de la poitrine spirituelle (Sharh al-Sadr). L'âme du croyant devient une coupe débordante qui accumule la rosée divine des secrets avant la grande nuit du dévoilement. C'est l'époque des grandes inspirations poétiques et métaphysiques."
                   : lang === 'ha' ? "Wata yana kusa da cika kashi 80-90. Karfi na gaibu yana kara bayyana. Zuciyar mai imani tana kara budewa don karbar sirrika da ilimi mai zurfi kafin cikakken wata."
                   : "Illuminated beyond 80%, the Moon approaches peak majesty. This phase symbolizes spiritual chest expansion (Sharh al-Sadr), where the heart becomes an overflowing chalice accumulating divine dew before total unveiling.",
      recommendedPractice: lang === 'fr' ? "Consacrer le tiers médian de la nuit à la contemplation méditative (Tafakkur). S'installer sous la voûte céleste si possible, réciter la Sourate Al-Inshirah 33 fois, et solliciter l'ouverture des horizons de la connaissance spirituelle et matérielle."
                         : lang === 'ha' ? "Kebe kashi na biyu na dare don yin tunani (Tafakkur) a kan halittun Ubangiji. Rubuta abubuwan da ka fahimta sannan ka roki daukaka ga daukacin bil'adama."
                         : "Dedicate the middle third of the night to contemplative Tafakkur under the sky. Recite Surah Al-Inshirah 33 times, invoking expansion of wisdom and material abundance.",
      vibration: lang === 'fr' ? "Expansion du réceptacle spirituel et magnétisme des bénédictions" : lang === 'ha' ? "Neman daukaka da cikar buri na ruhaniya" : "Spiritual vessel expansion and blessing magnetism",
      spiritualSecret: lang === 'fr' ? "Le secret de l'Ahdab réside dans la préparation du réceptacle (Al-Qabil) : de même que l'orfèvre affine le métal précieux avant d'y graver le sceau royal, le Salik polit son cœur par le Zikr ininterrompu afin de pouvoir contenir le flot de lumière intense de la Pleine Lune."
                     : lang === 'ha' ? "Sirrin boye na wannan lokacin shi ne shiryawa: rai yana tsarkake kansa kamar madubi domin ya shirya karbar cikakken hasken Cikakken Wata (Badr)."
                     : "The esoteric secret of Ahdab lies in vessel preparation (Al-Qabil). Just as a goldsmith polishes precious metal before stamping a royal seal, the seeker polishes the heart through unbroken Zikr.",
      astronomicalInfo: lang === 'fr' ? "Élongation entre 90° et 135°. La Lune se lève en début ou milieu d'après-midi et demeure visible la majeure partie de la nuit. Sa face illuminée dépasse le demi-disque pour former une ellipse gibbeuse étincelante."
                      : lang === 'ha' ? "Kusan dukkan fuskarsa tana da haske banda wani siririn bangare. Yana fitowa da yamma ya dade a sama kusan duka daren."
                      : "Elongation ranges from 90° to 135°. The Moon rises in early afternoon and dominates the night sky, its illuminated surface forming a shimmering gibbous ellipse.",
      recommendedAsma: lang === 'fr' ? ["يَا وَاسِعُ (Ya Wasi' - L'Immense - 137)", "يَا لَطِيفُ (Ya Latif - Le Subtil Bienveillant - 129)", "يَا جَمِيلُ (Ya Jamil - Le Parfaitement Beau - 83)", "يَا كَبِيرُ (Ya Kabir - Le Grand par Essence - 232)"]
                     : lang === 'ha' ? ["يَا وَاسِعُ (Ya Wasi' - Mai Yalwa)", "يَا لَطِيفُ (Ya Latif - Mai Sauki da Tausayi)", "يَا جَمِيلُ (Ya Jamil - Mai Kyau)", "يَا كَبِيرُ (Ya Kabir - Mai Girma)"]
                     : ["يَا وَاسِعُ (Ya Wasi' - O All-Embracing)", "يَا لَطِيفُ (Ya Latif - O Subtle)", "يَا جَمِيلُ (Ya Jamil - O Beautiful)", "يَا كَبِيرُ (Ya Kabir - O Great)"],
      spiritualKey: lang === 'fr' ? "La clé est la noble ambition spirituelle (Himmah 'Aliyyah) : viser les sommets de la proximité divine sans s'arrêter aux distractions du chemin."
                  : lang === 'ha' ? "Mabudin shi ne himma mai karfi (Himmah) don samun kusanci mai tsarki."
                  : "The key is high spiritual ambition (Himmah 'Aliyyah): striving for divine proximity without getting delayed by worldly stops.",
      wirdDetails: {
        title: lang === 'fr' ? "Wird du Secret de la Douceur Subtile (Ya Latîf)" : "Wird of Subtle Grace (Ya Latif)",
        formula: "Yâ Wâsi'u Yâ Latîfu Yâ Jamîl, Alti'f bî fî qadâ'ika wa jammil ahwâlî",
        count: 129,
        description: lang === 'fr' ? "À réciter au moment du coucher du soleil (Maghrib). Fréquence vibratoire suprême pour dissoudre les obstacles insurmontables et attirer la grâce divine douce." : "Recite at sunset (Maghrib). Supreme vibrational frequency to dissolve insurmountable hurdles and attract gentle divine grace."
      },
      talsamDetails: {
        formula: "لَطِيفٌ (لَ-طِ-ي-فٌ / Laṭīf) - ١٢٩",
        graphicSymbol: "┌──────────────────────┐\n│  ل (30)  │  ط (9)    │\n├──────────────────────┤\n│  ي (10)  │  ف (80)   │\n└──────────────────────┘",
        spiritualUtility: lang === 'fr' ? "Ouverture des vannes d'abondance financière, sérénité de l'esprit et résolution pacifique des conflits" : "Financial abundance flow, mental serenity, and peaceful conflict resolution",
        description: lang === 'fr' ? "Le talsam quadratique de Latif réorganise la structure élémentaire (Feu, Air, Eau, Terre) selon la valeur numérique 129. Il diffuse un champ de paix irrésistible autour de son porteur." : "The quadratic talisman of Latif structures elemental energies according to the 129 Abjad frequency, radiating an aura of harmony and providence."
      },
      quranicVerseDetails: {
        surahName: lang === 'fr' ? "Sourate Al-Hajj (22:63)" : lang === 'ha' ? "Suratul Hajj (22:63)" : "Surah Al-Hajj (22:63)",
        verseNumber: "22:63",
        arabicText: "أَلَمْ تَرَ أَنَّ اللَّهَ أَنزَلَ مِنَ السَّمَاءِ مَاءً فَتُصْبِحُ الْأَرْضُ مُخْضَرَّةً ۗ إِنَّ اللَّهَ لَطِيفٌ خَبِيرٌ",
        phonetic: "Alam tara annallaha anzala minas-sama'i ma'an fatusbihul-ardu mukhdarratan innallaha latifun khabir...",
        translation: lang === 'fr' ? "Ne vois-tu pas qu'Allah fait descendre du ciel une eau, et la terre devient alors verte ? Certes, Allah est Doux, Subtil et Parfaitement Connaisseur." : lang === 'ha' ? "Shin ba ka gani ba cewa Allah yana saukar da ruwa daga sama sai ƙasa ta zama koraye? Lalle Allah Mai tausayi ne kuma Masani." : "Do you not see that Allah has sent down rain from the sky and the earth becomes green? Indeed, Allah is Subtle and Acquainted.",
        spiritualBenefit: lang === 'fr' ? "Invoque la prospérité vivifiante, débloque la subsistance financière et adoucit les cœurs endurcis." : lang === 'ha' ? "Neman albarkar arzikin halal, buɗe hanyoyin kasuwanci da tausasa zuciya." : "Invokes revitalizing prosperity, opens financial livelihoods, and softens hardened hearts."
      },
      sacredPlantsDetails: {
        plantName: lang === 'fr' ? "Santal Blanc & Rose de Damas" : lang === 'ha' ? "Santal da Rose na Damas" : "White Sandalwood & Damask Rose",
        botanicalName: "Santalum album / Rosa damascena",
        element: lang === 'fr' ? "Eau Douce & Vénusienne" : lang === 'ha' ? "Ruwa da Tausayi" : "Fresh Water & Heart Energy",
        spiritualProperties: lang === 'fr' ? "Apaisement du système nerveux, ouverture du chakra du cœur (Qalb) et magnétisme affectif pur." : lang === 'ha' ? "Kwanatar da hankali, buɗe zuciya zuwa ga kauna da jawo zaman lafiya." : "Calms the nervous system, opens the heart center (Qalb), and radiates pure affectionate magnetism.",
        usageMethod: lang === 'fr' ? "Onction d'eau de rose sacrée infusée au santal sur le visage et le cœur avant la méditation du coucher du soleil." : lang === 'ha' ? "Shafa ruwan rose da santal a fuska da kirji kafin addu'ar yamma." : "Apply sandalwood-infused sacred rosewater onto face and chest before sunset contemplation.",
        binauralFreq: 741,
        frequencyName: lang === 'fr' ? "741 Hz - Nettoyage Énergétique & Intuition Profonde" : "741 Hz - Intuition & Emotional Detox",
        essentialOils: lang === 'fr' ? "Huile Essentielle de Santal Blanc & Extrait de Rose de Damas" : "White Sandalwood & Damask Rose Oil"
      },
      protectiveVerseDetails: {
        surahName: lang === 'fr' ? "Sourate Al-Falaq (113:1-5) - L'Aube Naissante" : lang === 'ha' ? "Suratul Falaq (113:1-5)" : "Surah Al-Falaq (113:1-5) - The Daybreak",
        verseNumber: "113:1-5",
        arabicText: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِن شَرِّ مَا خَلَقَ ۞ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        phonetic: "Qul a'udhu bi Rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab...",
        translation: lang === 'fr' ? "Dis : 'Je cherche protection auprès du Seigneur de l'aube naissante, contre le mal des êtres qu'Il a créés, contre le mal de l'obscurité quand elle s'approfondit...'" : lang === 'ha' ? "Ka ce: 'Na tsara da Ubangijin safiya, daga evil abin da Ya halitta...'" : "Say, 'I seek refuge in the Lord of daybreak from the evil of that which He created and from the evil of darkness when it settles...'",
        protectivePower: lang === 'fr' ? "Dissolution instantanée des nœuds de sorcellerie, neutralisation du mauvais œil et rejet de la jalousie destructrice." : lang === 'ha' ? "Tatsar dukkan maita, hassada, da kangarun mutane ko aljanu." : "Instant dissolution of knot sorcery, evil eye neutralization, and defense against destructive envy."
      }
    };
  } else if (hDay >= 13 && hDay <= 15) {
    return {
      name: lang === 'fr' ? "Pleine Lune Sacrée (Al-Badr Al-Kamil)" : lang === 'ha' ? "Cikakken Wata (Al-Badr Al-Kamil)" : "Sacred Full Moon (Al-Badr Al-Kamil)",
      arabicName: "البدر الكامل",
      manzil: lang === 'fr' ? "Al-Nathrah & Al-Tarf (النَّثْرَة / الطَّرْف – Demeures du Couronnement Céleste et de la Lumière Pure)" : lang === 'ha' ? "Al-Nathrah da Al-Tarf (النَّثْرَة)" : "Al-Nathrah & Al-Tarf (النَّثْرَة)",
      energy: lang === 'fr' ? "Plénitude Absolue, Illumination Intégrale, Dévoilement des Secrets (Kashf) et Baraka Maximum"
            : lang === 'ha' ? "Cikakkiyar yalwar haske, kwararar albarka, da buɗe asirin gaibu (Kashf)"
            : "Absolute fullness, total illumination, veil lifting (Kashf), and maximum divine blessing",
      mysticMeaning: lang === 'fr' ? "Le Badr est l'apogée cosmique du mois. Le miroir lunaire est en face exacte de la source solaire, réfléchissant sa lumière sans le moindre voile ni ombre. C'est le symbole de l'Homme Parfait (Al-Insan al-Kamil) dont le cœur reflète intégralement la Lumière Muhammadienne et les attributs divins. C'est la nuit où les cieux s'ouvrent pour exaucer les douas."
                   : lang === 'ha' ? "Wannan ne kololuwar ruhaniya na wata baki daya. Wata yana haskaka hasken rana baki daya ba tare da wani labule ba, yana nuna tsarkake zuciya da ke bayyana hasken Ubangiji da amsa addu'o'i."
                   : "Al-Badr is the cosmic peak of the month. The lunar mirror directly faces the solar source, reflecting unblemished illumination. It symbolizes the Perfect Soul (Al-Insan al-Kamil) whose heart reflects divine lights.",
      recommendedPractice: lang === 'fr' ? "Jeûner les 3 Jours Blancs (13, 14, 15 de chaque mois hijri). Veiller la nuit du Badr en accomplissant le Qiyam al-Layl, réciter la Sourate Al-Nur et effectuer 1000 fois la formule du Nom Suprême en méditant sur la splendeur infinie du Créateur."
                         : lang === 'ha' ? "Azumci ranakun fararen kwanaki guda uku (13, 14, 15), ka yi sallolin dare (Kiyamu-laili) a karkashin hasken wata, sannan ka karanta Ismul A'zam kafa 1000."
                         : "Fast the 3 White Days (13, 14, 15 Hijri). Observe Qiyam al-Layl during Badr nights, recite Surah Al-Nur, and chant the Supreme Name 1000 times in deep meditation.",
      vibration: lang === 'fr' ? "Fréquence d'illumination totale, de charisme céleste et de communion directe" : lang === 'ha' ? "Cikakken haske da yaye dukkan labule na sama" : "Total illumination frequency, celestial charisma, and direct communion",
      spiritualSecret: lang === 'fr' ? "Le secret ésotérique du Badr est le Dévoilement (Kashf al-Ghita'). Dans la plénitude de la lumière lunaire, les voiles séparant le monde physique du monde céleste (Malakut) deviennent transparents. Les prières élevées cette nuit traversent les sphères célestes avec la vitesse de l'éclair."
                     : lang === 'ha' ? "Sirrin boye na Badr shi ne bude gaibu (Kashf): a cikin wadannan darare masu albarka, alaka tsakanin duniyar zahiri da ta ruhaniya (Malakut) tana kasancewa cikin sauki ga dukkan mai tsarkakkiyar zuciya."
                     : "The esoteric secret of Badr is Unveiling (Kashf al-Ghita'). Under the full lunar glow, veils separating physical reality from the realm of light (Malakut) thin down, granting swift supplication ascension.",
      astronomicalInfo: lang === 'fr' ? "Opposition astronomique exacte (180° d'élongation). La Lune se lève précisément au coucher du Soleil et se couche au lever du jour. Son albédo brille à 100% de sa capacité, éclairant la Terre d'une douce lueur argentée toute la nuit."
                      : lang === 'ha' ? "Wata yana daidai kishiyar Rana ta yadda haskenta yake mamaye fuskarsa baki daya (180°). Yana fitowa idan rana ta fadi, ya bace idan gari ya waye."
                      : "Exact astronomical opposition (180° elongation). The Moon rises precisely as the Sun sets and sets as dawn arrives, its albedo shining at 100% capacity throughout the entire night.",
      recommendedAsma: lang === 'fr' ? ["يَا اللَّهُ (Ya Allah - Le Nom Suprême Unifié - 66)", "يَا قُدُّوسُ (Ya Quddus - L'Infiniment Saint - 170)", "يَا جَامِعُ (Ya Jami' - Le Rassembleur - 114)", "يَا نُورُ (Ya Nur - La Source de Lumière - 256)"]
                     : lang === 'ha' ? ["يَا اللَّهُ (Ya Allah)", "يَا قُدُّوسُ (Ya Quddus - Mai Tsarki)", "يَا جَامِعُ (Ya Jami' - Mai Tarawa)", "يَا نُورُ (Ya Nur - Haske)"]
                     : ["يَا اللَّهُ (Ya Allah)", "يَا قُدُّوسُ (Ya Quddus - O Holy)", "يَا جَامِعُ (Ya Jami' - O Gatherer)", "يَا نُورُ (Ya Nur - O Light)"],
      spiritualKey: lang === 'fr' ? "La clé est la contemplation muette (Mushahadah) : s'effacer totalement dans l'observation de la beauté divine jusqu'à ce qu'il ne reste que Lui."
                  : lang === 'ha' ? "Mabudin shi ne kiyaye shiru da bautar Ubangiji cikin natsuwa (Mushahadah)."
                  : "The key is silent contemplation (Mushahadah): self-effacement in witnessing divine majesty.",
      wirdDetails: {
        title: lang === 'fr' ? "Wird du Badr Suprême & de la Réalisation (Ya Allâh)" : "Wird of Supreme Badr & Realization (Ya Allah)",
        formula: "Yâ Allâhu Yâ Quddûsu Yâ Jâmi', Ijma' baynî wa bayna murâdî",
        count: 1000,
        description: lang === 'fr' ? "À réciter au milieu de la nuit sous la lumière directe de la Pleine Lune. Puissance inégalée pour concrétiser les prières les plus chères et accéder à l'éveil céleste." : "Recite at midnight directly under moonlight. Unrivaled spiritual potency for manifesting noble prayers and spiritual awakening."
      },
      talsamDetails: {
        formula: "خَاتَمُ الْبЕДْرِ (خَ-ا-تَ-مُ / الْ-بَ-دْ-رِ) - ١٦٦",
        graphicSymbol: "      ☆  هـ  ☆      \n  و   ┌─────┐   م   \n      │ 166 │      \n  د   └─────┘   ك   \n      ☆  ج  ☆      ",
        spiritualUtility: lang === 'fr' ? "Magnétisme spirituel irrésistible, charisme prophétique, protection absolue contre le mal et illumination de l'âme" : "Spiritual magnetism, prophetic charisma, protection against negativity, and soul illumination",
        description: lang === 'fr' ? "Le Grand Sceau du Badr est gravé au centre du talisman de 166 (valeur numérique associée à la réalisation parfaite). Il enveloppe l'âme d'un manteau de lumière impénétrable par les forces sombres." : "The Great Badr Seal is centered around the 166 numerical frequency, wrapping the bearer's aura in a mantle of light impermeable to darkness."
      },
      quranicVerseDetails: {
        surahName: lang === 'fr' ? "Sourate An-Nur (24:35)" : lang === 'ha' ? "Suratul Nur (24:35)" : "Surah An-Nur (24:35)",
        verseNumber: "24:35",
        arabicText: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ ۚ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ ۖ الْمِصْبَاحُ فِي زُجَاجَةٍ ۖ الزُّجَاجَةُ كَأَنَّهَا كَوْكَبٌ دُرِّيٌّ",
        phonetic: "Allahu nurus-samawati wal-ard. Mathalu nurihi kamishkatin fiha misbah...",
        translation: lang === 'fr' ? "Allah est la Lumière des cieux et de la terre ! Sa lumière est semblable à une niche où se trouve une lampe..." : lang === 'ha' ? "Allah Shi ne Hasken sammai da ƙasa! Misalin Haskensa kamar wata ƙabila ce da ke da fitila..." : "Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp...",
        spiritualBenefit: lang === 'fr' ? "Dévoilement des secrets mystiques (Kashf), illumination de l'âme et protection intégrale contre les ténèbres." : lang === 'ha' ? "Buɗe asirin gaibu, illumination na ruhaniyya da kare dukan jiki daga duhu." : "Unveiling of mystical secrets (Kashf), illumination of the soul, and total protection against darkness."
      },
      sacredPlantsDetails: {
        plantName: lang === 'fr' ? "Ambre Gris Céleste & Encens Mâle d'Oman (Luban Dhakar)" : lang === 'ha' ? "Ambre da Luban Dhakar na Makkah" : "Celestial Ambergris & Omani Male Frankincense (Luban Dhakar)",
        botanicalName: "Ambergris / Boswellia sacra",
        element: lang === 'fr' ? "Éther Suprême & Feu Céleste" : lang === 'ha' ? "Ether da Haske na Sama" : "Supreme Ether & Celestial Fire",
        spiritualProperties: lang === 'fr' ? "Consécration suprême des invocations, expansion de l'aura jusqu'à son niveau maximal et purification angélique." : lang === 'ha' ? "Cikakkiyar daukaka addu'o'i, faɗaɗa aura zuwa kolshewa da halartar mala'iku." : "Supreme consecration of prayers, maximum aura expansion, and angelic cleansing.",
        usageMethod: lang === 'fr' ? "Fumigation généreuse de Luban Dhakar sous la lumière directe de la Pleine Lune lors des prières nocturnes." : lang === 'ha' ? "Kona Luban Dhakar mai yawa a karkashin hasken cikakken wata yayin sallan dare." : "Generous fumigation of Luban Dhakar under direct moonlight during night prayers.",
        binauralFreq: 852,
        frequencyName: lang === 'fr' ? "852 Hz - Fréquence Angélique & Éveil du Troisième Œil" : "852 Hz - Angelic Awakening & Intuitive Clarity",
        essentialOils: lang === 'fr' ? "Résine Pure de Luban Dhakar, Ambre Gris & Musc Blanc" : "Pure Luban Dhakar Resin, Ambergris & White Musk"
      },
      protectiveVerseDetails: {
        surahName: lang === 'fr' ? "Sourate An-Nas (114:1-6) - Les Hommes" : lang === 'ha' ? "Suratul Nas (114:1-6)" : "Surah An-Nas (114:1-6) - Mankind",
        verseNumber: "114:1-6",
        arabicText: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَٰهِ النَّاسِ ۞ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ",
        phonetic: "Qul a'udhu bi Rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas...",
        translation: lang === 'fr' ? "Dis : 'Je cherche protection auprès du Seigneur des hommes, Le Souverain des hommes, Le Dieu des hommes, contre le mal du mauvais conseiller furtif...'" : lang === 'ha' ? "Ka ce: 'Na tsara da Ubangijin mutane, Sarkin mutane, Abin bautar mutane...'" : "Say, 'I seek refuge in the Lord of mankind, The Sovereign of mankind, The God of mankind, From the evil of the retreating whisperer...'",
        protectivePower: lang === 'fr' ? "Protection absolue contre les suggestions diaboliques (Waswas), doutes obsessionnels et entités psychiques furtives." : lang === 'ha' ? "Kariya daga waswasi na shaidan, tsoro mara dalili da cutar aljanu." : "Absolute shield against demonic whispers (Waswas), obsessive doubts, and stealth psychic entities."
      }
    };
  } else if (hDay >= 16 && hDay <= 18) {
    return {
      name: lang === 'fr' ? "Lune Gibbeuse Décroissante (Al-Ahdab Al-Mutanaqis)" : lang === 'ha' ? "Wata Mai Raguwa (Al-Ahdab Al-Mutanaqis)" : "Waning Gibbous (Al-Ahdab Al-Mutanaqis)",
      arabicName: "الأحدب المتناقص",
      manzil: lang === 'fr' ? "Al-Jabhah & Al-Zubrah (الجَبْهَة / الزُّبْرَة – Demeures de la Transmission et de la Sagesse)" : lang === 'ha' ? "Al-Jabhah da Al-Zubrah (الجَبْهَة)" : "Al-Jabhah & Al-Zubrah (الجَبْهَة)",
      energy: lang === 'fr' ? "Rayonnement de Sagesse, Transmission des Sciences (Ta'lim), Générosité Spirituelle (Infaq)"
            : lang === 'ha' ? "Yada sirrika, raba hikima, da kyauta domin Allah"
            : "Radiance of wisdom, science transmission (Ta'lim), spiritual generosity (Infaq)",
      mysticMeaning: lang === 'fr' ? "Après l'ivresse spirituelle du Badr, la lumière amorce son voyage de retour vers la source. Le serviteur illuminé ne garde pas cette grâce pour lui-même : il descend de sa montagne d'extase pour en faire bénéficier le monde. C'est la phase de l'enseignement, du partage de la sagesse et du service désintéressé envers les créatures."
                   : lang === 'ha' ? "Haske yana fara komawa ciki a hankali. Bayan samun haske a lokacin cikakken wata, rai mai hankali yana komawa cikin mutane domin yada hikima ta hanyar tausayi da taimako."
                   : "Following the spiritual climax of Badr, light initiates its journey home. The enlightened seeker descends to share wisdom with the world through selfless service and compassion.",
      recommendedPractice: lang === 'fr' ? "Offrir des aumônes secrètes (Sadaqah Khafiyyah) au lever du jour, visiter ou soutenir les personnes éprouvées, et réciter l'invocation de la Générosité Divine. Partager des paroles de réconfort et transmettre la science bénéfique."
                         : lang === 'ha' ? "Yar da sadaka ta boye, taimaka wa marasa lafiya ko masu bukata, sannan ka raba kalmomi na kwantar da hankali."
                         : "Offer secret charity (Sadaqah Khafiyyah) at daybreak, support those in need, and transmit comforting wisdom.",
      vibration: lang === 'fr' ? "Fréquence de la compassion universelle, du don utile et du service sacré (Khidmah)" : lang === 'ha' ? "Kyautar zuciya da tausayi ba tare da son kai ba" : "Universal compassion frequency, beneficial giving, and sacred service (Khidmah)",
      spiritualSecret: lang === 'fr' ? "Le secret de cette lune réside dans la Respiration Spirituelle (Al-Tanaffus al-Ruhani). Tout comme le corps inspire puis expire, l'âme qui a accumulé la lumière céleste doit maintenant l'exhaler sous forme de compassion, de charité et de conseils éclairés pour soulager l'humanité."
                     : lang === 'ha' ? "Wannan lokacin yana koya mana numfashin ruhaniya: bayan shakar hasken Ubangiji (lokacin karuwar wata), dole ne rai ya fitar da wannan haske ta hanyar yi wa halittu hidima (Al-Khidmah)."
                     : "The secret of this phase lies in Spiritual Respiration (Al-Tanaffus al-Ruhani). Having inhaled divine illumination, the soul must exhale compassion and counsel to uplift creation.",
      astronomicalInfo: lang === 'fr' ? "L'élongation diminue de 180° à 135°. La Lune se lève plus tard après la tombée de la nuit et reste haut dans le ciel au petit matin, offrant sa clarté argentée aux heures solitaires avant l'aube."
                      : lang === 'ha' ? "Hasken wata yana fara raguwa a hankali (180-135°). Yana fitowa a makare a cikin dare sannan yana kasancewa a sama har zuwa safiya."
                      : "Elongation diminishes from 180° to 135°. The Moon rises later into the night and remains prominent until morning, casting silver radiance during predawn hours.",
      recommendedAsma: lang === 'fr' ? ["يَا كَرِيمُ (Ya Karim - Le Généreux Inépuisable - 270)", "يَا رَؤُوفُ (Ya Ra'uf - Le Très-Bienveillant - 287)", "يَا نَافِعُ (Ya Nafi' - Le Dispensateur de Bien - 201)", "يَا وَهَّابُ (Ya Wahhab - Le Donateur Bénévole - 14)"]
                     : lang === 'ha' ? ["يَا كَرِيمُ (Ya Karim - Mai Kyauta)", "يَا رَؤُوفُ (Ya Ra'uf - Mai Tausayi)", "يَا نَافِعُ (Ya Nafi' - Mai Amfanarwa)", "يَا وَهَّابُ (Ya Wahhab - Mai Kyauta)"]
                     : ["يَا كَرِيمُ (Ya Karim - O Generous)", "يَا رَؤُوفُ (Ya Ra'uf - O Compassionate)", "يَا نَافِعُ (Ya Nafi' - O Beneficial)", "يَا وَهَّابُ (Ya Wahhab - O Bestower)"],
      spiritualKey: lang === 'fr' ? "La clé est le service désintéressé (Al-Khidmah) : devenir un canal par lequel la grâce divine s'écoule vers les nécessiteux."
                  : lang === 'ha' ? "Mabudin yana cikin yi wa bayi hidima domin son Ubangiji."
                  : "The key is selfless service (Al-Khidmah): becoming an open conduit through which divine grace flows.",
      wirdDetails: {
        title: lang === 'fr' ? "Wird de l'Émanation Généreuse & de la Baraka (Ya Karîm)" : "Wird of Generous Outpouring (Ya Karim)",
        formula: "Yâ Karîmu Yâ Ra'ûfu Yâ Nâfi', Anfa'nî bi-nûrika wa-ftah lî abwâba jûdik",
        count: 270,
        description: lang === 'fr' ? "À réciter au lever du jour juste après la prière du Subh pour féconder les affaires, élargir les voies de la subsistance bénie et répandre la baraka dans son foyer." : "Recite at dawn right after Subh prayer to bless endeavors, expand rightful livelihood, and infuse household harmony."
      },
      talsamDetails: {
        formula: "كَرِيمٌ نَافِعٌ (كـَ-رِ-ي-مٌ / نَ-ا-فِ-عٌ) - ٢٧٠ / ٢٠١",
        graphicSymbol: "┌──────────────────────┐\n│  ك (20)  │  ر (200)  │\n├──────────────────────┤\n│  ي (10)  │  م (40)   │\n└──────────────────────┘",
        spiritualUtility: lang === 'fr' ? "Prospérité financière licite, baraka professionnelle durable et attrait des opportunités bienveillantes" : "Rightful financial prosperity, professional baraka, and attracting benevolent opportunities",
        description: lang === 'fr' ? "Ce talsam scelle la combinaison théurgique des Noms Karim et Nafi' (valeurs 270 et 201). Il harmonise le fluide de la subsistance (Rizq) et protège les biens contre la ruine et l'envie." : "This talisman combines the 270 and 201 frequencies of Karim and Nafi', ordering the flow of sustenance (Rizq) and protecting earnings."
      },
      quranicVerseDetails: {
        surahName: lang === 'fr' ? "Sourate Ibrahim (14:7)" : lang === 'ha' ? "Suratul Ibrahim (14:7)" : "Surah Ibrahim (14:7)",
        verseNumber: "14:7",
        arabicText: "وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ",
        phonetic: "Wa idh ta'adhdhana rabbukum la'in shakartum la-azidannakum...",
        translation: lang === 'fr' ? "Et lorsque votre Seigneur proclama : 'Si vous êtes reconnaissants, Je multiplierai très certainement Mes bienfaits sur vous...'" : lang === 'ha' ? "Kuma lokacin da Ubangijinku Ya sanar cewa: 'Lallai idan kuka gode, lallai zan ƙara muku bienfaits...'" : "And when your Lord proclaimed, 'If you are grateful, I will surely increase you in favor...'",
        spiritualBenefit: lang === 'fr' ? "Multiplie les acquis spirituels et matériels, garantit la baraka dans la subsistance et éloigne la perte." : lang === 'ha' ? "Karuwar albarkatun samowa, kiyaye dukiya da lafiya mai dorewa." : "Multiplies spiritual and material gains, guarantees baraka in livelihood, and guards against loss."
      },
      sacredPlantsDetails: {
        plantName: lang === 'fr' ? "Cannelle de Ceylan & Romarin Officinal" : lang === 'ha' ? "Cannelle da Romarin" : "Ceylon Cinnamon & Rosemary",
        botanicalName: "Cinnamomum verum / Salvia rosmarinus",
        element: lang === 'fr' ? "Feu Solide & Terre Féconde" : lang === 'ha' ? "Wuta da Ƙasa mai albarka" : "Warm Fire & Fertile Earth",
        spiritualProperties: lang === 'fr' ? "Fixation des bénédictions, fortification de la mémoire et attraction de la prospérité constante." : lang === 'ha' ? "Tabbatar da albarka, ƙarfafa ƙwalwa da tunani, da jawo dukiya." : "Fixation of blessings, memory fortification, and attraction of steady prosperity.",
        usageMethod: lang === 'fr' ? "Brûler de l'écorce de cannelle broyée au lever du jour lors des invocations de gratitude." : lang === 'ha' ? "Kona kwasar Cannelle a hoshi yayin addu'ar godiya." : "Burn crushed cinnamon bark at daybreak during gratitude invocations.",
        binauralFreq: 639,
        frequencyName: lang === 'fr' ? "639 Hz - Ancrage des Bénédictions & Stabilité" : "639 Hz - Blessing Fixation & Stability",
        essentialOils: lang === 'fr' ? "Huile Essentielle de Cannelle, Romarin Officinal & Girofle" : "Cinnamon, Rosemary & Clove Essential Oil"
      },
      protectiveVerseDetails: {
        surahName: lang === 'fr' ? "Sourate Al-Hashr (59:22-24) - Les Noms Sacrés" : lang === 'ha' ? "Suratul Hashr (59:22-24)" : "Surah Al-Hashr (59:22-24) - The Sacred Names",
        verseNumber: "59:22-24",
        arabicText: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ ۖ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ ۖ هُوَ الرَّحْمَٰنُ الرَّحِيمُ ۞ هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ",
        phonetic: "Huwallahulladhi la ilaha illa Hu. 'Alimul-ghaybi wash-shahadah...",
        translation: lang === 'fr' ? "C'est Lui Allah. Nulle divinité autre que Lui, Le Connaisseur de l'Invisible tout comme du visible. C'est Lui Le Tout Miséricordieux, Le Très Miséricordieux..." : lang === 'ha' ? "Shi ne Allah da babu wani abin bauta da gaskiya sai Shi, Masani kan gaibu da bayyane..." : "He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed. He is the Entirely Merciful, the Especially Merciful...",
        protectivePower: lang === 'fr' ? "Invoque la garde de 70 000 anges protecteurs pour protéger l'âme, le corps et les biens jusqu'à l'aube." : lang === 'ha' ? "Mala'iku dubu saba'in suna tsare mutum daga dukkan masiba zuwa wayewar gari." : "Commands 70,000 guardian angels to shield mind, body, and home until dawn."
      }
    };
  } else if (hDay >= 19 && hDay <= 22) {
    return {
      name: lang === 'fr' ? "Dernier Quartier (Al-Tarbî' Al-Thani / Al-Gharbî)" : lang === 'ha' ? "Rabin Wata na Karshe (Al-Tarbî' Al-Gharbî)" : "Last Quarter (Al-Tarbî' Al-Gharbî)",
      arabicName: "التربيع الآخر",
      manzil: lang === 'fr' ? "Al-Sarfah & Al-Awwa (الصَّرْفَة / العَوَّاء – Demeures de la Retraite et de la Dissolution du Bruit)" : lang === 'ha' ? "Al-Sarfah da Al-Awwa (الصَّرْفَة)" : "Al-Sarfah & Al-Awwa (الصَّرْفَة)",
      energy: lang === 'fr' ? "Introspection Profonde (Muhasabah), Sobriété Mystique, Protection des Secrets et Recueillement"
            : lang === 'ha' ? "Zurfin tunani, natsuwa ta zuciya da kiyaye sirrika na boye"
            : "Deep introspection (Muhasabah), mystical sobriety, protection of secrets, and solitude",
      mysticMeaning: lang === 'fr' ? "De nouveau séparée en deux parties égales, la Lune entame sa rétraction vers l'intérieur. C'est l'appel au bilan spirituel (Al-Muhasabah). L'âme se détourne du bruit assourdissant de la cité des hommes pour écouter la brise légère du murmure divin. C'est la phase de la sobriété sacrée et de la préservation des états mystiques."
                   : lang === 'ha' ? "Kasancewar wata a rabinsa kuma, yana kira zuwa ga boye abubuwa da kiyaye gaskiya ta ciki. Rai yana janyewa daga dukkan hayaniyar duniya domin mayar da hankali kan ginshikan imani."
                   : "Divided once more into equal halves, the Moon pulls inward. This is the call for soul accounting (Al-Muhasabah), stepping back from worldly noise to tune into divine peace.",
      recommendedPractice: lang === 'fr' ? "Observer un jeûne de la parole (Samt) pendant quelques heures, effectuer un examen de conscience rigoureux sur ses actions du mois, et réciter l'invocation de protection contre les erreurs et les influences négatives."
                         : lang === 'ha' ? "Kiyaye shiru na tsawon lokaci, kashe dukkan hayaniyar duniya, yi tunani a kan karshen komai, sannan ka karanta addu'o'in kariya."
                         : "Observe a speech fast (Samt) for several hours, conduct honest self-examination of monthly deeds, and chant protective formulas against spiritual slips.",
      vibration: lang === 'fr' ? "Intériorisation de la foi, inviolabilité des secrets sacrés et paix de la solitude" : lang === 'ha' ? "Hikima ta ciki, zaman lafiya da kiyaye sirri" : "Faith interiorization, sacred secret protection, and solitary peace",
      spiritualSecret: lang === 'fr' ? "Le secret de cette lune est le Voilement des Secrets (Hifz al-Asrar). Pour qu'une plante grandisse, ses racines doivent rester dans le secret de la terre. De même, les grâces reçues pendant le cycle ne doivent pas être divulguées avec vanité, mais conservées dans le tabernacle du cœur."
                     : lang === 'ha' ? "Wannan ne sirrin kiyaye haske (Hifzul Asrar): domin kare tsarkake ruhunka, dole ne rai ya koyi boye sirrikansa a karkashin tawali'u."
                     : "The secret of this moon is the Safeguarding of Secrets (Hifz al-Asrar). Just as roots require hidden soil to flourish, spiritual insights must be safeguarded within the heart.",
      astronomicalInfo: lang === 'fr' ? "L'élongation quadrature ouest est de 90°. La Lune se lève vers minuit et culmine au méridien sud au moment précis où le Soleil se lève. Sa moitié orientale reste éclairée par les rayons solaires."
                      : lang === 'ha' ? "Wata yana kashi uku na tafiyarsa baki daya (90°). Rabinsa na hagu ne ke da haske. Yana fitowa a tsakiyar dare ya cika a tsakiyar gari a asuba."
                      : "Western quadrature elongation is 90°. The Moon rises around midnight and culminates at the southern meridian at sunrise, its eastern half illuminated by solar rays.",
      recommendedAsma: lang === 'fr' ? ["يَا حَفِيظُ (Ya Hafiz - Le Protecteur Infaillible - 998)", "يَا بَاطِنُ (Ya Batin - L'Infiniment Caché - 62)", "يَا قَدِيرُ (Ya Qadir - Le Tout-Puissant - 305)", "يَا سَتَّارُ (Ya Sattar - Le Couvreur des Fautes)"]
                     : lang === 'ha' ? ["يَا حَفِيظُ (Ya Hafiz - Mai Tsarewa)", "يَا بَاطِنُ (Ya Batin - Na Boye)", "يَا قَدِيرُ (Ya Qadir - Mai Iko)", "يَا سَتَّارُ (Ya Sattar - Mai Rufe Aibu)"]
                     : ["يَا حَفِيظُ (Ya Hafiz - O Preserver)", "يَا بَاطِنُ (Ya Batin - O Hidden)", "يَا قَدِيرُ (Ya Qadir - O Powerful)", "يَا سَتَّارُ (Ya Sattar - O Concealer)"],
      spiritualKey: lang === 'fr' ? "La clé est le contentement de l'âme (Rida) : accepter la volonté divine avec un cœur paisible et garder le secret des grâces reçues."
                  : lang === 'ha' ? "Mabudin shi ne yarda da kaddara da natsuwa (Rida) a cikin kebewa."
                  : "The key is contentment of the soul (Rida): accepting divine decree with serenity and guarding sacred secrets.",
      wirdDetails: {
        title: lang === 'fr' ? "Wird du Bouclier des Secrets & de la Préservation (Ya Hafîz)" : "Wird of the Shield of Secrets (Ya Hafiz)",
        formula: "Yâ Hafîzu Yâ Bâtinu Yâ Qâdir, Ihfaz 'alayya dînî wa sirrî wa qalbi",
        count: 998,
        description: lang === 'fr' ? "À réciter à la tombée de la nuit ou au milieu de la nuit pour créer un rempart spirituel impénétrable contre la jalousie (Hasad), les énergies néfastes et les égarements de l'esprit." : "Recite at nightfall or midnight to erect an impenetrable aura shield against envy (Hasad), negative energies, and mental confusion."
      },
      talsamDetails: {
        formula: "حَفِيظٌ بَاطِنٌ (حَ-فِ-ي-ظٌ / بَ-ا-طِ-نٌ) - ٩٩٨ / ٦٢",
        graphicSymbol: "┌──────────────┐\n│ 🛡️  𐎃  𐎏  𐎐  🛡️ │\n│ 🛡️  ٩  ٩  ٨  🛡️ │\n└──────────────┘",
        spiritualUtility: lang === 'fr' ? "Protection absolue contre le mauvais œil, sécurité spirituelle et maintien de la paix intérieure" : "Absolute protection against the evil eye, spiritual safety, and mental composure",
        description: lang === 'fr' ? "Ce talsam utilise la matrice d'invulnérabilité du Nom Hafiz (998) couplée à Batin (62). Il rend la présence du serviteur invisible aux mauvais désirs des envieux et protège son intégrité spirituelle." : "This talisman couples Hafiz (998) and Batin (62) frequencies, creating an impenetrable aura barrier that shields the practitioner against malevolent intentions."
      },
      quranicVerseDetails: {
        surahName: lang === 'fr' ? "Sourate Al-Anfal (8:27)" : lang === 'ha' ? "Suratul Anfal (8:27)" : "Surah Al-Anfal (8:27)",
        verseNumber: "8:27",
        arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَخُونُوا اللَّهَ وَالرَّسُولَ وَتَخُونُوا أَمَانَاتِكُمْ وَأَنتُمْ تَعْلَمُونَ",
        phonetic: "Ya ayyuhalladhina amanu la takhunullaha war-rasula...",
        translation: lang === 'fr' ? "Ô vous qui croyez ! Ne trahissez pas Allah et le Messager, et ne trahissez pas vos dépôts confiés alors que vous savez." : lang === 'ha' ? "Ya ku waɗanda kuka yi imani! Kada ku ci amanar Allah da ManzonSa kuma kada ku ci amanar amana da aka ba ku..." : "O you who have believed, do not betray Allah and the Messenger or betray your trusts while you know.",
        spiritualBenefit: lang === 'fr' ? "Sert de bouclier pour préserver les secrets spirituels, renforce la loyauté et protège la foi contre les égarements." : lang === 'ha' ? "Kiyaye sirrin zuciya da imanin mutum, kare amana da hana zame gwiwa." : "Shields spiritual secrets, reinforces fidelity, and protects faith against straying."
      },
      sacredPlantsDetails: {
        plantName: lang === 'fr' ? "Sauge Officinale & Thym Sauvage" : lang === 'ha' ? "Sauge da Thym" : "Common Sage & Wild Thyme",
        botanicalName: "Salvia officinalis / Thymus serpyllum",
        element: lang === 'fr' ? "Terre Subtile & Air Froid" : lang === 'ha' ? "Ƙasa da Iska mai sanyi" : "Subtle Earth & Cool Air",
        spiritualProperties: lang === 'fr' ? "Purification des pensées résiduelles, protection du cercle rituel et renforcement de l'ancrage intérieur." : lang === 'ha' ? "Goge tunani marasa amfani, tsarkake filin zikiri da samar da natsuwa." : "Cleansing residual mental clutter, ritual circle protection, and inner grounding.",
        usageMethod: lang === 'fr' ? "Fumigation de sauge séchée à la tombée de la nuit avant l'examen de conscience nocturne (Muhasabah)." : lang === 'ha' ? "Kona ganyen Sauge busasshe a daren tunani da zare ido." : "Burn dried sage leaves at nightfall prior to self-examination.",
        binauralFreq: 432,
        frequencyName: lang === 'fr' ? "432 Hz - Introspection Profonde & Protection de l'Aura" : "432 Hz - Deep Introspection & Aura Protection",
        essentialOils: lang === 'fr' ? "Huile Essentielle de Sauge Officinale, Thym Sauvage & Lavande" : "Sage, Wild Thyme & Lavender Essential Oil"
      },
      protectiveVerseDetails: {
        surahName: lang === 'fr' ? "Sourate As-Saffat (37:1-7) - Les Rangs d'Anges Protecteurs" : lang === 'ha' ? "Suratul Saffat (37:1-7)" : "Surah As-Saffat (37:1-7) - Angelic Ranks",
        verseNumber: "37:1-7",
        arabicText: "وَالصَّافَّاتِ صَفًّا ۞ فَالزَّاجِرَاتِ زَجْرًا ۞ فَالتَّالِيَاتِ ذِكْرًا ۞ إِنَّ إِلَٰهَكُمْ لَوَاحِدٌ ۞ رَّبُّ السَّمَاوَاتِ وَالْأَرْضِ وَمَا بَيْنَهُمَا وَرَبُّ الْمَشَارِقِ ۞ إِنَّا زَيَّنَّا السَّمَاءَ الدُّنْيَا بِزِينَةٍ الْكَوَاكِبِ ۞ وَحِفْظًا مِّن كُلِّ شَيْطَانٍ مَّارِدٍ",
        phonetic: "Was-saffati saffa. Faz-zajirati zajra. Fat-taliyati dhikra...",
        translation: lang === 'fr' ? "Par ceux rangés en rangs ! Par ceux qui chassent vivement ! Par ceux qui récitent un rappel ! Votre Dieu est en vérité Unique... Et Nous l'avons protégée contre tout diable rebelle." : lang === 'ha' ? "Rantsuwa da masu jera sahu-sahu, da masu tsawatawa... Lallai Abin bautarku Guda Daya ne..." : "By those lined up in rows, and those who drive, and those who recite a message... Indeed, your God is One... And as protection against every rebellious devil.",
        protectivePower: lang === 'fr' ? "Érige les rangs d'anges autour de l'enceinte sacrée, pulvérisant toute entité ténébreuse ou perturbation occulte." : lang === 'ha' ? "Rukunin mala'iku suna kewaye gida da mutum, suna kona shaidanu da dukkan masiba." : "Marshals angelic ranks around the sacred space, repelling every rebellious entity."
      }
    };
  } else {
    return {
      name: lang === 'fr' ? "Dernier Croissant (Al-Hilal Al-Thani / Al-Mahaq)" : lang === 'ha' ? "Jinjirin Wata na Karshe (Al-Hilal Al-Gharbî)" : "Last Crescent (Al-Hilal Al-Gharbî)",
      arabicName: "الهلال الأخير - المحاق",
      manzil: lang === 'fr' ? "Al-Simak & Al-Ghafr (السِّمَاك / الغَفْر – Demeures du Pardon et de l'Annihilation Heureuse)" : lang === 'ha' ? "Al-Simak da Al-Ghafr (السِّمَاك)" : "Al-Simak & Al-Ghafr (السِّمَاك)",
      energy: lang === 'fr' ? "Extinction de l'Ego (Fana'), Repentir Sincère (Tawbah Nasuh), Lâcher-Prise et Pareté"
            : lang === 'ha' ? "Kawar da girman kai (Fana'), tuba na gaskiya da dogara ga Allah"
            : "Ego extinction (Fana'), sincere repentance (Tawbah Nasuh), letting go, and spiritual purity",
      mysticMeaning: lang === 'fr' ? "Le mince croissant d'argent prêt à s'éteindre à l'Est représente le summum de l'humilité. L'âme se défait de ses prétentions et s'abandonne au Tout-Puissant dans un état de pauvreté spirituelle absolue (Al-Faqr). C'est le sommeil réparateur du grain de blé enfoui sous terre, prêt pour la résurrection du prochain cycle."
                   : lang === 'ha' ? "Siririn jinjirin wata da ke shirin batan yana wakiltar cikakken tawali'u. Rai yana ajiye dukkan fakar kansa yana mika wuya ga Ubangiji (Al-Faqr) domin sake samun sabon rai na gaba."
                   : "The sliver of silver crescent fading in the Eastern dawn represents the pinnacle of spiritual humility. The soul relinquishes illusions of selfhood, surrendering to the Supreme in total spiritual poverty (Al-Faqr).",
      recommendedPractice: lang === 'fr' ? "Multiplier l'Istighfar (demande de pardon) 100 à 1000 fois au temps du Sahar (dernier tiers de la nuit). Se prosterner longuement en exprimant son besoin absolu de la grâce divine et abandonner tout fardeau émotionnel."
                         : lang === 'ha' ? "Yawaita istigfari (neman gafara) kafa 100 zuwa 1000 a lokacin Sahar (daren asuba da wuri). Ka yi sujada mai tsawo kana neman gafarar Ubangiji."
                         : "Multiply Istighfar 100 to 1000 times during Sahar (predawn hours). Prostrate deeply, expressing complete reliance on divine forgiveness and laying down mental burdens.",
      vibration: lang === 'fr' ? "Pareté originelle, détachement des karmas et abandon confiant (Tawakkul)" : lang === 'ha' ? "Cikakken zaman lafiya na mika wuya ga Allah" : "Original purity, karmic detachment, and trusting surrender (Tawakkul)",
      spiritualSecret: lang === 'fr' ? "Le secret de la Lune d'Annihilation (Al-Mahaq) est le mystère du Fana' (l'extinction de l'ego) précédant le Baqa' (la subsistance en Dieu). Pour que la nouvelle lumière puisse poindre, l'ancienne identité trompeuse de l'ego doit s'effacer totalement dans la majesté du Créateur."
                     : lang === 'ha' ? "Sirrin boye na wannan lokacin shi ne Fana' (kawar da son kai) kafin samun Baqa' (rayuwa tare da Allah). Domin sabon haske ya fito, dole ne tsohon duhu ya kau baki daya."
                     : "The esoteric secret of Mahaq is Fana' (ego annihilation) preceding Baqa' (subsistence in Divine Light). For new light to dawn, the false ego identity must dissolve into divine majesty.",
      astronomicalInfo: lang === 'fr' ? "L'élongation est inférieure à 30° à l'Ouest du Soleil. Le très fin croissant est observable uniquement dans les lueurs dorées de l'aube (Sahar) peu avant le lever du Soleil, s'amenuisant jusqu'à la conjonction finale."
                      : lang === 'ha' ? "Siririn jinjirin wata da ake iya gani kawai a jinjirin safiya (Sahar) a Gabas kafin rana ta fito."
                      : "Elongation drops below 30° West of the Sun. The fragile crescent is observable only during golden predawn twilight (Sahar) shortly before sunrise.",
      recommendedAsma: lang === 'fr' ? ["يَا غَفَّارُ (Ya Ghaffar - Le Pardonneur Absolu - 1281)", "يَا وَكِيلُ (Ya Wakil - Le Mandataire Infaillible - 66)", "يَا صَمَدُ (Ya Samad - Le Recours Éternel - 134)", "يَا حَيُّ (Ya Hayy - Le Vivant Immuable - 18)"]
                     : lang === 'ha' ? ["يَا غَفَّارُ (Ya Ghaffar - Mai Gafara)", "يَا وَكِيلُ (Ya Wakil - Wakili na Gaskiya)", "يَا صَمَدُ (Ya Samad - Abin Dogara)", "يَا حَيُّ (Ya Hayy - Mai Rai)"]
                     : ["يَا غَفَّارُ (Ya Ghaffar - O Forgiver)", "يَا وَكِيلُ (Ya Wakil - O Trustee)", "يَا صَمَدُ (Ya Samad - O Eternal)", "يَا حَيُّ (Ya Hayy - O Ever-Living)"],
      spiritualKey: lang === 'fr' ? "La clé est le lâcher-prise total (Tawakkul) : remettre toutes ses affaires entre les Mains Divines en toute confiance."
                  : lang === 'ha' ? "Mabudin shi ne kawar da son zuciya baki daya domin hasken Ubangiji ya rayu a ranka."
                  : "The key is total surrender (Tawakkul): placing all affairs in Divine Hands with absolute peace.",
      wirdDetails: {
        title: lang === 'fr' ? "Wird du Pardon & du Lâcher-Prise Absolu (Ya Ghaffâr)" : "Wird of Forgiveness & Total Surrender (Ya Ghaffar)",
        formula: "Yâ Ghaffâru Yâ Wakîlu Yâ Samad, Astaghfirullâha wa atûbu ilayh wa tawakaltu 'alâ-Llâh",
        count: 100,
        description: lang === 'fr' ? "À réciter pendant l'aube (Sahar). Dissout les nœuds karmiques, libère des fautes passées et prépare le cœur à la renaissance du nouveau cycle." : "Recite at predawn twilight (Sahar). Dissolves subtle knots, cleanses past slips, and prepares the heart for cycle rebirth."
      },
      talsamDetails: {
        formula: "غَفَّارٌ صَمَدٌ (غَ-فَّ-ا-رٌ / صَ-مَ-دٌ) - ١٢٨١ / ١٣٤",
        graphicSymbol: "┌─────────────┐\n│  𐎅  𐎜  𐎖  𐎍  │\n│  𐎓  𐎏  𐎐  𐎜  │\n└─────────────┘",
        spiritualUtility: lang === 'fr' ? "Purification des blocages profonds, libération des peurs et restauration de la paix intérieure" : "Purification of deep blockages, liberation from fears, and inner peace restoration",
        description: lang === 'fr' ? "Ce talsam de Dissolution Bénie unit les vibrations de Ghaffar (1281) et Samad (134). Il efface les mémoires négatives et régénère le champ aurique pour aborder le nouveau mois dans une pureté virginale." : "This Blessed Dissolution talisman merges the 1281 and 134 frequencies of Ghaffar and Samad, dissolving residual karmic traces and regenerating the aura."
      },
      quranicVerseDetails: {
        surahName: lang === 'fr' ? "Sourate Az-Zumar (39:53)" : lang === 'ha' ? "Suratul Zumar (39:53)" : "Surah Az-Zumar (39:53)",
        verseNumber: "39:53",
        arabicText: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفرُ الذُّنُوبَ جَمِيعًا ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ",
        phonetic: "Qul ya 'ibadiyalladhina asrafu 'ala anfusihim la taqnatu min rahmatillah...",
        translation: lang === 'fr' ? "Dis : 'Ô Mes serviteurs qui avez commis des excès à votre propre détriment, ne désespérez pas de la miséricorde d'Allah. Car Allah pardonne tous les péchés. Oui, c'est Lui le Pardonneur, le Très Miséricordieux.'" : lang === 'ha' ? "Ka ce: 'Ya bayana waɗanda suka yi ɓarna a kan kansu! Kada ku cire tsammani daga rahmar Allah. Lalle Allah Yana gafarta zunubai baki ɗaya...'" : "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.'",
        spiritualBenefit: lang === 'fr' ? "Dissolution complète des mémoires négatives, pardon divin inconditionnel et régénération totale de l'esprit." : lang === 'ha' ? "Gafara baki ɗaya daga Ubangiji, goge zunubai da komawa sabo cikin aminci." : "Complete dissolution of negative karma, unconditional divine forgiveness, and total spiritual regeneration."
      },
      sacredPlantsDetails: {
        plantName: lang === 'fr' ? "Myrrhe Noire & Nigelle Sacrée (Habba Sawda)" : lang === 'ha' ? "Myrrhe da Habbatus Sauda" : "Black Myrrh & Black Seed (Habbat al-Barakah)",
        botanicalName: "Commiphora myrrha / Nigella sativa",
        element: lang === 'fr' ? "Eau Céleste & Terre de Purification" : lang === 'ha' ? "Ruwa da Ƙasan Tsarki" : "Celestial Water & Cleansing Earth",
        spiritualProperties: lang === 'fr' ? "Purification ultime de l'organisme et des corps subtils, élimination des parasites spirituels et renaissance de l'aura." : lang === 'ha' ? "Tsarkake jiki da rai baki daya, cire duhu da shirya rai ga sabon haske." : "Ultimate purification of physical and subtle bodies, clearing spiritual impurities, and aura rebirth.",
        usageMethod: lang === 'fr' ? "Fumigation de Myrrhe au Sahar et consommation de quelques gouttes d'huile de Nigelle pure dans du miel." : lang === 'ha' ? "Kona Myrrhe a asuba da shan man Habbatus Sauda guda biyu da zuma." : "Fumigate Myrrh at Sahar twilight and consume a few drops of Nigella oil with honey.",
        binauralFreq: 528,
        frequencyName: lang === 'fr' ? "528 Hz - Régénération de l'Âme & Métamorphose" : "528 Hz - Soul Regeneration & Metamorphosis",
        essentialOils: lang === 'fr' ? "Huile de Nigelle Sacrée (Habbat al-Barakah), Myrrhe Noire & Extrait de Cumin Noir" : "Black Seed Oil, Black Myrrh & Black Cumin Extract"
      },
      protectiveVerseDetails: {
        surahName: lang === 'fr' ? "Sourate Ta-Ha (20:114) & Al-Mu'minun (23:97-98)" : lang === 'ha' ? "Suratul Mu'minun (23:97-98)" : "Surah Al-Mu'minun (23:97-98) - Divine Haven",
        verseNumber: "23:97-98",
        arabicText: "وَقُل رَّبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ ۞ وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ",
        phonetic: "Wa qur-Rabbi a'udhu bika min hamazatish-shayatin. Wa a'udhu bika Rabbi ay-yahdurun.",
        translation: lang === 'fr' ? "Et dis : 'Seigneur, je cherche Ta protection contre les incitations des diables ; et je cherche Ta protection, Seigneur, contre leur présence auprès de moi.'" : lang === 'ha' ? "Kuma ka ce: 'Ubangijina, na tsara da Kai daga soke-soken shaidanu; kuma na tsara da Kai Ubangijina kada su halarce ni.'" : "And say, 'My Lord, I seek refuge in You from the incitements of the devils, and I seek refuge in You, my Lord, lest they be present with me.'",
        protectivePower: lang === 'fr' ? "Purification ultime dissolvant les attaques psychiques nocturnes, cauchemars et parasitages astraux en fin de cycle." : lang === 'ha' ? "Kariya daga munanan mafarkai, cutar aljanu na daren mahaq da share hanyar sabon wata." : "Ultimate purification dissolving nocturnal psychic attacks, nightmares, and astral parasites at cycle end."
      }
    };
  }
};

export interface TalsamUsageProtocol {
  usageSteps: {
    step: number;
    title: string;
    description: string;
  }[];
  advancedDetails: {
    abjadBasis: string;
    elementalNature: string;
    khuddamInfo: string;
    recommendedIncense: string;
    timingRule: string;
  };
}

export const getTalsamAdvancedProtocol = (hDay: number, lang: 'fr' | 'en' | 'ha'): TalsamUsageProtocol => {
  if (hDay === 1 || hDay === 29 || hDay === 30) {
    return {
      usageSteps: lang === 'fr' ? [
        { step: 1, title: "Ablutions & Purification Intérieure", description: "Faire le Wudu (ablutions) complet, revêtir des vêtements propres (de préférence blancs), et s'asseoir seul dans un endroit calme orienté vers la Qiblah." },
        { step: 2, title: "Traçage ou Impression du Sceau", description: "Recopier le Wafq Buduh (2-9-4 / 7-5-3 / 6-1-8) sur du papier propre avec de l'encre sacrée (Za'faran & Rose) ou encre dorée, ou visualiser la grille au centre du cœur." },
        { step: 3, title: "Consécration par l'Encens (Bukhoor)", description: "Passer délicatement le Sceau au-dessus de la fumée d'Oud pur, de Luban Jawi ou de Santal doux tout en émettant une intention pure." },
        { step: 4, title: "Récitation & Invocations Vocalisées", description: "Réciter la formule talsamique « B-D-W-H » 15 ou 111 fois à voix basse, puis dire 3 fois la Salawat Al-Fatih pour sceller l'énergie." },
        { step: 5, title: "Conservation & Port du Talsam", description: "Plier soigneusement la feuille et la garder dans votre lieu de prière, votre portefeuille, ou la porter sur vous pendant toute la durée du mois hijri." }
      ] : lang === 'ha' ? [
        { step: 1, title: "Tsarkakewa da Alwala", description: "Ka yi alwala ta cika, ka sanya tufafi masu kyau, sannan ka zauna a wuri mai natsuwa yana fuskantar Qiblah." },
        { step: 2, title: "Rubuta ko Fitar da Hatimi", description: "Rubuta Hatimin Buduh a kan takarda mai kyau da tawada mai albarka, ko ka yi tunaninsa a cikin zuciya." },
        { step: 3, title: "Tura Turaren Wuta (Bukhoor)", description: "Pass Hatimin ta saman turaren Oud ko Luban tareda mika niyya mai kyau." },
        { step: 4, title: "Maimaita Kalmar Sirri", description: "Maimaita 'B-D-W-H' kafa 15 ko 111, sannan ka yi Salatin Annabi kafa 3 don rufe sirrin." },
        { step: 5, title: "Adana ko Daukar Hatimi", description: "Nannade takardar ka adana ta a wuri mai tsarki ko ka rike ta tsawon watan." }
      ] : [
        { step: 1, title: "Ablutions & Purification", description: "Perform complete Wudu, wear clean white attire, and sit alone facing the Qiblah in a serene space." },
        { step: 2, title: "Inscribing or Visualizing the Seal", description: "Copy the Buduh Wafq (2-9-4 / 7-5-3 / 6-1-8) onto clean paper using saffron ink or visualize the grid in the heart." },
        { step: 3, title: "Incense Consecration", description: "Pass the seal above Oud or Frankincense smoke while focusing your intent." },
        { step: 4, title: "Chanting & Vocalization", description: "Recite the talismanic formula 'B-D-W-H' 15 or 111 times quietly, followed by 3 Salawat to seal the vibration." },
        { step: 5, title: "Conservation & Carrying", description: "Fold neatly and keep in your prayer space or wallet for the duration of the lunar cycle." }
      ],
      advancedDetails: {
        abjadBasis: lang === 'fr' ? "Carré magique Buduh 3x3 (Somme magique 15 / Total 45 - Fréquence d'Adam)" : lang === 'ha' ? "Hatimin Buduh 3x3 (Cikakken lissafi 15 / Gemide 45 - Adam)" : "Buduh 3x3 magic square (Magic sum 15 / Total 45 - Adam frequency)",
        elementalNature: lang === 'fr' ? "Terre (Ancrage des graines) & Air (Impulsion de pensée)" : lang === 'ha' ? "Ƙasa da Iska (Daidaita tunani)" : "Earth (Seed grounding) & Air (Thought impulse)",
        khuddamInfo: lang === 'fr' ? "Serviteurs angéliques du pôle créateur et de la bénédiction initiale" : lang === 'ha' ? "Mala'ikun kariya na farkon albarka" : "Angelic guardians of primordial origin and initial blessings",
        recommendedIncense: lang === 'fr' ? "Oud Pur, Mastic (Luban Jawi) ou Santal Doux" : lang === 'ha' ? "Oud, Luban da Santal" : "Pure Oud, Mastic (Luban Jawi) or Sweet Sandalwood",
        timingRule: lang === 'fr' ? "Au Sahar (dernier tiers de la nuit) ou juste après l'Isha" : lang === 'ha' ? "Lokacin Sahar (asuba) ko bayan Isha" : "During Sahar (predawn hours) or right after Isha"
      }
    };
  } else if (hDay >= 2 && hDay <= 6) {
    return {
      usageSteps: lang === 'fr' ? [
        { step: 1, title: "Purification & Baignade de Lumière", description: "Effectuer des ablutions soignées. Si possible, s'exposer à la lumière du premier croissant après le Maghrib." },
        { step: 2, title: "Fixation du Sceau de l'Alif", description: "Poser le Sceau de l'Alif (111) devant soi ou le tracer mentalement du front au cœur." },
        { step: 3, title: "Combustion de l'Encens Moteur", description: "Allumer un brin de Benjoin odoriférant ou de Jasmin pour élever la fréquence vibratoire." },
        { step: 4, title: "Récitation de la Formule Alif", description: "Réciter la formule « A-L-F » 111 fois avec la voix du cœur en synchronisant la respiration." },
        { step: 5, title: "Eau de Lumière Consacrée", description: "Souffler 3 fois sur un verre d'eau pure après la récitation et le boire pour infuser la clarté d'esprit." }
      ] : lang === 'ha' ? [
        { step: 1, title: "Tsarkakewa da Kallon Wata", description: "Yi alwala mai kyau sannan ka fuskanci jinjirin wata bayan Magrib." },
        { step: 2, title: "Fitar da Hatimin Alif", description: "Sanya Hatimin Alif (111) a gabanka ko ka tunane shi daga goshi zuwa zuciya." },
        { step: 3, title: "Tura Turaren Wuta", description: "Sosa turaren Jasmin ko Benjoin domin daukaka haske." },
        { step: 4, title: "Maimaita Harrufan Alif", description: "Maimaita 'A-L-F' kafa 111 tare da daidaita numfashi." },
        { step: 5, title: "Shan Ruwan Albarka", description: "Hura ruwa kafa 3 sannan ka sha domin samun hasken tunani da hikima." }
      ] : [
        { step: 1, title: "Purification & Moon Gaze", description: "Perform pristine Wudu and gaze upon the rising crescent after sunset." },
        { step: 2, title: "Visualizing the Alif Seal", description: "Place the Alif Seal (111) before you or project it from forehead to heart." },
        { step: 3, title: "Igniting Elevating Incense", description: "Burn Jasmine or Sweet Benjoin to raise subtle vibrational harmonics." },
        { step: 4, title: "Chanting the Alif Frequency", description: "Recite the 'A-L-F' formula 111 times in rhythm with deep belly breathing." },
        { step: 5, title: "Consecrated Water Infusion", description: "Blow gently thrice over clean water and drink to absorb mental clarity." }
      ],
      advancedDetails: {
        abjadBasis: lang === 'fr' ? "Extension du Alif (A-L-F = 1 + 30 + 80 = 111 - Fréquence de la Rectitude)" : lang === 'ha' ? "Lissafin Haruffan Alif (111 - Tabbata da Haske)" : "Alif Expansion (A-L-F = 1 + 30 + 80 = 111 - Frequency of Rectitude)",
        elementalNature: lang === 'fr' ? "Feu Subtil (Éveil de l'esprit & Éclaircissement)" : lang === 'ha' ? "Wuta mai tsarki da haske" : "Subtle Fire (Intellectual awakening & Illumination)",
        khuddamInfo: lang === 'fr' ? "Anges du pôle de la guidance et de la perception intuitive" : lang === 'ha' ? "Mala'ikun shiriya da fahimta" : "Angelic custodians of intuitive perception and guidance",
        recommendedIncense: lang === 'fr' ? "Jasmin, Benjoin Blanc ou Fleur d'Oranger" : lang === 'ha' ? "Jasmin ko Benjoin" : "Jasmine, White Benjoin, or Orange Blossom",
        timingRule: lang === 'fr' ? "Pendant 45 minutes après le coucher du soleil (Maghrib)" : lang === 'ha' ? "Minti 45 bayan faduwar rana" : "Within 45 minutes after sunset (Maghrib)"
      }
    };
  } else if (hDay >= 7 && hDay <= 9) {
    return {
      usageSteps: lang === 'fr' ? [
        { step: 1, title: "Ancrage & Position du Mizan", description: "S'asseoir en tailleur directement sur le sol, colonne droite, les mains posées sur les genoux." },
        { step: 2, title: "Présentation du Sceau de l'Équilibre", description: "Placer le Sceau Mizan (104/117) au niveau du plexus solaire ou du cœur." },
        { step: 3, title: "Encensement de la Balance Céleste", description: "Faire brûler de la Myrrhe Royale ou du Camphre doux pour purifier la pièce." },
        { step: 4, title: "Récitation du Binôme 'Adl & Qawiyy", description: "Réciter la formule talsamique « 'Adlun Qawiyyun » 104 ou 117 fois avec fermeté et gravité." },
        { step: 5, title: "Scelllement par la Salawat", description: "Passer les mains sur tout le corps du sommet de la tête jusqu'aux pieds pour ancrer la force." }
      ] : lang === 'ha' ? [
        { step: 1, title: "Zama da Daidaituwa", description: "Zauna a kasa daidai, mika baya, sanya hannaye a kan gwiwoyi." },
        { step: 2, title: "Duba Hatimin Mizan", description: "Sanya Hatimin Mizan (104/117) kusa da kirji." },
        { step: 3, title: "Konawa Turaren Myrrhe", description: "Kona turaren Myrrhe ko Camphre don tsarkake daki." },
        { step: 4, title: "Maimaita 'Adlun Qawiyyun", description: "Maimaita kalmar sirri kafa 104 ko 117 tare da natsuwa." },
        { step: 5, title: "Shafe Jiki da Hannaye", description: "Shafe dukkan jiki da hannayenka daga kai zuwa kafa." }
      ] : [
        { step: 1, title: "Grounding & Seated Balance", description: "Sit firmly on the floor cross-legged, spine straight, hands resting on knees." },
        { step: 2, title: "Aligning the Mizan Seal", description: "Place the Mizan Balance Seal (104/117) at solar plexus level." },
        { step: 3, title: "Purifying Smoke Offering", description: "Burn Royal Myrrh or sweet Camphor to clear static energies." },
        { step: 4, title: "Formulating 'Adl & Qawiyy", description: "Chant the talismanic formula ''Adlun Qawiyyun' 104 or 117 times with conviction." },
        { step: 5, title: "Aura Sealing Sweep", description: "Sweep hands over entire body from head to feet to solidify aura protection." }
      ],
      advancedDetails: {
        abjadBasis: lang === 'fr' ? "Alliance de 'Adl (104) & Qawiyy (117) = Fréquence 221 de la Justice Souveraine" : lang === 'ha' ? "Hadakar 'Adl (104) da Qawiyy (117) = 221 Lissafin Karfe" : "Fusion of 'Adl (104) & Qawiyy (117) = Frequency 221 of Sovereign Equity",
        elementalNature: lang === 'fr' ? "Air & Eau (Unification des opposés, Mizan parfait)" : lang === 'ha' ? "Iska da Ruwa (Daidaita dukkan bangarori)" : "Air & Water (Unification of polarities, Perfect Balance)",
        khuddamInfo: lang === 'fr' ? "Gardiens de la balance céleste et protecteurs contre la tyrannie" : lang === 'ha' ? "Mala'ikun adalci da kariya daga zalunci" : "Custodians of the celestial scales & shields against oppression",
        recommendedIncense: lang === 'fr' ? "Myrrhe Royale, Camphre Pur ou Musc Noir" : lang === 'ha' ? "Myrrhe, Camphre ko Musc Black" : "Royal Myrrh, Pure Camphor, or Black Musk",
        timingRule: lang === 'fr' ? "Au zénith solaire (Dhuhr) ou à l'heure du coucher du soleil" : lang === 'ha' ? "Tsakiyar rana (Dhuhr) ko lokacin Magrib" : "At solar noon (Dhuhr) or twilight"
      }
    };
  } else if (hDay >= 10 && hDay <= 12) {
    return {
      usageSteps: lang === 'fr' ? [
        { step: 1, title: "Préparation dans la Douceur", description: "S'isoler dans une pièce tamisée en portant un parfum agréable sur les poignets et le cou." },
        { step: 2, title: "Contemplation du Wafq de Latif", description: "Regarder le carré quadratique de Latif (30-9-10-80 = 129) avec un regard paisible." },
        { step: 3, title: "Brumisation d'Encens Suave", description: "Diffuser de l'encens de Santal blanc, de Rose ou de Benjoin doux dans l'espace." },
        { step: 4, title: "Récitation Douce de Latif", description: "Réciter la formule talsamique « Laṭīf » 129 fois avec un ton murmuré et rempli d'amour." },
        { step: 5, title: "Projection d'Abondance & Grâce", description: "Formuler la demande de déblocage financier et de douceur dans toutes les affaires." }
      ] : lang === 'ha' ? [
        { step: 1, title: "Shiryawa cikin Natsuwa", description: "Zauna a daki mai natsuwa tare da shafa turare mai dadin kamshi." },
        { step: 2, title: "Kallon Hatimin Latif", description: "Kalli Hatimin Latif (129) tare da natsuwar zuciya." },
        { step: 3, title: "Tura Turaren Santal", description: "Kona turaren Santal ko Rose a cikin dakin." },
        { step: 4, title: "Maimaita 'Latif'", description: "Maimaita kalmar 'Latif' kafa 129 a hankali tare da kauna." },
        { step: 5, title: "Neman Bude Hanyoyi", description: "Roki Allah ya bude hanyoyin arziki da sauki a cikin dukkan al'amura." }
      ] : [
        { step: 1, title: "Gentle Sanctuary Setup", description: "Retreat to a quiet dimly lit room, applying subtle scented oil on wrists." },
        { step: 2, title: "Gazing at the Latif Matrix", description: "Contemplate the quadratic Latif grid (129 total) with serene focus." },
        { step: 3, title: "Aromatic Fragrance Diffuse", description: "Burn White Sandalwood, Rose, or Sumatra Benjoin in the sanctuary." },
        { step: 4, title: "Whispered Latif Recitation", description: "Chant the talismanic formula 'Laṭīf' 129 times in a soft meditative whisper." },
        { step: 5, title: "Abundance & Grace Intention", description: "Petition for financial ease, resolution of hurdles, and loving harmony." }
      ],
      advancedDetails: {
        abjadBasis: lang === 'fr' ? "Matrice du Nom Ya Latif (L-T-Y-F = 129 - Clé de la Douceur Infaillible)" : lang === 'ha' ? "Lissafin Latif (129 - Sirrin Sauki da Bude Hanyoyi)" : "Latif Name Matrix (L-T-Y-F = 129 - Frequency of Subtle Grace)",
        elementalNature: lang === 'fr' ? "Eau Douce & Lumière Astrale (Dissolution des tensions)" : lang === 'ha' ? "Ruwa mai tsarki da Haske" : "Fresh Water & Celestial Rays (Tension dissolution)",
        khuddamInfo: lang === 'fr' ? "Anges de la grâce invisible, de la bienveillance et du secours prompt" : lang === 'ha' ? "Mala'ikun sauki da taimako na maza-manya" : "Angels of invisible grace, benevolence, and swift relief",
        recommendedIncense: lang === 'fr' ? "Santal Blanc, Encens de Rose ou Benjoin Doux" : lang === 'ha' ? "Santal, Rose ko Benjoin" : "White Sandalwood, Rose Resin, or Sumatra Benjoin",
        timingRule: lang === 'fr' ? "Au coucher du soleil (Maghrib) ou pendant le tiers moyen de la nuit" : lang === 'ha' ? "Bayan faduwar rana (Magrib) ko tsakiyar dare" : "At sunset (Maghrib) or middle third of the night"
      }
    };
  } else if (hDay >= 13 && hDay <= 15) {
    return {
      usageSteps: lang === 'fr' ? [
        { step: 1, title: "Bain de Purification Suprême (Ghusl)", description: "Effectuer un grand lavage purificateur et s'habiller de blanc pur la nuit de la Pleine Lune." },
        { step: 2, title: "Exposition Directe à la Pleine Lune", description: "S'asseoir face à la Pleine Lune ou sous la lumière lunaire traversant la fenêtre." },
        { step: 3, title: "Consécration du Grand Sceau du Badr", description: "Tenir le Sceau du Badr (166) entre les deux paumes ouvertes tournées vers le ciel." },
        { step: 4, title: "Brûlage d'Oud & Ambre Impérial", description: "Consacrer l'espace avec de l'Oud précieux ou de l'Ambre gris." },
        { step: 5, title: "Invocations de la Plénitude (166 / 1000x)", description: "Réciter la formule du Grand Sceau 166 ou 1000 fois. Demander les vœux les plus sacrés de votre vie." }
      ] : lang === 'ha' ? [
        { step: 1, title: "Wanka da Tsarkakewa (Ghusl)", description: "Yi wanka mai tsarki sannan ka sanya fararen tufafi a daren Cikakken Wata." },
        { step: 2, title: "Zama a karkashin Hasken Wata", description: "Zauna a karkashin hasken cikakken wata ko kusa da taga mai haske." },
        { step: 3, title: "Rike Hatimin Badr", description: "Rike Hatimin Badr (166) tsakanin tafukan hannayenka guda biyu." },
        { step: 4, title: "Kona Turaren Oud da Ambre", description: "Kona turare mai tsada kamar Oud ko Ambre." },
        { step: 5, title: "Maimaita Kalmar Badr (166 / 1000x)", description: "Maimaita 'Khatam Badr' kafa 166 ko 1000. Roki dukkan manyan bukatunka." }
      ] : [
        { step: 1, title: "Grand Bath Purification (Ghusl)", description: "Perform complete ritual purification bath and wear pure white garments." },
        { step: 2, title: "Direct Moonlight Communion", description: "Sit directly under the full moon glow or beside an illuminated window." },
        { step: 3, title: "Consecrating the Badr Seal", description: "Hold the Badr Seal (166) in open palms turned toward the sky." },
        { step: 4, title: "Burning Imperial Oud & Amber", description: "Perfume the atmosphere with precious Cambodian Oud or Ambergris." },
        { step: 5, title: "Plenitude Invocations (166 / 1000x)", description: "Chant the Great Badr formula 166 or 1000 times, invoking noble manifestations." }
      ],
      advancedDetails: {
        abjadBasis: lang === 'fr' ? "Fréquence 166 du Sceau du Badr (Pleine Réalisation & Protection Totale)" : lang === 'ha' ? "Lissafin Khatam Badr (166 - Cikakken Haske da Kariya)" : "Badr Seal Frequency 166 (Total Realization & Absolute Protection)",
        elementalNature: lang === 'fr' ? "Éther Pur & Lumière Céleste Intégrale (Synthèse suprême)" : lang === 'ha' ? "Ether da Hasken Sama baki daya" : "Pure Ether & Complete Celestial Illumination",
        khuddamInfo: lang === 'fr' ? "Custodiens de la Lumière Muhammadienne et archanges de la Victoire" : lang === 'ha' ? "Mala'ikun Nasara da Hasken Annabi" : "Custodians of Muhammadan Light & Archangels of Victory",
        recommendedIncense: lang === 'fr' ? "Oud Cambodgien Précieux, Ambre Gris ou Bukhoor Mekkois" : lang === 'ha' ? "Oud na tsada, Ambre da Bukhoor Makkah" : "Precious Cambodian Oud, Ambergris, or Meccan Bukhoor",
        timingRule: lang === 'fr' ? "Au milieu exact de la nuit (12h-2h) sous la clarté lunaire directe" : lang === 'ha' ? "Tsakiyar dare (karfe 12 - 2) a karkashin hasken wata" : "At exact midnight under direct full moonlight"
      }
    };
  } else if (hDay >= 16 && hDay <= 18) {
    return {
      usageSteps: lang === 'fr' ? [
        { step: 1, title: "Prière du Matin & Gratitude", description: "Démarrer la journée avec la prière du Subh et exprimer une gratitude sincère pour les bienfaits reçus." },
        { step: 2, title: "Exposition du Sceau de la Baraka", description: "Mettre en valeur le Sceau de la Générosité (270/201) dans votre bureau ou espace de travail." },
        { step: 3, title: "Combustion de Cèdre ou Cannelle", description: "Faire brûler de l'encens de Cèdre, de Cannelle ou d'Oud doux pour stimuler l'abondance." },
        { step: 4, title: "Récitation de Karim & Nafi'", description: "Réciter la formule « Karīmun Nāfi'un » 270 fois avant de démarrer vos activités professionnelles." },
        { step: 5, title: "Sceau de l'Aumône (Sadaqah)", description: "Offrir une aumône secrète ou un geste de bonté envers un nécessiteux pour activer le fluide." }
      ] : lang === 'ha' ? [
        { step: 1, title: "Addu'ar Asuba da Godiya", description: "Fara ranar ta hanyar addu'ar asuba da yi wa Allah godiya ga dukkan albarka." },
        { step: 2, title: "Ajiye Hatimin Baraka", description: "Sanya Hatimin Baraka (270/201) a wurin sana'ar ku ko ofis." },
        { step: 3, title: "Kona Turaren Cèdre ko Cannelle", description: "Kona turaren Cèdre ko Cannelle domin jawo arzikin sana'a." },
        { step: 4, title: "Maimaita 'Karimun Nafi'un'", description: "Maimaita kalmar sirri kafa 270 kafin fara gudanar da sana'a." },
        { step: 5, title: "Bada Sadaka ta Boye", description: "Bada kankanar sadaka ga wanda yake bukata don tabbatar da albarka." }
      ] : [
        { step: 1, title: "Morning Prayer & Gratitude", description: "Begin the day with Subh prayer, offering sincere gratitude for all blessings." },
        { step: 2, title: "Displaying the Baraka Seal", description: "Place the Generosity Seal (270/201) in your workspace or business area." },
        { step: 3, title: "Aromatic Cedar Wood Fumigation", description: "Burn Cedarwood, Sweet Cinnamon, or Soft Oud to attract prosperity." },
        { step: 4, title: "Reciting Karim & Nafi'", description: "Chant 'Karīmun Nāfi'un' 270 times before engaging in daily business." },
        { step: 5, title: "Sealing with Secret Charity", description: "Offer secret charity (Sadaqah) or a compassionate act to lock in abundance." }
      ],
      advancedDetails: {
        abjadBasis: lang === 'fr' ? "Fusion de Karim (270) & Nafi' (201) = Fréquence 471 de la Prospérité Licite" : lang === 'ha' ? "Hadakar Karim (270) da Nafi' (201) = 471 Lissafin Halal" : "Fusion of Karim (270) & Nafi' (201) = Frequency 471 of Rightful Prosperity",
        elementalNature: lang === 'fr' ? "Terre Nourricière & Eau Fécondante (Récolte et stabilité)" : lang === 'ha' ? "Ƙasa da Ruwan Albarka (Girbi da kwanciyar hankali)" : "Nourishing Earth & Fertile Water (Harvest and stability)",
        khuddamInfo: lang === 'fr' ? "Anges de la subsistance bénie (Rizq) et de la générosité des cieux" : lang === 'ha' ? "Mala'ikun arziki da kyautar sama" : "Angels of lawful sustenance (Rizq) and heavenly generosity",
        recommendedIncense: lang === 'fr' ? "Bois de Cèdre, Cannelle Douce ou Oud Épicé" : lang === 'ha' ? "Cèdre, Cannelle ko Oud" : "Cedarwood, Sweet Cinnamon, or Spiced Oud",
        timingRule: lang === 'fr' ? "Au lever du jour (Subh) ou au début des activités quotidiennes" : lang === 'ha' ? "Da hoshi (Asuba) ko farkon gudanar da sana'a" : "At daybreak (Subh) or start of business hours"
      }
    };
  } else if (hDay >= 19 && hDay <= 22) {
    return {
      usageSteps: lang === 'fr' ? [
        { step: 1, title: "Retraite Intérieure & Silence", description: "S'asseoir dans la pénombre à la tombée de la nuit, garder le silence total pendant 10 minutes." },
        { step: 2, title: "Visualisation du Sceau du Hafiz", description: "Tenir le Sceau du Bouclier (998/62) près du cœur ou du plexus solaire." },
        { step: 3, title: "Encens de Protection Impénétrable", description: "Faire brûler des graines de Nigelle, du Camphre impérial ou de la Myrrhe." },
        { step: 4, title: "Récitation du Hafiz & Batin", description: "Réciter la formule talsamique « Ḥafīẓun Bāṭinun » 998 fois (ou 62 fois si le temps presse)." },
        { step: 5, title: "Verrouillage Aurique & Protection", description: "Souffler sur vos mains et sur un verre d'eau, boire l'eau et passer les mains sur le corps." }
      ] : lang === 'ha' ? [
        { step: 1, title: "Kebewa da Yin Shiru", description: "Zauna a cikin duhu a lokacin faduwar rana, yi shiru na minti 10." },
        { step: 2, title: "Duba Hatimin Hafiz", description: "Rike Hatimin Kariya (998/62) kusa da kirji." },
        { step: 3, title: "Kona Turaren Nigelle", description: "Kona ganyen Habbatussauda (Nigelle) ko Camphre don kariya." },
        { step: 4, title: "Maimaita 'Hafizun Batinun'", description: "Maimaita kalmar 'Hafizun Batinun' kafa 998 ko 62 tare da natsuwa." },
        { step: 5, title: "Rufe Jiki da Kariya", description: "Hura hannaye da ruwa, sha ruwan sannan ka shafe dukkan jikinka." }
      ] : [
        { step: 1, title: "Introspective Silence", description: "Sit in dim light at dusk, observing 10 minutes of complete meditative silence." },
        { step: 2, title: "Holding the Shield Seal", description: "Hold the Hafiz Shield Seal (998/62) close to heart or solar plexus." },
        { step: 3, title: "Black Seed & Myrrh Incense", description: "Burn Black Seed (Nigella), Imperial Camphor, or Dark Myrrh." },
        { step: 4, title: "Reciting Hafiz & Batin", description: "Chant 'Ḥafīẓun Bāṭinun' 998 times (or 62 times for a condensed session)." },
        { step: 5, title: "Aura Locking Protocol", description: "Blow over hands and a cup of water, drink the water and sweep hands over body." }
      ],
      advancedDetails: {
        abjadBasis: lang === 'fr' ? "Puissance de Hafiz (998) & Batin (62) = Fréquence 1060 (L'Inviolabilité Absolue)" : lang === 'ha' ? "Lissafin Hafiz (998) da Batin (62) = 1060 Kariya daga Ido" : "Hafiz (998) & Batin (62) = Frequency 1060 (Absolute Inviolability)",
        elementalNature: lang === 'fr' ? "Terre Protectrice & Bouclier d'Air (Protection contre le mauvais œil & jalousie)" : lang === 'ha' ? "Ƙasa da Iska kariya daga bakin mutane da makiya" : "Protective Earth & Air Shield (Shield against evil eye & envy)",
        khuddamInfo: lang === 'fr' ? "Gardiens célestes des secrets spirituels et boucliers contre le Hasad" : lang === 'ha' ? "Mala'ikun tsare sirri da kariya daga hassada" : "Celestial guardians of sacred secrets & shields against Hasad",
        recommendedIncense: lang === 'fr' ? "Graines de Nigelle (Habbatussauda), Camphre ou Myrrhe" : lang === 'ha' ? "Habbatussauda (Nigelle), Camphre ko Myrrhe" : "Black Seed (Nigella), Camphor, or Myrrh",
        timingRule: lang === 'fr' ? "À la tombée de la nuit ou durant le dernier tiers de la nuit" : lang === 'ha' ? "Bayan faduwar rana ko tsakiyar dare" : "At nightfall or during the last third of the night"
      }
    };
  } else {
    return {
      usageSteps: lang === 'fr' ? [
        { step: 1, title: "Prière du Sahar & Repentir", description: "Se lever 45 minutes avant l'aube, faire de douces ablutions et accomplir 2 Rak'ats de prière." },
        { step: 2, title: "Exposition du Sceau de la Dissolution", description: "Placer le Sceau de la Dissolution (1281/134) au sol devant le tapis de prière." },
        { step: 3, title: "Encens Mâle d'Oman (Luban Dhakar)", description: "Faire brûler du Luban Dhakar pur pour purifier complètement l'atmosphère spirituelle." },
        { step: 4, title: "Invocations de Dissolution (100x)", description: "Réciter la formule « Ghaffārun Ṣamadun » 100 fois en se prosternant longuement." },
        { step: 5, title: "Lâcher-Prise & Renaissance", description: "Abandonner toutes les rancœurs, dettes et peurs passées pour aborder le nouveau mois dans la pureté." }
      ] : lang === 'ha' ? [
        { step: 1, title: "Tashi a Sahar da Tuba", description: "Tashi minti 45 kafin asuba, yi alwala sannan ka yi salla kafa 2 na tuba." },
        { step: 2, title: "Ajiye Hatimin Gafara", description: "Sanya Hatimin Gafara (1281/134) a gaban abin sallarka." },
        { step: 3, title: "Kona Turaren Luban Dhakar", description: "Kona turaren Luban Dhakar don tsarkake dakin baki daya." },
        { step: 4, title: "Maimaita 'Ghaffarun Samadun'", description: "Maimaita kalmar 'Ghaffarun Samadun' kafa 100 tare da tsawaita sujada." },
        { step: 5, title: "Mika Wuya da Sabunta Rai", description: "Manta da dukkan bacin rai ko tsoron baya domin shiga sabon wata da sabon rai." }
      ] : [
        { step: 1, title: "Predawn Prayer & Repentance", description: "Awaken 45 minutes before dawn, perform serene Wudu, and pray 2 Rak'ats." },
        { step: 2, title: "Placing the Dissolution Seal", description: "Place the Dissolution Seal (1281/134) directly on the ground before your prayer mat." },
        { step: 3, title: "Pure Omani Frankincense", description: "Burn pure Luban Dhakar (Omani Frankincense) to clear all subtle karmic residues." },
        { step: 4, title: "Chanting Ghaffar & Samad (100x)", description: "Chant 'Ghaffārun Ṣamadun' 100 times, resting head in deep prostration." },
        { step: 5, title: "Complete Surrender & Rebirth", description: "Relinquish past grievances, debts, and fears to enter the new month in pristine purity." }
      ],
      advancedDetails: {
        abjadBasis: lang === 'fr' ? "Alliance de Ghaffar (1281) & Samad (134) = Fréquence 1415 (Purification Intégrale)" : lang === 'ha' ? "Lissafin Ghaffar (1281) da Samad (134) = 1415 Gafara da Sabunta Rai" : "Alliance of Ghaffar (1281) & Samad (134) = Frequency 1415 (Total Purification)",
        elementalNature: lang === 'fr' ? "Eau Purificatrice & Feu Consumateur (Nettoyage des karmas profonds)" : lang === 'ha' ? "Ruwa da Wuta mai tsarkakewa" : "Purifying Water & Consuming Fire (Deep karmic cleansing)",
        khuddamInfo: lang === 'fr' ? "Serviteurs angéliques du pardon absolu et de la dissolution des peines" : lang === 'ha' ? "Mala'ikun gafara da yaye damuwa" : "Angelic servants of absolute forgiveness and grief dissolution",
        recommendedIncense: lang === 'fr' ? "Luban Dhakar (Encens Mâle d'Oman) ou Santal Pur" : lang === 'ha' ? "Luban Dhakar ko Santal" : "Luban Dhakar (Omani Male Frankincense) or Pure Sandalwood",
        timingRule: lang === 'fr' ? "Pendant l'aube (Sahar) juste avant la prière du Subh" : lang === 'ha' ? "Lokacin Sahar (asuba da wuri) kafin sallara Asuba" : "At Sahar twilight right before Subh prayer"
      }
    };
  }
};

// 4. Localized Inspirational Quotes
export const getLocalizedInspirationalQuotes = (lang: 'fr' | 'en' | 'ha'): InspirationalQuote[] => {
  const quotes: Record<'fr' | 'en' | 'ha', InspirationalQuote[]> = {
    fr: [
      { quote: "Le cœur est comme une lanterne de cristal. S'il est purifié des attaches terrestres, la sagesse s'y reflète instantanément.", author: "Sagesse Soufie" },
      { quote: "Les prières secrètes prononcées avec le cœur sont les clés précieuses qui ouvrent les voiles célestes invisibles.", author: "Enseignement Spirituel d'Asrar" },
      { quote: "Cherche la sérénité dans le silence intime de ton âme, car c'est là que réside l'étincelle de la vérité suprême.", author: "Ibn Arabi" },
      { quote: "Chaque respiration consciente recèle un souffle de vie céleste. L'esprit s'illumine par le souvenir constant du Très-Haut.", author: "Méditation des Sages" },
      { quote: "La géométrie sacrée du cosmos est un miroir parfait de l'harmonie invisible déposée en chaque être humain.", author: "Sagesse d'Asrar" },
      { quote: "Les requêtes sincères formulées dans l'intimité de la nuit s'élèvent directement vers les cieux sans obstacle terrestre.", author: "Tradition Initiatique" },
      { quote: "Cultive la paix en toi par la régularité du wird et l'amour inconditionnel de toutes les créatures.", author: "Guide Spirituel d'Asrar" }
    ],
    en: [
      { quote: "The heart is like a crystal lantern. If purified of earthly attachments, wisdom is reflected in it instantly.", author: "Sufi Wisdom" },
      { quote: "Secret prayers uttered from the heart are the precious keys that unlock the invisible celestial veils.", author: "Asrar Spiritual Teaching" },
      { quote: "Seek serenity in the intimate silence of your soul, for there lies the spark of supreme truth.", author: "Ibn Arabi" },
      { quote: "Each conscious breath holds a breath of celestial life. The spirit is illuminated by constant remembrance of the Most High.", author: "Meditation of the Sages" },
      { quote: "The sacred geometry of the cosmos is a perfect mirror of the invisible harmony deposited in every human being.", author: "Asrar Wisdom" },
      { quote: "Sincere requests formulated in the privacy of the night rise directly to the heavens without earthly obstacles.", author: "Initiatic Tradition" },
      { quote: "Cultivate peace within yourself through consistency of the wird and unconditional love for all creatures.", author: "Asrar Spiritual Guide" }
    ],
    ha: [
      { quote: "Zuciya tana kama da fitilar kristal. Idan aka tsarkake ta daga abubuwan duniya, hikima tana bayyana a cikinta nan take.", author: "Hikimar Sufaye" },
      { quote: "Addu'o'in sirri da aka yi da zuciya daya sune mukullan da ke bude labulen sama na gaibu.", author: "Koyarwar Ruhaniya ta Asrar" },
      { quote: "Nemi natsuwa a cikin shiru na zuciyarka, domin a can ne hasken gaskiya yake.", author: "Ibn Arabi" },
      { quote: "Kowane nishi na natsuwa yana dauke da numfashin rayuwa na sama. Zuciya tana haskaka ta hanyar ambaton Ubangiji.", author: "Tunani na Masana" },
      { quote: "Tsarin sararin samaniya madubi ne mai kyau na daidaituwar da ke cikin kowane dan adam.", author: "Hikimar Asrar" },
      { quote: "Addu'o'in gaskiya da aka yi a cikin sirrin dare suna hawa kai tsaye zuwa sammai ba tare da wani shamaki ba.", author: "Tarihin Masu Ilimi" },
      { quote: "Samu zaman lafiya a ranka ta hanyar dorewa a kan wird da kuma kaunar dukkan halittu.", author: "Jagoran Ruhaniya na Asrar" }
    ]
  };
  return quotes[lang];
};

// 5. Localized Audio Frequency Presets
export const getLocalizedFrequencyPresets = (lang: 'fr' | 'en' | 'ha'): FrequencyPreset[] => {
  return [
    {
      id: 'analytical',
      name: lang === 'fr' ? "Clarté Solfeggio (528 Hz)" : lang === 'ha' ? "Hasken Solfeggio (528 Hz)" : "Clarity Solfeggio (528 Hz)",
      baseFreq: 528,
      beatFreq: 0,
      desc: lang === 'fr' ? "Favorise l'analyse, la clarté logique et la réparation énergétique."
          : lang === 'ha' ? "Yana taimakawa lissafi da hasken hankali."
          : "Favors analysis, logical clarity, and energy repair."
    },
    {
      id: 'negotiation',
      name: lang === 'fr' ? "Focus Alpha (Binaural 10 Hz)" : lang === 'ha' ? "Mayar da Hankali Alpha (10 Hz)" : "Focus Alpha (Binaural 10 Hz)",
      baseFreq: 220,
      beatFreq: 10,
      desc: lang === 'fr' ? "Booste l'attention, le charisme et la fluidité verbale."
          : lang === 'ha' ? "Yana kara natsuwa da saukin magana."
          : "Boosts attention, charisma, and verbal fluency."
    },
    {
      id: 'creative',
      name: lang === 'fr' ? "Créativité Theta (Binaural 6 Hz)" : lang === 'ha' ? "Fasaha Theta (6 Hz)" : "Creativity Theta (Binaural 6 Hz)",
      baseFreq: 180,
      beatFreq: 6,
      desc: lang === 'fr' ? "Ouvre les portes de l'inspiration et de la visualisation."
          : lang === 'ha' ? "Yana bude kofofin tunani da wahayi."
          : "Opens gates of inspiration and visualization."
    },
    {
      id: 'introspection',
      name: lang === 'fr' ? "Éveil Spirituel (852 Hz)" : lang === 'ha' ? "Fahimtar Ruhaniya (852 Hz)" : "Spiritual Awakening (852 Hz)",
      baseFreq: 852,
      beatFreq: 0,
      desc: lang === 'fr' ? "Fréquence de retour à l'ordre spirituel et d'intuition profonde."
          : lang === 'ha' ? "Mitar komawa ga asalin ruhaniya da sanin gaibu."
          : "Frequency of spiritual order and deep intuition."
    },
    {
      id: 'rest',
      name: lang === 'fr' ? "Régénération Delta (Binaural 2 Hz)" : lang === 'ha' ? "Hutu Delta (2 Hz)" : "Regeneration Delta (Binaural 2 Hz)",
      baseFreq: 110,
      beatFreq: 2,
      desc: lang === 'fr' ? "Favorise le repos réparateur et l'apaisement total."
          : lang === 'ha' ? "Yana taimakawa hutu mai kyau da samun lafiyar jiki."
          : "Favors deep sleep and total soothing."
    }
  ];
};
