import React, { useState } from 'react';
import { Scale, Users, Heart, ArrowLeft, RefreshCw, Flame, Droplets, Wind, Mountain, AlertCircle, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion } from 'motion/react';
import { calculateAbjadValue } from '../../../utils/abjad';
import { CalculationHistoryModal } from '../../../components/CalculationHistoryModal';
import { saveCalculationToHistory } from '../../../utils/calculationHistory';

const LETTER_ELEMENTS: Record<string, string> = {
  'ا': 'Feu', 'ه': 'Feu', 'ط': 'Feu', 'م': 'Feu', 'f': 'Feu', 'ش': 'Feu', 'ذ': 'Feu',
  'ب': 'Terre', 'و': 'Terre', 'ي': 'Terre', 'ن': 'Terre', 'ص': 'Terre', 'ت': 'Terre', 'ض': 'Terre',
  'ج': 'Air', 'ز': 'Air', 'ك': 'Air', 'س': 'Air', 'ق': 'Air', 'ث': 'Air', 'ظ': 'Air',
  'د': 'Eau', 'ح': 'Eau', 'ل': 'Eau', 'ع': 'Eau', 'ر': 'Eau', 'خ': 'Eau', 'غ': 'Eau',
};

const BUNI_RESULTS_DICT = {
  fr: {
    1: { title: "Amour et Bonheur", desc: "Union très favorable. Harmonie profonde, affection mutuelle et joie durable.", type: "good" as const },
    2: { title: "Dispute et Séparation", desc: "Relation tumultueuse. Risques élevés de conflits, d'incompréhension et de rupture.", type: "bad" as const },
    3: { title: "Richesse et Prospérité", desc: "Excellente alliance pour les affaires et le mariage. Apporte abondance et succès matériel.", type: "good" as const },
    4: { title: "Accord Spirituel, Difficultés Matérielles", desc: "Bonne entente émotionnelle mais l'union pourrait traverser des épreuves financières.", type: "neutral" as const },
    5: { title: "Stabilité et Descendance", desc: "Union solide et bénie, particulièrement favorable pour fonder une famille et avoir une descendance pieuse.", type: "good" as const },
    6: { title: "Jalousie et Mensonges", desc: "Relation toxique. Risques de trahison, d'envie et d'interférences extérieures malveillantes.", type: "bad" as const },
    7: { title: "Respect et Élévation", desc: "Les deux partenaires se tirent vers le haut. Succès social et respect mutuel garanti.", type: "good" as const },
    8: { title: "Domination et Déséquilibre", desc: "L'un des partenaires exercera une domination oppressante sur l'autre. Relation inégale.", type: "bad" as const },
    9: { title: "Sagesse et Bénédiction", desc: "La perfection de l'union spirituelle. Paix absolue et protection divine sur le couple.", type: "good" as const },
  },
  en: {
    1: { title: "Love and Happiness", desc: "Highly favorable union. Deep harmony, mutual affection, and lasting joy.", type: "good" as const },
    2: { title: "Disputes and Separation", desc: "Tumultuous relationship. High risks of conflicts, misunderstanding, and breakups.", type: "bad" as const },
    3: { title: "Wealth and Prosperity", desc: "Excellent alliance for business and marriage. Brings abundance and material success.", type: "good" as const },
    4: { title: "Spiritual Harmony, Material Challenges", desc: "Good emotional agreement, but the union may face financial hardships.", type: "neutral" as const },
    5: { title: "Stability and Offspring", desc: "Solid and blessed union, highly favorable for starting a family and raising righteous children.", type: "good" as const },
    6: { title: "Jealousy and Lies", desc: "Toxic relationship. Risks of betrayal, envy, and malicious external interference.", type: "bad" as const },
    7: { title: "Respect and Elevation", desc: "Both partners lift each other up. Guaranteed social success and mutual respect.", type: "good" as const },
    8: { title: "Domination and Imbalance", desc: "One partner will exert an oppressive domination over the other. Unequal relationship.", type: "bad" as const },
    9: { title: "Wisdom and Blessing", desc: "The perfection of spiritual union. Absolute peace and divine protection on the couple.", type: "good" as const },
  },
  ha: {
    1: { title: "Soyayya da Farin Ciki", desc: "Hadin gwiwa mai matukar kyau. Zurfin jituwa da nishadi mai dorewa.", type: "good" as const },
    2: { title: "Rikici da Rabuwa", desc: "Dangantaka mai cike da hargitsi da hadarin rabuwa ko rashin fahimtar juna.", type: "bad" as const },
    3: { title: "Arziƙi da Wadatar Zuci", desc: "Hadin gwiwa mai kyau don kasuwanci da aure. Yana kawo wadata da nasara.", type: "good" as const },
    4: { title: "Yarda Ta Ruhaniya, Kalubalen Kudi", desc: "Kyakkyawar fahimtar juna amma dangantakar na iya fuskantar kalubalen kudi.", type: "neutral" as const },
    5: { title: "Zaman Lafiya da Zuri'a", desc: "Hadin gwiwa mai ƙarfi da albarka, musamman don gina iyali da samun zuri'a ta gari.", type: "good" as const },
    6: { title: "Kishi da Karya", desc: "Guba a dangantaka. Hadarin yaudara, hassada da tsoma bakin mutanen waje.", type: "bad" as const },
    7: { title: "Girmamawa da Daukaka", desc: "Abokan zama suna tallafa wa juna don daukaka. Tabbatacciyar nasara da girmama juna.", type: "good" as const },
    8: { title: "Mamaya da Rashin Daidaito", desc: "Daya daga cikin abokan zaman zai danne daya. Dangantaka mara daidaito.", type: "bad" as const },
    9: { title: "Hikima da Albarka", desc: "Kammala hadin gwiwa ta ruhaniya. Cikakken zaman lafiya da kariya ta Ubangiji.", type: "good" as const },
  }
};

