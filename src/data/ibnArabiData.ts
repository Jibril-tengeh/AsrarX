// Ibn al-Arabi Metaphysical Cosmology Data & Calculations

export interface ArabicLetterMeta {
  letter: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  adad: number;
  world: 'hahut' | 'lahut' | 'jabarut' | 'malakut' | 'mulk';
  element: 'fire' | 'air' | 'water' | 'earth';
  khadim: string;
  cosmicRank: number;
  esotericMeaningFr: string;
  esotericMeaningEn: string;
  esotericMeaningHa: string;
}

export const ARABIC_LETTERS_METAPHYSICS: ArabicLetterMeta[] = [
  {
    letter: 'ا',
    nameAr: 'أَلِف',
    nameFr: 'Alif',
    nameEn: 'Alif',
    nameHa: 'Alif',
    adad: 1,
    world: 'hahut',
    element: 'fire',
    khadim: 'إِسْرَافِيل (Isrāfīl)',
    cosmicRank: 1,
    esotericMeaningFr: "L'Unité Primordiale (Ahadiyyah), la Graine de l'Être sans commencement ni fin.",
    esotericMeaningEn: "Primordial Oneness (Ahadiyyah), the Seed of Being without start or finish.",
    esotericMeaningHa: "Kadaita Allah (Ahadiyyah), Kwayar Halitta wacce ba ta da farko ko karshe."
  },
  {
    letter: 'ب',
    nameAr: 'بَاء',
    nameFr: 'Ba',
    nameEn: 'Ba',
    nameHa: 'Ba',
    adad: 2,
    world: 'mulk',
    element: 'water',
    khadim: 'جِبْرِيل (Jibrīl)',
    cosmicRank: 2,
    esotericMeaningFr: "Le Point sous le Ba (Nuqta), début de la manifestation créée et réceptacle de la Bismillāh.",
    esotericMeaningEn: "The Dot beneath the Ba (Nuqta), beginning of created manifestation and vessel of Bismillah.",
    esotericMeaningHa: "Digon karkashin Ba, farkon bayyanar halitta da taskar Bismillah."
  },
  {
    letter: 'ج',
    nameAr: 'جِيم',
    nameFr: 'Jim',
    nameEn: 'Jim',
    nameHa: 'Jim',
    adad: 3,
    world: 'mulk',
    element: 'air',
    khadim: "كَلْكَائِيل (Kalkā'īl)",
    cosmicRank: 3,
    esotericMeaningFr: "L'Assemblée de la Beauté (Jamāl) et la trinité de l'Amour, de l'Amant et de l'Aimé.",
    esotericMeaningEn: "The Gathering of Beauty (Jamal) and the trinity of Love, Lover, and Beloved.",
    esotericMeaningHa: "Taron Kyawun Halitta (Jamal) da soyayyar Ubangiji."
  },
  {
    letter: 'د',
    nameAr: 'دَال',
    nameFr: 'Dal',
    nameEn: 'Dal',
    nameHa: 'Dal',
    adad: 4,
    world: 'mulk',
    element: 'earth',
    khadim: "دَرْدَيَائِيل (Dardyā'īl)",
    cosmicRank: 4,
    esotericMeaningFr: "Les 4 Piliers cardinaux de la création et la preuve évidente (Dalālah) de l'Artisan Céleste.",
    esotericMeaningEn: "The 4 Cardinal pillars of creation and the clear proof (Dalaalah) of the Celestial Artisan.",
    esotericMeaningHa: "Rukunai 4 na duniya da shaidar samuwar Ubangiji."
  },
  {
    letter: 'هـ',
    nameAr: 'هَاء',
    nameFr: 'Ha (Essence)',
    nameEn: 'Ha (Essence)',
    nameHa: 'Ha (Zat)',
    adad: 5,
    world: 'hahut',
    element: 'fire',
    khadim: "هُورِيَائِيل (Hūriyā'īl)",
    cosmicRank: 5,
    esotericMeaningFr: "L'Identité Absolue (Huwa / الهُوِيَّة) et le Mystère du Tréfonds Invisible (Ghayb al-Ghuyūb).",
    esotericMeaningEn: "Absolute Divine Identity (Huwa) and the Mystery of the Unseen Depth (Ghayb al-Ghuyub).",
    esotericMeaningHa: "Zatin Allah na Boye (Huwa) da sirrin gaibu wanda babu wanda ya san shi sai Shi."
  },
  {
    letter: 'و',
    nameAr: 'وَاو',
    nameFr: 'Waw',
    nameEn: 'Waw',
    nameHa: 'Waw',
    adad: 6,
    world: 'hahut',
    element: 'air',
    khadim: "وَافِيَائِيل (Wāfiyā'īl)",
    cosmicRank: 6,
    esotericMeaningFr: "Le Lien universel d'Amour (Al-Waṣl) unissant le Créateur et les créatures dans la miséricorde.",
    esotericMeaningEn: "The Universal Bond of Love (Al-Wasl) uniting Creator and created in divine mercy.",
    esotericMeaningHa: "Hadin Soyayyar Ubangiji (Al-Wasl) mai hada Rahama da bayinsa."
  },
  {
    letter: 'ز',
    nameAr: 'زَاي',
    nameFr: 'Zay',
    nameEn: 'Zay',
    nameHa: 'Zay',
    adad: 7,
    world: 'mulk',
    element: 'water',
    khadim: 'زَهْرِييل (Zahrīl)',
    cosmicRank: 7,
    esotericMeaningFr: "L'Éclat de la Parure Divine (Zīnah) et les 7 cieux superposés.",
    esotericMeaningEn: "The Radiance of Divine Adornment (Zinah) and the 7 layered heavens.",
    esotericMeaningHa: "Kayan Ado na Hasken Ubangiji (Zinah) da sammai bakwai."
  },
  {
    letter: 'ح',
    nameAr: 'حَاء',
    nameFr: 'Hah (Vie)',
    nameEn: 'Hah (Life)',
    nameHa: 'Hah (Rai)',
    adad: 8,
    world: 'malakut',
    element: 'earth',
    khadim: "حَمْلِيَائِيل (Ḥamliyā'īl)",
    cosmicRank: 8,
    esotericMeaningFr: "La Vie Éternelle (Al-Ḥayy) et la Pure Vérité (Al-Ḥaqq) circulant dans toutes les particules.",
    esotericMeaningEn: "Eternal Life (Al-Hayy) and Pure Truth (Al-Haqq) coursing through all particles.",
    esotericMeaningHa: "Rayuwa Ta Har Abada (Al-Hayy) da Gaskiya Tsantsa (Al-Haqq)."
  },
  {
    letter: 'ط',
    nameAr: 'طَاء',
    nameFr: 'Ta',
    nameEn: 'Ta',
    nameHa: 'Ta',
    adad: 9,
    world: 'jabarut',
    element: 'fire',
    khadim: "طَمْخَائِيل (Ṭamkhā'īl)",
    cosmicRank: 9,
    esotericMeaningFr: "La Pureté Primordiale (Ṭahārah) et l'Enceinte Sanctifiée des Âmes Éveillées.",
    esotericMeaningEn: "Primordial Purity (Taharah) and the Sanctified Sanctuary of Awakened Souls.",
    esotericMeaningHa: "Tsararriyar Tsarki (Taharah) da dakin tsarkakan bayin Allah."
  },
  {
    letter: 'ي',
    nameAr: 'يَاء',
    nameFr: 'Ya',
    nameEn: 'Ya',
    nameHa: 'Ya',
    adad: 10,
    world: 'lahut',
    element: 'air',
    khadim: 'يَعْقُوبِيل (Yāqūbīl)',
    cosmicRank: 10,
    esotericMeaningFr: "La Main de Puissance (Yad al-Qudrah) et la Certitude Absolue (Yaqīn).",
    esotericMeaningEn: "The Hand of Power (Yad al-Qudrah) and Absolute Certainty (Yaqin).",
    esotericMeaningHa: "Hannun Ikon Ubangiji (Yad al-Qudrah) da Yakini na kwarai (Yaqin)."
  },
  {
    letter: 'ك',
    nameAr: 'كَاف',
    nameFr: 'Kaf',
    nameEn: 'Kaf',
    nameHa: 'Kaf',
    adad: 20,
    world: 'jabarut',
    element: 'water',
    khadim: "كَرْكَائِيل (Karkā'īl)",
    cosmicRank: 11,
    esotericMeaningFr: "La Parole Créatrice 'Kun' (كُن - Sois !) et le Trésor Caché (Kanz Makhfiyy).",
    esotericMeaningEn: "The Creative Imperative 'Kun' (Be!) and the Hidden Treasure (Kanz Makhfiyy).",
    esotericMeaningHa: "Kalmar Halitta 'Kun' (Kasance!) da Taskar Asiri ta Boye."
  },
  {
    letter: 'ل',
    nameAr: 'لَام',
    nameFr: 'Lam',
    nameEn: 'Lam',
    nameHa: 'Lam',
    adad: 30,
    world: 'lahut',
    element: 'earth',
    khadim: "لُومَائِيل (Lūmā'īl)",
    cosmicRank: 12,
    esotericMeaningFr: "La Grâce Infinie (Al-Luṭf) et la descente de la Sagesse dans le cœur du sage.",
    esotericMeaningEn: "Infinite Grace (Al-Lutf) and the descent of Wisdom into the heart of the sage.",
    esotericMeaningHa: "Tattausan Rahama (Al-Lutf) da saukar Hikima a zuciyar masani."
  },
  {
    letter: 'م',
    nameAr: 'مِيم',
    nameFr: 'Mim',
    nameEn: 'Mim',
    nameHa: 'Mim',
    adad: 40,
    world: 'lahut',
    element: 'fire',
    khadim: "مِيكَائِيل (Mīkā'īl)",
    cosmicRank: 13,
    esotericMeaningFr: "La Réalité Muhammadienne (Al-Ḥaqīqah al-Muḥammadiyyah) et la Royauté Céleste (Al-Mulk).",
    esotericMeaningEn: "The Muhammadan Reality (Al-Haqiqah al-Muhammadiyyah) and Celestial Sovereignty.",
    esotericMeaningHa: "Haqiqar Annabi Muhammad (SAW) da Mulkin Samaniya."
  },
  {
    letter: 'ن',
    nameAr: 'نُون',
    nameFr: 'Nun',
    nameEn: 'Nun',
    nameHa: 'Nun',
    adad: 50,
    world: 'lahut',
    element: 'air',
    khadim: "نُورِيَائِيل (Nūryā'īl)",
    cosmicRank: 14,
    esotericMeaningFr: "La Lumière Primordiale (Al-Nūr) et l'Écritoire Céleste consignant le destin.",
    esotericMeaningEn: "Primordial Light (Al-Nur) and the Celestial Inkpot inscribing destiny.",
    esotericMeaningHa: "Hasken Asali (Al-Nur) da Tawadar Kaddara ta Samaniya."
  },
  {
    letter: 'س',
    nameAr: 'سِين',
    nameFr: 'Sin',
    nameEn: 'Sin',
    nameHa: 'Sin',
    adad: 60,
    world: 'mulk',
    element: 'water',
    khadim: "سَلْسَائِيل (Salsā'īl)",
    cosmicRank: 15,
    esotericMeaningFr: "Le Secret des Secrets (Sirr al-Asrār) et la Paix Universelle (Salām).",
    esotericMeaningEn: "The Secret of Secrets (Sirr al-Asrar) and Universal Peace (Salam).",
    esotericMeaningHa: "Sirrin Sirrika (Sirr al-Asrar) da Zaman Lafiya na Duniya (Salam)."
  },
  {
    letter: 'ع',
    nameAr: 'عَيْن',
    nameFr: 'Ayn',
    nameEn: 'Ayn',
    nameHa: 'Ayn',
    adad: 70,
    world: 'malakut',
    element: 'earth',
    khadim: "عَنْيَائِيل (ʿAnyā'īl)",
    cosmicRank: 16,
    esotericMeaningFr: "La Source Primordiale (Al-ʿAyn) et la Vision du Cœur (Kashf al-Baṣīrah).",
    esotericMeaningEn: "The Primordial Spring (Al-Ayn) and the Inner Heart Vision (Kashf al-Basirah).",
    esotericMeaningHa: "Idon Ruhi da Mashayar Hasken Asiri (Al-Ayn)."
  },
  {
    letter: 'ف',
    nameAr: 'فَاء',
    nameFr: 'Fa',
    nameEn: 'Fa',
    nameHa: 'Fa',
    adad: 80,
    world: 'malakut',
    element: 'fire',
    khadim: 'فَتْحِييل (Fatḥīl)',
    cosmicRank: 17,
    esotericMeaningFr: "L'Ouverture Spirituelle Illimitée (Al-Fatḥ) et la Délivrance des Nœuds.",
    esotericMeaningEn: "Limitless Spiritual Opening (Al-Fath) and the Untying of Knots.",
    esotericMeaningHa: "Bude na Asiri (Al-Fath) da kwance kowane irin kullin asiri."
  },
  {
    letter: 'ص',
    nameAr: 'صَاد',
    nameFr: 'Sad',
    nameEn: 'Sad',
    nameHa: 'Sad',
    adad: 90,
    world: 'jabarut',
    element: 'air',
    khadim: 'صَمْصَمِيل (Ṣamṣamīl)',
    cosmicRank: 18,
    esotericMeaningFr: "La Sincérité Pure (Al-Ṣidq) et le Rocher Immuable de la Foi.",
    esotericMeaningEn: "Pure Sincerity (Al-Sidq) and the Unshakable Rock of Faith.",
    esotericMeaningHa: "Gaskiya Tsantsa (Al-Sidq) da Tabbatar Imani a zuciya."
  },
  {
    letter: 'ق',
    nameAr: 'قَاف',
    nameFr: 'Qaf',
    nameEn: 'Qaf',
    nameHa: 'Qaf',
    adad: 100,
    world: 'jabarut',
    element: 'water',
    khadim: 'قَدِّيسِيل (Qaddīsīl)',
    cosmicRank: 19,
    esotericMeaningFr: "La Montagne Cosmique Qāf encerclant la création et la Toute-Puissance Divine (Al-Qudra).",
    esotericMeaningEn: "The Cosmic Mountain Qaf encircling creation and Divine Omnipotence (Al-Qudra).",
    esotericMeaningHa: "Dutsen Qaf na Samaniya da Ikon Allah Mai Girma."
  },
  {
    letter: 'ر',
    nameAr: 'رَاء',
    nameFr: 'Ra',
    nameEn: 'Ra',
    nameHa: 'Ra',
    adad: 200,
    world: 'mulk',
    element: 'earth',
    khadim: 'رَوْقِيل (Ruqīl)',
    cosmicRank: 20,
    esotericMeaningFr: "La Miséricorde Rayonnante (Al-Raḥmah) qui englobe chaque créature.",
    esotericMeaningEn: "Radiant Divine Mercy (Al-Rahmah) encompassing every existing thing.",
    esotericMeaningHa: "Rahamar Ubangiji Mai Yalwa (Al-Rahmah) wacce ta game kowa da komai."
  },
  {
    letter: 'ش',
    nameAr: 'شِين',
    nameFr: 'Shin',
    nameEn: 'Shin',
    nameHa: 'Shin',
    adad: 300,
    world: 'mulk',
    element: 'fire',
    khadim: 'شَمْشِيل (Shamshīl)',
    cosmicRank: 21,
    esotericMeaningFr: "Le Témoignage Mystique (Al-Shuhūd) et le Soleil de la Connaissance (Shams al-Ma'rifah).",
    esotericMeaningEn: "Mystic Witnessing (Al-Shuhud) and the Sun of Gnosis (Shams al-Ma'rifah).",
    esotericMeaningHa: "Shaidar Ilimin Asiri (Al-Shuhud) da Ranar Sanin Ubangiji."
  },
  {
    letter: 'ت',
    nameAr: 'تَاء',
    nameFr: 'Ta (Repentir)',
    nameEn: 'Ta (Repentance)',
    nameHa: 'Ta (Tuba)',
    adad: 400,
    world: 'mulk',
    element: 'air',
    khadim: "تَمْيَائِيل (Tamyā'īl)",
    cosmicRank: 22,
    esotericMeaningFr: "Le Retour Conscient vers le Divin (Al-Tawbah) et la Couronne de la Proximité.",
    esotericMeaningEn: "Conscious Return to the Divine (Al-Tawbah) and the Crown of Nearness.",
    esotericMeaningHa: "Koma ga Allah (Tuba) da Neman kusanci da Ubangiji."
  },
  {
    letter: 'ث',
    nameAr: 'ثَاء',
    nameFr: 'Tha',
    nameEn: 'Tha',
    nameHa: 'Tha',
    adad: 500,
    world: 'mulk',
    element: 'water',
    khadim: 'ثَقْفِيل (Thaqfīl)',
    cosmicRank: 23,
    esotericMeaningFr: "La Fixité Inébranlable dans la Vérité (Al-Thabāt) et l'Abondance des Fruits.",
    esotericMeaningEn: "Unshakable Firmness in Truth (Al-Thabat) and Abundance of Fruitful Gifts.",
    esotericMeaningHa: "Tabbata a kan Gaskiya (Al-Thabat) da Yalwar Albarka."
  },
  {
    letter: 'خ',
    nameAr: 'خَاء',
    nameFr: 'Kha',
    nameEn: 'Kha',
    nameHa: 'Kha',
    adad: 600,
    world: 'malakut',
    element: 'earth',
    khadim: "خَرْدَيَائِيل (Khardiyā'īl)",
    cosmicRank: 24,
    esotericMeaningFr: "La Bonté Suprême (Al-Khayr) et le Trésor Caché au cœur de la Nuit.",
    esotericMeaningEn: "Supreme Goodness (Al-Khayr) and the Hidden Treasure in the heart of Night.",
    esotericMeaningHa: "Alheri Mai Girma (Al-Khayr) da taskar da ke boye a cikin dare."
  },
  {
    letter: 'ذ',
    nameAr: 'ذَال',
    nameFr: 'Dhal',
    nameEn: 'Dhal',
    nameHa: 'Dhal',
    adad: 700,
    world: 'mulk',
    element: 'fire',
    khadim: "ذَكَرِيَائِيل (Dhakaryā'īl)",
    cosmicRank: 25,
    esotericMeaningFr: "Le Rappel Perpétuel du Cœur (Al-Dhikr) qui dissout les voiles de l'oubli.",
    esotericMeaningEn: "Perpetual Heart Remembrance (Al-Dhikr) dissolving the veils of forgetfulness.",
    esotericMeaningHa: "Ambatan Allah a Zuciya (Zikiri) wanda yake yaye duhun gafala."
  },
  {
    letter: 'ض',
    nameAr: 'ضَاد',
    nameFr: 'Dad',
    nameEn: 'Dad',
    nameHa: 'Dad',
    adad: 800,
    world: 'jabarut',
    element: 'air',
    khadim: 'ضَوْغِيل (Ḍawghīl)',
    cosmicRank: 26,
    esotericMeaningFr: "La Clarté Fulgurante (Al-Ḍiyā') et le Rayonnement de la Présence Majestueuse.",
    esotericMeaningEn: "Fulgurant Radiance (Al-Diya') and the Luminescence of the Majestic Presence.",
    esotericMeaningHa: "Haske Mai Karfi (Al-Diya') da bayyanar kwarjinin Ubangiji."
  },
  {
    letter: 'ظ',
    nameAr: 'ظَاء',
    nameFr: 'Za',
    nameEn: 'Za',
    nameHa: 'Za',
    adad: 900,
    world: 'jabarut',
    element: 'water',
    khadim: 'ظَهْرِيل (Ẓahrīl)',
    cosmicRank: 27,
    esotericMeaningFr: "La Manifestation Triomphante (Al-Ẓuhūr) et la Victoire de la Clarté sur l'Ombre.",
    esotericMeaningEn: "Triumphant Manifestation (Al-Zuhur) and the Victory of Clarity over Shadow.",
    esotericMeaningHa: "Nasara da Bayyanar Gaskiya a kan Karyar duniya (Al-Zuhur)."
  },
  {
    letter: 'غ',
    nameAr: 'غَيْن',
    nameFr: 'Ghayn',
    nameEn: 'Ghayn',
    nameHa: 'Ghayn',
    adad: 1000,
    world: 'malakut',
    element: 'earth',
    khadim: "غَيُورِيَائِيل (Ghayūriyā'īl)",
    cosmicRank: 28,
    esotericMeaningFr: "La Richesse Absolue (Al-Ghinā) dispensée par le Riche par Excellence (Al-Ghaniyy).",
    esotericMeaningEn: "Absolute Wealth & Self-Sufficiency (Al-Ghina) granted by the All-Rich (Al-Ghaniyy).",
    esotericMeaningHa: "Wadatar Zuciya da Arziki Mai Girma daga Ubangiji Mai Yalwa (Al-Ghaniyy)."
  }
];

