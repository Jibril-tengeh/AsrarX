import { tools } from '../data/tools';

const fallbackNames: Record<string, { fr: string; en: string; ha: string }> = {
  abjad: { fr: 'Calculateur Abjad', en: 'Abjad Calculator', ha: 'Lissafin Abjad' },
  'custom-dua': { fr: 'Générateur de Du\'a Custom', en: 'Custom Du\'a Generator', ha: 'Addu\'ar Musamman' },
  'advanced-raml-processing': { fr: 'Traitement Avancé de Raml', en: 'Advanced Raml Processing', ha: 'Karatun Ramli Mai Zurfi' },
  'seals-catalogue': { fr: 'Catalogue des Sceaux', en: 'Seals Catalogue', ha: 'Kundin Hatimai' },
  asma: { fr: 'Noms Divins Personnels', en: 'Personal Divine Names', ha: 'Sunayen Allah Na Musamman' },
  '99names': { fr: 'Les 99 Noms d\'Allah', en: '99 Names of Allah', ha: 'Sunayen Allah 99' },
  quran: { fr: 'Le Saint Coran', en: 'The Holy Quran', ha: 'Alkur\'ani Mai Girma' },
  tasbih: { fr: 'Tasbih Virtuel', en: 'Virtual Tasbih', ha: 'Carbi Na Zamani' },
  'daily-dhikr': { fr: 'Dhikr Quotidien', en: 'Daily Dhikr', ha: 'Zikirin Kullum' },
  planetary: { fr: 'Heures Planétaires', en: 'Planetary Hours', ha: 'Sa\'o\'in Taurari' },
  zakat: { fr: 'Calculateur de Zakat', en: 'Zakat Calculator', ha: 'Lissafin Zakka' },
  faraid: { fr: 'Calculateur de Faraid', en: 'Faraid Calculator', ha: 'Lissafin Gado' },
  dreams: { fr: 'Journal des Rêves', en: 'Dream Journal', ha: 'Fassarar Mafarki' },
  halaqat: { fr: 'Cercles Spirituels (Halaqat)', en: 'Spiritual Circles', ha: 'Majalisar Zikiri' },
  'personal-wird': { fr: 'Wird Personnel', en: 'Personal Wird', ha: 'Wirdin Kanka' },
  'lunar-mansions': { fr: 'Demeures Lunaires', en: 'Lunar Mansions', ha: 'Manazilin Wata' },
  'spiritual-compatibility': { fr: 'Compatibilité Spirituelle', en: 'Spiritual Compatibility', ha: 'Daidaiton Ruhani' },
  'ilm-jafar': { fr: 'Science de Ja\'far', en: 'Ilm al-Ja\'far', ha: 'Ilmin Ja\'afar' },
  'grand-oaths': { fr: 'Les Grands Serments', en: 'Grand Oaths', ha: 'Rantsuwoyi Masu Girma' },
  elemental: { fr: 'Analyse des Éléments', en: 'Elemental Analysis', ha: 'Binciken Sinadarai' },
  geomancy: { fr: 'Géomancie (Ilm ar-Raml)', en: 'Geomancy', ha: 'Ilmin Ramli' },
  letters: { fr: 'Science des Lettres (Ilm al-Huruf)', en: 'Science of Letters', ha: 'Ilmin Haruffa' },
  rouhaniyya: { fr: 'Extraction de Rouhaniyya', en: 'Rouhaniyya Extraction', ha: 'Fitar da Ruhaniyya' },
  taksir: { fr: 'Générateur de Taksir', en: 'Taksir Generator', ha: 'Lissafin Taksir' },
  sirr: { fr: 'Sirr al-Asrar (Secrets Inviolables)', en: 'Secret of Secrets', ha: 'Sirrin Sirrika' },
  zairja: { fr: 'Oracles de la Zairja', en: 'Zairja Oracle', ha: 'Zairja' },
  'ring-pendant-talisman': { fr: 'Gravure Talismanique', en: 'Talismanic Engraving', ha: 'Zanen Zobba da Layoyi' },
  'combustion-eclipse': { fr: 'Combustion & Éclipses', en: 'Combustion & Eclipses', ha: 'Kusufi da Hadura' },
  khatim: { fr: 'Générateur de Khatim (Wafq)', en: 'Khatim Generator (Wafq)', ha: 'Zanen Hatimi (Wafqi)' },
  talsam: { fr: 'Générateur de Talsam', en: 'Talsam Generator', ha: 'Zanen Dalsami' },
  istikhara: { fr: 'Consultation Istikhara', en: 'Istikhara Oracle', ha: 'Neman Zabi (Istikhara)' },
  khouddam: { fr: 'Noms des Khouddam', en: 'Khouddam Names', ha: 'Sunayen Khuddam' },
  awfaq: { fr: 'Carrés Magiques (Awfaq)', en: 'Magic Squares (Awfaq)', ha: 'Wafqodi Masu Girma' },
  'quranic-faal': { fr: 'Tirage Coranique (Fa\'al)', en: 'Quranic Divination', ha: 'Duba da Alkur\'ani' },
  'ia-rapprochements': { fr: 'IA Rapprochements Mystiques', en: 'AI Mystical Matches', ha: 'Hadawar AI ta Sirri' },
  dairah: { fr: 'Cercles Spirituels (Dairah)', en: 'Spiritual Circles (Dairah)', ha: 'Da\'irar Asrar' },
  'saah-ijabah': { fr: 'Heures d\'Exaucement (Sa\'ah al-Ijabah)', en: 'Hour of Acceptance', ha: 'Sa\'ar Karbar Addu\'a' },
  'seven-kings': { fr: 'Les 7 Rois Célestes', en: 'The 7 Celestial Kings', ha: 'Sarakuna 7 na Sama' },
  'quran-analogy': { fr: 'Correspondances Coraniques', en: 'Quranic Correspondences', ha: 'Alakar Ayoyi' },
  'zikr-levels': { fr: 'Niveaux d\'Élévation du Zikr', en: 'Zikr Elevation Levels', ha: 'Darajojin Zikiri' },
  'hijri-full-moon': { fr: 'Pleine Lune Hégirienne', en: 'Hijri Full Moon', ha: 'Cikakken Watan Musulunci' },
  'murid-journal': { fr: 'Journal du Mourid', en: 'Murid Spiritual Journal', ha: 'Littafin Muridi' },
  'al-buni-shams': { fr: 'Shams al-Ma\'arif (Al-Buni)', en: 'Shams al-Ma\'arif', ha: 'Shamsul Ma\'arif' },
  'rajma-charms': { fr: 'Bouclier de Rajma', en: 'Rajma Shield', ha: 'Garkuwar Rajma' },
  'sacred-books': { fr: 'Bibliothèque des Livres Sacrés', en: 'Sacred Books Library', ha: 'Dakin Karatu na Littattafan Asrar' },
  'diagnostic-protection': { fr: 'Diagnostic & Protection', en: 'Spiritual Diagnosis & Shield', ha: 'Bincike da Kariya' },
  'talismanic-geometry': { fr: 'Géométrie Talismanique', en: 'Talismanic Geometry', ha: 'Zane-zanen Kariya' },
  'talsams-extraction': { fr: 'Extraction Avancée de Talsams', en: 'Advanced Talsams', ha: 'Fitar da Dalsamai' },
  'astrological-elections': { fr: 'Élections Astrologiques', en: 'Astrological Elections', ha: 'Zaben Lokuta na Taurari' },
  'sacred-geography': { fr: 'Géographie Sacrée', en: 'Sacred Geography', ha: 'Wuraren Albarka' },
  'advanced-alchemy': { fr: 'Alchimie Spirituelle', en: 'Spiritual Alchemy', ha: 'Kimiyyar Ruhi' },
  'metaphysical-defense': { fr: 'Défense Métaphysique', en: 'Metaphysical Defense', ha: 'Garkuwar Ruhi' },
  'discretion-protection': { fr: 'Discrétion & Protection', en: 'Discretion & Concealment', ha: 'Rufin Asiri' },
  'anchoring-stability': { fr: 'Ancrage & Stabilité', en: 'Anchoring & Stability', ha: 'Daidaito da Nutsuwa' },
  'spiritual-hub': { fr: 'Hub Spirituel', en: 'Spiritual Hub', ha: 'Cibiyar Ruhi' },
  'thiebissaba-tradition': { fr: 'Tradition Thiébi-Ssaba', en: 'Thiebi-Ssaba Tradition', ha: 'Gadon Thiebi-Ssaba' },
  'high-precision-individualization': { fr: 'Individualisation Haute Précision', en: 'High Precision Individualization', ha: 'Kebancewa Mai Zurfi' },
  'divination-qurah': { fr: 'Tirage au Sort (Qur\'ah)', en: 'Divination Qur\'ah', ha: 'Kuri\'ar Asrar' },
  'ibn-arabi-seals': { fr: 'Sceaux d\'Ibn Arabi', en: 'Ibn Arabi Seals', ha: 'Hatimai na Ibn Arabi' },
  'advanced-geomancy': { fr: 'Géomancie Avancée', en: 'Advanced Geomancy', ha: 'Ramli Mai Zurfi' },
  'comparative-traditions': { fr: 'Traditions Comparées', en: 'Comparative Traditions', ha: 'Kwatanta Hanyoyi' },
  'lunar-cycles': { fr: 'Cycles Lunaires', en: 'Lunar Cycles', ha: 'Zagayowar Wata' },
  store: { fr: 'Boutique (Store)', en: 'Store / Shop', ha: 'Shago' },
  community: { fr: 'Communauté Spirituelle', en: 'Spiritual Community', ha: 'Al\'umma' },
  journal: { fr: 'Journal Intime', en: 'Spiritual Journal', ha: 'Littafin Rubutu' },
  quizz: { fr: 'Quiz Spirituel', en: 'Spiritual Quiz', ha: 'Tambayoyin Asrar' },
  lexique: { fr: 'Lexique Esotérique', en: 'Esoteric Lexicon', ha: 'Kamus na Asrar' },
  calendar: { fr: 'Calendrier Hégirien & Solaire', en: 'Hijri & Solar Calendar', ha: 'Kalandar Musulunci' },
  faq: { fr: 'Assistant FAQ', en: 'FAQ Assistant', ha: 'Tambayoyi da Amsoshi' }
};

export function getToolDisplayName(toolId: string, language: string = 'fr'): string {
  if (!toolId) return '';
  const cleanId = toolId.replace('tool_', '').replace('/tools/', '').trim();
  
  // 1. Try finding in tools data
  const toolItem = tools.find(t => t.id === cleanId || t.path === `/tools/${cleanId}`);
  if (toolItem?.title) {
    return toolItem.title;
  }

  // 2. Try finding in fallback mapping with requested language
  const entry = fallbackNames[cleanId];
  if (entry) {
    if (language === 'ha') return entry.ha || entry.fr;
    if (language === 'en') return entry.en || entry.fr;
    return entry.fr;
  }

  // 3. Clean up kebab-case or snake_case string if unknown
  return cleanId
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
