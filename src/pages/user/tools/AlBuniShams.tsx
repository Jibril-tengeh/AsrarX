import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Sparkles, Shield, Download, Feather, 
  Check, Info, Eye, Layers, Grid, Crown, RefreshCw, CheckCircle2, 
  Share2, Key, Compass, FileText, X, Zap, Lock, Star, Flame, Sun, 
  Moon, Search, Bookmark, Trash2, Clock, Calculator, Heart, ChevronRight,
  ChevronLeft, ChevronDown, ChevronUp, Book, Sliders, Filter, Sparkle,
  LayoutGrid, ListFilter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useFeatures } from '../../../contexts/FeatureContext';
import { db } from '../../../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { ParchmentExporterModal } from '../../../components/ParchmentExporterModal';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { SHAMS_SECRETS } from '../../../data/shamsSecrets';
import { BuniSystemsGrid } from '../../../components/BuniSystemsGrid';
import { AccessRestrictionModal, RestrictionType } from '../../../components/AccessRestrictionModal';
import { checkFeatureAccess } from '../../../utils/featureAccess';

// Types
export interface ShamsSecret {
  id: string;
  titleAr: string;
  titleFr: string;
  titleHa: string;
  titleEn: string;
  category: 'rizq' | 'hifz' | 'shifa' | 'mahabba' | 'kashf' | 'power' | 'huruf' | 'archangels' | 'jinn' | 'planets' | 'awfaq' | 'asma' | 'ayat' | string;
  element: 'fire' | 'air' | 'water' | 'earth';
  adad: number;
  wafqType: '3x3' | '4x4' | '7symbols' | 'talsam';
  divineNameAr: string;
  divineNamePhonetic: string;
  optimalTimeFr: string;
  optimalTimeEn?: string;
  optimalTimeHa?: string;
  incenseFr: string;
  incenseEn?: string;
  incenseHa?: string;
  descriptionFr: string;
  descriptionHa: string;
  descriptionEn: string;
  invocationAr: string;
  invocationPhonetic: string;
  invocationFr: string;
  invocationEn?: string;
  invocationHa?: string;
  stepsFr: string[];
  stepsEn?: string[];
  stepsHa?: string[];
}

export interface BuniChapter {
  id: string;
  numberAr: string;
  numberFr: string;
  numberEn?: string;
  numberHa?: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  titleHa: string;
  descriptionFr: string;
  descriptionAr: string;
  descriptionEn?: string;
  descriptionHa?: string;
  categoryKeys: string[];
  icon: React.ElementType;
  gradient: string;
  badgeBg: string;
  borderColor: string;
}

