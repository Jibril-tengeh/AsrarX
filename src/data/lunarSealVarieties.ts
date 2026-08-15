// Data structures, graphic symbols, descriptions, and admin utilities for the 17 Lunar Seal Varieties
// Supports French (fr), English (en), and Hausa (ha)

import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type SealStatus = 'active' | 'premium' | 'maintenance' | 'disabled';
export type SealTargetUser = 'all' | 'specialized' | 'premium';

export interface LunarSealVariety {
  id: string;
  groupId: 1 | 2 | 3 | 4;
  groupTitle: {
    fr: string;
    en: string;
    ha: string;
  };
  title: {
    fr: string;
    en: string;
    ha: string;
  };
  subtitle: {
    fr: string;
    en: string;
    ha: string;
  };
  arabicName: string;
  description: {
    fr: string;
    en: string;
    ha: string;
  };
  spiritualUtility: {
    fr: string;
    en: string;
    ha: string;
  };
  ritualUsage: {
    fr: string;
    en: string;
    ha: string;
  };
  elementalProperty: {
    fr: string;
    en: string;
    ha: string;
  };
  incense: {
    fr: string;
    en: string;
    ha: string;
  };
  timing: {
    fr: string;
    en: string;
    ha: string;
  };
  formula: string;
  abjadValue: string;
  graphicSymbol: string;
  graphicSymbolV2?: string;
  defaultStatus: SealStatus;
  defaultTargetUser: SealTargetUser;
}

