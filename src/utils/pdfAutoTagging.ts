import { PdfDocument } from '../types/pdfDocument';

export interface PdfCategoryTag {
  id: string;
  name: string;
  name_en: string;
  name_ha: string;
  iconName: string;
  emoji: string;
  badgeColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  description: string;
  keywords: string[];
}

export const PDF_AUTO_CATEGORIES: PdfCategoryTag[] = [
  {
    id: 'secrets',
    name: 'Secrets & Recettes',
    name_en: 'Secrets & Recipes',
    name_ha: 'Asirai da Girke-girke',
    iconName: 'Key',
    emoji: '🔑',
    badgeColor: 'amber',
    textColor: 'text-amber-800 dark:text-amber-300',
    bgColor: 'bg-amber-100 dark:bg-amber-950/50',
    borderColor: 'border-amber-300 dark:border-amber-700/60',
    description: 'Secrets mystiques, talasims, khatims et protocoles spirituels authentiques.',
    keywords: [
      'secret', 'secrets', 'recette', 'recettes', 'asrar', 'sirr', 'al-asrar', 
      'khatim', 'khatims', 'awfaq', 'carré', 'carrés', 'théurgie', 'mystique', 
      'alchimie', 'khawatim', 'pratique', 'pratiques', 'kashf'
    ]
  },
  {
    id: 'wirds',
    name: 'Wirds & Litanies',
    name_en: 'Wirds & Litanies',
    name_ha: 'Awradi da Zikiri',
    iconName: 'BookOpen',
    emoji: '📿',
    badgeColor: 'indigo',
    textColor: 'text-indigo-800 dark:text-indigo-300',
    bgColor: 'bg-indigo-100 dark:bg-indigo-950/50',
    borderColor: 'border-indigo-300 dark:border-indigo-700/60',
    description: 'Awrads sacrés, litanies quotidiennes, ahzabs protecteurs et zikrs des maîtres.',
    keywords: [
      'wird', 'wirds', 'awrad', 'wazifa', 'lazim', 'hizb', 'ahzab', 'ratib', 
      'litanie', 'litanies', 'dhikr', 'zikr', 'zikirs', 'tasbih', 'salawat',
      'salat', 'dalail', 'tariqa', 'tariqat', 'moustajab'
    ]
  },
  {
    id: 'talsams',
    name: 'Talsams & Noms Divins',
    name_en: 'Talsams & Divine Names',
    name_ha: 'Talasimai da Sunaye',
    iconName: 'Sparkles',
    emoji: '⚡',
    badgeColor: 'purple',
    textColor: 'text-purple-800 dark:text-purple-300',
    bgColor: 'bg-purple-100 dark:bg-purple-950/50',
    borderColor: 'border-purple-300 dark:border-purple-700/60',
    description: 'Condensations de formules mystiques, talasims angéliques et Noms cachés.',
    keywords: [
      'talsam', 'talsams', 'tilasim', 'tilasims', 'talasim', 'nom caché', 
      'noms cachés', 'ism', 'asma', 'asmaul', 'khodam', 'khouddam', 'rouhaniyya', 
      'angélique', 'sceau', 'sceaux', 'pendant', 'bague', 'talisman', 'barhatiyya'
    ]
  },
  {
    id: 'invocations',
    name: 'Invocations & Du\'ā',
    name_en: 'Du\'a & Prayers',
    name_ha: 'Addu\'o\'i',
    iconName: 'Heart',
    emoji: '🤲',
    badgeColor: 'emerald',
    textColor: 'text-emerald-800 dark:text-emerald-300',
    bgColor: 'bg-emerald-100 dark:bg-emerald-950/50',
    borderColor: 'border-emerald-300 dark:border-emerald-700/60',
    description: 'Prières d\'exaucement, supplications prophétiques et duas de besoin pressant.',
    keywords: [
      'dua', 'du\'a', 'duas', 'du\'as', 'invocation', 'invocations', 'addu\'a', 
      'prière', 'prières', 'supplication', 'munajat', 'istighfar', 'istikhara', 
      'besoin', 'exaucement', 'soulagement'
    ]
  },
  {
    id: 'protection',
    name: 'Protection & Ruqyah',
    name_en: 'Protection & Ruqyah',
    name_ha: 'Kariya da Ruqyah',
    iconName: 'Shield',
    emoji: '🛡️',
    badgeColor: 'rose',
    textColor: 'text-rose-800 dark:text-rose-300',
    bgColor: 'bg-rose-100 dark:bg-rose-950/50',
    borderColor: 'border-rose-300 dark:border-rose-700/60',
    description: 'Défense contre le sihr, le mauvais œil, délivrance occulte et guérison coranique.',
    keywords: [
      'protection', 'ruqyah', 'roqya', 'sihr', 'sorcellerie', 'mauvais œil', 
      'evil eye', 'délivrance', 'kariya', 'bouclier', 'défense', 'purification', 
      'guérison', 'shifa', 'noeuds', 'jalousie', 'ennemi', 'djinns', 'attaque'
    ]
  },
  {
    id: 'lettres',
    name: 'Sciences des Lettres & Abjad',
    name_en: 'Science of Letters & Abjad',
    name_ha: 'Ilmin Haruffa da Hisabi',
    iconName: 'Layers',
    emoji: '🔢',
    badgeColor: 'cyan',
    textColor: 'text-cyan-800 dark:text-cyan-300',
    bgColor: 'bg-cyan-100 dark:bg-cyan-950/50',
    borderColor: 'border-cyan-300 dark:border-cyan-700/60',
    description: 'Calculs de l\'Abjad, métaphysique des 28 lettres, zairja et alchimie des nombres.',
    keywords: [
      'lettre', 'lettres', 'abjad', 'jafr', 'jafar', 'ilm', 'chiffre', 'chiffres', 
      'valeur', 'buni', 'al-buni', 'haruffa', 'géomancie', 'raml', 'horaire', 
      'astrologie', 'planète', 'lunaire', 'taksir'
    ]
  },
  {
    id: 'ouvertures',
    name: 'Ouvertures & Richesse (Rizq)',
    name_en: 'Openings & Prosperity (Rizq)',
    name_ha: 'Bude Kofofi da Arziki',
    iconName: 'Coins',
    emoji: '🌱',
    badgeColor: 'teal',
    textColor: 'text-teal-800 dark:text-teal-300',
    bgColor: 'bg-teal-100 dark:bg-teal-950/50',
    borderColor: 'border-teal-300 dark:border-teal-700/60',
    description: 'Attraction de la subsistance, prospérité financière, chance et facilitation.',
    keywords: [
      'ouverture', 'ouvertures', 'rizq', 'richesse', 'argent', 'subsistance', 
      'prospérité', 'bude', 'arziki', 'chance', 'succès', 'commerce', 'clientèle', 
      'élévation', 'gloire', 'prestige', 'dette', 'fath'
    ]
  },
  {
    id: 'manuscrits',
    name: 'Manuscrits Anciens',
    name_en: 'Ancient Manuscripts',
    name_ha: 'Tsoffin Rubuce-rubuce',
    iconName: 'FileText',
    emoji: '📜',
    badgeColor: 'amber',
    textColor: 'text-amber-900 dark:text-amber-200',
    bgColor: 'bg-amber-100 dark:bg-amber-950/70',
    borderColor: 'border-amber-400 dark:border-amber-600',
    description: 'Grimoires ancestraux, traités calligraphiés rares et archives des grands savants.',
    keywords: [
      'manuscrit', 'manuscrits', 'ancien', 'anciens', 'traité', 'grimoire', 
      'grimoires', 'rare', 'rares', 'khazina', 'tome', 'archive', 'original', 
      'shams', 'buni', 'ibn arabi', 'chams'
    ]
  },
  {
    id: 'coran',
    name: 'Coran & Tafsir',
    name_en: 'Quran & Exegesis',
    name_ha: 'Alkur\'ani da Tafsiri',
    iconName: 'BookOpen',
    emoji: '📖',
    badgeColor: 'emerald',
    textColor: 'text-emerald-900 dark:text-emerald-200',
    bgColor: 'bg-emerald-100 dark:bg-emerald-950/70',
    borderColor: 'border-emerald-400 dark:border-emerald-600',
    description: 'Exégèse coranique, vertus des sourates et méditations des versets sacrés.',
    keywords: [
      'coran', 'quran', 'sourate', 'sourates', 'verset', 'versets', 'tafsir', 
      'alkur\'ani', 'aya', 'ayoyin', 'fatiha', 'yasin', 'waqia', 'mulk', 'baqara', 
      'ikhlas', 'kursi'
    ]
  }
];

