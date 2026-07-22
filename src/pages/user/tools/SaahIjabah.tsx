import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Sparkles, Moon, Sun, Flame, Wind, Droplets, Mountain, Compass, Play, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getCurrentPlanetaryHour } from '../../../utils/planetaryNotifications';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';

const ABJAD_MAP: { [key: string]: number } = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ى': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
  'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000
};

const LUNAR_MANSIONS = [
  { id: 1, name: 'Al-Sharatain', arabic: 'الشرطين', element: 'Feu', status: 'Excellente (Ouverture)' },
  { id: 2, name: 'Al-Butain', arabic: 'البطين', element: 'Terre', status: 'Propice (Prospérité)' },
  { id: 3, name: 'Al-Thurayya', arabic: 'الثريا', element: 'Air', status: 'Bénie (Richesse & Gloire)' },
  { id: 4, name: 'Al-Dabaran', arabic: 'الدبران', element: 'Eau', status: 'Neutre (Concentration)' },
  { id: 5, name: 'Al-Haq\'ah', arabic: 'الهقعة', element: 'Feu', status: 'Excellente (Sagesse)' },
  { id: 6, name: 'Al-Han\'ah', arabic: 'الهنعة', element: 'Terre', status: 'Propice (Amour & Paix)' },
  { id: 7, name: 'Al-Dhira\'', arabic: 'الذراع', element: 'Air', status: 'Bénie (Protection)' },
  { id: 8, name: 'Al-Nathrah', arabic: 'Nathrah', element: 'Eau', status: 'Favorable (Guérison)' },
];