// 19 Chapters Structure of Shams al-Ma'arif al-Kubra
export const SHAMS_CHAPTERS: BuniChapter[] = [
  {
    id: 'chap-1-huruf',
    numberAr: 'الفصل الأول',
    numberFr: 'Chapitre I',
    numberEn: 'Chapter I',
    numberHa: 'Babi I',
    titleAr: 'أسرار الحروف المعجمة والطبائع الأربع',
    titleFr: 'Science des 28 Lettres & Natures Élémentaires',
    titleEn: 'Secrets of the 28 Letters & 4 Elemental Natures',
    titleHa: 'Sirrin Haruffa 28 da Muhallatai Hudu',
    descriptionFr: 'Étude des 28 lettres arabes, leurs poids Abjad (1 à 1000), leurs 4 éléments (Feu, Air, Eau, Terre) et les 14 Lettres Lumineuses (Hurūf Nūrāniyyah).',
    descriptionAr: 'في معرفة أسرار الحروف المعجمة وما لها من الأعداد والطبائع الأربع والحرارة والبرودة والرطوبة واليؤبسة.',
    descriptionEn: 'Study of the 28 Arabic letters, their Abjad values (1 to 1000), their 4 elements (Fire, Air, Water, Earth), and the 14 Luminous Letters (Hurūf Nūrāniyyah).',
    descriptionHa: 'Binciken haruffan Larabci 28, nauyin Abjad (1 zuwa 1000), muhallatai 4 (Wuta, Iska, Ruwa, Ƙasa) da Haroofi 14 masu Haske (Hurūf Nūrāniyyah).',
    categoryKeys: ['huruf'],
    icon: Feather,
    gradient: 'from-amber-600 via-orange-600 to-amber-700',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 'chap-2-asma',
    numberAr: 'الفصل الثاني',
    numberFr: 'Chapitre II',
    numberEn: 'Chapter II',
    numberHa: 'Babi II',
    titleAr: 'أسرار الأسماء الحسنى والاسم الأعظم',
    titleFr: 'Noms Divins & Le Grand Nom (Ism al-A\'zam)',
    titleEn: 'Divine Names & The Supreme Name (Ism al-A\'zam)',
    titleHa: 'Sirrin Sunaye Masu Kyau da Sunan Allah Mafi Girma',
    descriptionFr: 'Invocations et évocations des Plus Beaux Noms d\'Allah, leurs poids mystiques et les secrets d\'extraction théurgique du Sheikh Al-Buni.',
    descriptionAr: 'في أسرار الأسماء الحسنى والدعوات الشريفة واستخراج الأملاك العلوية والسفلية من أعدادها.',
    descriptionEn: 'Invocations and evocation of the Most Beautiful Names of Allah, their mystical weights, and Sheikh Al-Buni\'s theurgic extraction secrets.',
    descriptionHa: 'Addu\'o\'i da sunayen Allah masu kyau, nauyin asirinsu da sirrin fitarwa na Sheikh Al-Buni.',
    categoryKeys: ['asma', 'power'],
    icon: Crown,
    gradient: 'from-emerald-600 via-teal-600 to-amber-600',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    borderColor: 'border-emerald-500/30'
  },
  {
    id: 'chap-3-ayat',
    numberAr: 'الفصل الثالث',
    numberFr: 'Chapitre III',
    numberEn: 'Chapter III',
    numberHa: 'Babi III',
    titleAr: 'أسرار الآيات القرآنية والسور المباركة',
    titleFr: 'Versets de Pouvoir & Surates Bénies',
    titleEn: 'Verses of Power & Blessed Quranic Surahs',
    titleHa: 'Sirrin Ayoyin Kur\'ani da Surori Masu Albarka',
    descriptionFr: 'Utilisation spirituelle des versets coraniques de protection et d\'ouverture : Ayat al-Kursi, Yasin, Al-Fatiha, Al-Ikhlas, et Invocations majeures.',
    descriptionAr: 'في تصاريف الآيات الكريمة والسور العظيمة وما لها من الخواص والمنافع الجليلة.',
    descriptionEn: 'Spiritual use of Quranic verses for protection and opening: Ayat al-Kursi, Yasin, Al-Fatiha, Al-Ikhlas, and major invocations.',
    descriptionHa: 'Amfani da ayoyin Kur\'ani na kariya da bude kofa: Ayat al-Kursi, Yasin, Al-Fatiha, Al-Ikhlas, da manyan addu\'o\'i.',
    categoryKeys: ['ayat'],
    icon: BookOpen,
    gradient: 'from-cyan-600 via-teal-600 to-blue-700',
    badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    borderColor: 'border-cyan-500/30'
  },
  {
    id: 'chap-4-awfaq',
    numberAr: 'الفصل الرابع',
    numberFr: 'Chapitre IV',
    numberEn: 'Chapter IV',
    numberHa: 'Babi IV',
    titleAr: 'أسرار الأوفاق والخواتم الشريفة',
    titleFr: 'Carrés Magiques (Awfāq) & Sceaux Théurgiques',
    titleEn: 'Magic Squares (Awfāq) & Sacred Seals',
    titleHa: 'Sirrin Hatimai da Taswirori Masu Tsarki',
    descriptionFr: 'Les modèles des Carrés 3x3 (Ghazali), 4x4, les 7 Symboles du Sceau de Salomon (Khatam Sulaymani) et le tracé des talismans.',
    descriptionAr: 'في تركيب الأوفاق المثلثة والمربعة والسباعية والدوائر الشريفة وتنزيل الأعداد فيها.',
    descriptionEn: '3x3 (Ghazali) and 4x4 Magic Squares, the 7 Symbols of Solomon\'s Seal (Khatam Sulaymani), and talisman construction.',
    descriptionHa: 'Siffofin Hatimin Wafq 3x3 (Ghazali), 4x4, Alamu 7 na Hatimin Annabi Sulaiman da zanen laya.',
    categoryKeys: ['awfaq'],
    icon: Grid,
    gradient: 'from-purple-600 via-indigo-600 to-blue-700',
    badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 'chap-5-archangels',
    numberAr: 'الفصل الخامس',
    numberFr: 'Chapitre V',
    numberEn: 'Chapter V',
    numberHa: 'Babi V',
    titleAr: 'أسرار الملائكة المقربين والروحانيات',
    titleFr: 'Les 7 Archanges & Invocations Célestes',
    titleEn: 'The 7 Archangels & Celestial Invocations',
    titleHa: 'Sirrin Mala\'iku Hudu da Masu Girma',
    descriptionFr: 'Les 7 Invocations Majeures aux Archanges (Jibril, Mikail, Israfil, Azrail...) et leurs Khodams célestes régisseurs.',
    descriptionAr: 'في معرفة أسرار رؤساء الملائكة المقربين وأسماء العزائم والعهود الإلهية.',
    descriptionEn: 'The 7 Major Invocations to the Archangels (Jibril, Mikail, Israfil, Azrail...) and their ruling celestial Khodams.',
    descriptionHa: 'Manyan addu\'o\'i 7 ga Mala\'iku masu girma (Jibril, Mikail, Israfil, Azrail...) da Khadim na sama.',
    categoryKeys: ['archangels'],
    icon: Zap,
    gradient: 'from-blue-600 via-sky-600 to-indigo-700',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'chap-6-jinn',
    numberAr: 'الفصل السادس',
    numberFr: 'Chapitre VI',
    numberEn: 'Chapter VI',
    numberHa: 'Babi VI',
    titleAr: 'أسرار ملوك الجن السبعة ودعوات الأيام',
    titleFr: 'Les 7 Rois Spirituels & Serments des Jours',
    titleEn: 'The 7 Spiritual Kings & Daily Oaths',
    titleHa: "Sirrin Sarakuna 7 na Aljanu da Addu'o'in Ranaku",
    descriptionFr: 'Secrets des 7 Rois Spirituels (Al-Mudhib, Murrah, Al-Ahmar, Barqan, Shamhurash, Maimun, Zawba\'ah) et leurs talismans journaliers.',
    descriptionAr: 'في أسرار الملوك السبعة الأرضية ودعوات الأيام السبعة والعهود السليمانية.',
    descriptionEn: 'Secrets of the 7 Spiritual Kings (Al-Mudhib, Murrah, Al-Ahmar, Barqan, Shamhurash, Maimun, Zawba\'ah) and daily talismans.',
    descriptionHa: 'Sirrin Sarakunan Aljanu 7 na duniya da addu\'o\'in ranaku guda bakwai.',
    categoryKeys: ['jinn'],
    icon: Flame,
    gradient: 'from-rose-600 via-red-600 to-amber-700',
    badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    borderColor: 'border-rose-500/30'
  },
  {
    id: 'chap-7-planets',
    numberAr: 'الفصل السابع',
    numberFr: 'Chapitre VII',
    numberEn: 'Chapter VII',
    numberHa: 'Babi VII',
    titleAr: 'أسرار الكواكب والساعات الفلكية والبخور',
    titleFr: '7 Planètes, Heures Propices & Encens',
    titleEn: '7 Planets, Planetary Hours & Sacred Incense',
    titleHa: "Sirrin Taurari 7, Sa'o'in Ranaku da Turare",
    descriptionFr: 'Gouvernance des 7 planètes (Soleil, Lune, Mars, Mercure, Jupiter, Vénus, Saturne), leurs encens sacrés et heures d\'action.',
    descriptionAr: 'في معرفة طوالع الكواكب السبعة والساعات الفلكية وأنواع البخورات المنسوبة لها.',
    descriptionEn: 'Governance of the 7 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn), their sacred incenses, and propitious hours.',
    descriptionHa: 'Ikon taurari bakwai, turaren tsarki na musamman da sa\'o\'i masu kyau.',
    categoryKeys: ['planets'],
    icon: Sun,
    gradient: 'from-amber-500 via-yellow-600 to-orange-700',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 'chap-8-rizq',
    numberAr: 'الفصل الثامن',
    numberFr: 'Chapitre VIII',
    numberEn: 'Chapter VIII',
    numberHa: 'Babi VIII',
    titleAr: 'أبواب الرزق والجلب والبركة والنجاح',
    titleFr: 'Abondance, Fortune & Succès (Rizq)',
    titleEn: 'Abundance, Fortune & Success (Rizq)',
    titleHa: 'Maikun Dukiya, Buzu da Nasara (Rizq)',
    descriptionFr: 'Secrets théurgiques pour attirer la subsistance bénie, le succès commercial, la prospérité financière et le déblocage des affaires.',
    descriptionAr: 'في خواص جلب الرزق وتيسير الأسباب والبركة في التجارة والمال.',
    descriptionEn: 'Theurgic secrets for attracting blessed sustenance, commercial success, financial prosperity, and business unblocking.',
    descriptionHa: 'Sirrin asiri don samun arziƙi mai albarka, nasarar kasuwanci, da buɗe harkar kudi.',
    categoryKeys: ['rizq'],
    icon: Compass,
    gradient: 'from-emerald-500 via-teal-600 to-green-700',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    borderColor: 'border-emerald-500/30'
  },
  {
    id: 'chap-9-hifz',
    numberAr: 'الفصل التاسع',
    numberFr: 'Chapitre IX',
    numberEn: 'Chapter IX',
    numberHa: 'Babi IX',
    titleAr: 'أبواب الحفظ والتحصين ودفع الأعداء',
    titleFr: 'Boucliers Spirituels & Protection (Hifz)',
    titleEn: 'Spiritual Shields & Protection (Hifz)',
    titleHa: 'Kariya daga Mugayen Ido da Maitalu',
    descriptionFr: 'Invocations de protection absolue contre le mauvais œil, la sorcellerie (Sihr), la jalousie, les forces négatives et les ennemis.',
    descriptionAr: 'في أسرار التحصين الشريف والعوذات النبوية والدفع والدفاع ضد كل ذي شر.',
    descriptionEn: 'Invocations of absolute protection against evil eye, sorcery (Sihr), jealousy, negative entities, and enemies.',
    descriptionHa: 'Addu\'o\'in kariya daga mugun ido, sihiri, hassada da maƙiya.',
    categoryKeys: ['hifz'],
    icon: Shield,
    gradient: 'from-blue-700 via-indigo-700 to-slate-800',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'chap-10-shifa',
    numberAr: 'الفصل العاشر',
    numberFr: 'Chapitre X',
    numberEn: 'Chapter X',
    numberHa: 'Babi X',
    titleAr: 'أبواب الشفاء والطب الروحاني',
    titleFr: 'Guérison & Médecine Spirituelle (Shifā\')',
    titleEn: 'Healing & Spiritual Medicine (Shifā\')',
    titleHa: "Magunguna da Addu'o'in Samun Lafiya",
    descriptionFr: "Remèdes coraniques et invocations d'Al-Buni pour la guérison physique, le soulagement des maux de l'âme et la santé globale.",
    descriptionAr: 'في منافع الشفاء والطب الروحاني والأدعية المجربة لدفع الأمراض والأسقام.',
    descriptionEn: 'Quranic remedies and Al-Buni invocations for physical healing, emotional relief, and spiritual wellbeing.',
    descriptionHa: 'Magungunan Kur\'ani da addu\'o\'in Al-Buni don samun lafiyar jiki da ta ruhi.',
    categoryKeys: ['shifa'],
    icon: Heart,
    gradient: 'from-rose-500 via-pink-600 to-red-700',
    badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    borderColor: 'border-rose-500/30'
  },
  {
    id: 'chap-11-mahabba',
    numberAr: 'الفصل الحادي عشر',
    numberFr: 'Chapitre XI',
    numberEn: 'Chapter XI',
    numberHa: 'Babi XI',
    titleAr: 'أبواب المحبة والتأليف والوفاق',
    titleFr: 'Harmonie, Amour & Concorde (Mahabba)',
    titleEn: 'Harmony, Love & Reconciliation (Mahabba)',
    titleHa: 'Koyarda Soyayya da Zaman Lafiya',
    descriptionFr: 'Secrets d\'apaisement des cœurs, harmonie conjugale, réconciliation familiale et rayonnement d\'affection bienveillante.',
    descriptionAr: 'في أسرار التأليف بين القلوب والوئام والمحبة الشرعية وإصلاح ذات البين.',
    descriptionEn: 'Secrets for calming hearts, marital harmony, family reconciliation, and radiating loving kindness.',
    descriptionHa: 'Sirrin gyara tsakanin ma\'aurata, zaman lafiya a iyali da samun soyayya.',
    categoryKeys: ['mahabba'],
    icon: Sparkles,
    gradient: 'from-fuchsia-600 via-purple-600 to-pink-700',
    badgeBg: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30',
    borderColor: 'border-fuchsia-500/30'
  },
  {
    id: 'chap-12-kashf',
    numberAr: 'الفصل الثاني عشر',
    numberFr: 'Chapitre XII',
    numberEn: 'Chapter XII',
    numberHa: 'Babi XII',
    titleAr: 'أبواب الكشف والبصيرة والحكمة',
    titleFr: 'Élucidation, Clarvoyance & Illumination (Kashf)',
    titleEn: 'Illumination, Spiritual Vision & Insight (Kashf)',
    titleHa: 'Kashfi da Bude Hankali da Cikin Ruhi',
    descriptionFr: 'Pratiques de méditation contemplative (Muraqabah), purification du cœur, développement de l\'intuition et sagesse spirituelle.',
    descriptionAr: 'في أسرار رياضة القلوب والكشف عن الحقائق والبصيرة النورانية.',
    descriptionEn: 'Contemplative meditation practices (Muraqabah), heart purification, intuition enhancement, and spiritual wisdom.',
    descriptionHa: 'Ayyukan tunani da tsarkake zuciya, buɗe basira da hikimar ruhi.',
    categoryKeys: ['kashf'],
    icon: Eye,
    gradient: 'from-violet-600 via-indigo-700 to-purple-900',
    badgeBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30',
    borderColor: 'border-violet-500/30'
  },
  {
    id: 'chap-13-prophets',
    numberAr: 'الفصل الثالث عشر',
    numberFr: 'Chapitre XIII',
    numberEn: 'Chapter XIII',
    numberHa: 'Babi XIII',
    titleAr: 'أسرار الأنبياء عليهم السلام والتوسلات الشريفة',
    titleFr: 'Secrets des Figures Prophétiques (227 - 234)',
    titleEn: 'Secrets of the Prophetic Figures (227 - 234)',
    titleHa: 'Sirrin Annabawa Masu Daraja (227 - 234)',
    descriptionFr: 'Invocations théurgiques, sceaux et vertus transmis par les grands Prophètes : Adam, Nuh, Ibrahim, Yusuf, Musa, Sulayman, Isa et Sayyidina Muhammad (SAW).',
    descriptionAr: 'في أسرار الأنبياء والمرسلين والعهود الشريفة والتوسلات المستجابة.',
    descriptionEn: 'Theurgic invocations, seals, and virtues handed down by the Prophets: Adam, Noah, Abraham, Joseph, Moses, Solomon, Jesus, and Prophet Muhammad (PBUH).',
    descriptionHa: 'Addu\'o\'in asiri, hatimai da falalar Annabawa: Adam, Nuh, Ibrahim, Yusuf, Musa, Sulayman, Isa da Sayyidina Muhammad (SAW).',
    categoryKeys: ['prophets'],
    icon: Star,
    gradient: 'from-amber-600 via-yellow-600 to-emerald-700',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 'chap-14-theurgy',
    numberAr: 'الفصل الرابع عشر',
    numberFr: 'Chapitre XIV',
    numberEn: 'Chapter XIV',
    numberHa: 'Babi XIV',
    titleAr: 'علم التكسير والزايرجة والأرقام والتبخير',
    titleFr: 'Pratiques Avancées de la Théurgie & Taksir (235 - 242)',
    titleEn: 'Advanced Theurgy & Taksir Permutations (235 - 242)',
    titleHa: 'Sirrin Taksir da Za\'irajah da Turaruka (235 - 242)',
    descriptionFr: 'L\'art d\'entrelacement des lettres (Taksir), calculs de l\'Adad, la Za\'irajah des cercles, les écritures angéliques, la consécration par le feu, l\'eau et les nœuds.',
    descriptionAr: 'في علوم التكسير وتداخل الأسماء والزايرجة الفلكية وتنزيل الأرقام في الأوفاق.',
    descriptionEn: 'The art of letter permutation (Taksir), Adad computations, Za\'irajah circles, angelic scripts, and element consecrations.',
    descriptionHa: 'Fannin Taksir na haroofi, lissafin Adad, Za\'irajah da hanyoyin kunna laya.',
    categoryKeys: ['theurgy'],
    icon: Layers,
    gradient: 'from-indigo-600 via-purple-600 to-slate-800',
    badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    borderColor: 'border-indigo-500/30'
  },
  {
    id: 'chap-15-maqamat',
    numberAr: 'الفصل الخامس عشر',
    numberFr: 'Chapitre XV',
    numberEn: 'Chapter XV',
    numberHa: 'Babi XV',
    titleAr: 'المقامات الروحية وتصفية الباطن والأخلاق',
    titleFr: 'Les Stations Soufies Maqamāt (243 - 250)',
    titleEn: 'The Sufi Spiritual Stations Maqamāt (243 - 250)',
    titleHa: 'Matakan Ruhi na Sufaye Maqamat (243 - 250)',
    descriptionFr: 'Cheminement intérieur de la purification du cœur : Tawbah, Wara\', Zuhd, Sabr, Shukr, Tawakkul, Rida et Mahabbah.',
    descriptionAr: 'في مقامات السلوك الروحي وتطهير القلوب والترقي في مراتب التوحيد والمعرفة.',
    descriptionEn: 'Inner spiritual journey of heart purification: Tawbah, Wara\', Zuhd, Sabr, Shukr, Tawakkul, Rida, and Mahabbah.',
    descriptionHa: 'Tafiyar zuciya don samun tsarki: Tubar gaskiya, Tsoron Allah, Hakuri, Godiya da Dogaro ga Allah.',
    categoryKeys: ['maqamat'],
    icon: Sparkles,
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    borderColor: 'border-emerald-500/30'
  },
  {
    id: 'chap-16-huruf-angels',
    numberAr: 'الفصل السادس عشر',
    numberFr: 'Chapitre XVI',
    numberEn: 'Chapter XVI',
    numberHa: 'Babi XVI',
    titleAr: 'الملائكة الموكلون بحروف المعجم الثمانية والعشرين',
    titleFr: 'Les 28 Anges Régents des Lettres (251 - 278)',
    titleEn: 'The 28 Angel Regents of the Letters (251 - 278)',
    titleHa: 'Mala\'iku 28 Masu Lura da Haruffa (251 - 278)',
    descriptionFr: 'Invocations, adjurations et secrets des 28 anges célestes gouvernant chaque lettre de l\'alphabet sacré Abjad (de Hatyail pour Alif à Ghaynyail pour Ghayn).',
    descriptionAr: 'في أسرار الدعوات والأسماء والملائكة الموكلين بتصاريف الحروف.',
    descriptionEn: 'Invocations, adjurations, and secrets of the 28 celestial angels governing each letter of the sacred Abjad alphabet (from Hatyail for Alif to Ghaynyail for Ghayn).',
    descriptionHa: 'Addu\'o\'i da sirrin Mala\'ikun sama 28 masu kiyaye haruffan Abjad (daga Hatyail na Alif zuwa Ghaynyail na Ghayn).',
    categoryKeys: ['huruf_angels', 'archangels', 'huruf'],
    icon: Crown,
    gradient: 'from-amber-600 via-yellow-600 to-amber-800',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 'chap-17-seals',
    numberAr: 'الفصل السابع عشر',
    numberFr: 'Chapitre XVII',
    numberEn: 'Chapter XVII',
    numberHa: 'Babi XVII',
    titleAr: 'الخواتم والطلاسم التاريخية الشريفة',
    titleFr: 'Sceaux Historiques & Talismans Majeurs (279 - 286)',
    titleEn: 'Historical Seals & Major Talismans (279 - 286)',
    titleHa: 'Hatiman Tarihi da Talsamaye (279 - 286)',
    descriptionFr: 'Les grands sceaux et diagrammes sacrés : Sceau de l\'Étoile, Khatim al-Ard, Carré des 5 Noms, Bouclier de Ghazali, Sceau du Dragon et Sceau du Lion.',
    descriptionAr: 'في أسرار الخواتم العلوية والرموز الشريفة للحفظ والجاه والوقاية.',
    descriptionEn: 'Grand sacred seals and diagrams: Star Seal, Khatim al-Ard, Square of 5 Names, Ghazali Shield, Dragon Seal, and Lion Seal.',
    descriptionHa: 'Hatiman tarihi da zane-zane masu tsarki: Hatimin Tauraro, Khatim al-Ard, Wafq na Sunaye 5, Garkuwar Ghazali, Hatimin Maciji da Hatimin Zaki.',
    categoryKeys: ['historical_seals', 'awfaq'],
    icon: Shield,
    gradient: 'from-blue-600 via-indigo-600 to-slate-900',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'chap-18-elements',
    numberAr: 'الفصل الثامن عشر',
    numberFr: 'Chapitre XVIII',
    numberEn: 'Chapter XVIII',
    numberHa: 'Babi XVIII',
    titleAr: 'طبائع العناصر الأربعة والحروف النورانية والظلمانية',
    titleFr: 'Mécaniques Ésotériques des 4 Éléments (287 - 294)',
    titleEn: 'Esoteric Mechanics of the 4 Elements (287 - 294)',
    titleHa: 'Sirrin Abubuwa 4 da Haruffan Haske da Duhu (287 - 294)',
    descriptionFr: 'Principes d\'attraction et de répulsion des éléments (Feu, Air, Eau, Terre), l\'équilibre Mizan at-Tabi\'i, et le mystère des 14 Lettres Lumineuses et Sombres.',
    descriptionAr: 'في أسرار طبائع الحروف والتأليف بين العناصر والميزان الطبيعي.',
    descriptionEn: 'Principles of elemental attraction and repulsion (Fire, Air, Water, Earth), the Mizan at-Tabi\'i balance, and the 14 Luminous and Dark Letters.',
    descriptionHa: 'Ka\'idojin ja da korar muhallatai (Wuta, Iska, Ruwa, Ƙasa), ma\'aunin Mizan at-Tabi\'i, da asirin Haroofi 14 masu Haske da Duhu.',
    categoryKeys: ['elemental_mechanics', 'rules'],
    icon: Flame,
    gradient: 'from-orange-600 via-red-600 to-amber-700',
    badgeBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
    borderColor: 'border-orange-500/30'
  },
  {
    id: 'chap-19-warnings',
    numberAr: 'الفصل التاسع عشر',
    numberFr: 'Chapitre XIX',
    numberEn: 'Chapter XIX',
    numberHa: 'Babi XIX',
    titleAr: 'وصايا المؤلف وتحذيرات العلم وقواعد التقوى',
    titleFr: 'Avertissements, Règles & Éthique d\'Al-Buni (295 - 300)',
    titleEn: 'Author Warnings, Safety Rules & Spiritual Ethics (295 - 300)',
    titleHa: 'Kasidar Al-Buni da Dokokin Tsaro (295 - 300)',
    descriptionFr: 'Les règles de sécurité fondamentale du Sheikh Al-Buni : le piège de l\'Istidraj, le secret du silence (Kitman), le châtiment du mauvais usage et l\'Unité suprême (Tawhid).',
    descriptionAr: 'في تحذيرات المؤلف وقواعد التقوى والإخلاص وسر الكتمان والتوحيد.',
    descriptionEn: 'Fundamental safety rules of Sheikh Al-Buni: avoiding Istidraj, the secret of silence (Kitman), warnings against misuse, and Supreme Unity (Tawhid).',
    descriptionHa: 'Dokokin tsaro na Sheikh Al-Buni: kiyayewa daga Istidraj, sirrin yin shiru (Kitman), gargadin amfani da kuskure da Kadaitaka Allah (Tawhid).',
    categoryKeys: ['author_warnings', 'rules'],
    icon: Key,
    gradient: 'from-purple-700 via-violet-800 to-slate-900',
    badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    borderColor: 'border-purple-500/30'
  }
];