const compDict = {
  fr: {
    title: "Compatibilité Spirituelle (Tawafuq)",
    partnerHeader: "Noms des Partenaires",
    p1: "Personne 1 (en arabe)",
    p2: "Personne 2 (en arabe)",
    placeholder1: "Ex: احمد",
    placeholder2: "Ex: خديجة",
    calculating: "Analyse en cours...",
    calcButton: "Calculer le Tawafuq",
    verdictLabel: "Verdict de l'Imam Al-Buni",
    mysticMath: "Mathématique Mystique",
    abjad1Label: "Valeur Abjad 1",
    abjad2Label: "Valeur Abjad 2",
    totalLabel: "Total",
    remainderLabel: "Reste (Division par 9)",
    elementalAnalysis: "Analyse Élémentaire",
    waitingTitle: "En attente de noms",
    waitingDesc: "Saisissez les deux prénoms en arabe pour découvrir leur degré de compatibilité spirituelle."
  },
  en: {
    title: "Spiritual Compatibility (Tawafuq)",
    partnerHeader: "Partners' Names",
    p1: "Person 1 (in Arabic)",
    p2: "Person 2 (in Arabic)",
    placeholder1: "Ex: احمد",
    placeholder2: "Ex: خديجة",
    calculating: "Analyzing...",
    calcButton: "Calculate Tawafuq",
    verdictLabel: "Imam Al-Buni's Verdict",
    mysticMath: "Mystic Mathematics",
    abjad1Label: "Abjad Value 1",
    abjad2Label: "Abjad Value 2",
    totalLabel: "Total",
    remainderLabel: "Remainder (Modulo 9)",
    elementalAnalysis: "Elemental Analysis",
    waitingTitle: "Awaiting names",
    waitingDesc: "Enter both names in Arabic to discover their spiritual compatibility degree."
  },
  ha: {
    title: "Daidaituwar Ruhaniya (Tawafuq)",
    partnerHeader: "Sunayen Abokan Zama",
    p1: "Mutum na 1 (da Larabci)",
    p2: "Mutum na 2 (da Larabci)",
    placeholder1: "Alal misali: احمد",
    placeholder2: "Alal misali: خديجة",
    calculating: "Ana bincike...",
    calcButton: "Gano Tawafuq",
    verdictLabel: "Hukuncin Imam Al-Buni",
    mysticMath: "Lissafin Sirri",
    abjad1Label: "Darajar Abjad 1",
    abjad2Label: "Darajar Abjad 2",
    totalLabel: "Jimilla",
    remainderLabel: "Sauran (Raba da 9)",
    elementalAnalysis: "Binciken Abubuwa",
    waitingTitle: "Ana jiran sunaye",
    waitingDesc: "Saka sunayen biyu da Larabci don gano matakin daidaituwar su ta ruhaniya."
  }
};

