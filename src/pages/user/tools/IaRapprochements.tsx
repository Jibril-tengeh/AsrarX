import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, BrainCircuit, Moon, Compass, Calculator, Play, RefreshCw, Send, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { motion, AnimatePresence } from 'motion/react';
import { calculateAbjadValue } from '../../../utils/abjad';
import { getCurrentCelestialContext } from '../../../utils/celestial';

interface RapprochementResult {
  synthesis: string;
  focusName: string;
  zikrRecommendation: string;
  targetCount: number;
  recommendedArabic: string;
  recommendedNameOnly: string;
  spiritualBenefit: string;
}

export const IaRapprochements: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState(() => localStorage.getItem('asrarhub_user_name') || '');
  const [dream, setDream] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RapprochementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [celestial, setCelestial] = useState(getCurrentCelestialContext());

  useEffect(() => {
    // Keep local storage username updated
    if (name) {
      localStorage.setItem('asrarhub_user_name', name);
    }
  }, [name]);

  const nameAbjad = calculateAbjadValue(name);

  const handleAnalyze = async () => {
    if (!name || !dream) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/gemini/spiritual-rapprochements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: name,
          nameAbjad,
          dreamContent: dream,
          currentPlanet: celestial.planet.name,
          currentMansion: celestial.mansion.name
        })
      });

      if (!response.ok) {
        throw new Error("Erreur serveur lors de la génération de l'analyse");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("Impossible de générer le rapprochement ésotérique. Veuillez vérifier votre connexion ou réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const startPracticeInTasbih = () => {
    if (!result) return;
    const nameEnc = encodeURIComponent(result.recommendedNameOnly);
    const arabicEnc = encodeURIComponent(result.recommendedArabic);
    const targetVal = result.targetCount;
    navigate(`/tools/tasbih?name=${nameEnc}&arabic=${arabicEnc}&target=${targetVal}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/tools" 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="text-purple-600 dark:text-purple-400" />
            IA Rapprochements Ésotériques
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Croisez vos rêves, votre identité mystique, et les mouvements célestes actuels.
          </p>
        </div>
      </div>

      {/* Warning/Guide */}
      <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-200 dark:border-purple-900/50 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3.5 relative overflow-hidden">
        <Sparkles className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" size={22} />
        <div className="text-sm text-purple-900 dark:text-purple-200 font-medium">
          <p className="font-bold mb-1">Comment fonctionne l'outil ?</p>
          <p className="leading-relaxed text-xs">
            Dans la science classique d'Asrar, les événements subtils (les rêves), les forces fixes (la vibration numérique du nom) et les mouvements cosmiques (les planètes et manazil) convergent à chaque instant. Cet assistant croise intelligemment ces dimensions à l'aide de l'IA pour synthétiser un Wird unique et sur-mesure d'ouverture et d'alignement spirituel.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Left Form Side */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
          {/* User Name Input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              Votre Prénom / Nom de Pratique (Arabe ou Français)
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mohamed, Aïsha..."
                className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none text-sm font-semibold"
              />
              {name && (
                <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 px-3.5 py-3 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-[70px]">
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-bold leading-none">Abjad</span>
                  <span className="text-sm font-black text-purple-950 dark:text-white mt-1">{nameAbjad}</span>
                </div>
              )}
            </div>
          </div>

          {/* Dream/Vision Input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              Décrivez votre rêve récent, vision, ou ressenti du moment
            </label>
            <textarea
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              placeholder="Ex: J'ai rêvé de gravir une colline sous une pluie douce et d'apercevoir une lumière brillante..."
              rows={4}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none text-sm leading-relaxed"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!name || !dream || loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm disabled:opacity-50 hover:shadow-lg active:scale-99 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={18} />
                <span>Analyse ésotérique en cours...</span>
              </>
            ) : (
              <>
                <BrainCircuit size={18} />
                <span>Calculer & Rapprocher les Éléments</span>
              </>
            )}
          </button>
        </div>

        {/* Right Celestial Status Side */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
          <h3 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Forces Célestes de l'Instant
          </h3>

          {/* Planet */}
          <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-200/40 dark:border-amber-800/20 flex gap-3 items-start">
            <Compass className="text-amber-500 shrink-0 mt-0.5 animate-spin-slow" size={18} />
            <div>
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Planète Active</span>
              <p className="font-bold text-sm text-gray-900 dark:text-white mt-0.5">{celestial.planet.name} ({celestial.planet.arabic})</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{celestial.planet.desc}</p>
            </div>
          </div>

          {/* Mansion */}
          <div className="p-3.5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-200/40 dark:border-indigo-800/20 flex gap-3 items-start">
            <Moon className="text-indigo-500 shrink-0 mt-0.5 animate-pulse" size={18} />
            <div>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Demeure Lunaire</span>
              <p className="font-bold text-sm text-gray-900 dark:text-white mt-0.5">{celestial.mansion.name} ({celestial.mansion.arabic})</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{celestial.mansion.descFr}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 rounded-2xl text-center">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Heures Célestes</span>
            <p className="text-xs font-black text-gray-700 dark:text-gray-300 mt-1">{celestial.planet.timeStart} - {celestial.planet.timeEnd}</p>
          </div>
        </div>
      </div>

      {/* Tool Info Tooltip */}
      <div className="mb-8">
        <ToolInfoTooltip toolId={"ia-rapprochements" as any} />
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200 text-sm font-semibold"
          >
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 dark:bg-zinc-950 text-zinc-100 rounded-3xl p-6 sm:p-8 border-2 border-purple-900/50 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-600/10 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Analyse de Convergence Ésotérique</span>
                <h2 className="font-bold text-xl sm:text-2xl text-white mt-1 flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400 shrink-0" size={24} />
                  Vos Rapprochements Personnalisés
                </h2>
              </div>
              {result.focusName && (
                <div className="bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-2xl shrink-0 flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-bold">Vibration Divine:</span>
                  <span className="font-bold text-purple-400 font-arabic text-sm">{result.focusName}</span>
                </div>
              )}
            </div>

            {/* Synthesis content */}
            <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed mb-8 whitespace-pre-line space-y-4">
              {result.synthesis}
            </div>

            {/* Suggested practice card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 to-indigo-950/40 border border-purple-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 relative overflow-hidden">
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex flex-col items-center justify-center shadow-lg border border-purple-500/20 shrink-0">
                  <span className="text-sm font-black text-purple-400 leading-none">{result.targetCount}x</span>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">fois</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-400">
                    Wird de Rapprochement à Pratiquer
                  </span>
                  <h4 className="font-bold text-white text-base sm:text-lg mt-0.5 flex items-baseline gap-2.5 flex-wrap">
                    <span>{result.recommendedNameOnly}</span>
                    <span className="text-base font-arabic text-purple-400 font-semibold" dir="rtl">{result.recommendedArabic}</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    {result.spiritualBenefit}
                  </p>
                </div>
              </div>
              <button
                onClick={startPracticeInTasbih}
                className="shrink-0 w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-600/10 hover:shadow-purple-600/20 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer self-stretch md:self-auto"
              >
                <Play size={14} fill="currentColor" />
                <span>Charger dans le Tasbih</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
