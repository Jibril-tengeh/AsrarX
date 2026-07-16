import React, { useState } from 'react';
import { BookOpen, Key, ArrowLeft, RefreshCw, Sparkles, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { motion } from 'motion/react';

const JAFAR_RESPONSES: Record<string, string[]> = {
  fr: [
    "La patience est ta clé, l'issue est proche.",
    "Ce que tu cherches te cherche également, avance avec foi.",
    "Un obstacle caché doit être purifié avant la réussite.",
    "La lumière est au bout de ce chemin, ne désespère pas.",
    "Le secret réside dans le silence, garde tes intentions cachées.",
    "Une aide inattendue viendra dénouer cette situation.",
    "La réponse est en toi, écoute ton intuition première."
  ],
  en: [
    "Patience is your key, the outcome is near.",
    "What you seek is also seeking you, move forward with faith.",
    "A hidden obstacle must be purified before success.",
    "Light is at the end of this path, do not despair.",
    "The secret lies in silence, keep your intentions hidden.",
    "Unexpected help will arrive to resolve this situation.",
    "The answer is within you, listen to your first intuition."
  ],
  ha: [
    "Yin hakuri shi ne mabudinka, karshen lamarin yana kusa.",
    "Abin da kake nema shi ma yana nemanka, matsa gaba da imani.",
    "Dole ne a tsarkake wani cikas na boye kafin samun nasara.",
    "Haske yana karshen wannan hanya, kada ka fidda tsammani.",
    "Sirrin yana cikin yin shiru, ka bar nufinka a boye.",
    "Taimako na farat daya zai zo don warware wannan lamari.",
    "Amsar tana cikin zuciyarka, saurari tunaninka na farko."
  ]
};

const JAFAR_LABELS: Record<string, any> = {
  fr: {
    back: "Retour aux outils",
    title: "Oracle de l'Imam Ali (Ilm al-Jafar)",
    askQuestion: "Posez votre question (en arabe ou lettres)",
    placeholder: "Ex: هل سأنجح في هذا العمل؟",
    consult: "Consulter le Jafar",
    calculating: "Calcul en cours...",
    originalLetters: "1. Lettres Originales",
    taksir: "2. Le Taksir (Fracturation)",
    uniqueLetters: "3. Racine Unique (Istikhraj)",
    responseTitle: "Natiqhat al-Jafar (La Réponse)"
  },
  en: {
    back: "Back to tools",
    title: "Oracle of Imam Ali (Ilm al-Jafar)",
    askQuestion: "Ask your question (in Arabic or letters)",
    placeholder: "Ex: هل سأنجح في هذا العمل؟",
    consult: "Consult the Jafar",
    calculating: "Calculating...",
    originalLetters: "1. Original Letters",
    taksir: "2. The Taksir (Fracturing)",
    uniqueLetters: "3. Unique Root (Istikhraj)",
    responseTitle: "Natiqhat al-Jafar (The Answer)"
  },
  ha: {
    back: "Koma ga kayan aiki",
    title: "Duban Imam Ali (Ilm al-Jafar)",
    askQuestion: "Tambayi tambayarka (da Larabci ko haruffa)",
    placeholder: "Misali: هل سأنجح في هذا العمل؟",
    consult: "Duba Jafar",
    calculating: "Ana lissafawa...",
    originalLetters: "1. Haruffa na Asali",
    taksir: "2. Taksir (Raba Haruffa)",
    uniqueLetters: "3. Tushen Haruffa (Istikhraj)",
    responseTitle: "Natiqhat al-Jafar (Amsar)"
  }
};

export const IlmJafar: React.FC = () => {
  const { language, t } = useLanguage();
  const currentLang = (language === 'ha' || language === 'en' || language === 'fr') ? language : 'fr';
  const labels = JAFAR_LABELS[currentLang] || JAFAR_LABELS['fr'];
  const responses = JAFAR_RESPONSES[currentLang] || JAFAR_RESPONSES['fr'];

  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<{
    original: string[];
    taksir: string[];
    unique: string[];
    answer: string;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateJafar = () => {
    if (!question) return;
    setIsCalculating(true);
    
    setTimeout(() => {
      // 1. Cleaning
      const cleanQ = question.replace(/[^ء-ي]/g, '');
      // Fallback if no Arabic letters
      const letters = cleanQ.length > 0 ? cleanQ.split('') : question.replace(/\s+/g, '').split('');
      
      // 2. Taksir (Fracturing - First/Last)
      const taksir: string[] = [];
      let i = 0;
      let j = letters.length - 1;
      while (i <= j) {
        if (i === j) {
          taksir.push(letters[i]);
        } else {
          taksir.push(letters[i]);
          taksir.push(letters[j]);
        }
        i++;
        j--;
      }

      // 3. Unique Letters (Istikhraj)
      const unique = Array.from(new Set(taksir));
      
      // 4. Answer
      const inputLength = letters.length > 0 ? letters.length : question.length;
      const answerIndex = inputLength % responses.length;
      
      setResult({
        original: letters,
        taksir,
        unique,
        answer: responses[answerIndex]
      });
      
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8">
        <Link to="/tools" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4 font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {labels.back}
        </Link>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white flex flex-col sm:flex-row sm:items-center gap-3 break-words">
          <Key className="text-purple-500 shrink-0" size={32} />
          {labels.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base break-words">{t("tools.ilm-jafar.description")}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-8">
        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <MessageCircle size={18} className="text-purple-500 shrink-0"/>
          {labels.askQuestion}
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={labels.placeholder}
            className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-right font-arabic text-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            dir="rtl"
          />
          <button
            onClick={calculateJafar}
            disabled={!question || isCalculating}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 sm:w-auto w-full whitespace-nowrap cursor-pointer"
          >
            {isCalculating ? <RefreshCw className="animate-spin shrink-0" size={20} /> : <Sparkles className="shrink-0" size={20} />}
            {isCalculating ? labels.calculating : labels.consult}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <ToolInfoTooltip toolId="ilm_jafar" />
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800">
              <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-800 pb-2 break-words">
                {labels.originalLetters}
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end" dir="rtl">
                {result.original.map((char, i) => (
                  <span key={i} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-arabic text-lg font-bold">
                    {char}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800">
              <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-800 pb-2 break-words">
                {labels.taksir}
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end" dir="rtl">
                {result.taksir.map((char, i) => (
                  <span key={i} className="w-8 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded border border-purple-200 dark:border-purple-800/50 font-arabic text-lg font-bold">
                    {char}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800">
              <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-800 pb-2 break-words">
                {labels.uniqueLetters}
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end" dir="rtl">
                {result.unique.map((char, i) => (
                  <span key={i} className="w-8 h-8 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-800/50 font-arabic text-lg font-bold">
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 hidden sm:block">
              <BookOpen size={150} />
            </div>
            <div className="relative z-10">
              <span className="bg-white/20 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase mb-4 sm:mb-6 inline-block whitespace-nowrap">
                {labels.responseTitle}
              </span>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold leading-relaxed mb-4 break-words">
                "{result.answer}"
              </p>
              <div className="w-16 h-1 bg-purple-500/50 mx-auto mt-4 sm:mt-6 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
