import React, { useState, useEffect } from 'react';
import { Flame, Droplets, Wind, Mountain, ArrowLeft, Info, Database, Wifi, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { motion } from 'motion/react';
import { CalculationHistoryModal } from '../../../components/CalculationHistoryModal';
import { saveCalculationToHistory } from '../../../utils/calculationHistory';

const ELEMENTS_BASE = {
  FIRE: {
    icon: Flame,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    letters: ['ا', 'ه', 'ط', 'م', 'ف', 'ش', 'ذ'],
  },
  EARTH: {
    icon: Mountain,
    color: 'text-amber-700 dark:text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    letters: ['ب', 'و', 'ي', 'n', 'ص', 'ت', 'ض'],
  },
  AIR: {
    icon: Wind,
    color: 'text-gray-500 dark:text-gray-300',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-200 dark:border-gray-700',
    letters: ['ج', 'ز', 'ك', 'س', 'ق', 'ث', 'ظ'],
  },
  WATER: {
    icon: Droplets,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    letters: ['د', 'ح', 'l', 'ع', 'ر', 'خ', 'غ'],
  }
};

const ELEMENT_DICT = {
  fr: {
    FIRE: {
      name: 'Feu (Nari)',
      nature: 'Chaud et Sec',
      advice: "Écrire le vœu ou le nom sur un support et le placer près d'une source de chaleur (feu, four, endroit chaud), ou l'exposer au soleil. Parfait pour la domination, l'amour passionnel ou la destruction d'obstacles."
    },
    EARTH: {
      name: 'Terre (Turabi)',
      nature: 'Froid et Sec',
      advice: "Écrire et enterrer dans le sol, sous une pierre lourde, ou garder précieusement dans sa poche/portefeuille. Idéal pour la stabilité, la richesse, la fondation de projets et la dissimulation."
    },
    AIR: {
      name: 'Air (Hawa\'i)',
      nature: 'Chaud et Humide',
      advice: "Écrire et l'accrocher à un arbre, à un endroit exposé au vent, ou sur le toit d'une maison. Efficace pour les appels rapides, faire venir quelqu'un, la renommée et les voyages."
    },
    WATER: {
      name: 'Eau (Ma\'i)',
      nature: 'Froid et Humide',
      advice: "Écrire avec de l'encre effaçable (safran/eau de rose), laver (faire le Nassi) et le boire, s'en frotter le corps, ou le jeter dans une rivière/mer. Excellente nature pour la guérison, la purification, et l'apaisement."
    },
    title: "Analyseur Élémentaire (Tabai' al-Huruf)",
    offlineCache: "Cache local (Mode Offline actif)",
    onlineSync: "Synchronisé localement (Offline-first)",
    inputLabel: "Entrez un nom ou une phrase en arabe",
    placeholder: "ex: محمد, الرzاق...",
    dominantNature: "Nature Dominante",
    recommendationHeader: "Recommandation d'usage",
    detailsTitle: "Détail des Lettres"
  },
  en: {
    FIRE: {
      name: 'Fire (Nari)',
      nature: 'Hot and Dry',
      advice: "Write the wish or name on a medium and place it near a heat source (fire, oven, hot area), or expose it to the sun. Perfect for dominion, passionate love, or breaking obstacles."
    },
    EARTH: {
      name: 'Earth (Turabi)',
      nature: 'Cold and Dry',
      advice: "Write and bury in the ground, under a heavy stone, or keep safely in your pocket/wallet. Ideal for stability, wealth, foundation of projects, and concealment."
    },
    AIR: {
      name: 'Air (Hawa\'i)',
      nature: 'Hot and Humid',
      advice: "Write and hang it on a tree, in a wind-exposed area, or on a roof. Effective for swift calls, bringing someone, fame, and travel."
    },
    WATER: {
      name: 'Water (Ma\'i)',
      nature: 'Cold and Humid',
      advice: "Write with erasable ink (saffron/rose water), wash (prepare Nassi) and drink it, rub it on your body, or cast it into a river/sea. Excellent for healing, purification, and peace."
    },
    title: "Elemental Analyzer (Tabai' al-Huruf)",
    offlineCache: "Local cache (Offline Mode active)",
    onlineSync: "Synchronized locally (Offline-first)",
    inputLabel: "Enter a name or a phrase in Arabic",
    placeholder: "e.g., محمد, الرزاق...",
    dominantNature: "Dominant Nature",
    recommendationHeader: "Usage Recommendation",
    detailsTitle: "Details of Letters"
  },
  ha: {
    FIRE: {
      name: 'Wuta (Nari)',
      nature: 'Zafi da Bushewa',
      advice: "Rubuta fata ko suna a jiki kuma a ajiye shi kusa da tushen zafi (wuta, tanda, ko wuri mai dumi), ko a fito da shi ga rana. Ya dace don rinjaye, tsananin soyayya, ko karya cikas."
    },
    EARTH: {
      name: 'Kasa (Turabi)',
      nature: 'Sanyi da Bushewa',
      advice: "Rubuta sannan a binne a kasa, karkashin babban dutse, ko a ajiye shi a cikin aljihunka/jakar kudi. Mafi kyau don daidaituwa, arziki, kafa ayyuka, da boyewa."
    },
    AIR: {
      name: 'Iska (Hawa\'i)',
      nature: 'Zafi da Danshi',
      advice: "Rubuta sannan a rataye shi a bishiya, a wurin da iska ke bugawa, ko a saman rufin gida. Yana da tasiri don kiran gaggawa, jawo hankali, suna, da tafiye-tafiyye."
    },
    WATER: {
      name: 'Ruwa (Ma\'i)',
      nature: 'Sanyi da Danshi',
      advice: "Rubuta da tawada mai goguwa (za'afaran da ruwan wardi), sannan a wanke (a yi nassi) a sha shi, ko a shafa a jiki, ko a jefa a kogi/teku. Yana da kyau don waraka, tsarkakewa, da kwanciyar hangali."
    },
    title: "Mai Binciken Abubuwa (Tabai' al-Huruf)",
    offlineCache: "Ajiye na gida (Yanayin Offline yana aiki)",
    onlineSync: "An daidaita a gida (Offline-first)",
    inputLabel: "Shigar da suna ko jumla da Larabci",
    placeholder: "Misali: محمد, الرزاق...",
    dominantNature: "Hali Mafi Karfi",
    recommendationHeader: "Shawara don Amfani",
    detailsTitle: "Bayanin Haruffa"
  }
};

export const ElementalAnalyzer: React.FC = () => {
  const { t, language } = useLanguage();
  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const dict = ELEMENT_DICT[langKey] || ELEMENT_DICT.fr;

  const [input, setInput] = useState('');
  const [isUsingCache, setIsUsingCache] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    try {
      const savedInput = localStorage.getItem('asrar_elemental_input');
      if (savedInput) setInput(savedInput);
    } catch (e) {
      console.warn("Failed to load elemental input", e);
    }
    setIsUsingCache(!navigator.onLine);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('asrar_elemental_input', input);
    } catch (e) {}

    if (input.trim().length >= 2) {
      const timer = setTimeout(() => {
        const text = input.replace(/\s/g, '');
        let counts = { FIRE: 0, EARTH: 0, AIR: 0, WATER: 0 };
        for (const char of text) {
          if (ELEMENTS_BASE.FIRE.letters.includes(char)) counts.FIRE++;
          else if (ELEMENTS_BASE.EARTH.letters.includes(char)) counts.EARTH++;
          else if (ELEMENTS_BASE.AIR.letters.includes(char)) counts.AIR++;
          else if (ELEMENTS_BASE.WATER.letters.includes(char)) counts.WATER++;
        }
        const summaryStr = `Feu: ${counts.FIRE} | Terre: ${counts.EARTH} | Air: ${counts.AIR} | Eau: ${counts.WATER}`;
        saveCalculationToHistory({
          toolId: 'elemental',
          toolName: 'Analyseur des 4 Éléments',
          title: input.trim(),
          summary: summaryStr,
          details: { input: input.trim(), counts },
          tags: ['Éléments', 'Tabai']
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [input]);
  
  const analyze = () => {
    const text = input.replace(/\s/g, '');
    let counts = { FIRE: 0, EARTH: 0, AIR: 0, WATER: 0 };
    let details: { char: string, element: string }[] = [];

    for (const char of text) {
      if (ELEMENTS_BASE.FIRE.letters.includes(char)) { counts.FIRE++; details.push({ char, element: 'FIRE' }); }
      else if (ELEMENTS_BASE.EARTH.letters.includes(char)) { counts.EARTH++; details.push({ char, element: 'EARTH' }); }
      else if (ELEMENTS_BASE.AIR.letters.includes(char)) { counts.AIR++; details.push({ char, element: 'AIR' }); }
      else if (ELEMENTS_BASE.WATER.letters.includes(char)) { counts.WATER++; details.push({ char, element: 'WATER' }); }
    }

    const maxCount = Math.max(counts.FIRE, counts.EARTH, counts.AIR, counts.WATER);
    const dominants = Object.entries(counts).filter(([_, count]) => count === maxCount && count > 0).map(([key]) => key);

    return { counts, details, dominants };
  };

  const result = input.length > 0 ? analyze() : null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Link to="/tools" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium mb-4">
            <ArrowLeft className="mr-2" size={20} />
            {t("common.backToTools", "Retour au tableau de bord")}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Flame className="text-red-500" />
            {dict.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mt-2">{t("tools.elemental.description")}</p>
          {isUsingCache ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 mt-2">
              <Database size={11} className="animate-pulse" />
              <span>{dict.offlineCache}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 mt-2">
              <Wifi size={11} />
              <span>{dict.onlineSync}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowHistory(true)}
          className="mt-6 px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
        >
          <History size={16} />
          <span>{language === 'ha' ? 'Tarihi' : language === 'en' ? 'History' : 'Historique'}</span>
        </button>
      </div>

      <CalculationHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        toolFilter="elemental"
        onSelectCalculation={(item) => {
          if (item.details?.input) {
            setInput(item.details.input);
          } else if (item.title) {
            setInput(item.title);
          }
        }}
      />

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm mb-8">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{dict.inputLabel}</label>
        <input
          type="text"
          dir="rtl"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={dict.placeholder}
          className="w-full text-2xl font-arabic p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="mb-8">
        <ToolInfoTooltip toolId="elemental" />
      </div>

      {result && result.dominants.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">{dict.dominantNature}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.dominants.map(dom => {
              const elBase = ELEMENTS_BASE[dom as keyof typeof ELEMENTS_BASE];
              const elTrans = dict[dom as keyof typeof ELEMENTS_BASE];
              const Icon = elBase.icon;
              return (
                <div key={dom} className={`p-6 rounded-2xl border ${elBase.borderColor} ${elBase.bgColor}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-full bg-white dark:bg-gray-900 shadow-sm ${elBase.color}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${elBase.color}`}>{elTrans.name}</h3>
                      <p className="text-sm font-medium opacity-80">{elTrans.nature}</p>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-900/40 p-4 rounded-xl border border-white/20 dark:border-gray-700/50">
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">{dict.recommendationHeader}</h4>
                    <p className="text-sm font-medium leading-relaxed">{elTrans.advice}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4">{dict.detailsTitle}</h3>
             <div className="flex flex-wrap gap-2" dir="rtl">
                {result.details.map((item, i) => {
                  const elBase = ELEMENTS_BASE[item.element as keyof typeof ELEMENTS_BASE];
                  return (
                    <div key={i} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border ${elBase.borderColor} ${elBase.bgColor}`}>
                      <span className="font-arabic font-bold text-lg">{item.char}</span>
                      <elBase.icon size={14} className={elBase.color} />
                    </div>
                  );
                })}
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
