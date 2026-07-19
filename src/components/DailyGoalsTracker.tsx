import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db, isAutoSaveEnabled } from '../lib/firebase';
import { doc, onSnapshot, updateDoc, collection } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarCheck, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  PlusCircle, 
  Activity, 
  Heart, 
  Flame,
  ChevronDown,
  ChevronUp,
  Users,
  MapPin,
  X,
  Bell
} from 'lucide-react';

interface DailyGoal {
  id: string;
  text: string;
  completed: boolean;
}

const localTranslations: Record<string, Record<string, string>> = {
  fr: {
    modalTitle: "Cercles de Zikr Collectifs",
    recentLaunch: "Lancement Récent :",
    from: "de",
    launchedText: "a lancé le zikr collectif",
    times: "fois !",
    descriptionText: "Rejoignez n’importe quel cercle actif pour réciter ensemble et contribuer à atteindre les objectifs sacrés.",
    createdBy: "Lancé par",
    joinBtn: "Rejoindre",
    createCircle: "Créer un Cercle",
    closeBtn: "Fermer",
    tooltipJoin: "Rejoindre un Cercle de Zikr Collectif"
  },
  en: {
    modalTitle: "Collective Zikr Circles",
    recentLaunch: "Recent Launch:",
    from: "from",
    launchedText: "launched the collective zikr",
    times: "times!",
    descriptionText: "Join any active circle to recite together and contribute to reaching the holy targets.",
    createdBy: "Created by",
    joinBtn: "Join",
    createCircle: "Create a Circle",
    closeBtn: "Close",
    tooltipJoin: "Join a Collective Zikr Circle"
  },
  ha: {
    modalTitle: "Halaƙobin Zikiri na Al'umma",
    recentLaunch: "Sabuwar Sanarwa:",
    from: "daga",
    launchedText: "ya ƙaddamar da zikiri na haɗin gwiwa",
    times: "sau kuɗi!",
    descriptionText: "Shiga kowane da'ira mai aiki don yin karatu tare da bayar da gudunmawa don cimma burin tsarki.",
    createdBy: "Wanda ya samar",
    joinBtn: "Shiga",
    createCircle: "Ƙirƙiri Da'ira",
    closeBtn: "Rufe",
    tooltipJoin: "Shiga Tsarin Zikiri na Haɗin Gwiwa"
  }
};

const DEFAULT_GOALS: DailyGoal[] = [];

