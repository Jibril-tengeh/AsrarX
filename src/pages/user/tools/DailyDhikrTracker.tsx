import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Plus, Trash2, CheckCircle2, RotateCcw, Bell, Send, Check, AlertCircle, RefreshCw, Cloud } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { app, auth, db } from '../../../lib/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { collection, query, where, onSnapshot, setDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

interface DhikrGoal {
  id: string;
  name: string;
  target: number;
  progress: number;
  lastUpdated: string;
}

export const DailyDhikrTracker: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [goals, setGoals] = useState<DhikrGoal[]>([]);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'local'>('local');
  const [newDhikrName, setNewDhikrName] = useState('');
  const [newDhikrTarget, setNewDhikrTarget] = useState<number | ''>('');

  // FCM States
  const [pushStatus, setPushStatus] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );
  const [fcmToken, setFcmToken] = useState(() => localStorage.getItem('asrar_fcm_token') || '');
  const [registering, setRegistering] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);
  const [testError, setTestError] = useState('');

  // Automatically attempt to retrieve/refresh token if permission is already granted and token isn't stored
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted' && !fcmToken) {
      registerPushNotifications();
    }
  }, []);

  const registerPushNotifications = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setTestError("Les notifications push ne sont pas supportées par ce navigateur.");
      return;
    }

    setRegistering(true);
    setTestError('');
    try {
      const permission = await Notification.requestPermission();
      setPushStatus(permission);

      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        const { getMessaging, getToken } = await import('firebase/messaging');
        const messaging = getMessaging(app);

        const token = await getToken(messaging, {
          serviceWorkerRegistration: registration,
          vapidKey: 'BD2p3w8B9U96b58-eGg55-C1IeD8T6xR_6T6eW7B3vN7H0V1I5-W4T1E9F1U9Y8I_3K9N8T8-E6V6V6T6B9D5V0'
        });

        if (token) {
          setFcmToken(token);
          localStorage.setItem('asrar_fcm_token', token);

          if (auth.currentUser) {
            const { doc, updateDoc } = await import('firebase/firestore');
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
              fcmToken: token,
              fcmTokenUpdatedAt: new Date()
            }).catch(console.error);
          }
        } else {
          setTestError("Aucun jeton d'enregistrement FCM reçu.");
        }
      }
    } catch (err: any) {
      console.error('Error setting up FCM client:', err);
      setTestError(err.message || String(err));
    } finally {
      setRegistering(false);
    }
  };

  const sendTestNotification = async () => {
    if (!fcmToken) return;
    setSendingTest(true);
    setTestSuccess(null);
    setTestError('');

    try {
      const response = await fetch('/api/send-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: [fcmToken],
          title: language === 'fr' ? 'Rappel AsrarHub 🌟' : language === 'ha' ? 'Tunasarwa AsrarHub 🌟' : 'AsrarHub Reminder 🌟',
          body: language === 'fr' ? 'C\'est l\'heure de réciter votre wird et de méditer !' : language === 'ha' ? 'Lokaci ya yi da zaka yi zikirinka!' : 'It\'s time to recite your wird and meditate!',
          data: { url: '/tools/daily-dhikr' }
        })
      });

      const data = await response.json();
      if (data.success && data.successCount > 0) {
        setTestSuccess(true);
      } else {
        setTestSuccess(false);
        setTestError(data.error || "L'envoi a échoué. Le jeton est peut-être expiré.");
      }
    } catch (err: any) {
      setTestSuccess(false);
      setTestError(err.message || String(err));
    } finally {
      setSendingTest(false);
    }
  };

  useEffect(() => {
    // 1. Load from local cache first
    const saved = localStorage.getItem('asrar_dhikr_tracker');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Check for new day and reset if needed
          const today = new Date().toDateString();
          const updated = parsed.map(goal => {
            const goalDate = new Date(goal.lastUpdated).toDateString();
            if (goalDate !== today) {
              return { ...goal, progress: 0, lastUpdated: new Date().toISOString() };
            }
            return goal;
          });
          setGoals(updated);
        }
      } catch (e) {
        console.error('Error parsing local dhikr tracker data:', e);
      }
    }

    if (!user) {
      setSyncStatus('local');
      return;
    }

    // 2. Subscribe to Firestore goals
    setSyncStatus('syncing');
    const q = query(collection(db, 'dhikr_goals'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fbGoals: DhikrGoal[] = [];
      const today = new Date().toDateString();

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let progress = data.progress || 0;
        let lastUpdated = data.lastUpdated || new Date().toISOString();

        // Check for new day reset
        const goalDate = new Date(lastUpdated).toDateString();
        if (goalDate !== today) {
          progress = 0;
          lastUpdated = new Date().toISOString();
          // Update in background
          setDoc(doc(db, 'dhikr_goals', docSnap.id), { ...data, progress, lastUpdated }, { merge: true }).catch(console.error);
        }

        fbGoals.push({
          id: docSnap.id,
          name: data.name || '',
          target: data.target || 100,
          progress,
          lastUpdated
        });
      });

      setGoals(fbGoals);
      localStorage.setItem('asrar_dhikr_tracker', JSON.stringify(fbGoals));
      setSyncStatus('synced');
    }, (error) => {
      console.error("Error loading dhikr goals from cloud:", error);
      setSyncStatus('local');
    });

    return () => unsubscribe();
  }, [user]);

  const addGoal = async () => {
    if (!newDhikrName.trim() || !newDhikrTarget || newDhikrTarget <= 0) return;

    const goalId = Date.now().toString();
    const newGoal: DhikrGoal = {
      id: goalId,
      name: newDhikrName.trim(),
      target: Number(newDhikrTarget),
      progress: 0,
      lastUpdated: new Date().toISOString()
    };

    if (user) {
      setSyncStatus('syncing');
      try {
        await setDoc(doc(db, 'dhikr_goals', goalId), {
          ...newGoal,
          userId: user.uid
        });
        setSyncStatus('synced');
      } catch (e) {
        console.error("Error saving dhikr goal to cloud:", e);
        setSyncStatus('local');
      }
    } else {
      const updated = [...goals, newGoal];
      setGoals(updated);
      localStorage.setItem('asrar_dhikr_tracker', JSON.stringify(updated));
    }

    setNewDhikrName('');
    setNewDhikrTarget('');
  };

  const updateProgress = async (id: string, amount: number) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        const newProgress = Math.min(g.progress + amount, g.target);
        return { ...g, progress: newProgress, lastUpdated: new Date().toISOString() };
      }
      return g;
    });

    // Optimistically update local state
    setGoals(updated);
    localStorage.setItem('asrar_dhikr_tracker', JSON.stringify(updated));

    if (user) {
      setSyncStatus('syncing');
      try {
        const targetGoal = updated.find(g => g.id === id);
        if (targetGoal) {
          await setDoc(doc(db, 'dhikr_goals', id), {
            ...targetGoal,
            userId: user.uid
          }, { merge: true });
        }
        setSyncStatus('synced');
      } catch (e) {
        console.error("Error updating progress in cloud:", e);
        setSyncStatus('local');
      }
    }
  };

  const resetProgress = async (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        return { ...g, progress: 0, lastUpdated: new Date().toISOString() };
      }
      return g;
    });

    setGoals(updated);
    localStorage.setItem('asrar_dhikr_tracker', JSON.stringify(updated));

    if (user) {
      setSyncStatus('syncing');
      try {
        const targetGoal = updated.find(g => g.id === id);
        if (targetGoal) {
          await setDoc(doc(db, 'dhikr_goals', id), {
            ...targetGoal,
            userId: user.uid
          }, { merge: true });
        }
        setSyncStatus('synced');
      } catch (e) {
        console.error("Error resetting progress in cloud:", e);
        setSyncStatus('local');
      }
    }
  };

  const deleteGoal = async (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    localStorage.setItem('asrar_dhikr_tracker', JSON.stringify(updated));

    if (user) {
      setSyncStatus('syncing');
      try {
        await deleteDoc(doc(db, 'dhikr_goals', id));
        setSyncStatus('synced');
      } catch (e) {
        console.error("Error deleting dhikr goal from cloud:", e);
        setSyncStatus('local');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <Target size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Dhikr Tracker</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Définissez et suivez vos objectifs quotidiens de Dhikr</p>
            
            {/* Sync Status Badge */}
            {syncStatus === 'synced' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-100/30 dark:border-emerald-800/30">
                <CheckCircle2 size={12} />
                {t('sync.synced', 'Sauvegardé sur le Cloud')}
              </span>
            )}
            {syncStatus === 'syncing' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-100/30 dark:border-amber-800/30 font-medium">
                <RefreshCw size={12} className="animate-spin animate-duration-1000" />
                {t('sync.syncing', 'Synchronisation...')}
              </span>
            )}
            {syncStatus === 'local' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                <Cloud size={12} className="text-gray-400" />
                {user ? t('sync.cached', 'Cache local') : t('sync.localOnly', 'Cache local uniquement (Connexion requise)')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ajouter un objectif</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Nom du Dhikr (ex: Istighfar)"
            value={newDhikrName}
            onChange={(e) => setNewDhikrName(e.target.value)}
            className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="number"
            placeholder="Objectif (ex: 100)"
            value={newDhikrTarget}
            onChange={(e) => setNewDhikrTarget(e.target.value ? Number(e.target.value) : '')}
            className="w-full sm:w-32 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            min="1"
          />
          <button
            onClick={addGoal}
            disabled={!newDhikrName.trim() || !newDhikrTarget}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={18} /> Ajouter
          </button>
        </div>
      </div>

      {/* Push Notifications & Zikr Reminders Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <div className="flex flex-row items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {language === 'fr' ? 'Rappels de Zikr (Push)' : language === 'ha' ? 'Tunasarwar Zikiri' : 'Zikr Reminders (Push)'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'fr' 
                  ? 'Recevez des notifications personnalisées pour vos objectifs de prières' 
                  : language === 'ha' ? 'Sami sanarwa ta waya don tunatar da kai lokacin zikiri' : 'Receive custom push notifications to stay on track'}
              </p>
            </div>
          </div>

          <span className={`shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${
            pushStatus === 'granted' 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' 
              : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
          }`}>
            {pushStatus === 'granted' ? 'Active' : 'Inactif'}
          </span>
        </div>

        {pushStatus !== 'granted' ? (
          <div className="bg-gray-50 dark:bg-gray-900/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {language === 'fr' 
                ? 'Pour recevoir des rappels quotidiens personnalisés, vous devez autoriser les notifications sur votre navigateur.' 
                : language === 'ha' ? 'Kuna buƙatar ba da izini don karɓar tunatarwa akan wannan wayar.' : 'To receive personalized daily reminders, you must allow notifications in your browser.'}
            </p>
            <button
              onClick={registerPushNotifications}
              disabled={registering}
              className="mx-auto bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              {registering ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  {language === 'fr' ? 'Configuration...' : 'Configuring...'}
                </>
              ) : (
                <>
                  <Bell size={14} />
                  {language === 'fr' ? 'Activer les notifications push' : 'Enable push notifications'}
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50/50 dark:bg-emerald-950/10 p-4 rounded-2xl border border-emerald-100/30 dark:border-emerald-900/10 flex items-center gap-3">
              <Check className="text-emerald-500 shrink-0" size={18} />
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                {language === 'fr' 
                  ? 'Notifications push configurées avec succès sur cet appareil !' 
                  : language === 'ha' ? 'An kunna sanarwa lafiya lau akan wannan na\'ura!' : 'Push notifications are successfully configured on this device!'}
              </p>
            </div>

            {/* Test push button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-850">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  {language === 'fr' ? 'Tester les notifications' : 'Test notifications'}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {language === 'fr' 
                    ? 'Envoyez instantanément un rappel push de test sur cet appareil.' 
                    : 'Instantly dispatch a test reminder push to this active device.'}
                </p>
              </div>

              <button
                onClick={sendTestNotification}
                disabled={sendingTest || !fcmToken}
                className="shrink-0 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {sendingTest ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    {language === 'fr' ? 'Envoi...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    {language === 'fr' ? 'Envoyer un test' : 'Send test push'}
                  </>
                )}
              </button>
            </div>

            {/* Token display */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {language === 'fr' ? 'Jeton d\'enregistrement FCM (Debug)' : 'FCM Registration Token'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={fcmToken}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full bg-gray-50 dark:bg-gray-900/60 border border-gray-150 dark:border-gray-800 rounded-xl px-3 py-2 text-[10px] font-mono text-gray-500 dark:text-gray-400 outline-none select-all"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(fcmToken);
                    alert(language === 'fr' ? 'Jeton copié !' : 'Token copied!');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline px-1 py-0.5 rounded"
                >
                  Copier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Messages */}
        {testSuccess === true && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2">
            <Check size={14} />
            {language === 'fr' 
              ? 'Notification de test envoyée avec succès ! Regardez l\'écran de votre appareil.' 
              : 'Test notification sent successfully! Check your device screen.'}
          </div>
        )}

        {testError && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle size={14} />
            <span className="break-all">{testError}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Aucun objectif défini. Ajoutez-en un ci-dessus.</p>
          </div>
        ) : (
          goals.map(goal => {
            const isCompleted = goal.progress >= goal.target;
            const percentage = Math.min(100, Math.round((goal.progress / goal.target) * 100));

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{goal.name}</h3>
                      {isCompleted && <CheckCircle2 size={18} className="text-emerald-500" />}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Objectif : <span className="font-semibold">{goal.target}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => updateProgress(goal.id, 1)}
                      disabled={isCompleted}
                      className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-lg disabled:opacity-50 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, 10)}
                      disabled={isCompleted}
                      className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm disabled:opacity-50 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, 33)}
                      disabled={isCompleted}
                      className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm disabled:opacity-50 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      +33
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, 100)}
                      disabled={isCompleted}
                      className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm disabled:opacity-50 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors hidden sm:flex"
                    >
                      +100
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">
                    <span>Progrès : {goal.progress} / {goal.target}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-emerald-400'} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                  <button
                    onClick={() => resetProgress(goal.id)}
                    className="p-2 text-gray-400 hover:text-amber-500 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    title="Réinitialiser le progrès"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    title="Supprimer l'objectif"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