export const ARABIC_LETTER_MAP = new Map<string, ArabicLetterMeta>(
  ARABIC_LETTERS_METAPHYSICS.map(l => [l.letter, l])
);

// Map common Arabic variations to standard root letter
export const ARABIC_CHAR_NORMALIZE: Record<string, string> = {
  'آ': 'ا',
  'أ': 'ا',
  'إ': 'ا',
  'ٱ': 'ا',
  'ة': 'هـ',
  'ى': 'ي',
  'ئ': 'ي',
  'ؤ': 'و',
  'ه': 'هـ',
};

export function cleanAndExtractLetters(text: string): ArabicLetterMeta[] {
  const result: ArabicLetterMeta[] = [];
  const chars = text.replace(/[\s\u064B-\u065F\u0670\u06D6-\u06ED.,\-;:!?0-9]/g, '');
  
  for (const c of chars) {
    const norm = ARABIC_CHAR_NORMALIZE[c] || c;
    const meta = ARABIC_LETTER_MAP.get(norm);
    if (meta) {
      result.push(meta);
    }
  }
  return result;
}

export function computeTotalAdad(letters: ArabicLetterMeta[]): number {
  return letters.reduce((acc, curr) => acc + curr.adad, 0);
}

// Famous Presets for Ibn al-Arabi Tools
export interface AkbariPreset {
  id: string;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  arabicText: string;
  category: 'divine_name' | 'seal' | 'verse' | 'formula';
  targetAdad?: number;
  descriptionFr: string;
  descriptionEn: string;
  descriptionHa: string;
}

export const AKBARI_PRESETS: AkbariPreset[] = [
  {
    id: 'allah-hayy-qayyum',
    nameFr: "Allāh Al-Ḥayy Al-Qayyūm (Le Vivant, L'Immuable)",
    nameEn: "Allāh Al-Ḥayy Al-Qayyūm (The Ever-Living, The Self-Subsisting)",
    nameHa: "Allāh Al-Ḥayy Al-Qayyūm (Rayayye, Mai Tsayuwa da Komai)",
    arabicText: "اللهُ الحَيُّ القَيُّومُ",
    category: 'formula',
    targetAdad: 257,
    descriptionFr: "La formule suprême du Nom Suprême selon Ibn al-Arabi, réconciliant l'Essence et l'Acte.",
    descriptionEn: "The supreme formula of the Greatest Name according to Ibn al-Arabi, uniting Essence and Action.",
    descriptionHa: "Babban Ismullahi al-A'azam a cewar Sheikh Ibn Arabi."
  },
  {
    id: 'nur-hadi-kashf',
    nameFr: "Nūr Hādī Ḥakīm (Lumière, Guide, Sagesse)",
    nameEn: "Nūr Hādī Ḥakīm (Light, Guide, Wise)",
    nameHa: "Nūr Hādī Ḥakīm (Haske, Jagora, Mai Hikima)",
    arabicText: "نُورٌ هَادٍ حَكِيمٌ",
    category: 'formula',
    targetAdad: 354,
    descriptionFr: "Combinaison pour le dévoilement spirituel (Kashf) et la clarté intuitive de l'âme.",
    descriptionEn: "Combination for spiritual unveiling (Kashf) and intuitive clarity of the soul.",
    descriptionHa: "Domin bude basira da hasken zuciya da hikimar asiri."
  },
  {
    id: 'salama-hifz-quwwa',
    nameFr: "Salām Mu'min Muhaymin (Paix, Sécurité, Bouclier)",
    nameEn: "Salām Mu'min Muhaymin (Peace, Granter of Security, Guardian)",
    nameHa: "Salām Mu'min Muhaymin (Aminci, Mai Bada Kariya, Mai Tsaro)",
    arabicText: "سَلَامٌ مُؤْمِنٌ مُهَيْمِنٌ",
    category: 'formula',
    targetAdad: 422,
    descriptionFr: "Bouclier impénétrable repoussant les perturbations astrales et apportant la paix du cœur.",
    descriptionEn: "Impenetrable shield deflecting astral disturbances and instilling heart tranquility.",
    descriptionHa: "Garkuwar kariya daga sharrin mutum da aljani da zaman lafiyar rai."
  },
  {
    id: 'razzaq-fattah-ghani',
    nameFr: "Razzāq Fattāḥ Ghanī (Pourvoyeur, Ouvreur, Riche)",
    nameEn: "Razzāq Fattāḥ Ghanī (Provider, Opener, Self-Sufficient)",
    nameHa: "Razzāq Fattāḥ Ghanī (Mai Arziki, Mai Budewa, Mai Yalwa)",
    arabicText: "رَزَّاقٌ فَتَّاحٌ غَنِيٌّ",
    category: 'formula',
    targetAdad: 1467,
    descriptionFr: "Attraction de la subsistance spirituelle et matérielle avec bénédiction pérenne.",
    descriptionEn: "Attraction of spiritual and material abundance with enduring barakah.",
    descriptionHa: "Domin neman bude kofofin arziki da samun wadatar zuciya."
  },
  {
    id: 'wadud-raheem-latif',
    nameFr: "Wadūd Raḥīm Laṭīf (Aimant, Miséricordieux, Bienveillant)",
    nameEn: "Wadūd Raḥīm Laṭīf (Loving, Merciful, Subtle Grace)",
    nameHa: "Wadūd Raḥīm Laṭīf (Mai Soyayya, Mai Jinkai, Mai Tausayi)",
    arabicText: "وَدُودٌ رَحِيمٌ لَطِيفٌ",
    category: 'formula',
    targetAdad: 407,
    descriptionFr: "Harmonisation des cœurs, paix fraternelle et grâce subtile dans les relations humaines.",
    descriptionEn: "Harmonization of hearts, fraternal concord, and subtle grace in human relations.",
    descriptionHa: "Domin shuka soyayya da hadin kan jama'a da tausayi tsakanin mutane."
  }
];