export const LUNAR_SEAL_VARIETIES: LunarSealVariety[] = [
  // --- GROUPE I : Fondations Mathématiques et Temporelles ---
  {
    id: 'seal_wafq_9x9',
    groupId: 1,
    groupTitle: {
      fr: 'Groupe I : Fondations Mathématiques et Temporelles',
      en: 'Group I: Mathematical and Temporal Foundations',
      ha: 'Rukunin I: Gidauniyar Lissafi da Lokaci'
    },
    title: {
      fr: '1. Le Sceau Planétaire de la Lune (Wafq 9x9)',
      en: '1. The Planetary Seal of the Moon (9x9 Wafq)',
      ha: '1. Hatimin Wata na Duniyoyi (Wafq 9x9)'
    },
    subtitle: {
      fr: 'Matrice Numérique Sacrée de 81 Cases - Carré Magique Lunaire',
      en: 'Sacred 81-Cell Numerical Matrix - Lunar Magic Square',
      ha: 'Gidan Lissafi Mai Tsarki na Gidaje 81'
    },
    arabicName: 'خَاتَمُ القَمَرِ المُتَّسِعُ (وفق ٩×٩)',
    description: {
      fr: "La matrice numérique fondamentale composée de 81 cases (9x9), dont la somme de chaque ligne, colonne et diagonale principale égale 369, pour un total global de 3321. Elle constitue le réceptacle universel des effluves lunaires.",
      en: "The fundamental numerical matrix composed of 81 cells (9x9), where every row, column, and main diagonal sums to 369, totaling 3321. It serves as the universal receptacle for lunar energies.",
      ha: "Gidan lissafi na tushe mai dauke da gidaje 81 (9x9), inda kowane sahu yake ba da jimillar 369, jimillar duka kuma 3321. Shi ne mabudai na dukkan hasken wata."
    },
    spiritualUtility: {
      fr: "Harmonisation globale des fluides corporels, amplification de la mémoire spirituelle et protection contre l'instabilité émotionnelle.",
      en: "Global harmonization of bodily fluids, amplification of spiritual memory, and protection against emotional volatility.",
      ha: "Tada lafiyar jiki, karfafa kwakwalwa da tsare mutum daga rikicewar tunani."
    },
    ritualUsage: {
      fr: "À tracer à l'encre de safran et d'eau de rose un lundi à l'heure de la Lune. Laver le tracé dans de l'eau pure pour l'aspersion ou la boisson spirituelle.",
      en: "Inscribe with saffron ink and rosewater on a Monday during Lunar Hour. Wash the seal in pure water for spiritual sprinkling or drinking.",
      ha: "A rubuta da tawadar za'afaran da ruwan wardi a ranar Litinin a sa'ar wata. A wanke a sha ko a fesa a gida."
    },
    elementalProperty: {
      fr: "Eau Céleste / Froid et Humide (Mā'i)",
      en: "Celestial Water / Cold and Moist (Mā'i)",
      ha: "Ruwan Samaniya / Sanyi da Dumu"
    },
    incense: {
      fr: "Camphre pur, Santal blanc, Gomme d'Oliban",
      en: "Pure Camphor, White Sandalwood, Olibanum Gum",
      ha: "Kafur, Sandal fari, Luban fari"
    },
    timing: {
      fr: "Heure de la Lune (Sā'at al-Qamar) le Lundi au lever du Soleil ou à la Nuit",
      en: "Lunar Hour (Sā'at al-Qamar) on Monday at Sunrise or Nightfall",
      ha: "Sa'ar Wata a ranar Litinin lokacin fitowar rana ko daren ranar"
    },
    formula: 'يَا قَمَرُ يَا زَكِيُّ - 369 / 3321 (Qamar Zaki)',
    abjadValue: '369 / 3321',
    graphicSymbol: ` 🌙 WAFQ QAMAR MUTTASI' (9x9) 🌙
┌───┬───┬───┬───┬───┬───┬───┬───┬───┐
│ 37│ 78│ 29│ 70│ 21│ 62│ 13│ 54│  5│
│  6│ 38│ 79│ 30│ 71│ 22│ 63│ 14│ 45│
│ 46│  7│ 39│ 80│ 31│ 72│ 23│ 55│ 15│
│ 16│ 47│  8│ 40│ 81│ 32│ 64│ 24│ 56│
│ 57│ 17│ 48│  9│ 41│ 73│ 25│ 65│ 33│
│ 34│ 58│ 18│ 49│  1│ 42│ 74│ 26│ 66│
│ 67│ 35│ 59│ 19│ 50│  2│ 43│ 75│ 27│
│ 28│ 68│ 36│ 60│ 20│ 51│  3│ 44│ 76│
│ 77│ 29│ 69│ 10│ 61│ 12│ 52│  4│ 53│
└───┴───┴───┴───┴───┴───┴───┴───┴───┘
   ✦ SOMME SAHU: 369 | TOTAL: 3321 ✦`,
    graphicSymbolV2: ` 🌟 KHATIM AL-QAMAR AL-KABIR 9x9 🌟
         ۞  يَا لَطِيفُ يَا قَمَرُ  ۞
     𐎃  ┌─────────────────────────┐  𐎃
    ────│ 37  78  29  70  21  62  13│────
    ────│  6  38  79  30  71  22  63│────
    ────│ 46   7  39  80  31  72  23│────
    ────│ 57  17  48   9  41  73  25│────
     𐎖  └─────────────────────────┘  𐎖
         ۞   جَبْرَائِيلُ  -  ٣٦٩   ۞
   ✦ RECEPTACLE CELESTE SUPREME ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },
  {
    id: 'seal_hilal',
    groupId: 1,
    groupTitle: {
      fr: 'Groupe I : Fondations Mathématiques et Temporelles',
      en: 'Group I: Mathematical and Temporal Foundations',
      ha: 'Rukunin I: Gidauniyar Lissafi da Lokaci'
    },
    title: {
      fr: '2. Le Sceau du Premier Croissant (Hilal)',
      en: '2. The Seal of the First Crescent (Hilal)',
      ha: '2. Hatimin Sabon Jinjirin Wata (Hilal)'
    },
    subtitle: {
      fr: 'Symbole d’Initiation, de Renouveau et d’Attraction Bénéfique',
      en: 'Symbol of Initiation, Renewal, and Positive Attraction',
      ha: 'Mabudin Sabunta Ruhu da Janyo Alheri'
    },
    arabicName: 'خَاتَمُ الهِلاَلِ الأَوَّلِ (الإِبْتِدَاء)',
    description: {
      fr: "Tracé au tout début du mois lunaire lors de l'apparition du très fin croissant. Il symbolise la naissance de la lumière divine hors des ténèbres de l'inconnu.",
      en: "Inscribed at the very beginning of the lunar cycle upon the sighting of the fine crescent. It symbolizes the rebirth of divine light out of darkness.",
      ha: "Ana rubuta shi a farkon watan musulunci lokacin fitowar jinjirin wata. Yana nuna sabon haske da nasara."
    },
    spiritualUtility: {
      fr: "Ouverture de nouveaux projets, initiation aux études sacrées, déblocage des départs hésitants et prospérité financière.",
      en: "Launching new endeavors, initiation into sacred studies, unblocking sluggish starts, and financial attraction.",
      ha: "Bude sabbin kasuwanci, neman ilimi mai zurfi da bude kofofin arziki."
    },
    ritualUsage: {
      fr: "Regarder le premier croissant au crépuscule, réciter la prière de vision du croissant (Du'a al-Hilal), puis graver le sceau sur un parchemin ou du papier blanc.",
      en: "Gaze at the initial crescent at dusk, recite the Hilal prayer, then engrave or draw the seal on clean parchment.",
      ha: "Kalli jinjirin wata da yamma, yi addu'ar gani da wata, sannan ka rubuta hatimin a farar takarda."
    },
    elementalProperty: {
      fr: "Air Subtil / Humide et Chaud",
      en: "Subtle Air / Moist and Warm",
      ha: "Iska Mai Kyau / Mai Dumi"
    },
    incense: {
      fr: "Fleurs de Jasmin, Benjoin blanc",
      en: "Jasmine Flowers, White Benzoin",
      ha: "Fure mai kamshi, Luban Jawal fari"
    },
    timing: {
      fr: "1er au 3e soir du mois hijri (juste après le coucher du Soleil)",
      en: "1st to 3rd evening of the Hijri month (right after sunset)",
      ha: "Ranar 1 zuwa 3 ga watan musulunci bayan faduwar rana"
    },
    formula: 'رَبِّي وَرَبُّكَ اللَّهُ - هِلاَلُ رُشْدٍ وَخَيْرٍ (Hilal Rushd)',
    abjadValue: '66 / 639',
    graphicSymbol: `   🌙 SCEAU DU PREMIER CROISSANT (HILAL) 🌙
          ★   بِسْمِ اللَّهِ   ★
     ┌────────────────────────┐
     │   ☾  هـ  ـلـ  ا  ل  ☽   │
     │  ١١١   ٦٦   ٥٩   ١٩   │
     │  21   43   18   35    │
     └────────────────────────┘
          ★  فَتْحٌ وَنَصْرٌ  ★
     ✦ ATTRACTION & INITIATION CELESTE ✦`,
    graphicSymbolV2: `   🌟 KHATIM HILAL AN-NUR 🌟
         ☽   بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ   ☾
     𐎃  ┌─────────────────┐  𐎃
    ────│  هـ   ل   ا   ل │────
    ────│ 15   30   1  30 │────
     𐎖  └─────────────────┘  𐎖
         ☽  هَدْيٌ وَرُشْدٌ وَبَرَكَةٌ  ☾
   ✦ CLE DES NOUVEAUX DEPARTS ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },
  {
    id: 'seal_premier_quartier',
    groupId: 1,
    groupTitle: {
      fr: 'Groupe I : Fondations Mathématiques et Temporelles',
      en: 'Group I: Mathematical and Temporal Foundations',
      ha: 'Rukunin I: Gidauniyar Lissafi da Lokaci'
    },
    title: {
      fr: '3. Le Sceau du Premier Quartier',
      en: '3. The First Quarter Seal',
      ha: '3. Hatimin Rabin Wata na Farko'
    },
    subtitle: {
      fr: 'Matrialisation, Construction et Stabilisation des Actions',
      en: 'Materialization, Construction, and Action Stabilization',
      ha: 'Hatimin Ginawa da Tabbatar da Aiki'
    },
    arabicName: 'خَاتَمُ التَّرْبِيعِ الأَوَّلِ (التَّثْبِيت)',
    description: {
      fr: "Correspond à la phase ascendante à 90° du Soleil. Ce sceau équilibre la force active masculine et la réceptivité lunaire pour concrétiser les intentions dans la matière.",
      en: "Corresponds to the waxing 90° angle from the Sun. Balances active strength and lunar receptivity to solidify intentions into form.",
      ha: "Yana zuwa ne lokacin da wata ya kai rabin sa a samaniya. Hatimi ne na karfafa ayyuka da tabbatar da sakamako."
    },
    spiritualUtility: {
      fr: "Stabilisation des entreprises, renforcement de la volonté, protection des constructions et ancrage des bénédictions.",
      en: "Stabilization of business ventures, willpower fortification, building protection, and grounding of blessings.",
      ha: "Karfafa sana'o'i, karfafa zuciya da tsare muhalli."
    },
    ritualUsage: {
      fr: "Graver sur une plaque de cuivre ou tracer sur papier jaune au moment du méridien lunaire. Associer avec le chant du Nom 'Ya Qawi Ya Matin'.",
      en: "Engrave on copper or write on yellow paper during the lunar meridian. Pair with the invocation 'Ya Qawi Ya Matin'.",
      ha: "Rubuta a farantin jan karfe ko yellow takarda karshen sa'ar wata da la'asar."
    },
    elementalProperty: {
      fr: "Terre Subtile / Sec et Froid",
      en: "Subtle Earth / Dry and Cold",
      ha: "Kasa Mai Karfi / Busasshe da Sanyi"
    },
    incense: {
      fr: "Myrrhe rouge, Mastic de Chios",
      en: "Red Myrrh, Chios Mastic",
      ha: "Murr fari da daddoya"
    },
    timing: {
      fr: "du 7e au 9e jour du mois hijri",
      en: "7th to 9th day of the Hijri month",
      ha: "Rana ta 7 zuwa 9 ga watan musulunci"
    },
    formula: 'يَا قَوِيُّ يَا مَتِينُ يَا مُقِيتُ - 116 / 500',
    abjadValue: '116 / 500',
    graphicSymbol: `  📐 SCEAU DU PREMIER QUARTIER (TARBI') 📐
          ⚖️   ثَبَاتٌ وَقُوَّةٌ   ⚖️
     ┌────────────────────────┐
     │ 𐎄   قَوِيٌّ   مَتِينُ   𐎄 │
     │    116     500         │
     │ 𐎏   تَثْبِيتٌ   تَمْكِينٌ   𐎏 │
     └────────────────────────┘
          ⚖️   يَا مُقِيتُ   ⚖️
     ✦ ANCRAGE & STABILISATION CONCRETE ✦`,
    graphicSymbolV2: `   🌟 KHATIM TARBI' AN-NUR 🌟
         🛡️   يَا مَتِينُ   🛡️
     𐎄  ┌─────────────────┐  𐎄
    ────│ 116  500  116  500 │────
    ────│ 500  116  500  116 │────
     𐎏  └─────────────────┘  𐎏
         🛡️   ثَبَاتٌ الدَّارَيْنِ   🛡️
   ✦ FORCE D'ENRACINEMENT SUBLIME ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },
  {
    id: 'seal_badr',
    groupId: 1,
    groupTitle: {
      fr: 'Groupe I : Fondations Mathématiques et Temporelles',
      en: 'Group I: Mathematical and Temporal Foundations',
      ha: 'Rukunin I: Gidauniyar Lissafi da Lokaci'
    },
    title: {
      fr: '4. Le Sceau de la Pleine Lune (Badr)',
      en: '4. The Full Moon Seal (Badr)',
      ha: '4. Hatimin Cikakken Wata (Badr)'
    },
    subtitle: {
      fr: 'Illumination Spirituelle, Révélation et Accomplissement Majeur',
      en: 'Spiritual Illumination, Revelation, and Major Fulfillment',
      ha: 'Cikakken Hasken Ruhu da Bude Sirri'
    },
    arabicName: 'خَاتَمُ البَدْرِ الكَامِلِ (الإِكْمَال وَالكَشْف)',
    description: {
      fr: "Tracé au moment précis où la Lune est en opposition exacte à 180° du Soleil (14e-15e nuit hijri). C'est le sommet absolu de la réceptivité spirituelle et du dévoilement des secrets.",
      en: "Drawn at the exact zenith when the Moon is at 180° full opposition to the Sun (14th-15th Hijri night). Represents the ultimate pinnacle of spiritual clarity and illumination.",
      ha: "Ana amfani da shi lokacin da wata ya cika taf a daren 14 ko 15 na watan musulunci. Shi ne kololuwar hasken ruhaniyya."
    },
    spiritualUtility: {
      fr: "Dévoilement des vérités cachées (Kashf), exaucement fulgurant des demandes nobles, guérison des maux occultes et charisme spirituel.",
      en: "Unveiling hidden truths (Kashf), swift granting of noble prayers, healing occult ailments, and spiritual charisma.",
      ha: "Bude idon basira (Kashf), karbar addu'a da sauri, warware sihiri da samun kwarjini."
    },
    ritualUsage: {
      fr: "Réciter la Surah Al-Inshirah 70 fois en contemplant la Pleine Lune, puis tracer le Sceau du Badr sur un miroir ou sur du papier argenté.",
      en: "Recite Surah Al-Inshirah 70 times while observing the Full Moon, then draw the Badr Seal on silver paper or a mirror.",
      ha: "Karanta Suratul Inshirah kafa 70 kana kallon cikakken wata, sannan ka rubuta hatimin a farar takarda mai kyalli."
    },
    elementalProperty: {
      fr: "Lumière Pure / Éther et Feu Céleste",
      en: "Pure Light / Ether and Celestial Fire",
      ha: "Cikakken Haske / Wutar Samaniya"
    },
    incense: {
      fr: "Encens d'Ambre gris, Musc blanc, Oud royal",
      en: "Ambergris, White Musk, Royal Oud",
      ha: "Turaren Ambar, Musk fari da Oud"
    },
    timing: {
      fr: "14e et 15e nuits du mois hijri (Ayyam al-Beed)",
      en: "14th and 15th nights of the Hijri month (Ayyam al-Beed)",
      ha: "Daren ranar 14 da 15 ga watan musulunci (Kwanaki masu Haske)"
    },
    formula: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالأَرْضِ - نُورٌ عَلَى نُورٍ (Nur ala Nur)',
    abjadValue: '256 / 356',
    graphicSymbol: `   🌕 SCEAU DE LA PLEINE LUNE (BADR) 🌕
          ۞  نُورٌ عَلَى نُورٍ  ۞
     ┌────────────────────────┐
     │  🌕  ن   و   ر   🌕   │
     │ 256  256  256  256     │
     │ 🌕  ك   ش   ف   🌕   │
     └────────────────────────┘
          ۞  يَا نُورُ يَا بَاطِنُ  ۞
     ✦ KASHF & ILLUMINATION DE L'AME ✦`,
    graphicSymbolV2: `   🌟 KHATIM BADR AN-NUR MAGNIFIQUE 🌟
         🌕   اللَّهُ نُورُ السَّمَاوَاتِ   🌕
     𐎃  ┌─────────────────┐  𐎃
    ────│ 256  256  256  256 │────
    ────│ 356  356  356  356 │────
     𐎖  └─────────────────┘  𐎖
         🌕   يَا ظَاهِرُ يَا بَاطِنُ   🌕
   ✦ DEVOILEMENT & REVELATION DIVINE ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },
  {
    id: 'seal_decroissante',
    groupId: 1,
    groupTitle: {
      fr: 'Groupe I : Fondations Mathématiques et Temporelles',
      en: 'Group I: Mathematical and Temporal Foundations',
      ha: 'Rukunin I: Gidauniyar Lissafi da Lokaci'
    },
    title: {
      fr: '5. Le Sceau de la Lune Décroissante',
      en: '5. The Waning Moon Seal',
      ha: '5. Hatimin Wata Yayin Raguwa'
    },
    subtitle: {
      fr: 'Purification, Apaisement, Dissolution des Nœuds et Bannissement',
      en: 'Purification, Pacification, Knot Dissolution, and Banishing',
      ha: 'Tsarkakewa, Kwantar da Hankali da Rushe Sihiri'
    },
    arabicName: 'خَاتَمُ النَّقْصِ وَالمَحَاقِ (التَّطْهِير)',
    description: {
      fr: "Utilisé pendant la seconde moitié du mois lunaire lorsque la lumière s'amenuise. Il dissout les énergies stagnantes, absorbe les influences négatives et purifie les corps subtils.",
      en: "Employed during the second half of the lunar month as illumination decreases. It dissolves stagnant energies, absorbs negativity, and cleanses subtle bodies.",
      ha: "Ana amfani da shi a rabin karshe na watan musulunci lokacin da hasken wata ke raguwa. Hatimi ne na tsaftace rai da warware matsala."
    },
    spiritualUtility: {
      fr: "Apaisement des colères, guérison des blocages karmiques, dissolution des sorcelleries et bannissement des entités perturbatrices.",
      en: "Calming anger, clearing karmic blockages, untying sorceries, and banishing unwanted influences.",
      ha: "Kora aljanu da magance sihiri, kwantar da fushi da share kunci."
    },
    ritualUsage: {
      fr: "Tracé avec de l'eau de mer ou de l'eau salée consacrée. Brûler le parchemin au coucher du Soleil pour libérer la charge négative.",
      en: "Inscribed using consecrated saltwater or seawater. Burn the paper at sunset to release negative burdens.",
      ha: "A rubuta da ruwan gishiri mai tsarki. A kona takardar da yamma domin korar dukkan matsala."
    },
    elementalProperty: {
      fr: "Eau Dissolvante / Froid et Sec",
      en: "Dissolving Water / Cold and Dry",
      ha: "Ruwa Mai Wanke Duhu / Sanyi da Bushewa"
    },
    incense: {
      fr: "Feuilles de Sauge, Sel noir, Rue fétide",
      en: "Sage Leaves, Black Salt, Rue Herb",
      ha: "Ganye na Haba, Gishiri baki da Harmal"
    },
    timing: {
      fr: "Du 19e au 28e jour du mois hijri",
      en: "19th to 28th day of the Hijri month",
      ha: "Ranar 19 zuwa 28 ga watan musulunci"
    },
    formula: 'يَا سَلاَمُ يَا قُدُّوسُ يَا مَانِعُ - 131 / 170 / 161',
    abjadValue: '131 / 170',
    graphicSymbol: `   🌘 SCEAU DE LA LUNE DECROISSANTE 🌘
          🛡️   تَطْهِيرٌ وَسَلاَمٌ   🛡️
     ┌────────────────────────┐
     │ 🌘   سَلاَمٌ   قُدُّوسٌ   🌘 │
     │    131      170        │
     │ 🌘   إِبْطَالٌ   مَحْوٌ   🌘 │
     └────────────────────────┘
          🛡️   يَا مَانِعُ يَا كَافِي   🛡️
     ✦ DISSOLUTION & PURIFICATION ABSOLUE ✦`,
    graphicSymbolV2: `   🌟 KHATIM MAHAQ AN-NUR 🌟
         🛡️   يَا مَانِعُ يَا قُدُّوسُ   🛡️
     𐎃  ┌─────────────────┐  𐎃
    ────│ 131  170  161  131 │────
    ────│ 170  161  131  170 │────
     𐎖  └─────────────────┘  𐎖
         🛡️   سَلاَمٌ قَوْلاً مِنْ رَبٍّ رَحِيمٍ   🛡️
   ✦ SHIELD DE PURIFICATION TOTALE ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },
  {
    id: 'seal_lundi',
    groupId: 1,
    groupTitle: {
      fr: 'Groupe I : Fondations Mathématiques et Temporelles',
      en: 'Group I: Mathematical and Temporal Foundations',
      ha: 'Rukunin I: Gidauniyar Lissafi da Lokaci'
    },
    title: {
      fr: '6. Le Sceau du Jour de la Lune (Lundi / Yaum al-Ithnayn)',
      en: '6. The Seal of the Lunar Day (Monday / Yaum al-Ithnayn)',
      ha: '6. Hatimin Ranar Wata (Litinin / Yaum al-Ithnayn)'
    },
    subtitle: {
      fr: 'Invocations Hebdomadaires, Régence d’Ange Jibril et Esprits Recteurs',
      en: 'Weekly Invocations, Regency of Archangel Gabriel and Ruler Spirits',
      ha: "Hatimin Ranar Litinin na Mala'ika Jibrilu"
    },
    arabicName: 'خَاتَمُ يَوْمِ الإِثْنَيْنِ (جَبْرَائِيل - مُرَّه)',
    description: {
      fr: "Sceau hebdomadaire dédié au Lundi (Yaum al-Ithnayn), régenté par l'Archange Jibril (Gabriel) et l'Esprit recteur Murrah. Il régit la communication spirituelle et la grâce divine.",
      en: "Weekly seal dedicated to Monday, governed by Archangel Gabriel (Jibril) and the ruling spirit Murrah. Governs spiritual communications and divine grace.",
      ha: "Hatimin ranar Litinin karkashin jagorancin Mala'ika Jibrilu. Yana kawo budin magana, albarka da sadarwa ta ruhi."
    },
    spiritualUtility: {
      fr: "Protection pendant les voyages, inspiration poétique et mystique, apaisement du foyer et bénédiction familiale.",
      en: "Travel protection, poetic and mystic inspiration, domestic peace, and family blessings.",
      ha: "Kariya a tafiye-tafiye, fahimtar ruhi da zama lafiya a iyali."
    },
    ritualUsage: {
      fr: "Réciter le Salawat 100 fois le Lundi matin, puis porter le sceau sur soi plié en triangle dans de la soie blanche.",
      en: "Recite Salawat 100 times on Monday morning, then wear the seal folded in a triangle inside white silk.",
      ha: "Karanta Salatin Annabi kafa 100 ranar Litinin da safe, ka linke hatimin a farar alharini ka rike."
    },
    elementalProperty: {
      fr: "Eau de Grâce / Humide",
      en: "Water of Grace / Moist",
      ha: "Ruwan Albarka"
    },
    incense: {
      fr: "Ladanum, Gomme Arabique, Eau de fleur d'oranger",
      en: "Ladanum, Gum Arabic, Orange Blossom Water",
      ha: "Kamshin Furen Laraba"
    },
    timing: {
      fr: "Lundi au lever du Soleil ou à la première heure de la nuit",
      en: "Monday at sunrise or during the 1st night hour",
      ha: "Ranar Litinin da hantsi ko daren ranar"
    },
    formula: 'يَا جَبْرَائِيلُ - سُبْحَانَ اللَّهِ وَبِحَمْدِهِ (Jibril Allah)',
    abjadValue: '245 / 213',
    graphicSymbol: `   🕊️ SCEAU DU LUNDI (YAWUM AL-ITHNAYN) 🕊️
          ★   جَبْرَائِيلُ عَلَيْهِ السَّلاَمُ   ★
     ┌────────────────────────┐
     │ 🕊️   إِثْنَيْنِ   مُرَّه   🕊️ │
     │    563       245       │
     │ 🕊️   حِفْظٌ    بَرَكَةٌ   🕊️ │
     └────────────────────────┘
          ★   يَا حَيُّ يَا قَيُّومُ   ★
     ✦ PROTECTION HEBDOMADAIRE DU LUNDI ✦`,
    graphicSymbolV2: `   🌟 KHATIM JIBRIL AN-NUR 🌟
         🕊️   يَا جَبْرَائِيلُ يَا مُرَّه   🕊️
     𐎃  ┌─────────────────┐  𐎃
    ────│ 245  563  213  245 │────
    ────│ 563  213  245  563 │────
     𐎖  └─────────────────┘  𐎖
         🕊️   سُبْحَانَ اللَّهِ العَظِيمِ   🕊️
   ✦ ALLIANCE HEBDOMADAIRE SANCTIFIEE ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },
  {
    id: 'seal_heures_lunaires',
    groupId: 1,
    groupTitle: {
      fr: 'Groupe I : Fondations Mathématiques et Temporelles',
      en: 'Group I: Mathematical and Temporal Foundations',
      ha: 'Rukunin I: Gidauniyar Lissafi da Lokaci'
    },
    title: {
      fr: '7. Les Sceaux des Heures Lunaires',
      en: '7. Seals of the Lunar Hours',
      ha: "7. Hatimin Sa'oin Wata"
    },
    subtitle: {
      fr: 'Caractères Linéaires Simplifiés pour Actions Rapides et Micro-Rituels',
      en: 'Simplified Linear Glyphs for Fast Actions and Micro-Rituals',
      ha: 'Hatimin Ayyukan Gaggawa na Sa\'ar Wata'
    },
    arabicName: 'خَوَاتِمُ السَّاعَاتِ القَمَرِيَّةِ (التَّصَرُّف السَّرِيع)',
    description: {
      fr: "Glyphes théurgiques et caractères informels tracés lors des créneaux horaires régis par la Lune chaque jour. Ils servent d'interrupteurs spirituels pour des besoins urgents et ponctuels.",
      en: "Informal theurgic glyphs designed to be drawn during specific planetary hours ruled by the Moon each day. They act as spiritual switches for immediate micro-actions.",
      ha: "Rukunin hatimai na gaggawa da ake amfani da su a sa'ar wata na kowace rana domin samun taimako na nan take."
    },
    spiritualUtility: {
      fr: "Calmer une dispute imprévue, obtenir la clarté immédiate avant un examen ou un entretien, apaiser une migraine ou un stress subit.",
      en: "Settle sudden arguments, acquire instant clarity before exams, soothe migraines or sudden stress.",
      ha: "Kashe takaddama ba tammama, samun nasara a jarrabawa ko fira, da samun saukin ciwon kai."
    },
    ritualUsage: {
      fr: "Dessiner le talisman miniature du bout du doigt avec de l'eau pure sur le front ou la paume de la main droite durant l'heure lunaire.",
      en: "Trace the miniature seal using pure water with your index finger onto your forehead or right palm during Lunar Hour.",
      ha: "Yi amfani da yatsanka ka shafa ruwa mai tsarki ka zana hatimin a goshinka ko tafin hannunka na dama."
    },
    elementalProperty: {
      fr: "Onde Éphémère / Fluide",
      en: "Ephemeral Wave / Fluid",
      ha: "Iska Mai Sauke Cuki"
    },
    incense: {
      fr: "Encens rapide en bâtonnet (Santal ou Rose)",
      en: "Fast Incense Stick (Sandalwood or Rose)",
      ha: "Turaren Sanda mai Kamshi"
    },
    timing: {
      fr: "1re, 8e ou 15e heure planétaire de la journée / nuit",
      en: "1st, 8th, or 15th planetary hour of the day/night",
      ha: "Sa'a ta 1, 8 ko 15 na ranar"
    },
    formula: 'يَا سَرِيعُ يَا مُجِيبُ - 312 (Ya Saree\')',
    abjadValue: '312',
    graphicSymbol: `   ⏱️ SCEAU DES HEURES LUNAIRES ⏱️
          ⚡  سَرِيعٌ مُجِيبٌ  ⚡
     ┌────────────────────────┐
     │ 𐎃  𐎄  𐎏  𐎓  𐎖  𐎐  𐎏 │
     │  ٣١٢   ٣١٢   ٣١٢   ٣١٢ │
     │  ✦ ⚡ 🌙 ⚡ ✦  │
     └────────────────────────┘
          ⚡  عَجَلٌ عَجَلٌ  ⚡
     ✦ DECTENCHEMENT SPIRITUEL RAPIDE ✦`,
    graphicSymbolV2: `   🌟 KHATIM SA'AT QAMARIYYA 🌟
         ⏱️   يَا سَرِيعُ يَا مُجِيبُ   ⏱️
     𐎃  ┌─────────────────┐  𐎃
    ────│ 𐎃  312  312  𐎃 │────
    ────│ 𐎖  312  312  𐎖 │────
     𐎖  └─────────────────┘  𐎖
         ⏱️   فِي لَحْظَةٍ وَعَيْنٍ   ⏱️
   ✦ RESOLUTION INSTANTANEE ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },

  // --- GROUPE II : Configurations Astronomiques et Orbitales ---
  {
    id: 'seal_manazil_28',
    groupId: 2,
    groupTitle: {
      fr: 'Groupe II : Configurations Astronomiques et Orbitales',
      en: 'Group II: Astronomical and Orbital Configurations',
      ha: 'Rukunin II: Matsayin Taurawoji da Sararin Samaniya'
    },
    title: {
      fr: '8. Les Sceaux des 28 Demeures Lunaires (Manazil al-Qamar)',
      en: '8. Seals of the 28 Lunar Mansions (Manazil al-Qamar)',
      ha: '8. Hatimin Manazil al-Qamar 28'
    },
    subtitle: {
      fr: 'Cartographie Théurgique des 28 Stations du Zodiaque Céleste',
      en: 'Theurgic Mapping of the 28 Celestial Zodiac Stations',
      ha: 'Taswirar Manzilin Wata 28 na Sararin Samaniya'
    },
    arabicName: 'خَوَاتِمُ المَنَازِلِ الثَّمَانِيَةِ وَالعِشْرِينَ',
    description: {
      fr: "Une série sacrée de 28 sceaux distincts correspondant à chaque demeure traversée par la Lune en 27,3 jours (de Ash-Sharatan à Ar-Risha). Chaque demeure possède son ange, sa formule et sa spécialité.",
      en: "A sacred series of 28 distinct seals corresponding to each mansion traversed by the Moon in 27.3 days (from Ash-Sharatan to Ar-Risha). Each mansion possesses its unique ruling angel and specialty.",
      ha: "Hatimi 28 na kowace tashar da wata yake wucewa a samaniya daga Ash-Sharatan zuwa Ar-Risha. Kowane manzili yana da mala'ika da sirrin kansa."
    },
    spiritualUtility: {
      fr: "Alignement précis selon la position exacte de la Lune : fertilité, réconciliation, protection contre la noyade, commerce, succès dans la parole.",
      en: "Precise alignment according to the exact lunar position: fertility, reconciliation, sea travel safety, trade, eloquent speech.",
      ha: "Neman dace bisa tsakiyar matsayin wata: haihuwa, sula, nasara a kasuwanci da fasahar magana."
    },
    ritualUsage: {
      fr: "Identifier la demeure lunaire du jour (via l'Astrolabe de l'application), puis méditer ou imprimer le Sceau spécifique de cette demeure.",
      en: "Identify today's lunar mansion (using the app's Astrolabe), then meditate upon or print the specific mansion's seal.",
      ha: "Bincika manzilin wata na ranar a aikace-aikacen AsrarHub, sannan ka yi amfani da hatimin da ya dace."
    },
    elementalProperty: {
      fr: "Septénaire / Zodiaque Lunaire",
      en: "Septenary / Lunar Zodiac",
      ha: "Madaidaicin Tsarin Samaniya"
    },
    incense: {
      fr: "Encens correspondant à la demeure (Santal, Oud, Camphre, Storax)",
      en: "Incense matching the specific mansion (Sandalwood, Oud, Camphor, Storax)",
      ha: "Turaren da ya dace da manzilin"
    },
    timing: {
      fr: "Variable selon la demeure active (changement toutes les 24 heures environ)",
      en: "Variable according to active mansion (changes roughly every 24 hours)",
      ha: "A duk lokacin da watan ya shiga sabon manzili"
    },
    formula: 'مَنَازِلُ القَمَرِ الـ ٢٨ - بِسْمِ اللَّهِ المَجِيدِ (Manazil 28)',
    abjadValue: '28 / 2800',
    graphicSymbol: `   🌌 SCEAU DES 28 DEMEURES LUNAIRES 🌌
          ۞   مَنَازِلُ القَمَرِ   ۞
     ┌────────────────────────┐
     │ 1.الشَّرَطَان  ...  28.الرِّشَاء│
     │ 𐎃  𐎄  𐎏  𐎓  𐎖  𐎐  𐎏 │
     │  28 STATIONS CELESTES  │
     └────────────────────────┘
          ۞   مِفْتَاحُ الكَوْنِ   ۞
     ✦ ALIGNEMENT ASTROLOGIQUE MAGISTRAL ✦`,
    graphicSymbolV2: `   🌟 KHATIM MANAZIL AL-QAMAR 28 🌟
         🌌   مَنَازِلُ السَّمَاءِ   🌌
     𐎃  ┌─────────────────┐  𐎃
    ────│ 1..7   8..14   │────
    ────│ 15..21 22..28  │────
     𐎖  └─────────────────┘  𐎖
         🌌   تَقْدِيرُ العَزِيزِ العَلِيمِ   🌌
   ✦ ALLIANCE ASTRO-THEURGIQUE COMPLET ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },
  {
    id: 'seal_noeuds_lunaires',
    groupId: 2,
    groupTitle: {
      fr: 'Groupe II : Configurations Astronomiques et Orbitales',
      en: 'Group II: Astronomical and Orbital Configurations',
      ha: 'Rukunin II: Matsayin Taurawoji da Sararin Samaniya'
    },
    title: {
      fr: '9. Les Sceaux des Nœuds Lunaires (Tête et Queue du Dragon / Rahu et Ketu)',
      en: '9. Seals of the Lunar Nodes (Head and Tail of the Dragon / Rahu and Ketu)',
      ha: "9. Hatimin Kai da Wutsiyar Maciji na Wata (Al-Ras da Al-Dhanab)"
    },
    subtitle: {
      fr: 'Nœud Nord (Al-Ras) pour l’Abondance / Nœud Sud (Al-Dhanab) pour la Protection',
      en: 'North Node (Al-Ras) for Abundance / South Node (Al-Dhanab) for Protection',
      ha: 'Al-Ras domin Arziki da Al-Dhanab domin Kariya'
    },
    arabicName: 'خَاتَمَا الرَّأْسِ وَالذَّنَبِ (الرَّأْسِ وَالذَّنَبِ اللَّذَيْنِ لِلْقَمَر)',
    description: {
      fr: "Deux sceaux jumeaux. Le Sceau de la Tête du Dragon (Al-Ras / Nœud Nord) stimule l'expansion, le gain financier et l'élévation. Le Sceau de la Queue (Al-Dhanab / Nœud Sud) repousse la poisse, dissout le mauvais œil et scelle la protection.",
      en: "Twin seals. The Dragon's Head Seal (Al-Ras / North Node) boosts material gain and elevation. The Dragon's Tail Seal (Al-Dhanab / South Node) shields against malevolence and dissolves evil eye.",
      ha: "Hatimi guda biyu: Na farko (Al-Ras) yana bunkasa arziki da matsayi. Na biyu (Al-Dhanab) yana kariya daga hassada da maita."
    },
    spiritualUtility: {
      fr: "Nœud Nord : Prospérité, puissance d'attraction. Nœud Sud : Désenvoûlement, protection contre les entités et libération karmique.",
      en: "North Node: Wealth expansion, attraction power. South Node: Exorcism, spirit protection, karmic release.",
      ha: "Tête: Samun dukiya da kwarjini. Tail: Korar maita, aljanu da warware mummuna kaddara."
    },
    ritualUsage: {
      fr: "Utiliser le Sceau du Nœud Nord le jeudi ou le lundi pour les affaires financières. Utiliser le Sceau du Nœud Sud le samedi pour purifier une demeure.",
      en: "Use North Node Seal on Thursdays/Mondays for prosperity affairs. Use South Node Seal on Saturdays for house purification.",
      ha: "A yi amfani da Al-Ras a ranar Alhamis ko Litinin domin kasuwanci. A yi amfani da Al-Dhanab a ranar Asabar domin gyaran gida."
    },
    elementalProperty: {
      fr: "Axe Céleste Dual / Magnetico-Électrique",
      en: "Dual Celestial Axis / Magneto-Electric",
      ha: "Tsarukan Wuta da Ruwa"
    },
    incense: {
      fr: "Tête : Safran et Santal rouge / Queue : Soufre minéral et Asafœtida",
      en: "Head: Saffron & Red Sandalwood / Tail: Mineral Sulfur & Asafoetida",
      ha: "Al-Ras: Za'afaran / Al-Dhanab: Turaren Kariya"
    },
    timing: {
      fr: "Passage exact de la Lune sur les nœuds astronomiques",
      en: "Exact transit of the Moon across astronomical nodes",
      ha: "Lokacin da wata ya hau tsakiyar mahaɗar taurari"
    },
    formula: 'الرَّأْسُ (زِيَادَةٌ وَعِزٌّ) / الذَّنَبُ (دَفْعٌ وَحِمَايَةٌ)',
    abjadValue: '301 / 770',
    graphicSymbol: ` 🐲 SCEAUX DES NOEUDS LUNAIRES (RAHU & KETU) 🐲
       🐉 NOEUD NORD (AL-RAS) 🐉    🐉 NOEUD SUD (AL-DHANAB) 🐉
     ┌────────────────────────┐  ┌────────────────────────┐
     │ 🐉   الرَّأْسُ   301   │  │ 🐉   الذَّنَبُ   770   │
     │ ↗ GAIN MATERIAL & BARK │  │ 🛡️ DISSOLUTION & ENVOI│
     └────────────────────────┘  └────────────────────────┘
     ✦ DEUX FACES DU DRAGON CELESTE LUNAIRE ✦`,
    graphicSymbolV2: `   🌟 KHATIM AL-RAS WA AL-DHANAB 🌟
         🐉   الرَّأْسُ وَالذَّنَبُ   🐉
     𐎃  ┌─────────────────┐  𐎃
    ────│  301  770  301  │────
    ────│  770  301  770  │────
     𐎖  └─────────────────┘  𐎖
         🐉   تَوَازُنُ القُطْبَيْنِ   🐉
   ✦ EQUILIBRE DES AXES DRACONIQUES ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },
  {
    id: 'seal_eclipses',
    groupId: 2,
    groupTitle: {
      fr: 'Groupe II : Configurations Astronomiques et Orbitales',
      en: 'Group II: Astronomical and Orbital Configurations',
      ha: 'Rukunin II: Matsayin Taurawoji da Sararin Samaniya'
    },
    title: {
      fr: '10. Le Sceau des Éclipses Lunaires (Khatim al-Khasuf)',
      en: '10. The Lunar Eclipse Seal (Khatim al-Khasuf)',
      ha: '1. Hatimin Kusufin Wata (Khatim al-Khasuf)'
    },
    subtitle: {
      fr: 'Choc Théurgique Majeur, Rupture de Cycles Négatifs et Neutralisation',
      en: 'Major Theurgic Impact, Negative Cycle Breaker, and Neutralization',
      ha: 'Hatimin Katse Kaddara Mummuna Yayin Kusufi'
    },
    arabicName: 'خَاتَمُ خُسُوفِ القَمَرِ (القَطْعُ وَالإِبْطَالُ العَظِيم)',
    description: {
      fr: "Tracé exclusivement durant les minutes exactes d'une éclipse lunaire (Khasuf). C'est un instrument d'une puissance redoutable pour trancher définitivement les nœuds du passé et détruire les sortilèges héréditaires.",
      en: "Inscribed exclusively during the exact window of a lunar eclipse (Khasuf). A formidable theurgic key used to shatter ancestral curses and sever toxic karmic cords.",
      ha: "Ana rubuta shi kawai a tsakiyar mintuna na kusufin wata. Hatimi ne mai karfi na ruguza maita da tsohuwar kaddara mummuna."
    },
    spiritualUtility: {
      fr: "Shattering hereditary curses, neutralizing dark magic, sudden release of toxic bonds, and spiritual rebirth.",
      en: "Shattering hereditary curses, neutralizing dark magic, sudden release of toxic bonds, and spiritual rebirth.",
      ha: "Karya sihiri na gado, kubuta daga tsohuwar matsala da sake samun sabuwar rayuwa."
    },
    ritualUsage: {
      fr: "Effectuer la Salat al-Khasuf (Prière de l'Éclipse), puis tracer le Sceau à l'encre noire sanctifiée au moment du maximum de l'ombre terrestre.",
      en: "Perform Salat al-Khasuf (Eclipse Prayer), then draw the Seal using sanctified black ink at the peak of totality.",
      ha: "Yi sallat al-Khasuf (Sallar Kusufi), sannan ka rubuta hatimin da baki tawada a tsakiyar kusufin."
    },
    elementalProperty: {
      fr: "Ténébreux Céleste converti en Lumière",
      en: "Celestial Umbra converted to Light",
      ha: "Duhen Kusufi da Ke Mai da Haske"
    },
    incense: {
      fr: "Storax noir, Galbanum, Myrrhe sacrée",
      en: "Black Storax, Galbanum, Sacred Myrrh",
      ha: "Turaren Luban baki"
    },
    timing: {
      fr: "Exactement pendant la phase d'ombre totale ou partielle de l'Éclipse Lunaire",
      en: "Strictly during the total or partial shadow phase of a Lunar Eclipse",
      ha: "A tsakiyar mintuna na kusufin wata kadai"
    },
    formula: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ - خُسُوفٌ وَتَطْهِيرٌ',
    abjadValue: '686 / 1000',
    graphicSymbol: `   🌒 SCEAU DE L'ECLIPSE LUNAIRE (KHASUF) 🌒
          🛡️  قَطْعٌ وَإِبْطَالٌ عَظِيمٌ  🛡️
     ┌────────────────────────┐
     │ 🌒   خُسُوفٌ   1000    │
     │ 🗡️ RUPTURE DU PASSE    │
     │ 🛡️ DISSOLUTION MAGIQUE │
     └────────────────────────┘
          🛡️  يَا قَهَّارُ يَا جَبَّارُ  🛡️
     ✦ CLE SUPREME DE DESTRUCTION DES BLOCAGES ✦`,
    graphicSymbolV2: `   🌟 KHATIM KHASUF AN-NUR 🌟
         🌒   يَا قَهَّارُ يَا مُحْيِي   🌒
     𐎃  ┌─────────────────┐  𐎃
    ────│ 686  1000  686 │────
    ────│ 1000  686 1000 │────
     𐎖  └─────────────────┘  𐎖
         🌒   وَقُلْ جَاءَ الحَقُّ وَزَهَقَ البَاطِلُ   🌒
   ✦ DESTRUCTION DES CHAINES SOMBRES ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },

  // --- GROUPE III : Compositions Théurgiques et d'Alliance ---
  {
    id: 'seal_sharaf_qamar',
    groupId: 3,
    groupTitle: {
      fr: "Groupe III : Compositions Théurgiques et d'Alliance",
      en: 'Group III: Theurgic Compositions and Alliances',
      ha: "Rukunin III: Hadakar Ruhi da Agajin Samaniya"
    },
    title: {
      fr: "11. Le Sceau d'Exaltation de la Lune (Khatim Sharaf al-Qamar)",
      en: '11. The Lunar Exaltation Seal (Khatim Sharaf al-Qamar)',
      ha: '11. Hatimin Daukakar Wata (Sharaf al-Qamar)'
    },
    subtitle: {
      fr: 'Sommet Annuel au 3e Degré du Taureau - Talisman Royal de Protection et Réussite',
      en: 'Annual Zenith at 3° Taurus - Royal Talisman of Protection and Success',
      ha: 'Hatimin Kololuwar Daukaka da Nasara na Shekara'
    },
    arabicName: 'خَاتَمُ شَرَفِ القَمَرِ (الثَّوْر 3°)',
    description: {
      fr: "Tracé une seule fois par an lorsque la Lune traverse exactement le 3e degré du signe du Taureau (sa position de dignité maximale). C'est l'un des talismans majeurs de la science hermétique arabe.",
      en: "Inscribed only once a year when the Moon traverses the 3rd degree of Taurus (its highest exaltation). Ranked among the most prized talismans in classical Arabic hermetism.",
      ha: "Ana rubuta shi sau guda kacal a shekara lokacin da wata ya shiga matsayin daukakarsa a Tauraruwar Taureau (digiri na 3). Hatimi ne na sarakuna."
    },
    spiritualUtility: {
      fr: "Protection royale contre tous maux, fortune matérielle ininterrompue, prestige social, victoire dans les jugements et rayonnement personnel.",
      en: "Royal immunity, uninterrupted financial fortune, elevated social status, legal victories, and personal radiance.",
      ha: "Kariya irin ta sarakuna, buɗe kasuwanci, samun kwarjini da nasara a shari'a."
    },
    ritualUsage: {
      fr: "Graver sur une médaille d'argent pur ou tracer sur soie jaune à l'heure exacte du Sharaf. Conserver dans un étui en cuir précieux.",
      en: "Engrave on pure silver medal or draw on yellow silk during the exact Sharaf hour. Store in a leather pouch.",
      ha: "A zana a farantin azurfa ko alharini yellow a sa'ar daukakar wata."
    },
    elementalProperty: {
      fr: "Argent Céleste / Noblesse Terrestre",
      en: "Celestial Silver / Terrestrial Nobility",
      ha: "Azurfar Samaniya da Karfin Dukiya"
    },
    incense: {
      fr: "Ambre d'Orient, Musc d'Asie, Safran pur",
      en: "Oriental Amber, Asian Musk, Pure Saffron",
      ha: "Ambar da Za'afaran fari"
    },
    timing: {
      fr: "Moment exact où la Lune est à 3° du Taureau (se produit 1 fois par an pendant environ 2h)",
      en: "Exact window when Moon is at 3° Taurus (occurs once yearly for ~2 hours)",
      ha: "Lokaci guda sau 1 a shekara lokacin daukakar wata"
    },
    formula: 'شَرَفُ القَمَرِ - يَا بَاسِطُ يَا غَنِيُّ (Sharaf Qamar)',
    abjadValue: '72 / 1060',
    graphicSymbol: `   👑 SCEAU D'EXALTATION DE LA LUNE (SHARAF) 👑
          ۞  شَرَفُ القَمَرِ فِي الثَّوْرِ  ۞
     ┌────────────────────────┐
     │ 👑   شَرَفٌ   1060    │
     │ 💎 ARGENT PUR & GAH   │
     │ 🛡️ PROTECTION ROYALE  │
     └────────────────────────┘
          ۞  يَا بَاسِطُ يَا غَنِيُّ  ۞
     ✦ TALISMAN SUPREME DE REUSSITE ANNUELLE ✦`,
    graphicSymbolV2: `   🌟 KHATIM SHARAF AL-QAMAR 🌟
         👑   شَرَفُ القَمَرِ المَجِيدُ   👑
     𐎃  ┌─────────────────┐  𐎃
    ────│ 72   1060  72  │────
    ────│ 1060  72  1060 │────
     𐎖  └─────────────────┘  𐎖
         👑   يَا بَاسِطُ يَا ذَا الجَلاَلِ   👑
   ✦ PRESTIGE ET RICHESSE PERPETUELLE ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },
  {
    id: 'seal_conjonctions',
    groupId: 3,
    groupTitle: {
      fr: "Groupe III : Compositions Théurgiques et d'Alliance",
      en: 'Group III: Theurgic Compositions and Alliances',
      ha: "Rukunin III: Hadakar Ruhi da Agajin Samaniya"
    },
    title: {
      fr: '12. Les Sceaux des Conjonctions Royales (Lune-Jupiter ou Lune-Soleil)',
      en: '12. Royal Conjunction Seals (Moon-Jupiter or Moon-Sun)',
      ha: '12. Hatimin Hadaka na Sarakuna (Wata da Mushtari / Wata da Rana)'
    },
    subtitle: {
      fr: 'Alliances Harmonieuses pour l’Abondance, l’Union et la Grande Grâce',
      en: 'Harmonious Alliances for Abundance, Union, and Great Grace',
      ha: 'Hatimin Hada Karfin Wata da Mushtari ko Rana'
    },
    arabicName: 'خَاتَمُ القِرَانَاتِ المَلَكِيَّةِ (قِمَةُ السَّعْدَيْن)',
    description: {
      fr: "Compositions mixtes combinant les carrés de la Lune avec ceux de Jupiter (Al-Mushtari) ou du Soleil (Ash-Shams) lors des conjonctions bénéfiques. Elles fusionnent la richesse, la sagesse et la lumière.",
      en: "Composite grids fusing the Moon's square with Jupiter (Al-Mushtari) or the Sun (Ash-Shams) during favorable conjunctions. Unites prosperity, wisdom, and solar radiance.",
      ha: "Hadaddiyar sahu da ke gauraya karfin wata da tauraruwar Mushtari ko Rana lokacin haɗuwarsu mai albarka."
    },
    spiritualUtility: {
      fr: "Attraction de capitaux massifs, mariages bénis, harmonie dans les couples, faveurs des dirigeants et autorité bienveillante.",
      en: "Attracting capital, blessed marriages, marital harmony, goodwill from authorities, and benevolent influence.",
      ha: "Samun dukiya mai yawa, auren alheri, zaman lafiyar aure da samun karbuwa wajen shugabanni."
    },
    ritualUsage: {
      fr: "À composer lors de la conjonction exacte de la Lune et de Jupiter. Réciter l'Asma 'Ya Fattah Ya Razzaq' 308 fois.",
      en: "Construct during the exact lunar-Jupitère conjunction. Recite 'Ya Fattah Ya Razzaq' 308 times.",
      ha: "A rubuta yayin haɗuwar wata da Mushtari. A karanta 'Ya Fattah Ya Razzaq' kafa 308."
    },
    elementalProperty: {
      fr: "Air et Eau Céleste / Chaud et Humide",
      en: "Celestial Air & Water / Warm and Moist",
      ha: "Hasken Samaniya na Arziki"
    },
    incense: {
      fr: "Aloès, Safran, Mastic noble",
      en: "Aloeswood, Saffron, Noble Mastic",
      ha: "Oud da Za'afaran fari"
    },
    timing: {
      fr: "Lors des conjonctions ou trines exacts Lune-Jupiter ou Lune-Soleil",
      en: "During exact conjunctions or trines of Moon-Jupiter / Moon-Sun",
      ha: "Yayin haɗuwar wata da Mushtari ko Rana"
    },
    formula: 'سَعْدُ السُّعُودِ - يَا فَتَّاحُ يَا رَزَّاقُ (Sa\'d al-Su\'ud)',
    abjadValue: '489 / 308',
    graphicSymbol: `   👑 SCEAU DES CONJONCTIONS ROYALES (QIRAN) 👑
          ۞  قِرَانُ القَمَرِ وَالمُشْتَرِي  ۞
     ┌────────────────────────┐
     │ 🌙 QAMAR (369)  🪷 JUPITER (34)│
     │  489    308    489     │
     │ 💰 WEALTH & ROYAL MARRIAGE │
     └────────────────────────┘
          ۞  سَعْدُ السُّعُودِ العَظِيمُ  ۞
     ✦ ALLIANCE DIVINE DE PROSPERITE ✦`,
    graphicSymbolV2: `   🌟 KHATIM AL-QIRAN AL-MALAKI 🌟
         👑   قِرَانُ السَّعْدَيْنِ   👑
     𐎃  ┌─────────────────┐  𐎃
    ────│ 489  308  489  308 │────
    ────│ 308  489  308  489 │────
     𐎖  └─────────────────┘  𐎖
         👑   فَتْحٌ وَرِزْقٌ وَبَرَكَةٌ   👑
   ✦ ABONDANCE ET NOBLESSE DIVINE ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },
  {
    id: 'seal_wafq_jami',
    groupId: 3,
    groupTitle: {
      fr: "Groupe III : Compositions Théurgiques et d'Alliance",
      en: 'Group III: Theurgic Compositions and Alliances',
      ha: "Rukunin III: Hadakar Ruhi da Agajin Samaniya"
    },
    title: {
      fr: '13. Le Sceau de Synthèse des 28 Demeures (Al-Wafq al-Jami\')',
      en: '13. Synthesis Seal of the 28 Mansions (Al-Wafq al-Jami\')',
      ha: '13. Hatimin Hadaka na Manazili 28 (Al-Wafq al-Jami\')'
    },
    subtitle: {
      fr: 'Grille Géométrique et Mathématique Condensant les 28 Stations Lunaires',
      en: 'Geometric and Mathematical Grid Condensing All 28 Lunar Stations',
      ha: 'Hatimin Tattara Karfin Manazili 28 Baki Daya'
    },
    arabicName: 'الوَفْقُ الجَامِعُ لِلْمَنَازِلِ الثَّمَانِيَةِ وَالعِشْرِين',
    description: {
      fr: "Une œuvre d'ingénierie théurgique suprême qui rassemble les valeurs numériques et les Noms angéliques des 28 demeures en un seul talisman géométrique universel.",
      en: "A masterpiece of advanced theurgy that consolidates the numerical keys and angelic signatures of all 28 lunar mansions into a single universal talisman.",
      ha: "Babban hatimin lissafi da ke tattara dukkan karfin manzili 28 na wata guri guda."
    },
    spiritualUtility: {
      fr: "Maîtrise des influences temporelles, protection universelle permanente, harmonisation de tous les aspects de la vie.",
      en: "Mastery over temporal waves, permanent universal protection, harmonization of all life domains.",
      ha: "Kama ragamar kariya a kowane lokaci da saida dukkan al'amuran rayuwa."
    },
    ritualUsage: {
      fr: "Tracé sur une plaque d'argent massif ou sur parchemin végétal avec encre d'ambre, safran et musc. À conserver dans le lieu de prière.",
      en: "Inscribe on a solid silver plate or parchment with amber, saffron, and musk ink. Keep in your sacred prayer space.",
      ha: "A rubuta a farantin azurfa ko takarda ta gaske da za'afaran da musk. A ajiye a wurin ibada."
    },
    elementalProperty: {
      fr: "Synthèse des 4 Éléments",
      en: "Synthesis of the 4 Elements",
      ha: "Gamayyar Mahadai 4 Na Halitta"
    },
    incense: {
      fr: "Mélange des 7 Encens Planétaires",
      en: "Blend of the 7 Planetary Incenses",
      ha: "Hadadden Turaren Taurawoji 7"
    },
    timing: {
      fr: "Pleine Lune ou jour du Sharaf al-Qamar",
      en: "Full Moon or day of Sharaf al-Qamar",
      ha: "Cikakken Wata ko Ranar Daukaka"
    },
    formula: 'سُبْحَانَ مَنْ بَثَّ فِي السَّمَاوَاتِ آيَاتِهِ - 2800',
    abjadValue: '2800',
    graphicSymbol: `   🌌 SCEAU DE SYNTHESE AL-WAFQ AL-JAMI' 🌌
          ۞  الجَامِعُ لِلْمَنَازِلِ  ۞
     ┌────────────────────────┐
     │ 🌌  28 MANAZIL (2800)  🌌 │
     │  700   700   700   700 │
     │ 🌌 UNIVERSAL HARMONY 🌌 │
     └────────────────────────┘
          ۞  رَبُّ المَشَارِقِ وَالمَغَارِبِ  ۞
     ✦ CONDENSATION DIVINE DES 28 STATIONS ✦`,
    graphicSymbolV2: `   🌟 KHATIM AL-WAFQ AL-JAMI' 🌟
         🌌   الجامِعُ الكَبِيرُ   🌌
     𐎃  ┌─────────────────┐  𐎃
    ────│ 2800 2800 2800 │────
    ────│ 2800 2800 2800 │────
     𐎖  └─────────────────┘  𐎖
         🌌   شَامِلُ البَرَكَاتِ   🌌
   ✦ HARMONISATION UNIVERSELLE TOTAL ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },
  {
    id: 'seal_ism_azam',
    groupId: 3,
    groupTitle: {
      fr: "Groupe III : Compositions Théurgiques et d'Alliance",
      en: 'Group III: Theurgic Compositions and Alliances',
      ha: "Rukunin III: Hadakar Ruhi da Agajin Samaniya"
    },
    title: {
      fr: '14. Le Sceau Lunaire de l\'Ism al-A\'zam (Le Grand Nom)',
      en: '14. Lunar Seal of Ism al-A\'zam (The Supreme Name)',
      ha: '14. Hatimin Ism al-A\'zam na Wata'
    },
    subtitle: {
      fr: 'Intégration des Formules du Grand Nom Divin avec les Nombres de la Lune',
      en: 'Integration of Supreme Divine Name Formulas with Lunar Numbers',
      ha: 'Hadakar Ism al-A\'zam da Lambobin Wata'
    },
    arabicName: 'خَاتَمُ الاِسْمِ الأَعْظَمِ القَمَرِيّ (السِّرُّ المَكْنُون)',
    description: {
      fr: "Une composition théurgique sacrée associant les 7 symboles majeurs de l'Ism al-A'zam avec le carré lunaire pour une protection inexpugnable et une exaucement suprême.",
      en: "A sacred theurgic combination merging the 7 major signs of Ism al-A'zam with the lunar square for invincible protection and supreme prayer fulfillment.",
      ha: "Hatimi mai girma da ke hada alamomi 7 na Ism al-A'zam da lissafin wata domin samun kariya ta tsaro da amsa addu'a."
    },
    spiritualUtility: {
      fr: "Exaucement des vœux réputés impossibles, bouclier inviolable contre toutes formes de magie noire, illumination spirituelle directe.",
      en: "Fulfillment of seemingly impossible desires, impenetrable shield against dark magic, direct spiritual illumination.",
      ha: "Amsa addu'a mai wuya, tsari daga kowane irin sihiri da samun hasken zuciya."
    },
    ritualUsage: {
      fr: "Réciter l'Invocation du Grand Nom après minuit durant la nuit du vendredi ou du lundi, puis inscrire le sceau sur parchemin vierge.",
      en: "Recite the Supreme Name invocation after midnight on Monday or Friday night, then write the seal on virgin parchment.",
      ha: "Karanta addu'ar Ism al-A'zam bayan tsakar dare daren Juma'a ko Litinin, sannan ka rubuta hatimin."
    },
    elementalProperty: {
      fr: "Lumière Divinement Pure",
      en: "Divinely Pure Light",
      ha: "Cikakken Hasken Ism al-A'zam"
    },
    incense: {
      fr: "Oud royal, Ambre pur, Musc de Ghazal",
      en: "Royal Oud, Pure Amber, Ghazal Musk",
      ha: "Oud na sarakuna da Turaren Ambar"
    },
    timing: {
      fr: "Tiers supérieur de la nuit (Sahar) le Lundi ou le Vendredi",
      en: "Final third of the night (Sahar) on Monday or Friday",
      ha: "Asuba da wuri (Sahar) ranar Litinin ko Juma'a"
    },
    formula: 'فَجَشٍ ثَظَخَزٍ - 1111 / 1001 (Ism al-A\'zam)',
    abjadValue: '1111 / 1001',
    graphicSymbol: `   ✨ SCEAU LUNAIRE DE L'ISM AL-A'ZAM ✨
          ۩  الاِسْمُ الأَعْظَمُ المَكْنُونُ  ۩
     ┌────────────────────────┐
     │  ☆  فـ جـ شـ ثـ ظـ خـ ز  ☆ │
     │  1111   1001   1111    │
     │ ۩ INVIOLABLE DIVINE SHIELD ۩│
     └────────────────────────┘
          ۩  يَا أَللَّهُ يَا حَيُّ يَا قَيُّومُ  ۩
     ✦ SECRET SUPREME D'EXAUCEMENT ET DE FORCE ✦`,
    graphicSymbolV2: `   🌟 KHATIM ISM AL-A'ZAM QAMARI 🌟
         ۩   فَجَشٍ ثَظَخَزٍ   ۩
     𐎃  ┌─────────────────┐  𐎃
    ────│ 1111  1001  1111 │────
    ────│ 1001  1111  1001 │────
     𐎖  └─────────────────┘  𐎖
         ۩   يَا ذَا الجَلاَلِ وَالإِكْرَامِ   ۩
   ✦ PROTECTION INVIOLABLE ET EXAUCEMENT ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },

  // --- GROUPE IV : Haute Hermétisme et Alchimie (Niveaux Supérieurs) ---
  {
    id: 'seal_triplicite',
    groupId: 4,
    groupTitle: {
      fr: 'Groupe IV : Haute Hermétisme et Alchimie (Niveaux Supérieurs)',
      en: 'Group IV: High Hermetism and Alchemy (Advanced Levels)',
      ha: 'Rukunin IV: Babban Ilmin Ruhi da Alkimiyya'
    },
    title: {
      fr: '15. Le Sceau de la Grande Triplicité (Étoiles Fixes Royales)',
      en: '15. Seal of the Great Triplicity (Royal Fixed Stars)',
      ha: '15. Hatimin Taurari Masu Daraja (Royal Fixed Stars)'
    },
    subtitle: {
      fr: 'Alignements Rares avec Aldébaran, Régulus, Antarès et Fomalhaut',
      en: 'Rare Alignments with Aldebaran, Regulus, Antares, and Fomalhaut',
      ha: 'Hadaka da Taurari Masu Sarauta a Samaniya'
    },
    arabicName: 'خَاتَمُ المُلَاقَاةِ العُظْمَى (الكَوَاكِبُ الثَّابِتَة)',
    description: {
      fr: "Un sceau d'exception tracé lors des conjonctions rares où la Lune croise l'une des 4 Étoiles Fixes Royales. Il insuffle une autorité cosmique majeure et un destin hors du commun.",
      en: "An exceptional seal constructed during rare alignments when the Moon joins one of the 4 Royal Fixed Stars. Imbues major cosmic authority and extraordinary destiny.",
      ha: "Hatimi ne na musamman da ake rubutawa lokacin da wata ya haɗu da taurari 4 masu sarauta a samaniya. Yana kawo babbar daukaka."
    },
    spiritualUtility: {
      fr: "Souveraineté spirituelle, accomplissement de destinées exceptionnelles, protection contre les catastrophes globales, renommée internationale.",
      en: "Spiritual sovereignty, fulfillment of extraordinary destinies, protection from systemic disasters, international renown.",
      ha: "Daukaka ta duniya, nasara a babbar harka da kariya daga mummunar kaddara."
    },
    ritualUsage: {
      fr: "Tracé sur feuille d'argent ou or blanc au moment exact de la conjonction exacte de la Lune avec l'étoile royale.",
      en: "Inscribe on silver or white gold sheet at the precise second of conjunction with the royal star.",
      ha: "A rubuta a farantin azurfa ko farin zinari a sa'ar haɗuwar wata da tauraruwar sarauta."
    },
    elementalProperty: {
      fr: "Feu Stellaire et Eau Céleste",
      en: "Stellar Fire & Celestial Water",
      ha: "Wutar Taurari da Ruwan Samaniya"
    },
    incense: {
      fr: "Storax blanc, Ladanum, Ambre royal",
      en: "White Storax, Ladanum, Royal Amber",
      ha: "Luban fari da Ambar mai tsada"
    },
    timing: {
      fr: "Alignement astronomique exact Lune-Étoile Fixe Royale",
      en: "Exact astronomical alignment Moon-Royal Fixed Star",
      ha: "Tsakiyar sa'ar haɗuwar wata da tauraruwar sarauta"
    },
    formula: 'المَلِكُ القُدُّوسُ - 90° TRIPLICITÉ (Kawkab Thabit)',
    abjadValue: '90 / 1290',
    graphicSymbol: `   ⭐ SCEAU DE LA GRANDE TRIPLICITE (ESTRELLAS) ⭐
          ★  ALDEBARAN • REGULUS • ANTARES  ★
     ┌────────────────────────┐
     │ ⭐  ROYAL STARS (1290) ⭐ │
     │  322.5  322.5  322.5   │
     │ ⭐ STELLAR AUTHORITY  ⭐ │
     └────────────────────────┘
          ★  يَا مَلِكُ يَا قُدُّوسُ  ★
     ✦ ALLIANCE AVEC LES ETOILES FIXES ROYALES ✦`,
    graphicSymbolV2: `   🌟 KHATIM KAWAKIB THABITA 🌟
         ⭐   النُّجُومُ المَلَكِيَّةُ   ⭐
     𐎃  ┌─────────────────┐  𐎃
    ────│ 1290  1290 1290 │────
    ────│ 1290  1290 1290 │────
     𐎖  └─────────────────┘  𐎖
         ⭐   عِزٌّ وَمَجْدٌ دَائِمٌ   ⭐
   ✦ SOVEREIGNETE COSMIQUE PERPETUELLE ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },
  {
    id: 'seal_mujassam',
    groupId: 4,
    groupTitle: {
      fr: 'Groupe IV : Haute Hermétisme et Alchimie (Niveaux Supérieurs)',
      en: 'Group IV: High Hermetism and Alchemy (Advanced Levels)',
      ha: 'Rukunin IV: Babban Ilmin Ruhi da Alkimiyya'
    },
    title: {
      fr: '16. Le Sceau Alchimique Tridimensionnel (Mujassam)',
      en: '16. Three-Dimensional Alchemical Seal (Mujassam)',
      ha: '16. Hatimin Alkimiyya Mai Siga Ta 3D (Mujassam)'
    },
    subtitle: {
      fr: 'Talisman Physique Creux en Argent Pur Chargé d’Encens Lunaires',
      en: 'Hollow Pure Silver Physical Talisman Charged with Lunar Herbs',
      ha: 'Hatimin Azurfa Mai Dauke da Turaren Ruhi a Ciki'
    },
    arabicName: 'خَاتَمُ المُجَسَّمِ الأَلْكِيمِيّ (التَّجْسِيدُ المَادِّيّ)',
    description: {
      fr: "Un réceptacle physique tridimensionnel fondu dans de l'argent pur. Il comporte une cavité interne scellée contenant des poudres d'encens lunaires, de la feuille de safran et de la poussière de perle.",
      en: "A three-dimensional physical vessel cast in pure silver. Features an enclosed chamber containing lunar incense powders, saffron leaves, and pearl dust.",
      ha: "Babban hatimin karfe na azurfa mai gidaje 3D da ake zuba turare da za'afaran da hudar lu'u-lu'u a ciki."
    },
    spiritualUtility: {
      fr: "Ancrage physique absolu des bénédictions, protection physique contre le poison et les armes, magnétisme personnel inégalé.",
      en: "Absolute physical grounding of spiritual blessings, physical protection from poisons and weapons, unrivaled personal magnetism.",
      ha: "Mabuɗin tabbatar da albarka a jiki, kariya daga dafi ko makami da kwarjini na kowa."
    },
    ritualUsage: {
      fr: "Charger la cavité interne lors du Badr, puis consacrer par 1000 récits du Wird de la Lune avant de le sceller à la cire d'abeille.",
      en: "Fill the internal chamber during Full Moon, then consecrate with 1000 Moon Wirds before sealing with beeswax.",
      ha: "Zuba turaren a ciki yayin cikakken wata, karanta wirdi kafa 1000 sannan ka rufe da dankon zuma."
    },
    elementalProperty: {
      fr: "Argent Alchimique Mâle et Femelle",
      en: "Male & Female Alchemical Silver",
      ha: "Azurfar Alkimiyya na Maza da Mata"
    },
    incense: {
      fr: "Poudre de Perle, Safran de Khorasan, Camphre de Sumatra",
      en: "Pearl Powder, Khorasan Saffron, Sumatra Camphor",
      ha: "Hudar Lu'u-Lu'u da Za'afaran"
    },
    timing: {
      fr: "Façonné lors de la Pleine Lune / Consacré lors du Sharaf",
      en: "Crafted at Full Moon / Consecrated at Sharaf",
      ha: "Ana kera shi lokacin cikakken wata"
    },
    formula: 'التَّجْسِيدُ الأَلْكِيمِيُّ - 3D SILVER RECEPTACLE',
    abjadValue: '3321',
    graphicSymbol: `   🕋 SCEAU ALCHIMIQUE TRIDIMENSIONNEL (MUJASSAM) 🕋
          ۞  المُجَسَّمُ الفِضِّيُّ المَشْحُونُ  ۞
     ┌────────────────────────┐
     │  ┌──────────────────┐  │
     │  │ 📦 CAVITE INTERNE│  │
     │  │ ARGENT + SAFRAN  │  │
     │  └──────────────────┘  │
     └────────────────────────┘
          ۞  تَجْسِيدُ المَنَافِعِ فِي المَادَّةِ  ۞
     ✦ RECEPTACLE ALCHIMIQUE MATERIEL PERMANENT ✦`,
    graphicSymbolV2: `   🌟 KHATIM AL-MUJASSAM AL-FADDI 🌟
         🕋   التَّجْسِيدُ المَادِّيُّ   🕋
     𐎃  ┌─────────────────┐  𐎃
    ────│  3D  SILVER  3D │────
    ────│  HERBS+SAFFRON  │────
     𐎖  └─────────────────┘  𐎖
         🕋   حِصْنٌ حَصِينٌ دَائِمٌ   🕋
   ✦ ANCRAGE MATERIEL SUPREME ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  },
  {
    id: 'seal_ruhaniyya',
    groupId: 4,
    groupTitle: {
      fr: 'Groupe IV : Haute Hermétisme et Alchimie (Niveaux Supérieurs)',
      en: 'Group IV: High Hermetism and Alchemy (Advanced Levels)',
      ha: 'Rukunin IV: Babban Ilmin Ruhi da Alkimiyya'
    },
    title: {
      fr: '17. Le Sceau de l\'Esprit de la Lune (Khatim al-Ruhaniyya)',
      en: '17. Seal of the Lunar Spirit (Khatim al-Ruhaniyya)',
      ha: '17. Hatimin Ruhaniyyar Wata (Khatim al-Ruhaniyya)'
    },
    subtitle: {
      fr: 'Glyphes Célestes et Alphabets Occultes pour Contact Direct',
      en: 'Celestial Glyphs and Occult Alphabets for Direct Spiritual Contact',
      ha: 'Hatimin Haruffan Sirri na Ruhaniyyar Wata'
    },
    arabicName: 'خَاتَمُ الرُّوحَانِيَّةِ القَمَرِيَّةِ (الخَطُّ الرُّوحَانِيّ)',
    description: {
      fr: "Un sceau sacré exclusivement composé de caractères théurgiques et d'alphabets occultes (Khatim Sulaymani / Haruf al-Nur). Il établit un canal de communication direct avec l'intelligence spirituelle de la Lune.",
      en: "A sacred seal made entirely of occult characters and celestial alphabets (Solomonic Seals / Haruf al-Nur). Establishes a direct spiritual channel to the lunar intelligence.",
      ha: "Hatimi mai tsarki na haruffan sirri (Khatim Sulaymani) domin gudanar da sadarwa ta ruhi da mala'ikun wata."
    },
    spiritualUtility: {
      fr: "Inspiration prophétique, visions nocturnes véridiques (Ru'ya Sadiqa), enseignement direct dans le sommeil et ouverture des facultés psychiques.",
      en: "Prophetic inspiration, truthful night visions (Ru'ya Sadiqa), direct instruction during sleep, and psychic awakening.",
      ha: "Mafarki na gaskiya (Ru'ya Sadiqa), koyarwar ruhi a barci da bude basira."
    },
    ritualUsage: {
      fr: "Réservé aux initiés. Placer sous l'oreiller après la prière du Tahajjud avec le récital du Nom 'Ya Latif Ya Khabir' 312 fois.",
      en: "For advanced seekers. Place beneath pillow following Tahajjud prayer while reciting 'Ya Latif Ya Khabir' 312 times.",
      ha: "A ajiye a karkashin matashin kai bayan sallar Tahajjud da ambaton 'Ya Latif Ya Khabir' kafa 312."
    },
    elementalProperty: {
      fr: "Esprit Pur / Éther Angélique",
      en: "Pure Spirit / Angelic Ether",
      ha: "Cikakken Ruhi na Mala'iku"
    },
    incense: {
      fr: "Oud Hindi pur, Camphre naturel, Storax blanc",
      en: "Pure Indian Oud, Natural Camphor, White Storax",
      ha: "Oud na Indiya da Kafur na gaske"
    },
    timing: {
      fr: "Dernier tiers de la nuit (Sahar) après ascèse spirituelle",
      en: "Final third of the night (Sahar) following spiritual retreat",
      ha: "Lokacin Sahar bayan ibada ta tsarki"
    },
    formula: 'يَا لَطِيفُ يَا خَبِيرُ - 129 / 812 (Haruf al-Nur)',
    abjadValue: '129 / 812',
    graphicSymbol: `   📜 SCEAU DE L'ESPRIT DE LA LUNE (RUHANIYYA) 📜
          ۞  الخَطُّ الرُّوحَانِيُّ المَلَكِيُّ  ۞
     ┌────────────────────────┐
     │  𐎃  𐎄  𐎏  𐎓  𐎖  𐎐  𐎏  │
     │  ١٢٩   ٨١٢   ١٢٩   ٨١٢ │
     │ 📜 KHATIM SULAYMANI 📜 │
     └────────────────────────┘
          ۞  يَا خَبِيرُ عَّلِمْنِي فِي المَنَامِ  ۞
     ✦ CANAL DIRECT DE REVELATION NOCTURNE ✦`,
    graphicSymbolV2: `   🌟 KHATIM RUHANIYYAT AL-QAMAR 🌟
         📜   حُرُوفُ النُّورِ السِّرِّيَّةُ   📜
     𐎃  ┌─────────────────┐  𐎃
    ────│ 𐎃  129  812  𐎃 │────
    ────│ 𐎖  812  129  𐎖 │────
     𐎖  └─────────────────┘  𐎖
         📜   رُؤْيَا صَادِقَةٌ وَفَهْمٌ   📜
   ✦ ILLUMINATION PAR LES HARUF AL-NUR ✦`,
    defaultStatus: 'active',
    defaultTargetUser: 'all'
  }
];

// LocalStorage Admin Override Keys
const ADMIN_SEAL_STATUS_KEY = 'asrarhub_lunar_seals_status_config';
const ADMIN_SEAL_GLOBAL_MAINTENANCE_KEY = 'asrarhub_lunar_seals_global_maintenance';

export interface SealAdminConfig {
  [sealId: string]: {
    status: SealStatus;
    targetUser: SealTargetUser;
  };
}

// Get Seal Admin Settings
export function getSealAdminConfig(): SealAdminConfig {
  try {
    const stored = localStorage.getItem(ADMIN_SEAL_STATUS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to parse seal admin config', e);
  }

  // Default config
  const initialConfig: SealAdminConfig = {};
  LUNAR_SEAL_VARIETIES.forEach((seal) => {
    initialConfig[seal.id] = {
      status: seal.defaultStatus,
      targetUser: seal.defaultTargetUser
    };
  });
  return initialConfig;
}

// Save Seal Admin Settings to LocalStorage and Firestore
export function saveSealAdminConfig(config: SealAdminConfig): void {
  try {
    localStorage.setItem(ADMIN_SEAL_STATUS_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('asrarhub:seals_config_updated'));
  } catch (e) {
    console.error('Failed to save seal admin config locally', e);
  }

  try {
    const sealDocRef = doc(db, 'settings', 'lunar_seals_config');
    setDoc(sealDocRef, {
      config,
      globalMaintenance: isGlobalSealMaintenance(),
      updatedAt: new Date().toISOString()
    }, { merge: true }).catch(err => console.warn('Firestore seal config save error:', err));
  } catch (e) {
    console.warn('Firestore seal config write skipped:', e);
  }
}

// Global Maintenance State
export function isGlobalSealMaintenance(): boolean {
  try {
    return localStorage.getItem(ADMIN_SEAL_GLOBAL_MAINTENANCE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setGlobalSealMaintenance(enabled: boolean): void {
  try {
    localStorage.setItem(ADMIN_SEAL_GLOBAL_MAINTENANCE_KEY, enabled ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('asrarhub:seals_config_updated'));
  } catch (e) {
    console.error('Failed to save global seal maintenance state', e);
  }

  try {
    const sealDocRef = doc(db, 'settings', 'lunar_seals_config');
    setDoc(sealDocRef, {
      globalMaintenance: enabled,
      config: getSealAdminConfig(),
      updatedAt: new Date().toISOString()
    }, { merge: true }).catch(err => console.warn('Firestore seal maintenance save error:', err));
  } catch (e) {
    console.warn('Firestore seal maintenance write skipped:', e);
  }
}

/**
 * Subscribe to Firestore seal_config doc to sync across clients automatically.
 */
export function subscribeSealAdminConfigFromFirestore(callback?: (config: SealAdminConfig, globalMaint: boolean) => void) {
  try {
    const sealDocRef = doc(db, 'settings', 'lunar_seals_config');
    return onSnapshot(sealDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.config) {
          localStorage.setItem(ADMIN_SEAL_STATUS_KEY, JSON.stringify(data.config));
        }
        if (data.globalMaintenance !== undefined) {
          localStorage.setItem(ADMIN_SEAL_GLOBAL_MAINTENANCE_KEY, data.globalMaintenance ? 'true' : 'false');
        }
        window.dispatchEvent(new CustomEvent('asrarhub:seals_config_updated'));
        if (callback) {
          callback(data.config || getSealAdminConfig(), data.globalMaintenance ?? isGlobalSealMaintenance());
        }
      }
    }, (err) => {
      console.warn("Firestore seal config subscription error:", err);
    });
  } catch (err) {
    console.warn("Firestore seal config listener initialization error:", err);
    return () => {};
  }
}

// Localized helper to fetch seals with user's current status applied
export function getLocalizedLunarSealVarieties(lang: 'fr' | 'en' | 'ha') {
  const adminConfig = getSealAdminConfig();
  const globalMaint = isGlobalSealMaintenance();

  return LUNAR_SEAL_VARIETIES.map((seal) => {
    const config = adminConfig[seal.id] || {
      status: seal.defaultStatus,
      targetUser: seal.defaultTargetUser
    };

    let effectiveStatus: SealStatus = config.status;
    if (globalMaint && effectiveStatus === 'active') {
      effectiveStatus = 'maintenance';
    }

    return {
      ...seal,
      groupTitle: seal.groupTitle[lang] || seal.groupTitle.fr,
      title: seal.title[lang] || seal.title.fr,
      subtitle: seal.subtitle[lang] || seal.subtitle.fr,
      description: seal.description[lang] || seal.description.fr,
      spiritualUtility: seal.spiritualUtility[lang] || seal.spiritualUtility.fr,
      ritualUsage: seal.ritualUsage[lang] || seal.ritualUsage.fr,
      elementalProperty: seal.elementalProperty[lang] || seal.elementalProperty.fr,
      incense: seal.incense[lang] || seal.incense.fr,
      timing: seal.timing[lang] || seal.timing.fr,
      status: effectiveStatus,
      targetUser: config.targetUser
    };
  });
}
export interface SealVersionMeta {
  version: number;
  title: { fr: string; en: string; ha: string };
  subtitle: { fr: string; en: string; ha: string };
  badge: { fr: string; en: string; ha: string };
  element: { fr: string; en: string; ha: string };
  powerLevel: number;
}

export const SEAL_VERSIONS_LIST: SealVersionMeta[] = [
  {
    version: 1,
    title: {
      fr: "Version 1 : Wafq Abjad Classique",
      en: "Version 1: Classic Abjad Wafq",
      ha: "Siga 1: Hatimin Wafq Abjad"
    },
    subtitle: {
      fr: "Matrice numérique originale & Carré Magique d'Ancrage",
      en: "Original numerical matrix & Foundational Magic Square",
      ha: "Gidan lissafi na tushe da hatimin za'afaran"
    },
    badge: { fr: "Fondation", en: "Foundation", ha: "Tushe" },
    element: { fr: "Eau Céleste (Mā'i)", en: "Celestial Water", ha: "Ruwan Samaniya" },
    powerLevel: 88
  },
  {
    version: 2,
    title: {
      fr: "Version 2 : Khatim An-Nur (Sceau de Lumière)",
      en: "Version 2: Khatim An-Nur (Seal of Light)",
      ha: "Siga 2: Hatimin An-Nur (Haske)"
    },
    subtitle: {
      fr: "Sceau angélique géométrique d'illumination spirituelle",
      en: "Geometric angelic seal of spiritual illumination",
      ha: "Hatimin mala'iku da hasken ruhi"
    },
    badge: { fr: "Illumination", en: "Illumination", ha: "Haske" },
    element: { fr: "Lumière Pure (Nur)", en: "Pure Light", ha: "Fararen Haske" },
    powerLevel: 91
  },
  {
    version: 3,
    title: {
      fr: "Version 3 : Sirr Al-Huruf (Secret des Lettres)",
      en: "Version 3: Sirr Al-Huruf (Secret of Letters)",
      ha: "Siga 3: Asirin Haruffa"
    },
    subtitle: {
      fr: "Matrice de lettres mystiques & Ism Al-Azam",
      en: "Mystic letter matrix & Supreme Divine Name",
      ha: "Asirin babban sunan Allah a haruffa"
    },
    badge: { fr: "Secret", en: "Secret", ha: "Asiri" },
    element: { fr: "Air Subtil (Hawa')", en: "Subtle Air", ha: "Iska Mai Kyau" },
    powerLevel: 93
  },
  {
    version: 4,
    title: {
      fr: "Version 4 : Al-Muthallath Al-Ghazali (Triangle Sacré)",
      en: "Version 4: Al-Ghazali Sacred Triangle (3x3)",
      ha: "Siga 4: Hatimin Uku na Ghazali"
    },
    subtitle: {
      fr: "Matrice 3x3 de l'Imam Ghazali pour le déblocage express",
      en: "3x3 Ghazali matrix for express unblocking",
      ha: "Hatimin 3x3 na Imam Ghazali na warware matsala"
    },
    badge: { fr: "Déblocage", en: "Unblocking", ha: "Bude Kofa" },
    element: { fr: "Feu Spirituel (Nar)", en: "Spiritual Fire", ha: "Wutar Ruhi" },
    powerLevel: 94
  },
  {
    version: 5,
    title: {
      fr: "Version 5 : As-Sabaa Al-Mawaki' (7 Positions Célestes)",
      en: "Version 5: As-Sabaa Al-Mawaki' (7 Planetary Alignment)",
      ha: "Siga 5: Hatimin Taurari Bakwai"
    },
    subtitle: {
      fr: "Alignement avec les 7 Planètes & Sceaux des Rois",
      en: "Alignment with the 7 Planets & Planetary Kings",
      ha: "Karfafa haɗin taurari 7 da sarakunan samaniya"
    },
    badge: { fr: "Harmonie", en: "Harmony", ha: "Hada Kai" },
    element: { fr: "Ether Céleste (Ather)", en: "Celestial Ether", ha: "Ather na Samaniya" },
    powerLevel: 95
  },
  {
    version: 6,
    title: {
      fr: "Version 6 : Khatim An-Nar wa Al-Hawa (Feu & Air)",
      en: "Version 6: Fire & Air Radiant Seal",
      ha: "Siga 6: Hatimin Wuta da Iska"
    },
    subtitle: {
      fr: "Activation énergétique ultra-rapide pour les besoins urgents",
      en: "Ultra-fast energy activation for urgent needs",
      ha: "Karfe aiki cikin hanzari na bukatun gaggawa"
    },
    badge: { fr: "Vitesse Express", en: "Express Speed", ha: "Hanzari" },
    element: { fr: "Feu & Air Radiants", en: "Radiant Fire & Air", ha: "Wuta da Iska" },
    powerLevel: 96
  },
  {
    version: 7,
    title: {
      fr: "Version 7 : Khatim Al-Ma' wa At-Tin (Eau & Terre)",
      en: "Version 7: Water & Earth Grounding Seal",
      ha: "Siga 7: Hatimin Ruwa da Kasa"
    },
    subtitle: {
      fr: "Sceau d'ancrage profond, annulation des blocages et guérison",
      en: "Deep grounding, anti-blockage, and healing seal",
      ha: "Kariyar jiki, warware sihir da warkarwa"
    },
    badge: { fr: "Guérison & Ancrage", en: "Healing & Grounding", ha: "Warkarwa" },
    element: { fr: "Eau & Terre Sacrées", en: "Sacred Water & Earth", ha: "Ruwa da Kasa" },
    powerLevel: 97
  },
  {
    version: 8,
    title: {
      fr: "Version 8 : Al-Hisn Al-Mane' (Bouclier 12x12)",
      en: "Version 8: Al-Hisn Al-Mane' (12x12 Shield)",
      ha: "Siga 8: Garkuwar 12x12 Mai Karfi"
    },
    subtitle: {
      fr: "Grande matrice 12x12 de protection impénétrable",
      en: "12x12 grand matrix of impenetrable protection",
      ha: "Babban hatimi na tsaro mai gidaje 12x12"
    },
    badge: { fr: "Protection Ultime", en: "Ultimate Shield", ha: "Tsaro Imman" },
    element: { fr: "Acier Céleste", en: "Celestial Steel", ha: "Karfen Samaniya" },
    powerLevel: 98
  },
  {
    version: 9,
    title: {
      fr: "Version 9 : Talsam Souleymani (Les 7 Sceaux de Salomon)",
      en: "Version 9: Solomonic Talisman (7 Seals of Solomon)",
      ha: "Siga 9: Hatimin Annabi Sulaiman (AS)"
    },
    subtitle: {
      fr: "Sceau de l'Empereur Souleymane pour l'autorité et le respect",
      en: "Imperial Solomon seal for authority and prestige",
      ha: "Hatimin sarauta, daukaka da cika iko"
    },
    badge: { fr: "Autorité Royale", en: "Royal Authority", ha: "Sarauta" },
    element: { fr: "Rayon Royal", en: "Royal Ray", ha: "Hasken Sarauta" },
    powerLevel: 99
  },
  {
    version: 10,
    title: {
      fr: "Version 10 : At-Tawafuq Ash-Shamsi (Soleil & Lune)",
      en: "Version 10: Solar-Lunar Synergy Matrix",
      ha: "Siga 10: Haɗin Rana da Wata"
    },
    subtitle: {
      fr: "Matrice unifiée du Soleil et de la Lune pour le charisme absolu",
      en: "Unified Sun & Moon matrix for absolute aura and prestige",
      ha: "Hatimin kwarjini da samun karbuwa"
    },
    badge: { fr: "Charisme Absolu", en: "Absolute Charisma", ha: "Kwarjini" },
    element: { fr: "Duo Solaire-Lunaire", en: "Solar-Lunar Duo", ha: "Rana da Wata" },
    powerLevel: 99
  },
  {
    version: 11,
    title: {
      fr: "Version 11 : Khatim Ar-Rouhaniyya (Gardiens Célestes)",
      en: "Version 11: Celestial Archangels Seal",
      ha: "Siga 11: Hatimin Mala'iku Huɗu"
    },
    subtitle: {
      fr: "Invocations théurgiques des 4 Archanges majeurs",
      en: "Theurgic invocations of the 4 Archangels",
      ha: "Kira ga Jibrilu, Mikailu, Israfilu da Azra'ilu"
    },
    badge: { fr: "Théurgie Archangélique", en: "Archangelic Powers", ha: "Mala'iku" },
    element: { fr: "Présence Archangélique", en: "Archangelic Presence", ha: "Mala'iku" },
    powerLevel: 100
  },
  {
    version: 12,
    title: {
      fr: "Version 12 : Khatim Ism Al-Azam Al-A'zam (Sceau Suprême VIP)",
      en: "Version 12: Supreme Ism Al-Azam Matrix (VIP)",
      ha: "Siga 12: Hatimin Babban Suna na Allah Suprême"
    },
    subtitle: {
      fr: "L'Ultime Sceau Sacré Suprême des 99 Noms Divins & Lumière Infinie",
      en: "The Ultimate Sacred Seal of the 99 Divine Names & Infinite Light",
      ha: "Kolo kuma kololuwar hatimi mai sunaye 99 na Allah"
    },
    badge: { fr: "Suprême VIP 100%", en: "Supreme VIP 100%", ha: "Cikakken 100%" },
    element: { fr: "Lumière Divine Suprême", en: "Supreme Divine Light", ha: "Hasken Allah" },
    powerLevel: 100
  }
];

export function getSealVersionSymbol(seal: { graphicSymbol: string; graphicSymbolV2?: string; arabicName?: string; abjadValue?: string; formula?: string }, version: number): string {
  if (version === 1) return seal.graphicSymbol;
  if (version === 2 && seal.graphicSymbolV2) return seal.graphicSymbolV2;

  const titleAr = seal.arabicName || 'خَاتَمٌ مُبَارَكٌ';
  const val = seal.abjadValue || '777 / 3321';
  const form = seal.formula || 'يَا لَطِيفُ يَا كَرِيمُ';

  switch (version) {
    case 2:
      return ` 🌟 KHATIM AN-NUR (WAFQ 5x5) 🌟
   ۞  ${titleAr}  ۞

  +----+----+----+----+----+
  | 17 | 24 | 01 | 08 | 15 |
  +----+----+----+----+----+
  | 23 | 05 | 07 | 14 | 16 |
  +----+----+----+----+----+
  | 04 | 06 | 13 | 20 | 22 |
  +----+----+----+----+----+
  | 10 | 12 | 19 | 21 | 03 |
  +----+----+----+----+----+
  | 11 | 18 | 25 | 02 | 09 |
  +----+----+----+----+----+

   ۞  ${form}  ۞
  ✦ RECEPTACLE CELESTE (SOMME = 65) ✦`;

    case 3:
      return ` 📜 SIRR AL-HURUF (HURUF 4x4) 📜
   ۞  أ - ب - ج - د - هـ - و - ز  ۞

  +---+---+---+---+
  | ا | ل | ل | ه |
  +---+---+---+---+
  | ل | ط | ي | ف |
  +---+---+---+---+
  | ح | ك | ي | م |
  +---+---+---+---+
  | ن | و | ر | ✨ |
  +---+---+---+---+

   ۞  سِرُّ الأَسْرَارِ وَنُورُ الأَنْوَارِ  ۞
  ✦ MATRICE DES LETTRES SACREES ✦`;

    case 4:
      return ` 📐 WAFQ AL-GHAZALI (CARRÉ 3x3) 📐
   ۞  بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ  ۞

        +---+---+---+
        | 4 | 9 | 2 |  (ببدوح)
        +---+---+---+
        | 3 | 5 | 7 |  (١ ٥ = 15)
        +---+---+---+
        | 8 | 1 | 6 |  (شَكُورٌ)
        +---+---+---+

   ۞  ${titleAr}  ۞
  ✦ DEBLOCAGE EXPRESS GHAZALI (3x3) ✦`;

    case 5:
      return ` 🪐 AS-SABAA AL-MAWAKI' (7x7) 🪐
   ۞  الكَوَاكِبُ السَّبْعَةُ المَبْرُورَةُ  ۞

  +--+--+--+--+--+--+--+
  |30|39|48|01|10|19|28|
  +--+--+--+--+--+--+--+
  |38|47|07|09|18|27|29|
  +--+--+--+--+--+--+--+
  |46|06|08|17|26|35|37|
  +--+--+--+--+--+--+--+
  |05|14|16|25|34|36|45|
  +--+--+--+--+--+--+--+
  |13|15|24|33|42|44|04|
  +--+--+--+--+--+--+--+
  |21|23|32|41|43|03|12|
  +--+--+--+--+--+--+--+
  |22|31|40|49|02|11|20|
  +--+--+--+--+--+--+--+

   ۞  ${form}  ۞
  ✦ WAFQ PLANETAIRE SEPTENAIRE ✦`;

    case 6:
      return ` 🔥 KHATIM AN-NAR WA AL-HAWA 4x4 🔥
   ۞  يَا سَرِيعُ يَا مُجِيبُ  ۞

  +-----+-----+-----+-----+
  |  ف  |  ج  |  ش  |  ث  |
  +-----+-----+-----+-----+
  |  خ  |  ذ  |  ض  |  ظ  |
  +-----+-----+-----+-----+
  | 111 | 222 | 333 | 444 |
  +-----+-----+-----+-----+

   ۞  عَاجِلاً غَيْرَ آَجِلٍ  ۞
  ✦ ACTIVATION ENERGETIQUE 4x4 ✦`;

    case 7:
      return ` 🌊 KHATIM AL-MA' WA AT-TIN 5x5 🌊
   ۞  وَجَعَلْنَا مِنَ المَاءِ كُلَّ شَيْءٍ حَيٍّ  ۞

  +----+----+----+----+----+
  | 11 | 24 | 07 | 20 | 03 |
  +----+----+----+----+----+
  | 04 | 12 | 25 | 08 | 16 |
  +----+----+----+----+----+
  | 17 | 05 | 13 | 21 | 09 |
  +----+----+----+----+----+
  | 10 | 18 | 01 | 14 | 22 |
  +----+----+----+----+----+
  | 23 | 06 | 19 | 02 | 15 |
  +----+----+----+----+----+

   ۞  طَهَارَةٌ وَحِصْنٌ دَائِمٌ  ۞
  ✦ ANCRAGE PROFOND & GUERISON ✦`;

    case 8:
      return ` 🛡️ AL-HISN AL-MANE' (12x12) 🛡️
   ۞  أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ  ۞

  +-------------------------------+
  |144 001 143 002 142 003 141 004|
  |140 005 139 006 007 138 008 137|
  |009 136 010 135 011 134 012 133|
  |132 013 131 014 130 015 129 016|
  |128 017 127 018 019 126 020 125|
  |021 124 022 123 023 122 024 121|
  |120 025 119 026 118 027 117 028|
  |116 029 115 030 031 114 032 113|
  |033 112 034 111 035 110 036 109|
  |108 037 107 038 106 039 105 040|
  |104 041 103 042 043 102 044 101|
  |045 100 046 099 047 098 048 097|
  +-------------------------------+

   ۞  ${titleAr}  ۞
  ✦ BOUCLIER MATRICIEL 12x12 ✦`;

    case 9:
      return ` 👑 TALSAM SOULEYMANI (7x7) 👑
   ۞  فَسَيَكْفِيكَهُمُ اللَّهُ وَهُوَ السَّمِيعُ العَلِيمُ  ۞

  +---+---+---+---+---+---+---+
  | ★ | ⚔️ | 📜 | ✦ | 🗝️ | 🌙 | ۞ |
  +---+---+---+---+---+---+---+
  | 77| 88| 99|111|222|333|777|
  +---+---+---+---+---+---+---+

   ۞  إِنَّهُ مِنْ سُلَيْمَانَ وَإِنَّهُ بِسْمِ اللَّهِ  ۞
  ✦ MATRICE DES 7 SCEAUX DE SALOMON ✦`;

    case 10:
      return ` ☀️ AT-TAWAFUQ ASH-SHAMSI 6x6 ☀️
   ۞  لاَ الشَّمْسُ يَنْبَغِي لَهَا أَنْ تُدْرِكَ القَمَرَ  ۞

  +----+----+----+----+----+----+
  | 06 | 32 | 03 | 34 | 35 | 01 |
  +----+----+----+----+----+----+
  | 07 | 11 | 27 | 28 | 08 | 30 |
  +----+----+----+----+----+----+
  | 19 | 14 | 16 | 15 | 23 | 24 |
  +----+----+----+----+----+----+
  | 18 | 20 | 22 | 21 | 17 | 13 |
  +----+----+----+----+----+----+
  | 25 | 29 | 10 | 09 | 26 | 12 |
  +----+----+----+----+----+----+
  | 36 | 05 | 33 | 04 | 02 | 31 |
  +----+----+----+----+----+----+

   ۞  وَكُلٌّ فِي فَلَكٍ يَسْبَحُونَ  ۞
  ✦ MATRICE SOLAIRE-LUNAIRE 6x6 ✦`;

    case 11:
      return ` 🕊️ KHATIM AR-ROUHANIYYA (4 ARCHANGES) 🕊️
   ۞  جَبْرَائِيلُ - مِيكَائِيلُ - إِسْرَافِيلُ - عَزْرَائِيلُ  ۞

  +--------+--------+--------+--------+
  |  نُورٌ   |  حِكْمَةٌ |  قُدْرَةٌ |  رَحْمَةٌ |
  +--------+--------+--------+--------+
  |  256   |  512   |  1024  |  2048  |
  +--------+--------+--------+--------+
  |  حِفْظٌ  |  نَصْرٌ  |  فَتْحٌ  |  عِزٌّ   |
  +--------+--------+--------+--------+
  |  777   |  999   |  333   |  111   |
  +--------+--------+--------+--------+

   ۞  ${titleAr}  ۞
  ✦ INVOCATION DES 4 ARCHANGES ✦`;

    case 12:
    default:
      return ` 💎 KHATIM ISM AL-AZAM (9x9) 💎
   ۞  اللَّهُ لا إِلَهَ إِلاَّ هُوَ الحَيُّ القَيُّومُ  ۞

  +-----+-----+-----+-----+-----+-----+-----+-----+-----+
  |رَحْمَن|رَحِيم| مَلِك |قُدُّوس|سَلاَم|مُؤْمِن|مُهَيْمِن|عَزِيز|جَبَّار|
  +-----+-----+-----+-----+-----+-----+-----+-----+-----+
  |مُتَكَبِّر|خَالِق| بَارِئ|مُصَوِّر|غَفَّار|قَهَّار| وَهَّاب|رَزَّاق|فَتَّاح|
  +-----+-----+-----+-----+-----+-----+-----+-----+-----+
  |عَلِيم |قَابِض| بَاسِط|خَافِض|رَافِع| مُعِزّ| مُذِلّ|سَمِيع|بَصِير|
  +-----+-----+-----+-----+-----+-----+-----+-----+-----+

   ۞  لَهُ الأَسْمَاءُ الحُسْنَى  ۞
  ✦ MATRICE 9x9 DES NOMS DIVINS ✦`;
  }
}

export function getSealVersionDetails(seal: { graphicSymbol: string; graphicSymbolV2?: string; arabicName?: string; abjadValue?: string; formula?: string }, version: number, lang: 'fr' | 'en' | 'ha' = 'fr') {
  const meta = SEAL_VERSIONS_LIST.find((v) => v.version === version) || SEAL_VERSIONS_LIST[0];
  const symbol = getSealVersionSymbol(seal, version);

  return {
    version: meta.version,
    title: meta.title[lang] || meta.title.fr,
    subtitle: meta.subtitle[lang] || meta.subtitle.fr,
    badge: meta.badge[lang] || meta.badge.fr,
    element: meta.element[lang] || meta.element.fr,
    powerLevel: meta.powerLevel,
    symbol
  };
}