const translateElement = (elem: string, lang: 'fr' | 'en' | 'ha') => {
  const dicts = {
    fr: { 'Feu': 'Feu', 'Eau': 'Eau', 'Terre': 'Terre', 'Air': 'Air' },
    en: { 'Feu': 'Fire', 'Eau': 'Water', 'Terre': 'Earth', 'Air': 'Air' },
    ha: { 'Feu': 'Wuta', 'Eau': 'Ruwa', 'Terre': 'Kasa', 'Air': 'Iska' }
  };
  const active = dicts[lang] || dicts.fr;
  return active[elem as 'Feu' | 'Eau' | 'Terre' | 'Air'] || elem;
};

const getElementCompatibility = (e1: string, e2: string, lang: 'fr' | 'en' | 'ha') => {
  const compDict = {
    fr: {
      same: "Harmonie naturelle (Même nature)",
      fireAir: "Excellente synergie (L'Air attise le Feu)",
      waterEarth: "Union fertile (L'Eau nourrit la Terre)",
      fireWater: "Opposition destructrice (L'Eau éteint le Feu)",
      airEarth: "Incompatibilité (L'Air assèche la Terre)",
      neutral: "Relation neutre ou mixte"
    },
    en: {
      same: "Natural harmony (Same nature)",
      fireAir: "Excellent synergy (Air fuels Fire)",
      waterEarth: "Fertile union (Water nourishes Earth)",
      fireWater: "Destructive opposition (Water extinguishes Fire)",
      airEarth: "Incompatibility (Air dries Earth)",
      neutral: "Neutral or mixed relation"
    },
    ha: {
      same: "Daidaito na halitta (Iri ɗaya)",
      fireAir: "Hadin gwiwa mai kyau (Iska tana hura Wuta)",
      waterEarth: "Hadin gwiwa mai albarka (Ruwa yana shayar da Kasa)",
      fireWater: "Gaba mai lalacewa (Ruwa yana kashe Wuta)",
      airEarth: "Rashin daidaito (Iska tana bushe Kasa)",
      neutral: "Dangantaka tsaka-tsaki ko gauraye"
    }
  };
  const dict = compDict[lang] || compDict.fr;
  if (e1 === e2) return dict.same;
  if ((e1 === 'Feu' && e2 === 'Air') || (e1 === 'Air' && e2 === 'Feu')) return dict.fireAir;
  if ((e1 === 'Eau' && e2 === 'Terre') || (e1 === 'Terre' && e2 === 'Eau')) return dict.waterEarth;
  if ((e1 === 'Feu' && e2 === 'Eau') || (e1 === 'Eau' && e2 === 'Feu')) return dict.fireWater;
  if ((e1 === 'Air' && e2 === 'Terre') || (e1 === 'Terre' && e2 === 'Air')) return dict.airEarth;
  return dict.neutral;
};

