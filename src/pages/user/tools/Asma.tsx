import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, Search, BookOpen, Star, Shield, Heart, Compass, Feather } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { asmaListData } from '../../../data/asmaListData';
import { applyTashkeel } from '../../../utils/tashkeel';

// Helper to generate dynamic Vifiq (3x3 to 10x10) based on Abjad total
const oddMagicSquare = (n: number): number[][] => {
  const grid = Array.from({ length: n }, () => Array(n).fill(0));
  let r = 0;
  let c = Math.floor(n / 2);
  for (let num = 1; num <= n * n; num++) {
    grid[r][c] = num;
    let nextR = (r - 1 + n) % n;
    let nextC = (c + 1) % n;
    if (grid[nextR][nextC] !== 0) {
      r = (r + 1) % n;
    } else {
      r = nextR;
      c = nextC;
    }
  }
  return grid;
};

const doublyEvenMagicSquare = (n: number): number[][] => {
  const grid = Array.from({ length: n }, () => Array(n).fill(0));
  let num = 1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const isDiagonal = (i % 4 === j % 4) || ((i % 4) + (j % 4) === 3);
      if (isDiagonal) {
        grid[i][j] = n * n + 1 - num;
      } else {
        grid[i][j] = num;
      }
      num++;
    }
  }
  return grid;
};

const singlyEvenMagicSquare = (n: number): number[][] => {
  const k = n / 2;
  const grid = Array.from({ length: n }, () => Array(n).fill(0));
  const sub = oddMagicSquare(k);
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      grid[i][j] = sub[i][j];
      grid[i + k][j + k] = sub[i][j] + k * k;
      grid[i][j + k] = sub[i][j] + 2 * k * k;
      grid[i + k][j] = sub[i][j] + 3 * k * k;
    }
  }
  const m = Math.floor(k / 2);
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < m; j++) {
      let swapCol = j;
      if (i === m && j === 0) swapCol = m;
      const temp = grid[i][swapCol];
      grid[i][swapCol] = grid[i + k][swapCol];
      grid[i + k][swapCol] = temp;
    }
  }
  for (let i = 0; i < k; i++) {
    for (let j = k - (m - 1); j < k; j++) {
      const temp = grid[i][j + k];
      grid[i][j + k] = grid[i + k][j + k];
      grid[i + k][j + k] = temp;
    }
  }
  return grid;
};

const getMagicSquare = (n: number): number[][] => {
  if (n % 2 !== 0) return oddMagicSquare(n);
  if (n % 4 === 0) return doublyEvenMagicSquare(n);
  return singlyEvenMagicSquare(n);
};

const generateDynamicVifiq = (n: number, total: number) => {
  const stdSum = (n * (n * n + 1)) / 2;
  const base = Math.max(0, total - stdSum);
  const step = Math.floor(base / n);
  const rem = base % n;

  const stdGrid = getMagicSquare(n);
  const customGrid = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let val = stdGrid[i][j] + step;
      if (rem > 0 && ((i - j + n) % n < rem)) {
        val += 1;
      }
      customGrid[i][j] = val;
    }
  }
  return customGrid;
};

const gridColsClassMap: Record<number, string> = {
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
};

const textPercentSizeMap: Record<number, string> = {
  3: 'text-base sm:text-lg',
  4: 'text-xs sm:text-sm',
  5: 'text-[11px] sm:text-xs',
  6: 'text-[10px] sm:text-[11px]',
  7: 'text-[9px] sm:text-[10px]',
  8: 'text-[8px] sm:text-[9px]',
  9: 'text-[7px] sm:text-[8px]',
  10: 'text-[6px] sm:text-[7px]',
};

const gridCellPaddingMap: Record<number, string> = {
  3: 'p-2 aspect-square',
  4: 'p-1.5 aspect-square',
  5: 'p-1 aspect-square',
  6: 'p-0.5 aspect-square',
  7: 'p-0.5 aspect-square',
  8: 'p-0.5 aspect-square',
  9: 'p-0.5 aspect-square',
  10: 'p-0.5 aspect-square',
};

