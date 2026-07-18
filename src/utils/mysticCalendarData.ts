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
  // Let's create localized structures for each phase range
  if (hDay === 1 || hDay === 30 || hDay === 29) {
    return {
      name: lang === 'fr' ? "Nouvelle Lune (Al-Hilal Al-Khafi)" : lang === 'ha' ? "Sabuwar Wata (Al-Hilal Al-Khafi)" : "New Moon (Al-Hilal Al-Khafi)",
      arabicName: "الهلال الخفي",
      manzil: "Al-Shuratan (الشَّرَطَان)",
      energy: lang === 'fr' ? "Purification spirituelle, Renouveau intime et Intention Pure (Niyyah)"
            : lang === 'ha' ? "Tsarkake ruhaniya, sabuntawa na cikin zuciya da Kyawun Niyya (Niyyah)"
            : "Spiritual purification, intimate renewal, and Pure Intention (Niyyah)",
      mysticMeaning: lang === 'fr' ? "L'obscurité totale qui caractérise cette phase est le symbole de l'état primordial de l'âme (Al-Fitrah) avant d'être illuminée par la révélation céleste. C'est une nuit de silence absolu où l'ego (An-Nafs) s'efface pour laisser place au miroir pur du cœur."
                   : lang === 'ha' ? "Cikakken duhu na wannan lokaci yana wakiltar asalin ran mutum (Al-Fitrah) kafin hasken wahayi na sama ya mamaye shi. Dare ne na cikakken shiru inda girman kai (An-Nafs) yake gushewa domin zuciya ta zama madubi mai tsabta."
                   : "The total darkness of this phase symbolizes the primordial state of the soul (Al-Fitrah) before being illuminated by celestial revelation. It is a night of absolute silence where the ego (An-Nafs) fades to reveal the pure mirror of the heart.",
      recommendedPractice: lang === 'fr' ? "Prendre un bain de purification spirituelle (Ghusl de l'intention), s'asseoir seul face à la Qiblah dans l'obscurité, et formuler ses intentions les plus nobles pour le mois à venir. Réciter la Sourate Al-Fatiha 7 fois en méditant sur chaque verset."
                         : lang === 'ha' ? "Yi wankan tsarkake ruhaniya (Wankan Niyya), ka zauna kai kadai kana kallon Alqibla a cikin duhu, sannan ka fadi kyawawan niyoyinka na watan mai zuwa. Karanta Suratul Fatiha kafa 7 kana tunani a kan kowace aya."
                         : "Take a bath of spiritual purification (Ghusl of intention), sit alone facing the Qiblah in darkness, and formulate your noblest intentions for the coming month. Recite Surah Al-Fatiha 7 times, meditating on each verse.",
      vibration: lang === 'fr' ? "Énergie de commencement et de réceptivité pure" : lang === 'ha' ? "Kuzari na farawa da cikakkiyar karba" : "Energy of beginning and pure receptivity",
      spiritualSecret: lang === 'fr' ? "Le secret ésotérique de cette lune réside dans le vide sacré : c'est uniquement lorsque le réceptacle du cœur est vidé des illusions de ce monde qu'il peut être rempli des lumières et théophanies divines."
                     : lang === 'ha' ? "Sirrin boye na wannan watan yana cikin zama babu komai: sai kawai lokacin da zuciya ta kasance babu dukkan yaudarar wannan duniya za a iya cika ta da hasken Ubangiji da albarka."
                     : "The esoteric secret of this moon lies in the sacred void: only when the vessel of the heart is emptied of worldly illusions can it be filled with divine light and epiphanies.",
      astronomicalInfo: lang === 'fr' ? "La Lune est en conjonction exacte avec le Soleil. Sa face visible est entièrement plongée dans l'ombre, la rendant invisible à l'œil nu de la Terre. C'est le point zéro du mois synodique lunaire."
                      : lang === 'ha' ? "Wata yana daidai da Rana baki daya. Fuskarsa da muke gani tana cikin duhu, wanda hakan ke sa ba a iya ganinsa da ido daga Duniya. Shi ne mafarin watan hégirien."
                      : "The Moon is in exact conjunction with the Sun. Its visible face is completely in shadow, making it invisible to the naked eye from Earth. It is the zero point of the lunar synodic month.",
      recommendedAsma: lang === 'fr' ? ["يَا بَادِئُ (Ya Badi' - Ô Créateur Originel)", "يَا خَالِقُ (Ya Khaliq - Ô Créateur)", "يَا هَادِي (Ya Hadi - Ô Guide)"]
                     : lang === 'ha' ? ["يَا بَادِئُ (Ya Badi' - Mafari na Asali)", "يَا خَالِقُ (Ya Khaliq - Mahalicci)", "يَا هَادِي (Ya Hadi - Mai Shiryarwa)"]
                     : ["يَا بَادِئُ (Ya Badi' - O Originator)", "يَا خَالِقُ (Ya Khaliq - O Creator)", "يَا هَادِي (Ya Hadi - O Guide)"],
      spiritualKey: lang === 'fr' ? "La clé réside dans le renouvellement sincère du pacte de servitude spirituelle ('Ubudiyyah)."
                  : lang === 'ha' ? "Mabuɗin yana cikin sabunta alkawari na bautar ruhaniya da gaskiya ('Ubudiyyah)."
                  : "The key lies in the sincere renewal of the pact of spiritual servitude ('Ubudiyyah)."
    };
  } else if (hDay >= 2 && hDay <= 6) {
    return {
      name: lang === 'fr' ? "Premier Croissant (Al-Hilal)" : lang === 'ha' ? "Jinjirin Wata na Farko (Al-Hilal)" : "First Crescent (Al-Hilal)",
      arabicName: "الهلال",
      manzil: "Al-Butayn (البُطَيْن)",
      energy: lang === 'fr' ? "Inspiration subtile, Croissance de la foi et Clarté naissante"
            : lang === 'ha' ? "Ruhun wahayi, karuwar imani da bayyanar haske"
            : "Subtle inspiration, growth of faith, and nascent clarity",
      mysticMeaning: lang === 'fr' ? "Le mince filet de lumière qui réapparaît symbolise la manifestation initiale du Verbe divin et de la guidance dans un esprit obscurci. Les voiles commencent à se soulever doucement, révélant les premiers secrets de la sagesse ésotérique."
                   : lang === 'ha' ? "Siririn layin haske da ya sake bayyana yana wakiltar bayyanar kalmar Ubangiji da shiriya a cikin duhu. Labule yana fara dagawa a hankali, yana bayyana sirrin farko na hikima."
                   : "The thin sliver of light reappearing symbolizes the initial manifestation of the divine Word and guidance in a darkened mind. The veils begin to lift gently, revealing the first secrets of esoteric wisdom.",
      recommendedPractice: lang === 'fr' ? "Multiplier les salutations sur le Prophète (Salawat) sous la formule spirituelle 'Allahumma salli 'ala Sayyidina Muhammad' 100 fois pour illuminer l'intellect et dissiper les doutes intérieurs."
                         : lang === 'ha' ? "Yawaita salati ga Annabi (SAW) kafa 100 domin haskaka hankali da kore dukkan waswasi na cikin zuciya."
                         : "Multiply salutations upon the Prophet (Salawat) under the spiritual formula 'Allahumma salli 'ala Sayyidina Muhammad' 100 times to illuminate the intellect and dispel inner doubts.",
      vibration: lang === 'fr' ? "Lumière naissante et éveil de l'intuition céleste" : lang === 'ha' ? "Haske na farko da farkawar tunani na sama" : "Nascent light and awakening of celestial intuition",
      spiritualSecret: lang === 'fr' ? "Ce croissant naissant est intimement lié à la lettre 'Alif' (أ), le premier élan de la création. Il enseigne au croyant que toute grande réalisation commence par une étincelle spirituelle humble mais constante."
                     : lang === 'ha' ? "Wannan jinjirin wata yana da alaka mai karfi da harafin 'Alif' (أ), farkon motsin halitta. Yana koya wa mai imani cewa dukkan babban aiki yana farawa ne da kankanin haske mai dorewa."
                     : "This rising crescent is intimately linked to the letter 'Alif' (أ), the first impulse of creation. It teaches the believer that every great realization begins with a humble but constant spiritual spark.",
      astronomicalInfo: lang === 'fr' ? "La Lune s'éloigne du Soleil vers l'Est. Une infime fraction de sa surface ouest réfléchit la lumière solaire, formant un croissant visible brièvement après le coucher du soleil au-dessus de l'horizon ouest."
                      : lang === 'ha' ? "Wata yana nisantar Rana zuwa Gabas. Kankanin haske a fuskarsa ta yamma ke bayyana bayan faduwar rana."
                      : "The Moon moves away from the Sun towards the East. A tiny fraction of its western surface reflects solar light, forming a crescent visible briefly after sunset above the western horizon.",
      recommendedAsma: lang === 'fr' ? ["يَا نُورُ (Ya Nur - Ô Lumière divine)", "يَا مُبِينُ (Ya Mubin - Ô Manifeste)", "يَا فَتَّاحُ (Ya Fattah - Ô Celui qui ouvre les cœurs)"]
                     : lang === 'ha' ? ["يَا نُورُ (Ya Nur - Haske)", "يَا مُبِينُ (Ya Mubin - Mai Bayyanawa)", "يَا فَتَّاحُ (Ya Fattah - Mai Bude Zukata)"]
                     : ["يَا نُورُ (Ya Nur - O Divine Light)", "يَا مُبِينُ (Ya Mubin - O Manifest)", "يَا فَتَّاحُ (Ya Fattah - O Opener)"],
      spiritualKey: lang === 'fr' ? "La clé est la constance (Istiqaamah) dans les premières étapes de l'effort spirituel."
                  : lang === 'ha' ? "Mabudin shi ne dorewa (Istiqaamah) a farkon matakan kokarin ruhaniya."
                  : "The key is constancy (Istiqaamah) in the early stages of spiritual effort."
    };
  } else if (hDay >= 7 && hDay <= 9) {
    return {
      name: lang === 'fr' ? "Premier Quartier (Al-Tarbî' Al-Awwal)" : lang === 'ha' ? "Rabin Wata na Farko (Al-Tarbî' Al-Awwal)" : "First Quarter (Al-Tarbî' Al-Awwal)",
      arabicName: "التربيع الأول",
      manzil: "Al-Thurayya (الثُّرَيَّا - Les Pléiades)",
      energy: lang === 'fr' ? "Équilibre parfait, Harmonie cosmique et Force de résolution"
            : lang === 'ha' ? "Daidaituwa, zaman lafiya da karfin zuciya"
            : "Perfect balance, cosmic harmony, and strength of resolution",
      mysticMeaning: lang === 'fr' ? "La lune est à moitié illuminée et à moitié sombre. Elle représente l'équilibre sublime entre le Manifeste (Az-Zahir) et le Caché (Al-Batin), ainsi qu'entre la crainte révérencielle (Khawf) et l'espérance aimante (Raja'). C'est l'unification des forces."
                   : lang === 'ha' ? "Wata yana rabi a bude rabi a rufe. Yana wakiltar daidaituwa tsakanin Abin da ke bayyane (Az-Zahir) da na Boye (Al-Batin), da tsoro da kaunar Allah."
                   : "The moon is half illuminated and half dark. It represents the sublime balance between the Manifest (Az-Zahir) and the Hidden (Al-Batin), as well as between reverent fear (Khawf) and loving hope (Raja'). It is the unification of forces.",
      recommendedPractice: lang === 'fr' ? "Réciter la Sourate Yasin en portant une attention particulière aux versets décrivant les orbites célestes. Pratiquer la méditation sur l'équilibre intérieur en respirant calmement."
                         : lang === 'ha' ? "Karanta Suratul Yasin kana mayar da hankali kan ayoyin da ke bayyana tsarin samaniya. Ka yi tunanin samun zaman lafiya a zuciya."
                         : "Recite Surah Yasin, paying special attention to verses describing celestial orbits. Practice inner balance meditation with calm breathing.",
      vibration: lang === 'fr' ? "Alignement des mondes et fermeté dans l'action" : lang === 'ha' ? "Daidaita duniya da juriya a cikin aiki" : "Alignment of worlds and firmness in action",
      spiritualSecret: lang === 'fr' ? "Cette phase révèle le secret de la Voie du Milieu (As-Sirat al-Mustaqim). C'est le moment idéal pour surmonter les excès de l'ego et stabiliser son âme dans la paix et la justice universelle."
                     : lang === 'ha' ? "Wannan lokacin yana bayyana sirrin Hanya Madaidaciya (Siratal Mustaqim). Lokaci ne mai kyau don sarrafa son zuciya da tabbatar da zaman lafiya."
                     : "This phase reveals the secret of the Middle Way (As-Sirat al-Mustaqim). It is the perfect moment to overcome ego's excesses and stabilize the soul in peace and universal justice.",
      astronomicalInfo: lang === 'fr' ? "La Lune a parcouru un quart de son orbite autour de la Terre. L'angle Terre-Lune-Soleil est de 90 degrés. La moitié droite du disque lunaire est illuminée par le soleil, visible l'après-midi et en première partie de nuit."
                      : lang === 'ha' ? "Wata ya cika kwata daya na zagayensa. Daidai kusurwar digiri 90. Rabinsa na dama ne ke da haske."
                      : "The Moon has covered a quarter of its orbit around Earth. The Earth-Moon-Sun angle is 90 degrees. The right half of the lunar disk is illuminated by the sun, visible in afternoon and early night.",
      recommendedAsma: lang === 'fr' ? ["يَا عَدْلُ (Ya 'Adl - Ô Juste Suprême)", "يَا قَوِيُّ (Ya Qawiyy - Ô Fort)", "يَا مُقْسِطُ (Ya Muqsit - Ô Équitable)"]
                     : lang === 'ha' ? ["يَا عَدْلُ (Ya 'Adl - Mai Adalci)", "يَا قَوِيُّ (Ya Qawiyy - Mai Karfi)", "يَا مُقْسِطُ (Ya Muqsit - Mai Raba Gaskiya)"]
                     : ["يَا عَدْلُ (Ya 'Adl - O Supreme Just)", "يَا قَوِيُّ (Ya Qawiyy - O Strong)", "يَا مُقْسِطُ (Ya Muqsit - O Equitable)"],
      spiritualKey: lang === 'fr' ? "La clé réside dans l'intégration harmonieuse des sciences extérieures et des vérités intérieures."
                  : lang === 'ha' ? "Mabudin yana cikin hada ilimin fili da na boye guri guda."
                  : "The key lies in the harmonious integration of outer sciences and inner truths."
    };
  } else if (hDay >= 10 && hDay <= 12) {
    return {
      name: lang === 'fr' ? "Lune Gibbeuse Croissante (Al-Ahdab)" : lang === 'ha' ? "Wata Mai Karuwa (Al-Ahdab)" : "Waxing Gibbous (Al-Ahdab)",
      arabicName: "الأحدب المتzaيد",
      manzil: "Al-Dabaran (الدَّبَرَان)",
      energy: lang === 'fr' ? "Expansion spirituelle intense et Réceptivité spirituelle accrue"
            : lang === 'ha' ? "Daukakar ruhaniya mai zurfi da bude zuciya don karbar haske"
            : "Intense spiritual expansion and increased spiritual receptivity",
      mysticMeaning: lang === 'fr' ? "Le disque lunaire s'emplit de lumière à presque 90%. Les forces invisibles de la nature sont en pleine expansion. Le cœur du croyant s'élargit pour recevoir des secrets théologiques profonds et des inspirations intuitives majeures."
                   : lang === 'ha' ? "Wata yana kusa da cika kashi 90. Karfi na gaibu yana kara bayyana. Zuciyar mai imani tana kara budewa don karbar sirrika da ilimi mai zurfi."
                   : "The lunar disk fills with light to almost 90%. Invisible forces of nature are in full expansion. The believer's heart expands to receive deep theological secrets and major intuitive inspirations.",
      recommendedPractice: lang === 'fr' ? "Consacrer la deuxième partie de la nuit à la contemplation silencieuse (Tafakkur) de la création. Écrire ses réflexions et prier pour l'élévation spirituelle de l'humanité."
                         : lang === 'ha' ? "Kebe kashi na biyu na dare don yin tunani (Tafakkur) a kan halittun Ubangiji. Rubuta abubuwan da ka fahimta sannan ka roki daukaka ga daukacin bil'adama."
                         : "Dedicate the second part of the night to silent contemplation (Tafakkur) of creation. Write your reflections and pray for the spiritual elevation of humanity.",
      vibration: lang === 'fr' ? "Aspiration ardente vers la plénitude spirituelle" : lang === 'ha' ? "Neman daukaka da cikar buri na ruhaniya" : "Ardent aspiration towards spiritual fullness",
      spiritualSecret: lang === 'fr' ? "Le secret ésotérique de cette phase est la préparation du réceptacle : l'âme se polit comme un miroir pour s'apprêter à recevoir le reflet total de la Pleine Lune Sacrée, l'état d'illumination complète."
                     : lang === 'ha' ? "Sirrin boye na wannan lokacin shi ne shiryawa: rai yana tsarkake kansa kamar madubi domin ya shirya karbar cikakken hasken Cikakken Wata (Badr)."
                     : "The esoteric secret of this phase is the preparation of the vessel: the soul polishes itself like a mirror to prepare to receive the total reflection of the Sacred Full Moon, the state of complete illumination.",
      astronomicalInfo: lang === 'fr' ? "La Lune est presque entièrement illuminée, à l'exception d'un mince croissant sombre sur son bord est. Elle se lève en fin d'après-midi et domine le ciel presque toute la nuit."
                      : lang === 'ha' ? "Kusan dukkan fuskarsa tana da haske banda wani siririn bangare a gabas. Yana fitowa da yamma ya dade a sama."
                      : "The Moon is almost entirely illuminated, except for a thin dark crescent on its eastern edge. It rises in late afternoon and dominates the sky almost all night.",
      recommendedAsma: lang === 'fr' ? ["يَا وَاسِعُ (Ya Wasi' - Ô Immense)", "يَا لَطِيفُ (Ya Latif - Ô Infiniment Doux)", "يَا جَمِيلُ (Ya Jamil - Ô Parfaitement Beau)"]
                     : lang === 'ha' ? ["يَا وَاسِعُ (Ya Wasi' - Mai Yalwa)", "يَا لَطِيفُ (Ya Latif - Mai Sauki da Tausayi)", "يَا جَمِيلُ (Ya Jamil - Mai Kyau na Karshe)"]
                     : ["يَا وَاسِعُ (Ya Wasi' - O All-Embracing)", "يَا لَطِيفُ (Ya Latif - O Infinitely Gentle)", "يَا جَمِيلُ (Ya Jamil - O Beautiful)"],
      spiritualKey: lang === 'fr' ? "La clé est l'aspiration ardente (Himmah) à l'union spirituelle sacrée."
                  : lang === 'ha' ? "Mabudin shi ne himma mai karfi (Himmah) don samun kusanci mai tsarki."
                  : "The key is ardent aspiration (Himmah) for sacred spiritual union."
    };
  } else if (hDay >= 13 && hDay <= 15) {
    return {
      name: lang === 'fr' ? "Pleine Lune Sacrée (Al-Badr)" : lang === 'ha' ? "Cikakken Wata (Al-Badr)" : "Sacred Full Moon (Al-Badr)",
      arabicName: "البدر الكامل",
      manzil: "Al-Dhira' (الذِّرَاع) & Al-Nathrah (النَّثْرَة)",
      energy: lang === 'fr' ? "Plénitude absolue, Émanation des lumières et Bénédictions extrêmes"
            : lang === 'ha' ? "Cikakkiyar yalwar haske, kwararar albarka da daukaka ta karshe"
            : "Absolute fullness, emanation of lights, and extreme blessings",
      mysticMeaning: lang === 'fr' ? "C'est l'apogée spirituelle du mois. La lune reflète pleinement la lumière du soleil sans aucun voile, symbolisant l'esprit saint purifié qui transmet fidèlement la lumière divine. Les secrets célestes sont dévoilés aux cœurs éveillés."
                   : lang === 'ha' ? "Wannan ne kololuwar ruhaniya na wata. Wata yana haskaka hasken rana baki daya ba tare da wani labule ba, yana nuna tsarkake zuciya da ke bayyana hasken Ubangiji."
                   : "It is the spiritual climax of the month. The moon fully reflects the sun's light without any veil, symbolizing the purified holy spirit that faithfully transmits divine light. Celestial secrets are unveiled to awakened hearts.",
      recommendedPractice: lang === 'fr' ? "Jeûner les trois 'Jours Blancs' (Ayyam al-Beed - 13, 14, 15), pratiquer de profondes veillées de prière (Qiyam) au clair de lune, et réciter l'invocation de la Lumière (Dua an-Nur) 100 fois."
                         : lang === 'ha' ? "Azumci ranakun fararen kwanaki guda uku (13, 14, 15), ka yi sallolin dare (Kiyamu-laili) a karkashin hasken wata, sannan ka karanta addu'ar haske (Dua'ur Nur) kafa 100."
                         : "Fast the three 'White Days' (Ayyam al-Beed - 13, 14, 15), practice deep night prayer vigils (Qiyam) in moonlight, and recite the invocation of Light (Dua an-Nur) 100 times.",
      vibration: lang === 'fr' ? "Illumination totale et levée des voiles célestes" : lang === 'ha' ? "Cikakken haske da yaye dukkan labule na sama" : "Total illumination and lifting of celestial veils",
      spiritualSecret: lang === 'fr' ? "Le secret ésotérique du Badr est le dévoilement (Kashf) : lors de ces nuits bénies, la communication entre le monde physique et le monde spirituel (Malakut) est facilitée pour ceux dont le cœur est pur."
                     : lang === 'ha' ? "Sirrin boye na Badr shi ne bude gaibu (Kashf): a cikin wadannan darare masu albarka, alaka tsakanin duniyar zahiri da ta ruhaniya (Malakut) tana kasancewa cikin sauki ga dukkan mai tsarkakkiyar zuciya."
                     : "The esoteric secret of Badr is unveiling (Kashf): during these blessed nights, communication between the physical world and the spiritual world (Malakut) is facilitated for those with pure hearts.",
      astronomicalInfo: lang === 'fr' ? "La Lune est en opposition complète avec le Soleil par rapport à la Terre. Son disque visible est entièrement illuminé par la lumière solaire, se levant exactement au coucher du soleil et se couchant à l'aube."
                      : lang === 'ha' ? "Wata yana daidai kishiyar Rana ta yadda haskenta yake mamaye fuskarsa baki daya. Yana fitowa idan rana ta fadi, ya bace idan gari ya waye."
                      : "The Moon is in complete opposition with the Sun relative to Earth. Its visible disk is entirely illuminated by solar light, rising exactly at sunset and setting at dawn.",
      recommendedAsma: ["يَا اللَّهُ (Ya Allah)", "يَا قُدُّوسُ (Ya Quddus - Ô Infiniment Saint)", "يَا جَامِعُ (Ya Jami' - Ô Unificateur)"],
      spiritualKey: lang === 'fr' ? "La clé est la contemplation muette (Mushahadah) de la Splendeur divine."
                  : lang === 'ha' ? "Mabudin shi ne kiyaye shiru da bautar Ubangiji cikin natsuwa (Mushahadah)."
                  : "The key is silent contemplation (Mushahadah) of Divine Splendor."
    };
  } else if (hDay >= 16 && hDay <= 18) {
    return {
      name: lang === 'fr' ? "Lune Gibbeuse Décroissante (Al-Ahdab Al-Mutanaqis)" : lang === 'ha' ? "Wata Mai Raguwa (Al-Ahdab Al-Mutanaqis)" : "Waning Gibbous (Al-Ahdab Al-Mutanaqis)",
      arabicName: "الأحدب المتناقص",
      manzil: "Al-Tarf (الطَّرْف) & Al-Jabhah (الجَبْهَة)",
      energy: lang === 'fr' ? "Transmission des secrets, Sagesse partagée et Générosité"
            : lang === 'ha' ? "Yada sirrika, raba hikima, da kyauta domin Allah"
            : "Transmission of secrets, shared wisdom, and generosity",
      mysticMeaning: lang === 'fr' ? "La lumière commence lentement son retour vers l'intérieur. Après avoir reçu l'illumination lors de la pleine lune, l'âme initiée redescend vers le monde terrestre pour transmettre cette sagesse acquise sous forme de compassion active."
                   : lang === 'ha' ? "Haske yana fara komawa ciki a hankali. Bayan samun haske a lokacin cikakken wata, rai mai hankali yana komawa cikin mutane domin yada hikima ta hanyar tausayi da taimako."
                   : "Light slowly begins its return inward. After receiving illumination during the full moon, the initiated soul returns to the earthly world to transmit this acquired wisdom in the form of active compassion.",
      recommendedPractice: lang === 'fr' ? "Faire des dons secrets, aider les malades ou les affligés, et réciter l'invocation de la Bienveillance suprême. Partager des paroles spirituelles réconfortantes."
                         : lang === 'ha' ? "Yar da sadaka ta boye, taimaka wa marasa lafiya ko masu bukata, sannan ka raba kalmomi na kwantar da hankali."
                         : "Make secret donations, help the sick or distressed, and recite the invocation of Supreme Benevolence. Share comforting spiritual words.",
      vibration: lang === 'fr' ? "Générosité de l'âme et compassion désintéressée" : lang === 'ha' ? "Kyautar zuciya da tausayi ba tare da son kai ba" : "Generosity of soul and selfless compassion",
      spiritualSecret: lang === 'fr' ? "Cette phase enseigne la respiration spirituelle : après l'inspiration de la lumière divine (lors de la croissance), l'âme doit expirer cette lumière sous forme de service aimant à la création (Al-Khidmah)."
                     : lang === 'ha' ? "Wannan lokacin yana koya mana numfashin ruhaniya: bayan shakar hasken Ubangiji (lokacin karuwar wata), dole ne rai ya fitar da wannan haske ta hanyar yi wa halittu hidima (Al-Khidmah)."
                     : "This phase teaches spiritual respiration: after inhaling divine light (during growth), the soul must exhale this light in the form of loving service to creation (Al-Khidmah).",
      astronomicalInfo: lang === 'fr' ? "Le disque lunaire commence à perdre de sa clarté sur son bord ouest. La lune se lève de plus en plus tard dans la nuit et reste visible durant les premières heures de la matinée."
                      : lang === 'ha' ? "Hasken wata yana fara raguwa a hankali daga yamma. Yana fitowa a makare a cikin dare."
                      : "The lunar disk begins to lose its clarity on its western edge. The moon rises later and later in the night and remains visible during the first hours of the morning.",
      recommendedAsma: lang === 'fr' ? ["يَا كَرِيمُ (Ya Karim - Ô Généreux)", "يَا رَؤُوفُ (Ya Ra'uf - Ô Très-Bienveillant)", "يَا نَافِعُ (Ya Nafi' - Ô Dispensateur de bienfaits)"]
                     : lang === 'ha' ? ["يَا كَرِيمُ (Ya Karim - Mai Kyauta)", "يَا رَؤُوفُ (Ya Ra'uf - Mai Tausayi)", "يَا نَافِعُ (Ya Nafi' - Mai Amfanarwa)"]
                     : ["يَا كَرِيمُ (Ya Karim - O Generous)", "يَا رَؤُوفُ (Ya Ra'uf - O Compassionate)", "يَا نَافِعُ (Ya Nafi' - O Bestower of Benefits)"],
      spiritualKey: lang === 'fr' ? "La clé réside dans le service désintéressé des créatures pour l'amour du Créateur."
                  : lang === 'ha' ? "Mabudin yana cikin yi wa bayi hidima domin son Ubangiji."
                  : "The key lies in the selfless service of creatures for the love of the Creator."
    };
  } else if (hDay >= 19 && hDay <= 22) {
    return {
      name: lang === 'fr' ? "Dernier Quartier (Al-Tarbî' Al-Gharbî)" : lang === 'ha' ? "Rabin Wata na Karshe (Al-Tarbî' Al-Gharbî)" : "Last Quarter (Al-Tarbî' Al-Gharbî)",
      arabicName: "التربيع الآخر",
      manzil: "Al-Zubrah (الزُّبْرَة)",
      energy: lang === 'fr' ? "Introspection profonde, Sobriété heureuse et Préservation des secrets"
            : lang === 'ha' ? "Zurfin tunani, natsuwa ta zuciya da kiyaye sirrika"
            : "Deep introspection, happy sobriety, and preservation of secrets",
      mysticMeaning: lang === 'fr' ? "À nouveau à demi-illuminée, la lune invite à la discrétion et à la protection des vérités intimes. L'âme se retire des distractions extérieures du monde manifesté pour se recentrer sur les piliers indestructibles de la foi."
                   : lang === 'ha' ? "Kasancewar wata a rabinsa kuma, yana kira zuwa ga boye abubuwa da kiyaye gaskiya ta ciki. Rai yana janyewa daga dukkan hayaniyar duniya domin mayar da hankali kan ginshikan imani."
                   : "Once again half illuminated, the moon invites discretion and protection of intimate truths. The soul withdraws from the outer distractions of the manifested world to refocus on the indestructible pillars of faith.",
      recommendedPractice: lang === 'fr' ? "Faire silence complet pendant de longues périodes, éteindre les bruits mondains, méditer sur la finitude des choses et réciter l'invocation de protection spirituelle."
                         : lang === 'ha' ? "Kiyaye shiru na tsawon lokaci, kashe dukkan hayaniyar duniya, yi tunani a kan karshen komai, sannan ka karanta addu'o'in kariya."
                         : "Keep complete silence for long periods, turn off worldly noises, meditate on the finiteness of things, and recite the spiritual protection invocation.",
      vibration: lang === 'fr' ? "Sagesse intime, paix de la discrétion et silence" : lang === 'ha' ? "Hikima ta ciki, zaman lafiya da kiyaye sirri" : "Intimate wisdom, peace of discretion, and silence",
      spiritualSecret: lang === 'fr' ? "C'est le secret de la protection des lumières (Hifz al-Asrar) : pour préserver l'intégrité des états mystiques vécus, l'âme doit apprendre à dissimuler ses secrets sacrés sous le voile d'une humble normalité."
                     : lang === 'ha' ? "Wannan ne sirrin kiyaye haske (Hifzul Asrar): domin kare tsarkake ruhunka, dole ne rai ya koyi boye sirrikansa a karkashin tawali'u."
                     : "It is the secret of protecting lights (Hifz al-Asrar): to preserve the integrity of the mystical states experienced, the soul must learn to conceal its sacred secrets under the veil of humble normalcy.",
      astronomicalInfo: lang === 'fr' ? "La Lune est aux trois quarts de sa révolution. La moitié gauche (est) du disque est illuminée. Elle se lève au milieu de la nuit et culmine au méridien à l'aube."
                      : lang === 'ha' ? "Wata yana kashi uku na tafiyarsa baki daya. Rabinsa na hagu ne ke da haske. Yana fitowa a tsakiyar dare."
                      : "The Moon is three-quarters through its revolution. The left (east) half of the disk is illuminated. It rises in the middle of the night and culminates at the meridian at dawn.",
      recommendedAsma: lang === 'fr' ? ["يَا حَفِيظُ (Ya Hafiz - Ô Préservateur)", "يَا بَاطِنُ (Ya Batin - Ô Infiniment Caché)", "يَا قَدِيرُ (Ya Qadir - Ô Tout-Puissant)"]
                     : lang === 'ha' ? ["يَا حَفِيظُ (Ya Hafiz - Mai Tsarewa)", "يَا بَاطِنُ (Ya Batin - Na Boye)", "يَا قَدِيرُ (Ya Qadir - Mai Iko akan komai)"]
                     : ["يَا حَفِيظُ (Ya Hafiz - O Preserver)", "يَا بَاطِنُ (Ya Batin - O Infinitely Hidden)", "يَا قَدِيرُ (Ya Qadir - O All-Powerful)"],
      spiritualKey: lang === 'fr' ? "La clé est le contentement de l'âme (Rida) dans la retraite spirituelle discrète."
                  : lang === 'ha' ? "Mabudin shi ne yarda da kaddara da natsuwa (Rida) a cikin kebewa."
                  : "The key is soul contentment (Rida) in discrete spiritual retreat."
    };
  } else {
    return {
      name: lang === 'fr' ? "Dernier Croissant (Al-Hilal Al-Gharbî)" : lang === 'ha' ? "Jinjirin Wata na Karshe (Al-Hilal Al-Gharbî)" : "Last Crescent (Al-Hilal Al-Gharbî)",
      arabicName: "الهلال الأخير",
      manzil: "Al-Sarfah (الصَّرْفَة) & Al-Awwa (العَوَّاء)",
      energy: lang === 'fr' ? "Extinction de l'ego (Fana'), Repentir pur et Abandon confiant"
            : lang === 'ha' ? "Kawar da girman kai (Fana'), tuba na gaskiya da dogara ga Allah"
            : "Ego extinction (Fana'), pure repentance, and trusting surrender",
      mysticMeaning: lang === 'fr' ? "La lumière décroît presque totalement, symbolisant le retour de l'âme à l'humilité totale et au néant originel devant la majesté divine. C'est l'extinction salutaire de l'ego (Fana') avant la renaissance du prochain cycle."
                   : lang === 'ha' ? "Haske yana raguwa baki daya, yana nuna komawar rai ga tawali'u a gaban Ubangiji. Wannan ne kawar da son kai (Fana') kafin fara sabon zagaye."
                   : "Light decreases almost completely, symbolizing the soul's return to total humility and original nothingness before the divine majesty. It is the salutary extinction of the ego (Fana') before the rebirth of the next cycle.",
      recommendedPractice: lang === 'fr' ? "Multiplier les demandes de pardon (Istighfar) 100 fois par jour avec un cœur sincère, réciter des invocations de remise de soi (Tawakkul) et s'abandonner paisiblement au décret divin."
                         : lang === 'ha' ? "Yawaita istigfari (neman gafara) kafa 100 a kowace rana da gaskiya, sannan ka karanta addu'o'in tawakkali (dogara ga Allah)."
                         : "Multiply requests for forgiveness (Istighfar) 100 times a day with a sincere heart, recite invocations of self-surrender (Tawakkul), and surrender peacefully to the divine decree.",
      vibration: lang === 'fr' ? "Paix spirituelle suprême de l'abandon absolu" : lang === 'ha' ? "Cikakken zaman lafiya na mika wuya ga Allah" : "Supreme spiritual peace of absolute surrender",
      spiritualSecret: lang === 'fr' ? "Cette lune d'argent presque disparue enseigne le lâcher-prise ultime : pour renaître et être illuminé à nouveau, l'homme doit accepter de s'éteindre humblement et de reconnaître son indigence complète (Faqr) devant le Riche absolu."
                     : lang === 'ha' ? "Wannan siririn jinjirin wata da ke shirin batan yana koya mana cikakken mika wuya: domin sake samun haske, dole mutum ya yarda ya zama bashi da komai (Faqr) a gaban Ubangiji Mai Yalwa."
                     : "This almost vanished silver crescent teaches ultimate letting go: to be reborn and illuminated anew, man must accept to humble himself and recognize his complete poverty (Faqr) before the Absolute Rich.",
      astronomicalInfo: lang === 'fr' ? "Un croissant très fin visible uniquement dans les lueurs de l'aube à l'Est, peu de temps avant le lever du soleil. La Lune se rapproche de sa conjonction finale avec le Soleil."
                      : lang === 'ha' ? "Siririn jinjirin wata da ake iya gani kawai a jinjirin safiya a Gabas kafin rana ta fito."
                      : "A very thin crescent visible only in the eastern dawn, shortly before sunrise. The Moon is approaching its final conjunction with the Sun.",
      recommendedAsma: lang === 'fr' ? ["يَا غَفَّارُ (Ya Ghaffar - Ô Pardonneur)", "يَا وَكِيلُ (Ya Wakil - Ô Protecteur suprême)", "يَا صَمَدُ (Ya Samad - Ô Soutien universel)"]
                     : lang === 'ha' ? ["يَا غَفَّارُ (Ya Ghaffar - Mai Gafara)", "يَا وَكِيلُ (Ya Wakil - Wakili na Gaskiya)", "يَا صَمَدُ (Ya Samad - Abin Dogara ga kowa)"]
                     : ["يَا غَفَّارُ (Ya Ghaffar - O Forgiver)", "يَا وَكِيلُ (Ya Wakil - O Supreme Trustee)", "يَا صَمَدُ (Ya Samad - O Eternal Source)"],
      spiritualKey: lang === 'fr' ? "La clé est l'effacement complet de l'ego pour laisser vivre la Présence spirituelle."
                  : lang === 'ha' ? "Mabudin shi ne kawar da son zuciya baki daya domin hasken Ubangiji ya rayu a ranka."
                  : "The key is complete self-effacement to let the spiritual Presence live."
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
