import { DEFAULT_SPIRITUAL_FALLBACK_IMAGES } from '../utils/articleImageUtils';

export interface SubCategoryItem {
  id: string;
  name: string;
  name_en?: string;
  name_ha?: string;
  hook?: string; // Phrase d'accroche captivante
  hook_en?: string;
  hook_ha?: string;
  thumbnail?: string; // Vignette / image cover
  iconName?: string;
  createdAt?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  name_en?: string;
  name_ha?: string;
  hook?: string; // Phrase d'accroche captivante
  hook_en?: string;
  hook_ha?: string;
  thumbnail?: string; // Vignette / image cover
  iconName?: string;
  subCategories?: SubCategoryItem[];
  createdAt?: number;
}

export const PRESET_THUMBNAILS = [
  {
    label: 'Coran Sacré & Rayons Célestes',
    url: 'https://images.unsplash.com/photo-1542816417-0983cbe32277?q=80&w=800&auto=format&fit=crop',
    tag: 'Coran & Foi'
  },
  {
    label: 'Parchemin Ancien & Manuscrits',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    tag: 'Secrets & Asrar'
  },
  {
    label: 'Lanterne & Nuit Mystique',
    url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop',
    tag: 'Protection & Ruqyah'
  },
  {
    label: 'Rayons Dorés & Abondance',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    tag: 'Richesse & Ouverture'
  },
  {
    label: 'Méditation & Sérénité au Crépuscule',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    tag: 'Invocations & Douas'
  },
  {
    label: 'Ciel Cosmique & Constellations',
    url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800&auto=format&fit=crop',
    tag: 'Sciences Spirituelles'
  },
  {
    label: 'Géométrie Sacrée & Architecture',
    url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=800&auto=format&fit=crop',
    tag: 'Zikr & Awrads'
  },
  {
    label: 'Dunes Dorées du Sahara',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    tag: 'Désert & Retraite'
  },
  {
    label: 'Ciel Éthéré & Clarté Divine',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    tag: 'Illumination'
  },
  {
    label: 'Montagnes Sacrées & Paix',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    tag: 'Purification'
  }
];

export const PRESET_ICONS = [
  'Sparkles',
  'Shield',
  'BookOpen',
  'Heart',
  'Key',
  'Compass',
  'Moon',
  'Sun',
  'Flame',
  'Feather',
  'FolderOpen',
  'Volume2',
  'Star',
  'Coins'
];

