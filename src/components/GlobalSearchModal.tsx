import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Book, HelpCircle, ArrowRight, Sparkles, Sliders, ChevronRight, FileText, Zap, ShoppingBag, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getAsrarItems } from '../data/store';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: 'tools' | 'surah' | 'lexicon' | 'wird' | 'recette' | 'secret' | 'store' | 'community';
  path: string;
  icon: React.ReactNode;
  keywords?: string[];
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [surahs, setSurahs] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Fetch surahs for search indexing
  useEffect(() => {
    fetch('/data/quran/surahs.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setSurahs(data.data);
        }
      })
      .catch((err) => console.warn('Failed to fetch surahs for search:', err));
  }, []);

  // Multi-language Tools Index
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
        keywords: ['abjad', 'calculateur', 'calcul', 'valeur', 'numérique', 'chiffre', 'adad', 'number', 'math']
      },
      {
        id: 'asma',
        title: isFr ? 'Asma al-Husna (99 Noms)' : isHa ? 'Asma\'ul Husna (Suna 99)' : 'Asma al-Husna (99 Names)',
        description: isFr 
          ? 'Les 99 Noms sublimes d\'Allah, leurs poids Abjad et leurs secrets spirituels.' 
          : isHa ? 'Sunayen Allah 99 masu kyau da asiransu.' : 'The 99 beautiful Names of Allah, their Abjad weights and spiritual secrets.',
        category: 'tools',
        path: '/tools/asma',
        icon: <Sparkles className="text-amber-500" size={16} />,
        keywords: ['allah', 'asma', '99', 'noms', 'names', 'husna', 'divins', 'divine', 'secrets', 'suna']
      },
      {
        id: 'personal-wird',
        title: isFr ? 'Noms Divins Personnels' : isHa ? 'Sunayen Allah na Keɓaɓɓu' : 'Personal Divine Names',
        description: isFr 
          ? 'Découvrez les Noms d\'Allah en résonance avec votre prénom et votre profil astral.' 
          : isHa ? 'Gano sunayen Allah da suka dace da sunanka.' : 'Discover the Divine Names of Allah in resonance with your name.',
        category: 'tools',
        path: '/tools/personal-wird',
        icon: <Sparkles className="text-emerald-500" size={16} />,
        keywords: ['wird', 'perso', 'personal', 'nom', 'divin', 'prenom', 'astral', 'resonance']
      },
      {
        id: 'ruqyah',
        title: isFr ? 'Ruqyah & Protection' : isHa ? 'Ruqyah da Tsari' : 'Ruqyah & Protection',
        description: isFr 
          ? 'Ecoutez et lisez des versets de guérison et des invocations de protection spirituelle.' 
          : isHa ? 'Ayoyin waraka da kariya daga shafar aljani ko baki.' : 'Listen and read healing verses and spiritual protection prayers.',
        category: 'tools',
        path: '/tools/ruqyah',
        icon: <Sparkles className="text-blue-500" size={16} />,
        keywords: ['ruqyah', 'protection', 'guérison', 'shifa', 'roqya', 'mauvais oeil', 'sorcellerie', 'kariya', 'waraka']
      },
      {
        id: 'dreams',
        title: isFr ? 'Journal des Rêves' : isHa ? 'Kundin Mafarkai' : 'Dream Journal',
        description: isFr 
          ? 'Interprétez et sauvegardez vos visions nocturnes selon la sagesse islamique.' 
          : isHa ? 'Fassarar mafarkai da adana su cikin sauƙi.' : 'Interpret and save your night visions according to Islamic dream wisdom.',
        category: 'tools',
        path: '/tools/dreams',
        icon: <FileText className="text-purple-500" size={16} />,
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
        icon: <Sparkles className="text-teal-500" size={16} />,
        keywords: ['zikr', 'circle', 'cercle', 'prière', 'halaqat', 'virtuel', 'communauté', 'dhikr']
      },
      {
        id: 'quran',
        title: isFr ? 'Coran Majeur' : isHa ? 'Alkur\'ani Mai Girma' : 'Holy Quran',
        description: isFr 
          ? 'Parcourez le Saint Coran avec traductions, audio et outils de recherche avancés.' 
          : isHa ? 'Karanta Alkur\'ani mai girma da fassara da sauti.' : 'Browse the Holy Quran with translations, audio, and advanced search tools.',
        category: 'tools',
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
        icon: <Sparkles className="text-rose-500" size={16} />,
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
        category: item.category as any,
        path: `/user/dashboard?search=${encodeURIComponent(item.title)}`,
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
    return [
      {
        id: 'store-general',
        title: isFr ? 'La Boutique Spirituelle' : 'Spiritual Boutique',
        description: isFr ? 'Bagues spirituelles, encens de purification, livres précieux et talismans.' : 'Spiritual rings, purification incense, precious books, and talismans.',
        category: 'store',
        path: `/store?search=${encodeURIComponent(query)}`,
        icon: <ShoppingBag className="text-amber-500" size={16} />,
        keywords: ['store', 'boutique', 'bague', 'ring', 'encens', 'incense', 'livre', 'book', 'talisman', 'shop']
      },
      {
        id: 'store-ring',
        title: isFr ? 'Bague d\'Élévation Spirituelle' : 'Spiritual Elevation Ring',
        description: isFr ? 'Bague sacrée gravée d\'un awfaq pour la protection et la réussite.' : 'Sacred ring engraved with an awfaq for protection and success.',
        category: 'store',
        path: `/store?category=Bagues`,
        icon: <Sparkles className="text-amber-500" size={16} />,
        keywords: ['bague', 'ring', 'store', 'boutique', 'success', 'réussite', 'argent', 'protection']
      },
      {
        id: 'store-incense',
        title: isFr ? 'Encens Sirr Al Asrar' : 'Sirr Al Asrar Incense',
        description: isFr ? 'Encens de purification suprême pour ouvrir les ondes de prière.' : 'Supreme purification incense to open prayer waves.',
        category: 'store',
        path: `/store?category=Encens`,
        icon: <Zap className="text-amber-500" size={16} />,
        keywords: ['encens', 'incense', 'purification', 'spiritual', 'parfum', 'store', 'boutique']
      },
      {
        id: 'store-book',
        title: isFr ? 'Livre : Le Secret des Secrets' : 'Book: The Secret of Secrets',
        description: isFr ? 'Manuel complet des secrets de wirds, asma al-husna et awfaq.' : 'Complete handbook of wird secrets, asma al-husna, and awfaq.',
        category: 'store',
        path: `/store?category=Livres`,
        icon: <Book className="text-amber-500" size={16} />,
        keywords: ['livre', 'book', 'store', 'boutique', 'sirr', 'asrar', 'secret']
      }
    ];
  };

  // Community Forum & Circles
  const getCommunityItems = (): SearchItem[] => {
    const isFr = language === 'fr';
    return [
      {
        id: 'community-general',
        title: isFr ? 'Forum de la Communauté' : 'Community Forum',
        description: isFr ? 'Partagez vos expériences spirituelles et rejoignez les discussions collectives.' : 'Share your spiritual experiences and join collective discussions.',
        category: 'community',
        path: `/community?search=${encodeURIComponent(query)}`,
        icon: <Users className="text-blue-500" size={16} />,
        keywords: ['communauté', 'community', 'forum', 'discussion', 'partage', 'groupe', 'sujet']
      },
      {
        id: 'community-circles',
        title: isFr ? 'Cercles de Zikr Actifs' : 'Active Zikr Circles',
        description: isFr ? 'Rejoignez un groupe de zikr collectif en cours dans la communauté.' : 'Join an ongoing collective zikr group in the community.',
        category: 'community',
        path: `/tools/halaqat`,
        icon: <Users className="text-emerald-500" size={16} />,
        keywords: ['cercle', 'prière', 'zikr', 'halaqat', 'virtuel', 'communauté', 'dhikr']
      }
    ];
  };

  // Lexicon default list
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
      category: 'lexicon',
      path: `/explore/lexique?search=${encodeURIComponent(item.term)}`,
      icon: <HelpCircle className="text-amber-500" size={16} />,
      keywords: [item.term.toLowerCase(), item.category.toLowerCase(), 'lexique', 'lexicon', 'définition', 'concept']
    }));
  };

  // Compile search indexes
  const allItems: SearchItem[] = [
    ...getTools(),
    ...getLexicons(),
    ...getLocalAsrarItems(),
    ...getStoreItems(),
    ...getCommunityItems(),
    ...surahs.map((s) => ({
      id: `surah-${s.number}`,
      title: `${s.number}. ${s.englishName} (${s.name})`,
      description: `${s.englishNameTranslation} • ${s.numberOfAyahs} ayahs • ${s.revelationType}`,
      category: 'surah' as const,
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

  // Filtering logic
  const filteredItems = query.trim() === ''
    ? allItems.slice(0, 5) // Show popular items initially
    : allItems.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.keywords?.some((k) => k.includes(q))
        );
      });

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
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Search Box Card */}
          <motion.div
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-950 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[80vh] sm:max-h-[70vh]"
          >
            {/* Search Input Header */}
            <div className="relative border-b border-gray-100 dark:border-gray-800 flex items-center px-4 sm:px-6 py-4">
              <Search className="text-gray-400 dark:text-gray-500 mr-3" size={22} />
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
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all text-gray-400 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Scrollable Results */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-4">
              {query.trim() === '' && (
                <p className="text-xs font-black text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2">
                  {language === 'fr' ? 'Raccourcis Populaires' : language === 'ha' ? 'Hanyoyi Masu Sauri' : 'Popular Suggestions'}
                </p>
              )}

              {filteredItems.length > 0 ? (
                <div className="space-y-2">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemSelect(item)}
                      className="w-full text-left flex items-start gap-3.5 p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800/20 cursor-pointer group"
                    >
                      {/* Matching Icon */}
                      <div className="shrink-0 w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:scale-105 transition-all">
                        {item.icon}
                      </div>

                      {/* Info Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate">
                            {item.title}
                          </h4>
                          {/* Category Badge */}
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all ml-2">
                            {item.category === 'tools'
                              ? t('dashboard.advancedTools', 'Outils')
                              : item.category === 'surah'
                              ? 'Sourate'
                              : item.category === 'wird'
                              ? 'Wird'
                              : item.category === 'recette'
                              ? 'Recette'
                              : item.category === 'secret'
                              ? 'Secret'
                              : item.category === 'store'
                              ? 'Boutique'
                              : item.category === 'community'
                              ? 'Communauté'
                              : 'Lexique'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {item.description}
                        </p>
                      </div>

                      <ChevronRight className="shrink-0 text-gray-300 dark:text-gray-700 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all self-center" size={16} />
                    </button>
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
                      ? `Nous n'avons rien trouvé pour "${query}". Essayez un autre mot.`
                      : language === 'ha'
                      ? `Ba mu sami komai ga "${query}" ba.`
                      : `We couldn't find anything for "${query}". Try another word.`}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Tips Footer */}
            <div className="bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800/50 px-4 sm:px-6 py-3.5 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-600 font-medium">
              <span className="flex items-center gap-1">
                <Sparkles size={11} className="text-amber-500" />
                {language === 'fr' ? 'Astuce: Utilisez la recherche rapide' : 'Tip: Use fast search'}
              </span>
              <span>ESC pour fermer</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