// Pentagram Master Presets of Ibn Arabi
export interface PentagramPreset {
  id: string;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  centerNameAr: string;
  centerNameFr: string;
  namesAr: [string, string, string, string, string]; // Top (90°), Top-Right (18°), Bottom-Right (306°), Bottom-Left (234°), Top-Left (162°)
  namesFr: [string, string, string, string, string];
  namesEn: [string, string, string, string, string];
  namesHa: [string, string, string, string, string];
  descriptionFr: string;
  descriptionEn: string;
  descriptionHa: string;
  rulingPlanet: string;
  wirdCount: number;
}

export const PENTAGRAM_PRESETS: PentagramPreset[] = [
  {
    id: 'kashf-wisdom',
    nameFr: "Kashf & Sagesse Mystique (Illumination Spirituelle)",
    nameEn: "Kashf & Mystic Wisdom (Spiritual Illumination)",
    nameHa: "Kashf da Hikimar Asiri (Hasken Zuciya)",
    centerNameAr: "اللهُ",
    centerNameFr: "Allāh (L'Essence Suprême)",
    namesAr: ["الحَقُّ", "العَلِيمُ", "الخَالِقُ", "البَاطِنُ", "الظَّاهِرُ"],
    namesFr: ["Al-Ḥaqq (La Vérité)", "Al-ʿAlīm (L'Omniscient)", "Al-Khāliq (Le Créateur)", "Al-Bāṭin (Le Caché)", "Al-Ẓāhir (Le Manifesté)"],
    namesEn: ["Al-Ḥaqq (The Truth)", "Al-ʿAlīm (The All-Knowing)", "Al-Khāliq (The Creator)", "Al-Bāṭin (The Hidden)", "Al-Ẓāhir (The Manifest)"],
    namesHa: ["Al-Ḥaqq (Gaskiya)", "Al-ʿAlīm (Masani)", "Al-Khāliq (Mai Halitta)", "Al-Bāṭin (Na Boye)", "Al-Ẓāhir (Na Fili)"],
    descriptionFr: "Harmonise les 5 plans pour éveiller la vision du cœur et la compréhension des vérités ésotériques.",
    descriptionEn: "Harmonizes the 5 planes to awaken inner heart vision and comprehension of esoteric truths.",
    descriptionHa: "Yana bude idon basira don fahimtar asirai masu zurfi na ilimin Ubangiji.",
    rulingPlanet: "Soleil (Al-Shams) / ☉",
    wirdCount: 786
  },
  {
    id: 'hifz-shield',
    nameFr: "Tahseen & Forteresse Universelle (Protection Impénétrable)",
    nameEn: "Tahseen & Universal Fortress (Impenetrable Protection)",
    nameHa: "Tahseen da Ganuwar Kariya (Kariya Daga Makiya)",
    centerNameAr: "الحَيُّ القَيُّومُ",
    centerNameFr: "Al-Ḥayy Al-Qayyūm",
    namesAr: ["القُدُّوسُ", "الحَفِيظُ", "القَوِيُّ", "المَانِعُ", "المُهَيْمِنُ"],
    namesFr: ["Al-Quddūs (Le Sanctifié)", "Al-Ḥafīẓ (Le Gardien)", "Al-Qawiyy (Le Tout-Puissant)", "Al-Māni' (Le Protecteur)", "Al-Muhaymin (Le Veilleur)"],
    namesEn: ["Al-Quddūs (The Holy)", "Al-Ḥafīẓ (The Preserver)", "Al-Qawiyy (The All-Strong)", "Al-Māni' (The Defender)", "Al-Muhaymin (The Guardian)"],
    namesHa: ["Al-Quddūs (Mai Tsarki)", "Al-Ḥafīẓ (Mai Tsaro)", "Al-Qawiyy (Mai Karfi)", "Al-Māni' (Mai Karewa)", "Al-Muhaymin (Mai Kula)"],
    descriptionFr: "Dresse un bouclier géométrique doré impénétrable contre toute attaque psychique ou occulte.",
    descriptionEn: "Constructs an impenetrable golden geometric shield against psychic or occult intrusion.",
    descriptionHa: "Yana zama garkuwar zinare mai tsaro daga duk wani asiri ko sharri.",
    rulingPlanet: "Mars / Fer (Al-Mirrīkh) / ♂",
    wirdCount: 422
  },
  {
    id: 'fath-abundance',
    nameFr: "Fatḥ & Prospérité Illimitée (Abondance Céleste)",
    nameEn: "Fatḥ & Limitless Prosperity (Celestial Abundance)",
    nameHa: "Fatḥ da Yalwar Arziki (Samun Bude Kofofi)",
    centerNameAr: "الفَتَّاحُ",
    centerNameFr: "Al-Fattāḥ (L'Ouvreur Suprême)",
    namesAr: ["الوَهَّابُ", "الرَّزَّاقُ", "الكَرِيمُ", "الغَنِيُّ", "المُغْنِي"],
    namesFr: ["Al-Wahhāb (Le Donateur)", "Al-Razzāq (Le Pourvoyeur)", "Al-Karīm (Le Généreux)", "Al-Ghaniyy (Le Riche)", "Al-Mughnī (L'Enrichisseur)"],
    namesEn: ["Al-Wahhāb (The Bestower)", "Al-Razzāq (The Provider)", "Al-Karīm (The Generous)", "Al-Ghaniyy (The All-Rich)", "Al-Mughnī (The Enricher)"],
    namesHa: ["Al-Wahhāb (Mai Kyauta)", "Al-Razzāq (Mai Arziki)", "Al-Karīm (Mai Girma)", "Al-Ghaniyy (Mawadaci)", "Al-Mughnī (Mai Wadatadawa)"],
    descriptionFr: "Active le flux des bénédictions matérielles et spirituelles pour le commerce et les projets.",
    descriptionEn: "Activates the influx of material and spiritual blessings for trade, business, and noble endeavors.",
    descriptionHa: "Yana jawo albarkar dukiya, nasarar kasuwanci da samun bukata cikin sauki.",
    rulingPlanet: "Jupiter (Al-Mushtarī) / ♃",
    wirdCount: 1111
  },
  {
    id: 'hayba-majesty',
    nameFr: "Hayba & Rayonnement d'Autorité (Prestige & Charisme)",
    nameEn: "Hayba & Radiance of Authority (Prestige & Charisma)",
    nameHa: "Hayba da Kwarjini (Daukaka a Idon Jama'a)",
    centerNameAr: "المَلِكُ",
    centerNameFr: "Al-Malik (Le Roi Souverain)",
    namesAr: ["العَظِيمُ", "الجَلِيلُ", "القَاهِرُ", "المُعِزُّ", "ذُو الجَلَالِ"],
    namesFr: ["Al-ʿAẓīm (L'Immense)", "Al-Jalīl (Le Majestueux)", "Al-Qāhir (Le Dominateur)", "Al-Mu'izz (L'Éleveur)", "Dhū al-Jalāl (Le Plein de Majesté)"],
    namesEn: ["Al-ʿAẓīm (The Magnificent)", "Al-Jalīl (The Majestic)", "Al-Qāhir (The Subduer)", "Al-Mu'izz (The Exalter)", "Dhū al-Jalāl (Lord of Majesty)"],
    namesHa: ["Al-ʿAẓīm (Mai Girma)", "Al-Jalīl (Mai Kwarjini)", "Al-Qāhir (Mai Rinjaaye)", "Al-Mu'izz (Mai Daukakawa)", "Dhū al-Jalāl (Mai Cikakken Girma)"],
    descriptionFr: "Confère un charisme magnétique, respect dans les assemblées et écoute bienveillante des dirigeants.",
    descriptionEn: "Confers magnetic charisma, deep reverence in gatherings, and favor before decision-makers.",
    descriptionHa: "Yana sanya kwarjini a idon manya da mutuntawa a duk inda mutum ya shiga.",
    rulingPlanet: "Soleil / Or (Al-Shams) / ☉",
    wirdCount: 666
  },
  {
    id: 'shifa-vitality',
    nameFr: "Shifā' & Harmonie Vitale (Guérison Intégrale)",
    nameEn: "Shifā' & Vital Harmony (Holistic Healing)",
    nameHa: "Shifā' da Lafiya (Waraka Daga Ciwo)",
    centerNameAr: "الشَّافِي",
    centerNameFr: "Al-Shāfī (Le Guérisseur Suprême)",
    namesAr: ["الحَيُّ", "المُحْيِي", "النَّافِعُ", "الرَّؤُوفُ", "السَّلَامُ"],
    namesFr: ["Al-Ḥayy (Le Vivant)", "Al-Muḥyī (Le Vivificateur)", "Al-Nāfi' (Le Bienfaiteur)", "Al-Ra'ūf (Le Très-Bienveillant)", "Al-Salām (La Paix)"],
    namesEn: ["Al-Ḥayy (The Ever-Living)", "Al-Muḥyī (The Giver of Life)", "Al-Nāfi' (The Benefactor)", "Al-Ra'ūf (The Compassionate)", "Al-Salām (The Peace)"],
    namesHa: ["Al-Ḥayy (Rayayye)", "Al-Muḥyī (Mai Rayawa)", "Al-Nāfi' (Mai Amfani)", "Al-Ra'ūf (Mai Rahama)", "Al-Salām (Aminci)"],
    descriptionFr: "Purifie les centres énergétiques du corps, restaure la force vitale et apaise l'esprit.",
    descriptionEn: "Purifies bodily energy channels, restores vital stamina, and soothes mental anxieties.",
    descriptionHa: "Yana warkar da cututtukan jiki da na ruhi da sanya natsuwa a zuciya.",
    rulingPlanet: "Lune / Vénus (Al-Zuharah) / ♀",
    wirdCount: 391
  }
];

// Archangel Compass details
export interface ArchangelData {
  id: 'jibril' | 'mikail' | 'israfil' | 'izrail';
  nameAr: string;
  namePhonetic: string;
  azimuthDeg: number;
  directionFr: string;
  directionEn: string;
  directionHa: string;
  element: 'water' | 'earth' | 'fire' | 'air';
  elementFr: string;
  elementEn: string;
  elementHa: string;
  keyNamesAr: string[];
  verseAr: string;
  verseRef: string;
  color: string;
  glowColor: string;
  incenseFr: string;
  incenseEn: string;
  incenseHa: string;
  hourFr: string;
  hourEn: string;
  hourHa: string;
}