// Helper functions for localization
const getSecretTitle = (s: ShamsSecret, lang: string) => {
  if (lang === 'ha') return s.titleHa || s.titleFr;
  if (lang === 'en') return s.titleEn || s.titleFr;
  return s.titleFr;
};

const getSecretDescription = (s: ShamsSecret, lang: string) => {
  if (lang === 'ha') return s.descriptionHa || s.descriptionFr;
  if (lang === 'en') return s.descriptionEn || s.descriptionFr;
  return s.descriptionFr;
};

const getSecretInvocation = (s: ShamsSecret, lang: string) => {
  if (lang === 'ha') return s.invocationHa || s.invocationFr;
  if (lang === 'en') return s.invocationEn || s.invocationFr;
  return s.invocationFr;
};

const getSecretSteps = (s: ShamsSecret, lang: string) => {
  if (lang === 'ha') return s.stepsHa || s.stepsFr;
  if (lang === 'en') return s.stepsEn || s.stepsFr;
  return s.stepsFr;
};

const getSecretOptimalTime = (s: ShamsSecret, lang: string) => {
  if (lang === 'ha') return s.optimalTimeHa || s.optimalTimeFr;
  if (lang === 'en') return s.optimalTimeEn || s.optimalTimeFr;
  return s.optimalTimeFr;
};

