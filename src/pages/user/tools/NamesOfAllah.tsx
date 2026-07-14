import React, { useState } from 'react';
import { get, set } from 'idb-keyval';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ListTodo, ArrowLeft, Search, Info, BookOpen, PlayCircle, Grid, Sparkles, X, ChevronRight, Hash, ChevronDown, Eye, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { asmaListData } from '../../../data/asmaListData';
import { countsBenefitsTranslations } from '../../../data/countsBenefitsData';
import { asmaListDataTranslations } from '../../../data/asmaListDataTranslations';
import { getApiUrl } from '../../../lib/api';


// Helper to generate N x N Khatim / Magic Square (3x3 up to 10x10)
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

const generateKhatimGrid = (n: number, total: number): { grid: number[][] | null; error: string | null } => {
  const stdSum = (n * (n * n + 1)) / 2;
  if (total < stdSum) {
    return { 
      grid: null, 
      error: `La valeur abjad (${total}) est trop petite pour un Khatim de taille ${n}x${n}. Le minimum requis est ${stdSum}.` 
    };
  }

  const base = total - stdSum;
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
  return { grid: customGrid, error: null };
};

const khatimNamesMap: Record<number, string> = {
  3: 'Muthallath',
  4: 'Murabba\'',
  5: 'Mukhammas',
  6: 'Musaddas',
  7: 'Musabba\'',
  8: 'Muthamman',
  9: 'Mutassa\'',
  10: 'Mu\'ashshar'
};

const gridColsClassMap: Record<number, string> = {
  3: 'grid-cols-3 w-48 sm:w-64',
  4: 'grid-cols-4 w-60 sm:w-72',
  5: 'grid-cols-5 w-64 sm:w-80',
  6: 'grid-cols-6 w-72 sm:w-96',
  7: 'grid-cols-7 w-80 sm:w-[400px]',
  8: 'grid-cols-8 w-80 sm:w-[440px]',
  9: 'grid-cols-9 w-80 sm:w-[460px]',
  10: 'grid-cols-10 w-[340px] sm:w-[480px]',
};

const textPercentSizeMap: Record<number, string> = {
  3: 'text-lg sm:text-xl',
  4: 'text-sm sm:text-base',
  5: 'text-xs sm:text-sm',
  6: 'text-[11px] sm:text-xs',
  7: 'text-[10px] sm:text-[11px]',
  8: 'text-[9px] sm:text-[10px]',
  9: 'text-[8px] sm:text-[9px]',
  10: 'text-[8px] sm:text-[9px]',
};

const gridCellPaddingMap: Record<number, string> = {
  3: 'p-1.5 sm:p-2',
  4: 'p-1 sm:p-1.5',
  5: 'p-1',
  6: 'p-0.5 sm:p-1',
  7: 'p-0.5',
  8: 'p-0.5',
  9: 'p-0.5',
  10: 'p-0.5',
};

// Helper to return the Name in its pure Quranic form without "Ya" (يَا) prefix
const getZikrName = (arName: string) => {
  return arName;
};

// Helper to return the Name preceded by "Ya" (يَا) with proper Arabic rules
const getVocativeName = (arName: string) => {
  const clean = arName.trim();
  if (clean.includes("اللَّ") || clean.includes("الله")) {
    return "يَا الله";
  }
  const withoutAl = clean.replace(/^ال[َّْ]?/, "");
  return `يَا ${withoutAl}`;
};

const namesOfAllahDict = {
  fr: {
    loadingOccurrences: "Chargement de toutes les occurrences depuis le Coran...",
    offlineMode: "Mode hors ligne activé (Données de secours chargées)",
    propheticHadithFallback: "Ce Nom est traditionnellement dérivé du Hadith prophétique ou ne figure pas explicitement sous cette forme lexicale exacte directe dans le Coran."
  },
  en: {
    loadingOccurrences: "Loading all occurrences from the Quran...",
    offlineMode: "Offline mode activated (Fallback data loaded)",
    propheticHadithFallback: "This Name is traditionally derived from prophetic Hadith or does not appear explicitly in this exact direct lexical form in the Quran."
  },
  ha: {
    loadingOccurrences: "Ana loda duk wuraren da sunan ya bayyana daga Alƙur'ani...",
    offlineMode: "Yanayin offline yana aiki (An loda bayanan taimako)",
    propheticHadithFallback: "Wannan Sunan an samo shi ne daga Hadisin Annabi ko kuma bai bayyana a fili ba a cikin wannan lafazi na musamman a cikin Alƙur'ani."
  }
};

