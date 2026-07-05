import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db, isAutoSaveEnabled } from '../lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
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
  ChevronUp
} from 'lucide-react';

interface DailyGoal {
  id: string;
  text: string;
  completed: boolean;
}

const DEFAULT_GOALS: DailyGoal[] = [];

export const DailyGoalsTracker: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'local'>('local');
  const [newGoalText, setNewGoalText] = useState('');
  const [lastReset, setLastReset] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

        <div className="flex items-center gap-2 shrink-0">
          {!isExpanded && total > 0 && (
            <div className="w-16 bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden hidden sm:block">
              <div 
                className="bg-emerald-500 h-full rounded-full" 
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}
          {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
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
    </div>
  );
};