const getSecretIncense = (s: ShamsSecret, lang: string) => {
  if (lang === 'ha') return s.incenseHa || s.incenseFr;
  if (lang === 'en') return s.incenseEn || s.incenseFr;
  return s.incenseFr;
};

const getChapterTitle = (chap: BuniChapter, lang: string) => {
  if (lang === 'ha') return chap.titleHa || chap.titleFr;
  if (lang === 'en') return chap.titleEn || chap.titleFr;
  return chap.titleFr;
};

const getChapterDescription = (chap: BuniChapter, lang: string) => {
  if (lang === 'ha') return chap.descriptionHa || chap.descriptionFr;
  if (lang === 'en') return chap.descriptionEn || chap.descriptionFr;
  return chap.descriptionFr;
};

const getChapterNumber = (chap: BuniChapter, lang: string) => {
  if (lang === 'ha') return chap.numberHa || chap.numberFr;
  if (lang === 'en') return chap.numberEn || chap.numberFr;
  return chap.numberFr;
};

// Abjad Map
const ABJAD_MAP: { [key: string]: number } = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1,
  'ب': 2, 'ت': 400, 'ث': 500, 'ج': 3, 'ح': 8, 'خ': 600,
  'د': 4, 'ذ': 700, 'ر': 200, 'ز': 7, 'س': 60, 'ش': 300,
  'ص': 90, 'ض': 800, 'ط': 9, 'ظ': 900, 'ع': 70, 'غ': 1000,
  'ف': 80, 'ق': 100, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50,
  'ه': 5, 'ة': 5, 'و': 6, 'ي': 10, 'ى': 10
};