export const DailyGoalsTracker: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const lang = language === 'en' || language === 'ha' ? language : 'fr';
  const tLocal = (key: string) => localTranslations[lang][key] || localTranslations['fr'][key] || key;
  const navigate = useNavigate();
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'local'>('local');
  const [newGoalText, setNewGoalText] = useState('');
  const [lastReset, setLastReset] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Collective Circles integration
  const [activeCircles, setActiveCircles] = useState<any[]>([]);
  const [isCollectiveModalOpen, setIsCollectiveModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'halaqat'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      list.sort((a, b) => b.createdAt - a.createdAt);
      setActiveCircles(list);
    }, (error) => {
      console.warn("Using offline fallback mock for collective circles in DailyGoalsTracker:", error);
      // Fallback
      setActiveCircles([
        {
          id: 'mock_1',
          title: language === 'en' ? 'Mawlid Salawat Unified Circle' : language === 'ha' ? 'Halaqar Salawat na Mawlidi' : 'Grand Cercle Salawat du Mawlid',
          target: 100000,
          count: 42150,
          type: 'Salawat (Allāhumma ṣalli ʿalā Muḥammad)',
          creatorName: 'Seydou Diop',
          creatorCountry: 'Sénégal',
          creatorCity: 'Dakar',
          createdAt: Date.now() - 86400000
        },
        {
          id: 'mock_2',
          title: language === 'en' ? 'Istighfar Circle for Peace' : language === 'ha' ? 'Halaqar Istighfari Don Zaman Lafiya' : 'Cercle Istighfar de la Paix',
          target: 70000,
          count: 31200,
          type: 'Istighfar (Astaghfirullāh al-ʿAẓīm)',
          creatorName: 'Amina Al-Hassan',
          creatorCountry: 'Nigeria',
          creatorCity: 'Kano',
          createdAt: Date.now() - 43200000
        }
      ]);
    });
    return () => unsubscribe();
  }, [language]);

  // Get current date string: YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Load goals
  useEffect(() => {
    const today = getTodayStr();

    if (!user) {
      // Local storage for guests
      try {
        const localGoals = localStorage.getItem('asrarhub_daily_goals');
        const localReset = localStorage.getItem('asrarhub_daily_goals_last_reset');
        
        let loadedGoals: DailyGoal[] = [];
        if (localGoals) {
          loadedGoals = JSON.parse(localGoals);
        } else {
          loadedGoals = [...DEFAULT_GOALS];
        }

        if (localReset !== today) {
          // New day reset
          const resetGoals = loadedGoals.map(g => ({ ...g, completed: false }));
          setGoals(resetGoals);
          setLastReset(today);
          localStorage.setItem('asrarhub_daily_goals', JSON.stringify(resetGoals));
          localStorage.setItem('asrarhub_daily_goals_last_reset', today);
        } else {
          setGoals(loadedGoals);
          setLastReset(localReset || today);
        }
      } catch (e) {
        setGoals([...DEFAULT_GOALS]);
      }
      setSyncStatus('local');
      setLoading(false);
      return;
    }

    // Firestore for logged in users
    setSyncStatus('syncing');
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        let dbGoals: DailyGoal[] = data.dailyRoutines || [];
        const dbLastReset = data.dailyRoutinesLastReset || '';

        if (dbGoals.length === 0) {
          dbGoals = [...DEFAULT_GOALS];
        }

        if (dbLastReset !== today) {
          // New day reset
          const resetGoals = dbGoals.map(g => ({ ...g, completed: false }));
          setGoals(resetGoals);
          setLastReset(today);
          
          // Save back to DB if auto save is enabled
          if (isAutoSaveEnabled()) {
            updateDoc(userRef, {
              dailyRoutines: resetGoals,
              dailyRoutinesLastReset: today
            }).catch(err => console.error("Error resetting daily routines in DB:", err));
          }
        } else {
          setGoals(dbGoals);
          setLastReset(dbLastReset || today);
        }
      } else {
        // If user doc doesn't exist yet, fallback to default
        setGoals([...DEFAULT_GOALS]);
        setLastReset(today);
      }
      setSyncStatus('synced');
      setLoading(false);
    }, (error) => {
      console.error("Error in daily goals listener:", error);
      setSyncStatus('local');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Save helper
  const saveGoals = async (updatedGoals: DailyGoal[]) => {
    setGoals(updatedGoals);
    const today = getTodayStr();
    setSyncStatus('syncing');

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      try {
        if (isAutoSaveEnabled()) {
          await updateDoc(userRef, {
            dailyRoutines: updatedGoals,
            dailyRoutinesLastReset: today
          });
          setSyncStatus('synced');
        } else {
          // Keep local backup even for logged in user if autosave is disabled
          localStorage.setItem('asrarhub_daily_goals', JSON.stringify(updatedGoals));
          localStorage.setItem('asrarhub_daily_goals_last_reset', today);
          setSyncStatus('local');
        }
      } catch (err) {
        console.error("Error updating daily routines in Firestore:", err);
        setSyncStatus('local');
      }
    } else {
      localStorage.setItem('asrarhub_daily_goals', JSON.stringify(updatedGoals));
      localStorage.setItem('asrarhub_daily_goals_last_reset', today);
      setSyncStatus('local');
    }
  };

  // Toggle completed
  const handleToggle = (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        return { ...g, completed: !g.completed };
      }
      return g;
    });
    saveGoals(updated);
  };

  // Add routine
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const newGoal: DailyGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: newGoalText.trim(),
      completed: false
    };

    const updated = [...goals, newGoal];
    saveGoals(updated);
    setNewGoalText('');
    setShowAddForm(false);
  };

  // Delete routine
  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    saveGoals(updated);
  };

  // Delete all routines
  const handleClearAll = () => {
    if (window.confirm(t('dailyGoals.confirmClearAll', 'Voulez-vous vraiment supprimer toutes vos routines ?'))) {
      saveGoals([]);
    }
  };

  // Progress calculations
  const total = goals.length;
  const completedCount = goals.filter(g => g.completed).length;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const isAllCompleted = total > 0 && completedCount === total;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-all duration-300">
      {/* Background ambient light */}
      {isAllCompleted && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 pointer-events-none" />
      )}

      {/* Clickable Header is always visible */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center gap-3 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <CalendarCheck className="text-emerald-500 shrink-0" size={22} />
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
              {t('dailyGoals.title', 'Objectifs du Jour')}
              {syncStatus === 'synced' && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-100/30 dark:border-emerald-800/30" onClick={(e) => e.stopPropagation()}>
                  Cloud
                </span>
              )}
              {syncStatus === 'syncing' && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-100/30 dark:border-amber-800/30 animate-pulse" onClick={(e) => e.stopPropagation()}>
                  Sync...
                </span>
              )}
              {syncStatus === 'local' && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
                  Local
                </span>
              )}
            </h3>
            {!isExpanded ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {total > 0 
                  ? `${completedCount}/${total} (${percentage}%) - ${t('dailyGoals.clickToExpand', 'Cliquez pour voir')}`
                  : t('dailyGoals.emptyShort', 'Aucun objectif défini - Cliquez pour ajouter')}
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {t('dailyGoals.subtitle', 'Routines et rituels spirituels quotidiens')}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {activeCircles.length > 0 && (
            <motion.button
              type="button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: 1
              }}
              transition={{
                scale: {
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                },
                opacity: { duration: 0.3 }
              }}
              onClick={() => setIsCollectiveModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 dark:bg-rose-500/20 hover:bg-rose-500/20 border border-rose-500/30 rounded-full cursor-pointer transition-colors shadow-sm shrink-0 mr-1"
              title={tLocal('tooltipJoin')}
            >
              <div className="flex -space-x-1.5 items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white dark:border-gray-800 shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white dark:border-gray-800 shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-gray-800 shadow-sm" />
              </div>
              <span className="text-[9px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider pl-0.5">Live</span>
            </motion.button>
          )}

          {!isExpanded && total > 0 && (
            <div className="w-16 bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden hidden sm:block">
              <div 
                className="bg-emerald-500 h-full rounded-full" 
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            {/* Action buttons */}
            <div className="flex justify-end gap-2 mb-4">
              {goals.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-xl transition-colors border border-red-100/50 dark:border-red-800/30 cursor-pointer"
                  title={t('dailyGoals.clearAll', 'Tout effacer')}
                >
                  <Trash2 size={14} />
                  {t('dailyGoals.clearAll', 'Tout effacer')}
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl transition-colors border border-emerald-100/50 dark:border-emerald-800/30 cursor-pointer"
              >
                <PlusCircle size={14} />
                {t('dailyGoals.add', 'Ajouter une routine')}
              </button>
            </div>

            {/* Progress Section */}
            <div className="mb-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100/50 dark:border-gray-800/50">
              <button
                type="button"
                onClick={() => setShowProgress(!showProgress)}
                className="w-full flex justify-between items-center focus:outline-none cursor-pointer"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 select-none">
                  <Activity size={16} className="text-emerald-500" />
                  {t('dailyGoals.progress', 'Progression globale')}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {completedCount}/{total} ({percentage}%)
                  </span>
                  {showProgress ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </button>

              <AnimatePresence>
                {showProgress && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                      />
                    </div>

                    {isAllCompleted && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30"
                      >
                        <Sparkles size={14} className="text-amber-500 animate-pulse" />
                        <span>{t('dailyGoals.completedAll', 'Félicitations ! Tous vos objectifs spirituels sont atteints pour aujourd\'hui.')}</span>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Add form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddGoal}
                  className="mb-4 overflow-hidden"
                >
                  <div className="flex gap-2 p-1">
                    <input
                      type="text"
                      placeholder={t('dailyGoals.inputPlaceholder', 'Ex: Lire sourate Al-Mulk, Faire l\'aumône...')}
                      value={newGoalText}
                      onChange={(e) => setNewGoalText(e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      maxLength={80}
                      required
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-1 shrink-0"
                    >
                      {t('common.add', 'Ajouter')}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Goals List */}
            {goals.length === 0 ? (
              <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
                {t('dailyGoals.empty', 'Aucun objectif quotidien défini. Commencez par en ajouter un !')}
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {goals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    layoutId={goal.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      goal.completed 
                        ? 'bg-emerald-50/20 border-emerald-100/50 dark:bg-emerald-950/10 dark:border-emerald-900/30' 
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-750 hover:bg-gray-50 dark:hover:bg-gray-750'
                    }`}
                  >
                    <button
                      onClick={() => handleToggle(goal.id)}
                      className="flex items-center gap-3 text-left flex-1"
                    >
                      <div className="shrink-0 text-emerald-500 hover:scale-110 transition-transform">
                        {goal.completed ? (
                          <CheckCircle2 size={20} className="fill-emerald-500 text-white dark:text-gray-800" />
                        ) : (
                          <Circle size={20} className="text-gray-300 dark:text-gray-600 hover:text-emerald-500" />
                        )}
                      </div>
                      <span className={`text-sm font-medium transition-all ${
                        goal.completed 
                          ? 'text-gray-400 dark:text-gray-500 line-through' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {goal.text}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-2"
                      title={t('common.delete', 'Supprimer')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collective Circles Modal */}
      <AnimatePresence>
        {isCollectiveModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCollectiveModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-850 rounded-3xl shadow-2xl border border-gray-150 dark:border-gray-700 overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50 dark:bg-gray-800/80 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1 items-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white dark:border-gray-800 shadow-sm" />
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white dark:border-gray-800 shadow-sm" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-gray-800 shadow-sm" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                    {tLocal('modalTitle')}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCollectiveModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-650 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content body */}
              <div className="p-6 overflow-y-auto space-y-4 max-h-[60vh] scrollbar-thin">
                {/* Notification alert / header notice */}
                {activeCircles.length > 0 && (
                  <div className="bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 rounded-2xl p-4 flex items-start gap-3 shadow-inner">
                    <div className="p-2 bg-rose-500 text-white rounded-xl shrink-0 animate-bounce">
                      <Bell size={16} />
                    </div>
                    <div className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 leading-relaxed">
                      <span className="font-black">📢 {tLocal('recentLaunch')}</span>{' '}
                      <span className="font-bold text-rose-950 dark:text-rose-100">
                        {activeCircles[0].creatorName}
                      </span>{' '}
                      {tLocal('from')}{' '}
                      <span className="font-bold text-rose-950 dark:text-rose-100">
                        {activeCircles[0].creatorCountry}
                      </span>{' '}
                      {tLocal('launchedText')}{' '}
                      <span className="italic font-bold">"{activeCircles[0].title}"</span>{' '}
                      <span className="font-bold text-rose-950 dark:text-rose-100">
                        {Number(activeCircles[0].target).toLocaleString()}
                      </span>{' '}
                      {tLocal('times')}
                    </div>
                  </div>
                )}

                {/* Sub-header text */}
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed px-1">
                  {tLocal('descriptionText')}
                </p>

                {/* Active Circles List */}
                <div className="space-y-3">
                  {activeCircles.map((circle) => {
                    const progressPercent = Math.min(Math.round((circle.count / circle.target) * 100), 100);
                    return (
                      <div
                        key={circle.id}
                        className="p-4 rounded-2xl border border-gray-150 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all space-y-3"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white leading-tight truncate">
                              {circle.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1 font-mono">
                              <span className="italic truncate">{circle.type}</span>
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                              <MapPin size={12} className="text-rose-500 shrink-0" />
                              <span className="truncate">
                                {tLocal('createdBy')}{' '}
                                <span className="font-bold text-gray-600 dark:text-gray-300">{circle.creatorName}</span>{' '}
                                ({circle.creatorCountry})
                              </span>
                            </p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setIsCollectiveModalOpen(false);
                              navigate('/tools/halaqat', { state: { autoJoinId: circle.id } });
                            }}
                            className="shrink-0 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 cursor-pointer"
                          >
                            <Users size={12} />
                            {tLocal('joinBtn')}
                          </button>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-gray-500 dark:text-gray-400">
                              {Number(circle.count).toLocaleString()} / {Number(circle.target).toLocaleString()}
                            </span>
                            <span className="text-rose-500 dark:text-rose-400">{progressPercent}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-750 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-rose-500 via-purple-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/80 backdrop-blur-md flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsCollectiveModalOpen(false);
                    navigate('/tools/halaqat');
                  }}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Users size={14} />
                  {tLocal('createCircle')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCollectiveModalOpen(false)}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-750 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                >
                  {tLocal('closeBtn')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
