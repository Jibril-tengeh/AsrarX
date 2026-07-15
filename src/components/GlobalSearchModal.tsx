import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Book, HelpCircle, ChevronRight, Sparkles, Sliders, ShoppingBag, Users, MessageSquare, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getAsrarItems } from '../data/store';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query as fsQuery, where } from 'firebase/firestore';
import { asmaListData } from '../data/asmaListData';
import { getApiUrl } from '../lib/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: 'tools' | 'quran' | 'names';
  path: string;
  icon: React.ReactNode;
  keywords?: string[];
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [surahs, setSurahs] = useState<any[]>([]);
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load store products and community posts dynamically from Firestore
  useEffect(() => {
    const unsubStore = onSnapshot(collection(db, 'store_products'), (snap) => {
      setStoreProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      console.warn("Failed to fetch store products for global search:", err);
    });

    const q = fsQuery(collection(db, 'community_posts'), where('status', '==', 'approved'));
    const unsubCommunity = onSnapshot(q, (snap) => {
      setCommunityPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      console.warn("Failed to fetch community posts for global search:", err);
    });

    return () => {
      unsubStore();
      unsubCommunity();
    };
  }, []);

  // Keyboard shortcut / focus listener
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Fetch surahs for search indexing
  useEffect(() => {
    fetch(getApiUrl('/data/quran/surahs.json'))
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setSurahs(data.data);
        }
      })
      .catch((err) => console.warn('Failed to fetch surahs for search:', err));
  }, []);

  // Multi-language Tools List
  const getTools = (): SearchItem[] => {
    const isFr = language === 'fr';
    const isHa = language === 'ha';

    return [
      {
        id: 'abjad',
        title: isFr ? 'Calculateur Abjad' : isHa ? 'Mai lissafin Abjad' : 'Abjad Calculator',
        description: isFr 
          ? 'Calculez la valeur numérique mystique de vos noms et wirds.' 
          : isHa ? 'Ididdige adadin kowane suna ko zikiri.' : 'Calculate the mystic numerical value of your names and wirds.',
        category: 'tools',
        path: '/tools/abjad',
        icon: <span className="font-mono font-bold text-xs">١٢٣</span>,
        keywords: ['abjad', 'calculateur', 'calcul', 'valeur', 'numérique', 'chiffre', 'adad', 'number', 'math', 'numerology']
      },
      {
        id: 'personal-wird',
        title: isFr ? 'Noms Divins Personnels' : isHa ? 'Sunayen Allah na Keɓaɓɓu' : 'Personal Divine Names',
        description: isFr 
          ? 'Découvrez les Noms d\'Allah en résonance avec votre prénom et votre profil astral.' 
          : isHa ? 'Gano sunayen Allah da suka dace da sunanka.' : 'Discover the Divine Names of Allah in resonance with your name.',
        category: 'names',
        path: '/tools/personal-wird',
        icon: <Sparkles className="text-emerald-500" size={16} />,
        keywords: ['wird', 'perso', 'personal', 'nom', 'divin', 'prenom', 'astral', 'resonance', 'names', 'allah']
      },

      {
        id: 'dreams',
        title: isFr ? 'Journal des Rêves' : isHa ? 'Kundin Mafarkai' : 'Dream Journal',
        description: isFr 
          ? 'Interprétez et sauvegardez vos visions nocturnes selon la sagesse islamique.' 
          : isHa ? 'Fassarar mafarkai da adana su cikin sauƙi.' : 'Interpret and save your night visions according to Islamic dream wisdom.',
        category: 'tools',
        path: '/tools/dreams',
        icon: <span className="text-sm">🌙</span>,
        keywords: ['dreams', 'rêves', 'journal', 'vision', 'interprétation', 'mafarki', 'fassara']
      },
      {
        id: 'halaqat',
        title: isFr ? 'Cercle de Zikr' : isHa ? 'Halaƙar Zikiri' : 'Zikr Circle',
        description: isFr 
          ? 'Créez ou rejoignez des cercles de prière collectifs en temps réel.' 
          : isHa ? 'Haɗu da wasu don yin zikiri tare a lokaci guda.' : 'Create or join real-time collective prayer and zikr circles.',
        category: 'tools',
        path: '/tools/halaqat',
        icon: <Users className="text-teal-500" size={16} />,
        keywords: ['zikr', 'circle', 'cercle', 'prière', 'halaqat', 'virtuel', 'communauté', 'dhikr']
      },
      {
        id: 'quran',
        title: isFr ? 'Coran Majeur' : isHa ? 'Alkur\'ani Mai Girma' : 'Holy Quran',
        description: isFr 
          ? 'Parcourez le Saint Coran avec traductions, audio et outils de recherche avancés.' 
          : isHa ? 'Karanta Alkur\'ani mai girma da fassara da sauti.' : 'Browse the Holy Quran with translations, audio, and advanced search tools.',
        category: 'quran',
        path: '/tools/quran',
        icon: <Book className="text-emerald-600" size={16} />,
        keywords: ['quran', 'coran', 'sourates', 'surah', 'versets', 'ayah', 'lecture', 'alkurani']
      },
      {
        id: 'zakat',
        title: isFr ? 'Calculateur Zakat' : isHa ? 'Lissafin Zakat' : 'Zakat Calculator',
        description: isFr 
          ? 'Estimez et calculez votre aumône légale sur la richesse de manière simplifiée.' 
          : isHa ? 'Ididdige zakar dukiya ko zinariya.' : 'Estimate and calculate your legal alms on wealth in a simplified way.',
        category: 'tools',
        path: '/tools/zakat',
        icon: <Sliders className="text-amber-600" size={16} />,
        keywords: ['zakat', 'calculateur', 'aumône', 'argent', 'or', 'richesse', 'lisse', 'calculator']
      },
      {
        id: 'tasbih',
        title: isFr ? 'Tasbih Interactif' : isHa ? 'Tasbih Mai Kyau' : 'Interactive Tasbih',
        description: isFr 
          ? 'Un compteur de zikr numérique avec retour haptique et thèmes spirituels.' 
          : isHa ? 'Hanyar lissafa salati ko zikiri ta waya.' : 'A digital zikr counter with haptic feedback and spiritual themes.',
        category: 'tools',
        path: '/tools/tasbih',
        icon: <span className="text-sm">📿</span>,
        keywords: ['tasbih', 'compteur', 'zikr', 'counter', 'salat', 'haptique']
      },
      {
        id: 'khatim',
        title: isFr ? 'Générateur de Awfaq & Khatim' : isHa ? 'Mai kera Hatimi' : 'Awfaq & Khatim Generator',
        description: isFr 
          ? 'Générez des carrés magiques (Muthallath, Murabba\') pour vos wirds.' 
          : isHa ? 'Kera hatimi daban-daban don ƙarfafa addu\'a.' : 'Generate magic squares (Muthallath, Murabba\') for your spiritual wirds.',
        category: 'tools',
        path: '/tools/khatim',
        icon: <span className="font-mono font-bold text-xs">⊞</span>,
        keywords: ['khatim', 'awfaq', 'carré magique', 'magic square', 'sceau', 'muthallath', 'murabba']
      },
      {
        id: 'talsam',
        title: isFr ? 'Générateur de Talsam' : isHa ? 'Talsam' : 'Talsam Generator',
        description: isFr 
          ? 'Créez des cryptogrammes de pouvoir spirituel basés sur les lettres arabes.' 
          : isHa ? 'Kera talsam na musamman don sirrin addu\'a.' : 'Create spiritual cryptograms of power based on Arabic letters.',
        category: 'tools',
        path: '/tools/talsam',
        icon: <Sparkles className="text-violet-500" size={16} />,
        keywords: ['talsam', 'cryptogramme', 'secret', 'lettres', 'arabe', 'mystique']
      }
    ];
  };

  // Local Wirds & Recettes & Secrets
  const getLocalAsrarItems = (): SearchItem[] => {
    try {
      const items = getAsrarItems();
      return items.map((item) => ({
        id: `asrar-${item.id}`,
        title: item.title,
        description: item.content || '',
        category: 'quran' as const, // Wirds & Recipes grouped under Quran
        path: `/secret/${item.id}`,
        icon: <Sparkles className="text-emerald-500" size={16} />,
        keywords: [item.title.toLowerCase(), item.content.toLowerCase(), item.category, 'wird', 'recette', 'secret']
      }));
    } catch (e) {
      console.warn("Error getting asrar items for search index:", e);
      return [];
    }
  };

  // Store/Boutique items
  const getStoreItems = (): SearchItem[] => {
    const isFr = language === 'fr';
    const list: SearchItem[] = [
      {
        id: 'store-general',
        title: isFr ? 'La Boutique Spirituelle' : 'Spiritual Boutique',
        description: isFr ? 'Bagues spirituelles, encens de purification, livres précieux et talismans.' : 'Spiritual rings, purification incense, precious books, and talismans.',
        category: 'tools',
        path: `/store?search=${encodeURIComponent(query)}`,
        icon: <ShoppingBag className="text-amber-500" size={16} />,
        keywords: ['store', 'boutique', 'bague', 'ring', 'encens', 'incense', 'livre', 'book', 'talisman', 'shop']
      }
    ];

    if (storeProducts.length > 0) {
      storeProducts.forEach(p => {
        list.push({
          id: `store-product-${p.id}`,
          title: p.name || p.title || '',
          description: isFr ? (p.description || '') : (p.description_en || p.description || ''),
          category: 'tools' as const,
          path: `/store`,
          icon: <ShoppingBag className="text-amber-500" size={16} />,
          keywords: [(p.name || '').toLowerCase(), (p.category || '').toLowerCase(), 'store', 'boutique', 'product', 'produit']
        });
      });
    }

    return list;
  };

  // Community Forum & Circles
  const getCommunityItems = (): SearchItem[] => {
    const isFr = language === 'fr';
    const list: SearchItem[] = [
      {
        id: 'community-general',
        title: isFr ? 'Forum de la Communauté' : 'Community Forum',
        description: isFr ? 'Partagez vos expériences spirituelles et rejoignez les discussions collectives.' : 'Share your spiritual experiences and join collective discussions.',
        category: 'tools',
        path: `/community?search=${encodeURIComponent(query)}`,
        icon: <Users className="text-blue-500" size={16} />,
        keywords: ['communauté', 'community', 'forum', 'discussion', 'partage', 'groupe', 'sujet']
      }
    ];

    if (communityPosts.length > 0) {
      communityPosts.forEach(post => {
        const cleanContent = (post.content || '').replace(/<[^>]+>/g, '');
        if (cleanContent.trim()) {
          list.push({
            id: `community-post-${post.id}`,
            title: `${post.authorName || 'Membre'} : ${cleanContent.substring(0, 40)}${cleanContent.length > 40 ? '...' : ''}`,
            description: cleanContent,
            category: 'tools' as const,
            path: `/community`,
            icon: <MessageSquare className="text-blue-400" size={16} />,
            keywords: [(post.authorName || '').toLowerCase(), cleanContent.toLowerCase(), 'post', 'communauté', 'message', 'forum']
          });
        }
      });
    }

    return list;
  };

  // 99 Names of Allah Index
  const getAsmaNames = (): SearchItem[] => {
    return asmaListData.map((name, idx) => ({
      id: `asma-name-${idx}`,
      title: `${name.tr} (${name.ar}) - ${name.fr}`,
      description: `Valeur Abjad: ${name.abjad} • Référence: ${name.ref}`,
      category: 'names' as const,
      path: `/tools/99names?search=${encodeURIComponent(name.tr)}`,
      icon: <Sparkles className="text-amber-500" size={16} />,
      keywords: [name.tr.toLowerCase(), name.ar, name.fr.toLowerCase(), name.abjad.toString(), '99 noms', 'asma', 'allah']
    }));
  };

  // Lexicon / Definitions
  const getLexicons = (): SearchItem[] => {
    const isFr = language === 'fr';
    const isHa = language === 'ha';

    const defaultItems = [
      { term: 'Alif (أ)', category: isFr ? 'Lettres' : isHa ? 'Haruffa' : 'Letters', desc: isFr ? "Première lettre de l'alphabet arabe. Sa valeur numérique est 1. Elle symbolise l'Unicité Divine (Tawhid)." : "Harafi na farko a haruffan Larabci. Adadinsa 1 ne. Yana nuna kadaita Allah." },
      { term: 'Ba\' (ب)', category: isFr ? 'Lettres' : isHa ? 'Haruffa' : 'Letters', desc: isFr ? "Deuxième lettre. Valeur numérique 2. Symbolise le commencement de la création." : "Harafi na biyu. Adadinsa 2 ne. Yana nuna farkon halitta." },
      { term: 'Ha\' (هـ)', category: isFr ? 'Lettres' : isHa ? 'Haruffa' : 'Letters', desc: isFr ? "Valeur numérique 5. Représente l'Essence Divine (Huwa)." : "Harafi mai adadin 5. Yana nuna zatun Allah (Huwa)." },
      { term: 'Zikr / Dhikr', category: isFr ? 'Concepts' : isHa ? 'Koyaswa' : 'Concepts', desc: isFr ? "Le 'rappel' ou 'l'invocation'. Répétition des Noms de Dieu." : "Ambton sunayen Allah don samun natsuwa da kusanci." },
      { term: 'Wird', category: isFr ? 'Concepts' : isHa ? 'Koyaswa' : 'Concepts', desc: isFr ? "Un exercice spirituel répété quotidiennement à des moments précis." : "Zikiri na musamman da ake maimaitawa kullum safe da yamma." },
      { term: 'Talsam', category: isFr ? 'Concepts' : isHa ? 'Koyaswa' : 'Concepts', desc: isFr ? "Formule mystique condensant une supplication spirituelle." : "Rubutu ko addu'a ta sirri don neman biyan bukata." },
      { term: 'Khatim', category: isFr ? 'Concepts' : isHa ? 'Koyaswa' : 'Concepts', desc: isFr ? "Un carré magique utilisé pour concentrer les énergies d'un verset." : "Hatimi mai adadi daban-daban don adana sirrin addu'a." }
    ];

    return defaultItems.map((item, idx) => ({
      id: `lexicon-${idx}`,
      title: item.term,
      description: item.desc,
      category: 'tools' as const, // Lexicons put under general Tools category
      path: `/explore/lexique?search=${encodeURIComponent(item.term)}`,
      icon: <HelpCircle className="text-amber-500" size={16} />,
      keywords: [item.term.toLowerCase(), item.category.toLowerCase(), 'lexique', 'lexicon', 'définition', 'concept']
    }));
  };

  // Compile unified index
  const getCompiledIndex = (): SearchItem[] => {
    const base = [
      ...getTools(),
      ...getLexicons(),
      ...getLocalAsrarItems(),
      ...getStoreItems(),
      ...getCommunityItems(),
      ...getAsmaNames(),
      ...surahs.map((s) => ({
        id: `surah-${s.number}`,
        title: `${s.number}. ${s.englishName} (${s.name})`,
        description: `${s.englishNameTranslation} • ${s.numberOfAyahs} ayahs • ${s.revelationType}`,
        category: 'quran' as const,
        path: `/tools/quran?surah=${s.number}`,
        icon: <Book className="text-emerald-500" size={16} />,
        keywords: [
          s.englishName.toLowerCase(),
          s.name.toLowerCase(),
          s.englishNameTranslation.toLowerCase(),
          s.number.toString(),
          s.revelationType.toLowerCase(),
          'quran',
          'coran',
          'sourate',
          'surah'
        ]
      }))
    ];

    if (query.trim() !== '') {
      base.push({
        id: 'quran-deep-search',
        title: language === 'fr' ? `Rechercher "${query}" dans le Coran entier` : `Search "${query}" in the entire Quran`,
        description: language === 'fr' ? 'Lancer une recherche approfondie de ce terme à travers tous les versets.' : 'Launch an in-depth search of this term across all verses.',
        category: 'quran' as const,
        path: `/tools/quran?search=${encodeURIComponent(query)}`,
        icon: <Search className="text-emerald-600" size={16} />,
        keywords: [query.toLowerCase(), 'quran', 'coran', 'recherche', 'search', 'entier', 'entire']
      });
    }

    return base;
  };

  // Offline Fuzzy Search scoring logic
  const getFuzzyScore = (item: SearchItem, searchStr: string): number => {
    const s = searchStr.toLowerCase().trim();
    if (!s) return 0;

    const title = item.title.toLowerCase();
    const desc = item.description.toLowerCase();
    let score = 0;

    // Exact matches
    if (title === s) score += 100;
    if (desc === s) score += 40;

    // Starts with matches
    if (title.startsWith(s)) score += 60;

    // Substring matches
    const titleIdx = title.indexOf(s);
    if (titleIdx !== -1) {
      score += 30 - (titleIdx * 0.5);
    }

    const descIdx = desc.indexOf(s);
    if (descIdx !== -1) {
      score += 15 - (descIdx * 0.1);
    }

    // Keyword matches
    if (item.keywords && item.keywords.length > 0) {
      for (const kw of item.keywords) {
        const kwLower = kw.toLowerCase();
        if (kwLower === s) score += 40;
        else if (kwLower.startsWith(s)) score += 20;
        else if (kwLower.includes(s)) score += 10;
      }
    }

    // Individual word matching for multi-word queries
    const words = s.split(/\s+/).filter(w => w.length > 1);
    if (words.length > 1) {
      let wordMatches = 0;
      for (const word of words) {
        if (title.includes(word)) {
          score += 15;
          wordMatches++;
        } else if (desc.includes(word)) {
          score += 5;
          wordMatches++;
        }
      }
      if (wordMatches === words.length) {
        score += 25;
      }
    }

    return score;
  };

  // Get matching results with fuzzy scoring
  const getSearchResults = (): SearchItem[] => {
    const all = getCompiledIndex();
    if (query.trim() === '') {
      // Return a set of default popular suggestions when empty
      return all.filter(item => 
        ['abjad', 'personal-wird', 'quran', 'tasbih'].includes(item.id) || item.id === 'surah-1' || item.id === 'surah-36'
      ).slice(0, 8);
    }

    return all
      .map(item => ({ item, score: getFuzzyScore(item, query) }))
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(entry => entry.item);
  };

  const matchedItems = getSearchResults();

  // Group matched results into Tools, Quran, Names
  const toolsResults = matchedItems.filter(item => item.category === 'tools');
  const quranResults = matchedItems.filter(item => item.category === 'quran');
  const namesResults = matchedItems.filter(item => item.category === 'names');

  const categoriesToDisplay = [
    { id: 'tools', title: language === 'fr' ? '🛠️ Outils & Services' : language === 'ha' ? '🛠️ Kayan Aiki' : '🛠️ Tools & Services', items: toolsResults },
    { id: 'quran', title: language === 'fr' ? '📖 Coran & Secrets' : language === 'ha' ? '📖 Alkur\'ani da Sirruka' : '📖 Quran & Secrets', items: quranResults },
    { id: 'names', title: language === 'fr' ? '✨ Noms Divins (Asma)' : language === 'ha' ? '✨ Sunayen Allah' : '✨ Divine Names (Asma)', items: namesResults }
  ].filter(cat => cat.items.length > 0);

  const handleItemSelect = (item: SearchItem) => {
    navigate(item.path);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 md:p-10 safe-area-pt">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Search Box Card */}
          <motion.div
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-950 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[85vh] sm:max-h-[75vh]"
          >
            {/* Search Input Header */}
            <div className="relative border-b border-gray-100 dark:border-gray-800 flex items-center px-4 sm:px-6 py-4">
              <Search className="text-gray-400 dark:text-gray-500 mr-3 shrink-0" size={22} />
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  language === 'fr'
                    ? 'Rechercher un outil, une sourate ou un concept...'
                    : language === 'ha'
                    ? 'Nemi kowane irin sirri, surah ko koyaswa...'
                    : 'Search for a tool, surah, or concept...'
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 text-base outline-none pr-8 font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-14 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all text-gray-400 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all text-gray-400 dark:text-gray-500 cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Results */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
              {query.trim() === '' && (
                <p className="text-xs font-black text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2">
                  {language === 'fr' ? 'Raccourcis Populaires' : language === 'ha' ? 'Hanyoyi Masu Sauri' : 'Popular Suggestions'}
                </p>
              )}

              {categoriesToDisplay.length > 0 ? (
                <div className="space-y-6">
                  {categoriesToDisplay.map((cat) => (
                    <div key={cat.id} className="space-y-2">
                      <div className="flex items-center justify-between px-2 py-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
                          {cat.title}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold dark:text-gray-600">
                          {cat.items.length} {cat.items.length > 1 ? 'résultats' : 'résultat'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-1.5">
                        {cat.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleItemSelect(item)}
                            className="w-full text-left flex items-start gap-3.5 p-3 sm:p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800/20 cursor-pointer group"
                          >
                            {/* Icon */}
                            <div className="shrink-0 w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:scale-105 transition-all">
                              {item.icon}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate">
                                {item.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                                {item.description}
                              </p>
                            </div>

                            <ChevronRight className="shrink-0 text-gray-300 dark:text-gray-700 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all self-center" size={16} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 mb-3">
                    <HelpCircle size={24} />
                  </div>
                  <h5 className="text-sm font-bold text-gray-900 dark:text-white">
                    {language === 'fr' ? 'Aucun résultat trouvé' : language === 'ha' ? 'Babu sakamako' : 'No results found'}
                  </h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                    {language === 'fr'
                      ? `Nous n'avons rien trouvé pour "${query}". Essayez d'autres mots.`
                      : language === 'ha'
                      ? `Ba mu sami komai ga "${query}" ba.`
                      : `We couldn't find anything for "${query}". Try different terms.`}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Tips Footer */}
            <div className="bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800/50 px-4 sm:px-6 py-3.5 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-600 font-medium">
              <span className="flex items-center gap-1">
                <Sparkles size={11} className="text-amber-500" />
                {language === 'fr' ? 'Recherche intelligente instantanée' : 'Instant smart search'}
              </span>
              <span>ESC pour fermer</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