export const AlBuniShams: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isPremium } = useAuth();
  const { featureToggles } = useFeatures();

  // Restriction Modal State
  const [restrictionModalOpen, setRestrictionModalOpen] = useState(false);
  const [restrictionType, setRestrictionType] = useState<RestrictionType>(null);
  const [restrictedFeatureName, setRestrictedFeatureName] = useState('');

  // Access check helper
  const verifyAndExecute = (featureId: string, featureName: string, action: () => void) => {
    const check = checkFeatureAccess(featureId, featureName, featureToggles, user, isPremium);
    if (check.allowed) {
      action();
    } else {
      setRestrictionType(check.restrictionType);
      setRestrictedFeatureName(check.featureName);
      setRestrictionModalOpen(true);
    }
  };
  
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<'buni_40_systems' | 'chapters' | 'compendium' | 'generator' | 'wafq_gallery' | 'huruf_table'>('buni_40_systems');
  const [chapterViewMode, setChapterViewMode] = useState<'grid' | 'reader'>('grid');
  
  // Chapter Selection States
  const [selectedChapterId, setSelectedChapterId] = useState<string>('chap-1-huruf');
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [readerChapterIndex, setReaderChapterIndex] = useState<number>(0);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedSecret, setSelectedSecret] = useState<ShamsSecret | null>(null);
  const [savedSecretIds, setSavedSecretIds] = useState<string[]>([]);
  
  // Generator states
  const [inputName, setInputName] = useState('');
  const [inputMother, setInputMother] = useState('');
  const [generatedData, setGeneratedData] = useState<any>(null);

  // Parchment Exporter Modal State
  const [isParchmentModalOpen, setIsParchmentModalOpen] = useState(false);
  const [parchmentExportTitle, setParchmentExportTitle] = useState('');
  const [parchmentExportSubtitle, setParchmentExportSubtitle] = useState('');
  const [parchmentExportContent, setParchmentExportContent] = useState<React.ReactNode>(null);

  // Load Saved Secrets
  useEffect(() => {
    const saved = localStorage.getItem('asrarhub_saved_buni_secrets');
    if (saved) {
      try {
        setSavedSecretIds(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    if (user) {
      const unsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.savedBuniSecrets && Array.isArray(data.savedBuniSecrets)) {
            setSavedSecretIds(data.savedBuniSecrets);
          }
        }
      });
      return () => unsub();
    }
  }, [user]);

  const toggleBookmark = (secretId: string) => {
    const isSaved = savedSecretIds.includes(secretId);
    let updated: string[];
    if (isSaved) {
      updated = savedSecretIds.filter(id => id !== secretId);
    } else {
      updated = [...savedSecretIds, secretId];
    }
    setSavedSecretIds(updated);
    localStorage.setItem('asrarhub_saved_buni_secrets', JSON.stringify(updated));

    if (user) {
      setDoc(doc(db, 'users', user.uid), { savedBuniSecrets: updated }, { merge: true }).catch(console.error);
    }
  };

  // Helper function to calculate Abjad
  const calculateAbjad = (text: string): number => {
    let total = 0;
    const clean = text.trim();
    for (let char of clean) {
      if (ABJAD_MAP[char]) {
        total += ABJAD_MAP[char];
      }
    }
    return total;
  };

  // Generator Calculation
  const handleGenerateAlBuni = () => {
    if (!inputName.trim()) {
      alert(t('shams.generator.emptyAlert', "Veuillez saisir au moins votre nom ou un mot-clé."));
      return;
    }

    const nameWeight = calculateAbjad(inputName);
    const motherWeight = inputMother.trim() ? calculateAbjad(inputMother) : 0;
    const totalWeight = nameWeight + motherWeight;

    // Derived Divine Name
    let recommendedDivineName = "يَا كَافِي يَا لَطِيفُ (129)";
    let divineNameAr = "يا لطيف";
    if (totalWeight % 4 === 1) {
      recommendedDivineName = "يَا غَنِيُّ يَا فَتَّاحُ (1089)";
      divineNameAr = "يا غني يا فتاح";
    } else if (totalWeight % 4 === 2) {
      recommendedDivineName = "يَا حَيُّ يَا قَيُّومُ (174)";
      divineNameAr = "يا حي يا قيوم";
    } else if (totalWeight % 4 === 3) {
      recommendedDivineName = "يَا وَدُودُ يَا رَحِيمُ (278)";
      divineNameAr = "يا ودود يا رحيم";
    }

    // Derived Khadim Name (Angel)
    const angelSuffix = "ئِيل";
    const derivedAngel = `شَمْسَـ${inputName.trim().slice(0, 3) || "عَزْ"}ـ${angelSuffix}`;

    // Wafq 3x3 Calculation
    let baseVal = Math.floor((totalWeight - 12) / 3);
    if (baseVal < 1) baseVal = 1;
    const remainder = (totalWeight - 12) % 3;

    const cells = [
      baseVal + 3, baseVal + 8, baseVal + 1,
      baseVal + 2, baseVal + 4, baseVal + 6,
      baseVal + 7, baseVal + 0, baseVal + 5
    ];

    if (remainder === 1) cells[6] += 1;
    if (remainder === 2) cells[6] += 2;

    const data = {
      name: inputName,
      mother: inputMother,
      nameWeight,
      motherWeight,
      totalWeight,
      angel: derivedAngel,
      divineNameAr,
      recommendedDivineName,
      wafq3x3Cells: cells,
      remainder
    };

    setGeneratedData(data);
  };

  // Helper to filter secrets belonging to a specific chapter
  const getSecretsByChapter = (chapter: BuniChapter) => {
    return SHAMS_SECRETS.filter(secret => {
      const isCategoryMatch = chapter.categoryKeys.includes(secret.category);
      if (!isCategoryMatch) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const title = getSecretTitle(secret, language).toLowerCase();
      const desc = getSecretDescription(secret, language).toLowerCase();
      return title.includes(q) || secret.titleAr.includes(q) || desc.includes(q);
    });
  };

  // General Filtered Secrets for Compendium View
  const compendiumSecrets = SHAMS_SECRETS.filter(secret => {
    const matchesCategory = selectedCategoryFilter === 'all' || secret.category === selectedCategoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const title = getSecretTitle(secret, language).toLowerCase();
    const desc = getSecretDescription(secret, language).toLowerCase();
    const matchesSearch = !q || 
      title.includes(q) || 
      secret.titleAr.includes(q) || 
      desc.includes(q);
    return matchesCategory && matchesSearch;
  });

  // Render Wafq Seal Grid for a Secret
  const renderSecretWafqSeal = (secret: ShamsSecret) => {
    const is4x4 = secret.wafqType === '4x4';
    const totalWeight = secret.adad || 66;

    if (is4x4) {
      let b = Math.floor((totalWeight - 30) / 4);
      if (b < 1) b = 1;
      const cells4x4 = [
        b + 16, b + 2, b + 3, b + 13,
        b + 5, b + 11, b + 10, b + 8,
        b + 9, b + 7, b + 6, b + 12,
        b + 4, b + 14, b + 15, b + 1
      ];

      return (
        <div className="p-3 bg-amber-50/90 dark:bg-amber-950/40 rounded-xl border-2 border-amber-800/40 text-center my-3">
          <div className="text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-2 uppercase tracking-wider font-sans">
            وفق خاتم {secret.divineNameAr || "الشريف"} المبارك (4x4 - العدد {secret.adad})
          </div>
          <div className="grid grid-cols-4 gap-1.5 max-w-[240px] mx-auto dir-rtl font-arabic font-extrabold text-amber-950 dark:text-amber-100 text-sm">
            {cells4x4.map((val, idx) => (
              <div key={idx} className="aspect-square flex items-center justify-center bg-amber-100/80 dark:bg-amber-900/40 border border-amber-800/30 rounded shadow-inner">
                {val}
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      let b = Math.floor((totalWeight - 12) / 3);
      if (b < 1) b = 1;
      const rem = (totalWeight - 12) % 3;
      const cells3x3 = [
        b + 3, b + 8, b + 1,
        b + 2, b + 4, b + 6,
        b + 7, b + 0, b + 5
      ];
      if (rem === 1) cells3x3[6] += 1;
      if (rem === 2) cells3x3[6] += 2;

      return (
        <div className="p-3 bg-amber-50/90 dark:bg-amber-950/40 rounded-xl border-2 border-amber-800/40 text-center my-3">
          <div className="text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-2 uppercase tracking-wider font-sans">
            وفق خاتم {secret.divineNameAr || "الشريف"} المبارك (3x3 - العدد {secret.adad})
          </div>
          <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto dir-rtl font-arabic font-extrabold text-amber-950 dark:text-amber-100 text-base">
            {cells3x3.map((val, idx) => (
              <div key={idx} className="aspect-square flex items-center justify-center bg-amber-100/80 dark:bg-amber-900/40 border border-amber-800/30 rounded shadow-inner">
                {val}
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  // Open Export Modal for a Secret
  const handleExportSecretParchment = (secret: ShamsSecret) => {
    const title = getSecretTitle(secret, language);
    const inv = getSecretInvocation(secret, language);
    const steps = getSecretSteps(secret, language);
    const time = getSecretOptimalTime(secret, language);
    const incense = getSecretIncense(secret, language);

    setParchmentExportTitle(title);
    setParchmentExportSubtitle(t('shams.parchment.subtitle', "Shams al-Ma'arif - Poids Mystique: {adad}").replace('{adad}', String(secret.adad)));
    setParchmentExportContent(
      <div className="space-y-6 text-center text-amber-950 font-serif p-4">
        <div className="border-b-2 border-amber-800/30 pb-4">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">كتاب شمس المعارف الكبرى</span>
          <h2 className="text-2xl font-bold text-amber-900 mt-1 dir-rtl">{secret.titleAr}</h2>
          <p className="text-sm italic text-amber-800 mt-1">{title}</p>
        </div>

        <div className="my-4 p-4 bg-amber-100/60 rounded-xl border border-amber-800/20">
          <span className="text-xs text-amber-800 font-bold block mb-1">الاسم والذكر المبارك</span>
          <p className="text-xl font-bold text-amber-950 dir-rtl font-arabic leading-relaxed">{secret.divineNameAr}</p>
          <p className="text-xs italic text-amber-800 mt-1">{secret.divineNamePhonetic}</p>
        </div>

        {renderSecretWafqSeal(secret)}

        <div className="space-y-2 text-right dir-rtl bg-amber-50/80 p-4 rounded-xl border border-amber-900/20">
          <span className="text-xs text-amber-800 font-bold block text-center dir-ltr">الدعوة والورد الشريف</span>
          <p className="text-lg font-bold text-amber-900 leading-loose font-arabic">{secret.invocationAr}</p>
        </div>

        <div className="text-left dir-ltr text-xs text-amber-900 leading-relaxed bg-amber-100/40 p-3 rounded-lg border border-amber-800/10">
          <strong className="block text-amber-950 mb-1 font-sans">{t('shams.parchment.translationHeading', 'Traduction & Application :')}</strong>
          <p className="mb-2">{inv}</p>
          <strong className="block text-amber-950 mb-1 font-sans mt-3">{t('shams.parchment.stepsHeading', 'Étapes du Rituel :')}</strong>
          <ul className="list-disc pl-4 space-y-1">
            {steps.map((st, idx) => (
              <li key={idx}>{st}</li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-amber-800/30 text-[10px] text-amber-800 flex justify-between items-center">
          <span>{t('shams.parchment.timeLabel', 'Heure :')} {time}</span>
          <span>{t('shams.parchment.incenseLabel', 'Encens :')} {incense}</span>
        </div>
      </div>
    );
    setIsParchmentModalOpen(true);
  };

  // Open Export Modal for Generator Result
  const handleExportGeneratedParchment = () => {
    if (!generatedData) return;

    setParchmentExportTitle(t('shams.parchment.genTitle', "Parchemin d'Extraction d'Al-Buni pour {name}").replace('{name}', generatedData.name));
    setParchmentExportSubtitle(t('shams.parchment.genSubtitle', "Poids total: {totalWeight} - Khadim: {angel}").replace('{totalWeight}', String(generatedData.totalWeight)).replace('{angel}', generatedData.angel));
    setParchmentExportContent(
      <div className="space-y-6 text-center text-amber-950 font-serif p-4">
        <div className="border-b-2 border-amber-800/30 pb-4">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">الاستخراج والوفق البوني المبارك</span>
          <h2 className="text-2xl font-bold text-amber-900 mt-1">{generatedData.name}</h2>
          <p className="text-xs text-amber-800 mt-1">
            Adad Nom ({generatedData.nameWeight}) {generatedData.mother ? `+ Adad Mère (${generatedData.motherWeight})` : ''} = <strong>{generatedData.totalWeight}</strong>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left dir-ltr text-xs">
          <div className="p-3 bg-amber-100/60 rounded-xl border border-amber-800/20">
            <span className="text-[10px] text-amber-800 font-bold uppercase block">{t('shams.parchment.divineNameBlock', 'Nom Divin Correspondant')}</span>
            <p className="text-sm font-bold text-amber-950 font-arabic dir-rtl">{generatedData.divineNameAr}</p>
          </div>
          <div className="p-3 bg-amber-100/60 rounded-xl border border-amber-800/20">
            <span className="text-[10px] text-amber-800 font-bold uppercase block">{t('shams.parchment.khadimBlock', 'Ange Céleste (Khadim)')}</span>
            <p className="text-sm font-bold text-amber-950 font-arabic dir-rtl">{generatedData.angel}</p>
          </div>
        </div>

        <div className="my-6">
          <span className="text-xs font-bold text-amber-900 block mb-3 uppercase tracking-wider">وفق المثلث الغزالي المستخرج</span>
          <div className="grid grid-cols-3 gap-1.5 max-w-[240px] mx-auto bg-amber-950 p-2 rounded-xl shadow-md border-2 border-amber-700">
            {generatedData.wafq3x3Cells.map((val: number, idx: number) => (
              <div key={idx} className="bg-amber-100/90 text-amber-950 font-bold text-sm h-12 flex items-center justify-center rounded border border-amber-800/30 font-mono">
                {val}
              </div>
            ))}
          </div>
        </div>

        <div className="text-left text-xs bg-amber-50 p-3 rounded-lg border border-amber-800/20">
          <strong className="block text-amber-900 mb-1">{t('shams.parchment.activationRules', "Règles d'Activation d'Al-Buni :")}</strong>
          <p className="text-amber-950 leading-relaxed">
            {t('shams.parchment.activationText', "Écrire ce Wafq à l'encre de safran et d'eau de rose durant l'heure favorable. Réciter le Nom Divin {divine} au nombre du poids Abjad ({weight}) au-dessus du Wafq.")
              .replace('{divine}', generatedData.recommendedDivineName)
              .replace('{weight}', String(generatedData.totalWeight))}
          </p>
        </div>
      </div>
    );
    setIsParchmentModalOpen(true);
  };

  const currentReaderChapter = SHAMS_CHAPTERS[readerChapterIndex];
  const currentReaderSecrets = currentReaderChapter ? getSecretsByChapter(currentReaderChapter) : [];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 safe-area-pt pb-28 w-full">
      
      {/* Header Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <Link 
            to="/tools" 
            className="p-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Crown size={12} />
                {t('shams.badge', 'Sheikh Ahmad Al-Buni')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1 flex items-center gap-2 font-serif">
              <BookOpen className="text-amber-600 dark:text-amber-400" size={24} />
              {t('shams.title', "Les Chapitres de Shams al-Ma'arif")}
            </h1>
          </div>
        </div>

        {/* Total Stats Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-amber-50 dark:bg-amber-950/40 px-3.5 py-1.5 rounded-2xl border border-amber-500/30">
          <Sparkles size={16} className="text-amber-500" />
          <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
            {SHAMS_SECRETS.length} {t('shams.statsSecrets', 'Secrets')} • 12 {t('shams.statsChapters', 'Chapitres')}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <ToolInfoTooltip 
          title={t('shams.tooltipTitle', "Secrets de Shams al-Ma'arif")}
          content={t('shams.tooltipContent', "Consultation structurée par chapitres des secrets authentiques de Shams al-Ma'arif al-Kubra (شمس المعارف الكبرى). Regroupe les 12 fiasal majeurs, les Awfaq, les Noms Divins, les Invocations et le Générateur Abjad.")}
        />
      </div>

      {/* Primary Animated Navigation Tabs */}
      <div className="relative bg-gray-100 dark:bg-gray-800/90 p-1.5 rounded-2xl mb-6 flex overflow-x-auto no-scrollbar shadow-inner">
        {[
          { id: 'buni_40_systems', featureId: 'shams_buni_40', label: t('shams.tabs.buni40Systems', '40 Systèmes Al-Buni'), icon: Crown },
          { id: 'chapters', featureId: 'shams_chapters', label: t('shams.tabs.chapters', '12 Chapitres'), icon: Book },
          { id: 'compendium', featureId: 'shams_secrets', label: t('shams.tabs.compendium', 'Tous les Secrets'), icon: BookOpen },
          { id: 'generator', featureId: 'shams_generator', label: t('shams.tabs.generator', 'Générateur Al-Buni'), icon: Sparkles },
          { id: 'wafq_gallery', featureId: 'shams_awfaq', label: t('shams.tabs.wafqGallery', 'Carrés & Sceaux'), icon: Grid },
          { id: 'huruf_table', featureId: 'shams_huruf', label: t('shams.tabs.hurufTable', '28 Lettres'), icon: Layers },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => verifyAndExecute(tab.featureId, tab.label, () => setActiveTab(tab.id as any))}
              className={`relative flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer z-10 ${
                isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activePrimaryTab"
                  className="absolute inset-0 bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-600 rounded-xl shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={16} className="relative z-10" />
              <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 0: 40 ADVANCED SYSTEMS OF AHMAD AL-BUNI */}
      {activeTab === 'buni_40_systems' && (
        <BuniSystemsGrid
          language={language}
          onExportParchment={(title, subtitle, content) => {
            verifyAndExecute('shams_parchment', 'Export Parchemin Sacré', () => {
              setParchmentExportTitle(title);
              setParchmentExportSubtitle(subtitle);
              setParchmentExportContent(content);
              setIsParchmentModalOpen(true);
            });
          }}
          onVerifyAndExecute={verifyAndExecute}
        />
      )}

      {/* TAB 1: 12 CHAPTERS (CHAPITRES DE SHAMS AL-MA'ARIF) */}
      {activeTab === 'chapters' && (
        <div className="space-y-6">

          {/* Chapter Mode Selector & Search Bar */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Mode Switcher Buttons */}
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
              <button
                onClick={() => setChapterViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  chapterViewMode === 'grid'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid size={14} />
                <span>{t('shams.chapterView.grid', 'Vue Catalogue')}</span>
              </button>

              <button
                onClick={() => setChapterViewMode('reader')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  chapterViewMode === 'reader'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <BookOpen size={14} />
                <span>{t('shams.chapterView.reader', 'Lecture par Chapitre')}</span>
              </button>
            </div>

            {/* Quick Filter Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300" size={16} />
              <input 
                type="text" 
                placeholder={t('shams.searchChapterPlaceholder', 'Filtrer les secrets d\'un chapitre...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-800 dark:text-gray-200"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Sticky Chapter Ribbon Selector */}
          <div className="sticky top-2 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-2 rounded-2xl border border-amber-500/20 shadow-md overflow-x-auto no-scrollbar flex items-center gap-2">
            {SHAMS_CHAPTERS.map((chap, idx) => {
              const secrets = getSecretsByChapter(chap);
              const isSelected = selectedChapterId === chap.id;
              const Icon = chap.icon;

              return (
                <button
                  key={chap.id}
                  onClick={() => {
                    setSelectedChapterId(chap.id);
                    setExpandedChapterId(chap.id);
                    setReaderChapterIndex(idx);
                  }}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap border ${
                    isSelected 
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md' 
                      : 'bg-gray-50 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-amber-400'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeChapterRibbon"
                      className="absolute inset-0 bg-gradient-to-r from-amber-600 to-emerald-600 rounded-xl"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10 text-[10px] opacity-80 font-arabic font-bold">{chap.numberAr}</span>
                  <Icon size={14} className="relative z-10 text-amber-800 dark:text-amber-300" />
                  <span className="relative z-10">{getChapterTitle(chap, language).split('&')[0]}</span>
                  <span className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-black/20 text-white' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    {secrets.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* MODE 1: GRID CATALOGUE OF CHAPTERS */}
          {chapterViewMode === 'grid' && (
            <div className="space-y-6">
              {SHAMS_CHAPTERS.map((chap, idx) => {
                const chapterSecrets = getSecretsByChapter(chap);
                const isExpanded = expandedChapterId === chap.id;
                const Icon = chap.icon;
                const savedInChapter = chapterSecrets.filter(s => savedSecretIds.includes(s.id)).length;

                return (
                  <motion.div
                    key={chap.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`bg-white dark:bg-gray-800/90 rounded-3xl border-2 ${chap.borderColor} shadow-sm overflow-hidden transition-all`}
                  >
                    {/* Chapter Header Banner */}
                    <div 
                      onClick={() => setExpandedChapterId(isExpanded ? null : chap.id)}
                      className={`p-5 sm:p-6 bg-gradient-to-r ${chap.gradient} text-white cursor-pointer relative overflow-hidden group flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-64 bg-white/5 skew-x-12 pointer-events-none group-hover:translate-x-2 transition-transform" />

                      <div className="flex items-start sm:items-center gap-4 relative z-10">
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white shadow-inner">
                          <Icon size={24} />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-arabic tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full text-white backdrop-blur-sm">
                              {chap.numberAr}
                            </span>
                            <span className="text-xs text-white/80 font-medium">
                              • {getChapterNumber(chap, language)}
                            </span>
                          </div>

                          <h2 className="text-lg sm:text-xl font-bold mt-1 dir-rtl font-arabic text-amber-100">
                            {chap.titleAr}
                          </h2>
                          <h3 className="text-sm font-semibold text-white/90">
                            {getChapterTitle(chap, language)}
                          </h3>
                        </div>
                      </div>

                      {/* Chapter Metadata & Expand Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 relative z-10 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                        <div className="text-right sm:text-left text-xs text-white/80">
                          <span className="block font-bold">{chapterSecrets.length} Secrets</span>
                          {savedInChapter > 0 && (
                            <span className="text-[10px] bg-amber-400/20 px-2 py-0.5 rounded-full font-bold text-amber-800 dark:text-amber-200">
                              ★ {savedInChapter} favori(s)
                            </span>
                          )}
                        </div>

                        <div className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>

                    {/* Chapter Description Bar */}
                    <div className="px-5 py-3 bg-amber-50/50 dark:bg-amber-950/20 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                      <p className="line-clamp-2 leading-relaxed">
                        {getChapterDescription(chap, language)}
                      </p>
                    </div>

                    {/* Expanded Chapter Secrets Grid */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 28 }}
                          className="p-4 sm:p-6 space-y-4"
                        >
                          {chapterSecrets.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-300 text-xs">
                              {t('shams.noSecretsFoundInChapter', "Aucun secret ne correspond à votre recherche dans ce chapitre.")}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {chapterSecrets.map((secret) => {
                                const isSaved = savedSecretIds.includes(secret.id);
                                const title = getSecretTitle(secret, language);
                                const desc = getSecretDescription(secret, language);

                                return (
                                  <motion.div
                                    key={secret.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -3 }}
                                    className="bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-200 dark:border-gray-700/70 p-4 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-sm"
                                  >
                                    <div>
                                      <div className="flex items-start justify-between gap-3 mb-2">
                                        <div>
                                          <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                            {t('shams.card.weight', 'Poids')}: {secret.adad} • {secret.element.toUpperCase()}
                                          </span>
                                          <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1.5">
                                            {title}
                                          </h4>
                                          <p className="text-xs font-bold text-amber-700 dark:text-amber-300 font-arabic dir-rtl mt-0.5">
                                            {secret.titleAr}
                                          </p>
                                        </div>

                                        <button
                                          onClick={() => toggleBookmark(secret.id)}
                                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                            isSaved 
                                              ? 'bg-amber-500 text-white border-amber-500' 
                                              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:text-amber-500'
                                          }`}
                                          title={isSaved ? "Retirer des favoris" : "Ajouter aux favoris"}
                                        >
                                          <Bookmark size={14} className={isSaved ? 'fill-current' : ''} />
                                        </button>
                                      </div>

                                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3 line-clamp-2">
                                        {desc}
                                      </p>

                                      <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700/50 mb-3 text-center dir-rtl">
                                        <p className="text-xs font-bold text-amber-900 dark:text-amber-200 font-arabic">
                                          {secret.divineNameAr}
                                        </p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-300 font-sans dir-ltr italic">
                                          {secret.divineNamePhonetic}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                                      <button
                                        onClick={() => setSelectedSecret(secret)}
                                        className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                                      >
                                        <Eye size={13} />
                                        <span>{t('shams.card.viewSecret', 'Consulter')}</span>
                                      </button>

                                      <button
                                        onClick={() => handleExportSecretParchment(secret)}
                                        className="p-1.5 bg-white dark:bg-gray-800 hover:bg-amber-500 hover:text-white text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 transition-all cursor-pointer"
                                        title={t('shams.card.exportParchment', 'Parchemin')}
                                      >
                                        <Download size={14} />
                                      </button>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* MODE 2: READER MODE (LIVRE NUMÉRIQUE PAR CHAPITRE) */}
          {chapterViewMode === 'reader' && currentReaderChapter && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-amber-500/30 p-6 sm:p-8 shadow-xl space-y-6"
            >
              {/* Reader Cover Header */}
              <div className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-r ${currentReaderChapter.gradient} text-white relative overflow-hidden text-center`}>
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                  {currentReaderChapter.numberFr} • {currentReaderChapter.numberAr}
                </span>

                <h2 className="text-2xl sm:text-3xl font-black font-arabic text-amber-100 my-3 dir-rtl leading-snug">
                  {currentReaderChapter.titleAr}
                </h2>

                <h3 className="text-lg font-bold text-white max-w-2xl mx-auto">
                  {getChapterTitle(currentReaderChapter, language)}
                </h3>

                <p className="text-xs text-white/80 max-w-xl mx-auto mt-2 leading-relaxed">
                  {currentReaderChapter.descriptionFr}
                </p>

                {/* Chapter Navigation Controls */}
                <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-white/20">
                  <button
                    disabled={readerChapterIndex === 0}
                    onClick={() => {
                      const newIdx = Math.max(0, readerChapterIndex - 1);
                      setReaderChapterIndex(newIdx);
                      setSelectedChapterId(SHAMS_CHAPTERS[newIdx].id);
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    <span>Précédent</span>
                  </button>

                  <span className="text-xs font-bold text-amber-800 dark:text-amber-200">
                    Chapitre {readerChapterIndex + 1} / {SHAMS_CHAPTERS.length}
                  </span>

                  <button
                    disabled={readerChapterIndex === SHAMS_CHAPTERS.length - 1}
                    onClick={() => {
                      const newIdx = Math.min(SHAMS_CHAPTERS.length - 1, readerChapterIndex + 1);
                      setReaderChapterIndex(newIdx);
                      setSelectedChapterId(SHAMS_CHAPTERS[newIdx].id);
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Suivant</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Secrets List inside Reader */}
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                  <BookOpen size={16} className="text-amber-500" />
                  <span>Secrets transmis dans ce chapitre ({currentReaderSecrets.length})</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentReaderSecrets.map((secret) => {
                    const isSaved = savedSecretIds.includes(secret.id);
                    return (
                      <div 
                        key={secret.id}
                        className="p-4 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                              Poids: {secret.adad}
                            </span>
                            <button
                              onClick={() => toggleBookmark(secret.id)}
                              className="text-gray-600 dark:text-gray-300 hover:text-amber-500"
                            >
                              <Bookmark size={14} className={isSaved ? 'fill-current text-amber-500' : ''} />
                            </button>
                          </div>
                          <h5 className="text-sm font-bold text-gray-900 dark:text-white">{getSecretTitle(secret, language)}</h5>
                          <p className="text-xs text-amber-700 dark:text-amber-300 font-arabic dir-rtl my-1">{secret.titleAr}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">{getSecretDescription(secret, language)}</p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-200/60 dark:border-gray-700 flex items-center gap-2">
                          <button
                            onClick={() => setSelectedSecret(secret)}
                            className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye size={13} />
                            <span>Consulter</span>
                          </button>
                          <button
                            onClick={() => handleExportSecretParchment(secret)}
                            className="p-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </div>
      )}

      {/* TAB 2: COMPENDIUM OF ALL SECRETS */}
      {activeTab === 'compendium' && (
        <div className="space-y-6">
          
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-800 p-3.5 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-sm">
            
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300" size={16} />
              <input 
                type="text" 
                placeholder={t('shams.searchPlaceholder', 'Rechercher un secret, nom, besoin...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0">
              {[
                { id: 'all', label: t('shams.categories.all', 'Tous') },
                { id: 'asma', label: t('shams.categories.asma', 'Noms Divins') },
                { id: 'ayat', label: t('shams.categories.ayat', 'Versets de Pouvoir') },
                { id: 'huruf', label: t('shams.categories.huruf', '28 Lettres') },
                { id: 'archangels', label: t('shams.categories.archangels', '7 Archanges') },
                { id: 'jinn', label: t('shams.categories.jinn', '7 Rois Jinns') },
                { id: 'planets', label: t('shams.categories.planets', '7 Planètes') },
                { id: 'awfaq', label: t('shams.categories.awfaq', '7 Awfaq') },
                { id: 'rizq', label: t('shams.categories.rizq', 'Rizq & Abondance') },
                { id: 'hifz', label: t('shams.categories.hifz', 'Protection & Hifz') },
                { id: 'shifa', label: t('shams.categories.shifa', 'Guérison') },
                { id: 'mahabba', label: t('shams.categories.mahabba', 'Amour & Paix') },
                { id: 'power', label: t('shams.categories.power', 'Puissance & Ism Azam') },
                { id: 'prophets', label: t('shams.categories.prophets', 'Prophtètes') },
                { id: 'theurgy', label: t('shams.categories.theurgy', 'Théurgie & Taksir') },
                { id: 'maqamat', label: t('shams.categories.maqamat', 'Stations Soufies') },
                { id: 'huruf_angels', label: t('shams.categories.huruf_angels', '28 Anges des Lettres') },
                { id: 'historical_seals', label: t('shams.categories.historical_seals', 'Sceaux Historiques') },
                { id: 'elemental_mechanics', label: t('shams.categories.elemental_mechanics', 'Mécaniques 4 Éléments') },
                { id: 'author_warnings', label: t('shams.categories.author_warnings', 'Règles & Avertissements') },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategoryFilter === cat.id 
                      ? 'bg-amber-500 text-white shadow-sm' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secrets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {compendiumSecrets.map((secret) => {
              const isSaved = savedSecretIds.includes(secret.id);
              const title = getSecretTitle(secret, language);
              const desc = getSecretDescription(secret, language);

              return (
                <div 
                  key={secret.id}
                  className="bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-100 dark:border-gray-700/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none" />

                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-500/20">
                          {t(`shams.categories.${secret.category}`, secret.category).toUpperCase()} • {t('shams.card.weight', 'Poids')}: {secret.adad}
                        </span>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1.5">
                          {title}
                        </h3>
                        <p className="text-sm font-bold text-amber-700 dark:text-amber-300 font-arabic dir-rtl mt-0.5">
                          {secret.titleAr}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleBookmark(secret.id)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          isSaved 
                            ? 'bg-amber-500 text-white border-amber-500' 
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:text-amber-500'
                        }`}
                        title={isSaved ? t('shams.card.removeFavorite', "Retirer des favoris") : t('shams.card.addFavorite', "Ajouter aux favoris")}
                      >
                        <Bookmark size={16} className={isSaved ? 'fill-current' : ''} />
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">
                      {desc}
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50 mb-4 text-center dir-rtl">
                      <span className="text-[10px] text-gray-600 dark:text-gray-300 dark:text-gray-300 block mb-1 dir-ltr font-sans uppercase font-bold">{t('shams.card.majorInvocations', 'Invocations majeures')}</span>
                      <p className="text-sm font-bold text-amber-900 dark:text-amber-200 font-arabic leading-snug">
                        {secret.divineNameAr}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-300 font-sans dir-ltr mt-0.5 italic">
                        {secret.divineNamePhonetic}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/60">
                    <button
                      onClick={() => setSelectedSecret(secret)}
                      className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Eye size={14} />
                      <span>{t('shams.card.viewSecret', 'Consulter le Secret')}</span>
                    </button>

                    <button
                      onClick={() => handleExportSecretParchment(secret)}
                      className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-amber-500 hover:text-white text-gray-700 dark:text-gray-300 rounded-xl transition-all cursor-pointer"
                      title={t('shams.card.exportParchment', 'Exporter en Parchemin')}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: AL-BUNI EXTRACTOR / GENERATOR */}
      {activeTab === 'generator' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-150 dark:border-gray-700 p-5 sm:p-7 shadow-sm space-y-6">
          <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-amber-500" size={20} />
              {t('shams.generator.title', "Générateur d'Extraction Abjad & Wafq (Istikhraj al-Buni)")}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
              {t('shams.generator.subtitle', "Saisissez votre Nom et celui de votre Mère (optionnel) pour extraire votre Poids numérique (Adad Total), le Nom Divin correspondant, le Khadim (Ange Céleste) et le Wafq 3x3 Ghazali.")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {t('shams.generator.nameLabel', 'Votre Nom en Arabe ou Français')}
              </label>
              <input 
                type="text" 
                placeholder={t('shams.generator.namePlaceholder', 'Ex: محمد / Mohamed')}
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                {t('shams.generator.motherLabel', 'Nom de la Mère (Optionnel)')}
              </label>
              <input 
                type="text" 
                placeholder={t('shams.generator.motherPlaceholder', 'Ex: حواء / Awa')}
                value={inputMother}
                onChange={(e) => setInputMother(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            onClick={() => verifyAndExecute('shams_generator', 'Générateur Théurgique Al-Buni', handleGenerateAlBuni)}
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 hover:from-amber-700 hover:to-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Calculator size={18} />
            <span>{t('shams.generator.calculateBtn', "Calculer & Extraire les Secrets d'Al-Buni")}</span>
          </button>

          {/* Generator Results Display */}
          {generatedData && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 bg-gradient-to-br from-amber-50/50 via-emerald-50/30 to-transparent dark:from-amber-950/20 dark:to-gray-900 border-2 border-amber-500/30 rounded-2xl space-y-5"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400">{t('shams.generator.resultHeader', "Résultat d'Extraction")}</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('shams.generator.totalWeightLabel', 'Poids Mystique Total (Adad) :')} <span className="text-amber-600 dark:text-amber-400 font-mono text-xl">{generatedData.totalWeight}</span>
                  </h3>
                </div>

                <button
                  onClick={handleExportGeneratedParchment}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>{t('shams.generator.downloadParchment', 'Télécharger en Parchemin')}</span>
                </button>
              </div>

              {/* Extraction Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700">
                  <span className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-300">{t('shams.generator.recommendedDivineName', 'Nom Divin Recommandé')}</span>
                  <p className="text-base font-bold text-amber-700 dark:text-amber-300 font-arabic dir-rtl mt-0.5">
                    {generatedData.recommendedDivineName}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700">
                  <span className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-300">{t('shams.generator.khadimRuhani', 'Khadim Rūhāni (Ange Céleste)')}</span>
                  <p className="text-base font-bold text-emerald-700 dark:text-emerald-300 font-arabic dir-rtl mt-0.5">
                    {generatedData.angel}
                  </p>
                </div>
              </div>

              {/* Generated Wafq 3x3 */}
              <div className="text-center">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block mb-3">
                  {t('shams.generator.wafqTitle', 'Carré Magique Wafq 3x3 (Al-Ghazali)')}
                </span>

                <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto bg-gray-900 dark:bg-black p-3 rounded-2xl shadow-lg border-2 border-amber-500/40">
                  {generatedData.wafq3x3Cells.map((cellVal: number, idx: number) => (
                    <div 
                      key={idx}
                      className="bg-amber-100 dark:bg-gray-800 text-amber-950 dark:text-amber-200 font-bold text-base h-12 flex items-center justify-center rounded-xl border border-amber-500/30 font-mono shadow-inner"
                    >
                      {cellVal}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-300 mt-2">
                  {t('shams.generator.wafqNote', "Chaque rangée, colonne et diagonale s'additionne exactement pour former l'équilibre du poids total.")}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* TAB 4: GALLERY OF CARRES & SECRETS */}
      {activeTab === 'wafq_gallery' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-150 dark:border-gray-700 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <Grid className="text-amber-500" size={20} />
              {t('shams.gallery.title', "Les Modèles Majeurs d'Awfaq & Sceaux de Shams al-Ma'arif")}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-300 mb-6">
              {t('shams.gallery.subtitle', "Aperçu visuel des figures fondamentales transmises par Sheikh Al-Buni pour le tracé des talismans et la méditation mystique.")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Ghazali 3x3 Card */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 bg-gray-50 dark:bg-gray-900/50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-600 bg-amber-100 dark:bg-amber-950/40 px-2 py-0.5 rounded">Ghazali 3x3</span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2">
                    {t('shams.gallery.ghazaliTitle', "Wafq Musallas (Carré 3x3 d'Équilibre)")}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {t('shams.gallery.ghazaliDesc', "La figure de base à 9 cases. La somme magique de chaque ligne est égale à 15 x Clé.")}
                  </p>

                  <div className="grid grid-cols-3 gap-1.5 max-w-[200px] mx-auto my-4 bg-amber-950 p-2 rounded-xl">
                    {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((num, i) => (
                      <div key={i} className="bg-amber-100 text-amber-950 font-bold text-sm h-10 flex items-center justify-center rounded font-mono">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-300 italic text-center">
                  {t('shams.gallery.ghazaliFooter', "Utilisé pour la prospérité, la mémoire et la protection contre l'adversité.")}
                </p>
              </div>

              {/* Solomon 7 Seals Card */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 bg-gray-50 dark:bg-gray-900/50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-600 bg-amber-100 dark:bg-amber-950/40 px-2 py-0.5 rounded">Khatam Sulaymani</span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2">
                    {t('shams.gallery.solomonTitle', "Les 7 Symboles du Sceau de Salomon")}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {t('shams.gallery.solomonDesc', "Combinaison théurgique des 7 figures planétaires et des Noms suprêmes.")}
                  </p>

                  <div className="flex items-center justify-center gap-2 my-5 text-2xl font-bold text-amber-600 dark:text-amber-400 font-arabic bg-white dark:bg-gray-800 p-3 rounded-xl border border-amber-500/20 shadow-inner">
                    <span>★</span>
                    <span>|||</span>
                    <span>م</span>
                    <span>┼</span>
                    <span>C</span>
                    <span>#</span>
                    <span>و</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-300 italic text-center">
                  {t('shams.gallery.solomonFooter', "Chaque symbole commande à l'une des 7 forces célestes quotidiennes.")}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 5: 28 LETTERS TABLE */}
      {activeTab === 'huruf_table' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-150 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
            <Layers className="text-amber-500" size={20} />
            {t('shams.huruf.title', "Les 28 Lettres Arabes & Natures Élémentaires (Tabā'i' al-Hurūf)")}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-300 mb-6">
            {t('shams.huruf.subtitle', "Classification classique d'Al-Buni reliant les lettres aux 4 éléments (Feu, Air, Eau, Terre) et aux 14 Lettres Lumineuses (Hurūf Nūrāniyyah).")}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-[11px] font-extrabold uppercase text-gray-600 dark:text-gray-300">
                  <th className="py-2.5 px-3">{t('shams.huruf.thLetter', 'Lettre')}</th>
                  <th className="py-2.5 px-3">{t('shams.huruf.thName', 'Nom')}</th>
                  <th className="py-2.5 px-3">{t('shams.huruf.thAbjad', 'Poids Abjad')}</th>
                  <th className="py-2.5 px-3">{t('shams.huruf.thElement', 'Élément')}</th>
                  <th className="py-2.5 px-3">{t('shams.huruf.thNature', 'Nature')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                {[
                  { char: 'ا', name: 'Alif', val: 1, elem: 'Feu', lum: true },
                  { char: 'ب', name: 'Ba', val: 2, elem: 'Air', lum: false },
                  { char: 'ج', name: 'Jim', val: 3, elem: 'Eau', lum: false },
                  { char: 'د', name: 'Dal', val: 4, elem: 'Terre', lum: false },
                  { char: 'ه', name: 'Ha', val: 5, elem: 'Feu', lum: true },
                  { char: 'و', name: 'Waw', val: 6, elem: 'Air', lum: false },
                  { char: 'ز', name: 'Zay', val: 7, elem: 'Eau', lum: false },
                  { char: 'ح', name: 'Ha', val: 8, elem: 'Terre', lum: true },
                  { char: 'ط', name: 'Ta', val: 9, elem: 'Feu', lum: true },
                  { char: 'ي', name: 'Ya', val: 10, elem: 'Air', lum: true },
                  { char: 'ك', name: 'Kaf', val: 20, elem: 'Eau', lum: true },
                  { char: 'ل', name: 'Lam', val: 30, elem: 'Terre', lum: true },
                  { char: 'م', name: 'Mim', val: 40, elem: 'Feu', lum: true },
                  { char: 'ن', name: 'Nun', val: 50, elem: 'Air', lum: true },
                  { char: 'س', name: 'Sin', val: 60, elem: 'Eau', lum: true },
                  { char: 'ع', name: 'Ayn', val: 70, elem: 'Terre', lum: true },
                  { char: 'ف', name: 'Fa', val: 80, elem: 'Feu', lum: false },
                  { char: 'ص', name: 'Sad', val: 90, elem: 'Air', lum: true },
                  { char: 'ق', name: 'Qaf', val: 100, elem: 'Eau', lum: true },
                  { char: 'ر', name: 'Ra', val: 200, elem: 'Terre', lum: true },
                  { char: 'ش', name: 'Shin', val: 300, elem: 'Feu', lum: false },
                  { char: 'ت', name: 'Ta', val: 400, elem: 'Air', lum: false },
                  { char: 'ث', name: 'Tha', val: 500, elem: 'Eau', lum: false },
                  { char: 'خ', name: 'Kha', val: 600, elem: 'Terre', lum: false },
                  { char: 'ذ', name: 'Dhal', val: 700, elem: 'Feu', lum: false },
                  { char: 'ض', name: 'Dad', val: 800, elem: 'Air', lum: false },
                  { char: 'ظ', name: 'Zha', val: 900, elem: 'Eau', lum: false },
                  { char: 'غ', name: 'Ghayn', val: 1000, elem: 'Terre', lum: false }
                ].map((item, idx) => {
                  const elemKey = item.elem === 'Feu' ? 'fire' : item.elem === 'Air' ? 'air' : item.elem === 'Eau' ? 'water' : 'earth';
                  return (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-2 px-3 font-bold text-amber-600 dark:text-amber-400 text-base font-arabic">{item.char}</td>
                      <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">{item.name}</td>
                      <td className="py-2 px-3 font-mono text-gray-700 dark:text-gray-300 font-bold">{item.val}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.elem === 'Feu' ? 'bg-red-100 text-red-600' :
                          item.elem === 'Air' ? 'bg-amber-100 text-amber-700' :
                          item.elem === 'Eau' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {t(`shams.huruf.${elemKey}`, item.elem)}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        {item.lum ? (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                            {t('shams.huruf.luminous', 'Lumineuse (Nūrāniyyah)')}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-600 dark:text-gray-300">{t('shams.huruf.standard', 'Standard')}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Secret Detail Modal */}
      <AnimatePresence>
        {selectedSecret && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-amber-500/30 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400">
                    Shams al-Ma'arif • {t('shams.card.weight', 'Poids')} {selectedSecret.adad}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                    {getSecretTitle(selectedSecret, language)}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedSecret(null)}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-4 text-xs sm:text-sm">
                
                {/* Arabic Title */}
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-500/20 text-center dir-rtl">
                  <p className="text-xl font-bold text-amber-900 dark:text-amber-200 font-arabic leading-relaxed">
                    {selectedSecret.titleAr}
                  </p>
                </div>

                {/* Invocations */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 text-center dir-rtl">
                  <span className="text-[10px] text-gray-600 dark:text-gray-300 uppercase font-bold block mb-1 dir-ltr">{t('shams.modal.sacredInvocation', "L'Invocation Sacrée")}</span>
                  <p className="text-base font-bold text-gray-900 dark:text-white font-arabic leading-loose">
                    {selectedSecret.invocationAr}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-sans dir-ltr mt-2 italic font-medium">
                    "{selectedSecret.invocationPhonetic}"
                  </p>
                </div>

                {/* Khatim / Wafq Seal */}
                {renderSecretWafqSeal(selectedSecret)}

                {/* Translation & Description */}
                <div>
                  <strong className="block text-gray-900 dark:text-white mb-1">{t('shams.modal.descriptionHeading', 'Description & Signification :')}</strong>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {getSecretDescription(selectedSecret, language)}
                  </p>
                </div>

                {/* Steps */}
                <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20">
                  <strong className="block text-amber-700 dark:text-amber-300 mb-2">{t('shams.modal.methodHeading', 'Méthode de Pratique & Riyada :')}</strong>
                  <ol className="list-decimal pl-4 space-y-1.5 text-gray-700 dark:text-gray-300">
                    {getSecretSteps(selectedSecret, language).map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ol>
                </div>

                {/* Time & Incense */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-xl">
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 font-bold block">{t('shams.modal.momentHeading', 'Moment Propice :')}</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{getSecretOptimalTime(selectedSecret, language)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 font-bold block">{t('shams.modal.incenseHeading', 'Encens Recommandé :')}</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{getSecretIncense(selectedSecret, language)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => {
                      const secret = selectedSecret;
                      setSelectedSecret(null);
                      handleExportSecretParchment(secret);
                    }}
                    className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download size={16} />
                    <span>{t('shams.modal.downloadBtn', "Télécharger le Parchemin d'Al-Buni")}</span>
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Parchment Exporter Modal */}
      <ParchmentExporterModal 
        isOpen={isParchmentModalOpen}
        onClose={() => setIsParchmentModalOpen(false)}
        title={parchmentExportTitle}
        subtitle={parchmentExportSubtitle}
        content={parchmentExportContent}
      />

      {/* Access Restriction Animated Pop-Up Modal */}
      <AccessRestrictionModal
        isOpen={restrictionModalOpen}
        onClose={() => setRestrictionModalOpen(false)}
        restrictionType={restrictionType}
        featureName={restrictedFeatureName}
        language={language}
      />

    </div>
  );
};

export default AlBuniShams;