export const SaahIjabah: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [abjadScore, setAbjadScore] = useState<number | null>(null);
  const [element, setElement] = useState<{ name: string; icon: any; color: string; desc: string; names: string[] } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPlanet, setCurrentPlanet] = useState(getCurrentPlanetaryHour());
  const [countdown, setCountdown] = useState<string>('');

  // Live Clock Update
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setCurrentPlanet(getCurrentPlanetaryHour());

      // Countdown to next planetary hour boundary
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const remainingMinutes = 59 - minutes;
      const remainingSeconds = 59 - seconds;
      setCountdown(`${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateAbjad = (text: string) => {
    let total = 0;
    for (const char of text) {
      if (ABJAD_MAP[char]) {
        total += ABJAD_MAP[char];
      }
    }
    return total;
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    const uVal = calculateAbjad(userName);
    const mVal = calculateAbjad(motherName);
    const total = uVal + mVal;
    setAbjadScore(total);

    const remainder = total % 4;
    if (remainder === 1) {
      setElement({
        name: "Nār (Feu - ناري)",
        icon: Flame,
        color: "from-amber-500 to-red-600",
        desc: "Énergie vive, action rapide et élévation spirituelle ardente.",
        names: ["Ya Qawiyyu (يا قوي)", "Ya 'Azizu (يا عزيز)", "Ya Jabbaru (يا جبار)", "Ya Qahharu (يا قهار)"],
      });
    } else if (remainder === 2) {
      setElement({
        name: "Turāb (Terre - ترابي)",
        icon: Mountain,
        color: "from-amber-700 to-yellow-800",
        desc: "Stabilité, ancrage, concrétisation matérielle et protection durable.",
        names: ["Ya Razzaqu (يا رزاق)", "Ya Matinu (يا متين)", "Ya Hafizu (يا حفيظ)", "Ya Malik (يا مالك)"],
      });
    } else if (remainder === 3) {
      setElement({
        name: "Hawā' (Air - هوائي)",
        icon: Wind,
        color: "from-blue-500 to-indigo-600",
        desc: "Intellect, communication, rayonnement et équilibre relationnel.",
        names: ["Ya Latifu (يا لطيف)", "Ya 'Alimu (يا عليم)", "Ya Khabiru (يا خبير)", "Ya Sami'u (يا سميع)"],
      });
    } else {
      setElement({
        name: "Mā' (Eau - مائي)",
        icon: Droplets,
        color: "from-emerald-500 to-teal-700",
        desc: "Guérison, douceur, intuition et purification des émotions.",
        names: ["Ya Rahmanu (يا رحمن)", "Ya Rahimu (يا رحيم)", "Ya Wadudu (يا ودود)", "Ya Shafi (يا شافعي)"],
      });
    }
  };

  const launchTasbih = (nameStr: string) => {
    localStorage.setItem('asrar_tasbih_preset', JSON.stringify({
      title: nameStr,
      targetCount: abjadScore || 100,
    }));
    navigate('/tools/tasbih');
  };

  const currentMansionIndex = Math.floor((currentTime.getDate() + currentTime.getHours()) % LUNAR_MANSIONS.length);
  const currentMansion = LUNAR_MANSIONS[currentMansionIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            <span>{t("common.back")}</span>
          </Link>
          <ToolInfoTooltip toolId="saah_ijabah" />
        </div>

        {/* Hero Title */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-zinc-950 p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/20 text-zinc-950 font-bold text-xs">
              <Clock size={14} />
              <span>Sā'ah al-Ijābah • Horloge d'Exaucement Divin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif">
              Fenêtres Célestes & Alignement Spirituel
            </h1>
            <p className="text-xs sm:text-sm opacity-90 max-w-xl leading-relaxed">
              Déterminez l'instant propice exact (Sa'at al-Ijaba) pour vos du'a et vos zikrs en croisant les révolutions planétaires et votre signature numérique.
            </p>
          </div>
        </div>

        {/* Live Alignment Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Real-time Planet */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Sun size={16} />
                Heure Planétaire Actuelle
              </span>
              <span className="text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                {currentPlanet.isDaytime ? 'Jour ☀️' : 'Nuit 🌙'}
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span>{currentPlanet.planet.symbol}</span>
                <span>{currentPlanet.planet.name}</span>
                <span className="text-sm font-arabic font-normal text-amber-600 dark:text-amber-400">({currentPlanet.planet.arabic})</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{currentPlanet.planet.favorability}</p>
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">Prochain Changement:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 animate-pulse">{countdown}</span>
            </div>
          </div>

          {/* Lunar Mansion */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-indigo-200/60 dark:border-indigo-900/40 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Moon size={16} />
                Demeure de la Lune
              </span>
              <span className="text-xs font-mono font-bold bg-indigo-100 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                {currentMansion.element}
              </span>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {currentMansion.name}
              </div>
              <div className="text-sm font-arabic text-indigo-500 dark:text-indigo-400 font-bold">
                {currentMansion.arabic}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">{currentMansion.status}</p>
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 text-[11px] text-gray-400">
              Alignement Lunaire pour le Zikr
            </div>
          </div>

          {/* Global Window Status */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Sparkles size={16} />
                Vibration de l'Heure
              </span>
              <CheckCircle2 size={18} className="text-emerald-400" />
            </div>
            <div className="space-y-1">
              <div className="text-lg font-black text-emerald-200">
                Fenêtre Propice Ouverte
              </div>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Moment favorable pour l'invocation divine et l'orientation des demandes spirituelles.
              </p>
            </div>
            <button
              onClick={() => launchTasbih(`Zikr de la Sā'ah (${currentPlanet.planet.name})`)}
              className="w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Play size={14} fill="currentColor" />
              <span>Démarrer Zikr Propice</span>
            </button>
          </div>

        </div>

        {/* User Elemental Abjad Cross-Analysis */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Compass className="text-amber-500" size={20} />
              <span>Alignement Élémentaire & Nom Personnel</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Entrez votre prénom (en lettres arabes de préférence) pour calculer votre tempérament et vos Noms Divins associés.
            </p>
          </div>

          <form onSubmit={handleAnalyze} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Votre Prénom (ex: محمد)"
              className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500 font-arabic"
            />
            <input
              type="text"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder="Nom de la Mère (Optionnel ex: مريم)"
              className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500 font-arabic"
            />
            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-zinc-950 font-bold text-sm hover:from-amber-600 hover:to-yellow-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Calculer l'Alignement</span>
            </button>
          </form>

          {/* Analysis Output */}
          {element && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 p-4 rounded-2xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${element.color} text-white`}>
                    <element.icon size={24} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">Poids Abjad : {abjadScore}</span>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">{element.name}</h3>
                  </div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300 max-w-sm">{element.desc}</span>
              </div>

              {/* Recommended Divine Names */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity size={14} className="text-amber-500" />
                  <span>Noms Divins Recommandés pour cet Alignement :</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {element.names.map((n, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                    >
                      <span className="font-arabic font-bold text-lg text-emerald-600 dark:text-emerald-400">{n}</span>
                      <button
                        onClick={() => launchTasbih(n)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Play size={12} fill="currentColor" />
                        <span>Pratiquer</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};