export const NamesOfAllah: React.FC = () => {
  const { t, language } = useLanguage();
  const dict = namesOfAllahDict[(language as 'fr' | 'en' | 'ha') || 'fr'] || namesOfAllahDict.fr;
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [viewState, setViewState] = useState<'list' | 'quran' | 'zikr' | 'khatim' | 'counts'>('list');
  const [activeName, setActiveName] = useState<typeof asmaListData[0] | null>(null);
  const [showOtherVerses, setShowOtherVerses] = useState(false);
  const [expandedVerseId, setExpandedVerseId] = useState<number | null>(null);
  
  // Zikr state
  const [zikrCount, setZikrCount] = useState(0);
  const [zikrTarget, setZikrTarget] = useState(0);
  const [textSize, setTextSize] = useState(14);
  const [khatimSize, setKhatimSize] = useState<number>(3);

  // Gamification hook on load
  React.useEffect(() => {
    let stats; try { stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}'); if (!stats || typeof stats !== 'object') stats = {}; } catch(e) { stats = {}; }
    stats.tools_used = (stats.tools_used || 0) + 1;
    localStorage.setItem('asrar_stats', JSON.stringify(stats));
  }, []);

  // AI Translation for activeName details
  const [translatedFields, setTranslatedFields] = useState<Record<string, any>>({});
  const [translatingName, setTranslatingName] = useState(false);

  React.useEffect(() => {
    if (!activeName || language === 'fr') {
      setTranslatedFields({});
      return;
    }

    // Check offline dictionary first
    if (asmaListDataTranslations && asmaListDataTranslations[activeName.tr]) {
      const trans = asmaListDataTranslations[activeName.tr][language as 'en' | 'ha'];
      if (trans) {
        setTranslatedFields({
          fr: trans.fr,
          ref: trans.ref,
          excerptFr: trans.excerptFr,
          context: trans.context
        });
        return;
      }
    }

    const cacheKey = `asrar_names_trans_${language}_${activeName.tr}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setTranslatedFields(JSON.parse(cached));
        return;
      }
    } catch (e) {
      console.warn("Error reading Name of Allah translation cache:", e);
    }

    const translateFields = async () => {
      setTranslatingName(true);
      try {
        const textsToTranslate = {
          fr: activeName.fr || '',
          ref: activeName.ref || '',
          excerptFr: activeName.quranOptions?.excerptFr || '',
          context: activeName.quranOptions?.context || ''
        };

        const res = await fetch(getApiUrl('/api/translate-text'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            texts: textsToTranslate,
            targetLanguage: language,
          }),
        });

        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data) {
            localStorage.setItem(cacheKey, JSON.stringify(data));
            setTranslatedFields(data);
          }
        } else {
          console.warn("[NamesOfAllah] Translation request failed or returned invalid content:", res.status);
        }
      } catch (err) {
        console.warn("[NamesOfAllah] Name of Allah translation warning:", err);
      } finally {
        setTranslatingName(false);
      }
    };

    translateFields();
  }, [activeName?.tr, language]);

  const getTranslatedMeaning = (nameItem: typeof asmaListData[0]) => {
    if (language === 'fr') return nameItem.fr;
    // Check offline dictionary first
    if (asmaListDataTranslations && asmaListDataTranslations[nameItem.tr]) {
      const trans = asmaListDataTranslations[nameItem.tr][language as 'en' | 'ha'];
      if (trans && trans.fr) return trans.fr;
    }
    try {
      const cached = localStorage.getItem(`asrar_names_trans_${language}_${nameItem.tr}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.fr) return parsed.fr;
      }
    } catch (e) {}
    return nameItem.fr;
  };

  const getTranslatedRef = (nameItem: typeof asmaListData[0]) => {
    if (language === 'fr') return nameItem.ref;
    // Check offline dictionary first
    if (asmaListDataTranslations && asmaListDataTranslations[nameItem.tr]) {
      const trans = asmaListDataTranslations[nameItem.tr][language as 'en' | 'ha'];
      if (trans && trans.ref) return trans.ref;
    }
    try {
      const cached = localStorage.getItem(`asrar_names_trans_${language}_${nameItem.tr}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.ref) return parsed.ref;
      }
    } catch (e) {}
    return nameItem.ref;
  };

  const [quranData, setQuranData] = useState<any[]>([]);
  const [loadingQuran, setLoadingQuran] = useState(true);

  // Online Quran search and detail states
  const [onlineOccurrences, setOnlineOccurrences] = useState<any[]>([]);
  const [loadingOnline, setLoadingOnline] = useState(false);
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [verseDetails, setVerseDetails] = useState<Record<string, { ar: string, fr: string, en: string, ha: string }>>({});
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(30);

  React.useEffect(() => {
    if (!activeName || viewState !== 'quran') {
      setOnlineOccurrences([]);
      setOnlineCount(null);
      return;
    }

    const fetchOnlineOccurrences = async () => {
      setLoadingOnline(true);
      try {
        const cleanArabicName = activeName.ar.replace(/[\u064B-\u065F\u0670]/g, '').replace(/\u0671/g, '\u0627');
        const url = `https://api.alquran.cloud/v1/search/${encodeURIComponent(cleanArabicName)}/all/quran-simple-clean`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json && json.code === 200 && json.data && Array.isArray(json.data.matches)) {
            const formatted = json.data.matches.map((m: any) => ({
              id: `${m.surah.number}:${m.numberInSurah}`,
              inSurah: m.numberInSurah,
              surahNumber: m.surah.number,
              surahName: m.surah.name,
              surahTransliteration: m.surah.englishName,
              ar: m.text,
            }));
            setOnlineOccurrences(formatted);
            setOnlineCount(json.data.count);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch online occurrences:", err);
      } finally {
        setLoadingOnline(false);
      }
    };

    fetchOnlineOccurrences();
  }, [activeName?.tr, viewState]);

  React.useEffect(() => {
    const loadQuranData = async () => {
      setLoadingQuran(true);
      try {
        // Try getting from IndexedDB cache
        const cached = await get('asrar_quran_full_json');
        if (cached && Array.isArray(cached)) {
          setQuranData(cached);
          setLoadingQuran(false);
          // If online, refresh cache in background
          if (navigator.onLine) {
            fetch(getApiUrl('/quran.json'))
              .then(res => res.json())
              .then(freshData => {
                if (Array.isArray(freshData)) {
                  set('asrar_quran_full_json', freshData);
                  setQuranData(freshData);
                }
              })
              .catch(e => console.warn("Background Quran fetch failed:", e));
          }
          return;
        }

        // Fetch from network
        const res = await fetch(getApiUrl('/quran.json'));
        if (!res.ok) throw new Error("Failed to fetch quran.json");
        const data = await res.json();
        if (Array.isArray(data)) {
          setQuranData(data);
          await set('asrar_quran_full_json', data);
        }
      } catch (err) {
        console.error("Failed to load offline or online Quran data in NamesOfAllah:", err);
      } finally {
        setLoadingQuran(false);
      }
    };
    loadQuranData();
  }, []);

  const realOccurrences = React.useMemo(() => {
    if (!activeName) return [];
    
    if (onlineOccurrences.length > 0) {
      return onlineOccurrences;
    }
    
    if (quranData.length === 0) {
      if (loadingQuran) return [];
      
      // Offline fallback mode
      const occurrences = [];
      if (activeName.quranOptions) {
        occurrences.push({
          id: `off-1-${activeName.tr}`,
          inSurah: parseInt(activeName.quranOptions.verse || "1"),
          ar: activeName.quranOptions.excerptAr || activeName.ar,
          fr: activeName.quranOptions.excerptFr || activeName.fr,
          en: asmaListDataTranslations?.[activeName.tr]?.en?.excerptFr || activeName.quranOptions.excerptFr || activeName.tr,
          ha: asmaListDataTranslations?.[activeName.tr]?.ha?.excerptFr || activeName.quranOptions.excerptFr || activeName.tr,
          surahName: activeName.quranOptions.surah || "Coran",
          surahTransliteration: activeName.quranOptions.surah || "Coran",
          surahNumber: 1
        });
      }
      
      const count = activeName.quranOptions?.count || 1;
      if (count > 1) {
        occurrences.push({
          id: `off-2-${activeName.tr}`,
          inSurah: 180,
          ar: "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا ۖ وَذَرُوا الَّذِينَ يُلْحِدُونَ فِي أَسْمَائِهِ",
          fr: "C'est à Allah qu'appartiennent les noms les plus beaux. Invoquez-Le par ces noms et laissez ceux qui profanent Ses noms.",
          en: "To Allah belong the best names, so invoke Him by them.",
          ha: "Kuma Allah yanã da sũnãye mãsu kyau ƙwarai, sai ku rũƙe Shi da sũ.",
          surahName: "Al-A'raf",
          surahTransliteration: "Al-A'raf",
          surahNumber: 7
        });
      }
      if (count > 10) {
        occurrences.push({
          id: `off-3-${activeName.tr}`,
          inSurah: 23,
          ar: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكِ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ",
          fr: "C'est Lui Allah. Nulle divinité autre que Lui, le Souverain, le Pur, l'Apaisant, le Rassurant, le Prédominant, le Tout-Puissant, le Contraignant, le Superbe.",
          en: "He is Allah, other than whom there is no deity, the Sovereign, the Pure, the Perfection, the Bestower of Faith.",
          ha: "Shĩ ne Allah, wanda bã bu wani abun bautãwa sai Shĩ, Mai mulki, Mai tsarki, Mai aminci, Mai amintarwa.",
          surahName: "Al-Hashr",
          surahTransliteration: "Al-Hashr",
          surahNumber: 59
        });
      }
      return occurrences;
    }
    
    try {
      const searchWord = activeName.ar.replace(/[\u064B-\u065F\u0670]/g, '').replace(/\u0671/g, '\u0627');
      const matches = [];
      
      for (const surah of quranData) {
        for (const ayah of surah.ayahs) {
          let cleanAyah = (ayah.arClean || ayah.ar).replace(/[\u064B-\u065F\u0670]/g, '').replace(/\u0671/g, '\u0627');
          
          // Strip Bismillah prefix if it is not Al-Fatihah (Surah 1)
          if (surah.id !== 1 && cleanAyah.startsWith("بسم الله الرحمن الرحيم")) {
            cleanAyah = cleanAyah.replace(/^بسم الله الرحمن الرحيم\s*/, "");
          }
          
          if (cleanAyah.includes(searchWord)) {
            matches.push({
              id: `${surah.id}:${ayah.inSurah}`,
              inSurah: ayah.inSurah,
              ar: ayah.ar,
              fr: ayah.fr,
              en: ayah.en,
              ha: ayah.ha,
              surahName: surah.name,
              surahTransliteration: surah.transliteration,
              surahNumber: surah.id
            });
          }
        }
      }
      return matches;
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [activeName, quranData, loadingQuran, onlineOccurrences]);

  const toggleVerse = async (match: any) => {
    const detailId = match.id;
    if (expandedVerseId === detailId) {
      setExpandedVerseId(null);
      return;
    }
    setExpandedVerseId(detailId);

    // If it's a local mock fallback or already loaded, skip fetching
    if (detailId.toString().startsWith('off-') || verseDetails[detailId]) {
      return;
    }

    setLoadingDetailId(detailId);
    try {
      const url = `https://api.alquran.cloud/v1/ayah/${detailId}/editions/quran-simple,fr.hamidullah,en.sahih,ha.gumi`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json && json.code === 200 && Array.isArray(json.data)) {
          const arText = json.data[0]?.text || '';
          const frText = json.data[1]?.text || '';
          const enText = json.data[2]?.text || '';
          const haText = json.data[3]?.text || '';
          
          setVerseDetails(prev => ({
            ...prev,
            [detailId]: {
              ar: arText,
              fr: frText,
              en: enText,
              ha: haText
            }
          }));
        }
      }
    } catch (err) {
      console.error("Failed to load verse details dynamically:", err);
    } finally {
      setLoadingDetailId(null);
    }
  };

  const filtered = asmaListData.filter(a => 
    a.tr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.abjad.toString().includes(searchQuery)
  );

  const openModal = (type: 'quran' | 'zikr' | 'khatim' | 'counts', item: typeof asmaListData[0]) => {
    setActiveName(item);
    setViewState(type);
    setShowOtherVerses(false);
    setExpandedVerseId(null);
    setDisplayLimit(30);
    if (type === 'zikr') {
      setZikrCount(0);
      setZikrTarget(item.abjad);
    }
  };

  const closeModal = () => {
    setViewState('list');
    setActiveName(null);
  };

  const totalOccurrences = onlineCount !== null ? onlineCount : (activeName?.quranOptions?.count || 0);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen relative">
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ListTodo className="text-cyan-500" />
            {t('namesOfAllah.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('namesOfAllah.subtitle')}</p>
        </div>
      </div>

      <div className="relative mb-8 z-10">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={20} />
        </div>
        <input
          type="text"
          placeholder={t('namesOfAllah.searchPlaceholder')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-gray-900 dark:text-white font-bold placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {filtered.map((name, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-5 sm:p-6 flex-1 flex flex-col items-center text-center">
              <div className="w-full flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 px-2 py-1 rounded-lg">
                  {t('namesOfAllah.abjad')}: {name.abjad}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg flex items-center gap-1" title="Occurrences dans le Coran entier">
                  <BookOpen size={12} />
                  {name.quranOptions?.count || 0} {language === 'fr' ? 'fois' : language === 'ha' ? 'sau' : 'times'}
                </span>
              </div>

              <h3 className="font-arabic text-4xl sm:text-5xl text-gray-900 dark:text-white mt-2 mb-4 leading-relaxed font-bold tracking-tight">
                {getZikrName(name.ar)}
              </h3>
              
              <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">{name.tr}</h4>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{getTranslatedMeaning(name)}</p>
              
              <div className="w-full mt-auto pt-4 border-t border-gray-100 dark:border-gray-750 text-left">
                <span className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest block mb-1">{t('namesOfAllah.khassiyya')}</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">{getTranslatedRef(name)}</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="border-t border-gray-100 dark:border-gray-700 grid grid-cols-4 bg-gray-50 dark:bg-gray-900/50">
              <button onClick={() => openModal('quran', name)} className="p-3 text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 flex flex-col items-center gap-1 transition-colors border-r border-gray-100 dark:border-gray-700" title={t('namesOfAllah.quran')}>
                <BookOpen size={18} />
                <span className="text-[10px] font-bold uppercase">{t('namesOfAllah.quran')}</span>
              </button>
              <button onClick={() => openModal('zikr', name)} className="p-3 text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex flex-col items-center gap-1 transition-colors border-r border-gray-100 dark:border-gray-700" title={t('namesOfAllah.zikr')}>
                <PlayCircle size={18} />
                <span className="text-[10px] font-bold uppercase">{t('namesOfAllah.zikr')}</span>
              </button>
              <button onClick={() => openModal('khatim', name)} className="p-3 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex flex-col items-center gap-1 transition-colors border-r border-gray-100 dark:border-gray-700" title={t('namesOfAllah.khatim')}>
                <Grid size={18} />
                <span className="text-[10px] font-bold uppercase">{t('namesOfAllah.khatim')}</span>
              </button>
              <button onClick={() => openModal('counts', name)} className="p-3 text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 flex flex-col items-center gap-1 transition-colors" title={t('namesOfAllah.counts')}>
                <Sparkles size={18} />
                <span className="text-[10px] font-bold uppercase">{t('namesOfAllah.counts')}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filtered.length === 0 && (
         <div className="text-center py-12 text-gray-500">{t('namesOfAllah.noResult')}</div>
      )}

      {/* OVERLAYS / MODALS */}
      <AnimatePresence>
        {viewState !== 'list' && activeName && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ bgOpacity: 0 }} 
              animate={{ bgOpacity: 1 }} 
              exit={{ bgOpacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl relative z-10 max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="font-arabic text-2xl text-cyan-600 dark:text-cyan-400">{getZikrName(activeName.ar)}</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs uppercase tracking-wider">{activeName.tr}</span>
                </h3>
                <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-700 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 sm:p-6 overflow-y-auto">
                {language !== 'fr' && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/75 dark:bg-emerald-900/20 border border-emerald-100/50 dark:border-emerald-800/30 px-2.5 py-1 rounded-full w-fit mb-4 select-none">
                    <Sparkles size={12} className={translatingName ? "animate-spin text-emerald-500" : "text-emerald-500"} />
                    <span>{translatingName ? t("translating", "Traduction automatique en cours...") : t("translated", "Traduit automatiquement par IA")}</span>
                  </div>
                )}

                {/* QURAN VIEW */}
                {viewState === 'quran' && (
                  <div className="space-y-6">
                    <div className="bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-800/50 rounded-2xl p-6 text-center shadow-sm">
                      <BookOpen size={48} className="mx-auto text-cyan-500 mb-4" />
                      <h4 className="text-sm font-bold uppercase tracking-widest text-cyan-800 dark:text-cyan-200 mb-1">
                        {t('namesOfAllah.occurrencesTitle', 'Occurrences dans le Coran entier')}
                      </h4>
                      <p className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                        {totalOccurrences} <span className="text-base font-medium text-gray-500">{t('namesOfAllah.times', 'Fois')}</span>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                        {t('namesOfAllah.occurrencesDesc', "Décompte d'apparition du Nom {name} dans le Texte Sacré.").replace('{name}', activeName.ar)}
                      </p>
                    </div>

                    {totalOccurrences > 0 ? (
                      <div className="bg-white dark:bg-gray-800 rounded-2xl space-y-6">
                        
                        {/* Benefits Section */}
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 shadow-sm relative overflow-hidden">
                             <Sparkles className="text-indigo-500/10 absolute -right-4 -top-4" size={100} />
                             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                               <h4 className="text-[11px] uppercase font-bold text-indigo-800 dark:text-indigo-300 tracking-widest flex items-center gap-2">
                                 <Sparkles size={16} />
                                 {t('namesOfAllah.esotericBenefits', 'Bénéfices Esotériques Profonds (Asrar)')}
                               </h4>
                               
                               {/* Text Resizing Component */}
                               <div className="flex items-center gap-1.5 bg-indigo-100/60 dark:bg-indigo-900/40 px-2.5 py-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
                                 <span className="text-indigo-700 dark:text-indigo-300">{t('namesOfAllah.textSize', 'Taille')} :</span>
                                 <button 
                                   type="button"
                                   onClick={() => setTextSize(prev => Math.max(12, prev - 1))}
                                   className="w-5 h-5 flex items-center justify-center font-bold bg-white dark:bg-gray-800 rounded shadow-sm hover:bg-gray-100 text-gray-700 dark:text-gray-300 transition-colors"
                                 >
                                   -
                                 </button>
                                 <span className="font-mono px-0.5 text-indigo-900 dark:text-indigo-100">{textSize}px</span>
                                 <button 
                                   type="button"
                                   onClick={() => setTextSize(prev => Math.min(24, prev + 1))}
                                   className="w-5 h-5 flex items-center justify-center font-bold bg-white dark:bg-gray-800 rounded shadow-sm hover:bg-gray-100 text-gray-700 dark:text-gray-300 transition-colors"
                                 >
                                   +
                                 </button>
                               </div>
                             </div>
                             
                             <div className="space-y-3 relative z-10">
                               <p className="font-medium text-indigo-900/90 dark:text-indigo-100/90 leading-relaxed text-justify" style={{ fontSize: `${textSize}px`, lineHeight: '1.6' }}>
                                 {translatedFields.context || (activeName as any).quranOptions.context}
                               </p>
                               <div className="w-8 h-px bg-indigo-200 dark:bg-indigo-800/50 my-2"></div>
                               <p className="font-medium text-indigo-900/90 dark:text-indigo-100/90 leading-relaxed text-justify" style={{ fontSize: `${textSize}px`, lineHeight: '1.6' }}>
                                 {language === 'en' ? (
                                   `The spiritual recitation of ${activeName.tr} acts deeply on the soul. It breaks the barriers of doubt, opens the corresponding spiritual centers (Lata'if) and irresistibly attracts the graces connected to it. It is a divine shield and an attractor of mercy, radically transforming the inner states and external situations of whoever clings to it with purity and constancy. Its energetic imprint rectifies the invoking servant's destiny.`
                                 ) : language === 'ha' ? (
                                   `Karanta sunan Allah ${activeName.ar} (zikiri) yana da babban tasiri a ran mutum. Yana goge shakku, yana buɗe kofofin samun lada na musamman da kuma janyo rahamar Allah cikin hanzari. Wannan kariya ce mai ƙarfi ga mai yin sa, tana sauya duk wani kunci zuwa sauƙi cikin ikon Allah ga dukkan wanda ya riƙe shi da tsarkakkiyar zuciya.`
                                 ) : (
                                   `La récitation spirituelle de ${activeName.tr} agit en profondeur sur l'âme. Elle détruit les barrières du doute, ouvre les centres spirituels (Lata'if) correspondants et attire irrésistiblement les grâces qui lui sont liées. C'est un bouclier divin et un aimant à miséricorde, transformant radicalement les états intérieurs et les situations extérieures de celui qui s'y attache avec pureté et constance. Son empreinte énergétique rectifie le destin de l'invocateur.`
                                 )}
                               </p>
                             </div>
                        </div>

                        {/* Verses Section */}
                        <div>
                           <h4 className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 mb-4 tracking-widest pl-2">{t('namesOfAllah.versesAndSurahs')}</h4>
                           <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                             {/* Primary verse */}
                             <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                               <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                                  <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                     <BookOpen size={16} className="text-cyan-500" />
                                     {t('namesOfAllah.surah')} {activeName.quranOptions.surah}
                                  </span>
                                  <span className="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300 px-3 py-1 rounded-lg text-xs font-bold">{t('namesOfAllah.verse')} {activeName.quranOptions.verse}</span>
                               </div>
                               <>
                                 <p className="font-arabic text-2xl sm:text-3xl text-gray-900 dark:text-white leading-[2] mb-4 text-center" dir="rtl">{(activeName as any).quranOptions.excerptAr}</p>
                                 <p className="text-gray-600 dark:text-gray-400 font-serif italic text-sm text-center leading-relaxed">" {translatedFields.excerptFr || (activeName as any).quranOptions.excerptFr} "</p>
                               </>
                             </div>

                             {/* Other mentions simulated */}
                             {totalOccurrences > 1 && (
                               <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 overflow-hidden">
                                 <button 
                                   onClick={() => setShowOtherVerses(!showOtherVerses)}
                                   className="w-full p-4 flex items-center justify-between text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                 >
                                   <div className="flex items-center gap-3">
                                     <Eye size={18} className="text-cyan-500" />
                                     <span className="text-sm font-bold">
                                       {t('namesOfAllah.seeOccurrences')}{' '}
                                       {realOccurrences.length > 0 && (
                                         language === 'fr' 
                                           ? `(${realOccurrences.length} sur ${totalOccurrences})` 
                                           : language === 'ha' 
                                             ? `(${realOccurrences.length} cikin ${totalOccurrences})` 
                                             : `(${realOccurrences.length} of ${totalOccurrences})`
                                       )}
                                     </span>
                                   </div>
                                   <ChevronDown size={18} className={`transition-transform duration-300 ${showOtherVerses ? 'rotate-180' : ''}`} />
                                 </button>
                                 
                                 <AnimatePresence>
                                   {showOtherVerses && (
                                     <motion.div
                                       initial={{ height: 0, opacity: 0 }}
                                       animate={{ height: 'auto', opacity: 1 }}
                                       exit={{ height: 0, opacity: 0 }}
                                       className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                     >
                                       <div className="p-4 space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar">
                                         {loadingOnline ? (
                                           <div className="text-center py-8 flex flex-col items-center justify-center gap-3">
                                             <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                             <p className="text-xs text-gray-500 font-medium">
                                               {language === 'fr' ? "Recherche en direct dans tout le Coran..." : language === 'ha' ? "Ana binciken dukan Alƙur'ani..." : "Searching the entire Quran in real-time..."}
                                             </p>
                                           </div>
                                         ) : (
                                           <>
                                             <div className="p-3 bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-100/50 dark:border-cyan-900/30 rounded-xl text-xs text-cyan-800 dark:text-cyan-300 font-medium">
                                               {onlineCount !== null ? (
                                                 language === 'fr' ? (
                                                   `Recherche en direct : ${realOccurrences.length} occurrences exactes trouvées dans l'intégralité du Coran.`
                                                 ) : language === 'ha' ? (
                                                   `Binciken kai tsaye: An sami ayoyi guda ${realOccurrences.length} a cikin dukan Alƙur'ani.`
                                                 ) : (
                                                   `Live Search: Found ${realOccurrences.length} exact occurrences across the entire Quran.`
                                                 )
                                               ) : (
                                                 language === 'fr' ? (
                                                   `Mode Hors-ligne : Les versets sont recherchés dans les Sourates 1 à 12 (affichant ainsi ${realOccurrences.length} versets sur les ${totalOccurrences} occurrences totales du Coran entier).`
                                                 ) : language === 'ha' ? (
                                                   `Ba tare da Intanet ba: Ana bincika ayoyin a cikin Surori 1 zuwa 12 (yana nuna ayoyi ${realOccurrences.length} cikin jimillar sau ${totalOccurrences} a dukan Alƙur'ani).`
                                                 ) : (
                                                   `Offline Mode: Verses are searched within Surahs 1 to 12 (showing ${realOccurrences.length} verses out of ${totalOccurrences} total occurrences in the entire Quran).`
                                                 )
                                               )}
                                             </div>
                                             
                                             {realOccurrences.length === 0 && (
                                               <div className="text-center p-4">
                                                 <p className="text-sm text-gray-500">
                                                   {t('namesOfAllah.occurrencesLimit')}
                                                 </p>
                                               </div>
                                             )}

                                             {realOccurrences.slice(0, displayLimit).map((occurrence) => {
                                               const isExpanded = expandedVerseId === occurrence.id;
                                               const isDetailLoading = loadingDetailId === occurrence.id;
                                               const details = verseDetails[occurrence.id] || {
                                                 ar: occurrence.ar,
                                                 fr: occurrence.fr,
                                                 en: occurrence.en,
                                                 ha: occurrence.ha
                                               };
                                               
                                               return (
                                                 <div key={occurrence.id} className="rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all">
                                                   <button 
                                                     type="button"
                                                     onClick={() => toggleVerse(occurrence)}
                                                     className="w-full flex justify-between items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                                                   >
                                                     <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 pr-2">
                                                       {t('namesOfAllah.surah')} {occurrence.surahNumber} : {occurrence.surahTransliteration} {occurrence.surahName && `(${occurrence.surahName})`}
                                                     </span>
                                                     <div className="flex items-center gap-2 shrink-0">
                                                       <span className="text-xs bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 px-2 py-1 rounded font-bold">
                                                         {t('namesOfAllah.verse')} {occurrence.inSurah}
                                                       </span>
                                                       <ChevronDown size={14} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                     </div>
                                                   </button>
                                                   <AnimatePresence>
                                                     {isExpanded && (
                                                       <motion.div
                                                         initial={{ height: 0, opacity: 0 }}
                                                         animate={{ height: 'auto', opacity: 1 }}
                                                         exit={{ height: 0, opacity: 0 }}
                                                         className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-850"
                                                       >
                                                         <div className="p-4 space-y-3">
                                                           {isDetailLoading ? (
                                                             <div className="text-center py-4 flex flex-col items-center justify-center gap-2">
                                                               <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                                               <span className="text-xs text-gray-400">
                                                                 {language === 'fr' ? "Chargement des traductions..." : language === 'ha' ? "Ana lura da fassarar..." : "Loading translations..."}
                                                               </span>
                                                             </div>
                                                           ) : (
                                                             <>
                                                               <p className="font-arabic text-xl sm:text-2xl text-gray-900 dark:text-white leading-[2] text-center" dir="rtl">
                                                                 {details.ar || occurrence.ar}
                                                               </p>
                                                               <p className="text-gray-600 dark:text-gray-400 font-serif italic text-sm text-center leading-relaxed">
                                                                 "{details[language as 'fr' | 'en' | 'ha'] || details.fr || details.en || details.ha || occurrence[language as 'fr' | 'en' | 'ha'] || occurrence.fr || occurrence.en || occurrence.ha || ''}"
                                                               </p>
                                                             </>
                                                           )}
                                                         </div>
                                                       </motion.div>
                                                     )}
                                                   </AnimatePresence>
                                                 </div>
                                               );
                                             })}

                                             {realOccurrences.length > displayLimit && (
                                               <button 
                                                 type="button"
                                                 onClick={() => setDisplayLimit(prev => prev + 50)}
                                                 className="w-full mt-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 rounded-xl text-xs font-bold border border-dashed border-gray-200 dark:border-gray-800 transition-all flex items-center justify-center gap-2"
                                               >
                                                 <ChevronDown size={14} />
                                                 {language === 'fr' 
                                                   ? `Afficher 50 versets supplémentaires (sur ${realOccurrences.length - displayLimit} restants)` 
                                                   : language === 'ha'
                                                     ? `Nuna ƙarin ayoyi 50 (cikin ${realOccurrences.length - displayLimit} da suka rage)`
                                                     : `Show 50 more verses (${realOccurrences.length - displayLimit} remaining)`
                                                 }
                                               </button>
                                             )}
                                           </>
                                         )}
                                       </div>
                                       <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
                                         <span className="text-[11px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg block leading-relaxed">
                                           {t('namesOfAllah.initiationSecret')}
                                         </span>
                                       </div>
                                     </motion.div>
                                   )}
                                 </AnimatePresence>
                               </div>
                             )}
                           </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 italic bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl">{dict.propheticHadithFallback}</p>
                    )}
                  </div>
                )}

                {/* ZIKR VIEW */}
                {viewState === 'zikr' && (
                  <div className="flex flex-col items-center justify-center text-center space-y-8 py-8">
                    <div>
                      <h4 className="text-4xl sm:text-6xl font-arabic font-bold text-gray-900 dark:text-white mb-2">{getVocativeName(activeName.ar)}</h4>
                      <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                        {t('namesOfAllah.poidsAbjad', 'Poids Abjad')}: <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeName.abjad}</span>
                        {zikrTarget !== activeName.abjad && (
                          <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                             ({t('namesOfAllah.target', 'Objectif')}: <span className="font-bold text-amber-600 dark:text-amber-400">{zikrTarget}</span>)
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="relative">
                      {zikrCount === zikrTarget && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.5 }} 
                          animate={{ opacity: 1, scale: 1.2 }} 
                          className="absolute -inset-8 bg-emerald-500/20 blur-xl rounded-full"
                        />
                      )}
                      <button
                        onClick={() => setZikrCount(prev => prev + 1)}
                        className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center shadow-2xl transition-transform active:scale-95 ${
                          zikrCount >= zikrTarget 
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-500/30' 
                            : 'bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white border-4 border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <span className="text-5xl sm:text-6xl font-black font-mono tracking-tighter">{zikrCount}</span>
                      </button>
                    </div>

                    <button 
                      onClick={() => setZikrCount(0)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium text-sm px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full"
                    >
                      {t('namesOfAllah.reinitialiser', 'Réinitialiser')}
                    </button>
                  </div>
                )}

                {/* KHATIM VIEW */}
                {viewState === 'khatim' && (() => {
                  const { grid, error: khatimError } = generateKhatimGrid(khatimSize, activeName.abjad);
                  return (
                    <div className="space-y-6 py-4 flex flex-col items-center">
                      <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        {language === 'en' ? (
                          <>
                            Magic Square (Awfaq) Generator for the value <span className="font-bold text-purple-600 dark:text-purple-400">{activeName.abjad}</span>. Remainders are not handled in this simple version.
                          </>
                        ) : language === 'ha' ? (
                          <>
                            Injin samar da Murabba'ai na Sihiri (Awfaq) don ƙimar <span className="font-bold text-purple-600 dark:text-purple-400">{activeName.abjad}</span>. Ba a sarrafa ragowar a cikin wannan sigar mai sauƙi ba.
                          </>
                        ) : (
                          <>
                            Générateur de Carrés Magiques (Awfaq) pour la valeur <span className="font-bold text-purple-600 dark:text-purple-400">{activeName.abjad}</span>. Les restes ne sont pas traités dans cette version simple.
                          </>
                        )}
                      </p>

                      {/* Dynamic Selector 3x3 to 10x10 */}
                      <div className="flex flex-wrap justify-center gap-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl max-w-full">
                        {[3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                          <button
                            key={size}
                            onClick={() => setKhatimSize(size)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              khatimSize === size
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                            }`}
                          >
                            {size}x{size}
                          </button>
                        ))}
                      </div>

                      {/* Display grid or show error */}
                      {khatimError ? (
                        <div className="text-red-500 text-xs font-bold bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/50 text-center max-w-sm">
                          {khatimError}
                        </div>
                      ) : (
                        grid && (
                          <div className="space-y-4 w-full flex flex-col items-center overflow-x-auto">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 text-center">
                              {khatimNamesMap[khatimSize]} ({khatimSize}x{khatimSize})
                            </h4>
                            <div className={`grid mx-auto gap-1 p-2 bg-gray-100 dark:bg-gray-900 rounded-2xl ${gridColsClassMap[khatimSize]}`}>
                              {grid.map((row, i) =>
                                row.map((cell, j) => (
                                  <div
                                    key={`${i}-${j}`}
                                    className={`aspect-square bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center font-mono font-bold text-gray-900 dark:text-white shadow-sm ${gridCellPaddingMap[khatimSize]} ${textPercentSizeMap[khatimSize]}`}
                                  >
                                    {cell}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  );
                })()}

                {/* COUNTS & BENEFITS VIEW */}
                {viewState === 'counts' && (() => {
                  const currentLang = language || 'fr';
                  const activeCounts = countsBenefitsTranslations[currentLang] || countsBenefitsTranslations['fr'];
                  
                  const countsTitleMap = {
                    fr: "Sciences des Nombres (Ilm Al-Asrar)",
                    en: "Science of Numbers (Ilm Al-Asrar)",
                    ha: "Ilimin Lambobi (Ilm Al-Asrar)"
                  };
                  const countsDescMap = {
                    fr: "Le nombre de fois que vous effectuez le Zikr (répétition) détermine la dimension spirituelle avec laquelle vous interagissez. Voici les portes ésotériques (Abwab) déverrouillées :",
                    en: "The number of times you perform Zikr determines the spiritual dimension you interact with. Here are the esoteric gates (Abwab) unlocked:",
                    ha: "Adadin lokutan da kuke yin Zikiri yana tabbatar da matsayin ruhaniya da kuke hulɗa da ita. Ga ƙofofin asiri (Abwab) da ke buɗewa:"
                  };
                  const calculatorTitleMap = {
                    fr: "Calculateur de Combinaisons de Dhikr",
                    en: "Dhikr Combination Calculator",
                    ha: "Mai Kididdige Haɗa Zikiri"
                  };
                  const calculatorDescMap = {
                    fr: "Décomposez un poids Abjad ou un nombre cible en cycles de nombres sacrés traditionnels.",
                    en: "Break down an Abjad weight or a target number into cycles of traditional sacred numbers.",
                    ha: "Rarraba nauyin Abjad ko lambar niyya zuwa tsarin lambobin asiri na gargajiya."
                  };
                  const calcPlaceholderMap = {
                    fr: "Entrez un nombre (ex: 154)",
                    en: "Enter a number (e.g. 154)",
                    ha: "Shigar da adadin (misali: 154)"
                  };
                  const calcBtnMap = {
                    fr: "Calculer",
                    en: "Calculate",
                    ha: "Auna"
                  };
                  const calcResultTitleMap = {
                    fr: "Combinaison Spirituelle Suggérée",
                    en: "Suggested Spiritual Combination",
                    ha: "Tsarin Zikiri da Aka Shawarta"
                  };

                  // Simple decomposition state hooks using ref/temporary state or inline computation
                  // Let's compute it inline or using simple state inside the modal.
                  // Since we are inside an IIFE render, we can use an inline calculation for the active Name's Abjad,
                  // and allow a custom input field. Let's make a mini component or state helper.
                  return (
                    <div className="space-y-6 pb-6">
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-800/30 p-5 rounded-3xl shadow-sm relative overflow-hidden">
                        <Sparkles className="text-amber-500/20 absolute -right-4 -top-4" size={100} />
                        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                          <Hash className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={24} />
                          <div>
                             <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-1">
                               {countsTitleMap[currentLang] || countsTitleMap.fr}
                             </h4>
                             <p className="text-sm font-medium text-amber-800/80 dark:text-amber-200/80 leading-relaxed">
                               {countsDescMap[currentLang] || countsDescMap.fr}
                             </p>
                          </div>
                        </div>
                      </div>

                      {/* Dhikr Combination Calculator Card */}
                      <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-700/50 space-y-4">
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                          <Calculator size={18} />
                          <h5 className="font-bold text-sm uppercase tracking-wider">
                            {calculatorTitleMap[currentLang] || calculatorTitleMap.fr}
                          </h5>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {calculatorDescMap[currentLang] || calculatorDescMap.fr}
                        </p>
                        
                        {(() => {
                          const targetVal = activeName.abjad;
                          // Greedy decomposition
                          const sortedCounts = [...activeCounts].sort((a, b) => b.count - a.count);
                          let remaining = targetVal;
                          const steps: { count: number; name: string; tag: string }[] = [];
                          
                          for (const item of sortedCounts) {
                            if (remaining >= item.count) {
                              const qty = Math.floor(remaining / item.count);
                              for (let q = 0; q < qty; q++) {
                                steps.push({ count: item.count, name: item.ref, tag: item.tag });
                              }
                              remaining = remaining % item.count;
                            }
                          }
                          if (remaining > 0) {
                            steps.push({ 
                              count: remaining, 
                              name: currentLang === 'en' ? 'Free repetitions' : currentLang === 'ha' ? 'Raka\'o\'i na Kyauta' : 'Répétitions libres', 
                              tag: 'Rest' 
                            });
                          }

                          return (
                            <div className="space-y-3">
                              <div className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                {calcResultTitleMap[currentLang] || calcResultTitleMap.fr} pour <span className="text-amber-600 font-mono font-black text-sm">{activeName.abjad}</span> :
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {steps.map((st, sidx) => (
                                  <div key={sidx} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-750 shadow-sm text-xs">
                                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{st.count}x</span>
                                    <span className="text-gray-600 dark:text-gray-400 truncate max-w-[150px]" title={st.name}>{st.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Counts List */}
                      <div className="grid gap-4">
                        {activeCounts.map((cb, i) => (
                          <div key={i} className="flex flex-col sm:flex-row gap-4 sm:items-start p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors hover:border-amber-200 dark:hover:border-amber-900/50 group">
                             <div className="flex flex-col items-center justify-center shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-gray-800 text-amber-700 dark:text-amber-400 rounded-2xl border border-amber-200 dark:border-amber-800/40 font-mono font-black text-xl sm:text-2xl shadow-inner group-hover:scale-105 transition-transform">
                               {cb.count}
                             </div>
                             <div className="flex-1 space-y-2">
                               <div className="flex items-center justify-between gap-2 flex-wrap">
                                 <div className="flex items-center gap-2 flex-wrap">
                                   <h5 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">{cb.ref}</h5>
                                   {cb.tag && (
                                     <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-[10px] uppercase font-bold tracking-widest rounded-md border border-gray-200 dark:border-gray-600">
                                       {cb.tag}
                                     </span>
                                   )}
                                 </div>
                                 <button
                                   onClick={() => {
                                     setZikrTarget(cb.count);
                                     setZikrCount(0);
                                     setViewState('zikr');
                                   }}
                                   className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                                 >
                                   {currentLang === 'en' ? 'Launch Zikr' : currentLang === 'ha' ? 'Fara Zikiri' : 'Lancer ce Zikr'}
                                 </button>
                               </div>
                               <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-justify">{cb.desc}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