const divineNamesDeep = [
  { 
    name: "Ya Allah", 
    ar: "يَا الله",
    val: 66, 
    effect: "Illumination absolue, effacement de l'ego (Fana'), souveraineté spirituelle.",
    meaning: "L'Essence divine absolue, englobant la Totalité des attributs de Perfection.",
    esoteric: "Considéré par les plus hauts gnostiques comme le Nom Suprême (Ism al-A'dham). 'Allah' agit sur la globalité de l'être. Sa vibration résonne avec le 'Sirr' (secret profond). Il calcine les voiles de l'ego (Nafs) et désintègre toute magie. Le 66 lie microcosme et macrocosme.",
    zikr: "Le Dhikr des pôles (Aqtab) : 66 fois par jour pour un alignement vibratoire parfait. 4356 (66x66) en retraite (Khalwa) pour le dévoilement (Kashf).",
    category: "Essence (Dhat)",
    maqam: "Station de l'Unicité pure (Ahadiyya)",
    angel: "Ar-Ruh (L'Esprit Saint)"
  },
  { 
    name: "Ya Rahman", 
    ar: "يَا رَحْمَانُ",
    val: 298, 
    effect: "Attraction de la grâce cosmique, résolution des impossibles, ouverture des nafs.",
    meaning: "La Matrice Universelle de Miséricorde, dont la clémence englobe toute forme d'existence matérielle et spirituelle.",
    esoteric: "Provoque l'effusion de l'existence. Rahman est l'attribut par lequel l'univers se maintient (Istiwa). Son secret, souvent couplé au chiffre 298, agit comme une pluie sur un sol mort (spirituellement ou matériellement). Les gnostiques l'utilisent pour transformer des situations hostiles en terreau fertile.",
    zikr: "298 fois après le Fajr pour synchroniser son aura avec la miséricorde descendante du jour.",
    category: "Beauté (Jamal)",
    maqam: "Station de l'Expansion (Bist)",
    angel: "Jibril (Gabriel)"
  },
  { 
    name: "Ya Rahim", 
    ar: "يَا رَحِيمُ",
    val: 258, 
    effect: "Protection intime, douceur du cœur, sauvegarde de la structure familiale.",
    meaning: "Le Miséricordieux Spécifique, source d'Amour pur et continu.",
    esoteric: "Là où Rahman distribue sa grâce même aux ignorants, Rahim cible le chercheur. C'est le baume ésotérique réparateur. Il tisse des fils invisibles de tendresse (Mawadda) entre les individus, et crée un dôme impénétrable de sécurité autour du foyer de l'invocateur.",
    zikr: "258 fois après chaque prière obligatoire pour sceller sa famille et ses projets dans la préservation divine.",
    category: "Beauté (Jamal)",
    maqam: "Station de l'Amour Élu (Mahabba)",
    angel: "Mika'il (Michaël)"
  },
  { 
    name: "Ya Quddus", 
    ar: "يَا قُدُّوسُ",
    val: 170, 
    effect: "Purge des traumatismes obscurs, éloignement des entités négatives (Jinn).",
    meaning: "L'Infiniment Saint, Le Transcendant, dénué de toute imperfection.",
    esoteric: "Il est le feu alchimique qui désinfecte l'esprit. Al-Quddus dissout le Waswas (les obsessions mentales démoniaques), les névroses et les sortilèges. La récitation de ce nom élève drastiquement le taux vibratoire du sang, le rendant insupportable aux basses entités.",
    zikr: "170 fois juste avant de dormir ou après le crépuscule pour aseptiser le psychisme des énergies collectées durant la journée.",
    category: "Majesté Transcendante (Jalal)",
    maqam: "Station de la Pureté Originelle (Fitra)",
    angel: "Israfil"
  },
  { 
    name: "Ya Salam", 
    ar: "يَا سَلَامُ",
    val: 131, 
    effect: "Guérison physique, tranquillité mentale, immunité contre les désastres.",
    meaning: "La Matrice de Paix, La Source de Sauvegarde.",
    esoteric: "L'antidote cosmique. Ya Salam éteint les incendies physiques (fièvres, inflammations) et psychologiques (anxiété, crises de panique). L'émanation de ce Noms pacifie les cellules anarchiques du corps humain. Il fige les intentions hostiles avant manifestation.",
    zikr: "131 fois soufflé sur un verre d'eau pour la guérison. Récité dans la frayeur, il installe instantanément la paix.",
    category: "Beauté Pacifiante (Jamal)",
    maqam: "Station du Cœur Apaisé (Mutma'inna)",
    angel: "Azra'il (Aspect pacifié)"
  },
  { 
    name: "Ya Mu'min", 
    ar: "يَا مُؤْمِنُ",
    val: 136, 
    effect: "Immunité psychique absolue face à l'angoisse et la terreur, foi certifiée.",
    meaning: "Le Sécuritaire, le Garant, Celui qui confirme la vérité.",
    esoteric: "Il ancre l'âme face aux tempêtes de l'existence. Ce nom agit comme un stabilisateur de conscience. Lorsqu'il est zikré, la Lumière de la certitude (Yaqin) inonde la poitrine, rendant le sujet impossible à manipuler par la peur (humaine ou transcendante).",
    zikr: "136 fois au lever, pour revêtir l'armure de la sécurité. Protège de la trahison inattendue.",
    category: "Beauté Sécurisante (Jamal)",
    maqam: "Station de la Certitude Vécue (Haqq al-Yaqin)",
    angel: "Darda'il"
  },
  { 
    name: "Ya Muhaymin", 
    ar: "يَا مُهَيْمِنُ",
    val: 145, 
    effect: "Clairvoyance (Firasa), lecture des cœurs, télépathie spirituelle.",
    meaning: "Le Dominateur, Le Conscient, Le Protecteur Omniscient.",
    esoteric: "L'un des plus grands secrets pour l'ouverture du 'Troisième Oeil' (Bashīra). Al-Muhaymin dévoile les pensées et les intentions enfouies des autres. Le voile de la réalité tombe pour révéler les rouages cachés. Il offre un contrôle absolu.",
    zikr: "145 fois au milieu de la nuit (Tahajjud). Réputé pour le don de seconde vue.",
    category: "Majesté Souveraine (Jalal)",
    maqam: "Station de la Surveillance Éveillée (Muraqaba)",
    angel: "Kasfiya'il"
  },
  { 
    name: "Ya Aziz", 
    ar: "يَا عَزِيزُ",
    val: 94, 
    effect: "Gloire, dignité foudroyante, échec des ennemis.",
    meaning: "Le Puissant, Le Conquérant, L'Invulnérable.",
    esoteric: "Induit un respect instinctif, et parfois une crainte révérencielle, chez l'observateur. Le nom العزيز porte la signature énergétique d'une aura solaire, repoussante pour les tyrans, et attirante pour ceux qui cherchent la vérité.",
    zikr: "40 fois par jour pdt 40 jours pour passer de l'état subalterne à la gloire. Ou 94 fois de manière routinière.",
    category: "Majesté Dominante (Jalal)",
    maqam: "Station de la Puissance d'Âme ('Izza)",
    angel: "Anya'il"
  },
  { 
    name: "Ya Wahhab", 
    ar: "يَا وَهَّابُ",
    val: 14, 
    effect: "Abondance irrationnelle, dévoilements spirituels fulgurants.",
    meaning: "Le Dispensateur de Grâces inépuisables (don sans aucun mérite).",
    esoteric: "Le raccourci divin. Al-Wahhab court-circuite la notion de mérite temporel. Ce nom déclenche l'effusion de richesses matérielles soudaines, d'intuitions de génie, et de connaissances ésotériques (Ilm Ladunni). C'est le flux inconditionnel.",
    zikr: "14 fois (ou 300) front au sol après Duha. Brise la structure de la pauvreté générationnelle.",
    category: "Beauté Diffuseuse (Jamal)",
    maqam: "Station de la Faveur (Fadl)",
    angel: "Rūqi'il"
  },
  { 
    name: "Ya Razzaq", 
    ar: "يَا رَزَّاقُ",
    val: 308, 
    effect: "Ouverture multidimensionnelle de la subsistance (Rizq).",
    meaning: "L'inépuisable Pourvoyeur.",
    esoteric: "Le Rizq n'est pas que l'argent ; c'est le savoir, l'oxygène, et la qualité relationnelle. Al-Razzaq agit sur les carrefours du flux quantique commercial. Sa pratique crée un champ magnétique qui attire les opportunités économiques et repousse fondamentalement les disettes.",
    zikr: "308 fois après la prière de l'aube (Fajr) aux quatre coins de sa maison : rempart occulte contre la faillite.",
    category: "Beauté (Jamal)",
    maqam: "Station de la Confiance totale (Tawakkul)",
    angel: "Mika'il (en tant que régent)"
  },
  { 
    name: "Ya Fattah", 
    ar: "يَا فَتَّاحُ",
    val: 489, 
    effect: "Destruction des nœuds karmiques/magiques, succès décisifs.",
    meaning: "L'Ouvreur Suprême (qui tranche, résout et débloque).",
    esoteric: "La Clé Mystique (Miftah). Qu'il s'agisse d'une maladie, d'un nœud occulte ou d'une crise, Fattah fait sauter les blocages par effraction lumineuse. Il illumine le cœur d'intuitions victorieuses.",
    zikr: "489 fois après Fajr les mains sur le plexus solaire. C'est l'épée de l'esprit pour la réussite.",
    category: "Majesté/Beauté Universelle",
    maqam: "Station de l'Ouverture (Fath)",
    angel: "Luma'il"
  },
  { 
    name: "Ya Latif", 
    ar: "يَا لَطِيفُ",
    val: 129, 
    effect: "Miracles discrets, résolution des crises inextricables, douceur de vie.",
    meaning: "Le Subtil, le Pénétrant, dont la douceur s'infiltre dans l'invisible.",
    esoteric: "Le panacée spirituel. Latif modifie le code source de l'ADN et des événements par une pénétration subatomique. Invoqué en nombre massif (Zikr Jalali), il dissout litéralement les catastrophes (Balaa') planifiées dans l'éther avant qu'elles ne s'abattent.",
    zikr: "129 fois en quotidien. 16641 fois en groupe pour un prodige ou une résolution judiciaire/cataclysmique.",
    category: "Beauté Furtive (Jamal)",
    maqam: "Station de la Subtilité Éprouvée (Lutf)",
    angel: "Tatmiya'il / Jibril"
  },
  { 
    name: "Ya Haq", 
    ar: "يَا حَقُّ",
    val: 108, 
    effect: "Triage absolu du vrai et du faux, victoire de droit.",
    meaning: "La Réalité Ultime.",
    esoteric: "Il foudroie les illusions. Ya Haq dévoile les mensonges structurels. Poids lourd de l'équilibrage universel, il force le système karmique à vous restituer vos droits en dissipant the brouillard des manipulateurs.",
    zikr: "108 fois au milieu de la nuit. Ce dhikr retourne la malveillance à l'envoyeur et équilibre les dettes cosmiques.",
    category: "Majesté Tranchante (Jalal)",
    maqam: "Station de la Constante Vérité (Haqiqa)",
    angel: "Izra'il (Aspect rigoureux)"
  },
  { 
    name: "Ya Wadud", 
    ar: "يَا وَدُودُ",
    val: 20, 
    effect: "Magnétisme interpersonnel, extase mystique (Wajd), affection sociale.",
    meaning: "L'Aimant et l'Aimé Absolu, l'Attracteur universel.",
    esoteric: "Le nom de l'attraction cosmique (Mahabba). Celui qui s'en habille porte une vibration si attirante que même les cœurs haineux sont désarmés. Ce nom réconcilie les opposés et irise l'aura de nuances rosées psychiques.",
    zikr: "20 ou 400 fois sur un dessert, une boisson ou dans les paumes pour émaner l'Amour universel et vaincre la haine.",
    category: "Beauté (Jamal)",
    maqam: "Station de l'Extase Radieuse (Wajd)",
    angel: "Niya'il"
  },
  { 
    name: "Ya Basit", 
    ar: "يَا بَاسِطُ",
    val: 72, 
    effect: "Dilatation du cœur, triomphe sur la dépression (Qabd).",
    meaning: "L'Élargisseur.",
    esoteric: "Le nom souverain contre la mélancolie profonde. Basit desserre l'étau autour du cœur de l'homme, injecte de l'oxyène spirituel dans la poitrine, et donne au charisme vocal une capacité de porter plus loin.",
    zikr: "72 fois au lever du soleil les bras levés en V. Remède alchimique contre l'oppression et les crises d'angoisse.",
    category: "Beauté Extensive (Jamal)",
    maqam: "Station de l'Épanouissement (Bist)",
    angel: "Samha'il"
  },
  { 
    name: "Ya Nur", 
    ar: "يَا نُورُ",
    val: 256, 
    effect: "Transmutation de tous les ombres, brillance faciale (Nuraniyya).",
    meaning: "L'Essence Lumineuse éternelle.",
    esoteric: "Des photons d'intelligence divine pure. Al-Nur n'accorde pas qu'une lumière visible ; il implante une clairvoyance radieuse (Ilm Ladunni). C'est le secret pour vaincre les sorcelleries sombres : les entités ténébreuses sont brûlées par sa seule évocation.",
    zikr: "256 fois les yeux clos (Tahajjud), en absorbant mentalement la lumière blanche or cristalline. Nourrit le corps énergétique.",
    category: "Beauté Éveillante (Jamal)",
    maqam: "Station de l'Illumination (Tajalli)",
    angel: "Zadqiel (Nuriya'il)"
  }
];