export const DEFAULT_CATEGORIES_PRESETS: CategoryItem[] = [
  {
    id: 'secrets-pratiques',
    name: 'Secrets & Pratiques',
    name_en: 'Secrets & Practices',
    name_ha: 'Asirai da Ayyuka',
    hook: 'Secrets ésotériques profonds, talasims authentiques et protocoles mystiques des maîtres initiés.',
    hook_en: 'Deep esoteric secrets, authentic talasims, and mystical protocols from initiated masters.',
    hook_ha: 'Bayanin asirai masu zurfi, talasimai da hanyoyin aiki na asali daga manyan malamai.',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    iconName: 'Sparkles',
    subCategories: [
      {
        id: 'secrets-khatim',
        name: 'Khatims & Carrés Magiques',
        name_en: 'Khatims & Magic Squares',
        name_ha: 'Khatimai da Hatimai',
        hook: 'Structures géométriques sacrées canalisant les énergies des versets et Noms Divins.',
        thumbnail: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'secrets-talsam',
        name: 'Talasims & Noms Cachés',
        name_en: 'Talasims & Hidden Names',
        name_ha: 'Talasimai da Sunaye',
        hook: 'Condensations mystiques et formules d\'évocation angélique consacrées.',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'secrets-sirr',
        name: 'Sirr Al-Asrar (Grand Secret)',
        name_en: 'Secret of Secrets',
        name_ha: 'Asirin Asirai',
        hook: 'Enseignements d\'élite pour l\'élévation spirituelle et le dévoilement intérieur.',
        thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800&auto=format&fit=crop'
      }
    ],
    createdAt: 1000
  },
  {
    id: 'protection-ruqyah',
    name: 'Protection & Ruqyah',
    name_en: 'Protection & Ruqyah',
    name_ha: 'Kariya da Ruqyah',
    hook: 'Boucliers spirituels, désenvoûtement, annulation du mauvais œil et immunité divine.',
    hook_en: 'Spiritual shields, unblocking, neutralization of evil eye, and divine immunity.',
    hook_ha: 'Kariya daga dukkan sharrin mutum da aljan, wanke sihiri da waraka.',
    thumbnail: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop',
    iconName: 'Shield',
    subCategories: [
      {
        id: 'ruqyah-sourates',
        name: 'Sourates & Versets de Protection',
        name_en: 'Protective Verses',
        name_ha: 'Ayoyin Kariya',
        hook: 'Al-Mu’awwidhatayn, Ayat Al-Kursi et armes coraniques contre les forces obscures.',
        thumbnail: 'https://images.unsplash.com/photo-1542816417-0983cbe32277?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'ruqyah-desenvoutement',
        name: 'Désenvoûtement & Bains Mystiques',
        name_en: 'Cleansing & Uncrossing',
        name_ha: 'Wanke Sihiri da Tsarki',
        hook: 'Purifications profondes pour dissoudre les blocages occultes et charges négatives.',
        thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'ruqyah-hifz',
        name: 'Hifz & Forteresse Quotidienne',
        name_en: 'Daily Fortress (Hifz)',
        name_ha: 'Garkuwar Kullum',
        hook: 'Invocations matinales et vespérales pour une garde angélique imprenable.',
        thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop'
      }
    ],
    createdAt: 1001
  },
  {
    id: 'richesse-ouverture',
    name: 'Richesse & Ouverture',
    name_en: 'Wealth & Openings',
    name_ha: 'Arziki da Bude Kofofi',
    hook: 'Clés d\'abondance, déblocage financier, attraction de la clientèle et subsistances bénies.',
    hook_en: 'Keys to abundance, financial breakthroughs, business success, and blessed sustenance.',
    hook_ha: 'Hanyoyin samun arziki mai albarka, kasuwanci mai albarka da bude kofofin rabo.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    iconName: 'Coins',
    subCategories: [
      {
        id: 'richesse-waqia',
        name: 'Secrets Sourate Al-Waqi\'a',
        name_en: 'Surah Al-Waqi\'a Secrets',
        name_ha: 'Sirrin Suratul Waqi\'a',
        hook: 'Récitations et protocoles vérifiés pour écarter la pauvreté et attirer la subsistance.',
        thumbnail: 'https://images.unsplash.com/photo-1542816417-0983cbe32277?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'richesse-istighfar',
        name: 'Istighfar & Pluie de Bienfaits',
        name_en: 'Istighfar & Abundance',
        name_ha: 'Istigfari da Albarka',
        hook: 'Le repentir comme accélérateur d\'ouverture matérielle et d\'afflux financier.',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'richesse-commerce',
        name: 'Succès Commercial & Affaires',
        name_en: 'Business & Trade Success',
        name_ha: 'Nasara a Kasuwanci',
        hook: 'Facilitations providentielles pour les commerçants, artisans et entrepreneurs.',
        thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop'
      }
    ],
    createdAt: 1002
  },
  {
    id: 'invocations-douas',
    name: 'Invocations & Douas',
    name_en: 'Invocations & Supplications',
    name_ha: 'Addu\'o\'i da Bukatu',
    hook: 'Supplications du cœur, prières exaucées et formules prophétiques pour chaque moment de vie.',
    hook_en: 'Heartfelt supplications, answered prayers, and prophetic formulas for every life situation.',
    hook_ha: 'Addu\'o\'i karbabbu don biyan bukatun rayuwa da samun nutsuwa.',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    iconName: 'Heart',
    subCategories: [
      {
        id: 'douas-hajah',
        name: 'Salat Al-Hajah (Besoin Pressant)',
        name_en: 'Urgent Needs (Salat Al-Hajah)',
        name_ha: 'Salat Al-Hajah don Bukata',
        hook: 'La prière de détresse pour dénouer les épreuves réputées insurmontables.',
        thumbnail: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'douas-matin-soir',
        name: 'Adhkars Matin & Soir',
        name_en: 'Morning & Evening Remembrances',
        name_ha: 'Zikiri na Safe da Maraice',
        hook: 'Litanies quotidiennes prescrites par la Sunnah pour préserver l\'harmonie intérieure.',
        thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop'
      }
    ],
    createdAt: 1003
  },
  {
    id: 'sciences-spirituelles',
    name: 'Sciences Spirituelles',
    name_en: 'Spiritual Sciences',
    name_ha: 'Ilimin Ruhaniya',
    hook: 'Mystères des lettres arabes (Ilm al-Huruf), calculs Abjad et correspondances cosmologiques.',
    hook_en: 'Mysteries of Arabic letters (Ilm al-Huruf), Abjad calculations, and cosmology.',
    hook_ha: 'Ilimin haruffa, lissafin abjad da sirrikan halitta.',
    thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800&auto=format&fit=crop',
    iconName: 'Compass',
    subCategories: [
      {
        id: 'sciences-huruf',
        name: 'Science des 28 Lettres (Huruf)',
        name_en: 'Science of Letters',
        name_ha: 'Ilimin Haruffa 28',
        hook: 'Tempéraments élémentaires (feu, terre, air, eau) et forces des lettres sacrées.',
        thumbnail: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'sciences-abjad',
        name: 'Calculs Abjad & Poids Mystiques',
        name_en: 'Abjad & Mystical Weights',
        name_ha: 'Lissafin Abjad da Adadi',
        hook: 'Méthodes de résonance numérique pour amplifier les zikrs et invocations.',
        thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop'
      }
    ],
    createdAt: 1004
  },
  {
    id: 'coran-sourates',
    name: 'Coran & Sourates',
    name_en: 'Quran & Surahs',
    name_ha: 'Alkur\'ani da Surori',
    hook: 'Vertus spécifiques (Khawaas) des sourates et versets pour guider l\'existence.',
    hook_en: 'Specific virtues (Khawaas) of Surahs and verses to illuminate and guide life.',
    hook_ha: 'Falalar surori da ayoyin Alkur\'ani mai girma don shiriyar rayuwa.',
    thumbnail: 'https://images.unsplash.com/photo-1542816417-0983cbe32277?q=80&w=800&auto=format&fit=crop',
    iconName: 'BookOpen',
    subCategories: [
      {
        id: 'coran-yasin',
        name: 'Sourate Yâ-Sîn (Cœur du Coran)',
        name_en: 'Surah Yasin',
        name_ha: 'Suratul Yasin',
        hook: 'Lectures particulières et invocations de soulagement immédiat.',
        thumbnail: 'https://images.unsplash.com/photo-1542816417-0983cbe32277?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'coran-fatiha',
        name: 'Sourate Al-Fatiha',
        name_en: 'Surah Al-Fatiha',
        name_ha: 'Suratul Fatiha',
        hook: 'Les 7 versets répétés comme source de guérison universelle et de bénédiction.',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
      }
    ],
    createdAt: 1005
  }
];