/**
 * Automatically inspects a PDF Document's full textual content (title, description, tags, author, category)
 * and assigns matching canonical categories with score weighting.
 */
export const detectPdfAutoCategories = (pdf: PdfDocument): PdfCategoryTag[] => {
  if (!pdf) return [PDF_AUTO_CATEGORIES[0]];

  // Build a searchable text bag
  const textBag = [
    pdf.title || '',
    pdf.title_en || '',
    pdf.title_ha || '',
    pdf.description || '',
    pdf.description_en || '',
    pdf.description_ha || '',
    pdf.author || '',
    pdf.category || '',
    ...(pdf.tags || [])
  ]
    .join(' ')
    .toLowerCase();

  // Score each category based on keyword occurrences and category mapping
  const scoredCategories: { cat: PdfCategoryTag; score: number }[] = PDF_AUTO_CATEGORIES.map((cat) => {
    let score = 0;

    // Direct category mapping bonus
    if (pdf.category === 'asrar' && cat.id === 'secrets') score += 10;
    if (pdf.category === 'invocations' && cat.id === 'invocations') score += 10;
    if (pdf.category === 'tafsir' && cat.id === 'coran') score += 10;
    if (pdf.category === 'manuscrits' && cat.id === 'manuscrits') score += 10;
    if (pdf.category === 'sciences_lettres' && cat.id === 'lettres') score += 10;
    if (pdf.category === 'spiritualite' && (cat.id === 'wirds' || cat.id === 'invocations')) score += 4;

    // Match keywords
    for (const kw of cat.keywords) {
      if (textBag.includes(kw)) {
        // Higher weight if keyword appears in title or tags
        const inTitle = (pdf.title || '').toLowerCase().includes(kw);
        const inTags = (pdf.tags || []).some((t) => t.toLowerCase().includes(kw));
        score += inTitle ? 5 : inTags ? 4 : 2;
      }
    }

    return { cat, score };
  });

  // Filter categories with score > 0 and sort descending
  const matched = scoredCategories
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.cat);

  if (matched.length > 0) {
    return matched;
  }

  // Fallback defaults based on category if no keyword matched
  if (pdf.category === 'invocations') return [PDF_AUTO_CATEGORIES.find((c) => c.id === 'invocations')!];
  if (pdf.category === 'tafsir') return [PDF_AUTO_CATEGORIES.find((c) => c.id === 'coran')!];
  if (pdf.category === 'manuscrits') return [PDF_AUTO_CATEGORIES.find((c) => c.id === 'manuscrits')!];
  if (pdf.category === 'sciences_lettres') return [PDF_AUTO_CATEGORIES.find((c) => c.id === 'lettres')!];
  return [PDF_AUTO_CATEGORIES.find((c) => c.id === 'secrets')!];
};