const divineNamesTranslations: Record<string, Record<string, Partial<typeof divineNamesDeep[0]>>> = {
  en: {
    "Ya Allah": {
      effect: "Absolute illumination, ego dissolution (Fana), spiritual sovereignty.",
      meaning: "The Absolute Divine Essence, encompassing all attributes of Perfection.",
      esoteric: "Considered by the highest gnostics as the Supreme Name (Ism al-A'dham). 'Allah' acts on the wholeness of being. Its vibration resonates with the 'Sirr' (deep secret). It burns away the veils of the ego (Nafs) and disintegrates all magic. 66 links microcosm and macrocosm.",
      zikr: "The Dhikr of the poles (Aqtab): 66 times a day for perfect vibratory alignment. 4356 (66x66) in retreat (Khalwa) for unveiling (Kashf).",
      category: "Essence (Dhat)",
      maqam: "Station of Pure Oneness (Ahadiyya)"
    },
    "Ya Rahman": {
      effect: "Attraction of cosmic grace, resolution of impossibles, opening of the heart.",
      meaning: "The Universal Matrix of Mercy, whose clémence encompasses all existence.",
      esoteric: "Causes the effusion of existence. Rahman is the attribute by which the universe maintains itself. Its secret, often coupled with 298, acts like rain on dead soil.",
      zikr: "298 times after Fajr to synchronize your aura with the descending mercy of the day.",
      category: "Beauty (Jamal)",
      maqam: "Station of Expansion (Bist)"
    },
    "Ya Rahim": {
      effect: "Intimate protection, softness of heart, safeguarding the family structure.",
      meaning: "The Specifically Merciful, source of pure and continuous Love.",
      esoteric: "While Rahman distributes grace to all, Rahim targets the seeker. It is the healing esoteric balm. It weaves invisible threads of tenderness between individuals.",
      zikr: "258 times after each obligatory prayer to seal your family and projects under divine preservation.",
      category: "Beauty (Jamal)",
      maqam: "Station of Chosen Love (Mahabba)"
    },
    "Ya Quddus": {
      effect: "Purging dark traumas, repelling negative entities (Jinn).",
      meaning: "The Infinitely Holy, Transcendent, devoid of all imperfection.",
      esoteric: "The alchemical fire that purifies the spirit. Al-Quddus dissolves dark obsessions, neuroses, and spells. Recitation of this name raises the vibratory rate of the soul.",
      zikr: "170 times right before sleeping or after dusk to cleanse the psyche of collected negative energies.",
      category: "Majesty (Jalal)",
      maqam: "Station of Original Purity (Fitra)"
    },
    "Ya Salam": {
      effect: "Physical healing, mental peace, immunity against disasters.",
      meaning: "The Giver of Peace and Source of Safety.",
      esoteric: "The cosmic antidote. Ya Salam extinguishes physical fevers, inflammations, and psychological anxiety. This Name pacifies cells and freezes hostile intentions.",
      zikr: "131 times blown onto a glass of water for healing. Recited in fear, it instantly restores peace.",
      category: "Beauty (Jamal)",
      maqam: "Station of Peaceful Heart (Mutma'inna)"
    },
    "Ya Mu'min": {
      effect: "Absolute psychic immunity against anxiety and terror, certified faith.",
      meaning: "The Giver of Security, the Guarantor, Confirmer of Truth.",
      esoteric: "Anchors the soul against life's storms. Acts as a consciousness stabilizer. When zikred, the Light of certainty (Yaqin) floods the chest, making fear powerless.",
      zikr: "136 times at sunrise to wear the armor of security. Protects against unexpected betrayal.",
      category: "Beauty (Jamal)",
      maqam: "Station of Lived Certainty (Haqq al-Yaqin)"
    },
    "Ya Muhaymin": {
      effect: "Clairvoyance (Firasa), reading of hearts, spiritual telepathy.",
      meaning: "The Dominator, the Watchful, the Omniscient Guardian.",
      esoteric: "One of the greatest secrets for opening the inner eye (Bashira). Al-Muhaymin reveals hidden thoughts and intentions of others, letting the veil of reality fall.",
      zikr: "145 times in the middle of the night (Tahajjud). Famous for the gift of second sight.",
      category: "Majesty (Jalal)",
      maqam: "Station of Watchful Vigilance (Muraqaba)"
    },
    "Ya Aziz": {
      effect: "Glory, overwhelming dignity, defeat of enemies.",
      meaning: "The Mighty, the Conqueror, the Invulnerable.",
      esoteric: "Induces instinctive respect and reverent fear in the observer. Ya Aziz carries the energetic signature of a solar aura, repelling tyrants and attracting truth-seekers.",
      zikr: "40 times daily for 40 days to rise from subaltern to glory, or 94 times as a routine.",
      category: "Majesty (Jalal)",
      maqam: "Station of Soul Power ('Izza)"
    },
    "Ya Wahhab": {
      effect: "Irrational abundance, lightning-fast spiritual unveilings.",
      meaning: "The Bestower of boundless gifts without any merit.",
      esoteric: "The divine shortcut. Al-Wahhab bypasses temporal merit, triggering sudden material wealth, genius ideas, and esoteric knowledge (Ilm Ladunni).",
      zikr: "14 times (or 300) with forehead to the ground after Duha. Breaks generational poverty.",
      category: "Beauty (Jamal)",
      maqam: "Station of Favor (Fadl)"
    },
    "Ya Razzaq": {
      effect: "Multidimensional opening of sustenance (Rizq).",
      meaning: "The Inexhaustible Provider.",
      esoteric: "Sustenance is not just money; it is knowledge, air, and quality relationships. Al-Razzaq acts on cosmic commercial flow, attracting opportunities and repelling lack.",
      zikr: "308 times after Fajr at the four corners of your home: occult shield against bankruptcy.",
      category: "Beauty (Jamal)",
      maqam: "Station of Complete Trust (Tawakkul)"
    },
    "Ya Fattah": {
      effect: "Destruction of karmic/magical knots, decisive success.",
      meaning: "The Supreme Opener (who cuts, resolves, and unlocks).",
      esoteric: "The Mystical Key (Miftah). Whether it's an illness, an occult knot, or a crisis, Fattah breaks blocks with luminous force, illuminating the heart.",
      zikr: "489 times after Fajr with hands on the solar plexus. The spirit's sword for success.",
      category: "Universal Majesty/Beauty",
      maqam: "Station of Opening (Fath)"
    },
    "Ya Latif": {
      effect: "Quiet miracles, resolution of inextricable crises, softness of life.",
      meaning: "The Subtle, the Penetrating, whose softness flows into the unseen.",
      esoteric: "The spiritual panacea. Latif alters events at a subatomic level. Invoked in massive numbers (Zikr Jalali), it dissolves catastrophes before they manifest.",
      zikr: "129 times daily. 16,641 times in group for miracles, legal battles, or extreme crises.",
      category: "Subtle Beauty (Jamal)",
      maqam: "Station of Tested Subtlety (Lutf)"
    },
    "Ya Haq": {
      effect: "Absolute sorting of truth and falsehood, victory of justice.",
      meaning: "The Ultimate Reality.",
      esoteric: "Destroys illusions and unveils structural lies. A heavy-weight balancer of the universe, it forces justice and disperses manipulators.",
      zikr: "108 times in the middle of night. This dhikr returns ill-will to its sender and restores balance.",
      category: "Sharp Majesty (Jalal)",
      maqam: "Station of Constant Truth (Haqiqa)"
    },
    "Ya Wadud": {
      effect: "Interpersonal magnetism, mystical ecstasy (Wajd), social affection.",
      meaning: "The Loving and the Beloved Absolute, the universal Attractor.",
      esoteric: "The Name of cosmic attraction (Mahabba). One who wears its vibration becomes so attractive that even hateful hearts are disarmed.",
      zikr: "20 or 400 times over food, drink, or in palms to radiate universal Love and overcome hatred.",
      category: "Beauty (Jamal)",
      maqam: "Station of Radiant Ecstasy (Wajd)"
    },
    "Ya Basit": {
      effect: "Expansion of the heart, triumph over deep depression (Qabd).",
      meaning: "The Expander.",
      esoteric: "The sovereign Name against deep melancholy. Basit loosens the grip around the chest, injecting spiritual oxygen and empowering the voice.",
      zikr: "72 times at sunrise with arms raised in a V. Alchemical remedy for anxiety.",
      category: "Extensive Beauty (Jamal)",
      maqam: "Station of Expansion (Bist)"
    },
    "Ya Nur": {
      effect: "Transmutation of all shadows, facial radiance (Nuraniyya).",
      meaning: "The Eternal Luminous Essence.",
      esoteric: "Photons of pure divine intelligence. Al-Nur grants radiant insight (Ilm Ladunni). A powerful secret to burn dark witchcraft and entities.",
      zikr: "256 times with eyes closed (Tahajjud), mentally absorbing crystalline white light.",
      category: "Awakening Beauty (Jamal)",
      maqam: "Station of Illumination (Tajalli)"
    }
  },
  ha: {
    "Ya Allah": {
      effect: "Haskakawa cikakke, rushewar ego (Fana), ikon ruhaniya.",
      meaning: "Siffar Allah Maɗaukaki wacce ta ƙunshi dukkan kammala.",
      esoteric: "Mafi yawan masana sun ɗauke shi a matsayin Babban Suna (Ism al-A'dham). Allah yana shafar dukkan sassan halitta.",
      zikr: "Zikirin shugabanni (Aqtab): sau 66 a rana don daidaituwa ta ruhaniya. Sau 4356 a cikin kaɗaitaka.",
      category: "Zati (Dhat)",
      maqam: "Matsayin Kadaitaka (Ahadiyya)"
    },
    "Ya Rahman": {
      effect: "Jan hankalin alherin sararin samaniya, warware matsaloli, buɗe zuciya.",
      meaning: "Matattarar Jinƙai ga dukkan halittu.",
      esoteric: "Yana kawo albarkar rayuwa. Rahman ita ce sifar da dukkan sararin samaniya ke dogara da ita.",
      zikr: "Sau 298 bayan asuba don daidaita aura da rahamar da ke sauka.",
      category: "Kyau (Jamal)",
      maqam: "Matsayin Yalwa (Bist)"
    },
    "Ya Rahim": {
      effect: "Kariya ta musamman, taushin zuciya, tsaron iyali.",
      meaning: "Mai Jinƙai na Musamman ga muminai.",
      esoteric: "Yana warkar da raunin ruhaniya. Yana haɗa zukatan mutane da soyayya da aminci.",
      zikr: "Sau 258 bayan kowace sallah don kare iyali da ayyuka a ƙarƙashin tsaron Allah.",
      category: "Kyau (Jamal)",
      maqam: "Matsayin Soyayya (Mahabba)"
    },
    "Ya Quddus": {
      effect: "Wanke tsoffin damuwar zuciya, korar miyagun aljanu.",
      meaning: "Tsarkakakke, Mai Transcendent, maras aibi.",
      esoteric: "Wutar alchemical ce mai tsarkake ruhu. Al-Quddus yana rushe damuwar tunani da sihiri.",
      zikr: "Sau 170 kafin barci don tsarkake tunani daga munanan kuzarin da aka tara da rana.",
      category: "Jalala (Jalal)",
      maqam: "Matsayin Tsarki (Fitra)"
    },
    "Ya Salam": {
      effect: "Warkar da jiki, kwanciyar hankali, kariya daga musifu.",
      meaning: "Sallamar Zaman Lafiya, Tushen Kariya.",
      esoteric: "Rigakafin sararin samaniya. Ya Salam yana kashe zazzaɓi da fargabar hankali. Invoƙin sa yana daidaita kwayoyin halitta.",
      zikr: "Sau 131 a hura a ruwa don waraka. Karanta shi lokacin tsoro don samun kwanciyar hankali nan take.",
      category: "Kyau (Jamal)",
      maqam: "Matsayin Kwanciyar Hankali (Mutma'inna)"
    },
    "Ya Mu'min": {
      effect: "Kariya ta musamman kaɗai daban-daban daga fargaba da tsoro, ingantaccen imani.",
      meaning: "Mai ba da Tsaro da Kariya.",
      esoteric: "Yana tabbatar da rai a lokacin wahala. Hasken yakini yana cika zuciya lokacin yin zikirin sa.",
      zikr: "Sau 136 da safe don sanya sulken kariya da aminci daga cin amana.",
      category: "Kyau (Jamal)",
      maqam: "Matsayin Tabbas (Haqq al-Yaqin)"
    },
    "Ya Muhaymin": {
      effect: "Bayyanar basira (Firasa), karanta zukata, telepathy ta ruhu.",
      meaning: "Mai Kula, Mabuwayi, Mai kiyayewa.",
      esoteric: "Wani babban sirri ne na buɗe idon basira. Al-Muhaymin yana bayyana ɓoyayyen tunanin wasu.",
      zikr: "Sau 145 a tsakiyar dare (Sallan dare). Sananne ne don samun basirar gaskiya.",
      category: "Jalala (Jalal)",
      maqam: "Matsayin Kula da Zuciya (Muraqaba)"
    },
    "Ya Aziz": {
      effect: "Daukaka, kwarjini mai girma, nasara a kan makiya.",
      meaning: "Mabuwayi, Mai nasara, maras rauni.",
      esoteric: "Yana sanya girmamawa a zukatan mutane. Yana sanya aura mai ƙarfi da ke korar azzalufai.",
      zikr: "Sau 40 a kowace rana na tsawon kwanaki 40 don samun ɗaukaka, ko sau 94 a matsayin zikiri.",
      category: "Jalala (Jalal)",
      maqam: "Matsayin Izzah ('Izza)"
    },
    "Ya Wahhab": {
      effect: "Arziki mai yawa, buɗewar ruhaniya cikin sauri.",
      meaning: "Mai yawan kyauta maras iyaka ba tare da lissafi ba.",
      esoteric: "Hanya mafi sauƙi. Al-Wahhab yana kawo arziki na ba zato ba tsammani da ilimin asiri.",
      zikr: "Sau 14 (ko 300) da goshi a ƙasa bayan sallar hantsi. Yana karya talauci.",
      category: "Kyau (Jamal)",
      maqam: "Matsayin Falala (Fadl)"
    },
    "Ya Razzaq": {
      effect: "Buɗe hanyoyin arziki da abinci ta ko'ina (Rizq).",
      meaning: "Mai azurta halittu ba tare da yankewa ba.",
      esoteric: "Arziki ba kuɗi kaɗai ba ne; ilimi ne da zaman lafiya. Al-Razzaq yana jan hankalin damammakin kasuwanci.",
      zikr: "Sau 308 bayan asuba a kusurwoyi huɗu na gida don karewa daga fatara.",
      category: "Kyau (Jamal)",
      maqam: "Matsayin Dogara ga Allah (Tawakkul)"
    },
    "Ya Fattah": {
      effect: "Karya ƙulle-ƙullen sihiri, samun babban rabo.",
      meaning: "Mai Buɗewa Maɗaukaki (Mai yanke hukunci da buɗe hanya).",
      esoteric: "Mabuɗin Ruhaniya (Miftah). Al-Fattah yana buɗe dukkan ƙofofin da aka rufe na rayuwa.",
      zikr: "Sau 489 bayan asuba da hannaye a kan ƙirji don nasara da daukaka.",
      category: "Mulki da Kyau",
      maqam: "Matsayin Buɗewa (Fath)"
    },
    "Ya Latif": {
      effect: "Mu'ujizoji na sirri, maganin matsaloli masu wuya, sauƙin rayuwa.",
      meaning: "Mai Sauƙi da Sanin dukkan abubuwan da ke ɓoye.",
      esoteric: "Lafiyar ruhu. Latif yana canza yanayi cikin ikon Allah don kawar da bala'o'i.",
      zikr: "Sau 129 a kowace rana. Sau 16641 a cikin rukuni don neman babban taimako a kan shari'a ko bala'i.",
      category: "Kyau na Sirri (Jamal)",
      maqam: "Matsayin Tausayi (Lutf)"
    },
    "Ya Haq": {
      effect: "Tabbatar da gaskiya da karyata ƙarya, nasarar adalci.",
      meaning: "Gaskiya ta Har abada.",
      esoteric: "Yana ruguza yaudara kuma yana bayyana gaskiya. Yana mayar da dukkan haƙƙoƙi ga masu su.",
      zikr: "Sau 108 a tsakiyar dare don kare kai da dawo da adalci.",
      category: "Jalala mai ƙarfi (Jalal)",
      maqam: "Matsayin Haƙiƙa (Haqiqa)"
    },
    "Ya Wadud": {
      effect: "Jan hankali tsakanin mutane, soyayya da daukaka a cikin al'umma.",
      meaning: "Mai Son Bayinsa, Abokin Tarayya na Gaskiya.",
      esoteric: "Suna ne na soyayya (Mahabba). Wanda ya saba da shi yana samun karɓuwa a idon kowa.",
      zikr: "Sau 20 ko 400 a kan abinci ko abin sha ko a busa a hannu don samar da zaman lafiya da soyayya.",
      category: "Kyau (Jamal)",
      maqam: "Matsayin Soyayyar gaskiya (Wajd)"
    },
    "Ya Basit": {
      effect: "Yalwar zuciya da farin ciki, maganin damuwar zuciya (Qabd).",
      meaning: "Mai Yalwatawa.",
      esoteric: "Maganin bakin ciki mai zurfi. Basit yana buɗe ƙirjin mutum kuma yana cire ƙunci.",
      zikr: "Sau 72 lokacin fitowar rana tare da ɗaga hannaye sama don warware damuwa.",
      category: "Kyau (Jamal)",
      maqam: "Matsayin Yalwa (Bist)"
    },
    "Ya Nur": {
      effect: "Juya dukkan duhu zuwa haske, hasken fuska (Nuraniyya).",
      meaning: "Hasken da ba ya ƙarewa.",
      esoteric: "Haske ne na gaskiya. Al-Nur yana ba da basira ta musamman kuma yana ƙone dukkan sihiri na duhu.",
      zikr: "Sau 256 da idanu a rufe a cikin sallah dare, don cika zuciya da hasken Allah.",
      category: "Kyau (Jamal)",
      maqam: "Matsayin Bayyanar Haske (Tajalli)"
    }
  }
};