export const SpiritualCompatibility: React.FC = () => {
  const { t, language } = useLanguage();
  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const dict = compDict[langKey] || compDict.fr;
  const buniDict = BUNI_RESULTS_DICT[langKey] || BUNI_RESULTS_DICT.fr;

  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [result, setResult] = useState<{
    abjad1: number; abjad2: number; total: number; remainder: number;
    elem1: string; elem2: string; elemCompatibility: string;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const getElement = (name: string) => {
    const cleanName = name.replace(/\s+/g, '');
    if (!cleanName) return 'Feu';
    return LETTER_ELEMENTS[cleanName[0]] || 'Feu';
  };

  const calculateCompatibility = () => {
    if (!name1 || !name2) return;
    setIsCalculating(true);
    
    setTimeout(() => {
      const a1 = calculateAbjadValue(name1.replace(/\s+/g, ''));
      const a2 = calculateAbjadValue(name2.replace(/\s+/g, ''));
      const total = a1 + a2;
      let remainder = total % 9;
      if (remainder === 0) remainder = 9;

      const elem1 = getElement(name1);
      const elem2 = getElement(name2);
      
      setResult({
        abjad1: a1,
        abjad2: a2,
        total,
        remainder,
        elem1,
        elem2,
        elemCompatibility: getElementCompatibility(elem1, elem2, langKey)
      });

      saveCalculationToHistory({
        toolId: 'compatibility',
        toolName: 'Compatibilité Spirituelle',
        title: `${name1.trim()} & ${name2.trim()}`,
        summary: `Abjad 1: ${a1} | Abjad 2: ${a2} | Total: ${total} | Modulo 9: ${remainder}`,
        details: { name1: name1.trim(), name2: name2.trim(), abjad1: a1, abjad2: a2, total, remainder },
        tags: ['Compatibilité', 'Tawafuq']
      });

      setIsCalculating(false);
    }, 1000);
  };

  const ElementIcon = ({ element }: { element: string }) => {
    switch(element) {
      case 'Feu': return <Flame className="text-red-500" />;
      case 'Eau': return <Droplets className="text-blue-500" />;
      case 'Terre': return <Mountain className="text-amber-600" />;
      case 'Air': return <Wind className="text-gray-400" />;
      default: return null;
    }
  };

  const activeResult = result ? (buniDict[result.remainder as keyof typeof buniDict] || buniDict[1]) : null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Link to="/tools" className="inline-flex items-center text-rose-600 hover:text-rose-700 mb-4 font-medium transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            {t("common.backToTools", "Retour au tableau de bord")}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Scale className="text-rose-500" size={32} />
            {dict.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mt-2">{t("tools.spiritual-compatibility.description")}</p>
        </div>

        <button
          onClick={() => setShowHistory(true)}
          className="mt-6 px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
        >
          <History size={16} />
          <span>{language === 'ha' ? 'Tarihi' : language === 'en' ? 'History' : 'Historique'}</span>
        </button>
      </div>

      <CalculationHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        toolFilter="compatibility"
        onSelectCalculation={(item) => {
          if (item.details?.name1 && item.details?.name2) {
            setName1(item.details.name1);
            setName2(item.details.name2);
          }
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Users size={20} className="text-rose-500" />
              {dict.partnerHeader}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{dict.p1}</label>
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  placeholder={dict.placeholder1}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-right font-arabic text-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  dir="rtl"
                />
              </div>
              
              <div className="flex justify-center my-2 text-rose-300">
                <Heart size={24} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{dict.p2}</label>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder={dict.placeholder2}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-right font-arabic text-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  dir="rtl"
                />
              </div>

              <button
                onClick={calculateCompatibility}
                disabled={!name1 || !name2 || isCalculating}
                className="w-full mt-6 bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    {dict.calculating}
                  </>
                ) : (
                  <>
                    <Scale size={20} />
                    {dict.calcButton}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {result && activeResult ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Result Principal */}
              <div className={`rounded-2xl p-6 shadow-md border ${
                activeResult.type === 'good' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                activeResult.type === 'bad' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-sm font-bold uppercase tracking-wider opacity-70 mb-1 block">{dict.verdictLabel}</span>
                    <h2 className={`text-2xl font-bold ${
                      activeResult.type === 'good' ? 'text-emerald-700 dark:text-emerald-400' :
                      activeResult.type === 'bad' ? 'text-red-700 dark:text-red-400' :
                      'text-blue-700 dark:text-blue-400'
                    }`}>{activeResult.title}</h2>
                  </div>
                  <div className={`text-4xl font-serif font-bold opacity-30 ${
                      activeResult.type === 'good' ? 'text-emerald-700 dark:text-emerald-400' :
                      activeResult.type === 'bad' ? 'text-red-700 dark:text-red-400' :
                      'text-blue-700 dark:text-blue-400'
                    }`}>
                    {result.remainder}
                  </div>
                </div>
                <p className={`text-lg font-medium leading-relaxed ${
                  activeResult.type === 'good' ? 'text-emerald-800 dark:text-emerald-200' :
                  activeResult.type === 'bad' ? 'text-red-800 dark:text-red-200' :
                  'text-blue-800 dark:text-blue-200'
                }`}>
                  {activeResult.desc}
                </p>
              </div>

              {/* Analyse Detaillee */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">{dict.mysticMath}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>{dict.abjad1Label}</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">{result.abjad1}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>{dict.abjad2Label}</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">{result.abjad2}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-100 dark:border-gray-700">
                      <span>{dict.totalLabel}</span>
                      <span className="font-mono font-bold text-rose-600">{result.total}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                      <span>{dict.remainderLabel}</span>
                      <span className="font-mono">{result.remainder}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">{dict.elementalAnalysis}</h3>
                  <div className="flex items-center justify-center gap-6 mb-4 mt-2">
                    <div className="text-center">
                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl inline-block mb-2">
                        <ElementIcon element={result.elem1} />
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white">{translateElement(result.elem1, langKey)}</p>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600 font-bold text-xl">VS</span>
                    <div className="text-center">
                      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl inline-block mb-2">
                        <ElementIcon element={result.elem2} />
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white">{translateElement(result.elem2, langKey)}</p>
                    </div>
                  </div>
                  <div className="text-center text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 py-2 rounded-lg">
                    {result.elemCompatibility}
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-dashed rounded-2xl h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mb-4">
                <Scale size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{dict.waitingTitle}</h3>
              <p className="text-gray-500 dark:text-gray-300 max-w-sm">
                {dict.waitingDesc}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