/**
 * Returns the single most dominant category tag for a PDF.
 */
export const getPrimaryPdfCategory = (pdf: PdfDocument): PdfCategoryTag => {
  const cats = detectPdfAutoCategories(pdf);
  return cats[0] || PDF_AUTO_CATEGORIES[0];
};

/**
 * Groups a collection of PDFs by their auto-detected categories.
 * A document can belong to multiple thematic categories if it matches both (e.g. Secrets + Protection).
 */
export const groupPdfsByAutoCategories = (
  pdfs: PdfDocument[]
): { category: PdfCategoryTag; pdfs: PdfDocument[]; count: number }[] => {
  const map = new Map<string, PdfDocument[]>();

  // Initialize for all categories
  PDF_AUTO_CATEGORIES.forEach((cat) => {
    map.set(cat.id, []);
  });

  // Assign PDFs
  pdfs.forEach((pdf) => {
    const cats = detectPdfAutoCategories(pdf);
    cats.forEach((cat) => {
      const list = map.get(cat.id);
      if (list && !list.some((p) => p.id === pdf.id)) {
        list.push(pdf);
      }
    });
  });

  // Return only non-empty groups, sorted by count descending
  return PDF_AUTO_CATEGORIES.map((cat) => {
    const groupPdfs = map.get(cat.id) || [];
    return {
      category: cat,
      pdfs: groupPdfs,
      count: groupPdfs.length
    };
  }).filter((group) => group.count > 0);
};