const getLocalizedNameItem = (item: typeof divineNamesDeep[0], lang: string): typeof divineNamesDeep[0] => {
  const trans = divineNamesTranslations[lang]?.[item.name];
  if (!trans) return item;
  return {
    ...item,
    ...trans
  };
};

export const Asma: React.FC = () => {
  const { t, language } = useLanguage();
  const [val, setVal] = useState('');
  const [result, setResult] = useState<typeof divineNamesDeep>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedGridSize, setSelectedGridSize] = useState<number>(3);

  // Gamification hook on load
  useEffect(() => {
    let stats; try { stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}'); if (!stats || typeof stats !== 'object') stats = {}; } catch(e) { stats = {}; }
    stats.tools_used = (stats.tools_used || 0) + 1;
    localStorage.setItem('asrar_stats', JSON.stringify(stats));
  }, []);

  const searchNames = () => {
    const num = parseInt(val, 10);
    if (isNaN(num)) return;
    
    // Sort names by absolute difference to the input value
    let sorted = [...divineNamesDeep].sort((a, b) => Math.abs(a.val - num) - Math.abs(b.val - num));
    setResult(sorted.slice(0, 3)); // Return top 3 closest matches
    setExpandedId(null);
  };

  const getCategoryColor = (category: string) => {
    if (category.includes('Jamal')) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
    if (category.includes('Jalal')) return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20';
    return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'; // Essence / Both
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/tools" 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-indigo-500" />
            {t("tools.asma.title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("tools.asma.subtitle")}</p>
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-5 mb-8">
        <p className="text-sm text-indigo-800 dark:text-indigo-200 font-medium leading-relaxed">
          {/* @ts-ignore */}
          <span dangerouslySetInnerHTML={{ __html: t("tools.asma.intro") }} />
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">{t("tools.asma.inputLabel")}</label>
        <div className="flex gap-3 sm:gap-4">
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder={t("tools.asma.inputPlaceholder")}
            className="flex-1 min-w-0 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-base sm:text-xl font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={searchNames}
            disabled={!val}
            className="shrink-0 h-[56px] sm:h-16 px-5 sm:px-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Search size={20} /> <span className="hidden sm:inline">{t("tools.asma.calculate")}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-sm mb-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              {t("tools.asma.titleResult", "Vos Noms Résonnants (Zikr Personnel)")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {t("tools.asma.descResult", "Le premier Nom affiché est celui qui fusionne le plus parfaitement avec votre empreinte d'âme. Cliquez sur une carte pour révéler les secrets.")}
            </p>

            {result.map((item, idx) => {
              const isExpanded = expandedId === idx;
              const localizedItem = getLocalizedNameItem(item, language);
              
              return (
                <motion.div
                  key={idx}
                  layout
                  onClick={() => {
                    setExpandedId(isExpanded ? null : idx);
                    setSelectedGridSize(3);
                  }}
                  className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                >
                  <div className="p-6 md:p-8 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                         <span className={`px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest ${getCategoryColor(localizedItem.category || '')}`}>
                           {localizedItem.category}
                         </span>
                         {idx === 0 && (
                            <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-lg">
                               <Star size={12} fill="currentColor" /> {t("tools.asma.mainAffinity", "Affinité Principale")}
                            </span>
                         )}
                         <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-lg">
                           <BookOpen size={12} />
                           {(asmaListData.find(n => n.abjad === localizedItem.val)?.quranOptions?.count ?? 0)} {language === 'fr' ? 'fois dans le Coran' : language === 'ha' ? 'sau a Alƙur\'ani' : 'times in Quran'}
                         </span>
                      </div>
                      <h4 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                        {localizedItem.name.replace(/^Ya\s+/, '')} <span className="font-arabic font-normal text-indigo-600 dark:text-indigo-400 ml-2">{applyTashkeel(localizedItem.ar.replace(/^يَا\s+/, '').replace(/^يَا/, ''))}</span>
                      </h4>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{localizedItem.meaning}</p>
                    </div>
                    
                    <div className="hidden sm:flex shrink-0 w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-2xl items-center justify-center border-2 border-gray-100 dark:border-gray-700">
                       <div className="text-center">
                          <span className="block text-[10px] uppercase font-bold text-gray-400">Abjad</span>
                          <span className="block text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono tracking-tighter">{localizedItem.val}</span>
                       </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-100 dark:border-gray-700"
                      >
                         <div className="p-6 md:p-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800 space-y-6">
                            
                            {/* Inner Header with Maqam & Angel */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 flex items-center justify-center">
                                     <Compass size={16} />
                                   </div>
                                   <div>
                                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">{t("tools.asma.maqam")}</span>
                                      <span className="block text-sm font-bold text-gray-900 dark:text-white">{localizedItem.maqam}</span>
                                   </div>
                                </div>
                                
                                <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 flex items-center justify-center">
                                     <Feather size={16} />
                                   </div>
                                   <div>
                                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">{t("tools.asma.ruhaniyya")}</span>
                                      <span className="block text-sm font-bold text-gray-900 dark:text-white">{localizedItem.angel}</span>
                                   </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                               <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 shrink-0">
                                 <Shield size={20} />
                               </div>
                               <div>
                                  <h5 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">{t("tools.asma.sirr")}</h5>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-serif text-justify">
                                    {localizedItem.esoteric}
                                  </p>
                               </div>
                            </div>

                            <div className="flex items-start gap-4">
                               <div className="w-10 h-10 rounded-full flex items-center justify-center bg-rose-100 dark:bg-rose-900/30 text-rose-600 shrink-0">
                                 <Heart size={20} />
                               </div>
                               <div>
                                  <h5 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">{t("tools.asma.khassiyya")}</h5>
                                  <p className="text-sm font-medium text-rose-600 dark:text-rose-400 shadow-sm border border-rose-100 dark:border-rose-900/30 bg-white dark:bg-gray-900 p-3 rounded-xl inline-block">
                                    {localizedItem.effect}
                                  </p>
                               </div>
                            </div>

                            <div className="flex items-start gap-4">
                               <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 shrink-0">
                                 <BookOpen size={20} />
                               </div>
                               <div className="w-full">
                                  <h5 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">{t("tools.asma.tariqa")}</h5>
                                  <p className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                    {localizedItem.zikr}
                                  </p>
                               </div>
                            </div>
                             <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mt-4" onClick={(e) => e.stopPropagation()}>
                                <h5 className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4 text-center">{t("tools.asma.theurgic")}</h5>
                                
                                <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl text-center">
                                  <span className="block text-xs uppercase font-bold text-indigo-800 dark:text-indigo-300 mb-1">{t("tools.asma.talsamCode")}</span>
                                  <span className="font-arabic text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{applyTashkeel(`طَمْشَلَشٍ ${localizedItem.ar.replace('يَا ', '').replace('يَا', '')} كَضْهَيُوشٍ`)}</span>
                                  <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mt-2 font-mono">{t("tools.asma.talsamDesc")} {localizedItem.val}</p>
                                </div>

                                <div className="mb-6">
                                  <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2 text-center">
                                    {language === 'fr' ? 'Dimension du Carré Magique (Khatim)' : language === 'ha' ? 'Girman Carré Magique' : 'Magic Square Dimension'}
                                  </label>
                                  <div className="flex flex-wrap justify-center gap-1.5">
                                    {[
                                      { size: 3, name: '3x3' },
                                      { size: 4, name: '4x4' },
                                      { size: 5, name: '5x5' },
                                      { size: 6, name: '6x6' },
                                      { size: 7, name: '7x7' },
                                      { size: 8, name: '8x8' },
                                      { size: 9, name: '9x9' },
                                      { size: 10, name: '10x10' }
                                    ].map(({ size, name }) => (
                                      <button
                                        key={size}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedGridSize(size);
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${selectedGridSize === size ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-700 dark:text-gray-300'}`}
                                      >
                                        {name}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="text-center">
                                  <h6 className="text-[11px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-3">
                                    {selectedGridSize === 3 ? 'Muthallath' : selectedGridSize === 4 ? "Murabba'" : selectedGridSize === 5 ? 'Mukhammas' : selectedGridSize === 6 ? 'Musaddas' : selectedGridSize === 7 ? "Musabba'" : selectedGridSize === 8 ? 'Muthamman' : selectedGridSize === 9 ? "Mutassa'" : "Mu'ashshar"} ({selectedGridSize}x{selectedGridSize})
                                  </h6>
                                  <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
                                    <div className={`grid mx-auto max-w-[20rem] min-w-[240px] gap-1 p-2 bg-gray-100 dark:bg-gray-900 rounded-xl relative ${gridColsClassMap[selectedGridSize] || 'grid-cols-3'}`}>
                                      {generateDynamicVifiq(selectedGridSize, localizedItem.val).map((row, i) => 
                                        row.map((cell, j) => (
                                          <div 
                                            key={`${i}-${j}`} 
                                            className={`${gridCellPaddingMap[selectedGridSize] || 'p-2'} bg-white dark:bg-gray-800 rounded-md flex items-center justify-center font-mono font-bold text-gray-900 dark:text-white shadow-sm border border-gray-50 dark:border-gray-700 ${textPercentSizeMap[selectedGridSize] || 'text-sm'}`}
                                          >
                                            {cell}
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                </div>
                             </div>

                             {/* Guide de Prospérité Professionnelle */}
                             <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-5 mt-6" onClick={(e) => e.stopPropagation()}>
                               <h5 className="text-sm font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-4 flex items-center gap-2">
                                 🔑 Cabinet d'Asrar : Stratégies de Prospérité et Usages Avancés
                               </h5>
                               
                               <div className="space-y-4 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                 <p>
                                   L'usage professionnel de l'énergie spirituelle du Nom <strong>{localizedItem.name}</strong> permet aux praticiens sincères d'offrir des services d'accompagnement vibratoire de haute valeur. Voici comment intégrer ce thème pour développer votre activité et générer des revenus éthiques :
                                 </p>

                                 <div className="bg-white dark:bg-gray-900/60 p-4 rounded-xl border border-amber-100 dark:border-amber-950">
                                   <h6 className="font-bold text-amber-800 dark:text-amber-400 mb-1">1. Confection de Supports Sacrés (Khawatim/Wafq) sur Métal</h6>
                                   <p className="mb-2">
                                     Le Wafq {selectedGridSize}x{selectedGridSize} ci-dessus peut être gravé sur une plaque de métal noble durant les heures planétaires associées au Nom (généralement sous l'égide de la lune ou du soleil, selon la nature du Nom). 
                                   </p>
                                   <ul className="list-disc pl-4 space-y-1">
                                     <li><strong>Métaux :</strong> Argent pour la protection et la clarté spirituelle ; Cuivre rouge pour l'attraction d'affection et de clientèle ; Laiton/Or pour la souveraineté et l'expansion financière.</li>
                                     <li><strong>Méthode de monétisation :</strong> Vous pouvez proposer ces supports gravés sur mesure à vos clients sous forme d'amulettes de poche ou d'objets d'harmonisation de l'espace de travail. Un support authentique activé se vend entre 150 € et 500 € selon la complexité astrologique.</li>
                                   </ul>
                                 </div>

                                 <div className="bg-white dark:bg-gray-900/60 p-4 rounded-xl border border-amber-100 dark:border-amber-950">
                                   <h6 className="font-bold text-amber-800 dark:text-amber-400 mb-1">2. Profiling Vibratoire et Consulting d'Âme (Kashf)</h6>
                                   <p className="mb-2">
                                     En combinant la valeur Abjad de votre client avec celle de son projet de vie, vous déterminez s'il résonne harmonieusement avec la vibration <strong>{localizedItem.val}</strong>.
                                   </p>
                                   <ul className="list-disc pl-4 space-y-1">
                                     <li><strong>Méthode de calcul :</strong> Si l'Abjad cumulé de votre client et de son activité économique équivaut ou s'approche d'un multiple de {localizedItem.val}, cette synergie est hautement propice.</li>
                                     <li><strong>Service proposé :</strong> Proposez des séances de "diagnostic de blocages énergétiques" (Kashf) en cabinet ou en ligne. Facturez ces consultations de 80 € à 150 € l'heure, en fournissant un Wird d'alignement et d'activation précis basé sur ce Nom.</li>
                                   </ul>
                                 </div>

                                 <div className="bg-white dark:bg-gray-900/60 p-4 rounded-xl border border-amber-100 dark:border-amber-950">
                                   <h6 className="font-bold text-amber-800 dark:text-amber-400 mb-1">3. Recettes Spécifiques de Prospérité Commerciale (Jalbi al-Arzaq)</h6>
                                   <p className="mb-2">
                                     Pour les commerces physiques ou en ligne souffrant d'un manque de clients, le secret de <strong>{localizedItem.name}</strong> s'applique ainsi :
                                   </p>
                                   <ul className="list-disc pl-4 space-y-1">
                                     <li>Rédigez le code talsamique ci-dessus <strong>(طَمْشَلَشٍ {localizedItem.ar.replace('يَا ', '').replace('يَا', '')} كَضْهَيُوشٍ)</strong> à l'encre de safran et d'eau de rose sur un parchemin vierge un jeudi à l'aube.</li>
                                     <li>Baignez légèrement le parchemin dans l'eau de source pour en dissoudre l'encre sacrée, puis aspergez discrètement les quatre coins du local commercial ou du bureau. Cela élimine instantanément les vibrations stagnantes ("Nazar" ou jalousies d'affaires) et ouvre les portes de l'abondance.</li>
                                   </ul>
                                 </div>

                                 <div className="bg-white dark:bg-gray-900/60 p-4 rounded-xl border border-amber-100 dark:border-amber-950">
                                   <h6 className="font-bold text-amber-800 dark:text-amber-400 mb-1">4. Pratiques Méditatives Avancées (Khalwa & Riyada)</h6>
                                   <p>
                                     Pour acquérir l'autorité spirituelle nécessaire au bon fonctionnement de ces recettes (le "Tassarouf"), le praticien doit lui-même accomplir une retraite de jeûne partiel (Riyada) en récitant ce Nom {localizedItem.val} fois chaque nuit pendant 7, 21 ou 40 jours consécutifs, jusqu'à ressentir une clarté mentale et un magnétisme accrus.
                                   </p>
                                 </div>
                               </div>
                             </div>

                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

