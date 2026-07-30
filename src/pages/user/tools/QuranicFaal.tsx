import React, { useState } from 'react';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

// Selected verses for Quranic Istikhara/Faal based on traditional tables
const faalOutcomes = [
  { verse: "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا", surah: "Al-Fath (48:1)", outcome: "Très Favorable", desc: "Succès éclatant, victoire et ouverture des portes. Le projet est béni." },
  { verse: "لَا تَخَفْ وَلَا تَحْزَنْ ۖ إِنَّا مُنَجُّوكَ", surah: "Al-'Ankabut (29:33)", outcome: "Rassurant", desc: "Ne craignez rien. La situation semble difficile mais l'issue sera le salut." },
  { verse: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ", surah: "Al-Baqarah (2:216)", outcome: "Patience Requise", desc: "Ce qui vous déplaît actuellement contient un grand bien caché. Soyez patient." },
  { verse: "فَاصْبِرْ صَبْرًا جَمِيلًا", surah: "Al-Ma'arij (70:5)", outcome: "Attente / Épreuve", desc: "Une belle patience est exigée. Le moment n'est pas encore venu." },
  { verse: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", surah: "Ash-Sharh (94:6)", outcome: "Favorable à terme", desc: "La difficulté actuelle sera suivie de facilité. N'abandonnez pas." },
  { verse: "فَاعْرِضْ عَنْهُمْ وَانتَظِرْ إِنَّهُم مُّنتَظِرُونَ", surah: "As-Sajdah (32:30)", outcome: "Défavorable", desc: "Détournez-vous de cette affaire. Il vaut mieux s'en abstenir." },
  { verse: "وَاللَّهُ يَعْصِمُكَ مِنَ النَّاسِ", surah: "Al-Ma'idah (5:67)", outcome: "Protection Divine", desc: "Vous serez protégé dans cette démarche. Allez-y avec confiance." },
];

const localDict = {
  fr: {
    title: "Istikhara Coranique (Faal)",
    conditionsTitle: "Conditions du Faal (Tirage au Sort) :",
    cond1: "Être en état de pureté (Wudu).",
    cond2: "Réciter 3 fois la sourate Al-Ikhlas et 1 fois Al-Fatiha dédiées au Prophète (SAW).",
    cond3: "Formuler l'intention pure et demander à Allah de vous guider.",
    labelIntention: "Votre Niyyah (Intention ou Question Secrète)",
    placeholderIntention: "Ex: Doit-je accepter cette offre ?",
    btnDrawing: "Consultation de la Table Gardée...",
    btnOpen: "Ouvrir le Livre",
    verseResponse: "Verset de Réponse",
    alertIntention: "Veuillez formuler votre intention dans votre cœur d'abord.",
    outcomeFavorable: "Très Favorable",
    outcomeRassurant: "Rassurant",
    outcomePatience: "Patience Requise",
    outcomeAttente: "Attente / Épreuve",
    outcomeFavTerme: "Favorable à terme",
    outcomeDefavorable: "Défavorable",
    outcomeProtection: "Protection Divine",
    descFavorable: "Succès éclatant, victoire et ouverture des portes. Le projet est béni.",
    descRassurant: "Ne craignez rien. La situation semble difficile mais l'issue sera le salut.",
    descPatience: "Ce qui vous déplaît actuellement contient un grand bien caché. Soyez patient.",
    descAttente: "Une belle patience est exigée. Le moment n'est pas encore venu.",
    descFavTerme: "La difficulté actuelle sera suivie de facilité. N'abandonnez pas.",
    descDefavorable: "Détournez-vous de cette affaire. Il vaut mieux s'en abstenir.",
    descProtection: "Vous serez protégé dans cette démarche. Allez-y avec confiance."
  },
  en: {
    title: "Quranic Istikhara (Faal)",
    conditionsTitle: "Conditions of Faal (Drawing of Lots):",
    cond1: "Be in a state of purity (Wudu).",
    cond2: "Recite Surah Al-Ikhlas 3 times and Al-Fatiha 1 time dedicated to the Prophet (SAW).",
    cond3: "Formulate a pure intention and ask Allah to guide you.",
    labelIntention: "Your Niyyah (Intention or Secret Question)",
    placeholderIntention: "E.g., Should I accept this offer?",
    btnDrawing: "Consulting the Preserved Tablet...",
    btnOpen: "Open the Book",
    verseResponse: "Response Verse",
    alertIntention: "Please formulate your intention in your heart first.",
    outcomeFavorable: "Very Favorable",
    outcomeRassurant: "Reassuring",
    outcomePatience: "Patience Required",
    outcomeAttente: "Waiting / Trial",
    outcomeFavTerme: "Favorable in the end",
    outcomeDefavorable: "Unfavorable",
    outcomeProtection: "Divine Protection",
    descFavorable: "Brilliant success, victory, and opening of doors. The project is blessed.",
    descRassurant: "Fear nothing. The situation seems difficult, but the outcome will be salvation.",
    descPatience: "What displeases you currently contains a great hidden good. Be patient.",
    descAttente: "Beautiful patience is required. The time has not yet come.",
    descFavTerme: "The current difficulty will be followed by ease. Do not give up.",
    descDefavorable: "Turn away from this matter. It is better to abstain from it.",
    descProtection: "You will be protected in this process. Go ahead with confidence."
  },
  ha: {
    title: "Istikhara ta Alqur'ani (Faal)",
    conditionsTitle: "Sharuddan Faal (Tirawa):",
    cond1: "Kasancewa cikin tsarki (Alwala).",
    cond2: "Karanta Suratul Ikhlas kafa 3 da Al-Fatiha kafa 1 sadaukar ga Manzo (SAW).",
    cond3: "Kudurta kyakkyawar niyya kuma ka roki Allah Ya shirye ka.",
    labelIntention: "Niyyar ku (Niyya ko Tambaya ta Ciki)",
    placeholderIntention: "Misali: Shin in karɓi wannan tayin?",
    btnDrawing: "Neman shawara daga Allon Shiriya...",
    btnOpen: "Buɗe Littafin",
    verseResponse: "Ayar Amsa",
    alertIntention: "Da fatan za ku fara kudurta niyyar ku a cikin zuciyar ku tukunna.",
    outcomeFavorable: "Yana da kyau sosai",
    outcomeRassurant: "Abin kwantar da hankali",
    outcomePatience: "Ana buƙatar haƙuri",
    outcomeAttente: "Jira / Jarrabawa",
    outcomeFavTerme: "Zai yi kyau a ƙarshe",
    outcomeDefavorable: "Ba shi da kyau",
    outcomeProtection: "Kariyar Ubangiji",
    descFavorable: "Babban nasara da buɗe kofofi. Wannan shiri yana da albarka.",
    descRassurant: "Kada ku ji tsoro. Al'amarin yana da wuya amma ƙarshensa tsira ne.",
    descPatience: "Abin da kuke ƙyamata a halin yanzu akwai alheri babba a cikinsa. Ku yi haƙuri.",
    descAttente: "Ana buƙatar kyakkyawan haƙuri. Lokaci bai yi ba tukunna.",
    descFavTerme: "Wahalar yanzu za ta biyo baya da sauƙi. Kada ku karaya.",
    descDefavorable: "Ku kau da kai daga wannan al'amari. Zai fi kyau ku bar shi.",
    descProtection: "Za a kare ku a cikin wannan tafiya. Ku ci gaba da kwarin gwiwa."
  }
};

const getLocalizedOutcome = (outcome: string, lang: 'fr' | 'en' | 'ha') => {
  const dict = localDict[lang] || localDict.fr;
  if (outcome === "Très Favorable") return dict.outcomeFavorable;
  if (outcome === "Rassurant") return dict.outcomeRassurant;
  if (outcome === "Patience Requise") return dict.outcomePatience;
  if (outcome === "Attente / Épreuve") return dict.outcomeAttente;
  if (outcome === "Favorable à terme") return dict.outcomeFavTerme;
  if (outcome === "Défavorable") return dict.outcomeDefavorable;
  if (outcome === "Protection Divine") return dict.outcomeProtection;
  return outcome;
};

const getLocalizedDesc = (desc: string, lang: 'fr' | 'en' | 'ha') => {
  const dict = localDict[lang] || localDict.fr;
  if (desc.startsWith("Succès éclatant")) return dict.descFavorable;
  if (desc.startsWith("Ne craignez rien")) return dict.descRassurant;
  if (desc.startsWith("Ce qui vous déplaît")) return dict.descPatience;
  if (desc.startsWith("Une belle patience")) return dict.descAttente;
  if (desc.startsWith("La difficulté actuelle")) return dict.descFavTerme;
  if (desc.startsWith("Détournez-vous")) return dict.descDefavorable;
  if (desc.startsWith("Vous serez protégé")) return dict.descProtection;
  return desc;
};

export const QuranicFaal: React.FC = () => {
  const { t, language } = useLanguage();
  const dict = localDict[(language as 'fr' | 'en' | 'ha') || 'fr'] || localDict.fr;
  const [intention, setIntention] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<typeof faalOutcomes[0] | null>(null);

  const performFaal = () => {
    if (!intention) {
      alert(dict.alertIntention);
      return;
    }

    setIsDrawing(true);
    setResult(null);

    // Simulate spiritual delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * faalOutcomes.length);
      setResult(faalOutcomes[randomIndex]);
      setIsDrawing(false);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/tools" className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft className="text-gray-600 dark:text-gray-300" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-blue-600" />
            {dict.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-300">{t("tools.quranic-faal.description")}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 sm:p-6 border border-blue-100 dark:border-blue-800/30 flex items-start gap-4 mb-8">
          <AlertCircle className="text-blue-500 shrink-0 mt-1" />
          <div className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
            <p className="font-bold mb-2">{dict.conditionsTitle}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{dict.cond1}</li>
              <li>{dict.cond2}</li>
              <li>{dict.cond3}</li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            {dict.labelIntention}
          </label>
          <input
            type="text"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder={dict.placeholderIntention}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-base font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={performFaal}
          disabled={isDrawing || !intention}
          className="w-full h-[60px] rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isDrawing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {dict.btnDrawing}
            </>
          ) : (
            <>
              <BookOpen size={20} />
              {dict.btnOpen}
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {result && !isDrawing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 border-2 border-blue-100 dark:border-blue-900 shadow-xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
            
            <p className="text-gray-500 dark:text-gray-300 font-medium mb-6 uppercase tracking-widest text-sm">{dict.verseResponse}</p>
            
            <div className="text-3xl sm:text-4xl font-arabic font-bold text-gray-900 dark:text-white leading-loose mb-4">
              {result.verse}
            </div>
            
            <div className="inline-block px-4 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold mb-8">
              {result.surah}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-8 mt-2">
              <h3 className={`text-xl font-bold mb-2 ${
                result.outcome.includes('Favorable') ? 'text-emerald-500' :
                result.outcome.includes('Défavorable') ? 'text-rose-500' :
                'text-amber-500'
              }`}>
                {getLocalizedOutcome(result.outcome, language as 'fr' | 'en' | 'ha')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg max-w-lg mx-auto">
                {getLocalizedDesc(result.desc, language as 'fr' | 'en' | 'ha')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