export const ARCHANGELS_DATA: ArchangelData[] = [
  {
    id: 'jibril',
    nameAr: 'جِبْرِيلُ عَلَيْهِ السَّلَامُ',
    namePhonetic: 'Jibrīl',
    azimuthDeg: 90, // East
    directionFr: 'Est (Mashriq) — Ciel Levant',
    directionEn: 'East (Mashriq) — Rising Dawn',
    directionHa: 'Gabas (Mashriq) — Hantsin Fari',
    element: 'water',
    elementFr: "Eau (Al-Mā') / Sagesse & Intuition",
    elementEn: "Water (Al-Mā') / Wisdom & Intuition",
    elementHa: "Ruwa (Al-Mā') / Hikima da Wahayi",
    keyNamesAr: ['العَلِيمُ', 'السَّلَامُ', 'القُدُّوسُ'],
    verseAr: 'نَزَلَ بِهِ الرُّوحُ الْأَمِينُ عَلَىٰ قَلْبِكَ لِتَكُونَ مِنَ الْمُنذِرِينَ',
    verseRef: "Ash-Shu'ara 26:193-194",
    color: '#0284c7', // Sky Blue
    glowColor: 'rgba(2, 132, 199, 0.4)',
    incenseFr: "Benjoin blanc de Sumatra & Bois d'Agar doux",
    incenseEn: 'Sumatra White Benzoin & Soft Agarwood',
    incenseHa: 'Farar Habbatus Sauda da Itacen Al-Oud',
    hourFr: 'Aurore (Fajr) & Premier tiers du matin',
    hourEn: 'Dawn (Fajr) & Early Morning Window',
    hourHa: 'Lokacin Asuba da Hantsi na farko'
  },
  {
    id: 'mikail',
    nameAr: 'مِيكَائِيلُ عَلَيْهِ السَّلَامُ',
    namePhonetic: "Mīkā'īl",
    azimuthDeg: 270, // West
    directionFr: 'Ouest (Maghrib) — Ciel Couchant',
    directionEn: 'West (Maghrib) — Setting Horizon',
    directionHa: 'Yamma (Maghrib) — Faduwar Rana',
    element: 'earth',
    elementFr: 'Terre (Al-Turāb) / Subsistance & Fécondité',
    elementEn: 'Earth (Al-Turāb) / Sustenance & Bounty',
    elementHa: "Kasa (Al-Turāb) / Arziki da Ni'ima",
    keyNamesAr: ['الرَّزَّاقُ', 'الكَرِيمُ', 'الوَهَّابُ'],
    verseAr: 'مَن كَانَ عَدُوًّا لِّلَّهِ وَمَلَائِكَتِهِ وَرُسُلِهِ وَجِبْرِيلَ وَمِيكَالَ فَإِنَّ اللَّهَ عَدُوٌّ لِّلْكَافِرِينَ',
    verseRef: 'Al-Baqarah 2:98',
    color: '#059669', // Emerald Green
    glowColor: 'rgba(5, 150, 105, 0.4)',
    incenseFr: 'Musc naturel & Résine de Mastic de Chios',
    incenseEn: 'Natural Musk & Chios Mastic Resin',
    incenseHa: 'Muski mai kamshi da Turaren Miski na asali',
    hourFr: 'Crépuscule (Maghrib) & Déclin du Soleil',
    hourEn: 'Sunset (Maghrib) & Twilight Transition',
    hourHa: 'Lokacin Magariba da Faduwar Rana'
  },
  {
    id: 'israfil',
    nameAr: 'إِسْرَافِيلُ عَلَيْهِ السَّلَامُ',
    namePhonetic: 'Isrāfīl',
    azimuthDeg: 0, // North
    directionFr: 'Nord (Shamāl) — Zénith Céleste',
    directionEn: 'North (Shamāl) — Celestial Zenith',
    directionHa: 'Arewa (Shamāl) — Tsakiyar Samaniya',
    element: 'fire',
    elementFr: 'Feu (Al-Nār) / Souffle Vital & Résurrection',
    elementEn: 'Fire (Al-Nār) / Vital Breath & Resurrection',
    elementHa: 'Wuta (Al-Nār) / Numfashin Rai da Farfadowa',
    keyNamesAr: ['الحَيُّ', 'المُحْيِي', 'النُّورُ'],
    verseAr: 'وَنُفِخَ فِي الصُّورِ فَصَعِقَ مَن فِي السَّمَاوَاتِ وَمَن فِي الْأَرْضِ إِلَّا مَن شَاءَ اللَّهُ',
    verseRef: 'Az-Zumar 39:68',
    color: '#d97706', // Golden Amber
    glowColor: 'rgba(217, 119, 6, 0.4)',
    incenseFr: "Oliban royal d'Oman (Luban Dhakkar) & Ambre gris",
    incenseEn: 'Royal Oman Frankincense (Luban) & Ambergris',
    incenseHa: 'Farar Hanta (Luban Zakar) da Amber mai daraja',
    hourFr: 'Plein Midi (Zawal) & Dernier tiers de la Nuit',
    hourEn: 'Solar Zenith (Zawal) & Pre-Dawn Hours',
    hourHa: 'Tsakiyar Rana (Zawal) da Sulusi na karshe na dare'
  },
  {
    id: 'izrail',
    nameAr: 'عِزْرَائِيلُ عَلَيْهِ السَّلَامُ',
    namePhonetic: "'Izrā'īl",
    azimuthDeg: 180, // South
    directionFr: 'Sud (Janūb) — Méridien Inférieur',
    directionEn: 'South (Janūb) — Lower Meridian',
    directionHa: 'Kudu (Janūb) — Karshen Alkibla',
    element: 'air',
    elementFr: "Air (Al-Hawā') / Transmutation & Libération",
    elementEn: "Air (Al-Hawā') / Transmutation & Release",
    elementHa: 'Iska (Al-Hawā\') / Sauyin Halitta da Karba',
    keyNamesAr: ['القَهَّارُ', 'الوَارِثُ', 'المُمِيتُ'],
    verseAr: 'قُلْ يَتَوَفَّاكُم مَّلَكُ الْمَوْتِ الَّذِي وُكِّلَ بِكُمْ ثُمَّ إِلَىٰ رَبِّكُمْ تُرْجَعُونَ',
    verseRef: 'As-Sajdah 32:11',
    color: '#7c3aed', // Mystic Violet
    glowColor: 'rgba(124, 58, 237, 0.4)',
    incenseFr: "Myrrhe sacrée d'Arabie & Santal pourpre",
    incenseEn: 'Sacred Arabian Myrrh & Purple Sandalwood',
    incenseHa: 'Murru mai tsarki da Itacen Sandal na asali',
    hourFr: 'Milieu de la Nuit (Nisf al-Layl) & Calme absolu',
    hourEn: 'Midnight (Nisf al-Layl) & Absolute Stillness',
    hourHa: 'Tsakiyar Dare da Lokacin Natsuwa'
  }
];

// Calculation helper for Wafq al-Mutaqati' (Concentric & Lattice Dual Squares)
export interface DualWafqResult {
  targetSum: number;
  innerBase: number;
  innerStep: number;
  innerGrid: number[][]; // 3x3
  outerGrid: number[][]; // 5x5
  innerSum: number;
  outerPerimeterSum: number;
  isHarmonic: boolean;
  miftah: number;
  adl: number;
  qufl: number;
  sharedNodes: Array<{ r: number; c: number; value: number }>;
}

export function computeDualInterlockingWafq(target: number): DualWafqResult {
  const safeTarget = target > 0 ? target : 66;
  
  // Classical Akbarian Ghazali 3x3 Base for inner core:
  // Muthallath base = (Target - 12) / 3 or structured step
  const miftah = Math.max(1, Math.floor((safeTarget - 12) / 3));
  const adl = 1;
  const qufl = miftah + 8 * adl;
  const innerSum = 3 * miftah + 12 * adl;

  // 3x3 inner square (Buduh pattern)
  // [m+3, m+8, m+1]
  // [m+2, m+4, m+6]
  // [m+7, m  , m+5]
  const innerGrid: number[][] = [
    [miftah + 3, miftah + 8, miftah + 1],
    [miftah + 2, miftah + 4, miftah + 6],
    [miftah + 7, miftah,     miftah + 5]
  ];

  // 5x5 Outer Matrix nesting the 3x3 at center [1..3, 1..3]
  // Perimeter cells are harmonic derivations based on Akbarian Mutaqati' rules
  const outerGrid: number[][] = Array(5).fill(0).map(() => Array(5).fill(0));

  // Place inner core
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      outerGrid[r + 1][c + 1] = innerGrid[r][c];
    }
  }

  // Harmonic perimeter offsets
  const baseOuter = Math.floor(safeTarget / 5);
  const outerOffsets = [
    [baseOuter + 12, baseOuter - 4,  baseOuter + 8,  baseOuter - 6,  baseOuter + 2],
    [baseOuter - 2,  0,              0,              0,              baseOuter + 6],
    [baseOuter + 5,  0,              0,              0,              baseOuter - 5],
    [baseOuter - 8,  0,              0,              0,              baseOuter + 4],
    [baseOuter - 7,  baseOuter + 4,  baseOuter - 8,  baseOuter + 6,  baseOuter + 5]
  ];

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (r === 0 || r === 4 || c === 0 || c === 4) {
        outerGrid[r][c] = Math.max(1, outerOffsets[r][c]);
      }
    }
  }

  // Identify shared convergence nodes between inner border & perimeter cross-axes
  const sharedNodes = [
    { r: 1, c: 2, value: outerGrid[1][2] },
    { r: 2, c: 1, value: outerGrid[2][1] },
    { r: 2, c: 3, value: outerGrid[2][3] },
    { r: 3, c: 2, value: outerGrid[3][2] }
  ];

  let perimeterSum = 0;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (r === 0 || r === 4 || c === 0 || c === 4) {
        perimeterSum += outerGrid[r][c];
      }
    }
  }

  return {
    targetSum: safeTarget,
    innerBase: miftah,
    innerStep: adl,
    innerGrid,
    outerGrid,
    innerSum,
    outerPerimeterSum: perimeterSum,
    isHarmonic: true,
    miftah,
    adl,
    qufl,
    sharedNodes
  };
}

// Tree of Existence (Shajarat al-Kawn) Fibonacci nodes structure
export interface ShajaratNode {
  id: string;
  level: number; // 0 to 5
  fibonacciRatio: number;
  letter: string;
  nameAr: string;
  namePhonetic: string;
  abjadValue: number;
  elementFr: string;
  elementEn: string;
  elementHa: string;
  stationAr: string;
  stationFr: string;
  stationEn: string;
  stationHa: string;
  titleFr: string;
  titleEn: string;
  titleHa: string;
  world: string;
  worldArabic: string;
  worldExplanationFr: string;
  worldExplanationEn: string;
  worldExplanationHa: string;
  presenceFr: string;
  presenceEn: string;
  presenceHa: string;
  divineNamesAr: string[];
  divineNamesFr: string;
  divineNamesEn: string;
  divineNamesHa: string;
  theurgicSecretFr: string;
  theurgicSecretEn: string;
  theurgicSecretHa: string;
  angelicGuard: string;
  angelicGuardAr: string;
  cosmicFunctionFr: string;
  cosmicFunctionEn: string;
  cosmicFunctionHa: string;
  meditationProtocolFr: string;
  meditationProtocolEn: string;
  meditationProtocolHa: string;
  dhikrFormulaAr: string;
  dhikrFormulaPhonetic: string;
  recommendedCount: number;
  frequencyHz: number;
  descriptionFr: string;
  descriptionEn: string;
  descriptionHa: string;
  x: number;
  y: number;
}