export const normalizeCategoryId = (name: string): string => {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const normalizeSubCategoryId = (catId: string, name: string): string => {
  const cleanSub = name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${catId}-${cleanSub}`;
};

export const getCategoryFallbackThumbnail = (name?: string): string => {
  if (!name) return PRESET_THUMBNAILS[0].url;
  const n = name.toLowerCase();
  if (n.includes('protect') || n.includes('ruqyah') || n.includes('sihr') || n.includes('hifz')) {
    return 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop';
  }
  if (n.includes('richesse') || n.includes('ouvert') || n.includes('wealth') || n.includes('rizq') || n.includes('argent')) {
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop';
  }
  if (n.includes('secret') || n.includes('sirr') || n.includes('khatim') || n.includes('talsam')) {
    return 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop';
  }
  if (n.includes('coran') || n.includes('sourate') || n.includes('quran') || n.includes('verset') || n.includes('aya')) {
    return 'https://images.unsplash.com/photo-1542816417-0983cbe32277?q=80&w=800&auto=format&fit=crop';
  }
  if (n.includes('invo') || n.includes('doua') || n.includes('priere') || n.includes('dua')) {
    return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop';
  }
  if (n.includes('science') || n.includes('huruf') || n.includes('abjad') || n.includes('nombre') || n.includes('adad')) {
    return 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800&auto=format&fit=crop';
  }
  return PRESET_THUMBNAILS[0].url;
};

export const getCategoryFallbackHook = (name?: string): string => {
  if (!name) return 'Explorez les enseignements authentiques et secrets spirituels sélectionnés pour vous.';
  const n = name.toLowerCase();
  if (n.includes('protect') || n.includes('ruqyah')) {
    return 'Boucliers spirituels, désenvoûtement, annulation du mauvais œil et immunité divine.';
  }
  if (n.includes('richesse') || n.includes('ouvert') || n.includes('rizq')) {
    return 'Clés d\'abondance, déblocage financier, attraction de la clientèle et subsistances bénies.';
  }
  if (n.includes('secret') || n.includes('sirr')) {
    return 'Secrets ésotériques profonds, talasims authentiques et protocoles mystiques d\'élite.';
  }
  if (n.includes('coran') || n.includes('sourate')) {
    return 'Vertus spécifiques (Khawaas) des sourates et versets pour illuminer et guider l\'existence.';
  }
  if (n.includes('invo') || n.includes('doua')) {
    return 'Prières exaucées, supplications du cœur et formules prophétiques éprouvées.';
  }
  if (n.includes('science') || n.includes('huruf')) {
    return 'Mystères des lettres arabes (Ilm al-Huruf), calculs Abjad et secrets cosmogoniques.';
  }
  return `Découvrez l'ensemble des enseignements et secrets spirituels dédiés à la thématique ${name}.`;
};

export const getSubCategoryFallbackHook = (subName?: string, catName?: string): string => {
  if (!subName) return 'Secrets détaillés et pratiques spirituelles guidées.';
  return `Méthodes éprouvées, zikrs quotidiens et awrads consacrés à ${subName}${catName ? ` (${catName})` : ''}.`;
};