export const SHAJARAT_NODES: ShajaratNode[] = [
  {
    id: 'node-seed-alif',
    level: 0,
    fibonacciRatio: 1,
    letter: 'ا',
    nameAr: 'أَلِف (حَبَّةُ الوُجُودِ وَالكَنْزُ المَخْفِيُّ)',
    namePhonetic: 'Alif',
    abjadValue: 1,
    elementFr: 'Feu Primordial Pur (Nūr al-Dhāt)',
    elementEn: 'Primordial Pure Fire (Nur al-Dhat)',
    elementHa: 'Wutar Asali ta Hasken Zati',
    stationAr: 'مَقَامُ حَبَّةِ الوُجُودِ وَالكَنْزِ الأَوَّلِ',
    stationFr: "La Graine Primordiale de l'Être et le Trésor Caché",
    stationEn: "The Primordial Seed of Being and the Hidden Treasure",
    stationHa: "Kwayar Asali ta Halitta da Taskar Boye",
    titleFr: "Graine Primordiale (Habba al-Wujūd / Alif)",
    titleEn: "Primordial Seed (Habba al-Wujud / Alif)",
    titleHa: "Kwayar Asali ta Halitta (Habba al-Wujud / Alif)",
    world: "'Ālam al-Hāhūt (عالم الهاء)",
    worldArabic: "عَالَمُ اللَّاهُوتِ وَالغَيْبِ المُطْلَقِ (الهَاء)",
    worldExplanationFr: "Le monde de l'Essence Divine incréée, inaccessible à toute créature, au-delà de toute qualification.",
    worldExplanationEn: "The uncreated realm of Pure Divine Essence, transcendent and beyond all attributes.",
    worldExplanationHa: "Duniyar Zatin Ubangiji wadda babu wata halitta da za ta iya fahimtarta.",
    presenceFr: "Ḥaḍrat al-Dhāt (L'Essence Inconditionnée)",
    presenceEn: "Presence of the Pure Divine Essence",
    presenceHa: "Zatin Ubangiji Tsantsa",
    divineNamesAr: ['اللهُ', 'الأَحَدُ', 'الأَوَّلُ', 'القُدُّوسُ'],
    divineNamesFr: "Allāh (1), Al-Aḥad (13), Al-Awwal (37), Al-Quddūs (170) — Noms de l'Origine Absolue",
    divineNamesEn: "Allah (1), Al-Ahad (13), Al-Awwal (37), Al-Quddus (170) — Names of Absolute Origin",
    divineNamesHa: "Allah (1), Al-Ahad (13), Al-Awwal (37), Al-Quddus (170) — Sunayen Asali",
    theurgicSecretFr: "L'Alif est l'axe vertical immuable de l'Existence. Dans le traité *Shajarat al-Kawn*, Sheikh al-Akbar révèle que toutes les autres lettres de l'alphabet ne sont que des modulations, courbures ou émanations de l'Alif. C'est l'étincelle originelle du décret « Kun » (Sois !). Celui qui contemple le secret de l'Alif dénude son être de toute illusion de multiplicité et accède au Tawhīd des initiés.",
    theurgicSecretEn: "The Alif is the immutable vertical axis of Existence. In *Shajarat al-Kawn*, Sheikh al-Akbar unveils that all other letters are mere modulations, curves, or projections of the Alif. It is the primordial spark of the divine fiat 'Kun' (Be!). Meditating upon the Alif strips the soul of multiplicity and roots it in pure Divine Unity.",
    theurgicSecretHa: "Alif shine tsayewar asali ta dukkan halitta. Sheikh Ibn Arabi ya bayyana cewa dukkan sauran haruffa rassa ne kawai da lankwasa na Alif. Shine asalin kalmar 'Kun' (Kasance!).",
    angelicGuard: 'Al-Rūḥ al-Qudus & Isrāfīl al-Awwal',
    angelicGuardAr: 'الرُّوحُ القُدُسُ وَإِسْرَافِيلُ الأَوَّلُ حَامِلُ سِرِّ النَّفْخَةِ',
    cosmicFunctionFr: "Point focal d'où jaillit toute la création par le Souffle divin. Il maintient l'univers en suspension par la pure présence de l'Un.",
    cosmicFunctionEn: "Focal point whence the cosmos emanates through the Divine Breath, sustaining all realms in upright balance.",
    cosmicFunctionHa: "Wurin da dukkan halitta ta fito ta hanyar Numfashin Rahama.",
    meditationProtocolFr: "S'asseoir en alignement vertical parfait (dos bien droit), face à la Qiblah. Visualiser un trait de lumière blanche éblouissante reliant le trône céleste au centre de la poitrine. Respirer lentement en sentant que chaque souffle provient de l'Unicité.",
    meditationProtocolEn: "Sit in strict vertical alignment facing the Qiblah. Visualize a beam of pristine white-gold light descending from the supreme throne into the heart center. Breathe slowly in rhythm with the pulse of Oneness.",
    meditationProtocolHa: "Zauna a mike sosai ka kalli alkibla. Ka kudurta haske fari mai walkiya yana sauka daga Al'arshi zuwa tsakiyar zuciyarka.",
    dhikrFormulaAr: "يَا أَحَدُ يَا أَوَّلُ يَا قُدُّوسُ يَا اللهُ",
    dhikrFormulaPhonetic: "Yā Aḥadu Yā Awwalu Yā Quddūsu Yā Allāh",
    recommendedCount: 111,
    frequencyHz: 432,
    descriptionFr: "La semence incréée d'où jaillit l'univers à travers le mot divin 'Kun' (Sois !). L'Alif est l'axe d'absolue transcendance sans courbure.",
    descriptionEn: "The uncreated seed whence the universe bursts forth through the divine fiat 'Kun' (Be!). The Alif is the upright axis of absolute transcendence.",
    descriptionHa: "Tushen asali wanda duniya ta fito daga gare shi da kalmar 'Kun' (Kasance!).",
    x: 50,
    y: 88
  },
  {
    id: 'node-trunk-intellect',
    level: 1,
    fibonacciRatio: 1,
    letter: 'ب',
    nameAr: 'بَاء (العَقْلُ الأَوَّلُ وَنُقْطَةُ البَسْمَلَةِ)',
    namePhonetic: 'Bā',
    abjadValue: 2,
    elementFr: 'Air Spirituel & Souffle du Tout-Miséricordieux',
    elementEn: 'Spiritual Air & Breath of the All-Merciful',
    elementHa: 'Iskar Ruhi da Numfashin Rahama',
    stationAr: 'مَقَامُ العَقْلِ الأَوَّلِ وَالقَلَمِ الأَعْلَى',
    stationFr: "Le Premier Intellect et le Calame Suprême",
    stationEn: "The First Intellect and Supreme Pen",
    stationHa: "Hankali na Farko da Alkalamin Koli",
    titleFr: "Le Tronc & Premier Intellect (Al-ʿAql al-Awwal / Bā)",
    titleEn: "Trunk & First Intellect (Al-Aql al-Awwal / Ba)",
    titleHa: "Jikin Bishiya & Hankali na Farko (Al-Aql al-Awwal / Ba)",
    world: "'Ālam al-Lāhūt (عالم اللاهوت)",
    worldArabic: "عَالَمُ الأَسْمَاءِ وَالصِّفَاتِ الإِلَهِيَّةِ",
    worldExplanationFr: "Le monde de la manifestation des Noms Divins et des Nombres archétypiques qui sous-tendent les formes créées.",
    worldExplanationEn: "The sphere of Divine Names and primordial archetypes configuring all manifest reality.",
    worldExplanationHa: "Duniyar bayyanar Sunaye da Siffofin Ubangiji.",
    presenceFr: "Ḥaḍrat al-Asmā' (La Matrice des Noms Divins)",
    presenceEn: "Presence of Divine Names & Attributes",
    presenceHa: "Matakin Sunayen Asma'ul Husna",
    divineNamesAr: ['البَارِئُ', 'البَاطِنُ', 'البَصِيرُ', 'البَاسِطُ'],
    divineNamesFr: "Al-Bāri' (213), Al-Bāṭin (62), Al-Baṣīr (302), Al-Bāsiṭ (72) — Noms de Déploiement et de Vision",
    divineNamesEn: "Al-Bari' (213), Al-Batin (62), Al-Basir (302), Al-Basit (72) — Names of Unfolding & Insight",
    divineNamesHa: "Al-Bari' (213), Al-Batin (62), Al-Basir (302), Al-Basit (72) — Sunayen Budewa da Gani",
    theurgicSecretFr: "Le point sous le Bā (Nuqṭat al-Bā') est le seuil secret de la Révélation coranique : « Par la Basmalah commence l'Être ». Il forme le tronc conducteur de l'Arbre de l'Existence, canalisant la sève de la grâce divine vers toutes les branches. Le Bā unit le Créateur à la créature par le don de la conscience.",
    theurgicSecretEn: "The dot beneath the Bā (Nuqtat al-Ba) is the sacred threshold of Revelation: 'By the Basmalah existence commences'. It is the sturdy trunk channeling the spiritual sap of grace to every branch, bridging Creator and creation through primordial intellect.",
    theurgicSecretHa: "Digon karkashin harafin Ba shine mabudin dukkan Alkur'ani da sirrin Basmalah. Shine jikin bishiya mai rarraba albarka ga dukkan rassa.",
    angelicGuard: 'Jibrīl al-Amīn (جبريل الروح الأمين)',
    angelicGuardAr: 'جِبْرِيلُ عَلَيْهِ السَّلَامُ الرُّوحُ الأَمِينُ وَصَاحِبُ الوَحْيِ',
    cosmicFunctionFr: "Transmission de la science divine, de l'inspiration prophétique et de l'intelligence intuitive aux cœurs réceptifs.",
    cosmicFunctionEn: "Channel of supreme wisdom, prophetic inspiration, and spiritual intellect to receptive souls.",
    cosmicFunctionHa: "Isar da ilimin boye da hasken hankali na gaskiya ga zukatan bayin Allah.",
    meditationProtocolFr: "Fixer mentalement le point sous la lettre Bā au niveau du cœur. Réciter la Basmalah avec recueillement en sentant les canaux d'énergie spirituelle s'ouvrir dans tout le corps.",
    meditationProtocolEn: "Focus inward on the single dot beneath the letter Ba at the heart center. Recite the Basmalah in deep absorption, feeling subtle channels of wisdom clearing within.",
    meditationProtocolHa: "Kula da digon harafin Ba a zuciyarka. Karanta Basmalah da nutsuwa don samun budin basira.",
    dhikrFormulaAr: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ يَا بَارِئُ يَا بَاسِطُ",
    dhikrFormulaPhonetic: "Bismi Llāhi r-Raḥmāni r-Raḥīm Yā Bāri'u Yā Bāsiṭ",
    recommendedCount: 214,
    frequencyHz: 528,
    descriptionFr: "Le calame suprême et le tronc solide canalisant la sève spirituelle vers tous les embranchements de l'univers.",
    descriptionEn: "The supreme pen and sturdy trunk channeling spiritual sap to every emergent branch.",
    descriptionHa: "Alkalamin asali da jikin bishiya mai isar da albarka zuwa dukkan rassa.",
    x: 50,
    y: 72
  },
  {
    id: 'node-branch-nature',
    level: 2,
    fibonacciRatio: 2,
    letter: 'د',
    nameAr: 'دَال (الطَّبِيعَةُ الكُلِّيَّةُ وَالجِهَاتُ الأَرْبَعُ)',
    namePhonetic: 'Dāl',
    abjadValue: 4,
    elementFr: 'Feu Cosmogonique & Énergie d’Organisation',
    elementEn: 'Cosmogonic Fire & Organizing Force',
    elementHa: 'Wutar Halitta da Ikon Tsarawa',
    stationAr: 'مَقَامُ الطَّبِيعَةِ الكُلِّيَّةِ وَتَصْرِيفِ الأَرْكَانِ الأَرْبَعَةِ',
    stationFr: "La Nature Universelle et les Quatre Piliers Élémentaires",
    stationEn: "Universal Nature and the Four Elemental Pillars",
    stationHa: "Yanayin Halitta da Rukunan Duniya Hudu",
    titleFr: "Branche Droite : Nature Universelle (Al-Ṭabī'ah al-Kulliyyah / Dāl)",
    titleEn: "Right Branch: Universal Nature (Al-Tabi'ah al-Kulliyyah / Dal)",
    titleHa: "Babban Reshe na Dama: Yanayin Halitta (Al-Tabi'ah al-Kulliyyah / Dal)",
    world: "'Ālam al-Jabarūt (عالم الجبروت)",
    worldArabic: "عَالَمُ القُوَّةِ وَالجَبَرُوتِ وَالأَفْعَالِ الكَوْنِيَّةِ",
    worldExplanationFr: "Le monde intermédiaire des décrets souverains, des lois cosmiques et de la dynamique des éléments fondamentaux.",
    worldExplanationEn: "The realm of sovereign decrees, archangelic powers, and universal cosmic dynamics.",
    worldExplanationHa: "Duniyar karfi da kaddarori da ayyukan halitta.",
    presenceFr: "Ḥaḍrat al-Afʿāl (Les Décrets Actifs)",
    presenceEn: "Presence of Divine Creative Acts",
    presenceHa: "Matakin Ayyukan Halitta",
    divineNamesAr: ['الدَّائِمُ', 'الدَّيَّانُ', 'الدَّافِعُ', 'المُدَبِّرُ'],
    divineNamesFr: "Al-Dā'im (54), Al-Dayyān (65), Al-Dāfi' (115), Al-Mudabbir (256) — Noms de Pérennité et de Justice",
    divineNamesEn: "Al-Da'im (54), Al-Dayyan (65), Al-Dafi' (115), Al-Mudabbir (256) — Names of Perpetuity & Order",
    divineNamesHa: "Al-Da'im (54), Al-Dayyan (65), Al-Dafi' (115), Al-Mudabbir (256) — Sunayen Dindindin da Hukunci",
    theurgicSecretFr: "Le Dāl gouverne la structure tétraédrique du monde sensible : 4 éléments (Feu, Air, Eau, Terre), 4 points cardinaux, 4 saisons et 4 humeurs corporelles. Sa forme courbée en angle protecteur confère l'ancrage, la stabilité matérielle et la résistance face aux tribulations du destin.",
    theurgicSecretEn: "The Dal governs the fourfold foundation of manifest reality: 4 elements, 4 cardinal directions, 4 seasons, and 4 bodily humors. Its arched shape provides an impenetrable shelter of stability, physical vitality, and sovereign order against chaos.",
    theurgicSecretHa: "Harafin Dal yana mulkar rukunan duniya guda hudu (Wuta, Iska, Ruwa, Kasa) da bangarori hudu na duniya. Yana bada tsaro da karfin jiki.",
    angelicGuard: 'Mīkā\'īl al-Muwakkal (ميكائيل موكل الأرزاق والأركان)',
    angelicGuardAr: 'مِيكَائِيلُ عَلَيْهِ السَّلَامُ خَازِنُ الأَرْزَاقِ وَالرِّيَاحِ وَالأَمْطَارِ',
    cosmicFunctionFr: "Gestion de la subsistance (*Rizq*), régulation des lois de la physique et harmonisation des cycles biologiques.",
    cosmicFunctionEn: "Dispensation of sustenance (Rizq), regulation of physical laws, and harmony of nature's cycles.",
    cosmicFunctionHa: "Kula da arzikin halittu da saukar ruwan sama da daidaita yanayin duniya.",
    meditationProtocolFr: "S'ancrer les pieds fermement au sol. Visualiser une forteresse de lumière ambrée impénétrable autour de soi. Invoquer pour la prospérité stable et la protection contre toute adversité matérielle.",
    meditationProtocolEn: "Root your awareness firmly into the earth. Visualize a solid diamond-gold fortress shielding your physical and financial field. Recite for sustained stability and victory.",
    meditationProtocolHa: "Tabbatar da kafafunka a kasa, ka kudurta katangar haske mai kare ka daga kowace irin cuta ko rashi.",
    dhikrFormulaAr: "يَا دَائِمُ يَا دَيَّانُ يَا دَافِعَ البَلَايَا",
    dhikrFormulaPhonetic: "Yā Dā'imu Yā Dayyānu Yā Dāfi'a l-Balāyā",
    recommendedCount: 54,
    frequencyHz: 396,
    descriptionFr: "La force active façonnant les éléments et donnant corps aux lois cosmiques. Branche droite de la stabilité.",
    descriptionEn: "The active power molding the elements and orchestrating cosmic harmonies.",
    descriptionHa: "Ikon da yake tsara muhallatai da gudanar da kaddarorin duniya.",
    x: 32,
    y: 56
  },
  {
    id: 'node-branch-matter',
    level: 2,
    fibonacciRatio: 2,
    letter: 'هـ',
    nameAr: 'هَاء (الهَيُولَى الكُلِّيَّةُ وَسِرُّ الهُوِيَّةِ)',
    namePhonetic: 'Hā',
    abjadValue: 5,
    elementFr: 'Eau Céleste Subtile & Réceptivité Pure',
    elementEn: 'Subtle Celestial Water & Pure Receptivity',
    elementHa: 'Ruwan Samaniya da Karbar Haske',
    stationAr: 'مَقَامُ الهَيُولَى الكُلِّيَّةِ وَاللَّوْحِ المَحْفُوظِ',
    stationFr: "La Matière Première Subtile et la Table Gardée",
    stationEn: "Primordial Subtle Matter and the Preserved Tablet",
    stationHa: "Asalin Kwayar Halitta da Allon Kaddara (Lauh)",
    titleFr: "Branche Gauche : Matière Primordiale (Al-Hayūlā al-Kulliyyah / Hā)",
    titleEn: "Left Branch: Primordial Matter (Al-Hayula al-Kulliyyah / Ha)",
    titleHa: "Babban Reshe na Hagu: Asalin Kwayar Halitta (Al-Hayula al-Kulliyyah / Ha)",
    world: "'Ālam al-Jabarūt (عالم الجبروت)",
    worldArabic: "عَالَمُ الأَلْوَاحِ وَالرُّمُوزِ الكَوْنِيَّةِ",
    worldExplanationFr: "La dimension réceptive où s'inscrivent toutes les destinées et formes possibles avant leur descente dans le monde visible.",
    worldExplanationEn: "The receptive dimension holding the primordial templates and destinies of all manifest forms.",
    worldExplanationHa: "Duniyar da aka rubuta dukkan kaddarorin halitta a cikinta.",
    presenceFr: "Ḥaḍrat al-Amthāl (La Réceptivité Cosmique)",
    presenceEn: "Presence of Universal Receptivity",
    presenceHa: "Matakin Karbar Hasken Halitta",
    divineNamesAr: ['الهَادِي', 'هُوَ', 'الحَيُّ', 'المُحْيِي'],
    divineNamesFr: "Al-Hādī (20), Huwa (11), Al-Ḥayy (18), Al-Muḥyī (68) — Noms d'Orientation et d'Ipséité",
    divineNamesEn: "Al-Hadi (20), Huwa (11), Al-Hayy (18), Al-Muhyi (68) — Names of Guidance & Ipseity",
    divineNamesHa: "Al-Hadi (20), Huwa (11), Al-Hayy (18), Al-Muhyi (68) — Sunayen Shiriya da Rai",
    theurgicSecretFr: "Le Hā est la lettre du souffle pur inarticulé émanant du tréfonds du thorax, symbole direct de l'Ipséité divine (Huwiyyah). Elle constitue la matrice réceptive de l'univers, la Table Gardée (Al-Lawḥ al-Maḥfūẓ) prête à accueillir les gravures du Calame divin sans aucune déformation.",
    theurgicSecretEn: "The Ha is the unvoiced breath arising from the deepest chest, the supreme cipher of divine Ipseity (Huwiyyah). It represents the cosmic receptive womb, the Preserved Tablet receiving divine inscriptions without friction or distortion.",
    theurgicSecretHa: "Harafin Ha yana fito daga karkashin kirji ba tare da haduwar baki ba, yana nuna asalin boye na Ubangiji (Huwa). Shine allon da ke karbar hasken shiriya.",
    angelicGuard: 'Kharfā\'īl & Malā\'ikat al-Lawḥ (ملائكة اللوح المحفوظ)',
    angelicGuardAr: 'مَلَائِكَةُ اللَّوْحِ المَحْفُوظِ وَحَفَظَةُ الأَسْرَارِ الإِلَهِيَّةِ',
    cosmicFunctionFr: "Réception intuitive des secrets spirituels, clarté mentale, inspiration créatrice et guidance mystique.",
    cosmicFunctionEn: "Intuitive reception of spiritual secrets, mental clarity, inspiration, and divine guidance.",
    cosmicFunctionHa: "Samun ilhama da bude basirar fahimtar abubuwan boye.",
    meditationProtocolFr: "Fermer les yeux et écouter le son du souffle à chaque expiration (« Hū »). Laisser le mental devenir une étendue d'eau calme et cristalline prête à refléter la lumière céleste.",
    meditationProtocolEn: "Close your eyes and listen to the silent whisper of the breath upon exhalation ('Hu'). Let the mind become a crystal-clear mirror reflecting transcendent light.",
    meditationProtocolHa: "Rufe idonka ka saurari numfashinka a lokacin da kake fitar da shi ('Hu'). Ka bar zuciyarka ta nutsu kamar ruwa mai tsafta.",
    dhikrFormulaAr: "يَا هَادِي يَا هُوَ يَا حَيُّ يَا قَيُّومُ",
    dhikrFormulaPhonetic: "Yā Hādī Yā Huwa Yā Ḥayyu Yā Qayyūm",
    recommendedCount: 66,
    frequencyHz: 639,
    descriptionFr: "La substance passive et subtile prête à recevoir toutes les formes de la création. Branche gauche de l'Arbre.",
    descriptionEn: "The subtle passive substance receptive to all manifesting forms of creation.",
    descriptionHa: "Tushe mai karbar kowane irin sura da siffar halitta.",
    x: 68,
    y: 56
  },
  {
    id: 'node-twig-jabarut',
    level: 3,
    fibonacciRatio: 3,
    letter: 'و',
    nameAr: 'وَاو (فَلَكُ العَرْشِ وَالرِّبَاطُ الجَامِعُ)',
    namePhonetic: 'Wāw',
    abjadValue: 6,
    elementFr: 'Air Céleste & Rayonnement d’Amour Universel',
    elementEn: 'Celestial Air & Universal Love Radiance',
    elementHa: 'Iskar Samaniya da Kaunar Ubangiji',
    stationAr: 'مَقَامُ فَلَكِ العَرْشِ المَجِيدِ وَالرِّبَاطِ الكَوْنِيِّ',
    stationFr: "La Sphère du Trône Suprême et le Lien d'Amour Cosmique",
    stationEn: "The Sphere of the Supreme Throne and Cosmic Bond of Love",
    stationHa: "Falakin Al'arshi da Damarar Kauna",
    titleFr: "Rameau 1 : Sphère du Trône Suprême (Al-ʿArsh al-Majīd / Wāw)",
    titleEn: "Twig 1: Sphere of the Supreme Throne (Al-Arsh al-Majid / Waw)",
    titleHa: "Reshe 1: Falakin Al'arshi Mai Girma (Al-Arsh / Waw)",
    world: "'Ālam al-Jabarūt (عالم الجبروت)",
    worldArabic: "عَالَمُ العَرْشِ المُحِيطِ بِالخَلَائِقِ",
    worldExplanationFr: "L'immense enceinte spirituelle qui englobe la totalité des cieux et de la création dans un manteau de miséricorde.",
    worldExplanationEn: "The boundless spiritual mantle embracing all celestial realms in infinite compassionate radiance.",
    worldExplanationHa: "Duniyar da ta kewaye dukkan sammai da kasa da rahamar Ubangiji.",
    presenceFr: "Ḥaḍrat al-Rahmāniyyah (Miséricorde Englobante)",
    presenceEn: "Presence of All-Encompassing Mercy",
    presenceHa: "Matakin Rahama Mai Game Kowa",
    divineNamesAr: ['الوَدُودُ', 'الوَاسِعُ', 'الوَكِيلُ', 'الوَالِي'],
    divineNamesFr: "Al-Wadūd (20), Al-Wāsi' (137), Al-Wakīl (66), Al-Wālī (47) — Noms d'Amour et d'Expansion",
    divineNamesEn: "Al-Wadud (20), Al-Wasi' (137), Al-Wakil (66), Al-Wali (47) — Names of Love & Boundlessness",
    divineNamesHa: "Al-Wadud (20), Al-Wasi' (137), Al-Wakil (66), Al-Wali (47) — Sunayen Soyayya da Yalwa",
    theurgicSecretFr: "Le Wāw est la conjonction mystique (« Et ») qui réconcilie les contraires et relie l'esprit à la matière. Sa silhouette évoque la spirale galactique et le fœtus dans la matrice. Invoquer le Wāw attire l'amour sincère des cœurs, l'harmonie conjugale, l'ouverture des relations humaines et la tendresse universelle.",
    theurgicSecretEn: "The Waw is the mystical conjunction ('And') uniting opposites and tethering spirit to manifest form. Its spiral geometry reflects galactic whorls and embryogenesis. Chanting Waw draws genuine affection, deep interpersonal harmony, and universal compassion.",
    theurgicSecretHa: "Harafin Waw shine hadin kan dukkan abubuwa masu sabani. Yana kawo soyayya mai karfi a tsakanin mutane da fahimtar juna da zaman lafiya.",
    angelicGuard: 'Al-Rūḥ al-Aʿẓam & Hamalat al-Sabt',
    angelicGuardAr: 'الرُّوحُ الأَعْظَمُ وَحُرَّاسُ المَحَبَّةِ الكَوْنِيَّةِ',
    cosmicFunctionFr: "Rayonnement de l'amour inconditionnel, conciliation des différends et unification des cœurs.",
    cosmicFunctionEn: "Emanation of unconditional love, reconciliation of hearts, and spiritual harmony.",
    cosmicFunctionHa: "Yada soyayya da sasantawa a tsakanin bayin Allah.",
    meditationProtocolFr: "Poser la main droite sur le cœur. Visualiser une lumière rose dorée chaleureuse s'étendant à tous les êtres de votre entourage. Réciter avec dévotion et douceur.",
    meditationProtocolEn: "Place your right hand over your heart. Visualize a warm rose-gold luminous wave expanding to encompass all living beings. Recite with gentle devotion.",
    meditationProtocolHa: "Dora hannunka na dama a kan zuciyarka, ka kudurta haske mai dumi yana fitowa yana game mutanen da ke kusa da kai.",
    dhikrFormulaAr: "يَا وَدُودُ يَا وَاسِعُ يَا وَلِيُّ يَا حَمِيدُ",
    dhikrFormulaPhonetic: "Yā Wadūdu Yā Wāsi'u Yā Waliyyu Yā Ḥamīd",
    recommendedCount: 137,
    frequencyHz: 417,
    descriptionFr: "Le Trône qui embrasse les cieux et la terre dans un rayonnement continu d'amour et d'harmonie universelle.",
    descriptionEn: "The Throne encompassing the heavens and earth in continuous luminescence.",
    descriptionHa: "Al'arshin da ya game sammai da kasa da haske mai dorewa.",
    x: 20,
    y: 40
  },
  {
    id: 'node-twig-malakut',
    level: 3,
    fibonacciRatio: 3,
    letter: 'ز',
    nameAr: 'زَاي (فَلَكُ الكُرْسِيِّ وَمَقَامُ الهَيْبَةِ)',
    namePhonetic: 'Zāy',
    abjadValue: 7,
    elementFr: 'Feu Céleste & Foudre de la Majesté Divine',
    elementEn: 'Celestial Fire & Thunderbolt of Divine Majesty',
    elementHa: 'Wutar Samaniya da Karfin Ikon Sarki',
    stationAr: 'مَقَامُ فَلَكِ الكُرْسِيِّ الوَسِيعِ وَسِرِّ الهَيْبَةِ',
    stationFr: "La Sphère du Piédestal de Gloire et la Station de Majesté",
    stationEn: "The Sphere of the Vast Footstool and Station of Majestic Awe",
    stationHa: "Falakin Kujerar Ubangiji (Kursi) da Sirrin Haiba",
    titleFr: "Rameau 2 : Sphère du Piédestal (Al-Kursī al-Waṣī' / Zāy)",
    titleEn: "Twig 2: Sphere of the Footstool (Al-Kursi al-Wasi' / Zay)",
    titleHa: "Reshe 2: Falakin Kujerar Ubangiji (Al-Kursi / Zay)",
    world: "'Ālam al-Malakūt (عالم الملكوت)",
    worldArabic: "عَالَمُ المَلَائِكَةِ وَالنُّورِ وَالقُوَى الرُّوحَانِيَّةِ",
    worldExplanationFr: "Le monde subtil des anges, des archétypes lumineux et des ordres de protection souverains.",
    worldExplanationEn: "The angelic realm of luminous forms, pure spirits, and authoritative cosmic shields.",
    worldExplanationHa: "Duniyar mala'iku da haske da kariya ta samaniya.",
    presenceFr: "Ḥaḍrat al-Qudrah (Le Déploiement de Puissance)",
    presenceEn: "Presence of Unfolding Sovereign Power",
    presenceHa: "Matakin Ikon Sarauta",
    divineNamesAr: ['العَزِيزُ', 'الزَّاهِرُ', 'الذَّاكِرُ', 'ذُو الجَلَالِ وَالإِكْرَامِ'],
    divineNamesFr: "Al-'Azīz (94), Al-Zāhir (1106), Al-Zakiyy (37), Dhū al-Jalāl (1099) — Noms de Victoire et d'Éclat",
    divineNamesEn: "Al-Aziz (94), Al-Zahir (1106), Al-Zakiyy (37), Dhu al-Jalal (1099) — Names of Victory & Radiance",
    divineNamesHa: "Al-Aziz (94), Al-Zahir (1106), Al-Zakiyy (37), Dhu al-Jalal (1099) — Sunayen Nasara da Girma",
    theurgicSecretFr: "Le Zāy est le nœud d'or central de l'Arbre, surmonté de son point d'autorité théurgique. C'est l'épée de justice spirituelle qui pourfend les influences maléfiques, brise les blocages psychiques et installe une aura de prestige et de respect (*Haybah*). C'est le centre de gravité reliant la racine aux fruits supérieurs.",
    theurgicSecretEn: "The Zay is the luminous golden core node of the Cosmic Tree, crowned by its point of authoritative sovereignty. It acts as a celestial sword shattering psychic shadows, dissolving stagnations, and establishing awe-inspiring spiritual presence (Haybah).",
    theurgicSecretHa: "Harafin Zay shine tsakiyar wannan bishiya mai kalar zinare. Yana karya dukkan wani asiri ko cutarwa ta boye, yana ba da kwarjini da haiba.",
    angelicGuard: 'ʿIzrā\'īl & Nuqabā\' al-Malakūt',
    angelicGuardAr: 'عِزْرَائِيلُ عَلَيْهِ السَّلَامُ وَنُقَبَاءُ المَلَكُوتِ حُرَّاسُ الهَيْبَةِ',
    cosmicFunctionFr: "Protection absolue contre les attaques subtiles, dissipation des doutes, renforcement de la volonté et autorité spirituelle.",
    cosmicFunctionEn: "Supreme spiritual protection, eradication of psychic blockages, steadfast willpower, and authoritative presence.",
    cosmicFunctionHa: "Kariya mai karfi daga shaidanu da samun daukaka da kwarjini a idon jama'a.",
    meditationProtocolFr: "Visualiser un cercle hexagonal d'or resplendissant autour de votre plexus solaire. Réciter les Noms avec fermeté et confiance en la toute-puissance divine.",
    meditationProtocolEn: "Visualize an iridescent golden hexagram revolving around your solar plexus. Recite the Names with unwavering confidence in the invincible Divine Power.",
    meditationProtocolHa: "Kudurta zoben zinare mai haske yana kewaye da cikinka. Karanta sunayen da karfin zuciya don samun kariya.",
    dhikrFormulaAr: "يَا عَزِيزُ يَا زَاهِرُ يَا ذَا الجَلَالِ وَالإِكْرَامِ",
    dhikrFormulaPhonetic: "Yā 'Azīzu Yā Zāhiru Yā Dha-l-Jalāli wa-l-Ikrām",
    recommendedCount: 94,
    frequencyHz: 741,
    descriptionFr: "Le siège de la justice céleste et le nœud doré central d'où émanent protection, prestige et souveraineté.",
    descriptionEn: "The seat of celestial justice radiating heavenly protection, sovereignty, and majestic awe.",
    descriptionHa: "Wurin hukuncin samaniya da kariya da kwarjini ga bayin Allah.",
    x: 50,
    y: 38
  },
  {
    id: 'node-twig-mulk',
    level: 3,
    fibonacciRatio: 3,
    letter: 'ح',
    nameAr: 'حَاء (فَلَكُ الكَوَاكِبِ وَمِفْتَاحُ الحَيَاةِ)',
    namePhonetic: 'Ḥā',
    abjadValue: 8,
    elementFr: 'Eau de Vie Éternelle & Sagesse Solaire',
    elementEn: 'Water of Eternal Life & Solar Wisdom',
    elementHa: 'Ruwan Rai da Hikimar Samaniya',
    stationAr: 'مَقَامُ فَلَكِ الكَوَاكِبِ الثَّابِتَةِ وَالبُرُوجِ الاثْنَيْ عَشَرَ',
    stationFr: "La Sphère des Étoiles Fixes, des Demeures Lunaires et des 12 Signes",
    stationEn: "Sphere of Fixed Stars, 28 Lunar Mansions, and 12 Zodiacal Signs",
    stationHa: "Falakin Taurari 28 da Matsugunan Wata",
    titleFr: "Rameau 3 : Sphère des Constellations (Falāk al-Kawākib / Ḥā)",
    titleEn: "Twig 3: Sphere of Fixed Stars & Mansions (Falak al-Kawakib / Ha)",
    titleHa: "Reshe 3: Falakin Taurari da Matsugunansu (Ha)",
    world: "'Ālam al-Mulk (عالم الملك)",
    worldArabic: "عَالَمُ المُلْكِ وَالشَّهَادَةِ وَالأَفْلَاكِ المَرْئِيَّةِ",
    worldExplanationFr: "Le monde phénoménal du cosmos visible, rythmé par le ballet des astres, des cycles lunaires et du temps terrestre.",
    worldExplanationEn: "The manifest realm of the visible cosmos governed by planetary orbits, lunar cycles, and seasonal rhythms.",
    worldExplanationHa: "Duniyar da muke gani da idanu mai cike da taurari da watanni da kwanaki.",
    presenceFr: "Ḥaḍrat al-Tadwīr (L'Horloge Céleste)",
    presenceEn: "Presence of Celestial Cycles",
    presenceHa: "Matakin Zagayen Zamani",
    divineNamesAr: ['الحَيُّ', 'الحَكِيمُ', 'الحَلِيمُ', 'الحَفِيظُ'],
    divineNamesFr: "Al-Ḥayy (18), Al-Ḥakīm (78), Al-Ḥalīm (88), Al-Ḥafīẓ (998) — Noms de Vie et de Haute Sagesse",
    divineNamesEn: "Al-Hayy (18), Al-Hakim (78), Al-Halim (88), Al-Hafiz (998) — Names of Life & Supreme Wisdom",
    divineNamesHa: "Al-Hayy (18), Al-Hakim (78), Al-Halim (88), Al-Hafiz (998) — Sunayen Rai da Hikima da Kariya",
    theurgicSecretFr: "Le Ḥā est le chiffre de la vie inextinguible (*Ḥayāt*) et de la sagesse pérenne (*Ḥikmah*). Il gouverne les 28 demeures de la lune et la diffusion des énergies astrologiques bénéfiques. Sa récitation nettoie les cellules du corps, accélère la guérison physique et confère la perspicacité dans les affaires du monde.",
    theurgicSecretEn: "The Ha is the sacred seal of eternal life (Hayat) and timeless wisdom (Hikmah). It orchestrates the 28 lunar mansions and the benign distribution of stellar energy. Chanting Ha revitalizes cellular biology, sharpens discernment, and brings rapid bodily healing.",
    theurgicSecretHa: "Harafin Ha shine tushen rai (Hayat) da hikima (Hikmah). Yana mulkar taurarin da ke sararin samaniya, yana kawo waraka daga cututtuka da basirar gudanar da rayuwa.",
    angelicGuard: 'Kawkabā\'īl & Malā\'ikat al-Aflāk',
    angelicGuardAr: 'كَوْكَبَائِيلُ وَحُرَّاسُ الأَفْلَاكِ وَالبُرُوجِ الاثْنَيْ عَشَرَ',
    cosmicFunctionFr: "Régénération de la vitalité vitale, clarté dans la prise de décision, santé et alignement avec le temps divin.",
    cosmicFunctionEn: "Cellular rejuvenation, strategic discernment, physical longevity, and synchronicity with cosmic rhythms.",
    cosmicFunctionHa: "Karfafa lafiyar jiki da samun basirar yanke shawara mai kyau a rayuwa.",
    meditationProtocolFr: "Contempler la voûte étoilée ou visualiser la danse harmonieuse des constellations. Respirer en visualisant une onde vert émeraude régénérant chaque organe de votre corps.",
    meditationProtocolEn: "Contemplate the celestial canopy or visualize the graceful dance of constellations. Inhale emerald-green vitality revitalizing every cell in your vessel.",
    meditationProtocolHa: "Ka kalli taurarin samaniya ko ka kudurta haske mai kalar ganye yana shiga cikin dukkan jikinka yana wanke cututtuka.",
    dhikrFormulaAr: "يَا حَيُّ يَا حَكِيمُ يَا حَلِيمُ يَا حَفِيظُ",
    dhikrFormulaPhonetic: "Yā Ḥayyu Yā Ḥakīmu Yā Ḥalīmu Yā Ḥafīẓ",
    recommendedCount: 78,
    frequencyHz: 852,
    descriptionFr: "Les 28 demeures lunaires et les constellations guidant le voyageur spirituel vers la santé et la haute sagesse.",
    descriptionEn: "The 28 lunar mansions and zodiacal constellations guiding the spiritual seeker.",
    descriptionHa: "Matsugunan wata 28 da taurari masu shiryar da matafiyi zuwa ga lafiya da hikima.",
    x: 80,
    y: 40
  },
  {
    id: 'node-leaf-presence-1',
    level: 4,
    fibonacciRatio: 5,
    letter: 'ي',
    nameAr: 'يَاء (الإِنْسَانُ الكَامِلُ وَمَجْمَعُ الأَسْرَارِ)',
    namePhonetic: 'Yā',
    abjadValue: 10,
    elementFr: 'Quintessence Divine & Synthèse Alchimique',
    elementEn: 'Divine Quintessence & Alchemical Synthesis',
    elementHa: 'Cikakkiyar Hikima ta Hadin Dukkan Abubuwa',
    stationAr: 'مَقَامُ الإِنْسَانِ الكَامِلِ وَمَجْمَعِ البَحْرَيْنِ',
    stationFr: "L'Homme Parfait et la Conjonction des Deux Océans",
    stationEn: "The Perfect Human and Conjunction of the Two Seas",
    stationHa: "Cikakken Dan Adam da Haduwar Tekuna Biyu",
    titleFr: "Feuille Suprême : L'Homme Parfait (Al-Insān al-Kāmil / Yā)",
    titleEn: "Supreme Leaf: The Perfect Human (Al-Insan al-Kamil / Ya)",
    titleHa: "Ganye na Musamman: Cikakken Dan Adam (Al-Insan al-Kamil / Ya)",
    world: "Jāmi' al-Marātib (جامع المراتب)",
    worldArabic: "عَالَمُ الإِنْسَانِ الكَامِلِ الجَامِعِ لِكُلِّ الحَضَرَاتِ",
    worldExplanationFr: "La station suprême où toutes les présences divines, angéliques et cosmiques sont parfaitement synthétisées dans le miroir du cœur purifié.",
    worldExplanationEn: "The supreme cosmic apex where all divine, angelic, and elemental presences reflect unified within the purified heart.",
    worldExplanationHa: "Matakin karshe inda dukkan matakan samaniya da na kasa suka hade a zuciyar mumini na gaskiya.",
    presenceFr: "Synthèse Totale de toutes les Présences (Al-Jam'iyyah)",
    presenceEn: "Total Synthesis of all Divine Presences",
    presenceHa: "Hadakar dukkan matakan rayuwa",
    divineNamesAr: ['الجَامِعُ', 'القَيُّومُ', 'النُّورُ', 'البَدِيعُ'],
    divineNamesFr: "Al-Jāmi' (114), Al-Qayyūm (156), Al-Nūr (256), Al-Badī' (86) — Noms de Synthèse et d'Éveil",
    divineNamesEn: "Al-Jami' (114), Al-Qayyum (156), Al-Nur (256), Al-Badi' (86) — Names of Synthesis & Illumination",
    divineNamesHa: "Al-Jami' (114), Al-Qayyum (156), Al-Nur (256), Al-Badi' (86) — Sunayen Hadawa da Haske",
    theurgicSecretFr: "Le Yā est la lettre terminale de l'alphabet qui referme le cycle cosmique pour rejoindre l'Alif initial (le cercle parfait de l'existence). Elle symbolise l'Homme Parfait (Al-Insān al-Kāmil), miroir poli dans lequel Dieu contemple tous Ses Noms. Sa récitation confère la réalisation spirituelle, l'illumination du cœur et l'union intérieure.",
    theurgicSecretEn: "The Ya is the final letter completing the cosmic circle, bridging back directly to the primordial Alif. It embodies the Perfect Human (Al-Insan al-Kamil)—the polished mirror reflecting all Divine Names simultaneously. Chanting Ya unlocks supreme mystical unveiling and unitive peace.",
    theurgicSecretHa: "Harafin Ya shine karshen haruffa wanda yake sake komawa ga Alif don cika da'irar halitta. Yana nuna cikar mutum da hasken da ke hada dukkan alkhairai.",
    angelicGuard: 'Al-Rūḥ al-Muḥammadī (الحقيقة المحمدية والروح الأعظم)',
    angelicGuardAr: 'الرُّوحُ المُحَمَّدِيُّ الجَامِعُ لِحَقَائِقِ الأَسْمَاءِ وَالصِّفَاتِ',
    cosmicFunctionFr: "Éveil mystique, réconciliation intérieure, unification des facultés de l'âme et rayonnement universel.",
    cosmicFunctionEn: "Mystic awakening, inner integration, unification of soul faculties, and transcendent spiritual radiance.",
    cosmicFunctionHa: "Bude idon basira da hadin kan zuciya da samun zaman lafiya da Ubangiji.",
    meditationProtocolFr: "S'asseoir en silence absolu. Visualiser le cœur comme un miroir immaculé reflétant l'univers entier sous la forme d'un océan de perles dorées. Réciter dans l'extinction de l'ego.",
    meditationProtocolEn: "Sit in profound stillness. Envision the heart as a flawless mirror reflecting the cosmos as an ocean of shimmering gold. Recite in total surrender of the ego.",
    meditationProtocolHa: "Zauna a cikin shiru ba tare da motsi ba. Ka kudurta zuciyarka kamar madubi mai haske da ke nuna girman Ubangiji.",
    dhikrFormulaAr: "يَا جَامِعُ يَا قَيُّومُ يَا نُورَ السَّمَاوَاتِ وَالأَرْضِ",
    dhikrFormulaPhonetic: "Yā Jāmi'u Yā Qayyūmu Yā Nūra s-Samāwāti wa-l-Arḍ",
    recommendedCount: 114,
    frequencyHz: 963,
    descriptionFr: "Le miroir poli dans lequel Dieu contemple tous Ses Noms et Attributs réunis. Feuille sommitale de l'Arbre.",
    descriptionEn: "The polished mirror in which the Divine witnesses all Names and Attributes unified.",
    descriptionHa: "Madubin da yake nuna dukkan kyawawan sunayen Allah a hade.",
    x: 50,
    y: 18
  },
  {
    id: 'node-fruit-throne-bearers',
    level: 5,
    fibonacciRatio: 8,
    letter: 'م',
    nameAr: 'مِيم (حَمَلَةُ العَرْشِ وَمَقَامُ الأَقْطَابِ)',
    namePhonetic: 'Mīm',
    abjadValue: 40,
    elementFr: 'Eau de Miséricorde Prophétique & Sceau Sacré',
    elementEn: 'Water of Prophetic Mercy & Sacred Seal',
    elementHa: 'Ruwan Rahamar Annabta da Hatimin Tsaro',
    stationAr: 'مَقَامُ حَمَلَةِ العَرْشِ الثَّمَانِيَةِ وَالأَقْطَابِ الأَرْبَعَةِ',
    stationFr: "Les Huit Anges Porteurs du Trône et les Quatre Pôles Spirituels",
    stationEn: "The Eight Angels Bearing the Throne and the Four Spiritual Poles",
    stationHa: "Mala'iku 8 Masu Daukar Al'arshi da Manyan Waliyyai",
    titleFr: "Fruit Doré : Les 8 Porteurs du Trône (Ḥamalat al-ʿArsh / Mīm)",
    titleEn: "Golden Fruit: The 8 Throne Bearers (Hamalat al-Arsh / Mim)",
    titleHa: "Ya'yan Zinare: Mala'iku 8 Masu Daukar Al'arshi (Mim)",
    world: "'Ālam al-Quds (عالم القدس)",
    worldArabic: "عَالَمُ القُدْسِ وَالاسْتِوَاءِ الإِلَهِيِّ",
    worldExplanationFr: "La haute sphère de sainteté d'où les archanges soutiennent les colonnes de l'univers et déversent la miséricorde perpétuelle.",
    worldExplanationEn: "The sublime realm of sanctity where archangelic pillars uphold the cosmic throne and cascade eternal blessings.",
    worldExplanationHa: "Duniyar tsarki inda manyan mala'iku ke rike da ginshikan duniya.",
    presenceFr: "Ḥaḍrat al-Istiwā' (L'Établissement Suprême)",
    presenceEn: "Presence of Supreme Enthronement",
    presenceHa: "Matakin Tabbata a kan Al'arshi",
    divineNamesAr: ['المَلِكُ', 'المَجِيدُ', 'المُؤْمِنُ', 'المُهَيْمِنُ'],
    divineNamesFr: "Al-Malik (90), Al-Majīd (57), Al-Mu'min (136), Al-Muhaymin (145) — Noms de Souveraineté et de Majesté",
    divineNamesEn: "Al-Malik (90), Al-Majid (57), Al-Mu'min (136), Al-Muhaymin (145) — Names of Sovereignty & Dignity",
    divineNamesHa: "Al-Malik (90), Al-Majid (57), Al-Mu'min (136), Al-Muhaymin (145) — Sunayen Mulki da Martaba",
    theurgicSecretFr: "Le Mīm est la lettre du sceau prophétique (*Aḥmad* et *Muḥammad*) et du secret des 40 jours de la retraite spirituelle (*Arba'īniyyah*). Sa forme ronde fermée retient les secrets divins avant de les faire fructifier. Réciter le Mīm confère la noblesse d'âme, la réussite dans les projets d'envergure, le charisme et la protection des anges du Trône.",
    theurgicSecretEn: "The Mim is the sacred seal of prophetic fullness (Ahmad & Muhammad) and the mystery of the 40-day spiritual retreat (Arba'iniyyah). Its rounded geometry gathers celestial secrets before bestowing them as fruit. Chanting Mim imparts noble character, authority, and archangelic patronage.",
    theurgicSecretHa: "Harafin Mim shine hatimin sunan Annabi (Muhammad da Ahmad) da sirrin kwanaki 40 na ibada ta musamman. Yana kawo nasara mai girma da kariya daga mala'ikun Al'arshi.",
    angelicGuard: 'Ḥamalat al-ʿArsh al-Thamāniyah (حملة العرش الثمانية)',
    angelicGuardAr: 'المَلَائِكَةُ الثَّمَانِيَةُ المُوَكَّلُونَ بِحَمْلِ العَرْشِ العَظِيمِ',
    cosmicFunctionFr: "Soutien inconditionnel des œuvres de bien, triomphe dans les épreuves difficiles et couronnement des efforts.",
    cosmicFunctionEn: "Upholding noble endeavors, triumph over daunting obstacles, and culmination of spiritual pursuits.",
    cosmicFunctionHa: "Taimako a lokutan tsanani da samun nasara a kan dukkan ayyukan alkhairi.",
    meditationProtocolFr: "Visualiser huit colonnes de lumière blanche soutenant une coupole céleste d'or pur au-dessus de votre être. Réciter avec solennité et gratitude profonde.",
    meditationProtocolEn: "Visualize eight mighty pillars of celestial light upholding an immense golden dome above you. Recite with solemn reverence and profound gratitude.",
    meditationProtocolHa: "Kudurta ginshikai takwas na haske suna rike da rufin zinare a saman kanka. Karanta sunayen da godiya ga Allah.",
    dhikrFormulaAr: "يَا مَلِكُ يَا مَجِيدُ يَا مُؤْمِنُ يَا مُهَيْمِنُ",
    dhikrFormulaPhonetic: "Yā Maliku Yā Majīdu Yā Mu'minu Yā Muhaymin",
    recommendedCount: 90,
    frequencyHz: 285,
    descriptionFr: "Les huit esprits angéliques et pôles soutenant la manifestation au Jour du Jugement. Fruit doré supérieur gauche.",
    descriptionEn: "The eight angelic spirits and poles sustaining existence at the Day of Awakening.",
    descriptionHa: "Mala'iku takwas masu daukar Al'arshin Ubangiji a ranar sakamako.",
    x: 30,
    y: 22
  },
  {
    id: 'node-fruit-mercy',
    level: 5,
    fibonacciRatio: 8,
    letter: 'ن',
    nameAr: 'نُون (بَحْرُ الرَّحْمَةِ الأَبَدِيَّةِ وَدَوَاةُ الوُجُودِ)',
    namePhonetic: 'Nūn',
    abjadValue: 50,
    elementFr: 'Encre Cosmique & Fluide de Félicité Infinie',
    elementEn: 'Cosmic Ink & Fluid of Infinite Felicity',
    elementHa: 'Tawadar Halitta da Kogin Rahama',
    stationAr: 'مَقَامُ بَحْرِ الرَّحْمَةِ الوَاسِعَةِ وَدَوَاةِ القَلَمِ الإِلَهِيِّ',
    stationFr: "L'Océan de la Miséricorde Infinie et l'Encrier Céleste",
    stationEn: "The Ocean of Infinite Mercy and Celestial Inkwell",
    stationHa: "Tekun Rahama Mai Fadi da Tawadar Rubuta Kaddara",
    titleFr: "Fruit Lumineux : L'Océan de Miséricorde (Baḥr al-Raḥmah / Nūn)",
    titleEn: "Luminous Fruit: Ocean of Eternal Mercy (Bahr al-Rahmah / Nun)",
    titleHa: "Ya'yan Haske: Tekun Rahama Mai Dorewa (Nun)",
    world: "'Ālam al-Jabarūt (عالم الجبروت)",
    worldArabic: "عَالَمُ الأَنْوَارِ وَالرَّحَمَاتِ الفَيَّاضَةِ",
    worldExplanationFr: "L'océan sans rivage de la bienveillance divine duquel jaillissent les lumières de l'illumination et de la délivrance.",
    worldExplanationEn: "The shoreless ocean of divine generosity whence the waters of eternal joy and spiritual deliverance surge.",
    worldExplanationHa: "Kogin rahamar Ubangiji wanda babu iyaka ga alkhairansa.",
    presenceFr: "Ḥaḍrat al-Jamāl al-Ilāhī (La Beauté Pure)",
    presenceEn: "Presence of Pure Divine Beauty",
    presenceHa: "Matakin Kyawun Ubangiji",
    divineNamesAr: ['النُّورُ', 'النَّافِعُ', 'النَّعِيمُ', 'البَاسِطُ'],
    divineNamesFr: "Al-Nūr (256), Al-Nāfi' (201), Al-Ni'am (160), Al-Bāsiṭ (72) — Noms de Grâce et de Lumière",
    divineNamesEn: "Al-Nur (256), Al-Nafi' (201), Al-Ni'am (160), Al-Basit (72) — Names of Grace & Pure Radiance",
    divineNamesHa: "Al-Nur (256), Al-Nafi' (201), Al-Ni'am (160), Al-Basit (72) — Sunayen Haske da Rahama",
    theurgicSecretFr: "« Nūn. Par le Calame et ce qu'ils écrivent ! » (Coran 68:1). Le Nūn est la coupe céleste contenant l'encre avec laquelle le Calame divin (Alif/Bā) a gravé le destin des mondes. Son point central est la perle de la connaissance secrète. Invoquer le Nūn dissipe la mélancolie, guérit les angoisses nocturnes et ouvre les trésors de la grâce inespérée.",
    theurgicSecretEn: "'Nun. By the Pen and what they inscribe!' (Quran 68:1). The Nun is the celestial chalice holding the luminous ink with which the supreme Pen etched the destinies of all realms. Chanting Nun banishes grief, alleviates night anxieties, and unlocks hidden treasures of grace.",
    theurgicSecretHa: "'Nun. Da Alkalami da abin da suke rubutawa!'. Harafin Nun shine kwanon da ke dauke da tawadar da aka rubuta kaddarorin duniya da ita. Yana magance bakin ciki da tsoro yana kawo farin ciki.",
    angelicGuard: 'Nūnā\'īl & Khuzzān al-Raḥmah',
    angelicGuardAr: 'نُونَائِيلُ وَخُزَّانُ الرَّحْمَةِ وَالفُيُوضَاتِ الرَّبَّانِيَّةِ',
    cosmicFunctionFr: "Dissipation de toute tristesse, expansion du cœur, illumination des pensées et joie intérieure inextinguible.",
    cosmicFunctionEn: "Dispelling all grief, expanding the chest, illuminating thoughts, and instilling perpetual inner joy.",
    cosmicFunctionHa: "Kawar da damuwa da yaye kunci da samun farin ciki marar karewa.",
    meditationProtocolFr: "Visualiser une coupe d'argent pur au centre de la poitrine recevant une pluie d'étoiles scintillantes qui apaisent chaque tension. Réciter en souriant intérieurement.",
    meditationProtocolEn: "Visualize a silver chalice resting at your heart, collecting a gentle shower of starlight that dissolves every sorrow. Recite with serene inner peace.",
    meditationProtocolHa: "Kudurta kofin azurfa mai kyau a zuciyarka yana karbar ruwan hasken taurari yana sanyaya zuciyarka.",
    dhikrFormulaAr: "يَا نُورُ يَا نَافِعُ يَا بَدِيعَ السَّمَاوَاتِ وَالأَرْضِ",
    dhikrFormulaPhonetic: "Yā Nūru Yā Nāfi'u Yā Badī'a s-Samāwāti wa-l-Arḍ",
    recommendedCount: 256,
    frequencyHz: 528,
    descriptionFr: "L'océan infini de grâce duquel jaillissent les lumières de la félicité éternelle. Fruit lumineux supérieur droit.",
    descriptionEn: "The infinite ocean of grace whence the lights of perpetual felicity cascade.",
    descriptionHa: "Tekun rahama wanda albarka da haske ke malala daga gare shi.",
    x: 70,
    y: 22
  }
];
